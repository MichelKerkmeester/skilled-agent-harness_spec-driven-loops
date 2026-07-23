---
title: "Health Degeneration Harness: Signal-to-Response Runtime Health Detection"
description: "Turns normalized budget, cycle and coverage signals into a per-mode health state and a recommended response action."
---

# Health Degeneration Harness

---

## 1. OVERVIEW

Runtime primitives consumed by `system-deep-loop` workflow modes to detect degenerative run patterns such as mode collapse, repetition, novelty starvation, quality decay, budget thrash and telemetry gaps. Adapters normalize raw budget, cycle and coverage signals into shared observations, a versioned policy sets the evaluation thresholds and a projector aggregates observations into a health state (`observing` through `critical`) with a recommended response action (pause region, reseed frontier, quarantine candidate, request stop).

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `health-adapters.ts` | Normalizes per-mode budget, cycle, frontier, progress, quality and semantic-concentration inputs into shared health observations |
| `health-harness-types.ts` | Signal, severity, aggregate-state and response-action vocabularies plus the policy and observation contracts |
| `health-observation-projector.ts` | Aggregates normalized observations into a per-mode health state and emits response actions, with shadow replay support |
| `health-policy.ts` | Builds the immutable, hash-versioned threshold policy (windows, floors, ratios) the projector evaluates against |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/mode-contract-types.ts` and `substrate-ports.ts` require `HealthObservationProjector` as a required substrate port
- `.opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/` feeds budget-lifecycle inputs into the adapters

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/health-degeneration-harness.vitest.ts`
