'use client';

import { useState, useEffect } from 'react';
import { useModal } from './ModalContext';

const countries = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
];

export default function SignupModal() {
  const { isSignupOpen, closeSignup } = useModal();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    sourceOfCapital: '',
    investmentAmount: '',
    tradingExperience: '',
    referralSource: ''
  });

  // Reset step when modal opens
  useEffect(() => {
    if (isSignupOpen) setStep(1);
  }, [isSignupOpen]);

  if (!isSignupOpen) return null;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryName = e.target.value;
    const country = countries.find(c => c.name === selectedCountryName);
    
    if (country) {
      setFormData({
        ...formData,
        country: selectedCountryName,
        phone: country.code + ' ' // Pre-populate with country code
      });
    } else {
      setFormData({
        ...formData,
        country: selectedCountryName,
        phone: ''
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registration successful! Our institutional team will contact you shortly.');
    closeSignup();
  };

  const progress = (step / 3) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with heavy blur */}
      <div 
        className="fixed inset-0 bg-[#1a1d29]/80 backdrop-blur-xl animate-fade-in"
        onClick={closeSignup}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#252836] border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={closeSignup}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-20">
          <div 
            className="h-full bg-[#4a9d7e] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(74,157,126,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 md:p-12 relative">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4a9d7e]/5 rounded-full blur-[100px] pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="animate-fade-in space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-gray-400 text-sm">Step 1: Your Personal Identity</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">First Name</label>
                    <input
                      required
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="John"
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Last Name</label>
                    <input
                      required
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Doe"
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Country of Residence</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1d29]">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.name} value={c.name} className="bg-[#1a1d29]">
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(74,157,126,0.2)] hover:shadow-[0_0_25px_rgba(74,157,126,0.4)] uppercase tracking-widest text-xs mt-2"
                >
                  Continue to Investment Profile
                </button>
              </div>
            )}

            {/* Step 2: Investment Profile */}
            {step === 2 && (
              <div className="animate-fade-in space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Investment Profile</h2>
                  <p className="text-gray-400 text-sm">Step 2: Capital Allocation</p>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Source of Capital</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.sourceOfCapital}
                      onChange={(e) => setFormData({...formData, sourceOfCapital: e.target.value})}
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1d29]">Select Source</option>
                      <option value="Savings" className="bg-[#1a1d29]">Personal Savings</option>
                      <option value="Business" className="bg-[#1a1d29]">Business Revenue</option>
                      <option value="Inheritance" className="bg-[#1a1d29]">Inheritance</option>
                      <option value="Other" className="bg-[#1a1d29]">Other Assets</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Amount Willing to Invest (USD)</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.investmentAmount}
                      onChange={(e) => setFormData({...formData, investmentAmount: e.target.value})}
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1d29]">Select Range</option>
                      <option value="10k-50k" className="bg-[#1a1d29]">$10,000 - $50,000</option>
                      <option value="50k-250k" className="bg-[#1a1d29]">$50,000 - $250,000</option>
                      <option value="250k-1M" className="bg-[#1a1d29]">$250,000 - $1,000,000</option>
                      <option value="1M+" className="bg-[#1a1d29]">$1,000,000+</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">Trading Experience (CFDs, Forex, etc.)</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.tradingExperience}
                      onChange={(e) => setFormData({...formData, tradingExperience: e.target.value})}
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1d29]">Select Experience Level</option>
                      <option value="Beginner" className="bg-[#1a1d29]">Beginner (0-1 years)</option>
                      <option value="Intermediate" className="bg-[#1a1d29]">Intermediate (1-3 years)</option>
                      <option value="Advanced" className="bg-[#1a1d29]">Advanced (3-5 years)</option>
                      <option value="Professional" className="bg-[#1a1d29]">Professional (5+ years)</option>
                      <option value="Institutional" className="bg-[#1a1d29]">Institutional Trader</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(74,157,126,0.2)] hover:shadow-[0_0_25px_rgba(74,157,126,0.4)] uppercase tracking-widest text-xs"
                  >
                    Continue to Final Step
                  </button>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full text-gray-500 hover:text-white font-bold py-2 transition-all duration-300 uppercase tracking-widest text-[10px]"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Referral Source */}
            {step === 3 && (
              <div className="animate-fade-in space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Final Details</h2>
                  <p className="text-gray-400 text-sm">Step 3: Insights & Review</p>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-1">How did you hear about us?</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.referralSource}
                      onChange={(e) => setFormData({...formData, referralSource: e.target.value})}
                      className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1d29]">Select Source</option>
                      <option value="Social" className="bg-[#1a1d29]">Social Media</option>
                      <option value="News" className="bg-[#1a1d29]">Financial News</option>
                      <option value="Referral" className="bg-[#1a1d29]">Referral</option>
                      <option value="Other" className="bg-[#1a1d29]">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#1a1d29]/50 border border-gray-800 rounded-xl">
                  <p className="text-gray-500 text-[10px] leading-relaxed text-center">
                    By clicking "Finalize Registration", you agree to SmartInvest's Institutional Terms of Service 
                    and Privacy Policy. Our team will verify your credentials within 24 hours.
                  </p>
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(74,157,126,0.2)] hover:shadow-[0_0_25px_rgba(74,157,126,0.4)] uppercase tracking-widest text-xs"
                  >
                    Finalize Registration
                  </button>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full text-gray-500 hover:text-white font-bold py-2 transition-all duration-300 uppercase tracking-widest text-[10px]"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
