---
title: "Tasks: Phase 3: scaffold-hub"
description: "Task list for the additive-only mcp-tooling hub skeleton scaffold."
trigger_phrases:
  - "mcp-tooling hub scaffold tasks"
  - "additive hub skeleton tasks"
  - "phase 003 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Checked off hub-scaffold tasks with evidence"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/003-scaffold-hub/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-hub"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: scaffold-hub

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

- [x] T001 Confirm the phase 002 frozen target is approved before scaffolding — decision record `002-architecture-decision/decision-record.md` accepted before scaffold started
- [x] T002 Create `.opencode/skills/mcp-tooling/` and empty packet dirs `mcp-chrome-devtools/`, `mcp-click-up/`, `mcp-figma/` — confirmed via `ls .opencode/skills/mcp-tooling/` (14 entries, includes all three packet dirs)
- [x] T003 [P] Confirm no `git mv` will run in this phase (additive-only guarantee) — scaffold phase created only new `mcp-tooling/` root files; the three source trees moved later in phases 004-005, not here
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `mode-registry.json` from the phase 002 target (three modes, correct `packetKind`, transport-axis extension listing `mcp-figma`) — `.opencode/skills/mcp-tooling/mode-registry.json` has 3 `modes[]` entries (mcp-chrome-devtools/mcp-click-up workflow, mcp-figma transport) plus `extensions.transport-axis`
- [x] T005 Create `hub-router.json` from the phase 002 target (base three outcomes, `defaultMode: "mcp-chrome-devtools"`) — confirmed via `parent-skill-check.cjs` checks 5g/5h: "base router outcomes present" and "routerPolicy.defaultMode mcp-chrome-devtools is a registered mode"
- [x] T006 Create the thin routing `SKILL.md` (version 1.0.0.0, family mcp) and hub `description.json` — `.opencode/skills/mcp-tooling/SKILL.md` frontmatter carries `version: 1.0.0.0` and `metadata.family: mcp`; `description.json` present
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0`; confirm structural checks pass (empty-packet warnings acceptable) — superseded by a later full-STRICT pass: `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/mcp-tooling` now reports "OK: parent-skill-check — all hard invariants passed, 0 warnings"
- [x] T008 Confirm the three source bridge trees are byte-unchanged via `git status` — true at this phase's own completion boundary, before phase 004 began the first `git mv`
- [x] T009 Run phase-folder validation — `validate.sh .../003-scaffold-hub --strict` reports `Errors: 0  Warnings: 0`, `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Hub skeleton matches the phase 002 frozen target with zero content moved
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
