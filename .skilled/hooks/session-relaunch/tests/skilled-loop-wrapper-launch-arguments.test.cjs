// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Tests: Launch Arguments
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { RUNTIMES } = require('../lib/relaunch-core.cjs');
const {
  SEED, SPEC_FOLDER, SPEC_FOLDER_SUFFIX, SKIP_SPEC_FOLDER_SUFFIX, LOOP_ID_PATTERN,
  RUNTIME_SOURCE, expectedClaudeManualCommand, createSandbox, installRuntimeStub,
  writeSpecFolderNote,
  runWrapperScript, runWrapper, handOverLines, installWrapperCopy,
  installWrapperCopyWithChangedSuffix,
  installWrapperWithThrowingSuffix, installMalformedConsumeStub, readRecords, readLog,
} = require('./skilled-loop-wrapper-harness.cjs');

test('second invocation uses only the seed and name, recorded cwd, and the same loop id', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '-n', 'X', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[0].args, ['-n', 'X', 'initial prompt']);
  assert.equal(records[0].env.SKILLED_LOOP_NAME, 'X');
  assert.deepEqual(records[1].args, [
    SEED + ` ${handoffPath}`,
    '--name',
    'X (2)',
  ]);
  assert.equal(records[1].cwd, fs.realpathSync(sandbox.recordedCwd));
  assert.equal(records[0].env.SKILLED_LOOP_ID, records[1].env.SKILLED_LOOP_ID);
  assert.match(records[0].env.SKILLED_LOOP_ID, LOOP_ID_PATTERN);
  assert.deepEqual(records.map((record) => record.env.SKILLED_LOOP_HOPS), ['0', '1']);
  assert.equal(records.some((record) => (
    record.args.some((arg) => ['--resume', '-r', '--continue', '-c'].includes(arg))
  )), false);
  assert.equal(handOverLines(sandbox).length, 1);
  assert.equal(handOverLines(sandbox)[0].split('\t')[3], 'hop 1');
});

function assertHopReplaysArguments(t, runtime, args, expectedHopArgs) {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, [runtime, ...args]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, expectedHopArgs(`${SEED} ${handoffPath}`));
}

test('Claude first launch arguments are replayed with --permission-mode and --add-dir', (t) => {
  assertHopReplaysArguments(t, 'claude', [
    '--add-dir', '/tmp', '--permission-mode', 'plan', 'first prompt',
  ], (seed) => ['--permission-mode', 'plan', seed, '--add-dir', '/tmp']);
});

test('Pi first launch arguments are replayed', (t) => {
  assertHopReplaysArguments(t, 'pi', ['--skill', '/tmp/s', 'first prompt'],
    (seed) => [seed, '--skill', '/tmp/s']);
});

test('OpenCode first launch arguments are replayed', (t) => {
  assertHopReplaysArguments(t, 'opencode', ['--server', 'ws://example', '--auto', 'first prompt'],
    (seed) => ['--prompt', seed, '--server', 'ws://example', '--auto']);
});

test('Codex first launch arguments are replayed', (t) => {
  assertHopReplaysArguments(t, 'codex', [
    '-c', 'approval_policy="never"', '-c', 'model_reasoning_effort="high"', 'first prompt',
  ], (seed) => [
    '--no-daemon', '-c', 'model_reasoning_effort="high"', seed,
    '-c', 'approval_policy="never"',
  ]);
});

test('Cursor first launch arguments are replayed', (t) => {
  assertHopReplaysArguments(t, 'cursor', ['--api-key', 'token', '--trust', 'first prompt'],
    (seed) => [seed, '--api-key', 'token', '--trust']);
});

test('an attached short option value keeps the next word as the prompt', (t) => {
  assertHopReplaysArguments(t, 'cursor', ['-HAuthorization: Bearer t', 'first prompt'],
    (seed) => [seed, '-HAuthorization: Bearer t']);
});

test('Devin first launch arguments are replayed', (t) => {
  assertHopReplaysArguments(t, 'devin', ['--config', '/tmp/devin.json', '--sandbox', 'first prompt'],
    (seed) => ['--config', '/tmp/devin.json', '--sandbox', '--', seed]);
});

test('deny list flags are absent from a hop', (t) => {
  const cases = [
    ['claude', ['--permission-mode', 'plan', '--session-id', 's1', '--continue', '--cloud', 'first prompt'],
      (seed) => ['--permission-mode', 'plan', seed]],
    ['pi', ['--no-mcp', '--session', 's1', '--continue', 'first prompt'],
      (seed) => [seed, '--no-mcp']],
    ['opencode', ['--auto', '--session', 's1', '--continue', 'first prompt'],
      (seed) => ['--prompt', seed, '--auto']],
    ['codex', ['--search', '--image', '/tmp/a.png', '--worktree', '--last', 'first prompt'],
      (seed) => ['--no-daemon', seed, '--search']],
    ['cursor', ['--trust', '--worktree-base', 'main', '--continue', 'first prompt'],
      (seed) => [seed, '--trust']],
    ['devin', ['--sandbox', '--prompt-file', '/tmp/p.md', '--continue', 'first prompt'],
      (seed) => ['--sandbox', '--', seed]],
  ];

  for (const [runtime, args, expectedHopArgs] of cases) {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    const result = runWrapper(sandbox, [runtime, ...args]);
    assert.equal(result.status, 0, `${runtime}: ${result.stderr}`);
    const records = readRecords(recordPath);
    assert.equal(records.length, 2, runtime);
    assert.deepEqual(records[1].args, expectedHopArgs(`${SEED} ${handoffPath}`), runtime);
  }
});

test('a hop keeps a dash-leading value and stops at the separator', (t) => {
  assertHopReplaysArguments(t, 'claude', [
    '--append-system-prompt', '-x', '--permission-mode', 'plan', '--', 'first prompt',
  ], (seed) => ['--permission-mode', 'plan', seed, '--append-system-prompt', '-x']);
});

test('an optional value never swallows the next option', (t) => {
  assertHopReplaysArguments(t, 'claude', [
    '--debug', '--continue', '--verbose', 'first prompt',
  ], (seed) => [seed, '--debug', '--verbose']);
});

test('an unknown option that carries its value is not ambiguous', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '--third-party-flag=1', 'first prompt']);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /warning: .*ambiguous/);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`, '--third-party-flag=1']);
});

test('a joined short resume option is not replayed', (t) => {
  assertHopReplaysArguments(t, 'claude', ['-rabc', '--verbose', 'first prompt'],
    (seed) => [seed, '--verbose']);
});

test('Codex takes its model from a config setting when no model flag is given', (t) => {
  for (const configArgs of [
    ['-c', 'model="o3"'],
    ['--config', 'model="o3"'],
    ['--config=model="o3"'],
  ]) {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    const result = runWrapper(sandbox, ['codex', ...configArgs, 'first prompt']);
    assert.equal(result.status, 0, result.stderr);
    const records = readRecords(recordPath);
    assert.equal(records.length, 2);
    assert.deepEqual(records[1].args, ['--no-daemon', '-m', 'o3', `${SEED} ${handoffPath}`]);
  }
});

test('a hop replaces the start prompt and the record settings', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, {
    markers: '1', RECORD_MODEL: 'sonnet', RECORD_EFFORT: 'high',
  });
  const result = runWrapper(sandbox, [
    'claude', '--model', 'launch model', '--effort', 'low', '--name', 'launch name',
    '--permission-mode', 'plan', 'first prompt',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  const args = records[1].args;
  assert.equal(args.filter((arg) => arg === '--model').length, 1);
  assert.equal(args.filter((arg) => arg === '--effort').length, 1);
  assert.equal(args.filter((arg) => arg === '--name').length, 1);
  assert.equal(args.includes('first prompt'), false);
  assert.ok(args.includes('sonnet'));
  assert.ok(args.includes('high'));
  assert.ok(args.includes('launch name (2)'));
  assert.ok(args.includes('--permission-mode'));
});

test('an unknown option before a bare word declines the hop', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '--not-a-real-option', 'word']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /warning: cannot tell whether word is the value of --not-a-real-option or the start prompt/);
  assert.match(result.stderr, /warning: the launch options are ambiguous; not relaunching/);
  assert.match(result.stdout, new RegExp(handoffPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.equal(readRecords(recordPath).length, 1);
});

test('an unknown option with no bare word after it is replayed', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, [
    'claude', '--not-a-real-option', '--verbose', 'first prompt',
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /warning: cannot tell whether/);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [
    `${SEED} ${handoffPath}`, '--not-a-real-option', '--verbose',
  ]);
});

test('devin runtime dispatch does not fall through to claude', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox);
  const result = runWrapper(sandbox, ['devin', 'initial prompt']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 1);
  assert.equal(records[0].runtime, 'devin');
  assert.deepEqual(records[0].args, ['initial prompt']);
});

test('wrapper carries a valid spec folder in the relaunch seed', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  fs.writeFileSync(handoffPath, `---\nstatus: open\nspec_folder: ${SPEC_FOLDER}\n---\n`);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, [
    `${SEED} ${handoffPath} | Spec folder: ${SPEC_FOLDER}${SPEC_FOLDER_SUFFIX}`,
  ]);
  assert.doesNotMatch(readLog(sandbox), /spec-folder-dropped/);
});

test('wrapper carries Gate 3 Skip in the relaunch seed', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  fs.writeFileSync(handoffPath, '---\nstatus: open\nspec_folder: none\n---\n');

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [
    `${SEED} ${handoffPath} | Spec folder: none${SKIP_SPEC_FOLDER_SUFFIX}`,
  ]);
  const seed = records[1].args[0];
  assert.equal(
    (seed.match(/\(/g) || []).length,
    (seed.match(/\)/g) || []).length,
    seed,
  );
  assert.doesNotMatch(readLog(sandbox), /spec-folder-dropped/);
});

test('wrapper builds the relaunch seed suffix through the shared core formatter', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const { wrapperPath, marker } = installWrapperCopyWithChangedSuffix(sandbox);

  const result = runWrapperScript(sandbox, wrapperPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [
    `${SEED} ${handoffPath} | Spec folder: ${SPEC_FOLDER}${marker}`,
  ]);
});

test('wrapper relaunches without a spec-folder suffix when the core formatter throws', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const { wrapperPath } = installWrapperWithThrowingSuffix(sandbox);

  const result = runWrapperScript(sandbox, wrapperPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
  assert.match(result.stderr, /could not build the spec-folder suffix/);
});

test('a hop says so when the wrapper file changed after the loop started', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const { wrapperPath } = installWrapperCopy(sandbox);
  Object.assign(sandbox.env, {
    WRAPPER_APPEND_ON_INVOCATION: '1',
    WRAPPER_APPEND_PATH: wrapperPath,
  });

  const result = runWrapperScript(sandbox, wrapperPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  const notices = result.stderr.split('\n')
    .filter((line) => line.startsWith('note: skilled-loop changed on disk'));
  assert.equal(notices.length, 1, result.stderr);
  assert.match(notices[0], /restart the wrapper/);
});

test('a hop logs wrapper-changed when the wrapper file changed after the loop started', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const { wrapperPath } = installWrapperCopy(sandbox);
  Object.assign(sandbox.env, {
    WRAPPER_APPEND_ON_INVOCATION: '1',
    WRAPPER_APPEND_PATH: wrapperPath,
  });

  const result = runWrapperScript(sandbox, wrapperPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  const notices = result.stderr.split('\n')
    .filter((line) => line.startsWith('note: skilled-loop changed on disk'));
  assert.equal(notices.length, 1, result.stderr);
  const logLines = readLog(sandbox).split('\n')
    .filter((line) => line.includes('wrapper-changed'));
  assert.equal(logLines.length, 1, readLog(sandbox));
  assert.match(logLines[0], new RegExp(`loopId=${records[0].env.SKILLED_LOOP_ID}$`));
});

test('a hop prints and logs nothing when the wrapper file cannot be read', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const { wrapperPath } = installWrapperCopy(sandbox);
  Object.assign(sandbox.env, {
    WRAPPER_MAKE_UNREADABLE_ON_INVOCATION: '1',
    WRAPPER_UNREADABLE_PATH: wrapperPath,
  });

  const result = runWrapperScript(sandbox, wrapperPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.doesNotMatch(result.stderr, /changed on disk/);
  assert.doesNotMatch(readLog(sandbox), /wrapper-changed/);
});

// The loop-start read can fail while a later hop read succeeds, so the stub fails only its
// first call. A checksum read at one end and not the other is unknown, never a change.
test('a hop prints and logs nothing when the wrapper file could not be read at loop start', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const { wrapperPath } = installWrapperCopy(sandbox);
  const realCksum = spawnSync('/bin/bash', ['-c', 'command -v cksum'], { encoding: 'utf8' })
    .stdout.trim();
  assert.notEqual(realCksum, '', 'the host resolves a real cksum for later reads');
  const callCountPath = path.join(sandbox.root, 'cksum-calls');
  const stubPath = path.join(sandbox.binDir, 'cksum');
  fs.writeFileSync(stubPath, `#!/usr/bin/env bash
set -euo pipefail
count=0
if [[ -f '${callCountPath}' ]]; then count=$(cat '${callCountPath}'); fi
count=$((count + 1))
printf '%s' "$count" > '${callCountPath}'
# The first read is the loop-start checksum; every later read is a hop checksum.
if [[ "$count" -eq 1 ]]; then exit 1; fi
exec '${realCksum}' "$@"
`, { mode: 0o755 });

  const result = runWrapperScript(sandbox, wrapperPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.doesNotMatch(result.stderr, /changed on disk/);
  assert.doesNotMatch(readLog(sandbox), /wrapper-changed/);
});

test('a hop prints no change notice when the wrapper file is unchanged', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const { wrapperPath } = installWrapperCopy(sandbox);

  const result = runWrapperScript(sandbox, wrapperPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.doesNotMatch(result.stderr, /changed on disk/);
  assert.doesNotMatch(readLog(sandbox), /wrapper-changed/);
});

test('wrapper leaves an empty spec folder unanswered without logging a drop', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  fs.writeFileSync(handoffPath, '---\nstatus: open\nspec_folder: \n---\n');

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
  assert.doesNotMatch(readLog(sandbox), /spec-folder-dropped/);
});

const invalidSpecFolders = [
  ['parent traversal', '../x'],
  ['spec-folder parent traversal', 'specs/../x'],
  ['trailing parent traversal', 'specs/a/..'],
  ['shell metacharacters', 'specs/a;touch'],
  ['absolute', '/absolute'],
  ['carriage return', 'specs/hooks\r/invalid'],
];

for (const [label, specFolder] of invalidSpecFolders) {
  test(`wrapper drops ${label} spec folders and logs them`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    fs.writeFileSync(handoffPath, `---\nstatus: open\nspec_folder: ${specFolder}\n---\n`);

    const result = runWrapper(sandbox, ['claude']);

    assert.equal(result.status, 0, result.stderr);
    const records = readRecords(recordPath);
    assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
    assert.match(readLog(sandbox), /spec-folder-dropped loopId=/);
  });
}

test('wrapper stops the hop and prints the manual command when consumed JSON cannot be parsed', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  installMalformedConsumeStub(sandbox);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 1, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.match(result.stderr, /warning: could not read the consumed relaunch record; not relaunching/);
  assert.ok(result.stdout.includes(expectedClaudeManualCommand(handoffPath)), result.stderr);
  // The wrapper declined this hop, so no hand-over line may exist for it.
  assert.deepEqual(handOverLines(sandbox), []);
});

test('name scanning stops at -- and relaunch omits the name option', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '--', '-n', 'data']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[0].args, ['--', '-n', 'data']);
  assert.equal(records[0].env.SKILLED_LOOP_NAME, '');
  assert.deepEqual(records[1].args, [SEED + ' ' + handoffPath]);
});

test('wrapper starts claude with no arguments under /bin/bash', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox);
  const result = runWrapper(sandbox, ['claude']);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath).map((record) => record.args), [[]]);
});

test('wrapper defaults to claude when it has no arguments', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox);
  const result = runWrapper(sandbox, []);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath).map((record) => record.args), [[]]);
});

test('wrapper passes a single prompt argument to the default claude runtime', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox);
  const result = runWrapper(sandbox, ['fix this issue']);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath).map((record) => record.args), [['fix this issue']]);
});

test('wrapper exports runtime identity for each supported runtime', (t) => {
  for (const runtime of RUNTIMES) {
    const sandbox = createSandbox(t);
    const { recordPath } = installRuntimeStub(sandbox);
    const result = runWrapper(sandbox, [runtime]);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readRecords(recordPath)[0].env.SKILLED_LOOP_RUNTIME,
      runtime,
    );
  }
});

test('Claude carries --model value before the seed and name on relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = [
    '--model', 'selected-model', '-n', 'named', '--resume', 'previous-session',
  ];
  const result = runWrapper(sandbox, ['claude', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  const seed = `${SEED} ${handoffPath}`;
  assert.deepEqual(records[0].args, firstArguments);
  assert.deepEqual(records[1].args, [
    '--model', 'selected-model', seed, '--name', 'named (2)',
  ]);
  assert.equal(records[0].env.SKILLED_LOOP_MODEL, 'selected-model');
  assert.equal(records[1].env.SKILLED_LOOP_MODEL, 'selected-model');
  assert.equal(records[1].args.some((arg) => (
    ['--resume', '-r', '--continue', '-c', '--session'].includes(arg)
  )), false);
});

test('Claude carries --model=value as a normalized model flag on relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = ['--model=selected-model', 'initial prompt'];
  const result = runWrapper(sandbox, ['claude', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, firstArguments);
  assert.deepEqual(records[1].args, [
    '--model', 'selected-model', `${SEED} ${handoffPath}`,
  ]);
});

test('wrapper exports the selected model to Claude across relaunches', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = ['--model', 'selected-model', 'initial prompt'];
  const result = runWrapper(sandbox, ['claude', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, firstArguments);
  assert.equal(records[0].env.SKILLED_LOOP_MODEL, 'selected-model');
  assert.equal(records[1].env.SKILLED_LOOP_MODEL, 'selected-model');
});

test('Claude does not inherit model or provider env without a model argument', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  sandbox.env.SKILLED_LOOP_MODEL = 'inherited-model';
  sandbox.env.SKILLED_LOOP_PROVIDER = 'inherited-provider';

  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.equal(records[1].args.includes('--model'), false);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
  assert.deepEqual(
    records.map(({ env }) => [env.hasModel, env.hasProvider]),
    [[false, false], [false, false]],
  );
});

test('model scanning stops at -- while carrying the model selected before it', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = ['--model', 'selected-model', '--', '--model', 'data'];
  const result = runWrapper(sandbox, ['claude', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, firstArguments);
  assert.deepEqual(records[1].args, [
    '--model', 'selected-model', `${SEED} ${handoffPath}`,
  ]);
});

test('Claude keeps a multiword model as one relaunch argument', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '--model', 'a b c', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, [
    '--model', 'a b c', `${SEED} ${handoffPath}`,
  ]);
});

test('Claude ignores --model when it has no value', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '--model']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
});

test('second invocation omits --name when the first launch had no name', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
});

test('pi relaunch carries provider and model before name and seed', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = [
    '-ne', '-e', './ext.ts', '--provider', 'openai', '--model', 'm', '-n', 'N',
    '--session', 'previous',
  ];
  const result = runWrapper(sandbox, ['pi', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  const seed = `${SEED} ${handoffPath}`;
  const extensionPath = path.resolve(records[0].cwd, './ext.ts');
  assert.equal(records.length, 2);
  assert.equal(records[0].runtime, 'pi');
  assert.deepEqual(records[0].args, firstArguments);
  assert.equal(records[1].runtime, 'pi');
  assert.deepEqual(records[1].args, [
    '--provider', 'openai', '--model', 'm', '-ne', '-e', extensionPath, '--name', 'N (2)', seed,
  ]);
  assert.equal(records[1].cwd, fs.realpathSync(sandbox.recordedCwd));
  assert.notEqual(records[1].cwd, path.resolve(sandbox.repoRoot));
  assert.equal(records[0].env.SKILLED_LOOP_MODEL, 'm');
  assert.equal(records[0].env.SKILLED_LOOP_PROVIDER, 'openai');
  assert.equal(records[1].env.SKILLED_LOOP_MODEL, 'm');
  assert.equal(records[1].env.SKILLED_LOOP_PROVIDER, 'openai');
  assert.equal(
    records[1].args.some((arg) => (
      ['--resume', '-r', '--continue', '-c', '--session'].includes(arg)
    )),
    false,
  );
});

test('Pi normalizes extension aliases and preserves selection order on relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const absoluteExtension = path.join(sandbox.root, 'absolute-extension.ts');
  const firstArguments = [
    '--no-extensions', '--no-extensions',
    '--extension', 'one.ts',
    '--extension=two.ts',
    '-e', './three.ts',
    '-e', 'builtin:foo',
    '-e', absoluteExtension,
  ];
  const result = runWrapper(sandbox, ['pi', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  const startDirectory = records[0].cwd;
  assert.deepEqual(records[1].args, [
    '-ne',
    '-e', path.resolve(startDirectory, 'one.ts'),
    '-e', path.resolve(startDirectory, 'two.ts'),
    '-e', path.resolve(startDirectory, './three.ts'),
    '-e', 'builtin:foo',
    '-e', absoluteExtension,
    `${SEED} ${handoffPath}`,
  ]);
});

// The shared runtime stub arms a record from the fields its environment names. This adds the
// consumed mode to that same stub, so each runtime invocation keeps a single Node process
// inside the wrapper's launch window.
function installPiModeStub(sandbox, mode) {
  const stubPath = path.join(sandbox.binDir, 'pi');
  const source = fs.readFileSync(stubPath, 'utf8').replace(
    RUNTIME_SOURCE,
    `${RUNTIME_SOURCE}
if (process.env.RECORD_MODE) {
  const modePath = path.join(
    process.env.XDG_RUNTIME_DIR,
    "skilled-relaunch",
    "relaunch-" + process.env.SKILLED_LOOP_ID + ".json",
  );
  if (fs.existsSync(modePath)) {
    const modeRecord = JSON.parse(fs.readFileSync(modePath, "utf8"));
    modeRecord.mode = process.env.RECORD_MODE;
    fs.writeFileSync(modePath, JSON.stringify(modeRecord));
  }
}
`,
  );
  fs.writeFileSync(stubPath, source, { mode: 0o755 });
  sandbox.env.RECORD_MODE = mode;
}

test('pi relaunch replaces the launch mode flag with the consumed mode', (t) => {
  const cases = [
    { consumedMode: 'plan', presentFlag: '--plan', absentFlag: '--build' },
    { consumedMode: 'auto', presentFlag: '--build', absentFlag: '--plan' },
  ];

  for (const { consumedMode, presentFlag, absentFlag } of cases) {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    installPiModeStub(sandbox, consumedMode);
    const result = runWrapper(sandbox, ['pi', '--build', 'first prompt']);
    assert.equal(result.status, 0, `${consumedMode}: ${result.stderr}`);

    const records = readRecords(recordPath);
    assert.equal(records.length, 2, consumedMode);
    assert.deepEqual(records[0].args, ['--build', 'first prompt'], consumedMode);
    const hopArguments = records[1].args;
    const hopLine = hopArguments.join(' ');
    assert.equal(
      hopArguments.filter((argument) => argument === presentFlag).length,
      1,
      `${consumedMode}: ${hopLine}`,
    );
    assert.equal(
      hopArguments.filter((argument) => argument === absentFlag).length,
      0,
      `${consumedMode}: ${hopLine}`,
    );
    assert.ok(hopArguments.includes(`${SEED} ${handoffPath}`), hopLine);
  }
});

// A named loop hands the receiver the sender's live name plus the receiver's session
// number, so the operator can tell the hop apart without the suffixes stacking.
test('a Claude hop numbers the replayed name', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '-n', 'X', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`, '--name', 'X (2)']);
  assert.equal(records[1].env.SKILLED_LOOP_NAME, 'X');
  assert.deepEqual(records.map((record) => record.env.SKILLED_LOOP_HOPS), ['0', '1']);
});

test('a hop replays the sender\'s live name with the next number', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_NAME: 'Renamed',
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`, '--name', 'Renamed (2)']);
  assert.equal(records[1].env.SKILLED_LOOP_NAME, 'Renamed');
});

test('a second hop replaces the sender\'s number instead of stacking it', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    SKILLED_LOOP_HOPS: '1',
    RECORD_NAME: 'X (2)',
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`, '--name', 'X (3)']);
  assert.equal(records[1].env.SKILLED_LOOP_NAME, 'X');
  assert.deepEqual(records.map((record) => record.env.SKILLED_LOOP_HOPS), ['1', '2']);
});

test('a name that ends in another number keeps it', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_NAME: 'Phase (7)',
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`, '--name', 'Phase (7) (2)']);
  assert.equal(records[1].env.SKILLED_LOOP_NAME, 'Phase (7)');
});

test('a consumed name that fails the check falls back to the launch name', (t) => {
  for (const consumedName of ['-x', 'a\nb']) {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      RECORD_NAME: consumedName,
    });
    const result = runWrapper(sandbox, ['claude', '-n', 'X', 'initial prompt']);
    assert.equal(result.status, 0, result.stderr);
    const records = readRecords(recordPath);
    assert.equal(records.length, 2);
    assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`, '--name', 'X (2)']);
    assert.match(result.stderr, /warning: ignoring the sender name/);
  }
});

test('a Pi hop numbers the replayed name', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['pi', '-n', 'N', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[1].args, ['--name', 'N (2)', `${SEED} ${handoffPath}`]);
  assert.equal(records[1].env.SKILLED_LOOP_NAME, 'N');
});

test('the manual command carries the name stem without a number', (t) => {
  const sandbox = createSandbox(t);
  installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    RECORD_NAME: 'X',
    STUB_EXIT_CODES: '7',
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 7, result.stderr);
  const manualCommand = result.stdout
    .split('\n')
    .find((line) => line.startsWith('skilled-loop '));
  assert.ok(manualCommand, result.stderr);
  assert.match(manualCommand, /'--name' 'X'/, manualCommand);
  assert.equal(manualCommand.includes('(2)'), false, manualCommand);
});
