---
title: "Tasks: sk-doc root benchmark artifact boundary"
description: "Concrete census and verification tasks for the root benchmark naming phase."
trigger_phrases:
  - "sk-doc root benchmark tasks"
  - "benchmark artifact naming tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/005-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored root benchmark audit tasks"
    next_safe_action: "Execute the root benchmark census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/benchmark/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc root benchmark artifact boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 List every root benchmark file/directory, including `.gitkeep` and hidden entries.
- [ ] T002 Search root-owned and cross-surface benchmark path consumers.
- [ ] T003 Freeze root-vs-create-benchmark ownership and candidate classification.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Preserve the observed `.gitkeep`-only baseline, or rename only actual root artifacts found at BASE.
- [ ] T005 Update root-owned artifact references if the baseline is non-empty.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: root census count and path list match the recorded baseline.
- [ ] T007 Verify: root references resolve and create-benchmark resources remain outside scope.
- [ ] T008 Verify: benchmark fields, keys, IDs, and mandated names are unchanged.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] All requirements in `spec.md` have evidence in the candidate report.
- [ ] The phase checklist is satisfied by the central verifier.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
