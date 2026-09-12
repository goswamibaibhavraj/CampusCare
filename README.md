# 🏥 CampusCare — LPU Student Healthcare Portal

[![GitHub Pages Deployment](https://img.shields.io/badge/deployment-GitHub%20Pages-blue?logo=github)](https://pages.github.com/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-ffca28?logo=firebase&logoColor=black)](https://firebase.google.com/)

> **CampusCare** is a dedicated student healthcare and medical support platform for Lovely Professional University (LPU). It centralizes campus doctor appointments at Uni-Health Centre (Block 32), live virtual telehealth consultations, official digital prescriptions, daily medicine timetable routines, campus first-aid navigation, and 24x7 emergency medical SOS.

---

## 🌟 Key Features

### 🔐 1. Firebase Authentication & Profiles
- **Email & Password Authentication**: Full sign-in and account registration powered by Firebase Auth (`campus-care-cdcd0`).
- **Student Profile Management**: Manage student registration numbers, blood group, hostel block, room number, and emergency contacts.
- **1-Click Quick Demo Access**: Instant student preview mode for evaluation without manual signup.

### 👨‍⚕️ 2. Doctor Directory & In-Person Appointments
- Browse campus physicians across General Medicine, Sports Medicine, Dermatology, Ophthalmology, Psychiatry, and Dental departments.
- Check real-time OPD hours at Uni-Health Centre (Block 32).
- Instant slot booking with confirmation tokens and calendar integration.

### 📹 3. Virtual Telehealth Consultation Room
- Interactive video consultation simulator with live audio/video toggles.
- Real-time in-consultation chat box with the attending campus doctor.
- In-call clinical notes and instant prescription dispatch.

### 💊 4. Digital Prescriptions & Routine Manager
- Official verified digital prescriptions with university doctor signatures, diagnosis, vitals, and dosage schedules.
- One-click print / PDF export for Uni-Mall (Block 13) pharmacy dispensing.
- Student timetable-integrated medication schedule divided into **Morning**, **Afternoon**, **Evening**, and **Night** with dose adherence counters and streaks.

### 🗺️ 5. Interactive Campus Health & Emergency Map
- Visual map pinpointing key healthcare facilities:
  - **Uni-Health Centre** (Block 32)
  - **Uni-Mall 24/7 Pharmacy** (Block 13)
  - **Main Gate Ambulance Bay**
  - **Hostel Emergency First-Aid Kiosks** (BH-1 to BH-7, GH-1 to GH-3)
- Instant turn-by-turn campus directions and ambulance dispatch buttons.

### 🤖 6. CampusCare AI Health Assistant
- Instant answers for campus medical timings, minor symptom triage, first-aid tips, and portal shortcuts.

### 🚨 7. 24x7 SOS Emergency Dispatch
- One-tap emergency trigger to alert the campus ambulance unit and notify registered emergency contacts with real-time location.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Auth**: [Firebase v12](https://firebase.google.com/) (Auth + Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn` or `pnpm`

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/campus-care.git
cd campus-care
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output in the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages

This repository is pre-configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) and relative base paths (`base: './'`).

### Steps to activate GitHub Pages:
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CampusCare LPU Portal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/campus-care.git
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. GitHub will automatically trigger the workflow and deploy the portal to:
   ```
   https://<your-username>.github.io/campus-care/
   ```

---

## 📁 Project Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/                     # Static public assets
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI components (Toast, SOS Modal)
│   │   ├── layout/             # Top Navbar, Sidebar navigation
│   │   └── pages/              # Main application pages
│   │       ├── DashboardPage.tsx
│   │       ├── DoctorsPage.tsx
│   │       ├── ConsultationPage.tsx
│   │       ├── PrescriptionsPage.tsx
│   │       ├── RoutinePage.tsx
│   │       ├── HealthMapPage.tsx
│   │       ├── WellbeingPage.tsx
│   │       ├── AssistantPage.tsx
│   │       └── LoginPage.tsx
│   ├── context/
│   │   └── AppContext.tsx      # Global state, Firebase sync & routines
│   ├── data/
│   │   └── initialData.ts      # Campus doctors, facilities, and initial demo data
│   ├── lib/
│   │   └── firebase.ts         # Firebase initialization & auth configuration
│   ├── types.ts                # TypeScript domain models & interfaces
│   ├── App.tsx                 # Core app shell & page router
│   ├── main.tsx                # React entry point
│   └── index.css               # Global Tailwind CSS imports
├── firebase-blueprint.json     # Firestore collection schema definition
├── firestore.rules             # Secure Firestore access rules
├── vite.config.ts              # Vite config with relative base path
├── package.json                # Project scripts & dependencies
└── README.md                   # Documentation
```

---

## 🔒 Firebase Configuration

The app is linked with Firebase project `campus-care-cdcd0`. If you wish to use your own Firebase project:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** > **Sign-in method** > **Email/Password**.
3. Replace the config credentials in `src/lib/firebase.ts`.

---

## 📄 License
This project is built for educational & campus healthcare enablement at Lovely Professional University.
Distributed under the MIT License.
