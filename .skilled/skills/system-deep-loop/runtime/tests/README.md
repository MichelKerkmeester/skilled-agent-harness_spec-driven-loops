---
title: "system-deep-loop runtime tests"
description: "Unit, integration, lifecycle and stress coverage for the system-deep-loop runtime."
trigger_phrases:
  - "deep-loop runtime tests"
  - "runtime test suites"
---

# runtime / tests

---

## 1. OVERVIEW

This folder contains the executable test surface for the runtime. The suites cover domain modules, CLI boundaries, integration flows, lifecycle behavior, seat dispatch, hermetic CLI adapter stress, fixtures and shared child-process helpers.

The tests document contracts through assertions. They do not define a separate public runtime API.

Every test run skips the flush to disk. The setup file `_support/skip-fsync.ts` ([`_support/README.md`](_support/README.md)) replaces `fsyncSync` and `fdatasyncSync` with no-ops in the test worker and in any `node` child a test spawns, because durable writes were most of the suite's run time and no test can observe durability. Writes and renames still happen. Remove that setup line from `vitest.config.ts` to run against real fsync.

---

## 2. DIRECTORY TREE

```text
tests/
├── _support/
├── council/
├── fixtures/
├── helpers/
├── hierarchical-budgets/
├── integration/
├── lifecycle/
├── stress/
│   └── cli-adapter/
└── unit/
```

---

## 3. ROOT FILES

| File | Responsibility |
|---|---|
| `.gitkeep` | Keeps the test root present in source distributions. |
| `council-graph-value-report.json` | Per-scenario `baselineFileReads`, `runtimeGraphCalls` and `ratio` rows for the `DAC-0nn` council graph-value scenarios. No runtime code or test reads or writes it. |
| `executor-audit-cli-branch-receipts.test.ts` | Checks executor audit receipts across the CLI branch dispatch styles. |
| `executor-audit-receipts.test.ts` | Checks executor provenance and dispatch receipt behavior. |
| `fanout-lineage-pwd.test.ts` | Checks that the fan-out lineage runner pins the child's `PWD` to its resolved cwd. |
| `fanout-lineage-stderr.test.ts` | Checks that the fan-out lineage runner returns a bounded stderr with the result while stdout keeps its contract. |
| `fanout-loop-prompt-in-process.test.ts` | Checks the in-process execution directive and the mode-specific output contracts in the CLI lineage prompt that `buildLoopPrompt` builds. |
| `fanout-review-focus.vitest.ts` | Checks that a review focus reaches every lineage of a deep-review fan-out, its iteration prompts and the merged review coverage. |
| `receipt-crypto.test.ts` | Checks receipt key derivation, signing and verification. |

---

## 4. SUITE SURFACE

| Suite | Coverage |
|---|---|
| [`_support/README.md`](_support/README.md) | Suite-wide setup that skips the flush to disk |
| [`council/README.md`](council/README.md) | Seat dispatch used by the divergent pivot |
| [`fixtures/README.md`](fixtures/README.md) | Shared event and ledger fixtures |
| [`helpers/README.md`](helpers/README.md) | Child-process helpers used by multiple suites |
| [`hierarchical-budgets/README.md`](hierarchical-budgets/README.md) | Budget reserve, settle and recovery behavior |
| [`integration/README.md`](integration/README.md) | CLI, graph, review-depth and pivot flows |
| [`lifecycle/README.md`](lifecycle/README.md) | Database open, close and writer-lock lifecycle |
| [`stress/cli-adapter/README.md`](stress/cli-adapter/README.md) | Hermetic CLI adapter and fan-out scheduler stress |
| [`unit/README.md`](unit/README.md) | Per-module runtime contracts |

---

## 5. VALIDATION

Run the complete runtime test configuration from the repository root.

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts
```

---

## 6. RELATED

- [Runtime overview](../README.md)
- [Runtime library](../lib/README.md)
- [Runtime scripts](../scripts/README.md)
