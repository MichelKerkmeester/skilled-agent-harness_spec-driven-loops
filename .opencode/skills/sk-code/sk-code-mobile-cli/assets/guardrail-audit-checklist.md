---
title: Guardrail Audit Checklist
description: Checklist to confirm every @ds guardrail do-not-edit fence in the Pi Remote app is untouched after a design-system change.
trigger_phrases:
  - "guardrail audit checklist"
  - "confirm no do-not-edit fence changed"
  - "pi remote guardrail check"
  - "designer edit safety check"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Guardrail Audit Checklist

Use this checklist after any change to `apps/pi-remote-web/` presentation code, before claiming the
change is complete. Every `@ds guardrail: do-not-edit` fence marks something that is not a styling
concern — see `references/editability-guardrails.md` §1 for the full reason each one is frozen.

## 1. BASELINE THE FENCE COUNT (before the change)

□ Recorded the guardrail-fence count in `src/style.css` before editing:
  `grep -o '@ds guardrail: do-not-edit' apps/pi-remote-web/src/style.css | wc -l`
□ Recorded the guardrail-fence count across components before editing:
  `grep -rlo '@ds guardrail: do-not-edit' apps/pi-remote-web/src --include='*.tsx' --include='*.ts' | wc -l`

Do not hard-code a specific expected number in a completion claim — the codebase evolves; the checklist
proof is that the count and the fenced regions are **unchanged** by this specific change, verified fresh
each time.

## 2. THE FENCE CATEGORIES TO VERIFY (untouched)

For each category below, confirm none of the lines fenced `@ds guardrail: do-not-edit` were edited,
removed, or worked around by the change:

□ The 8 `--pi-*` primitive source values (light, dark, and system-dark blocks — three declarations each)
□ The shared focus ring / `:focus-visible` treatment
□ `prefers-reduced-motion` / `prefers-contrast` / `forced-colors` blocks
□ ≥44px interactive target sizes
□ Per-surface **state machines** (which state renders when) — not the state's presentation
□ Per-surface **status-text** sources (the content, not its styling)
□ The plan-mode authority-gating overlay and the atomic execute/review path
□ The redaction affordance chip
□ Bounded-reading overflow / `unicode-bidi` / scroll-anchoring rules
□ Any theme-invariant literal explicitly fenced as such (e.g. `.artifact-diff-line.is-find-match`,
  fenced `@ds guardrail: do-not-edit — theme-invariant light literal; stays fixed` —
  `references/component-tokens.md` §3)

## 3. RE-COUNT AFTER THE CHANGE

□ Re-ran the same two `grep` commands from §1 after the change
□ Confirmed the fence count in `style.css` is unchanged (or, if a new guardrail-worthy region was
  legitimately added by a separate, explicitly-approved change, that the delta is documented and
  understood — not a silent regression)
□ Confirmed the fence count across components is unchanged
□ Diffed the actual fenced line contents (not just the count) for every touched file — a count staying
  the same does not prove no fenced line was edited if another was added elsewhere

## 4. WHY THE OTHER SEAMS ARE SAFE (confirm the boundary held)

□ Confirmed the change is presentation-only: colour, spacing, typography, or layout — nothing that
  reaches state computation, the mutation/ticket path, redaction, or plan-mode enforcement
  (`references/editability-guardrails.md` §2)
□ Confirmed no CSS/token edit was used to work around a guardrail (e.g. hiding the redaction chip with
  `display: none`, or overriding a focus-ring colour to make it less visible)

## 5. RED FLAGS — STOP AND ESCALATE

□ A requested change cannot be made through a `@ds edit:` / `slot:` / `state:` / `variant:` seam without
  touching a guardrail-fenced region
□ A change would alter a resolved token value, a security boundary, or an accessibility guarantee
□ A guardrail comment itself needed editing to make the change "work"

If any red flag is true, stop and escalate per `SKILL.md` §5 — do not remove or reword the guardrail
comment to make the diff pass.

## 6. RELATED RESOURCES

- [editability-guardrails.md](../references/editability-guardrails.md) — the fence list and why each matters
- [ds-grammar.md](../references/ds-grammar.md) — how to read a `@ds` seam at the edit site
- [ds-verification-checklist.md](ds-verification-checklist.md) — the full command-gate checklist
