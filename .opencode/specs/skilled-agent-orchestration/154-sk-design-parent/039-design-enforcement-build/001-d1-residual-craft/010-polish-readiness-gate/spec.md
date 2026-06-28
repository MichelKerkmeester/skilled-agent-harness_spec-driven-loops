---
title: "D1-R10 — Polish readiness is prose, not a gate"
description: "Add a Polish Readiness subsection to critique_hardening.md plus a report row (ready/blocked/not-assessed) and a static TODO/FIXME scan."
trigger_phrases:
  - "d1-r10 polish readiness"
  - "polish readiness gate design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R10 — Polish readiness is prose, not a gate

## 1. OBJECTIVE
Turn polish readiness into a structured gate with an explicit verdict and a static scan, so readiness is reported as ready/blocked/not-assessed rather than narrated.

## 2. WHY
Polish readiness is prose, not a gate, so a packet can read as "polished" with no verdict and no scan of unfinished markers.

## 3. TARGET & CLASS
- **Target file(s):** `design-audit/references/critique_hardening.md`
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add a `Polish Readiness` subsection to `design-audit/references/critique_hardening.md`.
- Add a report row with verdict: ready / blocked / not-assessed.
- Add a static TODO/FIXME scan feeding the verdict.

## 5. ACCEPTANCE
- Report check: a polish-readiness row exists with a verdict and the TODO/FIXME scan ran (deterministic).

## 6. EVIDENCE
- `polish.md:22` — impeccable's polish-readiness gate the live critique only narrates.
- Source: `research/research.md` §4 (D1-R10)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
