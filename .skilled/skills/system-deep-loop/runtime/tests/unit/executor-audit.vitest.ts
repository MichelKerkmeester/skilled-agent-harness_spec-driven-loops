// ───────────────────────────────────────────────────────────────────
// MODULE: Executor Audit Tests
// ───────────────────────────────────────────────────────────────────
import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import {
  CLI_DISPATCH_STACK_ENV,
  FANOUT_LINEAGE_ENV,
  RECURSION_GUARD_EXIT_CODE,
  appendExecutorAuditToLastRecord,
  buildExecutorAuditRecord,
  buildExecutorDispatchEnv,
  classifyExecutorUnavailable,
  detectFromAncestry,
  detectFromFanoutLineage,
  detectFromLockfile,
  detectFromRuntimeEnv,
  detectSameKindFromStack,
  emitDispatchFailure,
  formatRecursionGuardRefusal,
  readAncestorCmdlines,
  runAuditedExecutorCommand,
  validateExecutorDispatchAllowed,
  writeFirstRecordExecutor,
} from '../../lib/deep-loop/executor-audit.js';
import type { ExecutorConfig } from '../../lib/deep-loop/executor-config.js';

const { sumProviderCostFromLog } = createRequire(import.meta.url)('../../scripts/fanout-salvage.cjs') as {
  sumProviderCostFromLog: (stdout: string) => number | null;
};

/**
 * Creates a temporary state log with initial content for executor-audit tests.
 */
function withTempStateLog(content: string, run: (stateLogPath: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'executor-audit-'));
  const stateLogPath = join(tempDir, 'state.jsonl');

  try {
    writeFileSync(stateLogPath, content, 'utf8');
    run(stateLogPath);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Returns a default CLI executor config for use in tests.
 */
function cliClaudeExecutor(): ExecutorConfig {
  return {
    kind: 'cli-claude-code',
    model: 'claude-opus-4-6',
    configDir: null,
    reasoningEffort: 'high',
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 900,
  };
}

/**
 * Returns a Codex CLI executor config for recursion-guard tests.
 */
function cliCodexExecutor(): ExecutorConfig {
  return {
    kind: 'cli-codex',
    model: 'gpt-6-luna',
    configDir: null,
    reasoningEffort: 'high',
    serviceTier: null,
    sandboxMode: 'workspace-write',
    timeoutSeconds: 900,
  };
}

describe('executor-audit', () => {
  it.each([
    ['', 'cognition.ai/errorKind: resource_exhausted', 'resource_exhausted'],
    ['', 'Provider rate limit reached', 'rate limit'],
    ['', 'Daily usage limit reached', 'usage limit'],
    ['', 'Quota exceeded', 'Quota'],
    ['', 'insufficient credits', 'insufficient credits'],
    ['', 'API error occurred: Status 402. Body: {"message":"API budget exhausted."}', 'budget exhausted'],
    ['', 'HTTP 429: too many requests', 'too many requests'],
    ['', 'Not authenticated', 'Not authenticated'],
    ['', 'Not logged in', 'Not logged in'],
    ['', 'Executor capacity is unavailable', 'capacity'],
    ['', 'Service overloaded', 'overloaded'],
  ])('classifies executor-unavailable output marker %s %s', (stdout, stderr, marker) => {
    expect(classifyExecutorUnavailable(stdout, stderr)).toBe(marker);
  });

  it.each([
    ['', 'executor exited with status 1'],
    ['Authentication was successful', 'ordinary provider error'],
    ['Request completed with HTTP 200', ''],
  ])('does not classify ordinary output %s %s', (stdout, stderr) => {
    expect(classifyExecutorUnavailable(stdout, stderr)).toBeNull();
  });

  it('ignores outage markers in ordinary stdout report prose', () => {
    const report = Array.from({ length: 30 }, (_, index) =>
      `Finding ${index + 1}: unauthorized access, capacity pressure, and HTTP 429 were reviewed`,
    ).join('\n');

    expect(classifyExecutorUnavailable(report, '')).toBeNull();
  });

  it('still classifies outage markers anywhere in stderr', () => {
    expect(classifyExecutorUnavailable('', 'unauthorized capacity HTTP 429')).toBe('429');
  });

  it('classifies a JSON error object on stdout', () => {
    expect(classifyExecutorUnavailable('{"type":"error","message":"rate limit exceeded"}', '')).toBe('rate limit');
  });

  // A JSON event stream carries tool output too, so a tool that printed an error about a
  // quota must not read as the executor itself running out of one.
  it('ignores a quota error inside a stream-json tool result', () => {
    const toolResult = JSON.stringify({
      type: 'user',
      message: {
        content: [{ type: 'tool_result', content: 'grep: error: the quota table failed to load' }],
      },
    });
    expect(classifyExecutorUnavailable(toolResult, '')).toBeNull();
  });

  it('classifies a quota failure from the stream-json result event', () => {
    const result = JSON.stringify({
      type: 'result',
      subtype: 'success',
      is_error: true,
      result: 'Claude AI usage limit reached',
    });
    expect(classifyExecutorUnavailable(result, '')).toBe('usage limit');
  });

  it('still classifies a harness final event that ended on a quota error', () => {
    const final = JSON.stringify({ type: 'final', reason: { kind: 'error', message: 'Quota exceeded' } });
    expect(classifyExecutorUnavailable(final, '')).toBe('Quota');
  });

  it('buildExecutorAuditRecord returns all audit fields for a CLI executor', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'high',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    expect(buildExecutorAuditRecord(executor)).toMatchObject({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      reasoningEffort: 'high',
      serviceTier: null,
    });
  });

  it('appendExecutorAuditToLastRecord is a no-op for native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'native',
      model: null,
      configDir: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"iteration","iteration":1}\n', (stateLogPath) => {
      const before = readFileSync(stateLogPath, 'utf8');

      appendExecutorAuditToLastRecord(stateLogPath, executor);

      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    });
  });

  it('writeFirstRecordExecutor appends an iteration_start sentinel when no iteration record exists yet', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'high',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      writeFirstRecordExecutor(stateLogPath, executor, 7);

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      const lastRecord = JSON.parse(lines.at(-1) ?? '');
      expect(lastRecord).toMatchObject({
        type: 'iteration_start',
        iteration: 7,
        executor: {
          kind: 'cli-claude-code',
          model: 'claude-opus-4-6',
          reasoningEffort: 'high',
          serviceTier: null,
        },
      });
      expect(typeof lastRecord.timestamp).toBe('string');
    });
  });

  it('writeFirstRecordExecutor merge-patches the iteration record when executor provenance is missing', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'medium',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n{"type":"iteration","iteration":4,"status":"continue"}\n', (stateLogPath) => {
      writeFirstRecordExecutor(stateLogPath, executor, 4);

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
        type: 'iteration',
        iteration: 4,
        status: 'continue',
        executor: {
          kind: 'cli-claude-code',
          model: 'claude-opus-4-6',
          reasoningEffort: 'medium',
          serviceTier: null,
        },
      });
    });
  });

  it('writeFirstRecordExecutor repairs a corrupt tail before scanning iteration records', () => {
    const executor = cliClaudeExecutor();

    withTempStateLog(
      '{"type":"event","event":"start"}\n{"type":"iteration","iteration":4,"status":"continue"}\n{"type":"event","iteration":4',
      (stateLogPath) => {
        writeFirstRecordExecutor(stateLogPath, executor, 4);

        const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
        expect(lines).toHaveLength(2);
        expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
          type: 'iteration',
          iteration: 4,
          executor: {
            kind: 'cli-claude-code',
            model: 'claude-opus-4-6',
          },
        });
      },
    );
  });

  it('writeFirstRecordExecutor is a no-op when the iteration record already has executor provenance', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'low',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog(
      '{"type":"iteration","iteration":4,"status":"continue","executor":{"kind":"cli-claude-code","model":"claude-opus-4-6","reasoningEffort":"low","serviceTier":null}}\n',
      (stateLogPath) => {
        const before = readFileSync(stateLogPath, 'utf8');

        writeFirstRecordExecutor(stateLogPath, executor, 4);

        expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
      },
    );
  });

  it('writeFirstRecordExecutor skips native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'native',
      model: null,
      configDir: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      const before = readFileSync(stateLogPath, 'utf8');

      writeFirstRecordExecutor(stateLogPath, executor, 2);

      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    });
  });

  it('merges the executor audit block into the last JSONL line for non-native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'medium',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n{"type":"iteration","iteration":2,"status":"continue"}\n', (stateLogPath) => {
      appendExecutorAuditToLastRecord(stateLogPath, executor);

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
        type: 'iteration',
        iteration: 2,
        status: 'continue',
        executor: {
          kind: 'cli-claude-code',
          model: 'claude-opus-4-6',
          reasoningEffort: 'medium',
          serviceTier: null,
        },
      });
    });
  });

  it('persists the updated last line so subsequent reads include the executor field', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'low',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"iteration","iteration":3,"status":"continue"}\n', (stateLogPath) => {
      appendExecutorAuditToLastRecord(stateLogPath, executor);

      const persisted = JSON.parse(readFileSync(stateLogPath, 'utf8').trim());
      expect(persisted.executor).toMatchObject({
        kind: 'cli-claude-code',
        model: 'claude-opus-4-6',
        reasoningEffort: 'low',
        serviceTier: null,
      });
    });
  });

  it('throws when the last JSONL line is malformed', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'high',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event"}\n{"type":"iteration"\n', (stateLogPath) => {
      expect(() => appendExecutorAuditToLastRecord(stateLogPath, executor)).toThrow();
    });
  });

  it('emitDispatchFailure writes a typed dispatch_failure event with executor provenance', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'high',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      emitDispatchFailure(stateLogPath, executor, 'crash', 3, 'worker exited early');

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 3,
        reason: 'crash',
        detail: 'worker exited early',
        executor: {
          kind: 'cli-claude-code',
          model: 'claude-opus-4-6',
          reasoningEffort: 'high',
          serviceTier: null,
        },
      });
    });
  });

  it('emitDispatchFailure repairs a corrupt tail before checking duplicate failure events', () => {
    const executor = cliClaudeExecutor();

    withTempStateLog('{"type":"event","event":"start"}\n{"type":"event","iteration":3', (stateLogPath) => {
      emitDispatchFailure(stateLogPath, executor, 'crash', 3, 'worker exited early');

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      const lastRecord = JSON.parse(lines.at(-1) ?? '');
      expect(lastRecord).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        reason: 'crash',
        iteration: 3,
      });
    });
  });

  it('emitDispatchFailure is idempotent on repeat calls for the same iteration', () => {
    const executor: ExecutorConfig = {
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      configDir: null,
      reasoningEffort: 'medium',
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      emitDispatchFailure(stateLogPath, executor, 'timeout', 5, 'deadline exceeded');
      const once = readFileSync(stateLogPath, 'utf8');

      emitDispatchFailure(stateLogPath, executor, 'timeout', 5, 'deadline exceeded');

      expect(readFileSync(stateLogPath, 'utf8')).toBe(once);
    });
  });

  it('emitDispatchFailure omits the executor block for native executors', () => {
    const executor: ExecutorConfig = {
      kind: 'native',
      model: null,
      configDir: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      emitDispatchFailure(stateLogPath, executor, 'other', 1, 'native failure path');

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      const lastRecord = JSON.parse(lines.at(-1) ?? '');
      expect(lastRecord).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 1,
        reason: 'other',
        detail: 'native failure path',
      });
      expect(lastRecord.executor).toBeUndefined();
    });
  });

  it('detectSameKindFromStack rejects same-runtime loops across two-hop stacks', () => {
    expect(detectSameKindFromStack('cli-opencode:cli-claude-code', 'cli-claude-code')).toBe(true);
    expect(detectSameKindFromStack('cli-claude-code:cli-opencode', 'cli-opencode')).toBe(true);
    expect(detectSameKindFromStack('cli-claude-code', 'native')).toBe(false);
  });

  it('detectFromAncestry matches the executor binary in ancestor command lines', () => {
    expect(detectFromAncestry('cli-claude-code', ['/usr/local/bin/node worker.js', '/opt/homebrew/bin/claude -p'])).toBe(true);
    expect(detectFromAncestry('cli-claude-code', ['/usr/local/bin/node worker.js', '/opt/homebrew/bin/opencode'])).toBe(false);
    expect(detectFromAncestry('cli-codex', ['/usr/local/bin/node worker.js', '/opt/homebrew/bin/codex exec'])).toBe(true);
    expect(detectFromAncestry('cli-cursor', ['/usr/local/bin/node worker.js', '/Users/x/.local/bin/cursor-agent -p'])).toBe(true);
    expect(detectFromAncestry('cli-pi', ['/usr/local/bin/node worker.js', '/Users/x/.local/bin/pi --print'])).toBe(true);
  });

  it('detectFromAncestry matches any Vibe binary name and no lookalike', () => {
    expect(detectFromAncestry('cli-mistral-vibe', ['/usr/local/bin/node worker.js', '/Users/x/.local/bin/vibe-rs -p x'])).toBe(true);
    expect(detectFromAncestry('cli-mistral-vibe', ['/Users/x/.local/bin/vibe-app-server'])).toBe(true);
    expect(detectFromAncestry('cli-mistral-vibe', ['/opt/homebrew/bin/vibe -p'])).toBe(true);
    expect(detectFromAncestry('cli-mistral-vibe', ['/usr/bin/vim notes.md'])).toBe(false);
  });

  it('detectFromRuntimeEnv matches the runtime-specific session variable only', () => {
    expect(detectFromRuntimeEnv('cli-claude-code', { CLAUDE_CODE_SESSION_ID: 'session-1' })).toBe(true);
    expect(detectFromRuntimeEnv('cli-claude-code', { OPENCODE_SESSION_ID: 'session-1' })).toBe(false);
    expect(detectFromRuntimeEnv('cli-codex', { CODEX_SESSION_ID: 'session-1' })).toBe(true);
    expect(detectFromRuntimeEnv('cli-cursor', { CURSOR_CONVERSATION_ID: 'session-1' })).toBe(true);
    expect(detectFromRuntimeEnv('cli-cursor', { CODEX_SESSION_ID: 'session-1' })).toBe(false);
    expect(detectFromRuntimeEnv('cli-pi', { PI_SESSION_ID: 'session-1', PI_CODING_AGENT_DIR: '/tmp/pi' })).toBe(false);
    expect(detectFromRuntimeEnv('native', { CLAUDE_CODE_SESSION_ID: 'session-1' })).toBe(false);
  });

  // The detector still reads Pi lockfiles; what changed is that the guard no longer refuses
  // on what it finds, so the two halves are asserted at the layers that actually own them.
  it('still resolves Pi lockfile names while the guard no longer refuses cli-pi for them', () => {
    const stateDir = mkdtempSync(join(tmpdir(), 'executor-pi-state-'));
    const homeDir = mkdtempSync(join(tmpdir(), 'executor-pi-home-'));

    try {
      mkdirSync(join(stateDir, 'locks'));
      writeFileSync(join(stateDir, 'locks', 'pi.lock'), 'pid=123\n', 'utf8');
      expect(detectFromLockfile('cli-pi', [stateDir])).toBe(true);
      expect(validateExecutorDispatchAllowed({
        ...cliClaudeExecutor(),
        kind: 'cli-pi',
        model: null,
        reasoningEffort: null,
      }, {
        env: { SPECKIT_PI_STATE_DIR: stateDir },
        ancestryCmdlines: [],
      })).toEqual({ allowed: true });

      mkdirSync(join(homeDir, '.pi', 'locks'), { recursive: true });
      writeFileSync(join(homeDir, '.pi', 'locks', 'pi.lock'), 'pid=123\n', 'utf8');
      expect(detectFromLockfile('cli-pi', [join(homeDir, '.pi')])).toBe(true);
      expect(validateExecutorDispatchAllowed({
        ...cliClaudeExecutor(),
        kind: 'cli-pi',
        model: null,
        reasoningEffort: null,
      }, {
        env: { HOME: homeDir },
        ancestryCmdlines: [],
      })).toEqual({ allowed: true });
    } finally {
      rmSync(stateDir, { recursive: true, force: true });
      rmSync(homeDir, { recursive: true, force: true });
    }
  });

  it('detectFromLockfile rejects executor lockfiles in runtime state paths', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'executor-lock-'));

    try {
      mkdirSync(join(tempDir, 'locks'));
      writeFileSync(join(tempDir, 'locks', 'speckit-cli-dispatch-cli-claude-code.lock'), 'pid=123\n', 'utf8');

      expect(detectFromLockfile('cli-claude-code', [tempDir])).toBe(true);
      expect(detectFromLockfile('cli-opencode', [tempDir])).toBe(false);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('validateExecutorDispatchAllowed reports stack guard rejections before spawn', () => {
    expect(
      validateExecutorDispatchAllowed(cliClaudeExecutor(), {
        env: { SPECKIT_CLI_DISPATCH_STACK: 'cli-opencode:cli-claude-code' },
        ancestryCmdlines: [],
        statePaths: [],
      }),
    ).toEqual({
      allowed: false,
      layer: 'stack',
      reason: 'recursion-guard-stack',
      detail: 'cli-claude-code already appears in SPECKIT_CLI_DISPATCH_STACK',
    });
  });

  it('validateExecutorDispatchAllowed reports ancestry guard rejections', () => {
    expect(
      validateExecutorDispatchAllowed(cliClaudeExecutor(), {
        env: {},
        ancestryCmdlines: ['/opt/homebrew/bin/claude -p'],
        statePaths: [],
      }),
    ).toMatchObject({
      allowed: false,
      layer: 'ancestry',
      reason: 'recursion-guard-ancestry',
    });
  });

  it('validateExecutorDispatchAllowed reports env guard rejections', () => {
    expect(
      validateExecutorDispatchAllowed(cliClaudeExecutor(), {
        env: { CLAUDE_CODE_SESSION_ID: 'session-1' },
        ancestryCmdlines: [],
        statePaths: [],
      }),
    ).toMatchObject({
      allowed: false,
      layer: 'env',
      reason: 'recursion-guard-env',
    });
  });

  it('validateExecutorDispatchAllowed reports lockfile guard rejections', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'executor-guard-lock-'));

    try {
      writeFileSync(join(tempDir, 'cli-claude-code.lock'), 'pid=123\n', 'utf8');

      expect(
        validateExecutorDispatchAllowed(cliClaudeExecutor(), {
          env: {},
          ancestryCmdlines: [],
          statePaths: [tempDir],
        }),
      ).toMatchObject({
        allowed: false,
        layer: 'lockfile',
        reason: 'recursion-guard-lockfile',
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('buildExecutorDispatchEnv appends the current kind without mutating parent env', () => {
    const parentEnv = {
      PATH: '/usr/bin',
      HOME: '/tmp/home',
      CLAUDE_CODE_HOME: '/tmp/claude-home',
      GITHUB_TOKEN: 'unrelated-secret',
      OPENAI_API_KEY: 'wrong-provider',
      SPECKIT_CLI_DISPATCH_STACK: 'cli-opencode',
    };

    const nextEnv = buildExecutorDispatchEnv(cliClaudeExecutor(), parentEnv);

    expect(nextEnv).toMatchObject({
      PATH: '/usr/bin',
      HOME: '/tmp/home',
      CLAUDE_CODE_HOME: '/tmp/claude-home',
      SPECKIT_CLI_DISPATCH_STACK: 'cli-opencode:cli-claude-code',
    });
    expect(nextEnv.GITHUB_TOKEN).toBeUndefined();
    expect(nextEnv.OPENAI_API_KEY).toBeUndefined();
    expect(parentEnv.SPECKIT_CLI_DISPATCH_STACK).toBe('cli-opencode');
  });

  it('buildExecutorDispatchEnv preserves only Codex provider state and credentials', () => {
    const executor = { ...cliClaudeExecutor(), kind: 'cli-codex' as const, model: 'gpt-5.6-codex' };
    const nextEnv = buildExecutorDispatchEnv(executor, {
      PATH: '/usr/bin',
      CODEX_HOME: '/tmp/codex-home',
      OPENAI_API_KEY: 'openai-secret',
      ANTHROPIC_API_KEY: 'wrong-provider',
    });

    expect(nextEnv).toMatchObject({
      PATH: '/usr/bin',
      CODEX_HOME: '/tmp/codex-home',
      OPENAI_API_KEY: 'openai-secret',
      SPECKIT_CLI_DISPATCH_STACK: 'cli-codex',
    });
    expect(nextEnv.ANTHROPIC_API_KEY).toBeUndefined();
  });

  it('buildExecutorDispatchEnv preserves only Cursor provider state and credentials', () => {
    const executor = { ...cliClaudeExecutor(), kind: 'cli-cursor' as const, model: 'auto' };
    const nextEnv = buildExecutorDispatchEnv(executor, {
      PATH: '/usr/bin',
      CURSOR_CONVERSATION_ID: 'conversation-1',
      CURSOR_API_KEY: 'cursor-secret',
      OPENAI_API_KEY: 'wrong-provider',
    });

    expect(nextEnv).toMatchObject({
      PATH: '/usr/bin',
      CURSOR_CONVERSATION_ID: 'conversation-1',
      CURSOR_API_KEY: 'cursor-secret',
      SPECKIT_CLI_DISPATCH_STACK: 'cli-cursor',
    });
    expect(nextEnv.OPENAI_API_KEY).toBeUndefined();
  });

  it('runAuditedExecutorCommand emits a typed dispatch_failure when the guard rejects before spawn', () => {
    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      const exitCode = runAuditedExecutorCommand({
        command: 'node',
        args: ['-e', 'process.exit(99)'],
        cwd: tmpdir(),
        timeoutSeconds: 5,
        stateLogPath,
        executor: cliClaudeExecutor(),
        iteration: 9,
        guardContext: {
          env: { SPECKIT_CLI_DISPATCH_STACK: 'cli-claude-code' },
          ancestryCmdlines: [],
          statePaths: [],
        },
      });

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(exitCode).toBe(RECURSION_GUARD_EXIT_CODE);
      expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 9,
        reason: 'recursion-guard-stack',
        detail: 'cli-claude-code already appears in SPECKIT_CLI_DISPATCH_STACK',
        executor: { kind: 'cli-claude-code' },
      });
    });
  });

  it.each([
    ['a clean exit', 0],
    ['a non-zero exit', 3],
  ])('runAuditedExecutorCommand hands the captured stdout to onStdout once on %s', (_label, status) => {
    withTempStateLog('', (stateLogPath) => {
      const seen: string[] = [];
      runAuditedExecutorCommand({
        command: 'node',
        args: ['-e', `process.stdout.write('{"type":"result"}\\n'); process.exit(${status})`],
        cwd: tmpdir(),
        timeoutSeconds: 5,
        stateLogPath,
        executor: cliClaudeExecutor(),
        iteration: 2,
        guardContext: {
          env: { PATH: process.env.PATH, [CLI_DISPATCH_STACK_ENV]: '' },
          ancestryCmdlines: [],
          statePaths: [],
        },
        echoStdout: false,
        onStdout: (stdout: string) => { seen.push(stdout); },
      });

      expect(seen).toEqual(['{"type":"result"}\n']);
    });
  });

  it('runAuditedExecutorCommand marks captured provider quota output as executor unavailable', () => {
    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      runAuditedExecutorCommand({
        command: 'node',
        args: ['-e', "process.stderr.write('resource_exhausted'); process.exit(1)"],
        cwd: tmpdir(),
        timeoutSeconds: 5,
        stateLogPath,
        executor: cliClaudeExecutor(),
        iteration: 10,
        guardContext: {
          env: { PATH: process.env.PATH, [CLI_DISPATCH_STACK_ENV]: '' },
          ancestryCmdlines: [],
          statePaths: [],
        },
      });

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      expect(JSON.parse(lines.at(-1) ?? '')).toMatchObject({
        type: 'event',
        event: 'dispatch_failure',
        iteration: 10,
        executorUnavailable: true,
        matchedMarker: 'resource_exhausted',
      });
    });
  });

  // A child that writes the stream as many short lines, then its last lines, so a case
  // can make the stream as long as it needs without one huge string in the child either.
  function streamingChild(fillerBytes: number, lastLines: string[], exitCode: number): string[] {
    const filler = JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'x'.repeat(1000) }] } });
    return ['-e', [
      "const fs = require('node:fs');",
      `const line = ${JSON.stringify(filler + '\n')};`,
      `for (let written = 0; written < ${fillerBytes}; written += line.length) fs.writeSync(1, line);`,
      `fs.writeSync(1, ${JSON.stringify(lastLines.join('\n') + '\n')});`,
      `process.exit(${exitCode});`,
    ].join('\n')];
  }

  function auditedRun(stateLogPath: string, args: string[], extra: Record<string, unknown>): void {
    runAuditedExecutorCommand({
      command: process.execPath,
      args,
      cwd: tmpdir(),
      timeoutSeconds: 60,
      stateLogPath,
      executor: cliClaudeExecutor(),
      iteration: 4,
      guardContext: {
        env: { PATH: process.env.PATH, [CLI_DISPATCH_STACK_ENV]: '' },
        ancestryCmdlines: [],
        statePaths: [],
      },
      echoStdout: false,
      ...extra,
    });
  }

  it('runAuditedExecutorCommand logs a stream past the old 10 MB capture cap and still reads its cost', () => {
    withTempStateLog('', (stateLogPath) => {
      const logPath = join(dirname(stateLogPath), 'iterations', 'iteration-004.out');
      const seen: string[] = [];
      const finalLine = JSON.stringify({ type: 'result', subtype: 'success', total_cost_usd: 0.42 });
      auditedRun(stateLogPath, streamingChild(12 * 1024 * 1024, [finalLine], 0), {
        stdoutLogPath: logPath,
        onStdout: (stdout: string) => { seen.push(stdout); },
        completionCheck: (_exit: number, stdout: string) =>
          (stdout.trimEnd().split('\n').at(-1) === finalLine ? null : 'no result event'),
      });

      expect(readFileSync(stateLogPath, 'utf8')).toBe('');
      expect(statSync(logPath).size).toBeGreaterThan(12 * 1024 * 1024);
      expect(seen).toHaveLength(1);
      expect(sumProviderCostFromLog(seen[0])).toBe(0.42);
    });
  });

  // Past the read bound the checks see only the stream's end, which is where a CLI
  // reports the refusal that ended the run.
  it('runAuditedExecutorCommand classifies an unavailable marker found only at the end of a long stream', () => {
    withTempStateLog('', (stateLogPath) => {
      auditedRun(stateLogPath, streamingChild(24 * 1024 * 1024, [
        JSON.stringify({ type: 'error', message: 'rate limit reached for this account' }),
      ], 1), {});

      const row = JSON.parse(readFileSync(stateLogPath, 'utf8').trimEnd().split('\n').at(-1) ?? '');
      expect(row).toMatchObject({
        event: 'dispatch_failure',
        detail: 'executor exited with status 1',
        executorUnavailable: true,
        matchedMarker: 'rate limit',
      });
    });
  });
});

describe('executor-audit recursion guard: nested cli-codex dispatch', () => {
  /**
   * Runs a codex dispatch whose command would create a marker file, so the test can
   * prove from the filesystem whether a child process actually ran.
   */
  function dispatchCodexWithMarker(
    env: Record<string, string | undefined>,
    ancestryCmdlines: string[] = [],
  ): { exitCode: number; markerExists: boolean; lastEvent: Record<string, unknown> } {
    let outcome: { exitCode: number; markerExists: boolean; lastEvent: Record<string, unknown> } | null = null;

    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      const markerPath = join(dirname(stateLogPath), 'spawned.marker');
      const exitCode = runAuditedExecutorCommand({
        command: 'node',
        args: ['-e', "require('fs').writeFileSync(process.argv[1], 'spawned')", markerPath],
        cwd: tmpdir(),
        timeoutSeconds: 30,
        stateLogPath,
        executor: cliCodexExecutor(),
        iteration: 4,
        guardContext: {
          env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
          ancestryCmdlines,
          statePaths: [],
        },
      });

      const lines = readFileSync(stateLogPath, 'utf8').trimEnd().split('\n');
      outcome = {
        exitCode,
        markerExists: existsSync(markerPath),
        lastEvent: JSON.parse(lines.at(-1) ?? '{}'),
      };
    });

    if (!outcome) {
      throw new Error('dispatch did not run');
    }
    return outcome;
  }

  it('refuses before spawn when the process already holds a codex session', () => {
    const outcome = dispatchCodexWithMarker({ CODEX_SESSION_ID: 'session-1' });

    expect(outcome.exitCode).toBe(RECURSION_GUARD_EXIT_CODE);
    expect(outcome.markerExists).toBe(false);
    expect(outcome.lastEvent).toMatchObject({
      event: 'dispatch_failure',
      reason: 'recursion-guard-env',
      executor: { kind: 'cli-codex' },
    });
  });

  it('refuses before spawn when cli-codex already appears in the dispatch stack', () => {
    const outcome = dispatchCodexWithMarker({ SPECKIT_CLI_DISPATCH_STACK: 'cli-codex' });

    expect(outcome.exitCode).toBe(RECURSION_GUARD_EXIT_CODE);
    expect(outcome.markerExists).toBe(false);
    expect(outcome.lastEvent).toMatchObject({ reason: 'recursion-guard-stack' });
  });

  it('refuses before spawn when the process is itself a fan-out CLI lineage', () => {
    const outcome = dispatchCodexWithMarker({ SPECKIT_FANOUT_LINEAGE_ID: 'research-lineage-1' });

    expect(outcome.exitCode).toBe(RECURSION_GUARD_EXIT_CODE);
    expect(outcome.markerExists).toBe(false);
    expect(outcome.lastEvent).toMatchObject({ reason: 'recursion-guard-lineage' });
  });

  it('refuses before spawn when the codex binary is in the process ancestry', () => {
    const outcome = dispatchCodexWithMarker({}, ['/opt/homebrew/bin/codex exec --sandbox workspace-write -']);

    expect(outcome.exitCode).toBe(RECURSION_GUARD_EXIT_CODE);
    expect(outcome.markerExists).toBe(false);
    expect(outcome.lastEvent).toMatchObject({ reason: 'recursion-guard-ancestry' });
  });

  it('still reaches the spawn path for a top-level dispatch with a clean environment', () => {
    const outcome = dispatchCodexWithMarker({});

    expect(outcome.exitCode).toBe(0);
    expect(outcome.markerExists).toBe(true);
  });

  it('detectFromFanoutLineage only fires on a non-empty lineage marker', () => {
    expect(detectFromFanoutLineage({ SPECKIT_FANOUT_LINEAGE_ID: 'lineage-a' })).toBe(true);
    expect(detectFromFanoutLineage({ SPECKIT_FANOUT_LINEAGE_ID: '  ' })).toBe(false);
    expect(detectFromFanoutLineage({})).toBe(false);
  });

  it('formatRecursionGuardRefusal names the kind, the layer and the required alternative', () => {
    const refusal = validateExecutorDispatchAllowed(cliCodexExecutor(), {
      env: { SPECKIT_FANOUT_LINEAGE_ID: 'research-lineage-1' },
      ancestryCmdlines: [],
      statePaths: [],
    });

    expect(refusal.allowed).toBe(false);
    if (refusal.allowed) {
      return;
    }
    expect(formatRecursionGuardRefusal(refusal, cliCodexExecutor())).toBe(
      'nested cli-codex dispatch refused [recursion-guard-lineage]: SPECKIT_FANOUT_LINEAGE_ID is set,'
        + ' so this process is already a fan-out CLI lineage'
        + ' — run the iteration in-process instead of dispatching cli-codex again',
    );
  });

  it('reads a process ancestry on platforms without /proc so the ancestry layer can fire', () => {
    const cmdlines = readAncestorCmdlines();
    expect(Array.isArray(cmdlines)).toBe(true);

    // Only assert a real reading where a source exists, so the test stays honest on a
    // host that has neither /proc nor ps rather than asserting an unreachable guarantee.
    if (existsSync('/proc/self/stat') || existsSync('/bin/ps')) {
      expect(cmdlines.length).toBeGreaterThan(0);
    }
  });
});

describe('executor-audit recursion guard: pi self-presence exemption', () => {
  function executorOfKind(kind: ExecutorConfig['kind']): ExecutorConfig {
    return {
      kind,
      model: null,
      configDir: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };
  }

  // Kind -> a command line that contains that kind's binary, so the ancestry layer sees it.
  const OTHER_KINDS: ReadonlyArray<[ExecutorConfig['kind'], string]> = [
    ['cli-codex', '/opt/homebrew/bin/codex exec -p'],
    ['cli-claude-code', '/opt/homebrew/bin/claude -p'],
    ['cli-opencode', '/opt/homebrew/bin/opencode run'],
    ['cli-cursor', '/opt/homebrew/bin/cursor-agent -p'],
    ['cli-devin', '/opt/homebrew/bin/devin -p'],
    ['cli-deepseek-harness', '/opt/homebrew/bin/dsh --profile headless -'],
  ];

  it('allows a cli-pi dispatch whose only signal is the pi binary in process ancestry', () => {
    expect(
      validateExecutorDispatchAllowed(executorOfKind('cli-pi'), {
        env: {},
        ancestryCmdlines: ['/opt/homebrew/bin/pi -p'],
        statePaths: [],
      }),
    ).toEqual({ allowed: true });
  });

  it('allows a cli-pi dispatch whose only signal is a pi dispatch lockfile', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'executor-guard-pi-lock-'));

    try {
      writeFileSync(join(tempDir, 'cli-pi.lock'), 'pid=123\n', 'utf8');

      expect(
        validateExecutorDispatchAllowed(executorOfKind('cli-pi'), {
          env: {},
          ancestryCmdlines: [],
          statePaths: [tempDir],
        }),
      ).toEqual({ allowed: true });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  // The exemption is keyed to one kind. A kind-agnostic rewrite passes the two cases above
  // and fails here, which is the whole reason this case exists.
  it.each(OTHER_KINDS)('still refuses %s on the ancestry layer', (kind, commandLine) => {
    expect(
      validateExecutorDispatchAllowed(executorOfKind(kind), {
        env: {},
        ancestryCmdlines: [commandLine],
        statePaths: [],
      }),
    ).toMatchObject({
      allowed: false,
      layer: 'ancestry',
      reason: 'recursion-guard-ancestry',
    });
  });

  it.each(OTHER_KINDS)('still refuses %s on the lockfile layer', (kind) => {
    const tempDir = mkdtempSync(join(tmpdir(), 'executor-guard-other-lock-'));

    try {
      writeFileSync(join(tempDir, `${kind}.lock`), 'pid=123\n', 'utf8');

      expect(
        validateExecutorDispatchAllowed(executorOfKind(kind), {
          env: {},
          ancestryCmdlines: [],
          statePaths: [tempDir],
        }),
      ).toMatchObject({
        allowed: false,
        layer: 'lockfile',
        reason: 'recursion-guard-lockfile',
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it.each(['SPECKIT_DEEPSEEK_HARNESS_STATE_DIR', 'DSH_HOME'])('refuses a cli-deepseek-harness dispatch when %s is set', (key) => {
    expect(
      validateExecutorDispatchAllowed(executorOfKind('cli-deepseek-harness'), {
        env: { [key]: '/tmp/dsh-state' },
        ancestryCmdlines: [],
        statePaths: [],
      }),
    ).toMatchObject({
      allowed: false,
      layer: 'env',
      reason: 'recursion-guard-env',
    });
  });

  it('detects cli-deepseek-harness lockfiles under the default .dsh home', () => {
    const tempHome = mkdtempSync(join(tmpdir(), 'executor-guard-dsh-home-'));

    try {
      const dshHome = join(tempHome, '.dsh');
      mkdirSync(dshHome, { recursive: true });
      writeFileSync(join(dshHome, 'dsh.lock'), 'pid=123\n', 'utf8');

      expect(
        validateExecutorDispatchAllowed(executorOfKind('cli-deepseek-harness'), {
          env: { HOME: tempHome },
          ancestryCmdlines: [],
        }),
      ).toMatchObject({
        allowed: false,
        layer: 'lockfile',
        reason: 'recursion-guard-lockfile',
      });
    } finally {
      rmSync(tempHome, { recursive: true, force: true });
    }
  });

  // Being inside Pi is now allowed; being inside a spawn chain is not, and the exemption
  // must not have reached the two layers that bound one.
  it('still refuses a cli-pi dispatch from inside a fan-out lineage', () => {
    expect(
      validateExecutorDispatchAllowed(executorOfKind('cli-pi'), {
        env: { [FANOUT_LINEAGE_ENV]: 'outer-lineage' },
        ancestryCmdlines: ['/opt/homebrew/bin/pi -p'],
        statePaths: [],
      }),
    ).toMatchObject({
      allowed: false,
      layer: 'lineage',
      reason: 'recursion-guard-lineage',
    });
  });

  it('still refuses a cli-pi dispatch already named in the dispatch stack', () => {
    expect(
      validateExecutorDispatchAllowed(executorOfKind('cli-pi'), {
        env: { [CLI_DISPATCH_STACK_ENV]: 'cli-codex:cli-pi' },
        ancestryCmdlines: [],
        statePaths: [],
      }),
    ).toMatchObject({
      allowed: false,
      layer: 'stack',
      reason: 'recursion-guard-stack',
    });
  });
});

describe('executor-audit: cli-pi environment filter', () => {
  function cliPiExecutor(): ExecutorConfig {
    return {
      kind: 'cli-pi',
      model: null,
      configDir: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };
  }

  it('passes PI_BLACKHOLE_PASSIVE to a cli-pi child and still strips an unlisted variable', () => {
    const nextEnv = buildExecutorDispatchEnv(cliPiExecutor(), {
      PATH: '/usr/bin',
      PI_BLACKHOLE_PASSIVE: 'true',
      LLMGATEWAY_API_KEY: 'gateway-secret',
      PI_BLACKHOLE_PASSIVE_EXTRA: 'not-listed',
      UNLISTED_PROBE_VAR: 'should-not-pass',
    });

    expect(nextEnv).toMatchObject({
      PATH: '/usr/bin',
      PI_BLACKHOLE_PASSIVE: 'true',
      LLMGATEWAY_API_KEY: 'gateway-secret',
      SPECKIT_CLI_DISPATCH_STACK: 'cli-pi',
    });
    expect(nextEnv.PI_BLACKHOLE_PASSIVE_EXTRA).toBeUndefined();
    expect(nextEnv.UNLISTED_PROBE_VAR).toBeUndefined();
  });

  it('keeps PI_BLACKHOLE_PASSIVE out of every other executor kind', () => {
    const nextEnv = buildExecutorDispatchEnv(cliCodexExecutor(), {
      PATH: '/usr/bin',
      PI_BLACKHOLE_PASSIVE: 'true',
    });

    expect(nextEnv.PI_BLACKHOLE_PASSIVE).toBeUndefined();
  });

  it('delivers PI_BLACKHOLE_PASSIVE to the spawned cli-pi child process', () => {
    let childEnv: Record<string, unknown> = {};
    withTempStateLog('{"type":"event","event":"start"}\n', (stateLogPath) => {
      const envPath = join(dirname(stateLogPath), 'child-env.json');
      const exitCode = runAuditedExecutorCommand({
        command: 'node',
        args: [
          '-e',
          "require('fs').writeFileSync(process.argv[1], JSON.stringify({ passive: process.env.PI_BLACKHOLE_PASSIVE ?? null, unlisted: process.env.UNLISTED_PROBE_VAR ?? null }))",
          envPath,
        ],
        cwd: tmpdir(),
        timeoutSeconds: 30,
        stateLogPath,
        executor: cliPiExecutor(),
        iteration: 1,
        guardContext: {
          env: {
            PATH: process.env.PATH,
            HOME: process.env.HOME,
            PI_BLACKHOLE_PASSIVE: 'true',
            UNLISTED_PROBE_VAR: 'should-not-pass',
          },
          ancestryCmdlines: [],
          statePaths: [],
        },
      });

      expect(exitCode).toBe(0);
      childEnv = JSON.parse(readFileSync(envPath, 'utf8'));
    });

    expect(childEnv).toEqual({ passive: 'true', unlisted: null });
  });
});

describe('executor-audit: cli-deepseek-harness environment filter', () => {
  const executor: ExecutorConfig = {
    kind: 'cli-deepseek-harness',
    model: null,
    configDir: null,
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 900,
  };

  it('passes only its gateway prefix and named provider key, never an inherited DSH_HOME', () => {
    const nextEnv = buildExecutorDispatchEnv(executor, {
      PATH: '/usr/bin',
      LLMGATEWAY_API_KEY: 'gateway-secret',
      LLMGATEWAY_REGION: 'eu',
      DSH_HOME: 'must-drop',
      OPENCODE_API_KEY: 'opencode-secret',
      DEEPSEEK_API_KEY: 'must-drop',
      DSH_TELEMETRY_OTLP_URL: 'must-drop',
      DSH_FOO: 'must-drop',
      OPENCODE_FOO: 'must-drop',
      UNRELATED_TOKEN: 'must-drop',
    });

    expect(nextEnv).toMatchObject({
      PATH: '/usr/bin',
      LLMGATEWAY_API_KEY: 'gateway-secret',
      LLMGATEWAY_REGION: 'eu',
      OPENCODE_API_KEY: 'opencode-secret',
      [CLI_DISPATCH_STACK_ENV]: 'cli-deepseek-harness',
    });
    expect(nextEnv).not.toHaveProperty('DEEPSEEK_API_KEY');
    expect(nextEnv).not.toHaveProperty('DSH_HOME');
    expect(nextEnv).not.toHaveProperty('DSH_TELEMETRY_OTLP_URL');
    expect(nextEnv).not.toHaveProperty('DSH_FOO');
    expect(nextEnv).not.toHaveProperty('OPENCODE_FOO');
    expect(nextEnv).not.toHaveProperty('UNRELATED_TOKEN');
  });
});

describe('executor-audit: cli-mistral-vibe environment filter', () => {
  const executor: ExecutorConfig = {
    kind: 'cli-mistral-vibe',
    model: 'deepseek-flash',
    configDir: null,
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: null,
    timeoutSeconds: 900,
  };

  it('passes the provider key and Vibe variables but never an inherited VIBE_HOME', () => {
    const nextEnv = buildExecutorDispatchEnv(
      executor,
      {
        PATH: '/usr/bin',
        MISTRAL_API_KEY: 'mistral-secret',
        VIBE_PROBE: 'probe-value',
        VIBE_HOME: 'must-drop',
        OPENAI_API_KEY: 'wrong-provider',
      },
      { mistralSignInKey: () => null },
    );

    expect(nextEnv).toMatchObject({
      PATH: '/usr/bin',
      MISTRAL_API_KEY: 'mistral-secret',
      VIBE_PROBE: 'probe-value',
      [CLI_DISPATCH_STACK_ENV]: 'cli-mistral-vibe',
    });
    expect(nextEnv).not.toHaveProperty('OPENAI_API_KEY');
    expect(nextEnv).not.toHaveProperty('VIBE_HOME');
  });

  it('prefers the sign-in key over an API key inherited from the parent', () => {
    const nextEnv = buildExecutorDispatchEnv(
      executor,
      { PATH: '/usr/bin', MISTRAL_API_KEY: 'api-key' },
      { mistralSignInKey: () => 'signin-key' },
    );

    expect(nextEnv.MISTRAL_API_KEY).toBe('signin-key');
    expect(nextEnv[CLI_DISPATCH_STACK_ENV]).toBe('cli-mistral-vibe');
  });

  it('supplies the sign-in key when the parent carries no provider key', () => {
    const nextEnv = buildExecutorDispatchEnv(
      executor,
      { PATH: '/usr/bin' },
      { mistralSignInKey: () => 'signin-key' },
    );

    expect(nextEnv.MISTRAL_API_KEY).toBe('signin-key');
  });

  it('leaves the sign-in key off every other executor kind', () => {
    const piExecutor: ExecutorConfig = {
      kind: 'cli-pi',
      model: null,
      configDir: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    };

    const nextEnv = buildExecutorDispatchEnv(
      piExecutor,
      { PATH: '/usr/bin' },
      { mistralSignInKey: () => 'signin-key' },
    );

    expect(nextEnv).not.toHaveProperty('MISTRAL_API_KEY');
  });
});
