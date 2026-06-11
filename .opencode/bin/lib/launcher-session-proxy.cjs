// [launcher-session-proxy] Launcher-owned MCP stdin/stdout bridge over daemon IPC.
'use strict';

const net = require('net');
const { StringDecoder } = require('string_decoder');
const {
  probeDaemon,
  toConnectionOptions,
} = require('./launcher-ipc-bridge.cjs');

const PROBE_BACKOFF_MS = [100, 250, 500, 1000, 1500];
const DEFAULT_MAX_REATTACH_ATTEMPTS = 40;
// Bounded so a dead/booting daemon surfaces a retryable -32001 to the client in ~tens of
// seconds (~41s with the backoff ladder) instead of ~176s of silent "connecting…". A healthy
// daemon answers the deep probe within the first few attempts; the only thing this shortens is
// the pathological wait when the backend cannot come up. Tunable via SPECKIT_PROXY_COLD_START_ATTEMPTS.
const DEFAULT_MAX_COLD_START_ATTEMPTS = 30;
const INTERNAL_HANDSHAKE_TIMEOUT_MS = 7000;
const DEFAULT_KEEPALIVE_INTERVAL_MS = 10_000;
const DEFAULT_KEEPALIVE_TIMEOUT_MS = 5_000;
const DEFAULT_MAX_QUEUED_CLIENT_FRAMES = 1000;
const PROXY_PRIVATE_ID_PREFIX = '__launcher_session_proxy_keepalive__';
const RETRYABLE_RECYCLE_ERROR = Object.freeze({
  code: -32001,
  message: 'backend recycled; retry',
  data: { retryable: true },
});
const PROTOCOL_MISMATCH_ERROR = Object.freeze({
  code: -32002,
  message: 'backend protocol version changed; client reconnect required',
  data: { retryable: false },
});
const REPLAYABLE_TOOL_NAMES = new Set([
  'memory_search',
  'memory_context',
  'memory_match_triggers',
  'memory_quick_search',
  'memory_save',
  'session_bootstrap',
  'session_health',
  'session_resume',
  'session_status',
  'memory_stats',
  'memory_status',
  'checkpoint_list',
  'embedder_health',
]);
const UNSAFE_TOOL_NAMES = new Set([
  'memory_delete',
  'memory_bulk_delete',
  'memory_update',
  'checkpoint_restore',
  'checkpoint_delete',
  'embedder_set',
  'memory_retention_sweep',
  'memory_ingest_start',
  'memory_ingest_cancel',
]);
const REPLAYABLE_PROTOCOL_METHODS = new Set([
  'initialize',
  'ping',
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function defaultConnect(connectionOptions) {
  return net.createConnection(connectionOptions);
}

function defaultLog(message) {
  process.stderr.write(`[launcher-session-proxy] ${message}\n`);
}

function createFrameSplitter(onFrame) {
  let buffer = '';
  // A multibyte UTF-8 char (CJK/emoji) can straddle a socket-chunk boundary; the
  // StringDecoder holds the incomplete tail until the next chunk completes it, instead
  // of emitting U+FFFD replacement chars on the partial sequence.
  const decoder = new StringDecoder('utf8');
  return {
    push(chunk) {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const frame = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (frame.trim().length === 0) continue;
        onFrame(frame);
      }
    },
    discard() {
      buffer = '';
      decoder.end();
    },
    buffered() {
      return buffer;
    },
  };
}

function parseFrame(frame) {
  try {
    const parsed = JSON.parse(String(frame).trim());
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function hasRequestId(parsed) {
  return parsed !== null && hasOwn(parsed, 'id');
}

function isResponseFrame(parsed) {
  return hasRequestId(parsed) && (hasOwn(parsed, 'result') || hasOwn(parsed, 'error'));
}

// Build a frame classifier for a given replayable/unsafe tool set. The protocol-method rules
// (initialize/ping/notifications) and the parse/unsafe/replayable order are identical across MCP
// servers; only the tools/call replayability set differs per server (memory tools vs code-graph
// tools). Each launcher passes its own sets so the reattach/replay machinery stays one implementation.
function createClassifyFrame(options = {}) {
  const replayable = options.replayableToolNames instanceof Set ? options.replayableToolNames : REPLAYABLE_TOOL_NAMES;
  const unsafe = options.unsafeToolNames instanceof Set ? options.unsafeToolNames : UNSAFE_TOOL_NAMES;
  return function classify(frame) {
    const parsed = typeof frame === 'string' ? parseFrame(frame) : frame;
    if (!parsed || typeof parsed.method !== 'string') return false;
    if (parsed.method !== 'tools/call') {
      return REPLAYABLE_PROTOCOL_METHODS.has(parsed.method) || parsed.method.startsWith('notifications/');
    }
    const toolName = parsed.params && typeof parsed.params === 'object'
      ? parsed.params.name
      : undefined;
    if (typeof toolName !== 'string') return false;
    if (unsafe.has(toolName)) return false;
    if (replayable.has(toolName)) return true;
    return false;
  };
}

// Default classifier uses the mk-spec-memory tool sets. memory_save is replayable on a
// commit-then-die backend because its primary row is protected by content-hash dedup AND the v28
// active-row partial unique index (idx_memory_logical_key_active_unique): an identical-content replay
// collapses to the same logical key and writes no new primary row. The KNOWN GAP is the secondary
// index — a commit-then-die that finished the primary insert but not the secondary-index write can,
// on replay, append duplicate secondary-index rows because that path is not yet keyed by an
// idempotency token. Closing it requires a request-id/dedup key threaded into the save handler, which
// lives behind the daemon IPC and is out of scope for this proxy-layer frame classifier.
const classifyFrame = createClassifyFrame();

function createPendingRequestsTracker(classify = classifyFrame) {
  const pendingRequests = new Map();
  let cachedInitialize = null;
  let cachedInitializeId = null;
  let negotiatedProtocolVersion = null;
  let protocolVersionObserved = false;

  function handleClientFrame(frame) {
    const parsed = parseFrame(frame);
    if (!parsed) return;
    if (parsed.method === 'initialize') {
      cachedInitialize = frame;
      cachedInitializeId = hasRequestId(parsed) ? parsed.id : null;
    }
    if (!hasRequestId(parsed)) return;
    pendingRequests.set(parsed.id, {
      frame,
      replayable: classify(frame),
    });
  }

  function handleBackendFrame(frame) {
    const parsed = parseFrame(frame);
    if (!parsed || !isResponseFrame(parsed)) return;
    pendingRequests.delete(parsed.id);
  }

  return {
    pendingRequests,
    handleClientFrame,
    handleBackendFrame,
    getCachedInitialize() {
      return cachedInitialize;
    },
    getCachedInitializeId() {
      return cachedInitializeId;
    },
    getNegotiatedProtocolVersion() {
      return negotiatedProtocolVersion;
    },
    hasObservedProtocolVersion() {
      return protocolVersionObserved;
    },
    recordNegotiatedProtocolVersion(version) {
      if (protocolVersionObserved) return;
      protocolVersionObserved = true;
      negotiatedProtocolVersion = typeof version === 'string' ? version : null;
    },
  };
}

function resolveColdStartAttempts() {
  const fromEnv = Number.parseInt(process.env.SPECKIT_PROXY_COLD_START_ATTEMPTS ?? '', 10);
  return Number.isInteger(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_MAX_COLD_START_ATTEMPTS;
}

async function waitForDaemonReady(socketPath, probe, connect, log, options = {}) {
  const maxAttempts = Number.isInteger(options.maxAttempts) && options.maxAttempts > 0
    ? options.maxAttempts
    : Infinity;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const result = await probe(socketPath, { connect, deepProbe: true });
    if (result.status === 'alive') return result;
    if (attempt + 1 >= maxAttempts) return result;
    const delayMs = PROBE_BACKOFF_MS[Math.min(attempt, PROBE_BACKOFF_MS.length - 1)];
    log(`daemon socket not ready (${result.reason}); retrying in ${delayMs}ms`);
    await sleep(delayMs);
  }
  return { status: 'dead', reason: 'reattach-attempts-exhausted' };
}

function writeFrame(stream, frame) {
  return stream.write(`${frame}\n`);
}

function retryableErrorFrame(id) {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: RETRYABLE_RECYCLE_ERROR,
  });
}

function protocolMismatchErrorFrame(id) {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: PROTOCOL_MISMATCH_ERROR,
  });
}

function connectSocket(connect, socketPath) {
  return new Promise((resolve, reject) => {
    let socket;
    try {
      socket = connect(toConnectionOptions(socketPath));
    } catch (error) {
      reject(error);
      return;
    }

    const cleanup = () => {
      socket.off?.('connect', onConnect);
      socket.off?.('error', onError);
    };
    const onConnect = () => {
      cleanup();
      resolve(socket);
    };
    const onError = (error) => {
      cleanup();
      socket.destroy?.();
      reject(error);
    };

    socket.once('connect', onConnect);
    socket.once('error', onError);
  });
}

function internalHandshake(socket, initializeFrame) {
  if (!initializeFrame) return Promise.resolve({ residual: '', protocolVersion: undefined, handshakeObserved: false, initializeResponse: null });

  const initialize = parseFrame(initializeFrame);
  if (!initialize || !hasRequestId(initialize)) {
    return Promise.resolve({ residual: '', protocolVersion: undefined, handshakeObserved: false, initializeResponse: null });
  }

  return new Promise((resolve, reject) => {
    let buffer = '';
    let residual = '';
    let negotiatedVersion;
    let initializeResponse = null;
    // Hold a multibyte char split across chunk boundaries until complete, so a CJK/emoji
    // payload in the residual (post-handshake) stream is not corrupted to U+FFFD.
    const decoder = new StringDecoder('utf8');
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('timed out waiting for internal initialize'));
    }, INTERNAL_HANDSHAKE_TIMEOUT_MS);
    timer.unref?.();
    const cleanup = () => {
      clearTimeout(timer);
      socket.off?.('data', onData);
      socket.off?.('error', onError);
      socket.off?.('close', onClose);
    };
    const onData = (chunk) => {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let initialized = false;
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const frame = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (frame.trim().length === 0) continue;
        const parsed = parseFrame(frame);
        if (parsed && isResponseFrame(parsed) && parsed.id === initialize.id) {
          initialized = true;
          initializeResponse = frame;
          negotiatedVersion = parsed.result && typeof parsed.result === 'object'
            ? parsed.result.protocolVersion
            : undefined;
          continue;
        }
        residual += `${frame}\n`;
      }
      if (!initialized) return;
      const remainder = residual + buffer;
      buffer = '';
      residual = '';
      cleanup();
      resolve({ residual: remainder, protocolVersion: negotiatedVersion, handshakeObserved: true, initializeResponse });
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const onClose = () => {
      cleanup();
      reject(new Error('socket closed during internal initialize'));
    };

    socket.on('data', onData);
    socket.once('error', onError);
    socket.once('close', onClose);
    writeFrame(socket, initializeFrame);
  });
}

function createSessionProxy(options) {
  const socketPath = options?.socketPath;
  const input = options?.stdin ?? process.stdin;
  const output = options?.stdout ?? process.stdout;
  const probe = options?.probe ?? probeDaemon;
  const connect = options?.connect ?? defaultConnect;
  const log = options?.log ?? defaultLog;
  const classify = options?.classify ?? classifyFrame;
  const maxReattachAttempts = Number.isInteger(options?.maxReattachAttempts) && options.maxReattachAttempts > 0
    ? options.maxReattachAttempts
    : DEFAULT_MAX_REATTACH_ATTEMPTS;
  const maxColdStartAttempts = Number.isInteger(options?.maxColdStartAttempts) && options.maxColdStartAttempts > 0
    ? options.maxColdStartAttempts
    : resolveColdStartAttempts();
  const keepaliveIntervalMs = Number.isInteger(options?.keepaliveIntervalMs) && options.keepaliveIntervalMs > 0
    ? options.keepaliveIntervalMs
    : DEFAULT_KEEPALIVE_INTERVAL_MS;
  const keepaliveTimeoutMs = Number.isInteger(options?.keepaliveTimeoutMs) && options.keepaliveTimeoutMs > 0
    ? options.keepaliveTimeoutMs
    : DEFAULT_KEEPALIVE_TIMEOUT_MS;
  const maxQueuedClientFrames = Number.isInteger(options?.maxQueuedClientFrames) && options.maxQueuedClientFrames > 0
    ? options.maxQueuedClientFrames
    : DEFAULT_MAX_QUEUED_CLIENT_FRAMES;

  let socket = null;
  let state = 'REATTACHING';
  let stopped = false;
  let clientEnded = false;
  let reattachRunning = false;
  let backendSplitter = createFrameSplitter(handleBackendFrame);
  let socketHalfClosed = false;
  let keepaliveInterval = null;
  let keepaliveTimer = null;
  let keepaliveId = 0;
  let pendingKeepaliveId = null;
  let lastBackendActivity = Date.now();
  let socketDrainWaiting = false;
  let outputDrainWaiting = false;
  let outputEndRequested = false;
  const queuedClientFrames = [];
  const socketWriteQueue = [];
  const outputWriteQueue = [];
  const tracker = createPendingRequestsTracker(classify);
  const clientSplitter = createFrameSplitter(handleClientFrame);

  if (typeof socketPath !== 'string' || socketPath.length === 0) {
    throw new Error('createSessionProxy requires a non-empty socketPath');
  }

  function pauseClientInput() {
    input.pause?.();
  }

  function resumeClientInputIfReady() {
    if (!clientEnded && !stopped && state === 'CONNECTED') input.resume?.();
  }

  function stopKeepalive() {
    if (keepaliveInterval !== null) {
      clearInterval(keepaliveInterval);
      keepaliveInterval = null;
    }
    if (keepaliveTimer !== null) {
      clearTimeout(keepaliveTimer);
      keepaliveTimer = null;
    }
    pendingKeepaliveId = null;
  }

  function detachSocket(destroy = true) {
    stopKeepalive();
    if (!socket) return;
    const oldSocket = socket;
    socket = null;
    socketHalfClosed = false;
    // The backpressure 'drain' wait was bound to this now-discarded socket and its
    // handler short-circuits once the socket is swapped, so it can never reset the
    // flag. Clear it here (and drop the listener) or the next socket's pump stays
    // blocked forever — a silent hang when backpressure coincides with a recycle.
    socketDrainWaiting = false;
    oldSocket.removeAllListeners?.('data');
    oldSocket.removeAllListeners?.('error');
    oldSocket.removeAllListeners?.('close');
    oldSocket.removeAllListeners?.('drain');
    if (destroy) oldSocket.destroy?.();
  }

  function finishIfClientEndedAndIdle() {
    if (!clientEnded || stopped) return;
    if (queuedClientFrames.length > 0 || socketWriteQueue.length > 0 || tracker.pendingRequests.size > 0) return;
    requestOutputEnd();
  }

  function halfCloseSocketIfReady() {
    if (!clientEnded || !socket || state !== 'CONNECTED' || socketHalfClosed) return;
    if (socketDrainWaiting || socketWriteQueue.length > 0) return;
    socketHalfClosed = true;
    socket.end?.();
    finishIfClientEndedAndIdle();
  }

  function stop() {
    if (stopped) return;
    stopped = true;
    input.off?.('data', onInputData);
    input.off?.('end', onInputEnd);
    input.off?.('close', onInputClose);
    output.off?.('error', onOutputError);
    detachSocket(true);
  }

  function pumpOutputQueue() {
    if (outputDrainWaiting) return;
    while (outputWriteQueue.length > 0) {
      const frame = outputWriteQueue[0];
      const accepted = writeFrame(output, frame);
      outputWriteQueue.shift();
      if (!accepted) {
        outputDrainWaiting = true;
        socket?.pause?.();
        output.once?.('drain', () => {
          outputDrainWaiting = false;
          socket?.resume?.();
          pumpOutputQueue();
        });
        return;
      }
    }
    if (outputEndRequested) {
      output.end?.();
      stop();
    }
  }

  function enqueueOutputFrame(frame) {
    outputWriteQueue.push(frame);
    pumpOutputQueue();
  }

  function requestOutputEnd() {
    outputEndRequested = true;
    pumpOutputQueue();
  }

  function failPendingAndEndWith(makeErrorFrame) {
    const failedIds = new Set();
    for (const id of tracker.pendingRequests.keys()) {
      failedIds.add(JSON.stringify(id));
      enqueueOutputFrame(makeErrorFrame(id));
    }
    tracker.pendingRequests.clear();
    while (queuedClientFrames.length > 0) {
      const frame = queuedClientFrames.shift();
      const parsed = parseFrame(frame);
      if (!hasRequestId(parsed)) continue;
      const key = JSON.stringify(parsed.id);
      if (failedIds.has(key)) continue;
      failedIds.add(key);
      enqueueOutputFrame(makeErrorFrame(parsed.id));
    }
    requestOutputEnd();
  }

  function failPendingAndEnd() {
    failPendingAndEndWith(retryableErrorFrame);
  }

  function failPendingAndEndProtocolMismatch() {
    failPendingAndEndWith(protocolMismatchErrorFrame);
  }

  function failOldestQueuedClientFrame() {
    while (queuedClientFrames.length > maxQueuedClientFrames) {
      const frame = queuedClientFrames.shift();
      const parsed = parseFrame(frame);
      if (hasRequestId(parsed)) {
        enqueueOutputFrame(retryableErrorFrame(parsed.id));
        tracker.pendingRequests.delete(parsed.id);
      }
    }
  }

  function queueClientFrame(frame) {
    queuedClientFrames.push(frame);
    failOldestQueuedClientFrame();
  }

  function pumpSocketQueue() {
    if (!socket || state !== 'CONNECTED' || socketDrainWaiting) return;
    while (socketWriteQueue.length > 0 && socket && state === 'CONNECTED') {
      const activeSocket = socket;
      const frame = socketWriteQueue[0];
      const accepted = writeFrame(activeSocket, frame);
      socketWriteQueue.shift();
      if (!accepted) {
        socketDrainWaiting = true;
        pauseClientInput();
        activeSocket.once?.('drain', () => {
          if (activeSocket !== socket) return;
          socketDrainWaiting = false;
          resumeClientInputIfReady();
          pumpSocketQueue();
        });
        return;
      }
    }
    halfCloseSocketIfReady();
    resumeClientInputIfReady();
  }

  function enqueueSocketFrame(frame) {
    socketWriteQueue.push(frame);
    pumpSocketQueue();
  }

  function sendKeepalive() {
    if (!socket || state !== 'CONNECTED' || pendingKeepaliveId !== null) return;
    if (Date.now() - lastBackendActivity < keepaliveIntervalMs) return;
    pendingKeepaliveId = `${PROXY_PRIVATE_ID_PREFIX}${keepaliveId += 1}`;
    enqueueSocketFrame(JSON.stringify({ jsonrpc: '2.0', id: pendingKeepaliveId, method: 'ping' }));
    keepaliveTimer = setTimeout(() => {
      keepaliveTimer = null;
      if (pendingKeepaliveId === null) return;
      pendingKeepaliveId = null;
      handleBackendFailure('keepalive-timeout');
    }, keepaliveTimeoutMs);
    keepaliveTimer.unref?.();
  }

  function startKeepalive() {
    stopKeepalive();
    lastBackendActivity = Date.now();
    keepaliveInterval = setInterval(sendKeepalive, keepaliveIntervalMs);
    keepaliveInterval.unref?.();
  }

  function forwardClientFrame(frame) {
    tracker.handleClientFrame(frame);
    if (!socket || state !== 'CONNECTED') {
      queueClientFrame(frame);
      return;
    }
    enqueueSocketFrame(frame);
  }

  function flushQueuedClientFrames() {
    while (queuedClientFrames.length > 0 && socket && state === 'CONNECTED') {
      forwardClientFrame(queuedClientFrames.shift());
    }
  }

  function handleClientFrame(frame) {
    const parsedClient = parseFrame(frame);
    if (parsedClient
        && parsedClient.method !== undefined
        && typeof parsedClient.id === 'string'
        && parsedClient.id.startsWith(PROXY_PRIVATE_ID_PREFIX)) {
      // This id prefix is reserved for the proxy's private keepalive pings. A
      // client request carrying a colliding id would have its backend response
      // silently swallowed by the keepalive interceptor in handleBackendFrame,
      // hanging the request. Reject the reserved id rather than forward it.
      enqueueOutputFrame(JSON.stringify({
        jsonrpc: '2.0',
        id: parsedClient.id,
        error: { code: -32600, message: 'Request id uses a reserved prefix' },
      }));
      return;
    }
    if (state !== 'CONNECTED' || !socket) {
      queueClientFrame(frame);
      return;
    }
    forwardClientFrame(frame);
  }

  function handleBackendFrame(frame) {
    lastBackendActivity = Date.now();
    const parsed = parseFrame(frame);
    if (pendingKeepaliveId !== null && isResponseFrame(parsed) && parsed.id === pendingKeepaliveId) {
      pendingKeepaliveId = null;
      if (keepaliveTimer !== null) {
        clearTimeout(keepaliveTimer);
        keepaliveTimer = null;
      }
      return;
    }
    const cachedInitializeId = tracker.getCachedInitializeId();
    if (!tracker.hasObservedProtocolVersion()
        && cachedInitializeId !== null
        && isResponseFrame(parsed)
        && parsed.id === cachedInitializeId) {
      // Record the protocol version negotiated on the first initialize so an internal
      // re-handshake to a swapped backend can fail closed on a version change rather
      // than silently serve the client a protocol it never negotiated.
      tracker.recordNegotiatedProtocolVersion(
        parsed.result && typeof parsed.result === 'object' ? parsed.result.protocolVersion : undefined,
      );
    }
    tracker.handleBackendFrame(frame);
    enqueueOutputFrame(frame);
    finishIfClientEndedAndIdle();
  }

  function replaySnapshot(snapshot) {
    const cachedInitializeId = tracker.getCachedInitializeId();
    for (const [id, entry] of snapshot) {
      if (!tracker.pendingRequests.has(id)) continue;
      // internalHandshake already re-sent (and consumed the reply for) the cached
      // initialize on the fresh socket. Replaying it here too would deliver a second
      // initialize to the backend, so the handshake path owns the initialize replay.
      if (cachedInitializeId !== null && id === cachedInitializeId) continue;
      if (entry.replayable) {
        enqueueSocketFrame(entry.frame);
        continue;
      }
      enqueueOutputFrame(retryableErrorFrame(id));
      tracker.pendingRequests.delete(id);
    }
  }

  async function attachFreshSocket({ replaySnapshotEntries = [] } = {}) {
    const freshSocket = await connectSocket(connect, socketPath);
    const handshake = await internalHandshake(freshSocket, tracker.getCachedInitialize());
    const expectedProtocolVersion = tracker.getNegotiatedProtocolVersion();
    if (handshake.handshakeObserved
        && expectedProtocolVersion !== null
        && (handshake.protocolVersion ?? null) !== expectedProtocolVersion) {
      // A backend build swap can re-handshake with a different negotiated protocol
      // version. Serving it would silently break the client's protocol contract, so
      // end the session with a non-retryable error instead of attaching the socket.
      // CLOSED is terminal: the reattach loop must not retry a version-mismatched backend.
      log(`backend protocol version drift: expected ${expectedProtocolVersion}, got ${handshake.protocolVersion ?? 'none'}; failing closed`);
      freshSocket.destroy?.();
      state = 'CLOSED';
      failPendingAndEndProtocolMismatch();
      return;
    }
    socket = freshSocket;
    socketHalfClosed = false;
    backendSplitter = createFrameSplitter(handleBackendFrame);
    if (handshake.residual.length > 0) backendSplitter.push(handshake.residual);
    socket.on('data', (chunk) => backendSplitter.push(chunk));
    socket.once('error', (error) => {
      log(`socket proxy error: ${error instanceof Error ? error.message : String(error)}`);
      handleBackendFailure('error');
    });
    socket.once('close', () => {
      handleBackendFailure('close');
    });
    state = 'CONNECTED';
    startKeepalive();
    // The fresh backend may have died after receiving the client's initialize but before
    // answering it on the old socket, leaving initialize pending. internalHandshake just
    // re-sent and answered it; forward that single answer to the client and clear it from
    // pending so replaySnapshot does not send a duplicate initialize to the backend.
    const cachedInitializeId = tracker.getCachedInitializeId();
    if (handshake.handshakeObserved
        && handshake.initializeResponse
        && cachedInitializeId !== null
        && tracker.pendingRequests.has(cachedInitializeId)) {
      tracker.pendingRequests.delete(cachedInitializeId);
      enqueueOutputFrame(handshake.initializeResponse);
    }
    replaySnapshot(replaySnapshotEntries);
    flushQueuedClientFrames();
    pumpSocketQueue();
    if (clientEnded) {
      halfCloseSocketIfReady();
      return;
    }
    resumeClientInputIfReady();
  }

  async function reattach() {
    for (let attempt = 0; attempt < maxReattachAttempts && !stopped; attempt += 1) {
      const ready = await waitForDaemonReady(socketPath, probe, connect, log, { maxAttempts: 1 });
      if (ready.status === 'alive') {
        try {
          const snapshot = Array.from(tracker.pendingRequests.entries());
          await attachFreshSocket({ replaySnapshotEntries: snapshot });
          if (state === 'CONNECTED' || state === 'CLOSED' || stopped) return;
          log('reattach observed nested backend failure; retrying');
          continue;
        } catch (error) {
          if (state === 'REATTACHING') {
            log(`reattach attach interrupted: ${error instanceof Error ? error.message : String(error)}`);
            continue;
          }
          log(`reattach handshake failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      const delayMs = PROBE_BACKOFF_MS[Math.min(attempt, PROBE_BACKOFF_MS.length - 1)];
      await sleep(delayMs);
    }
    if (!stopped) {
      // Mark the session terminal at give-up. failPendingAndEnd defers stop() under output
      // backpressure, so leaving state='REATTACHING' would let the ensureReattachRunning
      // guard restart a fresh 40-attempt loop. CLOSED is terminal and blocks that restart.
      state = 'CLOSED';
      failPendingAndEnd();
    }
  }

  function ensureReattachRunning(reason) {
    if (reattachRunning || stopped || clientEnded) return;
    reattachRunning = true;
    reattach()
      .catch((error) => {
        log(`reattach failed: ${error instanceof Error ? error.message : String(error)}`);
        if (!stopped) failPendingAndEnd();
      })
      .finally(() => {
        reattachRunning = false;
        if (!stopped && state === 'REATTACHING' && !clientEnded) {
          log('reattach loop guard restarting');
          ensureReattachRunning('guard');
        }
      });
    log(`backend socket ${reason}; reattaching`);
  }

  function handleBackendFailure(reason) {
    if (stopped) return;
    if (state === 'REATTACHING') {
      ensureReattachRunning(reason);
      return;
    }
    if (clientEnded) {
      if (tracker.pendingRequests.size > 0) {
        failPendingAndEnd();
      } else {
        requestOutputEnd();
      }
      return;
    }
    state = 'REATTACHING';
    pauseClientInput();
    backendSplitter.discard();
    detachSocket(true);
    ensureReattachRunning(reason);
  }

  function onInputData(chunk) {
    clientSplitter.push(chunk);
  }

  function onInputEnd() {
    clientEnded = true;
    halfCloseSocketIfReady();
    finishIfClientEndedAndIdle();
  }

  function onInputClose() {
    clientEnded = true;
    halfCloseSocketIfReady();
    finishIfClientEndedAndIdle();
  }

  function onOutputError() {
    stop();
  }

  async function start() {
    const ready = await waitForDaemonReady(socketPath, probe, connect, log, { maxAttempts: maxColdStartAttempts });
    if (stopped) return;
    if (ready.status !== 'alive') {
      enqueueOutputFrame(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32001,
          message: `backend unavailable: ${ready.reason ?? 'startup-timeout'}`,
          data: { retryable: true },
        },
      }));
      requestOutputEnd();
      return;
    }

    input.on('data', onInputData);
    input.once('end', onInputEnd);
    input.once('close', onInputClose);
    output.once('error', onOutputError);

    await attachFreshSocket();
  }

  return { start, stop };
}

module.exports = {
  createClassifyFrame,
  createSessionProxy,
  __testing: {
    classifyFrame,
    createClassifyFrame,
    createFrameSplitter,
    createPendingRequestsTracker,
    parseFrame,
    resolveColdStartAttempts,
  },
};
