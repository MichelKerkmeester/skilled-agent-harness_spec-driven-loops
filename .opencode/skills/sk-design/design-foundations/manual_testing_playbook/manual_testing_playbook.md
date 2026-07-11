---
title: "foundations: Manual Testing Playbook"
description: "Lean manual scenarios for verifying color, typography, layout, responsive, and token-handoff behavior in foundations."
version: 1.0.0.0
---

# foundations: Manual Testing Playbook

> **EXECUTION POLICY**: Run scenarios against the live skill and on-disk references. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a concrete blocker.

## 1. OVERVIEW

| ID | Scenario | File |
| --- | --- | --- |
| FOUND-COLOR-001 | OKLCH palette and dark-mode token plan | [`color/oklch-palette-and-dark-mode.md`](color/oklch-palette-and-dark-mode.md) |
| FOUND-COLOR-002 | Contrast-pair inventory before audit | [`color/contrast-pair-inventory-before-audit.md`](color/contrast-pair-inventory-before-audit.md) |
| FOUND-TYPE-001 | Typography role system and measure | [`type/type-roles-and-measure.md`](type/type-roles-and-measure.md) |
| FOUND-LAYOUT-001 | Layout rhythm and responsive adaptation | [`layout/layout-rhythm-responsive.md`](layout/layout-rhythm-responsive.md) |
| FOUND-LAYOUT-002 | Context adaptation matrix across device, input and posture | [`layout/context-adaptation-matrix.md`](layout/context-adaptation-matrix.md) |
| FOUND-DATAVIZ-001 | Data visualization encoding and color-for-data scales | [`data-viz/chart-encoding-and-color.md`](data-viz/chart-encoding-and-color.md) |
| FOUND-TOKEN-001 | Token starter scaffold handoff | [`tokens/token-starter-handoff.md`](tokens/token-starter-handoff.md) |
| FOUND-EXAMPLE-001 | Worked examples used as calibration, not presets | [`worked-examples/worked-examples-not-presets.md`](worked-examples/worked-examples-not-presets.md) |
| FOUND-PROCCARD-001 | Procedure-card selection proof | [`procedure-card-contract/card-selection-proof.md`](procedure-card-contract/card-selection-proof.md) |
| FOUND-PROCCARD-002 | No-card fallback | [`procedure-card-contract/no-card-fallback.md`](procedure-card-contract/no-card-fallback.md) |
| FOUND-PROCCARD-003 | Direct fallback without subagents | [`procedure-card-contract/direct-fallback-without-subagents.md`](procedure-card-contract/direct-fallback-without-subagents.md) |

## 2. GLOBAL PRECONDITIONS

1. The repository root is the working directory.
2. `SKILL.md` and all `references/` files under `foundations` resolve.
3. Parent shared references under `sk-design/references/` resolve for vocabulary checks.

## 3. EVIDENCE REQUIREMENTS

- Exact prompt used.
- Resources loaded.
- Produced token/system plan.
- Evidence that sibling boundaries were respected.
- Final verdict with rationale.
- Procedure card or no-card fallback proof when procedure support is in scope.

## 4. RELEASE READINESS

Release is ready when all 11 scenarios PASS or are SKIP only for environment reasons, and no scenario shows invented token roles, inaccessible color pairs, dishonest chart axes, generic responsive scaling, missing procedure-card proof, or a weakened direct-fallback proof bar.
