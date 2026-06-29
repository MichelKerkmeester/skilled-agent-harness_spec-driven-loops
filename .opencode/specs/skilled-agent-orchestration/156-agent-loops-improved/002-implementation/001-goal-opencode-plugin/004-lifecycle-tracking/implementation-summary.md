---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Lifecycle tracking is now active inside mk-goal: session events restore goals, message updates refresh evidence and usage, and token budgets stop active goals."
trigger_phrases:
  - "goal lifecycle implementation"
  - "budget limited"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/004-lifecycle-tracking"
    last_updated_at: "2026-06-28T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified lifecycle tracking"
    next_safe_action: "Use lifecycle evidence in the supervisor phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m2-lifecycle-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 004-lifecycle-tracking |
| **Completed** | 2026-06-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Lifecycle tracking now gives `/goal` enough runtime memory to govern budgets and prepare verifier evidence without changing its passive M1 behavior. The plugin observes OpenCode events, records assistant activity, charges usage only when it is safe, and marks a goal `budget_limited` once its configured token cap is reached.

### Lifecycle Event Handling

`mk-goal.js` now restores active goals on session creation, refreshes activity on message updates, records prompt blockers on permission or question events, verifies on idle through the next phase helper, and clears volatile runtime locks on deletion or disposal events.

### Guarded Usage Accounting

Usage accounting is active-status only, goal-id guarded, and deduped by `lastAccountedMessageID`. Missing token data is not an error; the goal records `usageSource=unavailable` and keeps running.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-goal.js` | Modified | Adds lifecycle event handling, usage accounting, prompt-block state, and budget status output. |
| `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` | Created | Verifies account usage dedupe, budget stop transition, unavailable usage, and prompt blocking. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change extends the existing plugin in place and keeps the M1 state/injection test running in the full plugin suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat missing usage as `unavailable`. | OpenCode event payloads do not guarantee token fields, so crashing or inventing a delta would be worse than explicit unknown usage. |
| Dedupe by message id. | `message.updated` can repeat during streaming, and usage must not double-charge a single assistant turn. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .opencode/plugins/__tests__/*.test.cjs` | PASS, 3/3 plugin tests. |
| `node --check .opencode/plugins/mk-goal.js && node --check .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs && node --check .opencode/plugins/__tests__/mk-goal-supervisor.test.cjs` | PASS. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins` | PASS, 8 files scanned. |
| Lifecycle claim-falsifier | PASS, disabling budget crossing made the lifecycle test fail on the expected `budget_limited` assertion. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Usage payload coverage is best-effort.** If OpenCode does not include token counts on `message.updated`, the plugin records `usageSource=unavailable` and does not charge tokens.
<!-- /ANCHOR:limitations -->
