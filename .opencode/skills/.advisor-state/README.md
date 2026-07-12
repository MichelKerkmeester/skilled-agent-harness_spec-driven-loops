---
title: "Skill Advisor Runtime State"
description: "Runtime freshness, quarantine and legacy daemon lease state for the Skill Advisor workflow."
trigger_phrases:
  - "skill advisor runtime state"
  - "advisor generation metadata"
  - "skill graph daemon lease"
version: 1.0.0.1
---

# Skill Advisor Runtime State

> This folder stores machine-specific state used by the Skill Advisor plugin and its supporting daemon.

---

## 1. OVERVIEW

The [`mk-skill-advisor.js`](../../plugins/mk-skill-advisor.js) OpenCode plugin requests a Skill Advisor brief for a user prompt before the model runs. It sends the prompt and routing thresholds to the advisor bridge, injects the returned brief into system context and falls back to a fixed safety directive when the advisor cannot return a brief. This prompt-time routing supports Gate 2, where the advisor recommends a matching skill before that skill handles the task.

The plugin keeps its prompt cache in memory. Its cache key includes the session, prompt, thresholds, workspace and a source signature computed from advisor implementation files, skill metadata and graph artifacts. That signature invalidates cached recommendations when the routing inputs change. The plugin does not read or write `.advisor-state` directly. The related [`system-skill-advisor`](../system-skill-advisor/SKILL.md) server and daemon own the state documented here, while the plugin reaches that logic through the [`mk-skill-advisor-bridge.mjs`](../system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs) bridge.

The bridge probes advisor status before it builds a native brief. Status combines the generation metadata in this folder with the skill graph database and source files to report freshness and trust. A usable graph can still serve recommendations when daemon evidence is unavailable if its trust state remains `live` or `stale`. In that case the bridge marks the native route as degraded rather than treating the graph as unusable.

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

### 3.1 GENERATION AND FRESHNESS

An explicit `skill_graph_scan`, an advisor rebuild, a server startup scan or a successful watcher reindex can publish generation metadata. The publisher reads the current generation, increments it and records the update time, source signature, reason and state. It then invalidates skill graph caches with the new generation and changed paths.

Publication uses a token-owned lock and an atomic temporary-file rename. The lock prevents concurrent publishers from entering the update at the same time. A publisher only removes a lock when the persisted random token still matches its own token. It can reclaim a lock older than 30 seconds and waits up to 250 milliseconds for a live lock. The writer flushes the temporary file, renames it to `skill-graph-generation.json` and flushes the containing directory. It removes the temporary file when a handled write fails. An interrupted process can leave a temporary file behind.

The status handler reads this file but does not rebuild it. A missing file produces generation `0`, the Unix epoch timestamp, a null source signature, reason `GENERATION_ABSENT` and state `absent`. The handler compares the stored source signature with the current advisor sources. It can also downgrade reported freshness when source metadata is newer than the graph database or when an optional integrity check detects genuine database corruption.

The four generation states describe artifact freshness:

| State | Meaning in the Runtime |
|---|---|
| `live` | A publisher reports current usable graph state. Status can still downgrade the reported freshness when physical source or integrity evidence disagrees. |
| `stale` | The graph exists but source-change evidence says it needs a rebuild or reindex. |
| `absent` | No generation metadata file exists. |
| `unavailable` | The publisher reports that the daemon or graph update path is not available, including terminal daemon shutdown publication. |

Freshness and caller trust are separate outputs. Freshness comes from this generation record plus physical source and artifact checks. Trust state also considers whether sources and graph artifacts exist and whether daemon evidence supports use.

### 3.2 DAEMON LEASE

The daemon lease uses SQLite WAL mode. A lease owner updates `heartbeat_at` while it remains active and deletes its row when it releases the lease. Another process can reclaim a lease after its heartbeat becomes stale.

New lease acquisitions default to `system-skill-advisor/mcp_server/database/skill-graph-daemon-lease.sqlite`. A caller can override that database path. Lease status also checks the `.advisor-state` database when no override is present, but only as a legacy fallback after the active path does not show a held lease. The active database uses its containing directory as `workspace_key`. The legacy lookup uses the workspace root.

The lease prevents two watcher daemons from owning the same workspace database. The default heartbeat interval is 5 seconds and the default stale threshold is 30 seconds. On stale takeover, daemon startup publishes `unavailable` before watcher creation and `live` after the watcher starts. During shutdown, the daemon suppresses watcher generation writes, drains pending work, closes the watcher, publishes a terminal `unavailable` generation and releases the lease.

### 3.3 WATCHING AND QUARANTINE

The daemon watcher discovers each visible skill's `SKILL.md`, `graph-metadata.json` and existing files named by `derived.key_files`. It can also include eligible documentation frontmatter files when document trigger harvesting is enabled. File additions, changes and removals enter a per-skill queue. The watcher debounces events, retries SQLite busy failures and reindexes changed skills before it publishes a new `live` generation with a current source signature.

Before reindexing, the watcher checks that an existing `SKILL.md` starts with frontmatter containing both `name` and `description`. A malformed file causes the watcher to insert or replace a `quarantined_skill` row with reason `MALFORMED_SKILL_MD`. The watcher skips that skill's reindex. Once the file passes the check again, the watcher sets `recovered_at` for its active row and resumes normal processing. An active quarantine keeps `recovered_at` null, and daemon status counts only those active rows.

The `.advisor-state` SQLite file remains the default active quarantine store even though its lease table is only a legacy fallback. This split is intentional in the current code and explains why the database can still change on an active installation that keeps its daemon lease under `mcp_server/database/`.

### 3.4 OPERATOR BOUNDARY

Do not edit, archive or copy these files between machines. Stop the related daemon before removing stale lease files. The Skill Advisor recreates required runtime state when it starts or republishes its graph.

---

## 4. SYSTEM FLOW

```text
user prompt
  |
  +-- mk-skill-advisor.js OpenCode system transform
        |
        +-- in-memory cache keyed by prompt and advisor source signature
        |
        `-- mk-skill-advisor-bridge.mjs
              |
              +-- advisor_status reads generation and graph health
              |
              `-- advisor_recommend scores the prompt against the skill graph
                    |
                    `-- Gate 2 brief names the skill to invoke

skill source change
  |
  +-- daemon watcher validates and reindexes the affected skill
  |     |
  |     +-- malformed SKILL.md -> quarantined_skill row
  |     `-- valid update -> live generation publication
  |
  `-- generation publication invalidates skill graph caches
```

The standalone `mk_skill_advisor` MCP server exposes advisor and skill graph tools. `advisor_recommend` supplies prompt-time recommendations. `advisor_status` reads this generation state for diagnostics, and `advisor_rebuild` or `skill_graph_scan` can publish a fresh generation after updating the graph. The watcher handles ongoing source changes without requiring the prompt plugin to manage files or daemon ownership.

This state supports routing but does not replace the recommended skill. For example, the advisor can recommend `sk-doc` for documentation work, then the caller loads and follows that skill. The state files make graph freshness, single-writer ownership and failed skill loading visible to the routing layer.

---

## 5. FAILURE AND RECOVERY

| Condition | Runtime Behavior |
|---|---|
| Generation file is missing | The reader returns an `absent` snapshot at generation `0`. |
| Generation JSON is invalid | Schema parsing fails instead of accepting an unknown shape. |
| Generation lock is stale | A publisher verifies the incumbent token before reclaiming the lock. |
| Daemon lease heartbeat is stale | A new owner can reclaim the lease and records the takeover through generation state changes. |
| `SKILL.md` frontmatter is malformed | The watcher quarantines the skill and skips its reindex. |
| Quarantined skill becomes valid | The watcher records `recovered_at` and reindexes changed content. |
| Daemon shuts down | The lifecycle drains watcher work, publishes `unavailable` and releases its lease. |
| Plugin bridge fails or returns no brief | The OpenCode plugin fails open by injecting its fixed fallback directive. |

---

## 6. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`mk-skill-advisor.js`](../../plugins/mk-skill-advisor.js) | OpenCode plugin that requests Skill Advisor briefs and tracks advisor source signatures. |
| [`system-skill-advisor/SKILL.md`](../system-skill-advisor/SKILL.md) | Gate 2 routing contract and standalone advisor MCP overview. |
| [`mk-skill-advisor-bridge.mjs`](../system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs) | Connects the OpenCode plugin to advisor status and recommendation handlers. |
| [`generation.ts`](../system-skill-advisor/mcp_server/lib/freshness/generation.ts) | Reads, validates and atomically publishes generation metadata. |
| [`generation-metadata.ts`](../system-skill-advisor/mcp_server/schemas/generation-metadata.ts) | Defines the generation metadata schema. |
| [`lease.ts`](../system-skill-advisor/mcp_server/lib/daemon/lease.ts) | Defines the daemon lease database, heartbeat and release behavior, including the legacy `.advisor-state` fallback path. |
| [`watcher.ts`](../system-skill-advisor/mcp_server/lib/daemon/watcher.ts) | Defines the `quarantined_skill` table and its default location in this folder. |
| [`watcher-orchestrator.ts`](../system-skill-advisor/mcp_server/lib/daemon/watcher-orchestrator.ts) | Validates changed skills, controls quarantine recovery, reindexes and publishes watcher generations. |
| [`lifecycle.ts`](../system-skill-advisor/mcp_server/lib/daemon/lifecycle.ts) | Coordinates lease ownership, watcher startup, stale takeover and terminal shutdown state. |
