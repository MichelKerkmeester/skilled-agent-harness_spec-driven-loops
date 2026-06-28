---
title: "D3-R3 — Standing route-gold corpus + minimal pairs"
description: "Add expected route fields to the private gold and author new sk-design alias/holdout/adversarial fixtures the gated hubRoute stage scores against."
trigger_phrases:
  - "d3-r3 route gold corpus"
  - "route minimal pairs design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R3 — Standing route-gold corpus + minimal pairs

## 1. OBJECTIVE
Add `expected.workflowMode` / `routeOutcome` / `forbiddenWorkflowModes` / `minimalPairGroup` to the private gold corpus and author new sk-design fixtures (alias, holdout, adversarial minimal pairs), reusing the existing contamination lint.

## 2. WHY
There is no standing corpus of hint-free prompts to score routing against, so the gated `hubRoute` stage (D3-R2) has nothing to fail against. Minimal pairs are needed to catch silent-default and near-miss bundle errors.

## 3. TARGET & CLASS
- **Target file(s):** private gold corpus + new sk-design fixtures under the Lane C fixture root (authoring contract: `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md`)
- **Severity:** P0
- **Enforcement class:** hybrid
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Extend the gold schema with `expected.workflowMode`, `routeOutcome`, `forbiddenWorkflowModes`, `minimalPairGroup`.
- Author alias, holdout, and adversarial minimal-pair fixtures for sk-design.
- Reuse the existing contamination lint to keep hint-free prompts clean.
- **Candidate nested sub-phases (materialize at execution):** (a) gold-schema field extension; (b) alias fixtures; (c) holdout fixtures; (d) adversarial minimal-pair groups; (e) contamination-lint reuse.

## 5. ACCEPTANCE
- The gated `hubRoute` stage passes the new corpus on correct routes and fails closed on `forbiddenWorkflowModes` / minimal-pair flips; contamination lint reports clean.

## 6. EVIDENCE
- `scenario_authoring.md:27` — fixture authoring contract the new gold extends.
- Source: `research/research.md` §6 (D3-R3).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
