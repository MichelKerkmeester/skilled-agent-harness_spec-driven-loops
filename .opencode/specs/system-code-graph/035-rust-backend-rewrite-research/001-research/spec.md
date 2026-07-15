---
title: "Feature Specification: Phase 1 — Rust Ingestion & Storage Backend Rewrite Research"
description: "Run a pre-planned 16-round deep-research pass over the ingestion and storage half of the system-code-graph TypeScript backend to determine what Rust would improve, what new capabilities it could enable, and where the existing WASM and SQLite native boundaries leave little or no rewrite headroom."
trigger_phrases:
  - "code graph rust ingestion research"
  - "rust code graph storage rewrite"
  - "011 ingestion storage research"
  - "code graph parser rust feasibility"
  - "code graph sqlite rust rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/035-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the 12-angle, 16-round ingestion and storage research charter"
    next_safe_action: "Review charter, smoke-test cli-codex, then launch /deep:research"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-code-graph-011-001-ingestion-storage-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Which target is recommended for ingestion and storage: full rewrite, targeted napi-rs or WASM module, Rust sidecar, or do-not-rewrite?"
      - "Which measured costs are JS-resident rather than tree-sitter WASM or SQLite native execution?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Rust Ingestion & Storage Backend Rewrite Research

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
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | Phase 2 (`002-research/`), which owns query, traversal, impact/context retrieval, ranking, and MCP query transport research |
| **Handoff Criteria** | `research/research.md` produced with cited findings; improvement matrix + new-feature-feasibility matrix + risk register + ranked recommendation exist for human review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the **ingestion and storage research gate** for packet 011. It defines a future pre-planned **16-round** deep-research pass (single lineage, GPT-5.6-sol at `xhigh` reasoning, `fast` service tier, via the `cli-codex` executor through `/deep:research`) over one bounded body of evidence: source discovery, parser initialization and AST walking, AST-to-node/edge extraction, cross-file edge construction, SQLite graph persistence, edge lifecycle and bitemporal generations, incremental invalidation, and the `code_graph_scan` / `detect_changes` write-index boundary.

The current parser is not pure TypeScript: `web-tree-sitter` executes parser machinery through WASM grammars, while `better-sqlite3` executes SQLite through a native addon [SOURCE: .opencode/skills/system-code-graph/package.json:14]. However, filesystem traversal, AST walking, capture normalization, node/edge construction, module resolution, incremental dependency expansion, transaction orchestration, and diff attribution are JavaScript-resident [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:968] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1427] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2231]. The research must measure and classify this boundary rather than credit Rust for work already performed outside V8.

**Scope Boundary**: Author and later execute research for ingestion and storage only. **No Rust is written, no crate is scaffolded, no backend source is modified, and no query/traversal/ranking/transport research is absorbed from phase 002.**

**Dependencies**:
- The scan and indexing entry path: `mcp_server/handlers/scan.ts`, `mcp_server/lib/structural-indexer.ts`, and `mcp_server/lib/ensure-ready.ts` [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:59] [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:76].
- The parser and extraction path: `mcp_server/lib/tree-sitter-parser.ts`, `mcp_server/lib/indexer-types.ts`, `mcp_server/lib/doc-symbol-extractor.ts`, and `mcp_server/lib/cross-file-edge-resolver.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:748] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:51].
- The storage and lifecycle path: `mcp_server/lib/code-graph-db.ts`, `mcp_server/lib/parser-skip-list.ts`, and recovery/apply orchestration [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:214] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:313].
- Native dependency boundary from `package.json`: `better-sqlite3`, `web-tree-sitter`, and `tree-sitter-wasms`; supporting JS dependencies are `ignore`, MCP SDK, and Zod [SOURCE: .opencode/skills/system-code-graph/package.json:14].

**Deliverables**:
- `research/research.md` — merged, cited synthesis across all rounds.
- An **improvement matrix**: current component × {latency / memory / tail-latency / concurrency / correctness / packaging} → {big win / marginal / none / already-native}, with the JS or native residency named.
- A **new-feature-feasibility matrix**: candidate capability × {possible in TS today? / practical in TS? / Rust unlocks?} with the enabling primitive and integration seam named.
- A **risk register** covering graph equivalence, parser parity, transaction/generation semantics, migration and rollback, operational packaging, and test gaps.
- A **ranked recommendation**: full rewrite / targeted native module (napi-rs or WASM) / Rust sidecar / do-not-rewrite — with the first concrete validation step.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ingestion path mixes three very different cost classes. Parser execution is already WASM-native at `parserInstance.parse(content)` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:819]. SQLite statements and transactions already execute through `better-sqlite3` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:10] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1034]. Between those boundaries, substantial JavaScript performs recursive file discovery, repeated hashing and reads, AST traversal, capture allocation, node/edge extraction, global reconciliation, reverse-dependency invalidation, per-file transaction sequencing, and scan promotion [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:612] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1021] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:591].

A blanket Rust rewrite could therefore spend heavily replacing glue around already-native work while risking graph-shape, bitemporal, and failure-recovery regressions. Conversely, a narrow native extraction or persistence module may remove real JS allocation and orchestration costs, and a sidecar may enable parallel parsing or streaming index builds that are difficult to fit safely into the current single-process design. The decision requires measured, file-cited evidence rather than the premise that all TypeScript time is available to Rust.

### Purpose
Produce a decision-ready answer for the ingestion and storage half only: identify the genuinely JS-resident costs Rust could improve, explicitly exclude WASM/SQLite execution from claimed wins, evaluate new capabilities that a different runtime architecture could unlock, and recommend the smallest justified migration target while preserving graph correctness and operational recoverability.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Survey source discovery, scope filtering, parser initialization, AST walking, capture and symbol construction, edge extraction, module/import reconciliation, and parser quarantine.
- Survey SQLite schema, WAL configuration, atomic per-file persistence, tombstones, `SUPERSEDES` lineage, bitemporal validity windows, generation bumps, dangling-edge cleanup, and recovery writes.
- Survey incremental staleness checks, content hashing, reverse-dependency force parsing, deleted-file cleanup, scan promotion, and unified-diff-to-symbol attribution.
- Quantify realistic Rust headroom only for JS-resident work; label parser execution and SQLite execution as native/FFI-resident unless evidence shows wrapper overhead dominates.
- Produce the cited synthesis, two matrices, risk register, and ranked recommendation.

### Out of Scope
- Query execution, graph traversal, blast radius, context retrieval, result ranking, seed resolution, and MCP query transport; these belong to phase 002.
- Writing Rust, scaffolding a crate, wiring napi-rs/WASM/sidecar code, or modifying backend source.
- Live A/B benchmarks against a Rust implementation; this phase may define benchmark plans and use existing TypeScript tests/metrics, but implementation benchmarking belongs to a later approved PoC.
- Claiming SQLite SQL execution or tree-sitter parsing itself as a Rust rewrite win merely because the callers are TypeScript.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Research charter: scope, requirements, 12 predefined angles, non-goals, stop conditions |
| `plan.md` | Create | 16-round survey/deep-validation allocation and execution/verification plan |
| `tasks.md` | Create | Future loop setup, smoke, launch, synthesis, and verification checklist |
| `research/deep-research-strategy.md` | Create | Round-by-round charter read by the future loop |
| `research/deep-research-fanout-config.json` | Create | Single-lineage GPT-5.6-sol cli-codex executor config (16 rounds) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the future deep-research loop to convergence or the 16-round cap with the configured GPT-5.6-sol cli-codex executor | `research/deep-research-state.jsonl` records completed rounds and a terminal `stopReason` (`converged` or `maxIterationsReached`) |
| REQ-002 | Produce a merged, source-grounded synthesis | `research/research.md` exists, covers all 12 angles, and uses `[SOURCE: relative/path:line]` / `[SOURCE: url]` citations |
| REQ-003 | Enforce the native-vs-JS framing invariant | Every performance claim identifies JS-resident work or FFI/native-resident work; no "big win" counts `parserInstance.parse`, SQLite statement execution, or WAL behavior without measured wrapper evidence |
| REQ-004 | Produce an improvement matrix for ingestion/storage components | Every component has an explicit verdict per improvement axis, a residency classification, and evidence; every "big win" names the exact JS-resident loop/allocation/orchestration it replaces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Quantify baseline and benchmark gaps | Existing metrics/tests are inventoried; missing timings for discovery, WASM parse, AST walk, extraction, reconciliation, hashing, and persistence are converted into a concrete measurement plan |
| REQ-006 | Produce a new-feature-feasibility matrix | Each candidate capability is tagged {possible-in-TS / impractical-in-TS / Rust-unlocks} with the enabling primitive and integration seam named |
| REQ-007 | Produce a correctness and migration risk register | Graph equivalence, deterministic IDs, parser recovery, atomic writes, bitemporal windows, tombstones, WAL/locking, rollback, and test gaps each have impact and mitigation |
| REQ-008 | Produce a ranked architecture recommendation | Full rewrite, targeted napi-rs/WASM module, Rust sidecar, and do-not-rewrite are ranked with evidence, rejected-credit accounting for already-native work, and a smallest next validation step |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` consolidates all rounds with citations into the current ingestion/storage backend under `.opencode/skills/system-code-graph/`.
- **SC-002**: Every predefined angle (§7) is answered or explicitly marked unresolved with the evidence gap and next measurement needed.
- **SC-003**: Every latency or throughput claim separates WASM parser time, SQLite native time, and JS-resident glue/compute time.
- **SC-004**: The recommendation is decision-ready and bounded to this half; a human can choose a target or reject the rewrite without re-reading iteration artifacts.
- **SC-005**: No query/traversal/ranking/transport work from phase 002 is used to inflate the benefit case for phase 001.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rust speed priors count tree-sitter WASM or SQLite native work as rewrite headroom | Inflated recommendation | REQ-003 forces residency classification on every performance claim |
| Risk | No current stage-separated benchmark isolates parse, AST walk, extraction, reconciliation, and persistence | Estimates remain speculative | A1/A2 define instrumentation seams and label unmeasured claims as estimates |
| Risk | Graph-shape parity is understated | Faster output may be wrong | Compare deterministic IDs, node/edge counts, metadata, confidence, and existing gold/atomic/bitemporal tests |
| Risk | Bitemporal generation semantics are treated as ordinary CRUD | Historical reads can silently collapse or lose windows | Double-cover storage lifecycle and generation ordering in A5/A8 [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1131] |
| Risk | Full rewrite absorbs phase-002 query concerns | Scope and recommendation become incomparable | Keep query/traversal/ranking/transport explicitly out of scope in every round |
| Risk | 16 rounds × GPT-5.6-sol xhigh subprocesses | Multi-hour execution and quota cost | Attended smoke check; single lineage; convergence may stop early |
| Dependency | `cli-codex` with GPT-5.6-sol availability | Future loop cannot run | Confirm executor before launch and run a 1-round smoke check |
| Dependency | Current backend and tests remain readable | Evidence cannot be grounded | Use the checked-in `mcp_server/`, `scripts/`, and `references/` files as source of truth |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These **predefined research angles** seed the future loop's strategy. Each must be answered or explicitly marked unresolved, and each names concrete current-code anchors. They are grouped into **survey** angles (ground truth) and **deep-validation** angles (feasibility, quantification, and new capability). The round→angle allocation is in `plan.md` §3 and `research/deep-research-strategy.md`.

### Survey angles (ground truth)

1. **A1 — End-to-end ingestion stage and timing inventory.** Map discovery → read/hash → WASM parse → JS AST walk → capture/node/edge build → cross-file reconciliation → SQLite persist → promotion. Which stages have metrics, and which are unmeasured? Anchors: `handlers/scan.ts` (~836 LOC), `lib/structural-indexer.ts` (~2,523 LOC), `lib/tree-sitter-parser.ts` (~907 LOC), and `lib/ensure-ready.ts` persistence seam [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:336] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:607].
2. **A2 — Native/FFI boundary and copy-cost audit.** Measure what already executes outside V8 (`web-tree-sitter` WASM and `better-sqlite3`/SQLite), what crosses the boundary as strings/trees/rows, and whether marshaling or repeated materialization dominates. Anchors: package dependencies and `TreeSitterParser.parse` [SOURCE: .opencode/skills/system-code-graph/package.json:14] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:788].
3. **A3 — JS-resident AST walk and AST→graph extraction.** Quantify `walkAST`, `capturesToNodes`, repeated string slicing/hashing, maps/sets, call regex scanning, and edge metadata allocation. Would a targeted native extraction module help after excluding parser execution itself? Anchors: `tree-sitter-parser.ts:610-744` and `structural-indexer.ts:968-1247` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:610] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:968].
4. **A4 — File discovery, scope filtering, hashing, and incremental invalidation.** Evaluate synchronous recursive traversal, repeated glob walks, `.gitignore` matching, content hashing on mtime drift, and reverse-dependency expansion. What is JS CPU/I/O orchestration versus OS/native filesystem work? Anchors: `findFiles`, `isFileStale`, and `buildIndexPhases` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1427] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1708] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2231].
5. **A5 — SQLite schema, transaction, and write-amplification baseline.** Separate SQLite-native statement time from JS transaction setup, prepared-statement churn, JSON serialization, per-file staging/finalization, node replacement, edge replacement, and dangling sweeps. Anchors: `code-graph-db.ts` (~2,519 LOC) and `persistIndexedFileResult` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:214] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:619].
6. **A6 — Edge builders and cross-file reconciliation.** Quantify module resolution filesystem probes, global dedup maps, recursive re-export resolution, import-edge construction, test-edge nested loops, and post-persist same-name call resolution. Anchors: `finalizeIndexResults` and `cross-file-edge-resolver.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1915] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:86].

### Deep-validation angles (feasibility, quantification, new capability)

7. **A7 — Parallel and streaming ingestion architecture (candidate NEW capability).** Can bounded worker threads, a targeted native module, or a Rust sidecar parallelize parse→walk→extract while preserving the current parser singleton/quarantine behavior and per-file atomic commits? Define where JS orchestration currently serializes work [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2308] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:69].
8. **A8 — Bitemporal edge lifecycle, tombstones, and generation correctness.** Can a Rust boundary preserve `valid_at`/`invalid_at`, generation ordering, `SUPERSEDES` lineage, deferred dangling cleanup, and flag-off behavior exactly? Determine whether a new storage model offers a real capability or merely reimplements SQLite-native semantics [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:593] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1583].
9. **A9 — Atomic snapshot builds and crash-safe promotion (candidate NEW capability).** Compare the current per-file transaction plus metadata-promotion model with shadow-database build/swap, bulk-load, or append-only generation commits. Would Rust unlock safer whole-scan atomicity, or can SQLite/TS already provide it? Anchors: per-file persistence, promotion guards, and recovery orchestration [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:607] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:661] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:430].
10. **A10 — Parser isolation, quarantine, and multi-language extensibility (candidate NEW capability).** Assess process isolation for WASM traps, per-language parser pools, native tree-sitter alternatives, and grammar packaging. Rust cannot claim faster parsing without comparison because the current parser is already WASM; value may instead be isolation, bounded memory, or easier parallelism [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:96] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:96].
11. **A11 — Incremental diff-to-index pipeline (candidate NEW capability).** `detect_changes` currently parses a caller-supplied diff and performs read-only line-range attribution against a fresh graph; it does not drive an incremental write pipeline [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:230] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:328]. Could a safe change-stream ingest only affected files and dependent importers, and does it require Rust?
12. **A12 — Interop boundary, parity harness, migration path, and ranked recommendation.** Compare full Rust rewrite, targeted napi-rs/WASM extraction, Rust sidecar, and do-not-rewrite. Define stable DTOs, deterministic symbol-ID and edge-metadata parity, WAL/locking ownership, rollback, packaging, and a strangler path. Synthesize all evidence without importing phase-002 query benefits [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:111] [SOURCE: .opencode/skills/system-code-graph/references/config/database_path_policy.md:88].

### Non-Goals (charter)
- Writing Rust, scaffolding a crate, compiling a native artifact, or wiring any module/sidecar.
- Editing the current TypeScript backend or its tests.
- Researching query/traversal/impact/context/ranking/MCP query transport owned by phase 002.
- Live A/B benchmarking against a Rust implementation.

### Stop Conditions (charter)
- `newInfoRatio` sustained below the configured convergence threshold, OR
- 16 rounds reached, OR
- All 12 angles answered with cited evidence and the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation written.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Sibling boundary**: `../002-research/` (query/traversal/retrieval/ranking/transport half)
- **Research subject**: `../../../../skills/system-code-graph/` (`mcp_server/`, `scripts/`, `references/`)
- **Plan**: `plan.md` (16-round allocation + executor config)
- **Loop artifacts**: `research/research.md`, `research/deep-research-strategy.md`, `research/deep-research-state.jsonl`
