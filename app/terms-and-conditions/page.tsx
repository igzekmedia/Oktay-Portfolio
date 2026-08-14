import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions | Oktay Yildirim",
  description: "The terms that govern your use of oktaytattooart.com and consultation requests.",
};

export default function TermsAndConditions() {
  return (
    <LegalPage
      title="Terms and Conditions"
      lastUpdated="August 14, 2026"
      intro="These terms govern your use of oktaytattooart.com and any consultation request you submit through it. This site is operated for Oktay Yildirim, who tattoos at Cleopatra Ink Denver, 1869 S Broadway, Denver, CO 80210. By using this site, you agree to these terms."
      sections={[
        {
          heading: "The Site and Inquiries",
          body: [
            "This website is for information and to let you start a conversation about custom work. Submitting the form is a consultation request, not a confirmed booking. A consultation or appointment is only confirmed once we have discussed your idea and agreed on details directly.",
          ],
        },
        {
          heading: "Consultations and Deposits",
          body: [
            "The first step is a consultation to plan your piece. If a deposit is required to reserve a session, the amount and terms, including whether it is non-refundable and how it applies to your final price, will be communicated to you before you pay.",
          ],
        },
        {
          heading: "Age Requirement",
          body: [
            "You must be at least 18 years old to be tattooed. Valid government issued photo ID is required before any tattoo session.",
          ],
        },
        {
          heading: "Custom Work and Intellectual Property",
          body: [
            "All designs, drawings, and photographs of completed work shown on this site are the property of Oktay Yildirim unless otherwise noted. Custom designs are created for the specific client and may not be reproduced by others without permission.",
          ],
        },
        {
          heading: "Your Responsibilities",
          body: [
            "You agree to provide accurate information, to disclose any relevant medical conditions or allergies before your session, and to follow the aftercare guidance provided. Proper aftercare is essential to how a tattoo heals and ages, and is your responsibility once you leave the studio.",
          ],
        },
        {
          heading: "No Guarantees",
          body: [
            "Tattooing is a permanent art form and individual results vary based on skin, placement, healing, and aftercare. Nothing on this site is medical advice. Oktay Yildirim does not guarantee a specific outcome and is not liable for results that fall outside of reasonable control.",
          ],
        },
        {
          heading: "Limitation of Liability",
          body: [
            "To the fullest extent permitted by law, Oktay Yildirim is not liable for indirect or incidental damages arising from your use of this site. Services provided in person are governed by the consent and aftercare paperwork you sign at the studio.",
          ],
        },
        {
          heading: "Governing Law",
          body: [
            "These terms are governed by the laws of the State of Colorado.",
          ],
        },
        {
          heading: "Changes and Contact",
          body: [
            "We may update these terms from time to time; the latest version will always be posted here. Questions? Email oktaytattooart@gmail.com.",
          ],
        },
      ]}
    />
  );
}
