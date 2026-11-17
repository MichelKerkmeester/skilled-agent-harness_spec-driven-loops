#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Runtime Upsert Entrypoint
// ───────────────────────────────────────────────────────────────────

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  acquireWriterLock,
  assertKnownFlags,
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  sleepSync,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');

// Every option this entrypoint reads. parseArgs accepts any --key, so without
// this list a misspelled flag would be silently ignored and change what runs.
const UPSERT_FLAGS = [
  'specFolder',
  'loopType',
  'sessionId',
  'events',
  'nodes',
  'edges',
  'seedSource',
  'seedConfidence',
];

if (process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  const child = spawnSync(process.execPath, ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)], {
    cwd: process.cwd(),
    env: require('./runtime-bootstrap.cjs').tsxChildEnv({ DEEP_LOOP_TSX_LOADED: '1' }),
    // The child owns stdin. Reading it here blocks on a pipe that is never
    // closed and throws EAGAIN on a non-blocking one, before any argument is checked.
    stdio: ['inherit', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  process.exit(child.status === null ? 1 : child.status);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) throw inputError(`Unexpected positional argument: ${token}`);
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function ensureString(args, key) {
  if (!args[key] || typeof args[key] !== 'string') throw inputError(`${key} is required`);
  return args[key];
}

function parseJsonValue(value, fallback, label) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    throw inputError(`${label} must be valid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function hasNodeSeedMetadata(node) {
  return node
    && typeof node === 'object'
    && (hasOwn(node, 'seedSource')
      || hasOwn(node, 'seed_source')
      || hasOwn(node, 'seedConfidence')
      || hasOwn(node, 'seed_confidence'));
}

function parseSeedOptions(args, rawNodes) {
  const hasSeedSource = args.seedSource !== undefined;
  const hasSeedConfidence = args.seedConfidence !== undefined;
  const hasInlineSeedMetadata = Array.isArray(rawNodes) && rawNodes.some(hasNodeSeedMetadata);
  const isSeedPath = hasSeedSource || hasSeedConfidence || hasInlineSeedMetadata;
  if (!isSeedPath) return null;
  if (!hasSeedSource || !hasSeedConfidence) {
    throw inputError('seedSource and seedConfidence are required for seeding');
  }
  if (typeof args.seedSource !== 'string' || args.seedSource.trim().length === 0) {
    throw inputError('seedSource must be a non-empty string');
  }
  if (typeof args.seedConfidence !== 'string') {
    throw inputError('seedConfidence must be a number between 0 and 1');
  }

  const confidence = Number(args.seedConfidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw inputError('seedConfidence must be a number between 0 and 1');
  }

  return {
    seedSource: args.seedSource.trim(),
    seedConfidence: confidence,
  };
}

function readEvents(arg) {
  if (!arg) return null;
  if (typeof arg !== 'string') throw inputError('--events requires a file path or -');
  let raw;
  try {
    raw = arg === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(path.resolve(arg), 'utf8');
  } catch (error) {
    throw inputError(`events file is unreadable: ${error instanceof Error ? error.message : String(error)}`);
  }
  return parseJsonValue(raw, [], 'events');
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// A review leaf names a dimension with the short prefix it uses locally. The graph keeps
// one id shape, so a prefixed name folds to that shape before a node or edge is stored.
function canonicalReviewDimensionId(id) {
  if (typeof id !== 'string') return id;
  const match = /^(?:dimension:|dim:|dim-)(.+)$/i.exec(id.trim());
  if (!match) return id;
  return `dimension:${match[1].toLowerCase()}`;
}

// A research SOURCE node's quality class comes from where the source lives, never
// from a value the leaf sends, so source diversity rises only when a finding cites
// sources of genuinely different kinds. `classes` is the frozen vocabulary the
// coverage-graph query module exports, so no class name is repeated here.
const DOC_HOST_PREFIXES = ['docs.', 'developer.', 'learn.', 'devdocs.'];
const DOC_HOSTS = new Set(['developer.mozilla.org', 'nodejs.org', 'typescriptlang.org', 'www.typescriptlang.org', 'vitest.dev']);
const DOC_EXTENSIONS = new Set(['.md', '.mdx', '.txt', '.rst']);
const TEST_FILE_PATTERN = /\.(?:test|spec|vitest)\.[cm]?[jt]sx?$/i;
const TEST_DIR_NAMES = new Set(['test', 'tests', '__tests__']);

function classifySourceLocation(value, classes) {
  if (typeof value !== 'string') return classes.UNCLASSIFIED;
  const text = value.trim();
  if (!text) return classes.UNCLASSIFIED;
  if (/^https?:\/\//i.test(text)) {
    let host = '';
    try {
      host = new URL(text).hostname.toLowerCase();
    } catch {
      return classes.EXTERNAL_OTHER;
    }
    const isDocHost = DOC_HOSTS.has(host)
      || DOC_HOST_PREFIXES.some((prefix) => host.startsWith(prefix))
      || host.endsWith('.readthedocs.io');
    return isDocHost ? classes.EXTERNAL_DOC : classes.EXTERNAL_OTHER;
  }
  if (/\s/.test(text)) return classes.UNCLASSIFIED;
  const repoPath = text.replace(/^\.\//, '').replace(/:\d+(?:-\d+)?$/, '');
  const segments = repoPath.split('/').filter(Boolean);
  const fileName = segments[segments.length - 1] || '';
  const extension = path.extname(fileName).toLowerCase();
  if (segments.length < 2 && !extension) return classes.UNCLASSIFIED;
  if (TEST_FILE_PATTERN.test(fileName) || segments.some((segment) => TEST_DIR_NAMES.has(segment))) return classes.REPO_TEST;
  if (extension === '.jsonl' || /ledger/i.test(fileName)) return classes.LEDGER_STATE;
  if (segments[0] === 'specs') return classes.REPO_SPEC;
  if (DOC_EXTENSIONS.has(extension)) return classes.SKILL_DOC;
  return classes.REPO_CODE;
}

// path outranks the label, and the label outranks the id: the first field that
// names a real location decides the class.
function deriveSourceQualityClass(node, classes) {
  for (const candidate of [node.path, node.name, node.label, node.id]) {
    const qualityClass = classifySourceLocation(candidate, classes);
    if (qualityClass !== classes.UNCLASSIFIED) return qualityClass;
  }
  return classes.UNCLASSIFIED;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  assertKnownFlags(args, UPSERT_FLAGS, inputError);
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  const sessionId = validateNamespaceValue(ensureString(args, 'sessionId'), 'sessionId', inputError);
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'context') throw inputError('loopType must be "research", "review", or "context"');

  let db = null;
  let releaseWriterLock = null;
  const cleanup = () => {
    releaseWriterLock?.();
    releaseWriterLock = null;
    db?.closeDb();
  };
  try {
    db = await import('../lib/coverage-graph/coverage-graph-db.ts');
    const { SOURCE_QUALITY_CLASS } = await import('../lib/coverage-graph/coverage-graph-query.ts');
    installSignalHandlers(cleanup);
    maybeThrowTestFault();
    const events = readEvents(args.events);
    const rawNodes = events
      ? events.filter((event) => event && (event.type === 'node' || event.nodeKind || event.kind))
      : parseJsonValue(args.nodes, [], 'nodes');
    const rawEdges = events
      ? events.filter((event) => event && (event.type === 'edge' || event.source || event.sourceId || event.target || event.targetId))
      : parseJsonValue(args.edges, [], 'edges');
    if (!Array.isArray(rawNodes) || !Array.isArray(rawEdges)) throw inputError('nodes and edges must be JSON arrays');
    const seedOptions = parseSeedOptions(args, rawNodes);
    if (rawNodes.length === 0 && rawEdges.length === 0) {
      if (!seedOptions) throw inputError('At least one node or edge must be provided');
    }

    const validationErrors = [];
    const rejectedSelfLoops = [];
    const nodes = [];
    const edges = [];
    // A leaf's own dimension id shape must not add a second node for a dimension the
    // graph already holds. This map carries an old id to the canonical one so an edge
    // that still names the old id lands on the same node.
    const reviewDimensionIds = new Map();

    for (const n of rawNodes) {
      const kind = String(n.kind || n.nodeKind || n.type || '').toUpperCase();
      if (!n.id || typeof n.id !== 'string') {
        validationErrors.push('Node missing required id');
        continue;
      }
      const validKinds = db.VALID_KINDS[loopType];
      if (!validKinds.includes(kind)) {
        validationErrors.push(`Invalid node kind "${kind}" for loop type "${loopType}". Valid: ${validKinds.join(', ')}`);
        continue;
      }
      let nodeId = n.id;
      if (loopType === 'review' && kind === 'DIMENSION') {
        const canonicalId = canonicalReviewDimensionId(n.id);
        if (canonicalId !== n.id) reviewDimensionIds.set(n.id, canonicalId);
        nodeId = canonicalId;
      }
      const name = n.name || n.label || n.id;
      // The derived class overwrites any leaf-supplied quality_class on a research
      // SOURCE node; every other node keeps its metadata as sent.
      const metadata = loopType === 'research' && kind === 'SOURCE'
        ? {
          ...(n.metadata && typeof n.metadata === 'object' ? n.metadata : {}),
          quality_class: deriveSourceQualityClass(n, SOURCE_QUALITY_CLASS),
        }
        : n.metadata;
      const baseNode = {
        id: nodeId,
        specFolder,
        sessionId,
        kind,
        name,
        metadata,
      };
      nodes.push({
        ...baseNode,
        loopType,
        contentHash: n.contentHash,
        iteration: n.iteration,
        seedSource: seedOptions?.seedSource,
        seedConfidence: seedOptions?.seedConfidence,
      });
    }

    const canonicalEdgeEndpoint = (id) => (loopType === 'review'
      ? canonicalReviewDimensionId(reviewDimensionIds.get(id) ?? id)
      : id);
    for (const e of rawEdges) {
      const sourceId = canonicalEdgeEndpoint(e.sourceId || e.source);
      const targetId = canonicalEdgeEndpoint(e.targetId || e.target);
      const relation = String(e.relation || '').toUpperCase();
      if (!e.id || typeof e.id !== 'string') {
        validationErrors.push('Edge missing required id');
        continue;
      }
      if (!sourceId || !targetId) {
        validationErrors.push(`Edge "${e.id}" missing sourceId or targetId`);
        continue;
      }
      if (sourceId === targetId) {
        rejectedSelfLoops.push(e.id);
        continue;
      }
      const validRelations = db.VALID_RELATIONS[loopType];
      if (!validRelations.includes(relation)) {
        validationErrors.push(`Invalid relation "${relation}" for loop type "${loopType}". Valid: ${validRelations.join(', ')}`);
        continue;
      }
      const baseEdge = {
        id: e.id,
        specFolder,
        sessionId,
        sourceId,
        targetId,
        relation,
        weight: db.clampWeight(e.weight ?? 1.0),
        metadata: e.metadata,
      };
      edges.push({
        ...baseEdge,
        loopType,
      });
    }

    const storageDir = db.COVERAGE_GRAPH_DATABASE_DIR;
    releaseWriterLock = acquireWriterLock(path.join(storageDir, '.deep-loop-graph-writer.lock'));
    sleepSync(Number(process.env.DEEP_LOOP_SCRIPT_LOCK_HOLD_MS || 0));
    const result = db.batchUpsert(nodes, edges, seedOptions ?? undefined);
    const namespace = { specFolder, loopType, sessionId };
    const data = {
      insertedNodes: result.insertedNodes,
      insertedEdges: result.insertedEdges,
      rejectedEdges: result.rejectedEdges,
      rejectedSelfLoops,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      warnings: result.warnings?.length ? result.warnings : undefined,
      seed: seedOptions
        ? { source: seedOptions.seedSource, confidence: seedOptions.seedConfidence }
        : undefined,
      namespace,
    };
    jsonOut({
      status: 'ok',
      data,
      graph_nodes_json: nodes,
      graph_edges_json: edges,
      graph_upsert_event_count: nodes.length + edges.length,
    });
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  const code = classifyExitCode(err);
  jsonOut({ status: 'error', error: err instanceof Error ? err.message : String(err), code: err && err.code ? err.code : 'SCRIPT_ERROR' });
  if (code === 1) process.stderr.write(JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n');
  process.exit(code);
});
