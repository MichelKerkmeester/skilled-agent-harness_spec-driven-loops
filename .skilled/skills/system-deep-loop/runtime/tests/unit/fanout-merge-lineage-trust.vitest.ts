// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-out merge weighs the runner's verdict and pass evidence
// ───────────────────────────────────────────────────────────────────
// A lineage the runner rejected, or a pass its own log flags as unexamined, still
// reports what it found, but it cannot vouch for coverage the merged run claims.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const here = fileURLToPath(new URL('.', import.meta.url));
const scriptsDir = resolve(here, '..', '..', 'scripts');
const requireCjs = createRequire(import.meta.url);
const { mergeResearchRegistries, mergeReviewRegistries, readLineageTrust } =requireCjs(join(scriptsDir, 'fanout-merge.cjs'));
const { readLineagePassSummary } = requireCjs(join(scriptsDir, 'fanout-salvage.cjs'));

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

const T0 = Date.parse('2026-11-20T10:00:00.000Z');
const at = (seconds: number) => new Date(T0 + seconds * 1000).toISOString();

function finding(id: string, severity: string, firstSeen: number, title = `finding ${id}`) {
  return { findingId: id, severity, title, status: 'active', dimension: 'correctness', firstSeen };
}

function lineage(label: string, openFindings: unknown[], dimensionCoverage: Record<string, boolean>, trust?: unknown) {
  return {
    label,
    stateRecords: [],
    registry: { openFindings, dimensionCoverage, searchCoverage: { covered: [`${label}-class`] } },
    ...(trust ? { trust } : {}),
  };
}

describe('fan-out merge lineage trust', () => {
  it('merges an accepted lineage with unflagged passes exactly as before', () => {
    const merged = mergeReviewRegistries([
      lineage('opus', [finding('A', 'P2', 1)], { correctness: true }, { runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: {} }),
    ]);
    expect(merged.openFindings).toHaveLength(1);
    expect(merged.openFindings[0]).not.toHaveProperty('_untrusted');
    expect(merged.dimensionCoverage).toEqual({ correctness: true });
    expect(merged.searchCoverage.covered).toEqual(['opus-class']);
    expect(merged).not.toHaveProperty('untrustedLineages');
    expect(merged.mergedVerdict).toBe('PASS');
  });

  it('labels a rejected lineage and flagged passes, keeps their findings counted, and drops their coverage', () => {
    const merged = mergeReviewRegistries([
      lineage('opus', [finding('A', 'P2', 1), finding('SHARED', 'P2', 2, 'shared')], { correctness: true, security: false }, {
        runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: { 2: ['future_stamp'] },
      }),
      lineage('deepseek', [finding('B', 'P1', 1), finding('SHARED', 'P2', 1, 'shared')], { security: true, maintainability: true }, {
        runnerStatus: 'failed', failureClass: 'exit', unexaminedPasses: { 1: ['future_stamp'] },
      }),
      lineage('gpt', [finding('C', 'P2', 1)], { traceability: true }, {
        runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: {},
      }),
    ]);

    const byId = Object.fromEntries(merged.openFindings.map((f: { findingId: string }) => [f.findingId, f]));
    // Kept and counted: the rejected lineage's P1 still moves the verdict.
    expect(byId.B._untrusted).toEqual([{ lineage: 'deepseek', reason: 'runner_failed:exit' }]);
    expect(merged.activeP1).toBe(1);
    expect(merged.mergedVerdict).toBe('CONDITIONAL');
    // A finding first seen on an accepted lineage's unflagged pass carries no label.
    expect(byId.A).not.toHaveProperty('_untrusted');
    expect(byId.C).not.toHaveProperty('_untrusted');
    // Both sources of SHARED are untrusted, so the merged record says so for each.
    expect(byId.SHARED._untrusted).toEqual([
      { lineage: 'deepseek', reason: 'runner_failed:exit' },
      { lineage: 'opus', reason: 'unexamined_pass:2:future_stamp' },
    ]);
    // Coverage comes only from lineages the runner accepted with no flagged pass.
    expect(merged.dimensionCoverage).toEqual({ traceability: true });
    expect(merged.searchCoverage.covered).toEqual(['gpt-class']);
    expect(merged.untrustedLineages).toEqual([
      { lineage: 'deepseek', runnerStatus: 'failed', failureClass: 'exit', unexaminedPasses: [1] },
      { lineage: 'opus', runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: [2] },
    ]);
  });

  it('a finding any trusted lineage also reports stays unlabelled', () => {
    const merged = mergeReviewRegistries([
      lineage('deepseek', [finding('X', 'P2', 1, 'same')], {}, { runnerStatus: 'failed', failureClass: 'exit', unexaminedPasses: {} }),
      lineage('opus', [finding('X', 'P2', 1, 'same')], {}, { runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: {} }),
    ]);
    expect(merged.openFindings).toHaveLength(1);
    expect(merged.openFindings[0]).not.toHaveProperty('_untrusted');
  });

  it('reads runner status from the summary and flagged passes from the ledger the way the progress row does', () => {
    const lineageDir = mkdtempSync(join(tmpdir(), 'fanout-merge-trust-'));
    tempDirs.push(lineageDir);
    const framesDir = join(lineageDir, 'deep-review-ledger', 'frames');
    mkdirSync(framesDir, { recursive: true });
    const frame = (sequence: number, event: Record<string, unknown>, committedAt: string) => writeFileSync(
      join(framesDir, `${String(sequence).padStart(16, '0')}.frame`),
      JSON.stringify({ canonical_event_bytes: Buffer.from(JSON.stringify(event)).toString('base64'), receipt: { committed_at: committedAt }, sequence }),
    );
    frame(1, { occurred_at: at(0), payload: { stem: 'deep_review.run_initialized', scope: {}, data: {} } }, at(0));
    frame(2, { occurred_at: at(39), payload: { stem: 'deep_review.iteration_recorded', scope: {}, data: { record: { iteration: 1, findingsCount: 2, timestamp: at(30) } } } }, at(40));
    frame(3, { occurred_at: at(99), payload: { stem: 'deep_review.iteration_recorded', scope: {}, data: { record: { iteration: 2, findingsCount: 1, timestamp: at(400) } } } }, at(100));
    const read = (seconds: number) => JSON.stringify({
      type: 'tool_use',
      timestamp: T0 + seconds * 1000 + 500,
      sessionID: 'ses_fixture',
      part: { type: 'tool', tool: 'read', state: { status: 'completed', input: { filePath: 'a.ts' }, time: { start: T0 + seconds * 1000, end: T0 + seconds * 1000 + 500 } } },
    });
    mkdirSync(join(lineageDir, 'logs'));
    writeFileSync(join(lineageDir, 'logs', 'fanout-lineage.out'), `${read(10)}\n${read(60)}\n`);

    const summary = { lineages: [{ label: 'deepseek', status: 'failed', failure_class: 'exit' }] };
    const trust = readLineageTrust(summary, 'deepseek', lineageDir);
    expect(trust).toEqual({ runnerStatus: 'failed', failureClass: 'exit', unexaminedPasses: { 2: ['future_stamp'] } });
    expect(Object.keys(trust.unexaminedPasses)).toHaveLength(readLineagePassSummary(lineageDir).flaggedPasses ?? -1);

    // No summary entry is not a rejection: a merge over a hand-built tree stays accepted.
    expect(readLineageTrust({}, 'opus', lineageDir).runnerStatus).toBe('succeeded');
  });
});

function researchFinding(id: string, addedAtIteration: number, text = `finding ${id}`) {
  return { id, text, addedAtIteration };
}

function researchLineage(label: string, keyFindings: unknown[], resolved: string[], open: string[], trust?: unknown) {
  return {
    label,
    stateRecords: [],
    registry: {
      keyFindings,
      resolvedQuestions: resolved.map((id) => ({ id, text: `question ${id}`, resolved: true })),
      openQuestions: open.map((id) => ({ id, text: `question ${id}`, resolved: false })),
    },
    ...(trust ? { trust } : {}),
  };
}

describe('fan-out research merge lineage trust', () => {
  it('merges an accepted research lineage with unflagged passes exactly as before', () => {
    const merged = mergeResearchRegistries([
      researchLineage('opus', [researchFinding('F1', 1)], ['Q1'], ['Q2'], { runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: {} }),
    ]);
    expect(merged.keyFindings).toHaveLength(1);
    expect(merged.keyFindings[0]).not.toHaveProperty('_untrusted');
    expect(merged.resolvedQuestions.map((q: { id: string }) => q.id)).toEqual(['Q1']);
    expect(merged.openQuestions.map((q: { id: string }) => q.id)).toEqual(['Q2']);
    expect(merged).not.toHaveProperty('untrustedLineages');
  });

  it('labels a rejected lineage and a flagged pass, keeps their findings, and answers no question for them', () => {
    const merged = mergeResearchRegistries([
      researchLineage('deepseek', [researchFinding('B', 1)], ['Q-ONLY-REJECTED', 'Q-BOTH'], [], {
        runnerStatus: 'failed', failureClass: 'exit', unexaminedPasses: {},
      }),
      researchLineage('opus', [researchFinding('A', 1), researchFinding('FLAGGED', 3)], ['Q-FLAGGED'], [], {
        runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: { 3: ['batched_commit'] },
      }),
      researchLineage('gpt', [researchFinding('C', 1)], ['Q-BOTH'], [], {
        runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: {},
      }),
    ]);

    const byId = Object.fromEntries(merged.keyFindings.map((f: { id: string }) => [f.id, f]));
    expect(merged.keyFindings).toHaveLength(4);
    expect(byId.B._untrusted).toEqual([{ lineage: 'deepseek', reason: 'runner_failed:exit' }]);
    // The flagged pass is matched through the research finding's own iteration field.
    expect(byId.FLAGGED._untrusted).toEqual([{ lineage: 'opus', reason: 'unexamined_pass:3:batched_commit' }]);
    expect(byId.A).not.toHaveProperty('_untrusted');
    expect(byId.C).not.toHaveProperty('_untrusted');
    // Only a trusted lineage answers a question; one answered only by untrusted lineages stays open.
    expect(merged.resolvedQuestions.map((q: { id: string }) => q.id)).toEqual(['Q-BOTH']);
    expect(merged.openQuestions.map((q: { id: string }) => q.id).sort()).toEqual(['Q-FLAGGED', 'Q-ONLY-REJECTED']);
    expect(merged.metrics.resolvedQuestions).toBe(1);
    expect(merged.metrics.openQuestions).toBe(2);
    expect(merged.untrustedLineages).toEqual([
      { lineage: 'deepseek', runnerStatus: 'failed', failureClass: 'exit', unexaminedPasses: [] },
      { lineage: 'opus', runnerStatus: 'succeeded', failureClass: null, unexaminedPasses: [3] },
    ]);
  });
});
