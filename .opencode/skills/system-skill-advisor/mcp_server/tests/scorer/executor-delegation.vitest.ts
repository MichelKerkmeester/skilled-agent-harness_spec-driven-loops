// ───────────────────────────────────────────────────────────────
// MODULE: Executor Delegation Resolver Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import {
  buildExecutorAliasTable,
  resolveExecutorDelegation,
} from '../../lib/scorer/executor-delegation.js';
import { loadAdvisorProjection } from '../../lib/scorer/projection.js';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

// A strict abstention (no passing recommendation) is the sentinel "none" on both
// engines so parity comparison stays apples-to-apples with the shared fixture.
const NONE = 'none';

// The Python parity step is required by default. Set
// SPECKIT_PARITY_REQUIRE_PYTHON=0 only in a genuinely python-less environment.
const REQUIRE_PYTHON = process.env.SPECKIT_PARITY_REQUIRE_PYTHON !== '0';

interface DelegationCase {
  readonly id: string;
  readonly prompt: string;
  readonly expectedTop: string;
  readonly branch: string;
}

interface DelegationFixture {
  readonly version: number;
  readonly cases: readonly DelegationCase[];
}

interface PythonRow {
  readonly prompt: string;
  readonly top: string | null;
}

function findWorkspaceRoot(): string {
  const start = dirname(fileURLToPath(import.meta.url));
  const sentinel = '.opencode/skills/system-spec-kit/SKILL.md';
  const candidate = findAdvisorWorkspaceRoot(start, { maxDepth: 12, sentinel });
  if (!existsSync(resolve(candidate, sentinel))) {
    throw new Error('Unable to locate workspace root.');
  }
  return candidate;
}

const WORKSPACE_ROOT = findWorkspaceRoot();
const FIXTURE_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../parity/fixtures/executor-delegation-cases.json',
);

function loadFixture(): DelegationFixture {
  return JSON.parse(readFileSync(FIXTURE_PATH, 'utf8')) as DelegationFixture;
}

// Freeze the native ranking env so the TS top-1 is deterministic across
// machines/CI (lane-weight and lexical-shadow overrides would otherwise shift
// ranking). Done before any scoreAdvisorPrompt call.
function freezeNativeEnv(): void {
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
}

function nativeTop(prompt: string): string {
  return scoreAdvisorPrompt(prompt, { workspaceRoot: WORKSPACE_ROOT }).topSkill ?? NONE;
}

function pythonReachable(): boolean {
  const probe = spawnSync('python3', ['-c', 'import sys; print(sys.version)'], { encoding: 'utf8' });
  return !probe.error && probe.status === 0;
}

// Local (Python) strict top-1 for every prompt in one subprocess. Mirrors the
// python-subprocess pattern in the parity/ratchet suites: importlib-load
// skill_advisor.py, read JSON prompts from stdin, print JSON [{prompt, top}].
function runPython(prompts: readonly string[]): PythonRow[] {
  const script = `
import importlib.util, json, os, sys
workspace = sys.argv[1]
path = os.path.join(workspace, '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor', path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
prompts = json.loads(sys.stdin.read())
out = []
for prompt in prompts:
    recs = mod.analyze_prompt(prompt=prompt, confidence_threshold=0.8, uncertainty_threshold=0.35, confidence_only=False, show_rejections=False)
    out.append({'prompt': prompt, 'top': recs[0]['skill'] if recs else None})
print(json.dumps(out))
`;
  const result = spawnSync('python3', ['-c', script, WORKSPACE_ROOT], {
    input: JSON.stringify(prompts),
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      SPECKIT_SKILL_ADVISOR_FORCE_LOCAL: '1',
    },
    maxBuffer: 1024 * 1024 * 16,
  });
  if (result.error || result.status !== 0) {
    const detail = result.error ? String(result.error) : (result.stderr || result.stdout);
    throw new Error(`Local Python scorer failed (exit ${result.status}). Detail: ${detail}`);
  }
  return JSON.parse(result.stdout) as PythonRow[];
}

describe('executor-delegation resolver (pure detector)', () => {
  freezeNativeEnv();
  const table = buildExecutorAliasTable(loadAdvisorProjection(WORKSPACE_ROOT), WORKSPACE_ROOT);

  it('routes a direct executor alias to its executor', () => {
    const decision = resolveExecutorDelegation(
      'use cli-opencode to delegate this coding task through opencode cli.',
      table,
    );
    expect(decision).not.toBeNull();
    expect(decision?.action).toBe('route');
    expect(decision?.executorSkillId).toBe('cli-opencode');
  });

  it('routes a direct model alias to its executor', () => {
    const decision = resolveExecutorDelegation('dispatch this to minimax-m3', table);
    expect(decision?.action).toBe('route');
    expect(decision?.executorSkillId).toBe('cli-opencode');
  });

  it('routes an orchestrator noun co-occurring with a delegation cue', () => {
    const decision = resolveExecutorDelegation(
      'ask opencode with a small-model executor to sweep the architecture and report what this repo is missing.',
      table,
    );
    expect(decision?.action).toBe('route');
    expect(decision?.executorSkillId).toBe('cli-opencode');
  });

  it('routes a claude-code direct alias to cli-claude-code', () => {
    const decision = resolveExecutorDelegation('get an anthropic cli second opinion', table);
    expect(decision?.action).toBe('route');
    expect(decision?.executorSkillId).toBe('cli-claude-code');
  });

  it('does not fire on the code hub opencode-standards surface (negative guard)', () => {
    expect(resolveExecutorDelegation(
      'use the opencode standards route to clean up this commonjs helper.',
      table,
    )).toBeNull();
    expect(resolveExecutorDelegation(
      'inspect `.opencode/agents` and tell me which agent names are defined.',
      table,
    )).toBeNull();
  });

  it('abstains (no route, null executor) when a retired executor is named', () => {
    const decision = resolveExecutorDelegation('delegate to codex to generate this module', table);
    expect(decision).not.toBeNull();
    expect(decision?.action).toBe('abstain');
    expect(decision?.executorSkillId).toBeNull();
  });

  it('does not fire on a bare opencode mention with no delegation cue', () => {
    expect(resolveExecutorDelegation('summarize what the opencode project does.', table)).toBeNull();
  });
});

describe('executor-delegation shared fixture (TS native + Python parity)', () => {
  freezeNativeEnv();
  const fixture = loadFixture();

  it('has a well-formed non-trivial fixture', () => {
    expect(fixture.version).toBe(1);
    expect(fixture.cases.length).toBeGreaterThanOrEqual(10);
    const branches = new Set(fixture.cases.map((entry) => entry.branch));
    for (const branch of ['direct-alias', 'orchestrator-cue', 'negative-guard', 'suppressed-abstain']) {
      expect(branches.has(branch)).toBe(true);
    }
  });

  it('routes every fixture case to its expected top-1 on the native scorer', () => {
    const mismatches: string[] = [];
    for (const entry of fixture.cases) {
      const actual = nativeTop(entry.prompt);
      if (actual !== entry.expectedTop) {
        mismatches.push(`${entry.id}: expected=${entry.expectedTop} native=${actual}`);
      }
    }
    expect(mismatches, `Native routing mismatches:\n  ${mismatches.join('\n  ')}`).toEqual([]);
  });

  it('agrees TS-native == Python for every fixture case', (context) => {
    if (!pythonReachable()) {
      if (REQUIRE_PYTHON) {
        throw new Error(
          'python3 is unavailable but the executor-delegation parity test requires it. '
          + 'Set SPECKIT_PARITY_REQUIRE_PYTHON=0 only in a genuinely python-less environment.',
        );
      }
      context.skip();
      return;
    }
    const prompts = fixture.cases.map((entry) => entry.prompt);
    const python = runPython(prompts);
    const pythonByPrompt = new Map(python.map((row) => [row.prompt, row.top ?? NONE]));

    const divergences: string[] = [];
    for (const entry of fixture.cases) {
      const tsTop = nativeTop(entry.prompt);
      const pyTop = pythonByPrompt.get(entry.prompt) ?? NONE;
      if (tsTop !== entry.expectedTop || pyTop !== entry.expectedTop) {
        divergences.push(`${entry.id}: expected=${entry.expectedTop} ts=${tsTop} python=${pyTop}`);
      }
    }
    expect(
      divergences,
      `Executor-delegation TS/Python parity divergences:\n  ${divergences.join('\n  ')}`,
    ).toEqual([]);
  }, 60_000);
});
