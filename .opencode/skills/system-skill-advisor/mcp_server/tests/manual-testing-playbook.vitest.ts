// ───────────────────────────────────────────────────────────────
// MODULE: Manual Testing Playbook Coverage Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const playbookRoot = resolve(
  repoRoot,
  '.opencode/skills/system-skill-advisor/manual_testing_playbook',
);
const rootPlaybook = resolve(playbookRoot, 'manual_testing_playbook.md');

interface ScenarioRow {
  id: string;
  relativePath: string;
}

function listedScenarioRows(markdown: string): ScenarioRow[] {
  // ID prefix length: current playbook prefixes such as NC-NNN and CL-NNN.
  return [...markdown.matchAll(/^\| ([A-Z]{2,4}-\d{3}) \| [^|]+ \| \[[^\]]+\]\(([^)]+)\) \|$/gm)]
    .map((match) => ({
      id: match[1],
      relativePath: match[2],
    }));
}

function actualScenarioFiles(): string[] {
  return readdirSync(playbookRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{2}--/.test(entry.name))
    .flatMap((directory) =>
      readdirSync(resolve(playbookRoot, directory.name), { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => `${directory.name}/${entry.name}`)
    )
    .sort();
}

describe('skill advisor manual testing playbook inventory', () => {
  it('keeps the root playbook aligned with the live 46-scenario corpus', () => {
    const markdown = readFileSync(rootPlaybook, 'utf8');
    const rows = listedScenarioRows(markdown);
    const files = actualScenarioFiles();

    expect(markdown).toContain('46 deterministic scenario files across 9 categories');
    expect(markdown).toContain('all 46 scenario files are `PASS`');
    expect(markdown).not.toMatch(/\b24-scenario\b|\b24 scenarios\b/);
    expect(rows).toHaveLength(46);
    expect(new Set(rows.map((row) => row.id)).size).toBe(46);
    expect(files).toHaveLength(46);

    for (const row of rows) {
      expect(existsSync(resolve(playbookRoot, row.relativePath))).toBe(true);
    }

    expect(rows.map((row) => row.relativePath).sort()).toEqual(files);
  });
});
