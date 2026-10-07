---
title: "Tasks: Phase 015 — Verify external couplings + reconcile fail-open sites"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc external refs and facades tasks"
  - "facade resolution proof tasks"
  - "fail-open site reconciliation tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 015 — Verify external couplings + reconcile fail-open sites

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the phase 001 deep-research rulings and that depends-on phases 004, 005 and 013 are available
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Validate the ~151 external README/playbook validation-command refs resolve
- [ ] T003 Validate the 3 sibling-hub method-doc citations resolve (sk-code:128, sk-design:188, deep-loop-workflows:137)
- [ ] T004 Verify the git pre-commit VALIDATOR and the council test-council-matrix.sh spawn + its vitest assertion
- [ ] T005 Apply the /doctor audit_descriptions.py:45 budget-constant coupling decision (facade-preserve vs export from a stable shared module)
- [ ] T006 Reconcile the pre-commit existence guard and the check-markdown-links.cjs:42-57 allowlist keys
- [ ] T007 Apply an explicit repoint or an explicit facade per FAIL-OPEN site; rely on no graceful degradation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Sign off zero silent degradation and confirm the success criteria; exact command output is Not recorded
- [ ] T009 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
