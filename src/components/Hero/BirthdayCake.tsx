import "./BirthdayCake.css";

export function BirthdayCake({ unlocked }: { unlocked: boolean }) {
  return (
    <div className={`cake-wrap ${unlocked ? "unlocked" : ""}`} aria-hidden="true">
      {/* Floating particles above cake */}
      <div className="cake-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`cp cp-${i + 1}`} />
        ))}
      </div>

      {/* Cake SVG */}
      <div className="cake-body">
        {/* Candles */}
        <div className="candles-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="candle-wrap">
              <div className="flame-wrap">
                <div className="flame" />
                <div className="flame-glow" />
              </div>
              <div className="candle" />
            </div>
          ))}
        </div>

        {/* Top tier */}
        <div className="cake-tier tier-top">
          <div className="tier-decoration">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="dot" />
            ))}
          </div>
        </div>

        {/* Middle tier */}
        <div className="cake-tier tier-mid">
          <div className="tier-ribbon" />
          <div className="tier-decoration">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="dot" />
            ))}
          </div>
        </div>

        {/* Bottom tier */}
        <div className="cake-tier tier-bot">
          <div className="tier-ribbon" />
          <div className="tier-decoration">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="dot" />
            ))}
          </div>
          {/* Base plate */}
          <div className="cake-plate" />
        </div>
      </div>

      {/* Outer glow */}
      <div className="cake-halo" />
    </div>
  );
}
