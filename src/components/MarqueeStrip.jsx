// src/components/MarqueeStrip.jsx
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./MarqueeStrip.css";

/**
 * children: array of React nodes, each one "item" in the strip.
 * Renders the list twice back-to-back inside a native horizontally-
 * scrollable container. A requestAnimationFrame loop auto-scrolls it,
 * looping seamlessly once it passes one full set. Click-and-drag (mouse)
 * lets a user manually scroll left/right, which pauses autoplay while
 * dragging. Touch users get native swipe scrolling for free from the
 * browser — no custom handling needed there.
 * Falls back to a static wrapped grid (no scroll, no animation) under
 * prefers-reduced-motion.
 */
export default function MarqueeStrip({
  children,
  ariaLabel,
  speed = 40 /* px per second */,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef(null);
  const setWidthRef = useRef(0); // width of one full set of items, for the loop wrap
  const [paused, setPaused] = useState(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  // measure one full set's width so we know when to wrap the loop
  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      const firstSet = container.querySelector(".marquee__set");
      if (firstSet)
        setWidthRef.current = firstSet.getBoundingClientRect().width;
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [reducedMotion]);

  // autoplay loop
  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    function tick(ts) {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!paused && !draggingRef.current && setWidthRef.current > 0) {
        container.scrollLeft += speed * dt;
        if (container.scrollLeft >= setWidthRef.current) {
          container.scrollLeft -= setWidthRef.current;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [paused, speed, reducedMotion]);

  // mouse drag-to-scroll — touch gets native scrolling instead (see CSS touch-action)
  function handlePointerDown(e) {
    if (e.pointerType === "touch") return;
    const container = containerRef.current;
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = container.scrollLeft;
    container.setPointerCapture(e.pointerId);
    container.classList.add("marquee--dragging");
  }

  function handlePointerMove(e) {
    if (!draggingRef.current) return;
    const container = containerRef.current;
    const delta = e.clientX - dragStartXRef.current;
    let next = dragStartScrollRef.current - delta;

    // wrap while dragging past either edge, so dragging never runs out of track
    const setWidth = setWidthRef.current;
    if (setWidth > 0) {
      if (next < 0) next += setWidth;
      if (next >= setWidth) next -= setWidth;
    }
    container.scrollLeft = next;
  }

  function endDrag(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    containerRef.current?.classList.remove("marquee--dragging");
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // pointer may already be released — safe to ignore
    }
  }

  if (reducedMotion) {
    return (
      <div className="marquee marquee--static" aria-label={ariaLabel}>
        {children}
      </div>
    );
  }

  return (
    <div
      className="marquee"
      aria-label={ariaLabel}
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="marquee__track">
        <div className="marquee__set">{children}</div>
        <div className="marquee__set" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
