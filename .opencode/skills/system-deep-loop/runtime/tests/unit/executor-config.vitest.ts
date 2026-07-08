import { afterEach, describe, it, expect, vi } from 'vitest';

import {
  ExecutorConfigError,
  parseExecutorConfig,
  resolveExecutorConfig,
  parseFanoutConfig,
  expandLineages,
} from '../../lib/deep-loop/executor-config';

describe('executor-config', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all defaults for a native executor config', () => {
    expect(parseExecutorConfig({ kind: 'native' })).toEqual({
      kind: 'native',
      model: null,
      configDir: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
      governor: null,
    });
  });

  it('defaults governor to null and accepts a governor string on any kind', () => {
    expect(parseExecutorConfig({ kind: 'native' }).governor).toBeNull();
    expect(parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', governor: 'be terse; act not narrate' }))
      .toMatchObject({ kind: 'cli-opencode', governor: 'be terse; act not narrate' });
  });

  it('rejects a non-string or empty governor', () => {
    expect(() => parseExecutorConfig({ kind: 'native', governor: 123 as unknown as string })).toThrow(ExecutorConfigError);
    expect(() => parseExecutorConfig({ kind: 'native', governor: '' })).toThrow(ExecutorConfigError);
  });

  it('defaults to native when given an empty object', () => {
    expect(parseExecutorConfig({})).toMatchObject({
      kind: 'native',
      timeoutSeconds: 900,
    });
  });

  it('rejects the retired executor kind', () => {
    const retiredKind = ['cli', 'gemini'].join('-');
    expect(() => parseExecutorConfig({ kind: retiredKind, model: 'gpt-5.4' })).toThrow(ExecutorConfigError);
  });

  it('accepts deprecated executor type as an alias for kind and logs a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(parseExecutorConfig({ type: 'cli-opencode', model: 'opencode-go/glm-5.1' })).toMatchObject({
      kind: 'cli-opencode',
      model: 'opencode-go/glm-5.1',
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Deprecated executor field 'type'"));
  });

  it('rejects conflicting deprecated type and canonical kind values', () => {
    expect(() => parseExecutorConfig({ type: 'native', kind: 'cli-opencode', model: 'opencode-go/glm-5.1' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('accepts cli-opencode without a model because the CLI can use its default', () => {
    expect(parseExecutorConfig({ kind: 'cli-opencode', model: null })).toMatchObject({
      kind: 'cli-opencode',
      model: null,
    });
  });


  it('accepts a cli-claude-code executor with a model', () => {
    expect(parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-opus-4-6' })).toMatchObject({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
    });
  });

  it('accepts cli-claude-code reasoningEffort because the kind supports it', () => {
    expect(
      parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-opus-4-6', reasoningEffort: 'high' }),
    ).toMatchObject({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      reasoningEffort: 'high',
    });
  });

  it('accepts cli-claude-code configDir when it is a non-empty string path', () => {
    expect(
      parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-fable-5', configDir: '~/.claude-account2' }),
    ).toMatchObject({
      kind: 'cli-claude-code',
      model: 'claude-fable-5',
      configDir: '~/.claude-account2',
    });
  });

  it('rejects blank configDir values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-fable-5', configDir: '   ' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects configDir for non-Claude executor kinds', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', configDir: '~/.claude-account2' })).toThrowError(
      /configDir.*not supported by executor kind 'cli-opencode'/,
    );
  });

  it('rejects unknown executor kinds', () => {
    expect(() => parseExecutorConfig({ kind: 'mystery-cli', model: 'x' })).toThrow(ExecutorConfigError);
  });

  it('rejects unknown reasoning effort values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', reasoningEffort: 'super' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects unknown service tier values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', serviceTier: 'slow' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects non-positive timeout values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', timeoutSeconds: 0 })).toThrow(
      ExecutorConfigError,
    );
  });

  it('defaults timeoutSeconds to 900 when not specified', () => {
    expect(parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1' }).timeoutSeconds).toBe(900);
  });

  it('rejects serviceTier for cli-claude-code because the kind does not support it', () => {
    expect(() =>
      parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-opus-4-6', serviceTier: 'fast' }),
    ).toThrowError(/serviceTier.*not supported by executor kind 'cli-claude-code'/);
  });

  it('rejects model for native because the kind does not support it', () => {
    expect(() => parseExecutorConfig({ kind: 'native', model: 'foo' })).toThrowError(
      /model.*not supported by executor kind 'native'/,
    );
  });

  // ─────────────────────────────────────────────────────────────────────────
  // cli-opencode (executor config)
  // ─────────────────────────────────────────────────────────────────────────

  it('accepts a cli-opencode executor with a model and reasoningEffort variant', () => {
    expect(
      parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', reasoningEffort: 'high' }),
    ).toMatchObject({
      kind: 'cli-opencode',
      model: 'opencode-go/glm-5.1',
      reasoningEffort: 'high',
    });
  });

  it('accepts sandboxMode for cli-opencode so a detached lineage can declare its write boundary', () => {
    expect(
      parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/qwen3.6-plus', sandboxMode: 'workspace-write' }),
    ).toMatchObject({
      kind: 'cli-opencode',
      model: 'opencode-go/qwen3.6-plus',
      sandboxMode: 'workspace-write',
    });
  });

  it('rejects serviceTier for cli-opencode (no opencode equivalent)', () => {
    expect(() =>
      parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', serviceTier: 'fast' }),
    ).toThrowError(/serviceTier.*not supported by executor kind 'cli-opencode'/);
  });

  it('accepts cli-opencode without a model (no whitelist enforcement)', () => {
    expect(parseExecutorConfig({ kind: 'cli-opencode' })).toMatchObject({
      kind: 'cli-opencode',
      model: null,
    });
  });

  it('lets CLI values override file values during resolution', () => {
    expect(resolveExecutorConfig({ cli: { kind: 'cli-opencode', model: 'opencode-go/glm-5.1' }, file: { kind: 'native' } })).toMatchObject({
      kind: 'cli-opencode',
      model: 'opencode-go/glm-5.1',
    });
  });

  it('uses file values when CLI values are absent', () => {
    expect(resolveExecutorConfig({ cli: {}, file: { kind: 'cli-opencode', model: 'opencode-go/glm-5.1' } })).toMatchObject({
      kind: 'cli-opencode',
      model: 'opencode-go/glm-5.1',
    });
  });

  it('rejects resolving a CLI model onto the default native kind because native supports no model flag', () => {
    expect(() => resolveExecutorConfig({ cli: { model: 'x' } })).toThrowError(
      /model.*not supported by executor kind 'native'/,
    );
  });

  it('rejects a retired executor config during resolution', () => {
    const retiredKind = ['cli', 'gemini'].join('-');
    expect(() => resolveExecutorConfig({ cli: { kind: retiredKind as never } })).toThrow(ExecutorConfigError);
  });
});

describe('parseFanoutConfig', () => {
  it('accepts a multi-executor fan-out config with defaults', () => {
    const config = parseFanoutConfig({
      executors: [
        { kind: 'native', label: 'opus' },
        { kind: 'cli-opencode', model: 'opencode-go/glm-5.1', label: 'glm' },
      ],
    });
    expect(config.executors).toHaveLength(2);
    expect(config.concurrency).toBe(2);
    expect(config.maxRetries).toBe(5);
    // Stall detection defaults ON so a stalled lineage fails loud instead of hanging.
    expect(config.lagCeilingMs).toBe(300000);
    expect(config.progressHeartbeatSeconds).toBe(60);
    expect(config.assignment_model).toBe('flat_pool');
    expect(config.executors[0].count).toBe(1);
    expect(config.executors[0].iterations).toBeNull();
    expect(config.executors[0].assignment_model).toBe('flat_pool');
    expect(config.executors[0].depends_on).toEqual([]);
    expect(config.executors[0].touches).toEqual([]);
  });

  it('accepts per-lineage cli-claude-code configDir in fan-out config', () => {
    const config = parseFanoutConfig({
      executors: [
        { kind: 'cli-claude-code', model: 'claude-fable-5', configDir: '~/.claude-account2', label: 'fable' },
      ],
    });
    expect(config.executors[0].configDir).toBe('~/.claude-account2');
  });

  it('accepts reserved wave assignment metadata without changing defaults', () => {
    const config = parseFanoutConfig({
      executors: [
        {
          kind: 'native',
          label: 'planner',
          depends_on: ['prep'],
          touches: ['.opencode/skills/system-deep-loop/runtime/scripts/**'],
        },
      ],
    });
    expect(config.assignment_model).toBe('flat_pool');
    expect(config.executors[0]).toMatchObject({
      assignment_model: 'flat_pool',
      depends_on: ['prep'],
      touches: ['.opencode/skills/system-deep-loop/runtime/scripts/**'],
    });
  });

  it('accepts wave as a guarded schema value for fan-out and lineages', () => {
    const config = parseFanoutConfig({
      assignment_model: 'wave',
      executors: [{ kind: 'native', label: 'planner', assignment_model: 'wave' }],
    });
    expect(config.assignment_model).toBe('wave');
    expect(config.executors[0].assignment_model).toBe('wave');
  });

  it('honors explicit concurrency, max retries, lag ceiling, heartbeat, count, and per-lineage iterations', () => {
    const config = parseFanoutConfig({
      concurrency: 3,
      maxRetries: 1,
      lagCeilingMs: 50,
      progressHeartbeatSeconds: 0.25,
      executors: [{ kind: 'native', label: 'opus', count: 5, iterations: 5 }],
    });
    expect(config.concurrency).toBe(3);
    expect(config.maxRetries).toBe(1);
    expect(config.lagCeilingMs).toBe(50);
    expect(config.progressHeartbeatSeconds).toBe(0.25);
    expect(config.executors[0].count).toBe(5);
    expect(config.executors[0].iterations).toBe(5);
  });

  it('rejects a negative fan-out retry budget', () => {
    expect(() => parseFanoutConfig({ maxRetries: -1, executors: [{ kind: 'native', label: 'opus' }] })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects negative fan-out observability thresholds', () => {
    expect(() => parseFanoutConfig({ lagCeilingMs: -1, executors: [{ kind: 'native', label: 'opus' }] })).toThrow(
      ExecutorConfigError,
    );
    expect(() => parseFanoutConfig({ progressHeartbeatSeconds: -0.1, executors: [{ kind: 'native', label: 'opus' }] })).toThrow(
      ExecutorConfigError,
    );
  });

  it('reuses per-executor kind validation for retired kinds', () => {
    const retiredKind = ['cli', 'gemini'].join('-');
    expect(() => parseFanoutConfig({ executors: [{ kind: retiredKind, label: 'gpt' }] })).toThrow(ExecutorConfigError);
  });

  it('reuses per-executor flag-support validation (cli-opencode rejects serviceTier)', () => {
    expect(() =>
      parseFanoutConfig({ executors: [{ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', serviceTier: 'fast', label: 'opencode' }] }),
    ).toThrow(ExecutorConfigError);
  });

  it('rejects an empty executors array', () => {
    expect(() => parseFanoutConfig({ executors: [] })).toThrow(ExecutorConfigError);
  });

  it('rejects a label that is not dir-safe', () => {
    expect(() => parseFanoutConfig({ executors: [{ kind: 'native', label: 'Bad Label' }] })).toThrow(ExecutorConfigError);
  });

  it('rejects duplicate lineage labels', () => {
    expect(() =>
      parseFanoutConfig({ executors: [{ kind: 'native', label: 'a' }, { kind: 'native', label: 'a' }] }),
    ).toThrow(ExecutorConfigError);
  });
});

describe('expandLineages', () => {
  it('keeps the base label when count is 1', () => {
    const config = parseFanoutConfig({ executors: [{ kind: 'native', label: 'opus', count: 1 }] });
    expect(expandLineages(config).map((l) => l.label)).toEqual(['opus']);
  });

  it('expands count>1 into numbered single-replica lineages', () => {
    const config = parseFanoutConfig({
      executors: [
        { kind: 'cli-opencode', model: 'minimax-coding-plan/MiniMax-M2.7-highspeed', label: 'minimax', count: 3 },
        { kind: 'native', label: 'opus', count: 2 },
      ],
    });
    const lineages = expandLineages(config);
    expect(lineages.map((l) => l.label)).toEqual(['minimax-1', 'minimax-2', 'minimax-3', 'opus-1', 'opus-2']);
    expect(lineages.every((l) => l.count === 1)).toBe(true);
  });
});
