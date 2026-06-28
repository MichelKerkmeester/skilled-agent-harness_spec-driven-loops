---
title: "D3-R5 — Live ROUTED: declaration token + parser"
description: "Add a ROUTED: line+JSON token to the live prompt and make live-executor.cjs populate observedWorkflowMode/observedIntents, fail-closed when absent."
trigger_phrases:
  - "d3-r5 routed declaration token"
  - "live route declaration design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R5 — Live ROUTED: declaration token + parser

## 1. OBJECTIVE
Add a `ROUTED:` line + JSON route token to the live prompt and make `live-executor.cjs` parse it to populate `observedWorkflowMode` / `observedIntents`, failing closed when the token is absent.

## 2. WHY
`intentRecall=0` today because the live executor never captures what the model actually routed to. Without a parsed declaration there is no observed route to compare against expected, so live utilization is invisible.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` (+ live prompt)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Add a `ROUTED:` line+JSON token to the live prompt template.
- Parse it in `live-executor.cjs` into `observedWorkflowMode` / `observedIntents`.
- Fail closed (`route-declaration-missing`) when no token is returned.

## 5. ACCEPTANCE
- Live runs report a non-zero `intentRecall` (today `0`) when the token is present and raise `route-declaration-missing` when it is omitted.

## 6. EVIDENCE
- `live-executor.cjs:243` — live-output capture path that leaves intent unpopulated.
- Source: `research/research.md` §6 (D3-R5).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
