# Ownership Composition

---

## 1. OVERVIEW

Ownership-composition utility that proves the `deep-pi` and `pi-cache-optimizer` extensions never both react to the same model. Given a fixture of owned and excluded models and the two extensions' real ownership predicates, `composeOneOwner` produces a result per model showing which extension(s) actually claimed it.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `one-owner.ts` | Exports `OwnershipModel` (`{ provider, id }`), `OwnershipFixture` (`{ owned, excluded }`), `OwnershipBoundaryPredicate`, `OwnershipResult` (`{ modelId, expectedOwner, actualOwners }`), and `composeOneOwner`. The function maps each fixture model through both predicates and builds an `actualOwners` array: `deep-pi` is listed when `deepPiPredicate` returns true, `pi-cache-optimizer` is listed when `cacheOptimizerPredicate` returns false (the optimizer is a no-op for owned models). Each result's `expectedOwner` comes from the fixture. |

---

## 3. BOUNDARIES

- `one-owner.ts` has no imports. It is a pure utility consumed by both extensions' ownership-composition tests.

---

## 4. RELATED

- [shared/ README](../README.md)
- [deep-pi README](../../deep-pi/README.md)
- [pi-cache-optimizer README](../../pi-cache-optimizer/README.md)
