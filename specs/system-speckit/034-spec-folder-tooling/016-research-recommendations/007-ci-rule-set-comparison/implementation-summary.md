---
title: "Implementation Summary"
description: "Both CI gates now compare the right thing. The changed-packet gate blocks only on failing rules the base did not already fail, and the weekly sweep fetches the previous run's report as its baseline. Built, reviewed twice and checked locally; no run on GitHub yet."
trigger_phrases:
  - "ci rule set comparison implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison"
    last_updated_at: "2026-10-08T12:24:18Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase on local evidence"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".github/workflows/changed-packet-validation.yml"
      - ".github/workflows/strict-pass-freshness-report.yml"
      - ".github/workflows/README.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-ci-rule-set-comparison |
| **Status** | Complete |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
| **Created** | 2026-10-08 |

### Status

Both workflow changes are built, reviewed in two rounds and **Complete** on local evidence. Eleven tests run the changed-packet gate's and the baseline fetch step's own run blocks, taken from the YAML, against a stub validator and a stub `gh`, and run the real sweep script; they passed again at close. Nothing is pushed, so neither workflow has run on GitHub. The first run there is what shows the real `gh` calls, the `$GITHUB_ENV` handoff and the sweep step on the runner's shell (see Known Limitations).
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The changed-packet gate used to ask whether a packet passed before and fails now. It now asks which failing rules the head has that the base did not. The weekly sweep used to run with no baseline, so every failure read as a first run and the regression warning could never fire. It now downloads the previous run's report and passes it as `--baseline`.

### Changed-packet gate

- **Rule sets, not verdicts.** The step runs `validate.sh --strict --no-recursive --json`. `failing_rules()` (`.github/workflows/changed-packet-validation.yml:98-114`) reads the report and prints the sorted, unique rule names whose entry has status `error`. Warnings are left out because a strict run fails only on `error` entries.
- **Only new rules block.** For each packet that fails at the head, the gate validates the same packet in a worktree of the merge base with this checkout's validator, then runs `comm -23` of the head set against the base set (`.github/workflows/changed-packet-validation.yml:176-178`). A non-empty result is a regression: the error line names the new rules and the packet's human-readable report follows (`.github/workflows/changed-packet-validation.yml:179-183`). An empty result prints `pre-existing` and the packet's failing rules (`.github/workflows/changed-packet-validation.yml:184-187`).
- **Fails closed.** A report that does not parse, has no `entries` list or records a skipped run stops the comparison for that packet and counts it as a regression. That holds for the head copy (`.github/workflows/changed-packet-validation.yml:127-130`, `.github/workflows/changed-packet-validation.yml:158-162`) and for the base copy (`.github/workflows/changed-packet-validation.yml:169-173`).

### Weekly sweep baseline

- **Fetch step.** `Fetch the previous baseline report` (`.github/workflows/strict-pass-freshness-report.yml:53-103`) finds the last successful run of this workflow on the same branch with `gh run list`, downloads its `strict-pass-freshness-report-*` artifact with `gh run download`, locates `report.json`, checks that it has a `results` array and exports `BASELINE_REPORT` through `$GITHUB_ENV`. The job gains `actions: read` (`.github/workflows/strict-pass-freshness-report.yml:19`) and uses its own `github.token`.
- **No baseline is not an error.** No previous run, a failed download, and a missing or unparseable report each print `::notice::No baseline report found; this run records the baseline`, exit 0 and set no variable (`.github/workflows/strict-pass-freshness-report.yml:73-76`, `.github/workflows/strict-pass-freshness-report.yml:80-85`, `.github/workflows/strict-pass-freshness-report.yml:90-98`).
- **Sweep step.** It builds `--baseline "$BASELINE_REPORT"` when the variable is set (`.github/workflows/strict-pass-freshness-report.yml:111-117`) and passes it to the sweep (`.github/workflows/strict-pass-freshness-report.yml:125`).
- **What the sweep does with it.** The sweep script is unchanged. A folder that passed in the baseline and fails now is a `regression`; one the baseline recorded as failing is a `known-failure`; one absent from the baseline is a `new-failure`; with no baseline every failure is `first-run` (`.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:293-307`). The upload step is unchanged and still publishes only `report.json`, so the downloaded baseline is not uploaded again.

### Workflow README

Four places describe the new behavior: the two workflow rows in the checks table (`.github/workflows/README.md:28`, `.github/workflows/README.md:49`) and the two rows in the push versus pull-request table (`.github/workflows/README.md:62`, `.github/workflows/README.md:64`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/changed-packet-validation.yml` | Modified | Rule-set comparison with named new rules and fail-closed handling |
| `.github/workflows/strict-pass-freshness-report.yml` | Modified | `actions: read`, the baseline fetch step, `--baseline` passed to the sweep |
| `.github/workflows/README.md` | Modified | Four rows describing the comparison and the baseline |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Created | 11 tests: 5 gate, 3 sweep, 3 baseline fetch |

The validator (`validate.sh`) and the sweep script were not touched; `git diff` on both is empty.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in wave 2 and reviewed read-only by Luna max fast through cli-codex, in two rounds.

| Round | Findings | Outcome |
|-------|----------|---------|
| 1 | No code finding is recorded. Luna stopped on AC-006, which said packets that "passed before" report as `known-failure` when they still fail | Wording corrected to "failed before" by the orchestrator. See the deviation under Key Decisions |
| 2 | One, F1 (P1): the sweep's baseline-present and baseline-absent scenarios had no test | Applied as two additions, 007-F1 and 007-F2 below |

The round 2 finding was closed by two additions to the test file:

1. **007-F1, sweep scenarios.** First run, pass then fail, and failed then still fails, each through the real sweep script (3 tests).
2. **007-F2, fetch step scenarios.** No previous run, a good report and an unparseable report, each through the step's run block with a stub `gh` (3 tests).

Together with the 5 gate tests, that makes the 11 in the file. The build notes record only F1 for round 2.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A failing rule is an entry with status `error` | A strict run fails only on `error` entries, so warnings would flag rules that never blocked anything |
| Flag head rules absent from the base, not any difference between the sets | A head set that is a subset of the base set is the same debt or less. Flagging it would block authors for failures they did not add |
| Fail closed on a report that does not parse, has no `entries` or records a skipped run | Reading silence as a pass would disable the gate without a sign. The old gate failed closed on a missing verdict line, and this keeps that |
| Baseline from the last successful same-branch run, fetched with `gh` and the job token | A baseline from another branch would compare against different debt. `actions: read` is the one permission added |
| Missing or unreadable baseline runs the sweep without one | The first run has nothing to fetch. It records the baseline for the next run, and an unreadable report would otherwise abort the sweep |
| Sweep script left unchanged | It already classified `regression`, `known-failure`, `new-failure` and `first-run`; only the workflow never gave it a baseline |
| Tests extract the run blocks from the YAML | The asserted outcomes are the workflow's own behavior, not a copy of it that could drift |

### Deviations

1. **AC-006 wording (authoring error).** The criterion said packets that "passed before" report as `known-failure` when they still fail, which contradicts the sweep script: a pass in the baseline that now fails is a `regression`, and a failure that still fails is a `known-failure`. Luna's round 1 stopped on it and the orchestrator corrected both the Then and Verification cells to "failed before". Nothing else in the criterion changed.
2. **Local tests instead of a test PR and a dispatched sweep.** T007 to T009 and the AC verification text name a test PR, a triggered sweep and a downloaded artifact. Before the push they ran as the 11 local tests above, with the fetch step against a stub `gh`; after the push a dispatched sweep confirmed the baseline path live (run 37783711329).
3. **Download mechanism.** plan.md named `actions/download-artifact@v4` with a `run-id` and a fine-grained token. The build uses `gh run download` with the job's own token and `actions: read`. plan.md was updated to match.
4. **No worked examples in the README (T006).** The README describes each workflow in one table row, so the four rows carry the behavior and no example block was added.
5. **"Rule counts" in the plan and SC-002.** The sweep compares each folder's status against the baseline, not rule counts. The observable result SC-002 asks for, zero regressions with `known-failure` rows for unchanged failures, is what the third sweep test shows. plan.md was updated; spec.md's success criterion was left as written.
6. **A test file beyond the three listed.** spec.md lists three files to change. The builder's own test file is allowed by goal decision D4.
7. **Pre-change line numbers.** spec.md cites lines 131-147 of the gate and line 56 of the sweep for the pre-change files. The built comparison is at `.github/workflows/changed-packet-validation.yml:89-188` and the baseline wiring at `.github/workflows/strict-pass-freshness-report.yml:48-126`. plan.md carries the new numbers; spec.md was left as written.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Scenario outcomes (AC-007)

Run 2026-10-08 with `vitest run --config vitest.config.ts --reporter verbose` on `ci-rule-set-comparison.vitest.ts` from `.skilled/skills/system-spec-kit`: 1 file, 11 tests passed, exit 0. The gate scenarios use one fixture packet, `specs/demo/001-fixture`, with a base commit, a head commit and canned validator reports.

| # | Scenario | Setup | Observed outcome | AC |
|---|----------|-------|------------------|----|
| 1 | Gate, pass to fail | Base report passes; head fails `rule-alpha` | Error line containing `Regression` and `new failing rule(s): rule-alpha`, then `BLOCKED: 1 packet(s) regressed in this PR.`, exit 1 | AC-002 |
| 2 | Gate, same rules fail at both | Base and head both fail `rule-alpha` and `rule-shared` | `pre-existing (also fails at the merge base): specs/demo/001-fixture`, `failing rule(s): rule-alpha,rule-shared`, `No regressions: every failing packet already failed at the merge base.`, exit 0 | AC-001 |
| 3 | Gate, fail to fail with different rules | Base fails `rule-alpha`, `rule-shared`; head fails `rule-beta`, `rule-gamma`, `rule-shared` | Error line containing `new failing rule(s): rule-beta,rule-gamma`; `rule-alpha` absent from the output; exit 1 | AC-001, AC-005 |
| 4 | Gate, head report does not parse | Head output is prose; base passes | `Validator produced no verdict for the head copy; failing closed`, exit 1 | Edge case |
| 5 | Gate, base report does not parse | Head fails `rule-alpha`; base output is prose | `Validator produced no verdict for the base copy; failing closed`, exit 1 | Edge case |
| 6 | Sweep, no baseline | A folder claims completion and the stub validator fails it; no `--baseline` | Row status `first-run`, `firstRun` 1, `regressions` 0, exit 0 | AC-004 |
| 7 | Sweep, passed then fails | Baseline lists the folder as `pass`; the validator now fails it | Row status `regression`, `regressions` 1, `firstRun` 0, exit 1 | AC-003 |
| 8 | Sweep, failed then still fails | Baseline lists the folder as `new-failure`; the validator still fails it | Row status `known-failure`, `knownFailures` 1, `regressions` 0, `firstRun` 0, exit 0 | AC-006 |
| 9 | Fetch, no previous run | Stub `gh run list` prints nothing | Exit 0, `::notice::No baseline report found`, no `BASELINE_REPORT` written | AC-004 |
| 10 | Fetch, good report | Stub `gh` returns run 42 and lands `{"results":[]}` under a per-artifact directory | Exit 0; `BASELINE_REPORT` resolves to `.strict-pass-freshness/baseline/strict-pass-freshness-report-1/report.json` and the file exists | AC-006 |
| 11 | Fetch, report does not parse | Stub `gh` returns run 42 and lands `{"results":[` | Exit 0, the same notice, no `BASELINE_REPORT` | AC-004 |

Scenarios 1 to 5 run the gate's run block; on this host (macOS bash 3.2) the test rewrites its associative array to plain variables and shims `paste`, and leaves the comparison command, branches and messages as written. Scenarios 6 to 8 run the real sweep script with a stub validator. Scenarios 9 to 11 run the fetch step's run block with a stub `gh`.

### Checks

| Check | Result |
|-------|--------|
| `ci-rule-set-comparison.vitest.ts` | Exit 0, 11 passed (rerun at close) |
| Same file against the pre-change `changed-packet-validation.yml` | 5 failed, all gate cases (build note, not rerun at close) |
| Both workflow files parse as YAML; every `run:` block passes `bash -n` | PASS (build note) |
| `shellcheck` on the changed gate block | Clean. The other block's warnings are identical at HEAD and come from GitHub `${{ }}` expressions (build note) |
| Real validator report shape: `validate.sh --strict --no-recursive --json` on a throwaway packet with failing rules | `entries` with `rule` and `status`, statuses `error`, `pass`, `info`, `warn`, `summary.errors` 5, no `skipped` key (closing-session check) |
| Sweep step's run block with a stub `node` | With `BASELINE_REPORT` set the sweep receives `--baseline .strict-pass-freshness/baseline/x/report.json`. With it unset, the host's bash 3.2.57 stops with `baseline_args[@]: unbound variable` (closing-session check, scratch outside the repository) |
| `git diff` on `runtime/cli/sweep/` and on `validate.sh` | Empty |
| Luna review | Round 1 corrected AC-006's wording; round 2 one P1, fixed |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` | Exit 0; 167 files passed and 3 skipped; 1682 tests passed and 19 skipped; legacy and validation suites 0 failures (wave 1 final 162 files and 1648 passed; baseline 161 files and 1639 passed) |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | Exit 0 |
| CLI typecheck | Exit 0 |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, Errors 0, Warnings 0; `AC_COVERAGE` 7/7 and `AC_CLOSURE` closeable |
| `check-goal.cjs` on this folder | `RESULT: PASSED (5/5 checks)` |
| Run on GitHub | Not run. Nothing is pushed |

The test suite, check and typecheck figures are whole-tree gates taken after the wave 2 fixes to this and other phases. They show the rest of the tree is intact; the 11 tests above are what exercise this phase.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations and Follow-ups

1. **Live sweep run done; the no-baseline path is still unobserved on GitHub.** After the push, dispatched run 37783711329 on main found the previous successful run, downloaded its report (`Baseline report from run 37265804421: .strict-pass-freshness/baseline/strict-pass-freshness-report-37265804421/report.json`), and the sweep step printed `Sweeping against baseline`, `packets swept: 1580`, `pass: 1579` and `known-failure: 1`; the run concluded success, so `actions: read` was enough and the `$GITHUB_ENV` handoff worked. The first-run path with no previous artifact needs a branch with no successful run, so it stays proven by the local tests; the empty `baseline_args` expansion under `set -u` is expected to work on the runner's bash 5 and fails on bash 3.2.
2. **The first-run path through the sweep step is unproven on a compatible shell.** With no baseline, the sweep step expands an empty `baseline_args` array under `set -u`. That stops with `unbound variable` on bash 3.2 and is expected to pass on bash 4.4 and later, which the Ubuntu runner has. No test runs that step and no bash 4.4 or later was available here, so the first sweep on GitHub is the confirmation. If it fails, the usual one-line guard is `${baseline_args[@]+"${baseline_args[@]}"}`; the workflow was not changed for it.
3. **The gate tests run an adapted copy on macOS.** Bash 3.2 has no associative arrays and BSD `paste` needs an explicit `-`, so the test rewrites four lines of the run block and shims `paste` on such a host. The comparison command, branches and messages are untouched. A Linux host runs the block as written. The tests use one packet, which the rewrite handles.
4. **Two cases are not pinned by a test.** A head set that is a subset of the base set, and a packet that failed at the base and passes at the head. Both fall out of the code (`comm -23` prints nothing, and a passing head never enters the comparison at `.github/workflows/changed-packet-validation.yml:131`) but no test asserts them.
5. **The substring assertions.** Scenario 3 asserts `new failing rule(s): rule-beta,rule-gamma` as a substring and that `rule-alpha` is absent. That `rule-shared` is left out rests on `comm -23`, not on a separate assertion.
6. **Changelog.** The phase context asks for a refresh of the matching file in `../changelog/` at close. No `changelog/` folder exists under the parent or the track, so there was nothing to refresh.
<!-- /ANCHOR:limitations -->

---
