---
title: "Implementation Summary: active-continuation"
description: "The goal plugin now has guarded active continuation that is default-off, smoke-testable, capped, and observable through JSONL logs."
trigger_phrases:
  - "goal continuation implementation"
  - "active continuation summary"
  - "MK_GOAL_AUTONOMY active"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/006-active-continuation"
    last_updated_at: "2026-06-28T21:46:31Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified default-off active continuation"
    next_safe_action: "Run live idle smoke"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-continuation.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m3-continuation-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether session.idle is observable in one-shot opencode run"
    answered_questions:
      - "Node unit tests prove default-off, passive, smoke, active dispatch, and cap behavior"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-active-continuation |
| **Completed** | 2026-06-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The goal plugin now has a guarded continuation path after idle-time verification. It stays passive by default, can be smoke-tested without sending a prompt, and only calls `promptAsync` when every gate passes.

### Continuation Gates

`maybeContinueGoal(sessionID)` checks plugin enablement, `MK_GOAL_AUTONOMY`, session id, active goal status, suppression, in-flight locks, permission/question blocks, busy/retry status, cooldown, auto-turn and wall-clock caps, and token budget before dispatch. Active mode reserves `autoTurnsUsed` before sending, so a failure path cannot push the counter past 8.

### Observability

Every continuation decision appends a JSONL row to `.opencode/skills/.goal-state/.continuation.log` with `sid`, `decision`, `reason`, and `autoTurnsUsed`. When `MK_GOAL_DEBUG=1`, the event hook also appends received event types to `.goal-events.log`.

### Status Surface

`mk_goal_status` now includes `continuation_attempts` and `continuation_suppressed_reason`, so smoke runs and suppressed active runs can be inspected without opening the state file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-goal.js` | Modified | Adds continuation gates, prompt dispatch, JSONL logs, debug event logging, status fields, and idle wiring. |
| `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs` | Created | Verifies default-off, passive, smoke, active prompt dispatch, and cap behavior. |
| `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/006-active-continuation/` | Modified | Replaces scaffold phase docs with actual scope, plan, task list, summary, and metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation extends the committed plugin in place and keeps autonomy default-off. Existing plugin tests stayed green, and the new unit test covers both no-prompt safety modes and the active dispatch path through an injected fake client.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat unset `MK_GOAL_AUTONOMY` as `autonomy_disabled`. | The feature must not send recursive prompts unless explicitly enabled. |
| Keep `smoke` as log-only. | Smoke mode lets a live session prove gate readiness before sending a real continuation prompt. |
| Reserve the auto-turn before `promptAsync`. | Counting before dispatch prevents retries or failures from hiding attempted continuation work. |
| Cache `session.status` from events. | The idle hook can avoid an extra SDK status read while still suppressing busy/retry sessions. |
| Persist hard-stop suppression reasons. | Cap and prompt-dispatch failures should be visible through status and should not silently loop. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `node --test .opencode/plugins/__tests__/*.test.cjs` | PASS, 3/3 plugin tests before changes. |
| Baseline `node --check .opencode/plugins/mk-goal.js && node --check .opencode/plugins/__tests__/mk-goal-state.test.cjs && node --check .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs && node --check .opencode/plugins/__tests__/mk-goal-supervisor.test.cjs` | PASS before changes. |
| `node --test .opencode/plugins/__tests__/*.test.cjs` | PASS, 4/4 plugin tests after changes. |
| `node --check .opencode/plugins/mk-goal.js && node --check .opencode/plugins/__tests__/*.test.cjs` | PASS. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins` | PASS. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/006-active-continuation --strict` | PASS. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live idle smoke is still required.** The unit tests prove the plugin hook logic, but they do not prove whether `session.idle` is observable in a one-shot `opencode run` versus requiring `opencode serve` or the TUI.
2. **Active mode depends on the runtime client shape.** The installed plugin type surface exposes `ctx.client.session.promptAsync`, and tests use that shape, but live smoke should confirm the same call path inside a running OpenCode instance.
<!-- /ANCHOR:limitations -->
