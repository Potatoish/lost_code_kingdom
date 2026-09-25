'use client';

/*
  page.js
  =========
  Homepage / landing page for The Lost Code Kingdom.
  This is an interactive quest dashboard that links to the playable chapters.
*/

import Image from 'next/image';
import { useState } from 'react';
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

const dashboardTabs = [
  { id: 'realms', label: 'Realms' },
  { id: 'puzzles', label: 'Puzzles' },
  { id: 'guide', label: 'Pip Guide' },
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
  const [activeDashboardTab, setActiveDashboardTab] = useState('realms');
  const [selectedChapterSlug, setSelectedChapterSlug] = useState(
    PLAYABLE_CHAPTERS[0]?.slug
  );
  const { progress, isLoaded } = useProgress();
  const selectedChapter =
    PLAYABLE_CHAPTERS.find((chapter) => chapter.slug === selectedChapterSlug) ??
    PLAYABLE_CHAPTERS[0];
  const selectedTone = toneStyles[selectedChapter?.tone] ?? toneStyles.forest;
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

        {/* Quest dashboard */}
        <section className={`${siteFrame} py-12 fade-in`}>
          <div className={`${panelClass} overflow-hidden p-4 sm:p-6 md:p-8`}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                  Quest Dashboard
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl" style={headingStyle}>
                  Pick, Preview, Play
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                  The kingdom is now grouped into quick views, so the home page feels
                  more like a game menu and less like a long scroll.
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

            <div className="mt-6 grid grid-cols-1 gap-2 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-2 sm:grid-cols-3">
              {dashboardTabs.map((tab) => {
                const isActive = activeDashboardTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDashboardTab(tab.id)}
                    aria-pressed={isActive}
                    className={`min-h-12 rounded-2xl px-4 py-3 text-sm font-semibold transition btn-press ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950 shadow-[0_14px_34px_rgba(16,185,129,0.22)]'
                        : 'border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 min-h-[32rem] rounded-[2rem] border border-white/10 bg-slate-950/55 p-4 sm:p-5 md:p-6">
              {activeDashboardTab === 'realms' ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                    {PLAYABLE_CHAPTERS.map((chapter) => {
                      const isSelected = selectedChapter.slug === chapter.slug;
                      const isCompleted = progress[chapter.progressKey];
                      const tone = toneStyles[chapter.tone];

                      return (
                        <button
                          key={chapter.slug}
                          type="button"
                          onClick={() => setSelectedChapterSlug(chapter.slug)}
                          className={`rounded-2xl border p-3 text-left transition btn-press ${
                            isSelected
                              ? `${tone.panel} ${tone.artBorder} shadow-[0_18px_42px_rgba(2,6,23,0.26)]`
                              : 'border-white/10 bg-white/[0.03] hover:bg-white/10'
                          }`}
                        >
                          <span className={`text-[11px] uppercase tracking-[0.24em] ${tone.accent}`}>
                            {chapter.chapter}
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-slate-100">
                            {chapter.title}
                          </span>
                          <span className="mt-2 block text-xs text-slate-400">
                            {isCompleted ? 'Completed' : chapter.cta}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className={`relative overflow-hidden rounded-3xl border p-5 ${selectedTone.panel}`}>
                    <div className={`absolute -right-14 -top-14 h-36 w-36 rounded-full blur-3xl ${selectedTone.glowOne}`} />
                    <div className={`absolute bottom-0 left-8 h-28 w-28 rounded-full blur-3xl ${selectedTone.glowTwo}`} />
                    <div className="relative grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <div>
                        <p className={`text-xs uppercase tracking-[0.32em] ${selectedTone.accent}`}>
                          {selectedChapter.chapter} Preview
                        </p>
                        <h3 className="mt-3 text-3xl font-semibold text-slate-100" style={headingStyle}>
                          {selectedChapter.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {selectedChapter.statusDescription}
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className={`${softPanelClass} rounded-2xl p-4`}>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                              Focus
                            </p>
                            <p className="mt-2 text-sm text-slate-200">{selectedChapter.focus}</p>
                          </div>
                          <div className={`${softPanelClass} rounded-2xl p-4`}>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                              Status
                            </p>
                            <p className="mt-2 text-sm text-slate-200">
                              {progress[selectedChapter.progressKey] ? 'Completed' : selectedChapter.cta}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <Link className={`${primaryButtonClass} w-full sm:w-auto`} href={selectedChapter.href}>
                            {progress[selectedChapter.progressKey] ? 'Revisit Chapter' : selectedChapter.cta}
                          </Link>
                          <Link className={`${secondaryButtonClass} w-full sm:w-auto`} href="/chapters">
                            World Map
                          </Link>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {CHAPTER_LIST.filter((chapter) => !chapter.playable).map((chapter) => (
                            <span
                              key={chapter.id}
                              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400"
                            >
                              {chapter.chapter}: Locked
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={`relative min-h-64 overflow-hidden rounded-2xl border ${selectedTone.artBorder}`}>
                        <Image
                          src={selectedChapter.bannerSrc}
                          alt={selectedChapter.bannerAlt}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        <div className={`absolute bottom-3 left-3 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${selectedTone.label}`}>
                          {selectedChapter.bannerLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeDashboardTab === 'puzzles' ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.6fr)]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                      Training Grounds
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-100" style={headingStyle}>
                      Puzzle Snapshots
                    </h3>
                    <p className="mt-4 leading-7 text-slate-300">
                      Each realm has five puzzles plus a Spell Lab. The snapshots give
                      you a quick read before jumping into the chapter.
                    </p>
                    <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                      {completedCount === PLAYABLE_CHAPTERS.length
                        ? 'All active realms cleared.'
                        : `${PLAYABLE_CHAPTERS.length - completedCount} active realm${PLAYABLE_CHAPTERS.length - completedCount === 1 ? '' : 's'} left to restore.`}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {PLAYABLE_CHAPTERS.map((chapter) => {
                      const tone = toneStyles[chapter.tone];

                      return (
                        <Link
                          key={chapter.slug}
                          href={chapter.href}
                          className={`block rounded-3xl border p-5 transition hover-lift ${tone.panel}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className={`text-xs uppercase tracking-[0.28em] ${tone.accent}`}>
                              {chapter.chapter}
                            </p>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
                              {chapter.puzzleSummary}
                            </span>
                          </div>
                          <h4 className="mt-3 text-lg font-semibold text-slate-100">
                            {chapter.snapshot.title}
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {chapter.snapshot.story}
                          </p>
                          <pre className={`${codeBlockClass} text-xs`} style={codeStyle}>
                            <code>{chapter.snapshot.code}</code>
                          </pre>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {activeDashboardTab === 'guide' ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                      Pip Guide
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-100" style={headingStyle}>
                      Companion Console
                    </h3>
                    <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                      Pip stays close while the lessons get sharper, with hints,
                      feedback, and chapter notes inside the playable realms.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {highlights.map((item) => (
                        <div key={item.title} className={`${softPanelClass} rounded-2xl p-4`}>
                          <h4 className="mb-2 text-base font-semibold text-emerald-200">
                            {item.title}
                          </h4>
                          <p className="text-sm leading-6 text-slate-300">{item.detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link className={`${primaryButtonClass} w-full sm:w-auto`} href="/chapters/forest-of-variables">
                        Begin Quest
                      </Link>
                      <Link className={`${secondaryButtonClass} w-full sm:w-auto`} href="/chapters">
                        Open World Map
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <PipDialogue
                      type="encouragement"
                      title="Pip the Python"
                      message="If a puzzle feels tough, trace it one step at a time. Harder magic still breaks down into readable lines."
                      note="Four realms are open, and Pip stays with you through all of them."
                      className="hover-lift"
                    />
                    <div className="relative h-52 overflow-hidden rounded-3xl border border-emerald-300/20 bg-emerald-500/10">
                      <Image
                        src="/art/pip-mascot-cutout.png"
                        alt="Pip the Python mascot"
                        fill
                        unoptimized
                        className="object-contain p-5"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
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
