---
title: "Skill Graph Drift Reconciliation"
description: "How to detect plus reconcile drift between the SQLite skill graph state and the live .opencode/skills/*/graph-metadata.json source files."
trigger_phrases:
  - "skill graph drift"
  - "graph-metadata reconciliation"
  - "skill graph rebuild"
importance_tier: "important"
---

# Skill Graph Drift Reconciliation

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

The advisor SQLite skill graph at `mcp_server/database/skill-graph.sqlite` is derived state. The canonical source is the set of `graph-metadata.json` files under `.opencode/skills/*/`. When one of those source files changes, the SQLite graph drifts until the daemon rebuilds. This doc explains how to detect drift, how to reconcile it, plus what to do when reconciliation fails.

Trust state vocabulary plus daemon responsibilities are in [`freshness-contract.md`](./freshness-contract.md). Lease semantics are in [`daemon-lease-contract.md`](./daemon-lease-contract.md).

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-drift-sources -->
## 2. DRIFT SOURCES

The SQLite graph drifts from the source files when any of these happen:

1. **Skill added**: a new `.opencode/skills/<name>/graph-metadata.json` appears on disk that the SQLite graph has not indexed yet.
2. **Skill removed**: a skill directory is deleted but the SQLite graph still has rows for it.
3. **Edge mutated**: an existing graph-metadata.json file changes its `edges.depends_on[]`, `edges.enhances[]` or `edges.conflicts[]` arrays but the SQLite graph holds stale edge rows.
4. **Schema bump**: the JSON schema_version increments (1 → 2) but the SQLite graph still expects v1 fields.
5. **Hash drift**: any file under `.opencode/skills/*/graph-metadata.json` plus `.opencode/skills/*/SKILL.md` changes, computed via SHA-256 hash. The daemon watches for hash changes per `freshness-contract.md` §5.

<!-- /ANCHOR:2-drift-sources -->

---

<!-- ANCHOR:3-detection -->
## 3. DETECTION

### Via `skill_graph_status`

```text
mcp__mk_skill_advisor__skill_graph_status({})
```

Inspect:
- `staleness.detectedAt` (ISO timestamp of last hash drift)
- `staleness.changedFiles[]` (array of source files that changed)
- `lastIndexedAt` (when SQLite was last rebuilt)
- `dbStatus` (`live`, `stale`, `absent`, `unavailable`)

If `dbStatus` is `stale` or `staleness.changedFiles[]` is non-empty, drift is present.

### Via `skill_graph_validate`

```text
mcp__mk_skill_advisor__skill_graph_validate({})
```

Returns structural integrity checks:
- `isValid` (boolean)
- `errors[]` (broken edges, schema violations, dependency cycles)
- `warnings[]` (missing reciprocals, asymmetric edges)
- `checkedNodes`, `checkedEdges` (counts)

A `false` for `isValid` plus broken-edge errors signal drift between SQLite graph plus source files.

### Manual hash diff

```bash
find .opencode/skills -name 'graph-metadata.json' -exec sha256sum {} + | sort
```

Compare against the daemon's recorded signature stored alongside `mcp_server/database/.skill-graph.sig`. Mismatches indicate drift.

<!-- /ANCHOR:3-detection -->

---

<!-- ANCHOR:4-reconciliation -->
## 4. RECONCILIATION

### Standard reconciliation

```text
mcp__mk_skill_advisor__advisor_rebuild({ "force": true })
```

Forces a full rebuild from source files. Generation counter bumps. Trust state transitions stale → live.

### Index-only reconciliation

If you only want to re-index without bumping generation (advanced):

```text
mcp__mk_skill_advisor__skill_graph_scan({ "skillsRoot": ".opencode/skills" })
```

Re-indexes the graph from source plus updates the hash signature.

### Hard reset

If `advisor_rebuild` plus `skill_graph_scan` both fail:

```bash
# Stop MCP server first to release lease
# Then:
rm -f .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite{,-wal,-shm}
rm -f .opencode/skills/system-skill-advisor/mcp_server/database/.skill-graph.sig
rm -f .opencode/skills/system-skill-advisor/mcp_server/database/.skill-graph.lease
# Restart MCP server. Daemon recreates from scratch.
```

After hard reset, verify with `advisor_status` plus `skill_graph_validate` before trusting recommendations.

<!-- /ANCHOR:4-reconciliation -->

---

<!-- ANCHOR:5-failure-modes -->
## 5. FAILURE MODES

| Failure | Symptom | Recovery |
|---|---|---|
| Rebuild succeeds but trustState stays stale | Generation counter not bumping | Inspect `advisor_status.generation`. If frozen, kill MCP server plus restart. File a bug if reproducible |
| Source files unreadable (permission error) | `advisor_rebuild` errors with EACCES | Fix filesystem permissions on `.opencode/skills/*/graph-metadata.json`. The daemon needs read access |
| SQLite corruption mid-rebuild | `dbStatus` flips to `absent` after rebuild | Run hard reset procedure (§4) |
| Schema version mismatch (json v2, SQLite expects v1) | Validate reports schema-violation errors for new skills | Run `advisor_rebuild --force`. The rebuild applies any pending schema migrations |
| Hash signature corruption | Daemon refuses to detect drift (signature unreadable) | Delete `.skill-graph.sig`. Daemon regenerates on next scan |
| New skill added but never indexed | `skill_graph_query` returns empty for the new skill | Run `skill_graph_scan` manually. If still missing, verify the new graph-metadata.json passes JSON validation |
| Drift after `git pull` brings new graph-metadata.json files | Common after upstream sync | Run `advisor_rebuild --force` once after `git pull` to re-sync |
| Watcher fires repeatedly on the same file | Some editor saves trigger multiple change events | Daemon debounces (configurable). If debounce is too short, increase via `MK_SKILL_ADVISOR_WATCH_DEBOUNCE_MS` env var |

<!-- /ANCHOR:5-failure-modes -->

---

<!-- ANCHOR:6-related -->
## 6. RELATED

- [`freshness-contract.md`](./freshness-contract.md), trust state transitions
- [`daemon-lease-contract.md`](./daemon-lease-contract.md), lease must release cleanly for rebuild
- [`skill-graph-query-cookbook.md`](./skill-graph-query-cookbook.md), query the graph after reconciliation
- [`tool-ids-reference.md`](./tool-ids-reference.md), `advisor_rebuild`, `skill_graph_scan`, `skill_graph_validate` schemas
- `feature_catalog/01--daemon-and-freshness/06-rebuild-from-source.md`, feature inventory
- `mcp_server/handlers/skill-graph/scan.ts`, `mcp_server/handlers/advisor-rebuild.ts`, source

<!-- /ANCHOR:6-related -->
