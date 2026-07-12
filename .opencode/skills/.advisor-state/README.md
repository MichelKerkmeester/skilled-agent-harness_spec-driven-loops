---
title: "Skill Advisor Runtime State"
description: "Runtime generation and daemon lease data for the Skill Advisor."
trigger_phrases:
  - "skill advisor runtime state"
  - "advisor generation metadata"
  - "skill graph daemon lease"
version: 1.0.0.0
---

# Skill Advisor Runtime State

> This folder stores machine-specific state used by the Skill Advisor plugin and its supporting daemon.

---

## 1. OVERVIEW

The [`mk-skill-advisor.js`](../../plugins/mk-skill-advisor.js) plugin invokes the Skill Advisor bridge and uses the advisor source state when it builds cache signatures. The supporting Skill Advisor server reads and writes generation metadata and manages the SQLite daemon lease.

The `skill-graph-daemon-lease.sqlite` file here holds two tables. Its `skill_graph_daemon_lease` table is a legacy fallback location, because the active daemon lease now lives under [`system-skill-advisor/mcp_server/database/`](../system-skill-advisor/mcp_server/database/). The advisor watcher uses this same file as the default store for its `quarantined_skill` table.

The raw runtime data in this folder is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving machine-specific state.

---

## 2. STRUCTURE

```text
.advisor-state/
+-- README.md
+-- skill-graph-daemon-lease.sqlite
+-- skill-graph-daemon-lease.sqlite-shm
+-- skill-graph-daemon-lease.sqlite-wal
+-- skill-graph-generation.json
+-- skill-graph-generation.json.<pid>.<timestamp>.tmp
`-- skill-graph-generation.json.lock
```

| Path | Shape and Purpose |
|---|---|
| `README.md` | Tracked documentation for this runtime-state folder. |
| `skill-graph-daemon-lease.sqlite` | SQLite database holding two tables. The legacy-fallback `skill_graph_daemon_lease` table stores `workspace_key`, `owner_id`, `pid`, `acquired_at` and `heartbeat_at`. The active `quarantined_skill` table records skills the watcher isolated after a load failure. Both schemas appear below. |
| `skill-graph-daemon-lease.sqlite-shm` | SQLite shared-memory file created while the lease database uses WAL mode. |
| `skill-graph-daemon-lease.sqlite-wal` | SQLite write-ahead log created while the lease database uses WAL mode. |
| `skill-graph-generation.json` | Generation metadata with `generation`, `updatedAt`, nullable `sourceSignature`, `reason` and `state`. Valid states are `live`, `stale`, `absent` and `unavailable`. |
| `skill-graph-generation.json.<pid>.<timestamp>.tmp` | Temporary file used during an atomic generation metadata write. A successful write renames it to `skill-graph-generation.json`. |
| `skill-graph-generation.json.lock` | Transient publication lock containing the process ID, acquisition time and a random ownership token. |

Example generation metadata:

```json
{
  "generation": 11288,
  "updatedAt": "2026-07-12T08:06:12.853Z",
  "sourceSignature": "9c09011fb7eb55ef4bd76f40a575c8928c7e9484a76603b69b14ebfde01c0188",
  "reason": "advisor-server-startup-scan",
  "state": "live"
}
```

The legacy lease table uses this schema:

```sql
CREATE TABLE skill_graph_daemon_lease (
  workspace_key TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  pid INTEGER NOT NULL,
  acquired_at INTEGER NOT NULL,
  heartbeat_at INTEGER NOT NULL
);
```

The active quarantine table uses this schema:

```sql
CREATE TABLE quarantined_skill (
  skill_slug TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  reason TEXT NOT NULL,
  quarantined_at TEXT NOT NULL,
  recovered_at TEXT
);
```

---

## 3. LIFECYCLE

The Skill Advisor increments `generation` after a successful graph update and publishes the metadata through an atomic temporary-file rename. It removes the temporary file when a handled write fails. An interrupted process can leave a temporary file behind.

The daemon lease uses SQLite WAL mode. A lease owner updates `heartbeat_at` while it remains active and deletes its row when it releases the lease. Another process can reclaim a lease after its heartbeat becomes stale.

The advisor watcher inserts a `quarantined_skill` row when a skill fails to load and sets `recovered_at` once the skill returns to service. An active quarantine keeps `recovered_at` null.

Do not edit, archive or copy these files between machines. Stop the related daemon before removing stale lease files. The Skill Advisor recreates required runtime state when it starts or republishes its graph.

---

## 4. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`mk-skill-advisor.js`](../../plugins/mk-skill-advisor.js) | OpenCode plugin that requests Skill Advisor briefs and tracks advisor source signatures. |
| [`generation.ts`](../system-skill-advisor/mcp_server/lib/freshness/generation.ts) | Reads, validates and atomically publishes generation metadata. |
| [`generation-metadata.ts`](../system-skill-advisor/mcp_server/schemas/generation-metadata.ts) | Defines the generation metadata schema. |
| [`lease.ts`](../system-skill-advisor/mcp_server/lib/daemon/lease.ts) | Defines the daemon lease database, heartbeat and release behavior, including the legacy `.advisor-state` fallback path. |
| [`watcher.ts`](../system-skill-advisor/mcp_server/lib/daemon/watcher.ts) | Defines the `quarantined_skill` table and its default location in this folder. |
