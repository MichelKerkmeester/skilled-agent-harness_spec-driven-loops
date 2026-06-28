---
title: "D1-R7 — Baseline rhythm: line-height→spacing relation not required"
description: "Add a baseline rhythm row to the foundations token starter, link it from layout_responsive.md, and add a validator checking spacing is a multiple/fraction or marked exception."
trigger_phrases:
  - "d1-r7 baseline rhythm"
  - "baseline rhythm token design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R7 — Baseline rhythm: line-height→spacing relation not required

## 1. OBJECTIVE
Make the line-height→spacing relationship an explicit token-starter row and validate that spacing values relate to the baseline rhythm, so vertical rhythm is required rather than incidental.

## 2. WHY
The line-height→spacing relation is not required anywhere, so baseline rhythm drifts and spacing is unconstrained.

## 3. TARGET & CLASS
- **Target file(s):** `design-foundations/assets/token_starter.md`, `layout/layout_responsive.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add a `baseline rhythm` row to `design-foundations/assets/token_starter.md`.
- Link it from `layout/layout_responsive.md`.
- Add a validator checking spacing = multiple/fraction of the baseline or marked as an exception.
- **Candidate nested sub-phases (materialize at execution):** token-starter baseline row / responsive link + spacing validator

## 5. ACCEPTANCE
- Validator fails spacing values that are neither a baseline multiple/fraction nor a marked exception (deterministic).

## 6. EVIDENCE
- `typeset.md:136` — impeccable's line-height→spacing rhythm rule not carried into foundations.
- Source: `research/research.md` §4 (D1-R7)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
