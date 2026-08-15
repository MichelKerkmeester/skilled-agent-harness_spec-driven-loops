---
title: "Tasks: Code README Coverage"
description: "Dependency-ordered task ledger for planning and implementing code-folder READMEs across the Pi Remote monorepo."
trigger_phrases:
  - "pi remote code readme coverage"
  - "pi mobile phase 10"
  - "code readme coverage"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/010-code-readme-coverage"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Scoped six-phase docs-and-standards uplift; authored 010 spec set as Draft"
    next_safe_action: "Approved 010 plan, then begin 011 architecture-reference drafting"
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

# Tasks: Code README Coverage

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

The planned README targets live under `Apps/Pi Mobile/`. Unchecked rows remain planning-state work and do not imply the deliverables exist.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, the `Apps/Pi Mobile/` tree, workspace script names, owned paths, and the authoritative gate.
- [ ] T002 Review the `sk-create-readme` code-folder template sections and the four existing READMEs.
- [ ] T003 Freeze the phase 014 root-README boundary, the flat-folder branch rule, and the rollback path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Confirm the planned README inventory against the live repository paths.
- [ ] T005 [P] Author protocol package READMEs (`packages/pi-rpc-protocol/`, `src/`, `tests/`).
- [ ] T006 [P] Author relay package READMEs (`apps/pi-remote-relay/`, `migrations/`, `src/`, each `src/*` module, `scripts/`, `tests/`).
- [ ] T007 [P] Author web package READMEs (`apps/pi-remote-web/`, `src/`, `public/`, `tests/`).
- [ ] T008 [P] Author extension READMEs and realign `extensions/pi-remote-approval/README.md` (`src/`, `tests/`).
- [ ] T009 [P] Realign `deploy/README.md` and `deploy/containment/README.md`; author `release/`, `scripts/`, and `tests/` READMEs.
- [ ] T010 Run `audit_readmes.py` and fix or report missing, warning, and blocking findings.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run focused template, link, and command checks and retain exact evidence.
- [ ] T012 Run the authoritative phase gate and the safe rollback or recovery exercise.
- [ ] T013 Reconcile checklist, current state, parent map, successor inputs, and scoped status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] The phase 014 root-README boundary and dependent phases remain consistent.
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
