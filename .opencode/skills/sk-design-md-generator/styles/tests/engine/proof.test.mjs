// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Card Ordering and Corpus Proof Fixtures                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import test from 'node:test';

import { assembleCandidateCards, candidateCardBytes } from '../../lib/engine/cards.mjs';
import {
  CORPUS_USE_PROOF_SCHEMA,
  gateCorpusInfluencedReadyClaim,
  validateCorpusUseProof,
} from '../../lib/engine/corpus-use-proof.mjs';

const HASH_A = `sha256:${'a'.repeat(64)}`;
const HASH_B = `sha256:${'b'.repeat(64)}`;
const HASH_C = `sha256:${'c'.repeat(64)}`;

function rankedStyle(id) {
  return {
    style: {
      id,
      title: `Style ${id}`,
      thesis: 'A coherent design thesis.',
      contentHash: HASH_B,
      capabilities: ['components', 'constraints', 'tokens'],
      availableSections: ['Components', 'Tokens'],
      tokenAxes: [{ axis: 'color', count: 2 }],
      provenance: {
        status: 'known',
        sourceUrl: `https://styles.example.test/${id}`,
        originalUrl: 'https://example.test',
        screenshotUrl: 'https://images.example.test/style.jpg',
        uuid: id,
        capturedAt: '2026-01-01T00:00:00.000Z',
        licenseStatus: 'unknown',
        rightsKnown: false,
        evidenceScope: ['reference', 'rationale'],
      },
      estimatedHydrationBytes: 4_096,
    },
    score: { deterministic: 1, lexical: 1, total: 2 },
  };
}

function validProof() {
  return {
    schemaVersion: CORPUS_USE_PROOF_SCHEMA,
    authority: {
      eligibilityFirst: true,
      scoresOnlyOrder: true,
      oneCoherentAnchor: true,
    },
    selectionRationale: { selectedStyleId: 'style-a', reason: 'Best eligible anchor.' },
    coherentFingerprint: {
      styleId: 'style-a',
      generationHash: HASH_A,
      contentHash: HASH_B,
    },
    transformationDelta: {
      summary: 'Translated relationships into project-owned values.',
      averagedTokenValues: false,
      copiedSourceSpecificMaterial: false,
    },
    provenanceAntiCopy: {
      sourceUrl: 'https://styles.example.test/style-a',
      licenseStatus: 'unknown',
      antiCopyConfirmed: true,
    },
    applicationProof: {
      target: 'project interface',
      summary: 'Applied the selected relationships and verified the target.',
      verified: true,
    },
  };
}

test('candidate cards preserve deterministic order and byte caps', () => {
  const ranked = [rankedStyle('style-a'), rankedStyle('style-b')];
  const first = assembleCandidateCards(ranked, HASH_A, { limit: 5, maxCardBytes: 2_048 });
  const second = assembleCandidateCards(ranked, HASH_A, { limit: 5, maxCardBytes: 2_048 });
  assert.deepEqual(second, first);
  assert.deepEqual(first.map((card) => card.id), ['style-a', 'style-b']);
  assert.ok(first.every((card) => candidateCardBytes(card) <= 2_048));
});

test('valid proof passes and invalid or missing proof blocks ready claims', () => {
  const proof = validProof();
  const manifest = {
    generationHash: HASH_A,
    styles: [rankedStyle('style-a').style],
  };
  assert.deepEqual(validateCorpusUseProof(proof, { manifest }), { valid: true, errors: [] });
  assert.deepEqual(gateCorpusInfluencedReadyClaim({ corpusInfluenced: true, proof, manifest }), {
    ready: true,
  });
  const invalid = structuredClone(proof);
  invalid.transformationDelta.averagedTokenValues = true;
  assert.equal(validateCorpusUseProof(invalid, { manifest }).valid, false);
  assert.equal(gateCorpusInfluencedReadyClaim({ corpusInfluenced: true }).ready, false);
  assert.deepEqual(gateCorpusInfluencedReadyClaim({ corpusInfluenced: false }), { ready: true });
});

test('ready claims reject fabricated fingerprints and false anti-copy evidence', () => {
  const [selectedCandidate] = assembleCandidateCards(
    [rankedStyle('style-a')],
    HASH_A,
    { limit: 1, maxCardBytes: 2_048 },
  );
  const fabricatedGeneration = validProof();
  fabricatedGeneration.coherentFingerprint.generationHash = HASH_C;
  const generationGate = gateCorpusInfluencedReadyClaim({
    corpusInfluenced: true,
    proof: fabricatedGeneration,
    selectedCandidate,
  });
  assert.equal(generationGate.ready, false);
  assert.ok(generationGate.errors.includes('coherentFingerprint.generationHash:mismatch'));

  const fabricatedContent = validProof();
  fabricatedContent.coherentFingerprint.contentHash = HASH_A;
  assert.equal(gateCorpusInfluencedReadyClaim({
    corpusInfluenced: true,
    proof: fabricatedContent,
    selectedCandidate,
  }).ready, false);

  const mismatchedProvenance = validProof();
  mismatchedProvenance.provenanceAntiCopy.sourceUrl = 'https://fabricated.example.test';
  assert.equal(gateCorpusInfluencedReadyClaim({
    corpusInfluenced: true,
    proof: mismatchedProvenance,
    selectedCandidate,
  }).ready, false);

  const falseAntiCopy = validProof();
  falseAntiCopy.provenanceAntiCopy.antiCopyConfirmed = false;
  falseAntiCopy.transformationDelta.copiedSourceSpecificMaterial = true;
  assert.equal(gateCorpusInfluencedReadyClaim({
    corpusInfluenced: true,
    proof: falseAntiCopy,
    selectedCandidate,
  }).ready, false);
});
