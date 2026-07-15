---
title: "Implementation Summary: 017 llama-cpp default flip"
description: "Final implementation summary with migration, probe, benchmark, smoke, rollback, and parent close-out evidence."
trigger_phrases:
  - "017 llama cpp implementation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/017-llama-cpp-default-flip"
    last_updated_at: "2026-05-13T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed packet with operator-accepted llama-cpp auto-cascade flip"
    next_safe_action: "Keep auto-cascade semantics documented: Voyage -> OpenAI -> llama-cpp when GGUF runtime is installed -> hf-local"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "scratch/probe-1k-results.json"
      - "scratch/bench-final-results.json"
      - "scratch/migration-run-results.json"
    session_dedup:
      fingerprint: "sha256:4170170170170170170170170170170170170170170170170170170170170170"
      session_id: "017-llama-cpp-default-flip-2026-05-13"
      parent_session_id: "017-llama-cpp-default-flip-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Final recommendation? -> Operator accepted llama-cpp auto-cascade flip with hf-local fallback"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
# Implementation Summary: 017 llama-cpp default flip

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Outcome** | ACCEPT_LLAMA_CPP_AUTO_CASCADE |
| **Migration** | 2488 rows, zero mismatches |
| **Probe Verdict** | MILD_DIVERGENCE |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The packet completed the migration and validation work. Operator accepted the flip; llama-cpp is auto-selected when the GGUF runtime is available, with hf-local retained as the health-checked fallback. Explicit override via `EMBEDDINGS_PROVIDER=hf-local` remains available. The live hf-local store migrated cleanly to a llama-cpp-profile sqlite, llama-cpp remained much faster in the final query benchmark, and the larger retrieval probe returned `MILD_DIVERGENCE`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

- Added `install-llama-cpp.sh` for idempotent optional dependency and GGUF bootstrap.
- Added `migrate-embeddings-to-llama-cpp.ts` for explicit, validated re-embedding.
- Updated llama-cpp profile slug to `llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8`.
- Added startup migration-pending warning for explicit llama-cpp when a source hf-local store exists and the target is empty.
- Updated environment docs, runtime config notes, and MCP README to reflect auto-cascade selection: Voyage -> OpenAI -> llama-cpp when the GGUF runtime is installed -> hf-local.
- Created packet evidence scripts and outputs for 1k probe, final benchmark, and JSON-RPC MCP smoke.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Accept llama-cpp auto-cascade flip | Operator accepted the flip despite the 1k probe returning MILD_DIVERGENCE due Spearman 0.816125 |
| Keep explicit provider override | Migration, benchmark, and MCP smoke all passed; `EMBEDDINGS_PROVIDER=<provider>` remains available |
| Preserve source sqlite | Required rollback path and user-controlled deletion |
| Keep migrated sqlite | Useful for manual explicit-provider testing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:migration -->
## 5. MIGRATION RESULT

| Metric | Value |
|--------|-------|
| Source sqlite | `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite` |
| Target sqlite | `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` |
| Source rows | 2488 |
| Target rows | 2488 |
| Migrated rows | 2488 |
| Skipped rows | 0 |
| Validation sample | 10 |
| Mismatches | 0 |
| Wall clock | 130.117 seconds |

The migration script initially exposed long-context and sqlite-vec rowid issues. The final clean run used semantic truncation at 700 characters and integer-safe rowid binding, then validated a random sample of 10 rows with zero mismatches.
<!-- /ANCHOR:migration -->

---

<!-- ANCHOR:probe -->
## 6. 1K RETRIEVAL PROBE

| Metric | Value | EQUIVALENT Target |
|--------|-------|-------------------|
| Corpus rows | 1000 | 1000 |
| Queries | 100 | 100 |
| Query strategy | `approach_A` | `approach_A` |
| Recall@5 overlap mean | 0.926 | >= 0.80 |
| Recall@5 overlap p25 | 0.8 | diagnostic |
| Spearman rho top-10 mean | 0.816125 | >= 0.85 |
| hf-local MRR top200 | 0.976 | baseline |
| llama-cpp MRR top200 | 0.975556 | compare |
| MRR relative delta | 0.000455 | < 0.05 |
| Verdict | MILD_DIVERGENCE | EQUIVALENT |

The decisive miss is Spearman rho. Recall and MRR remain strong, but the contract required an EQUIVALENT verdict at scale. Operator accepted the flip anyway: auto-cascade resolves Voyage -> OpenAI -> llama-cpp when the GGUF runtime is installed -> hf-local, with explicit override still available.
<!-- /ANCHOR:probe -->

---

<!-- ANCHOR:benchmark -->
## 7. FINAL BENCHMARK

| Provider | p50 ms | p95 ms | p99 ms | mean ms | RSS MB |
|----------|--------|--------|--------|---------|--------|
| hf-local | 35.956375 | 38.379833 | 41.209583 | 36.191475 | 1772.266 |
| llama-cpp | 6.027083 | 7.1365 | 7.773041 | 6.024455 | 1200.781 |

llama-cpp remains meaningfully faster and uses less RSS on this host. The operator accepted the flip with the `MILD_DIVERGENCE` evidence preserved.
<!-- /ANCHOR:benchmark -->

---

<!-- ANCHOR:smoke -->
## 8. END-TO-END SMOKE

| Field | Value |
|-------|-------|
| Path | JSON-RPC stdio call to `.opencode/bin/spec-kit-memory-launcher.cjs` |
| Provider | explicit `EMBEDDINGS_PROVIDER=llama-cpp` |
| Query | `node llama cpp evaluation parity default flip Memory MCP` |
| Latency | 3809.154ms |
| Result count | 1 |
| Result | PASS |

The smoke confirms that llama-cpp can query through the real Memory MCP launcher path against the migrated store. Under `EMBEDDINGS_PROVIDER=auto`, llama-cpp is selected when the GGUF runtime is available; hf-local remains the health-checked fallback.
<!-- /ANCHOR:smoke -->

---

<!-- ANCHOR:verification -->
## 9. VERIFICATION

| Check | Result |
|-------|--------|
| Shared build | exit 0 |
| MCP server build | exit 0 |
| Migration | exit 0 |
| 1k probe | completed; MILD_DIVERGENCE |
| Final benchmark | completed |
| MCP smoke | PASS |
| Packet strict validation | exit 0 |

The packet is complete as an operator-accepted flip: migration exists for llama-cpp auto-selection when the GGUF runtime is available, and hf-local remains the fallback or an explicit `EMBEDDINGS_PROVIDER=hf-local` override.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 10. KNOWN LIMITATIONS

- The llama-cpp backend is faster and accepted as the automatic local selection when the GGUF runtime is available.
- The migrated llama-cpp sqlite supports auto-cascade selection and explicit-provider testing.
- The MCP smoke returned a valid result through the launcher, but the quality gate remains the 1k probe.
<!-- /ANCHOR:limitations -->
