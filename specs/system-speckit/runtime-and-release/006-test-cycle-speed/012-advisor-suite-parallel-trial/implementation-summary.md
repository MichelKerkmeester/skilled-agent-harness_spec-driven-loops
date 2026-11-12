---
title: "Implementation Summary"
description: "The advisor suite's two-project split was built and measured, then reverted: two of three timed runs failed a latency-budget test, so the 52.3 percent median saving did not clear the three-pass gate."
trigger_phrases:
  - "advisor suite parallel trial implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial"
    last_updated_at: "2026-11-12T08:21:59Z"
    last_updated_by: "orchestrator"
    recent_action: "Ran the advisor suite with files in parallel three times and reverted the change after a timing test failed twice"
    next_safe_action: "None for this phase. A follow-up could keep the one timing file serial and retry the trial"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-advisor-suite-parallel-trial"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 012-advisor-suite-parallel-trial |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor suite can run its 149 independent test files side by side while its 12 shared-surface files stay serial, and it is about twice as fast that way. The split still went back to its original single serial setting, because the gate asks for three passing runs in a row and two of the three failed one test.

### Phase 12: advisor-suite-parallel-trial

The config was replaced with a `parallel` project and a `serial` project, copying the `sequence.groupOrder` shape the deep-loop config already uses. The parallel project ran the other 149 files side by side; the serial project ran the 12 files that bind the daemon socket, spawn the launcher, take the lease or open the skill-graph database, after the parallel group and one at a time. `vitest list` counted 12 and 149, which still totals the baseline's 161.

The timed runs came back at 101.58 s, 108.88 s and 97.67 s against a 213.09 s baseline, a median saving of 52.3 percent. Trials 1 and 2 each reported `1 failed | 160 passed (161)`. A JSON-reporter run named the failure: `tests/legacy/advisor-freshness.vitest.ts` measured a warm-probe p95 of `7.526` ms against a `5` ms budget. That file measures elapsed time rather than holding a shared surface, so it sat in the parallel group and was starved by the other 148 files.

The decision is Revert. The config is byte-identical to the committed version: `git diff` and `git status` on it are empty. The measurement stays in `scratch/trial-results.md` so a retry can start from the identified failure instead of the original hypothesis.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modified, then restored | Held the `parallel` and `serial` projects for the trial; final content matches the committed file exactly |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` | Created | Baseline, three timed trials, the failing test, the median, the saving and the decision |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/tasks.md` | Modified | Ticked the tasks that ran |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/implementation-summary.md` | Modified | This summary |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/graph-metadata.json` | Regenerated | The validator's Draft auto-repair refreshed derived metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Everything ran locally, from the repository root, in this order:

1. `rg -n 'fileParallelism' .skilled/skills/system-skill-advisor/runtime/vitest.config.ts` printed `40:    fileParallelism: false,`.
2. `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` succeeded and `dist/runtime/advisor-server.js` exists.
3. `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format text` exited 0 and left a 294,912-byte `database/skill-graph.sqlite`.
4. The baseline `(cd runtime && /usr/bin/time -p npm test)` passed: 161 files, 1387 tests, `Duration 212.76s`, `real 213.09`.
5. The config was replaced with the two projects; `vitest list --project serial` printed `12` and `--project parallel` printed `149`.
6. Three timed trials ran back to back: `fail` at 101.58 s, `fail` at 108.88 s, `pass` at 97.67 s.
7. An untimed JSON-reporter run reproduced the failure and named the test and its `7.526` ms value.
8. The median came out at 101.58, the saving at 52.3 percent, and the gate check printed `GATE CONSISTENT` with `Decision: Revert`.
9. The original config was restored; the decision check printed `MATCH` and `vitest list --filesOnly` printed `161`.
10. `validate.sh --strict --quiet` printed `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Revert despite a 52.3 percent saving | The gate asks for three consecutive passes. Two runs failed one test each, so keeping the split would trade a speed win for an intermittently red suite. |
| Name the failure with a separate untimed run | The timed runs were tailed to eight lines and lost the test name. A JSON-reporter run identified it without changing the gate, which already read two failed trials. |
| Declare the stress branch's serial setting once | The default path then holds exactly one true and one false `fileParallelism` line, while the stress run keeps the serial behavior it needs. |
| Restore the file rather than keep a reverted variant | The committed config is the known-good baseline; leaving a partially reverted file would make the next attempt start from an untested shape. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Serial setting before the edit | `40:    fileParallelism: false,` |
| Runtime build | `dist/runtime/advisor-server.js`, exit 0 |
| Skill-graph database | `skill_graph_scan` exit 0; `skill-graph.sqlite` 294,912 bytes |
| Baseline suite | `Test Files 161 passed (161)`, `Tests 1387 passed \| 8 skipped (1395)`, `Duration 212.76s`, `real 213.09` |
| Project census | `serial 12`, `parallel 149` |
| Trial 1 | `fail`, `real 101.58`, `Duration 101.28`, `1 failed \| 160 passed (161)` |
| Trial 2 | `fail`, `real 108.88`, `Duration 108.09`, `1 failed \| 160 passed (161)` |
| Trial 3 | `pass`, `real 97.67`, `Duration 97.23`, `161 passed (161)` |
| Failing test | `tests/legacy/advisor-freshness.vitest.ts`: `expected 7.526 to be less than or equal to 5` |
| Median and saving | `101.58` and `52.3`, derived twice from the same rows |
| Gate check | `GATE CONSISTENT` |
| Decision and config check | `MATCH` |
| Census after the revert | `161` |
| Config diff after the revert | empty |
| Test files touched | empty (`git status --short` on `runtime/tests`) |
| Spec validation | `RESULT: PASSED (errors=0 warnings=0)` on the final run; the first run's one warning was the then-unfilled placeholder tokens in this file |

No task was skipped: none of them pushed a branch, opened a pull request or needed operator approval.
T008 and T009 carry a Verify line that matches only a `pass` row, while their task text allows a `fail` row for a failed run. Both rows were written as `fail`, as the task text directs, and the gate reads them.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One machine, one day.** The baseline and trials ran back to back locally on an arm64 Mac, not on a CI runner. The CI step may gain less than the 52.3 percent seen here, and a runner with fewer cores would gain less still.
2. **The failure is intermittent.** Three of the five project-config runs failed and two passed. Trial 1's failing test name was not captured at the time; matching counts and the one failure the diagnostic run found make it the same latency test, but that is inferred rather than observed.
3. **The serial list was never proven.** The 12-file classification comes from reading each file's setup for a shared surface. The trial found one parallel file that needs a quiet machine, so a retry should move `tests/legacy/advisor-freshness.vitest.ts` into the serial group or relax its p95 budget before re-measuring.
<!-- /ANCHOR:limitations -->

---
