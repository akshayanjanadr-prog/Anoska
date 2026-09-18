import { useState, useRef, useCallback, useEffect } from "react";

type AudioState = "idle" | "loading" | "playing" | "paused" | "error";

interface UseAudioReturn {
  state: AudioState;
  currentTime: number;
  duration: number;
  progress: number;
  toggle: () => void;
  seek: (fraction: number) => void;
  stop: () => void;
}

// Shared audio registry so we can stop all other players
const audioRegistry = new Set<() => void>();

export function useAudio(src: string): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setState("paused");
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    // Register the stop function
    const stopFn = stop;
    audioRegistry.add(stopFn);

    const onLoaded = () => {
      setDuration(audio.duration);
      setState("playing");
      audio.play().catch(() => setState("error"));
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setState("paused");
    const onError = () => setState("error");

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audioRegistry.delete(stopFn);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state === "playing") {
      audio.pause();
      setState("paused");
    } else {
      // Stop all other audio first
      audioRegistry.forEach((fn) => {
        if (fn !== stop) fn();
      });

      if (!audio.src || audio.src !== new URL(src, window.location.href).href) {
        setState("loading");
        audio.src = src;
        audio.load();
      } else {
        audio.play().catch(() => setState("error"));
        setState("playing");
      }
    }
  }, [state, src, stop]);

  const seek = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = fraction * duration;
  }, [duration]);

  const progress = duration > 0 ? currentTime / duration : 0;

  return { state, currentTime, duration, progress, toggle, seek, stop };
}
