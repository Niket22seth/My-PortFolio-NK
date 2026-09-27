// src/components/Experience.jsx
import { useEffect, useRef, useState } from "react";
import "./Experience.css";

const TECH = ["React", "Node.js", "Express", "MySQL", "REST APIs", "Redis"];

const HIGHLIGHTS = [
  "Full-stack telecom platform built independently, covering campaigns, SIP gateway, and call flows.",
  "Built the platform end-to-end — architected and developed both the React.js frontend and the Node.js/MySQL backend, handling everything from UI to database design myself",
  "Designed a Redis-based DND system — enabled fast, real-time lookups to block calls to Do-Not-Disturb numbers, keeping call routing compliant with telecom regulations",
  "Built a real-time prepaid wallet engine — kept wallet balances synced across Redis, the MySQL billing ledger, and the call engine, so every call is checked against accurate, live balance dat",
  "Developed a billing module with GST invoicing and RBAC — generated compliant invoices, handled wallet-based payments, and enforced role-based access so Admin, Reseller, and Enterprise users each see only what's relevant to them.",
  "Created reusable, responsive React components — built with form validation and REST API integration baked in, cutting down repeated UI code and speeding up new feature development.",
  "Worked in Agile sprints — collaborated using Git for version control and took part in regular code reviews to keep code quality consistent.",
];

export default function Experience() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // reveal once, don't re-trigger on scroll-back
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={`experience ${visible ? "experience--visible" : ""}`}
    >
      <div className="experience__inner">
        <div className="experience__heading">
          <h2>Experience</h2>
          <p className="experience__subtitle">
            Building production-oriented software and solving real engineering
            And Telecom Problems.
          </p>
        </div>

        <div className="experience__timeline">
          <div className="experience__rail" aria-hidden="true" />

          <article className="experience__card">
            <div className="experience__card-head">
              <div>
                <h3 className="experience__role">
                  Software Engineering Intern
                </h3>
              </div>
              <p className="experience__dates">July 2026 – December 2026</p>
            </div>

            <ul className="experience__list">
              {HIGHLIGHTS.map((point, i) => (
                <li key={i} style={{ "--delay": `${i * 70}ms` }}>
                  {point}
                </li>
              ))}
            </ul>

            <ul className="experience__tags" aria-label="Technologies used">
              {TECH.map((t, i) => (
                <li key={t} style={{ "--delay": `${300 + i * 50}ms` }}>
                  {t}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
