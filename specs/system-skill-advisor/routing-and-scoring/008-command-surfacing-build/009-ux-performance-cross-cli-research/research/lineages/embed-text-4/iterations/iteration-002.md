# Iteration 2: Enriched command intent signals and re-embedded vectors

## Focus

KQ2: compose richer intent signals for the six no-recommendation commands, write them only in the lineage scratch folder, re-embed the five commands that own a stored vector in a second database copy, and rerun the committed capture to compare against the iteration 1 baseline.

## Actions Taken

1. Wrote `scratch/enrich-and-embed.mjs`, which reads the tracked bridge projection and the two tracked `command-metadata.json` files, adds 4 to 5 intent signals per command, writes scratch metadata copies, copies `scratch/db-before/skill-graph.sqlite` to `scratch/db-after`, and updates only the five command vectors that exist.
2. Verified the re-embed path against the stored data: re-embedding the unchanged `/doctor:install` text with `search_document: ` and `nomic-embed-text:v1.5` reproduces the stored 768-d vector at cosine 1.000000.
3. Ran the committed capture against `scratch/db-after` twice, plus a third run after rebuilding that copy from the snapshot, and compared the JSON with `scratch/before-capture.json`.
4. Compared the two databases row by row: 14 skill vectors byte-identical (same table digest), 46 command vectors with exactly 5 changed (`command-doctor-install`, `command-doctor-setup`, `command-doctor-speckit`, `command-doctor-update`, `command-speckit-search`).

## Findings

1. The re-embed path is faithful and the comparison is isolated: the unchanged text reproduces its stored vector at cosine 1.000000, each updated row is 3,072 bytes with model `nomic-embed-text-v1.5` and a matching content hash, every skill vector is byte-identical, and exactly the five scored command vectors changed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/metadata/reembed-report.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/enrich-and-embed.mjs]
2. With the enriched vectors the committed capture reads plain tune top-1 18 of 45 (was 13), plain tune combined reach 33 of 45 (was 28), plain holdout top-1 5 of 44 (was 3), false offers 0 of 35 (unchanged), typed recall 24 of 44 (unchanged) and `needs_mode_floor` 1 of 35 (unchanged). [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/after-capture.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json]
3. The five tune rows that moved are exactly the five scored commands, and each moved from no command to its own command at top-1: `cmd-doctor-install-plain-tune-01`, `cmd-doctor-setup-plain-tune-01`, `cmd-doctor-speckit-plain-tune-01`, `cmd-doctor-update-plain-tune-01` and `cmd-speckit-search-plain-tune-01`. No other published tune row changed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/after-capture.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/before-capture.json]
4. The holdout gain is two rows and is not tune-only: per-command holdout counts moved from 0 of 1 to 1 of 1 for `/doctor:install` and `/doctor:speckit`; `/doctor:setup`, `/doctor:update` and `/speckit:search` stayed at 0 of 1. Only counts were read; no holdout prompt text was printed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/after-capture.json]
5. The three doctor-family floor rows that pass the gate at 0.82 still pass and still offer nothing: `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` all keep `system-skilled-doctor` as the top, read `offered: false`, `top1: false`, and sit inside the unchanged false-offer total of 0 of 35. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/after-capture.json]
6. `/create:skill-parent` cannot move from this change: it has no TypeScript bridge, no stored command vector and no row for the capture to score, so its plain row stays empty even though its scratch text grew from 187 to 369 characters. It needs a scorer row, not more embedding text. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/metadata/enriched-embedding-text.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/after-capture.json]
7. The measured gain is the vector half only: the capture still reads the tracked bridge projection for lexical evidence, so the build's other half (the same phrases in `ownedSignals` or `trigger_phrases`, which the deriver also copies into the TypeScript scorer) is not in these numbers. Adding 4 to 5 phrases grew each text by 165 to 233 characters, and the whole scratch re-embed of five command vectors plus two parity calls took 0.15 s wall with the model warm. [SOURCE: specs/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:434] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:660-680]

## Ruled Out

- Re-embedding `/create:skill-parent`: there is no `vec_cmd_768` row and no TypeScript id, so the update would write a vector nothing reads.
- Copying the enriched bridge projection over the tracked file so the capture's lexical lane sees it: that would modify a tracked file and break the isolation the measurement needs.

## Dead Ends

- Command vector enrichment alone cannot make `/create:skill-parent` reachable. This is a definitive dead end for that command until a bridge row exists.

## Edge Cases

- Ambiguous input: the lane says the six commands live in `command-metadata.json` files, but the four doctor commands are declared in `.skilled/commands/doctor/_routes.yaml`. The scratch copy for those four is a command-metadata-shaped sidecar that names the tracked source and keeps the same fields; the two real `command-metadata.json` files were copied and edited in the scratch folder.
- Contradictory evidence: none. The after run reproduced the same numbers three times and the before run twice.
- Missing dependencies: none. The embedder was warm and the scratch database carried the active pointer.
- Partial success: the vector half is measured; the lexical half of a real build remains unmeasured and is carried into the next focus.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:660-700`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`
- `.skilled/commands/doctor/_routes.yaml`
- `.skilled/skills/system-spec-kit/command-metadata.json`
- `.skilled/skills/sk-doc/command-metadata.json`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1484-1590`
- `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:49-62`
- `scratch/enrich-and-embed.mjs`, `scratch/metadata/enriched-embedding-text.json`, `scratch/metadata/reembed-report.json`
- `scratch/after-capture.json`, `scratch/after-capture-rerun.json`, `scratch/after-capture-rebuilt.json`

## Assessment

- New information ratio: 0.88
- Questions addressed: KQ2
- Questions answered: KQ2

## Reflection

- What worked and why: isolating one variable at a time. The scratch database started as a copy, only five command vectors changed, and the capture read the same tracked corpus and bridge projection, so the +5 tune and +2 holdout rows can only come from the embedding text. The parity check at cosine 1.000000 removed any doubt that a different embedding path produced the lift.
- What did not work and why: the first version of the scratch script assumed every bridge entry carries `embeddingText`; `/create:skill-parent` does not, because its TypeScript bridge is disabled. The failure was useful: it named exactly why that command cannot move.
- What I would do differently: measure the lexical half separately in a build phase, because the real change touches both lanes and the vector-only numbers are a lower bound.

## Recommended Next Focus

KQ3: turn the measurement into a build or decline with exact files and numbers, name the lexical-half risk and the `/create:skill-parent` prerequisite, and stop when no further measurement is available inside this lane.
