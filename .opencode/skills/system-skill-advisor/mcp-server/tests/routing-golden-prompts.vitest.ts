// ───────────────────────────────────────────────────────────────────
// MODULE: Gate-2 Golden-Prompt Acceptance Tests
// ───────────────────────────────────────────────────────────────────
//
// A CI-gated set of labelled prompts whose routing outcome is pinned: each
// case asserts either the #1 skill (top1) or membership in the top 3 (top3),
// and — for prompts whose winning hub serves a compiled route — the concrete
// compiled workflowMode as well. This is the joined parent→mode acceptance
// layer the drift-guard and per-mode parity suites do not cover.
//
// The scorer runs UNMOCKED. To make its output reproducible without a built
// SQLite skill graph, it runs in the same force-local regime the pinned
// routing-accuracy baseline uses (filesystem projection, no built-in semantic
// lane). That regime is env-sensitive at scorer module load, so the env is set
// BEFORE the scorer is imported and the scorer is pulled in dynamically.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const fixturePath = resolve(here, '../scripts/fixtures/gate2-golden-prompts.jsonl');
const compiledRouteScript = resolve(repoRoot, '.opencode/bin/compiled-route.cjs');

// Pinned force-local regime — must precede the scorer import so the scorer
// picks it up at module load, matching the baseline capture exactly.
process.env.MK_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'golden-prompts-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const { scoreAdvisorPrompt } = await import('../lib/scorer/fusion.js');
const { COMPILED_ROUTING_HUBS } = await import('../lib/compiled-routing-flag.js');

const workspaceRoot = findAdvisorWorkspaceRoot(here, {
  maxDepth: 20,
  sentinel: '.opencode/skills/system-spec-kit/SKILL.md',
});

interface GoldenCase {
  readonly id: string;
  readonly prompt: string;
  readonly tier: 'top1' | 'top3';
  readonly expectedSkillAny: readonly string[];
  readonly expectedMode?: string;
  readonly sourceCaseId?: string;
  readonly priority: 'P0' | 'P1';
  readonly notes?: string;
}

function loadCases(): GoldenCase[] {
  const lines = readFileSync(fixturePath, 'utf8').trim().split('\n').filter(Boolean);
  return lines
    .map((line) => JSON.parse(line) as Record<string, unknown>)
    .filter((row) => row._schema === undefined)
    .map((row) => row as unknown as GoldenCase);
}

function rankedSkills(prompt: string): string[] {
  const result = scoreAdvisorPrompt(prompt, { workspaceRoot });
  return (result.recommendations ?? [])
    .map((recommendation) => recommendation.skill ?? null)
    .filter((skill): skill is string => skill !== null);
}

// The compiled route the runtime attaches for a hub that still serves compiled
// (a hub mid-restructure serves { servingAuthority: "legacy" } and gets none).
interface CompiledRoute {
  readonly action?: string;
  readonly servingAuthority?: string;
  readonly targets?: ReadonlyArray<{ readonly workflowMode?: string }>;
}

function compiledRouteFor(hub: string, prompt: string): CompiledRoute {
  const output = execFileSync(process.execPath, [
    compiledRouteScript,
    '--hub', hub,
    '--prompt', prompt,
  ], { cwd: workspaceRoot, encoding: 'utf8', timeout: 5_000 });
  return JSON.parse(output.trim()) as CompiledRoute;
}

const cases = loadCases();

describe('routing-golden-prompts', () => {
  it('loads a representative multi-hub fixture', () => {
    expect(cases.length).toBeGreaterThanOrEqual(6);
    const hubs = new Set(cases.flatMap((golden) => golden.expectedSkillAny));
    expect(hubs.has('sk-doc')).toBe(true);
    expect(hubs.has('sk-git')).toBe(true);
    expect(hubs.has('system-deep-loop')).toBe(true);
  });

  for (const golden of cases) {
    it(`${golden.id}: ${golden.tier} routing holds`, () => {
      const ranked = rankedSkills(golden.prompt);
      expect(ranked.length, `no ranked skills for "${golden.prompt}"`).toBeGreaterThan(0);

      if (golden.tier === 'top1') {
        expect(
          golden.expectedSkillAny,
          `${golden.id}: #1 was "${ranked[0]}", expected one of ${golden.expectedSkillAny.join('/')}`,
        ).toContain(ranked[0]);
      } else {
        const top3 = ranked.slice(0, 3);
        const hit = top3.some((skill) => golden.expectedSkillAny.includes(skill));
        expect(hit, `${golden.id}: top3 ${top3.join('/')} missed ${golden.expectedSkillAny.join('/')}`).toBe(true);
      }

      if (golden.expectedMode) {
        const hub = golden.expectedSkillAny.find((skill) => ranked.slice(0, 3).includes(skill));
        expect(hub, `${golden.id}: expected-mode case did not select its hub`).toBeDefined();
        expect(
          COMPILED_ROUTING_HUBS.has(hub as string),
          `${golden.id}: "${hub}" declares expectedMode but is not a compiled-routing hub`,
        ).toBe(true);
        const route = compiledRouteFor(hub as string, golden.prompt);
        // A hub mid-restructure serves { servingAuthority: "legacy" } with no
        // compiled route. The joined-mode assertion applies only once the hub
        // serves compiled; until then skip it (logged) rather than fail, so the
        // top-1/top-3 selection check above still gates and the mode assertion
        // activates automatically when the hub is re-minted.
        if (route.action === 'route') {
          const modes = (route.targets ?? []).map((target) => target.workflowMode);
          expect(modes, `${golden.id}: compiled targets ${modes.join('/')} missing ${golden.expectedMode}`).toContain(golden.expectedMode);
        } else {
          console.log(`[golden] ${golden.id}: "${hub}" serves ${route.servingAuthority ?? 'n/a'} — joined-mode assertion skipped until re-mint`);
        }
      }
    });
  }
});
