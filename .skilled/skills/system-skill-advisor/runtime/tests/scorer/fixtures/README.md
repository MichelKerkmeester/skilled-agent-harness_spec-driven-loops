---
title: "Scorer Fixtures: Intent Prompt Corpora"
description: "Test fixtures for the advisor scorer: two intent prompt corpora that routing accuracy and parity tests score."
trigger_phrases:
  - "intent prompt corpus"
  - "harder intent prompt corpus"
  - "scorer corpus fixtures"
---

# Scorer Fixtures: Intent Prompt Corpora

> Test fixture folder providing the two intent prompt corpora that advisor scorer tests and routing scripts score.

---

## 1. OVERVIEW

`tests/scorer/fixtures/` provides test data for the advisor scorer system. It contains two intent prompt corpora for measuring routing accuracy.

Current state:

- Two TypeScript files provide the full fixture surface. No subdirectories exist.
- `intent-prompt-corpus.ts` exports `INTENT_PROMPT_CORPUS`, a readonly array of intent prompts with expected skill routing and category classification. Each prompt is categorized as `today-correct` or `intent-described`.
- `harder-intent-prompt-corpus.ts` exports `HARDER_INTENT_PROMPT_CORPUS`, a readonly array of prompts designed to test lexical mis-routing edge cases. Each entry uses the `lexical-mis-route` category and includes a `reason` field documenting the mis-route hypothesis.
- Supporting types include `HarderIntentEntry` (interface for harder prompt entries) and `IntentPromptCategory` (union of valid corpus categories).
- `bm25-lexical-shadow.vitest.ts` in the parent scorer directory scores the intent corpus.
- The harder corpus is read by `scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs`, which captures the local-native divergence ledger, by `tests/parity/local-native-divergence-ratchet.vitest.ts`, which holds that ledger, and by `scripts/routing-accuracy/build-holdout.mjs`, which builds the holdout prompts.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `intent-prompt-corpus.ts` | Exports `INTENT_PROMPT_CORPUS` with expected routing and the `IntentPromptCategory` union type. |
| `harder-intent-prompt-corpus.ts` | Exports `HARDER_INTENT_PROMPT_CORPUS` for lexical mis-route testing and the `HarderIntentEntry` interface. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `INTENT_PROMPT_CORPUS` | const | Readonly intent prompt array with expected skill routing and category classification. |
| `HARDER_INTENT_PROMPT_CORPUS` | const | Readonly array of harder intent prompts for lexical mis-routing edge case coverage. |
| `IntentPromptCategory` | type | Union type for intent categories: `today-correct` and `intent-described`. |
| `HarderIntentEntry` | interface | Interface for harder intent prompt entries with lexical mis-route categorization. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .skilled/skills/system-skill-advisor/runtime && npm test -- tests/scorer/bm25-lexical-shadow.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts
```

Expected result: exit code 0.

---

## 5. RELATED

- [Parent: Scorer](../README.md)
- [Tests: tests/](../../README.md)
- [Lifecycle Fixtures](../../fixtures/lifecycle/README.md)
