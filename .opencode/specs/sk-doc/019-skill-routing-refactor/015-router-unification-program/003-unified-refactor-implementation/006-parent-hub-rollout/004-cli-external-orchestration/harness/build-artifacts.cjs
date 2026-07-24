#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ HARNESS: CLI EXTERNAL ORCHESTRATION ARTIFACT BUILDER                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const {
  canonicalize,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
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
const { evaluateRoute } = require('../lib/router.cjs');
const { generatePolicyCard } = require('../lib/policy-card.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(start) {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('repository root was not found');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SKILL_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'cli-external-orchestration',
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOURCE AND PROJECTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceInputs() {
  const paths = {
    'cli-external-orchestration/SKILL.md': path.join(SKILL_ROOT, 'SKILL.md'),
    'cli-external-orchestration/cli-claude-code/SKILL.md': path.join(
      SKILL_ROOT,
      'cli-claude-code',
      'SKILL.md',
    ),
    'cli-external-orchestration/cli-codex/SKILL.md': path.join(
      SKILL_ROOT,
      'cli-codex',
      'SKILL.md',
    ),
    'cli-external-orchestration/cli-opencode/SKILL.md': path.join(
      SKILL_ROOT,
      'cli-opencode',
      'SKILL.md',
    ),
    'cli-external-orchestration/hub-router.json': path.join(SKILL_ROOT, 'hub-router.json'),
    'cli-external-orchestration/mode-registry.json': path.join(
      SKILL_ROOT,
      'mode-registry.json',
    ),
  };
  return Object.fromEntries(Object.entries(paths).map(([sourceId, filePath]) => (
    [sourceId, fs.readFileSync(filePath)]
  )));
}

function loadSnapshot() {
  const fixture = readJson(path.join(PHASE_ROOT, 'fixtures', 'canary-cases.v1.json'));
  const sourceBytes = sourceInputs();
  const registry = JSON.parse(
    sourceBytes['cli-external-orchestration/mode-registry.json'].toString('utf8'),
  );
  const hubRouter = JSON.parse(
    sourceBytes['cli-external-orchestration/hub-router.json'].toString('utf8'),
  );
  const snapshot = compileRegistry({
    activationGeneration: fixture.activationGeneration,
    hubRouter,
    packetSkillMarkdown: Object.fromEntries(registry.modes.map((mode) => (
      [
        mode.workflowMode,
        sourceBytes[`cli-external-orchestration/${mode.packet}/SKILL.md`].toString('utf8'),
      ]
    ))),
    registry,
    skillMarkdown: sourceBytes['cli-external-orchestration/SKILL.md'].toString('utf8'),
    sourceBytes,
  });
  return { fixture, snapshot, sourceBytes };
}

function scorerScenario(entry) {
  return {
    classKind: 'routing',
    expectedIntent: entry.gold.expectedIntents[0],
    expectedIntents: entry.gold.expectedIntents,
    expectedResources: entry.gold.expectedResources,
    goldParseError: null,
    hasIntentGold: true,
    hasResourceGold: true,
    scenarioId: entry.id,
    source: { featureFile: 'cli-external-orchestration-canary', shape: 'sk-doc' },
  };
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
  const cases = fixture.cases.map((entry) => {
    const result = evaluateRoute(snapshot, materializeFixtureInput(fixture, entry));
    const observed = projectToRouteGold(result.decision, { policy: snapshot.policy });
    const row = {
      assertions: {
        actorFirst: result.decision.action !== 'route'
          || result.decision.route.targets.every((item) => item.role === 'actor'),
        authorityWithheldUntilVerify: result.decision.action === 'route',
        negativeTargetFree: result.decision.action === 'route'
          || !Object.hasOwn(result.decision[result.decision.action], 'targets'),
      },
      decisionAction: result.decision.action,
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      observedIntents: observed.observedIntents,
      observedResources: observed.observedResources,
      scenario: scorerScenario(entry),
      scenarioId: entry.id,
      schemaVersion: 'V1',
      targetQualifiedIds: result.decision.action === 'route'
        ? result.decision.route.targets.map((item) => (
          `${item.destinationId.skillId}/${item.destinationId.workflowMode}`
        ))
        : [],
      ...(result.decision.action === 'route'
        ? { selectionKind: result.decision.route.selectionKind }
        : {}),
    };
    row.projectionHash = computeProjectionHash('TypedRouteGoldV1', row);
    return row;
  });
  return { cases, schemaVersion: 'V1' };
}

function blastRadius(snapshot) {
  return {
    actorCount: snapshot.policy.destinations.filter((item) => item.role === 'actor').length,
    archetype: 'external-executor-dispatch',
    compositionRuleCount: snapshot.policy.compositionRules.length,
    crossHubJudgmentCount: 0,
    destinationCount: snapshot.policy.destinations.length,
    externalEffectCount: snapshot.destinationGraph.destinations.filter((item) => (
      item.effectClass === 'external-effect'
    )).length,
    hubId: snapshot.advisorProjection.hubId,
    schemaVersion: 'V1',
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
}

function compiledArtifacts(snapshot, fixture) {
  return {
    'PolicyCardV1.md': Buffer.from(generatePolicyCard(snapshot), 'utf8'),
    'advisor-projection.json': artifactBytes(snapshot.advisorProjection),
    'blast-radius.json': artifactBytes(blastRadius(snapshot)),
    'destination-graph.json': artifactBytes(snapshot.destinationGraph),
    'policy.json': artifactBytes(snapshot.policy),
    'route-gold.typed.json': artifactBytes(typedGold(snapshot, fixture)),
  };
}

function activationArtifacts(snapshot, artifacts) {
  const prior = {
    schemaVersion: 'V1',
    selectedPolicy: { effectivePolicyHash: null, generation: 0 },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const candidate = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      generation: snapshot.policy.activationGeneration,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const priorBytes = artifactBytes(prior);
  const candidateBytes = artifactBytes(candidate);
  const acceptance = {
    candidateArtifacts: Object.fromEntries(Object.entries(artifacts).map(([name, bytes]) => (
      [name, sha256(bytes)]
    ))),
    candidatePolicy: candidate.selectedPolicy,
    expectedCurrent: prior.selectedPolicy,
    expectedFencingEpoch: 0,
    graphHash: snapshot.destinationGraph.graphHash,
    priorManifestHash: sha256(priorBytes),
    schemaVersion: 'V1',
    servingAuthority: 'legacy',
    shadowOnly: true,
    sourceHashes: snapshot.sourceHashes,
  };
  return {
    'acceptance.json': artifactBytes(acceptance),
    'fence-state.json': artifactBytes({ fencingEpoch: 0, schemaVersion: 'V1' }),
    'manifest.candidate.json': candidateBytes,
    'manifest.json': priorBytes,
    'manifest.prior.json': priorBytes,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WRITES
// ─────────────────────────────────────────────────────────────────────────────

function ensurePhasePath(filePath) {
  const relative = path.relative(PHASE_ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`artifact path escapes rollout root: ${filePath}`);
  }
}

function writeBytes(filePath, bytes) {
  ensurePhasePath(filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, bytes, { mode: 0o600 });
}

/**
 * Generate canonical compiled and activation artifacts inside the rollout root.
 *
 * @returns {Object} Build identity and artifact counts.
 */
function buildArtifacts() {
  const { fixture, snapshot } = loadSnapshot();
  const compiled = compiledArtifacts(snapshot, fixture);
  const activation = activationArtifacts(snapshot, compiled);
  for (const [name, bytes] of Object.entries(compiled)) {
    writeBytes(path.join(PHASE_ROOT, 'compiled', name), bytes);
  }
  for (const [name, bytes] of Object.entries(activation)) {
    writeBytes(path.join(PHASE_ROOT, 'activation', name), bytes);
  }
  return {
    activationArtifacts: Object.keys(activation).length,
    compiledArtifacts: Object.keys(compiled).length,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    graphHash: snapshot.destinationGraph.graphHash,
    status: 'built',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS AND ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  activationArtifacts,
  buildArtifacts,
  compiledArtifacts,
  loadSnapshot,
  scorerScenario,
  sourceInputs,
  typedGold,
};

if (require.main === module) {
  process.stdout.write(`${canonicalize(buildArtifacts())}\n`);
}
