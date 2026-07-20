import { afterEach, describe, it, expect, vi } from 'vitest';

import {
  EXECUTOR_KINDS,
  EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX,
  ExecutorConfigError,
  WEB_SEARCH_POLICIES,
  assertExecutorWebSearchCapability,
  parseExecutorConfig,
  resolveExecutorConfig,
  parseFanoutConfig,
  expandLineages,
  preflightFanoutCapabilities,
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
      liveTools: { webSearch: 'inherit' },
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

  it('accepts cli-codex with its supported execution flags', () => {
    expect(parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.6-codex',
      reasoningEffort: 'xhigh',
      serviceTier: 'fast',
      sandboxMode: 'workspace-write',
    })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.6-codex',
      reasoningEffort: 'xhigh',
      serviceTier: 'fast',
      sandboxMode: 'workspace-write',
    });
  });

  it('accepts ultra as the highest reasoning effort tier (codex gpt-5.6-sol ceiling)', () => {
    expect(parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.6-sol',
      reasoningEffort: 'ultra',
    })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.6-sol',
      reasoningEffort: 'ultra',
    });
  });

  it('rejects configDir for cli-codex', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-codex', configDir: '~/.codex' })).toThrowError(
      /configDir.*not supported by executor kind 'cli-codex'/,
    );
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

describe('executor web-search policy', () => {
  it('normalizes omission to inherit and accepts every typed policy value', () => {
    expect(parseExecutorConfig({ kind: 'native' }).liveTools).toEqual({ webSearch: 'inherit' });
    for (const webSearch of WEB_SEARCH_POLICIES) {
      expect(parseExecutorConfig({
        kind: 'cli-codex',
        model: 'gpt-5.6-codex',
        liveTools: { webSearch },
      }).liveTools.webSearch).toBe(webSearch);
    }
  });

  it('rejects an unknown policy without weakening existing field-support checks', () => {
    expect(() => parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.6-codex',
      liveTools: { webSearch: 'training-data' },
    })).toThrow(ExecutorConfigError);
    expect(() => parseExecutorConfig({ kind: 'native', model: 'still-unsupported' })).toThrowError(
      /model.*not supported by executor kind 'native'/,
    );
  });

  it('declares every executor-kind by policy cell explicitly', () => {
    expect(Object.keys(EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX)).toEqual([...EXECUTOR_KINDS]);
    for (const kind of EXECUTOR_KINDS) {
      expect(Object.keys(EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX[kind])).toEqual([...WEB_SEARCH_POLICIES]);
    }
    expect(EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX).toEqual({
      native: { inherit: true, disabled: false, cached: false, live: false },
      'cli-codex': { inherit: true, disabled: true, cached: false, live: true },
      'cli-claude-code': { inherit: true, disabled: false, cached: false, live: false },
      'cli-opencode': { inherit: true, disabled: false, cached: false, live: true },
    });
  });

  it('keeps cached typed but rejects it through capability preflight', () => {
    const config = parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.6-codex',
      liveTools: { webSearch: 'cached' },
    });
    expect(config.liveTools.webSearch).toBe('cached');
    expect(() => assertExecutorWebSearchCapability(config)).toThrowError(
      /policy 'cached'.*not supported by executor kind 'cli-codex'/,
    );
  });

  it('preflights the complete matrix after lineage expansion', () => {
    for (const kind of EXECUTOR_KINDS) {
      for (const webSearch of WEB_SEARCH_POLICIES) {
        const model = kind === 'native' ? null : `${kind}-model`;
        const config = parseFanoutConfig({
          executors: [{ kind, model, label: `${kind.replaceAll('cli-', '')}-${webSearch}`, liveTools: { webSearch } }],
        });
        const lineages = expandLineages(config);
        if (EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX[kind][webSearch]) {
          expect(() => preflightFanoutCapabilities(lineages)).not.toThrow();
        } else {
          expect(() => preflightFanoutCapabilities(lineages)).toThrow(ExecutorConfigError);
        }
      }
    }
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

  it('accepts cli-codex as a fan-out lineage', () => {
    const config = parseFanoutConfig({
      executors: [{ kind: 'cli-codex', model: 'gpt-5.6-codex', label: 'codex' }],
    });
    expect(config.executors[0]).toMatchObject({ kind: 'cli-codex', model: 'gpt-5.6-codex' });
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

describe('fan-out schema hard ceilings', () => {
  function manyNativeExecutors(count: number) {
    return Array.from({ length: count }, (_, index) => ({ kind: 'native' as const, label: `seat-${index}` }));
  }

  it('rejects concurrency above the hard max of 8', () => {
    expect(() =>
      parseFanoutConfig({ concurrency: 9, executors: [{ kind: 'native', label: 'opus' }] }),
    ).toThrow(ExecutorConfigError);
  });

  it('accepts concurrency at the hard max of 8', () => {
    expect(
      parseFanoutConfig({ concurrency: 8, executors: [{ kind: 'native', label: 'opus' }] }).concurrency,
    ).toBe(8);
  });

  it('rejects maxRetries above the hard max of 5', () => {
    expect(() =>
      parseFanoutConfig({ maxRetries: 6, executors: [{ kind: 'native', label: 'opus' }] }),
    ).toThrow(ExecutorConfigError);
  });

  it('accepts maxRetries at the hard max of 5', () => {
    expect(
      parseFanoutConfig({ maxRetries: 5, executors: [{ kind: 'native', label: 'opus' }] }).maxRetries,
    ).toBe(5);
  });

  it('rejects a per-lineage count above the hard max of 16', () => {
    expect(() =>
      parseFanoutConfig({ executors: [{ kind: 'native', label: 'opus', count: 17 }] }),
    ).toThrow(ExecutorConfigError);
  });

  it('accepts a per-lineage count at the hard max of 16', () => {
    expect(
      parseFanoutConfig({ executors: [{ kind: 'native', label: 'opus', count: 16 }] }).executors[0].count,
    ).toBe(16);
  });

  it('rejects more than 16 executors in a single fan-out block', () => {
    expect(() => parseFanoutConfig({ executors: manyNativeExecutors(17) })).toThrow(ExecutorConfigError);
  });

  it('accepts exactly 16 executors in a single fan-out block', () => {
    expect(parseFanoutConfig({ executors: manyNativeExecutors(16) }).executors).toHaveLength(16);
  });

  it('rejects a lag ceiling above the hard max of 5 minutes', () => {
    expect(() =>
      parseFanoutConfig({ lagCeilingMs: 300_001, executors: [{ kind: 'native', label: 'opus' }] }),
    ).toThrow(ExecutorConfigError);
  });

  it('accepts a lag ceiling at the hard max of 5 minutes', () => {
    expect(
      parseFanoutConfig({ lagCeilingMs: 300_000, executors: [{ kind: 'native', label: 'opus' }] }).lagCeilingMs,
    ).toBe(300_000);
  });

  it('rejects a zero lag ceiling because stall/lag detection is non-disableable in autonomous mode', () => {
    expect(() =>
      parseFanoutConfig({ lagCeilingMs: 0, executors: [{ kind: 'native', label: 'opus' }] }),
    ).toThrow(ExecutorConfigError);
  });

  it('rejects timeoutSeconds above the hard max of 3600 on a single executor', () => {
    expect(() =>
      parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', timeoutSeconds: 3601 }),
    ).toThrow(ExecutorConfigError);
  });

  it('accepts timeoutSeconds at the hard max of 3600 on a single executor', () => {
    expect(
      parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', timeoutSeconds: 3600 }).timeoutSeconds,
    ).toBe(3600);
  });

  it('rejects timeoutSeconds above the hard max of 3600 on a fan-out lineage', () => {
    expect(() =>
      parseFanoutConfig({
        executors: [{ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', label: 'opus', timeoutSeconds: 3601 }],
      }),
    ).toThrow(ExecutorConfigError);
  });

  it('accepts a fan-out config that sits exactly at every new ceiling at once', () => {
    const config = parseFanoutConfig({
      concurrency: 8,
      maxRetries: 5,
      lagCeilingMs: 300_000,
      executors: [
        {
          kind: 'cli-opencode',
          model: 'opencode-go/glm-5.1',
          label: 'opus',
          count: 16,
          timeoutSeconds: 3600,
        },
      ],
    });
    expect(config).toMatchObject({
      concurrency: 8,
      maxRetries: 5,
      lagCeilingMs: 300_000,
    });
    expect(config.executors[0]).toMatchObject({ count: 16, timeoutSeconds: 3600 });
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

  it('expands models by branches by replicas in stable model-first order', () => {
    const manifest = {
      models: [
        { id: 'sol', kind: 'cli-codex' as const, model: 'gpt-5.6-sol', liveTools: { webSearch: 'live' as const } },
        { id: 'glm', kind: 'cli-opencode' as const, model: 'zai-coding-plan/glm-5.2', liveTools: { webSearch: 'live' as const } },
      ],
      branches: [{ id: 'discover' }, { id: 'challenge' }, { id: 'synthesize' }],
      replicas: 2,
    };
    const first = expandLineages(parseFanoutConfig(manifest));
    const second = expandLineages(parseFanoutConfig(manifest));

    expect(first).toHaveLength(12);
    expect(first.map((lineage) => lineage.label)).toEqual([
      'discover-sol-r1', 'discover-sol-r2',
      'challenge-sol-r1', 'challenge-sol-r2',
      'synthesize-sol-r1', 'synthesize-sol-r2',
      'discover-glm-r1', 'discover-glm-r2',
      'challenge-glm-r1', 'challenge-glm-r2',
      'synthesize-glm-r1', 'synthesize-glm-r2',
    ]);
    expect(second).toEqual(first);
    expect(new Set(first.map((lineage) => lineage.label)).size).toBe(12);
    expect(first.every((lineage) => lineage.count === 1)).toBe(true);
  });

  it('keeps the legacy executors and count expansion byte-stable apart from the normalized policy default', () => {
    const config = parseFanoutConfig({
      executors: [
        { kind: 'cli-opencode', model: 'opencode-go/glm-5.1', label: 'glm', count: 2 },
        { kind: 'native', label: 'native', count: 1 },
      ],
    });
    const lineages = expandLineages(config);
    expect(lineages.map(({ label, kind, model, count }) => ({ label, kind, model, count }))).toEqual([
      { label: 'glm-1', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
      { label: 'glm-2', kind: 'cli-opencode', model: 'opencode-go/glm-5.1', count: 1 },
      { label: 'native', kind: 'native', model: null, count: 1 },
    ]);
    expect(lineages.every((lineage) => lineage.liveTools.webSearch === 'inherit')).toBe(true);
  });

  it('rejects mixed forms, duplicate or invalid ids, compiled collisions, and oversized products', () => {
    expect(() => parseFanoutConfig({
      executors: [{ kind: 'native', label: 'legacy' }],
      models: [{ id: 'native', kind: 'native' }],
      branches: [{ id: 'branch' }],
      replicas: 1,
    })).toThrow(ExecutorConfigError);
    expect(() => parseFanoutConfig({
      models: [{ id: 'same', kind: 'native' }, { id: 'same', kind: 'native' }],
      branches: [{ id: 'branch' }],
      replicas: 1,
    })).toThrowError(/duplicate model id 'same'/);
    expect(() => parseFanoutConfig({
      models: [{ id: 'model', kind: 'native' }],
      branches: [{ id: 'Bad Branch' }],
      replicas: 1,
    })).toThrow(ExecutorConfigError);
    expect(() => parseFanoutConfig({
      models: [{ id: 'c', kind: 'native' }, { id: 'b-c', kind: 'native' }],
      branches: [{ id: 'a-b' }, { id: 'a' }],
      replicas: 1,
    })).toThrowError(/compiled lineage label 'a-b-c-r1' collides/);
    expect(() => parseFanoutConfig({
      models: Array.from({ length: 16 }, (_, index) => ({ id: `model-${index}`, kind: 'native' })),
      branches: Array.from({ length: 16 }, (_, index) => ({ id: `branch-${index}` })),
      replicas: 2,
    })).toThrowError(/expands to 512 lineages; maximum is 256/);
  });
});
