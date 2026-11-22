---
title: "Legacy Projections: Shadow Writes for Old-Format Readers"
description: "Folds verified ledger events into disposable legacy JSON or JSONL bytes so existing readers keep working during migration."
---

# Legacy Projections

---

## 1. OVERVIEW

Runtime primitives that keep legacy JSON and JSONL readers fed while a `system-deep-loop` workflow mode migrates its state to the ledger. The engine folds verified ledger events into legacy-format bytes without acquiring legacy write authority. A durable shadow store publishes those bytes atomically with watermark tracking so refreshes never regress or partially overwrite a reader-visible file.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `deep-research-contract.ts` | `createDeepResearchProjectionContract`: folds deep-research ledger events into the legacy deep-research state JSONL rows |
| `deep-research-deltas-contract.ts` | `createDeepResearchDeltasProjectionContract`: a surface contract that fans deep-research ledger events out into one delta JSONL file per iteration |
| `deep-research-projections-contract.ts` | `createDeepResearchProjectionsProjectionContract`: a surface contract that folds only the findings registry and leaves the prose artifacts of that surface unprojected |
| `deep-review-deltas-contract.ts` | `createDeepReviewDeltasProjectionContract`: a surface contract that fans deep-review ledger events out into one delta JSONL file per iteration |
| `deep-review-projections-contract.ts` | `createDeepReviewProjectionsProjectionContract`: a surface contract that folds only the findings registry and leaves the prose artifacts of that surface unprojected |
| `deep-review-state-contract.ts` | `createDeepReviewStateProjectionContract`: folds deep-review ledger events into the legacy deep-review state JSONL rows |
| `legacy-projection-engine.ts` | `LegacyProjectionEngine`: folds verified ledger events into disposable legacy bytes without acquiring write authority |
| `legacy-projection-errors.ts` | Stable failure codes for the shadow legacy-projection boundary |
| `legacy-projection-fold.ts` | Pure fold, digest and JSON or JSONL serializer functions with replay-fingerprint hashing |
| `legacy-projection-manifest.ts` | Frozen census manifest of legacy JSON-bearing state surfaces and their project or retain-legacy-input dispositions |
| `legacy-projection-surface-fold.ts` | `foldLegacyProjectionSurface`: folds every artifact of a multi-file surface through its own single-artifact contract and returns the bytes in `buildArtifacts` order |
| `legacy-projection-types.ts` | `LegacyProjectionBase` and `LegacyProjectionContract`, refresh-boundary and request or result contracts |
| `shadow-projection-store.ts` | `ShadowProjectionStore`: atomic durable filesystem writer and reader with watermark tracking |
| `index.ts` | Public API barrel |

---

## 3. CONSUMERS

- `../mode-append-gateway/append-mode-event.ts` imports the engine, the census manifest and the two state contracts to refresh the legacy file after an append.
- `../../scripts/check-projection-coverage.cjs` reads the census manifest as text and fails when a projectable surface has neither an exported contract factory nor an explicit uncovered declaration.

---

## 4. TESTS

- `../../tests/unit/legacy-projections.test.ts`
- `../../tests/unit/legacy-projection-surface-fold.vitest.ts`

---

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`mode-append-gateway`](../mode-append-gateway/README.md)
