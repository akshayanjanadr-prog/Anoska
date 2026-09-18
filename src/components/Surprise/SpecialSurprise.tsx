import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useIntersection } from "../../hooks/useIntersection";
import { birthdayContent } from "../../data/birthdayContent";
import "./SpecialSurprise.css";

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const bars = Array.from({ length: 20 });
  return (
    <div className={`waveform ${isPlaying ? "playing" : ""}`} aria-hidden="true">
      {bars.map((_, i) => (
        <span key={i} className={`wave-bar wb-${(i % 5) + 1}`} />
      ))}
    </div>
  );
}

const isVideo = (src: string) =>
  src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov");

export function SpecialSurprise() {
  const { ref, isVisible } = useIntersection(0.3);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaState, setMediaState] = useState<"idle" | "loading" | "playing" | "paused" | "error">("idle");
  const progressRef = useRef<HTMLDivElement>(null);

  const src = birthdayContent.audio.surprise;
  const useVideoEl = isVideo(src);

  // Build the media element once
  useEffect(() => {
    const el = useVideoEl
      ? document.createElement("video")
      : document.createElement("audio");
    el.preload = "none";
    if (useVideoEl) {
      (el as HTMLVideoElement).playsInline = true;
    }
    mediaRef.current = el as HTMLVideoElement | HTMLAudioElement;

    const onLoaded = () => {
      setDuration(el.duration);
      setMediaState("playing");
      setIsPlaying(true);
      el.play().catch(() => setMediaState("error"));
    };
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onEnded = () => { setIsPlaying(false); setMediaState("paused"); };
    const onError = () => setMediaState("error");

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
      el.pause();
      el.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
      setMediaState("paused");
    } else {
      if (!el.src || el.src !== new URL(src, window.location.href).href) {
        setMediaState("loading");
        el.src = src;
        el.load();
      } else {
        el.play().catch(() => setMediaState("error"));
        setIsPlaying(true);
        setMediaState("playing");
      }
    }
  }, [isPlaying, src]);

  const seek = useCallback((fraction: number) => {
    const el = mediaRef.current;
    if (!el || !duration) return;
    el.currentTime = fraction * duration;
  }, [duration]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, fraction)));
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  // Sync video element into DOM container
  const videoContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || !useVideoEl) return;
    const el = mediaRef.current as HTMLVideoElement | null;
    if (el && !node.contains(el)) {
      el.className = "surprise-video";
      el.controls = false;
      node.appendChild(el);
    }
  }, [useVideoEl]);

  return (
    <section id="surprise" className="surprise-section" aria-label="Special Surprise">
      <div className="surprise-radial" aria-hidden="true" />

      <div ref={ref} className="section-content">
        {/* Intro text */}
        <motion.div
          className="surprise-intro"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        >
          <span className="surprise-label">Special Surprise</span>
          <p className="surprise-intro-text">
            {birthdayContent.surprise.introText}
          </p>
          <h2 className="surprise-title">
            {birthdayContent.surprise.dedicationText}
          </h2>
        </motion.div>

        {/* Player card */}
        <motion.div
          className="player-card"
          initial={{ opacity: 0, scale: 0.93, y: 40 }}
          animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: 0.2 }}
        >
          {/* Video player OR vinyl art */}
          {useVideoEl ? (
            <div className="video-frame-wrap">
              <div className="video-frame-inner" ref={videoContainerRef} />
              {isPlaying && <div className="video-glow" aria-hidden="true" />}
            </div>
          ) : (
            <div className={`album-art-wrap ${isPlaying ? "spinning" : ""}`}>
              <img
                src={birthdayContent.surprise.albumArt}
                alt="Album art"
                className="album-art"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="album-art-fallback" aria-hidden="true">
                <span className="art-icon">♫</span>
              </div>
              <div className="album-groove" aria-hidden="true" />
              {isPlaying && <div className="album-glow" />}
            </div>
          )}

          {/* Song info */}
          <div className="song-info">
            <p className="song-title">{birthdayContent.surprise.songTitle}</p>
            <p className="song-artist">{birthdayContent.surprise.artistName}</p>
          </div>

          {/* Waveform visualizer */}
          <Waveform isPlaying={isPlaying} />

          {/* Progress bar */}
          <div className="progress-section">
            <span className="time">{formatTime(currentTime)}</span>
            <div
              className="progress-track"
              onClick={handleProgressClick}
              ref={progressRef}
              role="slider"
              aria-label="Progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="progress-thumb"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
            <span className="time">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="player-controls">
            <button
              className={`play-btn ${isPlaying ? "playing" : ""}`}
              onClick={toggle}
              aria-label={isPlaying ? "Pause" : "Play personal surprise"}
              disabled={mediaState === "loading"}
            >
              {mediaState === "loading" ? (
                <span className="loading-dot" />
              ) : isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {mediaState === "error" && (
            <p className="player-error">
              Media file not found — add special-surprise.mp4 to /public/audio/
            </p>
          )}
        </motion.div>

        {/* Final message */}
        <motion.div
          className="final-message"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: 0.5 }}
        >
          <div className="message-ornament" aria-hidden="true">✦</div>
          <blockquote className="message-text">
            {birthdayContent.finalMessage}
          </blockquote>
          <div className="message-ornament" aria-hidden="true">✦</div>
        </motion.div>

        {/* Ending */}
        <motion.div
          className="ending"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          <p className="ending-made">Made with ❤️</p>
          <p className="ending-for">{birthdayContent.endingText}</p>
          <span className="ending-star">✦</span>
        </motion.div>
      </div>
    </section>
  );
}
