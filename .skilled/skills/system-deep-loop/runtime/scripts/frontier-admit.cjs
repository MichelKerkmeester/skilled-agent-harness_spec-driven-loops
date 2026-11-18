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
// This module is the store's only writer: seed, admit, prune and close all pass
// through it. The admission checks run in one fixed order so the workflow steps
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

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function hasScope(scope) {
  if (typeof scope === 'string') return scope.trim() !== '';
  return Array.isArray(scope) && scope.length > 0;
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

function dedupeKey(text) {
  if (typeof text !== 'string') return '';

  // A leading question id carries no meaning for equivalence, so it is dropped
  // before punctuation collapses. Only id-shaped prefixes qualify: an ordinary
  // word followed by a number and a colon is part of the question.
  return text
    .toLowerCase()
    .replace(/^[a-z]{1,2}[-\s]?\d+(?:[-\s]\d+)*\s*:\s*/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function readNodeStore(storePath) {
  const nodes = new Map();
  if (!fs.existsSync(storePath)) return nodes;

  let content;
  try {
    content = fs.readFileSync(storePath, 'utf8');
  } catch {
    return nodes;
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
  try {
    return JSON.parse(fs.readFileSync(path.join(artifactDir, configFile), 'utf8'));
  } catch {
    return null;
  }
}

function readCaps(artifactDir, target = 'research') {
  const config = readTargetConfig(artifactDir, assertTarget(target));
  const source = isPlainObject(config) ? config : {};
  const expansive = isPlainObject(source.expansiveDepth) ? source.expansiveDepth : {};
  const runCap = capValue(expansive.maxFrontierNodes, capValue(source.maxIterations, DEFAULT_MAX_FRONTIER_NODES));

  const maxChildrenPerNode = capValue(expansive.maxChildrenPerNode, DEFAULT_MAX_CHILDREN_PER_NODE);

  return {
    maxDepth: capValue(expansive.maxDepth, DEFAULT_MAX_DEPTH),
    maxChildrenPerNode,
    maxRootChildren: Math.max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR[target]),
    maxFrontierNodes: runCap,
  };
}

function childCapFor(parentId, caps) {
  return parentId === 'root' && Number.isFinite(caps.maxRootChildren) ? caps.maxRootChildren : caps.maxChildrenPerNode;
}

// A review target is a file list, and only those paths can hold a finding. The
// './' prefix and trailing '/' a caller writes carry no meaning, so both sides
// of the comparison are normalized before containment is tested.
function normalizeTargetPath(value) {
  return value.trim().replace(/^\.\//, '').replace(/\/+$/, '');
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
// those files or a directory holding one.
function scopeInsideTouchedFiles(scope, touchedFiles) {
  const files = (Array.isArray(touchedFiles) ? touchedFiles : splitTargetPaths(touchedFiles))
    .filter((entry) => typeof entry === 'string')
    .map(normalizeTargetPath)
    .filter((entry) => entry !== '');
  if (files.length === 0) return true;

  return scopeEntries(scope).every((entry) => files.some((file) => (
    file === entry || file.startsWith(`${entry}/`) || entry.startsWith(`${file}/`)
  )));
}

function scopeInsideReviewTarget(scope, config) {
  const source = isPlainObject(config) ? config : {};
  // Any target kind other than a file list is described in prose, so there is no
  // path to be outside of and every scope stays relevant.
  if (source.reviewTargetType !== 'files') return true;
  if (typeof source.reviewTarget !== 'string') return true;
  if (isCommitRange(source.reviewTarget)) return scopeInsideTouchedFiles(scope, source.reviewScopeFiles);

  const allowed = splitTargetPaths(source.reviewTarget);
  if (allowed.length === 0) return true;

  return scopeEntries(scope).every((entry) => allowed.some((base) => entry === base || entry.startsWith(`${base}/`)));
}

function checkProposal(proposal, nodes, caps, knownTexts, options = {}) {
  if (!isPlainObject(proposal)) return 'relevance';

  const reviewConfig = isPlainObject(options) ? options.reviewConfig : undefined;

  // 1. relevance
  if (!isNonEmptyString(proposal.evidence)) return 'relevance';
  if (!hasScope(proposal.scope)) return 'relevance';
  // A review run only reads the paths its target names, so a node scoped
  // elsewhere could never be answered by a finding.
  if (reviewConfig !== undefined && !scopeInsideReviewTarget(proposal.scope, reviewConfig)) return 'relevance';
  if (proposal.parentId !== 'root' && !nodes.has(proposal.parentId)) return 'relevance';

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
  if (countLiveNodes(nodes) >= caps.maxFrontierNodes) return 'fanout';

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

function admitProposals({ artifactDir, iteration, proposals, knownTexts = [], target = 'research' }) {
  const mode = assertTarget(target);
  const storePath = path.join(artifactDir, NODE_STORE_FILE);
  const inboxPath = path.join(artifactDir, INBOX_FILE);
  const nodes = readNodeStore(storePath);
  const caps = readCaps(artifactDir, mode);
  // An unreadable review config must not silently widen the relevance check to
  // every path, so it degrades to the no-target object rather than being skipped.
  const reviewOptions = mode === 'review' ? { reviewConfig: readTargetConfig(artifactDir, mode) ?? {} } : {};
  const iterationValue = normalizeIteration(iteration);
  const admitted = [];
  const pruned = [];
  const list = Array.isArray(proposals) ? proposals : [];

  for (const proposal of list) {
    const accept = checkProposal(proposal, nodes, caps, knownTexts, reviewOptions);
    const depth = depthFor(proposal, nodes);
    const nodeId = `F-${depth}-${String(nodes.size + 1).padStart(3, '0')}`;
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

function seedNodes({ artifactDir, iteration = 0, candidates, knownTexts = [], target = 'research' }) {
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
    const nodeId = `F-1-${String(existing.size + 1).padStart(3, '0')}`;
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

  const result = admitProposals({ artifactDir, iteration, proposals, knownTexts, target: mode });

  return { admitted: result.admitted, pruned: [...pruned, ...result.pruned] };
}

function closeNode({ artifactDir, nodeId, status, reason = null, iteration }) {
  if (!CLOSE_STATUSES.has(status)) {
    throw new Error(`unknown close status: ${status}; expected one of ${[...CLOSE_STATUSES].join(', ')}`);
  }

  const storePath = path.join(artifactDir, NODE_STORE_FILE);
  const nodes = readNodeStore(storePath);
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`unknown frontier node: ${nodeId}`);

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
    `Copy the Focus Area line exactly into this iteration record's "focus", so the run can tell which node this iteration worked.`,
  ];

  if (mode === 'review') {
    lines.push(`Set this iteration record's "focus" to "Frontier node ${resolvedId}: ${dimensionLabel}" and add "frontierNodeId":"${resolvedId}" to it, so the run can tell which node this iteration worked.`);
  }

  if (depth >= caps.maxDepth) {
    lines.push('This node is at the depth cap, so do not propose children.');
  } else if (slots === 0) {
    lines.push('This node has no child slots left, so do not propose children.');
  } else if (mode === 'review') {
    lines.push(`You may append up to ${slots} \`frontier_proposal\` rows to this iteration's delta with "parentId":"${resolvedId}", one per sub-target your evidence opened inside this node. Each row needs "question" (what to review), "scope" (paths inside the review target) and "evidence". The admission step prunes duplicates, anything outside the review target and anything past the depth, fan-out or budget caps. Never write review/frontier-nodes.jsonl or a coverage surface yourself.`);
  } else {
    lines.push(`You may append up to ${slots} \`frontier_proposal\` rows to this iteration's delta with "parentId":"${resolvedId}", one per follow-up question your evidence opened inside this node. Each row needs "question", "scope" and "evidence". The admission step prunes duplicates and anything past the depth, fan-out or budget caps.`);
  }

  return `\n\n${lines.join('\n')}`;
}

// Question coverage and source diversity divide by every QUESTION node, so a
// node that closed unanswered would hold both signals down for the rest of the
// run. It is re-kinded to a CLAIM marked closed instead: CLAIM feeds only the
// claim-verification rate, which counts a closed claim as settled.
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
    return seedNodes({ artifactDir, iteration, candidates, knownTexts, target });
  }

  if (command === 'admit') {
    const proposals = readProposalRows(requireFlag(args, 'input', 'input'));
    return admitProposals({ artifactDir, iteration, proposals, knownTexts, target });
  }

  const nodeId = requireFlag(args, 'nodeId', 'node-id');
  const status = requireFlag(args, 'status', 'status');
  return closeNode({ artifactDir, nodeId, status, reason: args.reason === undefined ? null : args.reason, iteration });
}

function main(argv = process.argv.slice(2)) {
  try {
    const result = runCli(argv);
    if (result !== undefined) process.stdout.write(`${JSON.stringify(result)}\n`);
    process.exit(0);
  } catch (error) {
    process.stderr.write(`frontier-admit: ${error instanceof Error ? error.message : String(error)}\n`);
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
