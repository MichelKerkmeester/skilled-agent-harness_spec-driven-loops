---
title: Accessibility Audit
description: Private procedure card for design-audit accessibility review across contrast, semantics, keyboard behavior, motion, and forms.
trigger_phrases:
  - "accessibility audit"
  - "wcag review"
  - "inclusive design review"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Accessibility Audit

Private procedure card for applying the existing design-audit accessibility review workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-audit` review a design for accessibility risks across contrast, semantics, keyboard behavior, motion, and forms. |
| Owning mode | `design-audit` |
| Source reference | `accessibility-audit.md` |
| Trigger | Use when the request asks for accessibility, WCAG, inclusive design, contrast, keyboard, focus, form, or release-readiness review. |
| Output contract | A findings-first accessibility report with evidence labels, severity, user impact, owner mapping, and what would confirm unresolved findings. |
| Proof gate | The report covers contrast/color, semantic structure, keyboard/focus, motion/forms/miscellaneous, and does not claim accessibility where evidence is missing. |
| Privacy rule | This is private audit guidance and not a public accessibility skill. |

## 2. READ-ONLY COMPATIBILITY

`design-audit` may use Read, Glob, and Grep evidence plus supplied artifacts to report findings. It routes fixes to owners and does not require editing files itself.

## 3. PROCEDURE

1. Resolve the target artifact and expected accessibility bar.
2. Review contrast and color signaling with actual values when available; otherwise label gaps.
3. Review semantic structure, labels, alt text, landmarks, and ARIA discipline.
4. Review keyboard access, logical tab order, focus visibility, and expected interaction patterns.
5. Review motion preferences, flashing risk, form errors, required indicators, autocomplete, and touch target size.
6. Order findings by severity and map each to audit, foundations, motion, interface, or `sk-code` implementation.

## 4. RELATED CARDS

- `../../design-motion/procedures/interaction-states-pass.md` for detailed state feedback requirements.
- `../../shared/procedures/polish-gate-orchestration.md` for full pre-delivery aggregation.
