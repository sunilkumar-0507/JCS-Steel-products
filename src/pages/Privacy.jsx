import { PolicyLayout, PolicySection } from "@/components/ui.jsx";

export default function Privacy() {
  return (
    <PolicyLayout eyebrow="Legal" title="Privacy Policy" updated="December 2024">
      <p className="leading-relaxed text-muted-foreground">
        JCS Home is committed to protecting your privacy. This policy explains how we
        collect, use, and protect your personal information. By using our website, you
        consent to the data practices described in this policy. If you do not agree with
        our policies, please do not use our site.
      </p>

      <PolicySection title="1. Information We Collect">
        <p><strong>Personal Information:</strong> When you place an order or create an account, we collect your name, shipping and billing address, email, phone number, and payment information (processed securely through our payment partners).</p>
        <p><strong>Automatically Collected Information:</strong> When you browse our website, we automatically collect your IP address and browser type, device information, pages visited and time spent on site, and referring website.</p>
        <p>We also use cookies and similar tracking technologies.</p>
      </PolicySection>

      <PolicySection title="2. How We Use Your Information">
        <ul className="list-disc space-y-1 pl-5">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Send promotional emails (only if you opt-in)</li>
          <li>Improve our website and services</li>
          <li>Prevent fraudulent transactions</li>
          <li>Comply with legal obligations</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Information Sharing">
        <p>We do not sell, trade, or rent your personal information. We may share your data with payment processors, shipping partners, analytics providers, and legal authorities when required by law.</p>
      </PolicySection>

      <PolicySection title="4. Data Security">
        <p>We implement appropriate security measures to protect your personal information, including SSL encryption for all data transmission, secure payment processing through PCI-compliant partners, limited employee access to personal data, and regular security audits and updates.</p>
      </PolicySection>

      <PolicySection title="5. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Access and receive a copy of your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data (subject to legal requirements)</li>
          <li>Opt-out of marketing communications</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </PolicySection>

      <PolicySection title="6. Cookies">
        <p>We use cookies to enhance your browsing experience. Cookies help us remember your preferences, keep items in your cart, and analyze site traffic. You can disable cookies in your browser settings, but some features may not work properly.</p>
      </PolicySection>

      <PolicySection title="7. Contact Us">
        <p>For questions about this Privacy Policy or our data practices, contact us at <a className="text-primary hover:underline" href="mailto:hello@jcshome.in">hello@jcshome.in</a> or call +91 93607 33544.</p>
      </PolicySection>
    </PolicyLayout>
  );
}
