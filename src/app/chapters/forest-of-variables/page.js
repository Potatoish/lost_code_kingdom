'use client';

/*
  chapters/forest-of-variables/page.js
  ===================================
  Chapter 1 page: Forest of Variables.
*/

import ChapterAdventurePage from '@/components/ChapterAdventurePage';
import { getChapterConfig } from '@/lib/chapterConfigs';

export default function ForestOfVariablesPage() {
  return <ChapterAdventurePage chapter={getChapterConfig('forest-of-variables')} />;
}
