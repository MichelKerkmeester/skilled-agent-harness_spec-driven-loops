---
title: "D5-R7 — Static token lint + router-replay + prompt-replay + negative-control fixtures"
description: "Add fixtures asserting design prompts route to DESIGN and carry manifest tokens, with a neither-loaded negative control, under the skill-benchmark harness."
trigger_phrases:
  - "d5-r7 token lint route replay fixtures"
  - "design routing fixtures design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R7 — Static token lint + router-replay + prompt-replay + negative-control fixtures

## 1. OBJECTIVE
Add fixtures + lint that assert design prompts route to the `DESIGN` lane and carry the manifest tokens (sk-design, context_loading_contract.md, register.md, proof cards), plus a neither-loaded negative control — extending the existing router-replay / d5-connectivity harness.

## 2. WHY
The other D5 phases are only as trustworthy as their test gate. Without fixtures, manifest presence and routing are claims, not facts; a negative control prevents a checker that passes everything from masking a regression.

## 3. TARGET & CLASS
- **Target file(s):** fixtures + checker under `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/` (router-replay / d5-connectivity style)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- Author positive fixtures: design prompts → `DESIGN` lane + manifest tokens present in the dispatch payload.
- Author a neither-loaded negative control that must fail closed.
- Wire static token lint + router-replay + prompt-replay assertions into the existing harness.

## 5. ACCEPTANCE
- The harness passes the positive fixtures (DESIGN routing + manifest tokens) and rejects the negative control; a missing manifest token or a misroute fails the gate.

## 6. EVIDENCE
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` — existing deterministic router-replay harness to extend with DESIGN fixtures; `d5-connectivity.cjs` is the sibling connectivity gate.
- Source: `research/research.md` §8 (D5-R7); fixture evidence `research/iterations/iteration-050.md:65`.

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
