---
title: "Authored-brand boundary"
description: "Reusable validation and write boundary for authored design artifacts, authored tokens and reviewed conversion evidence."
trigger_phrases:
  - "authored brand boundary"
  - "authored design validation"
  - "authored provenance"
---

# Authored-brand boundary

---

## 1. OVERVIEW

`authored-brand/` keeps design direction invented from a product brief separate from measured design evidence. The boundary validates provenance, restricts authored destination names and stages authored exports before committing them.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `authored-brand-boundary.mjs` | Validates authored values and reviewed conversion artifacts, restricts destinations and writes staged authored exports. |
| `authored-design-template.md` | Defines the paired authored design and token document templates. |
| `authored-provenance-schema.md` | Defines the value-level origin and provenance contract. |

---

## 3. CALLER FLOW

```text
product description
        |
        v
validateAuthoredBrand
        |
        v
refreshAuthoredExports or writeAuthoredArtifact
        |
        v
authored design and authored token exports
```

Callers use `validateAuthoredBrand` for the palette, type and voice records. Use `assertAuthoredDestination` before writing a single artifact. Use `refreshAuthoredExports` for the paired authored exports and `assertReviewedConversionArtifact` for a signed conversion record.

---

## 4. BOUNDARIES

Only the authored design and authored token export names are valid authored destinations. Measured destinations such as DESIGN.md, tokens.json and styles are rejected. Every value keeps `origin: authored` and its source description and confidence note.

---

## 5. RELATED

- [`Shared design contracts`](../README.md)
- [`Authored design template`](./authored-design-template.md)
- [`Authored provenance schema`](./authored-provenance-schema.md)
