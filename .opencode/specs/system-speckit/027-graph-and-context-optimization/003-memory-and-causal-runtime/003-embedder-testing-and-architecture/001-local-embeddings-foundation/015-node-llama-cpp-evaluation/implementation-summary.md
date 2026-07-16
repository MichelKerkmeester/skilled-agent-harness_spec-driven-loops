---
title: "Implementation Summary: 015 node-llama-cpp Memory MCP embedding evaluation"
description: "Evaluation summary for the opt-in llama-cpp Memory MCP provider, including parity failure, benchmark numbers, and default no-flip decision."
trigger_phrases:
  - "015 llama cpp summary"
  - "llama cpp benchmark result"
  - "node llama cpp evaluation done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation"
    last_updated_at: "2026-05-13T09:56:14Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed llama-cpp provider evaluation; latency improved but parity failed"
    next_safe_action: "Keep hf-local default; only revisit with parity-preserving GGUF/tokenizer evidence"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "scratch/bench-results.json"
      - "scratch/parity-results.txt"
    session_dedup:
      fingerprint: "sha256:4150150150150150150150150150150150150150150150150150150150150150"
      session_id: "015-node-llama-cpp-evaluation-2026-05-13"
      parent_session_id: "015-node-llama-cpp-evaluation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should llama-cpp replace hf-local now? -> No; parity failed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `015-node-llama-cpp-evaluation` |
| **Completed** | 2026-05-13 |
| **Level** | 2 |
| **Status** | Complete |
| **Outcome** | **Rejected for default flip** |
| **Active Host** | darwin/arm64 |
| **Node** | v25.6.1 |
| **Provider Under Test** | `node-llama-cpp@3.17.1` with `unsloth/embeddinggemma-300m-GGUF` Q8_0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:outcome -->
## Outcome

The llama-cpp provider is viable as an opt-in experimental Memory MCP backend, but it should not replace `hf-local` by default. It is much faster for single-query latency on this host (`6.45 ms` p50 vs `39.54 ms` p50), and query RSS is lower (`1209 MB` vs `1798 MB`). The blocker is vector parity: default Q8_0 GGUF produced `mean_cosine=0.9677582325103543` and `min_cosine=0.9515004519950576` against `hf-local`, below the required `0.995` mean and `0.99` min thresholds.

BF16 and F32 GGUF probes improved parity to about `mean=0.99391`, `min=0.98679`, but still missed the gate. That makes a default flip unsafe without a follow-up parity investigation.
<!-- /ANCHOR:outcome -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An opt-in `LlamaCppProvider` exists under the shared embeddings provider directory. It implements the existing `IEmbeddingProvider` surface, lazy-loads `node-llama-cpp`, creates a GGUF embedding context, applies existing document/query prefixes, normalizes output, and reports a profile slug that separates llama-cpp sqlite indexes from `hf-local`.

Factory wiring recognizes `llama-cpp` only when explicitly selected. Default provider resolution remains unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Created | llama-cpp provider |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | Provider registration and lazy import |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-parity.vitest.ts` | Created | 50-sample parity gate |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-smoke.vitest.ts` | Created | Runtime smoke test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-factory.vitest.ts` | Created | Factory regression test |
| `.env.example` | Modified | Opt-in llama-cpp env docs |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Experimental provider docs |
| `scratch/bench-llama-cpp-vs-hf-local.ts` | Created | Benchmark harness |
| `scratch/bench-results.json` | Generated | Benchmark results |
| `scratch/model-info.json` | Generated | GGUF provenance and SHA-256 |
| Packet markdown/metadata | Created | Level 2 evidence packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was kept opt-in. `factory.ts` lazy-imports `providers/llama-cpp.js` only for `EMBEDDINGS_PROVIDER=llama-cpp`; unset/default resolution still falls back to `hf-local` when no cloud key is configured. The provider uses the existing prefix registry to avoid inventing a second task-prefix system.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep `hf-local` default | llama-cpp fails the hard cosine parity gate |
| Use dynamic import, not CJS require | `node-llama-cpp` is ESM/TLA under Node 25; dynamic import succeeds |
| Keep `node-llama-cpp` optional | Optional resolution works and `npm list` reports `3.17.1` |
| Use `unsloth/embeddinggemma-300m-GGUF` Q8_0 | Requested `bartowski` artifact was not publicly accessible from this host |
| Record no watts | `powermetrics` required sudo, so peak watts are null rather than guessed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Build | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | PASS |
| Dynamic import | `node --input-type=module -e "const m = await import('node-llama-cpp'); ..."` | PASS: `getLlama`, `LlamaEmbeddingContext` exposed |
| CJS probe | `node -e "const m = require('node-llama-cpp'); ..."` | FAIL: `ERR_REQUIRE_ASYNC_MODULE`; dependency present, CJS unsupported under Node 25 |
| Metal dylibs | `find node_modules/node-llama-cpp/node_modules/@node-llama-cpp/mac-arm64-metal ...` | PASS: dylibs and `llama-addon.node` present |
| Smoke/factory | `EMBEDDINGS_PROVIDER=llama-cpp npx vitest run tests/embeddings-llama-cpp-smoke.vitest.ts tests/embeddings-llama-cpp-factory.vitest.ts` | PASS: 2 files, 3 tests |
| Parity | `EMBEDDINGS_PROVIDER=llama-cpp npx vitest run tests/embeddings-llama-cpp-parity.vitest.ts` | FAIL: mean/min below gate |
| Benchmarks | `node --import ../scripts/node_modules/tsx/dist/loader.mjs scratch/bench...` | PASS: four result rows |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../015-node-llama-cpp-evaluation --strict` | PASS: exit 0 |

### Parity Result

| Metric | Value |
|--------|-------|
| Mean cosine | 0.9677582325103543 |
| Min cosine | 0.9515004519950576 |
| Samples | 50 |
| Reference backend | `HfLocalProvider("onnx-community/embeddinggemma-300m-ONNX", dtype=q8)` |
| Candidate backend | `LlamaCppProvider("unsloth/embeddinggemma-300m-GGUF", Q8_0)` |
| Verdict | FAIL |

### Precision Probe

| GGUF File | Mean cosine | Min cosine | Verdict |
|-----------|-------------|------------|---------|
| `embeddinggemma-300M-Q8_0.gguf` | 0.9677582325103543 | 0.9515004519950576 | FAIL |
| `embeddinggemma-300M-BF16.gguf` | 0.9939099101292325 | 0.986790638666197 | FAIL |
| `embeddinggemma-300M-F32.gguf` | 0.9939065951830771 | 0.9867910599196176 | FAIL |

### Benchmark - Load

| Provider | Model | Load seconds | RSS MB | Peak watts |
|----------|-------|--------------|--------|------------|
| `hf-local` | `onnx-community/embeddinggemma-300m-ONNX` | 0.893297 | 1770.781 | null |
| `llama-cpp` | `unsloth/embeddinggemma-300m-GGUF` | 0.842299 | 891.469 | null |

### Benchmark - Query (batch=1, 1000 iterations)

| Provider | p50 ms | p95 ms | p99 ms | Mean ms | RSS MB | Peak watts |
|----------|--------|--------|--------|---------|--------|------------|
| `hf-local` | 39.538333 | 43.285333 | 47.368708 | 39.823510 | 1798.313 | null |
| `llama-cpp` | 6.454292 | 8.397959 | 9.184667 | 6.488291 | 1209.125 | null |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Evidence | Status |
|-----|----------|--------|
| Default path unchanged | `resolveProvider()` still falls back to `hf-local` | PASS |
| Lazy native import | Factory lazy-imports llama-cpp provider only in the llama-cpp case | PASS |
| Vector shape | Smoke test returns 768d normalized vector | PASS |
| Index isolation | llama-cpp profile slug includes provider/model/dim/dtype | PASS |
| Parity safety | Hard gate fails and prevents default flip | PASS for evaluation discipline |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The default Q8_0 GGUF failed parity by a wide margin.
2. BF16/F32 GGUF files also failed parity, though more narrowly.
3. Metal initialized with warnings on this host: `ggml_metal_library_init_from_source: error compiling source` and tensor API disabled.
4. `powermetrics` peak watts are `null` because sudo was unavailable non-interactively.
5. The exact contract CJS `require()` probe fails under Node 25 ESM/TLA even though dynamic import works.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Contract Item | Deviation | Reason |
|---------------|-----------|--------|
| Requested `bartowski/embeddinggemma-300m-GGUF` Q4_K_M | Used `unsloth/embeddinggemma-300m-GGUF` Q8_0 | Requested model endpoint returned HTTP 401; public substitution recorded |
| Exact CJS load probe | CJS failed, dynamic import succeeded | `node-llama-cpp` uses ESM top-level await under Node 25 |
| Parity gate expected PASS | Gate failed and is reported as failed | Honesty over hype; no default flip |
| Peak watts | `null` | `powermetrics` requires sudo |
<!-- /ANCHOR:deviations -->
