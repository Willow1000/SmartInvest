'use client';

import { useEffect, useRef, useState } from 'react';

export default function ContactLocation() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const locations = [
    { city: 'London', role: 'Headquarters', address: 'Canary Wharf, London, UK' },
    { city: 'Singapore', role: 'Asia Hub', address: 'Marina Bay Financial Centre, Singapore' },
    { city: 'New York', role: 'US Operations', address: 'Wall Street, New York, USA' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully! Our team will contact you shortly.');
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact-location" ref={sectionRef} className="bg-[#1a1d29] py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Professional Contact Form */}
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-[#4a9d7e] text-sm font-bold tracking-[0.2em] uppercase mb-4">Connect With Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Get in Touch with Our Experts
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#252836]/30 backdrop-blur-xl border border-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
              {/* Form background glow */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#4a9d7e]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#4a9d7e]/10 transition-all duration-700" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div className="group/field">
                  <label htmlFor="name" className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 transition-colors duration-300 ${focusedField === 'name' ? 'text-[#4a9d7e]' : 'text-gray-400'}`}>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all duration-300 hover:border-gray-700"
                  />
                </div>
                <div className="group/field">
                  <label htmlFor="email" className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 transition-colors duration-300 ${focusedField === 'email' ? 'text-[#4a9d7e]' : 'text-gray-400'}`}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all duration-300 hover:border-gray-700"
                  />
                </div>
              </div>
              
              <div className="relative z-10">
                <label htmlFor="subject" className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 transition-colors duration-300 ${focusedField === 'subject' ? 'text-[#4a9d7e]' : 'text-gray-400'}`}>Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formState.subject}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  placeholder="Institutional Inquiry"
                  className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all duration-300 hover:border-gray-700"
                />
              </div>
              
              <div className="relative z-10">
                <label htmlFor="message" className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 transition-colors duration-300 ${focusedField === 'message' ? 'text-[#4a9d7e]' : 'text-gray-400'}`}>Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formState.message}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="How can our team assist you today?"
                  className="w-full bg-[#1a1d29]/50 border border-gray-800 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#4a9d7e]/50 focus:ring-1 focus:ring-[#4a9d7e]/50 transition-all duration-300 hover:border-gray-700 resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full relative z-10 bg-[#4a9d7e] hover:bg-[#3d8567] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(74,157,126,0.2)] hover:shadow-[0_0_25px_rgba(74,157,126,0.4)] uppercase tracking-widest text-sm group-hover:scale-[1.01]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side: Locations Grid */}
          <div className={`transition-all duration-1000 ease-out delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-white mb-8 leading-tight">Where We Are Located</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {locations.map((location, i) => (
                <div 
                  key={i} 
                  className="group bg-[#252836]/30 backdrop-blur-sm border border-gray-800 p-8 rounded-3xl hover:border-[#4a9d7e]/30 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4a9d7e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="text-[#4a9d7e] text-xs font-bold uppercase tracking-widest mb-2 relative z-10">{location.role}</div>
                  <h4 className="text-white text-xl font-bold mb-4 relative z-10 group-hover:text-white transition-colors">{location.city}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed relative z-10 group-hover:text-gray-400 transition-colors">{location.address}</p>
                </div>
              ))}
            </div>
            
            {/* Contact Details Card */}
            <div className="mt-8 bg-[#252836]/50 border border-gray-800 rounded-3xl p-8 space-y-6 group hover:border-gray-700 transition-colors">
              <div className="flex items-center space-x-4 group/item">
                <div className="w-12 h-12 bg-[#4a9d7e]/10 rounded-2xl flex items-center justify-center text-[#4a9d7e] group-hover/item:scale-110 group-hover/item:bg-[#4a9d7e]/20 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold group-hover/item:text-[#4a9d7e] transition-colors">Email Support</div>
                  <div className="text-gray-500 text-sm">support@smartinvest.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 group/item">
                <div className="w-12 h-12 bg-[#4a9d7e]/10 rounded-2xl flex items-center justify-center text-[#4a9d7e] group-hover/item:scale-110 group-hover/item:bg-[#4a9d7e]/20 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold group-hover/item:text-[#4a9d7e] transition-colors">Global Support Desk</div>
                  <div className="text-gray-500 text-sm">Available 24/7 (Mon-Fri)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
