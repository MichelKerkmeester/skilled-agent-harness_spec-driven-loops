---
title: Pi Remote Theme Remap
description: The @ds theme light / dark / system-dark semantic remap — which role reads which primitive per theme, and which roles stay literal.
trigger_phrases:
  - "theme remap roles"
  - "primitive derived roles"
  - "accent strong asymmetric"
  - "surface code asymmetric"
  - "literal roles per theme"
  - "light dark system dark"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Theme Remap

`@ds theme:` marks a light/dark semantic-remap block — the point where the app decides, per theme, what
each Layer-2 role (`--canvas`, `--ink`, `--accent`, …) resolves to. There are three such blocks in
`style.css` — `:root` (light), `:root[data-theme='dark']` (dark), and the system-dark media query — and
the dark and system-dark blocks carry identical values today.

---

## 1. OVERVIEW

### Core Principle

This reference maps which Layer-2 role reads a frozen `--pi-*` primitive per theme, which roles stay a
literal per theme block, and the two roles that behave asymmetrically between light and dark.

### When to Use

- Determining whether editing a semantic role or a primitive is the correct lever for a theme-wide retint
- Investigating why `--accent-strong` or `--surface-code` resolves differently in light vs dark/system-dark
- Locating which literal (non-primitive) roles must be edited in every theme block to retint
- Verifying a theme-remap edit is correct in light, dark, and system-dark before considering it done

### Key Sources

- `token-library.md` — frozen `--pi-*` primitive definitions
- `component-tokens.md` §2-4 — component tokens consuming these semantic roles
- `verification.md` — resolver method for proving a theme-remap edit per theme
- `style.css` — the three `@ds theme:` semantic-remap blocks (`:root`, `:root[data-theme='dark']`,
  system-dark media query)

---

## 2. ROLES THAT ARE PRIMITIVE-DERIVED (`var(--pi-*)`)

These roles read a `--pi-*` primitive and so follow it automatically in every theme — the primitive is
the only lever that moves them all at once (and it is frozen; see `token-library.md`).

| Role | Reads primitive | Light | Dark / system |
| --- | --- | --- | --- |
| `--canvas` | `--pi-bone` | `#f8f8f6` | `#24221f` |
| `--surface` | `--pi-raised` | `#ffffff` | `#2d2a26` |
| `--surface-raised` | `--pi-raised` | `#ffffff` | `#2d2a26` |
| `--ink` | `--pi-carbon` | `#24221f` | `#f8f8f6` |
| `--ink-secondary` | `--pi-carbon` | `#24221f` | `#f8f8f6` |
| `--ink-muted` | `--pi-muted` | `#6c6a65` | `#9f998f` |
| `--ink-tertiary-safe` | `--pi-muted` | `#6c6a65` | `#9f998f` |
| `--ink-disabled` | `--pi-muted` | `#6c6a65` | `#9f998f` |
| `--placeholder` | `--pi-muted` | `#6c6a65` | `#9f998f` |
| `--ink-inverse` | `--pi-bone` | `#f8f8f6` | `#24221f` |
| `--accent` | `--pi-clay` | `#d97757` | `#d97757` |
| `--accent-soft` | `--pi-selection` | `#f3e4de` | `#3a2720` |
| `--accent-ink` | `--pi-accent-txt` | `#8a452f` | `#f0b19a` |
| `--action-bg` | `--pi-carbon` | `#24221f` | `#f8f8f6` |
| `--action-fg` | `--pi-bone` | `#f8f8f6` | `#24221f` |
| `--warning` | `--pi-accent-txt` | `#8a452f` | `#f0b19a` |
| `--warning-soft` | `--pi-selection` | `#f3e4de` | `#3a2720` |

Note that `--warning` / `--warning-soft` read the **same** primitives as `--accent-ink` / `--accent-soft`
— two independently editable semantic roles can share one primitive source without being coupled to each
other; editing `--warning` alone does not move `--accent-ink`.

---

## 3. THE ONE ASYMMETRIC ROLE — `--accent-strong`

`--accent-strong` is primitive-derived in light only:

| Theme | Declaration | Resolves to |
| --- | --- | --- |
| Light (`:root`) | `--accent-strong: var(--pi-accent-ui);` | `#b85f42` |
| Dark (`:root[data-theme='dark']`) | `--accent-strong: #b85f42;` (literal) | `#b85f42` |
| System-dark | `--accent-strong: #b85f42;` (literal) | `#b85f42` |

`--pi-accent-ui` has no distinct dark value (see `token-library.md`), so the dark and system-dark blocks
fix `--accent-strong` to the same literal instead of aliasing a primitive that would not resolve
per-theme. This is also why the `-ui-accent` component token in both `--model-sheet-*` and `--slash-*`
points at `--accent-strong` in light but at `--accent-ink` in dark/system (`component-tokens.md` §2–3) —
`--accent-strong` is not the dark-mode AA UI accent, `--accent-ink` is.

---

## 4. THE ONE ASYMMETRIC SURFACE ROLE — `--surface-code`

| Theme | Declaration | Resolves to |
| --- | --- | --- |
| Light (`:root`) | `--surface-code: #24221f;` (literal) | `#24221f` |
| Dark (`:root[data-theme='dark']`) | `--surface-code: var(--pi-bone);` | `#f8f8f6` |
| System-dark | `--surface-code: var(--pi-bone);` | `#f8f8f6` |

The code/terminal well is a fixed dark literal in light mode (so code stays legible against the light
canvas) but aliases `--pi-bone` in dark mode — "the deep code surface aliases the dark-page tone", per
the inline comment in `style.css`.

---

## 5. ROLES THAT STAY LITERAL IN EVERY THEME (no primitive source)

These roles are the raw per-theme scales; each theme block re-declares its own value directly, so
retinting one requires editing the value in every theme block it should change:

| Role | Light | Dark / system |
| --- | --- | --- |
| `--canvas-subtle` | `#efeeeb` | `#1f1e1b` |
| `--surface-muted` | `#efeeeb` | `#302e2a` |
| `--line` | `#e7e6e1` | `#3b3934` |
| `--line-hairline` | `#b7b7b5` | `#4a4741` |
| `--control-border` | `#7b7974` | `#807a70` |
| `--line-strong` | `#7b7974` | `#807a70` |
| `--decoration-low` | `#9c9a92` | `#777168` |
| `--success` | `#37624a` | `#8fc4a4` |
| `--success-soft` | `#e7eee9` | `#203129` |
| `--danger` | `#8d382e` | `#ee9b91` |
| `--danger-soft` | `#f4e7e4` | `#3a2522` |
| `--focus` | `#121212` | `#f8f8f6` |
| `--diff-add` | `#e4eee7` | `#203129` |
| `--diff-remove` | `#f3e5e2` | `#3a2522` |
| `--shadow-raised` | `0 4px 20px rgb(0 0 0 / 4%)` | `0 4px 20px rgb(0 0 0 / 24%)` |

`--diff-add` / `--diff-remove` are listed here (literal, not primitive-derived) and again in
`component-tokens.md` §4 (they are consumed as component tokens by two surfaces) — the two references
describe the same declarations from different angles: this one is "where in the theme remap", that one
is "which surfaces consume it and what breaks if you retint it".

---

## 6. RULES

- To retint every surface that plays a role together: edit the semantic role in **all three** theme
  blocks it appears in (light, dark, system-dark are usually identical for a literal role — check both
  before assuming).
- If the role is primitive-derived (§2), editing the role itself decouples it from the primitive; editing
  the primitive instead (frozen, off-limits to a designer) is the only lever that moves every role
  sharing that primitive at once.
- Never introduce a new asymmetry silently — if a role should diverge by theme the way `--accent-strong`
  or `--surface-code` do, say so in the `@ds edit: tokens` comment at the edit site, the way the source
  already documents both cases.
- Prove a theme-remap edit with the resolver method per theme (`verification.md`); a remap change that
  is correct in light and wrong in dark (or vice versa) is a common, easy-to-miss failure mode.
