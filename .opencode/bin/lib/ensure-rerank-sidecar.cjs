'use strict';

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SIDECAR_SKILL_PATH = path.resolve(__dirname, '..', '..', 'skills', 'system-rerank-sidecar');
const START_SCRIPT_PATH = path.join(SIDECAR_SKILL_PATH, 'scripts', 'start.sh');
const DEFAULT_PORT = 8765;
const DEFAULT_HEALTH_TIMEOUT_MS = 20000;

function log(message) {
  process.stderr.write(`[ensure-rerank-sidecar] ${message}\n`);
}

function resolvePort(value, fallback = DEFAULT_PORT) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function isHealthy(port, timeoutMs, deps = {}) {
  const httpModule = deps.http ?? http;
  return new Promise((resolve) => {
    const req = httpModule.get({ host: '127.0.0.1', port, path: '/health', timeout: timeoutMs }, (res) => {
      const ok = res.statusCode === 200;
      res.resume();
      resolve(ok);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
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

  if (skipIfDisabled && !crossEncoderEnabled) {
    return { spawned: false, port, fallback: 'cross-encoder-disabled' };
  }

  if (await isHealthy(port, 2000, deps)) {
    return { spawned: false, port, ownerPid: null };
  }

  if (!fsModule.existsSync(startScriptPath)) {
    logger(`sidecar skill missing at ${startScriptPath}; degrading to positional fallback`);
    return { spawned: false, port, fallback: 'no-sidecar-skill' };
  }

  const logFd = openSidecarLogFd(fsModule, osModule);
  const child = spawnFn('bash', [startScriptPath], {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: { ...processObj.env, RERANK_SIDECAR_PORT: String(port) },
  });
  child.unref();

  const ok = await waitForHealthy(port, Date.now() + timeoutMs, deps);
  if (!ok) {
    try {
      processObj.kill(child.pid, 'SIGTERM');
    } catch {
      // Best-effort cleanup; caller degrades to positional fallback either way.
    }
    logger(`sidecar warmup timed out after ${timeoutMs}ms`);
    return { spawned: false, port, fallback: 'warmup-timeout' };
  }

  logger(`sidecar spawned PID=${child.pid} listening on :${port}`);
  return { spawned: true, port, ownerPid: child.pid };
}

module.exports = {
  DEFAULT_HEALTH_TIMEOUT_MS,
  DEFAULT_PORT,
  START_SCRIPT_PATH,
  ensureRerankSidecar,
  isHealthy,
  waitForHealthy,
};
