---
title: "Tasks: Phase 4: scoping-and-discovery"
description: "Pending tasks for planning the alignment scoping decision tree, lane resolution, non-interactive arg form, and the discover(scope)->artifacts contract."
trigger_phrases:
  - "deep-alignment scoping tasks"
  - "alignment discovery tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/004-scoping-and-discovery"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted task list, none executed yet"
    next_safe_action: "Start T001 once 003 gate approved"
    blockers:
      - "003-scaffold-mode-packet not yet executed"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scoping-and-discovery"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: scoping-and-discovery

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Read 003-scaffold-mode-packet's plan.md for the directory-skeleton shape.
- [ ] T002 [P] Re-read the locked pluggable adapter contract from 002-architecture-decision.
- [ ] T003 [P] Read `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` for the coverage-graph seeding shape.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- These tasks belong to a future execution pass, gated behind 003-scaffold-mode-packet execution. -->

- [ ] T004 [B] Author `deep-alignment/references/scoping_protocol.md` with the three-axis decision tree and lane-resolution algorithm.
- [ ] T005 [B] Author `deep-alignment/references/discover_contract.md` with the authority-agnostic `discover(scope)->artifacts` signature.
- [ ] T006 [B] Implement the interactive lane-resolution script.
- [ ] T007 [B] Design the lane-arg grammar (closing open ADR-011) and implement the non-interactive arg parser.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- These tasks belong to a future execution pass, gated behind 003-scaffold-mode-packet execution. -->

- [ ] T008 [B] Confirm a multi-authority single-run scoping session resolves N independent lanes.
- [ ] T009 [B] Confirm the non-interactive arg parser and the interactive question produce identical lane tuples for an equivalent scope.
- [ ] T010 [B] Confirm the `discover()` contract carries no authority-specific parameters.
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

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
