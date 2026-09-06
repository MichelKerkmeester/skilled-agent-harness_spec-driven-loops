# Stage B code-path followups

Every site below still says `memory` in a code path, package identity, or a hard-coded
script string. Stage A (this phase) left all of it untouched, per the operator's
instruction that code-path moves are a later, separate change. This is the starting
inventory for that follow-on packet, not a fresh search.

## Primary rename targets

| Site | file:line | What it is |
|---|---|---|
| Continuity writer source | `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Move to `scripts/continuity/generate-context.ts` |
| Continuity writer, compiled | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | Move to `scripts/dist/continuity/generate-context.js` |
| Source folder siblings | `.opencode/skills/system-spec-kit/scripts/memory/` (8 files: `README.md`, `ast-parser.ts`, `backfill-frontmatter.ts`, `backfill-research-metadata.ts`, `fix-memory-h1.mjs`, `generate-context.ts`, `migrate-trigger-phrase-residual.ts`, `rank-memories.ts`, `validate-memory-quality.ts`) | Move the whole folder to `scripts/continuity/` |
| Compiled folder siblings | `.opencode/skills/system-spec-kit/scripts/dist/memory/` (`.js`/`.d.ts`/`.map` triples for the same 8 source files) | Move the whole folder to `scripts/dist/continuity/` |
| Session-stop hook fallback candidates (REQ-004) | `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:73-76` | Four resolved path candidates for the compiled writer; all four must change in the same commit as the rename, or auto-save silently breaks on session stop |
| Package description | `.opencode/skills/system-spec-kit/scripts/package.json:4` | `"CLI tools for spec-kit context generation and memory management"` — update the description once the folder moves |
| Command-contract family key | `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json:143` (`"memory": {`) | Kept as `memory` in this phase because `generate-command-routers.cjs` hard-codes a string check against it (see below); rename requires editing that script in the same commit |
| Router-drift script hardcode | `.opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs:97,109` (`family === 'memory'`) | The string check that must change alongside the `command-contract.json` key rename above; this file is under `system-spec-kit/scripts/`, out of this phase's edit authority |

## Files already caught by the `scripts/dist/memory` grep (Stage B starting inventory)

`rg -l "scripts/dist/memory" --glob '*.md' --glob '*.json' --glob '*.ts' --glob '*.sh' --glob '*.cjs' --glob '*.mjs' --glob '*.yaml' | grep -v node_modules | grep -v '/dist/' | grep -v '^specs/' | grep -v z_archive` returned 84 files at the time this phase closed (spec.md recorded 87; the small drift is expected per SC-002 and does not need reconciling before Stage B starts). Two of those 84 are the only remaining live *command-name* references anywhere in the tree, and both sit under `system-spec-kit/scripts/`, out of this phase's edit authority:

- `.opencode/skills/system-spec-kit/scripts/scripts-registry.json`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts`

The full 84-file list is saved beside this document at `scratch/scripts-dist-memory-blast-radius.txt` for Stage B to re-run and diff against its own starting count.

## Explicitly out of scope for Stage B (not part of this naming decision)

- `.opencode/skills/system-spec-kit/references/memory/` — the reference-doc folder (`memory-system.md`, `save-workflow.md`, `trigger-config.md`) and its file names. This decision covers command names only.
- `_memory.continuity` — the frontmatter field name inside `implementation-summary.md`. Not a command name.
- `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR` — the skill advisor's own embedding-store env vars, unrelated to this command family.
- The skill advisor's routing/scoring corpora and vocabulary maps under `system-skill-advisor/mcp-server/` (aliases, fusion tables, routing-accuracy JSONL fixtures) that still name `/memory:save`/`/memory:search` as example strings. These belong to a different, actively-owned packet (024, the advisor scorer work) and were not touched here.
