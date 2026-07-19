// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Spec Memory OpenCode Plugin (mk-spec-memory)                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Inject Spec Kit continuity into OpenCode model context and      ║
// ║          expose warm bridge status without leaking local paths.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin/tool';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ID = 'mk-spec-memory';
const DEFAULT_CACHE_TTL_MS = 5000;
const DEFAULT_BRIDGE_TIMEOUT_MS = 3000;
const DEFAULT_CLI_TIMEOUT_MS = 2500;
const DEFAULT_NODE_BINARY = 'node';
const DEFAULT_MAX_BRIEF_CHARS = 2400;
const DEFAULT_MAX_CACHE_ENTRIES = 200;
const MAX_BRIDGE_STDOUT_BYTES = 1024 * 1024;
const BRIEF_MARKER_PREFIX = '[mk-spec-memory:continuity:';
const BRIEF_MARKER_DIGEST_CHARS = 16;
const MIN_MAX_BRIEF_CHARS = BRIEF_MARKER_PREFIX.length + BRIEF_MARKER_DIGEST_CHARS + 1;
const DISABLED_ENV = 'MK_SPEC_MEMORY_PLUGIN_DISABLED';
const LEGACY_DISABLED_ENV = 'SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED';
const BRIDGE_PATH = fileURLToPath(new URL('../skills/system-spec-kit/mcp-server/plugin-bridges/mk-spec-memory-bridge.mjs', import.meta.url));
const SOURCE_PATHS = [
  BRIDGE_PATH,
  fileURLToPath(new URL('../bin/spec-memory.cjs', import.meta.url)),
];

async function loadConfig() {
  const path = join(homedir(), '.config', 'opencode', 'plugin', 'mk-spec-memory.json');
  let raw;
  try {
    raw = await readFile(path, 'utf-8');
  } catch (error) {
    const errorCode = typeof error?.code === 'string' ? error.code : 'UNKNOWN';
    return {
      config: {},
      status: errorCode === 'ENOENT' ? 'missing' : 'read_error',
      errorCode: errorCode === 'ENOENT' ? null : errorCode,
    };
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { config: {}, status: 'parse_error', errorCode: 'INVALID_SHAPE' };
    }
    return { config: parsed, status: 'loaded', errorCode: null };
  } catch {
    return { config: {}, status: 'parse_error', errorCode: 'INVALID_JSON' };
  }
}

const configPromise = loadConfig();

// ─────────────────────────────────────────────────────────────────────────────
// 3. PURE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function normalizePositiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function envDisablesPlugin() {
  return process.env[DISABLED_ENV] === '1' || process.env[LEGACY_DISABLED_ENV] === '1';
}

function disabledEnvName() {
  if (process.env[DISABLED_ENV] === '1') return DISABLED_ENV;
  if (process.env[LEGACY_DISABLED_ENV] === '1') return LEGACY_DISABLED_ENV;
  return null;
}

function normalizeOptions(rawOptions) {
  const options = rawOptions && typeof rawOptions === 'object' ? rawOptions : {};
  const envCacheTtlMs = Number(process.env.MK_SPEC_MEMORY_CACHE_TTL_MS);
  const envBridgeTimeoutMs = Number(process.env.MK_SPEC_MEMORY_BRIDGE_TIMEOUT_MS);
  const envCliTimeoutMs = Number(process.env.MK_SPEC_MEMORY_CLI_TIMEOUT_MS);
  const envMaxBriefChars = Number(process.env.MK_SPEC_MEMORY_MAX_BRIEF_CHARS);
  const envMaxCacheEntries = Number(process.env.MK_SPEC_MEMORY_MAX_CACHE_ENTRIES);

  return {
    enabled: options.enabled !== false && !envDisablesPlugin(),
    cacheTtlMs: normalizePositiveInt(options.cacheTtlMs ?? options.cacheTTLMs, normalizePositiveInt(envCacheTtlMs, DEFAULT_CACHE_TTL_MS)),
    bridgeTimeoutMs: normalizePositiveInt(options.bridgeTimeoutMs, normalizePositiveInt(envBridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS)),
    cliTimeoutMs: normalizePositiveInt(options.cliTimeoutMs, normalizePositiveInt(envCliTimeoutMs, DEFAULT_CLI_TIMEOUT_MS)),
    nodeBinary: typeof options.nodeBinaryOverride === 'string' && options.nodeBinaryOverride.trim()
      ? options.nodeBinaryOverride.trim()
      : (process.env.MK_SPEC_MEMORY_NODE_BINARY || process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY),
    specFolder: typeof options.specFolder === 'string' && options.specFolder.trim()
      ? options.specFolder.trim()
      : (process.env.MK_SPEC_MEMORY_SPEC_FOLDER || undefined),
    maxBriefChars: Math.max(
      MIN_MAX_BRIEF_CHARS,
      normalizePositiveInt(options.maxBriefChars, normalizePositiveInt(envMaxBriefChars, DEFAULT_MAX_BRIEF_CHARS)),
    ),
    maxCacheEntries: normalizePositiveInt(options.maxCacheEntries, normalizePositiveInt(envMaxCacheEntries, DEFAULT_MAX_CACHE_ENTRIES)),
    sourceSignatureOverride: typeof options.sourceSignatureOverride === 'string' ? options.sourceSignatureOverride : null,
  };
}

function sourceSignature() {
  const hash = createHash('sha256');
  for (const sourcePath of SOURCE_PATHS) {
    try {
      const stat = statSync(sourcePath);
      hash.update(sourcePath);
      hash.update('\u001f');
      hash.update(String(stat.mtimeMs));
      hash.update('\u001f');
      hash.update(String(stat.size));
      hash.update('\u001e');
    } catch {
      hash.update(sourcePath);
      hash.update('\u001fmissing\u001e');
    }
  }
  return hash.digest('hex');
}

function stableStringify(value) {
  if (!value || typeof value !== 'object') return JSON.stringify(String(value));
  if (Array.isArray(value)) return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function normalizeSessionID(value) {
  if (value === null || value === undefined || value === '') return '__global__';
  if (typeof value === 'object') return stableStringify(value);
  return String(value);
}

function sessionIdFrom(input) {
  if (!input || typeof input !== 'object') return '__global__';
  return normalizeSessionID(
    input.sessionID
    || input.sessionId
    || input.session?.id
    || input.properties?.sessionID
    || input.properties?.info?.sessionID
    || input.properties?.info?.id
    || '__global__',
  );
}

function eventPayloadFrom(event) {
  if (event?.payload && typeof event.payload === 'object') return event.payload;
  return event;
}

function eventTypeFrom(event) {
  const payload = eventPayloadFrom(event);
  return typeof payload?.type === 'string' ? payload.type : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EVENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function extractEventSessionID(event) {
  const payload = eventPayloadFrom(event);
  return sessionIdFrom(payload);
}

function normalizeWorkspaceRoot(workspaceRoot) {
  if (typeof workspaceRoot === 'string' && workspaceRoot.trim()) {
    return resolvePath(workspaceRoot.trim());
  }
  return resolvePath(process.cwd());
}

function statusSafeBinary(binary) {
  if (typeof binary === 'string' && (binary.includes('/') || binary.includes('\\'))) {
    return '[configured-node]';
  }
  return binary;
}

function parseBridgeResponse(stdout) {
  if (!stdout.trim()) {
    return { status: 'fail_open', brief: null, data: null, metadata: {}, error: 'EMPTY_STDOUT' };
  }
  try {
    const parsed = JSON.parse(stdout.trim());
    const status = ['ok', 'skipped', 'fail_open'].includes(parsed?.status) ? parsed.status : 'fail_open';
    return {
      status,
      brief: typeof parsed?.brief === 'string' && parsed.brief.trim() ? parsed.brief : null,
      data: parsed?.data ?? null,
      metadata: parsed?.metadata && typeof parsed.metadata === 'object' ? parsed.metadata : {},
      ...(typeof parsed?.error === 'string' ? { error: parsed.error } : {}),
    };
  } catch {
    return { status: 'fail_open', brief: null, data: null, metadata: {}, error: 'PARSE_FAIL' };
  }
}

function cacheKeyFor({ sessionID, specFolder, workspaceRoot, signature }) {
  const sessionKey = normalizeSessionID(sessionID);
  const payloadKey = createHash('sha256')
    .update(normalizeSessionID(sessionID))
    .update('\u001f')
    .update(specFolder ?? '__workspace__')
    .update('\u001f')
    .update(workspaceRoot)
    .update('\u001f')
    .update(signature)
    .digest('hex');
  return `${sessionKey}::${payloadKey}`;
}

function insertWithEviction(cache, key, value, maxEntries) {
  cache.set(key, value);
  while (cache.size > maxEntries) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

function clampBrief(brief, maxChars) {
  if (typeof brief !== 'string' || brief.length <= maxChars) return brief;
  if (maxChars <= 3) return '.'.repeat(Math.max(0, maxChars));
  return `${brief.slice(0, maxChars - 3).trimEnd()}...`;
}

function markedBrief(brief, maxChars) {
  const digest = createHash('sha256')
    .update(brief)
    .digest('hex')
    .slice(0, BRIEF_MARKER_DIGEST_CHARS);
  const marker = `${BRIEF_MARKER_PREFIX}${digest}]`;
  const contentBudget = Math.max(0, maxChars - marker.length - 1);
  const content = contentBudget > 0 ? clampBrief(brief, contentBudget) : '';
  return {
    marker,
    text: content ? `${content}\n${marker}` : marker,
  };
}

function bridgePayload({ request, projectDir, sessionID, options }) {
  const payload = {
    request,
    workspaceRoot: projectDir,
    timeoutMs: options.cliTimeoutMs,
    maxBriefChars: options.maxBriefChars,
    specFolder: options.specFolder,
    sessionId: normalizeSessionID(sessionID) === '__global__' ? undefined : normalizeSessionID(sessionID),
  };
  return JSON.stringify(payload);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the Spec Kit memory OpenCode plugin hooks.
 *
 * @param {import('@opencode-ai/plugin').PluginInput} ctx - OpenCode plugin context
 * @param {Object} [rawOptions] - Plugin options
 * @param {boolean} [rawOptions.enabled] - Whether continuity injection is enabled
 * @param {number} [rawOptions.cacheTtlMs] - Continuity cache TTL in milliseconds
 * @param {number} [rawOptions.cacheTTLMs] - Continuity cache TTL alias in milliseconds
 * @param {number} [rawOptions.bridgeTimeoutMs] - Bridge subprocess timeout in milliseconds
 * @param {number} [rawOptions.cliTimeoutMs] - Warm CLI timeout passed to the bridge
 * @param {string} [rawOptions.nodeBinaryOverride] - Node binary used for the bridge subprocess
 * @param {string} [rawOptions.specFolder] - Optional spec folder scope for continuity recovery
 * @param {number} [rawOptions.maxBriefChars] - Maximum injected continuity brief characters
 * @param {number} [rawOptions.maxCacheEntries] - Maximum continuity cache entries
 * @param {string} [rawOptions.sourceSignatureOverride] - Test override for source signature
 * @returns {Promise<Object>} Hooks with `event`, `experimental.chat.system.transform`, and `tool`
 */
export default async function MkSpecMemoryPlugin(ctx, rawOptions) {
  const configResult = await configPromise;
  const merged = { ...configResult.config, ...rawOptions };
  const options = normalizeOptions(merged);
  const projectDir = normalizeWorkspaceRoot(ctx?.directory);

  const state = {
    continuityCache: new Map(),
    inFlight: new Map(),
    sessionGenerations: new Map(),
    runtimeReady: false,
    lastBridgeStatus: 'uninitialized',
    lastErrorCode: null,
    lastDurationMs: 0,
    bridgeInvocations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    continuityLookups: 0,
    disabledReason: !options.enabled ? (disabledEnvName() ?? 'config_enabled_false') : null,
  };

  function runBridge({ request, sessionID }) {
    const startedAt = Date.now();
    state.bridgeInvocations += 1;
    return new Promise((resolve) => {
      const child = spawn(options.nodeBinary, [BRIDGE_PATH], {
        cwd: projectDir,
        env: process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const stdoutChunks = [];
      let stdoutBytes = 0;
      let settled = false;
      let timeout;
      const finish = (response) => {
        if (settled) return;
        settled = true;
        if (timeout) clearTimeout(timeout);
        state.lastBridgeStatus = response.status;
        state.lastErrorCode = response.error ?? null;
        state.lastDurationMs = Date.now() - startedAt;
        state.runtimeReady = response.status === 'ok';
        resolve(response);
      };
      timeout = setTimeout(() => {
        if (settled) return;
        child.kill('SIGTERM');
        const forceKill = setTimeout(() => child.kill('SIGKILL'), 1000);
        forceKill.unref?.();
        finish({ status: 'fail_open', brief: null, data: null, metadata: {}, error: 'TIMEOUT' });
      }, options.bridgeTimeoutMs);

      child.stdout?.on('data', (chunk) => {
        if (settled) return;
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        if (stdoutBytes + buffer.length > MAX_BRIDGE_STDOUT_BYTES) {
          child.kill('SIGKILL');
          finish({ status: 'fail_open', brief: null, data: null, metadata: {}, error: 'STDOUT_OVERFLOW' });
          return;
        }
        stdoutChunks.push(buffer);
        stdoutBytes += buffer.length;
      });
      child.stderr?.on('data', () => { });
      child.on('error', () => {
        finish({ status: 'fail_open', brief: null, data: null, metadata: {}, error: 'SPAWN_ERROR' });
      });
      child.on('close', (code) => {
        if (settled) return;
        const response = parseBridgeResponse(Buffer.concat(stdoutChunks, stdoutBytes).toString('utf8'));
        if (code !== 0 && response.status !== 'fail_open') {
          response.status = 'fail_open';
          response.brief = null;
          response.error = 'NONZERO_EXIT';
        }
        finish(response);
      });
      child.stdin?.on('error', (error) => {
        child.kill('SIGKILL');
        finish({
          status: 'fail_open',
          brief: null,
          data: null,
          metadata: {},
          error: error?.code === 'EPIPE' ? 'EPIPE' : 'STDIN_ERROR',
        });
      });
      try {
        child.stdin?.end(bridgePayload({ request, projectDir, sessionID, options }));
      } catch {
        child.kill('SIGKILL');
        finish({ status: 'fail_open', brief: null, data: null, metadata: {}, error: 'STDIN_ERROR' });
      }
    });
  }

  async function getContinuity({ sessionID }) {
    state.continuityLookups += 1;
    const sessionKey = normalizeSessionID(sessionID);
    const generation = state.sessionGenerations.get(sessionKey) ?? 0;
    state.sessionGenerations.set(sessionKey, generation);
    const signature = options.sourceSignatureOverride ?? sourceSignature();
    const key = cacheKeyFor({
      sessionID,
      specFolder: options.specFolder,
      workspaceRoot: projectDir,
      signature,
    });
    const now = Date.now();
    const cached = state.continuityCache.get(key);
    if (cached && cached.expiresAt > now) {
      state.continuityCache.delete(key);
      state.continuityCache.set(key, cached);
      state.cacheHits += 1;
      return cached.response;
    }
    const inFlight = state.inFlight.get(key);
    if (inFlight && inFlight.generation === generation) {
      state.cacheHits += 1;
      return inFlight.promise;
    }
    state.cacheMisses += 1;
    let promise;
    promise = runBridge({ request: 'brief', sessionID }).finally(() => {
      if (state.inFlight.get(key)?.promise === promise) {
        state.inFlight.delete(key);
      }
    });
    state.inFlight.set(key, { generation, promise });
    const response = await promise;
    if (state.sessionGenerations.get(sessionKey) === generation) {
      if (response.status === 'ok' && response.brief) {
        insertWithEviction(state.continuityCache, key, {
          response,
          expiresAt: now + options.cacheTtlMs,
          updatedAt: new Date(now).toISOString(),
        }, options.maxCacheEntries);
      } else {
        state.continuityCache.delete(key);
      }
    }
    return response;
  }

  function resetRuntimeState() {
    state.continuityCache.clear();
    state.inFlight.clear();
    state.sessionGenerations.clear();
    state.runtimeReady = false;
    state.lastBridgeStatus = 'uninitialized';
    state.lastErrorCode = null;
    state.lastDurationMs = 0;
    state.bridgeInvocations = 0;
    state.cacheHits = 0;
    state.cacheMisses = 0;
    state.continuityLookups = 0;
    state.disabledReason = !options.enabled ? (disabledEnvName() ?? 'config_enabled_false') : null;
  }

  function cacheHitRate() {
    const total = state.cacheHits + state.cacheMisses;
    return total === 0 ? 0 : Number((state.cacheHits / total).toFixed(3));
  }

  function invalidateSession(sessionID) {
    const sessionKey = normalizeSessionID(sessionID);
    if (sessionKey === '__global__') {
      for (const [key, generation] of state.sessionGenerations) {
        state.sessionGenerations.set(key, generation + 1);
      }
      state.continuityCache.clear();
      state.inFlight.clear();
      return;
    }
    state.sessionGenerations.set(sessionKey, (state.sessionGenerations.get(sessionKey) ?? 0) + 1);
    for (const key of [...state.continuityCache.keys()]) {
      if (key.startsWith(`${sessionKey}::`)) {
        state.continuityCache.delete(key);
      }
    }
    for (const key of [...state.inFlight.keys()]) {
      if (key.startsWith(`${sessionKey}::`)) {
        state.inFlight.delete(key);
      }
    }
  }

  async function appendContinuityBrief(input = {}, output = { system: [] }) {
    if (!output || typeof output !== 'object') return;
    output.system = Array.isArray(output.system) ? output.system : [];
    if (!options.enabled) return;
    const sessionID = sessionIdFrom(input);
    const result = await getContinuity({ sessionID });
    if (!result.brief) return;
    const brief = markedBrief(result.brief, options.maxBriefChars);
    if (output.system.some((entry) => typeof entry === 'string' && entry.includes(brief.marker))) return;
    output.system.push(brief.text);
  }

  return {
    event: async ({ event }) => {
      const eventType = eventTypeFrom(event);
      if (eventType === 'session.created') {
        if (options.enabled) state.runtimeReady = true;
        return;
      }
      if (eventType === 'session.deleted') {
        invalidateSession(extractEventSessionID(event));
        return;
      }
      if (eventType === 'server.instance.disposed' || eventType === 'global.disposed') {
        resetRuntimeState();
      }
    },

    'experimental.chat.system.transform': appendContinuityBrief,

    tool: {
      mk_spec_memory_status: tool({
        description: 'Show Spec Kit Memory OpenCode plugin and warm CLI bridge status',
        args: {},
        async execute() {
          const bridgeStatus = options.enabled
            ? await runBridge({ request: 'status', sessionID: '__global__' })
            : { status: 'skipped', metadata: {}, error: state.disabledReason ?? 'disabled' };
          return [
            `plugin_id=${PLUGIN_ID}`,
            `enabled=${options.enabled}`,
            `disabled_reason=${state.disabledReason ?? 'none'}`,
            `config_status=${configResult.status}`,
            `config_error_code=${configResult.errorCode ?? 'none'}`,
            `cache_ttl_ms=${options.cacheTtlMs}`,
            `max_brief_chars=${options.maxBriefChars}`,
            `max_cache_entries=${options.maxCacheEntries}`,
            `runtime_ready=${state.runtimeReady}`,
            `node_binary=${statusSafeBinary(options.nodeBinary)}`,
            `bridge_timeout_ms=${options.bridgeTimeoutMs}`,
            `cli_timeout_ms=${options.cliTimeoutMs}`,
            `bridge_path=[spec-memory-bridge]`,
            `last_bridge_status=${state.lastBridgeStatus}`,
            `last_error_code=${state.lastErrorCode ?? 'none'}`,
            `last_duration_ms=${state.lastDurationMs}`,
            `bridge_invocations=${state.bridgeInvocations}`,
            `continuity_lookups=${state.continuityLookups}`,
            `cache_entries=${state.continuityCache.size}`,
            `cache_hits=${state.cacheHits}`,
            `cache_misses=${state.cacheMisses}`,
            `cache_hit_rate=${cacheHitRate()}`,
            `continuity_recovery=per_transform_warm`,
            `continuity_compaction=unsupported_runtime_event`,
            `continuity_autosave=unsupported_runtime_event`,
            `warm_status=${bridgeStatus.status}`,
            `warm_error=${bridgeStatus.error ?? 'none'}`,
            `warm_route=${bridgeStatus.metadata?.route ?? 'unknown'}`,
            `warm_retryable=${bridgeStatus.metadata?.retryable ?? false}`,
            `warm_exit_code=${bridgeStatus.metadata?.exitCode ?? 'none'}`,
          ].join('\n');
        },
      }),
    },
  };
}
