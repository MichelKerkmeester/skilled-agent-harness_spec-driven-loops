---
title: "ADR-003: Decouple llama-cpp embedding context size from hardcoded 512"
description: "Use the model's trainContextSize as the embedding context ceiling instead of a hardcoded 512 tokens; add a token-count preflight that truncates input to a 90% safety budget before invoking the embedding."
trigger_phrases:
  - "ADR-003"
  - "llama-cpp context size decision"
  - "037 decision record"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive"
    last_updated_at: "2026-05-14T16:38:00Z"
    last_updated_by: "main-agent"
    recent_action: "ADR-003 authored and accepted"
    next_safe_action: "Final strict validate + handover update"
    completion_pct: 90
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# ADR-003: Decouple llama-cpp embedding context size from hardcoded 512

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Number** | ADR-003 |
| **Status** | **Accepted** (shipped under packet 037) |
| **Date** | 2026-05-14 |
| **Authors** | main-agent (Claude) + parallel-session work that pre-applied the source patch |
| **Supersedes** | none |
| **Superseded by** | none |
| **Lineage** | Follow-on to ADR-002 (governance-retention decouple, packet 032/001), which surfaced the embedding-worker fragility via 022's H4 root-cause analysis |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:context -->
## Context

The local-LLM Memory MCP substrate uses `node-llama-cpp@^3.15.1` (resolved at runtime to **3.17.1**) against the GGUF-quantized `unsloth/embeddinggemma-300m-GGUF` Q8_0 model for 768-dimension embeddings. Across the 014-local-embeddings-migration phase, every save-heavy scenario in the 24-- query-intelligence playbook (411–415) accumulated chronic E081/E085 save failures. 214 historical `memory_index` rows sit with `embedding_status='failed'`.

Code inspection at the start of packet 037 found a hardcoded mismatch in `shared/embeddings/providers/llama-cpp.ts`:

- Line 216: `contextSize: 512` passed to `model.createEmbeddingContext(...)`.
- `shared/chunking.ts:20`: `MAX_TEXT_LENGTH = 8000` *characters* as the only truncation gate.

EmbeddingGemma's SentencePiece tokenizer typically produces 1.3–6 chars per token depending on content. The 8000-char gate routinely allows inputs that tokenize to far more than 512 tokens. When such input reaches `getEmbeddingFor()`, the underlying llama.cpp C++ library validates against the context-size invariant and throws:

> `Input is longer than the context size. Try to increase the context size or use another model that supports longer contexts.`

The throw propagates as a provider failure → `isHealthy=false` → retry-manager increments `retry_count` → circuit breaker opens after 5 failures → 2-minute cooldown → entire save substrate becomes unavailable until the queue drains.

### Phase 1 reproduction

A standalone harness (`.opencode/specs/_sandbox/37--llama-cpp-context-size/repro.mjs`) exercised the provider directly across an 11-size input sweep:

| chars | tokens | result | elapsedMs |
|-------|--------|--------|-----------|
| 256   | 43     | vector | 164 |
| 512   | 85     | vector | 33  |
| 1024  | 168    | vector | 24  |
| 2048  | 335    | vector | 29  |
| **3000** | **492** | **vector** | **30** |
| **4000** | **655** | **throw** | **2** |
| 5000  | 819    | throw  | 1   |
| ... (all sizes ≥4000 chars throw with the same error) | | | |
| 10000 | 1640   | throw  | 3   |

The boundary sits precisely between 492 and 655 tokens, bracketing the hardcoded 512 cleanly.

### Version probe (telescoped)

The project's `package.json` declares `^3.15.1` but the resolved runtime is 3.17.1 (no lockfile to pin). A separate sandbox install of 3.17.1 was scoped in the plan but became moot once we confirmed the installed version IS 3.17.1. See `.opencode/specs/_sandbox/37--llama-cpp-context-size/version-comparison.md`.

---
<!-- /ANCHOR:context -->

<!-- ANCHOR:considered -->
## Alternatives Considered

### Option A — Raise contextSize + tokenizer preflight (CHOSEN)

Use the model's own `trainContextSize` (EmbeddingGemma reports 2048; fallback to 2048 if undefined) as the embedding ceiling. Pass `contextSize: 'auto'` with `minContextSize: 512` and `maxContextSize: trainContextSize` so node-llama-cpp picks the optimal size up to the model's max. Compute `tokenBudget = floor(trainContextSize × 0.9)` (10% safety margin). In `generateEmbedding()`, tokenize input once via `model.tokenize(text)`, truncate via `model.detokenize(tokens.slice(0, tokenBudget))` if over budget, emit `console.warn` for observability.

**Why**: matches the model card's actual capacity; defense-in-depth (raise ceiling + truncate the rare-but-possible long input); leverages the runtime's own tokenizer to avoid char↔token estimation drift; observability via warning log.

### Option B — Env-overridable contextSize, default 2048

Add `SPECKIT_LLAMA_CPP_CONTEXT_SIZE` env var defaulting to 2048; no model-derived ceiling. Mirrors the BACKGROUND_JOB_CONFIG pattern from 022's retry-manager refactor.

**Rejected because**: operators don't routinely know the model's max — a hardcoded 2048 with no model-derived ceiling could break on smaller models or fail to exploit larger ones. The chosen option's model-derived ceiling is self-adapting; if 037 surfaces a need for env override later, a wrapper around `trainContextSize` is straightforward.

### Option C — Replace `MAX_TEXT_LENGTH` char-gate with a token-gate

Refactor `shared/chunking.ts:20` to compute the gate based on tokens rather than chars. Larger blast radius — `MAX_TEXT_LENGTH` is referenced from multiple call sites (search pipeline, semantic chunker, save pipeline).

**Rejected because**: out of 037's surgical scope. The token-aware preflight in Option A addresses the immediate failure mode without touching the broader chunking contract. Consumer-side bounding (e.g. the expanded-query path at `lib/search/embedding-expansion.ts:268`) is 034's responsibility — a separate packet.

### Option D — Document the failure mode, change no code

Update `memory_save`'s tool schema description to warn callers that input >~3000 chars (or 512 tokens) may fail. Leave behavior unchanged.

**Rejected because**: this is the failure mode the codebase has lived with for ~32 packets. 214 failed rows in `memory_index` is the cumulative cost. The behavior is silently destructive to substrate health (circuit breaker flapping) — documentation alone doesn't fix that.

---
<!-- /ANCHOR:considered -->

<!-- ANCHOR:decision -->
## Decision

Adopt **Option A**: replace the hardcoded `contextSize: 512` with model-derived sizing AND add a token-count preflight inside `generateEmbedding`.

Concrete changes (already in the working tree as of session 2026-05-14):

1. **`shared/embeddings/providers/llama-cpp.ts:229–246`** — `loadRuntime()` now reads `model.trainContextSize ?? 2048`, passes `contextSize: 'auto'` with `minContextSize: 512` / `maxContextSize: trainContextSize` / `batchSize: Math.min(512, trainContextSize)` to `createEmbeddingContext`, and computes `tokenBudget = Math.floor(trainContextSize * 0.9)`.

2. **`shared/embeddings/providers/llama-cpp.ts:355–366`** — `generateEmbedding()` now performs a token-count preflight:
   ```typescript
   if (typeof runtime.model.tokenize !== 'function' || typeof runtime.model.detokenize !== 'function') {
     throw new Error('llama-cpp model tokenizer is unavailable; cannot enforce token budget');
   }
   const tokens = runtime.model.tokenize(inputText);
   if (tokens.length > runtime.tokenBudget) {
     console.warn(`[llama-cpp] Text ${tokens.length} tokens exceeds budget ${runtime.tokenBudget}, truncating`);
     const truncated = tokens.slice(0, runtime.tokenBudget);
     inputText = runtime.model.detokenize(truncated);
   }
   ```

3. **`shared/embeddings/providers/llama-cpp.ts:439–461`** — exposes a `__llamaCppTestables` object (with `setRuntimeOverride`, `setNodeLlamaCppModule`, `resetRuntimeForTesting`) to enable hermetic testing without loading the actual model.

4. **`shared/embeddings/providers/llama-cpp.ts` (top of file)** — `LlamaModel` interface declares `tokenize?: (text: string) => unknown[]` (direct method; was `tokenizer?: { tokenize(...) }` before the 037 hotfix described below).

5. **API hotfix during Phase 5 verification (037)**: the original parallel-session source used `runtime.model.tokenizer.tokenize(...)`. The 3.17.1 `LlamaModel` type declares `tokenizer` as a *callable* (not an object with a `.tokenize` method), so the call threw `TypeError: runtime.model.tokenizer.tokenize is not a function` against the real model (vitest T030-04 FAIL). Fix: use `runtime.model.tokenize(...)` directly, which is the documented 3.17.1 API on `LlamaModel` (`LlamaModel.d.ts:181`). Vitest now PASS 4/4 including the real-model smoke test.

6. **`mcp_server/tests/llama-cpp-token-budget.vitest.ts`** — pre-existing vitest covering 4 cases:
   - T030-01: token-budget truncation under synthetic input (PASS)
   - T030-02: 8000-char markdown fixture sent at ≤ budget (PASS)
   - T030-03: `auto` context bounded by `trainContextSize` in `createEmbeddingContext` args (PASS)
   - T030-04: real-model smoke test embedding the 027 checklist fixture (PASS post-hotfix)

---
<!-- /ANCHOR:decision -->

<!-- ANCHOR:consequences -->
## Consequences

### Positive

- The embedding worker no longer fails on inputs between 512 and 2048 tokens (the model's true capacity).
- Inputs over 2048 tokens (very rare in practice) are silently truncated with a `console.warn` observability hook, instead of hard-failing the save.
- The retry-manager's circuit breaker should no longer accumulate from this failure mode. 032/005's `embeddingRetry.flapping` flag should report false post-soak.
- `memory_save` of substantive content (the 4000-char fixture from packet 027) is verifiable via vitest T030-04 against the real GGUF model.
- All 5 of 032's blocked save-heavy scenarios (411–415) become unblocked once 036 runs the historical-failure cleanup.

### Negative

- The truncation preflight tokenizes every input twice (once for the budget check, again inside `getEmbeddingFor()`). Cost: ~1ms for typical content. Acceptable given the alternative is a thrown error.
- The truncation discards content beyond the budget without preserving semantic boundaries. A future enhancement could trim to the last full sentence within budget; for now the model handles partial-sentence input acceptably.
- The change relies on `model.trainContextSize` being correctly reported by the loaded GGUF. If a model loads with a missing or zero `trainContextSize`, the fallback is 2048 — a sensible default for the EmbeddingGemma family but may not fit all future models.

### Neutral

- `MAX_TEXT_LENGTH = 8000` in `chunking.ts` is now redundant for the embedding path (the token preflight enforces a tighter bound earlier). Leaving it in place — it still serves the search-pipeline-side chunking. 034's scope.
- The 214 historical failed rows in `memory_index` remain unprocessed until 036 runs `repair-failed-embeddings.mjs` against the healed worker.

---
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:evidence -->
## Evidence Chain

### Reproduction harness
- `.opencode/specs/_sandbox/37--llama-cpp-context-size/repro.mjs` — Node ESM script, direct provider call, 11-size sweep with tokenized counts.
- `.opencode/specs/_sandbox/37--llama-cpp-context-size/run-3.15.1.jsonl` — 11 raw rows.
- `.opencode/specs/_sandbox/37--llama-cpp-context-size/run-3.15.1.summary.tsv` — clean TSV with size/chars/tokens/result/vectorLen/elapsedMs/error columns.

### Version comparison
- `.opencode/specs/_sandbox/37--llama-cpp-context-size/version-comparison.md` — documents telescoping (Phase 1 IS the 3.17.1 evidence; separate sandbox install moot).

### Source patch + tests
- `git diff HEAD .opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` — 142-line diff, source-only.
- `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts` — 4 tests, all PASS post-hotfix.
- `.opencode/skills/system-spec-kit/mcp_server/tests/governance-ephemeral-decouple.vitest.ts` — regression check, 3 tests, all PASS.

### Build + boot
- `npm run build` from `mcp_server/` — exit 0; both `shared/dist/` and the runtime dist refresh.
- `node dist/context-server.js --health-check` — daemon boots, validates API key, validates DB integrity (3604/3604 entries), exit 0.

### Daemon round-trip
- Memory MCP tools (`memory_save`, `memory_search`, `memory_health`) disconnected mid-session after the daemon kill, preventing in-session live round-trip via tool calls.
- Vitest T030-04 covers the equivalent unit-level path (embedding a substantive fixture against the real GGUF model) and PASSes.
- Operator follow-up: at the start of the next session, run a 4000-char `memory_save` + `memory_search` round-trip to confirm the daemon's full path. (Deferred to 036's bootstrap.)

---
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:references -->
## References

- ADR-002 — Decouple `retentionPolicy: "ephemeral"` from governed-ingest enforcement (`../032-substrate-repair-followups/.../adr-002-decouple-retention-from-governance.md`).
- 022 ai-council post-execution follow-up — root-cause analysis that surfaced governance H4 and flagged the embedding worker as a separate issue.
- 032/005-stability-instrumentation — added `embeddingRetry.flapping` flag and `process.rss_mb` to `memory_health`.
- `node-llama-cpp@3.17.1` `LlamaModel.d.ts:181` — `tokenize(text: string, specialTokens?: boolean, options?: "trimLeadingSpace"): Token[]` API.
- Phase 1 evidence files in `_sandbox/37--llama-cpp-context-size/`.

---
<!-- /ANCHOR:references -->
