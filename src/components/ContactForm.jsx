// src/components/ContactForm.jsx
import { useState } from "react";
import "./ContactForm.css";

const initialState = { name: "", email: "", message: "", company: "" }; // "company" is the honeypot

export default function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setValues(initialState);
    } catch (err) {
      setStatus("error");
      setError(
        err.message || "Couldn't send your message. Try emailing directly.",
      );
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="contact-form__success">
        Message sent — I'll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      {/* Honeypot: hidden from real users, bots that fill every field trip it */}
      <input
        type="text"
        name="company"
        value={values.company}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="contact-form__honeypot"
      />

      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        required
        minLength={2}
        maxLength={100}
        value={values.name}
        onChange={handleChange}
        disabled={status === "sending"}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        maxLength={254}
        value={values.email}
        onChange={handleChange}
        disabled={status === "sending"}
      />

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        required
        minLength={10}
        maxLength={5000}
        rows={5}
        value={values.message}
        onChange={handleChange}
        disabled={status === "sending"}
      />

      {status === "error" && (
        <p role="alert" className="contact-form__error">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

/* CSS for .contact-form__honeypot must visually hide the field without
   using display:none or visibility:hidden — some bots skip those and
   only avoid fields hidden via off-screen positioning:

   .contact-form__honeypot {
     position: absolute;
     left: -9999px;
     width: 1px;
     height: 1px;
     overflow: hidden;
   }
*/
