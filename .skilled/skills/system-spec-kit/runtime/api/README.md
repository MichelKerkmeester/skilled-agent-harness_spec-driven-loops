---
title: "Runtime Public API"
description: "Stable import surface for spec folder identity, validation, folder discovery and graph metadata."
trigger_phrases:
  - "public api"
  - "api surface"
  - "stable imports"
---

# Runtime Public API

## 1. OVERVIEW

`runtime/api/` is the supported import surface for the scripts workspace and any other package consumer that needs this engine's capabilities without reaching into internal folders. Add exports here only when an external caller needs a stable contract: every export in `index.ts` has a named caller in the scripts workspace, and one added without a caller re-widens the surface this barrel exists to keep narrow.

Internal package code should import from its owning `lib/`, `handlers/`, or `core/` module instead of routing through this barrel.

`@spec-kit/runtime/api` is the internal boundary between `runtime/` and `runtime/cli/`, not a repo-wide shared library. Its exports exist for the CLI's scripts workspace and for package consumers of this runtime; other skills are outside its audience. Similar helpers appearing in more than one skill are deliberate copies owned where they are used, not missed imports to be redirected here.

---

## 2. SURFACE

| Surface | Purpose |
|---|---|
| Graph refresh | Spec-folder resolution plus graph metadata re-derivation for the save workflow. |
| Drift markers | Marker path resolution, entry keys and the atomic write helper used by the git hooks. |
| Spec folder identity | Folder identity resolution and the graph-metadata path classifier. |
| Validation | Folder validation entry point, report types and the continuity fingerprint. |
| Folder discovery | Per-folder description generation, load, save and repair helpers. |
| Graph metadata | Schema, parser, integrity gate and drift gate for `graph-metadata.json`. |

---

## 3. EXPORTS

`index.ts` re-exports from `graph-refresh.ts` plus a fixed set of internal modules, grouped by the caller that needs them:

- `graph-refresh.ts`: `refreshGraphMetadata`, which resolves a spec folder reference before re-deriving its graph metadata.
- Spec folder identity and validation: `resolveSpecFolderIdentity`, `SpecFolderIdentityError`, `canClassifyAsGraphMetadataPath`, `validateFolder`, `buildContinuityFingerprint`, `ZERO_CONTINUITY_FINGERPRINT` and the `ValidateOpts` / `ValidationEntry` / `ValidationReport` types.
- Folder discovery: `generatePerFolderDescription`, `savePerFolderDescription`, `loadPerFolderDescription`, `loadExistingDescription`, `wouldWritePerFolderDescription`, `getRepairMergeSafe`, `extractKeywords`, `slugifyFolderName` and their result types.
- Graph metadata: the `graph-metadata.json` schema constants and Zod schemas, the parser's load/derive/merge/serialize/write functions, `checkGeneratedMetadataIntegrity`, `checkGeneratedMetadataDrift`, `computeSourceDocHashes` and the matching report types.

---

## 4. ALLOWED IMPORTS

| Caller | Rule |
|---|---|
| External scripts | Prefer `@spec-kit/runtime/api` or `@spec-kit/runtime/api/<module>`. |
| Internal package code | Import from the owning internal module, not from `api/index.ts`. |
| New public needs | Add a narrow export here, or document the exception in the import-policy allowlist. |

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public barrel for package and script consumers. |
| `graph-refresh.ts` | Spec-folder resolution and graph metadata refresh surface. |

---

## 6. VALIDATION

Run from the repository root:

```bash
(cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest run tests/import-policy-rules.vitest.ts)
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/api/README.md
```

Expected result: import policy tests pass and README validation exits `0` with no HVR issues.

---

## 7. RELATED

- [Runtime engine](../README.md)
- [Runtime tests](../tests/README.md)
- [Import policy allowlist](../cli/evals/import-policy-allowlist.json)
