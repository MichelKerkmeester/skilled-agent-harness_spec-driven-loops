// ───────────────────────────────────────────────────────────────
// MODULE: Lifecycle Routing Stress Test
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { applyAgeHaircutToLane, derivedAgeMultiplier } from '../../lib/lifecycle/age-haircut.js';
import {
  filterCorpusStatEligible,
  routePolicyForPath,
} from '../../lib/lifecycle/archive-handling.js';

interface CorpusEntry {
  readonly skillId: string;
  readonly sourcePath: string;
}

describe('lifecycle routing stress behavior', () => {
  it('sa-014 applies age haircuts only to derived lanes across a broad age range', () => {
    const now = new Date('2026-04-30T00:00:00.000Z');
    const derivedScores = Array.from({ length: 720 }, (_, ageDays) => {
      const generatedAt = new Date(now.getTime() - ageDays * 86_400_000);
      return applyAgeHaircutToLane(
        { trustLane: 'derived_generated', score: 1 },
        { generatedAt, now, halfLifeDays: 90 },
      ).score;
    });
    const authorScores = Array.from({ length: 720 }, (_, ageDays) => {
      const generatedAt = new Date(now.getTime() - ageDays * 86_400_000);
      return applyAgeHaircutToLane(
        { trustLane: 'explicit_author', score: 1 },
        { generatedAt, now, halfLifeDays: 90 },
      ).score;
    });

    expect(authorScores.every((score) => score === 1)).toBe(true);
    expect(Math.max(...derivedScores)).toBe(1);
    expect(Math.min(...derivedScores)).toBe(0.1);
    expect(derivedScores[0]).toBeGreaterThan(derivedScores[180]);
    expect(derivedScores[180]).toBeGreaterThan(derivedScores[360]);
    expect(derivedAgeMultiplier({ generatedAt: now, now, lifecycleStatus: 'deprecated' })).toBe(0.25);
    expect(derivedAgeMultiplier({ generatedAt: now, now, lifecycleStatus: 'archived' })).toBe(0);
    expect(derivedAgeMultiplier({ generatedAt: now, now, lifecycleStatus: 'future' })).toBe(0);
  });

  it('sa-016 structurally indexes archive and future skills while excluding them from live routing', () => {
    const entries: CorpusEntry[] = [
      ...Array.from({ length: 500 }, (_, index) => ({
        skillId: `active-${index}`,
        sourcePath: `.skilled/skills/active-${index}/graph-metadata.json`,
      })),
      ...Array.from({ length: 240 }, (_, index) => ({
        skillId: `archived-${index}`,
        sourcePath: `.skilled/skills/z_archive/archived-${index}/graph-metadata.json`,
      })),
      ...Array.from({ length: 160 }, (_, index) => ({
        skillId: `future-${index}`,
        sourcePath: `.skilled\\skill\\z-future\\future-${index}\\graph-metadata.json`,
      })),
    ];
    const corpusEligible = filterCorpusStatEligible(entries);
    const archivedPolicy = routePolicyForPath('.skilled/skills/z_archive/old/graph-metadata.json');
    const futurePolicy = routePolicyForPath('.skilled\\skill\\z-future\\planned\\graph-metadata.json');

    expect(entries.every((entry) => routePolicyForPath(entry.sourcePath).structurallyIndexed)).toBe(true);
    expect(corpusEligible).toHaveLength(500);
    expect(archivedPolicy).toMatchObject({
      lifecycleStatus: 'archived',
      defaultRoutable: false,
      includeInCorpusStats: false,
    });
    expect(futurePolicy).toMatchObject({
      lifecycleStatus: 'future',
      defaultRoutable: false,
      includeInCorpusStats: false,
    });
  });
});
