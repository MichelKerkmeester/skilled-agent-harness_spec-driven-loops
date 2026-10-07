---
title: "Tasks: Phase 017 — Cutover, strict validation, parent rollup, close-out"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc cutover and closeout tasks"
  - "strict validation rollup tasks"
  - "parent rollup closeout tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 017 — Cutover, strict validation, parent rollup, close-out

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

- [ ] T001 Confirm the phase 001 deep-research rulings and that depends-on phases 013, 014, 015 and 016 are available
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Remove residual monolith remnants not preserved as facades
- [ ] T003 Run parent-skill-check.cjs to STRICT 0/0 (checks 1,2,3,5-9)
- [ ] T004 Run spec `validate.sh --strict` on 125 + every child phase
- [ ] T005 Reconcile completion metadata across spec/plan/tasks/checklist/implementation-summary and roll up the 125 parent (children 001-016, status complete)
- [ ] T006 Verify companion-file completeness (hub SKILL.md + mode-registry + hub-router + description.json + graph-metadata + changelog/ + manual_testing_playbook/ + benchmark/; each packet SKILL.md + README.md + changelog/) and confirm changelogs are real files, never symlinked
- [ ] T007 Memory-save the close-out and hand off one coordinated canonical reindex to the operator
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm the success criteria; exact command output is Not recorded
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
