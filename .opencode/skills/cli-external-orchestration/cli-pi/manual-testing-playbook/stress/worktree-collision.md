---
title: "EC-012 -- cli-pi worktree collision"
description: "Hermetic operator check for cli-pi:EC-012: runs cli-pi from each isolated worktree cwd."
matrix_cell: "cli-pi:EC-012"
test_file: "tests/stress/cli-adapter/cli-pi.vitest.ts"
test_name: "runs cli-pi from each isolated worktree cwd"
playbook_path: "cli-external-orchestration/cli-pi/manual-testing-playbook/stress/worktree-collision.md"
id: "cli-pi-EC-012"
version: 1.0.0.0
---

# EC-012 -- cli-pi worktree collision

This document captures the hermetic stress-matrix contract, execution process, source anchors, and metadata for `cli-pi:EC-012`.

---

## 1. OVERVIEW

This scenario runs the manifest-indexed hermetic stress test for `cli-pi:EC-012` ("runs cli-pi from each isolated worktree cwd"). It
is a fully automated, non-interactive Vitest check against the `cli-pi` adapter's fan-out and
lifecycle handling; there is no live external `cli-pi` process in scope. Fixtures are provisioned
and removed by the test itself, so the durable evidence is the terminal transcript and exit code
from a single hermetic run.

---

## 2. SCENARIO CONTRACT

- Objective: confirm `tests/stress/cli-adapter/cli-pi.vitest.ts` reports `runs cli-pi from each isolated worktree cwd` as passing under the shipped stress-matrix
  cell `cli-pi:EC-012`.
- Operator prompt: `Run the manifest-indexed hermetic stress test for cli-pi:EC-012 and report PASS, FAIL, or SKIP with the exact blocker.`
- Expected execution process: run the exact Vitest invocation in §3 from the repository root, capture
  stdout, stderr, and the exit code, and classify the result against the Pass/Fail criteria below.
- Expected signals: the verbose Vitest reporter names the exact test `runs cli-pi from each isolated worktree cwd` as passed, and the
  final file/test summary line reports the run as green.
- Pass/fail: PASS when the command exits 0 and the named test is reported passed; FAIL when the
  command exits non-zero after the test starts or an assertion fails; SKIP only when Node, npm, or
  the checked-in Vitest dependency cannot start (see §3 for the exact blocker language).

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Run the manifest-indexed hermetic stress test for cli-pi:EC-012 and report PASS, FAIL, or SKIP with the exact blocker.`

### Commands

Run from the repository root:

```bash
cd .opencode/skills/system-deep-loop/runtime && \
  npx --no-install vitest run tests/stress/cli-adapter/cli-pi.vitest.ts \
  --configLoader runner --reporter=verbose \
  -t "runs cli-pi from each isolated worktree cwd" </dev/null
```

### Expected

The command exits `0`, and the verbose Vitest reporter names `runs cli-pi from each isolated worktree cwd` as passed. Capture the verbose Vitest line for the exact test name and the final file/test count.

### Evidence

- **stdout**: Capture the verbose Vitest line for the exact test name and the final file/test count.
- **stderr**: Capture any runner or assertion diagnostic; redact credential-shaped values before retention.
- **ledger/artifacts**: Two isolated worktree dispatches succeed and their captured CWDs equal the two distinct worktree realpaths. This cell proves boundary separation, not a simultaneous lock-contention run.
- Fixtures are temporary and removed by test teardown, so the durable evidence is the terminal transcript and exit code.

### Pass / Fail

- **PASS**: The command exits 0 and the exact manifest-indexed test is reported as passed.
- **FAIL**: The command exits non-zero after the test starts, an assertion fails, or the command exceeds the test's bound.
- **SKIP**: Only Node, npm, or the checked-in Vitest dependency cannot start; record the exact missing prerequisite. Missing external CLI authentication is not a valid skip because this cell is hermetic.

### Failure Triage

1. **Harness failure**: Vitest cannot load the file, the test is not discovered, or temporary fixture setup fails before the shipped command path runs.
2. **Dependency SKIP**: A local Node/npm/Vitest prerequisite is unavailable; preserve the preflight error and do not report PASS.
3. **Adapter defect**: The harness starts and the assertion against the shipped cli-pi command or process behavior fails; retain stdout, stderr, exit status, and the failing assertion.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-pi.vitest.ts](../../../../system-deep-loop/runtime/tests/stress/cli-adapter/cli-pi.vitest.ts) | Hermetic stress-matrix test file executed by this scenario |
| [matrix-manifest.ts](../../../../system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts) | Stress matrix cell manifest defining `cli-pi:EC-012` |

---

## 5. SOURCE METADATA

- Group: Stress Matrix
- Playbook ID: cli-pi-EC-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `stress/worktree-collision.md`
