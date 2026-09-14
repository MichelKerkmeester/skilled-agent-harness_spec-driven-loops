---
title: "Implementation Summary"
description: "The repo-guards project plugin bridges the shared guard cores into Hermes: it refuses a self-dispatch, runs the dispatch preflight over terminal commands, nudges on an evidence-free completion claim and freezes the session-start context into the prompt; validated in-process and proven live: a Hermes session's nested hermes chat was refused."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer"
    last_updated_at: "2026-09-14T20:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Live self-dispatch block observed in a Hermes session"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".hermes/plugins/repo-guards/__init__.py"
      - ".hermes/plugins/repo-guards/plugin.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-006-hermes-hook-and-plugin-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Hermes ignores an on_session_start callback's return; context injection goes through register_system_prompt_section"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-hermes-hook-and-plugin-layer |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Hermes session in this repo can run the same guard cores the other runtimes run, through one project plugin that re-implements none of them.

### Phase 6: hook and plugin layer

You get `.hermes/plugins/repo-guards/` with a manifest and one module. `pre_tool_call` on the terminal tool refuses a `hermes chat` self-dispatch outright and otherwise pipes the command through the Devin dispatch-preflight core with the same JSON payload, turning a `deny` into a Hermes `block`. `pre_verify` pipes the final response through the completion-evidence stop core and returns a continue nudge when it advises. A system-prompt section freezes the shared session-start context into the session. `on_session_end` runs the session-stop core. Every hook fails open.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.hermes/plugins/repo-guards/plugin.yaml` | Created | Manifest: name, version, `kind: standalone`, three provided hooks |
| `.hermes/plugins/repo-guards/__init__.py` | Created | `register(ctx)`, the guard bridges, read-only refusal, git advisory delivery and the goal slice |
| `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | Created | unittest harness for every directive shape (10 tests) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Devin adapters were the template: they already speak the runtime-neutral JSON contract, so the plugin builds the same payload and reads the same `hookSpecificOutput`. Validation used Hermes's own `hermes plugins validate`, which runs `register()` in isolation; behavior was exercised with a fake context in a Python harness, which needs no provider.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shell out to the cores | The cores are the single source of the rules; a re-implementation would drift |
| System-prompt section instead of `on_session_start` | Hermes ignores that hook's return value; the section surface is the documented way to freeze context |
| Fail open everywhere | A guard that cannot run must not stall a session; the caller sees the underlying failure anyway |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m py_compile` | ok |
| `hermes plugins validate .hermes/plugins/repo-guards` | "Validation passed", no warnings after the manifest fix |
| `hermes plugins doctor .hermes/plugins/repo-guards` | See the phase goal log for the recorded output |
| Harness: `hermes chat -Q --oneshot -q "x"` on the terminal tool | `{"action": "block", ...}` self-invocation refusal |
| Harness: `devin -p "task" </dev/null` with devin hidden and node reachable | `block` with the `devin-availability-required` reason from the preflight core |
| Harness: warn-only dispatch, plain shell, non-terminal tool | pass (`None`) |
| Harness: node unreachable | pass (`None`), fail-open |
| Harness: `pre_verify` on a completion claim | `None`: the core resolves the packet from the lifecycle state file, absent outside a bound session |
| `python3 .hermes/plugins/repo-guards/tests/test_repo_guards.py` | 10 of 10 OK: hook registration, self-dispatch block, read-only refusal, git advisory on the tool result, goal slice from the bound packet, fail-open |
| Live session block | With `HERMES_ENABLE_PROJECT_PLUGINS=1` and `repo-guards` in `plugins.enabled`: nested `hermes chat -q hello` returned `{"error": "Self-invocation refused: ...}`; prompt section `repo-guards-session-context` frozen (303 chars) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Loading needs a hand edit.** `hermes plugins enable` refuses a project plugin key, so `repo-guards` was added to `plugins.enabled` by hand under the config backup.
2. **The completion-evidence nudge fires only with a bound packet**, as it does for the other runtimes.
3. **Read-only enforcement needs the plugin.** Hermes has no read-only file toolset, so a read-only leaf keeps `file`; without `HERMES_ENABLE_PROJECT_PLUGINS=1` and the allowlist entry the toolset alone only removes `terminal`.
<!-- /ANCHOR:limitations -->

---
