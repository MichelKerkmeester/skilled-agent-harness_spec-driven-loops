// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Decision Evaluator Contract Tests                            ║
// ║ PURPOSE: Falsify unsafe decision states and replay deterministic cases.  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  DOMAIN_TAGS,
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeRequestFactsHash,
  hashArtifact,
} = require('../../000-contract-schemas/lib/canonical.cjs');
const {
  DecisionValidationError,
  parseRouteDecision,
  parseRouteDecisionShape,
} = require('../lib/decision-contract.cjs');
const { evaluate, evaluateWithTrace } = require('../lib/evaluator.cjs');
const {
  ProjectionValidationError,
  projectToRouteGold,
} = require('../lib/projector.cjs');
const {
  TRUSTED_PROTECTED_DIGESTS,
  scoreRouteGoldReadOnly,
  scorerScenario,
} = require('../replay-driver.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const CONTRACT_FIXTURES = path.resolve(__dirname, '..', '..', '000-contract-schemas', 'fixtures');
const FIXTURE_FILE = path.resolve(__dirname, '..', 'fixtures', 'evaluator-cases.v1.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function expectGuardCode(candidate, policy, expectedCode, parser = parseRouteDecision) {
  assert.throws(
    () => parser(candidate, policy),
    (error) => error instanceof DecisionValidationError && error.code === expectedCode,
    `guard must reject with ${expectedCode}`
  );
}

function rehashPolicy(policy) {
  policy.basePolicyHash = computeBasePolicyHash(policy);
  policy.effectivePolicyHash = computeEffectivePolicyHash(policy);
  return policy;
}

function rehashRequest(request) {
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function byId(fixtures, id) {
  const fixture = fixtures.cases.find((candidate) => candidate.id === id);
  assert.ok(fixture, `missing fixture ${id}`);
  return fixture;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

function runTests() {
  const fixtures = readJson(FIXTURE_FILE);
  const policyCache = new Map();
  const loadPolicy = (name) => {
    if (!policyCache.has(name)) {
      policyCache.set(name, readJson(path.join(CONTRACT_FIXTURES, name)));
    }
    return policyCache.get(name);
  };
  let assertions = 0;
  const scorerInputs = [];

  for (const fixture of fixtures.cases) {
    const policy = loadPolicy(fixture.policyFixture);
    const beforeRequest = canonicalize(fixture.request);
    const beforePolicy = canonicalize(policy);
    const result = evaluateWithTrace(deepFreeze(clone(fixture.request)), deepFreeze(clone(policy)));
    assert.deepStrictEqual(result.decision, fixture.expectedDecision, `${fixture.id} decision mismatch`);
    assert.deepStrictEqual(result.trace, fixture.expectedTrace, `${fixture.id} trace mismatch`);
    assert.strictEqual(
      hashArtifact(DOMAIN_TAGS.RouteDecisionV1, result.decision),
      fixture.expectedDecisionHash,
      `${fixture.id} decision hash mismatch`
    );
    assert.strictEqual(canonicalize(fixture.request), beforeRequest, `${fixture.id} request mutated`);
    assert.strictEqual(canonicalize(policy), beforePolicy, `${fixture.id} policy mutated`);
    assert.ok(Object.isFrozen(result.decision), `${fixture.id} decision must be immutable`);
    assert.ok(!Object.prototype.hasOwnProperty.call(result.decision, 'selectionKind'));
    const projection = projectToRouteGold(result.decision, {
      policy,
      leafPairs: fixture.leafPairs,
      manifestResources: fixtures.manifestResources,
    });
    scorerInputs.push({ scenario: scorerScenario(fixture), observed: projection });
    assertions += 7;
  }

  const scorerRun = scoreRouteGoldReadOnly(scorerInputs);
  scorerRun.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, `${fixtures.cases[index].id} real scorer mismatch`);
  });
  assert.strictEqual(scorerRun.writeBackAttempted, false, 'read-only scorer reported a write attempt');
  assert.deepStrictEqual(scorerRun.writeBackAttempts, [], 'read-only scorer write log must stay empty');
  assert.deepStrictEqual(scorerRun.trustedProtectedDigests, TRUSTED_PROTECTED_DIGESTS);
  assertions += fixtures.cases.length + 3;

  const n1Policy = loadPolicy('compiled-policy.n1.json');
  const multiPolicy = loadPolicy('compiled-policy.multimode.json');
  const deferCandidate = clone(byId(fixtures, 'zero-signal-defer').expectedDecision);
  const routeCandidate = clone(byId(fixtures, 'exact-single-route').expectedDecision);
  const surfaceCandidate = clone(byId(fixtures, 'surface-bundle').expectedDecision);

  const topLevelSelection = clone(routeCandidate);
  topLevelSelection.selectionKind = 'single';
  expectGuardCode(topLevelSelection, n1Policy, 'DECISION_TOP_LEVEL_SELECTION_KIND');

  const flatAction = { schemaVersion: 'V1', action: 'single', single: {} };
  expectGuardCode(flatAction, n1Policy, 'DECISION_ACTION_CLOSED_ALGEBRA');

  const negativeTarget = clone(deferCandidate);
  negativeTarget.defer.targets = [clone(routeCandidate.route.targets[0])];
  expectGuardCode(negativeTarget, n1Policy, 'NEGATIVE_TARGET_FORBIDDEN');

  const negativeAuthority = clone(deferCandidate);
  negativeAuthority.defer.authority = 'WithheldUntilVerify';
  expectGuardCode(negativeAuthority, n1Policy, 'NEGATIVE_AUTHORITY_INVALID');

  const routeRecovery = clone(routeCandidate);
  routeRecovery.route.recovery = ['clarify'];
  expectGuardCode(routeRecovery, n1Policy, 'ROUTE_RECOVERY_ARTIFACT_FORBIDDEN');

  const emptyRoute = clone(routeCandidate);
  emptyRoute.route.targets = [];
  expectGuardCode(emptyRoute, n1Policy, 'ROUTE_TARGETS_EMPTY');

  const offPolicyTarget = clone(routeCandidate);
  offPolicyTarget.route.targets[0].destinationId.workflowMode = 'not-declared';
  expectGuardCode(offPolicyTarget, n1Policy, 'TARGET_NOT_IN_POLICY');

  expectGuardCode(routeCandidate, undefined, 'ROUTE_POLICY_REQUIRED');
  assert.doesNotThrow(() => parseRouteDecisionShape(routeCandidate));

  const commitAuthorityPolicy = clone(multiPolicy);
  commitAuthorityPolicy.destinations[1].authorityRef = 'commitAuthority';
  commitAuthorityPolicy.authorityGraph[1].fromAuthorityRef = 'commitAuthority';
  commitAuthorityPolicy.authorityGraph[1].relation = 'approveBeforeCommit';
  rehashPolicy(commitAuthorityPolicy);
  const committingEvidence = clone(surfaceCandidate);
  committingEvidence.route.targets[1].authorityRef = 'commitAuthority';
  expectGuardCode(
    committingEvidence,
    commitAuthorityPolicy,
    'POLICY_NON_ACTOR_COMMIT_AUTHORITY_FORBIDDEN'
  );

  const alternateCommitPolicy = clone(multiPolicy);
  alternateCommitPolicy.authorityGraph.push({
    fromAuthorityRef: 'authority:alternate-commit',
    toDestinationId: clone(alternateCommitPolicy.destinations[1].id),
    relation: 'approveBeforeCommit',
  });
  rehashPolicy(alternateCommitPolicy);
  expectGuardCode(
    surfaceCandidate,
    alternateCommitPolicy,
    'POLICY_EVIDENCE_COMMIT_AUTHORITY_FORBIDDEN'
  );

  const malformedSurface = clone(surfaceCandidate);
  malformedSurface.route.targets[1].role = 'transport';
  expectGuardCode(
    malformedSurface,
    undefined,
    'SURFACE_BUNDLE_ROLE_INVALID',
    parseRouteDecisionShape
  );

  const unnamedDegraded = clone(routeCandidate);
  unnamedDegraded.route.basis = { kind: 'degraded-fallback', unavailableEvidence: [] };
  expectGuardCode(unnamedDegraded, n1Policy, 'DEGRADED_FALLBACK_UNNAMED');

  const cachedDegraded = clone(routeCandidate);
  cachedDegraded.route.basis = {
    kind: 'degraded-fallback',
    unavailableEvidence: ['advisor:projection'],
    cached: true,
  };
  expectGuardCode(cachedDegraded, n1Policy, 'DEGRADED_FALLBACK_CACHED');

  const rankAuthority = clone(routeCandidate);
  rankAuthority.route.evidence = [{ kind: 'rankScore', value: '1', nonAuthority: false }];
  expectGuardCode(rankAuthority, n1Policy, 'RANK_EVIDENCE_AUTHORITY_FORBIDDEN');
  assert.strictEqual(
    evaluate(byId(fixtures, 'surface-bundle').request, commitAuthorityPolicy).reject.reason,
    'invalid'
  );
  assert.strictEqual(
    evaluate(byId(fixtures, 'surface-bundle').request, alternateCommitPolicy).reject.reason,
    'invalid'
  );
  assertions += 17;

  const rankOnly = byId(fixtures, 'rank-only-defer');
  assert.strictEqual(evaluate(rankOnly.request, multiPolicy).action, 'defer');
  const stale = byId(fixtures, 'stale-policy-defer');
  assert.strictEqual(evaluate(stale.request, multiPolicy).defer.reason, 'stale-policy');
  const mixed = byId(fixtures, 'mixed-generation-reject');
  assert.strictEqual(evaluate(mixed.request, multiPolicy).action, 'reject');

  const direct = evaluate(byId(fixtures, 'exact-single-route').request, n1Policy);
  for (const artifact of ['clarify', 'handoff', 'recovery', 'budgetRef']) {
    assert.ok(!Object.prototype.hasOwnProperty.call(direct.route, artifact));
  }

  const singularZero = evaluateWithTrace(byId(fixtures, 'zero-signal-defer').request, n1Policy);
  assert.deepStrictEqual(singularZero.trace, { rankCalls: 0, bundleCalls: 0, handoffCalls: 0 });
  assert.strictEqual(singularZero.decision.defer.reason, 'no-match');

  assert.deepStrictEqual(
    projectToRouteGold(deferCandidate),
    { observedIntents: [], observedResources: [] }
  );
  assert.throws(
    () => projectToRouteGold(routeCandidate, {
      policy: n1Policy,
      leafPairs: [{ workflowMode: 'code-mode', leafResourceId: 'unmapped' }],
      manifestResources: fixtures.manifestResources,
    }),
    /leaf pair is absent from the manifest projection/
  );

  const opaqueEvidenceRequest = clone(byId(fixtures, 'exact-single-route').request);
  opaqueEvidenceRequest.evidence.unshift({
    id: 'x:',
    kind: 'advisor',
    value: '',
    provenance: { source: 'opaque-evidence', capturedAtEpoch: 1 },
    trust: 'unavailable',
  });
  rehashRequest(opaqueEvidenceRequest);
  const opaqueEvidenceDecision = evaluate(opaqueEvidenceRequest, n1Policy);
  assert.strictEqual(opaqueEvidenceDecision.action, 'route');
  assert.deepStrictEqual(
    opaqueEvidenceDecision.route.basis.unavailableEvidence,
    ['advisor:x:']
  );

  const explicitRequest = clone(byId(fixtures, 'surface-bundle').request);
  explicitRequest.explicitMode = 'implementation';
  explicitRequest.observations = [{ kind: 'resource', value: 'context' }];
  rehashRequest(explicitRequest);
  const explicitResult = evaluateWithTrace(explicitRequest, multiPolicy);
  assert.strictEqual(explicitResult.decision.action, 'route');
  assert.strictEqual(explicitResult.decision.route.selectionKind, 'single');
  assert.strictEqual(explicitResult.decision.route.targets.length, 1);
  assert.strictEqual(
    explicitResult.decision.route.targets[0].destinationId.workflowMode,
    'implementation'
  );
  assert.deepStrictEqual(explicitResult.trace, { rankCalls: 0, bundleCalls: 0, handoffCalls: 0 });

  const unboundRequest = clone(byId(fixtures, 'exact-single-route').request);
  unboundRequest.evidence = [];
  rehashRequest(unboundRequest);
  const unboundDecision = evaluate(unboundRequest, n1Policy);
  assert.strictEqual(unboundDecision.action, 'defer');
  assert.strictEqual(unboundDecision.defer.reason, 'stale-policy');

  const staleGenerationRequest = clone(byId(fixtures, 'exact-single-route').request);
  staleGenerationRequest.pinnedActivationGeneration = 2;
  rehashRequest(staleGenerationRequest);
  const staleGenerationDecision = evaluate(staleGenerationRequest, n1Policy);
  assert.strictEqual(staleGenerationDecision.action, 'defer');
  assert.strictEqual(staleGenerationDecision.defer.reason, 'stale-policy');

  assert.throws(
    () => projectToRouteGold(routeCandidate, {
      policy: n1Policy,
      leafPairs: [{ workflowMode: 'code-mode', leafResourceId: 'canonical-leaf' }],
      manifestResources: [
        { workflowMode: 'code-mode', leafResourceId: 'canonical-leaf', resource: 'first' },
        { workflowMode: 'code-mode', leafResourceId: 'canonical-leaf', resource: 'second' },
      ],
    }),
    (error) => error instanceof ProjectionValidationError
      && error.code === 'MANIFEST_IDENTITY_DUPLICATE',
    'duplicate manifest identity must fail with MANIFEST_IDENTITY_DUPLICATE'
  );
  assertions += 23;

  return {
    assertions,
    guardCodes: [
      'DECISION_TOP_LEVEL_SELECTION_KIND',
      'DECISION_ACTION_CLOSED_ALGEBRA',
      'NEGATIVE_TARGET_FORBIDDEN',
      'NEGATIVE_AUTHORITY_INVALID',
      'ROUTE_RECOVERY_ARTIFACT_FORBIDDEN',
      'ROUTE_TARGETS_EMPTY',
      'TARGET_NOT_IN_POLICY',
      'ROUTE_POLICY_REQUIRED',
      'POLICY_NON_ACTOR_COMMIT_AUTHORITY_FORBIDDEN',
      'POLICY_EVIDENCE_COMMIT_AUTHORITY_FORBIDDEN',
      'SURFACE_BUNDLE_ROLE_INVALID',
      'DEGRADED_FALLBACK_UNNAMED',
      'DEGRADED_FALLBACK_CACHED',
      'RANK_EVIDENCE_AUTHORITY_FORBIDDEN',
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRY POINT AND EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { runTests };

if (require.main === module) {
  const result = runTests();
  process.stdout.write(`${JSON.stringify({ status: 'pass', ...result }, null, 2)}\n`);
}
