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
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    });
  });

  it('defaults to native when given an empty object', () => {
    expect(parseExecutorConfig({})).toMatchObject({
      kind: 'native',
      timeoutSeconds: 900,
    });
  });

  it('accepts a wired cli-codex executor with a model', () => {
    expect(parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.4',
    });
  });

  it('accepts deprecated executor type as an alias for kind and logs a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(parseExecutorConfig({ type: 'cli-codex', model: 'gpt-5.4' })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.4',
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Deprecated executor field 'type'"));
  });

  it('rejects conflicting deprecated type and canonical kind values', () => {
    expect(() => parseExecutorConfig({ type: 'native', kind: 'cli-codex', model: 'gpt-5.4' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects cli-codex when model is null', () => {
    try {
      parseExecutorConfig({ kind: 'cli-codex', model: null });
      throw new Error('Expected parseExecutorConfig to throw');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ExecutorConfigError);
      if (error instanceof ExecutorConfigError) {
        expect(error.issues).toContainEqual({
          path: ['model'],
          message: 'model is required when kind is cli-codex',
        });
      }
    }
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

  it('rejects unknown executor kinds', () => {
    expect(() => parseExecutorConfig({ kind: 'mystery-cli', model: 'x' })).toThrow(ExecutorConfigError);
  });

  it('rejects unknown reasoning effort values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', reasoningEffort: 'super' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects unknown service tier values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', serviceTier: 'slow' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects non-positive timeout values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', timeoutSeconds: 0 })).toThrow(
      ExecutorConfigError,
    );
  });

  it('defaults timeoutSeconds to 900 when not specified', () => {
    expect(parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' }).timeoutSeconds).toBe(900);
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

  it('rejects sandboxMode for cli-opencode because the kind does not support read-only', () => {
    expect(() =>
      parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/qwen3.6-plus', sandboxMode: 'read-only' }),
    ).toThrowError(/sandboxMode.*not supported by executor kind 'cli-opencode'/);
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
    expect(resolveExecutorConfig({ cli: { kind: 'cli-codex', model: 'gpt-5.4' }, file: { kind: 'native' } })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.4',
    });
  });

  it('uses file values when CLI values are absent', () => {
    expect(resolveExecutorConfig({ cli: {}, file: { kind: 'cli-codex', model: 'gpt-5.4' } })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.4',
    });
  });

  it('rejects resolving a CLI model onto the default native kind because native supports no model flag', () => {
    expect(() => resolveExecutorConfig({ cli: { model: 'x' } })).toThrowError(
      /model.*not supported by executor kind 'native'/,
    );
  });

  it('rejects a resolved cli-codex config when no model is available from any source', () => {
    expect(() => resolveExecutorConfig({ cli: { kind: 'cli-codex' } })).toThrow(ExecutorConfigError);
  });
});

describe('parseFanoutConfig', () => {
  it('accepts a multi-executor fan-out config with defaults', () => {
    const config = parseFanoutConfig({
      executors: [
        { kind: 'native', label: 'opus' },
        { kind: 'cli-codex', model: 'gpt-5.4', label: 'gpt' },
      ],
    });
    expect(config.executors).toHaveLength(2);
    expect(config.concurrency).toBe(2);
    expect(config.executors[0].count).toBe(1);
    expect(config.executors[0].iterations).toBeNull();
  });

  it('honors explicit concurrency, count, and per-lineage iterations', () => {
    const config = parseFanoutConfig({
      concurrency: 3,
      executors: [{ kind: 'native', label: 'opus', count: 5, iterations: 5 }],
    });
    expect(config.concurrency).toBe(3);
    expect(config.executors[0].count).toBe(5);
    expect(config.executors[0].iterations).toBe(5);
  });

  it('reuses per-executor kind validation (cli-codex requires model)', () => {
    expect(() => parseFanoutConfig({ executors: [{ kind: 'cli-codex', label: 'gpt' }] })).toThrow(ExecutorConfigError);
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
