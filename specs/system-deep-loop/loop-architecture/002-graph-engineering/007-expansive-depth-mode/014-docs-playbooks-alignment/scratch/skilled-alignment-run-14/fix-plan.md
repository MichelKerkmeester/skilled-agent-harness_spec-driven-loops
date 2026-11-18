# Fix plan

Target: HEAD; head: 102558edb44be4000c61b36932615bd1196dce74

## In scope

### skill:.skilled/skills/system-spec-kit

- [ ] BAT-01 P0 .skilled/skills/system-spec-kit/runtime/cli:- S1-package-check failed for .skilled/skills/system-spec-kit/runtime/cli (exit 1).
- [ ] A4-1 P2 .skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json:111 Battery S1-package-check failure cause. The @spec-kit/cli dist (entry default) was attested on the source tree just before commit 0d41845988f (2026-11-17 21:59). That commit is inside 21c4b325b5a..102
- [ ] C3-6 P2 .skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json:111 Commit 0d41845988f changes system-spec-kit's optimizer manifest. It adds antiConvergence.depthMode as a locked, never-tuned field of the anti-convergence contract, at lines 110-114 and in lockedFields

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B2-7 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:203 The release's Tests and scenarios list says the playbook validator passed 'with the seven new scenarios'. The changelog was added in 7ab0b52 with seven scenarios (DRV-076..082). DRV-083 (frontier-drai
  fix: - Review playbook validator: PASS, with the seven new scenarios. -> - Review playbook validator: PASS, with the eight new scenarios.
- [ ] B2-2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:366 The Review Dimensions section intro still says its entries capture 'the four canonical audit dimensions', but the section now holds five entries, including the new Custom review dimensions entry. The 
  fix: These entries capture the four canonical audit dimensions that define loop coverage and shape findings, convergence, and -> These entries capture the four canonical audit dimensions, plus any configured custom dimension, that define loop covera
- [ ] B2-4 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:503 The DRV-020 root summary still says the dimension coverage signal requires all 4 dimensions. This change made coverage span every configured dimension, custom names included (convergence.md, loop-prot
  fix: Verify dimension coverage signal (weight 0.45) requires all 4 dimensions + minStabilizationPasses >= 1. -> Verify dimension coverage signal (weight 0.45) requires every configured dimension (the four by default) + minStabilizat
- [ ] B2-5 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:508 DRV-020 expected signals still list 'all 4 dimensions required'. The coverage signal now requires every configured dimension, which is the canonical four by default, plus any custom name. Note: the pe
  fix: Expected signals: Weight 0.45, all 4 dimensions required, -> Expected signals: Weight 0.45, every configured dimension required (the four by default),
- [ ] B2-1 P1 .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md:11 The generated contract snapshot was hand-edited. Its frontmatter version was bumped to 1.11.3.0, but the generator's hardcoded SNAPSHOT_FRONTMATTER (render-contract-snapshot.cjs line 47) still emits 1
- [ ] B2-6 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:182 Phase 2 Step 2 'Check Convergence' still gives the old abbreviated stop order: max iterations, stuck, composite, otherwise CONTINUE. This change rewrote convergence.md Decision Priority into ten steps
- [ ] B2-3 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28 The entry tells the operator to 'fund the depth-1 band with at least 2 * ceil(nodes / lineages) * dimensions'. That figure is the maxIterations a lineage needs, not the size of the band: the depth-1 b
- [ ] C2-1 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:138 The v1.13.0.0 entry fails the changelog shape gate that sk-create-changelog SKILL.md validation check 11 requires to pass: line 138 holds a 31-word sentence, line 139 a 24-word sentence (ceiling 22), 

### skill:.skilled/skills/system-deep-loop

- [ ] A1-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:948 The CLI error path writes 'frontier-admit: <message>' to stderr. The resolved SKILLED javascript-checklist.md 'Bracketed Logging' item asks for the [COMPONENT] format, '[frontier-admit] ...', and fano
  fix: process.stderr.write(`frontier-admit: ${error instanceof Error ? error.message : String(error)}\n`); -> process.stderr.write(`[frontier-admit] ${error instanceof Error ? error.message : String(error)}\n`);
- [ ] A1-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:927 The seed command's budget notice on stderr uses the same unbracketed 'frontier-admit: ' prefix, against javascript-checklist.md 'Bracketed Logging' and the fanout-run.cjs '[fanout-run]' convention. A 
  fix: process.stderr.write(`frontier-admit: budget after seed -> process.stderr.write(`[frontier-admit] budget after seed
- [ ] A4-2 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:97 The regex /\n depth_mode: "\[default|expansive\]/ has an unescaped '|', so it parses as the alternation ('\n depth_mode: "[default' OR 'expansive]'), not the literal '[default|expansive]' it means to 
  fix: expect(yaml).toMatch(/\n depth_mode: "\[default|expansive\]/); -> expect(yaml).toMatch(/\n depth_mode: "\[default\|expansive\]/);
- [ ] B3-5 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:142 The PROMPT RENDERING section now holds two entries, because this diff added 'Research prompt pack contract' at line 160, and the overview table was updated to 2 features. The section intro still reads
  fix: This entry covers prompt-pack template rendering and placeholder validation before iteration dispatch. -> These entries cover prompt-pack template rendering, placeholder validation before iteration dispatch, and the research p
- [ ] B3-6 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:694 Two intros in the runtime catalog root went stale when this diff added entries. COUNCIL (line 694) ends 'The council folder holds this one CJS helper.', but the folder now also holds divergent-pivot-s
  fix: The council folder holds this one CJS helper. -> The council folder also documents the divergent pivot's per-attempt seat cap and council retry.
- [ ] B3-3 P2 .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:225 The new Section 9 calls deep-research, deep-review and runtime 'the three mode packages'. The skill has two modes, and line 65 of this file, changed in the same diff, says mode-registry.json has exact
  fix: The three mode packages hold the remaining operator scenarios for this skill. -> The two mode packages and the shared runtime package hold the remaining operator scenarios for this skill.
- [ ] B3-4 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:636 This diff added DLR-062 to the COUNCIL category and updated the intro of every other category it grew (executor 6, prompt rendering 2, coverage graph 7). The COUNCIL intro still says 'This scenario va
  fix: This scenario validates that surface. -> These scenarios validate that surface and the divergent pivot's per-attempt seat cap and council retry.
- [ ] C3-3 P2 .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:49 The new root-catalog entry 'Depth mode flag (--depth-mode)' uses '#### How It Works' at line 49. The other three entries in this file use '#### Current Reality' at lines 33, 83 and 101, and so does sk
  fix: #### How It Works `mode-registry.json` has no depth field -> #### Current Reality `mode-registry.json` has no depth field
- [ ] C3-7 P2 .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:65 The new root-catalog entry 'Completed-run extension flags (--extend, --extend-minutes)' uses '#### How It Works'. The other entries in this file, and the sk-create-feature-catalog template, use '#### 
  fix: #### How It Works `mode-registry.json` has no extension field -> #### Current Reality `mode-registry.json` has no extension field
- [ ] A1-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:620 closeNode checks only the target status and never the node's current status. So a row that admission pruned (it never reached the inbox) can be closed as 'answered' or 'active'. That revives it as a l
- [ ] A1-4 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:407 scopeInsideTouchedFiles reads reviewScopeFiles only as an array or a separated string. terminal-gates.cjs scopeEntries (lines 74-93) documents and accepts named lists ({kind: [paths]}) 'once a review 
- [ ] A1-5 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:961 The new module exports 16 functions (seedNodes, admitProposals, closeNode, seedBudget, renderFrontierBlock and others) with no JSDoc. javascript-checklist.md section 4 (P2 - RECOMMENDED) asks for JSDo
- [ ] A2-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1963 The review reducer's derived budget close in applyReviewFrontierBudget has no test: no test reaches a band's share and closes its open nodes as exhausted/budget, and none covers the unspent-share roll
- [ ] A2-2 P2 .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:1025 The 'extension-budget' rule checks only that the six fields are present and are uint32. It never checks them against each other or against the payload's continuedFromRun. Both reducers then adopt newM
- [ ] A2-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1906 readReviewFrontierStore swallows a malformed frontier-nodes.jsonl row with a bare catch and has no warning channel: it returns only {nodes, history}. The same reducer reports corruptionWarnings for a 
- [ ] A3-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:753 The new FRONTIER_STATUSES, qualifyFrontierId and mergeResearchFrontier block was inserted between mergeResearchRegistries and its JSDoc. The doc block that says 'Merge research findings registries fro
- [ ] A3-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:347 expansiveLineageBudgets hard-codes the native lineage's default budget as a bare `12`. The same value already appears as a bare literal at lines 1305, 1858 and 1928 (review.magic-literals, review.dry)
- [ ] B3-1 P2 .skilled/skills/system-deep-loop/changelog/v2.1.6.0.md:1 The hub moves from 2.0.2.0 to 2.1.6.0 through seven new hub changelogs. This diff records its runtime changes there and not in runtime/changelog/, which got no entry: v2.1.1.0 covers upsert.cjs, v2.1.
- [ ] B3-2 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:89 frontier-admit.cjs is new in this diff and is the only script-entry-points catalog entry with no runtime playbook scenario. convergence, upsert, query, status and append-mode-event each have one under
- [ ] B4-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:339 The diff adds a new fan-out behavior: under expansive depth, a lineage with no matrix iterations gets a budget sized from its own seed share (expansiveLineageBudgets), a lineage with no seed node runs
- [ ] C3-5 P2 .skilled/skills/system-deep-loop/hub-router.json:34 Commit 30ac5b51f95 ('route expansive-depth requests to the deep-loop hub') adds hub routing vocabulary in four files: hub-router.json, ROUTER.md INTENT_SIGNALS, graph-metadata.json and the advisor's s

### unowned

- [ ] CR-1 P2 .github/workflows/deep-loop-runtime.yml:90 Several selected workflows have blocking steps that no battery row replays. I sorted them by whether they could fail for this scope. (1) deep-loop-runtime.yml, step 'Run the deep-loop runtime suites' 
- [ ] BAT-02 P2 -:- S5-derived-counts failed (exit 1).
- [ ] BAT-03 P2 -:- S9-command-references failed (exit 1).
- [ ] CR-2 P2 .skilled/commands/speckit/assets/speckit-resume.yaml:104 The S9-command-references battery failure has no lane finding. Its cause is outside this scope and predates it. speckit-resume.yaml is unchanged between 21c4b325b5a and 102558edb44, and the path it na

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B1-3 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md:87 DR-065 links back only to feature-catalog/loop-lifecycle/initialization.md. The matching catalog entry is loop-lifecycle/completed-run-extension.md, which this same diff added and which cites DR-065 a
  fix: | `../../feature-catalog/loop-lifecycle/initialization.md` | Feature-catalog source describing the lineage modes the con -> | `../../feature-catalog/loop-lifecycle/completed-run-extension.md` | Feature-catalog entry for completed-run extension 
- [ ] C1-4 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:212 The 'Tests and scenarios' list says a live expansive research run has not been run. The research frontier packet's implementation summary records two target-2 pilot runs (2026-11-17 and 2026-11-18) th
  fix: - Not yet run: a live research run with `--depth-mode=expansive` on a real topic. -> - Live runs: two pilot runs with `--depth-mode=expansive` stopped at the iteration cap.
- [ ] B1-1 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:62 The Validation And Tests table backs only admission (frontier-admit.vitest) plus DR-068 and DR-072. The leaf also claims the stop veto, the fan-out round-robin deal and partition guard, the frontier g
- [ ] B1-2 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:36 HOW IT WORKS leaves out shipped reducer behavior from this diff, although it lists reduce-state.cjs as a source. applyFrontierBudget closes a spent depth band's open nodes as exhausted with reason bud
- [ ] B1-4 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:479 Two user-visible expansive features in this diff have no scenario. The first is the depth-band budget roll-down: an unspent share rolls down, never up, and an answered node keeps its share rolling. Th
- [ ] C1-2 P2 .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:229 Step 2c (Quality Guard Check, lines 221-232) still says a failed quality guard logs guard_violation events and persists a blocked_stop event. That contradicts convergence.md, which this scope correcte
- [ ] C1-3 P2 .skilled/skills/system-deep-loop/deep-research/README.md:123 Line 123 lists the quality-guard checks (sources diverse, no single weak source carrying a finding) among the legal-stop gates, then says 'When a gate fails, the run records blocked_stop and continues

## Pre-existing or outside the scope

### unowned

- [ ] C3-1 P1 .skilled/changelog/skilled/v4.1.0.0.md:237 The newest root release notes do not describe the two operator-facing deep-loop flags this scope adds, --depth-mode=expansive and --extend=N/--extend-minutes=M. The S6 lens requires that every user-vi (unchanged in range)
- [ ] C1-1 P2 .skilled/changelog/skilled/v4.1.0.0.md:1 The open root release notes (the highest-version note at HEAD 102558edb44) do not describe three user-visible deep-research changes in this scope: (1) the opt-in --depth-mode=expansive frontier (deep- (unchanged in range)
- [ ] C2-3 P2 .skilled/changelog/skilled/v4.1.0.0.md:1 No root release note describes the user-visible review capabilities this scope adds: --depth-mode=expansive, --extend=N / completed-continue, custom review dimensions, and the review minIterations flo (unchanged in range)

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B1-5 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:937 The root's numbered H2 sections run 14 FAN-OUT, 16 INTRA ROUTING RECALL, 15 AUTOMATED TEST CROSS-REFERENCE, 15 FEATURE CATALOG CROSS-REFERENCE INDEX: one number out of order and one duplicated. This p (pre-existing (critic))

### skill:.skilled/skills/system-deep-loop

- [ ] B4-2 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md:52 DLR-025 governs tests/unit/fanout-run.vitest.ts, which this diff grew by 492 lines. It still pins a fixed count for that whole file: '5 integration tests' (lines 30, 45, 89), 'Confirm 5 tests pass' (l (unchanged in range)
- [ ] C4-1 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/README.md:19 The unit-test README says its FILES table is 'the complete direct-file inventory', but this range adds five unit test files without a row in it: divergent-pivot-seat-scope.vitest.ts, frontier-admit-re (unchanged in range)

### skill:.skilled/skills/system-skill-advisor

- [ ] C3-4 P2 .skilled/skills/system-skill-advisor/README.md:141 Battery S5-derived-counts fails on this file. The cause is a checker false positive, not a wrong count. Line 141 says the skill-graph.sqlite database has 'two sidecar files' under runtime/database/, a (pre-existing (critic))

