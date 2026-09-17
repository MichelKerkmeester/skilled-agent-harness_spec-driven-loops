// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Engine Command Table Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { CliEngineIds, defaultModelForEngine, resolveCliEngineCommand } from '../../src/transports/index.js';

describe('resolveCliEngineCommand', () => {
  it('resolves a plain-text, prompt-arg command for every engine', () => {
    for (const engine of Object.values(CliEngineIds)) {
      const spec = resolveCliEngineCommand(engine, 'provider/model');
      expect(spec, engine).not.toBeNull();
      if (spec === null) {
        throw new Error(`Expected a command for ${engine}.`);
      }
      expect(spec.input).toBe('prompt-arg');
      expect(spec.command.length).toBeGreaterThan(0);
      expect(spec.args.length).toBeGreaterThan(0);
    }
  });

  it('returns null for an unknown engine', () => {
    expect(resolveCliEngineCommand('not-an-engine', 'x')).toBeNull();
  });

  it('maps claude-code to a headless print command with the gate-free child env', () => {
    const spec = resolveCliEngineCommand(CliEngineIds.CLAUDE_CODE, 'claude-sonnet-4-6');
    expect(spec).toEqual({
      command: 'claude',
      args: ['-p', '--model', 'claude-sonnet-4-6', '--output-format', 'text'],
      input: 'prompt-arg',
      env: { SYSTEM_SPEC_GATE_ENFORCE: '0', AI_SESSION_CHILD: '1' },
    });
  });

  it('maps codex to a read-only exec command', () => {
    const spec = resolveCliEngineCommand(CliEngineIds.CODEX, 'gpt-5.5');
    expect(spec?.command).toBe('codex');
    expect(spec?.args).toEqual([
      'exec', '--model', 'gpt-5.5', '-c', 'approval_policy=never', '--sandbox', 'read-only',
    ]);
    expect(spec?.env).toEqual({ AI_SESSION_CHILD: '1' });
  });

  it('maps cursor to a text-output print command', () => {
    const spec = resolveCliEngineCommand(CliEngineIds.CURSOR, 'composer-2.5');
    expect(spec?.command).toBe('cursor-agent');
    expect(spec?.args).toEqual(['-p', '--output-format', 'text', '--model', 'composer-2.5']);
  });

  it('maps devin to a print command whose prompt follows the argument separator', () => {
    const spec = resolveCliEngineCommand(CliEngineIds.DEVIN, 'swe');
    expect(spec?.command).toBe('devin');
    expect(spec?.args).toEqual(['-p', '--model', 'swe', '--permission-mode', 'accept-edits', '--']);
    expect(spec?.args.at(-1)).toBe('--');
  });

  it('maps opencode to a run command with the gate-free child env', () => {
    const spec = resolveCliEngineCommand(CliEngineIds.OPENCODE, 'deepseek/deepseek-v4-pro');
    expect(spec?.command).toBe('opencode');
    expect(spec?.args).toEqual(['run', '--model', 'deepseek/deepseek-v4-pro']);
    expect(spec?.env).toEqual({ SYSTEM_SPEC_GATE_ENFORCE: '0', AI_SESSION_CHILD: '1' });
  });

  it('derives the pi provider from a provider/model id and defaults to google', () => {
    const scoped = resolveCliEngineCommand(CliEngineIds.PI, 'anthropic/claude');
    expect(scoped?.command).toBe('pi');
    expect(scoped?.args).toEqual([
      '-p', '--offline', '--tools', 'read,grep,find,ls',
      '--provider', 'anthropic', '--model', 'anthropic/claude',
    ]);

    const bare = resolveCliEngineCommand(CliEngineIds.PI, 'gemini-3');
    expect(bare?.args).toEqual([
      '-p', '--offline', '--tools', 'read,grep,find,ls',
      '--provider', 'google', '--model', 'gemini-3',
    ]);
  });
});

describe('defaultModelForEngine', () => {
  it('returns the documented default model for the five engines that have one', () => {
    expect(defaultModelForEngine(CliEngineIds.CLAUDE_CODE)).toBe('claude-sonnet-4-6');
    expect(defaultModelForEngine(CliEngineIds.CODEX)).toBe('gpt-5.5');
    expect(defaultModelForEngine(CliEngineIds.CURSOR)).toBe('composer-2.5');
    expect(defaultModelForEngine(CliEngineIds.DEVIN)).toBe('swe');
    expect(defaultModelForEngine(CliEngineIds.OPENCODE)).toBe('deepseek/deepseek-v4-pro');
  });

  it('returns undefined for pi, which documents no default, and for an unknown engine', () => {
    expect(defaultModelForEngine(CliEngineIds.PI)).toBeUndefined();
    expect(defaultModelForEngine('not-an-engine')).toBeUndefined();
  });
});
