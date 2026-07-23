---
title: "Stopping Clocks"
description: "Arbitrates five independent loop-termination signals into one deterministic termination declaration."
---

# Stopping Clocks

---

## 1. OVERVIEW

Decides when a loop is actually done. Five independent clocks, each from its own owning domain, observe budget exhaustion, wall-time, cycle detection, novelty decay and coverage. The arbiter composes their observations into one deterministic termination result with a stable tie-break rank. A shadow bridge pairs that result with the authoritative legacy convergence decision while the two run side by side.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `index.ts` | Public API surface |
| `stopping-clock-adapters.ts` | Observes each clock kind from its owning domain with a closed cause vocabulary |
| `stopping-clock-arbiter.ts` | Composes the five clock observations into one arbitration result without mutating adapter state |
| `stopping-clock-events.ts` | Typed ledger event for the declared loop-termination decision |
| `stopping-clock-profiles.ts` | Versioned per-mode clock profiles and adapter-version registry |
| `stopping-clock-shadow.ts` | Pairs stopping-clock evidence with the authoritative legacy convergence result |
| `stopping-clock-types.ts` | Closed vocabularies and arbitration type contracts |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/`

It depends on `cycle-detection`, `hierarchical-budgets`, `path-coverage-termination` and `semantic-communities` for the individual clock inputs.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/stopping-clocks.vitest.ts`

## 5. RELATED

- [`runtime/lib/semantic-communities/README.md`](../semantic-communities/README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
