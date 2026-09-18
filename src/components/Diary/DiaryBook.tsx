import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipe } from "../../hooks/useSwipe";
import { useIntersectionToggle } from "../../hooks/useIntersection";
import type { DiaryConfig } from "../../data/birthdayContent";
import "./DiaryBook.css";

interface DiaryBookProps {
  diary: DiaryConfig;
}

const AUTO_INTERVAL = 3000;

function DiaryPage({
  photo,
  index,
  total,
}: {
  photo: DiaryConfig["photos"][0];
  index: number;
  total: number;
}) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="diary-page-inner">
      {/* Photo */}
      <div className="diary-photo-frame">
        {imgError ? (
          <div className="diary-placeholder">
            <span className="placeholder-icon">✦</span>
            <span className="placeholder-text">Memory Loading...</span>
          </div>
        ) : (
          <>
            {!loaded && (
              <div className="diary-img-skeleton" />
            )}
            <img
              src={photo.image}
              alt={photo.caption}
              className={`diary-photo ${loaded ? "loaded" : ""}`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}
        {/* Corner decorations */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </div>

      {/* Caption */}
      <div className="diary-caption">
        <p className="caption-text">{photo.caption}</p>
        <span className="caption-page">{index + 1} / {total}</span>
      </div>
    </div>
  );
}

export function DiaryBook({ diary }: DiaryBookProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { ref, isVisible } = useIntersectionToggle(0.4);

  const total = diary.photos.length;

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev") => {
      setCurrent(idx);
      setDirection(dir);
    },
    []
  );

  const goNext = useCallback(() => {
    if (current < total - 1) goTo(current + 1, "next");
    else goTo(0, "next"); // loop
  }, [current, total, goTo]);

  const goPrev = useCallback(() => {
    if (current > 0) goTo(current - 1, "prev");
    else goTo(total - 1, "prev");
  }, [current, total, goTo]);

  // Auto-play only when visible
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isVisible) {
      timerRef.current = setTimeout(goNext, AUTO_INTERVAL);
    }
  }, [isVisible, goNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isVisible, resetTimer]);

  const { onTouchStart, onTouchEnd } = useSwipe(
    () => { goNext(); resetTimer(); },
    () => { goPrev(); resetTimer(); }
  );

  // Page-turn animation variants
  const variants = {
    enter: (dir: string) => ({
      rotateY: dir === "next" ? 90 : -90,
      opacity: 0,
      scale: 0.95,
      transformOrigin: dir === "next" ? "left center" : "right center",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: "center center",
    },
    exit: (dir: string) => ({
      rotateY: dir === "next" ? -90 : 90,
      opacity: 0,
      scale: 0.95,
      transformOrigin: dir === "next" ? "right center" : "left center",
    }),
  };

  return (
    <div className="diary-book-container" ref={ref}>
      {/* Book spine shadow */}
      <div className="book-spine" aria-hidden="true" />

      {/* Main book body */}
      <div
        className="book-body"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label={`${diary.title} photo diary`}
      >
        {/* Left page — decorative */}
        <div className="book-left-page" aria-hidden="true">
          <div className="left-page-content">
            <div className="left-ornament">✦</div>
            <p className="left-title">{diary.title}</p>
            <p className="left-subtitle">{diary.subtitle}</p>
            <div className="left-divider" />
            <p className="left-num">
              {String(current + 1).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Right page — photo */}
        <div className="book-right-page" style={{ perspective: "1200px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="page-motion-wrap"
              style={{ backfaceVisibility: "hidden" }}
            >
              <DiaryPage
                photo={diary.photos[current]}
                index={current}
                total={total}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="diary-controls" role="navigation" aria-label="Diary navigation">
        <button
          className="diary-btn"
          onClick={() => { goPrev(); resetTimer(); }}
          aria-label="Previous page"
          disabled={current === 0}
        >
          ‹
        </button>

        {/* Dot indicators */}
        <div className="diary-dots">
          {diary.photos.map((_, i) => (
            <button
              key={i}
              className={`diary-dot ${i === current ? "active" : ""}`}
              onClick={() => { goTo(i, i > current ? "next" : "prev"); resetTimer(); }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="diary-btn"
          onClick={() => { goNext(); resetTimer(); }}
          aria-label="Next page"
          disabled={current === total - 1}
        >
          ›
        </button>
      </div>
    </div>
  );
}
