---
title: "assets/style-reference: The Visual Language"
description: "Where the diagram language lives: the palette source every form is generated from, the icon specimen, and the Style References a delivery can be repainted in."
importance_tier: normal
trigger_phrases:
  - "diagram style reference"
  - "palette source"
  - "icon specimen"
  - "where do the colours come from"
contextType: general
version: 1.1.0.0
---

# assets/style-reference

Everything that decides how a diagram looks, in one directory rather than three.

---

## 1. OVERVIEW

A form in `../diagrams/` says what a diagram draws. This directory says what it looks like while
drawing it. Keeping the two apart is the point: a form can be repainted without being redrawn, and a
language can be replaced without touching a single coordinate.

| File | What it is |
|---|---|
| `diagram-palette.json` | The token source. Every role of all three skins, their gates, and the departures those gates record. Both applicators generate every form from this file, and the corpus check requires the result to equal the shipped bytes. |
| `icons.html` | The icon specimen: every glyph a diagram may draw, on one page. Not a form — it answers no question and the catalog does not index it. |
| `harness-diagram/` | The carried Style Reference. `DESIGN.md` states this language in the shape a reference takes, and `origin.md` records where it came from. |

---

## 2. REPAINTING A DELIVERY

Point the applicator at any local `DESIGN.md` — one `sk-design-md-generator` measured from a real
product, or one written by hand — and it writes themed copies of the forms you name, gated before
anything is written. The full contract is in
[`../../references/design-md-theming.md`](../../references/design-md-theming.md).

The carried reference is what `--default` derives from, and theming from it reproduces the stock
palette exactly. That is the property that says the reference and the corpus have not drifted apart;
it is not evidence that the mapping generalises, which only a reference measured from something real
can show.

---

## 3. RELATED

| Document | Purpose |
|---|---|
| [`../../references/foundations/derivation-record.md`](../../references/foundations/derivation-record.md) | Why each value is what it is, and every recorded departure. |
| [`../../references/foundations/style-guide.md`](../../references/foundations/style-guide.md) | How to use the roles this file defines. |
| [`../diagrams/README.md`](../diagrams/README.md) | The 38 forms these tokens paint. |
