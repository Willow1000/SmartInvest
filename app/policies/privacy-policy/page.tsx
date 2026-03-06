import Navbar from '@/app/components/home/Navbar';
import Footer from '@/app/components/home/Footer';

export const metadata = {
  title: 'Privacy Policy - SmartInvest',
  description: 'Privacy Policy for SmartInvest - Learn how we protect your data and personal information.',
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#1a1d29] min-h-screen">
      <Navbar />
      
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg">
              Last updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                SmartInvest Global Ltd. ("we," "us," "our," or "Company") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                visit our website, mobile application, and use our services (collectively, the "Services").
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, 
                please do not use our Services. By accessing and using SmartInvest, you acknowledge that you have 
                read, understood, and agree to be bound by all the provisions of this Privacy Policy.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">2.1 Information You Provide Directly</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We collect information you voluntarily provide when you create an account, complete your profile, 
                    make a transaction, or contact us. This includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                    <li>Full name, email address, and phone number</li>
                    <li>Date of birth and identification documents</li>
                    <li>Residential address and financial information</li>
                    <li>Bank account details and payment information</li>
                    <li>Trading preferences and investment history</li>
                    <li>Communications and correspondence with our support team</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">2.2 Information Collected Automatically</h3>
                  <p className="text-gray-300 leading-relaxed">
                    When you access our Services, we automatically collect certain information about your device and 
                    usage patterns, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                    <li>IP address, browser type, and operating system</li>
                    <li>Pages visited, time spent on pages, and links clicked</li>
                    <li>Device identifiers and unique user identifiers</li>
                    <li>Referring URL and exit pages</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Geolocation data (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">2.3 Information from Third Parties</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We may receive information about you from third parties, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                    <li>Identity verification services and KYC providers</li>
                    <li>Payment processors and financial institutions</li>
                    <li>Credit reporting agencies and fraud prevention services</li>
                    <li>Marketing partners and data analytics providers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>To create and manage your account and provide our Services</li>
                <li>To process transactions and send related information</li>
                <li>To verify your identity and comply with regulatory requirements (KYC/AML)</li>
                <li>To improve, personalize, and enhance your user experience</li>
                <li>To send promotional communications and marketing materials (with your consent)</li>
                <li>To detect, prevent, and address fraud and security issues</li>
                <li>To comply with legal obligations and enforce our Terms of Service</li>
                <li>To conduct research, analytics, and improve our Services</li>
                <li>To respond to your inquiries and provide customer support</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may share your information with third parties in the following circumstances:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#4a9d7e] mb-2">4.1 Service Providers</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We share information with vendors, contractors, and service providers who assist us in operating 
                    our website, conducting business, or servicing you, including payment processors, hosting providers, 
                    and customer service platforms.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#4a9d7e] mb-2">4.2 Regulatory and Legal Compliance</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We may disclose your information when required by law or when we believe in good faith that such 
                    disclosure is necessary to comply with legal obligations, court orders, or regulatory requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#4a9d7e] mb-2">4.3 Business Transfers</h3>
                  <p className="text-gray-300 leading-relaxed">
                    If we are involved in a merger, acquisition, bankruptcy, or sale of assets, your information may 
                    be transferred as part of that transaction.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#4a9d7e] mb-2">4.4 With Your Consent</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We may share your information with third parties when you explicitly consent to such sharing.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement comprehensive security measures to protect your personal information from unauthorized access, 
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>Industry-standard encryption (SSL/TLS) for data in transit</li>
                <li>Advanced encryption for sensitive data at rest</li>
                <li>Multi-factor authentication and secure login protocols</li>
                <li>Regular security audits and penetration testing</li>
                <li>Restricted access to personal information on a need-to-know basis</li>
                <li>Employee training on data protection and privacy practices</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
                to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze usage 
                patterns, and deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Types of cookies we use include:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Performance Cookies:</strong> Help us understand how you use our Services</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Track your activity for targeted advertising</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your jurisdiction, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of your personal information</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your information</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@smartinvest.com with your request.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your personal information for as long as necessary to provide our Services, comply with legal 
                obligations, and resolve disputes. The retention period varies depending on the type of information and 
                the purpose for which we use it. Generally, we retain account information for the duration of your account 
                and for a reasonable period thereafter for legal and regulatory compliance.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your information may be transferred to, stored in, and processed in countries other than your country of 
                residence. These countries may have data protection laws that differ from your home country. By using our 
                Services, you consent to the transfer of your information to countries outside your country of residence, 
                which may have different data protection rules.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal 
                information from children. If we become aware that we have collected information from a child, we will 
                promptly delete such information and terminate the child's account.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">11. Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed">
                Our Services may contain links to third-party websites and applications. We are not responsible for the 
                privacy practices of these external sites. We encourage you to review the privacy policies of any third-party 
                sites before providing your personal information.
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal 
                requirements, or other factors. We will notify you of any material changes by posting the updated Privacy 
                Policy on our website and updating the "Last Updated" date. Your continued use of our Services after such 
                modifications constitutes your acceptance of the updated Privacy Policy.
              </p>
            </div>

            {/* Section 13 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, 
                please contact us:
              </p>
              <div className="bg-[#252836]/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <p className="text-gray-300">
                  <strong className="text-white">SmartInvest Global Ltd.</strong><br />
                  Email: privacy@smartinvest.com<br />
                  Address: [Company Address]<br />
                  Phone: [Company Phone]
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                This Privacy Policy is effective as of February 2026 and was last updated on February 2026. 
                We reserve the right to modify this policy at any time. Continued use of our Services following 
                the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
