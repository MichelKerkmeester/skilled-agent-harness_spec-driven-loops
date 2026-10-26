---
title: "EC-006 -- fanout-run child spec gate"
description: "Hermetic operator check for fanout-run:EC-006: propagates the non-interactive spec-gate environment through fan-out."
matrix_cell: "fanout-run:EC-006"
test_file: "tests/stress/cli-adapter/fanout.vitest.ts"
test_name: "propagates the non-interactive spec-gate environment through fan-out"
playbook_path: "cli-external-orchestration/manual-testing-playbook/fanout-stress/child-spec-gate.md"
version: 1.4.1.0
---

# EC-006 -- fanout-run child spec gate

---

## 1. OVERVIEW

This scenario is the operator entry for the hermetic fan-out stress cell `fanout-run:EC-006`. It runs one manifest-indexed Vitest case against shim providers, so it needs no external CLI account, network access or credential. The cell proves the fan-out runner propagates the non-interactive spec-gate environment through fan-out.

The code under test is the fan-out runner `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, driven through the shim fixture in `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts`. Observable result for this cell: Exit 0 and the captured child environment contains `SYSTEM_SPEC_GATE_ENFORCE=0`, `SYSTEM_SPEC_GATE_DISABLED=1`, and `AI_SESSION_CHILD=1`.

---

## 2. SCENARIO CONTRACT

- Preconditions: run from the repository root with Node and npm available and the checked-in Vitest dependency under `.skilled/skills/system-deep-loop/runtime` installed, because the command uses `npx --no-install`. Stdin is closed with `</dev/null` so the runner can never wait on input.
- Operator prompt: run the hermetic fan-out stress check for `fanout-run:EC-006` exactly as written in section 3 and report whether the named test passed.
- Expected signals: the verbose Vitest output lists the exact test name as passed and ends with no failing test. Ledger and artifacts: Exit 0 and the captured child environment contains `SYSTEM_SPEC_GATE_ENFORCE=0`, `SYSTEM_SPEC_GATE_DISABLED=1`, and `AI_SESSION_CHILD=1`.
- Evidence requirements: the stdout and stderr transcript plus the exit status, as listed under Evidence in section 3. Fixtures are removed by test teardown, so the transcript is the durable record.
- Pass/fail: PASS if the command exits 0 and the exact test is reported as passed. FAIL if it exits non-zero after the test starts, an assertion fails or the command exceeds the test bound. The full verdict rules are under Verdict in section 3.
- Failure triage: sort a non-passing run as a harness failure, a dependency SKIP or an adapter/fan-out defect. The decision rules are under Triage in section 3.

---

## 3. TEST EXECUTION

### Commands

Run from the repository root:

```bash
cd .skilled/skills/system-deep-loop/runtime && \
  npx --no-install vitest run tests/stress/cli-adapter/fanout.vitest.ts \
  --configLoader runner --reporter=verbose \
  -t "propagates the non-interactive spec-gate environment through fan-out" </dev/null
```

### Evidence

- **stdout**: Capture the verbose Vitest line for the exact test name and the final file/test count.
- **stderr**: Capture any runner or assertion diagnostic; redact credential-shaped values before retention.
- **ledger/artifacts**: Exit 0 and the captured child environment contains `SYSTEM_SPEC_GATE_ENFORCE=0`, `SYSTEM_SPEC_GATE_DISABLED=1`, and `AI_SESSION_CHILD=1`.
- Fixtures are temporary and removed by test teardown, so the durable evidence is the terminal transcript and exit code.

### Verdict

- **PASS**: The command exits 0 and the exact manifest-indexed test is reported as passed.
- **FAIL**: The command exits non-zero after the test starts, an assertion fails, or the command exceeds the test's bound.
- **SKIP**: Only Node, npm, or the checked-in Vitest dependency cannot start; record the exact missing prerequisite. Missing external CLI authentication is not a valid skip because this cell is hermetic.

### Triage

1. **Harness failure**: Vitest cannot load the file, the test is not discovered, or temporary fixture setup fails before the shipped command path runs.
2. **Dependency SKIP**: A local Node/npm/Vitest prerequisite is unavailable; preserve the preflight error and do not report PASS.
3. **Adapter/fan-out defect**: The harness starts and the assertion against the shipped fan-out command or process behavior fails; retain stdout, stderr, exit status, and the failing assertion.

---

## 4. SOURCE FILES

- Test file: `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts`
- Fan-out runtime: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- Shim fixture: `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts`
- Matrix manifest: `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts`. The matrix bijection validator `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs` reads this file's frontmatter keys (`matrix_cell`, `test_file`, `test_name`, `playbook_path`) and the Commands, Evidence, Verdict and Triage headings, so keep them.

---

## 5. SOURCE METADATA

- Group: Fanout Stress
- Playbook ID: fanout-run:EC-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: fanout-stress/child-spec-gate.md
