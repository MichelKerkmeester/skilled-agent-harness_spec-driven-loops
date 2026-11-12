---
title: "Implementation Summary: Relaunch test suite runs in a third of the time"
description: "The relaunch suite runs the same 868 tests in about 40 seconds instead of 130, and it passes from inside a looped session."
trigger_phrases:
  - "relaunch test speed implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/037-relaunch-test-speed"
    last_updated_at: "2026-11-12T21:13:22Z"
    last_updated_by: "orchestrator"
    recent_action: "Split the wrapper test file and measured the suite"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-decline-manual.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/nudge.test.cjs"
    session_dedup:
      fingerprint: "sha256:0435a5124cb51f7bef2aa745fc876061dca058e073893bcaedff647eacfd7de6"
      session_id: "scaffold-037-relaunch-test-speed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 037-relaunch-test-speed |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The relaunch suite now finishes in 38 to 43 seconds instead of 130, with the same 868 tests. It also passes when you run it from inside a looped session, where one nudge test used to fail.

### Phase 37: relaunch-test-speed

`node --test` runs files side by side and the tests inside one file one after another, so the suite waits for its slowest file. That file was `skilled-loop.test.cjs`: 185 tests that each spawn the real wrapper, about 133 seconds of test time. It is now four files of 29 to 45 seconds each, and the helpers they share live in one harness module beside them.

No test was added, removed or reworded. The split was done by a parser at top-level statements, and the sorted test titles before and after are equal. The slowest file is now `killer.test.cjs` at about 38 seconds, so a further cut there is the next step if you want the suite faster still.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Deleted | Replaced by the four files and the harness |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Created | Sandbox, runtime stubs and constants shared by the four files |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Created | First launch and replayed hop arguments |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs` | Created | Model, effort and runtime options carried between hops |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-decline-manual.test.cjs` | Created | Exit codes, declined hops and the manual command |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Created | Claim state, withdrawn hand-overs and goal packets |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modified | One test sets an empty loop id |
| `.skilled/hooks/session-relaunch/tests/README.md` | Modified | Lists the four files and the harness |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | Names the new files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modified | Names the new files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modified | Names the new files |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modified | Names the new files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first: one full run at 130 seconds in `scratch/before-relaunch.txt`, and a second session measured 129 seconds on its own. A tap run of the old file gave each test's time, and three cut points were picked so each part holds about 33 seconds. After the split the four files ran alone (185 of 185, titles equal), then the whole suite ran three times with the loop variables unset and once with them in place. Those four runs are in `scratch/after-relaunch-*.txt`. The OpenCode plugin and Pi suites ran last. The machine was under load during all runs, with a load average near 18.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split files instead of running tests side by side inside one file | These tests kill processes and race deadlines. The test-speed session reverted a parallel trial on the advisor suite because a timing test failed two of three runs |
| One harness module beside the tests, not in `fixtures/` | The helpers resolve the wrapper and the CLI from their own folder, so one level deeper breaks every path |
| File names start with `skilled-loop-wrapper-` | One glob then names exactly the four files and leaves `skilled-loop-shell.test.cjs` out |
| Cut by run time, named by content | Equal parts give the shortest wait. The names say what each part mostly covers |
| An empty loop id in the one nudge test, not a wider change to the env helper | Only this test expects an outside-loop decision from an inherited environment. The suite passed in an ambient run after this one change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Test titles of the old file against the four new files | PASS: 185 before, 185 after, sorted titles equal |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs`, loop variables unset, three runs | PASS: 868 tests, 868 pass, 0 fail each. Wall time 43, 38 and 39 seconds against 130 before |
| The same command with the session's loop variables in place | PASS: 868 pass, 0 fail. Before this phase the nudge file showed 74 pass, 1 fail there |
| Each new file alone | 29, 33, 29 and 45 seconds |
| `node --test .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 65 tests, 65 pass |
| Pi vitest file | PASS: 59 passed |
| `rg -n 'skilled-loop\.test' .skilled -g '*.md' -g '!**/changelog/**'` | PASS: no line |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The timings come from one loaded machine.** Three runs after and two before, with a load average near 18. Expect other numbers elsewhere, and the same ratio only roughly.
2. **No test was checked for redundancy.** The split keeps every test. Whether some of the 185 could merge into table-driven cases is still open.
3. **`killer.test.cjs` now sets the wait.** At about 38 seconds it is the slowest file, so the suite cannot drop below that without cutting it too.
4. **Old packets still name the old file.** Spec folders under `specs/` and released changelogs keep `skilled-loop.test.cjs` as history.
<!-- /ANCHOR:limitations -->

---


