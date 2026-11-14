---
title: "Implementation Summary"
description: "A Claude question dialog is now refused while this session's hand-over record can still be armed, so an armed record whose killer died no longer parks the hop, and it is allowed once a live killer owns the loop lock."
trigger_phrases:
  - "question guard killer gone implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/020-question-guard-killer-gone"
    last_updated_at: "2026-11-14T19:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built the armable verdict guard, split the armed-record test and proved the throwing read"
    next_safe_action: "The orchestrator commits the fix and the operator decides the merge"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/subagent-guard.mjs", ".skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-question-guard-killer-gone"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Claude show the deny envelope in a live session? Not run live, and the spawned hook plus the suite are the evidence."
    answered_questions:
      - "Deny for every armable verdict, or only for killer-gone as well as pending? Every armable verdict, which is pending and killer-gone."
      - "Does a killer spawn failure always leave the record armed? Both spawn-error tests say yes."
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
| **Spec Folder** | 020-question-guard-killer-gone |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A question dialog is now refused for every hand-over record the session can still arm, not only for a pending one. An armed record whose killer never started therefore no longer lets the dialog open and park the hop, and the dialog is still allowed once a live killer owns the loop lock because that killer ends the idle session itself.

### Phase 20: question-guard-killer-gone

`pendingHandOver` asked `armableRecord` for a verdict and then kept only the `pending` answer. The core reports a second armable reason, `killer-gone`, for an armed record whose killer lock has no live owner, and a killer spawn failure leaves exactly that state behind. The guard now returns the record whenever `verdict.armable` is true, so `pending` and `killer-gone` both produce the same denial and `killer-live`, `no-record`, `other-loop`, `other-session`, `other-runtime` and `not-armable` all stay silent. The comment above the function now names both armable states and the live-killer exception. The denial text, the fail-open read, `armableRecord` and every other adapter are untouched.

The test that armed a record with no killer and asserted the dialog passed is split in two: one test denies that state, the other writes a lock owned by `process.pid` and asserts the dialog passes. A third test removes read permission from the record and proves the guard exits 0 with no output when the read throws, which closes a phase 1 row that had only a source reading.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modified | `pendingHandOver` returns the record for any armable verdict, and the comment names both armable states and the live-killer exception |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Modified | The armed-record test splits into a denial and a live-killer control, and a throwing-read test is added |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modified | The `subagent-guard.mjs` row states the armable rule and the live-killer exception |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first. The split denial and the throwing-read test were written before the source edit and run as `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='killer is gone|record read throws' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs`. `scratch/red.txt` records tests 2, pass 1, fail 1, exit 1, with the killer-gone denial printing the cross mark and the throwing-read test printing the tick, as the plan expected for an evidence test. The condition edit then made the same command print tests 2, pass 2, fail 0, exit 0, saved to `scratch/green.txt`, and the live-killer control printed its tick with tests 1, pass 1, fail 0, exit 0 in `scratch/control.txt`. The guard suite reported tests 23, pass 23, fail 0, exit 0, the Claude adapter and conformance suites reported tests 115, pass 115, fail 0, exit 0, and the whole relaunch and OpenCode plugin suite reported tests 1555, pass 1555, fail 0, exit 0, two above the 1553 baseline in `scratch/baseline.txt`. `node --check` exited 0 on the adapter and on the test file. The build changed three files and added none. The fix commit is the orchestrator's to make, and the commit-scoped new-file and log-event filters run after it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Act on `verdict.armable` rather than add `killer-gone` to the comparison | The core already owns which states can be armed, so a second reason in the guard would drift the moment the core learns a third |
| Deny an armed record whose killer is gone | A killer spawn failure leaves the record armed, and the next Stop re-arms it, so a dialog opened in between waits for a turn end that no Stop reaches |
| Allow the dialog once a live killer owns the lock | That killer ends the idle session itself, so the hop is already on its way and a dialog can be asked after it |
| Write the live-killer control with the real lock format | The lock is read through `liveKillerPid`, so a test that faked the verdict would prove nothing about the guard |
| Add the throwing-read test as evidence only | The guard already fails open, so the test cannot fail first, and the review asked for proof of a path that had only a source reading |
| Leave `armableRecord` and the denial text alone | The verdict and the wording were already right, and a change to either would widen the surface for no gain |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='killer is gone\|record read throws' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` before the edit | FAIL: tests 2, pass 1, fail 1, exit 1. `scratch/red.txt` prints the cross mark at line 2, the tick at line 3, the counts at lines 4 to 7 and the `AssertionError` on the empty stdout, with `exit=1` on the last line |
| The same command after the edit | PASS: tests 2, pass 2, fail 0, exit 0. `scratch/green.txt` prints both ticks and `exit=0` on the last line |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='live killer' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | PASS: tests 1, pass 1, fail 0, exit 0. `scratch/control.txt` prints the tick for `subagent-guard lets a question dialog through over an armed record with a live killer` and `exit=0` on the last line |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | PASS: tests 23, pass 23, fail 0, exit 0. `scratch/guard-suite.txt` prints the pending denial, the five pass-through tests, the split denial and the throwing-read test, with no cross mark |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | PASS: tests 115, pass 115, fail 0, exit 0, in `scratch/claude-conformance.txt` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` | PASS: tests 1555, pass 1555, fail 0, exit 0. `scratch/final-suite.txt` prints the counts in its last lines, against the 1553 in `scratch/baseline.txt` |
| `node --check` on the adapter and on the test file | PASS: both exited 0 |
| `rg -n 'verdict.armable' .skilled/hooks/session-relaunch/claude/subagent-guard.mjs` and the removed condition | PASS: printed 1 at `claude/subagent-guard.mjs:85`, and `rg -c "verdict.reason === 'pending'"` printed nothing with exit 1 |
| `rg -n "verdict.reason === 'pending'" .skilled` after the edit | PASS: printed nothing with exit 1, because the one producer was the condition changed here |
| `rg -c 'live killer' .skilled/hooks/session-relaunch/claude/README.md` | PASS: printed 1, exit 0, at `claude/README.md:28` |
| Working-tree new-file and log-event filters, the live forms of the T014 checks | PASS: `git ls-files --others` listed only files in this child, and the added `logEvent('` count in `git diff` printed nothing with exit 1. The commit-scoped `git show` forms run after the orchestrator commits |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/020-question-guard-killer-gone --strict` | PASS: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Claude session was run.** The denial is shown to the session through the same PreToolUse envelope the guard already emits, and nothing here observed a real dialog being refused. The spawned hook and the suite are the evidence.
2. **The commit-scoped proof waits for the fix commit.** T014 and AC-006 ran their working-tree forms, and the `git show --diff-filter=A` and `git show FIX` forms need the commit the orchestrator makes. Both must print nothing outside this child and no added log event.
3. **A killer spawned between the verdict and the denial costs one dialog.** It is a low-risk race that the existing behaviour also carries, and the refused question can be asked again after the hop.
4. **The guard reads the record and the lock from one state directory.** If the Stop hook and the guard ever resolved different directories, an armed record would look like `killer-gone`. Both go through `stateDir(env)` today, and no test covers a split between them.
<!-- /ANCHOR:limitations -->

---
