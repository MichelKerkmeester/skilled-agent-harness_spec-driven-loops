---
title: "Implementation Plan: Phase 1 — Rust Backend Rewrite Research"
description: "Configure and run a single-lineage 20-round deep-research loop (GPT-5.5 xhigh fast via cli-codex) over the current system-spec-kit TypeScript backend, with 8 survey rounds and 12 deep-validation rounds mapped to 16 predefined angles, then synthesize a cited research.md with an improvement matrix, a new-feature-feasibility matrix, and a ranked rewrite recommendation."
trigger_phrases:
  - "rust rewrite research plan"
  - "rust deep research loop plan"
  - "030 research plan"
  - "20 round rust research allocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/005-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the 20-round allocation and executor config"
    next_safe_action: "Confirm cli-codex auth; run a 1-round smoke check; launch the loop"
    blockers: []
    key_files:
      - "research/deep-research-fanout-config.json"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-030-001-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Rust Backend Rewrite Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (`/deep:research:auto`) over `deep-loop-runtime` |
| **Executor** | `cli-codex` — GPT-5.5, `model_reasoning_effort=xhigh`, `service_tier=fast` |
| **Subject** | Current backend under `.opencode/skills/system-spec-kit/` (`mcp_server/`, `scripts/`, `shared/`) |
| **Storage** | `research/` JSONL state + `iterations/` + merged `research.md` |
| **Testing** | 1-round smoke check + cap/convergence verification + `validate.sh` |

### Overview
Run one deep-research lineage of up to 20 rounds with GPT-5.5 (xhigh, fast) over the current `system-spec-kit` TypeScript backend, evaluated against a hypothetical Rust reimplementation. The 20 rounds are pre-allocated to 16 predefined angles (see §3): **8 survey rounds** (A1–A8) establish ground truth — the native-vs-JS boundary, the compute core, the index, embeddings, the write path, the search pipeline, and the MCP/determinism layer — and **12 deep-validation rounds** (A9–A16, with the highest-value angles double-covered) test feasibility, quantify realistic wins, and probe genuinely-new / TS-hard capabilities. Synthesize a cited `research/research.md` with an improvement matrix, a new-feature-feasibility matrix, a risk register, and a ranked recommendation. Research-only: no Rust is written and no backend source is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `codex` installed and authenticated (ChatGPT OAuth confirmed; gpt-5.5 reachable)
- [ ] `deep-research-fanout-config.json` written with the cli-codex executor block (gpt-5.5/xhigh/fast, iterations 20)
- [ ] `deep-research-strategy.md` seeded with the charter (16 angles, round allocation, non-goals, stop conditions)
- [ ] 1-round smoke check passes (executor reachable, writes an iteration file)

### Definition of Done
- [ ] `research/deep-research-state.jsonl` shows a terminal `stopReason` (`converged` or `maxIterationsReached`)
- [ ] `research/research.md` merged with `[SOURCE: …]` citations into the current backend
- [ ] Improvement matrix + new-feature-feasibility matrix + risk register + ranked recommendation present
- [ ] Every "big win" names the specific JS-resident code it replaces; already-native paths are excluded from wins (REQ-004)
- [ ] `validate.sh` passes for this spec folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage sequential deep-research (`/deep:research`), one round per iteration, externalized state in `research/deep-research-state.jsonl`. The 20 rounds are pre-allocated to 16 predefined angles (below). The loop may converge early; if it runs to the cap it must have covered every angle at least once. Highest-value angles (A3 compute core, A4/A10 vector+ANN, A9 reranker, A16 synthesis) get a second pass in the deep-validation band.

### Key Components
| Component | Role |
|-----------|------|
| `research/deep-research-fanout-config.json` | Executor definition (cli-codex, gpt-5.5, xhigh, fast, 20 iterations, single lineage) |
| `research/deep-research-strategy.md` | Charter the loop reads each round: 16 angles, allocation, non-goals, stop conditions |
| `research/deep-research-state.jsonl` | Append-only per-round state (loop-generated) |
| `research/iterations/iteration-*.md` | Per-round findings (loop-generated) |
| `research/research.md` | Merged cited synthesis + the four deliverable artifacts (loop-generated) |

### Data Flow
`deep-research-strategy.md` (charter + angle for the round) → `cli-codex` (GPT-5.5 xhigh) reads the current backend under `.opencode/skills/system-spec-kit/` → appends findings to `iterations/iteration-N.md` + a delta to `deep-research-state.jsonl` → on convergence/cap, merge into `research.md` with the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation.

#### Round → angle allocation (survey band — Rounds 1–8, angles A1–A8)

| Round | Angle | Primary anchor files | Question the round must close |
|-------|-------|----------------------|-------------------------------|
| 1 | A1 Baseline hot-path inventory | `mcp_server/context-server.ts`, `handlers/memory-save.ts`, `handlers/memory-search.ts`, `lib/search/hybrid-search.ts`, `scripts/evals/run-performance-benchmarks.ts` | Where does wall-clock actually go; what is already measured |
| 2 | A2 Native-primitive boundary | `mcp_server/package.json`, `sqlite-vec`, `better-sqlite3`, `@huggingface/transformers`, `web-tree-sitter` | JS-resident vs FFI-resident compute per hot path |
| 3 | A3 Ranking/fusion compute core | `shared/algorithms/rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts`, `shared/ranking/learned-combiner.ts`, `matrix-math.ts` | Realistic SIMD/GC-free speedup + candidate-set sizes |
| 4 | A4 Vector index & quantization headroom | `lib/search/vector-index-schema.ts`, `vector-index-store.ts`, `vector-index-queries.ts`, `vector-index-impl.ts` | Brute-force `f32`? What quantization/ANN would change |
| 5 | A5 Local embeddings runtime | `shared/embeddings/providers/hf-local.ts`, `openai.ts`, `voyage.ts`, `ollama.ts`, `factory.ts` | candle/fastembed vs ONNX on local latency/memory |
| 6 | A6 Indexing / write path | `handlers/memory-save.ts`, `shared/chunking.ts`, `shared/trigger-extractor.ts`, `lib/ops/file-watcher.ts` | How much index-time is regex/scan-heavy TS |
| 7 | A7 Search pipeline & concurrency | `lib/search/pipeline/stage1-candidate-gen.ts`…`stage4-filter.ts`, `orchestrator.ts`, `query-decomposer.ts`, `query-router.ts` | What fan-out is serialized on the event loop |
| 8 | A8 MCP transport, schema & determinism | `context-server.ts`, `tool-schemas.ts`, `schemas/` (Zod), `description.json`/`graph-metadata.json` validation | What gains nothing; what invariants a port must preserve |

#### Round → angle allocation (deep-validation band — Rounds 9–20, angles A9–A16 + second passes)

| Round | Angle | Focus |
|-------|-------|-------|
| 9 | A9 Cross-encoder reranking (NEW) | Confirm absence (`lib/search/rerank/retrieval-rescue.ts`, `stage3-rerank.ts` heuristic); is a local `ort`/`candle` cross-encoder practical; does it need Rust or just a native reranker |
| 10 | A10 Quantized million-scale ANN (NEW) | `hnsw_rs`/`usearch`/FAISS + PQ/binary vs `sqlite-vec` brute force; recall/latency/memory/scale trade |
| 11 | A11 Real-time incremental indexing (NEW) | `rayon` parse→chunk→embed→upsert off the request path vs the current `file-watcher.ts` + batch write path |
| 12 | A12 Learned-sparse & late-interaction (NEW) | SPLADE / ColBERT vs current `bm25-index.ts` + `sqlite-fts.ts` + fusion; genuinely new or TS-approximable |
| 13 | A13 SIMD / GPU acceleration (TS-hard) | `portable-simd`/`wide` distance kernels; `candle`/`wgpu` inference; what is impractical from Node |
| 14 | A14 Memory footprint & tail-latency envelope | V8 heap + GC jitter vs deterministic RSS; anytime/streaming search under a hard SLA as a Rust-only feature |
| 15 | A15 Packaging & distribution | Single binary (`rusqlite`+`sqlite-vec`+native tree-sitter) vs `node_modules`/`dist`; eliminating stale-`dist` drift + prebuild fragility |
| 16 | A3 (second pass) compute core quantification | Turn round 3's estimate into a measurement plan grounded in `scripts/evals/run-performance-benchmarks.ts` |
| 17 | A4/A10 (second pass) index+ANN quantification | Corpus-scale model; where `sqlite-vec` stops scaling; migration shape for a native ANN behind `stage1-candidate-gen.ts` |
| 18 | A9 (second pass) reranker integration seam | Exact seam in `stage3-rerank.ts`; napi-rs interface shape; quality-uplift estimate |
| 19 | A16 (part 1) interop + correctness/parity | napi-rs vs WASM vs sidecar vs full port; byte-for-byte structured-JSON determinism; MCP Rust SDK maturity; test-coverage-gap risk |
| 20 | A16 (part 2) synthesis + recommendation | Improvement matrix, new-feature-feasibility matrix, risk register, ranked recommendation + first concrete step + strangler-fig path |

#### Loop mechanics
- **Convergence**: `newInfoRatio` below threshold for the configured window, OR 20 rounds, OR all 16 angles closed with the four deliverables written.
- **Evidence discipline**: every finding carries a `[SOURCE: file:line]` (backend) or `[SOURCE: url]` (external crate/technique) citation; estimates are labelled as estimates; the native-vs-JS split (REQ-004) is stated on every latency claim.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `cli-codex` (GPT-5.5) is installed and OAuth-authenticated.
- Write `research/deep-research-fanout-config.json` (done) and seed `research/deep-research-strategy.md` (done).
- Run a 1-round smoke check to confirm the executor writes an iteration file and a JSONL delta.

### Phase 2: Core Implementation
- Launch the single-lineage 20-round loop via `/deep:research:auto` in the background.
- Execute the round→angle allocation in §3: survey band (Rounds 1–8, A1–A8) then deep-validation band (Rounds 9–20, A9–A16 + second passes).
- Let the loop run to convergence or the 20-round cap, appending per-round findings and JSONL state.
- Merge into `research/research.md` with the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation.

### Phase 3: Verification
- Confirm a terminal `stopReason` in `research/deep-research-state.jsonl`.
- Confirm every angle A1–A16 appears in at least one round's findings.
- Enforce REQ-004: spot-check that no "big win" counts already-native work; each names JS-resident code.
- Run `validate.sh`; update `implementation-summary.md`; STOP for human review.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Smoke**: 1-round run confirms the executor is reachable and writes an iteration file before committing to the full 20.
- **Cap/convergence**: `deep-research-state.jsonl` ends with a terminal `stopReason`.
- **Coverage**: every angle A1–A16 appears in at least one round's findings.
- **Discipline check**: spot-check that no "big win" in `research.md` counts already-native (`sqlite-vec`/ONNX/tree-sitter) work; each names JS-resident code.
- **Structure**: `scripts/spec/validate.sh` passes for `005-rust-backend-rewrite-research/001-research`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Executor**: `cli-codex` (GPT-5.5, `xhigh`, `fast`) installed + OAuth-authenticated; the deep-research loop engine (`/deep:research`, `deep-loop-runtime`).
- **Research subject**: the current backend under `.opencode/skills/system-spec-kit/` (`mcp_server/`, `scripts/`, `shared/`), present in-repo.
- **Grounding harness**: `scripts/evals/run-performance-benchmarks.ts` for any latency claim.
- **No build/runtime dependency** on Rust toolchains in this phase — nothing is compiled or wired.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- This phase produces only research artifacts under `research/`. "Rollback" is deleting the generated loop outputs (`iterations/`, `deep-research-state.jsonl`, `research.md`); the charter (`spec.md`, `plan.md`, `strategy`) remains.
- No backend source is modified, so there is nothing to revert in the runtime, and no migration to undo.
- If the loop diverges or the executor is unavailable, stop the run, keep the charter, and re-launch later — the config is deterministic and re-runnable.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: `spec.md` (charter + 16 angles)
- **Parent**: `../spec.md`
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
