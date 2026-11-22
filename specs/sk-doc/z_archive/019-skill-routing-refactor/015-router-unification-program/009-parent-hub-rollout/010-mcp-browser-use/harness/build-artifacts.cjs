#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const {
  canonicalize,
  computeProjectionHash,
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const {
  projectToRouteGold,
} = require('../../../005-decision-evaluator/lib/projector.cjs');
const {
  HUB_ID,
  REGISTRY_SOURCE,
  ROUTER_SOURCE,
  SKILL_SOURCE,
  artifactBytes,
  compileRegistry,
  sha256,
} = require('../lib/registry-compiler.cjs');
const { evaluateRoute } = require('../lib/router.cjs');
const { generatePolicyCard } = require('../lib/policy-card.cjs');

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
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', HUB_ID);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// The policy is compiled from the hub's own three authored files only, so a
// change anywhere else in the tree cannot stale this hub's manifest.
function sourceInputs() {
  const paths = {
    [REGISTRY_SOURCE]: path.join(SKILL_ROOT, 'mode-registry.json'),
    [ROUTER_SOURCE]: path.join(SKILL_ROOT, 'hub-router.json'),
    [SKILL_SOURCE]: path.join(SKILL_ROOT, 'SKILL.md'),
  };
  return Object.fromEntries(Object.entries(paths).map(([id, filePath]) => [id, fs.readFileSync(filePath)]));
}

function loadSnapshot() {
  const fixture = readJson(path.join(PHASE_ROOT, 'fixtures', 'canary-cases.v1.json'));
  const sourceBytes = sourceInputs();
  const snapshot = compileRegistry({
    activationGeneration: fixture.activationGeneration,
    hubRegistry: JSON.parse(sourceBytes[REGISTRY_SOURCE].toString('utf8')),
    hubSkillMarkdown: sourceBytes[SKILL_SOURCE].toString('utf8'),
    sourceBytes,
  });
  return { fixture, snapshot, sourceBytes };
}

function ensurePhasePath(filePath) {
  const relative = path.relative(PHASE_ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`artifact path escapes phase root: ${filePath}`);
  }
}

function writeBytes(filePath, bytes) {
  ensurePhasePath(filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, bytes, { mode: 0o600 });
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
    source: { featureFile: `${HUB_ID}-canary`, shape: 'sk-doc' },
  };
}

// Build-time expectation check: each case's declared action, selection kind,
// modes and intents are asserted against the evaluated decision, so a routing
// change that would rewrite the typed route gold fails the build instead of
// silently re-baselining it.
function assertGoldExpectations(entry, decision, projection) {
  const fail = (detail) => {
    const error = new Error(`gold mismatch for ${entry.id}: ${detail}`);
    error.code = 'GOLD_MISMATCH';
    throw error;
  };
  if (decision.action !== entry.expectedAction) {
    fail(`action ${decision.action} but expected ${entry.expectedAction}`);
  }
  if (entry.expectedSelectionKind
    && decision.action === 'route'
    && decision.route.selectionKind !== entry.expectedSelectionKind) {
    fail(`selection kind ${decision.route.selectionKind} but expected ${entry.expectedSelectionKind}`);
  }
  const modes = decision.action === 'route'
    ? decision.route.targets.map((target) => target.destinationId.workflowMode)
    : [];
  if (JSON.stringify(modes) !== JSON.stringify(entry.expectedModes || [])) {
    fail(`modes [${modes.join(', ')}] but expected [${(entry.expectedModes || []).join(', ')}]`);
  }
  // Negative gold carries the scorer labels `defer` and `none`, which name an
  // outcome rather than an intent, and the projector reports no intent for a
  // decision that does not route; only a routed decision has intents to compare.
  if (decision.action === 'route'
    && JSON.stringify(projection.observedIntents) !== JSON.stringify(entry.gold.expectedIntents)) {
    fail(`intents [${projection.observedIntents.join(', ')}] but expected [${entry.gold.expectedIntents.join(', ')}]`);
  }
}

function typedGold(snapshot, fixture) {
  const cases = fixture.cases.map((entry) => {
    const result = evaluateRoute(snapshot, entry);
    const observed = projectToRouteGold(result.decision, { policy: snapshot.policy });
    assertGoldExpectations(entry, result.decision, observed);
    const row = {
      assertions: {
        authorityWithheldUntilVerify: result.decision.action === 'route'
          && result.decision.route.authority === 'WithheldUntilVerify',
        noFallbackTransport: result.decision.action !== 'route',
      },
      decisionAction: result.decision.action,
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      observedIntents: observed.observedIntents,
      observedResources: observed.observedResources,
      scenario: scorerScenario(entry),
      scenarioId: entry.id,
      schemaVersion: 'V1',
      targetQualifiedIds: result.decision.action === 'route'
        ? result.decision.route.targets.map((target) => (
          `${target.destinationId.skillId}/${target.destinationId.workflowMode}`
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

function buildArtifacts() {
  const { fixture, snapshot } = loadSnapshot();
  const compiledDir = path.join(PHASE_ROOT, 'compiled');
  const activationDir = path.join(PHASE_ROOT, 'activation');
  const artifacts = {
    'PolicyCardV1.md': Buffer.from(generatePolicyCard(snapshot), 'utf8'),
    'advisor-projection.json': artifactBytes(snapshot.advisorProjection),
    'destination-graph.json': artifactBytes(snapshot.destinationGraph),
    'policy.json': artifactBytes(snapshot.policy),
    'route-gold.typed.json': artifactBytes(typedGold(snapshot, fixture)),
  };
  for (const [name, bytes] of Object.entries(artifacts)) {
    writeBytes(path.join(compiledDir, name), bytes);
  }

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
  writeBytes(path.join(activationDir, 'manifest.prior.json'), artifactBytes(prior));
  writeBytes(path.join(activationDir, 'manifest.json'), artifactBytes(prior));
  writeBytes(path.join(activationDir, 'manifest.candidate.json'), artifactBytes(candidate));
  writeBytes(path.join(activationDir, 'fence-state.json'), artifactBytes({ fencingEpoch: 0, schemaVersion: 'V1' }));
  const acceptance = {
    candidateArtifacts: Object.fromEntries(Object.entries(artifacts).map(([name, bytes]) => (
      [name, sha256(bytes)]
    ))),
    candidatePolicy: candidate.selectedPolicy,
    expectedCurrent: prior.selectedPolicy,
    expectedFencingEpoch: 0,
    graphHash: snapshot.destinationGraph.graphHash,
    hubId: HUB_ID,
    priorManifestHash: sha256(artifactBytes(prior)),
    schemaVersion: 'V1',
    servingAuthority: 'legacy',
    shadowOnly: true,
    sourceHashes: snapshot.sourceHashes,
  };
  writeBytes(path.join(activationDir, 'acceptance.json'), artifactBytes(acceptance));
  return {
    artifacts: Object.keys(artifacts).length,
    cases: fixture.cases.length,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    graphHash: snapshot.destinationGraph.graphHash,
    status: 'built',
  };
}

module.exports = {
  buildArtifacts,
  loadSnapshot,
  scorerScenario,
  sourceInputs,
  typedGold,
};

if (require.main === module) process.stdout.write(`${canonicalize(buildArtifacts())}\n`);
