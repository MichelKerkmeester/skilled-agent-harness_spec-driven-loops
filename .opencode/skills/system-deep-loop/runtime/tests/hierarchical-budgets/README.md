---
title: "runtime hierarchical budget tests"
description: "Vitest coverage for hierarchical budget allocation, settlement and recovery."
trigger_phrases:
  - "hierarchical budget tests"
  - "runtime budget test suite"
---

# Hierarchical Budgets Tests

---

## 1. OVERVIEW

This folder tests hierarchical budget values, scope envelopes, allocation, atomic admission, receipt-backed settlement and recovery. It also covers fail-closed evidence and dark-migration behavior.

The suite protects the budget authority boundary used by durable runtime execution.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `hierarchical-budgets.vitest.ts` | Covers typed budget values, hierarchical allocation, atomic admission, receipt-backed settlement, recovery and fail-closed evidence. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Test command | `hierarchical-budgets.vitest.ts` |
| Covered boundary | Hierarchical budget authority and settlement evidence |

The file is executable verification, not a production import surface.

---

## 4. SPINE ROLE

The suite verifies budget evidence between runtime admission and durable settlement. It checks that the spine cannot advance on missing, conflicting or unauthorized budget state.

---

## 5. VALIDATION

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts tests/hierarchical-budgets
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime library](../../lib/README.md)
- [Runtime overview](../../README.md)
