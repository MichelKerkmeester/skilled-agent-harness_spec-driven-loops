// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Foundations Corpus Maintainer Fixtures                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  AUTHORITY_ORDER,
  COMMON_PROOF_HANDOFF_FIELDS,
  CORPUS_CONTEXT_PLAN_VERSION,
  CORPUS_EVIDENCE_ALLOWED_USES,
  CORPUS_EVIDENCE_PROHIBITIONS,
  CORPUS_EVIDENCE_SCOPE,
  CORPUS_PROOF_HANDOFF_VERSION,
} from '../../../shared/corpus-context/corpus-context-plan.mjs';
import { STYLE_ALPHA, STYLE_BETA } from '../../../styles/_engine/__tests__/fixtures.mjs';
import {
  FOUNDATIONS_AXIS_COMPATIBILITY_VERSION,
  FOUNDATIONS_RELATIONSHIP_BLUEPRINT_VERSION,
  FOUNDATIONS_TRANSFORMATION_LEDGER_VERSION,
} from '../relationship-blueprint.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

export const MAINTAINER_FIXTURE_ATLAS = true;

function contextPlan(generationHash, outcome = 'positive') {
  return {
    schemaVersion: CORPUS_CONTEXT_PLAN_VERSION,
    generationIdentity: {
      requestedGenerationHash: generationHash,
      observedGenerationHash: generationHash,
      state: 'current',
    },
    availability: 'ready',
    capabilityPlan: {
      requested: ['relationship-context', 'provenance-context'],
      available: ['relationship-context', 'provenance-context'],
      unavailable: [],
    },
    hydration: { owner: 'selected-mode', hydratedStyleCount: 0 },
    authority: {
      order: [...AUTHORITY_ORDER],
      corpusEvidenceScope: CORPUS_EVIDENCE_SCOPE,
      corpusEvidenceAllowedUses: [...CORPUS_EVIDENCE_ALLOWED_USES],
      corpusEvidenceProhibitions: [...CORPUS_EVIDENCE_PROHIBITIONS],
    },
    proofPlan: {
      outcome,
      recordSchemaVersion: CORPUS_PROOF_HANDOFF_VERSION,
      requiredRecordFields: [...COMMON_PROOF_HANDOFF_FIELDS],
      targetChecks: 'required-outside-seam',
    },
  };
}

function authorityInputs() {
  const authorities = [
    ['brief', 'a'],
    ['owned-system', 'b'],
    ['target-roles', 'c'],
    ['target-values', 'd'],
    ['accessibility-checks', 'e'],
    ['extraction-truth', 'f'],
  ];
  const keys = [
    'brief',
    'ownedSystem',
    'targetRoles',
    'targetValues',
    'accessibilityChecks',
    'extractionTruth',
  ];
  return Object.fromEntries(authorities.map(([authority, character], index) => [
    keys[index],
    {
      authority,
      lockId: `${character.repeat(8)}-${character.repeat(4)}-4${character.repeat(3)}-8${character.repeat(3)}-${character.repeat(12)}`,
      contentHash: `sha256:${character.repeat(64)}`,
      state: 'locked',
    },
  ]));
}

function blueprint() {
  return {
    schemaVersion: FOUNDATIONS_RELATIONSHIP_BLUEPRINT_VERSION,
    systemRole: 'product-ui',
    roleTopology: ['surface-layering', 'text-hierarchy', 'spacing-rhythm'],
    groupingPolicy: 'hierarchy-first',
    identityLocks: ['coherent-anchor', 'brief-pins', 'owned-system-roles'],
    doNotConstraints: [
      'no-source-literals',
      'no-token-averaging',
      'no-co-presence-compatibility',
      'no-exact-reuse',
    ],
    adaptationPolicy: 'recalculate-for-target',
  };
}

function compatibilityGraph(relation = 'not-assessed') {
  return {
    schemaVersion: FOUNDATIONS_AXIS_COMPATIBILITY_VERSION,
    nodes: [
      {
        nodeId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa',
        axis: 'color-role',
        ownerRole: 'coherent-anchor',
        sourceId: STYLE_ALPHA.id,
      },
      {
        nodeId: 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb',
        axis: 'typography-role',
        ownerRole: 'axis-owner',
        sourceId: STYLE_BETA.id,
      },
    ],
    edges: [{
      edgeId: 'cccccccc-3333-4333-8333-cccccccccccc',
      fromNodeId: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa',
      toNodeId: 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb',
      relation,
      basis: relation === 'not-assessed'
        ? 'unresolved-target-check'
        : 'cross-axis-dependency',
    }],
  };
}

function transformationLedger() {
  return {
    schemaVersion: FOUNDATIONS_TRANSFORMATION_LEDGER_VERSION,
    records: [{
      sourceId: STYLE_ALPHA.id,
      relationshipEdgeId: 'cccccccc-3333-4333-8333-cccccccccccc',
      transformation: 'recalculate-for-target',
      lock: 'source-literal-excluded',
      authorityLockId: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
    }],
  };
}

function downstreamChecks() {
  return {
    accessibility: 'not-assessed',
    contrast: 'not-assessed',
    gamut: 'not-assessed',
    rhythm: 'not-assessed',
    responsive: 'not-assessed',
    extractionTruth: 'not-assessed',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NAMED FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

export function foundationsRelationshipFixture(generationHash, relation = 'not-assessed') {
  return {
    name: 'typed-relationship',
    input: {
      contextPlan: contextPlan(generationHash),
      retrievalRequest: { text: 'editorial product', useFts: false },
      selection: {
        mode: 'bounded-synthesis',
        coherentAnchorId: STYLE_ALPHA.id,
        axisOwnerIds: [STYLE_BETA.id],
      },
      blueprint: blueprint(),
      compatibilityGraph: compatibilityGraph(relation),
      transformationLedger: transformationLedger(),
      downstreamChecks: downstreamChecks(),
      authorityInputs: authorityInputs(),
    },
  };
}

export function foundationsNoFitFixture(generationHash) {
  const fixture = foundationsRelationshipFixture(generationHash);
  fixture.name = 'no-fit';
  fixture.input.contextPlan.proofPlan.outcome = 'no-fit';
  fixture.input.retrievalRequest = {
    text: 'editorial',
    requiredFacets: ['facet-that-does-not-exist'],
    useFts: false,
  };
  return fixture;
}

export function foundationsExplicitNoneFixture(generationHash) {
  const fixture = foundationsRelationshipFixture(generationHash);
  fixture.name = 'explicit-none';
  fixture.input.contextPlan.proofPlan.outcome = 'no-fit';
  fixture.input.selection = {
    mode: 'none',
    coherentAnchorId: null,
    axisOwnerIds: [],
  };
  fixture.input.compatibilityGraph.nodes = [];
  fixture.input.compatibilityGraph.edges = [];
  fixture.input.transformationLedger.records = [];
  return fixture;
}
