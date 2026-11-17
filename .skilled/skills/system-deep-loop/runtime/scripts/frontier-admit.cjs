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

const DEFAULT_MAX_DEPTH = 3;
const DEFAULT_MAX_CHILDREN_PER_NODE = 6;
const DEFAULT_MAX_FRONTIER_NODES = 10;

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

function readCaps(artifactDir) {
  let config = null;
  try {
    config = JSON.parse(fs.readFileSync(path.join(artifactDir, CONFIG_FILE), 'utf8'));
  } catch {
    config = null;
  }

  const source = isPlainObject(config) ? config : {};
  const expansive = isPlainObject(source.expansiveDepth) ? source.expansiveDepth : {};
  const runCap = capValue(expansive.maxFrontierNodes, capValue(source.maxIterations, DEFAULT_MAX_FRONTIER_NODES));

  return {
    maxDepth: capValue(expansive.maxDepth, DEFAULT_MAX_DEPTH),
    maxChildrenPerNode: capValue(expansive.maxChildrenPerNode, DEFAULT_MAX_CHILDREN_PER_NODE),
    maxFrontierNodes: runCap,
  };
}

function checkProposal(proposal, nodes, caps, knownTexts) {
  if (!isPlainObject(proposal)) return 'relevance';

  // 1. relevance
  if (!isNonEmptyString(proposal.evidence)) return 'relevance';
  if (!hasScope(proposal.scope)) return 'relevance';
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
  if (countLiveChildren(nodes, proposal.parentId) >= caps.maxChildrenPerNode) return 'fanout';
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

function admitProposals({ artifactDir, iteration, proposals, knownTexts = [] }) {
  const storePath = path.join(artifactDir, NODE_STORE_FILE);
  const inboxPath = path.join(artifactDir, INBOX_FILE);
  const nodes = readNodeStore(storePath);
  const caps = readCaps(artifactDir);
  const iterationValue = normalizeIteration(iteration);
  const admitted = [];
  const pruned = [];
  const list = Array.isArray(proposals) ? proposals : [];

  for (const proposal of list) {
    const accept = checkProposal(proposal, nodes, caps, knownTexts);
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
    appendJsonlRow(inboxPath, {
      id: nodeId,
      text: proposal.question,
      source: 'frontier',
      origin: 'frontier',
      injectedAtIteration: iterationValue,
    });
    admitted.push(nodeId);
  }

  return { admitted, pruned };
}

function seedNodes({ artifactDir, iteration = 0, candidates, knownTexts = [] }) {
  // Every seeded node sits at depth 1 against the run's synthetic root: the seed
  // sees only the topic, so it cannot justify a deeper placement on its own.
  const proposals = (Array.isArray(candidates) ? candidates : []).map((candidate) => (
    isPlainObject(candidate) ? { ...candidate, parentId: 'root' } : candidate
  ));

  return admitProposals({ artifactDir, iteration, proposals, knownTexts });
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

  if (command !== 'seed' && command !== 'admit' && command !== 'close') {
    throw new Error(`unknown command: ${command === null ? '(none)' : command}; expected seed, admit or close`);
  }

  const artifactDir = requireFlag(args, 'artifactDir', 'artifact-dir');
  const iteration = parseIterationArg(args.iteration);
  const knownTexts = args.knownTexts === undefined ? [] : readKnownTexts(args.knownTexts);

  if (command === 'seed') {
    const candidates = readSeedCandidates(requireFlag(args, 'input', 'input'));
    return seedNodes({ artifactDir, iteration, candidates, knownTexts });
  }

  if (command === 'admit') {
    const proposals = readProposalRows(requireFlag(args, 'input', 'input'));
    return admitProposals({ artifactDir, iteration, proposals, knownTexts });
  }

  const nodeId = requireFlag(args, 'nodeId', 'node-id');
  const status = requireFlag(args, 'status', 'status');
  return closeNode({ artifactDir, nodeId, status, reason: args.reason === undefined ? null : args.reason, iteration });
}

function main(argv = process.argv.slice(2)) {
  try {
    const result = runCli(argv);
    process.stdout.write(`${JSON.stringify(result)}\n`);
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
  checkProposal,
  admitProposals,
  seedNodes,
  closeNode,
  main,
};
