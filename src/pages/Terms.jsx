import { PolicyLayout, PolicySection } from "@/components/ui.jsx";

export default function Terms() {
  return (
    <PolicyLayout eyebrow="Legal" title="Terms of Service" updated="December 2024">
      <PolicySection title="1. Agreement to Terms">
        <p>By accessing or using the JCS Home website (jcshome.in), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.</p>
      </PolicySection>

      <PolicySection title="2. Products and Pricing">
        <p>All prices are listed in Indian Rupees (INR) and include applicable GST unless otherwise stated. We reserve the right to change prices at any time without prior notice. Promotional prices are valid only for the specified period.</p>
        <p>We strive to display our products as accurately as possible. However, colors and appearances may vary slightly due to monitor settings and photography.</p>
      </PolicySection>

      <PolicySection title="3. Orders and Payment">
        <p>Your order is an offer to purchase. We reserve the right to accept or decline any order for any reason, including product availability, errors in pricing or product information, or suspected fraud.</p>
        <p>Products are subject to availability. We reserve the right to limit quantities or discontinue products at any time. If a product becomes unavailable after you place an order, we will notify you and offer alternatives or a full refund.</p>
      </PolicySection>

      <PolicySection title="4. Shipping and Delivery">
        <p>We deliver across India with reliable shipping partners. Delivery times vary by location. Please refer to our Shipping Policy for detailed information.</p>
      </PolicySection>

      <PolicySection title="5. Returns and Refunds">
        <p>Easy 7-day return policy. Products must be unused and in original packaging. Please refer to our Returns Policy for full details.</p>
      </PolicySection>

      <PolicySection title="6. Intellectual Property">
        <p>All content on this website, including text, images, logos, product designs, and graphics, is the property of JCS Enterprises and is protected by copyright and trademark laws. You may not reproduce, distribute, or use any content without our written permission.</p>
      </PolicySection>

      <PolicySection title="7. User Conduct">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Use the website for any unlawful purpose</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Submit false or misleading information</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the proper functioning of the website</li>
        </ul>
      </PolicySection>

      <PolicySection title="8. Limitation of Liability">
        <p>JCS Enterprises shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our liability is limited to the amount paid for the product in question.</p>
      </PolicySection>

      <PolicySection title="9. Governing Law">
        <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.</p>
      </PolicySection>

      <PolicySection title="10. Contact Information">
        <p>For questions about these Terms of Service, contact us at <a className="text-primary hover:underline" href="mailto:hello@jcshome.in">hello@jcshome.in</a> or call +91 93607 33544.</p>
        <p className="text-sm">JCS Enterprises reserves the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
      </PolicySection>
    </PolicyLayout>
  );
}
