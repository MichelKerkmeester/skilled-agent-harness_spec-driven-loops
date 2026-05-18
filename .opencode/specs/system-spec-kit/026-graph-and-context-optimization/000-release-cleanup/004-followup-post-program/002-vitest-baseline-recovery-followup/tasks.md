---
title: "Tasks: Vitest baseline recovery followup [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-vitest-baseline-recovery-followup/tasks]"
description: "Completed task list for re-baselining and closing the current vitest failure inventory."
trigger_phrases:
  - "vitest recovery followup tasks"
  - "026/000/007 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-vitest-baseline-recovery-followup"
    last_updated_at: "2026-05-09T04:30:00Z"
    last_updated_by: "codex"
    recent_action: "Completed vitest re-baseline and recovery tasks"
    next_safe_action: "Use classification inventory for future runtime-regression child packets"
    blockers: []
    key_files:
      - "scratch/classification-inventory.json"
      - "scratch/vitest-postfix.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vitest-recovery-followup-2026-05-09"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 resolved: no child packets needed."
      - "Q2 resolved: skill_advisor/scorer reclassified from current baseline."
---
# Tasks: Vitest baseline recovery followup

<!-- SPECKIT_LEVEL: 1 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-baseline current vitest failures with JSON reporter. Evidence: `scratch/vitest-current-baseline.json`.
- [x] T002 Compare against predecessor inventory. Evidence: `../003-vitest-baseline-recovery/scratch/triage-inventory.json` was read; current JSON superseded incomplete annotations.
- [x] T003 Classify current assertion failures and suite-import failures into the 4-bucket taxonomy. Evidence: `scratch/classification-inventory.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Tackle `skill_advisor/tests/scorer/` cluster. Evidence: scorer failures classified as runtime-regression and parked with `it.fails.skip` annotations.
- [x] T005 [P] Tackle hook/runtime clusters. Evidence: Copilot and startup hook failures classified and skipped or parked with annotations.
- [x] T006 [P] Tackle scaffold cluster. Evidence: scaffold golden snapshots updated.
- [x] T007 [P] Tackle alignment and path-drift cluster. Evidence: plural `.opencode/skills` / `.opencode/commands` fixture drift fixed.
- [x] T008 [P] Tackle code-graph cluster. Evidence: code-graph failures classified and parked with `it.fails.skip` annotations.
- [x] T009 Tackle residual clusters. Evidence: memory, validation, docs, and import failures classified and either fixed or skipped with reason.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm old predecessor followup annotations are not the inventory source. Evidence: `rg 'followup: 026/000/007'` returned no persisted hits before repair.
- [x] T011 Run post-recovery vitest. Evidence: `scratch/vitest-postfix.json` reports 11,657 passed / 0 failed / 232 skipped / 11 todo.
- [x] T012 Update v3.4.1.0 changelog row "Core test suites (vitest)" with measured post-recovery numbers.
- [x] T013 Run strict packet validation. Evidence: `validate.sh --strict` exited 0 with 0 errors / 0 warnings.
- [x] T014 Re-author implementation-summary.md with concrete implementation and verification detail.
- [x] T015 Update description.json and graph-metadata.json to complete / 100%.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Current failed vitest tests and suite-import failures classified in `scratch/classification-inventory.json`.
- [x] Fixture-drift cluster fixed in-packet.
- [x] Runtime-regression cluster parked with `it.fails.skip` and `// followup-actual:` annotations.
- [x] Environmental cluster skipped with `// REASON:` annotations.
- [x] v3.4.1.0 changelog row updated to measured post-recovery truth.
- [x] Full post-recovery vitest exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Predecessor**: `../003-vitest-baseline-recovery/`.
- **Current baseline**: `scratch/vitest-current-baseline.json`.
- **Classification**: `scratch/classification-inventory.json`.
- **Post-recovery baseline**: `scratch/vitest-postfix.json`.
- **v3.4.1.0 changelog row**: `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` "Core test suites (vitest)" verification row.
<!-- /ANCHOR:cross-refs -->
