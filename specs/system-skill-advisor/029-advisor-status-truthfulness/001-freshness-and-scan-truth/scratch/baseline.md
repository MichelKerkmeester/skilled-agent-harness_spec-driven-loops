# Baseline (before any change)

Command: `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --warm-only` (exit 0)
- `freshness: live`, `generation: 9`, `trustState.state: live`, `skillCount: 20`

Command: `node .skilled/bin/skill-advisor.cjs skill_graph_status --format json --warm-only` (exit 0)
- `totalSkills: 14`, `staleness: { trackedSkills: 14, freshSourceFiles: 0, changedSourceFiles: 14, missingSourceFiles: 0 }`

The disagreement reproduced: one surface said live, the other said every source changed; 20 skills against 14.

Command: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (exit 0)
- compiled `generated_at 2026-09-29T07:49:34.068437+00:00`, SQLite `14 nodes`, disk `14 skills`, every diff set `none`, no line about the compiled graph being older than `cli-classifier`'s `derived.last_updated_at 2026-09-29T09:00:00Z`.

Command: `SYSTEM_SKILL_ADVISOR_DB_DIR=<empty dir> node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (exit 0)
- SQLite `absent`; the ZOMBIE, MISSING and SQLite FAMILY MISMATCH lines silently vanished; no degraded marker.
