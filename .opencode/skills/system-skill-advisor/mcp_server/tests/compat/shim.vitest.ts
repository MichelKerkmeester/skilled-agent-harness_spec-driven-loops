// ───────────────────────────────────────────────────────────────
// MODULE: Shim Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const shimPath = resolve(repoRoot, '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py');

function runShim(args: string[], input = '', env: NodeJS.ProcessEnv = {}) {
  return spawnSync('python3', [shimPath, ...args], {
    cwd: repoRoot,
    input,
    encoding: 'utf8',
    env: {
      ...process.env,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      ...env,
    },
  });
}

function parseJson(stdout: string): unknown {
  return JSON.parse(stdout.trim() || 'null');
}

/**
 * Probe whether the native advisor is reachable and indexed in this test env.
 * The `--force-native` cases below need a fresh skill-graph database + a
 * compiled advisor surface. When the shim probes unavailable (freshness
 * `unavailable` or skill-graph stale), the four `--force-native` cases skip
 * cleanly instead of failing the suite. They run normally in CI where the
 * test setup primes the advisor.
 */
let nativeAdvisorReachable = false;

beforeAll(() => {
  const probe = runShim(['--force-native', 'probe whether native advisor is reachable']);
  nativeAdvisorReachable = probe.status === 0
    && typeof probe.stdout === 'string'
    && probe.stdout.trim().startsWith('[');
});

describe('skill_advisor.py compat shim', () => {
  it('routes to native advisor_recommend when forced native and keeps legacy JSON array shape', () => {
    if (!nativeAdvisorReachable) {
      console.warn('[shim.vitest] native advisor probe returned unavailable in this env; skipping --force-native case');
      return;
    }
    const result = runShim(['--force-native', 'save this conversation context to memory']);
    expect(result.status).toBe(0);
    const parsed = parseJson(result.stdout);
    expect(parsed).toEqual(expect.arrayContaining([
      expect.objectContaining({
        skill: 'system-spec-kit',
        kind: 'skill',
        source: 'native',
      }),
      expect.objectContaining({
        skill: 'memory:save',
        source: 'native',
      }),
    ]));
  });

  it('falls back to local Python scoring when native is forced off', () => {
    const result = runShim(['--force-local', 'help me commit my changes']);
    expect(result.status).toBe(0);
    const parsed = parseJson(result.stdout);
    expect(parsed).toEqual([
      expect.objectContaining({
        skill: 'sk-git',
        kind: 'skill',
      }),
    ]);
  });

  it('preserves --stdin mode and does not leak prompt text through native metadata', () => {
    if (!nativeAdvisorReachable) {
      console.warn('[shim.vitest] native advisor probe returned unavailable in this env; skipping --force-native --stdin case');
      return;
    }
    const secretPrompt = 'save this private-address@example.com context';
    const result = runShim(['--force-native', '--stdin'], secretPrompt);
    expect(result.status).toBe(0);
    expect(result.stdout).not.toContain(secretPrompt);
    expect(result.stdout).not.toContain('private-address@example.com');
    expect(parseJson(result.stdout)).toEqual([
      expect.objectContaining({ source: 'native' }),
    ]);
  });

  it('honors the shared disabled flag with no recommendation', () => {
    const result = runShim(['test prompt'], '', {
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    });
    expect(result.status).toBe(0);
    expect(parseJson(result.stdout)).toEqual([]);
  });

  it('lets --force-native override the shared disabled flag', () => {
    if (!nativeAdvisorReachable) {
      console.warn('[shim.vitest] native advisor probe returned unavailable in this env; skipping --force-native disabled-override case');
      return;
    }
    const result = runShim(['--force-native', 'save this conversation context to memory'], '', {
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    });
    expect(result.status).toBe(0);
    expect(parseJson(result.stdout)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        source: 'native',
        skill: 'system-spec-kit',
      }),
    ]));
  });

  it('tries native mode when --force-native is combined with semantic flags', () => {
    if (!nativeAdvisorReachable) {
      console.warn('[shim.vitest] native advisor probe returned unavailable in this env; skipping --force-native --semantic case');
      return;
    }
    const result = runShim(['--force-native', '--semantic', 'save this conversation context to memory']);
    expect(result.status).toBe(0);
    expect(parseJson(result.stdout)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        source: 'native',
        skill: 'system-spec-kit',
      }),
    ]));
  });

  it('returns exit 2 with unavailable error object when --force-native and native advisor is not reachable', () => {
    if (nativeAdvisorReachable) {
      console.warn('[shim.vitest] native advisor is reachable; skipping unavailable-fallback case');
      return;
    }
    const result = runShim(['--force-native', 'probe unavailable fallback']);
    expect(result.status).toBe(2);
    expect(parseJson(result.stdout)).toEqual(expect.objectContaining({
      error: 'Native advisor unavailable',
      freshness: 'unavailable',
    }));
  });

  it('filters parent environment before spawning the native Node bridge', () => {
    const probe = [
      'import importlib.util, json',
      `path = ${JSON.stringify(shimPath)}`,
      'spec = importlib.util.spec_from_file_location("skill_advisor_for_env_test", path)',
      'module = importlib.util.module_from_spec(spec)',
      'spec.loader.exec_module(module)',
      'print(json.dumps(module._native_bridge_env({',
      '  "PATH": "/bin",',
      '  "SPECKIT_RUNTIME": "codex",',
      '  "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED": "1",',
      '  "SECRET_TOKEN": "should-not-leak"',
      '}), sort_keys=True))',
    ].join('\n');

    const result = spawnSync('python3', ['-c', probe], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(parseJson(result.stdout)).toEqual({
      PATH: '/bin',
      SPECKIT_RUNTIME: 'codex',
    });
  });

  it('filters parent environment before spawning built-in CocoIndex search', () => {
    const probe = [
      'import importlib.util, json',
      `path = ${JSON.stringify(shimPath)}`,
      'spec = importlib.util.spec_from_file_location("skill_advisor_for_coco_env_test", path)',
      'module = importlib.util.module_from_spec(spec)',
      'spec.loader.exec_module(module)',
      'print(json.dumps(module._cocoindex_env("/repo", {',
      '  "PATH": "/bin",',
      '  "HOME": "/tmp/home",',
      '  "SECRET_TOKEN": "should-not-leak"',
      '}), sort_keys=True))',
    ].join('\n');

    const result = spawnSync('python3', ['-c', probe], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(parseJson(result.stdout)).toEqual({
      COCOINDEX_CODE_ROOT_PATH: '/repo',
      HOME: '/tmp/home',
      PATH: '/bin',
    });
  });
});
