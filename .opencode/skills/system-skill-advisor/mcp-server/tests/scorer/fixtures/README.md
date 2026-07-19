---
title: "Scorer Fixtures: Intent Prompt Corpora and Embedding Seeding"
description: "Test fixtures for advisor scorer including intent prompt corpora for routing accuracy tests and skill embedding seeding utilities for lane weight sweep experiments."
trigger_phrases:
  - "intent prompt corpus"
  - "skill embedding seeder"
  - "lane weight sweep fixtures"
---

# Scorer Fixtures: Intent Prompt Corpora and Embedding Seeding

> Test fixture folder providing intent prompt corpora and skill embedding seeding utilities for advisor scorer accuracy experiments.

---

## 1. OVERVIEW

`tests/scorer/fixtures/` provides test data and utilities for the advisor scorer system. It contains two intent prompt corpora for measuring routing accuracy and an embedding seeding module for lane weight sweep experiments.

Current state:

- Three TypeScript files provide the full fixture surface. No subdirectories exist beyond the `.embeddings-cache/` data directory.
- `intent-prompt-corpus.ts` exports `INTENT_PROMPT_CORPUS`, a readonly array of intent prompts with expected skill routing and category classification. Each prompt is categorized as `today-correct` or `intent-described`.
- `harder-intent-prompt-corpus.ts` exports `HARDER_INTENT_PROMPT_CORPUS`, a readonly array of prompts designed to test lexical mis-routing edge cases. Each entry uses the `lexical-mis-route` category and includes a `reason` field documenting the mis-route hypothesis.
- `seed-skill-embeddings.ts` exports `seedSkillEmbeddings`, an async function that generates and caches skill description vectors. Cache entries are keyed by `sha256(description).slice(0, 16)` concatenated with the provider model ID. The cache file lives at `fixtures/.embeddings-cache/skill-embeddings.json`. The function treats provider creation or embedding failures as environment skips rather than errors and returns `skipped: true` when the embedding provider is unavailable.
- Supporting types include `HarderIntentEntry` (interface for harder prompt entries), `IntentPromptCategory` (union of valid corpus categories), `SeededSkill` (skill metadata for seeding) and `SeedResult` (seeding operation outcomes).
- One test file consumes all fixtures: `lane-weight-sweep.vitest.ts` in the parent scorer directory.
- External imports are `node:crypto` for SHA256 hashing, `node:fs`, `node:path` and `node:url` for cache file operations and `@spec-kit/shared/embeddings/factory` for embedding provider creation.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `intent-prompt-corpus.ts` | Exports `INTENT_PROMPT_CORPUS` with expected routing and the `IntentPromptCategory` union type. |
| `harder-intent-prompt-corpus.ts` | Exports `HARDER_INTENT_PROMPT_CORPUS` for lexical mis-route testing and the `HarderIntentEntry` interface. |
| `seed-skill-embeddings.ts` | Exports `seedSkillEmbeddings` function with caching semantics and `SeededSkill` / `SeedResult` interfaces. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `INTENT_PROMPT_CORPUS` | const | Readonly intent prompt array with expected skill routing and category classification. |
| `HARDER_INTENT_PROMPT_CORPUS` | const | Readonly array of harder intent prompts for lexical mis-routing edge case coverage. |
| `IntentPromptCategory` | type | Union type for intent categories: `today-correct` and `intent-described`. |
| `HarderIntentEntry` | interface | Interface for harder intent prompt entries with lexical mis-route categorization. |
| `seedSkillEmbeddings` | function | Async seeder that generates skill description embeddings with caching and environment skip support. |
| `SeededSkill` | interface | Interface for skill metadata used in embedding seeding operations. |
| `SeedResult` | interface | Interface for seeding operation results including vectors, cache stats and skip status. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-skill-advisor/mcp-server && npm test -- tests/scorer/lane-weight-sweep.vitest.ts
```

Expected result: exit code 0.

---

## 5. RELATED

- [Parent: Scorer](../README.md)
- [Tests: tests/](../../README.md)
- [Lifecycle Fixtures](../../fixtures/lifecycle/README.md)
