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

const RESULTS = ['PASS', 'FAIL', 'SKIP', 'UNKNOWN', 'DEGRADED'];

// The child must not inherit the operator's git identity, repository redirection,
// runtime detection or hook switches, or a setting outside the fixture would decide
// a verdict this battery is supposed to report.
const ISOLATED_DROP = /^(GIT_DIR|GIT_WORK_TREE|GIT_CONFIG_COUNT|GIT_CONFIG_KEY_[0-9]+|GIT_CONFIG_VALUE_[0-9]+|CLAUDECODE|SYSTEM_HOOKS_DISABLED|SYSTEM_GIT_COMMIT_HOOKS_DISABLED|MK_HOOKS_DISABLED|SK_GIT_PREFLIGHT_DISABLED|MK_GIT_PREFLIGHT_DISABLED|SKGIT_ADVISORY|SKGIT_ADVISORY_SKIP|SPECKIT_WORKTREE_BASE|HOOK_FLAGS_CONFIG)$/;

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

// A fake install root whose gate helper is a stub, so how the gates row reads a
// helper failure and a report shape can be observed without the real registry.
function fakeRoot(t, gateHelperSource) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-root-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const installRoot = path.join(root, '.skilled');
  const scriptsDir = path.join(installRoot, 'commands', 'doctor', 'scripts');
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(scriptsDir, 'git-setup-check.cjs'));
  fs.writeFileSync(path.join(scriptsDir, 'git-hook-gates.cjs'), gateHelperSource);
  fs.symlinkSync(path.join(OWN_ROOT, 'skills'), path.join(installRoot, 'skills'), 'dir');
  fs.symlinkSync(path.join(OWN_ROOT, 'scripts'), path.join(installRoot, 'scripts'), 'dir');
  return path.join(scriptsDir, 'git-setup-check.cjs');
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

// The status fold is observed through the real main() and its exit code, so
// the checks are stubbed in a child process. Stubbing in this process would
// write reports into the test runner's own stdout and never exercise the
// exit path being asserted.
const STUB_PROGRAM = `
const battery = require(process.argv[1]);
const results = JSON.parse(process.argv[2]);
battery.CHECKS.forEach((check, i) => {
  check.run = () => ({ result: results[i], source: 'stub', details: [], repair: results[i] === 'FAIL' || results[i] === 'DEGRADED' ? 'stub repair' : null });
});
battery.main(process.argv.slice(3)).then((code) => { process.exitCode = code; });
`;
function runStubbed(f, results, args) {
  return spawnSync(process.execPath, ['-e', STUB_PROGRAM, SCRIPT, JSON.stringify(results), '--repo', f.repo, ...args], { encoding: 'utf8', cwd: f.repo, env: f.env });
}

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
});

test('human mode ends with the STATUS line that decides the exit code', (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.repo, '.claude'), { recursive: true });
  fs.writeFileSync(
    path.join(f.repo, '.claude', 'settings.json'),
    JSON.stringify({ hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'node git-preflight-advisory.mjs' }] }] } }),
  );

  const clean = f.run(['--tool', 'claude']);
  const last = lastLine(clean.stdout);
  assert.match(last, /^STATUS=/);
  assert.equal(last, 'STATUS=FAIL failed=1 degraded=0 skipped=1 unknown=0');
  assert.equal(clean.status, 1);

  // Installing every hook the checkout ships is what turns the same fixture into
  // the STATUS=OK direction of the mapping.
  const hooksDir = path.join(f.repo, '.git', 'hooks');
  for (const entry of fs.readdirSync(HOOKS_SOURCE, { withFileTypes: true })) {
    if (entry.isFile() && entry.name !== 'README.md') {
      fs.symlinkSync(path.join(HOOKS_SOURCE, entry.name), path.join(hooksDir, entry.name));
    }
  }
  const installed = f.run(['--tool', 'claude']);
  assert.equal(lastLine(installed.stdout), 'STATUS=OK checks=11');
  assert.equal(installed.status, 0);
});

test('human mode prints every row and every repair line for a run with several failures', (t) => {
  const f = fixture(t);
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'speckit.hooks.commentHygiene', 'off'], { env: f.env });
  const result = f.run(['--tool', 'codex'], { SYSTEM_HOOKS_DISABLED: '1' });
  const lines = result.stdout.trimEnd().split('\n');
  const rowLines = lines.filter((line) => /^(PASS|FAIL|SKIP|UNKNOWN|DEGRADED) +\S/.test(line));
  assert.deepEqual(rowLines, [
    'PASS     install',
    'FAIL     hooks',
    'SKIP     trust',
    'DEGRADED gates',
    'PASS     standards',
    'PASS     allowlist',
    'PASS     worktrees',
    'PASS     commit-id',
    'PASS     advisory-rules',
    'FAIL     suppression',
    'FAIL     ai-tool-hooks',
  ]);
  const repairLines = lines.filter((line) => line.startsWith('      repair: '));
  assert.deepEqual(repairLines, [
    `      repair: git config core.hooksPath ${HOOKS_SOURCE}`,
    '      repair: /doctor:git hooks',
    '      repair: unset SYSTEM_HOOKS_DISABLED',
    '      repair: register git-preflight-advisory in .codex/hooks.json (see .skilled/skills/sk-git/scripts/hooks/README.md section 3)',
  ]);
  assert.equal(lines[lines.length - 1], 'STATUS=FAIL failed=3 degraded=1 skipped=1 unknown=0');
  assert.equal(result.status, 1);
});

test('the status fold maps rows to OK 0, DEGRADED 3 and FAIL 1 in both modes', (t) => {
  const f = fixture(t);
  const rowsFor = (changes) => {
    const rows = Array.from({ length: 11 }, () => 'PASS');
    for (const [index, result] of changes) rows[index] = result;
    return rows;
  };
  const cases = [
    { rows: rowsFor([]), status: 'OK', code: 0, line: 'STATUS=OK checks=11' },
    { rows: rowsFor([[0, 'SKIP']]), status: 'OK', code: 0, line: 'STATUS=OK checks=11' },
    { rows: rowsFor([[1, 'UNKNOWN']]), status: 'DEGRADED', code: 3, line: 'STATUS=DEGRADED degraded=0 skipped=0 unknown=1' },
    { rows: rowsFor([[2, 'DEGRADED']]), status: 'DEGRADED', code: 3, line: 'STATUS=DEGRADED degraded=1 skipped=0 unknown=0', repair: 'stub repair' },
    { rows: rowsFor([[3, 'FAIL']]), status: 'FAIL', code: 1, line: 'STATUS=FAIL failed=1 degraded=0 skipped=0 unknown=0' },
    { rows: rowsFor([[4, 'FAIL'], [5, 'UNKNOWN']]), status: 'FAIL', code: 1, line: 'STATUS=FAIL failed=1 degraded=0 skipped=0 unknown=1' },
  ];

  for (const c of cases) {
    const json = runStubbed(f, c.rows, ['--json']);
    assert.equal(JSON.parse(json.stdout).status, c.status, `${c.line}: JSON status`);
    assert.equal(json.status, c.code, `${c.line}: JSON exit code`);

    const human = runStubbed(f, c.rows, []);
    assert.equal(lastLine(human.stdout), c.line, `${c.line}: human status line`);
    assert.equal(human.status, c.code, `${c.line}: human exit code`);
    if (c.repair) {
      assert.ok(human.stdout.includes(`      repair: ${c.repair}`), `${c.line}: repair line`);
    }
  }
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

  // The battery loads helpers from its own skill and command trees and its child
  // processes may use the temp directory, so a read-only run must leave those
  // byte-identical too, not only the repository it inspects.
  const skillBefore = snapshotTree(path.join(OWN_ROOT, 'skills', 'sk-git'));
  const commandBefore = snapshotTree(path.join(OWN_ROOT, 'commands', 'doctor'));
  const tmp = path.join(f.dir, 'tmp');
  fs.mkdirSync(tmp);
  const tmpBefore = snapshotTree(tmp);

  const configBefore = execFileSync('git', ['-C', f.repo, 'config', '--list', '--local'], {
    encoding: 'utf8',
    env: f.env,
  });

  f.run(['--json'], { TMPDIR: tmp, TMP: tmp, TEMP: tmp });

  assert.deepEqual(snapshotTree(f.repo), before);
  assert.deepEqual(
    snapshotTree(path.join(OWN_ROOT, 'skills', 'sk-git')),
    skillBefore,
    'the battery left its own sk-git skill tree changed',
  );
  assert.deepEqual(
    snapshotTree(path.join(OWN_ROOT, 'commands', 'doctor')),
    commandBefore,
    'the battery left its own doctor command tree changed',
  );
  assert.deepEqual(snapshotTree(tmp), tmpBefore, 'the battery left the temp directory changed');
  const configAfter = execFileSync('git', ['-C', f.repo, 'config', '--list', '--local'], {
    encoding: 'utf8',
    env: f.env,
  });
  assert.equal(configAfter, configBefore);
});

test('an untrusted clone runs neither its planted helper nor its fsmonitor program', (t) => {
  const f = fixture(t);
  const helperMarker = path.join(f.dir, 'helper.marker');
  const fsmonitorMarker = path.join(f.dir, 'fsmonitor.marker');

  // A clone can plant any helper under the paths the toolchain uses, so the
  // fixture plants the two modules the standards and advisory-rules rows import
  // from the battery's own root: message-contract.mjs answers the standards row
  // and git-rule-checks.mjs the advisory-rules row, and each one writes a marker
  // the moment it loads, so a battery that resolved either module from the
  // inspected repository would leave that marker behind.
  fs.mkdirSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), '# planted\n');
  const plantedSource = `import { writeFileSync } from 'node:fs';\nwriteFileSync(${JSON.stringify(helperMarker)}, 'ran');\nexport const GIT_CHECKS = {};\nexport function resolveContractDir() { return null; }\nexport function loadContract() { return null; }\n`;
  const plantedLib = path.join(f.repo, '.skilled', 'skills', 'sk-git', 'scripts', 'lib');
  fs.mkdirSync(plantedLib, { recursive: true });
  fs.writeFileSync(path.join(plantedLib, 'message-contract.mjs'), plantedSource);
  fs.writeFileSync(path.join(plantedLib, 'git-rule-checks.mjs'), plantedSource);

  // The installer refuses a source root that carries no hook tree, so the
  // fixture ships one: the inspected repository looks like a complete toolchain
  // install rather than one an installer would give up on.
  const hookSource = path.join(f.repo, '.skilled', 'scripts', 'git-hooks');
  fs.mkdirSync(hookSource, { recursive: true });
  fs.writeFileSync(path.join(hookSource, 'pre-commit'), '#!/usr/bin/env bash\nexit 0\n');
  fs.chmodSync(path.join(hookSource, 'pre-commit'), 0o755);

  // A configured fsmonitor program runs on git queries that refresh the index,
  // such as git status. None of the battery's current queries does, so this
  // marker guards a future one. The gpg.program test covers the helper path
  // that a repository config can reach today.
  execFileSync(
    'git',
    ['-C', f.repo, 'config', '--local', 'core.fsmonitor', `sh -c 'echo ran > ${fsmonitorMarker}'`],
    { env: f.env },
  );

  const report = reportOf(f.run(['--json']));
  const trust = rowOf(report, 'trust');
  assert.equal(trust.result, 'SKIP');
  assert.ok(trust.details.some((detail) => detail.includes('untrusted')));
  // Both rows reached their real module: standards reports the contract dir its
  // module resolved, and advisory-rules passes because the real GIT_CHECKS table
  // names every rule where the planted empty table would fail them all.
  assert.ok(
    rowOf(report, 'standards').details.some((detail) => detail.startsWith('contract dir:')),
  );
  assert.equal(rowOf(report, 'advisory-rules').result, 'PASS');
  assert.equal(fs.existsSync(helperMarker), false);
  assert.equal(fs.existsSync(fsmonitorMarker), false);
});

test('standards fails a missing configured contract dir and reports an absent contract', (t) => {
  const f = fixture(t);
  const missing = path.join(f.repo, 'contracts-not-installed');
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'skgit.contractDir', missing], { env: f.env });

  const broken = rowOf(reportOf(f.run(['--json'])), 'standards');
  assert.equal(broken.result, 'FAIL');
  assert.equal(broken.repair, `git config --local --unset skgit.contractDir, or mkdir -p ${missing}`);
  assert.ok(broken.details.some((detail) => detail.includes(missing)));

  // The first alternative of the printed repair is applied exactly as printed, so
  // the command an operator would run is the one that turns the row PASS.
  execFileSync('bash', ['-c', broken.repair.split(', or ')[0]], { env: f.env, cwd: f.repo });
  const absent = rowOf(reportOf(f.run(['--json'])), 'standards');
  assert.equal(absent.result, 'PASS');
  assert.ok(absent.details.some((detail) => detail.includes('not enforced')));
});

test('standards names the global scope when the missing contract dir is set globally', (t) => {
  const f = fixture(t);
  execFileSync('git', ['config', '--global', 'skgit.contractDir', path.join(f.dir, 'nowhere')], { env: f.env });

  const row = rowOf(reportOf(f.run(['--json'])), 'standards');
  assert.equal(row.result, 'FAIL');
  assert.ok(row.repair.startsWith('git config --global --unset skgit.contractDir'), row.repair);
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

test('ai-tool-hooks requires the active tool and every configured adapter to register', (t) => {
  const f = fixture(t);

  const absent = rowOf(reportOf(f.run(['--tool', 'codex', '--json'])), 'ai-tool-hooks');
  assert.equal(absent.result, 'FAIL');
  assert.match(absent.repair, /^register git-preflight-advisory in \.codex\/hooks\.json/);
  assert.ok(absent.details.includes('codex (active): not set up (.codex/hooks.json)'));

  fs.mkdirSync(path.join(f.repo, '.codex'), { recursive: true });
  fs.writeFileSync(
    path.join(f.repo, '.codex', 'hooks.json'),
    JSON.stringify({ hooks: { PreToolUse: [{ matcher: 'exec|Bash', hooks: [{ type: 'command', command: 'node git-preflight-advisory.mjs' }] }] } }),
  );
  const registered = rowOf(reportOf(f.run(['--tool', 'codex', '--json'])), 'ai-tool-hooks');
  assert.equal(registered.result, 'PASS');
  assert.ok(registered.details.includes('codex (active): registered (.codex/hooks.json)'));

  const noTool = rowOf(reportOf(f.run(['--json'])), 'ai-tool-hooks');
  assert.equal(noTool.result, 'UNKNOWN');
  assert.ok(noTool.details[0].includes('--tool'));
  for (const [tool, file] of Object.entries(TOOL_FILES)) {
    if (tool === 'codex') continue;
    assert.ok(noTool.details.includes(`${tool}: not set up (${file})`), `${tool} must be reported as not set up`);
  }

  // A configured adapter that is not the active tool still fails when it does
  // not register the advisory.
  fs.mkdirSync(path.join(f.repo, '.cursor'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.cursor', 'hooks.json'), JSON.stringify({ hooks: {} }));
  const unregistered = rowOf(reportOf(f.run(['--tool', 'codex', '--json'])), 'ai-tool-hooks');
  assert.equal(unregistered.result, 'FAIL');
  assert.match(unregistered.repair, /^register git-preflight-advisory in \.cursor\/hooks\.json/);
});

test('a truthy SYSTEM_HOOKS_DISABLED fails suppression with its unset repair', (t) => {
  const f = fixture(t);
  const row = rowOf(reportOf(f.run(['--json'], { SYSTEM_HOOKS_DISABLED: '1' })), 'suppression');
  assert.equal(row.result, 'FAIL');
  assert.equal(row.repair, 'unset SYSTEM_HOOKS_DISABLED');
  assert.ok(row.details.includes('SYSTEM_HOOKS_DISABLED=1 (env)'));
});

test('a master switch saved in hook-flags.env fails suppression and names its line', (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), '# sentinel\n');
  fs.mkdirSync(path.join(f.repo, '.skilled', 'hooks'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'hooks', 'hook-flags.env'), '# saved switches\nSYSTEM_HOOKS_DISABLED=1\n');

  const row = rowOf(reportOf(f.run(['--json'])), 'suppression');
  assert.equal(row.result, 'FAIL');
  assert.ok(row.details.includes('SYSTEM_HOOKS_DISABLED=1 (.skilled/hooks/hook-flags.env:2)'));
  assert.equal(row.repair, 'delete line 2 of .skilled/hooks/hook-flags.env (SYSTEM_HOOKS_DISABLED=1)');

  // An empty environment value is still a set value, so it wins over the file.
  const overridden = rowOf(reportOf(f.run(['--json'], { SYSTEM_HOOKS_DISABLED: '' })), 'suppression');
  assert.equal(overridden.result, 'PASS');
});

test('hook-flags.env parsing matches the hooks: BOM, quotes, trailing comment and HOOK_FLAGS_CONFIG', (t) => {
  const f = fixture(t);
  const flagsPath = path.join(f.dir, 'flags.env');
  fs.writeFileSync(flagsPath, '\uFEFFMK_HOOKS_DISABLED="yes" # saved\n');

  const row = rowOf(reportOf(f.run(['--json'], { HOOK_FLAGS_CONFIG: flagsPath })), 'suppression');
  assert.equal(row.result, 'FAIL');
  assert.ok(row.details.includes(`MK_HOOKS_DISABLED=yes (${flagsPath}:1)`));
  assert.equal(row.repair, `delete line 1 of ${flagsPath} (MK_HOOKS_DISABLED=yes)`);
});

test('allowlist reports a release branch as exempt, not refused', (t) => {
  const f = fixture(t);
  const row = rowOf(reportOf(f.run(['--json'])), 'allowlist');
  assert.equal(row.result, 'PASS');
  assert.ok(row.details.includes('main: allowed'));
  assert.ok(row.details.some((detail) => detail.startsWith('skilled/v4.0.0.0: exempt')));
  assert.ok(row.details.includes('feature/setup-check-probe: refused'));
});

test('allowlist reports UNKNOWN, not PASS, when the bash probe cannot run', (t) => {
  const f = fixture(t);
  // A PATH holding only git leaves bash unresolved, so no allowlist sample can be checked.
  const binDir = path.join(f.dir, 'git-only-bin');
  fs.mkdirSync(binDir);
  const realGit = process.env.PATH.split(path.delimiter)
    .filter((entry) => path.isAbsolute(entry))
    .map((entry) => path.join(entry, 'git'))
    .find((candidate) => fs.existsSync(candidate));
  fs.symlinkSync(realGit, path.join(binDir, 'git'));

  const row = rowOf(reportOf(f.run(['--json'], { PATH: binDir })), 'allowlist');
  assert.equal(row.result, 'UNKNOWN', row.details.join(' | '));
  assert.ok(row.details.some((detail) => detail.includes('not checked (cannot run bash')), row.details.join(' | '));
});

test('a symlinked allowlist is refused and none of its target lines are shown', (t) => {
  const f = fixture(t);
  const outside = path.join(f.dir, 'secret.txt');
  fs.writeFileSync(outside, 'secret-pattern-one\nsecret-pattern-two\n');
  const list = path.join(f.repo, '.skilled', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt');
  fs.mkdirSync(path.dirname(list), { recursive: true });
  fs.symlinkSync(outside, list);

  const row = rowOf(reportOf(f.run(['--json'])), 'allowlist');
  assert.equal(row.result, 'PASS');
  assert.ok(
    row.details.some((detail) => detail.startsWith('patterns (.skilled/skills/sk-git/scripts/remote-branch-allowlist.txt): not shown')),
    row.details.join(' | '),
  );
  assert.ok(!JSON.stringify(row).includes('secret-pattern'), row.details.join(' | '));
});

test('allowlist shows the patterns of the file the matcher used when both roots carry one', (t) => {
  const f = fixture(t);
  // The real directory wins over the legacy one, so only the patterns of the
  // file the matcher actually read may appear in the report.
  const real = path.join(f.repo, '.skilled', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt');
  fs.mkdirSync(path.dirname(real), { recursive: true });
  fs.writeFileSync(real, 'feature/*\n');
  const legacy = path.join(f.repo, '.opencode', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt');
  fs.mkdirSync(path.dirname(legacy), { recursive: true });
  fs.writeFileSync(legacy, 'release/*\n');

  const row = rowOf(reportOf(f.run(['--json'])), 'allowlist');
  assert.ok(row.details.includes('feature/setup-check-probe: allowed'), row.details.join(' | '));
  assert.ok(
    row.details.includes('patterns (.skilled/skills/sk-git/scripts/remote-branch-allowlist.txt): feature/*'),
    row.details.join(' | '),
  );
  assert.ok(!JSON.stringify(row.details).includes('release/*'), row.details.join(' | '));
});

test('a repository config cannot make a helper run gpg.program', (t) => {
  const f = fixture(t);
  const marker = path.join(f.dir, 'gpg-ran');
  const program = path.join(f.dir, 'fake-gpg.sh');
  fs.writeFileSync(program, `#!/bin/sh\necho ran >> "${marker}"\n`, { mode: 0o755 });
  const g = (args, input) => execFileSync('git', ['-C', f.repo, ...args], { env: f.env, encoding: 'utf8', input });
  g(['-c', 'user.email=a@b', '-c', 'user.name=a', 'commit', '-q', '--allow-empty', '-m', 'init']);
  const tree = g(['rev-parse', 'HEAD^{tree}']).trim();
  // A gpgsig header is enough for log to call gpg.program when showSignature is on.
  const body = `tree ${tree}\nauthor a <a@b> 1 +0000\ncommitter a <a@b> 1 +0000\ngpgsig -----BEGIN PGP SIGNATURE-----\n x\n -----END PGP SIGNATURE-----\n\nsigned\n`;
  const signed = g(['hash-object', '-t', 'commit', '-w', '--stdin'], body).trim();
  g(['update-ref', 'HEAD', signed]);
  g(['config', 'log.showSignature', 'true']);
  g(['config', 'gpg.program', program]);

  f.run(['--json']);
  assert.equal(fs.existsSync(marker), false, "the battery ran the repository's gpg.program");
});

test('hooks accepts links into the repository\'s own hook sources and names a repair that exists', (t) => {
  const f = fixture(t);
  const bare = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(bare.result, 'FAIL');
  assert.equal(bare.repair, `git config core.hooksPath ${HOOKS_SOURCE}`);

  // A repository that carries its own toolchain gets its hooks linked to its own copies.
  const ownSources = path.join(f.repo, '.skilled', 'scripts', 'git-hooks');
  fs.mkdirSync(ownSources, { recursive: true });
  fs.mkdirSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), 'sentinel\n');
  const names = [];
  for (const entry of fs.readdirSync(HOOKS_SOURCE, { withFileTypes: true })) {
    if (entry.isFile() && entry.name !== 'README.md') {
      fs.writeFileSync(path.join(ownSources, entry.name), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
      names.push(entry.name);
    }
  }

  // The sentinel says the clone carries a toolchain, not that it is this
  // checkout, so the repair still points at this checkout's hooks and never at
  // the clone's own installer.
  const foreign = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(foreign.result, 'FAIL');
  assert.equal(foreign.repair, `git config core.hooksPath ${HOOKS_SOURCE}`);
  assert.ok(!foreign.repair.includes('install-git-hooks.sh'));

  const hooksDir = path.join(f.repo, '.git', 'hooks');
  for (const name of names) {
    fs.symlinkSync(path.join(ownSources, name), path.join(hooksDir, name));
  }
  const own = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(own.result, 'PASS');
});

test('hooks fails a linked hook that is not executable', (t) => {
  const f = fixture(t);
  const ownSources = path.join(f.repo, '.skilled', 'scripts', 'git-hooks');
  fs.mkdirSync(ownSources, { recursive: true });
  fs.mkdirSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), 'sentinel\n');
  const names = fs.readdirSync(HOOKS_SOURCE, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== 'README.md')
    .map((entry) => entry.name);
  const hooksDir = path.join(f.repo, '.git', 'hooks');
  for (const name of names) {
    fs.writeFileSync(path.join(ownSources, name), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
    fs.symlinkSync(path.join(ownSources, name), path.join(hooksDir, name));
  }
  assert.equal(rowOf(reportOf(f.run(['--json'])), 'hooks').result, 'PASS');

  // Git skips a hook it cannot execute, so a linked hook without the execute bit gates nothing.
  fs.chmodSync(path.join(ownSources, names[0]), 0o644);
  const row = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(row.result, 'FAIL', row.details.join(' | '));
  assert.ok(row.details.some((detail) => detail.startsWith(`${names[0]}: not executable`)), row.details.join(' | '));
});

test('hooks names this checkout\'s installer by absolute path when the inspected repository is the battery\'s own checkout', (t) => {
  const f = fixture(t);

  // The battery's root lives inside the inspected repository, so both resolve
  // to one git common dir and the repair may name the installer this checkout
  // ships, by absolute path.
  const installRoot = path.join(fs.realpathSync(f.repo), '.skilled');
  const scriptsDir = path.join(installRoot, 'commands', 'doctor', 'scripts');
  fs.mkdirSync(scriptsDir, { recursive: true });
  const copy = path.join(scriptsDir, 'git-setup-check.cjs');
  fs.copyFileSync(SCRIPT, copy);
  fs.cpSync(HOOKS_SOURCE, path.join(installRoot, 'scripts', 'git-hooks'), { recursive: true });
  fs.copyFileSync(
    path.join(OWN_ROOT, 'scripts', 'install-git-hooks.sh'),
    path.join(installRoot, 'scripts', 'install-git-hooks.sh'),
  );
  fs.mkdirSync(path.join(installRoot, 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(installRoot, 'skills', 'system-spec-kit', 'SKILL.md'), '# sentinel\n');
  fs.symlinkSync(path.join(OWN_ROOT, 'skills', 'sk-git'), path.join(installRoot, 'skills', 'sk-git'), 'dir');

  const run = () => spawnSync(process.execPath, [copy, '--repo', f.repo, '--json'], {
    encoding: 'utf8',
    cwd: f.repo,
    env: f.env,
  });
  const row = rowOf(reportOf(run()), 'hooks');
  assert.equal(row.result, 'FAIL');
  assert.equal(row.repair, `bash ${path.join(installRoot, 'scripts', 'install-git-hooks.sh')}`);

  // The repair is applied exactly as printed, so the installer it names is the
  // one that turns the row PASS.
  execFileSync('bash', ['-c', row.repair], { cwd: f.repo, env: f.env, stdio: 'pipe' });
  assert.equal(rowOf(reportOf(run()), 'hooks').result, 'PASS');
});

test('a foreign repository applying the printed core.hooksPath repair turns hooks PASS', (t) => {
  const f = fixture(t);
  const broken = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(broken.result, 'FAIL');
  assert.equal(broken.repair, `git config core.hooksPath ${HOOKS_SOURCE}`);

  // The repair is applied exactly as printed, so the command an operator would
  // run is the one that turns the row PASS.
  execFileSync('bash', ['-c', broken.repair], { cwd: f.repo, env: f.env });
  assert.equal(rowOf(reportOf(f.run(['--json'])), 'hooks').result, 'PASS');
});

test('install names a repair that restores missing sk-git files', (t) => {
  const f = fixture(t);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-root-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // The copy resolves its install root from its own location, and this root has
  // SKILL.md and scripts/ but no hard-rules.json.
  const installRoot = path.join(root, '.skilled');
  const fakeSkill = path.join(installRoot, 'skills', 'sk-git');
  const scriptCopy = path.join(installRoot, 'commands', 'doctor', 'scripts', 'git-setup-check.cjs');
  fs.mkdirSync(path.dirname(scriptCopy), { recursive: true });
  fs.mkdirSync(fakeSkill, { recursive: true });
  fs.copyFileSync(SCRIPT, scriptCopy);
  fs.symlinkSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts'), path.join(fakeSkill, 'scripts'), 'dir');
  fs.symlinkSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'SKILL.md'), path.join(fakeSkill, 'SKILL.md'), 'file');

  const result = spawnSync(process.execPath, [scriptCopy, '--repo', f.repo, '--json'], {
    encoding: 'utf8',
    cwd: f.repo,
    env: f.env,
  });
  const row = rowOf(reportOf(result), 'install');
  assert.equal(row.result, 'FAIL');
  assert.ok(row.details.some((detail) => detail.includes('hard-rules.json')));
  // This root is not in a git work tree, so there is nothing to restore from
  // and the repair must name the reinstall, never a restore or /doctor:update.
  assert.equal(row.repair, 'reinstall sk-git from its source: this install root is not in a git work tree');
  assert.ok(!row.repair.includes('/doctor:update'));
});

test('install restores exactly the missing path of a git install root, and the restore turns the row PASS', (t) => {
  const f = fixture(t);
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-root-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // The copied battery resolves its install root from its own location, so the
  // checkout it repairs is this fixture's, and the committed tree holds every
  // file but the one deleted below.
  execFileSync('git', ['init', '-q', root], { env: f.env });
  const installRoot = path.join(root, '.skilled');
  const fakeSkill = path.join(installRoot, 'skills', 'sk-git');
  const scriptCopy = path.join(installRoot, 'commands', 'doctor', 'scripts', 'git-setup-check.cjs');
  fs.mkdirSync(path.dirname(scriptCopy), { recursive: true });
  fs.mkdirSync(path.join(fakeSkill, 'scripts'), { recursive: true });
  fs.copyFileSync(SCRIPT, scriptCopy);
  fs.copyFileSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'SKILL.md'), path.join(fakeSkill, 'SKILL.md'));
  fs.copyFileSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'hard-rules.json'), path.join(fakeSkill, 'hard-rules.json'));
  fs.writeFileSync(path.join(fakeSkill, 'scripts', '.keep'), '');
  execFileSync('git', ['-C', root, 'add', '-A'], { env: f.env });
  execFileSync('git', ['-C', root, '-c', 'user.email=a@b', '-c', 'user.name=a', 'commit', '-q', '-m', 'init'], { env: f.env });
  fs.rmSync(path.join(fakeSkill, 'hard-rules.json'));

  const result = spawnSync(process.execPath, [scriptCopy, '--repo', f.repo, '--json'], {
    encoding: 'utf8',
    cwd: f.repo,
    env: f.env,
  });
  const row = rowOf(reportOf(result), 'install');
  assert.equal(row.result, 'FAIL');
  assert.equal(row.repair, `git -C ${root} restore --source=HEAD -- .skilled/skills/sk-git/hard-rules.json`);

  // The repair is applied exactly as printed, so the command the operator would
  // run is the command that turns the row PASS.
  execFileSync('bash', ['-c', row.repair], { env: f.env, cwd: f.repo });
  const rerun = spawnSync(process.execPath, [scriptCopy, '--repo', f.repo, '--json'], {
    encoding: 'utf8',
    cwd: f.repo,
    env: f.env,
  });
  assert.equal(rowOf(reportOf(rerun), 'install').result, 'PASS');
});

test('trust reads skilled.trustRepoHooks as a boolean, as the hooks do', (t) => {
  const f = fixture(t);
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'skilled.trustRepoHooks', 'yes'], { env: f.env });
  const row = rowOf(reportOf(f.run(['--json'])), 'trust');
  assert.equal(row.result, 'PASS');
});

test('allowlist and worktree base resolve against the main worktree from a linked one', (t) => {
  const f = fixture(t);
  const g = (args) => execFileSync('git', ['-C', f.repo, ...args], { env: f.env, encoding: 'utf8' });
  g(['-c', 'user.email=a@b', '-c', 'user.name=a', 'commit', '-q', '--allow-empty', '-m', 'init']);
  const side = path.join(f.dir, 'side');
  g(['worktree', 'add', '-q', '--detach', side]);
  // An allowlist only in the linked worktree is one the matcher never reads.
  const sideList = path.join(side, '.skilled', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt');
  fs.mkdirSync(path.dirname(sideList), { recursive: true });
  fs.writeFileSync(sideList, 'feature/*\n');

  const report = reportOf(f.run(['--repo', side, '--json']));
  const allowlist = rowOf(report, 'allowlist');
  assert.ok(allowlist.details.includes('feature/setup-check-probe: refused'));
  assert.ok(allowlist.details.includes('patterns: no allowlist file, so only the built-in main exception applies'));
  const worktrees = rowOf(report, 'worktrees');
  assert.equal(worktrees.details[0], `base: ${path.join(fs.realpathSync(f.repo), '.worktrees')} (from default)`);
});

test('worktrees fails an unwritable base and a file at the base, and names the variable that set it', (t) => {
  if (process.getuid && process.getuid() === 0) {
    t.skip('root ignores file permissions');
    return;
  }

  const f = fixture(t);
  const unwritable = path.join(f.dir, 'wt-unwritable');
  fs.mkdirSync(unwritable);
  fs.chmodSync(unwritable, 0o555);
  t.after(() => {
    if (fs.existsSync(unwritable)) fs.chmodSync(unwritable, 0o755);
  });
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'speckit.worktreeBase', unwritable], { env: f.env });

  const unwritableRow = rowOf(reportOf(f.run(['--json'])), 'worktrees');
  assert.equal(unwritableRow.result, 'FAIL');
  assert.equal(unwritableRow.details[0], `base not writable: ${unwritable}`);
  assert.equal(unwritableRow.repair, 'git config speckit.worktreeBase <dir>');

  const asFile = path.join(f.dir, 'wt-file');
  fs.writeFileSync(asFile, 'x');
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'speckit.worktreeBase', asFile], { env: f.env });
  const fileRow = rowOf(reportOf(f.run(['--json'])), 'worktrees');
  assert.equal(fileRow.result, 'FAIL');
  assert.equal(fileRow.details[0], `base is not a directory: ${asFile}`);

  execFileSync('git', ['-C', f.repo, 'config', '--local', '--unset', 'speckit.worktreeBase'], { env: f.env });
  const envRow = rowOf(reportOf(f.run(['--json'], { SPECKIT_WORKTREE_BASE: asFile })), 'worktrees');
  assert.equal(envRow.result, 'FAIL');
  assert.equal(envRow.repair, 'export SPECKIT_WORKTREE_BASE=<writable dir>, or unset SPECKIT_WORKTREE_BASE');

  const missingRow = rowOf(reportOf(f.run(['--json'], { SPECKIT_WORKTREE_BASE: path.join(f.dir, 'not-yet', 'base') })), 'worktrees');
  assert.equal(missingRow.result, 'PASS');
});

test('ai-tool-hooks reads only the hooks section and Claude\'s local settings', (t) => {
  const f = fixture(t);
  const claudeDir = path.join(f.repo, '.claude');
  fs.mkdirSync(claudeDir, { recursive: true });

  // A deny rule that names the advisory is not a registration.
  fs.writeFileSync(path.join(claudeDir, 'settings.json'), JSON.stringify({
    permissions: { deny: ['Bash(node .claude/hooks/git-preflight-advisory.cjs)'] },
  }));
  const denied = rowOf(reportOf(f.run(['--tool', 'claude', '--json'])), 'ai-tool-hooks');
  assert.equal(denied.result, 'FAIL');

  // A registration in the local settings file counts.
  fs.rmSync(path.join(claudeDir, 'settings.json'));
  fs.writeFileSync(path.join(claudeDir, 'settings.local.json'), JSON.stringify({
    hooks: { PreToolUse: [{ hooks: [{ type: 'command', command: 'node git-preflight-advisory.mjs' }] }] },
  }));
  const local = rowOf(reportOf(f.run(['--tool', 'claude', '--json'])), 'ai-tool-hooks');
  assert.equal(local.result, 'PASS');
  assert.ok(local.details.includes('claude (active): registered (.claude/settings.local.json)'));
});

test('ai-tool-hooks accepts each runtime\'s real wiring and refuses a wrong event or matcher', (t) => {
  const REAL_ROOT = path.dirname(OWN_ROOT);
  const cases = {
    claude: { event: 'PreToolUse', wrongEvent: 'PostToolUse', wrongMatcher: 'Task' },
    codex: { event: 'PreToolUse', wrongEvent: 'SessionStart', wrongMatcher: 'exec' },
    devin: { event: 'PreToolUse', wrongEvent: 'PostToolUse', wrongMatcher: '^(edit|write)$' },
    cursor: { event: 'preToolUse', wrongEvent: 'postToolUse', wrongMatcher: 'Task' },
  };

  for (const [tool, c] of Object.entries(cases)) {
    const f = fixture(t);
    const file = TOOL_FILES[tool];
    const target = path.join(f.repo, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    // Only the active tool's adapter file exists, so no other adapter decides the row.
    for (const other of Object.values(TOOL_FILES)) {
      if (other !== file) fs.rmSync(path.join(f.repo, other), { force: true });
    }
    const realJson = () => JSON.parse(fs.readFileSync(path.join(REAL_ROOT, file), 'utf8'));
    const sectionOf = (json) => (tool === 'devin' ? json : json.hooks);
    const carriesAdvisory = (entry) => JSON.stringify(entry).includes('git-preflight-advisory');
    const write = (json) => fs.writeFileSync(target, JSON.stringify(json));
    const row = () => rowOf(reportOf(f.run(['--tool', tool, '--json'])), 'ai-tool-hooks');

    write(realJson());
    const registered = row();
    assert.equal(registered.result, 'PASS', `${tool}: ${registered.details.join(' | ')}`);
    assert.ok(
      registered.details.includes(`${tool} (active): registered (${file})`),
      `${tool}: ${registered.details.join(' | ')}`,
    );

    // The advisory under any other event is never dispatched.
    const moved = realJson();
    const movedSection = sectionOf(moved);
    const entries = Array.isArray(movedSection[c.event]) ? movedSection[c.event] : [];
    movedSection[c.event] = entries.filter((entry) => !carriesAdvisory(entry));
    movedSection[c.wrongEvent] = [
      ...(Array.isArray(movedSection[c.wrongEvent]) ? movedSection[c.wrongEvent] : []),
      ...entries.filter(carriesAdvisory),
    ];
    write(moved);
    assert.equal(row().result, 'FAIL', `${tool}: an advisory under ${c.wrongEvent} must not count`);

    // A matcher that misses a shell tool the runtime reports is never dispatched.
    const rewritten = realJson();
    const rewrittenSection = sectionOf(rewritten);
    for (const entry of rewrittenSection[c.event].filter(carriesAdvisory)) entry.matcher = c.wrongMatcher;
    write(rewritten);
    assert.equal(row().result, 'FAIL', `${tool}: a matcher that misses the shell tool must not count`);
  }
});

test('a run with no active tool and nothing broken is UNKNOWN and names --tool', (t) => {
  const f = fixture(t);

  // The fixture environment drops CLAUDECODE, so nothing selects a tool.
  const report = reportOf(f.run(['--json']));
  const row = rowOf(report, 'ai-tool-hooks');
  assert.equal(row.result, 'UNKNOWN');
  assert.equal(row.repair, null);
  assert.ok(row.details[0].includes('--tool'));
  assert.ok(['FAIL', 'DEGRADED'].includes(report.status), `unexpected status ${report.status}`);
});

test('opencode and pi pass only when the adapter registers its event and imports git-rule-checks.mjs', (t) => {
  const REAL_ROOT = path.dirname(OWN_ROOT);
  const cases = [
    ['opencode', '.opencode/plugins/sk-git-preflight-advisory.js'],
    ['pi', '.pi/extensions/git-preflight-advisory.ts'],
  ];

  for (const [tool, file] of cases) {
    const f = fixture(t);
    const target = path.join(f.repo, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });

    // A stub with neither the pre-tool event handler nor the shared module import.
    fs.writeFileSync(target, 'export default {};\n');
    const stub = rowOf(reportOf(f.run(['--tool', tool, '--json'])), 'ai-tool-hooks');
    assert.equal(stub.result, 'FAIL', `${tool}: ${stub.details.join(' | ')}`);
    assert.ok(
      stub.details.some((detail) => detail.startsWith(`${tool} (active): ${file} does not register`)),
      `${tool}: ${stub.details.join(' | ')}`,
    );

    // The real adapter comes from this checkout, whose pi path is a symlink into .skilled.
    fs.writeFileSync(target, fs.readFileSync(path.join(REAL_ROOT, file), 'utf8'));
    const real = rowOf(reportOf(f.run(['--tool', tool, '--json'])), 'ai-tool-hooks');
    assert.equal(real.result, 'PASS', `${tool}: ${real.details.join(' | ')}`);
    assert.ok(
      real.details.includes(`${tool} (active): registered (${file})`),
      `${tool}: ${real.details.join(' | ')}`,
    );
  }
});

test('opencode and pi fail an adapter that names the tokens without registering a handler', (t) => {
  const cases = [
    ['opencode', '.opencode/plugins/sk-git-preflight-advisory.js', "// Registers 'tool.execute.before' through git-rule-checks.mjs.\nexport default {};\n"],
    ['opencode', '.opencode/plugins/sk-git-preflight-advisory.js', "export const notes = ['tool.execute.before', 'git-rule-checks.mjs'];\n"],
    ['pi', '.pi/extensions/git-preflight-advisory.ts', "/* pi.on('tool_call', handler) imports git-rule-checks.mjs */\nexport default function noop() {}\n"],
    // A well-formed registration that only exists inside comments.
    ['opencode', '.opencode/plugins/sk-git-preflight-advisory.js', "// import { GIT_CHECKS } from '../lib/git-rule-checks.mjs';\n/* export default () => ({ async 'tool.execute.before'() {} }); */\nexport default {};\n"],
    // A real handler, with the shared module named only in a string.
    ['opencode', '.opencode/plugins/sk-git-preflight-advisory.js', "const helper = 'git-rule-checks.mjs';\nexport default () => ({ async 'tool.execute.before'(input) { return helper; } });\n"],
    // A real import, with the event named only in a list.
    ['opencode', '.opencode/plugins/sk-git-preflight-advisory.js', "import { GIT_CHECKS } from '../lib/git-rule-checks.mjs';\nexport const events = ['tool.execute.before', GIT_CHECKS];\nexport default {};\n"],
    ['pi', '.pi/extensions/git-preflight-advisory.ts', "const checks = import('../lib/git-rule-checks.mjs');\nexport const events = ['tool_call', checks];\nexport default function noop(pi) { pi.on('tool_result', () => {}); }\n"],
    // A real import, with the event bound to a value that is not a handler.
    ['opencode', '.opencode/plugins/sk-git-preflight-advisory.js', "import { GIT_CHECKS } from '../lib/git-rule-checks.mjs';\nexport default () => ({ meta: { 'tool.execute.before': false }, GIT_CHECKS });\n"],
    ['pi', '.pi/extensions/git-preflight-advisory.ts', "const checks = import('../lib/git-rule-checks.mjs');\nexport default function noop(pi) { pi.on('tool_call', null); return checks; }\n"],
  ];

  for (const [tool, file, body] of cases) {
    const f = fixture(t);
    const target = path.join(f.repo, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, body);
    const row = rowOf(reportOf(f.run(['--tool', tool, '--json'])), 'ai-tool-hooks');
    assert.equal(row.result, 'FAIL', `${tool}: ${row.details.join(' | ')}`);
    assert.ok(
      row.details.some((detail) => detail.startsWith(`${tool} (active): ${file} does not register`)),
      `${tool}: ${row.details.join(' | ')}`,
    );
  }
});

test('gates reports UNKNOWN with no repair when the helper fails or its report has no gates', (t) => {
  const f = fixture(t);
  const cases = [
    {
      helper: "process.stderr.write('registry exploded\\n'); process.exit(2);\n",
      detail: 'registry exploded',
    },
    {
      helper: "process.stdout.write('not json\\n');\n",
      detail: 'the gate report did not parse as JSON',
    },
    {
      helper: "process.stdout.write(JSON.stringify({ repo: 'x' }) + '\\nSTATUS=OK GATES=0 OFF=0\\n');\n",
      detail: 'the gate report carries no gates list',
    },
  ];

  for (const c of cases) {
    const copy = fakeRoot(t, c.helper);
    const result = spawnSync(process.execPath, [copy, '--repo', f.repo, '--json'], { encoding: 'utf8', cwd: f.repo, env: f.env });
    const row = rowOf(reportOf(result), 'gates');
    assert.equal(row.result, 'UNKNOWN', `${c.detail}: ${result.stderr}`);
    assert.equal(row.repair, null, c.detail);
    assert.ok(row.details.some((detail) => detail.includes(c.detail)), `${c.detail}: ${row.details.join(' | ')}`);
  }
});

test('a gate saved off degrades the run to exit 3 with the hooks repair', (t) => {
  const f = fixture(t);
  const hooksDir = path.join(f.repo, '.git', 'hooks');
  for (const entry of fs.readdirSync(HOOKS_SOURCE, { withFileTypes: true })) {
    if (entry.isFile() && entry.name !== 'README.md') {
      fs.symlinkSync(path.join(HOOKS_SOURCE, entry.name), path.join(hooksDir, entry.name));
    }
  }
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'speckit.hooks.commentHygiene', 'off'], { env: f.env });

  const result = f.run(['--json']);
  const report = reportOf(result);
  const row = rowOf(report, 'gates');
  assert.equal(row.result, 'DEGRADED');
  assert.equal(row.repair, '/doctor:git hooks');
  assert.ok(row.details.includes('commentHygiene: off (local config)'), row.details.join(' | '));
  assert.equal(report.status, 'DEGRADED');
  assert.equal(result.status, 3);
});

test('gates ignores a GATE_REGISTRY inherited from the environment', (t) => {
  const f = fixture(t);
  const row = rowOf(reportOf(f.run(['--json'], { GATE_REGISTRY: path.join(f.dir, 'no-such-registry.tsv') })), 'gates');
  assert.equal(row.result, 'PASS');
});

test('an exported GIT_DIR cannot point the probes at another repository', (t) => {
  const f = fixture(t);
  const other = path.join(f.dir, 'other');
  execFileSync('git', ['init', '-q', other], { env: f.env });
  execFileSync('git', ['-C', other, 'config', '--local', 'speckit.worktreeBase', path.join(f.dir, 'other-base')], { env: f.env });

  const report = reportOf(f.run(['--repo', f.repo, '--json'], { GIT_DIR: path.join(other, '.git') }));
  assert.equal(fs.realpathSync(report.repo), fs.realpathSync(f.repo));
  assert.ok(rowOf(report, 'worktrees').details[0].endsWith('(from default)'));
});

test('a relative or empty PATH entry cannot run a git or bash planted in the inspected repository', (t) => {
  const f = fixture(t);
  const marker = path.join(f.dir, 'planted.marker');
  for (const name of ['git', 'bash']) {
    fs.writeFileSync(
      path.join(f.repo, name),
      `#!/bin/sh\necho ran >> "${marker}"\nexit 1\n`,
      { mode: 0o755 },
    );
  }

  // '.', an empty entry and a trailing ':' all resolve against the child's
  // working directory, which is the inspected repository.
  const PATH = ['.', '', ...process.env.PATH.split(path.delimiter), ''].join(path.delimiter);
  const result = f.run(['--json'], { PATH });

  assert.equal(fs.existsSync(marker), false, 'a planted git or bash ran from a relative PATH entry');
  assert.equal(JSON.parse(result.stdout).checks.length, 11);
});

test('readRepoFile reads only a regular file under the cap', (t) => {
  const { readRepoFile, READ_CAP } = require(SCRIPT);
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-read-'));
  t.after(() => fs.rmSync(d, { recursive: true, force: true }));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-target-'));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));

  const fifo = path.join(d, 'fifo');
  execFileSync('mkfifo', [fifo]);
  const directory = path.join(d, 'directory');
  fs.mkdirSync(directory);
  const empty = path.join(d, 'empty');
  fs.writeFileSync(empty, '');
  const exact = path.join(d, 'exact');
  fs.writeFileSync(exact, 'a'.repeat(READ_CAP));
  const over = path.join(d, 'over');
  fs.writeFileSync(over, 'a'.repeat(READ_CAP + 1));
  const target = path.join(outside, 'target.txt');
  fs.writeFileSync(target, 'target text');
  const link = path.join(d, 'link');
  fs.symlinkSync(target, link);

  const cases = [
    { name: 'fifo', file: fifo, options: {}, text: null, problem: 'not a regular file' },
    { name: 'directory', file: directory, options: {}, text: null, problem: 'not a regular file' },
    { name: 'empty file', file: empty, options: {}, text: '', problem: null },
    { name: 'exactly the cap', file: exact, options: {}, text: 'a'.repeat(READ_CAP), problem: null },
    { name: 'past the cap', file: over, options: {}, text: null, problem: `larger than ${READ_CAP} bytes` },
    { name: 'refused symlink', file: link, options: { refuseSymlink: true }, text: null, problem: 'is a symlink' },
    { name: 'followed symlink', file: link, options: {}, text: 'target text', problem: null },
    { name: 'missing path', file: path.join(d, 'missing'), options: {}, text: null, problem: null },
  ];

  for (const c of cases) {
    const result = readRepoFile(c.file, c.options);
    assert.equal(result.problem, c.problem, `${c.name}: problem`);
    assert.equal(result.text, c.text, `${c.name}: text`);
  }
});

test('a FIFO at an adapter config path is reported, not read, and the run finishes', (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.repo, '.claude'), { recursive: true });
  execFileSync('mkfifo', [path.join(f.repo, '.claude', 'settings.json')]);

  const result = spawnSync(process.execPath, [SCRIPT, '--tool', 'claude', '--json'], {
    encoding: 'utf8',
    cwd: f.repo,
    env: f.env,
    timeout: 20000,
  });
  assert.equal(result.signal, null, 'the run was killed before it finished');
  assert.equal(typeof result.status, 'number');

  const row = rowOf(reportOf(result), 'ai-tool-hooks');
  assert.equal(row.result, 'FAIL');
  assert.ok(row.details.some((detail) => detail.includes('not a regular file')), row.details.join(' | '));
});

// Repair round trips: each printed repair, applied as printed, turns its row PASS.

test('round trip: the gates repair, run as the script /doctor:git hooks runs, turns gates PASS', (t) => {
  const f = fixture(t);
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'speckit.hooks.commentHygiene', 'off'], { env: f.env });

  const broken = rowOf(reportOf(f.run(['--json'])), 'gates');
  assert.equal(broken.result, 'DEGRADED');
  assert.equal(broken.repair, '/doctor:git hooks');

  // /doctor:git hooks runs git-hook-gates.cjs, so the repair is applied as that script.
  execFileSync(
    process.execPath,
    [
      path.join(OWN_ROOT, 'commands', 'doctor', 'scripts', 'git-hook-gates.cjs'),
      'set', 'commentHygiene', 'on', '--scope', 'local', '--repo', f.repo, '--apply',
    ],
    { env: f.env, cwd: f.repo },
  );

  assert.equal(rowOf(reportOf(f.run(['--json'])), 'gates').result, 'PASS');
});

test('round trip: the worktrees repair turns a broken base PASS, from git config and from the environment', (t) => {
  const f = fixture(t);
  const asFile = path.join(fs.realpathSync(f.dir), 'wt-file');
  fs.writeFileSync(asFile, 'x');
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'speckit.worktreeBase', asFile], { env: f.env });

  const broken = rowOf(reportOf(f.run(['--json'])), 'worktrees');
  assert.equal(broken.result, 'FAIL');
  assert.equal(broken.repair, 'git config speckit.worktreeBase <dir>');

  // The printed repair carries a placeholder, so it is applied with <dir> replaced.
  const good = path.join(fs.realpathSync(f.dir), 'wt-good');
  execFileSync('bash', ['-c', broken.repair.replace('<dir>', good)], { env: f.env, cwd: f.repo });
  assert.equal(rowOf(reportOf(f.run(['--json'])), 'worktrees').result, 'PASS');

  const envBroken = rowOf(reportOf(f.run(['--json'], { SPECKIT_WORKTREE_BASE: asFile })), 'worktrees');
  assert.equal(envBroken.result, 'FAIL');
  assert.ok(envBroken.repair.startsWith('export SPECKIT_WORKTREE_BASE=<writable dir>'), envBroken.repair);

  // The export means the next run gets SPECKIT_WORKTREE_BASE = good.
  assert.equal(rowOf(reportOf(f.run(['--json'], { SPECKIT_WORKTREE_BASE: good })), 'worktrees').result, 'PASS');
});

test('round trip: the commit-id repair turns a missing allocator PASS', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-root-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // A fake install root that ships every required file but the allocator, so the
  // commit-id check fails on the missing script while the shared helpers stay real.
  const installRoot = path.join(root, '.skilled');
  const copy = path.join(installRoot, 'commands', 'doctor', 'scripts', 'git-setup-check.cjs');
  fs.mkdirSync(path.dirname(copy), { recursive: true });
  fs.copyFileSync(SCRIPT, copy);
  const fakeSkill = path.join(installRoot, 'skills', 'sk-git');
  fs.mkdirSync(path.join(fakeSkill, 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(fakeSkill, 'scripts', '.keep'), '');
  fs.copyFileSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'SKILL.md'), path.join(fakeSkill, 'SKILL.md'));
  fs.copyFileSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'hard-rules.json'), path.join(fakeSkill, 'hard-rules.json'));
  fs.symlinkSync(path.join(OWN_ROOT, 'scripts'), path.join(installRoot, 'scripts'), 'dir');

  const f = fixture(t);
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'skilled.commitId', 'true'], { env: f.env });

  const runCopy = () => spawnSync(process.execPath, [copy, '--repo', f.repo, '--json'], { encoding: 'utf8', cwd: f.repo, env: f.env });
  const broken = rowOf(reportOf(runCopy()), 'commit-id');
  assert.equal(broken.result, 'FAIL');
  assert.equal(
    broken.repair,
    'restore .skilled/skills/sk-git/scripts/commit-id-naming.sh, or git config --local skilled.commitId false',
  );

  // The second alternative is applied as printed, so the config the operator would
  // set is the one that turns the row PASS.
  execFileSync('bash', ['-c', broken.repair.split(', or ')[1]], { env: f.env, cwd: f.repo });
  assert.equal(rowOf(reportOf(runCopy()), 'commit-id').result, 'PASS');
});

test('round trip: the advisory-rules repair turns an unknown check name PASS', (t) => {
  const f = fixture(t);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'git-setup-check-root-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // The copy resolves its own install root from its location, so the planted rule
  // file is the one it reads while the shared scripts stay the real ones.
  const installRoot = path.join(root, '.skilled');
  const fakeSkill = path.join(installRoot, 'skills', 'sk-git');
  const scriptCopy = path.join(installRoot, 'commands', 'doctor', 'scripts', 'git-setup-check.cjs');
  fs.mkdirSync(path.dirname(scriptCopy), { recursive: true });
  fs.mkdirSync(fakeSkill, { recursive: true });
  fs.copyFileSync(SCRIPT, scriptCopy);
  const rulesFile = path.join(fakeSkill, 'hard-rules.json');
  fs.writeFileSync(rulesFile, JSON.stringify([
    { id: 'planted-rule', check: 'no-such-check', message: 'never dispatched', severity: 'warn' },
  ]));
  fs.symlinkSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts'), path.join(fakeSkill, 'scripts'), 'dir');
  fs.symlinkSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'SKILL.md'), path.join(fakeSkill, 'SKILL.md'), 'file');

  const runCopy = () => spawnSync(process.execPath, [scriptCopy, '--repo', f.repo, '--json'], { encoding: 'utf8', cwd: f.repo, env: f.env });
  const broken = rowOf(reportOf(runCopy()), 'advisory-rules');
  assert.equal(broken.result, 'FAIL');
  assert.equal(broken.repair, 'fix the check name in .skilled/skills/sk-git/hard-rules.json');

  // The repair is applied as printed: the check name is fixed in the planted file.
  const planted = JSON.parse(fs.readFileSync(rulesFile, 'utf8'));
  planted[0].check = 'force-push-without-lease';
  fs.writeFileSync(rulesFile, JSON.stringify(planted));
  assert.equal(rowOf(reportOf(runCopy()), 'advisory-rules').result, 'PASS');
});

test('round trip: the suppression repairs turn the row PASS, from the environment and from hook-flags.env', (t) => {
  const f = fixture(t);

  const envBroken = rowOf(reportOf(f.run(['--json'], { SYSTEM_HOOKS_DISABLED: '1' })), 'suppression');
  assert.equal(envBroken.result, 'FAIL');
  assert.equal(envBroken.repair, 'unset SYSTEM_HOOKS_DISABLED');

  // Applying the repair means the next run carries no such variable, the state
  // the unset asks for.
  assert.equal(rowOf(reportOf(f.run(['--json'])), 'suppression').result, 'PASS');

  fs.mkdirSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), '# sentinel\n');
  fs.mkdirSync(path.join(f.repo, '.skilled', 'hooks'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'hooks', 'hook-flags.env'), '# saved\nSYSTEM_HOOKS_DISABLED=1\n');

  const fileBroken = rowOf(reportOf(f.run(['--json'])), 'suppression');
  assert.equal(fileBroken.result, 'FAIL');
  assert.equal(fileBroken.repair, 'delete line 2 of .skilled/hooks/hook-flags.env (SYSTEM_HOOKS_DISABLED=1)');

  // The repair is applied as printed: the line number and the file are read out
  // of it and that one line is removed from the named file.
  const parsed = fileBroken.repair.match(/^delete line (\d+) of (.+) \(/);
  assert.ok(parsed, fileBroken.repair);
  const flagsPath = path.join(f.repo, parsed[2]);
  const flagsLines = fs.readFileSync(flagsPath, 'utf8').split('\n');
  flagsLines.splice(Number(parsed[1]) - 1, 1);
  fs.writeFileSync(flagsPath, flagsLines.join('\n'));

  assert.equal(rowOf(reportOf(f.run(['--json'])), 'suppression').result, 'PASS');
});

test('round trip: registering the advisory as README section 3 shows turns ai-tool-hooks PASS for every runtime', (t) => {
  const REAL_ROOT = path.dirname(OWN_ROOT);

  for (const tool of ['claude', 'codex', 'devin', 'cursor', 'opencode', 'pi']) {
    const f = fixture(t);
    const file = TOOL_FILES[tool];

    const broken = rowOf(reportOf(f.run(['--tool', tool, '--json'])), 'ai-tool-hooks');
    assert.equal(broken.result, 'FAIL', `${tool}: ${broken.details.join(' | ')}`);
    assert.ok(
      broken.repair.startsWith(`register git-preflight-advisory in ${file}`),
      `${tool}: ${broken.repair}`,
    );

    // This checkout ships the registration the README's section 3 shows for this
    // runtime, so its file content is the repair the fixture repository needs.
    const target = path.join(f.repo, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, fs.readFileSync(path.join(REAL_ROOT, file), 'utf8'));

    const fixed = rowOf(reportOf(f.run(['--tool', tool, '--json'])), 'ai-tool-hooks');
    assert.equal(fixed.result, 'PASS', `${tool}: ${fixed.details.join(' | ')}`);
  }
});
