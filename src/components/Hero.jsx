// src/components/Hero.jsx
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import ProfileCard from "./ProfileCard";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__inner">
        <div className="hero__main">
          <p className="hero__eyebrow">Full-Stack Software Engineer</p>

          <h1 className="hero__name">
            Niket Kumar
            <br />
            Gupta
          </h1>

          <p className="hero__statement">
            I build scalable full-stack applications, production-ready web
            systems, and AI-powered products using modern JavaScript
            technologies.
          </p>

          <div className="hero__ctas">
            <a href="#experience" className="hero__cta hero__cta--primary">
              View experience
            </a>
            <a
              href="/resume.pdf"
              className="hero__cta hero__cta--secondary"
              download
            >
              Download resume
            </a>
          </div>

          <div className="hero__contact-links">
            <a
              href="https://github.com/Niket22seth"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon fontSize="small" /> GitHub
            </a>
            <a
              href="http://linkedin.com/in/niket-gupta-5b4707251"
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInIcon fontSize="small" /> LinkedIn
            </a>
            <a href="niketgupta0000@gmail.com">
              <EmailIcon fontSize="small" /> Email
            </a>
          </div>
        </div>

        <div className="hero__profile">
          <ProfileCard />
        </div>
      </div>
    </section>
  );
}
