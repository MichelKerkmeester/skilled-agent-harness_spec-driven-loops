---
title: "Tasks: Phase 1: model-registration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm-5.2"
  - "model registration tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/001-model-registration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All registration tasks complete and verified"
    next_safe_action: "Begin 002-framework-bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-support-001-model-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: model-registration

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

- [x] T001 Confirm the Z.AI Coding Plan provider is authed and capture its exact id — `zai-coding-plan` (`opencode providers list` + auth.json keys)
- [x] T002 Capture live GLM-5.2 facts — slug `zai-coding-plan/glm-5.2` confirmed via `opencode models zai-coding-plan`; context/output 1M/128K per Z.AI docs (models did not expose limits)
- [x] T003 Determine billing (subscription) + `--variant`↔reasoning_effort mapping recorded accepted-unverified (GLM native high/max)
- [x] T004 [P] Read the Adopting a New Provider checklist (`sk-prompt-models/references/pattern_index.md` §4)
- [x] T005 [P] Inventory existing GLM/Z.AI refs and locate the legacy glm-5.1 row (rg — note `-E` is `--encoding` in ripgrep; default regex used)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add `glm-5.2` entry + update registry description rotation line (`sk-prompt-models/assets/model_profiles.json`)
- [x] T007 Create the new prompt-craft profile (`sk-prompt-models/references/models/glm-5.2.md`) — CRAFT default-unverified, fallback TIDD-EC, avoid RACE; GLM dispatch quirks captured
- [x] T008 [P] Add `glm-5.2` ACTIVE row to `references/models/_index.md`
- [x] T009 Update SKILL.md: frontmatter, keywords, triggers, MODEL_ALIASES, §3 matrix row, ALWAYS active-model set (`sk-prompt-models/SKILL.md`)
- [x] T010 [P] Update pattern_index.md §3 ownership boundary line (`sk-prompt-models/references/pattern_index.md`)
- [x] T011 [P] Update routing graph metadata (`sk-prompt-models/graph-metadata.json` + `cli-opencode/graph-metadata.json`)
- [x] T012 Update cli-opencode SKILL.md: Keywords, Model Selection paragraph, login list (`cli-opencode/SKILL.md`)
- [x] T013 [P] Update cli-opencode cli_reference.md: provider table, variant table, login shape (`cli-opencode/references/cli_reference.md`)
- [x] T014 [P] Update cli-opencode prompt_quality_card.md: add glm-5.2 row, reconcile the legacy glm-5.1 row (`cli-opencode/assets/prompt_quality_card.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Live smoke dispatch returned "pong" at exit 0 (`opencode run --model zai-coding-plan/glm-5.2`)
- [x] T016 Card-sync guard exit 0 (`check-prompt-quality-card-sync.sh .`); all edited JSON parses clean
- [x] T017 Re-indexed advisor (`skill_advisor.py --force-refresh`); routing probe surfaces sk-prompt-models (0.95) + cli-opencode (0.94)
- [x] T018 Wrote implementation-summary.md and refreshed continuity frontmatter
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
