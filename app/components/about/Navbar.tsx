'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useModal } from '../auth/ModalContext';

export default function AboutNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const { openSignup } = useModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { name: string, href: string }) => {
    setActiveItem(item.name);
    if (item.href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Team', href: '#team' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact Us', href: '#contact-location' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#1a1d29]/80 backdrop-blur-lg border-b border-gray-800/50 py-3'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Redirects to / (root) */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  src="/smartinvest-icon.png"
                  alt="SmartInvest Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-white text-2xl font-extrabold tracking-tight">SmartInvest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-1 mr-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={item.href === '/' ? true : undefined}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 text-base font-semibold ${activeItem === item.name
                    ? 'bg-white/10 text-[#4a9d7e] shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="h-6 w-px bg-gray-800 mx-4" />
            <button
              onClick={openSignup}
              className="bg-[#4a9d7e] hover:bg-[#3d8567] text-white px-5 lg:px-6 py-2.5 rounded-lg lg:rounded-xl text-base font-bold transition-all duration-300 shadow-[0_0_15px_rgba(74,157,126,0.2)] hover:shadow-[0_0_20px_rgba(74,157,126,0.4)]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#1a1d29] border-b border-gray-800 shadow-2xl animate-fade-in-down">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${activeItem === item.name
                  ? 'bg-white/10 text-[#4a9d7e]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-800 flex flex-col space-y-3">
              <button
                onClick={() => { openSignup(); setIsMenuOpen(false); }}
                className="bg-[#4a9d7e] text-white block px-4 py-4 rounded-xl text-lg font-bold text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
