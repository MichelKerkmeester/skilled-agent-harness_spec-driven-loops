---
title: "Tasks: MiniMax Token Plan default provider [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "minimax token plan tasks"
  - "minimax coding plan task list"
  - "tasks"
  - "name"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/004-minimax-token-plan-provider"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-004 task breakdown"
    next_safe_action: "Execute registry edit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-minimax-token-plan-provider"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: MiniMax Token Plan default provider

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm live provider/model ids from the install (memory: minimax-model-id-drift → `minimax-coding-plan`, `MiniMax-M2.7-highspeed`)
- [x] T002 Re-read the existing `minimax-2.7` registry entry + `deepseek-v4-pro` dual-executor shape (`sk-prompt/assets/model-profiles.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Registry: add `minimax-m3` (token-plan default, `fallback_target: minimax-2.7`), revise `minimax-2.7` to dual executor, update description, bump version (`sk-prompt/assets/model-profiles.json`)
- [x] T004 [P] cli_reference.md §4 pre-flight (detect `minimax-coding-plan` + `minimax`) + setup + `--agent` caveat (`cli-opencode/references/cli_reference.md`)
- [x] T005 [P] cli_reference.md §5 model rows + `--variant` matrix (`cli-opencode/references/cli_reference.md`)
- [x] T006 SKILL.md auth options + pre-flight tree + login template + model selection + override example (`cli-opencode/SKILL.md`)
- [x] T007 [P] cli-opencode assets: prompt_templates.md MiniMax contract + prompt_quality_card.md (`cli-opencode/assets/`)
- [x] T008 [P] cli-opencode graph-metadata.json trigger phrases (`cli-opencode/graph-metadata.json`)
- [x] T009 sk-prompt-models: SKILL.md + description.json + pattern-index.md + graph-metadata.json (`sk-prompt-models/`)
- [x] T010 [P] sk-prompt/assets/cli_prompt_quality_card.md MiniMax alignment (`sk-prompt/assets/cli_prompt_quality_card.md`)
- [x] T015 [Fix 2] Update 003-benchmark `dispatch-model.cjs` fallback default + `executor-config.vitest.ts` fixture to the token-plan id (`deep-improvement/`, `deep-loop-runtime/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 `jq` validate all touched JSON (model-profiles + both graph-metadata + description.json)
- [x] T012 `rg` confirm Token Plan default present; no stale `minimax/MiniMax-M2.7` in live-dispatch examples (changelogs excepted)
- [x] T013 `validate.sh --strict` on this folder passes (Errors 0, Warnings 0)
- [x] T014 advisor re-index so new triggers route (advisor_rebuild gen 4791→4792)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `model-profiles.json` valid JSON and strict validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines) — Level 2 task tracking
-->
