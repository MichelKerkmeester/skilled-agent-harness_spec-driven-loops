'use strict';

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');
const { spawn } = childProcess;
const { isAllowedSidecarEnvKey } = require('./sidecar-env-allowlist.cjs');

const SIDECAR_SKILL_PATH = path.resolve(__dirname, '..', '..', 'skills', 'system-rerank-sidecar');
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
class ConfigHashInputError extends Error {
  constructor(key, reason) {
    super(`Invalid config hash input for ${key}: ${reason}`);
    this.name = 'ConfigHashInputError';
    this.key = key;
  }
}

class StateDirValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StateDirValidationError';
  }
}

function log(message) {
  process.stderr.write(`[ensure-rerank-sidecar] ${message}\n`);
}

function resolvePositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function resolvePort(value) {
  return resolvePositiveInteger(value, DEFAULT_PORT);
}

function resolveTimeoutMs(value) {
  return resolvePositiveInteger(value, DEFAULT_HEALTH_TIMEOUT_MS);
}

function ownerTokenDigest(ownerToken) {
  return crypto.createHash('sha256').update(ownerToken, 'utf8').digest('hex');
}

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

async function healthPayload(port, timeoutMs, deps = {}) {
  return normalizeHealthPayload(await readRawHealthPayload(port, timeoutMs, deps), port);
}

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

async function waitForHealthy(port, deadline, deps = {}) {
  const sleep = deps.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  while (Date.now() < deadline) {
    if (await isHealthy(port, 2000, deps)) return true;
    await sleep(500);
  }
  return false;
}

function randomHex(bytes, deps = {}) {
  return (deps.crypto ?? crypto).randomBytes(bytes).toString('hex');
}

function fsyncDirOf(targetPath, fsModule) {
  if (typeof fsModule.openSync !== 'function' || typeof fsModule.fsyncSync !== 'function') return;
  const dirFd = fsModule.openSync(path.dirname(targetPath), 'r');
  try {
    fsModule.fsyncSync(dirFd);
  } finally {
    fsModule.closeSync(dirFd);
  }
}

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

function hasTraversalSegment(inputPath) {
  return String(inputPath).split(/[\\/]+/).includes('..');
}

function pathInside(parentPath, candidatePath) {
  const relative = path.relative(parentPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

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

function ownerTokenPath(dir) {
  return path.join(dir, OWNER_TOKEN_FILE_NAME);
}

function buildSidecarEnv(parentEnv, overrides) {
  const childEnv = {};
  for (const [key, value] of Object.entries(parentEnv)) {
    if (typeof value === 'string' && isAllowedSidecarEnvKey(key)) {
      childEnv[key] = value;
    }
  }
  return { ...childEnv, ...overrides };
}

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

function readOwnerTokenIfPresent(tokenPath, fsModule) {
  try {
    const existing = fsModule.readFileSync(tokenPath, 'utf8').trim();
    return existing || null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function waitForOwnerToken(tokenPath, fsModule, originalError) {
  const deadline = Date.now() + OWNER_TOKEN_WAIT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const existing = readOwnerTokenIfPresent(tokenPath, fsModule);
    if (existing) return existing;
    sleepSync(OWNER_TOKEN_WAIT_INTERVAL_MS);
  }
  throw originalError;
}

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

function validateConfigHashInputs(config) {
  let totalBytes = 0;
  for (const key of Object.keys(config).sort()) {
    totalBytes = validateConfigHashValue(key, config[key], totalBytes);
  }
}

function canonicalConfigHash(port, env) {
  // Empty string is treated as "not set" via || operator (matches Python contract)
  // Python sibling mirrors this contract in ensure_rerank_sidecar.py:135-150
  // Both implementations treat empty RERANK_MODEL_REVISION as "use default"
  const config = {
    RERANK_ALLOWED_MODELS: readConfigHashEnvValue(env, 'RERANK_ALLOWED_MODELS', ''),
    RERANK_DEVICE: readConfigHashEnvValue(env, 'RERANK_DEVICE', ''),
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

function ledgerPath(dir) {
  return path.join(dir, LEDGER_FILE_NAME);
}

function parseProcessIdentityOutput(output) {
  const firstLine = String(output || '').split(/\r?\n/).find((line) => line.trim()) || '';
  if (firstLine.length < 24) return null;
  const createTimestamp = firstLine.slice(0, 24).trim();
  const comm = firstLine.slice(24).trim();
  if (!createTimestamp || !comm) return null;
  return { createTimestamp, comm };
}

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

function ownerIdentityId(source, pid, createTimestamp, comm) {
  return `${source}:${pid}:${createTimestamp || 'unknown'}:${comm || 'unknown'}`;
}

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

function rawRowsFromPayload(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== 'object') return [];
  if (Array.isArray(parsed.sidecars)) return parsed.sidecars;
  if (Array.isArray(parsed.rows)) return parsed.rows;
  return [];
}

function readLedgerUnlocked(dir, fsModule) {
  try {
    const parsed = JSON.parse(fsModule.readFileSync(ledgerPath(dir), 'utf8'));
    return rawRowsFromPayload(parsed).map(normalizeRow).filter(Boolean);
  } catch {
    return [];
  }
}

function readLedger(dir, fsModule) {
  return readLedgerUnlocked(dir, fsModule);
}

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

function writeLedger(dir, rows, fsModule, deps = {}) {
  return withLedgerLockSync(dir, fsModule, () => writeLedgerUnlocked(dir, rows, fsModule, deps));
}

function addLedgerRow(dir, row, fsModule, deps = {}) {
  const rows = readLedger(dir, fsModule).filter((existing) => existing.pid !== row.pid);
  rows.push(row);
  writeLedger(dir, rows, fsModule, deps);
}

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

function ownerLiveness(owner, processObj, deps = {}) {
  return processLiveness(owner.pid, processObj, owner.createTimestamp, owner.comm, deps);
}

function shouldReapRow(row, processObj, deps = {}) {
  if (row.ownersListPresent === false) return false;
  if (!Array.isArray(row.owners) || row.owners.length === 0) return true;
  return !row.owners.some((owner) => ownerLiveness(owner, processObj, deps).alive === true);
}

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

function reaperTelemetryPath(ledgerDir, processObj, osModule) {
  const configured = String(processObj.env.RERANK_SIDECAR_REAPER_TELEMETRY_PATH || '').trim();
  if (configured) return path.resolve(configured);
  return path.join(osModule.homedir(), 'Library', 'Logs', 'spec-kit', 'sidecar-reaper.jsonl');
}

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

function shouldSkipDisabled(options, processObj) {
  const skipIfDisabled = options.skipIfDisabled !== false;
  const crossEncoderEnabled = String(processObj.env.SPECKIT_CROSS_ENCODER || '').toLowerCase() === 'true';
  return skipIfDisabled && !crossEncoderEnabled;
}

function resolveStartScriptPath(options) {
  const sidecarSkillPath = options.sidecarSkillPath
    ? path.resolve(options.sidecarSkillPath)
    : SIDECAR_SKILL_PATH;
  return path.join(sidecarSkillPath, 'scripts', 'start.sh');
}

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

async function reuseExistingSidecar(ledgerDir, ownerToken, configHash, currentOwner, deps, processObj, fsModule) {
  const reusable = await findReusableSidecar(ledgerDir, ownerToken, configHash, deps, processObj, fsModule);
  if (reusable) {
    lockedRegisterOwner(ledgerDir, reusable.pid, currentOwner, fsModule, deps);
    return { spawned: false, port: reusable.port, ownerPid: reusable.pid, ledger: 'healthy-reusable' };
  }
  return null;
}

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
