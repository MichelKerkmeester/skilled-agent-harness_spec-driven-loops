import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';
import { readdirSync } from 'node:fs';

// Fail-closed integrity gate for the code-opencode manual_testing_playbook.
//
// Each scenario's `id:` is both the routing corpus's primary key and the OC-NNN
// filename-prefix convention (001-*.md -> OC-001, ...). This playbook is range
// indexed rather than row indexed, so the loader falls back to a directory scan
// and a duplicate id — two feature files both declaring the same OC-NNN — is
// accepted silently and would corrupt any per-scenario scoring. This guard fails
// loudly if two scenarios collide on an id, or if the parsed scenario count drifts
// away from the number of on-disk NNN-*.md feature files (a stale "Totals:" line
// or an orphaned file). It pins integrity, not an absolute count, so it does not
// rot when a new language scenario is legitimately added.

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const OC_ROOT = join(REPO_SKILLS, 'sk-code', 'code-opencode');
const PLAYBOOK = join(OC_ROOT, 'manual_testing_playbook');
const HARNESS = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const { loadPlaybookScenarios } = require(join(HARNESS, 'load-playbook-scenarios.cjs'));

function countFeatureFiles(dir: string): number {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) n += countFeatureFiles(join(dir, e.name));
    else if (e.isFile() && /^\d{3}-.*\.md$/.test(e.name)) n += 1;
  }
  return n;
}

describe('code-opencode playbook — scenario id integrity', () => {
  const { scenarios } = loadPlaybookScenarios({ skillRoot: OC_ROOT });

  it('assigns every scenario a unique OC id (no collisions)', () => {
    const ids = scenarios.map((s: any) => s.scenarioId);
    const dups = [...new Set(ids.filter((id: string, i: number) => ids.indexOf(id) !== i))];
    expect(dups).toEqual([]);
  });

  it('parses exactly one scenario per on-disk NNN-*.md feature file', () => {
    expect(scenarios.length).toBe(countFeatureFiles(PLAYBOOK));
  });
});
