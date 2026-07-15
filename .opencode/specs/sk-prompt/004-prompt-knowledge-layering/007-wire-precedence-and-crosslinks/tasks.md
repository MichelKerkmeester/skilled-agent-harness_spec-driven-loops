---
title: "Tasks: Phase 7 — Wire precedence + crosslinks"
description: "Task tracking for inserting the 3-tier prompt-composition precedence block into all 5 cli-* SKILL.md files, reconciling the cli-devin mandate, refreshing the canonical card, and repointing pattern-index.md."
trigger_phrases:
  - "wire precedence tasks"
  - "crosslinks tasks"
  - "cli-* precedence tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/007-wire-precedence-and-crosslinks"
    last_updated_at: "2026-06-02T18:04:15Z"
    last_updated_by: "agent"
    recent_action: "All tasks completed"
    next_safe_action: "Proceed to phase 008-validate-sweep-changelog-reindex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:38fe68bc403651b05e50bebfeb0c4b0a661aede11c5927a95189818c2d58772d"
      session_id: "007-wire-precedence-and-crosslinks-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7 — Wire precedence + crosslinks

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

- [x] T001 Read all 5 cli-* SKILL.md files to identify existing composition guidance and insertion points
- [x] T002 Read cli-devin/references/prompt_templates.md to understand the bespoke mandate scope
- [x] T003 [P] Read sk-prompt-models SKILL.md and pattern-index.md to locate Mirror Sync section and hub-profile row targets
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Insert identical 3-tier precedence block into cli-devin/SKILL.md and reconcile the bespoke compose mandate
- [x] T005 Insert identical 3-tier precedence block into cli-opencode/SKILL.md and update ownership cell description to craft-vs-mechanics
- [x] T006 [P] Insert identical 3-tier precedence block into cli-claude-code/SKILL.md
- [x] T007 [P] Insert identical 3-tier precedence block into cli-codex/SKILL.md
- [x] T008 [P] Insert identical 3-tier precedence block into cli-gemini/SKILL.md
- [x] T009 Reconcile cli-devin/references/prompt_templates.md mandate to honor swe-1.6 profile + 3-tier rule
- [x] T010 Replace stale Mirror Sync section in sk-prompt-models/SKILL.md with duplication-guard description
- [x] T011 Repoint pattern-index.md MiniMax and MiMo rows to hub profiles; update cli-opencode ownership cell
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Read each cli-* SKILL.md after edit to confirm the 3-tier block is present and textually consistent
- [x] T013 Confirm sk-prompt-models SKILL.md no longer contains Mirror Sync section
- [x] T014 Confirm pattern-index.md rows reference hub profile paths correctly
- [x] T015 Run validate.sh --strict on the 007 spec folder and confirm exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
