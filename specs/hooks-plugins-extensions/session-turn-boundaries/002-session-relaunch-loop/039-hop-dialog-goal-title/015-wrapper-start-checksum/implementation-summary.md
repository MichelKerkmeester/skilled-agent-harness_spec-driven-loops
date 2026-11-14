---
title: "Implementation Summary"
description: "A hop now reports a wrapper change only when the checksum was read at loop start and at the hop, so a loop-start read that came back empty no longer prints a false change note or logs wrapper-changed."
trigger_phrases:
  - "wrapper start checksum implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum"
    last_updated_at: "2026-11-14T14:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Recorded the start-checksum guard, the stub test and the four runs that proved them"
    next_safe_action: "The orchestrator commits the two files and runs T012 against the fix commit"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-wrapper-start-checksum"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Can a real checkout make the loop-start read fail? Not known. The guard is added anyway."
    answered_questions:
      - "Does a failing cksum on the sandbox PATH make the loop-start read fail while the hop read succeeds? Yes, and the new test reproduced the false note before the fix."
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
| **Spec Folder** | 015-wrapper-start-checksum |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hop reports a change to the wrapper file only when the wrapper read a checksum at loop start and at the hop and the two differ. A loop-start read that came back empty, which a checkout can cause while it replaces the file, no longer prints `note: skilled-loop changed on disk after this loop started` and no longer appends a `wrapper-changed` line to `relaunch.log` for a file that never changed. The hop goes ahead on the code the loop started with, as before.

### Phase 15: wrapper-start-checksum

The wrapper takes a checksum of its own file before the first launch and compares it before each hop. `wrapper_checksum` prints nothing when `cksum` cannot read the file, and the comparison tested only the hop value. So an empty loop-start read followed by a successful hop read differed, and the wrapper reported a change that did not happen. The comparison now requires both values, and an empty read on either side means unknown rather than changed. The README sentence that promised this behavior for an empty checksum now holds for both reads.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Requires a non-empty loop-start checksum as well as a non-empty hop checksum before it reports a change, and the comment above it names both reads |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | Adds the test with an inline `cksum` stub that fails its first call and runs the real `cksum` afterwards |
| `.skilled/hooks/session-relaunch/README.md` | Checked, not changed | Line 112 already says an empty checksum is not a change and prints and logs nothing, which the fixed block makes true for both reads |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first. The new test landed before the wrapper edit and the selected run was saved to `scratch/red.txt` with the command and `exit=1`: tests 5, pass 4, fail 1, with the new test `✖` and the false note quoted in its assertion message, which proves the stub reached the loop-start read. The wrapper edit then made the same command print tests 5, pass 5, fail 0 and exit 0, saved to `scratch/green.txt`. The whole relaunch and OpenCode plugin suite ran last with `AI_SESSION_CHILD` and `OPENCODE_DB` unset: tests 1551, pass 1551, fail 0, exit 0, saved to `scratch/final-suite.txt`, one above the 1550 baseline in `scratch/baseline.txt`. `bash -n` and `node --check` both exited 0. The build changed two files and added none. The fix commit, and the commit-scoped check of T012, are the orchestrator's after this build.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require both checksums, not just the hop one | An empty read is unknown, not evidence of a change, and the same rule on both sides keeps one invariant a reader can check |
| Make the loop-start read fail with a `cksum` stub on the sandbox `PATH` | The harness already puts the sandbox bin folder first on `PATH`, and `chmod` cannot make the loop-start read fail because bash has already read the file |
| Fail only the stub's first call | The first `cksum` call is the loop-start read and every later call is a hop read, so one stub produces the exact bad row without a harness option |
| Resolve the real `cksum` with `command -v` before `PATH` changes | The stub hands every later read to the host's own `cksum`, so the hop value is real and the test cannot pass on a broken read |
| Leave README line 112 alone | The sentence already says an empty checksum is not a change and prints and logs nothing, and the fixed block makes that true at loop start too |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` before the edit | FAIL: tests 5, pass 4, fail 1, exit 1. `scratch/red.txt:5` prints the `✖` line for the new test with the false note in its message, `:9` and `:10` print `ℹ pass 4` and `ℹ fail 1`, `:39` prints `exit=1` |
| The same command after the edit | PASS: tests 5, pass 5, fail 0, exit 0. `scratch/green.txt:5` prints `✔` for the new test, `:7`, `:9` and `:10` print the counts, `:15` prints `exit=0` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` | PASS: tests 1551, pass 1551, fail 0, exit 0. `scratch/final-suite.txt:1564`, `:1566`, `:1567` and `:1572`, against the 1550 baseline at `scratch/baseline.txt:1562` |
| `bash -n .skilled/bin/skilled-loop` and `node --check` on the test file | PASS: both exited 0 |
| `rg -n -o 'if \[\[ -n "\$started_wrapper_checksum" && -n "\$hop_wrapper_checksum"' .skilled/bin/skilled-loop` | PASS: one line at `.skilled/bin/skilled-loop:1473` |
| `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` | PASS: definition at 34, loop-start read at 1208, hop read at 1472, and only the comparison at 1473 uses both |
| `rg -n -o 'A checksum that comes back empty[^.]*' .skilled/hooks/session-relaunch/README.md` | PASS: prints line 112, and the sentence is true for both reads, so no edit was made |
| `git diff --stat` of the working tree | PASS: two files, both modifications, no new file. The commit-scoped form waits on the fix commit and is T012 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum --strict` | PASS: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live hop was run.** The test drives a copied wrapper with a stub runtime, so the fix is proven against a stub `cksum`, not a real checkout that replaces the file mid-loop. Whether a real checkout can make the loop-start read fail is unknown; the guard costs one condition either way.
2. **A loop whose loop-start read failed reports no change for its whole life.** The loop-start checksum is never read again, so a later real change to the wrapper stays unreported in that loop. Adopting the first readable hop checksum as the baseline was declined because no failing case asks for it.
3. **The commit-scoped proof is deferred.** The working tree changes two files and adds none, but `git show --stat` and the `new file` count need the fix commit, which the orchestrator lands and checks with T012.
<!-- /ANCHOR:limitations -->

---
