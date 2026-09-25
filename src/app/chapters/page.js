'use client';

/*
  chapters/page.js
  =================
  Chapter selection / world map page.
  Shows playable and locked chapters.
*/

import Link from '@/components/TransitionLink';
import Image from 'next/image';
import AccountPanel from '@/components/AccountPanel';
import { useProgress } from '@/hooks/useProgress';
import { CHAPTER_LIST, PLAYABLE_CHAPTERS } from '@/lib/chapterConfigs';
import {
  navGhostButtonClass,
  navPrimaryButtonClass,
  panelClass,
  siteFrame,
  softPanelClass,
} from '@/lib/gameUi';

const headingStyle = { fontFamily: 'var(--font-heading), serif' };
const bodyStyle = { fontFamily: 'var(--font-body), serif' };
const worldMapStyle = {
  backgroundImage: "url('/art/world-map-background.jpg')",
};

const toneCardStyles = {
  forest: {
    card: 'bg-emerald-500/10 border-emerald-300/30',
    glow: 'bg-emerald-400/25',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-slate-900',
    status: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    sigil: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100',
  },
  river: {
    card: 'bg-sky-500/10 border-sky-300/30',
    glow: 'bg-sky-400/25',
    button: 'bg-sky-400 hover:bg-sky-300 text-slate-950',
    status: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
    sigil: 'bg-sky-500/20 border-sky-400/40 text-sky-100',
  },
  cavern: {
    card: 'bg-amber-500/10 border-amber-300/30',
    glow: 'bg-amber-400/25',
    button: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
    status: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    sigil: 'bg-amber-500/20 border-amber-400/40 text-amber-100',
  },
  labyrinth: {
    card: 'bg-fuchsia-500/10 border-fuchsia-300/30',
    glow: 'bg-fuchsia-400/25',
    button: 'bg-fuchsia-400 hover:bg-fuchsia-300 text-slate-950',
    status: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30',
    sigil: 'bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-100',
  },
};

export default function ChaptersPage() {
  const { progress, isLoaded, resetProgress } = useProgress();
  const completedCount = PLAYABLE_CHAPTERS.reduce(
    (count, chapter) => count + (progress[chapter.progressKey] ? 1 : 0),
    0
  );
  const progressPercent = Math.round(
    (completedCount / PLAYABLE_CHAPTERS.length) * 100
  );

  return (
    <main
      className="min-h-screen bg-slate-950 text-white relative overflow-hidden"
      style={bodyStyle}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12] mix-blend-screen saturate-[0.8] sepia-[0.18]"
          style={worldMapStyle}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(2,6,23,0.58)_0%,_rgba(2,6,23,0.78)_48%,_rgba(2,6,23,0.92)_100%)]" />
        <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl float-slow" />
        <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl float-slow" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%)]" />
      </div>

      <div className="relative z-10">
        <header className={`${siteFrame} relative z-30 pt-10 pb-6 fade-in`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                World Map
              </p>
              <h1 className="mt-3 text-3xl font-semibold md:text-5xl" style={headingStyle}>
                World Map Hub
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Choose your next destination. Chapters 1 through 4 are currently playable,
                while the remaining realms stay sealed for future chapters.
              </p>
            </div>
            <div className="flex w-full flex-wrap gap-3 md:w-auto md:justify-end">
              <AccountPanel className="w-full sm:w-auto" />
              <Link className={`${navGhostButtonClass} w-full sm:w-auto`} href="/">
                Back to Home
              </Link>
              <Link
                className={`${navPrimaryButtonClass} w-full sm:w-auto`}
                href="/chapters/forest-of-variables"
              >
                Start Chapter 1
              </Link>
            </div>
          </div>
        </header>

        <section className={`${siteFrame} relative z-10 pb-16 fade-in`}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr]">
            <div className="space-y-6">
              <div className={`${panelClass} p-6 hover-lift`}>
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                  Map Briefing
                </p>
                <h2 className="mt-3 text-2xl font-semibold" style={headingStyle}>
                  The Codebook Atlas
                </h2>
                <p className="mt-3 leading-7 text-slate-300">
                  Four realms are now open: a forest of names, a river of decisions,
                  caverns built from repetition, and a labyrinth of lists. The remaining
                  lands stay locked until later.
                </p>
              </div>

              <div className={`${softPanelClass} p-6 hover-lift`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                    Progress
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset chapter progress?')) {
                        resetProgress();
                      }
                    }}
                    disabled={!isLoaded || completedCount === 0}
                    className="rounded-full border border-amber-300/40 px-3 py-1 text-xs text-amber-100 transition btn-press hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reset Demo Progress
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Progress:{' '}
                  <span className="font-semibold text-emerald-200">
                    {isLoaded ? completedCount : 0}
                  </span>{' '}
                  of {PLAYABLE_CHAPTERS.length} playable chapters completed
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${isLoaded ? progressPercent : 0}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-400">
                  Demo path: Home, Chapter 1, Chapter 2, Chapter 3, then Chapter 4.
                </p>
              </div>

              <div className={`${softPanelClass} p-6 hover-lift`}>
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                  Legend
                </p>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Playable chapter
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Completed chapter
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Locked chapter
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative overflow-hidden rounded-[2rem] p-4 sm:rounded-[2.5rem] sm:p-6 ${panelClass}`}>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.16] saturate-[0.84] sepia-[0.2]"
                style={worldMapStyle}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(2,6,23,0.28)_0%,_rgba(2,6,23,0.48)_45%,_rgba(2,6,23,0.72)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:32px_32px] opacity-40" />
              <div className="absolute inset-4 rounded-[1.5rem] border border-white/5 sm:inset-8 sm:rounded-[2rem]" />
              <div className="absolute left-4 right-4 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent sm:block sm:left-10 sm:right-10" />
              <div className="absolute top-10 bottom-10 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-sky-400/30 to-transparent sm:block" />
              <div className="absolute right-4 top-4 hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200 sm:block sm:right-6 sm:top-6">
                Compass
              </div>
              <div className="absolute left-10 top-14 hidden h-24 w-24 rounded-full border border-emerald-400/20 border-dashed md:block" />
              <div className="absolute right-12 bottom-14 hidden h-28 w-28 rounded-full border border-sky-400/20 border-dashed md:block" />
              <div className="absolute left-1/4 top-1/3 hidden h-3 w-3 rounded-full bg-emerald-400/70 shadow-[0_0_12px_rgba(16,185,129,0.6)] sm:block" />
              <div className="absolute right-1/3 top-1/2 hidden h-3 w-3 rounded-full bg-sky-400/70 shadow-[0_0_12px_rgba(56,189,248,0.6)] sm:block" />
              <div className="absolute left-1/2 bottom-1/4 hidden h-2 w-2 rounded-full bg-amber-400/70 sm:block" />

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                  Chapter Routes
                </p>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Follow the glowing routes to enter a realm. Locked lands remain sealed
                  until the codebook is restored.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-slate-950/45 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-amber-100/90">
                  Atlas Layer Active
                </div>
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {CHAPTER_LIST.map((chapter) => {
                    const isCompleted = chapter.progressKey
                      ? progress[chapter.progressKey]
                      : false;
                    const tone = toneCardStyles[chapter.tone] ?? null;
                    const statusLabel = isCompleted
                      ? 'Completed'
                      : chapter.playable
                        ? 'Playable'
                        : 'Locked';
                    const statusClasses = isCompleted
                      ? 'bg-amber-500/20 text-amber-100 border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                      : chapter.playable
                        ? tone?.status ?? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                        : 'bg-slate-500/20 text-slate-300 border-slate-400/20';
                    const cardClasses = chapter.playable
                      ? `relative overflow-hidden border hover-lift transition-all ${tone?.card ?? 'bg-white/5 border-white/10'} ${
                          isCompleted
                            ? 'shadow-[0_0_30px_rgba(251,191,36,0.2)]'
                            : 'shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                        }`
                      : 'relative overflow-hidden border border-white/5 bg-slate-900/40 opacity-60 sealed grayscale';
                    const buttonClasses = chapter.playable
                      ? isCompleted
                        ? 'bg-amber-500/30 text-amber-100 border border-amber-400/40'
                        : tone?.button ?? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
                      : 'bg-slate-700 text-slate-300 cursor-not-allowed';
                    const buttonLabel = chapter.playable
                      ? isCompleted
                        ? 'Revisit Chapter'
                        : 'Enter Chapter'
                      : 'Coming Soon';
                    const sigilClasses = isCompleted
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-100'
                      : chapter.playable
                        ? tone?.sigil ?? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100'
                        : 'bg-slate-700/30 border-slate-600/40 text-slate-300';

                    const content = (
                      <div
                        className={`${cardClasses} flex h-full flex-col rounded-3xl p-5 sm:p-6 fade-in`}
                        style={{ animationDelay: `${chapter.id * 0.04}s` }}
                      >
                        {chapter.playable ? (
                          <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl ${tone?.glow ?? 'bg-emerald-400/25'}`} />
                        ) : null}
                        {chapter.playable ? (
                          <div className="relative mb-4 h-32 overflow-hidden rounded-2xl border border-white/10">
                            <Image
                              src={chapter.bannerSrc}
                              alt={chapter.bannerAlt}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/18 to-transparent" />
                            <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-slate-950/55 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-100">
                              {chapter.bannerLabel}
                            </div>
                            <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[11px] text-slate-200">
                              {chapter.puzzleSummary}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/45 px-4 py-5 text-center">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                              Sealed Realm
                            </p>
                          </div>
                        )}
                        <div className="mb-4 flex items-center justify-between">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold ${sigilClasses}`}
                          >
                            {chapter.id}
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${statusClasses}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        <p className="text-xs text-slate-400">{chapter.chapter}</p>
                        <h2 className="mt-2 mb-3 text-xl font-semibold text-slate-100">
                          {chapter.title}
                        </h2>
                        <p className="mb-4 text-sm leading-6 text-slate-300">
                          {chapter.playable ? chapter.artDescription : chapter.theme}
                        </p>
                        <div className="mb-6 space-y-2 text-xs text-slate-400">
                          <p>Focus: {chapter.focus}</p>
                          {chapter.playable ? (
                            <p>Difficulty Path: {chapter.difficultyTrack}</p>
                          ) : null}
                        </div>
                        <div className={`mt-auto w-full rounded-2xl py-3 text-center text-sm font-semibold ${buttonClasses}`}>
                          {buttonLabel}
                        </div>
                      </div>
                    );

                    return chapter.playable ? (
                      <Link
                        key={chapter.id}
                        href={chapter.href}
                        className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={chapter.id}>{content}</div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
