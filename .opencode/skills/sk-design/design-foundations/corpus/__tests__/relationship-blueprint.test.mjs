// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Foundations Corpus Relationship Tests                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { COMMON_PROOF_HANDOFF_FIELDS } from '../../../shared/corpus-context/corpus-context-plan.mjs';
import { validateProofHandoffRecord } from '../../../shared/corpus-context/validate-context-plan.mjs';
import { loadManifest } from '../../../styles/lib/engine/manifest.mjs';
import { runBuild } from '../../../styles/lib/engine/style-library.mjs';
import {
  STYLE_ALPHA,
  STYLE_BETA,
  appendDesignText,
  createFixtureCorpus,
} from '../../../styles/tests/engine/fixtures.mjs';
import {
  buildFoundationsRelationshipPlan,
  foundationsProofHandoffFields,
} from '../relationship-blueprint.mjs';
import {
  foundationsNoFitFixture,
  foundationsRelationshipFixture,
  foundationsRelationshipEvidence,
} from './fixtures.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function preparedCorpus(context) {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const evidence = foundationsRelationshipEvidence();
  await Promise.all([STYLE_ALPHA, STYLE_BETA].map((style) => appendDesignText(
    fixture.root,
    style.slug,
    `\`\`\`foundations-relationship-evidence\n${JSON.stringify(evidence)}\n\`\`\``,
  )));
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const manifest = await loadManifest(manifestPath);
  return {
    generationHash: manifest.generationHash,
    sourceBindings: Object.fromEntries(manifest.styles.map((style) => {
      const artifact = style.artifacts.find((candidate) => (
        candidate.path === `${style.slug}/DESIGN.md`
      ));
      return [style.id, {
        contentHash: style.contentHash,
        artifactPath: artifact.path,
        artifactHash: artifact.sha256,
        evidence,
      }];
    })),
    engineOptions: { corpusRoot: fixture.root, manifestPath },
  };
}

function hasSourceLiteralPayload(value) {
  if (value === null || typeof value !== 'object') return false;
  for (const key of Reflect.ownKeys(value)) {
    if (['content', 'tokens', 'rawValue', 'sourceLiteral', 'hydratedStyles'].includes(key)) {
      return true;
    }
    if (hasSourceLiteralPayload(value[key])) return true;
  }
  return false;
}

async function runDuringCorpusMutation(corpusRoot, operation) {
  let active = true;
  const crawlManifestPath = path.join(corpusRoot, '_manifest.json');
  const mutationLoop = (async () => {
    while (active) {
      await appendFile(crawlManifestPath, ' ');
      await new Promise((resolve) => setImmediate(resolve));
    }
  })();
  try {
    return await operation();
  } finally {
    active = false;
    await mutationLoop;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('typed compatibility and not-assessed evidence produce a bounded result', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsRelationshipFixture(
    prepared.generationHash,
    'not-assessed',
    prepared.sourceBindings,
  );
  const authorityBefore = structuredClone(fixture.input.authorityInputs);
  const result = await buildFoundationsRelationshipPlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'relationship-context');
  assert.equal(result.sources.length, 2);
  assert.equal(result.sources[0].role, 'coherent-anchor');
  assert.equal(result.sources[1].role, 'axis-owner');
  assert.ok(result.sources.every((source) => source.provenanceUseLabel));
  assert.equal(result.compatibilityGraph.edges[0].relation, 'not-assessed');
  assert.ok(Object.values(result.downstreamChecks).every((state) => state === 'not-assessed'));
  assert.equal(result.authorityPreservation.allPreserved, true);
  assert.equal(result.averagedTokenValues, false);
  assert.equal(result.copiedSourceSpecificMaterial, false);
  assert.equal(hasSourceLiteralPayload(result), false);
  assert.deepEqual(fixture.input.authorityInputs, authorityBefore);
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('a forged compatibility relation absent from hydrated evidence is rejected', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsRelationshipFixture(
    prepared.generationHash,
    'not-assessed',
    prepared.sourceBindings,
  );
  fixture.input.compatibilityGraph.edges[0].relation = 'works-with';
  fixture.input.compatibilityGraph.edges[0].basis = 'cross-axis-dependency';
  for (const attestation of fixture.input.sourceAttestations) {
    attestation.evidence.relation = 'works-with';
    attestation.evidence.basis = 'cross-axis-dependency';
  }
  const result = await buildFoundationsRelationshipPlan(
    fixture.input,
    prepared.engineOptions,
  );

  assert.equal(result.ok, false);
  assert.equal(result.error, 'relationship-attestation-rejected');
  assert.ok(result.details.some((detail) => (
    detail.endsWith('sourceEvidence:not-attested-by-artifact')
  )));
});

test('a mismatch plan never hydrates the observed generation', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsRelationshipFixture(
    prepared.generationHash,
    'not-assessed',
    prepared.sourceBindings,
  );
  const observedHash = `sha256:${'f'.repeat(64)}`;
  fixture.input.contextPlan.generationIdentity.observedGenerationHash = observedHash;
  fixture.input.contextPlan.generationIdentity.state = 'mismatch';
  fixture.input.contextPlan.availability = 'degraded';
  fixture.input.contextPlan.proofPlan.outcome = 'generation-mismatch';
  for (const attestation of fixture.input.sourceAttestations) {
    attestation.generationHash = observedHash;
  }
  const result = await buildFoundationsRelationshipPlan(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'generation-mismatch');
  assert.deepEqual(result.sources, []);
  assert.equal(result.proofHandoff.proofState.outcome, 'generation-mismatch');
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('a concurrently changing corpus becomes a validated no-fit result', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsRelationshipFixture(
    prepared.generationHash,
    'not-assessed',
    prepared.sourceBindings,
  );
  const result = await runDuringCorpusMutation(
    prepared.engineOptions.corpusRoot,
    () => buildFoundationsRelationshipPlan(fixture.input, prepared.engineOptions),
  );

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.ok(result.warnings.includes('retrieval-unavailable:corpus-changing'));
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('no-fit keeps the relationship blueprint and returns accepted evidence', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsNoFitFixture(prepared.generationHash);
  const result = await buildFoundationsRelationshipPlan(fixture.input, prepared.engineOptions);

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.deepEqual(result.relationshipBlueprint, fixture.input.blueprint);
  assert.deepEqual(result.compatibilityGraph.edges, []);
  assert.deepEqual(result.sources, []);
  assert.equal(result.proofHandoff.proofState.outcome, 'no-fit');
});

test('missing retrieval data yields a validated no-fit result instead of throwing', async (context) => {
  const prepared = await preparedCorpus(context);
  const fixture = foundationsRelationshipFixture(
    prepared.generationHash,
    'not-assessed',
    prepared.sourceBindings,
  );
  const result = await buildFoundationsRelationshipPlan(fixture.input, {
    ...prepared.engineOptions,
    manifestPath: path.join(prepared.engineOptions.corpusRoot, 'missing.json'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.outcome, 'no-fit');
  assert.deepEqual(validateProofHandoffRecord(result.proofHandoff), {
    valid: true,
    errors: [],
  });
});

test('foundations exports the unchanged shared proof field set', () => {
  assert.deepEqual(foundationsProofHandoffFields(), COMMON_PROOF_HANDOFF_FIELDS);
});
