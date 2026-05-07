import { describe, it, expect } from 'vitest';

import {
  ExecutorConfigError,
  parseExecutorConfig,
  resolveExecutorConfig,
} from '../../lib/deep-loop/executor-config';

describe('executor-config', () => {
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


  it('accepts a cli-gemini executor with a supported model', () => {
    expect(parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview' })).toMatchObject({
      kind: 'cli-gemini',
      model: 'gemini-3.1-pro-preview',
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

  it('rejects serviceTier for cli-gemini because the kind does not support it', () => {
    expect(() =>
      parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview', serviceTier: 'fast' }),
    ).toThrowError(/serviceTier.*not supported by executor kind 'cli-gemini'/);
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

  it('rejects unsupported cli-gemini models with the whitelist message', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-ultra-foo' })).toThrowError(
      /model 'gemini-ultra-foo'.*Supported: gemini-3.1-pro-preview/,
    );
  });

  it('accepts the whitelisted cli-gemini model as a sanity check', () => {
    expect(parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview' })).toMatchObject({
      kind: 'cli-gemini',
      model: 'gemini-3.1-pro-preview',
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // cli-opencode (added in packet 101, hardened in packet 103)
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
