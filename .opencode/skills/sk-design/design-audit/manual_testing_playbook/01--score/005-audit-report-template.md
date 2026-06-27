---
title: Audit Report Template Scenario
description: Manual scenario verifying the fill-in audit report skeleton produces a findings-first report with the five-dimension score, owner mapping and evidence caveats.
trigger_phrases:
  - "test audit report template"
  - "test fill in audit report"
  - "audit report template scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: AUDIT_CONTRACT
expected_resources:
  - references/audit_contract.md
  - assets/audit_report_template.md
---

**Exact prompt**

```
Run a full audit on this page and give me the complete report using the audit report template with the /20 quality score.
```

# AUDIT-SCORE-004 | Audit Report Template

## Target

Supply one concrete UI artifact in the `<TARGET>` slot: a source file path, a rendered URL, a screenshot or a design plan. If no target is available, record SKIP with the blocker "no target artifact supplied". Do not fill the template against invented evidence.

## Prompt

`Audit <TARGET> and give me the full report using the audit report template.`

## Expected Process

1. Load `assets/audit_report_template.md` and `references/audit_contract.md`.
2. Resolve the register before scoring so the dimension weighting is correct.
3. Fill the frame, the anti-patterns verdict and the severity-ordered findings before the score.
4. Complete the five-dimension score, the owner mapping, the next actions and the evidence-limits close.

## Pass Criteria

- The report follows the template order: frame, anti-patterns verdict, findings, positive findings, score, owner mapping, next actions, evidence limits.
- Findings come before the score, and the score reads as a summary of those findings rather than a replacement.
- The total is out of 20 with the correct rating band, and no dimension is scored generously to soften the report.
- Owner mapping routes direction to `interface`, tokens to `foundations`, choreography to `motion` and implementation to `sk-code`.
- The evidence-limits section names what could not be verified and what would close the gap.
