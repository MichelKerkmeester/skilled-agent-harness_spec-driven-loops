---
title: "Goal: Phase 5: slow-and-failing-tests"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
    last_updated_at: "2026-10-25T07:20:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed AC-003 by waiver and AC-006 by a filed row, with ten Met and one Waived"
    next_safe_action: "Phase closed; no further work in this phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-005-slow-and-failing-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: slow-and-failing-tests

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Cut the spec-kit check job's slowest step by proving file parallelism safe and flipping or sharding the CLI vitest project, and turn the three workflows' stale failure counts into a current, root-caused signal without adding a retry.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The probe runs on a copy of the config that differs at one setting, and the copy is deleted before the real file is touched. |
| G2 | Only the `cli` project flips. The root project and the other three `fileParallelism` sites stay serial. |
| G3 | The fallback is a two-way shard inside the existing step, with both halves' status propagated. No job count or check name changes. |
| G4 | The setting's comment states behaviour, never a packet id, an R-id or a phase number. |
| G5 | The failure counts are re-pulled at execution time; the research phase's numbers are a sanity check, not a source. |
| G6 | Causes are fixed. No retry, rerun or `continue-on-error` is added, and a failed run is never rerun to manufacture a streak. |
| G7 | A workflow that stays red gets a filed root cause naming the test, the class and the first failing SHA. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -cE '^outcome: (parallel|shard)$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md` returns `1`
- [x] `test ! -e .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts` exits `0`
- [x] `grep -c 'fileParallelism: true' .skilled/skills/system-spec-kit/vitest.config.ts` returns `1`, or `grep -c -- '--exclude' .github/workflows/spec-kit-check.yml` returns `1`
- [x] `grep -c '^all_green: true$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md` returns `1`
- [x] `grep -c '| closed |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md` returns `5`
- [x] `grep -cE '^(deep-loop-runtime|diagram-corpus|skill-advisor-stress): all_green=true count=10$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md` returns `3`, or the one workflow that stays red (deep-loop-runtime) carries a filed root cause per G7: `grep '^[|] deep-loop-runtime [|]' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md` piped to `grep -c '[|] filed:'` returns `2`
- [x] `grep -c 'check-contract-drift' .github/workflows/deep-loop-runtime.yml` returns `1`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` T001 to T040, `acceptance-criteria.md` AC-001 to AC-011, `decision-record.md` ADR-001 to ADR-010 (ADR-011 added at closure) |
| Probe | Done, with a disclosed deviation | `scratch/r19-probe.md` records the serial and three parallel runs. Parallel runs 2 and 3 failed on 30 s timeouts with an empty collision log, so the planned rules would have stopped as unclassified; the operator ruled on 2026-10-24, after the data, to count parallel-only timeouts as a concurrency result and take the shard |
| Config flip or shard | Done, rebalanced | The probe selected the shard. `spec-kit-check.yml` now runs two concurrent processes in the existing step: the `upgrade-legacy` file alone and every other file through `--exclude`, both statuses propagated. Locally 313.90 s and 356.56 s, both exit 0 |
| Re-check | Done | `scratch/r21-recheck.md` holds the three 40-run tables, five root-cause rows, the drift verdict, five stale-failure rows closed (routing-registry-drift on the operator's ruling), and the no-retry proof scoped to `.github/workflows` |
| Implementation | Done | The rebalanced split (`04d9b0c84f`) and the fast-fail drift step (`e094a852ed`) are committed; the drift step was proven against a stale contract (exit 2, then exit 0) |
| CLI step measurement | Done, waived | The count-based split read 643 s and 482 s, both over 400 s. The rebalanced split read 459 s (40102448836), 299 s (40107239895), 313 s (40123498034), 451 s (40125544852) and 467 s (40147796034) on five consecutive green runs: a median of 451 s, over the 400 s bar and a 43 percent cut against the 791 s reference. The operator waived AC-003 on 2026-10-25 (ADR-011) |
| Streaks | Done | Read at closure 2026-10-25: diagram-corpus and skill-advisor-stress each read ten `success`. deep-loop-runtime reads nine `success` and one `failure` (run 40107240026, `tests/unit/jsonl-repair.vitest.ts:461`), and that failure is filed as `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`. Spec-Kit Check has its five post-rebalance green runs |
| Acceptance | 10 Met and 1 Waived of 11 | AC-003 is Waived (ADR-011) and AC-006 is Met through its filed-root-cause branch. AC-010 is Met on commits `04d9b0c84f` and `e094a852ed` |

### Deviations and findings

| Item | Note |
|------|------|
| deep-loop-runtime carries a second failure class | The newest run `40080059696` (`e4af508`, 2026-10-24) failed `tests/unit/dependency-seams.vitest.ts` on `expected '4.6.6' to be '4.4.3'` — the runtime's zod pin drifted from the test's `PINNED` map; this tree already pins `4.4.3` in both places |
| Root-cause table holds five rows, not three | The re-check names three distinct classes for deep-loop-runtime (the stale contract, the Dependabot pin drift and the writer-lock race), so one row per class gives five rows |
| routing-registry-drift is not a single old failure | It failed again on 2026-10-24 at `db30b0f` and `e3beac6` (`STALE COMPILED skill-graph.json`, sk-code stamp), then went green at `40089725657`; the stale-confirmation Stop-if fired |
| The count-based shard missed the 400 s ceiling | Two runs read 643 s and 482 s; one file, `upgrade-legacy`, takes about half of the serial time, so the halves were 145 s and 562 s. The operator ruled on 2026-10-24 to keep two shards and rebalance by hand; the ceiling is not relaxed |
| The probe outcome rests on an operator ruling | The planned rules covered only collision tokens, so the 30 s parallel-only timeouts would have stopped the script as unclassified. The operator ruled on 2026-10-24, after the data, to count them as a concurrency result and take the shard (ADR-001) |
| routing-registry-drift closed on the operator's ruling | Its newest failures are dated 2026-10-24, not the planned 2026-10-17; they are a stale compiled skill graph fixed by `1218b94938`, with all 15 runs on that commit green (ADR-010) |
| The shard commit body is corrected | The scripted body said the runs collided on a fixture; the probe found no collision, only 30 s timeouts under load, and the committed body says so |
| skill-advisor-stress is windowed, not red | Seven consecutive greens on 2026-10-24; by 2026-10-25 its latest ten runs are all `success`, so the window no longer holds it back |
| deep-loop-runtime has a new main failure, filed | Run 40107240026 at e00fef3 failed one concurrent-writer case in `tests/unit/jsonl-repair.vitest.ts` (expected 9 records, got 8). The four later main runs passed with no change under the runtime directory. The suspected cause, a stale-lock reclaim race in the shared writer lock, is INFERRED and not reproduced. The operator ruled on 2026-10-25 to send it to `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`, and the Root causes row carries a `filed:` action naming it |
| AC-003 closes by waiver, not by the bar | The median of the five runs is 451 s against the bar of under 400 s, and the AC-003 awk check prints `NOT_MET`. The operator ruled on 2026-10-25 to waive the row (ADR-011), with the 43 percent cut and the 299 to 467 s runner spread noted |
| One red Spec-Kit Check run sits between the fifth and sixth runs | Run 40149635448 on 03abdb20d8 failed `tests/trigger-index-rebuild-workflow.vitest.ts:809`, a workflow-condition assertion that another phase changed and 1fd95b59cd fixed. It is listed in `scratch/r20-ci-step.md` and is not one of the five |
| The third completion criterion carries the G7 branch | Its literal count of `3` cannot hold while deep-loop-runtime has a failure in its window, so the line now also accepts the filed root cause that G7 and AC-006 already allow |
<!-- /ANCHOR:log -->
