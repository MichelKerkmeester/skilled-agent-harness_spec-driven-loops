---
title: Editability Guardrails
description: The natural Do not edit — guardrail notes and the architectural reason a presentation edit cannot reach logic or the security boundary.
trigger_phrases:
  - "do not edit notes"
  - "design system guardrails"
  - "editable seams and frozen lines"
  - "presentation only edits"
  - "frozen security posture"
  - "guardrail audit checklist"
  - "guardrail fence counter"
importance_tier: normal
contextType: implementation
version: 0.1.7.0
---

# Editability Guardrails

The design system is safe to edit because editable presentation and frozen behavior are both explained
at the edit site. Presentation comments describe the intended seam in human language; every protected
line carries a same-line note beginning exactly `Do not edit — <why>`.

---

## 1. OVERVIEW

### Core Principle

CSS and token edits are presentation-only and structurally cannot reach state, logic, or the security
boundary — the moment an edit stops being paint, it is fenced with a `Do not edit —` note.

### When to Use

- Confirming which design-system elements are fenced from edits before making a change
- Auditing a proposed CSS/token change against the guardrail list
- Verifying no design-system edit crosses into logic or security enforcement
- Reading whether a nearby purpose comment describes a token, slot, state presentation, variant, theme,
  or layout seam

### Key Sources

- `assets/guardrail-audit-checklist.md` — a checklist to confirm no fence in §2 moved after a
  design-system change.
- [`comment-grammar.md`](comment-grammar.md) — the full natural comment convention and the four edit classes.

---

## 2. THE FENCES (`Do not edit — <why>`)

Every frozen line or region carries a one-line comment whose first words are exactly `Do not edit —`.
The reason stays on that line and names the durable contract, for example:

~~~css
/* Do not edit — security seam */
~~~

The app's `scripts/naming/scan-comments.mjs` gate re-anchors its guardrail-fence counter onto the
`Do not edit —` marker, so retiring the old marker syntax preserves the fence count. Baseline the count
and the fenced line contents before a change, then prove both are unchanged afterward.

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

Across the app these fences number 75 in `app-mobile/src/app.css` and 255 in the components. The
authoritative count is the scanner's current output; do not hard-code those historical baselines into a
completion claim.

---

## 3. WHY THE OTHER SEAMS ARE SAFE

CSS and token edits are **presentation-only**. They change what a surface looks like; they cannot reach
state computation, the mutation/ticket path, redaction, or plan-mode enforcement, because all of that
lives in TypeScript, never in the stylesheet. The safe edit classes are:

1. **Token** — retint a semantic role for a shared blast radius or a component token for one surface;
   never change a `--pi-*` primitive.
2. **Slot** — reorder or relabel a markup region while leaving the logic that fills it alone.
3. **State presentation** — restyle a visible state while leaving the state machine and status text
   behind their `Do not edit —` notes.
4. **Layout** — adjust spacing, grid, and flow inside the owned presentation boundary.

Read the nearest purpose comment and section label to identify the seam. If it describes presentation,
the corresponding presentation is safe to change; if it begins `Do not edit —`, stop and preserve the
protected contract. Prove an allowed token or CSS change with the browser-free resolver so its resolved
value delta matches the intended blast radius.

---

## 4. FROZEN SECURITY POSTURE (context a workflow must not weaken)

The app ships read-only by default; mutations are one-use, ticketed, revision-checked, and fail-closed;
redaction is allowlist-based and structural; plan mode is host-enforced; pushes are content-free;
`--full-access` is operator-only and the phone cannot enable it. A design-system edit touches none of
this — but a workflow bundling this surface must never let a presentation change become a path into it.

---

## 5. RELATED REFERENCES

- [`comment-grammar.md`](comment-grammar.md) — the natural comment convention, edit classes, seam reading, and purpose lines.
- `assets/guardrail-audit-checklist.md` — a checklist to confirm no fence in §2 moved after a
  design-system change.
