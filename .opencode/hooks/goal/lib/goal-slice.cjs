// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ goal-slice — the packet goal.md projections every goal surface shares    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// A packet's goal.md carries three regions: YAML frontmatter that is bookkeeping
// for the file, a durable slice that an operator sets as the session objective,
// and a volatile log. Every surface that shows the goal to a person or a model
// (chat resend, prompt injection, the stored objective, CLI show) must read the
// same slice and must never let the frontmatter through. This module is the one
// place that boundary is drawn, so the CommonJS core and the ESM plugin cannot
// drift apart on it.

const { createHash } = require('node:crypto');
const { existsSync, readFileSync, realpathSync } = require('node:fs');
const { join, resolve, isAbsolute, relative, dirname } = require('node:path');

const GOAL_FILENAME = 'goal.md';
const LOG_ANCHOR = '<!-- ANCHOR:log -->';
// The frontmatter opener: optional BOM, optional leading HTML comments, a
// fence. Trailing spaces or tabs on either fence are tolerated because an
// editor can leave them and a stricter match would let the whole block
// through as body, which is the one leak this module exists to prevent.
const FRONTMATTER_PATTERN = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/;
const FRONTMATTER_OPENER_PATTERN = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---[ \t]*\n/;
const BUDGET_MANIFEST = '.opencode/skills/system-spec-kit/templates/spec-kit-docs.json';
const HTML_COMMENT_PATTERN = /<!--[\s\S]*?-->\n?/g;
const ANCHOR_BODY_PATTERN = (id) => new RegExp(`<!-- ANCHOR:${id} -->([\\s\\S]*?)<!-- /ANCHOR:${id} -->`);

/**
 * Split a goal document into its frontmatter block and body.
 *
 * @param {string} content - Raw file content.
 * @returns {{ frontmatter: string | null, body: string }} The YAML block without fences, and everything after it.
 */
function splitFrontmatter(content) {
  // Bare carriage returns are normalized too: a CR-only file would otherwise
  // match neither fence pattern and leak its whole frontmatter as body.
  const normalized = String(content || '').replace(/\r\n?/g, '\n');
  const match = normalized.match(FRONTMATTER_PATTERN);
  if (match) return { frontmatter: match[1], body: normalized.slice(match[0].length) };
  // An opener with no closing fence is a broken document. Fail closed: the
  // body is empty rather than the bookkeeping the fence was meant to hide.
  if (FRONTMATTER_OPENER_PATTERN.test(normalized)) return { frontmatter: null, body: '', broken: true };
  return { frontmatter: null, body: normalized };
}

/**
 * The durable slice exactly as the validator measures it: after the
 * frontmatter fence, up to the log anchor, comments and anchors included.
 *
 * @param {string} content - Raw file content.
 * @returns {string} The measured slice.
 */
function extractDurableSlice(content) {
  const { body } = splitFrontmatter(content);
  const logIndex = body.indexOf(LOG_ANCHOR);
  return logIndex >= 0 ? body.slice(0, logIndex) : body;
}

/**
 * The slice as it is sent in chat: the durable slice with anchor markers and
 * scaffold comments removed and blank runs collapsed, so an operator pastes
 * prose, not markup.
 *
 * @param {string} content - Raw file content.
 * @returns {string} Chat-ready text.
 */
function renderChatSlice(content) {
  return extractDurableSlice(content)
    .replace(HTML_COMMENT_PATTERN, '')
    .replace(/\n---\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function anchorBody(content, id) {
  const match = String(content || '').match(ANCHOR_BODY_PATTERN(id));
  return match ? match[1] : null;
}

function criteriaBullets(content) {
  const completion = anchorBody(content, 'completion') || '';
  return completion
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^-\s+\[[ xX]\]\s+/.test(line))
    .map((line) => `- ${line.replace(/^-\s+\[[ xX]\]\s+/, '')}`);
}

/**
 * The objective slice: what the runtime stores and judges completion against.
 * Pointer first so a truncation keeps the address, then the binding sentence
 * when the packet is phased, then the criteria copied out. Nothing dereferences
 * a path inside an objective, which is why the criteria are copied and not
 * referenced.
 *
 * @param {string} content - Raw file content.
 * @param {string} packetPath - Repo-relative packet directory.
 * @returns {{ text: string, nested: boolean }} The objective text and whether a binding table was present.
 */
function buildObjectiveSlice(content, packetPath) {
  const nested = anchorBody(content, 'binding') !== null;
  const lines = [`Execute ${packetPath.replace(/\/+$/, '')}/${GOAL_FILENAME}.`];
  if (nested) {
    lines.push('BINDING: read each phase\'s goal.md before working that phase; its criteria bind as if written here. PRECEDENCE: parent decisions outrank child detail; child detail outranks any summary of it.');
  }
  const bullets = criteriaBullets(content);
  if (bullets.length > 0) {
    lines.push('DONE WHEN:');
    lines.push(...bullets);
  }
  return { text: lines.join('\n'), nested };
}

/**
 * A stable digest of the durable slice. Whitespace runs collapse before hashing
 * so a reflowed paragraph or a trailing newline is not a change; a decision, a
 * binding row or a criterion is.
 *
 * @param {string} content - Raw file content.
 * @returns {string} `sha256:<hex>` of the normalized slice.
 */
function durableSliceHash(content) {
  const normalized = extractDurableSlice(content)
    .replace(HTML_COMMENT_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();
  return `sha256:${createHash('sha256').update(normalized, 'utf8').digest('hex')}`;
}

/**
 * The one-line reminder every runtime appends to its injection while the
 * durable slice is ahead of what was last resent. On an adapted runtime the
 * injection already renders from the file, so the operator has nothing to
 * paste; the reminder asks for the chat resend and names the exact command
 * that records it, which each adapter supplies because only it knows its
 * own surface.
 *
 * @param {string} packetPath - Repo-relative packet directory.
 * @param {{ recordCommand?: string }} [options] - The command that marks the slice resent on this runtime.
 * @returns {string} The reminder line.
 */
function renderResendReminderText(packetPath, options = {}) {
  const record = typeof options.recordCommand === 'string' && options.recordCommand.trim()
    ? `then record it with: ${options.recordCommand.trim()}`
    : 'then record it with the goal command\'s resent action';
  return `[goal_resend_pending] The bound packet goal.md (${packetPath}) changed above its log. Resend its durable slice in chat, frontmatter excluded, so the operator sees the change, ${record}. Keep working meanwhile.`;
}

/**
 * Walk up from a directory to the repository root, the same way the core
 * resolves a workspace, so a packet path binds against the repo and not
 * against whichever subdirectory the caller happened to be in.
 *
 * @param {string} startDir - Any directory inside the repository.
 * @returns {string} The repository root, or the start directory when no marker is found.
 */
function resolveWorkspaceRoot(startDir) {
  let dir = resolve(startDir || process.cwd());
  for (let depth = 0; depth < 40; depth += 1) {
    if (existsSync(join(dir, '.git')) || existsSync(join(dir, '.opencode', 'skills'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(startDir || process.cwd());
}

/**
 * Resolve a packet path against the workspace and refuse anything that
 * escapes it. A packet path is operator input, so it is treated like one.
 *
 * @param {string} workspace - Absolute repo root.
 * @param {string} packetPath - Repo-relative or absolute packet directory.
 * @returns {{ absolute: string, relative: string } | null} Both forms, or null when the path escapes the workspace.
 */
function resolvePacketDir(workspace, packetPath) {
  if (typeof packetPath !== 'string' || !packetPath.trim()) return null;
  const root = resolve(workspace);
  const absolute = isAbsolute(packetPath) ? resolve(packetPath) : resolve(root, packetPath.trim());
  const rel = relative(root, absolute);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) return null;
  // A symlink inside the workspace can point anywhere on disk. Containment is
  // judged on the real paths, so a packet that resolves outside stays unbound.
  // The real path is also what a lock is keyed on, so an alias and its target
  // contend for the same lock.
  let real = absolute;
  if (existsSync(absolute)) {
    let realRoot;
    let realTarget;
    try {
      realRoot = realpathSync(root);
      realTarget = realpathSync(absolute);
    } catch {
      return null;
    }
    const realRel = relative(realRoot, realTarget);
    if (realRel.startsWith('..') || isAbsolute(realRel)) return null;
    real = realTarget;
  }
  return { absolute, real, relative: rel.split('\\').join('/') };
}

/**
 * The durable-slice budget the spec kit declares, read from its contract
 * manifest so this module quotes the same pair of numbers as the validator.
 * Null when the workspace carries no manifest or no budget block.
 *
 * @param {string} workspace - Absolute repo root.
 * @returns {{ warnChars: number, errorChars: number } | null} The tiers, or null.
 */
function resolveGoalBudget(workspace) {
  try {
    const manifest = JSON.parse(readFileSync(join(resolve(workspace), BUDGET_MANIFEST), 'utf8'));
    const raw = manifest && manifest.goalDurableBudget;
    const warnChars = Number(raw && raw.warnChars);
    const errorChars = Number(raw && raw.errorChars);
    if (!Number.isInteger(warnChars) || !Number.isInteger(errorChars) || warnChars <= 0 || errorChars < warnChars) return null;
    return { warnChars, errorChars };
  } catch {
    return null;
  }
}

function budgetState(durableChars, budget) {
  if (!budget) return 'unknown';
  if (durableChars > budget.errorChars) return 'over';
  if (durableChars > budget.warnChars) return 'warn';
  return 'ok';
}

/**
 * Read a packet's goal document and project every slice the surfaces need.
 * Fail-open: a missing or unreadable file yields null, which every caller
 * treats as an unbound session.
 *
 * @param {string} workspace - Absolute repo root.
 * @param {string} packetPath - Repo-relative packet directory.
 * @returns {Object | null} The projections, or null when the goal document is absent.
 */
function readPacketGoal(workspace, packetPath) {
  const dir = resolvePacketDir(workspace, packetPath);
  if (!dir) return null;
  const goalPath = join(dir.absolute, GOAL_FILENAME);
  if (!existsSync(goalPath)) return null;
  let content;
  try {
    content = readFileSync(goalPath, 'utf8');
  } catch {
    return null;
  }
  // The whole read stays inside one guard: a document unlinked between two
  // calls must read as unbound, never throw into a render path.
  if (splitFrontmatter(content).broken) return null;
  const durableSlice = extractDurableSlice(content);
  const objective = buildObjectiveSlice(content, dir.relative);
  const budget = resolveGoalBudget(workspace);
  return Object.freeze({
    budget,
    budgetState: budgetState(durableSlice.length, budget),
    packetPath: dir.relative,
    packetRealPath: dir.real,
    goalPath,
    durableSlice,
    durableChars: durableSlice.length,
    chatSlice: renderChatSlice(content),
    objectiveSlice: objective.text,
    nested: objective.nested,
    hash: durableSliceHash(content),
  });
}

module.exports = {
  GOAL_FILENAME,
  LOG_ANCHOR,
  splitFrontmatter,
  extractDurableSlice,
  renderChatSlice,
  buildObjectiveSlice,
  durableSliceHash,
  resolvePacketDir,
  resolveGoalBudget,
  resolveWorkspaceRoot,
  readPacketGoal,
  renderResendReminderText,
};
