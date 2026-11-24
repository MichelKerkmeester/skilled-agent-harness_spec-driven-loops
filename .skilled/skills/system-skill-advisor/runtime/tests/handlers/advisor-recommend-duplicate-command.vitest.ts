// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Recommend Duplicate Command Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock('node:child_process', () => ({ execFileSync: mockedChild.execFileSync }));

import { enrichCompiledRoutes } from '../../handlers/advisor-recommend.js';
import type { AdvisorRecommendOutput } from '../../schemas/advisor-tool-schemas.js';

type Recommendation = AdvisorRecommendOutput['recommendations'][number];

const prompt = 'run 5 review iterations on the parser';

function outputWith(recommendations: Recommendation[]): AdvisorRecommendOutput {
  return {
    workspaceRoot: '/workspace',
    effectiveThresholds: {
      confidenceThreshold: 0.5,
      uncertaintyThreshold: 0.2,
      confidenceOnly: false,
    },
    recommendations,
    ambiguous: false,
    freshness: 'live',
    trustState: {
      state: 'live',
      reason: null,
      generation: 1,
      checkedAt: '2026-11-13T00:00:00.000Z',
      lastLiveAt: '2026-11-13T00:00:00.000Z',
    },
    generatedAt: '2026-11-13T00:00:00.000Z',
    cache: {
      hit: false,
      sourceSignaturePresent: true,
    },
  };
}

function recommendation(skillId: string, extra: Partial<Recommendation> = {}): Recommendation {
  return {
    skillId,
    score: 0.9,
    confidence: 0.95,
    uncertainty: 0.05,
    dominantLane: 'explicit_author',
    ...extra,
  };
}

describe('enrichCompiledRoutes duplicate-command guard', () => {
  let workspaceRoot: string;

  beforeEach(() => {
    workspaceRoot = mkdtempSync(join(tmpdir(), 'advisor-duplicate-command-'));
    mkdirSync(join(workspaceRoot, '.skilled', 'bin'), { recursive: true });
    // The enrichment probes the front door for --prompt-stdin support before it
    // shells out, so the fixture stands in for a copy that can read stdin.
    writeFileSync(join(workspaceRoot, '.skilled', 'bin', 'compiled-route.cjs'), "args.includes('--prompt-stdin');\n");
    vi.clearAllMocks();
    mockedChild.execFileSync.mockReturnValue(JSON.stringify({
      action: 'route',
      hubId: 'system-deep-loop',
      selectionKind: 'single',
      targets: [{ workflowMode: 'review' }],
    }));
  });

  afterEach(() => {
    rmSync(workspaceRoot, { recursive: true, force: true });
  });

  it('offers a derived command on one row only', () => {
    const enriched = enrichCompiledRoutes(
      outputWith([recommendation('system-deep-loop'), recommendation('system-deep-loop')]),
      prompt,
      workspaceRoot,
    );

    expect(enriched.recommendations[0]?.command).toBe('/deep:review');
    // The second row derives the same command, and the reader already has it from
    // the head, so the lower row must not spend its slot repeating the offer.
    expect(enriched.recommendations[1]?.command).toBeUndefined();
    expect(enriched.recommendations[1]?.policy).toBeUndefined();
    expect(enriched.recommendations[1]?.compiledRoute).toBeDefined();
    expect(enriched.recommendations[1]?.needsMode).toBeUndefined();
  });

  it('strips every field that carries a command the guard withholds', () => {
    const offered = {
      command: '/deep:review',
      policy: 'ask' as const,
      ownerSkillId: 'system-deep-loop',
      typed: true as const,
    };
    const enriched = enrichCompiledRoutes(
      outputWith([
        recommendation('system-deep-loop', offered),
        recommendation('system-deep-loop', offered),
      ]),
      prompt,
      workspaceRoot,
    );

    // The head is the row a reader acts on, so it keeps what it already carries.
    expect(enriched.recommendations[0]).toEqual(expect.objectContaining(offered));
    // A withheld command cannot survive on its own row through the spread, so the
    // row loses the command, its policy, its owner and the typed marker together.
    const withheld = enriched.recommendations[1];
    expect(withheld?.command).toBeUndefined();
    expect(withheld?.policy).toBeUndefined();
    expect(withheld?.ownerSkillId).toBeUndefined();
    expect(withheld?.typed).toBeUndefined();
    expect(withheld?.compiledRoute).toBeDefined();
  });
});
