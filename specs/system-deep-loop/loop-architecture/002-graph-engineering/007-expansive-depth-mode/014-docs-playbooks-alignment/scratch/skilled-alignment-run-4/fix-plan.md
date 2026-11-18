# Fix plan

Target: HEAD; head: 65eb3c029d0c2c0a29dcfcc0039d7343692c2d83

## In scope

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B-S3-01 P1 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16 The review and research expansive-depth entries, and both root catalogs, still say the live pilot runs 'are still open' and that no pilot result is recorded. The branch records three pilots, all repor
- [ ] B-S4-01 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/custom-dimension-setup-and-universe.md:80 Three deep-review scenarios declare that no feature-catalog entry exists for their capability, but the entries added in this change exist and cite these very scenarios. `review-dimensions/custom-revie
- [ ] B-S2-01 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:238 The new expansive section claims `antiConvergence.depthMode` and the `expansiveDepth` caps are 'both ... locked against the optimizer'. The optimizer manifest lists only `antiConvergence.depthMode` in
- [ ] B-S2-03 P2 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:99 The convergence-mode table says the shipped review YAML has no `off` decision branch and that review therefore follows `default`. The workflow's `step_check_convergence` item 3 (`deep-review.yaml:1241

### skill:.skilled/skills/system-deep-loop

- [ ] B-S4-02 P1 .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:65 Global precondition 4 requires `mode-registry.json` to contain exactly 3 active modes, but the registry has 2 (`research`, `review`), so no hub scenario can clear its own precondition. Line 35 also pi
- [ ] F1 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/research-depth-mode-golden.vitest.ts:167 The suite's stated invariant (header lines 5-9: 'A run that never asks for it must render the same bytes') cannot fail for the default-path next-focus change this branch lands. writeFixture writes spe
- [ ] F2 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:363 The comment at 361-362 promises a fail-safe the code does not implement: 'An unreadable review config must not silently widen the relevance check to every path, so it degrades to the no-target object 
- [ ] F4 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:341 The run-wide node cap is pruned with reason 'fanout', so a store row cannot be read as naming the bound it hit. The module header (lines 12-17) enumerates the checks as relevance, dedupe, depth, fan-o
- [ ] B-S4-03 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md:102 The new runtime scenarios do not reach the catalog entries added for them. DLR-062, DLR-063 and DLR-064 still end with 'this scenario does not cite a specific catalog entry' although `council/divergen

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] F5 P2 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3573 Five of the exports added to this file have no consumer anywhere in the repository — not a script, not a lib module, not a test: applyFrontierBudget (3573), buildFrontierProjection (3574), frontierNod
  fix: applyFrontierBudget, buildFrontierProjection, buildGraphConvergenceRollup, -> buildGraphConvergenceRollup,
- [ ] D3 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:131 The table headed 'Runtime-supported lifecycle modes' lists new, resume and restart, and the sentence directly below it declares completed-continue a live mode set by --extend=N, so the section contrad
  fix: | `restart` | Archive the existing research tree, mint a fresh `sessionId`, increment `generation`, and append a typed ` -> | `restart` | Archive the existing research tree, mint a fresh `sessionId`, increment `generation`, and append a typed `
- [ ] F3 P2 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2465 The comment above frontierNodeVisits states a property the focus does not have and explains the wrong mechanism: 'The frontier focus names the node and never repeats its question text: a question reso
- [ ] B-S2-02 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:91 The absent-flag claim is too strong: research says `default` 'renders the same bytes as before' and review says it 'runs exactly as before' (`deep-review/SKILL.md:237`; also `deep-research/references/
- [ ] B-S2-04 P2 .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:135 Decision-order item 10 says a failed gate 'emit[s] blockedStop'. That is the review branch of `buildStopDecision` (`convergence.cjs:1201`); the research branch returns `CONTINUE` with reasonDetail `qu
- [ ] B-S2-05 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:127 The table titled 'Runtime-supported lifecycle modes:' lists only `new`, `resume` and `restart`, while the paragraph immediately below (line 135) says `completed-continue` is set by `--extend=N`, and t

### unowned

- [ ] BAT-01 P2 -:- S9-command-references failed (exit 1).

### command:deep

- [ ] D1 P2 .skilled/commands/deep/research.md:33 The HARD-BLOCK 'YOUR FIRST ACTION' gate tells the executor to resolve 7 setup values, but the same file's YAML START CONDITION at line 17 now requires 9, including convergence_mode, depth_mode and lin
  fix: > - `stop_policy` (default `convergence` unless `--stop-policy=max-iterations` is present) > - `dry_run` (default false  -> > - `convergence_mode` (default `default` unless `--convergence-mode` is present) > - `depth_mode` (default `default` un
- [ ] D2 P2 .skilled/commands/deep/review.md:31 Same divergence as D1, in the review router: the HARD-BLOCK gate lists 9 setup values without convergence_mode, depth_mode or lineage_mode, while line 17 of the same file requires 12. The branch edite
  fix: > - `stop_policy` (default `convergence` unless `--stop-policy=max-iterations` is present) > - `dry_run` (default false  -> > - `convergence_mode` (default `default` unless `--convergence-mode` is present) > - `depth_mode` (default `default` un

## Pre-existing or outside the scope

