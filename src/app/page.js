'use client';

/*
  page.js
  =========
  Homepage / landing page for The Lost Code Kingdom.
  This is a scrollable intro that links to the playable chapters.
*/

import Image from 'next/image';
import AccountPanel from '@/components/AccountPanel';
import Link from '@/components/TransitionLink';
import PipDialogue from '@/components/PipDialogue';
import SiteLogo from '@/components/SiteLogo';
import { useProgress } from '@/hooks/useProgress';
import { CHAPTER_LIST, PLAYABLE_CHAPTERS } from '@/lib/chapterConfigs';
import {
  codeBlockClass,
  navGhostButtonClass,
  navPrimaryButtonClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
  siteFrame,
  softPanelClass,
} from '@/lib/gameUi';

const headingStyle = { fontFamily: 'var(--font-heading), serif' };
const bodyStyle = { fontFamily: 'var(--font-body), serif' };
const codeStyle = { fontFamily: 'var(--font-code), monospace' };

const highlights = [
  {
    title: 'Story-Driven Quest',
    detail: 'Every chapter restores a different realm and reveals more of the kingdom.',
  },
  {
    title: 'Escalating Challenges',
    detail: 'The journey starts approachable, then ramps into sharper logic and pattern puzzles.',
  },
  {
    title: 'Guided by Pip',
    detail: 'Your snake companion gives hints, lore, and encouragement without breaking the adventure vibe.',
  },
];

const toneStyles = {
  forest: {
    panel: 'border-emerald-300/20 bg-emerald-500/10',
    artBorder: 'border-emerald-300/30',
    accent: 'text-emerald-200',
    glowOne: 'bg-emerald-400/20',
    glowTwo: 'bg-emerald-300/20',
    label: 'border-emerald-200/30 bg-slate-950/55 text-emerald-100',
  },
  river: {
    panel: 'border-sky-300/20 bg-sky-500/10',
    artBorder: 'border-sky-300/30',
    accent: 'text-sky-200',
    glowOne: 'bg-sky-400/20',
    glowTwo: 'bg-sky-300/20',
    label: 'border-sky-200/30 bg-slate-950/55 text-sky-100',
  },
  cavern: {
    panel: 'border-amber-300/20 bg-amber-500/10',
    artBorder: 'border-amber-300/30',
    accent: 'text-amber-200',
    glowOne: 'bg-amber-400/20',
    glowTwo: 'bg-violet-400/20',
    label: 'border-amber-200/30 bg-slate-950/55 text-amber-100',
  },
  labyrinth: {
    panel: 'border-fuchsia-300/20 bg-fuchsia-500/10',
    artBorder: 'border-fuchsia-300/30',
    accent: 'text-fuchsia-200',
    glowOne: 'bg-fuchsia-400/20',
    glowTwo: 'bg-cyan-300/20',
    label: 'border-fuchsia-200/30 bg-slate-950/55 text-fuchsia-100',
  },
};

export default function Home() {
  const { progress, isLoaded } = useProgress();
  const completedCount = PLAYABLE_CHAPTERS.reduce(
    (count, chapter) => count + (progress[chapter.progressKey] ? 1 : 0),
    0
  );

  return (
    <main
      className="min-h-screen bg-slate-950 text-white relative overflow-hidden"
      style={bodyStyle}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-24 h-96 w-96 rounded-full bg-emerald-500/25 blur-3xl float-slow" />
        <div className="absolute top-1/4 -right-32 h-[28rem] w-[28rem] rounded-full bg-sky-500/25 blur-3xl float-slow" />
        <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-amber-400/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(16,185,129,0.18),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,_rgba(56,189,248,0.16),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,_rgba(251,191,36,0.12),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(2,6,23,0.2)_0%,_rgba(2,6,23,0.7)_55%,_rgba(2,6,23,0.9)_100%)]" />
      </div>

      <div className="relative z-10">
        {/* Top navigation */}
        <header className={`${siteFrame} pt-8 pb-10`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <SiteLogo className="w-16 shrink-0 sm:w-20" priority />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                  The Lost Code Kingdom
                </p>
                <p className="text-sm text-slate-300">
                  A magical Python adventure with four active realms
                </p>
              </div>
            </div>

            <nav className="flex w-full flex-wrap gap-3 text-sm lg:w-auto lg:justify-end">
              <AccountPanel className="w-full sm:w-auto" />
              <Link
                className={`${navGhostButtonClass} w-full sm:w-auto`}
                href="/chapters"
              >
                World Map
              </Link>
              <Link
                className={`${navPrimaryButtonClass} w-full sm:w-auto`}
                href="/chapters/forest-of-variables"
              >
                Start Quest
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className={`${siteFrame} relative pb-16 fade-in`}>
          <div className="absolute -top-16 left-4 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl float-slow sm:left-6" />
          <div className="absolute top-20 right-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl float-slow" />
          <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,390px)]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-emerald-200">
                  Enter the Codebook
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  4 chapters playable now
                </span>
              </div>
              <h1
                className="mb-6 bg-gradient-to-r from-emerald-200 via-sky-200 to-amber-200 bg-clip-text text-4xl font-bold leading-tight text-transparent drop-shadow-[0_8px_30px_rgba(16,185,129,0.35)] sm:text-5xl md:text-7xl lg:text-8xl"
                style={headingStyle}
              >
                The Lost Code Kingdom
              </h1>
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-emerald-200">
                A Fantasy Python Adventure
              </p>
              <p className="mb-6 text-lg leading-8 text-slate-200 md:text-2xl">
                A magical world has been corrupted by broken code. Restore each
                realm, solve real Python puzzles, and bring the codebook back to life.
              </p>
              <p className="mb-8 text-base leading-7 text-slate-400 md:text-lg">
                Pip, your loyal python companion, will guide you through forests of
                forgotten names, rivers that hesitate at every fork, and caverns where
                patterns echo forever. The further you travel, the sharper the puzzles become.
              </p>

              <div className={`${panelClass} mb-8 p-5`}>
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-emerald-200">
                  Choose Your Path
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    className={`${primaryButtonClass} w-full sm:w-auto`}
                    href="/chapters/forest-of-variables"
                  >
                    Begin Quest
                  </Link>
                  <Link
                    className={`${secondaryButtonClass} w-full sm:w-auto`}
                    href="/chapters"
                  >
                    Open World Map
                  </Link>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Recommended path: Chapter 1, Chapter 2, Chapter 3, then Chapter 4.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className={`${softPanelClass} rounded-2xl p-4 hover-lift`}
                  >
                    <h3 className="mb-2 text-base font-semibold text-emerald-200">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 xl:pt-2">
              <PipDialogue
                type="hint"
                title="Pip the Python"
                message="The first puzzles teach you the language. The later ones ask you to trace, compare, and predict the magic more carefully."
                note="Hint: Every chapter gets a little tougher than the last."
                className="shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover-lift"
              />

              <div className={`${panelClass} p-6 shadow-[0_30px_70px_rgba(2,6,23,0.65)] backdrop-blur-sm hover-lift`}>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
                    Spellbook Console
                  </p>
                  <span className="text-xs text-slate-400">4 realms open</span>
                </div>
                <div className="rounded-2xl border border-emerald-400/20 bg-slate-950/70 p-4">
                  <p className="mb-2 text-sm text-emerald-200">
                    Chapter 4: List Labyrinth
                  </p>
                  <p className="mb-4 text-xs text-slate-400">
                    Maze relics stay organized when lists keep every item in order.
                  </p>
                  <pre className="overflow-x-auto text-sm text-emerald-100" style={codeStyle}>
                    <code>{"relics = ['Key', 'Lantern', 'Map']\nprint(relics[1])"}</code>
                  </pre>
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  The current build now includes four playable chapters.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter previews */}
        <section className={`${siteFrame} py-16 fade-in`}>
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                World Map
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl" style={headingStyle}>
                Current Questline
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Begin in the Forest of Variables, follow the River of Conditions,
                descend into the Looping Caverns, then map the List Labyrinth. The
                deeper realms remain locked for future chapters.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              Progress:{' '}
              <span className="font-semibold text-emerald-200">
                {isLoaded ? completedCount : 0}
              </span>{' '}
              of {PLAYABLE_CHAPTERS.length} playable chapters completed
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {PLAYABLE_CHAPTERS.map((chapter) => {
              const tone = toneStyles[chapter.tone];

              return (
                <div
                  key={chapter.slug}
                  className={`relative overflow-hidden rounded-3xl border p-5 hover-lift ${tone.panel}`}
                >
                  <div className={`absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl ${tone.glowOne}`} />
                  <div className={`absolute bottom-0 left-10 h-24 w-24 rounded-full blur-2xl ${tone.glowTwo}`} />
                  <div className="relative">
                    <p className={`text-xs uppercase tracking-[0.3em] ${tone.accent}`}>
                      {chapter.chapter} Art
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-100">
                      {chapter.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">{chapter.artDescription}</p>
                    <div className={`relative mt-4 h-36 overflow-hidden rounded-2xl border ${tone.artBorder}`}>
                      <Image
                        src={chapter.bannerSrc}
                        alt={chapter.bannerAlt}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
                      <div className={`absolute bottom-3 left-3 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${tone.label}`}>
                        {chapter.bannerLabel}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {CHAPTER_LIST.map((chapter) => {
              const isCompleted = chapter.progressKey ? progress[chapter.progressKey] : false;
              const statusLabel = isCompleted
                ? 'Completed'
                : chapter.playable
                  ? 'Playable'
                  : 'Locked';
              const statusClasses = isCompleted
                ? 'bg-amber-500/20 text-amber-100 border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                : chapter.playable
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                  : 'bg-slate-500/20 text-slate-300 border-slate-400/20';
              const cardClasses = chapter.playable
                ? `bg-white/5 border border-white/10 hover:border-emerald-300/40 hover-lift ${
                    isCompleted ? 'shadow-[0_0_30px_rgba(251,191,36,0.15)]' : ''
                  }`
                : 'bg-slate-900/40 border border-white/5 opacity-70 sealed';
              const buttonClasses = chapter.playable
                ? isCompleted
                  ? 'bg-amber-500/30 text-amber-100 border border-amber-400/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
                : 'bg-slate-700 text-slate-300 cursor-not-allowed';
              const buttonLabel = chapter.playable
                ? isCompleted
                  ? 'Revisit Chapter'
                  : chapter.cta
                : chapter.cta;

              const content = (
                <div className={`${cardClasses} flex h-full flex-col rounded-3xl p-6 transition`}>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${statusClasses}`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-xs text-slate-400">{chapter.chapter}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-slate-100">
                    {chapter.title}
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-slate-300">{chapter.theme}</p>
                  <p className="mb-6 text-xs text-slate-400">Focus: {chapter.focus}</p>
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
        </section>

        {/* Puzzle previews */}
        <section className={`${siteFrame} py-16 fade-in`}>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                Training Grounds
              </p>
              <h2 className="mt-3 text-3xl font-semibold" style={headingStyle}>
                Puzzle Snapshots
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Each chapter carries five escalating puzzles, from warm-up checks to
                stronger reasoning challenges that demand tracing and prediction.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
              {PLAYABLE_CHAPTERS.map((chapter) => (
                <div
                  key={chapter.slug}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 hover-lift"
                >
                  <h3 className="mb-2 text-lg font-semibold text-emerald-200">
                    {chapter.snapshot.title}
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-slate-300">
                    {chapter.snapshot.story}
                  </p>
                  <pre className={`${codeBlockClass} text-xs`} style={codeStyle}>
                    <code>{chapter.snapshot.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pip guide section */}
        <section className={`${siteFrame} pb-20 fade-in`}>
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-emerald-900/40 via-slate-900/60 to-slate-950/60 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                  Pip Guide
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl" style={headingStyle}>
                  Your Companion in Every Chapter
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                  Pip keeps the journey readable, gives friendly hints, and explains new
                  Python ideas in simple language even when the puzzles start asking for deeper thinking.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <PipDialogue
                  type="encouragement"
                  title="Pip the Python"
                  message="If a puzzle feels tough, trace it one step at a time. Harder magic still breaks down into readable lines."
                  note="Four realms are open, and Pip stays with you through all of them."
                  className="hover-lift"
                />
                <Link className={`${primaryButtonClass} w-full`} href="/chapters">
                  Open World Map
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`${siteFrame} pb-12 text-sm text-slate-400`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>The first four realms are open. Chapter 1 still makes the best starting path.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className={`${navGhostButtonClass} w-full sm:w-auto`}
                href="/chapters/forest-of-variables"
              >
                Begin Quest
              </Link>
              <Link
                className={`${navPrimaryButtonClass} w-full sm:w-auto`}
                href="/chapters"
              >
                Open World Map
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
