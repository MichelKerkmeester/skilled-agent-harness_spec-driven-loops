#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Update Compatibility Integration Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the mutating half of /doctor:update compat end to end: a fixture v3
// checkout is checked, previewed, moved to the v4 layout, upgraded and
// validated, with every command string taken from the workflow YAML so the
// suite runs the workflow's own spelling of each step. upgrade-legacy derives
// its repository from its own location and refuses roots outside it, so the
// run happens in a throwaway repository holding a copy of the skill, with the
// commands' cwd set to that repository.
//
// The release check (phase_1_preflight) is not run: the sandbox carries no
// release engine, and that check guards the release transaction rather than
// the layout move or the upgrade.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');
const { parse: parseYaml } = require('yaml');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const ASSET_ROOT = path.join(REPO_ROOT, '.skilled', 'commands', 'doctor', 'assets');
const SKILL_ROOT = path.join(REPO_ROOT, '.skilled', 'skills', 'system-spec-kit');

const CHECK_COMMANDS = parseYaml(
  fs.readFileSync(path.join(ASSET_ROOT, 'doctor-update-check.yaml'), 'utf8'),
).workflow.phase_3_compatibility.commands;
const COMPAT_ACTION = parseYaml(
  fs.readFileSync(path.join(ASSET_ROOT, 'doctor-update-compat-action.yaml'), 'utf8'),
);
const COMPAT_COMMANDS = {
  layout_map: COMPAT_ACTION.workflow.phase_2_layout_preview.commands.layout_map,
  upgrade_dry_run: COMPAT_ACTION.workflow.phase_5_upgrade_preview.commands.upgrade_dry_run,
  upgrade_apply: COMPAT_ACTION.workflow.phase_7_upgrade.commands.upgrade_apply,
};
const PACKET = 'specs/legacy-track/001-old-packet';

// ─────────────────────────────────────────────────────────────────────────────
// 2. SANDBOX FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

let sandbox;
let copy;
let env;

function git(...args) {
  return execFileSync('git', args, { cwd: sandbox, env, encoding: 'utf8' });
}

function commit(message) {
  git(
    '-c', 'user.name=Doctor Update Compat Integration',
    '-c', 'user.email=doctor-update-compat-integration@test.invalid',
    'commit', '-q', '-m', message,
  );
}

// One workflow command string, run verbatim from the repository root the
// commands expect.
function runCommand(text) {
  return spawnSync('bash', ['-c', text], { cwd: sandbox, env, encoding: 'utf8' });
}

// A packet written to the pre-v4 contract: a title-only spec frontmatter and
// two documents without any frontmatter, so the upgrade has work to do and the
// era report has missing frontmatter to count.
function writeLegacyPacket() {
  const folder = path.join(sandbox, '.opencode', 'specs', 'legacy-track', '001-old-packet');
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'spec.md'), '---\ntitle: "Legacy Packet"\ndescription: "A packet written before v4."\n---\n# Legacy Packet\n\nOld packet written before the v4 contract.\n');
  fs.writeFileSync(path.join(folder, 'plan.md'), '# Plan\n\nOld plan.\n');
  fs.writeFileSync(path.join(folder, 'tasks.md'), '# Tasks\n\n- [ ] T001 Old task\n');
}

// The build record that proves the dist fresh is keyed by the dist's absolute
// path, so a copy falls back to mtimes, and its dist was built from these
// sources.
function refreshCopiedDistMtimes() {
  const now = new Date();
  const touchDist = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === 'node_modules') continue;
      const absolute = path.join(dir, item.name);
      if (item.isDirectory()) touchDist(absolute);
      else if (item.isFile() && absolute.includes('/dist/')) fs.utimesSync(absolute, now, now);
    }
  };
  touchDist(path.join(copy, 'runtime'));
}

before(() => {
  sandbox = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-update-compat-integration-')));
  copy = path.join(sandbox, '.skilled', 'skills', 'system-spec-kit');
  fs.cpSync(SKILL_ROOT, copy, { recursive: true, filter: (src) => path.basename(src) !== 'node_modules' });

  // node_modules stays out of the copy and is linked back in at its real
  // location: it is large and identical, and the copied runtime resolves its
  // dependencies through the same relative paths.
  for (const relative of ['node_modules', 'runtime/node_modules', 'runtime/cli/node_modules']) {
    const source = path.join(SKILL_ROOT, relative);
    if (fs.existsSync(source)) fs.symlinkSync(source, path.join(copy, relative), 'dir');
  }
  // A hoisted install gives runtime/ no node_modules of its own, and the
  // freshness check then calls it unprovisioned and never reports it stale.
  // An empty folder counts as provisioned, and resolution still walks up.
  fs.mkdirSync(path.join(copy, 'runtime/node_modules'), { recursive: true });

  refreshCopiedDistMtimes();

  // An isolated global config keeps the fixture independent of the machine: a
  // user-level ignore rule for specs/ would otherwise empty the era walk.
  env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: path.join(sandbox, 'global.gitconfig'),
    GIT_CONFIG_NOSYSTEM: '1',
  };
  for (const name of Object.keys(env)) {
    if (/^(GIT_DIR|GIT_WORK_TREE|GIT_CONFIG_COUNT|SPECKIT_SKIP_|SPECKIT_ALLOW_|SPECKIT_VALIDATION)/.test(name)) {
      delete env[name];
    }
  }
  fs.writeFileSync(env.GIT_CONFIG_GLOBAL, '');

  // The real checkout ignores dist/, so the validator's freshness cache cannot
  // appear in status there; the sandbox carries the same rule.
  fs.writeFileSync(path.join(sandbox, '.gitignore'), 'dist/\n');

  git('init', '-q');
  git('add', '-A');
  commit('test repository baseline');

  // The classic v3 shape: packets under .opencode/specs, tracked specs as a
  // symlink to it. core.excludesFile keeps a user-level ignore of specs/ from
  // silently emptying the add.
  writeLegacyPacket();
  fs.symlinkSync('.opencode/specs', path.join(sandbox, 'specs'));
  git('-c', 'core.excludesFile=/dev/null', 'add', '.opencode/specs', 'specs');
  commit('classic v3 fixture');
});

after(() => {
  if (sandbox) fs.rmSync(sandbox, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

test('takes a fixture v3 repository through check, preview, move, upgrade and validation', { timeout: 300_000 }, () => {
  // Check: the layout map owns the reported layout and the era report owns the
  // pre-v4 signal counts.
  const checked = runCommand(CHECK_COMMANDS.layout_map);
  assert.equal(checked.status, 0, checked.stdout + checked.stderr);
  assert.equal(JSON.parse(checked.stdout).state, 'v3');

  const era = runCommand(CHECK_COMMANDS.era_report);
  assert.equal(era.status, 0, era.stdout + era.stderr);
  assert.ok(
    JSON.parse(era.stdout).signals.frontmatter.missing > 0,
    'the fixture must report missing frontmatter',
  );

  // Preview: the planned move is shown and nothing is written.
  const before = git('status', '--porcelain');
  assert.equal(before, '', 'the fixture must commit cleanly');
  const preview = runCommand(COMPAT_COMMANDS.layout_map);
  assert.equal(preview.status, 0, preview.stdout + preview.stderr);
  const planned = JSON.parse(preview.stdout);
  assert.deepEqual(planned.collisions, []);
  assert.ok(planned.steps.length > 0, 'the preview must list the move steps');
  assert.equal(git('status', '--porcelain'), before, 'the preview must write nothing');

  // Move: each printed step runs from the repository root.
  for (const step of planned.steps) {
    execFileSync(step.argv[0], step.argv.slice(1), { cwd: sandbox, env });
  }
  const moved = runCommand(COMPAT_COMMANDS.layout_map);
  assert.equal(moved.status, 0, moved.stdout + moved.stderr);
  const layout = JSON.parse(moved.stdout);
  assert.equal(layout.state, 'v4');
  assert.deepEqual(layout.steps, []);

  // Upgrade preview: the moved packet is discovered as failing.
  const dryRun = runCommand(COMPAT_COMMANDS.upgrade_dry_run);
  assert.equal(dryRun.status, 1, dryRun.stdout + dryRun.stderr);
  assert.ok(
    dryRun.stdout.includes(`failing ${PACKET}`),
    `the preview must name the failing packet: ${dryRun.stdout}${dryRun.stderr}`,
  );

  // Upgrade: the repair runs and the packet passes afterwards.
  const upgrade = runCommand(COMPAT_COMMANDS.upgrade_apply);
  assert.equal(upgrade.status, 0, upgrade.stdout + upgrade.stderr);
  assert.ok(upgrade.stdout.includes('after=1/1'), upgrade.stdout + upgrade.stderr);

  // Validation: validate.sh prefers the built orchestrator and falls back to
  // the TypeScript source through the linked node_modules, so the packet must
  // pass with or without a runtime build in the copied skill.
  const validation = spawnSync(
    'bash',
    [path.join(copy, 'runtime/cli/spec/validate.sh'), PACKET, '--strict'],
    { cwd: sandbox, env, encoding: 'utf8' },
  );
  assert.equal(validation.status, 0, validation.stdout + validation.stderr);

  // The move and the upgrade write under the spec roots and the git directory
  // only; every path under .skilled/ must be left as it was.
  for (const line of git('status', '--porcelain').split('\n').filter(Boolean)) {
    for (const shown of line.slice(3).split(' -> ')) {
      assert.ok(!shown.startsWith('.skilled/'), `the workflow must leave .skilled/ untouched: ${line}`);
    }
  }
});
