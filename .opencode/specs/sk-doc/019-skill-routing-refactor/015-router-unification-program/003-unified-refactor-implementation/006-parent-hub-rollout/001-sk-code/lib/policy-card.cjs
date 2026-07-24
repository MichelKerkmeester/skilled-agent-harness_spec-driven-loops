// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: DOCUMENT-ONLY POLICY CARD                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const {
  canonicalize,
  computeProjectionHash,
  computeRequestFactsHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  parseRouteDecisionShape,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

function target(destination) {
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function documentBudgetRef(card, prompt) {
  const request = {
    schemaVersion: 'V1',
    observations: [{ kind: 'intent', value: prompt }],
    evidence: [{
      id: 'runtime:activation',
      kind: 'runtime',
      provenance: { capturedAtEpoch: card.activationGeneration, source: 'fenced-selector' },
      trust: 'live',
      value: canonicalize({
        activationGeneration: card.activationGeneration,
        effectivePolicyHash: card.effectivePolicyHash,
      }),
    }],
    pinnedActivationGeneration: card.activationGeneration,
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return `budget:${request.requestFactsHash.slice(0, 16)}`;
}

function snapshotForCard(snapshot) {
  const policy = snapshot.policy;
  const detectorById = new Map(policy.detectors.map((detector) => [detector.id, detector]));
  return {
    activationGeneration: policy.activationGeneration,
    basePolicyHash: policy.basePolicyHash,
    compositionRules: policy.compositionRules,
    destinations: policy.destinations,
    effectivePolicyHash: policy.effectivePolicyHash,
    fallbackChecklist: snapshot.fallbackChecklist,
    selectors: policy.selectors.map((selector) => ({
      destinationId: selector.destinationId,
      keywords: selector.detectorIds.map((id) => detectorById.get(id)?.value).filter(Boolean),
    })),
    sourceHashes: snapshot.sourceHashes,
  };
}

function generatePolicyCard(snapshot) {
  const policy = snapshot.policy;
  const routingSnapshot = snapshotForCard(snapshot);
  const frontmatter = {
    admission: ['positive-signal', 'zero-signal-defer', 'forbidden-reject'],
    authorityEdges: policy.authorityGraph.map((edge) => (
      `${edge.fromAuthorityRef} ${edge.relation} ${canonicalize(edge.toDestinationId)}`
    )),
    bundleGrammar: ['single', 'surfaceBundle'],
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
    qualifiedRoles: policy.destinations.map((destination) => (
      `${canonicalize(destination.id)}:${destination.role}:mutates=${destination.mutatesWorkspace}`
    )),
    recoveryBudget: 'one clarify turn; no handoff',
    schemaVersion: 'V1',
    thresholdPolicy: policy.thresholdPolicy.kind,
  };
  frontmatter.humanViewHash = computeProjectionHash('PolicyCardV1', frontmatter, 'humanViewHash');
  const markdown = [
    '---',
    canonicalize(frontmatter),
    '---',
    '',
    '# Compiled Router Policy Card',
    '',
    '## Identity and hashes',
    '',
    `Effective policy: \`${policy.effectivePolicyHash}\``,
    `Base policy: \`${policy.basePolicyHash}\``,
    `Human view: \`${frontmatter.humanViewHash}\``,
    `Authored sources: \`${snapshot.sourceHashes.map((entry) => entry.hash).join(',')}\``,
    '',
    '## Admission and precedence',
    '',
    'Forbidden input rejects first. Exact authored signals route. Ambiguous legal leaves clarify once. Zero signal defers with no match.',
    '',
    '## Qualified roles and bundle grammar',
    '',
    'A surface bundle contains one actor first, followed by one or more evidence targets in authored loading order.',
    '',
    '## Document-only routing snapshot',
    '',
    '```json',
    canonicalize(routingSnapshot),
    '```',
    '',
    '## Authority edges',
    '',
    'Actor authority remains withheld until VERIFY. Evidence authority is read-only and never reaches COMMIT.',
    '',
    '## Lifecycle checklist',
    '',
    'PREPARE → VERIFY → COMMIT → receipt for actors. Evidence terminates after read-only resolution.',
    '',
    '## Negative reasons',
    '',
    '`forbidden` rejects. `no-match` defers. Negative decisions carry no target, tool, or authority.',
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

function parseRoutingSnapshot(markdown) {
  const match = /## Document-only routing snapshot\n\n```json\n([^\n]+)\n```/m.exec(markdown);
  if (!match) throw new TypeError('document-only routing snapshot is missing');
  return JSON.parse(match[1]);
}

function destinationKey(id) {
  return canonicalize(id);
}

function documentDecision(card, prompt) {
  const text = String(prompt || '').toLowerCase();
  if (text.includes('forbidden')) {
    return parseRouteDecisionShape({
      action: 'reject',
      reject: { authority: 'Withheld', reason: 'forbidden' },
      schemaVersion: 'V1',
    });
  }
  const destinationByKey = new Map(card.destinations.map((entry) => [
    destinationKey(entry.id),
    entry,
  ]));
  const matchedKeys = new Set();
  for (const selector of card.selectors) {
    if (selector.keywords.some((keyword) => text.includes(keyword))) {
      matchedKeys.add(destinationKey(selector.destinationId));
    }
  }
  const matched = card.destinations.filter((entry) => matchedKeys.has(destinationKey(entry.id)));
  if (matched.length === 0 || matched.every((entry) => entry.role === 'evidence')) {
    return parseRouteDecisionShape({
      action: 'defer',
      defer: { authority: 'Withheld', reason: 'no-match', recovery: [] },
      schemaVersion: 'V1',
    });
  }
  if (matched.length === 1 && matched[0].role === 'actor') {
    return parseRouteDecisionShape({
      action: 'route',
      route: {
        authority: 'WithheldUntilVerify',
        basis: { kind: 'signal' },
        evidence: [],
        selectionKind: 'single',
        targets: [target(matched[0])],
      },
      schemaVersion: 'V1',
    });
  }
  const matchKeys = new Set(matched.map((entry) => destinationKey(entry.id)));
  const rule = card.compositionRules.find((entry) => (
    entry.targetIds.length === matchKeys.size
    && entry.targetIds.every((id) => matchKeys.has(destinationKey(id)))
  ));
  if (rule) {
    return parseRouteDecisionShape({
      action: 'route',
      route: {
        authority: 'WithheldUntilVerify',
        basis: { kind: 'signal' },
        evidence: [],
        selectionKind: 'surfaceBundle',
        targets: rule.targetIds.map((id) => target(destinationByKey.get(destinationKey(id)))),
      },
      schemaVersion: 'V1',
    });
  }
  return parseRouteDecisionShape({
    action: 'clarify',
    clarify: {
      alternatives: [...card.fallbackChecklist.slice(1, 4), 'none_of_these'],
      authority: 'Withheld',
      budgetRef: documentBudgetRef(card, prompt),
      question: card.fallbackChecklist[0],
    },
    schemaVersion: 'V1',
  });
}

/**
 * Replay only policy data embedded in the card and emit an unattested terminal.
 *
 * @param {string} markdown - Generated policy card.
 * @param {string} prompt - Request text.
 * @returns {Object} Typed decision plus honest document-only status.
 */
function replayPolicyCard(markdown, prompt) {
  const decision = documentDecision(parseRoutingSnapshot(markdown), prompt);
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
