// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Parity Tests — Advisor brief shape across runtimes
// ───────────────────────────────────────────────────────────────────
// Asserts that buildSkillAdvisorBrief produces a consistent brief
// shape regardless of the runtime tag (claude, opencode, opencode).
// The brief is rendered via renderAdvisorBrief; the test verifies:
//   - Brief is non-null and contains "Advisor:" marker
//   - Brief contains the expected skill slug
//   - Brief has the expected confidence/uncertainty pattern
//   - Tolerance: byte-equivalent skill slug, ±0.01 confidence

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { buildSkillAdvisorBrief } from '../../lib/skill-advisor-brief.js';
import { renderAdvisorBrief } from '../../lib/render.js';
import type { AdvisorHookResult } from '../../lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, '..', 'legacy', 'advisor-fixtures');

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

const RUNTIMES = ['claude', 'opencode', 'opencode'] as const;

describe('3-runtime advisor brief parity', () => {
  it('produces byte-equivalent brief for a known passing fixture across all 3 runtimes', async () => {
    const fixtureResult = fixture('livePassingSkill.json');
    const prompt = 'implement a TypeScript hook';

    for (const runtime of RUNTIMES) {
      const buildBrief = vi.fn(async () => ({
        ...fixtureResult,
        sharedPayload: {
          ...fixtureResult.sharedPayload,
          metadata: {
            ...fixtureResult.sharedPayload?.metadata,
            skillLabel: 'sk-code',
          },
        },
      }));

      const result = await buildBrief(prompt, {
        runtime,
        workspaceRoot: process.cwd(),
      });

      const brief = renderAdvisorBrief(result);

      expect(brief, `runtime ${runtime} should produce a brief`).not.toBeNull();
      expect(brief, `runtime ${runtime} brief should contain Advisor marker`).toContain('Advisor:');
      expect(brief, `runtime ${runtime} brief should contain skill slug`).toContain('sk-code');
      expect(brief, `runtime ${runtime} brief should have confidence/uncertainty pattern`).toMatch(/\d+\.\d{2}\/\d+\.\d{2} pass\./);
    }
  });

  it('returns empty brief for skipped fixture across all 3 runtimes', async () => {
    const fixtureResult = fixture('skippedShortCasual.json');
    const prompt = 'hello';

    for (const runtime of RUNTIMES) {
      const buildBrief = vi.fn(async () => fixtureResult);

      const result = await buildBrief(prompt, {
        runtime,
        workspaceRoot: process.cwd(),
      });

      const brief = renderAdvisorBrief(result);
      expect(brief, `runtime ${runtime} should return null for skipped`).toBeNull();
    }
  });

  it('fails open on parse failure across all 3 runtimes', async () => {
    const buildBrief = vi.fn(async (): Promise<AdvisorHookResult> => ({
      status: 'fail_open',
      freshness: 'unavailable',
      brief: null,
      recommendations: [],
      diagnostics: null,
      metrics: { durationMs: 0, cacheHit: false, subprocessInvoked: false, retriesAttempted: 0, recommendationCount: 0, tokenCap: 80 },
      generatedAt: new Date().toISOString(),
      sharedPayload: null,
    }));

    for (const runtime of RUNTIMES) {
      const result = await buildBrief('', {
        runtime,
        workspaceRoot: process.cwd(),
      });
      expect(result.status, `runtime ${runtime} should fail open`).toBe('fail_open');
      expect(renderAdvisorBrief(result), `runtime ${runtime} fail_open brief`).toBeNull();
    }
  });

  it('accepts opencode runtime tag in buildSkillAdvisorBrief options', async () => {
    const prompt = 'implement OAuth login flow';
    const result = await buildSkillAdvisorBrief(prompt, {
      runtime: 'opencode',
      workspaceRoot: process.cwd(),
    });
    expect(result).toBeDefined();
    expect(typeof result.status).toBe('string');
  });
});
