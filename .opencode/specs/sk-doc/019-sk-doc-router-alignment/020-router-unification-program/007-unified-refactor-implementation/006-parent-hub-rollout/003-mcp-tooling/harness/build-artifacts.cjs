#!/usr/bin/env node
'use strict';

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
const SKILLS_ROOT = path.join(REPO_ROOT, '.opencode', 'skills');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceInputs() {
  const paths = {
    'mcp-code-mode/SKILL.md': path.join(SKILLS_ROOT, 'mcp-code-mode', 'SKILL.md'),
    'mcp-tooling/SKILL.md': path.join(SKILLS_ROOT, 'mcp-tooling', 'SKILL.md'),
    'mcp-tooling/hub-router.json': path.join(SKILLS_ROOT, 'mcp-tooling', 'hub-router.json'),
    'mcp-tooling/mcp-figma/SKILL.md': path.join(SKILLS_ROOT, 'mcp-tooling', 'mcp-figma', 'SKILL.md'),
    'mcp-tooling/mode-registry.json': path.join(SKILLS_ROOT, 'mcp-tooling', 'mode-registry.json'),
    'sk-design/SKILL.md': path.join(SKILLS_ROOT, 'sk-design', 'SKILL.md'),
    'sk-design/mode-registry.json': path.join(SKILLS_ROOT, 'sk-design', 'mode-registry.json'),
  };
  return Object.fromEntries(Object.entries(paths).map(([id, filePath]) => [id, fs.readFileSync(filePath)]));
}

function loadSnapshot() {
  const fixture = readJson(path.join(PHASE_ROOT, 'fixtures', 'canary-cases.v1.json'));
  const sourceBytes = sourceInputs();
  const hubRegistry = JSON.parse(sourceBytes['mcp-tooling/mode-registry.json'].toString('utf8'));
  const judgmentRegistry = JSON.parse(sourceBytes['sk-design/mode-registry.json'].toString('utf8'));
  const snapshot = compileRegistry({
    activationGeneration: fixture.activationGeneration,
    externalInfrastructureMarkdown: sourceBytes['mcp-code-mode/SKILL.md'].toString('utf8'),
    hubRegistry,
    hubSkillMarkdown: sourceBytes['mcp-tooling/SKILL.md'].toString('utf8'),
    judgmentRegistries: { [judgmentRegistry.skill]: judgmentRegistry },
    judgmentSkillMarkdown: {
      [judgmentRegistry.skill]: sourceBytes['sk-design/SKILL.md'].toString('utf8'),
    },
    packetSkillMarkdown: {
      'mcp-figma': sourceBytes['mcp-tooling/mcp-figma/SKILL.md'].toString('utf8'),
    },
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
    source: { featureFile: 'mcp-tooling-canary', shape: 'sk-doc' },
  };
}

function typedGold(snapshot, fixture) {
  const cases = fixture.cases.map((entry) => {
    const result = evaluateRoute(snapshot, entry);
    const observed = projectToRouteGold(result.decision, { policy: snapshot.policy });
    const row = {
      assertions: {
        authorityWithheldUntilVerify: result.decision.action === 'route',
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

function blastRadius(snapshot) {
  const priorRoot = path.resolve(PHASE_ROOT, '..');
  const priorPolicies = [
    ['sk-code', path.join(priorRoot, '001-sk-code', 'compiled', 'policy.json')],
    ['system-deep-loop', path.join(priorRoot, '002-system-deep-loop', 'compiled', 'policy.json')],
  ].map(([hubId, filePath]) => {
    const policy = readJson(filePath);
    return {
      compositionRules: policy.compositionRules.length,
      destinationCount: policy.destinations.length,
      externalMutationCapable: 0,
      hubId,
      requiresAuthorityFromEdges: 0,
    };
  });
  const graph = snapshot.destinationGraph;
  const current = {
    compositionRules: graph.compositionRules.length,
    destinationCount: graph.destinations.length,
    externalMutationCapable: graph.destinations.filter((entry) => (
      entry.effectClass === 'external-mutation-capable'
    )).length,
    hubId: snapshot.advisorProjection.hubId,
    requiresAuthorityFromEdges: graph.authorityGraph.filter((edge) => (
      edge.relation === 'requiresAuthorityFrom'
    )).length,
  };
  return {
    conclusion: 'mcp-tooling remains last because it is the measured canary with both external mutation capability and cross-hub judgment dependencies',
    measuredFrom: ['live authored registries', 'compiled prior-canary policies'],
    ordering: ['mcp-code-mode', 'sk-code', 'system-deep-loop', snapshot.advisorProjection.hubId],
    rows: [...priorPolicies, current],
    schemaVersion: 'V1',
  };
}

function buildArtifacts() {
  const { fixture, snapshot } = loadSnapshot();
  const compiledDir = path.join(PHASE_ROOT, 'compiled');
  const activationDir = path.join(PHASE_ROOT, 'activation');
  const artifacts = {
    'PolicyCardV1.md': Buffer.from(generatePolicyCard(snapshot), 'utf8'),
    'advisor-projection.json': artifactBytes(snapshot.advisorProjection),
    'blast-radius.json': artifactBytes(blastRadius(snapshot)),
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
    priorManifestHash: sha256(artifactBytes(prior)),
    schemaVersion: 'V1',
    servingAuthority: 'legacy',
    shadowOnly: true,
    sourceHashes: snapshot.sourceHashes,
  };
  writeBytes(path.join(activationDir, 'acceptance.json'), artifactBytes(acceptance));
  return {
    artifacts: Object.keys(artifacts).length,
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
