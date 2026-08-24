---
title: "Mode Contracts: Shared Interface Every Workflow Mode Must Satisfy"
description: "Defines the contract shape and the required substrate-port types every workflow mode must satisfy."
---

# Mode Contracts

---

## 1. OVERVIEW

The shared plug-in interface that every `system-deep-loop` workflow mode (research, review, council, alignment and the improvement lanes) must satisfy to run on the common runtime. `mode-contract-types.ts` fixes the contract shape (resume snapshot, certificate, convergence hooks); `substrate-ports.ts` declares the runtime-service port types a mode is given (ledger, budget authority, lease coordinator, health projector, sealed artifact store, gauge registry). The module is now a pure type surface — the earlier conformance runner, strict gate validators, and version-compatibility policy have been removed as dead scaffolding.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mode-contract-types.ts` | The shared contract every workflow mode must satisfy (resume snapshot, certificate, convergence hooks) |
| `substrate-ports.ts` | The substrate-port types (ledger, budget authority, lease coordinator, health projector, sealed artifact store, gauge registry) a mode is given; consumed by `mode-contract-types.ts` |
| `index.ts` | Public API barrel — re-exports the `mode-contract-types.ts` surface |

---

## 3. CONSUMERS

- All eight `*-ledger-schema` reducer packages import the `mode-contract-types.ts` surface as `import type`.
- `substrate-ports.ts` supplies the `ModeSubstratePorts` / `ModeSubstratePortName` types that `mode-contract-types.ts` builds on.

---

## 4. TESTS

None — the module is type-only; its former value-layer test was removed with the value layer.
