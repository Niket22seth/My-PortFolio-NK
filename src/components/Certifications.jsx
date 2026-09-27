// src/components/Certifications.jsx
import { useState } from "react";
import fullStackCertificate from "../../Image/FullStack Certificate.jpg";
import RotatingShowcase from "./RotatingShowcase";
import CertificateModal from "./CertificateModal";
import "./Certifications.css";

// Add each certificate's image to public/certifications/ and reference it
// here, e.g. image: "/certifications/aws-foundation.png". Until an image
// is added, the thumbnail falls back to the certificate's initial letter.
const CERTIFICATIONS = [
  {
    key: "fullstack-genai",
    name: "Full Stack Developer with GenAI",
    issuer: "Udemy",
    year: "2025",
    url: "https://drive.google.com/file/d/1KZypmoRmiWgrqW98wVxzhRu-dw25hVKK/view?usp=sharing",
    image: fullStackCertificate,
  },
  {
    key: "aws-foundation",
    name: "AWS Foundation Certification",
    issuer: "AWS",
    year: "",
    url: "https://drive.google.com/file/d/1l6PEpWLK8WvdXhOiAHDxZfhyges3NtFk/view?usp=drivesdk",
    image: "Image/Aws Foundation.jpg",
  },
  // {
  //   key: "data-analyst",
  //   name: "Data Analyst",
  //   issuer: "",
  //   year: "",
  //   url: "",
  //   image: "",
  // },
];

export default function Certifications() {
  const [activeCert, setActiveCert] = useState(null);

  if (CERTIFICATIONS.length === 0) return null;

  const showcaseItems = CERTIFICATIONS.map((cert) => ({
    key: cert.key,
    render: () => (
      <div className="cert-slide">
        <button
          type="button"
          className="cert-slide__thumb"
          onClick={() => cert.image && setActiveCert(cert)}
          disabled={!cert.image}
          aria-label={cert.image ? `View ${cert.name} certificate` : undefined}
        >
          {cert.image ? (
            <img src={cert.image} alt="" className="cert-slide__thumb-img" />
          ) : (
            <span className="cert-slide__thumb-fallback">{cert.name[0]}</span>
          )}
        </button>

        <div className="cert-slide__text">
          <p className="cert-slide__name">{cert.name}</p>
          {(cert.issuer || cert.year) && (
            <p className="cert-slide__meta">
              {[cert.issuer, cert.year].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <section id="certifications" className="certifications">
      <div className="certifications__inner">
        <h2>Certifications</h2>
        <RotatingShowcase
          items={showcaseItems}
          holdMs={2500}
          ariaLabel="Certifications"
        />
      </div>

      <CertificateModal cert={activeCert} onClose={() => setActiveCert(null)} />
    </section>
  );
}
