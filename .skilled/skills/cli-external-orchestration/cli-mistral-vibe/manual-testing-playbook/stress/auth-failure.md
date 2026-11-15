---
title: "EC-001 -- cli-mistral-vibe authentication failure"
description: "Hermetic operator check for cli-mistral-vibe:EC-001: retains cli-mistral-vibe authentication diagnostics in bounded lineage output."
matrix_cell: "cli-mistral-vibe:EC-001"
test_file: "tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts"
test_name: "retains cli-mistral-vibe authentication diagnostics in bounded lineage output"
playbook_path: "cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/stress/auth-failure.md"
id: "cli-mistral-vibe-EC-001"
version: 1.0.1.0
---

# EC-001 -- cli-mistral-vibe authentication failure

This document captures the hermetic stress-matrix contract, execution process, source anchors, and metadata for `cli-mistral-vibe:EC-001`.

---

## 1. OVERVIEW

This scenario runs the manifest-indexed hermetic stress test for `cli-mistral-vibe:EC-001` ("retains cli-mistral-vibe authentication diagnostics in bounded lineage output"). It is a non-interactive Vitest check against the Mistral Vibe adapter's fan-out and lifecycle handling. It does not start a live Vibe process or contact a provider. The test provisions and removes its fixtures, so the durable evidence is the terminal transcript and exit code from one hermetic run.

---

## 2. SCENARIO CONTRACT

- Objective: confirm `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` reports `retains cli-mistral-vibe authentication diagnostics in bounded lineage output` as passing under the matrix cell `cli-mistral-vibe:EC-001`.
- Operator prompt: `Run the manifest-indexed hermetic stress test for cli-mistral-vibe:EC-001 and report PASS, FAIL, or SKIP with the exact blocker.`
- Expected execution process: run the exact Vitest invocation in §3 from the repository root, then capture stdout, stderr and the exit code.
- Expected signals: the verbose Vitest reporter names the exact test as passed, and the final file and test summary is green.
- Pass/fail: PASS when the command exits 0 and the named test is reported passed; FAIL when the test starts and exits non-zero or an assertion fails; SKIP only when Node or the checked-in Vitest dependency cannot start.
- Live provider step: none. This stress cell is hermetic and needs no live provider step.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Run the manifest-indexed hermetic stress test for cli-mistral-vibe:EC-001 and report PASS, FAIL, or SKIP with the exact blocker.`

### Commands

Run from the repository root:

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run \
  .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts \
  --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts \
  --configLoader runner \
  --reporter=verbose \
  -t "retains cli-mistral-vibe authentication diagnostics in bounded lineage output" </dev/null
```

### Expected

The command exits 0 and the verbose reporter names `retains cli-mistral-vibe authentication diagnostics in bounded lineage output` as passed. Capture that test line and the final file and test count. A failure after the test starts is not a dependency skip.

### Evidence

- **stdout**: Capture the verbose line for the exact test and the final file and test summary.
- **stderr**: Capture runner or assertion diagnostics. Redact credential-shaped values before retaining the transcript.
- **ledger/artifacts**: Record any bounded lineage output, process status or cleanup artifacts asserted by this cell. Test fixtures are temporary and removed during teardown.
- Record the command, working directory, exit code and verdict with the run evidence.

### Verdict

- **PASS**: The command exits 0 and the exact manifest-indexed test is reported as passed.
- **FAIL**: The command exits non-zero after the test starts, an assertion fails, or the command exceeds its test bound.
- **SKIP**: Only Node or the checked-in Vitest dependency cannot start; record the exact missing prerequisite. Provider credentials are not required for this hermetic cell.
- Live provider step: none. This stress cell is hermetic and needs no live provider step.

### Recorded Result

- Date: 2026-11-14
- Command: the exact Vitest invocation in §3, run from the repository root with stdin closed.
- Exit code: 0.
- Observed stdout: `✓ |serial| tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts > cli-mistral-vibe adapter contracts > retains cli-mistral-vibe authentication diagnostics in bounded lineage output 845ms` with the summary `Test Files  1 passed (1)` and `Tests  1 passed | 22 skipped (23)` (1.34s).
- Verdict: PASS. The named test passed and the file summary was green; the temporary lineage ledger and artifacts were removed with the fixtures during teardown.

### Triage

**Failure triage**:

1. **Harness failure**: Vitest cannot load the file, the test is not discovered, or fixture setup fails before the adapter path runs.
2. **Dependency SKIP**: Node or the checked-in Vitest prerequisite is unavailable; preserve the preflight error and do not report PASS.
3. **Adapter defect**: The harness starts and an assertion against the shipped cli-mistral-vibe command or process behavior fails; retain stdout, stderr, exit status and the failing assertion.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-mistral-vibe.vitest.ts](../../../../system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts) | Hermetic stress-matrix test file executed by this scenario |
| [matrix-manifest.ts](../../../../system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts) | Stress matrix cell manifest defining `cli-mistral-vibe:EC-001` |

---

## 5. SOURCE METADATA

- Group: Stress Matrix
- Playbook ID: cli-mistral-vibe-EC-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `stress/auth-failure.md`
