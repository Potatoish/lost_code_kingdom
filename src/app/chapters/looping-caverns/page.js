'use client';

/*
  chapters/looping-caverns/page.js
  ===============================
  Chapter 3 page: Looping Caverns.
*/

import ChapterAdventurePage from '@/components/ChapterAdventurePage';
import { getChapterConfig } from '@/lib/chapterConfigs';

export default function LoopingCavernsPage() {
  return <ChapterAdventurePage chapter={getChapterConfig('looping-caverns')} />;
}
