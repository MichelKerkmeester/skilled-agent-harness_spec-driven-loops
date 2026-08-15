---
title: "EC-006 -- fanout-run child spec gate"
description: "Hermetic operator check for fanout-run:EC-006: propagates the non-interactive spec-gate environment through fan-out."
matrix_cell: "fanout-run:EC-006"
test_file: "tests/stress/cli-adapter/fanout.vitest.ts"
test_name: "propagates the non-interactive spec-gate environment through fan-out"
playbook_path: "cli-external-orchestration/manual-testing-playbook/fanout-stress/child-spec-gate.md"
version: 1.0.0.0
---

# EC-006 -- fanout-run child spec gate

This snippet runs the manifest-indexed hermetic test for `fanout-run:EC-006`.

## Command

Run from the repository root:

```bash
cd .opencode/skills/system-deep-loop/runtime && \
  npx --no-install vitest run tests/stress/cli-adapter/fanout.vitest.ts \
  --configLoader runner --reporter=verbose \
  -t "propagates the non-interactive spec-gate environment through fan-out" </dev/null
```

## Evidence

- **stdout**: Capture the verbose Vitest line for the exact test name and the final file/test count.
- **stderr**: Capture any runner or assertion diagnostic; redact credential-shaped values before retention.
- **ledger/artifacts**: Exit 0 and the captured child environment contains `MK_SPEC_GATE_ENFORCE=0`, `MK_SPEC_GATE_DISABLED=1`, and `AI_SESSION_CHILD=1`.
- Fixtures are temporary and removed by test teardown, so the durable evidence is the terminal transcript and exit code.

## Verdict

- **PASS**: The command exits 0 and the exact manifest-indexed test is reported as passed.
- **FAIL**: The command exits non-zero after the test starts, an assertion fails, or the command exceeds the test's bound.
- **SKIP**: Only Node, npm, or the checked-in Vitest dependency cannot start; record the exact missing prerequisite. Missing external CLI authentication is not a valid skip because this cell is hermetic.

## Triage

1. **Harness failure**: Vitest cannot load the file, the test is not discovered, or temporary fixture setup fails before the shipped command path runs.
2. **Dependency SKIP**: A local Node/npm/Vitest prerequisite is unavailable; preserve the preflight error and do not report PASS.
3. **Adapter/fan-out defect**: The harness starts and the assertion against the shipped fan-out command or process behavior fails; retain stdout, stderr, exit status, and the failing assertion.

