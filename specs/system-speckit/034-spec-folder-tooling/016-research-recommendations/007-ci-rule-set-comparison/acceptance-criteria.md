---
title: "Acceptance Criteria: Phase 7: ci-rule-set-comparison"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ci rule set comparison acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: ci-rule-set-comparison

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet that fails rule-set {A, B, C} at base, When the PR head fails rule-set {A, D, E}, Then the gate reports a regression (not pre-existing) | Observed 2026-10-08: the test `names only the head rules that the base was not already failing` ran the gate's own run block, extracted from the YAML, against a fixture repo with a base commit, a head commit and stub validator reports. The packet fails `rule-alpha` and `rule-shared` at the base and `rule-beta`, `rule-gamma` and `rule-shared` at the head. The gate printed a `Regression` error line containing `new failing rule(s): rule-beta,rule-gamma`, left `rule-alpha` out of the output and exited 1; that the shared rule is not listed rests on `comm -23`, since the assertion is a substring match. The old logic compared only verdicts and would have called this pre-existing; against the pre-change workflow the 5 gate tests failed (build note, not rerun at close). The stub reports have the real validator's shape: `validate.sh --strict --no-recursive --json` on a throwaway packet returned `entries` with `rule` and `status` values including `error`. Code: `.github/workflows/changed-packet-validation.yml:176` (`comm -23` of head against base), `.github/workflows/changed-packet-validation.yml:179` (regression branch). Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:425`. | Met | - |
| AC-002 | REQ-001 | Given a packet that passes at base and fails at head, When the gate runs, Then it is still reported as a regression | Observed 2026-10-08: the test `reports a regression when a packet passes at the base and fails at the head` ran the same run block with a passing base report and a head report failing `rule-alpha`. The gate printed a `Regression` error line containing `new failing rule(s): rule-alpha`, then `BLOCKED: 1 packet(s) regressed in this PR.`, and exited 1. A pass at the base is an empty set, so every head rule is new. Code: `.github/workflows/changed-packet-validation.yml:176-183`, `.github/workflows/changed-packet-validation.yml:192-196`. Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:407`. | Met | - |
| AC-003 | REQ-002 | Given the weekly sweep with a previous artifact as baseline, When the sweep runs, Then a packet that passed in the baseline but now fails is reported as a regression | Observed 2026-10-08: the test `reports a regression when a folder passed in the baseline and fails now` ran the real sweep script with `--baseline` pointing at a report that lists a fixture folder as `pass`, and a stub validator that fails that folder. The result row has status `regression`, `regressions` is 1, `firstRun` is 0, and the sweep exits 1. The sweep script is unchanged by this phase (`git diff` on its directory is empty); the phase only makes the workflow pass it a baseline. Code: `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:293-295` (pass in baseline, fails now). Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:474`. | Met | - |
| AC-004 | REQ-002 | Given the first run of the weekly sweep with no previous artifact, When the sweep runs, Then it proceeds without error and reports all failures as `first-run` (no baseline to compare) | Observed 2026-10-08: the fetch step's run block, run with a stub `gh` whose run lookup finds nothing, exits 0, prints `::notice::No baseline report found; this run records the baseline` and writes no `BASELINE_REPORT` (test `records no baseline when no previous run is found`); a downloaded report that does not parse gives the same notice and no variable. The real sweep script without `--baseline` reports the failing folder as `first-run`, with `firstRun` 1, `regressions` 0 and exit 0. Not observed: the sweep step expands an empty `baseline_args` array under `set -u`, which stops with `baseline_args[@]: unbound variable` on this host's bash 3.2.57 and is expected to work on the runner's bash 5; no run on GitHub has happened, and a first run there confirms it. Code: `.github/workflows/strict-pass-freshness-report.yml:73-76`, `.github/workflows/strict-pass-freshness-report.yml:80-85`, `.github/workflows/strict-pass-freshness-report.yml:90-98`, `.github/workflows/strict-pass-freshness-report.yml:113-117`. Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:458`, `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:517`, `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:542`. | Met | - |
| AC-005 | REQ-003 | Given a failing packet in a PR, When the changed-packet gate runs, Then the output lists the new failing rules by name | Observed 2026-10-08, with a fixture repo and a stub validator instead of a PR on GitHub: with the base failing `rule-alpha` and `rule-shared` and the head failing `rule-beta`, `rule-gamma` and `rule-shared`, the gate's error line contains `new failing rule(s): rule-beta,rule-gamma`, joined by `paste -s -d ,`, and the base-only `rule-alpha` does not appear in the output. The shared rule is left out by `comm -23`; the assertion is a substring match and does not check for it separately. The pass-to-fail test names `rule-alpha`. On this host the run block ran with its associative array rewritten to plain variables and a `paste` shim, because macOS bash 3.2 and BSD paste lack them; the comparison command and messages are unchanged and the Ubuntu runner needs neither. Code: `.github/workflows/changed-packet-validation.yml:180`. Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:425`, `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:407`. | Met | - |
| AC-006 | REQ-004 | Given the weekly sweep configuration with a previous artifact, When the sweep runs, Then the baseline is loaded and packets that failed before report as `known-failure` when they still fail | Observed 2026-10-08: the fetch step's run block, run with a stub `gh` that lands a report under a per-artifact directory, writes `BASELINE_REPORT` pointing at `.strict-pass-freshness/baseline/strict-pass-freshness-report-1/report.json` and exits 0 (test `points BASELINE_REPORT at the downloaded report`). The real sweep script with `--baseline` pointing at a report that lists a fixture folder as failing, and a stub validator that still fails it, returns status `known-failure` with `knownFailures` 1, `regressions` 0, `firstRun` 0 and exit 0. Separately, the sweep step's run block run with a stub in place of `node` passed `--baseline .strict-pass-freshness/baseline/x/report.json` to the sweep when `BASELINE_REPORT` was set (a closing-session check, not a repo test). Not observed: a real `gh run list` and `gh run download` against GitHub; the artifact name pattern was matched by reading the upload step. Code: `.github/workflows/strict-pass-freshness-report.yml:65-71`, `.github/workflows/strict-pass-freshness-report.yml:80-82`, `.github/workflows/strict-pass-freshness-report.yml:102`, `.github/workflows/strict-pass-freshness-report.yml:115`, `.github/workflows/strict-pass-freshness-report.yml:125`, `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:300-301`. Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:494`, `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:525`. | Met | - |
| AC-007 | - | Given multiple test scenarios (pass-to-fail, fail-to-fail-different-rules, baseline-present, baseline-absent), When the gates run on test data, Then each scenario produces its expected outcome with evidence recorded in implementation-summary.md | Observed 2026-10-08: the 11 scenarios are recorded in implementation-summary.md under Scenario outcomes, each with its setup (rule sets, baseline presence) and the gate output or reported status. They cover pass-to-fail, fail-to-fail with different rules, baseline present and baseline absent. The test file was rerun at close: 11 passed, exit 0. Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:406`, `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:457`, `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts:516` (the three groups). | Met | - |

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

**Closeable:** Yes. All seven rows are Met from local evidence: 11 tests that run the changed-packet gate's and the baseline fetch step's own run blocks against a stub validator and a stub `gh`, and the real sweep script, rerun at close with 11 passed. Neither workflow has run on GitHub, because nothing is pushed. The first run there is the only place the real `gh` calls, the `$GITHUB_ENV` handoff and the sweep step on the runner's bash are seen; the implementation summary lists these. AC-006's wording was corrected before the build from "passed before" to "failed before", because the original contradicted the sweep script (authoring error, recorded in implementation-summary.md and goal.md).
<!-- /ANCHOR:closure -->
