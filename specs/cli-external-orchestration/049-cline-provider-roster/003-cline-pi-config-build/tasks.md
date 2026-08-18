---
title: "Tasks: Wire the Cline provider into cli pi by config"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline pi config tasks"
  - "pi cline-pass tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/003-cline-pi-config-build"
    last_updated_at: "2026-08-18T13:09:28Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Wire the Cline provider into cli pi by config

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

- [x] T001 Confirm `.pi/models.json` + `.pi/settings.json` clean post-merge (`git status .pi/`)
- [x] T002 Confirm pi model-id form `cline-pass/deepseek-v4-flash` and the `openai-completions` requirement (Phase 2 `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `cline-pass` provider block, `api: "openai-completions"`, `apiKey: "{env:CLINE_API_KEY}"` (`.pi/models.json`)
- [x] T004 Add `"cline-pass/deepseek-v4-flash"` to `enabledModels`, existing entries preserved (`.pi/settings.json`)
- [x] T005 Create custom-provider doc with gotcha + key + verify + remove (`.pi/CUSTOM-PROVIDERS.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `pi --list-models` shows `cline-pass  deepseek-v4-flash  1M  393.2K  yes  no`
- [x] T007 `pi auth check --provider cline-pass --model cline-pass/deepseek-v4-flash --json` → `{"status":"ready","authType":"api_key"}`
- [x] T008 Both `.pi` JSON files parse; no secret committed (`apiKey: "{env:CLINE_API_KEY}"`)
- [x] T009 `validate.sh 049-cline-provider-roster --recursive --strict` exit 0
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
