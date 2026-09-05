---
title: "Description Library: Metadata Shape And Merge"
description: "Schema and merge helpers for spec-folder description metadata."
trigger_phrases:
  - "description metadata"
  - "description.json repair"
---

# Description Library: Metadata Shape And Merge

---

## 1. OVERVIEW

`lib/description/` owns the typed helpers for reading, merging and summarizing spec-folder description metadata. It separates canonical generated fields from authored optional fields so updates can refresh derived data without dropping user-authored metadata, and it holds the one shared synopsis extractor both generated summary fields derive from.

Current state:

- Defines the accepted `description.json` shape with `zod` schemas.
- Preserves known authored keys and unknown pass-through keys during merges.
- Derives the `description` and `causal_summary` generated fields from one shared extractor and precedence, so the two fields cannot drift from different readings of the same `spec.md`.
- The schema-error repair path (a `description.json` that fails schema validation) calls `mergeDescription` directly from `lib/search/folder-discovery.ts`; the folder previously also carried a `repair.ts` wrapper over the same call, but nothing but its own tests ever used it, so it was removed rather than kept as an unused second path to the same merge.

---

## 2. ARCHITECTURE

```text
Callers
  |
  v
description-schema.ts
  | defines reserved keys, schemas and canonical field pickers
  v
description-merge.ts
  | merges existing, canonical and incoming records
  v
description metadata result

packet-synopsis.ts
  | derives description/causal_summary from spec.md with one shared precedence
  v
consumed by lib/search/folder-discovery.ts and lib/graph/generated-metadata-drift.ts
```

Dependency direction: `description-merge.ts` -> `description-schema.ts`. `packet-synopsis.ts` -> `../parsing/content-normalizer.ts` (independent of the merge/schema chain). `lib/search/folder-discovery.ts` calls `mergeDescription` directly for both the schema-valid and schema-error repair paths.

---

## 3. DIRECTORY TREE

```text
description/
+-- description-merge.ts   # Merge order and preservation rules
+-- description-schema.ts  # Schemas, reserved keys and issue formatting
+-- packet-synopsis.ts     # Shared synopsis extractor for description + causal_summary
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `description-schema.ts` | Declares canonical derived keys, authored keys, tracking keys and `zod` schemas. |
| `description-merge.ts` | Combines existing metadata, canonical fields and incoming values with explicit preservation reports. |
| `packet-synopsis.ts` | Derives a packet synopsis from `spec.md` (Overview paragraph, then Problem/Purpose sentence, then frontmatter description, then title, then first body line), clamped to a per-field length limit. Consumed by `lib/search/folder-discovery.ts` and `lib/graph/generated-metadata-drift.ts`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import `zod`, sibling description modules, and `../parsing/content-normalizer.ts`. |
| Exports | Exposes schema types and merge helpers. |
| Ownership | Owns metadata shape and merge behavior. It does not scan folders or write files by itself. |

Main merge flow:

```text
existing record
  |
  v
preserve authored and unknown keys
  |
  v
apply canonical generated fields
  |
  v
apply incoming tracking and authored fields
  |
  v
return merged record plus key reports
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `perFolderDescriptionSchema` | Schema | Validate full per-folder description metadata. |
| `formatDescriptionSchemaIssues` | Function | Convert schema issues to stable field messages. |
| `pickCanonicalDescriptionFields` | Function | Extract canonical derived and authored fields. |
| `mergeDescription` | Function | Merge existing, canonical and incoming metadata. |
| `derivePacketSynopsis` | Function | Derive the `description` or `causal_summary` synopsis from `spec.md` content. |
| `truncateSynopsisAtWordBoundary` | Function | Clamp a synopsis to a length limit without cutting the final word. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run tests/description tests/folder-discovery.vitest.ts
```

Expected result: description-merge, repair-specimens, and folder-discovery (which exercises `packet-synopsis.ts`) suites pass.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
