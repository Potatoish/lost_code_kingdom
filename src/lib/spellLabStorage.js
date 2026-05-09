'use client';

/*
  spellLabStorage
  ===============
  Tiny localStorage helpers for saving Spell Lab drafts per chapter.
  We keep the data shape simple so it is easy to expand later.
*/

import { GUEST_ACCOUNT_ID, getActiveAccountId } from '@/lib/accountStorage';

const SPELL_LAB_STORAGE_KEY = 'lost-code-kingdom-spell-lab-drafts';

function getDraftStorageKey(accountId) {
  return `${SPELL_LAB_STORAGE_KEY}:${accountId || GUEST_ACCOUNT_ID}`;
}

function readAllDrafts() {
  if (typeof window === 'undefined') return {};

  const accountId = getActiveAccountId();
  const raw =
    window.localStorage.getItem(getDraftStorageKey(accountId)) ??
    (accountId === GUEST_ACCOUNT_ID
      ? window.localStorage.getItem(SPELL_LAB_STORAGE_KEY)
      : null);

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function writeAllDrafts(drafts) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    getDraftStorageKey(getActiveAccountId()),
    JSON.stringify(drafts)
  );
}

function normalizeCode(code) {
  return String(code ?? '').replace(/\r/g, '').trim();
}

export function readSpellLabDraft(draftKey) {
  const drafts = readAllDrafts();
  return drafts[draftKey] ?? '';
}

export function saveSpellLabDraft(draftKey, code, starterCode) {
  const drafts = readAllDrafts();
  const nextCode = String(code ?? '');

  if (normalizeCode(nextCode) === normalizeCode(starterCode)) {
    delete drafts[draftKey];
  } else {
    drafts[draftKey] = nextCode;
  }

  writeAllDrafts(drafts);
}

export function clearSpellLabDraft(draftKey) {
  const drafts = readAllDrafts();
  delete drafts[draftKey];
  writeAllDrafts(drafts);
}
