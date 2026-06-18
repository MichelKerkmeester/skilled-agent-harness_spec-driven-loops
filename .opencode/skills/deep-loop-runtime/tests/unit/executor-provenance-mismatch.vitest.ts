import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  extractActualModel,
  runAuditedExecutorCommand,
} from '../../lib/deep-loop/executor-audit.js';
import type { ExecutorConfig } from '../../lib/deep-loop/executor-config.js';
import { type ModelProfile, type ModelRegistry, resolveFallback } from '../../lib/deep-loop/fallback-router.js';

type TempPaths = {
  tempDir: string;
  stateLogPath: string;
};

function withTempPaths(run: (paths: TempPaths) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'provenance-mismatch-'));
  const stateLogPath = join(tempDir, 'state.jsonl');

  try {
    writeFileSync(stateLogPath, '{"type":"event","event":"start"}\n', 'utf8');
    run({ tempDir, stateLogPath });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function lastRecord(stateLogPath: string): Record<string, unknown> {
  const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
  return JSON.parse(lines.at(-1) ?? '') as Record<string, unknown>;
}

// A fake CLI that prints one opencode-style JSON event carrying a model id and
// exits cleanly. The model the "executor ran" is read from argv so a test can
// drive the requested-vs-actual relationship directly.
function fakeOpencodeArgs(actualModel: string): string[] {
  const event = JSON.stringify({
    type: 'step_start',
    part: { type: 'step-start', modelID: actualModel },
  });
  return ['-e', `process.stdout.write(${JSON.stringify(`${event}\n`)})`];
}

function opencodeExecutor(model: string | null): ExecutorConfig {
  return {
    kind: 'cli-opencode',
    model,
    configDir: null,
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 900,
  };
}

function nativeExecutor(): ExecutorConfig {
  return {
    kind: 'native',
    model: 'gpt-5.4',
    configDir: null,
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 900,
  };
}

function codexExecutor(model: string): ExecutorConfig {
  return {
    kind: 'cli-codex',
    model,
    configDir: null,
    reasoningEffort: 'high',
    serviceTier: 'priority',
    sandboxMode: null,
    timeoutSeconds: 900,
  };
}

// Pass the real environment through (so the spawned `node` resolves on PATH)
// but clear the keys that would trip the recursion guard for cli-opencode.
function cleanGuardEnv(): Record<string, string | undefined> {
  const env = { ...process.env };
  delete env.SPECKIT_CLI_DISPATCH_STACK;
  delete env.OPENCODE_SESSION_ID;
  return env;
}

const cleanGuard = {
  env: cleanGuardEnv(),
  ancestryCmdlines: [] as string[],
  statePaths: [] as string[],
};

describe('executor provenance mismatch (008 fail-loud)', () => {
  // The requested-vs-actual check is opt-in (disabled by default because current
  // CLIs omit the model on success); enable it here so these cases exercise the
  // comparison logic.
  let savedProvenanceFlag: string | undefined;
  beforeEach(() => {
    savedProvenanceFlag = process.env.SPECKIT_PROVENANCE_CHECK;
    process.env.SPECKIT_PROVENANCE_CHECK = '1';
  });
  afterEach(() => {
    if (savedProvenanceFlag === undefined) delete process.env.SPECKIT_PROVENANCE_CHECK;
    else process.env.SPECKIT_PROVENANCE_CHECK = savedProvenanceFlag;
  });

  it('extractActualModel parses the model from an opencode JSON event and is null for other kinds', () => {
    const event = JSON.stringify({ type: 'step_start', part: { type: 'step-start', modelID: 'deepseek-v4-pro', providerID: 'opencode' } });
    expect(extractActualModel(`${event}\n`, 'cli-opencode')).toBe('opencode/deepseek-v4-pro');
    // A clean opencode run that surfaces no model field is "cannot tell" (null),
    // matching the live `opencode run --format json` success stream.
    expect(extractActualModel('{"type":"text","part":{"type":"text","text":"ok"}}\n', 'cli-opencode')).toBeNull();
    expect(extractActualModel(event, 'cli-codex')).toBeNull();
    expect(extractActualModel(event, 'cli-claude-code')).toBeNull();
    expect(extractActualModel(event, 'native')).toBeNull();
  });

  it('fails loud with model_mismatch when the detectable actual model differs from the requested one', () => {
    withTempPaths(({ tempDir, stateLogPath }) => {
      const previousSize = statSync(stateLogPath).size;
      const exitCode = runAuditedExecutorCommand({
        command: 'node',
        args: fakeOpencodeArgs('deepseek-v4-pro'),
        cwd: tempDir,
        timeoutSeconds: 30,
        stateLogPath,
        executor: opencodeExecutor('gpt-5.5'),
        iteration: 1,
        guardContext: cleanGuard,
      });

      expect(exitCode).toBe(0);
      expect(statSync(stateLogPath).size).toBeGreaterThan(previousSize);
      expect(lastRecord(stateLogPath)).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        reason: 'model_mismatch',
        iteration: 1,
        executor: { kind: 'cli-opencode', model: 'gpt-5.5' },
      });
    });
  });

  it('passes through (no dispatch_failure) when requested and actual model match', () => {
    withTempPaths(({ tempDir, stateLogPath }) => {
      runAuditedExecutorCommand({
        command: 'node',
        args: fakeOpencodeArgs('deepseek-v4-pro'),
        cwd: tempDir,
        timeoutSeconds: 30,
        stateLogPath,
        executor: opencodeExecutor('deepseek-v4-pro'),
        iteration: 2,
        guardContext: cleanGuard,
      });

      // No dispatch_failure was appended; the last record is still the seed event.
      expect(lastRecord(stateLogPath)).toMatchObject({ type: 'event', event: 'start' });
    });
  });

  it('matches tolerant of trivial casing/whitespace differences', () => {
    withTempPaths(({ tempDir, stateLogPath }) => {
      runAuditedExecutorCommand({
        command: 'node',
        args: fakeOpencodeArgs('  DeepSeek-V4-Pro  '),
        cwd: tempDir,
        timeoutSeconds: 30,
        stateLogPath,
        executor: opencodeExecutor('deepseek-v4-pro'),
        iteration: 3,
        guardContext: cleanGuard,
      });

      expect(lastRecord(stateLogPath)).toMatchObject({ type: 'event', event: 'start' });
    });
  });

  it('skips the check for native executors (no false positive)', () => {
    withTempPaths(({ tempDir, stateLogPath }) => {
      runAuditedExecutorCommand({
        command: 'node',
        args: fakeOpencodeArgs('some-other-model'),
        cwd: tempDir,
        timeoutSeconds: 30,
        stateLogPath,
        executor: nativeExecutor(),
        iteration: 4,
        guardContext: cleanGuard,
      });

      expect(lastRecord(stateLogPath)).toMatchObject({ type: 'event', event: 'start' });
    });
  });

  it('skips the check when the actual model cannot be extracted (codex/claude)', () => {
    withTempPaths(({ tempDir, stateLogPath }) => {
      // codex prints a model id in its stream too, but extractActualModel only
      // trusts opencode, so this never produces a false model_mismatch.
      runAuditedExecutorCommand({
        command: 'node',
        args: fakeOpencodeArgs('gpt-9-substituted'),
        cwd: tempDir,
        timeoutSeconds: 30,
        stateLogPath,
        executor: codexExecutor('gpt-5.5'),
        iteration: 5,
        guardContext: cleanGuard,
      });

      expect(lastRecord(stateLogPath)).toMatchObject({ type: 'event', event: 'start' });
    });
  });

  it('skips the check when no model was requested (no false positive)', () => {
    withTempPaths(({ tempDir, stateLogPath }) => {
      runAuditedExecutorCommand({
        command: 'node',
        args: fakeOpencodeArgs('deepseek-v4-pro'),
        cwd: tempDir,
        timeoutSeconds: 30,
        stateLogPath,
        executor: opencodeExecutor(null),
        iteration: 6,
        guardContext: cleanGuard,
      });

      expect(lastRecord(stateLogPath)).toMatchObject({ type: 'event', event: 'start' });
    });
  });
});

describe('fallback-router approval guard (008)', () => {
  const profiles: readonly ModelProfile[] = [
    { id: 'swe-1.6', quota_pool: 'cognition-free', fallback_target: 'haiku' },
    { id: 'haiku', quota_pool: 'anthropic', fallback_target: null },
  ] as const;
  const registry: ModelRegistry = { models: profiles };

  it('routes to the configured cross-pool target when it is caller-approved', () => {
    expect(resolveFallback('swe-1.6', registry, ['swe-1.6', 'haiku'])).toEqual({
      action: 'fallback',
      target: 'haiku',
      reason: 'cognition-free pool exhausted, routing swe-1.6 to separate anthropic pool target haiku',
    });
  });

  it('fails fast when the configured target is not in the caller-approved set (unapproved substitution)', () => {
    const route = resolveFallback('swe-1.6', registry, ['swe-1.6']);
    expect(route.action).toBe('fail-fast');
    expect(route.reason).toContain('not in the caller-approved model set');
  });

  it('preserves the configured fallback route when no approval set is supplied (backward compatible)', () => {
    expect(resolveFallback('swe-1.6', registry)).toEqual({
      action: 'fallback',
      target: 'haiku',
      reason: 'cognition-free pool exhausted, routing swe-1.6 to separate anthropic pool target haiku',
    });
  });
});
