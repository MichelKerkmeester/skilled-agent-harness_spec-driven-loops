import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';

// Fail-closed integrity gate for the code-opencode manual_testing_playbook.
//
// Each scenario's `id:` is the routing corpus's primary key. This playbook is
// range indexed rather than row indexed, so the loader falls back to a directory
// scan and a duplicate id is accepted silently and would corrupt per-scenario
// scoring. This guard fails loudly if two scenarios collide on an id, or if the
// parsed scenario count drifts away from the number of on-disk markdown files
// carrying scenario frontmatter. It pins integrity, not an absolute count, so it
// does not rot when a new language scenario is legitimately added.

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
    else if (e.isFile() && e.name.endsWith('.md')
      && e.name !== 'manual_testing_playbook.md' && e.name !== 'feature_catalog.md') {
      const fm = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(dir, e.name), 'utf8'));
      if (fm && /(?:^|\n)[ \t]*(?:id|expected_intent|expected_resources)[ \t]*:/.test(fm[1])) n += 1;
    }
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

  it('parses exactly one scenario per on-disk frontmatter scenario file', () => {
    expect(scenarios.length).toBe(countFeatureFiles(PLAYBOOK));
  });
});
