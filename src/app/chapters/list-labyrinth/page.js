'use client';

/*
  chapters/list-labyrinth/page.js
  ===============================
  Chapter 4 page: List Labyrinth.
*/

import ChapterAdventurePage from '@/components/ChapterAdventurePage';
import { getChapterConfig } from '@/lib/chapterConfigs';

export default function ListLabyrinthPage() {
  return <ChapterAdventurePage chapter={getChapterConfig('list-labyrinth')} />;
}
