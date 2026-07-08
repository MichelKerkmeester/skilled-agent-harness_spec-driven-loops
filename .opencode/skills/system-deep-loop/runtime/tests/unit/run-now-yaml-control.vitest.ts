import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { createHermeticEnv, runtimeRoot, type HermeticEnv } from '../helpers/spawn-cjs';

const RESEARCH_YAML_PATH = resolve(runtimeRoot, '..', '..', '..', 'commands', 'deep', 'assets', 'deep_research_auto.yaml');
const REVIEW_YAML_PATH = resolve(runtimeRoot, '..', '..', '..', 'commands', 'deep', 'assets', 'deep_review_auto.yaml');
const YAML_PATH = RESEARCH_YAML_PATH;

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

function extractStepCommand(stepName: string, yamlPath = YAML_PATH): string {
  const text = readFileSync(yamlPath, 'utf8');
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

function renderTemplate(command: string, replacements: Record<string, string>): string {
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

function runRenderedCommand(command: string, env: HermeticEnv): void {
  const result = spawnSync('/bin/sh', ['-c', command], {
    cwd: runtimeRoot,
    env: env.env,
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

describe('deep workflow synthesis-completion invariant YAML control', () => {
  type Mode = 'research' | 'review';

  function createSynthesisFixture(mode: Mode, testId: string, findingsCount: number): Fixture & {
    artifactDir: string;
    registryPath: string;
    outputPath: string;
    dashboardPath: string;
  } {
    const fixture = createFixture(`${mode}-${testId}`) as Fixture & {
      artifactDir: string;
      registryPath: string;
      outputPath: string;
      dashboardPath: string;
    };
    fixture.artifactDir = join(fixture.env.tmpDir, mode);
    mkdirSync(fixture.artifactDir, { recursive: true });
    fixture.stateLogPath = join(fixture.artifactDir, mode === 'research' ? 'deep-research-state.jsonl' : 'deep-review-state.jsonl');
    fixture.registryPath = join(fixture.artifactDir, mode === 'research' ? 'deep-research-findings-registry.json' : 'deep-review-findings-registry.json');
    fixture.outputPath = join(fixture.artifactDir, mode === 'research' ? 'research.md' : 'review-report.md');
    fixture.dashboardPath = join(fixture.artifactDir, mode === 'research' ? 'deep-research-dashboard.md' : 'deep-review-dashboard.md');
    const iterationRecord = mode === 'research'
      ? { type: 'iteration', run: 1, findingsCount, findings: findingsCount > 0 ? ['finding from state'] : [] }
      : { type: 'iteration', run: 1, findingsCount, findingDetails: findingsCount > 0 ? [{ id: 'R1', title: 'finding from state' }] : [] };
    writeFileSync(fixture.stateLogPath, `${JSON.stringify(iterationRecord)}\n`, 'utf8');
    return fixture;
  }

  function renderSynthesisCommand(mode: Mode, fixture: ReturnType<typeof createSynthesisFixture>): string {
    const command = extractStepCommand('step_convergence_report', mode === 'research' ? RESEARCH_YAML_PATH : REVIEW_YAML_PATH);
    return renderTemplate(command, {
      '{state_paths.state_log}': fixture.stateLogPath,
      '{state_paths.registry}': fixture.registryPath,
      '{state_paths.findings_registry}': fixture.registryPath,
      '{state_paths.research_output}': fixture.outputPath,
      '{state_paths.review_output}': fixture.outputPath,
      '{state_paths.dashboard}': fixture.dashboardPath,
      '{iteration_count}': '1',
      '{answered_count}': '0',
      '{total_questions}': '0',
      '{active_p0}': '0',
      '{active_p1}': '0',
      '{active_p2}': '0',
      '{dimension_coverage}': '1',
      '{verdict}': 'PASS',
      '{release_readiness_state}': 'ready',
      '{reason}': 'converged',
      '{ISO_8601_NOW}': fixture.timestamp,
    });
  }

  it('logs synthesis_incomplete instead of synthesis_complete when required artifacts are missing', () => {
    for (const mode of ['research', 'review'] as const) {
      const fixture = createSynthesisFixture(mode, 'synthesis-missing', 1);
      try {
        runRenderedCommand(renderSynthesisCommand(mode, fixture), fixture.env);

        const records = readRecords(fixture.stateLogPath);
        expect(records.at(-1)).toMatchObject({
          type: 'event',
          event: 'synthesis_incomplete',
          mode,
          severity: 'warning',
          reason: 'synthesis_artifact_invariant_failed',
          iterationFindingCount: 1,
        });
        expect((records.at(-1)?.missingArtifacts as unknown[])).toHaveLength(3);
      } finally {
        fixture.env.cleanup();
      }
    }
  });

  it('logs synthesis_complete for legitimate zero-finding runs when empty artifacts exist', () => {
    for (const mode of ['research', 'review'] as const) {
      const fixture = createSynthesisFixture(mode, 'synthesis-zero', 0);
      try {
        writeFileSync(fixture.registryPath, JSON.stringify(mode === 'research' ? { keyFindings: [] } : { openFindings: [], resolvedFindings: [] }), 'utf8');
        writeFileSync(fixture.outputPath, '', 'utf8');
        writeFileSync(fixture.dashboardPath, '', 'utf8');

        runRenderedCommand(renderSynthesisCommand(mode, fixture), fixture.env);

        const records = readRecords(fixture.stateLogPath);
        expect(records.at(-1)).toMatchObject({ type: 'event', event: 'synthesis_complete', stopReason: 'converged' });
      } finally {
        fixture.env.cleanup();
      }
    }
  });

  it('logs synthesis_incomplete when structured state findings are only partially present in the registry', () => {
    for (const mode of ['research', 'review'] as const) {
      const fixture = createSynthesisFixture(mode, 'synthesis-partial', 2);
      try {
        const stateRecord = mode === 'research'
          ? { type: 'iteration', run: 1, findingsCount: 2, findings: ['finding one', 'finding two'] }
          : { type: 'iteration', run: 1, findingsCount: 2, findingDetails: [{ id: 'R1', title: 'finding one' }, { id: 'R2', title: 'finding two' }] };
        const partialRegistry = mode === 'research'
          ? { keyFindings: [{ id: 'F1', title: 'finding one' }] }
          : { openFindings: [{ findingId: 'R1', title: 'finding one', status: 'active' }], resolvedFindings: [] };
        writeFileSync(fixture.stateLogPath, `${JSON.stringify(stateRecord)}\n`, 'utf8');
        writeFileSync(fixture.registryPath, JSON.stringify(partialRegistry), 'utf8');
        writeFileSync(fixture.outputPath, 'ok\n', 'utf8');
        writeFileSync(fixture.dashboardPath, 'ok\n', 'utf8');

        runRenderedCommand(renderSynthesisCommand(mode, fixture), fixture.env);

        const records = readRecords(fixture.stateLogPath);
        expect(records.at(-1)).toMatchObject({
          event: 'synthesis_incomplete',
          mode,
          invariantFailures: expect.arrayContaining(['structured_state_findings_partially_reflected_in_registry']),
          registryFindingCount: 1,
          identifiableFindingCount: 2,
        });
      } finally {
        fixture.env.cleanup();
      }
    }
  });

  it('logs synthesis_incomplete when registry count matches but a structured state finding is missing', () => {
    for (const mode of ['research', 'review'] as const) {
      const fixture = createSynthesisFixture(mode, 'synthesis-same-count-missing', 2);
      try {
        const stateRecord = mode === 'research'
          ? { type: 'iteration', run: 1, findingsCount: 2, findings: ['finding one', 'finding two'] }
          : { type: 'iteration', run: 1, findingsCount: 2, findingDetails: [{ id: 'R1', title: 'finding one' }, { id: 'R2', title: 'finding two' }] };
        const sameCountRegistry = mode === 'research'
          ? { keyFindings: [{ id: 'F1', title: 'finding one' }, { id: 'F3', title: 'unrelated finding' }] }
          : { openFindings: [{ findingId: 'R1', title: 'finding one', status: 'active' }, { findingId: 'R3', title: 'unrelated finding', status: 'active' }], resolvedFindings: [] };
        writeFileSync(fixture.stateLogPath, `${JSON.stringify(stateRecord)}\n`, 'utf8');
        writeFileSync(fixture.registryPath, JSON.stringify(sameCountRegistry), 'utf8');
        writeFileSync(fixture.outputPath, 'ok\n', 'utf8');
        writeFileSync(fixture.dashboardPath, 'ok\n', 'utf8');

        runRenderedCommand(renderSynthesisCommand(mode, fixture), fixture.env);

        const records = readRecords(fixture.stateLogPath);
        expect(records.at(-1)).toMatchObject({
          event: 'synthesis_incomplete',
          mode,
          invariantFailures: expect.arrayContaining(['structured_state_findings_missing_from_registry']),
          registryFindingCount: 2,
          identifiableFindingCount: 2,
          missingStructuredFindingCount: 1,
        });
      } finally {
        fixture.env.cleanup();
      }
    }
  });
});
