'use strict';

const fs = require('fs');
const path = require('path');
const {
  DOMAIN_TAGS,
  hashArtifact,
  computeBasePolicyHash,
  computeOverlayHash,
  computeEffectivePolicyHash,
  computeRequestFactsHash,
  computeProofHash,
  computeProjectionHash
} = require('../lib/canonical.cjs');

const fixtureRoot = __dirname;
const zeroDigest = '0'.repeat(64);

function write(relativePath, value) {
  const outputPath = path.join(fixtureRoot, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function destinationId(skillId, workflowMode, packetId, packetKind, backendKind, runtimeDiscriminator) {
  const id = { skillId, workflowMode, packetId, packetKind, backendKind };
  if (runtimeDiscriminator !== undefined) id.runtimeDiscriminator = runtimeDiscriminator;
  return id;
}

function target(destination, role, authorityRef, mutatesWorkspace) {
  return { destinationId: destination, role, authorityRef, mutatesWorkspace };
}

function finalizePolicy(policy) {
  policy.basePolicyHash = computeBasePolicyHash(policy);
  policy.effectivePolicyHash = computeEffectivePolicyHash(policy);
  return policy;
}

function finalizeRequest(request) {
  request.requestFactsHash = computeRequestFactsHash(request);
  return request;
}

function finalizeProof(proof) {
  proof.proofHash = computeProofHash(proof);
  return proof;
}

const actorId = destinationId('sk-code', 'implementation', 'packet-impl', 'workflow', 'native');
const evidenceId = destinationId('system-code-graph', 'context', 'packet-code-graph', 'evidence', 'mcp');
const transportId = destinationId('mcp-tooling', 'figma', 'packet-figma', 'transport', 'remote', 'plugin-api');
const n1Id = destinationId('mcp-code-mode', 'code-mode', 'packet-code-mode', 'standalone', 'utcp');

const multiPolicy = {
  schemaVersion: 'V1',
  activationGeneration: 7,
  destinations: [
    { id: actorId, role: 'actor', authorityRef: 'authority:sk-code', mutatesWorkspace: true },
    { id: evidenceId, role: 'evidence', authorityRef: 'authority:read-only', mutatesWorkspace: false },
    { id: transportId, role: 'transport', authorityRef: 'authority:figma-transport', mutatesWorkspace: true }
  ],
  detectors: [
    { id: 'detector:implementation', kind: 'exact', value: 'implement' },
    { id: 'detector:figma', kind: 'resource', value: 'figma' }
  ],
  selectors: [
    { id: 'selector:implementation', destinationId: actorId, detectorIds: ['detector:implementation'] },
    { id: 'selector:figma', destinationId: transportId, detectorIds: ['detector:figma'] }
  ],
  compositionRules: [
    { kind: 'surfaceBundle', targetIds: [actorId, evidenceId] },
    { kind: 'orderedBundle', targetIds: [actorId, transportId] }
  ],
  authorityGraph: [
    { fromAuthorityRef: 'authority:sk-code', toDestinationId: transportId, relation: 'approveBeforeCommit' },
    { fromAuthorityRef: 'authority:read-only', toDestinationId: evidenceId, relation: 'evidenceOnly' }
  ],
  thresholdPolicy: { kind: 'calibrated', thresholds: ['0.80', '0.15'] },
  recoveryPolicy: { ladder: ['clarify', 'handoff', 'defer', 'reject'], userTurns: 1, handoffHops: 1 },
  provenancePolicy: {
    kind: 'offline-learned',
    sourceHashes: [hashArtifact(DOMAIN_TAGS.CompiledPolicyV1, { source: 'authored-multi-policy' })]
  }
};
multiPolicy.basePolicyHash = computeBasePolicyHash(multiPolicy);

const overlay = {
  schemaVersion: 'V1',
  basePolicyHash: multiPolicy.basePolicyHash,
  adjustments: [
    { vocabulary: ['design in figma', 'push screen'], destinationId: transportId }
  ],
  promotionProvenance: {
    candidateId: 'candidate:overlay-1',
    approvedBy: 'independent-review',
    replayHash: hashArtifact(DOMAIN_TAGS.TypedRouteGoldV1, { corpus: 'overlay-replay-v1' })
  }
};
overlay.overlayHash = computeOverlayHash(overlay);
multiPolicy.overlayHash = overlay.overlayHash;
multiPolicy.effectivePolicyHash = computeEffectivePolicyHash(multiPolicy);

const n1Policy = finalizePolicy({
  schemaVersion: 'V1',
  activationGeneration: 1,
  destinations: [
    { id: n1Id, role: 'actor', authorityRef: 'authority:mcp-code-mode', mutatesWorkspace: false }
  ],
  detectors: [
    { id: 'detector:leaf', kind: 'resource', value: 'canonical-leaf' }
  ],
  selectors: [
    { id: 'selector:leaf', destinationId: n1Id, detectorIds: ['detector:leaf'] }
  ],
  compositionRules: [],
  authorityGraph: [],
  thresholdPolicy: { kind: 'exact-admission', thresholds: [] },
  recoveryPolicy: { ladder: ['clarify', 'defer', 'reject'], userTurns: 1, handoffHops: 0 },
  provenancePolicy: {
    kind: 'static',
    sourceHashes: [hashArtifact(DOMAIN_TAGS.CompiledPolicyV1, { source: 'authored-n1-policy' })]
  }
});

write('compiled-policy.multimode.json', multiPolicy);
write('compiled-policy.n1.json', n1Policy);
write('correction-overlay.replay.json', overlay);

const exactSingle = {
  schemaVersion: 'V1',
  action: 'route',
  route: {
    selectionKind: 'single',
    targets: [target(n1Id, 'actor', 'authority:mcp-code-mode', false)],
    basis: { kind: 'signal' },
    evidence: [],
    authority: 'WithheldUntilVerify'
  }
};
const orderedBundle = {
  schemaVersion: 'V1',
  action: 'route',
  route: {
    selectionKind: 'orderedBundle',
    targets: [
      target(actorId, 'judgment', 'authority:sk-code', true),
      target(transportId, 'transport', 'authority:figma-transport', true)
    ],
    basis: { kind: 'signal' },
    evidence: [{ kind: 'rankScore', value: '9', nonAuthority: true }],
    authority: 'WithheldUntilVerify'
  }
};
const surfaceBundle = {
  schemaVersion: 'V1',
  action: 'route',
  route: {
    selectionKind: 'surfaceBundle',
    targets: [
      target(actorId, 'actor', 'authority:sk-code', true),
      target(evidenceId, 'evidence', 'authority:read-only', false)
    ],
    basis: { kind: 'bounded-default' },
    evidence: [{ kind: 'scoreMargin', value: '2', nonAuthority: true }],
    authority: 'WithheldUntilVerify'
  }
};
const zeroSignal = {
  schemaVersion: 'V1',
  action: 'defer',
  defer: { reason: 'no-match', recovery: [], authority: 'Withheld' }
};
const clarify = {
  schemaVersion: 'V1',
  action: 'clarify',
  clarify: {
    question: 'Which local route matches the request?',
    budgetRef: 'budget:request-1',
    alternatives: ['implementation', 'inspection', 'none_of_these'],
    authority: 'Withheld'
  }
};
const reject = {
  schemaVersion: 'V1',
  action: 'reject',
  reject: { reason: 'forbidden', authority: 'Withheld' }
};
const degradedFallback = {
  schemaVersion: 'V1',
  action: 'route',
  route: {
    selectionKind: 'single',
    targets: [target(n1Id, 'actor', 'authority:mcp-code-mode', false)],
    basis: { kind: 'degraded-fallback', unavailableEvidence: ['advisor:projection'] },
    evidence: [],
    authority: 'WithheldUntilVerify'
  }
};

write('decisions/exact-single-route.json', exactSingle);
write('decisions/ordered-bundle.json', orderedBundle);
write('decisions/surface-bundle.json', surfaceBundle);
write('decisions/zero-signal-defer.json', zeroSignal);
write('decisions/one-turn-clarify.json', clarify);
write('decisions/forbidden-reject.json', reject);
write('decisions/degraded-fallback-named-evidence.json', degradedFallback);

function requestWithAdvisor(trust, value) {
  return finalizeRequest({
    schemaVersion: 'V1',
    observations: [{ kind: 'intent', value: 'implement contract schemas' }],
    evidence: [{
      id: `advisor:${trust}`,
      kind: 'advisor',
      value,
      provenance: { source: 'advisor-projection', capturedAtEpoch: 7 },
      trust
    }],
    pinnedActivationGeneration: 7
  });
}

const liveRequest = finalizeRequest({
  schemaVersion: 'V1',
  explicitMode: 'implementation',
  observations: [{ kind: 'command', value: '/implementation' }],
  evidence: [{
    id: 'authored:command',
    kind: 'authored',
    value: 'explicit mode has precedence',
    provenance: { source: 'request', capturedAtEpoch: 7 },
    trust: 'live'
  }],
  pinnedActivationGeneration: 7
});
write('route-request.live-explicit-mode.json', liveRequest);
write('route-request.stale-advisor.json', requestWithAdvisor('stale', 'annotation-only'));
write('route-request.absent-advisor.json', requestWithAdvisor('absent', ''));

const freshProof = finalizeProof({
  schemaVersion: 'V1',
  destinationId: actorId,
  readSet: [{ resourceId: 'policy:active', digest: multiPolicy.effectivePolicyHash }],
  epoch: 7,
  expiresAtEpoch: 9,
  idempotencyKey: 'request-7:actor',
  attestation: {
    issuer: 'destination-verify',
    statementHash: hashArtifact(DOMAIN_TAGS.RouteProofV1, { statement: 'prepared-and-verified' })
  }
});
const staleProof = finalizeProof({
  schemaVersion: 'V1',
  destinationId: actorId,
  readSet: [{ resourceId: 'policy:active', digest: multiPolicy.effectivePolicyHash }],
  epoch: 3,
  expiresAtEpoch: 4,
  idempotencyKey: 'request-3:actor',
  attestation: {
    issuer: 'destination-verify',
    statementHash: hashArtifact(DOMAIN_TAGS.RouteProofV1, { statement: 'expired-proof' })
  }
});
write('route-proof.fresh.json', freshProof);
write('route-proof.stale.json', staleProof);

write('uncertainty-budget.shared.json', {
  schemaVersion: 'V1',
  budgetId: 'budget:request-1',
  userTurns: 1,
  handoffHops: 1,
  visited: ['sk-code/implementation']
});

const advisorProjection = {
  schemaVersion: 'V1',
  hubId: 'sk-code',
  aliases: ['code', 'implementation'],
  eligibleModes: [
    { qualifiedId: 'sk-code/implementation', publicMode: 'implementation', routingClass: 'actor' },
    { qualifiedId: 'sk-code/context', publicMode: 'context', routingClass: 'evidence' }
  ],
  admissionLabels: ['code-change', 'code-context'],
  effectivePolicyHash: multiPolicy.effectivePolicyHash
};
advisorProjection.projectionHash = computeProjectionHash('AdvisorProjectionV1', advisorProjection);
write('advisor-projection.json', advisorProjection);

const typedGold = {
  schemaVersion: 'V1',
  scenarioId: 'singular-omission-and-duplicate-receipt',
  effectivePolicyHash: n1Policy.effectivePolicyHash,
  decisionAction: 'route',
  selectionKind: 'single',
  targetQualifiedIds: ['mcp-code-mode/code-mode'],
  observedIntents: ['code-mode'],
  observedResources: [{ intent: 'code-mode', resource: 'canonical-leaf' }],
  receiptAttempts: [
    { idempotencyKey: 'request-1:code-mode', receiptId: 'receipt:1', effectApplied: true },
    { idempotencyKey: 'request-1:code-mode', receiptId: 'receipt:1', effectApplied: false }
  ],
  assertions: {
    rankCalls: 0,
    handoffEdges: [],
    duplicateIdempotencyKeyProducesSingleReceipt: true
  }
};
typedGold.projectionHash = computeProjectionHash('TypedRouteGoldV1', typedGold);
write('typed-route-gold.singular-duplicate.json', typedGold);

const negativeGold = {
  schemaVersion: 'V1',
  scenarioId: 'negative-empty-compatibility-shape',
  effectivePolicyHash: n1Policy.effectivePolicyHash,
  decisionAction: 'defer',
  targetQualifiedIds: [],
  observedIntents: [],
  observedResources: [],
  receiptAttempts: [],
  assertions: {
    rankCalls: 0,
    handoffEdges: [],
    duplicateIdempotencyKeyProducesSingleReceipt: false
  }
};
negativeGold.projectionHash = computeProjectionHash('TypedRouteGoldV1', negativeGold);
write('typed-route-gold.negative.json', negativeGold);

const policyCard = {
  schemaVersion: 'V1',
  effectivePolicyHash: n1Policy.effectivePolicyHash,
  hubId: 'mcp-code-mode',
  admission: ['exact leaf admission', 'zero signal defers'],
  qualifiedRoles: ['mcp-code-mode/code-mode:actor'],
  bundleGrammar: ['single'],
  thresholdPolicy: 'exact-admission',
  recoveryBudget: 'one clarify turn; no handoff candidate at N=1',
  negativeReasons: ['no-match', 'forbidden'],
  authorityEdges: [],
  lifecycleChecklist: ['prepare', 'verify', 'commit', 'receipt'],
  limitations: ['DOCUMENT_ONLY_UNATTESTED', 'PREPARED_DRAFT']
};
policyCard.humanViewHash = computeProjectionHash('PolicyCardV1', policyCard, 'humanViewHash');
write('policy-card.frontmatter.json', policyCard);

const targetInsideDefer = JSON.parse(JSON.stringify(zeroSignal));
targetInsideDefer.defer.targets = [target(n1Id, 'actor', 'authority:mcp-code-mode', false)];
const authorityInsideReject = JSON.parse(JSON.stringify(reject));
authorityInsideReject.reject.authority = 'Commit';
const degradedWithoutEvidence = JSON.parse(JSON.stringify(degradedFallback));
delete degradedWithoutEvidence.route.basis.unavailableEvidence;
const evidenceMutation = JSON.parse(JSON.stringify(n1Policy));
evidenceMutation.destinations[0].role = 'evidence';
evidenceMutation.destinations[0].mutatesWorkspace = true;
const barePathIdentity = JSON.parse(JSON.stringify(n1Policy));
barePathIdentity.destinations[0].id = '/packets/code-mode';
const modeOnlyIdentity = JSON.parse(JSON.stringify(n1Policy));
modeOnlyIdentity.destinations[0].id = { workflowMode: 'code-mode' };
const routeEvidenceMutation = JSON.parse(JSON.stringify(exactSingle));
routeEvidenceMutation.route.targets[0].role = 'evidence';
routeEvidenceMutation.route.targets[0].authorityRef = 'authority:read-only';
routeEvidenceMutation.route.targets[0].mutatesWorkspace = true;
const routeEvidenceCommitAuthority = JSON.parse(JSON.stringify(exactSingle));
routeEvidenceCommitAuthority.route.targets[0].role = 'evidence';
routeEvidenceCommitAuthority.route.targets[0].authorityRef = 'authority:Commit';
const singleWithMultipleTargets = JSON.parse(JSON.stringify(exactSingle));
singleWithMultipleTargets.route.targets.push(target(actorId, 'actor', 'authority:sk-code', true));
const bundleWithSingleTarget = JSON.parse(JSON.stringify(orderedBundle));
bundleWithSingleTarget.route.targets = [bundleWithSingleTarget.route.targets[0]];
const duplicateDestinationId = JSON.parse(JSON.stringify(n1Policy));
duplicateDestinationId.destinations = [
  { id: n1Id, role: 'evidence', authorityRef: 'authority:read-only', mutatesWorkspace: false },
  { id: n1Id, role: 'actor', authorityRef: 'authority:Commit', mutatesWorkspace: true }
];
const undeclaredId = destinationId('undeclared-skill', 'missing', 'packet-missing', 'workflow', 'native');
const danglingSelectorTarget = JSON.parse(JSON.stringify(n1Policy));
danglingSelectorTarget.selectors[0].destinationId = undeclaredId;
const danglingCompositionTarget = JSON.parse(JSON.stringify(multiPolicy));
danglingCompositionTarget.compositionRules[0].targetIds[1] = undeclaredId;
const danglingAuthorityTarget = JSON.parse(JSON.stringify(multiPolicy));
danglingAuthorityTarget.authorityGraph[0].toDestinationId = undeclaredId;
const degradedBlankEvidenceReference = JSON.parse(JSON.stringify(degradedFallback));
degradedBlankEvidenceReference.route.basis.unavailableEvidence = ['   '];
const degradedUnknownEvidenceReference = JSON.parse(JSON.stringify(degradedFallback));
degradedUnknownEvidenceReference.route.basis.unavailableEvidence = ['cache:maybe'];
const clarifyCapabilityAlternative = JSON.parse(JSON.stringify(clarify));
clarifyCapabilityAlternative.clarify.alternatives[1] = 'authority:Commit';

write('adversarial/target-inside-defer.json', targetInsideDefer);
write('adversarial/authority-inside-reject.json', authorityInsideReject);
write('adversarial/degraded-without-evidence.json', degradedWithoutEvidence);
write('adversarial/evidence-mutation.json', evidenceMutation);
write('adversarial/bare-path-destination.json', barePathIdentity);
write('adversarial/mode-only-destination.json', modeOnlyIdentity);
write('adversarial/route-evidence-mutation.json', routeEvidenceMutation);
write('adversarial/route-evidence-commit-authority.json', routeEvidenceCommitAuthority);
write('adversarial/single-with-multiple-targets.json', singleWithMultipleTargets);
write('adversarial/bundle-with-single-target.json', bundleWithSingleTarget);
write('adversarial/duplicate-destination-id.json', duplicateDestinationId);
write('adversarial/dangling-selector-target.json', danglingSelectorTarget);
write('adversarial/dangling-composition-target.json', danglingCompositionTarget);
write('adversarial/dangling-authority-target.json', danglingAuthorityTarget);
write('adversarial/degraded-blank-evidence-reference.json', degradedBlankEvidenceReference);
write('adversarial/degraded-unknown-evidence-reference.json', degradedUnknownEvidenceReference);
write('adversarial/clarify-capability-alternative.json', clarifyCapabilityAlternative);

process.stdout.write('Generated 20 golden fixtures and 17 adversarial fixtures; canonical byte vectors preserved.\n');
