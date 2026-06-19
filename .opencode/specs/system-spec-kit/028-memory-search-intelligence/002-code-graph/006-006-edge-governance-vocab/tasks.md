---
title: "Tasks: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak)"
description: "Task Format: T### [P?] Description (file path). All five candidates PENDING — none in 030 §14 done table."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/006-006-edge-governance-vocab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author edge-governance-vocab task breakdown from 028/002 research"
    next_safe_action: "Execute T001 — run the pre-migration SELECT DISTINCT edge_type scan"
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
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **Status:** All five candidates (`CG-closed-vocab-check`, `closed-vocab-edge-type`, `CG-cascade-guard`, `CG-audit-subgraph`, `CG-derived-clock-winner`) are **PENDING**. None appear in `030 spec.md` §14 done table — only Code-Graph Q4-C1 shipped from the Code Graph subsystem, in a different sub-phase. There are therefore no pre-checked `[x]` tasks with commit evidence in this phase.

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

- [ ] T001 Run the pre-migration `SELECT DISTINCT edge_type` scan against a live code-graph DB — incl. nullable `tombstone.edge_type` — and record the actual DISTINCT set (closes the iter-024 "no risk unverified" gap) (`lib/code-graph-db.ts:256`)
- [ ] T002 Define the closed vocabulary constant: the 10 live relations (`CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY, DECORATES, OVERRIDES, TYPE_OF`) plus `SUPERSEDES`, synced to the type union (`lib/indexer-types.ts:20-22`)
- [ ] T003 Decide and document the out-of-vocab policy (map/repair vs all-or-nothing abort) for any DISTINCT value found in T001 (`lib/code-graph-db.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Unit 1 — `CG-closed-vocab-check` / `closed-vocab-edge-type` (anchor; schema migration)
- [ ] T004 Implement the pre-migration DISTINCT-vocab scan as a guard that runs BEFORE any destructive step and aborts on an out-of-vocab value (`lib/code-graph-db.ts`)
- [ ] T005 Implement the table-rebuild migration: create `code_edges` with `CHECK (edge_type IN (...))` (mirror `parser_skip_list` CHECK `:208`) → copy rows → drop old → rename, in one all-or-nothing transaction (`lib/code-graph-db.ts:184,208`)
- [ ] T006 Recreate the edge indexes (`idx_edges_source`, `idx_edges_target`, `idx_edges_type`) on the rebuilt table (`lib/code-graph-db.ts:221-223`)
- [ ] T007 Bump `SCHEMA_VERSION` from 5 and wire the rebuild into `ensureSchemaMigrations` as the first table-rebuild migration (`lib/code-graph-db.ts:145,450`)

### Unit 2 — `CG-cascade-guard` (per-run churn cap; additive)
- [ ] T008 [P] Add a per-run heuristic-edge churn cap at the cross-file `CALLS` write site (`lib/structural-indexer.ts:1146`)
- [ ] T009 [P] Add the same per-run cap at the cross-file `TESTED_BY` write site (`lib/structural-indexer.ts:2058`)
- [ ] T010 Integrate the cap counter with the existing drift accounting so capped/dropped edges are observable, not silent (`lib/edge-drift.ts`)
- [ ] T011 Document the per-pair revision cap as DEFERRED (needs cross-scan edge identity the per-scan rebuild model lacks — iter-013) (`spec.md` REQ-005)

### Unit 3 — `CG-audit-subgraph` (extend tombstone precursor; additive)
- [ ] T012 Extend `code_graph_tombstones` with creation and relabel/revision audit-event rows wired to the affected entity — EXTEND, not a new table (`lib/code-graph-db.ts:250-262`)
- [ ] T013 Add a query for audit events by subject/kind/time over the extended store (`lib/code-graph-db.ts`)
- [ ] T014 Add durable retention semantics for audit events (replacing the prune-to-100 default for audit rows); preserve default-OFF gating unless owner approves default-on (`lib/code-graph-db.ts:232`)

### Unit 4 — `CG-derived-clock-winner` (derived supersession tiebreak; FIX)
- [ ] T015 Replace the prune tiebreak `ORDER BY deleted_at DESC, id DESC` with the derived key `argmax over (valid_from DESC, object_canonical ASC)` — no stored counter / rowid (`lib/code-graph-db.ts:279`)
- [ ] T016 Apply the same derived tiebreak at the second prune-order site (`lib/code-graph-db.ts:1493`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Migration tests: CHECK rejects an out-of-vocab `edge_type`; admits all 10 relations + `SUPERSEDES`; round-trip (N edges before == after) on populated + empty DBs (`mcp_server/tests/*.vitest.ts`)
- [ ] T018 Pre-migration abort test: a seeded out-of-vocab row (incl. nullable `tombstone.edge_type`) makes the migration abort all-or-nothing — no half-rebuilt table (`mcp_server/tests/*.vitest.ts`)
- [ ] T019 [P] Churn-cap bound test: a scan over many `*.test.*` siblings stops at the cap and records the drop in drift accounting (`mcp_server/tests/*.vitest.ts`)
- [ ] T020 [P] Audit-event test: edge creation + relabel write queryable audit rows by subject/kind/time; retention ages out oldest beyond policy (`mcp_server/tests/*.vitest.ts`)
- [ ] T021 [P] Derived-clock determinism test: the same tombstone set inserted in two arrival orders selects the identical supersession winner (`mcp_server/tests/*.vitest.ts`)
- [ ] T022 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/006-006-edge-governance-vocab --strict`; typecheck + focused code-graph schema/migration/indexer suites green
- [ ] T023 Update spec/plan/tasks/checklist completion metadata + author implementation-summary.md with validation evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Pre-migration DISTINCT vocab scan run against a live DB and recorded (T001)
- [ ] Table-rebuild round-trip verified; `SCHEMA_VERSION` advanced; `SUPERSEDES` admitted
- [ ] `validate.sh --strict` passes; manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Research**: `../research/iterations/iteration-009.md` (cluster), `../research/iterations/iteration-008.md` (derived-clock), `../research/iterations/iteration-013.md` (feasibility), `../research/iterations/iteration-023.md` (build sequence), `../research/iterations/iteration-024.md` (GO re-verify)
- **Wave-0 shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (none of these candidates in the done table)
<!-- /ANCHOR:cross-refs -->
