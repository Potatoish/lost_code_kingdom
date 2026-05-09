'use client';

/*
  chapters/river-of-conditions/page.js
  ===================================
  Chapter 2 page: River of Conditions.
*/

import ChapterAdventurePage from '@/components/ChapterAdventurePage';
import { getChapterConfig } from '@/lib/chapterConfigs';

export default function RiverOfConditionsPage() {
  return <ChapterAdventurePage chapter={getChapterConfig('river-of-conditions')} />;
}
