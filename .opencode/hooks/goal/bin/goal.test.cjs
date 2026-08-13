// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: goal manage CLI tests                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { execFile, execFileSync } = require('node:child_process');
const {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { afterEach, beforeEach, test } = require('node:test');
const { promisify } = require('node:util');

const CLI_PATH = join(__dirname, 'goal.cjs');
const execFileAsync = promisify(execFile);

let stateDir;

beforeEach(() => {
  stateDir = mkdtempSync(join(tmpdir(), 'goal-cli-test-'));
});

afterEach(() => {
  rmSync(stateDir, { recursive: true, force: true });
});

function runCli(args) {
  const stdout = execFileSync('node', [CLI_PATH, ...args], {
    env: {
      ...process.env,
      MK_GOAL_PLUGIN_DISABLED: undefined,
      MK_GOAL_STATE_DIR: stateDir,
    },
    encoding: 'utf8',
  });
  return stdout;
}

async function runCliAsync(args) {
  const result = await execFileAsync('node', [CLI_PATH, ...args], {
    env: {
      ...process.env,
      MK_GOAL_PLUGIN_DISABLED: undefined,
      MK_GOAL_STATE_DIR: stateDir,
    },
    encoding: 'utf8',
  });
  return result.stdout;
}

function field(stdout, key) {
  const line = stdout.split('\n').find((candidate) => candidate.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1) : undefined;
}

test('mutating without explicit runtime and session identity writes nothing', () => {
  const stdout = runCli(['set', 'Must not persist']);
  assert.match(stdout, /^STATUS=FAIL ACTION=set/m);
  assert.equal(field(stdout, 'code'), 'MISSING_SESSION_ID');
  assert.deepEqual(readdirSync(stateDir), []);
});

test('session identity without a runtime namespace fails without writing', () => {
  const stdout = runCli(['--session', 'session-a', 'set', 'Must not persist']);
  assert.match(stdout, /^STATUS=FAIL ACTION=set/m);
  assert.equal(field(stdout, 'code'), 'MISSING_RUNTIME');
  assert.deepEqual(readdirSync(stateDir), []);
});

test('explicit session bindings keep CLI goals independent', () => {
  const bindingA = ['--runtime', 'pi', '--session', 'session-a'];
  const bindingB = ['--runtime', 'pi', '--session', 'session-b'];
  runCli([...bindingA, 'set', 'Goal A']);
  runCli([...bindingB, 'set', 'Goal B']);

  const showA = runCli([...bindingA, 'show']);
  const showB = runCli([...bindingB, 'show']);
  assert.equal(field(showA, 'objective'), '"Goal A"');
  assert.equal(field(showB, 'objective'), '"Goal B"');
});

test('aggregate diagnostics expose counts without raw session identities', () => {
  const rawSessionId = 'private/session/id';
  runCli(['--runtime', 'pi', '--session', rawSessionId, 'set', 'Private goal']);
  const doctor = runCli(['doctor']);
  assert.equal(field(doctor, 'active_state_file_count'), '1');
  assert.equal(doctor.includes(rawSessionId), false);
});

test('legacy inspect and migrate require an explicit target and are repeat-safe', () => {
  const legacyPath = join(stateDir, 'active-goal.json');
  writeFileSync(legacyPath, JSON.stringify({
    goalId: 'goal-cli-legacy',
    objective: 'Migrate this explicit objective',
    status: 'active',
    createdAtMs: 1,
    updatedAtMs: 1,
  }), { mode: 0o600 });

  const inspected = runCli(['legacy-inspect']);
  assert.match(inspected, /^STATUS=OK ACTION=legacy-inspect/m);
  assert.equal(field(inspected, 'legacy_state_status'), 'valid');
  assert.equal(field(inspected, 'legacy_goal_id'), '"goal-cli-legacy"');

  const unbound = runCli(['legacy-migrate']);
  assert.match(unbound, /^STATUS=FAIL ACTION=legacy-migrate/m);
  assert.equal(field(unbound, 'code'), 'MISSING_SESSION_ID');
  assert.equal(existsSync(legacyPath), true);

  const binding = ['--runtime', 'pi', '--session', 'native-session'];
  const migrated = runCli([...binding, 'legacy-migrate']);
  assert.match(migrated, /^STATUS=OK ACTION=legacy-migrate/m);
  assert.equal(field(migrated, 'legacy_migrated'), 'true');
  assert.equal(existsSync(legacyPath), false);
  const shown = runCli([...binding, 'show']);
  assert.equal(field(shown, 'objective'), '"Migrate this explicit objective"');

  const repeated = runCli([...binding, 'legacy-migrate']);
  assert.match(repeated, /^STATUS=OK ACTION=legacy-migrate/m);
  assert.equal(field(repeated, 'legacy_migrated'), 'false');
  assert.equal(field(repeated, 'reason'), 'no_legacy_state');
});

test('legacy archive preserves malformed bytes without requiring session identity', () => {
  const legacyPath = join(stateDir, 'active-goal.json');
  const malformedBytes = '{broken-legacy\n';
  writeFileSync(legacyPath, malformedBytes, { mode: 0o600 });

  const archived = runCli(['legacy-archive']);
  assert.match(archived, /^STATUS=OK ACTION=legacy-archive/m);
  assert.equal(field(archived, 'legacy_archived'), 'true');
  assert.equal(field(archived, 'legacy_state_status'), 'malformed');
  const archivePath = JSON.parse(field(archived, 'legacy_archive_path'));
  assert.equal(readFileSync(archivePath, 'utf8'), malformedBytes);
  assert.equal(existsSync(legacyPath), false);
});

test('same-scope concurrent writers leave one valid record and no temp files', async () => {
  const binding = ['--runtime', 'pi', '--session', 'shared-session'];
  const writes = Array.from({ length: 12 }, (_, index) => (
    runCliAsync([...binding, 'set', `Concurrent goal ${index}`])
  ));
  await Promise.all(writes);

  const show = runCli([...binding, 'show']);
  assert.equal(field(show, 'goal_present'), 'true');
  const entries = readdirSync(stateDir);
  assert.equal(entries.filter((name) => /^[a-f0-9]{64}\.json$/.test(name)).length, 1);
  assert.equal(entries.some((name) => name.endsWith('.tmp')), false);
});
