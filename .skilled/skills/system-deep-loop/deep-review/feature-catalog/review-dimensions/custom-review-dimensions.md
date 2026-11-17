---
title: "Custom review dimensions"
description: "A review run accepts configured custom dimensions after the four canonical ones, tracks them in dimension coverage, and lets a covered custom dimension reach the all-dimensions-clean stop."
trigger_phrases:
  - "custom review dimension"
  - "custom dimension review"
  - "configured review dimension"
  - "review dimension coverage custom"
version: 1.0.0.0
---

# Custom review dimensions

## 1. OVERVIEW

A review normally audits four canonical dimensions: correctness, security, traceability and maintainability. A setup can name more. A configured name outside the canonical four is a custom dimension. It is tracked and covered like the others, ordered after the canonical four, and judged by its own name. It is not required for severity coverage.

## 2. HOW IT WORKS

### Setup And Ordering

`.skilled/commands/deep/assets/deep-review.yaml` accepts custom names at setup, normalizes them, and orders them after the canonical four in the risk order. The review registry seeds the four canonical keys plus the custom keys.

### Coverage Tracking

`runtime/scripts/reduce-state.cjs` derives each finding's dimension by matching it against the configured dimension universe, so a custom name that appears in the finding's focus is kept as its own dimension. When nothing matches, the derivation falls back to the iteration's first addressed dimension and then to `correctness`. `buildDimensionCoverage` builds coverage from the iteration records and the strategy dimensions.

### Review Contract And Agent

`deep-review/assets/review-mode-contract.yaml` carries a `customDimensionRule`: priority after the canonical four, configured order, judged by its own name under the shared P0/P1/P2 severity doctrine, and `requiredForSeverityCoverage: false`. The review agent definition allows a configured custom dimension under the same rubric rule.

### Stop Behavior

A covered custom dimension counts toward the all-dimensions-clean stop, so a review with every configured dimension covered and clean can reach that stop.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | Accepts, normalizes and orders custom names, and seeds the registry keys. |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Script | Derives each finding's dimension against the configured universe and builds dimension coverage. |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Contract | The `customDimensionRule` block. |
| `.skilled/agents/deep-review.md` | Agent contract | Allows a configured custom dimension under the custom rubric rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | Vitest | The custom dimension stop-path case. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Vitest | Dimension coverage with custom names. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md` | Manual playbook | DRV-074: a configured custom dimension joins the review dimension set. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/review-depth-v2-rollout/stop-gate-custom-dimension-coverage.md` | Manual playbook | DRV-075: a covered custom dimension reaches the all-dimensions-clean stop. |

---

## 4. SOURCE METADATA

- Group: Review dimensions
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `review-dimensions/custom-review-dimensions.md`

Related references:
- [correctness.md](correctness.md) - Correctness
- [security.md](security.md) - Security
- [traceability.md](traceability.md) - Traceability
- [maintainability.md](maintainability.md) - Maintainability
