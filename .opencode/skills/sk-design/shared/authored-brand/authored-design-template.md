---
title: Authored Brand Artifact Template
description: Distinct AUTHORED-DESIGN.md and authored-tokens.json templates for brand values invented from a product description.
trigger_phrases:
  - "authored design template"
  - "brand first artifact"
  - "authored brand tokens"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Authored Brand Artifact Template

This template produces two authored-only exports: `AUTHORED-DESIGN.md` and `authored-tokens.json`. Neither filename, schema id, nor value record overlaps the measured `DESIGN.md`, `tokens.json`, or `styles/` corpus.

## 1. Input contract

Start from one short product description that names the product, audience, desired posture, practical constraints, and any explicit exclusions. Do not treat a reference site, screenshot estimate, or generated value as measured evidence.

## 2. `AUTHORED-DESIGN.md` template

```markdown
---
artifactType: authored-brand
schema: sk-design/authored-brand/v1
origin: authored
sourceDescription: "[repeat the exact product description]"
authoredAt: "[YYYY-MM-DD]"
---

# Authored design for [product name]

> This artifact contains invented design direction. It is not measured evidence and must not be renamed to DESIGN.md or ingested into the styles corpus.

## Palette

| Id | Intended role | Value | Origin | Source description | Authored at | Confidence note |
|---|---|---|---|---|---|---|
| `palette.primary` | [semantic role] | [authored color value] | `authored` | [exact product description] | [YYYY-MM-DD] | [uncertainty and validation needed] |

## Type system

| Id | Intended role | Value | Origin | Source description | Authored at | Confidence note |
|---|---|---|---|---|---|---|
| `type.display` | [semantic role] | [authored family/weight/scale choice] | `authored` | [exact product description] | [YYYY-MM-DD] | [uncertainty and validation needed] |

## Voice

| Id | Intended role | Value | Origin | Source description | Authored at | Confidence note |
|---|---|---|---|---|---|---|
| `voice.primary` | [semantic role] | [authored voice rule] | `authored` | [exact product description] | [YYYY-MM-DD] | [uncertainty and validation needed] |

## Authored exports

- Companion file: `authored-tokens.json`
- Refresh authority: authored exports only
- Measured destinations: prohibited
- Conversion authority: a completed `reviewed-conversion` checklist reviewed and signed by a human
```

Add rows as needed, but never merge multiple values into a row that has only one provenance record. Every palette, type, and voice value needs its own origin and provenance cells.

## 3. `authored-tokens.json` template

```json
{
  "schema": "sk-design/authored-brand/v1",
  "sourceDescription": "[repeat the exact product description]",
  "palette": [
    {
      "id": "palette.primary",
      "value": "[authored color value]",
      "origin": "authored",
      "provenance": {
        "sourceDescription": "[repeat the exact product description]",
        "authoredAt": "[YYYY-MM-DD]",
        "confidenceNote": "[uncertainty and validation needed]"
      }
    }
  ],
  "type": [
    {
      "id": "type.display",
      "value": "[authored family/weight/scale choice]",
      "origin": "authored",
      "provenance": {
        "sourceDescription": "[repeat the exact product description]",
        "authoredAt": "[YYYY-MM-DD]",
        "confidenceNote": "[uncertainty and validation needed]"
      }
    }
  ],
  "voice": [
    {
      "id": "voice.primary",
      "value": "[authored voice rule]",
      "origin": "authored",
      "provenance": {
        "sourceDescription": "[repeat the exact product description]",
        "authoredAt": "[YYYY-MM-DD]",
        "confidenceNote": "[uncertainty and validation needed]"
      }
    }
  ]
}
```

## 4. Generation rule

Generate at least one palette value, one type-system value, and one voice value from the supplied description. Prefer semantic roles over a preset catalog. Record uncertainty honestly; `origin: authored` is immutable while the value remains in either authored export.

Write through `authored-brand-boundary.mjs`. The writer accepts only the two authored filenames and rejects measured destinations before filesystem I/O.
