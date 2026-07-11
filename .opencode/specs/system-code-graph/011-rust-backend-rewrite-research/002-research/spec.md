---
title: "Feature Specification: Phase 2 - Query & Serving Rust Backend Rewrite Research"
description: "Run a pre-planned 16-round deep-research pass over the system-code-graph query and serving backend to determine whether Rust should replace or augment JS-resident traversal, ranking, resolution, context assembly, and transport logic without claiming gains from SQLite or other already-native work."
trigger_phrases:
  - "code graph query serving rust research"
  - "rust graph traversal rewrite"
  - "011 phase 002 research"
  - "code graph context rust feasibility"
  - "rust vs typescript query engine"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/011-rust-backend-rewrite-research/002-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the 12-angle, 16-round query-serving research charter"
    next_safe_action: "Review charter, smoke-test cli-codex, then launch the future loop"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-code-graph-011-002-query-serving-rust-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Which target is recommended: full rewrite, targeted napi-rs or WASM module, Rust sidecar, or do-not-rewrite?"
      - "Do measured JS traversal and ranking costs justify crossing a native boundary?"
      - "Which new query capabilities become practical only with a native compute core?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 - Query & Serving Rust Backend Rewrite Research

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
| **Parent Spec** | `../spec.md` (parent process-owned; not authored in this phase) |
| **Phase** | 2 of 2 |
| **Predecessor** | `../001-research/` - parsing, extraction, storage, bitemporal, and incremental-index research |
| **Successor** | A later PoC or boundary-spec phase, opened only if the findings recommend it |
| **Handoff Criteria** | `research/research.md` contains cited findings, both matrices, a risk register, and a ranked architecture recommendation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the **query-and-serving research gate** for packet 011. It defines a future single-lineage **16-round** deep-research pass using GPT-5.6-sol at `xhigh` reasoning and `fast` service tier through the `cli-codex` executor. The subject is the serving half of `.opencode/skills/system-code-graph/`: `code_graph_query`, `code_graph_context`, query-intent classification, symbol resolution, outline/caller/import/blast-radius traversal, ranking and deterministic ordering, readiness/trust envelopes, `detect_changes`, status/verify/apply transport handlers, the eight-tool MCP dispatcher, and the daemon-backed CLI parity layer [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:55-85].

The inspected core serving surface is approximately 8.1K LOC across the principal handlers, traversal/ranking libraries, schemas, server entrypoint, and CLI bridge. The largest files include `handlers/query.ts` (1,853 lines), `lib/code-graph-context.ts` (1,420), and `code-index-cli.ts` (1,253). This phase does **not** own source parsing, tree-sitter extraction, AST-to-node/edge construction, SQLite persistence/schema, bitemporal modeling, or incremental indexing; those belong to sibling phase 001.

**Framing invariant**: the package depends on `better-sqlite3`, `web-tree-sitter`, and `tree-sitter-wasms` [SOURCE: .opencode/skills/system-code-graph/package.json:14-20]. SQLite query execution and parser execution already run outside V8. Rust cannot speed up those native/FFI primitives merely by replacing their TypeScript callers. Every latency claim must label the measured work as **JS-resident** (eligible: BFS queues, Map/Set assembly, sorting, BM25 scoring, PageRank, formatting) or **FFI/native-resident** (ineligible: SQLite execution; parsing is also excluded from this phase). No "big win" may count already-native work.

**Scope Boundary**: Author and later execute the research pass only. **No Rust is written, no crate is scaffolded, no research loop runs during charter authoring, and no backend source is modified.**

**Dependencies**:
- Query and impact logic in `mcp_server/handlers/query.ts`, including deterministic subject selection and transitive traversal [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:348-384] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1736-1750].
- Context expansion, ranking, bounded PageRank, budgets, and formatting in `mcp_server/lib/code-graph-context.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:217-356] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:557-629].
- MCP schemas/dispatch/server and CLI parity surfaces [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-185] [SOURCE: .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:56-115] [SOURCE: .opencode/skills/system-code-graph/mcp_server/index.ts:74-89].
- Existing query/context/CLI tests as correctness and byte-stability evidence [SOURCE: .opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:134-162] [SOURCE: .opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts:25-63].

**Deliverables**:
- `research/research.md` - merged, cited synthesis across all future rounds.
- An **improvement matrix**: serving component x {latency / memory / tail latency / concurrency / determinism / packaging} -> {big win / marginal / none / already-native}, with the JS/FFI residency stated.
- A **new-feature-feasibility matrix**: candidate query capability x {possible in TS today? / practical in TS? / Rust unlocks?}, naming the enabling primitive.
- A **risk register** covering semantic parity, deterministic ordering, readiness/refusal safety, MCP/CLI parity, FFI overhead, migration cost, and test gaps.
- A **ranked recommendation**: full rewrite / targeted napi-rs or WASM native module / Rust sidecar / do-not-rewrite, with the first concrete validation step.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The serving backend mixes thin native-database calls with genuine JS compute. Exact symbol lookup and graph reads hand SQL to `better-sqlite3` [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:266-299], while blast-radius assembly builds Maps, deduplicates edges, runs BFS, constructs trace chains, sorts, and slices in V8 [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1181-1288]. Context serving additionally performs JS-resident RRF-style edge ranking, bounded personalized PageRank, provenance aggregation, deadline checks, and token-budget formatting [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:665-705] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1356-1419]. A blanket Rust rewrite could spend substantial effort porting schemas, refusal envelopes, JSON serialization, and MCP glue that are not the bottleneck, while a focused native kernel might accelerate only the JS-resident graph algorithms.

The evidence base is also incomplete: query latency instrumentation exists for context mode [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:230-356], but there is no dedicated serving benchmark harness in this package. Without separating SQLite time, JS compute, FFI crossings, serialization, and transport overhead, rewrite estimates would be speculative.

### Purpose
Produce a decision-ready, file-cited answer about what Rust would and would not improve in the query-and-serving half, which new graph-serving capabilities it could make practical, and which migration shape preserves the existing deterministic, readiness-gated MCP/CLI contract with the least risk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Map the query/serving call paths and classify each cost as JS-resident, FFI/native-resident, I/O wait, or serialization/transport.
- Assess BFS, blast radius, bounded PageRank, edge ranking, BM25 symbol resolution, context formatting, and deterministic ordering as targeted native-compute candidates.
- Evaluate MCP schemas, dispatcher, readiness/trust contracts, status/verify/apply handler boundaries, `detect_changes`, CLI parity, and byte-stability obligations.
- Quantify FFI-call frequency and determine whether batching SQL reads matters more than rewriting graph algorithms.
- Evaluate newly practical serving capabilities such as SCC/cycle analysis, dominators, k-shortest paths, centrality/community scoring, streaming/cancelable impact queries, and larger bounded neighborhoods.
- Produce the synthesis, matrices, risk register, and ranked recommendation.

### Out of Scope
- Source parsing, tree-sitter integration, AST extraction, node/edge construction, graph-store schema, SQLite persistence internals, bitemporal modeling, and incremental write/index paths (sibling phase 001).
- Writing or compiling Rust, scaffolding a crate, wiring napi-rs/WASM/sidecar code, or modifying backend source.
- Claiming live Rust-vs-TypeScript benchmark results without a later PoC.
- Crediting Rust for SQLite or parser work that already executes outside V8.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Query-and-serving research charter with 12 predefined angles |
| `plan.md` | Create | 16-round survey/deep-validation allocation and future execution plan |
| `tasks.md` | Create | Pending setup, smoke, loop, synthesis, and verification checklist |
| `research/deep-research-strategy.md` | Create | Round-readable charter, framing invariant, deliverables, and evidence rules |
| `research/deep-research-fanout-config.json` | Create | Single cli-codex GPT-5.6-sol xhigh/fast executor for 16 rounds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the future deep-research loop to convergence or the 16-round cap | `research/deep-research-state.jsonl` has per-round records and a terminal stop reason |
| REQ-002 | Produce a merged, cited synthesis | `research/research.md` answers every angle with `[SOURCE: relative/path.ts:line]` or external URL citations |
| REQ-003 | Enforce native-vs-JS residency on every performance claim | Every latency/memory/tail claim labels work as JS-resident, FFI/native-resident, I/O wait, or transport; no "big win" includes SQLite/parser work |
| REQ-004 | Produce an improvement matrix | Every in-scope component receives a verdict and evidence; each "big win" names the JS-resident loop, allocation, sort, score, or serialization path it replaces |
| REQ-005 | Preserve serving semantics in any recommendation | Recommendation covers deterministic ordering, limits/depth, ambiguity handling, partial/truncated outputs, readiness refusal, trust metadata, and MCP/CLI schema parity |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Produce a new-feature-feasibility matrix | Each candidate capability is tagged {possible-in-TS / impractical-in-TS / Rust-unlocks} with the enabling algorithm/runtime primitive |
| REQ-007 | Quantify FFI-boundary economics | Synthesis compares JS compute saved against napi-rs/WASM/sidecar crossing, copying, batching, and JSON costs; thin SQLite calls are not presented as rewrite wins |
| REQ-008 | Produce a risk register | Semantic parity, determinism, readiness safety, MCP/CLI parity, FFI overhead, migration cost, and test gaps have impact and mitigation entries |
| REQ-009 | Rank the architecture options | Full rewrite, targeted napi-rs/WASM module, Rust sidecar, and do-not-rewrite are ranked with a first concrete measurement or PoC step |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 12 predefined angles are answered or explicitly unresolved with reasons and next evidence needed.
- **SC-002**: Every performance conclusion distinguishes SQLite/native execution from JS-resident traversal, scoring, allocation, sorting, and formatting.
- **SC-003**: The recommendation identifies an exact boundary and names the current files/functions it would replace or retain.
- **SC-004**: A human can choose a PoC target or close the rewrite proposal without re-reading iteration artifacts.
- **SC-005**: No backend source, Rust artifact, metadata file, or loop-generated state is created during charter authoring.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | SQLite work is misattributed to V8 | Inflated rewrite benefit | Require residency labels and separate DB execution from JS assembly for every path |
| Risk | Existing 400 ms-style context budgets hide partial work | Incorrect tail-latency conclusions | Report completion/partiality with latency; inspect deadline and omitted-output metadata [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:217-356] |
| Risk | A native module loses deterministic tie-breaking | Byte-level or semantic regressions | Treat stable sort/tie keys and exact-output tests as migration gates [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:632-705] |
| Risk | FFI crossing/copying exceeds JS compute saved | Targeted module becomes slower | Measure candidate-set sizes, crossings, copies, and serialization before recommending native extraction |
| Risk | Full rewrite duplicates mature refusal/trust behavior | False-safe answers or client breakage | Preserve centralized readiness mappings and blocked contracts [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:68-118] |
| Risk | Gold battery proves discoverability, not query relevance/performance | False confidence in rewrite parity | Add workload-specific parity and benchmark requirements; current v1 uses outline presence checks [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:203-211] |
| Dependency | GPT-5.6-sol `cli-codex` executor availability | Future loop cannot run | Confirm auth and run a one-round smoke check before launch |
| Dependency | Current backend and tests remain readable | Evidence can drift during research | Record commit/tree state and cite line ranges each round |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These **predefined research angles** seed the future loop. Each must be answered or explicitly marked unresolved. They are grouped into **survey** angles (ground truth) and **deep-validation** angles (feasibility, quantification, and new capability).

### Survey angles (ground truth)

1. **A1 - Serving topology and workload baseline.** Map the eight-tool transport, query/context/status/verify/apply boundaries, daemon CLI, existing metrics, test workloads, and missing query benchmarks. Anchors: `mcp_server/index.ts`, `tool-schemas.ts`, `tools/code-graph-tools.ts`, `handlers/query.ts`, `handlers/context.ts`, `code-index-cli.ts`, and `tests/code-index-cli-parity.vitest.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/index.ts:74-89] [SOURCE: .opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts:25-63].
2. **A2 - Native/FFI boundary and SQL chattiness.** For outline, one-hop, transitive, blast-radius, context, status, and verify calls, separate `better-sqlite3` execution from V8 loops and count DB crossings. Determine whether batching/prepared queries matters more than a rewrite. Anchors: `package.json`, `handlers/query.ts`, `lib/code-graph-context.ts`, and read-only DB calls they invoke [SOURCE: .opencode/skills/system-code-graph/package.json:14-20] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1736-1750].
3. **A3 - Traversal and blast-radius compute.** Quantify JS-resident queue operations, Map/Set construction, path copying, confidence reduction, sorting, multi-seed union, and limit/depth behavior. Anchors: `lib/graph/bfs-traversal.ts` and `handlers/query.ts` blast-radius/transitive paths [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts:75-183] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1181-1355].
4. **A4 - Context expansion, ranking, PageRank, and budget assembly.** Measure RRF/reliability ranking, bounded PPR iterations, provenance-chain aggregation, per-anchor DB fan-out, deadline checks, and token-budget formatting. Anchors: `lib/code-graph-context.ts` and `handlers/context.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:557-705] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:913-1275] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/context.ts:169-356].
5. **A5 - Symbol, file, outline, and caller resolution.** Evaluate exact-id/fqName/name matching, operation-aware ambiguity ordering, fallback BM25 indexing/scoring, typed-array footprint, and whether rebuilding the fallback index per miss dominates. Anchors: `handlers/query.ts`, `lib/symbol-bm25-resolver.ts`, `lib/query-intent-classifier.ts`, and classifier handler [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:348-519] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:207-329] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/query-intent-classifier.ts:134-243].
6. **A6 - Readiness, structural checks, transport, and determinism contract.** Inventory blocked-vs-error behavior, trust-state mapping, schema validation, deterministic JSON/order requirements, `detect_changes` attribution, status aggregation, verify semantics, thin apply dispatch, MCP/IPC/CLI parity, and shutdown/lease behavior. Anchors: `lib/readiness-contract.ts`, `handlers/detect-changes.ts`, `handlers/status.ts`, `handlers/verify.ts`, `handlers/apply.ts`, `tool-schemas.ts`, `tools/code-graph-tools.ts`, `index.ts`, and `code-index-cli.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:68-118] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:230-384] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/verify.ts:192-255].

### Deep-validation angles (feasibility, quantification, new capability)

7. **A7 - Targeted native traversal kernel feasibility.** Test the boundary for moving BFS, multi-source blast radius, confidence propagation, deduplication, and stable sort into napi-rs or WASM while SQLite remains the native store. Determine graph/candidate sizes at which crossing and marshaling are amortized. Anchors: `lib/graph/bfs-traversal.ts`, `handlers/query.ts`, and query-handler regression tests [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts:98-183] [SOURCE: .opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:250-315].
8. **A8 - Targeted ranking/resolution kernel feasibility.** Compare native implementations of BM25, edge reliability/RRF, PageRank, and top-k stable selection against optimized TypeScript and SQLite-side alternatives. Require deterministic tie parity and include index-build/allocation costs. Anchors: `lib/symbol-bm25-resolver.ts` and `lib/code-graph-context.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:268-379] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:665-705].
9. **A9 - Advanced graph-analysis features.** Determine whether SCC/cycle condensation, dominators, k-shortest paths, path explanations, centrality, community detection, and weighted multi-hop ranking are absent, useful, and practical in TypeScript versus a Rust graph library. Identify exact integration seams in `code_graph_query` and `code_graph_context`; do not count storage/parser capabilities. Anchors: current operation/mode enums and traversal implementations [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-65] [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:75-109].
10. **A10 - Concurrency, cancellation, streaming, and tail latency.** Assess event-loop blocking from large JS traversals/ranking, worker-thread alternatives, Rust parallelism, cancelable deadlines, streaming partial results, backpressure, and whether MCP's current JSON response contract permits them. Anchors: context deadlines/partial output, stdio/IPC server, and CLI timeouts [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:217-356] [SOURCE: .opencode/skills/system-code-graph/mcp_server/index.ts:127-154].
11. **A11 - Interop and deployment architecture.** Compare full Rust service, napi-rs addon, WASM module, and Rust sidecar on copies, process isolation, crash containment, MCP SDK parity, warm daemon behavior, optional native packaging, and cross-platform distribution. Keep schemas/refusal envelopes in TypeScript unless evidence supports moving them. Anchors: `package.json`, `index.ts`, `code-index-cli.ts`, and runtime tool-surface reference [SOURCE: .opencode/skills/system-code-graph/package.json:14-26] [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:89-101].
12. **A12 - Correctness, migration, verification, and ranked recommendation.** Define parity fixtures for ordering, ambiguity, limits/depth, dangling edges, traces, partial output, trust/readiness, diff attribution, MCP/CLI schema parity, and gold verification. Size a strangler path and rank full rewrite / targeted module / sidecar / do-not-rewrite. Anchors: query/context tests, schema tests, CLI parity, and gold-query semantics [SOURCE: .opencode/skills/system-code-graph/mcp_server/tests/code-graph-tool-args-validation.vitest.ts:8-67] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:268-355].

### Non-Goals (charter)
- Writing, scaffolding, compiling, or integrating Rust.
- Modifying the TypeScript backend or running the research loop during charter authoring.
- Researching parsing, extraction, persistence, bitemporal, or incremental-index implementation except as external boundaries.
- Counting already-native SQLite or parser execution as a Rust rewrite gain.

### Stop Conditions (charter)
- `newInfoRatio` remains below the configured convergence threshold, OR
- 16 rounds are reached, OR
- all 12 angles are answered with cited evidence and the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation are complete.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent packet**: `../` (parent process owns parent metadata/docs)
- **Sibling boundary**: `../001-research/` (parsing, extraction, store, bitemporal, incremental writes)
- **Plan**: `plan.md`
- **Strategy**: `research/deep-research-strategy.md`
- **Research subject**: `../../../../../skills/system-code-graph/`
