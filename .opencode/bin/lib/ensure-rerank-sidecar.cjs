'use strict';

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');
const { spawn } = childProcess;

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
const CHILD_ENV_ALLOWLIST = new Set([
  'HOME',
  'LANG',
  'PATH',
  'TEMP',
  'TMP',
  'TMPDIR',
  'TRANSFORMERS_OFFLINE',
  'PYTORCH_ENABLE_MPS_FALLBACK',
]);

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

async function healthPayload(port, timeoutMs, deps = {}) {
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

async function isHealthy(port, timeoutMs, deps = {}) {
  const payload = await healthPayload(port, timeoutMs, deps);
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

function openSidecarLogFd(fsModule, osModule) {
  const candidates = [
    path.join(osModule.homedir(), '.cache', 'mk-reranker'),
    path.join(os.tmpdir(), 'mk-reranker'),
  ];
  for (const cacheDir of candidates) {
    try {
      fsModule.mkdirSync(cacheDir, { recursive: true });
      return fsModule.openSync(path.join(cacheDir, 'sidecar.log'), 'a');
    } catch {
      // Try the next log directory; logging must not block MCP startup.
    }
  }
  return 'ignore';
}

function stateDir(processObj, osModule) {
  const configured = String(processObj.env.RERANK_SIDECAR_STATE_DIR || '').trim();
  return configured ? path.resolve(configured) : path.join(osModule.homedir(), '.cache', 'mk-reranker');
}

function ownerTokenPath(dir) {
  return path.join(dir, OWNER_TOKEN_FILE_NAME);
}

function isAllowedChildEnvKey(key) {
  return CHILD_ENV_ALLOWLIST.has(key)
    || key.startsWith('LC_')
    || key.startsWith('SPECKIT_')
    || key.startsWith('RERANK_')
    || key.startsWith('HF_');
}

function buildSidecarEnv(parentEnv, overrides) {
  const childEnv = {};
  for (const [key, value] of Object.entries(parentEnv)) {
    if (typeof value === 'string' && isAllowedChildEnvKey(key)) {
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

function writeOwnerTokenAtomic(tokenPath, token, fsModule) {
  const tmp = `${tokenPath}.tmp.${crypto.randomBytes(16).toString('hex')}`;
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
  } catch (error) {
    try {
      fsModule.unlinkSync?.(tmp);
    } catch {
      // Best-effort cleanup after failed publish.
    }
    throw error;
  }
}

function loadOrCreateOwnerToken(dir, fsModule, processObj) {
  const explicit = String(processObj.env.RERANK_SIDECAR_OWNER_TOKEN || '').trim();
  if (explicit) return explicit;
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const tokenPath = ownerTokenPath(dir);
  const existing = readOwnerTokenIfPresent(tokenPath, fsModule);
  if (existing) return existing;

  const token = crypto.randomBytes(24).toString('base64url');
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
    writeOwnerTokenAtomic(tokenPath, token, fsModule);
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

function canonicalConfigHash(port, env) {
  // Empty string is treated as "not set" via || operator (matches Python contract)
  // Python sibling mirrors this contract in ensure_rerank_sidecar.py:135-150
  // Both implementations treat empty RERANK_MODEL_REVISION as "use default"
  const config = {
    allowed: env.RERANK_ALLOWED_MODELS || '',
    device: env.RERANK_DEVICE || '',
    dtype: env.RERANK_TORCH_DTYPE || '',
    model: env.RERANK_MODEL_NAME || 'Qwen/Qwen3-Reranker-0.6B',
    port: String(port),
    revision: env.RERANK_MODEL_REVISION || 'e61197ed45024b0ed8a2d74b80b4d909f1255473',
    revisions: env.RERANK_MODEL_REVISIONS || '',
  };
  const stable = Object.keys(config).sort().map((key) => `${key}=${config[key]}`).join('\n');
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
  const lockFd = fsModule.openSync(lockPath, 'wx');
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
  const lockFd = fsModule.openSync(lockPath, 'wx');
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

function writeLedgerUnlocked(dir, rows, fsModule) {
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const target = ledgerPath(dir);
  const tmp = `${target}.tmp.${crypto.randomBytes(16).toString('hex')}`;
  const fd = fsModule.openSync(tmp, 'wx');
  try {
    fsModule.writeSync(fd, `${JSON.stringify({ version: LEDGER_VERSION, sidecars: rows.map(serializeRow) }, null, 2)}\n`);
  } finally {
    fsModule.closeSync(fd);
  }
  fsModule.renameSync(tmp, target);
}

function writeLedger(dir, rows, fsModule) {
  return withLedgerLockSync(dir, fsModule, () => writeLedgerUnlocked(dir, rows, fsModule));
}

function addLedgerRow(dir, row, fsModule) {
  const rows = readLedger(dir, fsModule).filter((existing) => existing.pid !== row.pid);
  rows.push(row);
  writeLedger(dir, rows, fsModule);
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

function lockedRegisterOwner(dir, sidecarPid, owner, fsModule) {
  return withLedgerLockSync(dir, fsModule, () => {
    const currentRows = readLedgerUnlocked(dir, fsModule);
    const result = registerOwnerInRows(currentRows, sidecarPid, owner);
    if (result.changed) {
      writeLedgerUnlocked(dir, result.rows, fsModule);
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
    fsModule.mkdirSync(path.dirname(target), { recursive: true });
    fsModule.appendFileSync(target, `${JSON.stringify(event)}\n`, 'utf8');
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
      writeLedgerUnlocked(dir, kept, fsModule);
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
    writeLedger(dir, kept, fsModule);
  }
  return null;
}

async function ensureRerankSidecar(options = {}) {
  const deps = options.deps ?? {};
  const fsModule = deps.fs ?? fs;
  const osModule = deps.os ?? os;
  const spawnFn = deps.spawn ?? spawn;
  const processObj = deps.process ?? process;
  const logger = deps.log ?? log;
  const port = resolvePort(options.port ?? processObj.env.RERANK_SIDECAR_PORT);
  const timeoutMs = resolveTimeoutMs(options.healthTimeoutMs ?? DEFAULT_HEALTH_TIMEOUT_MS);
  const skipIfDisabled = options.skipIfDisabled !== false;
  const crossEncoderEnabled = String(processObj.env.SPECKIT_CROSS_ENCODER || '').toLowerCase() === 'true';
  const sidecarSkillPath = options.sidecarSkillPath
    ? path.resolve(options.sidecarSkillPath)
    : SIDECAR_SKILL_PATH;
  const startScriptPath = path.join(sidecarSkillPath, 'scripts', 'start.sh');
  const ledgerDir = stateDir(processObj, osModule);
  const ownerToken = loadOrCreateOwnerToken(ledgerDir, fsModule, processObj);
  const configHash = canonicalConfigHash(port, processObj.env);

  if (skipIfDisabled && !crossEncoderEnabled) {
    return { spawned: false, port, fallback: 'cross-encoder-disabled' };
  }

  const currentOwner = currentOwnerIdentity(processObj, deps);
  await reapStaleSidecars(ledgerDir, deps, processObj, fsModule, osModule);

  const reusable = await findReusableSidecar(ledgerDir, ownerToken, configHash, deps, processObj, fsModule);
  if (reusable) {
    lockedRegisterOwner(ledgerDir, reusable.pid, currentOwner, fsModule);
    return { spawned: false, port: reusable.port, ownerPid: reusable.pid, ledger: 'healthy-reusable' };
  }

  if (await isHealthy(port, 2000, deps)) {
    return { spawned: false, port, fallback: 'unknown-healthy-port' };
  }

  if (!fsModule.existsSync(startScriptPath)) {
    logger(`sidecar skill missing at ${startScriptPath}; degrading to positional fallback`);
    return { spawned: false, port, fallback: 'no-sidecar-skill' };
  }

  const logFd = openSidecarLogFd(fsModule, osModule);
  const child = spawnFn('bash', [startScriptPath], {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: buildSidecarEnv(processObj.env, {
      RERANK_SIDECAR_PORT: String(port),
      RERANK_SIDECAR_OWNER_TOKEN: ownerToken,
      RERANK_SIDECAR_CONFIG_HASH: configHash,
    }),
  });
  child.unref();
  addLedgerRow(ledgerDir, {
    pid: child.pid,
    port,
    ownerToken,
    startedAtIso: new Date().toISOString(),
    lastHealthIso: new Date().toISOString(),
    executablePath: processObj.execPath,
    canonicalConfigHash: configHash,
    owners: [currentOwner],
    ownersListPresent: true,
    reaper: REAPER_POLICY,
  }, fsModule);

  const ok = await waitForHealthy(port, Date.now() + timeoutMs, {
    ...deps,
    expectedOwnerToken: ownerToken,
    expectedConfigHash: configHash,
  });
  if (!ok) {
    try {
      processObj.kill(child.pid, 'SIGTERM');
    } catch {
      // Best-effort cleanup; caller degrades to positional fallback either way.
    }
    logger(`sidecar warmup timed out after ${timeoutMs}ms`);
    return { spawned: false, port, ownerPid: child.pid, fallback: 'warmup-timeout', ledger: 'recorded-before-warmup' };
  }

  logger(`sidecar spawned PID=${child.pid} listening on :${port}`);
  return { spawned: true, port, ownerPid: child.pid, ledger: 'recorded' };
}

module.exports = {
  ensureRerankSidecar,
  healthPayload,
  canonicalConfigHash,
  loadOrCreateOwnerToken,
  writeLedger,
  processLiveness,
  shouldReapRow,
  parseProcessIdentityOutput,
  reapStaleSidecars,
  readLedger,
};
