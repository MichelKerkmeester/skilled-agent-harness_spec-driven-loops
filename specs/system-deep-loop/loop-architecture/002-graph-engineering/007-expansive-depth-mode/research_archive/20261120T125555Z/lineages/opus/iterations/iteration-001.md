# Iteration 1: Restraint, part A (frontier logic duplicated across reducers, convergence and admission; config and YAML dead weight)

## Focus
Frontier node F-1-001 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts, .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/commands/deep/assets): Restraint: what can be deleted, merged or collapsed across frontier-admit.cjs, the deep-research and deep-review reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two deep workflow YAMLs while every promise of the expansive-depth modes stays kept? Name concrete deletions with file:line.

Interpretation: this pass covers the frontier-binding code shared by the two reducers, convergence.cjs and frontier-admit.cjs, plus dead config and YAML boilerplate. Part B, next iteration, covers fanout-run.cjs completion and adapter code and the larger YAML step families. The review reducer lives at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`; there is no `deep-review/scripts/reduce-state.cjs`.

## Actions Taken
1. Grepped the four scripts for the node marker, evidence-bearing filter, node statuses, band budget and stuck counter.
2. Read the research frontier projection, focus pick and visit counter (research reduce-state.cjs 2440-2534) and the review frontier projection (runtime reduce-state.cjs 1940-2030).
3. Read convergence.cjs deriveLoopCounters and the node-binding rule (1350-1470, 1770-1790).
4. Read the research branch of `frontier-admit.cjs block` (1003-1020).
5. Counted config-key aliases in fanout-run.cjs and searched live `.skilled` docs and tests for any use of the non-canonical names.
6. Counted inline `node -e` programs and gateway fallback lines in both YAMLs, and checked whether `migrationWindowDays` has a reader.

## Findings
1. **One node-marker rule, three copies.** The "Frontier node <id>" marker is parsed three ways: anchored with a trailing space at `frontier-admit.cjs:1014` (`/^Frontier node (\S+) /`), unanchored and bounded at `deep-research/scripts/reduce-state.cjs:2493`, and bounded again at `convergence.cjs:1362-1364`. A focus that a leaf reworded so the marker is not first still counts as a visit in the reducer, but the block renders nothing for it. **Change:** export `frontierMarkerPattern` and `iterationBoundToNode` from convergence.cjs (it already exports the binding to the review reducer, `runtime/scripts/reduce-state.cjs:18-23`) and delete the research reducer's local regex in `frontierNodeVisitRecords` (`deep-research/scripts/reduce-state.cjs:2491-2501`). Value M, effort S, risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:1014] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2493] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1362]
2. **Two frontier projections share one algorithm.** Research `buildFrontierProjection` + `pickFrontierFocus` + `applyFrontierBudget` (`deep-research/scripts/reduce-state.cjs:2453-2534`) and review `buildReviewFrontier` (`runtime/scripts/reduce-state.cjs:1960-2030`) each do the same four things: count evidence-bearing visits per node, derive `answered` without writing it back, apply `applyBandBudget`, and pick breadth-first by (depth, visits, iteration, nodeId). Only the answered predicate differs: research uses inbox question resolution, review uses dimension coverage. **Change:** move one `projectFrontier({nodes, history, iterationRecords, isAnswered, maxIterations, budgetSplit})` into frontier-admit.cjs, the node store's owner, and delete both copies. Value H: one focus rule for both loops, and research gains `activeNodeId` for free, which per-node stuck counting needs (F-1-003). Effort M, risk medium, because reducer golden tests cover both outputs. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2453] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1960] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2026]
3. **Research binds its node through a focus file; review passes `--node-id`.** `renderFrontierBlock` takes the node id whole for review and regex-parses a focus string for research (`frontier-admit.cjs:1007-1018`). So a research fan-out lineage must write `frontier-focus.txt` before every iteration (`fanout-run.cjs:1847`), and the review prompt has no such step (`fanout-run.cjs:1854`). **Change:** once Finding 2 gives research `registry.frontier.activeNodeId`, call `block --node-id` for both loops. Then delete the `focus-file` flag, `readFocusFile` (`frontier-admit.cjs:1153`, `1221`), the research parse branch, and the focus-file sentence of the fan-out prompt. Value M: one write and one parse failure mode fewer per iteration, and identical leaf instructions across loops. Effort S once Finding 2 lands, risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:1007] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1847] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1854]
4. **fanout-run.cjs accepts 24 spellings for five knobs, and the "token" spellings misname the unit.**
   - The aliases: per-lineage cost cap, 10 aliases (`fanout-run.cjs:1388-1400`); aggregate cap, 4 (`1458-1463`); post-exit grace, 6 (`2052-2059`); stall watchdog, 4 (`1374-1379`); plus the allowlist at `35-36` and `315-319`.
   - The unit is iterations, not tokens: `cost_units_per_iteration` defaults to 1 and the cap defaults to 72 (`1386`, `1402-1407`). So `maxTokensPerLineage`, `maxTokenBudget*` and `estimatedTokensPerIteration` imply token metering that does not exist.
   - Usage: no live `.skilled` doc, command or test uses a non-canonical alias. The only hits outside fanout-run.cjs are archived lineage logs and spec research notes.
   - **Change:** keep the camelCase and snake_case canonical pair per knob and delete the token-named and `orchestrator*`/`postSubprocess*` aliases. A one-release warning names the canonical key.
   - Value M (operator clarity), effort S, risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1386] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1395] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1461] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2057]
5. **The legacy artifact-name migration has outlived its stated window, and its window field has no reader.**
   - `step_resolve_canonical_names` declares "dual-read / single-write for 4 weeks" (`deep-research.yaml:489-504`). `step_record_artifact_migration` appends the migration row (`deep-research.yaml:1118-1123`).
   - `migrationWindowDays: 28` sits in the config template (`deep-research/assets/deep-research-config.json:73`), but no script under `.skilled` reads it.
   - The field has existed since at least 2026-09-17 (`git log -S`, commit 330427cf308), more than 9 weeks before HEAD.
   - **Change:** delete `migrationWindowDays`, the `inspect_legacy` read and the migration-row step. A packet that still carries the old names would then classify as invalid-state, and the operator renames five files by hand.
   - Value S-M, effort S, risk low.
   - The review YAML's separate `LEGACY_REVIEW_STATE_MOVED` path (`deep-review.yaml:520`, `781`, `1205`) was not checked this pass. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:497] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1118] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:73]
6. **The gateway fallback path does not exist in this repo, and it is pasted 11 times.** `[ -f "$GATEWAY" ] || GATEWAY="scripts/append-mode-event.cjs"` appears at `deep-research.yaml:536`, `866` and `2202`, and 8 times in deep-review.yaml (first at `567`, `800`, `1041`). There is no `scripts/append-mode-event.cjs` at the repo root (`ls` fails); the same holds for the `synthesis-closeout.cjs` fallback. **Change:** delete the fallback lines and reference `state_write_protocol.command` (`deep-research.yaml:157`) from each step. Value low-M, effort S. Risk low, provided no vendored layout runs the YAML with the skill root as cwd; that is unverified, so check `doctor:overlay` layouts first. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:536] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:567] [INFERENCE: based on `ls scripts/append-mode-event.cjs` failing at the repo root]
7. **Inline JavaScript in the YAMLs is the main source of cross-runtime variance.** deep-research.yaml carries 7 `node -e`/`node -p` programs and deep-review.yaml 8. The largest is the `--extend` program, about 90 lines (`deep-research.yaml:534-630`); the run-open event builder is about 45 (`858-905`). Each model must transcribe and placeholder-substitute these verbatim at run time, and that is exactly the step where CLI runtimes diverge. **Change:** move each program into a named runtime script, `runtime/scripts/lifecycle.cjs extend|open-run|bind-prior-lineage`, and leave one command line per step. Value H (parity and testability), effort M, risk low. The behavior is already specified by the inline code. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:534] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:858] [INFERENCE: based on the grep counts of `node -e` in both YAMLs and this lineage having to hand-substitute the run-open program during init]

## Questions Answered
None fully. F-1-001 stays open until part B, which covers fanout-run.cjs completion and adapter code, convergence.cjs size, and the YAML confirm and dry-run scaffolding.

## Questions Remaining
- F-1-001 part B.
- F-1-003 (stuck per node, lineage completion rule, pivot admission).
- F-1-005 (prior art).

## Ruled Out
- Merging the two reducers wholesale. Their registries, dashboards and answered predicates differ (question resolution versus dimension coverage), so only the frontier projection is shared code. [INFERENCE: based on the reducer comparison above]

## Dead Ends
None this pass.

## Edge Cases
- Ambiguous input: "the deep-review reduce-state.cjs" resolves to `runtime/scripts/reduce-state.cjs`. Recorded in Focus.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Workflow Deviations (recorded, not blocking)
This lineage skipped these YAML steps because they write outside the lineage directory or run tooling the dispatch forbids:
- `step_detect_spec_present` and `step_preinit_spec_branch`, which edit spec.md
- `step_validate_preinit_spec_doc` and `step_validate_post_synthesis_spec_doc`, which run validate.sh
- `step_writeback_spec_findings`, `step_stage_artifact_dir` (git add) and `phase_save` (generate-context.js)

It also skipped `step_telemetry_heartbeat_started`, because the fan-out runner tracks lineage status. `step_frontier_seed` and `step_frontier_budget` are skipped by their own `skip_when` for a fan-out lineage.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:93-135, 1003-1020
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:24-31, 2440-2534, 3040-3055
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:11-30, 1940-2030
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1350-1470, 1770-1790
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:35-36, 1370-1410, 1450-1465, 1840-1860, 2045-2060
- .skilled/commands/deep/assets/deep-research.yaml:489-504, 524-640, 858-905, 1118-1123
- .skilled/commands/deep/assets/deep-review.yaml:520, 567, 781, 800, 1041, 1205
- .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:73

## Assessment
- New information ratio: 0.93
- Questions addressed: F-1-001
- Questions answered: none

## Reflection
- What worked and why: grepping shared identifiers (the marker phrase, `applyBandBudget`, `NODE_STATUSES`) across all four scripts surfaced the duplicated rules faster than reading any file top to bottom.
- What did not work and why: `git log -S` gives only a lower bound on the migration window's age. The YAML moved and was reformatted, so the original commit is not visible this way.
- What I would do differently: for part B, go straight to fanout-run.cjs section headers and the YAML `applies_to: confirm` and `dry_run_boundary` counts, rather than function lists.

## Recommended Next Focus
F-1-001 part B:
- fanout-run.cjs completion and synthesis-name tolerance (`1225-1345`)
- the `LINEAGE_COMMAND_ADAPTERS` table (`3557`)
- the size of convergence.cjs (2115 lines)
- the confirm and dry-run scaffolding repeated across both YAMLs

Then F-1-003.
