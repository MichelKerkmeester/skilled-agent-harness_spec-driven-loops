---
title: "Shared MCP Server Database Directory"
description: "Runtime database directory used by shared MCP server path and embedding helpers."
trigger_phrases:
  - "shared database directory"
  - "sqlite database location"
  - "context index database"
---

# Shared MCP Server Database Directory

---

## 1. OVERVIEW

`shared/mcp_server/database/` is a runtime storage directory used by shared MCP server helpers and tests that resolve database paths through the shared package. It is a data directory, not a source module folder.

Current responsibilities:

- Hold runtime SQLite files when shared-package path resolution targets this location.
- Hold test database fixtures when a shared-package test needs a concrete database file.
- Provide `.db-updated` for refresh detection through shared config exports.

---

## 2. ARCHITECTURE

```text
shared/config.ts and shared/paths.ts
        │
        ▼
shared/mcp_server/database/
        │
        +--> .db-updated marker
        +--> test database fixtures when present
        `--> generated SQLite files when this path is active
```

---

## 3. PACKAGE TOPOLOGY

```text
database/
+-- README.md                  # Directory guide
+-- .db-updated                # Runtime update marker
`-- test-context-index.sqlite  # Shared-package test fixture when present
```

Generated SQLite files and sidecars are runtime artifacts. They are not source modules.

---

## 4. DIRECTORY TREE

```text
database/
+-- README.md
+-- .db-updated
+-- test-context-index.sqlite
+-- *.sqlite        # Generated runtime databases or test fixtures
+-- *.db            # Generated runtime databases
+-- *-wal           # Generated SQLite write-ahead logs
`-- *-shm           # Generated SQLite shared-memory files
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `README.md` | Explains the shared database directory contract. |
| `.db-updated` | Stores the last database update timestamp for refresh checks. |
| `test-context-index.sqlite` | Test fixture for shared-package database path behavior when present. |

Do not treat `*-wal` or `*-shm` files as key files. They are SQLite sidecars created and removed by SQLite.

---

## 6. BOUNDARIES AND FLOW

This directory does not own schema code, embedding generation or index scan logic. Those responsibilities live in shared helpers, MCP server modules and scripts.

Main flow:

```text
shared config -> resolved database path -> SQLite file read or write -> .db-updated marker -> caller refresh check
```

Keep runtime database files out of source inventories unless they are named test fixtures with a clear purpose.

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/shared/mcp_server/database/README.md
```

For code changes that affect this path, run the shared package tests that cover `shared/config.ts`, `shared/paths.ts` and embedding profile path resolution.

---

## 8. RELATED

- [shared/config.ts](../../config.ts)
- [shared/paths.ts](../../paths.ts)
- [shared/embeddings/profile.ts](../../embeddings/profile.ts)
- [shared/embeddings/README.md](../../embeddings/README.md)
