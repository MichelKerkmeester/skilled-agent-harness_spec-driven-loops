---
title: "Tasks: Phase 3: land-recommended-frameworks-data [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "recommended_frameworks tasks"
  - "framework data tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/003-land-recommended-frameworks-data"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "agent"
    recent_action: "Populate completion docs"
    next_safe_action: "Proceed to Phase 4 (004-model-hub-and-priority-profiles)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt/references/model-profiles.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "complete-003-land-recommended-frameworks-data"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: land-recommended-frameworks-data

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

- [x] T001 Review existing model-profiles.json schema and verify Phase 2 substrate is in place (`.opencode/skills/sk-prompt/assets/model-profiles.json`)
- [x] T002 Collect empirical framework assignments from 120 and 126 benchmark sessions for minimax and mimo models
- [x] T003 [P] Confirm the six sub-fields of the `recommended_frameworks` object: primary, fallback, avoid, preplanning_density, evidence, profile_ref, status
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `recommended_frameworks` to minimax-m3 entry: primary=tidd-ec, preplanning_density=dense, status=empirical (`.opencode/skills/sk-prompt/assets/model-profiles.json`)
- [x] T005 Add `recommended_frameworks` to minimax-2.7 entry: primary=tidd-ec, status=empirical (`.opencode/skills/sk-prompt/assets/model-profiles.json`)
- [x] T006 Add `recommended_frameworks` to mimo-v2.5-pro entry: primary=costar+lean, fallback=race, avoid=[tidd-ec, cidi], status=empirical (`.opencode/skills/sk-prompt/assets/model-profiles.json`)
- [x] T007 Add `recommended_frameworks` to swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1 entries: primary=rcaf, status=default-unverified (`.opencode/skills/sk-prompt/assets/model-profiles.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `jq empty` on model-profiles.json to confirm valid JSON (exit 0)
- [x] T009 Verify all 8 active model entries carry the `recommended_frameworks` field via jq count query
- [x] T010 Rebuild model-profiles.md: fix stale model count to 10, add recommended_frameworks schema section, document Architecture-A data/prose split (`.opencode/skills/sk-prompt/references/model-profiles.md`)
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
