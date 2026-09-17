---
title: CSS Class Naming Grammar
description: The block--element BEM delimiter grammar, the single-dash is-* state prefix, the three dynamic class-construction forms every interpolated kind must satisfy, and the strings that stay data rather than becoming classes.
trigger_phrases:
  - "block element class naming"
  - "double dash bem delimiter"
  - "is state modifier single dash"
  - "dynamic class construction kind"
  - "interpolated class must resolve"
  - "class name vs dom id token"
  - "css naming grammar scan"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# CSS Class Naming Grammar

Class names in the app follow a `block--element` grammar with a `--` delimiter, plus a single-dash
`is-*` state prefix. The grammar is not cosmetic: dynamically constructed class names must each land
on a rule that actually exists, and several strings that look like classes are deliberately kept as
data.

---

## 1. OVERVIEW

### Core Principle

`--` separates a block from its element; a single `-` stays inside a compound block or element name;
`is-` marks a state modifier and stays single-dash. A class is only real if a matching rule exists —
so every dynamically built class name must resolve.

### When to Use

- Naming a new class or renaming an existing one
- Building a class name by interpolation and needing it to match a rule
- Deciding whether a string is a class, a DOM id, a token name, or a wire enum

### Key Sources

- `app-mobile/src/pages/chat/transcript/block.svelte` (template construction)
- `app-mobile/src/pages/chat/artifacts/code-preview.svelte` (concatenation construction)
- `scripts/naming/scan-naming.mjs`, `scripts/naming/naming-rules.mjs`, `scripts/naming/kind-prefixes.json`

---

## 2. THE DELIMITER GRAMMAR

- `--` joins a block to its element: `agent-state--icon`, `slash--option`, `transcript--block`,
  `attention--card`, `plan-mode--button`, `rich-block--frame`.
- A single `-` stays inside a compound block or element part: the block `agent-state` and the block
  `plan-mode` each use a single dash internally, then `--` before the element.
- File basenames carry the matching kind-prefix grammar (`card-`, `sheet-`, `button-`, `radio-`,
  `menu-`, `screen-`, `dialog-`); `scripts/naming/kind-prefixes.json` and
  `scripts/naming/rename-manifest.json` are the rename map, and `scripts/naming/scan-naming.mjs` is
  the completeness gate that lists any source basename off the kebab grammar.

---

## 3. STATE MODIFIERS

`is-*` is a state prefix, not a block, and stays single-dash: `is-plan`, `is-diff-add`, `is-wrapped`,
`is-plan-mode`, `is-dragging`. Because `is-` is a prefix rather than a block, a dynamically built
`is-${kind}` matches a single-dash `.is-kind` rule — never a `--` rule. `card-code.svelte` emits
`is-${token.kind}` and `code-preview.svelte` styles `.is-keyword`, `.is-string`, `.is-comment`
accordingly. A mechanical rename that treated `is-diff-add` as `is--diff-add` would break the match
silently.

---

## 4. DYNAMIC CONSTRUCTION

A class name built at runtime must still land on a rule. Three construction forms appear, and each
must emit a class that has a matching rule:

- **Template literal** — `class={\`transcript--block block--${block.kind}\`}` in `block.svelte`; and
  `is-${presentation.kind}` in `button-plan-mode.svelte`.
- **String concatenation** — `class={'artifact-code--token is-' + token.kind}` in `code-preview.svelte`.
  Because the `.is-*` suffix is not a static literal, the scoped compounds use `:global(.is-*)` so
  Svelte does not prune them.
- **Ternary** — `line.startsWith('+') ? 'artifact-diff--line artifact-diff--add' : …` in
  `diff-preview.svelte`; and the `is-plan-mode` / `is-executing-mode` branch in `session-composer.svelte`.

Every interpolated `kind` must resolve, including compound and underscore kinds. `attention--${item.attentionClass}`
produces `attention--needs_input`, which `screen-attention-inbox.svelte` styles as
`:global(.attention--needs_input)`; the `file_diff` kind resolves to the loading-state presentation rule
in `app.css`. A kind that reaches an element but has no rule renders dead — the failure mode a
mechanical BEM rename produced when a map missed an underscore kind.

---

## 5. WHAT STAYS DATA

Some strings share a class's spelling but are not classes and must not be renamed into `--` form:

- **DOM ids** — element `id` / `for` / `aria-*` target strings are identifiers, not classes.
- **CSS custom properties (tokens)** — `--space-3`, `--line`, `--surface-code`, `--font-mono` are
  token names in the cascade, not `block--element` classes; renaming them as classes breaks the token.
- **Wire enums** — `file_diff` and `needs_input` also travel as protocol enum values (a block `kind`,
  an attention signal). The same string is data on the wire and a class in the DOM; only the DOM class
  follows the grammar.

---

## 6. CHECK AND RELATED REFERENCES

- Check: `node scripts/naming/scan-naming.mjs` lists any source basename off the naming grammar; dead
  dynamic classes surface through the `css-corpus.ts` and Storybook story assertions under `test:web`.
- [`scoped-style-ownership.md`](scoped-style-ownership.md) — which file the matching rule for a class belongs in.
- [`../conventions/comment-grammar.md`](../conventions/comment-grammar.md) — the natural purpose comments that annotate a class's surface and state.
