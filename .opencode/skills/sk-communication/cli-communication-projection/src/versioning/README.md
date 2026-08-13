# Versioning: Schema Compatibility Policy

## 1. OVERVIEW

`versioning/` parses strict semantic versions and decides whether each contract version is exact, additive, backward-readable, breaking or invalid. Major-version mismatches fail closed and require migration.

Contract validators and compatibility checks use this policy before records enter the pipeline.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `compatibility.ts` | Defines supported versions and compatibility decisions |
| `index.ts` | Exposes versioning APIs and types |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `SupportedSchemaVersions`, `parseSemanticVersion` and `assessSchemaCompatibility`. It also exports `CompatibilityBehavior`, `CompatibilityDecision` and `SemanticVersion`.

---

## 4. VALIDATION

```bash
npm test -- test/contracts/compatibility.test.ts
```

Expected result: schema compatibility policy tests pass.

---

## 5. RELATED

- [Contracts subsystem](../contracts/README.md)
- [Source map](../README.md)
