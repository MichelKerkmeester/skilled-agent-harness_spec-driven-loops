---
title: "harness-diagram - Origin of this Style Reference"
description: "Where the harness-diagram reference came from: written from the packet's own palette rather than measured from an external product."
trigger_phrases:
  - "harness diagram origin"
  - "style reference provenance"
  - "diagram palette origin"
importance_tier: normal
contextType: reference
version: 1.2.0.4
---

# Origin of this Style Reference

**This reference was written from the packet's own palette, not measured from an external product.**

That distinction matters and is stated first because the sibling chart packet carries a reference of
the opposite kind: a copy of a real component library, whose `origin.md` records the repository it
came from. This one has no upstream. The diagram language is the harness's own, and its values were
recorded in `assets/style-reference/harness-diagram/diagram-palette.json` before any reference existed. This file expresses
that palette in the v3 Style Reference shape so the applicator has something to derive `--default`
from, and so the stock look is one reference among several rather than the only one the packet can
draw.

The consequence to keep in mind: theming from this reference reproduces the stock palette exactly.
That is the property the checker holds. It is not evidence that the mapping rules generalise — a
reference measured from a real product exercises them properly, and the second reference a user
brings is the real test.

## What it declares

Every role of all three skins, each carrying the value the token source holds today. The `Token`
column names the diagram role directly, which is what lets a derivation be exact rather than
inferred: a reference that names our roles is used as written, and a reference that does not is
mapped by the selection rules in `references/design-md-theming.md`.

## Pinned

| File | sha256 |
|------|--------|
| `DESIGN.md` | recorded by the applicator on first use |

The palette this was written from is `assets/style-reference/harness-diagram/diagram-palette.json`; that file, not this one,
remains the source the corpus is generated from.
