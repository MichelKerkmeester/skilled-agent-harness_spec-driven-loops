---
title: "Tasks: Phase 3: scaffold-mode-packet"
description: "Independently re-verified (2026-07-11): Phase 1/2 tasks and T012/T013 confirmed done -- live files under .opencode/skills/system-deep-loop/deep-alignment/ exist and mode-registry.json/hub-router.json carry the alignment entries. T011 (advisor routing-registry drift guard) is blocked -- it fails 5/7 because deep-alignment is not wired into aliases.ts/skill_advisor.py."
trigger_phrases:
  - "deep-alignment scaffold tasks"
  - "alignment mode packet tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/003-scaffold-mode-packet"
    last_updated_at: "2026-07-11T12:57:42Z"
    last_updated_by: "claude"
    recent_action: "Re-verified T001-T013; T011 drift-guard fails 5/7, marked Blocked"
    next_safe_action: "Update advisor projection maps, rerun drift guard"
    blockers:
      - "T011 (routing-registry-drift-guard.vitest.ts) fails 5/7 -- see spec.md blockers for full evidence"
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/skills/system-deep-loop/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-mode-packet"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Whether wiring the advisor's TS/Python projection maps is this phase's own T011 responsibility or phase 009's advisor-cutover scope"
    answered_questions:
      - "T001-T010, T012, T013 confirmed complete by independent re-verification (2026-07-11)"
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

- [x] T001 Read `.opencode/skills/system-deep-loop/deep-review/SKILL.md` for the thin-contract shape. (Confirmed by re-verification: deep-alignment/SKILL.md's frontmatter fields and structure mirror deep-review's exactly.)
- [x] T002 Read `.opencode/skills/system-deep-loop/mode-registry.json` discriminator block and the `"review"` mode entry for the registry field shape. (Confirmed: the alignment entry carries every field the review entry carries.)
- [x] T003 [P] Read `.opencode/skills/system-deep-loop/hub-router.json` for router-signal and tie-break shape. (Confirmed: routerSignals.alignment mirrors the review block shape.)
- [x] T004 [P] Read `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` for the iteration-prompt renderer contract. (Not independently re-verified beyond the plan's citation; no separate artifact to check for this phase's scope.)
- [x] T005 Confirm 002-architecture-decision's locked decisions (Accepted, operator-approved 2026-07-11). (Confirmed via `spec.md` and `plan.md` Dependencies section.)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- 002-architecture-decision gate cleared 2026-07-11 (Accepted, operator-approved); executed and independently re-verified 2026-07-11. -->

- [x] T006 Author `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` from the plan.md §3 shape. (Confirmed on disk, 8243 bytes, frontmatter + body match the modeled shape.)
- [x] T007 Add the `"alignment"` mode entry to `.opencode/skills/system-deep-loop/mode-registry.json`. (Confirmed: valid JSON, all 11 discriminator/routing fields present, packet path resolves.)
- [x] T008 Add `routerSignals.alignment` and extend `tieBreak` in `.opencode/skills/system-deep-loop/hub-router.json`. (Confirmed: valid JSON, keys bidirectionally equal to registry workflowModes.)
- [x] T009 Create the `assets/`, `references/`, `changelog/` directory skeleton under `deep-alignment/`. (Confirmed: assets/.gitkeep, references/.gitkeep, behavior_benchmark/.gitkeep, changelog/v1.0.0.0.md all present.)
- [x] T010 Author `deep-alignment/changelog/v1.0.0.0.md` following the plain-H2 convention. (Confirmed present; minor structural variance from deep-review's v1.0.0.0.md noted but not blocking -- see implementation-summary.md.)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- 002-architecture-decision gate cleared 2026-07-11 (Accepted, operator-approved); independently re-verified 2026-07-11 -- T011 found failing. -->

- [B] T011 Run the mode-registry drift-guard test (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`) after the new entry is added. (RUN 2026-07-11: 5 of 7 sub-tests FAIL. `deep-alignment` is absent from `aliases.ts` `SKILL_ALIAS_GROUPS`/`DEEP_MODE_BY_CANONICAL` and `skill_advisor.py` `DEEP_ROUTING_MODE_BY_KEY`, even though the new entry declares `routingClass: "lexical"`. Blocked on wiring those maps or a routingClass downgrade decision -- see spec.md blockers.)
- [x] T012 Confirm `routerSignals` keys stay bidirectionally equal to registry `workflowMode` values. (Confirmed by direct computation: both 8-entry sets match exactly, and `tieBreak` matches too.)
- [x] T013 Confirm no adapter, command, or agent file was created in this phase's execution. (Confirmed: no `/deep:alignment` command file and no `deep-alignment` agent file exist anywhere under `.opencode/commands/`, `.opencode/agents/`, or `.claude/agents/`.)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T011 is `[B]` Blocked, not `[x]`)
- [ ] No `[B]` blocked tasks remaining (T011 is blocked)
- [x] Manual verification passed (independent re-verification ran for T001-T010, T012, T013; T011 ran and failed, correctly reported as blocked rather than passed)
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
