---
title: Pi Remote Component Tokens
description: The Layer-3 per-surface component token families (--model-sheet-*, --slash-*, --diff-*) — what each aliases, and the blast radius of retinting one.
trigger_phrases:
  - "component token blast radius"
  - "model sheet tokens"
  - "slash autocomplete tokens"
  - "diff add remove tokens"
  - "retinting a component token"
  - "per-surface component tokens"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Component Tokens

Layer 3 of the token model (`token-library.md`) is the per-surface component token — a thin alias to a
semantic role, scoped to one surface's own CSS custom-property block instead of `:root`. `app-mobile/src/app.css`
carries exactly three such families; this reference lists each, what it resolves to, and the blast
radius of retinting it.

---

## 1. OVERVIEW

### Core Principle

A component token is a thin per-surface alias to a semantic role — retinting one moves only the surface
that declares it, not the whole role.

### When to Use

- Determining which CSS custom-property family backs a specific surface (model sheet, slash panel, diff
  view)
- Predicting the blast radius before retinting a component token
- Deciding whether to retint a component-token family or the underlying semantic role instead
- Verifying that a retint stayed contained to its declared surface

### Key Sources

- `token-library.md` — the Layer 3 definition within the full token model
- `theme-remap.md` — semantic role dark-mode divergence (e.g., `--accent-strong`)
- `retint-recipes.md` — step-by-step retint verification recipes
- `verification.md` — browser-free resolver steps for proving blast radius

---

## 2. `--model-sheet-*` (surface `model-effort-sheet`)

Declared inside `.model-sheet-overlay` — the model picker + effort sheet overlay — with three theme
blocks: the default (light) declaration, an explicit `:root[data-theme='dark'] .model-sheet-overlay`
override, and a `prefers-color-scheme: dark` `:root[data-theme='system'] .model-sheet-overlay` override.

| Token | Aliases (role) | Light | Dark / system |
| --- | --- | --- | --- |
| `--model-sheet-raised` | `--surface` | `#ffffff` | `#2d2a26` |
| `--model-sheet-ink` | `--ink` | `#24221f` | `#f8f8f6` |
| `--model-sheet-muted` | `--ink-muted` | `#6c6a65` | `#9f998f` |
| `--model-sheet-accent` | `--accent-ink` | `#8a452f` | `#f0b19a` |
| `--model-sheet-ui-accent` | `--accent-strong` (light) / `--accent-ink` (dark, system) | `#b85f42` | `#f0b19a` |
| `--model-sheet-selection` | `--accent-soft` | `#f3e4de` | `#3a2720` |

`--model-sheet-ui-accent` is the one token in the family whose **role**, not just its value, changes by
theme block: it aliases `--accent-strong` in the light block but `--accent-ink` in both the explicit dark
block and the system-dark block, because `--accent-strong` carries no distinct dark override (see
`theme-remap.md`).

**Blast radius of retinting one:** contained to the model-effort-sheet surface — its rows, nav buttons,
policy/mutation rows, search-clear, reconcile button, and unavailable state. Zero leak into the slash
panel, the diff view, artifacts, or the composer (measured; see `retint-recipes.md` §3).

---

## 3. `--slash-*` (surface `slash-autocomplete`)

Declared inside `.slash-panel` — the inline autocomplete card and the command palette share this surface
name — with the same three-block shape as `--model-sheet-*`: default (light), explicit
`:root[data-theme='dark'] .slash-panel`, and the `prefers-color-scheme: dark`
`:root[data-theme='system'] .slash-panel` override.

| Token | Aliases (role) | Light | Dark / system |
| --- | --- | --- | --- |
| `--slash-raised` | `--surface` | `#ffffff` | `#2d2a26` |
| `--slash-ink` | `--ink` | `#24221f` | `#f8f8f6` |
| `--slash-muted` | `--ink-muted` | `#6c6a65` | `#9f998f` |
| `--slash-accent` | `--accent-ink` | `#8a452f` | `#f0b19a` |
| `--slash-ui-accent` | `--accent-strong` (light) / `--accent-ink` (dark, system) | `#b85f42` | `#f0b19a` |
| `--slash-selection` | `--accent-soft` | `#f3e4de` | `#3a2720` |

Same alias shape and the same theme-divergence rule on `-ui-accent` as `--model-sheet-*` above. The
panel's border, background, and text colour read this family directly
(`.slash-panel { border: 1px solid var(--slash-ink); background: var(--slash-raised); color: var(--slash-ink); }`).

**Blast radius of retinting one:** contained to `.slash-panel` and its header/footer states. Zero leak
into the model sheet, the diff view, or any routed page surface.

---

## 4. `--diff-add` / `--diff-remove` (consumed by two surfaces, not per-surface-aliased)

Unlike the two families above, `--diff-add` / `--diff-remove` are **not** declared inside a per-component
block as `var(--role)` aliases — they are declared once, directly on `:root`, `:root[data-theme='dark']`,
and the `prefers-color-scheme: dark` system block, as per-theme literal values (no `var()` chain to a
semantic role):

| Token | Light | Dark / system |
| --- | --- | --- |
| `--diff-add` | `#e4eee7` | `#203129` |
| `--diff-remove` | `#f3e5e2` | `#3a2522` |

Two separate surfaces consume them, both through `color-mix()`:

- `.diff-patch .diff-add` / `.diff-patch .diff-remove` — the inline diff-patch view:
  `background: color-mix(in oklch, var(--diff-add) 90%, transparent)`.
- `.artifact-diff-add` / `.artifact-diff-remove` — the read-only artifact diff card (the same
  `color-mix()` shape, same tokens).

**Blast radius of retinting one:** both consuming surfaces move together — `.diff-patch` and the artifact
diff card share the same two tokens, so there is no component-scoped way to retint just one of them
through `--diff-add` / `--diff-remove` alone; isolating one would require overriding the class rule
directly, which is a component-CSS edit, not a token edit.

**Frozen exception in the same family:** `.artifact-diff-line.is-find-match` (the find-match highlight on
a diff row) uses the literal `#f3e4de` directly and is fenced
The `Do not edit — theme-invariant light literal; stays fixed` note marks this boundary. It is not a `--diff-*`
component token and must not be converted into one.

---

## 5. RULES

- A component token is always a thin alias (`var(--role)`) to a Layer-2 semantic role — the one exception
  is `--diff-add` / `--diff-remove`, which are direct per-theme literals consumed by two surfaces.
- Retint a component-token family when you want exactly its surface(s) to move; retint the semantic role
  instead (see `theme-remap.md`) when every surface that plays that role should move together.
- Prove the stated blast radius with the browser-free resolvers, before and after (see
  `verification.md`); `retint-recipes.md` walks the exact steps.
