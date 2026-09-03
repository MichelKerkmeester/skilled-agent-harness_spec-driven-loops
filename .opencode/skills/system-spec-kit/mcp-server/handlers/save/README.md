---
title: "Save Handler: Spec Folder Mutex"
description: "Code-folder guide for the per-spec-folder save lock that serializes in-process and interprocess writers."
trigger_phrases:
  - "save handler"
  - "spec folder mutex"
  - "withSpecFolderLock"
  - "interprocess lock"
---

# Save Handler: Spec Folder Mutex

> The per-spec-folder lock that keeps two writers from racing the same packet.

---

## 1. OVERVIEW

`handlers/save/` owns the save-path mutex. A spec folder can be written by more than one caller at a time — two processes running a generator, a git hook firing beside an interactive session — and the resulting time-of-check-to-time-of-use race silently loses whichever write lands second. This folder is the one guard against that.

Current responsibilities:

- Serialize same-folder writes through `withSpecFolderLock()`, across both in-process async chains and separate processes.
- Hold interprocess locks as directories under the OS temp root, with heartbeat refresh and stale reclamation so a crashed owner does not wedge the folder forever.
- Expose the lock primitives through `api/index.ts` for the git-hook drift-marker writer, which needs them without importing the rest of the package.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         HANDLERS / SAVE                          │
╰──────────────────────────────────────────────────────────────────╯

┌─────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ in-process      │ ───▶ │ SPEC_FOLDER_LOCKS│ ───▶ │ serialized async │
│ caller          │      │ promise chain    │      │ critical section │
└─────────────────┘      └────────┬─────────┘      └──────────────────┘
                                  │
                                  ▼
┌─────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ separate        │ ───▶ │ lock directory   │ ───▶ │ heartbeat +      │
│ process         │      │ under tmpdir     │      │ stale reclaim    │
└─────────────────┘      └──────────────────┘      └──────────────────┘

Dependency direction:
api/index.ts ───▶ handlers/save/spec-folder-mutex.ts ───▶ filesystem
handlers/save imports no lib domain module and builds no response envelope.
```

---

## 3. PACKAGE TOPOLOGY

```text
handlers/save/
+-- spec-folder-mutex.ts   # In-process and interprocess save lock
`-- README.md
```

Allowed dependency direction:

```text
api/index.ts → handlers/save
handlers/save → node:fs, node:os, node:path, node:crypto
```

Disallowed dependency direction:

```text
lib/* → handlers/save
handlers/save → lib domain modules
handlers/save → spec packet files
```

---

## 4. DIRECTORY TREE

```text
handlers/save/
+-- spec-folder-mutex.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `spec-folder-mutex.ts` | Serializes work per spec folder. `withSpecFolderLock()` chains in-process callers through the `SPEC_FOLDER_LOCKS` map; the interprocess helpers create, refresh, reclaim and release lock directories under a dedicated save-lock root inside the OS temp directory, resolved by `getLockDir()`. Also exports `getLockOwnerState`, `LOCK_STALE_MS` and `LOCK_HEARTBEAT_MS` for targeted lock-liveness tests; those are not part of the save-flow API. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The mutex depends on Node builtins only. Adding a domain dependency here would make the lock unavailable to the lightweight callers that need it most. |
| Exports | `api/index.ts` re-exports the interprocess helpers and `InterprocessLockHandle`. In-package callers import the module directly. |
| Concurrency | A writer that mutates a spec folder runs inside `withSpecFolderLock()` before it touches the filesystem. |
| Staleness | A lock older than `LOCK_STALE_MS` without a heartbeat is reclaimable. Reclamation is explicit, never implicit in the acquire path. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ caller names a spec folder                │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ normalize the folder into a lock key      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ chain behind any in-process holder        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ acquire or reclaim the lock directory     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ run the critical section; heartbeat       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ release the lock, in-process and on disk  │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `withSpecFolderLock()` | Function | Wraps a critical section with a per-spec-folder mutex. |
| `createInterprocessLock()` | Function | Acquires the on-disk lock directory for a folder. |
| `releaseInterprocessLock()` | Function | Releases a held lock handle. |
| `isReclaimableLock()` | Function | Reports whether an existing lock is stale enough to take over. |
| `reclaimInterprocessLock()` | Function | Takes over a stale lock explicitly. |

---

## 8. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp-server` unless noted.

```bash
npx vitest run tests/spec-folder-mutex-liveness.vitest.ts
```

Documentation check from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp-server/handlers/save/README.md
```

Expected result: the lock-liveness suite passes, and the document is detected as a README with no critical section or HVR issues.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../../api/README.md`](../../api/README.md)
- [`../../lib/storage/README.md`](../../lib/storage/README.md)
