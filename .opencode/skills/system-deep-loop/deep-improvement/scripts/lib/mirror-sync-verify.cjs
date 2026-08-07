// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ mirror-sync-verify — repo-managed agent mirror sync verifier            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME_MIRRORS = Object.freeze([
  { runtime: 'opencode', template: '.opencode/agents/{name}.md', format: 'markdown', required: true },
  { runtime: 'claude', template: '.claude/agents/{name}.md', format: 'markdown', required: true },
  { runtime: 'codex', template: '.codex/agents/{name}.toml', format: 'toml', required: false },
]);

const LOAD_BEARING_MARKERS = Object.freeze([
  'VALIDATE INPUTS',
  'READ STATE',
  'DETERMINE FOCUS',
  'EXECUTE REVIEW',
  'RESOLVE EDGES',
  'CLASSIFY FINDINGS',
  'WRITE FINDINGS',
  'UPDATE STRATEGY',
  'APPEND JSONL',
  'WRITE DELTA',
  'VERIFY OUTPUTS',
  'RECEIVE',
  'PREPARE',
  'DIVERSIFY',
  'DISPATCH',
  'DELIBERATE',
  'SYNTHESIZE',
  'COMPOSE',
  'DELIVER',
]);

const TOOL_ALIASES = Object.freeze({
  detect_changes: Object.freeze(['detect_changes', 'mcp__mk_code_index__detect_changes']),
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function resolveMirrorPath(repoRoot, template, agentName) {
  return path.join(repoRoot, template.replace('{name}', agentName));
}

/**
 * Strip leading YAML frontmatter from markdown content.
 *
 * @param {string} content - Raw file content.
 * @returns {string} Content with the leading frontmatter block removed.
 */
function stripFrontmatter(content) {
  return String(content || '').replace(/^---[\s\S]*?---\n/, '');
}

/**
 * Extract the agent body from runtime-mirror content by format.
 *
 * @param {string} content - Raw mirror file content.
 * @param {string} [format] - Mirror format (always 'markdown'; kept as a
 *   parameter so a future non-markdown runtime mirror can extend this
 *   without changing the call sites).
 * @returns {string|null} Trimmed agent body, or null if not extractable.
 */
function extractAgentBody(content, format = 'markdown') {
  if (format === 'toml') {
    const literal = String(content || '').match(
      /^\s*developer_instructions\s*=\s*'''([\s\S]*?)'''\s*$/m,
    );
    if (literal) return literal[1].trim();
    const quoted = String(content || '').match(
      /^\s*developer_instructions\s*=\s*("(?:\\.|[^"\\])*")\s*$/m,
    );
    if (quoted) {
      try {
        return JSON.parse(quoted[1]).trim();
      } catch {
        return null;
      }
    }
    return null;
  }
  return stripFrontmatter(content).trim();
}

function normalizeRuntimeSpecificText(body) {
  return String(body || '')
    // Agent-file references include literal placeholders like `<name>`, so the
    // name class allows < and >. This normalizes the per-runtime path so a
    // real body difference elsewhere still registers as drift.
    .replace(/\.(?:opencode|claude|pi)\/agents\/\*\.md/g, '<runtime-agent-path>')
    .replace(/\.(?:opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\.codex\/agents\/[A-Za-z0-9_<>-]+\.toml/g, '<runtime-agent-file>')
    // Each mirror describes itself ("this runtime's mirror; the canonical source
    // lives in .opencode/agents/") in a parenthetical the .opencode canonical
    // omits. That is legitimate per-runtime self-description, not body drift, so
    // drop the whole clause before comparing.
    .replace(/\(this runtime.s mirror;[^)]*\)/gi, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

function tokenizeBody(body) {
  const normalized = normalizeRuntimeSpecificText(body).toLowerCase();
  return new Set(normalized.match(/[a-z0-9_./*-]{3,}/g) || []);
}

function extractLoadBearingSequence(body) {
  const markerPattern = LOAD_BEARING_MARKERS.map((marker) => marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const sequence = [];
  const linePattern = new RegExp(
    `^\\s*(?:\\d+[.)]\\s+)?[^\\n]*?\\b(${markerPattern})\\b[^\\n]*$`,
    'gim',
  );
  for (const match of String(body || '').matchAll(linePattern)) {
    const marker = match[1].toUpperCase();
    const line = match[0];
    if (/^\s*\d+[.)]\s+/.test(line) || /►|->|→/.test(line)) sequence.push(marker);
  }
  return sequence;
}

function extractDeclaredToolSurface(content, format = 'markdown') {
  if (format !== 'markdown') {
    return { comparable: false, tools: [] };
  }
  const match = String(content || '').match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/);
  if (!match) return { comparable: false, tools: [] };

  const tools = new Set();
  let listSection = false;
  for (const line of match[1].split(/\r?\n/)) {
    const listStart = line.match(/^\s*(tools|allowed-tools):\s*(.*?)\s*$/i);
    if (listStart) {
      listSection = true;
      for (const token of listStart[2].match(/[A-Za-z][A-Za-z0-9_.*-]*/g) || []) {
        tools.add(token.toLowerCase());
      }
      continue;
    }
    if (listSection && /^\s+-\s+/.test(line)) {
      const item = line.match(/^\s+-\s+([^\s#]+)/);
      if (item) tools.add(item[1].toLowerCase());
      continue;
    }
    if (line.trim() && !/^\s+/.test(line)) listSection = false;

    const permission = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*):\s*(allow|allowed|true|yes)\s*$/i);
    if (permission) tools.add(permission[1].toLowerCase());
  }
  return { comparable: true, tools: [...tools].sort() };
}

function requiredBodyTools(body) {
  return Object.keys(TOOL_ALIASES).filter((tool) => (
    new RegExp(`\\b${tool}\\b`, 'i').test(String(body || ''))
  ));
}

function compareToolSurface(expectedContent, actualContent, expectedFormat = 'markdown', actualFormat = 'markdown') {
  const expectedBody = extractAgentBody(expectedContent, expectedFormat);
  const requiredTools = requiredBodyTools(expectedBody || '');
  const actualSurface = extractDeclaredToolSurface(actualContent, actualFormat);
  if (!actualSurface.comparable || requiredTools.length === 0) {
    return { comparable: actualSurface.comparable, matches: true, missingTools: [], requiredTools };
  }
  const actualTools = new Set(actualSurface.tools);
  const missingTools = requiredTools.filter((tool) => (
    !(TOOL_ALIASES[tool] || [tool]).some((alias) => actualTools.has(alias))
  ));
  return {
    comparable: true,
    matches: missingTools.length === 0,
    missingTools,
    requiredTools,
  };
}

/**
 * Compare two agent bodies by normalized token sets for drift.
 *
 * @param {string} expectedBody - Canonical expected body.
 * @param {string} actualBody - Mirror body to compare against.
 * @returns {Object} Comparison with matches flag and missing/unexpected tokens.
 */
function compareBodyTokens(expectedBody, actualBody) {
  const expectedTokens = tokenizeBody(expectedBody);
  const actualTokens = tokenizeBody(actualBody);
  const missingTokens = [...expectedTokens].filter((token) => !actualTokens.has(token)).sort();
  const unexpectedTokens = [...actualTokens].filter((token) => !expectedTokens.has(token)).sort();
  const expectedLoadBearingSequence = extractLoadBearingSequence(expectedBody);
  const actualLoadBearingSequence = extractLoadBearingSequence(actualBody);
  const orderMatches = expectedLoadBearingSequence.length === 0
    && actualLoadBearingSequence.length === 0
    ? true
    : JSON.stringify(expectedLoadBearingSequence) === JSON.stringify(actualLoadBearingSequence);

  return {
    matches: missingTokens.length === 0 && unexpectedTokens.length === 0 && orderMatches,
    missingTokenCount: missingTokens.length,
    unexpectedTokenCount: unexpectedTokens.length,
    missingTokens: missingTokens.slice(0, 20),
    unexpectedTokens: unexpectedTokens.slice(0, 20),
    expectedLoadBearingSequence,
    actualLoadBearingSequence,
    orderMatches,
  };
}

/**
 * Infer the agent name from a mirror file path (basename without extension).
 *
 * @param {string} filePath - Path to a runtime-mirror agent file.
 * @returns {string} Agent name derived from the file basename.
 */
function inferAgentNameFromPath(filePath) {
  const ext = path.extname(filePath);
  return path.basename(filePath, ext);
}

/**
 * Resolve the per-runtime mirror paths for an agent name.
 *
 * @param {string} agentName - Agent name to expand into mirror paths.
 * @param {string} [repoRoot] - Repository root for absolute path resolution.
 * @returns {Array<Object>} Mirror descriptors with runtime, path, absolutePath, format.
 */
function runtimePaths(agentName, repoRoot = process.cwd()) {
  return RUNTIME_MIRRORS.map((mirror) => ({
    runtime: mirror.runtime,
    path: mirror.template.replace('{name}', agentName),
    absolutePath: resolveMirrorPath(repoRoot, mirror.template, agentName),
    format: mirror.format,
    required: mirror.required,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify that all repo-managed runtime mirrors of an agent are present and in sync.
 *
 * @param {string} agentName - Agent name to verify across runtime mirrors.
 * @param {string} content - Canonical agent content to compare mirrors against.
 * @param {Object} [options] - Options bag.
 * @param {string} [options.repoRoot] - Repository root for resolving mirror paths.
 * @param {string} [options.expectedFormat] - Format of the canonical content.
 * @returns {Object} Result with present/missing/drift runtimes, allInSync, details.
 */
function verifyMirrorSync(agentName, content, options = {}) {
  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  const expectedFormat = options.expectedFormat || 'markdown';
  const expectedBody = extractAgentBody(content, expectedFormat);
  if (!agentName || typeof agentName !== 'string') {
    throw new Error('verifyMirrorSync requires an agentName');
  }
  if (expectedBody === null || expectedBody.length === 0) {
    throw new Error('verifyMirrorSync requires extractable agent body content');
  }

  const presentRuntimes = [];
  const missingRuntimes = [];
  const driftRuntimes = [];
  const details = [];

  for (const mirror of runtimePaths(agentName, repoRoot)) {
    if (!fs.existsSync(mirror.absolutePath)) {
      if (mirror.required !== false) missingRuntimes.push(mirror.runtime);
      details.push({
        runtime: mirror.runtime,
        path: mirror.path,
        status: mirror.required === false ? 'not-shipped' : 'missing',
      });
      continue;
    }

    presentRuntimes.push(mirror.runtime);
    const mirrorContent = fs.readFileSync(mirror.absolutePath, 'utf8');
    const mirrorBody = extractAgentBody(mirrorContent, mirror.format);
    if (mirrorBody === null) {
      driftRuntimes.push(mirror.runtime);
      details.push({
        runtime: mirror.runtime,
        path: mirror.path,
        status: 'drift',
        reason: 'body-unextractable',
      });
      continue;
    }

    const comparison = compareBodyTokens(expectedBody, mirrorBody);
    const surfaceComparison = compareToolSurface(content, mirrorContent, expectedFormat, mirror.format);
    if (!comparison.matches || !surfaceComparison.matches) {
      driftRuntimes.push(mirror.runtime);
      details.push({
        runtime: mirror.runtime,
        path: mirror.path,
        status: 'drift',
        comparison,
        surfaceComparison,
      });
      continue;
    }

    details.push({
      runtime: mirror.runtime,
      path: mirror.path,
      status: 'in-sync',
      surfaceComparison,
    });
  }

  return {
    presentRuntimes,
    missingRuntimes,
    driftRuntimes,
    allInSync: missingRuntimes.length === 0 && driftRuntimes.length === 0,
    details,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  RUNTIME_MIRRORS,
  compareBodyTokens,
  compareToolSurface,
  extractAgentBody,
  extractDeclaredToolSurface,
  extractLoadBearingSequence,
  inferAgentNameFromPath,
  runtimePaths,
  stripFrontmatter,
  verifyMirrorSync,
};
