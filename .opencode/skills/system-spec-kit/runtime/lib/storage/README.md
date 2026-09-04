---
title: "Storage Layer: Atomic Writes"
description: "Code-folder guide for the atomic file-write helpers and their pending-file recovery path."
trigger_phrases:
  - "storage layer"
  - "atomic write"
  - "pending file recovery"
  - "atomic save transaction"
---

# Storage Layer: Atomic Writes

> Atomic file writes with recovery for pending files an interrupted write left behind.

---

## 1. OVERVIEW

`lib/storage/` holds the package's durability primitives. The module exists because a write that fails halfway is worse than a write that never started: one leaves a caller believing a file is current when it is not.

Current responsibilities:

- Write files atomically through a pending-file and promotion sequence, with recovery for pending files a crash left behind.
- Expose transaction metrics so a caller can observe write volume and recovery activity.
- Stay importable from the lightest possible caller: the helpers take a caller-supplied path and never reach into a domain layer.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         LIB / STORAGE                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ calling module   │ ───▶ │ transaction-     │ ───▶ │ pending file →   │
│                  │      │ manager.ts       │      │ promoted file    │
└──────────────────┘      └────────┬─────────┘      └──────────────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │ recovery scan    │
                          │ for stale pending│
                          └──────────────────┘

Dependency direction:
caller ───▶ lib/storage ───▶ core/config and the filesystem
lib/storage imports no domain module and builds no response.
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/storage/
+-- transaction-manager.ts     # Atomic write, promotion and pending-file recovery
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
+-- transaction-manager.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `transaction-manager.ts` | Atomic file operations and their recovery path. Exposes `atomicWriteFile()`, `executeAtomicSave()`, `deleteFileIfExists()` and `runInTransaction()`; the path helpers `getPendingPath()`, `isPendingFile()` and `getOriginalPath()` around the `PENDING_SUFFIX` / `TEMP_SUFFIX` convention; the recovery scan `findPendingFiles()`, `recoverPendingFile()` and `recoverAllPendingFiles()`; and `getMetrics()` / `resetMetrics()`. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Storage helpers depend on Node builtins, `core/config`, and a database handle the caller supplies. They never open their own connection. |
| Exports | The module exposes focused helpers. There is no folder-level barrel. |
| Response boundary | Storage modules must not build response envelopes or format output. |
| Atomicity | A write that must not be observed half-finished goes through the pending-file path, not a direct write. |

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
| `runInTransaction()` | Function | Runs a caller's unit of work inside the transaction wrapper. |
| `getMetrics()` | Function | Reports write and recovery counters for the current process. |

---

## 8. VALIDATION

Run from the repository root unless noted.

```bash
npm --prefix .opencode/skills/system-spec-kit/runtime run typecheck
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/runtime/lib/storage/README.md
```

Expected result: typecheck exits 0, and the document is detected as a README with no critical section or HVR issues.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../../api/README.md`](../../api/README.md)
- [`../../handlers/save/README.md`](../../handlers/save/README.md)
- [`../../core/README.md`](../../core/README.md)
