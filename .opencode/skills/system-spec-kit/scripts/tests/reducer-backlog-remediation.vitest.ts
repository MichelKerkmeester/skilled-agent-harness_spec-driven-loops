// Coverage for the 5 reducer behavioral changes:
//   LG-0001 dashboard pause/stuck surfacing
//   LG-0005 carry scopeProof + affectedSurfaceHints
//   LG-0006 traceabilityChecks rollup
//   LG-0008 content_hash two-tier dedup
//   LG-0033 additive required-field validation
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const reducer = require('../../../system-deep-loop/runtime/scripts/reduce-state.cjs') as {
  reduceReviewState: (specFolder: string, options?: { write?: boolean; lenient?: boolean }) => {
    registry: Record<string, any>;
    dashboard: string;
  };
  deltaRecordToFinding: (record: Record<string, any>) => Record<string, any> | null;
  deriveDashboardStatus: (config: any, records: any[], terminalStop: any) => string;
  collapseFindingsByDedupKey: (entries: any[]) => any[];
  buildTraceabilityRollup: (records: any[]) => { summary: Record<string, number>; results: any[] };
  validateReviewRecordFields: (records: any[]) => Array<{ index: number; rule: string; detail: string }>;
};

const tempRoots: string[] = [];

function makeTempSpecFolder(slug: string): string {
  const projectRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `reducer-backlog-${slug}-`)));
  tempRoots.push(projectRoot);
  const specFolder = path.join(projectRoot, 'specs', 'phase-007', 'reducer');
  fs.mkdirSync(path.join(specFolder, 'review', 'iterations'), { recursive: true });
  fs.mkdirSync(path.join(specFolder, 'review', 'deltas'), { recursive: true });
  return specFolder;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('LG-0001: dashboard pause/stuck surfacing', () => {
  it('returns PAUSED when the latest event is userPaused', () => {
    const records = [
      { type: 'iteration', run: 1 },
      { type: 'event', event: 'userPaused' },
    ];
    expect(reducer.deriveDashboardStatus({ status: 'running' }, records, null)).toBe('PAUSED');
  });

  it('returns RECOVERING when the latest event is stuckRecovery', () => {
    const records = [
      { type: 'iteration', run: 1 },
      { type: 'event', event: 'stuckRecovery' },
    ];
    expect(reducer.deriveDashboardStatus({ status: 'running' }, records, null)).toBe('RECOVERING');
  });

  it('a later iteration supersedes an earlier pause (back to RUNNING)', () => {
    const records = [
      { type: 'event', event: 'userPaused' },
      { type: 'iteration', run: 2 },
    ];
    expect(reducer.deriveDashboardStatus({ status: 'running' }, records, null)).toBe('RUNNING');
  });

  it('a resumed event supersedes an earlier pause', () => {
    const records = [
      { type: 'event', event: 'userPaused' },
      { type: 'event', event: 'resumed' },
    ];
    expect(reducer.deriveDashboardStatus({ status: 'running' }, records, null)).toBe('RUNNING');
  });

  it('terminalStop still wins over a pause', () => {
    const records = [{ type: 'event', event: 'userPaused' }];
    expect(reducer.deriveDashboardStatus({ status: 'running' }, records, { stopReason: 'converged' })).toBe('COMPLETE');
  });
});

describe('LG-0005: carry scopeProof + affectedSurfaceHints', () => {
  it('carries the documented findingDetails fields through deltaRecordToFinding', () => {
    const finding = reducer.deltaRecordToFinding({
      type: 'finding',
      id: 'F001',
      severity: 'P1',
      file: 'src/a.ts:42',
      claim: 'x',
      scopeProof: 'rg evidence covering producers and consumers',
      affectedSurfaceHints: ['producer/helper', 'consumer/status'],
      content_hash: 'abc123',
    });
    expect(finding).not.toBeNull();
    expect(finding?.scopeProof).toBe('rg evidence covering producers and consumers');
    expect(finding?.affectedSurfaceHints).toEqual(['producer/helper', 'consumer/status']);
    expect(finding?.contentHash).toBe('abc123');
  });

  it('defaults the fields when absent (backward compatible)', () => {
    const finding = reducer.deltaRecordToFinding({ type: 'finding', id: 'F002', severity: 'P2', file: 'src/b.ts:1', claim: 'y' });
    expect(finding?.scopeProof).toBeNull();
    expect(finding?.affectedSurfaceHints).toEqual([]);
    expect(finding?.contentHash).toBeNull();
  });
});

describe('LG-0008: content_hash two-tier dedup', () => {
  it('collapses cross-dimension restatements sharing a content_hash', () => {
    const collapsed = reducer.collapseFindingsByDedupKey([
      { findingId: 'F001', dimension: 'security', contentHash: 'H1', firstSeen: 1, lastSeen: 1, transitions: [] },
      { findingId: 'F009', dimension: 'correctness', contentHash: 'H1', firstSeen: 2, lastSeen: 2, transitions: [] },
    ]);
    expect(collapsed).toHaveLength(1);
    expect(collapsed[0].findingId).toBe('F001');
    expect(collapsed[0].dimensions.sort()).toEqual(['correctness', 'security']);
    expect(collapsed[0].mergedFindingIds).toEqual(['F009']);
    expect(collapsed[0].firstSeen).toBe(1);
    expect(collapsed[0].lastSeen).toBe(2);
  });

  it('falls back to file:line+title when content_hash is absent', () => {
    const collapsed = reducer.collapseFindingsByDedupKey([
      { findingId: 'F001', dimension: 'security', file: 'src/a.ts', line: 42, title: 'SQL injection', contentHash: null, firstSeen: 1, lastSeen: 1, transitions: [] },
      { findingId: 'F009', dimension: 'correctness', file: 'src/a.ts', line: 42, title: 'SQL injection', contentHash: null, firstSeen: 1, lastSeen: 1, transitions: [] },
    ]);
    expect(collapsed).toHaveLength(1);
    expect(collapsed[0].dimensions.sort()).toEqual(['correctness', 'security']);
  });

  it('keeps genuinely distinct findings separate', () => {
    const collapsed = reducer.collapseFindingsByDedupKey([
      { findingId: 'F001', dimension: 'security', contentHash: 'H1', firstSeen: 1, lastSeen: 1, transitions: [] },
      { findingId: 'F002', dimension: 'security', contentHash: 'H2', firstSeen: 1, lastSeen: 1, transitions: [] },
    ]);
    expect(collapsed).toHaveLength(2);
  });
});

describe('LG-0006: traceabilityChecks rollup', () => {
  it('returns the latest summary + results', () => {
    const rollup = reducer.buildTraceabilityRollup([
      { type: 'iteration', run: 1, traceabilityChecks: { summary: { required: 1, executed: 1, pass: 1, partial: 0, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 }, results: [{ protocolId: 'spec_code', status: 'pass', applicable: true, gateClass: 'hard' }] } },
      { type: 'iteration', run: 2, traceabilityChecks: { summary: { required: 2, executed: 2, pass: 1, partial: 0, fail: 1, blocked: 0, notApplicable: 0, gatingFailures: 1 }, results: [{ protocolId: 'spec_code', status: 'fail', applicable: true, gateClass: 'hard' }] } },
    ]);
    expect(rollup.summary.gatingFailures).toBe(1);
    expect(rollup.results[0].status).toBe('fail');
  });

  it('returns a zeroed rollup when no traceabilityChecks present', () => {
    const rollup = reducer.buildTraceabilityRollup([{ type: 'iteration', run: 1 }]);
    expect(rollup.summary.required).toBe(0);
    expect(rollup.results).toEqual([]);
  });
});

describe('LG-0033: additive required-field validation', () => {
  it('flags a record missing a type field', () => {
    const warnings = reducer.validateReviewRecordFields([{ run: 1 }]);
    expect(warnings.some((w) => w.rule === 'type-required')).toBe(true);
  });

  it('flags an out-of-range newFindingsRatio and missing severity keys', () => {
    const warnings = reducer.validateReviewRecordFields([
      { type: 'iteration', mode: 'review', newFindingsRatio: 1.5, findingsSummary: { P0: 0, P1: 0 } },
    ]);
    expect(warnings.some((w) => w.rule === 'newFindingsRatio-range')).toBe(true);
    expect(warnings.some((w) => w.rule === 'findingsSummary-severity-keys')).toBe(true);
  });

  it('passes a fully valid iteration record with no warnings', () => {
    const warnings = reducer.validateReviewRecordFields([
      { type: 'iteration', mode: 'review', newFindingsRatio: 0.2, findingsSummary: { P0: 0, P1: 1, P2: 2 }, findingsNew: { P0: 0, P1: 1, P2: 0 }, findingDetails: [] },
    ]);
    expect(warnings).toEqual([]);
  });
});

describe('end-to-end: registry carries the new fields', () => {
  function writeConfig(specFolder: string): void {
    const config = {
      topic: 'reducer-backlog test', mode: 'review', reviewTarget: 'fixture', reviewTargetType: 'spec-folder',
      reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
      sessionId: 'rvw-backlog', generation: 1, lineageMode: 'new', maxIterations: 7,
      convergenceThreshold: 0.1, status: 'running', createdAt: '2026-05-23T00:00:00Z',
    };
    fs.writeFileSync(path.join(specFolder, 'review', 'deep-review-config.json'), `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  }

  it('reduceReviewState exposes traceability + fieldWarnings and collapses dupes', () => {
    const specFolder = makeTempSpecFolder('e2e');
    writeConfig(specFolder);
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deep-review-state.jsonl'),
      [
        '{"type":"config","mode":"review","sessionId":"rvw-backlog"}',
        '{"type":"iteration","mode":"review","run":1,"status":"complete","focus":"security","dimensions":["security"],"findingsCount":1,"findingsSummary":{"P0":0,"P1":1,"P2":0},"findingsNew":{"P0":0,"P1":1,"P2":0},"newFindingsRatio":1.0,"sessionId":"rvw-backlog","generation":1,"lineageMode":"new","timestamp":"2026-05-23T00:05:00Z","durationMs":1000,"traceabilityChecks":{"summary":{"required":1,"executed":1,"pass":1,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[{"protocolId":"spec_code","status":"pass"}]}}',
        '',
      ].join('\n'),
      'utf8',
    );
    // Two delta findings sharing a content_hash across dimensions -> collapse to one.
    fs.writeFileSync(
      path.join(specFolder, 'review', 'deltas', 'iter-001.jsonl'),
      [
        '{"type":"finding","id":"F001","iteration":1,"severity":"P1","file":"src/a.ts:42","title":"injection","claim":"x","content_hash":"HASH1","scopeProof":"rg proof","affectedSurfaceHints":["producer/x"]}',
        '{"type":"finding","id":"F009","iteration":1,"severity":"P1","file":"src/a.ts:42","title":"injection restated","claim":"x","content_hash":"HASH1"}',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = reducer.reduceReviewState(specFolder, { write: false });
    expect(result.registry.openFindings).toHaveLength(1);
    expect(result.registry.openFindings[0].dimensions.length).toBeGreaterThanOrEqual(1);
    expect(result.registry.openFindings[0].mergedFindingIds).toContain('F009');
    expect(result.registry.openFindings[0].scopeProof).toBe('rg proof');
    expect(result.registry.traceability.summary.executed).toBe(1);
    expect(Array.isArray(result.registry.fieldWarnings)).toBe(true);
    expect(result.registry.fieldWarnings).toEqual([]);
  });
});
