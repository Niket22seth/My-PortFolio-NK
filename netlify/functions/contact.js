// netlify/functions/contact.js
// Netlify Function — becomes available at /.netlify/functions/contact
// (or at /api/contact if you add the redirect shown at the bottom of this file)
//
// Env vars required — set in Netlify dashboard:
//   Site settings → Environment variables (NOT a committed .env file)
//   RESEND_API_KEY   - your Resend API key
//   CONTACT_TO_EMAIL - where you want submissions delivered (your inbox)
//   CONTACT_FROM_EMAIL - a verified sender on your Resend domain
//   SITE_ORIGIN - your deployed site's origin, for CORS

import { Resend } from "resend";

// NOTE: constructed lazily inside the handler (not at module load) so a
// missing RESEND_API_KEY produces a clean JSON error response instead of
// crashing the whole function before your error handling ever runs.

// --- very small in-memory rate limiter -------------------------------
// NOTE: Netlify Functions are stateless/cold-started per invocation more
// aggressively than Vercel's, so this in-memory map persists even less
// reliably here — treat it as "better than nothing," not a real limiter.
// See the note at the bottom of this file for the upgrade path.
const submissions = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (submissions.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

// --- validation --------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body) {
  const errors = [];
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || name.length < 2 || name.length > 100) {
    errors.push("Name must be between 2 and 100 characters.");
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    errors.push("A valid email address is required.");
  }
  if (!message || message.length < 10 || message.length > 5000) {
    errors.push("Message must be between 10 and 5000 characters.");
  }

  return { errors, clean: { name, email, message } };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.SITE_ORIGIN || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid request body." }),
    };
  }

  // --- honeypot spam check ---
  // Hidden field named "company" — real users never fill it in.
  // Silently "succeed" so bots don't adapt.
  if (body.company) {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) };
  }

  const ip =
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    event.headers["client-ip"] ||
    "unknown";

  if (isRateLimited(ip)) {
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Too many requests. Try again in a minute." }),
    };
  }

  const { errors, clean } = validate(body);
  if (errors.length) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: errors.join(" ") }),
    };
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
    console.error(
      "Missing required env vars: RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL not set."
    );
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Server is misconfigured. Try emailing directly." }),
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: clean.email,
      subject: `Portfolio contact form: ${clean.name}`,
      text: `From: ${clean.name} <${clean.email}>\n\n${clean.message}`,
    });

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to send message. Try emailing directly." }),
    };
  }
}

// --- to call this as /api/contact instead of /.netlify/functions/contact ---
// Add a netlify.toml at your project root with:
//
//   [[redirects]]
//     from = "/api/*"
//     to = "/.netlify/functions/:splat"
//     status = 200
//
// Then ContactForm.jsx's fetch("/api/contact") works unchanged.

// --- if abuse becomes a real problem later ---------------------------
// Swap the in-memory rate limiter for Upstash Redis (`@upstash/ratelimit`)
// or Netlify's own rate-limiting (available on some plans) — both persist
// across invocations, unlike this Map. Not needed at portfolio traffic.
