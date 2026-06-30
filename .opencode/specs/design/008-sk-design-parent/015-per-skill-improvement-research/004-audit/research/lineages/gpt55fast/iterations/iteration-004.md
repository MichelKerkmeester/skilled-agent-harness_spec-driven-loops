# Iteration 004 - Accessibility, Performance and Quick-Fix Handoff

## Focus

Check whether accessibility/performance findings have actionable but bounded fix references.

## Evidence Read

- `references/accessibility_performance.md` prioritizes accessible names, keyboard, focus/dialogs, semantics, forms/errors, announcements, contrast/states and motion/media.
- It gives concrete WCAG contrast, touch target and Core Web Vitals thresholds.
- `assets/a11y_quick_fixes.md` gives snippet-level fixes but repeatedly states the audit cites them and `sk-code` applies accepted changes.

## Findings

1. No new a11y basics reference is needed. The current coverage is sufficient and numerically grounded.
2. The improvement is handoff shape: a finding should cite the quick-fix section and then a backlog row should carry owner, evidence, target, accepted fix shape and verification command or manual check.
3. Do not turn audit into a fixer. The strongest pattern is `audit -> accepted backlog -> sk-code`, not `audit applies snippets`.

## Delta

- New information ratio: 0.44.
- Q4 partly answered; Q6 partly answered.

## Next

Inspect hardening probes and production-readiness run logging.
