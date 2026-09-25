'use client';

/*
  ConfettiBurst
  =============
  Lightweight confetti overlay for chapter completion moments.
  Uses a deterministic set of pieces (no randomness) to avoid hydration issues.
*/

const PIECES = [
  { left: 8, delay: 0, duration: 2.4, rotate: 12, color: '#34d399' },
  { left: 16, delay: 0.1, duration: 2.6, rotate: -18, color: '#38bdf8' },
  { left: 24, delay: 0.05, duration: 2.2, rotate: 25, color: '#fbbf24' },
  { left: 32, delay: 0.12, duration: 2.8, rotate: -8, color: '#a7f3d0' },
  { left: 40, delay: 0.18, duration: 2.5, rotate: 18, color: '#bae6fd' },
  { left: 48, delay: 0.08, duration: 2.3, rotate: -22, color: '#fcd34d' },
  { left: 56, delay: 0.15, duration: 2.7, rotate: 10, color: '#34d399' },
  { left: 64, delay: 0.2, duration: 2.4, rotate: -12, color: '#38bdf8' },
  { left: 72, delay: 0.04, duration: 2.6, rotate: 20, color: '#fbbf24' },
  { left: 80, delay: 0.14, duration: 2.3, rotate: -6, color: '#a7f3d0' },
  { left: 12, delay: 0.22, duration: 2.7, rotate: 16, color: '#bae6fd' },
  { left: 20, delay: 0.3, duration: 2.5, rotate: -14, color: '#fcd34d' },
  { left: 36, delay: 0.26, duration: 2.8, rotate: 8, color: '#34d399' },
  { left: 44, delay: 0.32, duration: 2.4, rotate: -20, color: '#38bdf8' },
  { left: 52, delay: 0.28, duration: 2.6, rotate: 14, color: '#fbbf24' },
  { left: 68, delay: 0.34, duration: 2.5, rotate: -10, color: '#a7f3d0' },
  { left: 76, delay: 0.38, duration: 2.7, rotate: 22, color: '#bae6fd' },
  { left: 88, delay: 0.4, duration: 2.6, rotate: -16, color: '#fcd34d' },
];

export default function ConfettiBurst({ className = '' }) {
  return (
    <div className={`confetti-burst ${className}`.trim()} aria-hidden="true">
      {PIECES.map((piece, index) => (
        <span
          key={`${piece.left}-${index}`}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            '--confetti-rotate': `${piece.rotate + 160}deg`,
          }}
        />
      ))}
    </div>
  );
}
