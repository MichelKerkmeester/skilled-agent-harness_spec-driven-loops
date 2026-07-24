#!/usr/bin/env node
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
  artifactBytes,
  compileRegistry,
  sha256,
} = require('../lib/registry-compiler.cjs');
const { evaluateCanary } = require('../lib/router.cjs');
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
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-prompt');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceBytes() {
  return {
    'SKILL.md': fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md')),
    'hub-router.json': fs.readFileSync(path.join(SKILL_ROOT, 'hub-router.json')),
    'mode-registry.json': fs.readFileSync(path.join(SKILL_ROOT, 'mode-registry.json')),
    'prompt-improve/SKILL.md': fs.readFileSync(path.join(SKILL_ROOT, 'prompt-improve', 'SKILL.md')),
    'prompt-models/SKILL.md': fs.readFileSync(path.join(SKILL_ROOT, 'prompt-models', 'SKILL.md')),
  };
}

function loadSnapshot() {
  const fixture = readJson(path.join(PHASE_ROOT, 'fixtures', 'canary-cases.v1.json'));
  const bytes = sourceBytes();
  const registry = JSON.parse(bytes['mode-registry.json'].toString('utf8'));
  return {
    fixture,
    snapshot: compileRegistry({
      activationGeneration: fixture.activationGeneration,
      hubRouter: JSON.parse(bytes['hub-router.json'].toString('utf8')),
      hubSkillMarkdown: bytes['SKILL.md'].toString('utf8'),
      packetSkillMarkdown: Object.fromEntries(registry.modes.map((mode) => (
        [mode.workflowMode, bytes[`${mode.packet}/SKILL.md`].toString('utf8')]
      ))),
      registry,
      sourceBytes: bytes,
    }),
  };
}

function ensurePhasePath(filePath) {
  const relative = path.relative(PHASE_ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`artifact path escapes child root: ${filePath}`);
  }
}

function writeBytes(filePath, bytes) {
  ensurePhasePath(filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, bytes, { mode: 0o600 });
}

function compiledLeafPairsForDecision(snapshot, decision) {
  if (decision.action !== 'route') return [];
  const selections = new Map(snapshot.resourceSelections.map((selection) => (
    [selection.workflowMode, selection.leafPairs]
  )));
  return decision.route.targets.flatMap((entry) => {
    const pairs = selections.get(entry.destinationId.workflowMode);
    if (!pairs) throw new TypeError('compiled resource selection is missing');
    return pairs;
  });
}

function compatibilityProjection(snapshot, decision, leafPairs = []) {
  return projectToRouteGold(decision, {
    leafPairs,
    manifestResources: snapshot.manifestResources,
    policy: snapshot.policy,
  });
}

function typedGold(snapshot, fixture) {
  const resourceByPair = new Map(snapshot.manifestResources.map((entry) => (
    [`${entry.workflowMode}\u0000${entry.leafResourceId}`, entry.resource]
  )));
  const cases = fixture.cases.map((entry) => {
    const evaluated = evaluateCanary(snapshot, entry);
    const leafPairs = compiledLeafPairsForDecision(snapshot, evaluated.decision);
    const projection = compatibilityProjection(snapshot, evaluated.decision, leafPairs);
    const row = {
      assertions: {
        duplicateIdempotencyKeyProducesSingleReceipt: false,
        handoffEdges: [],
        rankCalls: evaluated.trace.rankCalls,
      },
      decisionAction: evaluated.decision.action,
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      observedIntents: projection.observedIntents,
      observedResources: leafPairs.map((pair) => ({
        intent: pair.workflowMode,
        resource: resourceByPair.get(`${pair.workflowMode}\u0000${pair.leafResourceId}`),
      })),
      receiptAttempts: [],
      scenarioId: entry.id,
      schemaVersion: 'V1',
      targetQualifiedIds: evaluated.decision.action === 'route'
        ? evaluated.decision.route.targets.map((entryTarget) => (
          qualifiedDestinationId(entryTarget.destinationId)
        ))
        : [],
      ...(evaluated.decision.action === 'route'
        ? { selectionKind: evaluated.decision.route.selectionKind }
        : {}),
    };
    row.projectionHash = computeProjectionHash('TypedRouteGoldV1', row);
    return row;
  });
  return { cases, schemaVersion: 'V1' };
}

function buildArtifacts() {
  const { fixture, snapshot } = loadSnapshot();
  const card = generatePolicyCard(snapshot);
  const compiledDir = path.join(PHASE_ROOT, 'compiled');
  const activationDir = path.join(PHASE_ROOT, 'activation');
  const artifacts = {
    'PolicyCardV1.md': Buffer.from(card.markdown, 'utf8'),
    'advisor-projection.json': artifactBytes(snapshot.advisorProjection),
    'policy.json': artifactBytes(snapshot.policy),
    'projection-graph.json': artifactBytes(snapshot.projectionGraph),
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
  const priorBytes = artifactBytes(prior);
  writeBytes(path.join(activationDir, 'manifest.prior.json'), priorBytes);
  writeBytes(path.join(activationDir, 'manifest.json'), priorBytes);
  writeBytes(path.join(activationDir, 'manifest.candidate.json'), artifactBytes(candidate));
  writeBytes(
    path.join(activationDir, 'fence-state.json'),
    artifactBytes({ fencingEpoch: 0, schemaVersion: 'V1' }),
  );
  const acceptance = {
    candidateArtifacts: Object.fromEntries(Object.entries(artifacts).map(([name, bytes]) => (
      [name, sha256(bytes)]
    ))),
    candidatePolicy: candidate.selectedPolicy,
    expectedCurrent: prior.selectedPolicy,
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
    artifacts: Object.keys(artifacts).length,
    basePolicyHash: snapshot.policy.basePolicyHash,
    defaultMode: snapshot.routingModel.defaultMode,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    status: 'built',
  };
}

module.exports = {
  buildArtifacts,
  compatibilityProjection,
  compiledLeafPairsForDecision,
  loadSnapshot,
  sourceBytes,
  typedGold,
};

if (require.main === module) {
  process.stdout.write(`${canonicalize(buildArtifacts())}\n`);
}
