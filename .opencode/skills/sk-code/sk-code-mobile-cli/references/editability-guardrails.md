---
title: Editability Guardrails
description: The @ds guardrail do-not-edit fences and the architectural reason a presentation edit cannot reach logic or the security boundary.
trigger_phrases:
  - "do-not-edit fences"
  - "design system guardrails"
  - "editable seams and frozen lines"
  - "presentation only edits"
  - "frozen security posture"
  - "guardrail audit checklist"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Editability Guardrails

The design system is safe to edit because the editable seams and the frozen lines are both marked, and
because CSS/token edits are structurally unable to reach behavior. This reference is the fence list and
the reason each fence matters.

---

## 1. OVERVIEW

### Core Principle

CSS and token edits are presentation-only and structurally cannot reach state, logic, or the security
boundary — the moment an edit stops being paint, it is fenced as a guardrail.

### When to Use

- Confirming which design-system elements are fenced from edits before making a change
- Auditing a proposed CSS/token change against the guardrail list
- Verifying no design-system edit crosses into logic or security enforcement
- Understanding why an editable seam (tokens, slots, state presentation, layout) is safe to touch

### Key Sources

- `assets/guardrail-audit-checklist.md` — a checklist to confirm no fence in §2 moved after a
  design-system change.

---

## 2. THE FENCES (`@ds guardrail: do-not-edit`)

| Fenced | Why it is frozen |
| --- | --- |
| The 8 `--pi-*` primitive source values | the palette contract; every layer resolves through them |
| The shared focus ring / `:focus-visible` | WCAG focus visibility — keyboard users must see where they are |
| `prefers-reduced-motion` / `prefers-contrast` / `forced-colors` blocks | accessibility guarantees adapting to system settings |
| ≥44px interactive target sizes | WCAG target size |
| Per-surface **state machines** and **status-text** sources | logic and content, not presentation |
| The plan-mode authority-gating overlay + the atomic execute/review path | security enforcement — who may act, atomically |
| The redaction affordance chip | its presence is a security signal that content is redacted |
| Bounded-reading overflow / `unicode-bidi` / scroll-anchoring | safe rendering of untrusted text |

Across the app these fences number 75 in `style.css` and 255 in the components.

---

## 3. WHY THE OTHER SEAMS ARE SAFE

CSS and token edits are **presentation-only**. They change what a surface looks like; they cannot reach
state computation, the mutation/ticket path, redaction, or plan-mode enforcement, because all of that
lives in TypeScript, never in the stylesheet. A designer changing tokens, slots, state presentation, or
layout is changing paint, not behavior. The moment an edit stops being paint — a state machine, status
text, security or redaction code — it is fenced as a guardrail. This is what the guardrail audit proved:
no in-seam edit path crosses into logic or the security boundary.

---

## 4. FROZEN SECURITY POSTURE (context a workflow must not weaken)

The app ships read-only by default; mutations are one-use, ticketed, revision-checked, and fail-closed;
redaction is allowlist-based and structural; plan mode is host-enforced; pushes are content-free;
`--full-access` is operator-only and the phone cannot enable it. A design-system edit touches none of
this — but a workflow bundling this surface must never let a presentation change become a path into it.

---

## 5. RELATED REFERENCES

- `assets/guardrail-audit-checklist.md` — a checklist to confirm no fence in §2 moved after a
  design-system change.
