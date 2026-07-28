---
title: "Tasks: Phase 4: plugin-and-hook-removal"
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/004-plugin-and-hook-removal"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-004-plugin-and-hook-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: plugin-and-hook-removal

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

- [x] T001 Enumerate plugins, hook manifests, and lifecycle scripts touching the skill folder — evidence: `scratch/closeout-facts.md`
- [x] T002 Identify the Cursor hook housed inside `system-spec-kit` (outside the other three)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete `mk-code-graph.js` + `mk-code-graph-freshness.js` + their tests
- [x] T004 Remove freshness hook from `.codex/hooks.json` and `.devin/hooks.v1.json`
- [x] T005 Strip the Cursor chained hook inside `system-spec-kit`
- [x] T006 Remove post-commit database invalidation — evidence: `scratch/closeout-facts.md`
- [x] T007 Remove daemon match patterns from `session-cleanup.sh` and `orphan-mcp-sweeper.sh`
- [x] T008 Clean worktree copy/exclude rules in `worktree-session.sh`
- [x] T009 Delete the `.code-graph-freshness-state` directory
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Session-cleanup test repointed at a surviving launcher (13/13 green)
- [x] T011 Hook manifests parse and omit the entry; reapers match nothing — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (tests + manifest parse)
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

