---
title: "Search: Folder Discovery and Runtime Flags"
description: "Code-folder guide for per-folder description discovery and the package's runtime flag surface."
trigger_phrases:
  - "folder discovery"
  - "per folder description"
  - "search flags"
  - "runtime flags"
---

# Search: Folder Discovery and Runtime Flags

> Per-folder description discovery, plus the environment-backed flag surface the package reads.

---

## 1. OVERVIEW

`lib/search/` owns two things: resolving what a spec folder is about, and reading the runtime flags that gate optional behavior. The folder name is historical — this is a discovery and configuration module, not a retrieval engine.

Current state:

- `folder-discovery.ts` resolves a packet's description from its canonical documents so every caller reads one merged answer instead of guessing from a filename.
- It owns both sides of `description.json`: generation and save, load with a typed result, staleness detection, and merge-preserving repair.
- `search-flags.ts` exposes the default-on flag surface. Each helper reads one environment variable; setting `SPECKIT_<FLAG>=false` disables a graduated feature.
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

┌──────────────┐      ┌──────────────────┐
│ config/      │ ───▶ │ search-flags.ts  │
│ capability   │      │ env tristates    │
└──────────────┘      └──────────────────┘

Dependency direction:
folder-discovery ───▶ description, parsing, config, utils
search-flags ───▶ cognitive/rollout-policy
neither imports handlers or api
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/search/
+-- folder-discovery.ts   # Per-folder description generation, load, staleness and repair
+-- search-flags.ts       # Environment-backed runtime flags
`-- README.md
```

Allowed dependency direction:

```text
folder-discovery.ts → lib/description/*
folder-discovery.ts → lib/parsing/content-normalizer
folder-discovery.ts → lib/config/*, lib/utils/*
search-flags.ts → lib/cognitive/rollout-policy
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
+-- search-flags.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `folder-discovery.ts` | Resolves a packet's description from its canonical documents into one merged answer. Owns `generatePerFolderDescription()`, `savePerFolderDescription()`, `loadPerFolderDescription()`, `loadExistingDescription()` and `wouldWritePerFolderDescription()`, plus staleness detection (`isPerFolderDescriptionStale`), the description cache helpers, `extractKeywords()`, `slugifyFolderName()`, `getSpecsBasePaths()` and the per-token similarity gate used when matching a query against folder descriptions. |
| `search-flags.ts` | The package's flag surface. `parseFlagTristate()` is the shared reader; `isOptInEnabled()` and `isStrictOptInEnabled()` distinguish opt-in from strict opt-in. Individual helpers gate folder discovery, save-planner mode, reconsolidation, post-insert enrichment, quality gates and token budgeting. Production-ready flags are graduated to default-on and are disabled explicitly rather than enabled explicitly. |

`LoadResult` is a discriminated union rather than a nullable value, so a caller distinguishes "absent" from "present but invalid" instead of collapsing both to `null`.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public callers | External code imports the re-exported discovery functions from `@spec-kit/mcp-server/api`, not from this folder. |
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
| `parseFlagTristate()` | Function | Shared environment-flag reader used by every flag helper. |

---

## 8. VALIDATION

Run package checks from `mcp-server/`.

```bash
npm run typecheck
npm run test:core
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/search/README.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp-server/lib/search/README.md
```

Expected result: typecheck and tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../description/README.md`](../description/README.md)
- [`../parsing/README.md`](../parsing/README.md)
- [`../graph/README.md`](../graph/README.md)
- [`../../ENV-REFERENCE.md`](../../ENV-REFERENCE.md)
