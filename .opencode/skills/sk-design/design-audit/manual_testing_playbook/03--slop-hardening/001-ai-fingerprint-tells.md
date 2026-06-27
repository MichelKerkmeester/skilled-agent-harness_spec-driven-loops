---
title: AI Fingerprint Tells Scenario
description: Manual scenario verifying model-specific AI tells are detected as checkable findings with the right severity and owner.
trigger_phrases:
  - "test ai fingerprint tells"
  - "test model specific tell detection"
  - "ai fingerprint tells scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# AUDIT-SLOP-002 | AI Fingerprint Tells

## Target

Supply one concrete UI artifact in the `<TARGET>` slot likely to carry generator tells, for example a ghost-card border plus shadow, over-rounded cards, a diagonal stripe background, an image-hover transform or a cream body background: a source file path, a rendered URL or a screenshot. If no target is available, record SKIP with the blocker "no target artifact supplied". Do not invent tells.

## Prompt

`Audit <TARGET> for model-specific AI tells and tell me which generator they point at.`

## Expected Process

1. Load `references/ai_fingerprint_tells.md` and `references/audit_contract.md`.
2. Walk the catalog and check each concrete rule against the surface.
3. File a finding for every hit with the exact element, the user impact and the owner.
4. Score the gallery: one isolated tell is P3 or P2, while three or more tells on one surface fail the Anti-Patterns dimension at P1 or higher.

## Pass Criteria

- Each tell is filed with the exact element, selector or file and line as evidence, not a vague impression.
- A tell read from source is labeled confirmed. A tell suspected from a screenshot alone is labeled inferred with the source that would confirm it.
- Severity follows the rule of thumb: one tell is low, three or more stacked tells push the Anti-Patterns dimension to P1, a tell that also breaks a user task climbs to P0.
- Most tells route to the Anti-Patterns dimension, with the noted exceptions touching Theming or Performance.
- A clean pass is reported as no model-specific tells found, not as proof the design is distinctive.
