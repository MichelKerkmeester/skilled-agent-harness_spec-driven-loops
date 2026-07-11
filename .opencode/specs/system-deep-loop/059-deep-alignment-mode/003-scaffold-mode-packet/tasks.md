---
title: "Tasks: Phase 3: scaffold-mode-packet"
description: "Pending tasks for planning the deep-alignment mode-packet skeleton. No live file under .opencode/skills/system-deep-loop/deep-alignment/ is created by this phase."
trigger_phrases:
  - "deep-alignment scaffold tasks"
  - "alignment mode packet tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/003-scaffold-mode-packet"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted task list, none executed yet"
    next_safe_action: "Start T001 once 002 gate approved"
    blockers:
      - "002-architecture-decision not yet approved"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-mode-packet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: scaffold-mode-packet

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

- [ ] T001 Read `.opencode/skills/system-deep-loop/deep-review/SKILL.md` for the thin-contract shape.
- [ ] T002 Read `.opencode/skills/system-deep-loop/mode-registry.json` discriminator block and the `"review"` mode entry for the registry field shape.
- [ ] T003 [P] Read `.opencode/skills/system-deep-loop/hub-router.json` for router-signal and tie-break shape.
- [ ] T004 [P] Read `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` for the iteration-prompt renderer contract.
- [ ] T005 [B] Confirm 002-architecture-decision's locked decisions (blocked until 002 is approved).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- These tasks belong to a future execution pass, gated behind 002-architecture-decision approval. -->

- [ ] T006 [B] Author `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` from the plan.md §3 shape.
- [ ] T007 [B] Add the `"alignment"` mode entry to `.opencode/skills/system-deep-loop/mode-registry.json`.
- [ ] T008 [B] Add `routerSignals.alignment` and extend `tieBreak` in `.opencode/skills/system-deep-loop/hub-router.json`.
- [ ] T009 [B] Create the `assets/`, `references/`, `changelog/` directory skeleton under `deep-alignment/`.
- [ ] T010 [B] Author `deep-alignment/changelog/v1.0.0.0.md` following the plain-H2 convention.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- These tasks belong to a future execution pass, gated behind 002-architecture-decision approval. -->

- [ ] T011 [B] Run the mode-registry drift-guard test (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`) after the new entry is added.
- [ ] T012 [B] Confirm `routerSignals` keys stay bidirectionally equal to registry `workflowMode` values.
- [ ] T013 [B] Confirm no adapter, command, or agent file was created in this phase's execution.
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
