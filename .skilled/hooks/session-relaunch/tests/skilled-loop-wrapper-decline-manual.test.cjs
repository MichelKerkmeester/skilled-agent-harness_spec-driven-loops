// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Tests: Declines And Manual Commands
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { manualClaimCommand } = require('../lib/relaunch-core.cjs');
const {
  SEED, SPEC_FOLDER, SPEC_FOLDER_SUFFIX, COMMAND_RUNTIME_SPEC_FOLDER, OPEN_NOTE,
  expectedClaudeManualCommand, RUNTIME_RELAUNCH_CASES, createSandbox, installRuntimeStub,
  writeSpecFolderNote, runWrapper, installSkilledLoopCommand, runManualCommand,
  withManualTemplate, installDeciderStub, installConsumeFailureStub,
  installMalformedDecisionStub, installTruncatedDecisionOutputStub, readRecords, readLog,
} = require('./skilled-loop-wrapper-harness.cjs');

test('wrapper returns the last runtime exit code and logs relaunch and decline events', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1', exitCodes: '4,9' });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 9, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.match(readLog(sandbox), /relaunch/);
  assert.match(readLog(sandbox), /decline/);
});

test('a relaunched runtime that exits before claiming prints the manual claim command', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  const warningLine = result.stderr.split('\n').find((line) => line.includes('was not claimed'));
  assert.ok(warningLine, result.stderr);
  assert.ok(warningLine.includes(handoffPath), warningLine);
  assert.equal(
    result.stdout.split('\n').find((line) => line.startsWith('skilled-loop ')),
    expectedClaudeManualCommand(handoffPath, SPEC_FOLDER),
  );
});

test('a relaunched runtime that claimed its note prints no claim command at exit', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    NOTE_DONE_ON_INVOCATION: '2',
  });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.match(fs.readFileSync(handoffPath, 'utf8'), /status: done/);
  assert.doesNotMatch(result.stderr, /was not claimed/);
  assert.equal(
    (result.stdout + result.stderr).split('\n').some((line) => line.startsWith('skilled-loop ')),
    false,
  );
});

test('wrapper prints the manual command after runtime exit 130', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '130,0',
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const recordPathOnDisk = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${readRecords(recordPath)[0].env.SKILLED_LOOP_ID}.json`,
  );
  assert.equal(result.status, 130, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.ok(result.stdout.includes(
    `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}"`,
  ));
  assert.equal(fs.existsSync(recordPathOnDisk), false);
});

// OpenCode 2 exits 130 on the killer's SIGTERM as well as on an interrupt, so a record the
// killer stamped before signalling is a hop, not the operator stopping the loop.
test('wrapper relaunches after runtime exit 130 when the killer signalled the record', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '130,0',
    SIGNALLED_ON_INVOCATION: '1',
  });
  const result = runWrapper(sandbox, ['opencode']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.ok(records[1].args.includes(`[session-relaunch] claim and continue handoff ${handoffPath}`));
});

test('wrapper names pi in the manual command after runtime exit 130', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '130',
  });
  const result = runWrapper(sandbox, ['pi', 'initial prompt']);
  const manualCommand = [
    'skilled-loop pi "[session-relaunch] claim and continue handoff ',
    `${handoffPath}"`,
  ].join('');

  assert.equal(result.status, 130, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.ok(result.stdout.includes(manualCommand), result.stderr);
});

for (const runtime of ['claude', 'pi', 'opencode', 'codex', 'cursor', 'devin']) {
  test(`declined relaunch prints the ${runtime} manual claim command`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = path.join(sandbox.root, 'handoff-!.md');
    fs.writeFileSync(handoffPath, OPEN_NOTE);
    const { recordPath } = installRuntimeStub(sandbox, {
      markers: '1',
      exitCodes: '130',
      HANDOFF_PATH: handoffPath,
    });
    const result = runWrapper(sandbox, [runtime, 'initial prompt']);
    const template = readRecords(recordPath)[0].env.SKILLED_LOOP_MANUAL_TEMPLATE;
    assert.equal(result.status, 130, result.stderr);
    assert.equal(
      result.stdout.split('\n').find((line) => line.startsWith('skilled-loop ')),
      withManualTemplate(template, () => manualClaimCommand(runtime, handoffPath)),
    );
  });
}

for (const marker of ['$&', "$'", '$$', '$' + String.fromCharCode(96), '$1']) {
  test(`wrapper and core fill a ${marker} handoff path identically`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = path.join(sandbox.root, `handoff-${marker}.md`);
    fs.writeFileSync(handoffPath, OPEN_NOTE);
    const { recordPath } = installRuntimeStub(sandbox, {
      markers: '1',
      PENDING_ON_INVOCATION: '1',
      STUB_EXIT_CODES: '7',
      HANDOFF_PATH: handoffPath,
    });

    const result = runWrapper(sandbox, ['claude', 'initial prompt']);
    const template = readRecords(recordPath)[0].env.SKILLED_LOOP_MANUAL_TEMPLATE;

    assert.equal(result.status, 7, result.stderr);
    assert.equal(
      result.stdout.split('\n').find((line) => line.startsWith('skilled-loop ')),
      withManualTemplate(template, () => manualClaimCommand('claude', handoffPath)),
    );
  });
}

test('wrapper printed argument preserves a bang path in interactive bash', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = path.join(sandbox.root, 'handoff-!.md');
  fs.writeFileSync(handoffPath, OPEN_NOTE);
  installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '130',
    HANDOFF_PATH: handoffPath,
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const manualCommand = result.stdout
    .split('\n')
    .find((line) => line.startsWith('skilled-loop '));
  const commandArgument = manualCommand.slice('skilled-loop claude '.length);
  const bashResult = spawnSync('/bin/bash', ['--norc', '--noprofile', '-i'], {
    input: `set -H\nprintf '[%s]\\n' ${commandArgument}\n`,
    encoding: 'utf8',
  });
  const output = bashResult.stdout + bashResult.stderr;
  const expectedSeed = `${SEED} ${handoffPath}`;

  assert.equal(result.status, 130, result.stderr);
  assert.equal(manualCommand, manualClaimCommand('claude', handoffPath));
  assert.equal(bashResult.status, 0, output);
  assert.doesNotMatch(output, /event not found/);
  assert.ok(output.includes(`[${expectedSeed}]`), output);
});

const FLAG_VALUE_CASES = [
  {
    name: 'short name before a flag',
    runtime: 'claude',
    arguments: ['-n', '--resume'],
  },
  {
    name: 'equals name before a flag',
    runtime: 'claude',
    arguments: ['--name=--resume'],
  },
  {
    name: 'long name before the end-of-options marker',
    runtime: 'claude',
    arguments: ['--name', '--', '--resume'],
  },
  {
    name: 'model before a resume flag',
    runtime: 'claude',
    arguments: ['--model', '--resume'],
  },
  {
    name: 'equals model before a flag',
    runtime: 'claude',
    arguments: ['--model=--resume'],
  },
  {
    name: 'model before the end-of-options marker',
    runtime: 'claude',
    arguments: ['--model', '--', '--resume'],
  },
  {
    name: 'short model before a denied flag',
    runtime: 'codex',
    arguments: ['-m', '--worktree'],
  },
  {
    name: 'short Pi extension before a resume flag',
    runtime: 'pi',
    arguments: ['-e', '--resume'],
  },
  {
    name: 'equals Pi extension before a resume flag',
    runtime: 'pi',
    arguments: ['--extension=--resume'],
  },
  {
    name: 'long Pi extension before the end-of-options marker',
    runtime: 'pi',
    arguments: ['--extension', '--', '--resume'],
  },
  {
    name: 'Pi space provider before a resume flag',
    runtime: 'pi',
    arguments: ['--provider', '--resume'],
  },
  {
    name: 'Pi space provider before the end-of-options marker',
    runtime: 'pi',
    arguments: ['--provider', '--', '--resume'],
  },
  {
    name: 'Pi equals provider before a resume flag',
    runtime: 'pi',
    arguments: ['--provider=--resume'],
  },
  {
    name: 'Pi equals provider before the end-of-options marker',
    runtime: 'pi',
    arguments: ['--provider=--'],
  },
];

for (const testCase of FLAG_VALUE_CASES) {
  test(`wrapper does not carry flag-like values for ${testCase.name}`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    const result = runWrapper(sandbox, [testCase.runtime, ...testCase.arguments]);
    const records = readRecords(recordPath);
    const expectedArguments = [];
    if (testCase.runtime === 'codex') expectedArguments.push('--no-daemon');
    expectedArguments.push(`${SEED} ${handoffPath}`);
    const expectedFirstArguments = testCase.runtime === 'codex'
      ? ['--no-daemon', ...testCase.arguments]
      : testCase.arguments;

    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(records[0].args, expectedFirstArguments);
    assert.deepEqual(records[1].args, expectedArguments);
    assert.equal(records[0].env.hasModel, Boolean(testCase.model));
    assert.equal(records[0].env.SKILLED_LOOP_MODEL, testCase.model || '');
    assert.equal(records[0].env.hasProvider, false);
    assert.equal(records[0].env.SKILLED_LOOP_PROVIDER, '');
  });
}

test('Pi resolves an extension path containing spaces on relaunch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const extensionDirectory = path.join(sandbox.repoRoot, 'extension folder');
  fs.mkdirSync(extensionDirectory, { recursive: true });
  const relativeExtensionPath = './extension folder/my extension.ts';
  const firstArguments = ['-e', relativeExtensionPath];

  const result = runWrapper(sandbox, ['pi', ...firstArguments]);
  const records = readRecords(recordPath);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(records[0].args, firstArguments);
  assert.deepEqual(records[1].args, [
    '-e', path.resolve(records[0].cwd, relativeExtensionPath), `${SEED} ${handoffPath}`,
  ]);
});

test('Pi keeps the missing-directory fallback path without a cd error', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  const relativeExtensionPath = './missing folder/extension.ts';
  const firstArguments = ['-e', relativeExtensionPath];

  const result = runWrapper(sandbox, ['pi', ...firstArguments]);
  const records = readRecords(recordPath);

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(records[0].args, firstArguments);
  assert.deepEqual(records[1].args, [
    '-e', `${records[0].cwd}/${relativeExtensionPath}`, `${SEED} ${handoffPath}`,
  ]);
  assert.doesNotMatch(result.stderr, /cd:|No such file or directory/);
});

test('wrapper escapes shell characters in the manual handoff path', (t) => {
  const sandbox = createSandbox(t);
  const specialCharacters = '\\' + '"' + '$' + String.fromCharCode(96);
  const handoffPath = path.join(sandbox.root, 'handoff-' + specialCharacters + '.md');
  const { recordPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '130',
    HANDOFF_PATH: handoffPath,
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const escapedHandoffPath = handoffPath
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\' + '"')
    .replace(/\$/g, '\\$')
    .replace(/\x60/g, '\\' + String.fromCharCode(96));
  const manualCommand = 'skilled-loop claude "[session-relaunch] claim and continue handoff '
    + escapedHandoffPath + '"';
  assert.equal(result.status, 130, result.stderr);
  assert.ok(result.stdout.includes(manualCommand));
  assert.equal(readRecords(recordPath).length, 1);
});

test('wrapper prints the manual command and declines a CR/LF handoff path', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = path.join(sandbox.root, 'handoff-\nline.md');
  const { recordPath } = installRuntimeStub(sandbox, {
    markers: '1',
    HANDOFF_PATH: handoffPath,
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const relaunchPath = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    'relaunch-' + loopId + '.json',
  );
  const expectedPrefix = 'skilled-loop claude "[session-relaunch] claim and continue handoff ';
  assert.equal(result.status, 1, result.stderr);
  assert.ok(result.stdout.startsWith(expectedPrefix + handoffPath + '"\n'));
  assert.equal(fs.existsSync(relaunchPath), false);
});

test('wrapper preserves exit 130 and prints the manual command when consume fails', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '130',
  });
  installConsumeFailureStub(sandbox);
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const relaunchPath = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    'relaunch-' + loopId + '.json',
  );
  const manualCommand = 'skilled-loop claude "[session-relaunch] claim and continue handoff '
    + handoffPath + '"';
  assert.equal(result.status, 130, result.stderr);
  assert.ok(result.stdout.split('\n').includes(manualCommand), result.stderr);
  assert.match(result.stderr, /warning: could not consume the relaunch record/);
  assert.equal(fs.existsSync(relaunchPath), true);
});

test('wrapper consumes an armed record and prints the manual command when cwd is missing', (t) => {
  const sandbox = createSandbox(t);
  const missingCwd = path.join(sandbox.root, 'missing-cwd');
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    RECORDED_CWD: missingCwd,
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const recordPathOnDisk = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  );
  assert.equal(result.status, 1);
  assert.equal(readRecords(recordPath).length, 1);
  assert.ok(result.stdout.includes(
    `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}"`,
  ));
  assert.equal(fs.existsSync(recordPathOnDisk), false);
});

test('wrapper warns and preserves the runtime exit code when the decider fails', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '7',
  });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  installDeciderStub(sandbox, 42);
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const relaunchPath = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  );
  assert.equal(result.status, 7);
  assert.equal(readRecords(recordPath).length, 1);
  assert.ok(
    result.stderr.indexOf('consume attempted')
      < result.stderr.indexOf('warning: should-relaunch failed'),
    result.stderr,
  );
  assert.match(result.stderr, /warning: should-relaunch failed/);
  assert.match(result.stderr, /42/);
  assert.equal(fs.existsSync(relaunchPath), false);
});

test('wrapper warns and consumes a relaunch record with invalid JSON', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  installMalformedDecisionStub(sandbox);
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const relaunchPath = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  );

  assert.equal(result.status, 1, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.equal(result.stderr.trim(), 'warning: could not read the relaunch record');
  assert.equal(fs.existsSync(relaunchPath), false);
});

test('wrapper warns and consumes a relaunch record with truncated parsed output', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  installTruncatedDecisionOutputStub(sandbox);
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const relaunchPath = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  );

  assert.equal(result.status, 1, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.equal(result.stderr.trim(), 'warning: could not read the relaunch record');
  assert.equal(fs.existsSync(relaunchPath), false);
});

test('wrapper declines a relaunch record with an empty handoff path without a warning', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, {
    markers: '1',
    HANDOFF_PATH: '',
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const relaunchPath = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  );

  // A record with no handoff is declined and the runtime's own exit code survives.
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr.trim(), '');
  assert.match(readLog(sandbox), /decline loopId=\d+ reason=incomplete-record/);
  assert.equal(fs.existsSync(relaunchPath), false);
});

test('wrapper warns without a stack when declined decision JSON is malformed', (t) => {
  const sandbox = createSandbox(t);
  installRuntimeStub(sandbox, { exitCodes: '7' });
  installMalformedDecisionStub(sandbox, 1);
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);

  assert.equal(result.status, 7, result.stderr);
  assert.equal(result.stderr.trim(), 'warning: could not read the relaunch record');
  assert.doesNotMatch(result.stderr, /SyntaxError|node:internal/);
});

for (const runtimeCase of RUNTIME_RELAUNCH_CASES) {
  test(runtimeCase.runtime + ' carries model and seed without resume options', (t) => {
    for (const modelArguments of runtimeCase.modelArgumentVariants) {
      for (const providerArguments of runtimeCase.providerArgumentVariants) {
        for (const specFolder of ['', COMMAND_RUNTIME_SPEC_FOLDER]) {
          const sandbox = createSandbox(t);
          const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
            markers: '1',
          });
          if (specFolder) {
            fs.writeFileSync(
              handoffPath,
              '---\nstatus: open\nspec_folder: ' + specFolder + '\n---\n',
            );
          }

          const firstArguments = [
            ...modelArguments,
            ...providerArguments,
            ...runtimeCase.passthroughArguments,
            '--',
            '--model',
            'late-model',
          ];
          const result = runWrapper(sandbox, [runtimeCase.runtime, ...firstArguments]);

          assert.equal(result.status, 0, result.stderr);
          const records = readRecords(recordPath);
          assert.equal(records.length, 2);
          assert.equal(records[0].runtime, runtimeCase.runtime);
          assert.equal(records[1].runtime, runtimeCase.runtime);
          const expectedFirstArguments = runtimeCase.runtime === 'codex'
            ? ['--no-daemon', ...firstArguments]
            : firstArguments;
          assert.deepEqual(records[0].args, expectedFirstArguments);
          assert.deepEqual(
            records.map((record) => record.env.SKILLED_LOOP_RUNTIME),
            [runtimeCase.runtime, runtimeCase.runtime],
          );
          assert.equal(records[0].cwd, fs.realpathSync(sandbox.repoRoot));
          assert.equal(records[1].cwd, fs.realpathSync(sandbox.recordedCwd));
          assert.notEqual(records[1].cwd, records[0].cwd);

          const specSuffix = specFolder
            ? ' | Spec folder: ' + specFolder + SPEC_FOLDER_SUFFIX
            : '';
          const seed = SEED + ' ' + handoffPath + specSuffix;
          assert.deepEqual(
            records[1].args,
            runtimeCase.buildRelaunchArguments(
              seed,
              runtimeCase.model,
              runtimeCase.provider,
            ),
          );
          assert.deepEqual(
            records.map((record) => record.env.SKILLED_LOOP_MODEL),
            [runtimeCase.model, runtimeCase.model],
          );
          assert.deepEqual(
            records.map((record) => record.env.SKILLED_LOOP_PROVIDER),
            [runtimeCase.provider, runtimeCase.provider],
          );
          assert.equal(records[1].args.some((arg) => (
            ['-n', '--name'].includes(arg)
          )), false);
          assert.equal(records[1].args.some((arg) => (
            runtimeCase.forbiddenArguments.includes(arg)
          )), false);
        }
      }
    }
  });
}

test('runtime first launch preserves argv except the Codex daemon default', (t) => {
  for (const runtimeCase of RUNTIME_RELAUNCH_CASES) {
    const sandbox = createSandbox(t);
    const { recordPath } = installRuntimeStub(sandbox);
    const firstArguments = [
      ...runtimeCase.modelArgumentVariants[0],
      ...runtimeCase.providerArgumentVariants[0],
      ...runtimeCase.passthroughArguments,
      '--',
      '--model',
      'late-model',
    ];

    const result = runWrapper(sandbox, [runtimeCase.runtime, ...firstArguments]);

    assert.equal(result.status, 0, result.stderr);
    const records = readRecords(recordPath);
    assert.equal(records.length, 1);
    assert.equal(records[0].runtime, runtimeCase.runtime);
    const expectedArguments = runtimeCase.runtime === 'codex'
      ? ['--no-daemon', ...firstArguments]
      : firstArguments;
    assert.deepEqual(records[0].args, expectedArguments, runtimeCase.runtime);
  }
});

test('manual commands preserve carried flags and match automatic relaunch argv', (t) => {
  const cases = [
    {
      runtime: 'claude',
      arguments: ['--model', 'claude-model', '--name', 'claude session', 'initial prompt'],
    },
    {
      runtime: 'pi',
      arguments: [
        '-ne', '-e', '/tmp/extension folder/extension.ts', '--provider', 'pi-provider',
        '--model', 'pi-model', '--name', 'pi session', 'initial prompt',
      ],
    },
    { runtime: 'opencode', arguments: ['--model', 'opencode-model', 'initial prompt'] },
    { runtime: 'codex', arguments: ['--model', 'codex-model', 'initial prompt'] },
    { runtime: 'cursor', arguments: ['--model', 'cursor-model', 'initial prompt'] },
    { runtime: 'devin', arguments: ['--model', 'devin-model', '--', 'initial prompt'] },
  ];

  for (const { runtime, arguments: runtimeArguments } of cases) {
    const automaticSandbox = createSandbox(t);
    const { recordPath: automaticRecordPath, handoffPath } = installRuntimeStub(
      automaticSandbox,
      { markers: '1' },
    );
    const automaticResult = runWrapper(automaticSandbox, [runtime, ...runtimeArguments]);
    const automaticRecords = readRecords(automaticRecordPath);
    assert.equal(automaticResult.status, 0, automaticResult.stderr);
    assert.equal(automaticRecords.length, 2, runtime);

    const manualSandbox = createSandbox(t);
    const { recordPath, markerPath } = installRuntimeStub(manualSandbox, {
      markers: '1',
      PENDING_ON_INVOCATION: '1',
      STUB_EXIT_CODES: '7',
      HANDOFF_PATH: handoffPath,
    });
    const pendingResult = runWrapper(manualSandbox, [runtime, ...runtimeArguments]);
    const manualCommand = pendingResult.stdout
      .split('\n')
      .find((line) => line.startsWith('skilled-loop '));
    assert.equal(pendingResult.status, 7, pendingResult.stderr);
    assert.ok(manualCommand, pendingResult.stderr);

    fs.writeFileSync(markerPath, '');
    manualSandbox.env.STUB_EXIT_CODES = '0';
    installSkilledLoopCommand(manualSandbox);
    const manualResult = runManualCommand(manualSandbox, manualCommand);
    const manualRecords = readRecords(recordPath);
    assert.equal(manualResult.status, 0, manualResult.stderr);
    assert.equal(manualRecords.length, 2, runtime);
    assert.deepEqual(manualRecords[1].args, automaticRecords[1].args, runtime);
  }
});
