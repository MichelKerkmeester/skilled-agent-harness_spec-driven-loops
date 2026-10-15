#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-git Setup Battery Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the setup battery as a process against throwaway repositories with an
// isolated git environment, so every verdict is observed through the JSON report,
// the human STATUS line and the exit code, and an inspected tree can prove that
// nothing planted inside it ever ran.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'git-setup-check.cjs');
const OWN_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const HOOKS_SOURCE = path.join(OWN_ROOT, 'scripts', 'git-hooks');

const CHECK_IDS = [
  'install',
  'hooks',
  'trust',
  'gates',
  'standards',
  'allowlist',
  'worktrees',
  'commit-id',
  'advisory-rules',
  'suppression',
  'ai-tool-hooks',
];

const TOOL_FILES = {
  claude: '.claude/settings.json',
  codex: '.codex/hooks.json',
  devin: '.devin/hooks.v1.json',
  cursor: '.cursor/hooks.json',
  opencode: '.opencode/plugins/sk-git-preflight-advisory.js',
  pi: '.pi/extensions/git-preflight-advisory.ts',
};

const RESULTS = ['PASS', 'FAIL', 'SKIP', 'UNKNOWN'];

// The child must not inherit the operator's git identity, repository redirection,
// runtime detection or hook switches, or a setting outside the fixture would decide
// a verdict this battery is supposed to report.
const ISOLATED_DROP = /^(GIT_DIR|GIT_WORK_TREE|GIT_CONFIG_COUNT|GIT_CONFIG_KEY_[0-9]+|GIT_CONFIG_VALUE_[0-9]+|CLAUDECODE|SYSTEM_HOOKS_DISABLED|SYSTEM_GIT_COMMIT_HOOKS_DISABLED)$/;

function isolatedEnv(dir) {
  const globalConfig = path.join(dir, 'global.gitconfig');
  fs.writeFileSync(globalConfig, '');
  const env = { ...process.env, GIT_CONFIG_GLOBAL: globalConfig, GIT_CONFIG_NOSYSTEM: '1' };
  for (const name of Object.keys(env)) {
    if (ISOLATED_DROP.test(name)) delete env[name];
  }
  return env;
}

// A fresh repository plus the isolated environment and the runner every test
// drives the battery through.
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, 'repo');
  const env = isolatedEnv(dir);
  execFileSync('git', ['init', '-q', repo], { env });
  const run = (args = [], extraEnv = {}) => {
    const result = spawnSync(process.execPath, [SCRIPT, ...args], {
      encoding: 'utf8',
      cwd: repo,
      env: { ...env, ...extraEnv },
    });
    return {
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      out: `${result.stdout}${result.stderr}`,
    };
  };
  return { dir, repo, env, run };
}

// A byte-level identity for the fixture tree, .git included: a read-only battery
// must leave every byte as it found it, so content is compared rather than the
// timestamps git refreshes on its own.
function snapshotTree(root) {
  const snapshot = new Map();
  const walk = (directory, prefix) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      const absolute = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        snapshot.set(relative, `link:${fs.readlinkSync(absolute)}`);
      } else if (entry.isDirectory()) {
        snapshot.set(relative, 'dir');
        walk(absolute, relative);
      } else if (entry.isFile()) {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
        snapshot.set(relative, `sha256:${digest}`);
      }
    }
  };
  walk(root, '');
  return snapshot;
}

const reportOf = (result) => JSON.parse(result.stdout);

function rowOf(report, id) {
  const row = report.checks.find((check) => check.id === id);
  assert.ok(row, `the report must carry the ${id} check`);
  return row;
}

const lastLine = (text) => text.trimEnd().split('\n').pop();

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('--json prints one object with the eleven checks in contract order', (t) => {
  const f = fixture(t);
  const result = f.run(['--json']);
  const report = reportOf(result);

  assert.equal(fs.realpathSync(report.repo), fs.realpathSync(f.repo));
  assert.deepEqual(report.checks.map((check) => check.id), CHECK_IDS);
  for (const check of report.checks) {
    assert.ok(RESULTS.includes(check.result), `${check.id}: unknown result ${check.result}`);
    assert.equal(typeof check.source, 'string');
    assert.ok(check.source.length > 0, `${check.id}: source must not be empty`);
    assert.ok(Array.isArray(check.details), `${check.id}: details must be an array`);
    assert.ok(
      check.details.every((detail) => typeof detail === 'string'),
      `${check.id}: details must be strings`,
    );
    assert.ok(
      check.repair === null || typeof check.repair === 'string',
      `${check.id}: repair must be null or a string`,
    );
  }

  const failed = report.checks.some((check) => check.result === 'FAIL');
  assert.equal(report.status, failed ? 'FAIL' : 'OK');
  assert.equal(result.status, failed ? 1 : 0);
});

test('human mode ends with the STATUS line that decides the exit code', (t) => {
  const f = fixture(t);

  const clean = f.run();
  const last = lastLine(clean.stdout);
  assert.match(last, /^STATUS=/);
  assert.equal(clean.status, last.startsWith('STATUS=OK') ? 0 : 1);
  assert.equal(last, 'STATUS=FAIL failed=1 skipped=2 unknown=0');

  // Installing every hook the checkout ships is what turns the same fixture into
  // the STATUS=OK direction of the mapping.
  const hooksDir = path.join(f.repo, '.git', 'hooks');
  for (const entry of fs.readdirSync(HOOKS_SOURCE, { withFileTypes: true })) {
    if (entry.isFile() && entry.name !== 'README.md') {
      fs.symlinkSync(path.join(HOOKS_SOURCE, entry.name), path.join(hooksDir, entry.name));
    }
  }
  const installed = f.run();
  assert.equal(lastLine(installed.stdout), 'STATUS=OK checks=11');
  assert.equal(installed.status, 0);
});

test('a non-repository, an unknown flag and an unknown tool are usage errors', (t) => {
  const f = fixture(t);
  const plain = path.join(f.dir, 'not-a-repo');
  fs.mkdirSync(plain);

  const outside = f.run(['--repo', plain]);
  assert.equal(outside.status, 2);
  assert.match(outside.stderr, /^Usage: node /);

  const unknownFlag = f.run(['--bogus']);
  assert.equal(unknownFlag.status, 2);
  assert.match(unknownFlag.stderr, /^Usage: node /);

  const unknownTool = f.run(['--tool', 'nope']);
  assert.equal(unknownTool.status, 2);
  assert.match(unknownTool.stderr, /^Usage: node /);
});

test('a run leaves the fixture tree, .git included, and its local config unchanged', (t) => {
  const f = fixture(t);
  const before = snapshotTree(f.repo);
  assert.ok(before.has('.git/config'), 'the snapshot must cover .git, not just the worktree');
  const configBefore = execFileSync('git', ['-C', f.repo, 'config', '--list', '--local'], {
    encoding: 'utf8',
    env: f.env,
  });

  f.run(['--json']);

  assert.deepEqual(snapshotTree(f.repo), before);
  const configAfter = execFileSync('git', ['-C', f.repo, 'config', '--list', '--local'], {
    encoding: 'utf8',
    env: f.env,
  });
  assert.equal(configAfter, configBefore);
});

test('an untrusted clone runs neither its planted helper nor its fsmonitor program', (t) => {
  const f = fixture(t);
  const helperMarker = path.join(f.dir, 'validate-message.marker');
  const fsmonitorMarker = path.join(f.dir, 'fsmonitor.marker');

  // A clone can plant any helper under the paths the toolchain uses, so the
  // fixture carries an executable that writes a marker the moment it runs.
  fs.mkdirSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), '# planted\n');
  const helper = path.join(f.repo, '.skilled', 'skills', 'sk-git', 'scripts', 'validate-message.mjs');
  fs.mkdirSync(path.dirname(helper), { recursive: true });
  fs.writeFileSync(
    helper,
    `import { writeFileSync } from 'node:fs';\nwriteFileSync(${JSON.stringify(helperMarker)}, 'ran');\n`,
  );

  // The installer bails out before it can reach the validator when the repository
  // carries no hook sources, so the fixture ships one: a battery that shells out
  // to the installer must now run the planted helper for the marker to stay absent.
  const hookSource = path.join(f.repo, '.skilled', 'scripts', 'git-hooks');
  fs.mkdirSync(hookSource, { recursive: true });
  fs.writeFileSync(path.join(hookSource, 'pre-commit'), '#!/usr/bin/env bash\nexit 0\n');
  fs.chmodSync(path.join(hookSource, 'pre-commit'), 0o755);

  // A configured fsmonitor program runs on some git queries even while a
  // repository is only being read, so it is pointed at a second marker.
  execFileSync(
    'git',
    ['-C', f.repo, 'config', '--local', 'core.fsmonitor', `sh -c 'echo ran > ${fsmonitorMarker}'`],
    { env: f.env },
  );

  const report = reportOf(f.run(['--json']));
  const trust = rowOf(report, 'trust');
  assert.equal(trust.result, 'SKIP');
  assert.ok(trust.details.some((detail) => detail.includes('untrusted')));
  assert.equal(fs.existsSync(helperMarker), false);
  assert.equal(fs.existsSync(fsmonitorMarker), false);
});

test('standards fails a missing configured contract dir and reports an absent contract', (t) => {
  const f = fixture(t);
  const missing = path.join(f.repo, 'contracts-not-installed');
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'skgit.contractDir', missing], { env: f.env });

  const broken = rowOf(reportOf(f.run(['--json'])), 'standards');
  assert.equal(broken.result, 'FAIL');
  assert.equal(broken.repair, '/doctor:git standards');
  assert.ok(broken.details.some((detail) => detail.includes(missing)));

  execFileSync('git', ['-C', f.repo, 'config', '--local', '--unset', 'skgit.contractDir'], { env: f.env });
  const absent = rowOf(reportOf(f.run(['--json'])), 'standards');
  assert.equal(absent.result, 'PASS');
  assert.ok(absent.details.some((detail) => detail.includes('not enforced')));
});

test('standards passes an enforced .sk-git contract and fails a malformed rules block', (t) => {
  const f = fixture(t);
  const contractDir = path.join(f.repo, '.sk-git');
  fs.mkdirSync(contractDir);
  for (const name of ['commit-message-template.md', 'pr-template.md', 'worktree-checklist.md']) {
    fs.copyFileSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'assets', name), path.join(contractDir, name));
  }

  const enforced = rowOf(reportOf(f.run(['--json'])), 'standards');
  assert.equal(enforced.result, 'PASS');
  for (const kind of ['commit', 'pr', 'branch']) {
    assert.ok(enforced.details.some((detail) => detail.startsWith(`${kind} enforced`)), kind);
  }

  // A doubled comma makes the branch rules block invalid JSON, which the hooks
  // would refuse on every push, so the check must fail rather than read it as absent.
  const branchFile = path.join(contractDir, 'worktree-checklist.md');
  fs.writeFileSync(branchFile, fs.readFileSync(branchFile, 'utf8').replace('"kind": "branch",', '"kind": "branch",,'));
  const malformed = rowOf(reportOf(f.run(['--json'])), 'standards');
  assert.equal(malformed.result, 'FAIL');
  assert.equal(malformed.repair, '/doctor:git standards');
  assert.ok(malformed.details.some((detail) => detail.includes('not valid JSON')));
});

test('a hard rule naming an unknown check fails advisory-rules by rule id', (t) => {
  const f = fixture(t);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-root-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // The copy resolves its own install root from its location, so the planted
  // rule file is the one it reads while the shared scripts stay the real ones.
  const installRoot = path.join(root, '.skilled');
  const fakeSkill = path.join(installRoot, 'skills', 'sk-git');
  const scriptCopy = path.join(installRoot, 'commands', 'doctor', 'scripts', 'git-setup-check.cjs');
  fs.mkdirSync(path.dirname(scriptCopy), { recursive: true });
  fs.mkdirSync(fakeSkill, { recursive: true });
  fs.copyFileSync(SCRIPT, scriptCopy);
  fs.writeFileSync(path.join(fakeSkill, 'hard-rules.json'), JSON.stringify([
    { id: 'planted-rule', check: 'no-such-check', message: 'never dispatched', severity: 'warn' },
  ]));
  fs.symlinkSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts'), path.join(fakeSkill, 'scripts'), 'dir');
  fs.symlinkSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'SKILL.md'), path.join(fakeSkill, 'SKILL.md'), 'file');

  const result = spawnSync(process.execPath, [scriptCopy, '--repo', f.repo, '--json'], {
    encoding: 'utf8',
    cwd: f.repo,
    env: f.env,
  });
  assert.equal(result.status, 1, result.stderr);

  const row = rowOf(reportOf(result), 'advisory-rules');
  assert.equal(row.result, 'FAIL');
  assert.ok(row.details.some((detail) => detail.includes('planted-rule')));
});

test('ai-tool-hooks fails a missing registration, passes a registered one, and skips without a tool', (t) => {
  const f = fixture(t);

  const absent = rowOf(reportOf(f.run(['--tool', 'codex', '--json'])), 'ai-tool-hooks');
  assert.equal(absent.result, 'FAIL');
  assert.match(absent.repair, /^register git-preflight-advisory in \.codex\/hooks\.json/);

  fs.mkdirSync(path.join(f.repo, '.codex'), { recursive: true });
  fs.writeFileSync(
    path.join(f.repo, '.codex', 'hooks.json'),
    JSON.stringify({ hooks: { SessionStart: [{ command: 'git-preflight-advisory' }] } }),
  );
  const registered = rowOf(reportOf(f.run(['--tool', 'codex', '--json'])), 'ai-tool-hooks');
  assert.equal(registered.result, 'PASS');

  const skipped = rowOf(reportOf(f.run(['--json'])), 'ai-tool-hooks');
  assert.equal(skipped.result, 'SKIP');
  const details = skipped.details.join('\n');
  for (const [tool, file] of Object.entries(TOOL_FILES)) {
    assert.ok(details.includes(`${tool}: not checked (${file})`), `${tool} must be named as not checked`);
  }
});

test('a truthy SYSTEM_HOOKS_DISABLED fails suppression with its unset repair', (t) => {
  const f = fixture(t);
  const row = rowOf(reportOf(f.run(['--json'], { SYSTEM_HOOKS_DISABLED: '1' })), 'suppression');
  assert.equal(row.result, 'FAIL');
  assert.equal(row.repair, 'unset SYSTEM_HOOKS_DISABLED');
  assert.ok(row.details.some((detail) => detail.includes('SYSTEM_HOOKS_DISABLED=1')));
});

test('allowlist reports a release branch as exempt, not refused', (t) => {
  const f = fixture(t);
  const row = rowOf(reportOf(f.run(['--json'])), 'allowlist');
  assert.equal(row.result, 'PASS');
  assert.ok(row.details.includes('main: allowed'));
  assert.ok(row.details.some((detail) => detail.startsWith('skilled/v4.0.0.0: exempt')));
  assert.ok(row.details.includes('feature/setup-check-probe: refused'));
});
