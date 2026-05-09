/*
  gameUi
  ======
  Shared UI class names used across the game pages.
  Keeping the most common layout and button styles here makes the
  pages easier to keep consistent without a big refactor.
*/

export const siteFrame = 'max-w-6xl mx-auto px-4 sm:px-6';
export const chapterFrame = 'max-w-5xl mx-auto px-4 sm:px-6';

export const panelClass =
  'rounded-3xl border border-white/10 bg-slate-900/70 shadow-[0_24px_80px_rgba(2,6,23,0.38)] backdrop-blur-sm';
export const softPanelClass =
  'rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(2,6,23,0.24)] backdrop-blur-sm';

export const navGhostButtonClass =
  'inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-4 py-2 text-center text-sm text-slate-100 shadow-[0_12px_30px_rgba(2,6,23,0.18)] transition hover:border-white/30 hover:bg-white/10 btn-press';

export const navPrimaryButtonClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(16,185,129,0.24)] transition hover:from-emerald-300 hover:to-emerald-400 btn-press';

export const primaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3 text-center font-semibold text-slate-950 shadow-[0_18px_46px_rgba(16,185,129,0.26)] transition hover:from-emerald-300 hover:to-emerald-400 btn-press';

export const secondaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.03] px-6 py-3 text-center font-semibold text-white shadow-[0_14px_36px_rgba(2,6,23,0.18)] transition hover:border-white/30 hover:bg-white/10 btn-press';

export const codeBlockClass =
  'mt-4 overflow-x-auto rounded-2xl border border-emerald-400/20 bg-slate-950/75 p-3 text-sm text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]';

export const inputClass =
  'mt-2 w-full min-h-12 rounded-2xl border border-white/10 bg-slate-900/75 px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-emerald-400/60';
