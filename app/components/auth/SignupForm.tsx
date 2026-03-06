'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    sourceOfCapital: '',
    investmentAmount: '',
    referralSource: ''
  });

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
    window.location.href = '/';
  };

  const progress = (step / 3) * 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12 relative h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-[#4a9d7e] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(74,157,126,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-[#252836]/30 backdrop-blur-xl border border-gray-800 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4a9d7e]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#4a9d7e]/10 transition-all duration-700" />

        <form onSubmit={handleSubmit} className="relative z-10">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
                <p className="text-gray-400">Step 1: Your Personal Identity</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">First Name</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="John"
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Last Name</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Doe"
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Country of Residence</label>
                <div className="relative">
                  <select
                    required
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1d29]">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.name} value={c.name} className="bg-[#1a1d29]">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all"
                />
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] uppercase tracking-widest text-sm mt-4"
              >
                Continue to Investment Profile
              </button>
            </div>
          )}

          {/* Step 2: Investment Profile */}
          {step === 2 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">Investment Profile</h2>
                <p className="text-gray-400">Step 2: Capital Allocation</p>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Source of Capital</label>
                <div className="relative">
                  <select
                    required
                    value={formData.sourceOfCapital}
                    onChange={(e) => setFormData({...formData, sourceOfCapital: e.target.value})}
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1d29]">Select Source</option>
                    <option value="Savings" className="bg-[#1a1d29]">Personal Savings</option>
                    <option value="Business" className="bg-[#1a1d29]">Business Revenue</option>
                    <option value="Inheritance" className="bg-[#1a1d29]">Inheritance</option>
                    <option value="Other" className="bg-[#1a1d29]">Other Assets</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Amount Willing to Invest (USD)</label>
                <div className="relative">
                  <select
                    required
                    value={formData.investmentAmount}
                    onChange={(e) => setFormData({...formData, investmentAmount: e.target.value})}
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1d29]">Select Range</option>
                    <option value="10k-50k" className="bg-[#1a1d29]">$10,000 - $50,000</option>
                    <option value="50k-250k" className="bg-[#1a1d29]">$50,000 - $250,000</option>
                    <option value="250k-1M" className="bg-[#1a1d29]">$250,000 - $1,000,000</option>
                    <option value="1M+" className="bg-[#1a1d29]">$1,000,000+</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] uppercase tracking-widest text-sm"
                >
                  Continue to Final Step
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full text-gray-500 hover:text-white font-bold py-2 transition-all duration-300 uppercase tracking-widest text-xs"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Referral Source */}
          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">Final Details</h2>
                <p className="text-gray-400">Step 3: Insights & Review</p>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">How did you hear about us?</label>
                <div className="relative">
                  <select
                    required
                    value={formData.referralSource}
                    onChange={(e) => setFormData({...formData, referralSource: e.target.value})}
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4a9d7e]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1d29]">Select Source</option>
                    <option value="Social" className="bg-[#1a1d29]">Social Media</option>
                    <option value="News" className="bg-[#1a1d29]">Financial News</option>
                    <option value="Referral" className="bg-[#1a1d29]">Referral</option>
                    <option value="Other" className="bg-[#1a1d29]">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#1a1d29]/50 border border-gray-800 rounded-2xl">
                <p className="text-gray-500 text-xs leading-relaxed text-center">
                  By clicking "Finalize Registration", you agree to SmartInvest's Institutional Terms of Service 
                  and Privacy Policy. Our team will verify your credentials within 24 hours.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  className="w-full bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(74,157,126,0.3)] hover:shadow-[0_0_30px_rgba(74,157,126,0.5)] uppercase tracking-widest text-sm"
                >
                  Finalize Registration
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full text-gray-500 hover:text-white font-bold py-2 transition-all duration-300 uppercase tracking-widest text-xs"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-gray-500 hover:text-[#4a9d7e] transition-colors text-sm font-bold uppercase tracking-widest">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
