---
title: "Stream-Fold Gauges"
description: "Deterministic, replay-verifiable streaming metric folds computed from ledger events, compared against legacy dark-run values."
---

# Stream-Fold Gauges

---

## 1. OVERVIEW

Turns a stream of ledger events into a deterministic, replay-verifiable metric. A gauge is a versioned fold registered by family, such as progress, cost, novelty disposition or health. Each result can be replayed from the ledger and checked against a replay fingerprint. A comparison helper records the gauge result alongside the legacy dark-run value it is meant to eventually replace.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `gauge-evidence.ts` | Records gauge results and legacy-comparison outcomes as typed ledger events |
| `gauge-registry.ts` | Immutable registry of versioned deterministic gauge folds |
| `gauge-replay.ts` | Replays a gauge fold from the ledger and verifies it against a replay fingerprint |
| `index.ts` | Public API surface |
| `standard-gauges.ts` | The shipped progress, cost, novelty and health gauge definitions |
| `stream-fold-gauge-errors.ts` | Fail-closed error codes and phases for gauge boundaries |
| `stream-fold-gauge-types.ts` | Gauge family, checkpoint and result type contracts |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/transactional-projections/` (bundle registry and engine)
- `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/`
- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/stream-fold-gauges.vitest.ts`
- Also exercised by `transactional-projections.vitest.ts`.

## 5. RELATED

- [`runtime/lib/replay-fingerprint/README.md`](../replay-fingerprint/README.md)
- [`runtime/lib/transactional-projections/README.md`](../transactional-projections/README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
