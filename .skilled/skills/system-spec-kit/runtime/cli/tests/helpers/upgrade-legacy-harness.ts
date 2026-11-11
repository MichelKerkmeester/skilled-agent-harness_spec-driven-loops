// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders — shared harness
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { expect } from 'vitest';

const skillRoot = path.resolve(__dirname, '../../../..');
export const PACKET = 'specs/system-spec-kit/001-legacy-packet';
export const DIRTY_PACKET = 'specs/system-spec-kit/002-dirty-packet';

// The command derives its repository from its own location and refuses roots
// outside it, so the sweep runs against a full copy of the skill inside a
// throwaway repository rather than this checkout.
export let sandbox: string;
export let copy: string;
export let baselineHead: string;

// An imported binding cannot be assigned by the importing module, and one case
// relocates the sandbox mid-test, so that write goes through these instead.
export function setSandbox(value: string): void {
  sandbox = value;
}

export function setCopy(value: string): void {
  copy = value;
}

export function runUpgrade(args: string[], env: Record<string, string | undefined> = {}) {
  return spawnSync(process.execPath, [path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs'), ...args], {
    cwd: sandbox,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

export function validate(folder: string) {
  return spawnSync('bash', [path.join(copy, 'runtime/cli/spec/validate.sh'), folder, '--strict'], { cwd: sandbox, encoding: 'utf8' });
}

export function validateJson(folder: string) {
  return spawnSync(
    'bash',
    [path.join(copy, 'runtime/cli/spec/validate.sh'), folder, '--strict', '--json', '--no-recursive'],
    { cwd: sandbox, encoding: 'utf8' },
  );
}

export function downgradeRows(output: string): string[] {
  const section = output.split('\nDowngrades:\n')[1]?.split('\ninspected=')[0] ?? '';
  return section.split('\n').filter((line) => line.startsWith('  ') && line.trim() !== 'none').map((line) => line.trim());
}

// One digest standing for the whole specs tree, or one folder of it — every
// file's relative path plus content hash, sorted — so a write anywhere in the
// tree shows up here.
export function manifest(relative = 'specs'): string {
  const specs = path.join(sandbox, relative);
  const entries: string[] = [];
  const walk = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(abs);
      } else {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
        entries.push(`${path.relative(specs, abs).split(path.sep).join('/')} ${digest}`);
      }
    }
  };
  walk(specs);
  return crypto.createHash('sha256').update(entries.sort().join('\n')).digest('hex');
}

export function gitDir(): string {
  return execFileSync('git', ['-C', sandbox, 'rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim();
}

export function upgradeManifestPath(): string {
  return path.join(gitDir(), 'upgrade-legacy.manifest.json');
}

export function clearUpgradeManifest(): void {
  fs.rmSync(upgradeManifestPath(), { force: true });
}

// Cases may build packets for one run, but nothing needs to survive into the
// next one. Restoring the suite's own commit, an empty specs tree and an
// absent reversibility manifest keeps the order the cases run in from deciding
// what each of them sees.
export function resetSandbox(): void {
  if (!fs.existsSync(sandbox)) return;
  if (fs.existsSync(path.join(sandbox, '.git'))) {
    execFileSync('git', ['-C', sandbox, 'reset', '--hard', baselineHead], { stdio: 'pipe' });
    clearUpgradeManifest();
  }
  // A hard reset leaves untracked files in place, and specs/ is hidden from
  // git by the machine's global excludes, so the paths a case can create are
  // removed by name.
  for (const relative of ['specs', 'docs', 'git-shim', 'specs-set-aside', '.opencode/specs']) {
    fs.rmSync(path.join(sandbox, relative), { recursive: true, force: true });
  }
  for (const relative of ['head-moved.txt', 'layout-map-link.mjs', 'outside-preview-target.md']) {
    fs.rmSync(path.join(sandbox, relative), { force: true });
  }
  fs.mkdirSync(path.join(sandbox, 'specs'), { recursive: true });
  // The build record for the copied dist is keyed by an absolute path, so the
  // copy is judged by mtimes. A reset can delete the record a check wrote, and
  // a source a case restored carries a fresh mtime, so the dist files are
  // re-stamped to keep the copy looking built from its own sources.
  refreshCopiedDistMtimes();
}

export function refreshCopiedDistMtimes(): void {
  const now = new Date();
  const touchDist = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === 'node_modules') continue;
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) touchDist(abs);
      else if (item.isFile() && abs.includes('/dist/')) fs.utimesSync(abs, now, now);
    }
  };
  touchDist(path.join(copy, 'runtime'));
}

export function commitChanges(message: string, forcePaths: string[] = []): void {
  execFileSync('git', ['add', '-A'], { cwd: sandbox });
  if (forcePaths.length > 0) execFileSync('git', ['add', '-f', '-A', '--', ...forcePaths], { cwd: sandbox });
  execFileSync(
    'git',
    ['-c', 'user.name=Upgrade Legacy Test', '-c', 'user.email=upgrade-legacy@test.invalid', 'commit', '-q', '-m', message],
    { cwd: sandbox },
  );
}

export function writeLegacyPacket(relative = PACKET): void {
  const folder = path.join(sandbox, relative);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'spec.md'), '---\ntitle: "Legacy Packet"\ndescription: "A packet written before v4."\n---\n# Legacy Packet\n\nOld packet written before the v4 contract.\n');
  fs.writeFileSync(path.join(folder, 'plan.md'), '# Plan\n\nOld plan.\n');
  fs.writeFileSync(path.join(folder, 'tasks.md'), '# Tasks\n\n- [ ] T001 Old task\n');
}

// The reversibility manifest exists for a dirty tree, so every case that reads
// one rebuilds the same state: both packets committed, then an edit in progress
// on the second, then an apply that has to record the before-images.
export function prepareDirtyManifest(): void {
  writeLegacyPacket();
  commitChanges('committed legacy packet', [PACKET]);
  writeLegacyPacket(DIRTY_PACKET);
  commitChanges('committed second legacy packet', [DIRTY_PACKET]);
  const dirtySpec = path.join(sandbox, DIRTY_PACKET, 'spec.md');
  const dirtyPlan = path.join(sandbox, DIRTY_PACKET, 'plan.md');
  fs.appendFileSync(dirtySpec, '\nUncommitted legacy edit.\n');
  fs.appendFileSync(dirtyPlan, '\nUncommitted plan edit.\n');
  const applied = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit']);
  expect(applied.status, applied.stdout + applied.stderr).toBe(0);
}

// The legacy shape plus a questions anchor whose opener sits above an earlier
// heading, the nested layout the anchor repair exists to fix.
export function nestedQuestionsSpec(): string {
  return [
    '---',
    'title: "Legacy Packet"',
    'description: "A packet written before v4."',
    '---',
    '# Legacy Packet',
    '',
    'Old packet written before the v4 contract.',
    '',
    '<!-- ANCHOR:questions -->',
    '## L2: EDGE CASES',
    'Boundary notes.',
    '',
    '## 10. OPEN QUESTIONS',
    '- None open.',
    '<!-- /ANCHOR:questions -->',
    '',
  ].join('\n');
}

// The README's recovery script is the executable contract for an interrupted
// apply, so the cases below run the fenced copy rather than a paraphrase of it.
export function readmeRecoveryScript(): string {
  const readme = fs.readFileSync(path.join(copy, 'runtime/cli/spec/README.md'), 'utf8');
  const recoverySection = readme.slice(readme.indexOf('### Recover an Interrupted Apply'));
  const fence = String.fromCharCode(96).repeat(3);
  const script = recoverySection.match(new RegExp(fence + 'js\\n([\\s\\S]*?)\\n' + fence, 'u'))?.[1];
  expect(script).toBeDefined();
  return script!;
}

// The tests share one sandbox on purpose: the copy of the skill and its
// repository are expensive to build, and each case resets that sandbox to the
// same clean baseline, so the order they run in does not decide what they see.
export function setupSandbox(): void {
  sandbox = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-')));
  copy = path.join(sandbox, '.skilled/skills/system-spec-kit');
  // The runtime's .workflow-lock is created and removed by other test files
  // running at the same time, so copying it can fail with ENOENT mid-copy. It is
  // transient state, never part of the skill, and stays out of the copy.
  fs.cpSync(skillRoot, copy, {
    recursive: true,
    filter: (src) => !['node_modules', '.workflow-lock'].includes(path.basename(src)),
  });

  // node_modules stays out of the copy and is linked back in at its real
  // location: it is large and identical, and the copied runtime resolves its
  // dependencies through the same relative paths.
  for (const relative of ['node_modules', 'runtime/node_modules', 'runtime/cli/node_modules']) {
    const source = path.join(skillRoot, relative);
    if (fs.existsSync(source)) fs.symlinkSync(source, path.join(copy, relative), 'dir');
  }
  // A hoisted install gives runtime/ no node_modules of its own, and the
  // freshness check then calls it unprovisioned and never reports it stale.
  // An empty folder counts as provisioned, and resolution still walks up.
  fs.mkdirSync(path.join(copy, 'runtime/node_modules'), { recursive: true });

  // The build record that proves the dist fresh is keyed by the dist's
  // absolute path, so a copy falls back to mtimes, and its dist was built
  // from these sources.
  refreshCopiedDistMtimes();

  fs.mkdirSync(path.join(sandbox, '.opencode'));
  fs.mkdirSync(path.join(sandbox, 'specs'));
  execFileSync('git', ['init', '-q'], { cwd: sandbox });
  commitChanges('test repository baseline');
  baselineHead = execFileSync('git', ['-C', sandbox, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

export function teardownSandbox(): void {
  fs.rmSync(sandbox, { recursive: true, force: true });
}

// ───────────────────────────────────────────────────────────────────
// planLayoutMove
// ───────────────────────────────────────────────────────────────────

// Each case builds its own root instead of reusing the shared sandbox: the map
// and the steps it prints act on whichever repository holds them, and the
// sandbox above already carries the state its own sweep tests left behind.
export function makeLayoutRoot(): string {
  return fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'layout-map-')));
}

export function runLayoutSteps(root: string, steps: Array<{ id: string; argv: string[] }>): void {
  for (const step of steps) {
    const result = spawnSync(step.argv[0], step.argv.slice(1), { cwd: root, encoding: 'utf8' });
    expect(result.status, `${step.id}: ${result.stdout}${result.stderr}`).toBe(0);
  }
}

// The machine's global excludes can hide a fresh spec root, and git mv only
// moves what the index knows, so the add runs with the excludes file off.
export function initLayoutRepo(root: string): void {
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['-c', 'core.excludesFile=/dev/null', 'add', '-A'], { cwd: root });
}

export function fileContentDigests(root: string, relative: string): string[] {
  const digests: string[] = [];
  const walk = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === '.DS_Store') continue;
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) walk(abs);
      else if (item.isFile()) digests.push(crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'));
    }
  };
  walk(path.join(root, relative));
  return digests.sort();
}

export function treeFingerprint(root: string): string {
  const entries: string[] = [];
  const walk = (dir: string, rel: string): void => {
    for (const name of fs.readdirSync(dir).sort()) {
      const abs = path.join(dir, name);
      const childRel = `${rel}/${name}`;
      const stat = fs.lstatSync(abs);
      if (stat.isSymbolicLink()) {
        entries.push(`${childRel}->${fs.readlinkSync(abs)}`);
      } else if (stat.isDirectory()) {
        entries.push(`${childRel}/`);
        walk(abs, childRel);
      } else {
        entries.push(`${childRel} ${crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex')}`);
      }
    }
  };
  walk(root, '');
  return crypto.createHash('sha256').update(entries.join('\n')).digest('hex');
}
