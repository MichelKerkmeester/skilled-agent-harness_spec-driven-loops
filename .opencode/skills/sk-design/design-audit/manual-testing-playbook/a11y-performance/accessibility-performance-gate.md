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
expected_intent: ACCESSIBILITY_PERFORMANCE
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/accessibility-performance.md
  - assets/a11y-quick-fixes.md
---

**Exact prompt**

```
Check this modal for accessibility and performance before release: keyboard, focus, contrast, WCAG, and any animation jank.
```

# AUDIT-A11Y-001 | Accessibility And Performance Gate

## Target

Supply one concrete interactive component artifact in the `<TARGET>` slot (for example a modal and animated drawer): a source file path, a rendered URL, or a screenshot. If no component target is available, record SKIP with the blocker "no target artifact supplied"; do not invent rendered or measured evidence.

## Prompt

`Review <TARGET> for accessibility and performance issues before release.`

## Expected Process

1. Load `references/accessibility-performance.md` and `references/audit-contract.md`.
2. Check accessible names, keyboard, focus, semantics, forms/announcements, contrast, motion, and performance.
3. Severity-rank release blockers.

## Pass Criteria

- Flags missing names, focus traps, keyboard traps, or contrast failures as P0/P1 as appropriate.
- Covers the main accessibility modalities before a release-ready verdict: keyboard, screen reader, zoom/reflow, high contrast, and reduced motion.
- Groups accessibility findings under WCAG POUR when that improves readability, without replacing the severity model.
- Identifies motion jank risks with concrete property/mechanism alternatives.
- Distinguishes measured evidence from static risk.
- Maps motion repair to `motion` and implementation to `sk-code`.
- Uses the current Core Web Vital Interaction to Next Paint (INP), not the deprecated First Input Delay (FID), matching the `references/corpus-map.md` modernization guard.
