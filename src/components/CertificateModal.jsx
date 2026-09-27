// src/components/CertificateModal.jsx
import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/LaunchOutlined";
import "./CertificateModal.css";

export default function CertificateModal({ cert, onClose }) {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!cert) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [cert, onClose]);

  if (!cert) return null;

  return (
    <div className="cert-modal__overlay" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="cert-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          className="cert-modal__close"
          onClick={onClose}
          aria-label="Close certificate"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="cert-modal__image-wrap">
          <img
            src={cert.image}
            alt={`${cert.name} certificate`}
            className="cert-modal__image"
          />
        </div>

        <h3 id="cert-modal-title" className="cert-modal__name">
          {cert.name}
        </h3>
        {(cert.issuer || cert.year) && (
          <p className="cert-modal__meta">
            {[cert.issuer, cert.year].filter(Boolean).join(" · ")}
          </p>
        )}

        {cert.url && (
          <a
            href={cert.url}
            target="_blank"
            rel="noreferrer"
            className="cert-modal__link"
          >
            View credential <LaunchIcon fontSize="inherit" />
          </a>
        )}
      </div>
    </div>
  );
}
