---
title: "Feature Specification: Phase 2 — Rust Backend Rewrite Research: Embeddings, Vector & Serving"
description: "Run a pre-planned 16-round deep-research pass over the system-skill-advisor embedding, vector, skill-graph, and daemon/MCP/CLI serving backend to decide what Rust would improve after excluding work already native in ONNX, Ollama, and SQLite, and produce a cited rewrite recommendation."
trigger_phrases:
  - "skill advisor rust embeddings research"
  - "skill advisor vector rust rewrite"
  - "skill graph rust backend research"
  - "advisor daemon rust feasibility"
  - "013 phase 2 research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-rust-backend-rewrite-research/002-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the 14-angle, 16-round embeddings, vector, graph, and serving charter"
    next_safe_action: "Review charter; confirm cli-codex auth; run a 1-round smoke check; launch the loop"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-013-002-embeddings-vector-serving-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "How much advisor latency remains JS-resident after ONNX/Ollama and SQLite work are excluded?"
      - "Which target is justified: full rewrite, targeted napi-rs or WASM module, Rust sidecar, or do-not-rewrite?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Rust Backend Rewrite Research: Embeddings, Vector & Serving

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
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 (research gate) |
| **Predecessor** | `../001-research/` — scorer feature extraction, matcher, ranking math, and trigger/vocabulary matching |
| **Successor** | A later PoC / boundary-spec phase, opened only if the combined findings recommend it |
| **Handoff Criteria** | `research/research.md` produced with cited findings; improvement matrix + new-feature-feasibility matrix + risk register + ranked recommendation exist for human review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the **second research gate** for packet 013. It defines a pre-planned **16-round** deep-research pass (single lineage, GPT-5.6-sol at `xhigh` reasoning, `fast` service tier, via the `cli-codex` executor through `/deep:research`) over one bounded half of the current `system-skill-advisor` backend: embeddings, vector persistence and similarity, the SQLite skill graph, and daemon/MCP/CLI serving.

The observed boundary is deliberately uncomfortable for a rewrite thesis. Local HF inference is performed by `@huggingface/transformers` in a resident model server, Ollama and cloud providers execute remotely, and SQLite work runs through `better-sqlite3`; Rust cannot accelerate those engines merely by replacing their TypeScript callers [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13] [SOURCE: .opencode/bin/hf-model-server.cjs:664] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:473]. However, the current semantic path loads float BLOBs and computes cosine similarity in a JavaScript loop, graph traversal uses JS BFS around prepared SQLite queries, embedding refresh is row-serial, and the daemon/CLI layer contains substantial JS orchestration [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:47] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/bfs-traversal.ts:57] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1270] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:1106]. The research must measure whether that JS-resident remainder is material at the advisor's actual corpus size.

**Scope Boundary**: Author and later execute/synthesize the deep-research pass for this half only. **No research loop is run by this charter-authoring task, no Rust is written, no crate is scaffolded, and no backend source is modified.**

**Dependencies**:
- The current serving runtime: `mcp_server/advisor-server.ts`, `handlers/advisor-recommend.ts`, `handlers/advisor-status.ts`, `handlers/advisor-rebuild.ts`, `mcp_server/skill-advisor-cli.ts`, `.opencode/bin/skill-advisor.cjs`, and `.opencode/bin/mk-skill-advisor-launcher.cjs` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:233] [SOURCE: .opencode/bin/skill-advisor.cjs:49].
- The vector and graph store: `lib/skill-graph/skill-graph-db.ts`, `skill-graph-queries.ts`, `bfs-traversal.ts`, and `handlers/skill-graph/` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:188] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts:88].
- The shared embedding implementation reached through `@spec-kit/shared`: `system-spec-kit/shared/embeddings/` and the resident HF model server [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:4] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:487].
- Native/runtime dependencies from `mcp_server/package.json`: `@huggingface/transformers`, `better-sqlite3`, `@modelcontextprotocol/sdk`, `chokidar`, and `zod`; notably, this package does **not** declare `sqlite-vec` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13].
- Existing latency and watcher benchmarks for measurement-plan grounding [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/latency-bench.ts:17] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/watcher-benchmark.ts:74].

**Deliverables**:
- `research/research.md` — merged, cited synthesis across all rounds.
- An **improvement matrix**: current component × {latency / memory / tail-latency / concurrency / startup / packaging} → {big win / marginal / none / already-native-or-remote} with evidence.
- A **new-feature-feasibility matrix**: candidate feature × {possible in TS today? / practical in TS? / Rust unlocks?} with the enabling primitive named.
- A **risk register** covering embedding parity, vector recall, graph correctness, SQLite concurrency, daemon lifecycle, MCP/CLI compatibility, migration cost, and test gaps.
- A **ranked recommendation**: full rewrite / targeted native module (napi-rs or WASM) / Rust sidecar / do-not-rewrite — with the first concrete step.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The assigned backend half mixes native engines with JavaScript orchestration. `better-sqlite3` moves SQL execution into SQLite, HF inference runs through a resident `@huggingface/transformers` model server, and Ollama/cloud adapters cross process or network boundaries. Rewriting TypeScript around these calls does not make SQLite scans, ONNX kernels, or remote inference faster. At the same time, advisor-owned TypeScript still decodes embedding BLOBs, performs exact cosine loops, serially refreshes embeddings, walks graph neighborhoods in JS, scans source trees, maintains watcher state, frames JSON-RPC, and coordinates leases and warm sockets [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:679] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:285] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:536] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:1158].

The central uncertainty is not whether Rust can execute loops quickly. It is whether those JS-resident loops and serving controls account for enough end-to-end latency, memory, tail behavior, or operational failure to repay a rewrite at the current skill count. The package does not use `sqlite-vec`; vectors are ordinary BLOB rows in dimension-specific tables and cosine is exact JS computation, so there may be a narrow native-index opportunity, but the corpus may be too small for it to matter [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:266]. A recommendation that credits already-native inference or SQLite work would be invalid.

### Purpose
Produce a decision-ready, cited answer for the embedding, vector, graph, and serving half: quantify the JS-resident remainder, identify any practical new capability Rust would unlock, and rank full rewrite, targeted napi-rs/WASM, sidecar, and do-not-rewrite options without borrowing benefits from native/FFI work already present.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Map embedder selection, local/remote provider execution, vector persistence, exact semantic similarity, skill-graph indexing/query/validation, watcher/lease lifecycle, MCP stdio, IPC bridge, and CLI front door with file-cited evidence.
- Classify every measured operation as **JS-resident**, **FFI/native-resident**, **out-of-process native**, or **remote-service-resident** before assigning rewrite value.
- Quantify realistic value at current and projected corpus sizes, using the existing benchmark surfaces where possible and defining missing benchmark slices where necessary.
- Evaluate full rewrite, targeted napi-rs/WASM vector or graph kernels, a Rust sidecar, and do-not-rewrite.
- Produce the four decision artifacts in the future `research/research.md`.

### Out of Scope
- Scorer feature extraction, matcher/ranking math, lexical/trigger/vocabulary matching, threshold tuning, and fusion policy; those belong to sibling phase 001.
- Writing or compiling Rust, scaffolding a crate, wiring a native module, or changing backend source.
- Running the deep-research loop during this charter-authoring task.
- Live A/B benchmarking against a Rust implementation; a later PoC phase owns that work if recommended.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Research charter, requirements, 14 predefined angles, non-goals, and stop conditions |
| `plan.md` | Create | 16-round survey/deep-validation allocation and verification plan |
| `tasks.md` | Create | Future loop execution checklist; all tasks remain pending |
| `research/deep-research-strategy.md` | Create | Per-round charter read by the future loop |
| `research/deep-research-fanout-config.json` | Create | Single-lineage GPT-5.6-sol/xhigh/fast executor config for 16 rounds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the future deep-research loop to convergence or the 16-round cap with the GPT-5.6-sol cli-codex executor | `research/deep-research-state.jsonl` shows completed rounds with a terminal `stopReason` (`converged` or `maxIterationsReached`) |
| REQ-002 | Produce a merged, cited synthesis | `research/research.md` exists with cross-round findings and `[SOURCE: file:line]` / `[SOURCE: url]` citations |
| REQ-003 | Enforce execution-residency attribution | Every latency, memory, and throughput claim labels the measured work JS-resident, FFI/native-resident, out-of-process native, or remote-service-resident |
| REQ-004 | Exclude already-native or remote work from rewrite wins | No “big win” credits ONNX/transformers inference, Ollama/cloud inference, or SQLite execution merely because their TS callers are rewritten; each big win names the specific JS-resident code replaced |
| REQ-005 | Keep the sibling boundary intact | No angle evaluates scorer feature extraction, matcher/ranking math, trigger/vocabulary matching, or lexical scoring except to identify a serving integration boundary |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Improvement matrix produced | Each assigned component is mapped across latency, memory, tail-latency, concurrency, startup, and packaging with an explicit verdict and evidence |
| REQ-007 | New-feature-feasibility matrix produced | Each candidate capability is tagged {possible-in-TS / impractical-in-TS / Rust-unlocks} with the enabling primitive and corpus-scale assumptions named |
| REQ-008 | Risk register produced | Embedding parity, vector recall, graph correctness, SQLite concurrency, daemon lifecycle, MCP/CLI parity, migration cost, and test gaps each have impact and mitigation |
| REQ-009 | Ranked recommendation produced | Full rewrite, targeted napi-rs/WASM module, Rust sidecar, and do-not-rewrite are ranked with reasoning, rejected benefits, and the first concrete next step |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` consolidates all rounds with citations into the real advisor and shared embedding implementation.
- **SC-002**: Every predefined angle (§7) is answered or explicitly marked unresolved with the reason.
- **SC-003**: Every performance conclusion separates JS orchestration from native/FFI, out-of-process native, and remote work.
- **SC-004**: The recommendation is decision-ready: a human can choose a concrete boundary or close the rewrite proposal without re-reading all iterations.
- **SC-005**: No recommendation claims `sqlite-vec` is present in this backend; any native vector-index proposal is described as a new dependency and justified against actual corpus scale.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Native engines are credited as Rust wins | Inflated rewrite case | REQ-003/REQ-004 force residency attribution on every claim |
| Risk | Small advisor corpus makes optimized vector/graph kernels irrelevant | Benchmarkable micro-win with no product value | Report current node/vector counts and model scale breakpoints before recommending native indexing |
| Risk | Existing benchmark gate omits embedding, cosine, IPC, and graph-query slices | End-to-end claims remain ungrounded | Define a measurement plan using `latency-bench.ts`, watcher benchmark, semantic health, and new read-only probes [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/latency-bench.ts:17] |
| Risk | Shared embedding ownership is mistaken for advisor-local code | Wrong migration boundary | Trace re-export shims to `@spec-kit/shared` and include shared consumer compatibility [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:4] |
| Risk | Rust port changes ordering, rounding, or fail-open behavior | Routing output and operational regressions | Capture deterministic ordering, six-decimal rounding, trust/freshness, and JSON envelope invariants [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:301] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369] |
| Risk | Daemon rewrite underestimates lease/socket race handling | Duplicate writers, stale sockets, truncated output | Inventory lifecycle, warm-only exit taxonomy, caller trust, shutdown order, and single-writer tests before recommending transport changes |
| Dependency | `cli-codex` GPT-5.6-sol availability | Future loop cannot run | Confirm auth and perform a 1-round smoke check |
| Dependency | Current TypeScript source and shared embedding implementation | No research subject | Present in-repo; treat as read-only evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These **14 predefined research angles** seed the future loop. Each must be answered or explicitly marked unresolved. Angles are grouped into **survey** (ground truth) and **deep-validation** (feasibility, quantification, and new capability). The round allocation is in `plan.md` §3 and `research/deep-research-strategy.md`.

### Survey angles (ground truth)

1. **A1 — End-to-end serving and latency inventory.** Trace `advisor_recommend` from the MCP/CLI boundary through freshness checks, cache, prompt embedding, and response framing; identify what the existing cache-hit/uncached p95 benchmark includes and excludes. Anchors: `mcp_server/advisor-server.ts`, `handlers/advisor-recommend.ts` (~507 LOC), `mcp_server/bench/latency-bench.ts`, `mcp_server/skill-advisor-cli.ts` (~1.4K LOC) [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/latency-bench.ts:17].
2. **A2 — Native/FFI/out-of-process boundary audit.** Build an operation-level residency map from `package.json`, the shared provider cascade, the HF model server, and SQLite store. Confirm that `@huggingface/transformers` inference and SQLite are already native-backed, Ollama/cloud calls are external, and `sqlite-vec` is absent; quantify only JS-resident work as rewrite headroom [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13] [SOURCE: .opencode/bin/hf-model-server.cjs:664] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:487].
3. **A3 — Embedder selection, provider parity, and model residency.** Audit the persisted active pointer, local-first cascade, adapter registry, task prefixes, dimensions, dtype, health, and fallback semantics. Anchors: `lib/embedders/schema.ts`, `lib/embedders/registry.ts`, `system-spec-kit/shared/embeddings/auto-select.ts`, `registry.ts`, `providers/hf-local.ts`, and `.opencode/bin/hf-model-server.cjs` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:243] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/registry.ts:22].
4. **A4 — Vector persistence and refresh path.** Map `vec_metadata`, dimension-specific `vec_<dim>` BLOB tables, legacy-column fallback, content-hash skips, per-row adapter calls, and read-only loading. Determine which costs are SQLite-native versus JS file reads, BLOB copies, serialization, and serial orchestration. Anchor: `lib/skill-graph/skill-graph-db.ts` (~1.56K LOC) and `lib/embedders/schema.ts` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1174] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1385].
5. **A5 — Semantic vector serving and exact cosine cost.** Measure prompt-embedding latency separately from JS-resident vector loading/decoding and the exact cosine loop over projected skills; identify corpus sizes where a native kernel or index can beat JS without double-counting model inference [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:47] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:266].
6. **A6 — Skill-graph store, indexing, queries, and validation.** Inventory hash-aware metadata scans, SQLite transactions/WAL, prepared relationship queries, JS BFS, status hashing, and in-memory validation loops. Anchors: `skill-graph-db.ts`, `skill-graph-queries.ts`, `bfs-traversal.ts`, and `handlers/skill-graph/{query,status,validate,scan}.ts` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:952] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts:311] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts:42].
7. **A7 — Daemon, MCP, IPC, CLI, and determinism contract.** Map startup scan, embedder resolution, watcher lease, stdio MCP, warm socket bridge, warm-only behavior, trusted mutation metadata, stale-dist fence, exit codes, shutdown ordering, and deterministic output requirements. Anchors: `advisor-server.ts`, `lib/daemon/{lifecycle,watcher}.ts`, `lib/ipc/socket-server.ts`, `skill-advisor-cli.ts`, `.opencode/bin/{skill-advisor,mk-skill-advisor-launcher}.cjs`, and the three advisor handlers [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:280] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:1232] [SOURCE: .opencode/bin/skill-advisor.cjs:49].

### Deep-validation angles (feasibility, quantification, new capability)

8. **A8 — Residency-attributed benchmark and cost model.** Design or locate measurements for cold start/model load, warm IPC, cache hit/miss, prompt embedding, SQLite read, BLOB decode, cosine, graph query/BFS, refresh, watcher idle, and rebuild. Produce an end-to-end percentage budget and confidence bounds; this angle is double-covered because it decides whether any rewrite case survives [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/watcher-benchmark.ts:74] [SOURCE: .opencode/bin/hf-model-server.cjs:803].
9. **A9 — Native vector index / quantization feasibility (candidate new capability).** Evaluate sqlite-vec, usearch/HNSW, SIMD exact scan, int8/binary quantization, or a small napi-rs/WASM distance kernel against the current BLOB+JS-cosine path. State the node-count break-even and recall/memory trade; do not claim a win at today’s corpus without evidence [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:97] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:285].
10. **A10 — Embedding runtime replacement versus wrapper rewrite.** Compare current Ollama, resident transformers/ONNX, and cloud execution with `ort`, `candle`, or `fastembed-rs`. Determine whether Rust changes inference kernels, only process supervision, or neither; include batching, model-load time, dtype/device support, and output parity [SOURCE: .opencode/bin/hf-model-server.cjs:723] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:306].
11. **A11 — Rebuild and incremental embedding pipeline.** Test whether parallel/batched description reads and embedding refresh, transaction batching, or off-request processing would materially reduce `skill_graph_scan`/`advisor_rebuild` wall time. Separate native model throughput from JS serial scheduling and preserve single-writer semantics [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:28] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1270].
12. **A12 — Graph-scale and validation headroom.** Model query, BFS, full status hashing, and validation behavior at current scale and projected hundreds/thousands of skills. Compare SQL recursive CTEs, Rust graph memory structures, and existing prepared-query+JS-BFS behavior; identify whether a new capability exists or only a theoretical micro-optimization [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/bfs-traversal.ts:57] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts:164].
13. **A13 — Serving reliability, startup, and packaging architecture.** Evaluate whether Rust can simplify the current Node dist freshness, launcher/owner lease, warm-socket, watcher, HF-model-server supervision, and multi-transport stack without regressing MCP SDK maturity, JSON-RPC parity, security, or restart recovery. Compare full binary, napi-rs/WASM, and sidecar boundaries [SOURCE: .opencode/bin/mk-skill-advisor-launcher.cjs:762] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:169] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lifecycle.ts:72].
14. **A14 — Interop boundary, deterministic parity, migration risk, and ranked recommendation.** Synthesize full rewrite vs targeted napi-rs/WASM vector module vs Rust sidecar vs do-not-rewrite. Preserve six-decimal scores, stable ordering, prompt privacy, fail-open empty recommendations, read-only recommend access, trusted mutations, freshness/trust state, CLI aliases/formats/exit codes, and graph schema behavior; propose a strangler path only if A8 proves material JS-resident cost [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:341] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:530] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts:22].

### Non-Goals (charter)
- Writing Rust, scaffolding a crate, compiling a native module, or modifying backend source.
- Re-researching scorer feature extraction, ranking/fusion math, matcher behavior, or trigger/vocabulary matching from sibling phase 001.
- Treating SQLite, ONNX/transformers, Ollama, or cloud-provider execution as Rust rewrite wins without replacing those engines and measuring the replacement.
- Live A/B benchmarking against a Rust implementation in this phase.

### Stop Conditions (charter)
- `newInfoRatio` sustained below the convergence threshold, OR
- 16 rounds reached, OR
- All 14 angles answered with cited evidence and the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation written.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Sibling research half**: `../001-research/` (scorer/matcher/ranking/trigger boundary)
- **Research subject**: `../../../../skills/system-skill-advisor/` plus the shared embedding implementation under `../../../../skills/system-spec-kit/shared/embeddings/`
- **Plan**: `plan.md` (16-round allocation + executor config)
- **Loop charter**: `research/deep-research-strategy.md`
