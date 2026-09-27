// src/components/Contact.jsx
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import ContactForm from "./ContactForm";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact__inner">
        <div className="contact__intro">
          <h2>Let's build something great.</h2>
          <p>
            I'm open to software engineering opportunities, interesting
            technical challenges, and conversations around building great
            products.
          </p>

          <ul className="contact__links">
            <li>
              <a href="mailto:niketgupta0000@gmail.com">
                <EmailIcon fontSize="small" /> niketgupta0000@gmail.com
              </a>
            </li>
            <li>
              <a
                href="http://linkedin.com/in/niket-gupta-5b4707251"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedInIcon fontSize="small" /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Niket22seth"
                target="_blank"
                rel="noreferrer"
              >
                <GitHubIcon fontSize="small" /> GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="contact__form-wrap">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
