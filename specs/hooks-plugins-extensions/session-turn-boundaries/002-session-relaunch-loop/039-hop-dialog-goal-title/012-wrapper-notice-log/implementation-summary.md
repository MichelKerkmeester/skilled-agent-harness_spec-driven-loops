---
title: "Implementation Summary"
description: "A hop under a changed wrapper now leaves a wrapper-changed line in relaunch.log beside the stderr note, and a wrapper file that cannot be read at the hop prints and logs nothing."
trigger_phrases:
  - "wrapper notice log implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/012-wrapper-notice-log"
    last_updated_at: "2026-11-14T08:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Recorded the wrapper log line, the empty-checksum guard and the four runs that proved them"
    next_safe_action: "None. The commit is 94e83013fa with Commit-Id 0013978"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-wrapper-notice-log"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the operator see the stderr note above a full-screen receiver on Pi and OpenCode? Not run."
    answered_questions:
      - "Does a hop under an unreadable wrapper copy print the false note? Yes before the fix, and the new test reproduces it."
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
| **Spec Folder** | 012-wrapper-notice-log |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hop under a wrapper file that changed after the loop started now leaves a `wrapper-changed` line with the loop id in `relaunch.log`, beside the stderr note it already printed. A wrapper file that cannot be read at the hop prints no false note and logs nothing. The hop goes ahead in every case.

### Phase 12: wrapper-notice-log

The wrapper keeps the code it read when it started, so a change to `.skilled/bin/skilled-loop` reaches no hop of the running loop. Before this change it said so once on stderr, immediately before the receiver's screen took over. An unattended hop, which is what the loop exists for, scrolled that line away and left no record. The same block also compared against a checksum that read empty when a checkout replaced the file for a moment, so a file that did not change still printed the note.

The block now reads the checksum once, treats an empty read as no change, and when a read value differs from the start checksum it prints the note and appends the log line through the core's `appendLog` in the `node -e ... -- "$relaunch_core"` form the wrapper already uses. The log call ends in `|| true`, so a failed write never holds the hop back.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Reads the hop checksum once, skips an empty read, and appends the `wrapper-changed` line after the note |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | Adds the changed-wrapper log test and the unreadable-wrapper test, and extends the unchanged test to assert no log line |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modified | Adds `WRAPPER_MAKE_UNREADABLE_ON_INVOCATION`, which chmods the copied wrapper to mode 000 on a chosen invocation |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Names the `wrapper-changed` log line and the empty-checksum rule beside the note sentence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first. The two new tests and the harness option landed before the wrapper edit, and the selected run was saved to `scratch/red.txt` with the command and `exit=1`: tests 4, pass 2, fail 2, with both new tests `✖`. The source edit then made the same command print tests 4, pass 4, fail 0 and exit 0, saved to `scratch/green.txt`. The whole relaunch and OpenCode plugin suite ran last with `AI_SESSION_CHILD` and `OPENCODE_DB` unset: tests 1550, pass 1550, fail 0, exit 0, saved to `scratch/final-suite.txt`, two above the 1548 baseline in `scratch/baseline.txt`. `bash -n` and `node --check` both exited 0. The work is committed as `94e83013fa` on 2026-11-14 with `Commit-Id` 0013978. It changes four files with 58 insertions and 2 deletions and adds no new file.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One guarded block, two tests | Both findings change the same four lines, so one console path and one log path keep the empty-read rule and the change rule in one place a reader can check |
| Log through the core's `appendLog`, not a CLI command | The core already owns the log format, the state-directory safety checks and the append lock, so the line cannot drift from every other `relaunch.log` event |
| Empty checksum means no change | A checkout that replaces the file for a moment yields no output from `cksum`; only a value that was read and differs proves the code on disk moved |
| The log call ends in `|| true` | A read-only or unsafe state directory must not turn a warning into a stopped hop |
| Harness unreadability by `chmod 0o000` on one invocation | Bash keeps the descriptor it opened, so the running loop survives while the fresh hop-time read fails, which is exactly the production window |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` before the edit | FAIL: tests 4, pass 2, fail 2, exit 1. `scratch/red.txt`, with both new tests `✖` |
| The same command after the edit | PASS: tests 4, pass 4, fail 0, exit 0. `scratch/green.txt` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` | PASS: tests 1550, pass 1550, fail 0, exit 0. `scratch/final-suite.txt`, against the 1548 baseline |
| `bash -n .skilled/bin/skilled-loop` and `node --check` on the harness | PASS: both exit 0 |
| `rg -c 'wrapper-changed' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/README.md` | PASS: 1 for each file |
| `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` | PASS: definition at 34, start read at 1208, hop read at 1471, and only the hop read compares |
| Commit scope: `git show --stat 94e83013fa` | PASS: four files, all modifications, 58 insertions and 2 deletions, no new file |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live hop was run.** The tests drive a copied wrapper with a stub runtime, so whether the stderr note stays visible above a full-screen receiver on Pi and OpenCode is unverified. The log line is the durable record either way, and one edited-wrapper hop on each runtime would answer it.
2. **A changed wrapper logs one line on every later hop.** The start checksum is never refreshed, so each hop under the same changed file appends again. That is the planned behavior; no reader groups the lines.
3. **Commit-scoped proof landed after the build.** `git show --stat 94e83013fa` lists four files with 58 insertions and 2 deletions, and `git show 94e83013fa | rg -c '^new file'` prints nothing with exit 1.
<!-- /ANCHOR:limitations -->

---
