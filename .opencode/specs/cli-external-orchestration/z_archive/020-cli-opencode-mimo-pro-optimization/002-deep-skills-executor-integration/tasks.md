---
title: "Tasks: MiMo + MiniMax as selectable deep-skills executors [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep skills executor integration tasks"
  - "mimo minimax deep loop task list"
  - "tasks"
  - "name"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/020-cli-opencode-mimo-pro-optimization/002-deep-skills-executor-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-002 task breakdown"
    next_safe_action: "Execute the four deep YAML edits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-deep-skills-executor-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: MiMo + MiniMax as selectable deep-skills executors

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

- [x] T001 Confirm the `cli-opencode` executor kind accepts any `provider/model` and has no `agent` field in its schema (`deep-loop-runtime/lib/deep-loop/executor-config.ts`)
- [x] T002 Re-read the `if_cli_opencode` block + existing `{optional_variant_flag}` render-hint pattern in a deep YAML (the proven mechanism to mirror)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove hard-coded `--agent general` from `if_cli_opencode` (was L893); preserve block + variant render hint (`deep/assets/deep_start-review-loop_auto.yaml`) — `rg "agent general"` clean
- [x] T004 [P] Remove hard-coded `--agent general` from `if_cli_opencode` (was L854) (`deep/assets/deep_start-review-loop_confirm.yaml`) — `rg "agent general"` clean
- [x] T005 [P] Remove hard-coded `--agent general` from `if_cli_opencode` (was L778) (`deep/assets/deep_start-research-loop_auto.yaml`) — `rg "agent general"` clean
- [x] T006 [P] Remove hard-coded `--agent general` from `if_cli_opencode` (was L694) (`deep/assets/deep_start-research-loop_confirm.yaml`) — `rg "agent general"` clean
- [x] T007 Patch cli-opencode arg builder to `if (agent && agent !== 'general') args.push('--agent', agent)`; keep resolved `'general'` default (`deep-improvement/scripts/model-benchmark/dispatch-model.cjs` L198) — `node --check` OK
- [x] T008 Add `describe('cli-opencode --agent handling')` (3 tests: omit-general, omit-unset, include-orchestrate) (`deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` L247)
- [x] T009 [P] Document MiMo + MiniMax cli-opencode models: invocation line + `executor_model` PRE-BOUND example (`deep/start-research-loop.md`, `deep/start-review-loop.md`)
- [x] T010 [P] Add MiMo + MiniMax to the PRE-BOUND `model` line (`deep/start-model-benchmark-loop.md`, `deep/ask-ai-council.md`)
- [x] T011 Verify ai-council dispatches seats via injected `dispatchSeat` and carries no hard-coded `--agent general`/`opencode run` (`orchestrate-topic.cjs` → `deep-loop-runtime/lib/council/multi-seat-dispatch.cjs`) — clean, no edit needed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 `rg -n "agent general"` across `deep/assets/*.yaml` + `dispatch-model.cjs` returns nothing (exit 1)
- [x] T013 `node --check dispatch-model.cjs` OK; full model-benchmark vitest green (6 files, 56 tests, ALL PASSED)
- [x] T014 `validate.sh --strict` on this folder passes (Errors 0)
- [x] T015 Confirm native / cli-codex / cli-gemini / cli-claude-code / cli-devin branches untouched; no new EXECUTOR_KIND added
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] cli-opencode dispatch clean of hard-coded `--agent general` and strict validation passes
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
