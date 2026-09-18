import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { GoldenParticles } from "./components/Background/GoldenParticles";
import { LoadingScreen } from "./components/UI/LoadingScreen";
import { SectionNav } from "./components/UI/SectionNav";
import { BirthdayHero } from "./components/Hero/BirthdayHero";
import { DiarySection } from "./components/Diary/DiarySection";
import { SpecialSurprise } from "./components/Surprise/SpecialSurprise";
import { birthdayContent } from "./data/birthdayContent";
import "./styles/global.css";
import "./App.css";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <>
      {/* ── Loading screen ─────────────────── */}
      <AnimatePresence>
        {!loaded && <LoadingScreen onDone={handleLoaded} key="loading" />}
      </AnimatePresence>

      {/* ── Background particles (always visible) ─ */}
      <GoldenParticles />

      {/* ── Floating nav dots ─────────────────── */}
      {loaded && <SectionNav />}

      {/* ── Main content ──────────────────────── */}
      <main className="site-main" aria-label="Birthday website">
        {/* Home */}
        <BirthdayHero />

        {/* Diaries */}
        {birthdayContent.diaries.map((diary, i) => (
          <DiarySection
            key={diary.title}
            diary={diary}
            index={i}
            showTransition={i < birthdayContent.diaries.length - 1}
          />
        ))}

        {/* Special Surprise */}
        <SpecialSurprise />
      </main>
    </>
  );
}
