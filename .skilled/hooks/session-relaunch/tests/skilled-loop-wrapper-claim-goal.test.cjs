// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Tests: Claims And Goal Packets
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { manualClaimCommand } = require('../lib/relaunch-core.cjs');
const {
  CLI_PATH, SEED, SPEC_FOLDER, SPEC_FOLDER_SUFFIX, COMMAND_RUNTIME_SPEC_FOLDER, OPEN_NOTE,
  expectedClaudeManualCommand, createSandbox, handoffsDirectory, installRuntimeStub,
  writeSpecFolderNote, runWrapper, handOverLines, installSkilledLoopCommand, runManualCommand,
  withManualTemplate, installWithdrawBeforeConsumeStub, installFailingHandOverStub, readRecords,
  readLog, OPENCODE_2_HELP,
} = require('./skilled-loop-wrapper-harness.cjs');

test('wrapper template and core command escape a special handoff path identically', (t) => {
  const sandbox = createSandbox(t);
  const handoffPath = path.join(sandbox.root, 'handoff-! space $ "quoted".md');
  fs.writeFileSync(handoffPath, OPEN_NOTE);
  const { recordPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
    HANDOFF_PATH: handoffPath,
  });
  const result = runWrapper(sandbox, [
    'claude', '--model', 'claude-model', '--name', 'claude session', 'initial prompt',
  ]);
  const manualCommand = result.stdout
    .split('\n')
    .find((line) => line.startsWith('skilled-loop '));
  const template = readRecords(recordPath)[0].env.SKILLED_LOOP_MANUAL_TEMPLATE;

  assert.equal(result.status, 7, result.stderr);
  assert.equal(template.split('@@HANDOFF@@').length - 1, 1);
  withManualTemplate(template, () => {
    assert.equal(manualClaimCommand('claude', handoffPath), manualCommand);
  });
});

// The core fills a template only when it holds exactly one placeholder, so a carried
// value holding the token must surface as an error instead of a quietly plainer command.
for (const { label, runtime, runtimeArguments, value, exitCodes, status } of [
  {
    label: 'a Claude model',
    runtime: 'claude',
    runtimeArguments: ['--model', 'model-@@HANDOFF@@'],
    value: 'model-@@HANDOFF@@',
    exitCodes: '0',
    status: 1,
  },
  {
    label: 'a Claude name',
    runtime: 'claude',
    runtimeArguments: ['--name', 'name @@HANDOFF@@'],
    value: 'name @@HANDOFF@@',
    exitCodes: '7',
    status: 7,
  },
  {
    label: 'a Pi provider',
    runtime: 'pi',
    runtimeArguments: ['--provider', 'provider-@@HANDOFF@@'],
    value: 'provider-@@HANDOFF@@',
    exitCodes: '0',
    status: 1,
  },
]) {
  test(`wrapper reports an unusable manual template when ${label} holds the placeholder`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      PENDING_ON_INVOCATION: '1',
      STUB_EXIT_CODES: exitCodes,
    });

    const result = runWrapper(sandbox, [runtime, ...runtimeArguments]);
    const plainCommand = withManualTemplate('', () => manualClaimCommand(runtime, handoffPath));

    assert.equal(result.status, status, result.stderr);
    assert.equal(readRecords(recordPath).length, 1);
    assert.deepEqual(
      result.stdout.split('\n').filter((line) => line.startsWith('skilled-loop ')),
      [plainCommand],
    );
    const errorLine = result.stderr.split('\n').find((line) => line.startsWith('error: '));
    assert.ok(errorLine, result.stderr);
    assert.ok(errorLine.includes(value), errorLine);
  });
}

// The manual command is the result an operator copies, so the wrapper and the CLI print
// it on stdout and keep stderr for diagnostics.
test('wrapper and CLI both print the manual command on stdout', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
  });

  const result = runWrapper(sandbox, ['claude', '--model', 'claude-model', 'initial prompt']);
  const template = readRecords(recordPath)[0].env.SKILLED_LOOP_MANUAL_TEMPLATE;

  assert.equal(result.status, 7, result.stderr);
  assert.deepEqual(
    result.stdout.split('\n').filter((line) => line.startsWith('skilled-loop ')),
    [withManualTemplate(template, () => manualClaimCommand('claude', handoffPath))],
  );
  assert.equal(result.stderr.split('\n').some((line) => line.startsWith('skilled-loop ')), false);

  const handoffDirectory = path.join(
    sandbox.repoRoot, '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
  );
  fs.mkdirSync(handoffDirectory, { recursive: true });
  const notePath = path.join(handoffDirectory, 'stream-note.md');
  fs.writeFileSync(notePath, [
    '---',
    'status: open',
    'session_id: session-stream-0001',
    '---',
    '## Goal',
    'Keep the manual command on one stream.',
    '## Done',
    'The wrapper prints it.',
    '## Remaining work',
    'Nothing.',
    '## In-flight state',
    'No child process is running.',
    'Running workers: none',
    '',
  ].join('\n'));
  const cliResult = spawnSync(process.execPath, [
    CLI_PATH, 'prepare', '--handoff', notePath,
    '--session', 'session-stream-0001', '--runtime', 'claude',
  ], {
    cwd: sandbox.repoRoot,
    env: { ...sandbox.env, SYSTEM_SESSION_RELAUNCH_ENABLED: '1' },
    encoding: 'utf8',
    timeout: 12000,
  });

  assert.equal(cliResult.status, 3, cliResult.stderr);
  const cliLines = cliResult.stdout.split('\n').filter((line) => line.startsWith('skilled-loop '));
  assert.equal(cliLines.length, 1, cliResult.stdout);
  assert.ok(cliLines[0].startsWith(`skilled-loop claude "${SEED} `), cliLines[0]);
  assert.equal(
    cliResult.stderr.split('\n').some((line) => line.startsWith('skilled-loop ')),
    false,
  );
});

// Cursor and Devin are command-only runtimes: no hook arms them, so the wrapper's seed
// form is the only thing that brings the fresh session to the handoff.
const COMMAND_ONLY_RUNTIMES = [
  {
    runtime: 'cursor',
    command: 'cursor-agent',
    relaunchArguments: (seed) => [seed],
    manualCommand: (handoffPath) => `skilled-loop cursor "${SEED} ${handoffPath}"`,
    resumeArguments: ['--resume', '--continue', 'resume', 'ls', '--model', '-m'],
  },
  {
    runtime: 'devin',
    command: 'devin',
    relaunchArguments: (seed) => ['--', seed],
    manualCommand: (handoffPath) => `skilled-loop devin '--' "${SEED} ${handoffPath}"`,
    resumeArguments: ['-c', '--continue', '-r', '--resume', '--model'],
  },
];

for (const runtimeCase of COMMAND_ONLY_RUNTIMES) {
  const { runtime, command, relaunchArguments, manualCommand, resumeArguments } = runtimeCase;

  test(`${runtime} command-only launch relaunches the bare seed from the recorded cwd`, (t) => {
    for (const firstArguments of [[], ['initial prompt']]) {
      for (const specFolder of ['', COMMAND_RUNTIME_SPEC_FOLDER]) {
        const sandbox = createSandbox(t);
        const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
        if (specFolder) writeSpecFolderNote(handoffPath, specFolder);

        const result = runWrapper(sandbox, [runtime, ...firstArguments]);

        assert.equal(result.status, 0, result.stderr);
        const records = readRecords(recordPath);
        assert.equal(records.length, 2);
        assert.deepEqual(records.map((record) => record.command), [command, command]);
        assert.deepEqual(records[0].args, firstArguments);
        const specSuffix = specFolder ? ` | Spec folder: ${specFolder}${SPEC_FOLDER_SUFFIX}` : '';
        assert.deepEqual(
          records[1].args,
          relaunchArguments(`${SEED} ${handoffPath}${specSuffix}`),
        );
        assert.equal(records[0].cwd, fs.realpathSync(sandbox.repoRoot));
        assert.equal(records[1].cwd, fs.realpathSync(sandbox.recordedCwd));
        assert.deepEqual(
          records.map((record) => record.env.SKILLED_LOOP_RUNTIME),
          [runtime, runtime],
        );
        assert.deepEqual(records.map((record) => record.env.SKILLED_LOOP_HOPS), ['0', '1']);
        assert.equal(records[0].env.SKILLED_LOOP_ID, records[1].env.SKILLED_LOOP_ID);
        assert.equal(
          records[1].args.some((arg) => resumeArguments.includes(arg)),
          false,
          `${runtime} ${records[1].args.join(' ')}`,
        );
      }
    }
  });

  test(`${runtime} command-only declines print the manual command and never relaunch`, (t) => {
    for (const scenario of [
      {
        label: 'pending record',
        overrides: { PENDING_ON_INVOCATION: '1', STUB_EXIT_CODES: '7' },
        status: 7,
        log: /not-armed/,
      },
      {
        label: 'stale record',
        overrides: { STALE_ON_INVOCATION: '1', STUB_EXIT_CODES: '7' },
        status: 7,
        log: /stale/,
      },
      {
        label: 'hop cap',
        overrides: { SESSION_RELAUNCH_MAX_HOPS: '0', STUB_EXIT_CODES: '7' },
        status: 7,
        log: /hop-cap/,
      },
      { label: 'runtime exit 130', overrides: { STUB_EXIT_CODES: '130' }, status: 130 },
      {
        label: 'claimed note',
        overrides: {},
        note: '---\nstatus: claimed\n---\n',
        status: 1,
        warning: /warning: the handoff note is claimed; not relaunching/,
        // A claim on a claimed note throws, so a printed command could never work.
        commandPrinted: false,
      },
    ]) {
      const sandbox = createSandbox(t);
      const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
        markers: '1',
        ...scenario.overrides,
      });
      if (scenario.note) fs.writeFileSync(handoffPath, scenario.note);

      const result = runWrapper(sandbox, [runtime]);
      const records = readRecords(recordPath);
      const template = records[0].env.SKILLED_LOOP_MANUAL_TEMPLATE;
      const message = `${runtime} ${scenario.label}: ${result.stderr}`;

      assert.equal(result.status, scenario.status, message);
      assert.equal(records.length, 1, message);
      assert.deepEqual(
        result.stdout.split('\n').filter((line) => line.startsWith('skilled-loop ')),
        scenario.commandPrinted === false ? [] : [manualCommand(handoffPath)],
        message,
      );
      assert.equal(
        withManualTemplate(template, () => manualClaimCommand(runtime, handoffPath)),
        manualCommand(handoffPath),
      );
      assert.equal(fs.existsSync(path.join(
        sandbox.xdgRuntimeDir,
        'skilled-relaunch',
        `relaunch-${records[0].env.SKILLED_LOOP_ID}.json`,
      )), false, message);
      if (scenario.log) assert.match(readLog(sandbox), scenario.log, message);
      if (scenario.warning) assert.match(result.stderr, scenario.warning, message);
    }
  });

  test(`${runtime} manual command reruns the runtime with the relaunch seed form`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, markerPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      PENDING_ON_INVOCATION: '1',
      STUB_EXIT_CODES: '7',
    });
    const pendingResult = runWrapper(sandbox, [runtime]);
    assert.equal(pendingResult.status, 7, pendingResult.stderr);

    fs.writeFileSync(markerPath, '');
    sandbox.env.STUB_EXIT_CODES = '0';
    installSkilledLoopCommand(sandbox);
    const manualResult = runManualCommand(sandbox, manualCommand(handoffPath));
    const records = readRecords(recordPath);

    assert.equal(manualResult.status, 0, manualResult.stderr);
    assert.equal(records.length, 2);
    assert.equal(records[1].command, command);
    assert.deepEqual(records[1].args, relaunchArguments(`${SEED} ${handoffPath}`));
  });
}

test('wrapper consumes a pending decline record and preserves the runtime exit code', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    PENDING_ON_INVOCATION: '1',
    STUB_EXIT_CODES: '7',
  });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
  const relaunchPath = path.join(
    sandbox.xdgRuntimeDir,
    'skilled-relaunch',
    `relaunch-${loopId}.json`,
  );

  assert.equal(result.status, 7, result.stderr);
  assert.ok(result.stdout.includes(`skilled-loop claude "${SEED} ${handoffPath}"`));
  assert.equal(fs.existsSync(relaunchPath), false);
});

// A claim only succeeds on an open note, so a claimed, done or missing note gets the warning
// alone. An invalid note is one the operator can repair and then claim, so it keeps its command.
for (const [label, writeNote, state, claimable] of [
  ['missing', (handoffPath) => fs.rmSync(handoffPath), 'missing', false],
  ['unparseable', (handoffPath) => fs.writeFileSync(handoffPath, 'status: open\n'), 'invalid', true],
  ['already claimed', (handoffPath) => fs.writeFileSync(handoffPath, '---\nstatus: claimed\n---\n'), 'claimed', false],
  ['already done', (handoffPath) => fs.writeFileSync(handoffPath, '---\nstatus: done\n---\n'), 'done', false],
]) {
  test(`wrapper does not relaunch a claim for a ${label} note`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    writeNote(handoffPath);

    const result = runWrapper(sandbox, ['claude']);

    assert.equal(result.status, 1, result.stderr);
    assert.equal(readRecords(recordPath).length, 1);
    assert.match(result.stderr, new RegExp(`warning: the handoff note is ${state}; not relaunching`));
    assert.equal(
      result.stdout.includes(expectedClaudeManualCommand(handoffPath)),
      claimable,
      result.stdout + result.stderr,
    );
    // The decision approved this hop, but the wrapper declined it, so no hand-over happened.
    assert.deepEqual(handOverLines(sandbox), []);
  });
}

for (const reason of ['cancelled', 'user-message']) {
  test(`wrapper reports a ${reason} hand-over as withdrawn and prints no claim command`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
      markers: '1',
      exitCodes: '7',
      DISARMED_ON_INVOCATION: '1',
      DISARM_REASON: reason,
    });
    writeSpecFolderNote(handoffPath, SPEC_FOLDER);

    const result = runWrapper(sandbox, ['claude', 'initial prompt']);

    assert.equal(result.status, 7, result.stderr);
    assert.equal(readRecords(recordPath).length, 1);
    const lines = result.stderr.split('\n').filter((line) => line.includes('withdrawn'));
    assert.deepEqual(lines, [
      'warning: the prepared hand-over was withdrawn in the session; '
        + `${handoffPath} stays open and out of date`,
    ]);
    assert.equal(
      (result.stdout + result.stderr).split('\n').some((line) => line.startsWith('skilled-loop ')),
      false,
    );
    assert.doesNotMatch(result.stderr, /not claimed/);
    assert.deepEqual(handOverLines(sandbox), []);
    const loopId = readRecords(recordPath)[0].env.SKILLED_LOOP_ID;
    assert.equal(fs.existsSync(path.join(
      sandbox.xdgRuntimeDir, 'skilled-relaunch', `relaunch-${loopId}.json`,
    )), false);
    assert.match(readLog(sandbox), /decline loopId=\d+ reason=withdrawn/);
  });
}

// A relaunched session that cancels its own follow-up hand-over leaves the note it was
// started from open, but the withdrawal already says what happened, so the unclaimed-note
// warning and its claim command would contradict it.
test('wrapper prints only the withdrawn line when a relaunched session calls off its next hand-over', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1,2',
    DISARMED_ON_INVOCATION: '2',
    DISARM_REASON: 'cancelled',
  });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.match(result.stderr, /the prepared hand-over was withdrawn in the session/);
  assert.doesNotMatch(result.stderr, /not claimed/);
  assert.equal(
    (result.stdout + result.stderr).split('\n').some((line) => line.startsWith('skilled-loop ')),
    false,
  );
});

// The withdrawal speaks only for the note it names. A note the relaunched session was
// seeded with and never claimed is a different note, still open, and still owed its warning.
test('wrapper still warns about an unclaimed seed note when a different next hand-over is withdrawn', (t) => {
  const sandbox = createSandbox(t);
  const otherNote = path.join(handoffsDirectory(sandbox), 'other.md');
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1,2',
    DISARMED_ON_INVOCATION: '2',
    DISARM_REASON: 'cancelled',
    DISARMED_HANDOFF_PATH: otherNote,
  });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  fs.writeFileSync(otherNote, OPEN_NOTE);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.match(
    result.stderr,
    new RegExp(`the prepared hand-over was withdrawn in the session; ${otherNote} stays open`),
  );
  assert.ok(
    result.stderr.includes(`the relaunched session ended before claiming ${handoffPath}`),
    result.stderr,
  );
  assert.equal(
    result.stdout.split('\n').find((line) => line.startsWith('skilled-loop ')),
    expectedClaudeManualCommand(handoffPath, SPEC_FOLDER),
  );
});

test('a withdraw between approval and consume declines with the runtime exit code', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1', exitCodes: '7' });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  installWithdrawBeforeConsumeStub(sandbox);

  const result = runWrapper(sandbox, ['claude', 'initial prompt']);

  assert.equal(result.status, 7, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.ok(
    result.stderr.includes(
      `warning: the prepared hand-over was withdrawn in the session; ${handoffPath} stays open`,
    ),
    result.stderr,
  );
  assert.equal(
    (result.stdout + result.stderr).split('\n').some((line) => line.startsWith('skilled-loop ')),
    false,
  );
  assert.deepEqual(handOverLines(sandbox), []);
});

test('a withdrawn record on the Ctrl-C path prints no claim command', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '130',
  });
  writeSpecFolderNote(handoffPath, SPEC_FOLDER);
  installWithdrawBeforeConsumeStub(sandbox);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 130, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.match(result.stderr, /the prepared hand-over was withdrawn in the session/);
  assert.equal(
    (result.stdout + result.stderr).split('\n').some((line) => line.startsWith('skilled-loop ')),
    false,
    result.stdout,
  );
  assert.deepEqual(handOverLines(sandbox), []);
});

test('wrapper keeps a clean runtime exit when the hand-over call itself fails', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  installFailingHandOverStub(sandbox);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.deepEqual(handOverLines(sandbox), []);
});

test('wrapper declines a record without a cwd and keeps the runtime exit code', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1',
    exitCodes: '5',
    RECORDED_CWD: '',
  });

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 5, result.stderr);
  assert.equal(readRecords(recordPath).length, 1);
  assert.ok(result.stdout.includes(expectedClaudeManualCommand(handoffPath)), result.stderr);
  assert.match(readLog(sandbox), /reason=incomplete-record/);
});

// ─────────────────────────────────────────────────────────────────────────────
// GOAL PACKET
// ─────────────────────────────────────────────────────────────────────────────

const GOAL_PACKET = 'specs/hooks/023-session-relaunch-loop';

const BUDGET_MANIFEST = path.join(
  '.skilled', 'skills', 'system-spec-kit', 'templates', 'spec-kit-docs.json',
);
const GOAL_TEXT = '---\ntitle: "Goal: Example"\n---\n# Goal: Example\n\nShip the example.\n';
const GOAL_SLICE = '# Goal: Example\n\nShip the example.';

function writeGoalNote(sandbox, handoffPath, {
  packetHoldsGoal = true, goalText = GOAL_TEXT, budget = true,
} = {}) {
  const packetPath = path.join(sandbox.repoRoot, GOAL_PACKET);
  fs.mkdirSync(packetPath, { recursive: true });
  if (packetHoldsGoal) fs.writeFileSync(path.join(packetPath, 'goal.md'), goalText);
  // The budget check reads the spec kit's manifest from the checkout, so a sandbox without it
  // cannot call any slice ok.
  const manifestPath = path.join(sandbox.repoRoot, BUDGET_MANIFEST);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  if (budget) {
    fs.writeFileSync(manifestPath, JSON.stringify({ goalDurableBudget: { errorChars: 4000 } }));
  }
  fs.writeFileSync(
    handoffPath,
    `---\nstatus: open\nspec_folder: ${GOAL_PACKET}\ngoal_packet: ${GOAL_PACKET}\n---\n`,
  );
}

test('wrapper exports the goal packet to the relaunched session only', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  writeGoalNote(sandbox, handoffPath);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.equal(records[0].env.hasGoalPacket, false);
  assert.equal(records[1].env.SESSION_RELAUNCH_GOAL_PACKET, GOAL_PACKET);
});

test('wrapper exports no goal packet when SESSION_RELAUNCH_GOAL is 0', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1', SESSION_RELAUNCH_GOAL: '0',
  });
  writeGoalNote(sandbox, handoffPath);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.equal(records[1].env.hasGoalPacket, false);
  assert.deepEqual(records[1].args, [
    `${SEED} ${handoffPath} | Spec folder: ${GOAL_PACKET}${SPEC_FOLDER_SUFFIX}`,
  ]);
});

test('wrapper exports no goal packet for a note without one or a packet that lost goal.md', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  writeSpecFolderNote(handoffPath, GOAL_PACKET);

  assert.equal(runWrapper(sandbox, ['claude']).status, 0);
  let records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.equal(records[1].env.hasGoalPacket, false);

  fs.rmSync(recordPath);
  writeGoalNote(sandbox, handoffPath, { packetHoldsGoal: false });
  assert.equal(runWrapper(sandbox, ['claude']).status, 0);
  records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.equal(records[1].env.hasGoalPacket, false);
});

test('wrapper drops a goal packet inherited from an outer session on every launch', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '1', SESSION_RELAUNCH_GOAL_PACKET: 'specs/hooks/999-outer-session',
  });
  writeSpecFolderNote(handoffPath, GOAL_PACKET);

  assert.equal(runWrapper(sandbox, ['claude']).status, 0);

  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.equal(records[0].env.hasGoalPacket, false);
  assert.equal(records[1].env.hasGoalPacket, false);
});

test('wrapper drops the previous hop goal packet when the next note carries none', (t) => {
  const sandbox = createSandbox(t);
  const nextNote = path.join(sandbox.root, 'next-note.md');
  writeSpecFolderNote(nextNote, GOAL_PACKET);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '*',
    SESSION_RELAUNCH_MAX_HOPS: '2',
    // The second launch writes a fresh note without a packet, as a sender whose goal ended does.
    NOTE_REWRITE_ON_INVOCATION: '2',
    NOTE_REWRITE_SOURCE: nextNote,
  });
  writeGoalNote(sandbox, handoffPath);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 3);
  assert.equal(records[0].env.hasGoalPacket, false);
  assert.equal(records[1].env.SESSION_RELAUNCH_GOAL_PACKET, GOAL_PACKET);
  assert.equal(records[2].env.hasGoalPacket, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// GOAL START PROMPT
// ─────────────────────────────────────────────────────────────────────────────

function claimSeedFor(handoffPath) {
  return `${SEED} ${handoffPath} | Spec folder: ${GOAL_PACKET}${SPEC_FOLDER_SUFFIX}`;
}

function warningLines(result) {
  return result.stderr.split('\n').filter((line) => /goal/i.test(line));
}

test('a Claude hop with a goal starts on the goal command and carries the claim in the environment', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
  writeGoalNote(sandbox, handoffPath);

  const result = runWrapper(sandbox, ['claude', '--model', 'opus', '--name', 'Work']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.equal(records[0].env.hasClaimSeed, false);
  assert.deepEqual(records[1].args, ['--model', 'opus', `/goal ${GOAL_SLICE}`, '--name', 'Work']);
  assert.equal(records[1].env.SKILLED_LOOP_CLAIM_SEED, claimSeedFor(handoffPath));
  assert.equal(records[1].env.SESSION_RELAUNCH_GOAL_PACKET, GOAL_PACKET);
  assert.deepEqual(warningLines(result), []);
});

test('a Claude hop keeps the claim seed as its start prompt when no goal can be sent', (t) => {
  const cases = [
    ['switch off', { env: { SESSION_RELAUNCH_GOAL: '0' }, note: {}, warns: false }],
    ['no packet in the note', { env: {}, note: 'none', warns: false }],
    ['packet lost its goal.md', { env: {}, note: { packetHoldsGoal: false }, warns: false }],
    ['slice over budget', {
      env: {},
      note: { goalText: `---\ntitle: x\n---\n# Goal\n\n${'x'.repeat(4001)}` },
      warns: /over the 4000-character limit/,
    }],
    ['no budget to check against', { env: {}, note: { budget: false }, warns: /no budget/ }],
    ['empty durable slice', {
      env: {}, note: { goalText: '---\ntitle: x\n---\n<!-- ANCHOR:log -->\n' }, warns: /no durable slice/,
    }],
  ];

  for (const [label, { env, note, warns }] of cases) {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1', ...env });
    if (note === 'none') writeSpecFolderNote(handoffPath, GOAL_PACKET);
    else writeGoalNote(sandbox, handoffPath, note);

    const result = runWrapper(sandbox, ['claude']);

    assert.equal(result.status, 0, `${label}: ${result.stderr}`);
    const records = readRecords(recordPath);
    assert.equal(records.length, 2, label);
    assert.deepEqual(records[1].args, [claimSeedFor(handoffPath)], label);
    assert.equal(records[1].env.hasClaimSeed, false, label);
    const lines = warningLines(result);
    if (warns === false) {
      assert.deepEqual(lines, [], label);
    } else {
      assert.equal(lines.length, 1, `${label}: one line, got ${JSON.stringify(lines)}`);
      assert.match(lines[0], warns, label);
    }
  }
});

test('a hop on another runtime keeps its claim seed and gets no claim variable', (t) => {
  for (const runtime of ['pi', 'opencode', 'codex', 'cursor', 'devin']) {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    writeGoalNote(sandbox, handoffPath);

    const result = runWrapper(sandbox, [runtime]);

    assert.equal(result.status, 0, `${runtime}: ${result.stderr}`);
    const records = readRecords(recordPath);
    assert.equal(records.length, 2, runtime);
    assert.ok(records[1].args.includes(claimSeedFor(handoffPath)), runtime);
    assert.ok(!records[1].args.some((argument) => argument.startsWith('/goal')), runtime);
    assert.equal(records[1].env.hasClaimSeed, false, runtime);
    assert.deepEqual(warningLines(result), [], runtime);
  }
});

test('the claim variable never leaks from an outer session or into the next hop', (t) => {
  const sandbox = createSandbox(t);
  const nextNote = path.join(sandbox.root, 'next-note.md');
  writeSpecFolderNote(nextNote, GOAL_PACKET);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    markers: '*',
    SESSION_RELAUNCH_MAX_HOPS: '2',
    SKILLED_LOOP_CLAIM_SEED: `${SEED} /outer/note.md`,
    NOTE_REWRITE_ON_INVOCATION: '2',
    NOTE_REWRITE_SOURCE: nextNote,
  });
  writeGoalNote(sandbox, handoffPath);

  const result = runWrapper(sandbox, ['claude']);

  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 3);
  assert.equal(records[0].env.hasClaimSeed, false);
  assert.equal(records[1].env.SKILLED_LOOP_CLAIM_SEED, claimSeedFor(handoffPath));
  assert.equal(records[2].env.hasClaimSeed, false);
  assert.ok(records[2].args[0].startsWith(SEED));
});

// ─────────────────────────────────────────────────────────────────────────────
// MANUAL FIRST LAUNCH GOAL BINDING
// ─────────────────────────────────────────────────────────────────────────────

// A manual claim is a first launch with no armed record, so each case records one session.
function runSeededFirstLaunch(t, args, { env = {}, note } = {}) {
  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
    ...env,
  });
  writeGoalNote(sandbox, handoffPath);
  if (note) note(sandbox, handoffPath);
  const seed = claimSeedFor(handoffPath);
  const result = runWrapper(sandbox, args(seed));
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 1);
  return { record: records[0], seed, result };
}

test('manual first launch with a claim seed exports the note goal packet', (t) => {
  const cases = [
    ['pi', (seed) => ['pi', '--model', 'm1', seed], (seed) => ['--model', 'm1', seed]],
    ['opencode', (seed) => ['opencode', '-m', 'm1', '--prompt', seed],
      (seed) => ['-m', 'm1', '--prompt', seed]],
    ['codex', (seed) => ['codex', '-m', 'm1', seed], (seed) => ['--no-daemon', '-m', 'm1', seed]],
    ['devin', (seed) => ['devin', '--model', 'm1', '--', seed],
      (seed) => ['--model', 'm1', '--', seed]],
    ['cursor', (seed) => ['cursor', seed, '--model', 'm1'], (seed) => [seed, '--model', 'm1']],
  ];
  for (const [runtime, args, expected] of cases) {
    const { record, seed } = runSeededFirstLaunch(t, args);
    assert.deepEqual(record.args, expected(seed), runtime);
    assert.equal(record.env.SESSION_RELAUNCH_GOAL_PACKET, GOAL_PACKET, runtime);
    assert.equal(record.env.hasClaimSeed, false, runtime);
  }
});

test('a seeded Claude first launch starts on the goal command with the seed in place', (t) => {
  const { record, seed, result } = runSeededFirstLaunch(
    t, (claimSeed) => ['claude', '--model', 'opus', claimSeed, '--name', 'Work'],
  );

  assert.deepEqual(record.args, ['--model', 'opus', `/goal ${GOAL_SLICE}`, '--name', 'Work']);
  assert.equal(record.env.SKILLED_LOOP_CLAIM_SEED, seed);
  assert.equal(record.env.SESSION_RELAUNCH_GOAL_PACKET, GOAL_PACKET);
  assert.deepEqual(warningLines(result), []);
});

test('a seeded OpenCode 2 first launch finds the seed after the prepended --standalone', (t) => {
  const { record, seed } = runSeededFirstLaunch(
    t, (claimSeed) => ['opencode', '--agent', 'build', '--prompt', claimSeed],
    { env: { STUB_HELP: OPENCODE_2_HELP } },
  );

  assert.deepEqual(record.args, ['--standalone', '--agent', 'build', '--prompt', seed]);
  assert.equal(record.env.SESSION_RELAUNCH_GOAL_PACKET, GOAL_PACKET);
});

test('a seeded Claude first launch with no slice to send keeps its seed as the prompt', (t) => {
  const { record, seed, result } = runSeededFirstLaunch(
    t, (claimSeed) => ['claude', claimSeed],
    { note: (sandbox) => fs.rmSync(path.join(sandbox.repoRoot, BUDGET_MANIFEST)) },
  );

  assert.deepEqual(record.args, [seed]);
  assert.equal(record.env.SESSION_RELAUNCH_GOAL_PACKET, GOAL_PACKET);
  assert.equal(record.env.hasClaimSeed, false);
  assert.equal(warningLines(result).length, 1);
});

test('manual first launch ignores a seed for a claimed or outside note', (t) => {
  const cases = [
    ['claimed note', (sandbox, handoffPath) => fs.writeFileSync(
      handoffPath,
      fs.readFileSync(handoffPath, 'utf8').replace('status: open', 'status: claimed'),
    )],
    ['note outside the repository', (sandbox, handoffPath) => {
      const outside = path.join(sandbox.root, 'outside');
      fs.mkdirSync(outside);
      fs.renameSync(handoffPath, path.join(outside, 'handoff.md'));
      fs.symlinkSync(path.join(outside, 'handoff.md'), handoffPath);
    }],
    ['packet that lost its goal.md', (sandbox) => fs.rmSync(
      path.join(sandbox.repoRoot, GOAL_PACKET, 'goal.md'),
    )],
    ['missing note', (sandbox, handoffPath) => fs.rmSync(handoffPath)],
  ];
  for (const runtime of ['claude']) {
    for (const [label, note] of cases) {
      const { record, seed } = runSeededFirstLaunch(t, (claimSeed) => [runtime, claimSeed], {
        note,
      });
      assert.deepEqual(record.args, [seed], `${runtime}: ${label}`);
      assert.equal(record.env.hasGoalPacket, false, `${runtime}: ${label}`);
      assert.equal(record.env.hasClaimSeed, false, `${runtime}: ${label}`);
    }
  }

  const sandbox = createSandbox(t);
  const { recordPath, handoffPath } = installRuntimeStub(sandbox, {
    SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
    SESSION_RELAUNCH_GOAL: '0',
  });
  writeGoalNote(sandbox, handoffPath);
  assert.equal(runWrapper(sandbox, ['claude', claimSeedFor(handoffPath)]).status, 0);
  assert.equal(readRecords(recordPath)[0].env.hasGoalPacket, false, 'switch off');

  const outsideNote = path.join(sandbox.root, 'outside-note.md');
  fs.copyFileSync(handoffPath, outsideNote);
  fs.rmSync(recordPath);
  sandbox.env.SESSION_RELAUNCH_GOAL = '1';
  assert.equal(runWrapper(sandbox, ['claude', claimSeedFor(outsideNote)]).status, 0);
  const [outsideRecord] = readRecords(recordPath);
  assert.equal(outsideRecord.env.hasGoalPacket, false, 'a path outside the handoffs directory');
  assert.deepEqual(outsideRecord.args, [claimSeedFor(outsideNote)]);
});
