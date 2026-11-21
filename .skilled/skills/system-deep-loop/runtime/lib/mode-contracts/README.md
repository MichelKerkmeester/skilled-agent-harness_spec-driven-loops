---
title: "Mode Contracts: Shared Interface Every Workflow Mode Must Satisfy"
description: "Defines the contract shape and the required substrate-port types every workflow mode must satisfy."
---

# Mode Contracts

---

## 1. OVERVIEW

The shared plug-in interface that every `system-deep-loop` workflow mode (research and review) must satisfy to run on the common runtime. `mode-contract-types.ts` fixes the contract shape: resume snapshot, certificate, convergence hooks and provided capabilities. `substrate-ports.ts` declares the runtime-service port types a mode is given (ledger, budget authority, lease coordinator, health projector, sealed artifact store, gauge registry). The module holds types plus frozen contract constants. `index.ts` re-exports four of those constants as runtime values (`MODE_CONTRACT_INTERFACE_VERSION`, `MODE_CONTRACT_SHAPE`, `ModeConvergenceHookSet` and `ModeProvidedCapabilities`) and every `mode-contract-types.ts` export as a type.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mode-contract-types.ts` | The shared contract every workflow mode must satisfy (resume snapshot, certificate, convergence hooks) |
| `substrate-ports.ts` | The substrate-port types (ledger, budget authority, lease coordinator, health projector, sealed artifact store, gauge registry) a mode is given. `mode-contract-types.ts` consumes them |
| `index.ts` | Public API barrel: re-exports four contract constants as values and the `mode-contract-types.ts` surface as types |

---

## 3. CONSUMERS

- `deep-research-reducers` and `deep-review-reducers` import `ModeContract` and its reducer types from `index.ts` with `import type`.
- `substrate-ports.ts` supplies the `ModeSubstratePorts` / `ModeSubstratePortName` types that `mode-contract-types.ts` builds on.

---

## 4. TESTS

None. No unit suite imports this folder.
