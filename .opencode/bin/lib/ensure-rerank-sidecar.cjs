'use strict';

// ─── MODULE: rerank-sidecar launcher ───

// ───── SECTION: imports ─────

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');
const { spawn } = childProcess;
const { isAllowedSidecarEnvKey } = require('./sidecar-env-allowlist.cjs');

// ───── SECTION: constants and errors ─────

const SIDECAR_SKILL_PATH = path.resolve(__dirname, '..', '..', 'skills', 'system-rerank-sidecar');
// 022/008 cross-language sync: this 8765 default mirrors sidecar_defaults.py:DEFAULT_PORT.
// When changing the default, update sidecar_defaults.py AND scripts/start.sh + scripts/use-model.sh in lockstep.
const DEFAULT_PORT = 8765;
const DEFAULT_HEALTH_TIMEOUT_MS = 20000;
const DEFAULT_REAP_HEALTH_TIMEOUT_MS = 100;
const LEDGER_FILE_NAME = '.sidecar-ledger.json';
const OWNER_TOKEN_FILE_NAME = '.sidecar-owner-token';
const LEDGER_VERSION = 2;
const REAPER_POLICY = {
  policyVersion: 1,
  heartbeatSeconds: 45,
  idleTimeoutSeconds: 1800,
};
const MAX_HEALTH_BODY_BYTES = 65536; // 64KB - canonical health payload cap, matches Python
const OWNER_TOKEN_WAIT_TIMEOUT_MS = 2000;
const OWNER_TOKEN_WAIT_INTERVAL_MS = 10;
const MAX_CONFIG_HASH_INPUT_BYTES = 4 * 1024;

/**
 * Error raised when canonical config-hash input contains unsupported data.
 */
class ConfigHashInputError extends Error {
  /**
   * Create a config hash input error.
   *
   * @param {string} key - Environment/config key that failed validation.
   * @param {string} reason - Human-readable validation failure.
   */
  constructor(key, reason) {
    super(`Invalid config hash input for ${key}: ${reason}`);
    this.name = 'ConfigHashInputError';
    this.key = key;
  }
}

/**
 * Error raised when the sidecar state directory violates launcher policy.
 */
class StateDirValidationError extends Error {
  /**
   * Create a state directory validation error.
   *
   * @param {string} message - Validation failure message.
   */
  constructor(message) {
    super(message);
    this.name = 'StateDirValidationError';
  }
}

// ───── SECTION: utility helpers ─────

/**
 * Write a launcher-prefixed diagnostic line to stderr.
 *
 * @param {string} message - Message body to emit.
 * @returns {void}
 */
function log(message) {
  process.stderr.write(`[ensure-rerank-sidecar] ${message}\n`);
}

/**
 * Resolve a positive integer from a loose input value.
 *
 * @param {unknown} value - Candidate numeric value.
 * @param {number} fallback - Value returned when the candidate is invalid.
 * @returns {number} Positive integer candidate or the fallback.
 */
function resolvePositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Resolve the sidecar port from a loose input value.
 *
 * @param {unknown} value - Candidate port value.
 * @returns {number} Positive port number or the default sidecar port.
 */
function resolvePort(value) {
  return resolvePositiveInteger(value, DEFAULT_PORT);
}

/**
 * Resolve the sidecar health timeout from a loose input value.
 *
 * @param {unknown} value - Candidate timeout value in milliseconds.
 * @returns {number} Positive timeout in milliseconds or the default timeout.
 */
function resolveTimeoutMs(value) {
  return resolvePositiveInteger(value, DEFAULT_HEALTH_TIMEOUT_MS);
}

/**
 * Compute the SHA-256 digest advertised by sidecar health payloads.
 *
 * @param {string} ownerToken - Raw owner token.
 * @returns {string} Hex-encoded SHA-256 digest.
 */
function ownerTokenDigest(ownerToken) {
  return crypto.createHash('sha256').update(ownerToken, 'utf8').digest('hex');
}

/**
 * Normalize a raw health response into the launcher's stable health shape.
 *
 * @param {Record<string, unknown> | null | undefined} raw - Parsed health payload or nullish fallback.
 * @param {number} port - Port used as fallback when the payload port is invalid.
 * @returns {{status: string, port: number, ownerCount: number, lastReapTs: number}} Normalized health payload.
 */
function normalizeHealthPayload(raw, port) {
  const ownerCount = Number(raw?.ownerCount ?? raw?.owner_count ?? 0);
  const lastReapTs = Number(raw?.lastReapTs ?? raw?.last_reap_ts ?? 0);
  const payloadPort = Number(raw?.port ?? port);
  return {
    status: typeof raw?.status === 'string' ? raw.status : 'unreachable',
    port: Number.isInteger(payloadPort) && payloadPort > 0 ? payloadPort : Number(port),
    ownerCount: Number.isInteger(ownerCount) && ownerCount >= 0 ? ownerCount : 0,
    lastReapTs: Number.isFinite(lastReapTs) && lastReapTs >= 0 ? lastReapTs : 0,
  };
}

/**
 * Read and parse a raw sidecar health payload.
 *
 * @param {number} port - Sidecar port to query.
 * @param {number} timeoutMs - Request timeout in milliseconds.
 * @param {{http?: typeof http}} [deps] - Optional dependency overrides for tests.
 * @returns {Promise<Record<string, unknown> | null>} Parsed object payload, or null on network, size, status, or JSON failure.
 */
async function readRawHealthPayload(port, timeoutMs, deps = {}) {
  const httpModule = deps.http ?? http;
  return new Promise((resolve) => {
    const req = httpModule.get({ host: '127.0.0.1', port, path: '/health', timeout: timeoutMs }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        if (body.length + chunk.length > MAX_HEALTH_BODY_BYTES) {
          req.destroy();
          resolve(null);
          return;
        }
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }
        try {
          const parsed = JSON.parse(body);
          resolve(parsed && typeof parsed === 'object' ? parsed : null);
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

/**
 * Read sidecar health and normalize unreachable responses.
 *
 * @param {number} port - Sidecar port to query.
 * @param {number} timeoutMs - Request timeout in milliseconds.
 * @param {{http?: typeof http}} [deps] - Optional dependency overrides for tests.
 * @returns {Promise<{status: string, port: number, ownerCount: number, lastReapTs: number}>} Stable health payload.
 */
async function healthPayload(port, timeoutMs, deps = {}) {
  return normalizeHealthPayload(await readRawHealthPayload(port, timeoutMs, deps), port);
}

/**
 * Check whether a sidecar is reachable and matches optional ownership/config expectations.
 *
 * @param {number} port - Sidecar port to query.
 * @param {number} timeoutMs - Request timeout in milliseconds.
 * @param {{expectedOwnerToken?: string, expectedConfigHash?: string, http?: typeof http}} [deps] - Optional match criteria and test overrides.
 * @returns {Promise<boolean>} True when health is reachable and expected owner/config data matches.
 */
async function isHealthy(port, timeoutMs, deps = {}) {
  const payload = await readRawHealthPayload(port, timeoutMs, deps);
  if (!payload) return false;
  if (deps.expectedOwnerToken && payload.owner_token_sha256 !== ownerTokenDigest(deps.expectedOwnerToken)) {
    return false;
  }
  if (deps.expectedConfigHash && payload.canonical_config_hash !== deps.expectedConfigHash) {
    return false;
  }
  return true;
}

/**
 * Poll sidecar health until the deadline is reached.
 *
 * @param {number} port - Sidecar port to query.
 * @param {number} deadline - Epoch millisecond deadline.
 * @param {{sleep?: (ms: number) => Promise<void>}} [deps] - Optional sleep override for tests.
 * @returns {Promise<boolean>} True when the sidecar becomes healthy before the deadline.
 */
async function waitForHealthy(port, deadline, deps = {}) {
  const sleep = deps.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  while (Date.now() < deadline) {
    if (await isHealthy(port, 2000, deps)) return true;
    await sleep(500);
  }
  return false;
}

/**
 * Generate a random hex string.
 *
 * @param {number} bytes - Number of random bytes.
 * @param {{crypto?: typeof crypto}} [deps] - Optional crypto override for tests.
 * @returns {string} Hex-encoded random bytes.
 */
function randomHex(bytes, deps = {}) {
  return (deps.crypto ?? crypto).randomBytes(bytes).toString('hex');
}

// ───── SECTION: filesystem and state directory helpers ─────

/**
 * Fsync the parent directory of a target path when the fs implementation supports it.
 *
 * @param {string} targetPath - File path whose containing directory should be synced.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {void}
 * @throws {Error} when opening, syncing, or closing the directory fails.
 */
function fsyncDirOf(targetPath, fsModule) {
  if (typeof fsModule.openSync !== 'function' || typeof fsModule.fsyncSync !== 'function') return;
  const dirFd = fsModule.openSync(path.dirname(targetPath), 'r');
  try {
    fsModule.fsyncSync(dirFd);
  } finally {
    fsModule.closeSync(dirFd);
  }
}

/**
 * Open the sidecar log file descriptor, falling back to ignored stdio on failure.
 *
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {typeof os} osModule - OS implementation used to resolve the home directory.
 * @returns {number | 'ignore'} Append file descriptor for sidecar logs, or `'ignore'` when no log path is usable.
 */
function openSidecarLogFd(fsModule, osModule) {
  const candidates = [
    path.join(osModule.homedir(), '.cache', 'mk-reranker'),
    path.join(os.tmpdir(), 'mk-reranker'),
  ];
  for (const cacheDir of candidates) {
    try {
      fsModule.mkdirSync(cacheDir, { recursive: true, mode: 0o700 });
      const fd = fsModule.openSync(path.join(cacheDir, 'sidecar.log'), 'a', 0o600);
      if (typeof fsModule.fchmodSync === 'function') {
        fsModule.fchmodSync(fd, 0o600);
      }
      return fd;
    } catch {
      // Try the next log directory; logging must not block MCP startup.
    }
  }
  return 'ignore';
}

/**
 * Detect parent-directory traversal segments in a path string.
 *
 * @param {string} inputPath - Path string to inspect.
 * @returns {boolean} True when any segment is `..`.
 */
function hasTraversalSegment(inputPath) {
  return String(inputPath).split(/[\\/]+/).includes('..');
}

/**
 * Test whether a candidate path resolves inside a parent path.
 *
 * @param {string} parentPath - Containing directory.
 * @param {string} candidatePath - Candidate path to check.
 * @returns {boolean} True when the candidate is the parent or below it.
 */
function pathInside(parentPath, candidatePath) {
  const relative = path.relative(parentPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

/**
 * Ensure a directory exists and is writable.
 *
 * @param {string} dir - Directory path to create and validate.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {void}
 * @throws {StateDirValidationError} when the directory cannot be created or written.
 */
function assertWritableDir(dir, fsModule) {
  try {
    fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
    if (typeof fsModule.accessSync === 'function') {
      fsModule.accessSync(dir, fs.constants.W_OK);
    }
  } catch {
    throw new StateDirValidationError(`RERANK_SIDECAR_STATE_DIR must be writable: ${dir}`);
  }
}

/**
 * Resolve and validate the sidecar state directory.
 *
 * @param {NodeJS.Process} processObj - Process-like object with environment values.
 * @param {typeof os} osModule - OS implementation used to resolve the home directory.
 * @param {typeof fs} [fsModule] - Filesystem implementation.
 * @returns {string} Absolute writable state directory.
 * @throws {StateDirValidationError} when the configured directory is relative, traverses upward, escapes HOME, or is not writable.
 */
function stateDir(processObj, osModule, fsModule = fs) {
  const configured = String(processObj.env.RERANK_SIDECAR_STATE_DIR || '').trim();
  const home = path.resolve(String(processObj.env.HOME || osModule.homedir()));
  if (!configured) {
    const defaultDir = path.join(home, '.cache', 'mk-reranker');
    assertWritableDir(defaultDir, fsModule);
    return defaultDir;
  }
  if (!path.isAbsolute(configured)) {
    throw new StateDirValidationError(`RERANK_SIDECAR_STATE_DIR must be an absolute path: ${configured}`);
  }
  if (hasTraversalSegment(configured)) {
    throw new StateDirValidationError(`RERANK_SIDECAR_STATE_DIR must not contain '..' segments: ${configured}`);
  }
  const resolved = path.resolve(configured);
  if (!pathInside(home, resolved)) {
    throw new StateDirValidationError(`RERANK_SIDECAR_STATE_DIR must be under HOME (${home}): ${resolved}`);
  }
  assertWritableDir(resolved, fsModule);
  return resolved;
}

/**
 * Resolve the owner-token file path for a state directory.
 *
 * @param {string} dir - Sidecar state directory.
 * @returns {string} Absolute owner-token path.
 */
function ownerTokenPath(dir) {
  return path.join(dir, OWNER_TOKEN_FILE_NAME);
}

/**
 * Build the environment passed to the sidecar process.
 *
 * @param {NodeJS.ProcessEnv} parentEnv - Parent process environment.
 * @param {Record<string, string>} overrides - Required sidecar runtime overrides.
 * @returns {Record<string, string>} Allowlisted parent env plus overrides.
 */
function buildSidecarEnv(parentEnv, overrides) {
  const childEnv = {};
  for (const [key, value] of Object.entries(parentEnv)) {
    if (typeof value === 'string' && isAllowedSidecarEnvKey(key)) {
      childEnv[key] = value;
    }
  }
  return { ...childEnv, ...overrides };
}

/**
 * Sleep synchronously for short lock contention windows.
 *
 * @param {number} ms - Duration in milliseconds.
 * @returns {void}
 */
function sleepSync(ms) {
  if (typeof SharedArrayBuffer === 'function' && typeof Atomics === 'object' && typeof Atomics.wait === 'function') {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
    return;
  }
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    // Synchronous fallback only used during rare owner-token creation races.
  }
}

// ───── SECTION: owner token helpers ─────

/**
 * Read an existing owner token when the file is present.
 *
 * @param {string} tokenPath - Owner-token file path.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {string | null} Trimmed token, or null when absent/empty.
 * @throws {Error} when reading fails for reasons other than `ENOENT`.
 */
function readOwnerTokenIfPresent(tokenPath, fsModule) {
  try {
    const existing = fsModule.readFileSync(tokenPath, 'utf8').trim();
    return existing || null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

/**
 * Wait briefly for another process to publish an owner token.
 *
 * @param {string} tokenPath - Owner-token file path.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {Error} originalError - Lock acquisition error rethrown if the token never appears.
 * @returns {string} Owner token published by the competing process.
 * @throws {Error} when the token does not appear before the wait deadline.
 */
function waitForOwnerToken(tokenPath, fsModule, originalError) {
  const deadline = Date.now() + OWNER_TOKEN_WAIT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const existing = readOwnerTokenIfPresent(tokenPath, fsModule);
    if (existing) return existing;
    sleepSync(OWNER_TOKEN_WAIT_INTERVAL_MS);
  }
  throw originalError;
}

/**
 * Atomically publish an owner token file with durable file and directory sync.
 *
 * @param {string} tokenPath - Owner-token destination path.
 * @param {string} token - Token value to write.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {{crypto?: typeof crypto}} [deps] - Optional crypto override for temp name generation.
 * @returns {void}
 * @throws {Error} when temp-file creation, write, fsync, rename, or directory sync fails.
 */
function writeOwnerTokenAtomic(tokenPath, token, fsModule, deps = {}) {
  const tmp = `${tokenPath}.tmp.${randomHex(16, deps)}`;
  let fd;
  try {
    fd = fsModule.openSync(tmp, 'wx', 0o600);
    fsModule.writeSync(fd, `${token}\n`);
    if (typeof fsModule.fsyncSync === 'function') {
      fsModule.fsyncSync(fd);
    }
  } catch (error) {
    try {
      if (typeof fd === 'number') fsModule.closeSync(fd);
    } catch {
      // Best-effort close before propagating the write failure.
    }
    try {
      fsModule.unlinkSync?.(tmp);
    } catch {
      // Best-effort cleanup; the random temp path is never trusted.
    }
    throw error;
  }

  fsModule.closeSync(fd);
  try {
    fsModule.renameSync(tmp, tokenPath);
    fsyncDirOf(tokenPath, fsModule);
  } catch (error) {
    try {
      fsModule.unlinkSync?.(tmp);
    } catch {
      // Best-effort cleanup after failed publish.
    }
    throw error;
  }
}

/**
 * Load an explicit, existing, or newly-created owner token for this launcher.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {NodeJS.Process} processObj - Process-like object with environment values.
 * @param {{crypto?: typeof crypto}} [deps] - Optional crypto override for token generation.
 * @returns {string} Stable owner token for this state directory.
 * @throws {Error} when lock acquisition, token write, or cleanup fails outside handled contention.
 */
function loadOrCreateOwnerToken(dir, fsModule, processObj, deps = {}) {
  const explicit = String(processObj.env.RERANK_SIDECAR_OWNER_TOKEN || '').trim();
  if (explicit) return explicit;
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const tokenPath = ownerTokenPath(dir);
  const existing = readOwnerTokenIfPresent(tokenPath, fsModule);
  if (existing) return existing;

  const token = (deps.crypto ?? crypto).randomBytes(24).toString('base64url');
  const lockPath = `${tokenPath}.lock`;
  let lockFd;
  try {
    lockFd = fsModule.openSync(lockPath, 'wx', 0o600);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    return waitForOwnerToken(tokenPath, fsModule, error);
  }

  try {
    const afterLockExisting = readOwnerTokenIfPresent(tokenPath, fsModule);
    if (afterLockExisting) return afterLockExisting;
    writeOwnerTokenAtomic(tokenPath, token, fsModule, deps);
    return token;
  } finally {
    fsModule.closeSync(lockFd);
    try {
      fsModule.unlinkSync?.(lockPath);
    } catch {
      // Lock cleanup is best-effort; a later contender will fail closed.
    }
  }
}

// ───── SECTION: config hash helpers ─────

/**
 * Validate one config hash input and track cumulative byte size.
 *
 * @param {string} key - Config key being validated.
 * @param {unknown} value - Config value to validate.
 * @param {number} totalBytes - Bytes already accepted for prior values.
 * @returns {number} Updated cumulative byte count.
 * @throws {ConfigHashInputError} when the value is not a string, contains control characters, or exceeds the total byte cap.
 */
function validateConfigHashValue(key, value, totalBytes) {
  if (typeof value !== 'string') {
    throw new ConfigHashInputError(key, 'expected string value');
  }
  if (/[\x00-\x1F\x7F]/.test(value)) {
    throw new ConfigHashInputError(key, 'contains unprintable control characters');
  }
  const nextTotal = totalBytes + Buffer.byteLength(value, 'utf8');
  if (nextTotal > MAX_CONFIG_HASH_INPUT_BYTES) {
    throw new ConfigHashInputError(key, `exceeds ${MAX_CONFIG_HASH_INPUT_BYTES}-byte total limit`);
  }
  return nextTotal;
}

/**
 * Read a config hash environment value with empty strings treated as unset.
 *
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} env - Environment map.
 * @param {string} key - Environment key to read.
 * @param {string} fallback - Fallback value when the key is absent or empty.
 * @returns {string | undefined} Environment value or fallback.
 */
function readConfigHashEnvValue(env, key, fallback) {
  if (!Object.prototype.hasOwnProperty.call(env, key)) {
    return fallback;
  }
  const value = env[key];
  if (value === '') {
    return fallback;
  }
  return value;
}

/**
 * Validate all canonical config hash inputs in stable key order.
 *
 * @param {Record<string, unknown>} config - Config values included in the canonical hash.
 * @returns {void}
 * @throws {ConfigHashInputError} when any value violates hash input constraints.
 */
function validateConfigHashInputs(config) {
  let totalBytes = 0;
  for (const key of Object.keys(config).sort()) {
    totalBytes = validateConfigHashValue(key, config[key], totalBytes);
  }
}

/**
 * Compute the canonical sidecar config hash shared with the Python sidecar.
 *
 * @param {number} port - Sidecar port included in the hash.
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} env - Environment map containing reranker config.
 * @returns {string} Hex-encoded SHA-256 config hash.
 * @throws {ConfigHashInputError} when any config hash input is malformed.
 */
function canonicalConfigHash(port, env) {
  // Empty string is treated as "not set" via || operator (matches Python contract)
  // Python sibling mirrors this contract in ensure_rerank_sidecar.py:135-150
  // Both implementations treat empty RERANK_MODEL_REVISION as "use default"
  const config = {
    RERANK_ALLOWED_MODELS: readConfigHashEnvValue(env, 'RERANK_ALLOWED_MODELS', ''),
    RERANK_DEVICE: readConfigHashEnvValue(env, 'RERANK_DEVICE', ''),
    // 022/008 cross-language sync: defaults mirror sidecar_defaults.py:DEFAULT_MODEL_NAME + DEFAULT_MODEL_REVISION.
    RERANK_MODEL_NAME: readConfigHashEnvValue(env, 'RERANK_MODEL_NAME', 'Qwen/Qwen3-Reranker-0.6B'),
    RERANK_MODEL_REVISION: readConfigHashEnvValue(env, 'RERANK_MODEL_REVISION', 'e61197ed45024b0ed8a2d74b80b4d909f1255473'),
    RERANK_MODEL_REVISIONS: readConfigHashEnvValue(env, 'RERANK_MODEL_REVISIONS', ''),
    RERANK_TORCH_DTYPE: readConfigHashEnvValue(env, 'RERANK_TORCH_DTYPE', ''),
    port: String(port),
  };
  validateConfigHashInputs(config);
  const stable = [
    `allowed=${config.RERANK_ALLOWED_MODELS}`,
    `device=${config.RERANK_DEVICE}`,
    `dtype=${config.RERANK_TORCH_DTYPE}`,
    `model=${config.RERANK_MODEL_NAME}`,
    `port=${config.port}`,
    `revision=${config.RERANK_MODEL_REVISION}`,
    `revisions=${config.RERANK_MODEL_REVISIONS}`,
  ].join('\n');
  return crypto.createHash('sha256').update(stable, 'utf8').digest('hex');
}

// ───── SECTION: owner identity helpers ─────

/**
 * Resolve the sidecar ledger file path for a state directory.
 *
 * @param {string} dir - Sidecar state directory.
 * @returns {string} Absolute ledger path.
 */
function ledgerPath(dir) {
  return path.join(dir, LEDGER_FILE_NAME);
}

/**
 * Parse `ps` identity output into process birth timestamp and command name.
 *
 * @param {string} output - Raw `ps -o lstart=,comm=` output.
 * @returns {{createTimestamp: string, comm: string} | null} Parsed identity, or null when output is unusable.
 */
function parseProcessIdentityOutput(output) {
  const firstLine = String(output || '').split(/\r?\n/).find((line) => line.trim()) || '';
  if (firstLine.length < 24) return null;
  const createTimestamp = firstLine.slice(0, 24).trim();
  const comm = firstLine.slice(24).trim();
  if (!createTimestamp || !comm) return null;
  return { createTimestamp, comm };
}

/**
 * Read a process identity from the operating system.
 *
 * @param {number} pid - Process id to inspect.
 * @param {{execSync?: typeof childProcess.execSync}} [deps] - Optional command execution override for tests.
 * @returns {{createTimestamp: string, comm: string} | null} Process identity, or null when `ps` fails.
 */
function readProcessIdentity(pid, deps = {}) {
  const execSyncFn = deps.execSync ?? childProcess.execSync;
  try {
    const output = execSyncFn(`ps -p ${pid} -o lstart=,comm=`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return parseProcessIdentityOutput(output);
  } catch {
    return null;
  }
}

/**
 * Build a stable owner identity string from process identity fields.
 *
 * @param {string} source - Component registering the owner.
 * @param {number} pid - Owner process id.
 * @param {string | null | undefined} createTimestamp - Process creation timestamp when known.
 * @param {string | null | undefined} comm - Process command name when known.
 * @returns {string} Stable owner identity id.
 */
function ownerIdentityId(source, pid, createTimestamp, comm) {
  return `${source}:${pid}:${createTimestamp || 'unknown'}:${comm || 'unknown'}`;
}

/**
 * Build the current process owner identity row.
 *
 * @param {NodeJS.Process} processObj - Process-like object for pid and timestamps.
 * @param {{execSync?: typeof childProcess.execSync}} [deps] - Optional identity lookup override for tests.
 * @returns {{ownerId: string, pid: number, createTimestamp: string | null, comm: string | null, registeredAtIso: string, lastSeenIso: string, source: string}} Current owner identity.
 */
function currentOwnerIdentity(processObj, deps = {}) {
  const pid = Number(processObj.pid || process.pid);
  const now = new Date().toISOString();
  const identity = readProcessIdentity(pid, deps);
  const createTimestamp = identity?.createTimestamp ?? null;
  const comm = identity?.comm ?? null;
  const source = 'ensure-rerank-sidecar.cjs';
  return {
    ownerId: ownerIdentityId(source, pid, createTimestamp, comm),
    pid,
    createTimestamp,
    comm,
    registeredAtIso: now,
    lastSeenIso: now,
    source,
  };
}

/**
 * Normalize a raw ledger owner object.
 *
 * @param {unknown} raw - Raw owner object from the ledger.
 * @returns {Record<string, unknown> | null} Normalized owner row, or null when invalid.
 */
function normalizeOwner(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const pid = Number(raw.pid);
  if (!Number.isInteger(pid) || pid <= 0) return null;
  const createTimestamp = raw.createTimestamp ?? raw.create_timestamp ?? null;
  const comm = raw.comm ?? null;
  const source = String(raw.source || 'unknown');
  const registeredAtIso = String(raw.registeredAtIso || raw.registered_at_iso || new Date().toISOString());
  const lastSeenIso = String(raw.lastSeenIso || raw.last_seen_iso || registeredAtIso);
  return {
    ownerId: String(raw.ownerId || raw.owner_id || ownerIdentityId(source, pid, createTimestamp, comm)),
    pid,
    createTimestamp,
    comm,
    registeredAtIso,
    lastSeenIso,
    source,
  };
}

// ───── SECTION: ledger I/O helpers ─────

/**
 * Normalize a raw sidecar ledger row.
 *
 * @param {unknown} raw - Raw row from the ledger payload.
 * @returns {Record<string, unknown> | null} Normalized row, or null when required fields are invalid.
 */
function normalizeRow(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const pid = Number(raw.pid ?? raw.sidecar_pid);
  const port = Number(raw.port);
  const ownerToken = raw.ownerToken ?? raw.owner_token;
  const canonicalConfigHash = raw.canonicalConfigHash ?? raw.canonical_config_hash ?? '';
  if (!Number.isInteger(pid) || !Number.isInteger(port) || typeof ownerToken !== 'string' || !ownerToken) {
    return null;
  }
  const ownersListPresent = Object.prototype.hasOwnProperty.call(raw, 'owners');
  const owners = Array.isArray(raw.owners) ? raw.owners.map(normalizeOwner).filter(Boolean) : [];
  return {
    pid,
    port,
    ownerToken,
    startedAtIso: String(raw.startedAtIso || raw.started_at_iso || new Date().toISOString()),
    lastHealthIso: String(raw.lastHealthIso || raw.last_health_iso || new Date().toISOString()),
    executablePath: String(raw.executablePath || raw.executable_path || ''),
    canonicalConfigHash: String(canonicalConfigHash),
    owners,
    ownersListPresent,
    reaper: { ...REAPER_POLICY, ...(raw.reaper && typeof raw.reaper === 'object' ? raw.reaper : {}) },
  };
}

/**
 * Extract raw row arrays from supported legacy and current ledger payload shapes.
 *
 * @param {unknown} parsed - Parsed ledger JSON.
 * @returns {unknown[]} Raw ledger rows.
 */
function rawRowsFromPayload(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== 'object') return [];
  if (Array.isArray(parsed.sidecars)) return parsed.sidecars;
  if (Array.isArray(parsed.rows)) return parsed.rows;
  return [];
}

/**
 * Read ledger rows without acquiring the ledger lock.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {Array<Record<string, unknown>>} Normalized ledger rows, or an empty list on read/parse failure.
 */
function readLedgerUnlocked(dir, fsModule) {
  try {
    const parsed = JSON.parse(fsModule.readFileSync(ledgerPath(dir), 'utf8'));
    return rawRowsFromPayload(parsed).map(normalizeRow).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Read normalized ledger rows.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {Array<Record<string, unknown>>} Normalized ledger rows.
 */
function readLedger(dir, fsModule) {
  return readLedgerUnlocked(dir, fsModule);
}

/**
 * Execute a synchronous callback while holding the ledger lock.
 *
 * @template T
 * @param {string} dir - Sidecar state directory.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {() => T} callback - Work to run while the lock is held.
 * @returns {T} Callback result.
 * @throws {Error} when the lock cannot be acquired or the callback throws.
 */
function withLedgerLockSync(dir, fsModule, callback) {
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const target = ledgerPath(dir);
  const lockPath = `${target}.lock`;
  const lockFd = fsModule.openSync(lockPath, 'wx', 0o600);
  try {
    return callback();
  } finally {
    fsModule.closeSync(lockFd);
    try {
      fsModule.unlinkSync?.(lockPath);
    } catch {
      // Lock file cleanup is best-effort; may already be removed by concurrent process.
    }
  }
}

/**
 * Execute an async callback while holding the ledger lock.
 *
 * @template T
 * @param {string} dir - Sidecar state directory.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {() => Promise<T>} callback - Async work to run while the lock is held.
 * @returns {Promise<T>} Callback result.
 * @throws {Error} when the lock cannot be acquired or the callback rejects.
 */
async function withLedgerLockAsync(dir, fsModule, callback) {
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const target = ledgerPath(dir);
  const lockPath = `${target}.lock`;
  const lockFd = fsModule.openSync(lockPath, 'wx', 0o600);
  try {
    return await callback();
  } finally {
    fsModule.closeSync(lockFd);
    try {
      fsModule.unlinkSync?.(lockPath);
    } catch {
      // Lock file cleanup is best-effort; may already be removed by concurrent process.
    }
  }
}

/**
 * Convert a normalized ledger row into the persisted ledger schema.
 *
 * @param {Record<string, unknown>} row - Normalized ledger row.
 * @returns {Record<string, unknown>} Serializable ledger row.
 */
function serializeRow(row) {
  const serialized = {
    pid: row.pid,
    port: row.port,
    ownerToken: row.ownerToken,
    startedAtIso: row.startedAtIso || new Date().toISOString(),
    lastHealthIso: row.lastHealthIso || new Date().toISOString(),
    executablePath: row.executablePath || '',
    canonicalConfigHash: row.canonicalConfigHash || '',
    reaper: { ...REAPER_POLICY, ...(row.reaper || {}) },
  };
  if (row.ownersListPresent !== false) {
    serialized.owners = Array.isArray(row.owners) ? row.owners : [];
  }
  return serialized;
}

/**
 * Write ledger rows without acquiring the ledger lock.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {Array<Record<string, unknown>>} rows - Normalized rows to persist.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {{crypto?: typeof crypto}} [deps] - Optional crypto override for temp name generation.
 * @returns {void}
 * @throws {Error} when ledger temp write, rename, or fsync fails.
 */
function writeLedgerUnlocked(dir, rows, fsModule, deps = {}) {
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const target = ledgerPath(dir);
  const tmp = `${target}.tmp.${randomHex(16, deps)}`;
  const fd = fsModule.openSync(tmp, 'wx');
  try {
    fsModule.writeSync(fd, `${JSON.stringify({ version: LEDGER_VERSION, sidecars: rows.map(serializeRow) }, null, 2)}\n`);
    if (typeof fsModule.fsyncSync === 'function') {
      fsModule.fsyncSync(fd);
    }
  } finally {
    fsModule.closeSync(fd);
  }
  fsModule.renameSync(tmp, target);
  fsyncDirOf(target, fsModule);
}

/**
 * Write ledger rows while holding the ledger lock.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {Array<Record<string, unknown>>} rows - Normalized rows to persist.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {{crypto?: typeof crypto}} [deps] - Optional crypto override for temp name generation.
 * @returns {void}
 * @throws {Error} when lock acquisition or ledger write fails.
 */
function writeLedger(dir, rows, fsModule, deps = {}) {
  return withLedgerLockSync(dir, fsModule, () => writeLedgerUnlocked(dir, rows, fsModule, deps));
}

/**
 * Add or replace one ledger row by sidecar pid.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {Record<string, unknown>} row - Normalized row to add.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {{crypto?: typeof crypto}} [deps] - Optional crypto override for temp name generation.
 * @returns {void}
 * @throws {Error} when reading or writing the ledger fails.
 */
function addLedgerRow(dir, row, fsModule, deps = {}) {
  const rows = readLedger(dir, fsModule).filter((existing) => existing.pid !== row.pid);
  rows.push(row);
  writeLedger(dir, rows, fsModule, deps);
}

// ───── SECTION: reaper and liveness helpers ─────

/**
 * Check whether a process is alive and still matches its recorded identity.
 *
 * @param {number} pid - Process id to inspect.
 * @param {NodeJS.Process} processObj - Process-like object with `kill` and `stderr`.
 * @param {string | null} [recordedCreateTimestamp] - Recorded process creation timestamp.
 * @param {string | null} [recordedComm] - Recorded process command name.
 * @param {{execSync?: typeof childProcess.execSync}} [deps] - Optional process identity lookup override for tests.
 * @returns {{alive: boolean, reason: string, errorCode?: string}} Liveness result and reason.
 */
function processLiveness(pid, processObj, recordedCreateTimestamp = null, recordedComm = null, deps = {}) {
  if (pid === 1) return { alive: false, reason: 'pid-1-orphaned' };
  if (!Number.isInteger(pid) || pid <= 0) return { alive: false, reason: 'kill-0-esrch' };

  let killReason = 'ok';
  try {
    processObj.kill(pid, 0);
  } catch (error) {
    if (error.code === 'ESRCH') return { alive: false, reason: 'kill-0-esrch' };
    if (error.code === 'EPERM') {
      killReason = 'kill-0-eperm';
    } else {
      const errorCode = error.code || 'unknown';
      processObj.stderr.write(`[processLiveness] unexpected error code ${errorCode} for pid ${pid}\n`);
      return { alive: true, reason: 'unknown', errorCode };
    }
  }

  if (recordedCreateTimestamp == null || recordedComm == null) {
    return { alive: true, reason: 'unknown' };
  }

  const identity = readProcessIdentity(pid, deps);
  if (!identity) return { alive: true, reason: 'unknown' };
  if (identity.createTimestamp !== recordedCreateTimestamp || identity.comm !== recordedComm) {
    return { alive: false, reason: 'pid-recycled' };
  }
  return { alive: true, reason: killReason };
}

/**
 * Check liveness for a normalized owner row.
 *
 * @param {{pid: number, createTimestamp?: string | null, comm?: string | null}} owner - Owner row to inspect.
 * @param {NodeJS.Process} processObj - Process-like object with `kill` and `stderr`.
 * @param {{execSync?: typeof childProcess.execSync}} [deps] - Optional process identity lookup override for tests.
 * @returns {{alive: boolean, reason: string, errorCode?: string}} Liveness result and reason.
 */
function ownerLiveness(owner, processObj, deps = {}) {
  return processLiveness(owner.pid, processObj, owner.createTimestamp, owner.comm, deps);
}

/**
 * Decide whether a ledger row should be reaped based on owner liveness.
 *
 * @param {Record<string, unknown>} row - Normalized ledger row.
 * @param {NodeJS.Process} processObj - Process-like object with `kill` and `stderr`.
 * @param {{execSync?: typeof childProcess.execSync}} [deps] - Optional process identity lookup override for tests.
 * @returns {boolean} True when the row has no live owners and should be health-checked for reap.
 */
function shouldReapRow(row, processObj, deps = {}) {
  if (row.ownersListPresent === false) return false;
  if (!Array.isArray(row.owners) || row.owners.length === 0) return true;
  return !row.owners.some((owner) => ownerLiveness(owner, processObj, deps).alive === true);
}

/**
 * Register or refresh one owner in the matching sidecar ledger row.
 *
 * @param {Array<Record<string, unknown>>} rows - Current ledger rows.
 * @param {number} sidecarPid - Sidecar pid to update.
 * @param {Record<string, unknown>} owner - Owner identity to register.
 * @returns {{rows: Array<Record<string, unknown>>, changed: boolean}} Updated rows and change flag.
 */
function registerOwnerInRows(rows, sidecarPid, owner) {
  let changed = false;
  const updated = rows.map((row) => {
    if (row.pid !== sidecarPid) return row;
    const owners = Array.isArray(row.owners) ? [...row.owners] : [];
    const index = owners.findIndex((existing) => (
      existing.pid === owner.pid
      && existing.createTimestamp === owner.createTimestamp
      && existing.comm === owner.comm
    ));
    if (index >= 0) {
      owners[index] = { ...owners[index], lastSeenIso: owner.lastSeenIso };
    } else {
      owners.push(owner);
    }
    changed = true;
    return { ...row, owners, ownersListPresent: true };
  });
  return { rows: updated, changed };
}

/**
 * Register an owner in the ledger while holding the ledger lock.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {number} sidecarPid - Sidecar pid to update.
 * @param {Record<string, unknown>} owner - Owner identity to register.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {{crypto?: typeof crypto}} [deps] - Optional crypto override for temp name generation.
 * @returns {Array<Record<string, unknown>>} Ledger rows after registration.
 * @throws {Error} when lock acquisition or ledger write fails.
 */
function lockedRegisterOwner(dir, sidecarPid, owner, fsModule, deps = {}) {
  return withLedgerLockSync(dir, fsModule, () => {
    const currentRows = readLedgerUnlocked(dir, fsModule);
    const result = registerOwnerInRows(currentRows, sidecarPid, owner);
    if (result.changed) {
      writeLedgerUnlocked(dir, result.rows, fsModule, deps);
    }
    return result.rows;
  });
}

/**
 * Resolve the reaper telemetry path from env or default user log location.
 *
 * @param {string} ledgerDir - Ledger directory, retained for dependency parity.
 * @param {NodeJS.Process} processObj - Process-like object with environment values.
 * @param {typeof os} osModule - OS implementation used to resolve the home directory.
 * @returns {string} Absolute telemetry JSONL path.
 */
function reaperTelemetryPath(ledgerDir, processObj, osModule) {
  const configured = String(processObj.env.RERANK_SIDECAR_REAPER_TELEMETRY_PATH || '').trim();
  if (configured) return path.resolve(configured);
  return path.join(osModule.homedir(), 'Library', 'Logs', 'spec-kit', 'sidecar-reaper.jsonl');
}

/**
 * Append a best-effort reaper telemetry event.
 *
 * @param {string} ledgerDir - Ledger directory used for API parity.
 * @param {Record<string, unknown>} event - Telemetry event to append.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {NodeJS.Process} processObj - Process-like object with environment values.
 * @param {typeof os} osModule - OS implementation used to resolve the home directory.
 * @returns {void}
 */
function writeReaperTelemetry(ledgerDir, event, fsModule, processObj, osModule) {
  if (typeof fsModule.appendFileSync !== 'function') return;
  const target = reaperTelemetryPath(ledgerDir, processObj, osModule);
  try {
    fsModule.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
    fsModule.appendFileSync(target, `${JSON.stringify(event)}\n`, { encoding: 'utf8', mode: 0o600 });
    if (typeof fsModule.chmodSync === 'function') {
      fsModule.chmodSync(target, 0o600);
    }
  } catch {
    // Telemetry must never prevent launcher cleanup or reuse.
  }
}

/**
 * Reap stale sidecars whose owners are gone and health endpoint is unreachable.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {Record<string, unknown>} deps - Dependency overrides used by liveness and health checks.
 * @param {NodeJS.Process} processObj - Process-like object with env, kill, and stderr.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @param {typeof os} osModule - OS implementation used for telemetry path resolution.
 * @returns {Promise<Array<Record<string, unknown>>>} Rows reaped from the ledger.
 * @throws {Error} when ledger lock acquisition or write fails.
 */
async function reapStaleSidecars(dir, deps, processObj, fsModule, osModule) {
  const timeoutMs = resolvePositiveInteger(
    processObj.env.RERANK_SIDECAR_REAPER_HEALTH_TIMEOUT_MS,
    DEFAULT_REAP_HEALTH_TIMEOUT_MS,
  );
  return withLedgerLockAsync(dir, fsModule, async () => {
    const rows = readLedgerUnlocked(dir, fsModule);
    const kept = [];
    const reaped = [];
    for (const row of rows) {
      if (!shouldReapRow(row, processObj, deps)) {
        kept.push(row);
        continue;
      }
      const healthReachable = await isHealthy(row.port, timeoutMs, deps);
      if (healthReachable) {
        kept.push(row);
        continue;
      }
      try {
        processObj.kill(row.pid, 'SIGTERM');
      } catch {
        // The ledger row is stale either way; removal is the durable cleanup.
      }
      reaped.push(row);
      writeReaperTelemetry(dir, {
        timestamp: new Date().toISOString(),
        event: 'launcher-preflight-reap',
        pid: row.pid,
        port: row.port,
        owner_count: Array.isArray(row.owners) ? row.owners.length : 0,
        reason: 'owners-dead-health-unreachable',
      }, fsModule, processObj, osModule);
    }
    if (reaped.length > 0) {
      writeLedgerUnlocked(dir, kept, fsModule, deps);
    }
    return reaped;
  });
}

/**
 * Find a healthy reusable sidecar with matching owner token and config hash.
 *
 * @param {string} dir - Sidecar state directory.
 * @param {string} ownerToken - Owner token expected from the sidecar health payload.
 * @param {string} configHash - Canonical config hash expected from the sidecar health payload.
 * @param {Record<string, unknown>} deps - Dependency overrides used by liveness and health checks.
 * @param {NodeJS.Process} processObj - Process-like object with `kill`.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {Promise<Record<string, unknown> | null>} Reusable ledger row, or null when none match.
 */
async function findReusableSidecar(dir, ownerToken, configHash, deps, processObj, fsModule) {
  const rows = readLedger(dir, fsModule);
  const kept = [];
  for (const row of rows) {
    const liveness = processLiveness(row.pid, processObj, null, null, deps);
    if (!liveness.alive) continue;
    kept.push(row);
    if (
      row.ownerToken === ownerToken
      && row.canonicalConfigHash === configHash
      && await isHealthy(row.port, 2000, { ...deps, expectedOwnerToken: ownerToken, expectedConfigHash: configHash })
    ) {
      return row;
    }
  }
  if (kept.length !== rows.length) {
    writeLedger(dir, kept, fsModule, deps);
  }
  return null;
}

// ───── SECTION: spawn path helpers ─────

/**
 * Resolve launcher dependencies from options with production defaults.
 *
 * @param {{deps?: Record<string, unknown>}} options - Launcher options containing optional test dependencies.
 * @returns {Record<string, unknown>} Complete dependency bag.
 */
function resolveLauncherDeps(options) {
  const deps = options.deps ?? {};
  return {
    ...deps,
    fs: deps.fs ?? fs,
    os: deps.os ?? os,
    spawn: deps.spawn ?? spawn,
    process: deps.process ?? process,
    log: deps.log ?? log,
    fetch: deps.fetch ?? globalThis.fetch,
  };
}

/**
 * Decide whether launcher startup should be skipped because cross-encoder mode is disabled.
 *
 * @param {{skipIfDisabled?: boolean}} options - Launcher options.
 * @param {NodeJS.Process} processObj - Process-like object with environment values.
 * @returns {boolean} True when startup should degrade to disabled fallback.
 */
function shouldSkipDisabled(options, processObj) {
  const skipIfDisabled = options.skipIfDisabled !== false;
  const crossEncoderEnabled = String(processObj.env.SPECKIT_CROSS_ENCODER || '').toLowerCase() === 'true';
  return skipIfDisabled && !crossEncoderEnabled;
}

/**
 * Resolve the sidecar start script path.
 *
 * @param {{sidecarSkillPath?: string}} options - Launcher options with optional sidecar skill root.
 * @returns {string} Absolute start script path.
 */
function resolveStartScriptPath(options) {
  const sidecarSkillPath = options.sidecarSkillPath
    ? path.resolve(options.sidecarSkillPath)
    : SIDECAR_SKILL_PATH;
  return path.join(sidecarSkillPath, 'scripts', 'start.sh');
}

/**
 * Resolve the ledger directory and report state-dir validation failures to stderr.
 *
 * @param {NodeJS.Process} processObj - Process-like object with env and stderr.
 * @param {typeof os} osModule - OS implementation used to resolve the home directory.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {string} Valid sidecar state directory.
 * @throws {StateDirValidationError} when state directory validation fails.
 */
function resolveLedgerDir(processObj, osModule, fsModule) {
  try {
    return stateDir(processObj, osModule, fsModule);
  } catch (error) {
    if (error instanceof StateDirValidationError && processObj.stderr?.write) {
      processObj.stderr.write(`[ensure-rerank-sidecar] ${error.message}\n`);
    }
    throw error;
  }
}

/**
 * Reuse an existing sidecar when ledger and health checks match this launcher.
 *
 * @param {string} ledgerDir - Sidecar state directory.
 * @param {string} ownerToken - Owner token expected from health payload.
 * @param {string} configHash - Canonical config hash expected from health payload.
 * @param {Record<string, unknown>} currentOwner - Current launcher owner identity.
 * @param {Record<string, unknown>} deps - Dependency bag.
 * @param {NodeJS.Process} processObj - Process-like object with `kill`.
 * @param {typeof fs} fsModule - Filesystem implementation.
 * @returns {Promise<Record<string, unknown> | null>} Reuse result, or null when no sidecar is reusable.
 * @throws {Error} when owner registration fails.
 */
async function reuseExistingSidecar(ledgerDir, ownerToken, configHash, currentOwner, deps, processObj, fsModule) {
  const reusable = await findReusableSidecar(ledgerDir, ownerToken, configHash, deps, processObj, fsModule);
  if (reusable) {
    lockedRegisterOwner(ledgerDir, reusable.pid, currentOwner, fsModule, deps);
    return { spawned: false, port: reusable.port, ownerPid: reusable.pid, ledger: 'healthy-reusable' };
  }
  return null;
}

/**
 * Spawn the sidecar start script with isolated stdio and allowlisted environment.
 *
 * @param {string} startScriptPath - Absolute sidecar start script path.
 * @param {number} port - Port assigned to the sidecar.
 * @param {string} ownerToken - Owner token passed to the sidecar.
 * @param {string} configHash - Canonical config hash passed to the sidecar.
 * @param {Record<string, unknown>} deps - Dependency bag containing `spawn`, `fs`, `os`, and `process`.
 * @returns {import('child_process').ChildProcess} Spawned detached child process.
 */
function spawnSidecarProcess(startScriptPath, port, ownerToken, configHash, deps) {
  const logFd = openSidecarLogFd(deps.fs, deps.os);
  return deps.spawn('bash', [startScriptPath], {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: buildSidecarEnv(deps.process.env, {
      RERANK_SIDECAR_PORT: String(port),
      RERANK_SIDECAR_OWNER_TOKEN: ownerToken,
      RERANK_SIDECAR_CONFIG_HASH: configHash,
    }),
  });
}

/**
 * Spawn a new sidecar, record it in the ledger, and wait for warmup health.
 *
 * @param {Record<string, unknown>} context - Spawn context with script path, owner data, deps, timeout, and ledger directory.
 * @returns {Promise<Record<string, unknown>>} Spawn, fallback, and ledger outcome details.
 * @throws {Error} when process spawning or initial ledger recording fails.
 */
async function spawnAndRecordSidecar(context) {
  const { startScriptPath, port, ownerToken, configHash, currentOwner, deps, timeoutMs, ledgerDir } = context;
  if (!deps.fs.existsSync(startScriptPath)) {
    deps.log(`sidecar skill missing at ${startScriptPath}; degrading to positional fallback`);
    return { spawned: false, port, fallback: 'no-sidecar-skill' };
  }
  const child = spawnSidecarProcess(startScriptPath, port, ownerToken, configHash, deps);
  child.unref();
  addLedgerRow(ledgerDir, {
    pid: child.pid,
    port,
    ownerToken,
    startedAtIso: new Date().toISOString(),
    lastHealthIso: new Date().toISOString(),
    executablePath: deps.process.execPath,
    canonicalConfigHash: configHash,
    owners: [currentOwner],
    ownersListPresent: true,
    reaper: REAPER_POLICY,
  }, deps.fs, deps);

  const ok = await waitForHealthy(port, Date.now() + timeoutMs, {
    ...deps,
    expectedOwnerToken: ownerToken,
    expectedConfigHash: configHash,
  });
  if (!ok) {
    try {
      deps.process.kill(child.pid, 'SIGTERM');
    } catch {
      // Best-effort cleanup; caller degrades to positional fallback either way.
    }
    deps.log(`sidecar warmup timed out after ${timeoutMs}ms`);
    return { spawned: false, port, ownerPid: child.pid, fallback: 'warmup-timeout', ledger: 'recorded-before-warmup' };
  }

  deps.log(`sidecar spawned PID=${child.pid} listening on :${port}`);
  return { spawned: true, port, ownerPid: child.pid, ledger: 'recorded' };
}

/**
 * Ensure a compatible rerank sidecar is available or return a fallback reason.
 *
 * @param {Record<string, unknown>} [options] - Launcher options and optional dependency overrides.
 * @returns {Promise<Record<string, unknown>>} Spawn, reuse, or fallback result for caller routing.
 * @throws {StateDirValidationError} when state directory validation fails.
 * @throws {ConfigHashInputError} when config hash inputs are invalid.
 * @throws {Error} when owner token, ledger lock, spawn, or warmup setup fails unexpectedly.
 */
async function ensureRerankSidecar(options = {}) {
  const deps = resolveLauncherDeps(options);
  const port = resolvePort(options.port ?? deps.process.env.RERANK_SIDECAR_PORT);
  const timeoutMs = resolveTimeoutMs(options.healthTimeoutMs ?? DEFAULT_HEALTH_TIMEOUT_MS);
  if (shouldSkipDisabled(options, deps.process)) {
    return { spawned: false, port, fallback: 'cross-encoder-disabled' };
  }

  const startScriptPath = resolveStartScriptPath(options);
  const ledgerDir = resolveLedgerDir(deps.process, deps.os, deps.fs);
  const ownerToken = loadOrCreateOwnerToken(ledgerDir, deps.fs, deps.process, deps);
  const configHash = canonicalConfigHash(port, deps.process.env);
  const currentOwner = currentOwnerIdentity(deps.process, deps);

  await reapStaleSidecars(ledgerDir, deps, deps.process, deps.fs, deps.os);
  const reusable = await reuseExistingSidecar(ledgerDir, ownerToken, configHash, currentOwner, deps, deps.process, deps.fs);
  if (reusable) return reusable;

  if (await isHealthy(port, 2000, deps)) {
    return { spawned: false, port, fallback: 'unknown-healthy-port' };
  }

  return spawnAndRecordSidecar({
    startScriptPath,
    port,
    ownerToken,
    configHash,
    currentOwner,
    deps,
    timeoutMs,
    ledgerDir,
  });
}

// ───── SECTION: exports ─────

module.exports = {
  ensureRerankSidecar,
  healthPayload,
  normalizeHealthPayload,
  canonicalConfigHash,
  ConfigHashInputError,
  StateDirValidationError,
  buildSidecarEnv,
  fsyncDirOf,
  loadOrCreateOwnerToken,
  writeLedger,
  processLiveness,
  shouldReapRow,
  parseProcessIdentityOutput,
  reapStaleSidecars,
  readLedger,
};
