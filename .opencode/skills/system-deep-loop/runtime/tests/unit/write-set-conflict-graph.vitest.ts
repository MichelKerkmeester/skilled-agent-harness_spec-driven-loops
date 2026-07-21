// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Set Conflict Graph Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  PHASE_013_WORKSTREAMS,
  ResourceKinds,
  SHIPPED_MODE_CENSUS,
  WriteSetGraphErrorCodes,
  WriteSetGraphValidationError,
  collectRequiredSourcePaths,
  deriveWriteSetConflictGraph,
  stableDigest,
  validateGraphForReuse,
} from '../../lib/write-set-conflict-graph/index.js';

import type {
  GraphBuildInput,
  ModeResourceDeclaration,
  ResourceAccess,
  ResourceInput,
  SourceDigestInput,
  WriteSetConflictGraph,
} from '../../lib/write-set-conflict-graph/index.js';

const BASE_IDENTITY = 'git:base-013-fixture';

function digestFor(sourcePath: string): string {
  return stableDigest({ sourcePath, revision: 'fixture-v1' });
}

function sourceDigests(
  declarations: readonly ModeResourceDeclaration[],
): readonly SourceDigestInput[] {
  return collectRequiredSourcePaths(declarations).map((sourcePath) => ({
    path: sourcePath,
    digest: digestFor(sourcePath),
    observedDigest: digestFor(sourcePath),
  }));
}

function buildInput(
  declarations: readonly ModeResourceDeclaration[] = SHIPPED_MODE_CENSUS,
): GraphBuildInput {
  return {
    baseIdentity: BASE_IDENTITY,
    manifestWorkstreams: PHASE_013_WORKSTREAMS,
    declarations,
    sourceDigests: sourceDigests(declarations),
  };
}

function buildGraph(
  declarations: readonly ModeResourceDeclaration[] = SHIPPED_MODE_CENSUS,
): WriteSetConflictGraph {
  return deriveWriteSetConflictGraph(buildInput(declarations));
}

function testResource(identity: string, access: ResourceAccess): ResourceInput {
  return {
    identity,
    canonical_id: identity,
    kind: ResourceKinds.STATE,
    scope: 'fixture',
    mutability: 'mutable',
    access,
    owner: 'fixture:shared-owner',
    evidence: [{
      source_path: SHIPPED_MODE_CENSUS[0]?.sourceRefs[0] ?? 'fixture-source',
      basis: 'write-census',
      detail: 'Adversarial fixture resource.',
    }],
  };
}

function replaceDeclaration(
  declarations: readonly ModeResourceDeclaration[],
  nodeId: string,
  update: (declaration: ModeResourceDeclaration) => ModeResourceDeclaration,
): readonly ModeResourceDeclaration[] {
  return declarations.map((declaration) => declaration.id === nodeId
    ? update(declaration)
    : declaration);
}

function graphWithPathWrites(leftIdentity: string, rightIdentity: string): WriteSetConflictGraph {
  let declarations = replaceDeclaration(
    SHIPPED_MODE_CENSUS,
    '001-deep-research',
    (declaration) => ({
      ...declaration,
      writeSet: [
        ...declaration.writeSet,
        { ...testResource(leftIdentity, 'write'), kind: ResourceKinds.FILE },
      ],
    }),
  );
  declarations = replaceDeclaration(
    declarations,
    '003-deep-ai-council',
    (declaration) => ({
      ...declaration,
      writeSet: [
        ...declaration.writeSet,
        { ...testResource(rightIdentity, 'write'), kind: ResourceKinds.FILE },
      ],
    }),
  );
  return buildGraph(declarations);
}

function observedSourceMap(graph: WriteSetConflictGraph): Record<string, string> {
  return Object.fromEntries(graph.generated_from.map((source) => [source.path, source.digest]));
}

describe('write-set conflict graph', () => {
  it('builds one canonical-resource-backed node for every manifest workstream', () => {
    const graph = buildGraph();

    expect(graph.nodes.map((node) => node.id)).toEqual([...PHASE_013_WORKSTREAMS]);
    expect(graph.nodes.every((node) => node.read_set.length > 0)).toBe(true);
    expect(graph.nodes.every((node) => node.write_set.length > 0)).toBe(true);
    expect(graph.schedule.graph_state).toBe('ready');
  });

  it.each([
    {
      label: 'missing',
      workstreams: PHASE_013_WORKSTREAMS.slice(1),
    },
    {
      label: 'duplicate',
      workstreams: [...PHASE_013_WORKSTREAMS, PHASE_013_WORKSTREAMS[0]],
    },
    {
      label: 'renamed',
      workstreams: PHASE_013_WORKSTREAMS.map((entry, index) => index === 0 ? '001-renamed' : entry),
    },
    {
      label: 'extra',
      workstreams: [...PHASE_013_WORKSTREAMS, '009-extra'],
    },
  ])('rejects a $label manifest node set outright', ({ workstreams }) => {
    expect(() => deriveWriteSetConflictGraph({
      ...buildInput(),
      manifestWorkstreams: workstreams,
    })).toThrowError(expect.objectContaining({
      code: WriteSetGraphErrorCodes.INVALID_MANIFEST_NODE_SET,
    }));
  });

  it('widens an unknown resource to conflicts and a serial fallback', () => {
    const declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          {
            ...testResource('backend:unclassified', 'write'),
            kind: 'unclassified-kind',
            mutability: 'unknown',
          },
        ],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.schedule.schedule_class).toBe('serial-single-writer');
    expect(graph.schedule.graph_state).toBe('fallback');
    expect(graph.schedule.phase_gate_complete).toBe(false);
    expect(graph.schedule.missing_evidence.some((issue) => issue.code === 'UNCLASSIFIED_RESOURCE')).toBe(true);
    expect(graph.edges.filter((edge) => edge.edge_origin === 'unknown-widening')).toHaveLength(7);
  });

  it('derives a write-write conflict without allowing the pair into one lane', () => {
    const shared = testResource('state:{packet}/adversarial/shared.jsonl', 'write');
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, shared] }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, shared] }),
    );
    const graph = buildGraph(declarations);
    const conflict = graph.edges.find((edge) => edge.edge_type === 'write-write'
      && edge.from === '001-deep-research'
      && edge.to === '003-deep-ai-council');

    expect(conflict?.resources).toContain('state:{packet}/adversarial/shared.jsonl');
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(false);
  });

  it('derives a symmetric write-read conflict regardless of declaration direction', () => {
    const identity = 'state:{packet}/adversarial/write-read.json';
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [...declaration.writeSet, testResource(identity, 'write')],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        readSet: [...declaration.readSet, testResource(identity, 'read')],
      }),
    );
    const graph = buildGraph([...declarations].reverse());

    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '001-deep-research',
      to: '003-deep-ai-council',
      edge_type: 'write-read',
      resources: [identity],
    }));
  });

  it('widens a canonical-ID collision instead of losing the real write conflict', () => {
    const identity = 'state:{packet}/adversarial/canonical-collision.jsonl';
    const left = { ...testResource(identity, 'write'), canonical_id: 'state:canonical-left' };
    const right = { ...testResource(identity, 'write'), canonical_id: 'state:canonical-right' };
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, left] }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, right] }),
    );
    const graph = buildGraph(declarations);
    const collision = graph.edges.find((edge) => edge.from === '001-deep-research'
      && edge.to === '003-deep-ai-council'
      && edge.edge_origin === 'unknown-widening');

    expect(collision?.resources).toEqual(['state:canonical-left', 'state:canonical-right']);
    expect(graph.schedule.schedule_class).toBe('serial-single-writer');
    expect(graph.schedule.missing_evidence.some(
      (issue) => issue.code === 'CONTRADICTORY_CANONICAL_ID',
    )).toBe(true);
  });

  it('treats a directory writer and descendant reader as overlapping resources', () => {
    const rootIdentity = 'file:.opencode/skills/system-deep-loop/adversarial-mode';
    const childIdentity = `${rootIdentity}/scripts/reader.ts`;
    const rootResource = {
      ...testResource(rootIdentity, 'write'),
      kind: ResourceKinds.FILE,
    };
    const childResource = {
      ...testResource(childIdentity, 'read'),
      kind: ResourceKinds.FILE,
    };
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, rootResource] }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({ ...declaration, readSet: [...declaration.readSet, childResource] }),
    );
    const graph = buildGraph(declarations);

    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '001-deep-research',
      to: '003-deep-ai-council',
      edge_type: 'write-read',
      resources: [rootIdentity, childIdentity],
    }));
  });

  it.each([
    { peerAccess: 'write' as const, edgeType: 'write-write' as const },
    { peerAccess: 'read' as const, edgeType: 'write-read' as const },
  ])('treats trailing-slash-equivalent file resources as a $edgeType conflict', ({
    peerAccess,
    edgeType,
  }) => {
    const identity = 'file:.opencode/skills/system-deep-loop/adversarial-dir';
    const writer = {
      ...testResource(identity, 'write'),
      kind: ResourceKinds.FILE,
    };
    const peer = {
      ...testResource(`${identity}/`, peerAccess),
      kind: ResourceKinds.FILE,
    };
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, writer] }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => peerAccess === 'write'
        ? { ...declaration, writeSet: [...declaration.writeSet, peer] }
        : { ...declaration, readSet: [...declaration.readSet, peer] },
    );
    const graph = buildGraph(declarations);

    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '001-deep-research',
      to: '003-deep-ai-council',
      edge_type: edgeType,
      resources: expect.arrayContaining([identity, `${identity}/`]),
    }));
  });

  it('continues to treat a true file prefix as a write-read conflict', () => {
    const rootIdentity = 'file:.opencode/skills/system-deep-loop/a/b';
    const childIdentity = `${rootIdentity}/c`;
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(rootIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        readSet: [
          ...declaration.readSet,
          { ...testResource(childIdentity, 'read'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '001-deep-research',
      to: '003-deep-ai-council',
      edge_type: 'write-read',
      resources: [rootIdentity, childIdentity],
    }));
  });

  it('rejects an unrecognized shared-state access and falls back globally', () => {
    const identity = 'state:{packet}/adversarial/shared-access.jsonl';
    const invalidAccess = {
      ...testResource(identity, 'read'),
      access: 'read-write',
    } as unknown as ResourceInput;
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        sharedState: [...declaration.sharedState, testResource(identity, 'write')],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        sharedState: [...declaration.sharedState, invalidAccess],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.schedule).toEqual(expect.objectContaining({
      schedule_class: 'serial-single-writer',
      graph_state: 'fallback',
      widened_parallelism: false,
    }));
    expect(graph.schedule.missing_evidence.some(
      (issue) => issue.code === 'UNCLASSIFIED_RESOURCE_ACCESS',
    )).toBe(true);
  });

  it.each([
    { peerAccess: 'write' as const, edgeType: 'write-write' as const },
    { peerAccess: 'read' as const, edgeType: 'write-read' as const },
  ])('derives a $edgeType conflict from valid shared-state access', ({ peerAccess, edgeType }) => {
    const identity = `state:{packet}/adversarial/shared-${peerAccess}.jsonl`;
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        sharedState: [...declaration.sharedState, testResource(identity, 'write')],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        sharedState: [...declaration.sharedState, testResource(identity, peerAccess)],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '001-deep-research',
      to: '003-deep-ai-council',
      edge_type: edgeType,
      resources: [identity],
    }));
  });

  it('fails closed when path resources differ only by ASCII case', () => {
    const upperIdentity = 'file:.opencode/Adversarial-Case.md';
    const lowerIdentity = 'file:.opencode/adversarial-case.md';
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(upperIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(lowerIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.schedule).toEqual(expect.objectContaining({
      schedule_class: 'serial-single-writer',
      graph_state: 'fallback',
      widened_parallelism: false,
    }));
    expect(graph.schedule.missing_evidence.some(
      (issue) => issue.code === 'UNRESOLVED_RESOURCE_ALIAS',
    )).toBe(true);
  });

  it.each(
    ['same-case', 'diff-case'].flatMap((caseMode) =>
      ['no-slash', 'trailing-slash'].flatMap((slashMode) =>
        ['NFC', 'NFD'].flatMap((unicodeMode) =>
          ['non-root', 'root'].map((rootMode) => ({
            caseMode,
            slashMode,
            unicodeMode,
            rootMode,
          }))))),
  )('conflicts for comparable paths: $caseMode × $slashMode × $unicodeMode × $rootMode', ({
    caseMode,
    slashMode,
    unicodeMode,
    rootMode,
  }) => {
    const nfcPath = '.opencode/ComboCaseSlash-Caf\u00e9-dir';
    const casedPeerPath = caseMode === 'diff-case'
      ? '.opencode/combocaseslash-caf\u00e9-dir'
      : nfcPath;
    const peerPath = unicodeMode === 'NFD'
      ? casedPeerPath.normalize('NFD')
      : casedPeerPath;
    const leftIdentity = rootMode === 'root' ? 'file:' : `file:${nfcPath}`;
    const rightIdentity = rootMode === 'root'
      ? slashMode === 'trailing-slash' ? 'file:/' : 'file:.'
      : `file:${peerPath}${slashMode === 'trailing-slash' ? '/' : ''}`;
    const graph = graphWithPathWrites(leftIdentity, rightIdentity);
    const pairEdges = graph.edges.filter((edge) => edge.from === '001-deep-research'
      && edge.to === '003-deep-ai-council'
      && (edge.edge_type === 'write-write' || edge.edge_origin === 'unknown-widening'));

    expect(pairEdges.length).toBeGreaterThan(0);
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(false);
    if (rootMode === 'non-root'
      && caseMode === 'diff-case'
      && slashMode === 'trailing-slash') {
      expect(graph.schedule).toEqual(expect.objectContaining({
        schedule_class: 'serial-single-writer',
        graph_state: 'fallback',
        widened_parallelism: false,
      }));
      expect(graph.schedule.missing_evidence.some(
        (issue) => issue.code === 'UNRESOLVED_RESOURCE_ALIAS',
      )).toBe(true);
    }
  });

  it('conflicts for the pure-ASCII case-and-trailing-slash repro', () => {
    const graph = graphWithPathWrites(
      'file:.opencode/ComboCaseSlash-dir',
      'file:.opencode/combocaseslash-dir/',
    );

    expect(graph.schedule).toEqual(expect.objectContaining({
      schedule_class: 'serial-single-writer',
      graph_state: 'fallback',
      widened_parallelism: false,
    }));
    expect(graph.schedule.missing_evidence.some(
      (issue) => issue.code === 'UNRESOLVED_RESOURCE_ALIAS',
    )).toBe(true);
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(false);
  });

  it.each([
    {
      label: 'different filename',
      leftIdentity: 'file:.opencode/comparable-alpha.md',
      rightIdentity: 'file:.opencode/comparable-beta.md',
    },
    {
      label: 'NFKC-only ligature difference',
      leftIdentity: 'file:.opencode/comparable-o\ufb03ce.md',
      rightIdentity: 'file:.opencode/comparable-office.md',
    },
    {
      label: 'different accented filename',
      leftIdentity: 'file:.opencode/comparable-caf\u00e9.md',
      rightIdentity: 'file:.opencode/comparable-caf\u00e8.md',
    },
  ])('keeps $label paths independent', ({ leftIdentity, rightIdentity }) => {
    const graph = graphWithPathWrites(leftIdentity, rightIdentity);

    expect(graph.schedule).toEqual(expect.objectContaining({
      schedule_class: 'parallel-safe-antichains',
      graph_state: 'ready',
      missing_evidence: [],
    }));
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(true);
  });

  it('treats NFC and NFD spellings of the same path as one write resource', () => {
    const nfcIdentity = 'file:.opencode/adversarial-caf\u00e9.md';
    const nfdIdentity = 'file:.opencode/adversarial-cafe\u0301.md';
    expect(nfcIdentity).not.toBe(nfdIdentity);
    expect(nfcIdentity.normalize('NFC')).toBe(nfdIdentity.normalize('NFC'));

    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(nfcIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(nfdIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '001-deep-research',
      to: '003-deep-ai-council',
      edge_type: 'write-write',
      resources: [nfcIdentity],
    }));
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(false);
  });

  it('keeps genuinely different Unicode filenames independent', () => {
    const acuteIdentity = 'file:.opencode/adversarial-caf\u00e9.md';
    const graveIdentity = 'file:.opencode/adversarial-caf\u00e8.md';
    expect(acuteIdentity.normalize('NFC')).not.toBe(graveIdentity.normalize('NFC'));

    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(acuteIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(graveIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.schedule).toEqual(expect.objectContaining({
      schedule_class: 'parallel-safe-antichains',
      graph_state: 'ready',
      missing_evidence: [],
    }));
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(true);
  });

  it.each([
    { leftPath: '', rightPath: '/' },
    { leftPath: '', rightPath: '.' },
    { leftPath: '/', rightPath: '.' },
  ])('treats file:$leftPath and file:$rightPath as the same namespace root', ({
    leftPath,
    rightPath,
  }) => {
    const leftIdentity = `file:${leftPath}`;
    const rightIdentity = `file:${rightPath}`;
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(leftIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          { ...testResource(rightIdentity, 'write'), kind: ResourceKinds.FILE },
        ],
      }),
    );
    const graph = buildGraph(declarations);

    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '001-deep-research',
      to: '003-deep-ai-council',
      edge_type: 'write-write',
      resources: expect.arrayContaining(['file:/']),
    }));
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(false);
  });

  it('normalizes an unrecognized mutability to unknown and falls back globally', () => {
    const identity = 'state:{packet}/adversarial/mutability.jsonl';
    const invalidMutability = {
      ...testResource(identity, 'write'),
      mutability: 'read-only-ish',
    } as unknown as ResourceInput;
    const declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [...declaration.writeSet, invalidMutability],
      }),
    );
    const graph = buildGraph(declarations);
    const canonical = graph.nodes
      .find((node) => node.id === '001-deep-research')
      ?.write_set.find((resource) => resource.identity === identity);

    expect(canonical?.mutability).toBe('unknown');
    expect(graph.schedule.schedule_class).toBe('serial-single-writer');
    expect(graph.schedule.missing_evidence.some(
      (issue) => issue.code === 'UNCLASSIFIED_RESOURCE',
    )).toBe(true);
  });

  it('keeps genuinely independent research and council work in one parallel lane', () => {
    const graph = buildGraph();

    expect(graph.schedule.graph_state).toBe('ready');
    expect(graph.schedule.missing_evidence).toEqual([]);
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('001-deep-research')
      && lane.node_ids.includes('003-deep-ai-council'))).toBe(true);
  });

  it('keeps common-before-variant hard order separate from derived conflicts', () => {
    const graph = buildGraph();
    const hardEdges = graph.edges.filter((edge) => edge.edge_type === 'hard-order'
      && edge.from === '004-deep-improvement-common');

    expect(hardEdges.map((edge) => edge.to)).toEqual([
      '005-agent-improvement',
      '006-model-benchmark',
      '007-skill-benchmark',
    ]);
    expect(hardEdges.every((edge) => edge.edge_origin === 'required-constraint')).toBe(true);
    expect(graph.edges).toContainEqual(expect.objectContaining({
      from: '004-deep-improvement-common',
      to: '005-agent-improvement',
      edge_type: 'write-write',
      edge_origin: 'derived',
      resources: ['backend:deep-improvement-score'],
    }));
  });

  it('normalizes both review-loop access paths into the required fence', () => {
    const graph = buildGraph();
    const fence = graph.edges.find((edge) => edge.edge_type === 'fence'
      && edge.from === '002-deep-review'
      && edge.to === '008-deep-alignment');

    expect(fence?.edge_origin).toBe('required-constraint');
    expect(fence?.resources).toEqual(['backend:review-loop', 'lock:review-loop']);
    expect(graph.schedule.lanes.some((lane) => lane.node_ids.includes('002-deep-review')
      && lane.node_ids.includes('008-deep-alignment'))).toBe(false);
  });

  it('retains the review fence and falls back when an alias becomes ambiguous', () => {
    const graph = deriveWriteSetConflictGraph({
      ...buildInput(),
      aliasGroups: [{
        canonical_id: 'backend:competing-review-loop',
        aliases: ['backend:deep-review-loop'],
      }],
    });
    const fence = graph.edges.find((edge) => edge.edge_type === 'fence'
      && edge.from === '002-deep-review'
      && edge.to === '008-deep-alignment');

    expect(graph.schedule.schedule_class).toBe('serial-single-writer');
    expect(graph.schedule.missing_evidence.some(
      (issue) => issue.code === 'UNRESOLVED_RESOURCE_ALIAS',
    )).toBe(true);
    expect(fence?.resources).toContain('unknown:review-loop-fence');
  });

  it('refuses stale source digests during construction and graph reuse', () => {
    const freshInput = buildInput();
    const stalePath = freshInput.sourceDigests[0]?.path as string;
    const staleGraph = deriveWriteSetConflictGraph({
      ...freshInput,
      sourceDigests: freshInput.sourceDigests.map((source) => source.path === stalePath
        ? { ...source, observedDigest: stableDigest({ changed: source.path }) }
        : source),
    });
    const freshGraph = deriveWriteSetConflictGraph(freshInput);
    const observed = observedSourceMap(freshGraph);
    observed[stalePath] = stableDigest({ changed: stalePath });
    const reuse = validateGraphForReuse(freshGraph, {
      baseIdentity: BASE_IDENTITY,
      manifestWorkstreams: PHASE_013_WORKSTREAMS,
      declarations: SHIPPED_MODE_CENSUS,
      observedSourceDigests: observed,
    });

    expect(staleGraph.schedule.schedule_class).toBe('serial-single-writer');
    expect(staleGraph.schedule.missing_evidence.some((issue) => issue.code === 'STALE_SOURCE_DIGEST')).toBe(true);
    expect(reuse).toEqual(expect.objectContaining({
      accepted: false,
      graph_refresh_required: true,
      required_schedule: 'serial-single-writer',
      phase_gate_complete: false,
    }));
  });

  it('validates research and council independence against actual resources', () => {
    const independent = buildGraph().independent_assertions[0];
    const shared = testResource('state:{packet}/adversarial/assertion.jsonl', 'write');
    let declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, shared] }),
    );
    declarations = replaceDeclaration(
      declarations,
      '003-deep-ai-council',
      (declaration) => ({ ...declaration, writeSet: [...declaration.writeSet, shared] }),
    );
    const conflictedGraph = buildGraph(declarations);

    expect(independent?.validated).toBe(true);
    expect(conflictedGraph.independent_assertions[0]).toEqual(expect.objectContaining({
      validated: false,
      reason: 'Actual resource conflicts override the independence assertion.',
    }));
    expect(conflictedGraph.schedule.schedule_class).toBe('serial-single-writer');
  });

  it('fails closed for malformed and non-required stale source digests', () => {
    const input = buildInput();
    const malformed = deriveWriteSetConflictGraph({
      ...input,
      sourceDigests: input.sourceDigests.map((source, index) => index === 0
        ? { ...source, digest: '', observedDigest: '' }
        : source),
    });
    const staleExtra = deriveWriteSetConflictGraph({
      ...input,
      sourceDigests: [...input.sourceDigests, {
        path: 'fixture:extra-source',
        digest: stableDigest({ revision: 1 }),
        observedDigest: stableDigest({ revision: 2 }),
      }],
    });

    expect(malformed.schedule.schedule_class).toBe('serial-single-writer');
    expect(malformed.schedule.missing_evidence.some(
      (issue) => issue.code === 'INVALID_SOURCE_DIGEST',
    )).toBe(true);
    expect(staleExtra.schedule.schedule_class).toBe('serial-single-writer');
    expect(staleExtra.schedule.missing_evidence.some(
      (issue) => issue.code === 'STALE_SOURCE_DIGEST',
    )).toBe(true);
  });

  it('produces an identical graph and schedule for equivalent reordered input', () => {
    const first = deriveWriteSetConflictGraph(buildInput());
    const reorderedDeclarations = [...SHIPPED_MODE_CENSUS].reverse().map((declaration) => ({
      ...declaration,
      readSet: [...declaration.readSet].reverse(),
      writeSet: [...declaration.writeSet].reverse(),
      sharedState: [...declaration.sharedState].reverse(),
      migrationDependencies: [...declaration.migrationDependencies].reverse(),
      contractRefs: [...declaration.contractRefs].reverse(),
      sourceRefs: [...declaration.sourceRefs].reverse(),
    }));
    const reorderedInput = buildInput(reorderedDeclarations);
    const second = deriveWriteSetConflictGraph({
      ...reorderedInput,
      sourceDigests: [...reorderedInput.sourceDigests].reverse(),
    });

    expect(second.graph_digest).toBe(first.graph_digest);
    expect(second.edges).toEqual(first.edges);
    expect(second.schedule).toEqual(first.schedule);
    expect(second).toEqual(first);
  });

  it('never presents serial fallback as a completed phase gate', () => {
    const input = buildInput();
    const graph = deriveWriteSetConflictGraph({
      ...input,
      sourceDigests: input.sourceDigests.slice(1),
    });

    expect(graph.schedule).toEqual(expect.objectContaining({
      schedule_class: 'serial-single-writer',
      graph_state: 'fallback',
      phase_gate_complete: false,
      phase_gate_status: 'refused-incomplete-evidence',
      widened_parallelism: false,
    }));
    expect(graph.schedule.missing_evidence.length).toBeGreaterThan(0);
  });

  it('attaches predecessor, conflict, fence, source, class, and refusal evidence to every node', () => {
    const graph = buildGraph();

    expect(graph.schedule.decisions).toHaveLength(PHASE_013_WORKSTREAMS.length);
    for (const decision of graph.schedule.decisions) {
      expect(decision.node_ids).toHaveLength(1);
      expect(decision.source_digest).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(decision.predecessor_completion).toEqual(expect.objectContaining({
        required: expect.any(Array),
        completed_before_lane: expect.any(Array),
        pending: expect.any(Array),
      }));
      expect(decision.conflict_resources).toEqual(expect.any(Array));
      expect(decision.fence_resources).toEqual(expect.any(Array));
      expect(['parallel-safe', 'serialized']).toContain(decision.schedule_class);
      if (decision.schedule_class === 'serialized') expect(decision.refusal_reason).not.toBeNull();
    }
  });

  it('accepts reuse only when base, sources, graph digest, and green state still match', () => {
    const graph = buildGraph();
    const reuse = validateGraphForReuse(graph, {
      baseIdentity: BASE_IDENTITY,
      manifestWorkstreams: PHASE_013_WORKSTREAMS,
      declarations: SHIPPED_MODE_CENSUS,
      observedSourceDigests: observedSourceMap(graph),
    });

    expect(reuse).toEqual(expect.objectContaining({
      accepted: true,
      graph_refresh_required: false,
      required_schedule: 'parallel-safe-antichains',
      phase_gate_complete: false,
      reasons: [],
    }));
  });

  it('rejects graph reuse when the current declarations drift without a source-map change', () => {
    const graph = buildGraph();
    const declarations = replaceDeclaration(
      SHIPPED_MODE_CENSUS,
      '001-deep-research',
      (declaration) => ({
        ...declaration,
        writeSet: [
          ...declaration.writeSet,
          testResource('state:{packet}/adversarial/reuse-drift.jsonl', 'write'),
        ],
      }),
    );
    const reuse = validateGraphForReuse(graph, {
      baseIdentity: BASE_IDENTITY,
      manifestWorkstreams: PHASE_013_WORKSTREAMS,
      declarations,
      observedSourceDigests: observedSourceMap(graph),
    });

    expect(reuse.accepted).toBe(false);
    expect(reuse.required_schedule).toBe('serial-single-writer');
    expect(reuse.reasons).toContain(
      'Current declarations, sources, or derived edges differ from the stored graph.',
    );
  });

  it('rejects a stored graph whose node set no longer equals the manifest', () => {
    const graph = buildGraph();
    const tampered = {
      ...graph,
      nodes: graph.nodes.slice(1),
    } as WriteSetConflictGraph;
    const reuse = validateGraphForReuse(tampered, {
      baseIdentity: BASE_IDENTITY,
      manifestWorkstreams: PHASE_013_WORKSTREAMS,
      declarations: SHIPPED_MODE_CENSUS,
      observedSourceDigests: observedSourceMap(graph),
    });

    expect(reuse.accepted).toBe(false);
    expect(reuse.reasons.some((reason) => reason.startsWith('Stored graph node set is invalid:'))).toBe(true);
  });

  it('rejects duplicate mode declarations independently of manifest validation', () => {
    const duplicate = [...SHIPPED_MODE_CENSUS, SHIPPED_MODE_CENSUS[0] as ModeResourceDeclaration];
    try {
      deriveWriteSetConflictGraph(buildInput(duplicate));
      throw new Error('Expected duplicate declarations to fail validation.');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(WriteSetGraphValidationError);
      expect(error).toEqual(expect.objectContaining({
        code: WriteSetGraphErrorCodes.INVALID_MODE_DECLARATIONS,
      }));
    }
  });
});
