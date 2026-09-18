import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(onDone, 400);
            return 100;
          }
          return p + Math.random() * 12 + 4;
        });
      }, 100);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="loading-content">
        <motion.div
          className="loading-star"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          ✦
        </motion.div>

        <motion.p
          className="loading-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          A little surprise is waiting...
        </motion.p>

        {/* Progress line */}
        <div className="loading-bar-track">
          <motion.div
            className="loading-bar-fill"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
