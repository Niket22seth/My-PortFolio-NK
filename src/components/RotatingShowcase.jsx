// src/components/RotatingShowcase.jsx
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./RotatingShowcase.css";

/**
 * items: array of { key, render() } — render returns JSX for that item's content.
 * holdMs: how long each item stays fully visible before transitioning (default 2500ms).
 */
export default function RotatingShowcase({ items, holdMs = 2500, ariaLabel }) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null); // set briefly during a transition, for the crossfade
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const clearPrevRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || paused || items.length <= 1) return;

    timerRef.current = setTimeout(() => {
      setPrevIndex(index);
      setIndex((i) => (i + 1) % items.length);
      // drop the outgoing item from the DOM once its fade-out finishes
      clearPrevRef.current = setTimeout(() => setPrevIndex(null), 320);
    }, holdMs);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(clearPrevRef.current);
    };
  }, [index, paused, holdMs, items.length, reducedMotion]);

  const incomingFromRight = index % 2 === 0;

  if (reducedMotion) {
    return (
      <div className="rotating-showcase rotating-showcase--static" aria-label={ariaLabel}>
        {items.map((item) => (
          <div key={item.key} className="rotating-showcase__static-item">
            {item.render()}
          </div>
        ))}
      </div>
    );
  }

  const current = items[index];
  const previous = prevIndex !== null ? items[prevIndex] : null;

  return (
    <div
      className="rotating-showcase"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {previous && (
        <div key={`out-${previous.key}`} className="rotating-showcase__item rotating-showcase__item--leaving">
          {previous.render()}
        </div>
      )}

      <div
        key={`in-${current.key}`}
        className={`rotating-showcase__item ${
          incomingFromRight ? "rotating-showcase__item--from-right" : "rotating-showcase__item--from-left"
        }`}
      >
        {current.render()}
      </div>

      <div className="rotating-showcase__dots" role="tablist" aria-hidden="true">
        {items.map((item, i) => (
          <span
            key={item.key}
            className={`rotating-showcase__dot ${i === index ? "rotating-showcase__dot--active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
