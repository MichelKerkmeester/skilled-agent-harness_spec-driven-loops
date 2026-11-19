// ───────────────────────────────────────────────────────────────────
// MODULE: Frontier Admission Review Target Tests
// ───────────────────────────────────────────────────────────────────
//
// A review run shares the node store with a research run but none of its
// counting: there is no question inbox, and relevance is bounded by the review
// target rather than by an open question set. So the facts worth pinning are the
// ones a caller cannot see from the return value alone: which check pruned a
// proposal, that an admitted node never invents an inbox row, that a seed can
// settle a sub-target before admission runs, and that the block is keyed by node
// id instead of a focus string. Each row below leaves a single check broken and
// asserts the reason it produces, and the CLI case covers the delta-file read
// that turns ledger rows into proposals.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

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
  scopeInsideReviewTarget,
} = require(FRONTIER_ADMIT_SCRIPT) as {
  checkProposal: (
    proposal: unknown,
    nodes: Map<string, NodeRow>,
    caps: Caps,
    knownTexts?: string[],
    options?: { reviewConfig?: NodeRow },
  ) => string | null;
  admitProposals: (options: {
    artifactDir: string;
    iteration?: number;
    proposals: unknown[];
    knownTexts?: string[];
    target?: string;
  }) => AdmissionResult;
  seedNodes: (options: {
    artifactDir: string;
    iteration?: number;
    candidates: unknown[];
    knownTexts?: string[];
    target?: string;
  }) => AdmissionResult;
  closeNode: (options: {
    artifactDir: string;
    nodeId: string;
    status: string;
    reason?: string | null;
    iteration?: number;
  }) => NodeRow;
  renderFrontierBlock: (options: {
    artifactDir: string;
    focus?: string;
    nodeId?: string;
    dimension?: string;
    target?: string;
  }) => string;
  readNodeStore: (storePath: string) => Map<string, NodeRow>;
  scopeInsideReviewTarget: (scope: unknown, config: unknown) => boolean;
};

const CONFIG_FILE = 'deep-research-config.json';
const REVIEW_CONFIG_FILE = 'deep-review-config.json';
const STORE_FILE = 'frontier-nodes.jsonl';
const INBOX_FILE = 'inbox.jsonl';

const CONFIG = {
  maxIterations: 10,
  expansiveDepth: { maxDepth: 3, maxChildrenPerNode: 2, maxFrontierNodes: 5 },
};

const REVIEW_CONFIG = {
  maxIterations: 10,
  reviewTarget: 'src/a, src/b',
  reviewTargetType: 'files',
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
  const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-review-'));
  tempDirs.push(dir);
  writeFileSync(join(dir, CONFIG_FILE), JSON.stringify(CONFIG), 'utf8');
  return dir;
}

function makeReviewArtifactDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-review-'));
  tempDirs.push(dir);
  writeFileSync(join(dir, REVIEW_CONFIG_FILE), JSON.stringify(REVIEW_CONFIG), 'utf8');
  return dir;
}

function makeReviewProposal(question: string): NodeRow {
  return { parentId: 'root', question, scope: 'src/a', evidence: 'src/a/handler.ts:10' };
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
// 4. REVIEW ADMISSION CHECKS
// ───────────────────────────────────────────────────────────────────

describe('frontier-admit review target', () => {
  const pruneCases: PruneCase[] = [
    {
      label: 'evidence is empty',
      reason: 'relevance',
      proposal: { ...makeReviewProposal('which sub-target does the empty evidence claim'), evidence: '' },
      nodes: new Map(),
      knownTexts: [],
    },
    {
      label: 'scope sits outside the review target',
      reason: 'relevance',
      proposal: { ...makeReviewProposal('which sub-target does the out-of-target scope name'), scope: 'lib/x' },
      nodes: new Map(),
      knownTexts: [],
    },
    {
      label: 'question restates a known text',
      reason: 'dedupe',
      proposal: makeReviewProposal('how does the review frontier prune'),
      nodes: new Map(),
      knownTexts: ['How does the review frontier prune?'],
    },
    {
      label: 'parent already sits at the depth ceiling',
      reason: 'depth',
      proposal: { ...makeReviewProposal('what does the deeper review child probe show'), parentId: 'F-3-001' },
      nodes: new Map([
        ['F-3-001', nodeRow('F-3-001', 'root', 3, 'how deep does the review tree already go', { scope: 'src/a' })],
      ]),
      knownTexts: [],
    },
    {
      label: 'parent already has its full child budget',
      reason: 'fanout',
      proposal: makeReviewProposal('which third review branch would the fan-out open'),
      nodes: new Map([
        ['F-1-001', nodeRow('F-1-001', 'root', 1, 'the first review branch under the root', { scope: 'src/a' })],
        ['F-1-002', nodeRow('F-1-002', 'root', 1, 'the second review branch under the root', { scope: 'src/b' })],
      ]),
      knownTexts: [],
    },
    {
      label: 'child claims more budget than its parent',
      reason: 'budget',
      proposal: { ...makeReviewProposal('which review probe would spend the wider budget'), parentId: 'F-1-001', budget: 5 },
      nodes: new Map([
        ['F-1-001', nodeRow('F-1-001', 'root', 1, 'how much budget does the review parent hold', { budget: 2, scope: 'src/a' })],
      ]),
      knownTexts: [],
    },
    {
      label: 'parent chain loops back on itself',
      reason: 'cycle',
      proposal: { ...makeReviewProposal('which review branch closes the loop'), parentId: 'A' },
      nodes: new Map([
        ['A', nodeRow('A', 'B', 1, 'the first review node in the loop', { scope: 'src/a' })],
        ['B', nodeRow('B', 'A', 1, 'the second review node in the loop', { scope: 'src/b' })],
      ]),
      knownTexts: [],
    },
  ];

  it.each(pruneCases)('prunes with $reason when that check fails first', ({ label, reason, proposal, nodes, knownTexts }) => {
    expect(checkProposal(proposal, nodes, CAPS, knownTexts, { reviewConfig: REVIEW_CONFIG }), label).toBe(reason);
  });

  it('leaves the scope test unchanged when no review config is passed', () => {
    const proposal = { ...makeReviewProposal('which branch reads a path no target names'), scope: 'lib/x' };

    expect(checkProposal(proposal, new Map(), CAPS, [])).toBeNull();
  });

  it('normalizes ./ and trailing slashes on both sides of the review target test', () => {
    const config = { reviewTargetType: 'files', reviewTarget: 'src/a, src/b' };

    expect(scopeInsideReviewTarget('./src/a/', config)).toBe(true);
    expect(scopeInsideReviewTarget('src/a/handler.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget(['src/a', 'src/b/deep/file.ts'], config)).toBe(true);
    expect(scopeInsideReviewTarget('src/a-other', config)).toBe(false);
    expect(scopeInsideReviewTarget('lib/x', config)).toBe(false);
  });

  it('resolves .. segments before testing containment, so a path that climbs out is outside', () => {
    const config = { reviewTargetType: 'files', reviewTarget: 'src/app' };

    expect(scopeInsideReviewTarget('src/app/../../lib/x.ts', config)).toBe(false);
    expect(scopeInsideReviewTarget('src/app/../app-other/x.ts', config)).toBe(false);
    expect(scopeInsideReviewTarget('src/app/../app/x.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget('src/app/./deep//x.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget('.', config)).toBe(false);
  });

  it('reads a . or ./ target as the repo root, which holds every path that does not climb out', () => {
    for (const reviewTarget of ['.', './']) {
      const config = { reviewTargetType: 'files', reviewTarget };

      expect(scopeInsideReviewTarget('src/a.ts', config), reviewTarget).toBe(true);
      expect(scopeInsideReviewTarget(['.', 'lib/x'], config), reviewTarget).toBe(true);
      expect(scopeInsideReviewTarget('../x', config), reviewTarget).toBe(false);
      expect(scopeInsideReviewTarget('src/../../x', config), reviewTarget).toBe(false);
    }
  });

  it('reads a ./ scope as the repo root, which a ./src target does not hold', () => {
    const config = { reviewTargetType: 'files', reviewTarget: './src' };

    expect(scopeInsideReviewTarget('src/a.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget('./src/a.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget('./', config)).toBe(false);
    expect(scopeInsideReviewTarget('lib/a.ts', config)).toBe(false);
  });

  it('tests a glob target against the directory before its first glob segment', () => {
    const config = { reviewTargetType: 'files', reviewTarget: 'src/**/*.ts, docs/a*.md' };

    expect(scopeInsideReviewTarget('src/a.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget('src/deep/b.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget('docs/abc.md', config)).toBe(true);
    expect(scopeInsideReviewTarget('lib/a.ts', config)).toBe(false);
    expect(scopeInsideReviewTarget('src-other/a.ts', config)).toBe(false);
    expect(scopeInsideReviewTarget('lib/a.ts', { reviewTargetType: 'files', reviewTarget: '**/*.ts' })).toBe(true);
    expect(scopeInsideReviewTarget('../a.ts', { reviewTargetType: 'files', reviewTarget: '**/*.ts' })).toBe(false);
  });

  it('seeds a glob-target review instead of pruning every seed as irrelevant', () => {
    const artifactDir = makeReviewArtifactDir();
    writeFileSync(
      join(artifactDir, REVIEW_CONFIG_FILE),
      JSON.stringify({ ...REVIEW_CONFIG, reviewTarget: 'src/**/*.ts' }),
      'utf8',
    );
    const result = seedNodes({
      artifactDir,
      target: 'review',
      candidates: [
        { question: 'Does a.ts leak a handle?', evidence: 'src/a.ts:1', scope: 'src/a.ts' },
        { question: 'Does b.ts race on its lock?', evidence: 'src/b.ts:1', scope: ['src/b.ts'] },
      ],
    });

    expect(result.admitted).toHaveLength(2);
  });

  it('keeps every scope relevant when the target is not a file list', () => {
    const config = { reviewTargetType: 'skill', reviewTarget: 'the review skill' };

    expect(scopeInsideReviewTarget('lib/anything', config)).toBe(true);
    expect(scopeInsideReviewTarget(['lib/x', 'src/z'], config)).toBe(true);
  });

  it('admits a review proposal into the store and creates no inbox', () => {
    const artifactDir = makeReviewArtifactDir();

    const { admitted, pruned } = admitProposals({
      artifactDir,
      iteration: 2,
      proposals: [makeReviewProposal('what does the admitted review probe show')],
      target: 'review',
    });

    expect(pruned).toEqual([]);
    expect(admitted).toHaveLength(1);

    const rows = readJsonl(join(artifactDir, STORE_FILE));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ nodeId: admitted[0], status: 'open', depth: 1, iteration: 2 });
    expect(existsSync(join(artifactDir, INBOX_FILE))).toBe(false);
  });

  it('seeds a review run, settling a candidate that carries its own prune reason', () => {
    const artifactDir = makeReviewArtifactDir();
    const candidates = [
      { ...makeReviewProposal('how does the merged duplicate close'), pruneReason: 'merge-no-own-diff' },
      makeReviewProposal('what does the first seeded review probe show'),
      makeReviewProposal('what does the second seeded review probe show'),
    ];

    const { admitted, pruned } = seedNodes({ artifactDir, iteration: 0, candidates, target: 'review' });

    expect(admitted).toHaveLength(2);
    expect(pruned).toEqual([{ nodeId: expect.any(String), reason: 'merge-no-own-diff' }]);

    const rows = readJsonl(join(artifactDir, STORE_FILE));
    const prunedRows = rows.filter((row) => row.status === 'pruned');
    expect(prunedRows).toHaveLength(1);
    expect(prunedRows[0]).toMatchObject({ depth: 1, parentId: 'root', reason: 'merge-no-own-diff' });

    const openRows = rows.filter((row) => row.status === 'open');
    expect(openRows).toHaveLength(2);
    for (const row of openRows) expect(row.depth).toBe(1);
    expect(existsSync(join(artifactDir, INBOX_FILE))).toBe(false);
  });

  it('ignores a prune reason on a research seed', () => {
    const artifactDir = makeArtifactDir();
    const candidates = [
      { ...makeReviewProposal('how does the research seed treat a prune reason'), scope: 'runtime/lib', pruneReason: 'merge-no-own-diff' },
    ];

    const { admitted, pruned } = seedNodes({ artifactDir, iteration: 0, candidates });

    expect(pruned).toEqual([]);
    expect(admitted).toHaveLength(1);
    expect(readJsonl(join(artifactDir, STORE_FILE))).toHaveLength(1);
  });

  it('the CLI admit command reads review proposals from a delta file and writes no inbox', () => {
    const artifactDir = makeReviewArtifactDir();
    const deltaPath = join(artifactDir, 'delta.jsonl');
    writeFileSync(
      deltaPath,
      [
        JSON.stringify({ type: 'iteration', iteration: 1 }),
        JSON.stringify({ type: 'frontier_proposal', ...makeReviewProposal('what does the cli review probe show') }),
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
      '--target',
      'review',
      '--input',
      deltaPath,
    ], { encoding: 'utf8' });

    expect(result.status).toBe(0);
    const output = JSON.parse(String(result.stdout).trim()) as AdmissionResult;
    expect(output.admitted).toHaveLength(1);
    expect(readJsonl(join(artifactDir, STORE_FILE))).toHaveLength(1);
    expect(existsSync(join(artifactDir, INBOX_FILE))).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. REVIEW ROOT CAP AND COMMIT-RANGE SCOPE
// ───────────────────────────────────────────────────────────────────

describe('frontier-admit review root cap and commit-range scope', () => {
  // A fan-out parent seeds before any config is written, so these run with none.
  function makeBareArtifactDir(): string {
    const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-review-bare-'));
    tempDirs.push(dir);
    return dir;
  }

  function subTargets(count: number): NodeRow[] {
    return Array.from({ length: count }, (_, index) => ({
      question: `what does review sub-target number ${index + 1} hide`,
      scope: `src/part-${index + 1}`,
      evidence: `src/part-${index + 1}/index.ts:1`,
    }));
  }

  const RANGE = 'adedc72e930~100..adedc72e930';
  const RANGE_SCOPE_FILES = [
    '.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md',
    '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json',
  ];

  it('seeds up to eight depth-1 review sub-targets, the top of the documented 3 to 8 range', () => {
    const artifactDir = makeBareArtifactDir();

    const { admitted, pruned } = seedNodes({ artifactDir, iteration: 0, candidates: subTargets(9), target: 'review' });

    expect(admitted).toHaveLength(8);
    expect(pruned).toEqual([{ nodeId: expect.any(String), reason: 'fanout' }]);
  });

  // The run cap is half the iteration budget, so a small budget would otherwise
  // prune most of the seed before any iteration ran; the seed answers only to
  // the root-children cap, and its nodes still count toward later admissions.
  it('admits every depth-1 seed under the root cap even when the run cap is smaller', () => {
    const artifactDir = makeBareArtifactDir();
    writeFileSync(join(artifactDir, REVIEW_CONFIG_FILE), JSON.stringify({ maxIterations: 7 }), 'utf8');

    const { admitted, pruned } = seedNodes({ artifactDir, iteration: 0, candidates: subTargets(8), target: 'review' });

    expect(admitted).toHaveLength(8);
    expect(pruned).toEqual([]);
    const { pruned: childPruned } = admitProposals({
      artifactDir,
      iteration: 1,
      proposals: [{ parentId: admitted[0], question: 'which child opens past the cap', scope: 'src/part-1/a.ts', evidence: 'src/part-1/a.ts:2' }],
      target: 'review',
    });
    expect(childPruned).toEqual([{ nodeId: expect.any(String), reason: 'fanout' }]);
  });

  it('keeps a research seed at its documented six depth-1 nodes', () => {
    const artifactDir = makeBareArtifactDir();

    const { admitted, pruned } = seedNodes({ artifactDir, iteration: 0, candidates: subTargets(7) });

    expect(admitted).toHaveLength(6);
    expect(pruned).toEqual([{ nodeId: expect.any(String), reason: 'fanout' }]);
  });

  it('leaves the per-node children cap in force below the root', () => {
    const artifactDir = makeReviewArtifactDir();
    writeFileSync(
      join(artifactDir, REVIEW_CONFIG_FILE),
      JSON.stringify({ ...REVIEW_CONFIG, expansiveDepth: { ...REVIEW_CONFIG.expansiveDepth, maxFrontierNodes: 20 } }),
      'utf8',
    );
    const { admitted: [parentId] } = seedNodes({
      artifactDir,
      iteration: 0,
      candidates: [makeReviewProposal('which review parent holds the children')],
      target: 'review',
    });
    const children = [1, 2, 3].map((index) => ({
      ...makeReviewProposal(`which review child number ${index} opens`),
      parentId,
      scope: `src/a/child-${index}.ts`,
    }));

    const { admitted, pruned } = admitProposals({ artifactDir, iteration: 1, proposals: children, target: 'review' });

    expect(admitted).toHaveLength(2);
    expect(pruned).toEqual([{ nodeId: expect.any(String), reason: 'fanout' }]);
  });

  it('intersects a commit-range target with the files the range touches', () => {
    const config = { reviewTargetType: 'files', reviewTarget: RANGE, reviewScopeFiles: RANGE_SCOPE_FILES };

    expect(scopeInsideReviewTarget('.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate', config)).toBe(true);
    expect(scopeInsideReviewTarget('./.skilled/skills/system-spec-kit/runtime/cli/retrieval/', config)).toBe(true);
    expect(scopeInsideReviewTarget(RANGE_SCOPE_FILES[0], config)).toBe(true);
    expect(scopeInsideReviewTarget('.skilled/skills/system-spec-kit/changelog', config)).toBe(false);
    expect(scopeInsideReviewTarget(['.skilled/skills/system-spec-kit/runtime/cli/retrieval', 'lib/x'], config)).toBe(false);
    expect(scopeInsideReviewTarget('lib/x', { reviewTargetType: 'files', reviewTarget: RANGE })).toBe(true);
  });

  // An operator writes the range the way a review report names it, with a label
  // around it. The range still decides the scope; its words are not paths.
  it('takes the touched-files path for a range written with surrounding text', () => {
    const config = {
      reviewTargetType: 'files',
      reviewTarget: `commit range ${RANGE} (spec-kit changes, phases 001-014)`,
      reviewScopeFiles: RANGE_SCOPE_FILES,
    };

    expect(scopeInsideReviewTarget('.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate', config)).toBe(true);
    expect(scopeInsideReviewTarget(RANGE_SCOPE_FILES[1], config)).toBe(true);
    expect(scopeInsideReviewTarget('lib/x', config)).toBe(false);
    expect(scopeInsideReviewTarget('commit', config)).toBe(false);
  });

  it('never reads a climbing path as a range', () => {
    const config = { reviewTargetType: 'files', reviewTarget: 'src/a/../b src/c', reviewScopeFiles: ['lib/x'] };

    expect(scopeInsideReviewTarget('src/c/d.ts', config)).toBe(true);
    expect(scopeInsideReviewTarget('lib/x', config)).toBe(false);
  });

  // Slashed refs are the usual way to write a review range, so a slash alone never
  // makes a token a path.
  it.each(['origin/main..HEAD', 'feature/x...main', 'v1.2.0..v1.3.0'])('reads %s as a range', (range) => {
    const config = { reviewTargetType: 'files', reviewTarget: range, reviewScopeFiles: ['lib/x'] };

    expect(scopeInsideReviewTarget('lib/x', config)).toBe(true);
    expect(scopeInsideReviewTarget('src/c', config)).toBe(false);
  });

  // With no touched files on record a range admits every scope, so a real file read
  // as a range would stop narrowing relevance to the file the target names.
  it('reads a file that exists with two dots in its name as a path, not a range', () => {
    const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-review-dots-'));
    tempDirs.push(dir);
    const file = join(dir, 'notes..v2.md');
    writeFileSync(file, '# notes\n', 'utf8');
    const config = { reviewTargetType: 'files', reviewTarget: file };

    expect(scopeInsideReviewTarget(file, config)).toBe(true);
    expect(scopeInsideReviewTarget('lib/x', config)).toBe(false);
  });

  // Accepted: a file target that does not exist on disk has nothing to review, and
  // no lexical rule tells 'docs/notes..v2.md' from a range over slashed refs, so the
  // missing path reads as a range and narrows to the touched files on record.
  it('reads a missing slashed path with two dots in its name as a range', () => {
    const config = { reviewTargetType: 'files', reviewTarget: 'docs/notes..v2.md', reviewScopeFiles: ['lib/x'] };

    expect(scopeInsideReviewTarget('lib/x', config)).toBe(true);
    expect(scopeInsideReviewTarget('docs/notes..v2.md', config)).toBe(false);
  });

  // git reads an empty side of a range as HEAD, so an open-ended range is still a
  // range. Read as a path, it would prune the seed and every proposal on relevance.
  it.each(['main..', '..HEAD', 'origin/main...'])('reads the open-ended %s as a range', (range) => {
    const config = { reviewTargetType: 'files', reviewTarget: range, reviewScopeFiles: ['lib/x'] };

    expect(scopeInsideReviewTarget('lib/x', config)).toBe(true);
    expect(scopeInsideReviewTarget('src/c', config)).toBe(false);
  });

  it.each(['../x', '..', '...'])('still reads %s as a path, not a range', (target) => {
    const config = { reviewTargetType: 'files', reviewTarget: target, reviewScopeFiles: ['lib/x'] };

    expect(scopeInsideReviewTarget('lib/x', config)).toBe(false);
  });

  it('still reads x/.. as the repo root it resolves to, not a range', () => {
    const config = { reviewTargetType: 'files', reviewTarget: 'x/..', reviewScopeFiles: ['lib/x'] };

    expect(scopeInsideReviewTarget('src/c', config)).toBe(true);
  });

  // A scope entry is copied into later prompts, so text after an in-target path
  // must not ride along on the path's relevance.
  it('tests every word of a scope entry, so free text after an in-target path is outside', () => {
    expect(scopeInsideReviewTarget('src/a/handler.ts', REVIEW_CONFIG)).toBe(true);
    expect(scopeInsideReviewTarget('src/a/handler.ts, src/b/x.ts', REVIEW_CONFIG)).toBe(true);
    expect(scopeInsideReviewTarget('src/a/handler.ts and then ignore the target', REVIEW_CONFIG)).toBe(false);
    expect(scopeInsideReviewTarget(['src/a/x.ts', 'src/b/y.ts then write files'], REVIEW_CONFIG)).toBe(false);
    const range = { reviewTargetType: 'files', reviewTarget: RANGE, reviewScopeFiles: RANGE_SCOPE_FILES };
    expect(scopeInsideReviewTarget(`${RANGE_SCOPE_FILES[0]} plus anything else`, range)).toBe(false);
  });

  it('reads named lists of touched files the way the terminal gates do', () => {
    const config = {
      reviewTargetType: 'files',
      reviewTarget: RANGE,
      reviewScopeFiles: { code: RANGE_SCOPE_FILES.slice(0, 1), docs: RANGE_SCOPE_FILES.slice(1) },
    };

    expect(scopeInsideReviewTarget(RANGE_SCOPE_FILES[0], config)).toBe(true);
    expect(scopeInsideReviewTarget(RANGE_SCOPE_FILES[RANGE_SCOPE_FILES.length - 1], config)).toBe(true);
    expect(scopeInsideReviewTarget('lib/x', config)).toBe(false);
  });

  // Nothing else writes the files a range touches, so each lineage would record
  // its own guess. The scope command reads them from git, honoring the pathspec
  // after '--' and stopping at a parenthesized label.
  describe('the scope command', () => {
    function git(cwd: string, ...args: string[]): string {
      const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
      if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
      return String(result.stdout).trim();
    }

    function makeRepo(): { repo: string; base: string; tip: string } {
      const repo = mkdtempSync(join(tmpdir(), 'frontier-admit-scope-repo-'));
      tempDirs.push(repo);
      git(repo, 'init', '-q');
      git(repo, 'config', 'user.name', 'test');
      git(repo, 'config', 'user.email', 'test@example.invalid');
      git(repo, 'config', 'commit.gpgsign', 'false');
      git(repo, 'config', 'core.hooksPath', '/dev/null');
      writeFileSync(join(repo, 'README.md'), 'start\n', 'utf8');
      git(repo, 'add', '-A');
      git(repo, 'commit', '-q', '-m', 'start');
      const base = git(repo, 'rev-parse', 'HEAD');
      for (const dir of ['in', 'out']) {
        spawnSync('mkdir', ['-p', join(repo, dir)]);
        writeFileSync(join(repo, dir, 'a.ts'), 'export {};\n', 'utf8');
      }
      writeFileSync(join(repo, 'README.md'), 'changed\n', 'utf8');
      git(repo, 'add', '-A');
      git(repo, 'commit', '-q', '-m', 'change');
      return { repo, base, tip: git(repo, 'rev-parse', 'HEAD') };
    }

    function runScope(repo: string, artifactDir: string) {
      return spawnSync(process.execPath, [
        FRONTIER_ADMIT_SCRIPT, 'scope', '--target', 'review', '--artifact-dir', artifactDir,
      ], { cwd: repo, encoding: 'utf8' });
    }

    function writeConfig(artifactDir: string, reviewTarget: string, reviewScopeFiles: unknown): void {
      writeFileSync(
        join(artifactDir, REVIEW_CONFIG_FILE),
        JSON.stringify({ ...REVIEW_CONFIG, reviewTarget, reviewScopeFiles }),
        'utf8',
      );
    }

    function readConfig(artifactDir: string): Record<string, unknown> {
      return JSON.parse(readFileSync(join(artifactDir, REVIEW_CONFIG_FILE), 'utf8')) as Record<string, unknown>;
    }

    it('replaces a guessed list with the files the range touches inside its pathspec', () => {
      const { repo, base, tip } = makeRepo();
      const artifactDir = makeBareArtifactDir();
      writeConfig(artifactDir, `${base}..${tip} -- in (the inner tree only; out excluded)`, ['in', 'out', 'README.md']);

      const result = runScope(repo, artifactDir);

      expect(result.status, String(result.stderr)).toBe(0);
      expect(readConfig(artifactDir).reviewScopeFiles).toEqual(['in/a.ts']);
    });

    it('splits a range written with commas the way range detection does', () => {
      const { repo, base, tip } = makeRepo();
      const artifactDir = makeBareArtifactDir();
      writeConfig(artifactDir, `${base}..${tip}, -- in, (label)`, []);

      const result = runScope(repo, artifactDir);

      expect(result.status, String(result.stderr)).toBe(0);
      expect(readConfig(artifactDir).reviewScopeFiles).toEqual(['in/a.ts']);
    });

    it('reads every touched file when the range names no pathspec', () => {
      const { repo, base, tip } = makeRepo();
      const artifactDir = makeBareArtifactDir();
      writeConfig(artifactDir, `${base}..${tip}`, []);

      expect(runScope(repo, artifactDir).status).toBe(0);
      expect(readConfig(artifactDir).reviewScopeFiles).toEqual(['README.md', 'in/a.ts', 'out/a.ts']);
    });

    it('leaves a target that is not a commit range untouched', () => {
      const { repo } = makeRepo();
      const artifactDir = makeBareArtifactDir();
      writeConfig(artifactDir, 'in, out', ['in/a.ts']);
      const before = readFileSync(join(artifactDir, REVIEW_CONFIG_FILE), 'utf8');

      expect(runScope(repo, artifactDir).status).toBe(0);
      expect(readFileSync(join(artifactDir, REVIEW_CONFIG_FILE), 'utf8')).toBe(before);
    });

    it('fails when git cannot read the range, rather than keeping the guessed list', () => {
      const { repo } = makeRepo();
      const artifactDir = makeBareArtifactDir();
      writeConfig(artifactDir, 'nosuchref..alsomissing', ['guess']);

      const result = runScope(repo, artifactDir);

      expect(result.status).toBe(2);
      expect(readConfig(artifactDir).reviewScopeFiles).toEqual(['guess']);
    });
  });

  it('admits depth-2 proposals a commit-range lineage scoped inside the touched files', () => {
    const artifactDir = makeBareArtifactDir();
    writeFileSync(
      join(artifactDir, REVIEW_CONFIG_FILE),
      JSON.stringify({ ...REVIEW_CONFIG, reviewTarget: RANGE, reviewScopeFiles: RANGE_SCOPE_FILES }),
      'utf8',
    );
    // A lineage store holds the depth-1 node the fan-out runner dealt it, under the parent's id.
    writeFileSync(
      join(artifactDir, STORE_FILE),
      `${JSON.stringify(nodeRow('F-1-077', 'root', 1, 'review the system-spec-kit changes in the range', { scope: ['.skilled/skills/system-spec-kit'] }))}\n`,
      'utf8',
    );
    const proposals = [
      { parentId: 'F-1-077', question: 'does the spec-gate README match the hook', scope: '.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate', evidence: 'spec-gate/README.md:1' },
      { parentId: 'F-1-077', question: 'does the retrieval fixture set match its CLI', scope: '.skilled/skills/system-spec-kit/runtime/cli/retrieval', evidence: 'corpus-manifest.json:1' },
      { parentId: 'F-1-077', question: 'does an untouched library drift', scope: 'lib/x', evidence: 'lib/x/index.ts:1' },
    ];

    const { admitted, pruned } = admitProposals({ artifactDir, iteration: 1, proposals, target: 'review' });

    expect(admitted).toHaveLength(2);
    expect(pruned).toEqual([{ nodeId: expect.any(String), reason: 'relevance' }]);
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. REVIEW FRONTIER BLOCK
// ───────────────────────────────────────────────────────────────────

describe('frontier block review target', () => {
  function admitOneReviewProposal(question: string): { artifactDir: string; nodeId: string } {
    const artifactDir = makeReviewArtifactDir();
    const { admitted } = admitProposals({ artifactDir, iteration: 1, proposals: [makeReviewProposal(question)], target: 'review' });
    return { artifactDir, nodeId: admitted[0] };
  }

  it('renders a review block from the node id, its dimension and the frontierNodeId instruction', () => {
    const { artifactDir, nodeId } = admitOneReviewProposal('what does the review block show');

    const block = renderFrontierBlock({ artifactDir, nodeId, dimension: 'error handling', target: 'review' });

    expect(block.startsWith('\n\nFRONTIER (expansive depth)\nCurrent node: F-1-001 at depth 1 of 3')).toBe(true);
    expect(block).toContain('Review dimension for this node: error handling.');
    expect(block).toContain('Set this iteration record\'s "focus" to "Frontier node F-1-001: error handling"');
    expect(block).toContain('"frontierNodeId":"F-1-001"');
    expect(block).toContain('up to 2 `frontier_proposal` rows');
    expect(block).toContain('Never write review/frontier-nodes.jsonl');
  });

  it('leaves out the research Focus Area instruction, since a review prompt has no Focus Area line', () => {
    const { artifactDir, nodeId } = admitOneReviewProposal('what does the review block leave out');

    const block = renderFrontierBlock({ artifactDir, nodeId, dimension: 'error handling', target: 'review' });

    expect(block).not.toContain('Copy the Focus Area line');
    expect(block.match(/"focus"/g)).toHaveLength(1);
  });

  it('falls back to the dispatched dimension when the caller names none', () => {
    const { artifactDir, nodeId } = admitOneReviewProposal('what does the undimensioned review probe show');

    const block = renderFrontierBlock({ artifactDir, nodeId, target: 'review' });

    expect(block).toContain('Review dimension for this node: the dispatched dimension.');
  });

  it('returns an empty block for an unknown or missing node id', () => {
    const artifactDir = makeReviewArtifactDir();

    expect(renderFrontierBlock({ artifactDir, nodeId: 'F-9-999', dimension: 'error handling', target: 'review' })).toBe('');
    expect(renderFrontierBlock({ artifactDir, target: 'review' })).toBe('');
  });

  it('returns an empty block once the review node has closed', () => {
    const { artifactDir, nodeId } = admitOneReviewProposal('what does the exhausted review block probe show');
    closeNode({ artifactDir, nodeId, status: 'exhausted', reason: 'budget', iteration: 2 });

    expect(renderFrontierBlock({ artifactDir, nodeId, dimension: 'error handling', target: 'review' })).toBe('');
  });
});

// A review node costs one iteration per dimension a node must cover before the
// reducer marks it answered: the canonical four plus any custom names, so its
// derived budget reaches the ceiling fast.
describe('review expansive budget scales with the dimension count', () => {
  type SeedBudget = AdmissionResult & { derivedMaxIterations: number; growthSlots: number };
  const seedWithBudget = seedNodes as unknown as (options: {
    artifactDir: string;
    iteration?: number;
    candidates: unknown[];
    target: string;
    maxIterationsSource?: string;
  }) => SeedBudget;

  function reviewDir(reviewDimensions: string[] | string, maxDepth = 3): string {
    const dir = mkdtempSync(join(tmpdir(), 'frontier-admit-review-budget-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, REVIEW_CONFIG_FILE), JSON.stringify({ maxIterations: 7, reviewDimensions, expansiveDepth: { maxDepth } }), 'utf8');
    return dir;
  }

  const parts = (count: number) => Array.from({ length: count }, (_, index) => ({
    question: `what does review part ${index + 1} hide`,
    scope: `src/part-${index + 1}`,
    evidence: `src/part-${index + 1}/index.ts:1`,
  }));

  it('one configured dimension costs the canonical three it still owes per node', () => {
    const result = seedWithBudget({ artifactDir: reviewDir(['correctness']), candidates: parts(3), target: 'review', maxIterationsSource: 'default' });
    expect(result.derivedMaxIterations).toBe(24);
    expect(result.growthSlots).toBe(9);
  });

  // Depth 1 and one seeded node keep the budget under the ceiling, so the count
  // the budget uses shows: 2 * count * 1 against the loop default of 7. A list
  // without traceability owes three canonical passes, so 2 * 3 falls to the floor.
  it('two canonical dimensions without traceability count as the canonical three', () => {
    const result = seedWithBudget({ artifactDir: reviewDir(['correctness', 'security'], 1), candidates: parts(1), target: 'review', maxIterationsSource: 'default' });
    expect(result.derivedMaxIterations).toBe(7);
  });

  it('a custom dimension adds one to the canonical dimensions owed', () => {
    const result = seedWithBudget({ artifactDir: reviewDir(['correctness', 'security', 'performance'], 1), candidates: parts(1), target: 'review', maxIterationsSource: 'default' });
    expect(result.derivedMaxIterations).toBe(8);
    const traced = seedWithBudget({ artifactDir: reviewDir(['correctness', 'traceability', 'performance'], 1), candidates: parts(1), target: 'review', maxIterationsSource: 'default' });
    expect(traced.derivedMaxIterations).toBe(10);
  });

  it('counts a repeated or differently cased name, and all, once', () => {
    const result = seedWithBudget({ artifactDir: reviewDir('Performance, performance, CORRECTNESS, all', 1), candidates: parts(1), target: 'review', maxIterationsSource: 'default' });
    expect(result.derivedMaxIterations).toBe(10);
  });

  it('four dimensions hit the ceiling of 24 from the first seed', () => {
    const one = seedWithBudget({ artifactDir: reviewDir(['correctness', 'security', 'traceability', 'maintainability']), candidates: parts(1), target: 'review', maxIterationsSource: 'default' });
    expect(one.derivedMaxIterations).toBe(24);
    const two = seedWithBudget({ artifactDir: reviewDir(['correctness', 'security', 'traceability', 'maintainability']), candidates: parts(2), target: 'review', maxIterationsSource: 'default' });
    expect(two.derivedMaxIterations).toBe(24);
    expect(two.growthSlots).toBe(10);
  });
});
