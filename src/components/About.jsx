// src/components/About.jsx
import "./About.css";

const HIGHLIGHTS = [
  {
    title: "Full-Stack Development",
    body: "Frontend and backend systems, from React interfaces to Express APIs.",
  },
  {
    title: "Production Experience",
    body: "Building and maintaining real-world, user-facing applications.",
  },
  {
    title: "AI Integration",
    body: "AI-powered features and API integrations woven into full-stack products.",
  },
  {
    title: "Database Engineering",
    body: "MySQL and MongoDB schema design for data-driven applications.",
  },
];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about__inner">
        <div className="about__intro">
          <h2>About</h2>
          <p>
            I'm a full-stack software engineer who works across the entire
            stack — React on the frontend, Node.js and Express on the
            backend, MySQL and MongoDB underneath. I've built production
            features as part of a real engineering team, not just personal
            projects, and I'm drawn to systems that have to hold up under
            actual use: state that has to stay consistent, APIs that have to
            handle failure gracefully, data that has to scale. I've also
            spent time building AI-powered products, integrating LLM APIs
            into full-stack applications rather than treating them as a
            separate experiment.
          </p>
        </div>

        <ul className="about__highlights">
          {HIGHLIGHTS.map((h) => (
            <li key={h.title} className="about__highlight">
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
