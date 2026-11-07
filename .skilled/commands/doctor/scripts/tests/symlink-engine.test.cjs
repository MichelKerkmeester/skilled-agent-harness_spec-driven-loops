#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Symlink Engine Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const ENGINE = path.resolve(__dirname, '..', 'symlink-engine.cjs');
const MANIFEST = path.resolve(__dirname, '../../assets/symlink-manifest.json');
const RUNTIMES = ['--runtimes', 'claude'];
const tempRoots = [];

function makeTempRoot(prefix) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function buildFixture({ git = false, excludeContents } = {}) {
  const source = makeTempRoot('symlink-engine-source-');
  const root = makeTempRoot('symlink-engine-target-');

  writeFile(path.join(source, '.skilled/agents/fixture.md'), '# Fixture agent\n');
  writeFile(path.join(source, '.skilled/commands/fixture.md'), '# Fixture command\n');
  writeFile(path.join(source, '.skilled/tools/fixture.txt'), 'fixture tool\n');
  fs.mkdirSync(path.join(source, '.skilled/commands/doctor/assets'), { recursive: true });
  fs.copyFileSync(MANIFEST, path.join(source, '.skilled/commands/doctor/assets/symlink-manifest.json'));
  writeFile(path.join(source, '.claude/mcp.json'), '{"servers":{}}\n');
  writeFile(path.join(source, '.claude/commands/fixture.md'), '# Fixture slash command\n');
  writeFile(path.join(source, 'AGENTS.md'), '# Fixture instructions\n');

  if (git) {
    const result = spawnSync('git', ['init', '-q'], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    if (excludeContents !== undefined) {
      writeFile(path.join(root, '.git/info/exclude'), excludeContents);
    }
  }

  return { source, root };
}

function runEngine(source, command, args = []) {
  const result = spawnSync(process.execPath, [ENGINE, command, '--source', source, ...args], {
    encoding: 'utf8'
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error,
    output: `${result.stdout || ''}${result.stderr || ''}`
  };
}

function runRoot(source, root, command, args = []) {
  return runEngine(source, command, ['--root', root, ...RUNTIMES, ...args]);
}

function assertStatus(result, expected, label) {
  assert.equal(result.status, expected, `${label}\n${result.output}\n${result.error || ''}`);
}

function planFor(source, root, args = []) {
  const result = runRoot(source, root, 'plan', args);
  assertStatus(result, 0, 'plan should run');
  const match = result.stdout.match(/^PLAN DIGEST: ([a-f0-9]{64})\s*$/m);
  assert.ok(match, `plan should print its digest\n${result.output}`);
  return { output: result.output, digest: match[1] };
}

function hasPlanAction(plan, operation, entryPath) {
  const operationPattern = new RegExp(`\\b${operation}\\b`, 'i');
  return plan.output.split(/\r?\n/).some((line) => {
    let offset = line.indexOf(entryPath);
    while (offset !== -1) {
      const before = line[offset - 1] || '';
      const after = line[offset + entryPath.length] || '';
      if (!/[A-Za-z0-9_./-]/.test(before) && !/[A-Za-z0-9_./-]/.test(after)) {
        return operationPattern.test(line);
      }
      offset = line.indexOf(entryPath, offset + 1);
    }
    return false;
  });
}

function assertPlanAction(plan, operation, entryPath) {
  assert.ok(
    hasPlanAction(plan, operation, entryPath),
    `plan should contain ${operation} for ${entryPath}\n${plan.output}`
  );
}

function assertNoPlanAction(plan, operations, entryPath) {
  for (const operation of operations) {
    assert.equal(
      hasPlanAction(plan, operation, entryPath),
      false,
      `plan should not contain ${operation} for ${entryPath}\n${plan.output}`
    );
  }
}

function checkReport(source, root) {
  const result = runRoot(source, root, 'check', ['--json']);
  assertStatus(result, 0, 'JSON check should run');
  return JSON.parse(result.stdout);
}

function findEntry(report, name) {
  const pending = [report];
  while (pending.length > 0) {
    const value = pending.pop();
    if (Array.isArray(value)) {
      pending.push(...value);
    } else if (value && typeof value === 'object') {
      if (value.name === name && typeof value.status === 'string') return value;
      pending.push(...Object.values(value));
    }
  }
  assert.fail(`check report has no entry named ${name}: ${JSON.stringify(report)}`);
}

function pathInConflict(conflict) {
  return typeof conflict === 'string' ? conflict : conflict.path;
}

function assertLinkResolvesTo(linkPath, targetPath) {
  assert.equal(fs.lstatSync(linkPath).isSymbolicLink(), true, `${linkPath} should be a symlink`);
  assert.equal(fs.realpathSync(linkPath), fs.realpathSync(targetPath));
}

function snapshotPath(targetPath) {
  const stat = fs.lstatSync(targetPath);
  if (stat.isSymbolicLink()) return { kind: 'link', text: fs.readlinkSync(targetPath) };
  if (stat.isDirectory()) {
    return {
      kind: 'directory',
      children: fs.readdirSync(targetPath).sort().map((name) => [
        name,
        snapshotPath(path.join(targetPath, name))
      ])
    };
  }
  return { kind: 'file', contents: fs.readFileSync(targetPath).toString('base64') };
}

function snapshotWorkspace(root) {
  const entries = fs.readdirSync(root).filter((name) => name !== '.git').sort();
  const tree = entries.map((name) => [name, snapshotPath(path.join(root, name))]);
  const excludePath = path.join(root, '.git/info/exclude');
  const exclude = fs.existsSync(excludePath) ? fs.readFileSync(excludePath, 'utf8') : null;
  return JSON.stringify({ tree, exclude });
}

function runUnlink(source, runDirectory, flag) {
  return runEngine(source, 'unlink', ['--run', runDirectory, flag]);
}

function runDirectoryFrom(output) {
  const match = output.match(/unlink --run (\S+) --dry-run/);
  assert.ok(match, `apply should print its undo command\n${output}`);
  return match[1];
}

test.after(() => {
  for (const root of tempRoots) fs.rmSync(root, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. WHOLE AND MERGE INSTALLS
// ─────────────────────────────────────────────────────────────────────────────

test('auto links whole entries in an empty root, including the relative MCP link', () => {
  const { source, root } = buildFixture();
  const plan = planFor(source, root);

  assertPlanAction(plan, 'link', '.skilled');
  assertPlanAction(plan, 'link', '.claude');
  assertPlanAction(plan, 'link', '.mcp.json');

  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should accept the printed digest');
  assertLinkResolvesTo(path.join(root, '.skilled'), path.join(source, '.skilled'));
  assertLinkResolvesTo(path.join(root, '.claude'), path.join(source, '.claude'));
  assert.equal(fs.readlinkSync(path.join(root, '.mcp.json')), '.claude/mcp.json');

  const report = checkReport(source, root);
  assert.equal(findEntry(report, '.skilled').status, 'linked-whole');
  assert.equal(findEntry(report, '.claude').status, 'linked-whole');
  assert.equal(findEntry(report, '.mcp.json').status, 'linked-whole');
});

test('auto merges a real Claude folder and preserves its local statusline', () => {
  const { source, root } = buildFixture();
  const localStatusline = Buffer.from('# local statusline\n');
  writeFile(path.join(root, '.claude/statusline.sh'), localStatusline);
  fs.mkdirSync(path.join(root, '.claude'), { recursive: true });
  const plan = planFor(source, root, ['--mode', 'auto']);

  assertPlanAction(plan, 'link', '.claude/commands');
  assertPlanAction(plan, 'link', '.claude/mcp.json');
  assertNoPlanAction(plan, ['link', 'replace-link'], '.claude');

  const applied = runRoot(source, root, 'apply', ['--mode', 'auto', '--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'merge apply should succeed');
  assert.equal(fs.readFileSync(path.join(root, '.claude/statusline.sh')).compare(localStatusline), 0);
  assertLinkResolvesTo(
    path.join(root, '.claude/commands'),
    path.join(source, '.claude/commands')
  );
  assert.equal(findEntry(checkReport(source, root), '.claude').status, 'linked-merge');
});

test('a real merge child is reported as a local conflict and stays byte-identical', () => {
  const { source, root } = buildFixture();
  fs.mkdirSync(path.join(root, '.claude'), { recursive: true });
  const conflictPath = path.join(root, '.claude/commands');
  const localContents = Buffer.from([0, 1, 2, 3, 250, 255]);
  writeFile(conflictPath, localContents);
  const plan = planFor(source, root);

  assertNoPlanAction(plan, ['link', 'replace-link', 'remove-broken'], '.claude/commands');
  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should preserve a real merge child');
  assert.deepEqual(fs.readFileSync(conflictPath), localContents);

  const claude = findEntry(checkReport(source, root), '.claude');
  assert.ok(
    claude.local_conflicts.some((conflict) => pathInConflict(conflict) === '.claude/commands'),
    JSON.stringify(claude)
  );
});

test('auto replaces a broken source link and leaves a broken outside link alone', () => {
  const { source, root } = buildFixture();
  const outside = makeTempRoot('symlink-engine-outside-');
  const sourceBroken = path.join(root, '.skilled');
  const outsideBroken = path.join(root, '.claude');
  const outsideTarget = path.join(outside, 'missing-claude');
  fs.symlinkSync(path.join(source, 'missing-child'), sourceBroken);
  fs.symlinkSync(outsideTarget, outsideBroken);
  const plan = planFor(source, root);

  assertPlanAction(plan, 'replace-link', '.skilled');
  assertNoPlanAction(plan, ['replace-link', 'remove-broken'], '.claude');

  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should replace only the source-pointing broken link');
  assertLinkResolvesTo(sourceBroken, path.join(source, '.skilled'));
  assert.equal(fs.lstatSync(outsideBroken).isSymbolicLink(), true);
  assert.equal(fs.readlinkSync(outsideBroken), outsideTarget);
});

test('whole mode refuses a real Claude folder and apply leaves it unchanged', () => {
  const { source, root } = buildFixture();
  fs.mkdirSync(path.join(root, '.claude'), { recursive: true });
  writeFile(path.join(root, '.claude/local.txt'), 'keep this folder\n');
  const before = snapshotPath(path.join(root, '.claude'));
  const plan = planFor(source, root, ['--mode', 'whole']);

  assert.match(plan.output, /refus/i);
  assert.ok(plan.output.includes('.claude'), plan.output);
  assertNoPlanAction(plan, ['link', 'replace-link'], '.claude');

  const applied = runRoot(source, root, 'apply', [
    '--mode', 'whole',
    '--plan-digest',
    plan.digest
  ]);
  assertStatus(applied, 0, 'whole mode apply should skip the refused folder');
  assert.deepEqual(snapshotPath(path.join(root, '.claude')), before);
});

test('a wrong plan digest exits 3 without changing the target root', () => {
  const { source, root } = buildFixture();
  const plan = planFor(source, root);
  const before = snapshotWorkspace(root);
  const wrongDigest = `${plan.digest[0] === '0' ? '1' : '0'}${plan.digest.slice(1)}`;
  const applied = runRoot(source, root, 'apply', ['--plan-digest', wrongDigest]);

  assertStatus(applied, 3, 'digest drift should exit 3');
  assert.match(applied.output, /DIGEST MISMATCH/);
  assert.equal(snapshotWorkspace(root), before);
});

test('unlink dry-run writes nothing and yes restores the target tree and ignore file', () => {
  const { source, root } = buildFixture({ git: true });
  const before = snapshotWorkspace(root);
  const plan = planFor(source, root);
  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should create an undo record');
  const runDirectory = runDirectoryFrom(applied.output);
  const afterApply = snapshotWorkspace(root);

  const dryRun = runUnlink(source, runDirectory, '--dry-run');
  assertStatus(dryRun, 0, 'unlink dry-run should print its plan');
  assert.equal(snapshotWorkspace(root), afterApply);

  const undone = runUnlink(source, runDirectory, '--yes');
  assertStatus(undone, 0, 'unlink --yes should restore the prior tree');
  assert.equal(snapshotWorkspace(root), before);
});

test('relinking the same plan after unlink succeeds and keeps the earlier run record intact', () => {
  const { source, root } = buildFixture({ git: true });
  const firstPlan = planFor(source, root);
  const firstApply = runRoot(source, root, 'apply', ['--plan-digest', firstPlan.digest]);
  assertStatus(firstApply, 0, 'first apply should link the root');
  const firstRun = runDirectoryFrom(firstApply.output);

  const undone = runUnlink(source, firstRun, '--yes');
  assertStatus(undone, 0, 'unlink --yes should remove the first links');
  const firstRecord = fs.readFileSync(path.join(firstRun, 'manifest.json'), 'utf8');

  const secondPlan = planFor(source, root);
  assert.equal(secondPlan.digest, firstPlan.digest, 'the unlinked tree should plan the same digest');
  const secondApply = runRoot(source, root, 'apply', ['--plan-digest', secondPlan.digest]);
  assertStatus(secondApply, 0, 'relinking the same plan should succeed');
  const secondRun = runDirectoryFrom(secondApply.output);

  assert.notEqual(secondRun, firstRun, 'the relink should write a new run record');
  assert.ok(path.basename(secondRun).startsWith(firstPlan.digest.slice(0, 16)), 'the new run keeps the digest prefix');
  assert.equal(fs.readFileSync(path.join(firstRun, 'manifest.json'), 'utf8'), firstRecord);
  assertLinkResolvesTo(path.join(root, '.skilled'), path.join(source, '.skilled'));

  const secondUndo = runUnlink(source, secondRun, '--yes');
  assertStatus(secondUndo, 0, 'the new run record should drive its own unlink');
  assert.equal(fs.lstatSync(path.join(root, '.skilled'), { throwIfNoEntry: false }), undefined);
});

test('unlink refuses a run folder whose name does not follow the recorded digest', () => {
  const { source, root } = buildFixture({ git: true });
  const plan = planFor(source, root);
  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should create a run record');
  const runDirectory = runDirectoryFrom(applied.output);
  const afterApply = snapshotWorkspace(root);

  for (const name of [`${plan.digest.slice(0, 16)}-x`, `${plan.digest.slice(0, 16)}-0`, 'copied-run']) {
    const misnamed = path.join(path.dirname(runDirectory), name);
    fs.cpSync(runDirectory, misnamed, { recursive: true });
    const refused = runUnlink(source, misnamed, '--yes');
    assertStatus(refused, 2, `unlink should refuse the run folder ${name}`);
    assert.match(refused.stderr, /does not match the recorded source and digest/);
  }
  assert.equal(snapshotWorkspace(root), afterApply);
});

test('a merge-only folder the root lacks is created, filled and removed again by unlink', () => {
  const { source, root } = buildFixture({ git: true });
  writeFile(path.join(source, '.github/dependabot.yml'), 'version: 2\n');
  const before = snapshotWorkspace(root);
  const plan = planFor(source, root, ['--include', 'github']);
  assertPlanAction(plan, 'mkdir', '.github');
  assertPlanAction(plan, 'link', '.github/dependabot.yml');

  const applied = runRoot(source, root, 'apply', ['--include', 'github', '--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should create the merge-only folder');
  assert.ok(fs.lstatSync(path.join(root, '.github')).isDirectory(), '.github should be a real folder');

  const undone = runUnlink(source, runDirectoryFrom(applied.output), '--yes');
  assertStatus(undone, 0, 'unlink --yes should remove the links and the folder it created');
  assert.equal(snapshotWorkspace(root), before);
});

test('--root equal to the source or inside it is refused with exit 2', () => {
  const { source } = buildFixture();
  const inside = path.join(source, 'nested/project');
  fs.mkdirSync(inside, { recursive: true });

  for (const root of [source, inside]) {
    const result = runRoot(source, root, 'check');
    assertStatus(result, 2, `root ${root} should be refused`);
    assert.match(result.stderr, /^ERROR:.*\n?$/m);
  }
});

test('git exclude receives only the new ignore lines and unlink removes only those lines', () => {
  const initialExclude = '# local ignore rules\n/keep-me\n';
  const { source, root } = buildFixture({ git: true, excludeContents: initialExclude });
  const excludePath = path.join(root, '.git/info/exclude');
  const plan = planFor(source, root);
  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should write ignore lines to git exclude');
  const runDirectory = runDirectoryFrom(applied.output);
  const afterApply = fs.readFileSync(excludePath, 'utf8');
  const expectedAdded = ['/.claude', '/.mcp.json', '/.skilled'];
  const added = afterApply.split(/\r?\n/).filter((line) => (
    line && !initialExclude.split(/\r?\n/).includes(line)
  )).sort();
  assert.deepEqual(added, expectedAdded);

  fs.appendFileSync(excludePath, '/keep-after-apply\n');
  const undone = runUnlink(source, runDirectory, '--yes');
  assertStatus(undone, 0, 'unlink should remove its recorded ignore lines');
  assert.equal(fs.readFileSync(excludePath, 'utf8'), `${initialExclude}/keep-after-apply\n`);
});

test('a project-owned file reports its status and survives link and unlink byte-for-byte', () => {
  const { source, root } = buildFixture();
  const sourceContents = Buffer.from('SOURCE_KEY=\n');
  const projectContents = Buffer.from([0, 1, 2, 3, 250, 255]);
  writeFile(path.join(source, '.env.example'), sourceContents);
  writeFile(path.join(root, '.env.example'), projectContents);

  const checked = runRoot(source, root, 'check', ['--include', 'env', '--json']);
  assertStatus(checked, 0, 'check should accept the project-owned file');
  assert.equal(findEntry(JSON.parse(checked.stdout), '.env.example').status, 'project-owned');

  const plan = planFor(source, root, ['--include', 'env']);
  assert.doesNotMatch(plan.output, /^refusal:/m);
  assertNoPlanAction(plan, ['link', 'replace-link', 'remove-broken'], '.env.example');
  const applied = runRoot(source, root, 'apply', [
    '--include', 'env', '--plan-digest', plan.digest,
  ]);
  assertStatus(applied, 0, 'apply should preserve the project-owned file');
  assert.deepEqual(fs.readFileSync(path.join(root, '.env.example')), projectContents);

  const report = runRoot(source, root, 'check', ['--include', 'env', '--json']);
  assertStatus(report, 0, 'post-apply check should accept the project-owned file');
  assert.equal(findEntry(JSON.parse(report.stdout), '.env.example').status, 'project-owned');

  const undone = runUnlink(source, runDirectoryFrom(applied.output), '--yes');
  assertStatus(undone, 0, 'unlink should leave the project-owned file alone');
  assert.deepEqual(fs.readFileSync(path.join(root, '.env.example')), projectContents);
});

test('a missing project-owned destination keeps the existing source-link behavior', () => {
  const { source, root } = buildFixture();
  writeFile(path.join(source, '.env.example'), 'SOURCE_KEY=\n');
  const plan = planFor(source, root, ['--include', 'env']);

  assertPlanAction(plan, 'link', '.env.example');
  const applied = runRoot(source, root, 'apply', [
    '--include', 'env', '--plan-digest', plan.digest,
  ]);
  assertStatus(applied, 0, 'apply should link the missing project-owned destination');
  assertLinkResolvesTo(path.join(root, '.env.example'), path.join(source, '.env.example'));

  const undone = runUnlink(source, runDirectoryFrom(applied.output), '--yes');
  assertStatus(undone, 0, 'unlink should remove the link created for a missing destination');
  assert.equal(fs.lstatSync(path.join(root, '.env.example'), { throwIfNoEntry: false }), undefined);
});

test('setup omits a dangling specs alias when the host has no specs folder', () => {
  const { source, root } = buildFixture();
  fs.symlinkSync('../specs', path.join(source, '.skilled/specs'));
  const plan = planFor(source, root);

  assertPlanAction(plan, 'mkdir', '.skilled');
  assertNoPlanAction(plan, ['link'], '.skilled');
  assertNoPlanAction(plan, ['link', 'replace-link'], '.skilled/specs');
  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should install without the missing specs alias');
  assert.ok(fs.lstatSync(path.join(root, '.skilled')).isDirectory());
  assert.equal(fs.lstatSync(path.join(root, '.skilled/specs'), { throwIfNoEntry: false }), undefined);
  assert.equal(findEntry(checkReport(source, root), '.skilled').status, 'linked-merge');

  const undone = runUnlink(source, runDirectoryFrom(applied.output), '--yes');
  assertStatus(undone, 0, 'unlink should remove the merged install');
});

test('setup keeps the specs alias pointed at a host specs folder', () => {
  const { source, root } = buildFixture();
  fs.symlinkSync('../specs', path.join(source, '.skilled/specs'));
  writeFile(path.join(root, 'specs/host-packet/spec.md'), '# Host packet\n');
  const hostSpecs = path.join(root, 'specs');
  const alias = path.join(root, '.skilled/specs');
  const plan = planFor(source, root);

  assertPlanAction(plan, 'mkdir', '.skilled');
  assertPlanAction(plan, 'link', '.skilled/specs');
  const applied = runRoot(source, root, 'apply', ['--plan-digest', plan.digest]);
  assertStatus(applied, 0, 'apply should preserve the host specs alias');
  assert.equal(fs.readlinkSync(alias), '../specs');
  assert.equal(fs.realpathSync(alias), fs.realpathSync(hostSpecs));
  assert.equal(findEntry(checkReport(source, root), '.skilled').status, 'linked-merge');

  const undone = runUnlink(source, runDirectoryFrom(applied.output), '--yes');
  assertStatus(undone, 0, 'unlink should remove the host specs alias');
  assert.equal(fs.lstatSync(alias, { throwIfNoEntry: false }), undefined);
  assert.equal(fs.existsSync(path.join(hostSpecs, 'host-packet/spec.md')), true);
});
