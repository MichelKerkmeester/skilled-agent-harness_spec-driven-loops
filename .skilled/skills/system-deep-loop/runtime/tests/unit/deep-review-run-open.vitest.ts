// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Run Open Tests
// ───────────────────────────────────────────────────────────────────
//
// The workflow's init step is run exactly as the YAML ships it, so a later edit
// that goes back to writing the state log directly fails here. A config row
// written beside the ledger carries keys the projection cannot rebuild, and the
// projection refuses to drop them, which made every later append exit 2.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(here, '..', '..', '..', '..', '..', '..');
const GATEWAY = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');

const scratch: string[] = [];
afterEach(() => {
  while (scratch.length > 0) rmSync(scratch.pop() as string, { recursive: true, force: true });
});

// The literal block under `command: |` in the step, with its indentation removed.
function initStepCommand(variant: 'auto' | 'confirm'): string {
  const yaml = readFileSync(join(REPO_ROOT, `.skilled/commands/deep/assets/deep-review-${variant}.yaml`), 'utf8');
  const lines = yaml.split('\n');
  const stepAt = lines.findIndex((line) => line.trim() === 'step_create_state_log:');
  const commandAt = lines.findIndex((line, i) => i > stepAt && line.trim() === 'command: |');
  const body: string[] = [];
  for (const line of lines.slice(commandAt + 1)) {
    if (line.trim() !== '' && !line.startsWith('          ')) break;
    body.push(line.slice(10));
  }
  return body.join('\n');
}

function reviewDir(): string {
  const root = mkdtempSync(join(tmpdir(), 'deep-review-run-open-'));
  scratch.push(root);
  const dir = join(root, 'review');
  mkdirSync(dir);
  writeFileSync(join(dir, 'deep-review-config.json'), JSON.stringify({
    topic: 'Review: the hook upgrade',
    mode: 'review',
    sessionId: '2026-10-02T11:19:37Z',
    parentSessionId: null,
    lineageMode: 'new',
    generation: 1,
    reviewTarget: 'the hook upgrade',
    reviewTargetType: 'files',
    reviewDimensions: ['correctness', 'security'],
    maxIterations: 3,
    antiConvergence: { convergenceMode: 'default', divergent: {} },
    stopPolicy: 'max-iterations',
  }));
  return dir;
}

function gateway(dir: string, event: Record<string, unknown>): { status: number | null; stdout: string } {
  const eventPath = join(dir, '..', 'event.json');
  writeFileSync(eventPath, JSON.stringify(event));
  const result = spawnSync(process.execPath, [GATEWAY, '--mode', 'review', '--run-directory', dir, '--event-json', eventPath], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout ?? '' };
}

// The record the iteration worker hands the gateway, as the prompt pack describes it.
function iterationRecord(): Record<string, unknown> {
  return {
    type: 'iteration',
    iteration: 1,
    mode: 'review',
    target_agent: 'deep-review',
    agent_definition_loaded: true,
    resolved_route: 'Resolved route: mode=review target_agent=deep-review',
    run: 1,
    status: 'complete',
    focus: 'correctness',
    dimensions: ['correctness'],
    filesReviewed: ['scripts/git-hooks/commit-msg:58'],
    findingsCount: 0,
    findingsSummary: { P0: 0, P1: 0, P2: 0 },
    findingsNew: [],
    findingDetails: [],
    traceabilityChecks: {},
    newFindingsRatio: 0,
    sessionId: '2026-10-02T11:19:37Z',
    generation: 1,
    lineageMode: 'new',
    timestamp: '2026-10-02T11:40:00Z',
    durationMs: 60000,
  };
}

function stateRows(dir: string): Array<Record<string, unknown>> {
  return readFileSync(join(dir, 'deep-review-state.jsonl'), 'utf8')
    .split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

describe('deep-review run open', () => {
  it.each(['auto', 'confirm'] as const)('the %s init step opens the run so later appends project', (variant) => {
    const dir = reviewDir();
    const command = initStepCommand(variant)
      .replaceAll('{state_paths.config}', join(dir, 'deep-review-config.json'))
      .replaceAll('{state_paths.state_log}', join(dir, 'deep-review-state.jsonl'));
    const init = spawnSync('bash', ['-c', command], { cwd: REPO_ROOT, encoding: 'utf8' });
    expect(init.status, init.stdout + init.stderr).toBe(0);
    expect(stateRows(dir)[0]).toMatchObject({ type: 'config', maxIterations: 3, generation: 1 });

    const append = gateway(dir, iterationRecord());
    expect(append.status, append.stdout).toBe(0);
    const rows = stateRows(dir);
    expect(rows.map((row) => row.type)).toEqual(['config', 'iteration']);
    expect(rows[1]).toEqual(iterationRecord());
  });

  it('a config row written beside the ledger still blocks the first projected append', () => {
    const dir = reviewDir();
    writeFileSync(join(dir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'config', mode: 'review', reviewTarget: 'the hook upgrade', sessionId: '2026-10-02T11:19:37Z',
    })}\n`);
    const append = gateway(dir, iterationRecord());
    expect(append.status).toBe(2);
    expect(append.stdout).toContain('Projection replace would drop keys from the existing config row');
  });
});
