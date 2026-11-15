'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Keep the measured log between the before and after runs so both time the same bytes.
const WORKSPACE = path.join(os.tmpdir(), 'skilled-loop-name-carry-perf');
const TARGET_BYTES = 16 * 1024 * 1024;
const SESSION_ID = 'session-perf-00000001';
const LOOP_ID = 'loop-perf-00000001';

function repositoryRoot() {
  let directory = __dirname;
  for (;;) {
    if (fs.existsSync(path.join(directory, '.git'))) return directory;
    const parent = path.dirname(directory);
    if (parent === directory) throw new Error('repository root not found');
    directory = parent;
  }
}

const repoRoot = repositoryRoot();
const cliPath = path.join(repoRoot, '.skilled/hooks/session-relaunch/bin/session-relaunch.cjs');

function ensureLog(logPath) {
  if (fs.existsSync(logPath)) {
    const size = fs.statSync(logPath).size;
    if (size >= TARGET_BYTES) return size;
  }
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  const padding = 'x'.repeat(1000);
  const line = `${JSON.stringify({ type: 'user', message: { content: padding } })}\n`;
  const lineBytes = Buffer.byteLength(line);
  const descriptor = fs.openSync(logPath, 'w');
  let written = 0;
  while (written < TARGET_BYTES) {
    fs.writeSync(descriptor, line);
    written += lineBytes;
  }
  fs.writeSync(descriptor, `${JSON.stringify({
    type: 'assistant',
    isSidechain: false,
    requestedModel: 'claude-sonnet-5-5',
    effort: 'high',
    message: { model: 'claude-sonnet-5-5' },
  })}\n`);
  fs.closeSync(descriptor);
  return fs.statSync(logPath).size;
}

function prepareText() {
  return [
    '---',
    'status: open',
    `session_id: ${SESSION_ID}`,
    `loop_id: ${LOOP_ID}`,
    'runtime: claude',
    `cwd: ${path.sep}tmp${path.sep}session-relaunch`,
    'spec_folder: specs/hooks/001-example',
    'created_at: 2026-11-13T00:00:00.000Z',
    '---',
    '## Goal',
    'Measure prepare on a large untitled log.',
    '## Done',
    'The log is written.',
    '## Remaining work',
    'Time it.',
    '## In-flight state',
    'No child process is running.',
    'Running workers: none',
    '',
  ].join('\n');
}

const configDirectory = path.join(WORKSPACE, 'claude-config');
const logPath = path.join(
  configDirectory, 'projects', '-project', `${SESSION_ID}.jsonl`,
);
const notePath = path.join(
  WORKSPACE, 'repo', '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs', 'handoff.md',
);
const specFolder = path.join(WORKSPACE, 'repo', 'specs', 'hooks', '001-example');

fs.mkdirSync(path.join(WORKSPACE, 'runtime'), { recursive: true });
fs.mkdirSync(path.join(WORKSPACE, 'home'), { recursive: true });
fs.mkdirSync(path.dirname(notePath), { recursive: true });
fs.mkdirSync(specFolder, { recursive: true });
fs.writeFileSync(notePath, prepareText());
const logSize = ensureLog(logPath);

const env = { ...process.env };
for (const key of Object.keys(env)) {
  if (key.startsWith('SKILLED_LOOP_')) delete env[key];
}
Object.assign(env, {
  HOME: path.join(WORKSPACE, 'home'),
  XDG_RUNTIME_DIR: path.join(WORKSPACE, 'runtime'),
  SESSION_RELAUNCH_REPO_ROOT: path.join(WORKSPACE, 'repo'),
  HOOK_FLAGS_CONFIG: path.join(WORKSPACE, 'hook-flags.env'),
  SYSTEM_SESSION_RELAUNCH_ENABLED: '1',
  SKILLED_LOOP_ID: LOOP_ID,
  SKILLED_LOOP_RUNTIME: 'claude',
  SKILLED_LOOP_HOPS: '0',
  CLAUDE_CONFIG_DIR: configDirectory,
});
delete env.CLAUDE_PID;

const started = process.hrtime.bigint();
const result = spawnSync(
  process.execPath,
  [cliPath, 'prepare', '--handoff', notePath, '--session', SESSION_ID],
  { cwd: env.SESSION_RELAUNCH_REPO_ROOT, env, encoding: 'utf8', timeout: 30000 },
);
const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

process.stdout.write(
  `prepare wall ${elapsedMs.toFixed(1)} ms, exit ${result.status}, `
    + `log ${(logSize / (1024 * 1024)).toFixed(1)} MiB\n`,
);
if (result.status !== 0) {
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  process.exitCode = 1;
}
