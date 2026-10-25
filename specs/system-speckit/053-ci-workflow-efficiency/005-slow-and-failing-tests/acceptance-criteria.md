---
title: "Acceptance Criteria: Phase 5: slow-and-failing-tests"
description: "The criteria this packet must satisfy before it may be closed: the three-run parallelism probe with its recorded outcome, the config flip or the two-way shard, the CLI step under 400 s with 5 green runs, the three-workflow re-check and its root causes, the five stale failures, the 10-run streak or a filed cause, no retry, the fast-fail drift step and its negative proof, the same-class inventory, the whole-tree gates and the commit hygiene."
trigger_phrases:
  - "slow and failing tests acceptance criteria"
  - "phase 5 slow and failing tests acceptance criteria"
importance_tier: "important"
contextType: "implementation"
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
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-005-slow-and-failing-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: slow-and-failing-tests

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
**Level:** 3
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | R-id | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|------|-----|---------------------|--------------|--------|--------|
| AC-001 | R19 | REQ-001 | Given the `cli` vitest project, When it runs once serially and three times through a probe config that differs at one setting, Then `scratch/r19-probe.md` holds one serial row and three parallel rows, each with an exit code and a duration, it records exactly one outcome token, and the probe config is gone | `grep -c '^[\|] serial [\|] 1 [\|]' scratch/r19-probe.md` returns `1`; `grep -c '^[\|] parallel [\|] [123] [\|]'` returns `3`; `grep -cE -e '^[\|] serial [\|] [0-9]+ [\|] [0-9]+ [\|] [0-9.]+ [\|]' -e '^[\|] parallel [\|] [0-9]+ [\|] [0-9]+ [\|] [0-9.]+ [\|]'` returns `4`; `grep -c -e '^outcome: parallel$' -e '^outcome: shard$'` returns `1`; `test ! -e .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts` exits `0`. Observed 2026-10-24: `1`, `3`, `4`, `1`, and the probe config is gone. Rows: serial 625.44 s exit 0; parallel 292.33 s exit 0, 305.59 s exit 1, 311.91 s exit 1. The parallel failures are 30 s timeouts with an empty collision log; the planned rules did not cover that, so `outcome: shard` rests on the operator ruling of 2026-10-24, written after the data (disclosed in ADR-001 and in `scratch/r19-probe.md`). | Met | - |
| AC-002 | R20 | REQ-002 | Given `.skilled/skills/system-spec-kit/vitest.config.ts` and the check job, When the probe recorded `parallel`, Then the `cli` project sets `fileParallelism: true` with a behavioural reason, the root project still sets `false`, and the comment says only the CLI project runs in parallel; When it recorded `shard`, Then `spec-kit-check.yml` runs the project as two concurrent processes with roughly equal run time and exits non-zero when either fails | Shard branch, as built (a hand-balanced split in place of `--shard`): `grep -c -- '--exclude' .github/workflows/spec-kit-check.yml` returns `1`; `grep -c 'wait "[$]first" [\|][\|] status=1'` returns `1` and `grep -c 'wait "[$]second" [\|][\|] status=1'` returns `1`; `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/spec-kit-check.yml'))"` exits `0`. Observed 2026-10-24: `1`, `1`, `1`, `YAML_OK`. Local check, one process after the other: the `upgrade-legacy` file alone exit 0 in 313.90 s, the other 182 files exit 0 in 356.56 s, together 2062 passed and 20 skipped like the serial run. `vitest.config.ts` is unmodified, so the `fileParallelism: true` greps of the parallel branch do not apply (ADR-002 and ADR-003 amendments). The CI step time is AC-003's. | Met | - |
| AC-003 | R20 | REQ-003 | Given the five green `Spec-Kit Check` runs on main whose head contains 04d9b0c84f (the runs of the green streak), When the `CLI vitest project` step of each is timed, Then the median of the five step times is under 400 s and all five runs are green (operator ruling of 2026-10-24, ADR-003 amendment) | `scratch/r20-ci-step.md` holds exactly five `[\|] after [\|]` rows and `awk -F'[\|]' '/^[\|] after [\|]/ {gsub(/ /,"",$6); v[++n]=$6+0} END {for(i=2;i<=n;i++){x=v[i];j=i-1;while(j>0&&v[j]>x){v[j+1]=v[j];j--};v[j+1]=x} if(n==5&&v[3]<400){print "MEDIAN_UNDER_400";exit 0} print "NOT_MET";exit 1}'` exits `0` and prints `MEDIAN_UNDER_400`; the reference row reads `791`; `grep -c '^all_green: true$'` returns `1`; the `## Green streak` section holds `5` run rows, all `success`. Observed 2026-10-25: five of five runs, all `success`, the first five consecutive green runs on main since 75b27df21c, each with a head that contains 04d9b0c84f. The `CLI vitest project` step read 459 s (40102448836), 299 s (40107239895), 313 s (40123498034), 451 s (40125544852) and 467 s (40147796034, head 8ff7da700d). Sorted they read 299, 313, 451, 459 and 467, so the median is 451 s. The awk check prints `NOT_MET` and exits `1`: the bar of under 400 s is not met, and the median is 51 s over it. The other conditions hold: `scratch/r20-ci-step.md` holds five `after` rows, the reference row reads `791`, `grep -c '^all_green: true$'` returns `1` and the `## Green streak` section holds `5` run rows, all `success`. Against the 791 s reference the median is a 43 percent cut ((791 - 451) / 791 = 0.4298), and the five samples span 299 to 467 s, which is the runner spread. The row is waived by the operator's ruling of 2026-10-25 (ADR-011) and is not Met, and the 400 s bar stays in this row. Two later runs sit outside the five and are listed in `scratch/r20-ci-step.md` only: run 40149635448 on 03abdb20d8 was red for a cause unrelated to this phase (a workflow-condition assertion in `tests/trigger-index-rebuild-workflow.vitest.ts` changed by another phase and fixed in 1fd95b59cd), and a sixth green run, 40170908787 at 1fd95b59cd, read 324 s as an aside. The two runs of the superseded count-based split read 643 s (run 40090109005) and 482 s (run 40094302049). | Waived | ADR-011, operator ruling of 2026-10-25 |
| AC-004 | R21 | REQ-004 | Given the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress, When `scratch/r21-recheck.md` is read, Then it has one run table and one summary row per workflow, and every failure class in the window has a root-cause row naming the failing test, the error class and the first failing SHA | `grep -c '^## .* runs$' scratch/r21-recheck.md` returns `3`; `grep -c '^[\|] run id [\|] createdAt [\|] headSha [\|] conclusion [\|]$'` returns `3`; `grep -cE '^[\|] [a-z-]+ [\|] [0-9]+ [\|] [0-9]+ [\|] [0-9]+ [\|]$'` returns `3`; the `## Root causes` rows each carry a seven-character SHA: `sed -n '/^## Root causes/,/^## Contract/p'` piped to `grep -cE '[\|] [0-9a-f]{7} [\|]'` returns `5`, one row per failure class (deep-loop-runtime has three). Observed 2026-10-24: `3`, `3`, `3`, `4`; skill-advisor-stress was re-pulled and reads 40 runs, 10 failures, 7 consecutive greens. Re-run 2026-10-25 after the `jsonl-repair` row joined the Root causes table: `3`, `3`, `3`, `5`. The earlier count of `4` was written before that third deep-loop-runtime class existed, and the count of `5` is the current one. | Met | - |
| AC-005 | R21 | REQ-005 | Given the five workflows with a single old failure, When each failure and the newest run are read, Then `scratch/r21-recheck.md` records one row per workflow with the failure date, the failure SHA, the failure run id, a later green run and the verdict `closed` | `sed -n '/^## Stale failures/,/^## No-retry/p' scratch/r21-recheck.md` piped to `grep -c '^[\|] [a-z-]* [\|] 20'` returns `5`; the same piped to `grep -c '[\|] closed [\|]$'` returns `5`; the dates read `2026-09-18`, `2026-10-12`, `2026-10-20`, `2026-10-24` and `2026-09-07`; every newest run reads `success`. Observed 2026-10-24: `5` and `5`, with every newest run `success` in `gh run list`. The routing-registry-drift date is `2026-10-24` instead of the planned `2026-10-17`: its newest failures are `e3beac6` and `db30b0f` (stale compiled skill graph), fixed by `1218b94938` with all 15 runs on that commit `success`, and the operator ruled on 2026-10-24 to close it on that evidence (ADR-010 amendment). | Met | - |
| AC-006 | R21 | REQ-006 | Given the three workflows after their fixes, When their latest 10 runs are read, Then all 10 are `success` for each, or `scratch/r21-recheck.md` has a `filed` root-cause row for a workflow that stays red | `grep -c 'all_green=true count=10$' scratch/r21-recheck.md` returns `3`, or `grep -c '[\|] filed:'` returns at least `1` for each workflow whose line reads `all_green=false` and that is red. Observed 2026-10-24: `diagram-corpus: all_green=true count=10` (true-line count `1`); its ten runs include seven `workflow_dispatch` reruns of the workflow, not natural runs. `deep-loop-runtime: all_green=false count=10` is red (open Dependabot pull request) and carries a `filed:` row (count `1`). `skill-advisor-stress: all_green=false count=10` was not red on 2026-10-24. Re-pulled 2026-10-25 (`scratch/r21-recheck.md`, section Window re-pull): skill-advisor-stress and diagram-corpus each read ten `success`, but deep-loop-runtime had a new failure on main, run 40107240026 at e00fef3 (`.skilled/skills/system-deep-loop/runtime/tests/unit/jsonl-repair.vitest.ts:461`, expected 9 records, got 8). A read-only investigation on 2026-10-25 recorded a suspected cause, a stale-lock reclaim race in the shared writer lock, as INFERRED and not reproduced. Closure read 2026-10-25 (`scratch/r21-recheck.md`, section Window re-pull at closure), with `gh run list --workflow <name>.yml --limit 10 --json conclusion` (deep-loop-runtime with `--branch main`): diagram-corpus and skill-advisor-stress each read ten `success`, and deep-loop-runtime reads nine `success` and one `failure`, run 40107240026, with the four later main runs `success`. By the operator's ruling of 2026-10-25 the writer-lock race goes to a separate change, packet `specs/system-deep-loop/041-writer-lock-stale-reclaim-race` (the folder exists as a scaffold on 2026-10-25), and the Root causes row for the failure now carries a `filed:` action naming it. Observed counts: `grep -c 'all_green=true count=10$'` returns `1`, not `3`, so the first branch does not apply. `grep -c '[\|] filed:'` returns `2` over the file and `2` over the deep-loop-runtime rows (the Dependabot failure and the writer-lock race). The deep-loop-runtime row naming `specs/system-deep-loop/041-writer-lock-stale-reclaim-race` counts `1`. deep-loop-runtime is the only red workflow. The `all_green=false` line for skill-advisor-stress in the `Green streaks` section is the 2026-10-24 reading from before its older failures left the window, and it is not red at closure, so no filed row applies to it. The row is Met through the filed-root-cause branch and not through ten green runs, and the cause behind the filed row stays INFERRED until packet 041 reproduces it. | Met | - |
| AC-007 | R21 | REQ-004 | Given the three workflows, When their files and the diff are searched, Then no retry, rerun or `continue-on-error` was added, and a failed run was never rerun to manufacture a streak | `rg -c -e retry -e rerun -e continue-on-error .github/workflows/deep-loop-runtime.yml .github/workflows/diagram-corpus.yml .github/workflows/skill-advisor-stress.yml` prints nothing and exits `1`; `git diff -U0 -- .github/workflows` piped to `grep -c -e '^[+].*retry' -e '^[+].*rerun' -e '^[+].*continue-on-error'` returns `0`; `grep -c '^retry-proof: clean$' scratch/r21-recheck.md` returns `1`. Observed 2026-10-24: nothing with exit `1`, `0`, `1`. The diff search is scoped to `.github/workflows`, because a whole-tree diff also matches this packet's own documents. | Met | - |
| AC-008 | Gates | REQ-007 | Given the final tree, When the gates run, Then the fixture suite, the real-tree gate, the YAML parse and the strict packet validation all pass | `scratch/gate-run.md` quotes the lines of `scratch/gate-run.log`: one `check-gate-inputs: <N> passed, 0 failed`, one `RESULT: PASSED` and one `YAML_OK`; `scratch/validate.md` quotes the strict validation line `RESULT: PASSED`. Observed 2026-10-24 after the rebalance: `check-gate-inputs: 54 passed, 0 failed`, `files=45 inputs_resolved=236 dynamic_inputs=9 twin_pairs=340 failures=0` then `RESULT: PASSED`, `YAML_OK`; `grep -c '^RESULT: PASSED$' scratch/validate.log` returned `1`. Gates re-run 2026-10-25 from the worktree root: `check-gate-inputs: 57 passed, 0 failed`, then `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` and `RESULT: PASSED`, and `YAML_OK` for every workflow file. The counts moved from 54 and 236 because other phases changed the tree since 2026-10-24 (INFERRED, since both runs print `failures=0`). Strict validation at closure 2026-10-25: `AC_CLOSURE: 11/11 criteria met, waived or superseded; packet is closeable`, `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, quoted in `scratch/validate.md`. | Met | - |
| AC-009 | R21 | REQ-004 | Given the deep-loop drift class, When the workflow is read and a stale contract is swapped in, Then the fast-fail step sits above the suite, a stale contract exits `2` with `STALE_SOURCE_DIGEST`, a fresh tree exits `0`, and the tree is restored | `grep -c 'check-contract-drift' .github/workflows/deep-loop-runtime.yml` returns `1`; `grep -n -e 'check-contract-drift' -e '- name: Run the deep-loop runtime suites'` puts the checker above the suite; `grep -c '^negative-proof: exit 2 then exit 0$' scratch/r21-recheck.md` returns `1`; `git status --short -- .skilled/commands/deep/assets/compiled/` prints nothing. Observed 2026-10-24: `1`, the checker at line `66` above the suite at line `68`, `1`, nothing; the checker on the current tree printed `[CONTRACT DRIFT] OK commands=3` with exit `0`. | Met | - |
| AC-010 | Hygiene | REQ-007 | Given the two commits, When their messages and the diff are read, Then neither carries an R-id, a D-id or a phase number, both messages validate, and both end with the packet trailer | `git log -2 --format=%B` piped to `grep -c -e 'R[0-9][0-9]*' -e 'D[0-9][0-9]*' -e 'hase 0[0-9]'` returns `0`; `git log -2 --format=%B` piped to `grep -c '^Spec: system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests$'` returns `2`; each message passes `node .skilled/skills/sk-git/scripts/validate-message.mjs --commit <file>` with exit `0`. Observed 2026-10-25 against the two commits by hash, since `git log -2` no longer points at them: the rebalance commit `04d9b0c84f` and the deep-loop commit `e094a852ed` each print `0` for the ephemeral-id grep and `1` for the trailer grep, and each message passes `validate-message.mjs --commit` with exit `0`. The ephemeral-label search over each commit's added lines prints `0` (the two commits change only `.github/workflows/spec-kit-check.yml` and `.github/workflows/deep-loop-runtime.yml`). The earlier count-based shard commit `b2a1663ee9` passes as well. | Met | - |
| AC-011 | R20 | REQ-002 | Given the five `fileParallelism` sites in four files, When the tree is searched, Then only the `cli` site changed and the four other sites still set `false` | `rg -c fileParallelism .skilled/skills --glob 'vitest.config.ts'` lists `4` files with `5` sites in all (the system-spec-kit `vitest.config.ts` carries `2`); `grep -c 'fileParallelism: true' .skilled/skills/system-spec-kit/vitest.config.ts` returns `1` on the parallel branch, `0` on the shard branch; `rg -c 'fileParallelism: false'` over the four files returns `5` sites. Observed 2026-10-24 on the shard branch: four files, five sites, all `false`, `fileParallelism: true` count `0`, and `git status --short -- .skilled/skills` prints nothing. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Ten rows are `Met` (AC-001, 002, 004, 005, 006, 007, 008, 009, 010, 011), one is `Waived` (AC-003) and none is `Unmet`, eleven rows in all. AC-003 is waived, not met: the five consecutive green post-change `Spec-Kit Check` runs read 459, 299, 313, 451 and 467 s for the `CLI vitest project` step. The median is 451 s against the bar of under 400 s, so the row's own check prints `NOT_MET`. The operator ruled on 2026-10-25 to close it by waiver (ADR-011), with the 43 percent cut against the 791 s reference and the 299 to 467 s runner spread on record. AC-006 is met through its filed-root-cause branch: skill-advisor-stress and diagram-corpus read ten `success` each, and deep-loop-runtime, the only red workflow, carries a `filed:` row that sends the writer-lock race in `tests/unit/jsonl-repair.vitest.ts` to `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`. The strict packet validation prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
