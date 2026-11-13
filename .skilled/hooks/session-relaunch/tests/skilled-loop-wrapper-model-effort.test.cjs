// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Tests: Model And Effort
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { manualClaimCommand, resolveSessionSettings } = require('../lib/relaunch-core.cjs');
const {
  SEED, SPEC_FOLDER, LOOP_ID_PATTERN, LEFTOVER_RECORD, expectedClaudeManualCommand,
  createSandbox, installRuntimeStub, writeSpecFolderNote, runWrapperScript,
  installLeftoverRecordLauncher, installSymlinkedRecordLauncher, runWrapper, withManualTemplate,
  readRecords, readLog, OPENCODE_2_HELP,
} = require('./skilled-loop-wrapper-harness.cjs');

test('Pi extension scanning stops at --', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = ['--', '-ne', '-e', './late.ts', '--extension=also-late.ts'];
  const result = runWrapper(sandbox, ['pi', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, firstArguments);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
});

test('Pi does not carry -e when it has no value', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['pi', '-e']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, ['-e']);
  assert.deepEqual(records[1].args, [`${SEED} ${handoffPath}`]);
});

test('wrapper exports the selected provider and model to Pi across relaunches', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = ['--provider=openai', '--model=gpt-6-luna'];
  const result = runWrapper(sandbox, ['pi', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, firstArguments);
  assert.equal(records[0].env.SKILLED_LOOP_PROVIDER, 'openai');
  assert.equal(records[0].env.SKILLED_LOOP_MODEL, 'gpt-6-luna');
  assert.equal(records[1].env.SKILLED_LOOP_PROVIDER, 'openai');
  assert.equal(records[1].env.SKILLED_LOOP_MODEL, 'gpt-6-luna');
});

test('opencode carries -m before --prompt and never passes a resume flag', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const firstArguments = ['-m', 'openai/gpt-6-luna', '--continue', 'previous-session'];
  const result = runWrapper(sandbox, ['opencode', ...firstArguments]);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  const seed = `${SEED} ${handoffPath}`;
  assert.equal(records.length, 2);
  assert.equal(records[0].runtime, 'opencode');
  assert.deepEqual(records[0].args, firstArguments);
  assert.equal(records[1].runtime, 'opencode');
  assert.deepEqual(records[1].args, ['-m', 'openai/gpt-6-luna', '--prompt', seed]);
  assert.equal(records[0].env.SKILLED_LOOP_MODEL, 'openai/gpt-6-luna');
  assert.equal(records[1].env.SKILLED_LOOP_MODEL, 'openai/gpt-6-luna');
  assert.equal(records[1].args.includes('--name'), false);
  assert.equal(
    records[1].args.some((arg) => (
      ['--resume', '-r', '--continue', '-c', '--session'].includes(arg)
    )),
    false,
  );
});

test('opencode normalizes --model m before --prompt on relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['opencode', '--model', 'm']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, [
    '-m', 'm', '--prompt', `${SEED} ${handoffPath}`,
  ]);
});

test('opencode normalizes --model=m before --prompt on relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['opencode', '--model=m']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, [
    '-m', 'm', '--prompt', `${SEED} ${handoffPath}`,
  ]);
});

test('opencode 2 starts standalone on the first launch and on every relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '*',
    SESSION_RELAUNCH_MAX_HOPS: '2',
    STUB_HELP: OPENCODE_2_HELP,
  });
  const result = runWrapper(sandbox, ['opencode', 'initial prompt']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  const relaunch = ['--standalone', '--prompt', `${SEED} ${handoffPath}`];
  assert.equal(records.length, 3);
  assert.deepEqual(records[0].args, ['--standalone', 'initial prompt']);
  assert.deepEqual(records[1].args, relaunch);
  assert.deepEqual(records[2].args, relaunch);
});

test('opencode 2 does not duplicate an operator-supplied --standalone', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    STUB_HELP: OPENCODE_2_HELP,
  });
  const result = runWrapper(sandbox, ['opencode', '--standalone', '--auto']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, ['--standalone', '--auto']);
  assert.deepEqual(records[1].args, ['--standalone', '--prompt', `${SEED} ${handoffPath}`, '--auto']);
});

test('opencode 2 relaunch drops -m because its root command has no model flag', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    STUB_HELP: OPENCODE_2_HELP,
  });
  const result = runWrapper(sandbox, ['opencode', '--model', 'openai/gpt-6-luna']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, ['--standalone', '--prompt', `${SEED} ${handoffPath}`]);
});

test('opencode 2 on --server leaves the launch alone and warns the loop cannot arm', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { STUB_HELP: OPENCODE_2_HELP });
  const result = runWrapper(sandbox, ['opencode', '--server', 'http://localhost:4096']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[0].args, ['--server', 'http://localhost:4096']);
  assert.match(result.stderr, /warning: .*--server.*cannot arm/);
});

test('opencode 2 equals-form server warns and keeps the launch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, {
    STUB_HELP: OPENCODE_2_HELP,
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const result = runWrapper(sandbox, ['opencode', '--server=http://localhost:4096']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[0].args, ['--server=http://localhost:4096']);
  assert.match(result.stderr, /warning: .*--server.*cannot arm/);
});

// The harness puts its stubs in front of the real PATH, which holds every runtime on a
// developer machine, so this case builds a PATH that has node and the system tools only.
test('missing runtime binary exits 127', (t) => {
  const sandbox = createSandbox(t);
  const nodeOnly = path.join(sandbox.root, 'node-only');
  fs.mkdirSync(nodeOnly);
  fs.symlinkSync(process.execPath, path.join(nodeOnly, 'node'));
  Object.assign(sandbox.env, {
    PATH: `${nodeOnly}:/usr/bin:/bin`,
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const lookup = spawnSync('/bin/bash', ['-c', 'command -v claude'], {
    env: sandbox.env, encoding: 'utf8',
  });
  assert.notEqual(lookup.status, 0, `claude resolves on the test PATH: ${lookup.stdout}`);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 127, result.stderr);
  assert.match(result.stderr, /claude: command not found/);
});

test('opencode without --standalone in its help keeps the launch and the -m replay', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    STUB_HELP: '  -m, --model   model to use',
  });
  const result = runWrapper(sandbox, ['opencode', '-m', 'p/m']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, ['-m', 'p/m']);
  assert.deepEqual(records[1].args, ['-m', 'p/m', '--prompt', `${SEED} ${handoffPath}`]);
});

test('wrapper removes its own leftover relaunch record before the first launch', (t) => {
  const sandbox = createSandbox(t);
  const probePath = path.join(sandbox.root, 'state-probe.txt');
  const { recordPath } = installRuntimeStub(sandbox, { STATE_PROBE_FILE: probePath });
  const launcherPath = installLeftoverRecordLauncher(sandbox, [['relaunch-$$.json', '$$']]);

  const result = runWrapperScript(sandbox, launcherPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  assert.match(loopId, LOOP_ID_PATTERN);
  assert.equal(
    fs.readFileSync(path.join(sandbox.root, 'planted-loop-id.txt'), 'utf8'),
    loopId,
  );
  assert.equal(fs.readFileSync(probePath, 'utf8'), 'absent');
  assert.equal(fs.existsSync(path.join(
    sandbox.xdgRuntimeDir, 'skilled-relaunch', `relaunch-${loopId}.json`,
  )), false);
});

test('a leftover relaunch record for another loop is kept', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox);
  const launcherPath = installLeftoverRecordLauncher(sandbox, [
    ['relaunch-$$.json', '$$'],
    ['relaunch-999999.json', '999999'],
  ]);

  const result = runWrapperScript(sandbox, launcherPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  assert.notEqual(loopId, '999999');
  const otherRecordPath = path.join(
    sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch-999999.json',
  );
  assert.equal(fs.existsSync(otherRecordPath), true);
  assert.deepEqual(
    JSON.parse(fs.readFileSync(otherRecordPath, 'utf8')),
    { ...LEFTOVER_RECORD, loopId: '999999' },
  );
});

test('an own leftover record that is a symlink is removed and its target is kept', (t) => {
  const sandbox = createSandbox(t);
  const outsideRecordPath = path.join(sandbox.root, 'outside-record.json');
  const outsideContent = JSON.stringify(LEFTOVER_RECORD);
  fs.writeFileSync(outsideRecordPath, outsideContent);
  const probePath = path.join(sandbox.root, 'state-probe.txt');
  const { recordPath } = installRuntimeStub(sandbox, { STATE_PROBE_FILE: probePath });
  const launcherPath = installSymlinkedRecordLauncher(sandbox, outsideRecordPath);

  const result = runWrapperScript(sandbox, launcherPath, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  // The runtime reads the probe, so the removal must have happened before the launch; the
  // wrapper's own consume after the runtime exits would otherwise cover for a late cleanup.
  assert.equal(fs.readFileSync(probePath, 'utf8'), 'absent');
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  assert.match(loopId, LOOP_ID_PATTERN);
  const ownRecordPath = path.join(
    sandbox.xdgRuntimeDir, 'skilled-relaunch', `relaunch-${loopId}.json`,
  );
  // lstat does not follow the link, so a link left behind counts as present even when its
  // target is gone.
  let ownRecordPresent = true;
  try {
    fs.lstatSync(ownRecordPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    ownRecordPresent = false;
  }
  assert.equal(ownRecordPresent, false);
  assert.equal(fs.readFileSync(outsideRecordPath, 'utf8'), outsideContent);
});

test('wrapper declines a stale armed record and logs the decline', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    STALE_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
  });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 7, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.equal(
    result.stdout.split('\n').find((line) => line.startsWith('skilled-loop ')),
    expectedClaudeManualCommand(handoffPath, SPEC_FOLDER),
  );
  assert.equal(
    manualClaimCommand('claude', handoffPath, SPEC_FOLDER),
    expectedClaudeManualCommand(handoffPath, SPEC_FOLDER),
  );
  assert.match(readLog(sandbox), /decline/);
  assert.match(readLog(sandbox), /stale/);
});

for (const { label, specFolder } of [
  { label: 'packet', specFolder: SPEC_FOLDER },
  { label: 'skip', specFolder: 'none' },
  { label: 'empty', specFolder: '' },
]) {
  test(`wrapper pending print carries the consumed ${label} answer`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      PENDING_ON_INVOCATION: '1',
      STUB_EXIT_CODES: '7',
    });
    writeSpecFolderNote(handoffPath, specFolder);
    const result = runWrapper(sandbox, ['claude', 'initial prompt']);
    assert.equal(result.status, 7, result.stderr);
    assert.equal(readRecords(recordPath).length, 1);
    assert.equal(
      result.stdout.split('\n').find((line) => line.startsWith('skilled-loop ')),
      expectedClaudeManualCommand(handoffPath, specFolder),
    );
    assert.equal(
      manualClaimCommand('claude', handoffPath, specFolder),
      expectedClaudeManualCommand(handoffPath, specFolder),
    );
    assert.equal(fs.existsSync(path.join(
      sandbox.xdgRuntimeDir,
      'skilled-relaunch',
      `relaunch-${readRecords(recordPath)[0].env.SKILLED_LOOP_ID}.json`,
    )), false);
    assert.match(readLog(sandbox), /decline/);
    assert.match(readLog(sandbox), /not-armed/);
  });
}

test('wrapper prints a manual command when the hop cap declines a record', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    STUB_EXIT_CODES: '7',
    SESSION_RELAUNCH_MAX_HOPS: '0',
  });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);

  assert.equal(result.status, 7, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.equal(
    result.stdout.split('\n').find((line) => line.startsWith('skilled-loop ')),
    expectedClaudeManualCommand(handoffPath, SPEC_FOLDER),
  );
  assert.equal(
    manualClaimCommand('claude', handoffPath, SPEC_FOLDER),
    expectedClaudeManualCommand(handoffPath, SPEC_FOLDER),
  );
  assert.match(readLog(sandbox), /hop-cap/);
});

test('declined relaunch warns when the handoff path contains a line break', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = path.join(sandbox.root, 'handoff-\nline.md');
  const { recordPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
    HANDOFF_PATH: handoffPath,
  });

  const result = runWrapper(sandbox, ['claude', 'initial prompt']);

  assert.equal(result.status, 7, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.match(
    result.stderr,
    /warning: the handoff path contains a line break; no manual command printed/,
  );
  assert.equal(
    (result.stdout + result.stderr).split('\n').some((line) => line.startsWith('skilled-loop ')),
    false,
  );
});

test('codex disables the daemon on the first launch and each relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '*',
    SESSION_RELAUNCH_MAX_HOPS: '2',
  });
  const runtimeArguments = ['--model', 'codex-model', 'initial prompt'];
  const result = runWrapper(sandbox, ['codex', ...runtimeArguments]);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  const relaunchArguments = ['--no-daemon', '-m', 'codex-model', `${SEED} ${handoffPath}`];
  assert.equal(records.length, 3);
  assert.deepEqual(
    records.map((record) => record.args.filter((argument) => argument === '--no-daemon').length),
    [1, 1, 1],
  );
  assert.deepEqual(records[0].args, ['--no-daemon', ...runtimeArguments]);
  assert.deepEqual(records[1].args, relaunchArguments);
  assert.deepEqual(records[2].args, relaunchArguments);
});

test('codex does not duplicate an operator-supplied --no-daemon option', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const runtimeArguments = [
    '--no-daemon', '--model', 'codex-model', 'initial prompt',
  ];
  const result = runWrapper(sandbox, ['codex', ...runtimeArguments]);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[0].args, runtimeArguments);
  assert.deepEqual(records[1].args, [
    '--no-daemon', '-m', 'codex-model', `${SEED} ${handoffPath}`,
  ]);
  assert.equal(records[1].args.filter((argument) => argument === '--no-daemon').length, 1);
});

// Each runtime names its effort flag differently and accepts a different level list, so the
// wrapper replays the operator's own flag in that runtime's syntax and drops a level the
// runtime would reject, which would otherwise end the relaunch at a usage error.
const EFFORT_CARRY_CASES = [
  {
    name: 'claude --effort',
    runtime: 'claude',
    first: ['--model', 'm', '--effort', 'high', 'p'],
    relaunch: (seed) => ['--model', 'm', '--effort', 'high', seed],
  },
  {
    name: 'claude --effort=',
    runtime: 'claude',
    first: ['--effort=max', 'p'],
    relaunch: (seed) => ['--effort', 'max', seed],
  },
  {
    name: 'codex quoted -c model_reasoning_effort',
    runtime: 'codex',
    first: ['-m', 'm', '-c', 'model_reasoning_effort="xhigh"', 'p'],
    relaunch: (seed) => ['--no-daemon', '-m', 'm', '-c', 'model_reasoning_effort="xhigh"', seed],
  },
  {
    name: 'codex bare --config model_reasoning_effort',
    runtime: 'codex',
    first: ['--config', 'model_reasoning_effort=low', 'p'],
    relaunch: (seed) => ['--no-daemon', '-c', 'model_reasoning_effort="low"', seed],
  },
  {
    name: 'pi --thinking',
    runtime: 'pi',
    first: ['--model', 'm', '--thinking', 'high', 'p'],
    relaunch: (seed) => ['--model', 'm', '--thinking', 'high', seed],
  },
];

for (const effortCase of EFFORT_CARRY_CASES) {
  test(`relaunch replays the launch effort: ${effortCase.name}`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    const result = runWrapper(sandbox, [effortCase.runtime, ...effortCase.first]);

    assert.equal(result.status, 0, result.stderr);
    const records = readRecords(recordPath);
    assert.equal(records.length, 2);
    assert.deepEqual(records[1].args, effortCase.relaunch(`${SEED} ${handoffPath}`));
  });
}

test('relaunch drops a launch effort its runtime would reject', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '--model', 'm', '--effort', 'bogus', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, ['--model', 'm', `${SEED} ${handoffPath}`]);
  assert.match(result.stderr, /warning: .*bogus.*relaunching without it/);
});

test('relaunch does not invent an effort for a runtime with no effort flag', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['devin', '--model', 'm', '--', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, ['--model', 'm', '--', `${SEED} ${handoffPath}`]);
});

test('the sender live model and effort replace the launch values for that hop', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: 'live-model',
    RECORD_EFFORT: 'max',
  });
  const result = runWrapper(sandbox, ['claude', '--model', 'launch-model', '--effort', 'low', 'p']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.deepEqual(records[1].args, [
    '--model', 'live-model', '--effort', 'max', `${SEED} ${handoffPath}`,
  ]);
  assert.equal(records[1].env.SKILLED_LOOP_MODEL, 'live-model');
  assert.equal(records[1].env.SKILLED_LOOP_EFFORT, 'max');
});

test('a Pi sender live provider, model and thinking level replace the launch values', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: 'gpt-6-luna',
    RECORD_PROVIDER: 'openai',
    RECORD_EFFORT: 'high',
  });
  const result = runWrapper(sandbox, [
    'pi', '--provider', 'anthropic', '--model', 'claude-sonnet-5-5', '--thinking', 'low',
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--provider', 'openai', '--model', 'gpt-6-luna', '--thinking', 'high', `${SEED} ${handoffPath}`,
  ]);
});

// An effort is chosen for one model, so a hop onto a different model carries the effort the
// sender recorded beside that model, or none, and never the launch effort of the old one.
const MODEL_SWITCH_EFFORT_CASES = [
  {
    runtime: 'claude',
    first: ['--model', 'claude-sonnet-5-5', '--effort', 'low', 'p'],
    liveModel: 'claude-opus-5-5',
    relaunch: (seed, effort) => [
      '--model', 'claude-opus-5-5', ...(effort ? ['--effort', effort] : []), seed,
    ],
  },
  {
    runtime: 'codex',
    first: ['-m', 'gpt-5.6-luna', '-c', 'model_reasoning_effort="low"', 'p'],
    liveModel: 'gpt-6-luna',
    relaunch: (seed, effort) => [
      '--no-daemon', '-m', 'gpt-6-luna',
      ...(effort ? ['-c', `model_reasoning_effort="${effort}"`] : []), seed,
    ],
  },
  {
    runtime: 'pi',
    first: ['--model', 'gpt-5.6-luna', '--thinking', 'low', 'p'],
    liveModel: 'gpt-6-luna',
    relaunch: (seed, effort) => [
      '--model', 'gpt-6-luna', ...(effort ? ['--thinking', effort] : []), seed,
    ],
  },
];

for (const switchCase of MODEL_SWITCH_EFFORT_CASES) {
  test(`a live model with no live effort drops the launch effort: ${switchCase.runtime}`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      RECORD_MODEL: switchCase.liveModel,
    });
    const result = runWrapper(sandbox, [switchCase.runtime, ...switchCase.first]);

    assert.equal(result.status, 0, result.stderr);
    const records = readRecords(recordPath);
    assert.deepEqual(records[1].args, switchCase.relaunch(`${SEED} ${handoffPath}`, ''));
    assert.equal(records[1].env.SKILLED_LOOP_EFFORT, '');
  });

  test(`a live model with its live effort renders that effort: ${switchCase.runtime}`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      RECORD_MODEL: switchCase.liveModel,
      RECORD_EFFORT: 'medium',
    });
    const result = runWrapper(sandbox, [switchCase.runtime, ...switchCase.first]);

    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(
      readRecords(recordPath)[1].args,
      switchCase.relaunch(`${SEED} ${handoffPath}`, 'medium'),
    );
  });
}

test('a live model equal to the launch model keeps the launch effort', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: 'claude-sonnet-5-5',
  });
  const result = runWrapper(sandbox, ['claude', '--model', 'claude-sonnet-5-5', '--effort', 'low', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--model', 'claude-sonnet-5-5', '--effort', 'low', `${SEED} ${handoffPath}`,
  ]);
});

test('a launch with no model keeps its launch effort beside a live model', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: 'claude-opus-5-5',
  });
  const result = runWrapper(sandbox, ['claude', '--effort', 'low', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--model', 'claude-opus-5-5', '--effort', 'low', `${SEED} ${handoffPath}`,
  ]);
});

// Pi takes `provider/model` on its launch line but records the bare model id beside its
// provider, so the two spellings of one model are no switch.
test('a Pi live model matching the provider-prefixed launch model keeps the launch thinking', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: 'gpt-6-luna',
    RECORD_PROVIDER: 'openai',
  });
  const result = runWrapper(sandbox, ['pi', '--model', 'openai/gpt-6-luna', '--thinking', 'low']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--provider', 'openai', '--model', 'gpt-6-luna', '--thinking', 'low', `${SEED} ${handoffPath}`,
  ]);

  const otherProvider = createSandbox(t);
  const switched = installRuntimeStub(otherProvider, {
    markers: '1',
    RECORD_MODEL: 'gpt-6-luna',
    RECORD_PROVIDER: 'openai',
  });
  const switchedResult = runWrapper(otherProvider, [
    'pi', '--model', 'azure/gpt-6-luna', '--thinking', 'low',
  ]);
  assert.equal(switchedResult.status, 0, switchedResult.stderr);
  assert.deepEqual(readRecords(switched.recordPath)[1].args, [
    '--provider', 'openai', '--model', 'gpt-6-luna', `${SEED} ${switched.handoffPath}`,
  ]);
});

// One model id under another provider is a different model, so a hop that changes only the
// provider is a switch however the launch line spelled its provider.
test('a Pi live provider that differs from the launch provider drops the launch thinking', (t) => {
  for (const providerArguments of [['--provider', 'openai'], ['--provider=openai']]) {
    const sandbox = createSandbox(t);
    sandbox.env.SYSTEM_SESSION_RELAUNCH_ENABLED = '1';
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      RECORD_MODEL: 'gpt-6-luna',
      RECORD_PROVIDER: 'azure',
    });
    const result = runWrapper(sandbox, [
      'pi', ...providerArguments, '--model', 'gpt-6-luna', '--thinking', 'low',
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(readRecords(recordPath)[1].args, [
      '--provider', 'azure', '--model', 'gpt-6-luna', `${SEED} ${handoffPath}`,
    ], providerArguments.join(' '));
  }

  const sameProvider = createSandbox(t);
  sameProvider.env.SYSTEM_SESSION_RELAUNCH_ENABLED = '1';
  const kept = installRuntimeStub(sameProvider, {
    markers: '1',
    RECORD_MODEL: 'gpt-6-luna',
    RECORD_PROVIDER: 'openai',
  });
  const keptResult = runWrapper(sameProvider, [
    'pi', '--provider', 'openai', '--model', 'gpt-6-luna', '--thinking', 'low',
  ]);
  assert.equal(keptResult.status, 0, keptResult.stderr);
  assert.deepEqual(readRecords(kept.recordPath)[1].args, [
    '--provider', 'openai', '--model', 'gpt-6-luna', '--thinking', 'low',
    `${SEED} ${kept.handoffPath}`,
  ]);
});

test('every launch carries the time it started, so a hop can tell its own changes apart', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const before = Date.now();
  const result = runWrapper(sandbox, ['cursor', '--model', 'm', 'p']);

  assert.equal(result.status, 0, result.stderr);
  const stamps = readRecords(recordPath).map((record) => Number(record.env.SKILLED_LOOP_LAUNCHED_AT));
  assert.equal(stamps.length, 2);
  for (const stamp of stamps) assert.ok(stamp >= before - 1000 && stamp <= Date.now(), String(stamp));
  assert.ok(stamps[1] >= stamps[0]);
});

test('a Cursor live model keeps its bracketed parameters on the relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: 'grok-4.7[context=256k,reasoning_effort=xhigh,fast=true]',
  });
  const result = runWrapper(sandbox, ['cursor', '--model', 'gpt-5.6-luna', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--model', 'grok-4.7[context=256k,reasoning_effort=xhigh,fast=true]', `${SEED} ${handoffPath}`,
  ]);
});

test('a live provider is ignored on a runtime that does not take one', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_PROVIDER: 'openai',
  });
  const result = runWrapper(sandbox, ['claude', '--model', 'm', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, ['--model', 'm', `${SEED} ${handoffPath}`]);
});

test('a live model or effort the runtime would reject falls back to the launch value', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: '--evil',
    RECORD_EFFORT: 'bogus',
  });
  const result = runWrapper(sandbox, ['claude', '--model', 'launch-model', '--effort', 'low', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--model', 'launch-model', '--effort', 'low', `${SEED} ${handoffPath}`,
  ]);
});

test('a live value is the next hop launch value when that hop records none', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '*',
    SESSION_RELAUNCH_MAX_HOPS: '2',
    RECORD_MODEL: 'live-model',
  });
  const result = runWrapper(sandbox, ['claude', '--model', 'launch-model', 'p']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 3);
  assert.deepEqual(records[2].args, ['--model', 'live-model', `${SEED} ${handoffPath}`]);
});

// A manual claim must start the receiver where an automatic relaunch would have, so the
// printed command carries the sender's live settings and the settings the current hop
// launched on, never only the first launch's.
const MANUAL_SEED_TEMPLATE = `"${SEED} @@HANDOFF@@"`;

function printedManualCommand(result) {
  return result.stdout.split('\n').find((line) => line.startsWith('skilled-loop '));
}

test('manual command carries the live model and effort', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
    RECORD_MODEL: 'claude-opus-5-5',
    RECORD_EFFORT: 'medium',
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const result = runWrapper(sandbox, [
    'claude', '--model', 'claude-sonnet-5-5', '--effort', 'low', 'p',
  ]);

  assert.equal(result.status, 7, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  const template = `skilled-loop claude '--model' 'claude-opus-5-5' '--effort' 'medium' ${MANUAL_SEED_TEMPLATE}`;
  const command = printedManualCommand(result);
  assert.equal(command, withManualTemplate(template, () => manualClaimCommand('claude', handoffPath)));
  assert.equal(command.includes('claude-sonnet-5-5'), false, command);
});

test('Cursor manual command carries the live Cursor model', (t) => {
  const sandbox = createSandbox(t);
  const configPath = path.join(sandbox.home, '.cursor', 'cli-config.json');
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify({
    version: 1,
    model: { modelId: 'grok-4.7', displayModelId: 'grok-4.7' },
    selectedModel: { modelId: 'grok-4.7', parameters: [{ id: 'context', value: '256k' }] },
  }));
  const { model: liveModel } = resolveSessionSettings({
    runtime: 'cursor',
    sessionId: 'session-cursor-0001',
    env: { HOME: sandbox.home, SKILLED_LOOP_LAUNCHED_AT: String(Date.now() - 60000) },
  });
  assert.equal(liveModel, 'grok-4.7[context=256k]');
  const { handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
    RECORD_MODEL: liveModel,
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const result = runWrapper(sandbox, ['cursor', '--model', 'gpt-5.6-luna', 'p']);

  assert.equal(result.status, 7, result.stderr);
  const template = `skilled-loop cursor '--model' '${liveModel}' ${MANUAL_SEED_TEMPLATE}`;
  assert.equal(
    printedManualCommand(result),
    withManualTemplate(template, () => manualClaimCommand('cursor', handoffPath)),
  );
});

test('manual command keeps the launch model for an invalid live model', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
    RECORD_MODEL: '--evil',
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const result = runWrapper(sandbox, [
    'claude', '--model', 'claude-sonnet-5-5', '--effort', 'low', 'p',
  ]);

  assert.equal(result.status, 7, result.stderr);
  const startupTemplate = readRecords(recordPath)[0].env.SKILLED_LOOP_MANUAL_TEMPLATE;
  assert.ok(startupTemplate.includes("'claude-sonnet-5-5'"), startupTemplate);
  assert.equal(
    printedManualCommand(result),
    withManualTemplate(startupTemplate, () => manualClaimCommand('claude', handoffPath)),
  );
});

test('manual command reports a live model that holds the placeholder', (t) => {
  const sandbox = createSandbox(t);
  const { handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
    RECORD_MODEL: 'model-@@HANDOFF@@',
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const result = runWrapper(sandbox, ['claude', '--model', 'claude-sonnet-5-5', 'p']);

  assert.equal(result.status, 7, result.stderr);
  assert.equal(
    printedManualCommand(result),
    withManualTemplate('', () => manualClaimCommand('claude', handoffPath)),
  );
  const errorLine = result.stderr.split('\n').find((line) => line.startsWith('error: '));
  assert.ok(errorLine && errorLine.includes('model-@@HANDOFF@@'), result.stderr);
});

test("manual command after a model-switching hop carries the current hop's model", (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_MODEL: 'claude-opus-5-5',
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const result = runWrapper(sandbox, [
    'claude', '--model', 'claude-sonnet-5-5', '--effort', 'low', 'p',
  ]);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  const template = `skilled-loop claude '--model' 'claude-opus-5-5' ${MANUAL_SEED_TEMPLATE}`;
  assert.equal(records[1].env.SKILLED_LOOP_MANUAL_TEMPLATE, template);
  const command = printedManualCommand(result);
  assert.equal(command, withManualTemplate(template, () => manualClaimCommand('claude', handoffPath)));
  assert.equal(command.includes('claude-sonnet-5-5'), false, command);
});

test('the sender live permission mode replaces the launch mode for that hop', (t) => {
  const sandbox = createSandbox(t);
  // An outer session's mode must not reach the first launch; only the record does.
  sandbox.env.SKILLED_LOOP_PERMISSION_MODE = 'dontAsk';
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_PERMISSION_MODE: 'acceptEdits',
  });
  const result = runWrapper(sandbox, ['claude', '--permission-mode', 'manual', 'p']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  const args = records[1].args;
  assert.equal(args.filter((argument) => argument === '--permission-mode').length, 1);
  assert.deepEqual(args, ['--permission-mode', 'acceptEdits', `${SEED} ${handoffPath}`]);
  assert.equal(records[1].env.SKILLED_LOOP_PERMISSION_MODE, 'acceptEdits');
  assert.equal(records[0].env.SKILLED_LOOP_PERMISSION_MODE, 'manual');
});

test('a live permission mode the CLI would reject falls back to the launch mode', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_PERMISSION_MODE: 'bogusMode',
  });
  const result = runWrapper(sandbox, ['claude', '--permission-mode', 'manual', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stderr,
    /warning: ignoring the sender permission mode bogusMode, relaunching on the launch mode/,
  );
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--permission-mode', 'manual', `${SEED} ${handoffPath}`,
  ]);
});

test('a live default permission mode replaces the launch mode', (t) => {
  const sandbox = createSandbox(t);
  // The help lists no default choice, but the CLI accepts the spelling its Stop payload reports.
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_PERMISSION_MODE: 'default',
  });
  const result = runWrapper(sandbox, ['claude', '--permission-mode', 'acceptEdits', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /ignoring the sender permission mode/);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--permission-mode', 'default', `${SEED} ${handoffPath}`,
  ]);
});

test('a live plan mode keeps the launch mode', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_PERMISSION_MODE: 'plan',
  });
  const result = runWrapper(sandbox, ['claude', '--permission-mode', 'manual', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stderr,
    /note: the sender was in plan mode, the receiver starts in the launch mode/,
  );
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--permission-mode', 'manual', `${SEED} ${handoffPath}`,
  ]);
});

test('a live bypass mode with no unlocking launch flag keeps the launch mode', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORD_PERMISSION_MODE: 'bypassPermissions',
  });
  const result = runWrapper(sandbox, ['claude', '--permission-mode', 'manual', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stderr,
    /warning: ignoring the sender permission mode bypassPermissions, relaunching on the launch mode/,
  );
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--permission-mode', 'manual', `${SEED} ${handoffPath}`,
  ]);
});

test('a hop with no live permission mode replays the launch mode before the seed', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '--permission-mode', 'manual', 'p']);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readRecords(recordPath)[1].args, [
    '--permission-mode', 'manual', `${SEED} ${handoffPath}`,
  ]);
});

test('manual command carries the live permission mode', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
    RECORD_PERMISSION_MODE: 'acceptEdits',
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  });
  const result = runWrapper(sandbox, ['claude', '--permission-mode', 'manual', 'p']);

  assert.equal(result.status, 7, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  const template = `skilled-loop claude '--permission-mode' 'acceptEdits' ${MANUAL_SEED_TEMPLATE}`;
  const command = printedManualCommand(result);
  assert.equal(
    command,
    withManualTemplate(template, () => manualClaimCommand('claude', handoffPath)),
  );
  assert.equal(command.includes("'manual'"), false, command);
});

test('multi-hop relaunches carry each runtime model and provider on every invocation', (t) => {
  const cases = [
    {
      runtime: 'claude',
      arguments: ['--model', 'selected-model', 'initial prompt'],
      model: 'selected-model',
    },
    {
      runtime: 'pi',
      arguments: [
        '-ne', '-e', './ext.ts', '--provider', 'openai', '--model', 'gpt-6-luna',
      ],
      model: 'gpt-6-luna',
      provider: 'openai',
    },
    {
      runtime: 'codex',
      arguments: ['--model', 'codex-model', 'initial prompt'],
      model: 'codex-model',
    },
    {
      runtime: 'cursor',
      arguments: ['--model', 'cursor-model', 'initial prompt'],
      model: 'cursor-model',
    },
    {
      runtime: 'devin',
      arguments: ['--model', 'devin-model', '--', 'initial prompt'],
      model: 'devin-model',
    },
  ];

  for (const { runtime, arguments: runtimeArguments, model, provider } of cases) {
    const sandbox = createSandbox(t);
    const { recordPath } = installRuntimeStub(sandbox, {
      markers: '*',
      exitCodes: '0',
      SESSION_RELAUNCH_MAX_HOPS: '2',
    });
    const result = runWrapper(sandbox, [runtime, ...runtimeArguments]);
    assert.equal(result.status, 0, result.stderr);
    const records = readRecords(recordPath);
    assert.equal(records.length, 3);
    assert.deepEqual(records.map((record) => record.runtime), [runtime, runtime, runtime]);
    assert.deepEqual(records.map((record) => record.env.SKILLED_LOOP_HOPS), ['0', '1', '2']);
    assert.equal(new Set(records.map((record) => record.env.SKILLED_LOOP_ID)).size, 1);

    for (const [index, record] of records.entries()) {
      assert.ok(record.args.includes(model), `${runtime} hop ${index} model`);
      if (provider) {
        assert.ok(record.args.includes(provider), `${runtime} hop ${index} provider`);
      }
      if (runtime === 'pi' && index > 0) {
        const extensionIndex = record.args.indexOf('-e');
        assert.ok(record.args.includes('-ne'), `Pi hop ${index} no-extensions`);
        assert.equal(
          record.args[extensionIndex + 1],
          path.resolve(records[0].cwd, './ext.ts'),
          `Pi hop ${index} extension path`,
        );
      }
    }
  }
});
