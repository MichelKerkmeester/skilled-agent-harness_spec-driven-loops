---
title: "Tests: Transport Grounding and Reconciliation Coverage"
description: "node:test suite for the Open Design transport's grounding receipt, offline gate, live-transport capability check, and return-reconciliation validators."
---

# Tests: Transport Grounding and Reconciliation Coverage

---

## 1. OVERVIEW

`tests/` owns the `node:test` coverage for the design-mcp-open-design transport contracts: the grounding receipt shape, the daemon-free offline contract gate, the live-transport capability check, and return reconciliation. The single test file exercises `grounding-receipt.mjs`, `live-transport.mjs`, `offline-gate.mjs`, and `return-reconciliation.mjs` against the shared fixture atlas in `../fixtures/offline-fixtures.mjs` and the shared corpus-context positive fixture.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `transport-grounding.test.mjs` | Asserts the shared proof contract validates without an adapter fork, receipts reject raw cache fields and missing authority fields, proof digests must match the hydrated source record, return reconciliation surfaces divergence instead of silently accepting it, duplicate or unbound evidence is rejected, `runOfflineContractGate()` passes before live plumbing, and `checkLiveCapability()`/`executeLiveRead()`/`executeLiveRun()` fail closed when the daemon adapter is unavailable. |

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-design/design-mcp-open-design/tests/*.test.mjs
```

## 4. RELATED

- [`../SKILL.md`](../SKILL.md) - design-mcp-open-design transport mode.
- [`../fixtures/README.md`](../fixtures/README.md) - the fixture atlas this suite asserts against, also consumed at runtime by `offline-gate.mjs`.
