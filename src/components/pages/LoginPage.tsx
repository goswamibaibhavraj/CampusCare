import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  ArrowRight,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    loginWithEmail,
    registerWithEmail,
    isAuthLoading,
    studentProfile,
    openEmergencyModal,
  } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'signin') {
        if (!email.trim()) {
          setErrorMessage('Please enter your email address.');
          setIsSubmitting(false);
          return;
        }
        if (!password) {
          setErrorMessage('Please enter your password.');
          setIsSubmitting(false);
          return;
        }

        // If email contains @, execute Firebase email/password sign-in
        if (email.includes('@')) {
          const res = await loginWithEmail(email, password);
          if (!res.success) {
            setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
          }
        } else {
          // Registration ID fallback login
          await login(email, password);
        }
      } else {
        // Sign Up / Register
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Please enter a valid student email address.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }
        if (!fullName.trim()) {
          setErrorMessage('Please provide your full name.');
          setIsSubmitting(false);
          return;
        }

        const res = await registerWithEmail(
          email.trim(),
          password,
          fullName.trim(),
          regNo.trim() || undefined
        );

        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create student account.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoStudentLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    await login('123456789', 'CampusCare@2026');
    setIsSubmitting(false);
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen bg-slate-50 flex flex-col justify-between"
    >
      {/* Top Banner */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Campus<span className="text-blue-600">Care</span>
            </span>
            <span className="text-xs text-slate-500 ml-2 hidden sm:inline border-l border-slate-300 pl-2">
              LPU Uni-Health Centre Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Firebase Connection Status Badge */}
          <div
            id="firebase-status-badge"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Firebase: campus-care-cdcd0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            id="login-emergency-btn"
            onClick={openEmergencyModal}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency 24x7</span>
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 space-y-5">
          {/* Logo & Headline */}
          <div className="text-center space-y-1.5">
            <div className="w-13 h-13 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-2">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {authMode === 'signin' ? 'Sign In with Firebase' : 'Create Student Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-medium">
              {authMode === 'signin'
                ? 'Sign in to access your LPU health records & appointments.'
                : 'Register your student email for instant healthcare access.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              id="tab-signin-btn"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signin'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-signup-btn"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Student Login Option */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2.5">
              <img
                src={studentProfile.avatarUrl}
                alt={studentProfile.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-300 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {studentProfile.name}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Reg: {studentProfile.registrationNo}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="quick-demo-login-btn"
              onClick={handleQuickDemoStudentLogin}
              disabled={isSubmitting || isAuthLoading}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-2xs transition-colors shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Test</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              id="auth-error-banner"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{errorMessage}</span>
                {authMode === 'signin' && errorMessage.toLowerCase().includes('password') && (
                  <p className="mt-1 font-semibold text-rose-900">
                    Need a new account? Switch to the "Create Account" tab above.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      id="signup-name-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Baibhav Kumar"
                      className="w-full text-sm pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      required={authMode === 'signup'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    LPU Registration No (Optional)
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      id="signup-regno-input"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="e.g. 12209432"
                      className="w-full text-sm pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {authMode === 'signin' ? 'Student Email or Registration ID' : 'Student Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={authMode === 'signin' ? 'text' : 'email'}
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    authMode === 'signin'
                      ? 'e.g. student@lpu.in or 123456789'
                      : 'e.g. student@lpu.in or your email'
                  }
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                {authMode === 'signup' && (
                  <span className="text-[10px] text-slate-400">Min 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'signup' ? 'Create a secure password' : 'Enter your password'}
                  className="w-full text-sm pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isSubmitting || isAuthLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
            >
              {isSubmitting || isAuthLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authMode === 'signin'
                      ? 'Sign In with Email & Password'
                      : 'Create Account & Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Checklist */}
          <div className="border-t border-slate-200/80 pt-3.5 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Firebase Authentication connected (campus-care-cdcd0)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>256-bit encrypted healthcare records for LPU students</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Direct access to Uni-Health Block 32 doctors & routines</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 text-center text-xs text-slate-500">
        <p className="font-medium">
          Lovely Professional University • Uni-Health Centre Block 32 • Jalandhar-Delhi G.T. Road, Phagwara, Punjab 144411
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Firebase Authentication • projectId: campus-care-cdcd0
        </p>
      </footer>
    </div>
  );
};
