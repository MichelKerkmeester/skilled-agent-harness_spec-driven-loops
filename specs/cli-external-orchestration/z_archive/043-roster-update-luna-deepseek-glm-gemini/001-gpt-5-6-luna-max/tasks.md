---
title: "Tasks: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "luna max roster tasks"
  - "luna max phase 001 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/001-gpt-5-6-luna-max"
    last_updated_at: "2026-08-15T13:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored task list; all implementation tasks complete"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-roster-update-luna-deepseek-glm-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: GPT-5.6 Luna Max Dispatch Support (cli-cursor + cli-devin)

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

- [x] T001 List-verify the Luna Max ids against live `cursor-agent --list-models` / `devin models list` (2026-08-14)
- [x] T002 Map each request phrase to a real id and locate the two enforcement points + their tests [evidence: `executor-config.ts + fanout-run.cjs` located]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `executor-config.ts`: add 2 cursor ids to `CURSOR_SUPPORTED_MODELS` (sorted) + honest comment
- [x] T004 `executor-config.ts`: add 2 devin luna uids to `DEVIN_SUPPORTED_MODELS` (sorted) + comment (family list gains GPT-5.6)
- [x] T005 [P] `fanout-run.cjs`: mirror the 2 cursor ids + 2 devin luna uids in both Sets
- [x] T006 [P] Update cursor/devin vitest fixtures (executor-config + fanout-run)
- [x] T007 Two `providers-and-models.md` rosters: Luna rows, counts, family lists, dated notes, version bumps
- [x] T008 Honesty sweep: cursor count claims; devin family list + GPT-5.6; hub smart-routing [evidence: `smart-routing.md` + roster counts updated]
- [x] T009 Per-mode changelogs + SKILL.md version bumps [evidence: `changelog v1.4.0.0` + version bumps]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run deep-loop vitest (executor-config, fanout-run, combo-matrix) → 190 passed
- [x] T011 Residual-count grep sweep → clean [evidence: `residual-grep-sweep` clean]
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
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
