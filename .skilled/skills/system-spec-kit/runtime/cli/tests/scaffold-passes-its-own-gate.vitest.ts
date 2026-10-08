// ───────────────────────────────────────────────────────────────────
// MODULE: Scaffold Gate Self Check
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(scriptsRoot, '..', '..', '..', '..');
const createScript = path.join(scriptsRoot, 'spec', 'create.sh');
const validateScript = path.join(scriptsRoot, 'spec', 'validate.sh');
const createdFolders = new Set<string>();

function scaffold(level: string, slug: string): string {
  const result = spawnSync('bash', [createScript, '--level', level, slug], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const match = (result.stdout ?? '').match(/SPEC_FOLDER:\s*(\S+)/u);
  if (!match) throw new Error(`create.sh produced no folder for level ${level}: ${result.stderr}`);
  const folder = match[1];
  createdFolders.add(folder);
  return folder;
}

function scaffoldPhase(slug: string, phaseNames: string[]): { parent: string; children: string[] } {
  const result = spawnSync(
    'bash',
    [createScript, '--phase', '--phases', String(phaseNames.length), '--phase-names', phaseNames.join(','), slug],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    },
  );
  const match = (result.stdout ?? '').match(/SPEC_FOLDER:\s*(\S+)/u);
  if (!match) throw new Error(`create.sh produced no phase parent for ${slug}: ${result.stderr}`);
  const parent = match[1];
  createdFolders.add(parent);
  // Read the children from disk so the assertion checks what create.sh wrote,
  // not this helper's guess at its folder grammar.
  const children = fs
    .readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{3}-/u.test(entry.name))
    .map((entry) => path.join(parent, entry.name));
  return { parent, children };
}

afterEach(() => {
  for (const folder of createdFolders) {
    // Only ever remove something this test created, and only under specs.
    if (folder.includes(`${path.sep}specs${path.sep}`)) fs.rmSync(folder, { recursive: true, force: true });
  }
  createdFolders.clear();
});

// The generator and the grader are the same system. When they disagree, every
// packet starts life failing, and an author learns before writing a line that
// the gate is something to work around rather than read.
describe('a scaffold passes the gate it ships with', () => {
  for (const level of ['1', '2', '3']) {
    it(`level ${level}, untouched, reports no errors`, { timeout: 120_000 }, () => {
      const folder = scaffold(level, `scaffold gate probe level ${level}`);

      const result = spawnSync('bash', [validateScript, folder, '--strict', '--no-recursive'], {
        cwd: repoRoot,
        encoding: 'utf8',
      });

      // Warnings are advice and an untouched scaffold legitimately attracts
      // some; an error is the gate saying the document is wrong, which nobody
      // has had a chance to make it yet.
      expect(result.stdout).toMatch(/Errors: 0/u);
      expect(result.status).toBe(0);
    });
  }

  it('a phase parent and its children, untouched, report no errors', { timeout: 120_000 }, () => {
    const { parent, children } = scaffoldPhase('scaffold gate phase probe', ['first', 'second']);

    // A phase run derives each folder's graph metadata separately; one missed
    // folder would ship a child that fails the gate its parent passes.
    expect(children, 'create.sh --phase scaffolded no child folders').toHaveLength(2);

    for (const folder of [parent, ...children]) {
      const result = spawnSync('bash', [validateScript, folder, '--strict', '--no-recursive'], {
        cwd: repoRoot,
        encoding: 'utf8',
      });

      expect(result.stdout, `${path.basename(folder)} did not report a clean gate`).toMatch(/Errors: 0/u);
      expect(result.status).toBe(0);
    }
  });

  it('creates every document its level contract calls for', { timeout: 120_000 }, () => {
    const folder = scaffold('2', 'scaffold contract probe');
    for (const doc of ['spec.md', 'plan.md', 'tasks.md', 'acceptance-criteria.md']) {
      expect(fs.existsSync(path.join(folder, doc)), `${doc} was not scaffolded`).toBe(true);
    }
  });

  it('derives its own graph metadata rather than leaving a guess', { timeout: 120_000 }, () => {
    const folder = scaffold('2', 'scaffold metadata probe');
    const graph = JSON.parse(fs.readFileSync(path.join(folder, 'graph-metadata.json'), 'utf8')) as {
      derived?: { source_fingerprint?: string };
    };
    expect(graph.derived?.source_fingerprint, 'source_fingerprint absent on a fresh scaffold').toBeTruthy();
  });
});
