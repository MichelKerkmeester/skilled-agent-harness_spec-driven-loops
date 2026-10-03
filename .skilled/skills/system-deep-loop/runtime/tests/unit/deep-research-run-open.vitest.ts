// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Run Open Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { DEEP_RESEARCH_STEM_PRODUCERS } from '../../lib/deep-research-ledger-schema/deep-research-ledger-types.js';

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(here, '..', '..', '..', '..', '..', '..');
const GATEWAY = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');
const FANOUT_RUN = resolve(here, '..', '..', 'scripts', 'fanout-run.cjs');

const buildLoopPrompt = createRequire(import.meta.url)(FANOUT_RUN).buildLoopPrompt as (
  loopType: 'research',
  specFolder: string,
  lineageDir: string,
  sessionId: string,
  lineage: { kind: 'native'; label: string },
  researchTopic: string,
  options?: { stopPolicy?: string },
) => string;

const scratch: string[] = [];

afterEach(() => {
  while (scratch.length > 0) rmSync(scratch.pop() as string, { recursive: true, force: true });
});

function researchDir(sessionId: string, relativeDir = 'research'): string {
  const root = mkdtempSync(join(tmpdir(), 'deep-research-run-open-'));
  scratch.push(root);
  const dir = join(root, relativeDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'deep-research-config.json'), JSON.stringify({
    topic: 'Inspect gateway initialization behavior',
    maxIterations: 3,
    convergenceThreshold: 0.05,
    antiConvergence: { minIterations: 1, convergenceMode: 'default', stopPolicy: 'fail-closed' },
    stopPolicy: 'fail-closed',
    specFolder: 'specs/test-research-run-open',
    executionMode: 'auto',
    executor: { kind: 'native', model: null, reasoningEffort: null },
    lineage: {
      sessionId,
      parentSessionId: null,
      lineageMode: 'new',
      generation: 1,
    },
  }));
  return dir;
}

function initStepCommand(variant: 'auto' | 'confirm'): string {
  const yaml = readFileSync(
    join(REPO_ROOT, '.skilled/commands/deep/assets/deep-research-' + variant + '.yaml'),
    'utf8',
  );
  const lines = yaml.split('\n');
  const stepAt = lines.findIndex((line) => line.trim() === 'step_create_state_log:');
  const commandAt = lines.findIndex((line, index) => index > stepAt && line.trim() === 'command: |');
  if (stepAt < 0 || commandAt < 0) throw new Error('The research run-open command is missing.');
  const body: string[] = [];
  for (const line of lines.slice(commandAt + 1)) {
    if (line.trim() !== '' && !line.startsWith('          ')) break;
    body.push(line.slice(10));
  }
  return body.join('\n');
}

function runInit(variant: 'auto' | 'confirm', dir: string): ReturnType<typeof spawnSync> {
  const command = initStepCommand(variant)
    .replaceAll('{state_paths.config}', join(dir, 'deep-research-config.json'))
    .replaceAll('{state_paths.state_log}', join(dir, 'deep-research-state.jsonl'));
  return spawnSync('bash', ['-c', command], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function gateway(
  dir: string,
  event: Record<string, unknown>,
): { status: number | null; stdout: string } {
  const eventPath = join(dir, '..', 'event.json');
  writeFileSync(eventPath, JSON.stringify(event));
  const result = spawnSync(process.execPath, [
    GATEWAY,
    '--mode',
    'research',
    '--run-directory',
    dir,
    '--event-json',
    eventPath,
  ], { cwd: REPO_ROOT, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout ?? '' };
}

function iterationRecord(sessionId: string): Record<string, unknown> {
  return {
    type: 'iteration',
    schemaVersion: 1,
    iteration: 1,
    run: 1,
    status: 'complete',
    focus: 'source verification',
    newInfoRatio: 0.5,
    ruledOut: [],
    sessionId,
    lineageId: sessionId,
  };
}

function stateRows(dir: string): Array<Record<string, unknown>> {
  return readFileSync(join(dir, 'deep-research-state.jsonl'), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function expectRunOpenAndIteration(dir: string, init: ReturnType<typeof spawnSync>, sessionId: string): void {
  expect(init.status, String(init.stdout) + String(init.stderr)).toBe(0);
  expect(String(init.stdout)).not.toContain(
    'Legacy config has one digest for both charter and configuration evidence.',
  );
  expect(stateRows(dir).map((row) => row.type)).toEqual(['config']);

  const append = gateway(dir, iterationRecord(sessionId));
  expect(append.status, append.stdout).toBe(0);
  const rows = stateRows(dir);
  expect(rows.map((row) => row.type)).toEqual(['config', 'iteration']);
  expect(rows[1]).toMatchObject({ run: 1, status: 'complete' });
}

describe('deep-research run open', () => {
  it.each(['auto', 'confirm'] as const)(
    'the %s init step opens the run for later gateway appends',
    (variant) => {
      const sessionId = 'research-' + variant + '-run';
      const dir = researchDir(sessionId);
      expectRunOpenAndIteration(dir, runInit(variant, dir), sessionId);
    },
  );

  it('uses the same init step for a fan-out lineage directory', () => {
    const sessionId = 'fanout-research-seat-run';
    const dir = researchDir(sessionId, 'lineages/seat');
    const prompt = buildLoopPrompt(
      'research',
      'specs/test-fanout-research',
      dir,
      sessionId,
      { kind: 'native', label: 'seat' },
      'Inspect gateway initialization behavior',
    );
    expect(prompt).toContain('config.fanout_lineage_artifact_dir: ' + dir);
    expect(prompt).toContain('Run phase_init, phase_main_loop');
    expectRunOpenAndIteration(dir, runInit('auto', dir), sessionId);
  });

  it('keeps legacy config rows on the gateway upcaster path', () => {
    const sessionId = 'research-legacy-run';
    const dir = researchDir(sessionId);
    const init = gateway(dir, {
      type: 'config',
      schemaVersion: 1,
      topic: 'Legacy research topic',
      maxIterations: 3,
      generation: 1,
      sessionId,
      lineageId: sessionId,
    });
    expect(init.status, init.stdout).toBe(0);
    expect(init.stdout).toContain(
      'Legacy config has one digest for both charter and configuration evidence.',
    );
    const append = gateway(dir, iterationRecord(sessionId));
    expect(append.status, append.stdout).toBe(0);
    expect(stateRows(dir).map((row) => row.type)).toEqual(['config', 'iteration']);
  });

  it('declares initialization as spoken by both research workflow variants', () => {
    expect(DEEP_RESEARCH_STEM_PRODUCERS['deep_research.run_initialized']).toEqual({
      status: 'spoken',
      producers: [
        '.skilled/commands/deep/assets/deep-research-auto.yaml',
        '.skilled/commands/deep/assets/deep-research-confirm.yaml',
      ],
    });
  });
});
