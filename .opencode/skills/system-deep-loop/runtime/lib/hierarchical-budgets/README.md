---
title: "Hierarchical Budgets: Program-to-Iteration Budget Ledger"
description: "Reserves, settles and replays token, cost, iteration and wall-time budgets across a four-level scope hierarchy."
---

# Hierarchical Budgets

---

## 1. OVERVIEW

Runtime primitives for `system-deep-loop` that reserve, settle, release and cancel spend against a closed scope chain from program to mode to lineage to iteration. Every mutation is authorized through the ledger, projected into per-scope balances and replay-verified. A shadow layer compares new decisions against legacy fan-out and council budget guards during migration.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `budget-authority.ts` | `HierarchicalBudgetAuthority`: reserves, settles, releases and cancels budget against the ledger with reason codes |
| `budget-events.ts` | Budget lifecycle event type registry (scope created, reservation granted or denied, spend committed, exhaustion, anomaly) |
| `budget-reducer.ts` | Reduces budget lifecycle events into a `BudgetProjection` of per-scope balances and reservations |
| `budget-replay.ts` | Registers the budget reducer and projection schema for replay-fingerprint verification |
| `budget-types.ts` | Budget vector primitives (tokens, cost, iterations, wall-time) across the program, mode, lineage and iteration scope hierarchy |
| `shadow-adapters.ts` | FanOut and value-of-computation shadow adapters that compare new budget decisions against legacy guard modules |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/voc-allocation/`
- `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/`
- `.opencode/skills/system-deep-loop/runtime/lib/stopping-clocks/`
- `.opencode/skills/system-deep-loop/runtime/lib/conditional-fanin/`
- `.opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/`
- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/hierarchical-budgets/hierarchical-budgets.vitest.ts`
