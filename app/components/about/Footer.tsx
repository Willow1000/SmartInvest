import Link from 'next/link';

export default function AboutFooter() {
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '/#features' },
        { name: 'Performance', href: '/#performance' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: "Where we're located", href: '#contact-location' },
        { name: 'Our Staff', href: '#team' },
        { name: 'Contact', href: '#contact-location' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Help Center', href: '#' },
        { name: 'Market Insights', href: '#' },
        { name: 'Blog', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-[#1a1d29] border-t border-gray-800 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Logo and About */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-[#4a9d7e] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(74,157,126,0.4)]">
                <span className="text-white font-bold text-2xl tracking-tighter">S</span>
              </div>
              <span className="text-white text-2xl font-extrabold tracking-tight">SmartInvest</span>
            </Link>
            <p className="text-gray-400 text-lg max-w-sm mb-8 leading-relaxed">
              Empowering sophisticated investors with institutional-grade technology and 
              AI-driven market insights.
            </p>
            <div className="flex space-x-4">
              {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#4a9d7e] hover:border-[#4a9d7e] transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current opacity-20 rounded-sm" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#4a9d7e] transition-colors duration-200 text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <Link href="#" className="text-gray-500 hover:text-white transition-colors duration-200 text-xs font-bold uppercase tracking-widest">
                Risk Disclosure
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors duration-200 text-xs font-bold uppercase tracking-widest">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors duration-200 text-xs font-bold uppercase tracking-widest">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors duration-200 text-xs font-bold uppercase tracking-widest">
                Disclaimer
              </Link>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                © 2024 SmartInvest Global Ltd.
              </p>
              <p className="text-gray-600 text-[10px] uppercase tracking-widest">
                All rights reserved. Professional use only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
