# Verification

## Live status pair after the change (daemon restarted on the new build)

`advisor_status`: `freshness: live`, `generation: 19`, `skillCount: 14`, `indexStaleness: { state: fresh, trackedSkills: 14, freshSourceFiles: 14, changedSourceFiles: 0, missingSourceFiles: 0 }` (exit 0).

`skill_graph_status`: `totalSkills: 14`, `staleness: { trackedSkills: 14, freshSourceFiles: 14, changedSourceFiles: 0, missingSourceFiles: 0 }`, `dbStatus: ready` (exit 0).

The two surfaces now agree. The stale direction (stored hash differs) is pinned by `tests/handlers/advisor-status.vitest.ts` (freshness downgraded to stale, `changedSourceFiles: 1`) and by `tests/handlers/skill-graph-status-hash.vitest.ts`.

## Panel runs

```
Skill-graph freshness panel (read-only)
  compiled skill-graph.json : 14 skills, generated_at 2026-09-29T07:49:34.068437+00:00
  SQLite skill-graph.sqlite : 14 nodes
  on-disk graph-metadata    : 14 skills (source of truth)
  scan rule                 : depth-1 only (direct children of .skilled/skills); nested folders are not read
  STALE COMPILED: skill-graph.json generated_at 2026-09-29T07:49:34.068437+00:00 is older than the newest source stamp 2026-09-29T09:00:00Z (cli-classifier); regenerate the compiled graph
  ZOMBIE (in SQLite, not on disk): none
  MISSING (on disk, not in SQLite): none
  FAMILY MISMATCH SQLite vs disk: none
  GHOST (in compiled json, not on disk): none
  FAMILY MISMATCH compiled vs disk: none
  NULL derived timestamp: none
  (report-only [em dash in the original output] the canonical reindex is operator-gated; nothing was written)
exit=0
Skill-graph freshness panel (read-only)
  compiled skill-graph.json : 14 skills, generated_at 2026-09-29T07:49:34.068437+00:00
  SQLite skill-graph.sqlite : absent
  on-disk graph-metadata    : 14 skills (source of truth)
  scan rule                 : depth-1 only (direct children of .skilled/skills); nested folders are not read
  STALE COMPILED: skill-graph.json generated_at 2026-09-29T07:49:34.068437+00:00 is older than the newest source stamp 2026-09-29T09:00:00Z (cli-classifier); regenerate the compiled graph
  DEGRADED: SQLite skill-graph.sqlite absent at /tmp/advisor-db-absent-probe/skill-graph.sqlite; ZOMBIE, MISSING and FAMILY MISMATCH SQLite vs disk were not checked (compiled json vs disk only); run advisor_rebuild to build it
  GHOST (in compiled json, not on disk): none
  FAMILY MISMATCH compiled vs disk: none
  NULL derived timestamp: none
  (report-only [em dash in the original output] the canonical reindex is operator-gated; nothing was written)
exit=0
```
