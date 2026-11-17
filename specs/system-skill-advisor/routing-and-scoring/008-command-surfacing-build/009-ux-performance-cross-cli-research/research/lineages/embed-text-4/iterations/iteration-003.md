# Iteration 3: Build or decline, with the exact files and the measured gain

## Focus

KQ3: turn the measurement into the lane's answer. Build the five scored commands' intent signals with the measured gain, or decline with the number. Name the exact files, the re-embed step, the floor check and the one command that cannot benefit yet.

## Actions Taken

1. Re-read the owning metadata shapes and line anchors: the four doctor routes in `.skilled/commands/doctor/_routes.yaml`, `/speckit:search` in `.skilled/skills/system-spec-kit/command-metadata.json`, `/create:skill-parent` in `.skilled/skills/sk-doc/command-metadata.json`, the `scorerRow: false` row at `command-attach.ts:135`, and the scan handler that refreshes embeddings after a metadata edit.
2. Ran the collision check over all 27 proposed phrases against tracked command and skill metadata: 0 hits outside the lineage (the only corpus hits are the tune rows the phrases were derived from, by construction).
3. Confirmed no tracked file changed: `git status --porcelain -- .skilled` printed nothing, and the three metadata files plus the database and the generated bridge projection are clean.

## Findings

1. **Answer: build the five scored commands.** The measured vector-only gain is plain tune top-1 13 to 18 of 45 (+5), combined tune reach 28 to 33 of 45 (+5), holdout top-1 3 to 5 of 44 (+2), false offers 0 of 35 unchanged, typed recall 24 of 44 unchanged. That changes segment three rank 10's disposition from "measure first" to "build", and it is the first measurement in this segment that moves holdout rows without touching a floor. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/after-capture.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md:75]
2. The exact build edits are three metadata files: add five phrases to `/doctor:install`, five to `/doctor:setup`, five to `/doctor:speckit` and four to `/doctor:update` in `.skilled/commands/doctor/_routes.yaml` (routes at lines 626, 376, 65 and 758), and add four phrases to `/speckit:search` `userIntent.ownedSignals` in `.skilled/skills/system-spec-kit/command-metadata.json` (entry at line 215). The deriver copies these into the command bridge's embedding text and the TypeScript scorer. [SOURCE: .skilled/commands/doctor/_routes.yaml:65,376,626,758] [SOURCE: .skilled/skills/system-spec-kit/command-metadata.json:215] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:660-700]
3. `/create:skill-parent` needs a scorer row before its text can matter: add its four signals to `.skilled/skills/sk-doc/command-metadata.json` (entry at line 48), add a TypeScript activation entry in `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`, flip its generated `scorerRow` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:135` by rerunning `derive-command-bridges.cjs`, then re-embed. Its measured gain is 0 today, so it is a prerequisite, not part of this lane's +5/+2. [SOURCE: .skilled/skills/sk-doc/command-metadata.json:48] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:135] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/metadata/enriched-embedding-text.json]
4. The re-embed step already exists: rerun `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json`, whose handler calls `indexSkillMetadata` and then `refreshSkillEmbeddings` (`scan.ts:53-54`), so the changed bridge projection refreshes the command vectors. The scratch run proved the text-to-vector path is faithful at cosine 1.000000 and costs 0.15 s warm for five vectors plus two parity calls. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:49-62] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/metadata/reembed-report.json]
5. The measured gain is a lower bound because it is the vector half only. The build also adds lexical evidence: the same phrases live in `trigger_phrases` or `ownedSignals`, which the deriver copies into the TypeScript scorer. That half is unmeasured and is the build's real risk: a broad phrase such as "list every check this project has" could lift a near-miss or must-not-start row. The 0 of 35 false-offer gate is the control; if it moves, narrow the phrase before landing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:40-60,660-700] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/after-capture.json]
6. The build must recapture two baselines, not just the real capture. The fixture capture's hits depend on bridge metadata, so a metadata edit changes the committed ratchet and `capture-command-routing-baseline.mjs --write` must be rerun under the fixture regime. The real capture then proves the live numbers: tune 18 of 45 or better, holdout 5 of 44 or better, false offers 0 of 35, typed 24 of 44. The doctor route validators (`route-validate.sh`, `doctor-phrase-reach.cjs`) also run because the phrases land in `_routes.yaml`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:676-694]
7. The lane made no tracked change: every write is inside the lineage folder, and the target metadata files, the database and the generated bridge projection are clean in `git status`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite] [SOURCE: .skilled/commands/doctor/_routes.yaml]

## Ruled Out

- Declining the build: the measured cost of declining is 5 tune rows and 2 holdout rows left without a command, with no floor movement to justify the loss.
- Treating `/create:skill-parent` as part of the same gain: its measured gain is 0 until a scorer row exists, so folding it into the +5/+2 would overclaim.
- Claiming the lexical half as measured: the scratch capture read the tracked bridge projection, so the lexical addition is a build-time risk, not a measured gain.

## Dead Ends

- Enriching only the skill descriptions instead of command metadata: segment three rank 16 already declined it and measured 0 holdout gain; this lane's +2 comes from command vectors, not skill text.
- Reusing the doctor route `lead_phrases` mechanism: it is for leading a passing skill, not for adding volume to the embedding text, and it carries its own state-word constraint.

## Edge Cases

- Ambiguous input: the four doctor commands have no `command-metadata.json`; their owning file is `_routes.yaml`. The build edits the real owning file, as the lane's intent requires, and the scratch copy was a sidecar.
- Contradictory evidence: none. The vector-only result is internally consistent across three after runs.
- Missing dependencies: none for the five scored commands. `/create:skill-parent` has a missing scorer row, carried as a named prerequisite.
- Partial success: the lane measures the vector half and proves the floors; the lexical half and the exact floor confidence are build-time checks, not measured here.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md:75,95,209`
- `.skilled/commands/doctor/_routes.yaml:65,376,626,758`
- `.skilled/skills/system-spec-kit/command-metadata.json:215`
- `.skilled/skills/sk-doc/command-metadata.json:48`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:135`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:40-60,660-700`
- `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:49-62`
- `scratch/after-capture.json`, `scratch/before-capture.json`, `scratch/metadata/enriched-embedding-text.json`, `scratch/metadata/reembed-report.json`

## Assessment

- New information ratio: 0.35
- Questions addressed: KQ3
- Questions answered: KQ3

## Reflection

- What worked and why: keeping the decision tied to the two numbers that moved and the one floor that did not. The build case does not need the lexical half to be measured, because the vector half alone already pays +5 tune and +2 holdout with 0 of 35 false offers.
- What did not work and why: the first attempt to call this a "tune-only" gain was wrong; the per-command holdout counts show two commands gained a holdout row, so the honest label is "mostly tune, with two holdout rows".
- What I would do differently: in a build phase, measure the lexical half on the same six prompts before landing the phrases, because that is the only part this lane cannot bound.

## Recommended Next Focus

None. All three key questions are answered, the build decision and its files are named, and a further iteration would add no new measurement. The remaining work is the build phase's own recapture and validation.
