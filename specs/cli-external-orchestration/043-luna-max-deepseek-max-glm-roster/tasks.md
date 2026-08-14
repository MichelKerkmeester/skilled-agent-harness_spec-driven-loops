---
title: "Tasks: GPT-5.6 Luna Max, DeepSeek Max & GLM 5.3 Roster Additions"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "luna max roster tasks"
  - "deepseek max glm 5.3 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster"
    last_updated_at: "2026-08-14T08:29:53Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task list; all implementation tasks complete"
    next_safe_action: "Replace continuity placeholders on next save"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-luna-max-deepseek-max-glm-roster"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: GPT-5.6 Luna Max, DeepSeek Max & GLM 5.3 Roster Additions

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

- [x] T001 List-verify every id against live `cursor-agent --list-models` / `devin models list` / `opencode models opencode-go` (2026-08-14)
- [x] T002 Map each request phrase to a real id and locate the two enforcement points + their tests
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `executor-config.ts`: add 2 cursor ids to `CURSOR_SUPPORTED_MODELS` (sorted) + honest comment
- [x] T004 `executor-config.ts`: add 4 devin uids to `DEVIN_SUPPORTED_MODELS` (sorted) + comment (4→5 families)
- [x] T005 [P] `fanout-run.cjs`: mirror the 2 cursor ids + 4 devin uids in both Sets
- [x] T006 [P] Update cursor/devin vitest fixtures (executor-config + fanout-run)
- [x] T007 Three `providers-and-models.md` rosters: rows, counts, family lists, dated notes, version bumps
- [x] T008 Honesty sweep: cursor 18→20 across SKILL/README/references/assets/playbook; devin 4→5 families; hub smart-routing
- [x] T009 Per-mode changelogs + SKILL.md version bumps
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run deep-loop vitest (executor-config, fanout-run, combo-matrix) → 190 passed
- [x] T011 Residual-count grep sweep → clean
- [x] T012 Regenerate description.json + graph-metadata.json; `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Deep-loop vitest + strict validation passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
