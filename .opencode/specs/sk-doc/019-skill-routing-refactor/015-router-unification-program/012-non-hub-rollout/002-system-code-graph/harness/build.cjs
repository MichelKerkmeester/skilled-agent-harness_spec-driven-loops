'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { canonicalize } = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  compile,
  evaluatePolicy,
  generatePolicyCard,
  projectAdvisor,
  projectTypedRouteGold,
} = require('../../../001-compiler-n1-shadow/compiler/index.cjs');
const {
  fenceStateBytes,
  manifestBytes,
} = require('../../../001-compiler-n1-shadow/activation/fenced-manifest.cjs');
const {
  PHASE_ROOT,
  canonicalJsonBytes,
  loadAuthoredSources,
} = require('./support.cjs');

const FIXTURE_SCENARIOS = Object.freeze([
  {
    expectedIntent: 'TOOL_SURFACE',
    expectedIntents: ['TOOL_SURFACE'],
    expectedResources: ['references/runtime/tool-surface.md'],
    fileName: 'exact-single-route.json',
    scenarioId: 'exact-single-route',
    taskText: 'tool surface reference',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'zero-signal-defer.json',
    scenarioId: 'zero-signal-defer',
    taskText: 'write a haiku about rain',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'one-turn-clarify.json',
    scenarioId: 'one-turn-clarify',
    taskText: 'tool surface reference readiness check reference',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'forbidden-reject.json',
    scenarioId: 'forbidden-reject',
    taskText: 'text-only exact searches',
  },
  {
    expectedIntent: 'ENSURE_READY_SELECTIVE_REINDEX',
    expectedIntents: ['ENSURE_READY_SELECTIVE_REINDEX'],
    expectedResources: [
      'manual-testing-playbook/read-path-freshness/ensure-ready-selective-reindex.md',
    ],
    fileName: 'singular-omission-zero-rank.json',
    scenarioId: 'singular-omission-zero-rank',
    taskText: 'repair a single stale tracked file',
  },
]);

function buildArtifacts() {
  const authoredSources = loadAuthoredSources();
  const policy = compile(authoredSources);
  const advisor = projectAdvisor(policy, authoredSources);
  const card = generatePolicyCard(policy, authoredSources);
  const fixtures = FIXTURE_SCENARIOS.map((scenario) => {
    const evaluation = evaluatePolicy(policy, { taskText: scenario.taskText });
    return {
      ...scenario,
      evaluation,
      typedGold: projectTypedRouteGold(policy, scenario.scenarioId, evaluation),
    };
  });
  const priorManifest = {
    schemaVersion: 'V1',
    selectedPolicy: { effectivePolicyHash: null, generation: 0 },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const candidateManifest = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: policy.effectivePolicyHash,
      generation: policy.activationGeneration,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const artifacts = new Map([
    ['compiled/system-code-graph/policy.json', canonicalJsonBytes(policy)],
    ['compiled/system-code-graph/advisor-projection.json', canonicalJsonBytes(advisor)],
    ['compiled/system-code-graph/route-gold.typed.json', canonicalJsonBytes(fixtures[0].typedGold)],
    ['compiled/system-code-graph/policy-card.md', Buffer.from(card.markdown, 'utf8')],
    ['activation/manifest.prior.json', manifestBytes(priorManifest)],
    ['activation/manifest.json', manifestBytes(priorManifest)],
    ['activation/manifest.candidate.json', manifestBytes(candidateManifest)],
    ['activation/fence-state.json', fenceStateBytes(0)],
  ]);
  for (const fixture of fixtures) {
    artifacts.set(
      `compiled/system-code-graph/fixtures/${fixture.fileName}`,
      canonicalJsonBytes(fixture.typedGold),
    );
  }
  return {
    advisor,
    artifacts,
    authoredSources,
    candidateManifest,
    card,
    fixtures,
    policy,
    priorManifest,
  };
}

function writeArtifacts() {
  const generated = buildArtifacts();
  for (const [relativePath, bytes] of generated.artifacts) {
    const filePath = path.join(PHASE_ROOT, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, bytes, { mode: 0o600 });
  }
  return generated;
}

if (require.main === module) {
  if (!process.argv.includes('--write')) {
    throw new Error('build is read-only unless --write is supplied');
  }
  const generated = writeArtifacts();
  process.stdout.write(
    `[target-build] wrote=${generated.artifacts.size} effective=${generated.policy.effectivePolicyHash} `
      + `bytes=${[...generated.artifacts.values()].reduce((sum, bytes) => sum + bytes.length, 0)}\n`,
  );
}

module.exports = {
  FIXTURE_SCENARIOS,
  buildArtifacts,
  writeArtifacts,
};
