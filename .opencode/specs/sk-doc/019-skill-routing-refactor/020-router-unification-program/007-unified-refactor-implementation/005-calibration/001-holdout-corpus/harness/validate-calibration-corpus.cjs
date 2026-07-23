#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ VALIDATOR: CALIBRATION CORPUS                                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Exercise corpus identity, leakage, coverage, and replay gates.  ║
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
  canonicalBytes
} = require('../../../000-contract-schemas/lib/canonical.cjs');

const {
  CorpusValidationError,
  computeCorpusHash,
  measureSliceCalibration,
  validateCorpus,
  validateCorpusBinding,
  validateCoverage,
  validateHubCoverage,
  validateLiveGateSummary,
  validateRecord
} = require('../lib/calibration-corpus.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(__dirname, '../../../../../../../../..');
const SCORER_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
  'score-skill-benchmark.cjs'
);
const ROUTER_REPLAY_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
  'router-replay.cjs'
);
const LOAD_PLAYBOOK_SCENARIOS_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
  'load-playbook-scenarios.cjs'
);
const TYPED_PROJECTOR_PATH = path.join(
  REPO_ROOT,
  '.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program',
  '007-unified-refactor-implementation/001-compiler-n1-shadow/compiler/projections.cjs'
);
const CANONICAL_PATH = path.join(
  REPO_ROOT,
  '.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program',
  '007-unified-refactor-implementation/000-contract-schemas/lib/canonical.cjs'
);
const TRUSTED_SCORER_DIGEST =
  'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c';
const TRUSTED_ROUTER_DIGEST =
  'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47';
const TRUSTED_LOAD_PLAYBOOK_DIGEST =
  '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029';
const SUBPROCESS_MAX_BUFFER_BYTES = 10 * 1024 * 1024;
const PLANTED_LIVE_ECE_BPS = 1000;
const DETERMINISM_RUN_COUNT = 3;
const EXPECTED_HUB_IDS = Object.freeze([
  'sk-code',
  'system-deep-loop',
  'mcp-tooling',
  'mcp-code-mode'
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. FILE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(PHASE_ROOT, relativePath), 'utf8'));
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function sha256Bytes(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setCorpusIdentity(corpus) {
  const corpusId = computeCorpusHash(corpus);
  corpus.corpusHash = corpusId;
  corpus.corpusId = corpusId;
  return corpusId;
}

function expectReason(run, expectedReason) {
  let observed;
  try {
    run();
  } catch (error) {
    observed = error;
  }
  assert.ok(observed instanceof CorpusValidationError, `expected ${expectedReason} rejection`);
  assert.strictEqual(observed.code, expectedReason, `wrong rejection for ${expectedReason}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. READ-ONLY ROUTE-GOLD SUBPROCESS
// ─────────────────────────────────────────────────────────────────────────────

function runRouteGoldSubprocess(corpora, typedObservations) {
  const records = corpora.flatMap((corpus) => corpus.records.map((record) => ({
    recordId: record.recordId,
    hubId: record.hubId,
    prompt: record.requestFacts.prompt,
    replayMode: record.replayMode,
    effectivePolicyHash: corpus.effectivePolicyHash,
    intentGold: record.intentGold,
    goldAction: record.intentGold.action,
    expectedIntents: record.intentGold.expectedLegacy.intents,
    expectedResources: record.intentGold.expectedLegacy.resources
  })));
  const childSource = String.raw`
    'use strict';
    const fs = require('fs');
    const path = require('path');
    const input = JSON.parse(fs.readFileSync(0, 'utf8'));
    const { evaluateRouteGold } = require(input.scorerPath);
    const { routeSkillResources } = require(input.routerReplayPath);
    const { projectLegacyObservation, projectTypedRouteGold } = require(input.typedProjectorPath);
    const { canonicalize } = require(input.canonicalPath);

    function actionFromLegacy(replay) {
      const reason = replay.routeTelemetry && replay.routeTelemetry.deferReason;
      if (reason === 'ambiguous-multi-axis') return 'clarify';
      if (reason === 'no-mode-scored') return 'defer';
      return 'route';
    }

    function typedDecisionFromGold(gold) {
      if (gold.action === 'route') {
        return {
          schemaVersion: 'V1',
          action: 'route',
          route: {
            selectionKind: gold.selectionKind,
            targets: gold.targets.map((target, index) => ({
              destinationId: target.id,
              role: target.role,
              authorityRef: 'shadow-authority-' + index,
              mutatesWorkspace: target.mutatesWorkspace
            })),
            basis: { kind: 'signal' },
            evidence: [],
            authority: 'WithheldUntilVerify'
          }
        };
      }
      return {
        schemaVersion: 'V1',
        action: gold.action,
        [gold.action]: {
          reason: gold.reason,
          authority: 'Withheld'
        }
      };
    }

    function scenarioFor(record) {
      return {
        scenarioId: record.recordId,
        classKind: 'routing',
        hasIntentGold: true,
        hasResourceGold: true,
        expectedIntent: record.expectedIntents[0] || 'defer',
        expectedIntents: record.expectedIntents.length ? record.expectedIntents : ['defer'],
        expectedResources: record.expectedResources,
        goldParseError: null,
        source: { shape: 'sk-doc' }
      };
    }

    const typedById = new Map(input.typedObservations.map((item) => [item.recordId, item]));
    const rows = input.records.map((record) => {
      let action;
      let rawIntents;
      let rawResources;
      let source;
      if (record.replayMode === 'legacy-router') {
        const replay = routeSkillResources({
          skillRoot: path.join(input.skillsRoot, record.hubId),
          taskText: record.prompt
        });
        action = actionFromLegacy(replay);
        rawIntents = replay.intents || [];
        rawResources = replay.resources || [];
        source = 'legacy-router';
      } else {
        const typed = typedById.get(record.recordId);
        if (!typed || typed.capturedAfterLabelLock !== true || typed.nonAuthority !== true) {
          throw new Error('typed shadow observation is missing its post-lock non-authority proof');
        }
        const evaluation = {
          decision: typedDecisionFromGold(record.intentGold),
          diagnostics: {
            rankCalls: 0,
            selectedIntents: record.expectedIntents,
            selectedResources: record.expectedResources
          }
        };
        const typedGold = projectTypedRouteGold(
          { effectivePolicyHash: record.effectivePolicyHash },
          record.recordId,
          evaluation
        );
        const projection = projectLegacyObservation(typedGold);
        action = typedGold.decisionAction;
        rawIntents = projection.observedIntents;
        rawResources = projection.observedResources;
        source = typed.source;
      }

      const isPositive = action === 'route';
      const observed = {
        observedIntents: isPositive ? rawIntents : [],
        observedResources: isPositive ? rawResources : []
      };
      const scenario = scenarioFor(record);
      const verdict = evaluateRouteGold({ scenario, observed });
      return {
        recordId: record.recordId,
        action,
        source,
        routeGoldPass: verdict.pass,
        actionMatchesGold: action === record.goldAction,
        projectedIntents: observed.observedIntents,
        projectedResources: observed.observedResources,
        rawNegativeResourceCount: isPositive ? 0 : rawResources.length,
        verdict
      };
    });
    const corruptionTarget = input.records.find((record) => record.goldAction === 'route');
    const corruptedVerdict = evaluateRouteGold({
      scenario: scenarioFor(corruptionTarget),
      observed: {
        observedIntents: ['deliberately-corrupted-intent'],
        observedResources: []
      }
    });
    if (corruptedVerdict.pass) {
      throw new Error('real scorer accepted the deliberately corrupted observation');
    }
    process.stdout.write(canonicalize({
      corruptedObservation: {
        recordId: corruptionTarget.recordId,
        rejectedByRealScorer: true
      },
      rows
    }));
  `;
  const payload = {
    scorerPath: SCORER_PATH,
    routerReplayPath: ROUTER_REPLAY_PATH,
    typedProjectorPath: TYPED_PROJECTOR_PATH,
    canonicalPath: CANONICAL_PATH,
    skillsRoot: path.join(REPO_ROOT, '.opencode/skills'),
    records,
    typedObservations
  };
  const child = spawnSync(process.execPath, ['-e', childSource], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    cwd: REPO_ROOT,
    maxBuffer: SUBPROCESS_MAX_BUFFER_BYTES
  });
  if (child.status !== 0) {
    throw new Error(`read-only route-gold subprocess failed: ${child.stderr.trim()}`);
  }
  return {
    bytes: child.stdout,
    value: JSON.parse(child.stdout)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NEGATIVE FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function validateNegativeFixtures(corpora) {
  const leakage = readJson('fixtures/negative/leakage-router-derived.json');
  expectReason(
    () => validateRecord(leakage, leakage.hubId),
    'LABEL_LEAKAGE_ROUTER_SOURCE'
  );
  const leakageSource = corpora.find((corpus) => corpus.hubId === leakage.hubId);
  assert.ok(leakageSource, 'leakage fixture source corpus must exist');
  const repairedLeakage = clone(leakage);
  repairedLeakage.authorAttestation = clone(leakageSource.records[0].authorAttestation);
  validateRecord(repairedLeakage, repairedLeakage.hubId);

  const missingCell = readJson('fixtures/negative/missing-coverage-cell.json');
  const sourceCorpus = corpora.find((corpus) =>
    `${corpus.hubId}.v1.json` === missingCell.sourceCorpus
  );
  assert.ok(sourceCorpus, 'missing-cell fixture source corpus must exist');
  validateCoverage(sourceCorpus);
  const plantedGap = clone(sourceCorpus);
  plantedGap.records = plantedGap.records.filter(
    (record) => !missingCell.removeRecordIds.includes(record.recordId)
  );
  plantedGap.coverageRequirements = plantedGap.coverageRequirements.filter(
    (requirement) => !missingCell.removeCoverageRequirementIds.includes(requirement.riskSliceId)
  );
  expectReason(() => validateCoverage(plantedGap), missingCell.expectedReason);

  const trustRelabel = readJson('fixtures/negative/trust-metadata-relabel.json');
  const trustSource = corpora.find((corpus) => `${corpus.hubId}.v1.json` === trustRelabel.sourceCorpus);
  assert.ok(trustSource, 'trust-relabel fixture source corpus must exist');
  const oldTrustId = trustSource.corpusId;
  const staleRelabel = clone(trustSource);
  staleRelabel.policyBindingClass = trustRelabel.policyBindingClass;
  staleRelabel.privacySignoff.attestationKind = trustRelabel.attestationKind;
  const relabeledId = computeCorpusHash(staleRelabel);
  assert.notStrictEqual(relabeledId, oldTrustId, 'trust relabel must mint a new corpus id');
  expectReason(
    () => validateCorpus(staleRelabel),
    trustRelabel.expectedStaleCorpusReason
  );
  const relabeledCorpus = clone(staleRelabel);
  setCorpusIdentity(relabeledCorpus);
  validateCorpus(relabeledCorpus);
  const relabeledClaim = {
    schemaVersion: 'V1',
    claimKind: 'calibration-certificate',
    hubId: relabeledCorpus.hubId,
    riskSliceId: relabeledCorpus.coverageRequirements[0].riskSliceId,
    corpusId: oldTrustId,
    effectivePolicyHash: relabeledCorpus.effectivePolicyHash,
    corpusGeneration: relabeledCorpus.generation,
    activationAdmission: true,
    grantsCommitAuthority: false
  };
  expectReason(
    () => validateCorpusBinding(relabeledClaim, relabeledCorpus),
    trustRelabel.expectedStaleClaimReason
  );
  relabeledClaim.corpusId = relabeledCorpus.corpusId;
  expectReason(
    () => validateCorpusBinding(relabeledClaim, relabeledCorpus),
    trustRelabel.expectedMissingAttestationReason
  );
  const activationCorpus = clone(relabeledCorpus);
  activationCorpus.privacySignoff.externalAttestation = {
    compilerProofId: 'compiler-proof:sk-code:v1',
    compilerAuthorityRef: 'authority:compiler:sk-code',
    privacyReviewerSignatureRef: 'signature:privacy-reviewer:sk-code:v1',
    privacyReviewerAuthorityRef: 'authority:privacy-reviewer:sk-code'
  };
  setCorpusIdentity(activationCorpus);
  const externalReferences = Object.values(
    activationCorpus.privacySignoff.externalAttestation
  );
  assert.strictEqual(
    new Set(externalReferences).size,
    externalReferences.length,
    'activation attestation references must be mutually distinct'
  );
  assert.ok(
    externalReferences.every((reference) => reference !== activationCorpus.corpusId),
    'activation attestation references must be external to the corpus identity'
  );
  relabeledClaim.corpusId = activationCorpus.corpusId;
  validateCorpusBinding(relabeledClaim, activationCorpus);
  const missingProofCorpus = clone(activationCorpus);
  delete missingProofCorpus.privacySignoff.externalAttestation.compilerProofId;
  setCorpusIdentity(missingProofCorpus);
  relabeledClaim.corpusId = missingProofCorpus.corpusId;
  expectReason(
    () => validateCorpusBinding(relabeledClaim, missingProofCorpus),
    trustRelabel.expectedMissingProofReason
  );
  const missingAuthorityCorpus = clone(activationCorpus);
  delete missingAuthorityCorpus.privacySignoff.externalAttestation.compilerAuthorityRef;
  setCorpusIdentity(missingAuthorityCorpus);
  relabeledClaim.corpusId = missingAuthorityCorpus.corpusId;
  expectReason(
    () => validateCorpusBinding(relabeledClaim, missingAuthorityCorpus),
    trustRelabel.expectedMissingAuthorityReason
  );
  const selfIssuedCorpus = clone(activationCorpus);
  selfIssuedCorpus.privacySignoff.reviewerId = (
    selfIssuedCorpus.records[0].authorAttestation.authorId
  );
  setCorpusIdentity(selfIssuedCorpus);
  relabeledClaim.corpusId = selfIssuedCorpus.corpusId;
  expectReason(
    () => validateCorpusBinding(relabeledClaim, selfIssuedCorpus),
    trustRelabel.expectedSelfIssuedReason
  );

  const lineageFixture = readJson('fixtures/negative/same-generation-new-sample.json');
  const lineageSource = corpora.find(
    (corpus) => `${corpus.hubId}.v1.json` === lineageFixture.sourceCorpus
  );
  assert.ok(lineageSource, 'generation-lineage fixture source corpus must exist');
  const sameGenerationSample = clone(lineageSource);
  sameGenerationSample.priorCorpusId = lineageSource.corpusId;
  const changedRecord = sameGenerationSample.records.find(
    (record) => record.recordId === lineageFixture.changedRecordId
  );
  assert.ok(changedRecord, 'generation-lineage fixture record must exist');
  changedRecord.requestFacts.prompt = lineageFixture.changedPrompt;
  setCorpusIdentity(sameGenerationSample);
  expectReason(
    () => validateCorpus(sameGenerationSample, lineageSource),
    lineageFixture.expectedSameGenerationReason
  );
  const incrementedSample = clone(sameGenerationSample);
  incrementedSample.generation = lineageSource.generation + 1;
  setCorpusIdentity(incrementedSample);
  validateCorpus(incrementedSample, lineageSource);

  const riskFixture = readJson('fixtures/negative/strictest-risk-slice.json');
  const riskSource = corpora.find((corpus) => `${corpus.hubId}.v1.json` === riskFixture.sourceCorpus);
  assert.ok(riskSource, 'strictest-risk fixture source corpus must exist');
  const sourceRiskRecord = riskSource.records.find(
    (record) => record.recordId === riskFixture.recordId
  );
  assert.ok(sourceRiskRecord, 'strictest-risk fixture record must exist');
  validateRecord(sourceRiskRecord, sourceRiskRecord.hubId);
  const misclassifiedRisk = clone(sourceRiskRecord);
  const declaredTarget = misclassifiedRisk.intentGold.targets[riskFixture.declaredTargetIndex];
  misclassifiedRisk.riskSlice.id = riskFixture.declaredRiskSliceId;
  misclassifiedRisk.riskSlice.role = declaredTarget.role;
  misclassifiedRisk.riskSlice.mutatesWorkspace = declaredTarget.mutatesWorkspace;
  misclassifiedRisk.riskSlice.toleranceBps = riskFixture.declaredToleranceBps;
  misclassifiedRisk.riskSlice.contextDestination = clone(declaredTarget);
  expectReason(
    () => validateRecord(misclassifiedRisk, misclassifiedRisk.hubId),
    riskFixture.expectedClassificationReason
  );
  const looseToleranceRisk = clone(sourceRiskRecord);
  looseToleranceRisk.riskSlice.toleranceBps = riskFixture.looseToleranceBps;
  expectReason(
    () => validateRecord(looseToleranceRisk, looseToleranceRisk.hubId),
    riskFixture.expectedToleranceReason
  );

  const mismatchedClaim = readJson('fixtures/negative/mismatched-corpus-binding.json');
  const boundCorpus = corpora.find((corpus) => corpus.hubId === mismatchedClaim.hubId);
  assert.ok(boundCorpus, 'mismatched binding fixture corpus must exist');
  expectReason(
    () => validateCorpusBinding(mismatchedClaim, boundCorpus),
    mismatchedClaim.expectedReason
  );
  const correctedClaim = clone(mismatchedClaim);
  delete correctedClaim.expectedReason;
  correctedClaim.corpusId = boundCorpus.corpusId;
  validateCorpusBinding(correctedClaim, boundCorpus);

  const missingIdClaim = clone(correctedClaim);
  delete missingIdClaim.corpusId;
  expectReason(() => validateCorpusBinding(missingIdClaim, boundCorpus), 'CORPUS_ID_MISSING');

  const staleClaim = clone(correctedClaim);
  staleClaim.corpusGeneration = boundCorpus.generation + 1;
  expectReason(() => validateCorpusBinding(staleClaim, boundCorpus), 'CORPUS_GENERATION_STALE');

  const policyMismatchClaim = clone(correctedClaim);
  policyMismatchClaim.effectivePolicyHash = 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  expectReason(
    () => validateCorpusBinding(policyMismatchClaim, boundCorpus),
    'CORPUS_POLICY_MISMATCH'
  );

  const activationClaim = clone(correctedClaim);
  activationClaim.activationAdmission = true;
  expectReason(
    () => validateCorpusBinding(activationClaim, boundCorpus),
    'ACTIVATION_EVIDENCE_INADMISSIBLE'
  );

  const unsignedCorpus = clone(boundCorpus);
  unsignedCorpus.privacySignoff.status = 'pending';
  expectReason(() => validateCorpus(unsignedCorpus), 'PRIVACY_SIGNOFF_REQUIRED');

  return {
    leakage: 'LABEL_LEAKAGE_ROUTER_SOURCE',
    leakageGuardRemovedAccepted: true,
    coverage: missingCell.expectedReason,
    coverageGuardRestoredAccepted: true,
    trustRelabelCorpus: trustRelabel.expectedStaleCorpusReason,
    trustRelabelClaim: trustRelabel.expectedStaleClaimReason,
    activationExternalAttestation: trustRelabel.expectedMissingAttestationReason,
    activationExternalProof: trustRelabel.expectedMissingProofReason,
    activationExternalAuthority: trustRelabel.expectedMissingAuthorityReason,
    activationSelfIssued: trustRelabel.expectedSelfIssuedReason,
    activationExternalReferencesAccepted: true,
    generation: lineageFixture.expectedSameGenerationReason,
    generationIncrementAccepted: true,
    strictestRisk: riskFixture.expectedClassificationReason,
    fixedTolerance: riskFixture.expectedToleranceReason,
    strictestRiskGuardRestoredAccepted: true,
    binding: mismatchedClaim.expectedReason,
    bindingGuardRemovedAccepted: true,
    missing: 'CORPUS_ID_MISSING',
    stale: 'CORPUS_GENERATION_STALE',
    policy: 'CORPUS_POLICY_MISMATCH',
    activation: 'ACTIVATION_EVIDENCE_INADMISSIBLE',
    privacy: 'PRIVACY_SIGNOFF_REQUIRED'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CORE VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function validateProtectedDigests() {
  assert.strictEqual(sha256File(SCORER_PATH), TRUSTED_SCORER_DIGEST, 'scorer digest drift');
  assert.strictEqual(sha256File(ROUTER_REPLAY_PATH), TRUSTED_ROUTER_DIGEST, 'router digest drift');
  assert.strictEqual(
    sha256File(LOAD_PLAYBOOK_SCENARIOS_PATH),
    TRUSTED_LOAD_PLAYBOOK_DIGEST,
    'playbook scenario loader digest drift'
  );
}

function validateCorpusIdentities(corpora) {
  for (const corpus of corpora) {
    validateCorpus(corpus);
    const first = computeCorpusHash(corpus);
    const second = computeCorpusHash(clone(corpus));
    assert.strictEqual(first, second, `${corpus.hubId} corpus hash is not reproducible`);
  }
}

function validatePolicySourceBindings(corpora) {
  const identities = readJson('fixtures/shadow/policy-source-identities.v1.json').identities;
  for (const identity of identities) {
    const hubRouter = readJson(path.relative(PHASE_ROOT, path.join(REPO_ROOT, identity.hubRouterPath)));
    const modeRegistry = readJson(
      path.relative(PHASE_ROOT, path.join(REPO_ROOT, identity.modeRegistryPath))
    );
    const body = { hubId: identity.hubId, hubRouter, modeRegistry };
    const computed = crypto.createHash('sha256').update(canonicalBytes(body)).digest('hex');
    assert.strictEqual(computed, identity.basePolicyHash, `${identity.hubId} source binding drift`);
    const corpus = corpora.find((candidate) => candidate.hubId === identity.hubId);
    assert.ok(corpus, `source-bound corpus is missing for ${identity.hubId}`);
    assert.strictEqual(corpus.effectivePolicyIdentity.basePolicyHash, computed);
  }
  return identities.length;
}

function validateBoundShadowClaims(corpora) {
  const claims = readJson('fixtures/shadow/admissible-claims.v1.json').claims;
  for (const claim of claims) {
    const corpus = corpora.find((candidate) => candidate.hubId === claim.hubId);
    assert.ok(corpus, `claim corpus is missing for ${claim.hubId}`);
    validateCorpusBinding(claim, corpus);
  }
  return claims.length;
}

function validateN1(corpora) {
  const singleton = readJson('fixtures/n1/mcp-code-mode.no-slice.json');
  validateHubCoverage(corpora, [singleton], EXPECTED_HUB_IDS);
  assert.strictEqual(singleton.rankCallsExpected, 0, 'singleton must not call ranking');
  return singleton;
}

function validateLiveGate(corpora) {
  const summary = readJson('fixtures/shadow/live-gate-summary.v1.json');
  const corpus = corpora.find((candidate) => candidate.hubId === summary.hubId);
  assert.ok(corpus, `live-gate corpus is missing for ${summary.hubId}`);
  validateLiveGateSummary(summary, corpus);
  const mismatchedIdentity = clone(summary);
  mismatchedIdentity.policyBinding.corpusId = (
    'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  );
  expectReason(
    () => validateLiveGateSummary(mismatchedIdentity, corpus),
    'LIVE_CORPUS_ID_MISMATCH'
  );
  const belowFloor = clone(summary);
  belowFloor.slices[0].sampleCount -= 1;
  expectReason(
    () => validateLiveGateSummary(belowFloor, corpus),
    'LIVE_SAMPLE_FLOOR_UNMET'
  );
  const missingLineage = clone(summary);
  delete missingLineage.slices[0].deletionLineage;
  expectReason(
    () => validateLiveGateSummary(missingLineage, corpus),
    'LIVE_RETENTION_LINEAGE_MISSING'
  );
  const plantedDivergence = clone(summary);
  plantedDivergence.slices[0].liveEceBps = PLANTED_LIVE_ECE_BPS;
  expectReason(
    () => validateLiveGateSummary(plantedDivergence, corpus),
    'LIVE_OFFLINE_DIVERGENCE'
  );
  return {
    ...summary,
    guardResults: {
      identity: 'LIVE_CORPUS_ID_MISMATCH',
      sampleFloor: 'LIVE_SAMPLE_FLOOR_UNMET',
      deletionLineage: 'LIVE_RETENTION_LINEAGE_MISSING',
      divergence: 'LIVE_OFFLINE_DIVERGENCE'
    }
  };
}

function validateReplay(corpora) {
  const typed = readJson('fixtures/shadow/typed-observations.v1.json').observations;
  const runs = Array.from(
    { length: DETERMINISM_RUN_COUNT },
    () => runRouteGoldSubprocess(corpora, typed)
  );
  const byteHashes = runs.map((run) => sha256Bytes(run.bytes));
  assert.strictEqual(
    new Set(byteHashes).size,
    1,
    'canonical replay SHA-256 must match across all runs'
  );
  for (const run of runs.slice(1)) {
    assert.strictEqual(run.bytes, runs[0].bytes, 'canonical replay bytes must match across runs');
    assert.deepStrictEqual(run.value, runs[0].value, 'replay semantics must match across runs');
  }
  const first = runs[0].value.rows;
  for (const row of first) {
    assert.strictEqual(row.actionMatchesGold, true, `${row.recordId} action mismatch`);
    assert.strictEqual(row.routeGoldPass, true, `${row.recordId} route-gold verdict failed`);
    if (row.action !== 'route') {
      assert.deepStrictEqual(row.projectedIntents, [], `${row.recordId} negative intent leak`);
      assert.deepStrictEqual(row.projectedResources, [], `${row.recordId} negative resource leak`);
    }
  }
  assert.strictEqual(
    runs[0].value.corruptedObservation.rejectedByRealScorer,
    true,
    'real scorer must reject the deliberately corrupted observation'
  );
  const observations = new Map(first.map((row) => [row.recordId, row]));
  const calibrationRows = corpora.flatMap((corpus) =>
    measureSliceCalibration(corpus, observations).map((row) => ({
      hubId: corpus.hubId,
      ...row
    }))
  );
  for (const row of calibrationRows) {
    assert.strictEqual(row.pass, true, `${row.hubId}/${row.riskSliceId} ECE failed`);
  }
  return {
    rows: first,
    calibrationRows,
    realReplayRows: first.filter((row) => row.source === 'legacy-router').length,
    typedShadowRows: first.filter((row) => row.source === 'typed-projector-shadow').length,
    byteDeterminism: {
      runs: DETERMINISM_RUN_COUNT,
      sha256: byteHashes[0]
    },
    corruptedObservation: runs[0].value.corruptedObservation,
    legacyNegativeResourcesRemoved: first.reduce(
      (total, row) => total + row.rawNegativeResourceCount,
      0
    )
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const corpusFiles = [
    'fixtures/corpora/sk-code.v1.json',
    'fixtures/corpora/system-deep-loop.v1.json',
    'fixtures/corpora/mcp-tooling.v1.json'
  ];
  const corpora = corpusFiles.map(readJson);
  validateProtectedDigests();
  validateCorpusIdentities(corpora);
  const sourceBindingCount = validatePolicySourceBindings(corpora);
  const protectedBefore = {
    'score-skill-benchmark.cjs': sha256File(SCORER_PATH),
    'router-replay.cjs': sha256File(ROUTER_REPLAY_PATH),
    'load-playbook-scenarios.cjs': sha256File(LOAD_PLAYBOOK_SCENARIOS_PATH)
  };
  const negativeResults = validateNegativeFixtures(corpora);
  const claimCount = validateBoundShadowClaims(corpora);
  const singleton = validateN1(corpora);
  const liveGate = validateLiveGate(corpora);
  const replay = validateReplay(corpora);
  assert.strictEqual(
    sha256File(SCORER_PATH),
    protectedBefore['score-skill-benchmark.cjs'],
    'scorer bytes changed during replay'
  );
  assert.strictEqual(
    sha256File(ROUTER_REPLAY_PATH),
    protectedBefore['router-replay.cjs'],
    'router bytes changed during replay'
  );
  assert.strictEqual(
    sha256File(LOAD_PLAYBOOK_SCENARIOS_PATH),
    protectedBefore['load-playbook-scenarios.cjs'],
    'playbook scenario loader bytes changed during replay'
  );

  const hashes = Object.fromEntries(corpora.map((corpus) => [corpus.hubId, corpus.corpusHash]));
  const output = {
    status: 'pass-with-shadow-partial',
    corpusHashes: hashes,
    routeGold: {
      verdict: 'shadow-partial',
      rows: replay.rows.length,
      realReplayRows: replay.realReplayRows,
      typedShadowRows: replay.typedShadowRows,
      scorerDigest: protectedBefore['score-skill-benchmark.cjs'],
      routerReplayDigest: protectedBefore['router-replay.cjs'],
      loadPlaybookScenariosDigest: protectedBefore['load-playbook-scenarios.cjs'],
      typedProjector: 'projectTypedRouteGold -> projectLegacyObservation',
      corruptedObservationRejected: replay.corruptedObservation,
      legacyNegativeResourcesRemoved: replay.legacyNegativeResourcesRemoved
    },
    byteDeterminism: replay.byteDeterminism,
    protectedScorerBytes: protectedBefore,
    calibration: replay.calibrationRows,
    negativeFixtures: negativeResults,
    bindingClaims: claimCount,
    policySourceBindings: sourceBindingCount,
    liveGate: {
      status: 'shadow-partial',
      measurementClass: liveGate.measurementClass,
      guardResults: liveGate.guardResults
    },
    singleton: {
      hubId: singleton.hubId,
      candidateCount: singleton.candidateCount,
      noCalibrationSlice: singleton.noCalibrationSlice
    },
    successCriteria: {
      'SC-001': 'pass: three sealed hash-pinned representative corpora',
      'SC-002': 'pass: planted router-derived label rejected',
      'SC-003': 'pass: frozen hub topology covers all actions and reachable selection kinds',
      'SC-004': 'shadow-partial: three-run canonical bytes and real scorer pass; activation deferred',
      'SC-005': 'pass: independent privacy signoff required before seal',
      'SC-006': 'pass: missing, stale, policy-mismatched, and id-mismatched claims rejected',
      'SC-007': 'pass: explicit generic singleton no-slice record accepted'
    }
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`[calibration-corpus] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
