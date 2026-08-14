import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Oktay Yildirim",
  description: "How Oktay Yildirim collects, uses, and protects your information.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="August 14, 2026"
      intro="Oktay Yildirim, an international award winning tattoo artist working at Cleopatra Ink Denver, respects your privacy. This policy explains what information we collect through oktaytattooart.com, how we use it, and the choices you have."
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "When you submit the consultation form, we collect the details you provide: your name, email address, phone number (optional), the purpose of your visit, the style, placement, and size you are considering, a description of your tattoo idea, any reference images you upload, and your preferred consultation date and time.",
            "We do not require you to create an account, and we do not knowingly collect sensitive personal information beyond what you voluntarily include in your message.",
          ],
        },
        {
          heading: "How We Use Your Information",
          body: [
            "We use this information to respond to your inquiry, discuss your idea, plan your piece, and schedule a consultation. We may follow up with you by email or phone about your request.",
            "We do not sell, rent, or trade your personal information to anyone.",
          ],
        },
        {
          heading: "Service Providers",
          body: [
            "We rely on a few trusted services to run the site and handle inquiries: Vercel (website hosting), Resend (delivering your inquiry to us by email, with any reference images sent as attachments), and Google (storing inquiry details in a private spreadsheet for our records). These providers process data only as needed to deliver their service.",
          ],
        },
        {
          heading: "Advertising and Analytics",
          body: [
            "We advertise online and use the Meta Pixel, a tool from Meta Platforms, on this site. The pixel helps us measure the performance of our ads and show relevant ads to people who have visited the site. It collects information such as pages viewed and actions taken on the site, which is shared with Meta.",
            "We may also use the contact details you submit to create advertising audiences on Meta so that we can reach you, or people similar to you, with our ads. You can control or opt out of personalized advertising through your Meta account settings and through the ad and privacy settings on your device or browser.",
          ],
        },
        {
          heading: "Data Retention",
          body: [
            "We keep inquiry details for as long as needed to communicate with you and to maintain records of our work together. You can ask us to delete your information at any time.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "You may request access to, correction of, or deletion of the personal information you have shared with us. To do so, email oktaytattooart@gmail.com and we will respond within a reasonable time.",
          ],
        },
        {
          heading: "Age",
          body: [
            "This site and our services are intended for adults. You must be 18 or older to be tattooed, and the consultation form is not directed to children.",
          ],
        },
        {
          heading: "Changes to This Policy",
          body: [
            "We may update this policy from time to time. Any changes will be posted on this page with a revised last updated date.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Questions about this policy? Email oktaytattooart@gmail.com.",
          ],
        },
      ]}
    />
  );
}
