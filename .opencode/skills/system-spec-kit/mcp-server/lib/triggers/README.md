---
title: "Semantic Trigger Matcher"
description: "Embedding-backed shadow matcher for learned trigger phrases, run alongside the lexical trigger matcher."
---

# Semantic Trigger Matcher

---

## 1. OVERVIEW

`lib/triggers/` holds the semantic (embedding-based) trigger matcher that runs as a shadow lane next to the lexical matcher in `../parsing/trigger-matcher.js`. It embeds a query, compares it against cached trigger-phrase embeddings and returns scored `SemanticMatch` rows plus threshold-band statistics, without replacing the lexical result the production path still uses.

Current state:

- Gated behind `isSemanticTriggerShadowEnabled()`, an environment-flag check.
- `loadSemanticTriggerCache` builds a TTL-bounded, embedding-profile-scoped cache of trigger-phrase embeddings from `memory_index`.
- `matchSemanticTriggers` scores cached entries against a query embedding by cosine similarity, threshold and margin.
- `computeSemanticTriggerShadow` is the top-level entrypoint: embeds the query, matches and reports lexical/semantic overlap plus threshold-band counts (`atOrAboveThreshold`, `withinMarginBelowThreshold`, `belowMarginBand`) for shadow-mode analysis.
- `__testables` exposes internal helpers for tests only.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `semantic-trigger-matcher.ts` | Shadow-mode semantic trigger cache, matcher and threshold-band statistics. |

## 3. CONSUMERS

- `handlers/memory-triggers.ts`

## 4. TESTS

- `tests/semantic-trigger-matcher.vitest.ts`
- `tests/trigger-goldens.vitest.ts`
- `tests/hybrid-trigger-handler.vitest.ts`
- `tests/trigger-cold-start.vitest.ts`
- `tests/trigger-threshold-tuning.vitest.ts`

## 5. RELATED

- [`../README.md`](../README.md)
