#!/bin/bash
# Run from the repository root: bash <this file>
# Compares what the embed engine prints and names with what the embed workflow,
# the route manifest and the setup router say. Reads files only.
D=.skilled/commands/doctor
E=$D/scripts/agents-md-embed.cjs
echo "engine prints the restore failure: $(rg -c 'ERROR: the restore failed' "$E")"
echo "workflow names the restore failure: $(rg -c 'the restore failed' "$D/assets/doctor-agents-md-embed.yaml" || echo 0)"
echo "engine names the backup by: $(rg -o 'digest\.slice\(0, BACKUP_NAME_CHARS\)' "$E") with $(rg -o 'BACKUP_NAME_CHARS = [0-9]+' "$E"), fallback $(rg -o 'path\.join\(os\.tmpdir\(\), BACKUP_FALLBACK_DIR\)' "$E")"
echo "workflow backup name: $(rg -o 'doctor-agents-md/<[a-z0-9 ]+>/' "$D/assets/doctor-agents-md-embed.yaml")"
echo "route backup name: $(rg -o 'doctor-agents-md/<[a-z0-9 ]+>/' "$D/_routes.yaml")"
echo "route names the temporary-directory fallback: $(rg -o 'gate3_location: "AGENTS\.md \(created when absent[^"]*"' "$D/_routes.yaml" | rg -q 'temporary directory' && echo yes || echo no)"
echo "setup router reason: $(rg -o 'names `SKILL_ADVISOR_DEBUG`, the setting that turns the records on' "$D/setup.md")"
echo "setup router names the debug flag: $(rg -c 'SKILL_ADVISOR_DEBUG' "$D/setup.md" || echo 0)"
echo "setup router gives the workflow reason: $(rg -c 'because no prompt hook has written a record for this checkout yet' "$D/setup.md" || echo 0)"
echo "setup workflow reason: $(rg -o 'because no prompt hook has written a record for this checkout yet' "$D/assets/doctor-setup.yaml")"
echo "health writer needs debug: $(rg -o 'requireDebug: false' .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts | head -1)"
