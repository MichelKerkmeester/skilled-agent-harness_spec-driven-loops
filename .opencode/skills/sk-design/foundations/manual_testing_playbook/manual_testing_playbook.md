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
| FOUND-COLOR-001 | OKLCH palette and dark-mode token plan | [`01--color/oklch-palette-and-dark-mode.md`](01--color/oklch-palette-and-dark-mode.md) |
| FOUND-TYPE-001 | Typography role system and measure | [`02--type/type-roles-and-measure.md`](02--type/type-roles-and-measure.md) |
| FOUND-LAYOUT-001 | Layout rhythm and responsive adaptation | [`03--layout/layout-rhythm-responsive.md`](03--layout/layout-rhythm-responsive.md) |

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

Release is ready when all three scenarios PASS or are SKIP only for environment reasons, and no scenario shows invented token roles, inaccessible color pairs, or generic responsive scaling.
