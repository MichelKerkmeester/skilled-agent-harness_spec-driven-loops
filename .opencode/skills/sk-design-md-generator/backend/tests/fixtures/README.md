---
title: "fixtures: Study Exemplar Adversarial Fixtures"
description: "Adversarial design source, token, and prompt-injection fixtures for the study-exemplars vitest suite."
---

# fixtures: Study Exemplar Adversarial Fixtures

---

## 1. OVERVIEW

`tests/fixtures/` holds `study-cases.ts`, the adversarial fixture module for `../study-exemplars.test.ts`. It builds an intentionally hostile source design (a prompt-injection line, a source logo reference, and leak-prone copy) plus matching adversarial tokens, so the study-exemplar pipeline can be asserted against source-leak, brand-leak, and injection scenarios rather than only clean input.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `study-cases.ts` | Exports `STUDY_GENERATION`, `ADVERSARIAL_DESIGN`, `ADVERSARIAL_TOKENS`, `STUDY_CONTENT_HASH`, `STUDY_HYDRATED_CONTENT_HASH`, `STUDY_CANDIDATE`, `STUDY_HYDRATION`, `TARGET_TOKENS` and a set of leak-draft strings (`EXACT_LEAK_DRAFT`, `NORMALIZED_LEAK_DRAFT`, `SHORT_NORMALIZED_LEAK_DRAFT`, `BRAND_LEAK_DRAFT`, `RELATIVE_ASSET_LEAK_DRAFT`, `NUMERIC_TOKEN_LEAK_DRAFT`, `CLEAN_RETRY_DRAFT`) used to assert that generated study prose does not leak source-owned identity, colors or assets. |

## 3. CONSUMERS

- [`../study-exemplars.test.ts`](../study-exemplars.test.ts) - imports 13 of the 15 exports (all except `ADVERSARIAL_TOKENS` and `STUDY_CONTENT_HASH`) to drive the study-exemplar leak-detection assertions.

## 4. RELATED

- [`../README.md`](../README.md) - the backend vitest suite this fixture module supports.
- [`../../scripts/study-exemplars.ts`](../../scripts/study-exemplars.ts) - the module under test, source of the `StudyCandidate`/`StudyHydration` types this fixture builds against.
