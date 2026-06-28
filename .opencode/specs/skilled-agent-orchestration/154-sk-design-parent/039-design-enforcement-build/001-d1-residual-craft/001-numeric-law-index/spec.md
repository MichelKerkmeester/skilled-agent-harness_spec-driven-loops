---
title: "D1-R1 — No central index of cross-mode numeric laws"
description: "Add a shared numeric_design_laws.md index of cross-mode numeric laws to sk-design/shared/."
trigger_phrases:
  - "d1-r1 numeric laws"
  - "numeric law index design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R1 — No central index of cross-mode numeric laws

## 1. OBJECTIVE
Create a single shared index of the numeric design laws that recur across modes, so each law has one canonical home with its value, owner, and enforcement target instead of being restated per mode.

## 2. WHY
The shared base is only conceptual today: numeric laws are scattered across mode docs with no central registry, making drift and duplication invisible.

## 3. TARGET & CLASS
- **Target file(s):** `sk-design/shared/numeric_design_laws.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add `sk-design/shared/numeric_design_laws.md` indexing cross-mode numeric laws.
- Each row carries: law_id, value/range, owner mode, enforcement target, source, caveat.
- Wire a benchmark assertion that fails when any row is incomplete.

## 5. ACCEPTANCE
- Docs benchmark asserts every law row has all required columns populated (deterministic).

## 6. EVIDENCE
- `SKILL.md:31` vs `shared/cognitive_laws.md:16` — impeccable carries the law inline while the shared base only references it conceptually.
- Source: `research/research.md` §4 (D1-R1)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
