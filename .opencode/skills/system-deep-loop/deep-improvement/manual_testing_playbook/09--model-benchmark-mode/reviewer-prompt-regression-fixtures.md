---
title: "MB-R01 -- Reviewer Prompt Regression Fixtures"
description: "Manual validation scenario for MB-R01: Reviewer Prompt Regression Fixtures."
feature_id: "MB-R01"
category: "Model-Benchmark Mode"
version: 1.17.0.1
---

# MB-R01 -- Reviewer Prompt Regression Fixtures

This document captures the canonical manual-testing contract for `MB-R01`.

---

## 1. OVERVIEW

This scenario validates that reviewer-prompt fixtures route to the expected-verdict scorer (`reviewer-scorer.cjs`) only when `SPECKIT_REVIEWER_BENCHMARKS` is enabled, score against `expectedVerdict`/`expectedFindings`, write `reviewer-report.json`, and emit the `REVIEWER_BENCHMARK` mismatch line on a forced mismatch — all without changing the default `pattern`/`5dim` scorer behavior. The shipped `reviewer_regression.json` profile bundles the four `reviewer-*` seed fixtures.

---

## 2. SCENARIO CONTRACT

- Objective: Validate reviewer-prompt fixture scoring for Lane B (Model-Benchmark) through `reviewer-scorer.cjs` and the shipped `reviewer_regression.json` profile, flag-gated by `SPECKIT_REVIEWER_BENCHMARKS`.
- Real user request: `Validate that reviewer-prompt fixtures are scored against their expected verdict only when the reviewer benchmark flag is on, and stay inert otherwise.`
- Prompt: `As a manual-testing orchestrator, validate that reviewer-prompt fixtures can be scored through Lane B without changing the default pattern or 5-dimension scorer behavior. Verify reviewer-scorer.cjs parses deterministic reviewer output, compares expectedVerdict, writes reviewer-report.json, and emits the REVIEWER_BENCHMARK mismatch line on a forced mismatch. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run `reviewer-scorer.cjs` against the `reviewer_regression.json` profile with `SPECKIT_REVIEWER_BENCHMARKS=1`; capture stdout, stderr, exit code, and the generated `reviewer-report.json`; then rerun with the flag unset to confirm inert behavior; then execute the verification block against the same artifacts.
- Expected signals: with `SPECKIT_REVIEWER_BENCHMARKS=1`, `reviewer-scorer.cjs --profile <reviewer_regression.json> --outputs-dir <tmp>` exits 0 and writes `reviewer-report.json` with `scoringMethod: "reviewer"` (or `totals.scorer: reviewer`); rows include the four `reviewer-*` fixtures with per-case `expectedVerdict` comparison, `correctness`, and visible/hidden splits; a forced mismatch surfaces a `REVIEWER_BENCHMARK` line such as `REVIEWER_BENCHMARK: fixture reviewer-stale-verdict expected FAIL, got PASS — rule not safe to promote`; with the flag unset, the scorer exits inert (stderr notes reviewer fixtures are inert) and existing `pattern`/`5dim` runs still stamp their original scoring methods.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Reviewer fixtures score against their expected verdict ONLY with the flag on (`reviewer-report.json` written, four fixtures present), stay inert with the flag off, and a forced mismatch emits the `REVIEWER_BENCHMARK` line — confirming the reviewer scorer is correctly flag-gated and correctness-driven.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{tmp}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MB-R01 | Reviewer Prompt Regression Fixtures | Validate flag-gated reviewer-prompt fixture scoring | `Validate that reviewer-prompt fixtures are scored against their expected verdict only when the reviewer benchmark flag is on, and stay inert otherwise.` | rm -rf /tmp/mb-r01 && mkdir -p /tmp/mb-r01 ; \<br>SPECKIT_REVIEWER_BENCHMARKS=1 node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs \<br>  --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer_regression.json \<br>  --outputs-dir /tmp/mb-r01 \<br>  --output /tmp/mb-r01/reviewer-report.json \<br>  --grader noop ; \<br>node .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs \<br>  --profile .opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/reviewer_regression.json \<br>  --outputs-dir /tmp/mb-r01 \<br>  --output /tmp/mb-r01/reviewer-report-inert.json \<br>  --grader noop | With the flag on: exit 0; `/tmp/mb-r01/reviewer-report.json` written with reviewer scoring method and the four `reviewer-*` fixtures, each carrying an `expectedVerdict` comparison and correctness result. With the flag unset: stderr notes reviewer fixtures are inert and no reviewer report is produced. A forced verdict mismatch (edit a fixture's `expectedVerdict`) surfaces a `REVIEWER_BENCHMARK: ... rule not safe to promote` line. | `terminal transcript, command output (stderr included), reviewer-report.json, and PASS/FAIL verdict` | Reviewer fixtures score against their expected verdict only with the flag on, stay inert with the flag off, and a forced mismatch emits the `REVIEWER_BENCHMARK` line — confirming the reviewer scorer is flag-gated and correctness-driven. | If the flag-on run is inert: confirm `SPECKIT_REVIEWER_BENCHMARKS` is exported (truthy `1`/`true`)<br>If no `reviewer-report.json` is written: confirm `--output`/`--outputs-dir` resolve and the profile's `fixtures` list the four `reviewer-*` ids<br>If fixtures load as 0: confirm the profile `fixtureDir` resolves and the fixtures carry `kind: reviewer-prompt`<br>If a forced mismatch does not emit `REVIEWER_BENCHMARK`: confirm the mismatch path in `reviewer-scorer.cjs` and that the fixture's `expectedVerdict` truly differs from the deterministic output |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

> Note on the Lane B `--scorer` flag: reviewer scoring runs through `reviewer-scorer.cjs` (this scenario) or the `/deep:model-benchmark` YAML route, NOT through `run-benchmark.cjs --scorer reviewer`. `run-benchmark.cjs` intentionally accepts only `pattern`/`5dim` and warns-then-falls-back to `pattern` for any other `--scorer` value (see MB-041). This is by design — reviewer fixtures are correctness-gated and dispatched via the dedicated reviewer scorer.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `09--model-benchmark-mode/reviewer-prompt-regression-fixtures.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane B: Model-Benchmark) |
| `../../scripts/model-benchmark/lib/reviewer-scorer.cjs` | Reviewer scorer: parses reviewer output, compares expected verdict/findings, flag-gated by `SPECKIT_REVIEWER_BENCHMARKS` |
| `../../assets/model_benchmark/benchmark-profiles/reviewer_regression.json` | Shipped reviewer-regression profile bundling the four `reviewer-*` fixtures |
| `../../assets/model_benchmark/benchmark-fixtures/reviewer_stale_verdict.json` | Seed reviewer fixture (expected `fail`) used in this scenario |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-R01
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--model-benchmark-mode/reviewer-prompt-regression-fixtures.md`
