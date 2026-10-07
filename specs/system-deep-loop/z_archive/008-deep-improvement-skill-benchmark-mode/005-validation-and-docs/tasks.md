---
title: "Tasks: Phase 005 — Validation & docs (three-lane)"
description: "Reconstructed task list for the 005 docs and validation phase, derived from spec.md and git history. Task state was not recorded in those sources."
trigger_phrases:
  - "deep-improvement three-lane docs tasks"
  - "phase 005 validation docs tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 005 — Validation & docs (three-lane)

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

- [ ] T001 Confirm the Phase 004 Lane C build and Phase 003 rename landed (`../004-skill-benchmark-mode/`, `../003-skill-rename-deep-improvement/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Update `SKILL.md` to three lanes: WHEN-TO-USE table + smart-router intents/RESOURCE_MAP for `skill-benchmark` (`deep-improvement/SKILL.md`)
- [ ] T003 Add Lane C to `README.md` and the skill catalog/playbook/advisor labels (`deep-improvement/README.md`)
- [ ] T004 Reflect the Lane C command + skill name in `descriptions.json` + the skill-advisor graph (`system-skill-advisor/`)
- [ ] T005 Align cross-skill references with the rename + new lane (`sentinel`, root docs)
- [ ] T006 Run the hardening/deep-review gate over the new Lane C code; triage and fix findings
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the docs describe three lanes with no two-lane-only stragglers
- [ ] T008 Run the advisor rebuild + validate; confirm Lane C is discoverable
- [ ] T009 Run `validate.sh --strict` for the parent + all active children
- [ ] T010 Reconcile completion metadata across the parent spec, child docs, and continuity
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
