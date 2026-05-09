'use client';

/*
  useProgress
  ===========
  A tiny helper hook that saves chapter progress to localStorage.
  Keep it simple so beginners can understand the flow.
*/

import { useCallback, useEffect, useState } from 'react';
import {
  ACCOUNT_CHANGE_EVENT,
  GUEST_ACCOUNT_ID,
  getActiveAccountId,
} from '@/lib/accountStorage';

const STORAGE_KEY = 'lost-code-kingdom-progress';

const DEFAULT_PROGRESS = {
  chapter1Complete: false,
  chapter2Complete: false,
  chapter3Complete: false,
  chapter4Complete: false,
};

function getProgressStorageKey(accountId) {
  return `${STORAGE_KEY}:${accountId || GUEST_ACCOUNT_ID}`;
}

function parseProgress(raw) {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch (error) {
    return null;
  }
}

function readProgress(accountId) {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  const activeKey = getProgressStorageKey(accountId);
  const accountProgress = parseProgress(window.localStorage.getItem(activeKey));

  if (accountProgress) return accountProgress;

  // Keep old demo progress available for the guest profile.
  if (accountId === GUEST_ACCOUNT_ID) {
    const legacyProgress = parseProgress(window.localStorage.getItem(STORAGE_KEY));

    if (legacyProgress) return legacyProgress;
  }

  return DEFAULT_PROGRESS;
}

function saveProgress(progress, accountId) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    getProgressStorageKey(accountId),
    JSON.stringify(progress)
  );
}

export function useProgress() {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [activeAccountId, setActiveAccountId] = useState(GUEST_ACCOUNT_ID);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage once on mount and whenever profiles switch.
  useEffect(() => {
    function loadProgress() {
      const nextAccountId = getActiveAccountId();
      const stored = readProgress(nextAccountId);

      setActiveAccountId(nextAccountId);
      setProgress(stored);
      setIsLoaded(true);
    }

    const frameId = window.requestAnimationFrame(loadProgress);

    window.addEventListener(ACCOUNT_CHANGE_EVENT, loadProgress);
    window.addEventListener('storage', loadProgress);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener(ACCOUNT_CHANGE_EVENT, loadProgress);
      window.removeEventListener('storage', loadProgress);
    };
  }, []);

  // Mark a chapter as complete and save it.
  const markComplete = useCallback((key) => {
    setProgress((prev) => {
      const next = { ...prev, [key]: true };
      saveProgress(next, activeAccountId);
      return next;
    });
  }, [activeAccountId]);

  // Reset all chapter progress.
  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS, activeAccountId);
  }, [activeAccountId]);

  return { activeAccountId, progress, markComplete, resetProgress, isLoaded };
}
