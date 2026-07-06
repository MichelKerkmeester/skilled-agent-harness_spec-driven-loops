#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: HF Model Server                                                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Local HTTP/UDS embedding server for HuggingFace transformers      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const http = require('http');
const net = require('net');
const path = require('path');
const { createRequire } = require('module');
const { pathToFileURL } = require('url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SOCKET_FILE_NAME = 'hf-embed.sock';
const DEFAULT_MODEL = 'nomic-ai/nomic-embed-text-v1.5';
const DEFAULT_DTYPE = 'q8';
const DEFAULT_INFERENCE_TIMEOUT_MS = 30000;
const MODEL_LOAD_TIMEOUT = 120000;
const INFERENCE_DRAIN_TIMEOUT_MS = 5000;
const ALLOWED_HF_LOCAL_DTYPES = Object.freeze([
  'fp32',
  'fp16',
  'q4',
  'q4f16',
  'q8',
  'int8',
  'uint8',
  'bnb4',
]);
const HEALTH_PATH = '/api/health';
const EMBED_PATH = '/api/embed';
const MAX_REQUEST_BYTES = 1024 * 1024;
const DEFAULT_SELF_WARM_INPUT = 'test warmup query';
// Loopback hosts we permit binding without an explicit auth token. Any other host
// exposes the embedding server (which loads + runs arbitrary model inference on
// caller-supplied text) to the network, so it is refused unless the operator opts
// in via HF_EMBED_ALLOW_REMOTE_BIND=1 AND supplies HF_EMBED_AUTH_TOKEN.
const LOOPBACK_BIND_HOSTS = Object.freeze(['127.0.0.1', '::1', 'localhost']);
// How long the perimeter live-resident probe waits for a UDS connection before
// concluding the socket is stale. Bounded so a hung peer cannot wedge startup.
const SOCKET_RESIDENT_PROBE_TIMEOUT_MS = 250;

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATH AND TRANSPORT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function repoRoot() {
  return path.resolve(__dirname, '..', '..');
}

function systemSpecKitRoot() {
  return path.join(repoRoot(), '.opencode', 'skills', 'system-spec-kit');
}

function defaultDbDir() {
  return path.join(systemSpecKitRoot(), 'mcp_server', 'database');
}

function normalizeProfileDtype(value) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  return normalized.replace(/[^a-z0-9-_.]/g, '_').replace(/__+/g, '_');
}

function resolveDtype(explicit) {
  const raw = explicit ?? process.env.HF_EMBEDDINGS_DTYPE ?? DEFAULT_DTYPE;
  const normalized = normalizeProfileDtype(raw);
  if (!normalized || !ALLOWED_HF_LOCAL_DTYPES.includes(normalized)) {
    console.warn(
      `[hf-model-server] Unknown HF_EMBEDDINGS_DTYPE="${raw}"; falling back to ${DEFAULT_DTYPE}. Allowed: ${ALLOWED_HF_LOCAL_DTYPES.join(', ')}`,
    );
    return DEFAULT_DTYPE;
  }
  return normalized;
}

function normalizeListenTarget(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }
  const raw = value.trim();
  if (raw.startsWith('tcp://')) {
    return raw;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    const url = new URL(raw);
    return `tcp://${url.hostname}:${url.port || (url.protocol === 'https:' ? '443' : '80')}`;
  }
  if (raw.startsWith('unix://')) {
    return path.resolve(raw.slice('unix://'.length));
  }
  return path.resolve(raw);
}

function resolveListenTarget(options = {}) {
  const env = options.env ?? process.env;
  const explicitTarget = normalizeListenTarget(options.listenTarget ?? env.HF_EMBED_SERVER_URL);
  if (explicitTarget) {
    return explicitTarget;
  }
  if (env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
    return env.SPECKIT_IPC_SOCKET_DIR;
  }

  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
    ? path.resolve(env.SPECKIT_IPC_SOCKET_DIR)
    : path.resolve(options.dbDir ?? defaultDbDir());
  return path.join(socketDir, SOCKET_FILE_NAME);
}

function toConnectionOptions(socketPath) {
  if (!socketPath.startsWith('tcp://')) {
    return socketPath;
  }
  const url = new URL(socketPath);
  return {
    host: url.hostname,
    port: Number.parseInt(url.port, 10),
  };
}

function getListeningEndpoint(server, target) {
  const address = server.address();
  if (address && typeof address === 'object') {
    return `tcp://${address.address}:${address.port}`;
  }
  return target;
}

function isLoopbackHost(host) {
  if (typeof host !== 'string' || host.trim() === '') {
    // An empty/missing host defaults to the loopback bind in listenOnce, so it is safe.
    return true;
  }
  return LOOPBACK_BIND_HOSTS.includes(host.trim().toLowerCase());
}

// A tcp:// target takes its host verbatim from the operator URL. Binding a
// non-loopback host would expose model inference to the network. Refuse unless the operator
// explicitly opts into a remote bind AND provides an auth token. Pure host/env check so it is
// deterministically testable without opening a socket.
function assertLoopbackBindAllowed(target, options = {}) {
  if (typeof target !== 'string' || !target.startsWith('tcp://')) {
    return;
  }
  const url = new URL(target);
  const host = url.hostname;
  if (isLoopbackHost(host)) {
    return;
  }
  const env = options.env ?? process.env;
  const allowRemote = env.HF_EMBED_ALLOW_REMOTE_BIND === '1' || env.HF_EMBED_ALLOW_REMOTE_BIND === 'true';
  const authToken = typeof env.HF_EMBED_AUTH_TOKEN === 'string' ? env.HF_EMBED_AUTH_TOKEN.trim() : '';
  if (allowRemote && authToken.length > 0) {
    return;
  }
  const error = new Error(
    `[hf-model-server] Refusing to bind non-loopback host "${host}" for ${target}. ` +
    'The embedding server has no transport auth; binding a routable interface would expose ' +
    'model inference to the network. Use a loopback host (127.0.0.1/::1/localhost), or set ' +
    'HF_EMBED_ALLOW_REMOTE_BIND=1 together with a non-empty HF_EMBED_AUTH_TOKEN to opt in.',
  );
  error.code = 'EPERM_NONLOOPBACK_BIND';
  throw error;
}

// Perimeter guard: assert the socket directory is owned by the current
// uid and is not group/world-writable before we are willing to unlink a path inside it. Mirrors
// the supervised path's assertSocketDirOwnership intent so the direct-startup unlink cannot be
// tricked into deleting a file in an attacker-controlled directory.
function assertSocketDirOwnership(target, options = {}) {
  const fsImpl = options.fs ?? fs;
  // process.getuid is undefined on platforms without POSIX uids (e.g. Windows); skip there.
  const getuid = options.getuid ?? (typeof process.getuid === 'function' ? () => process.getuid() : null);
  if (!getuid) {
    return;
  }
  const dir = path.dirname(target);
  let stat;
  try {
    stat = fsImpl.statSync(dir);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      // Directory does not exist yet — nothing resident to protect; mkdir happens upstream.
      return;
    }
    throw error;
  }
  const currentUid = getuid();
  if (stat.uid !== currentUid) {
    const error = new Error(
      `[hf-model-server] Refusing to reclaim socket "${target}": directory ${dir} is owned by ` +
      `uid ${stat.uid}, not the current uid ${currentUid}.`,
    );
    error.code = 'EPERM_SOCKET_DIR_OWNER';
    throw error;
  }
  // 0o022 == group-write | other-write. A writable-by-others socket dir means another user could
  // have planted the resident socket, so unlinking it is unsafe.
  if ((stat.mode & 0o022) !== 0) {
    const error = new Error(
      `[hf-model-server] Refusing to reclaim socket "${target}": directory ${dir} is ` +
      `group/world-writable (mode ${(stat.mode & 0o777).toString(8)}).`,
    );
    error.code = 'EPERM_SOCKET_DIR_PERMS';
    throw error;
  }
}

// Perimeter guard: probe whether a live process is still listening on the
// UDS before unlinking it. If a peer accepts the connection the socket is live-resident and we MUST
// NOT unlink it (that would orphan a healthy server and let two servers race the same path); we
// re-surface EADDRINUSE instead. ECONNREFUSED/ENOENT means the socket is stale and safe to reclaim.
// Injectable connector keeps this deterministic in tests (no real socket required).
async function probeSocketResident(target, options = {}) {
  const timeoutMs = Number.isFinite(options.probeTimeoutMs)
    ? options.probeTimeoutMs
    : SOCKET_RESIDENT_PROBE_TIMEOUT_MS;
  const connect = options.connect
    ?? ((connectOptions, onConnect) => net.connect(connectOptions, onConnect));
  return await new Promise((resolve) => {
    let settled = false;
    let socket;
    const finish = (isResident) => {
      if (settled) {
        return;
      }
      settled = true;
      try {
        socket?.destroy();
      } catch {
        // best-effort teardown
      }
      resolve(isResident);
    };
    try {
      socket = connect({ path: target }, () => finish(true));
    } catch {
      // Synchronous connect failure (e.g. ENOENT) => stale.
      finish(false);
      return;
    }
    if (socket && typeof socket.once === 'function') {
      socket.once('error', () => finish(false));
      if (typeof socket.setTimeout === 'function') {
        socket.setTimeout(timeoutMs, () => finish(false));
      }
    }
  });
}

async function listenOnce(server, target, options = {}) {
  await new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve();
    };
    server.once('error', onError);
    server.once('listening', onListening);
    if (target.startsWith('tcp://')) {
      let url;
      try {
        assertLoopbackBindAllowed(target, options);
        url = new URL(target);
      } catch (error) {
        server.off('listening', onListening);
        server.off('error', onError);
        reject(error);
        return;
      }
      server.listen(Number.parseInt(url.port, 10), url.hostname || '127.0.0.1');
      return;
    }
    server.listen(target);
  });
}

async function listenHttpServer(server, target, options = {}) {
  // Filesystem side-effects go through an injectable fs so the EADDRINUSE/perimeter path is
  // fully testable without touching disk; production leaves options.fs undefined => real fs.
  const fsImpl = options.fs ?? fs;
  if (!target.startsWith('tcp://')) {
    fsImpl.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
    // mkdirSync's mode only applies when it creates the dir — a pre-existing
    // group/world-writable socket dir keeps its loose perms. Enforce the uid/perm
    // invariant on first bind too, not only on the EADDRINUSE reclaim path below.
    assertSocketDirOwnership(target, options);
  }

  try {
    await listenOnce(server, target, options);
  } catch (error) {
    if (error.code !== 'EADDRINUSE' || target.startsWith('tcp://')) {
      throw error;
    }
    // Apply the same perimeter guard the supervised path uses before unlinking a
    // resident UDS on the direct-startup path. (1) the dir must be ours and not other-writable;
    // (2) if a live process still answers on the socket, refuse to unlink and re-surface the
    // address-in-use error rather than orphaning a healthy server.
    assertSocketDirOwnership(target, options);
    const resident = await probeSocketResident(target, options);
    if (resident) {
      const liveError = new Error(
        `[hf-model-server] Socket ${target} is in use by a live resident process; refusing to unlink it.`,
      );
      liveError.code = 'EADDRINUSE';
      throw liveError;
    }
    try {
      fsImpl.unlinkSync(target);
    } catch (unlinkError) {
      if (unlinkError.code !== 'ENOENT') {
        throw unlinkError;
      }
    }
    await listenOnce(server, target, options);
  }

  if (!target.startsWith('tcp://')) {
    fsImpl.chmodSync(target, 0o600);
  }

  return getListeningEndpoint(server, target);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODEL LOAD HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getOptimalDevice() {
  if (process.platform === 'darwin') {
    return 'mps';
  }
  return 'cpu';
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function getErrorCode(error) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }
  const code = error.code;
  return typeof code === 'string' ? code : undefined;
}

function createTimeoutError(message) {
  const error = new Error(message);
  error.code = 'ETIMEDOUT';
  return error;
}

function getSessionCount(sessions) {
  if (!sessions) {
    return 0;
  }
  if (sessions instanceof Map) {
    return sessions.size;
  }
  if (Array.isArray(sessions)) {
    return sessions.length;
  }
  return Object.keys(sessions).length;
}

async function withTimeout(operation, timeoutMs, message) {
  return await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(createTimeoutError(message)), timeoutMs);

    operation
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

async function importTransformers() {
  try {
    return await import('@huggingface/transformers');
  } catch (error) {
    if (getErrorCode(error) !== 'ERR_MODULE_NOT_FOUND' || !getErrorMessage(error).includes('@huggingface/transformers')) {
      throw error;
    }
    const packageRequire = createRequire(path.join(systemSpecKitRoot(), 'package.json'));
    const resolved = packageRequire.resolve('@huggingface/transformers');
    return await import(pathToFileURL(resolved).href);
  }
}

async function loadHfModel(options = {}) {
  const modelName = options.modelName || process.env.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL;
  const dtype = options.dtype || resolveDtype();
  const importer = options.importTransformers || importTransformers;
  const timeoutMs = options.modelLoadTimeoutMs || MODEL_LOAD_TIMEOUT;
  const onLoadAttemptStart = typeof options.onLoadAttemptStart === 'function'
    ? options.onLoadAttemptStart
    : null;
  const start = Date.now();

  try {
    console.warn(`[hf-model-server] Loading ${modelName} (dtype=${dtype}, first load may take 15-30s)...`);

    // transformers v3 ships as CJS; under dynamic import() its exports arrive on
    // the module's `default` rather than as synthesized named exports, so reach
    // through it when present (falling back to the namespace for ESM builds).
    const imported = await importer();
    const { pipeline } = imported?.default ?? imported;

    let targetDevice = getOptimalDevice();
    console.error(`[hf-model-server] Attempting device: ${targetDevice}`);

    const loadWithTimeout = async (device) => {
      const attemptStartedAt = Date.now();
      onLoadAttemptStart?.({ device, startedAt: attemptStartedAt, timeoutMs });
      return await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Model loading timed out after ${timeoutMs}ms. ` +
            'This may indicate a corrupted cache or network issue. ' +
            'Try clearing: ~/.cache/huggingface/hub/'));
        }, timeoutMs);

        pipeline('feature-extraction', modelName, {
          dtype,
          device,
        }).then((extractor) => {
          clearTimeout(timeoutId);
          resolve(extractor);
        }).catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
      });
    };

    let extractor;
    let currentDevice;
    try {
      extractor = await loadWithTimeout(targetDevice);
      currentDevice = targetDevice;
    } catch (deviceError) {
      if (targetDevice !== 'cpu' && !getErrorMessage(deviceError).includes('timed out')) {
        console.warn(`[hf-model-server] ${targetDevice.toUpperCase()} unavailable (${getErrorMessage(deviceError)}), using CPU`);
        extractor = await loadWithTimeout('cpu');
        currentDevice = 'cpu';
      } else {
        throw deviceError;
      }
    }

    const loadTimeMs = Date.now() - start;
    console.warn(`[hf-model-server] Model loaded in ${loadTimeMs}ms (device: ${currentDevice})`);

    return {
      extractor,
      device: currentDevice,
      loadTimeMs,
    };
  } catch (error) {
    const errMsg = getErrorMessage(error);
    const errCode = getErrorCode(error);
    if (
      errCode === 'ERR_DLOPEN_FAILED' ||
      errMsg.includes('NODE_MODULE_VERSION') ||
      errMsg.includes('was compiled against a different Node.js version')
    ) {
      console.error('[hf-model-server] ═══ NATIVE MODULE ERROR ═══');
      console.error(`[hf-model-server] ${errMsg}`);
      console.error(`[hf-model-server] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
      console.error('[hf-model-server] Recovery options:');
      console.error('[hf-model-server]   1. Clear cache: rm -rf ~/.cache/huggingface/hub/');
      console.error('[hf-model-server]   2. Switch provider: EMBEDDINGS_PROVIDER=voyage');
      console.error('[hf-model-server] ═══════════════════════════');
    }

    throw error;
  }
}

function normalizeLoadResult(result, fallbackLoadTimeMs) {
  if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'extractor')) {
    return {
      extractor: result.extractor,
      device: result.device ?? null,
      loadTimeMs: result.loadTimeMs ?? fallbackLoadTimeMs,
    };
  }
  return {
    extractor: result,
    device: null,
    loadTimeMs: fallbackLoadTimeMs,
  };
}

function extractorRunner(extractor) {
  if (typeof extractor === 'function') {
    return extractor;
  }
  if (extractor && typeof extractor.embed === 'function') {
    return extractor.embed.bind(extractor);
  }
  throw new Error('[hf-model-server] Loaded extractor is not callable');
}

function embeddingData(output) {
  // The transformers.js tensor exposes `data` as a prototype getter, not an own
  // property, so hasOwnProperty misses it and the raw tensor leaks through as
  // "no embedding data". Use `in` to reach the getter.
  const data = output && typeof output === 'object' && 'data' in output
    ? output.data
    : output;
  if (data instanceof Float32Array) {
    return data;
  }
  // A transformers.js tensor's `data` can be a Float32Array constructed in a
  // different module realm, so a cross-realm `instanceof` check misses it even
  // though it is real embedding data. Accept any numeric ArrayBuffer view (or a
  // plain array) and normalize into a canonical Float32Array rather than
  // rejecting a valid embedding as "no data".
  if (ArrayBuffer.isView(data) || Array.isArray(data)) {
    return Float32Array.from(data);
  }
  throw new Error('[hf-model-server] Extractor output does not contain embedding data');
}

function assertSingleSessionBeforeDispose(extractor) {
  const sessionCount = getSessionCount(extractor?.model?.sessions);
  if (sessionCount !== 1) {
    throw new Error(`[hf-model-server] Expected exactly one native session before dispose, got ${sessionCount}`);
  }
  if (typeof extractor.dispose !== 'function') {
    throw new Error('[hf-model-server] Loaded extractor does not expose dispose()');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SERVER FACTORY
// ─────────────────────────────────────────────────────────────────────────────

function createHfModelServer(options = {}) {
  const state = {
    modelName: options.modelName || process.env.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL,
    dtype: resolveDtype(options.dtype),
    inferenceTimeoutMs: options.inferenceTimeoutMs || DEFAULT_INFERENCE_TIMEOUT_MS,
    extractor: null,
    loadingPromise: null,
    disposePromise: null,
    inFlightRawRuns: new Set(),
    recentInferMs: [],
    inferenceCount: 0,
    lastInferenceMs: null,
    supportsArrayInput: undefined,
    serverState: 'loading',
    loadStartedAt: null,
    loadProgressAt: null,
    lastSuccessfulEmbedAt: null,
    device: null,
    dim: 0,
    loadTimeMs: null,
    lastError: null,
    listenTarget: null,
    listenedEndpoint: null,
    isDisposed: false,
  };
  const loadModel = options.loadModel || loadHfModel;
  const listenServer = options.listen || listenHttpServer;
  // Perimeter/loopback guard injection points. Tests inject
  // connect/fs/getuid/env/probeTimeoutMs to exercise the guard deterministically without real
  // sockets or filesystem ownership. Production leaves these undefined => real net/fs/process/env.
  const listenGuardOptions = {
    env: options.env,
    fs: options.fs,
    getuid: options.getuid,
    connect: options.connect,
    probeTimeoutMs: options.probeTimeoutMs,
  };
  const selfWarmInput = options.selfWarmInput || DEFAULT_SELF_WARM_INPUT;
  const shouldSelfWarm = options.selfWarm !== false;
  const logger = options.logger || console;
  const activeSockets = new Set();

  function recordInferenceMs(inferMs) {
    state.recentInferMs.push(inferMs);
    if (state.recentInferMs.length > 256) {
      state.recentInferMs.shift();
    }
    state.inferenceCount += 1;
    state.lastInferenceMs = inferMs;
  }

  function percentile(sortedValues, percentileValue) {
    const index = Math.min(
      sortedValues.length - 1,
      Math.ceil((percentileValue / 100) * sortedValues.length) - 1,
    );
    return sortedValues[index] ?? null;
  }

  function timingSummary() {
    if (state.recentInferMs.length === 0) {
      return {
        p50Ms: null,
        p95Ms: null,
        lastMs: null,
        count: 0,
      };
    }

    const sorted = state.recentInferMs.slice().sort((left, right) => left - right);
    return {
      p50Ms: percentile(sorted, 50),
      p95Ms: percentile(sorted, 95),
      lastMs: state.lastInferenceMs,
      count: state.inferenceCount,
    };
  }

  function isArrayInputUnsupported(error) {
    // A transient connection/timeout error is NOT a capability gap — it is retryable and must
    // never permanently latch batching off (mirrors hf-local.ts isRetryableReadinessError).
    // Without this guard a one-off first-batch ETIMEDOUT/ECONNRESET silently degrades the
    // server to per-row inference for its whole lifetime.
    const code = getErrorCode(error);
    if (code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'EPIPE' || code === 'ECONNREFUSED' || code === 'ECONNABORTED') {
      return false;
    }
    // Only an unambiguous "this runner rejects array input" message latches batching off. A bare
    // TypeError or a generic "shape"/"invalid input" error is not a reliable capability signal.
    return /array input|unsupported array input|input must be a string|expected (?:a )?string|got an array|received an array/i.test(getErrorMessage(error));
  }

  async function runExtractor(extractor, text) {
    const t0 = performance.now();
    const run = Promise.resolve(extractorRunner(extractor)(text, {
      pooling: 'mean',
      normalize: true,
    }));
    state.inFlightRawRuns.add(run);
    void run.finally(() => {
      state.inFlightRawRuns.delete(run);
    }).catch(() => undefined);

    const output = await withTimeout(
      run,
      state.inferenceTimeoutMs,
      `HF local inference timed out after ${state.inferenceTimeoutMs}ms`,
    );
    recordInferenceMs(performance.now() - t0);
    const embedding = embeddingData(output);
    if (state.dim <= 0) {
      state.dim = embedding.length;
    } else if (embedding.length !== state.dim) {
      throw new Error(`Embedding dimension mismatch: expected ${state.dim}, got ${embedding.length}`);
    }
    return Array.from(embedding);
  }

  function sliceBatchOutput(output, n) {
    const data = embeddingData(output);
    if (output && typeof output === 'object' && Array.isArray(output.dims)) {
      const [rows, dim] = output.dims;
      if (rows !== n || dim * n !== data.length) {
        throw new Error(`[hf-model-server] Batch output dimensions mismatch: dims=${JSON.stringify(output.dims)} data=${data.length} inputs=${n}`);
      }
    }

    if (n <= 0) {
      return [];
    }
    if (data.length % n !== 0) {
      throw new Error(`[hf-model-server] Batch output length ${data.length} is not divisible by input count ${n}`);
    }

    const dim = data.length / n;
    if (!Number.isInteger(dim)) {
      throw new Error(`[hf-model-server] Batch output dimension is not an integer: ${dim}`);
    }
    if (state.dim <= 0) {
      state.dim = dim;
    } else if (dim !== state.dim) {
      throw new Error(`Embedding dimension mismatch: expected ${state.dim}, got ${dim}`);
    }

    const rows = [];
    for (let index = 0; index < n; index += 1) {
      rows.push(Array.from(data.subarray(index * dim, (index + 1) * dim)));
    }
    return rows;
  }

  async function runExtractorBatch(extractor, texts) {
    if (texts.length === 0) {
      return [];
    }

    const t0 = performance.now();
    const run = Promise.resolve(extractorRunner(extractor)(texts, {
      pooling: 'mean',
      normalize: true,
    }));
    state.inFlightRawRuns.add(run);
    void run.finally(() => {
      state.inFlightRawRuns.delete(run);
    }).catch(() => undefined);

    const output = await withTimeout(
      run,
      state.inferenceTimeoutMs,
      `HF local inference timed out after ${state.inferenceTimeoutMs}ms`,
    );
    recordInferenceMs(performance.now() - t0);
    return sliceBatchOutput(output, texts.length);
  }

  async function getModel() {
    if (state.isDisposed) {
      throw new Error(`[hf-model-server] Server for ${state.modelName} has been disposed`);
    }
    if (state.extractor) {
      return state.extractor;
    }
    if (state.loadingPromise) {
      return state.loadingPromise;
    }

    state.serverState = 'loading';
    state.lastError = null;
    state.loadStartedAt = Date.now();
    state.loadProgressAt = state.loadStartedAt;
    state.loadingPromise = (async () => {
      const start = state.loadStartedAt;
      try {
        const result = await loadModel({
          modelName: state.modelName,
          dtype: state.dtype,
          modelLoadTimeoutMs: MODEL_LOAD_TIMEOUT,
          onLoadAttemptStart: (attempt = {}) => {
            const startedAt = Number.isFinite(attempt.startedAt) ? attempt.startedAt : Date.now();
            state.loadProgressAt = startedAt;
          },
        });
        const normalized = normalizeLoadResult(result, Date.now() - start);
        state.extractor = normalized.extractor;
        state.device = normalized.device;
        state.loadTimeMs = normalized.loadTimeMs;

        if (shouldSelfWarm) {
          try {
            await runExtractor(state.extractor, selfWarmInput);
          } catch (warmError) {
            // Self-warm is best-effort: the model loaded successfully, so a warm-up
            // failure must NOT pin the server to 'error' (probeModelServer
            // treats 'error' as dead and would reap a working server). Log + proceed.
            logger.warn?.(`[hf-model-server] self-warm failed (model still usable): ${getErrorMessage(warmError)}`);
          }
        }

        state.serverState = 'ready';
        return state.extractor;
      } catch (error) {
        state.loadingPromise = null;
        state.serverState = 'error';
        state.lastError = error;
        throw error;
      }
    })();

    return state.loadingPromise;
  }

  function healthPayload() {
    return {
      state: state.serverState,
      model: state.modelName,
      dim: state.dim > 0 ? state.dim : null,
      device: state.device,
      loadTimeMs: state.loadTimeMs,
      loadStartedAt: state.loadStartedAt,
      loadProgressAt: state.loadProgressAt,
      lastSuccessfulEmbedAt: state.lastSuccessfulEmbedAt,
      inFlight: state.inFlightRawRuns.size,
      queueDepth: state.inFlightRawRuns.size,
      timing: timingSummary(),
      error: state.lastError ? getErrorMessage(state.lastError) : undefined,
    };
  }

  async function embedPayload(body) {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return {
        statusCode: 400,
        body: { error: 'POST /api/embed requires a JSON object body with an input array of strings' },
      };
    }
    const requestedModel = body.model || state.modelName;
    if (requestedModel !== state.modelName) {
      return {
        statusCode: 404,
        body: {
          error: `Model ${requestedModel} is not loaded by this hf-local server`,
          model: requestedModel,
          loadedModel: state.modelName,
        },
      };
    }
    if (!Array.isArray(body.input) || body.input.some((value) => typeof value !== 'string')) {
      return {
        statusCode: 400,
        body: { error: 'POST /api/embed requires input to be an array of strings' },
      };
    }

    try {
      const extractor = await getModel();
      let embeddings;
      if (state.supportsArrayInput !== false) {
        try {
          embeddings = await runExtractorBatch(extractor, body.input);
          if (body.input.length > 0) {
            state.supportsArrayInput = true;
            state.lastSuccessfulEmbedAt = Date.now();
          }
        } catch (error) {
          if (state.supportsArrayInput !== undefined || !isArrayInputUnsupported(error)) {
            throw error;
          }
          state.supportsArrayInput = false;
          logger.warn?.(`[hf-model-server] extractor rejected batched array input; falling back to per-text inference for this server: ${getErrorMessage(error)}`);
        }
      }

      if (!embeddings) {
        embeddings = [];
        for (const text of body.input) {
          const embedding = await runExtractor(extractor, text);
          state.lastSuccessfulEmbedAt = Date.now();
          embeddings.push(embedding);
        }
      }
      return {
        statusCode: 200,
        body: {
          embeddings,
          dim: state.dim,
        },
      };
    } catch (error) {
      logger.warn?.(`[hf-model-server] Embed failed: ${getErrorMessage(error)}`);
      return {
        statusCode: 500,
        body: { error: getErrorMessage(error) },
      };
    }
  }

  async function routeJson(method, routePath, body = {}) {
    if (method === 'GET' && routePath === HEALTH_PATH) {
      return {
        statusCode: 200,
        body: healthPayload(),
      };
    }
    if (method === 'POST' && routePath === EMBED_PATH) {
      return await embedPayload(body);
    }
    return {
      statusCode: 404,
      body: { error: `Unknown route: ${method || 'GET'} ${routePath}` },
    };
  }

  function writeJson(response, statusCode, payload) {
    const body = JSON.stringify(payload);
    response.writeHead(statusCode, {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
    });
    response.end(body);
  }

  async function readJsonBody(request) {
    return await new Promise((resolve, reject) => {
      let body = '';
      request.setEncoding('utf8');
      request.on('data', (chunk) => {
        body += chunk;
        if (Buffer.byteLength(body, 'utf8') > MAX_REQUEST_BYTES) {
          reject(new Error(`Request body exceeds ${MAX_REQUEST_BYTES} bytes`));
          request.destroy();
        }
      });
      request.on('end', () => {
        try {
          resolve(body.trim() ? JSON.parse(body) : {});
        } catch (error) {
          reject(new Error(`Invalid JSON body: ${getErrorMessage(error)}`));
        }
      });
      request.on('error', reject);
    });
  }

  async function requestHandler(request, response) {
    const url = new URL(request.url || '/', 'http://127.0.0.1');
    let body = {};
    if (request.method === 'POST') {
      try {
        body = await readJsonBody(request);
      } catch (error) {
        writeJson(response, 400, { error: getErrorMessage(error) });
        return;
      }
    }
    const result = await routeJson(request.method || 'GET', url.pathname, body);
    writeJson(response, result.statusCode, result.body);
  }

  const server = http.createServer((request, response) => {
    void requestHandler(request, response).catch((error) => {
      writeJson(response, 500, { error: getErrorMessage(error) });
    });
  });

  server.on('connection', (socket) => {
    activeSockets.add(socket);
    socket.once('close', () => {
      activeSockets.delete(socket);
    });
  });

  async function listen(target = resolveListenTarget(options)) {
    state.listenTarget = target;
    const endpoint = await listenServer(server, target, listenGuardOptions);
    state.listenedEndpoint = endpoint;
    void getModel().catch((error) => {
      logger.error?.(`[hf-model-server] Model load failed: ${getErrorMessage(error)}`);
    });
    return {
      server,
      socketPath: endpoint,
      endpoint,
      close,
      dispose,
      inject,
      getState: () => healthPayload(),
    };
  }

  async function close(closeOptions = {}) {
    const disposeModel = closeOptions.disposeModel === true;
    for (const socket of activeSockets) {
      socket.destroy();
    }
    activeSockets.clear();

    await new Promise((resolve, reject) => {
      if (!server.listening) {
        resolve();
        return;
      }
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    if (state.listenTarget && !state.listenTarget.startsWith('tcp://')) {
      try {
        fs.unlinkSync(state.listenTarget);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    }

    if (disposeModel) {
      await dispose();
    }
  }

  async function dispose() {
    if (state.disposePromise) {
      return state.disposePromise;
    }

    state.isDisposed = true;
    state.disposePromise = (async () => {
      if (state.inFlightRawRuns.size > 0) {
        await withTimeout(
          Promise.allSettled(Array.from(state.inFlightRawRuns)),
          INFERENCE_DRAIN_TIMEOUT_MS,
          `[hf-model-server] Timed out waiting for native inference drain after ${INFERENCE_DRAIN_TIMEOUT_MS}ms`,
        );
      }

      const loading = state.loadingPromise;
      if (loading) {
        await withTimeout(
          loading.then(() => undefined, () => undefined),
          MODEL_LOAD_TIMEOUT,
          `[hf-model-server] Timed out waiting for model load before dispose after ${MODEL_LOAD_TIMEOUT}ms`,
        );
      }

      const extractor = state.extractor;
      state.extractor = null;
      state.loadingPromise = null;
      state.loadTimeMs = null;
      state.loadStartedAt = null;
      state.loadProgressAt = null;
      state.serverState = 'loading';
      if (!extractor) {
        return;
      }

      assertSingleSessionBeforeDispose(extractor);
      await extractor.dispose();
    })();

    return state.disposePromise;
  }

  async function inject(method, routePath, body = {}) {
    return await routeJson(method, routePath, body);
  }

  return {
    server,
    listen,
    close,
    dispose,
    getModel,
    inject,
    getState: () => healthPayload(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const app = createHfModelServer();
  const handle = await app.listen();
  process.stderr.write(`[hf-model-server] listening at ${handle.endpoint}\n`);

  const shutdown = (signal) => {
    process.stderr.write(`[hf-model-server] received ${signal}; shutting down\n`);
    app.close({ disposeModel: true })
      .then(() => process.exit(0))
      .catch((error) => {
        process.stderr.write(`[hf-model-server] shutdown failed: ${getErrorMessage(error)}\n`);
        process.exit(1);
      });
  };

  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
    process.once(signal, () => shutdown(signal));
  }
}

module.exports = {
  ALLOWED_HF_LOCAL_DTYPES,
  DEFAULT_MODEL,
  INFERENCE_DRAIN_TIMEOUT_MS,
  LOOPBACK_BIND_HOSTS,
  MODEL_LOAD_TIMEOUT,
  SOCKET_FILE_NAME,
  SOCKET_RESIDENT_PROBE_TIMEOUT_MS,
  assertLoopbackBindAllowed,
  assertSingleSessionBeforeDispose,
  assertSocketDirOwnership,
  createHfModelServer,
  defaultDbDir,
  getOptimalDevice,
  getSessionCount,
  importTransformers,
  isLoopbackHost,
  listenHttpServer,
  loadHfModel,
  probeSocketResident,
  resolveDtype,
  resolveListenTarget,
  toConnectionOptions,
};

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`[hf-model-server] ${error.stack || getErrorMessage(error)}\n`);
    process.exit(1);
  });
}
