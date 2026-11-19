// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// The three subcommands are the whole contract between a workflow and the
// pivot transaction, and each has an exit status the workflow branches on.
// These tests pin the usage failures: a caller mistake must exit 64 and name
// the command it wanted, so a malformed step never looks like a transaction
// that ran and failed.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs.js';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'divergent-pivot.cjs');

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(args: string[], input?: string): CliResult {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
    input,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

describe('divergent-pivot CLI usage failures', () => {
  it('prints the usage line naming every subcommand and exits 64 with no argument', () => {
    const result = runCli([]);

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('prepare');
    expect(result.stderr).toContain('record-seat');
    expect(result.stderr).toContain('finalize');
  });

  it('rejects an empty record-seat envelope and exits 64', () => {
    const result = runCli(['record-seat'], '');

    expect(result.status).toBe(64);
    expect(result.stderr).toContain('record-seat expects one JSON object on stdin');
  });

  it('rejects a finalize resumed value that is neither true nor false and exits 64', () => {
    const result = runCli([
      'finalize',
      '--paths-json',
      '{}',
      '--pivot-id',
      'p',
      '--resumed',
      'maybe',
    ]);

    expect(result.status).toBe(64);
  });
});

const environments: HermeticEnv[] = [];

afterEach(() => {
  while (environments.length > 0) {
    environments.pop()?.cleanup();
  }
});

interface ResearchFixture {
  artifactRoot: string;
  configPath: string;
  registryPath: string;
  strategyPath: string;
  stateLogPath: string;
}

function writeText(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

function writeJson(path: string, value: unknown): void {
  writeText(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeResearchFixture(artifactRoot: string): ResearchFixture {
  const configPath = join(artifactRoot, 'deep-research-config.json');
  writeJson(configPath, {
    topic: 'Divergent pivot CLI retry contract',
    lineage: { sessionId: 'session-cli-retry', generation: 1 },
  });
  const registryPath = join(artifactRoot, 'deep-research-findings-registry.json');
  writeJson(registryPath, {
    keyFindings: ['First in-scope finding'],
  });
  const strategyPath = join(artifactRoot, 'deep-research-strategy.md');
  writeText(strategyPath, [
    '# Deep Research Strategy',
    '',
    '## 11. NEXT FOCUS',
    '',
    'Current saturated focus',
    '',
  ].join('\n'));
  const stateLogPath = join(artifactRoot, 'deep-research-state.jsonl');
  writeText(stateLogPath, '');
  return { artifactRoot, configPath, registryPath, strategyPath, stateLogPath };
}

function prepareArgs(fixture: ResearchFixture): string[] {
  return [
    'prepare',
    '--loop-type',
    'research',
    '--artifact-root',
    fixture.artifactRoot,
    '--config',
    fixture.configPath,
    '--state-log',
    fixture.stateLogPath,
    '--strategy',
    fixture.strategyPath,
    '--registry',
    fixture.registryPath,
    '--current-iteration',
    '3',
    '--max-iterations',
    '10',
    '--trigger-reason',
    'saturated',
  ];
}

function parseStdout(result: CliResult): Record<string, any> {
  return JSON.parse(result.stdout.trim()) as Record<string, any>;
}

describe('divergent-pivot CLI retry contract', () => {
  // Runs attempt 1 to a retryable quorum failure: two seats endorse and one is rejected.
  function failFirstAttempt(label: string) {
    const env = createHermeticEnv(label);
    environments.push(env);
    const fixture = writeResearchFixture(env.tmpDir);

    const prepared = runCli(prepareArgs(fixture));
    expect(prepared.status).toBe(0);
    expect(prepared.stderr).toBe('');
    const first = parseStdout(prepared);
    expect(first.status).toBe('pending');
    expect(first.attempt).toBe(1);
    expect(first.missingSeats).toHaveLength(3);

    const candidates = first.dispatchContext.candidates as Array<{ id: string }>;
    expect(candidates.length).toBeGreaterThan(0);
    const selectedCandidateId = candidates[0].id;

    for (const seat of first.missingSeats as Array<{ id: string; mandate: string }>) {
      const rejected = seat.id === 'seat-003';
      const envelope = {
        paths: first.paths,
        pivotId: first.pivotId,
        seat,
        status: rejected ? 'rejected' : 'fulfilled',
        output: rejected
          ? null
          : {
            seatId: seat.id,
            selectedCandidateId,
            materialEndorsement: true,
            rationale: 'The selected direction is materially supported by the supplied evidence',
            blockers: [],
          },
        error: rejected ? { name: 'Error', message: 'seat unavailable' } : null,
        startedAtIso: '2026-11-17T12:00:00.000Z',
        completedAtIso: '2026-11-17T12:00:01.000Z',
        durationMs: 1000,
      };
      const recorded = runCli(['record-seat'], JSON.stringify(envelope));
      expect(recorded.status).toBe(0);
      expect(recorded.stderr).toBe('');
    }

    const finalized = runCli([
      'finalize',
      '--paths-json',
      JSON.stringify(first.paths),
      '--pivot-id',
      String(first.pivotId),
      '--resumed',
      'false',
    ]);
    expect(finalized.status).toBe(0);
    const failed = parseStdout(finalized);
    expect(failed.status).toBe('failed');
    expect(failed.retryable).toBe(true);
    expect(failed.attempt).toBe(1);
    expect(failed.failureReason).toBe('council_return_quorum_failed');
    return { fixture, first };
  }

  it('finalize prints a retryable quorum failure and a second prepare returns attempt 2 with three missing seats', () => {
    const { fixture } = failFirstAttempt('divergent-pivot-cli-retry');

    const retried = runCli(prepareArgs(fixture));
    expect(retried.status).toBe(0);
    expect(retried.stderr).toBe('');
    const second = parseStdout(retried);
    expect(second.status).toBe('pending');
    expect(second.attempt).toBe(2);
    expect(second.missingSeats).toHaveLength(3);
    expect(Object.keys(second.seatPrompts)).toHaveLength(3);
    expect((second.paths.seatPaths as string[])[0]).toContain('/attempt-2/');
  });

  // The move to attempt 2 rewrites the config once, and only after the attempt-1
  // record on disk matches the one this prepare rebuilds; a drifted record stops it.
  it('refuses the attempt-2 rewrite when the attempt-1 config on disk has drifted', () => {
    const { fixture, first } = failFirstAttempt('divergent-pivot-cli-retry-drift');
    const configPath = String(first.paths.configPath);
    const drifted = { ...JSON.parse(readFileSync(configPath, 'utf8')), previousFocus: 'a focus nobody recorded' };
    writeFileSync(configPath, JSON.stringify(drifted, null, 2));
    const before = readFileSync(configPath, 'utf8');

    const retried = runCli(prepareArgs(fixture));

    expect(retried.status).not.toBe(0);
    expect(retried.stderr).toContain('conflicts with the resumed transaction');
    expect(readFileSync(configPath, 'utf8')).toBe(before);
  });
});
