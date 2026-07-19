---
title: "Tasks: static reference-rewrite executor (020 phase 005.004)"
description: "Tasks for the static reference-rewrite executor: ledger/map loading, preimage-keyed planning, dependency-closed batching, compare-and-swap apply, dynamic-site routing, idempotency, and rollback."
trigger_phrases:
  - "reference-rewrite executor tasks"
  - "compare-and-swap rewrite tasks"
  - "preimage blob rewrite tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
    last_updated_at: "2026-07-18T08:08:15Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and fixture verification tasks"
    next_safe_action: "Generate a reviewed dry-run after phase 006 freezes the real semantic map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_executor.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_reference_rewrite_executor.py"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task evidence comes from disposable repositories or read-only plan output, never from a real migration run."
---
# Tasks: Static Reference-Rewrite Executor

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

- [x] T001 Record the plan, Git blob preimage, immutable identity and site-state model in `reference_rewrite_core.py:55`.
- [x] T002 Define seven static classes and terminal dynamic dispositions in `reference_rewrite_core.py:57`.
- [x] T003 [P] Seed disposable Git coverage in `ReferenceRewriteExecutorTests` with drift, exemptions and dynamic sites.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Load and cross-validate both inputs through `load_inputs` in `reference_rewrite_core.py:341`.
- [x] T005 Build per-site SCC plans through `build_plan` in `reference_rewrite_core.py:601`.
- [x] T006 Enforce compare-and-swap and regeneration through `_regenerate_file_sites` and `apply_plan`.
- [x] T007 Keep dry-run as the default in `reference_rewrite_executor.py` and gate writes behind `--apply`.
- [x] T008 Route or skip every dynamic row through `_dynamic_states` without generating a replacement.
- [x] T009 Prove zero-pending reruns and journal rollback with `test_apply_idempotent_rerun_and_rollback_preserve_modes`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify: Dry-run harness reports `working_tree_unchanged=true` with 11 pending fixture rewrites.
- [x] T011 Verify: `test_apply_idempotent_rerun_and_rollback_preserve_modes` leaves `notes/off-ledger.txt` unchanged.
- [x] T012 Verify: `test_blob_drift_regenerates_only_the_selected_scc` records regeneration after blob drift.
- [x] T013 Verify: `test_blob_drift_regenerates_only_the_selected_scc` leaves the other SCC's TOML blob byte-identical.
- [x] T014 Verify: Harness reports `routed-to-producer` and `skipped-with-reason` while protected values remain unchanged.
- [x] T015 Verify: `test_injected_failure_reports_and_replays_inverse_journal` returns non-zero and restores the snapshot.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All executor tasks complete with named-test evidence in `checklist.md`.
- [x] All six requirements meet their acceptance criteria across 9/9 executor tests.
- [x] The JSON plan and journal expose stable identity, batch, preimage, postimage and per-site states.
- [x] No real repository migration was executed. All mutation evidence used `TemporaryDirectory` Git fixtures.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Ledger input**: See `../002-reference-checker-and-disposition-ledger/spec.md`
- **Map input**: See `../../006-inventory-and-frozen-map/spec.md`
- **Parent map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
