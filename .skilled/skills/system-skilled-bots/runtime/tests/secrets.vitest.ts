// ───────────────────────────────────────────────────────────────────
// MODULE: Vault Store Tests
// ───────────────────────────────────────────────────────────────────
//
// The store is the one module that holds a value, so these tests pin the
// name grammar, the two backends, the index's refusal of damage and the
// lock under racing and stopped writers. Every keychain case runs against
// two fake programs placed first on PATH, because a case that reached the
// operator's login keychain would either prompt or write a real item. The
// one exception is the scratch keychain case, which makes its own keychain
// file and deletes it again.

import { execFileSync, spawn } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

import { parseDefinition } from '../lib/definition.js';
import { collectAllKnownSecrets } from '../lib/dispatch.js';
import {
  KEYCHAIN_LINE_MAX_BYTES,
  forgetSecret,
  hostKeychainProgram,
  isSecretName,
  keychainAccount,
  knownSecretValues,
  listSecrets,
  readSecretsIndex,
  resolveSecret,
  secretEnvKey,
  secretNameFromEnvKey,
  setSecret,
} from '../lib/secrets.js';
import { ensureIdentityState, identityStatePaths } from '../lib/state-root.js';

import type { Result } from '../lib/repo-config.js';
import type { SecretStoreOptions } from '../lib/secrets.js';

/** The value every case plants, a plain word so no credential shape sits in the repository. */
const VALUE = 'skilled-test-value-7f3a';

/** The lowercase hex of VALUE, the form the keychain holds. */
const VALUE_HEX = '736b696c6c65642d746573742d76616c75652d37663361';

/** The environment key one accepted name maps to, named once so the mapping is checked against a literal. */
const SLACK_KEY = 'SKILLED_BOT_SECRET_SLACK_APP_TOKEN';

/** The runtime root, so a racer child imports the module under test by its absolute path. */
const R = resolve(import.meta.dirname, '..');

// ───────────────────────────────────────────────────────────────────
// FIXTURES
// ───────────────────────────────────────────────────────────────────

/** A fresh temp folder, so no case reads another case's state. */
function tempDir(prefix = 'bots-vault-'): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

/** A temp state root holding one identity's folders, with the secrets folder that identity owns. */
function vault(): { root: string; identity: string; folder: string } {
  const root = tempDir('bots-vault-root-');
  const identity = 'acme/tool';
  ensureIdentityState(root, identity);
  return { root, identity, folder: identityStatePaths(root, identity).secrets };
}

/** The two fake keychain programs one case runs against, and the calls they recorded. */
interface FakeKeychain {
  bin: string;
  dir: string;
  env: NodeJS.ProcessEnv;
  log(): Array<{ program: string; argv: string[]; stdin: string }>;
  mode(m: string): void;
}

/** The fake macOS program, which keeps one file per account and can be told to misbehave. */
const SECURITY_BODY = String.raw`const fs = require('fs'); const path = require('path');
const dir = process.env.FAKE_KEYCHAIN_DIR; const argv = process.argv.slice(2); const stdin = fs.readFileSync(0, 'utf8');
fs.appendFileSync(path.join(dir, 'argv.log'), JSON.stringify({ program: 'security', argv, stdin }) + '\n');
const mode = fs.existsSync(path.join(dir, 'mode')) ? fs.readFileSync(path.join(dir, 'mode'), 'utf8').trim() : '';
if (mode === 'sleep') Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 30000);
const words = argv[0] === '-q' && argv[1] === '-i' ? stdin.trim().split(/ +/) : argv;
fs.mkdirSync(path.join(dir, 'items'), { recursive: true });
const item = path.join(dir, 'items', encodeURIComponent(words[words.indexOf('-a') + 1]));
if (words[0] === 'add-generic-password') { if (mode !== 'dropped') fs.writeFileSync(item, mode === 'raw' ? 'not hex at all' : words[words.indexOf('-w') + 1]); process.exit(0); }
if (words[0] === 'find-generic-password') { if (!fs.existsSync(item)) process.exit(44); process.stdout.write(fs.readFileSync(item, 'utf8') + '\n'); process.exit(0); }
if (words[0] === 'delete-generic-password') { if (mode === 'delete-fails') process.exit(1); if (!fs.existsSync(item)) process.exit(44); fs.rmSync(item); process.exit(0); }
process.exit(2);
`;

/** The fake Linux program, which keeps the whole of stdin as the item's value. */
const SECRET_TOOL_BODY = String.raw`const fs = require('fs'); const path = require('path');
const dir = process.env.FAKE_KEYCHAIN_DIR; const argv = process.argv.slice(2); const stdin = fs.readFileSync(0, 'utf8');
fs.appendFileSync(path.join(dir, 'argv.log'), JSON.stringify({ program: 'secret-tool', argv, stdin }) + '\n');
fs.mkdirSync(path.join(dir, 'items'), { recursive: true });
const item = path.join(dir, 'items', encodeURIComponent(argv[argv.indexOf('account') + 1]));
if (argv[0] === 'store') { fs.writeFileSync(item, stdin); process.exit(0); }
if (argv[0] === 'lookup') { if (!fs.existsSync(item)) process.exit(1); process.stdout.write(fs.readFileSync(item, 'utf8')); process.exit(0); }
if (argv[0] === 'clear') { fs.rmSync(item, { force: true }); process.exit(0); }
process.exit(2);
`;

/** Write one fake program with a node shebang and the executable bit, so a PATH lookup finds it. */
function writeProgram(bin: string, name: string, body: string): void {
  const path = join(bin, name);
  writeFileSync(path, `#!${process.execPath}\n${body}`);
  chmodSync(path, 0o755);
}

/** Two fake keychain programs in a temp bin folder, with the environment that reaches them. */
function fakeKeychain(): FakeKeychain {
  const bin = tempDir('bots-vault-bin-');
  const dir = tempDir('bots-vault-items-');
  writeProgram(bin, 'security', SECURITY_BODY);
  writeProgram(bin, 'secret-tool', SECRET_TOOL_BODY);
  return {
    bin,
    dir,
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, FAKE_KEYCHAIN_DIR: dir },
    log() {
      const path = join(dir, 'argv.log');
      if (!existsSync(path)) return [];
      return readFileSync(path, 'utf8')
        .split('\n')
        .filter((line) => line !== '')
        .map((line) => JSON.parse(line) as { program: string; argv: string[]; stdin: string });
    },
    mode(m: string) {
      writeFileSync(join(dir, 'mode'), m);
    },
  };
}

/** The macOS options that reach one fake keychain. */
function mac(k: FakeKeychain): SecretStoreOptions {
  return { env: k.env, platform: 'darwin' };
}

/** The Linux options that reach one fake keychain, with a bus address so secret-tool counts as present. */
function linux(k: FakeKeychain): SecretStoreOptions {
  return { env: { ...k.env, DBUS_SESSION_BUS_ADDRESS: 'unix:path=/fake-bus' }, platform: 'linux' };
}

/** A BOT.md declaring one secret name, so the parser is checked against the same grammar as the store. */
function botText(secrets: string): string {
  return `---\nid: pb-vault\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\nsecrets: ${JSON.stringify(secrets)}\n---\nPrint the names of your environment variables only.\n`;
}

/** The value of a successful result, throwing the reason so a failed case names what refused it. */
function valueOf<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(result.reason);
  return result.value;
}

/** The child script two racers run, so the lock is exercised across processes rather than inside one. */
function racerSource(): string {
  return [
    `import { existsSync } from 'node:fs';`,
    `import { setSecret } from ${JSON.stringify(join(R, 'lib', 'secrets.ts'))};`,
    `const [stateRoot, identity, name, value, barrier] = process.argv.slice(2);`,
    `const wait = new Int32Array(new SharedArrayBuffer(4));`,
    `while (!existsSync(barrier)) Atomics.wait(wait, 0, 0, 5);`,
    `const result = setSecret({ stateRoot, identity, name, value, store: 'file', setBy: 'racer' });`,
    `process.stdout.write(JSON.stringify({ ok: result.ok, finishedAt: performance.timeOrigin + performance.now() }) + '\\n');`,
    '',
  ].join('\n');
}

/** Run one racer child and read the JSON line it prints, so the caller learns when it finished. */
function runRacer(script: string, args: string[]): Promise<{ ok: boolean; finishedAt: number }> {
  return new Promise((settle, fail) => {
    const child = spawn(process.execPath, ['--import', 'tsx', script, ...args], { cwd: R });
    let out = '';
    let err = '';
    child.stdout.on('data', (chunk) => {
      out += String(chunk);
    });
    child.stderr.on('data', (chunk) => {
      err += String(chunk);
    });
    child.on('error', fail);
    child.on('close', (code) => {
      if (code !== 0) {
        fail(new Error(`racer exited ${code}: ${err}`));
        return;
      }
      const line = out.trim().split('\n').pop() ?? '{}';
      settle(JSON.parse(line) as { ok: boolean; finishedAt: number });
    });
  });
}

// ───────────────────────────────────────────────────────────────────
// CASES
// ───────────────────────────────────────────────────────────────────

describe('login keychain guard', () => {
  let shared: FakeKeychain;

  beforeAll(() => {
    shared = fakeKeychain();
  });

  // No case may reach the operator's login keychain, so every keychain case runs against this fake.
  it('finds the fake security first on PATH', () => {
    expect(hostKeychainProgram(mac(shared))?.path).toBe(join(shared.bin, 'security'));
  });
});

describe('secret names', () => {
  const accept = ['demo', 'a', '0', 'slack-app-token', 'a--b', 'demo-', 'a'.repeat(64)];
  const refuse = [
    ['a'.repeat(65), 'secret-name-invalid'],
    ['../etc/passwd', 'secret-name-invalid'],
    ['demo/x', 'secret-name-invalid'],
    ['-demo', 'secret-name-invalid'],
    ['Demo', 'secret-name-invalid'],
    ['demo_key', 'secret-name-invalid'],
    ['demo key', 'secret-name-invalid'],
    ['démo', 'secret-name-invalid'],
  ];

  it('walks the accept and refuse table', () => {
    for (const row of accept) {
      expect(isSecretName(row)).toBe(true);
      expect(parseDefinition(botText(row)).ok).toBe(true);
    }
    for (const [row, reason] of refuse) {
      expect(isSecretName(row)).toBe(false);
      expect(parseDefinition(botText(row))).toMatchObject({ ok: false, reason });
    }
    expect(parseDefinition(botText(''))).toMatchObject({ ok: false, reason: 'secrets-invalid' });
    expect(isSecretName('')).toBe(false);
  });

  it('maps each accepted name to its environment key and back', () => {
    expect(secretEnvKey('demo')).toBe('SKILLED_BOT_SECRET_DEMO');
    expect(secretEnvKey('slack-app-token')).toBe(SLACK_KEY);
    expect(secretEnvKey('a--b')).toBe('SKILLED_BOT_SECRET_A__B');
    expect(secretEnvKey('demo-')).toBe('SKILLED_BOT_SECRET_DEMO_');
    expect(secretEnvKey('0')).toBe('SKILLED_BOT_SECRET_0');
    for (const row of accept) expect(secretNameFromEnvKey(secretEnvKey(row))).toBe(row);
  });
});

describe('file backend', () => {
  it('stores lists resolves and forgets a value', () => {
    const k = fakeKeychain();
    const v = vault();
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, store: 'file', setBy: 'ada' });
    expect(valueOf(set)).toEqual({ backend: 'file', warning: null });
    expect(valueOf(readSecretsIndex(v.folder)).entries.demo?.backend).toBe('file');
    const rows = valueOf(listSecrets(v.root, v.identity));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: 'demo', backend: 'file' });
    expect(valueOf(resolveSecret(v.root, v.identity, 'demo'))).toBe(VALUE);
    expect(valueOf(knownSecretValues(v.root, v.identity)).get('vault:demo')).toBe(VALUE);
    const forgotten = forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...mac(k) });
    expect(valueOf(forgotten)).toEqual({ held: true, leftover: null });
    expect(valueOf(forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...mac(k) }))).toEqual({
      held: false,
      leftover: null,
    });
    expect(resolveSecret(v.root, v.identity, 'demo')).toEqual({
      ok: false,
      reason: 'secret-unknown',
      detail: 'demo is not stored, run bots secret set demo',
    });
  });

  it('keeps the folder 0700 and every file 0600', () => {
    const v = vault();
    chmodSync(v.folder, 0o755);
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, store: 'file', setBy: null });
    expect(valueOf(set).backend).toBe('file');
    expect(statSync(v.folder).mode & 0o777).toBe(0o700);
    expect(statSync(join(v.folder, 'index.json')).mode & 0o777).toBe(0o600);
    expect(statSync(join(v.folder, 'demo.value')).mode & 0o777).toBe(0o600);
  });

  it('refuses an empty and an over-long value', () => {
    const v = vault();
    const base = { stateRoot: v.root, identity: v.identity, name: 'demo', store: 'file' as const, setBy: null };
    expect(setSecret({ ...base, value: '   ' })).toMatchObject({ ok: false, reason: 'secret-empty' });
    expect(setSecret({ ...base, value: 'x'.repeat(16_385) })).toMatchObject({ ok: false, reason: 'secret-too-long' });
    expect(existsSync(join(v.folder, 'demo.value'))).toBe(false);
    expect(valueOf(setSecret({ ...base, value: 'x'.repeat(16_384) })).backend).toBe('file');
  });
});

describe('keychain backend', () => {
  it('stores the hex form through stdin and the argv log holds neither the value nor its hex form', () => {
    const k = fakeKeychain();
    const v = vault();
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: 'ada', ...mac(k) });
    expect(valueOf(set)).toEqual({ backend: 'keychain', warning: null });
    const calls = k.log();
    const write = calls.find((call) => call.argv[0] === '-q' && call.argv[1] === '-i');
    expect(write?.stdin.startsWith('add-generic-password -a demo@')).toBe(true);
    expect(write?.stdin).toContain(VALUE_HEX);
    for (const call of calls) {
      for (const arg of call.argv) {
        expect(arg).not.toContain(VALUE);
        expect(arg).not.toContain(VALUE_HEX);
      }
    }
    expect(valueOf(resolveSecret(v.root, v.identity, 'demo', mac(k)))).toBe(VALUE);
  });

  it('refuses a keychain line over the bound and spawns nothing', () => {
    const k = fakeKeychain();
    const v = vault();
    const account = keychainAccount('demo', v.folder);
    const prefix = `add-generic-password -a ${account} -s skilled-bots -U -w `;
    const prefixBytes = Buffer.byteLength(prefix, 'utf8');
    expect((KEYCHAIN_LINE_MAX_BYTES + 1 - prefixBytes) % 2).toBe(0);
    const longest = (KEYCHAIN_LINE_MAX_BYTES + 1 - prefixBytes) / 2;
    const base = { stateRoot: v.root, identity: v.identity, name: 'demo', setBy: null, ...mac(k) };
    expect(setSecret({ ...base, value: 'x'.repeat(longest) })).toMatchObject({ ok: false, reason: 'secret-too-long' });
    expect(k.log()).toEqual([]);
    expect(valueOf(setSecret({ ...base, value: 'x'.repeat(longest - 1) })).backend).toBe('keychain');
  });

  it('reports a dropped write', () => {
    const k = fakeKeychain();
    const v = vault();
    k.mode('dropped');
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...mac(k) });
    expect(set).toMatchObject({ ok: false, reason: 'secret-write-dropped' });
    expect(valueOf(readSecretsIndex(v.folder)).entries.demo).toBeUndefined();
  });

  it(
    'kills a keychain read that does not answer',
    () => {
      const k = fakeKeychain();
      const v = vault();
      valueOf(setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...mac(k) }));
      k.mode('sleep');
      const started = Date.now();
      const read = resolveSecret(v.root, v.identity, 'demo', mac(k));
      const elapsed = Date.now() - started;
      if (read.ok) throw new Error('expected a refusal');
      expect(read.reason).toBe('secret-store-unreadable');
      expect(read.detail).toContain('did not answer within 10 s');
      expect(elapsed).toBeLessThan(15_000);
    },
    20_000,
  );

  it('refuses an item not in hex form', () => {
    const k = fakeKeychain();
    const v = vault();
    k.mode('raw');
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...mac(k) });
    expect(set).toMatchObject({ ok: false, reason: 'secret-write-dropped' });
    k.mode('');
    valueOf(setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...mac(k) }));
    const item = join(k.dir, 'items', encodeURIComponent(keychainAccount('demo', v.folder)));
    writeFileSync(item, 'not hex at all');
    const read = resolveSecret(v.root, v.identity, 'demo', mac(k));
    if (read.ok) throw new Error('expected a refusal');
    expect(read.reason).toBe('secret-store-unreadable');
    expect(read.detail).toBe("keychain item for demo is not in the vault's form");
  });

  it('keychain forget removes the item and the entry', () => {
    const k = fakeKeychain();
    const v = vault();
    valueOf(setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...mac(k) }));
    const forgotten = forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...mac(k) });
    expect(valueOf(forgotten)).toEqual({ held: true, leftover: null });
    expect(readdirSync(join(k.dir, 'items'))).toEqual([]);
    expect(valueOf(readSecretsIndex(v.folder)).entries.demo).toBeUndefined();
    expect(valueOf(forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...mac(k) })).held).toBe(false);
  });

  it('account scope keeps two identities apart', () => {
    const k = fakeKeychain();
    const first = vault();
    const second = vault();
    const one = { name: 'demo', setBy: null, ...mac(k) };
    valueOf(setSecret({ ...one, stateRoot: first.root, identity: first.identity, value: 'first-value-11aa' }));
    valueOf(setSecret({ ...one, stateRoot: second.root, identity: second.identity, value: 'second-value-22bb' }));
    expect(readdirSync(join(k.dir, 'items'))).toHaveLength(2);
    valueOf(forgetSecret({ stateRoot: first.root, identity: first.identity, name: 'demo', ...mac(k) }));
    expect(valueOf(resolveSecret(second.root, second.identity, 'demo', mac(k)))).toBe('second-value-22bb');
  });

  it('set into the other backend keeps the new value when the old delete fails', () => {
    const k = fakeKeychain();
    const v = vault();
    valueOf(setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...mac(k) }));
    k.mode('delete-fails');
    const again = setSecret({
      stateRoot: v.root,
      identity: v.identity,
      name: 'demo',
      value: 'second-value-33cc',
      store: 'file',
      setBy: null,
      ...mac(k),
    });
    const result = valueOf(again);
    expect(result.backend).toBe('file');
    if (result.warning === null) throw new Error('expected a warning');
    expect(result.warning).toContain('the old keychain value was not removed');
    expect(valueOf(resolveSecret(v.root, v.identity, 'demo', mac(k)))).toBe('second-value-33cc');
  });

  it('stores through secret-tool on Linux', () => {
    const k = fakeKeychain();
    const v = vault();
    const account = keychainAccount('demo', v.folder);
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...linux(k) });
    expect(valueOf(set).backend).toBe('keychain');
    const store = k.log().find((call) => call.program === 'secret-tool' && call.argv[0] === 'store');
    expect(store?.argv).toEqual(['store', '--label', `skilled-bots ${account}`, 'service', 'skilled-bots', 'account', account]);
    expect(store?.stdin).toBe(VALUE_HEX);
    expect(valueOf(resolveSecret(v.root, v.identity, 'demo', linux(k)))).toBe(VALUE);
    const forgotten = forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...linux(k) });
    expect(valueOf(forgotten)).toEqual({ held: true, leftover: null });
  });
});

describe('index reader', () => {
  it('reads a malformed or newer index as unreadable', () => {
    const v = vault();
    writeFileSync(join(v.folder, 'index.json'), 'not json');
    expect(listSecrets(v.root, v.identity)).toMatchObject({ ok: false, reason: 'secret-store-unreadable' });
    expect(resolveSecret(v.root, v.identity, 'demo')).toMatchObject({ ok: false, reason: 'secret-store-unreadable' });
    expect(knownSecretValues(v.root, v.identity)).toMatchObject({ ok: false, reason: 'secret-store-unreadable' });
    writeFileSync(join(v.folder, 'index.json'), JSON.stringify({ schemaVersion: 2, entries: {} }));
    expect(listSecrets(v.root, v.identity)).toEqual({
      ok: false,
      reason: 'secret-store-unreadable',
      detail: 'index schemaVersion 2 is newer than this runtime reads',
    });
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, store: 'file', setBy: null });
    expect(set).toMatchObject({ ok: false, reason: 'secret-store-unreadable' });
  });

  it('keeps unknown keys and reads a missing setBy as null', () => {
    const v = vault();
    const at = new Date().toISOString();
    const index = { schemaVersion: 1, note: 'kept', entries: { demo: { backend: 'file', createdAt: at, updatedAt: at } } };
    writeFileSync(join(v.folder, 'index.json'), JSON.stringify(index));
    writeFileSync(join(v.folder, 'demo.value'), VALUE, { mode: 0o600 });
    expect(valueOf(readSecretsIndex(v.folder)).entries.demo?.setBy).toBeNull();
    const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'other', value: 'other-value-44dd', store: 'file', setBy: null });
    expect(valueOf(set).backend).toBe('file');
    const rewritten = JSON.parse(readFileSync(join(v.folder, 'index.json'), 'utf8')) as { note?: string };
    expect(rewritten.note).toBe('kept');
  });
});

describe('write rule', () => {
  it(
    'racing set on two names and on one name',
    async () => {
      const v = vault();
      const dir = tempDir('bots-vault-race-');
      const script = join(dir, 'racer.ts');
      writeFileSync(script, racerSource());

      const barrier = join(dir, 'barrier');
      const first = runRacer(script, [v.root, v.identity, 'one', 'value-one', barrier]);
      const second = runRacer(script, [v.root, v.identity, 'two', 'value-two', barrier]);
      writeFileSync(barrier, 'go');
      const [a, b] = await Promise.all([first, second]);
      expect(a.ok).toBe(true);
      expect(b.ok).toBe(true);
      expect(valueOf(listSecrets(v.root, v.identity)).map((row) => row.name)).toEqual(['one', 'two']);

      const sameBarrier = join(dir, 'barrier-same');
      const third = runRacer(script, [v.root, v.identity, 'same', 'value-from-first-racer', sameBarrier]);
      const fourth = runRacer(script, [v.root, v.identity, 'same', 'value-from-second-racer', sameBarrier]);
      writeFileSync(sameBarrier, 'go');
      const [c, d] = await Promise.all([third, fourth]);
      expect(c.ok).toBe(true);
      expect(d.ok).toBe(true);
      const winner = c.finishedAt > d.finishedAt ? 'value-from-first-racer' : 'value-from-second-racer';
      expect(valueOf(resolveSecret(v.root, v.identity, 'same'))).toBe(winner);
    },
    60_000,
  );

  it('set stopped after the value write leaves an orphan', () => {
    const k = fakeKeychain();
    const v = vault();
    writeFileSync(join(v.folder, 'demo.value'), VALUE, { mode: 0o600 });
    const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
    writeFileSync(join(v.folder, 'index.lock'), JSON.stringify({ pid: 999999, nonce: 'gone', createdAt: hourAgo }));
    writeFileSync(join(v.folder, '.demo.value.1.abcdef.tmp'), VALUE, { mode: 0o600 });
    expect(valueOf(listSecrets(v.root, v.identity))).toEqual([]);
    expect(resolveSecret(v.root, v.identity, 'demo')).toMatchObject({ ok: false, reason: 'secret-unknown' });
    const forgotten = forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...mac(k) });
    expect(valueOf(forgotten)).toEqual({ held: false, leftover: null });
    expect(existsSync(join(v.folder, 'demo.value'))).toBe(false);
    expect(existsSync(join(v.folder, '.demo.value.1.abcdef.tmp'))).toBe(false);
    expect(existsSync(join(v.folder, 'index.lock'))).toBe(false);
  });

  it('forget stopped after the index write leaves an orphan', () => {
    const k = fakeKeychain();
    const v = vault();
    valueOf(setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, store: 'file', setBy: null }));
    writeFileSync(join(v.folder, 'index.json'), JSON.stringify({ schemaVersion: 1, entries: {} }));
    expect(existsSync(join(v.folder, 'demo.value'))).toBe(true);
    expect(valueOf(listSecrets(v.root, v.identity))).toEqual([]);
    expect(resolveSecret(v.root, v.identity, 'demo')).toMatchObject({ ok: false, reason: 'secret-unknown' });
    valueOf(forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...mac(k) }));
    expect(existsSync(join(v.folder, 'demo.value'))).toBe(false);
  });

  it('forget removes an orphan the index does not name', () => {
    const k = fakeKeychain();
    const v = vault();
    writeFileSync(join(v.folder, 'demo.value'), VALUE, { mode: 0o600 });
    const forgotten = forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...mac(k) });
    expect(valueOf(forgotten).held).toBe(false);
    expect(existsSync(join(v.folder, 'demo.value'))).toBe(false);
  });
});

describe('known-secret map', () => {
  it('adds every stored value beside the environment rows', () => {
    const v = vault();
    const base = { stateRoot: v.root, identity: v.identity, store: 'file' as const, setBy: null };
    valueOf(setSecret({ ...base, name: 'one', value: 'first-stored-value-55ee' }));
    valueOf(setSecret({ ...base, name: 'two', value: 'second-stored-value-66ff' }));
    const known = valueOf(collectAllKnownSecrets({ SOME_TOKEN: 'environment-value-91ab' }, null, v.root, v.identity));
    expect(known.get('vault:one')).toBe('first-stored-value-55ee');
    expect(known.get('vault:two')).toBe('second-stored-value-66ff');
    expect(known.get('SOME_TOKEN')).toBe('environment-value-91ab');
    const withoutVault = collectAllKnownSecrets({ SOME_TOKEN: 'environment-value-91ab' }, null, v.root, null);
    expect([...valueOf(withoutVault).keys()]).toEqual(['SOME_TOKEN']);
  });

  it('refuses when the vault cannot be read', () => {
    const v = vault();
    writeFileSync(join(v.folder, 'index.json'), 'not json');
    const known = collectAllKnownSecrets({ SOME_TOKEN: 'environment-value-91ab' }, null, v.root, v.identity);
    expect(known).toMatchObject({ ok: false, reason: 'secret-store-unreadable' });
  });
});

describe('scratch keychain', () => {
  it.runIf(process.platform === 'darwin')(
    'round trips through a scratch keychain',
    () => {
      const v = vault();
      const path = join(tempDir('bots-vault-keychain-'), 'scratch.keychain-db');
      execFileSync('/usr/bin/security', ['create-keychain', '-p', 'scratch-pass', path]);
      const options: SecretStoreOptions = { env: { PATH: '/usr/bin:/bin' }, platform: 'darwin', keychainPath: path };
      const unlock = (): void => {
        execFileSync('/usr/bin/security', ['unlock-keychain', '-p', 'scratch-pass', path]);
      };
      try {
        unlock();
        const set = setSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', value: VALUE, setBy: null, ...options });
        expect(valueOf(set).backend).toBe('keychain');
        unlock();
        expect(valueOf(resolveSecret(v.root, v.identity, 'demo', options))).toBe(VALUE);
        unlock();
        const forgotten = forgetSecret({ stateRoot: v.root, identity: v.identity, name: 'demo', ...options });
        expect(valueOf(forgotten)).toEqual({ held: true, leftover: null });
      } finally {
        execFileSync('/usr/bin/security', ['delete-keychain', path]);
      }
    },
    60_000,
  );
});

// ───────────────────────────────────────────────────────────────────
// RUNNER CASES
// ───────────────────────────────────────────────────────────────────
//
// The store cases above pin the module on its own. These cases pin what a
// run does with it: one declared name reaches one child's environment, the
// record names the secret and never its value, a printed value is caught
// after the run and the delivery that would carry it is withheld.

import { vi } from 'vitest';

import { runAuditedExecutorCommand } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-audit.js';
import { parseExecutorConfig } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { exitCodeFor, runBot } from '../lib/runner.js';
import { readRunRecord } from '../lib/run-record.js';
import { botWorld, filesUnder, IDENTITY, stubRunCount, writeBot } from './runner-support.js';

import type { CommandBuilder } from '../lib/dispatch.js';
import type { DeliveryMessage, DeliverySenders, SendResult } from '../lib/delivery.js';
import type { RunRecord } from '../lib/run-record.js';
import type { BotWorld } from './runner-support.js';

/** A world whose vault holds the shared value under one name, so a run can declare it. */
function vaultWorld(): BotWorld {
  const world = botWorld();
  ensureIdentityState(world.stateRoot, IDENTITY);
  valueOf(setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'demo', value: VALUE, store: 'file', setBy: 'ada' }));
  return world;
}

/** A bot definition that declares one secret name, or none when the name is null. */
function vaultBot(id: string, secrets: string | null, extra = ''): string {
  return `---\nid: ${id}\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n${extra}${secrets === null ? '' : `secrets: ${secrets}\n`}---\nPrint the names of your environment variables only.\n`;
}

/** A child that runs one script, so a case pins exactly what the child prints. */
function child(script: string): CommandBuilder {
  return () => ({ command: process.execPath, args: ['-e', script] });
}

/** The record of one run, throwing the refusal so a failed case names what refused it. */
function recordOf(world: BotWorld, runId: string): RunRecord {
  const read = readRunRecord(world.stateRoot, IDENTITY, runId);
  if (!read.ok) throw new Error(read.reason);
  return read.value.record;
}

/** Every file in a run's folder, joined, so a case can assert a value reached none of them. */
function runFolderText(world: BotWorld, runId: string): string {
  return filesUnder(recordOf(world, runId).evidence.runFolder)
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
}

/** Collect what the runner writes to its own stderr, so a case reads the redacted copy. */
function captureStderr(): { text(): string; restore(): void } {
  const chunks: string[] = [];
  const spy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array): boolean => {
    chunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
    return true;
  });
  return { text: () => chunks.join(''), restore: () => spy.mockRestore() };
}

/** A stub desktop sender that records every message and answers as told. */
function stubSender(answer: () => SendResult) {
  const messages: DeliveryMessage[] = [];
  const senders: DeliverySenders = {
    desktop: (message) => {
      messages.push(message);
      return answer();
    },
  };
  return { messages, senders };
}

/** The audited runner input the gate cases share, with a state log and a working folder of their own. */
function gateBase() {
  const stateLogPath = join(tempDir('bots-vault-gate-'), 'state.jsonl');
  writeFileSync(stateLogPath, '');
  return {
    command: 'true',
    args: [],
    cwd: tempDir('bots-vault-gate-cwd-'),
    timeoutSeconds: 5,
    stateLogPath,
    executor: parseExecutorConfig({ kind: 'cli-codex', sandboxMode: 'read-only', timeoutSeconds: 60 }),
    iteration: 1,
    guardContext: { env: {}, ancestryCmdlines: [], statePaths: [] },
  };
}

describe('secret injection', () => {
  it(
    'injects the key and leaks no value',
    async () => {
      const world = vaultWorld();
      writeBot(world, 'pb-vault', vaultBot('pb-vault', 'demo'));
      const script = "const keys = Object.keys(process.env); process.stdout.write(keys.join('\\n') + '\\n'); process.stderr.write(keys.filter((k) => k.startsWith('SKILLED_BOT_SECRET_')).join('\\n') + '\\n'); const v = process.env.SKILLED_BOT_SECRET_DEMO; process.stdout.write('value-length-' + (v === undefined ? 'none' : String(v.length)) + '\\n');";
      const captured = captureStderr();
      try {
        const outcome = await runBot(world.input('pb-vault', { buildCommand: child(script) }));
        expect(outcome.kind).toBe('completed');
        const runId = outcome.runId as string;
        const record = recordOf(world, runId);
        const stdout = readFileSync(join(record.evidence.runFolder, 'stdout.log'), 'utf8');
        expect(stdout).toContain('SKILLED_BOT_SECRET_DEMO');
        expect(stdout).toContain('value-length-23');
        const folderText = runFolderText(world, runId);
        expect(folderText).not.toContain(VALUE);
        expect(folderText).not.toContain(VALUE_HEX);
        expect(record.posture.secretsUsed).toEqual(['demo']);
        expect(record.postRunCauses).toEqual([]);
        expect(captured.text()).toContain('SKILLED_BOT_SECRET_DEMO');
        expect(captured.text()).not.toContain(VALUE);
        expect(JSON.stringify(record)).not.toContain(VALUE);
      } finally {
        captured.restore();
      }
    },
    90_000,
  );
});

describe('secret injection keys', () => {
  it(
    'gives a hyphenated name its one key',
    async () => {
      const world = vaultWorld();
      valueOf(setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'slack-app-token', value: 'skilled-test-value-8b2c', store: 'file', setBy: 'ada' }));
      writeBot(world, 'pb-slack', vaultBot('pb-slack', 'slack-app-token'));
      const script = "process.stdout.write(Object.keys(process.env).filter((k) => k.startsWith('SKILLED_BOT_SECRET_')).join('\\n') + '\\n');";
      const outcome = await runBot(world.input('pb-slack', { buildCommand: child(script) }));
      expect(outcome.kind).toBe('completed');
      const stdout = readFileSync(join(recordOf(world, outcome.runId as string).evidence.runFolder, 'stdout.log'), 'utf8');
      expect(stdout.split('\n').filter((line) => line.startsWith('SKILLED_BOT_SECRET_'))).toEqual([SLACK_KEY]);
    },
    90_000,
  );
});

describe('secret refusals', () => {
  it(
    'refuses an unknown name before dispatch',
    async () => {
      const world = vaultWorld();
      writeBot(world, 'pb-absent', vaultBot('pb-absent', 'absent'));
      const outcome = await runBot(world.input('pb-absent'));
      expect(outcome).toMatchObject({ kind: 'refused', cause: 'secret-unknown', detail: 'absent is not stored, run bots secret set absent' });
      expect(exitCodeFor(outcome)).toBe(4);
      expect(stubRunCount(world)).toBe(0);
      expect(recordOf(world, outcome.runId as string).exit.refusal?.cause).toBe('secret-unknown');
    },
    90_000,
  );
});

describe('post-run scan', () => {
  it(
    'redacts the plain, hex, base64 and URL-encoded forms',
    async () => {
      const world = vaultWorld();
      const formsOf = (value: string): string[] => {
        const bytes = Buffer.from(value, 'utf8');
        const padded = bytes.toString('base64');
        return [value, bytes.toString('hex'), padded, padded.replace(/=+$/, ''), encodeURIComponent(value)];
      };
      const check = (runId: string, name: string, value: string): void => {
        const record = recordOf(world, runId);
        const stdout = readFileSync(join(record.evidence.runFolder, 'stdout.log'), 'utf8');
        expect(stdout).toContain(`[redacted: ${name}]`);
        for (const form of formsOf(value)) expect(stdout).not.toContain(form);
        const folderText = runFolderText(world, runId);
        expect(folderText).not.toContain(VALUE);
        expect(folderText).not.toContain(value);
        const causes = record.postRunCauses ?? [];
        expect(causes).toHaveLength(1);
        expect(causes[0]?.cause).toBe('secret-in-output');
        expect(causes[0]?.names).toContain(name);
      };

      writeBot(world, 'pb-forms', vaultBot('pb-forms', 'demo'));
      const plain = "const v = process.env.SKILLED_BOT_SECRET_DEMO; const b = Buffer.from(v); process.stdout.write([v, b.toString('hex'), b.toString('base64'), b.toString('base64').replace(/=+$/, '')].join('\\n') + '\\n');";
      const first = await runBot(world.input('pb-forms', { buildCommand: child(plain) }));
      check(first.runId as string, 'demo', VALUE);

      valueOf(setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'demo-url', value: 'skilled test/value 7f3a', store: 'file', setBy: 'ada' }));
      writeBot(world, 'pb-url', vaultBot('pb-url', 'demo-url'));
      const encoded = "process.stdout.write(encodeURIComponent(process.env.SKILLED_BOT_SECRET_DEMO_URL) + '\\n');";
      const second = await runBot(world.input('pb-url', { buildCommand: child(encoded) }));
      check(second.runId as string, 'demo-url', 'skilled test/value 7f3a');

      writeBot(world, 'pb-killed', vaultBot('pb-killed', 'demo'));
      const killed = "const v = process.env.SKILLED_BOT_SECRET_DEMO; process.stdout.write(v + '\\n'); process.kill(process.pid, 'SIGKILL');";
      const third = await runBot(world.input('pb-killed', { buildCommand: child(killed) }));
      check(third.runId as string, 'demo', VALUE);
    },
    90_000,
  );

  it(
    "redacts the child's stderr",
    async () => {
      const world = vaultWorld();
      writeBot(world, 'pb-stderr', vaultBot('pb-stderr', 'demo'));
      const script = "const v = process.env.SKILLED_BOT_SECRET_DEMO; process.stderr.write(v + '\\n'); process.stdout.write('done\\n');";
      const captured = captureStderr();
      try {
        const outcome = await runBot(world.input('pb-stderr', { buildCommand: child(script) }));
        expect(outcome.kind).toBe('completed');
        expect(captured.text()).toContain('[redacted: demo]');
        expect(captured.text()).not.toContain(VALUE);
        const record = recordOf(world, outcome.runId as string);
        expect(record.postRunCauses).toHaveLength(1);
        expect(record.postRunCauses?.[0]).toMatchObject({ cause: 'secret-in-output', names: ['demo'] });
      } finally {
        captured.restore();
      }
    },
    90_000,
  );

  it(
    'withholds the delivery and keeps the exit',
    async () => {
      const world = vaultWorld();
      const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
      const delivery = 'delivery: {targets: [desktop]}\n';
      const leak = "process.stdout.write(process.env.SKILLED_BOT_SECRET_DEMO + '\\n');";

      writeBot(world, 'leaky', vaultBot('leaky', 'demo', delivery));
      const completed = await runBot(world.input('leaky', { buildCommand: child(leak), senders }));
      expect(completed.kind).toBe('completed');
      expect(exitCodeFor(completed)).toBe(0);
      const completedRecord = recordOf(world, completed.runId as string);
      expect(completedRecord.delivery.length).toBeGreaterThan(0);
      for (const entry of completedRecord.delivery) {
        expect(entry.state).toBe('not-attempted');
        expect(entry.evidence).toBe('withheld: secret-in-output');
      }

      writeBot(world, 'leaky-fail', vaultBot('leaky-fail', 'demo', delivery));
      const failing = "process.stdout.write(process.env.SKILLED_BOT_SECRET_DEMO + '\\n'); process.exit(3);";
      const failed = await runBot(world.input('leaky-fail', { buildCommand: child(failing), senders }));
      expect(failed.kind).toBe('failed');
      expect(exitCodeFor(failed)).toBe(1);
      for (const entry of recordOf(world, failed.runId as string).delivery) {
        expect(entry.state).toBe('not-attempted');
        expect(entry.evidence).toBe('withheld: secret-in-output');
      }

      writeBot(world, 'leaky-ask', vaultBot('leaky-ask', 'demo', delivery));
      const asking = "process.stdout.write(process.env.SKILLED_BOT_SECRET_DEMO + '\\n[NEEDS-DECISION] Ship it?\\n');";
      const parked = await runBot(world.input('leaky-ask', { buildCommand: child(asking), senders }));
      expect(parked.kind).toBe('awaiting-decision');
      expect(exitCodeFor(parked)).toBe(5);
      expect(messages).toHaveLength(0);
    },
    90_000,
  );

  it(
    'redacts a JSON-escaped value in the stream, the run folder and the answer',
    async () => {
      const world = vaultWorld();
      const quoted = 'pa"ss\\word-1234-xyz';
      valueOf(setSecret({ stateRoot: world.stateRoot, identity: IDENTITY, name: 'demo-quoted', value: quoted, store: 'file', setBy: 'ada' }));
      writeBot(world, 'pb-json', '---\nid: pb-json\ntrigger: {kind: manual}\nruntime: {kind: cli-deepseek-harness}\nisolation: shared\nsecrets: demo-quoted\n---\nPrint the key.\n');
      const script = "const v = process.env.SKILLED_BOT_SECRET_DEMO_QUOTED; process.stdout.write(JSON.stringify({ type: 'final', text: 'the key is ' + v }) + '\\n');";
      const outcome = await runBot(world.input('pb-json', { buildCommand: child(script) }));
      expect(outcome.kind).toBe('completed');
      const answer = outcome.kind === 'completed' ? outcome.answer : null;
      expect(answer).not.toBeNull();
      expect(answer).not.toContain(quoted);
      expect(answer).toContain('[redacted: demo-quoted]');
      const escaped = JSON.stringify(quoted).slice(1, -1);
      const folderText = runFolderText(world, outcome.runId as string);
      expect(folderText).not.toContain(quoted);
      expect(folderText).not.toContain(escaped);
      const causes = recordOf(world, outcome.runId as string).postRunCauses ?? [];
      expect(causes.map((row) => row.cause)).toContain('secret-in-output');
      expect(causes.find((row) => row.cause === 'secret-in-output')?.names).toContain('demo-quoted');
    },
    90_000,
  );

  it(
    'redacts a unicode-escaped value in the decoded answer',
    async () => {
      const world = vaultWorld();
      writeBot(world, 'pb-unicode', '---\nid: pb-unicode\ntrigger: {kind: manual}\nruntime: {kind: cli-deepseek-harness}\nisolation: shared\nsecrets: demo\n---\nPrint the key.\n');
      const script = String.raw`const v = process.env.SKILLED_BOT_SECRET_DEMO; const esc = [...v].map((c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join(''); process.stdout.write('{"type":"final","text":"the key is ' + esc + '"}\n');`;
      const outcome = await runBot(world.input('pb-unicode', { buildCommand: child(script) }));
      expect(outcome.kind).toBe('completed');
      const record = recordOf(world, outcome.runId as string);
      const stdout = readFileSync(join(record.evidence.runFolder, 'stdout.log'), 'utf8');
      expect(stdout).toContain('\\u0073\\u006b');
      expect(stdout).not.toContain(VALUE);
      const answer = outcome.kind === 'completed' ? outcome.answer : null;
      expect(answer).not.toBeNull();
      expect(answer).not.toContain(VALUE);
      expect(answer).toContain('[redacted: demo]');
      const causes = record.postRunCauses ?? [];
      expect(causes).toHaveLength(1);
      expect(causes[0]).toMatchObject({ cause: 'secret-in-output', names: ['demo'] });
      expect(causes[0]?.detail).toContain('answer');
    },
    90_000,
  );
});

describe('vault boundary', () => {
  it(
    'same-user boundary lets an undeclared child read a value file',
    async () => {
      const world = vaultWorld();
      writeBot(world, 'no-secret', vaultBot('no-secret', null));
      // The boundary is the OS user: every bot child runs as the same user, so the grant is
      // enforced by not injecting a name, never by file permissions.
      const path = join(identityStatePaths(world.stateRoot, IDENTITY).secrets, 'demo.value');
      const script = `process.stdout.write('read-length-' + String(require('node:fs').readFileSync(${JSON.stringify(path)}, 'utf8').length) + '\\n');`;
      const outcome = await runBot(world.input('no-secret', { buildCommand: child(script) }));
      expect(outcome.kind).toBe('completed');
      const record = recordOf(world, outcome.runId as string);
      expect(readFileSync(join(record.evidence.runFolder, 'stdout.log'), 'utf8')).toContain('read-length-23');
      expect(record.posture.secretsUsed).toEqual([]);
    },
    90_000,
  );
});

describe('dispatch env gate', () => {
  it(
    'refuses an unnamed secret key',
    () => {
      expect(() =>
        runAuditedExecutorCommand({
          ...gateBase(),
          dispatchEnv: { SKILLED_BOT_SECRET_DEMO: 'x', SKILLED_BOT_SECRET_OTHER: 'y' },
          dispatchEnvKeys: ['SKILLED_BOT_SECRET_DEMO'],
        }),
      ).toThrow('dispatchEnv key SKILLED_BOT_SECRET_OTHER is not allowed for cli-codex');
      expect(() =>
        runAuditedExecutorCommand({ ...gateBase(), dispatchEnv: { SKILLED_BOT_SECRET_DEMO: 'x' }, dispatchEnvKeys: ['PATH'] }),
      ).toThrow('outside the bounded caller namespace');
    },
    90_000,
  );

  it(
    'carries apps and secrets together',
    async () => {
      expect(() =>
        runAuditedExecutorCommand({
          ...gateBase(),
          dispatchEnv: { UTCP_CONFIG_FILE: '/run/utcp.json', SKILLED_BOT_SECRET_DEMO: 'x' },
          dispatchEnvKeys: ['UTCP_CONFIG_FILE', 'SKILLED_BOT_SECRET_DEMO'],
        }),
      ).not.toThrow();

      const world = vaultWorld();
      writeBot(world, 'pb-both', vaultBot('pb-both', 'demo'));
      const script = "process.stdout.write((process.env.UTCP_CONFIG_FILE !== undefined && process.env.SKILLED_BOT_SECRET_DEMO !== undefined ? 'both-set' : 'missing') + '\\n');";
      const outcome = await runBot(world.input('pb-both', { buildCommand: child(script) }));
      expect(outcome.kind).toBe('completed');
      expect(readFileSync(join(recordOf(world, outcome.runId as string).evidence.runFolder, 'stdout.log'), 'utf8')).toContain('both-set');
    },
    90_000,
  );
});

// ───────────────────────────────────────────────────────────────────
// LEAK SURFACES, UNREADABLE VAULT AND THE CLI
// ───────────────────────────────────────────────────────────────────
//
// The cases above pin the store and the run. These pin the three places a
// value must never reach, a prompt, an answer and a delivery message, then
// what every check does when the index cannot be read, then what the
// operator's own verb prints. Every CLI case runs against a temp checkout
// whose config pins its own state root, so no case reads or writes the
// operator's real state.

import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

import { resolveActor } from '../lib/actor.js';
import { answerItem } from '../lib/answer.js';
import { deliverRecord } from '../lib/delivery.js';
import { writeNeedsYouItem } from '../lib/needs-you.js';
import { writeRunRecord } from '../lib/run-record.js';
import { approveBots, BOTS_CLI } from './runner-support.js';
import { writeItem } from './queue-support.js';

/** A temp checkout whose config pins its own state root, so no CLI case reads the operator's state. */
function cliFixture(): { root: string; state: string } {
  const root = tempDir('bots-vault-cli-');
  execFileSync('git', ['init', '-q', root], { stdio: 'ignore' });
  mkdirSync(join(root, 'bots'), { recursive: true });
  writeFileSync(join(root, 'bots', 'config.json'), JSON.stringify({ identity: 'skilled-scratch/vault', stateRoot: join(root, 'state') }));
  return { root, state: join(root, 'state', 'skilled-scratch%2Fvault') };
}

/** The one fake keychain a fixture's CLI calls share, so a forget sees the item its set wrote. */
const FIXTURE_KEYCHAINS = new WeakMap<object, FakeKeychain>();

/** The fake keychain of one fixture, made on its first CLI call. */
function fixtureKeychain(fixture: object): FakeKeychain {
  const made = FIXTURE_KEYCHAINS.get(fixture);
  if (made !== undefined) return made;
  const fresh = fakeKeychain();
  FIXTURE_KEYCHAINS.set(fixture, fresh);
  return fresh;
}

/** Run one secret verb as its own process. The bot-run markers are dropped because the verb refuses a write inside a bot run. The fake keychain is first on PATH so a forget's sweep never reaches the login keychain. */
function secretCli(
  fixture: { root: string; state: string },
  args: string[],
  input = '',
  extraEnv: NodeJS.ProcessEnv = {},
): { status: number | null; stdout: string; stderr: string } {
  const k = fixtureKeychain(fixture);
  const env: NodeJS.ProcessEnv = { ...process.env };
  delete env.AI_SESSION_CHILD;
  delete env.SKILLED_BOT_RUN_ID;
  env.PATH = `${k.bin}:${process.env.PATH}`;
  env.FAKE_KEYCHAIN_DIR = k.dir;
  Object.assign(env, extraEnv);
  const run = spawnSync(process.execPath, [BOTS_CLI, 'secret', ...args, '--repo', fixture.root], {
    cwd: fixture.root,
    encoding: 'utf8',
    timeout: 60_000,
    input,
    env,
  });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

/** The index of one secrets folder, parsed as the loose shape a case reads a field from. */
function readIndex(folder: string): { schemaVersion: number; entries: Record<string, Record<string, unknown>> } {
  return JSON.parse(readFileSync(join(folder, 'index.json'), 'utf8')) as { schemaVersion: number; entries: Record<string, Record<string, unknown>> };
}

describe('leak surfaces', () => {
  it(
    'refuses a stored value in a body and a request prompt',
    async () => {
      const world = vaultWorld();
      writeBot(world, 'pb-body', `---\nid: pb-body\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nUse ${VALUE} to reach the API.\n`);
      const body = await runBot(world.input('pb-body'));
      expect(body).toMatchObject({ kind: 'refused', cause: 'body-secret', detail: expect.stringContaining('vault:demo') });

      writeBot(world, 'pb-clean', vaultBot('pb-clean', null));
      approveBots(world);
      const queued = await runBot(
        world.input('pb-clean', { request: { kind: 'queued', requestId: 'rq-1', source: 'test', firedSlot: null, prompt: `use ${VALUE}` } }),
      );
      expect(queued).toMatchObject({
        kind: 'refused',
        cause: 'body-secret',
        detail: expect.stringContaining('request prompt holds a literal of key vault:demo'),
      });
    },
    90_000,
  );

  it(
    'refuses a stored value in a resumed question or answer',
    async () => {
      const world = vaultWorld();
      approveBots(world);

      const answered = writeItem(world, 'manual-ok', { answer: `use ${VALUE}` });
      const resumedAnswer = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'rq-answer', itemId: answered.id } }));
      expect(resumedAnswer).toMatchObject({
        kind: 'refused',
        cause: 'body-secret',
        detail: expect.stringContaining('answer holds a literal of key vault:demo'),
      });

      const asked = writeItem(world, 'manual-ok', { answer: 'merge' });
      expect(writeNeedsYouItem(world.stateRoot, { ...asked, question: `use ${VALUE}` }).ok).toBe(true);
      const resumedQuestion = await runBot(world.input('manual-ok', { request: { kind: 'resume', requestId: 'rq-question', itemId: asked.id } }));
      expect(resumedQuestion).toMatchObject({
        kind: 'refused',
        cause: 'body-secret',
        detail: expect.stringContaining('question holds a literal of key vault:demo'),
      });
    },
    90_000,
  );

  it(
    'refuses a stored value in an operator answer',
    async () => {
      const world = vaultWorld();
      writeBot(world, 'pb-ask', vaultBot('pb-ask', null));
      const parked = await runBot(world.input('pb-ask', { buildCommand: child("process.stdout.write('[NEEDS-DECISION] Ship it?\\n');") }));
      expect(parked.kind).toBe('awaiting-decision');
      const itemId = parked.kind === 'awaiting-decision' ? parked.itemId : '';

      const answered = answerItem({ checkoutRoot: world.checkoutRoot, itemId, text: `use ${VALUE}`, env: world.env, surface: 'terminal' });
      expect(answered).toMatchObject({ ok: false, reason: 'answer-secret' });
    },
    90_000,
  );

  it(
    'withholds a delivery message that holds a stored value',
    async () => {
      const world = vaultWorld();
      const { messages, senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
      writeBot(world, 'pb-notice', vaultBot('pb-notice', null, 'delivery: {targets: [desktop]}\n'));
      const outcome = await runBot(world.input('pb-notice', { senders }));
      expect(outcome.kind).toBe('completed');
      const runId = outcome.runId as string;
      expect(messages).toHaveLength(1);

      // The notice names a needs-you question, so the item is the one place a value could reach the body.
      const item = writeItem(world, 'pb-notice');
      expect(writeNeedsYouItem(world.stateRoot, { ...item, question: `use ${VALUE}` }).ok).toBe(true);
      const record = recordOf(world, runId);
      const queued = { ...record, delivery: [{ channel: 'desktop', target: 'desktop', state: 'queued' as const, evidence: null, itemId: item.id }] };
      expect(writeRunRecord(world.stateRoot, queued).ok).toBe(true);

      const delivered = deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId, senders, env: world.env });
      expect(delivered.ok).toBe(true);
      const entry = recordOf(world, runId).delivery[0];
      expect(entry?.state).toBe('not-attempted');
      expect(entry?.evidence?.startsWith('withheld: the message holds a literal of key vault:demo')).toBe(true);
      expect(messages).toHaveLength(1);
    },
    90_000,
  );
});

describe('unreadable vault', () => {
  it(
    'fails every check closed',
    async () => {
      const world = vaultWorld();
      // The parked item and the queued delivery are written while the index still reads, so each check has something to refuse.
      writeBot(world, 'pb-ask', vaultBot('pb-ask', null));
      const parked = await runBot(world.input('pb-ask', { buildCommand: child("process.stdout.write('[NEEDS-DECISION] Ship it?\\n');") }));
      expect(parked.kind).toBe('awaiting-decision');
      const itemId = parked.kind === 'awaiting-decision' ? parked.itemId : '';

      const { senders } = stubSender(() => ({ outcome: 'attempted', evidence: null }));
      writeBot(world, 'pb-notice', vaultBot('pb-notice', null, 'delivery: {targets: [desktop]}\n'));
      const completed = await runBot(world.input('pb-notice', { senders }));
      expect(completed.kind).toBe('completed');
      const runId = completed.runId as string;
      const record = recordOf(world, runId);
      // A target the run's own notice did not use, so no earlier claim answers for this send.
      const queued = { ...record, delivery: [{ channel: 'desktop', target: 'desktop:later', state: 'queued' as const, evidence: null }] };
      expect(writeRunRecord(world.stateRoot, queued).ok).toBe(true);

      writeBot(world, 'pb-plain', vaultBot('pb-plain', null));
      writeBot(world, 'pb-secret', vaultBot('pb-secret', 'demo'));
      writeFileSync(join(identityStatePaths(world.stateRoot, IDENTITY).secrets, 'index.json'), 'not json');

      const plain = await runBot(world.input('pb-plain'));
      expect(plain).toMatchObject({ kind: 'refused', cause: 'secret-store-unreadable' });
      expect(exitCodeFor(plain)).toBe(4);
      const secret = await runBot(world.input('pb-secret'));
      expect(secret).toMatchObject({ kind: 'refused', cause: 'secret-store-unreadable' });
      expect(exitCodeFor(secret)).toBe(4);

      expect(answerItem({ checkoutRoot: world.checkoutRoot, itemId, text: 'merge', env: world.env, surface: 'terminal' })).toMatchObject({
        ok: false,
        reason: 'secret-store-unreadable',
      });

      const delivered = deliverRecord({ stateRoot: world.stateRoot, identity: IDENTITY, runId, senders, env: world.env });
      expect(delivered.ok).toBe(true);
      const entry = recordOf(world, runId).delivery[0];
      expect(entry?.state).toBe('not-attempted');
      expect(entry?.evidence).toBe('withheld: secret-store-unreadable');
    },
    90_000,
  );

  it(
    'refuses a newer index on a run and on the verb',
    async () => {
      const fixture = cliFixture();
      mkdirSync(join(fixture.state, 'secrets'), { recursive: true });
      writeFileSync(join(fixture.state, 'secrets', 'index.json'), JSON.stringify({ schemaVersion: 2, entries: {} }));
      const newer = secretCli(fixture, ['list']);
      expect(newer.status).toBe(4);
      expect(newer.stderr.startsWith('bots: secret-store-unreadable:')).toBe(true);

      writeFileSync(join(fixture.state, 'secrets', 'index.json'), 'not json');
      const broken = secretCli(fixture, ['list']);
      expect(broken.status).toBe(4);
      expect(broken.stderr.startsWith('bots: secret-store-unreadable:')).toBe(true);

      const world = vaultWorld();
      writeBot(world, 'pb-newer', vaultBot('pb-newer', null));
      writeFileSync(join(identityStatePaths(world.stateRoot, IDENTITY).secrets, 'index.json'), JSON.stringify({ schemaVersion: 2, entries: {} }));
      const refused = await runBot(world.input('pb-newer'));
      expect(refused).toMatchObject({ kind: 'refused', cause: 'secret-store-unreadable' });
      expect(exitCodeFor(refused)).toBe(4);
    },
    90_000,
  );
});

describe('secret verb', () => {
  it(
    'sets lists and forgets through the CLI',
    () => {
      const fixture = cliFixture();
      const folder = join(fixture.state, 'secrets');

      const set = secretCli(fixture, ['set', 'demo', '--store', 'file'], `${VALUE}\n`);
      expect(set.status).toBe(0);
      expect(set.stdout).toBe('bots: secret demo stored (file)\n');
      expect(set.stdout).not.toContain(VALUE);
      expect(set.stderr).not.toContain(VALUE);
      expect(readIndex(folder).entries.demo?.backend).toBe('file');
      expect(statSync(join(folder, 'demo.value')).mode & 0o777).toBe(0o600);
      expect(statSync(folder).mode & 0o777).toBe(0o700);

      const list = secretCli(fixture, ['list']);
      expect(list.status).toBe(0);
      const rows = list.stdout.split('\n').filter((line) => line !== '');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatch(/^demo file \S+ \S+$/);
      expect(list.stdout).not.toContain(VALUE);

      const forgotten = secretCli(fixture, ['forget', 'demo']);
      expect(forgotten.status).toBe(0);
      expect(forgotten.stdout).toBe('bots: secret demo forgotten\n');
      const again = secretCli(fixture, ['forget', 'demo']);
      expect(again.status).toBe(0);
      expect(again.stdout).toBe('bots: secret demo was not held\n');
      expect(secretCli(fixture, ['list']).stdout).toBe('bots: no secrets stored\n');

      const noInput = secretCli(fixture, ['set', 'demo', '--store', 'file'], '');
      expect(noInput.status).toBe(2);
      expect(noInput.stderr).toContain('secret-no-input');

      const empty = secretCli(fixture, ['set', 'demo', '--store', 'file'], '\n');
      expect(empty.status).toBe(2);
      expect(empty.stderr).toContain('secret-empty');
      expect(existsSync(join(folder, 'demo.value'))).toBe(false);

      const cased = secretCli(fixture, ['set', 'Demo']);
      expect(cased.status).toBe(2);
      expect(cased.stderr).toContain('secret-name-invalid');
      const blank = secretCli(fixture, ['set', '']);
      expect(blank.status).toBe(2);
      expect(blank.stderr).toContain('secret-name-invalid');

      const storeOnForget = secretCli(fixture, ['forget', 'demo', '--store', 'file']);
      expect(storeOnForget.status).toBe(2);
      expect(storeOnForget.stderr).toContain('secret forget takes no --store');

      const valueOption = secretCli(fixture, ['set', 'demo', '--value', 'x']);
      expect(valueOption.status).toBe(2);
      expect(valueOption.stderr).toContain('unknown option: --value');

      const tooLong = secretCli(fixture, ['set', 'demo'], 'x'.repeat(70_000));
      expect(tooLong.status).toBe(2);
      expect(tooLong.stderr).toContain('secret-too-long');
    },
    90_000,
  );

  it.runIf(process.platform === 'darwin')(
    'stores in the keychain by default on macOS',
    () => {
      const fixture = cliFixture();
      const k = fixtureKeychain(fixture);
      const set = secretCli(fixture, ['set', 'demo'], `${VALUE}\n`);
      expect(set.status).toBe(0);
      expect(set.stdout).toBe('bots: secret demo stored (keychain)\n');
      expect(readdirSync(join(k.dir, 'items'))).toHaveLength(1);

      const forgotten = secretCli(fixture, ['forget', 'demo']);
      expect(forgotten.status).toBe(0);
      expect(readdirSync(join(k.dir, 'items'))).toEqual([]);
    },
    90_000,
  );

  it(
    'refuses a write inside a bot run',
    () => {
      const fixture = cliFixture();
      const refused = secretCli(fixture, ['set', 'demo', '--store', 'file'], `${VALUE}\n`, { AI_SESSION_CHILD: '1' });
      expect(refused.status).toBe(2);
      expect(refused.stderr).toContain('child-write-refused');
      expect(secretCli(fixture, ['list'], '', { AI_SESSION_CHILD: '1' }).status).toBe(0);
    },
    90_000,
  );
});

describe('secret index', () => {
  it(
    'records the actor and keeps it out of list',
    () => {
      const fixture = cliFixture();
      const folder = join(fixture.state, 'secrets');
      expect(secretCli(fixture, ['set', 'demo', '--store', 'file'], `${VALUE}\n`).status).toBe(0);

      const actor = resolveActor({ as: null, env: process.env, scheduled: false });
      expect(actor.ok).toBe(true);
      expect(readIndex(folder).entries.demo?.setBy).toBe(actor.ok ? actor.value : null);

      const list = secretCli(fixture, ['list']);
      expect(list.status).toBe(0);
      const line = list.stdout.split('\n').find((row) => row.startsWith('demo ')) ?? '';
      expect(line.split(' ')).toHaveLength(4);

      // A row written before the field existed reads as no actor rather than as damage.
      const at = new Date().toISOString();
      const index = readIndex(folder);
      index.entries.old = { backend: 'file', createdAt: at, updatedAt: at };
      writeFileSync(join(folder, 'index.json'), JSON.stringify(index));
      const read = readSecretsIndex(folder);
      expect(read.ok).toBe(true);
      expect(read.ok ? read.value.entries.old?.setBy : 'refused').toBeNull();
    },
    90_000,
  );
});
