import { useState, useEffect, useRef } from "react";
import { birthdayContent } from "../data/birthdayContent";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const STORAGE_KEY = "birthday_unlocked_2026";

function isBirthdayUnlocked(): boolean {
  // Check localStorage first
  if (localStorage.getItem(STORAGE_KEY) === "true") return true;
  // Then check real time
  const now = new Date();
  const unlocked = now >= birthdayContent.birthdayDate;
  if (unlocked) localStorage.setItem(STORAGE_KEY, "true");
  return unlocked;
}

export function useCountdown() {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (birthdayContent.DEV_MODE) {
      return birthdayContent.DEV_BIRTHDAY_UNLOCKED;
    }
    return isBirthdayUnlocked();
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [prevTime, setPrevTime] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (unlocked) return;

    const tick = () => {
      const now = new Date();
      const target = birthdayContent.DEV_MODE
        ? new Date(now.getTime() + 1000)
        : birthdayContent.birthdayDate;

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        localStorage.setItem(STORAGE_KEY, "true");
        setUnlocked(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setPrevTime(timeLeft);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  return { unlocked, timeLeft, prevTime };
}
