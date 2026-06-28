---
title: "D6-R3 — Lane C craft-stress fixtures"
description: "Author public/private fixture pairs (stateful-upload, dense-dashboard, locale-component) under the Lane C fixture root expecting specific mode bundles + proof fields."
trigger_phrases:
  - "d6-r3 lane c craft fixtures"
  - "craft stress fixtures design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R3 — Lane C craft-stress fixtures

## 1. OBJECTIVE
Add craft-stress scenarios that force specific design mode bundles and proof fields, exercising the harder real-world surfaces (stateful upload, dense dashboard, localized component).

## 2. WHY
designer-skills-main isolated craft surfaces (state, density, locale) that sk-design covers in prose but does not stress in the benchmark. Public/private fixture pairs convert those surfaces into gold-scored route + proof expectations.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/` (new Lane C `<skill-id>` pairs)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D3

## 4. BUILD OUTLINE
- Author public/private pairs per `scenario_authoring.md` (public = dispatch material, private = scorer-only gold).
- Encode expected `workflowMode` bundle + required proof fields for stateful-upload, dense-dashboard, locale-component.
- Tier fixtures (T1–T2) and publish the score-gap circularity meter.

## 5. ACCEPTANCE
- Each fixture admits to one router key; the scorer enforces the expected mode bundle + proof fields; circularity meter within authoring bounds.

## 6. EVIDENCE
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:22` — public/private fixture pair convention under `assets/skill_benchmark/fixtures/<skill-id>/`.
- Source: `research/research.md` §9 (D6-R3)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
