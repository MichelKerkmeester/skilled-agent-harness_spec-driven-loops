#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ design-token-lint — static design proof token shape check                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Static shape lint for design proof tokens crossing a dispatch boundary.
 *
 * Boundary-side freshness, replay consumption, payload recomputation, and file
 * re-hashing belong to live validators. This lint fails closed on missing or
 * weakened proof shape so fixture replay can catch token stripping.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const ISO_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;

const REQUIRED_FIELDS = [
  'version',
  'loadedFiles',
  'workflowModes',
  'subjectDigest',
  'briefDigest',
  'formAnswersDigest',
  'openDesignLineageDigest',
  'issuedAt',
  'expiresAt',
  'singleUse',
  'nonce',
  'runId',
  'mintedBy',
  'boundSurface',
];

const REQUIRED_DIGEST_FIELDS = [
  'subjectDigest',
  'briefDigest',
  'formAnswersDigest',
  'openDesignLineageDigest',
];

const REQUIRED_MANIFEST_PATHS = [
  '.opencode/skills/sk-design/SKILL.md',
  '.opencode/skills/sk-design/shared/context_loading_contract.md',
  '.opencode/skills/sk-design/shared/register.md',
  '.opencode/skills/sk-design/shared/assets/proof_of_application_card.md',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function addFinding(findings, code, path, message) {
  findings.push({ code, path, message });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoUtc(value) {
  return isNonEmptyString(value) && ISO_UTC_RE.test(value) && !Number.isNaN(Date.parse(value));
}

function extractToken(payload) {
  if (!isObject(payload)) return null;
  if (isObject(payload.designProofToken)) return payload.designProofToken;
  if (isObject(payload.design_proof_token)) return payload.design_proof_token;
  if (isObject(payload.token)) return payload.token;
  if (isObject(payload.dispatchPayload) && isObject(payload.dispatchPayload.designProofToken)) {
    return payload.dispatchPayload.designProofToken;
  }
  if (isObject(payload.public) && isObject(payload.public.dispatchPayload)
    && isObject(payload.public.dispatchPayload.designProofToken)) {
    return payload.public.dispatchPayload.designProofToken;
  }
  return payload.version === 1 ? payload : null;
}

function lintRequiredFields(token, findings) {
  for (const field of REQUIRED_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(token, field)) {
      addFinding(findings, 'missing-required-field', field, `${field} is required`);
    }
  }
}

function lintDigestField(token, field, findings) {
  if (!DIGEST_RE.test(token[field] || '')) {
    addFinding(findings, 'malformed-digest', field, `${field} must be sha256:<64 lowercase hex>`);
  }
}

function lintLoadedFiles(token, findings) {
  if (!Array.isArray(token.loadedFiles) || token.loadedFiles.length === 0) {
    addFinding(findings, 'invalid-loaded-files', 'loadedFiles', 'loadedFiles must be a non-empty array');
    return;
  }

  const loadedPaths = new Set();
  token.loadedFiles.forEach((entry, index) => {
    const prefix = `loadedFiles[${index}]`;
    if (!isObject(entry)) {
      addFinding(findings, 'invalid-loaded-file-entry', prefix, `${prefix} must be an object`);
      return;
    }
    if (!isNonEmptyString(entry.path)) {
      addFinding(findings, 'invalid-loaded-file-path', `${prefix}.path`, `${prefix}.path must be a non-empty string`);
    } else {
      loadedPaths.add(entry.path);
    }
    if (!DIGEST_RE.test(entry.sha256 || '')) {
      addFinding(findings, 'malformed-loaded-file-digest', `${prefix}.sha256`, `${prefix}.sha256 must be sha256:<64 lowercase hex>`);
    }
  });

  for (const requiredPath of REQUIRED_MANIFEST_PATHS) {
    if (!loadedPaths.has(requiredPath)) {
      addFinding(findings, 'missing-manifest-path', 'loadedFiles', `loadedFiles must include ${requiredPath}`);
    }
  }
}

function lintWorkflowModes(token, findings) {
  if (!Array.isArray(token.workflowModes) || token.workflowModes.length === 0) {
    addFinding(findings, 'invalid-workflow-modes', 'workflowModes', 'workflowModes must be a non-empty array');
    return;
  }
  token.workflowModes.forEach((mode, index) => {
    if (!isNonEmptyString(mode)) {
      addFinding(findings, 'invalid-workflow-mode', `workflowModes[${index}]`, `workflowModes[${index}] must be a non-empty string`);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lint a design proof token payload for static v1 presence and shape rules.
 *
 * @param {Object} payload - Raw token or fixture-style envelope.
 * @returns {{verdict:'valid'|'rejected', findings:Array}} Lint verdict.
 */
function lintDesignToken(payload) {
  const findings = [];
  const token = extractToken(payload);

  if (!token) {
    addFinding(findings, 'missing-token', 'designProofToken', 'designProofToken is required');
    return { verdict: 'rejected', findings };
  }

  lintRequiredFields(token, findings);

  if (token.version !== 1) {
    addFinding(findings, 'unsupported-version', 'version', 'version must be 1');
  }

  lintLoadedFiles(token, findings);
  lintWorkflowModes(token, findings);

  for (const field of REQUIRED_DIGEST_FIELDS) lintDigestField(token, field, findings);

  if (!isIsoUtc(token.issuedAt)) {
    addFinding(findings, 'invalid-issued-at', 'issuedAt', 'issuedAt must be an ISO-8601 UTC string');
  }
  if (!isIsoUtc(token.expiresAt)) {
    addFinding(findings, 'invalid-expires-at', 'expiresAt', 'expiresAt must be an ISO-8601 UTC string');
  }

  if (token.singleUse !== true) {
    addFinding(findings, 'single-use-not-true', 'singleUse', 'singleUse must be the boolean true');
  }
  if (!isNonEmptyString(token.nonce)) {
    addFinding(findings, 'missing-nonce', 'nonce', 'nonce is required when singleUse is true');
  }
  if (!isNonEmptyString(token.runId)) {
    addFinding(findings, 'missing-run-id', 'runId', 'runId is required when singleUse is true');
  }
  if (!isNonEmptyString(token.mintedBy)) {
    addFinding(findings, 'invalid-minted-by', 'mintedBy', 'mintedBy must be a non-empty string');
  }
  if (!isNonEmptyString(token.boundSurface)) {
    addFinding(findings, 'invalid-bound-surface', 'boundSurface', 'boundSurface must be a non-empty string');
  }

  return { verdict: findings.length === 0 ? 'valid' : 'rejected', findings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { lintDesignToken };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.file) {
    process.stderr.write('usage: design-token-lint.cjs --file <payload.json>\n');
    process.exit(2);
  }

  try {
    const payload = JSON.parse(fs.readFileSync(args.file, 'utf8'));
    const result = lintDesignToken(payload);
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exit(result.verdict === 'valid' ? 0 : 1);
  } catch (err) {
    process.stderr.write(`design-token-lint: ${err.message}\n`);
    process.exit(2);
  }
}
