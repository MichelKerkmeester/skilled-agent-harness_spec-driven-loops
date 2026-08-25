---
title: Source Comment Grammar
description: The MODULE banner, numbered box-drawing section banners, durable-WHY comment discipline, and the verbatim @ds seam markers that every Pi Remote source file follows, plus the scans that measure and enforce them.
trigger_phrases:
  - "module banner comment"
  - "box drawing section banner"
  - "durable why comment"
  - "no commented out code"
  - "ds seam marker verbatim"
  - "comment grammar scan"
  - "comment only diff verifier"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Source Comment Grammar

Comments in the app follow a fixed grammar: a `MODULE:` banner opens each file, numbered box-drawing
banners split it into sections, and every remaining comment carries the durable WHY a reader cannot
infer from the code. The `@ds` seam markers are a searchable contract layered on top of that grammar.

---

## 1. OVERVIEW

### Core Principle

A comment earns its place only by carrying knowledge the code cannot state itself. Structure
(banners) is uniform; prose is minimal and reason-bearing. Two scans measure and prove the grammar.

### When to Use

- Adding or editing a comment in any `.svelte` or `.ts` source file
- Writing the opening banner of a new module
- Justifying a non-obvious choice (an `untrack`, a guardrail, a faithful port)
- Proving a diff changed comments only

### Key Sources

- `app-mobile/src/shared/state/turns.ts` (a canonical banner layout)
- `scripts/naming/scan-comments.mjs` (the measuring scan)
- `scripts/naming/verify-comment-only.mjs` (the comment-only diff proof)

---

## 2. THE BANNERS

Every source file opens with a `MODULE:` banner drawn in box-drawing rules (`─`), then a one-line
statement of what the module is. `turns.ts` opens with `MODULE: Derived Conversational Turns`.
Sections within the file are numbered ALL-CAPS banners in the same rule characters — `1. IMPORTS`,
`2. TYPE DEFINITIONS`, `3. TURN GROUPING` — so a reader scans structure without reading bodies.
`scan-comments.mjs` treats a file with no `─` rule line as missing its banner and reports it.

---

## 3. WHAT A COMMENT CARRIES

A comment states the durable WHY that a reader cannot infer from the code beside it. It is never:

- **Narration** — restating what the next line does.
- **A restated name** — echoing the identifier the line already names.
- **A multi-line prose essay** — the reason is one line, at the edit site.

Other mechanical rules the scan counts:

- **Sentence-case starts.** A comment sentence begins uppercase; a lowercase start is counted as a
  violation (directives like `eslint-`, `@ts-`, and quoted identifiers are exempt).
- **No commented-out code.** A comment body that begins with `interface`, `const`, `function`,
  `import`, `type`, and the like is counted as commented-out code, which is not allowed.
- **Guardrail reasons stay on one line.** A `@ds guardrail:` fence keeps its reason on the same line;
  a continuation line is counted as a multi-line fence explanation.

---

## 4. THE @ds SEAM MARKERS

The `@ds` markers — `surface`, `slot`, `state`, `variant`, `edit`, `guardrail`, `catalog`, `theme`
(plus `end` to close a surface) — are searchable contract annotations, preserved verbatim at their
edit site. They mark editable seams and frozen guardrails without changing runtime behavior;
`app.css` alone carries hundreds of them, enumerated by its header grammar. Never paraphrase, reflow,
or drop a marker: tools and reviewers grep the exact strings, so a reworded marker is a broken
contract. When a comment sits on a marker line, the scan treats the marker — not sentence prose — as
the governing form.

---

## 5. THE GATES

- `node scripts/naming/scan-comments.mjs` reports the measurable properties: files without a banner,
  lowercase comment starts, commented-out code lines, guardrail fence counts, and multi-line fence
  explanations. `--json` emits the same counts for packet deltas.
- `node scripts/naming/verify-comment-only.mjs <ref>` proves a change touched comments only: it strips
  comment lines from both sides and compares the residue, failing if any code line differs. Use it
  before claiming a pass is comment-only.

---

## 6. RELATED REFERENCES

- `folder-docs.md` — the folder-level READMEs and code maps the same WHY discipline governs.
- `css-class-naming-bem.md` — the class grammar the `@ds surface/slot/state` markers annotate.
- `scoped-style-ownership.md` — the ownership the `@ds surface:` markers record per rule.
