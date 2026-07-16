---
title: "Tasks: 028 Catalog and Playbook Coverage Audit [template:level_2/tasks.md]"
description: "The audit task list for the 20-iteration read-only coverage audit, all tasks done. Covers setup, the weighted iterations across two models, the verification pass and the synthesis into research.md. No catalog or playbook modified."
trigger_phrases:
  - "catalog playbook coverage audit tasks"
  - "028 coverage audit task list"
  - "read-only audit iterations tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-release-cleanup/010-catalog-playbook-coverage-audit"
    last_updated_at: "2026-07-04T17:31:32.246Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all audit tasks done across the 20 iterations"
    next_safe_action: "Operator decides close-now versus scaffold-cleanup-phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-tasks-010-catalog-playbook-coverage-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 028 Catalog and Playbook Coverage Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the audit question and the three-skill scope (`spec.md`)
- [x] T002 Confirm before-vs-after.md sections 1-6 as the 028 feature source of truth
- [x] T003 Decide iteration weighting: 7 code-graph, 7 skill-advisor, 4 spec-kit, 2 cross-cutting
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Code Graph iterations (7)
- [x] T004 [P] Audit trust-blend rank and deterministic walk-order coverage (`research/deltas/`)
- [x] T005 [P] Audit generation watermark and edge-staleness repair coverage (`research/deltas/`)
- [x] T006 [P] Audit parser-resilience and doc-symbol lane coverage (`research/deltas/`)
- [x] T007 [P] Grep code-graph feature_catalog for each 028 feature-area (`research/deltas/`)
- [x] T008 [P] Grep code-graph manual_testing_playbook for each scenario-area (`research/deltas/`)
- [x] T009 [P] Open each code-graph candidate entry to confirm real coverage (`research/deltas/`)
- [x] T010 [P] Record the six code-graph gap classifications (`research/deltas/`)

### Skill Advisor iterations (7)
- [x] T011 [P] Audit lane-health degrade and embedding-staleness coverage (`research/deltas/`)
- [x] T012 [P] Audit RRF determinism spine and conflict re-rank coverage (`research/deltas/`)
- [x] T013 [P] Audit query-class routing and exact semantic rerank coverage (`research/deltas/`)
- [x] T014 [P] Audit self-recommendation guard coverage (`research/deltas/`)
- [x] T015 [P] Grep skill-advisor feature_catalog for each 028 feature-area (`research/deltas/`)
- [x] T016 [P] Grep skill-advisor manual_testing_playbook for each scenario-area (`research/deltas/`)
- [x] T017 [P] Record the seven skill-advisor gap classifications (`research/deltas/`)

### Spec Kit completeness iterations (4)
- [x] T018 [P] Audit the five kept-on flags against the spec-kit catalog (`research/deltas/`)
- [x] T019 [P] Audit the 028 Memory-MCP always-on features against the catalog (`research/deltas/`)
- [x] T020 [P] Audit the spec-kit playbook for the red-team gate and trust escaper (`research/deltas/`)
- [x] T021 [P] Record the spec-kit edits-only artifact gaps (`research/deltas/`)

### Cross-cutting iterations (2)
- [x] T022 [P] Audit deep-loop catalog ownership across the three skills (`research/deltas/`)
- [x] T023 [P] Run the completeness critic over the combined finding set (`research/deltas/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Re-grep every high-count cluster before reporting (verification pass)
- [x] T025 Clear the twelve deleted-flag false-positive cluster by direct grep
- [x] T026 Correct the kept-on-flag count from 5 to 4 (temporal-edges is cataloged)
- [x] T027 Exclude unverified tool-name findings from the gap count
- [x] T028 Dedupe the critic seat against the narrow seats
- [x] T029 Synthesize the verified gap inventory into `research/research.md`
- [x] T030 Confirm no catalog or playbook was modified
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verified gap inventory written to research/research.md
- [x] False-positive cluster cleared by verification
- [x] checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Findings**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
