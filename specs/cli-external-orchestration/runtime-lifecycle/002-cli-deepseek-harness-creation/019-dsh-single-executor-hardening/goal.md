---
title: "Goal: Phase 19: dsh-single-executor-hardening"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh single executor hardening goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening"
    last_updated_at: "2026-11-14T14:50:00Z"
    last_updated_by: "orchestrator-worker"
    recent_action: "Planned C6 Option A after the operator chose it"
    next_safe_action: "Build C6 from plan.md E14 to E22 through tasks T021 to T030"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-019-dsh-single-executor-hardening"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: dsh-single-executor-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make a single DeepSeek Harness lineage in deep review and research run clean, refuse where it cannot run and record what it did.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs and the files C6's chosen option adds there first. |
| D2 | Each fix sits where the fault is produced: the runner, the fan-out home helper, the reducer and the graph upsert, not the step that observed it. |
| D3 | Every executor kind other than the harness keeps today's stdout echo and env behavior. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] REQ-001 to REQ-003: the two named suites print `16 passed (16)` and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` (T009, T015). Evidence: `17 passed (17)` with one added edge test, and `OK commands=3`
- [x] REQ-004 to REQ-007: the fan-out, reducer and upsert suites print no failure with three more tests passed (T016). Evidence: `211 passed (211)`, up from 208
- [x] REQ-008: the four version fields read `1.6.26.0` and the route guard prints `system-deep-loop            fresh` (T012, T018). Evidence: both, the guard after the manifest refresh
- [x] REQ-009: C6 Option A keeps one executor row per iteration through a projection refresh in review and research (T028, T029). The deferral first recorded here is superseded. Evidence: T028 and T029, and the live review state log
- [x] The full deep-loop suite shows only the known `fanout-pool.vitest.ts` timing failure and typecheck exits 0 (T017). Evidence: 2903 passed and 8 skipped of 2911 with no timing failure, typecheck 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | 2026-11-14 at `1bedb33577`, baselines in `plan.md` section 5 |
| C6 choice | Done | 2026-11-14: the operator deferred C6. Neither Option A nor Option B is built, so the state log still carries no executor identity for a single harness iteration. The dispatch receipts remain the only record of which executor ran |
| C6 Option A | Planned | 2026-11-14: the operator chose Option A, which supersedes the deferral above. `plan.md` E14 to E22 hold the edits, each applied and tested on a copy of the runtime: the three new tests fail with today's `executor-audit.ts` and pass after, and the related suites stay at 75 and 153 passed |
| Sweep age | Done | 2026-11-14: the operator confirmed 24 hours |
| Echo reader check | Done | In both auto workflows the harness branch ends with `process.exit(dispatchExit)` after `runAuditedExecutorCommand`, and the step declares no output capture. Nothing reads its stdout |
| Build start | Done | After `45e113ec16`. All 23 search texts counted 1. Named suites 11, drift and compile 23, sweep, reducer and upsert 208, drift `OK commands=3`, typecheck exit 0, route guard fresh. The full suite printed `2894 passed \| 8 skipped (2902)` with no failure |
| Phase built | Done | One DeepSeek V4.1 Flash worker built C1 to C5, C7 and C8 and exited 0 with a `completed` final event. Named suites 11 to 17, sweep, reducer and upsert 208 to 211, full suite 2894 to 2903 passed, drift `OK commands=3`, typecheck 0, route guard fresh after the manifest refresh |
| Fail-before check | Done | With each source swapped to its HEAD copy, 9 new tests fail across the five test files, and all pass with the edits back |
| Stub smoke | Done | Both auto branches against a fake rc.3 binary print `child stdout 4189 bytes, not echoed`, an empty stdout and remove their home |
| C6 Option A | Built | 2026-11-14: E14 to E22 applied from plan.md, survival test 3 of 3 and 3 failed on the start copy, C6 suites 78 and 153, full suite 2907 passed and 8 skipped of 2915. A live one-iteration harness review kept one iteration_start row naming cli-deepseek-harness deepseek-v4.1-flash-1017 max, verdict PASS with 3 P2. A 120 second gateway timeout was added for the first P2 |
| C6 open questions | Answered | 2026-11-14: the operator chose a new v1.6.27.0 changelog, and a follow-up phase 020-dsh-direct-writer-gateway for the three writers that still bypass the gateway. executor_missing stays unchanged |

### Deviations and findings

| Item | Note |
|------|------|
| Already fixed | Fable B-P1-1 and B-P1-2 and the timeout-margin half of B-P2-1 shipped in `1bedb33577`. The scaffold-docs half of B-P2-4 was closed in phase 018 |
| C8 cause corrected | The first reading blamed the coverage rule. The live graph read-only shows eight DIMENSION nodes for four dimensions and only `COVERS` edges, so the fix moved to the graph upsert |
| Dropped | The claim-adjudication miss at `review-report.md:202` sits in the orchestrator's matcher, and the run wrote a corrected event itself |
| Empty stream | The worker skipped the stderr line when stdout was empty. The spec's edge case asks for `0 bytes`, so the runner now always logs the count when the echo is off, with one added test. That makes the named suites 17, not 16 |
| Link case | The worker's link test left the target young, so it could not catch a sweep that followed the link. The target is now aged to 25 hours |
| Full suite TMPDIR | A private TMPDIR under the scratchpad made four tsx tests fail on a socket path that is too long. The same four files pass with the default TMPDIR |
| Real stale homes | The six old `dsh-home-` folders in the system temp folder were backed up before the build and are still present. No test swept them |
| Manifest refresh | The deep-loop route manifest and its archived activation copy were refreshed by hand with the command the guard printed, the same step the commit hook runs |
| Live run | T019 ran as a stub smoke, not a live harness review |
| C6 same class | Open question: three more writers put rows straight into a ledger-backed state log, `emitDispatchFailure`, `emitReceiptWriteFailure` and the post-dispatch `record_executor_audit` step through `appendExecutorAuditToLastRecord`. The next refresh drops them as it dropped the executor row. They are outside C6 and need the operator's call |
| C6 and `executor_missing` | Open question: `executor_missing` reads the last `type: iteration` record, and no workflow passes it `executorKind`, so it is dormant. Option A leaves it unchanged. Making it read the `iteration_start` row instead is a separate choice |
| C6 changelog | Open question: `v1.6.26.0` shipped in `cf473969a1` without C6. Whether C6 extends that note or takes `v1.6.27.0` is the operator's call |
| C6 leaf prompt | The research prompt pack says the workflow patches the first iteration record with `executor`. On a ledger-backed run it never did, and after C6 the executor lives on the `iteration_start` row. The prompt is outside C6 and is noted here, not changed |
<!-- /ANCHOR:log -->
