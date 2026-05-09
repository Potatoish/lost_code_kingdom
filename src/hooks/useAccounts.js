'use client';

/*
  useAccounts
  ===========
  React wrapper around browser-local player profiles.
*/

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ACCOUNT_CHANGE_EVENT,
  createAccount,
  deleteAccount,
  getActiveAccountId,
  readAccounts,
  setActiveAccountId,
} from '@/lib/accountStorage';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [activeAccountId, setActiveAccountIdState] = useState('guest');
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshAccounts = useCallback(() => {
    const nextAccounts = readAccounts();
    const nextActiveAccountId = getActiveAccountId();

    setAccounts(nextAccounts);
    setActiveAccountIdState(nextActiveAccountId);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(refreshAccounts);

    window.addEventListener(ACCOUNT_CHANGE_EVENT, refreshAccounts);
    window.addEventListener('storage', refreshAccounts);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener(ACCOUNT_CHANGE_EVENT, refreshAccounts);
      window.removeEventListener('storage', refreshAccounts);
    };
  }, [refreshAccounts]);

  const activeAccount = useMemo(
    () =>
      accounts.find((account) => account.id === activeAccountId) ??
      accounts[0] ?? {
        id: 'guest',
        name: 'Guest Hero',
      },
    [accounts, activeAccountId]
  );

  const switchAccount = useCallback((accountId) => {
    setActiveAccountId(accountId);
  }, []);

  const addAccount = useCallback((name) => createAccount(name), []);

  const removeAccount = useCallback((accountId) => {
    deleteAccount(accountId);
  }, []);

  return {
    accounts,
    activeAccount,
    activeAccountId,
    addAccount,
    isLoaded,
    removeAccount,
    switchAccount,
  };
}
