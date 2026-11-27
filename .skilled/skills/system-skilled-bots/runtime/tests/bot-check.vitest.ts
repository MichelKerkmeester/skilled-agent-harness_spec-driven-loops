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
  'isolation-invalid': 'definition.isolation-invalid',
  'worktree-shared-paths-unresolved': 'worktree-shared-paths-unresolved',
  'delivery-channel-unknown': 'delivery-channel-unknown',
  'reserved-id': 'reserved-id',
  'executor-kind-native': 'executor-kind-native',
  'posture-unhonorable': 'posture-unhonorable',
  'routine-trigger-conflict': 'definition.routine-trigger-conflict',
  'routine-tell-with-targets': 'definition.routine-tell-with-targets',
  'routine-starts-empty': 'definition.routine-starts-empty',
  'routine-starts-multiple-cron': 'definition.routine-starts-multiple-cron',
  'routine-starts-cron-not-first': 'definition.routine-starts-cron-not-first',
  'routine-starts-multiple': 'definition.routine-starts-multiple',
  'routine-until-check-without-outcome': 'definition.routine-until-check-without-outcome',
  'routine-until-shell-metacharacters': 'definition.routine-until-shell-metacharacters',
  'routine-floor': 'routine-floor-15-minutes',
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

/** The clean checkout a defect fixture is a copy of: routine-clean for a routine fixture, clean for the rest. */
function baseOf(name: string): string {
  return name.startsWith('routine-') ? 'routine-clean' : 'clean';
}

afterEach(() => cleanupTemp());

describe('fixtures', () => {
  it('has one defect fixture per hard invariant, plus the two clean ones', () => {
    expect(Object.values(DEFECTS).sort()).toEqual([...HARD_INVARIANTS].sort());
    const folders = readdirSync(FIXTURES).filter((name) => statSync(join(FIXTURES, name)).isDirectory()).sort();
    expect(folders).toEqual(['clean', 'routine-clean', ...Object.keys(DEFECTS)].sort());
  });

  it('differs from the clean fixture by one injected defect each', () => {
    for (const name of Object.keys(DEFECTS)) {
      const clean = tree(join(FIXTURES, baseOf(name)));
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

  it('prints the routine invariant for each defect fixture', () => {
    const clean = run(copyFixture('routine-clean'));
    expect(clean.status).toBe(0);
    expect(clean.lines.some((line) => line.startsWith('FAIL:'))).toBe(false);
    expect(clean.lines.some((line) => line.startsWith('PASS: routine-floor-15-minutes: '))).toBe(true);

    for (const [name, id] of Object.entries(DEFECTS)) {
      if (!name.startsWith('routine-')) continue;
      const result = run(copyFixture(name));
      expect(result.status, name).toBe(1);
      expect(result.lines.some((line) => line.startsWith(`FAIL: ${id}: `)), name).toBe(true);
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

  it('fails a folder whose name differs from its id, the definition the runner and installer refuse', () => {
    expect(ADVISORY_INVARIANTS).not.toContain('folder-id-mismatch');
    const clean = copyFixture('clean');
    renameSync(join(clean, 'bots', 'nightly-digest'), join(clean, 'bots', 'digest'));
    for (const result of [run(clean), run(clean, '--strict')]) {
      expect(result.status).toBe(1);
      expect(result.lines).toContainEqual(expect.stringMatching(/^FAIL: folder-id-mismatch: bots\/digest\/BOT\.md: folder digest differs from id nightly-digest$/));
      expect(result.lines.some((line) => line.startsWith('WARN:'))).toBe(false);
    }
  });

  it('writes nothing into the folder it checks', () => {
    const repo = copyFixture('clean');
    const before = tree(repo);
    run(repo);
    expect(tree(repo)).toEqual(before);
  });

  it('allows a worktree bot only while its shared-path list resolves', () => {
    const repo = copyFixture('clean');
    const bot = join(repo, 'bots', 'nightly-digest', 'BOT.md');
    writeFileSync(bot, readFileSync(bot, 'utf8').replace('isolation: shared', 'isolation: worktree'));
    expect(run(repo).lines).toContainEqual(expect.stringMatching(/^PASS: worktree-shared-paths: .* from launcher$/));

    const unresolved = spawnSync(process.execPath, [CHECKER, repo], {
      env: { ...isolatedEnv(), SPECKIT_WORKTREE_SHARED_PATHS: '/abs/node_modules' },
      encoding: 'utf8',
    });
    expect(unresolved.status).toBe(1);
    expect(unresolved.stdout).toMatch(/^FAIL: worktree-shared-paths-unresolved: bots\/nightly-digest\/BOT\.md: /m);
  });

  it('exits 2 on an unknown option', () => {
    expect(run(copyFixture('clean'), '--fast').status).toBe(2);
  });
});
