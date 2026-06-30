---
title: "Tasks: Phase 1 — corpus research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "corpus research tasks"
  - "fan-out research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/001-corpus-research"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-1 tasks"
    next_safe_action: "Run setup tasks (prereqs + config)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — corpus research

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

- [x] T001 Confirm MiMo + Kimi opencode model ids (`sk-prompt-models/references/models/`)
- [x] T002 Confirm `~/.claude-account2` is authenticated for the Opus lineage
- [x] T003 Write `research/deep-research-fanout-config.json` with per-lineage `iterations` 20/15/8/7
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Smoke-test MiMo lineage at 1 iteration
- [x] T005 [P] Smoke-test Kimi lineage at 1 iteration
- [x] T006 Launch the four-lineage fan-out via `/deep:research`
- [x] T007 Merge lineages into `research/research.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify each lineage hit `maxIterationsReached` at its target count
- [x] T009 Verify `research/research.md` + findings registry exist with citations
- [x] T010 Summarize taxonomy + structural recommendation, then STOP for human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Per-lineage caps verified and research synthesis ready for review
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
