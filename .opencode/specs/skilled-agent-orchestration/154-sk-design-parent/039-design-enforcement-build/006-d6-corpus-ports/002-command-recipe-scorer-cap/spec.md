---
title: "D6-R2 — commandRecipe scorer adapter (D2/D3 cap)"
description: "Insert a recipe-validity phase into score-skill-benchmark.cjs that caps D2/D3 scores when a command recipe is undefined or invalid."
trigger_phrases:
  - "d6-r2 command recipe scorer cap"
  - "command recipe design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R2 — commandRecipe scorer adapter (D2/D3 cap)

## 1. OBJECTIVE
Add a `commandRecipe` scoring phase that caps D2 (command specificity) and D3 (routing utilization) credit when a command lacks a valid, defined recipe.

## 2. WHY
The command-recipe projection (D6-R1) is only enforceable if the benchmark penalizes missing or malformed recipes. designer-skills-main's typed command surface gives the gold target; sk-design needs the scorer hook that makes undefined recipes a measurable failure rather than free credit.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D3

## 4. BUILD OUTLINE
- Insert a recipe phase before resource-recall: metadata validity → wrapper drift → arg fixture → route/bundle → choreography witness.
- Cap D2/D3 contributions when the recipe is undefined or fails any sub-check.
- Surface a `recipeMissRate` style signal alongside existing scorer outputs.

## 5. ACCEPTANCE
- A fixture with a missing/invalid recipe scores a capped D2/D3; a valid recipe passes; no regression to existing skill-benchmark phases.

## 6. EVIDENCE
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:125` — scorer phase region where the recipe stage is inserted.
- Source: `research/research.md` §9 (D6-R2)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
