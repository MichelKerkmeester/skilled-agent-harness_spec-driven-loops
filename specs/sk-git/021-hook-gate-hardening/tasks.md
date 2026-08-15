---
title: "Tasks: git hook gate hardening"
description: "Task list for gate auditing, autosync-aware repair and diagnostics, documentation, and non-Git verification."
trigger_phrases:
  - "git hook gate hardening"
  - "autosync gate rejection"
  - "skill root metadata self heal"
  - "durable pre-push failure log"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-git/021-hook-gate-hardening"
    last_updated_at: "2026-08-15T13:52:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed runtime, documentation, and behavioral tasks"
    next_safe_action: "Confirm strict packet validation remains green"
---
# Tasks: git hook gate hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all named hooks, shared libraries, publisher code, metadata checker, and reference docs [30m] [Evidence: `pre-push`, `pre-commit`, `post-commit`, and `git-sync.sh` reads]
- [x] T002 Create the new Level 2 phase packet from the adjacent sibling and reset it to Planned [15m] [Evidence: `specs/sk-git/021-hook-gate-hardening`]
- [x] T003 Inventory each gate's autosync execution, exemption, diagnostics, and silent-block risk [20m] [Evidence: gate map in `continuous-integration.md`]
- [x] T004 Define non-Git command-stub simulations for skill metadata, mass deletion, and clean publication [20m] [Evidence: `bash` function stubs exercised real hook and publisher scripts]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add exact live-branch autosync detection and naming coverage (`pre-push`) [15m] [Evidence: first-publication naming simulation exits 0]
- [x] T006 Keep unsafe post-commit regeneration blocked and emit the exact repair command (`pre-push`) [20m] [Evidence: skill-root simulation]
- [x] T007 Capture and classify pre-push stderr (`git-sync.sh`) [25m] [Evidence: real hook diagnostics replayed by publisher]
- [x] T008 Replay loud diagnostics and append gate id plus repair guidance to the durable log (`git-sync.sh`) [20m] [Evidence: `blocked gate=... fix=...` records]
- [x] T009 Harden additional audited silent autosync blocks without weakening safety [20m] [Evidence: `pre-commit` and `post-commit` concern-local control flow]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Document the full gate map and autosync behavior (`continuous-integration.md`, `remote-branch-policy.md`) [25m] [Evidence: lifecycle gate table and exception policy]
- [x] T011 Run `bash -n` on every modified shell script [10m] [Evidence: five exit-0 checks]
- [x] T012 Simulate a skill-root block or repair and capture terminal plus durable-log evidence [20m] [Evidence: loud classified output and `gate=skill-root-metadata`]
- [x] T013 Simulate a mass-deletion block and capture terminal plus durable-log evidence [15m] [Evidence: 101-deletion block and `gate=mass-deletion`]
- [x] T014 Simulate a clean autosync publication and capture success evidence [10m] [Evidence: empty quiet output and `published` log record]
- [x] T015 Generate packet metadata and run strict validation to zero warnings and errors [15m] [Evidence: `validate.sh --strict` reported Errors 0 and Warnings 0]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 and P1 tasks have direct command or file evidence.
- [x] No true safety gate has been weakened or bypassed.
- [x] The final audit table accounts for every gate.
- [x] Strict packet validation reports zero errors and zero warnings.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
