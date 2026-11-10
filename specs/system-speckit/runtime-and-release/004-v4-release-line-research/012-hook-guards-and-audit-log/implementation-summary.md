---
title: "Implementation Summary"
description: "The ask-surface guard reads numbered menus correctly, never hangs a turn on stdin, sends a turn back at most once per operator message on every runtime, and dispatch-audit logs land at the repository root."
trigger_phrases:
  - "hook guards and audit log implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/012-hook-guards-and-audit-log"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Closed the phase"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-hook-guards-and-audit-log |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The ask-surface guard now behaves the same on every runtime and can no longer hang a turn, and dispatch audit logs stop scattering into packet folders.

### Phase 12: hook-guards-and-audit-log

A menu numbered `1.` or running to `10)` is now recognised, while a numbered how-to list that ends in a generic question is left alone. The Claude ask-surface Stop hook and the Codex and Devin advisory hooks read stdin through the shared deadline reader, so a held-open pipe ends the turn after the deadline instead of hanging it. OpenCode and dsh now key the send-back on the operator's latest message, ignoring the guard's own reprompt, which matches Claude and Pi. Every dispatch-audit adapter writes to `<repository top level>/.skilled/logs/cli-dispatch-audit.log`, resolving the root once per directory.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | Modified | Menu rule, contract sentence |
| `.skilled/hooks/ask-surface-guard/fixtures/` (3 files) | Created | Dotted, ten-option and how-to fixtures |
| `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs`, `lib/advisory-stop.cjs`, `codex/` and `devin/ask-surface-stop.cjs` | Modified | Deadline reader and fail-open catch |
| `.opencode/plugins/ask-surface-guard.js`, `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` | Modified | Operator-message key |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and the claude, codex, devin, pi adapters, `README.md` | Modified | Repo-rooted memoized log path |
| Test files beside each | Modified | One case per behaviour |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first. Four cli-codex `gpt-6-luna` high-fast briefs made the changes, one per finding. DeepSeek V4.1 Flash max (cli-pi, read-only) reviewed the diff and found one P1, the OpenCode reprompt re-keying itself, and five P2s; the orchestrator confirmed the P1 against the v2 bridge and one more Luna brief fixed it with three P2s. The whole hook battery was rerun from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Once per operator message | Claude and Pi already did it, and the core header says a turn is sent back once |
| Ignore the guard's own reprompt by its text | OpenCode 2 delivers it as an ordinary user message with no marker |
| Memoize the git root per directory | One `git rev-parse` cost about 14 ms on every Bash call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| OpenCode plugin tests | Before 572/0. After 574/0 |
| Plugin tests under `AI_SESSION_CHILD=1` | Before 545/27. After 547/27, identical failure list |
| Hook node tests (ask-surface, dispatch, shared) | Before 228/0. After 235/0 |
| Hooks vitest | Before 415/0. After 417/0 |
| Matrix | 6 runtimes by 3 events; the 4 adapters that change carry tests, Claude and Pi are read and unchanged |
| Cross-family review | DeepSeek FAIL, 1 P1 and 5 P2; P1 and three P2 fixed, two P2 recorded in ADR-003 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A numbered summary followed by a choice-worded question can fire.** Example: a `1.` list of done steps then "Which file should I open?"; the cost is one reprompt. Recorded in ADR-003.
2. **The stray `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/.skilled/logs` stays.** It is untracked and gitignored; deleting it is the operator's call.
<!-- /ANCHOR:limitations -->

---
