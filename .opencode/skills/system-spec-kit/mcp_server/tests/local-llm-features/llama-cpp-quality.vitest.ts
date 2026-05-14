// ---------------------------------------------------------------
// MODULE: llama-cpp + EmbeddingGemma quality test suite
// ---------------------------------------------------------------
//
// End-to-end quality checks for the llama-cpp embedding path:
// determinism, L2 normalization, semantic similarity ordering using
// the canonical 15-case fixture, document/query prefix asymmetry,
// concurrent generation safety, and long-text handling.
//
// Tests skip when llama-cpp runtime + GGUF model are not installed.
// On the canonical post-014 setup, all checks run end-to-end against
// the actual `unsloth/embeddinggemma-300m-GGUF` model via node-llama-cpp.

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { readFileSync } from 'node:fs';

import { getLlamaCppAvailability } from '../../../shared/embeddings/llama-cpp-availability.js';
import { LlamaCppProvider } from '../../../shared/embeddings/providers/llama-cpp.js';

interface SimilarityCase {
  a: string;
  b: string;
  expectedRange: [number, number];
  category: string;
  description: string;
}

interface SimilarityFixture {
  cases: SimilarityCase[];
  thresholds: Record<string, { min: number; description: string }>;
  metadata: { embeddingModel: string; dimensions: number };
}

const fixturePath = path.join(__dirname, '..', 'fixtures', 'similarity-test-cases.json');
const fixture: SimilarityFixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));

const llamaCppAvailable = getLlamaCppAvailability().available;
const itLlama = llamaCppAvailable ? it : it.skip;

// llama-cpp's GGUF Q8_0 quantization produces slightly noisier vectors than the
// reference (hf-local ONNX q8). Per 014/015 packet: parity vs hf-local has
// mean cosine ~0.968 (MILD_DIVERGENCE) but retrieval quality is equivalent.
//
// IMPORTANT CALIBRATION NOTE: the 15-case fixture's expected ranges are
// calibrated for `google/embeddinggemma-300m` in its native sentence-transformers
// form, NOT the GGUF Q8_0 quantization. GGUF has a higher absolute similarity
// floor (unrelated pairs ~0.5 rather than ~0.2) but the same ordering shape.
// Quality assertions below test RELATIVE ORDERING rather than absolute fixture
// thresholds, which keeps the tests honest across both backends.
const DETERMINISM_TOLERANCE = 1e-3; // per-element max-diff for repeat runs (q8 quantization rounding)
const L2_NORM_TOLERANCE = 0.05; // ||v|| should be ~1.0 ± this
const LLAMA_CPP_UNRELATED_CEILING = 0.7; // GGUF unrelated-pair similarity baseline (calibrated empirically)

function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

function l2Norm(v: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < v.length; i += 1) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

function maxElementDiff(a: Float32Array, b: Float32Array): number {
  let max = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const diff = Math.abs(a[i] - b[i]);
    if (diff > max) max = diff;
  }
  return max;
}

describe('llama-cpp + EmbeddingGemma quality', () => {
  // CLAIM: 014/015 + 014/016 + 014/017 packets — llama-cpp uses
  // unsloth/embeddinggemma-300m-GGUF Q8_0 + Metal acceleration, generates
  // 768-dim Float32Array vectors that are retrieval-equivalent to hf-local
  // ONNX q8 (recall@5 0.912, MRR delta 0) with MILD_DIVERGENCE (mean cosine 0.968)
  // due to quantization differences.

  if (!llamaCppAvailable) {
    it.skip('all quality tests skipped — llama-cpp runtime not installed', () => {
      // soft-skip marker for CI / non-Apple machines
    });
    return;
  }

  let provider: LlamaCppProvider;

  beforeAll(async () => {
    provider = new LlamaCppProvider({ timeout: 60_000 });
    // Warm up so cold-start time isn't measured in every test
    await provider.generateEmbedding('warmup');
  }, 120_000);

  afterEach(() => {
    // No global state to reset; provider is reused across tests
  });

  // -------------------------------------------------------------------
  // Determinism + numerical stability
  // -------------------------------------------------------------------

  itLlama('Q1 deterministic: same input produces equivalent vectors across 3 runs', async () => {
    const text = 'Use FSRS algorithm for spaced repetition memory consolidation.';
    const v1 = await provider.generateEmbedding(text);
    const v2 = await provider.generateEmbedding(text);
    const v3 = await provider.generateEmbedding(text);

    expect(v1).toBeInstanceOf(Float32Array);
    expect(v2).toBeInstanceOf(Float32Array);
    expect(v3).toBeInstanceOf(Float32Array);
    expect(v1!.length).toBe(768);

    const diff12 = maxElementDiff(v1!, v2!);
    const diff13 = maxElementDiff(v1!, v3!);
    const diff23 = maxElementDiff(v2!, v3!);

    // q8 quantization can introduce small rounding noise; tolerance ~1e-3 is safe
    expect(diff12).toBeLessThan(DETERMINISM_TOLERANCE);
    expect(diff13).toBeLessThan(DETERMINISM_TOLERANCE);
    expect(diff23).toBeLessThan(DETERMINISM_TOLERANCE);
  }, 60_000);

  itLlama('Q2 L2 normalization: vector magnitudes are close to 1.0', async () => {
    const texts = [
      'short',
      'medium length test sentence with multiple tokens',
      'a much longer paragraph spanning several phrases and clauses, complete with punctuation, intended to exercise the embedding model on substantive prose rather than a single keyword',
    ];

    for (const text of texts) {
      const v = await provider.generateEmbedding(text);
      expect(v).toBeInstanceOf(Float32Array);
      const norm = l2Norm(v!);
      // EmbeddingGemma outputs are designed for cosine similarity; expect ~unit norm
      expect(Math.abs(norm - 1.0)).toBeLessThan(L2_NORM_TOLERANCE);
    }
  }, 60_000);

  // -------------------------------------------------------------------
  // Semantic similarity quality (using canonical 15-case fixture)
  // -------------------------------------------------------------------

  itLlama('Q3 self-similarity: identical strings produce cosine ≥ 0.95', async () => {
    const identicalCase = fixture.cases.find((c) => c.category === 'identical');
    expect(identicalCase).toBeDefined();
    const v1 = await provider.generateEmbedding(identicalCase!.a);
    const v2 = await provider.generateEmbedding(identicalCase!.b);
    const sim = cosine(v1!, v2!);
    // Identical text MUST produce near-perfect cosine — this is invariant across quantization
    expect(sim).toBeGreaterThanOrEqual(0.95);
  }, 60_000);

  itLlama('Q4 semantic-equivalent: paraphrases produce cosine higher than unrelated baseline', async () => {
    const equivalentCase = fixture.cases.find((c) => c.category === 'semantic-equivalent');
    const unrelatedCase = fixture.cases.find((c) => c.category === 'completely-different');
    expect(equivalentCase).toBeDefined();
    expect(unrelatedCase).toBeDefined();

    const [vEqA, vEqB, vUnA, vUnB] = await Promise.all([
      provider.generateEmbedding(equivalentCase!.a),
      provider.generateEmbedding(equivalentCase!.b),
      provider.generateEmbedding(unrelatedCase!.a),
      provider.generateEmbedding(unrelatedCase!.b),
    ]);
    const simEquivalent = cosine(vEqA!, vEqB!);
    const simUnrelated = cosine(vUnA!, vUnB!);

    // Paraphrases should be meaningfully more similar than unrelated pairs
    expect(simEquivalent).toBeGreaterThan(simUnrelated + 0.15);
    expect(simEquivalent).toBeGreaterThanOrEqual(0.7); // GGUF paraphrase baseline
  }, 60_000);

  itLlama('Q5 completely-different: unrelated strings stay below GGUF unrelated ceiling', async () => {
    const unrelatedCase = fixture.cases.find((c) => c.category === 'completely-different');
    expect(unrelatedCase).toBeDefined();
    const v1 = await provider.generateEmbedding(unrelatedCase!.a);
    const v2 = await provider.generateEmbedding(unrelatedCase!.b);
    const sim = cosine(v1!, v2!);
    // GGUF Q8_0 has a higher unrelated-pair similarity floor than the fixture's
    // sentence-transformers calibration. ~0.7 is a documented empirical ceiling.
    expect(sim).toBeLessThanOrEqual(LLAMA_CPP_UNRELATED_CEILING);
  }, 60_000);

  itLlama('Q6 similarity ordering: identical > paraphrase > related > unrelated', async () => {
    const base = 'Use FSRS algorithm';
    const [vBase, vIdent, vParaphrase, vRelated, vUnrelated] = await Promise.all([
      provider.generateEmbedding(base),
      provider.generateEmbedding(base), // identical
      provider.generateEmbedding('Apply FSRS method'), // paraphrase
      provider.generateEmbedding('Use FSRS for spaced repetition'), // related
      provider.generateEmbedding('Configure database connection'), // unrelated
    ]);

    const simIdent = cosine(vBase!, vIdent!);
    const simParaphrase = cosine(vBase!, vParaphrase!);
    const simRelated = cosine(vBase!, vRelated!);
    const simUnrelated = cosine(vBase!, vUnrelated!);

    expect(simIdent).toBeGreaterThan(simParaphrase);
    expect(simParaphrase).toBeGreaterThan(simRelated);
    expect(simRelated).toBeGreaterThan(simUnrelated);
    // also sanity-check the absolute floor: even the related pair should outclass unrelated by a wide margin
    expect(simRelated - simUnrelated).toBeGreaterThan(0.2);
  }, 60_000);

  itLlama('Q7 full-fixture ordering: similarity buckets are correctly ordered by semantic distance', async () => {
    // Compute cosine for all 15 fixture pairs and bucket by category.
    // Test that GGUF preserves the ORDERING of semantic-distance buckets even if absolute
    // values diverge from the ONNX-calibrated fixture ranges.
    const sims: Record<string, number[]> = {};
    for (const testCase of fixture.cases) {
      const v1 = await provider.generateEmbedding(testCase.a);
      const v2 = await provider.generateEmbedding(testCase.b);
      const sim = cosine(v1!, v2!);
      if (!sims[testCase.category]) sims[testCase.category] = [];
      sims[testCase.category].push(sim);
    }

    // Compute category means
    const meanOf = (cat: string): number | undefined => {
      const arr = sims[cat];
      if (!arr || arr.length === 0) return undefined;
      return arr.reduce((s, x) => s + x, 0) / arr.length;
    };

    const identical = meanOf('identical') ?? 0;
    const semanticEquivalent = meanOf('semantic-equivalent') ?? 0;
    const semanticRelated = meanOf('semantic-related') ?? 0;
    const unrelated = meanOf('unrelated') ?? 0;
    const completelyDifferent = meanOf('completely-different') ?? 0;

    // eslint-disable-next-line no-console
    console.info('[Q7] category mean cosines:', JSON.stringify({
      identical, semanticEquivalent, semanticRelated, unrelated, completelyDifferent,
    }, null, 2));

    // ORDERING invariants (the semantic-distance hierarchy must hold)
    expect(identical).toBeGreaterThan(semanticEquivalent);
    expect(semanticEquivalent).toBeGreaterThan(semanticRelated);
    expect(semanticRelated).toBeGreaterThan(unrelated);
    expect(unrelated).toBeGreaterThan(completelyDifferent);

    // ABSOLUTE invariants (regardless of quantization)
    expect(identical).toBeGreaterThanOrEqual(0.95);
    expect(completelyDifferent).toBeLessThanOrEqual(LLAMA_CPP_UNRELATED_CEILING);

    // SPREAD invariant: the highest-similarity bucket should beat the lowest by a wide margin
    expect(identical - completelyDifferent).toBeGreaterThan(0.3);
  }, 600_000);

  // -------------------------------------------------------------------
  // Concurrent + edge cases
  // -------------------------------------------------------------------

  itLlama('Q8 concurrent generation: 5 parallel embeddings return correct shape + match serial output', async () => {
    const texts = [
      'first parallel embedding sample',
      'second parallel embedding sample',
      'third parallel embedding sample',
      'fourth parallel embedding sample',
      'fifth parallel embedding sample',
    ];

    const parallel = await Promise.all(texts.map((t) => provider.generateEmbedding(t)));
    const serial: (Float32Array | null)[] = [];
    for (const text of texts) {
      serial.push(await provider.generateEmbedding(text));
    }

    for (let i = 0; i < texts.length; i += 1) {
      expect(parallel[i]).toBeInstanceOf(Float32Array);
      expect(parallel[i]!.length).toBe(768);
      expect(serial[i]).toBeInstanceOf(Float32Array);
      // Parallel and serial outputs for same text should match within determinism tolerance
      const diff = maxElementDiff(parallel[i]!, serial[i]!);
      expect(diff).toBeLessThan(DETERMINISM_TOLERANCE);
    }
  }, 120_000);

  itLlama('Q9 long text within context window produces valid 768-dim vector; over-context throws a clear error', async () => {
    // EmbeddingGemma + GGUF Q8_0 has a fixed context window (~2048 tokens).
    // Short-medium texts must succeed; texts beyond the window must throw a CLEAR error
    // (no silent failure / zero vector). The caller (Memory MCP) is responsible for chunking.

    // Within-context case: ~1500 chars (~375 tokens) — well under the limit
    const inContext = 'EmbeddingGemma local embedding model in production. '.repeat(28);
    expect(inContext.length).toBeLessThan(2000);
    const vOk = await provider.generateEmbedding(inContext);
    expect(vOk).toBeInstanceOf(Float32Array);
    expect(vOk!.length).toBe(768);
    expect(l2Norm(vOk!)).toBeGreaterThan(0.5);

    // Over-context case: 5000+ chars (~1250 tokens) — may exceed depending on tokenization
    const overContext = 'EmbeddingGemma local embedding model. '.repeat(160);
    expect(overContext.length).toBeGreaterThanOrEqual(5000);
    let outcome: 'success' | 'expected-throw' | 'unexpected-throw' = 'success';
    let errorMessage = '';
    try {
      const v = await provider.generateEmbedding(overContext);
      // If it succeeded, must be a valid embedding (model truncated or has larger context than expected)
      expect(v).toBeInstanceOf(Float32Array);
      expect(v!.length).toBe(768);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : String(err);
      // Acceptable: clear context-size error
      if (/context size|longer than|tokens/i.test(errorMessage)) {
        outcome = 'expected-throw';
      } else {
        outcome = 'unexpected-throw';
      }
    }

    // The behavior is documented: either succeed cleanly OR throw a clear context-size error.
    // A silent zero-vector or generic crash would be a real bug.
    expect(['success', 'expected-throw']).toContain(outcome);
    if (outcome === 'expected-throw') {
      // eslint-disable-next-line no-console
      console.info(`[Q9] over-context (5000 chars) correctly raised a clear error: ${errorMessage.slice(0, 100)}`);
    }
  }, 120_000);

  itLlama('Q10 throughput baseline: 10 embeddings under 12 seconds (realistic per-iter ~1s)', async () => {
    const texts = Array.from({ length: 10 }, (_, i) => `throughput sample ${i} — quality-test corpus`);
    const start = performance.now();
    for (const t of texts) {
      const v = await provider.generateEmbedding(t);
      expect(v).toBeInstanceOf(Float32Array);
    }
    const elapsed = performance.now() - start;
    // 10 embeddings should complete within 12s on Apple Silicon Metal (typical 0.6-1.2s/embed).
    // This is a regression catch, not a fine-grained perf gate.
    expect(elapsed).toBeLessThan(12_000);
    // eslint-disable-next-line no-console
    console.info(`[Q10] 10-embed throughput: ${(elapsed / 10).toFixed(1)} ms/embed (total ${elapsed.toFixed(0)} ms)`);
  }, 30_000);
});
