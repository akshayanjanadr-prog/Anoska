import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "../../hooks/useCountdown";
import { BirthdayCake } from "./BirthdayCake";
import { Countdown } from "./Countdown";
import { MusicButton } from "./MusicButton";
import { birthdayContent } from "../../data/birthdayContent";
import "./BirthdayHero.css";

const NAME = "ANOSKA";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.6 + i * 0.12,
      duration: 0.8,
      ease: EASE,
    },
  }),
};

export function BirthdayHero() {
  const { unlocked } = useCountdown();

  return (
    <section id="home" className="hero-section">
      {/* Radial background */}
      <div className="hero-radial" aria-hidden="true" />

      <div className="hero-content">
        {/* Top label */}
        <motion.div
          className="hero-label"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="label-line" />
          <span>{birthdayContent.hero.countdownLabel}</span>
          <span className="label-line" />
        </motion.div>

        {/* ── ANOSKA name — always shown, cinematic ── */}
        <div className="hero-name-wrap" aria-label="Anoska">
          <div className="hero-name-glow" aria-hidden="true" />
          <div className="hero-name-letters" aria-hidden="true">
            {NAME.split("").map((letter, i) => (
              <motion.span
                key={i}
                className="hero-name-letter"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.p
            className="hero-name-sub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.9 }}
          >
            ✦ &nbsp; My Paapa &nbsp; ✦
          </motion.p>
        </div>

        {/* Main heading — before/after birthday */}
        <AnimatePresence mode="wait">
          {unlocked ? (
            <motion.div
              key="birthday"
              className="hero-heading-wrap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="hero-heading hero-heading--birthday">
                Happy 16th Birthday
                <span className="heart-accent"> ❤️</span>
              </h1>
            </motion.div>
          ) : (
            <motion.div
              key="countdown"
              className="hero-heading-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="hero-heading">
                {birthdayContent.hero.beforeBirthday}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cake */}
        <motion.div
          className="hero-cake"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <BirthdayCake unlocked={unlocked} />
        </motion.div>

        {/* Countdown or birthday sparkle text */}
        <AnimatePresence mode="wait">
          {unlocked ? (
            <motion.p
              key="bday-msg"
              className="hero-birthday-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
            >
              ✦ &nbsp; Today is your day &nbsp; ✦
            </motion.p>
          ) : (
            <motion.div
              key="countdown-comp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Countdown />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9 }}
        >
          <MusicButton />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="scroll-chevron" />
          <span className="scroll-text">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}
