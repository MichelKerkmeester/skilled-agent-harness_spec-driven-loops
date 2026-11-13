# Iteration 1: Baseline capture on a scratch copy of the advisor database

## Focus

KQ1: measure the before numbers at HEAD after phases 014 and 015 with the committed capture in `--real-embedding` mode against a scratch copy of the advisor database. The lane needs this baseline before any intent signal or vector changes so the after numbers differ only by the enrichment.

## Actions Taken

1. Read the lane inputs: `goals.md`, segment three sections 3 and 4, the phase 014 and 015 summaries, the committed capture script, the skill-graph vector schema and the command-bridge deriver.
2. Took a consistent snapshot of the live advisor database with `sqlite3 ... ".backup '<lineage>/scratch/db-before/skill-graph.sqlite'"`, which gave 14 skill nodes, 46 command vectors and the active embedder `nomic-embed-text-v1.5`.
3. Ran the committed capture in its real-embedding mode with `SYSTEM_SKILL_ADVISOR_DB_DIR` pointing at that snapshot:
   `env SYSTEM_SKILL_ADVISOR_DB_DIR="$PWD/<lineage>/scratch/db-before" node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs --real-embedding`
   It exited 0 in 12.5 s and wrote `scratch/before-capture.json`.

## Findings

1. At HEAD `087888ec4a` the real-embedding capture reads typed recall 24 of 44, plain tune top-1 13 of 45, plain tune combined reach 28 of 45 (13 own plus 15 attached), plain holdout top-1 3 of 44, false offers 0 of 35 and `needs_mode_floor` 1 of 35. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:618-658]
2. The three doctor-family floor rows at 0.82 offer no command: `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` all top `system-skilled-doctor` with `offered: false`, `top1: false` and `top3: false`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json]
3. Each of the five scored no-recommendation commands has exactly one tune row and one holdout row, and every one is 0 at top-1 and 0 at top-3: `/doctor:install`, `/doctor:setup`, `/doctor:speckit`, `/doctor:update` and `/speckit:search`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl]
4. `/create:skill-parent` has no TypeScript bridge: it is in the capture's `unreachable` list, its typed row tops `sk-doc`, and its plain row carries no command. No command-vector change can reach it until a scorer row exists. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json]
5. The scratch-database lane is faithful and repeatable: the capture exits 0, the database snapshot holds the same 46 command vectors and the same active embedder as the live file, and its numbers equal the segment-three real capture (13 of 45 tune, 3 of 44 holdout, 0 of 35 false offers). [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md:39]

## Ruled Out

- Running the capture against the live database in place: it would measure whatever the daemon wrote and would leave no before snapshot for the after run.
- A plain file copy of the WAL-mode database: the `-wal` file may hold committed rows, so `.backup` was used for a consistent snapshot.

## Dead Ends

- None yet. The lane has a working baseline and a scratch copy that the enrichment run can reuse.

## Edge Cases

- Ambiguous input: none. The six commands and the three floor rows are named by segment three, and the capture publishes only holdout counts.
- Contradictory evidence: none. The baseline agrees with the segment-three real capture.
- Missing dependencies: none. Ollama answers with `nomic-embed-text:v1.5`, and the scratch database holds the `vec_cmd_768` table.
- Partial success: none.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md:60-116`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/implementation-summary.md:45-60`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:134-184,346-430,618-658`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:290-324,740-812,1484-1590`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:25-40,660-700`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json`

## Assessment

- New information ratio: 0.45
- Questions addressed: KQ1
- Questions answered: KQ1

## Reflection

- What worked and why: `sqlite3 .backup` plus the capture's documented `SYSTEM_SKILL_ADVISOR_DB_DIR` override made the whole lane possible without touching a tracked file. The committed capture's real-embedding preflight also proved the embedder and the command-vector table before a single row was scored, so a silent cosine lane could not be mistaken for a scoring result.
- What did not work and why: nothing failed. Reading the generated bridge projection rather than each metadata file was enough to see that `/create:skill-parent` has no TypeScript runtime, which explains its zero without a vector run.
- What I would do differently: nothing for this iteration; the next run can reuse the same snapshot and change only the six command vectors.

## Recommended Next Focus

KQ2: compose richer intent signals for the six commands, write them only in the lineage scratch folder, re-embed the six command vectors in a second copy of the database, and rerun the same capture to compare tune recall, false offers of 35, the holdout count and the three doctor-family floor rows.
