---
title: "Tasks: Code-Graph Edge Write-Time Governance (closed-vocab CHECK done, siblings deferred)"
description: "Task Format: T### [P?] Description (file path). Closed-vocab edge_type CHECK is DONE in system-code-graph. Churn cap, audit-subgraph and derived-clock siblings remain deferred."
trigger_phrases:
  - "edge governance tasks"
  - "edge_type CHECK migration tasks"
  - "churn cap audit derived clock tasks"
  - "closed vocab check tasks"
  - "code graph edge governance breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented closed-vocab edge_type CHECK migration and focused tests"
    next_safe_action: "Keep opt-in flag default-off until owner rollout approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-006-edge-governance-vocab"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **Status:** Closed-vocab edge governance is **DONE** in `.opencode/skills/system-code-graph/mcp_server`. The implementation ships the opt-in `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` migration path, `SCHEMA_VERSION` 7->8, pre-rebuild DISTINCT scan, table-rebuild CHECK, DOWN helper and focused tests. The churn-cap, audit-subgraph and derived-clock siblings remain **DEFERRED**.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Closed vocabulary + pre-migration scan (Unit 1 prereq).

- [x] T001 Run the pre-migration `SELECT DISTINCT edge_type` scan against a live code-graph DB (incl. nullable `tombstone.edge_type`) and record the actual DISTINCT set (closes the iter-024 "no risk unverified" gap) (`lib/code-graph-db.ts:256`). Evidence: read-only live DB scan on 2026-06-19 returned `CALLS, CONTAINS, DECORATES, EXPORTS, EXTENDS, IMPLEMENTS, IMPORTS, OVERRIDES, TESTED_BY, TYPE_OF`. Tombstone edge rows were empty. Existing `code_edges` CHECK absent before migration.
- [x] T002 Define the closed vocabulary constant: the 10 live relations (`CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY, DECORATES, OVERRIDES, TYPE_OF`) plus `SUPERSEDES`, synced to the type union (`lib/indexer-types.ts:20-22`). Evidence: `EDGE_TYPES` runtime constant in `lib/indexer-types.ts`. `EdgeType` derives from that tuple. DB migration consumes `CODE_GRAPH_EDGE_TYPE_VOCABULARY`.
- [x] T003 Decide and document the out-of-vocab policy (map/repair vs all-or-nothing abort) for any DISTINCT value found in T001 (`lib/code-graph-db.ts`). Evidence: policy is fail-closed all-or-nothing abort. `backfillCodeEdgeGovernanceVocabulary()` enumerates offenders and throws before rebuild.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Unit 1: `CG-closed-vocab-check` / `closed-vocab-edge-type` (anchor, schema migration)
- [x] T004 Implement the pre-migration DISTINCT-vocab scan as a guard that runs BEFORE any destructive step and aborts on an out-of-vocab value (`lib/code-graph-db.ts`). Evidence: `scanCodeEdgeGovernanceVocabulary()` scans `code_edges` and `code_graph_tombstones`. Test seeds out-of-vocab live/tombstone values and proves no half-rebuild table remains.
- [x] T005 Implement the table-rebuild migration: create `code_edges` with `CHECK (edge_type IN (...))` (mirror `parser_skip_list` CHECK `:208`) → copy rows → drop old → rename, in one all-or-nothing transaction (`lib/code-graph-db.ts:184,208`). Evidence: `ensureCodeEdgeGovernanceVocabSchema()` wraps scan + rebuild in a transaction. Test proves row preservation and CHECK reject/admit behavior.
- [x] T006 Recreate the edge indexes (`idx_edges_source`, `idx_edges_target`, `idx_edges_type`) on the rebuilt table (`lib/code-graph-db.ts:221-223`). Evidence: rebuild helper calls `createCodeEdgeIndexesSql()` after `ALTER TABLE ... RENAME TO code_edges`.
- [x] T007 Bump `SCHEMA_VERSION` from 5 and wire the rebuild into `ensureSchemaMigrations` as the first table-rebuild migration (`lib/code-graph-db.ts:145,450`). Evidence: current sibling 004 already advanced schema to 7. This implementation extends that sequence to `SCHEMA_VERSION = 8` and wires auto-apply behind `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB`.

### Unit 2: `CG-cascade-guard` (per-run churn cap, additive)
- [ ] T008 [P] DEFERRED Add a per-run heuristic-edge churn cap at the cross-file `CALLS` write site (`lib/structural-indexer.ts:1146`)
- [ ] T009 [P] DEFERRED Add the same per-run cap at the cross-file `TESTED_BY` write site (`lib/structural-indexer.ts:2058`)
- [ ] T010 DEFERRED Integrate the cap counter with the existing drift accounting so capped/dropped edges are observable, not silent (`lib/edge-drift.ts`)
- [x] T011 Document the per-pair revision cap as DEFERRED (needs cross-scan edge identity the per-scan rebuild model lacks, iter-013) (`spec.md` REQ-005). Evidence: spec marks Unit 2 deferred and names the cross-scan edge-identity dependency.

### Unit 3: `CG-audit-subgraph` (extend tombstone precursor, additive)
- [ ] T012 DEFERRED Extend `code_graph_tombstones` with creation and relabel/revision audit-event rows wired to the affected entity, EXTEND, not a new table (`lib/code-graph-db.ts:250-262`)
- [ ] T013 DEFERRED Add a query for audit events by subject/kind/time over the extended store (`lib/code-graph-db.ts`)
- [ ] T014 DEFERRED Add durable retention semantics for audit events (replacing the prune-to-100 default for audit rows). Preserve default-OFF gating unless owner approves default-on (`lib/code-graph-db.ts:232`)

### Unit 4: `CG-derived-clock-winner` (derived supersession tiebreak, FIX)
- [ ] T015 DEFERRED Replace the prune tiebreak `ORDER BY deleted_at DESC, id DESC` with the derived key `argmax over (valid_from DESC, object_canonical ASC)`, no stored counter / rowid (`lib/code-graph-db.ts:279`)
- [ ] T016 DEFERRED Apply the same derived tiebreak at the second prune-order site (`lib/code-graph-db.ts:1493`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Migration tests: CHECK rejects an out-of-vocab `edge_type`, admits all 10 relations + `SUPERSEDES`, round-trip (N edges before == after) on populated + empty DBs (`mcp_server/tests/*.vitest.ts`). Evidence: `code-edge-governance-vocab.vitest.ts`, targeted run `3 files / 15 tests passed`.
- [x] T018 Pre-migration abort test: a seeded out-of-vocab row (incl. nullable `tombstone.edge_type`) makes the migration abort all-or-nothing with no half-rebuilt table (`mcp_server/tests/*.vitest.ts`). Evidence: test seeds `LEGACY_EDGE`, nullable tombstone edge type and `LEGACY_TOMBSTONE_EDGE`. Migration throws before rebuild and leaves 2 edge rows intact.
- [ ] T019 [P] DEFERRED Churn-cap bound test: a scan over many `*.test.*` siblings stops at the cap and records the drop in drift accounting (`mcp_server/tests/*.vitest.ts`)
- [ ] T020 [P] DEFERRED Audit-event test: edge creation + relabel write queryable audit rows by subject/kind/time. Retention ages out oldest beyond policy (`mcp_server/tests/*.vitest.ts`)
- [ ] T021 [P] DEFERRED Derived-clock determinism test: the same tombstone set inserted in two arrival orders selects the identical supersession winner (`mcp_server/tests/*.vitest.ts`)
- [x] T022 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-code-graph/001-code-graph-core/006-edge-governance-vocab --strict`, with typecheck + focused code-graph schema/migration/indexer suites green. Evidence: typecheck exit 0, targeted run `3 files / 15 tests passed`, strict validation PASS with 0 errors and 0 warnings.
- [x] T023 Update spec/plan/tasks/checklist completion metadata + author implementation-summary.md with validation evidence. Evidence: spec status and this tasks file updated for closed-vocab completion. Implementation summary records code, tests, falsifier and deferred sibling status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Closed-vocab tasks marked `[x]`, deferred sibling tasks explicitly marked `DEFERRED`
- [x] No `[B]` blocked tasks remaining
- [x] Pre-migration DISTINCT vocab scan run against a live DB and recorded (T001)
- [x] Table-rebuild round-trip verified, `SCHEMA_VERSION` advanced to 8, `SUPERSEDES` admitted
- [x] `validate.sh --strict` passes, manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Research**: `../research/iterations/iteration-009.md` (cluster), `../research/iterations/iteration-008.md` (derived-clock), `../research/iterations/iteration-013.md` (feasibility), `../research/iterations/iteration-023.md` (build sequence), `../research/iterations/iteration-024.md` (GO re-verify)
- **Wave-0 shipped record**: Wave-0 record (none of these candidates in the done table)
<!-- /ANCHOR:cross-refs -->
