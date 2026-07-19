#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ GENERATOR: DEEP-LOOP CANARY ARTIFACT SNAPSHOT                         ║
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
const { evaluateCanary } = require('../lib/canary-router.cjs');
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
    if (parent === current) throw new Error('repository root could not be resolved');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'system-deep-loop');

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceBytes() {
  return {
    'SKILL.md': fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md')),
    'leaf-manifest.json': fs.readFileSync(path.join(SKILL_ROOT, 'leaf-manifest.json')),
    'mode-registry.json': fs.readFileSync(path.join(SKILL_ROOT, 'mode-registry.json')),
    'smart_routing.md': fs.readFileSync(
      path.join(SKILL_ROOT, 'shared', 'references', 'smart_routing.md'),
    ),
  };
}

function loadSnapshot() {
  const fixture = readJson(path.join(PHASE_ROOT, 'fixtures', 'canary-cases.v1.json'));
  const bytes = sourceBytes();
  return {
    fixture,
    snapshot: compileRegistry({
      activationGeneration: fixture.activationGeneration,
      leafManifest: JSON.parse(bytes['leaf-manifest.json'].toString('utf8')),
      registry: JSON.parse(bytes['mode-registry.json'].toString('utf8')),
      skillMarkdown: bytes['SKILL.md'].toString('utf8'),
      smartRoutingMarkdown: bytes['smart_routing.md'].toString('utf8'),
      sourceBytes: bytes,
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

/**
 * Project only the leaf identities selected by the compiled shadow policy.
 *
 * @param {Object} snapshot - Compiled policy and manifest identities.
 * @param {Object} decision - Typed route decision.
 * @param {Array<{workflowMode:string,leafResourceId:string}>} [leafPairs]
 *   Leaf identities selected by the compiled policy.
 * @returns {{observedIntents:string[],observedResources:string[]}} Scorer observation.
 */
function compatibilityProjection(snapshot, decision, leafPairs = []) {
  return projectToRouteGold(decision, {
    leafPairs,
    manifestResources: snapshot.manifestResources,
    policy: snapshot.policy,
  });
}

function compiledLeafPairsForDecision(snapshot, decision) {
  if (decision.action !== 'route') return [];
  const selections = new Map(snapshot.routeLeafSelections.map((selection) => (
    [selection.workflowMode, selection.leafPairs]
  )));
  return decision.route.targets.flatMap((target) => {
    const workflowMode = target.destinationId.workflowMode;
    const leafPairs = selections.get(workflowMode);
    if (!leafPairs) {
      throw new TypeError(`compiled leaf selection is missing for ${workflowMode}`);
    }
    return leafPairs;
  });
}

function typedGold(snapshot, fixture) {
  const rows = fixture.cases.map((entry) => {
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
  const identityTuples = snapshot.projectionGraph.rows.map((row) => row.identityTuple);
  return {
    cases: rows,
    identityFixture: {
      injective: new Set(identityTuples.map(canonicalize)).size === identityTuples.length,
      tuples: identityTuples,
    },
    noCollapseFixtures: fixture.noCollapseFixtures,
    schemaVersion: 'V1',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate all machine and human projections from one compiled snapshot.
 *
 * @returns {Object} Content-addressed build result.
 */
function buildArtifacts() {
  const { fixture, snapshot } = loadSnapshot();
  const card = generatePolicyCard(snapshot);
  const compiledDir = path.join(PHASE_ROOT, 'compiled');
  const activationDir = path.join(PHASE_ROOT, 'activation');
  const artifactPaths = {
    'PolicyCardV1.md': path.join(compiledDir, 'PolicyCardV1.md'),
    'advisor-projection.json': path.join(compiledDir, 'advisor-projection.json'),
    'policy.json': path.join(compiledDir, 'policy.json'),
    'projection-graph.json': path.join(compiledDir, 'projection-graph.json'),
    'route-gold.typed.json': path.join(compiledDir, 'route-gold.typed.json'),
  };
  writeBytes(artifactPaths['policy.json'], artifactBytes(snapshot.policy));
  writeBytes(
    artifactPaths['advisor-projection.json'],
    artifactBytes(snapshot.advisorProjection),
  );
  writeBytes(artifactPaths['projection-graph.json'], artifactBytes(snapshot.projectionGraph));
  writeBytes(artifactPaths['PolicyCardV1.md'], Buffer.from(card.markdown, 'utf8'));
  writeBytes(artifactPaths['route-gold.typed.json'], artifactBytes(typedGold(snapshot, fixture)));

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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  buildArtifacts,
  compiledLeafPairsForDecision,
  compatibilityProjection,
  loadSnapshot,
  sourceBytes,
  typedGold,
};

if (require.main === module) {
  process.stdout.write(`${canonicalize(buildArtifacts())}\n`);
}
