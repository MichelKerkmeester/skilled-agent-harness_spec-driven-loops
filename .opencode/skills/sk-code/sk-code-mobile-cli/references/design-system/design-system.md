---
title: The Design System — Values, Ownership and Naming
description: Entry point for changing how Pi Remote looks — the three-layer token model, which file a CSS rule belongs in, what a class is called, and the worked recipes for a retint. Routes to the five detailed contracts in this folder.
trigger_phrases:
  - "design system mobile cli"
  - "change a colour or spacing"
  - "retint pi remote"
  - "which file does this css rule go in"
  - "token layer semantic component"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The Design System — Values, Ownership and Naming

Everything about how Pi Remote looks is decided in three places: **what a value is** (the token
layers), **where its rule lives** (scoped `<style>` versus `app.css`), and **what the class is
called** (the BEM grammar). Get any one of them wrong and the change either does nothing or leaks
into a surface you did not mean to touch.

---

## 1. OVERVIEW

### Core Principle

Three decisions govern every visual change, and they must be made in order: **what a value is**
(the token layers), **where its rule lives** (scoped `<style>` versus `app.css`), and **what the
class is called** (the BEM grammar). Get any one wrong and the change either renders as nothing or
leaks into a surface you did not mean to touch.

### When to Use

- Changing a colour, spacing or radius and unsure which layer owns it
- Retinting one surface without moving the rest of the system
- Making light and dark disagree, or asking why a role stays literal
- Deciding whether a rule belongs in a component or in `app.css`
- Naming a class, or renaming a block of them

### Key Sources

- `app-mobile/src/app.css` — the token foundation all three layers resolve through
- `scripts/token-identity.mjs` — the frozen goldens; the one authority on a token value
- `assets/token-retint-checklist.md`, `assets/bem-rename-checklist.md`

---

## 2. PICK BY WHAT YOU ARE CHANGING

| You are… | Read |
|---|---|
| Changing a colour, spacing or radius and unsure which layer owns it | [`token-library.md`](token-library.md) |
| Changing one surface only (a sheet, the slash menu, a diff) | [`component-tokens.md`](component-tokens.md) |
| Making light and dark disagree, or asking why a role stays literal | [`theme-remap.md`](theme-remap.md) |
| Actually performing a retint, start to finish | [`retint-recipes.md`](retint-recipes.md) |
| Deciding whether a rule belongs in a component or in `app.css` | [`scoped-style-ownership.md`](scoped-style-ownership.md) |
| Naming a class, or renaming a block of them | [`css-class-naming-bem.md`](css-class-naming-bem.md) |

---

## 3. THE THREE DECISIONS, IN ORDER

### Which layer owns the value

Primitive → semantic → component. A primitive is a raw value with no meaning; a semantic role says
what it is *for*; a component token scopes a role to one surface. **Edit the highest layer that
still isolates the change** — retinting a primitive moves everything downstream, which is sometimes
exactly right and sometimes a repo-wide accident.

### Which file owns the rule

Svelte scoped CSS reaches only the component that declares it. A rule needed by two renderers, by a
`class` prop, or across a parent/child boundary has to live in `app.css` — usually behind
`:global()`. Putting it in the wrong file is the single most common way a change renders as nothing
at all, and the byte-identical screenshot is what exposes it.

### What the class is called

`block--element`, with `is-*` as a single-dash state prefix. The grammar matters beyond tidiness:
a mechanical rename once broke rendering four separate ways through dynamically constructed class
names, and only a before/after image diff caught it.

---

## 4. THE RULE THAT OUTRANKS THE REST

**A token value changes only through its own gate.** `token-identity.mjs` holds the frozen goldens
across light, dark and system; a change that moves one without updating the goldens is a regression
no test will report. The catalog's token playground deliberately writes no stylesheet for the same
reason — it hands back text to paste, so the gate stays the one authority.

---

## 5. PROVING THE CHANGE

The app's strict CSP renders it unstyled headless, so **screenshots cannot prove a value**. Use the
browser-free resolvers instead — see [`../verification/verification.md`](../verification/verification.md)
for the command set and [`../verification/verification.md`](../verification/verification.md)
for why. Screenshots remain the right tool for the other half: layout, legibility, and whether two
states actually look different.

---

## 6. RELATED REFERENCES

- [`../conventions/comment-grammar.md`](../conventions/comment-grammar.md) — the purpose comment that records *why* a value is what it is.
- [`../conventions/editability-guardrails.md`](../conventions/editability-guardrails.md) — the `Do not edit — <why>` notes that fence a frozen value.
- [`../storybook/storybook.md`](../storybook/storybook.md) — seeing every surface in both themes, and retuning tokens live.
- [`../svelte/svelte.md`](../svelte/svelte.md) — the runtime side of the same components.
