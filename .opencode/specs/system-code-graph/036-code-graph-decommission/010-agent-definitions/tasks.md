---
title: "Tasks: Phase 10: agent-definitions"
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/010-agent-definitions"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-010-agent-definitions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: agent-definitions

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

- [x] T001 Enumerate the eight agents and confirm the four regular-file mirrors (`.cursor` symlinked)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Remove graph tool grants from all eight agents in `.opencode/agents/*.md`
- [x] T003 Mirror the change in `.claude/agents/*.md`
- [x] T004 Mirror the change in `.codex/agents/*.toml`
- [x] T005 Mirror the change in `.pi/agents/*.md` (8 files carry grants + daemon-fallback prose)
- [x] T006 Rewrite search-routing prose to name the replacement path — evidence: `scratch/closeout-facts.md`
- [x] T007 Reduce wedged-daemon fallback prose to the spec-memory daemon only — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Markdown frontmatter and TOML parse cleanly — evidence: `scratch/closeout-facts.md`
- [x] T009 Mirror parity: equivalent tool grants across the four runtimes — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (parse + parity diff)
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

