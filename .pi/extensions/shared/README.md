# Shared Extension Assets

---

## 1. OVERVIEW

Assets shared across the `deep-pi` and `pi-cache-optimizer` extensions. Contains the DeepSeek ownership fixture that defines which models each extension owns, and the `composition/` subfolder with the ownership-composition test utility that proves exactly one extension reacts to any given model.

---

## 2. DIRECTORY TREE

```text
shared/
├── deepseek-ownership.json   # Fixture defining owned and excluded DeepSeek models
└── composition/
    └── one-owner.ts          # Ownership composition utility
```

---

## 3. KEY FILES

| File | Role |
| --- | --- |
| `deepseek-ownership.json` | JSON fixture with `owned` (two `deepseek`-provider models: `deepseek-v4-flash`, `deepseek-v4-pro`) and `excluded` (two non-deepseek-provider models: `opencode/deepseek-v4-flash-free`, `opencode-go/deepseek-v4-flash`) arrays. Consumed by both extensions' ownership-composition tests. |
| `composition/one-owner.ts` | Exports `OwnershipModel`, `OwnershipFixture`, `OwnershipBoundaryPredicate`, `OwnershipResult`, and `composeOneOwner`. The `composeOneOwner` function takes a fixture and two predicates (deep-pi and pi-cache-optimizer) and returns an `OwnershipResult[]` proving each model has exactly one actual owner. See [composition/README.md](./composition/README.md). |

---

## 4. RELATED

- [composition/ README](./composition/README.md)
- [deep-pi README](../deep-pi/README.md)
- [pi-cache-optimizer README](../pi-cache-optimizer/README.md)
