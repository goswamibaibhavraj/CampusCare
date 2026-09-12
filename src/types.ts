export type PageId =
  | 'dashboard'
  | 'find-doctor'
  | 'appointments'
  | 'consultation'
  | 'prescription'
  | 'routine'
  | 'medicines'
  | 'map'
  | 'assistant'
  | 'care-team'
  | 'wellbeing';

export type Specialization =
  | 'General Physician'
  | 'Dermatology'
  | 'ENT'
  | 'Dental'
  | 'Psychology / Counselling'
  | 'Nutrition';

export type ConsultationMode = 'Online' | 'Offline' | 'Both';

export interface Doctor {
  id: string;
  name: string;
  specialization: Specialization;
  avatar: string;
  experienceYears: number;
  consultationMode: ConsultationMode;
  isAvailableToday: boolean;
  rating: number;
  reviewCount: number;
  consultationFee: number; // in INR (Demo)
  cabinLocation: string; // e.g., "Uni-Health Centre, Room 204"
  qualification: string;
  about: string;
  languages: string[];
  availableSlots: string[];
}

export type AppointmentStatus = 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: Specialization;
  doctorAvatar: string;
  date: string; // YYYY-MM-DD or readable
  timeSlot: string;
  consultationMode: 'Online' | 'Offline';
  reason: string;
  status: AppointmentStatus;
  cabinLocation?: string;
  prescriptionId?: string;
  createdAt: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "1 Tablet after breakfast"
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  timeSlotFormatted: string; // e.g. "08:30 AM"
  duration: string; // e.g. "5 days"
  instructions: string;
  category: string;
}

export interface DigitalPrescription {
  id: string; // e.g. "CC-RX-001"
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorQualification: string;
  doctorSignatureVerified: boolean;
  appointmentId: string;
  patientName: string;
  patientRegNo: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  vitals: {
    bp: string;
    pulse: string;
    temperature: string;
    spo2: string;
    weight: string;
  };
  medicines: PrescriptionMedicine[];
  doctorNotes: string;
  followUpAdvice: string;
}

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type DayOfWeek =
  | 'Mon'
  | 'Tue'
  | 'Wed'
  | 'Thu'
  | 'Fri'
  | 'Sat'
  | 'Sun'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface RoutineItem {
  id: string;
  medicineName: string;
  dosage: string;
  timeSlot: TimeSlot | string;
  mealTiming?: string;
  instructions: string;
  day?: DayOfWeek | string;
  taken: boolean;
  takenAt?: string;
  prescriptionSource?: string;
}

export interface RoutineMedicineItem {
  id: string;
  medicineName: string;
  dosage: string;
  timeSlot: string; // e.g., "08:30 AM"
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  instructions: string;
  prescriptionSource: string;
  taken: boolean;
  takenAt?: string;
}

export interface StudentProfile {
  name: string;
  registrationNo: string;
  email: string;
  phone: string;
  program: string;
  yearSemester: string;
  campusHostel: string;
  roomNo: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  avatarUrl: string;
  healthStreak: number;
}

export type FacilityType = 'Clinic' | 'Hospital' | 'Pharmacy' | 'Counselling' | 'Emergency';

export interface HealthFacility {
  id: string;
  name: string;
  type: FacilityType | string;
  location: string;
  campusBlock: string;
  blockLocation?: string;
  coordinates: [number, number]; // lat, lng
  openingHours: string;
  timings?: string;
  availableServices: string[];
  services?: string[];
  contact: string;
  contactNo?: string;
  emergencyAvailable: boolean;
  description: string;
}

export interface MedicineInfo {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  commonUse: string;
  instructions: string;
  sideEffects: string[];
  storage: string;
  campusAvailability: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'doctor' | 'assistant' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    page: PageId;
    filterParam?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'appointment' | 'routine' | 'prescription' | 'info';
  actionPage?: PageId;
}
