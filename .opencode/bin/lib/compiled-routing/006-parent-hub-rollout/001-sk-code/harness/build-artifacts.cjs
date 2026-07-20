#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ GENERATOR: CANARY ARTIFACT SNAPSHOT                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const {
  canonicalize,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  qualifiedDestinationId,
} = require('../../../001-compiler-n1-shadow/compiler/compiler.cjs');
const {
  projectToRouteGold,
} = require('../../../002-decision-evaluator/lib/projector.cjs');
const {
  sealCertificate,
} = require('../../../005-calibration/002-rank-vs-calibrated-contract/lib/calibration-contract.cjs');
const {
  artifactBytes,
  compileRegistry,
  sha256,
} = require('../lib/registry-compiler.cjs');
const { evaluateCanary } = require('../lib/canary-router.cjs');
const { generatePolicyCard } = require('../lib/policy-card.cjs');

const PHASE_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(start) {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('repository root could not be resolved');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-code');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadSnapshot() {
  const fixture = readJson(path.join(PHASE_ROOT, 'fixtures', 'canary-cases.v1.json'));
  const registryPath = path.join(SKILL_ROOT, 'mode-registry.json');
  const routerPath = path.join(SKILL_ROOT, 'hub-router.json');
  const skillPath = path.join(SKILL_ROOT, 'SKILL.md');
  const sourceBytes = {
    'SKILL.md': fs.readFileSync(skillPath),
    'hub-router.json': fs.readFileSync(routerPath),
    'mode-registry.json': fs.readFileSync(registryPath),
  };
  return {
    fixture,
    snapshot: compileRegistry({
      activationGeneration: fixture.activationGeneration,
      hubRouter: JSON.parse(sourceBytes['hub-router.json'].toString('utf8')),
      registry: JSON.parse(sourceBytes['mode-registry.json'].toString('utf8')),
      skillMarkdown: sourceBytes['SKILL.md'].toString('utf8'),
      sourceBytes,
    }),
  };
}

function ensurePhasePath(filePath) {
  const relative = path.relative(PHASE_ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`artifact path escapes the phase root: ${filePath}`);
  }
}

function writeBytes(filePath, bytes) {
  ensurePhasePath(filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, bytes, { mode: 0o600 });
}

function materializeFixtureInput(fixture, entry) {
  const input = JSON.parse(JSON.stringify(entry));
  const fixtureId = input.certificateFixture;
  const certificateState = input.certificateState || 'live';
  delete input.certificateFixture;
  delete input.certificateState;
  if (!fixtureId) return input;
  const certificate = sealCertificate(fixture.certificates[fixtureId]);
  input.certificateHandle = {
    state: certificateState,
    activeCertificateId: certificate.certificateId,
    certificate,
  };
  return input;
}

function typedGold(snapshot, fixture) {
  const rows = fixture.cases.map((entry) => {
    const evaluated = evaluateCanary(snapshot, materializeFixtureInput(fixture, entry));
    const projection = projectToRouteGold(evaluated.decision, { policy: snapshot.policy });
    const row = {
      assertions: {
        duplicateIdempotencyKeyProducesSingleReceipt: false,
        handoffEdges: [],
        rankCalls: evaluated.trace.controller?.rankCalls
          ?? evaluated.trace.evaluator.rankCalls,
      },
      decisionAction: evaluated.decision.action,
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      observedIntents: projection.observedIntents,
      observedResources: projection.observedResources.map((resource) => ({
        intent: projection.observedIntents[0],
        resource,
      })),
      receiptAttempts: [],
      scenarioId: entry.id,
      schemaVersion: 'V1',
      targetQualifiedIds: evaluated.decision.action === 'route'
        ? evaluated.decision.route.targets.map((target) => (
          qualifiedDestinationId(target.destinationId)
        ))
        : [],
      ...(evaluated.decision.action === 'route'
        ? { selectionKind: evaluated.decision.route.selectionKind }
        : {}),
    };
    row.projectionHash = computeProjectionHash('TypedRouteGoldV1', row);
    return row;
  });
  return { cases: rows, schemaVersion: 'V1' };
}

function buildArtifacts() {
  const { fixture, snapshot } = loadSnapshot();
  const card = generatePolicyCard(snapshot);
  const compiledDir = path.join(PHASE_ROOT, 'compiled');
  const activationDir = path.join(PHASE_ROOT, 'activation');
  const policyPath = path.join(compiledDir, 'policy.json');
  const advisorPath = path.join(compiledDir, 'advisor-projection.json');
  const cardPath = path.join(compiledDir, 'PolicyCardV1.md');
  const typedGoldPath = path.join(compiledDir, 'route-gold.typed.json');
  writeBytes(policyPath, artifactBytes(snapshot.policy));
  writeBytes(advisorPath, artifactBytes(snapshot.advisorProjection));
  writeBytes(cardPath, Buffer.from(card.markdown, 'utf8'));
  writeBytes(typedGoldPath, artifactBytes(typedGold(snapshot, fixture)));

  const priorPath = path.join(activationDir, 'manifest.prior.json');
  const manifestPath = path.join(activationDir, 'manifest.json');
  const candidatePath = path.join(activationDir, 'manifest.candidate.json');
  const fencePath = path.join(activationDir, 'fence-state.json');
  const priorBytes = fs.readFileSync(priorPath);
  const candidate = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      generation: snapshot.policy.activationGeneration,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  writeBytes(manifestPath, priorBytes);
  writeBytes(candidatePath, artifactBytes(candidate));
  writeBytes(fencePath, artifactBytes({ fencingEpoch: 0, schemaVersion: 'V1' }));

  const artifactPaths = {
    'PolicyCardV1.md': cardPath,
    'advisor-projection.json': advisorPath,
    'policy.json': policyPath,
    'route-gold.typed.json': typedGoldPath,
  };
  const acceptance = {
    candidateArtifacts: Object.fromEntries(Object.entries(artifactPaths).map(([name, filePath]) => (
      [name, sha256(fs.readFileSync(filePath))]
    ))),
    candidatePolicy: candidate.selectedPolicy,
    expectedCurrent: readJson(priorPath).selectedPolicy,
    expectedFencingEpoch: 0,
    hubId: snapshot.advisorProjection.hubId,
    priorManifestHash: sha256(priorBytes),
    schemaVersion: 'V1',
    servingAuthority: 'legacy',
    shadowOnly: true,
    sourceHashes: snapshot.sourceHashes,
  };
  writeBytes(path.join(activationDir, 'acceptance.json'), artifactBytes(acceptance));
  return {
    artifacts: Object.keys(artifactPaths).length,
    basePolicyHash: snapshot.policy.basePolicyHash,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    status: 'built',
  };
}

module.exports = {
  buildArtifacts,
  loadSnapshot,
  typedGold,
};

if (require.main === module) {
  process.stdout.write(`${canonicalize(buildArtifacts())}\n`);
}
