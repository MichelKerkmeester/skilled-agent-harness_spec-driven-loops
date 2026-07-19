---
title: Evidence Worksheet Label Carry-Through Scenario
description: Manual scenario verifying confirmed, inferred and not-assessed labels are carried from worksheet to findings and score.
trigger_phrases:
  - "test audit evidence worksheet"
  - "confirmed inferred not assessed"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: EVIDENCE_CAPTURE
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/audit-contract.md
  - assets/audit-report-template.md
  - ../shared/sk-code-handoff.md
  - references/evidence-capture.md
  - assets/audit-evidence-worksheet.md
---

**Exact prompt**

```
Audit this screenshot-only UI and carry confirmed, inferred and not-assessed labels into the findings.
```

# AUDIT-EVIDENCE-010 | Evidence Worksheet Label Carry-Through

## Expected Process

1. Route to `audit`.
2. Load `assets/audit-evidence-worksheet.md` with `references/evidence-capture.md`.
3. Fill target, evidence inventory, dimension coverage and finding rows.
4. Keep each label in the final findings and score caveats.

## Pass Criteria

- Screenshot-only claims are inferred, not confirmed.
- Missing browser or source evidence is not-assessed, not a pass.
- Findings preserve evidence labels.
- The score names any dimension that lacks evidence.
- Does not make conversion, behavior, confidence, business-impact, revenue, retention, support-load, or similar impact claims without supplied metrics, a baseline, usability-test evidence, or experiment results.
- Rephrases unsupported impact language as design risk and names the evidence that would prove the impact.
