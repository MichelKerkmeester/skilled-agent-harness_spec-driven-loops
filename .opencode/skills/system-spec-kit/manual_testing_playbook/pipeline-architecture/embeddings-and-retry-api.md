---
title: "219 -- Embeddings and Retry API"
description: "This scenario validates Embeddings and Retry API for `219`. It focuses on verifying the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers."
audited_post_018: true
version: 3.6.0.14
---

# 219 -- Embeddings and Retry API

## 1. OVERVIEW

This scenario validates Embeddings and Retry API for `219`. It focuses on verifying the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers.
- Real user request: `` Please validate Embeddings and Retry API against mcp_server/api/providers.ts and tell me whether the expected signals are present: `mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, profile helpers, provider cascade, and current `ollama`/`hf-local` model IDs; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state. ``
- Prompt: `Validate Embeddings and Retry API against mcp_server/api/providers.ts and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, profile helpers, provider cascade, `nomic-embed-text-v1.5`, and `nomic-ai/nomic-embed-text-v1.5`; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the stable API surface, shared embedding substrate, and retry orchestration layers align with the documented contract; FAIL if public exports are incomplete, shared embedding lifecycle helpers are missing, or retry recovery behavior is not present

---

## 3. TEST EXECUTION

### Prompt

```
Validate Embeddings and Retry API against mcp_server/api/providers.ts and return pass/fail with cited evidence.
```

### Commands

1. Inspect `mcp_server/api/providers.ts` and capture the exported public symbols
2. Inspect `shared/embeddings.ts` and confirm the documented weighted text construction, cache policy, lazy provider setup, batch behavior, profile helpers, provider cascade, and local model IDs are present
3. Inspect `mcp_server/lib/providers/retry-manager.ts` and confirm queue states, retry delays, circuit breaker rules, sanitized provider errors, and success-path refresh logic
4. Run an import smoke test or equivalent script check that consumes the public symbols from `mcp_server/api/providers` only
5. Correlate the public API with the shared and retry layers to confirm the documented responsibilities line up end to end

### Expected

`mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, profile helpers, provider cascade, `nomic-embed-text-v1.5`, and `nomic-ai/nomic-embed-text-v1.5`; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state

### Evidence

Public export capture from `mcp_server/api/providers.ts`:

```text
7: export {
8:   generateEmbedding,
9:   generateQueryEmbedding,
10:   getEmbeddingProfile,
11: } from '../lib/providers/embeddings.js';
12: 
13: export * as retryManager from '../lib/providers/retry-manager.js';
```

`shared/embeddings.ts` weighted text, cache, lazy provider setup, batching, profile helpers, and registry-derived model defaults observed:

```text
282: /** Build weighted document text from prioritized sections within the embedding budget. */
283: function buildWeightedDocumentText(
298: /**
299:  * Generate SHA256 hash key for cache lookup.
326: /** Store embedding in cache with LRU eviction */
350: // 4. LAZY SINGLETON PROVIDER INSTANCE
389: async function getProvider(): Promise<IEmbeddingProvider> {
410:       providerInstance = await createEmbeddingsProvider({
411:         warmup: false, // No warmup at creation; model loads on first embed call
554: /**
555:  * Generate embeddings for batch of texts with parallel processing and rate limiting.
561: async function generateBatchEmbeddings(
884: /** Get current embedding profile (sync - returns null if not initialized) */
885: function getEmbeddingProfile(): EmbeddingProfileData | ReturnType<IEmbeddingProvider['getProfile']> | null {
892: /** Get embedding profile with initialization guarantee (async) */
893: async function getEmbeddingProfileAsync(): Promise<EmbeddingProfileData | ReturnType<IEmbeddingProvider['getProfile']>> {
915: export const DEFAULT_MODEL_NAME: string = getCanonicalFallback('hf-local');
```

Provider cascade and current local model IDs observed in imported shared registry/factory:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:
  Line 24:     name: 'nomic-embed-text-v1.5',
  Line 168:   // is `nomic-ai/nomic-embed-text-v1.5` on HuggingFace.

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:
  Line 164:     'nomic-ai/nomic-embed-text-v1.5': 768,
```

Exact grep output for legacy `unsloth/bge-base-en-v1.5-GGUF` or `onnx-community/bge-base-en-v1.5-ONNX` IDs under `shared` showed no matches; the output contained only `nomic` matches:

```text
Found 19 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/types.ts:
  Line 31:  * Prefix tokens are required by some models (notably `nomic-embed-text-v1.5`):

  Line 38:    * Canonical name (e.g. "nomic-embed-text-v1.5"). Used as the lookup key in


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:
  Line 24:     name: 'nomic-embed-text-v1.5',

  Line 160:     // registry's canonical name (e.g. 'nomic-embed-text-v1.5'). The

  Line 167:   // names; for hf-local we need the HF org/name. nomic-embed-text-v1.5

  Line 168:   // is `nomic-ai/nomic-embed-text-v1.5` on HuggingFace.


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:
  Line 129:   'nomic-embed-text-v1.5': 768,


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts:
  Line 100:     getCanonicalFallback('ollama') === 'nomic-embed-text-v1.5',

  Line 101:     "getCanonicalFallback('ollama') canonical = 'nomic-embed-text-v1.5' (ADR-013/014)",

  Line 104:     getCanonicalFallback('hf-local') === 'nomic-ai/nomic-embed-text-v1.5',

  Line 105:     "getCanonicalFallback('hf-local') canonical = 'nomic-ai/nomic-embed-text-v1.5' (ADR-014)",


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/registry.test.ts:
  Line 34: const ADR_CANONICAL_NAME = 'nomic-embed-text-v1.5';

  Line 35: const ADR_HF_LOCAL_FORM = 'nomic-ai/nomic-embed-text-v1.5';


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:
  Line 30:     name: 'nomic-embed-text-v1.5',


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:
  Line 36: // Task prefixes required by nomic-embed-text-v1.5

  Line 37: // See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5

  Line 69:   'nomic-ai/nomic-embed-text-v1.5': Object.freeze({

  Line 79:  * @param modelId - HuggingFace model id, e.g. 'nomic-ai/nomic-embed-text-v1.5'


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:
  Line 164:     'nomic-ai/nomic-embed-text-v1.5': 768,
```

Retry-manager evidence for pending/retry/failed/success states, retry delays, circuit breaker behavior, sanitized errors, and success refresh of vector/index state:

```text
Found 37 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:
  Line 11: import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache.js';
  Line 271: export function sanitizeAndLogEmbeddingFailure(
  Line 309:         SET embedding_status = 'retry',
  Line 313:           AND embedding_status = 'pending'
  Line 322:           AND embedding_status = 'retry'
  Line 338: const BACKOFF_DELAYS: number[] = [
  Line 390: // PROVIDER_FAILURE_THRESHOLD consecutive failures across any items, the
  Line 391: // Circuit opens for PROVIDER_COOLDOWN_MS, causing retryEmbedding to skip
  Line 393: const PROVIDER_FAILURE_THRESHOLD = 5;
  Line 394: const PROVIDER_COOLDOWN_MS = 120_000; // 2 minutes
  Line 426:   if (Date.now() - providerCircuitOpenedAt >= PROVIDER_COOLDOWN_MS) {
  Line 443:   if (providerFailures >= PROVIDER_FAILURE_THRESHOLD && providerCircuitOpenedAt === null) {
  Line 446:     console.warn(`[retry-manager] Embedding provider circuit breaker OPEN after ${providerFailures} consecutive failures. Cooldown: ${PROVIDER_COOLDOWN_MS}ms`);
  Line 503:     SET embedding_status = 'failed',
  Line 507:       AND (embedding_status = 'retry' OR COALESCE(retry_count, 0) > 0)
  Line 514:       AND (embedding_status = 'retry' OR COALESCE(retry_count, 0) > 0)
  Line 523:       SET embedding_status = 'failed',
  Line 528:         AND (embedding_status = 'retry' OR COALESCE(retry_count, 0) > 0)
  Line 564:       CASE WHEN embedding_status = 'pending' THEN 0 ELSE 1 END,
  Line 590:     // Should use BACKOFF_DELAYS[0] (1 minute), not BACKOFF_DELAYS[1] (5 minutes).
  Line 592:     const requiredDelay = BACKOFF_DELAYS[Math.min(backoffIndex, BACKOFF_DELAYS.length - 1)];
  Line 608:     WHERE embedding_status = 'failed'
  Line 624:       SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
  Line 625:       SUM(CASE WHEN embedding_status = 'retry' THEN 1 ELSE 0 END) as retry,
  Line 626:       SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed,
  Line 627:       SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as success,
  Line 717:         const sanitizedError = sanitizeAndLogEmbeddingFailure(
  Line 730:         storeEmbedding(
  Line 750:         SET embedding_status = 'success',
  Line 764:       db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(BigInt(id), embeddingBuffer);
  Line 770:         const syncedRows = getBm25Index().syncChangedRows(db, [id]);
  Line 786:     const sanitizedMessage = sanitizeAndLogEmbeddingFailure(
  Line 822:       SET embedding_status = 'retry',
  Line 851:     SET embedding_status = 'failed',
  Line 872:     SET embedding_status = 'retry',
  Line 877:     WHERE id = ? AND embedding_status = 'failed'
  Line 1156:   BACKOFF_DELAYS,
```

Import smoke-test equivalent script output consuming only `mcp_server/api/providers.ts` public symbols:

```text
{
  "path": ".opencode/skills/system-spec-kit/mcp_server/api/providers.ts",
  "observed": [
    "generateEmbedding",
    "generateQueryEmbedding",
    "getEmbeddingProfile",
    "retryManager"
  ],
  "missing": [],
  "privateImport": true,
  "onlyReexports": true
}
```

### Pass / Fail

- **PASS**: public exports, shared embedding lifecycle helpers, provider cascade, retry recovery behavior, and the documented current local defaults `nomic-embed-text-v1.5` and `nomic-ai/nomic-embed-text-v1.5` are present.

### Failure Triage

Check `mcp_server/api/providers.ts` for missing or renamed re-exports -> inspect `shared/embeddings.ts` for drift in cache, batching, profile helpers, provider cascade, or local model IDs -> verify retry delay, max retry, and circuit breaker logic in `retry-manager.ts` -> confirm public callers are not forced to import private provider modules directly

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline-architecture/embeddings-and-retry-api.md](../../feature_catalog/pipeline-architecture/embeddings-and-retry-api.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 219
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline-architecture/embeddings-and-retry-api.md`
