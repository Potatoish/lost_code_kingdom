'use client';

/*
  AccountPanel
  ============
  Small browser-local profile switcher.
*/

import { useState } from 'react';
import { GUEST_ACCOUNT_ID } from '@/lib/accountStorage';
import { useAccounts } from '@/hooks/useAccounts';

export default function AccountPanel({ className = '' }) {
  const {
    accounts,
    activeAccount,
    activeAccountId,
    addAccount,
    isLoaded,
    removeAccount,
    switchAccount,
  } = useAccounts();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const savedAccounts = accounts.filter(
    (account) => account.id !== GUEST_ACCOUNT_ID
  );
  const isGuestActive = activeAccountId === GUEST_ACCOUNT_ID;

  function handleCreateAccount(event) {
    event.preventDefault();

    try {
      addAccount(name);
      setName('');
      setError('');
      setIsCreating(false);
    } catch (createError) {
      setError(createError.message);
    }
  }

  function handleRemoveAccount(accountId, accountName) {
    if (accountId === GUEST_ACCOUNT_ID) return;

    if (window.confirm(`Delete ${accountName}'s local profile?`)) {
      removeAccount(accountId);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-500/10 px-4 py-2 text-center text-sm text-emerald-100 shadow-[0_12px_30px_rgba(2,6,23,0.18)] transition btn-press hover:bg-emerald-500/20 sm:w-auto"
        aria-expanded={isOpen}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
        {isLoaded ? activeAccount.name : 'Loading Hero'}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-left text-slate-100 shadow-[0_24px_70px_rgba(2,6,23,0.72)] backdrop-blur-md">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              Player Profile
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Progress and Spell Lab drafts save separately for each local hero.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => switchAccount(GUEST_ACCOUNT_ID)}
              disabled={isGuestActive}
              className={`rounded-2xl border p-3 text-left transition btn-press ${
                isGuestActive
                  ? 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100'
                  : 'border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/10'
              }`}
            >
              <span className="block text-sm font-semibold">Guest</span>
              <span className="mt-1 block text-xs text-slate-400">
                Quick play on this browser
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreating((current) => !current)}
              className={`rounded-2xl border p-3 text-left transition btn-press ${
                isCreating
                  ? 'border-sky-300/30 bg-sky-500/15 text-sky-100'
                  : 'border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/10'
              }`}
            >
              <span className="block text-sm font-semibold">Create Profile</span>
              <span className="mt-1 block text-xs text-slate-400">
                Save as your own hero
              </span>
            </button>
          </div>

          {savedAccounts.length ? (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-[0.26em] text-slate-400">
                Saved Profiles
              </p>
              <div className="space-y-2">
                {savedAccounts.map((account) => {
              const isActive = account.id === activeAccountId;

              return (
                <div
                  key={account.id}
                  className={`rounded-2xl border p-3 ${
                    isActive
                      ? 'border-emerald-300/30 bg-emerald-500/15'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-100">
                        {account.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Local profile
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchAccount(account.id)}
                      disabled={isActive}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200 transition btn-press hover:bg-white/10 disabled:cursor-not-allowed disabled:border-emerald-300/30 disabled:bg-emerald-500/20 disabled:text-emerald-100"
                    >
                      {isActive ? 'Active' : 'Use'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccount(account.id, account.name)}
                    className="mt-2 text-xs text-rose-200 transition hover:text-rose-100"
                  >
                    Delete local profile
                  </button>
                </div>
              );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
              No saved profiles yet. Use Guest or create a hero profile.
            </p>
          )}

          {isCreating ? (
            <form onSubmit={handleCreateAccount} className="mt-4">
              <label className="text-xs uppercase tracking-[0.26em] text-slate-400">
                New Hero Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError('');
                }}
                placeholder="Mira"
                maxLength={24}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
              />
              {error ? (
                <p className="mt-2 text-xs text-rose-200">{error}</p>
              ) : null}
              <button
                type="submit"
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition btn-press hover:bg-emerald-300"
              >
                Save Profile
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
