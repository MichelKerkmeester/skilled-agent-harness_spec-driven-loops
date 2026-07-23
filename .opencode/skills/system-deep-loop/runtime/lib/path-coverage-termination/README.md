---
title: "Path Coverage Termination: Certificate-Based Stop Decisions"
description: "Evaluates whether a workflow mode has covered its required region universe well enough to terminate."
---

# Path Coverage Termination

---

## 1. OVERVIEW

Runtime primitives that decide whether a `system-deep-loop` workflow mode has done enough work to stop. A frozen coverage universe is compiled per mode from major regions, dimensions and required evidence classes, a reducer folds path-coverage events into per-path state and the evaluator compares that projection against the universe and a coverage certificate to produce a termination decision. The result is currently shadow-only: it attaches proof diagnostics to the legacy graph-decision bridge without taking over authority.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `evaluator.ts` | `evaluatePathCoverageTermination`: the termination decision comparing per-path coverage against a certificate and universe |
| `profiles.ts` | Per-mode coverage profiles defining major regions, dimensions and required evidence classes |
| `reducer.ts` | Reduces path-coverage ledger events into a `PathCoverageProjection` of path states |
| `shadow.ts` | Attaches path-coverage proof diagnostics to the legacy graph-decision bridge without changing authority |
| `types.ts` | Schema versions, mode and path-state vocabularies plus certificate, record and universe contracts |
| `universe.ts` | Compiles, validates and mints the frozen coverage universe from mode profiles and the coverage-graph schema |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/mode-contract-types.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/stopping-clocks/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/path-coverage-termination.vitest.ts`
