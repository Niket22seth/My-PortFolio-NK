// src/components/Projects.jsx
import { useEffect, useRef, useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/LaunchOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MarqueeStrip from "./MarqueeStrip";
import ProjectModal from "./ProjectModal";
import "./Projects.css";

const PROJECTS = [
  {
    title: "Enterprise Flow / Voice Builder",
    description:
      "A workflow builder for enterprise voice/flow automation — draft and active state management, database synchronization, and CSV-driven bulk operations behind a full-stack React/Node interface.",
    tech: ["React", "Node.js", "Express", "MySQL", "REST APIs"],
    features: [
      "Draft/active state machine with safe promotion between states",
      "CSV import/export for bulk workflow configuration",
      "Database synchronization across concurrent edits",
    ],
    github: "#",
    demo: "#",
  },
  {
    title: "AI Writing Assistant",
    description:
      "A full-stack AI content tool: authenticated users generate, edit, and manage AI-written drafts through a React frontend backed by an Express API and MongoDB.",
    tech: ["React", "Node.js", "Express", "MongoDB", "OpenAI API"],
    features: [
      "Auth + per-user document CRUD",
      "Streaming AI generation wired to a React UI",
      "MongoDB schema for versioned drafts",
    ],
    github: "#",
    demo: "#",
  },
  {
    title: "Slum Detection — ML/Geographic Analysis",
    description:
      "A machine learning pipeline that processes geographic and population data (via the WorldPop API) to identify and analyze informal settlement patterns.",
    tech: ["Python", "Machine Learning", "WorldPop API"],
    features: [
      "Geographic data ingestion and preprocessing pipeline",
      "Population-density-based prediction model",
      "Analysis output for policy-relevant regions",
    ],
    github: "#",
    demo: null,
  },
];

function ProjectCard({ project, onOpenDetails }) {
  return (
    <article className="project-card">
      <div className="project-card__image" aria-hidden="true">
        <span className="project-card__image-glyph">{project.title[0]}</span>
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>

        <ul className="project-card__features">
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <ul className="project-card__tags">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="project-card__actions">
          <a href={project.github} className="project-card__link">
            <GitHubIcon fontSize="inherit" /> GitHub
          </a>
          {project.demo && (
            <a href={project.demo} className="project-card__link">
              <LaunchIcon fontSize="inherit" /> Live demo
            </a>
          )}
          <button
            type="button"
            className="project-card__link project-card__link--details"
            onClick={() => onOpenDetails(project)}
          >
            View details
            <ArrowForwardIcon
              fontSize="inherit"
              className="project-card__arrow"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`projects ${visible ? "projects--visible" : ""}`}
    >
      <div className="projects__heading">
        <h2>Projects</h2>
        <p className="projects__subtitle">
          A few systems worth a closer look — click a card to see the details,
          hover to pause the scroll.
        </p>
      </div>

      <MarqueeStrip ariaLabel="Projects">
        {PROJECTS.map((project) => (
          <div className="project-card-wrap" key={project.title}>
            <ProjectCard project={project} onOpenDetails={setActiveProject} />
          </div>
        ))}
      </MarqueeStrip>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
