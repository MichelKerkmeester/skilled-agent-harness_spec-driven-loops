---
title: "Implementation Summary"
description: "Built and measured: the probe selected a two-way split of the spec-kit CLI vitest project, hand-balanced after the count-based shard stayed over the 400 s ceiling; the three-workflow re-check is root-caused, the five old failures are closed, and a fast-fail contract-drift step guards deep-loop-runtime. All eleven acceptance rows are closed: ten Met and AC-003 waived by the operator."
trigger_phrases:
  - "slow and failing tests implementation summary"
importance_tier: "normal"
contextType: "general"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-slow-and-failing-tests |
| **Completed** | 2026-10-25: ten rows Met and AC-003 Waived by the operator's ruling (ADR-011) |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three-run parallelism probe ran on a copy of the config. Two of the three parallel runs failed on 30 s test timeouts while the serial run passed and the collision log stayed empty; the operator ruled on 2026-10-24, after the data, to count that as a concurrency result and take the shard (a disclosed deviation from the planned rule). The first split was count-based (`--shard=1/2` and `--shard=2/2`, `b2a1663ee9`) and read 643 s and 482 s on CI, still over the ceiling, because one file, `upgrade-legacy`, takes about half of the serial time. The operator then ruled to rebalance by hand: `.github/workflows/spec-kit-check.yml` now runs that file alone and every other file through `--exclude`, as two concurrent processes in the existing step, failing when either fails. That change is committed as `04d9b0c84f`. `scratch/r21-recheck.md` holds the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress, five root-cause rows, the five old failures recorded closed, the no-retry proof and the streaks. `.github/workflows/deep-loop-runtime.yml` gains a `check-contract-drift.cjs` step above the suite, proven to exit 2 on a stale contract and 0 once restored; that edit is committed as `e094a852ed`.

### Phase 5: slow-and-failing-tests

Measured, not planned. Serial run 625.44 s; the three parallel runs 292.33 s (pass), 305.59 s (one timeout) and 311.91 s (one timeout). The count-based halves ran locally in 145.13 s and 561.58 s. On CI the `CLI vitest project` step read 791 s before the change and 643 s and 482 s with the count-based split; the reference moved between 776 s and 950 s across planning samples, so those two samples show no established gain. The rebalanced halves ran locally in 313.90 s (the heavy file, 67 tests) and 356.56 s (182 files, 1995 passed, 20 skipped), together equal to the serial run's 2062 passed and 20 skipped. Five consecutive green CI runs on main have used the rebalanced split and read 459, 299, 313, 451 and 467 s: a median of 451 s, a 43 percent cut against the 791 s reference and 51 s over the 400 s bar, with a runner spread of 299 to 467 s. The operator waived AC-003 on 2026-10-25 (ADR-011). The deep-loop-runtime failure in `tests/unit/jsonl-repair.vitest.ts` is filed to `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/spec-kit-check.yml` | Modified: count-based split committed in `b2a1663ee9`, rebalanced split committed in `04d9b0c84f` | Two concurrent processes in the `CLI vitest project` step with both statuses propagated: the `upgrade-legacy` file alone, and every other file |
| `.github/workflows/deep-loop-runtime.yml` | Modified, committed in `e094a852ed` | A `check-contract-drift.cjs` step above the suite, so a stale compiled contract fails in seconds |
| `.skilled/skills/system-spec-kit/vitest.config.ts` | Not changed | The shard branch leaves `fileParallelism: false` in place |
| `.skilled/commands/deep/assets/compiled/` | Not changed | The drift verdict was `fresh`, so nothing was regenerated |
| `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md`, `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Not changed | diagram-corpus and skill-advisor-stress closed green on their newest runs |
| `scratch/r19-probe.md`, `scratch/r20-ci-step.md`, `scratch/r21-recheck.md`, `scratch/gate-run.md`, `scratch/validate.md` | Created | The probe rows, run environments and quoted log lines; the CI step samples, per-file timings and the rebalanced split check; the re-check tables and root causes; the gate and validation lines |
| `scratch/r19-*.log`, `scratch/r20-split-*.log`, `scratch/r21-*-failures.log`, `scratch/gate-run.log`, `scratch/validate.log`, `scratch/r21-*-runs.json` | Created, logs gitignored | Raw evidence; the deciding lines are quoted in the `.md` files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Through `tasks.md` in order. T001 to T032 are done, with the probe outcome (T010) and the routing-registry-drift row (T029) resting on operator rulings, and T004 recording its failed first attempt. T033 is done (`e094a852ed`). T034 and T035 are done: five green runs are read, the median is 451 s and AC-003 is waived. T036 and T037 are done: diagram-corpus and skill-advisor-stress read ten greens, and deep-loop-runtime holds the filed Dependabot failure plus the writer-lock failure filed to a separate packet. T038 and T039 are done, and T040 is left to the orchestrator. Amendments dated 2026-10-24 in `decision-record.md` cover the probe ruling (ADR-001), the skipped flip (ADR-002), the rebalance (ADR-003) routing-registry-drift (ADR-010) and, dated 2026-10-25, the AC-003 waiver (ADR-011).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Probe on a copy, then change the real config | The real file stayed untouched; the copy is deleted |
| Accept the shard on parallel-only timeouts, disclosed | The planned rule named only collision tokens; the operator ruled after the data, and the deviation is recorded in ADR-001 |
| Keep `fileParallelism: false` and split the step | The probe was not clean three times, so no flip |
| Hand-balance the two processes around the heavy file | A file-count shard cannot divide one file that is half the serial time; the ceiling is not relaxed |
| Fix causes and add no retry | The scoped no-retry proof returned `0` lines and `retry-proof: clean` |
| Fail a stale contract in seconds | The checker runs first; on the current tree it exits 0 |
| File a cause only for a workflow that is red | deep-loop-runtime has an open Dependabot pull request and a writer-lock failure filed to a separate packet. skill-advisor-stress is not red, so no filed row applies to it |
| Waive AC-003 on the measured median | The median of five green runs is 451 s against the 400 s bar. The operator ruled on 2026-10-25 to waive the row with the figures on record (ADR-011) |
| Close routing-registry-drift on today's evidence | The operator ruled on its 2026-10-24 failures and the `1218b94938` fix |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Probe rows and `outcome` token in `scratch/r19-probe.md` | `1`, `3`, `4`, `1`; probe config gone (AC-001 Met) |
| `grep -c -- '--exclude' .github/workflows/spec-kit-check.yml`, the two waits, YAML | `1`, `1`, `1`, `YAML_OK`; local halves 313.90 s and 356.56 s (AC-002 Met) |
| The `CLI vitest project` step on CI | Count-based split 643 s and 482 s; rebalanced split 459, 299, 313, 451 and 467 s (median 451 s, 43 percent below the 791 s reference), judged on the median of five green runs by the 2026-10-24 ruling, and the AC-003 awk check prints `NOT_MET` (AC-003 Waived, ADR-011) |
| Root-cause rows with a seven-character SHA | `5` (AC-004 Met) |
| Stale-failure rows and `closed` verdicts | `5` and `5` (AC-005 Met) |
| The three workflows' streaks | Closure read 2026-10-25: diagram-corpus and skill-advisor-stress ten `success` each. deep-loop-runtime nine `success` and one `failure`, filed as `specs/system-deep-loop/041-writer-lock-stale-reclaim-race` beside the filed Dependabot failure (AC-006 Met through the filed row) |
| `rg -c` over the three workflows; scoped diff search; `retry-proof: clean` | exit `1` with no output, `0`, `1` (AC-007 Met) |
| Gates: fixture suite, real-tree gate, YAML parse; strict validation | `54 passed, 0 failed`, `RESULT: PASSED`, `YAML_OK`; `RESULT: PASSED` on 2026-10-24. Re-run at closure on 2026-10-25: `57 passed, 0 failed`, `failures=0` then `RESULT: PASSED`, `YAML_OK`, and the strict validation prints `RESULT: PASSED` (AC-008 Met) |
| The fast-fail step against a stale contract | exit `2` with `STALE_SOURCE_DIGEST`, then exit `0` (AC-009 Met) |
| Commits | `04d9b0c84f` and `e094a852ed`: no ephemeral id, trailer present, validator exit `0` (AC-010 Met) |
| `fileParallelism` sites | `5` sites in `4` files, all `false` (AC-011 Met) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CI step median is over the 400 s bar.** The count-based split read 643 s and 482 s. The rebalanced split is checked locally (313.90 s and 356.56 s) and read 459, 299, 313, 451 and 467 s on CI, a median of 451 s. AC-003 is waived by the operator's ruling of 2026-10-25 (ADR-011). The hand-kept split can drift: a new slow file, or a rename of the heavy one, changes the balance.
2. **The 400 s ceiling is absolute, not a ratio.** The step's planning samples span 776 to 950 s, so the acceptance reads the median of five post-change runs rather than a percentage of 791.
3. **Concurrent halves on CI versus sequential halves locally.** If flakes appear, consider per-shard logs or a higher `testTimeout`.
4. **Two workflows cannot be dispatched.** deep-loop-runtime and skill-advisor-stress have no `workflow_dispatch`, so their 10-run streaks wait on repository traffic. skill-advisor-stress now reads ten greens; deep-loop-runtime holds a filed Dependabot failure and a main failure in `tests/unit/jsonl-repair.vitest.ts` filed to `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`. Its suspected cause, a stale-lock reclaim race in the shared writer lock, is INFERRED and not reproduced.
5. **The five stale failures are recorded, not fixed.** A later green run proves each one stale, and no file outside this phase changes for them.
<!-- /ANCHOR:limitations -->

---
