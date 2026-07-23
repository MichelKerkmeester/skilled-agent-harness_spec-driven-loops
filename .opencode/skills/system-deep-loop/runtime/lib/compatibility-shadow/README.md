---
title: "Compatibility Shadow"
description: "Dual-read comparison and versioned upcasting so legacy and dark stores can be evaluated side by side without changing what legacy callers see."
---

# Compatibility Shadow

---

## 1. OVERVIEW

Migration boundary between a legacy read model and a dark, additive replacement. The dual-read adapter reads both stores for one comparison token and records reconciliation evidence, while the state and event upcaster registries route historical bytes through the version chain a schema declares before either side interprets them. The legacy result stays authoritative throughout, this module only observes and reports drift.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `compatibility-errors.ts` | `CompatibilityError`, the typed fail-closed error that never includes source payload values |
| `compatibility-types.ts` | Shared state, version and upcast type definitions |
| `dual-read-adapter.ts` | `DualReadAdapter`, reading both stores for evidence while preserving the exact operational legacy contract |
| `event-upcaster-adapter.ts` | `readCompatibilityEvent`, routing historical event bytes through the canonical envelope read boundary |
| `index.ts` | Public API surface |
| `state-upcaster-registry.ts` | `StateUpcasterRegistry`, the immutable startup registry for fixture-backed state schemas and adjacent upcasters |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/fixture-corpus.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/compatibility-adapter.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/compatibility-shadow-adapters.vitest.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`event-envelope`](../event-envelope/README.md)
