---
title: "Tasks: Docs as Skill References"
description: "Dependency-ordered task ledger for planning and converting the Pi Remote operator documentation set into sk-create-skill reference-template format."
trigger_phrases:
  - "pi remote docs as skill references"
  - "pi mobile phase 12"
  - "docs as skill references"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/012-docs-as-skill-references"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 012 docs-as-skill-references spec set as Draft"
    next_safe_action: "Approved 012 plan, then begin 013 code-standards-alignment audit"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Tasks: Docs as Skill References

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after its dependency |
| `[B]` | Blocked with an explicit reason |

**Task Format**: `T### [P?] Description (owned path or evidence surface)`

The deliverables are the seven converted runbooks under `Apps/Pi Mobile/docs/`. Unchecked rows remain planning-state work.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, owned paths, the phase 011 anchor, and the authoritative gate.
- [ ] T002 Read the seven source runbooks and capture the verified command set.
- [ ] T003 Review the `sk-create-skill` reference-template structure and freeze rollback.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Convert `docs/setup.md` to the reference shape, preserving commands verbatim.
- [ ] T005 [P] Convert `docs/security.md` to the reference shape.
- [ ] T006 [P] Convert `docs/operations.md` to the reference shape.
- [ ] T007 [P] Convert `docs/incident-playbooks.md` with explicit decision logic.
- [ ] T008 [P] Convert `docs/rollback.md` and `docs/release-verification.md` to the reference shape.
- [ ] T009 [P] Convert `docs/platform-support.md`, keeping the matrix tables and the Attention Inbox fallback.
- [ ] T010 Cross-link every converted runbook to `docs/architecture.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run focused reference extraction, validation, and command diffs and retain exact evidence.
- [ ] T012 Run the authoritative phase gate and the safe rollback or recovery exercise.
- [ ] T013 Reconcile checklist, current state, parent map, successor inputs, and scoped status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] Operator-only boundaries and dependent phases remain consistent.
- [ ] Parent and child statuses plus the successor handoff describe the same final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent map**: [../spec.md](../spec.md)
- **Specification**: [spec.md](spec.md)
- **Plan**: [plan.md](plan.md)
- **Verification**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
