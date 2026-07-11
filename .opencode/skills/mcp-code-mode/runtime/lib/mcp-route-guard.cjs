// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mcp-route-guard core (runtime-neutral policy)                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Decide whether a native external MCP tool call should carry a   ║
// ║          just-in-time advisory nudging the agent toward Code Mode's      ║
// ║          call_tool_chain. Parses the tool name for either runtime's      ║
// ║          shape, normalizes the server token so manifest and connector    ║
// ║          spellings collide onto one family id, exempts internal         ║
// ║          servers, and consults an mtime-cached manifest family set.      ║
// ║          The only two decisions this module can ever return are         ║
// ║          'allow' and 'warn' -- there is no stronger decision anywhere in ║
// ║          this file. Every adapter (OpenCode plugin, Claude PreToolUse    ║
// ║          hook) owns its own transport, logging, and stdout/stderr; this ║
// ║          core never writes either.                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { readFileSync, statSync } = require('node:fs');
const { join } = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MANIFEST_RELATIVE_PATH = '.utcp_config.json';
const MAX_MANIFEST_BYTES = 1_048_576;
const CLAUDE_MCP_PREFIX = 'mcp__';
const CLAUDE_AI_PREFIX = 'claude_ai_';

// Kill-switch: set to '1' to make the guard a full no-op on every call.
const DISABLED_ENV = 'MK_MCP_ROUTE_GUARD_DISABLED';
// Opt-in, default-off: also advise on external servers the manifest cannot
// route yet, nudging the operator to register a manual for them. Manifest-
// strict (the default) stays silent there so every advisory stays actionable.
const BROAD_MODE_ENV = 'MK_MCP_ROUTE_GUARD_BROAD_MODE';

// Internal MCP servers this repo registers natively (never worth a routing
// nudge -- Code Mode does not, and should not, wrap its own siblings).
const INTERNAL_EXACT_TOKENS = new Set(['code_mode', 'sequential_thinking']);
const INTERNAL_RAW_TOKENS = [
  'code_mode',
  'sequential_thinking',
  'mk_spec_memory',
  'mk_skill_advisor',
  'mk_code_index',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- name normalization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a raw server token so a manifest manual name and its live
 * connector spelling collide onto the same family id, e.g. `clickup_official`
 * and `claude_ai_ClickUp` both resolve to `clickup`.
 *
 * @param {string} rawServer
 * @returns {string} normalized family token, or '' when unresolvable
 */
function normalizeServerToken(rawServer) {
  if (typeof rawServer !== 'string' || rawServer.length === 0) return '';
  let token = rawServer.toLowerCase().replace(/-/g, '_');
  if (token.startsWith(CLAUDE_AI_PREFIX)) token = token.slice(CLAUDE_AI_PREFIX.length);
  token = token.replace(/_official$/, '');
  token = token.replace(/_\d+$/, '');
  return token;
}

function isInternalServerToken(normalized) {
  if (!normalized) return false;
  if (normalized.startsWith('mk_')) return true;
  return INTERNAL_EXACT_TOKENS.has(normalized);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS -- tool-name parsing (both runtime shapes)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse Claude's `mcp__<server>__<tool>` shape. The server segment itself may
 * contain single underscores (`claude_ai_ClickUp`), so the split point is the
 * first literal `__` after the fixed prefix, not the first single underscore.
 *
 * @param {string} toolName
 * @returns {{server: string, tool: string}|null}
 */
function parseClaudeShape(toolName) {
  if (!toolName.startsWith(CLAUDE_MCP_PREFIX)) return null;
  const remainder = toolName.slice(CLAUDE_MCP_PREFIX.length);
  const sepIndex = remainder.indexOf('__');
  if (sepIndex <= 0) return null;
  return { server: remainder.slice(0, sepIndex), tool: remainder.slice(sepIndex + 2) };
}

// OpenCode's bare `<server>_<tool>` shape carries no reserved delimiter, so the
// only reliable split point is a known server token -- the manifest-derived
// family names plus the fixed internal set. Longest-token-first avoids a short
// token (e.g. `mk_code_index`'s `mk_`) swallowing a longer, more specific match.
function candidateServerTokens(families) {
  const tokens = new Set(INTERNAL_RAW_TOKENS);
  for (const rawName of families.values()) {
    tokens.add(String(rawName).toLowerCase().replace(/-/g, '_'));
  }
  return [...tokens].sort((a, b) => b.length - a.length);
}

/**
 * Parse OpenCode's `<server>_<tool>` shape against known server tokens.
 * A tool name that starts with no known token is not classifiable as an MCP
 * call from this shape alone and is left to the caller as unrecognized.
 *
 * @param {string} toolName
 * @param {Map<string,string>} families - normalized family id -> raw manifest name
 * @returns {{server: string, tool: string}|null}
 */
function parseOpenCodeShape(toolName, families) {
  const lower = toolName.toLowerCase().replace(/-/g, '_');
  for (const token of candidateServerTokens(families)) {
    if (lower === token) return { server: token, tool: '' };
    if (lower.startsWith(`${token}_`)) return { server: token, tool: lower.slice(token.length + 1) };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS -- manifest family set (mtime-cached, single JSON.parse)
// ─────────────────────────────────────────────────────────────────────────────

function resolveManifestPath(projectDir) {
  const dir = projectDir || process.cwd();
  return join(dir, MANIFEST_RELATIVE_PATH);
}

function buildFamilyMap(data) {
  const families = new Map();
  const templates = data && Array.isArray(data.manual_call_templates) ? data.manual_call_templates : [];
  for (const template of templates) {
    const rawName = template && typeof template.name === 'string' ? template.name : null;
    if (!rawName) continue;
    const normalized = normalizeServerToken(rawName);
    if (normalized && !families.has(normalized)) families.set(normalized, rawName);
  }
  return families;
}

// Keyed by resolved manifest path so a single process serving more than one
// project directory never cross-contaminates family sets. Recomputed only
// when the file's mtime moves, so a manifest edit expands coverage on the
// very next call with no code change and no per-call re-parse otherwise.
const manifestCache = new Map();

/**
 * Load the manifest-derived family set, cached by file mtime. Any read/parse
 * failure or an oversized file yields an empty set (manifest-strict silence)
 * rather than throwing -- a missing or malformed manifest must never block a
 * call.
 *
 * @param {string} manifestPath
 * @returns {Map<string,string>} normalized family id -> raw manifest manual name
 */
function loadManifestFamilies(manifestPath) {
  let stats;
  try {
    stats = statSync(manifestPath);
  } catch (_) {
    manifestCache.delete(manifestPath);
    return new Map();
  }

  const cached = manifestCache.get(manifestPath);
  if (cached && cached.mtimeMs === stats.mtimeMs) return cached.families;

  if (stats.size > MAX_MANIFEST_BYTES) {
    const families = new Map();
    manifestCache.set(manifestPath, { mtimeMs: stats.mtimeMs, families });
    return families;
  }

  let families;
  try {
    const raw = readFileSync(manifestPath, 'utf8');
    families = buildFamilyMap(JSON.parse(raw));
  } catch (_) {
    families = new Map();
  }

  manifestCache.set(manifestPath, { mtimeMs: stats.mtimeMs, families });
  return families;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HELPERS -- advisory text
// ─────────────────────────────────────────────────────────────────────────────

function routeAdvisory(rawServer, manualName) {
  return `mcp-route-guard: native call to "${rawServer}" -- Code Mode can route this family via the "${manualName}" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the mcp-code-mode SKILL mandates.`;
}

function coverageAdvisory(rawServer, normalizedFamily) {
  return `mcp-route-guard: native call to "${rawServer}" (family "${normalizedFamily}") -- no Code Mode manual registers this family in .utcp_config.json yet; register one to make this call routable.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. POLICY EVALUATION (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate one native MCP tool call and return a transport-free decision.
 * The only two possible decisions are 'allow' and 'warn' -- there is no
 * stronger outcome. Every error path (missing/unreadable/oversized manifest,
 * an unparsable tool name, an unexpected internal error) resolves to 'allow'.
 *
 * @param {{toolName?: string, projectDir?: string, env?: NodeJS.ProcessEnv}} request
 * @returns {{decision: 'allow'|'warn', detail: string|null, warnings: string[], audits: string[]}}
 */
function evaluateNativeMcpCall(request = {}) {
  const { toolName, projectDir } = request;
  const environment = request.env || process.env;
  const warnings = [];
  const audits = [];

  try {
    if (environment[DISABLED_ENV] === '1') {
      return { decision: 'allow', detail: null, warnings, audits };
    }
    if (typeof toolName !== 'string' || toolName.length === 0) {
      return { decision: 'allow', detail: null, warnings, audits };
    }

    const manifestPath = resolveManifestPath(projectDir);
    const families = loadManifestFamilies(manifestPath);

    const parsed = parseClaudeShape(toolName) || parseOpenCodeShape(toolName, families);
    if (!parsed || !parsed.server) {
      return { decision: 'allow', detail: null, warnings, audits };
    }

    const normalized = normalizeServerToken(parsed.server);
    if (!normalized || isInternalServerToken(normalized)) {
      return { decision: 'allow', detail: null, warnings, audits };
    }

    const manualName = families.get(normalized);
    if (manualName) {
      const detail = routeAdvisory(parsed.server, manualName);
      warnings.push(detail);
      return { decision: 'warn', detail, warnings, audits };
    }

    if (environment[BROAD_MODE_ENV] === '1') {
      const detail = coverageAdvisory(parsed.server, normalized);
      warnings.push(detail);
      return { decision: 'warn', detail, warnings, audits };
    }

    // Manifest-strict (default): an external, unrouteable server stays silent
    // so every advisory the operator sees stays actionable.
    return { decision: 'allow', detail: null, warnings, audits };
  } catch (_) {
    // Fail open on any unexpected internal error -- never impede the call.
    return { decision: 'allow', detail: null, warnings: [], audits: [] };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // constants
  MANIFEST_RELATIVE_PATH,
  DISABLED_ENV,
  BROAD_MODE_ENV,
  INTERNAL_RAW_TOKENS,
  // parsing + normalization helpers
  normalizeServerToken,
  isInternalServerToken,
  parseClaudeShape,
  parseOpenCodeShape,
  // manifest helpers
  resolveManifestPath,
  loadManifestFamilies,
  // runtime-neutral entrypoint
  evaluateNativeMcpCall,
};
