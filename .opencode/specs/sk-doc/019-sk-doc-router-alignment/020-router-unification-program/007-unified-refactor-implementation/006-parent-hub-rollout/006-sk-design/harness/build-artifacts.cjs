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
  sealCertificate,
} = require('../../../005-calibration/002-rank-vs-calibrated-contract/lib/calibration-contract.cjs');
const {
  artifactBytes,
  compileRegistry,
  sha256,
  sourceKeyForPacket,
  sourceKeyForRouter,
} = require('../lib/registry-compiler.cjs');
const { evaluateCanary, leafPairsForDecision } = require('../lib/router.cjs');
const { generatePolicyCard } = require('../lib/policy-card.cjs');

const CHILD_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(start) {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('repository root could not be resolved');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(CHILD_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-design');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceBytes() {
  const registry = readJson(path.join(SKILL_ROOT, 'mode-registry.json'));
  const bytes = {
    'SKILL.md': fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md')),
    'hub-router.json': fs.readFileSync(path.join(SKILL_ROOT, 'hub-router.json')),
    'mode-registry.json': fs.readFileSync(path.join(SKILL_ROOT, 'mode-registry.json')),
  };
  const routerSourceIds = {};
  for (const mode of registry.modes) {
    const packetSourceId = sourceKeyForPacket(mode.packet);
    bytes[packetSourceId] = fs.readFileSync(path.join(SKILL_ROOT, mode.packet, 'SKILL.md'));
    if (bytes[packetSourceId].toString('utf8').includes('RESOURCE_MAP =')) {
      routerSourceIds[mode.workflowMode] = packetSourceId;
    } else {
      const routerSourceId = sourceKeyForRouter(mode.packet);
      bytes[routerSourceId] = fs.readFileSync(
        path.join(SKILL_ROOT, mode.packet, 'references', 'smart-router-pseudocode.md'),
      );
      routerSourceIds[mode.workflowMode] = routerSourceId;
    }
  }
  return { bytes, routerSourceIds };
}

function loadSnapshot() {
  const fixture = readJson(path.join(CHILD_ROOT, 'fixtures', 'canary-cases.v1.json'));
  const sources = sourceBytes();
  const registry = JSON.parse(sources.bytes['mode-registry.json'].toString('utf8'));
  return {
    fixture,
    snapshot: compileRegistry({
      activationGeneration: fixture.activationGeneration,
      hubRouter: JSON.parse(sources.bytes['hub-router.json'].toString('utf8')),
      packetRouterMarkdown: Object.fromEntries(registry.modes.map((mode) => (
        [mode.workflowMode, sources.bytes[sources.routerSourceIds[mode.workflowMode]].toString('utf8')]
      ))),
      registry,
      routerSourceIds: sources.routerSourceIds,
      skillMarkdown: sources.bytes['SKILL.md'].toString('utf8'),
      sourceBytes: sources.bytes,
    }),
  };
}

function ensureChildPath(filePath) {
  const relative = path.relative(CHILD_ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`artifact path escapes the child root: ${filePath}`);
  }
}

function writeBytes(filePath, bytes) {
  ensureChildPath(filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, bytes, { mode: 0o600 });
}

function compatibilityProjection(snapshot, decision, leafPairs = []) {
  return projectToRouteGold(decision, {
    leafPairs,
    manifestResources: snapshot.manifestResources,
    policy: snapshot.policy,
  });
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
  const manifest = new Map(snapshot.manifestResources.map((resource) => (
    [`${resource.workflowMode}\0${resource.leafResourceId}`, resource.resource]
  )));
  const cases = fixture.cases.map((entry) => {
    const evaluated = evaluateCanary(snapshot, materializeFixtureInput(fixture, entry));
    const leafPairs = leafPairsForDecision(snapshot, evaluated.decision, entry);
    const projection = compatibilityProjection(snapshot, evaluated.decision, leafPairs);
    const row = {
      assertions: {
        duplicateIdempotencyKeyProducesSingleReceipt: false,
        handoffEdges: [],
        rankCalls: evaluated.trace.matchedScores.length > 1 ? 1 : 0,
      },
      decisionAction: evaluated.decision.action,
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      observedIntents: projection.observedIntents,
      observedResources: leafPairs.map((pair) => ({
        intent: pair.workflowMode,
        resource: manifest.get(`${pair.workflowMode}\0${pair.leafResourceId}`),
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
  const compiledDir = path.join(CHILD_ROOT, 'compiled');
  const activationDir = path.join(CHILD_ROOT, 'activation');
  const artifactPaths = {
    'PolicyCardV1.md': path.join(compiledDir, 'PolicyCardV1.md'),
    'advisor-projection.json': path.join(compiledDir, 'advisor-projection.json'),
    'policy.json': path.join(compiledDir, 'policy.json'),
    'projection-graph.json': path.join(compiledDir, 'projection-graph.json'),
    'route-gold.typed.json': path.join(compiledDir, 'route-gold.typed.json'),
  };
  writeBytes(artifactPaths['policy.json'], artifactBytes(snapshot.policy));
  writeBytes(artifactPaths['advisor-projection.json'], artifactBytes(snapshot.advisorProjection));
  writeBytes(artifactPaths['projection-graph.json'], artifactBytes(snapshot.projectionGraph));
  writeBytes(artifactPaths['PolicyCardV1.md'], Buffer.from(card.markdown, 'utf8'));
  writeBytes(artifactPaths['route-gold.typed.json'], artifactBytes(typedGold(snapshot, fixture)));

  const priorPath = path.join(activationDir, 'manifest.prior.json');
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
  writeBytes(path.join(activationDir, 'manifest.json'), priorBytes);
  writeBytes(path.join(activationDir, 'manifest.candidate.json'), artifactBytes(candidate));
  writeBytes(
    path.join(activationDir, 'fence-state.json'),
    artifactBytes({ fencingEpoch: 0, schemaVersion: 'V1' }),
  );
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
    leafResources: snapshot.manifestResources.length,
    status: 'built',
  };
}

module.exports = {
  buildArtifacts,
  compatibilityProjection,
  loadSnapshot,
  sourceBytes,
  typedGold,
};

if (require.main === module) {
  process.stdout.write(`${canonicalize(buildArtifacts())}\n`);
}
