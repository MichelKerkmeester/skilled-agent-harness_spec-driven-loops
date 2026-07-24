// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: CLI EXTERNAL ORCHESTRATION POLICY CARD                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { canonicalize } = require('../../../000-contract-schemas/lib/canonical.cjs');
const { evaluateRoute } = require('./router.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CARD_MARKER = 'cli-external-orchestration-policy-card-v1';

// ─────────────────────────────────────────────────────────────────────────────
// 3. POLICY CARD
// ─────────────────────────────────────────────────────────────────────────────

function cardPayload(snapshot) {
  return {
    advisorProjection: snapshot.advisorProjection,
    destinationGraph: snapshot.destinationGraph,
    policy: snapshot.policy,
  };
}

/**
 * Generate a document-only projection from the same compiled snapshot.
 *
 * @param {Object} snapshot - Compiled policy and projections.
 * @returns {string} Deterministic Markdown policy card.
 */
function generatePolicyCard(snapshot) {
  return [
    '---',
    'schemaVersion: V1',
    `effectivePolicyHash: ${snapshot.policy.effectivePolicyHash}`,
    `activationGeneration: ${snapshot.policy.activationGeneration}`,
    'terminal: DOCUMENT_ONLY_UNATTESTED',
    '---',
    '# CLI External Orchestration Policy Card',
    '',
    'This generated card routes from the compiled executor policy.',
    'A document-only route may prepare a draft; it cannot attest a CLI effect.',
    '',
    `\`\`\`${CARD_MARKER}`,
    canonicalize(cardPayload(snapshot)),
    '\`\`\`',
    '',
  ].join('\n');
}

/**
 * Parse the canonical payload embedded in a generated policy card.
 *
 * @param {string} markdown - Generated policy-card Markdown.
 * @returns {Object} Compiled snapshot payload.
 */
function parsePolicyCard(markdown) {
  const pattern = new RegExp('```' + CARD_MARKER + '\\n([\\s\\S]+?)\\n```');
  const match = pattern.exec(markdown);
  if (!match) throw new TypeError('compiled payload is absent from policy card');
  return JSON.parse(match[1]);
}

/**
 * Replay the document payload without consulting the machine snapshot.
 *
 * @param {string} markdown - Generated policy-card Markdown.
 * @param {Object} input - Prompt-bearing route input.
 * @returns {Object} Document-only decision envelope.
 */
function replayPolicyCard(markdown, input) {
  const result = evaluateRoute(parsePolicyCard(markdown), input);
  return Object.freeze({
    decision: result.decision,
    draftStatus: result.decision.action === 'route' ? 'PREPARED_DRAFT' : null,
    terminal: 'DOCUMENT_ONLY_UNATTESTED',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  generatePolicyCard,
  parsePolicyCard,
  replayPolicyCard,
};
