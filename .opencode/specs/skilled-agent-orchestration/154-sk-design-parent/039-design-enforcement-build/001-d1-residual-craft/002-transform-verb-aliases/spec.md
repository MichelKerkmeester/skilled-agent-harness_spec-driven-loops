---
title: "D1-R2 — Transform verbs absent from registry aliases + no interface authoring lane"
description: "Add transform-verb aliases to mode-registry.json plus a design-interface transform_application.md authoring lane with gold prompts."
trigger_phrases:
  - "d1-r2 transform verbs"
  - "transform verb aliases design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R2 — Transform verbs absent from registry aliases + no interface authoring lane

## 1. OBJECTIVE
Register the transform verbs (bolder/quieter/distill/clarify/delight) as routing aliases and give the interface mode an authoring lane so transform requests route deterministically and have a place to land.

## 2. WHY
The verbs are missing from registry aliases, and there is no interface authoring lane, so transform intents have no parseable route and no owning contract.

## 3. TARGET & CLASS
- **Target file(s):** `mode-registry.json`, `design-interface/references/design-process/transform_application.md`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add aliases `bolder/quieter/distill/clarify/delight` to `mode-registry.json`.
- Add a parent tie-breaker (audit = "should it be" / interface = "make it").
- Create `design-interface/references/design-process/transform_application.md` + router-replay gold prompts.

## 5. ACCEPTANCE
- Router-replay over the gold prompts resolves each transform verb to the correct mode with no alias collision (deterministic).

## 6. EVIDENCE
- `mode-registry.json:14` — current alias block has no transform verbs.
- Source: `research/research.md` §4 (D1-R2)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
