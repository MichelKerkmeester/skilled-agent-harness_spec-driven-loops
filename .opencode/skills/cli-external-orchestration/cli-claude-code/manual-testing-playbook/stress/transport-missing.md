---
title: "EC-008 -- cli-claude-code missing transport"
description: "Hermetic operator check for cli-claude-code:EC-008: fails before cli-claude-code execution when its transport is unavailable."
matrix_cell: "cli-claude-code:EC-008"
test_file: "tests/stress/cli-adapter/cli-claude-code.vitest.ts"
test_name: "fails before cli-claude-code execution when its transport is unavailable"
playbook_path: "cli-external-orchestration/cli-claude-code/manual-testing-playbook/stress/transport-missing.md"
id: "cli-claude-code-EC-008"
version: 1.0.0.0
---

# EC-008 -- cli-claude-code missing transport

This document captures the hermetic stress-matrix contract, execution process, source anchors, and metadata for `cli-claude-code:EC-008`.

---

## 1. OVERVIEW

This scenario runs the manifest-indexed hermetic stress test for `cli-claude-code:EC-008` ("fails before cli-claude-code execution when its transport is unavailable"). It
is a fully automated, non-interactive Vitest check against the `cli-claude-code` adapter's fan-out and
lifecycle handling; there is no live external `cli-claude-code` process in scope. Fixtures are provisioned
and removed by the test itself, so the durable evidence is the terminal transcript and exit code
from a single hermetic run.

---

## 2. SCENARIO CONTRACT

- Objective: confirm `tests/stress/cli-adapter/cli-claude-code.vitest.ts` reports `fails before cli-claude-code execution when its transport is unavailable` as passing under the shipped stress-matrix
  cell `cli-claude-code:EC-008`.
- Operator prompt: `Run the manifest-indexed hermetic stress test for cli-claude-code:EC-008 and report PASS, FAIL, or SKIP with the exact blocker.`
- Expected execution process: run the exact Vitest invocation in §3 from the repository root, capture
  stdout, stderr, and the exit code, and classify the result against the Pass/Fail criteria below.
- Expected signals: the verbose Vitest reporter names the exact test `fails before cli-claude-code execution when its transport is unavailable` as passed, and the
  final file/test summary line reports the run as green.
- Pass/fail: PASS when the command exits 0 and the named test is reported passed; FAIL when the
  command exits non-zero after the test starts or an assertion fails; SKIP only when Node, npm, or
  the checked-in Vitest dependency cannot start (see §3 for the exact blocker language).

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Run the manifest-indexed hermetic stress test for cli-claude-code:EC-008 and report PASS, FAIL, or SKIP with the exact blocker.`

### Commands

Run from the repository root:

```bash
cd .opencode/skills/system-deep-loop/runtime && \
  npx --no-install vitest run tests/stress/cli-adapter/cli-claude-code.vitest.ts \
  --configLoader runner --reporter=verbose \
  -t "fails before cli-claude-code execution when its transport is unavailable" </dev/null
```

### Expected

The command exits `0`, and the verbose Vitest reporter names `fails before cli-claude-code execution when its transport is unavailable` as passed. Capture the verbose Vitest line for the exact test name and the final file/test count.

### Evidence

- **stdout**: Capture the verbose Vitest line for the exact test name and the final file/test count.
- **stderr**: Capture any runner or assertion diagnostic; redact credential-shaped values before retention.
- **ledger/artifacts**: A non-zero result and no cli-claude-code provider capture when its transport is removed from `PATH`.
- Fixtures are temporary and removed by test teardown, so the durable evidence is the terminal transcript and exit code.

### Pass / Fail

- **PASS**: The command exits 0 and the exact manifest-indexed test is reported as passed.
- **FAIL**: The command exits non-zero after the test starts, an assertion fails, or the command exceeds the test's bound.
- **SKIP**: Only Node, npm, or the checked-in Vitest dependency cannot start; record the exact missing prerequisite. Missing external CLI authentication is not a valid skip because this cell is hermetic.

### Failure Triage

1. **Harness failure**: Vitest cannot load the file, the test is not discovered, or temporary fixture setup fails before the shipped command path runs.
2. **Dependency SKIP**: A local Node/npm/Vitest prerequisite is unavailable; preserve the preflight error and do not report PASS.
3. **Adapter defect**: The harness starts and the assertion against the shipped cli-claude-code command or process behavior fails; retain stdout, stderr, exit status, and the failing assertion.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-claude-code.vitest.ts](../../../../system-deep-loop/runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts) | Hermetic stress-matrix test file executed by this scenario |
| [matrix-manifest.ts](../../../../system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts) | Stress matrix cell manifest defining `cli-claude-code:EC-008` |

---

## 5. SOURCE METADATA

- Group: Stress Matrix
- Playbook ID: cli-claude-code-EC-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `stress/transport-missing.md`
