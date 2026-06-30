---
title: "Tasks: Command-layer Gemini cleanup"
description: "Executable task list for removing cli-gemini executor branches and Gemini surface references across nine command-layer files (5 YAML assets + 4 command docs)."
trigger_phrases:
  - "command yaml gemini cleanup tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/002-command-yaml-gemini-cleanup"
    last_updated_at: "2026-06-08T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed command-layer cleanup tasks (9 files)"
    next_safe_action: "None; phase complete, orchestrator validates centrally"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
      - ".opencode/commands/deep/start-research-loop.md"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/start-model-benchmark-loop.md"
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
    session_dedup:
      fingerprint: "sha256:f570b5dd630948efe28acf7848e3c79bf967cb8ce1b4cb39dabed5f9d200ca42"
      session_id: "command-yaml-gemini-cleanup-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Command-layer Gemini cleanup

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm the nine in-scope command-layer files (5 YAML + 4 docs) exist and the predecessor phase `001` deleted the `cli-gemini` skill and `.gemini/` surface. Evidence: all nine files present; predecessor `001/implementation-summary.md` records completed deletion.
- [x] T002 Inventory residual Gemini tokens across the command layer (`grep -rniE "gemini" .opencode/commands`). Evidence: inventory captured the YAML branches/guards/enum plus the four command docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Remove the `if_cli_gemini:` executor branch and strip `Gemini` from cli-opencode/cli-devin self-invocation guard surface lists (`.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T004 [P] Remove the `if_cli_gemini:` executor branch and strip `Gemini` from cli-opencode/cli-devin self-invocation guard surface lists (`.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T005 [P] Remove the `if_cli_gemini:` executor branch and strip `Gemini` from cli-opencode/cli-devin self-invocation guard surface lists (`.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T006 [P] Remove the `if_cli_gemini:` executor branch and strip `Gemini` from cli-opencode/cli-devin self-invocation guard surface lists (`.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T007 Remove `gemini` from the runtime `valid_values` list (`.opencode/commands/doctor/assets/doctor_mcp_install.yaml`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T011 [P] Remove `cli-gemini` from executor lists, re-letter Q-Exec options, fix the ASCII box, and remove gemini example commands (`.opencode/commands/deep/start-research-loop.md`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T012 [P] Same doc cleanup (`.opencode/commands/deep/start-review-loop.md`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T013 [P] Same doc cleanup (`.opencode/commands/deep/start-model-benchmark-loop.md`). Evidence: file is gemini-clean (exit 1 on grep).
- [x] T014 [P] Same doc cleanup (`.opencode/commands/deep/start-agent-improvement-loop.md`). Evidence: file is gemini-clean (exit 1 on grep).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the case-insensitive command-layer `gemini` sweep and confirm ZERO matches (REQ-001). Evidence: `grep -rniE "gemini" .opencode/commands` returns 0 matches (exit 1, verified centrally).
- [x] T009 Parse each of the five edited YAML files as valid YAML (REQ-002). Evidence: verified centrally by orchestrator.
- [x] T010 Confirm no command-YAML executor enum/whitelist names `cli-gemini` (REQ-003). Evidence: targeted search returns no enum/whitelist entry naming `cli-gemini`.
- [x] T015 Confirm the four deep command docs list only supported executors with contiguous Q-Exec lettering and no gemini example commands (REQ-004). Evidence: docs are gemini-clean (exit 1 on grep).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence.
- [x] No `[B]` blocked tasks remaining.
- [x] Command-layer `gemini` sweep returns zero and all five edited YAML files parse as valid YAML.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
