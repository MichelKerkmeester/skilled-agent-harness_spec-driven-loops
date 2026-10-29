// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Runner Units: Guard, Scope and Output
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case calls one exported part of the runner or drives it over a fixture, so the group
// covers the write guard, the scope listing, the exit precedence and the shapes the three
// output formats promise.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { HUB_ROOT, COMPILER, ADR_LABEL, OPEN, PASS_WORD, CHECKER_OUTPUTS, ENVELOPE_KEYS, withRepo, check, hygieneFindings, fakePython, onlyNodeOnPath, envelopeFields, HYGIENE_REPORT, loggingGit, listingCalls } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged } = require('./fixtures.cjs');
const { decideGate } = require('../quality-gate.cjs');
const { findTool, spawnArgv, withGuard } = require('../lib/run-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('unit: argv spawn and guard', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-spawn-')));
  try {
    assert.equal(spawnArgv([process.execPath, '-e', 'process.exit(0)']).state, 'RAN_CLEAN');
    const failed = spawnArgv([process.execPath, '-e', 'process.exit(5)']);
    assert.deepEqual([failed.state, failed.exit], ['RAN_FAIL', 5]);
    assert.equal(spawnArgv([path.join(temp, 'sk-code-absent-tool')]).state, 'ERROR');
    assert.equal(spawnArgv([process.execPath, '-e', 'setTimeout(() => {}, 5000)'], { timeoutMs: 200 }).state, 'TIMEOUT');
    const literal = '$(touch pwned); echo hi';
    const echoed = spawnArgv([process.execPath, '-e', 'process.stdout.write(process.argv[1])', literal], { cwd: temp });
    assert.equal(echoed.stdout, literal);
    assert.ok(!fs.existsSync(path.join(temp, 'pwned')));
    const preload = spawnArgv([process.execPath, '-p', 'String(process.env.NODE_OPTIONS)'], {
      env: { ...process.env, NODE_OPTIONS: '--require /nonexistent/preload.cjs' },
    });
    assert.deepEqual([preload.state, preload.stdout.trim()], ['RAN_CLEAN', 'undefined']);
    assert.equal(findTool('sk-code-absent-tool', { PATH: temp }), null);
    assert.equal(findTool('node', { PATH: path.dirname(process.execPath) }), path.join(path.dirname(process.execPath), 'node'));
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }

  withRepo({ base: { 'notes.md': 'base\n', 'app.go': 'package a\n' }, change: { 'app.go': 'package a\n\nfunc A() {}\n' } }, (repo) => {
    const context = { root: repo.root, git: true, files: ['app.go'], env: repo.env };
    const first = withGuard(context, () => fs.appendFileSync(path.join(repo.root, 'notes.md'), 'edit\n'));
    assert.deepEqual(first.mutated, ['notes.md']);
    const second = withGuard(context, () => 'quiet', first.after);
    assert.deepEqual([second.value, second.mutated], ['quiet', []]);

    const target = path.join(repo.root, 'fresh.md');
    const bin = fakePython(repo.parent, `require("fs").writeFileSync(process.env.SKQ_FIXTURE_TARGET, "changed\\n");\n${HYGIENE_REPORT}`);
    const run = repo.run([], { env: { PATH: `${bin}${path.delimiter}${repo.env.PATH}`, SKQ_FIXTURE_TARGET: target } });
    assert.equal(run.status, 3);
    assert.equal(run.verdict.gate, 'ERROR');
    const [error] = run.verdict.errors;
    assert.equal(error.code, 'CHECK_MUTATED_WORKSPACE');
    assert.equal(error.check, 'comment-hygiene');
    // The file did not exist when the run listed the workspace, and the closing snapshot
    // finds it anyway, so bounding the listing did not cost the guard a path it watched.
    assert.deepEqual(error.paths, ['fresh.md']);
    assert.equal(fs.readFileSync(target, 'utf8'), 'changed\n');
  });
});

// The guard hashes the folders the scope reaches, so a write inside one is seen and a write
// outside one is not. The bound is what keeps a run from walking the whole tree, and the
// cases hold both halves of it so a later change to the bound has to be deliberate.
test('unit: guard boundary: a write inside the folders the scope reaches is caught', () => withRepo({
  base: { 'app.js': 'module.exports = 1;\n' },
  change: { 'nested/app.js': 'module.exports = 2;\n' },
}, (repo) => {
  const context = { root: repo.root, git: true, files: ['nested/app.js'], env: repo.env, folders: ['nested'] };
  const created = path.join(repo.root, 'nested', 'created.js');
  const outcome = withGuard(context, () => fs.writeFileSync(created, 'module.exports = 3;\n'));
  assert.deepEqual(outcome.mutated, ['nested/created.js']);
}));

test('unit: guard boundary: a write outside the folders the scope reaches is not caught', () => withRepo({
  base: { 'app.js': 'module.exports = 1;\n' },
  change: { 'nested/app.js': 'module.exports = 2;\n' },
}, (repo) => {
  const context = { root: repo.root, git: true, files: ['nested/app.js'], env: repo.env, folders: ['nested'] };
  const outcome = withGuard(context, () => fs.writeFileSync(path.join(repo.root, 'elsewhere.js'), 'module.exports = 4;\n'));
  assert.deepEqual(outcome.mutated, [], 'a write outside the folders the scope reaches ended up inside the watch');
}));

// An ignored path is outside the watch because hashing the ones a folder holds costs more
// than the run's budget allows, measured at the folder the runner itself lives in as well
// as at the repository root. The case holds that boundary, so adding a watch means changing it.
test('unit: guard boundary: an ignored record a check writes stays outside the watch', () => withRepo({
  base: { '.gitignore': 'cache/\n', 'nested/app.js': 'module.exports = 1;\n' },
  change: { 'nested/app.js': 'module.exports = 1;\n\nmodule.exports.b = 2;\n' },
}, (repo) => {
  const record = path.join(repo.root, 'nested', 'cache', 'record.json');
  const body = `require("fs").mkdirSync(${JSON.stringify(path.dirname(record))}, { recursive: true });\n`
    + `require("fs").writeFileSync(${JSON.stringify(record)}, ${JSON.stringify('{}\n')});\n${HYGIENE_REPORT}`;
  const bin = fakePython(repo.parent, body);
  const run = repo.run([], { env: { PATH: `${bin}${path.delimiter}${repo.env.PATH}` } });
  assert.ok(run.verdict, run.stderr);
  assert.equal(check(run.verdict, 'comment-hygiene').state, 'RAN_CLEAN');
  assert.deepEqual(run.verdict.errors, [], 'a record written under an ignored folder ended up inside the watch');
  assert.notEqual(run.status, 3);
  assert.equal(fs.readFileSync(record, 'utf8'), '{}\n');
}));

// A named-file scope takes no listing of its own, so the guard has to bound its own to the
// folders those files sit in. Without that, a check could create a file beside one and the
// run would still read clean.
test('unit: files scope guard', () => withRepo({
  base: { 'src/a.go': 'package a\n' },
  change: { 'src/a.go': 'package a\n\nfunc A() {}\n' },
}, (repo) => {
  const created = path.join(repo.root, 'src', 'new.txt');
  const bin = fakePython(repo.parent, `require("fs").writeFileSync(${JSON.stringify(created)}, "x\\n");\n${HYGIENE_REPORT}`);
  const run = repo.run(['--files', 'src/a.go'], { env: { PATH: `${bin}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(run.status, 3);
  const [error] = run.verdict.errors;
  assert.equal(error.code, 'CHECK_MUTATED_WORKSPACE');
  assert.deepEqual(error.paths, ['src/new.txt']);
  assert.equal(fs.readFileSync(created, 'utf8'), 'x\n');
}));

// The untracked side of a scope is the largest cost of a run, so a run reads it once and
// hands it to the guard. A named-file scope reads none of it for the scope itself, and the
// guard bounds its own listing to the folder each named file sits in.
test('unit: scope listing', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-listing-')));
  try {
    const git = loggingGit(temp);
    withRepo({ change: { 'app.js': 'module.exports = 1;\n', 'nested/peer.js': 'module.exports = 2;\n' } }, (repo) => {
      const env = { PATH: `${git.bin}${path.delimiter}${repo.env.PATH}`, SKQ_FIXTURE_GIT_LOG: git.log };
      const worktree = repo.run([], { env });
      assert.ok(worktree.verdict, worktree.stderr);
      const calls = listingCalls(git.log);
      assert.equal(calls.length, 2, `a worktree run listed the untracked files ${calls.length} times, not once for the scope and once for the guard`);
      assert.doesNotMatch(calls[0], / -- /, 'the scope listed its tree through a bound it does not have');
      assert.match(calls[1], / -- \.$/, 'the guard listed the whole tree instead of the folders the scope reaches');

      fs.rmSync(git.log, { force: true });
      const named = repo.run(['--files', 'app.js'], { env });
      assert.ok(named.verdict, named.stderr);
      // The scope still lists nothing for a named-file run, because it hashes those paths by
      // name, and the guard bounds its own listings to the folder the named file sits in.
      const namedCalls = listingCalls(git.log);
      assert.deepEqual(namedCalls.filter((call) => !call.includes(' -- ')), [],
        'a named-file run listed its tree for the scope');
      for (const call of namedCalls) assert.match(call, / -- \.$/, 'a named-file run listed outside the folder its file sits in');
    });
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

// A guard that is handed the listing hashes it and takes none of its own before the work
// runs, and its closing snapshot lists again inside the folders the scope reaches, so a
// path a check creates while it runs is still seen.
test('unit: guard snapshot source', () => {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-guard-source-')));
  try {
    const git = loggingGit(temp);
    withRepo({ change: { 'app.js': 'module.exports = 1;\n' } }, (repo) => {
      repo.write({ 'peer.js': 'module.exports = 2;\n' });
      const env = { ...repo.env, PATH: `${git.bin}${path.delimiter}${repo.env.PATH}`, SKQ_FIXTURE_GIT_LOG: git.log };
      const context = { root: repo.root, git: true, files: ['app.js'], env, untracked: ['peer.js'], folders: ['.'] };
      const outcome = withGuard(context, () => fs.appendFileSync(path.join(repo.root, 'peer.js'), '// edit\n'));
      assert.deepEqual(outcome.mutated, ['peer.js']);
      assert.equal(listingCalls(git.log).length, 1, 'the opening snapshot listed instead of hashing the run listing');

      fs.rmSync(git.log, { force: true });
      const named = repo.run(['--files', 'app.js'], { env: { PATH: env.PATH, SKQ_FIXTURE_GIT_LOG: git.log } });
      assert.ok(named.verdict, named.stderr);
      // A named-file scope takes no listing of its own, and every guard listing under it is
      // bounded to the folder the named file sits in.
      const namedCalls = listingCalls(git.log);
      assert.deepEqual(namedCalls.filter((call) => !call.includes(' -- ')), [],
        'a named-file run listed its tree for the scope');
      for (const call of namedCalls) assert.match(call, / -- \.$/, 'a named-file run listed outside the folder its file sits in');
    });
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('unit: exit precedence', () => {
  const blocker = { blocking: true, severity: 'P0', confidence: 'exact' };
  const skipped = { id: 'comment-hygiene', origin: 'builtin', severity: 'P0', required: true, state: 'SKIPPED_ABSENT' };
  const optional = { id: 'syntax-toml', origin: 'builtin', severity: 'P0', required: false, state: 'SKIPPED_ABSENT' };
  const error = { code: 'GIT_FAILED', message: 'x' };
  const cases = [
    [{ errors: [error], findings: [blocker], checks: [skipped], filesChecked: 1 }, 'ERROR', 3],
    [{ findings: [blocker], checks: [skipped], filesChecked: 1 }, 'BLOCKED', 1],
    [{ checks: [skipped], filesChecked: 0 }, 'UNVERIFIED', 4],
    [{ checks: [optional], filesChecked: 0 }, 'NOTHING_CHECKED', 2],
    [{ findings: [{ ...blocker, confidence: 'heuristic' }], checks: [optional], filesChecked: 1 }, 'NO_BLOCKER_FOUND', 0],
  ];
  for (const [input, gate, exitCode] of cases) {
    const decision = decideGate(input);
    assert.deepEqual([decision.gate, decision.exit_code], [gate, exitCode], JSON.stringify(input));
  }

  withRepo({}, (repo) => {
    const empty = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.deepEqual([empty.status, empty.verdict.gate, empty.verdict.coverage.files_total], [2, 'NOTHING_CHECKED', 0]);
    repo.write({ 'big.go': 'package a\n' + '// filler line\n'.repeat(160000) });
    const big = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(big.status, 2);
    assert.deepEqual(big.verdict.coverage.unchecked, [{ file: 'big.go', reason: 'size' }]);
    fs.writeFileSync(path.join(repo.hub, 'mode-registry.json'), '{ not json');
    const internal = repo.run([]);
    assert.deepEqual([internal.status, internal.verdict.gate, internal.verdict.errors[0].code], [3, 'ERROR', 'INTERNAL_ERROR']);
    assert.doesNotMatch(internal.stdout + internal.stderr, /\n\s+at /);
    const missingHub = repo.run([], { env: { SK_CODE_QUALITY_HUB_ROOT: path.join(repo.parent, 'no-hub') } });
    assert.equal(missingHub.verdict.errors[0].code, 'HUB_ROOT_INVALID');
  });

  withRepo({ change: { 'a.js': ['module.exports = 1;', OPEN + ' HEAD', ''].join('\n') } }, (repo) => {
    const bin = onlyNodeOnPath(repo.parent);
    const env = { env: { PATH: bin } };
    const json = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'a.js'], env));
    assert.equal(json.status, 1);
    assert.equal(json.verdict.gate, 'BLOCKED');
    assert.ok(json.verdict.summary.unverified.includes('comment-hygiene'));
    for (const output of [json.stdout, repo.run(['--files', 'a.js', '--format', 'text'], env).stdout,
      repo.run(['--files', 'a.js', '--format', 'envelope'], env).stdout]) {
      assert.doesNotMatch(output, PASS_WORD);
    }
  });
});

test('unit: compiler rejects', () => {
  const { compileRegistry, validateQualityDeclarations } = require(COMPILER);
  const readHub = () => ({
    registry: JSON.parse(fs.readFileSync(path.join(HUB_ROOT, 'mode-registry.json'), 'utf8')),
    hubRouter: JSON.parse(fs.readFileSync(path.join(HUB_ROOT, 'hub-router.json'), 'utf8')),
  });
  const compile = ({ registry, hubRouter }) => {
    const skillMarkdown = fs.readFileSync(path.join(HUB_ROOT, 'SKILL.md'), 'utf8');
    // The fallback checklist lives in the final machine-router section of the
    // hub's root ROUTER.md, which the compiler reads in place of SKILL.md.
    const rootRouter = fs.readFileSync(path.join(HUB_ROOT, 'ROUTER.md'), 'utf8');
    const machineRouterStart = rootRouter.search(/^## \d+\. MACHINE ROUTER$/m);
    assert.ok(machineRouterStart >= 0, 'sk-code ROUTER.md must end with a MACHINE ROUTER section');
    const routerMarkdown = rootRouter.slice(machineRouterStart);
    return compileRegistry({
      activationGeneration: 1,
      hubRouter,
      registry,
      routerMarkdown,
      skillMarkdown,
      sourceBytes: {
        'ROUTER.md': Buffer.from(rootRouter, 'utf8'),
        'SKILL.md': Buffer.from(skillMarkdown, 'utf8'),
        'hub-router.json': Buffer.from(JSON.stringify(hubRouter), 'utf8'),
        'mode-registry.json': Buffer.from(JSON.stringify(registry), 'utf8'),
      },
    });
  };
  assert.ok(compile(readHub()).policy);
  const skilledRows = (registry) => registry.modes.find((mode) => mode.workflowMode === 'sk-code-skilled').quality.checklists;
  const broken = [
    (registry) => { registry.modes.find((mode) => mode.workflowMode === 'sk-code-quality').quality = { checklists: [{ paths: ['**'], file: 'a.md' }] }; },
    (registry) => { skilledRows(registry)[0].role = 'fallback'; },
    (registry) => { delete skilledRows(registry)[0].paths; },
    (registry) => { skilledRows(registry)[0].paths = []; },
    (registry) => { skilledRows(registry)[4].extensions = ['js']; },
    (registry) => { skilledRows(registry)[0].file = '../outside.md'; },
    (registry) => { skilledRows(registry)[0].file = 'sk-code-skilled/run.sh'; },
    (registry) => { registry.modes.find((mode) => mode.workflowMode === 'sk-code-ci').quality.commands = [['make', 'lint']]; },
    (registry) => { registry.modes.find((mode) => mode.workflowMode === 'sk-code-ci').quality = { checklists: [] }; },
  ];
  for (const mutate of broken) {
    const hub = readHub();
    mutate(hub.registry);
    assert.throws(() => validateQualityDeclarations(hub.registry), (error) => error.code === 'QUALITY_DECLARATION_INVALID', mutate.toString());
    assert.throws(() => compile(hub), (error) => error.code === 'QUALITY_DECLARATION_INVALID', mutate.toString());
  }
});

test('unit: envelope', () => withRepo({ change: { 'app.go': 'package a\n' } }, (repo) => {
  const { status, stdout } = assertSnapshotUnchanged(repo, () => repo.run(['--format', 'envelope']));
  assert.equal(status, 0);
  const fields = envelopeFields(stdout);
  assert.deepEqual(fields.map(([key]) => key), ENVELOPE_KEYS);
  const value = Object.fromEntries(fields);
  assert.equal(value.schema_version, 'code-quality/v1');
  assert.equal(value.status, 'advisory');
  assert.equal(value.modified_files, 'app.go');
  assert.match(value.checker_outputs, CHECKER_OUTPUTS);
  for (const key of ['p0_p1_p2_decisions', 'accepted_deferrals', 'remaining_accepted_risk']) assert.equal(value[key], 'PENDING_AGENT_JUDGMENT');
  assert.equal(value.verification_handoff, 'workflow-verify.md');

  const failed = repo.run(['--format', 'envelope', '--files', 'missing.go']);
  assert.equal(failed.status, 3);
  assert.match(Object.fromEntries(envelopeFields(failed.stdout)).checker_outputs, /^code-quality-run\/v1 gate=ERROR exit=3 /);
}));

test('unit: flags', () => withRepo({
  base: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n' },
  change: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\nfunc B() {}\n' },
}, (repo) => {
  const canary = path.join(repo.parent, 'canary');
  const spy = fakePython(repo.parent, `require("fs").writeFileSync(${JSON.stringify(canary)}, "ran");\n${HYGIENE_REPORT}`);
  const spyPath = { env: { PATH: `${spy}${path.delimiter}${repo.env.PATH}` } };
  const named = path.join(repo.parent, 'named-quality.json');
  fs.writeFileSync(named, '{"schemaVersion": 1}\n');
  assertSnapshotUnchanged(repo, () => {
    assert.equal(repo.run([]).status, 0);
    const configured = repo.run(['--config', named]);
    assert.equal(configured.status, 0);
    assert.deepEqual([configured.verdict.config.source, configured.verdict.config.path], ['cli', named]);
    const whole = repo.run(['--lines', 'file']);
    assert.equal(whole.status, 1);
    assert.equal(hygieneFindings(whole.verdict)[0].origin, 'changed-line');

    const only = repo.run(['--only', 'conflict-markers,secrets']);
    assert.equal(only.status, 4);
    assert.equal(check(only.verdict, 'comment-hygiene').state, 'SKIPPED_BY_FLAG');
    assert.equal(check(only.verdict, 'conflict-markers').state, 'RAN_CLEAN');
    assert.equal(repo.run(['--skip', 'comment-hygiene']).verdict.summary.unverified[0], 'comment-hygiene');

    const listed = repo.run(['--no-run'], spyPath);
    assert.equal(listed.status, 4);
    const hygiene = check(listed.verdict, 'comment-hygiene');
    assert.equal(hygiene.state, 'LISTED');
    assert.deepEqual(hygiene.argv.slice(-2), ['--', '{files}']);
    assert.equal(check(listed.verdict, 'secrets').state, 'RAN_CLEAN');

    const explained = repo.run(['--explain', 'app.go'], spyPath);
    assert.equal(explained.status, 2);
    assert.equal(explained.verdict.schema, 'code-quality-explain/v1');
    assert.equal(explained.verdict.language, 'go');
    assert.equal(explained.verdict.checks.find((item) => item.id === 'comment-hygiene').applies, true);
    assert.equal(explained.verdict.checks.find((item) => item.id === 'syntax-python').applies, false);
    assert.ok(explained.verdict.checklists.every((item) => typeof item.why === 'string' && item.why.length > 0));
    assert.ok(!fs.existsSync(canary));

    for (const args of [['--config'], ['--only', 'sk-code-absent-check'], ['--timeout', '0'],
      ['--format', 'yaml'], ['--worktree', '--files', 'app.go'], ['--lines', 'some']]) {
      const refused = repo.run(args);
      assert.equal(refused.status, 3, args.join(' '));
      assert.equal(refused.verdict.errors[0].code, 'USAGE', args.join(' '));
    }
  });

  const stall = fakePython(path.join(repo.parent, 'stall'), 'setTimeout(() => {}, 10000);');
  const slow = repo.run(['--timeout', '0.3'], { env: { PATH: `${stall}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(slow.status, 4);
  assert.equal(check(slow.verdict, 'comment-hygiene').state, 'TIMEOUT');
  const tiny = repo.run(['--timeout', '0.0004'], { env: { PATH: `${stall}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(check(tiny.verdict, 'comment-hygiene').state, 'TIMEOUT');

  repo.git(['add', '-A']);
  repo.git(['commit', '-q', '--no-verify', '-m', 'second']);
  const ranged = repo.run(['--base', 'HEAD~1']);
  assert.deepEqual([ranged.verdict.scope.mode, ranged.verdict.scope.files], ['base', ['app.go']]);
  assert.equal(repo.run(['--base', 'sk-code-absent-ref']).verdict.errors[0].code, 'BASE_NOT_FOUND');
}));
