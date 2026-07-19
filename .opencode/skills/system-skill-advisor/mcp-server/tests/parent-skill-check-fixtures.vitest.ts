// ───────────────────────────────────────────────────────────────
// MODULE: parent-skill-check.cjs fixture harness
// ───────────────────────────────────────────────────────────────
// The canon checker is the single enforcement artifact and it just gained nine rule
// families in remediation — yet it had zero tests of its own, so a rule regression is
// invisible. This harness drives the checker via execFileSync against a golden (a copy of
// a real canon-clean hub, which must pass 4/4) and a set of mutant hubs (one injected
// defect each), asserting each mutant reds exactly its rule. Refactor-free: it shells to
// the CLI rather than importing it, so the single artifact CI and /doctor depend on is
// unchanged. Fixtures are generated at test time from the live hub — no committed trees.

import { describe, expect, it } from 'vitest';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

function repoRoot(): string {
  let dir = process.cwd();
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    dir = dirname(dir);
  }
  throw new Error('repo root not found from ' + process.cwd());
}
const R = repoRoot();
const CHECKER = join(R, '.opencode/commands/doctor/scripts/parent-skill-check.cjs');
const GOLDEN_HUB = join(R, '.opencode/skills/sk-doc'); // a canon-clean workflow-only hub

function runChecker(hubDir: string): { code: number; out: string } {
  try {
    const out = execFileSync('node', [CHECKER, hubDir], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (e: unknown) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

// Copy the golden hub to a fresh temp dir, apply a mutation, return the dir.
function mutantHub(mutate: (dir: string) => void): string {
  const dir = mkdtempSync(join(tmpdir(), 'psc-fixture-'));
  const hub = join(dir, 'sk-doc'); // dir basename must equal the copied hub's skill_id (rule 1b)
  cpSync(GOLDEN_HUB, hub, { recursive: true });
  mutate(hub);
  return hub;
}
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const writeJson = (p: string, v: unknown): void => writeFileSync(p, JSON.stringify(v, null, 2));

describe('parent-skill-check fixture harness', () => {
  it('golden: a copy of a real canon-clean hub passes 4/4', () => {
    const dir = mkdtempSync(join(tmpdir(), 'psc-golden-'));
    const hub = join(dir, 'sk-doc'); // dir basename must equal the copied hub's skill_id (rule 1b)
    try {
      cpSync(GOLDEN_HUB, hub, { recursive: true });
      const { code, out } = runChecker(hub);
      expect(code, out).toBe(0);
      expect(out).toMatch(/all hard invariants passed/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  // Each mutant injects exactly one defect; the checker must red naming that rule.
  const mutants: Array<{ rule: string; label: string; mutate: (d: string) => void }> = [
    {
      rule: '1c', label: 'invalid graph-metadata family',
      mutate: (d) => { const g = readJson(join(d, 'graph-metadata.json')); g.family = 'not-a-real-family'; writeJson(join(d, 'graph-metadata.json'), g); },
    },
    {
      rule: '3d-alias', label: 'duplicate alias across two modes',
      mutate: (d) => {
        const p = join(d, 'mode-registry.json'); const r = readJson(p) as { modes: Array<{ aliases?: string[] }> };
        r.modes[1].aliases = [...(r.modes[1].aliases ?? []), r.modes[0].aliases![0]]; writeJson(p, r);
      },
    },
    {
      rule: '6a', label: 'unregistered stray directory',
      mutate: (d) => { mkdirSync(join(d, 'totally-unregistered-dir')); },
    },
    {
      rule: '3j', label: 'hub over-grants a tool no mode declares',
      mutate: (d) => {
        const p = join(d, 'SKILL.md'); const s = readFileSync(p, 'utf8');
        writeFileSync(p, s.replace(/^allowed-tools:\s*\[([^\]]*)\]/m, 'allowed-tools: [$1, Task]'));
      },
    },
    {
      rule: '5h', label: 'router defaultMode is not a registered mode',
      mutate: (d) => { const p = join(d, 'hub-router.json'); const r = readJson(p) as { routerPolicy: Record<string, unknown> }; r.routerPolicy.defaultMode = 'ghost-mode'; writeJson(p, r); },
    },
    {
      rule: '8b', label: 'description.json carries a registry-owned modes[] duplicate',
      mutate: (d) => { const p = join(d, 'description.json'); const j = readJson(p); j.modes = ['fake-duplicate']; writeJson(p, j); },
    },
  ];

  for (const { rule, label, mutate } of mutants) {
    it(`mutant reds rule ${rule}: ${label}`, () => {
      const hub = mutantHub(mutate);
      try {
        const { code, out } = runChecker(hub);
        expect(code, `expected non-zero exit for ${label}`).not.toBe(0);
        expect(out, `expected rule ${rule} in checker output`).toContain(`${rule}:`);
      } finally {
        rmSync(dirname(hub), { recursive: true, force: true });
      }
    });
  }
});
