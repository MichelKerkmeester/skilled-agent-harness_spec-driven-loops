// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: COMPILED POLICY PROJECTIONS                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  canonicalize,
  computeProjectionHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');

const { qualifiedDestinationId } = require('./compiler.cjs');
const { compareUtf16 } = require('./order.cjs');

const ADVISOR_OMIT_KEYS = new Set([
  'commitauthority',
  'fence',
  'fences',
  'handofflease',
  'handoffleases',
  'mutationscope',
  'path',
  'paths',
  'tool',
  'tools',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function selectorIntent(selector) {
  return selector.id.replace(/^selector:/, '');
}

function buildRoutingTable(policy) {
  const detectors = new Map(policy.detectors.map((detector) => [detector.id, detector]));
  const policyValue = (id, fallback) => detectors.get(id)?.value ?? fallback;
  return {
    ambiguityDelta: policyValue('policy:ambiguity-delta', '1.0'),
    maximumIntents: Number(policyValue('policy:maximum-intents', '2')),
    negativeAdmissions: policy.detectors
      .filter((detector) => detector.kind === 'negative')
      .map((detector) => detector.value)
      .sort(compareUtf16),
    selectors: policy.selectors.map((selector) => ({
      intent: selectorIntent(selector),
      keywords: selector.detectorIds
        .filter((id) => id.startsWith('detector:signal:'))
        .map((id) => detectors.get(id)?.value)
        .filter(Boolean),
      resources: selector.detectorIds
        .filter((id) => id.startsWith('detector:leaf:'))
        .map((id) => detectors.get(id)?.value)
        .filter(Boolean)
        .sort(compareUtf16),
    })).sort((left, right) => compareUtf16(left.intent, right.intent)),
  };
}

function projectionResourceObservations(evaluation) {
  if (evaluation.decision.action !== 'route') return [];
  const intent = evaluation.diagnostics.selectedIntents[0];
  return evaluation.diagnostics.selectedResources.map((resource) => ({ intent, resource }));
}

function markdownList(values) {
  return values.length > 0 ? values.map((value) => `- ${value}`).join('\n') : '- None';
}

function advisorKey(key) {
  return key.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function omitAdvisorAuthority(value) {
  if (Array.isArray(value)) return value.map(omitAdvisorAuthority);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !ADVISOR_OMIT_KEYS.has(advisorKey(key)))
    .map(([key, child]) => [key, omitAdvisorAuthority(child)]));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MACHINE PROJECTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Project the decision-bearing subset consumed by the advisor.
 *
 * @param {Object} policy - CompiledPolicyV1 snapshot.
 * @param {Object} authoredSources - Normalized authored source model.
 * @returns {Object} AdvisorProjectionV1.
 */
function projectAdvisor(policy, authoredSources) {
  const projection = omitAdvisorAuthority({
    admissionLabels: [
      'positive-signal',
      ...authoredSources.negativeAdmissions.map((value) => `exclude:${value}`),
    ].sort(compareUtf16),
    aliases: [...authoredSources.aliases].sort(compareUtf16),
    effectivePolicyHash: policy.effectivePolicyHash,
    eligibleModes: policy.destinations
      .map((destination) => ({
        publicMode: destination.id.workflowMode,
        qualifiedId: qualifiedDestinationId(destination.id),
        routingClass: destination.role,
      }))
      .sort((left, right) => compareUtf16(left.qualifiedId, right.qualifiedId)),
    hubId: authoredSources.skillId,
    schemaVersion: 'V1',
  });
  const identities = projection.eligibleModes.map((mode) => mode.qualifiedId);
  if (new Set(identities).size !== identities.length) {
    throw new Error('advisor projection contains duplicate qualified mode identities');
  }
  projection.projectionHash = computeProjectionHash('AdvisorProjectionV1', projection);
  return projection;
}

/**
 * Project a typed decision and its legacy-compatible observations.
 *
 * @param {Object} policy - CompiledPolicyV1 snapshot.
 * @param {string} scenarioId - Stable scenario identifier.
 * @param {Object} evaluation - Shadow evaluator result.
 * @returns {Object} TypedRouteGoldV1.
 */
function projectTypedRouteGold(policy, scenarioId, evaluation) {
  const decision = evaluation.decision;
  const projection = {
    assertions: {
      duplicateIdempotencyKeyProducesSingleReceipt: false,
      handoffEdges: [],
      rankCalls: evaluation.diagnostics.rankCalls,
    },
    decisionAction: decision.action,
    effectivePolicyHash: policy.effectivePolicyHash,
    observedIntents: decision.action === 'route'
      ? [...evaluation.diagnostics.selectedIntents]
      : [],
    observedResources: projectionResourceObservations(evaluation),
    receiptAttempts: [],
    scenarioId,
    schemaVersion: 'V1',
    targetQualifiedIds: decision.action === 'route'
      ? decision.route.targets.map((target) => qualifiedDestinationId(target.destinationId))
      : [],
    ...(decision.action === 'route' ? { selectionKind: decision.route.selectionKind } : {}),
  };
  projection.projectionHash = computeProjectionHash('TypedRouteGoldV1', projection);
  return projection;
}

/**
 * Adapt typed observations to the shared scorer's legacy string arrays.
 *
 * @param {Object} typedGold - TypedRouteGoldV1 projection.
 * @returns {{observedIntents:string[],observedResources:string[]}} Legacy observation.
 */
function projectLegacyObservation(typedGold) {
  if (typedGold.decisionAction !== 'route') {
    return { observedIntents: [], observedResources: [] };
  }
  return {
    observedIntents: [...typedGold.observedIntents],
    observedResources: typedGold.observedResources.map((entry) => entry.resource),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HUMAN PROJECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate the complete document-only policy card from one compiled snapshot.
 *
 * @param {Object} policy - CompiledPolicyV1 snapshot.
 * @param {Object} authoredSources - Normalized authored source model.
 * @returns {{frontmatter:Object,markdown:string}} Generated human projection.
 */
function generatePolicyCard(policy, authoredSources) {
  const routingTable = buildRoutingTable(policy);
  const frontmatter = {
    admission: [
      'positive selector signal routes',
      'zero signal defers with no-match',
      'negative admission rejects as forbidden',
    ],
    authorityEdges: policy.authorityGraph.map((edge) => (
      `${edge.fromAuthorityRef} ${edge.relation} ${qualifiedDestinationId(edge.toDestinationId)}`
    )),
    bundleGrammar: [
      'single',
      ...policy.compositionRules.map((rule) => rule.kind),
    ],
    effectivePolicyHash: policy.effectivePolicyHash,
    hubId: authoredSources.skillId,
    lifecycleChecklist: ['prepare', 'verify', 'commit', 'receipt'],
    limitations: [
      'DOCUMENT_ONLY_UNATTESTED',
      'PREPARED_DRAFT',
      'No live activation freshness',
      'No calibrated probability',
      'No committed effects',
    ],
    negativeReasons: ['forbidden', 'no-match'],
    qualifiedRoles: policy.destinations.map((destination) => (
      `${destination.id.skillId}/${destination.id.workflowMode}:${destination.role}`
    )),
    recoveryBudget: 'one clarify turn; no handoff when the handoff collection is empty',
    schemaVersion: 'V1',
    thresholdPolicy: policy.thresholdPolicy.kind,
  };
  frontmatter.humanViewHash = computeProjectionHash(
    'PolicyCardV1',
    frontmatter,
    'humanViewHash',
  );

  const posture = [
    `- T: ${policy.thresholdPolicy.kind}`,
    `- R: ${policy.recoveryPolicy.ladder.join(' → ')}`,
    `- P: ${policy.provenancePolicy.kind}`,
  ].join('\n');
  const markdown = [
    '---',
    canonicalize(frontmatter),
    '---',
    '',
    '# Compiled Router Policy Card',
    '',
    '## Identity',
    '',
    `Effective policy: \`${policy.effectivePolicyHash}\``,
    `Human view: \`${frontmatter.humanViewHash}\``,
    '',
    '## Admission and precedence',
    '',
    'Negative admission wins first. Positive selector evidence routes one destination. '
      + 'Near-tied selector evidence asks exactly one clarification. Zero signal defers with '
      + '`no-match`; it never defaults to the only destination.',
    '',
    '## Document-only routing table',
    '',
    '```json',
    canonicalize(routingTable),
    '```',
    '',
    '## Posture',
    '',
    posture,
    '',
    '## Qualified roles',
    '',
    markdownList(frontmatter.qualifiedRoles),
    '',
    '## Authority',
    '',
    'Route output is evidence with `WithheldUntilVerify`; negative decisions use `Withheld`. '
      + 'The advisory route guard is not VERIFY. Only the destination lifecycle can consume authority.',
    '',
    '## Lifecycle',
    '',
    'A document-only reader may emit `PREPARED_DRAFT`. It cannot attest activation freshness, '
      + 'destination readiness, or effects, so its honest terminal is `DOCUMENT_ONLY_UNATTESTED`.',
    '',
    '## Limitations',
    '',
    markdownList(frontmatter.limitations),
    '',
  ].join('\n');
  return { frontmatter, markdown };
}

/**
 * Replay only the generated card's embedded document table.
 *
 * @param {string} markdown - Generated policy card text.
 * @param {string} taskText - Task to route without machine-policy access.
 * @returns {Object} Document-only decision and honest terminal state.
 */
function replayPolicyCard(markdown, taskText) {
  const match = /## Document-only routing table\n\n```json\n([^\n]+)\n```/m.exec(markdown);
  if (!match) throw new Error('policy card routing table is missing');
  const table = JSON.parse(match[1]);
  const text = String(taskText || '').toLowerCase();
  const negative = table.negativeAdmissions.find((value) => text.includes(value));
  if (negative) {
    return { action: 'reject', reason: 'forbidden', terminal: 'DOCUMENT_ONLY_UNATTESTED' };
  }
  const scores = table.selectors.map((selector) => ({
    score: selector.keywords.reduce(
      (total, keyword) => total + (text.includes(keyword) ? 1 : 0),
      0,
    ),
    selector,
  })).filter((entry) => entry.score > 0)
    .sort((left, right) => (
      right.score - left.score || compareUtf16(left.selector.intent, right.selector.intent)
    ));
  if (scores.length === 0) {
    return { action: 'defer', reason: 'no-match', terminal: 'DOCUMENT_ONLY_UNATTESTED' };
  }
  const selected = scores
    .filter((entry) => scores[0].score - entry.score <= Number(table.ambiguityDelta))
    .slice(0, table.maximumIntents);
  if (selected.length > 1) {
    return {
      action: 'clarify',
      alternatives: [...selected.map((entry) => entry.selector.intent), 'none_of_these'],
      terminal: 'DOCUMENT_ONLY_UNATTESTED',
    };
  }
  return {
    action: 'route',
    draftStatus: 'PREPARED_DRAFT',
    intent: selected[0].selector.intent,
    resources: [...selected[0].selector.resources],
    terminal: 'DOCUMENT_ONLY_UNATTESTED',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  buildRoutingTable,
  generatePolicyCard,
  omitAdvisorAuthority,
  projectAdvisor,
  projectLegacyObservation,
  projectTypedRouteGold,
  replayPolicyCard,
};
