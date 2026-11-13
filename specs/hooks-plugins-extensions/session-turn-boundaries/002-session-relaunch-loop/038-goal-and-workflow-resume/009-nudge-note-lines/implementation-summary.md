---
title: "Implementation Summary"
description: "A hop now names the workers, scheduled tasks and added directories it leaves behind, and it stops a live fan-out runner before it gives up the deep-loop lock."
trigger_phrases:
  - "nudge note lines implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines"
    last_updated_at: "2026-11-13T11:05:00Z"
    last_updated_by: "implementer"
    recent_action: "Built and verified the phase; every task and acceptance row is green"
    next_safe_action: "None; the orchestrator commits the phase"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/commands/speckit/handoff.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-nudge-note-lines"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should phase 017 own the /speckit:handoff template? Answer: no; the command text ships in the same change as the check it must satisfy."
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
| **Spec Folder** | 009-nudge-note-lines |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session that hands over now leaves a receiver enough to avoid starting live work a second time. Every note names its running workers or says `none`, and `prepare` refuses a note that never answers the question.

### Phase 9: nudge-note-lines

The handoff nudge gains three In-flight lines: `Running workers:` in the `pid <pid> log <path> collect <step>` shape, `Scheduled:` for each cron or wakeup, and `Added directories:` for each directory added after launch, each with `none` as the empty value. The deep-loop step stops a live `fanout-run.cjs` runner with `kill -TERM`, waits until `kill -0` fails, then releases the lock, so the runner's lineages end with it.

`prepare` checks the `Running workers:` line after the shared note validation and before the goal packet write, so a refused note arms no relaunch record and stays untouched. `keep` does not set the option, because a kept session still owns whatever it left behind. The claim seed tells the receiver to run `kill -0` on each listed pid, collect a live worker instead of re-running the active command, and, after a hop, recreate the scheduled tasks and re-add the directories.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Runner stop in the deep-loop step, three In-flight lines, worker check in the seed, hop-only restore text |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `validatedNote` takes `requireRunningWorkers`, set by `prepare` only |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modified | Five new tests for the step, the lines and the seed |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Four prepare and keep tests, and the fixture note gains `Running workers: none` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Modified | The fixture note it passes to `prepare` gains `Running workers: none` |
| `.skilled/commands/speckit/handoff.md` | Modified | The note template and Step 4 ask for the same lines and the same runner stop |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` | Modified | The harness note gains `Running workers: none` under In-flight state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Test first. Each must-fail test ran red before its source edit, and `scratch/red.txt` holds those seven failing runs. After the edits the nudge, CLI and wrapper suites passed, then the full relaunch and plugin suites ran 1489 of 1489, and strict packet validation printed `RESULT: PASSED`. The seven must-fail runs are: the runner stop, the Running workers line, the Scheduled and Added directories lines, the seed worker check and the hop-only restore in `nudge.test.cjs`, plus the two prepare refusals in `session-relaunch-cli.test.cjs`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Check `Running workers:` in `validatedNote`, behind an option only `prepare` sets | `keep` returns the note to the session that wrote it, which still owns its workers; `core.validateHandoff` stays shared and unchanged |
| Refuse only a missing, empty or pid-less line | The line forces the question without a liveness scan, which the descendant walk owns later |
| Append the new seed text instead of adding three numbered steps | The existing guard test pins the numbered seed steps to `[1..7]`, so new steps would break an assertion the phase must keep |
| Update the `/speckit:handoff` template and the live hop harness note here | A required line that the template and the harness do not write would refuse notes those two paths produce |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Nudge suite | 89 tests, 89 pass, 0 fail |
| CLI suite | 162 tests, 162 pass, 0 fail |
| Wrapper claim suite | 38 tests, 38 pass, 0 fail |
| Full relaunch and plugin suites | 1489 tests, 1489 pass, 0 fail, with `OPENCODE_DB` unset |
| Runner SIGTERM case | 1 passed, 182 skipped, exit 0 |
| Named guard tests | 6 tests, 6 pass, 0 fail |
| Failing runs saved | `scratch/red.txt` holds 7 `not ok` |
| Acceptance criteria | 12 of 12 Met |
| Strict validation | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No liveness check in `prepare`.** A note can say `Running workers: none` while a worker runs; the receiver still gets the question, and the descendant walk that scans for unnamed workers is a later phase.
2. **A directory a session adds itself is UNCONFIRMED.** The seed asks the operator to run `/add-dir <path>` on Claude Code, which holds whether or not the model can do it alone.
3. **The full suite needs `OPENCODE_DB` unset in the OpenCode harness.** The harness exports a database name that the unmodified history-lookup test feeds to its fixture reader; the relaunch suites are unaffected.
4. **The README and the manual testing playbook keep the old wording.** Phase 017 owns them.
<!-- /ANCHOR:limitations -->

---
