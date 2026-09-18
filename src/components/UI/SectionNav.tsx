import { useState, useEffect } from "react";
import "./SectionNav.css";

const SECTIONS = [
  { id: "home",     label: "Home" },
  { id: "diary-1",  label: "Diary I" },
  { id: "diary-2",  label: "Diary II" },
  { id: "diary-3",  label: "Diary III" },
  { id: "surprise", label: "Surprise" },
];

export function SectionNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="section-nav" aria-label="Section navigation">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`nav-dot ${active === id ? "active" : ""}`}
          aria-label={`Navigate to ${label}`}
          title={label}
        />
      ))}
    </nav>
  );
}
