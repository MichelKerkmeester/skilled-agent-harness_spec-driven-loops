'use strict';

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const SIDECAR_SKILL_PATH = path.resolve(__dirname, '..', '..', 'skills', 'system-rerank-sidecar');
const START_SCRIPT_PATH = path.join(SIDECAR_SKILL_PATH, 'scripts', 'start.sh');
const DEFAULT_PORT = 8765;
const DEFAULT_HEALTH_TIMEOUT_MS = 20000;
const LEDGER_FILE_NAME = '.sidecar-ledger.json';
const OWNER_TOKEN_FILE_NAME = '.sidecar-owner-token';
const MAX_HEALTH_BODY_BYTES = 65536; // 64KB

function log(message) {
  process.stderr.write(`[ensure-rerank-sidecar] ${message}\n`);
}

function resolvePort(value, fallback = DEFAULT_PORT) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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

function loadOrCreateOwnerToken(dir, fsModule, processObj) {
  const explicit = String(processObj.env.RERANK_SIDECAR_OWNER_TOKEN || '').trim();
  if (explicit) return explicit;
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const tokenPath = ownerTokenPath(dir);
  try {
    const existing = fsModule.readFileSync(tokenPath, 'utf8').trim();
    if (existing) return existing;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const token = crypto.randomBytes(24).toString('base64url');
  try {
    fsModule.writeFileSync(tokenPath, `${token}\n`, { mode: 0o600, flag: 'wx' });
    return token;
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const existing = fsModule.readFileSync(tokenPath, 'utf8').trim();
    if (!existing) throw error;
    return existing;
  }
}

function canonicalConfigHash(port, env) {
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

function readLedger(dir, fsModule) {
  try {
    const parsed = JSON.parse(fsModule.readFileSync(ledgerPath(dir), 'utf8'));
    const rows = Array.isArray(parsed) ? parsed : parsed.sidecars;
    if (!Array.isArray(rows)) return [];
    return rows.filter((row) => (
      row
      && Number.isInteger(row.pid)
      && Number.isInteger(row.port)
      && typeof row.ownerToken === 'string'
      && typeof row.canonicalConfigHash === 'string'
    ));
  } catch {
    return [];
  }
}

function writeLedger(dir, rows, fsModule) {
  fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const target = ledgerPath(dir);
  const tmp = `${target}.tmp.${crypto.randomBytes(16).toString('hex')}`;
  const fd = fsModule.openSync(tmp, 'wx');
  try {
    fsModule.writeSync(fd, `${JSON.stringify({ version: 1, sidecars: rows }, null, 2)}\n`);
  } finally {
    fsModule.closeSync(fd);
  }
  fsModule.renameSync(tmp, target);
}

function addLedgerRow(dir, row, fsModule) {
  const rows = readLedger(dir, fsModule).filter((existing) => existing.pid !== row.pid);
  rows.push(row);
  writeLedger(dir, rows, fsModule);
}

function processLiveness(pid, processObj) {
  try {
    processObj.kill(pid, 0);
    return 'alive';
  } catch (error) {
    if (error.code === 'ESRCH') return 'dead';
    if (error.code === 'EPERM') return 'eperm';
    return 'alive';
  }
}

async function findReusableSidecar(dir, ownerToken, configHash, deps, processObj, fsModule) {
  const rows = readLedger(dir, fsModule);
  const kept = [];
  for (const row of rows) {
    const liveness = processLiveness(row.pid, processObj);
    if (liveness === 'dead') continue;
    kept.push(row);
    if (
      liveness === 'alive'
      && row.ownerToken === ownerToken
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
  const timeoutMs = resolvePort(options.healthTimeoutMs ?? DEFAULT_HEALTH_TIMEOUT_MS, DEFAULT_HEALTH_TIMEOUT_MS);
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

  const reusable = await findReusableSidecar(ledgerDir, ownerToken, configHash, deps, processObj, fsModule);
  if (reusable) {
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
    env: {
      ...processObj.env,
      RERANK_SIDECAR_PORT: String(port),
      RERANK_SIDECAR_OWNER_TOKEN: ownerToken,
      RERANK_SIDECAR_CONFIG_HASH: configHash,
    },
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
  DEFAULT_HEALTH_TIMEOUT_MS,
  DEFAULT_PORT,
  START_SCRIPT_PATH,
  ensureRerankSidecar,
  healthPayload,
  isHealthy,
  waitForHealthy,
  canonicalConfigHash,
  loadOrCreateOwnerToken,
  writeLedger,
  readLedger,
};
