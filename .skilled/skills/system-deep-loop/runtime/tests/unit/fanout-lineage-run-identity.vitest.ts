// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-out Lineage Run Identity And Stop Gate Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');
const nodeRequire = createRequire(import.meta.url);
const { buildLoopPrompt } = nodeRequire(resolve(here, '..', '..', 'scripts', 'fanout-run.cjs')) as {
  buildLoopPrompt: (...args: unknown[]) => string;
};

const ROOT_SESSION = '2026-11-27T09:14:53.505Z';
const temporaryDirectories: string[] = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const dir = temporaryDirectories.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

/** A root artifact directory holding its config, and one lineage directory under it. */
function createLineage(
  modeDirName: 'review' | 'research',
  label: string,
  rootConfig: Record<string, unknown>,
  lineageConfig: Record<string, unknown>,
): string {
  const base = mkdtempSync(join(tmpdir(), 'fanout-lineage-run-identity-'));
  temporaryDirectories.push(base);
  const configName = modeDirName === 'review' ? 'deep-review-config.json' : 'deep-research-config.json';
  const rootDir = join(base, modeDirName);
  const lineageDir = join(rootDir, 'lineages', label);
  mkdirSync(lineageDir, { recursive: true });
  writeFileSync(join(rootDir, configName), JSON.stringify(rootConfig), 'utf8');
  writeFileSync(join(lineageDir, configName), JSON.stringify(lineageConfig), 'utf8');
  return lineageDir;
}

function appendEvent(mode: string, runDir: string, event: Record<string, unknown>) {
  const eventPath = join(dirname(runDir), `${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
  writeFileSync(eventPath, JSON.stringify(event), 'utf8');
  const result = spawnSync(process.execPath, [CLI_PATH, '--mode', mode, '--run-directory', runDir, '--event-json', eventPath], {
    encoding: 'utf8',
  });
  const lastLine = (result.stdout ?? '').trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  return { exitCode: result.status, json: JSON.parse(lastLine) as Record<string, unknown>, stderr: result.stderr ?? '' };
}

function ledgerFrames(runDir: string, ledgerDir: string): string[] {
  const framesDir = join(runDir, ledgerDir, 'frames');
  return existsSync(framesDir) ? readdirSync(framesDir) : [];
}

function reviewIteration(sessionId: string): Record<string, unknown> {
  return {
    type: 'iteration',
    iteration: 1,
    run: 1,
    mode: 'review',
    status: 'complete',
    focus: 'correctness',
    dimensions: ['correctness'],
    filesReviewed: ['research/research.md:34'],
    findingsCount: 0,
    findingsSummary: { P0: 0, P1: 0, P2: 0 },
    findingsNew: [],
    findingDetails: [],
    newFindingsRatio: 0,
    sessionId,
    generation: 1,
    lineageMode: 'new',
  };
}

function researchCloseout(runId: string): Record<string, unknown> {
  return {
    stem: 'deep_research.synthesis_complete',
    scope: { runId, lineageId: runId },
    data: { totalIterations: 10, answeredCount: 2, totalQuestions: 2, stopReason: 'maxIterationsReached' },
  };
}

function lineagePrompt(loopType: 'review' | 'research'): string {
  const specFolder = 'specs/demo/001-packet';
  const lineageDir = `${specFolder}/${loopType}/lineages/vibe-1`;
  return buildLoopPrompt(
    loopType,
    specFolder,
    lineageDir,
    'fanout-vibe-1-run',
    { label: 'vibe-1', kind: 'cli-mistral-vibe', model: 'deepseek-flash', iterations: 10 },
    loopType === 'research' ? 'demo topic' : null,
    { stopPolicy: 'max-iterations' },
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('gateway refuses a fan-out lineage row that names another run', () => {
  it('refuses a review lineage row scoped by the root run session id, before any ledger write', () => {
    // The lineage built its config by copying the root's, session id included.
    const lineageDir = createLineage('review', 'vibe-1', { sessionId: ROOT_SESSION }, { sessionId: ROOT_SESSION });
    const result = appendEvent('review', lineageDir, reviewIteration(ROOT_SESSION));
    expect(result.exitCode).toBe(2);
    expect(result.json).toMatchObject({ ok: false, phase: 'scope', code: 'LINEAGE_SCOPE_MISMATCH' });
    expect(result.stderr).toContain(ROOT_SESSION);
    expect(ledgerFrames(lineageDir, 'deep-review-ledger')).toHaveLength(0);
  });

  it('still appends a review lineage row scoped by the lineage own session id', () => {
    const lineageDir = createLineage(
      'review',
      'vibe-2',
      { sessionId: ROOT_SESSION },
      { sessionId: 'fanout-vibe-2-run' },
    );
    const result = appendEvent('review', lineageDir, reviewIteration('fanout-vibe-2-run'));
    expect(result.exitCode, result.stderr).toBe(0);
    expect(result.json.ok).toBe(true);
  });

  it('refuses a research closeout event staged by another lineage', () => {
    const lineageDir = createLineage(
      'research',
      'pi-2',
      { lineage: { sessionId: ROOT_SESSION } },
      { lineage: { sessionId: 'fanout-pi-2-run', parentSessionId: ROOT_SESSION } },
    );
    const result = appendEvent('research', lineageDir, researchCloseout('fanout-vibe-1-run'));
    expect(result.exitCode).toBe(2);
    expect(result.json).toMatchObject({ ok: false, phase: 'scope', code: 'LINEAGE_SCOPE_MISMATCH' });
    expect(result.stderr).toContain('fanout-vibe-1-run');
    expect(ledgerFrames(lineageDir, 'deep-research-ledger')).toHaveLength(0);
  });

  it('still appends a research closeout event scoped by the lineage own run', () => {
    const lineageDir = createLineage(
      'research',
      'pi-1',
      { lineage: { sessionId: ROOT_SESSION } },
      { lineage: { sessionId: 'fanout-pi-1-run', parentSessionId: ROOT_SESSION } },
    );
    const result = appendEvent('research', lineageDir, researchCloseout('fanout-pi-1-run'));
    expect(result.exitCode, result.stderr).toBe(0);
    expect(result.json.ok).toBe(true);
  });
});

describe('synthesis close-out refuses a review lineage that skipped its stop gate', () => {
  const CLOSEOUT_PATH = resolve(here, '..', '..', 'scripts', 'synthesis-closeout.cjs');

  function closeOutLineage(stateRows: Record<string, unknown>[]) {
    const lineageDir = createLineage('review', 'vibe-1', { sessionId: ROOT_SESSION }, { sessionId: 'fanout-vibe-1-run' });
    const eventDir = join(dirname(lineageDir), 'events');
    mkdirSync(eventDir, { recursive: true });
    const stateLog = join(lineageDir, 'deep-review-state.jsonl');
    writeFileSync(stateLog, `${stateRows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
    writeFileSync(join(lineageDir, 'deep-review-findings-registry.json'), JSON.stringify({
      openFindings: [], resolvedFindings: [], repeatedFindings: [],
    }), 'utf8');
    writeFileSync(join(lineageDir, 'review-report.md'), '# Review\n', 'utf8');
    writeFileSync(join(lineageDir, 'deep-review-dashboard.md'), '# Dashboard\n', 'utf8');
    const result = spawnSync(process.execPath, [
      CLOSEOUT_PATH,
      '--mode', 'review',
      '--event-dir', eventDir,
      '--artifact-dir', lineageDir,
      '--state-log', stateLog,
      '--registry', join(lineageDir, 'deep-review-findings-registry.json'),
      '--output', join(lineageDir, 'review-report.md'),
      '--dashboard', join(lineageDir, 'deep-review-dashboard.md'),
      '--stop-reason', 'maxIterationsReached',
      '--active-p0', '0', '--active-p1', '0', '--active-p2', '0',
      '--dimension-coverage', '1',
      '--verdict', 'PASS',
      '--release-readiness-state', 'in-progress',
    ], { encoding: 'utf8' });
    return { status: result.status, stderr: result.stderr ?? '', staged: readdirSync(eventDir) };
  }

  it('refuses and stages nothing when the lineage state log holds no terminal_gates row', () => {
    const outcome = closeOutLineage([reviewIteration('fanout-vibe-1-run')]);
    expect(outcome.status).toBe(1);
    expect(outcome.stderr).toContain('holds no terminal_gates row');
    expect(outcome.staged).toEqual([]);
  });

  it('closes out once the lineage recorded its terminal gates', () => {
    const outcome = closeOutLineage([
      reviewIteration('fanout-vibe-1-run'),
      {
        type: 'event',
        event: 'terminal_gates',
        stopReason: 'maxIterationsReached',
        failedRequiredGateIds: [],
        sessionId: 'fanout-vibe-1-run',
      },
    ]);
    expect(outcome.status, outcome.stderr).toBe(0);
    expect(outcome.staged.length).toBe(1);
  });
});

describe('a fan-out lineage prompt names its stop gate and its run identity', () => {
  it('tells a review lineage to record the terminal gates before synthesis', () => {
    const prompt = lineagePrompt('review');
    expect(prompt).toContain('node .skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs --config-path');
    expect(prompt).toContain('deep_review.terminal_gates_recorded');
    expect(prompt).toContain('before phase_synthesis');
  });

  it('pins the lineage session id for the config and every state record', () => {
    for (const loopType of ['review', 'research'] as const) {
      const prompt = lineagePrompt(loopType);
      expect(prompt).toContain('step_create_config writes fanout-vibe-1-run as this lineage\'s session id');
      expect(prompt).toContain('Never build this lineage\'s config from the root config');
    }
  });

  it('gives a research lineage no review stop gate', () => {
    expect(lineagePrompt('research')).not.toContain('terminal-gates.cjs');
  });
});
