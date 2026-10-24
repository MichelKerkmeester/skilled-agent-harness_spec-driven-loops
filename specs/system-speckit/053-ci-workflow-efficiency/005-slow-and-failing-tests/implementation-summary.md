---
title: "Implementation Summary"
description: "Built and measured: the probe selected a two-way split of the spec-kit CLI vitest project, hand-balanced after the count-based shard stayed over the 400 s ceiling; the three-workflow re-check is root-caused, the five old failures are closed, and a fast-fail contract-drift step guards deep-loop-runtime. Two acceptance rows stay Unmet."
trigger_phrases:
  - "slow and failing tests implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
    last_updated_at: "2026-10-25T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded CI step samples 3 and 4 and the commits"
    next_safe_action: "Time the fifth green Spec-Kit Check run on main, then re-read the deep-loop-runtime window"
    blockers:
      - "002-rebuild-fanout-removal baseline pending; the 001 dataset stands in as provisional"
      - "AC-003 has 4 of 5 post-change runs (median 382 s so far); the fifth green run on main decides it"
      - "deep-loop-runtime has an open main failure (jsonl-repair, run 40107240026) with no root cause or filed row; AC-006 is Unmet for it"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-005-slow-and-failing-tests"
      parent_session_id: null
    completion_pct: 92
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
| **Completed** | Not closed: AC-003 and AC-006 are Unmet |
| **Level** | 3 |
| **Status** | In progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three-run parallelism probe ran on a copy of the config. Two of the three parallel runs failed on 30 s test timeouts while the serial run passed and the collision log stayed empty; the operator ruled on 2026-10-24, after the data, to count that as a concurrency result and take the shard (a disclosed deviation from the planned rule). The first split was count-based (`--shard=1/2` and `--shard=2/2`, `b2a1663ee9`) and read 643 s and 482 s on CI, still over the ceiling, because one file, `upgrade-legacy`, takes about half of the serial time. The operator then ruled to rebalance by hand: `.github/workflows/spec-kit-check.yml` now runs that file alone and every other file through `--exclude`, as two concurrent processes in the existing step, failing when either fails. That change is committed as `04d9b0c84f`. `scratch/r21-recheck.md` holds the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress, four root-cause rows, the five old failures recorded closed, the no-retry proof and the streaks. `.github/workflows/deep-loop-runtime.yml` gains a `check-contract-drift.cjs` step above the suite, proven to exit 2 on a stale contract and 0 once restored; that edit is committed as `e094a852ed`.

### Phase 5: slow-and-failing-tests

Measured, not planned. Serial run 625.44 s; the three parallel runs 292.33 s (pass), 305.59 s (one timeout) and 311.91 s (one timeout). The count-based halves ran locally in 145.13 s and 561.58 s. On CI the `CLI vitest project` step read 791 s before the change and 643 s and 482 s with the count-based split; the reference moved between 776 s and 950 s across planning samples, so those two samples show no established gain. The rebalanced halves ran locally in 313.90 s (the heavy file, 67 tests) and 356.56 s (182 files, 1995 passed, 20 skipped), together equal to the serial run's 2062 passed and 20 skipped. Four CI runs on main have used the rebalanced split and read 459, 299, 313 and 451 s (median 382 s); the fifth run decides AC-003.

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

Through `tasks.md` in order. T001 to T032 are done, with the probe outcome (T010) and the routing-registry-drift row (T029) resting on operator rulings, and T004 recording its failed first attempt. T033 is done (`e094a852ed`). T034 and T035 wait on the fifth CI run (four of five read). T036 and T037 are partial: diagram-corpus and skill-advisor-stress read ten greens, and deep-loop-runtime holds the filed Dependabot failure plus a new main failure recorded open. T038 and T039 are done, and T040 is left to the orchestrator. Amendments dated 2026-10-24 in `decision-record.md` cover the probe ruling (ADR-001), the skipped flip (ADR-002), the rebalance (ADR-003) and routing-registry-drift (ADR-010).
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
| File a cause only for a workflow that is red | deep-loop-runtime has an open Dependabot pull request; skill-advisor-stress is windowed, not red, so its criterion stays Unmet |
| Close routing-registry-drift on today's evidence | The operator ruled on its 2026-10-24 failures and the `1218b94938` fix |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Probe rows and `outcome` token in `scratch/r19-probe.md` | `1`, `3`, `4`, `1`; probe config gone (AC-001 Met) |
| `grep -c -- '--exclude' .github/workflows/spec-kit-check.yml`, the two waits, YAML | `1`, `1`, `1`, `YAML_OK`; local halves 313.90 s and 356.56 s (AC-002 Met) |
| The `CLI vitest project` step on CI | Count-based split 643 s and 482 s; rebalanced split 459, 299, 313 and 451 s (median 382 s), judged on the median of five green runs by the 2026-10-24 ruling, awaiting run 5 of 5 (AC-003 Unmet) |
| Root-cause rows with a seven-character SHA | `4` (AC-004 Met) |
| Stale-failure rows and `closed` verdicts | `5` and `5` (AC-005 Met) |
| The three workflows' streaks | Re-pulled 2026-10-25: diagram-corpus and skill-advisor-stress ten `success` each; deep-loop-runtime red with the filed Dependabot failure and a new main failure recorded open (AC-006 Unmet) |
| `rg -c` over the three workflows; scoped diff search; `retry-proof: clean` | exit `1` with no output, `0`, `1` (AC-007 Met) |
| Gates: fixture suite, real-tree gate, YAML parse; strict validation | `54 passed, 0 failed`, `RESULT: PASSED`, `YAML_OK`; `RESULT: PASSED` (AC-008 Met) |
| The fast-fail step against a stale contract | exit `2` with `STALE_SOURCE_DIGEST`, then exit `0` (AC-009 Met) |
| Commits | `04d9b0c84f` and `e094a852ed`: no ephemeral id, trailer present, validator exit `0` (AC-010 Met) |
| `fileParallelism` sites | `5` sites in `4` files, all `false` (AC-011 Met) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CI step time is judged on five runs, and four exist.** The count-based split read 643 s and 482 s; the rebalanced split is checked locally (313.90 s and 356.56 s) and read 459, 299, 313 and 451 s on CI, a running median of 382 s. The median rule (operator ruling of 2026-10-24) cannot decide until a fifth green run on main is timed. The hand-kept split can drift: a new slow file, or a rename of the heavy one, changes the balance.
2. **The 400 s ceiling is absolute, not a ratio.** The step's planning samples span 776 to 950 s, so the acceptance reads the median of five post-change runs rather than a percentage of 791.
3. **Concurrent halves on CI versus sequential halves locally.** If flakes appear, consider per-shard logs or a higher `testTimeout`.
4. **Two workflows cannot be dispatched.** deep-loop-runtime and skill-advisor-stress have no `workflow_dispatch`, so their 10-run streaks wait on repository traffic. skill-advisor-stress now reads ten greens; deep-loop-runtime holds a filed Dependabot failure and a new main failure in `tests/unit/jsonl-repair.vitest.ts` that is recorded open, with no root cause yet.
5. **The five stale failures are recorded, not fixed.** A later green run proves each one stale, and no file outside this phase changes for them.
<!-- /ANCHOR:limitations -->

---
