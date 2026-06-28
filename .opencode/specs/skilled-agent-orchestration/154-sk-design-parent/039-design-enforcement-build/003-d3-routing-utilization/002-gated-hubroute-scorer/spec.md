---
title: "D3-R2 — Gated hubRoute scorer lane"
description: "Insert a hard hubRoute stage before routed-intra in score-skill-benchmark.cjs so wrong-mode/silent-default/bundle-mismatch routing fails closed."
trigger_phrases:
  - "d3-r2 hubroute scorer"
  - "gated hub route design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R2 — Gated hubRoute scorer lane

## 1. OBJECTIVE
Insert a hard `hubRoute` stage before the advisory `routed-intra` stage in `score-skill-benchmark.cjs`, with `firstFailingStage` values `wrong-mode`, `silent-default`, and `bundle-mismatch`, so a mis-route blocks rather than merely lowering a score.

## 2. WHY
Routing correctness is currently judged only by advisory `modePrecision`, which never blocks. A wrong hub route can pass the suite, so the selection layer has no fail-closed gate.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- **Severity:** P0
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Add a `hubRoute` stage ordered before `routed-intra` in the scorer pipeline.
- Emit `firstFailingStage: wrong-mode | silent-default | bundle-mismatch` on miss.
- Stop relying on advisory `modePrecision` as the routing signal; the new stage is the gate.

## 5. ACCEPTANCE
- The `hubRoute` stage fails closed against the D3-R3 gold corpus when `expected.workflowMode` / `routeOutcome` is not met; a passing run reports the correct `firstFailingStage` on seeded failures.

## 6. EVIDENCE
- `score-skill-benchmark.cjs:278` — insertion point ahead of the `routed-intra` stage.
- Source: `research/research.md` §6 (D3-R2).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
