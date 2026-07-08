#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ design-dispatch-boundary-proof — boundary proof and asset parity check   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Static boundary proof check for sk-design child dispatch. It rejects missing
 * or weakened DESIGN_BOUNDARY_PROOF envelopes and checks that the canonical
 * boundary asset remains referenced from the interface mode.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DIGEST_RE = /^sha256:[a-f0-9]{64}$/;
const CANONICAL_ASSET_REL = 'shared/design_dispatch_boundary.md';
const DESIGN_INTERFACE_REL = 'design-interface/SKILL.md';
const DESIGN_INTERFACE_REF = '../shared/design_dispatch_boundary.md';

const REQUIRED_PAYLOAD_DIGESTS = [
  'contextManifestDigest',
  'designDispatchManifestDigest',
  'proofOfApplicationCardDigest',
];

const CONTRACT_MARKERS = [
  'DESIGN_BOUNDARY_PROOF v1',
  '`version`',
  '`routedMode`',
  '`payloadDigests`',
  '`designProofTokenRef`',
  '`assetDigest`',
  'Current copy set: canonical-only',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function addFinding(findings, code, locus, message) {
  findings.push({ code, path: locus, message });
}

function stringList(value) {
  if (Array.isArray(value)) {
    return value.filter(isNonEmptyString).map((entry) => entry.trim());
  }
  if (isNonEmptyString(value)) return [value.trim()];
  return [];
}

function normalizeContent(value) {
  return String(value || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function resolveFrom(baseDir, filePath) {
  if (!filePath) return null;
  return path.isAbsolute(filePath) ? filePath : path.resolve(baseDir, filePath);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function digestBytes(buffer) {
  return `sha256:${crypto.createHash('sha256').update(buffer).digest('hex')}`;
}

function digestText(value) {
  return digestBytes(Buffer.from(String(value), 'utf8'));
}

function digestFile(filePath) {
  return digestBytes(fs.readFileSync(filePath));
}

function firstObject(...values) {
  for (const value of values) {
    if (isObject(value)) return value;
  }
  return null;
}

function extractBoundaryProof(payload) {
  if (!isObject(payload)) return null;

  const dispatchPayload = firstObject(
    payload.dispatchPayload,
    payload.public && payload.public.dispatchPayload,
  );

  return firstObject(
    payload.designBoundaryProof,
    payload.design_boundary_proof,
    payload.DESIGN_BOUNDARY_PROOF,
    dispatchPayload && dispatchPayload.designBoundaryProof,
    dispatchPayload && dispatchPayload.design_boundary_proof,
    dispatchPayload && dispatchPayload.DESIGN_BOUNDARY_PROOF,
    payload.routedMode ? payload : null,
  );
}

function hasUnparseableFinding(result) {
  return (result.findings || []).some((finding) => {
    return finding.code === 'unparseable-input' || finding.code === 'invalid-input';
  });
}

function parseCopies(args) {
  const raw = args.copies || args.copy || '';
  if (!isNonEmptyString(raw)) return [];
  return raw.split(',').map((entry) => entry.trim()).filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENVELOPE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function lintDigestMap(digests, findings) {
  if (!isObject(digests)) {
    addFinding(findings, 'missing-digest-map', 'payloadDigests', 'payloadDigests is required');
    return;
  }

  for (const field of REQUIRED_PAYLOAD_DIGESTS) {
    const value = digests[field];
    if (!Object.prototype.hasOwnProperty.call(digests, field)) {
      addFinding(findings, 'missing-digest', `payloadDigests.${field}`, `${field} is required`);
    } else if (!DIGEST_RE.test(value || '')) {
      addFinding(findings, 'malformed-digest', `payloadDigests.${field}`, `${field} must be sha256:<64 lowercase hex>`);
    }
  }
}

function lintRoutedMode(routedMode, expectedWorkflowMode, findings) {
  if (!isObject(routedMode)) {
    addFinding(findings, 'missing-routed-mode-binding', 'routedMode', 'routedMode is required');
    return;
  }

  if (routedMode.routeDeclaration !== 'ROUTED') {
    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.routeDeclaration', 'routeDeclaration must be ROUTED');
  }

  const expected = expectedWorkflowMode || routedMode.expectedWorkflowMode;
  if (!isNonEmptyString(expected)) {
    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.expectedWorkflowMode', 'expectedWorkflowMode is required');
  }

  if (!isNonEmptyString(routedMode.expectedWorkflowMode)) {
    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.expectedWorkflowMode', 'expectedWorkflowMode is required in the envelope');
  } else if (expected && routedMode.expectedWorkflowMode !== expected) {
    addFinding(findings, 'routed-mode-mismatch', 'routedMode.expectedWorkflowMode', 'expectedWorkflowMode must match the route expectation');
  }

  if (!isNonEmptyString(routedMode.observedWorkflowMode)) {
    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.observedWorkflowMode', 'observedWorkflowMode is required');
  } else if (expected && routedMode.observedWorkflowMode !== expected) {
    addFinding(findings, 'routed-mode-mismatch', 'routedMode.observedWorkflowMode', 'observedWorkflowMode must match the route expectation');
  }

  const observedIntents = stringList(routedMode.observedIntents);
  if (!Array.isArray(routedMode.observedIntents)) {
    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.observedIntents', 'observedIntents must be an array including observedWorkflowMode');
  } else if (observedIntents.length === 0) {
    addFinding(findings, 'missing-routed-mode-binding', 'routedMode.observedIntents', 'observedIntents must include the observed workflow mode');
  } else if (isNonEmptyString(routedMode.observedWorkflowMode) && !observedIntents.includes(routedMode.observedWorkflowMode)) {
    addFinding(findings, 'routed-mode-mismatch', 'routedMode.observedIntents', 'observedIntents must include observedWorkflowMode');
  }
}

function lintTokenRef(tokenRef, findings) {
  if (!isObject(tokenRef)) {
    addFinding(findings, 'missing-token-ref', 'designProofTokenRef', 'designProofTokenRef is required');
    return;
  }
  if (!isNonEmptyString(tokenRef.nonce)) {
    addFinding(findings, 'missing-token-ref', 'designProofTokenRef.nonce', 'nonce is required');
  }
  if (!isNonEmptyString(tokenRef.runId)) {
    addFinding(findings, 'missing-token-ref', 'designProofTokenRef.runId', 'runId is required');
  }
}

/**
 * Lint a DESIGN_BOUNDARY_PROOF payload for v1 shape and routed-mode binding.
 *
 * @param {Object} payload - Raw fixture, dispatch payload, or envelope.
 * @param {Object} [options] - Expected route and asset binding.
 * @param {string} [options.expectedWorkflowMode] - Route expectation.
 * @param {string} [options.expectedAssetDigest] - Canonical asset digest.
 * @returns {{verdict:'valid'|'rejected', findings:Array}} Lint verdict.
 */
function lintDesignBoundaryProof(payload, options = {}) {
  const findings = [];
  const proof = extractBoundaryProof(payload);

  if (!proof) {
    addFinding(findings, 'missing-boundary-proof', 'designBoundaryProof', 'DESIGN_BOUNDARY_PROOF v1 is required');
    return { verdict: 'rejected', findings };
  }

  if (proof.version !== 1) {
    addFinding(findings, 'unsupported-version', 'version', 'version must be 1');
  }

  lintRoutedMode(proof.routedMode, options.expectedWorkflowMode, findings);
  lintDigestMap(proof.payloadDigests, findings);
  lintTokenRef(proof.designProofTokenRef, findings);

  if (!DIGEST_RE.test(proof.assetDigest || '')) {
    addFinding(findings, proof.assetDigest ? 'malformed-digest' : 'missing-digest', 'assetDigest', 'assetDigest must be sha256:<64 lowercase hex>');
  } else if (options.expectedAssetDigest && proof.assetDigest !== options.expectedAssetDigest) {
    addFinding(findings, 'asset-digest-mismatch', 'assetDigest', 'assetDigest must match the canonical design dispatch boundary asset');
  }

  return { verdict: findings.length === 0 ? 'valid' : 'rejected', findings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PARITY LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function lintCanonicalAsset({ canonicalText, skillRoot, findings }) {
  for (const marker of CONTRACT_MARKERS) {
    if (!canonicalText.includes(marker)) {
      addFinding(findings, 'missing-contract-marker', CANONICAL_ASSET_REL, `canonical asset must include ${marker}`);
    }
  }

  if (!skillRoot) return;
  const skillPath = path.join(skillRoot, DESIGN_INTERFACE_REL);
  try {
    const skillText = readText(skillPath);
    if (!skillText.includes('DESIGN_BOUNDARY_PROOF v1') || !skillText.includes(DESIGN_INTERFACE_REF)) {
      addFinding(findings, 'missing-skill-reference', DESIGN_INTERFACE_REL, `design-interface dispatch criteria must reference ${DESIGN_INTERFACE_REF}`);
    }
  } catch (err) {
    addFinding(findings, 'unparseable-input', DESIGN_INTERFACE_REL, err.message);
  }
}

function checkCopy({ canonicalText, copyPath, baseDir }) {
  const resolved = resolveFrom(baseDir, copyPath);
  try {
    if (!fs.existsSync(resolved)) {
      return {
        path: copyPath,
        digest: null,
        matchesCanonical: false,
        finding: { code: 'missing-copy', path: copyPath, message: 'declared copy is missing' },
      };
    }
    const copyText = readText(resolved);
    const matchesCanonical = normalizeContent(copyText) === normalizeContent(canonicalText);
    return {
      path: copyPath,
      digest: digestText(copyText),
      matchesCanonical,
      finding: matchesCanonical ? null : { code: 'asset-copy-drift', path: copyPath, message: 'declared copy differs from the canonical asset' },
    };
  } catch (err) {
    return {
      path: copyPath,
      digest: null,
      matchesCanonical: false,
      finding: { code: 'unparseable-input', path: copyPath, message: err.message },
    };
  }
}

/**
 * Check the design dispatch boundary asset and any declared duplicate copies.
 *
 * @param {Object} args - Parity inputs.
 * @param {string} [args.skillRoot] - sk-design skill root.
 * @param {string} [args.canonicalPath] - Canonical asset path override.
 * @param {string[]} [args.copies] - Declared duplicate copies.
 * @returns {Object} Parity report.
 */
function checkDesignDispatchBoundaryParity({ skillRoot, canonicalPath, copies = [] } = {}) {
  const findings = [];
  const baseDir = skillRoot ? path.resolve(skillRoot) : process.cwd();
  const canonical = canonicalPath
    ? resolveFrom(process.cwd(), canonicalPath)
    : skillRoot
      ? path.join(baseDir, CANONICAL_ASSET_REL)
      : null;

  if (!canonical) {
    addFinding(findings, 'invalid-input', 'canonicalPath', 'skillRoot or canonicalPath is required');
    return {
      verdict: 'rejected',
      driftDetected: false,
      copySetDecision: 'invalid-input',
      canonicalPath: null,
      canonicalDigest: null,
      copies: [],
      findings,
    };
  }

  let canonicalText = '';
  try {
    canonicalText = readText(canonical);
  } catch (err) {
    addFinding(findings, 'unparseable-input', canonical, err.message);
    return {
      verdict: 'rejected',
      driftDetected: false,
      copySetDecision: 'unreadable-canonical',
      canonicalPath: canonical,
      canonicalDigest: null,
      copies: [],
      findings,
    };
  }

  lintCanonicalAsset({ canonicalText, skillRoot: skillRoot ? baseDir : null, findings });

  const copyBaseDir = skillRoot ? baseDir : process.cwd();
  const copyReports = copies.map((copyPath) => checkCopy({ canonicalText, copyPath, baseDir: copyBaseDir }));
  for (const report of copyReports) {
    if (report.finding) findings.push(report.finding);
  }

  const driftDetected = findings.some((finding) => {
    return finding.code !== 'unparseable-input' && finding.code !== 'invalid-input';
  });

  return {
    verdict: findings.length === 0 ? 'valid' : 'rejected',
    driftDetected,
    copySetDecision: copies.length === 0 ? 'canonical-only' : 'declared-copies',
    canonicalPath: canonical,
    canonicalDigest: digestText(canonicalText),
    copies: copyReports,
    findings,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  checkDesignDispatchBoundaryParity,
  digestFile,
  extractBoundaryProof,
  lintDesignBoundaryProof,
};

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));

  try {
    if (args.file) {
      const payload = JSON.parse(fs.readFileSync(args.file, 'utf8'));
      const skillRoot = args['skill-root'] ? path.resolve(args['skill-root']) : null;
      const assetPath = args.asset
        ? path.resolve(args.asset)
        : skillRoot
          ? path.join(skillRoot, CANONICAL_ASSET_REL)
          : null;
      const result = lintDesignBoundaryProof(payload, {
        expectedWorkflowMode: args['expected-mode'],
        expectedAssetDigest: assetPath ? digestFile(assetPath) : null,
      });
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      process.exit(result.verdict === 'valid' ? 0 : 1);
    }

    const result = checkDesignDispatchBoundaryParity({
      skillRoot: args['skill-root'] ? path.resolve(args['skill-root']) : null,
      canonicalPath: args.asset,
      copies: parseCopies(args),
    });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    if (hasUnparseableFinding(result)) process.exit(2);
    process.exit(result.verdict === 'valid' ? 0 : 1);
  } catch (err) {
    process.stderr.write(`[design-dispatch-boundary-proof] ${err.message}\n`);
    process.exit(2);
  }
}
