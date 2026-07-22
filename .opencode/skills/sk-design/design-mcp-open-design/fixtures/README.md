---
title: "Fixtures: Offline Contract Fixture Atlas"
description: "Canonical receipt and reconciliation fixtures the offline contract gate runs at both build time and runtime, and that the test suite asserts against."
---

# Fixtures: Offline Contract Fixture Atlas

---

## 1. OVERVIEW

`fixtures/` owns `offline-fixtures.mjs`, the canonical fixture atlas for the design-mcp-open-design transport's grounding receipt and return-reconciliation contracts. This is not a test-only folder: `offline-gate.mjs` imports the same fixtures at runtime and replays them, plus four hand-mutated falsifiers, before any live daemon call is authorized. `tests/transport-grounding.test.mjs` asserts the underlying validators against the same fixtures.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `offline-fixtures.mjs` | Builds and freezes the fixture atlas: `RECEIPT_FIXTURES` (positive, no-fit, unavailable, stale, unknown-rights), `RECEIPT_HYDRATED_PROOFS`, and `RECONCILIATION_FIXTURES` (aligned, diverged, awaiting-input), plus the standalone `LIVE_BRIEF_FIXTURE` and `POSITIVE_RECEIPT_FIXTURE` exports consumed directly by the gate and tests. |

## 3. CONSUMERS

- [`../offline-gate.mjs`](../offline-gate.mjs) - `runOfflineContractGate()` replays every fixture here plus four inline falsifiers (cache violation, raw-payload allowed field, missing receipt authority, forged transport authority) and fails closed if any falsifier is wrongly accepted.
- [`../tests/README.md`](../tests/README.md) - `transport-grounding.test.mjs` asserts `validateGroundingReceipt`, `reconcileTransportReturn`, and related validators against this same atlas.

## 4. RELATED

- [`../SKILL.md`](../SKILL.md) - design-mcp-open-design transport mode.
- [`../grounding-receipt.mjs`](../grounding-receipt.mjs) and [`../return-reconciliation.mjs`](../return-reconciliation.mjs) - the validators these fixtures exercise.
