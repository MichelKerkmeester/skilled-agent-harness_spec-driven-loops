// ───────────────────────────────────────────────────────────────────
// MODULE: Bot Checker Tests
// ───────────────────────────────────────────────────────────────────
//
// Every run copies a fixture into a temp repository and runs the real CLI
// with an isolated environment, so identity resolves from the copy and
// never from this checkout's own remote.

import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { cleanupTemp, isolatedEnv, tempRepo } from './support.js';

const SCRIPTS = resolve(import.meta.dirname, '..', '..', 'scripts');
const CHECKER = join(SCRIPTS, 'bot-check.cjs');
const FIXTURES = join(SCRIPTS, 'fixtures');

const { HARD_INVARIANTS, ADVISORY_INVARIANTS } = createRequire(import.meta.url)(CHECKER) as {
  HARD_INVARIANTS: readonly string[];
  ADVISORY_INVARIANTS: readonly string[];
};

/** Each defect fixture and the hard invariant it must fail. */
const DEFECTS: Record<string, string> = {
  'missing-id': 'definition.missing-id',
  'duplicate-id': 'duplicate-id',
  'missing-trigger': 'definition.missing-trigger',
  'unknown-trigger-kind': 'definition.trigger-kind-invalid',
  'empty-body': 'definition.empty-body',
  'unknown-executor-kind': 'runtime-kind-unknown',
  'bad-budget': 'definition.budget.maxIterations-invalid',
  'timeout-over-bound': 'budget.timeoutSeconds-out-of-bounds',
  'cron-untranslatable': 'cron-reboot',
  'no-identity': 'identity-missing',
  'identity-invalid': 'config.identity-invalid',
  'isolation-undeclared': 'isolation-undeclared',
  'reserved-id': 'reserved-id',
};

interface Run {
  lines: string[];
  status: number | null;
}

function run(target: string, ...flags: string[]): Run {
  const result = spawnSync(process.execPath, [CHECKER, target, ...flags], { env: isolatedEnv(), encoding: 'utf8' });
  return { lines: result.stdout.split('\n').filter((line) => line !== ''), status: result.status };
}

/** A copy of one fixture inside a temp repository with no remote. */
function copyFixture(name: string): string {
  const repo = tempRepo();
  cpSync(join(FIXTURES, name, 'bots'), join(repo, 'bots'), { recursive: true });
  return repo;
}

/** Every file under a folder, relative path to content. */
function tree(dir: string): Map<string, string> {
  const files = new Map<string, string>();
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) walk(path);
      else files.set(relative(dir, path), readFileSync(path, 'utf8'));
    }
  };
  walk(dir);
  return files;
}

/** Changed lines between two files, as a set difference of their lines. */
function lineChanges(before: string, after: string): number {
  const a = before.split('\n');
  const b = after.split('\n');
  return a.filter((line) => !b.includes(line)).length + b.filter((line) => !a.includes(line)).length;
}

afterEach(() => cleanupTemp());

describe('fixtures', () => {
  it('has one defect fixture per hard invariant, plus the clean one', () => {
    expect(Object.values(DEFECTS).sort()).toEqual([...HARD_INVARIANTS].sort());
    const folders = readdirSync(FIXTURES).filter((name) => statSync(join(FIXTURES, name)).isDirectory()).sort();
    expect(folders).toEqual(['clean', ...Object.keys(DEFECTS)].sort());
  });

  it('differs from the clean fixture by one injected defect each', () => {
    const clean = tree(join(FIXTURES, 'clean'));
    for (const name of Object.keys(DEFECTS)) {
      const defect = tree(join(FIXTURES, name));
      const added = [...defect.keys()].filter((path) => !clean.has(path));
      const removed = [...clean.keys()].filter((path) => !defect.has(path));
      const changed = [...clean.keys()].filter((path) => defect.has(path) && defect.get(path) !== clean.get(path));
      expect(removed, name).toEqual([]);
      expect(added.length + changed.length, name).toBe(1);
      // A changed file carries one dropped line (1) or one replaced line (2).
      for (const path of changed) {
        expect(lineChanges(clean.get(path) ?? '', defect.get(path) ?? ''), `${name}: ${path}`).toBeLessThanOrEqual(2);
      }
    }
  });
});

describe('bot-check.cjs', () => {
  it('passes the clean fixture with exit 0 and only contract lines', () => {
    const result = run(copyFixture('clean'));
    expect(result.status).toBe(0);
    expect(result.lines.length).toBeGreaterThan(0);
    for (const line of result.lines) expect(line).toMatch(/^(PASS|FAIL|WARN|INFO): [\w.-]+: /);
    expect(result.lines.some((line) => line.startsWith('FAIL:'))).toBe(false);
  });

  for (const [name, id] of Object.entries(DEFECTS)) {
    it(`fails ${name} with exit 1 and the ${id} invariant`, () => {
      const result = run(copyFixture(name));
      expect(result.status).toBe(1);
      expect(result.lines.some((line) => line.startsWith(`FAIL: ${id}: `))).toBe(true);
    });
  }

  it('fails a remote-less repository with no identity, and passes it once identity is set', () => {
    const repo = copyFixture('no-identity');
    const missing = run(repo);
    expect(missing.status).toBe(1);
    expect(missing.lines.filter((line) => line.startsWith('FAIL: identity-missing: '))).toHaveLength(1);

    writeFileSync(join(repo, 'bots', 'config.json'), JSON.stringify({ identity: 'local/tool' }));
    const declared = run(repo);
    expect(declared.status).toBe(0);
    expect(declared.lines.some((line) => line.includes('identity-missing'))).toBe(false);
  });

  it('exits 2 when the target or its bots folder is missing', () => {
    const missing = run(join(tempRepo(), 'absent'));
    expect(missing.status).toBe(2);
    expect(missing.lines).toEqual([expect.stringMatching(/^FAIL: target-missing: .*absent/)]);
    expect(run(tempRepo()).status).toBe(2);
  });

  it('prints one INFO line and exits 0 for an empty bots folder', () => {
    const repo = tempRepo();
    mkdirSync(join(repo, 'bots'));
    writeFileSync(join(repo, 'bots', 'config.json'), JSON.stringify({ identity: 'local/tool' }));
    const result = run(repo);
    expect(result.status).toBe(0);
    expect(result.lines.filter((line) => line.startsWith('INFO: no-definitions: '))).toHaveLength(1);
  });

  it('lets the strict switch change only advisory lines', () => {
    expect(ADVISORY_INVARIANTS).toContain('folder-id-mismatch');
    // One hard failure (no isolation) and one advisory finding (folder differs from id).
    const repo = copyFixture('isolation-undeclared');
    renameSync(join(repo, 'bots', 'nightly-digest'), join(repo, 'bots', 'digest'));

    const normal = run(repo);
    const strict = run(repo, '--strict');
    expect(normal.status).toBe(1);
    expect(strict.status).toBe(1);
    const differs = normal.lines.filter((line, index) => line !== strict.lines[index]);
    expect(differs).toEqual([expect.stringMatching(/^WARN: folder-id-mismatch: /)]);
    expect(strict.lines).toContain(differs[0]?.replace(/^WARN/, 'FAIL'));
    expect(normal.lines.filter((line) => line.startsWith('FAIL:'))).toEqual(
      strict.lines.filter((line) => line.startsWith('FAIL:') && !line.includes('folder-id-mismatch')),
    );

    // With the hard failure fixed, strict alone decides the exit.
    const clean = copyFixture('clean');
    renameSync(join(clean, 'bots', 'nightly-digest'), join(clean, 'bots', 'digest'));
    expect(run(clean).status).toBe(0);
    expect(run(clean, '--strict').status).toBe(1);
  });

  it('writes nothing into the folder it checks', () => {
    const repo = copyFixture('clean');
    const before = tree(repo);
    run(repo);
    expect(tree(repo)).toEqual(before);
  });

  it('exits 2 on an unknown option', () => {
    expect(run(copyFixture('clean'), '--fast').status).toBe(2);
  });
});
