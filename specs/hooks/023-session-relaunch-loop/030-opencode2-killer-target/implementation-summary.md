---
title: "Implementation Summary"
description: "An OpenCode 2 session started by the relaunch wrapper now hands over to a fresh session: three defects stood in the way, and each was fixed test-first and checked by a live hop."
trigger_phrases:
  - "opencode2 killer target implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/030-opencode2-killer-target"
    last_updated_at: "2026-10-25T07:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the OpenCode 2 hop and passed it live with a goal"
    next_safe_action: "None for this phase; phase 031 carries model and effort across a hop"
    blockers: []
    key_files:
      - ".opencode/plugins/session-relaunch.js"
      - ".skilled/hooks/session-relaunch/lib/killer.cjs"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/bin/skilled-loop"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-opencode2-killer-target"
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
| **Spec Folder** | 030-opencode2-killer-target |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An OpenCode 2 session started under `skilled-loop` with `--standalone` now ends itself when its hand-over is armed and a fresh session claims the note. Before this phase the loop could not hop on OpenCode 2 at all. Three defects stood in the way, one behind the other, and each live rerun found the next.

### Phase 30: opencode2-killer-target

**The killer signalled the wrong process.** OpenCode 2 loads plugins in a `serve --stdio` server that its TUI starts. A probe plugin recorded its own pid as the server's, with the TUI as its parent (`scratch/pid-probe.txt`). The plugin passed that pid to the killer, so the server died and the TUI stayed up. The plugin now hands the killer the loop's direct child, found by the same `findLoopChildPid` walk the Hermes adapter uses, and keeps its own pid when the walk finds nothing. On OpenCode 1 the walk returns the plugin's own pid, because the plugin runs in the TUI there.

**Exit 130 read as an interrupt.** With the TUI signalled, `should-relaunch` approved the hop, but OpenCode 2.1.4 exits 130 on SIGTERM as well as on SIGINT (measured). The wrapper reads 130 as the operator stopping the loop, so it printed the manual command (`scratch/opencode-a-hop-run1-exit130/`). The killer now stamps `signalledAt` on the record as the last step before the signal. That stamp replaces the last-look read and shares its lock, so a cancel cannot land between the check and the stamp, and a new arm drops it. `should-relaunch` reports `signalled`, and the wrapper treats 130 as an interrupt only when the record was not signalled.

**The grace was too short.** In the next run the TUI took about 6.2 seconds to exit, past the killer's 5-second post-signal grace, so the killer disarmed the record and the wrapper declined (`scratch/opencode-a-hop-run2-slow-exit/`). The grace is now 15 seconds. It only delays the notice for a runtime that ignores SIGTERM.

The third rerun passed: the killer signalled the TUI, the wrapper relaunched, and the receiver claimed and completed the note, bound the sender's packet as a new goal record and saw it in `SESSION_RELAUNCH_GOAL_PACKET` (`scratch/opencode-a-hop/`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/session-relaunch.js` | Modified | Hand the killer the loop's direct child |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `markSignalled`; a new arm drops the stamp |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modified | Stamp in the last check before the signal; 15-second grace |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `should-relaunch` reports `signalled` |
| `.skilled/bin/skilled-loop` | Modified | A signalled exit 130 relaunches |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Modified | Loop-child target test |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Stamp test |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modified | Stamp assertion, slow-exit test |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Signalled exit 130 test and stub switch |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | The decision JSON carries `signalled` |
| `.skilled/hooks/session-relaunch/README.md` | Modified | OpenCode 2 result, killer target, stamp, grace, exit 130 |
| `.skilled/hooks/goal/goal-plugin.md` | Modified | OpenCode 2 hop result, version 3.8.3.0 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modified | GR-O1 now PASS, results row, version 1.0.13.0 |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | OpenCode 2 in the live carry-over line |
| `../028-goal-rebind-live-proof-and-docs/*` | Modified | AC-009 Met; the phase is Complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each defect got a failing test before the fix. The gates were baselined on the committed code first, with the changed files set aside. The live hop reran the phase 028 harness unchanged: a throwaway checkout holding copies of the hooks, the wrapper and the plugins, a private tmux server and runtime directory, OpenCode 2.1.4 with a `--standalone` shim, and `openai/gpt-6-luna` from the sandbox's own config.

Cleanup: the probe and every run's tmux servers and processes were stopped, the four OpenCode sessions the runs created were deleted from OpenCode's store, and the throwaway checkouts were removed. The saved evidence holds no key or token. `.opencode/cli.json` was not touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Signal the loop's direct child, not the plugin host | It is the process the wrapper waits on, on both OpenCode versions, and the killer's ancestry check already accepts it |
| Stamp the record instead of changing the exit-code rule | The exit code cannot tell SIGTERM from SIGINT on OpenCode 2, while the killer knows it signalled; the stamp keeps an operator's interrupt on every runtime meaning what it did |
| A 15-second grace for every runtime | One measured runtime needed six seconds; the longer wait costs only a later notice for a runtime that ignores SIGTERM |
| Leave the default background service alone | The plugin runs in a service no wrapper started, so it holds no loop id; adding `--standalone` to every OpenCode 2 launch changes how the operator's sessions run |
| No change for the `-m` relaunch argument | The wrapper adds `-m` on a relaunch only when the first launch passed it, and OpenCode 2 rejects that first launch the same way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relaunch gate, `node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | Baseline 833 of 833, exit 0. Final 837 of 837, exit 0. Delta +4, the new tests |
| Plugin suite, `node --test --test-reporter=tap .opencode/plugins/tests/*.test.cjs` | Baseline 551 of 551, exit 0. Final 552 of 552, exit 0 |
| Pi extension suite, `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | 52 of 52 after the change; no baseline was taken before it |
| Failing first | The plugin target test, the stamp test, the killer stamp assertion, the signalled-130 wrapper test and the slow-exit test each failed on the code before their fix (`scratch/gate/*-red.tap`) |
| Syntax | `node --check` on the plugin, core and killer, `bash -n` on `skilled-loop`, each exit 0 |
| Live OpenCode 2 goal hop | PASS, `scratch/opencode-a-hop/` |
| `validate.sh --strict` | See the completion run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode 2's default background service.** The loop does not arm there, because the plugin runs in a service no wrapper started and it holds no `SKILLED_LOOP_ID`. The wrapper now adds `--standalone` itself, so the loop arms without it being passed (see the replay phase).
2. **One machine, one version.** The hop was shown on OpenCode 2.1.4 on this machine. The TUI's exit took 4 to 6 seconds across three runs, so a slower machine could still pass 15 seconds.
3. **A stamp without a signal.** If the target exits between the stamp and the signal, the record says signalled although no signal was sent, and an exit of 130 in that instant relaunches. The window is one locked write.
<!-- /ANCHOR:limitations -->

---
