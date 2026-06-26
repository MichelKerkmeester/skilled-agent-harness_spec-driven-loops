---
title: Audit Contract
description: P0-P3 severity model, five-dimension /20 scoring contract, findings schema, and evidence rules for design QA.
trigger_phrases:
  - "audit contract"
  - "P0 P1 P2 P3 design"
  - "design quality score"
  - "five dimension score"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Audit Contract

This is the output contract for `audit`. It is aligned in spirit with `sk-code-review`: findings first, evidence-backed, severity ordered, and actionable.

## 1. Severity

| Severity | Name | Definition | Examples |
| --- | --- | --- | --- |
| P0 | Critical | Prevents task completion, blocks access, or creates severe usability/accessibility failure | keyboard trap in checkout, inaccessible modal, primary action impossible on mobile |
| P1 | High | Significant difficulty, WCAG AA violation, severe responsive failure, systemic drift | unlabeled controls, text contrast fail, touch targets too small across flow |
| P2 | Medium | Annoyance with workaround, localized inconsistency, non-blocking performance issue | one cramped panel, isolated hard-coded color, minor jank |
| P3 | Polish | Low-impact detail that improves craft | optical alignment, copy tightening, subtle spacing refinement |

If unsure between severities, ask: would a real user fail, contact support, or abandon? If yes, it is at least P1.

## 2. Five-Dimension Score

Score each dimension 0-4.

| Dimension | 0 | 2 | 4 |
| --- | --- | --- | --- |
| Accessibility | inaccessible or blocks assistive use | partial a11y with significant gaps | WCAG AA met, keyboard/focus/names/forms solid |
| Performance | severe load/render/jank issues | some optimization, visible gaps | fast, measured, smooth on target devices |
| Responsive Design | desktop-only or breaks on mobile | works but rough edges | fluid, context-aware, touch targets >=44x44px (24x24px CSS WCAG 2.2 minimum) |
| Theming | hard-coded and no theme support | tokens exist but inconsistent | full semantic token use, dark mode works |
| Anti-Patterns | obvious AI slop/gallery of tells | one or two noticeable tells | distinctive, intentional, no generic tells |

Rating bands:
- `18-20` Excellent.
- `14-17` Good.
- `10-13` Acceptable.
- `6-9` Poor.
- `0-5` Critical.

## 3. Findings Schema

Use this shape for actionable findings:

```markdown
### P1 - Text contrast fails on primary CTA
- Evidence: `Button` text uses `#8aa0a8` on `#ffffff`; observed contrast below AA target.
- Category: Accessibility / Theming
- Impact: Low-vision users may not read the primary action.
- Recommended fix: Use semantic `text-on-accent` token with AA contrast, or darken foreground via OKLCH lightness.
- Owner: `sk-design-foundations` for token choice; `sk-code` for implementation.
```

## 4. Evidence Rules

- Use file/line when code is provided.
- Use rendered observation when a screenshot or live page is available.
- Use prompt/design artifact evidence when reviewing a plan.
- Label any inferred issue as inferred and state what would confirm it.
- Do not claim visual overlays, browser inspection, or automated scans ran unless they actually ran.

## 5. Report Order

1. Findings by severity.
2. Audit Health Score table.
3. Anti-pattern verdict.
4. What is working.
5. Recommended next actions by owner.
6. Evidence limits and residual risks.
