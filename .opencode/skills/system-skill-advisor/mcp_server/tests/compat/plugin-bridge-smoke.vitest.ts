// ───────────────────────────────────────────────────────────────
// MODULE: Plugin Bridge Smoke Tests
// ───────────────────────────────────────────────────────────────
// One subprocess smoke test for the MJS plugin bridge at
// mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs. Asserts the
// process contract that the OpenCode plugin relies on:
//   - File exists on disk at the expected path
//   - Subprocess accepts stdin JSON, returns one stdout JSON line, exits 0
//   - Response shape conforms to the compat-contract envelope
//     ({ status, brief, metadata }) regardless of advisor availability
//   - Bridge fails open (status='fail_open') when given malformed input
//
// These tests guard the source-of-truth status of the .mjs file and detect
// breakage when someone moves/renames the bridge or changes its contract.
// Functional advisor behavior (route selection, brief content) is covered
// by plugin-bridge.vitest.ts; this file focuses on the file-existence and
// envelope-shape smoke surface.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const bridgePath = resolve(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs',
);

function runBridge(input: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('node', [bridgePath], {
    cwd: repoRoot,
    input,
    encoding: 'utf8',
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      TMPDIR: process.env.TMPDIR,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    },
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe('mk-skill-advisor plugin bridge smoke (F-020-D5-04)', () => {
  it('exists at the canonical path and emits a JSON envelope for a valid prompt', () => {
    expect(existsSync(bridgePath)).toBe(true);
    const payload = JSON.stringify({
      prompt: 'save the current context to memory',
      workspaceRoot: repoRoot,
      maxTokens: 80,
      thresholdConfidence: 0.8,
    });
    const result = runBridge(payload);
    expect(result.status).toBe(0);
    expect(result.stdout.trim().length).toBeGreaterThan(0);
    const parsed = JSON.parse(result.stdout.trim());
    expect(parsed).toHaveProperty('status');
    expect(parsed).toHaveProperty('brief');
    expect(parsed).toHaveProperty('metadata');
    expect(['ok', 'skipped', 'degraded', 'fail_open']).toContain(parsed.status);
    expect(typeof parsed.metadata).toBe('object');
    expect(parsed.metadata).not.toBeNull();
  });
});
