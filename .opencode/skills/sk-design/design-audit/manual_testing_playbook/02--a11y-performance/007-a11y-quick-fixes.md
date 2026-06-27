---
title: Accessibility Quick Fixes Scenario
description: Manual scenario verifying accessibility findings cite the snippet-level fix card by reference and stop at naming the fix.
trigger_phrases:
  - "test a11y quick fixes"
  - "test accessibility fix snippet"
  - "a11y quick fixes scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# AUDIT-A11Y-002 | Accessibility Quick Fixes

## Target

Supply one concrete artifact in the `<TARGET>` slot with at least one accessibility defect, for example an icon-only button, a div wired as a button, a modal that mismanages focus or a form error shown by color alone: a source file path, a rendered URL or a screenshot. If no target is available, record SKIP with the blocker "no target artifact supplied". Do not invent markup defects.

## Prompt

`Audit <TARGET> for accessibility and point me at the fix shape for each issue.`

## Expected Process

1. Load `references/accessibility_performance.md`, `assets/a11y_quick_fixes.md` and `references/audit_contract.md`.
2. File each accessibility finding with evidence and a severity.
3. Point the finding at the matching section of the quick-fixes card for the fix shape.
4. Name the owner: `foundations` for a token-level fix such as contrast, otherwise `sk-code` for the markup change.

## Pass Criteria

- Each accessibility finding cites the matching quick-fix section: accessible names, keyboard, focus and dialogs, semantics, forms and errors, live regions, contrast and states or motion.
- The recommended shape prefers native HTML before ARIA and keeps the change minimal.
- Contrast and touch findings measure against the numbers in `references/accessibility_performance.md` rather than an eyeball.
- The audit stops at naming the fix and applying it is deferred to `sk-code` after the user accepts.
