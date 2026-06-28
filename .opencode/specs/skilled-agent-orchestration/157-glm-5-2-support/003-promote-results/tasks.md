---
title: "Tasks: Phase 3: promote-results"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm-5.2 promote tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/003-promote-results"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Task list scaffolded; not started"
    next_safe_action: "Begin T001 after phase 2 verdict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/003-promote-results"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: promote-results

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

- [x] T001 Read the phase-2 verdict + per-framework leaderboard from `benchmarks/<run-label>/synthesis.md`
- [x] T002 Decide promote vs hold (clear WINNER → empirical; TIE/INCONCLUSIVE → keep default-unverified + record reason)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Update `glm-5.2.recommended_frameworks` (primary, preplanning_density, evidence, status) from the verdict (`sk-prompt-models/assets/model_profiles.json`)
- [x] T004 Rewrite §3 + §4 of `sk-prompt-models/references/models/glm-5.2.md` to cite the phase-2 run
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run card-sync guard to exit 0 and parse edited JSON (`check-prompt-quality-card-sync.sh .`)
- [x] T006 Run `validate.sh --strict` on parent + children to exit 0
- [x] T007 Reconcile parent phase map + child statuses + continuity blocks
- [x] T008 Write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Card-sync + strict validation green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
