---
title: "Skill Graph Drift Reconciliation"
description: "How to detect plus reconcile drift between the SQLite skill graph state and the live .skilled/skills/*/graph-metadata.json source files."
trigger_phrases:
  - "skill graph drift"
  - "graph-metadata reconciliation"
  - "skill graph rebuild"
importance_tier: "normal"
contextType: "implementation"
version: 0.8.5.0
---

# Skill Graph Drift Reconciliation

Open this when status output looks stale or a metadata edit never reaches query results, and follow the rebuild sequence back to a consistent graph.

---

## 1. OVERVIEW

### Purpose

Keep the SQLite graph the advisor scores from in step with the metadata files it is built from.

### When to Use

- `advisor_status`, `skill_graph_status` or `skill_graph_validate` reports stale or inconsistent graph state.
- A skill metadata edit is not reflected in query results.
- Operators need a rebuild sequence after source or database drift.

### Core Principle

The SQLite graph is rebuildable runtime state; checked-in skill metadata remains the authored source of truth.

### Key Sources

- [`freshness-contract.md`](../runtime/freshness-contract.md)
- [`daemon-lease-contract.md`](../runtime/daemon-lease-contract.md)
- [`skill-graph-query-cookbook.md`](./skill-graph-query-cookbook.md)

---

## 2. DRIFT SOURCES

The SQLite graph drifts from the source files when any of these happen:

1. **Skill added**: a new `.skilled/skills/<name>/graph-metadata.json` appears on disk that the SQLite graph has not indexed yet.
2. **Skill removed**: a skill directory is deleted but the SQLite graph still has rows for it.
3. **Edge mutated**: an existing graph-metadata.json file changes its `edges.depends_on[]`, `edges.enhances[]` or `edges.conflicts[]` arrays but the SQLite graph holds stale edge rows.
4. **Schema bump**: the SQLite `SCHEMA_VERSION` rises above the version an existing database file was built at. The database layer deletes that file with its sidecars when it opens it, and the next scan rebuilds every row from source. A graph-metadata.json `schema_version` of 1 or 2 is read as is, so a JSON version bump alone is no drift.
5. **Hash drift**: any file under `.skilled/skills/*/graph-metadata.json`, `.skilled/skills/*/SKILL.md` or `.skilled/skills/*/ROUTER.md` (where the skill carries one) changes, computed via SHA-256 hash. The daemon watches for hash changes per `freshness-contract.md` §5.

---

## 3. DETECTION

### Via `skill_graph_status`

```bash
node .skilled/bin/skill-advisor.cjs skill_graph_status --format json
```

Inspect:
- `staleness.detectedAt` (ISO timestamp of last hash drift)
- `staleness.changedFiles[]` (array of source files that changed)
- `lastIndexedAt` (when SQLite was last rebuilt)
- `dbStatus` (`live`, `stale`, `absent`, `unavailable`)

If `dbStatus` is `stale` or `staleness.changedFiles[]` is non-empty, drift is present.

### Via `skill_graph_validate`

```bash
node .skilled/bin/skill-advisor.cjs skill_graph_validate --format json
```

Returns structural integrity checks:
- `isValid` (boolean)
- `errors[]` (broken edges, schema violations, dependency cycles)
- `warnings[]` (missing reciprocals, asymmetric edges)
- `checkedNodes`, `checkedEdges` (counts)

A `false` for `isValid` plus broken-edge errors signal drift between SQLite graph plus source files.

### Manual hash diff

```bash
find .skilled/skills -name 'graph-metadata.json' -exec sha256sum {} + | sort
```

Compare against the daemon's recorded signature stored alongside `runtime/database/.skill-graph.sig`. Mismatches indicate drift.

---

## 4. RECONCILIATION

The CLI refuses a mutation unless `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1` is supplied, so mutation commands require the maintainer path. The daemon trusts what a caller asserts. A caller that asserts nothing gets `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT`, which the launcher sets to trusted when it starts the daemon.

### Standard reconciliation

```bash
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --format json
```

Forces a full rebuild from source files. Generation counter bumps. Trust state transitions stale → live.

### Index-only reconciliation

If you only want to re-index without bumping generation (advanced):

```bash
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --json '{"skillsRoot":".skilled/skills"}' --format json
```

Re-indexes the graph from source plus updates the hash signature.

### Hard reset

If `advisor_rebuild` plus `skill_graph_scan` both fail:

```bash
# Stop the advisor daemon first to release the lease
# Then:
rm -f .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite{,-wal,-shm}
rm -f .skilled/skills/system-skill-advisor/runtime/database/.skill-graph.sig
rm -f .skilled/skills/system-skill-advisor/runtime/database/.skill-graph.lease
# The next CLI call cold-starts the daemon, which recreates it from scratch.
```

After hard reset, verify with `advisor_status` plus `skill_graph_validate` before trusting recommendations.

---

## 5. FAILURE MODES

| Failure | Symptom | Recovery |
|---|---|---|
| Rebuild succeeds but trustState stays stale | Generation counter not bumping | Inspect `advisor_status.generation`. If frozen, stop the daemon and let the next CLI call cold-start it. File a bug if reproducible |
| Source files unreadable (permission error) | `advisor_rebuild` errors with EACCES | Fix filesystem permissions on `.skilled/skills/*/graph-metadata.json`. The daemon needs read access |
| SQLite corruption mid-rebuild | `dbStatus` flips to `absent` after rebuild | Run hard reset procedure (§4) |
| Database built at an older schema version | The daemon logs `Discarded a schema version N database; the next scan rebuilds it`, and the graph holds no rows until a scan runs | Nothing is migrated: the outdated file and its sidecars are deleted on open. Run `advisor_rebuild --force` to rescan now, which rebuilds every row from `graph-metadata.json` |
| Hash signature corruption | Daemon refuses to detect drift (signature unreadable) | Delete `.skill-graph.sig`. Daemon regenerates on next scan |
| New skill added but never indexed | `skill_graph_query` returns empty for the new skill | Run `skill_graph_scan` manually. If still missing, verify the new graph-metadata.json passes JSON validation |
| Drift after `git pull` brings new graph-metadata.json files | Common after upstream sync | Run `advisor_rebuild --force` once after `git pull` to re-sync |
| Watcher fires repeatedly on the same file | Some editor saves trigger multiple change events | Daemon debounces (configurable). If debounce is too short, increase via `SYSTEM_SKILL_ADVISOR_WATCH_DEBOUNCE_MS` env var |

---

## 6. RELATED

- [`freshness-contract.md`](../runtime/freshness-contract.md), trust state transitions
- [`daemon-lease-contract.md`](../runtime/daemon-lease-contract.md), lease must release cleanly for rebuild
- [`skill-graph-query-cookbook.md`](./skill-graph-query-cookbook.md), query the graph after reconciliation
- [`tool-ids-reference.md`](../runtime/tool-ids-reference.md), `advisor_rebuild`, `skill_graph_scan`, `skill_graph_validate` schemas
- `feature-catalog/daemon-and-freshness/rebuild-from-source.md`, feature inventory
- `runtime/handlers/skill-graph/scan.ts`, `runtime/handlers/advisor-rebuild.ts`, source
