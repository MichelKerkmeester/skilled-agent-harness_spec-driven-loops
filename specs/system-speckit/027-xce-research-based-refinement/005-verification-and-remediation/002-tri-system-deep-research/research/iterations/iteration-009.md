# Iteration 009 — Angle 9

**Angle:** Checkpoint and backup operational reality: checkpoints dir and backups dir are empty in production despite shipped checkpoint tooling — wiring, cadence, or docs gap?

**Summary:** The empty checkpoints directory is mostly a cadence/policy gap, not broken checkpoint wiring. The stronger issues are documentation mismatches around where restore backups and recovery artifacts actually land.

**Findings kept:** 3

## [P2][REFINEMENT] No proactive checkpoint cadence in production

- Evidence: command: sqlite3 "file:.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite?mode=ro" "select count(*) as checkpoint_rows from checkpoints;" -> output: 0; command: ls -A ".opencode/skills/system-spec-kit/mcp_server/database/checkpoints" -> output: README.md; .opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:384-407 wires explicit checkpoint_create only; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:176-184 creates a checkpoint only before bulk delete.
- Detail: The shipped checkpoint feature works as an explicit tool and as a pre-destructive safety net, not as a scheduled backup cadence. Empty production checkpoint state is therefore operationally expected, but it means there is no recent restore point unless an operator or destructive workflow created one.
- Fix sketch: Add an explicit operator policy, health warning, or optional scheduled checkpoint job if regular production restore points are desired.

## [P1][README-MISALIGNMENT] checkpoint_restore README points to restore-backups, but daemon v2 restore uses transient .bak files

- Evidence: .opencode/skills/system-spec-kit/mcp_server/database/checkpoints/README.md:90-92 says checkpoint_restore copies the target into restore-backups; .opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2642-2643 assigns liveMainPath/liveShardPath .bak siblings; .opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2760-2764 deletes those backups after success; .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:100-102 is the raw script path that defaults to checkpoints/restore-backups.
- Detail: The README conflates daemon checkpoint_restore with the separate raw migration restore script. Operators expecting a retained pre-restore copy under checkpoints/restore-backups after MCP checkpoint_restore will not find one.
- Fix sketch: Clarify that MCP v2 restore uses transient sibling .bak files, while restore-backups belongs only to restore-checkpoint.ts.

## [P2][DOC-DRIFT] backups directory contract does not match observed recovery artifacts

- Evidence: .opencode/skills/system-spec-kit/mcp_server/database/README.md:23 says backups holds pre-migration safety copies and quarantined corrupt databases; .opencode/skills/system-spec-kit/mcp_server/database/backups/README.md:19-24 repeats that contract; command: ls -A ".opencode/skills/system-spec-kit/mcp_server/database" -> output includes context-index.sqlite.corrupt-20260606 and context-index.sqlite.pre-repair-20260611; command: ls -A ".opencode/skills/system-spec-kit/mcp_server/database/backups" -> output: README.md.
- Detail: The docs say backups/ is the home for corruption quarantine and pre-repair safety copies, but current production artifacts live beside the main DB while backups/ is empty. That makes the directory contract misleading during incident response.
- Fix sketch: Either update the recovery runbooks to place future recovery artifacts under backups/ or document the parent-level legacy/current naming convention explicitly.
