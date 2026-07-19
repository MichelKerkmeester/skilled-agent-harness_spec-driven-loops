// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ mk-code-graph OpenCode Plugin                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
// Thin OpenCode plugin hook layer.
// Important runtime boundary: never import the MCP server bundle directly
// inside the OpenCode host process because its native modules (better-sqlite3,
// sqlite-vec) may be compiled for a different Node ABI than the host runtime.
// Instead, call a plain `node` bridge process that loads the server bundle in
// the user's normal Node environment and returns the transport plan as JSON.

// ─────────────────────────────────────────────────────────────────────────────
// 2. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin/tool';
import {
  createSyntheticTextPart,
  hasUnsafeMessageTransformParts,
  hasSyntheticTextPartMarker,
  isMessageAnchorLike,
} from '../skills/system-spec-kit/mcp-server/plugin-bridges/spec-kit-opencode-message-schema.mjs';
import {
  parseTransportPlan,
  diagnoseTransportPlanFailure,
} from '../skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-transport.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONSTANTS AND TYPES
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ID = 'mk-code-graph';
const DEFAULT_CACHE_TTL_MS = 5000;
const DEFAULT_BRIDGE_TIMEOUT_MS = 15000;
const DEFAULT_NODE_BINARY = 'node';
const RESUME_MODE = 'minimal';
const MESSAGES_TRANSFORM_ENABLED = true;
const MESSAGES_TRANSFORM_MODE = 'schema_aligned';
const SYNTHETIC_METADATA_KEY = 'mkCodeGraph';
const BRIDGE_PATH = fileURLToPath(new URL('../skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-bridge.mjs', import.meta.url));
let lastConfigError = null;

async function loadConfig() {
  const path = join(homedir(), '.config', 'opencode', 'plugin', 'mk-code-graph.json');
  try {
    const raw = await readFile(path, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      lastConfigError = stringifyError(error);
      emitRuntimeDiagnostic(`Configuration load failed: ${lastConfigError}`);
    }
    return {};
  }
}

const configPromise = loadConfig();

/**
 * @typedef {{
 *   cacheTtlMs?: number,
 *   specFolder?: string,
 *   nodeBinary?: string,
 *   bridgeTimeoutMs?: number,
 * }} PluginOptions
 */

/**
 * @typedef {{
 *   hook: string,
 *   title: string,
 *   payloadKind: string,
 *   dedupeKey: string,
 *   content: string,
 * }} TransportBlock
 */

/**
 * @typedef {{
 *   interfaceVersion: string,
 *   transportOnly: true,
 *   retrievalPolicyOwner: string,
 *   event: {
 *     hook: string,
 *     trackedPayloadKinds: string[],
 *     summary: string,
 *   },
 *   systemTransform?: TransportBlock,
 *   messagesTransform: TransportBlock[],
 *   compaction?: TransportBlock,
 * }} TransportPlan
 */

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODULE STATE
// ─────────────────────────────────────────────────────────────────────────────

const transportCache = new Map();
const transportInFlight = new Map();
let runtimeReady = false;
let lastRuntimeError = null;

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function normalizePositiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
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

function normalizeOptions(rawOptions) {
  const envCacheTTLMs = Number(process.env.MK_CODE_GRAPH_CACHE_TTL_MS);
  const envNodeBinary = process.env.MK_CODE_GRAPH_NODE_BINARY;
  const envBridgeTimeoutMs = Number(process.env.MK_CODE_GRAPH_BRIDGE_TIMEOUT_MS);

  if (!rawOptions || typeof rawOptions !== 'object') {
    return {
      cacheTtlMs: normalizePositiveInt(envCacheTTLMs, DEFAULT_CACHE_TTL_MS),
      specFolder: process.env.MK_CODE_GRAPH_SPEC_FOLDER || undefined,
      nodeBinary: envNodeBinary || process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY,
      bridgeTimeoutMs: normalizePositiveInt(envBridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS),
    };
  }

  const options = /** @type {PluginOptions} */ (rawOptions);
  return {
    cacheTtlMs: normalizePositiveInt(options.cacheTtlMs, normalizePositiveInt(envCacheTTLMs, DEFAULT_CACHE_TTL_MS)),
    specFolder: typeof options.specFolder === 'string' && options.specFolder.trim()
      ? options.specFolder.trim()
      : (process.env.MK_CODE_GRAPH_SPEC_FOLDER || undefined),
    nodeBinary: typeof options.nodeBinary === 'string' && options.nodeBinary.trim()
      ? options.nodeBinary.trim()
      : (envNodeBinary || process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY),
    bridgeTimeoutMs: normalizePositiveInt(options.bridgeTimeoutMs, normalizePositiveInt(envBridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS)),
  };
}

function cacheKeyForSession(sessionID, specFolder) {
  return `${specFolder ?? '__workspace__'}::${normalizeSessionID(sessionID)}`;
}

// Raw stderr writes while the opencode TUI is active render into the user's
// input field, so a bridge-skip diagnostic must stay silent by default. The
// failure is non-fatal (injection no-ops) and remains inspectable as
// last_runtime_error via the plugin's status tool.
function emitRuntimeDiagnostic(message) {
  if (!process.env.MK_CODE_GRAPH_DEBUG) {
    return;
  }
  process.stderr.write(`[${PLUGIN_ID}] ${message}\n`);
}

function stringifyError(error) {
  if (!error) {
    return 'Unknown bridge error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function execFilePromise(file, args, options) {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        stdout: typeof stdout === 'string' ? stdout : '',
        stderr: typeof stderr === 'string' ? stderr : '',
      });
    });
  });
}

async function runTransportBridge({ projectDir, nodeBinary, bridgeTimeoutMs }) {
  const args = [BRIDGE_PATH, '--minimal', '--timeout-ms', String(bridgeTimeoutMs)];

  const result = await execFilePromise(nodeBinary, args, {
    cwd: projectDir,
    env: process.env,
    timeout: bridgeTimeoutMs,
    maxBuffer: 1024 * 1024,
  });
  const stdout = result.stdout.trim();
  const plan = parseTransportPlan(stdout);
  return {
    plan,
    diagnostic: plan ? null : diagnoseTransportPlanFailure(stdout),
  };
}

async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
  const key = cacheKeyForSession(sessionID, specFolder);
  const now = Date.now();
  const cached = transportCache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.plan;
  }

  const existing = transportInFlight.get(key);
  if (existing) {
    return existing;
  }

  const pending = (async () => {
    try {
      const bridgeResult = await runTransportBridge({
        projectDir,
        specFolder,
        nodeBinary,
        bridgeTimeoutMs,
      });
      const plan = bridgeResult.plan;

      if (!plan) {
        lastRuntimeError = bridgeResult.diagnostic || 'Bridge returned no OpenCode transport payload';
        emitRuntimeDiagnostic(lastRuntimeError);
        runtimeReady = false;
        transportCache.delete(key);
        return null;
      }

      const completedAt = Date.now();
      runtimeReady = true;
      lastRuntimeError = null;
      transportCache.set(key, {
        plan,
        expiresAt: completedAt + cacheTtlMs,
        updatedAt: new Date(completedAt).toISOString(),
      });
      return plan;
    } catch (error) {
      runtimeReady = false;
      lastRuntimeError = stringifyError(error);
      transportCache.delete(key);
      return null;
    }
  })();
  transportInFlight.set(key, pending);

  try {
    return await pending;
  } finally {
    if (transportInFlight.get(key) === pending) {
      transportInFlight.delete(key);
    }
  }
}

function extractEventSessionID(event) {
  if (!event || typeof event !== 'object') {
    return null;
  }

  if (typeof event.sessionID === 'string') {
    return event.sessionID;
  }
  if (event.sessionID && typeof event.sessionID === 'object') {
    return normalizeSessionID(event.sessionID);
  }

  if (event.properties && typeof event.properties === 'object') {
    if (typeof event.properties.sessionID === 'string') {
      return event.properties.sessionID;
    }
    if (event.properties.sessionID && typeof event.properties.sessionID === 'object') {
      return normalizeSessionID(event.properties.sessionID);
    }
    if (event.properties.info && typeof event.properties.info === 'object') {
      if (typeof event.properties.info.sessionID === 'string') {
        return event.properties.info.sessionID;
      }
      if (event.properties.info.sessionID && typeof event.properties.info.sessionID === 'object') {
        return normalizeSessionID(event.properties.info.sessionID);
      }
      if (typeof event.properties.info.id === 'string') {
        return event.properties.info.id;
      }
    }
    if (event.properties.part && typeof event.properties.part === 'object' && typeof event.properties.part.sessionID === 'string') {
      return event.properties.part.sessionID;
    }
    if (event.properties.part && typeof event.properties.part === 'object' && event.properties.part.sessionID && typeof event.properties.part.sessionID === 'object') {
      return normalizeSessionID(event.properties.part.sessionID);
    }
  }

  return null;
}

function shouldInvalidateEvent(eventType) {
  return eventType === 'session.created' || eventType === 'session.deleted';
}

function invalidateTransportCache(sessionID, specFolder) {
  if (sessionID) {
    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
    return;
  }

  for (const key of [...transportCache.keys()]) {
    if (key.startsWith(`${specFolder ?? '__workspace__'}::`)) {
      transportCache.delete(key);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLUGIN ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @param {PluginOptions | undefined} rawOptions - Optional plugin overrides.
 * @returns {Promise<object>} Hook and tool registrations consumed by OpenCode.
 */
export default async function mkCodeGraphPlugin(ctx, rawOptions) {
  const fileConfig = await configPromise;
  const merged = { ...fileConfig, ...rawOptions };
  const options = normalizeOptions(merged);
  const projectDir = ctx?.directory || process.cwd();

  return {
    event: async ({ event }) => {
      if (!shouldInvalidateEvent(event?.type)) {
        return;
      }
      const sessionID = extractEventSessionID(event);
      if (sessionID) {
        invalidateTransportCache(sessionID, options.specFolder);
      }
    },

    tool: {
      mk_code_graph_status: tool({
        description: 'Show mk-code-graph plugin cache status',
        args: {},
        async execute() {
          const entries = [...transportCache.entries()]
            .map(([key, value]) => `${key} expires=${new Date(value.expiresAt).toISOString()}`)
            .join('\n');

          return [
            `plugin_id=${PLUGIN_ID}`,
            `cache_ttl_ms=${options.cacheTtlMs}`,
            `spec_folder=${options.specFolder ?? 'auto'}`,
            `resume_mode=${RESUME_MODE}`,
            `messages_transform_enabled=${MESSAGES_TRANSFORM_ENABLED}`,
            `messages_transform_mode=${MESSAGES_TRANSFORM_MODE}`,
            `runtime_ready=${runtimeReady}`,
            `node_binary=${options.nodeBinary}`,
            `bridge_timeout_ms=${options.bridgeTimeoutMs}`,
            `bridge_path=${BRIDGE_PATH}`,
            `config_error=${lastConfigError ?? 'none'}`,
            `last_runtime_error=${lastRuntimeError ?? 'none'}`,
            `cache_entries=${transportCache.size}`,
            entries || 'cache=empty',
          ].join('\n');
        },
      }),
    },

    'experimental.chat.system.transform': async (input, output = { system: [] }) => {
      if (!output || typeof output !== 'object') {
        return;
      }
      output.system = Array.isArray(output.system) ? output.system : [];

      const plan = await loadTransportPlan({
        projectDir,
        sessionID: input.sessionID,
        specFolder: options.specFolder,
        cacheTtlMs: options.cacheTtlMs,
        nodeBinary: options.nodeBinary,
        bridgeTimeoutMs: options.bridgeTimeoutMs,
      });

      const block = plan?.systemTransform;
      if (!block) {
        return;
      }

      const rendered = `${block.title}\n${block.content}`;
      if (output.system.some((entry) => typeof entry === 'string' && entry.includes(rendered))) {
        return;
      }

      output.system.push(rendered);
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      if (!MESSAGES_TRANSFORM_ENABLED) {
        return;
      }
      if (!output || typeof output !== 'object' || !Array.isArray(output.messages)) {
        return;
      }

      const anchor = output.messages.at(-1);
      if (!isMessageAnchorLike(anchor)) {
        return;
      }

      if (hasUnsafeMessageTransformParts(anchor.parts)) {
        return;
      }

      const plan = await loadTransportPlan({
        projectDir,
        sessionID: anchor.info.sessionID,
        specFolder: options.specFolder,
        cacheTtlMs: options.cacheTtlMs,
        nodeBinary: options.nodeBinary,
        bridgeTimeoutMs: options.bridgeTimeoutMs,
      });

      if (!plan || plan.messagesTransform.length === 0) {
        return;
      }

      for (const block of plan.messagesTransform) {
        if (hasSyntheticTextPartMarker(anchor.parts, SYNTHETIC_METADATA_KEY, block.dedupeKey)) {
          continue;
        }

        const part = createSyntheticTextPart({
          id: `${PLUGIN_ID}-${randomUUID().replace(/-/g, '').slice(0, 12)}`,
          sessionID: anchor.info.sessionID,
          messageID: anchor.info.id,
          text: `${block.title}\n${block.content}`,
          metadata: {
            [SYNTHETIC_METADATA_KEY]: block.dedupeKey,
          },
        });

        if (!part) {
          continue;
        }

        anchor.parts.push(part);
      }
    },

    'experimental.session.compacting': async (input, output = { context: [] }) => {
      if (!output || typeof output !== 'object') {
        return;
      }
      output.context = Array.isArray(output.context) ? output.context : [];

      const plan = await loadTransportPlan({
        projectDir,
        sessionID: input.sessionID,
        specFolder: options.specFolder,
        cacheTtlMs: options.cacheTtlMs,
        nodeBinary: options.nodeBinary,
        bridgeTimeoutMs: options.bridgeTimeoutMs,
      });

      const block = plan?.compaction;
      if (!block) {
        return;
      }

      const rendered = `${block.title}\n${block.content}`;
      if (output.context.some((entry) => typeof entry === 'string' && entry.includes(rendered))) {
        return;
      }

      output.context.push(rendered);
    },
  };
}
