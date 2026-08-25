---
title: Pi Remote Token Library
description: The primitive → semantic → component three-layer token model, the frozen ink-on-parchment values, and how a designer retint propagates.
trigger_phrases:
  - "three layer token model"
  - "pi remote token layers"
  - "frozen primitive tokens"
  - "retint a semantic role"
  - "retint a component token"
  - "token propagation blast radius"
  - "pi-clay accent token"
  - "wcag aa retint contrast"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Token Library

Every color, and most spacing and radius, in `app-mobile/` travels through three layers in order — primitive, semantic, component. This reference documents the model and the rules; the full catalogue with resolved values per theme lives in `feature-catalog/design-system/token-library.md`.

---

## 1. OVERVIEW

### Core Principle

Which layer you edit decides the blast radius: primitive is frozen, semantic retints a role, component retints one surface.

### When to Use

- Retinting a color, spacing, or radius token in `app-mobile/`
- Deciding whether a change belongs at the semantic-role layer or the component layer
- Proving a retint's propagation before/after with the browser-free resolvers
- Checking that a retint keeps WCAG AA in both themes

### Key Sources

- `feature-catalog/design-system/token-library.md` — full catalogue with resolved values per theme
- `verification.md` — the browser-free resolvers used to prove propagation

---

## 2. THE THREE LAYERS

| Layer | Tokens | What it is | Editable? |
| --- | --- | --- | --- |
| **Primitive (source)** | `--pi-*` | The 8 frozen source values, re-declared per theme | **No — frozen contract** |
| **Semantic role** | `--canvas`, `--ink`, `--accent`, … | Names a role, reads a primitive | Yes — retint a role here |
| **Component** | `--model-sheet-*`, `--slash-*`, `--diff-*` | Per-surface alias that reads a role | Yes — retint one surface |

### Layer 1 — primitives (FROZEN)

Eight names, re-declared per theme. Each declaration carries a same-line `Do not edit — frozen source`
note. Light → dark:

```
--pi-bone       #f8f8f6 → #24221f   (canvas / dark page)
--pi-raised     #ffffff → #2d2a26   (surface-raised)
--pi-carbon     #24221f → #f8f8f6   (ink / text)
--pi-muted      #6c6a65 → #9f998f   (muted text)
--pi-clay       #d97757 → #d97757   (accent — theme-invariant)
--pi-accent-txt #8a452f → #f0b19a   (AA text accent)
--pi-accent-ui  #b85f42 → #b85f42   (AA UI accent)
--pi-selection  #f3e4de → #3a2720   (soft selection)
```

Never change a value here. These are the ink-on-parchment palette contract (Inter + Source Serif 4)
that every other layer resolves through.

### Layer 2 — semantic roles (retint a role)

A role names a job and reads a primitive, so it follows that primitive in both themes:
`--canvas: var(--pi-bone)`, `--ink: var(--pi-carbon)`, `--accent: var(--pi-clay)`,
`--accent-ink: var(--pi-accent-txt)`, `--accent-strong: var(--pi-accent-ui)`,
`--accent-soft: var(--pi-selection)`. Change a role when you want every surface that plays it to move
together.

### Layer 3 — component tokens (retint one surface)

A component token is a thin per-surface alias to a role: `--model-sheet-accent: var(--accent-ink)`,
`--model-sheet-raised: var(--surface)`, plus the `--slash-*` and `--diff-*` families. Change one when you
want a single surface retinted and nothing else.

---

## 3. PROPAGATION (measured, not guessed)

- **Retinting the primitive `--pi-clay`** cascades to **45 rendered declarations** across light, dark,
  and system — every accent fill, accent text, and even `color-mix()`-derived accent borders move in
  lockstep, with no orphaned reference. One edit, system-wide.
- **Retinting the component token `--model-sheet-accent`** changes only the model-effort-sheet surface
  (its rows, nav buttons, policy/mutation rows, search-clear, reconcile, unavailable state) — **zero
  leak** into the slash panel, diff, artifacts, or composer.

These two ends of the seam are the model: pick the layer whose blast radius matches your intent.

---

## 4. RULES

- Retint at the **semantic** layer for a system-wide role change; at the **component** layer for one
  surface. Never edit a `--pi-*` primitive value.
- Prove propagation with the browser-free resolvers (see `verification.md`): resolve `app-mobile/src/app.css`
  together with the changed component's scoped `<style>` block before and after; every intended declaration
  changes and nothing else does.
- Keep WCAG AA in both themes — the `contrast.test.ts` suite enforces it; a retint that drops a pair
  below AA fails the gate.

---

## 5. RELATED REFERENCES

- `component-tokens.md` — the Layer-3 `--model-sheet-*` / `--slash-*` / `--diff-*` families in full,
  with the exact blast radius of retinting each.
- `retint-recipes.md` — worked, step-by-step recipes for a semantic-layer retint and a component-layer
  retint, each with the resolver proof steps.
- `theme-remap.md` — which semantic role reads which primitive per theme, and which roles stay literal.
