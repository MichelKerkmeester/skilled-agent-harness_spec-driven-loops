---
title: "Feature Specification: Phase 1 — Rust Backend Rewrite Research"
description: "Run a pre-planned 20-round deep-research pass over the current system-spec-kit TypeScript backend to decide what a Rust rewrite would improve, what new features it would unlock, and what is genuinely hard or impossible in TypeScript — with file-cited evidence, an improvement matrix, a new-feature-feasibility matrix, a risk register, and a ranked recommendation."
trigger_phrases:
  - "rust backend rewrite research"
  - "rust vs typescript speckit research"
  - "030 research rust"
  - "rust rewrite deep research angles"
  - "speckit rust feasibility"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/030-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the research charter with 16 predefined angles and a 20-round allocation"
    next_safe_action: "Human review of the charter; confirm executor auth; run a 1-round smoke check then launch the loop"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-030-001-research"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which target is recommended: full rewrite, targeted napi-rs/WASM compute module, Rust sidecar, or do-not-rewrite?"
      - "Is a local neural cross-encoder reranker worth adding, and does it require Rust?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Rust Backend Rewrite Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Not Started |
| **Created** | 2026-07-11 |
| **Branch** | `claude/speckit-rust-rewrite-o1vnq9` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 (research gate) |
| **Predecessor** | None |
| **Successor** | A `002-*` PoC / boundary-spec phase, opened only if findings recommend it |
| **Handoff Criteria** | `research/research.md` produced with cited findings; improvement matrix + new-feature-feasibility matrix + risk register + ranked recommendation exist for human review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the **research gate** for packet 030. It runs a pre-planned **20-round** deep-research pass (single lineage, GPT-5.5 at `xhigh` reasoning, `fast` service tier, via the `cli-codex` executor through `/deep:research`) over one body of evidence: the **current `system-spec-kit` backend** under `.opencode/skills/system-spec-kit/` (`mcp_server/`, `scripts/`, `shared/`), evaluated against a hypothetical Rust reimplementation.

The question is concrete and three-part: *(1) what would a Rust rewrite actually improve, and where — with references to specific current code; (2) what new features become possible that we do not have today; and (3) what is genuinely hard or impossible in TypeScript that Rust unlocks?* The pass must separate **already-native** work (which Rust cannot meaningfully speed up) from **JS-resident compute** (where it can), and must end with a ranked, decision-ready recommendation.

**Scope Boundary**: Run and synthesize the deep-research pass only. **No Rust is written, no crate is scaffolded, and no backend source is modified.**

**Dependencies**:
- The current backend under `.opencode/skills/system-spec-kit/`: the MCP runtime (`mcp_server/context-server.ts`, `mcp_server/handlers/`, `mcp_server/lib/search/`), the neutral compute modules (`shared/algorithms/`, `shared/ranking/`, `shared/embeddings/`, `shared/chunking.ts`, `shared/trigger-extractor.ts`), and the CLI/eval tooling (`scripts/`).
- The current native dependency set (from `mcp_server/package.json`): `better-sqlite3`, `sqlite-vec` (+ `sqlite-vec-darwin-arm64`), `@huggingface/transformers`, `web-tree-sitter`, `tree-sitter-wasms`, `@modelcontextprotocol/sdk`, `zod`.
- The existing benchmark harness (`scripts/evals/run-performance-benchmarks.ts`) for grounding any latency claim.
- The deep-research loop engine (`/deep:research`, `deep-loop-runtime`) and the `cli-codex` executor.

**Deliverables**:
- `research/research.md` — merged, cited synthesis across all rounds.
- An **improvement matrix**: current TS component × {improvement axis: latency / memory / tail-latency / concurrency / packaging} → {big win / marginal / none / already-native} with file-cited evidence.
- A **new-feature-feasibility matrix**: candidate feature × {possible in TS today? / practical in TS? / Rust unlocks?} with the enabling primitive named.
- A **risk register** (correctness/determinism, ecosystem/MCP parity, migration cost, team velocity, test-coverage gap).
- A **ranked recommendation**: full rewrite / targeted native module (napi-rs or WASM) / Rust sidecar / do-not-rewrite — with the first concrete step.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Rust rewrite is attractive on paper (SIMD, no GC, single-binary distribution, fearless concurrency) but the honest picture is nuanced: the backend's hottest primitives are already outside V8. Vector search runs in `sqlite-vec` (C) on `better-sqlite3` (N-API → SQLite C); local embeddings run in `@huggingface/transformers` (ONNX, C++/Rust); parsing runs in `web-tree-sitter` (WASM). Rewriting the *callers* of native code does not speed up the *work*. Meanwhile the retrieval stack (`mcp_server/lib/search/`, ~90 modules) is already state-of-the-art, so "new features" rarely means a *technique* impossible in TS — it means a technique gated by the *performance/memory envelope*. Deciding blindly risks a multi-quarter rewrite that re-derives bugs the TS suite already fixed, against a comparatively thin test corpus, for glue-code speedups that never materialize.

### Purpose
Produce a decision-ready, cited answer to *what a Rust rewrite would and would not buy us* — split cleanly into improvements (with references), newly-feasible features, and genuinely-TS-hard capabilities — so a later phase can either scope a specific target deliberately or close 030 as "researched, not rewritten."
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read and map the current backend surfaces (runtime, search pipeline, compute core, embeddings, indexing, MCP transport, scripts/evals) with file-cited evidence.
- For each predefined angle (§7), assess Rust's improvement, the new features it unlocks, and what is TS-hard/impossible — always distinguishing already-native from JS-resident work.
- Quantify where realistic wins are (grounding latency claims in `scripts/evals/run-performance-benchmarks.ts` where possible).
- Produce `research/research.md`, the improvement matrix, the new-feature-feasibility matrix, the risk register, and a ranked recommendation.

### Out of Scope
- Writing Rust, scaffolding a crate, or wiring napi-rs/WASM/sidecar (owned by a later `002-*` phase if approved).
- Editing the current TypeScript backend.
- Running live A/B benchmarks against a real Rust build (estimates + existing-harness grounding only in this phase; a live PoC benchmark is a later phase).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/deep-research-fanout-config.json` | Create | cli-codex executor config (gpt-5.5, xhigh, fast; 20 rounds) |
| `research/deep-research-strategy.md` | Create | Charter: key questions, 16 angles, non-goals, stop conditions |
| `research/deep-research-state.jsonl` | Create | Append-only round state log (loop-generated) |
| `research/iterations/iteration-*.md` | Create | Per-round findings (loop-generated) |
| `research/research.md` | Create | Merged, cited synthesis (loop-generated) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the deep-research loop to convergence or the 20-round cap with the GPT-5.5 cli-codex executor | `research/deep-research-state.jsonl` shows rounds with a terminal `stopReason` (`converged` or `maxIterationsReached`) |
| REQ-002 | Merged synthesis produced | `research/research.md` exists with cross-round findings and `[SOURCE: file:line]` / `[SOURCE: url]` citations |
| REQ-003 | Improvement matrix produced | Each current TS component is mapped against each improvement axis with an explicit verdict + evidence, and every "big win" cites the specific JS-resident code it targets |
| REQ-004 | Already-native vs JS-resident split is explicit | The synthesis states, per hot path, whether the work already runs in native code (`sqlite-vec` / ONNX / tree-sitter) or in V8 — no latency claim ignores this split |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | New-feature-feasibility matrix produced | Each candidate feature is tagged {possible-in-TS / impractical-in-TS / Rust-unlocks} with the enabling primitive named |
| REQ-006 | Risk register produced | Correctness/determinism, MCP/ecosystem parity, migration cost, team velocity, and test-coverage-gap risks each have an entry with impact + mitigation |
| REQ-007 | Ranked recommendation | A primary recommended target (full rewrite / targeted native module / sidecar / do-not-rewrite) with reasoning and the next concrete step |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` consolidates all rounds with citations into the current backend under `.opencode/skills/system-spec-kit/`.
- **SC-002**: Every predefined angle (§7) is answered or explicitly marked unresolved with the reason.
- **SC-003**: The recommendation is decision-ready — a human can pick "scope target X" or "do not rewrite" from it without re-reading the loop.
- **SC-004**: No "big win" survives in the synthesis without naming the specific JS-resident code it replaces; already-native paths are never counted as rewrite wins.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 20 rounds × GPT-5.5 xhigh codex subprocesses | Multi-hour, real API/quota cost | Attended start; background run; convergence can stop early |
| Risk | codex authed via ChatGPT OAuth, no API key | Loop fails if OAuth lacks gpt-5.5 | Confirm auth before launch; 1-round smoke check |
| Risk | "Rust is faster" priors count already-native work as a win | Inflated, wrong recommendation | REQ-004 forces the native-vs-JS split on every hot path |
| Risk | Latency claims without measurement | Decision on vibes | Ground claims in `scripts/evals/run-performance-benchmarks.ts`; mark estimates as estimates |
| Risk | New-feature claims that are actually already implemented | Wasted "new feature" credit | Cross-check every candidate against `mcp_server/lib/search/` inventory before tagging it new |
| Dependency | `cli-codex` (GPT-5.5) availability | Loop cannot run | Verified installed + OAuth-logged-in before launch |
| Dependency | Current backend source under `.opencode/skills/system-spec-kit/` | No subject to research | Present (authored TS in-repo) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These **predefined research angles** seed the loop's strategy. Each must be answered or explicitly marked unresolved, and each names the current code it is anchored to. They are grouped into **survey** angles (establish ground truth) and **deep-validation** angles (feasibility, quantification, new capability). The round→angle allocation is in `plan.md` §3 and `research/deep-research-strategy.md`.

### Survey angles (ground truth)

1. **A1 — Baseline hot-path inventory.** Where is CPU/wall-clock actually spent in the running backend? Anchor: `mcp_server/context-server.ts` (long-lived `StdioServerTransport`), the heaviest handlers `mcp_server/handlers/memory-save.ts` (~4.2K LOC), `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/memory-context.ts`, and `mcp_server/lib/search/hybrid-search.ts` (~3.5K LOC). What does `scripts/evals/run-performance-benchmarks.ts` already measure?
2. **A2 — Native-primitive boundary audit.** What already runs *outside* V8, and therefore cannot be sped up by a rewrite? Anchor: `mcp_server/package.json` deps `sqlite-vec`, `better-sqlite3`, `@huggingface/transformers`, `web-tree-sitter`, `tree-sitter-wasms`. Quantify JS-resident compute vs FFI-resident compute per hot path.
3. **A3 — Ranking/fusion compute core.** The strongest pure-compute rewrite candidate. Anchor: `shared/algorithms/rrf-fusion.ts` (~842 LOC), `shared/algorithms/adaptive-fusion.ts` (~468), `shared/algorithms/mmr-reranker.ts` (~157), `shared/ranking/learned-combiner.ts` (~559), `shared/ranking/matrix-math.ts` (~151). What is the realistic SIMD/GC-free speedup, and how large are the candidate sets it runs over?
4. **A4 — Vector index internals & quantization headroom.** Anchor: `mcp_server/lib/search/vector-index-*.ts` family (`vector-index-schema.ts` ~4K LOC, `vector-index-store.ts`, `vector-index-queries.ts`, `vector-index-impl.ts`) over `sqlite-vec`. Is it brute-force `f32`? What would int8/binary quantization + a native ANN (HNSW/IVF-PQ) change?
5. **A5 — Local embeddings runtime.** Anchor: `shared/embeddings/providers/hf-local.ts` (transformers.js/ONNX, `dtype` handling) vs `openai.ts`/`voyage.ts`/`ollama.ts`. Would `candle`/`fastembed-rs` beat the ONNX path on local latency/memory, or is ONNX already the fast path?
6. **A6 — Indexing / write path.** Anchor: `mcp_server/handlers/memory-save.ts` (~4.2K LOC), `shared/chunking.ts` (~143), `shared/trigger-extractor.ts` (~703), `mcp_server/lib/ops/file-watcher.ts` (chokidar). How much index-time wall-clock is regex/scan-heavy TS that Rust would cut?
7. **A7 — Search pipeline & concurrency.** Anchor: `mcp_server/lib/search/pipeline/` (`stage1-candidate-gen.ts` ~1.9K LOC, `stage2-fusion.ts`, `stage2b-enrichment.ts`, `stage3-rerank.ts`, `stage4-filter.ts`, `orchestrator.ts`), plus `query-decomposer.ts` / `query-router.ts`. What fan-out is serialized on the single event loop that `tokio`/`rayon` would parallelize?
8. **A8 — MCP transport, schema layer & determinism invariants.** Anchor: `mcp_server/context-server.ts`, `mcp_server/tool-schemas.ts`, `mcp_server/schemas/` (Zod), and the strict validation over structured JSON (`description.json`, `graph-metadata.json`). What in this layer gains nothing from Rust, and what invariants a port must preserve byte-for-byte?

### Deep-validation angles (feasibility, quantification, new capability)

9. **A9 — Neural cross-encoder reranking (candidate NEW feature).** Confirmed absent today: `mcp_server/lib/search/rerank/` holds only `retrieval-rescue.ts` and `stage3-rerank.ts` is heuristic/MMR. Is a local cross-encoder (via `ort`/`candle`) over top-k practical at interactive latency, and does it require Rust or just a native reranker?
10. **A10 — Quantized million-scale ANN (candidate NEW capability).** Beyond `sqlite-vec` brute force: `hnsw_rs` / `usearch` / FAISS bindings + product/binary quantization. What corpus scale becomes feasible locally, and what is the recall/latency/memory trade vs the current `vector-index-*` path?
11. **A11 — Real-time incremental indexing (candidate NEW capability).** Anchor: `mcp_server/lib/ops/file-watcher.ts`. Can a `rayon` parse→chunk→embed→upsert pipeline keep a large repo's index always-fresh off the request path, where the TS write path (A6) currently batches/blocks?
12. **A12 — Learned-sparse (SPLADE) & late-interaction (ColBERT) retrieval (candidate NEW feature classes).** These need fast sparse matmul / token-level multi-vector scoring. Cross-check against the current fusion stack (`shared/algorithms/`, `mcp_server/lib/search/bm25-index.ts`, `sqlite-fts.ts`) — genuinely new, or approximable in TS?
13. **A13 — SIMD / GPU acceleration (candidate TS-hard/impossible).** `portable-simd`/`wide` for distance kernels; `candle`/`wgpu` for on-device model inference. What is realistically impossible or impractical to reach from Node here?
14. **A14 — Memory footprint & tail-latency envelope.** For a long-lived server (A1): V8 heap + GC jitter vs Rust deterministic RSS and GC-free tails. Can a hard per-query latency SLA (anytime/streaming search) become an offerable feature only in Rust?
15. **A15 — Packaging & distribution.** Single self-contained binary (`rusqlite` + `sqlite-vec` + native `tree-sitter`) vs the current `node_modules` + build-`dist` model. Does this eliminate the recurring stale-`dist` drift class (the SessionStart "STALE DIST" warnings) and native-prebuild fragility (`sqlite-vec-darwin-arm64` optional dep)?
16. **A16 — Interop architecture, correctness/determinism preservation, ecosystem parity & migration path.** napi-rs module vs WASM vs sidecar vs full port; preserving deterministic structured-JSON output and append-only continuity byte-for-byte; MCP Rust SDK maturity vs `@modelcontextprotocol/sdk`; the ~244K-LOC / thin-test-corpus migration risk and a strangler-fig path. Synthesizes into the ranked recommendation.

### Non-Goals (charter)
- Writing Rust, scaffolding a crate, or wiring any native module anywhere in the live stack.
- Editing the current TypeScript backend.
- Live A/B benchmarking against a real Rust build (deferred to a later PoC phase).

### Stop Conditions (charter)
- `newInfoRatio` sustained below the convergence threshold, OR
- 20 rounds reached, OR
- All 16 angles answered with cited evidence, plus the improvement matrix, new-feature-feasibility matrix, risk register, and a ranked recommendation written.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research subject**: `../../../../skills/system-spec-kit/` (`mcp_server/`, `scripts/`, `shared/`)
- **Plan**: `plan.md` (20-round allocation + executor config)
- **Loop artifacts**: `research/research.md`, `research/deep-research-strategy.md`, `research/deep-research-state.jsonl`
