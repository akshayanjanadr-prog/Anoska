import { motion } from "framer-motion";
import { DiaryBook } from "./DiaryBook";
import { useIntersection } from "../../hooks/useIntersection";
import type { DiaryConfig } from "../../data/birthdayContent";
import "./DiarySection.css";

interface DiarySectionProps {
  diary: DiaryConfig;
  index: number;
  showTransition?: boolean;
}

export function DiarySection({ diary, index, showTransition }: DiarySectionProps) {
  const { ref: headerRef, isVisible: headerVisible } = useIntersection(0.3);
  const { ref: bookRef,   isVisible: bookVisible   } = useIntersection(0.2);
  const { ref: transRef,  isVisible: transVisible  } = useIntersection(0.5);

  return (
    <>
      <section
        className={`diary-section diary-section--${index + 1}`}
        id={`diary-${index + 1}`}
        aria-label={diary.title}
      >
        {/* Section radial */}
        <div className="diary-radial" aria-hidden="true" />

        <div className="section-content">
          {/* Header */}
          <div
            ref={headerRef}
            className={`diary-header reveal ${headerVisible ? "visible" : ""}`}
          >
            <span className="diary-num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="diary-header-text">
              <h2 className="diary-title">{diary.title}</h2>
              <p  className="diary-subtitle">{diary.subtitle}</p>
            </div>
            <div className="diary-header-line" />
          </div>

          {/* Book */}
          <motion.div
            ref={bookRef}
            className="diary-book-wrap"
            initial={{ opacity: 0, y: 40 }}
            animate={bookVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <DiaryBook diary={diary} />
          </motion.div>
        </div>
      </section>

      {/* Transition bridge */}
      {showTransition && (
        <div className="diary-transition" ref={transRef}>
          <motion.p
            className={`transition-text reveal ${transVisible ? "visible" : ""}`}
            initial={{ opacity: 0 }}
            animate={transVisible ? { opacity: 1 } : {}}
            transition={{ duration: 1.2 }}
          >
            {diary.transitionText}
          </motion.p>
          <div className="transition-ornament" aria-hidden="true">
            <span className="t-line" />
            <span className="t-star">✦</span>
            <span className="t-line" />
          </div>
        </div>
      )}
    </>
  );
}
