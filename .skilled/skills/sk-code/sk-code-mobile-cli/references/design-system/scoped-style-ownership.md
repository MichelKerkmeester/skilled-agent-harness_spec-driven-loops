---
title: Scoped Style Ownership
description: Where a CSS rule belongs in the Svelte-only Pi Remote app — a component's scoped <style>, the global app.css, or a :global seam that crosses the component boundary.
trigger_phrases:
  - "where does this css rule go"
  - "scoped style vs app css"
  - "global css ownership"
  - "class prop global rule"
  - "cross boundary state selector"
  - "css decomposition cascade"
  - "keyframes ownership"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Scoped Style Ownership

The app is Svelte-only. There is no monolithic stylesheet and no per-component `.css` file. Every
rule lives in exactly one of two homes: a component's own scoped `<style>` block, or the single
global `app-mobile/src/app.css`. This reference decides which.

---

## 1. OVERVIEW

### Core Principle

A rule belongs where its ownership is. If only one component renders the markup a rule styles, the
rule lives in that component's scoped `<style>`. If two or more components render markup the rule
styles, the rule lives in `app-mobile/src/app.css`. The header comment at the top of `app.css` states
this contract verbatim: `app.css` holds only the design-token cascade and SHARED surfaces (used by two
or more components); single-component CSS lives in that component's own scoped `<style>`, never there.

### When to Use

- Adding a new CSS rule and needing to know which file it goes in
- Moving a rule during a decomposition and choosing between scoped and global
- A parent styling markup that a child component actually owns
- Deciding where keyframes and their `@media` variants land

### Key Sources

- `app-mobile/src/app.css` (its header comment is the ownership contract)
- `app-mobile/src/pages/chat/rich-content/card-code.svelte` (a scoped-only surface)
- `app-mobile/tests/support/css-corpus.ts` (the standing proof surface)

---

## 2. THE TWO HOMES

`app-mobile/src/app.css` holds exactly two things: the design-token cascade (`@theme` plus the
`:root` primitive → semantic → component tokens, re-themed by `prefers-color-scheme` and
`[data-theme]`), and SHARED surfaces — `focus-ring`, `app-shell`, `chrome-button`, `status`,
`routed-frame`, and the other classes named in its FILE MAP that two or more components render.

A component's scoped `<style>` holds every rule for markup only that component renders.
`card-code.svelte` is the pure case: `.rich--code-preview`, `.rich--continuation`, and
`.rich--copy-status` are all defined in its scoped block because only that component emits them.

---

## 3. OWNERSHIP RULES

| The rule styles… | Home |
| --- | --- |
| markup only one component renders | that component's scoped `<style>` |
| markup two or more components render | `app-mobile/src/app.css` |
| a class a parent passes to a child via a `class` prop | `app.css` as a `:global` / plain rule |
| a state a parent writes on a descendant it renders across a boundary | the parent's scoped block, targeting the descendant with a `:global(.child)` selector |
| keyframes | move with the rule that references them |

**Class-prop case.** `rich-block-frame.svelte` accepts a `className` prop and renders
`class={\`rich-block--frame ...\`}`; `card-code.svelte` passes `class="rich-code-card"` into it. A
class that crosses the component boundary this way cannot be scoped to the child — Svelte's scoper
would prune it. Its rule lives in `app.css` (the shared `.rich-block--frame` / `.rich-block--action`
rules are there for exactly this reason).

**Cross-boundary state case.** When a parent writes a state class on markup and styles a descendant
through it, the selector reaches across a boundary and must be global on the reached-through part.
`screen-attention-inbox.svelte` owns the card and its icon, and its scoped block styles
`:global(.attention--needs_input) .attention--icon`; the shared equivalent in `app.css` is
`.agent--running .agent-state--icon`.

**Keyframes case.** Keyframes are not shared infrastructure — they move with the single rule that
animates. `card-ask-question.svelte` defines `@keyframes ask-question-progress` inside its own scoped
`<style>`, next to the rule whose `animation:` references it, so Svelte scopes both together.

---

## 4. THE CASCADE RULE

When decomposing a shared rule into a component's scoped block, source order is load-bearing. Keep
only the `@media` blocks that appear AFTER the base rule in the original source order. A `@media`
block that sat BEFORE the base rule was already dead — the later base rule overrode it — so
reproducing it in the scoped block wrongly reactivates it and silently regresses narrow-width or
themed presentation. Move the base rule and its trailing overrides; drop the earlier ones.

---

## 5. PROOF SURFACE

`app-mobile/tests/support/css-corpus.ts` assembles the logical stylesheet the CSS-source tests read:
`app.css` concatenated with every component scoped `<style>` body, with one level of `:global(...)`
unwrapped so `:global(.todo-panel)` normalizes to `.todo-panel`. Because it spans both homes, a rule
placed in the wrong file still appears in the corpus — but a dynamically constructed class with no
matching rule renders dead, which the corpus and the Storybook story tests catch. Run `test:web`
after moving any rule between homes.

---

## 6. RELATED REFERENCES

- [`css-class-naming-bem.md`](css-class-naming-bem.md) — the `block--element` grammar the owned classes follow.
- [`../conventions/comment-grammar.md`](../conventions/comment-grammar.md) — the natural purpose comments that annotate each rule's owner and presentation seam.
- [`../conventions/folder-docs.md`](../conventions/folder-docs.md) — the `CODE.md` map that records which folder owns which surface.
