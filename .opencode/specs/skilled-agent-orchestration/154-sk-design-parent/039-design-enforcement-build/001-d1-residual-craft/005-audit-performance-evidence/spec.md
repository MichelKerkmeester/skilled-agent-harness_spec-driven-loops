---
title: "D1-R5 — Optimize metric proof softened — audit report has no baseline/delta fields"
description: "Add a Performance Evidence block to the audit report template and require a numeric metric or explicit not-assessed label for Perf scores above 2."
trigger_phrases:
  - "d1-r5 performance evidence"
  - "audit performance evidence design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R5 — Optimize metric proof softened — audit report has no baseline/delta fields

## 1. OBJECTIVE
Add baseline/delta performance fields to the audit report so optimize claims carry measured evidence or an explicit not-assessed label instead of soft prose.

## 2. WHY
The audit report has no baseline/delta fields, so optimize metric proof is softened and a high Perf score can be claimed without a number.

## 3. TARGET & CLASS
- **Target file(s):** `design-audit/assets/audit_report_template.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add a `Performance Evidence` block (baseline, post-change, static-risk label, "measurement needed") to `design-audit/assets/audit_report_template.md`.
- Require Perf score > 2 to carry a numeric metric or an explicit not-assessed label.

## 5. ACCEPTANCE
- Report check: a Perf score > 2 without a numeric metric or not-assessed label fails (deterministic). Whether the metric is real stays advisory.

## 6. EVIDENCE
- `optimize.md:21` — impeccable's metric-proof requirement the audit report softens.
- Source: `research/research.md` §4 (D1-R5)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
