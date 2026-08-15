---
title: "EC-009 -- cli-opencode budget rejection"
description: "Hermetic operator check for cli-opencode:EC-009: rejects an over-budget cli-opencode lineage before process spawn."
matrix_cell: "cli-opencode:EC-009"
test_file: "tests/stress/cli-adapter/cli-opencode.vitest.ts"
test_name: "rejects an over-budget cli-opencode lineage before process spawn"
playbook_path: "cli-external-orchestration/cli-opencode/manual-testing-playbook/stress/budget-rejection.md"
version: 1.0.0.0
---

# EC-009 -- cli-opencode budget rejection

This snippet runs the manifest-indexed hermetic test for `cli-opencode:EC-009`.

## Command

Run from the repository root:

```bash
cd .opencode/skills/system-deep-loop/runtime && \
  npx --no-install vitest run tests/stress/cli-adapter/cli-opencode.vitest.ts \
  --configLoader runner --reporter=verbose \
  -t "rejects an over-budget cli-opencode lineage before process spawn" </dev/null
```

## Evidence

- **stdout**: Capture the verbose Vitest line for the exact test name and the final file/test count.
- **stderr**: Capture any runner or assertion diagnostic; redact credential-shaped values before retention.
- **ledger/artifacts**: The over-budget lineage exits non-zero, emits budget text, and creates no provider capture.
- Fixtures are temporary and removed by test teardown, so the durable evidence is the terminal transcript and exit code.

## Verdict

- **PASS**: The command exits 0 and the exact manifest-indexed test is reported as passed.
- **FAIL**: The command exits non-zero after the test starts, an assertion fails, or the command exceeds the test's bound.
- **SKIP**: Only Node, npm, or the checked-in Vitest dependency cannot start; record the exact missing prerequisite. Missing external CLI authentication is not a valid skip because this cell is hermetic.

## Triage

1. **Harness failure**: Vitest cannot load the file, the test is not discovered, or temporary fixture setup fails before the shipped command path runs.
2. **Dependency SKIP**: A local Node/npm/Vitest prerequisite is unavailable; preserve the preflight error and do not report PASS.
3. **Adapter defect**: The harness starts and the assertion against the shipped cli-opencode command or process behavior fails; retain stdout, stderr, exit status, and the failing assertion.

