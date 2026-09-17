// ───────────────────────────────────────────────────────────────
// MODULE: Derived-Content Freshness Projection Tests
// ───────────────────────────────────────────────────────────────
// Locks in the per-skill derived-content freshness contract:
//   1. The projection reads `derived.generated_at` as the canonical per-skill
//      freshness (V2 author/sync time), ahead of a stray legacy
//      `last_updated_at`/`created_at`.
//   2. The derived lane's age haircut decays by THAT per-skill value, not by
//      the near-now `projection.generatedAt` (which is rebuilt every run and
//      would otherwise exempt every skill from the haircut).
// This freshness is author-time: rebuild re-indexes the derived block without
// re-stamping it, so a freshly rebuilt skill with old derived metadata stays
// honestly penalized.

import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createFixtureProjection, loadAdvisorProjection } from '../../lib/scorer/projection.js';
import { scoreDerivedLane } from '../../lib/scorer/lanes/derived.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skills/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

describe('derived-content freshness projection contract', () => {
  it('decays the derived lane by per-skill derivedGeneratedAt, not the near-now projection generatedAt', () => {
    const now = new Date('2026-04-21T00:00:00.000Z');
    // Both projections are built "now" (projection.generatedAt ~= now); only
    // the per-skill derivedGeneratedAt differs. If the lane decayed by
    // projection.generatedAt it would score both identically.
    const freshProjection = createFixtureProjection([
      skill({ id: 'derived-skill', derivedTriggers: ['generated metadata route'], derivedGeneratedAt: '2026-04-20T00:00:00.000Z' }),
    ]);
    const staleProjection = createFixtureProjection([
      skill({ id: 'derived-skill', derivedTriggers: ['generated metadata route'], derivedGeneratedAt: '2024-01-01T00:00:00.000Z' }),
    ]);

    const fresh = scoreDerivedLane('generated metadata route', freshProjection, now)[0];
    const stale = scoreDerivedLane('generated metadata route', staleProjection, now)[0];

    expect(fresh.score).toBeGreaterThan(stale.score);
  });

  it('loads derived.generated_at as the canonical per-skill freshness over a stray last_updated_at', () => {
    const root = mkdtempSync(join(tmpdir(), 'advisor-projection-freshness-'));
    try {
      const skillDir = join(root, '.opencode', 'skills', 'alpha');
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, 'SKILL.md'), '---\nname: alpha\ndescription: alpha skill\n---\n', 'utf8');
      writeFileSync(join(skillDir, 'graph-metadata.json'), JSON.stringify({
        skill_id: 'alpha',
        family: 'system',
        category: 'test',
        derived: {
          trigger_phrases: ['filesystem derived route'],
          // generated_at is the canonical V2 field; the stray last_updated_at
          // must NOT win the coalesce.
          generated_at: '2026-04-20T00:00:00.000Z',
          last_updated_at: '2025-01-01T00:00:00.000Z',
        },
      }), 'utf8');

      const projection = loadAdvisorProjection(root);
      const alpha = projection.skills.find((entry) => entry.id === 'alpha');

      expect(alpha?.derivedGeneratedAt).toBe('2026-04-20T00:00:00.000Z');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
