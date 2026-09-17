---
title: "EC-015 -- cli-hermes suite integrity and the live probe"
description: "Hermetic operator check for cli-hermes:EC-015: runs the stress file unfiltered so the manifest-integrity, baseline-lineage and fixture-ownership cells are exercised, and records the one cell that reaches a real Hermes binary."
matrix_cell: "cli-hermes:EC-015"
test_file: "tests/stress/cli-adapter/cli-hermes.vitest.ts"
test_name: "binds exactly fourteen implemented adapter cells without forbidden overclaims"
playbook_path: "cli-external-orchestration/cli-hermes/manual-testing-playbook/stress/suite-integrity-and-live-probe.md"
id: "cli-hermes-EC-015"
version: 1.0.0.0
---

# EC-015 -- cli-hermes suite integrity and the live probe

This document captures the hermetic stress-matrix contract, execution process, source anchors, and metadata for `cli-hermes:EC-015`.

---

## 1. OVERVIEW

Every other stress scenario runs the file through a `-t` name filter, so each one reaches exactly one
adapter cell. Three checks in the same file are reachable by no filter any scenario uses, and one of
them is the manifest-integrity check that guards the cell count itself. A regression there would let
the matrix gain or lose a cell while all fourteen filtered scenarios stayed green, which is the kind
of silent gap this package exists to close.

This scenario runs the file unfiltered. It is a fully automated, non-interactive Vitest check against
the `cli-hermes` adapter; fixtures are provisioned and removed by the test itself, so the durable
evidence is the terminal transcript and exit code from a single hermetic run.

### The one cell that is not hermetic

`live cli-hermes transport probe` is dependency-skipped unless `DEEP_LOOP_CLI_HERMES_LIVE=1` is set.
It is the only cell that would start a real Hermes process and spend a provider call. Its skip is the
expected result here, and a run that reports it as passed means the environment enabled it; record
that rather than treating it as an anomaly.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the whole `tests/stress/cli-adapter/cli-hermes.vitest.ts` file passes, so the
  three cells no filtered scenario reaches are exercised and the matrix cell count is asserted.
- Operator prompt: `Run the cli-hermes stress file unfiltered and report PASS, FAIL, or SKIP with the exact blocker.`
- Expected execution process: run the exact Vitest invocation in §3 from the repository root, capture
  stdout, stderr, and the exit code, and judge the result against the Pass/Fail criteria below.
- Expected signals: the verbose reporter names `binds exactly fourteen implemented adapter cells without forbidden overclaims`,
  `completes a hermetic lineage through the shipped builder and fan-out runtime` and
  `enforces exclusive ownership without collisions` as passed, `live cli-hermes transport probe` as
  skipped, and the summary reports 17 passed with 1 skipped.
- Pass/fail: PASS when the command exits 0, the three named checks pass, and the live probe is
  skipped or passed; FAIL when the command exits non-zero after the tests start, an assertion fails,
  or the passed count is not 17; SKIP only when Node, npm, or the checked-in Vitest dependency
  cannot start.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Run the cli-hermes stress file unfiltered and report PASS, FAIL, or SKIP with the exact blocker.`

### Commands

Run from the repository root:

```bash
cd .skilled/skills/system-deep-loop/runtime && \
  npx --no-install vitest run tests/stress/cli-adapter/cli-hermes.vitest.ts \
  --configLoader runner --reporter=verbose </dev/null
```

### Expected

The command exits `0`. The summary reads 17 passed with 1 skipped. The three otherwise-unreached
checks are named as passed and the live transport probe is named as skipped.

### Evidence

- **stdout**: the three named check lines, the skipped probe line, and the final test-count summary.
- **stderr**: any runner or assertion diagnostic; redact credential-shaped values before retention.
- **ledger/artifacts**: none beyond the transcript. Fixtures are temporary and removed by teardown.

### Verdict

- **PASS**: exits 0, 17 passed, and the three named checks are reported passed.
- **FAIL**: exits non-zero after the tests start, an assertion fails, or the passed count moved
  without the matrix and its scenarios moving with it.
- **SKIP**: only Node, npm, or the checked-in Vitest dependency cannot start; record the exact
  missing prerequisite. Missing external CLI authentication is not a valid skip, because every cell
  here is hermetic and the one live cell skips itself.

### Triage

**Failure triage**:

1. **Count moved**: the passed count is not 17. A cell was added or removed without its scenario;
   reconcile the matrix, this file's expected count, and the per-cell scenarios together.
2. **Harness failure**: Vitest cannot load the file or fixture setup fails before the shipped command
   path runs.
3. **Dependency SKIP**: a local Node, npm or Vitest prerequisite is unavailable; preserve the
   preflight error and do not report PASS.
4. **Live probe ran unexpectedly**: `DEEP_LOOP_CLI_HERMES_LIVE=1` is set in the environment, so the
   run spent a provider call. Not a failure, but record it, because the run is no longer hermetic.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-hermes.vitest.ts` | The stress file this scenario runs whole |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts` | The shared suite the adapter cells are built from |

---

## 5. SOURCE METADATA

- Group: Stress Matrix
- Playbook ID: cli-hermes-EC-015
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `stress/suite-integrity-and-live-probe.md`

---

## 6. RECORDED RESULT

**Executed 2026-09-16**: exit 0, 17 passed and 1 skipped, in 15 s. The three otherwise-unreached
checks passed and `live cli-hermes transport probe` reported its dependency skip with the exact
message `live probe disabled: set DEEP_LOOP_CLI_HERMES_LIVE=1`.
