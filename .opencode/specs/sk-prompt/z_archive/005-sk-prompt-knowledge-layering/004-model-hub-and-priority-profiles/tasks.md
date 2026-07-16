---
title: "Tasks: Phase 4: model-hub-and-priority-profiles"
description: "Task tracking for maturing sk-prompt-models into the per-model prompt-craft content hub: SKILL.md rewrite, _index.md creation, and two priority profiles (minimax-m3.md + mimo-v2.5-pro.md)."
trigger_phrases:
  - "tasks"
  - "model hub tasks"
  - "priority profile tasks"
importance_tier: "normal"
contextType: "spec-completion"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/004-model-hub-and-priority-profiles"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "agent"
    recent_action: "All tasks marked complete"
    next_safe_action: "Phase 005: backfill remaining profiles"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt-models/references/models/_index.md"
      - ".opencode/skills/sk-prompt-models/references/models/minimax-m3.md"
      - ".opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md"
    session_dedup:
      fingerprint: "sha256:686579a94b9415bf285b3224835edde015624d637792d30754aa1a1f6d9804c8"
      session_id: "phase-004-completion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: model-hub-and-priority-profiles

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

- [x] T001 Audit existing SKILL.md to identify what to keep vs rewrite (`.opencode/skills/sk-prompt-models/SKILL.md`)
- [x] T002 Verify phase 003 model-profiles.json data is present for minimax-m3 and mimo-v2.5-pro (`sk-prompt/assets/model-profiles.json`)
- [x] T003 [P] Confirm 6-section profile template (Identity, Framework, Evidence, Template Snippet, Dispatch Gotchas, See Also) with the phase spec
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite SKILL.md: retitle to "Small-Model Prompt-Craft Hub", flip ALWAYS/NEVER rules (prompt-craft here; executor mechanics in cli-*), add dispatch matrix, add adoption protocol, bump version 0.1.0 -> 0.2.0, keep at <= 200 LOC (`.opencode/skills/sk-prompt-models/SKILL.md`)
- [x] T005 Create `references/models/_index.md` with 8 active-model rows (minimax-m3, mimo-v2.5-pro, minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1); each row has framework primary/fallback, pre-planning density, and status (`references/models/_index.md`)
- [x] T006 Author `references/models/minimax-m3.md`: full 6-section profile following fixed template; TIDD-EC primary / RCAF fallback / dense pre-planning; status: carried; source benchmark 120/003; tuned TIDD-EC scaffold; dispatch gotchas including no `--agent` and `</dev/null` non-TTY rule (`references/models/minimax-m3.md`)
- [x] T007 Author `references/models/mimo-v2.5-pro.md`: full 6-section profile following fixed template; COSTAR primary / RACE fallback / lean pre-planning; status: empirical; benchmark 126/004 evidence (10 real runs, COSTAR 1.0000, RACE 0.9934, TIDD-EC last at ~2.4x); TIDD-EC marked avoid; tuned COSTAR and RACE fallback scaffolds; dispatch gotchas including `--variant high` required and `</dev/null` rule (`references/models/mimo-v2.5-pro.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify SKILL.md LOC at <= 200 (`wc -l SKILL.md` = 199)
- [x] T009 Verify SKILL.md version field reads 0.2.0 and title reads "Small-Model Prompt-Craft Hub"
- [x] T010 Verify both profiles contain all 6 sections and do not restate executor mechanics; verify _index.md has 8 rows; verify each profile cites model-profiles.json as data source
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
