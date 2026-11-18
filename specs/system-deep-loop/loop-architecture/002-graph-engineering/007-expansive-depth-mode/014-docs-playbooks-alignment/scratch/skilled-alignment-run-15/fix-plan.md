# Fix plan

Target: HEAD; head: 83af96cb5af5dca28f6da0676955d773a8f693d0

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] A1-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:580 The comment in admitProposals says a 'missing or unreadable' review config gives the no-target object and admits every scope. An unreadable or unparsable config does not do that. readTargetConfig (lin
  fix: // A missing or unreadable review config gives the no-target object, which -> // A missing review config, or one that holds no JSON object, gives the no-target object, which
- [ ] A3-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:556 The diff rewrote the step-2 comment (:500-504) to say the projected state row now carries the route-proof fields and the delta is only a fallback for older rows, but the step-4 comment it governs stil
  fix: // before the projection dropped it. Only a mismatch in BOTH is a failure. -> // for a state row written before the projection carried it. Only a mismatch in BOTH is a failure.
- [ ] A3-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:568 The reworded warning says the state row 'lacked route proof', but stateRouteReason comes from checkRouteProof (:256-273), which returns ROUTE_PROOF_MISMATCH as well as ROUTE_PROOF_MISSING. A state row
  fix: the ${stateLogName} state row lacked route proof, so the delta carried it -> the ${stateLogName} state row failed route proof (${stateRouteReason}), so the delta carried it
- [ ] A4-1 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:798 The test titled '... extends under the lock, before classification ...' compares extendAt against lockAt without first asserting the step_acquire_lock anchor was found. If step_acquire_lock is renamed
  fix: expect(extendAt).toBeGreaterThan(lockAt); -> expect(lockAt).toBeGreaterThan(-1); expect(extendAt).toBeGreaterThan(lockAt);
- [ ] B3-5 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/research-prompt-pack-contract.md:44 A role cell in the source table records change history ('Checked, not edited by this change.'). A feature catalog describes current shipped behavior, and this sentence goes stale once the change is no
  fix: The rule the rendered pack must match. Checked, not edited by this change. | -> The rule the rendered pack must match. |
- [ ] B3-6 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:43 Current-state catalog text uses change-history wording ('The floor now applies to review as well as research').
  fix: The floor now applies to review as well as research. -> The floor applies to review as well as research.
- [ ] B3-7 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:604 The convergence.cjs root entry uses change-history wording ('now applies to review as well as research') in a current-state catalog.
  fix: The `minIterations` floor (`minIterationsNotReached`) now applies to review as well as research. -> The `minIterations` floor (`minIterationsNotReached`) applies to review as well as research.
- [ ] B3-8 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:74 The per-feature HOW IT WORKS text uses change-history wording ('Each CLI lineage now keeps its coverage graph').
  fix: Each CLI lineage now keeps its coverage graph in -> Each CLI lineage keeps its coverage graph in
- [ ] B3-1 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:106 The runtime playbook's release-clearance rule still names 56 scenarios after this diff added DLR-060 to DLR-066. The overview at line 39 says 58, the category counts sum to 58, and there are 58 scenar
  fix: Release is cleared only when all 56 scenarios are -> Release is cleared only when all 58 scenarios are
- [ ] B3-2 P2 .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:229 The new section 9 package index gives deep-research 72 scenarios. The deep-research package root says 74, and the package holds 74 scenario files (75 .md files minus the command-flow-stress-tests READ
  fix: | `deep-research` | 72 | 9 | -> | `deep-research` | 74 | 9 |
- [ ] B3-3 P2 .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:231 The new section 9 package index gives runtime 56 scenarios. The runtime package root overview says 58, and the package holds 58 scenario files.
  fix: | `runtime` | 56 | 12 | -> | `runtime` | 58 | 12 |
- [ ] B3-4 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:678 This diff edits the FAN-OUT category intro, and the edited line keeps the packet-history phrase 'added in packet 124'. The evergreen packet-id rule (sk-doc shared/references/evergreen-packet-id-rule.m
  fix: validating the opt-in multi-executor fan-out layer added in packet 124: -> validating the opt-in multi-executor fan-out layer:
- [ ] A2-1 P1 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:324 classifySourceLocation runs `if (extension === '.jsonl' || /ledger/i.test(fileName)) return classes.LEDGER_STATE;` before its repo-code fallback, so any source file whose name contains 'ledger' is cla
- [ ] A2-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:453 Every research SOURCE node now gets a derived quality_class, including 'unclassified' when no field names a location. The diversity signal counts any non-empty class string (coverage-graph-signals.ts:
- [ ] A2-3 P2 .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:662 The new fail-closed branch that refuses a legacy 'extended' row whose extension budget has a missing or non-integer field (reason run-extended-budget-missing) has no test. append-mode-event-legacy-sea
- [ ] A3-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:875 The fan-in partition guard runs only when at least one lineage registry carries a frontier (hasFrontier at :875 for research and :1139 for review). When fanout-run recorded a frontier_partition but no
- [ ] B3-11 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/README.md:101 The rows for research-depth-mode-golden.vitest.ts (line 101) and review-depth-mode-golden.vitest.ts (line 103) say a default run 'keeps its pre-expansive output byte for byte'. Both golden tests first
- [ ] B3-10 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md:19 The 'Why This Matters' section of DLR-062 describes earlier behavior ('A quorum miss used to end a pivot for good. A resumed or later pivot could also be refused ...'). Restate it as the risk the scen
- [ ] B3-9 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md:19 DLR-061 frames its rationale as change history. Line 19 says 'Before this change no producer set `quality_class`', and line 15 says the signal 'now reads those derived classes ... instead of only on f
- [ ] C4-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/README.md:33 The section 3 FILES table has no row for divergent-pivot.cjs or dispatch-iteration.cjs, and this scope changed both (divergent-pivot.cjs: pivot seat scoping and quorum retry, recorded in system-deep-l
- [ ] D-3 P2 .skilled/skills/system-deep-loop/graph-metadata.json:73 The diff adds `depth-capped frontier` to the hub's stage-one intent_signals, but neither stage-two surface (ROUTER.md INTENT_SIGNALS, hub-router.json vocabularyClasses) carries it. skill-hub-routing.m

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B2-3 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:51 SKILL.md says this quick reference loads first on every invocation. This run added the --depth-mode row to its Parameters table but no row for the other new operator flags, --extend and --extend-minut
  fix: | `--restart` | off | Archive the current review packet and start a fresh lineage | -> | `--restart` | off | Archive the current review packet and start a fresh lineage | | `--extend` | off | `--extend=N` re
- [ ] B2-4 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:4 The SKILL.md body now documents --depth-mode=expansive (section 3 Expansive Depth Mode) and --extend=N (Lifecycle modes), but the frontmatter argument-hint still lists only the pre-change flags. The s
  fix: argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--stop-policy=convergence|max-iteratio -> argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--stop-policy=convergence|max-iteratio
- [ ] B2-5 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:44 The packet-artifact table gained frontier-nodes.jsonl but not frontier-seed.json. README.md and state-format.md, changed in the same range, both list frontier-seed.json as an expansive-run packet file
  fix: | `frontier-nodes.jsonl` | Frontier admission | Append-only, expansive runs only | Frontier node store | -> | `frontier-nodes.jsonl` | Frontier admission | Append-only, expansive runs only | Frontier node store | | `frontier-see
- [ ] B4-3 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:57 The entry claims the deep-review reducer routes run_extended and adopts the new ceiling as the run's cap, and it states the budget and refusal rules. Its Validation table anchors only deep-review-ledg
  fix: | `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Vitest | Ledger schema cov -> | `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Vitest | Ledger schema cov
- [ ] B4-6 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/completed-run-extension.md:50 runtime/lib/legacy-projections/deep-review-state-contract.ts now projects a deep_review.run_extended event into an 'extended' state-log row (lineageMode 'completed-continue', continuedFromRun, extensi
  fix: | `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Shared | Routes the `run_ -> | `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Shared | Routes the `run_
- [ ] B2-1 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md:82 DRV-071 records a catalog exception ('No dedicated fan-out catalog entry exists for deep-review yet'), but this run added runtime/feature-catalog/fanout/fanout-review-coverage-merge.md, which document
  fix: | `feature-catalog/` | No dedicated fan-out catalog entry exists for `deep-review` yet; the implementation anchors below -> | `feature-catalog/` | `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-review-coverage-merge.md`
- [ ] C2-1 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:129 The bullet lists the stop paths that outrank the frontierOpen veto, but it leaves out pause and the max-duration stop. SKILL.md section 3, README.md line 164, references/convergence/convergence.md, re
  fix: - The iteration cap, consecutive failures, stuck recovery, the off setting, the max-iterations policy and the review flo -> - The iteration cap, consecutive failures, stuck recovery, the off setting, the max-iterations policy and the review flo
- [ ] C2-2 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:100 The entry says fan-out caps each parent at six children. For a review, the root takes up to eight depth-1 children: readCaps sets maxRootChildren to max(maxChildrenPerNode, ROOT_CHILDREN_FLOOR.review)
  fix: - Fan-out caps each parent at six children and caps the total count. -> - Fan-out caps the review root at eight children, every other parent at six, and the total count.
- [ ] A3-4 P2 .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:178 seedViolatesReadOnlyBoundary now removes quotedScope from the focus before it runs the mutation-verb guard (:178), on the docstring premise that the scope is path data (:35). For a frontier-unanswered
- [ ] B4-4 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:30 runtime/scripts/reduce-state.cjs (renderFrontierSection, lines 2529-2558) adds a `## 10B. FRONTIER` section to the review dashboard on an expansive run only. The section shows frontier size by status,
- [ ] B2-2 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:31 The root overview says the expansive-only agent paragraph 'is waived pending operator ratification', and DRV-076 (entry-points-and-modes/expansive-depth-flag-and-default-identity.md:34) repeats it. Th
- [ ] C2-3 P2 .skilled/skills/system-deep-loop/deep-review/README.md:143 The skill README adds --extend=N and --extend-minutes=M but leaves out two operator-facing limits. First, the extension keeps the run's stop policy, so under the default policy an extended run can re-

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B1-1 P2 .skilled/skills/system-deep-loop/deep-research/README.md:228 The README scenario count was updated in this diff to 72, but the shipped playbook holds 74 scenarios across 9 categories. The root playbook itself says 74, and the validator derives 74.
  fix: holds 72 deterministic scenarios across 9 categories -> holds 74 deterministic scenarios across 9 categories
- [ ] B1-2 P2 .skilled/skills/system-deep-loop/deep-research/README.md:266 The README resource table repeats the stale playbook count of 72. The playbook ships 74 scenarios.
  fix: | 72 scenarios with expected signals and verdict rules | -> | 74 scenarios with expected signals and verdict rules |
- [ ] B1-3 P2 .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:223 The Step 2c rewrite added in this diff points to 'convergence.md §2, Decision Priority steps 8 and 9'. convergence.md section 2 is STOP CONTRACT, and the numbered list lives under '## 3. LIVE ALGORITH
  fix: (see convergence.md §2, Decision Priority steps 8 and 9) -> (see convergence.md §3, Decision Order steps 8 and 9)
- [ ] B4-1 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/state-management/leaf-field-gates.md:44 The diff to runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts (iteration_completed now admits target_agent, agent_definition_loaded, resolved_route, findingsCount, keyQuestions an
  fix: | `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Shared | Conditional cop -> | `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Shared | Conditional cop
- [ ] B4-2 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md:57 The entry claims the schema refuses a run_extended event whose newMaxIterations is not continuedFromRun plus addedIterations, and it states the budget, fan-out refusal and precondition rules. Its Vali
  fix: | `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reducers.vitest.ts` | Vitest | Reducer routing for  -> | `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reducers.vitest.ts` | Vitest | Reducer routing for 
- [ ] B4-5 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/completed-run-extension.md:50 runtime/lib/legacy-projections/deep-research-contract.ts now projects a deep_research.run_extended ledger event into the state-log row {event: 'extended', lineageMode: 'completed-continue', continuedF
  fix: | `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Shared | Routes the ` -> | `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Shared | Routes the `
- [ ] CR-1 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:5 Cross-lane miss: lane B2 reported (B2-4) that the deep-review SKILL.md argument-hint omits --depth-mode and --extend, but lane B1 reviewed the deep-research SKILL.md and left the identical gap. Its fr
- [ ] CR-2 P2 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:59 Cross-lane miss mirroring B2-3: this scope added a --depth-mode row to the deep-research quick reference Parameters table (line 59) but no row for --extend=N or --extend-minutes=M, which the command d
- [ ] B1-4 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md:52 DR-023 was rewritten in this diff to trace the qualityGuardFailed path, but its command sequence still pins line ranges that print unrelated text. 'sed -n 218,247p deep-research.yaml' prints no conver
- [ ] B1-5 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md:50 DR-020 was edited in this diff to the no-event guard contract, but its commands still pin 'sed -n 97,107p loop-protocol.md' (init Outputs, not Step 2c at line 221) and 'sed -n 236,243p deep-research.y
- [ ] B1-6 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md:50 DR-021 was edited in this diff, but it keeps the same stale pins as DR-020: loop-protocol.md 97-107 (init Outputs; Step 2c is at 221) and deep-research.yaml 236-243 (gate_defaults; step_check_converge
- [ ] B1-7 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md:50 DR-022 was edited in this diff, but its step 3 'sed -n 183,195p state-format.md' prints nothing because state-format.md is 155 lines, so the sourceStrength evidence it asks for cannot be captured. Ste
- [ ] C1-1 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:1 This range makes completed-run extension (--extend=N, --extend-minutes=M, lineage mode completed-continue) live inside the deep-research packet. The packet's SKILL.md lineage table and rule 6, README 

### unowned

- [x] BAT-01 P2 -:- S5-derived-counts failed (exit 1). [handed off]
- [x] BAT-02 P2 -:- S9-command-references failed (exit 1). [handed off]

### skill:.skilled/skills/system-spec-kit

- [ ] C3-4 P2 .skilled/skills/system-spec-kit/changelog/v2.13.5.0.md:2 The entry says the lock covers only research: the title reads 'locks the research depth mode', and line 15 says only deep research gained the mode and that its switch lives in the research config. But

### command:deep

- [ ] D-1 P2 .skilled/commands/deep/research.md:43 The router's setup list says lineage_mode stays `auto` unless --lineage-mode or --restart is present. It omits --extend=N, which the presentation binds to lineage_mode=completed-continue (deep-researc
  fix: - `lineage_mode` (default `auto` unless `--lineage-mode` or `--restart` is present) -> - `lineage_mode` (default `auto` unless `--lineage-mode` or `--restart` is present; `--extend=N` sets `completed-continu
- [ ] D-2 P2 .skilled/commands/deep/review.md:43 The router's setup list says lineage_mode stays `auto` unless --lineage-mode or --restart is present. It omits --extend=N, which the presentation binds to lineage_mode=completed-continue (deep-review-
  fix: - `lineage_mode` (default `auto` unless `--lineage-mode` or `--restart` is present) -> - `lineage_mode` (default `auto` unless `--lineage-mode` or `--restart` is present; `--extend=N` sets `completed-continu

## Pre-existing or outside the scope

### unowned

- [x] C4-1 P1 .skilled/changelog/skilled/v4.1.0.0.md:1 No open root release notes describe the user-visible capabilities this scope adds: --depth-mode=expansive with its frontier node store (frontier-admit.cjs, the convergence.cjs frontier veto and fronti (unchanged in range) [handed off]

