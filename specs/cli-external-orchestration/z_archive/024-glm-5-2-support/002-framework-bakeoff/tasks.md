---
title: "Tasks: Phase 2: framework-bakeoff"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm-5.2 framework bakeoff tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/024-glm-5-2-support/002-framework-bakeoff"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Task list scaffolded; not started"
    next_safe_action: "Begin T001 after phase 1 ships"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: framework-bakeoff

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

- [x] T001 Re-verify the live glm-5.2 slug (`opencode models <provider>`)
- [x] T002 Pick the next free benchmark run-label (`ls .opencode/skills/sk-prompt-models/benchmarks/`)
- [x] T003 Clone `framework-bakeoff.json` → `glm-5.2-frameworks.json`, retarget model + frameworks (incl. `craft`) + strict validator fixtures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `/deep:model-benchmark:auto <profile> --spec-folder=<002 folder> --run-label=<next>-glm-5.2-prompt-framework --scorer=5dim --grader=llm --model=openai/gpt-5.5 --iterations=<n>`
- [x] T005 Confirm the correctness gate did not silently saturate (else flag phase-4 contingency)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Record WINNER/TIE/INCONCLUSIVE verdict + per-framework leaderboard in `synthesis.md`
- [x] T007 If saturated → document the hand-off to contingency phase 004
- [x] T008 Write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verdict recorded for phase 3
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
