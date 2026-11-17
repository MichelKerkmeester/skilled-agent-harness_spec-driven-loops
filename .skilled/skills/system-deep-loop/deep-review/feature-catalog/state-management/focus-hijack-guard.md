---
title: "Next Focus free-text guard"
description: "Deep-review Next Focus names the first uncovered dimension when the latest leaf's free text names none, so free text cannot hijack the review focus."
trigger_phrases:
  - "review next focus free text"
  - "review next focus hijack"
  - "uncovered dimension next focus"
  - "review Next Focus"
version: 1.0.0.0
---

# Next Focus free-text guard

## 1. OVERVIEW

Review Next Focus is the next dimension the review audits. When the latest leaf's `nextFocus` names no dimension, the first uncovered dimension wins, so free text does not hijack the review focus. The strategy file and the dashboard apply the same rule.

## 2. HOW IT WORKS

### Strategy And Dashboard

`runtime/scripts/reduce-state.cjs` sets the review base pick in the strategy focus block and in its dashboard twin. An uncovered dimension outranks a leaf `nextFocus` that names no dimension.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Script | The strategy focus block and the dashboard Next Focus, which pick the first uncovered dimension. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Vitest | Review twin case asserting the strategy and dashboard Next Focus. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/review-next-focus-first-uncovered-dimension.md` | Manual playbook | DRV-073: Review Next Focus names the first uncovered dimension. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-management/focus-hijack-guard.md`

Related references:
- [strategy-tracking.md](strategy-tracking.md) - Strategy tracking
- [dashboard.md](dashboard.md) - Dashboard
