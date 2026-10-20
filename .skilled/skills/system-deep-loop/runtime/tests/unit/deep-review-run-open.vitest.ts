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
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

function workflowLines(variant: 'auto' | 'confirm'): string[] {
  return readFileSync(join(REPO_ROOT, `.skilled/commands/deep/assets/deep-review-${variant}.yaml`), 'utf8').split('\n');
}

// The lines of one step, from its key to the next key at the same depth.
function stepLines(variant: 'auto' | 'confirm', step: string): string[] {
  const lines = workflowLines(variant);
  const start = lines.findIndex((line) => line.trim() === `${step}:`);
  if (start < 0) throw new Error(`${step} is missing from deep-review-${variant}.yaml`);
  const depth = lines[start].length - lines[start].trimStart().length;
  const end = lines.findIndex((line, i) => i > start && line.trim() !== ''
    && line.length - line.trimStart().length <= depth);
  return lines.slice(start, end < 0 ? undefined : end);
}

// A `key: |` block scalar inside a step, with its indentation removed.
function blockScalar(lines: string[], key: string): string {
  const at = lines.findIndex((line) => line.trim() === `${key}: |`);
  if (at < 0) throw new Error(`${key} block is missing`);
  const keyDepth = lines[at].length - lines[at].trimStart().length;
  const body: string[] = [];
  for (const line of lines.slice(at + 1)) {
    if (line.trim() !== '' && line.length - line.trimStart().length <= keyDepth) break;
    body.push(line.slice(keyDepth + 2));
  }
  return body.join('\n');
}

// The single-quoted row of an append directive inside a step.
function appendRow(lines: string[]): string {
  const line = lines.find((entry) => /^\s*append_jsonl: '/.test(entry));
  if (!line) throw new Error('append_jsonl directive is missing');
  return line.trim().replace(/^append_jsonl: '/, '').replace(/'$/, '').replaceAll("''", "'");
}

function render(template: string, specFolder: string): string {
  const artifactDir = join(specFolder, 'review');
  const paths: Record<string, string> = {
    '{state_paths.config}': join(artifactDir, 'deep-review-config.json'),
    '{state_paths.state_log}': join(artifactDir, 'deep-review-state.jsonl'),
    '{state_paths.strategy}': join(artifactDir, 'deep-review-strategy.md'),
    '{state_paths.dashboard}': join(artifactDir, 'deep-review-dashboard.md'),
    '{state_paths.pause_sentinel}': join(artifactDir, '.deep-review-pause'),
    '{state_paths.iteration_dir}': join(artifactDir, 'iterations'),
    '{state_paths.review_output}': join(artifactDir, 'review-report.md'),
    '{state_paths.legacy_root_report}': join(specFolder, 'review-report.md'),
    '{state_paths.local_packet_dir}': artifactDir,
    '{spec_folder}': specFolder,
    '{session_id}': '2026-10-02T11:19:37Z',
  };
  let rendered = template;
  for (const [placeholder, value] of Object.entries(paths)) rendered = rendered.replaceAll(placeholder, value);
  return rendered;
}

function bash(command: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('bash', ['-c', command], { cwd: REPO_ROOT, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

const REVIEW_CONFIG = {
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
};

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

// A packet from before the review state moved out of scratch/: the state log was
// written by hand, so the ledger never produced its config row.
function scratchEraPacket(): { specFolder: string; legacyLog: string } {
  const root = mkdtempSync(join(tmpdir(), 'deep-review-legacy-move-'));
  scratch.push(root);
  const specFolder = join(root, 'spec');
  mkdirSync(join(specFolder, 'scratch'), { recursive: true });
  writeFileSync(join(specFolder, 'scratch', 'deep-research-config.json'), JSON.stringify(REVIEW_CONFIG));
  writeFileSync(join(specFolder, 'scratch', 'deep-review-strategy.md'), '# Strategy\n');
  const legacyLog = [
    { type: 'config', mode: 'review', topic: 'Review: the hook upgrade', maxIterations: 3, sessionId: '2026-10-02T11:19:37Z', generation: 1 },
    { ...iterationRecord(), run: 1, iteration: 1, timestamp: '2026-10-02T11:30:00Z' },
    { type: 'event', event: 'claim_adjudication', mode: 'review', run: 1, timestamp: '2026-10-02T11:31:00Z' },
    { ...iterationRecord(), run: 2, iteration: 2, focus: 'security', timestamp: '2026-10-02T11:35:00Z' },
  ].map((row) => JSON.stringify(row)).join('\n') + '\n';
  writeFileSync(join(specFolder, 'scratch', 'deep-research-state.jsonl'), legacyLog);
  return { specFolder, legacyLog };
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
  // An append before session classification would create the state log and turn
  // a fresh packet into a partial one, and a moved state log the ledger never
  // produced refuses every append. The move only rehomes files; the run is
  // opened first and the migration row is recorded at the top of the loop.
  it.each(['auto', 'confirm'] as const)('the %s workflow records the migration row after classification and the run open', (variant) => {
    const lines = workflowLines(variant);
    const lineOf = (key: string): number => lines.findIndex((line) => line.trim() === `${key}:`);
    const rehome = stepLines(variant, 'step_migrate_legacy_review_state').join('\n');
    expect(rehome).not.toMatch(/append-mode-event|deep_review\.migration/);

    const record = stepLines(variant, 'step_record_artifact_migration');
    expect(lineOf('step_record_artifact_migration')).toBeGreaterThan(lineOf('step_classify_session'));
    expect(lineOf('step_record_artifact_migration')).toBeGreaterThan(lineOf('step_create_state_log'));
    expect(lineOf('step_record_artifact_migration')).toBeGreaterThan(lineOf('phase_loop'));
    expect(JSON.parse(render(appendRow(record), '/spec'))).toMatchObject({ stem: 'deep_review.migration' });
    expect(record.join('\n')).toMatch(/skip_when: "legacy_migration_detected != true or migration_recorded == true"/);
    if (variant === 'confirm') expect(record.join('\n')).toMatch(/dry_run_boundary: "state-mutation"/);
  });

  it.each(['auto', 'confirm'] as const)('the %s move leaves a fresh packet without a state log and records nothing', (variant) => {
    const root = mkdtempSync(join(tmpdir(), 'deep-review-fresh-'));
    scratch.push(root);
    const specFolder = join(root, 'spec');
    mkdirSync(specFolder);
    const move = bash(render(blockScalar(stepLines(variant, 'step_migrate_legacy_review_state'), 'command'), specFolder));
    expect(move.status, move.stdout + move.stderr).toBe(0);
    expect(move.stdout).not.toContain('LEGACY_REVIEW_STATE_MOVED');
    expect(existsSync(join(specFolder, 'review', 'deep-review-state.jsonl'))).toBe(false);
    expect(existsSync(join(specFolder, 'review', 'deep-review-ledger'))).toBe(false);
  });

  it.each(['auto', 'confirm'] as const)('the %s workflow carries a moved legacy state log through the gateway and keeps the migration row', (variant) => {
    const { specFolder, legacyLog } = scratchEraPacket();
    const dir = join(specFolder, 'review');

    // Before classification: the files move and nothing reaches the gateway.
    const move = bash(render(blockScalar(stepLines(variant, 'step_migrate_legacy_review_state'), 'command'), specFolder));
    expect(move.status, move.stdout + move.stderr).toBe(0);
    expect(move.stdout).toContain('LEGACY_REVIEW_STATE_MOVED');
    expect(readFileSync(join(dir, 'deep-review-state.jsonl'), 'utf8')).toBe(legacyLog);
    expect(existsSync(join(dir, 'deep-review-ledger'))).toBe(false);

    // After classification: the hand-written log is set aside, the run opens
    // from the moved config, and the legacy iteration rows are replayed.
    const adopt = stepLines(variant, 'step_classify_session');
    const setAside = bash(render(blockScalar(adopt, 'set_aside_command'), specFolder));
    expect(setAside.status, setAside.stdout + setAside.stderr).toBe(0);
    const open = bash(render(initStepCommand(variant), specFolder));
    expect(open.status, open.stdout + open.stderr).toBe(0);
    const replay = bash(render(blockScalar(adopt, 'replay_command'), specFolder));
    expect(replay.status, replay.stdout + replay.stderr).toBe(0);
    expect(JSON.parse(replay.stdout.trim().split('\n').at(-1) ?? '{}')).toMatchObject({
      replayedIterations: 2,
      keptOnlyInLegacyLog: 1,
    });
    expect(readFileSync(join(dir, 'deep-review-state.legacy.jsonl'), 'utf8')).toBe(legacyLog);

    // At the top of the loop: the migration row goes through the real gateway.
    const migration = gateway(dir, JSON.parse(render(appendRow(stepLines(variant, 'step_record_artifact_migration')), specFolder)));
    expect(migration.status, migration.stdout).toBe(0);

    // A later append replaces the projection, and every carried row survives it.
    const later = { ...iterationRecord(), run: 3, iteration: 3, timestamp: '2026-10-02T12:00:00Z' };
    expect(gateway(dir, later).status).toBe(0);
    const rows = stateRows(dir);
    const legacyRows = legacyLog.trim().split('\n').map((line) => JSON.parse(line));
    expect(rows.map((row) => row.type)).toEqual(['config', 'iteration', 'iteration', 'event', 'iteration']);
    expect(rows[1]).toEqual(legacyRows[1]);
    expect(rows[2]).toEqual(legacyRows[3]);
    expect(rows[3]).toMatchObject({
      type: 'event',
      event: 'migration',
      stem: 'deep_review.migration',
      legacyArtifacts: ['deep-research-config.json', 'deep-research-state.jsonl', '.deep-research-pause'],
    });
    expect(rows[4]).toEqual(later);
  });

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

  it.each(['auto', 'confirm'] as const)('the %s init step projects the configured topic into the config row', (variant) => {
    const dir = reviewDir();
    const command = initStepCommand(variant)
      .replaceAll('{state_paths.config}', join(dir, 'deep-review-config.json'))
      .replaceAll('{state_paths.state_log}', join(dir, 'deep-review-state.jsonl'));
    const init = spawnSync('bash', ['-c', command], { cwd: REPO_ROOT, encoding: 'utf8' });
    expect(init.status, init.stdout + init.stderr).toBe(0);
    expect(stateRows(dir)[0]).toMatchObject({ type: 'config', topic: 'Review: the hook upgrade' });
  });

  it('a config row written beside the ledger blocks the first append before it reaches the ledger', () => {
    const dir = reviewDir();
    writeFileSync(join(dir, 'deep-review-state.jsonl'), `${JSON.stringify({
      type: 'config', mode: 'review', reviewTarget: 'the hook upgrade', sessionId: '2026-10-02T11:19:37Z',
    })}\n`);
    const append = gateway(dir, iterationRecord());
    expect(append.status).toBe(2);
    expect(JSON.parse(append.stdout.trim().split('\n').at(-1) ?? '{}')).toMatchObject({
      ok: false,
      phase: 'provenance',
      code: 'STATE_LOG_UNATTRIBUTED',
    });
  });
});
