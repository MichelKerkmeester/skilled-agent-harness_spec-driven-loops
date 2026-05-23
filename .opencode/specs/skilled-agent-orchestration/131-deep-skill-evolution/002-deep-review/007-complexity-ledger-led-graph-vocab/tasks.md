---
title: "Tasks: 116/007 - Ledger-Led Graph Vocabulary"
description: "Task ledger for extending review coverage-graph node kinds and enabling Phase B graph vocabulary fixtures."
trigger_phrases:
  - "review graph vocabulary tasks"
  - "ledger-led graph"
  - "BUG_CLASS node"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab"
    last_updated_at: "2026-05-22T12:18:31Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed Phase G graph vocabulary task ledger."
    next_safe_action: "Review evidence."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1160077200000000000000000000000000000000000000000000000000000000"
      session_id: "116-007-tasks"
      parent_session_id: "116-007-ledger-led-graph-vocabulary"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 116/007 - Ledger-Led Graph Vocabulary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read research synthesis (`../001-research-synthesis/research/research.md`) [5m]
- [x] T002 Read Level 2 examples (`.opencode/skills/system-spec-kit/templates/examples/level_2/`) [5m]
- [x] T003 [P] Inspect coverage graph DB allow-list (`coverage-graph-db.ts`) [3m]
- [x] T004 [P] Inspect upsert handler validation (`handlers/coverage-graph/upsert.ts`) [3m]
- [x] T005 [P] Inspect auto and confirm workflow graph filters (`deep_start-review-loop_*.yaml`) [2m]
- [x] T006 [P] Inspect Phase B graph fixture (`review-depth-graph.vitest.ts`) [2m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Coverage Graph Runtime
- [x] T010 Add `BUG_CLASS` to `ReviewNodeKind` (`coverage-graph-db.ts`) [3m]
- [x] T011 Add `INVARIANT` to `ReviewNodeKind` (`coverage-graph-db.ts`) [3m]
- [x] T012 Add `PRODUCER` to `ReviewNodeKind` (`coverage-graph-db.ts`) [3m]
- [x] T013 Add `CONSUMER` to `ReviewNodeKind` (`coverage-graph-db.ts`) [3m]
- [x] T014 Add `TEST` to `ReviewNodeKind` (`coverage-graph-db.ts`) [3m]
- [x] T015 Extend `VALID_KINDS.review` with all five new kinds (`coverage-graph-db.ts`) [5m]
- [x] T016 Confirm `VALID_RELATIONS.review` stays unchanged (`coverage-graph-db.ts`) [2m]
- [x] T017 Confirm handler validation reads the shared allow-list (`upsert.ts`) [2m]

### Workflow Event Filters
- [x] T020 Extend auto workflow node-kind event filter (`deep_start-review-loop_auto.yaml`) [4m]
- [x] T021 Mirror confirm workflow node-kind event filter (`deep_start-review-loop_confirm.yaml`) [4m]
- [x] T022 Confirm relation filters stay unchanged in both workflows [2m]

### Fixture Tests
- [x] T030 Convert the original `BUG_CLASS` today-fails test to post-G success (`review-depth-graph.vitest.ts`) [4m]
- [x] T031 Remove `.skip()` from the Phase G parameterized tests (`review-depth-graph.vitest.ts`) [2m]
- [x] T032 Assert no validation errors for successful new-kind upserts (`review-depth-graph.vitest.ts`) [2m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Automated Tests
- [x] T040 Run targeted graph vocabulary fixture: `pnpm vitest run --no-coverage review-depth-graph` [5m]
- [x] T041 Run all Phase B review-depth fixtures: `pnpm vitest run --no-coverage review-depth-` [5m]
- [x] T042 Run coverage graph regression tests: `pnpm vitest run --no-coverage coverage-graph` [5m]

### Documentation and Metadata
- [x] T050 Populate `spec.md` to Level 2 (`007-ledger-led-graph-vocabulary/spec.md`) [8m]
- [x] T051 Populate `plan.md` to Level 2 (`007-ledger-led-graph-vocabulary/plan.md`) [8m]
- [x] T052 Populate `tasks.md` to Level 2 (`007-ledger-led-graph-vocabulary/tasks.md`) [4m]
- [x] T053 Create `checklist.md` Level 2 (`007-ledger-led-graph-vocabulary/checklist.md`) [5m]
- [x] T054 Populate `implementation-summary.md` with Commit Handoff (`007-ledger-led-graph-vocabulary/implementation-summary.md`) [5m]
- [x] T055 Refresh `description.json` and `graph-metadata.json` with `generate-context.js` [3m]
- [x] T056 Run strict spec validation [2m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All new review graph node kinds are accepted by runtime validation.
- [x] Auto and confirm YAML filters preserve the new node kinds.
- [x] Phase B skipped graph vocabulary tests are enabled.
- [x] No new review relation was added.
- [x] Requested vitest filters pass.
- [x] Strict spec validation passes.
- [x] Commit handoff is present in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research Synthesis**: See `../001-research-synthesis/research/research.md`
- **Seeded Fixture Harness**: See `../002-seeded-fixture-harness/`
<!-- /ANCHOR:cross-refs -->
