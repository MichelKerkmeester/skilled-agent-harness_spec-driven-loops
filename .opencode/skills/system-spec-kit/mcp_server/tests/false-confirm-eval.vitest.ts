import { describe, expect, it } from 'vitest';

import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
} from '../lib/eval/ground-truth-data';
import { computeCitabilityConfusionMetrics } from '../lib/eval/eval-metrics';

import {
  OFF_CORPUS_CATEGORY,
  DEFAULT_MAX_RATE,
  parseMaxRate,
  parseGrandfather,
  computeFalseConfirmRate,
  buildConfusionSample,
  evaluateGate,
  resolveOffCorpusClass,
} from '../scripts/evals/run-false-confirm-eval.mjs';

const EXPECTED_TERMS = ['kubernetes', 'oauth', 'kafka', 'terraform', 'graphql', 'webpack'];

function offCorpusQueries() {
  return GROUND_TRUTH_QUERIES.filter((q) => q.category === OFF_CORPUS_CATEGORY);
}

describe('off_corpus ground-truth class', () => {
  it('surfaces an off_corpus class carrying the absent terms', () => {
    const queries = offCorpusQueries();
    expect(queries.length).toBeGreaterThanOrEqual(6);

    for (const term of EXPECTED_TERMS) {
      const hit = queries.find((q) => q.query.toLowerCase().includes(term));
      expect(hit, `expected an off_corpus query for ${term}`).toBeTruthy();
    }
  });

  it('pins kubernetes as a permanent regression anchor', () => {
    const anchor = offCorpusQueries().find((q) => q.query.toLowerCase().includes('kubernetes'));
    expect(anchor).toBeTruthy();
    expect(anchor?.notes).toContain('PERMANENT ANCHOR');
  });

  it('carries zero relevance rows for every off_corpus query', () => {
    const offCorpusIds = new Set(offCorpusQueries().map((q) => q.id));
    const rowsForOffCorpus = GROUND_TRUTH_RELEVANCES.filter((r) => offCorpusIds.has(r.queryId));
    expect(rowsForOffCorpus).toHaveLength(0);
  });

  it('keeps the off_corpus class disjoint from the in-corpus hard_negative decoys', () => {
    const offCorpusIds = new Set(offCorpusQueries().map((q) => q.id));
    const hardNegatives = GROUND_TRUTH_QUERIES.filter((q) => q.category === 'hard_negative');

    // The two classes share no ids, so the off_corpus class is a separate class
    // rather than a mutation of the existing decoys.
    for (const hn of hardNegatives) {
      expect(offCorpusIds.has(hn.id)).toBe(false);
    }

    // The in-corpus decoys still each carry a real relevance-3 target, the
    // property that makes them distinct from the no-target off_corpus class.
    for (const hn of hardNegatives) {
      const hasExactTarget = GROUND_TRUTH_RELEVANCES.some(
        (r) => r.queryId === hn.id && r.relevance === 3,
      );
      expect(hasExactTarget, `hard_negative ${hn.id} should keep its relevance-3 target`).toBe(true);
    }
  });

  it('resolveOffCorpusClass returns the class and rejects a drifted target', () => {
    const resolved = resolveOffCorpusClass(GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES);
    expect(resolved.length).toBe(offCorpusQueries().length);

    const anchorId = offCorpusQueries().find((q) => q.query.toLowerCase().includes('kubernetes'))!.id;
    const drifted = [...GROUND_TRUTH_RELEVANCES, { queryId: anchorId, memoryId: 999999, relevance: 3 as const }];
    expect(() => resolveOffCorpusClass(GROUND_TRUTH_QUERIES, drifted)).toThrow(/zero relevance rows/);
  });
});

describe('false-confirm metric', () => {
  it('reads falseGoodOnHardNegatives through the existing confusion metric', () => {
    // Three off-corpus hard-negatives, one wrongly verdicted good. The metric is
    // reused verbatim, this test only confirms the wiring and the rate math.
    const samples = [
      buildConfusionSample('good'),
      buildConfusionSample('weak'),
      buildConfusionSample('gap'),
    ];
    const metrics = computeCitabilityConfusionMetrics(samples);

    expect(metrics.hardNegativeCount).toBe(3);
    expect(metrics.falseGoodOnHardNegatives).toBe(1);
    expect(computeFalseConfirmRate(metrics)).toBeCloseTo(1 / 3, 10);
  });

  it('reports a zero rate when no hard negatives are present', () => {
    expect(computeFalseConfirmRate({ hardNegativeCount: 0, falseGoodOnHardNegatives: 0 })).toBe(0);
  });

  it('marks every off-corpus sample as a non-citable hard negative', () => {
    const sample = buildConfusionSample('good');
    expect(sample.expectedCitable).toBe(false);
    expect(sample.isHardNegative).toBe(true);
    expect(sample.predicted).toBe('good');
  });
});

describe('false-confirm gate', () => {
  it('reports without enforcing when the bar env is unset', () => {
    const gate = evaluateGate({ rate: 0.5, maxRate: parseMaxRate(undefined), grandfather: false });
    expect(gate.enforced).toBe(false);
    expect(gate.pass).toBe(true);
    expect(gate.exitCode).toBe(0);
  });

  it('records the rate and exits zero in grandfather mode even at a zero bar', () => {
    const gate = evaluateGate({ rate: 0.5, maxRate: DEFAULT_MAX_RATE, grandfather: true });
    expect(gate.enforced).toBe(false);
    expect(gate.exitCode).toBe(0);
  });

  it('fails when the measured rate exceeds the configured bar', () => {
    const gate = evaluateGate({ rate: 0.34, maxRate: parseMaxRate('0.0'), grandfather: false });
    expect(gate.enforced).toBe(true);
    expect(gate.pass).toBe(false);
    expect(gate.exitCode).toBe(1);
  });

  it('passes when the measured rate is within the configured bar', () => {
    const gate = evaluateGate({ rate: 0.1, maxRate: parseMaxRate('0.2'), grandfather: false });
    expect(gate.enforced).toBe(true);
    expect(gate.pass).toBe(true);
    expect(gate.exitCode).toBe(0);
  });
});

describe('gate env parsing', () => {
  it('treats an unset or empty bar as default-off', () => {
    expect(parseMaxRate(undefined)).toBeNull();
    expect(parseMaxRate('')).toBeNull();
    expect(parseMaxRate('  ')).toBeNull();
  });

  it('parses a numeric bar within range', () => {
    expect(parseMaxRate('0')).toBe(0);
    expect(parseMaxRate('0.25')).toBe(0.25);
    expect(parseMaxRate('1')).toBe(1);
  });

  it('rejects a non-numeric or out-of-range bar at parse', () => {
    expect(() => parseMaxRate('off')).toThrow(/finite number/);
    expect(() => parseMaxRate('-0.1')).toThrow(/\[0,1\]/);
    expect(() => parseMaxRate('1.5')).toThrow(/\[0,1\]/);
  });

  it('reads the grandfather flag from env or argv', () => {
    expect(parseGrandfather({ SPECKIT_FALSE_CONFIRM_GRANDFATHER: 'true' }, [])).toBe(true);
    expect(parseGrandfather({ SPECKIT_FALSE_CONFIRM_GRANDFATHER: '1' }, [])).toBe(true);
    expect(parseGrandfather({}, ['node', 'script', '--grandfather'])).toBe(true);
    expect(parseGrandfather({}, ['node', 'script'])).toBe(false);
  });
});
