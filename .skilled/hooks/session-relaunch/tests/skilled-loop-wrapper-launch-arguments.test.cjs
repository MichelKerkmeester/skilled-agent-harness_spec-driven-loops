// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Tests: Launch Arguments
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { RUNTIMES } = require('../lib/relaunch-core.cjs');
const {
  SEED, SPEC_FOLDER, SPEC_FOLDER_SUFFIX, SKIP_SPEC_FOLDER_SUFFIX, LOOP_ID_PATTERN,
  expectedClaudeManualCommand, createSandbox, installRuntimeStub, writeSpecFolderNote,
  runWrapperScript, runWrapper, handOverLines, installWrapperCopyWithChangedSuffix,
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
    'X',
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
  ], (seed) => [seed, '--add-dir', '/tmp', '--permission-mode', 'plan']);
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
      (seed) => [seed, '--permission-mode', 'plan']],
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
  ], (seed) => [seed, '--append-system-prompt', '-x', '--permission-mode', 'plan']);
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
  assert.ok(args.includes('launch name'));
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
    '--model', 'selected-model', seed, '--name', 'named',
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
    '--provider', 'openai', '--model', 'm', '-ne', '-e', extensionPath, '--name', 'N', seed,
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
