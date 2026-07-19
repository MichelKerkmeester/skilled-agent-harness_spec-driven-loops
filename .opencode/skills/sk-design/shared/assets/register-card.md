---
title: Register Card
description: One-page fill-in card to set the Brand-vs-Product register for a surface and read off the six dial defaults each design mode applies.
trigger_phrases:
  - "register card"
  - "brand product fill-in card"
  - "design register checklist"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Register Card

A one-page card for resolving Brand versus Product posture before mode work starts.

## 1. OVERVIEW

### Purpose

Sets the register for a design surface and records the dial defaults each mode should apply.

### Usage

Fill this in once at the start of a design task, before the mode workflow runs. Use the chosen register to hand each mode its defaults. Full rationale: `../register.md`.

---

## 2. SET THE REGISTER

| Question | Answer |
|---|---|
| What surface is this? (page / route / file) | `__________` |
| Task cue | landing / campaign / portfolio points to Brand. dashboard / admin / settings / tool points to Product |
| Declared `register` in PRODUCT.md or DESIGN.md? | `__________` (authoritative if present) |
| **Register (first match wins)** | [ ] Brand (design IS the product) [ ] Product (design SERVES the product) |

A mixed product is set per surface, not per project: the marketing page is Brand, the app shell is Product.

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

## 4. HAND OFF TO THE MODES

- interface: density, motion budget, color strategy
- foundations: color strategy, token density
- motion: motion budget (choreography vs state only)
- audit: audit-severity weighting
- md-generator: record the extracted surface's register

If a mode default contradicts this card, the card wins for posture, and the mode owns the craft within it.
