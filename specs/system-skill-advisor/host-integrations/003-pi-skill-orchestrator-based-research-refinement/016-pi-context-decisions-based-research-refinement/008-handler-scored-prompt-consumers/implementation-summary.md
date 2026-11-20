---
title: "Implementation Summary"
description: "Built 2026-11-18: the recommend handler and the CLI degraded path give command attachment and compiled-route enrichment the stripped prompt they score, so a command named in a pasted reply no longer attaches to the task."
trigger_phrases:
  - "handler scored prompt consumers implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/008-handler-scored-prompt-consumers"
    last_updated_at: "2026-11-18T19:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the scored-prompt consumers"
    next_safe_action: "Build phase 009, the crash fallback edge cases"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-handler-scored-prompt-consumers |
| **Completed** | 2026-11-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The recommend handler reads the raw prompt in one place, the strip. Compiled-route enrichment and typed-command attachment read the stripped task on the cache-hit and cache-miss returns. A `/doctor:sk-code quality` or a `/deep:review` inside a pasted reply changes neither the command nor the route the task gets. The CLI's degraded path, used when the daemon is unreachable, now checks the stripped task for a typed command too.

### Phase 8: handler-scored-prompt-consumers

Four `input.prompt` arguments became `scoredPrompt`. `degradedRecommendations` strips its prompt before it looks for a typed command, added by amendment from phase 007's open question.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/handlers/advisor-recommend.ts` | Modified | Four `input.prompt` arguments became `scoredPrompt` |
| `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modified | The `advisorPromptCache` import, the leak test and the equality test |
| `runtime/skill-advisor-cli.ts` | Modified | `degradedRecommendations` checks `stripLeadingPastedReply(prompt)` for a typed command |
| `runtime/tests/cli-degraded-command-contract.vitest.ts` | Modified | A command named only in a pasted reply collapses to its owner skill |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four Luna `xhigh` `fast` leaves through cli-codex, one file each: the two test files first, then the handler and the CLI. The conductor ran the tests red between the two pairs, then the typecheck, the build, every suite, a restart of this worktree's daemon alone and the live probes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Swap four arguments, add no helper | `scoredPrompt` is already in scope at both returns, so a helper would hide a one-word change |
| Tests in the compiled-route handler file | It runs the real scorer and mocks only the front-door subprocess, so both cache paths and both causes are reachable |
| A front-door mock that answers by its stdin | A constant mock returns equal routes before the fix too, so the equality test could not fail first |
| Strip inside `degradedRecommendations`, not at its call site | The function's own test can then fail before the fix. It has one caller, so the behavior is the same either way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 strip check after a build | Both probe prompts strip to the plain task |
| Baselines | `ROUTE` 7/7; `WIDE` 14 files, 206/206; `tests/handlers` 114 passed and 1 skipped on two runs, so the earlier two-failure run did not repeat; CLI degraded test 2/2 |
| Red runs | Leak test: `expected '/doctor:sk-code quality' not to be '/doctor:sk-code quality'`, after both `cache.hit` assertions passed. Equality test: the pasted prompt got `action` `route`, `selectionKind` `single` and `sk-code-review` where the plain task got `defer`. CLI case: the row stayed `command-speckit-save` |
| After the fixes | `rg -c 'input\.prompt'` on the handler prints 1; typecheck and build exit 0; `ROUTE` 9/9; `WIDE` 14 files, 208/208, the baseline plus 2; CLI 3/3; `tests/hooks tests/parity tests/handlers` 33 files, 351 passed and 1 skipped |
| Daemon restart | Worktree daemon 99329 replaced by 91563, started 19:03:10 after the 19:00:50 build; the primary checkout's daemon 14020 kept running |
| Live probes | The `PASTED` and `PLAIN` probe outputs are identical, `diff` exit 0, with `sk-code` on `defer`. The `LEAK` probe's `sk-code` line ends in `-` and its route matches the plain task's |
| Scope and hygiene | The diff lists the four planned files; the hygiene pattern printed nothing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fix reads whatever strip rule phase 006 leaves.** If that rule stops stripping a pasted reply, the reply's commands reach the task again. The two handler tests and the CLI case would then fail.
<!-- /ANCHOR:limitations -->

---
