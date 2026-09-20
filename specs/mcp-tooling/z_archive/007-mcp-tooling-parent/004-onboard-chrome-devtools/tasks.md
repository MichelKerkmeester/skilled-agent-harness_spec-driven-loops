---
title: "Tasks: Phase 4: onboard-chrome-devtools"
description: "Task list for the git mv of the mcp-chrome-devtools tree into the hub with internal self-path rewrites."
trigger_phrases:
  - "chrome-devtools onboarding tasks"
  - "mcp-chrome-devtools move tasks"
  - "phase 004 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/004-onboard-chrome-devtools"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Checked off onboarding tasks with evidence"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/004-onboard-chrome-devtools/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-onboard-chrome-devtools"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: onboard-chrome-devtools

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

- [x] T001 Confirm the hub skeleton and empty `mcp-chrome-devtools/` packet dir exist — hub skeleton landed in phase 003, verified STRICT-clean before this move started
- [x] T002 Inventory internal self-path references inside the tree before moving, both absolute and relative (`rg "\.opencode/skills/mcp-chrome-devtools/|\.\./mcp-chrome-devtools"`) — inventory taken before the `git mv`
- [x] T003 [P] Confirm no external referrer will be touched in this phase — external referrer sweep (`doctor_mcp_install.yaml`, advisor corpus) deferred to phase 006 as scoped
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv .opencode/skills/mcp-chrome-devtools` into `.opencode/skills/mcp-tooling/mcp-chrome-devtools` — `git status --short` shows 40 `R`/`RM` rename entries from the flat path to `mcp-tooling/mcp-chrome-devtools/`, zero plain add/delete pairs
- [x] T005 Rewrite internal absolute and relative self-paths in INSTALL_GUIDE, README, SKILL.md, scripts, and examples to the nested location — `rg "\.opencode/skills/mcp-chrome-devtools/|\.\./mcp-chrome-devtools" .opencode/skills/mcp-tooling/mcp-chrome-devtools` returns zero live self-path hits
- [x] T006 Confirm `version: 1.0.8.0` and the packet `changelog/` are intact, sparing historical changelog prose from blind path flips — `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:5` reads `version: 1.0.8.0`; `changelog/` carries all 5 pre-existing entries (v1.0.0.0 through v1.0.8.0)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Grep the moved tree for the old path; confirm zero live self-path hits — `rg -n "\.opencode/skills/mcp-chrome-devtools/" .opencode/skills/mcp-tooling/mcp-chrome-devtools` returns no matches
- [x] T008 Confirm `git status` shows renames, not deletes-plus-adds — 40 of 40 entries under the tree are `R`/`RM` rename status, 0 are plain `D`+`A` pairs
- [x] T009 Run phase-folder validation — `validate.sh .../004-onboard-chrome-devtools --strict` reports `Errors: 0  Warnings: 0`, `RESULT: PASSED`
- [x] T010 Resolve every rewritten relative link (`../mcp-*`, `../sk-*`) from its containing file and confirm the target exists on disk, not just that the old path string is grep-absent — no relative cross-skill links found inside the chrome-devtools tree; the sibling links found inside `mcp-figma/references/troubleshooting.md` (pointing at chrome-devtools) resolve correctly on disk
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Chrome-devtools resolves under the hub with corrected, disk-verified self-paths and preserved version
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
