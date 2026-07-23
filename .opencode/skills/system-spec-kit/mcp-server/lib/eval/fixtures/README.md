---
title: "Eval Fixtures"
description: "Synthetic corpus and verdict-path fixtures used by lib/eval tests and benchmarks."
---

# Eval Fixtures

---

## 1. OVERVIEW

`lib/eval/fixtures/` holds generated, synthetic test data for the retrieval eval suite in `../`. These fixtures exist so a benchmark or vitest can exercise a code path that the real corpus and the off-corpus false-confirm class cannot reach, without depending on the live database.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `bm25-packed-fixture.ts` | Builds a synthetic BM25 corpus (stop-word-free vocabulary, per-document rotating term windows) sized to a target document count or indexed byte count, for the packed-engine RAM and warmup gates. |
| `flag-feature-fixtures.ts` | Synthetic verdict-path rows (`groundedHit`, `vectorOnlyHit`) for the `cite_with_caveat`, `evidence_gap` and related display/verdict feature flags, covering borderline and clear-good/clear-gap cases the off-corpus corpus never produces. |

## 3. CONSUMERS

- `tests/bm25-packed-inmemory.vitest.ts` (`bm25-packed-fixture.ts`).
- `tests/flag-graduation-cite-with-caveat.vitest.ts`, `tests/flag-graduation-evidence-gap.vitest.ts` (`flag-feature-fixtures.ts`).

## 4. RELATED

- [`../README.md`](../README.md)
