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
| FOUND-COLOR-001 | OKLCH palette and dark-mode token plan | [`01--color/001-oklch-palette-and-dark-mode.md`](01--color/001-oklch-palette-and-dark-mode.md) |
| FOUND-TYPE-001 | Typography role system and measure | [`02--type/001-type-roles-and-measure.md`](02--type/001-type-roles-and-measure.md) |
| FOUND-LAYOUT-001 | Layout rhythm and responsive adaptation | [`03--layout/001-layout-rhythm-responsive.md`](03--layout/001-layout-rhythm-responsive.md) |
| FOUND-LAYOUT-002 | Context adaptation matrix across device, input and posture | [`03--layout/002-context-adaptation-matrix.md`](03--layout/002-context-adaptation-matrix.md) |
| FOUND-DATAVIZ-001 | Data visualization encoding and color-for-data scales | [`04--data-viz/001-chart-encoding-and-color.md`](04--data-viz/001-chart-encoding-and-color.md) |
| FOUND-TOKEN-001 | Token starter scaffold handoff | [`05--tokens/001-token-starter-handoff.md`](05--tokens/001-token-starter-handoff.md) |
| FOUND-EXAMPLE-001 | Worked examples used as calibration, not presets | [`06--worked-examples/001-worked-examples-not-presets.md`](06--worked-examples/001-worked-examples-not-presets.md) |

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

## 4. RELEASE READINESS

Release is ready when every scenario PASSes or is SKIP only for environment reasons, and no scenario shows invented token roles, inaccessible color pairs, dishonest chart axes or generic responsive scaling.
