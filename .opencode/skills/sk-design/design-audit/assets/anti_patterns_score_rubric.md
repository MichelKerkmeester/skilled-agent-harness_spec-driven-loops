---
title: Anti-Patterns Score Rubric
description: Calibration ladder for the Anti-Patterns audit score from 0 to 4 with evidence labels preserved.
trigger_phrases:
  - "anti-patterns score rubric"
  - "anti-patterns calibration"
  - "design slop score"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Anti-Patterns Score Rubric

Use this 0 to 4 ladder for the Anti-Patterns dimension in full audits. It calibrates the score. It does not replace severity or evidence labels.

| Score | Calibration |
| --- | --- |
| 4 | No obvious model-specific tells, no generic layout grammar and a register-fit identity that feels intentional. |
| 3 | One isolated P3 tell or minor generic choice, not identity-defining and easy to preserve around. |
| 2 | One P2 tell, repeated low-grade generic pattern or weak register fit with a clear workaround. |
| 1 | Three or more tells, systemic generic identity or register mismatch that weakens trust or clarity. |
| 0 | Anti-pattern directly blocks task completion, causes an accessibility failure or makes the UI unusable or untrustworthy. |

## Use Notes

- Score the visible surface, not the model you suspect created it.
- Keep confirmed, inferred or not-assessed labels from the evidence worksheet.
- A P0 or P1 finding can force a low score even when the rest of the surface is polished.
- A single fashionable pattern is not a failure if it is role-bound, accessible and brief-specific.
- Do not raise the score to be kind. A 4 means the surface has no meaningful anti-pattern evidence in scope.
