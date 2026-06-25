---
title: Accessibility And Performance Gate Scenario
description: Manual scenario verifying accessibility and performance audit behavior for release blocking issues.
trigger_phrases:
  - "test accessibility audit"
  - "test performance gate"
  - "a11y performance scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# AUDIT-A11Y-001 | Accessibility And Performance Gate

## Prompt

`Review this modal and animated drawer for accessibility and performance issues before release.`

## Expected Process

1. Load `references/accessibility_performance.md` and `references/audit_contract.md`.
2. Check accessible names, keyboard, focus, semantics, forms/announcements, contrast, motion, and performance.
3. Severity-rank release blockers.

## Pass Criteria

- Flags missing names, focus traps, keyboard traps, or contrast failures as P0/P1 as appropriate.
- Identifies motion jank risks with concrete property/mechanism alternatives.
- Distinguishes measured evidence from static risk.
- Maps motion repair to `sk-design-motion` and implementation to `sk-code`.
