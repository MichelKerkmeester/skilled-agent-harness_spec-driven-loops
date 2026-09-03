---
title: "Handlers"
description: "Spec-document discovery and the per-spec-folder mutex used by the save path."
trigger_phrases:
  - "spec document discovery"
  - "spec folder mutex"
  - "findSpecDocuments"
---

# Handlers

---

## 1. OVERVIEW

`handlers/` holds two filesystem-facing modules that other layers depend on but that do not belong inside `lib/`.

Current state:

- `memory-index-discovery.ts` walks a workspace to find canonical spec documents, detect a folder's level, and locate `graph-metadata.json` files.
- `save/spec-folder-mutex.ts` serializes work per spec folder across async chains and across processes.
- Both are reached from `api/index.ts` or through the `lib/discovery/spec-document-finder.ts` seam. `lib/` code imports the seam rather than reaching sideways into this folder.
- Discovery stays local rather than shared on purpose: it only walks the filesystem, and importing a shared formatter would make it depend on a much wider layer.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            HANDLERS                              │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌──────────────────────────┐
│ api/           │ ───▶ │ save/spec-folder-mutex.ts│
│ index.ts       │      │ interprocess lock        │
└────────────────┘      └──────────────────────────┘

┌────────────────┐      ┌──────────────────────────┐      ┌───────────────┐
│ api/           │ ───▶ │ memory-index-discovery.ts│ ───▶ │ filesystem    │
│ graph-refresh  │      │ document + level walk    │      │ spec folders  │
└────────────────┘      └────────────┬─────────────┘      └───────────────┘
                                     ▲
                        ┌────────────┴─────────────┐
                        │ lib/discovery/           │
                        │ spec-document-finder.ts  │
                        └──────────────────────────┘

Dependency direction: api and the lib seam ───▶ handlers ───▶ filesystem.
Handlers import lib support modules; lib never imports handlers except through the seam.
```

---

## 3. DIRECTORY TREE

```text
mcp-server/handlers/
├── memory-index-discovery.ts   # Spec document discovery and spec-level detection
├── save/                       # Per-spec-folder save lock
└── README.md
```

---

## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `memory-index-discovery.ts` | Exports `findSpecDocuments()`, `detectSpecLevel()` and `findGraphMetadataFiles()`, plus the `SpecDiscoveryOptions`, `DiscoveryFileList` and `DiscoveryCapExceeded` types. The returned list carries a cap-exceeded marker so a caller can tell a truncated walk from a complete one. |
| `save/` | The per-spec-folder mutex. See `save/README.md`. |

Canonical spec-document discovery covers the filenames named in `../lib/config/spec-doc-paths.ts`. `graph-metadata.json` is located through the graph-metadata path gate rather than the document filename set.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public surface | External callers reach these modules through `api/index.ts` and `api/graph-refresh.ts`, never by importing `handlers/` directly. |
| Lib callers | `lib/` code imports `lib/discovery/spec-document-finder.ts`, which re-exports the discovery function unchanged. |
| Dependencies | Handlers may import `lib/` support modules such as `lib/utils/index-scope.ts` and `lib/config/spec-doc-paths.ts`. |
| Locking | Any writer that must not race a second writer on the same folder wraps its critical section in `withSpecFolderLock()`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ api/graph-refresh resolves a spec folder │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ findSpecDocuments walks the workspace    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ index-scope invariants filter the walk   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ document list, level, or metadata paths  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `findSpecDocuments()` | Function | Lists canonical spec documents under a workspace, honoring the discovery cap. |
| `detectSpecLevel()` | Function | Derives a folder's level from its documents. |
| `findGraphMetadataFiles()` | Function | Lists `graph-metadata.json` paths under a workspace. |
| `withSpecFolderLock()` | Function | Wraps a critical section with a per-spec-folder mutex. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp-server` unless noted.

```bash
npx vitest run tests/architecture-seam.vitest.ts tests/index-scope.vitest.ts tests/spec-folder-mutex-liveness.vitest.ts
```

Expected result: the seam, index-scope and lock-liveness suites exit with Vitest success.

---

## 8. RELATED

- [`save/README.md`](./save/README.md)
- [`../api/README.md`](../api/README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../core/README.md`](../core/README.md)
