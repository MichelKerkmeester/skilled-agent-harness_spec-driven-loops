---
title: "Transactional Projections"
description: "Applies verified ledger events into one atomic, fenced multi-view projection bundle and publishes committed snapshot manifests."
---

# Transactional Projections

---

## 1. OVERVIEW

Applies verified ledger events into one atomic projection generation, so a bundle of related views always advances together or not at all. The engine reduces events under a fenced lease from `locks-and-fencing`. A store treats one fenced document as the transaction boundary. A publisher delivers immutable committed snapshot manifests once a generation lands. A legacy-comparison helper records bounded, path-level evidence against the value the projection is meant to replace.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `committed-snapshot-publisher.ts` | Delivers immutable committed snapshot manifests to a caller-supplied sink |
| `index.ts` | Public API surface |
| `legacy-dark-comparison.ts` | Compares a projected value against the legacy result and records differing paths as bounded evidence |
| `projection-bundle-registry.ts` | Immutable, version-locked registry of projection-bundle and view definitions |
| `transactional-projection-engine.ts` | Applies ledger events into one fenced, atomic projection generation |
| `transactional-projection-errors.ts` | Fail-closed error codes for the projection engine and store |
| `transactional-projection-store.ts` | Fenced document store that is the transaction boundary for projections and pointers |
| `transactional-projection-types.ts` | Bundle, snapshot and reduce-context type contracts |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/health-degeneration-harness/`

It depends on `locks-and-fencing` for fenced leases and `stream-fold-gauges` for the metric bindings a bundle can carry.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/transactional-projections.vitest.ts`
- Also exercised by `health-degeneration-harness.vitest.ts`.

## 5. RELATED

- [`runtime/lib/stream-fold-gauges/README.md`](../stream-fold-gauges/README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
