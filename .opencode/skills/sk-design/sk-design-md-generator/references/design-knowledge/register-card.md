---
title: Register Card
description: One-page fill-in card to set the Brand-vs-Product register for a captured surface and read off the six dial defaults it expresses.
trigger_phrases:
  - "register card"
  - "brand product fill-in card"
  - "design register checklist"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Register Card

A one-page card for resolving the Brand versus Product posture of a surface before recording its Style Reference.

## 1. OVERVIEW

### Purpose

Sets the register for a captured surface and records the dial defaults it expresses.

### Usage

Fill this in once at the start of an extraction, before recording tokens. Use the chosen register to frame how the reference is read. Full rationale: `./register.md`.

---

## 2. SET THE REGISTER

| Question | Answer |
|---|---|
| What surface is this? (page / route / file) | `__________` |
| Task cue | landing / campaign / portfolio points to Brand. dashboard / admin / settings / tool points to Product |
| Declared `register` in PRODUCT.md or DESIGN.md? | `__________` (authoritative if present) |
| **Register (first match wins)** | [ ] Brand (design IS the product) [ ] Product (design SERVES the product) |

A mixed product is read per surface, not per project: the marketing page is Brand, the app shell is Product.

---

## 3. READ THE DIALS

Copy the column for the chosen register.

| Dial | If Brand | If Product |
|---|---|---|
| Density | Generous, one big move | Dense, efficient |
| Motion budget | One rehearsed entrance, earned scroll motion | 150 to 250 ms state transitions, no page-load choreography |
| Color dosage | Committed / Full / Drenched, may exceed 10% accent | Restrained, accent at or below 10% for action / selection / state |
| Copy register | Expressive, voice-led | Plain, functional, one register |
| Anti-slop watch | cream background, eyebrow on every section, numbered scaffolding, over-round | low-contrast gray text, color as decoration, snap-grid cards |
| Audit severity | Weight distinctiveness and voice | Weight affordance, accessibility, consistency |

Color strategy: Restrained (Product default) · Committed (Brand identity) · Full palette (campaigns or data viz) · Drenched (Brand heroes).

---

## 4. CARRY IT INTO THE REFERENCE

Record the extracted surface's register in the Style Reference so the posture travels with the tokens. If a captured token contradicts the register you read, the register wins for posture and the token is noted as the surface's own craft within it.
