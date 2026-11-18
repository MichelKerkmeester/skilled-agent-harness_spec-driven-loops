#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Frontier Admission
// ───────────────────────────────────────────────────────────────────
//
// The frontier node store is append-only, one JSON object per line, and the
// LAST row per nodeId wins. Status has to survive a reduce and a resume, and
// neither the inbox (six fields) nor the registry (rebuilt from its inputs on
// every reduce) can carry it, so it lives here instead.
//
// Seed, admit, prune and close all pass through this module. The one other
// writer is fanout-run.cjs, which writes the starting store of each lineage it
// deals a node to before the lineage spawns. The admission checks run in one fixed order so the workflow steps
// have a single deterministic implementation rather than prose the orchestrating
// model executes: relevance, dedupe, depth, fan-out, monotone budget, acyclicity.
// The first failing check prunes the proposal with that check's name as the
// reason.
//
// Only an admitted node reaches the inbox, and the inbox is the only path that
// grows the counted question set mid-run. A pruned node is recorded in the store
// and nowhere else.
//
// A review run reads the same store with the review config instead: an admitted
// node is queued by the store alone, and relevance narrows to the review target,
// so no counted question is invented where the run answers none.
//
// Leaves propose; they never call this module.

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const NODE_STORE_FILE = 'frontier-nodes.jsonl';
const INBOX_FILE = 'inbox.jsonl';
const CONFIG_FILE = 'deep-research-config.json';
const REVIEW_CONFIG_FILE = 'deep-review-config.json';

// A target names the loop a call speaks for: which config file it reads and
// whether an admitted node queues a question.
const TARGETS = Object.freeze(['research', 'review']);

const DEFAULT_MAX_DEPTH = 3;
const DEFAULT_MAX_CHILDREN_PER_NODE = 6;
const DEFAULT_MAX_FRONTIER_NODES = 10;

// The seed step decomposes a target into a documented number of depth-1 nodes:
// 3 to 6 sub-questions for research, 3 to 8 sub-targets for review. The root's
// children are those nodes, so its cap is the top of that range, never below the
// per-node cap. A fan-out parent seeds before any config exists, so this cannot
// come from config alone.
const ROOT_CHILDREN_FLOOR = Object.freeze({ research: 6, review: 8 });

// The iteration budget each workflow uses when no flag, marker, setup answer or
// fan-out matrix value sets one, and the ceiling a budget derived from the seed may
// reach. Four is the canonical review dimension count a fan-out lineage reviews.
/** Iteration budget each loop runs at when nothing sets one. */
const LOOP_DEFAULT_MAX_ITERATIONS = Object.freeze({ research: 10, review: 7 });
/** Highest iteration budget a defaulted expansive run is sized to. */
const EXPANSIVE_BUDGET_CEILING = 24;
const CANONICAL_REVIEW_DIMENSIONS = 4;

/** Every status a frontier node row may carry. */
const NODE_STATUSES = Object.freeze([
  'open',
  'active',
  'answered',
  'blocked',
  'exhausted',
  'abstained',
  'pruned',
]);

// close cannot move a node back to the unopened or admitted state: seeding and
// admission own those, and a re-close is only meaningful for a lifecycle move.
const CLOSE_STATUSES = new Set([
  'active',
  'answered',
  'blocked',
  'exhausted',
  'abstained',
  'pruned',
]);

// A node closed with one of these never answered its question: the branch ran
// out, or it was dropped. The graph projection has to keep that visible.
const UNANSWERED_CLOSE_STATUSES = new Set([
  'blocked',
  'exhausted',
  'abstained',
]);

// A node closed with one of these is settled. A re-close may repeat the status but
// never move it: a revived node would count as open again and veto the stop.
const SETTLED_CLOSE_STATUSES = new Set([
  'answered',
  ...UNANSWERED_CLOSE_STATUSES,
]);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

// A scope list counts only when one entry is a non-blank string. A list of blanks
// or non-strings would otherwise pass here and then pass the review-target
// containment check vacuously, since that check reads string entries only.
function hasScope(scope) {
  if (typeof scope === 'string') return scope.trim() !== '';
  return Array.isArray(scope) && scope.some(isNonEmptyString);
}

function normalizeIteration(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function capValue(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function assertTarget(target) {
  if (!TARGETS.includes(target)) {
    throw new Error(`unknown target: ${String(target)}; expected ${TARGETS.join(' or ')}`);
  }
  return target;
}

function appendJsonlRow(filePath, row) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(row)}\n`, 'utf8');
}

function nodeDedupeKey(node) {
  return typeof node.dedupeKey === 'string' ? node.dedupeKey : dedupeKey(node.question);
}

function depthFor(proposal, nodes) {
  const parentId = isPlainObject(proposal) ? proposal.parentId : null;
  if (parentId === 'root') return 1;
  const parent = nodes.get(parentId);
  // A node with no resolvable parent was never placed on the graph. Zero keeps
  // that fact visible instead of inventing a depth the node never had.
  return parent && Number.isFinite(parent.depth) ? parent.depth + 1 : 0;
}

function countLiveChildren(nodes, parentId) {
  let count = 0;
  for (const node of nodes.values()) {
    if (node.status !== 'pruned' && node.parentId === parentId) count += 1;
  }
  return count;
}

function countLiveNodes(nodes) {
  let count = 0;
  for (const node of nodes.values()) {
    if (node.status !== 'pruned') count += 1;
  }
  return count;
}

function checkCycle(parentId, nodes, caps) {
  const visited = new Set();
  let cursor = parentId;
  let steps = 0;

  while (cursor !== 'root' && cursor !== null && cursor !== undefined) {
    if (visited.has(cursor)) return 'cycle';
    visited.add(cursor);
    steps += 1;
    if (steps > caps.maxDepth + 1) return 'cycle';
    const node = nodes.get(cursor);
    // A dangling parent link is a relevance failure, not a cycle.
    if (!node) return null;
    cursor = node.parentId;
  }

  return null;
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Reduce a question to the key that dedupe compares.
 *
 * @param {unknown} text - The question text.
 * @returns {string} The lowercased key with any leading question id and punctuation removed, or '' for a non-string.
 */
function dedupeKey(text) {
  if (typeof text !== 'string') return '';

  // A leading question id carries no meaning for equivalence, so it is dropped
  // before punctuation collapses. Only id-shaped prefixes qualify, written with
  // no space inside them (Q3, RQ-12, F-1-001): an ordinary word followed by a
  // space, a number and a colon is part of the question.
  return text
    .toLowerCase()
    .replace(/^[a-z]{1,2}-?\d+(?:-\d+)*\s*:\s*/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// The serial part of a node id keeps counting from the highest id the store
// holds, not from how many rows it read: a torn line the reader skipped would
// otherwise hand its successor's id to the next node and overwrite that node.
function nextNodeSerial(nodes) {
  let highest = nodes.size;
  for (const nodeId of nodes.keys()) {
    const match = /^F-\d+-(\d+)$/.exec(String(nodeId));
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return String(highest + 1).padStart(3, '0');
}

/**
 * Read the append-only node store into its current nodes.
 *
 * @param {string} storePath - Path to frontier-nodes.jsonl.
 * @returns {Map<string, Object>} The last row per nodeId, empty when the file does not exist.
 * @throws {Error} When the file exists but cannot be read.
 */
function readNodeStore(storePath) {
  const nodes = new Map();
  if (!fs.existsSync(storePath)) return nodes;

  let content;
  try {
    content = fs.readFileSync(storePath, 'utf8');
  } catch (error) {
    // An empty map would read as a never-seeded run, so a store that exists but
    // cannot be read is an error, never an empty frontier.
    throw new Error(`cannot read node store ${storePath}: ${error instanceof Error ? error.message : String(error)}`);
  }

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let row;
    try {
      row = JSON.parse(trimmed);
    } catch {
      // A torn or hand-edited line must not hide the rows after it.
      continue;
    }
    if (!isPlainObject(row) || typeof row.nodeId !== 'string' || row.nodeId === '') continue;
    nodes.set(row.nodeId, row);
  }

  return nodes;
}

function readTargetConfig(artifactDir, target) {
  const configFile = target === 'review' ? REVIEW_CONFIG_FILE : CONFIG_FILE;
  // A missing config means the defaults apply. A config that exists but cannot be
  // read or parsed is an error: falling back would widen every cap it sets.
  let raw;
  try {
    raw = fs.readFileSync(path.join(artifactDir, configFile), 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw new Error(`cannot read ${configFile}: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`cannot read ${configFile}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Read the admission caps from the run's config, with the defaults filled in.
 *
 * @param {string} artifactDir - The run's artifact directory.
 * @param {'research'|'review'} [target='research'] - Which loop's config to read.
 * @returns {{maxDepth: number, maxChildrenPerNode: number, maxRootChildren: number, maxFrontierNodes: number}} The caps.
 * @throws {Error} When the config exists but cannot be read or parsed.
 */
function readCaps(artifactDir, target = 'research') {
  const config = readTargetConfig(artifactDir, assertTarget(target));
  const source = isPlainObject(config) ? config : {};
  const expansive = isPlainObject(source.expansiveDepth) ? source.expansiveDepth : {};
  // Each node costs at least one iteration, so a cap equal to the iteration budget
  // fills every slot and leaves none for the seeded questions or the stop gates.
  // The budget is read the way seedBudget reads it. The seed step reports its cap
  // from the derived budget, and step_frontier_budget writes that budget into the
  // config before any admission runs, so from then on this cap is the one the seed
  // step reported. A direct call that skips that write reads the configured budget.
  const iterationBudget = capValue(Number(source.maxIterations), null);
  const derivedCap = iterationBudget === null
    ? DEFAULT_MAX_FRONTIER_NODES
    : Math.max(1, Math.floor(iterationBudget / 2));
  const runCap = capValue(expansive.maxFrontierNodes, derivedCap);

  const maxChildrenPerNode = capValue(expansive.maxChildrenPerNode, DEFAULT_MAX_CHILDREN_PER_NODE);

  return {
    maxDepth: capValue(expansive.maxDepth, DEFAULT_MAX_DEPTH),
    maxChildrenPerNode,
    maxRootChildren: Math.max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR[target]),
    maxFrontierNodes: runCap,
  };
}

// A defaulted expansive budget is sized from the seed: two iterations for each node
// on every level the frontier may still reach (the seeded nodes plus one node per
// level below depth 1), times the iterations one node costs, which is one for
// research and, for review, one per dimension the reducer requires before it marks
// a node answered. It never drops below the loop default and never passes the
// ceiling, which binds for a review from the first seed at the default depth. Twice the node count keeps the half-budget node cap
// above the seed, so the frontier can still grow. A run or lineage with no seeded
// node has no frontier to fund, so it runs at its loop default.
/**
 * Size a defaulted expansive iteration budget from the seed.
 *
 * @param {Object} options - Sizing inputs.
 * @param {'research'|'review'} options.target - The loop being sized.
 * @param {number} options.seeded - Depth-1 nodes the seed admitted.
 * @param {number} [options.maxDepth] - The deepest level the frontier may reach.
 * @param {number} [options.dimensions] - Dimensions a review node needs before it is answered.
 * @param {number} [options.loopDefault] - The floor; the loop default when absent.
 * @returns {number} The iteration budget, between the floor and EXPANSIVE_BUDGET_CEILING.
 */
function expansiveBudget({ target, seeded, maxDepth = DEFAULT_MAX_DEPTH, dimensions = CANONICAL_REVIEW_DIMENSIONS, loopDefault }) {
  const perNode = assertTarget(target) === 'review' ? Math.max(1, Math.floor(dimensions) || 1) : 1;
  const floor = capValue(loopDefault, LOOP_DEFAULT_MAX_ITERATIONS[target]);
  const seededCount = Math.max(0, Math.floor(seeded) || 0);
  if (seededCount === 0) return floor;
  const nodes = seededCount + Math.max(1, Math.floor(maxDepth) || 1) - 1;
  return Math.min(EXPANSIVE_BUDGET_CEILING, Math.max(floor, 2 * perNode * nodes));
}

// A review node is answered only once every dimension in the reducer's universe
// has evidence, the canonical four plus any custom names, so the budget counts that
// same set. Loaded on use, the way fanout-run loads this module.
function reviewDimensionCount(config) {
  const { buildDimensionUniverse } = require('./reduce-state.cjs');
  return buildDimensionUniverse(config).length;
}

// The budget the run uses after the seed step, and how many nodes past depth 1 the
// node cap still leaves. Only a defaulted budget is derived; a flag, marker, setup
// answer or fan-out matrix value is kept as given, even below the derived value.
/**
 * Compute the budget a run uses after its seed step.
 *
 * @param {Object} options - Budget inputs.
 * @param {string} options.artifactDir - The run's artifact directory.
 * @param {'research'|'review'} [options.target='research'] - The loop being sized.
 * @param {string} [options.maxIterationsSource='default'] - Where maxIterations came from; only 'default' is derived.
 * @returns {{derivedMaxIterations: number, growthSlots: number, warning?: string}} The budget, the node slots left past depth 1, and a warning when none are left.
 */
function seedBudget({ artifactDir, target = 'research', maxIterationsSource = 'default' }) {
  const mode = assertTarget(target);
  const config = readTargetConfig(artifactDir, mode);
  const source = isPlainObject(config) ? config : {};
  const expansive = isPlainObject(source.expansiveDepth) ? source.expansiveDepth : {};
  const configured = capValue(Number(source.maxIterations), LOOP_DEFAULT_MAX_ITERATIONS[mode]);
  const seeded = [...readNodeStore(path.join(artifactDir, NODE_STORE_FILE)).values()]
    .filter((node) => node.depth === 1 && node.status !== 'pruned').length;
  const derivedMaxIterations = maxIterationsSource === 'default'
    ? expansiveBudget({
      target: mode,
      seeded,
      maxDepth: capValue(expansive.maxDepth, DEFAULT_MAX_DEPTH),
      dimensions: mode === 'review' ? reviewDimensionCount(source) : 1,
      loopDefault: configured,
    })
    : configured;
  const nodeCap = capValue(expansive.maxFrontierNodes, Math.max(1, Math.floor(derivedMaxIterations / 2)));
  const growthSlots = Math.max(0, nodeCap - seeded);
  return {
    derivedMaxIterations,
    growthSlots,
    ...(growthSlots === 0
      ? { warning: `no growth slot past depth 1: the ${seeded} seeded nodes fill the node cap of ${nodeCap} at a budget of ${derivedMaxIterations} iterations` }
      : {}),
  };
}

function childCapFor(parentId, caps) {
  return parentId === 'root' && Number.isFinite(caps.maxRootChildren) ? caps.maxRootChildren : caps.maxChildrenPerNode;
}

// A review target is a file list, and only those paths can hold a finding. The
// './' prefix, trailing '/' and './' or '..' segments a caller writes carry no
// meaning of their own, so both sides of the comparison are normalized before
// containment is tested; otherwise a path that climbs out with '..' would still
// start with the target's prefix. '.' and './' both name the repo root and read as
// '.', not as blank, so a root scope or target is never dropped from the test. A
// blank entry stays blank for the caller to drop.
function normalizeTargetPath(value) {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  const normalized = path.posix.normalize(trimmed).replace(/^\.\//, '').replace(/\/+$/, '');
  return normalized === '' ? '.' : normalized;
}

// The repo root holds every relative path that does not climb out of it.
function isInsidePath(entry, base) {
  if (base === '.') return entry !== '..' && !entry.startsWith('../') && !entry.startsWith('/');
  return entry === base || entry.startsWith(`${base}/`);
}

// A glob target names a pattern, not a path, so no scope equals it or sits under
// it. The directory before the first segment holding a glob character bounds every
// path the pattern can match, so it stands in for the pattern; a pattern with no
// static directory, such as '**/*.ts', is bounded only by the repo root.
function staticTargetBase(entry) {
  const globAt = entry.search(/[*?[{]/);
  if (globAt === -1) return entry;
  const slashAt = entry.lastIndexOf('/', globAt);
  return slashAt <= 0 ? '.' : entry.slice(0, slashAt);
}

function splitTargetPaths(value) {
  if (typeof value !== 'string') return [];
  return value
    .split(/[,\s]+/)
    .map(normalizeTargetPath)
    .filter((entry) => entry !== '');
}

function scopeEntries(scope) {
  const list = Array.isArray(scope) ? scope : [scope];
  return list
    .filter((entry) => typeof entry === 'string')
    .map(normalizeTargetPath)
    .filter((entry) => entry !== '');
}

// A git revision range (base..tip or base...tip) is not a path. The dots must sit
// between two revision characters, so a '../' path segment never reads as one.
function isCommitRange(value) {
  return typeof value === 'string' && /[^\s/.]\.\.\.?[^\s/.]/.test(value) && splitTargetPaths(value).length === 1;
}

// A commit range names no paths itself; the files it touches are its scope, and
// scope discovery records them. A proposal is relevant when every entry is one of
// those files or a directory holding one. The config records them as one list, or
// as named lists once a review splits its target by kind, the two spellings the
// terminal gates read; an unread spelling would leave no files and admit every scope.
function touchedFileList(touchedFiles) {
  if (Array.isArray(touchedFiles)) return touchedFiles;
  if (isPlainObject(touchedFiles)) {
    return Object.values(touchedFiles).filter(Array.isArray).flat();
  }
  return splitTargetPaths(touchedFiles);
}

function scopeInsideTouchedFiles(scope, touchedFiles) {
  const files = touchedFileList(touchedFiles)
    .filter((entry) => typeof entry === 'string')
    .map(normalizeTargetPath)
    .filter((entry) => entry !== '');
  if (files.length === 0) return true;

  return scopeEntries(scope).every((entry) => files.some((file) => (
    isInsidePath(file, entry) || isInsidePath(entry, file)
  )));
}

/**
 * Test whether a proposal's scope lies inside the review target.
 *
 * @param {string|string[]} scope - The proposal's scope entries.
 * @param {Object} config - The review config holding the target and its scope files.
 * @returns {boolean} True when every entry is inside the target, or the target names no paths.
 */
function scopeInsideReviewTarget(scope, config) {
  const source = isPlainObject(config) ? config : {};
  // Any target kind other than a file list is described in prose, so there is no
  // path to be outside of and every scope stays relevant.
  if (source.reviewTargetType !== 'files') return true;
  if (typeof source.reviewTarget !== 'string') return true;
  if (isCommitRange(source.reviewTarget)) return scopeInsideTouchedFiles(scope, source.reviewScopeFiles);

  const allowed = splitTargetPaths(source.reviewTarget).map(staticTargetBase);
  if (allowed.length === 0) return true;

  return scopeEntries(scope).every((entry) => allowed.some((base) => isInsidePath(entry, base)));
}

/**
 * Run the six admission checks in order and name the first that fails.
 *
 * @param {Object} proposal - The proposed node.
 * @param {Map<string, Object>} nodes - The current node store.
 * @param {Object} caps - The caps from readCaps.
 * @param {string[]} knownTexts - Question texts the run already holds.
 * @param {{reviewConfig?: Object, seeding?: boolean}} [options] - Review target config and whether this is the seed.
 * @returns {string|null} The failing check's name (relevance, dedupe, depth, fanout, budget or cycle), or null to admit.
 */
function checkProposal(proposal, nodes, caps, knownTexts, options = {}) {
  if (!isPlainObject(proposal)) return 'relevance';

  const reviewConfig = isPlainObject(options) ? options.reviewConfig : undefined;

  // 1. relevance
  // A row with no question is missing a required field, so it must not reach
  // dedupe, which would report a duplicate of nothing.
  if (!isNonEmptyString(proposal.question)) return 'relevance';
  if (!isNonEmptyString(proposal.evidence)) return 'relevance';
  if (!hasScope(proposal.scope)) return 'relevance';
  // A review run only reads the paths its target names, so a node scoped
  // elsewhere could never be answered by a finding.
  if (reviewConfig !== undefined && !scopeInsideReviewTarget(proposal.scope, reviewConfig)) return 'relevance';
  if (proposal.parentId !== 'root' && !nodes.has(proposal.parentId)) return 'relevance';
  // A child of a pruned node would reopen a branch admission already rejected.
  if (proposal.parentId !== 'root' && nodes.get(proposal.parentId).status === 'pruned') return 'relevance';

  // 2. dedupe
  const key = dedupeKey(proposal.question);
  if (key === '') return 'dedupe';
  for (const node of nodes.values()) {
    // Any status counts: re-proposing a closed branch would reopen work the run
    // already settled, whether it was answered, exhausted or pruned.
    if (nodeDedupeKey(node) === key) return 'dedupe';
  }
  if (Array.isArray(knownTexts)) {
    for (const text of knownTexts) {
      if (typeof text === 'string' && dedupeKey(text) === key) return 'dedupe';
    }
  }

  // 3. depth
  const depth = depthFor(proposal, nodes);
  if (depth > caps.maxDepth) return 'depth';

  // 4. fan-out
  if (countLiveChildren(nodes, proposal.parentId) >= childCapFor(proposal.parentId, caps)) return 'fanout';
  // The run-wide node cap shares the fan-out reason: both bound how wide the
  // frontier may grow, and the six reason names are the store's contract. A
  // depth-1 seed answers only to the root-children cap: the run cap is half the
  // iteration budget, so on a small budget it would prune most of the seed before
  // any iteration ran. Seeds still count toward the live total later checked here.
  const seeding = isPlainObject(options) && options.seeding === true;
  if (!seeding && countLiveNodes(nodes) >= caps.maxFrontierNodes) return 'fanout';

  // 5. budget
  const parent = proposal.parentId === 'root' ? null : nodes.get(proposal.parentId);
  if (Number.isFinite(proposal.budget) && parent && Number.isFinite(parent.budget)) {
    // Budgets only narrow from parent to child; a child that claims more than
    // its parent could spend work the run never allotted to that branch.
    if (proposal.budget > parent.budget) return 'budget';
  }

  // 6. cycle
  return checkCycle(proposal.parentId, nodes, caps);
}

/**
 * Admit or prune each proposal and record every outcome in the node store.
 *
 * @param {Object} options - Admission inputs.
 * @param {string} options.artifactDir - The run's artifact directory.
 * @param {number} options.iteration - The iteration the proposals came from.
 * @param {Object[]} options.proposals - The proposed nodes.
 * @param {string[]} [options.knownTexts=[]] - Question texts the run already holds.
 * @param {'research'|'review'} [options.target='research'] - The loop admitting them.
 * @param {boolean} [options.seeding=false] - True for the seed, which skips the run-wide node cap.
 * @returns {{admitted: string[], pruned: Array<{nodeId: string, reason: string}>}} The admitted node ids and the pruned ones with their reasons.
 */
function admitProposals({ artifactDir, iteration, proposals, knownTexts = [], target = 'research', seeding = false }) {
  const mode = assertTarget(target);
  const storePath = path.join(artifactDir, NODE_STORE_FILE);
  const inboxPath = path.join(artifactDir, INBOX_FILE);
  const nodes = readNodeStore(storePath);
  const caps = readCaps(artifactDir, mode);
  // A missing review config, or one that holds no JSON object, gives the
  // no-target object, which admits every scope the way a prose target does: the
  // target check can only narrow when a file-list target is on record. An
  // unparsable config has already failed closed in readCaps above.
  const reviewOptions = {
    ...(mode === 'review' ? { reviewConfig: readTargetConfig(artifactDir, mode) ?? {} } : {}),
    seeding: seeding === true,
  };
  const iterationValue = normalizeIteration(iteration);
  const admitted = [];
  const pruned = [];
  const list = Array.isArray(proposals) ? proposals : [];

  for (const proposal of list) {
    const accept = checkProposal(proposal, nodes, caps, knownTexts, reviewOptions);
    const depth = depthFor(proposal, nodes);
    const nodeId = `F-${depth}-${nextNodeSerial(nodes)}`;
    const safe = isPlainObject(proposal) ? proposal : {};

    if (accept !== null) {
      const row = {
        nodeId,
        parentId: safe.parentId === undefined ? null : safe.parentId,
        depth,
        scope: safe.scope === undefined ? null : safe.scope,
        question: safe.question === undefined ? null : safe.question,
        status: 'pruned',
        reason: accept,
        iteration: iterationValue,
        dedupeKey: dedupeKey(safe.question),
      };
      appendJsonlRow(storePath, row);
      nodes.set(nodeId, row);
      pruned.push({ nodeId, reason: accept });
      continue;
    }

    const row = {
      nodeId,
      parentId: proposal.parentId,
      depth,
      scope: proposal.scope,
      question: proposal.question,
      status: 'open',
      reason: null,
      iteration: iterationValue,
      dedupeKey: dedupeKey(proposal.question),
      // The budget check compares a child with its stored parent, so an admitted
      // budget is kept on the row or no later child could ever be held to it.
      ...(Number.isFinite(proposal.budget) ? { budget: proposal.budget } : {}),
    };
    appendJsonlRow(storePath, row);
    nodes.set(nodeId, row);
    // A review run has no question inbox: the store alone queues its nodes, and
    // an inbox row would add a counted question the review never asked.
    if (mode !== 'review') {
      appendJsonlRow(inboxPath, {
        id: nodeId,
        text: proposal.question,
        source: 'frontier',
        origin: 'frontier',
        injectedAtIteration: iterationValue,
      });
    }
    admitted.push(nodeId);
  }

  return { admitted, pruned };
}

/**
 * Seed a run's depth-1 nodes once and report the budget that follows.
 *
 * @param {Object} options - Seed inputs.
 * @param {string} options.artifactDir - The run's artifact directory.
 * @param {number} [options.iteration=0] - The iteration recorded on the seeded rows.
 * @param {Object[]} options.candidates - The decomposed sub-questions or review sub-targets.
 * @param {string[]} [options.knownTexts=[]] - Question texts the run already holds.
 * @param {'research'|'review'} [options.target='research'] - The loop being seeded.
 * @param {string} [options.maxIterationsSource='default'] - Where maxIterations came from.
 * @returns {Object} The admitted and pruned nodes plus the seedBudget fields, or skipped 'already-seeded'.
 */
function seedNodes({ artifactDir, iteration = 0, candidates, knownTexts = [], target = 'research', maxIterationsSource = 'default' }) {
  // Every seeded node sits at depth 1 against the run's synthetic root: the seed
  // sees only the topic, so it cannot justify a deeper placement on its own.
  // A run is seeded once. A re-run of the seed step (a restart that kept the
  // store, a repeated fan-out launch) would otherwise add a reworded second
  // decomposition beside the first, and a fan-out partition would then name
  // nodes no lineage holds.
  const mode = assertTarget(target);
  const storePath = path.join(artifactDir, NODE_STORE_FILE);
  const existing = readNodeStore(storePath);
  if ([...existing.values()].some((node) => node.depth === 1)) {
    return { admitted: [], pruned: [], skipped: 'already-seeded' };
  }

  const pruned = [];
  const proposals = [];

  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    const pruneReason = mode === 'review' && isPlainObject(candidate) ? candidate.pruneReason : undefined;
    if (!isNonEmptyString(pruneReason)) {
      proposals.push(isPlainObject(candidate) ? { ...candidate, parentId: 'root' } : candidate);
      continue;
    }

    // A reviewed sub-target can arrive already settled: a merged duplicate, a
    // generated artifact, a file with no diff of its own. The seed knows that
    // before any proposal exists, so the row is pruned here rather than through
    // an admission check that would have to reach the same conclusion.
    const nodeId = `F-1-${nextNodeSerial(existing)}`;
    const row = {
      nodeId,
      parentId: 'root',
      depth: 1,
      scope: candidate.scope === undefined ? null : candidate.scope,
      question: candidate.question === undefined ? null : candidate.question,
      status: 'pruned',
      reason: pruneReason,
      iteration: normalizeIteration(iteration),
      dedupeKey: dedupeKey(candidate.question),
    };
    appendJsonlRow(storePath, row);
    existing.set(nodeId, row);
    pruned.push({ nodeId, reason: pruneReason });
  }

  const result = admitProposals({ artifactDir, iteration, proposals, knownTexts, target: mode, seeding: true });

  return {
    admitted: result.admitted,
    pruned: [...pruned, ...result.pruned],
    ...seedBudget({ artifactDir, target: mode, maxIterationsSource }),
  };
}

/**
 * Move a node to a later lifecycle status by appending a row.
 *
 * @param {Object} options - Close inputs.
 * @param {string} options.artifactDir - The run's artifact directory.
 * @param {string} options.nodeId - The node to close.
 * @param {string} options.status - One of the close statuses.
 * @param {string|null} [options.reason=null] - Why the node closed.
 * @param {number} options.iteration - The iteration that closed it.
 * @returns {Object} The appended row.
 * @throws {Error} On an unknown status or node, a pruned node closed as anything but pruned, or a
 *   settled node (answered, blocked, exhausted, abstained) moved to another status.
 */
function closeNode({ artifactDir, nodeId, status, reason = null, iteration }) {
  if (!CLOSE_STATUSES.has(status)) {
    throw new Error(`unknown close status: ${status}; expected one of ${[...CLOSE_STATUSES].join(', ')}`);
  }

  const storePath = path.join(artifactDir, NODE_STORE_FILE);
  const nodes = readNodeStore(storePath);
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`unknown frontier node: ${nodeId}`);
  // A pruned node never reached the inbox. Closing it as anything live would count
  // it toward the caps, project it to the graph and let it satisfy a drained stop.
  if (node.status === 'pruned' && status !== 'pruned') {
    throw new Error(`frontier node ${nodeId} was pruned; it cannot be closed as ${status}`);
  }
  if (SETTLED_CLOSE_STATUSES.has(node.status) && status !== node.status) {
    throw new Error(`frontier node ${nodeId} was closed as ${node.status}; it cannot be closed as ${status}`);
  }

  const row = {
    ...node,
    status,
    reason,
    iteration: normalizeIteration(iteration),
  };
  appendJsonlRow(storePath, row);
  return row;
}

// The block is computed, not written by the orchestrating model, so the slot count
// the leaf sees is the one admission will enforce.
/**
 * Render the frontier prompt block for the node an iteration is dispatched to.
 *
 * @param {Object} options - Block inputs.
 * @param {string} options.artifactDir - The run's artifact directory.
 * @param {string} [options.focus] - The research focus naming the node.
 * @param {string} [options.nodeId] - The review node id.
 * @param {string} [options.dimension] - The review dimension for this visit.
 * @param {'research'|'review'} [options.target='research'] - The loop rendering it.
 * @returns {string} The block text, or '' when no open or active node matches.
 */
function renderFrontierBlock({ artifactDir, focus, nodeId, dimension, target = 'research' }) {
  const mode = assertTarget(target);
  let resolvedId;

  if (mode === 'review') {
    // A review leaf is dispatched to one node, so its id is handed in whole and
    // there is no focus string to parse back into one.
    resolvedId = typeof nodeId === 'string' ? nodeId : '';
  } else {
    if (typeof focus !== 'string' || focus === '') return '';

    const match = /^Frontier node (\S+) /.exec(focus);
    if (!match) return '';

    resolvedId = match[1];
  }

  const nodes = readNodeStore(path.join(artifactDir, NODE_STORE_FILE));
  const node = nodes.get(resolvedId);
  if (!node) return '';
  // A closed node's block would invite proposals admission can only prune.
  if (node.status !== 'open' && node.status !== 'active') return '';

  const caps = readCaps(artifactDir, mode);
  const depth = Number.isFinite(node.depth) ? node.depth : 0;
  const scope = Array.isArray(node.scope) ? node.scope.join(', ') : (node.scope || 'unscoped');
  const slots = Math.max(0, Math.min(
    caps.maxChildrenPerNode - countLiveChildren(nodes, resolvedId),
    caps.maxFrontierNodes - countLiveNodes(nodes),
  ));
  const dimensionLabel = isNonEmptyString(dimension) ? dimension : 'the dispatched dimension';

  const lines = [
    'FRONTIER (expansive depth)',
    mode === 'review'
      ? `Current node: ${resolvedId} at depth ${depth} of ${caps.maxDepth}, scope ${scope}. Review dimension for this node: ${dimensionLabel}.`
      : `Current node: ${resolvedId} at depth ${depth} of ${caps.maxDepth}, scope ${scope}.`,
  ];

  // Only the research prompt carries a Focus Area line; a review prompt names its
  // node through the focus string and frontierNodeId instead.
  if (mode === 'review') {
    lines.push(`Set this iteration record's "focus" to "Frontier node ${resolvedId}: ${dimensionLabel}" and add "frontierNodeId":"${resolvedId}" to it, so the run can tell which node this iteration worked.`);
  } else {
    lines.push(`Copy the Focus Area line exactly into this iteration record's "focus", so the run can tell which node this iteration worked.`);
  }

  if (depth >= caps.maxDepth) {
    lines.push('This node is at the depth cap, so do not propose children.');
  } else if (slots === 0) {
    lines.push('This node has no child slots left, so do not propose children.');
  } else if (mode === 'review') {
    lines.push(`You may append up to ${slots} \`frontier_proposal\` rows to this iteration's delta with "parentId":"${resolvedId}", one per sub-target your evidence opened inside this node. Each row needs "question" (what to review), "scope" (paths inside the review target) and "evidence". The admission step prunes duplicates, anything outside the review target, anything past the depth or fan-out caps, and any budget above one the parent recorded. Never write review/frontier-nodes.jsonl or a coverage surface yourself.`);
  } else {
    lines.push(`You may append up to ${slots} \`frontier_proposal\` rows to this iteration's delta with "parentId":"${resolvedId}", one per follow-up question your evidence opened inside this node. Each row needs "question", "scope" and "evidence". The admission step prunes duplicates, anything past the depth or fan-out caps, and any budget above one the parent recorded.`);
  }

  return `\n\n${lines.join('\n')}`;
}

// Question coverage and source diversity divide by every QUESTION node, so a
// node that closed unanswered would hold both signals down for the rest of the
// run. It is re-kinded to a CLAIM marked closed instead: CLAIM feeds only the
// claim-verification rate, which counts a closed claim as settled.
/**
 * Project frontier nodes into coverage-graph node and edge events.
 *
 * @param {Iterable<Object>} nodes - The store's current node rows.
 * @returns {Object[]} Node events in nodeId order, followed by edge events.
 */
function buildFrontierGraphEvents(nodes) {
  const rows = Array.from(nodes ?? [])
    .filter((row) => isPlainObject(row) && isNonEmptyString(row.nodeId))
    .sort((left, right) => (left.nodeId < right.nodeId ? -1 : left.nodeId > right.nodeId ? 1 : 0));

  const written = new Set();
  const nodeEvents = [];
  const edgeEvents = [];

  for (const row of rows) {
    // A pruned proposal never entered the run, so it never reaches the graph.
    if (row.status === 'pruned') continue;

    const baseMetadata = {
      frontierNodeId: row.nodeId,
      depth: row.depth,
      scope: row.scope,
      status: row.status,
    };
    const closed = UNANSWERED_CLOSE_STATUSES.has(row.status);

    nodeEvents.push({
      type: 'node',
      id: `frontier-${row.nodeId}`,
      kind: closed ? 'CLAIM' : 'QUESTION',
      name: row.question,
      iteration: normalizeIteration(row.iteration),
      metadata: closed
        ? { ...baseMetadata, reason: row.reason, verification_status: 'closed' }
        : baseMetadata,
    });
    written.add(row.nodeId);
  }

  for (const row of rows) {
    if (!written.has(row.nodeId)) continue;
    if (row.parentId === 'root' || !written.has(row.parentId)) continue;
    edgeEvents.push({
      type: 'edge',
      id: `frontier-${row.nodeId}-derived-from-${row.parentId}`,
      sourceId: `frontier-${row.nodeId}`,
      targetId: `frontier-${row.parentId}`,
      relation: 'DERIVED_FROM',
    });
  }

  return nodeEvents.concat(edgeEvents);
}

// The graph upsert parses its events file as one JSON value, so the projection
// is written as a single array rather than one event per line.
function writeFrontierGraph({ artifactDir, output }) {
  const storePath = path.join(artifactDir, NODE_STORE_FILE);
  const events = buildFrontierGraphEvents(readNodeStore(storePath).values());
  const body = `${JSON.stringify(events)}\n`;

  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
  fs.writeFileSync(output, body, 'utf8');

  return {
    nodes: events.filter((event) => event.type === 'node').length,
    edges: events.filter((event) => event.type === 'edge').length,
    output,
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. CLI
// ───────────────────────────────────────────────────────────────────

const VALUE_FLAGS = new Set([
  'artifact-dir',
  'max-iterations-source',
  'iteration',
  'input',
  'known-texts',
  'node-id',
  'status',
  'reason',
  'output',
  'focus',
  'target',
  'dimension',
]);

function parseArgs(argv) {
  const args = { command: null };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith('--')) {
      if (args.command !== null) throw new Error(`unexpected argument: ${token}`);
      args.command = token;
      continue;
    }

    const equals = token.indexOf('=');
    const flag = equals === -1 ? token.slice(2) : token.slice(2, equals);
    if (!VALUE_FLAGS.has(flag)) throw new Error(`unknown option: --${flag}`);
    const key = flag.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    if (equals !== -1) {
      args[key] = token.slice(equals + 1);
      continue;
    }

    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) throw new Error(`--${flag} requires a value`);
    args[key] = next;
    i += 1;
  }

  return args;
}

function requireFlag(args, key, flag) {
  if (typeof args[key] !== 'string' || args[key] === '') throw new Error(`--${flag} is required`);
  return args[key];
}

function parseIterationArg(value) {
  if (value === undefined) return 0;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error('--iteration must be a non-negative integer');
  }
  return parsed;
}

function readJsonFile(filePath, label) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`cannot read ${label} ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
  return parsed;
}

function readKnownTexts(filePath) {
  const parsed = readJsonFile(filePath, 'known-texts file');
  // A malformed known-texts file would silently widen admission, so it is an
  // error rather than a skipped source.
  if (!Array.isArray(parsed)) throw new Error('--known-texts must hold a JSON array');
  return parsed;
}

function readSeedCandidates(filePath) {
  const parsed = readJsonFile(filePath, 'input file');
  if (!Array.isArray(parsed)) throw new Error('--input for seed must hold a JSON array of candidates');
  return parsed;
}

function readProposalRows(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`cannot read input file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const proposals = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let row;
    try {
      row = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (!isPlainObject(row) || row.type !== 'frontier_proposal') continue;
    proposals.push(isPlainObject(row.proposal) ? row.proposal : row);
  }
  return proposals;
}

function runCli(argv) {
  const args = parseArgs(argv);
  const command = args.command;

  if (command !== 'seed' && command !== 'admit' && command !== 'close'
    && command !== 'graph' && command !== 'block') {
    throw new Error(`unknown command: ${command === null ? '(none)' : command}; expected seed, admit, close, graph or block`);
  }

  const artifactDir = requireFlag(args, 'artifactDir', 'artifact-dir');
  const target = assertTarget(args.target === undefined ? 'research' : args.target);

  if (command === 'graph') {
    const output = requireFlag(args, 'output', 'output');
    return writeFrontierGraph({ artifactDir, output });
  }

  // The block is prompt text, so it goes to stdout verbatim rather than through
  // the JSON envelope the record-shaped commands return.
  if (command === 'block') {
    // A review leaf carries its node id, while the research block recovers the
    // node from the focus string the reducer wrote.
    const blockOptions = target === 'review'
      ? { artifactDir, nodeId: requireFlag(args, 'nodeId', 'node-id'), dimension: args.dimension, target }
      : { artifactDir, focus: requireFlag(args, 'focus', 'focus'), target };
    process.stdout.write(renderFrontierBlock(blockOptions));
    return undefined;
  }

  const iteration = parseIterationArg(args.iteration);
  const knownTexts = args.knownTexts === undefined ? [] : readKnownTexts(args.knownTexts);

  if (command === 'seed') {
    const candidates = readSeedCandidates(requireFlag(args, 'input', 'input'));
    const result = seedNodes({
      artifactDir,
      iteration,
      candidates,
      knownTexts,
      target,
      maxIterationsSource: args.maxIterationsSource === undefined ? 'default' : args.maxIterationsSource,
    });
    if (result.derivedMaxIterations !== undefined) {
      process.stderr.write(`[frontier-admit] budget after seed ${result.derivedMaxIterations} iterations, ${result.growthSlots} growth slots${result.warning ? `; warning: ${result.warning}` : ''}\n`);
    }
    return result;
  }

  if (command === 'admit') {
    const proposals = readProposalRows(requireFlag(args, 'input', 'input'));
    return admitProposals({ artifactDir, iteration, proposals, knownTexts, target });
  }

  const nodeId = requireFlag(args, 'nodeId', 'node-id');
  const status = requireFlag(args, 'status', 'status');
  return closeNode({ artifactDir, nodeId, status, reason: args.reason === undefined ? null : args.reason, iteration });
}

/**
 * Run the CLI and exit: 0 on success, 2 on any error.
 *
 * @param {string[]} [argv] - The arguments after the script path.
 * @returns {void}
 */
function main(argv = process.argv.slice(2)) {
  try {
    const result = runCli(argv);
    if (result !== undefined) process.stdout.write(`${JSON.stringify(result)}\n`);
    process.exit(0);
  } catch (error) {
    process.stderr.write(`[frontier-admit] ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(2);
  }
}

if (require.main === module) {
  main();
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  NODE_STATUSES,
  EXPANSIVE_BUDGET_CEILING,
  LOOP_DEFAULT_MAX_ITERATIONS,
  expansiveBudget,
  seedBudget,
  dedupeKey,
  readNodeStore,
  readCaps,
  scopeInsideReviewTarget,
  checkProposal,
  admitProposals,
  seedNodes,
  closeNode,
  renderFrontierBlock,
  buildFrontierGraphEvents,
  main,
};
