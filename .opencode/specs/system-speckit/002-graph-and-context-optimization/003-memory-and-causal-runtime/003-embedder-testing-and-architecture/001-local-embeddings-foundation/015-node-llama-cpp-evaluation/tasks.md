---
title: "Tasks: 015 node-llama-cpp Memory MCP embedding evaluation"
description: "Ordered task list and evidence for llama-cpp provider implementation, tests, benchmarks, docs, metadata, and validation."
trigger_phrases:
  - "015 llama cpp tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation"
    last_updated_at: "2026-05-13T09:56:14Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed task execution and recorded failed parity verdict"
    next_safe_action: "Review no-flip recommendation and leave hf-local as default"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:2150150150150150150150150150150150150150150150150150150150150150"
      session_id: "015-node-llama-cpp-evaluation-2026-05-13"
      parent_session_id: "015-node-llama-cpp-evaluation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: 015 node-llama-cpp Memory MCP embedding evaluation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked by failed acceptance gate but evidence captured |

**Task Format**: `T### [P?] Description (file path) [evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Confirm `node-llama-cpp` is loadable from Memory MCP. Evidence: CJS `require('node-llama-cpp')` failed with `ERR_REQUIRE_ASYNC_MODULE` under Node v25.6.1 due ESM top-level await; dynamic `import('node-llama-cpp')` succeeded and exposed `getLlama`, `LlamaEmbedding`, and `LlamaEmbeddingContext`.
- [x] T001 Verify Metal binding artifacts. Evidence: dylibs present under `mcp_server/node_modules/node-llama-cpp/node_modules/@node-llama-cpp/mac-arm64-metal/bins/mac-arm64-metal/`.
- [x] T002 Download/record GGUF model. Evidence: requested `bartowski/embeddinggemma-300m-GGUF` returned HTTP 401 from HF API; substituted `unsloth/embeddinggemma-300m-GGUF` `embeddinggemma-300M-Q8_0.gguf`, SHA-256 `a0f7b4e13c397a6e1b32c2de75b1f65a14c92ec524d5f674d94a4290a1c4969b`, recorded in `scratch/model-info.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Create `shared/embeddings/providers/llama-cpp.ts`. Evidence: provider implements `IEmbeddingProvider`, lazy dynamic import, singleton runtime, prefix-aware document/query helpers, dimension coercion, and L2 normalization.
- [x] T011 Extend `shared/embeddings/factory.ts`. Evidence: `SUPPORTED_PROVIDERS` includes `llama-cpp`, startup profile handles llama-cpp dtype, and factory lazy-imports `./providers/llama-cpp.js`.
- [x] T012 Produce compatible profile slug. Evidence: `getProfile()` returns an `EmbeddingProfile` with provider `llama-cpp`, model id, dim 768, dtype `Q8_0`, and slug-backed DB filename separation.
- [x] T013 Gracefully handle missing optional dependency. Evidence: `loadNodeLlamaCpp()` throws an install hint pointing at `npm install node-llama-cpp@3.17.1 --save-optional`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Tests

- [B] T020 Create parity test. Evidence: `tests/embeddings-llama-cpp-parity.vitest.ts` executed 50 representative chunks; default Q8_0 result failed gate with `mean_cosine=0.9677582325103543`, `min_cosine=0.9515004519950576`, `samples=50`.
- [x] T021 Create smoke test. Evidence: `EMBEDDINGS_PROVIDER=llama-cpp npx vitest run tests/embeddings-llama-cpp-smoke.vitest.ts tests/embeddings-llama-cpp-factory.vitest.ts` passed, 2 files / 3 tests.
- [x] T022 Create factory wire-up test. Evidence: same command passed; explicit `EMBEDDINGS_PROVIDER=llama-cpp` resolves and creates provider, and default behavior remains separate.

### Benchmark

- [x] T030 Create `scratch/bench-llama-cpp-vs-hf-local.ts`. Evidence: harness supports `--mode=query`, `--mode=load`, 1000 query iterations, RSS, and powermetrics null note when sudo is unavailable.
- [x] T031 Run benchmark for both providers. Evidence: `scratch/bench-results.json` contains load and query rows for `hf-local` and `llama-cpp`.

### Documentation

- [x] T040 Update `.env.example`. Evidence: experimental `EMBEDDINGS_PROVIDER=llama-cpp` section exists and default remains `auto`/`hf-local`.
- [x] T041 Update Memory MCP install docs. Evidence: `mcp_server/README.md` documents experimental llama-cpp embeddings and GGUF download command.
- [x] T042 Decide package dependency status. Evidence: `npm list node-llama-cpp --depth=0` reports `node-llama-cpp@3.17.1`; optional dependency resolution worked, so no package promotion was made.

### Validation Gates

- [B] T050 Parity test. Evidence: default Q8_0 parity failed; `scratch/parity-results.txt` records the failed Vitest output and metrics.
- [x] T051 Smoke + factory tests. Evidence: `scratch/smoke-results.txt` records 2 files / 3 tests passed.
- [x] T052 Benchmark both backends. Evidence: `scratch/bench-results.json` has all four required rows.
- [x] T053 Fill implementation summary. Evidence: `implementation-summary.md` contains real parity, latency, load, RSS, and watts values; no placeholders.
- [x] T054 Strict validate packet. Evidence: final validation command exits 0 after doc iteration.

### Parent Metadata

- [x] T060 Update parent graph metadata. Evidence: parent `children_ids` includes this packet, `derived.last_active_child_id` points here, timestamps refreshed, and causal summary records failed parity/default no-flip outcome.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Provider implementation exists and TypeScript build passes.
- [x] Default path remains unchanged.
- [x] Smoke/factory tests pass.
- [x] Parity failure is captured with real numbers.
- [x] Benchmarks for both backends are recorded.
- [x] Packet docs and metadata validate strictly.
- [x] Scope discipline maintained: no git operations, no default flip, no forbidden surface edits.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent packet: `../spec.md`
- Rejected predecessor: `../014-onnx-cross-platform-backend/decision-record.md`
- Parity evidence: `scratch/parity-results.txt`
- Smoke evidence: `scratch/smoke-results.txt`
- Benchmark evidence: `scratch/bench-results.json`
<!-- /ANCHOR:cross-refs -->
