// ───────────────────────────────────────────────────────────────
// 1. SEARCH FEATURE FLAGS TESTS
// ───────────────────────────────────────────────────────────────
// TEST: Search Feature Flags

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getGraphWalkRolloutState,
  isGraphWalkRuntimeEnabled,
  isGraphWalkTraceEnabled,
} from '../lib/search/graph-flags';
import {
  isContextHeadersEnabled,
  isFileWatcherEnabled,
  isGraphRefreshDisabled,
  isGraphSignalsEnabled,
  isMMREnabled,
  isMultiQueryEnabled,
  resolveGraphWalkRolloutState,
  isReconsolidationEnabled,
  isTRMEnabled,
  isContentRichShortQueryGraphPreservationEnabled,
  isOptInEnabled,
  isStrictOptInEnabled,
  parseFlagTristate,
} from '../lib/search/search-flags';

const FLAG_NAMES = [
  'SPECKIT_MMR',
  'SPECKIT_TRM',
  'SPECKIT_MULTI_QUERY',
  'SPECKIT_CONTEXT_HEADERS',
  'SPECKIT_RECONSOLIDATION',
  'SPECKIT_FILE_WATCHER',
  'SPECKIT_GRAPH_SIGNALS',
  'SPECKIT_GRAPH_REFRESH_MODE',
  'SPECKIT_GRAPH_WALK_ROLLOUT',
  'SPECKIT_ROLLOUT_PERCENT',
  'VOYAGE_API_KEY',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof FLAG_NAMES[number], string | undefined>> = {};

function clearFlags(): void {
  for (const flag of FLAG_NAMES) {
    delete process.env[flag];
  }
}

describe('Search Feature Flags', () => {
  beforeEach(() => {
    for (const flag of FLAG_NAMES) {
      ORIGINAL_ENV[flag] = process.env[flag];
    }
    clearFlags();
  });

  afterEach(() => {
    for (const flag of FLAG_NAMES) {
      if (ORIGINAL_ENV[flag] === undefined) {
        delete process.env[flag];
      } else {
        process.env[flag] = ORIGINAL_ENV[flag];
      }
    }
    });

  it('defaults graduated gates on', () => {
    expect(isMMREnabled()).toBe(true);
    expect(isTRMEnabled()).toBe(true);
    expect(isMultiQueryEnabled()).toBe(true);
    expect(isContextHeadersEnabled()).toBe(true);
    expect(isReconsolidationEnabled()).toBe(true);
  });

  it('disables each gate only when explicitly set to false', () => {
    process.env.SPECKIT_MMR = 'false';
    process.env.SPECKIT_TRM = 'false';
    process.env.SPECKIT_MULTI_QUERY = 'false';
    process.env.SPECKIT_CONTEXT_HEADERS = 'false';
    process.env.SPECKIT_RECONSOLIDATION = 'false';

    expect(isMMREnabled()).toBe(false);
    expect(isTRMEnabled()).toBe(false);
    expect(isMultiQueryEnabled()).toBe(false);
    expect(isContextHeadersEnabled()).toBe(false);
    expect(isReconsolidationEnabled()).toBe(false);
  });

  it('keeps gates enabled when explicitly set to true', () => {
    process.env.SPECKIT_MMR = 'true';
    process.env.SPECKIT_TRM = 'true';
    process.env.SPECKIT_MULTI_QUERY = 'true';
    process.env.SPECKIT_CONTEXT_HEADERS = 'true';
    process.env.SPECKIT_RECONSOLIDATION = 'true';

    expect(isMMREnabled()).toBe(true);
    expect(isTRMEnabled()).toBe(true);
    expect(isMultiQueryEnabled()).toBe(true);
    expect(isContextHeadersEnabled()).toBe(true);
    expect(isReconsolidationEnabled()).toBe(true);
  });

  it('reconsolidation defaults on and disables only for explicit false/0', () => {
    delete process.env.SPECKIT_RECONSOLIDATION;
    expect(isReconsolidationEnabled()).toBe(true);

    process.env.SPECKIT_RECONSOLIDATION = 'TRUE';
    expect(isReconsolidationEnabled()).toBe(true);

    process.env.SPECKIT_RECONSOLIDATION = '1';
    expect(isReconsolidationEnabled()).toBe(true);

    process.env.SPECKIT_RECONSOLIDATION = 'false';
    expect(isReconsolidationEnabled()).toBe(false);

    process.env.SPECKIT_RECONSOLIDATION = '0';
    expect(isReconsolidationEnabled()).toBe(false);
  });

  it('file watcher remains opt-in by default', () => {
    expect(isFileWatcherEnabled()).toBe(false);
  });

  it('enables file watcher only with explicit opt-in', () => {
    process.env.SPECKIT_FILE_WATCHER = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    expect(isFileWatcherEnabled()).toBe(true);
  });

  it('applies rollout policy to file watcher and defaults to enabled on partial rollout without identity', () => {
    process.env.SPECKIT_FILE_WATCHER = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '50';

    // With no identity, rollout policy defaults to enabled (fail-open for missing identity)
    expect(isFileWatcherEnabled()).toBe(true);
  });

  it('defaults graph-walk rollout to bounded_runtime when graph signals are enabled', () => {
    expect(resolveGraphWalkRolloutState()).toBe('bounded_runtime');
  });

  it('supports explicit trace_only graph-walk rollout', () => {
    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'trace_only';
    expect(resolveGraphWalkRolloutState()).toBe('trace_only');
    expect(isGraphSignalsEnabled()).toBe(true);
    expect(getGraphWalkRolloutState()).toBe('trace_only');
    expect(isGraphWalkTraceEnabled()).toBe(true);
    expect(isGraphWalkRuntimeEnabled()).toBe(false);
  });

  it('keeps broader graph signals enabled when only the graph-walk rollout is turned off', () => {
    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'off';
    expect(resolveGraphWalkRolloutState()).toBe('off');
    expect(isGraphSignalsEnabled()).toBe(true);
  });

  it('disables graph-walk rollout when graph signals are turned off', () => {
    process.env.SPECKIT_GRAPH_SIGNALS = 'false';
    expect(resolveGraphWalkRolloutState()).toBe('off');
    expect(isGraphSignalsEnabled()).toBe(false);
    expect(getGraphWalkRolloutState()).toBe('off');
    expect(isGraphWalkTraceEnabled()).toBe(false);
    expect(isGraphWalkRuntimeEnabled()).toBe(false);
  });

  it('reports graph refresh as disabled only when refresh mode is explicitly off', () => {
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
    expect(isGraphRefreshDisabled()).toBe(false);

    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'off';
    expect(isGraphRefreshDisabled()).toBe(true);

    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'scheduled';
    expect(isGraphRefreshDisabled()).toBe(false);
  });

  it('treats bounded_runtime as a trace-visible runtime-enabled graph-walk mode', () => {
    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'bounded_runtime';
    expect(getGraphWalkRolloutState()).toBe('bounded_runtime');
    expect(isGraphWalkTraceEnabled()).toBe(true);
    expect(isGraphWalkRuntimeEnabled()).toBe(true);
  });
});

// Add coverage for planner/save flags that have outgrown dedicated parser coverage
import {
  resolveSavePlannerMode,
  isSaveReconsolidationEnabled,
  isPostInsertEnrichmentEnabled,
  isPostInsertEnrichmentAsync,
  isQualityAutoFixEnabled,
  isDocscoreAggregationEnabled,
  isSaveQualityGateEnabled,
  isDynamicTokenBudgetEnabled,
  isConfidenceTruncationEnabled,
  isSearchFallbackEnabled,
  isFolderDiscoveryEnabled,
  isSessionBoostEnabled,
  isCausalBoostEnabled,
} from '../lib/search/search-flags';

describe('Search Flags: Planner and Save Flags (T254)', () => {
  const PLANNER_FLAGS = [
    'SPECKIT_SAVE_PLANNER_MODE',
    'SPECKIT_RECONSOLIDATION_ENABLED',
    'SPECKIT_POST_INSERT_ENRICHMENT_ENABLED',
    'SPECKIT_POST_INSERT_ENRICHMENT_SYNC',
    'SPECKIT_QUALITY_AUTO_FIX',
  ] as const;

  const originals: Partial<Record<string, string | undefined>> = {};

  beforeEach(() => {
    for (const flag of PLANNER_FLAGS) {
      originals[flag] = process.env[flag];
      delete process.env[flag];
    }
  });

  afterEach(() => {
    for (const flag of PLANNER_FLAGS) {
      if (originals[flag] === undefined) {
        delete process.env[flag];
      } else {
        process.env[flag] = originals[flag];
      }
    }
  });

  it('resolveSavePlannerMode defaults to plan-only', () => {
    expect(resolveSavePlannerMode()).toBe('plan-only');
  });

  it('resolveSavePlannerMode accepts full-auto', () => {
    process.env.SPECKIT_SAVE_PLANNER_MODE = 'full-auto';
    expect(resolveSavePlannerMode()).toBe('full-auto');
  });

  it('resolveSavePlannerMode accepts full_auto (underscore variant)', () => {
    process.env.SPECKIT_SAVE_PLANNER_MODE = 'full_auto';
    expect(resolveSavePlannerMode()).toBe('full-auto');
  });

  it('resolveSavePlannerMode accepts hybrid', () => {
    process.env.SPECKIT_SAVE_PLANNER_MODE = 'hybrid';
    expect(resolveSavePlannerMode()).toBe('hybrid');
  });

  it('resolveSavePlannerMode falls back to plan-only for unknown values', () => {
    process.env.SPECKIT_SAVE_PLANNER_MODE = 'unknown-mode';
    expect(resolveSavePlannerMode()).toBe('plan-only');
  });

  it('post-insert enrichment + quality auto-fix default ON (opt-out); reconsolidation stays opt-in (OFF)', () => {
    expect(isPostInsertEnrichmentEnabled()).toBe(true);
    expect(isQualityAutoFixEnabled()).toBe(true);
    // Reconsolidation gates a destructive merge/deprecate path — kept opt-in (default OFF).
    expect(isSaveReconsolidationEnabled()).toBe(false);
  });

  it('opt-out flags disable on =false; reconsolidation enables on =true', () => {
    process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED = 'false';
    process.env.SPECKIT_QUALITY_AUTO_FIX = 'false';
    process.env.SPECKIT_RECONSOLIDATION_ENABLED = 'true';
    expect(isPostInsertEnrichmentEnabled()).toBe(false);
    expect(isQualityAutoFixEnabled()).toBe(false);
    expect(isSaveReconsolidationEnabled()).toBe(true);
  });

  it('post-insert enrichment runs async by default; SYNC=true forces synchronous', () => {
    expect(isPostInsertEnrichmentAsync()).toBe(true);
    process.env.SPECKIT_POST_INSERT_ENRICHMENT_SYNC = 'true';
    expect(isPostInsertEnrichmentAsync()).toBe(false);
  });

  it('graduated default-on flags are enabled without env vars', () => {
    expect(isDocscoreAggregationEnabled()).toBe(true);
    expect(isSaveQualityGateEnabled()).toBe(true);
    expect(isDynamicTokenBudgetEnabled()).toBe(true);
    expect(isConfidenceTruncationEnabled()).toBe(true);
    expect(isSearchFallbackEnabled()).toBe(true);
    expect(isFolderDiscoveryEnabled()).toBe(true);
    expect(isSessionBoostEnabled()).toBe(true);
    expect(isCausalBoostEnabled()).toBe(true);
  });
});

// F5a/F5b coverage (016-cross-package-flag-governance): the content-rich
// short-query graph-preservation flag flipped from graduated default-ON to
// opt-in default-OFF, and now shares the exported isOptInEnabled() helper
// with capability-flags.ts's SPECKIT_QUERY_TIME_EXISTENCE_FILTER.
describe('Search Flags: content-rich short-query graph preservation polarity (F5a/F5b)', () => {
  const FLAG = 'SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION';
  let original: string | undefined;

  beforeEach(() => {
    original = process.env[FLAG];
    delete process.env[FLAG];
  });

  afterEach(() => {
    if (original === undefined) {
      delete process.env[FLAG];
    } else {
      process.env[FLAG] = original;
    }
  });

  it('defaults to disabled (opt-in) when unset', () => {
    expect(isContentRichShortQueryGraphPreservationEnabled()).toBe(false);
  });

  it('stays disabled for unrecognized or explicit-off values', () => {
    process.env[FLAG] = 'false';
    expect(isContentRichShortQueryGraphPreservationEnabled()).toBe(false);

    process.env[FLAG] = '0';
    expect(isContentRichShortQueryGraphPreservationEnabled()).toBe(false);

    process.env[FLAG] = 'nonsense';
    expect(isContentRichShortQueryGraphPreservationEnabled()).toBe(false);
  });

  it('enables only via explicit opt-in values', () => {
    for (const value of ['true', '1', 'yes', 'on', 'enabled', 'TRUE']) {
      process.env[FLAG] = value;
      expect(isContentRichShortQueryGraphPreservationEnabled(), `value=${value}`).toBe(true);
    }
  });

  it('exports isOptInEnabled and reads the same flag directly', () => {
    process.env[FLAG] = 'true';
    expect(isOptInEnabled(FLAG)).toBe(true);
    expect(isOptInEnabled(FLAG)).toBe(isContentRichShortQueryGraphPreservationEnabled());
  });
});

// parseFlagTristate() is the single shared vocabulary authority every migrated
// capability-flags.ts/sibling site now delegates to. This proves the full
// 10-value vocabulary, unset, empty, and
// one garbage value against both default polarities.
describe('Search Flags: parseFlagTristate() vocabulary matrix', () => {
  const FLAG = 'SPECKIT_PARSE_FLAG_TRISTATE_TEST';
  let original: string | undefined;

  beforeEach(() => {
    original = process.env[FLAG];
    delete process.env[FLAG];
  });

  afterEach(() => {
    if (original === undefined) {
      delete process.env[FLAG];
    } else {
      process.env[FLAG] = original;
    }
  });

  const OPT_IN_VALUES = ['true', '1', 'yes', 'on', 'enabled'];
  const OPT_OUT_VALUES = ['false', '0', 'no', 'off', 'disabled'];

  it('resolves every opt-in value to true regardless of defaultValue', () => {
    for (const value of OPT_IN_VALUES) {
      process.env[FLAG] = value;
      expect(parseFlagTristate(FLAG, true), `value=${value}, default=true`).toBe(true);
      expect(parseFlagTristate(FLAG, false), `value=${value}, default=false`).toBe(true);
    }
  });

  it('resolves every opt-out value to false regardless of defaultValue', () => {
    for (const value of OPT_OUT_VALUES) {
      process.env[FLAG] = value;
      expect(parseFlagTristate(FLAG, true), `value=${value}, default=true`).toBe(false);
      expect(parseFlagTristate(FLAG, false), `value=${value}, default=false`).toBe(false);
    }
  });

  it('is case-insensitive and whitespace-tolerant for both vocabularies', () => {
    for (const value of [...OPT_IN_VALUES, ...OPT_OUT_VALUES]) {
      const expected = OPT_IN_VALUES.includes(value);
      process.env[FLAG] = ` ${value.toUpperCase()} `;
      expect(parseFlagTristate(FLAG, !expected), `value="${value.toUpperCase()}" (padded)`).toBe(expected);
    }
  });

  it('resolves unset, empty, and unrecognized values to defaultValue', () => {
    delete process.env[FLAG];
    expect(parseFlagTristate(FLAG, true)).toBe(true);
    expect(parseFlagTristate(FLAG, false)).toBe(false);

    process.env[FLAG] = '';
    expect(parseFlagTristate(FLAG, true)).toBe(true);
    expect(parseFlagTristate(FLAG, false)).toBe(false);

    process.env[FLAG] = 'maybe';
    expect(parseFlagTristate(FLAG, true)).toBe(true);
    expect(parseFlagTristate(FLAG, false)).toBe(false);
  });

  it('keeps strict opt-in parsing limited to true and 1', () => {
    const cases: Array<[string | undefined, boolean]> = [
      [undefined, false],
      ['', false],
      ['   ', false],
      ['true', true],
      [' TRUE ', true],
      ['1', true],
      [' 1 ', true],
      ['yes', false],
      ['on', false],
      ['enabled', false],
      ['false', false],
      ['0', false],
      ['invalid', false],
    ];

    for (const [value, expected] of cases) {
      if (value === undefined) {
        delete process.env[FLAG];
      } else {
        process.env[FLAG] = value;
      }
      expect(isStrictOptInEnabled(FLAG), `value=${String(value)}`).toBe(expected);
    }
  });
});
