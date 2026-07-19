// ───────────────────────────────────────────────────────────────
// TEST: Cross-Runtime Fallback
// ───────────────────────────────────────────────────────────────
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect, afterEach } from 'vitest';
import { createRuntimeFixture, setRuntimeEnv, clearRuntimeEnv } from './fixtures/runtime-fixtures.js';
import { detectRuntime, areHooksAvailable, getRecoveryApproach } from '../lib/runtime-detection.js';

const ORIGINAL_CWD = process.cwd();
let copilotFixtureDir: string | null = null;

function seedCopilotCliFixture(): void {
  copilotFixtureDir = mkdtempSync(join(tmpdir(), 'copilot-cli-fixture-'));
  mkdirSync(join(copilotFixtureDir, '.claude'), { recursive: true });
  writeFileSync(join(copilotFixtureDir, '.claude', 'settings.local.json'), JSON.stringify({
    hooks: {
      UserPromptSubmit: [{ matcher: '', hooks: [{ type: 'command', command: 'node /hooks/copilot/user-prompt-submit.js', timeout: 3 }] }],
      SessionStart:     [{ matcher: '', hooks: [{ type: 'command', command: 'node /hooks/copilot/session-prime.js',        timeout: 3 }] }],
    },
  }));
  process.chdir(copilotFixtureDir);
}

function clearCopilotCliFixture(): void {
  if (copilotFixtureDir) {
    process.chdir(ORIGINAL_CWD);
    rmSync(copilotFixtureDir, { recursive: true, force: true });
    copilotFixtureDir = null;
  }
}

const CANONICAL_RUNTIME_HOOK_VOCABULARY = {
  'claude-code': {
    prompt: 'UserPromptSubmit',
    lifecycle: 'SessionStart',
    compaction: 'PreCompact',
    stop: 'Stop',
  },
  'copilot-cli': {
    prompt: 'UserPromptSubmit',
    lifecycle: 'SessionStart',
    compaction: null,
    stop: null,
  },
} as const;

describe('cross-runtime fallback', () => {
  afterEach(() => {
    clearCopilotCliFixture();
    clearRuntimeEnv();
  });

  describe('each runtime gets correct recovery approach', () => {
    const runtimes = ['claude-code', 'copilot-cli'] as const;
    for (const runtime of runtimes) {
      it(`${runtime} has correct fixture`, () => {
        const fixture = createRuntimeFixture(runtime);
        expect(fixture.runtime).toBe(runtime);
        expect(fixture.supports.toolFallback).toBe(true);
      });

      it(`${runtime} detection matches fixture`, () => {
        if (runtime === 'copilot-cli') {
          seedCopilotCliFixture();
        }
        setRuntimeEnv(runtime);
        const detected = detectRuntime();
        const fixture = createRuntimeFixture(runtime);
        expect(detected.runtime).toBe(fixture.runtime);
        expect(detected.hookPolicy).toBe(fixture.hookPolicy);
      });
    }
  });

  describe('tool fallback available for all runtimes', () => {
    it('all runtimes support tool fallback', () => {
      for (const rt of ['claude-code', 'copilot-cli'] as const) {
        expect(createRuntimeFixture(rt).supports.toolFallback).toBe(true);
      }
    });
  });

  describe('hook-based recovery for configured runtimes', () => {
    it('claude-code uses hooks', () => {
      setRuntimeEnv('claude-code');
      expect(getRecoveryApproach()).toBe('hooks');
    });
    it('copilot-cli uses hooks when repo hook config is present', () => {
      seedCopilotCliFixture();
      setRuntimeEnv('copilot-cli');
      expect(getRecoveryApproach()).toBe('hooks');
    });
  });

  describe('6-scenario test matrix (iter 015)', () => {
    // Scenario 1: Claude Code with hooks enabled
    it('claude-code with hooks enabled: hookPolicy is enabled, areHooksAvailable true, recovery is hooks', () => {
      setRuntimeEnv('claude-code');
      const detected = detectRuntime();
      expect(detected.hookPolicy).toBe('enabled');
      expect(areHooksAvailable()).toBe(true);
      expect(getRecoveryApproach()).toBe('hooks');
    });

    // Scenario 2: Claude Code with hooks disabled (no CLAUDE_CODE env set)
    it('no runtime env set: areHooksAvailable false, recovery is tool_fallback', () => {
      clearRuntimeEnv();
      expect(areHooksAvailable()).toBe(false);
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });

    // Scenario 3: Copilot CLI
    it('copilot-cli: runtime is copilot-cli, hookPolicy is enabled, recovery is hooks when repo hook config exists', () => {
      seedCopilotCliFixture();
      setRuntimeEnv('copilot-cli');
      const detected = detectRuntime();
      expect(detected.runtime).toBe('copilot-cli');
      expect(detected.hookPolicy).toBe('enabled');
      expect(getRecoveryApproach()).toBe('hooks');
    });

    // Scenario 4: Unknown runtime
    it('unknown runtime: runtime is unknown, hookPolicy is unknown, recovery is tool_fallback', () => {
      clearRuntimeEnv();
      const detected = detectRuntime();
      expect(detected.runtime).toBe('unknown');
      expect(detected.hookPolicy).toBe('unknown');
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });

    // Scenario 5: Runtime detection failure — graceful degradation
    it('runtime detection failure: detectRuntime does not throw, returns valid RuntimeInfo, recovery is tool_fallback', () => {
      clearRuntimeEnv();
      let detected: ReturnType<typeof detectRuntime> | undefined;
      expect(() => { detected = detectRuntime(); }).not.toThrow();
      expect(detected).toBeDefined();
      expect(detected!.runtime).toBeDefined();
      expect(detected!.hookPolicy).toBeDefined();
      expect(getRecoveryApproach()).toBe('tool_fallback');
    });
  });
});
