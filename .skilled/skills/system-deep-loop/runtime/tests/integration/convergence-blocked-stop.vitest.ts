// ───────────────────────────────────────────────────────────────────
// MODULE: Convergence Blocked-Stop Record
// ───────────────────────────────────────────────────────────────────

// A research leaf can read a blocked stop decision and move on without running
// the separate step that records it, which leaves the block in no state row. The
// command that computes the decision therefore records the block itself, through
// the append gateway, once per run, and names the iterations whose findings never
// reached the graph.

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  runtimeRoot,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

const requireCjs = createRequire(import.meta.url);
const fs = requireCjs('node:fs') as typeof import('node:fs');
const { iterationsWithoutGraphFindings } = requireCjs('../../scripts/convergence.cjs') as {
  iterationsWithoutGraphFindings: (records: unknown[], nodes: unknown[]) => number[];
};

const gatewayScript = resolve(runtimeRoot, 'scripts', 'append-mode-event.cjs');
const RUN_ID = 'run-blocked-stop-001';
const LINEAGE_ID = 'lineage-blocked-stop-001';
const DIGEST = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const QUESTION = 'Which file owns the stop?';

const tempDirs: string[] = [];
const namespaces: ScriptNamespace[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  for (const namespace of namespaces.splice(0)) cleanupNamespace(namespace);
});

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

// The stop decision refuses a state log outside the repository, so the run sits
// under the suite's temp directory. Naming the run directory `research` puts the
// gateway's state projection at its root, where the workflow keeps it.
function makeRunDirs(): { runDir: string; authorityRoot: string } {
  const base = fileURLToPath(new URL('../.tmp/', import.meta.url));
  fs.mkdirSync(base, { recursive: true });
  const root = fs.mkdtempSync(join(base, 'dlr-blocked-stop-'));
  tempDirs.push(root);
  const runDir = join(root, 'research');
  const authorityRoot = join(root, 'authority');
  fs.mkdirSync(runDir, { mode: 0o700 });
  fs.mkdirSync(authorityRoot, { mode: 0o700 });
  return { runDir, authorityRoot };
}

function gateway(runDir: string, authorityRoot: string, event: Record<string, unknown>, label: string) {
  const eventPath = join(runDir, `.event-${label}.json`);
  fs.writeFileSync(eventPath, JSON.stringify(event), 'utf8');
  const result = spawnSync(
    process.execPath,
    [gatewayScript, '--mode', 'deep-research', '--run-directory', runDir, '--event-json', eventPath],
    { cwd: runtimeRoot, env: { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: authorityRoot }, encoding: 'utf8' },
  );
  fs.rmSync(eventPath, { force: true });
  expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
}

function iterationRecord(iteration: number): Record<string, unknown> {
  return {
    type: 'iteration',
    iteration,
    run: iteration,
    runId: RUN_ID,
    sessionId: RUN_ID,
    lineageId: LINEAGE_ID,
    mode: 'research',
    target_agent: 'deep-research',
    agent_definition_loaded: true,
    resolved_route: 'Resolved route: mode=research target_agent=deep-research',
    status: 'complete',
    focus: QUESTION,
    findingsCount: 1,
    newInfoRatio: 0.4 - iteration * 0.1,
    noveltyJustification: 'Another pass over the stop path.',
    keyQuestions: [QUESTION],
    answeredQuestions: [QUESTION],
    ruledOut: [],
    focusTrack: 'stop decision',
    edgeCase: 'none',
    toolsUsed: ['Read'],
    sourcesQueried: ['scripts/convergence.cjs:1'],
  };
}

// Three completed iterations, each with a finding row, in a run the gateway owns.
function seedRun(): { runDir: string; authorityRoot: string; configPath: string; registryPath: string; stateLog: string } {
  const { runDir, authorityRoot } = makeRunDirs();
  gateway(runDir, authorityRoot, {
    stem: 'deep_research.run_initialized',
    scope: { runId: RUN_ID, lineageId: LINEAGE_ID },
    data: {
      generation: 1,
      charterDigest: DIGEST,
      configDigest: DIGEST,
      executorFingerprint: DIGEST,
      replayFingerprint: DIGEST,
      maxIterations: 10,
      convergencePolicyVersion: '1.0.0',
    },
  }, 'open');
  for (const iteration of [1, 2, 3]) gateway(runDir, authorityRoot, iterationRecord(iteration), String(iteration));

  const configPath = join(runDir, 'deep-research-config.json');
  const registryPath = join(runDir, 'findings-registry.json');
  fs.writeFileSync(configPath, JSON.stringify({
    maxIterations: 10,
    minIterations: 3,
    convergenceThreshold: 0.05,
    stopPolicy: 'convergence',
    stuckThreshold: 3,
    lineage: { sessionId: RUN_ID, generation: 1 },
  }), 'utf8');
  fs.writeFileSync(registryPath, JSON.stringify({ metrics: { resolvedQuestions: 1, openQuestions: 0 } }), 'utf8');
  return { runDir, authorityRoot, configPath, registryPath, stateLog: join(runDir, 'deep-research-state.jsonl') };
}

// Iteration 1's findings answer the question from two sources, so the quality
// guards pass, and a second question nothing answers, beside thin source
// diversity, blocks the graph stop.
// Iterations 2 and 3 left nothing in the graph.
function seedBlockedGraph(namespace: ScriptNamespace) {
  const result = runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'question-1', kind: 'QUESTION', name: QUESTION, iteration: 1 },
      { id: 'question-2', kind: 'QUESTION', name: 'Who reads the stop?', iteration: 1 },
      { id: 'finding-1', kind: 'FINDING', name: 'First answer', iteration: 1 },
      { id: 'finding-2', kind: 'FINDING', name: 'Second answer', iteration: 1 },
      { id: 'source-1', kind: 'SOURCE', name: 'Primary source', path: 'scripts/convergence.cjs', iteration: 1 },
      { id: 'source-2', kind: 'SOURCE', name: 'Secondary source', path: 'scripts/upsert.cjs', iteration: 1 },
    ]),
    '--edges',
    JSON.stringify([
      { id: 'answer-1', sourceId: 'finding-1', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'answer-2', sourceId: 'finding-2', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'cite-1', sourceId: 'finding-1', targetId: 'source-1', relation: 'CITES' },
      { id: 'cite-2', sourceId: 'finding-2', targetId: 'source-2', relation: 'CITES' },
    ]),
  ]);
  expect(result.exitCode, result.stderr).toBe(0);
}

function decide(namespace: ScriptNamespace, run: ReturnType<typeof seedRun>, extra: string[] = []) {
  return runScript('convergence', [
    ...namespaceArgs(namespace),
    '--stop-decision',
    '--iteration', '3',
    '--config-path', run.configPath,
    '--state-log', run.stateLog,
    '--registry-path', run.registryPath,
    ...extra,
  ], { env: { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: run.authorityRoot } });
}

function blockedStopRows(stateLog: string): Array<Record<string, unknown>> {
  return fs.readFileSync(stateLog, 'utf8').split('\n').filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>)
    .filter((row) => row.type === 'event' && row.event === 'blocked_stop');
}

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('iterations without graph findings', () => {
  const records = [1, 2, 3].map((iteration) => ({ type: 'iteration', iteration, status: 'complete', findingsCount: 2 }));

  it('names each iteration with findings that no FINDING node carries', () => {
    const nodes = [{ id: 'f1', kind: 'FINDING', iteration: 1 }, { id: 's1', kind: 'SOURCE', iteration: 3 }];
    expect(iterationsWithoutGraphFindings(records, nodes)).toEqual([2, 3]);
  });

  it('names nothing when a FINDING node carries no iteration to compare', () => {
    const nodes = [{ id: 'f1', kind: 'FINDING', iteration: 1 }, { id: 'leaf', kind: 'FINDING' }];
    expect(iterationsWithoutGraphFindings(records, nodes)).toEqual([]);
  });
});

describe('convergence.cjs --record-blocked-stop', () => {
  it('records one blocked_stop row for a blocked research stop and names the missing iterations', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const run = seedRun();
    seedBlockedGraph(namespace);

    const result = decide(namespace, run, ['--record-blocked-stop']);
    expect(result.exitCode, result.stderr).toBe(0);
    expect((result.json.stop_decision as { decision: string }).decision).toBe('BLOCKED');
    expect(result.json.blocked_stop_record).toMatchObject({ status: 'recorded', run: 3 });

    const rows = blockedStopRows(run.stateLog);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ run: 3, blockedBy: ['source_diversity_guard', 'uncovered_questions'] });
    expect(String(rows[0].recoveryStrategy)).toContain('Iteration(s) 2, 3 recorded findings but left no FINDING node');
  });

  it('writes no second row when the same run is decided again', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const run = seedRun();
    seedBlockedGraph(namespace);

    expect(decide(namespace, run, ['--record-blocked-stop']).exitCode).toBe(0);
    const again = decide(namespace, run, ['--record-blocked-stop']);
    expect(again.exitCode, again.stderr).toBe(0);
    expect(again.json.blocked_stop_record).toMatchObject({ status: 'already_recorded', run: 3 });
    expect(blockedStopRows(run.stateLog)).toHaveLength(1);
  });

  it('records a new row when the same run is blocked by a different blocker set', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const run = seedRun();
    seedBlockedGraph(namespace);
    expect(decide(namespace, run, ['--record-blocked-stop']).exitCode).toBe(0);

    // A finding now answers the second question, so it is no longer uncovered.
    const answered = runScript('upsert', [
      ...namespaceArgs(namespace),
      '--nodes',
      JSON.stringify([{ id: 'finding-3', kind: 'FINDING', name: 'Third answer', iteration: 1 }]),
      '--edges',
      JSON.stringify([
        { id: 'answer-3', sourceId: 'finding-3', targetId: 'question-2', relation: 'ANSWERS' },
        { id: 'cite-3', sourceId: 'finding-3', targetId: 'source-1', relation: 'CITES' },
        { id: 'cite-4', sourceId: 'finding-3', targetId: 'source-2', relation: 'CITES' },
      ]),
    ]);
    expect(answered.exitCode, answered.stderr).toBe(0);

    const again = decide(namespace, run, ['--record-blocked-stop']);
    expect(again.exitCode, again.stderr).toBe(0);
    expect(again.json.blocked_stop_record).toMatchObject({ status: 'recorded', run: 3 });
    const rows = blockedStopRows(run.stateLog);
    expect(rows.map((row) => row.blockedBy)).toEqual([
      ['source_diversity_guard', 'uncovered_questions'],
      ['source_diversity_guard'],
    ]);
  });

  it('fails the command and writes no row when the gateway refuses the record', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const run = seedRun();
    seedBlockedGraph(namespace);
    // The gateway refuses a ledger whose frames other users can read.
    const framesDir = join(run.runDir, 'deep-research-ledger', 'frames');
    const frame = fs.readdirSync(framesDir).sort()[0];
    fs.chmodSync(join(framesDir, frame), 0o644);

    const result = decide(namespace, run, ['--record-blocked-stop']);
    expect(result.exitCode).not.toBe(0);
    expect((result.json.stop_decision as { decision: string }).decision).toBe('BLOCKED');
    expect(result.json.blocked_stop_record).toMatchObject({ status: 'failed', run: 3 });
    expect(String((result.json.blocked_stop_record as { reason: string }).reason)).not.toBe('');
    expect(blockedStopRows(run.stateLog)).toHaveLength(0);
  });

  it('records nothing without the flag', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const run = seedRun();
    seedBlockedGraph(namespace);

    const result = decide(namespace, run);
    expect((result.json.stop_decision as { decision: string }).decision).toBe('BLOCKED');
    expect('blocked_stop_record' in result.json).toBe(false);
    expect(blockedStopRows(run.stateLog)).toHaveLength(0);
  });

  it('refuses the flag on a read-only request', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    namespaces.push(namespace);
    const run = seedRun();

    const result = decide(namespace, run, ['--record-blocked-stop', '--read-only']);
    expect(result.exitCode).not.toBe(0);
    expect(String(result.json.error)).toContain('--read-only');
  });
});
