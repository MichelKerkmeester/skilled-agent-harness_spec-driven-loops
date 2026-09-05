---
title: "Extraction: Rule-Based Entity Extraction"
description: "Pure-TypeScript rule-based entity extraction over generated packet metadata content, plus its denylist."
trigger_phrases:
  - "entity extraction"
  - "entity denylist"
---

# Extraction: Rule-Based Entity Extraction

---

## 1. OVERVIEW

`lib/extraction/` owns rule-based entity extraction over document content and the denylist that keeps generic nouns and stop words out of the results. Extraction is pure TypeScript with zero npm dependencies; rules are declarative data (regex, capture group, entity type) rather than hand-written per-type parsing code.

Current state:

- Five built-in rules cover proper nouns, code-fence technology names, key-phrase continuations, markdown headings, and quoted strings.
- `SPECKIT_ENTITY_CONFIG_PATH` can point at an external JSON rule file (see `entity-extraction-rules.json` for the reference shape); a missing, malformed, or invalid override falls back to the built-in rules so extraction never crashes on bad config.
- Extracted entities are deduplicated by a normalized name, with frequencies summed across matches.

---

## 2. DATA FLOW

```text
content
  -> loadEntityExtractionRules()
  -> applyEntityRules() (regex match per rule, in order)
  -> deduplicateEntities() (normalize + sum frequency)
  -> filterEntities() (length + denylist checks)
```

`entity-extractor.ts` calls into `entity-denylist.ts`'s `isEntityDenied()` during filtering; the denylist has no dependency back on the extractor.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `entity-extractor.ts` | Rule loading (built-in or `SPECKIT_ENTITY_CONFIG_PATH` override), extraction, filtering, and canonical name normalization. |
| `entity-denylist.ts` | Common nouns, technology stop words, and generic modifiers filtered from entity candidates; `isEntityDenied()` and `getEntityDenylistSize()`. |
| `entity-extraction-rules.json` | Reference external rule file reproducing the five built-in rules exactly; a template for `SPECKIT_ENTITY_CONFIG_PATH` overrides. |

---

## 4. BOUNDARIES

This folder extracts entity candidates from generated packet metadata content and returns them in memory; it does not own persistence, canonical memory saves, response envelopes, search ranking, or graph traversal. `lib/graph/graph-metadata-parser.ts` is its one production consumer today.

---

## 5. ENTRYPOINTS

| Entrypoint | Purpose |
|---|---|
| `extractEntities(content)` | Extract and deduplicate rule-based entities from text. |
| `filterEntities(entities)` | Remove single-character, over-length, and fully-denylisted entities. |
| `loadEntityExtractionRules()` | Resolve the active rule set (built-in, or a valid `SPECKIT_ENTITY_CONFIG_PATH` override), cached after first load. |
| `normalizeEntityName(name)` | Canonical lowercase, punctuation-stripped entity name. |
| `isEntityDenied(term)` | Whether a term is on the entity denylist (case-insensitive). |
| `getEntityDenylistSize()` | Size of the combined entity denylist set. |

---

## 6. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run tests/entity-extractor.vitest.ts
```

Expected result: rule loading, extraction, and filtering assertions pass.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../graph/README.md`](../graph/README.md)
