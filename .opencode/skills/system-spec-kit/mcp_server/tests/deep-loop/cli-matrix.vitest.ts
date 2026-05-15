// ───────────────────────────────────────────────────────────────────
// MODULE: Cli Matrix tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  parseExecutorConfig,
  resolveClaudePermissionMode,
  resolveCodexSandboxMode,
  resolveGeminiSandboxMode,
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
    case 'cli-codex':
      return [
        'codex exec',
        `--model "${config.model}"`,
        `-c model_reasoning_effort="${config.reasoningEffort}"`,
        `-c service_tier="${config.serviceTier}"`,
        '-c approval_policy=never',
        `--sandbox ${resolveCodexSandboxMode(config.sandboxMode)}`,
        `- < "${promptPath}"`,
      ].join(' ');
    case 'cli-gemini':
      return [
        'gemini',
        `"$(cat '${promptPath}')"`,
        `-m "${config.model}"`,
        `-s ${resolveGeminiSandboxMode(config.sandboxMode)}`,
        '-y',
        '-o text',
      ].join(' ');
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
  }
}

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'cli-matrix-'));
  tempDirs.push(dir);
  return dir;
}

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

  it('cli-codex produces codex exec with stdin piping', () => {
    const config = parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'fast',
      sandboxMode: 'read-only',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('codex exec');
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('model_reasoning_effort="high"');
    expect(cmd).toContain('service_tier="fast"');
    expect(cmd).toContain('--sandbox read-only');
    expect(cmd).toContain(`- < "${promptPath}"`);
  });

  it('cli-gemini produces positional prompt with whitelisted model', () => {
    const config = parseExecutorConfig({
      kind: 'cli-gemini',
      model: 'gemini-3.1-pro-preview',
      sandboxMode: 'workspace-write',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('gemini');
    expect(cmd).toContain(`"$(cat '${promptPath}')"`);
    expect(cmd).toContain('-m "gemini-3.1-pro-preview"');
    expect(cmd).toContain('-s docker');
    expect(cmd).toContain('-y');
    expect(cmd).toContain('-o text');
    expect(cmd).not.toContain('reasoning_effort');
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
      executor: parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' }),
      iteration: 2,
    });

    const records = readJsonlRecords(stateLogPath);
    const failure = records.at(-1);

    expect(exitCode).toBe(0);
    expect(failure).toMatchObject({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'crash',
      iteration: 2,
      executor: { kind: 'cli-codex', model: 'gpt-5.4' },
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
      executor: parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' }),
      iteration: 3,
    });

    const records = readJsonlRecords(stateLogPath);
    const failure = records.at(-1);

    expect(exitCode).toBe(0);
    expect(failure).toMatchObject({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'timeout',
      iteration: 3,
      executor: { kind: 'cli-codex', model: 'gpt-5.4' },
    });
  });
});
