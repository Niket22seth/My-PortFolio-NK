// src/components/Nav.jsx
import { useEffect, useRef, useState } from "react";
import DownloadIcon from "@mui/icons-material/DownloadOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./Nav.css";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef(null);

  // navbar compacts after a small scroll threshold
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active-section highlight
  // Using a band in the middle of the viewport as the "trigger line" rather
  // than the full viewport avoids the common bug where two adjacent short
  // sections both intersect at once during a fast scroll.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    );

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((s) => observerRef.current.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  function handleLinkClick(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <a
          href="#top"
          className="nav__name"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("top");
          }}
        >
          Niket Kumar Gupta
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav__link ${active === link.id ? "nav__link--active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="/resume.pdf" className="nav__resume" download>
          <DownloadIcon fontSize="small" /> Resume
        </a>

        <button
          className="nav__toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <CloseIcon fontSize="small" />
          ) : (
            <MenuIcon fontSize="small" />
          )}
        </button>
      </div>

      <div className={`nav__mobile ${menuOpen ? "nav__mobile--open" : ""}`}>
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="nav__mobile-link"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(link.id);
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="/resume.pdf"
          className="nav__mobile-link nav__mobile-link--resume"
          download
        >
          <DownloadIcon fontSize="small" /> Resume
        </a>
      </div>
    </header>
  );
}
