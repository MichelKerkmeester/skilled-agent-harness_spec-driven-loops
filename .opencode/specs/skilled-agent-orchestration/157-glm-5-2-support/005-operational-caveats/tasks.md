---
title: "Tasks: Phase 5: operational-caveats (contingency)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm-5.2 operational caveats tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/005-operational-caveats"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Contingency task list scaffolded; not started"
    next_safe_action: "Execute when a GLM-5.2 gotcha is observed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/005-operational-caveats"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: operational-caveats (contingency)

<!-- SPECKIT_LEVEL: 1 -->

> **CONTINGENCY** — run when a real GLM-5.2 gotcha is observed.

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

- [x] T001 Confirm a real GLM-5.2 dispatch gotcha + its mitigation (the trigger; date + sample noted)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the confirmed gotcha + mitigation to `glm-5.2.md` (§2/§5/§6) (`sk-prompt-small-model/references/models/glm-5.2.md`)
- [x] T003 Add the gotcha to `model_profiles.json` weaknesses (`sk-prompt-small-model/assets/model_profiles.json`)
- [x] T004 Add the brief caveat to the GLM line in `cli-opencode/SKILL.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run card-sync guard to exit 0; parse `model_profiles.json`
- [x] T006 Write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Caveat documented as dated observation; card-sync green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
