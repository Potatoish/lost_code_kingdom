'use client';

/*
  PythonPlayground
  ================
  A reusable in-browser coding area for the chapter pages.
  Players can run Python, see the output, and check a chapter-specific task.
*/

import { useEffect, useRef, useState } from 'react';
import PipDialogue from '@/components/PipDialogue';
import { useAccounts } from '@/hooks/useAccounts';
import { panelClass, primaryButtonClass, secondaryButtonClass } from '@/lib/gameUi';
import {
  loadPyodideRuntime,
  runPythonHiddenChecks,
  runPythonSnippet,
} from '@/lib/pyodideRuntime';
import {
  clearSpellLabDraft,
  readSpellLabDraft,
  saveSpellLabDraft,
} from '@/lib/spellLabStorage';

const PLAYGROUND_TONES = {
  forest: {
    accent: 'text-emerald-200',
    panel: 'border-emerald-300/20 bg-emerald-500/10',
    editor: 'border-emerald-400/20 focus:ring-emerald-300/50',
    output: 'border-emerald-400/20 bg-slate-950/80',
    badge: 'border-emerald-300/20 bg-emerald-500/10 text-emerald-100',
    challenge: 'border-emerald-300/20 bg-slate-950/45',
    success: 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100',
    failure: 'border-rose-300/30 bg-rose-500/10 text-rose-100',
  },
  river: {
    accent: 'text-sky-200',
    panel: 'border-sky-300/20 bg-sky-500/10',
    editor: 'border-sky-400/20 focus:ring-sky-300/50',
    output: 'border-sky-400/20 bg-slate-950/80',
    badge: 'border-sky-300/20 bg-sky-500/10 text-sky-100',
    challenge: 'border-sky-300/20 bg-slate-950/45',
    success: 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100',
    failure: 'border-rose-300/30 bg-rose-500/10 text-rose-100',
  },
  cavern: {
    accent: 'text-amber-200',
    panel: 'border-amber-300/20 bg-amber-500/10',
    editor: 'border-amber-400/20 focus:ring-amber-300/50',
    output: 'border-amber-400/20 bg-slate-950/80',
    badge: 'border-amber-300/20 bg-amber-500/10 text-amber-100',
    challenge: 'border-amber-300/20 bg-slate-950/45',
    success: 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100',
    failure: 'border-rose-300/30 bg-rose-500/10 text-rose-100',
  },
  labyrinth: {
    accent: 'text-fuchsia-200',
    panel: 'border-fuchsia-300/20 bg-fuchsia-500/10',
    editor: 'border-fuchsia-400/20 focus:ring-fuchsia-300/50',
    output: 'border-fuchsia-400/20 bg-slate-950/80',
    badge: 'border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-100',
    challenge: 'border-fuchsia-300/20 bg-slate-950/45',
    success: 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100',
    failure: 'border-rose-300/30 bg-rose-500/10 text-rose-100',
  },
};

const codeStyle = { fontFamily: 'var(--font-code), monospace' };

export default function PythonPlayground({
  chapterTitle,
  playground,
  tone = 'forest',
  isCleared = false,
  onSolved = () => {},
}) {
  const styles = PLAYGROUND_TONES[tone] ?? PLAYGROUND_TONES.forest;
  const { activeAccountId } = useAccounts();
  const saveTimeoutRef = useRef(null);
  const hiddenCheckCount = playground.hiddenChecks?.length ?? 0;
  const [code, setCode] = useState(playground.starterCode);
  const [runtimeMessage, setRuntimeMessage] = useState('Preparing spell engine...');
  const [runtimeState, setRuntimeState] = useState('loading');
  const [isRunning, setIsRunning] = useState(false);
  const [draftStatus, setDraftStatus] = useState('loading');
  const [output, setOutput] = useState(playground.placeholderOutput ?? '');
  const [error, setError] = useState('');
  const [hasClearedChallenge, setHasClearedChallenge] = useState(isCleared);
  const [challengeState, setChallengeState] = useState(isCleared ? 'success' : 'idle');
  const [hiddenCheckSummary, setHiddenCheckSummary] = useState(
    isCleared && hiddenCheckCount
      ? {
          passedCount: hiddenCheckCount,
          totalCount: hiddenCheckCount,
        }
      : null
  );
  const [challengeMessage, setChallengeMessage] = useState(
    isCleared
      ? playground.clearedText ?? 'Spell Lab already cleared. You can still experiment freely.'
      : playground.runHint
  );
  const effectiveCleared = hasClearedChallenge || isCleared;

  useEffect(() => {
    let isActive = true;

    loadPyodideRuntime((message) => {
      if (isActive) {
        setRuntimeMessage(message);
      }
    })
      .then(() => {
        if (isActive) {
          setRuntimeState('ready');
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setRuntimeState('error');
          setRuntimeMessage(loadError.message);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setHasClearedChallenge(isCleared);
      setChallengeState(isCleared ? 'success' : 'idle');
      setHiddenCheckSummary(
        isCleared && hiddenCheckCount
          ? {
              passedCount: hiddenCheckCount,
              totalCount: hiddenCheckCount,
            }
          : null
      );
      setChallengeMessage(
        isCleared
          ? playground.clearedText ?? 'Spell Lab already cleared. You can still experiment freely.'
          : playground.runHint
      );
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [
    activeAccountId,
    hiddenCheckCount,
    isCleared,
    playground.clearedText,
    playground.runHint,
  ]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedDraft = readSpellLabDraft(playground.id);

      if (!savedDraft) {
        setCode(playground.starterCode);
        setOutput(playground.placeholderOutput ?? '');
        setError('');
        setDraftStatus('idle');
        return;
      }

      setCode(savedDraft);
      setOutput(playground.placeholderOutput ?? '');
      setError('');
      setDraftStatus('saved');
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [
    activeAccountId,
    playground.id,
    playground.placeholderOutput,
    playground.starterCode,
  ]);

  useEffect(() => {
    return () => {
      window.clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  function queueDraftSave(nextCode) {
    window.clearTimeout(saveTimeoutRef.current);
    setDraftStatus('saving');

    saveTimeoutRef.current = window.setTimeout(() => {
      saveSpellLabDraft(playground.id, nextCode, playground.starterCode);
      setDraftStatus(
        String(nextCode ?? '').trim() === String(playground.starterCode ?? '').trim()
          ? 'idle'
          : 'saved'
      );
    }, 260);
  }

  function resetPlayground() {
    window.clearTimeout(saveTimeoutRef.current);
    clearSpellLabDraft(playground.id);
    setCode(playground.starterCode);
    setOutput(playground.placeholderOutput ?? '');
    setError('');
    setDraftStatus('idle');
    setChallengeState(effectiveCleared ? 'success' : 'idle');
    setHiddenCheckSummary(
      effectiveCleared && playground.hiddenChecks?.length
        ? {
            passedCount: playground.hiddenChecks.length,
            totalCount: playground.hiddenChecks.length,
          }
        : null
    );
    setChallengeMessage(
      effectiveCleared
        ? playground.clearedText ?? 'Spell Lab already cleared. You can still experiment freely.'
        : playground.runHint
    );
  }

  async function executeCode() {
    setIsRunning(true);
    setError('');
    setRuntimeState('loading');

    const result = await runPythonSnippet(code, (message) => {
      setRuntimeMessage(message);
      setRuntimeState(message.toLowerCase().includes('ready') ? 'ready' : 'loading');
    });

    setOutput(result.output || '(no output yet)');
    setError(result.error);
    setIsRunning(false);
    return result;
  }

  async function handleRun() {
    setChallengeState('idle');
    setChallengeMessage(
      effectiveCleared
        ? playground.clearedText ?? 'Spell Lab already cleared. You can still experiment freely.'
        : playground.runHint
    );
    await executeCode();
  }

  async function handleCheckChallenge() {
    const result = await executeCode();

    if (result.hasError) {
      setChallengeState('failure');
      setHiddenCheckSummary(null);
      setChallengeMessage('Fix the runtime error first, then try the challenge check again.');
      return;
    }

    const hiddenCheckResult = await runPythonHiddenChecks(
      code,
      playground.hiddenChecks ?? [],
      (message) => {
        setRuntimeMessage(message);
        setRuntimeState(message.toLowerCase().includes('ready') ? 'ready' : 'loading');
      }
    );

    setHiddenCheckSummary({
      passedCount: hiddenCheckResult.passedCount,
      totalCount: hiddenCheckResult.totalCount,
    });

    const passedPublicCheck = playground.validate({
      code,
      output: result.output,
      error: result.error,
    });
    const isSolved = passedPublicCheck && hiddenCheckResult.allPassed;

    setChallengeState(isSolved ? 'success' : 'failure');
    setChallengeMessage(
      isSolved
        ? playground.successText
        : hiddenCheckResult.allPassed
          ? playground.failureText
          : hiddenCheckResult.results.find((check) => !check.passed)?.message ??
            playground.failureText
    );

    if (isSolved && !effectiveCleared) {
      setHasClearedChallenge(true);
      onSolved();
    }
  }

  const visualState =
    challengeState === 'success' || (challengeState === 'idle' && effectiveCleared)
      ? 'success'
      : challengeState;

  const feedbackClasses =
    visualState === 'success'
      ? styles.success
      : visualState === 'failure'
        ? styles.failure
        : 'border-white/10 bg-white/5 text-slate-200';

  const statusBadgeClasses = effectiveCleared
    ? 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100'
    : styles.badge;

  const feedbackMessage =
    challengeState === 'idle' && effectiveCleared
      ? playground.clearedText ?? 'Spell Lab already cleared. You can still experiment freely.'
      : challengeMessage;

  return (
    <section className="fade-in">
      <div className={`${panelClass} overflow-hidden border p-6 md:p-8 ${styles.panel}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={`text-xs uppercase tracking-[0.35em] ${styles.accent}`}>
              Spell Lab
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-100">
              {playground.title}
            </h3>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              {playground.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <div className={`rounded-full border px-3 py-2 text-xs ${styles.badge}`}>
              {chapterTitle}
            </div>
            <div className={`rounded-full border px-3 py-2 text-xs ${statusBadgeClasses}`}>
              {effectiveCleared ? 'Spell Lab Cleared' : 'Required for completion'}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div>
            <label
              htmlFor={`${playground.id}-editor`}
              className="text-xs uppercase tracking-[0.3em] text-slate-400"
            >
              Python Editor
            </label>
            <textarea
              id={`${playground.id}-editor`}
              value={code}
              onChange={(event) => {
                const nextCode = event.target.value;

                setCode(nextCode);
                setChallengeState('idle');
                setChallengeMessage(
                  effectiveCleared
                    ? playground.clearedText ??
                        'Spell Lab already cleared. You can still experiment freely.'
                    : playground.runHint
                );
                setHiddenCheckSummary(null);
                queueDraftSave(nextCode);
              }}
              className={`mt-3 min-h-[18rem] w-full rounded-[1.5rem] border bg-slate-950/80 px-4 py-4 text-sm text-slate-100 outline-none transition ${styles.editor}`}
              style={codeStyle}
              spellCheck="false"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning}
                className={`${primaryButtonClass} w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isRunning ? 'Running Spell...' : 'Run Code'}
              </button>
              <button
                type="button"
                onClick={handleCheckChallenge}
                disabled={isRunning}
                className={`${secondaryButtonClass} w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Check Challenge
              </button>
              <button
                type="button"
                onClick={resetPlayground}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-slate-900/50 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Reset Code
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-400">
              Engine status: <span className="text-slate-200">{runtimeMessage}</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Draft status:{' '}
              <span className="text-slate-200">
                {draftStatus === 'loading'
                  ? 'Checking for saved spell...'
                  : draftStatus === 'saving'
                    ? 'Saving spell locally...'
                    : draftStatus === 'saved'
                      ? 'Saved in this browser'
                      : 'Using starter spell'}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <div className={`rounded-[1.5rem] border p-5 ${styles.challenge}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${styles.accent}`}>
                Challenge Goal
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {playground.goal}
              </p>
              <p className="mt-3 text-xs leading-6 text-slate-400">
                Expected output:
                <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
                  {playground.expectedOutputLabel}
                </span>
              </p>
              {playground.hiddenChecks?.length ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-slate-300">
                  <p className="uppercase tracking-[0.24em] text-slate-400">
                    Hidden Checks
                  </p>
                  <p className="mt-2">
                    {hiddenCheckSummary
                      ? `${hiddenCheckSummary.passedCount} of ${hiddenCheckSummary.totalCount} hidden checks passed.`
                      : `${playground.hiddenChecks.length} hidden checks are waiting for your code.`}
                  </p>
                </div>
              ) : null}
            </div>

            <div className={`rounded-[1.5rem] border p-5 ${styles.output}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${styles.accent}`}>
                Output Console
              </p>
              <pre
                className="mt-4 min-h-[10rem] whitespace-pre-wrap break-words text-sm text-slate-100"
                style={codeStyle}
              >
                <code>{error ? error : output || '(no output yet)'}</code>
              </pre>
            </div>

            <div className={`rounded-[1.5rem] border p-4 text-sm leading-7 ${feedbackClasses}`}>
              {feedbackMessage}
            </div>

            <PipDialogue
              type={challengeState === 'success' ? 'success' : 'hint'}
              title={challengeState === 'success' ? 'Pip Cheers' : 'Pip Suggests'}
              message={
                challengeState === 'success'
                  ? playground.pipSuccess
                  : playground.pipHint
              }
              note={playground.pipNote}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
