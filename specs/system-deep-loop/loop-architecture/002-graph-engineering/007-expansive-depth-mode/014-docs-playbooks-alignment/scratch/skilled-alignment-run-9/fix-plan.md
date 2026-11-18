# Fix plan

Target: HEAD; head: 0a845d0d8ef0b1d3c48a2b14560196358a38d961

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] A-1 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts:2 The file header uses a `// TEST:` marker where the SKILLED TypeScript checklist's P0 File Header item and the TypeScript style guide declare `// MODULE: [Module Name]`. 211 of the 213 test files under
  fix: // TEST: Research default-path golden byte identity -> // MODULE: Research Default Path Golden Byte Identity
- [ ] X-5 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/council/divergent-pivot-seat-cap-and-retry.md:46 The HOW IT WORKS section says "the research and review command workflows reopen the pivot once as attempt 2", but the Implementation table lists only `deep-review.yaml` as the command workflow. `deep-
  fix: | `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | Reopens the pivot once as attempt 2 after a retr -> | `.skilled/commands/deep/assets/deep-research.yaml` | Command workflow | Reopens the pivot once as attempt 2 after a re
- [ ] A-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:437 The admission `budget` check can never prune. It fires only when both `proposal.budget` and `parent.budget` are finite numbers, but no writer ever puts a `budget` field on a node row: `admitProposals`
- [ ] A-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:254 `readCaps` and `seedBudget` derive the run-wide node cap from the same `maxIterations` value with different coercion, so they disagree whenever the config value is not already a finite positive number
- [ ] B-3 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:620 The `upsert.cjs` entry still describes only the pre-change behaviour. This change added 276 lines to `runtime/scripts/upsert.cjs`: the `--state-log`, `--delta-dir` and `--iteration` inputs, `resolveRe
- [ ] X-1 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md:16 The entry says the merged review registry carries three coverage surfaces, candidate, dimension and search. `mergeReviewCoverageSurfaces` at `fanout-merge.cjs:1048` returns six: it adds `traceability`
- [ ] X-2 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:19 `fanout-merge.cjs` gained 223 lines and nine new functions in this change: `qualifyFrontierId`, `mergeResearchFrontier`, `mergeReviewCoverageSurfaces`, `mergeDimensionCoverage`, `mergeTraceability`, `
- [ ] X-3 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:19 `fanout-run.cjs` gained 137 lines in this change: `partitionFrontierNodes`, `writeLineageFrontierStore`, the `frontier_scope` prompt binding, `frontierPartition` in `orchestration-summary.json`, `dept
- [ ] X-4 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:19 `convergence.cjs` gained 79 lines in this change: the `frontierOpen` veto, the review-only `frontier_drained` hard candidate, the `minIterations` floor with `minIterationsNotReached`, and `depthMode` 

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B-4 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:465 The reference contradicts itself on who writes the review node store. Line 465 says `frontier-admit.cjs --target review` 'is its only writer'; line 469 of the same file says 'Each lineage's store is w
  fix: A review run has no inbox, so the store alone queues an admitted node, and `runtime/scripts/frontier-admit.cjs --target  -> A review run has no inbox, so the store alone queues an admitted node, and `runtime/scripts/frontier-admit.cjs --target 
- [ ] C-02 P2 .skilled/skills/system-deep-loop/deep-review/README.md:139 The State on Disk table lists every file under `{spec_folder}/review/` except `frontier-nodes.jsonl`, while the depth-mode paragraph at line 158 tells the reader 'Node status lives in `review/frontier
  fix: | `iterations/iteration-NNN.md` | One write-once file per iteration | -> | `iterations/iteration-NNN.md` | One write-once file per iteration | | `frontier-nodes.jsonl` | Frontier node rows, wri
- [ ] X-7 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:594 `frontier_drained` is a new hard stop candidate in this change (`convergence.cjs:1183`), documented in the review SKILL.md, README, quick-reference, loop-protocol, convergence reference and expansive-
- [ ] C-04 P2 .skilled/skills/system-deep-loop/deep-review/README.md:158 The new depth-mode paragraph is one 367-word block whose sentences average 28 words and reach 46, against the standard's 'short paragraphs of short sentences, about 10-15 words each and about 60 words

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] X-8 P2 .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:81 The new Frontier Node Store paragraph says `runtime/scripts/frontier-admit.cjs` "is the only writer" of `research/frontier-nodes.jsonl`. `deep-research/references/protocol/loop-protocol.md:421`, added
  fix: `runtime/scripts/frontier-admit.cjs` is the only writer. -> `runtime/scripts/frontier-admit.cjs` is the only writer of node status; a fan-out lineage's store is seeded once by `fan
- [ ] C-01 P2 .skilled/skills/system-deep-loop/deep-research/README.md:107 The Packet Files table is this README's only inventory of what a run writes, and it omits `frontier-nodes.jsonl`, the node store `--depth-mode=expansive` creates under `{spec_folder}/research/`. The f
  fix: | `.deep-research-pause` | Operator | The pause sentinel checked before each dispatch | -> | `.deep-research-pause` | Operator | The pause sentinel checked before each dispatch | | `frontier-nodes.jsonl` | Front
- [ ] X-6 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:135 `--extend-minutes=M` is a new operator flag in this change, bound in both workflow YAMLs (`deep-research.yaml:70`, `deep-review.yaml:60`) and documented in both command docs, both presentation files, 
- [ ] B-1 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:49 The frontier-to-coverage-graph mirror is a new shipped capability of this change with no feature-catalog entry anywhere in the skill. The deep-research workflow gained a step that runs `frontier-admit
- [ ] B-2 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:909 The same new capability has no manual-testing scenario. The deep-research playbook's expansive set stops at DR-073 (fan-out partition): DR-068 covers the flag default, DR-069 the seed, DR-070 admissio
- [ ] C-03 P2 .skilled/skills/system-deep-loop/deep-research/README.md:127 The depth-mode paragraph gives the derived budget as `min(24, max(10, 2 x (S + maxDepth - 1)))` and stops there, so a reader computing S=0 gets 10 iterations. A fan-out research lineage dealt no seed 
- [ ] C-06 P2 .skilled/skills/system-deep-loop/deep-research/README.md:199 The FAQ answer documents `--extend=N` as the source of `completed-continue` and never names `--extend-minutes=M`, the companion flag the same command binds. The flag ships in both workflow YAMLs and i

### unowned

- [x] BAT-01 P2 -:- S9-command-references failed (exit 1). [handed off]

## Pre-existing or outside the scope

### unowned

- [x] D-03 P2 .skilled/commands/scripts/validate-command-references.cjs:134 Confirmed cause of the S9-command-references battery failure, and it is not in the eight S9 scope files: the validator's gitignored-runtime-state skip list exempts .skilled/skills/.state/ and .skilled (pre-existing (critic)) [handed off]
  fix: if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; -> if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; // The spec-kit ind
- [x] C-05 P2 .skilled/changelog/skilled/v4.1.0.0.md:1 The newest root release notes describe no capability this scope adds. `--depth-mode=expansive`, `--extend=N`, `--extend-minutes=M` and custom review dimensions appear nowhere in the entry, so an opera (unchanged in range) [handed off]

### skill:.skilled/skills/system-deep-loop

- [x] D-01 P2 .skilled/skills/system-deep-loop/SKILL.md:45 The hub's stage-one routing prose asserts that three sources are checked against hub-router.json vocabularyClasses: the mode-registry aliases, each packet's `Keyword triggers:` line, and the root ROUT (pre-existing (critic)) [handed off]
- [x] D-02 P2 .skilled/skills/system-deep-loop/hub-router.json:37 review-aliases carries the generic phrase 'review request', which skill-hub-routing.md section 4 names as the failure shape: a term that also matches unrelated work captures traffic the hub cannot ser (pre-existing (critic)) [handed off]

