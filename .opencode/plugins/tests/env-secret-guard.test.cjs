// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard Plugin Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const SECRET = 'sk-live-do-not-leak-77c1';

async function loadHooks(t) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'env-secret-guard-plugin-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, '.env'), `API_KEY=${SECRET}\n`);
  const pluginUrl = pathToFileURL(path.join(__dirname, '..', 'env-secret-guard.js')).href;
  const hooks = await (await import(pluginUrl)).default.server({ directory: dir });
  return { dir, hooks };
}

test('refuses read, edit, apply_patch and bash on a dotenv file by throwing', async (t) => {
  const { hooks } = await loadHooks(t);
  for (const [tool, args] of [
    ['read', { filePath: '.env' }],
    ['edit', { filePath: '.env', oldString: 'a', newString: 'b' }],
    ['apply_patch', { patchText: '*** Begin Patch\n*** Add File: .env.local\n*** End Patch' }],
    ['bash', { command: 'grep API_KEY .env' }],
    ['bash', { command: 'grep "API_KEY|PORT" .env' }],
    ['bash', { command: 'dd if=.env' }],
    ['write', { filePath: '.env.local', content: 'X=1' }],
  ]) {
    await assert.rejects(hooks['tool.execute.before']({ tool }, { args }), /env_secret_list_keys/, tool);
  }
  await hooks['tool.execute.before']({ tool: 'read' }, { args: { filePath: 'src/index.ts' } });
  const quotedPatch = { filePath: 'docs/migration.md', content: '--- .env\n+++ .env.example\n' };
  await hooks['tool.execute.before']({ tool: 'write' }, { args: quotedPatch });
});

test('the OpenCode 2 entry denies through the bridge too', async (t) => {
  const { dir } = await loadHooks(t);
  const plugin = (await import(pathToFileURL(path.join(__dirname, '..', 'env-secret-guard.js')).href)).default;
  let before;
  const ctx = {
    location: { directory: dir },
    event: { subscribe: () => ({ dispose() {} }) },
    tool: {
      hook: (name, fn) => { if (name === 'execute.before') before = fn; return { dispose() {} }; },
      transform: () => ({ dispose() {} }),
    },
    session: { hook: () => ({ dispose() {} }) },
  };
  const cleanup = await plugin.setup(ctx);
  t.after(() => typeof cleanup === 'function' && cleanup());
  assert.equal(typeof before, 'function');
  const call = (tool, input) => before({ tool, input, sessionID: 's', callID: 'c' });
  await assert.rejects(call('read', { filePath: '.env' }), /dotenv file/);
  await assert.rejects(call('shell', { command: 'cat .env' }), /dotenv file/);
});

test('the inspection tools answer without the value', async (t) => {
  const { hooks } = await loadHooks(t);
  const keys = JSON.parse(await hooks.tool.env_secret_list_keys.execute({ filePath: '.env' }));
  assert.deepEqual(keys.keys, ['API_KEY']);
  const valid = JSON.parse(await hooks.tool.env_secret_validate.execute({ filePath: '.env' }));
  assert.equal(valid.valid, true);

  const previous = process.env.ENV_SECRET_GUARD_PEPPER;
  process.env.ENV_SECRET_GUARD_PEPPER = 'pepper-for-tests';
  t.after(() => {
    if (previous === undefined) delete process.env.ENV_SECRET_GUARD_PEPPER;
    else process.env.ENV_SECRET_GUARD_PEPPER = previous;
  });
  const printed = await hooks.tool.env_secret_fingerprint.execute({ filePath: '.env', key: 'API_KEY' });
  assert.match(JSON.parse(printed).fingerprint, /^[0-9a-f]{64}$/);
  assert.doesNotMatch(printed, new RegExp(SECRET));
});

test('after a shell call a dotenv write is undone and a dotenv value is taken out of the output', async (t) => {
  const { dir, hooks } = await loadHooks(t);
  const previous = process.env.ENV_SECRET_GUARD_STATE_DIR;
  process.env.ENV_SECRET_GUARD_STATE_DIR = path.join(dir, 'state');
  t.after(() => {
    if (previous === undefined) delete process.env.ENV_SECRET_GUARD_STATE_DIR;
    else process.env.ENV_SECRET_GUARD_STATE_DIR = previous;
  });
  await hooks['tool.execute.before']({ tool: 'bash' }, { args: { command: 'node setup.js' } });
  fs.appendFileSync(path.join(dir, '.env'), 'LOG_LEVEL=debug\n');
  const output = { output: `token ${SECRET}` };
  await hooks['tool.execute.after']({ tool: 'bash' }, output);
  assert.doesNotMatch(output.output, new RegExp(SECRET));
  assert.match(output.output, /API_KEY redacted/);
  assert.match(output.output, /the change was undone/);
  assert.doesNotMatch(fs.readFileSync(path.join(dir, '.env'), 'utf8'), /LOG_LEVEL/);
  const clean = { output: 'ok' };
  await hooks['tool.execute.after']({ tool: 'bash' }, clean);
  assert.equal(clean.output, 'ok');
});

test('a core failure lets the call through and is logged, never printed', async (t) => {
  const { dir, hooks } = await loadHooks(t);
  const written = [];
  const original = process.stderr.write;
  process.stderr.write = (chunk) => { written.push(String(chunk)); return true; };
  t.after(() => { process.stderr.write = original; });
  const args = { get filePath() { throw new Error('boom'); } };
  await hooks['tool.execute.before']({ tool: 'read' }, { args });
  process.stderr.write = original;
  assert.equal(written.join(''), '');
  const log = fs.readFileSync(path.join(dir, '.opencode', 'logs', 'env-secret-guard.log'), 'utf8');
  assert.match(log, /\[env-secret-guard\] allowing a call it could not judge: boom/);
});

test('the kill switch lets a refused call through and turns the tools off', async (t) => {
  const { hooks } = await loadHooks(t);
  const previous = process.env.SYSTEM_ENV_SECRET_GUARD_DISABLED;
  process.env.SYSTEM_ENV_SECRET_GUARD_DISABLED = '1';
  t.after(() => {
    if (previous === undefined) delete process.env.SYSTEM_ENV_SECRET_GUARD_DISABLED;
    else process.env.SYSTEM_ENV_SECRET_GUARD_DISABLED = previous;
  });
  await hooks['tool.execute.before']({ tool: 'read' }, { args: { filePath: '.env' } });
  assert.match(await hooks.tool.env_secret_list_keys.execute({ filePath: '.env' }), /disabled/);
});
