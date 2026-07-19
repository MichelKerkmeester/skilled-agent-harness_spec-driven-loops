---
title: "127 -- Migration checkpoint scripts"
description: "This scenario validates Migration checkpoint scripts for `127`. It focuses on Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups."
version: 3.6.0.16
id: tooling-and-scripts-migration-checkpoint-scripts
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 127 -- Migration checkpoint scripts

## 1. OVERVIEW

This scenario validates Migration checkpoint scripts for `127`. It focuses on Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups.

---

## 2. SCENARIO CONTRACT


- Objective: Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups.
- Real user request: `Please validate Migration checkpoint scripts against cd .opencode/skills/system-spec-kit/mcp-server and tell me whether the expected signals are present: Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage.`
- Prompt: `Validate Migration checkpoint scripts against cd .opencode/skills/system-spec-kit/mcp-server and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `migration-checkpoint-scripts.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

### Prompt

```
Validate Migration checkpoint scripts against cd .opencode/skills/system-spec-kit/mcp-server and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server`
2. `npm test -- --run tests/migration-checkpoint-scripts.vitest.ts`

### Expected

Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp-server`:

```text
npm test -- --run tests/migration-checkpoint-scripts.vitest.ts
```

Observed transcript:

```text
> @spec-kit/mcp-server@1.8.0 test
> node scripts/run-tests.mjs --run tests/migration-checkpoint-scripts.vitest.ts


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  23:23:01
   Duration  211ms (transform 85ms, setup 14ms, import 121ms, tests 13ms, environment 0ms)
```

### Pass / Fail

- **PASS**: `migration-checkpoint-scripts.vitest.ts` completed with all tests passing and no failures: `Test Files  1 passed (1)` and `Tests  2 passed (2)`.

### Failure Triage

Re-run `npm test -- --run tests/migration-checkpoint-scripts.vitest.ts -t restore`; inspect `scripts/migrations/create-checkpoint.ts` and `scripts/migrations/restore-checkpoint.ts` if assertions drift

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/migration-checkpoint-scripts.md](../../feature-catalog/tooling-and-scripts/migration-checkpoint-scripts.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 127
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/migration-checkpoint-scripts.md`
