---
title: Source-of-Truth Router Card
description: A one-page fill-in card that sorts each value bound for a Style Reference into measured, brief-provided, inferred or absent, so a writer never fabricates a token or backfills missing data.
trigger_phrases:
  - source of truth router card
  - measured or inferred card
  - design md value provenance card
  - is this value measured
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Source-of-Truth Router Card

Fill this in before writing values into a Style Reference. It sorts every value by origin so only measured values land in the token tables and nothing gets invented or backfilled.

---

## 1. OVERVIEW

### Purpose

Sort every value bound for a Style Reference into measured, brief-provided, inferred, or absent, so a writer never fabricates a token or backfills missing data. Full rationale: [`../references/authoring-boundary.md`](../references/authoring-boundary.md).

### Usage

Work the card top to bottom for each value before it is written: sort by origin, route it per the rule table, list any doubtful values on the record, then run the stop check before finishing.

---

## 2. SORT EACH VALUE

For each value you are about to write, walk the questions top to bottom. The first yes decides the origin.

| Question | If yes, the origin is |
|---|---|
| Is the value present in `tokens.json`, read off the running page? | Measured |
| Did the user state it in the brief, not the page? | Brief-provided |
| Are you characterizing a measured value (a name, a role, a Similar Brand)? | Inferred |
| Did the extractor not capture it at all? | Absent |

A value can have only one origin. When the brief states a value AND the extractor measured it, the measured token is the source of truth and the brief value is context.

---

## 3. ROUTE BY ORIGIN

Copy the row for each value's origin and follow its rule.

| Origin | Label | Goes where | Never |
|---|---|---|---|
| Measured | none, it is the default | Token tables, Surfaces, Elevation, Quick Start | rounded, normalized, concretized or re-typed by hand |
| Brief-provided | stated as the brief's intent | Prose context only | placed in a token table as if measured |
| Inferred | `[INFERRED]` plus the token it cites | Names, roles, Similar Brands, characterizing prose | a value, fact or audience the page never showed |
| Absent | stamped no data extracted or omitted | The section that would have held it | backfilled from a brief or a derived guess |

An unlabeled value is a promise it was measured. If you cannot point to its row in `tokens.json`, it does not go in unlabeled.

---

## 4. FILL IN THE DOUBTFUL VALUES

List any value whose origin was not obvious, so the boundary call is on the record.

| Value (what it is) | Origin (one of the four) | Token it traces to or why absent |
|---|---|---|
| `__________` | `__________` | `__________` |
| `__________` | `__________` | `__________` |
| `__________` | `__________` | `__________` |

If a row cannot name a measured token and the origin is not honestly brief-provided, inferred or absent, the value is an invention. Remove it.

---

## 5. STOP CHECK

```text
□ Every value in a token table is measured and verbatim from tokens.json
□ No brief-provided value is sitting in a token table
□ Every inference is marked [INFERRED] and cites a measured token
□ Every absent value is stamped or omitted, none backfilled
□ You are extracting a live surface, not authoring from a brief with no site
```

If the last box fails, this is forward-authoring. It is out of scope for this mode. Route it to the separate design-spec decision and do not loosen fidelity to fit it here.

---

## 6. RELATED RESOURCES

- [`../references/authoring-boundary.md`](../references/authoring-boundary.md) - the four origins, the source-of-truth labels and why forward-authoring stays out of scope.
- [`cardinal-rules-card.md`](cardinal-rules-card.md) - the pre-validate fidelity checklist.
- [`../../shared/assets/register-card.md`](../../shared/assets/register-card.md) - the Brand-vs-Product register card. This mode records the extracted surface's register.
