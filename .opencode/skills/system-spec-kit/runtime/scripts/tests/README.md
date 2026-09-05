---
title: "Scripts Tests"
description: "Test suite for the runtime's package-local build and test-runner scripts."
trigger_phrases:
  - "scripts tests"
  - "resource map extractor test"
---

# Scripts Tests

---

## 1. OVERVIEW

`runtime/scripts/tests/` holds the test suite for the scripts in `runtime/scripts/` (the build finalizer and the bounded test runners). It is a flat folder with a single test file today.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `resource-map-extractor.vitest.ts` | Test suite exercising resource-map extraction behavior used by the runtime's scripts. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Scope | This folder holds tests only. Implementation lives in the sibling `runtime/scripts/*.mjs` files it exercises. |
| Ownership | Test content in this folder is owned by whichever agent maintains `runtime/scripts/`; this README documents structure and validation only. |

---

## 4. VALIDATION

Known gap: `resource-map-extractor.vitest.ts` is not matched by any `include` glob in `runtime/vitest.config.ts` or the repository-root `vitest.config.ts`. Both target `runtime/tests/`, `scripts/tests/` under the sibling `scripts/` package, or `tests/`; none of those patterns cover `runtime/scripts/tests/`, so `npm test` and `npm run test:core` never run this file. Confirming behavior here requires either a temporary `include` override passed to Vitest, or exercising `../../../scripts/resource-map/extract-from-evidence.cjs` (the module this suite covers) directly. Widening `vitest.config.ts`'s `include` list is a test-selection behavior change outside a documentation-only edit; route it through whichever change is touching that file.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../../README.md`](../../README.md)
