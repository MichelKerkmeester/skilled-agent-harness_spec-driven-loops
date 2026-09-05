---
title: "Extraction: Rule-Based Entity Extraction"
description: "Pure-TypeScript rule-based entity extraction, its denylist, and the memory_entities/entity_catalog maintenance helpers."
trigger_phrases:
  - "entity extraction"
  - "entity denylist"
  - "entity catalog"
  - "rebuild auto entities"
---

# Extraction: Rule-Based Entity Extraction

---

## 1. OVERVIEW

`lib/extraction/` owns rule-based entity extraction over document content, the denylist that keeps generic nouns and stop words out of the results, and the maintenance helpers that keep the `memory_entities` and `entity_catalog` database tables consistent. Extraction is pure TypeScript with zero npm dependencies; rules are declarative data (regex, capture group, entity type) rather than hand-written per-type parsing code.

Current state:

- Five built-in rules cover proper nouns, code-fence technology names, key-phrase continuations, markdown headings, and quoted strings.
- `SPECKIT_ENTITY_CONFIG_PATH` can point at an external JSON rule file (see `entity-extraction-rules.json` for the reference shape); a missing, malformed, or invalid override falls back to the built-in rules so extraction never crashes on bad config.
- Extracted entities are deduplicated by a normalized name, with frequencies summed across matches.
- `rebuildAutoEntities()` gives a deterministic cleanup path: it deletes only `created_by='auto'` rows in scope, re-extracts from live `memory_index.content_text`, and rebuilds `entity_catalog` from the resulting rows.

---

## 2. DATA FLOW

```text
content
  -> loadEntityExtractionRules()
  -> applyEntityRules() (regex match per rule, in order)
  -> deduplicateEntities() (normalize + sum frequency)
  -> filterEntities() (length + denylist checks)
  -> storeEntities() / refreshAutoEntitiesForMemory()
  -> updateEntityCatalog() or rebuildEntityCatalog()
```

`entity-extractor.ts` calls into `entity-denylist.ts`'s `isEntityDenied()` during filtering; the denylist has no dependency back on the extractor.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `entity-extractor.ts` | Rule loading (built-in or `SPECKIT_ENTITY_CONFIG_PATH` override), extraction, filtering, canonical name normalization, and the `memory_entities`/`entity_catalog` storage and rebuild helpers. |
| `entity-denylist.ts` | Common nouns, technology stop words, and generic modifiers filtered from entity candidates; `isEntityDenied()` and `getEntityDenylistSize()`. |
| `entity-extraction-rules.json` | Reference external rule file reproducing the five built-in rules exactly; a template for `SPECKIT_ENTITY_CONFIG_PATH` overrides. |

---

## 4. BOUNDARIES

This folder prepares extracted entity data and writes it to the database tables it owns (`memory_entities`, `entity_catalog`). It does not own canonical memory saves, response envelopes, search ranking, or graph traversal. `lib/graph/graph-metadata-parser.ts` is its one production consumer today.

---

## 5. ENTRYPOINTS

| Entrypoint | Purpose |
|---|---|
| `extractEntities(content)` | Extract and deduplicate rule-based entities from text. |
| `filterEntities(entities)` | Remove single-character, over-length, and fully-denylisted entities. |
| `loadEntityExtractionRules()` | Resolve the active rule set (built-in, or a valid `SPECKIT_ENTITY_CONFIG_PATH` override), cached after first load. |
| `normalizeEntityName(name)` | Canonical lowercase, punctuation-stripped entity name for catalog keys. |
| `storeEntities(db, memoryId, entities)` | Insert or replace entity rows for one memory record. |
| `refreshAutoEntitiesForMemory(db, memoryId, entities)` | Replace one memory's `created_by='auto'` rows and rebuild or update the catalog as needed. |
| `updateEntityCatalog(db, entities)` | Upsert entities into `entity_catalog` with alias normalization. |
| `rebuildEntityCatalog(db)` | Deterministically rebuild `entity_catalog` from current `memory_entities` rows. |
| `rebuildAutoEntities(db, options)` | Re-extract and re-store all `created_by='auto'` rows in scope, then rebuild the catalog. |
| `isEntityDenied(term)` | Whether a term is on the entity denylist (case-insensitive). |
| `getEntityDenylistSize()` | Size of the combined entity denylist set. |

---

## 6. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run tests/entity-extractor.vitest.ts
```

Expected result: rule loading, extraction, filtering, storage, and rebuild-path assertions pass.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../graph/README.md`](../graph/README.md)
