---
title: "128 -- Schema compatibility validation"
description: "This scenario validates Schema compatibility validation for `128`. It focuses on Verify backward-compatibility validation flags required schema gaps without throwing on partial databases."
version: 3.6.0.16
id: tooling-and-scripts-schema-compatibility-validation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 128 -- Schema compatibility validation

## 1. OVERVIEW

This scenario validates Schema compatibility validation for `128`. It focuses on Verify backward-compatibility validation flags required schema gaps without throwing on partial databases.

---

## 2. SCENARIO CONTRACT


- Objective: Verify backward-compatibility validation flags required schema gaps without throwing on partial databases.
- Real user request: `Please validate Schema compatibility validation against cd .opencode/skills/system-spec-kit/mcp_server and tell me whether the expected signals are present: Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage.`
- Prompt: `Validate Schema compatibility validation against cd .opencode/skills/system-spec-kit/mcp_server and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `vector-index-schema-compatibility.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

### Prompt

```
Validate Schema compatibility validation against cd .opencode/skills/system-spec-kit/mcp_server and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server`
2. `npm test -- --run tests/vector-index-schema-compatibility.vitest.ts`

### Expected

Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage

### Evidence

Command run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server`:

```text
npm test -- --run tests/vector-index-schema-compatibility.vitest.ts
```

Observed output:

```text
> @spec-kit/mcp-server@1.8.0 test
> node scripts/run-tests.mjs --run tests/vector-index-schema-compatibility.vitest.ts


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  23:54:56
   Duration  476ms (transform 310ms, setup 14ms, import 393ms, tests 5ms, environment 0ms)
```

### Pass / Fail

- **PASS**: `vector-index-schema-compatibility.vitest.ts` completed with all tests passing and no failures: `Test Files  1 passed (1)` and `Tests  2 passed (2)`.

### Failure Triage

Re-run `npm test -- --run tests/vector-index-schema-compatibility.vitest.ts -t compatible`; inspect `vector-index-schema.ts` required-table/column lists if assertions drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/schema_compatibility_validation.md](../../feature_catalog/tooling_and_scripts/schema_compatibility_validation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 128
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/schema_compatibility_validation.md`
