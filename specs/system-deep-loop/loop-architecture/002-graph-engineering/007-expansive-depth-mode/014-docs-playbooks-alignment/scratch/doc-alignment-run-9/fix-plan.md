# Fix plan

Target: topic expansive-depth; head: 7177cee3b503016c1ec844fb6f75f3352d177247

## In scope

### docs:.skilled/commands

- [ ] C1-1 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:19 The Tier 1 config shape lists `antiConvergence.convergenceMode` and `antiConvergence.depthMode` but omits `minIterations`, the floor `step_create_config` writes into the config as `minIterations: 3` (
  fix: `antiConvergence.convergenceMode`, `antiConvergence.depthMode`, `expansiveDepth.*` -> `antiConvergence.convergenceMode`, `antiConvergence.depthMode`, `minIterations`, `expansiveDepth.*`
- [ ] L3-2 P2 .skilled/commands/deep/assets/deep-review-presentation.txt:19 The Tier 1 config shape enumerates the anti-convergence keys as `antiConvergence.convergenceMode` and `antiConvergence.depthMode` and omits `antiConvergence.minIterations`, the review iteration floor 
  fix: `antiConvergence.convergenceMode`, `antiConvergence.depthMode`, -> `antiConvergence.convergenceMode`, `antiConvergence.depthMode`, `antiConvergence.minIterations`,

### docs:.skilled/agents

- [x] L1-1 P2 .skilled/agents/deep-review.md:37 The doc's only convergence section ("Convergence Threshold Semantics") presents the review loop's stop behaviour as threshold-driven and never mentions the review iteration floor, which the topic ship [handed off]
- [ ] L1-4 P2 .skilled/agents/deep-research.md:302 The doc's frontier paragraph covers the proposal contract but leaves out the other half of the FRONTIER block's instruction: the research block tells the leaf to copy the Focus Area line exactly into 

### docs:.claude/agents

- [x] L1-2 P2 .claude/agents/deep-review.md:23 Same omission in the .claude mirror: the convergence section describes only `convergenceThreshold` and never names the review iteration floor. convergence.cjs:1195-1196 holds a review stop candidate a [handed off]
- [ ] L1-5 P2 .claude/agents/deep-research.md:286 Same omission in the .claude mirror: the frontier paragraph never says the iteration record's `focus` must carry the `Frontier node <id>` marker. frontier-admit.cjs:649 requires the Focus Area line be

### docs:.pi/agents

- [x] L1-3 P2 .pi/agents/deep-review.md:30 Same omission in the .pi mirror: the convergence section covers only `convergenceThreshold` and never names the review iteration floor. convergence.cjs:1195-1196 returns CONTINUE with `minIterationsNo [handed off]
- [ ] L1-6 P2 .pi/agents/deep-research.md:294 Same omission in the .pi mirror: the frontier paragraph never says the iteration record's `focus` must carry the `Frontier node <id>` marker. frontier-admit.cjs:649 requires the Focus Area line be cop

### docs:.skilled/skills

- [ ] L6-1 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:56 The doc says command 1 prints `Tests 3 passed` and names three passing cases, but the `review divergent pivot under the expansive depth mode` describe block holds four tests. The fourth case, `keeps a
  fix: Command 1 prints `Tests 3 passed` (the rest of the file skipped). Its three passing cases are `refuses a pivot while an  -> Command 1 prints `Tests 4 passed` (the rest of the file skipped). Its four passing cases are `refuses a pivot while an o
- [ ] L6-2 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:31 The scenario contract states three pivot cases pass, but the suite runs four cases in that describe block (the mutation-verb scope case is the fourth). The expected-signal count is stale.
  fix: - Expected signals: The three pivot cases pass. -> - Expected signals: The four pivot cases pass.
- [ ] L6-3 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:615 The DRV-081 summary in the root playbook index repeats the stale count of three review pivot cases; the suite has four passing cases in that describe block.
  fix: Expected signals: The three review pivot cases pass, the workflow gate case passes, and the pivot script labels revisit  -> Expected signals: The four review pivot cases pass, the workflow gate case passes, and the pivot script labels revisit s
- [ ] L8-1 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:133 The validation row says the `expansive depth frontier` group holds 12 tests. The group runs from `describe('fanout-run.cjs — expansive depth frontier'` at line 6571 to the next `describe` at line 6907
  fix: `expansive depth frontier` (12 tests: -> `expansive depth frontier` (13 tests:

## Pre-existing or outside the scope

