---
title: "Tasks: Onboarding and Root README"
description: "Dependency-ordered task ledger for planning the root README realignment and the install and onboarding guide for Pi Remote."
trigger_phrases:
  - "pi remote onboarding and root readme"
  - "pi mobile phase 14"
  - "onboarding and root readme"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/014-onboarding-and-root-readme"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 014 onboarding-and-root-readme spec set as Draft"
    next_safe_action: "Approved 014 plan, then begin 015 doc-quality-and-catalog drafting"
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

# Tasks: Onboarding and Root README

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

The deliverables are `Apps/Pi Mobile/README.md` and `Apps/Pi Mobile/docs/install-and-onboarding.md`. Unchecked rows remain planning-state work.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, owned paths, rollback, and the authoritative gate.
- [ ] T002 Read the current `README.md` and `docs/setup.md` and capture the verified command set.
- [ ] T003 Confirm the install-guide location decision and review both `sk-create-readme` templates.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Realign the root `README.md` to the general template shape.
- [ ] T005 Author `docs/install-and-onboarding.md` with the AI-first intro and Overview Core Principle.
- [ ] T006 Add the five folded phases with `phase_1_complete` through `phase_5_complete` checkpoints.
- [ ] T007 Add expected output for every validation command and STOP blocks after failing checkpoints.
- [ ] T008 Add the troubleshooting table and preserve operator-only labels.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run focused `sk-doc` validation and extraction and retain exact evidence.
- [ ] T010 Diff the guide commands against `docs/setup.md` and the root scripts.
- [ ] T011 Run the authoritative phase gate and the safe rollback or recovery exercise.
- [ ] T012 Reconcile checklist, current state, parent map, successor inputs, and scoped status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] The README and guide describe the same current state as the app.
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
