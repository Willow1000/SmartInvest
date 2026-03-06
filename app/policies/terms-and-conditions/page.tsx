import Navbar from '@/app/components/home/Navbar';
import Footer from '@/app/components/home/Footer';

export const metadata = {
  title: 'Terms & Conditions - SmartInvest',
  description: 'Terms & Conditions for SmartInvest - Read our legal terms and conditions for using our platform.',
};

export default function TermsAndConditions() {
  return (
    <main className="bg-[#1a1d29] min-h-screen">
      <Navbar />
      
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Terms & Conditions
            </h1>
            <p className="text-gray-400 text-lg">
              Last updated: February 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using the SmartInvest platform, website, mobile application, and services 
                (collectively, the "Services"), you agree to be bound by these Terms & Conditions. If you do not 
                agree to these terms, you must not use our Services. SmartInvest Global Ltd. ("Company," "we," "us," 
                or "our") reserves the right to modify these terms at any time. Your continued use of the Services 
                following any modifications constitutes your acceptance of the updated Terms & Conditions.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility and Account Registration</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">2.1 Eligibility Requirements</h3>
                  <p className="text-gray-300 leading-relaxed">
                    To use our Services, you must be at least 18 years old and legally capable of entering into binding 
                    contracts. You must not be a resident of any jurisdiction where our Services are prohibited by law. 
                    You represent and warrant that all information provided during registration is accurate, complete, 
                    and truthful.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">2.2 Account Registration</h3>
                  <p className="text-gray-300 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and password. 
                    You agree to accept responsibility for all activities that occur under your account. You must notify 
                    us immediately of any unauthorized use of your account or any other breach of security.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">2.3 KYC and AML Compliance</h3>
                  <p className="text-gray-300 leading-relaxed">
                    To comply with regulatory requirements, you agree to provide accurate identification documents and 
                    undergo Know Your Customer (KYC) and Anti-Money Laundering (AML) verification. We reserve the right 
                    to suspend or terminate your account if you fail to provide required documentation or if we suspect 
                    fraudulent activity.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. Use of Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to use our Services only for lawful purposes and in accordance with these Terms & Conditions. 
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use our Services for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Engage in market manipulation, insider trading, or fraudulent activities</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the integrity or performance of our Services</li>
                <li>Transmit viruses, malware, or any harmful code</li>
                <li>Engage in harassment, abuse, or threatening behavior toward other users or staff</li>
                <li>Reverse engineer, decompile, or attempt to derive our source code or algorithms</li>
                <li>Use automated tools or bots to access our Services without authorization</li>
                <li>Violate intellectual property rights or other proprietary rights</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. Trading and Investment Risks</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">4.1 Risk Acknowledgment</h3>
                  <p className="text-gray-300 leading-relaxed">
                    You acknowledge that trading and investing in financial markets involve substantial risk of loss. 
                    Past performance is not indicative of future results. All investments carry risk, including potential 
                    loss of principal. You should not invest money you cannot afford to lose.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">4.2 AI Signals Disclaimer</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our AI-driven trading signals are provided for informational purposes only and do not constitute 
                    investment advice, recommendations, or guarantees of profitability. We do not guarantee the accuracy 
                    or timeliness of signals. You are solely responsible for evaluating the merits and risks of any trade 
                    before executing it.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">4.3 No Liability for Losses</h3>
                  <p className="text-gray-300 leading-relaxed">
                    SmartInvest shall not be liable for any direct, indirect, incidental, special, consequential, or 
                    punitive damages arising from your use of our Services, including but not limited to trading losses, 
                    lost profits, or lost data, even if we have been advised of the possibility of such damages.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">4.4 Market Volatility</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Financial markets are subject to rapid and unpredictable price movements. Extreme market volatility 
                    may result in slippage, execution delays, or inability to execute trades at expected prices. You 
                    acknowledge these risks and accept them as inherent to trading.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">5. Fees and Charges</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to pay all applicable fees and charges associated with your use of our Services, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Trading commissions and spreads</li>
                <li>Account maintenance fees</li>
                <li>Withdrawal and deposit fees</li>
                <li>Subscription fees for premium features</li>
                <li>Any other fees disclosed on our platform</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We reserve the right to modify our fee structure at any time. Changes to fees will be communicated to 
                you in advance. Continued use of our Services constitutes acceptance of any fee modifications.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All content, features, and functionality of our Services, including but not limited to text, graphics, 
                logos, images, algorithms, and software, are the exclusive property of SmartInvest or its licensors and 
                are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You are granted a limited, non-exclusive, non-transferable license to use our Services for your personal, 
                non-commercial use. You may not reproduce, modify, distribute, or transmit any content without our prior 
                written consent.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">7. User Content and Conduct</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You retain ownership of any content you submit to our platform. By submitting content, you grant SmartInvest 
                a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You agree that your content will not infringe upon any third-party rights and will not contain any unlawful, 
                defamatory, obscene, or offensive material. SmartInvest reserves the right to remove any content that violates 
                these terms or applicable laws.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To the maximum extent permitted by law, SmartInvest shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising from your use of or inability to use our Services, even if we have 
                been advised of the possibility of such damages.
              </p>
              <p className="text-gray-300 leading-relaxed">
                In no event shall our total liability to you exceed the amount you have paid to us in fees during the 12 months 
                preceding the claim, or $100, whichever is greater.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless SmartInvest and its officers, directors, employees, and 
                agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your 
                use of our Services, violation of these Terms & Conditions, or infringement of any third-party rights.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your account and access to our Services at any time, with or without cause, 
                and with or without notice. Reasons for termination may include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Violation of these Terms & Conditions</li>
                <li>Suspected fraudulent or illegal activity</li>
                <li>Regulatory compliance requirements</li>
                <li>Non-payment of fees or charges</li>
                <li>Violation of applicable laws or regulations</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Upon termination, you must cease all use of our Services. Any outstanding obligations or liabilities will 
                survive termination.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">11. Dispute Resolution</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">11.1 Governing Law</h3>
                  <p className="text-gray-300 leading-relaxed">
                    These Terms & Conditions are governed by and construed in accordance with the laws of [Jurisdiction], 
                    without regard to its conflict of law principles.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">11.2 Arbitration</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Any dispute arising out of or relating to these Terms & Conditions or your use of our Services shall be 
                    resolved by binding arbitration in accordance with the rules of [Arbitration Body]. The arbitration shall 
                    be conducted in English, and each party shall bear its own costs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4a9d7e] mb-2">11.3 Class Action Waiver</h3>
                  <p className="text-gray-300 leading-relaxed">
                    You agree that any arbitration or legal proceeding shall be conducted on an individual basis and not as 
                    a class action, collective action, or representative action.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">12. Regulatory Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                SmartInvest operates in compliance with applicable financial regulations and licensing requirements. However, 
                regulatory status varies by jurisdiction. You are responsible for understanding and complying with all applicable 
                laws and regulations in your jurisdiction.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our Services may not be available in all jurisdictions. We reserve the right to restrict access to our Services 
                from any jurisdiction at any time.
              </p>
            </div>

            {/* Section 13 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">13. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed">
                Our Services may integrate with or link to third-party services, platforms, and applications. We are not 
                responsible for the availability, accuracy, or content of third-party services. Your use of third-party services 
                is subject to their respective terms and conditions and privacy policies.
              </p>
            </div>

            {/* Section 14 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">14. Modifications to Services</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue our Services at any time, with or without notice. We 
                shall not be liable to you or any third party for any modification, suspension, or discontinuation of our Services.
              </p>
            </div>

            {/* Section 15 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">15. Entire Agreement</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms & Conditions, together with our Privacy Policy and any other agreements you have entered into with 
                us, constitute the entire agreement between you and SmartInvest regarding your use of our Services and supersede 
                all prior negotiations, representations, and agreements.
              </p>
            </div>

            {/* Section 16 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">16. Severability</h2>
              <p className="text-gray-300 leading-relaxed">
                If any provision of these Terms & Conditions is found to be invalid or unenforceable, such provision shall be 
                severed, and the remaining provisions shall continue in full force and effect.
              </p>
            </div>

            {/* Section 17 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">17. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions or concerns regarding these Terms & Conditions, please contact us:
              </p>
              <div className="bg-[#252836]/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <p className="text-gray-300">
                  <strong className="text-white">SmartInvest Global Ltd.</strong><br />
                  Email: support@smartinvest.com<br />
                  Legal: legal@smartinvest.com<br />
                  Address: [Company Address]<br />
                  Phone: [Company Phone]
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                These Terms & Conditions are effective as of February 2026 and were last updated on February 2026. 
                We reserve the right to modify these terms at any time. Your continued use of our Services following 
                the posting of revised Terms & Conditions means that you accept and agree to the changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
