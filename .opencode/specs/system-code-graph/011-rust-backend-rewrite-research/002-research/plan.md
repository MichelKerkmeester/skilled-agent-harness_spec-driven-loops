---
title: "Implementation Plan: Phase 2 - Query & Serving Rust Backend Rewrite Research"
description: "Configure a future single-lineage 16-round deep-research loop over system-code-graph query and serving, with six survey rounds and ten deep-validation rounds mapped to 12 predefined angles, then synthesize evidence-grounded matrices and a ranked rewrite recommendation."
trigger_phrases:
  - "query serving rust research plan"
  - "code graph 16 round allocation"
  - "011 phase 002 plan"
  - "rust traversal research plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/011-rust-backend-rewrite-research/002-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the 16-round query-and-serving research allocation and executor configuration"
    next_safe_action: "Confirm cli-codex access, run a one-round smoke check, then launch the future loop"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-code-graph-011-002-query-serving-rust-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Which measured JS-resident serving kernels merit native extraction?"
      - "What benchmark and parity fixtures are required before a PoC decision?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 - Query & Serving Rust Backend Rewrite Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Future `/deep:research:auto` loop over a TypeScript/Node MCP serving backend |
| **Executor** | `cli-codex` - GPT-5.6-sol, `reasoningEffort=xhigh`, `serviceTier=fast` |
| **Subject** | Query/serving half of `.opencode/skills/system-code-graph/` (`mcp_server/`, `scripts/`, `references/`) |
| **Native Boundary** | `better-sqlite3`/SQLite is already native; parser WASM is excluded with sibling phase 001 [SOURCE: .opencode/skills/system-code-graph/package.json:14-20] |
| **State** | Future loop artifacts under local `research/`; this charter writes only strategy and fanout config |
| **Testing** | One-round executor smoke, angle coverage, citation/residency audit, parity matrix, strict packet validation |

### Overview
Run one future deep-research lineage of up to 16 rounds over the current query-and-serving backend. Rounds 1-6 survey topology, native boundaries, traversal, context ranking, resolution, and transport/determinism. Rounds 7-12 validate six architecture/capability angles. Rounds 13-16 double-cover the highest-value questions: traversal quantification, context/ranking quantification, SQL/FFI economics, and correctness-led recommendation synthesis. The loop must never count native SQLite or parser work as a Rust win.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `codex` is installed, authenticated, and can invoke `gpt-5.6-sol` with xhigh/fast settings.
- [ ] `research/deep-research-fanout-config.json` contains one executor, 16 iterations, and concurrency 1.
- [ ] `research/deep-research-strategy.md` contains 12 angles, the round allocation, framing invariant, non-goals, and stop conditions.
- [ ] The target commit/tree state is recorded so line citations can be interpreted if source drifts.
- [ ] A one-round smoke check proves the executor writes both iteration markdown and JSONL state.

### Definition of Done
- [ ] The loop ends with a terminal stop reason (converged, all questions answered, or iteration cap).
- [ ] `research/research.md` answers A1-A12 with source citations and confirmed-vs-inferred labels.
- [ ] Improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation exist.
- [ ] Every performance verdict labels JS-resident vs FFI/native-resident work; no big win counts SQLite/parser execution.
- [ ] Deterministic ordering, readiness/refusal, trace/partial output, MCP schema, and CLI parity obligations are covered.
- [ ] Strict validation passes for the phase child, subject to the parent process adding its generated metadata.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage sequential deep research, one focus per round, externalized state in the phase-local `research/` folder. The allocation uses a survey band followed by deep validation. A3, A4/A8, A2, and A12 receive second passes because they determine whether a native boundary is technically and economically justified.

### Key Components
| Component | Role |
|-----------|------|
| `research/deep-research-fanout-config.json` | GPT-5.6-sol xhigh/fast cli-codex executor; 16 rounds; single lineage |
| `research/deep-research-strategy.md` | Round-readable charter, evidence rules, 12 angles, allocation, and deliverables |
| `research/deep-research-state.jsonl` | Future append-only iteration state (loop-generated, not created now) |
| `research/iterations/iteration-*.md` | Future per-round findings (loop-generated, not created now) |
| `research/research.md` | Future merged synthesis and decision artifacts (loop-generated, not created now) |

### Data Flow
`deep-research-strategy.md` -> future cli-codex round reads source/tests/references -> iteration markdown + JSONL delta -> convergence evaluation -> `research.md` synthesis with matrices, risks, and recommendation. Every round classifies measured work into JS compute, native/FFI execution, I/O wait, or transport/serialization.

#### Round -> angle allocation (survey band - Rounds 1-6, A1-A6)

| Round | Angle | Primary anchor files | Question the round must close |
|-------|-------|----------------------|-------------------------------|
| 1 | A1 Serving topology and baseline | `mcp_server/index.ts`, `tool-schemas.ts`, `tools/code-graph-tools.ts`, `handlers/{query,context}.ts`, `code-index-cli.ts`, query/CLI tests | What is served, where time is measured, and which workloads/benchmarks are missing |
| 2 | A2 Native/FFI boundary and SQL chattiness | `package.json`, `handlers/query.ts`, `lib/code-graph-context.ts`, DB query call sites | Which work is SQLite-native versus V8, and how many crossings occur per operation |
| 3 | A3 Traversal and blast radius | `lib/graph/bfs-traversal.ts`, `handlers/query.ts` | Cost of queue/path/Map/Set/sort work; scale and semantic constraints |
| 4 | A4 Context expansion and ranking | `lib/code-graph-context.ts`, `handlers/context.ts` | Cost and quality of edge ranking, PPR, provenance, deadlines, and formatting |
| 5 | A5 Resolution and intent | `handlers/query.ts`, `lib/symbol-bm25-resolver.ts`, `lib/query-intent-classifier.ts` | Exact/ambiguous/BM25 behavior, allocation footprint, and candidate sizes |
| 6 | A6 Serving contract and structural checks | `lib/readiness-contract.ts`, `handlers/{detect-changes,status,verify,apply}.ts`, schemas, dispatcher, server, CLI | What must remain byte/semantically stable and what gains little from Rust |

#### Round -> angle allocation (deep-validation band - Rounds 7-16)

| Round | Angle | Focus |
|-------|-------|-------|
| 7 | A7 Targeted traversal kernel | napi-rs/WASM boundary for BFS/blast radius; graph marshaling, copies, stable output, break-even sizes |
| 8 | A8 Targeted ranking/resolution kernel | BM25/RRF/PPR/top-k alternatives; deterministic parity; optimized TS and SQLite-side baselines |
| 9 | A9 Advanced graph analysis | SCC, cycles, dominators, k-shortest paths, explanations, centrality/community; usefulness and integration seams |
| 10 | A10 Concurrency/cancellation/streaming | Event-loop blocking, workers vs Rust, cancelable budgets, streaming partials, MCP/IPC backpressure |
| 11 | A11 Interop/deployment architecture | Full service vs napi-rs vs WASM vs sidecar; SDK parity, warm daemon, crash isolation, packaging |
| 12 | A12 Correctness/migration framework | Parity fixture inventory, strangler boundary, verification gaps, preliminary ranking |
| 13 | A3/A7 second pass | Quantified traversal model and benchmark design across depth, degree, seeds, trace, and result caps |
| 14 | A4/A8 second pass | Quantified context/ranking model across candidate sizes, PPR iterations, token budgets, and deadline partiality |
| 15 | A2 second pass | End-to-end cost decomposition: SQLite time, DB crossings, JS compute, copies, JSON, MCP/IPC; break-even analysis |
| 16 | A12 second pass | Final matrices, risk register, ranked recommendation, first PoC/measurement step, and do-not-rewrite threshold |

#### Loop mechanics
- **Convergence**: sustained low `newInfoRatio`, 16-round cap, or all 12 angles closed with all four deliverables.
- **Evidence**: every finding uses `[SOURCE: relative/path:line]` or `[SOURCE: url]`; estimates are labeled.
- **Residency**: every performance claim labels JS-resident, FFI/native-resident, I/O wait, or transport/serialization.
- **Boundary discipline**: parsing/extraction/store/persistence/bitemporal/incremental writes remain sibling-phase concerns.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm cli-codex authentication and GPT-5.6-sol availability.
- Review the checked-in strategy/config and record the source revision.
- Run a one-round smoke check without changing the 16-round charter config.

### Phase 2: Core Implementation
- Launch the future loop through `/deep:research:auto`; do not hand-roll dispatch.
- Follow Rounds 1-6 survey then Rounds 7-16 deep-validation allocation.
- Externalize each round, including negative findings and the residency classification.
- Synthesize `research/research.md` with both matrices, the risk register, and ranked recommendation.

### Phase 3: Verification
- Verify the terminal stop reason and A1-A12 coverage.
- Audit every big-win verdict for a named JS-resident target and exclude SQLite/parser credit.
- Verify deterministic/refusal/schema/CLI parity obligations and unresolved gaps.
- Run strict packet validation after parent-generated metadata is present; stop for human review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Executor smoke**: one round writes a non-empty iteration file and required JSONL fields.
- **Coverage**: each A1-A12 appears in findings or is explicitly unresolved.
- **Residency audit**: every latency/memory/tail claim has a residency label; grep/manual review finds no native SQLite/parser work counted as a big win.
- **Benchmark design review**: proposed harness separates DB execution, crossing count, JS algorithm time, allocation/copying, serialization, and transport at p50/p95/p99.
- **Semantic parity**: fixtures cover exact/ambiguous resolution, stable tie ordering, limits/depth, dangling edges, union blast radius, traces, partial output, readiness refusal, trust metadata, diff attribution, and tool/CLI schema parity.
- **Structure**: `validate.sh --strict` runs against this phase child when parent-generated metadata is available.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Executor**: `cli-codex` with GPT-5.6-sol, `xhigh`, and `fast` access.
- **Workflow**: `/deep:research` owns dispatch, state, convergence, and synthesis; this charter does not invoke it.
- **Research subject**: current `.opencode/skills/system-code-graph/` source, tests, `scripts/doctor.sh`, and runtime/readiness references.
- **Sibling boundary**: phase 001 owns parsing, extraction, storage, bitemporal, and incremental writes.
- **Native dependency fact**: `better-sqlite3`, `web-tree-sitter`, and `tree-sitter-wasms` are present; only serving-side SQLite interactions are in this phase [SOURCE: .opencode/skills/system-code-graph/package.json:14-20].
- **No Rust toolchain dependency**: no crate or native code exists in this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Charter authoring is isolated to five files under this phase child. Rollback is removal of those five files before any loop run.
- A future loop rollback removes only loop-generated state (`deep-research-state.jsonl`, `iterations/`, `research.md`, reducer outputs) while retaining the charter and executor config.
- No runtime source, database, metadata, or Rust artifact is changed, so there is no production migration to undo.
- If source drift invalidates citations, stop and refresh citations rather than carrying stale evidence into the recommendation.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: `spec.md`
- **Tasks**: `tasks.md`
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
- **Sibling scope**: `../001-research/`
