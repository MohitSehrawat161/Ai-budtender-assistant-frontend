export default function Terms() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Terms of Use</h2>
          <p className="text-lg text-gray-600">Please read our terms and conditions carefully</p>
        </div>
  
        <div className="bg-white shadow-md rounded-xl p-8 space-y-8 border border-gray-200">
          {/* Section 1 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Cannabis Advisor, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
  
          {/* Section 2 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Age Requirement</h3>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 21 years of age to use this service. Cannabis Advisor is intended for adults only in jurisdictions where cannabis use is legal.
            </p>
          </section>
  
          {/* Section 3 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Legal Compliance</h3>
            <p className="text-gray-700 leading-relaxed">
              Users are responsible for ensuring their use of cannabis products complies with local, state, and federal laws. Cannabis Advisor does not provide legal advice.
            </p>
          </section>
  
          {/* Section 4 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Medical Disclaimer</h3>
            <p className="text-gray-700 leading-relaxed">
              The information provided by Cannabis Advisor is for educational purposes only and should not be considered medical advice. Consult with a healthcare professional before using cannabis products for medical purposes.
            </p>
          </section>
  
          {/* Section 5 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">5. AI Recommendations</h3>
            <p className="text-gray-700 leading-relaxed">
              AI-generated recommendations are based on general information and user input. Individual experiences may vary. Always start with low doses and consult professionals when needed.
            </p>
          </section>
  
          {/* Section 6 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">6. Privacy Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              We respect your privacy and are committed to protecting your personal information. Please review our Privacy Policy to understand how we collect, use, and protect your data.
            </p>
          </section>
  
          {/* Section 7 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">7. Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              Cannabis Advisor shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of our service.
            </p>
          </section>
  
          {/* Section 8 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">8. Changes to Terms</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through the application.
            </p>
          </section>
  
          {/* Footer Note */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong>Last Updated:</strong> January 15, 2024
            </p>
            <p className="text-sm text-gray-700 mt-2">
              For questions about these terms, please contact us at{' '}
              <a
                href="mailto:legal@cannabisadvisor.com"
                className="text-indigo-600 hover:text-indigo-700 underline"
              >
                legal@cannabisadvisor.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
  