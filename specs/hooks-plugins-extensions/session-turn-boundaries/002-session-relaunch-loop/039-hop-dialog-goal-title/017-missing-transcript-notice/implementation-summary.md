---
title: "Implementation Summary"
description: "A Claude Stop whose payload carries no transcript path now prints one line that says the next prompt withdraws the hop because the transcript was missing, while the stamp, the log line and the withdrawal itself stay as they were."
trigger_phrases:
  - "missing transcript notice implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice"
    last_updated_at: "2026-11-14T18:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Recorded the missing-transcript notice and its runs"
    next_safe_action: "The orchestrator commits the four files and runs T013 against the fix commit"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/claude/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-missing-transcript-notice"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Claude show a Stop systemMessage when the payload has no transcript path? Not run live; the background-task notice relies on the same contract."
    answered_questions:
      - "Is the silent withdrawal intended? The operator answered on 2026-11-14: Keep, add a notice (Recommended)."
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
| **Spec Folder** | 017-missing-transcript-notice |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude Stop whose payload carries no `transcript_path` no longer looks like a hop that is still coming. It prints one JSON line that says the hop could not arm and that the operator's next prompt withdraws the hand-over, and it says a later Stop that carries the path arms it instead. The stamp, the `missing-transcript-path` log line and the withdrawal unless the operator types a prompt all stay as they were.

### Phase 17: missing-transcript-notice

The missing-transcript branch of `claude/stop-arm.mjs` used to log, stamp `deferredAt` on the pending record and return without a word, and the prompt hook withdrew the record on the next typed prompt with nothing shown to the operator. The branch now writes one line through the same `dependencies.write` seam the background-task branch uses: `systemMessage` carries the fixed text, `decision` is absent so Claude ends the turn, and a write that throws is logged as `stop-arm-error` with `stage: 'notice'` while the record stays stamped. The existing `missing-transcript-path` log event is reused and written once, so no record key and no log event is added.

The comment above the branch now says why the line prints here: the prompt that withdraws the record cannot tell this cause from the background-task, target-pid and arm-error paths, so the Stop is the one place that knows it. Both READMEs state the line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modified | The missing-transcript branch writes one `systemMessage` line after the stamp, guarded by a `try` that logs `stop-arm-error stage=notice`, and the comment says why the line prints at the Stop |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | The missing-transcript test expects one parsed line with both message fragments and no `decision` key, the unchanged record plus `deferredAt`, and exactly one `missing-transcript-path` log line |
| `.skilled/hooks/session-relaunch/README.md` | Modified | The sentence on a missing `transcript_path` names the printed line and what the next prompt does |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modified | The `stop-arm.mjs` row names the notice for a payload with no transcript path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first. The missing-transcript test was changed to expect the notice and run before the source edit: `scratch/red.txt` records tests 1, pass 0, fail 1, exit 1, and the assertion reads `stdout is empty: the missing-transcript Stop printed no notice`. The branch edit then made the same command print tests 1, pass 1, fail 0 and exit 0, saved to `scratch/green.txt`. The withdrawal tests ran before the edit at tests 8, pass 8, fail 0, exit 0 (`scratch/withdraw-tests.txt`), so the path the notice explains was still the path that withdraws. The Claude adapter and conformance suites reported tests 115, pass 115, fail 0, exit 0, and the whole relaunch and OpenCode plugin suite reported tests 1553, pass 1553, fail 0, exit 0, equal to the 1553 baseline in `scratch/baseline.txt` (`scratch/final-suite.txt`). `node --check` exited 0 on the adapter and on the test file, and an injected `write` that throws left the hook resolving `null` with the record stamped and one `stop-arm-error stage=notice` line. The build changed four files and added none. The fix commit, and the commit-scoped check of T013, are the orchestrator's after this build.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Print at the Stop, not at the withdrawing prompt | The prompt hook sees a stamped record and cannot tell this cause from the background-task, target-pid and arm-error stamps without a new record key, which the parent decisions forbid |
| Reuse the background-task notice's shape | `systemMessage` with no `decision` key is the one path this repository already proves reaches the operator while the turn ends, and `dependencies.write` keeps it testable |
| Reuse `missing-transcript-path` rather than add an event | The log already records the cause, and a new event would change the log surface for no extra proof |
| Fixed text with no payload field | The line explains a cause the operator fixes in the runtime; a payload value would put untrusted text in front of them and add nothing |
| Keep the write inside the branch's `try` | A failed stdout write must not turn a Stop into a failed hook, so the catch logs `stop-arm-error stage=notice` and the record stays stamped |
| Leave the withdrawal untouched | The operator chose "Keep, add a notice"; the prompt hook and `lib/withdraw.cjs` are unchanged |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` before the edit | FAIL: tests 1, pass 0, fail 1, exit 1. `scratch/red.txt:2` prints `✖`, `:3`, `:5`, `:6` the counts, `:16` the `AssertionError` on the empty stdout and `:28` `exit=1` |
| The same command after the edit | PASS: tests 1, pass 1, fail 0, exit 0. `scratch/green.txt:2` prints `✔`, `:3`, `:5`, `:6` the counts and `:11` `exit=0` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks\|withdraw' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` before the edit | PASS: tests 8, pass 8, fail 0, exit 0. `scratch/withdraw-tests.txt:2` to `:9` print `✔`, `:10`, `:12`, `:13` the counts and `:18` `exit=0` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | PASS: tests 115, pass 115, fail 0, exit 0. `scratch/claude-conformance.txt:117`, `:119`, `:120`, `:125`; the background-task notice test prints `✔` at `:69` and the changed test at `:81`, with no `✖` line |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` | PASS: tests 1553, pass 1553, fail 0, exit 0. `scratch/final-suite.txt:1566`, `:1568`, `:1569`, `:1574`, against the 1553 baseline at `scratch/baseline.txt:1565`, `:1567`, `:1568` |
| `node --check` on the adapter and on the test file | PASS: both exited 0 |
| `rg -c 'could not arm the hop because this Stop carried no transcript path' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` | PASS: printed 1, exit 0, at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:146` |
| `rg -c 'no transcript path' .skilled/hooks/session-relaunch/README.md .skilled/hooks/session-relaunch/claude/README.md` | PASS: printed 1 for each file, exit 0, at `.skilled/hooks/session-relaunch/README.md:134` and `.skilled/hooks/session-relaunch/claude/README.md:27` |
| An injected `write` that throws, run through `armPendingRecord` with a pending record and no transcript path | PASS: resolved `null` without rejecting, `deferredAt` stayed a string, one `stop-arm-error stage=notice` line and one `missing-transcript-path` line were logged, so the hook still exits 0 |
| `git diff --stat` and `git status --porcelain` of the working tree | PASS: four files, all modifications, and no new tracked file. The commit-scoped form needs the fix commit and is T013 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice --strict` | PASS: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` reported `inspected=1 repaired=1 failed=0`. AC coverage 6/6 with evidence and the packet reported closeable |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Stop was run.** The notice's delivery depends on Claude showing a Stop `systemMessage` when the turn ends, the contract the background-task notice already relies on. Nothing in this build observed a real Claude session show it.
2. **The write-failure path has no committed test.** A `write` that throws was verified once through an injected seam, not through the spawned hook, and no test in the suite drives that branch. The changed test covers the successful write only.
3. **The commit-scoped proof is deferred.** The working tree changes four files and adds none, but `git show --stat` and the `new file` count need the fix commit, which the orchestrator lands and checks with T013.
4. **Repeated Stops print the line each time.** A runtime that never sends `transcript_path` gets one line per Stop and one stamp per Stop. That is the cause the operator has to fix, and nothing deduplicates it.
<!-- /ANCHOR:limitations -->

---
