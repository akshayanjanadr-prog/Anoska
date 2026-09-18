import { useState } from "react";
import { useAudio } from "../../hooks/useAudio";
import { birthdayContent } from "../../data/birthdayContent";
import "./MusicButton.css";

export function MusicButton() {
  const { state, toggle } = useAudio(birthdayContent.audio.background);
  const [bars] = useState(() => Array.from({ length: 5 }));
  const isPlaying = state === "playing";

  return (
    <div className="music-btn-wrap">
      <button
        className={`music-btn ${isPlaying ? "playing" : ""}`}
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play birthday song"}
      >
        <span className="music-icon">{isPlaying ? "♫" : "♪"}</span>
        <span className="music-label">
          {state === "loading"
            ? "Loading..."
            : state === "error"
            ? "♫ Song Coming Soon"
            : isPlaying
            ? "Now Playing"
            : "Play Our Song"}
        </span>

        {/* Equalizer bars */}
        {isPlaying && (
          <span className="eq-bars" aria-hidden="true">
            {bars.map((_, i) => (
              <span key={i} className={`eq-bar eq-bar-${i + 1}`} />
            ))}
          </span>
        )}
      </button>
    </div>
  );
}
