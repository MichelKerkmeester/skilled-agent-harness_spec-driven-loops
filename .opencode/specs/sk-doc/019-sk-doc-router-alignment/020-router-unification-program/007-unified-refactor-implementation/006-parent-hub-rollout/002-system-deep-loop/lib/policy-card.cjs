// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: DEEP-LOOP DOCUMENT-ONLY POLICY CARD                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  canonicalize,
  computeProjectionHash,
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecisionShape,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function documentAdvisorEvidence(card, advisor) {
  if (!advisor || ['absent', 'unavailable'].includes(advisor.trust)) return null;
  const identityMatches = advisor.trust === 'live'
    && advisor.hubId === card.advisorHubId
    && advisor.effectivePolicyHash === card.effectivePolicyHash
    && advisor.projectionHash === card.advisorProjectionHash;
  if (!identityMatches) {
    return {
      id: 'advisor:annotation',
      kind: 'advisor',
      provenance: {
        capturedAtEpoch: card.activationGeneration,
        source: 'advisor-projection',
      },
      trust: 'stale',
      value: canonicalize({ annotationOnly: true }),
    };
  }
  return {
    id: 'advisor:rank',
    kind: 'advisor',
    provenance: {
      capturedAtEpoch: card.activationGeneration,
      source: 'advisor-projection',
    },
    trust: 'live',
    value: canonicalize({
      activationGeneration: card.activationGeneration,
      effectivePolicyHash: card.effectivePolicyHash,
      rankScore: advisor.rankScore || '0',
      scoreMargin: advisor.scoreMargin || '0',
    }),
  };
}

function documentRequest(card, input) {
  const observations = [];
  if (typeof input.prompt === 'string' && /\S/.test(input.prompt)) {
    observations.push({ kind: 'intent', value: input.prompt });
  }
  for (const constraint of input.constraints || []) {
    observations.push({ kind: 'constraint', value: constraint });
  }
  const request = {
    schemaVersion: 'V1',
    evidence: [{
      id: 'runtime:activation',
      kind: 'runtime',
      provenance: {
        capturedAtEpoch: card.activationGeneration,
        source: 'fenced-selector',
      },
      trust: 'live',
      value: canonicalize({
        activationGeneration: card.activationGeneration,
        effectivePolicyHash: card.effectivePolicyHash,
      }),
    }],
    ...(input.explicitMode ? { explicitMode: input.explicitMode } : {}),
    observations,
    pinnedActivationGeneration: card.activationGeneration,
  };
  const advisorEvidence = documentAdvisorEvidence(card, input.advisor);
  if (advisorEvidence) request.evidence.push(advisorEvidence);
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function documentBudgetRef(request) {
  return `budget:${request.requestFactsHash.slice(0, 16)}`;
}

function snapshotForCard(snapshot) {
  const policy = snapshot.policy;
  const detectorById = new Map(policy.detectors.map((detector) => [detector.id, detector]));
  return {
    activationGeneration: policy.activationGeneration,
    advisorHubId: snapshot.advisorProjection.hubId,
    advisorProjectionHash: snapshot.advisorProjection.projectionHash,
    basePolicyHash: policy.basePolicyHash,
    destinations: policy.destinations,
    effectivePolicyHash: policy.effectivePolicyHash,
    fallbackChecklist: snapshot.fallbackChecklist,
    projectionRows: snapshot.projectionGraph.rows,
    selectors: policy.selectors.map((selector) => ({
      destinationId: selector.destinationId,
      keywords: selector.detectorIds
        .map((id) => detectorById.get(id)?.value)
        .filter(Boolean),
    })),
    sourceHashes: snapshot.sourceHashes,
  };
}

function projectionLabel(row) {
  const runtime = row.runtimeLoopType === null ? 'null' : row.runtimeLoopType;
  return `${row.qualifiedPublicMode}:${row.packetRef}:${row.packetKind}:`
    + `${row.backendKind}:runtime=${runtime}:${row.role}`;
}

function projectionTable(rows) {
  return [
    '| Qualified mode | Packet | Packet kind | Backend | Runtime loop | Routing class | Role |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => (
      `| \`${row.qualifiedPublicMode}\` | \`${row.packetRef}\` | \`${row.packetKind}\` `
      + `| \`${row.backendKind}\` | \`${row.runtimeLoopType === null ? 'null' : row.runtimeLoopType}\` `
      + `| \`${row.routingClass}\` | \`${row.role}\` |`
    )),
  ];
}

function parseRoutingSnapshot(markdown) {
  const match = /## Document-only routing snapshot\n\n```json\n([^\n]+)\n```/m.exec(markdown);
  if (!match) throw new TypeError('document-only routing snapshot is missing');
  return JSON.parse(match[1]);
}

function destinationKey(id) {
  return canonicalize(id);
}

function normalizeSignal(value) {
  return String(value).trim().toLowerCase();
}

function documentRankEvidence(request) {
  const evidence = request.evidence.find((entry) => (
    entry.kind === 'advisor' && entry.trust === 'live'
  ));
  if (!evidence) return [];
  let value;
  try {
    value = JSON.parse(evidence.value);
  } catch {
    return [];
  }
  return ['rankScore', 'scoreMargin']
    .filter((kind) => (
      typeof value[kind] === 'string'
      && /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value[kind])
    ))
    .map((kind) => ({ kind, nonAuthority: true, value: value[kind] }));
}

function documentDefer(reason, recovery = []) {
  return parseRouteDecisionShape({
    action: 'defer',
    defer: { authority: 'Withheld', reason, recovery },
    schemaVersion: 'V1',
  });
}

function documentClarify(card, request) {
  return parseRouteDecisionShape({
    action: 'clarify',
    clarify: {
      alternatives: [...card.fallbackChecklist.slice(1, 3), 'none_of_these'],
      authority: 'Withheld',
      budgetRef: documentBudgetRef(request),
      question: card.fallbackChecklist[0],
    },
    schemaVersion: 'V1',
  });
}

function documentRoute(destination, evidence = []) {
  return parseRouteDecisionShape({
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: 'signal' },
      evidence,
      selectionKind: 'single',
      targets: [target(destination)],
    },
    schemaVersion: 'V1',
  });
}

function documentDecision(card, input) {
  const request = documentRequest(card, input);
  const signals = request.observations.map((observation) => ({
    kind: observation.kind,
    value: normalizeSignal(observation.value),
  }));
  if (signals.some((signal) => (
    (signal.kind === 'constraint' && signal.value === 'forbidden')
    || signal.value.includes('forbidden')
  ))) {
    return parseRouteDecisionShape({
      action: 'reject',
      reject: { authority: 'Withheld', reason: 'forbidden' },
      schemaVersion: 'V1',
    });
  }
  if (signals.some((signal) => (
    signal.kind === 'constraint' && signal.value === 'dependency-failure'
  ))) {
    return documentDefer('dependency-failure', ['defer']);
  }
  const wantsClarification = signals.some((signal) => (
    signal.kind === 'constraint' && signal.value === 'clarify'
  ));
  if (request.explicitMode) {
    const explicit = normalizeSignal(request.explicitMode);
    const matched = card.destinations.filter((destination) => (
      normalizeSignal(destination.id.workflowMode) === explicit
      || normalizeSignal(`${destination.id.skillId}/${destination.id.workflowMode}`) === explicit
    ));
    if (matched.length === 1) return documentRoute(matched[0]);
    if (matched.length > 1 || wantsClarification) return documentClarify(card, request);
    return documentDefer('no-match');
  }
  const matchedKeys = new Set();
  for (const selector of card.selectors) {
    if (selector.keywords.some((keyword) => signals.some((signal) => (
      signal.value.includes(normalizeSignal(keyword))
    )))) {
      matchedKeys.add(destinationKey(selector.destinationId));
    }
  }
  for (const destination of card.destinations) {
    const publicMode = normalizeSignal(destination.id.workflowMode);
    const qualifiedMode = normalizeSignal(
      `${destination.id.skillId}/${destination.id.workflowMode}`,
    );
    if (signals.some((signal) => (
      signal.value === publicMode || signal.value === qualifiedMode
    ))) {
      matchedKeys.add(destinationKey(destination.id));
    }
  }
  const matched = card.destinations.filter((destination) => (
    matchedKeys.has(destinationKey(destination.id))
  ));
  if (wantsClarification) return documentClarify(card, request);
  if (matched.length === 0) return documentDefer('no-match');
  if (matched.length === 1) {
    return documentRoute(matched[0], documentRankEvidence(request));
  }
  return documentClarify(card, request);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. POLICY CARD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate the human projection from the exact compiled snapshot.
 *
 * @param {Object} snapshot - Compiled policy and projection graph.
 * @returns {Object} Markdown, frontmatter, and embedded routing snapshot.
 */
function generatePolicyCard(snapshot) {
  const policy = snapshot.policy;
  const routingSnapshot = snapshotForCard(snapshot);
  const frontmatter = {
    admission: ['positive-signal', 'zero-signal-defer', 'forbidden-reject'],
    authorityEdges: policy.authorityGraph.map((edge) => (
      `${edge.fromAuthorityRef} ${edge.relation} ${canonicalize(edge.toDestinationId)}`
    )),
    bundleGrammar: ['single'],
    effectivePolicyHash: policy.effectivePolicyHash,
    hubId: snapshot.advisorProjection.hubId,
    lifecycleChecklist: ['PREPARE', 'VERIFY', 'COMMIT', 'receipt'],
    limitations: [
      'DOCUMENT_ONLY_UNATTESTED',
      'PREPARED_DRAFT',
      'No live activation freshness',
      'No calibrated probability',
      'No committed effects',
    ],
    negativeReasons: ['forbidden', 'no-match'],
    qualifiedRoles: snapshot.projectionGraph.rows.map(projectionLabel),
    recoveryBudget: 'one clarify turn; no handoff',
    schemaVersion: 'V1',
    thresholdPolicy: policy.thresholdPolicy.kind,
  };
  frontmatter.humanViewHash = computeProjectionHash(
    'PolicyCardV1',
    frontmatter,
    'humanViewHash',
  );
  const markdown = [
    '---',
    canonicalize(frontmatter),
    '---',
    '',
    '# system-deep-loop Compiled Router Policy Card',
    '',
    '## Identity and hashes',
    '',
    `Effective policy: \`${policy.effectivePolicyHash}\``,
    `Base policy: \`${policy.basePolicyHash}\``,
    `Human view: \`${frontmatter.humanViewHash}\``,
    '',
    '## Qualified public-mode projections',
    '',
    ...projectionTable(snapshot.projectionGraph.rows),
    '',
    '## Admission and precedence',
    '',
    'Forbidden input rejects first. One dominant authored signal routes one mode. '
      + 'Ambiguous legal signals clarify once. Zero signal defers with no target.',
    '',
    '## Bundle grammar',
    '',
    'Only `single` is legal. Ordered and surface bundles are activation failures.',
    '',
    '## Document-only routing snapshot',
    '',
    '```json',
    canonicalize(routingSnapshot),
    '```',
    '',
    '## Authority and lifecycle',
    '',
    'Destination authority remains withheld until VERIFY. The only effect path is '
      + 'PREPARE → VERIFY → COMMIT → receipt.',
    '',
    '## Negative reasons',
    '',
    '`forbidden` rejects. `no-match` defers. Negative decisions carry no target or authority.',
    '',
    '## Limitations',
    '',
    '- DOCUMENT_ONLY_UNATTESTED',
    '- PREPARED_DRAFT only',
    '- No live activation freshness, calibrated probability, destination readiness, or committed effects',
    '',
  ].join('\n');
  return { frontmatter, markdown, routingSnapshot };
}

/**
 * Replay only data embedded in the card and emit an honest terminal.
 *
 * @param {string} markdown - Generated policy card.
 * @param {Object} input - Full machine request input.
 * @returns {Object} Typed decision and document-only status.
 */
function replayPolicyCard(markdown, input) {
  const decision = documentDecision(parseRoutingSnapshot(markdown), input);
  return {
    decision,
    ...(decision.action === 'route' ? { draftStatus: 'PREPARED_DRAFT' } : {}),
    terminal: 'DOCUMENT_ONLY_UNATTESTED',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  generatePolicyCard,
  replayPolicyCard,
  snapshotForCard,
};
