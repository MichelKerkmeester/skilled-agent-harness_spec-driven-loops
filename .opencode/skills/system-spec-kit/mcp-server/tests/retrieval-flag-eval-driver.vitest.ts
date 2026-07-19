// ───────────────────────────────────────────────────────────────
// 1. TEST — RETRIEVAL FLAG-EVAL DRIVER MEASUREMENT FIDELITY
// ───────────────────────────────────────────────────────────────
//
// Guards the two measurement-fidelity contracts of the per-flag retrieval
// benchmark driver:
//   - Per-flag deltas are measured on the production default routing path
//     (routeQuery picks the channel subset), NOT a forced all-channels path.
//   - The channel ablation only sweeps lanes it can genuinely disable; the
//     trigger lane runs unconditionally and ignores triggerPhrases, so it is
//     excluded rather than reported as an identical-by-construction zero-delta.
//
// Both assertions fail against the pre-fix driver, which hardcoded
// forceAllChannels:true on the per-flag path and swept ALL_CHANNELS (trigger
// included) while passing an inert triggerPhrases lever.

import { describe, it, expect } from 'vitest';

import {
  buildPerFlagSearchOptions,
  buildChannelAblationOptions,
  selectAblationChannels,
  UNABLATABLE_CHANNELS,
} from '../scripts/evals/run-retrieval-flag-eval.mjs';
import { ALL_CHANNELS, toHybridSearchFlags } from '../lib/eval/ablation-framework';

describe('retrieval flag-eval driver — measurement fidelity', () => {
  describe('per-flag search options (default routing)', () => {
    it('does not force all channels, so per-flag deltas measure the routed path', () => {
      const opts = buildPerFlagSearchOptions(20) as Record<string, unknown>;
      expect('forceAllChannels' in opts).toBe(false);
    });

    it('carries the recall limit', () => {
      const opts = buildPerFlagSearchOptions(20);
      expect(opts.limit).toBe(20);
    });

    it('lets per-query overrides through without reintroducing forceAllChannels', () => {
      const opts = buildPerFlagSearchOptions(20, { evaluationMode: true }) as Record<string, unknown>;
      expect(opts.evaluationMode).toBe(true);
      expect('forceAllChannels' in opts).toBe(false);
    });
  });

  describe('channel ablation (trigger lane excluded)', () => {
    it('treats trigger as the unablatable lane', () => {
      expect(UNABLATABLE_CHANNELS).toContain('trigger');
    });

    it('excludes the trigger lane from the channel sweep', () => {
      const channels = selectAblationChannels(ALL_CHANNELS);
      expect(channels).not.toContain('trigger');
    });

    it('still sweeps every other ablation channel', () => {
      const channels = selectAblationChannels(ALL_CHANNELS);
      for (const channel of ALL_CHANNELS) {
        if (channel === 'trigger') continue;
        expect(channels).toContain(channel);
      }
    });

    it('keeps forceAllChannels true for the ablation baseline and drops the no-op triggerPhrases lever', () => {
      const opts = buildChannelAblationOptions(toHybridSearchFlags(new Set()), 20) as Record<string, unknown>;
      expect(opts.forceAllChannels).toBe(true);
      expect('triggerPhrases' in opts).toBe(false);
    });

    it('maps a disabled channel to the matching use* flag', () => {
      const opts = buildChannelAblationOptions(toHybridSearchFlags(new Set(['graph'])), 20);
      expect(opts.useGraph).toBe(false);
      expect(opts.useVector).toBe(true);
    });
  });
});
