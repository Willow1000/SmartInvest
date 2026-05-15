'use client';

import { useState } from 'react';
import { useModal } from './ModalContext';
import { useToast } from '../ui/ToastContext';

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useModal();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful magic link send
      setIsSubmitted(true);
      showToast('Magic link sent successfully! Please check your email.', 'success');
    } catch (error) {
      showToast('An error occurred while sending the magic link', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    setIsSubmitting(false);
    closeLogin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with heavy blur */}
      <div 
        className="fixed inset-0 bg-[#1a1d29]/80 backdrop-blur-xl animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm lg:max-w-md xl:max-w-sm bg-[#252836] border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-10 relative">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4a9d7e]/5 rounded-full blur-[100px] pointer-events-none" />

          {!isSubmitted ? (
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Enter your email to receive a magic link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(74,157,126,0.2)] hover:shadow-[0_0_25px_rgba(74,157,126,0.4)] uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending Magic Link...' : 'Send Magic Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-[10px]">
                  Don't have an account? 
                  <button 
                    onClick={() => {
                      closeLogin();
                      // Open signup modal
                    }}
                    className="text-[#4a9d7e] hover:text-[#3d8567] font-bold ml-1"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-[#4a9d7e]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#4a9d7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Magic Link Sent!</h3>
              <p className="text-gray-400 text-sm mb-6">
                We've sent a magic link to <span className="text-[#4a9d7e] font-semibold">{email}</span>
              </p>
              <p className="text-gray-500 text-[10px] leading-relaxed">
                Check your inbox and click the link to sign in. The link will expire in 15 minutes.
              </p>

              <button
                onClick={handleClose}
                className="mt-6 text-gray-500 hover:text-white font-bold text-[10px] uppercase tracking-widest"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
