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
  'stateLog',
  'deltaDir',
  'iteration',
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

// A review leaf names a finding node with its own prefix around the finding id. The
// graph keeps one finding node per finding, so `finding-R1-P1-001`, `FIND-R1-P1-001`,
// `node:finding:R1-P1-001` and a bare id this iteration reports all fold onto
// `finding:R1-P1-001`, the id the evidence projection below uses.
function canonicalReviewFindingId(id, iterationFindingIds = new Set()) {
  if (typeof id !== 'string') return id;
  const trimmed = id.trim();
  if (iterationFindingIds.has(trimmed)) return `finding:${trimmed}`;
  const match = /^(?:node:)?(?:finding|find)[:_-](.+)$/i.exec(trimmed);
  return match ? `finding:${match[1]}` : id;
}

// The iteration's own findings are the source of review evidence: each finding with
// a `path:line` ref becomes a FINDING node and an EVIDENCE_FOR edge to the FILE node
// of that path. The evidence-density signal counts those edges per finding, and a
// leaf that sends no graph events would otherwise leave it at zero, so the graph
// could never allow a stop. The delta's finding rows carry the ref the leaf
// contract requires; the state record's findingDetails may leave it out.
function readJsonlRows(filePath, label, required) {
  let raw;
  try {
    raw = fs.readFileSync(path.resolve(filePath), 'utf8');
  } catch (error) {
    if (!required && error && error.code === 'ENOENT') return [];
    throw inputError(`${label} is unreadable: ${error instanceof Error ? error.message : String(error)}`);
  }
  const rows = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line));
    } catch {
      // A torn line carries no finding; the reducer reports corruption separately.
    }
  }
  return rows;
}

function readReviewIterationFindings({ stateLog, deltaDir, iteration }) {
  const byId = new Map();
  const add = (finding) => {
    if (!finding || typeof finding.id !== 'string' || !finding.id.trim()) return;
    const id = finding.id.trim();
    const known = byId.get(id);
    const file = typeof finding.file === 'string' && finding.file.trim() ? finding.file.trim() : null;
    if (!known) byId.set(id, { id, title: finding.title, file });
    else if (!known.file && file) known.file = file;
  };
  if (typeof deltaDir === 'string') {
    const deltaPath = path.join(deltaDir, `iter-${String(iteration).padStart(3, '0')}.jsonl`);
    for (const row of readJsonlRows(deltaPath, 'iteration delta', false)) {
      if (row && row.type === 'finding' && (row.iteration === undefined || Number(row.iteration) === iteration)) add(row);
    }
  }
  if (typeof stateLog === 'string') {
    let record = null;
    for (const row of readJsonlRows(stateLog, 'state log', true)) {
      if (row && row.type === 'iteration' && Number(row.iteration) === iteration) record = row;
    }
    for (const finding of record && Array.isArray(record.findingDetails) ? record.findingDetails : []) add(finding);
  }
  return [...byId.values()];
}

function deriveReviewFindingEvidence(findings, iteration) {
  const nodes = [];
  const edges = [];
  for (const finding of findings) {
    if (!finding || typeof finding.id !== 'string' || !finding.id.trim()) continue;
    const findingId = `finding:${finding.id.trim()}`;
    const ref = typeof finding.file === 'string' ? finding.file.trim() : '';
    const refMatch = /^(.+?)(?::(\d+)(?:-\d+)?)?$/.exec(ref);
    const filePath = refMatch ? refMatch[1].replace(/^\.\//, '') : '';
    const line = refMatch && refMatch[2] ? Number(refMatch[2]) : null;
    nodes.push({
      id: findingId,
      kind: 'FINDING',
      name: typeof finding.title === 'string' && finding.title ? finding.title : finding.id,
      iteration,
      metadata: { finding_id: finding.id.trim(), ...(filePath ? { file: filePath, line } : {}) },
    });
    if (!filePath) continue;
    const fileId = `file:${filePath}`;
    nodes.push({ id: fileId, kind: 'FILE', name: filePath, iteration });
    edges.push({
      id: `evidence:${finding.id.trim()}:${fileId}`,
      relation: 'EVIDENCE_FOR',
      sourceId: findingId,
      targetId: fileId,
      metadata: { derivedFrom: 'findingDetails', ...(line !== null ? { line } : {}) },
    });
  }
  return { nodes, edges };
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
    let derived = { nodes: [], edges: [] };
    let iterationFindingIds = new Set();
    const canonicalFindings = args.stateLog !== undefined || args.deltaDir !== undefined;
    if (canonicalFindings || args.iteration !== undefined) {
      if (loopType !== 'review') throw inputError('--state-log, --delta-dir and --iteration are supported only for loop type "review"');
      if (args.stateLog !== undefined && typeof args.stateLog !== 'string') throw inputError('--state-log requires a path');
      if (args.deltaDir !== undefined && typeof args.deltaDir !== 'string') throw inputError('--delta-dir requires a path');
      if (!canonicalFindings) throw inputError('--iteration needs --state-log or --delta-dir');
      const iteration = Number(args.iteration);
      if (!Number.isInteger(iteration) || iteration < 1) throw inputError('--iteration must be a positive integer');
      const findings = readReviewIterationFindings({ stateLog: args.stateLog, deltaDir: args.deltaDir, iteration });
      iterationFindingIds = new Set(findings.map((finding) => finding.id));
      derived = deriveReviewFindingEvidence(findings, iteration);
    }
    if (rawNodes.length === 0 && rawEdges.length === 0 && derived.nodes.length === 0) {
      if (!seedOptions) throw inputError('At least one node or edge must be provided');
    }

    const validationErrors = [];
    const rejectedSelfLoops = [];
    const nodes = [];
    const edges = [];
    // A leaf's own dimension or finding id shape must not add a second node for one
    // the graph already holds. This map carries an old id to the canonical one so an
    // edge that still names the old id lands on the same node.
    const reviewNodeIds = new Map();

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
        if (canonicalId !== n.id) reviewNodeIds.set(n.id, canonicalId);
        nodeId = canonicalId;
      }
      if (canonicalFindings && kind === 'FINDING') {
        const canonicalId = canonicalReviewFindingId(n.id, iterationFindingIds);
        if (canonicalId !== n.id) reviewNodeIds.set(n.id, canonicalId);
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

    const ns = { specFolder, loopType, sessionId };
    const batchNodeIds = new Set(nodes.map((node) => node.id));
    // A derived node never overwrites one the leaf sent or an earlier iteration stored,
    // so the leaf's own name and metadata stay; only a missing node is declared.
    for (const node of derived.nodes) {
      if (batchNodeIds.has(node.id) || db.getNode(ns, node.id)) continue;
      batchNodeIds.add(node.id);
      nodes.push({ ...node, specFolder, sessionId, loopType });
    }

    const canonicalEdgeEndpoint = (id) => {
      if (loopType !== 'review') return id;
      const mapped = reviewNodeIds.get(id) ?? id;
      return canonicalReviewDimensionId(canonicalFindings ? canonicalReviewFindingId(mapped, iterationFindingIds) : mapped);
    };
    for (const e of [...rawEdges, ...derived.edges]) {
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

    // An edge to a node that neither this batch nor the stored graph declares fails the
    // foreign key and rolls back the whole batch, so it is skipped and reported instead.
    const rejectedOrphanEdges = [];
    const endpointKnown = (id) => batchNodeIds.has(id) || Boolean(db.getNode(ns, id));
    for (let index = edges.length - 1; index >= 0; index -= 1) {
      if (endpointKnown(edges[index].sourceId) && endpointKnown(edges[index].targetId)) continue;
      rejectedOrphanEdges.unshift(edges[index].id);
      edges.splice(index, 1);
    }

    const storageDir = db.COVERAGE_GRAPH_DATABASE_DIR;
    releaseWriterLock = acquireWriterLock(path.join(storageDir, '.deep-loop-graph-writer.lock'));
    sleepSync(Number(process.env.DEEP_LOOP_SCRIPT_LOCK_HOLD_MS || 0));
    const result = db.batchUpsert(nodes, edges, seedOptions ?? undefined);
    const namespace = ns;
    const data = {
      insertedNodes: result.insertedNodes,
      insertedEdges: result.insertedEdges,
      rejectedEdges: result.rejectedEdges,
      rejectedSelfLoops,
      ...(rejectedOrphanEdges.length > 0 ? { rejectedOrphanEdges } : {}),
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
