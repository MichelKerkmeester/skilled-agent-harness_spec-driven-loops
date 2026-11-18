---
title: "Implementation Summary"
description: "Planned, not built: the recommend handler will give compiled-route enrichment and typed-command attachment the stripped prompt it scores, so a command named in a pasted reply stops attaching to the task."
trigger_phrases:
  - "handler scored prompt consumers implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/008-handler-scored-prompt-consumers"
    last_updated_at: "2026-11-18T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase planned"
    next_safe_action: "Start task T001 once phase 007 validates strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 0
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
| **Completed** | Not yet. Planned 2026-11-18, not built |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This file records the planned state so the build can fill it in.

### Phase 8: handler-scored-prompt-consumers

The plan makes the recommend handler read the raw prompt in one place, the strip. Compiled-route enrichment and typed-command attachment will read the stripped task on both cache paths. A `/doctor:sk-code quality` or a `/deep:review` inside a pasted reply will then change neither the command nor the route the task gets.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/handlers/advisor-recommend.ts` | Modify, planned | Four `input.prompt` arguments become `scoredPrompt` |
| `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modify, planned | The leak test and the equality test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The plan is two Luna leaves, one for the tests and one for the handler, with the conductor confirming the red reasons in between and running every check in `tasks.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Swap four arguments, add no helper | `scoredPrompt` is already in scope at both returns, so a helper would hide a one-word change |
| Tests in the compiled-route handler file | It runs the real scorer and mocks only the front-door subprocess, so both cache paths and both causes are reachable |
| A front-door mock that answers by its stdin | A constant mock returns equal routes before the fix too, so the equality test could not fail first |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Leak, measured during planning | Live daemon 7589: `hit=true top=sk-code cmd=/doctor:sk-code quality mode=sk-code-quality` |
| 002 compiled-route probe, measured during planning | The pasted run routes `sk-code` to `sk-code-review`, and the plain run defers |
| Build checks | Not run yet. `tasks.md` T002 to T013 hold them |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fix reads whatever strip rule phase 006 leaves.** If that rule stops stripping a pasted reply, the reply's commands reach the task again. Task T001 checks both probe prompts before any edit.
<!-- /ANCHOR:limitations -->

---
