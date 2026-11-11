// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard After-Call Watch Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const core = require('./env-secret-guard.cjs');
const watch = require('./env-secret-watch.cjs');

const SECRET = 'sk-live-do-not-leak-77c1';
const HOOK = path.join(__dirname, '..', 'command-hook', 'env-secret-guard-after.cjs');

function project(t) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'env-secret-watch-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'state'));
  fs.mkdirSync(path.join(dir, 'apps', 'api'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.env'), `API_KEY="${SECRET}"\nPORT=3000\nHOST=http://localhost:3000\n`);
  fs.writeFileSync(path.join(dir, 'apps', 'api', '.env.local'), 'DB_URL=postgres://u:p4ss@db.internal/app\n');
  fs.writeFileSync(path.join(dir, '.env.example'), 'API_KEY=\n');
  return { dir, env: { [watch.STATE_ENV]: path.join(dir, 'state') } };
}

test('a dotenv file a shell call changed, deleted or created is put back', (t) => {
  const { dir, env } = project(t);
  const original = fs.readFileSync(path.join(dir, '.env'), 'utf8');
  assert.equal(watch.snapshotDotenv(dir, env), 2);
  fs.appendFileSync(path.join(dir, '.env'), 'LOG_LEVEL=debug\n');
  fs.rmSync(path.join(dir, 'apps', 'api', '.env.local'));
  fs.writeFileSync(path.join(dir, '.env.production'), 'X=1\n');

  const review = watch.reviewToolResult({ tool: 'Bash', output: 'done', cwd: dir, env });
  assert.deepEqual(review.changes.map((change) => `${change.change} ${change.file}`).sort(), [
    'created .env.production', `deleted ${path.join('apps', 'api', '.env.local')}`, 'modified .env',
  ]);
  assert.equal(fs.readFileSync(path.join(dir, '.env'), 'utf8'), original);
  assert.ok(fs.existsSync(path.join(dir, 'apps', 'api', '.env.local')));
  assert.equal(fs.existsSync(path.join(dir, '.env.production')), false);
  const kept = review.changes.find((change) => change.change === 'modified').kept;
  assert.match(fs.readFileSync(kept, 'utf8'), /LOG_LEVEL=debug/);
  assert.equal(fs.statSync(kept).mode & 0o077, 0);
  assert.match(review.message, /the change was undone/);
  assert.doesNotMatch(review.message, new RegExp(SECRET));
});

test('report mode names the change and leaves the file as the call left it', (t) => {
  const { dir, env } = project(t);
  watch.snapshotDotenv(dir, env);
  fs.appendFileSync(path.join(dir, '.env'), 'LOG_LEVEL=debug\n');
  const review = watch.reviewToolResult({
    tool: 'Bash', output: '', cwd: dir, env: { ...env, [watch.WRITE_CHECK_ENV]: 'report' },
  });
  assert.equal(review.changes[0].restored, false);
  assert.match(fs.readFileSync(path.join(dir, '.env'), 'utf8'), /LOG_LEVEL=debug/);
});

test('with no record, a change the user made between calls, or a file tool, nothing is undone', (t) => {
  const { dir, env } = project(t);
  assert.deepEqual(watch.reviewDotenvWrites(dir, env), []);
  watch.snapshotDotenv(dir, env);
  fs.appendFileSync(path.join(dir, '.env'), 'USER_EDIT=1\n');
  watch.snapshotDotenv(dir, env);
  assert.deepEqual(watch.reviewDotenvWrites(dir, env), []);
  fs.appendFileSync(path.join(dir, '.env'), 'LATER=1\n');
  assert.equal(watch.reviewToolResult({ tool: 'Read', output: '', cwd: dir, env }).message, null);
});

test('a dotenv value in the output is named by key and can be redacted', (t) => {
  const { dir, env } = project(t);
  const output = { stdout: `key is ${SECRET}\nhttp://localhost:3000 3000`, stderr: '' };
  const review = watch.reviewToolResult({ tool: 'Bash', output, cwd: dir, env });
  assert.deepEqual(review.leaks, [{ key: 'API_KEY', file: '.env' }]);
  assert.match(review.message, /held the value of API_KEY from \.env/);
  assert.doesNotMatch(review.message, new RegExp(SECRET));
  assert.equal(review.redact(`a ${SECRET} b`), 'a [env-secret-guard: API_KEY redacted] b');
  assert.equal(watch.reviewToolResult({ tool: 'Bash', output: 'PORT 3000 on localhost', cwd: dir, env }).message, null);
  const nested = watch.scanOutput([{ type: 'text', text: 'postgres://u:p4ss@db.internal/app' }], dir);
  assert.deepEqual(nested.leaks, [{ key: 'DB_URL', file: path.join('apps', 'api', '.env.local') }]);
});

test('command hook: after a shell call it undoes a write and reports a leak as context', (t) => {
  const { dir, env } = project(t);
  const run = (payload) => spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ cwd: dir, ...payload }),
    encoding: 'utf8',
    env: { ...process.env, SYSTEM_HOOKS_DISABLED: '', SYSTEM_ENV_SECRET_GUARD_DISABLED: '', ...env },
  });
  const before = run({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'node setup.js' } });
  assert.equal(before.stdout, '');
  fs.appendFileSync(path.join(dir, '.env'), 'LOG_LEVEL=debug\n');
  const after = run({
    hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: 'node setup.js' },
    tool_response: { stdout: SECRET },
  });
  const context = JSON.parse(after.stdout).hookSpecificOutput.additionalContext;
  assert.match(context, /modified \.env/);
  assert.match(context, /value of API_KEY/);
  assert.doesNotMatch(after.stdout, new RegExp(SECRET));
  assert.doesNotMatch(fs.readFileSync(path.join(dir, '.env'), 'utf8'), /LOG_LEVEL/);

  const cursor = run({ hook_event_name: 'postToolUse', tool_name: 'Shell', tool_output: JSON.stringify({ output: SECRET }) });
  assert.match(JSON.parse(cursor.stdout).agent_message, /value of API_KEY/);
  const quiet = run({ hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_response: { stdout: 'ok' } });
  assert.equal(quiet.stdout, '');
});

test('the switch is read from the environment only', () => {
  assert.equal(core.isGuardEnabled({}), true);
  assert.equal(core.isGuardEnabled({ SYSTEM_ENV_SECRET_GUARD_DISABLED: '1' }), false);
  assert.equal(core.isGuardEnabled({ SYSTEM_HOOKS_DISABLED: 'true' }), false);
  assert.equal(core.isGuardEnabled({ SYSTEM_ENV_SECRET_GUARD_DISABLED: '0' }), true);
});
