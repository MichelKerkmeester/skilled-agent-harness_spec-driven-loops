#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Skill Advisor Plugin Bridge (mk-skill-advisor, MJS source)   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Subprocess bridge between `.opencode/plugins/mk-skill-         ║
// ║          advisor.js` and the standalone mk_skill_advisor MCP       ║
// ║          server. The plugin                                           ║
// ║          spawns this script with stdin JSON; this script writes a      ║
// ║          single stdout JSON response and exits.                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// This file is the SOURCE-OF-TRUTH bridge. It lives outside the
// TypeScript build tree on purpose:
//   1. The OpenCode plugin host imports `.opencode/plugins/*.js` only — having
//      the bridge as a sibling .mjs keeps the plugin entrypoint count to 1
//      while letting the bridge use ESM and dynamic imports without TS
//      compile coordination on every plugin reload.
//   2. The bridge is a thin subprocess wrapper (parse stdin → call native
//      compat handlers → emit stdout JSON) and benefits from being editable
//      as plain JS for live diagnosis when the OpenCode plugin host misroutes.
//   3. Migrating to TS would require either (a) building this file into the
//      same dist tree the plugin watches, creating a chicken-and-egg with
//      cache-signature freshness, or (b) maintaining a
//      .ts → .mjs build step exclusive to this single file. Either path is
//      a larger packet than the source/dist boundary fixes here.
//
// Smoke tests asserting the subprocess envelope live in the standalone
// system-skill-advisor compatibility test suite.
// This file intentionally lives outside
// `.opencode/plugins/` so OpenCode discovers only real plugin entrypoints.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const COMPAT_CONTRACT = JSON.parse(readFileSync(new URL('../../../system-skill-advisor/mcp_server/schemas/compat-contract.json', import.meta.url), 'utf8'));
const STATUS_VALUES = new Set(COMPAT_CONTRACT.statusValues);
const DISABLED_ENV = COMPAT_CONTRACT.disabledEnv;
const FORCE_LOCAL_ENV = COMPAT_CONTRACT.forceLocalEnv;
const DEFAULT_CONFIDENCE_THRESHOLD = COMPAT_CONTRACT.defaults.confidenceThreshold;
const DEFAULT_UNCERTAINTY_THRESHOLD = COMPAT_CONTRACT.defaults.uncertaintyThreshold;
const ADVISOR_LAUNCHER_PATH = fileURLToPath(new URL('../../../../bin/mk-skill-advisor-launcher.cjs', import.meta.url));
const ADVISOR_MCP_TIMEOUT_MS = 8000;
const CHILD_ENV_ALLOWLIST = new Set([
  'PATH',
  'HOME',
  'USER',
  'LOGNAME',
  'SHELL',
  'TMPDIR',
  'TEMP',
  'TMP',
  'LANG',
  'LC_ALL',
  'CI',
  'VITEST',
  'MK_SKILL_ADVISOR_DB_DIR',
  'SYSTEM_SKILL_ADVISOR_DB_DIR',
  'SPECKIT_RUNTIME',
  'SPECKIT_ADVISOR_FRESHNESS',
  'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
  'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL',
  'SPECKIT_CODEX_HOOK_TIMEOUT_MS',
  'SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC',
  'SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST',
  'SPECKIT_ADVISOR_SHADOW_DELTA_PATH',
  'SPECKIT_METRICS_ENABLED',
  'SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS',
]);

function response(args) {
  return {
    brief: typeof args.brief === 'string' ? args.brief : null,
    status: STATUS_VALUES.has(args.status) ? args.status : 'fail_open',
    metadata: args.metadata && typeof args.metadata === 'object' ? args.metadata : {},
    ...(args.error ? { error: args.error } : {}),
  };
}

function failOpen(error) {
  return response({
    brief: null,
    status: 'fail_open',
    error,
    metadata: {},
  });
}

function errorCode(error) {
  const raw = error?.code ?? error?.name ?? 'UNKNOWN';
  const normalized = String(raw).toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  return normalized || 'UNKNOWN';
}

async function readStdin() {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

async function withStdoutSilenced(fn) {
  const forwarded = (...args) => {
    const rendered = args
      .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
      .join(' ');
    process.stderr.write(`${rendered}\n`);
  };

  const original = {
    log: console.log,
    info: console.info,
    debug: console.debug,
    warn: console.warn,
  };

  console.log = forwarded;
  console.info = forwarded;
  console.debug = forwarded;
  console.warn = forwarded;

  try {
    return await fn();
  } finally {
    console.log = original.log;
    console.info = original.info;
    console.debug = original.debug;
    console.warn = original.warn;
  }
}

function parseInput(text) {
  if (!text.trim()) {
    throw Object.assign(new Error('Missing bridge input'), { code: 'MISSING_INPUT' });
  }
  const parsed = JSON.parse(text);
  if (typeof parsed?.prompt !== 'string') {
    throw Object.assign(new Error('Missing prompt'), { code: 'MISSING_PROMPT' });
  }
  if (typeof parsed?.workspaceRoot !== 'string' || !parsed.workspaceRoot.trim()) {
    throw Object.assign(new Error('Missing workspace root'), { code: 'MISSING_WORKSPACE_ROOT' });
  }
  return parsed;
}

function positiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function threshold(value) {
  if (!Number.isFinite(value)) {
    return DEFAULT_CONFIDENCE_THRESHOLD;
  }
  return Math.min(1, Math.max(0, Number(value)));
}

function formatScore(value) {
  return Number.isFinite(value) ? Number(value).toFixed(2) : '0.00';
}

function sanitizeLabel(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleaned || cleaned.length > 160 || /\b(ignore|override|forget|bypass|disable|execute|run|call|tool|developer|assistant|previous instructions|all instructions)\b/i.test(cleaned) || /<!--|-->|```|<script\b|<\/script>|^\s*(system|instruction|developer|assistant)\s*:/i.test(cleaned)) {
    return null;
  }
  return cleaned;
}

function createChildEnv(sourceEnv = process.env) {
  return Object.fromEntries(
    Object.entries(sourceEnv).filter((entry) => CHILD_ENV_ALLOWLIST.has(entry[0]) && typeof entry[1] === 'string'),
  );
}

function withTimeout(operation, timeoutMs, label) {
  let timeout;
  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      reject(Object.assign(new Error(`${label} timed out after ${timeoutMs}ms`), { code: 'ADVISOR_MCP_TIMEOUT' }));
    }, timeoutMs);
    timeout.unref?.();
    operation.then(
      (value) => {
        if (timeout) clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        if (timeout) clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

const HYGIENE_DIRECTIVE = '\nComment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';

function renderAdvisorBrief(result, options = {}) {
  if (result.status !== 'ok') return null;
  if (result.freshness !== 'live' && result.freshness !== 'stale') return null;

  const tokenCap = Math.min(Math.max(1, positiveInt(result.metrics?.tokenCap ?? options.tokenCap, 80)), 120);
  const thresholdConfig = options.thresholdConfig ?? {};
  const recommendations = Array.isArray(result.recommendations)
    ? result.recommendations.filter((recommendation) => (
      recommendation.passes_threshold === true
      || (
        recommendation.confidence >= (thresholdConfig.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD)
        && (
          thresholdConfig.confidenceOnly === true
          || recommendation.uncertainty <= (thresholdConfig.uncertaintyThreshold ?? DEFAULT_UNCERTAINTY_THRESHOLD)
        )
      )
    ))
    : [];
  const top = recommendations[0];
  if (!top) return null;

  const topLabel = sanitizeLabel(result.sharedPayload?.metadata?.skillLabel ?? top.skill);
  if (!topLabel) return null;
  const text = `Advisor: ${result.freshness}; use ${topLabel} ${formatScore(top.confidence)}/${formatScore(top.uncertainty)} pass.`;
  const charCap = Math.min(tokenCap, 80) * 4;
  const brief = text.length <= charCap ? text : `${text.slice(0, Math.max(1, charCap - 3)).trimEnd()}...`;
  return brief + HYGIENE_DIRECTIVE;
}

async function callAdvisorTool(name, args, workspaceRoot) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [ADVISOR_LAUNCHER_PATH],
    cwd: workspaceRoot,
      env: createChildEnv(),
    stderr: 'pipe',
  });
  transport.stderr?.on('data', () => {});
  const client = new Client({ name: 'mk-skill-advisor-bridge', version: '0.1.0' });
  try {
    await withTimeout(client.connect(transport), ADVISOR_MCP_TIMEOUT_MS, 'mk_skill_advisor initialize');
    return await withTimeout(
      client.callTool({ name, arguments: args }),
      ADVISOR_MCP_TIMEOUT_MS,
      `mk_skill_advisor.${name}`,
    );
  } finally {
    try {
      await client.close();
    } catch {
      // Best-effort process cleanup; bridge callers still get fail-open output.
    }
  }
}

function parseAdvisorToolData(toolResponse) {
  const first = Array.isArray(toolResponse?.content) ? toolResponse.content[0] : null;
  if (typeof first?.text !== 'string') {
    throw Object.assign(new Error('Advisor MCP response missing text content'), { code: 'ADVISOR_MCP_BAD_RESPONSE' });
  }
  const parsed = JSON.parse(first.text);
  return parsed?.data ?? parsed;
}

// The dead `renderNativeBrief()` alternate renderer was removed
// here. It was unreferenced (verified via grep across mcp_server) and could
// drift from the shared `renderAdvisorBrief()` formatter. Bridge output now
// flows exclusively through `renderAdvisorBrief()` loaded via
// `loadNativeAdvisorModules()`. Helpers `formatScore` and `sanitizeLabel`
// stay because they are still used by `buildNativeBrief` and `buildLegacyBrief`.

async function loadNativeAdvisorModules() {
  // Primary native path: import the compiled compat module in-process. This is the
  // canonical native surface (status handler, recommend handler, daemon probe, brief)
  // and its return shapes already match this bridge's consumers — readAdvisorStatus
  // returns the status DATA object (probeNativeAdvisor reads .freshness/.generation),
  // handleAdvisorRecommend returns the MCP `{content:[{text}]}` envelope
  // (buildNativeBrief parses content[0].text), and probeAdvisorDaemon returns the
  // probe result directly. Importing compat avoids the launcher/MCP stdio handshake,
  // which fails open to the python route when a stale launcher lease has no IPC socket
  // (LEASE_HELD_BY... no-bridge-socket). The launcher subprocess remains a fallback for
  // callers without a colocated dist build.
  try {
    const compat = await import(new URL('../dist/mcp_server/compat/index.js', import.meta.url));
    if (
      typeof compat.readAdvisorStatus === 'function'
      && typeof compat.handleAdvisorRecommend === 'function'
    ) {
      return {
        readAdvisorStatus: (args) => compat.readAdvisorStatus(args),
        handleAdvisorRecommend: (args) => compat.handleAdvisorRecommend(args),
        probeAdvisorDaemon: typeof compat.probeAdvisorDaemon === 'function'
          ? (args) => compat.probeAdvisorDaemon(args)
          : null,
        buildSkillAdvisorBrief: typeof compat.buildSkillAdvisorBrief === 'function'
          ? compat.buildSkillAdvisorBrief
          : null,
        renderAdvisorBrief,
      };
    }
  } catch {
    // Compat import unavailable (e.g. dist not built for a non-colocated caller).
    // Fall through to the launcher/MCP-subprocess fallback below.
  }
  return {
    readAdvisorStatus: async (args) => parseAdvisorToolData(await callAdvisorTool('advisor_status', args, args.workspaceRoot)),
    handleAdvisorRecommend: (args) => callAdvisorTool('advisor_recommend', args, args.workspaceRoot),
    probeAdvisorDaemon: null,
    buildSkillAdvisorBrief: null,
    renderAdvisorBrief,
  };
}

async function probeNativeAdvisor(input, dependencies = {}) {
  const env = dependencies.env ?? process.env;
  if (env[DISABLED_ENV] === '1') {
    return {
      available: false,
      freshness: 'unavailable',
      generation: 0,
      reason: 'ADVISOR_DISABLED',
    };
  }
  if (env[FORCE_LOCAL_ENV] === '1' || input.forceLocal === true) {
    return {
      available: false,
      freshness: 'unavailable',
      generation: 0,
      reason: 'FORCE_LOCAL',
    };
  }

  const modules = await (dependencies.loadNativeAdvisorModules ?? loadNativeAdvisorModules)();
  let probe;
  if (typeof modules.probeAdvisorDaemon === 'function') {
    probe = await modules.probeAdvisorDaemon({ workspaceRoot: input.workspaceRoot });
  } else {
    const status = await modules.readAdvisorStatus({ workspaceRoot: input.workspaceRoot });
    probe = {
      available: status.freshness === 'live' || status.freshness === 'stale',
      freshness: status.freshness,
      generation: status.generation,
      trustState: status.trustState,
      reason: status.errors?.[0] ?? status.trustState?.reason ?? null,
    };
  }
  // The skill graph is serveable whenever trustState is reader-usable
  // (live/stale). Recommendations run in-process off the graph DB; the daemon only
  // drives auto-reindex. So when the daemon/artifact freshness axis reports
  // 'unavailable' but trustState is live/stale, serve native in a degraded mode
  // instead of failing open to python (which yields no brief). createTrustState still
  // downgrades to 'unavailable'/'absent'/'stale' for a missing, corrupt, or
  // source-newer graph, so this never serves an untrustworthy graph.
  const trustStateValue = probe?.trustState?.state;
  const trustUsable = trustStateValue === 'live' || trustStateValue === 'stale';
  if (probe && !probe.available && trustUsable) {
    return { ...probe, available: true, degraded: true, daemonAvailable: false };
  }
  return probe;
}

async function buildNativeBrief(input, dependencies = {}) {
  const modules = await (dependencies.loadNativeAdvisorModules ?? loadNativeAdvisorModules)();
  const effectiveThresholds = {
    confidenceThreshold: threshold(input.thresholdConfidence),
    uncertaintyThreshold: DEFAULT_UNCERTAINTY_THRESHOLD,
    confidenceOnly: false,
  };
  const handlerResponse = await modules.handleAdvisorRecommend({
    workspaceRoot: input.workspaceRoot,
    prompt: input.prompt,
    options: {
      topK: 3,
      includeAbstainReasons: true,
      confidenceThreshold: effectiveThresholds.confidenceThreshold,
      uncertaintyThreshold: effectiveThresholds.uncertaintyThreshold,
    },
  });
  const parsed = JSON.parse(handlerResponse.content[0].text);
  const data = parsed.data;
  const maxTokens = positiveInt(input.maxTokens, 80);
  const top = Array.isArray(data?.recommendations) ? data.recommendations[0] : null;
  const skillLabel = sanitizeLabel(top?.skillId);
  const safeStatus = sanitizeLabel(top?.status);
  const redirectTo = sanitizeLabel(top?.redirectTo);
  const redirectFrom = Array.isArray(top?.redirectFrom)
    ? top.redirectFrom.map(sanitizeLabel).filter(Boolean)
    : [];
  const recommendations = Array.isArray(data?.recommendations)
    ? data.recommendations.map((recommendation) => ({
      skill: recommendation.skillId,
      kind: 'skill',
      confidence: recommendation.confidence,
      uncertainty: recommendation.uncertainty,
      passes_threshold: recommendation.confidence >= effectiveThresholds.confidenceThreshold
        && recommendation.uncertainty <= effectiveThresholds.uncertaintyThreshold,
      reason: null,
    }))
    : [];
  const rendered = modules.renderAdvisorBrief({
    status: recommendations.length > 0 ? 'ok' : 'skipped',
    freshness: data?.freshness ?? 'unavailable',
    brief: null,
    recommendations,
    diagnostics: null,
    metrics: {
      durationMs: 0,
      cacheHit: Boolean(data?.cache?.hit),
      subprocessInvoked: false,
      retriesAttempted: 0,
      recommendationCount: recommendations.length,
      tokenCap: maxTokens,
    },
    generatedAt: new Date().toISOString(),
    sharedPayload: {
      metadata: {
        skillLabel,
      },
    },
  }, {
    tokenCap: maxTokens,
    thresholdConfig: effectiveThresholds,
  });

  return response({
    brief: rendered,
    status: rendered ? 'ok' : 'skipped',
    metadata: {
      route: 'native',
      workspaceRoot: input.workspaceRoot,
      effectiveThresholds,
      freshness: data?.freshness ?? 'unavailable',
      generation: input.probe?.generation ?? 0,
      cacheHit: Boolean(data?.cache?.hit),
      recommendationCount: Array.isArray(data?.recommendations) ? data.recommendations.length : 0,
      tokenCap: maxTokens,
      skillLabel,
      status: safeStatus,
      redirectTo,
      redirectFrom,
    },
  });
}

async function buildLegacyBrief(input) {
  const maxTokens = positiveInt(input.maxTokens, 80);
  const effectiveThresholds = {
    confidenceThreshold: threshold(input.thresholdConfidence),
    uncertaintyThreshold: DEFAULT_UNCERTAINTY_THRESHOLD,
    confidenceOnly: false,
  };

  return response({
    brief: null,
    status: 'fail_open',
    error: 'SYSTEM_SKILL_ADVISOR_UNAVAILABLE',
    metadata: {
      route: 'python',
      workspaceRoot: input.workspaceRoot,
      effectiveThresholds,
      freshness: 'unavailable',
      recommendationCount: 0,
      tokenCap: maxTokens,
    },
  });
}

async function buildBrief(input, dependencies = {}) {
  const env = dependencies.env ?? process.env;
  if (env[DISABLED_ENV] === '1') {
    // Silent fail-open in disabled mode. Previously this branch
    // returned a model-visible `Advisor: disabled by ...` brief, but every
    // other runtime (Codex, Claude, Copilot) fails open silently when
    // the disabled flag is set. Aligning OpenCode with the dominant pattern
    // removes the runtime-specific surface inconsistency. Callers can still
    // detect the disabled state via `metadata.route === 'disabled'`.
    return response({
      brief: null,
      status: 'skipped',
      metadata: {
        route: 'disabled',
        freshness: 'unavailable',
        recommendationCount: 0,
      },
    });
  }

  try {
    const probe = await probeNativeAdvisor(input, dependencies);
    if (probe.available) {
      return await buildNativeBrief({ ...input, probe }, dependencies);
    }
    if (input.forceNative === true) {
      return failOpen(probe.reason || 'NATIVE_UNAVAILABLE');
    }
  } catch {
    if (input.forceNative === true) {
      return failOpen('NATIVE_PROBE_FAILED');
    }
  }

  return buildLegacyBrief(input);
}

async function main() {
  const payload = await withStdoutSilenced(async () => {
    try {
      const input = parseInput(await readStdin());
      return await buildBrief(input);
    } catch (error) {
      return failOpen(errorCode(error));
    }
  });

  process.stdout.write(JSON.stringify(payload));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stdout.write(JSON.stringify(failOpen(errorCode(error))));
  });
}

export {
  buildBrief,
  buildLegacyBrief,
  buildNativeBrief,
  createChildEnv,
  parseInput,
  renderAdvisorBrief,
  response,
};
