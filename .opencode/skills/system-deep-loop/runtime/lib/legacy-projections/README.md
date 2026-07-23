---
title: "Legacy Projections: Shadow Writes for Old-Format Readers"
description: "Folds verified ledger events into disposable legacy JSON or JSONL bytes so existing readers keep working during migration."
---

# Legacy Projections

---

## 1. OVERVIEW

Runtime primitives that keep legacy JSON and JSONL readers fed while a `system-deep-loop` workflow mode migrates its state to the ledger. The engine folds verified ledger events into legacy-format bytes without acquiring legacy write authority. A durable shadow store publishes those bytes atomically with watermark tracking so refreshes never regress or partially overwrite a reader-visible file.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `legacy-projection-engine.ts` | `LegacyProjectionEngine`: folds verified ledger events into disposable legacy bytes without acquiring write authority |
| `legacy-projection-errors.ts` | Stable failure codes for the shadow legacy-projection boundary |
| `legacy-projection-fold.ts` | Pure fold, digest and JSON or JSONL serializer functions with replay-fingerprint hashing |
| `legacy-projection-manifest.ts` | Frozen census manifest of legacy JSON-bearing state surfaces and their project or retain-legacy-input dispositions |
| `legacy-projection-types.ts` | `LegacyProjectionBase` and `LegacyProjectionContract`, refresh-boundary and request or result contracts |
| `shadow-projection-store.ts` | `ShadowProjectionStore`: atomic durable filesystem writer and reader with watermark tracking |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/rollback-drills/rollback-drill-runner.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts`
