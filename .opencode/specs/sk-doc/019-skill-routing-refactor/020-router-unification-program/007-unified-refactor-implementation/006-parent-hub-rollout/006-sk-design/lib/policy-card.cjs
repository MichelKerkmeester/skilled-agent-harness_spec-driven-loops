'use strict';

const {
  canonicalize,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const { evaluateCanary } = require('./router.cjs');

const CARD_MARKER = 'sk-design-policy-card-v1';

function cardPayload(snapshot) {
  return {
    advisorProjection: snapshot.advisorProjection,
    fallbackChecklist: snapshot.fallbackChecklist,
    manifestResources: snapshot.manifestResources,
    policy: snapshot.policy,
    routingModel: snapshot.routingModel,
  };
}

function generatePolicyCard(snapshot) {
  const frontmatter = {
    admission: ['positive-signal', 'zero-signal-defer', 'forbidden-reject'],
    authorityEdges: snapshot.policy.authorityGraph.map((edge) => (
      `${edge.fromAuthorityRef} ${edge.relation} ${canonicalize(edge.toDestinationId)}`
    )),
    bundleGrammar: ['single', 'orderedBundle'],
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    hubId: snapshot.advisorProjection.hubId,
    lifecycleChecklist: ['PREPARE', 'VERIFY', 'COMMIT', 'receipt'],
    limitations: ['DOCUMENT_ONLY_UNATTESTED', 'PREPARED_DRAFT', 'No committed effects'],
    negativeReasons: ['forbidden', 'no-match', 'dependency-failure'],
    qualifiedRoles: snapshot.policy.destinations.map((destination) => (
      `${destination.id.skillId}/${destination.id.workflowMode}:${destination.role}`
    )),
    recoveryBudget: 'one clarify turn; no handoff',
    schemaVersion: 'V1',
    thresholdPolicy: snapshot.policy.thresholdPolicy.kind,
  };
  frontmatter.humanViewHash = computeProjectionHash('PolicyCardV1', frontmatter, 'humanViewHash');
  const rows = snapshot.routingModel.tieBreak.map((mode) => {
    const row = snapshot.projectionGraph.rows.find((entry) => entry.workflowMode === mode);
    return `| \`${mode}\` | \`${row.packetRef}\` | \`${row.backendKind}\` | \`${row.role}\` | ${row.leafResources.length} |`;
  });
  return {
    frontmatter,
    markdown: [
      '---',
      canonicalize(frontmatter),
      '---',
      '',
      '# sk-design Compiled Router Policy Card',
      '',
      '## Modes and nested router leaves',
      '',
      '| Mode | Packet | Backend | Role | Leaf resources |',
      '| --- | --- | --- | --- | ---: |',
      ...rows,
      '',
      '## Admission and composition',
      '',
      'Forbidden input rejects first. One dominant design axis routes singly. The exact ui-build rule routes interface then foundations. Two explicitly separate axes route as an ordered bundle in tie-break order. Tied unjoined axes clarify once. Zero signal defers because defaultMode is null.',
      '',
      `\`\`\`${CARD_MARKER}`,
      canonicalize(cardPayload(snapshot)),
      '\`\`\`',
      '',
      '## Authority and limitations',
      '',
      'Route authority remains withheld until destination VERIFY. Read-only and transport destinations cannot COMMIT workspace effects. Negative decisions carry no target or authority. Document replay is unattested and cannot commit effects.',
      '',
    ].join('\n'),
  };
}

function parsePolicyCard(markdown) {
  const pattern = new RegExp(`\`\`\`${CARD_MARKER}\\n([\\s\\S]+?)\\n\`\`\``);
  const match = pattern.exec(markdown);
  if (!match) throw new TypeError('compiled policy payload is absent from policy card');
  return JSON.parse(match[1]);
}

function replayPolicyCard(markdown, input) {
  const snapshot = parsePolicyCard(markdown);
  const evaluated = evaluateCanary(snapshot, input);
  return {
    decision: evaluated.decision,
    ...(evaluated.decision.action === 'route' ? { draftStatus: 'PREPARED_DRAFT' } : {}),
    terminal: 'DOCUMENT_ONLY_UNATTESTED',
  };
}

module.exports = {
  generatePolicyCard,
  parsePolicyCard,
  replayPolicyCard,
};
