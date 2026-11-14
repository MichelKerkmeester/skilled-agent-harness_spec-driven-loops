---
title: "Implementation Summary"
description: "A Claude Stop that parks a prepared hand-over because it resolved no target pid, or because its arm call threw, now prints one line that names the cause, the withdrawal on the next prompt and the retry at a later Stop, while the stamp, the log line and the withdrawal stay as they were."
trigger_phrases:
  - "stop park notices implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/022-stop-park-notices"
    last_updated_at: "2026-11-14T17:30:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built both parked-Stop notices and verified the suites"
    next_safe_action: "The orchestrator commits and reruns the two commit-scoped checks"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-stop-park-notices"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the arm-throw notice reach the operator from a spawned hook? The direct import proves the write seam, and the target-pid test proves the spawned stdout path."
    answered_questions:
      - "Is a new log event needed? No, the target-pid and arm events already record each cause, and the failed write reuses stop-arm-error."
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
| **Spec Folder** | 022-stop-park-notices |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude Stop that leaves a prepared hand-over parked no longer looks like a hop that is still coming. The branch that resolves no target pid and the branch whose `arm` call throws each print one JSON line that names the cause, says the operator's next prompt withdraws the hand-over and says a later Stop tries again. The `deferredAt` stamp, the `stop-arm-error` log line with each branch's stage and the withdrawal on the next prompt stay as they were.

### Phase 22: stop-park-notices

`claude/stop-arm.mjs` parks a record on four branches. The missing-transcript and background-task branches already printed a `systemMessage` through the `dependencies.write` seam. The other two logged, stamped and returned in silence: `stop-arm-error stage=target-pid` with `markParked` at `:197` to `:198`, and `stop-arm-error stage=arm` with `markParked` at `:228` to `:229`. The operator's next prompt withdrew the stamped record, and nothing explained why the hop never came.

Both branches now write after the stamp, inside a `try` whose `catch` logs `stop-arm-error` with `stage: 'notice'`. The line is a `systemMessage` with no `decision` key, so Claude shows it and still ends the turn. The text is fixed and holds no payload field. The `dependencies.write` JSDoc now says it writes an operator notice, and each branch comment says why the line prints at the Stop: the cause is known there, while the next prompt only withdraws the record.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modified | Both parked branches write one guarded `systemMessage` line after the stamp, the JSDoc names an operator notice, and each branch comment says why the line prints at the Stop |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | The target-pid test parses one stdout line and the arm-throw test collects one line through the injected `write`, and both assert the three claims, no `decision` key, the unchanged record plus `deferredAt` and the branch log line |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modified | The `stop-arm.mjs` row names the notice on all three parking branches |
| `.skilled/hooks/session-relaunch/README.md` | Modified | The Stop paragraph names the two notices and keeps the stamps and the log lines |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first. Both parked-Stop tests were extended to expect the notice and run before the source edit: `scratch/red.txt` records tests 2, pass 0, fail 2, exit 1, with the target-pid failure on the empty stdout and the arm failure on the zero collected lines. The two source edits then made the same command print tests 2, pass 2, fail 0, exit 0, saved to `scratch/green.txt`.

The Claude adapter and conformance suites reported tests 115, pass 115, fail 0, exit 0 (`scratch/claude-conformance.txt`), and the whole relaunch and OpenCode plugin suite reported tests 1555, pass 1555, fail 0, exit 0 (`scratch/final-suite.txt`), equal to the 1555 baseline in `scratch/baseline.txt`. The two existing notice tests ran at tests 2, pass 2, fail 0, exit 0 (`scratch/existing-notices.txt`). A `write` that throws was checked through `armPendingRecord` in `scratch/write-throw.mjs`: `armed=null`, `deferredAt=true`, the record unchanged apart from the stamp, one `stop-arm-error stage=notice` line beside the `stage=target-pid` line, and exit 0 (`scratch/write-throw.txt`). `node --check` exited 0 on the adapter and on the test file. The build changes four files and adds none outside this child's `scratch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Print at the Stop, not at the withdrawing prompt | The prompt hook sees a stamped record and cannot tell this cause from the other stamping paths without a new record key, which the parent decisions forbid |
| Reuse the shape of the two existing notices | `systemMessage` with no `decision` key is the path this repository already proves reaches the operator while the turn ends, and `dependencies.write` keeps it testable |
| Reuse `stop-arm-error` for a failed write | The event already carries a `stage`, so `stage: 'notice'` records the failure with no new log event |
| Fixed text with no payload field | The line explains a cause the operator fixes in the runtime, and a payload value would put untrusted text in front of them and add nothing |
| Leave the stamp, the log line and the withdrawal untouched | The record must still withdraw on the next prompt, and the existing cause events already record what the notice says |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no process below the loop\|arming throws' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` before the source edit | FAIL: tests 2, pass 0, fail 2, exit 1, saved to `scratch/red.txt`. The target-pid failure reads `expected '' to not equal ''` and the arm failure reads `0 !== 1` on the collected lines |
| The same command after the source edit | PASS: tests 2, pass 2, fail 0, exit 0, saved to `scratch/green.txt` with two `✔` lines |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | PASS: tests 115, pass 115, fail 0, exit 0, saved to `scratch/claude-conformance.txt` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` | PASS: tests 1555, pass 1555, fail 0, exit 0, saved to `scratch/final-suite.txt` against the 1555 baseline in `scratch/baseline.txt` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks\|background tasks exist' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | PASS: tests 2, pass 2, fail 0, exit 0, saved to `scratch/existing-notices.txt` |
| An injected `write` that throws through `armPendingRecord` (`scratch/write-throw.mjs`) | PASS: `armed=null`, `deferredAt=true`, the record unchanged apart from the stamp, one `stop-arm-error stage=notice` line, one `stage=target-pid` line and exit 0, saved to `scratch/write-throw.txt` |
| `node --check` on the adapter and on the test file | PASS: both exited 0 |
| `rg -c 'could not arm the hop because this Stop found no session process'` and `rg -c 'could not arm the hop because arming the record failed'` | PASS: each printed 1, exit 0 |
| `rg -c 'no target pid'` and `rg -c 'arm that throws'` on both READMEs | PASS: each printed 1 for `.skilled/hooks/session-relaunch/README.md` and 1 for `.skilled/hooks/session-relaunch/claude/README.md`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh .../022-stop-park-notices --strict` | PASS: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` reported `inspected=1 repaired=1 failed=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Stop was run.** The notice's delivery depends on Claude showing a Stop `systemMessage` when the turn ends, the contract the missing-transcript and background-task notices already rely on. Nothing in this build observed a real Claude session show it.
2. **The arm-throw path is proved through the direct import.** Its test calls `armPendingRecord` with a `write` seam and a `cwd` value that makes `arm` throw, so the text and the seam are proved, and the spawned stdout path is proved by the target-pid test. No spawned hook was driven through the arm-throw branch.
3. **The commit-scoped check is pending.** The orchestrator owns the fix commit, so `git show FIX` and the new-file filter run after it lands. The working tree already shows four modified files, no added file outside this child and two reused `stop-arm-error` calls.
4. **Repeated Stops print the line each time.** A runtime that never resolves a target pid, or whose arm keeps failing, gets one line and one stamp per Stop. That is the cause the operator has to fix, and nothing deduplicates it.
<!-- /ANCHOR:limitations -->

---
