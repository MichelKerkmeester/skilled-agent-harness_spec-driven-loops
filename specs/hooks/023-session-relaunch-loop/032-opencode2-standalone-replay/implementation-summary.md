---
title: "Implementation Summary"
description: "Plain opencode under the wrapper now hops more than once on OpenCode 2, because every launch and relaunch carries --standalone and the rejected -m replay is gone."
trigger_phrases:
  - "opencode2 standalone replay implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/032-opencode2-standalone-replay"
    last_updated_at: "2026-10-25T09:21:14Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the standalone replay and proved two live hops with no shim"
    next_safe_action: "Commit after the operator says go"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/bin/skilled-loop-shell.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-opencode2-standalone-replay"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-opencode2-standalone-replay |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now type plain `opencode` under the wrapper and the loop keeps hopping on OpenCode 2. Before this phase the first hop worked only because the test harness put a PATH shim in front of OpenCode that added `--standalone`. A real relaunch dropped the flag, so the receiver landed on the shared background service, held no loop id and never armed a second hop.

### Phase 32: opencode2-standalone-replay

The wrapper runs `opencode --help` once and treats a help that lists `--standalone` as OpenCode 2. It then prepends `--standalone` to your first launch and builds every relaunch as `--standalone --prompt "<seed>"`. It leaves `-m` out on OpenCode 2, because the root command rejects it: a probe on 2.1.4 exited 1 and printed the help for `-m foo/bar --standalone`. A launch with `--server` stays on that server and prints a warning that the loop cannot arm there. An OpenCode build without `--standalone` in its help keeps the old launch and the `-m` replay. The shell shim now lets the OpenCode 2 subcommands `api`, `service`, `reload`, `pair` and `mini` run without the wrapper.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Capability probe, `--standalone` on launch and relaunch, no `-m` on OpenCode 2, `--server` warning |
| `.skilled/bin/skilled-loop-shell.sh` | Modified | OpenCode 2 subcommands pass through |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Stub answers `--help` from `STUB_HELP`; five OpenCode cases |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modified | Pass-through rows for the five subcommands |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Adapter row and the OpenCode 2 paragraph |
| `.skilled/hooks/goal/goal-plugin.md` | Modified | The wrapper adds the flag itself |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modified | GR-O1 names the wrapper as the source of the flag |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | OpenCode 2 launch form |
| `../030-opencode2-killer-target/implementation-summary.md` | Modified | Limitation 1 no longer tells you to pass the flag |
| `scratch/harness/run-two-hop.sh` | Created | Two live hops with no PATH shim |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests came first. Four of the five new wrapper cases failed on the old wrapper, and the fifth, a help without `--standalone`, is the control that passed before and after. The five shim rows were checked against the committed shim, which wrapped all five subcommands.

The live proof ran `scratch/harness/run-two-hop.sh`: a throwaway checkout built by the goal-rebind harness, a private tmux server and runtime directory, OpenCode 2.1.4 with no shim on the PATH and `SESSION_RELAUNCH_MAX_HOPS=2`. The sender process was `opencode --standalone`, started by the wrapper from plain `opencode`. Both receivers ran as `opencode --standalone --prompt [session-relaunch] claim and continue handoff …`. The hop history shows two `handed-over`, `claimed` and `done` triples, and both marker files were written (`scratch/two-hop-live/`). The first attempt stopped early on a harness bug, where the note path picked up a log line, and was rerun from a fresh sandbox. Cleanup deleted the five OpenCode sessions both attempts created, removed the sandbox and left no OpenCode process from it. The saved evidence holds no key or token.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Detect OpenCode 2 from its help, not its version | A build that renames or drops the flag falls back to the plain launch instead of failing |
| Add the flag to every OpenCode 2 launch under the wrapper | The operator approved it, which reverses the earlier phase's choice to leave the background service alone. Without it the loop cannot arm at all |
| Let `mini` pass through unwrapped | It takes `--standalone` after the subcommand, and looping it was not asked for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relaunch gate (relaunch tests plus the plugin test) | PASS, 859 of 859, from a baseline of 837. The run includes the next phase's 17 tests |
| Plugin tests | PASS, 552 of 552, baseline 552 |
| Pi tests | PASS, 52 of 52, baseline 52 |
| `check-rule-copies.js` | PASS, exit 0 |
| Two live hops on OpenCode 2.1.4, no shim | PASS, `scratch/two-hop-live/summary.txt` and `history.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No model on OpenCode 2.** The receiver starts on the configured default model, because the root command has no model flag.
2. **`opencode mini` does not loop.** It passes through the shim unwrapped.
<!-- /ANCHOR:limitations -->

---


