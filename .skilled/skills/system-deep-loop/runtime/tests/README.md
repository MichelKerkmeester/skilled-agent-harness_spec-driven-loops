---
title: "system-deep-loop runtime tests"
description: "Unit, integration and lifecycle coverage for the system-deep-loop runtime."
trigger_phrases:
  - "deep-loop runtime tests"
  - "runtime test suites"
---

# runtime / tests

---

## 1. OVERVIEW

This folder contains the executable test surface for the runtime. The suites cover domain modules, CLI boundaries, integration flows, lifecycle behavior, council coordination, fixtures and shared child-process helpers.

The tests document contracts through assertions. They do not define a separate public runtime API.

---

## 2. DIRECTORY TREE

```text
tests/
├── council/
├── fixtures/
├── helpers/
├── hierarchical-budgets/
├── integration/
├── lifecycle/
└── unit/
```

---

## 3. ROOT FILES

| File | Responsibility |
|---|---|
| `.gitkeep` | Keeps the test root present in source distributions. |
| `council-graph-value-report.json` | Recorded graph-value report input or output used by integration coverage. |
| `executor-audit-cli-branch-receipts.test.ts` | Checks executor audit receipts across the CLI branch dispatch styles. |
| `executor-audit-receipts.test.ts` | Checks executor provenance and dispatch receipt behavior. |
| `receipt-crypto.test.ts` | Checks receipt key derivation, signing and verification. |

---

## 4. SUITE SURFACE

| Suite | Coverage |
|---|---|
| [`council/README.md`](council/README.md) | Council dispatch, scoring, cost and session-state contracts |
| [`fixtures/README.md`](fixtures/README.md) | Shared event and council graph fixtures |
| [`helpers/README.md`](helpers/README.md) | Child-process helpers used by multiple suites |
| [`hierarchical-budgets/README.md`](hierarchical-budgets/README.md) | Budget reserve, settle and recovery behavior |
| [`integration/README.md`](integration/README.md) | CLI, graph, review-depth and pivot flows |
| [`lifecycle/README.md`](lifecycle/README.md) | Database open, close and writer-lock lifecycle |
| [`unit/README.md`](unit/README.md) | Per-module runtime contracts |

---

## 5. VALIDATION

Run the complete runtime test configuration from the repository root.

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts
```

---

## 6. RELATED

- [Runtime overview](../README.md)
- [Runtime library](../lib/README.md)
- [Runtime scripts](../scripts/README.md)
