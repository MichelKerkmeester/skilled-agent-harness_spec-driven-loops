---
title: "Tasks: Close the CocoIndex/rerank deprecation residue tail + record the completeness verdict [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "residue tail tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/016-remediate-residue-tail"
    last_updated_at: "2026-05-25T16:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "All tail tasks complete"
    next_safe_action: "Commit the residue-tail packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-residue-tail-001"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Close the CocoIndex/rerank deprecation residue tail + record the completeness verdict

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Exhaustive repo-wide sweep with corrected methodology (inline-quoted excludes, per-token, `--hidden`); diagnose the shell-mangling false-negative bug
- [x] T002 Classify every hit (keep vs residue); filesystem existence-check each referenced artifact
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] `deep-loop-runtime/lib/deep-loop/README.md` — remove the deleted `sidecar_ledger.py` "Rerank sidecar" helper line
- [x] T004 [P] `system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — "CCC stubs/trio" → "code_graph status/scan/verify handlers"
- [x] T005 DEFER `sidecar-client.ts:170` (cross-encoder/027-evolving zone) — flag for operator, do not edit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 grep gates: `sidecar_ledger` gone from deep-loop README; no "CCC stubs/trio" in the playbook scenario
- [x] T007 Record completeness verdict + kept-exceptions + cross-encoder caveat (implementation-summary)
- [ ] T008 Commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 2 tail items fixed + verdict recorded + committed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Siblings**: `../014-remediate-codegraph-naming/`, `../015-remediate-cross-surface-residue/`
<!-- /ANCHOR:cross-refs -->
