import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { createHermeticEnv, runtimeRoot, type HermeticEnv } from '../helpers/spawn-cjs';

const YAML_PATH = resolve(runtimeRoot, '..', '..', 'commands', 'deep', 'assets', 'deep_research_auto.yaml');

type JsonRecord = Record<string, unknown>;

type Fixture = {
  env: HermeticEnv;
  stateLogPath: string;
  sentinelPath: string;
  pausePath: string;
  sessionId: string;
  generation: string;
  run: string;
  timestamp: string;
};

function extractStepCommand(stepName: string): string {
  const text = readFileSync(YAML_PATH, 'utf8');
  const stepStart = text.indexOf(`      ${stepName}:\n`);
  if (stepStart === -1) {
    throw new Error(`${stepName} was not found in deep_research_auto.yaml`);
  }

  const stepText = text.slice(stepStart);
  const match = stepText.match(/\n        command: \|\n([\s\S]*?)(?=\n        [a-zA-Z_]+:|\n      [a-zA-Z_]+:|\n  #)/);
  if (!match) {
    throw new Error(`${stepName} does not expose an inline command block`);
  }

  return match[1].replace(/^          /gm, '').trim();
}

function createFixture(testId: string): Fixture {
  const env = createHermeticEnv(testId);
  const artifactDir = join(env.tmpDir, 'research');
  mkdirSync(artifactDir, { recursive: true });

  const stateLogPath = join(artifactDir, 'deep-research-state.jsonl');
  writeFileSync(stateLogPath, '', 'utf8');

  return {
    env,
    stateLogPath,
    sentinelPath: join(artifactDir, '.deep-research-run-now'),
    pausePath: join(artifactDir, '.deep-research-pause'),
    sessionId: 'session-run-now',
    generation: '2',
    run: '5',
    timestamp: '2026-06-28T00:00:00.000Z',
  };
}

function renderCommand(command: string, fixture: Fixture): string {
  const replacements: Record<string, string> = {
    '{state_paths.state_log}': fixture.stateLogPath,
    '{state_paths.run_now_sentinel}': fixture.sentinelPath,
    '{state_paths.pause_sentinel}': fixture.pausePath,
    '{ISO_8601_NOW}': fixture.timestamp,
    '{config.lineage.sessionId}': fixture.sessionId,
    '{config.lineage.generation}': fixture.generation,
    '{current_iteration}': fixture.run,
  };

  return Object.entries(replacements).reduce(
    (rendered, [placeholder, value]) => rendered.split(placeholder).join(value),
    command,
  );
}

function runCommand(command: string, fixture: Fixture): void {
  const result = spawnSync('/bin/sh', ['-c', renderCommand(command, fixture)], {
    cwd: runtimeRoot,
    env: fixture.env.env,
    encoding: 'utf8',
  });

  expect(result.status, result.stderr).toBe(0);
}

function readRecords(stateLogPath: string): JsonRecord[] {
  const content = readFileSync(stateLogPath, 'utf8').trim();
  if (!content) return [];
  return content.split(/\r?\n/).map((line) => JSON.parse(line) as JsonRecord);
}

describe('deep-research run-now YAML control', () => {
  const runNowCommand = extractStepCommand('step_run_now_check');
  const restoreCommand = extractStepCommand('step_run_now_restore_check');

  it('consumes a run-now sentinel and emits requested plus accepted events before dispatch', () => {
    const fixture = createFixture('run-now-accepted');
    try {
      writeFileSync(fixture.sentinelPath, 'operator-request\n', 'utf8');

      runCommand(runNowCommand, fixture);

      const records = readRecords(fixture.stateLogPath);
      expect(existsSync(fixture.sentinelPath)).toBe(false);
      expect(records.map((record) => record.event)).toEqual(['run_now_requested', 'run_now_accepted']);
      expect(records[1]).toMatchObject({
        type: 'event',
        event: 'run_now_accepted',
        mode: 'research',
        run: 5,
        sentinelPath: fixture.sentinelPath,
        sessionId: fixture.sessionId,
        generation: 2,
        dispatchEvent: 'iteration_start',
      });
    } finally {
      fixture.env.cleanup();
    }
  });

  it('rejects a run-now sentinel while paused and leaves the sentinel in place', () => {
    const fixture = createFixture('run-now-rejected-paused');
    try {
      writeFileSync(fixture.sentinelPath, 'operator-request\n', 'utf8');
      writeFileSync(fixture.pausePath, 'pause\n', 'utf8');

      runCommand(runNowCommand, fixture);

      const records = readRecords(fixture.stateLogPath);
      expect(existsSync(fixture.sentinelPath)).toBe(true);
      expect(records.map((record) => record.event)).toEqual(['run_now_requested', 'run_now_rejected']);
      expect(records[1]).toMatchObject({
        type: 'event',
        event: 'run_now_rejected',
        reason: 'loop_paused',
        sentinelPath: fixture.sentinelPath,
        pauseSentinelPath: fixture.pausePath,
      });
    } finally {
      fixture.env.cleanup();
    }
  });

  it('records a restored sentinel when it reappears after an accepted dispatch starts', () => {
    const fixture = createFixture('run-now-restored');
    try {
      writeFileSync(
        fixture.stateLogPath,
        `${JSON.stringify({
          type: 'event',
          event: 'run_now_accepted',
          mode: 'research',
          run: 5,
          sessionId: fixture.sessionId,
          generation: 2,
          timestamp: fixture.timestamp,
        })}\n`,
        'utf8',
      );
      writeFileSync(fixture.sentinelPath, 'operator-request\n', 'utf8');

      runCommand(restoreCommand, fixture);

      const records = readRecords(fixture.stateLogPath);
      expect(existsSync(fixture.sentinelPath)).toBe(true);
      expect(records.at(-1)).toMatchObject({
        type: 'event',
        event: 'run_now_restored',
        mode: 'research',
        run: 5,
        sentinelPath: fixture.sentinelPath,
        sessionId: fixture.sessionId,
        generation: 2,
      });
    } finally {
      fixture.env.cleanup();
    }
  });
});
