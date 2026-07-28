---
title: "Transport: Open Design Runtime Contract Modules"
description: "The four ES modules that implement the Open Design transport's grounding receipt, return reconciliation, offline contract gate, and capability-gated live execution."
---

# Transport: Open Design Runtime Contract Modules

---

## 1. OVERVIEW

`transport/` owns the design-mcp-open-design runtime: the metadata-only grounding-receipt contract, the return-reconciliation semantics, the daemon-free offline contract gate, and the capability-gated live read/run path. These are library modules imported by other code, not operator entrypoints — the operator-facing readiness scripts live in [`../scripts/`](../scripts/README.md).

The four modules form one closed import graph. `grounding-receipt.mjs` is the root: it declares `PAIRED_MODES` and `ALLOWED_INFLUENCE_AXES`, and every other module in this directory depends on it directly or transitively. Nothing outside `sk-design-mcp-open-design/` imports these modules, and no consumer resolves them by an absolute or fixed path.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `grounding-receipt.mjs` | The receipt contract root. Declares `PAIRED_MODES` (the paired design modes a receipt may name), `ALLOWED_INFLUENCE_AXES` (design axes a receipt may claim influence over — an axis vocabulary, *not* a mode list), `RECEIPT_AUTHORITY`, `NO_CACHE_POLICY`, and the recursively closed receipt schema. Exposes `digestMetadata()`, `validateGroundingReceipt()`, and `validateReceiptForLive()`. Imports the shared proof contract from `../../shared/corpus-context/`. |
| `return-reconciliation.mjs` | Recomputes semantic outcome and divergence from returned evidence rather than trusting the transport's own claim. Owns the proposal, return-evidence, and reconciliation schemas plus `reconcileTransportReturn()`, `deriveModeEvidence()`, and the validators. Authority stays with the paired mode (`transportAuthoritative: false`). |
| `offline-gate.mjs` | The identity-bound gate that must pass before any live daemon call. `runOfflineContractGate()` replays the whole fixture atlas from [`../fixtures/`](../fixtures/README.md) plus eight inline falsifiers and fails closed if any falsifier is wrongly accepted; `assertOfflineContractGate()` binds the result identity so a forged gate result cannot authorize live I/O. |
| `live-transport.mjs` | Capability-gated live read and run. Asserts the offline gate first, checks required daemon tools, takes an immutable pre-await snapshot, reduces payloads to hashes and ids, and drives multi-turn completion. Fails closed when the daemon adapter is unavailable. |

## 3. CONSUMERS

- [`../tests/transport-grounding.test.mjs`](../tests/README.md) - asserts all four modules against the shared fixture atlas (37 tests).
- [`../fixtures/offline-fixtures.mjs`](../fixtures/README.md) - imports the receipt and reconciliation contract constants to build the atlas that `offline-gate.mjs` then replays. The dependency is deliberately cyclic at the directory level and acyclic at the module level.

## 4. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/sk-design-mcp-open-design/tests/*.test.mjs
```

Expected result: 37 passing tests, 0 failures.

## 5. RELATED

- [`../SKILL.md`](../SKILL.md) - design-mcp-open-design transport mode.
- [`../references/tool-surface.md`](../references/tool-surface.md) - the MCP tool surface these modules gate.
- [`../../shared/corpus-context/README.md`](../../shared/corpus-context/README.md) - the shared proof contract `grounding-receipt.mjs` validates against.
