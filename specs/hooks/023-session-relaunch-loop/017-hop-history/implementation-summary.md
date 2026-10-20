---
title: "Implementation Summary"
description: "Every hop now leaves a line in a gitignored hop history beside the handoff notes. One command and /doctor:setup show it, and an opt-in macOS notice fires on each hand-over."
trigger_phrases:
  - "hop history implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/017-hop-history"
    last_updated_at: "2026-10-20T20:30:00Z"
    last_updated_by: "worker"
    recent_action: "Built the hop history, the history command, the doctor line and the opt-in notice"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/hop-history.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/lib/killer.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-hop-history"
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
| **Spec Folder** | 017-hop-history |
| **Completed** | 2026-10-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now see every hop after the fact. Each one writes lines to `.skilled/skills/.state/session-relaunch/hop-history.log`, and `session-relaunch.cjs history` or `/doctor:setup` shows them, so you no longer have to watch the terminal or search a temporary log.

### Phase 17: hop-history

A hop records four kinds of line: `handed-over` when the wrapper decides to relaunch, `claimed` and `done` when the new session picks the note up and finishes it, and `timed-out` when the killer gives up on a stalled hop. Each line carries the time, the runtime, the hop number, the folder, the first line of the note's goal and the note name. Writes are best effort, so a full disk or a missing folder never stops a hop.

`SESSION_RELAUNCH_NOTIFY_HOPS=1` in `.skilled/hooks/hook-flags.env` adds a macOS notice titled "Session handed over" on each hand-over. It is off by default, so a clone sees nothing until its owner opts in.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/hop-history.cjs` | Created | Record, read and notify |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `history` subcommand and records on relaunch, claim and complete |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modified | Records `timed-out` |
| `.skilled/hooks/session-relaunch/tests/hop-history.test.cjs` | Created | Eight tests |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs`, `session-relaunch-cli.test.cjs` | Modified | Timeout line, command list and CLI-copy fixture |
| `.skilled/commands/doctor/setup.md`, `assets/doctor-setup.yaml`, `assets/doctor-setup-presentation.txt` | Modified | Last-hop line |
| `.skilled/hooks/hook-flags.env.example`, `system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Notice switch |
| Session-relaunch README, tests README, feature catalog entry, root `README.md` | Modified | Docs |
| v4.0.0.13 changelog, hooks README, bin README, system-spec-kit README and catalog index, the Claude relaunch playbook, the `/doctor:setup` playbook scenario | Modified | Rollup: the hop history and the notice switch in every doc that describes the loop or `/doctor:setup` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests came first and failed before the code existed. The suite then ran green, and a live Claude hop through `skilled-loop` in a detached tmux session, started from worktree 175 with the notice on, wrote `handed-over`, `claimed` and `done`. `history` printed the three lines. The work merged into main from worktree 175. A second pass from worktree 177 carried the history into the v4.0.0.13 changelog and every other doc that describes the loop or `/doctor:setup`. AGENTS.md needed no change, because its Gate 3 already exempts writes that touch only gitignored runtime state under `.skilled/skills/.state/`, which is where the history lives.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the history beside the handoff notes, not in `relaunch.log` | The log lives in a temporary directory the system clears and mixes hops with declines |
| Show the last hop in `/doctor:setup` as information, not a sixth leg | A repository with no hop yet is healthy, so it must not degrade the status |
| Notice off by default, on through the gitignored hook-flags file | The operator wanted it on locally and off for people who clone the repository |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Session-relaunch suite | PASS, 597/597 (baseline 589, plus 8) |
| Pi adapter suite | PASS, 40/40 |
| Live Claude hop | PASS, three history lines, `history` and `history --last 1` exit 0 |
| Doctor tests and `route-validate` | PASS, 14 routes OK |
| Runtime mirrors and hook registrations | PASS |
| Drift guards | PASS, warnings pre-existing |
| Touched docs | 0 issues; ENV-REFERENCE keeps 3 pre-existing HVR blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Older hops are missing.** The hop on 2026-10-20 at 12:37 happened before the history existed. `relaunch.log` in the temporary directory still shows it until the system clears it.
2. **The notice is macOS-only.** Other systems record the history and show no notice.
3. **The notice cannot be checked by a test on screen.** Tests prove `osascript` runs with the right text through a stub.
<!-- /ANCHOR:limitations -->

---
