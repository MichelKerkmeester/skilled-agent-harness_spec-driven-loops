---
title: "Tasks: DeepSeek V4 Max Tier Dispatch Support (cli-devin)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deepseek max devin tasks"
  - "deepseek max phase 002 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/002-deepseek-v4-max"
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
# Tasks: DeepSeek V4 Max Tier Dispatch Support (cli-devin)

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

- [x] T001 List-verify the max-tier uids against live `devin models list` (2026-08-14)
- [x] T002 Confirm tier scope with operator (RESOLVED: max tier only) [evidence: `devin models list` tier scope confirmed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `executor-config.ts`: add 2 devin uids to `DEVIN_SUPPORTED_MODELS` (sorted) + honest comment
- [x] T004 [P] `fanout-run.cjs`: mirror the 2 uids in `DEVIN_ALLOWED_MODELS`
- [x] T005 [P] Update devin vitest fixtures (fanout-run allowlist)
- [x] T006 `providers-and-models.md` (devin): 2 max-tier rows + dated note + family sweep
- [x] T007 Changelog v1.4.0.0 + SKILL.md version bump [evidence: `changelog v1.4.0.0` + version bump]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run deep-loop vitest (executor-config, fanout-run, combo-matrix) → 190 passed
- [x] T009 Residual grep sweep → clean [evidence: `residual-grep-sweep` clean]
- [x] T010 Regenerate description.json + graph-metadata.json; `validate.sh --strict`
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
