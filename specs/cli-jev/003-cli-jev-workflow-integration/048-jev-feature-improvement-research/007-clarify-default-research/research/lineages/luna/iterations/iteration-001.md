# Iteration 1: Result Arithmetic and Measurement Target

## Focus

Explain the measured `keep` result, separate `none_of_these` abstentions from mode selection, and test whether the command that produced the result replayed compiled clarifications.

## Actions Taken

- Read the 020 feature contract, scorer, 047 result report, label card, raw labeled rows, report JSON, stdout, and call log.
- Independently joined the 54 labels to the 162 choice calls and recomputed each row's modal pick and first-alternative baseline.
- Read the scorer's separate census and score paths, then compared the fixture's hubs with current mcp-tooling and sk-code routers.

## Findings

1. **The keep is arithmetically correct under the frozen rule, but it counts abstaining as a correct answer.** `M=K=54` passes coverage; `A-B=13`, so `10*(A-B)=130 >= 54`; `W=17, L=4` yields the reported one-sided paired sign probability `0.003599`; and `10*F=100 <= 3*M=162`. Jev is correct on 28 rows, the first alternative on 15, with 17 Jev-only wins and 4 baseline-only wins. The rule treats `none_of_these` as a valid label and increments abstentions separately. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:621-672`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/report.json:2-18`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:150-166`]

2. **Most measured advantage comes from rejecting both options.** Recomputing modal picks from the calls and joining them to labels gives Jev 12/34 on `none_of_these` versus 0/34 for the first-alternative baseline. On the 20 named-mode labels, Jev is 16/20 and the baseline is 15/20. Of Jev's 17 wins, 12 are `none_of_these` wins (about 71%); all four losses are on named-mode rows. Thus the headline is evidence that Jev often recognizes that neither candidate fits this fixture, while its net advantage at naming a mode is one row in this sample. [SOURCE: `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl:1-163`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/report.json:5-18`]

3. **The recorded score run did not verify that its supplied rows were actual compiled-router clarifications.** The separate `runCensus` path calls each engine with `evaluate(snapshot, { prompt })`, reads its `clarify.alternatives`, and keeps mode alternatives; `runScoreCommand` instead reads the supplied rows, validates labels against those rows, and sends their prompts straight to Jev. The recorded command was `--score ... --jev --out`. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:106-155,445-485,1156-1205`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`]

4. **At least 19/54 rows do not match the ordinary tie-to-clarify surface described by feature 020.** The fixture has 12 mcp-tooling and 7 sk-code rows. Feature 020 says mcp-tooling never clarifies and sk-code has no clarify branch; current mcp source routes near ties as bundles, while current sk-code source also routes ordinary near ties as bundles and only calls its clarify helper when a `clarify` constraint is present. The score row shape contains no constraints and the score path never replays the engine, so these rows are not demonstrated eligible ordinary clarify examples. The sk-code spec statement is also too broad: a controlled clarify branch does exist. The other 35 rows remain unverified by the score command as well. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:70,88-93`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs:107-116,130-157`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:165-180,221-263`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1156-1205`]

5. **The fixture-source and label-provenance claims need reconciliation before the result is used as rollout evidence.** The results table and scorer stdout describe committed canary, playbook, and routing-corpus prompts, while every row in the scored file has `source: "fixture-047"` and no `gold`. The 042 label card says the row shape has no labeler field and only operator-confirmed values may reach `label`; the run report calls the labeler a delegated arbiter. The scorer's `operator=54` counter only counts values read from `label`, not who confirmed them. This does not prove labels were unconfirmed, but independent provenance cannot be established from these artifacts. Claims about accuracy therefore remain conditional on both fixture eligibility and label validity. [SOURCE: `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt:1-12`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`; `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md:71-84`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1175-1178`]

6. **A keep does not yet authorize a served default.** The feature spec explicitly says keep serves nothing and leaves a live front-door judgment out of scope. The runtime wrapper exposes `action`, selection kind, targets, policy hash, and generation but drops clarify alternatives; the front door prints that wrapper result. A serving seam and an explicit later integration decision are still required. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,150-166,212-214`; `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108`; `.skilled/bin/compiled-route.cjs:26-51`]

## Questions Answered

- **What drove the result?** The exact paired keep rule passes, but 12 of 17 wins come from the 34 `none_of_these` rows. Within named-mode labels, the measured improvement over first alternative is 16/20 versus 15/20. This is a fixture-conditional result, not yet an estimate for production clarify traffic.
- **Was the scorer measuring only genuine compiled clarifications?** The score-only invocation does not perform that check. At least 19 fixture rows are inconsistent with ordinary clarify behavior in their stated hubs; the remaining rows are not replay-verified either.

## Questions Remaining

- Were all 54 labels confirmed under the operator-only contract, and can that be audited row by row?
- Which rows replay to an actual `action: clarify` with two valid modes under the same compiled build and input fields used in production?
- How does accuracy change by hub, by `none_of_these` versus named mode, and on held-out real clarify traffic?
- What is the live clarify rate and per-request price/latency at the selected provider?

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md`
- `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/report.json`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `.skilled/bin/compiled-route.cjs`
- Prompt pack: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/lineages/luna/prompts/iteration-001.md`

## Assessment

- `newInfoRatio`: 0.92
- Novelty: first-pass reconstruction exposes the gap between the scorer's accepted row set and the population named by the feature, and decomposes a previously headline-only result into abstention versus mode-selection performance.
- Confidence: high for code-path and arithmetic claims; medium-high for per-class recomputation from the recorded calls; low for any claim about labeler identity or production generalization because those artifacts do not establish it.
- Scope: no code or packet files were changed. No model calls were made.

## Reflection

Reading the score and census paths separately was productive: they answer different questions. The p-value is correctly computed for the frozen paired sign test, but neither that rule nor a blinded label description repairs an unverified sample frame. `none_of_these` is useful abstention behavior; it cannot itself be the mode preselected by a default.

## Recommended Next Focus

Audit measurement trust and propose a replay-verified, provenance-preserving, hub-stratified benchmark; quantify what the run logs do and do not say about latency, calls, and price.

## Scope Boundary

No scope-violating write was executed. The YAML's packet `spec.md` seed/writeback, strict validation, external staging, and continuity save were excluded because their write surface is outside the exact lineage allowed by the user.
