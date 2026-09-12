import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  PageId,
  Doctor,
  Appointment,
  DigitalPrescription,
  RoutineMedicineItem,
  StudentProfile,
  ChatMessage,
  NotificationItem,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ROUTINE,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  // Authentication & Profile
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  firebaseUser: FirebaseUser | null;
  studentProfile: StudentProfile;
  login: (regNoOrEmail: string, password?: string) => Promise<boolean> | boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (
    email: string,
    password: string,
    name: string,
    registrationNo?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void | Promise<void>;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;

  // Navigation
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Doctors
  doctors: Doctor[];
  selectedDoctorProfile: Doctor | null;
  setSelectedDoctorProfile: (doc: Doctor | null) => void;

  // Booking & Appointments
  appointments: Appointment[];
  isBookingModalOpen: boolean;
  selectedDoctorForBooking: Doctor | null;
  openBookingModal: (doctor?: Doctor) => void;
  closeBookingModal: () => void;
  bookAppointment: (details: {
    doctorId: string;
    date: string;
    timeSlot: string;
    consultationMode: 'Online' | 'Offline';
    reason: string;
  }) => Appointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  // Virtual Consultation
  activeConsultationAppointment: Appointment | null;
  consultationStatus: 'idle' | 'connected' | 'ended';
  consultationMessages: ChatMessage[];
  startConsultation: (appointmentId: string) => void;
  sendConsultationMessage: (text: string) => void;
  endConsultationAndIssuePrescription: () => DigitalPrescription;
  leaveConsultation: () => void;

  // Digital Prescriptions
  prescriptions: DigitalPrescription[];
  currentPrescription: DigitalPrescription | null;
  setCurrentPrescription: (rx: DigitalPrescription | null) => void;
  addPrescriptionToRoutine: (prescriptionId: string) => void;

  // Medical Routine
  routineItems: RoutineMedicineItem[];
  toggleMedicineTaken: (id: string) => void;
  todayCompletedCount: number;
  todayTotalCount: number;

  // CampusCare Assistant
  assistantMessages: ChatMessage[];
  sendAssistantMessage: (text: string) => void;
  clearAssistantChat: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Modals & Popups
  isEmergencyModalOpen: boolean;
  openEmergencyModal: () => void;
  closeEmergencyModal: () => void;

  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (
    title: string,
    message?: string,
    type?: 'success' | 'info' | 'warning' | 'error'
  ) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'campuscare_v2_';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Failed to load from storage:', key, e);
    return fallback;
  }
}

function saveStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage:', key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadStored('auth_state', true)
  );
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() =>
    loadStored('student_profile', INITIAL_STUDENT_PROFILE)
  );

  // Navigation
  const [currentPage, setCurrentPageState] = useState<PageId>(() =>
    loadStored('current_page', 'dashboard')
  );
  const [globalSearch, setGlobalSearch] = useState('');

  // Doctors & Modals
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<Doctor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadStored('appointments', INITIAL_APPOINTMENTS)
  );

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<DigitalPrescription[]>(() =>
    loadStored('prescriptions', INITIAL_PRESCRIPTIONS)
  );
  const [currentPrescription, setCurrentPrescription] = useState<DigitalPrescription | null>(() =>
    INITIAL_PRESCRIPTIONS[0] || null
  );

  // Medical Routine
  const [routineItems, setRoutineItems] = useState<RoutineMedicineItem[]>(() =>
    loadStored('routine_items', INITIAL_ROUTINE)
  );

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadStored('notifications', INITIAL_NOTIFICATIONS)
  );

  // Consultation State
  const [activeConsultationAppointment, setActiveConsultationAppointment] =
    useState<Appointment | null>(null);
  const [consultationStatus, setConsultationStatus] = useState<'idle' | 'connected' | 'ended'>(
    'idle'
  );
  const [consultationMessages, setConsultationMessages] = useState<ChatMessage[]>([
    {
      id: 'cm-init-1',
      sender: 'doctor',
      senderName: 'Dr. Sunita Mehra',
      text: 'Good afternoon Baibhav. I am reviewing your notes regarding your mild fever and sore throat. How are you feeling right now?',
      timestamp: '04:01 PM',
    },
  ]);

  // Assistant Chat
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([
    {
      id: 'ast-1',
      sender: 'assistant',
      senderName: 'CampusCare Navigator',
      text: 'Hello Baibhav! I am your LPU CampusCare Assistant. How can I help you today? You can ask me to find a doctor, show appointments, locate campus health centres, or check your medicines.',
      timestamp: 'Just now',
    },
  ]);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync to storage
  useEffect(() => {
    saveStored('auth_state', isAuthenticated);
  }, [isAuthenticated]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setStudentProfile((prev) => ({
              ...prev,
              name: data.name || user.displayName || prev.name,
              email: user.email || prev.email,
              registrationNo: data.registrationNo || prev.registrationNo,
            }));
          } else if (user.displayName || user.email) {
            setStudentProfile((prev) => ({
              ...prev,
              name: user.displayName || prev.name,
              email: user.email || prev.email,
            }));
          }
        } catch (e) {
          console.warn('Firestore user fetch:', e);
          if (user.displayName || user.email) {
            setStudentProfile((prev) => ({
              ...prev,
              name: user.displayName || prev.name,
              email: user.email || prev.email,
            }));
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    saveStored('student_profile', studentProfile);
  }, [studentProfile]);

  useEffect(() => {
    saveStored('appointments', appointments);
  }, [appointments]);

  useEffect(() => {
    saveStored('prescriptions', prescriptions);
  }, [prescriptions]);

  useEffect(() => {
    saveStored('routine_items', routineItems);
  }, [routineItems]);

  useEffect(() => {
    saveStored('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveStored('current_page', currentPage);
  }, [currentPage]);

  const setCurrentPage = (page: PageId) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsAuthLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      setFirebaseUser(user);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStudentProfile((prev) => ({
            ...prev,
            name: data.name || user.displayName || prev.name,
            email: user.email || prev.email,
            registrationNo: data.registrationNo || prev.registrationNo,
          }));
        } else if (user.displayName || user.email) {
          setStudentProfile((prev) => ({
            ...prev,
            name: user.displayName || prev.name,
            email: user.email || prev.email,
          }));
        }
      } catch (err) {
        console.warn('Could not read user profile from Firestore:', err);
      }

      showToast('Welcome back!', `Signed in as ${user.displayName || user.email}`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Firebase sign in error:', err);
      let errorMsg = 'Invalid email or password.';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        errorMsg = 'Invalid email or password. Please verify credentials or create an account.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg =
          'Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      showToast('Sign In Failed', errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    name: string,
    registrationNo?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      if (name.trim()) {
        try {
          await updateProfile(user, { displayName: name.trim() });
        } catch (e) {
          console.warn('Failed to update displayName:', e);
        }
      }

      const regNo =
        registrationNo?.trim() ||
        studentProfile.registrationNo ||
        '1220' + Math.floor(1000 + Math.random() * 9000);

      const updatedProfile: StudentProfile = {
        ...studentProfile,
        name: name.trim() || studentProfile.name,
        email: email.trim(),
        registrationNo: regNo,
      };

      setStudentProfile(updatedProfile);
      setFirebaseUser(user);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');

      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            email: email.trim(),
            name: name.trim() || studentProfile.name,
            registrationNo: regNo,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Could not store student profile in Firestore:', err);
      }

      showToast('Account Created!', `Welcome to CampusCare, ${name.trim() || 'Student'}!`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Firebase registration error:', err);
      let errorMsg = 'Failed to register account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please sign in or use another email.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg =
          'Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      showToast('Registration Error', errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async (regNoOrEmail: string, password?: string): Promise<boolean> => {
    if (!regNoOrEmail.trim()) {
      showToast('Login Failed', 'Please enter your Registration No or Email', 'error');
      return false;
    }

    if (regNoOrEmail.includes('@') && password && password !== '••••••••') {
      const res = await loginWithEmail(regNoOrEmail, password);
      return res.success;
    }

    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    showToast('Welcome back, Baibhav!', 'Logged into CampusCare LPU Student Portal', 'success');
    return true;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
    setFirebaseUser(null);
    setIsAuthenticated(false);
    setActiveConsultationAppointment(null);
    setConsultationStatus('idle');
    localStorage.removeItem(STORAGE_PREFIX + 'auth_state');
    showToast('Signed Out', 'You have been safely signed out of CampusCare.', 'info');
  };

  const updateStudentProfile = (partial: Partial<StudentProfile>) => {
    setStudentProfile((prev) => {
      const updated = { ...prev, ...partial };
      return updated;
    });
    showToast('Profile Updated', 'Student profile details saved successfully.', 'success');
  };

  const openBookingModal = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctorForBooking(doctor);
    } else {
      setSelectedDoctorForBooking(doctors[0]);
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctorForBooking(null);
  };

  const bookAppointment = (details: {
    doctorId: string;
    date: string;
    timeSlot: string;
    consultationMode: 'Online' | 'Offline';
    reason: string;
  }): Appointment => {
    const doctor = doctors.find((d) => d.id === details.doctorId) || doctors[0];
    const newId = `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: newId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorAvatar: doctor.avatar,
      date: details.date,
      timeSlot: details.timeSlot,
      consultationMode: details.consultationMode,
      reason: details.reason || 'General health consultation',
      status: 'Confirmed',
      cabinLocation:
        details.consultationMode === 'Online'
          ? 'Virtual Telehealth Room #1'
          : doctor.cabinLocation,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Add a notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Appointment Confirmed',
      message: `Confirmed with ${doctor.name} on ${details.date} at ${details.timeSlot}`,
      timestamp: 'Just now',
      read: false,
      type: 'appointment',
      actionPage: 'appointments',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      'Appointment Confirmed!',
      `Booked with ${doctor.name} for ${details.date} (${details.timeSlot})`,
      'success'
    );

    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'Cancelled' } : apt))
    );
    showToast('Appointment Cancelled', 'The scheduled consultation was cancelled.', 'warning');
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, date: newDate, timeSlot: newTime, status: 'Confirmed' } : apt
      )
    );
    showToast('Appointment Rescheduled', `Updated to ${newDate} at ${newTime}`, 'success');
  };

  // Virtual Consultation Flow
  const startConsultation = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId) || appointments[0];
    setActiveConsultationAppointment(apt);
    setConsultationStatus('connected');
    setCurrentPage('consultation');
    showToast(
      'Joined Telehealth Consultation',
      `Connected with ${apt?.doctorName || 'Doctor'} in secure room`,
      'info'
    );
  };

  const sendConsultationMessage = (text: string) => {
    if (!text.trim()) return;
    const msgId = 'cm-' + Date.now();
    const newMsg: ChatMessage = {
      id: msgId,
      sender: 'student',
      senderName: studentProfile.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConsultationMessages((prev) => [...prev, newMsg]);

    // Realistic Doctor Demo reply
    setTimeout(() => {
      const replies = [
        'I see. Let me make a note of that. Please take deep breaths and keep hydrated.',
        'Got it. The vitals look stable. I am prescribing an antipyretic along with an anti-allergic to settle the congestion.',
        'Make sure to rest for the next 48 hours and avoid cold drinks from the food courts.',
        'Understood. I will also add a Vitamin C supplement to your routine to accelerate recovery.',
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      setConsultationMessages((prev) => [
        ...prev,
        {
          id: 'cm-reply-' + Date.now(),
          sender: 'doctor',
          senderName: activeConsultationAppointment?.doctorName || 'Dr. Sunita Mehra',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const leaveConsultation = () => {
    setConsultationStatus('ended');
    showToast('Consultation Paused', 'You left the virtual room.', 'info');
  };

  const endConsultationAndIssuePrescription = (): DigitalPrescription => {
    const doctorName = activeConsultationAppointment?.doctorName || 'Dr. Sunita Mehra';
    const doctor =
      doctors.find((d) => d.name === doctorName) ||
      doctors.find((d) => d.id === 'doc-sunita-mehra') ||
      doctors[0];

    const rxId = `CC-RX-${Math.floor(100 + Math.random() * 900)}`;

    const newPrescription: DigitalPrescription = {
      id: rxId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorQualification: doctor.qualification,
      doctorSignatureVerified: true,
      appointmentId: activeConsultationAppointment?.id || 'APT-ONLINE-01',
      patientName: studentProfile.name,
      patientRegNo: studentProfile.registrationNo,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      diagnosis: 'Acute Upper Respiratory Tract Congestion & Viral Fatigue',
      symptoms: 'Mild fever, running nose, throat discomfort, body fatigue.',
      vitals: {
        bp: '118/78 mmHg',
        pulse: '74 bpm',
        temperature: '98.4°F',
        spo2: '99%',
        weight: '68 kg',
      },
      medicines: [
        {
          id: 'med-pcm-' + Date.now(),
          name: 'Paracetamol 650 mg',
          dosage: '1 Tablet',
          frequency: 'After lunch & dinner (when needed for fever)',
          timeOfDay: 'Afternoon',
          timeSlotFormatted: '02:00 PM',
          duration: '3 days',
          instructions: 'Take with warm water after food.',
          category: 'Antipyretic / Analgesic',
        },
        {
          id: 'med-cet-' + Date.now(),
          name: 'Cetirizine 10 mg',
          dosage: '1 Tablet',
          frequency: 'Once daily before sleep',
          timeOfDay: 'Night',
          timeSlotFormatted: '09:30 PM',
          duration: '5 days',
          instructions: 'Take at night before sleep. Avoid driving.',
          category: 'Antihistamine',
        },
        {
          id: 'med-vitc-' + Date.now(),
          name: 'Vitamin C 500 mg',
          dosage: '1 Chewable Tablet',
          frequency: 'Once daily in the morning',
          timeOfDay: 'Morning',
          timeSlotFormatted: '08:30 AM',
          duration: '15 days',
          instructions: 'Chew after breakfast for immune defense.',
          category: 'Nutritional Supplement',
        },
      ],
      doctorNotes:
        'Patient responded well during telehealth evaluation. Advised warm saline gargles twice daily and adequate hydration (3-4 litres daily).',
      followUpAdvice:
        'Follow-up in 4 days if symptoms do not improve. Uni-Health Centre emergency is open 24x7 in Block 32.',
    };

    // 1. Mark active appointment Completed
    if (activeConsultationAppointment) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === activeConsultationAppointment.id
            ? { ...apt, status: 'Completed', prescriptionId: rxId }
            : apt
        )
      );
    }

    // 2. Add prescription
    setPrescriptions((prev) => [newPrescription, ...prev]);
    setCurrentPrescription(newPrescription);

    // 3. Add medicines to Medical Routine automatically
    const newRoutineItems: RoutineMedicineItem[] = newPrescription.medicines.map((med, idx) => ({
      id: `rot-gen-${Date.now()}-${idx}`,
      medicineName: med.name,
      dosage: med.dosage,
      timeSlot: med.timeSlotFormatted,
      timeOfDay: med.timeOfDay,
      dayOfWeek: 'Monday',
      instructions: med.instructions,
      prescriptionSource: `${doctor.name} (${rxId})`,
      taken: false,
    }));

    setRoutineItems((prev) => {
      // avoid exact duplicates by medicineName & timeSlot
      const filtered = prev.filter(
        (p) => !newRoutineItems.some((n) => n.medicineName === p.medicineName && n.timeSlot === p.timeSlot)
      );
      return [...filtered, ...newRoutineItems];
    });

    // 4. Update consultation state
    setConsultationStatus('ended');

    // 5. Add notification
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'New Digital Prescription',
        message: `Dr. ${doctor.name} issued prescription ${rxId}. Medicines added to routine.`,
        timestamp: 'Just now',
        read: false,
        type: 'prescription',
        actionPage: 'prescription',
      },
      ...prev,
    ]);

    // 6. Navigate to Digital Prescription
    setCurrentPage('prescription');

    showToast(
      'Consultation Completed & Prescription Issued',
      `Prescription ${rxId} is verified and added to Medical Routine!`,
      'success'
    );

    return newPrescription;
  };

  const addPrescriptionToRoutine = (prescriptionId: string) => {
    const rx = prescriptions.find((p) => p.id === prescriptionId);
    if (!rx) return;

    const newRoutineItems: RoutineMedicineItem[] = rx.medicines.map((med, idx) => ({
      id: `rot-add-${Date.now()}-${idx}`,
      medicineName: med.name,
      dosage: med.dosage,
      timeSlot: med.timeSlotFormatted,
      timeOfDay: med.timeOfDay,
      dayOfWeek: 'Monday',
      instructions: med.instructions,
      prescriptionSource: `${rx.doctorName} (${rx.id})`,
      taken: false,
    }));

    setRoutineItems((prev) => {
      const filtered = prev.filter(
        (p) => !newRoutineItems.some((n) => n.medicineName === p.medicineName && n.timeSlot === p.timeSlot)
      );
      return [...filtered, ...newRoutineItems];
    });

    showToast(
      'Medicines Added to Routine',
      `Prescription medicines synced to your Medical Routine timetable.`,
      'success'
    );
  };

  const toggleMedicineTaken = (id: string) => {
    setRoutineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.taken;
          if (newStatus) {
            showToast(
              'Medicine Marked as Taken',
              `${item.medicineName} logged. Health streak updated!`,
              'success'
            );
            // Increment streak slightly if all taken
            setStudentProfile((sp) => ({
              ...sp,
              healthStreak: sp.healthStreak + 1,
            }));
          } else {
            showToast('Status Updated', `${item.medicineName} marked as upcoming`, 'info');
          }
          return {
            ...item,
            taken: newStatus,
            takenAt: newStatus
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return item;
      })
    );
  };

  const todayCompletedCount = routineItems.filter((i) => i.taken).length;
  const todayTotalCount = routineItems.length || 4;

  // CampusCare Assistant smart routing
  const sendAssistantMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: 'ast-u-' + Date.now(),
      sender: 'student',
      senderName: studentProfile.name,
      text,
      timestamp: 'Just now',
    };

    setAssistantMessages((prev) => [...prev, userMsg]);

    const lower = text.toLowerCase();
    let replyText =
      'I can help guide you around CampusCare and LPU healthcare facilities. What would you like to explore?';
    let suggestedAction: ChatMessage['suggestedAction'] = undefined;

    if (lower.includes('derma') || lower.includes('skin') || lower.includes('pimple') || lower.includes('rash')) {
      replyText =
        'We have specialist dermatologists Dr. Vikram Singh and Dr. Priya Kapoor at the Uni-Health Centre. You can view their profiles and schedule a consultation.';
      suggestedAction = {
        label: 'Find Dermatologist',
        page: 'find-doctor',
        filterParam: 'Dermatology',
      };
    } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
      replyText =
        'You can easily book an appointment with our campus doctors. Choose between General Physician, ENT, Dental, Psychology, and Nutrition specialists.';
      suggestedAction = {
        label: 'Book an Appointment',
        page: 'find-doctor',
      };
    } else if (
      lower.includes('uni-health') ||
      lower.includes('centre') ||
      lower.includes('where') ||
      lower.includes('location') ||
      lower.includes('map') ||
      lower.includes('hospital')
    ) {
      replyText =
        'The main LPU Uni-Health Centre is located at Central Academic Block 32 (Ground & 1st Floor). It operates 24x7 with emergency observation beds, ambulance bay, and pharmacy.';
      suggestedAction = {
        label: 'Open Campus Health Map',
        page: 'map',
      };
    } else if (lower.includes('my appointment') || lower.includes('show appointment') || lower.includes('status')) {
      replyText =
        'Here is your appointments management section where you can view upcoming visits, join telehealth sessions, or reschedule.';
      suggestedAction = {
        label: 'View My Appointments',
        page: 'appointments',
      };
    } else if (lower.includes('medicine') || lower.includes('routine') || lower.includes('schedule') || lower.includes('tablet')) {
      replyText =
        'Your personalized Medical Routine is structured like a student timetable (Morning, Afternoon, Evening, Night). You can mark medicines as taken directly from there.';
      suggestedAction = {
        label: 'Open Medical Routine',
        page: 'routine',
      };
    } else if (lower.includes('consultation') || lower.includes('video') || lower.includes('call') || lower.includes('telehealth')) {
      replyText =
        'You can join simulated virtual telehealth consultations directly from your booked appointments. Once finished, your doctor issues a verified digital prescription.';
      suggestedAction = {
        label: 'Open Virtual Consultation',
        page: 'consultation',
      };
    } else if (lower.includes('emergency') || lower.includes('sos') || lower.includes('ambulance') || lower.includes('urgent') || lower.includes('help')) {
      replyText =
        'For urgent medical emergencies on campus, call LPU Uni-Health Ambulance immediately at +91 1824 444108 or Campus Security at +91 1824 444100.';
      suggestedAction = {
        label: 'Trigger Emergency SOS',
        page: 'dashboard',
      };
      setIsEmergencyModalOpen(true);
    } else if (lower.includes('counsel') || lower.includes('mental') || lower.includes('stress') || lower.includes('anxiety')) {
      replyText =
        'The Student Counselling & Mental Wellness Centre at Block 30 offers 100% confidential support with Dr. Riya Khanna and resident counsellors.';
      suggestedAction = {
        label: 'View Counselling Services',
        page: 'find-doctor',
        filterParam: 'Psychology / Counselling',
      };
    } else if (lower.includes('prescription') || lower.includes('rx')) {
      replyText =
        'You have an active verified digital prescription CC-RX-001 by Dr. Sunita Mehra available for download or pharmacy fulfillment.';
      suggestedAction = {
        label: 'View Digital Prescription',
        page: 'prescription',
      };
    }

    setTimeout(() => {
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: 'ast-reply-' + Date.now(),
          sender: 'assistant',
          senderName: 'CampusCare Navigator',
          text: replyText,
          timestamp: 'Just now',
          suggestedAction,
        },
      ]);
    }, 600);
  };

  const clearAssistantChat = () => {
    setAssistantMessages([
      {
        id: 'ast-1',
        sender: 'assistant',
        senderName: 'CampusCare Navigator',
        text: 'Chat cleared. How can I help you with your campus healthcare today, Baibhav?',
        timestamp: 'Just now',
      },
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Marked Read', 'All notifications cleared.', 'info');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        firebaseUser,
        studentProfile,
        login,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateStudentProfile,

        currentPage,
        setCurrentPage,
        globalSearch,
        setGlobalSearch,

        doctors,
        selectedDoctorProfile,
        setSelectedDoctorProfile,

        appointments,
        isBookingModalOpen,
        selectedDoctorForBooking,
        openBookingModal,
        closeBookingModal,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,

        activeConsultationAppointment,
        consultationStatus,
        consultationMessages,
        startConsultation,
        sendConsultationMessage,
        endConsultationAndIssuePrescription,
        leaveConsultation,

        prescriptions,
        currentPrescription,
        setCurrentPrescription,
        addPrescriptionToRoutine,

        routineItems,
        toggleMedicineTaken,
        todayCompletedCount,
        todayTotalCount,

        assistantMessages,
        sendAssistantMessage,
        clearAssistantChat,

        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        isEmergencyModalOpen,
        openEmergencyModal: () => setIsEmergencyModalOpen(true),
        closeEmergencyModal: () => setIsEmergencyModalOpen(false),

        isProfileModalOpen,
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false),

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
