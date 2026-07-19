// ───────────────────────────────────────────────────────────────
// MODULE: Lane Registry Env Override Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const WEIGHTS_ENV = 'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON';
const SHADOW_ENV = 'SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON';

const DEFAULT_WEIGHTS = {
  explicit_author: 0.42,
  lexical: 0.28,
  graph_causal: 0.13,
  derived_generated: 0.12,
  semantic_shadow: 0.05,
} as const;

const DEFAULT_SHADOW_WEIGHTS = {
  explicit_author: 0.40,
  lexical: 0.25,
  graph_causal: 0.20,
  derived_generated: 0.10,
  semantic_shadow: 0.05,
} as const;

async function loadRegistryFresh() {
  vi.resetModules();
  return await import('../../lib/scorer/lane-registry.js');
}

describe('lane-registry env-override', () => {
  let originalWeights: string | undefined;
  let originalShadow: string | undefined;

  beforeEach(() => {
    originalWeights = process.env[WEIGHTS_ENV];
    originalShadow = process.env[SHADOW_ENV];
    delete process.env[WEIGHTS_ENV];
    delete process.env[SHADOW_ENV];
  });

  afterEach(() => {
    if (originalWeights === undefined) delete process.env[WEIGHTS_ENV];
    else process.env[WEIGHTS_ENV] = originalWeights;
    if (originalShadow === undefined) delete process.env[SHADOW_ENV];
    else process.env[SHADOW_ENV] = originalShadow;
    vi.resetModules();
  });

  it('preserves defaults when env vars are unset', async () => {
    const mod = await loadRegistryFresh();
    expect(mod.DEFAULT_SCORER_LANE_WEIGHTS).toEqual(DEFAULT_WEIGHTS);
    expect(mod.DEFAULT_SHADOW_SCORER_LANE_WEIGHTS).toEqual(DEFAULT_SHADOW_WEIGHTS);
  });

  it('merges partial env override with defaults', async () => {
    process.env[WEIGHTS_ENV] = JSON.stringify({ explicit_author: 0.50, lexical: 0.20 });
    const mod = await loadRegistryFresh();
    expect(mod.DEFAULT_SCORER_LANE_WEIGHTS).toEqual({
      ...DEFAULT_WEIGHTS,
      explicit_author: 0.50,
      lexical: 0.20,
    });
    expect(mod.DEFAULT_SHADOW_SCORER_LANE_WEIGHTS).toEqual(DEFAULT_SHADOW_WEIGHTS);
  });

  it('falls back to defaults on malformed JSON', async () => {
    process.env[WEIGHTS_ENV] = '{not valid json';
    const mod = await loadRegistryFresh();
    expect(mod.DEFAULT_SCORER_LANE_WEIGHTS).toEqual(DEFAULT_WEIGHTS);
  });

  it('rejects out-of-range values and unknown lane ids', async () => {
    process.env[WEIGHTS_ENV] = JSON.stringify({
      explicit_author: 1.5,
      lexical: -0.1,
      graph_causal: 'high',
      unknown_lane: 0.9,
      derived_generated: 0.15,
    });
    const mod = await loadRegistryFresh();
    expect(mod.DEFAULT_SCORER_LANE_WEIGHTS).toEqual({
      ...DEFAULT_WEIGHTS,
      derived_generated: 0.15,
    });
  });

  it('honors the shadow-weights env independently', async () => {
    process.env[SHADOW_ENV] = JSON.stringify({ semantic_shadow: 0.08 });
    const mod = await loadRegistryFresh();
    expect(mod.DEFAULT_SCORER_LANE_WEIGHTS).toEqual(DEFAULT_WEIGHTS);
    expect(mod.DEFAULT_SHADOW_SCORER_LANE_WEIGHTS).toEqual({
      ...DEFAULT_SHADOW_WEIGHTS,
      semantic_shadow: 0.08,
    });
  });

  it('rejects array JSON (must be a plain object)', async () => {
    process.env[WEIGHTS_ENV] = JSON.stringify([0.5, 0.3, 0.1, 0.05, 0.05]);
    const mod = await loadRegistryFresh();
    expect(mod.DEFAULT_SCORER_LANE_WEIGHTS).toEqual(DEFAULT_WEIGHTS);
  });
});
