'use strict';

const { canonicalize } = require('../../../000-contract-schemas/lib/canonical.cjs');
const { evaluateRoute } = require('./router.cjs');

const CARD_MARKER = 'mcp-tooling-policy-card-v1';

function cardPayload(snapshot) {
  return {
    advisorProjection: snapshot.advisorProjection,
    destinationGraph: snapshot.destinationGraph,
    policy: snapshot.policy,
  };
}

function generatePolicyCard(snapshot) {
  const payload = canonicalize(cardPayload(snapshot));
  return [
    '---',
    'schemaVersion: V1',
    `effectivePolicyHash: ${snapshot.policy.effectivePolicyHash}`,
    `activationGeneration: ${snapshot.policy.activationGeneration}`,
    'terminal: DOCUMENT_ONLY_UNATTESTED',
    '---',
    '# MCP Tooling Policy Card',
    '',
    'This generated card routes from compiled destination, composition, and authority data.',
    'A document-only route may emit `PREPARED_DRAFT`; it cannot attest live activation or effects.',
    '',
    `\`\`\`${CARD_MARKER}`,
    payload,
    '\`\`\`',
    '',
  ].join('\n');
}

function parsePolicyCard(markdown) {
  const pattern = new RegExp('```' + CARD_MARKER + '\\n([\\s\\S]+?)\\n```');
  const match = pattern.exec(markdown);
  if (!match) throw new TypeError('compiled policy payload is absent from policy card');
  return JSON.parse(match[1]);
}

function replayPolicyCard(markdown, input) {
  const parsed = parsePolicyCard(markdown);
  const result = evaluateRoute(parsed, input);
  return Object.freeze({
    decision: result.decision,
    draftStatus: result.decision.action === 'route' ? 'PREPARED_DRAFT' : null,
    terminal: 'DOCUMENT_ONLY_UNATTESTED',
  });
}

module.exports = {
  generatePolicyCard,
  parsePolicyCard,
  replayPolicyCard,
};
