---
title: "Tasks: Phase 13: skill-deletion-and-daemon-reap"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/013-skill-deletion-and-daemon-reap"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-013-skill-deletion-and-daemon-reap"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: skill-deletion-and-daemon-reap

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

- [x] T001 Confirm phases 003-012 complete and verified before this phase — evidence: `scratch/closeout-facts.md`
- [x] T002 Confirm the repository is quiet (no concurrent session mid-write) — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Reap the running daemon process (no `mk-code-index` process survives)
- [x] T004 Remove the `/tmp/mk-code-index` IPC socket and its temporary directory
- [x] T005 Confirm the skill directory is absent from the working tree (concurrent session removed it) — evidence: `scratch/closeout-facts.md`
- [x] T006 Confirm the skill directory is absent from the git index (`git ls-files` clean)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Process check finds no `mk-code-index` process
- [x] T008 Socket check finds no `/tmp/mk-code-index` socket
- [x] T009 `git ls-files` shows 0 tracked files under the old skill path
- [x] T010 Config sweep finds no `mk_code_index` in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.pi/mcp.json`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (process + socket + tree + config sweep)
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
