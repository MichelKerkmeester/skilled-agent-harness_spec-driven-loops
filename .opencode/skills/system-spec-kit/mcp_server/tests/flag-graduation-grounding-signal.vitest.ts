// ───────────────────────────────────────────────────────────────
// TEST: Flag Graduation: Grounding Signal
// ───────────────────────────────────────────────────────────────
// SPECKIT_GROUNDING_SIGNAL_V1 surfaces a grounded / low_grounding label on the
// search envelope, built from the lexical overlap already on the rows. The flag
// graduation benchmark could not measure it because the off-corpus class only
// produces ungrounded misses, so it never exercised the grounded branch. These
// cases drive both branches off the shared fixtures the benchmark also reads, and
// prove the field is set correctly each way and absent with the flag off.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { assessGrounding, type ScoredResult } from '../lib/search/confidence-scoring';
import { formatSearchResults } from '../formatters/search-results';
import { FLAG_FEATURE_FIXTURES } from '../lib/eval/fixtures/flag-feature-fixtures';
import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';

const GROUNDING_SIGNAL_FLAG = 'SPECKIT_GROUNDING_SIGNAL_V1';
const CONFIDENCE_CALIBRATION_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
const MANAGED_FLAGS = [GROUNDING_SIGNAL_FLAG, CONFIDENCE_CALIBRATION_FLAG] as const;

const saved = new Map<string, string | undefined>();

beforeEach(() => {
  for (const flag of MANAGED_FLAGS) saved.set(flag, process.env[flag]);
  for (const flag of MANAGED_FLAGS) delete process.env[flag];
  process.env[CONFIDENCE_CALIBRATION_FLAG] = 'false';
});

afterEach(() => {
  for (const flag of MANAGED_FLAGS) {
    const prior = saved.get(flag);
    if (prior === undefined) delete process.env[flag];
    else process.env[flag] = prior;
  }
});

const { grounded, low } = FLAG_FEATURE_FIXTURES.grounding;

function parseEnvelope(response: MCPResponse): MCPEnvelope<Record<string, unknown>> {
  const first = response.content[0];
  if (first?.type !== 'text') throw new Error('Expected text MCP content');
  return JSON.parse(first.text) as MCPEnvelope<Record<string, unknown>>;
}

describe('flag graduation: grounding signal', () => {
  it('grounds on real query-term overlap when the lexical lane never scored the hit', () => {
    const assessment = assessGrounding(grounded.rows as ScoredResult[], { query: grounded.query });
    expect(assessment?.signal).toBe('grounded');
    expect(assessment?.topHitGrounded).toBe(true);
  });

  it('reads low_grounding for a vector-only hit with no query-term overlap', () => {
    const assessment = assessGrounding(low.rows as ScoredResult[], { query: low.query });
    expect(assessment?.signal).toBe('low_grounding');
    expect(assessment?.topHitGrounded).toBe(false);
  });

  it('surfaces the correct grounding field on the envelope with the flag on for each branch', async () => {
    process.env[GROUNDING_SIGNAL_FLAG] = 'true';

    const groundedEnv = parseEnvelope(
      await formatSearchResults(grounded.rows, 'semantic', false, null, null, Date.now(), {}, false, grounded.query),
    );
    expect((groundedEnv.data.grounding as Record<string, unknown>)?.signal).toBe('grounded');

    const lowEnv = parseEnvelope(
      await formatSearchResults(low.rows, 'semantic', false, null, null, Date.now(), {}, false, low.query),
    );
    expect((lowEnv.data.grounding as Record<string, unknown>)?.signal).toBe('low_grounding');
  });

  it('omits the grounding field entirely with the flag off, leaving the shipped shape unchanged', async () => {
    delete process.env[GROUNDING_SIGNAL_FLAG];
    const groundedEnv = parseEnvelope(
      await formatSearchResults(grounded.rows, 'semantic', false, null, null, Date.now(), {}, false, grounded.query),
    );
    expect('grounding' in groundedEnv.data).toBe(false);
  });
});
