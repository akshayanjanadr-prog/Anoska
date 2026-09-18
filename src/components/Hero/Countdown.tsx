import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "../../hooks/useCountdown";
import "./Countdown.css";

function Digit({ value, label }: { value: number; label: string }) {
  const [prev, setPrev] = useState(value);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (value !== prev) {
      setPrev(value);
      setAnimKey((k) => k + 1);
    }
  }, [value, prev]);

  const display = String(value).padStart(2, "0");

  return (
    <div className="countdown-unit">
      <div className="digit-box">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`${animKey}-${display}`}
            className="digit-num"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="digit-label">{label}</span>
    </div>
  );
}

export function Countdown() {
  const { unlocked, timeLeft } = useCountdown();

  if (unlocked) return null;

  return (
    <div className="countdown-wrap">
      <motion.p
        className="countdown-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Something beautiful is about to begin...
      </motion.p>

      <motion.div
        className="countdown-digits"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Digit value={timeLeft.days}    label="Days" />
        <span className="sep">:</span>
        <Digit value={timeLeft.hours}   label="Hours" />
        <span className="sep">:</span>
        <Digit value={timeLeft.minutes} label="Minutes" />
        <span className="sep">:</span>
        <Digit value={timeLeft.seconds} label="Seconds" />
      </motion.div>

      <motion.p
        className="countdown-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Counting down to a day made just for her...
      </motion.p>
    </div>
  );
}
