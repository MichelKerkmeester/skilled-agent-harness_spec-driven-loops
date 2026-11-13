// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Wrapper Test Harness
// ───────────────────────────────────────────────────────────────────
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validSpecFolder } = require('../lib/relaunch-core.cjs');
const { withoutRelaunchSwitches } = require('./fixtures/relaunch-env.cjs');

// The suite also runs from inside a looped session, whose wrapper exports these variables,
// and a manual template that carries options would change every printed claim command.
for (const key of Object.keys(process.env)) {
  if (key.startsWith('SKILLED_LOOP_')) delete process.env[key];
}

const WRAPPER_PATH = path.resolve(__dirname, '../../../bin/skilled-loop');
const CLI_PATH = path.resolve(__dirname, '../bin/session-relaunch.cjs');
const SEED = '[session-relaunch] claim and continue handoff';
const SPEC_FOLDER = 'specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters';
const SPEC_FOLDER_SUFFIX = ' (carried from the handoff; Gate 3 answered in the sending session)';
const SKIP_SPEC_FOLDER_SUFFIX = ' (Gate 3 answered D, Skip, in the sending session)';
const COMMAND_RUNTIME_SPEC_FOLDER =
  'specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes';
const LOOP_ID_PATTERN = /^[0-9]+$/;
const OPEN_NOTE = '---\nstatus: open\n---\n';
// A record an earlier wrapper left behind: withdrawn and without a note, so a surviving one
// makes the wrapper decline silently instead of relaunching into a note this suite never wrote.
const LEFTOVER_RECORD = {
  version: 1,
  status: 'disarmed',
  disarmReason: 'cancelled',
  handoff: '',
  sessionId: 'session-leftover-0001',
  runtime: 'claude',
  hops: 0,
  armedAt: '2026-01-01T00:00:00.000Z',
};

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
// A case that plants a record before the wrapper starts reads this probe to prove the
// wrapper cleaned up before the runtime ran, not after the runtime exited.
const stateProbePath = process.env.STATE_PROBE_FILE;
if (stateProbePath && invocation === 1) {
  const stateDirectory = path.join(process.env.XDG_RUNTIME_DIR, "skilled-relaunch");
  const ownRecordPath = path.join(
    stateDirectory,
    "relaunch-" + (process.env.SKILLED_LOOP_ID || "") + ".json",
  );
  fs.writeFileSync(stateProbePath, fs.existsSync(ownRecordPath) ? "present" : "absent");
}
const record = {
  args: process.argv.slice(1),
  runtime: process.env.SESSION_RELAUNCH_TEST_RUNTIME || "claude",
  command: process.env.SESSION_RELAUNCH_TEST_COMMAND || "",
  cwd: process.cwd(),
  env: {
    SKILLED_LOOP_ID: process.env.SKILLED_LOOP_ID || "",
    SKILLED_LOOP_HOPS: process.env.SKILLED_LOOP_HOPS || "",
    SKILLED_LOOP_RUNTIME: process.env.SKILLED_LOOP_RUNTIME || "",
    SKILLED_LOOP_NAME: process.env.SKILLED_LOOP_NAME || "",
    SKILLED_LOOP_MODEL: process.env.SKILLED_LOOP_MODEL || "",
    SKILLED_LOOP_PROVIDER: process.env.SKILLED_LOOP_PROVIDER || "",
    SKILLED_LOOP_EFFORT: process.env.SKILLED_LOOP_EFFORT || "",
    SKILLED_LOOP_PERMISSION_MODE: process.env.SKILLED_LOOP_PERMISSION_MODE || "",
    SKILLED_LOOP_LAUNCHED_AT: process.env.SKILLED_LOOP_LAUNCHED_AT || "",
    SKILLED_LOOP_MANUAL_TEMPLATE: process.env.SKILLED_LOOP_MANUAL_TEMPLATE || "",
    hasModel: Object.hasOwn(process.env, "SKILLED_LOOP_MODEL"),
    hasProvider: Object.hasOwn(process.env, "SKILLED_LOOP_PROVIDER"),
    SESSION_RELAUNCH_GOAL_PACKET: process.env.SESSION_RELAUNCH_GOAL_PACKET || "",
    hasGoalPacket: Object.hasOwn(process.env, "SESSION_RELAUNCH_GOAL_PACKET"),
    SKILLED_LOOP_CLAIM_SEED: process.env.SKILLED_LOOP_CLAIM_SEED || "",
    hasClaimSeed: Object.hasOwn(process.env, "SKILLED_LOOP_CLAIM_SEED")
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
    const disarmed = process.env.DISARMED_ON_INVOCATION === String(invocation);
    const armedAt = process.env.STALE_ON_INVOCATION === String(invocation)
      ? new Date(Date.now() - 11 * 60 * 1000).toISOString()
      : new Date().toISOString();
    const relaunch = {
      version: 1,
      status: disarmed ? "disarmed" : status,
      ...(disarmed ? { disarmReason: process.env.DISARM_REASON || "cancelled" } : {}),
      loopId,
      handoff: disarmed && process.env.DISARMED_HANDOFF_PATH
        ? process.env.DISARMED_HANDOFF_PATH
        : process.env.HANDOFF_PATH,
      sessionId: "session-wrapper-0001",
      runtime: process.env.SESSION_RELAUNCH_TEST_RUNTIME || "claude",
      name: process.env.RECORD_NAME || null,
      cwd: process.env.RECORDED_CWD,
      hops: Number(process.env.SKILLED_LOOP_HOPS || 0),
      armedAt,
      ...(process.env.SIGNALLED_ON_INVOCATION === String(invocation)
        ? { signalledAt: new Date().toISOString() }
        : {}),
      ...(process.env.RECORD_MODEL ? { model: process.env.RECORD_MODEL } : {}),
      ...(process.env.RECORD_EFFORT ? { effort: process.env.RECORD_EFFORT } : {}),
      ...(process.env.RECORD_PERMISSION_MODE
        ? { permissionMode: process.env.RECORD_PERMISSION_MODE }
        : {}),
      ...(process.env.RECORD_PROVIDER ? { provider: process.env.RECORD_PROVIDER } : {})
    };
    fs.writeFileSync(path.join(stateDir, "relaunch-" + loopId + ".json"), JSON.stringify(relaunch));
  }
}
const noteDoneInvocation = process.env.NOTE_DONE_ON_INVOCATION;
if (noteDoneInvocation === String(invocation)) {
  const notePath = process.env.HANDOFF_PATH;
  const note = fs.readFileSync(notePath, "utf8");
  fs.writeFileSync(notePath, note.replace(/^status: open$/m, "status: done"));
}
const noteRewriteInvocation = process.env.NOTE_REWRITE_ON_INVOCATION;
if (noteRewriteInvocation === String(invocation)) {
  fs.writeFileSync(process.env.HANDOFF_PATH, fs.readFileSync(process.env.NOTE_REWRITE_SOURCE, "utf8"));
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
  const env = {
    ...withoutRelaunchSwitches(process.env),
    HOME: home,
    XDG_RUNTIME_DIR: xdgRuntimeDir,
    SESSION_RELAUNCH_REPO_ROOT: repoRoot,
    // Pin the flags file inside the sandbox so an operator's own hook-flags.env
    // cannot change what these cases observe.
    HOOK_FLAGS_CONFIG: path.join(root, 'hook-flags.env'),
  };
  for (const key of [
    'SKILLED_LOOP_ID',
    'SKILLED_LOOP_HOPS',
    'SKILLED_LOOP_RUNTIME',
    'SKILLED_LOOP_NAME',
    'SKILLED_LOOP_MODEL',
    'SKILLED_LOOP_PROVIDER',
    'SKILLED_LOOP_EFFORT',
    'SESSION_RELAUNCH_MAX_HOPS',
    'SESSION_RELAUNCH_MAX_AGE_MIN',
    'SESSION_RELAUNCH_GOAL',
    'SESSION_RELAUNCH_GOAL_PACKET',
    'SKILLED_LOOP_CLAIM_SEED',
  ]) delete env[key];
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, xdgRuntimeDir, home, binDir, recordedCwd, env };
}

function handoffsDirectory(sandbox) {
  return path.join(
    sandbox.repoRoot, '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
  );
}

function installRuntimeStub(sandbox, { markers = '', exitCodes = '0', ...overrides } = {}) {
  const recordPath = path.join(sandbox.root, 'runtime-record.jsonl');
  const markerPath = path.join(sandbox.root, 'arm.marker');
  // The hand-over call takes only a note inside the repository's handoffs directory.
  const handoffPath = path.join(handoffsDirectory(sandbox), 'handoff.md');
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(markerPath, markers);
  fs.writeFileSync(handoffPath, OPEN_NOTE);
  const shellProgram = `#!/usr/bin/env bash
set -euo pipefail
# A capability probe is answered from STUB_HELP and never recorded as a session.
if [[ "\${1:-}" == "--help" ]]; then
  printf '%s' "\${STUB_HELP:-}"
  exit 0
fi
export SESSION_RELAUNCH_TEST_RUNTIME="$SKILLED_LOOP_RUNTIME"
export SESSION_RELAUNCH_TEST_COMMAND="\${0##*/}"
node -e '${RUNTIME_SOURCE}' -- "$@"
`;
  for (const runtime of [
    'claude', 'pi', 'opencode', 'codex', 'cursor-agent', 'devin',
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

function runWrapperScript(sandbox, wrapperPath, args) {
  return spawnSync('/bin/bash', [wrapperPath, ...args], {
    cwd: sandbox.repoRoot,
    env: sandbox.env,
    encoding: 'utf8',
    timeout: 12000,
  });
}

// The wrapper names its record after its own process id, so a leftover record can only be
// planted for it by a launcher that writes its own $$ and then execs the wrapper in place.
function installLeftoverRecordLauncher(sandbox, records) {
  const launcherPath = path.join(sandbox.root, 'leftover-record-launcher.sh');
  const plantedIdPath = path.join(sandbox.root, 'planted-loop-id.txt');
  const recordTemplate = JSON.stringify({ ...LEFTOVER_RECORD, loopId: '__LOOP_ID__' });
  const [recordHead, recordTail] = recordTemplate.split('__LOOP_ID__');
  const lines = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'state_directory="$XDG_RUNTIME_DIR/skilled-relaunch"',
    'mkdir -p "$state_directory"',
    `printf '%s' "$$" > '${plantedIdPath}'`,
  ];
  for (const [recordName, loopId] of records) {
    lines.push(
      `printf '%s%s%s' '${recordHead}' "${loopId}" '${recordTail}' > "$state_directory/${recordName}"`,
    );
  }
  lines.push(`exec /bin/bash "${WRAPPER_PATH}" "$@"`);
  fs.writeFileSync(launcherPath, `${lines.join('\n')}\n`, { mode: 0o755 });
  return launcherPath;
}

// A symlink at the wrapper's own record path proves the cleanup unlinks the record it names
// and never the file that path resolves to.
function installSymlinkedRecordLauncher(sandbox, targetPath) {
  const launcherPath = path.join(sandbox.root, 'symlinked-record-launcher.sh');
  const lines = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'state_directory="$XDG_RUNTIME_DIR/skilled-relaunch"',
    'mkdir -p "$state_directory"',
    `ln -s '${targetPath}' "$state_directory/relaunch-$$.json"`,
    `exec /bin/bash "${WRAPPER_PATH}" "$@"`,
  ];
  fs.writeFileSync(launcherPath, `${lines.join('\n')}\n`, { mode: 0o755 });
  return launcherPath;
}

function runWrapper(sandbox, args) {
  return runWrapperScript(sandbox, WRAPPER_PATH, args);
}

function handOverLines(sandbox) {
  const historyPath = path.join(
    sandbox.repoRoot, '.skilled', 'skills', '.state', 'session-relaunch', 'hop-history.log',
  );
  if (!fs.existsSync(historyPath)) return [];
  return fs.readFileSync(historyPath, 'utf8').split('\n')
    .filter((line) => line.split('\t')[1] === 'handed-over');
}

function installSkilledLoopCommand(sandbox) {
  const commandPath = path.join(sandbox.binDir, 'skilled-loop');
  const source = `#!/usr/bin/env bash
set -euo pipefail
exec /bin/bash "${WRAPPER_PATH}" "$@"
`;
  fs.writeFileSync(commandPath, source, { mode: 0o755 });
}

function installWrapperCopy(sandbox) {
  const sourceRoot = path.resolve(__dirname, '../../..');
  const targetRoot = path.join(sandbox.repoRoot, '.skilled');
  for (const relativePath of ['bin/skilled-loop', 'hooks/session-relaunch', 'hooks/shared']) {
    fs.cpSync(path.join(sourceRoot, relativePath), path.join(targetRoot, relativePath), {
      recursive: true,
    });
  }
  return {
    corePath: path.join(targetRoot, 'hooks/session-relaunch/lib/relaunch-core.cjs'),
    realCorePath: path.resolve(__dirname, '../lib/relaunch-core.cjs'),
    wrapperPath: path.join(targetRoot, 'bin/skilled-loop'),
  };
}

// Copy the wrapper and its relaunch modules into the sandbox, then change the copied
// core's suffix marker so a seed built by the wrapper proves which implementation ran.
function installWrapperCopyWithChangedSuffix(sandbox) {
  const { corePath, realCorePath, wrapperPath } = installWrapperCopy(sandbox);
  const marker = ' (suffix owned by the copied core)';
  const shimSource = [
    `'use strict';`,
    `const realCore = require(${JSON.stringify(realCorePath)});`,
    `const SUFFIX = ${JSON.stringify(SPEC_FOLDER_SUFFIX)};`,
    `const MARKER = ${JSON.stringify(marker)};`,
    'module.exports = {',
    '  ...realCore,',
    '  specFolderSuffix(specFolder) {',
    '    return realCore.specFolderSuffix(specFolder).replace(SUFFIX, MARKER);',
    '  },',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(corePath, shimSource);
  return { wrapperPath, marker };
}

function installWrapperWithThrowingSuffix(sandbox) {
  const { corePath, realCorePath, wrapperPath } = installWrapperCopy(sandbox);
  const shimSource = [
    `'use strict';`,
    `const realCore = require(${JSON.stringify(realCorePath)});`,
    'module.exports = {',
    '  ...realCore,',
    '  specFolderSuffix() {',
    "    throw new Error('spec-folder suffix failure');",
    '  },',
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(corePath, shimSource);
  return { wrapperPath };
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

// Cancels the hand-over through the real CLI right before consume runs, so the withdraw lands
// after should-relaunch approved the hop with no timing involved.
function installWithdrawBeforeConsumeStub(sandbox) {
  const nodePath = path.join(sandbox.binDir, 'node');
  const source = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'if [[ "${2:-}" == "consume" ]]; then',
    '  "$REAL_NODE" "$1" cancel --loop-id "$4" >/dev/null',
    'fi',
    'exec "$REAL_NODE" "$@"',
    '',
  ].join('\n');
  fs.writeFileSync(nodePath, source, { mode: 0o755 });
  sandbox.env.REAL_NODE = process.execPath;
}

function installFailingHandOverStub(sandbox) {
  const nodePath = path.join(sandbox.binDir, 'node');
  const source = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    'if [[ "$2" == "hand-over" ]]; then',
    '  exit 9',
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

// OpenCode 2 lists --standalone in its root help. Without it a session lands on the shared
// background service, which carries no loop id, so the relaunch never arms.
const OPENCODE_2_HELP = [
  'FLAGS',
  '  --standalone            Run with a private server instead of the background service',
  '  --server string         Connect to a server URL instead of the background service',
  '  --prompt string         Prompt to use',
].join('\n');

module.exports = {
  WRAPPER_PATH, CLI_PATH, SEED, SPEC_FOLDER, SPEC_FOLDER_SUFFIX, SKIP_SPEC_FOLDER_SUFFIX,
  COMMAND_RUNTIME_SPEC_FOLDER, LOOP_ID_PATTERN, OPEN_NOTE, LEFTOVER_RECORD,
  expectedClaudeManualCommand, RUNTIME_RELAUNCH_CASES, RUNTIME_SOURCE, createSandbox,
  handoffsDirectory, installRuntimeStub, writeSpecFolderNote, runWrapperScript,
  installLeftoverRecordLauncher, installSymlinkedRecordLauncher, runWrapper, handOverLines,
  installSkilledLoopCommand, installWrapperCopy, installWrapperCopyWithChangedSuffix,
  installWrapperWithThrowingSuffix, runManualCommand, withManualTemplate, installDeciderStub,
  installConsumeFailureStub, installMalformedDecisionStub, installTruncatedDecisionOutputStub,
  installMalformedConsumeStub, installWithdrawBeforeConsumeStub, installFailingHandOverStub,
  readRecords, readLog, OPENCODE_2_HELP,
};
