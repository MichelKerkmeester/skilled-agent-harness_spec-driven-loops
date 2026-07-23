---
title: "Cycle Detection"
description: "Detects unproductive repetition across loop iterations by comparing bounded state-signature history against a versioned detector policy."
---

# Cycle Detection

---

## 1. OVERVIEW

Repetition signal for `system-deep-loop` iterations. Cycle observation canonicalizes coverage, blocker and progress evidence into one verified observation. Cycle history folds those observations into a bounded projection for one detector policy generation. The detector evaluates only the latest bounded suffix so stop authority stays outside this module. The progress gate and shadow observer let a caller check for real forward motion or run the detector beside an opaque authoritative result without changing it.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `cycle-detection-policy.ts` | `resolveCycleDetectorPolicy`, resolving one exact detector policy without reinterpreting stored history |
| `cycle-detection-types.ts` | `CycleDetectionError` and shared type definitions |
| `cycle-detector.ts` | `evaluateCycleHistory`, evaluating the latest bounded suffix while keeping stop authority outside this module |
| `cycle-health-events.ts` | `cycleHealthEventDefinitions`, the closed versioned health-event definitions |
| `cycle-history.ts` | `createCycleHistoryProjection`, the empty projection for one exact detector policy generation |
| `cycle-observation.ts` | `createCycleCoverageSnapshot`, `projectCycleObservation` and `verifyCycleObservation`, canonicalizing coverage, blocker and progress evidence into one verified observation |
| `cycle-progress-gate.ts` | `assessCycleProgress`, evaluating only explicit typed progress recorded after the candidate start |
| `cycle-shadow.ts` | `observeCycleInShadow`, projecting cycle evidence beside an opaque authoritative result without changing it |
| `index.ts` | Public API surface |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-adapters.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/health-adapters.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/cycle-detection.vitest.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`claim-continuity`](../claim-continuity/README.md)
- [`deep-loop/continuity-identity`](../deep-loop/continuity-identity/README.md)
