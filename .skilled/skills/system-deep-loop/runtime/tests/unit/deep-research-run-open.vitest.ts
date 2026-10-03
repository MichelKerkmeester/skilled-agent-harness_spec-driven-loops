// ┌──────────────────────────────────────────────────────────────────────────┐
// │ MODULE: deep-research run-open gateway contract                          │
// │ Each case extracts the shipped step_create_state_log text from both      │
// │ research workflows, renders its placeholders, runs it with bash against   │
// │ a fresh temp run directory, and asserts the ledger's first frame, the     │
// │ gateway receipt, the projected state log and a following gateway append,  │
// │ so a pass is a statement about the shipped workflow text itself.          │
// └──────────────────────────────────────────────────────────────────────────┘

import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const RUNTIME_ROOT = resolve(here, '..', '..');
const REPO_ROOT = resolve(RUNTIME_ROOT, '..', '..', '..', '..');
const GATEWAY_PATH = resolve(RUNTIME_ROOT, 'scripts', 'append-mode-event.cjs');

const WORKFLOWS = [
  { variant: 'auto', yamlPath: resolve(REPO_ROOT, '.skilled/commands/deep/assets/deep-research-auto.yaml') },
  { variant: 'confirm', yamlPath: resolve(REPO_ROOT, '.skilled/commands/deep/assets/deep-research-confirm.yaml') },
] as const;

const SESSION_ID = 'session-run-open-001';
const ISO_NOW = '2026-06-28T00:00:00.000Z';

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), `deep-research-run-open-${prefix}-`));
  tempDirs.push(dir);
  return dir;
}

function stateLogPath(runDir: string): string {
  return join(runDir, 'research', 'deep-research-state.jsonl');
}

function stepBlock(source: string, key: string, indent = 6): string {
  const marker = `${' '.repeat(indent)}${key}:`;
  const start = source.indexOf(`\n${marker}`);
  if (start === -1) throw new Error(`step ${key} not found in workflow`);
  const tail = source.slice(start + 1);
  const next = tail.slice(marker.length).search(new RegExp(`\\n {${indent}}[A-Za-z_]`));
  return next === -1 ? tail : tail.slice(0, marker.length + next + 1);
}

type RenderedStep = {
  readonly record: string;
  readonly command: string;
};

function renderStep(yamlPath: string, runDir: string): RenderedStep {
  const step = stepBlock(readFileSync(yamlPath, 'utf8'), 'step_create_state_log');

  const recordMatch = /^ {8}config_record: '(.*)'$/m.exec(step);
  if (!recordMatch) throw new Error(`${yamlPath}: step_create_state_log has no config_record`);
  const commandMatch = /^ {8}command: \|\n([\s\S]*?)(?=\n {8}[A-Za-z_]+:)/m.exec(step);
  if (!commandMatch) throw new Error(`${yamlPath}: step_create_state_log has no command block`);

  const replacements: Record<string, string> = {
    '{research_topic}': 'Run-open gateway proof',
    '{max_iterations}': '5',
    '{convergence_threshold}': '0.8',
    '{convergence_mode}': 'default',
    '{stop_policy}': 'convergence',
    '{resource_map_present}': 'true',
    '{resource_map_emit}': 'true',
    '{session_id_init}': SESSION_ID,
    '{ISO_8601_NOW}': ISO_NOW,
    '{spec_folder}': join(runDir, 'spec'),
    '{state_paths.state_log}': stateLogPath(runDir),
    '{config.executor.type}': 'native',
  };
  const apply = (template: string): string => Object.entries(replacements).reduce(
    (rendered, [placeholder, value]) => rendered.split(placeholder).join(value),
    template,
  );

  const record = apply(recordMatch[1]);
  const command = apply(commandMatch[1].replace(/^ {10}/gm, '').trim().split('{config_record}').join(record));
  // An unresolved placeholder would ship a broken script or a broken record, so
  // fail here rather than in a subprocess whose error names the symptom.
  expect(command, `${yamlPath}: unresolved placeholder in step_create_state_log command`).not.toMatch(/\{[A-Za-z_][A-Za-z0-9_.]*\}/);
  return { record, command };
}

function gatewayEnv(authorityRoot: string): NodeJS.ProcessEnv {
  return { ...process.env, DEEP_LOOP_AUTHORITY_ROOT: authorityRoot };
}

function runStep(yamlPath: string, runDir: string, authorityRoot: string) {
  return spawnSync('/bin/bash', ['-c', renderStep(yamlPath, runDir).command], {
    cwd: REPO_ROOT,
    env: gatewayEnv(authorityRoot),
    encoding: 'utf8',
  });
}

function appendIteration(runDirectory: string, eventDir: string, authorityRoot: string) {
  const eventPath = join(eventDir, 'iteration-record.json');
  writeFileSync(eventPath, JSON.stringify({
    type: 'iteration',
    run: 1,
    sessionId: SESSION_ID,
    lineageId: SESSION_ID,
    status: 'complete',
    focus: 'q',
    newInfoRatio: 0.5,
    timestamp: ISO_NOW,
  }), 'utf8');
  return spawnSync(process.execPath, [
    GATEWAY_PATH,
    '--mode', 'research',
    '--run-directory', runDirectory,
    '--event-json', eventPath,
  ], {
    env: gatewayEnv(authorityRoot),
    encoding: 'utf8',
  });
}

function lastJsonLine(stdout: string): Record<string, unknown> {
  const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  return JSON.parse(line) as Record<string, unknown>;
}

describe.each(WORKFLOWS)('deep-research $variant run open', ({ yamlPath }) => {
  it('opens the ledger through the gateway and lets the projection write the state log', () => {
    const runDir = makeTempDir('ok');
    const authorityRoot = makeTempDir('ok-authority');

    const result = runStep(yamlPath, runDir, authorityRoot);
    expect(result.status, result.stderr).toBe(0);

    const payload = lastJsonLine(result.stdout ?? '');
    expect(payload.ok, JSON.stringify(payload)).toBe(true);
    const receipt = payload.receipt as Record<string, unknown> | undefined;
    expect(receipt).toBeDefined();
    expect(receipt?.eventType).toBe('deep-research.ledger.run-initialized');
    expect(receipt?.sequence).toBe(1);

    expect(existsSync(join(
      runDir, 'research', 'deep-research-ledger', 'frames', '0000000000000001.frame',
    ))).toBe(true);

    const firstLine = readFileSync(stateLogPath(runDir), 'utf8').split('\n', 1)[0];
    const firstRow = JSON.parse(firstLine ?? '') as Record<string, unknown>;
    expect(firstRow.type).toBe('config');

    // A second record still opens and appends: the gateway keeps folding the
    // ledger, so the state log is a projection rather than a one-shot write.
    const second = appendIteration(join(runDir, 'research'), runDir, authorityRoot);
    expect(second.status, second.stderr).toBe(0);
    expect(lastJsonLine(second.stdout ?? '').ok).toBe(true);
  }, 60_000);
});

describe('deep-research run open control', () => {
  it('refuses an iteration append when the state log was written directly', () => {
    const runDir = makeTempDir('control');
    const authorityRoot = makeTempDir('control-authority');
    const artifactDir = join(runDir, 'research');
    mkdirSync(artifactDir, { recursive: true });
    const { record } = renderStep(WORKFLOWS[0].yamlPath, runDir);
    writeFileSync(stateLogPath(runDir), `${record}\n`, 'utf8');

    const result = appendIteration(artifactDir, runDir, authorityRoot);
    expect(result.status).toBe(2);

    const payload = lastJsonLine(result.stdout ?? '');
    expect(payload.ok).toBe(false);
    expect(payload.phase).toBe('projection');
  }, 60_000);
});
