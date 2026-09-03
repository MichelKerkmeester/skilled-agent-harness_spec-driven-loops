---
title: "Storage Layer: Atomic Writes and Drift Markers"
description: "Code-folder guide for the atomic file-write helpers and the drift-marker contract the git hooks write against."
trigger_phrases:
  - "storage layer"
  - "atomic write"
  - "pending file recovery"
  - "drift marker"
---

# Storage Layer: Atomic Writes and Drift Markers

> Atomic file writes with pending-file recovery, and the drift-marker contract shared with the git hooks.

---

## 1. OVERVIEW

`lib/storage/` holds the package's durability primitives. Both modules exist because a write that fails halfway is worse than a write that never started: one leaves a caller believing a file is current when it is not.

Current responsibilities:

- Write files atomically through a pending-file and promotion sequence, with recovery for pending files a crash left behind.
- Own the drift-marker contract: the marker filename, its payload shape, its parser, and the entry key that identifies one dirty path.
- Own the drift-suspect queue helpers that read, append to, and remove from the bounded queue.
- Stay importable from the lightest possible caller. `api/index.ts` re-exports both modules for the git-hook drift-marker writer, which must not pull in a domain layer to write one marker file.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         LIB / STORAGE                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ api/index.ts     │ ───▶ │ transaction-     │ ───▶ │ pending file →   │
│ git-hook writer  │      │ manager.ts       │      │ promoted file    │
└────────┬─────────┘      └────────┬─────────┘      └──────────────────┘
         │                         │
         │                         ▼
         │               ┌──────────────────┐
         │               │ recovery scan    │
         │               │ for stale pending│
         │               └──────────────────┘
         │
         ▼
┌──────────────────┐      ┌──────────────────┐
│ memory-drift-    │ ───▶ │ marker payload   │
│ healing.ts       │      │ + suspect queue  │
└──────────────────┘      └──────────────────┘

Dependency direction:
api ───▶ lib/storage ───▶ core/config and the filesystem
lib/storage imports no domain module and builds no response.
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/storage/
+-- transaction-manager.ts     # Atomic write, promotion and pending-file recovery
+-- memory-drift-healing.ts    # Drift-suspect queue and marker parsing
`-- README.md
```

Allowed dependency direction:

```text
api/index.ts → lib/storage
lib/storage → core/config
lib/storage → node builtins and the SQLite handle a caller passes in
```

Disallowed dependency direction:

```text
lib/storage → lib/validation, lib/graph or lib/search
lib/storage → handlers/ or api/
lib/storage → spec packet files
```

---

## 4. DIRECTORY TREE

```text
lib/storage/
+-- memory-drift-healing.ts
+-- transaction-manager.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `transaction-manager.ts` | Atomic file operations and their recovery path. Exposes `atomicWriteFile()`, `executeAtomicSave()`, `deleteFileIfExists()` and `runInTransaction()`; the path helpers `getPendingPath()`, `isPendingFile()` and `getOriginalPath()` around the `PENDING_SUFFIX` / `TEMP_SUFFIX` convention; the recovery scan `findPendingFiles()`, `recoverPendingFile()` and `recoverAllPendingFiles()`; and `getMetrics()` / `resetMetrics()`. |
| `memory-drift-healing.ts` | The drift contract. `resolveMemoryDriftMarkerPath()` and `MEMORY_DRIFT_MARKER_FILENAME` locate the `.memory-drift-dirty-paths.json` marker the git hooks write; `parseMemoryDriftMarker()` reads it; `memoryDriftMarkerEntryKey()` identifies one entry. The queue helpers `readMemoryDriftSuspects()`, `appendMemoryDriftSuspects()` and `removeMemoryDriftSuspects()` operate on a bounded queue capped at `MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE` under the `MEMORY_DRIFT_SUSPECT_QUEUE_KEY` config key. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Storage helpers depend on Node builtins, `core/config`, and a database handle the caller supplies. They never open their own connection. |
| Exports | Each module exposes focused helpers. There is no folder-level barrel. |
| Response boundary | Storage modules must not build response envelopes or format output. |
| Atomicity | A write that must not be observed half-finished goes through the pending-file path, not a direct write. |
| Queue bounds | The suspect queue is capped. Appends past the cap drop rather than growing without limit. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ caller requests an atomic write           │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ write to the pending path                 │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ promote pending over the original         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ on failure, roll back and leave the       │
│ original intact                           │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ a later recovery scan resolves any        │
│ pending file a crash left behind          │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `atomicWriteFile()` | Function | Writes a file through the pending-and-promote sequence. |
| `executeAtomicSave()` | Function | Runs a caller's save around the atomic wrapper. |
| `getPendingPath()` | Function | Builds the pending path for an original path. |
| `recoverAllPendingFiles()` | Function | Resolves pending files left behind by an interrupted write. |
| `resolveMemoryDriftMarkerPath()` | Function | Locates the drift marker for a given database path. |
| `parseMemoryDriftMarker()` | Function | Parses a marker payload, returning `null` on malformed input. |
| `memoryDriftMarkerEntryKey()` | Function | Produces the stable key for one marker entry. |

---

## 8. VALIDATION

Run from the repository root unless noted.

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run typecheck
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp-server/lib/storage/README.md
```

Expected result: typecheck exits 0, and the document is detected as a README with no critical section or HVR issues.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../../api/README.md`](../../api/README.md)
- [`../../handlers/save/README.md`](../../handlers/save/README.md)
- [`../../core/README.md`](../../core/README.md)
