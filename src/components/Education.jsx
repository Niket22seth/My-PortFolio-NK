// src/components/Education.jsx
import "./Education.css";

const AREAS = ["Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Machine Learning"];

export default function Education() {
  return (
    <section id="education" className="education">
      <div className="education__inner">
        <h2>Education</h2>

        <div className="education__row">
          <div>
            <h3 className="education__degree">B.Tech, Computer Science</h3>
            <p className="education__school">KIIT Deemed to be University</p>
            <p className="education__cgpa">CGPA: 7.72</p>
          </div>
          <p className="education__dates">2022 – 2026</p>
        </div>

        <ul className="education__areas">
          {AREAS.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}


