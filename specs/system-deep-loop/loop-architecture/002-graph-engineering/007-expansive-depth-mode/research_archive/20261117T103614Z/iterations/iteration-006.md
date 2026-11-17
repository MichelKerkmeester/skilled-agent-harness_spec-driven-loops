# Iteration 6: Q6, the file-by-file integration map for the expansive-depth sub-mode

## Focus

Q6. This iteration maps where the iteration 5 design (frontier nodes, admission, depth budget, frontier veto) attaches to the shipped surfaces, and how to keep default runs unchanged. The surfaces are: flag, config, workflow YAMLs, agents and prompt packs, reducer, mode registry, `convergence.cjs`, the append gateway, fan-out, the `quality_class` prerequisite and the `dispatch-iteration.cjs` config-dir fix. It also names the tests that guard the default path.

Interpretation: this is an integration plan (DESIGN). Code was read only to find exact anchors, and nothing was changed.

## Actions Taken

1. Read the Workflow Flag Surface tables in `.skilled/commands/deep/research.md` and `review.md`, and both config templates, including the `_optimizerManaged.lockedFields` block.
2. Read the mode registry entries (`.skilled/skills/system-deep-loop/mode-registry.json`).
3. Read the `buildStopDecision` order, `stopDecisionConfig` and `buildStopDecisionInput` in `convergence.cjs`.
4. Mapped the step anchors in `deep-research.yaml`: create_config, graph_convergence, dispatch, reduce_state, graph_upsert and the wave_orchestration appendix. Also mapped the review YAML's dispatch and graph steps.
5. Read the `dispatch-iteration.cjs` config-dir gating, the reducer's `resolveNextFocus` and its question-origin set, the gateway upcast call sites, the `fanout-run.cjs` prompt builder and the test inventory.

## Findings

### Flag and config

1. **Use a separate `--depth-mode=default|expansive` flag. Do not add a fifth `--convergence-mode` value.**
   - `--convergence-mode` is a single enum: `default | off | sliding-window | divergent` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:55] [SOURCE: .skilled/commands/deep/research.md:103] [SOURCE: .skilled/commands/deep/review.md:96] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:71].
   - Adding `expansive` there would make it mutually exclusive with `divergent` and `sliding-window`. Those two compose naturally with a frontier:
     - The divergent pivot fires only on a STOP candidate (finding 13).
     - Sliding-window only changes how novelty is scored.
   - A separate axis (`antiConvergence.depthMode`) keeps every existing mode value and its parse path unchanged. [INFERENCE: based on the enum and the composition in finding 13]

2. **`lockedFields` does not decide the flag question, but the new field must be added to it.**
   - `lockedFields` is the offline optimizer's do-not-tune list (`_optimizerManaged`, `promotionMode: advisory-only`), not an operator lock [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:76] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:80] [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:95].
   - So either flag shape is legal. Whichever ships, add `antiConvergence.depthMode` to both templates' `lockedFields` and to the optimizer manifest that `optimizer-manifest-anti-convergence.vitest.ts` asserts against [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/optimizer-manifest-anti-convergence.vitest.ts:125]. Otherwise the optimizer could turn widening on for runs that never opted in.

3. **Config templates.**
   - Add `"depthMode": "default"` beside `convergenceMode` in both `antiConvergence` blocks [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:5] [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:11].
   - Add an `expansiveDepth` object (`maxDepth` 3, `maxChildrenPerNode` 6, `maxFrontierNodes` 40, `depthShares`) that is read only when `depthMode == expansive`.
   - The YAML `step_create_config` already writes `antiConvergence.convergenceMode` and `antiConvergence.divergent: {}`, so the new keys go there too [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:554] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:555].
   - Readers must treat an absent key as `default`, because existing packets carry no `depthMode`.

### convergence.cjs

4. **The exact veto insertion point in the fixed order.** `buildStopDecision` runs these checks in order:
   1. cap
   2. 3 consecutive failures
   3. stuck → `STUCK_RECOVERY`
   4. `off`
   5. `stopPolicy=max-iterations`
   6. candidate selection (`all_dimensions_clean`, `all_questions_answered` or `composite_converged`)
   7. `noStopCandidate`
   8. research `minIterations` floor
   9. review gates → BLOCKED, or research guards → `qualityGuardFailed`
   10. `combineGraphDecision`

   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1115] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1130] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1150] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159]

   The frontier veto belongs immediately after the minIterations floor (8) and before gate and guard evaluation (9). It emits `CONTINUE` with `stopReason: null` and reasonDetail `frontierOpen`. This placement has three properties:
   - It only ever turns a STOP candidate into CONTINUE.
   - It never outranks the cap, failures or pause.
   - The frozen eight-value `stopReason` set is untouched. Only the reasonDetail vocabulary in the header comment grows [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:7].

5. **The veto's input already arrives. It needs no new CLI argument.**
   - `buildStopDecisionInput` already loads `files.registry` for both loop types and passes it to `stopDecisionResearchFacts` and `stopDecisionReviewFacts` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1595] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1407].
   - The YAML passes `--registry-path` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:947].
   - So `registry.frontier.stats` is readable in place.
   - `stopDecisionConfig` needs a `depthMode` passthrough, read from `antiConvergence` like `convergenceMode` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1343] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1361]. When it is `default` or absent, the veto branch is unreachable.

6. **Stuck precedes the veto, so "local stuck" belongs in the YAML, not in a reorder.**
   - `STUCK_RECOVERY` returns at step 3, before any candidate exists [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1130].
   - Reordering would change default behavior. So the expansive branch handles it in the YAML instead: under `depthMode=expansive`, the STUCK_RECOVERY handler first closes the active frontier node `exhausted` and advances focus. It falls through to the existing recovery only when no open node remains.
   - [INFERENCE: based on the order at convergence.cjs:1115-1189 and iteration 5 F11]

7. **The review floor is configured but never applied.**
   - The review template sets `antiConvergence.minIterations: 2` [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:12].
   - The floor check is gated `loopType === 'research'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159].
   - So a review run can stop at iteration 1 on `composite_converged`, whatever the config says.
   - Under expansive mode, the frontier veto supplies a structural floor for review. Fixing the default review floor itself would change default behavior and should be a separate, explicit decision. [INFERENCE: based on the two cited lines]

### Workflow YAMLs

8. **Where the new steps slot in (research YAML).** The loop order is: `step_graph_convergence` (947), `step_check_convergence` (963), `step_handle_convergence` (1034, which holds the divergent pivot), `step_dispatch_iteration` (1348, with `verify-iteration` at 1513), `step_reduce_state` (1577), `step_graph_upsert` (1599). [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1577] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1599]
   - **`step_frontier_admit`** goes after verify-iteration and before `step_reduce_state`. It reads this iteration's `frontier_proposal` delta rows, applies the six-rule admission order (iteration 5 F9) and writes accepted nodes as `research/inbox.jsonl` rows. The reducer then folds them in the same pass, and its `question_conflict` handling already covers inbox-against-registry text [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1589].
   - **`step_frontier_graph_upsert`** goes after `step_graph_upsert`. It upserts admitted nodes as QUESTION nodes with `DERIVED_FROM` edges to their parent, so traversal never depends on the leaf emitting graph events (iteration 5 F4).
   - Both steps carry `enabled_when: config.antiConvergence.depthMode == 'expansive'`, so the default step list is unchanged.
   - The review YAML has the same anchors: graph convergence at 978 and graph upsert at 1750 [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:978] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1750].
   - `step_check_convergence` needs no new branch for `frontierOpen`, because it is an ordinary CONTINUE. Only the STUCK_RECOVERY sub-branch from finding 6 is new.

9. **Do not promote `wave_orchestration`.** It is declared reference-only ("intentionally excluded from workflow.steps") and describes a 3-agent wave scored by median newInfoRatio [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2078] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2079]. Native and CLI fan-out (`fanout-run.cjs`, `step_fanout_spawn`) already cover parallel execution with merge and salvage. The frontier-partitioned fan-out (finding 12) supersedes the wave sketch, so the appendix should only gain a pointer to the depth-mode partition. [INFERENCE: based on iteration 3 F8 and the cited appendix]

### Agents and prompt packs

10. **Agent and prompt-pack contract: add rows to the existing delta, and add no new artifact.**
    - Add a `frontier_proposal` row type to the delta contract in `.skilled/agents/deep-research.md` (Step 9) and `.skilled/agents/deep-review.md`. Its fields are `{"type":"frontier_proposal","parentId","kind","label","scope","evidence":["path:line"],"iteration"}`.
    - Leaves propose and the workflow admits. Leaves never write the inbox. The agent's packet-scope lock already forbids that, because the inbox is not in its allowed-write list.
    - The prompt templates are `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` and its `deep-review` twin. They gain a conditional `## FRONTIER` block (the current node id, its scope, budget slice and depth) and the proposal row shape. The renderer emits the block only when `depthMode == expansive`, so a default prompt pack renders the same bytes. [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:54] [INFERENCE: based on iteration 5 F6]

### Reducer

11. **An unknown question origin silently becomes `operator`.**
    - `VALID_QUESTION_ORIGINS` is `angle-bank`, `analyst-strategy`, `operator` and the legacy-import origin [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:128].
    - `normalizeQuestionOrigin` maps anything else to `operator` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:204] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:206].
    - Inbox rows with `origin: "frontier"` would therefore be mislabeled with no error, and the frontier could not tell them apart from operator questions.
    - `'frontier'` must be added to the set. This is purely additive, because no existing row carries it.

12. **Reducer registry and Next Focus changes.**
    - `buildRegistry` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2480] gains a `frontier` field, built from frontier-origin inbox rows and status transitions. It is emitted only when the config opts in, so the default registry JSON stays byte-identical.
    - `resolveNextFocus` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2420] checks focus in this order:
      1. the divergent pivot's `registry.divergence.currentFocus` (2426);
      2. the BLOCKED-stop recovery;
      3. continuity focus;
      4. promoted idea.
    - The frontier branch (lowest depth, then uncovered, then oldest, per iteration 5 F12) belongs after the BLOCKED-stop recovery and before continuity. The pivot focus and blocked-gate recovery keep priority, and frontier ids replace the prose path that iteration 2 F6 showed can hijack focus.
    - The review reducer needs the twin change. Its file was not read this iteration.

### Mode registry and gateway

13. **Make expansive a flag, not a mode-registry entry.**
    - `mode-registry.json` declares exactly two modes. Each binds one `workflowMode`, `runtimeLoopType`, command, agent and packet: research → `/deep:research`/`deep-research`, and review → `/deep:review`/`deep-review` [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json].
    - A third entry would need its own command, agent, packet and `runtimeLoopType`. `dispatch-iteration.cjs` accepts only `--loop-type research|review` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:41].
    - Because expansive applies to both loop types, it is a modifier like `divergent`.
    - Composition with divergent: the veto converts STOP candidates to CONTINUE while the frontier is open. The Council pivot therefore fires only after the frontier is terminal. Each pivot round then reopens breadth with fresh questions that admission can take in. [INFERENCE: based on finding 4 and the pivot-on-candidate rule at research.md:103]

14. **The gateway research upcast: leave it alone and read from the deltas.**
    - The research path runs every record through `upcastLegacyDeepResearchRecord` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:180] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:406].
    - Widening it to keep frontier fields would touch the ledger schema for every research run, which is a default-path change.
    - Frontier state reaches the reducer through delta rows and inbox rows (iteration 5 F6), so the upcast needs no change. Its regression guard is `append-mode-event-legacy-seam.vitest.ts`.

### Fan-out

15. **Fan-out: every lineage gets the same topic today. Add a per-lineage scope binding.**
    - `buildLoopPrompt` puts the one shared `research_topic` into each lineage prompt, and the CLI args carry the same `--research-topic` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1548] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1670] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1775].
    - The precedent for a per-run, single-line, bounded binding already exists: `review_focus` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:185].
    - Under expansive mode, add a `frontier_scope:` binding, filled by partitioning the open depth-1 nodes round-robin across lineages. When the binding is absent, the prompt is unchanged.
    - The fan-in guard requires every depth-1 node to be accounted for across the merged lineages (iteration 5 F13). The guard belongs in the merge step `step_fanout_merge` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1712].

### Prerequisite and adjacent fixes

16. **The `quality_class` prerequisite changes defaults, so it ships separately.**
    - The mandated node shape has no `metadata` [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:54], so the graph `sourceDiversity` blocker is unsatisfiable (iteration 5 F1).
    - Adding optional `"metadata":{"quality_class":"primary|secondary|derived"}` to SOURCE nodes would let the graph STOP gate pass on default runs too. That changes when default research runs stop.
    - So it is a standalone defect fix with its own tests and changelog line. It is a prerequisite for expansive mode, not part of the opt-in.
    - Until it lands, the expansive branch reports the blocker as `notEvaluated` (iteration 5 F11). [INFERENCE: based on the template line and iteration 5 F1]

17. **The `dispatch-iteration.cjs` research config-dir fix, with exact anchors.**
    - The flag is `--claude-config-dir`, not `--config-dir`. The command-level `--config-dir` is an executor-group option that binds to it.
    - The usage gate requires the flag only when `executor === 'cli-claude-code' && loopType === 'review'`, and rejects it otherwise: "only valid with --executor cli-claude-code --loop-type review" [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:213] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:219].
    - `configDir` is computed only for review [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:355]. It reaches the child as `CLAUDE_CONFIG_DIR` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:389].
    - The review YAML appends `--claude-config-dir "{optional_claude_config_dir}"` to the claude-code dispatch [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1519]. The research YAML does not [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1442].
    - The fix has three parts:
      - (a) widen the gate at 213-219 to accept, but not require, the flag for research;
      - (b) drop the `loopType === 'review'` guard at 355;
      - (c) append the same optional arg in the research `if_cli_claude_code` command.
    - Whether `fanout-run.cjs` forwards the per-lineage config-dir for research was not checked this iteration.
    - This fix is independent of expansive mode. It changes behavior only when the flag is given, so default runs are unaffected.

### Tests

18. **Tests that prove default behavior is unchanged.** All exist under `.skilled/skills/system-deep-loop/runtime/tests/`.
    - **Stop path:** `stop-decision.vitest.ts`, `stop-decision-yaml-contract.vitest.ts`, `convergence-script.vitest.ts`, `convergence-score-delta.vitest.ts`, `deep-research-convergence-floor.vitest.ts`, `review-depth-convergence.vitest.ts`.
    - **Reducer:** `deep-research-reduce-state.vitest.ts`, `deep-research-reducers.vitest.ts`, `deep-review-reducers.vitest.ts`, `deep-review-state-reducer.vitest.ts`.
    - **Gateway:** `append-mode-event-cli.vitest.ts`, `append-mode-event-legacy-seam.vitest.ts`.
    - **Fan-out:** `fanout-run.vitest.ts`, the `fanout-merge*.vitest.ts` set, `fanout-pool.vitest.ts`, `deep-research-postflip-fanout.vitest.ts`.
    - **Dispatch and config:** `dispatch-iteration.vitest.ts`, `executor-config.vitest.ts`, `optimizer-manifest-anti-convergence.vitest.ts`.
    - **Pivot:** `divergent-pivot.vitest.ts`, `divergent-pivot-cli.vitest.ts`.
    - Three new tests are needed, each with a real failure reason no current test catches:
      - (1) a golden test: with `depthMode` absent, the reducer registry, dashboard and Next Focus are byte-identical to the current output, and the rendered prompt pack is byte-identical;
      - (2) a stop-decision table test: `frontierOpen` appears only when `depthMode=expansive` and open nodes exist, and never outranks cap, failures or stuck;
      - (3) a reducer test: a `frontier`-origin inbox row keeps its origin (the regression guard for finding 11).

    [SOURCE: test listing of .skilled/skills/system-deep-loop/runtime/tests/unit and integration]

## Questions Answered

- Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?

## Questions Remaining

- None of the strategy key questions remain open. Three narrow verification items are left:
  - the review reducer's Next Focus twin (finding 12);
  - whether `fanout-run.cjs` forwards the per-lineage claude config-dir on research (finding 17);
  - a read-only `convergence.cjs` run on this packet to confirm the graph blockers (iteration 5's carried check).

## Ruled Out

- **A fifth `--convergence-mode` value:** it would make the mode exclusive with divergent and sliding-window (finding 1).
- **A mode-registry entry:** the loop-type enum and the one-to-one command/agent binding forbid it (finding 13).
- **Promoting `wave_orchestration`:** fan-out already covers parallel execution (finding 9).
- **Widening the gateway upcast:** it would change the default path (finding 14).
- **Reordering stuck after the veto in `convergence.cjs`:** it would change default ordering (finding 6).

## Dead Ends

- None new.

## Edge Cases

- **Ambiguous input:** "--config-dir fix" could mean the command flag or the dispatcher flag. The dispatcher flag is `--claude-config-dir`, and the command's `--config-dir` binds to it (finding 17).
- **Contradictory evidence:** the review config declares `minIterations: 2`, but the stop code applies the floor only to research. Both sides are cited in finding 7. The question is unresolved by design, because fixing it is a default-path change for the operator to decide.
- **Missing dependencies:** the review reducer's Next Focus code and the `fanout-run.cjs` config-dir forwarding were not read. Findings 12 and 17 mark these as unverified.
- **Partial success:** none.

## SCOPE VIOLATIONS

- scope_violation (not executed): `progressiveSynthesis` is true, but this iteration's allowed-write list names only this narrative, the delta file and the gateway's writes. `research/research.md` was not touched, as in iterations 4-5.

## Sources Consulted

- .skilled/commands/deep/research.md:92-120; .skilled/commands/deep/review.md:85-123
- .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:5-14, 76-80; deep-review/assets/deep-review-config.json:11-20, 95
- .skilled/skills/system-deep-loop/mode-registry.json
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-17, 55, 1100-1189, 1343-1364, 1593-1636
- .skilled/commands/deep/assets/deep-research.yaml:71, 539-555, 947, 1408, 1442, 1577-1606, 1712, 2078-2083; deep-review.yaml:978, 1485, 1519, 1750
- .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:41, 213-219, 355-389
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:128-133, 204-206, 2420-2474, 2480
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:180, 406-427
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:31, 185-207, 1548, 1666-1670, 1775
- .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:54
- runtime/tests unit and integration listings

## Assessment

- New information ratio: 0.86. Of 18 findings, 14 are new (1, 2, 4, 5, 6, 7, 8, 9, 11, 13, 14, 15, 17, 18) and 4 are partly new (3, 10, 12 and 16 refine iteration 5): (14 + 0.5 × 4) / 18 = 0.889. I report 0.86 to discount the design-only content in findings 8, 10 and 12.
- Questions addressed: Q6, plus the Q7 fix anchors.
- Questions answered: Q6.

## Reflection

- **What worked and why:** anchoring on function and step names (`buildStopDecision`, `resolveNextFocus`, `step_reduce_state`) with a single `rg` per file gave exact insertion points cheaply. Reading the origin normalizer turned up a silent mislabel that a design read alone would have missed.
- **What did not work and why:** the review-side reducer and the fan-out config-dir forwarding fell outside the 24-call budget.
- **What I would do differently:** verify the review reducer's focus function and `fanout-run.cjs` executor-arg forwarding first, because both are single greps.

## Recommended Next Focus

All key questions are answered. The remaining iterations should verify rather than widen:
- (1) Run `convergence.cjs --stop-decision` read-only on this packet and confirm the graph blockers.
- (2) Read the review reducer's Next Focus function and `fanout-run.cjs` claude config-dir forwarding.
- (3) Draft the phased implementation order:
  - prerequisite fixes first: `quality_class`, research config-dir, the `frontier` origin;
  - then flag and config, convergence veto, reducer frontier, YAML admission, and agents and prompt pack;
  - fan-out last.

## Next Focus

Verification pass: read-only convergence run on this packet, review reducer focus twin, fan-out config-dir forwarding, then a phased implementation order.
