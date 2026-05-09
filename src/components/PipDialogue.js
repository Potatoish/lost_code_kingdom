'use client';

/*
  PipDialogue
  ===========
  A reusable dialogue card for Pip, the snake guide.
  Supports different message types: intro, hint, encouragement, success.
*/

import Image from 'next/image';

const DIALOGUE_STYLES = {
  intro: {
    label: 'Intro',
    accent: 'text-emerald-200',
    badge: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
    frame: 'bg-emerald-500/10 border-emerald-300/20',
    bubble: 'bg-slate-950/45 border-white/10',
    bar: 'from-emerald-400/60 via-emerald-400/10 to-transparent',
    mascotVars: {
      '--pip-glow-color': 'rgba(52, 211, 153, 0.44)',
      '--pip-glow-secondary': 'rgba(125, 211, 252, 0.18)',
      '--pip-outline-color': 'rgba(167, 243, 208, 0.32)',
      '--pip-frame-start': 'rgba(52, 211, 153, 0.12)',
      '--pip-frame-end': 'rgba(125, 211, 252, 0.06)',
      '--pip-shadow-color': 'rgba(74, 222, 128, 0.42)',
      '--pip-tilt': '-4deg',
      '--pip-scale': '1.02',
      '--pip-float-duration': '5.8s',
      '--pip-talk-duration': '3.3s',
      '--pip-float-distance': '5px',
    },
  },
  hint: {
    label: 'Hint',
    accent: 'text-sky-200',
    badge: 'bg-sky-500/20 text-sky-100 border-sky-400/30',
    frame: 'bg-sky-500/10 border-sky-300/20',
    bubble: 'bg-slate-950/45 border-white/10',
    bar: 'from-sky-400/60 via-sky-400/10 to-transparent',
    mascotVars: {
      '--pip-glow-color': 'rgba(56, 189, 248, 0.36)',
      '--pip-glow-secondary': 'rgba(52, 211, 153, 0.18)',
      '--pip-outline-color': 'rgba(125, 211, 252, 0.3)',
      '--pip-frame-start': 'rgba(56, 189, 248, 0.12)',
      '--pip-frame-end': 'rgba(52, 211, 153, 0.06)',
      '--pip-shadow-color': 'rgba(56, 189, 248, 0.38)',
      '--pip-tilt': '3deg',
      '--pip-scale': '1',
      '--pip-float-duration': '5.4s',
      '--pip-talk-duration': '2.9s',
      '--pip-float-distance': '4px',
    },
  },
  encouragement: {
    label: 'Encouragement',
    accent: 'text-amber-200',
    badge: 'bg-amber-500/20 text-amber-100 border-amber-400/30',
    frame: 'bg-amber-500/10 border-amber-300/20',
    bubble: 'bg-slate-950/45 border-white/10',
    bar: 'from-amber-400/60 via-amber-400/10 to-transparent',
    mascotVars: {
      '--pip-glow-color': 'rgba(251, 191, 36, 0.3)',
      '--pip-glow-secondary': 'rgba(52, 211, 153, 0.18)',
      '--pip-outline-color': 'rgba(253, 230, 138, 0.26)',
      '--pip-frame-start': 'rgba(251, 191, 36, 0.1)',
      '--pip-frame-end': 'rgba(52, 211, 153, 0.06)',
      '--pip-shadow-color': 'rgba(251, 191, 36, 0.34)',
      '--pip-tilt': '-2deg',
      '--pip-scale': '1.05',
      '--pip-float-duration': '6.2s',
      '--pip-talk-duration': '3.6s',
      '--pip-float-distance': '5px',
    },
  },
  success: {
    label: 'Success',
    accent: 'text-emerald-200',
    badge: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
    frame: 'bg-emerald-900/20 border-emerald-300/20',
    bubble: 'bg-slate-950/45 border-white/10',
    bar: 'from-emerald-400/60 via-amber-400/15 to-transparent',
    mascotVars: {
      '--pip-glow-color': 'rgba(52, 211, 153, 0.5)',
      '--pip-glow-secondary': 'rgba(251, 191, 36, 0.2)',
      '--pip-outline-color': 'rgba(167, 243, 208, 0.34)',
      '--pip-frame-start': 'rgba(52, 211, 153, 0.14)',
      '--pip-frame-end': 'rgba(251, 191, 36, 0.08)',
      '--pip-shadow-color': 'rgba(52, 211, 153, 0.46)',
      '--pip-tilt': '4deg',
      '--pip-scale': '1.06',
      '--pip-float-duration': '5s',
      '--pip-talk-duration': '2.7s',
      '--pip-float-distance': '6px',
    },
  },
};

export default function PipDialogue({
  type = 'hint',
  title = 'Pip the Python',
  message,
  note,
  className = '',
}) {
  const style = DIALOGUE_STYLES[type] ?? DIALOGUE_STYLES.hint;
  const showSuccessSparkles = type === 'success';

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border p-4 backdrop-blur-sm fade-in sm:p-5 lg:p-6 ${style.frame} ${className}`}
    >
      {/* Accent bar */}
      <div
        className={`pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${style.bar}`}
      />
      {/* Soft card glow accent */}
      <div
        className="pointer-events-none absolute -top-8 right-6 h-20 w-20 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4 lg:gap-5">
        {/* Same Pip image, but with different pose/glow feel per dialogue type. */}
        <div
          className="pip-avatar relative mx-auto w-full max-w-[5.25rem] shrink-0 sm:mx-0 sm:mt-1 sm:max-w-[5.75rem] md:max-w-[6.25rem]"
          style={style.mascotVars}
        >
          <div className="pip-avatar__glow" />
          <div className="pip-avatar__frame" />
          <div className="pip-avatar__inner">
            <div className="pip-avatar__sprite relative aspect-square">
              <Image
                src="/art/pip-mascot-cutout.png"
                alt="Pip the Python speaking"
                fill
                unoptimized
                className="pip-avatar__image"
              />
            </div>
          </div>
        </div>
        <div className="pip-dialogue__bubble-shell relative flex-1 sm:pt-1">
          {/* Success dialogue gets a few tiny sparkles for a celebratory feel. */}
          {showSuccessSparkles ? (
            <div className="pip-dialogue__sparkles" aria-hidden="true">
              <span className="pip-dialogue__sparkle pip-dialogue__sparkle--one" />
              <span className="pip-dialogue__sparkle pip-dialogue__sparkle--two" />
              <span className="pip-dialogue__sparkle pip-dialogue__sparkle--three" />
            </div>
          ) : null}
          {/* Bubble tail and connector help Pip feel like the actual speaker. */}
          <div className="pip-dialogue__connector pip-dialogue__connector--mobile" />
          <div className="pip-dialogue__connector pip-dialogue__connector--desktop" />
          <div className="pip-dialogue__tail pip-dialogue__tail--mobile" />
          <div className="pip-dialogue__tail pip-dialogue__tail--desktop" />
          <div className="pip-dialogue__bubble-glow" />
          <div
            className={`pip-dialogue__bubble relative rounded-[1.6rem] border p-4 sm:p-5 ${style.bubble}`}
          >
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <p className={`text-xs uppercase tracking-[0.3em] ${style.accent}`}>
                Pip Says
              </p>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${style.badge}`}
              >
                {style.label}
              </span>
            </div>
            <p className="text-slate-100 font-semibold mt-2">{title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-200 sm:text-[15px] md:text-base">
              {message}
            </p>
            {note ? (
              <p className="mt-3 text-xs leading-6 text-slate-300 sm:text-sm">
                {note}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
