// src/components/ProjectModal.jsx
import { useEffect, useRef } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/LaunchOutlined";
import CloseIcon from "@mui/icons-material/Close";
import "./ProjectModal.css";

export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  // lock page scroll + focus the panel while open; restore on close
  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // minimal focus trap: keep Tab cycling within the panel
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
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="project-modal__overlay" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="project-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          className="project-modal__close"
          onClick={onClose}
          aria-label="Close project details"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="project-modal__image" aria-hidden="true">
          <span>{project.title[0]}</span>
        </div>

        <h3 id="project-modal-title" className="project-modal__title">
          {project.title}
        </h3>

        <p className="project-modal__desc">{project.description}</p>

        {project.features?.length > 0 && (
          <>
            <p className="project-modal__section-label">Key features</p>
            <ul className="project-modal__features">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}

        <p className="project-modal__section-label">Technologies</p>
        <ul className="project-modal__tags">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="project-modal__actions">
          <a
            href={project.github}
            className="project-modal__btn project-modal__btn--primary"
          >
            <GitHubIcon fontSize="small" /> View on GitHub
          </a>
          {project.demo && (
            <a href={project.demo} className="project-modal__btn">
              <LaunchIcon fontSize="small" /> Live demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
