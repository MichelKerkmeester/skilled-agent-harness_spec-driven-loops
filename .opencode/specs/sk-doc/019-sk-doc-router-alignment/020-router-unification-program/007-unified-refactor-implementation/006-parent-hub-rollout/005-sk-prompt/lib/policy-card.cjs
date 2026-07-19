'use strict';

const {
  canonicalize,
  computeProjectionHash,
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecisionShape,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function snapshotForCard(snapshot) {
  return {
    activationGeneration: snapshot.policy.activationGeneration,
    advisorProjectionHash: snapshot.advisorProjection.projectionHash,
    basePolicyHash: snapshot.policy.basePolicyHash,
    destinations: snapshot.policy.destinations,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    routingModel: snapshot.routingModel,
    sourceHashes: snapshot.sourceHashes,
  };
}

function projectionLabel(row) {
  return `${row.qualifiedPublicMode}:${row.packetRef}:${row.packetKind}:`
    + `${row.backendKind}:weight=${row.weight}:${row.role}`;
}

function projectionTable(rows) {
  return [
    '| Qualified mode | Packet | Backend | Weight | Default | Resource | Role |',
    '| --- | --- | --- | ---: | --- | --- | --- |',
    ...rows.map((row) => (
      `| \`${row.qualifiedPublicMode}\` | \`${row.packetRef}\` | \`${row.backendKind}\` `
      + `| ${row.weight} | ${row.defaultMode ? 'yes' : 'no'} | \`${row.resource}\` | \`${row.role}\` |`
    )),
  ];
}

function parseRoutingSnapshot(markdown) {
  const match = /## Document-only routing snapshot\n\n```json\n([^\n]+)\n```/m.exec(markdown);
  if (!match) throw new TypeError('document-only routing snapshot is missing');
  return JSON.parse(match[1]);
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
    schemaVersion: 'V1',
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function destinationByMode(card, workflowMode) {
  return card.destinations.find((destination) => (
    destination.id.workflowMode === workflowMode
  ));
}

function documentRoute(card, workflowModes, basisKind) {
  return parseRouteDecisionShape({
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: basisKind },
      evidence: [],
      selectionKind: workflowModes.length === 1 ? 'single' : 'orderedBundle',
      targets: workflowModes.map((workflowMode) => target(destinationByMode(card, workflowMode))),
    },
    schemaVersion: 'V1',
  });
}

function documentNegative(action, payload) {
  return parseRouteDecisionShape({
    action,
    [action]: { ...payload, authority: 'Withheld' },
    schemaVersion: 'V1',
  });
}

function documentClarify(card, request) {
  return parseRouteDecisionShape({
    action: 'clarify',
    clarify: {
      alternatives: [...card.routingModel.tieBreak, 'none_of_these'],
      authority: 'Withheld',
      budgetRef: `budget:${request.requestFactsHash.slice(0, 16)}`,
      question: 'Which sk-prompt workflow matches the request?',
    },
    schemaVersion: 'V1',
  });
}

function documentScores(card, text) {
  return card.routingModel.modes.map((mode) => {
    const matches = mode.keywords.filter((keyword) => text.includes(keyword));
    return {
      score: matches.length * mode.weight,
      workflowMode: mode.workflowMode,
    };
  }).filter((entry) => entry.score > 0).sort((left, right) => {
    if (left.score !== right.score) return right.score - left.score;
    return card.routingModel.tieBreak.indexOf(left.workflowMode)
      - card.routingModel.tieBreak.indexOf(right.workflowMode);
  });
}

function documentDecision(card, input) {
  const request = documentRequest(card, input);
  const text = normalize(input.prompt);
  const constraints = new Set((input.constraints || []).map(normalize));
  if (constraints.has('forbidden') || text.includes('forbidden')) {
    return documentNegative('reject', { reason: 'forbidden' });
  }
  if (constraints.has('dependency-failure')) {
    return documentNegative('defer', { reason: 'dependency-failure', recovery: ['defer'] });
  }
  if (constraints.has('clarify')) return documentClarify(card, request);
  if (input.explicitMode) {
    const explicit = normalize(input.explicitMode);
    if (!card.routingModel.tieBreak.includes(explicit)) {
      return documentNegative('defer', { reason: 'no-match', recovery: [] });
    }
    return documentRoute(card, [explicit], 'signal');
  }
  const explicitlyNamed = card.routingModel.tieBreak.filter((mode) => text.includes(mode));
  if (explicitlyNamed.length === card.routingModel.tieBreak.length) {
    return documentRoute(card, card.routingModel.tieBreak, 'signal');
  }
  const scored = documentScores(card, text);
  if (scored.length === 0) {
    return documentRoute(card, [card.routingModel.defaultMode], 'bounded-default');
  }
  if (scored.length > 1
    && scored[0].score - scored[1].score <= card.routingModel.ambiguityDelta) {
    return documentClarify(card, request);
  }
  return documentRoute(card, [scored[0].workflowMode], 'signal');
}

function generatePolicyCard(snapshot) {
  const policy = snapshot.policy;
  const routingSnapshot = snapshotForCard(snapshot);
  const frontmatter = {
    admission: ['positive-signal', 'bounded-default', 'forbidden-reject'],
    authorityEdges: policy.authorityGraph.map((edge) => (
      `${edge.fromAuthorityRef} ${edge.relation} ${canonicalize(edge.toDestinationId)}`
    )),
    bundleGrammar: ['single', 'orderedBundle'],
    effectivePolicyHash: policy.effectivePolicyHash,
    hubId: snapshot.advisorProjection.hubId,
    lifecycleChecklist: ['PREPARE', 'VERIFY', 'COMMIT', 'receipt'],
    limitations: [
      'DOCUMENT_ONLY_UNATTESTED',
      'PREPARED_DRAFT',
      'No live activation freshness',
      'No committed effects',
    ],
    negativeReasons: ['forbidden', 'dependency-failure', 'no-match'],
    qualifiedRoles: snapshot.projectionGraph.rows.map(projectionLabel),
    recoveryBudget: 'one clarify turn; no handoff',
    schemaVersion: 'V1',
    thresholdPolicy: 'authored-weighted-signals-with-bounded-default',
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
    '# sk-prompt Compiled Router Policy Card',
    '',
    '## Identity and hashes',
    '',
    `Effective policy: \`${policy.effectivePolicyHash}\``,
    `Base policy: \`${policy.basePolicyHash}\``,
    `Human view: \`${frontmatter.humanViewHash}\``,
    '',
    '## Qualified workflow projections',
    '',
    ...projectionTable(snapshot.projectionGraph.rows),
    '',
    '## Admission and precedence',
    '',
    'Forbidden input rejects first. Explicit dual-mode requests use the authored tie-break order. '
      + 'Weighted signals select one mode; a score within the authored ambiguity delta clarifies once. '
      + 'Zero signal routes the authored default mode with bounded-default basis.',
    '',
    '## Bundle grammar',
    '',
    'Single routes and the authored two-mode ordered bundle are legal. No surface bundle exists.',
    '',
    '## Document-only routing snapshot',
    '',
    '```json',
    canonicalize(routingSnapshot),
    '```',
    '',
    '## Authority and lifecycle',
    '',
    'Destination authority remains withheld until VERIFY. The effect path is PREPARE → VERIFY → COMMIT → receipt.',
    '',
    '## Negative decisions',
    '',
    'Clarify, defer, and reject decisions are target-free and keep authority withheld.',
    '',
    '## Limitations',
    '',
    '- DOCUMENT_ONLY_UNATTESTED',
    '- PREPARED_DRAFT only',
    '- No live activation freshness or committed effects',
    '',
  ].join('\n');
  return { frontmatter, markdown, routingSnapshot };
}

function replayPolicyCard(markdown, input) {
  const decision = documentDecision(parseRoutingSnapshot(markdown), input);
  return {
    decision,
    ...(decision.action === 'route' ? { draftStatus: 'PREPARED_DRAFT' } : {}),
    terminal: 'DOCUMENT_ONLY_UNATTESTED',
  };
}

module.exports = {
  generatePolicyCard,
  replayPolicyCard,
  snapshotForCard,
};
