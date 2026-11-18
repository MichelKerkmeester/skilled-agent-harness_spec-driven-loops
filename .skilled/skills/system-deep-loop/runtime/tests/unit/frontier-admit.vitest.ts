// ───────────────────────────────────────────────────────────────────
// MODULE: Frontier Admission Tests
// ───────────────────────────────────────────────────────────────────
//
// The frontier node store is the only place a node's status survives a reduce
// and a resume, and the inbox is the only path that grows the counted question
// set mid-run. So the two facts worth pinning are the ones a caller cannot see
// from the return value alone: which check pruned a proposal, and whether that
// proposal reached the inbox. The checks run in one fixed order, and the first
// failing one names the reason, so each row below leaves a single check broken
// and asserts the reason it produces. The CLI case covers the delta-file read
// that turns ledger rows into proposals.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  computeResearchQuestionCoverageFromData,
  computeResearchSourceDiversityFromData,
} from '../../lib/coverage-graph/coverage-graph-signals.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
const FRONTIER_ADMIT_SCRIPT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'scripts',
  'frontier-admit.cjs',
);

const {
  checkProposal,
  admitProposals,
  seedNodes,
  closeNode,
  renderFrontierBlock,
  readNodeStore,
  buildFrontierGraphEvents,
  readCaps,
} = require(FRONTIER_ADMIT_SCRIPT) as {
  checkProposal: (proposal: unknown, nodes: Map<string, NodeRow>, caps: Caps, knownTexts?: string[]) => string | null;
  admitProposals: (options: {
    artifactDir: string;
    iteration?: number;
    proposals: unknown[];
    knownTexts?: string[];
  }) => AdmissionResult;
  seedNodes: (options: {
    artifactDir: string;
    iteration?: number;
    candidates: unknown[];
    knownTexts?: string[];
  }) => AdmissionResult;
  closeNode: (options: {
    artifactDir: string;
    nodeId: string;
    status: string;
    reason?: string | null;
    iteration?: number;
  }) => NodeRow;
  renderFrontierBlock: (options: { artifactDir: string; focus: string }) => string;
  readNodeStore: (storePath: string) => Map<string, NodeRow>;
  buildFrontierGraphEvents: (nodes: Iterable<NodeRow>) => FrontierGraphEvent[];
  readCaps: (artifactDir: string, target?: string) => Caps;
};

const CONFIG_FILE = 'deep-research-config.json';
const STORE_FILE = 'frontier-nodes.jsonl';
const INBOX_FILE = 'inbox.jsonl';

const CONFIG = {
  maxIterations: 10,
  expansiveDepth: { maxDepth: 3, maxChildrenPerNode: 2, maxFrontierNodes: 5 },
};

const CAPS: Caps = { maxDepth: 3, maxChildrenPerNode: 2, maxFrontierNodes: 5 };

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

type NodeRow = Record<string, unknown>;

interface Caps {
  maxDepth: number;
  maxChildrenPerNode: number;
  maxFrontierNodes: number;
}

interface AdmissionResult {
  admitted: string[];
  pruned: Array<{ nodeId: string; reason: string }>;
}

interface PruneCase {
  label: string;
  reason: string;
  proposal: NodeRow;
  nodes: Map<string, NodeRow>;
  knownTexts: string[];
}

const tempDirs: string[] = [];

function makeArtifactDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-'));
  tempDirs.push(dir);
  writeFileSync(join(dir, CONFIG_FILE), JSON.stringify(CONFIG), 'utf8');
  return dir;
}

function makeProposal(question: string): NodeRow {
  return { parentId: 'root', question, scope: 'runtime/lib', evidence: 'runtime/lib/a.ts:10' };
}

function nodeRow(
  nodeId: string,
  parentId: string | null,
  depth: number,
  question: string,
  extra: NodeRow = {},
): NodeRow {
  return { nodeId, parentId, depth, question, status: 'open', reason: null, iteration: 0, ...extra };
}

function readJsonl(filePath: string): NodeRow[] {
  const content = readFileSync(filePath, 'utf8');
  return content
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as NodeRow);
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 4. ADMISSION CHECKS
// ───────────────────────────────────────────────────────────────────

describe('frontier-admit', () => {
  const pruneCases: PruneCase[] = [
    {
      label: 'evidence is empty',
      reason: 'relevance',
      proposal: { ...makeProposal('which branch does the empty evidence claim'), evidence: '' },
      nodes: new Map(),
      knownTexts: [],
    },
    {
      label: 'parent id is not in the node store',
      reason: 'relevance',
      proposal: { ...makeProposal('which branch would hang off a missing parent'), parentId: 'F-1-999' },
      nodes: new Map(),
      knownTexts: [],
    },
    {
      label: 'question restates a known text',
      reason: 'dedupe',
      proposal: makeProposal('how does the frontier prune'),
      nodes: new Map(),
      knownTexts: ['How does the frontier prune?'],
    },
    {
      label: 'parent already sits at the depth ceiling',
      reason: 'depth',
      proposal: { ...makeProposal('what does the deeper child probe show'), parentId: 'F-3-001' },
      nodes: new Map([
        ['F-3-001', nodeRow('F-3-001', 'root', 3, 'how deep does the tree already go')],
      ]),
      knownTexts: [],
    },
    {
      label: 'parent already has its full child budget',
      reason: 'fanout',
      proposal: makeProposal('which third branch would the fan-out open'),
      nodes: new Map([
        ['F-1-001', nodeRow('F-1-001', 'root', 1, 'the first branch under the root')],
        ['F-1-002', nodeRow('F-1-002', 'root', 1, 'the second branch under the root')],
      ]),
      knownTexts: [],
    },
    {
      label: 'child claims more budget than its parent',
      reason: 'budget',
      proposal: { ...makeProposal('which probe would spend the wider budget'), parentId: 'F-1-001', budget: 5 },
      nodes: new Map([
        ['F-1-001', nodeRow('F-1-001', 'root', 1, 'how much budget does the parent hold', { budget: 2 })],
      ]),
      knownTexts: [],
    },
    {
      label: 'parent chain loops back on itself',
      reason: 'cycle',
      proposal: { ...makeProposal('which branch closes the loop'), parentId: 'A' },
      nodes: new Map([
        ['A', nodeRow('A', 'B', 1, 'the first node in the loop')],
        ['B', nodeRow('B', 'A', 1, 'the second node in the loop')],
      ]),
      knownTexts: [],
    },
  ];

  it.each(pruneCases)('prunes with $reason when that check fails first', ({ label, reason, proposal, nodes, knownTexts }) => {
    expect(checkProposal(proposal, nodes, CAPS, knownTexts), label).toBe(reason);
  });

  it('reports relevance ahead of dedupe when both would fail', () => {
    const proposal = { ...makeProposal('how does the frontier prune'), evidence: '' };

    expect(checkProposal(proposal, new Map(), CAPS, ['How does the frontier prune?'])).toBe('relevance');
  });

  it('throws on a config that exists but is not valid JSON, so its caps never widen to the defaults', () => {
    const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-badconfig-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, 'deep-research-config.json'), '{"expansiveDepth": {"maxDepth": 1', 'utf8');

    expect(() => seedNodes({ artifactDir: dir, iteration: 0, candidates: [makeProposal('which seed holds')] }))
      .toThrow(/cannot read deep-research-config\.json/);
  });

  it('names relevance for a proposal whose parent admission already pruned', () => {
    const proposal = { ...makeProposal('which child would hang off the rejected branch'), parentId: 'F-1-001' };
    const nodes = new Map([
      ['F-1-001', nodeRow('F-1-001', 'root', 1, 'the branch admission rejected', { status: 'pruned' })],
    ]);

    expect(checkProposal(proposal, nodes, CAPS, [])).toBe('relevance');
  });

  it('names relevance, not dedupe, for a proposal that carries no question', () => {
    const { question: _omitted, ...proposal } = makeProposal('which question went missing');

    expect(checkProposal(proposal, new Map(), CAPS, [])).toBe('relevance');
    expect(checkProposal({ ...proposal, question: '   ' }, new Map(), CAPS, [])).toBe('relevance');
  });

  it('admits a valid proposal: one inbox row with origin frontier and one open store row', () => {
    const artifactDir = makeArtifactDir();

    const { admitted, pruned } = admitProposals({
      artifactDir,
      iteration: 2,
      proposals: [makeProposal('what does the admitted probe show')],
    });

    expect(pruned).toEqual([]);
    expect(admitted).toHaveLength(1);

    const nodeId = admitted[0];
    const inboxRows = readJsonl(join(artifactDir, INBOX_FILE));
    expect(inboxRows).toHaveLength(1);
    expect(inboxRows[0]).toMatchObject({
      id: nodeId,
      source: 'frontier',
      origin: 'frontier',
      injectedAtIteration: 2,
    });

    const node = readNodeStore(join(artifactDir, STORE_FILE)).get(nodeId);
    expect(node?.status).toBe('open');
    expect(node?.depth).toBe(1);
  });

  it('stores an admitted budget, so a child that claims more than its parent prunes on budget', () => {
    const artifactDir = makeArtifactDir();
    const first = admitProposals({
      artifactDir,
      iteration: 1,
      proposals: [{ ...makeProposal('which branch holds a narrow budget'), budget: 2 }],
    });
    const parentId = first.admitted[0];
    expect(readNodeStore(join(artifactDir, STORE_FILE)).get(parentId)?.budget).toBe(2);

    const { admitted, pruned } = admitProposals({
      artifactDir,
      iteration: 2,
      proposals: [{ ...makeProposal('which follow-up would spend the wider budget'), parentId, budget: 5 }],
    });

    expect(admitted).toEqual([]);
    expect(pruned).toEqual([expect.objectContaining({ reason: 'budget' })]);
  });

  it('drops an id-shaped question prefix but keeps an ordinary word, number and colon', () => {
    const { dedupeKey } = require(FRONTIER_ADMIT_SCRIPT) as { dedupeKey: (text: string) => string };
    expect(dedupeKey('Q3: which seed holds')).toBe('which seed holds');
    expect(dedupeKey('F-1-001: which seed holds')).toBe('which seed holds');
    expect(dedupeKey('We 2: how does the loop stop')).toBe('we 2 how does the loop stop');
  });

  it('records a pruned proposal in the store without an inbox row', () => {
    const artifactDir = makeArtifactDir();
    const question = 'how does the frontier hand off a duplicate';

    const { admitted, pruned } = admitProposals({
      artifactDir,
      iteration: 1,
      proposals: [makeProposal(question), makeProposal(question)],
    });

    expect(admitted).toHaveLength(1);
    expect(pruned).toHaveLength(1);
    expect(pruned[0].reason).toBe('dedupe');
    expect(readJsonl(join(artifactDir, INBOX_FILE))).toHaveLength(1);

    const prunedRows = readJsonl(join(artifactDir, STORE_FILE)).filter((row) => row.status === 'pruned');
    expect(prunedRows).toHaveLength(1);
    expect(prunedRows[0].nodeId).toBe(pruned[0].nodeId);
  });

  it('seedNodes forces root parents', () => {
    const artifactDir = makeArtifactDir();
    const candidate = { ...makeProposal('what does the seeded probe show'), parentId: 'F-9-999' };

    const { admitted } = seedNodes({ artifactDir, iteration: 0, candidates: [candidate] });

    expect(admitted).toHaveLength(1);
    const node = readNodeStore(join(artifactDir, STORE_FILE)).get(admitted[0]);
    expect(node?.parentId).toBe('root');
    expect(node?.depth).toBe(1);
  });

  it('seedNodes seeds a run once and skips a second decomposition', () => {
    const artifactDir = makeArtifactDir();
    const first = seedNodes({ artifactDir, iteration: 0, candidates: [makeProposal('which gate fires the policy')] });
    expect(first.admitted).toHaveLength(1);

    const second = seedNodes({ artifactDir, iteration: 0, candidates: [makeProposal('what decides when the policy fires')] });

    expect(second).toEqual({ admitted: [], pruned: [], skipped: 'already-seeded' });
    expect(readNodeStore(join(artifactDir, STORE_FILE)).size).toBe(1);
  });

  it.skipIf(process.getuid?.() === 0)('throws on a node store it cannot read, so a seeded run is never re-seeded', () => {
    const artifactDir = makeArtifactDir();
    seedNodes({ artifactDir, iteration: 0, candidates: [makeProposal('which gate fires the policy')] });
    const storePath = join(artifactDir, STORE_FILE);
    chmodSync(storePath, 0o200);
    try {
      expect(() => readNodeStore(storePath)).toThrow(/cannot read node store/);
    } finally {
      chmodSync(storePath, 0o600);
    }
  });

  it('closeNode appends a terminal row and the last row wins', () => {
    const artifactDir = makeArtifactDir();
    const storePath = join(artifactDir, STORE_FILE);
    const { admitted } = admitProposals({
      artifactDir,
      iteration: 1,
      proposals: [makeProposal('what does the closed probe show')],
    });
    const nodeId = admitted[0];

    closeNode({ artifactDir, nodeId, status: 'exhausted', reason: 'budget', iteration: 3 });

    const node = readNodeStore(storePath).get(nodeId);
    expect(node?.status).toBe('exhausted');
    expect(node?.reason).toBe('budget');
    expect(readJsonl(storePath)).toHaveLength(2);
  });

  it('closeNode rejects an unknown node and a bad status', () => {
    const artifactDir = makeArtifactDir();
    const { admitted } = admitProposals({
      artifactDir,
      iteration: 1,
      proposals: [makeProposal('what does the rejected close probe show')],
    });

    expect(() => closeNode({ artifactDir, nodeId: 'F-9-999', status: 'answered', iteration: 1 }))
      .toThrow(/unknown frontier node/);
    expect(() => closeNode({ artifactDir, nodeId: admitted[0], status: 'open', iteration: 1 }))
      .toThrow(/unknown close status/);
  });

  it('the CLI admit command reads frontier_proposal rows from a delta file', () => {
    const artifactDir = makeArtifactDir();
    const deltaPath = join(artifactDir, 'delta.jsonl');
    writeFileSync(
      deltaPath,
      [
        JSON.stringify({ type: 'iteration', iteration: 1 }),
        JSON.stringify({ type: 'frontier_proposal', ...makeProposal('what does the cli admitted probe show') }),
      ].join('\n'),
      'utf8',
    );

    const result = spawnSync(process.execPath, [
      FRONTIER_ADMIT_SCRIPT,
      'admit',
      '--artifact-dir',
      artifactDir,
      '--iteration',
      '1',
      '--input',
      deltaPath,
    ], { encoding: 'utf8' });

    expect(result.status).toBe(0);
    const output = JSON.parse(String(result.stdout).trim()) as AdmissionResult;
    expect(output.admitted).toHaveLength(1);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. GRAPH PROJECTION
// ───────────────────────────────────────────────────────────────────

interface FrontierGraphNodeEvent {
  type: 'node';
  id: string;
  kind: string;
  name: unknown;
  iteration: number;
  metadata: Record<string, unknown>;
}

interface FrontierGraphEdgeEvent {
  type: 'edge';
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
}

type FrontierGraphEvent = FrontierGraphNodeEvent | FrontierGraphEdgeEvent;

describe('frontier graph close rule', () => {
  const BASE_NODES = [
    { id: 'q-base', kind: 'QUESTION' },
    { id: 'f1', kind: 'FINDING' },
    { id: 'f2', kind: 'FINDING' },
    { id: 's1', kind: 'SOURCE' },
    { id: 's2', kind: 'SOURCE' },
  ];

  const BASE_EDGES = [
    { id: 'e1', sourceId: 'f1', targetId: 'q-base', relation: 'ANSWERS' },
    { id: 'e2', sourceId: 'f2', targetId: 'q-base', relation: 'ANSWERS' },
    { id: 'e3', sourceId: 'f1', targetId: 's1', relation: 'CITES' },
    { id: 'e4', sourceId: 'f2', targetId: 's2', relation: 'CITES' },
  ];

  const openRow: NodeRow = {
    nodeId: 'F-1-001',
    parentId: 'root',
    depth: 1,
    scope: 'lib',
    question: 'A?',
    status: 'open',
    reason: null,
    iteration: 1,
  };

  const prunedRow: NodeRow = {
    nodeId: 'F-2-002',
    parentId: 'F-1-001',
    depth: 2,
    scope: 'lib',
    question: 'B?',
    status: 'pruned',
    reason: 'depth',
    iteration: 1,
  };

  function withEvents(events: FrontierGraphEvent[]): { nodes: NodeRow[]; edges: NodeRow[] } {
    const nodes: NodeRow[] = [...BASE_NODES];
    const edges: NodeRow[] = [...BASE_EDGES];

    for (const event of events) {
      if (event.type === 'node') {
        nodes.push({ id: event.id, kind: event.kind, metadata: JSON.stringify(event.metadata) });
        continue;
      }
      edges.push({
        id: event.id,
        sourceId: event.sourceId,
        targetId: event.targetId,
        relation: event.relation,
      });
    }

    return { nodes, edges };
  }

  function nodeEventsOf(events: FrontierGraphEvent[]): FrontierGraphNodeEvent[] {
    return events.filter((event): event is FrontierGraphNodeEvent => event.type === 'node');
  }

  it('never writes a pruned node', () => {
    const events = buildFrontierGraphEvents([openRow, prunedRow]);

    const nodeEvents = nodeEventsOf(events);
    expect(nodeEvents).toHaveLength(1);
    expect(nodeEvents[0]).toMatchObject({ id: 'frontier-F-1-001', kind: 'QUESTION' });
    expect(events.filter((event) => event.type === 'edge')).toHaveLength(0);
  });

  it('an open frontier QUESTION lowers coverage until it closes', () => {
    const baseCoverage = computeResearchQuestionCoverageFromData(BASE_NODES, BASE_EDGES);
    const graph = withEvents(buildFrontierGraphEvents([openRow]));

    expect(computeResearchQuestionCoverageFromData(graph.nodes, graph.edges)).toBeLessThan(baseCoverage);
  });

  it('an exhausted node is re-kinded so coverage and source diversity return to the base values', () => {
    const events = buildFrontierGraphEvents([{ ...openRow, status: 'exhausted', reason: 'stuck' }]);

    const [nodeEvent] = nodeEventsOf(events);
    expect(nodeEvent.kind).toBe('CLAIM');
    expect(nodeEvent.metadata.verification_status).toBe('closed');

    const graph = withEvents(events);
    expect(computeResearchQuestionCoverageFromData(graph.nodes, graph.edges))
      .toBe(computeResearchQuestionCoverageFromData(BASE_NODES, BASE_EDGES));
    expect(computeResearchSourceDiversityFromData(graph.nodes, graph.edges))
      .toBe(computeResearchSourceDiversityFromData(BASE_NODES, BASE_EDGES));
  });

  it('links a child to its parent with DERIVED_FROM', () => {
    const childRow: NodeRow = {
      nodeId: 'F-2-003',
      parentId: 'F-1-001',
      depth: 2,
      scope: 'lib',
      question: 'C?',
      status: 'open',
      reason: null,
      iteration: 2,
    };

    const events = buildFrontierGraphEvents([openRow, childRow]);

    expect(events).toContainEqual({
      type: 'edge',
      id: 'frontier-F-2-003-derived-from-F-1-001',
      sourceId: 'frontier-F-2-003',
      targetId: 'frontier-F-1-001',
      relation: 'DERIVED_FROM',
    });
  });

  it('the graph CLI writes one JSON array the graph upsert can parse', () => {
    const artifactDir = makeArtifactDir();
    const { admitted } = admitProposals({
      artifactDir,
      iteration: 1,
      proposals: [makeProposal('what does the graph projection show')],
    });
    expect(admitted).toHaveLength(1);

    const outputPath = join(artifactDir, 'frontier-graph-events.json');
    const result = spawnSync(process.execPath, [
      FRONTIER_ADMIT_SCRIPT,
      'graph',
      '--artifact-dir',
      artifactDir,
      '--output',
      outputPath,
    ], { encoding: 'utf8' });

    expect(result.status).toBe(0);
    const summary = JSON.parse(String(result.stdout).trim()) as { nodes: number; output: string };
    expect(summary.nodes).toBe(1);

    const events = JSON.parse(readFileSync(outputPath, 'utf8')) as Array<{ kind?: string }>;
    expect(Array.isArray(events)).toBe(true);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('QUESTION');
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. FRONTIER BLOCK
// ───────────────────────────────────────────────────────────────────

describe('frontier block', () => {
  function admitOneProposal(question: string): { artifactDir: string; nodeId: string; focus: string } {
    const artifactDir = makeArtifactDir();
    const { admitted } = admitProposals({ artifactDir, iteration: 1, proposals: [makeProposal(question)] });
    const nodeId = admitted[0];
    return { artifactDir, nodeId, focus: `Frontier node ${nodeId} (depth 1, scope runtime/lib): ${question}` };
  }

  it('renders the slot count admission will enforce on the focused node', () => {
    const { artifactDir, focus } = admitOneProposal('what does the expansively admitted probe show');

    const block = renderFrontierBlock({ artifactDir, focus });

    expect(block.startsWith('\n\nFRONTIER (expansive depth)\nCurrent node: F-1-001 at depth 1 of 3')).toBe(true);
    expect(block).toContain('up to 2 `frontier_proposal` rows');
    expect(block).toContain(`Copy the Focus Area line exactly into this iteration record's "focus"`);
  });

  it('returns an empty block when the focus names no node', () => {
    const artifactDir = makeArtifactDir();

    expect(renderFrontierBlock({
      artifactDir,
      focus: 'Frontier node F-9-999 (depth 1, scope runtime/lib): a question the store never took',
    })).toBe('');
  });

  it('returns an empty block once the focused node has closed', () => {
    const { artifactDir, nodeId, focus } = admitOneProposal('what does the closed frontier probe show');
    closeNode({ artifactDir, nodeId, status: 'exhausted', reason: 'budget', iteration: 2 });

    expect(renderFrontierBlock({ artifactDir, focus })).toBe('');
  });

  it('the block CLI prints the same string as the function', () => {
    const { artifactDir, focus } = admitOneProposal('what does the cli block probe show');

    const result = spawnSync(process.execPath, [
      FRONTIER_ADMIT_SCRIPT,
      'block',
      '--artifact-dir',
      artifactDir,
      '--focus',
      focus,
    ], { encoding: 'utf8' });

    expect(result.status).toBe(0);
    expect(String(result.stdout)).toBe(renderFrontierBlock({ artifactDir, focus }));
  });
});

describe('frontier node cap', () => {
  function capsFor(config: Record<string, unknown>): Caps {
    const dir = mkdtempSync(join(tmpdir(), 'frontier-cap-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, CONFIG_FILE), JSON.stringify(config), 'utf8');
    return readCaps(dir);
  }

  it('defaults to half the iteration budget, leaving iterations for the seeded questions and the stop gates', () => {
    expect(capsFor({ maxIterations: 16, expansiveDepth: { maxFrontierNodes: null } }).maxFrontierNodes).toBe(8);
    expect(capsFor({ maxIterations: 7, expansiveDepth: {} }).maxFrontierNodes).toBe(3);
  });

  it('never drops below one node on a tiny budget', () => {
    expect(capsFor({ maxIterations: 1, expansiveDepth: {} }).maxFrontierNodes).toBe(1);
  });

  it('keeps an explicit cap as an override', () => {
    expect(capsFor({ maxIterations: 16, expansiveDepth: { maxFrontierNodes: 12 } }).maxFrontierNodes).toBe(12);
  });
});

// A defaulted expansive budget is sized from the seed: two iterations per node on
// every level the frontier may still grow, times the iterations one node costs,
// never below the loop default and never above the ceiling. An explicit budget
// always wins, and growthSlots says how many nodes past depth 1 the node cap
// still leaves.
describe('expansive budget sized from the seed', () => {
  const { expansiveBudget } = require(FRONTIER_ADMIT_SCRIPT) as {
    expansiveBudget: (options: {
      target: string;
      seeded: number;
      maxDepth?: number;
      dimensions?: number;
      loopDefault: number;
    }) => number;
  };
  type SeedBudget = AdmissionResult & { derivedMaxIterations: number; growthSlots: number; warning?: string };
  const seedWithBudget = seedNodes as unknown as (options: {
    artifactDir: string;
    iteration?: number;
    candidates: unknown[];
    maxIterationsSource?: string;
  }) => SeedBudget;

  const table: Array<[string, number, number, number, number]> = [
    // target, seeded, dimensions, loopDefault, expected
    ['research', 1, 1, 10, 10],
    ['research', 3, 1, 10, 10],
    ['research', 4, 1, 10, 12],
    ['research', 6, 1, 10, 16],
    ['review', 1, 4, 7, 24],
    ['review', 2, 4, 7, 24],
    ['review', 8, 4, 7, 24],
    ['review', 3, 1, 7, 10],
    ['research', 2, 1, 12, 12],
    // A run or lineage with no seed share runs at its loop default.
    ['review', 0, 4, 7, 7],
    ['research', 0, 1, 10, 10],
    ['review', 0, 4, 12, 12],
  ];

  it.each(table)('%s with %i seeds and %i dimensions over a default of %i gives %i', (target, seeded, dimensions, loopDefault, expected) => {
    expect(expansiveBudget({ target, seeded, maxDepth: 3, dimensions, loopDefault })).toBe(expected);
  });

  function dirWithBudget(maxIterations: number): string {
    const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-budget-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, 'deep-research-config.json'), JSON.stringify({ maxIterations, expansiveDepth: { maxDepth: 3 } }), 'utf8');
    return dir;
  }

  const seeds = (count: number) => Array.from({ length: count }, (_, index) => ({
    parentId: 'root',
    question: `which research seed number ${index + 1} holds`,
    scope: `src/seed-${index + 1}`,
    evidence: `src/seed-${index + 1}/index.ts:1`,
  }));

  it('derives the budget and the growth slots for a defaulted budget', () => {
    const result = seedWithBudget({ artifactDir: dirWithBudget(10), candidates: seeds(6), maxIterationsSource: 'default' });
    expect(result.admitted).toHaveLength(6);
    expect(result.derivedMaxIterations).toBe(16);
    expect(result.growthSlots).toBe(2);
    expect(result.warning).toBeUndefined();
  });

  it('never goes below the loop default', () => {
    const result = seedWithBudget({ artifactDir: dirWithBudget(10), candidates: seeds(1), maxIterationsSource: 'default' });
    expect(result.derivedMaxIterations).toBe(10);
    expect(result.growthSlots).toBe(4);
  });

  it('derives the same node cap at admission as the seed reports, for a numeric-string budget', () => {
    const { seedBudget } = require(FRONTIER_ADMIT_SCRIPT) as {
      seedBudget: (options: { artifactDir: string; target?: string; maxIterationsSource?: string }) => { derivedMaxIterations: number; growthSlots: number };
    };
    const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-budget-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, 'deep-research-config.json'), JSON.stringify({ maxIterations: '16', expansiveDepth: { maxDepth: 3 } }), 'utf8');

    expect(seedBudget({ artifactDir: dir, maxIterationsSource: 'flag' }).derivedMaxIterations).toBe(16);
    expect(readCaps(dir).maxFrontierNodes).toBe(8);
  });

  it('keeps the loop default when admission pruned every seed', () => {
    const { seedBudget } = require(FRONTIER_ADMIT_SCRIPT) as {
      seedBudget: (options: { artifactDir: string; target?: string; maxIterationsSource?: string }) => { derivedMaxIterations: number };
    };
    const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-budget-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 7, expansiveDepth: { maxDepth: 3 } }), 'utf8');
    const pruned = [1, 2].map((index) => nodeRow(`F-1-00${index}`, 'root', 1, `which pruned seed ${index} holds`, { status: 'pruned', reason: 'relevance' }));
    writeFileSync(join(dir, 'frontier-nodes.jsonl'), pruned.map((row) => `${JSON.stringify(row)}\n`).join(''), 'utf8');

    expect(seedBudget({ artifactDir: dir, target: 'review', maxIterationsSource: 'default' }).derivedMaxIterations).toBe(7);
  });

  it('lets an explicit budget win, even below the derived one, and warns when no growth slot is left', () => {
    const result = seedWithBudget({ artifactDir: dirWithBudget(6), candidates: seeds(3), maxIterationsSource: 'flag' });
    expect(result.derivedMaxIterations).toBe(6);
    expect(result.growthSlots).toBe(0);
    expect(result.warning).toMatch(/no growth slot/);
  });
});
