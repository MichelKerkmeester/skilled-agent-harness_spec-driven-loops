---
title: "Templates Library: Level Contract Resolution"
description: "Resolves Spec Kit documentation level contracts from the checked-in template manifest."
trigger_phrases:
  - "level contract resolver"
  - "spec kit template manifest"
---

# Templates Library: Level Contract Resolution

## 1. OVERVIEW

This folder owns runtime helpers that read template contract metadata for Spec Kit documentation levels. The current implementation resolves the checked-in manifest into typed contract objects used by validators and documentation tooling.

## 2. DIRECTORY TREE

```text
templates/
+-- level-contract-resolver.ts  # Resolves and serializes level contracts
`-- README.md                   # Folder orientation
```

## 3. KEY FILES

| File | Role |
|---|---|
| `level-contract-resolver.ts` | Loads `templates/manifest/spec-kit-docs.json`, validates level rows, normalizes section gates and exposes serializable contract data. |

## 4. ENTRYPOINTS

- `resolveLevelContract(level)` returns a `LevelContract` for levels `1`, `2`, `3`, `3+` or `phase`.
- `serializeLevelContract(contract)` converts `Map` fields into plain objects for JSON-safe consumers.

## 5. BOUNDARIES

- This folder reads template manifests from the skill package and built `dist` fallback path.
- It should validate manifest shape before exposing contract data.
- It should not perform spec-folder filesystem validation directly.

## 6. VALIDATION

Run from the repository root:

```bash
npm test -- --runInBand
```

## 7. RELATED

- `../../../templates/manifest/spec-kit-docs.json`
- `../spec/`
