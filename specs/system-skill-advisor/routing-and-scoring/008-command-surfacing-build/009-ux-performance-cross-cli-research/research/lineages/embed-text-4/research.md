---
title: "Embed text lane, segment four: what richer command embedding text buys"
description: "Measured answer for segment-three rank 10 and open question 5: richer intent signals and re-embedded command vectors move five no-recommendation commands on tune and two on holdout, with every floor held."
trigger_phrases:
  - "command embedding text research"
  - "six no-recommendation commands"
  - "segment four embed text lane"
---

# Embed Text Lane: What Richer Command Embedding Text Buys

Lane `embed-text-4` of research segment four, measured on the built state after phases 014 and 015 at HEAD `087888ec4a`. Executor: `opencode-go/deepseek-v4.1-flash` through `cli-opencode`. Three iterations, convergence threshold 0.05, stop reason `all_questions_answered`.

## 1. What Was Measured

Segment three rank 10 proposed giving the six no-recommendation commands evidence through command intent signals, with `/create:skill-parent` also needing a scorer row. Segment three open question 5 asked whether richer intent text in the command vectors moves holdout rows. This lane isolated the command-vector half:

1. Took a consistent `.backup` snapshot of the live advisor database.
2. Added 4 to 5 intent signals per command in scratch copies of the owning metadata (the two real `command-metadata.json` files plus a command-metadata-shaped sidecar for the four doctor routes, whose tracked home is `_routes.yaml`).
3. Re-embedded only the five commands that own a stored vector, using the live embedder (`nomic-embed-text:v1.5`, `search_document: ` prefix).
4. Ran the committed capture in `--real-embedding` mode against the scratch database and compared it with the same capture against the untouched snapshot.

The tracked metadata, database, bridge projection and corpus were never modified. Every write is inside `research/lineages/embed-text-4/`.

## 2. Baseline at HEAD `087888ec4a`

| Measure | Value |
|---|---|
| Typed recall at 1 | 24 of 44 |
| Plain tune top-1 | 13 of 45 |
| Plain tune combined reach (own + attached) | 28 of 45 |
| Plain holdout top-1 | 3 of 44 |
| False offers | 0 of 35 |
| `needs_mode_floor` | 1 of 35 |

The three doctor-family floor rows that pass the gate at 0.82 (`mns-chat-03`, `nm-system-skilled-doctor-01`, `sv-03`) all topped `system-skilled-doctor` and carried no command. Each of the five scored no-recommendation commands had one tune row and one holdout row at zero top-1 and zero top-3. `/create:skill-parent` was in the capture's `unreachable` list.

Evidence: `scratch/before-capture.json`.

## 3. After Enriched Embedding Text

| Measure | Before | After | Delta |
|---|---|---|---|
| Typed recall at 1 | 24 of 44 | 24 of 44 | 0 |
| Plain tune top-1 | 13 of 45 | 18 of 45 | +5 |
| Plain tune combined reach | 28 of 45 | 33 of 45 | +5 |
| Plain holdout top-1 | 3 of 44 | 5 of 44 | +2 |
| False offers | 0 of 35 | 0 of 35 | 0 |
| `needs_mode_floor` | 1 of 35 | 1 of 35 | 0 |

The five tune rows that moved are exactly the five scored commands, each from no command to its own command at top-1:

| Command | Tune | Holdout |
|---|---|---|
| `/doctor:install` | 0 of 1 to 1 of 1 | 0 of 1 to 1 of 1 |
| `/doctor:setup` | 0 of 1 to 1 of 1 | 0 of 1, unchanged |
| `/doctor:speckit` | 0 of 1 to 1 of 1 | 0 of 1 to 1 of 1 |
| `/doctor:update` | 0 of 1 to 1 of 1 | 0 of 1, unchanged |
| `/speckit:search` | 0 of 1 to 1 of 1 | 0 of 1, unchanged |
| `/create:skill-parent` | 0 of 1, unchanged | 0 of 1, unchanged |

The holdout gain is two rows and is not tune-only. No holdout prompt text was read; the per-command holdout counts come from the committed capture.

Evidence: `scratch/after-capture.json`, `scratch/after-capture-rerun.json`, `scratch/after-capture-rebuilt.json`.

## 4. Why the Comparison Is Isolated

- The re-embed path is faithful: re-embedding the unchanged `/doctor:install` text reproduces its stored vector at cosine 1.000000.
- Every updated row is 3,072 bytes with model `nomic-embed-text-v1.5` and a matching content hash.
- All 14 skill vectors are byte-identical between the two database copies; exactly 5 command vectors changed, and they are the five scored commands.
- The before capture ran twice and read 13 of 45 and 3 of 44 both times; the after capture ran three times and read 18 of 45 and 5 of 44 every time.

Evidence: `scratch/metadata/reembed-report.json`, `scratch/enrich-and-embed.mjs`, `scratch/before-capture-rerun.json`.

## 5. Floor Check

The three doctor-family floor rows at 0.82 still pass and still offer nothing. In the after capture each keeps `system-skilled-doctor` as its top and reads `offered: false`, `top1: false`. All three sit inside the unchanged false-offer total of 0 of 35, and `needs_mode_floor` stays at 1 of 35. The exact fused confidence was not re-read; the top skill and its skill vector are unchanged, and no command reached the top three, so the 0.82 gate is unaffected.

## 6. Answer: Build

**Build the five scored commands' intent signals.** The vector-only measurement already pays 5 tune rows and 2 holdout rows, with typed recall, false offers and the doctor floors unchanged. Declining would leave those 7 rows without a command for no measured floor gain.

### Exact Files

1. `.skilled/commands/doctor/_routes.yaml` — add 5 phrases to `/doctor:install`, 5 to `/doctor:setup`, 5 to `/doctor:speckit` and 4 to `/doctor:update` in their `trigger_phrases` blocks (routes at lines 626, 376, 65, 758).
2. `.skilled/skills/system-spec-kit/command-metadata.json` — add 4 phrases to the `/speckit:search` `userIntent.ownedSignals` (entry at line 215).
3. `.skilled/skills/sk-doc/command-metadata.json` — add 4 phrases to the `/create:skill-parent` `userIntent.ownedSignals` (entry at line 48). This is a prerequisite with zero measured gain today.
4. `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` — add the `/create:skill-parent` TypeScript activation entry; rerun `derive-command-bridges.cjs` so its generated `scorerRow` flips at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:135`.
5. Re-embed with `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json`, whose handler calls `indexSkillMetadata` then `refreshSkillEmbeddings` (`handlers/skill-graph/scan.ts:49-62`).

The exact phrases are in `scratch/metadata/enriched-embedding-text.json`. The scratch metadata copies are in `scratch/metadata/`.

### Verification

1. Rerun the fixture capture with `--write` to recapture the ratchet baseline; the bridge metadata changes make the old baseline stale by design.
2. Rerun the real capture and require tune 18 of 45 or better, holdout 5 of 44 or better, false offers 0 of 35, typed recall 24 of 44.
3. Run `route-validate.sh` and `doctor-phrase-reach.cjs` for the four doctor routes.
4. Keep the three floor rows command-free.

## 7. What the Measurement Does Not Cover

- **The lexical half is unmeasured.** The build also adds the same phrases to `trigger_phrases`/`ownedSignals`, which the deriver copies into the TypeScript scorer. A broad phrase such as "list every check this project has" could lift a near-miss or must-not-start row. The 0 of 35 false-offer gate is the control; narrow any phrase that moves it.
- **The vector-only gain is a lower bound.** The build could gain more from lexical evidence, or less if a phrase is narrowed.
- **Holdout is 5 of 44, not a full fix.** Two of the five scored commands gained a holdout row; three did not.
- **`/create:skill-parent` has no scorer row.** Its measured gain is 0 until step 4 of the build lands; it is not part of the +5/+2.
- **The exact 0.82 fused confidence was not re-read.** The top skill and its vector are unchanged, and all three rows stay silent.

## 8. What This Changes in Segment Three

- **Rank 10 changes from "measure first" to "build".** The measurement that changes it is the real-embedding scratch capture: tune 13 to 18 of 45, holdout 3 to 5 of 44, false offers 0 of 35, typed 24 of 44.
- **Open question 5 is answered for command vectors**: richer command intent text moves 2 holdout rows. It is not evidence for skill-vector enrichment, so segment three rank 16 (skill intent signals) stays declined.
- **No other rank is reopened.** The three doctor floor rows still pass, so rank 10's stated floor risk did not materialize.

## 9. Convergence Report

- Stop reason: `all_questions_answered`
- Total iterations: 3
- Questions answered: 3 of 3
- Remaining questions: 0
- Novelty per iteration: 0.45, 0.88, 0.35
- Convergence threshold: 0.05
- Note: the run stopped on question coverage, not on the 0.05 novelty threshold. Iteration 3 was synthesis with no new external measurement, and the lane instruction says to stop when a further iteration would add no new measurement.

## 10. Sources

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1484-1590`
- `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:49-62`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:660-700`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`
- `.skilled/commands/doctor/_routes.yaml:65,376,626,758`
- `.skilled/skills/system-spec-kit/command-metadata.json:215`
- `.skilled/skills/sk-doc/command-metadata.json:48`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md:37,75,95,209`
- Lineage artifacts: `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`; `scratch/before-capture.json`, `scratch/after-capture.json`, `scratch/metadata/enriched-embedding-text.json`, `scratch/metadata/reembed-report.json`.
