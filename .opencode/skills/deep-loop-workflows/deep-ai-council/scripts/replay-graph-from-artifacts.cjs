#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Council Graph Replay from Artifacts                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = `Usage:
  node .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs --spec-folder <path> --session-id <id> [--dry-run]

Reads <repo-root>/<spec-folder>/ai-council/ai-council-state.jsonl and replays
the derived graph through:
  node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --loop-type council

The derived payload shape is:
  { "specFolder": "...", "sessionId": "...", "nodes": [...], "edges": [...] }

Use --dry-run to print the derived payload without mutating runtime graph rows.
`;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { specFolder: null, sessionId: null, dryRun: false, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--spec-folder') args.specFolder = argv[++index] || null;
    else if (arg === '--session-id') args.sessionId = argv[++index] || null;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function findRepoRoot(startDir) {
  let current = path.resolve(startDir);
  while (current !== path.dirname(current)) {
    if (
      fs.existsSync(path.join(current, '.opencode'))
      && fs.existsSync(path.join(current, '.opencode', 'skills', 'deep-loop-runtime', 'scripts', 'upsert.cjs'))
    ) return current;
    current = path.dirname(current);
  }
  return path.resolve(startDir);
}

function runtimeUpsertScript(repoRoot) {
  return process.env.DEEP_AI_COUNCIL_REPLAY_UPSERT_SCRIPT
    || path.join(repoRoot, '.opencode', 'skills', 'deep-loop-runtime', 'scripts', 'upsert.cjs');
}

/**
 * Parse a JSONL file into an array of event objects.
 *
 * @param {string} filePath - Path to the JSONL file.
 * @returns {Array<Object>} Parsed event objects.
 * @throws {Error} If a line is malformed JSON or not an object.
 */
function parseJsonl(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const events = [];
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const event = JSON.parse(trimmed);
      if (!event || typeof event !== 'object' || Array.isArray(event)) {
        throw new Error('line is not a JSON object');
      }
      events.push(event);
    } catch (error) {
      throw new Error(`Malformed JSONL at ${filePath}:${index + 1}: ${error.message}`);
    }
  });
  return events;
}

function roundIdFor(value) {
  if (typeof value === 'string' && /^round-\d{3}$/.test(value)) return value;
  const numeric = Number(value || 1);
  if (Number.isInteger(numeric) && numeric > 0) return `round-${String(numeric).padStart(3, '0')}`;
  return String(value || 'round-001').replace(/[^A-Za-z0-9._:-]+/g, '-');
}

function slug(value) {
  return String(value || 'unknown')
    .trim()
    .replace(/[^A-Za-z0-9._:-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'unknown';
}

function eventSessionId(event) {
  return event.session_id || event.sessionId || null;
}

function eventRoundId(event) {
  return roundIdFor(event.round_id || event.roundId || event.round);
}

function eventSeatId(event) {
  return event.seat_id || event.seatId || event.seat || null;
}

function addNode(nodes, node) {
  if (!node.id) return;
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}

function addPendingEdge(edges, edge) {
  if (!edge.id || !edge.sourceId || !edge.targetId || edge.sourceId === edge.targetId) return;
  if (!edges.has(edge.id)) edges.set(edge.id, edge);
}

function graphItems(event) {
  const pairs = [
    ['claims', 'CLAIM'],
    ['claim', 'CLAIM'],
    ['evidence', 'EVIDENCE'],
    ['evidenceItems', 'EVIDENCE'],
    ['disagreements', 'DISAGREEMENT'],
    ['disagreement', 'DISAGREEMENT'],
    ['decisions', 'DECISION'],
    ['decision', 'DECISION'],
    ['recommendations', 'RECOMMENDATION'],
    ['recommendation', 'RECOMMENDATION'],
  ];
  const result = [];
  for (const [key, kind] of pairs) {
    const value = event[key];
    const items = Array.isArray(value) ? value : value ? [value] : [];
    for (const item of items) result.push({ kind, item });
  }
  return result;
}

function itemId(kind, item, index, roundId) {
  if (typeof item === 'string') return `${kind.toLowerCase()}:${slug(item)}`;
  return String(item.id || item.nodeId || item.key || `${kind.toLowerCase()}:${roundId}:${index + 1}`);
}

function itemName(kind, item, id) {
  if (typeof item === 'string') return item;
  return String(item.name || item.title || item.summary || item.text || `${kind} ${id}`);
}

function itemMetadata(item, event) {
  if (typeof item !== 'object' || item === null || Array.isArray(item)) {
    return { sourceEvent: event.event || 'unknown' };
  }
  const {
    id,
    nodeId,
    key,
    name,
    title,
    summary,
    text,
    supports,
    contradicts,
    resolves,
    evidenceFor,
    recommends,
    derivesFrom,
    agreesWith,
    targetId,
    target_id,
    ...rest
  } = item;
  return { sourceEvent: event.event || 'unknown', ...rest };
}

function asTargets(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item)).filter(Boolean);
}

function collectDeclaredEdges(item, sourceId) {
  if (typeof item !== 'object' || item === null || Array.isArray(item)) return [];
  return [
    ['supports', 'SUPPORTS'],
    ['contradicts', 'CONTRADICTS'],
    ['resolves', 'RESOLVES'],
    ['evidenceFor', 'EVIDENCE_FOR'],
    ['recommends', 'RECOMMENDS'],
    ['derivesFrom', 'DERIVES_FROM'],
    ['agreesWith', 'AGREES_WITH'],
    ['targetId', defaultRelationForTarget(item)],
    ['target_id', defaultRelationForTarget(item)],
  ].flatMap(([field, relation]) => asTargets(item[field]).map((targetId) => ({
    sourceId,
    targetId,
    relation,
  })));
}

function defaultRelationForTarget(item) {
  const type = String(item.kind || item.type || '').toUpperCase();
  if (type === 'DISAGREEMENT') return 'CONTRADICTS';
  if (type === 'EVIDENCE') return 'EVIDENCE_FOR';
  if (type === 'RECOMMENDATION') return 'RECOMMENDS';
  if (type === 'CLAIM') return 'SUPPORTS';
  return 'DERIVES_FROM';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derive a council runtime graph payload from a sequence of council state
 * events. Walks every event, creates SESSION/ROUND/SEAT/CLAIM/EVIDENCE/
 * DISAGREEMENT/DECISION/RECOMMENDATION nodes, and adds relationship edges
 * declared in the artifact and inferred from item types.
 *
 * @param {string} specFolder - Spec folder path for namespace isolation.
 * @param {string} sessionId - Council session identifier.
 * @param {Array<Object>} events - Parsed AI council state events from
 *   ai-council-state.jsonl.
 * @returns {{ specFolder: string, sessionId: string, nodes: Array<Object>, edges: Array<Object> }}
 *   Council graph upsert payload.
 */
function derivePayload(specFolder, sessionId, events) {
  const nodes = new Map();
  const edges = new Map();
  const sessionNodeId = `session:${slug(sessionId)}`;

  addNode(nodes, {
    id: sessionNodeId,
    kind: 'SESSION',
    name: `Council session ${sessionId}`,
    artifactPath: 'ai-council/ai-council-state.jsonl',
    metadata: { replayedFrom: 'ai-council-state.jsonl' },
  });

  events.forEach((event, eventIndex) => {
    const explicitSession = eventSessionId(event);
    if (explicitSession && explicitSession !== sessionId) return;

    const roundId = eventRoundId(event);
    const roundNodeId = `round:${roundId}`;
    addNode(nodes, {
      id: roundNodeId,
      kind: 'ROUND',
      name: `Council ${roundId}`,
      artifactPath: 'ai-council/ai-council-state.jsonl',
      roundId,
      metadata: { sourceEvent: event.event || 'unknown', eventIndex },
    });
    addPendingEdge(edges, {
      id: `edge:${roundNodeId}:session`,
      sourceId: roundNodeId,
      targetId: sessionNodeId,
      relation: 'DERIVES_FROM',
      artifactPath: 'ai-council/ai-council-state.jsonl',
      metadata: { sourceEvent: event.event || 'unknown' },
    });

    const seatIds = new Set(asTargets(event.seats));
    const directSeatId = eventSeatId(event);
    if (directSeatId) seatIds.add(String(directSeatId));

    for (const seatId of seatIds) {
      const seatNodeId = `seat:${slug(seatId)}`;
      addNode(nodes, {
        id: seatNodeId,
        kind: 'SEAT',
        name: `Council seat ${seatId}`,
        artifactPath: event.path ? `ai-council/${event.path}` : 'ai-council/ai-council-state.jsonl',
        roundId,
        metadata: { sourceEvent: event.event || 'unknown', status: event.status || null },
      });
      addPendingEdge(edges, {
        id: `edge:${seatNodeId}:${roundNodeId}`,
        sourceId: seatNodeId,
        targetId: roundNodeId,
        relation: 'PARTICIPATES_IN',
        artifactPath: 'ai-council/ai-council-state.jsonl',
        metadata: { sourceEvent: event.event || 'unknown' },
      });
    }

    graphItems(event).forEach(({ kind, item }, itemIndex) => {
      const id = itemId(kind, item, itemIndex, roundId);
      addNode(nodes, {
        id,
        kind,
        name: itemName(kind, item, id),
        artifactPath: event.path ? `ai-council/${event.path}` : 'ai-council/ai-council-state.jsonl',
        roundId,
        metadata: itemMetadata(item, event),
      });

      if (directSeatId) {
        const seatNodeId = `seat:${slug(directSeatId)}`;
        const relation = kind === 'DISAGREEMENT'
          ? 'CONTRADICTS'
          : kind === 'RECOMMENDATION'
            ? 'RECOMMENDS'
            : 'PROPOSES';
        addPendingEdge(edges, {
          id: `edge:${seatNodeId}:${id}:${relation.toLowerCase()}`,
          sourceId: seatNodeId,
          targetId: id,
          relation,
          artifactPath: event.path ? `ai-council/${event.path}` : 'ai-council/ai-council-state.jsonl',
          metadata: { sourceEvent: event.event || 'unknown' },
        });
      }

      for (const declared of collectDeclaredEdges(item, id)) {
        addPendingEdge(edges, {
          id: `edge:${id}:${declared.targetId}:${declared.relation.toLowerCase()}`,
          sourceId: id,
          targetId: declared.targetId,
          relation: declared.relation,
          artifactPath: event.path ? `ai-council/${event.path}` : 'ai-council/ai-council-state.jsonl',
          metadata: { sourceEvent: event.event || 'unknown' },
        });
      }
    });
  });

  const nodeIds = new Set(nodes.keys());
  const validEdges = [...edges.values()].filter((edge) => nodeIds.has(edge.sourceId) && nodeIds.has(edge.targetId));

  return {
    specFolder,
    sessionId,
    nodes: [...nodes.values()],
    edges: validEdges,
  };
}

function runRuntimeUpsert(payload, repoRoot) {
  const scriptPath = runtimeUpsertScript(repoRoot);
  const childEnv = { ...process.env };
  delete childEnv.DEEP_LOOP_TSX_LOADED;
  const child = spawnSync(process.execPath, [
    scriptPath,
    '--spec-folder',
    payload.specFolder,
    '--loop-type',
    'council',
    '--session-id',
    payload.sessionId,
    '--nodes',
    JSON.stringify(payload.nodes),
    '--edges',
    JSON.stringify(payload.edges),
  ], {
    cwd: repoRoot,
    env: childEnv,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);

  const exitCode = child.status === null ? 1 : child.status;
  if (exitCode !== 0) {
    const err = new Error(`Runtime council graph upsert failed with exit code ${exitCode}`);
    err.exitCode = exitCode;
    throw err;
  }

  return exitCode;
}

/**
 * CLI entry point. Parses arguments, reads the AI council state JSONL file,
 * derives a council graph payload, and either writes it to the runtime graph
 * or prints it in dry-run mode.
 *
 * @param {string[]} [argv] - CLI arguments (default: process.argv.slice(2)).
 * @returns {number} Exit code (0 on success, 1 on error).
 */
function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    if (args.help) {
      process.stdout.write(`${USAGE}\n`);
      return 0;
    }
    if (!args.specFolder || !args.sessionId) {
      throw new Error('Missing required --spec-folder <path> and --session-id <id> arguments');
    }

    const repoRoot = findRepoRoot(process.cwd());
    const specFolderPath = path.isAbsolute(args.specFolder)
      ? args.specFolder
      : path.resolve(repoRoot, args.specFolder);
    const statePath = path.join(specFolderPath, 'ai-council', 'ai-council-state.jsonl');
    if (!fs.existsSync(statePath)) {
      throw new Error(`Missing council state file: ${statePath}`);
    }

    const events = parseJsonl(statePath);
    const payload = derivePayload(args.specFolder, args.sessionId, events);
    if (args.dryRun) {
      process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
      return 0;
    }
    return runRuntimeUpsert(payload, repoRoot);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return error && typeof error === 'object' && Number.isInteger(error.exitCode)
      ? error.exitCode
      : 1;
  }
}

if (require.main === module) {
  process.exitCode = main();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  derivePayload,
  parseJsonl,
  runRuntimeUpsert,
  main,
};
