---
title: "assets/style-reference: The Visual Languages"
description: "One directory per visual language. Each holds its DESIGN.md, the tokens derived from it and its icon specimen, so a language is a bundle rather than three scattered files."
importance_tier: normal
trigger_phrases:
  - "diagram style reference"
  - "palette source"
  - "icon specimen"
  - "where do the colours come from"
  - "add a style reference"
contextType: general
version: 1.1.0.0
---

# assets/style-reference

One directory per visual language. Forms live next door and say what a diagram draws; a language
here says what it looks like drawing it, and either can change without touching the other.

---

## 1. THE BUNDLE

A language is a directory, not a file. Each one carries everything needed to paint with it:

| File | What it is |
|---|---|
| `DESIGN.md` | The language stated in the shape a Style Reference takes: a colour table with a role per row, the typefaces and their substitute stacks, and the corner ladder. |
| `origin.md` | Where it came from, and whether it was measured from a real product or written by hand. A reference that claims a provenance it does not have is worse than one with none. |
| `diagram-palette.json` | The tokens: every role of every skin, the gates they must clear, and the departures those gates record. Both applicators generate every form from this file. |
| `icons.html` | The icon specimen — every glyph this language draws, on one page. It answers no question, so the catalog does not index it. |

`harness-diagram/` is the one this packet ships with and the one `--default` derives from. Theming
from it reproduces the stock palette exactly, which is the property that says the language and the
corpus have not drifted apart. It is not evidence that the mapping generalises — only a reference
measured from something real shows that.

---

## 2. ADDING ANOTHER

A second language is a sibling directory with the same four files. Nothing else moves: the forms do
not change, and neither does the checker, because a form is painted at delivery time rather than
committed in a second skin.

To paint with one, point the applicator at its `DESIGN.md`. The full contract, including what each
role selects from and what happens when a reference cannot fill one, is in
[`../../references/design-md-theming.md`](../../references/design-md-theming.md).

---

## 3. RELATED

| Document | Purpose |
|---|---|
| [`../../references/foundations/derivation-record.md`](../../references/foundations/derivation-record.md) | Why each stock value is what it is, and every recorded departure. |
| [`../../references/foundations/style-guide.md`](../../references/foundations/style-guide.md) | How to use the roles a language defines. |
| [`../diagrams/README.md`](../diagrams/README.md) | The 38 forms these tokens paint. |
