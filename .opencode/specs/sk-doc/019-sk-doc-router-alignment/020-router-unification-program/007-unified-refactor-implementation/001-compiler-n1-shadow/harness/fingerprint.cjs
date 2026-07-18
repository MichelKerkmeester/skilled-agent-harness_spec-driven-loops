// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ SCRIPT: PROCESS-ISOLATED POLICY FINGERPRINT                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  canonicalBytes,
} = require('../../000-contract-schemas/lib/canonical.cjs');

const { buildAuthoredSources, compile } = require('../compiler/index.cjs');
const { loadAuthoredSources, sha256Bytes } = require('./support.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function loadLocaleFixture() {
  return buildAuthoredSources({
    activationGeneration: 1,
    guardSource: [
      "decision: 'allow'",
      "decision: 'warn'",
      "Fail open decision: 'allow'",
    ].join('\n'),
    leafManifest: {
      modes: [{ leaves: ['z.md', 'ä.md'], packet: '.', workflowMode: 'locale-mode' }],
      resourceContractVersion: 1,
    },
    skillMarkdown: [
      'name: locale-fixture',
      'INTENT_SIGNALS = {',
      '  "z": {"weight": 1, "keywords": ["z"]},',
      '  "ä": {"weight": 1, "keywords": ["ä"]},',
      '}',
      'RESOURCE_MAP = {',
      '  "z": ["z.md"],',
      '  "ä": ["ä.md"],',
      '}',
      'mcp__code_mode__call_tool_chain',
    ].join('\n'),
  });
}

const authoredSources = process.env.SHADOW_FINGERPRINT_FIXTURE === 'locale'
  ? loadLocaleFixture()
  : loadAuthoredSources();
const policy = compile(authoredSources);
process.stdout.write(`${JSON.stringify({
  bodySha256: sha256Bytes(canonicalBytes(policy)),
  effectivePolicyHash: policy.effectivePolicyHash,
})}\n`);
