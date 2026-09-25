'use client';

/*
  ChapterAdventurePage
  ====================
  Shared chapter page shell for the playable realms.
  It renders story, concept notes, puzzle flow, and completion rewards
  from a chapter config object so new chapters stay consistent.
*/

import Image from 'next/image';
import Link from '@/components/TransitionLink';
import { useEffect, useState } from 'react';
import AccountPanel from '@/components/AccountPanel';
import PipDialogue from '@/components/PipDialogue';
import ConfettiBurst from '@/components/ConfettiBurst';
import PythonPlayground from '@/components/PythonPlayground';
import { useProgress } from '@/hooks/useProgress';
import {
  chapterFrame,
  codeBlockClass,
  inputClass,
  navGhostButtonClass,
  navPrimaryButtonClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
  softPanelClass,
} from '@/lib/gameUi';

const headingStyle = { fontFamily: 'var(--font-heading), serif' };
const bodyStyle = { fontFamily: 'var(--font-body), serif' };
const codeStyle = { fontFamily: 'var(--font-code), monospace' };

const THEME_STYLES = {
  forest: {
    accentText: 'text-emerald-200',
    artPanel: 'bg-emerald-500/10 border-emerald-300/20',
    artBorder: 'border-emerald-300/30',
    artTag: 'border-emerald-200/30 bg-slate-950/55 text-emerald-100',
    portraitPanel: 'bg-slate-900/70 border-emerald-300/20',
    portraitRing: 'border-emerald-300/40 bg-emerald-500/20',
    conceptBorder: 'border-emerald-400/20',
    playGlowOne: 'bg-emerald-400/15',
    playGlowTwo: 'bg-emerald-300/15',
    playBadge: 'text-emerald-200 bg-emerald-500/10 border border-emerald-300/20',
    progressBar: 'bg-emerald-400',
    completionPanel: 'bg-emerald-500/10 border-emerald-300/30',
    completionGlowOne: 'bg-emerald-400/20',
    completionGlowTwo: 'bg-amber-400/20',
    backgroundOne: 'bg-emerald-500/20',
    backgroundTwo: 'bg-sky-500/20',
    backgroundThree: 'bg-amber-400/10',
  },
  river: {
    accentText: 'text-sky-200',
    artPanel: 'bg-sky-500/10 border-sky-300/20',
    artBorder: 'border-sky-300/30',
    artTag: 'border-sky-200/30 bg-slate-950/55 text-sky-100',
    portraitPanel: 'bg-slate-900/70 border-sky-300/20',
    portraitRing: 'border-sky-300/40 bg-sky-500/20',
    conceptBorder: 'border-sky-400/20',
    playGlowOne: 'bg-sky-400/15',
    playGlowTwo: 'bg-emerald-300/15',
    playBadge: 'text-sky-200 bg-sky-500/10 border border-sky-300/20',
    progressBar: 'bg-sky-400',
    completionPanel: 'bg-sky-500/10 border-sky-300/30',
    completionGlowOne: 'bg-sky-400/20',
    completionGlowTwo: 'bg-emerald-400/20',
    backgroundOne: 'bg-sky-500/20',
    backgroundTwo: 'bg-emerald-500/20',
    backgroundThree: 'bg-amber-400/10',
  },
  cavern: {
    accentText: 'text-amber-200',
    artPanel: 'bg-amber-500/10 border-amber-300/20',
    artBorder: 'border-amber-300/30',
    artTag: 'border-amber-200/30 bg-slate-950/55 text-amber-100',
    portraitPanel: 'bg-slate-900/70 border-amber-300/20',
    portraitRing: 'border-amber-300/40 bg-amber-500/20',
    conceptBorder: 'border-amber-400/20',
    playGlowOne: 'bg-amber-400/15',
    playGlowTwo: 'bg-violet-300/15',
    playBadge: 'text-amber-200 bg-amber-500/10 border border-amber-300/20',
    progressBar: 'bg-amber-400',
    completionPanel: 'bg-amber-500/10 border-amber-300/30',
    completionGlowOne: 'bg-amber-400/20',
    completionGlowTwo: 'bg-violet-400/20',
    backgroundOne: 'bg-amber-500/20',
    backgroundTwo: 'bg-violet-500/20',
    backgroundThree: 'bg-sky-400/10',
  },
  labyrinth: {
    accentText: 'text-fuchsia-200',
    artPanel: 'bg-fuchsia-500/10 border-fuchsia-300/20',
    artBorder: 'border-fuchsia-300/30',
    artTag: 'border-fuchsia-200/30 bg-slate-950/55 text-fuchsia-100',
    portraitPanel: 'bg-slate-900/70 border-fuchsia-300/20',
    portraitRing: 'border-fuchsia-300/40 bg-fuchsia-500/20',
    conceptBorder: 'border-fuchsia-400/20',
    playGlowOne: 'bg-fuchsia-400/15',
    playGlowTwo: 'bg-cyan-300/15',
    playBadge: 'text-fuchsia-200 bg-fuchsia-500/10 border border-fuchsia-300/20',
    progressBar: 'bg-fuchsia-400',
    completionPanel: 'bg-fuchsia-500/10 border-fuchsia-300/30',
    completionGlowOne: 'bg-fuchsia-400/20',
    completionGlowTwo: 'bg-cyan-400/20',
    backgroundOne: 'bg-fuchsia-500/20',
    backgroundTwo: 'bg-cyan-500/20',
    backgroundThree: 'bg-emerald-400/10',
  },
};

const DIFFICULTY_STYLES = {
  'Warm-Up': 'bg-emerald-500/15 text-emerald-100 border-emerald-300/30',
  Apprentice: 'bg-sky-500/15 text-sky-100 border-sky-300/30',
  Adept: 'bg-amber-500/15 text-amber-100 border-amber-300/30',
  Challenger: 'bg-violet-500/15 text-violet-100 border-violet-300/30',
  Expert: 'bg-rose-500/15 text-rose-100 border-rose-300/30',
};

const CHAPTER_DECK_TABS = [
  { id: 'play', label: 'Play' },
  { id: 'lab', label: 'Lab' },
  { id: 'briefing', label: 'Briefing' },
  { id: 'codebook', label: 'Codebook' },
  { id: 'reward', label: 'Reward' },
];

const SPELLBOOK_BY_TONE = {
  forest: [
    {
      title: 'Store a Value',
      note: 'A variable keeps a value under a name so you can use it later.',
      spell: "spirit_name = 'Liora'",
    },
    {
      title: 'Print a Variable',
      note: 'print() shows the value inside a variable.',
      spell: 'print(spirit_name)',
    },
    {
      title: 'Assign with =',
      note: 'One equals sign stores a value. The variable name goes on the left.',
      spell: 'spirit_power = 7',
    },
    {
      title: 'Reassign a Value',
      note: 'A variable can use its old value to become a new value.',
      spell: 'lantern = lantern + 3',
    },
    {
      title: 'Join Text',
      note: 'String pieces can be joined when every piece is text.',
      spell: "name + ' the ' + title",
    },
  ],
  river: [
    {
      title: 'Ask with if',
      note: 'An if branch runs only when its condition is true.',
      spell: "if direction == 'left':",
    },
    {
      title: 'Compare Values',
      note: 'Use comparison when you want to ask whether two values match.',
      spell: 'direction == target',
    },
    {
      title: 'Choose a Branch',
      note: 'A condition should ask a question instead of storing a new value.',
      spell: "direction == 'right'",
    },
    {
      title: 'Try elif',
      note: 'elif checks another path only after the if above it fails.',
      spell: "elif weather == 'mist':",
    },
    {
      title: 'Combine Logic',
      note: 'and needs both sides to be true, while not flips a boolean.',
      spell: 'has_key and not gate_open',
    },
  ],
  cavern: [
    {
      title: 'Use range()',
      note: 'range() creates the numbers a counted loop will step through.',
      spell: 'range(3)',
    },
    {
      title: 'Stop Before the End',
      note: 'range() stops before the number you give it.',
      spell: 'range(stop)',
    },
    {
      title: 'Repeat with for',
      note: 'A for loop repeats a block for each value in a sequence.',
      spell: 'for echo in range(3):',
    },
    {
      title: 'Track a Total',
      note: 'A loop can update a running total each time it repeats.',
      spell: 'total = total + crystal',
    },
    {
      title: 'Control while',
      note: 'A while loop keeps going until its condition becomes false.',
      spell: 'while steps > 0:',
    },
  ],
  labyrinth: [
    {
      title: 'Make a List',
      note: 'A list keeps several values together inside one variable.',
      spell: "relics = ['Key', 'Lantern', 'Map']",
    },
    {
      title: 'Use an Index',
      note: 'Indexes choose one item, and Python starts counting at 0.',
      spell: 'relics[index]',
    },
    {
      title: 'Count Items',
      note: 'len() tells you how many items a list contains.',
      spell: 'len(paths)',
    },
    {
      title: 'Add an Item',
      note: 'append() places a new item at the end of a list.',
      spell: "paths.append('center')",
    },
    {
      title: 'Slice a List',
      note: 'A slice copies part of a list from a start point up to a stop point.',
      spell: 'runes[start:stop]',
    },
  ],
};

export default function ChapterAdventurePage({ chapter }) {
  const { progress, markComplete } = useProgress();
  const [activePanel, setActivePanel] = useState('play');
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [shownHints, setShownHints] = useState({});
  const [playgroundSolved, setPlaygroundSolved] = useState(false);
  const [showCompletionBurst, setShowCompletionBurst] = useState(false);
  const theme = THEME_STYLES[chapter.tone] ?? THEME_STYLES.forest;
  const spellbookEntries =
    chapter.spellbook?.entries ?? SPELLBOOK_BY_TONE[chapter.tone] ?? [];

  const totalPuzzles = chapter.puzzles.length;
  const playgroundRequired = Boolean(chapter.playground);
  const solvedCount = chapter.puzzles.filter(
    (puzzle) => results[puzzle.id] === 'success'
  ).length;
  const storedCompletion = progress[chapter.progressKey];
  const playgroundRequirementMet = !playgroundRequired || playgroundSolved || storedCompletion;
  const totalObjectives = totalPuzzles + (playgroundRequired ? 1 : 0);
  const clearedObjectives = solvedCount + (playgroundRequirementMet ? 1 : 0);
  const chapterRequirementsMet =
    solvedCount === totalPuzzles && playgroundRequirementMet;
  const isChapterComplete = storedCompletion || chapterRequirementsMet;
  const displaySolvedCount = isChapterComplete ? totalPuzzles : solvedCount;
  const currentPuzzleData = chapter.puzzles[currentPuzzle];
  const currentResult = results[currentPuzzleData.id] ?? null;
  const currentAnswer = answers[currentPuzzleData.id] ?? '';
  const isCurrentHintShown = Boolean(shownHints[currentPuzzleData.id]);
  const canAdvance = isChapterComplete || currentResult === 'success';
  const progressPercent = Math.round((clearedObjectives / totalObjectives) * 100);
  const statusLabel = isChapterComplete
    ? 'Completed'
    : solvedCount === totalPuzzles && playgroundRequired && !playgroundRequirementMet
      ? 'Spell Lab Needed'
      : 'In Progress';
  const visibleDeckTabs = CHAPTER_DECK_TABS.filter(
    (tab) => playgroundRequired || tab.id !== 'lab'
  );

  useEffect(() => {
    if (chapterRequirementsMet && !storedCompletion) {
      markComplete(chapter.progressKey);
    }
  }, [chapter.progressKey, chapterRequirementsMet, markComplete, storedCompletion]);

  useEffect(() => {
    if (!showCompletionBurst) return undefined;

    const timeoutId = window.setTimeout(() => {
      setShowCompletionBurst(false);
    }, 3600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showCompletionBurst]);

  function setAnswer(puzzleId, value) {
    setAnswers((previous) => ({ ...previous, [puzzleId]: value }));
    setResults((previous) => ({ ...previous, [puzzleId]: null }));
  }

  function handleChoice(puzzle, choice) {
    const isCorrect = choice === puzzle.answer;
    const wasAlreadySolved = results[puzzle.id] === 'success';
    const nextSolvedCount = solvedCount + (isCorrect && !wasAlreadySolved ? 1 : 0);

    if (
      isCorrect &&
      !storedCompletion &&
      nextSolvedCount === totalPuzzles &&
      playgroundRequirementMet
    ) {
      setShowCompletionBurst(true);
      setActivePanel('reward');
    } else if (
      isCorrect &&
      playgroundRequired &&
      !playgroundRequirementMet &&
      nextSolvedCount === totalPuzzles
    ) {
      setActivePanel('lab');
    }

    setAnswers((previous) => ({ ...previous, [puzzle.id]: choice }));
    setResults((previous) => ({
      ...previous,
      [puzzle.id]: isCorrect ? 'success' : 'fail',
    }));
  }

  function handleInputCheck(puzzle) {
    const submittedValue = answers[puzzle.id] ?? '';
    const isCorrect = puzzle.validate(submittedValue);
    const wasAlreadySolved = results[puzzle.id] === 'success';
    const nextSolvedCount = solvedCount + (isCorrect && !wasAlreadySolved ? 1 : 0);

    if (
      isCorrect &&
      !storedCompletion &&
      nextSolvedCount === totalPuzzles &&
      playgroundRequirementMet
    ) {
      setShowCompletionBurst(true);
      setActivePanel('reward');
    } else if (
      isCorrect &&
      playgroundRequired &&
      !playgroundRequirementMet &&
      nextSolvedCount === totalPuzzles
    ) {
      setActivePanel('lab');
    }

    setResults((previous) => ({
      ...previous,
      [puzzle.id]: isCorrect ? 'success' : 'fail',
    }));
  }

  function handlePlaygroundSolved() {
    if (!storedCompletion && solvedCount === totalPuzzles) {
      setShowCompletionBurst(true);
      setActivePanel('reward');
    } else {
      setActivePanel('play');
    }

    setPlaygroundSolved(true);
  }

  function showHint(puzzleId) {
    setShownHints((previous) => ({ ...previous, [puzzleId]: true }));
  }

  function isSpellUnlocked(index) {
    if (isChapterComplete) return true;

    const linkedPuzzle = chapter.puzzles[index];
    return linkedPuzzle ? results[linkedPuzzle.id] === 'success' : false;
  }

  const currentStatusClass =
    currentResult === 'success'
      ? 'status-success'
      : currentResult === 'fail'
        ? 'status-fail'
        : '';
  const unlockedSpellCount = spellbookEntries.filter((_, index) =>
    isSpellUnlocked(index)
  ).length;

  return (
    <main
      className="min-h-screen bg-slate-950 text-white relative overflow-hidden"
      style={bodyStyle}
    >
      {showCompletionBurst ? (
        <ConfettiBurst className="confetti-burst--screen" />
      ) : null}

      {/* Background atmosphere */}
      <div className="absolute inset-0">
        <div className={`absolute -top-24 -left-10 h-72 w-72 rounded-full blur-3xl float-slow ${theme.backgroundOne}`} />
        <div className={`absolute top-1/3 -right-20 h-80 w-80 rounded-full blur-3xl float-slow ${theme.backgroundTwo}`} />
        <div className={`absolute bottom-0 left-1/4 h-96 w-96 rounded-full blur-3xl ${theme.backgroundThree}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
      </div>

      <div className="relative z-10">
        {/* Top navigation */}
        <header className={`${chapterFrame} pt-10 pb-6`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-xs uppercase tracking-[0.4em] ${theme.accentText}`}>
                {chapter.chapter}
              </p>
              <h1
                className="mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl"
                style={headingStyle}
              >
                {chapter.title}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                {chapter.statusDescription}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <span className="uppercase tracking-[0.3em] text-slate-400">
                  Status
                </span>
                <span
                  className={`rounded-full border px-3 py-1 ${
                    isChapterComplete
                      ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
                      : statusLabel === 'Spell Lab Needed'
                        ? 'bg-amber-500/20 text-amber-100 border-amber-400/30'
                      : 'bg-slate-500/20 text-slate-200 border-slate-400/30'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-wrap gap-3 md:w-auto md:justify-end">
              <AccountPanel className="w-full sm:w-auto" />
              <Link
                className={`${navGhostButtonClass} w-full sm:w-auto`}
                href="/chapters"
              >
                World Map
              </Link>
              <Link
                className={`${navPrimaryButtonClass} w-full sm:w-auto`}
                href="/"
              >
                Home
              </Link>
            </div>
          </div>
        </header>

        {/* Chapter deck navigation */}
        <section className={`${chapterFrame} py-4 fade-in`}>
          <div className={`${panelClass} p-4`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className={`text-xs uppercase tracking-[0.32em] ${theme.accentText}`}>
                  Mission Deck
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Stay in one mode, then switch when you need story, lab, spells, or rewards.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:min-w-[34rem]">
                {visibleDeckTabs.map((tab) => {
                  const isActive = activePanel === tab.id;
                  const tabNote =
                    tab.id === 'play'
                      ? `${displaySolvedCount}/${totalPuzzles}`
                      : tab.id === 'lab'
                        ? playgroundRequirementMet
                          ? 'Clear'
                          : 'Need'
                        : tab.id === 'reward'
                          ? isChapterComplete
                            ? 'Ready'
                            : 'Lock'
                          : '';

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActivePanel(tab.id)}
                      aria-pressed={isActive}
                      className={`min-h-12 rounded-2xl border px-3 py-2 text-center text-sm font-semibold transition btn-press ${
                        isActive
                          ? 'border-emerald-300/50 bg-emerald-400 text-slate-950 shadow-[0_14px_34px_rgba(16,185,129,0.22)]'
                          : 'border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="block">{tab.label}</span>
                      {tabNote ? (
                        <span
                          className={`mt-1 block text-[10px] uppercase tracking-[0.18em] ${
                            isActive ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {tabNote}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-all ${theme.progressBar}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Puzzles: {displaySolvedCount} of {totalPuzzles}</span>
              {playgroundRequired ? (
                <span>Lab: {playgroundRequirementMet ? 'Cleared' : 'Required'}</span>
              ) : null}
              <span>Chapter flow: {clearedObjectives} of {totalObjectives}</span>
            </div>
          </div>
        </section>

        {activePanel === 'briefing' ? (
          <>
        {/* Story intro */}
        <section className={`${chapterFrame} py-6 fade-in`}>
          <div className={`${panelClass} p-6 md:p-8`}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <h2 className={`text-2xl font-semibold ${theme.accentText}`} style={headingStyle}>
                  Story Intro
                </h2>
                <p className="mt-3 leading-7 text-slate-300">{chapter.storyIntro}</p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className={`${softPanelClass} p-4`}>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                      Focus
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{chapter.focus}</p>
                  </div>
                  <div className={`${softPanelClass} p-4`}>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                      Puzzles
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{chapter.puzzleSummary}</p>
                  </div>
                  <div className={`${softPanelClass} p-4`}>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                      Difficulty
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{chapter.difficultyTrack}</p>
                  </div>
                </div>
              </div>

              <div className={`relative overflow-hidden rounded-3xl border p-4 ${theme.artPanel}`}>
                <div className={`absolute -top-12 -right-12 h-28 w-28 rounded-full blur-3xl ${theme.completionGlowOne}`} />
                <div className={`absolute bottom-0 left-6 h-24 w-24 rounded-full blur-2xl ${theme.completionGlowTwo}`} />
                <div className="relative">
                  <p className={`text-xs uppercase tracking-[0.3em] ${theme.accentText}`}>
                    Chapter Art
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{chapter.artDescription}</p>
                  <div className={`relative mt-4 h-52 overflow-hidden rounded-2xl border ${theme.artBorder}`}>
                    <Image
                      src={chapter.bannerSrc}
                      alt={chapter.bannerAlt}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className={`absolute bottom-3 left-3 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${theme.artTag}`}>
                      {chapter.bannerLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pip intro dialogue */}
        <section className={`${chapterFrame} py-2 fade-in`}>
          <PipDialogue
            type="intro"
            title="Pip the Python"
            message={chapter.pipIntro.message}
            note={chapter.pipIntro.note}
          />
        </section>

        {/* Pip portrait art */}
        <section className={`${chapterFrame} py-4 fade-in`}>
          <div className={`${theme.portraitPanel} rounded-3xl border p-6`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${theme.accentText}`}>
                  Guide Portrait
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-100">
                  Pip the Python
                </p>
                <p className="mt-2 text-sm text-slate-300">{chapter.guideBlurb}</p>
              </div>
              <div className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-full border ${theme.portraitRing}`}>
                <Image
                  src="/art/pip-mascot-cutout.png"
                  alt="Pip the Python mascot"
                  fill
                  unoptimized
                  className="object-contain p-1"
                />
              </div>
            </div>
            <div className={`relative mt-4 h-36 overflow-hidden rounded-2xl border ${theme.artBorder}`}>
              <Image
                src="/art/pip-mascot-cutout.png"
                alt={`${chapter.title} Pip portrait`}
                fill
                unoptimized
                className="object-contain p-2"
              />
            </div>
          </div>
        </section>

        {/* Concept explainer */}
        <section className={`${chapterFrame} py-6 fade-in`}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className={`${softPanelClass} p-6`}>
              <h3 className={`text-xl font-semibold ${theme.accentText}`}>Python Concept</h3>
              <p className="mt-3 leading-7 text-slate-300">{chapter.concept.body}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                {chapter.concept.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl border bg-slate-950/70 p-6 ${theme.conceptBorder}`}>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme.accentText}`}>
                Example Spell
              </p>
              <pre className={codeBlockClass} style={codeStyle}>
                <code>{chapter.concept.exampleCode}</code>
              </pre>
            </div>
          </div>
        </section>
          </>
        ) : null}

        {/* Live coding practice */}
        {activePanel === 'lab' && chapter.playground ? (
          <section className={`${chapterFrame} py-4 fade-in`}>
            <PythonPlayground
              chapterTitle={chapter.title}
              playground={chapter.playground}
              tone={chapter.tone}
              isCleared={playgroundRequirementMet}
              onSolved={handlePlaygroundSolved}
            />
          </section>
        ) : null}

        {/* Play area */}
        {activePanel === 'play' ? (
        <section className={`${chapterFrame} py-6 fade-in`}>
          <div className={`relative overflow-hidden ${panelClass} p-6 md:p-8`}>
            <div className={`pointer-events-none absolute -top-16 right-6 h-32 w-32 rounded-full blur-3xl float-slow ${theme.playGlowOne}`} />
            <div className={`pointer-events-none absolute bottom-0 left-10 h-24 w-24 rounded-full blur-2xl ${theme.playGlowTwo}`} />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className={`text-2xl font-semibold ${theme.accentText}`}>
                  Play Area
                </h3>
                <p className="mt-2 leading-7 text-slate-300">
                  Solve the chapter puzzles to restore this realm.
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${theme.playBadge}`}>
                {chapter.puzzleSummary}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>
                Puzzle {currentPuzzle + 1} of {totalPuzzles}
              </span>
              <span>Progress: {displaySolvedCount} of {totalPuzzles} solved</span>
              {playgroundRequired ? (
                <span>Spell Lab: {playgroundRequirementMet ? 'Cleared' : 'Required'}</span>
              ) : null}
              <span>
                Chapter Flow: {clearedObjectives} of {totalObjectives} objectives cleared
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full transition-all ${theme.progressBar}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {chapter.puzzles.map((puzzle, index) => {
                const puzzleState = results[puzzle.id];
                const canOpenPuzzle =
                  isChapterComplete ||
                  index === 0 ||
                  results[chapter.puzzles[index - 1]?.id] === 'success' ||
                  puzzleState === 'success';
                const isActivePuzzle = currentPuzzle === index;

                return (
                  <button
                    key={puzzle.id}
                    type="button"
                    onClick={() => setCurrentPuzzle(index)}
                    disabled={!canOpenPuzzle}
                    className={`min-h-14 rounded-2xl border px-2 py-2 text-center transition btn-press disabled:cursor-not-allowed disabled:opacity-40 ${
                      isActivePuzzle
                        ? 'border-emerald-300/60 bg-emerald-400 text-slate-950'
                        : puzzleState === 'success'
                          ? 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{index + 1}</span>
                    <span className="block text-[10px] uppercase tracking-[0.16em]">
                      {puzzleState === 'success' ? 'Done' : isActivePuzzle ? 'Now' : 'Puzzle'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 fade-in hover-lift ${currentStatusClass}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className={`text-lg font-semibold ${theme.accentText}`}>
                    {currentPuzzleData.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {currentPuzzleData.prompt}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                    DIFFICULTY_STYLES[currentPuzzleData.difficulty] ??
                    'bg-white/10 text-white border-white/10'
                  }`}
                >
                  {currentPuzzleData.difficulty}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)]">
                <div>
                  <pre className={codeBlockClass} style={codeStyle}>
                    <code>{currentPuzzleData.code}</code>
                  </pre>

                  {isCurrentHintShown ? (
                    <div className="mt-3 rounded-2xl border border-sky-300/25 bg-sky-500/10 px-4 py-3 text-sm leading-6 text-sky-100 fade-in">
                      Small hint: {currentPuzzleData.hint}
                    </div>
                  ) : null}

                  {currentResult ? (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`mt-3 rounded-2xl border px-4 py-2 text-sm fade-in ${
                        currentResult === 'success'
                          ? 'bg-emerald-500/15 text-emerald-100 border-emerald-300/30'
                          : 'bg-rose-500/10 text-rose-100 border-rose-300/30'
                      }`}
                    >
                      {currentResult === 'success'
                        ? currentPuzzleData.successText
                        : currentPuzzleData.failureText}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 lg:sticky lg:top-6">
                  {currentPuzzleData.type === 'choice' ? (
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                          Answer Console
                        </p>
                        <button
                          type="button"
                          onClick={() => showHint(currentPuzzleData.id)}
                          aria-expanded={isCurrentHintShown}
                          aria-label="Show a small hint"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/30 bg-sky-500/10 text-sm font-bold text-sky-100 transition btn-press hover:bg-sky-500/20"
                        >
                          ?
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {currentPuzzleData.options.map((option) => {
                          const isSelected = currentAnswer === option;
                          const buttonStyle = isSelected
                            ? 'bg-emerald-400 text-slate-900'
                            : 'bg-slate-950/70 text-slate-200 hover:bg-white/10';

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleChoice(currentPuzzleData, option)}
                              className={`min-h-12 rounded-2xl border border-white/10 px-3 py-2 text-sm font-semibold transition btn-press ${buttonStyle}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-xs uppercase tracking-[0.24em] text-slate-400">
                          Answer Console
                        </label>
                        <button
                          type="button"
                          onClick={() => showHint(currentPuzzleData.id)}
                          aria-expanded={isCurrentHintShown}
                          aria-label="Show a small hint"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/30 bg-sky-500/10 text-sm font-bold text-sky-100 transition btn-press hover:bg-sky-500/20"
                        >
                          ?
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">
                        {currentPuzzleData.inputLabel}
                      </p>
                      <input
                        type="text"
                        value={currentAnswer}
                        onChange={(event) =>
                          setAnswer(currentPuzzleData.id, event.target.value)
                        }
                        placeholder={currentPuzzleData.placeholder}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => handleInputCheck(currentPuzzleData)}
                        className={`${primaryButtonClass} mt-3 w-full`}
                      >
                        {currentPuzzleData.actionLabel}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <PipDialogue
                  type={currentResult === 'success' ? 'success' : 'hint'}
                  title={
                    currentResult === 'success'
                      ? 'Pip Approves'
                      : isCurrentHintShown
                        ? "Pip's Hint"
                        : 'Pip Is Ready'
                  }
                  message={
                    currentResult === 'success'
                      ? 'Well played. That answer opens the next stretch of the realm.'
                      : isCurrentHintShown
                        ? currentPuzzleData.hint
                        : 'Try tracing the code first. Tap the small ? near the answer area if you want a gentle nudge.'
                  }
                  note={currentResult === 'success' ? 'Keep the pattern in mind for the next challenge.' : undefined}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setCurrentPuzzle((previous) => Math.max(previous - 1, 0))}
                disabled={currentPuzzle === 0}
                className={`${navGhostButtonClass} w-full disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Previous Puzzle
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentPuzzle((previous) =>
                    Math.min(previous + 1, totalPuzzles - 1)
                  )
                }
                disabled={!canAdvance || currentPuzzle === totalPuzzles - 1}
                className={`${navPrimaryButtonClass} w-full disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Next Puzzle
              </button>
            </div>
            {!canAdvance ? (
              <p className="mt-2 text-xs text-slate-400">
                Solve the current puzzle to continue deeper into the realm.
              </p>
            ) : null}
            {isChapterComplete && currentPuzzle === totalPuzzles - 1 ? (
              <p className={`mt-2 text-xs ${theme.accentText}`}>
                All chapter objectives cleared. Open the Reward tab to claim the chapter reward.
              </p>
            ) : null}
            {!isChapterComplete && solvedCount === totalPuzzles && playgroundRequired && !playgroundRequirementMet ? (
              <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-amber-300/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-100 sm:flex-row sm:items-center sm:justify-between">
                <span>Your puzzles are done. One lab objective is still waiting.</span>
                <button
                  type="button"
                  onClick={() => setActivePanel('lab')}
                  className="rounded-full border border-amber-200/30 bg-amber-300/15 px-3 py-2 font-semibold text-amber-50 transition btn-press hover:bg-amber-300/25"
                >
                  Open Lab
                </button>
              </div>
            ) : null}
          </div>
        </section>
        ) : null}

        {/* Codebook unlocks */}
        {activePanel === 'codebook' && spellbookEntries.length ? (
          <section className={`${chapterFrame} py-6 fade-in`}>
            <div className={`${softPanelClass} p-6 md:p-8`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className={`text-xs uppercase tracking-[0.35em] ${theme.accentText}`}>
                    Codebook
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-100">
                    Unlocked Spells
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Each solved puzzle adds a small spell note here, so the lesson
                    turns into a collection you can revisit.
                  </p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs ${theme.playBadge}`}>
                  {unlockedSpellCount} of {spellbookEntries.length} unlocked
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                {spellbookEntries.map((entry, index) => {
                  const unlocked = isSpellUnlocked(index);

                  return (
                    <div
                      key={entry.title}
                      className={`rounded-2xl border p-4 transition ${
                        unlocked
                          ? 'border-emerald-300/25 bg-emerald-500/10 text-slate-100'
                          : 'border-white/10 bg-slate-950/45 text-slate-400'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-[11px] uppercase tracking-[0.24em]">
                          Spell {index + 1}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${
                            unlocked
                              ? 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100'
                              : 'border-slate-500/30 bg-slate-800/70 text-slate-400'
                          }`}
                        >
                          {unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold">{entry.title}</h4>
                      <p className="mt-2 text-xs leading-5">{unlocked ? entry.note : `Solve Puzzle ${index + 1} to reveal this note.`}</p>
                      <pre
                        className={`mt-3 overflow-x-auto rounded-xl border p-3 text-xs ${
                          unlocked
                            ? 'border-emerald-300/20 bg-slate-950/60 text-emerald-100'
                            : 'border-white/10 bg-slate-950/40 text-slate-500'
                        }`}
                        style={codeStyle}
                      >
                        <code>{unlocked ? entry.spell : '???'}</code>
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* Completion flow */}
        {activePanel === 'reward' ? (
        <section className={`${chapterFrame} pb-12 fade-in`}>
          {isChapterComplete ? (
            <div className={`relative overflow-hidden rounded-[2.5rem] border p-6 md:p-8 ${theme.completionPanel}`}>
              <ConfettiBurst />
              <div className={`pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full blur-3xl animate-pulse ${theme.completionGlowOne}`} />
              <div className={`pointer-events-none absolute -bottom-10 right-10 h-28 w-28 rounded-full blur-3xl animate-pulse ${theme.completionGlowTwo}`} />

              <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className={`text-xs uppercase tracking-[0.4em] ${theme.accentText}`}>
                    Chapter Complete
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-100">
                    {chapter.completion.title}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-200">
                    {chapter.completion.description}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
                  Progress saved
                </div>
              </div>

              <div className="relative z-10 mt-5">
                <PipDialogue
                  type="success"
                  title="Pip's Celebration"
                  message={chapter.completion.pipMessage}
                  note={chapter.completion.pipNote}
                />
              </div>

              <div className="relative z-10 mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className={`text-xs uppercase tracking-[0.3em] ${theme.accentText}`}>
                  What You Learned
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {chapter.completion.learned.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  className={`${primaryButtonClass} w-full sm:w-auto`}
                  href={chapter.completion.primaryAction.href}
                >
                  {chapter.completion.primaryAction.label}
                </Link>
                {chapter.completion.secondaryAction ? (
                  <Link
                    className={`${secondaryButtonClass} w-full sm:w-auto`}
                    href={chapter.completion.secondaryAction.href}
                  >
                    {chapter.completion.secondaryAction.label}
                  </Link>
                ) : null}
                {chapter.completion.footerNote ? (
                  <div className="text-center text-xs text-slate-300 sm:text-left sm:self-center">
                    {chapter.completion.footerNote}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className={`${panelClass} p-6 md:p-8`}>
              <p className={`text-xs uppercase tracking-[0.35em] ${theme.accentText}`}>
                Reward Locked
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-100">
                Finish the active objectives first.
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActivePanel('play')}
                  className={`${primaryButtonClass} w-full`}
                >
                  Continue Puzzles
                </button>
                {playgroundRequired && !playgroundRequirementMet ? (
                  <button
                    type="button"
                    onClick={() => setActivePanel('lab')}
                    className={`${secondaryButtonClass} w-full`}
                  >
                    Open Spell Lab
                  </button>
                ) : null}
              </div>
              <div className="mt-5">
                <PipDialogue
                  type="encouragement"
                  title="Pip's Encouragement"
                  message="You are past the warm-up now. Read every line carefully, trace the values, and trust your reasoning."
                  note="Harder puzzles just mean the kingdom trusts you with more magic."
                />
              </div>
            </div>
          )}
        </section>
        ) : null}
      </div>
    </main>
  );
}
