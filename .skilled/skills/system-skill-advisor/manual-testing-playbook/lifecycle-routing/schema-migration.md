---
title: "LC-004 Outdated Skill Graph Database Discard and Rescan"
description: "Manual validation that a skill graph database built at an older schema version is deleted on open rather than migrated, and that a rescan rebuilds every row from graph-metadata.json."
trigger_phrases:
  - "lc-004"
  - "schema migration"
  - "outdated database discard"
  - "schema version rescan"
version: 0.8.2.0
id: LC-004
category: lifecycle_routing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# LC-004 Outdated Skill Graph Database Discard and Rescan

Prompt: Manual validation that a skill graph database built at an older schema version is deleted on open rather than migrated, and that a rescan rebuilds every row from graph-metadata.json.


---

## 1. OVERVIEW

Validate that the skill graph database layer in `lib/skill-graph/skill-graph-db.ts` treats a `skill-graph.sqlite` stored below `SCHEMA_VERSION` as outgrown derived state. On the first open it deletes the file together with its `-wal`, `-shm` and `-journal` sidecars and logs `[skill-graph] Discarded a schema version N database; the next scan rebuilds it`. The scan that follows rebuilds every row from `graph-metadata.json`. Nothing is migrated in place, so no row of the old file survives and there is no rollback to it.

The metadata-level backfill in `lib/lifecycle/schema-migration.ts` is a separate pure function over `graph-metadata.json` content. It never reads or writes the database, so this scenario does not exercise it.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy with the advisor runtime installed and built inside the copy.
- `sqlite3` on the path.
- Every command runs from inside the copy, so the copy's own launcher resolves the copy's own database folder and never the live checkout's.

---

## 3. TEST EXECUTION

### Commands

1. Create the copy without the live database folder, whose launcher state and lease belong to the live checkout, and build its advisor runtime:

```bash
WORK="/tmp/skill-advisor-lc-004-$(date +%s)"
rsync -a --exclude node_modules --exclude .git --exclude '/.skilled/skills/system-skill-advisor/runtime/database/' ./ "$WORK/"
cd "$WORK"
npm --prefix .skilled/skills/system-skill-advisor/runtime ci
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

2. Before any advisor call in the copy, replace its database with a schema version 1 file that carries a marker table:

```bash
DB=".skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite"
mkdir -p "$(dirname "$DB")"
rm -f "$DB" "$DB-wal" "$DB-shm" "$DB-journal"
sqlite3 "$DB" "CREATE TABLE schema_version (version INTEGER NOT NULL); INSERT INTO schema_version VALUES (1); CREATE TABLE skill_nodes (id TEXT PRIMARY KEY); CREATE TABLE lc004_marker (note TEXT); INSERT INTO lc004_marker VALUES ('v1 seed');"
```

3. Rebuild through the copy's launcher, which opens the database and so discards the version 1 file before it scans:

```bash
node .skilled/bin/skill-advisor.cjs advisor_rebuild --workspace-root "$WORK" --trusted --force true --format json
```

4. Inspect the database the rebuild left:

```bash
sqlite3 "$DB" "SELECT version FROM schema_version; SELECT COUNT(*) FROM sqlite_master WHERE name = 'lc004_marker'; SELECT COUNT(*) FROM skill_nodes;"
```

### Expected Signals

- The rebuild response reports `rebuilt: true` and exits `0`.
- `schema_version` reads `2`.
- The `lc004_marker` count is `0`, because the version 1 file was deleted rather than opened in place.
- `skill_nodes` holds rows again, rebuilt from the copy's `graph-metadata.json` files.

### Evidence

- Capture the output and exit status of the rebuild and of the `sqlite3` inspection.
- Record the schema version, the marker count and the `skill_nodes` count.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| The marker table survives | `lc004_marker` count is `1` | The outdated file was opened in place. Check `discardOutdatedDatabase` and `readOutdatedSchemaVersion` in `lib/skill-graph/skill-graph-db.ts`. |
| `schema_version` still reads `1` | First inspection row | Same check. The schema statement runs on the new file only after the old one is gone. |
| `skill_nodes` is empty | Last inspection row is `0` | The scan indexed nothing. Read the rebuild response and its warnings. |

### Cleanup

```bash
cd -
rm -rf "$WORK"
```

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [LC-005](../../manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md), lifecycle rollback.
- Scenario [AU-005](../../manual-testing-playbook/auto-update-daemon/rebuild-from-source.md), rebuild-from-source.
- Feature [`lifecycle-routing/schema-migration.md`](../../feature-catalog/lifecycle-routing/schema-migration.md), the metadata-level backfill this scenario does not exercise.
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: lifecycle-routing/schema-migration.md
