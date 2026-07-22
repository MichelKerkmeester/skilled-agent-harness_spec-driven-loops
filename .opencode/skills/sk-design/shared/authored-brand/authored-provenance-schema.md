---
title: Authored Brand Provenance Schema
description: Value-level origin and provenance contract for authored palette, type, and voice records.
trigger_phrases:
  - "authored provenance schema"
  - "origin authored values"
  - "authored brand evidence boundary"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Authored Brand Provenance Schema

An authored value is a proposal created from a brief. It is not an observation, measurement, or validation result. The schema keeps that status legible on every value rather than relying on a file-level disclaimer.

## 1. Artifact contract

| Field | Required | Contract |
|---|---:|---|
| `schema` | yes | Exact value `sk-design/authored-brand/v1`; measured schemas must reject it. |
| `sourceDescription` | yes | Exact product description used to author the brand. |
| `palette` | yes | Non-empty list of authored value records. |
| `type` | yes | Non-empty list of authored value records. |
| `voice` | yes | Non-empty list of authored value records. |

The only authorized filenames are `AUTHORED-DESIGN.md` and `authored-tokens.json`. A file named `DESIGN.md`, `tokens.json`, or anything under `styles/` is measured territory and must be rejected before writing.

## 2. Value record

```json
{
  "id": "palette.primary",
  "value": "oklch(0.62 0.15 35)",
  "origin": "authored",
  "provenance": {
    "sourceDescription": "A calm planning tool for independent studios.",
    "authoredAt": "2026-07-22",
    "confidenceNote": "Direction is plausible; contrast and gamut still require measured validation."
  }
}
```

| Field | Required | Contract |
|---|---:|---|
| `id` | yes | Stable semantic id within the authored artifact. |
| `value` | yes | One proposed palette, type, or voice value. |
| `origin` | yes | Exact literal `authored`. No aliases such as `generated`, `verified`, or `measured`. |
| `provenance.sourceDescription` | yes | Must equal the artifact's `sourceDescription`. |
| `provenance.authoredAt` | yes | Calendar date in `YYYY-MM-DD` form. |
| `provenance.confidenceNote` | yes | Non-empty statement of uncertainty and validation still needed. |

If one record contains several independently usable values, split it so each value carries its own provenance. Metadata inherited only from the document root is insufficient.

## 3. Validation

`validateAuthoredBrand` in `authored-brand-boundary.mjs` rejects:

- a missing palette, type, or voice domain;
- an empty domain;
- a value without `origin: authored`;
- a value whose source description differs from the artifact source;
- a missing or malformed authored date; and
- an empty confidence note.

Validation makes authored status explicit; it does not certify design quality or convert a value into measured evidence.

## 4. Authority boundary

Authored provenance is immutable in authored exports. A later human-reviewed conversion creates a separate record linking the authored id to new measurement evidence. It does not rewrite the authored source or make the original invention retroactively measured.

This schema and wording are independently authored from the research synthesis. No Hallmark schema, examples, or assets are copied, so no third-party notice is required for this implementation.
