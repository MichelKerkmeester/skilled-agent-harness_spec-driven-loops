---
title: Structural Fingerprint Card Schema
description: Seven-field contract for independently authored, load-on-demand structural fingerprint cards.
trigger_phrases:
  - "structural fingerprint card schema"
  - "abstract page shape card"
  - "structural diversification evidence"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Structural Fingerprint Card Schema

Structural fingerprint cards are private decision support for whole-page composition. They describe relationships and rhythm, never implementation markup, styling recipes, theme presets, or fixed token values.

## 1. CARD FILE CONTRACT

Each card is one self-contained Markdown file in this directory. A caller reads the index, selects one eligible card, and loads only that card; cards must not require another card for interpretation.

Every card uses this order:

1. Frontmatter with `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, and `version`.
2. An H1 matching `title` and a one-sentence identity statement.
3. Exactly seven numbered H2 fields in the order below.
4. No implementation sketches, catalog identifiers, named themes, or fixed style values.

## 2. REQUIRED FIELDS

| Number | Heading | Contract |
|---:|---|---|
| 1 | `Regions and composition` | Name the page regions, the relationship between section headings and bodies, and the compositional idea that makes the shape distinct. |
| 2 | `Remaining rhythm axes` | Specify divider language, button voice, image treatment, and reveal pattern as semantic relationships rather than style values. |
| 3 | `Navigation and footer pairing` | Explain how the opening and closing structures support the same information hierarchy without naming a preset archetype. |
| 4 | `Applicability guard` | Include both `Reach for it when` and `Avoid when` conditions grounded in the brief, content, and task. |
| 5 | `Responsive-collapse note` | Name the regions or relationships the shared responsive gate must test. Do not create card-specific breakpoints, layout recipes, or collapse rules. |
| 6 | `Failure modes` | Name at least three ways the fingerprint can become generic, decorative, misleading, or structurally repetitive. |
| 7 | `Evidence and diversification stamp` | State what visible evidence proves the choice and which card id must be recorded through the index's shared evidence-envelope stamp. |

## 3. SHARED RESPONSIVE GATE

Responsive collapse is one shared gate across the set. A card identifies what must remain legible, ordered, and semantically intact when space or input posture changes; the existing Interface and Foundations owners decide the target-specific transformation.

The shared gate must confirm:

- region order still matches task priority;
- heading/body relationships remain unambiguous;
- imagery does not displace required content or actions;
- navigation and footer responsibilities remain reachable; and
- the fingerprint remains recognizable without horizontal overflow or duplicated content.

A card fails this contract if it introduces its own breakpoint, grid formula, or implementation recipe.

## 4. EVIDENCE-ENVELOPE REUSE

The diversification stamp is the `structuralFingerprintSelections` collection defined in `index.md`. It follows the existing evidence-envelope pattern: a versioned collection, stable entry id, explicit field contract, validation rules, and an authority boundary. Cards reference that one envelope; they do not define parallel stamp formats.

Every selection entry records the chosen `cardId`, surface, rationale, axis emphasis, applied regions, shared-responsive-gate evidence, and visible proof. A prior entry with the same `cardId` makes that card ineligible until every suitable card has been used or the caller records why no unused card fits.

## 5. AUTHORING LINT

For every card, verify:

- the seven H2 headings exist once, in order, with non-empty content;
- the applicability guard has distinct reach/avoid conditions;
- field 5 delegates to the shared responsive gate;
- field 7 names the card id and the shared selection envelope;
- the prose stays abstract and target-derived;
- the card is readable without another card; and
- the file contains no implementation sketch, catalog code, or named theme.

