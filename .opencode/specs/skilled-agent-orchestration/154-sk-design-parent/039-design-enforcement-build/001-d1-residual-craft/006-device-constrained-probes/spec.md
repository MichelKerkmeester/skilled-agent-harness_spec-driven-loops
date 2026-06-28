---
title: "D1-R6 — Harden device/constrained-context probes missing"
description: "Add a Device And Constrained Context section to the hardening edge-cases reference covering low-power, Save-Data, CPU-throttle, offline→online, and slow media."
trigger_phrases:
  - "d1-r6 constrained context probes"
  - "device constrained probes design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R6 — Harden device/constrained-context probes missing

## 1. OBJECTIVE
Add device and constrained-context probes to the hardening reference so audits cover low-power, data-saver, throttled, and offline conditions with explicit pass/fail/skip plus evidence.

## 2. WHY
The harden matrix has no device/constrained-context probes, so low-power and data-saver failure modes go unaudited.

## 3. TARGET & CLASS
- **Target file(s):** `design-audit/references/hardening_edge_cases.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add a `Device And Constrained Context` section to `design-audit/references/hardening_edge_cases.md`.
- Cover low-power, Save-Data, CPU-throttle, offline→online, and slow media.
- Each probe records pass/fail/skip + evidence.

## 5. ACCEPTANCE
- Review step: each constrained-context probe is present with a pass/fail/skip verdict and evidence (advisory review).

## 6. EVIDENCE
- `harden.md:18` — impeccable's device/constrained-context coverage the live matrix lacks.
- Source: `research/research.md` §4 (D1-R6)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
