---
title: "Tasks: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gemini 3.7 flash high tasks"
  - "gemini phase 004 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster/004-gemini-3-7-flash-high"
    last_updated_at: "2026-08-15T12:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored task list; all implementation tasks complete"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)

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

- [x] T001 List-verify both ids against live `cursor-agent --list-models` / `devin models list` (2026-08-15) → `evidence/live-listings.txt`
- [x] T002 Dispatch-test `gemini-3.7-flash-high` on cli-cursor (probe, exit 0, marker echoed) → `evidence/cursor-dispatch.out`
- [x] T003 Dispatch-test `gemini-3-7-flash-high` on cli-devin (probe, exit 0, marker echoed) → `evidence/devin-dispatch.out`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `executor-config.ts`: add `gemini-3.7-flash-high` to `CURSOR_SUPPORTED_MODELS` (sorted) + honest dispatch-tested comment
- [x] T005 `executor-config.ts`: add `gemini-3-7-flash-high` to `DEVIN_SUPPORTED_MODELS` (sorted) + comment (5→6 families)
- [x] T006 [P] `fanout-run.cjs`: mirror both ids in `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS`
- [x] T007 [P] Update vitest fixtures: executor-config (21-id assertion + negative), fanout-run (+1 each + negatives)
- [x] T008 Two `providers-and-models.md` rosters: rows, counts, family lists, out-of-scope wording, dated notes
- [x] T009 Honesty sweep: cursor 20→21 across SKILL/README/references/assets/playbook; devin 5→6 families; hub smart-routing [evidence: `rg` sweep across `SKILL.md`/`README`/references — clean]
- [x] T010 Changelogs: cli-cursor v1.4.1.0, cli-devin v1.4.1.0, system-deep-loop v2.2.1.0, hub v1.4.1.0 + SKILL.md version bumps [evidence: `changelogs v1.4.1.0` + version bumps]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run deep-loop vitest (executor-config, fanout-run, combo-matrix) → 190 passed
- [x] T012 Residual grep sweep (`20-id`/`20 ids`/`five families`/`Claude / Gemini / Kimi`) → clean
- [x] T013 Regenerate description.json + graph-metadata.json; `validate.sh --strict` on phase + `--recursive --strict` on parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Deep-loop vitest + strict validation passed
- [x] Dispatch receipts on file for both ids
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
