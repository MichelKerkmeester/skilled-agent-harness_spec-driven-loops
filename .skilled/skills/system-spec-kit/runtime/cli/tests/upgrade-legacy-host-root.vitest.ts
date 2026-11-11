// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Host Root
// ───────────────────────────────────────────────────────────────────
// A host repository vendors the skill and reaches it through a `.skilled` entry at its own
// root, so a run started from the host lives in a tree whose checkout root sits outside the
// host. These tests pin which repository such a run reads, and that a host folder git ignores
// stays out of it.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const skillRoot = path.resolve(__dirname, '../../..');
const repoRoot = path.resolve(skillRoot, '../../..');
const FIXTURE = 'runtime/cli/test-fixtures/002-valid-level1';
const LEGACY_SPEC_MARKER = '<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->';

// git reads the operator's global excludes file, which may ignore `specs/` in every checkout,
// and such a rule would hide the packets this fixture writes. Isolating git's configuration
// leaves each sandbox's own .gitignore as the only rule set a run can see.
const GIT_ENV = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null' };

let host: string;
let hostCopy: string;
let plain: string;
let plainCopy: string;

function tempRoot(prefix: string): string {
  return fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
}

// The build record that proves the copied dist fresh is keyed by an absolute path, so a copy is
// judged by mtimes; its dist was built from these sources, so the copy is re-stamped to look
// built from its own tree.
function refreshCopiedDistMtimes(copy: string): void {
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

// The skill reaches its dependencies and the sk-doc rules at paths relative to its own root, so
// a copy carries the tree itself and links everything large or shared back to this checkout.
function provisionSkillCopy(skillsDir: string): string {
  const copy = path.join(skillsDir, 'system-spec-kit');
  // Other test files create and remove the runtime's .workflow-lock while this copy runs, so
  // copying it can fail with ENOENT. It is transient state and stays out of the copy.
  fs.cpSync(skillRoot, copy, {
    recursive: true,
    filter: (src) => !['node_modules', '.workflow-lock'].includes(path.basename(src)),
  });
  for (const relative of ['node_modules', 'runtime/node_modules', 'runtime/cli/node_modules']) {
    const source = path.join(skillRoot, relative);
    if (fs.existsSync(source)) fs.symlinkSync(source, path.join(copy, relative), 'dir');
  }
  // A hoisted install gives runtime/ no node_modules of its own, and the freshness check then
  // calls it unprovisioned and never reports it stale. An empty folder counts as provisioned,
  // and resolution still walks up.
  fs.mkdirSync(path.join(copy, 'runtime/node_modules'), { recursive: true });
  fs.symlinkSync(path.join(repoRoot, '.skilled/skills/sk-doc'), path.join(skillsDir, 'sk-doc'), 'dir');
  refreshCopiedDistMtimes(copy);
  return copy;
}

function runGit(cwd: string, args: string[]): void {
  const identity = ['-c', 'user.name=Host Root Test', '-c', 'user.email=host-root@test.invalid'];
  execFileSync('git', [...identity, ...args], { cwd, env: GIT_ENV });
}

function commitBaseline(root: string): void {
  runGit(root, ['init', '-q']);
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'test repository baseline']);
}

// The command decides its own repository from where it is started and from where it lives, so
// the script path and the caller directory are separate arguments here.
function runUpgrade(cwd: string, copy: string, args: string[]) {
  return spawnSync(process.execPath, [path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs'), ...args], {
    cwd,
    encoding: 'utf8',
    env: GIT_ENV,
  });
}

// A packet the strict validator accepts while its spec.md still carries a marker from before the
// current template version. The fixture names the folder it was rendered in, so that identity is
// re-pointed first and the repair tool fills in whatever the move changed: a stale pointer is an
// error the validator reports, not a difference the marker refresh is about.
function writeLegacyMarkerPacket(root: string, copy: string, track: string, name: string): string {
  const relative = path.posix.join(track, name);
  const folder = path.join(root, track, name);
  fs.mkdirSync(folder, { recursive: true });
  fs.cpSync(path.join(copy, FIXTURE), folder, { recursive: true });

  const graphFile = path.join(folder, 'graph-metadata.json');
  const graph = JSON.parse(fs.readFileSync(graphFile, 'utf8')) as Record<string, unknown>;
  graph.parent_id = path.posix.basename(track);
  graph.parent_id_review_required = false;
  fs.writeFileSync(graphFile, `${JSON.stringify(graph, null, 2)}\n`);

  const specFile = path.join(folder, 'spec.md');
  fs.writeFileSync(
    specFile,
    fs.readFileSync(specFile, 'utf8').replace(/<!--\s*SPECKIT_TEMPLATE_SOURCE:[^>]*-->/, LEGACY_SPEC_MARKER),
  );

  const derived = spawnSync(
    process.execPath,
    [path.join(copy, 'runtime/cli/spec/repair-derived.cjs'), '--folder', relative, '--apply'],
    { cwd: root, encoding: 'utf8', env: GIT_ENV },
  );
  expect(derived.status, derived.stdout + derived.stderr).toBe(0);

  const strict = spawnSync('bash', [path.join(copy, 'runtime/cli/spec/validate.sh'), folder, '--strict'], {
    cwd: root,
    encoding: 'utf8',
    env: GIT_ENV,
  });
  expect(strict.stdout, strict.stdout + strict.stderr).toContain('RESULT: PASSED');
  return folder;
}

beforeAll(() => {
  host = tempRoot('host-root-');
  hostCopy = provisionSkillCopy(path.join(host, 'vendor/.skilled/skills'));
  fs.symlinkSync(path.join('vendor', '.skilled'), path.join(host, '.skilled'), 'dir');
  fs.writeFileSync(path.join(host, '.gitignore'), '/vendor/\n/specs/mirror/\n');
  fs.mkdirSync(path.join(host, 'specs'), { recursive: true });
  commitBaseline(host);

  // The mirror is the framework's own packets kept under the host's specs/ tree, which is what an
  // ignore rule for it means: not the host's work.
  writeLegacyMarkerPacket(host, hostCopy, 'specs/track', '001-a');
  writeLegacyMarkerPacket(host, hostCopy, 'specs/mirror', '001-b');

  plain = tempRoot('plain-root-');
  plainCopy = provisionSkillCopy(path.join(plain, '.skilled/skills'));
  fs.writeFileSync(path.join(plain, '.gitignore'), 'specs/\n.skilled/\n');
  fs.mkdirSync(path.join(plain, 'specs'), { recursive: true });
  commitBaseline(plain);

  writeLegacyMarkerPacket(plain, plainCopy, 'specs/track', '001-a');
}, 600_000);

afterAll(() => {
  for (const root of [host, plain]) {
    if (root) fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('upgrade-legacy run from a host repository', () => {
  it('scans the host specs/ and leaves out a folder the host ignores', { timeout: 180_000 }, () => {
    const run = runUpgrade(host, hostCopy, ['--refresh-markers']);

    expect(run.status, run.stdout + run.stderr).toBe(1);
    expect(run.stderr).toContain(`upgrade-legacy: host repository ${host}`);
    expect(run.stderr).toContain('skipped 1 spec folders the host repository ignores');
    expect(run.stdout).toContain('specs/track/001-a');
    expect(`${run.stdout}${run.stderr}`).not.toContain('mirror');
  });

  it('honours an explicit host root', { timeout: 180_000 }, () => {
    const run = runUpgrade(host, hostCopy, ['--refresh-markers', '--roots', 'specs/track']);

    expect(run.status, run.stdout + run.stderr).toBe(1);
    expect(run.stdout).toContain('specs/track/001-a');
    expect(`${run.stdout}${run.stderr}`).not.toContain('mirror');
  });
});

describe('upgrade-legacy run outside a host repository', () => {
  it('reads the repository the script lives in and prints no host line', { timeout: 180_000 }, () => {
    const run = runUpgrade(plain, plainCopy, ['--refresh-markers', '--roots', 'specs/track']);

    expect(run.status, run.stdout + run.stderr).toBe(1);
    expect(run.stderr).not.toContain('host repository');
    expect(run.stdout).toContain('specs/track/001-a');
  });
});
