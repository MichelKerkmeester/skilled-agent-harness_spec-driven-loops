---
title: "Implementation Plan: Phase 1 — Rust Ingestion & Storage Backend Rewrite Research"
description: "Configure a future single-lineage 16-round deep-research loop over system-code-graph ingestion and storage, with 6 survey rounds and 10 deep-validation/second-pass rounds mapped to 12 predefined angles, then synthesize a cited recommendation that excludes already-native parser and SQLite work from claimed Rust wins."
trigger_phrases:
  - "code graph rust ingestion plan"
  - "ingestion storage deep research plan"
  - "011 phase 001 research plan"
  - "16 round code graph rust allocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/011-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the 16-round survey and deep-validation allocation for ingestion and storage"
    next_safe_action: "Confirm cli-codex availability, run a 1-round smoke check, then launch the future loop"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-research-fanout-config.json"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-code-graph-011-001-ingestion-storage-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Which JS-resident stages deserve a second-pass benchmark design?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Rust Ingestion & Storage Backend Rewrite Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (`/deep:research:auto`) over the TypeScript/Node ingestion path, web-tree-sitter WASM, and better-sqlite3 |
| **Executor** | `cli-codex` — GPT-5.6-sol, `model_reasoning_effort=xhigh`, `service_tier=fast` |
| **Subject** | Ingestion and storage under `.opencode/skills/system-code-graph/` (`mcp_server/`, supporting `scripts/` and `references/`) |
| **Storage** | Future loop state in `research/` JSONL + `iterations/` + merged `research.md`; researched runtime storage is skill-local `code-graph.sqlite` [SOURCE: .opencode/skills/system-code-graph/references/config/database_path_policy.md:46] |
| **Testing** | 1-round executor smoke check + angle coverage + citation/residency checks + JSON validation + packet `validate.sh` |

### Overview
Run one future deep-research lineage of up to 16 rounds with GPT-5.6-sol (`xhigh`, `fast`) over the ingestion and storage half of `system-code-graph`. The rounds are pre-allocated to 12 angles: **6 survey rounds** establish the real stage map, native boundary, AST extraction cost, incremental discovery/invalidation, SQLite write model, and cross-file builders; **10 deep-validation/second-pass rounds** evaluate parallel streaming, bitemporal parity, atomic promotion, parser isolation, diff-driven indexing, and interop/migration, with second passes on the highest-value JS-resident and correctness-sensitive seams. Research-only: no Rust or backend source changes, and no phase-002 query work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `codex` installed and authenticated; GPT-5.6-sol reachable with `xhigh` reasoning and `fast` service tier
- [ ] `deep-research-fanout-config.json` present with one cli-codex executor and `iterations: 16`
- [ ] `deep-research-strategy.md` contains 12 angles, the 16-round allocation, framing invariant, non-goals, stop conditions, and evidence discipline
- [ ] 1-round smoke check passes and writes an iteration file plus JSONL delta

### Definition of Done
- [ ] `research/deep-research-state.jsonl` records a terminal `stopReason` (`converged` or `maxIterationsReached`)
- [ ] `research/research.md` includes cited answers for A1–A12 or explicit unresolved evidence gaps
- [ ] Improvement matrix + new-feature-feasibility matrix + risk register + ranked recommendation present
- [ ] Every performance claim labels JS-resident vs FFI/native-resident; no "big win" counts tree-sitter WASM parsing or SQLite native execution without measured wrapper evidence
- [ ] Phase-002 query/traversal/ranking/transport scope is absent from the claimed benefit calculation
- [ ] `validate.sh` passes for this phase child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage sequential deep research through `/deep:research`, one focus per round, with externalized state under `research/`. The first six rounds establish the current ingestion/storage ground truth. Rounds 7–12 test six deep-validation angles. Rounds 13–15 revisit the three highest-value seams: JS AST/extraction compute, storage/bitemporal correctness, and incremental/streaming invalidation. Round 16 integrates interop and parity evidence into the ranked recommendation.

### Key Components
| Component | Role |
|-----------|------|
| `research/deep-research-fanout-config.json` | Executor definition (cli-codex, GPT-5.6-sol, xhigh, fast, 16 iterations, single lineage) |
| `research/deep-research-strategy.md` | Charter read each round: subject boundary, invariant, 12 angles, allocation, deliverables, non-goals, stop conditions |
| `research/deep-research-state.jsonl` | Append-only future per-round state (loop-generated) |
| `research/iterations/iteration-*.md` | Future per-round findings (loop-generated) |
| `research/research.md` | Future merged cited synthesis and four decision artifacts (loop-generated) |

### Data Flow
`deep-research-strategy.md` → one assigned angle per `cli-codex` round → evidence from the bounded backend files and external Rust/native options → `iterations/iteration-NNN.md` + JSONL delta → convergence/cap synthesis into `research.md`. Every performance statement passes the residency gate before entering either matrix.

#### Round → angle allocation (survey band — Rounds 1–6, angles A1–A6)

| Round | Angle | Primary anchor files | Question the round must close |
|-------|-------|----------------------|-------------------------------|
| 1 | A1 End-to-end stage/timing inventory | `handlers/scan.ts`, `lib/structural-indexer.ts`, `lib/tree-sitter-parser.ts`, `lib/ensure-ready.ts` | Which stages exist, which are timed, and where wall-clock attribution is missing [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2231] |
| 2 | A2 Native/FFI boundary and copy costs | `package.json`, `lib/tree-sitter-parser.ts`, `lib/code-graph-db.ts` | What runs in WASM/native SQLite vs V8; what boundary copies/marshaling remain [SOURCE: .opencode/skills/system-code-graph/package.json:14] |
| 3 | A3 JS AST walk and graph extraction | `lib/tree-sitter-parser.ts`, `lib/structural-indexer.ts`, `lib/indexer-types.ts` | Real JS CPU/allocation after excluding `parserInstance.parse` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:819] |
| 4 | A4 Discovery, hashing, incremental invalidation | `lib/structural-indexer.ts`, `lib/code-graph-db.ts` | Cost and correctness of recursive scans, hashes, stale checks, and reverse-dependency expansion [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2289] |
| 5 | A5 SQLite writes and amplification | `lib/code-graph-db.ts`, `lib/ensure-ready.ts`, `handlers/scan.ts` | Native SQL time vs JS sequencing/serialization; transaction and sweep amplification [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:619] |
| 6 | A6 Edge builders and reconciliation | `lib/structural-indexer.ts`, `lib/cross-file-edge-resolver.ts` | Module-resolution probes, global maps/loops, import/call resolution, and asymptotic risks [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1915] |

#### Round → angle allocation (deep-validation band — Rounds 7–16, angles A7–A12 + second passes)

| Round | Angle | Focus |
|-------|-------|-------|
| 7 | A7 Parallel/streaming ingestion (NEW) | Worker/native-module/sidecar options; parser singleton and ordered commit constraints |
| 8 | A8 Bitemporal lifecycle and generation parity | `valid_at`/`invalid_at`, generation bump ordering, lineage, tombstones, deferred dangling cleanup [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1583] |
| 9 | A9 Atomic snapshot and crash-safe promotion (NEW) | Current per-file atomicity vs shadow DB, bulk load, snapshot swap, and whole-scan commit |
| 10 | A10 Parser isolation and language extensibility (NEW) | WASM trap containment, parser pools, native tree-sitter comparison, grammar packaging; no unmeasured parser-speed claim |
| 11 | A11 Incremental diff-to-index pipeline (NEW) | Turn read-only diff attribution into safe affected-file/dependent refresh, or show TS already suffices [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:260] |
| 12 | A12 Interop/parity/migration, part 1 | Stable DTO and ownership seams for napi-rs/WASM/sidecar/full port; test and rollback requirements |
| 13 | A3 second pass | Convert AST-walk/extraction findings into a benchmark design and target-interface estimate; isolate WASM parse time |
| 14 | A5/A8 second pass | Quantify write amplification and prove bitemporal/generation invariants a replacement must preserve |
| 15 | A4/A7/A11 second pass | Model repository-scale incremental invalidation and parallel streaming; identify the smallest safe prototype |
| 16 | A12 part 2 — synthesis | Improvement matrix, new-feature-feasibility matrix, risk register, ranked recommendation, first concrete validation step |

#### Loop mechanics
- **Convergence**: `newInfoRatio` below threshold for the configured window, OR 16 rounds, OR all 12 angles closed with all four deliverables written.
- **Evidence discipline**: every finding carries `[SOURCE: relative/path:line]` or `[SOURCE: url]`; estimates are labelled; confirmed and inferred claims are separated.
- **Residency gate**: each performance claim names JS-resident work or FFI/native-resident work. SQLite execution and tree-sitter WASM parsing are not counted as Rust wins without measured wrapper/copy evidence.
- **Scope gate**: phase-002 query/traversal/context/ranking/transport evidence may be mentioned only as an explicit boundary, never as phase-001 benefit credit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `cli-codex` can reach GPT-5.6-sol with the configured reasoning and service tier.
- Keep the authored fanout config and strategy immutable for the run.
- Run a 1-round smoke check to confirm one iteration file and one valid JSONL delta are written.

### Phase 2: Core Implementation
- Launch the single-lineage 16-round loop via `/deep:research:auto`.
- Follow the allocation in §3: survey Rounds 1–6, deep validation Rounds 7–12, second passes Rounds 13–15, synthesis Round 16.
- Let the command-owned workflow manage state, convergence, iteration files, and final synthesis.
- Produce the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation in `research/research.md`.

### Phase 3: Verification
- Confirm a terminal `stopReason` in `research/deep-research-state.jsonl`.
- Confirm all A1–A12 angles are answered or explicitly unresolved with evidence gaps.
- Audit every "big win" for an exact JS-resident target and ensure already-native work is excluded.
- Audit scope against the phase-002 boundary.
- Run packet validation and stop for human review; do not implement the recommendation in this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Smoke**: One future loop round proves executor reachability and workflow-owned iteration/JSONL writes.
- **State**: The final JSONL record contains a terminal stop reason and no malformed line.
- **Coverage**: A1–A12 each appear in at least one iteration and in the synthesis or unresolved ledger.
- **Citation**: Every load-bearing backend claim has a repository-relative file/line citation; external implementation claims have URL citations.
- **Residency**: Search the synthesis for each latency/throughput verdict and verify it labels JS-resident or FFI/native-resident work.
- **Correctness**: Cross-check any proposed storage boundary against deterministic symbol IDs, atomic persistence, bitemporal tests, tombstones, generation bumps, and parser quarantine.
- **Scope**: Confirm query, traversal, impact/context retrieval, ranking, and MCP query transport remain phase-002 work.
- **Structure**: Validate JSON and run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-code-graph/011-rust-backend-rewrite-research/001-research --strict`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Executor**: `cli-codex` with GPT-5.6-sol, `xhigh`, and `fast`, plus the command-owned `/deep:research` workflow.
- **Research subject**: Current `.opencode/skills/system-code-graph/` ingestion/storage source and tests.
- **Native boundary**: `web-tree-sitter` + `tree-sitter-wasms` and `better-sqlite3` [SOURCE: .opencode/skills/system-code-graph/package.json:14].
- **Correctness evidence**: Existing atomic persistence, bitemporal, edge lifecycle, recovery, and incremental scan tests under `mcp_server/tests/`.
- **No Rust dependency**: No toolchain, crate, native build, or runtime integration is required for this research phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- This phase authors a charter and later produces only workflow-owned research artifacts under this child. Rollback of a future run is removal of its generated `iterations/`, JSONL state, dashboard/registry outputs, and `research.md`; keep the charter files for audit.
- No backend source, database schema, runtime config, or Rust artifact is modified, so there is no production migration to undo.
- If the executor fails or research diverges, stop the command-owned loop and retain state for a clean resume/restart through the supported deep-research lifecycle; do not hand-roll an alternate loop.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: `spec.md` (charter + 12 angles)
- **Parent**: `../spec.md`
- **Sibling boundary**: `../002-research/`
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
