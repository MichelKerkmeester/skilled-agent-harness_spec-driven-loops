---
title: "Mode Contracts: Shared Interface Every Workflow Mode Must Satisfy"
description: "Defines the contract shape, required substrate ports, conformance runner and version compatibility policy for a workflow mode."
---

# Mode Contracts

---

## 1. OVERVIEW

The shared plug-in interface that every `system-deep-loop` workflow mode (research, review, council and the improvement lanes) must satisfy to run on the common runtime. `mode-contract-types.ts` fixes the contract shape (resume snapshot, certificate, convergence hooks), `substrate-ports.ts` lists the runtime services a mode is given (ledger, budget authority, lease coordinator, health projector, sealed artifact store, gauge registry), `conformance.ts` runs a mode implementation against that shape and `compatibility-policy.ts` decides whether a reader and writer on different interface versions can still interoperate.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `compatibility-policy.ts` | Resolves reader and writer mode-interface-version compatibility decisions from declared changes and adapters |
| `conformance.ts` | Runs the conformance suite that checks a mode implementation against the shared contract shape |
| `mode-contract-types.ts` | The shared contract every workflow mode must satisfy (resume snapshot, certificate, convergence hooks) |
| `substrate-ports.ts` | The required substrate ports (ledger, budget authority, lease coordinator, health projector, sealed artifact store, gauge registry) a mode is given |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/mode-contracts.vitest.ts`
