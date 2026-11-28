// ───────────────────────────────────────────────────────────────────
// MODULE: Vault Store (named secrets for one bot)
// ───────────────────────────────────────────────────────────────────
//
// This is the only module that reads or writes a stored value. A value
// lives in the OS keychain or in a 0600 file under the identity's secrets
// folder, and the index beside it records which backend holds each name,
// when it last changed and who set it. Nothing this module returns carries
// a value except resolveSecret and knownSecretValues, so a listing, a
// refusal and a warning are all safe to print, log or deliver.
//
// A set writes the value, reads it back and only then records it, so an
// index row never claims a value the backend did not keep. A forget drops
// the row first and the value second, so a crash between the two leaves a
// value with no row, which the next set or forget of that name removes.
// Both hold the folder's lock, because two writers racing on one index
// would otherwise lose a row.

import { spawnSync } from 'node:child_process';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import {
  accessSync,
  chmodSync,
  closeSync,
  constants,
  linkSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
  writeSync,
} from 'node:fs';
import { join } from 'node:path';

import { identityStatePaths, STATE_DIR_MODE, STATE_FILE_MODE } from './state-root.js';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The name grammar a stored secret must match, so a name is safe as a file name and an environment key. */
export const SECRET_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

/** The longest secret name, so a name stays readable in a listing and in an environment key. */
export const SECRET_NAME_MAX = 64;

/** The prefix every injected secret key carries, so a child can tell a secret from any other variable. */
export const SECRET_ENV_PREFIX = 'SKILLED_BOT_SECRET_';

/** The longest value a store accepts, counted in code points so a multi-byte character counts once. */
export const SECRET_VALUE_MAX_CODE_POINTS = 16_384;

/** The keychain service every item is filed under, so one listing finds every bot secret. */
export const KEYCHAIN_SERVICE = 'skilled-bots';

/** How long one keychain program may run before it is killed, so a hung prompt never wedges a set. */
export const KEYCHAIN_TIMEOUT_MS = 10_000;

/** The longest line the macOS keychain accepts on stdin, refused before the spawn. */
export const KEYCHAIN_LINE_MAX_BYTES = 4095;

/** Where one stored value lives. */
export type SecretBackend = 'keychain' | 'file';

/** Where the environment and the platform come from, and the scratch keychain only tests pass. */
export interface SecretStoreOptions {
  /** Where PATH and DBUS_SESSION_BUS_ADDRESS are read and the environment keychain programs run with. */
  env?: NodeJS.ProcessEnv;
  /** The host platform, defaulting to the running one. */
  platform?: NodeJS.Platform;
  /** A scratch keychain file only tests pass, never the CLI. */
  keychainPath?: string;
}

/** The keychain program a host offers. */
export interface KeychainProgram {
  kind: 'security' | 'secret-tool';
  path: string;
}

/** One index row: which backend holds the value and when it last changed. */
export interface SecretsIndexEntry {
  backend: SecretBackend;
  createdAt: string;
  updatedAt: string;
  setBy: string | null;
  [key: string]: unknown;
}

/** The index file, the one record of which names exist and where each value lives. */
export interface SecretsIndex {
  schemaVersion: 1;
  entries: Record<string, SecretsIndexEntry>;
  [key: string]: unknown;
}

/** One row of a listing, carrying no value. */
export interface SecretListing {
  name: string;
  backend: SecretBackend;
  createdAt: string;
  updatedAt: string;
  setBy: string | null;
}

/** Everything a set needs: where the store is, which name, and the value read from the prompt. */
export interface SetSecretInput extends SecretStoreOptions {
  stateRoot: string;
  identity: string;
  name: string;
  value: string;
  store?: SecretBackend;
  setBy: string | null;
  now?: Date;
}

/** What a set stored and whether an old value of the other backend survived. */
export interface SetSecretResult {
  backend: SecretBackend;
  warning: string | null;
}

/** Everything a forget needs. */
export interface ForgetSecretInput extends SecretStoreOptions {
  stateRoot: string;
  identity: string;
  name: string;
}

/** Whether the index held the name and which backend refused to drop its value. */
export interface ForgetSecretResult {
  held: boolean;
  leftover: { backend: SecretBackend; reason: string } | null;
}

/** A set holds the lock for milliseconds, so a lock older than this has no live owner. */
const LOCK_STALE_MS = 60_000;

/** How long a waiting writer pauses between attempts. */
const LOCK_POLL_MS = 25;

/** The index file name inside the secrets folder. */
const INDEX_FILE = 'index.json';

/** A refusal for a name outside the grammar, which never reaches a backend. */
function nameInvalid(name: string): { ok: false; reason: string; detail: string } {
  return { ok: false, reason: 'secret-name-invalid', detail: name };
}

/** A refusal for an empty value, so a blank prompt line never overwrites a working key. */
function emptyValue(name: string): { ok: false; reason: string; detail: string } {
  return { ok: false, reason: 'secret-empty', detail: `${name} holds no value` };
}

/** A refusal for a value past the length bound, which no backend is asked to hold. */
function tooLong(detail: string): { ok: false; reason: string; detail: string } {
  return { ok: false, reason: 'secret-too-long', detail };
}

/** A refusal for a keychain request on a host with no keychain program. */
function keychainUnavailable(): { ok: false; reason: string; detail: string } {
  return { ok: false, reason: 'secret-keychain-unavailable', detail: 'no keychain program on this host' };
}

/** A refusal for a write the backend did not keep, so the index is never told otherwise. */
function dropped(detail: string): { ok: false; reason: string; detail: string } {
  return { ok: false, reason: 'secret-write-dropped', detail };
}

/** A refusal for a store that cannot be read, which is never read as empty. */
function unreadable(detail: string): { ok: false; reason: string; detail: string } {
  return { ok: false, reason: 'secret-store-unreadable', detail };
}

/** A refusal for a name the store does not hold, naming the command that would store it. */
function unknownName(name: string): { ok: false; reason: string; detail: string } {
  return { ok: false, reason: 'secret-unknown', detail: `${name} is not stored, run bots secret set ${name}` };
}

// ───────────────────────────────────────────────────────────────────
// 2. NAMES AND KEYS
// ───────────────────────────────────────────────────────────────────

/**
 * Whether a name matches the grammar and the length bound.
 *
 * @returns True when the name is safe as a file name and as an environment key.
 */
export function isSecretName(name: string): boolean {
  return SECRET_NAME_PATTERN.test(name) && name.length <= SECRET_NAME_MAX;
}

/**
 * The environment key one secret is injected under.
 *
 * @returns The prefix plus the upper-cased name with every hyphen turned into an underscore.
 */
export function secretEnvKey(name: string): string {
  return SECRET_ENV_PREFIX + name.toUpperCase().replace(/-/g, '_');
}

/**
 * The secret name an environment key names.
 *
 * @returns The name, or null when the key is not one this runtime would inject.
 */
export function secretNameFromEnvKey(key: string): string | null {
  if (!key.startsWith(SECRET_ENV_PREFIX)) return null;
  const name = key.slice(SECRET_ENV_PREFIX.length).toLowerCase().replace(/_/g, '-');
  return isSecretName(name) && secretEnvKey(name) === key ? name : null;
}

/**
 * The keychain account one name is filed under.
 *
 * The scope comes from the real path of the secrets folder, so two spellings of
 * one folder agree and a moved state root reads no other root's item.
 *
 * @returns The account string `<name>@<scope>`.
 */
export function keychainAccount(name: string, secretsFolder: string): string {
  const scope = createHash('sha256').update(realpathSync(secretsFolder)).digest('hex').slice(0, 12);
  return `${name}@${scope}`;
}

/**
 * The keychain program this host offers.
 *
 * @returns The program and its path, or null when the host has none.
 */
export function hostKeychainProgram(options: SecretStoreOptions = {}): KeychainProgram | null {
  const env = options.env ?? process.env;
  const platform = options.platform ?? process.platform;
  const folders = (env.PATH ?? '').split(':').filter((folder) => folder !== '');
  if (platform === 'darwin') {
    const path = resolveProgram(folders, 'security');
    return path === null ? null : { kind: 'security', path };
  }
  if (platform === 'linux') {
    const path = resolveProgram(folders, 'secret-tool');
    const bus = env.DBUS_SESSION_BUS_ADDRESS;
    if (path === null || typeof bus !== 'string' || bus === '') return null;
    return { kind: 'secret-tool', path };
  }
  return null;
}

/** The first PATH folder holding an executable of that name, or null when none does. */
function resolveProgram(folders: readonly string[], name: string): string | null {
  for (const folder of folders) {
    const path = join(folder, name);
    try {
      if (statSync(path).isFile()) {
        accessSync(path, constants.X_OK);
        return path;
      }
    } catch {
      // A folder this user cannot read holds no program this host can run.
    }
  }
  return null;
}

/** The secrets folder of one identity, the only place a file-backed value lives. */
function secretsFolderOf(stateRoot: string, identity: string): string {
  return identityStatePaths(stateRoot, identity).secrets;
}

// ───────────────────────────────────────────────────────────────────
// 3. INDEX
// ───────────────────────────────────────────────────────────────────

/**
 * Read the index, treating a missing file as an empty one and any damage as a refusal.
 *
 * @returns The index, or a refusal naming the first thing that did not read.
 */
export function readSecretsIndex(secretsFolder: string): Result<SecretsIndex> {
  const path = join(secretsFolder, INDEX_FILE);
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    const code = errorCode(error);
    if (code === 'ENOENT') return { ok: true, value: { schemaVersion: 1, entries: {} } };
    return unreadable(`index unreadable: ${code}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return unreadable('index-invalid: not JSON');
  }
  if (!isPlainObject(parsed)) return unreadable('index-invalid: not JSON');

  const version = parsed.schemaVersion;
  if (typeof version !== 'number' || !Number.isInteger(version)) return unreadable('index-invalid: schemaVersion');
  if (version > 1) return unreadable(`index schemaVersion ${version} is newer than this runtime reads`);
  if (version < 1) return unreadable('index-invalid: schemaVersion');

  const rawEntries = parsed.entries;
  if (!isPlainObject(rawEntries)) return unreadable('index-invalid: entries');

  const entries: Record<string, SecretsIndexEntry> = {};
  for (const [name, raw] of Object.entries(rawEntries)) {
    if (!isSecretName(name)) return unreadable(`index-invalid: name ${name}`);
    if (!isPlainObject(raw)) return unreadable(`index-invalid: ${name}.backend`);
    const backend = raw.backend;
    if (backend !== 'keychain' && backend !== 'file') return unreadable(`index-invalid: ${name}.backend`);
    const createdAt = raw.createdAt;
    if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) {
      return unreadable(`index-invalid: ${name}.createdAt`);
    }
    const updatedAt = raw.updatedAt;
    if (typeof updatedAt !== 'string' || Number.isNaN(Date.parse(updatedAt))) {
      return unreadable(`index-invalid: ${name}.updatedAt`);
    }
    const setBy = raw.setBy ?? null;
    if (setBy !== null && typeof setBy !== 'string') return unreadable(`index-invalid: ${name}.setBy`);
    const entry: SecretsIndexEntry = { ...raw, backend, createdAt, updatedAt, setBy };
    entries[name] = entry;
  }

  const index: SecretsIndex = { ...parsed, schemaVersion: 1, entries };
  return { ok: true, value: index };
}

/** Write the index by temp file and rename, with its entries in name order so a diff reads cleanly. */
function writeSecretsIndex(folder: string, index: SecretsIndex): void {
  const entries: Record<string, SecretsIndexEntry> = {};
  for (const name of Object.keys(index.entries).sort()) entries[name] = index.entries[name];
  const text = `${JSON.stringify({ ...index, entries }, null, 2)}\n`;
  const temp = join(folder, `.index.json.${process.pid}.${randomBytes(6).toString('hex')}.tmp`);
  writeFileSync(temp, text, { flag: 'wx', mode: STATE_FILE_MODE });
  try {
    renameSync(temp, join(folder, INDEX_FILE));
  } catch (error: unknown) {
    rmSync(temp, { force: true });
    throw error;
  }
}

/** Make the secrets folder owner-only and narrow the index again, because a plain write keeps an old mode. */
function prepareFolder(folder: string): void {
  mkdirSync(folder, { recursive: true, mode: STATE_DIR_MODE });
  chmodSync(folder, STATE_DIR_MODE);
  try {
    chmodSync(join(folder, INDEX_FILE), STATE_FILE_MODE);
  } catch (error: unknown) {
    if (errorCode(error) !== 'ENOENT') throw error;
  }
}

/** Remove temp files a stopped writer left, which is safe only while the lock is held. */
function sweepTemps(folder: string): void {
  let names: string[];
  try {
    names = readdirSync(folder);
  } catch (error: unknown) {
    if (errorCode(error) === 'ENOENT') return;
    throw error;
  }
  for (const name of names) {
    if (!name.startsWith('.') || !name.endsWith('.tmp')) continue;
    const path = join(folder, name);
    try {
      if (!statSync(path).isFile()) continue;
      rmSync(path, { force: true });
    } catch (error: unknown) {
      if (errorCode(error) !== 'ENOENT') throw error;
    }
  }
}

/** The errno code of a thrown filesystem error, or a fixed phrase when it carries none. */
function errorCode(error: unknown): string {
  const code = (error as NodeJS.ErrnoException | null)?.code;
  return typeof code === 'string' ? code : 'unknown error';
}

/** Whether a parsed JSON value is an object rather than an array or a scalar. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ───────────────────────────────────────────────────────────────────
// 4. LOCK
// ───────────────────────────────────────────────────────────────────

/** The lock one writer holds on the index. */
interface IndexLock {
  path: string;
  nonce: string;
}

/** What a lock file holds, so a reclaimer can tell a live owner from a killed one. */
interface LockFile {
  pid: number;
  nonce: string;
  createdAt: string;
}

/**
 * Run one change to the index while holding the folder's lock.
 *
 * A live holder makes at most three keychain calls of at most ten seconds each,
 * so it always finishes inside the stale bound and a waiter can poll without a
 * deadline. A lock whose owner is gone or whose age is past that bound is
 * reclaimed by renaming it aside, so a killed writer never blocks the next one.
 */
function withIndexLock<T>(folder: string, work: () => T): T {
  const lock = acquireIndexLock(folder);
  try {
    return work();
  } finally {
    releaseIndexLock(lock);
  }
}

/** Take the folder's lock, polling while a live owner holds a fresh one. */
function acquireIndexLock(folder: string): IndexLock {
  const path = join(folder, 'index.lock');
  const nonce = randomBytes(16).toString('hex');
  for (;;) {
    let fd: number | null = null;
    try {
      fd = openSync(path, 'wx', 0o600);
    } catch (error: unknown) {
      if (errorCode(error) !== 'EEXIST') throw error;
    }
    if (fd !== null) {
      const body: LockFile = { pid: process.pid, nonce, createdAt: new Date().toISOString() };
      try {
        writeSync(fd, JSON.stringify(body));
      } finally {
        closeSync(fd);
      }
      chmodSync(path, 0o600);
      const mine = readLock(path);
      if (mine !== null && mine !== 'torn' && mine.nonce === nonce) return { path, nonce };
      // Another process won the race, so the loop decides again from the top.
      continue;
    }

    const held = readLock(path);
    if (held === null) continue;
    let stale = false;
    let staleNonce: string | null = null;
    if (held === 'torn') {
      let mtime: number;
      try {
        mtime = statSync(path).mtimeMs;
      } catch (error: unknown) {
        if (errorCode(error) === 'ENOENT') continue;
        throw error;
      }
      stale = Date.now() - mtime > LOCK_STALE_MS;
    } else {
      const born = Date.parse(held.createdAt);
      // An unparsable createdAt cannot prove a live owner, so it counts as stale.
      stale = !pidAlive(held.pid) || Number.isNaN(born) || Date.now() - born > LOCK_STALE_MS;
      staleNonce = held.nonce;
    }

    if (stale) {
      const aside = `${path}.${nonce}.stale`;
      try {
        renameSync(path, aside);
      } catch (error: unknown) {
        // Another reclaimer moved it first, so the loop reads the path again.
        if (errorCode(error) === 'ENOENT') continue;
        throw error;
      }
      // Only the process whose rename succeeded retries the create, and the re-read after the create decides who holds it.
      const moved = readLock(aside);
      if (moved !== null && moved !== 'torn' && moved.nonce !== staleNonce) {
        // A fresh lock was created between the read and the rename, so it goes back where its owner expects it.
        try {
          linkSync(aside, path);
        } catch (error: unknown) {
          if (errorCode(error) !== 'EEXIST') throw error;
        }
      }
      try {
        unlinkSync(aside);
      } catch (error: unknown) {
        if (errorCode(error) !== 'ENOENT') throw error;
      }
      continue;
    }

    pause(LOCK_POLL_MS);
  }
}

/** Release the lock, but only while it still carries this writer's nonce. */
function releaseIndexLock(lock: IndexLock): void {
  const held = readLock(lock.path);
  if (held === null || held === 'torn' || held.nonce !== lock.nonce) return;
  try {
    unlinkSync(lock.path);
  } catch (error: unknown) {
    if (errorCode(error) !== 'ENOENT') throw error;
  }
}

/**
 * Whether a process is still running. The probe sends no signal, so it never touches the process.
 *
 * @returns True when the pid exists, including one this user may not signal.
 */
function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    // A process this user may not signal still exists, so only a missing one reads as gone.
    return (error as NodeJS.ErrnoException | null)?.code === 'EPERM';
  }
}

/**
 * Read a lock file.
 *
 * @returns Null when the file is missing, `torn` when it exists but does not hold a lock, else its
 *   contents.
 */
function readLock(path: string): LockFile | null | 'torn' {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    if (errorCode(error) === 'ENOENT') return null;
    throw error;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return 'torn';
  }
  if (typeof parsed !== 'object' || parsed === null) return 'torn';
  const file = parsed as Partial<LockFile>;
  if (typeof file.pid !== 'number' || typeof file.nonce !== 'string' || typeof file.createdAt !== 'string') return 'torn';
  return { pid: file.pid, nonce: file.nonce, createdAt: file.createdAt };
}

/**
 * Wait without a busy loop. The wait blocks the thread and keeps every store verb synchronous, because
 * the CLI and the runner both depend on that.
 */
function pause(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// ───────────────────────────────────────────────────────────────────
// 5. BACKENDS
// ───────────────────────────────────────────────────────────────────

/** What a backend read found. */
type ReadOutcome = { kind: 'value'; value: string } | { kind: 'absent' } | { kind: 'error'; detail: string };

/** What a backend remove did. */
type RemoveOutcome = { kind: 'removed' } | { kind: 'absent' } | { kind: 'error'; reason: string };

/** One backend's four operations, so the store verbs never branch on where a value lives. */
interface BackendIo {
  checkValue(name: string, value: string): string | null;
  write(name: string, value: string): string | null;
  read(name: string): ReadOutcome;
  remove(name: string): RemoveOutcome;
}

/** The 0600 file backend, one file per name inside the identity's secrets folder. */
function fileBackend(folder: string): BackendIo {
  const valueFile = (name: string): string => join(folder, `${name}.value`);
  return {
    checkValue: () => null,
    write(name, value) {
      const temp = join(folder, `.${name}.value.${process.pid}.${randomBytes(6).toString('hex')}.tmp`);
      try {
        writeFileSync(temp, value, { flag: 'wx', mode: STATE_FILE_MODE });
        renameSync(temp, valueFile(name));
        return null;
      } catch (error: unknown) {
        try {
          rmSync(temp, { force: true });
        } catch {
          // A temp file that cannot be removed is swept by the next writer holding the lock.
        }
        return `secret file for ${name} not written: ${errorCode(error)}`;
      }
    },
    read(name) {
      try {
        return { kind: 'value', value: readFileSync(valueFile(name), 'utf8') };
      } catch (error: unknown) {
        const code = errorCode(error);
        if (code === 'ENOENT') return { kind: 'absent' };
        return { kind: 'error', detail: `secret file for ${name} unreadable: ${code}` };
      }
    },
    remove(name) {
      try {
        rmSync(valueFile(name));
        return { kind: 'removed' };
      } catch (error: unknown) {
        const code = errorCode(error);
        if (code === 'ENOENT') return { kind: 'absent' };
        return { kind: 'error', reason: code };
      }
    },
  };
}

/** The one detail a timed-out keychain call reports, so a locked keychain reads the same on every verb. */
const KEYCHAIN_TIMEOUT_DETAIL = 'keychain did not answer within 10 s, unlock it and try again';

/** What one keychain program run returned, with both streams captured and printed nowhere. */
interface KeychainRun {
  status: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}

/**
 * Run one keychain program with an argv array and no shell.
 *
 * The kill is the point of the timeout: a locked keychain waits for an unlock
 * dialog with no limit, so a run that outlives the bound is killed rather than
 * left to wedge the verb. Both streams are captured into memory and printed
 * nowhere, because a program can echo pieces of the value it was given.
 */
function runKeychain(path: string, args: readonly string[], input: string, options: SecretStoreOptions): KeychainRun {
  const run = spawnSync(path, args, {
    env: options.env ?? process.env,
    input,
    encoding: 'utf8',
    timeout: KEYCHAIN_TIMEOUT_MS,
    killSignal: 'SIGKILL',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024,
  });
  const error = run.error as NodeJS.ErrnoException | undefined;
  return {
    status: run.status,
    stdout: typeof run.stdout === 'string' ? run.stdout : '',
    stderr: typeof run.stderr === 'string' ? run.stderr : '',
    timedOut: error?.code === 'ETIMEDOUT' || run.signal === 'SIGKILL',
  };
}

/**
 * The password form the vault stores: the lowercase hex of the value's UTF-8 bytes.
 *
 * The macOS read prints a printable password as it is and any other as hex, so a
 * raw value that happens to be even-length hex text could not be told apart from
 * a hex-printed one. Storing hex text makes every read printable ASCII and leaves
 * the decode as the only rule.
 */
function hexForm(value: string): string {
  return Buffer.from(value, 'utf8').toString('hex');
}

/**
 * Decode one keychain read back into the value it holds.
 *
 * @returns The value, or an error naming an item the vault did not write.
 */
function decodeHex(name: string, stdout: string): ReadOutcome {
  const rest = stdout.endsWith('\n') ? stdout.slice(0, -1) : stdout;
  if (!/^([0-9a-f]{2})+$/.test(rest)) {
    return { kind: 'error', detail: `keychain item for ${name} is not in the vault's form` };
  }
  return { kind: 'value', value: Buffer.from(rest, 'hex').toString('utf8') };
}

/**
 * The one command line the macOS program reads on stdin.
 *
 * The value travels here and nowhere else, so no argv of any spawn holds it. A
 * test keychain path is appended as the last argument, quoted, and counts toward
 * the line bound.
 */
function writeLine(account: string, hex: string, keychainPath?: string): string {
  const line = `add-generic-password -a ${account} -s ${KEYCHAIN_SERVICE} -U -w ${hex}`;
  if (keychainPath === undefined) return line;
  return `${line} "${keychainPath.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/** The macOS keychain, one item per name under the shared service. */
function securityBackend(path: string, folder: string, options: SecretStoreOptions): BackendIo {
  const keychainPath = options.keychainPath;
  const extra = keychainPath === undefined ? [] : [keychainPath];
  const account = (name: string): string => keychainAccount(name, folder);
  const line = (name: string, value: string): string => writeLine(account(name), hexForm(value), keychainPath);
  return {
    checkValue(name, value) {
      // The stdin form splits a line over the bound into separate commands, which write a cut
      // value into the default keychain and echo the rest, so the bound is checked before any spawn.
      if (Buffer.byteLength(line(name, value), 'utf8') <= KEYCHAIN_LINE_MAX_BYTES) return null;
      return 'the keychain holds at most 1984 bytes for one value, use --store file';
    },
    write(name, value) {
      const run = runKeychain(path, ['-q', '-i'], `${line(name, value)}\n`, options);
      if (run.timedOut) return KEYCHAIN_TIMEOUT_DETAIL;
      if (run.status === 0) return null;
      return `keychain write for ${name} exited ${run.status}`;
    },
    read(name) {
      const args = ['find-generic-password', '-a', account(name), '-s', KEYCHAIN_SERVICE, '-w', ...extra];
      const run = runKeychain(path, args, '', options);
      if (run.timedOut) return { kind: 'error', detail: KEYCHAIN_TIMEOUT_DETAIL };
      if (run.status === 0) return decodeHex(name, run.stdout);
      if (run.status === 44) return { kind: 'absent' };
      return { kind: 'error', detail: `keychain read for ${name} exited ${run.status}` };
    },
    remove(name) {
      const args = ['delete-generic-password', '-a', account(name), '-s', KEYCHAIN_SERVICE, ...extra];
      const run = runKeychain(path, args, '', options);
      if (run.timedOut) return { kind: 'error', reason: KEYCHAIN_TIMEOUT_DETAIL };
      if (run.status === 0) return { kind: 'removed' };
      if (run.status === 44) return { kind: 'absent' };
      return { kind: 'error', reason: `keychain delete exited ${run.status}` };
    },
  };
}

/** The Linux Secret Service, one item per name under the shared service. */
function secretToolBackend(path: string, folder: string, options: SecretStoreOptions): BackendIo {
  const account = (name: string): string => keychainAccount(name, folder);

  /** Read one item, so a delete can tell a cleared item from one that stayed. */
  const read = (name: string): ReadOutcome => {
    const run = runKeychain(path, ['lookup', 'service', KEYCHAIN_SERVICE, 'account', account(name)], '', options);
    if (run.timedOut) return { kind: 'error', detail: KEYCHAIN_TIMEOUT_DETAIL };
    if (run.status === 0) return decodeHex(name, run.stdout);
    if (run.status === 1 && run.stderr.trim() === '') return { kind: 'absent' };
    return { kind: 'error', detail: `keychain read for ${name} exited ${run.status}` };
  };

  return {
    // The value is the whole of stdin here, so no line bound applies.
    checkValue: () => null,
    write(name, value) {
      const args = ['store', '--label', `skilled-bots ${account(name)}`, 'service', KEYCHAIN_SERVICE, 'account', account(name)];
      const run = runKeychain(path, args, hexForm(value), options);
      if (run.timedOut) return KEYCHAIN_TIMEOUT_DETAIL;
      if (run.status === 0) return null;
      return `keychain write for ${name} exited ${run.status}`;
    },
    read,
    remove(name) {
      const run = runKeychain(path, ['clear', 'service', KEYCHAIN_SERVICE, 'account', account(name)], '', options);
      if (run.timedOut) return { kind: 'error', reason: KEYCHAIN_TIMEOUT_DETAIL };
      if (run.status !== 0) return { kind: 'error', reason: `keychain delete exited ${run.status}` };
      // A clear does not say whether an item matched, so the read decides.
      const back = read(name);
      if (back.kind === 'absent') return { kind: 'removed' };
      if (back.kind === 'value') return { kind: 'error', reason: 'keychain delete left the item' };
      return { kind: 'error', reason: back.detail };
    },
  };
}

/** The host's OS keychain, or null when the host has no keychain program. */
function keychainBackend(folder: string, options: SecretStoreOptions): BackendIo | null {
  const program = hostKeychainProgram(options);
  if (program === null) return null;
  return program.kind === 'security'
    ? securityBackend(program.path, folder, options)
    : secretToolBackend(program.path, folder, options);
}

/** The backend a kind names, or null when the host cannot offer it. */
function backendFor(kind: SecretBackend, folder: string, options: SecretStoreOptions): BackendIo | null {
  return kind === 'file' ? fileBackend(folder) : keychainBackend(folder, options);
}

/** Compare two values in constant time, so a read-back never leaks how far it matched. */
function sameValue(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

// ───────────────────────────────────────────────────────────────────
// 6. STORE VERBS
// ───────────────────────────────────────────────────────────────────

/**
 * Store one value under one name, then record it in the index.
 *
 * The value is written and read back before the index is touched, so a row
 * never claims a value the backend did not keep.
 *
 * @returns The backend that holds the value and a warning when an old value of
 *   the other backend survived, or a refusal naming why nothing was stored.
 */
export function setSecret(input: SetSecretInput): Result<SetSecretResult> {
  const { name, value } = input;
  if (!isSecretName(name)) return nameInvalid(name);
  if (value.trim() === '') return emptyValue(name);
  if ([...value].length > SECRET_VALUE_MAX_CODE_POINTS) {
    return tooLong(`the value is longer than ${SECRET_VALUE_MAX_CODE_POINTS} characters`);
  }

  const options: SecretStoreOptions = { env: input.env, platform: input.platform, keychainPath: input.keychainPath };
  const program = hostKeychainProgram(options);
  let kind: SecretBackend;
  if (input.store === 'file') {
    kind = 'file';
  } else if (input.store === 'keychain') {
    if (program === null) return keychainUnavailable();
    kind = 'keychain';
  } else {
    kind = program === null ? 'file' : 'keychain';
  }

  const folder = secretsFolderOf(input.stateRoot, input.identity);
  prepareFolder(folder);
  return withIndexLock(folder, () => {
    const index = readSecretsIndex(folder);
    if (!index.ok) return index;

    const io = backendFor(kind, folder, options);
    if (io === null) return keychainUnavailable();

    const long = io.checkValue(name, value);
    if (long !== null) return tooLong(long);

    const failed = io.write(name, value);
    if (failed !== null) return dropped(failed);

    const back = io.read(name);
    if (back.kind === 'error') return dropped(back.detail);
    if (back.kind !== 'value' || !sameValue(back.value, value)) return dropped(`read-back of ${name} did not match`);

    const existing: SecretsIndexEntry | undefined = index.value.entries[name];
    const at = (input.now ?? new Date()).toISOString();
    const entry: SecretsIndexEntry = {
      ...existing,
      backend: kind,
      createdAt: existing?.createdAt ?? at,
      updatedAt: at,
      setBy: input.setBy,
    };
    try {
      writeSecretsIndex(folder, { ...index.value, entries: { ...index.value.entries, [name]: entry } });
    } catch (error: unknown) {
      return dropped(`index not written: ${errorCode(error)}`);
    }

    let warning: string | null = null;
    if (existing !== undefined && existing.backend !== kind) {
      const old = backendFor(existing.backend, folder, options);
      const removed = old === null ? null : old.remove(name);
      if (removed === null || removed.kind === 'error') {
        warning = `bots: secret set: ${name} stored in ${kind}, the old ${existing.backend} value was not removed, run bots secret forget ${name} and set it again`;
      }
    }

    sweepTemps(folder);
    return { ok: true, value: { backend: kind, warning } };
  });
}

/**
 * List every stored name with its backend and timestamps, carrying no value.
 *
 * @returns The rows in name order, or a refusal when the index cannot be read.
 */
export function listSecrets(stateRoot: string, identity: string): Result<SecretListing[]> {
  const index = readSecretsIndex(secretsFolderOf(stateRoot, identity));
  if (!index.ok) return index;
  const rows: SecretListing[] = [];
  for (const name of Object.keys(index.value.entries).sort()) {
    const entry = index.value.entries[name];
    rows.push({ name, backend: entry.backend, createdAt: entry.createdAt, updatedAt: entry.updatedAt, setBy: entry.setBy });
  }
  return { ok: true, value: rows };
}

/**
 * Drop one name from the index and then delete its value from both backends.
 *
 * The row goes first, so a crash between the two leaves a value with no row
 * rather than a row with no value.
 *
 * @returns Whether the index held the name and which backend refused to drop
 *   its value, or a refusal when the index cannot be read or written.
 */
export function forgetSecret(input: ForgetSecretInput): Result<ForgetSecretResult> {
  const { name } = input;
  if (!isSecretName(name)) return nameInvalid(name);
  const options: SecretStoreOptions = { env: input.env, platform: input.platform, keychainPath: input.keychainPath };
  const folder = secretsFolderOf(input.stateRoot, input.identity);
  prepareFolder(folder);
  return withIndexLock(folder, () => {
    const index = readSecretsIndex(folder);
    if (!index.ok) return index;

    const existing: SecretsIndexEntry | undefined = index.value.entries[name];
    const held = existing !== undefined;
    if (existing !== undefined) {
      const entries = { ...index.value.entries };
      delete entries[name];
      try {
        writeSecretsIndex(folder, { ...index.value, entries });
      } catch (error: unknown) {
        return unreadable(`index not written: ${errorCode(error)}`);
      }
    }

    const kinds: SecretBackend[] =
      existing === undefined ? ['file', 'keychain'] : [existing.backend, existing.backend === 'file' ? 'keychain' : 'file'];
    let leftover: { backend: SecretBackend; reason: string } | null = null;
    for (const kind of kinds) {
      const io = backendFor(kind, folder, options);
      if (io === null) continue;
      const removed = io.remove(name);
      if (removed.kind === 'error' && leftover === null) leftover = { backend: kind, reason: removed.reason };
    }

    sweepTemps(folder);
    return { ok: true, value: { held, leftover } };
  });
}

/**
 * Read one stored value.
 *
 * @returns The value, or a refusal naming why it could not be read.
 */
export function resolveSecret(
  stateRoot: string,
  identity: string,
  name: string,
  options: SecretStoreOptions = {},
): Result<string> {
  if (!isSecretName(name)) return unknownName(name);
  const folder = secretsFolderOf(stateRoot, identity);
  const index = readSecretsIndex(folder);
  if (!index.ok) return index;
  const entry: SecretsIndexEntry | undefined = index.value.entries[name];
  if (entry === undefined) return unknownName(name);
  const io = backendFor(entry.backend, folder, options);
  if (io === null) return unreadable(`${name} is in the keychain and this host has no keychain program`);
  const read = io.read(name);
  if (read.kind === 'value') return { ok: true, value: read.value };
  if (read.kind === 'absent') return unknownName(name);
  return unreadable(read.detail);
}

/**
 * Read every stored value, keyed `vault:<name>` so a caller can tell a vault row from an environment one.
 *
 * @returns Every value the store holds, or a refusal naming why one could not be read.
 */
export function knownSecretValues(
  stateRoot: string,
  identity: string,
  options: SecretStoreOptions = {},
): Result<Map<string, string>> {
  const folder = secretsFolderOf(stateRoot, identity);
  const index = readSecretsIndex(folder);
  if (!index.ok) return index;
  const values = new Map<string, string>();
  for (const name of Object.keys(index.value.entries).sort()) {
    const entry = index.value.entries[name];
    const io = backendFor(entry.backend, folder, options);
    if (io === null) return unreadable(`${name} is in the keychain and this host has no keychain program`);
    const read = io.read(name);
    if (read.kind === 'value') values.set(`vault:${name}`, read.value);
    else if (read.kind === 'error') return unreadable(read.detail);
  }
  return { ok: true, value: values };
}
