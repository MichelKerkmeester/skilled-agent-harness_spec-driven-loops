import { afterEach, describe, expect, it } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  parseExecutorConfig,
  resolveClaudePermissionMode,
  type ExecutorConfig,
} from '../../lib/deep-loop/executor-config';
import { runAuditedExecutorCommand } from '../../lib/deep-loop/executor-audit';

/**
 * Helper: Given a validated ExecutorConfig and a rendered-prompt path,
 * return the expected command string for that kind.
 */
function buildDispatchCommand(
  config: ExecutorConfig,
  promptPath: string,
): string {
  switch (config.kind) {
    case 'native':
      return `TASK(agent=deep-research, model=opus, context=@${promptPath})`;
    case 'cli-claude-code': {
      const effortFlag = config.reasoningEffort ? ` --effort ${config.reasoningEffort}` : '';
      return [
        'claude',
        `-p "$(cat '${promptPath}')"`,
        `--model "${config.model}"`,
        `--permission-mode ${resolveClaudePermissionMode(config.sandboxMode)}`,
        `--output-format text${effortFlag}`,
      ].join(' ');
    }
    case 'cli-codex':
      return `codex exec --model "${config.model}" -c model_reasoning_effort=${config.reasoningEffort || 'medium'} --sandbox ${config.sandboxMode || 'workspace-write'} -`;
    case 'cli-opencode':
      return `opencode run --model "${config.model}" --format json "$(cat '${promptPath}')"`;
  }
}

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

/**
 * Creates a tracked temporary directory that is cleaned up after each test.
 */
function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'cli-matrix-'));
  tempDirs.push(dir);
  return dir;
}

/**
 * Parses a JSONL file into an array of record objects.
 */
function readJsonlRecords(path: string): Array<Record<string, unknown>> {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

describe('cli-matrix dispatch command shape', () => {
  const promptPath = 'spec-folder/research/prompts/iteration-001.md';

  it('native kind produces agent task shape', () => {
    const config = parseExecutorConfig({ kind: 'native' });
    expect(buildDispatchCommand(config, promptPath)).toContain('TASK(agent=deep-research');
  });

  it('accepts the revived cli-codex command shape', () => {
    const config = parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.6-codex',
      reasoningEffort: 'xhigh',
      sandboxMode: 'workspace-write',
    });
    expect(buildDispatchCommand(config, promptPath)).toContain('codex exec --model "gpt-5.6-codex"');
  });

  it('cli-opencode produces opencode run shape', () => {
    const config = parseExecutorConfig({
      kind: 'cli-opencode',
      model: 'opencode-go/glm-5.1',
      reasoningEffort: 'high',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('opencode run');
    expect(cmd).toContain('--model "opencode-go/glm-5.1"');
    expect(cmd).toContain('--format json');
  });

  it('cli-claude-code with reasoningEffort includes --effort flag', () => {
    const config = parseExecutorConfig({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      reasoningEffort: 'high',
      sandboxMode: 'read-only',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('claude');
    expect(cmd).toContain('--model "claude-opus-4-6"');
    expect(cmd).toContain('--permission-mode plan');
    expect(cmd).toContain('--effort high');
    expect(cmd).not.toContain('service_tier');
  });

  it('cli-claude-code without reasoningEffort omits --effort flag', () => {
    const config = parseExecutorConfig({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('--permission-mode acceptEdits');
    expect(cmd).not.toContain('--effort');
  });
});

describe('cli-matrix smoke coverage', () => {
  it('records a crash failure event from a real subprocess exit', () => {
    const dir = makeTempDir();
    const stateLogPath = join(dir, 'state.jsonl');

    writeFileSync(stateLogPath, `${JSON.stringify({ type: 'iteration_start', iteration: 2 })}\n`, 'utf8');

    const exitCode = runAuditedExecutorCommand({
      command: 'node',
      args: ['-e', 'process.exit(7)'],
      cwd: dir,
      timeoutSeconds: 5,
      stateLogPath,
      executor: parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-opus-4-6' }),
      iteration: 2,
      guardContext: { env: { PATH: process.env.PATH }, ancestryCmdlines: [], statePaths: [] },
    });

    const records = readJsonlRecords(stateLogPath);
    const failure = records.at(-1);

    expect(exitCode).toBe(0);
    expect(failure).toMatchObject({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'crash',
      iteration: 2,
      executor: { kind: 'cli-claude-code', model: 'claude-opus-4-6' },
    });
    expect(failure?.detail).toBe('executor exited with status 7');
  });

  it('records a timeout failure event from a real subprocess timeout', () => {
    const dir = makeTempDir();
    const stateLogPath = join(dir, 'state.jsonl');

    writeFileSync(stateLogPath, `${JSON.stringify({ type: 'iteration_start', iteration: 3 })}\n`, 'utf8');

    const exitCode = runAuditedExecutorCommand({
      command: 'node',
      args: ['-e', 'setTimeout(() => process.exit(0), 5000)'],
      cwd: dir,
      timeoutSeconds: 1,
      stateLogPath,
      executor: parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-opus-4-6' }),
      iteration: 3,
      guardContext: { env: { PATH: process.env.PATH }, ancestryCmdlines: [], statePaths: [] },
    });

    const records = readJsonlRecords(stateLogPath);
    const failure = records.at(-1);

    expect(exitCode).toBe(0);
    expect(failure).toMatchObject({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'timeout',
      iteration: 3,
      executor: { kind: 'cli-claude-code', model: 'claude-opus-4-6' },
    });
  });
});
