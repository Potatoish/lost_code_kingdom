'use client';

/*
  accountStorage
  ==============
  Browser-local player profiles for the demo game.
  These are not secure login accounts; they are simple profiles so different
  players can keep separate progress on the same browser.
*/

export const GUEST_ACCOUNT_ID = 'guest';

export const ACCOUNT_CHANGE_EVENT = 'lost-code-kingdom-account-change';

const ACCOUNTS_STORAGE_KEY = 'lost-code-kingdom-accounts';
const ACTIVE_ACCOUNT_STORAGE_KEY = 'lost-code-kingdom-active-account-id';

const GUEST_ACCOUNT = {
  id: GUEST_ACCOUNT_ID,
  name: 'Guest Hero',
  createdAt: 'guest',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function normalizeName(name) {
  return String(name ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

function makeAccountId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `hero-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStoredAccounts() {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((account) => account?.id && account?.id !== GUEST_ACCOUNT_ID)
      .map((account) => ({
        id: String(account.id),
        name: normalizeName(account.name) || 'Code Hero',
        createdAt: account.createdAt ?? new Date().toISOString(),
      }));
  } catch (error) {
    return [];
  }
}

function writeStoredAccounts(accounts) {
  if (!isBrowser()) return;

  const storableAccounts = accounts.filter(
    (account) => account.id !== GUEST_ACCOUNT_ID
  );

  window.localStorage.setItem(
    ACCOUNTS_STORAGE_KEY,
    JSON.stringify(storableAccounts)
  );
}

function dispatchAccountChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(ACCOUNT_CHANGE_EVENT));
}

export function readAccounts() {
  return [GUEST_ACCOUNT, ...readStoredAccounts()];
}

export function getActiveAccountId() {
  if (!isBrowser()) return GUEST_ACCOUNT_ID;

  const accounts = readAccounts();
  const storedId = window.localStorage.getItem(ACTIVE_ACCOUNT_STORAGE_KEY);
  const accountExists = accounts.some((account) => account.id === storedId);

  return accountExists ? storedId : GUEST_ACCOUNT_ID;
}

export function getActiveAccount() {
  const accounts = readAccounts();
  const activeAccountId = getActiveAccountId();

  return (
    accounts.find((account) => account.id === activeAccountId) ?? GUEST_ACCOUNT
  );
}

export function setActiveAccountId(accountId) {
  if (!isBrowser()) return GUEST_ACCOUNT_ID;

  const accounts = readAccounts();
  const nextAccount = accounts.find((account) => account.id === accountId);
  const nextId = nextAccount?.id ?? GUEST_ACCOUNT_ID;

  window.localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, nextId);
  dispatchAccountChange();

  return nextId;
}

export function createAccount(name) {
  const safeName = normalizeName(name);

  if (!safeName) {
    throw new Error('Please enter a hero name.');
  }

  const storedAccounts = readStoredAccounts();
  const account = {
    id: makeAccountId(),
    name: safeName,
    createdAt: new Date().toISOString(),
  };

  writeStoredAccounts([...storedAccounts, account]);
  setActiveAccountId(account.id);
  dispatchAccountChange();

  return account;
}

export function deleteAccount(accountId) {
  if (!isBrowser() || accountId === GUEST_ACCOUNT_ID) return;

  const nextAccounts = readStoredAccounts().filter(
    (account) => account.id !== accountId
  );

  writeStoredAccounts(nextAccounts);

  if (getActiveAccountId() === accountId) {
    window.localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, GUEST_ACCOUNT_ID);
  }

  dispatchAccountChange();
}
