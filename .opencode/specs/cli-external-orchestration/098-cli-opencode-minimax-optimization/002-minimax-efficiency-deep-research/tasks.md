---
title: "Tasks: MiniMax 2.7 efficiency deep-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "minimax research tasks"
  - "deep-research loop tasks"
  - "minimax-2.7 task list"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-002 task list"
    next_safe_action: "Run the loop (T003)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-minimax-efficiency-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: minimax-efficiency-deep-research

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

- [x] T001 Confirm phase 001 merged (MiniMax provider present)
- [x] T002 Read cli-codex SKILL.md; confirm `gpt-5.5` + `high` + `fast` dispatch shape
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Launch `/deep:start-research-loop:auto` (`--spec-folder` this folder, `--executor=cli-codex --model=gpt-5.5 --reasoning-effort=high --service-tier=fast --max-iterations=10`)
- [x] T004 Monitor iterations to convergence or 10 (ran all 10; ratio 0.92 → 0.12)
- [x] T005 Synthesize `research.md` (17 sections) + `resource-map.md`
- [x] T006 Extract follow-on delta list (sk-prompt-models + cli-opencode edits)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify `deep-research-state.jsonl` records + stop reason (10 iteration records + synthesis_complete, maxIterationsReached)
- [x] T008 Verify `research.md` + `resource-map.md` exist and answer the in-scope questions
- [x] T009 Run `validate.sh --strict` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (10 iterations + synthesis + strict validate)
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

