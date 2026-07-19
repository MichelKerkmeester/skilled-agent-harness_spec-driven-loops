// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Skill Advisor OpenCode Plugin (mk-skill-advisor)              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Inject skill advisor brief into OpenCode model context per      ║
// ║          prompt; expose status tool; manage per-instance state,          ║
// ║          in-flight dedup, and bounded prompt/brief/cache sizes.           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin/tool';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ID = 'mk-skill-advisor';
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_THRESHOLD_CONFIDENCE = 0.8;
const DEFAULT_MAX_TOKENS = 80;
const DEFAULT_BRIDGE_TIMEOUT_MS = 2500;
const DEFAULT_NODE_BINARY = 'node';
const DEFAULT_MAX_PROMPT_BYTES = 64 * 1024;
const DEFAULT_MAX_BRIEF_CHARS = 2 * 1024;
const DEFAULT_MAX_CACHE_ENTRIES = 1000;
const MAX_BRIDGE_STDOUT_BYTES = 256 * 1024;
const BRIDGE_TERMINATION_GRACE_MS = 250;
const DISABLED_ENV = 'MK_SKILL_ADVISOR_HOOK_DISABLED';
const DISABLED_ENV_PLUGIN = 'MK_SKILL_ADVISOR_PLUGIN_DISABLED';
const LEGACY_HOOK_DISABLED_ENV = 'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED';
const LEGACY_PLUGIN_DISABLED_ENV = 'SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED';
const HYGIENE_DIRECTIVE = 'Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';
const GOVERNOR_DIRECTIVE = '\nFable-5 governor: reason about the problem and the person, not yourself; lead with the result and act rather than narrate (batch tool calls, report at checkpoints); treat reversible decisions as cheap — decide, mark // DECISION:, move on; qualify only when it changes what the reader should do.';
const FALLBACK_DIRECTIVE = HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE;
const BRIDGE_PATH = fileURLToPath(new URL('../skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs', import.meta.url));
// Cache-signature paths follow the standalone advisor package to ensure
// consistent cache invalidation across bridge and MCP server builds.
// The bridge now dispatches through mk_skill_advisor instead of the old
// memory-owned advisor compat path.
const ADVISOR_SOURCE_PATHS = [
  BRIDGE_PATH,
  fileURLToPath(new URL('../bin/mk-skill-advisor-launcher.cjs', import.meta.url)),
  fileURLToPath(new URL('../skills/system-skill-advisor/mcp-server/advisor-server.ts', import.meta.url)),
  fileURLToPath(new URL('../skills/system-skill-advisor/mcp-server/dist/mcp-server/advisor-server.js', import.meta.url)),
];
const SKILL_ROOT_RELATIVE_PATH = join('.opencode', 'skills');
const ADVISOR_ROOT_RELATIVE_PATH = join(SKILL_ROOT_RELATIVE_PATH, 'system-skill-advisor', 'mcp-server');
const ADVISOR_JSON_RELATIVE_PATH = join(ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill-graph.json');
const ADVISOR_SCRIPT_RELATIVE_PATHS = [
  join(ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill_advisor.py'),
  join(ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill_advisor_runtime.py'),
  join(ADVISOR_ROOT_RELATIVE_PATH, 'scripts', 'skill_graph_compiler.py'),
];

async function loadConfig() {
  const path = join(homedir(), '.config', 'opencode', 'plugin', 'mk-skill-advisor.json');
  try {
    const raw = await readFile(path, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { values: {}, status: 'error', errorCode: 'CONFIG_PARSE_ERROR' };
    }
    return { values: parsed, status: 'loaded', errorCode: null };
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return { values: {}, status: 'absent', errorCode: null };
    }
    return {
      values: {},
      status: 'error',
      errorCode: error instanceof SyntaxError ? 'CONFIG_PARSE_ERROR' : 'CONFIG_READ_ERROR',
    };
  }
}

const configPromise = loadConfig();

// ─────────────────────────────────────────────────────────────────────────────
// 3. PURE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function normalizePositiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function normalizeThreshold(value) {
  if (!Number.isFinite(value)) {
    return DEFAULT_THRESHOLD_CONFIDENCE;
  }
  return Math.min(1, Math.max(0, Number(value)));
}

function envDisablesPlugin() {
  return process.env[DISABLED_ENV] === '1'
    || process.env[DISABLED_ENV_PLUGIN] === '1'
    || process.env[LEGACY_HOOK_DISABLED_ENV] === '1'
    || process.env[LEGACY_PLUGIN_DISABLED_ENV] === '1';
}

function disabledEnvName() {
  if (process.env[DISABLED_ENV] === '1') {
    return DISABLED_ENV;
  }
  if (process.env[DISABLED_ENV_PLUGIN] === '1') {
    return DISABLED_ENV_PLUGIN;
  }
  if (process.env[LEGACY_HOOK_DISABLED_ENV] === '1') {
    return LEGACY_HOOK_DISABLED_ENV;
  }
  if (process.env[LEGACY_PLUGIN_DISABLED_ENV] === '1') {
    return LEGACY_PLUGIN_DISABLED_ENV;
  }
  return null;
}

function addFileSignature(hash, label, sourcePath) {
  try {
    const stat = statSync(sourcePath);
    if (!stat.isFile()) {
      throw new Error('not a file');
    }
    hash.update(label);
    hash.update('\u001f');
    hash.update(sourcePath);
    hash.update('\u001f');
    hash.update(String(stat.mtimeMs));
    hash.update('\u001f');
    hash.update(String(stat.size));
    hash.update('\u001f');
    hash.update(createHash('sha256').update(readFileSync(sourcePath)).digest('hex'));
    hash.update('\u001e');
  } catch {
    hash.update(label);
    hash.update('\u001fmissing\u001e');
  }
}

function advisorSourceSignature(workspaceRoot) {
  const hash = createHash('sha256');
  for (const sourcePath of ADVISOR_SOURCE_PATHS) {
    addFileSignature(hash, `implementation:${sourcePath}`, sourcePath);
  }

  const skillRoot = join(workspaceRoot, SKILL_ROOT_RELATIVE_PATH);
  try {
    const skillSlugs = readdirSync(skillRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
    for (const skillSlug of skillSlugs) {
      const skillDir = join(skillRoot, skillSlug);
      addFileSignature(hash, `skill:${skillSlug}:SKILL.md`, join(skillDir, 'SKILL.md'));
      addFileSignature(hash, `skill:${skillSlug}:graph-metadata.json`, join(skillDir, 'graph-metadata.json'));
    }
  } catch {
    hash.update(`${SKILL_ROOT_RELATIVE_PATH}\u001fmissing\u001e`);
  }

  for (const relativePath of ADVISOR_SCRIPT_RELATIVE_PATHS) {
    addFileSignature(hash, relativePath, join(workspaceRoot, relativePath));
  }
  const dbDir = process.env.MK_SKILL_ADVISOR_DB_DIR
    ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR
    ?? join(workspaceRoot, ADVISOR_ROOT_RELATIVE_PATH, 'database');
  addFileSignature(hash, 'skill-graph.sqlite', join(dbDir, 'skill-graph.sqlite'));
  addFileSignature(hash, ADVISOR_JSON_RELATIVE_PATH, join(workspaceRoot, ADVISOR_JSON_RELATIVE_PATH));
  return hash.digest('hex');
}

function normalizeOptions(rawOptions) {
  const options = rawOptions && typeof rawOptions === 'object' ? rawOptions : {};
  const configuredTtl = options.cacheTTLMs ?? options.cacheTtlMs;
  const enabled = options.enabled !== false && !envDisablesPlugin();

  const envCacheTTLMs = Number(process.env.MK_SKILL_ADVISOR_CACHE_TTL_MS);
  const envThreshold = Number(process.env.MK_SKILL_ADVISOR_THRESHOLD_CONFIDENCE);
  const envMaxTokens = Number(process.env.MK_SKILL_ADVISOR_MAX_TOKENS);
  const envBridgeTimeoutMs = Number(process.env.MK_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS);
  const envMaxPromptBytes = Number(process.env.MK_SKILL_ADVISOR_MAX_PROMPT_BYTES);
  const envMaxBriefChars = Number(process.env.MK_SKILL_ADVISOR_MAX_BRIEF_CHARS);
  const envMaxCacheEntries = Number(process.env.MK_SKILL_ADVISOR_MAX_CACHE_ENTRIES);

  return {
    enabled,
    cacheTTLMs: normalizePositiveInt(configuredTtl, normalizePositiveInt(envCacheTTLMs, DEFAULT_CACHE_TTL_MS)),
    thresholdConfidence: normalizeThreshold(options.thresholdConfidence ?? (Number.isFinite(envThreshold) ? envThreshold : undefined)),
    maxTokens: normalizePositiveInt(options.maxTokens, normalizePositiveInt(envMaxTokens, DEFAULT_MAX_TOKENS)),
    nodeBinary: typeof options.nodeBinaryOverride === 'string' && options.nodeBinaryOverride.trim()
      ? options.nodeBinaryOverride.trim()
      : (process.env.MK_SKILL_ADVISOR_NODE_BINARY || process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY),
    bridgeTimeoutMs: normalizePositiveInt(options.bridgeTimeoutMs, normalizePositiveInt(envBridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS)),
    maxPromptBytes: normalizePositiveInt(options.maxPromptBytes, normalizePositiveInt(envMaxPromptBytes, DEFAULT_MAX_PROMPT_BYTES)),
    maxBriefChars: normalizePositiveInt(options.maxBriefChars, normalizePositiveInt(envMaxBriefChars, DEFAULT_MAX_BRIEF_CHARS)),
    maxCacheEntries: normalizePositiveInt(options.maxCacheEntries, normalizePositiveInt(envMaxCacheEntries, DEFAULT_MAX_CACHE_ENTRIES)),
    sourceSignatureOverride: typeof options.sourceSignatureOverride === 'string'
      ? options.sourceSignatureOverride
      : null,
    sourceSignatureProvider: typeof options.sourceSignatureProvider === 'function'
      ? options.sourceSignatureProvider
      : advisorSourceSignature,
    spawnBridge: typeof options.spawnOverride === 'function' ? options.spawnOverride : spawn,
  };
}

function sessionIdFrom(input) {
  if (!input || typeof input !== 'object') {
    return '__global__';
  }
  return normalizeSessionID(input.sessionID
    || input.sessionId
    || input.session?.id
    || input.properties?.sessionID
    || '__global__');
}

function stableStringify(value) {
  if (!value || typeof value !== 'object') {
    return JSON.stringify(String(value));
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
}

function normalizeSessionID(value) {
  if (value === null || value === undefined || value === '') {
    return '__global__';
  }
  if (typeof value === 'object') {
    return stableStringify(value);
  }
  return String(value);
}

function normalizeWorkspaceRoot(workspaceRoot) {
  if (typeof workspaceRoot === 'string' && workspaceRoot.trim()) {
    return resolvePath(workspaceRoot.trim());
  }
  return resolvePath(process.cwd());
}

function statusSafePath(label) {
  return `[${label}]`;
}

function statusSafeBinary(binary) {
  if (typeof binary === 'string' && (binary.includes('/') || binary.includes('\\'))) {
    return '[configured-node]';
  }
  return binary;
}

function cacheKeyForPrompt(prompt, options, sessionID, sourceSignature, workspaceRoot) {
  const sessionKey = normalizeSessionID(sessionID);
  const promptKey = createHash('sha256')
    .update(prompt)
    .update('\u001f')
    .update(String(options.thresholdConfidence))
    .update('\u001f')
    .update(String(options.maxTokens))
    .update('\u001f')
    .update(sourceSignature)
    .update('\u001f')
    .update(workspaceRoot)
    .digest('hex');
  return `${String(sessionKey)}::${promptKey}`;
}

function extractPrompt(input) {
  if (typeof input === 'string') {
    return input;
  }
  if (!input || typeof input !== 'object') {
    return null;
  }

  const candidates = [
    input.prompt,
    input.text,
    input.userPrompt,
    input.message,
    input.input,
    input.properties?.prompt,
    input.properties?.message,
    input.request?.prompt,
    input.request?.message,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
    if (candidate && typeof candidate === 'object') {
      const content = candidate.content ?? candidate.text;
      if (typeof content === 'string' && content.trim()) {
        return content;
      }
    }
  }

  return null;
}

function promptSafeErrorCode(value) {
  if (typeof value === 'string' && /^[A-Z0-9_]+$/.test(value)) {
    return value;
  }
  return 'UNKNOWN';
}

function parseBridgeResponse(stdout) {
  if (!stdout.trim()) {
    return {
      brief: null,
      status: 'fail_open',
      error: 'EMPTY_STDOUT',
      metadata: {},
    };
  }

  try {
    const parsed = JSON.parse(stdout.trim());
    const status = ['ok', 'skipped', 'degraded', 'fail_open'].includes(parsed?.status)
      ? parsed.status
      : 'fail_open';
    return {
      brief: typeof parsed?.brief === 'string' && parsed.brief.trim() ? parsed.brief : null,
      status,
      metadata: parsed?.metadata && typeof parsed.metadata === 'object' ? parsed.metadata : {},
      ...(typeof parsed?.error === 'string' ? { error: promptSafeErrorCode(parsed.error) } : {}),
    };
  } catch {
    return {
      brief: null,
      status: 'fail_open',
      error: 'PARSE_FAIL',
      metadata: {},
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SIZE-CAP HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clamp prompt text to the requested UTF-8 byte budget.
 *
 * @param {string} prompt - Prompt text to clamp
 * @param {number} maxBytes - Maximum UTF-8 byte count to retain
 * @returns {string} Original prompt or byte-safe prefix within the budget
 */
function clampPrompt(prompt, maxBytes) {
  if (typeof prompt !== 'string' || Buffer.byteLength(prompt, 'utf8') <= maxBytes) {
    return prompt;
  }

  let low = 0;
  let high = prompt.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (Buffer.byteLength(prompt.slice(0, mid), 'utf8') <= maxBytes) {
      low = mid;
      continue;
    }
    high = mid - 1;
  }
  return prompt.slice(0, low);
}

/**
 * Clamp advisor brief text by JavaScript character count.
 *
 * @param {string} brief - Advisor brief text to clamp
 * @param {number} maxChars - Maximum character count to retain
 * @returns {string} Original brief or truncated prefix within the limit
 */
function clampBrief(brief, maxChars) {
  if (typeof brief !== 'string' || brief.length <= maxChars) {
    return brief;
  }
  return brief.slice(0, maxChars);
}

/**
 * Insert a cache value and evict oldest entries by insertion order.
 *
 * @param {Map<string, Object>} cache - Cache map using insertion order as LRU state
 * @param {string} key - Cache key to insert or refresh
 * @param {Object} value - Cache value to store
 * @param {number} maxEntries - Maximum entries retained after insertion
 * @returns {void}
 */
function insertWithEviction(cache, key, value, maxEntries) {
  cache.set(key, value);
  while (cache.size > maxEntries) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

function bridgePayloadJson({ prompt, projectDir, options }) {
  const basePayload = {
    prompt: '',
    workspaceRoot: projectDir,
    runtime: 'opencode',
    maxTokens: options.maxTokens,
    thresholdConfidence: options.thresholdConfidence,
  };
  const payloadOverheadBytes = Buffer.byteLength(JSON.stringify(basePayload), 'utf8');
  const promptBudgetBytes = Math.max(0, options.maxPromptBytes - payloadOverheadBytes);
  return JSON.stringify({
    ...basePayload,
    prompt: clampPrompt(prompt, promptBudgetBytes),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EVENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function eventPayloadFrom(event) {
  if (event?.payload && typeof event.payload === 'object') {
    return event.payload;
  }
  return event;
}

function eventTypeFrom(event) {
  const payload = eventPayloadFrom(event);
  return typeof payload?.type === 'string' ? payload.type : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the Spec Kit skill advisor OpenCode plugin hooks.
 *
 * @param {import('@opencode-ai/plugin').PluginInput} ctx - OpenCode plugin context
 * @param {Object} [rawOptions] - Plugin options
 * @param {boolean} [rawOptions.enabled] - Whether the plugin should inject advisor briefs
 * @param {number} [rawOptions.cacheTTLMs] - Advisor cache TTL in milliseconds
 * @param {number} [rawOptions.cacheTtlMs] - Advisor cache TTL alias in milliseconds
 * @param {number} [rawOptions.thresholdConfidence] - Minimum advisor confidence threshold
 * @param {number} [rawOptions.maxTokens] - Maximum advisor brief tokens requested from bridge
 * @param {string} [rawOptions.nodeBinaryOverride] - Node binary used for the bridge subprocess
 * @param {number} [rawOptions.bridgeTimeoutMs] - Bridge subprocess timeout in milliseconds
 * @param {number} [rawOptions.maxPromptBytes] - Maximum bridge prompt payload bytes
 * @param {number} [rawOptions.maxBriefChars] - Maximum injected advisor brief characters
 * @param {number} [rawOptions.maxCacheEntries] - Maximum advisor cache entries
 * @param {string} [rawOptions.sourceSignatureOverride] - Test override for advisor source signature
 * @returns {Promise<Object>} Hooks with `event`, `experimental.chat.system.transform`, and `tool`
 */
export default async function MkSkillAdvisorPlugin(ctx, rawOptions) {
  const fileConfig = await configPromise;
  const merged = { ...fileConfig.values, ...rawOptions };
  const options = normalizeOptions(merged);
  const projectDir = normalizeWorkspaceRoot(ctx?.directory);

  // Per-instance state so two plugin instances loaded in the same process maintain independent caches/metrics.
  const state = {
    advisorCache: new Map(),
    // In-flight promise dedup — concurrent identical-key requests share one bridge spawn.
    inFlight: new Map(),
    epoch: 0,
    runtimeReady: false,
    lastBridgeStatus: 'uninitialized',
    lastErrorCode: null,
    lastDurationMs: 0,
    bridgeInvocations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    advisorLookups: 0,
    configStatus: fileConfig.status,
    configErrorCode: fileConfig.errorCode,
    disabledReason: !options.enabled
      ? (disabledEnvName() ?? 'config_enabled_false')
      : null,
  };

  /**
   * Run the skill-advisor bridge subprocess and parse its JSON response.
   * The bridge receives stdin JSON from `bridgePayloadJson`, returns stdout JSON
   * parsed by `parseBridgeResponse`, gets SIGTERM shortly before the deadline,
   * and gets SIGKILL at the deadline if the process has not settled.
   *
   * @param {Object} params - Bridge invocation parameters
   * @param {string} params.projectDir - Working directory for the bridge subprocess
   * @param {string} params.prompt - Prompt sent to the bridge over stdin JSON
   * @param {Object} params.options - Normalized plugin options
   * @param {string} params.options.nodeBinary - Node binary used to spawn the bridge
   * @param {number} params.options.bridgeTimeoutMs - Timeout before SIGTERM is sent
   * @returns {Promise<Object>} Parsed stdout JSON with `brief`, `status`, `error`, and `metadata`
   */
  function runBridge({ projectDir, prompt, options }) {
    const startedAt = Date.now();
    state.bridgeInvocations += 1;

    return new Promise((resolve) => {
      let stdout = '';
      let stdoutBytes = 0;
      let settled = false;
      let timedOut = false;
      let termTimer = null;
      let deadlineTimer = null;
      let child = null;

      const finish = (response) => {
        if (settled) {
          return;
        }
        settled = true;
        if (termTimer) clearTimeout(termTimer);
        if (deadlineTimer) clearTimeout(deadlineTimer);
        state.lastBridgeStatus = response.status;
        state.lastErrorCode = response.error ?? null;
        state.lastDurationMs = Date.now() - startedAt;
        resolve(response);
      };

      try {
        child = options.spawnBridge(options.nodeBinary, [BRIDGE_PATH], {
          cwd: projectDir,
          env: process.env,
          stdio: ['pipe', 'pipe', 'ignore'],
        });
      } catch {
        finish({ brief: null, status: 'fail_open', error: 'SPAWN_ERROR', metadata: {} });
        return;
      }

      const graceMs = Math.min(BRIDGE_TERMINATION_GRACE_MS, options.bridgeTimeoutMs);
      termTimer = setTimeout(() => {
        if (settled) return;
        timedOut = true;
        child.kill('SIGTERM');
      }, Math.max(0, options.bridgeTimeoutMs - graceMs));
      deadlineTimer = setTimeout(() => {
        if (settled) return;
        timedOut = true;
        child.kill('SIGKILL');
        finish({ brief: null, status: 'fail_open', error: 'TIMEOUT', metadata: {} });
      }, options.bridgeTimeoutMs);
      termTimer.unref?.();
      deadlineTimer.unref?.();

      child.stdout?.setEncoding?.('utf8');
      child.stdout?.on('data', (chunk) => {
        if (settled) return;
        const text = String(chunk);
        stdoutBytes += Buffer.byteLength(text, 'utf8');
        if (stdoutBytes > MAX_BRIDGE_STDOUT_BYTES) {
          child.kill('SIGKILL');
          finish({ brief: null, status: 'fail_open', error: 'BRIDGE_OUTPUT_LIMIT', metadata: {} });
          return;
        }
        stdout += text;
      });

      child.on('error', () => {
        finish({
          brief: null,
          status: 'fail_open',
          error: timedOut ? 'TIMEOUT' : 'SPAWN_ERROR',
          metadata: {},
        });
      });

      child.on('close', (code) => {
        if (settled) return;

        const response = timedOut
          ? { brief: null, status: 'fail_open', error: 'TIMEOUT', metadata: {} }
          : parseBridgeResponse(stdout);
        if (!timedOut && code !== 0 && response.status !== 'fail_open') {
          response.status = 'fail_open';
          response.brief = null;
          response.error = 'NONZERO_EXIT';
        }

        finish(response);
      });

      try {
        child.stdin?.end(bridgePayloadJson({ prompt, projectDir, options }));
      } catch {
        child.kill('SIGKILL');
        finish({ brief: null, status: 'fail_open', error: 'STDIN_WRITE_ERROR', metadata: {} });
      }
    });
  }

  /**
   * Resolve advisor context for a prompt using cache and in-flight deduplication.
   *
   * @param {Object} params - Advisor lookup parameters
   * @param {string} params.projectDir - Workspace root used by the advisor bridge
   * @param {string} params.prompt - User prompt text for advisor matching
   * @param {string} params.sessionID - Session identifier included in the cache key
   * @param {Object} params.options - Normalized plugin options
   * @returns {Promise<Object>} Advisor response with optional `brief` and status metadata
   */
  async function getAdvisorContext({ projectDir, prompt, sessionID, options }) {
    const workspaceRoot = normalizeWorkspaceRoot(projectDir);
    let cacheable = true;
    let sourceSignature;
    try {
      sourceSignature = options.sourceSignatureOverride
        ?? await options.sourceSignatureProvider(workspaceRoot);
      if (typeof sourceSignature !== 'string' || !sourceSignature) {
        throw new TypeError('Invalid source signature');
      }
    } catch {
      cacheable = false;
      sourceSignature = 'unavailable';
    }
    const key = cacheKeyForPrompt(prompt, options, sessionID, sourceSignature, workspaceRoot);
    const now = Date.now();
    const cached = cacheable ? state.advisorCache.get(key) : null;

    state.advisorLookups += 1;
    if (cached && cached.expiresAt > now) {
      state.advisorCache.delete(key);
      state.advisorCache.set(key, cached);
      state.cacheHits += 1;
      return cached.response;
    }

    const inFlight = state.inFlight.get(key);
    if (inFlight) {
      state.cacheHits += 1;
      return inFlight;
    }

    state.cacheMisses += 1;
    const epochAtStart = state.epoch;
    const promise = runBridge({ projectDir, prompt, options }).finally(() => {
      if (state.inFlight.get(key) === promise) {
        state.inFlight.delete(key);
      }
    });
    state.inFlight.set(key, promise);
    const response = await promise;
    if (cacheable && response.status === 'ok' && response.brief && state.epoch === epochAtStart) {
      const completedAt = Date.now();
      insertWithEviction(state.advisorCache, key, {
        response,
        expiresAt: completedAt + options.cacheTTLMs,
        updatedAt: new Date(completedAt).toISOString(),
      }, options.maxCacheEntries);
    } else {
      state.advisorCache.delete(key);
    }
    return response;
  }

  function resetRuntimeState() {
    state.epoch += 1;
    state.advisorCache.clear();
    state.inFlight.clear();
    state.runtimeReady = false;
    state.lastBridgeStatus = 'uninitialized';
    state.lastErrorCode = null;
    state.lastDurationMs = 0;
    state.bridgeInvocations = 0;
    state.cacheHits = 0;
    state.cacheMisses = 0;
    state.advisorLookups = 0;
    state.disabledReason = !options.enabled
      ? (disabledEnvName() ?? 'config_enabled_false')
      : null;
  }

  function cacheHitRate() {
    const total = state.cacheHits + state.cacheMisses;
    return total === 0 ? 0 : Number((state.cacheHits / total).toFixed(3));
  }

  /**
   * Append an advisor brief to the OpenCode chat system output.
   *
   * @param {Object} [input={}] - OpenCode system-transform hook input
   * @param {Object} [output={ system: [] }] - OpenCode system-transform hook output
   * @param {Array<string>} [output.system] - System context entries mutated in place
   * @returns {Promise<void>} Resolves after optional advisor context injection
   */
  async function appendAdvisorBrief(input = {}, output = { system: [] }) {
    if (!output || typeof output !== 'object') {
      return;
    }
    try {
      output.system = Array.isArray(output?.system) ? output.system : [];

      if (!options.enabled) {
        return;
      }
      state.runtimeReady = true;

      let prompt = extractPrompt(input);
      const sessionID = sessionIdFrom(input);
      if (!prompt && sessionID !== '__global__') {
        try {
          const result = await ctx?.client?.session?.messages?.({
            path: { id: sessionID },
            query: { directory: projectDir, limit: 20 },
          });
          const messages = Array.isArray(result?.data)
            ? result.data
            : (Array.isArray(result) ? result : []);

          for (const entry of [...messages].reverse()) {
            const info = entry?.info ?? entry?.message ?? entry;
            if (info?.role !== 'user') {
              continue;
            }

            const parts = Array.isArray(entry?.parts)
              ? entry.parts
              : (Array.isArray(info?.parts) ? info.parts : []);
            const textPart = [...parts]
              .reverse()
              .find((part) => part?.type === 'text' && typeof part.text === 'string' && part.text.trim());
            if (textPart) {
              prompt = textPart.text;
              break;
            }

            prompt = extractPrompt(info);
            if (prompt) {
              break;
            }
          }
        } catch {
          prompt = null;
        }
      }

      if (!prompt) {
        state.lastBridgeStatus = 'skipped';
        state.lastErrorCode = 'MISSING_PROMPT';
        output.system.push(FALLBACK_DIRECTIVE);
        return;
      }

      const response = await getAdvisorContext({
        projectDir,
        prompt,
        sessionID,
        options,
      });
      output.system.push(response.brief
        ? clampBrief(response.brief, options.maxBriefChars)
        : FALLBACK_DIRECTIVE);
    } catch {
      state.lastBridgeStatus = 'fail_open';
      state.lastErrorCode = 'UNEXPECTED_HOOK_ERROR';
      try {
        if (options.enabled && Array.isArray(output.system) && !output.system.includes(FALLBACK_DIRECTIVE)) {
          output.system.push(FALLBACK_DIRECTIVE);
        }
      } catch {
        // A hostile output container must not turn advisor failure into prompt failure.
      }
    }
  }

  return {
    event: async ({ event }) => {
      const eventPayload = eventPayloadFrom(event);
      const eventType = eventTypeFrom(event);

      if (eventType === 'session.created') {
        if (options.enabled) {
          state.runtimeReady = true;
          state.lastBridgeStatus = 'ready';
        }
        return;
      }

      if (eventType === 'session.deleted') {
        const sessionID = normalizeSessionID(eventPayload?.properties?.sessionID
          || eventPayload?.properties?.info?.sessionID
          || eventPayload?.properties?.info?.id
          || sessionIdFrom(eventPayload));
        state.epoch += 1;
        for (const key of [...state.advisorCache.keys()]) {
          if (key.startsWith(`${sessionID}::`)) {
            state.advisorCache.delete(key);
          }
        }
        for (const key of [...state.inFlight.keys()]) {
          if (key.startsWith(`${sessionID}::`)) {
            state.inFlight.delete(key);
          }
        }
        return;
      }

      if (eventType === 'server.instance.disposed' || eventType === 'global.disposed') {
        resetRuntimeState();
      }
    },

    'experimental.chat.system.transform': appendAdvisorBrief,

    tool: {
      spec_kit_skill_advisor_status: tool({
        description: 'Show Spec Kit skill advisor plugin prompt-safe cache status',
        args: {},
        async execute() {
          return [
            `plugin_id=${PLUGIN_ID}`,
            `enabled=${options.enabled}`,
            `disabled_reason=${state.disabledReason ?? 'none'}`,
            `config_status=${state.configStatus}`,
            `config_error_code=${state.configErrorCode ?? 'none'}`,
            `cache_ttl_ms=${options.cacheTTLMs}`,
            `threshold_confidence=${options.thresholdConfidence}`,
            `max_tokens=${options.maxTokens}`,
            `max_prompt_bytes=${options.maxPromptBytes}`,
            `max_brief_chars=${options.maxBriefChars}`,
            `max_cache_entries=${options.maxCacheEntries}`,
            `runtime_ready=${state.runtimeReady}`,
            `node_binary=${statusSafeBinary(options.nodeBinary)}`,
            `bridge_timeout_ms=${options.bridgeTimeoutMs}`,
            `bridge_path=${statusSafePath('skill-advisor-bridge')}`,
            `last_bridge_status=${state.lastBridgeStatus}`,
            `last_runtime_status=${state.lastBridgeStatus}`,
            `last_error_code=${state.lastErrorCode ?? 'none'}`,
            `last_runtime_error=${state.lastErrorCode ?? 'none'}`,
            `last_duration_ms=${state.lastDurationMs}`,
            `bridge_invocations=${state.bridgeInvocations}`,
            `advisor_lookups=${state.advisorLookups}`,
            `cache_entries=${state.advisorCache.size}`,
            `cache_hits=${state.cacheHits}`,
            `cache_misses=${state.cacheMisses}`,
            `cache_hit_rate=${cacheHitRate()}`,
          ].join('\n');
        },
      }),
    },
  };
}
