// ───────────────────────────────────────────────────────────────
// TEST: Runtime Detection
// ───────────────────────────────────────────────────────────────
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    existsSync: mocks.existsSync,
    readFileSync: mocks.readFileSync,
  };
});

import {
  detectRuntime,
  areHooksAvailable,
  getRecoveryApproach,
  type RuntimeId,
  type HookPolicy,
} from '../lib/runtime-detection.js';

describe('runtime-detection / detectRuntime', () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (
        key.startsWith('CLAUDE_')
        || key === 'COPILOT_CLI'
        || key === 'GITHUB_COPILOT_TOKEN'
        || key === 'OPENAI_API_KEY'
        || key === 'MCP_SERVER_NAME'
      ) {
        delete process.env[key];
      }
    }
    mocks.existsSync.mockReturnValue(false);
    mocks.readFileSync.mockReturnValue('[]');
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(envBackup)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('detects Claude Code via CLAUDE_CODE=1', () => {
    process.env.CLAUDE_CODE = '1';
    const info = detectRuntime();
    expect(info.runtime).toBe('claude-code');
    expect(info.hookPolicy).toBe('enabled');
  });

  it('detects Claude Code via CLAUDE_SESSION_ID', () => {
    process.env.CLAUDE_SESSION_ID = 'abc123';
    const info = detectRuntime();
    expect(info.runtime).toBe('claude-code');
  });

  it('detects Claude Code via MCP_SERVER_NAME=context-server', () => {
    process.env.MCP_SERVER_NAME = 'context-server';
    const info = detectRuntime();
    expect(info.runtime).toBe('claude-code');
  });

  it('detects Copilot CLI via COPILOT_CLI=1', () => {
    process.env.COPILOT_CLI = '1';
    mocks.existsSync.mockReturnValue(false);
    const info = detectRuntime();
    expect(info.runtime).toBe('copilot-cli');
    expect(info.hookPolicy).toBe('disabled_by_scope');
  });

  it('detects Copilot CLI via GITHUB_COPILOT_TOKEN', () => {
    process.env.GITHUB_COPILOT_TOKEN = 'ghp_token';
    mocks.existsSync.mockReturnValue(false);
    const info = detectRuntime();
    expect(info.runtime).toBe('copilot-cli');
    expect(info.hookPolicy).toBe('disabled_by_scope');
  });

  it('returns unknown when no runtime env vars are set', () => {
    const info = detectRuntime();
    expect(info.runtime).toBe('unknown');
    expect(info.hookPolicy).toBe('unknown');
  });

  it('copilot-cli returns enabled when wrapper parity is detected', () => {
    process.env.COPILOT_CLI = '1';
    mocks.existsSync.mockReturnValue(true);
    mocks.readFileSync.mockReturnValue(JSON.stringify({
      hooks: {
        UserPromptSubmit: [
          { type: 'command', bash: '/hooks/copilot/user-prompt-submit.js arg', timeoutSec: 30 },
        ],
        SessionStart: [
          { type: 'command', bash: '/hooks/copilot/session-prime.js', timeoutSec: 10 },
        ],
      },
    }));
    const info = detectRuntime();
    expect(info.runtime).toBe('copilot-cli');
    expect(info.hookPolicy).toBe('enabled');
  });
});

describe('runtime-detection / areHooksAvailable', () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (
        key.startsWith('CLAUDE_')
        || key.startsWith('OPENCODE_')
        || key === 'COPILOT_CLI'
        || key === 'GITHUB_COPILOT_TOKEN'
        || key === 'OPENAI_API_KEY'
        || key === 'MCP_SERVER_NAME'
      ) {
        delete process.env[key];
      }
    }
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(envBackup)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('returns true when hooks are enabled (Claude)', () => {
    process.env.CLAUDE_SESSION_ID = 'abc123';
    expect(areHooksAvailable()).toBe(true);
  });

  it('returns false when runtime is unknown', () => {
    expect(areHooksAvailable()).toBe(false);
  });
});

describe('runtime-detection / getRecoveryApproach', () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (
        key.startsWith('CLAUDE_')
        || key.startsWith('OPENCODE_')
        || key === 'COPILOT_CLI'
        || key === 'GITHUB_COPILOT_TOKEN'
        || key === 'OPENAI_API_KEY'
        || key === 'MCP_SERVER_NAME'
      ) {
        delete process.env[key];
      }
    }
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(envBackup)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('returns hooks when hooks are available', () => {
    process.env.CLAUDE_SESSION_ID = 'abc123';
    expect(getRecoveryApproach()).toBe('hooks');
  });

  it('returns tool_fallback when hooks are not available', () => {
    expect(getRecoveryApproach()).toBe('tool_fallback');
  });
});
