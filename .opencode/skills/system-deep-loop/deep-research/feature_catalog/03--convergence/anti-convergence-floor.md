---
title: "Anti-convergence floor"
description: "Prevents convergence STOP before the configured minimum iteration floor while preserving hard stops and pause behavior."
trigger_phrases:
  - "anti-convergence floor"
  - "minIterations convergence"
  - "convergenceMode off"
  - "min_iterations_guard_pass"
  - "premature research stop guard"
version: 1.14.0.13
---

# Anti-convergence floor

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Prevents convergence STOP before the configured minimum iteration floor while preserving hard stops and pause behavior.

The anti-convergence floor keeps deep-research from ending after a shallow early signal. Operators get a declarative `minIterations` default and a `convergenceMode` escape hatch without weakening max-iteration, pause, or halt boundaries.

---

## 2. HOW IT WORKS

The config template defines `antiConvergence.minIterations` with a default of `3` and `antiConvergence.convergenceMode` with a default of `default`. The auto workflow writes those values into the config record, validates older or malformed configs at read time, and clamps the effective floor to the hard `maxIterations` cap when needed.

During convergence checking, a STOP candidate is blocked while the completed iteration count is below the effective floor. When the floor clears, the workflow emits `min_iterations_guard_pass`, keeping attribution separate from quality-guard events. `convergenceMode: "off"` disables convergence-driven STOP while leaving max iterations, pause, and other explicit halts active.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json` | Asset | Defines the anti-convergence defaults and locked config fields. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Reads the floor, validates compatibility with `maxIterations`, blocks early STOP, and emits floor events. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts` | Vitest | Verifies config shape, YAML guard behavior, and backward-compatible missing-field handling. |
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/04--convergence-and-recovery/anti-convergence-floor.md` | Manual playbook | Verifies the operator-visible floor and `convergenceMode` contract. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--convergence/anti-convergence-floor.md`
Related references:
- [three-signal-model.md](three-signal-model.md) - Three-signal model
- [quality-guards.md](quality-guards.md) - Quality guards
