---
title: "Semantic Communities"
description: "Groups semantically equivalent claims into namespaced communities through an incremental, versioned projection."
---

# Semantic Communities

---

## 1. OVERVIEW

Clusters claims that mean the same thing, even when their wording differs, into namespaced semantic communities. Each new claim observation is checked against existing candidates in its namespace and admitted as a semantic-equivalence edge when it qualifies, then folded incrementally into a versioned community projection. A novelty helper pairs the resulting concept-novelty signal with the legacy coverage-graph's authoritative novelty result while that migration is in flight.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `community-projection.ts` | Builds and incrementally updates the semantic-community projection from claim observations |
| `index.ts` | Public API surface |
| `semantic-community-events.ts` | Typed ledger event and reducer registration for claim-observation events |
| `semantic-community-types.ts` | Projection config, record and result type contracts |
| `semantic-equivalence.ts` | Admits semantic-equivalence edges between claims within a namespace |
| `semantic-novelty.ts` | Pairs semantic novelty with the unchanged legacy coverage-graph novelty result |

---

## 3. CONSUMERS

- [`../path-coverage-termination/`](../path-coverage-termination/) (types and universe)
- [`../stopping-clocks/`](../stopping-clocks/) (novelty_decay clock type)

---

## 4. TESTS

- [`../../tests/unit/semantic-communities.vitest.ts`](../../tests/unit/semantic-communities.vitest.ts)
- Also exercised by `path-coverage-termination.vitest.ts` and `stopping-clocks.vitest.ts`.

Run from the repository root:

```bash
cd .skilled/skills/system-deep-loop/runtime
npx vitest run tests/unit/semantic-communities.vitest.ts
```

Expected: vitest reports `Test Files  1 passed (1)` and no failed tests.

---

## 5. RELATED

- [`../coverage-graph/README.md`](../coverage-graph/README.md)
- [`../README.md`](../README.md)
- [`../../../SKILL.md`](../../../SKILL.md)
