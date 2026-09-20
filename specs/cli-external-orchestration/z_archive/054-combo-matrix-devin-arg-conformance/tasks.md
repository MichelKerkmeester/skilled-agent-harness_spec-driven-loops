---
title: "Tasks: combo-matrix cli-devin arg conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "combo-matrix devin conformance"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/054-combo-matrix-devin-arg-conformance"
    last_updated_at: "2026-08-24T15:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fix applied and verified"
    next_safe_action: "Push to v4"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-054-combo-matrix-devin-arg"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: combo-matrix cli-devin arg conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the builder emits `--respect-workspace-trust false` for devin and the test omits it [evidence: `fanout-run.cjs` pushes the flag; `expectedRepresentativeArgs('cli-devin')` lacked it]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Append `--respect-workspace-trust false` to the cli-devin representative args (`combo-matrix.vitest.ts`) [evidence: the `cli-devin` case now ends `'--respect-workspace-trust', 'false'`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Run combo-matrix + the two other deep-loop guard files [evidence: `combo-matrix.vitest.ts` = 2 passed; `executor-config.vitest.ts` + `fanout-run.vitest.ts` = 199 passed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T003 complete]
- [x] Deep-loop guard suite green [evidence: 3 files, 201 tests passed]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
