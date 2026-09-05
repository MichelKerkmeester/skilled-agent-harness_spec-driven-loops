---
title: "Search: Folder Discovery"
description: "Code-folder guide for per-folder description discovery: generation, load, staleness detection and repair."
trigger_phrases:
  - "folder discovery"
  - "per folder description"
---

# Search: Folder Discovery

> Per-folder description discovery: generation, load, staleness detection and merge-preserving repair.

---

## 1. OVERVIEW

`lib/search/` owns resolving what a spec folder is about. The folder name is historical — this is a discovery module, not a retrieval engine. Despite the name, no `search-flags.ts` module lives here; the two environment flags this folder reads (`SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE`, `SPECKIT_GENERATED_METADATA_Z_EXCLUSION`) are read directly in `folder-discovery.ts` through the shared `parseFlagTristate()` reader from `lib/config/capability-flags.ts`.

Current state:

- `folder-discovery.ts` is the only implementation file in this folder. It resolves a packet's description from its canonical documents so every caller reads one merged answer instead of guessing from a filename.
- It owns both sides of `description.json`: generation and save, load with a typed result, staleness detection, and merge-preserving repair.
- This is a domain package. It exposes no tools of its own; `api/index.ts` re-exports the discovery functions external callers need.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                       SEARCH PACKAGE                             │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ api/index.ts │ ───▶ │ folder-discovery │ ───▶ │ description/    │
│              │      │ generate + load  │      │ schema + merge  │
└──────────────┘      └────────┬─────────┘      └─────────────────┘
                               │
                               ▼
┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ graph/       │ ───▶ │ description.json │      │ parsing/        │
│ parser       │      │ on disk          │ ◀─── │ normalizer      │
└──────────────┘      └──────────────────┘      └─────────────────┘

Dependency direction:
folder-discovery ───▶ description, parsing, config, utils
it does not import handlers or api
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/search/
+-- folder-discovery.ts   # Per-folder description generation, load, staleness and repair
`-- README.md
```

Allowed dependency direction:

```text
folder-discovery.ts → lib/description/*
folder-discovery.ts → lib/parsing/content-normalizer
folder-discovery.ts → lib/config/*, lib/utils/*
```

Disallowed dependency direction:

```text
lib/search/ → handlers/
lib/search/ → api/
lib/search/ → lib/validation/ or lib/graph/ orchestration
```

---

## 4. DIRECTORY TREE

```text
lib/search/
+-- folder-discovery.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `folder-discovery.ts` | Resolves a packet's description from its canonical documents into one merged answer. Owns `generatePerFolderDescription()`, `savePerFolderDescription()`, `loadPerFolderDescription()`, `loadExistingDescription()` and `wouldWritePerFolderDescription()`, plus staleness detection (`isPerFolderDescriptionStale`), the description cache helpers, `extractKeywords()`, `slugifyFolderName()`, `getSpecsBasePaths()`, the per-token similarity gate used when matching a query against folder descriptions, and its own two flag readers (`getRepairMergeSafe()`, `isGeneratedMetadataZExclusionEnabled()`). |

`LoadResult` is a discriminated union rather than a nullable value, so a caller distinguishes "absent" from "present but invalid" instead of collapsing both to `null`.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public callers | External code imports the re-exported discovery functions from `@spec-kit/runtime/api`, not from this folder. |
| Schema ownership | The `description.json` schema and merge rule belong to `lib/description/`. This folder calls them; it does not restate them. |
| Writes | `savePerFolderDescription()` is the write path. Repair goes through the merge-preserving helper so authored keys survive. |
| Flags | A flag helper reads its environment variable and returns a boolean. It does not branch on behavior; the caller owns that. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ caller names a spec folder                │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ read the folder's canonical documents     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ normalize content and extract a synopsis  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ merge over any authored description.json  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ merged PerFolderDescription, or a typed   │
│ LoadResult explaining why not             │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `generatePerFolderDescription()` | Function | Derives a folder's description from its documents. |
| `savePerFolderDescription()` | Function | Writes `description.json` for a folder. |
| `loadPerFolderDescription()` | Function | Reads a folder's description, or `null` when absent. |
| `loadExistingDescription()` | Function | Reads a folder's description as a typed `LoadResult`. |
| `extractKeywords()` | Function | Extracts keywords from a description string. |
| `slugifyFolderName()` | Function | Normalizes a folder name into a slug. |
| `getSpecsBasePaths()` | Function | Resolves the base paths under which spec folders live. |
| `getRepairMergeSafe()` | Function | Whether description.json repairs preserve unrecognized authored keys (`SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE`). |
| `isGeneratedMetadataZExclusionEnabled()` | Function | Whether `z-future`/`z_archive` segments are excluded from generated metadata (`SPECKIT_GENERATED_METADATA_Z_EXCLUSION`). |

---

## 8. VALIDATION

Run package checks from `runtime/`.

```bash
npm run typecheck
npm run test:core
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/lib/search/README.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/runtime/lib/search/README.md
```

Expected result: typecheck and tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../description/README.md`](../description/README.md)
- [`../parsing/README.md`](../parsing/README.md)
- [`../graph/README.md`](../graph/README.md)
- [`../../ENV-REFERENCE.md`](../../ENV-REFERENCE.md)
