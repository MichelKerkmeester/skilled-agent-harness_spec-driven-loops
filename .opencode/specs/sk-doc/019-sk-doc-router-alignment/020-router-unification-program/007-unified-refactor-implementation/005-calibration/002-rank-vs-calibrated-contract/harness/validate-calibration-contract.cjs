#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Validate the Rank and Calibrated Route Contract                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  METHOD_ENVELOPE,
  assertProbabilityLegality,
  attachCalibration,
  evaluateCalibratedRoute,
  sealCertificate,
  validateCalibrationEnvelope,
  validateCertificate,
  validateRouteDecision,
} = require('../lib/calibration-contract.cjs');
const { CertificateRegistry } = require('../lib/certificate-registry.cjs');
const { projectAll } = require('../lib/compatibility-projector.cjs');
const {
  canonicalBytes,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  computeCorpusHash,
} = require('../../001-holdout-corpus/lib/calibration-corpus.cjs');
const {
  parseRouteDecisionShape,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TRUSTED PATHS AND DIGESTS
// ─────────────────────────────────────────────────────────────────────────────

function findRepoRoot(start) {
  let current = path.resolve(start);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.opencode'))) return current;
    current = path.dirname(current);
  }
  throw new Error('repository root is unavailable');
}

const PHASE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const FIXTURE_PATH = path.join(PHASE_ROOT, 'fixtures/calibration-cases.v1.json');
const IMPLEMENTATION_ROOT = path.join(
  REPO_ROOT,
  '.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program',
  '007-unified-refactor-implementation'
);
const CORPUS_DIRECTORY = path.join(
  IMPLEMENTATION_ROOT,
  '005-calibration/001-holdout-corpus/fixtures/corpora'
);
const SERVING_POLICY_PATH = path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/fixtures/compiled-policy.multimode.json'
);
const PROTECTED_DIGESTS = Object.freeze({
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs':
    'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs':
    'b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf',
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs':
    '249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde',
  '.opencode/skills/sk-code/mode-registry.json':
    '8caec917815b5704bcfb534f5d6b557403d76161678c87b327f6ecb35533ff91',
  '.opencode/skills/sk-code/SKILL.md':
    'c46a9cf4d2b62cd22703fdebbadeefd6afcffb7d3ff3cbdb774622aeeb508f91',
});
const SCORER_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
  'score-skill-benchmark.cjs'
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function digestFile(relativePath) {
  return sha256(fs.readFileSync(path.join(REPO_ROOT, relativePath)));
}

function assertProtectedDigests() {
  const actual = {};
  for (const [relativePath, expected] of Object.entries(PROTECTED_DIGESTS)) {
    actual[relativePath] = digestFile(relativePath);
    assert.strictEqual(
      actual[relativePath],
      expected,
      `protected file drifted: ${relativePath}`
    );
  }
  return actual;
}

function expectCode(operation, expectedCode, label) {
  let caught = null;
  try {
    operation();
  } catch (error) {
    caught = error;
  }
  assert.ok(caught, `${label} did not reject`);
  assert.strictEqual(caught.code, expectedCode, `${label} rejected for the wrong reason`);
  return caught.code;
}

function otherDigest(digest) {
  return `${digest.slice(0, -1)}${digest.endsWith('0') ? '1' : '0'}`;
}

function loadCorpora() {
  const index = new Map();
  for (const name of fs.readdirSync(CORPUS_DIRECTORY).sort()) {
    if (!name.endsWith('.json')) continue;
    const corpus = JSON.parse(
      fs.readFileSync(path.join(CORPUS_DIRECTORY, name), 'utf8')
    );
    assert.strictEqual(corpus.corpusId, corpus.corpusHash, `${name} identity is not whole-object`);
    assert.strictEqual(
      computeCorpusHash(corpus),
      corpus.corpusId,
      `${name} canonical bytes do not match declared identity`
    );
    index.set(corpus.corpusId, corpus);
  }
  return index;
}

function buildRegistry(candidate, attestation, fenceToken = 20) {
  const registry = new CertificateRegistry({
    fenceToken,
    trustedAttestations: [[candidate.certHash, attestation]],
  });
  const validated = registry.rotate(candidate, {
    expectedFenceToken: fenceToken,
    expectedActiveCertificateId: null,
  });
  return { registry, validated };
}

function attestationFor(candidate, template) {
  const attestation = clone(template);
  const method = METHOD_ENVELOPE.methods[candidate.method];
  attestation.corpusId = candidate.corpusId;
  attestation.policyHash = candidate.policyHash;
  attestation.riskSlice = candidate.riskSlice;
  attestation.generation = candidate.generation;
  attestation.method = candidate.method;
  attestation.acceptanceMetric = method.acceptanceMetric;
  attestation.observedMetric = candidate.metrics[method.acceptanceMetric];
  return attestation;
}

function validatedRegistryFromBody(body, attestationTemplate, fenceToken = 20) {
  const candidate = sealCertificate(body);
  const attestation = attestationFor(candidate, attestationTemplate);
  return { candidate, ...buildRegistry(candidate, attestation, fenceToken) };
}

function routeClaiming(certificate, route, estimatedError = 0.12) {
  return validateCalibrationEnvelope({
    schemaVersion: 'CalibrationEvidenceEnvelopeV1',
    decision: clone(route),
    calibration: {
      status: 'validated',
      certificateId: certificate.certificateId,
      corpusId: certificate.corpusId,
      method: certificate.method,
      policyHash: certificate.policyHash,
      riskSlice: certificate.riskSlice,
      evaluationWindow: clone(certificate.evaluationWindow),
      estimatedError,
    },
  });
}

function assertRankOnlyFallback(result, expectedReason) {
  assert.strictEqual(result.legalityReason, expectedReason);
  assert.strictEqual(result.calibratedAutoRouteAvailable, false);
  assert.ok(['clarify', 'defer'].includes(result.decision.action));
  assert.deepStrictEqual(result.calibration, { status: 'unvalidated' });
  assert.ok(Array.isArray(result.evaluatedEvidence));
  const projections = projectAll(result, fixture.request);
  assert.strictEqual(projections.typedRouteGold.decisionAction, result.decision.action);
  assert.ok(['clarify', 'defer'].includes(projections.typedRouteGold.decisionAction));
  assert.deepStrictEqual(projections.typedRouteGold.targetQualifiedIds, []);
  assertProbabilityLegality(
    [
      result.decision,
      projections.advisorProjection,
      projections.typedRouteGold,
      projections.policyCard,
    ],
    false
  );
}

function runRealScorer(scenario, observed) {
  const runner = [
    "'use strict';",
    "const fs = require('fs');",
    "const { evaluateRouteGold } = require(process.argv[1]);",
    "const input = JSON.parse(fs.readFileSync(0, 'utf8'));",
    "process.stdout.write(JSON.stringify(evaluateRouteGold(input)));",
  ].join('\n');
  const child = spawnSync(process.execPath, ['-e', runner, SCORER_PATH], {
    input: JSON.stringify({ scenario, observed }),
    encoding: 'utf8',
    env: { PATH: process.env.PATH },
  });
  assert.strictEqual(child.status, 0, `real scorer failed: ${child.stderr}`);
  return JSON.parse(child.stdout);
}

function assertSourceDiscipline() {
  const sourceFiles = [
    path.join(PHASE_ROOT, 'lib/calibration-contract.cjs'),
    path.join(PHASE_ROOT, 'lib/certificate-registry.cjs'),
    path.join(PHASE_ROOT, 'lib/compatibility-projector.cjs'),
    __filename,
  ];
  const forbiddenComment = /(?:REQ-|CHK-|ADR-|task-ids?|\.opencode\/specs\/|\/00[0-9]-)/i;
  const skillBranch = /(?:skillId|hubId)\s*={2,3}\s*['"][^'"]+['"]/;
  const allowedBuiltins = new Set(['assert', 'child_process', 'crypto', 'fs', 'path']);
  for (const file of sourceFiles) {
    const source = fs.readFileSync(file, 'utf8');
    for (const line of source.split('\n').filter((item) => item.trim().startsWith('//'))) {
      assert.strictEqual(forbiddenComment.test(line), false, `ephemeral comment in ${file}`);
    }
    assert.strictEqual(skillBranch.test(source), false, `skill-name branch in ${file}`);
    for (const match of source.matchAll(/require\(['"]([^'"]+)['"]\)/g)) {
      const dependency = match[1];
      const isLocal = dependency.startsWith('.');
      const isBuiltin = allowedBuiltins.has(dependency);
      assert.ok(isLocal || isBuiltin, `external dependency ${dependency} in ${file}`);
      if (dependency.includes('000-contract-schemas')) {
        assert.ok(
          dependency.endsWith('/lib/canonical.cjs'),
          `non-canonical contract dependency in ${file}`
        );
      }
    }
  }
}

function assertDocumentAnchors(fileName, anchors) {
  const content = fs.readFileSync(path.join(PHASE_ROOT, fileName), 'utf8');
  let priorClose = -1;
  for (const anchor of anchors) {
    const open = `<!-- ANCHOR:${anchor} -->`;
    const close = `<!-- /ANCHOR:${anchor} -->`;
    assert.strictEqual(content.split(open).length - 1, 1, `${fileName} ${anchor} open count`);
    assert.strictEqual(content.split(close).length - 1, 1, `${fileName} ${anchor} close count`);
    const openIndex = content.indexOf(open);
    const closeIndex = content.indexOf(close);
    assert.ok(openIndex > priorClose, `${fileName} ${anchor} order is invalid`);
    assert.ok(closeIndex > openIndex, `${fileName} ${anchor} is not closed`);
    priorClose = closeIndex;
  }
  return content;
}

function assertChecklistEvidence(content) {
  const lines = content.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith('- [x] ')) continue;
    let hasEvidence = false;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (lines[cursor].startsWith('- [') || lines[cursor].startsWith('## ')) break;
      if (lines[cursor].startsWith('  - **Evidence**:')) hasEvidence = true;
    }
    assert.ok(hasEvidence, `checked checklist item lacks evidence at line ${index + 1}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

const fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
const reasons = fixture.expectedReasons;
const corpora = loadCorpora();
const resolveCorpus = (corpusId) => corpora.get(corpusId) || null;
const protectedBefore = assertProtectedDigests();
const negativeReasons = {};

assert.strictEqual(fixture.schemaVersion, 'CalibrationContractCasesV1');
validateRouteDecision(fixture.rankOnlyRoute);
assert.deepStrictEqual(parseRouteDecisionShape(fixture.rankOnlyRoute), fixture.rankOnlyRoute);
assertSourceDiscipline();
for (const relativePath of [
  'calibration-method-envelope.v1.json',
  'schemas/calibration-certificate.v1.schema.json',
  'schemas/calibrated-route-decision.v1.schema.json',
  'fixtures/calibration-cases.v1.json',
]) {
  JSON.parse(fs.readFileSync(path.join(PHASE_ROOT, relativePath), 'utf8'));
}
const calibrationEnvelopeSchema = JSON.parse(fs.readFileSync(
  path.join(PHASE_ROOT, 'schemas/calibrated-route-decision.v1.schema.json'),
  'utf8'
));
assert.strictEqual(calibrationEnvelopeSchema.title, 'CalibrationEvidenceEnvelopeV1');
assert.strictEqual(
  calibrationEnvelopeSchema.properties.schemaVersion.const,
  'CalibrationEvidenceEnvelopeV1'
);
assert.strictEqual(
  calibrationEnvelopeSchema.properties.decision.$ref,
  '../../../000-contract-schemas/schemas/route-decision.v1.schema.json#/$defs/routeDecision'
);
const checklistContent = assertDocumentAnchors('checklist.md', [
  'protocol',
  'pre-impl',
  'code-quality',
  'testing',
  'fix-completeness',
  'security',
  'docs',
  'file-org',
  'summary',
]);
assertChecklistEvidence(checklistContent);
const summaryContent = assertDocumentAnchors('implementation-summary.md', [
  'metadata',
  'what-built',
  'how-delivered',
  'decisions',
  'verification',
  'limitations',
]);
assert.ok(summaryContent.includes('## Known Limitations'));

const temperatureCandidate = sealCertificate(fixture.certificateBodies.temperature);
const temperatureCandidateAgain = sealCertificate(fixture.certificateBodies.temperature);
assert.strictEqual(temperatureCandidate.certificateId, temperatureCandidateAgain.certificateId);
assert.strictEqual(temperatureCandidate.certHash, temperatureCandidateAgain.certHash);
assert.deepStrictEqual(
  {
    certificateId: temperatureCandidate.certificateId,
    certHash: temperatureCandidate.certHash,
  },
  fixture.expectedCertificateIdentities.temperature
);
assert.notStrictEqual(temperatureCandidate.certificateId, temperatureCandidate.certHash);
validateCertificate(temperatureCandidate);

const attachmentContext = {
  request: fixture.request,
  corpusResolver: resolveCorpus,
};
negativeReasons.candidateAttachment = expectCode(
  () => attachCalibration(
    fixture.rankOnlyRoute,
    temperatureCandidate,
    0.12,
    attachmentContext
  ),
  reasons.candidateAttachment,
  'candidate attachment'
);
const candidateRoute = routeClaiming(temperatureCandidate, fixture.rankOnlyRoute);
negativeReasons.projectionLegalityRequired = expectCode(
  () => projectAll(candidateRoute, fixture.request),
  reasons.projectionLegalityRequired,
  'projection without evaluator verdict'
);
const candidateResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: candidateRoute,
  registry: new CertificateRegistry({
    activeCertificateId: temperatureCandidate.certificateId,
    certificates: [temperatureCandidate],
  }),
  corpusResolver: resolveCorpus,
});
assertRankOnlyFallback(candidateResult, reasons.candidateAttachment);
assert.strictEqual(
  projectAll(candidateResult, fixture.request).typedRouteGold.decisionAction,
  'clarify'
);

const changedMetricBody = clone(fixture.certificateBodies.temperature);
changedMetricBody.metrics.coverage = '0.810000';
const changedMetric = sealCertificate(changedMetricBody);
assert.notStrictEqual(changedMetric.certificateId, temperatureCandidate.certificateId);
assert.notStrictEqual(changedMetric.certHash, temperatureCandidate.certHash);

const temperatureAttestation = attestationFor(
  temperatureCandidate,
  fixture.trustedValidationAttestations.temperature
);
const registry = new CertificateRegistry({
  fenceToken: 30,
  trustedAttestations: [[temperatureCandidate.certHash, temperatureAttestation]],
});
negativeReasons.staleFence = expectCode(
  () => registry.rotate(temperatureCandidate, {
    expectedFenceToken: 29,
    expectedActiveCertificateId: null,
  }),
  reasons.staleFence,
  'stale fence'
);
negativeReasons.stalePreimage = expectCode(
  () => registry.rotate(temperatureCandidate, {
    expectedFenceToken: 30,
    expectedActiveCertificateId: 'not-the-active-certificate',
  }),
  reasons.stalePreimage,
  'stale pointer preimage'
);
const validatedTemperature = registry.rotate(temperatureCandidate, {
  expectedFenceToken: 30,
  expectedActiveCertificateId: null,
});
assert.strictEqual(validatedTemperature.status, 'validated');
assert.strictEqual(validatedTemperature.validatedBy, temperatureAttestation.issuedBy);

const certifiedRoute = attachCalibration(
  fixture.rankOnlyRoute,
  validatedTemperature,
  0.12,
  attachmentContext
);
const licensed = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: certifiedRoute,
  registry,
  corpusResolver: resolveCorpus,
});
assert.strictEqual(licensed.calibratedAutoRouteAvailable, true);
assert.strictEqual(licensed.calibration.estimatedError, 0.12);
assert.deepStrictEqual(parseRouteDecisionShape(licensed.decision), licensed.decision);
assert.ok(Array.isArray(licensed.decision.route.evidence));
assert.strictEqual(licensed.decision.route.authority, 'WithheldUntilVerify');
assert.strictEqual(
  licensed.decision.route.targets.length,
  fixture.rankOnlyRoute.route.targets.length
);

const tamperedCorpus = clone(resolveCorpus(validatedTemperature.corpusId));
tamperedCorpus.records[0].requestFacts.prompt += ' altered';
assert.notStrictEqual(computeCorpusHash(tamperedCorpus), tamperedCorpus.corpusId);
const tamperedCorpusResolver = (corpusId) => (
  corpusId === tamperedCorpus.corpusId ? tamperedCorpus : resolveCorpus(corpusId)
);
negativeReasons.tamperedCorpusAttachment = expectCode(
  () => attachCalibration(
    fixture.rankOnlyRoute,
    validatedTemperature,
    0.12,
    {
      request: fixture.request,
      corpusResolver: tamperedCorpusResolver,
    }
  ),
  reasons.corpusHashMismatch,
  'tampered corpus attachment'
);
const tamperedCorpusResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: certifiedRoute,
  registry,
  corpusResolver: tamperedCorpusResolver,
});
negativeReasons.corpusHashMismatch = tamperedCorpusResult.legalityReason;
assertRankOnlyFallback(tamperedCorpusResult, reasons.corpusHashMismatch);

const illegalUnvalidated = {
  schemaVersion: 'CalibrationEvidenceEnvelopeV1',
  decision: clone(fixture.rankOnlyRoute),
  calibration: { status: 'unvalidated', estimatedError: 0.12 },
};
negativeReasons.unvalidatedEstimatedError = expectCode(
  () => validateCalibrationEnvelope(illegalUnvalidated),
  reasons.unvalidatedEstimatedError,
  'unvalidated estimatedError'
);

const missingCertificate = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: certifiedRoute,
  registry: new CertificateRegistry(),
  corpusResolver: resolveCorpus,
});
assertRankOnlyFallback(missingCertificate, 'CERTIFICATE_NOT_RESOLVED');
assert.strictEqual(missingCertificate.decision.action, 'clarify');

const deferRequest = clone(fixture.request);
deferRequest.clarification.oneAnswerDiscriminatesToLegalLocalRoute = false;
const typedDefer = evaluateCalibratedRoute({
  request: deferRequest,
  routeEnvelope: {
    schemaVersion: 'CalibrationEvidenceEnvelopeV1',
    decision: fixture.rankOnlyRoute,
    calibration: { status: 'unvalidated' },
  },
  registry: new CertificateRegistry(),
  corpusResolver: resolveCorpus,
});
assert.strictEqual(typedDefer.decision.action, 'defer');
assert.deepStrictEqual(typedDefer.decision.defer, {
  reason: 'evidence-unavailable',
  recovery: ['defer'],
  authority: 'Withheld',
});

const policyBody = clone(fixture.certificateBodies.temperature);
policyBody.policyHash = otherDigest(policyBody.policyHash);
const policyCase = validatedRegistryFromBody(
  policyBody,
  fixture.trustedValidationAttestations.temperature,
  40
);
const policyResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: routeClaiming(policyCase.validated, fixture.rankOnlyRoute),
  registry: policyCase.registry,
  corpusResolver: resolveCorpus,
});
negativeReasons.policyMismatch = policyResult.legalityReason;
assertRankOnlyFallback(policyResult, reasons.policyMismatch);

const riskBody = clone(fixture.certificateBodies.temperature);
riskBody.riskSlice = 'actor:mutating:composite';
const riskCase = validatedRegistryFromBody(
  riskBody,
  fixture.trustedValidationAttestations.temperature,
  50
);
const riskResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: routeClaiming(riskCase.validated, fixture.rankOnlyRoute),
  registry: riskCase.registry,
  corpusResolver: resolveCorpus,
});
negativeReasons.riskSliceMismatch = riskResult.legalityReason;
assertRankOnlyFallback(riskResult, reasons.riskSliceMismatch);

const generationBody = clone(fixture.certificateBodies.temperature);
generationBody.generation = 2;
const generationCase = validatedRegistryFromBody(
  generationBody,
  fixture.trustedValidationAttestations.temperature,
  60
);
const generationResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: routeClaiming(generationCase.validated, fixture.rankOnlyRoute),
  registry: generationCase.registry,
  corpusResolver: resolveCorpus,
});
negativeReasons.generationMismatch = generationResult.legalityReason;
assertRankOnlyFallback(generationResult, reasons.generationMismatch);

const unresolvedBody = clone(fixture.certificateBodies.temperature);
unresolvedBody.corpusHash = otherDigest(unresolvedBody.corpusHash);
const unresolvedCase = validatedRegistryFromBody(
  unresolvedBody,
  fixture.trustedValidationAttestations.temperature,
  70
);
const unresolvedResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: routeClaiming(unresolvedCase.validated, fixture.rankOnlyRoute),
  registry: unresolvedCase.registry,
  corpusResolver: resolveCorpus,
});
negativeReasons.missingCorpus = unresolvedResult.legalityReason;
assertRankOnlyFallback(unresolvedResult, reasons.missingCorpus);

const expiredRegistry = new CertificateRegistry({
  fenceToken: 80,
  activeCertificateId: validatedTemperature.certificateId,
  certificates: [validatedTemperature],
});
const expiredCertificate = expiredRegistry.transitionActive('expired', {
  expectedFenceToken: 80,
  expectedActiveCertificateId: validatedTemperature.certificateId,
});
negativeReasons.expiredAttachment = expectCode(
  () => attachCalibration(
    fixture.rankOnlyRoute,
    expiredCertificate,
    0.12,
    attachmentContext
  ),
  reasons.expiredAttachment,
  'expired attachment'
);
const expiredResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: routeClaiming(expiredCertificate, fixture.rankOnlyRoute),
  registry: expiredRegistry,
  corpusResolver: resolveCorpus,
});
negativeReasons.expired = expiredResult.legalityReason;
assertRankOnlyFallback(expiredResult, reasons.expired);

const widened = clone(certifiedRoute);
widened.decision.route.selectionKind = 'orderedBundle';
widened.decision.route.targets.push({
  destinationId: {
    skillId: 'another-skill',
    workflowMode: 'another-mode',
    packetId: 'another-packet',
    packetKind: 'surface',
    backendKind: 'evidence-base',
  },
  role: 'evidence',
  authorityRef: 'another-skill:evidence-only',
  mutatesWorkspace: false,
});
negativeReasons.widenedCandidates = expectCode(
  () => evaluateCalibratedRoute({
    request: fixture.request,
    routeEnvelope: widened,
    registry,
    corpusResolver: resolveCorpus,
  }),
  reasons.widenedCandidates,
  'candidate widening'
);

const authorityFlip = clone(certifiedRoute);
authorityFlip.decision.route.authority = 'Commit';
negativeReasons.authorityFlip = expectCode(
  () => evaluateCalibratedRoute({
    request: fixture.request,
    routeEnvelope: authorityFlip,
    registry,
    corpusResolver: resolveCorpus,
  }),
  reasons.authorityFlip,
  'authority escalation'
);

negativeReasons.probabilityLanguage = expectCode(
  () => assertProbabilityLegality(
    [{ schemaVersion: 'V1', confidence: 'high' }],
    false
  ),
  reasons.probabilityLanguage,
  'uncertified projection language'
);

const deferWithEstimatedError = clone(typedDefer.decision);
deferWithEstimatedError.defer.estimatedError = 0.41;
negativeReasons.deferEstimatedError = expectCode(
  () => projectAll(
    { ...typedDefer, decision: deferWithEstimatedError },
    deferRequest
  ),
  reasons.deferEstimatedError,
  'defer estimatedError'
);

const clarifyWithConfidence = clone(missingCertificate.decision);
clarifyWithConfidence.clarify.confidence = 0.73;
negativeReasons.clarifyConfidence = expectCode(
  () => projectAll(
    { ...missingCertificate, decision: clarifyWithConfidence },
    fixture.request
  ),
  reasons.clarifyConfidence,
  'clarify confidence'
);

const deferWithExtraField = clone(typedDefer.decision);
deferWithExtraField.defer.diagnosticRef = 'local-observation';
negativeReasons.negativeExtraField = expectCode(
  () => projectAll(
    { ...typedDefer, decision: deferWithExtraField },
    deferRequest
  ),
  reasons.negativeExtraField,
  'defer extra field'
);

const singletonRequest = clone(fixture.request);
singletonRequest.calibrationProfile = clone(fixture.singletonProfile);
delete singletonRequest.calibrationProfile.rankCallsExpected;
const singletonResult = evaluateCalibratedRoute({
  request: singletonRequest,
  routeEnvelope: certifiedRoute,
  registry: new CertificateRegistry({
    activeCertificateId: validatedTemperature.certificateId,
    certificates: [validatedTemperature],
  }),
  corpusResolver: resolveCorpus,
});
assert.strictEqual(singletonResult.certificateNoOp, true);
assert.strictEqual(singletonResult.decision.action, 'route');
assert.deepStrictEqual(singletonResult.calibration, { status: 'unvalidated' });
assert.strictEqual(singletonResult.rankCalls, fixture.singletonProfile.rankCallsExpected);

const rankOnlyProjections = projectAll(singletonResult, singletonRequest);
const certifiedProjections = projectAll(licensed, fixture.request);
const rankOnlyCompatibilityBytes = canonicalBytes(rankOnlyProjections.compatibility);
const certifiedCompatibilityBytes = canonicalBytes(certifiedProjections.compatibility);
const rankOnlyGoldBytes = canonicalBytes(rankOnlyProjections.typedRouteGold);
const certifiedGoldBytes = canonicalBytes(certifiedProjections.typedRouteGold);
assert.ok(rankOnlyCompatibilityBytes.equals(certifiedCompatibilityBytes));
assert.ok(rankOnlyGoldBytes.equals(certifiedGoldBytes));
const projectionHash = sha256(rankOnlyCompatibilityBytes);
const routeGoldHash = sha256(rankOnlyGoldBytes);
assert.strictEqual(projectionHash, sha256(certifiedCompatibilityBytes));
assert.strictEqual(routeGoldHash, sha256(certifiedGoldBytes));

const trustedCorpus = resolveCorpus(temperatureCandidate.corpusId);
const trustedGoldRecord = trustedCorpus.records.find((record) => {
  if (record.intentGold?.action !== 'route'
    || record.intentGold.selectionKind !== fixture.rankOnlyRoute.route.selectionKind) {
    return false;
  }
  const trustedIds = record.intentGold.targets.map((target) => target.id);
  return canonicalBytes(trustedIds).equals(
    canonicalBytes(fixture.request.rankedTargetIds)
  );
});
assert.ok(trustedGoldRecord, 'distinct intent-derived gold record is unavailable');
assert.strictEqual(trustedGoldRecord.labelProvenance, 'intent-derived');
assert.strictEqual(
  trustedGoldRecord.authorAttestation.routerOutputViewedBeforeLabelLock,
  false
);
assert.strictEqual(
  trustedGoldRecord.authorAttestation.independentFromRouterOperator,
  true
);
const trustedLegacyGold = trustedGoldRecord.intentGold.expectedLegacy;
const goldScenario = {
  scenarioId: trustedGoldRecord.recordId,
  classKind: 'router',
  source: { shape: 'intent-derived' },
  hasIntentGold: true,
  expectedIntent: trustedLegacyGold.intents[0],
  expectedIntents: trustedLegacyGold.intents,
  hasResourceGold: true,
  expectedResources: trustedLegacyGold.resources,
};
const realScorer = runRealScorer(
  goldScenario,
  certifiedProjections.compatibility
);
assert.strictEqual(realScorer.applicable, true);
assert.strictEqual(realScorer.pass, true);
const corruptedObservation = clone(certifiedProjections.compatibility);
corruptedObservation.observedIntents = ['wrong-intent'];
const scorerFalsifier = runRealScorer(goldScenario, corruptedObservation);
assert.strictEqual(scorerFalsifier.applicable, true);
assert.strictEqual(scorerFalsifier.pass, false);

const selectiveCandidate = sealCertificate(fixture.certificateBodies.selective);
assert.deepStrictEqual(
  {
    certificateId: selectiveCandidate.certificateId,
    certHash: selectiveCandidate.certHash,
  },
  fixture.expectedCertificateIdentities.selective
);
const selectiveAttestation = attestationFor(
  selectiveCandidate,
  fixture.trustedValidationAttestations.selective
);
registry.trustedAttestations.set(selectiveCandidate.certHash, selectiveAttestation);
const validatedSelective = registry.rotate(selectiveCandidate, {
  expectedFenceToken: registry.fenceToken,
  expectedActiveCertificateId: validatedTemperature.certificateId,
});
assert.strictEqual(
  registry.retainedPriorCertificateId,
  validatedTemperature.certificateId
);
assert.strictEqual(validatedSelective.status, 'validated');
assert.strictEqual(
  METHOD_ENVELOPE.methods[validatedSelective.method].acceptanceMetric,
  'selectiveRisk'
);
negativeReasons.staleRestorePreimage = expectCode(
  () => registry.restoreRetainedPrior({
    expectedFenceToken: registry.fenceToken,
    expectedActiveCertificateId: validatedTemperature.certificateId,
  }),
  reasons.staleRestorePreimage,
  'stale restore pointer preimage'
);
const restoredTemperature = registry.restoreRetainedPrior({
  expectedFenceToken: registry.fenceToken,
  expectedActiveCertificateId: validatedSelective.certificateId,
});
assert.strictEqual(restoredTemperature.certificateId, validatedTemperature.certificateId);
assert.strictEqual(restoredTemperature.certHash, validatedTemperature.certHash);
assert.strictEqual(restoredTemperature.status, 'validated');
assert.strictEqual(registry.retainedPriorCertificateId, validatedSelective.certificateId);
const restoredSelective = registry.restoreRetainedPrior({
  expectedFenceToken: registry.fenceToken,
  expectedActiveCertificateId: validatedTemperature.certificateId,
});
assert.strictEqual(restoredSelective.certificateId, validatedSelective.certificateId);
assert.strictEqual(registry.retainedPriorCertificateId, validatedTemperature.certificateId);

const servingPolicyBefore = fs.readFileSync(SERVING_POLICY_PATH);
const revokedCertificate = registry.transitionActive('revoked', {
  expectedFenceToken: registry.fenceToken,
  expectedActiveCertificateId: validatedSelective.certificateId,
});
negativeReasons.revokedAttachment = expectCode(
  () => attachCalibration(
    fixture.rankOnlyRoute,
    revokedCertificate,
    0.12,
    attachmentContext
  ),
  reasons.revokedAttachment,
  'revoked attachment'
);
const revokedResult = evaluateCalibratedRoute({
  request: fixture.request,
  routeEnvelope: routeClaiming(revokedCertificate, fixture.rankOnlyRoute),
  registry,
  corpusResolver: resolveCorpus,
});
negativeReasons.revoked = revokedResult.legalityReason;
assertRankOnlyFallback(revokedResult, reasons.revoked);
assert.strictEqual(
  registry.retainedPriorCertificateId,
  validatedTemperature.certificateId
);
assert.ok(servingPolicyBefore.equals(fs.readFileSync(SERVING_POLICY_PATH)));

const protectedAfter = assertProtectedDigests();
assert.deepStrictEqual(protectedAfter, protectedBefore);

// ─────────────────────────────────────────────────────────────────────────────
// 5. REPORT
// ─────────────────────────────────────────────────────────────────────────────

const report = {
  status: 'shadow-partial',
  criteria: {
    'SC-001': {
      status: 'PASS',
      evidence: [
        'attachment and evaluation admit estimatedError only through an externally',
        'validated certificate bound to request policy, generation, risk slice,',
        'and recomputed canonical corpus identity',
      ].join(' '),
    },
    'SC-002': {
      status: 'PASS',
      evidence: [
        'negative branches enforce exact fields and reject probability language;',
        'uncertified evaluator verdicts project only one-turn clarify or typed defer',
      ].join(' '),
    },
    'SC-003': {
      status: 'shadow-partial',
      evidence: [
        'compatibility and typed-gold bytes match with and without calibration;',
        'the exported real scorer passes and its falsifier fails;',
        'live hub routing remains deferred',
      ].join(' '),
    },
    'SC-004': {
      status: 'PASS',
      evidence: [
        'authority and candidates stay fixed; fenced restore reinstates the retained',
        'validated prior; revocation remains rank-only with unchanged policy bytes',
      ].join(' '),
    },
    'SC-005': {
      status: 'PASS',
      evidence: [
        'both method families validate against the fixed method envelope;',
        'fitting and operational issuance remain owned downstream',
      ].join(' '),
    },
  },
  negativeReasons,
  externalOracle: {
    validator: '002-decision-evaluator/lib/decision-contract.cjs#parseRouteDecisionShape',
    rankOnlyRoute: 'pass',
    licensedDecision: 'pass',
    evidenceKinds: licensed.decision.route.evidence.map((entry) => entry.kind),
  },
  projection: {
    compatibilityHash: projectionHash,
    typedRouteGoldHash: routeGoldHash,
    realScorerPass: realScorer.pass,
    scorerFalsifierPass: scorerFalsifier.pass,
  },
  lifecycle: {
    retainedPriorCertificateId: registry.retainedPriorCertificateId,
    restoredCertificateId: restoredTemperature.certificateId,
    activeStatus: revokedCertificate.status,
    fallbackAction: revokedResult.decision.action,
    servingPolicyHash: sha256(servingPolicyBefore),
  },
  protectedDigests: protectedAfter,
  limitations: [
    'No live threshold fitting or operational certificate issuance was performed.',
    'The real scorer was exercised against intent-derived shadow gold, not an activated hub router.',
    'Repository strict spec validation is outside this harness and is reported separately.',
  ],
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
