// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { manualClaimCommand, validSpecFolder } = require('../lib/relaunch-core.cjs');

const WRAPPER_PATH = path.resolve(__dirname, '../../../bin/skilled-loop');
const SEED = '[session-relaunch] claim and continue handoff';
const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters';
const SPEC_FOLDER_SUFFIX = ' (carried from the handoff; Gate 3 answered in the sending session)';
const SKIP_SPEC_FOLDER_SUFFIX = ' (Gate 3 answered D, Skip, in the sending session)';
const COMMAND_RUNTIME_SPEC_FOLDER =
  'specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes';
const LOOP_ID_PATTERN = /^[0-9]+$/;
const OPEN_NOTE = '---\nstatus: open\n---\n';

function expectedClaudeManualCommand(handoffPath, specFolder) {
  let suffix = '';
  if (specFolder === 'none') {
    suffix = ` | Spec folder: none${SKIP_SPEC_FOLDER_SUFFIX}`;
  } else if (validSpecFolder(specFolder)) {
    suffix = ` | Spec folder: ${specFolder}${SPEC_FOLDER_SUFFIX}`;
  }
  return `skilled-loop claude "[session-relaunch] claim and continue handoff `
    + `${handoffPath}${suffix}"`;
}

const RUNTIME_RELAUNCH_CASES = [
  {
    runtime: 'codex',
    model: 'codex model',
    modelArgumentVariants: [
      ['-m', 'codex model'],
      ['--model', 'codex model'],
      ['--model=codex model'],
    ],
    provider: '',
    providerArgumentVariants: [[]],
    passthroughArguments: [
      '-c',
      'model="ignored"',
      'exec',
      'resume',
      'fork',
      'queue',
      '--name',
      'Codex session',
    ],
    forbiddenArguments: [
      '-c', '--resume', '-r', '--continue', '--session', '--name',
      'exec', 'resume', 'fork', 'queue',
    ],
    buildRelaunchArguments: (seed, model) => ['--no-daemon', '-m', model, seed],
  },
  {
    runtime: 'cursor',
    model: 'cursor model',
    modelArgumentVariants: [
      ['--model', 'cursor model'],
      ['--model=cursor model'],
    ],
    provider: '',
    providerArgumentVariants: [[]],
    passthroughArguments: [
      '--resume',
      'old-chat',
      '--continue',
      'resume',
      'ls',
      '--name',
      'Cursor session',
    ],
    forbiddenArguments: ['--resume', '--continue', '--name', '-n', 'resume', 'ls'],
    buildRelaunchArguments: (seed, model) => ['--model', model, seed],
  },
  {
    runtime: 'hermes',
    model: 'hermes model',
    modelArgumentVariants: [
      ['-m', 'hermes model'],
      ['--model', 'hermes model'],
      ['--model=hermes model'],
    ],
    provider: 'hermes-provider',
    providerArgumentVariants: [
      ['--provider', 'hermes-provider'],
      ['--provider=hermes-provider'],
    ],
    passthroughArguments: [
      '--resume',
      'old-session',
      '-r',
      'old-session',
      '--continue',
      'old-session',
      '-c',
      'old-session',
      '--create-if-missing',
      '--in',
      './old-session',
      '--no-restore-cwd',
      '--name',
      'Hermes session',
    ],
    forbiddenArguments: [
      '--resume', '-r', '--continue', '-c', '--create-if-missing',
      '--in', '--no-restore-cwd', '--name', '-n',
    ],
    buildRelaunchArguments: (seed, model, provider) => [
      'chat', '--provider', provider, '-m', model, '-q', seed,
    ],
  },
  {
    runtime: 'devin',
    model: 'devin model',
    modelArgumentVariants: [
      ['--model', 'devin model'],
      ['--model=devin model'],
    ],
    provider: '',
    providerArgumentVariants: [[]],
    passthroughArguments: [
      '-c', '--continue', '-r', '--resume', '--name', 'Devin session',
    ],
    forbiddenArguments: ['-c', '--continue', '-r', '--resume', '--name', '-n'],
    buildRelaunchArguments: (seed, model) => ['--model', model, '--', seed],
  },
];
const RUNTIME_SOURCE = `
const fs = require("node:fs");
const path = require("node:path");
const recordPath = process.env.RECORD_FILE;
const existing = fs.existsSync(recordPath)
  ? fs.readFileSync(recordPath, "utf8").trim().split("\\n").filter(Boolean)
  : [];
const invocation = existing.length + 1;
const record = {
  args: process.argv.slice(1),
  runtime: process.env.SESSION_RELAUNCH_TEST_RUNTIME || "claude",
  cwd: process.cwd(),
  env: {
    SKILLED_LOOP_ID: process.env.SKILLED_LOOP_ID || "",
    SKILLED_LOOP_HOPS: process.env.SKILLED_LOOP_HOPS || "",
    SKILLED_LOOP_RUNTIME: process.env.SKILLED_LOOP_RUNTIME || "",
    SKILLED_LOOP_NAME: process.env.SKILLED_LOOP_NAME || "",
    SKILLED_LOOP_MODEL: process.env.SKILLED_LOOP_MODEL || "",
    SKILLED_LOOP_PROVIDER: process.env.SKILLED_LOOP_PROVIDER || "",
    SKILLED_LOOP_MANUAL_TEMPLATE: process.env.SKILLED_LOOP_MANUAL_TEMPLATE || "",
    hasModel: Object.hasOwn(process.env, "SKILLED_LOOP_MODEL"),
    hasProvider: Object.hasOwn(process.env, "SKILLED_LOOP_PROVIDER")
  }
};
fs.appendFileSync(recordPath, JSON.stringify(record) + "\\n");
const markerPath = process.env.ARM_MARKER;
if (markerPath && fs.existsSync(markerPath)) {
  const markers = fs.readFileSync(markerPath, "utf8").trim();
  const shouldArm = markers === "*" || markers.split(",").includes(String(invocation));
  if (shouldArm) {
    const stateDir = path.join(process.env.XDG_RUNTIME_DIR, "skilled-relaunch");
    fs.mkdirSync(stateDir, { recursive: true });
    const loopId = process.env.SKILLED_LOOP_ID;
    const status = process.env.PENDING_ON_INVOCATION === String(invocation) ? "pending" : "armed";
    const armedAt = process.env.STALE_ON_INVOCATION === String(invocation)
      ? new Date(Date.now() - 11 * 60 * 1000).toISOString()
      : new Date().toISOString();
    const relaunch = {
      version: 1,
      status,
      loopId,
      handoff: process.env.HANDOFF_PATH,
      sessionId: "session-wrapper-0001",
      runtime: process.env.SESSION_RELAUNCH_TEST_RUNTIME || "claude",
      name: process.env.SKILLED_LOOP_NAME || null,
      cwd: process.env.RECORDED_CWD,
      hops: Number(process.env.SKILLED_LOOP_HOPS || 0),
      armedAt
    };
    fs.writeFileSync(path.join(stateDir, "relaunch-" + loopId + ".json"), JSON.stringify(relaunch));
  }
}
const exitCodes = (process.env.STUB_EXIT_CODES || "0").split(",").map(Number);
process.exitCode = exitCodes[Math.min(invocation - 1, exitCodes.length - 1)];
`;

function createSandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-wrapper-'));
  const repoRoot = path.join(root, 'repo');
  const xdgRuntimeDir = path.join(root, 'runtime');
  const home = path.join(root, 'home');
  const binDir = path.join(root, 'bin');
  const recordedCwd = path.join(root, 'recorded-cwd');
  fs.mkdirSync(repoRoot, { recursive: true });
  fs.mkdirSync(xdgRuntimeDir, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(binDir, { recursive: true });
  fs.mkdirSync(recordedCwd, { recursive: true });
  const env = { ...process.env, HOME: home, XDG_RUNTIME_DIR: xdgRuntimeDir, SESSION_RELAUNCH_REPO_ROOT: repoRoot };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_RUNTIME',
    'SKILLED_LOOP_NAME',
    'SKILLED_LOOP_MODEL',
    'SKILLED_LOOP_PROVIDER',
    'SESSION_RELAUNCH_MAX_HOPS',
    'SESSION_RELAUNCH_MAX_AGE_MIN',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, home, binDir, recordedCwd, env };
}

function installRuntimeStub(sandbox, { markers = '', exitCodes = '0', ...overrides } = {}) {
  const recordPath = path.join(sandbox.root, 'runtime-record.jsonl');
  const markerPath = path.join(sandbox.root, 'arm.marker');
  const handoffPath = path.join(sandbox.root, 'handoff.md');
  fs.writeFileSync(markerPath, markers);
  fs.writeFileSync(handoffPath, OPEN_NOTE);
  const shellProgram = `#!/usr/bin/env bash
set -euo pipefail
export SESSION_RELAUNCH_TEST_RUNTIME="$SKILLED_LOOP_RUNTIME"
node -e '${RUNTIME_SOURCE}' -- "$@"
`;
  for (const runtime of [
    'claude', 'pi', 'opencode', 'codex', 'cursor-agent', 'hermes', 'devin',
  ]) {
    fs.writeFileSync(path.join(sandbox.binDir, runtime), shellProgram, { mode: 0o755 });
  }
  Object.assign(sandbox.env, {
    PATH: `${sandbox.binDir}:${process.env.PATH}`,
    RECORD_FILE: recordPath,
    ARM_MARKER: markerPath,
    HANDOFF_PATH: handoffPath,
    RECORDED_CWD: sandbox.recordedCwd,
    STUB_EXIT_CODES: exitCodes,
    ...overrides,
  });
  return { recordPath, markerPath, handoffPath };
}

function writeSpecFolderNote(handoffPath, specFolder) {
  fs.writeFileSync(handoffPath, `---\nstatus: open\nspec_folder: ${specFolder}\n---\n`);
}

function runWrapper(sandbox, args) {
  return spawnSync('/bin/bash', [WRAPPER_PATH, ...args], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    encoding: 'utf8',
    timeout: 12000,
  });
}

function installSkilledLoopCommand(sandbox) {
  const commandPath = path.join(sandbox.binDir, 'skilled-loop');
  const source = `#!/usr/bin/env bash
set -euo pipefail
exec /bin/bash "${WRAPPER_PATH}" "$@"
`;
  fs.writeFileSync(commandPath, source, { mode: 0o755 });
}

function runManualCommand(sandbox, command) {
  return spawnSync('/bin/bash', ['--norc', '--noprofile', '-c', command], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    encoding: 'utf8',
    timeout: 12000,
  });
}

function withManualTemplate(template, callback) {
  const previousTemplate = process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
  process.env.SKILLED_LOOP_MANUAL_TEMPLATE = template;
  try {
    return callback();
  } finally {
    if (previousTemplate === undefined) {
      delete process.env.SKILLED_LOOP_MANUAL_TEMPLATE;
    } else {
      process.env.SKILLED_LOOP_MANUAL_TEMPLATE = previousTemplate;
    }
  }
}

function installDeciderStub(sandbox, exitStatus) {
  const nodePath = path.join(sandbox.binDir, 'node');
  const source = `#!/usr/bin/env bash
set -euo pipefail
if [[ "\${2:-}" == "should-relaunch" ]]; then
  exit "$DECIDER_EXIT_STATUS"
fi
if [[ "\${2:-}" == "consume" ]]; then
  printf '%s\\n' 'consume attempted' >&2
fi
exec "$REAL_NODE" "$@"
`;
  fs.writeFileSync(nodePath, source, { mode: 0o755 });
  Object.assign(sandbox.env, {
    REAL_NODE: process.execPath,
    DECIDER_EXIT_STATUS: String(exitStatus),
  });
}

function installConsumeFailureStub(sandbox) {
  const nodePath = path.join(sandbox.binDir, 'node');
  const source = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'if [[ "$2" == "should-relaunch" ]]; then',
    "  printf '{\"relaunch\":true,\"cwd\":\"%s\",\"handoff\":\"%s\"}\\n' \\",
    '    "$RECORDED_CWD" "$HANDOFF_PATH"',
    '  exit 0',
    'fi',
    'if [[ "$2" == "consume" ]]; then',
    '  exit 42',
    'fi',
    'exec "$REAL_NODE" "$@"',
    '',
  ].join('\n');
  fs.writeFileSync(nodePath, source, { mode: 0o755 });
  sandbox.env.REAL_NODE = process.execPath;
}

function installMalformedDecisionStub(sandbox, exitStatus = 0) {
  const nodePath = path.join(sandbox.binDir, 'node');
  const source = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'if [[ "${2:-}" == "should-relaunch" ]]; then',
    "  printf '%s\\n' 'not-json'",
    '  exit "$DECIDER_EXIT_STATUS"',
    'fi',
    'exec "$REAL_NODE" "$@"',
    '',
  ].join('\n');
  fs.writeFileSync(nodePath, source, { mode: 0o755 });
  Object.assign(sandbox.env, {
    REAL_NODE: process.execPath,
    DECIDER_EXIT_STATUS: String(exitStatus),
  });
}

function installTruncatedDecisionOutputStub(sandbox) {
  const nodePath = path.join(sandbox.binDir, 'node');
  const source = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'if [[ "${2:-}" == "should-relaunch" ]]; then',
    "  printf '{\"relaunch\":true,\"cwd\":\"%s\",\"handoff\":\"%s\"}\\n' \\",
    '    "$RECORDED_CWD" "$HANDOFF_PATH"',
    '  exit 0',
    'fi',
    'if [[ "${1:-}" == "-e" && "${2:-}" == *"fs.readFileSync(0"* ]]; then',
    "  printf '%s\\0' \"$RECORDED_CWD\"",
    '  exit 0',
    'fi',
    'exec "$REAL_NODE" "$@"',
    '',
  ].join('\n');
  fs.writeFileSync(nodePath, source, { mode: 0o755 });
  sandbox.env.REAL_NODE = process.execPath;
}

function installMalformedConsumeStub(sandbox) {
  const nodePath = path.join(sandbox.binDir, 'node');
  const source = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'if [[ "$2" == "consume" ]]; then',
    '  "$REAL_NODE" "$@" >/dev/null',
    "  printf 'not-json\\n'",
    '  exit 0',
    'fi',
    'exec "$REAL_NODE" "$@"',
    '',
  ].join('\n');
  fs.writeFileSync(nodePath, source, { mode: 0o755 });
  sandbox.env.REAL_NODE = process.execPath;
}

function readRecords(recordPath) {
  if (!fs.existsSync(recordPath)) return [];
  return fs.readFileSync(recordPath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readLog(sandbox) {
  const logPath = path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', 'relaunch.log');
  return fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';
}

test('second invocation uses only the seed and name, recorded cwd, and the same loop id', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1' });
  const result = runWrapper(sandbox, ['claude', '-n', 'X', 'initial prompt']);
  assert.equal(result.status, 0, result.stderr);
  const records = readRecords(recordPath);
  assert.equal(records.length, 2);
  assert.deepEqual(records[0].args, ['-n', 'X', 'initial prompt']);
  assert.equal(records[0].env.SKILLED_LOOP_NAME, 'X');
  assert.deepEqual(records[1].args, [
    SEED + ` ${path.join(sandbox.root, 'handoff.md')}`,
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
  assert.ok(result.stderr.includes(expectedClaudeManualCommand(handoffPath)), result.stderr);
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
  for (const runtime of ['claude', 'pi', 'opencode', 'codex', 'cursor', 'hermes']) {
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
    result.stderr.split('\n').find((line) => line.startsWith('skilled-loop ')),
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
      result.stderr.split('\n').find((line) => line.startsWith('skilled-loop ')),
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
    result.stderr.split('\n').find((line) => line.startsWith('skilled-loop ')),
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
    result.stderr.split('\n').some((line) => line.startsWith('skilled-loop ')),
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
      runtime: 'hermes',
      arguments: ['--provider', 'hermes-provider', '--model', 'hermes-model'],
      model: 'hermes-model',
      provider: 'hermes-provider',
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

test('wrapper returns the last runtime exit code and logs relaunch and decline events', (t) => {
  const sandbox = createSandbox(t);
  const { recordPath } = installRuntimeStub(sandbox, { markers: '1', exitCodes: '4,9' });
  const result = runWrapper(sandbox, ['claude', 'initial prompt']);
  assert.equal(result.status, 9, result.stderr);
  assert.equal(readRecords(recordPath).length, 2);
  assert.match(readLog(sandbox), /relaunch/);
  assert.match(readLog(sandbox), /decline/);
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
  assert.ok(result.stderr.includes(
    `skilled-loop claude "[session-relaunch] claim and continue handoff ${handoffPath}"`,
  ));
  assert.equal(fs.existsSync(recordPathOnDisk), false);
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
  assert.ok(result.stderr.includes(manualCommand), result.stderr);
});

for (const runtime of ['claude', 'pi', 'opencode', 'codex', 'cursor', 'hermes', 'devin']) {
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
      result.stderr.split('\n').find((line) => line.startsWith('skilled-loop ')),
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
      result.stderr.split('\n').find((line) => line.startsWith('skilled-loop ')),
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
  const manualCommand = result.stderr
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
    name: 'short model before a resume flag',
    runtime: 'codex',
    arguments: ['-m', '--resume'],
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
  {
    name: 'Hermes space provider before a model option',
    runtime: 'hermes',
    arguments: ['--provider', '-m', 'model'],
    model: 'model',
  },
  {
    name: 'Hermes space provider before the end-of-options marker',
    runtime: 'hermes',
    arguments: ['--provider', '--', '--resume'],
  },
  {
    name: 'Hermes equals provider before a resume flag',
    runtime: 'hermes',
    arguments: ['--provider=--resume'],
  },
  {
    name: 'Hermes equals provider before the end-of-options marker',
    runtime: 'hermes',
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
    if (testCase.runtime === 'hermes') {
      expectedArguments.push('chat');
      if (testCase.model) expectedArguments.push('-m', testCase.model);
      expectedArguments.push('-q');
    }
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
  assert.ok(result.stderr.includes(manualCommand));
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
  assert.ok(result.stderr.startsWith(expectedPrefix + handoffPath + '"\n'));
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
  assert.ok(result.stderr.split('\n').includes(manualCommand), result.stderr);
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
  assert.ok(result.stderr.includes(
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

test('wrapper warns and consumes a relaunch record with an empty handoff path', (t) => {
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
    {
      runtime: 'hermes',
      arguments: ['--provider', 'hermes-provider', '--model', 'hermes-model'],
    },
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
    const manualCommand = pendingResult.stderr
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
  const manualCommand = result.stderr
    .split('\n')
    .find((line) => line.startsWith('skilled-loop '));
  const template = readRecords(recordPath)[0].env.SKILLED_LOOP_MANUAL_TEMPLATE;

  assert.equal(result.status, 7, result.stderr);
  assert.equal(template.split('@@HANDOFF@@').length - 1, 1);
  withManualTemplate(template, () => {
    assert.equal(manualClaimCommand('claude', handoffPath), manualCommand);
  });
});

for (const [label, template] of [
  ['a missing token', 'skilled-loop claude without a handoff token'],
  [
    'two tokens',
    'skilled-loop claude @@HANDOFF@@ and @@HANDOFF@@ again',
  ],
]) {
  test(`print_manual_command falls back to the runtime form with ${label}`, (t) => {
    const sandbox = createSandbox(t);
    const handoffPath = path.join(sandbox.root, 'handoff-!.md');
    fs.writeFileSync(handoffPath, OPEN_NOTE);
    const source = fs.readFileSync(WRAPPER_PATH, 'utf8');
    const specFolderSuffix = source.match(/spec_folder_suffix\(\) \{[\s\S]*?\n\}/);
    const match = source.match(/print_manual_command\(\) \{[\s\S]*?\n\}/);
    assert.ok(specFolderSuffix, 'spec_folder_suffix not found in the wrapper');
    assert.ok(match, 'print_manual_command not found in the wrapper');
    const harnessPath = path.join(sandbox.binDir, 'print-manual-command');
    fs.writeFileSync(
      harnessPath,
      [
        '#!/usr/bin/env bash',
        'set -euo pipefail',
        'runtime="$TEST_RUNTIME"',
        'SKILLED_LOOP_MANUAL_TEMPLATE="$TEST_TEMPLATE"',
        specFolderSuffix[0],
        match[0],
        'print_manual_command "$TEST_HANDOFF_PATH"',
        '',
      ].join('\n'),
      { mode: 0o755 },
    );

    for (const runtime of ['claude', 'opencode', 'hermes', 'devin']) {
      const result = spawnSync('/bin/bash', [harnessPath], {
        env: {
          ...sandbox.env,
          TEST_RUNTIME: runtime,
          TEST_TEMPLATE: template,
          TEST_HANDOFF_PATH: handoffPath,
        },
        encoding: 'utf8',
        timeout: 5000,
      });
      const expected = withManualTemplate(
        template,
        () => manualClaimCommand(runtime, handoffPath),
      );
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stderr, `${expected}\n`, `${runtime} ${label}`);
    }
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
  assert.ok(result.stderr.includes(`skilled-loop claude "${SEED} ${handoffPath}"`));
  assert.equal(fs.existsSync(relaunchPath), false);
});

for (const [label, writeNote, state] of [
  ['missing', (handoffPath) => fs.rmSync(handoffPath), 'missing'],
  ['unparseable', (handoffPath) => fs.writeFileSync(handoffPath, 'status: open\n'), 'invalid'],
  ['already claimed', (handoffPath) => fs.writeFileSync(handoffPath, '---\nstatus: claimed\n---\n'), 'claimed'],
]) {
  test(`wrapper does not relaunch a claim for a ${label} note`, (t) => {
    const sandbox = createSandbox(t);
    const { recordPath, handoffPath } = installRuntimeStub(sandbox, { markers: '1' });
    writeNote(handoffPath);

    const result = runWrapper(sandbox, ['claude']);

    assert.equal(result.status, 1, result.stderr);
    assert.equal(readRecords(recordPath).length, 1);
    assert.match(result.stderr, new RegExp(`warning: the handoff note is ${state}; not relaunching`));
    assert.ok(result.stderr.includes(expectedClaudeManualCommand(handoffPath)), result.stderr);
  });
}

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
  assert.ok(result.stderr.includes(expectedClaudeManualCommand(handoffPath)), result.stderr);
  assert.match(readLog(sandbox), /reason=incomplete-record/);
});
