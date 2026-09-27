// src/components/Skills.jsx
import RotatingShowcase from "./RotatingShowcase";
import MarqueeStrip from "./MarqueeStrip";
import "./Skills.css";

const CATEGORIES = [
  {
    key: "language",
    name: "Language",
    items: ["JAVA", "Python"],
  },
  {
    key: "frontend",
    name: "Frontend",
    items: [
      "React.js",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "Vite",
    ],
  },
  {
    key: "backend",
    name: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    key: "database",
    name: "Database",
    items: ["MySQL", "MongoDB", "Redis"],
  },
  {
    key: "ai-genai",
    name: "AI / GenAI",
    items: ["OpenAI API", "Gemini API", "Machine Learning"],
  },
  {
    key: "cloud",
    name: "Cloud",
    items: ["AWS", "Git", "GitHub", "Postman"],
  },
];

const showcaseItems = CATEGORIES.map((cat) => ({
  key: cat.key,
  render: () => (
    <div className="skills-slide">
      <p className="skills-slide__category">{cat.name}</p>
      <MarqueeStrip ariaLabel={`${cat.name} skills`} speed={28}>
        {cat.items.map((item) => (
          <div className="skills-slide__chip-wrap" key={item}>
            <span className="skills-slide__chip">{item}</span>
          </div>
        ))}
      </MarqueeStrip>
    </div>
  ),
}));

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="skills__inner">
        <div className="skills__heading">
          <h2>Skills</h2>
          <p className="skills__subtitle">
            Technologies I use to build and ship full-stack systems. Hover to
            pause, drag to scroll.
          </p>
        </div>

        <RotatingShowcase
          items={showcaseItems}
          holdMs={2500}
          ariaLabel="Technical skills by category"
        />
      </div>
    </section>
  );
}
