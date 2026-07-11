---
title: "Implementation Plan: Phase 2 — Rust Backend Rewrite Research: Embeddings, Vector & Serving"
description: "Configure a single-lineage 16-round deep-research loop over system-skill-advisor embeddings, vector similarity, skill graph, and daemon/MCP/CLI serving, with 7 survey rounds and 9 deep-validation rounds mapped to 14 predefined angles."
trigger_phrases:
  - "skill advisor rust serving research plan"
  - "embedding vector rust loop plan"
  - "013 phase 2 research plan"
  - "16 round advisor rust allocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-rust-backend-rewrite-research/002-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the 16-round embeddings, vector, graph, and serving allocation"
    next_safe_action: "Confirm cli-codex auth; run a 1-round smoke check; launch the future research loop"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-research-fanout-config.json"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-013-002-embeddings-vector-serving-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Which missing benchmark slices are required to isolate JS-resident serving cost?"
      - "Does current corpus scale justify any native vector or graph boundary?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 — Rust Backend Rewrite Research: Embeddings, Vector & Serving

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (`/deep:research:auto`) over the current TypeScript/Node advisor backend and shared embedding stack |
| **Executor** | `cli-codex` — GPT-5.6-sol, `reasoningEffort=xhigh`, `serviceTier=fast` |
| **Subject** | `.opencode/skills/system-skill-advisor/mcp_server/` embeddings/vector/skill-graph/daemon/handlers plus `.opencode/bin/skill-advisor.cjs`, launcher, and shared embeddings |
| **Native Boundary** | `better-sqlite3`/SQLite and `@huggingface/transformers` inference are native-backed; Ollama/cloud are external; vector BLOB decode + exact cosine + BFS/orchestration are JS-resident [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13] |
| **Storage** | Future `research/` JSONL state + `iterations/` + merged `research.md` |
| **Testing** | 1-round smoke check + cap/convergence/angle coverage + residency-discipline audit + `validate.sh` |

### Overview
Run one future deep-research lineage of up to 16 rounds with GPT-5.6-sol (`xhigh`, `fast`). The rounds are pre-allocated to 14 angles: **7 survey rounds** establish the real serving path, execution-residency boundary, embedder stack, vector store/similarity, skill graph, and daemon/transport contract; **9 deep-validation rounds** test quantified headroom and candidate boundaries, with A8 cost attribution and A14 synthesis double-covered. The final synthesis must not credit SQLite, ONNX/transformers, Ollama, or cloud execution as Rust wins unless the research proposes replacing those engines and measures the replacement. This phase is research-only: no Rust and no backend edits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `codex` installed and authenticated; GPT-5.6-sol reachable
- [ ] `research/deep-research-fanout-config.json` present with GPT-5.6-sol/xhigh/fast, 16 iterations, and concurrency 1
- [ ] `research/deep-research-strategy.md` contains all 14 angles, the round allocation, non-goals, stop conditions, and residency framing invariant
- [ ] Sibling boundary confirmed: no scorer feature-extraction/matcher/ranking/trigger-vocabulary research
- [ ] 1-round smoke check passes (executor reachable and writes an iteration file + JSONL delta)

### Definition of Done
- [ ] `research/deep-research-state.jsonl` shows a terminal `stopReason` (`converged` or `maxIterationsReached`)
- [ ] `research/research.md` is merged with `[SOURCE: …]` citations into real backend files
- [ ] Improvement matrix + new-feature-feasibility matrix + risk register + ranked recommendation present
- [ ] Every performance claim labels execution residency; every “big win” names JS-resident code and excludes already-native/remote work
- [ ] All 14 angles are answered or explicitly unresolved
- [ ] `validate.sh` passes for this phase child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage sequential deep research through `/deep:research`, one focus per round, with append-only state in `research/deep-research-state.jsonl`. Rounds 1–7 survey the implementation. Rounds 8–14 validate feasibility and new capability. Round 15 revisits the decisive cost model with evidence gathered from all technical angles; Round 16 synthesizes architecture, risks, and the ranked recommendation. The loop may converge early only when all deliverables and angle coverage gates are satisfied.

### Key Components
| Component | Role |
|-----------|------|
| `research/deep-research-fanout-config.json` | Executor definition: cli-codex, GPT-5.6-sol, xhigh, fast, 16 iterations, one lineage |
| `research/deep-research-strategy.md` | Charter read each round: 14 angles, residency invariant, allocation, non-goals, stop conditions |
| `research/deep-research-state.jsonl` | Append-only per-round state (future loop-generated) |
| `research/iterations/iteration-*.md` | Per-round findings (future loop-generated) |
| `research/research.md` | Merged cited synthesis and four decision artifacts (future loop-generated) |

### Data Flow
`deep-research-strategy.md` → one allocated angle → GPT-5.6-sol reads the current advisor/shared embedding sources → writes `iterations/iteration-NNN.md` + JSONL delta → reducer updates loop state → convergence/cap triggers `research.md` synthesis with residency-attributed matrices and recommendation.

#### Round → angle allocation (survey band — Rounds 1–7, angles A1–A7)

| Round | Angle | Primary anchor files | Question the round must close |
|-------|-------|----------------------|-------------------------------|
| 1 | A1 End-to-end serving and latency inventory | `advisor-server.ts`, `handlers/advisor-recommend.ts`, `bench/latency-bench.ts`, `skill-advisor-cli.ts` | What is on the recommend critical path; what existing p95 gates include/exclude [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369] |
| 2 | A2 Native/FFI/out-of-process boundary | `mcp_server/package.json`, shared `auto-select.ts`, `hf-model-server.cjs`, `skill-graph-db.ts` | Residency class and rewrite headroom for every assigned operation [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13] |
| 3 | A3 Embedder selection/provider/model residency | `lib/embedders/schema.ts`, shared `registry.ts`, `auto-select.ts`, `providers/hf-local.ts`, `hf-model-server.cjs` | Provider parity, model load/inference location, dimensions/dtype/prefix/fallback invariants |
| 4 | A4 Vector persistence and refresh | `skill-graph-db.ts`, `lib/embedders/schema.ts`, `handlers/skill-graph/scan.ts` | SQLite-native vs JS file/BLOB/serial orchestration cost; migration compatibility |
| 5 | A5 Semantic vector serving | `lib/scorer/lanes/semantic-shadow.ts`, `skill-graph-db.ts` embedding loader | Prompt inference vs BLOB decode vs JS cosine cost at actual corpus sizes [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:47] |
| 6 | A6 Skill-graph store/index/query/validation | `skill-graph-db.ts`, `skill-graph-queries.ts`, `bfs-traversal.ts`, `handlers/skill-graph/` | SQL-native work vs JS scans/BFS/validation; current and projected scale |
| 7 | A7 Daemon/MCP/IPC/CLI/determinism | `advisor-server.ts`, `lib/daemon/`, `lib/ipc/socket-server.ts`, `skill-advisor-cli.ts`, `.opencode/bin/*.cjs`, advisor handlers | What transport/lifecycle behavior gains nothing, what reliability may improve, and what parity is mandatory |

#### Round → angle allocation (deep-validation band — Rounds 8–16, angles A8–A14 + second passes)

| Round | Angle | Focus |
|-------|-------|-------|
| 8 | A8 Residency-attributed benchmark/cost model | Define end-to-end slices and initial percentage budget; identify missing measurements without counting native engines as JS cost |
| 9 | A9 Native vector index/quantization | Break-even for sqlite-vec/usearch/HNSW/SIMD/int8/WASM/napi-rs versus current BLOB + JS exact cosine; recall and memory trade |
| 10 | A10 Embedding runtime replacement vs wrapper rewrite | Ollama/transformers/cloud vs ort/candle/fastembed-rs; kernels, batching, load time, model parity, and supervision |
| 11 | A11 Rebuild/incremental embedding pipeline | Serial refresh, batching, parallel reads, transaction boundaries, off-request processing, and single-writer safety |
| 12 | A12 Graph-scale and validation headroom | Prepared SQL + JS BFS/full scans versus recursive SQL/Rust graph structures at current and projected sizes |
| 13 | A13 Serving reliability/startup/packaging | Full binary vs napi-rs/WASM vs sidecar; dist freshness, leases, warm socket, watcher, model-server supervision, MCP parity |
| 14 | A14 Interop/determinism/migration | Exact compatibility contract and initial architecture ranking |
| 15 | A8 second pass — quantified decision model | Reconcile evidence from rounds 9–14 into measured/estimated end-to-end deltas, confidence, break-even, and rejected native-work credits |
| 16 | A14 second pass — synthesis/recommendation | Improvement matrix, new-feature-feasibility matrix, risk register, ranked recommendation, first step, and stop/no-go criteria |

#### Loop mechanics
- **Convergence**: `newInfoRatio` below threshold for the configured window, OR 16 rounds, OR all 14 angles closed with all four deliverables written.
- **Evidence discipline**: every finding uses `[SOURCE: file:line]` or `[SOURCE: url]`; estimates are labelled; every performance claim states execution residency.
- **Boundary discipline**: scorer feature extraction, matcher/ranking math, and trigger/vocabulary matching remain owned by sibling phase 001.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `cli-codex` can reach GPT-5.6-sol with `xhigh` reasoning and `fast` service tier.
- Retain the authored fanout config and strategy charter.
- Run a 1-round smoke check to confirm an iteration file and valid JSONL delta are produced.

### Phase 2: Core Implementation
- Launch the future single-lineage 16-round loop via `/deep:research:auto`.
- Execute Rounds 1–7 survey, then Rounds 8–16 deep validation and second passes.
- Require each round to classify relevant work by execution residency and stay inside the assigned backend half.
- Let the loop converge or hit the cap; synthesize `research/research.md` with all four decision artifacts.

### Phase 3: Verification
- Confirm terminal `stopReason` and complete angle coverage.
- Audit all “big win” cells for a named JS-resident target and reject any benefit borrowed from SQLite, ONNX/transformers, Ollama, or cloud execution.
- Confirm the recommendation compares all four target classes and gives a first concrete step.
- Run `validate.sh`; update completion artifacts only in the future loop/completion workflow; stop for human review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Smoke**: 1-round executor run produces a non-empty iteration file and valid JSONL delta before the full loop.
- **Cap/convergence**: state ends with a valid terminal `stopReason`.
- **Coverage**: all A1–A14 appear in findings or are explicitly unresolved.
- **Residency audit**: sample every matrix row and all “big win” claims; each distinguishes JS, FFI/native, out-of-process native, and remote execution.
- **Scale sanity**: vector and graph recommendations report current corpus assumptions and a measured or modelled break-even.
- **Boundary audit**: no scorer/matcher/ranking/trigger-vocabulary investigation beyond integration seams.
- **Structure**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-skill-advisor/013-rust-backend-rewrite-research/002-research --strict`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Executor**: `cli-codex`, GPT-5.6-sol, `xhigh`, `fast`, authenticated and reachable.
- **Research subject**: current advisor source plus shared embedding source, read-only.
- **Measurement surfaces**: advisor latency benchmark, watcher benchmark, semantic lane health, skill-graph status, and HF model-server timing [SOURCE: .opencode/bin/hf-model-server.cjs:803].
- **Sibling result**: phase 001 defines the separate scorer/matcher half; combined rewrite recommendations may be reconciled only after both research passes complete.
- **No Rust toolchain dependency**: this phase writes and later executes research only.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- This authoring task creates only the five charter files in this phase child. Rollback is removal of those five files by the parent process or user; no runtime state or backend source changes exist.
- A future loop can be stopped without backend rollback. Its generated `iterations/`, state JSONL, dashboard/registry, and `research.md` can be archived or removed while retaining the charter.
- If the executor is unavailable or a round crosses into sibling scope, stop the loop, preserve append-only evidence, correct the future dispatch through the command-owned workflow, and resume from the charter.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: `spec.md` (14 angles)
- **Parent**: `../spec.md`
- **Sibling**: `../001-research/`
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
