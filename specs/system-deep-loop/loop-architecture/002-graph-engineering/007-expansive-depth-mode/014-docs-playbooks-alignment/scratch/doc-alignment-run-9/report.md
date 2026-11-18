# Alignment report: topic expansive-depth

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic expansive-depth`
- Commits: `7177cee3b503016c1ec844fb6f75f3352d177247` to `7177cee3b503016c1ec844fb6f75f3352d177247`, 0 first-parent commits
- Files: 79, of which 0 uncommitted or untracked
- Owners: 6
- Findings: 12 (P0 0, P1 0, P2 12), 6 literal, 0 inferred, 0 outside the scope; 5 more overturned by the critic and not counted
- Open findings: 9 (3 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L4, L5, L6, L7, L8
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 79 | lens only |
| D2 | Topic checks pass | yes | 0 | 2 |

## Battery

pass 2, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-contract-drift` | 0 | 60 |
| pass | P1 | no | `D2-doc-facts` | 0 | 193 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **C1-1** P2 literal `.skilled/commands/deep/assets/deep-research-presentation.txt:19`: The Tier 1 config shape lists `antiConvergence.convergenceMode` and `antiConvergence.depthMode` but omits `minIterations`, the floor `step_create_config` writes into the config as `minIterations: 3` (deep-research.yaml:723). The consolidated-prompt Defaults line at 137 omits it too, so a reader building the config from this presentation never learns the run carries a floor. The review presentation...
  - Evidence: `rg -n "minIterations: 3" .skilled/commands/deep/assets/deep-research.yaml; rg -n "minIterations" .skilled/commands/deep/assets/deep-research-presentation.txt; echo "presentation-rg-exit=$?"` exit 0: 723: minIterations: 3 presentation-rg-exit=1
- **L1-1** P2 judgment `.skilled/agents/deep-review.md:37`: The doc's only convergence section ("Convergence Threshold Semantics") presents the review loop's stop behaviour as threshold-driven and never mentions the review iteration floor, which the topic ships. The code applies the floor to review runs: `buildStopDecision` returns CONTINUE with reasonDetail `minIterationsNotReached` while `iterationCount < minIterations` (convergence.cjs:1195-1196), and t... [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: the review agent definition. Its Convergence Threshold Semantics section (.skilled/agents/deep-review.md:37, commit 3c35ad81ae5) never names the review floor. Adding a sentence there changes the default-path lineage prompt, which review-depth-mode-golden.vitest.ts holds byte-identical to a pre-d...
  - Evidence: `rg -n "minIterationsNotReached|minIterations > 1" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs; rg -n "minIterations" .skilled/skills/system-deep-loop/deep-review/assets/deep-revie...` exit 0: 1195: if (minIterations > 1 && iterationCount < minIterations) { 1196: return emit('CONTINUE', null, 'minIterationsNotReached', gatesAt(false), []); --- 12: "minIterations": 2,
- **L1-2** P2 judgment `.claude/agents/deep-review.md:23`: Same omission in the .claude mirror: the convergence section describes only `convergenceThreshold` and never names the review iteration floor. convergence.cjs:1195-1196 holds a review stop candidate at CONTINUE with `minIterationsNotReached` until the configured floor is reached, and the shipped review config sets `antiConvergence.minIterations` to 2 (deep-review-config.json:12). [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: the review agent definition. Its Convergence Threshold Semantics section (.claude/agents/deep-review.md:23, commit efff591dfc8) never names the review floor. Adding a sentence there changes the default-path lineage prompt, which review-depth-mode-golden.vitest.ts holds byte-identical to a pre-de...
  - Evidence: `rg -n "minIterationsNotReached|minIterations > 1" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs; rg -n "minIterations" .skilled/skills/system-deep-loop/deep-review/assets/deep-revie...` exit 0: 1195: if (minIterations > 1 && iterationCount < minIterations) { 1196: return emit('CONTINUE', null, 'minIterationsNotReached', gatesAt(false), []); --- 12: "minIterations": 2,
- **L1-3** P2 judgment `.pi/agents/deep-review.md:30`: Same omission in the .pi mirror: the convergence section covers only `convergenceThreshold` and never names the review iteration floor. convergence.cjs:1195-1196 returns CONTINUE with `minIterationsNotReached` below the floor, and the shipped review config sets `antiConvergence.minIterations` to 2 (deep-review-config.json:12). [handed off]
  - Disposition: Text this program did not write (blame at the cited line predates the program base 21c4b325b5a). Owner: the review agent definition. Its Convergence Threshold Semantics section (.pi/agents/deep-review.md:30, commit 74f5988ba28) never names the review floor. Adding a sentence there changes the default-path lineage prompt, which review-depth-mode-golden.vitest.ts holds byte-identical to a pre-depth-...
  - Evidence: `rg -n "minIterationsNotReached|minIterations > 1" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs; rg -n "minIterations" .skilled/skills/system-deep-loop/deep-review/assets/deep-revie...` exit 0: 1195: if (minIterations > 1 && iterationCount < minIterations) { 1196: return emit('CONTINUE', null, 'minIterationsNotReached', gatesAt(false), []); --- 12: "minIterations": 2,
- **L1-4** P2 judgment `.skilled/agents/deep-research.md:302`: The doc's frontier paragraph covers the proposal contract but leaves out the other half of the FRONTIER block's instruction: the research block tells the leaf to copy the Focus Area line exactly into the iteration record's `focus` (frontier-admit.cjs:649), and the research reducer attributes a frontier visit only by the `Frontier node <id>` marker in that `focus` field (deep-research/scripts/reduc...
  - Evidence: `rg -n "Copy the Focus Area line" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs; rg -n "Frontier node \$\{escaped\}" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-...` exit 0: 649: lines.push(`Copy the Focus Area line exactly into this iteration record's "focus", so the run can tell which node this iteration worked.`); --- 2478: const marker = new RegExp(`(?:^|[^\\w-])Frontier node ${escaped}(?![\\w-])`);
- **L1-5** P2 judgment `.claude/agents/deep-research.md:286`: Same omission in the .claude mirror: the frontier paragraph never says the iteration record's `focus` must carry the `Frontier node <id>` marker. frontier-admit.cjs:649 requires the Focus Area line be copied into `focus`, and deep-research/scripts/reduce-state.cjs:2478 matches frontier visits on that marker only.
  - Evidence: `rg -n "Copy the Focus Area line" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs; rg -n "Frontier node \$\{escaped\}" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-...` exit 0: 649: lines.push(`Copy the Focus Area line exactly into this iteration record's "focus", so the run can tell which node this iteration worked.`); --- 2478: const marker = new RegExp(`(?:^|[^\\w-])Frontier node ${escaped}(?![\\w-])`);
- **L1-6** P2 judgment `.pi/agents/deep-research.md:294`: Same omission in the .pi mirror: the frontier paragraph never says the iteration record's `focus` must carry the `Frontier node <id>` marker. frontier-admit.cjs:649 requires the Focus Area line be copied into `focus`, and deep-research/scripts/reduce-state.cjs:2478 matches frontier visits on that marker only.
  - Evidence: `rg -n "Copy the Focus Area line" .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs; rg -n "Frontier node \$\{escaped\}" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-...` exit 0: 649: lines.push(`Copy the Focus Area line exactly into this iteration record's "focus", so the run can tell which node this iteration worked.`); --- 2478: const marker = new RegExp(`(?:^|[^\\w-])Frontier node ${escaped}(?![\\w-])`);
- **L3-2** P2 literal `.skilled/commands/deep/assets/deep-review-presentation.txt:19`: The Tier 1 config shape enumerates the anti-convergence keys as `antiConvergence.convergenceMode` and `antiConvergence.depthMode` and omits `antiConvergence.minIterations`, the review iteration floor this topic ships. The floor is a real config key: the review config template sets it to 2 and convergence.cjs reads config.minIterations (falling back to antiConvergence.minIterations) as the floor th...
  - Evidence: `rg -n "minIterations" .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` exit 0: 12: "minIterations": 2,
- **L6-1** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:56`: The doc says command 1 prints `Tests 3 passed` and names three passing cases, but the `review divergent pivot under the expansive depth mode` describe block holds four tests. The fourth case, `keeps a frontier seed whose scope path happens to name a mutation verb`, is missing from the doc, so an operator running the documented command sees a count that does not match the doc and cannot tell whethe...
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts -t "review divergent pivot under the expansive depth mode" --reporter=verbose` exit 0: ...ion per closed sub-target the frontier left uncovered 11ms ✓ ... > keeps a frontier seed whose scope path happens to name a mutation verb 6ms ✓ ... > leaves a default run untouched even when the registry still carries an open frontier node 6ms Test Files 1 passed (1) Tests 4 passed | 23 skipped (27)
- **L6-2** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:31`: The scenario contract states three pivot cases pass, but the suite runs four cases in that describe block (the mutation-verb scope case is the fourth). The expected-signal count is stale.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts -t "review divergent pivot under the expansive depth mode" --reporter=verbose` exit 0: Tests 4 passed | 23 skipped (27)
- **L6-3** P2 literal `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:615`: The DRV-081 summary in the root playbook index repeats the stale count of three review pivot cases; the suite has four passing cases in that describe block.
  - Evidence: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts -t "review divergent pivot under the expansive depth mode" --reporter=verbose` exit 0: Tests 4 passed | 23 skipped (27)
- **L8-1** P2 literal `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:133`: The validation row says the `expansive depth frontier` group holds 12 tests. The group runs from `describe('fanout-run.cjs — expansive depth frontier'` at line 6571 to the next `describe` at line 6907 and contains 13 `it(...)` cases: normalizes the depth mode, deals open depth-1 nodes round-robin, reuses the budget partition, writes a lineage store and inbox once, adds no depth-mode bytes to a def...
  - Evidence: `rg -n "describe\('fanout-run.cjs — expansive depth frontier'|describe\('fanout-run.cjs — per-lineage expansive budget'" .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts; awk 'N...` exit 0: 6571:describe('fanout-run.cjs — expansive depth frontier', () => { 6907:describe('fanout-run.cjs — per-lineage expansive budget', () => { 13 | `tests/unit/fanout-run.vitest.ts` | Expansive depth groups: `expansive depth frontier` (12 tests: the round-robin deal, the per-lineage no

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **L4-1** P2 literal `.skilled/commands/deep/research.md:113`: The `--lineage-mode` row gives the accepted values as `auto | resume | restart`, but the workflow's `lineage_mode` input accepts `completed-continue` as a fourth value, and the preflight only rejects a `lineage_mode` other than `auto` or `completed-continue` when `--extend` is bound. A reader who wants to name the extension mode explicitly is told the flag does not take it. [D1, L4]
  - Evidence: `rg -n "lineage_mode:" .skilled/commands/deep/assets/deep-research.yaml` exit 0: ...cle intent. Default: auto. `resume` keeps the same sessionId and archives nothing. `restart` opens a new sessionId at generation+1 and archives the prior research/ packet. `completed-continue` comes from --extend=N and extends a completed run in place by N iterations, same sessionId and generation."
  - Critic override: refuted, lane severity P2. The flag takes three values by design; `completed-continue` is derived from `--extend=N`, not passed to `--lineage-mode`. The command's own presentation contract says so: deep-research-presentation.txt:75 'flag `--lineage-mode=auto|resume|restart`', :117 '`--lineage-mode=auto|resume|restart -> lineage_mode = value`', :207 'lineage_mode = [auto/resume/restart from flag, marker, or default auto; com...
- **L4-2** P2 literal `.skilled/commands/deep/review.md:106`: The `--restart`, `--lineage-mode` row gives the accepted values as `auto | resume | restart`, but the workflow's `lineage_mode` input accepts `completed-continue` as a fourth value, and the preflight only rejects a `lineage_mode` other than `auto` or `completed-continue` when `--extend` is bound. The `--extend` row on the same table already names `completed-continue` as the mode it sets, so the va... [D1, L4]
  - Evidence: `rg -n "lineage_mode:" .skilled/commands/deep/assets/deep-review.yaml` exit 0: ... auto. The runtime persists lineage events for `resume` (same sessionId, no archive), `restart` (new sessionId, generation+1, prior review/ archived) and `completed-continue` (from --extend=N: a completed run extended in place by N iterations, same sessionId and generation). `fork` is not accepted."
  - Critic override: refuted, lane severity P2. Same as L4-1 for the review command: deep-review-presentation.txt:76 'flag `--lineage-mode=auto|resume|restart`', :130 '`--lineage-mode=auto|resume|restart -> lineage_mode = value`', :238 'lineage_mode = [auto/resume/restart from flag, marker, or default auto; completed-continue from --extend=N]'. `--lineage-mode=completed-continue` without `--extend` fails at step_extend_completed_run with '--ext...
- **L3-1** P2 literal `.skilled/commands/deep/assets/deep-review.yaml:1285`: The stop-order item states the review iteration floor unconditionally: any run below min_iterations returns CONTINUE with minIterationsNotReached. convergence.cjs guards the floor with `minIterations > 1`, so a floor of 1 (or 0) never blocks a candidate and the run falls through to the legal-stop gates. Verified by calling buildStopDecision with minIterations=1, iterationCount=0, a clean all_dimen... [D2, L3]
  - Evidence: `rg -n "minIterations > 1" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: 1195: if (minIterations > 1 && iterationCount < minIterations) {
  - Critic override: refuted, lane severity P2. The `minIterations > 1` guard cannot change a decision, so the doc's unconditional rule is exact for every reachable state. A stop candidate needs evidence that does not exist at iterationCount 0: cleanReviewStop requires review.coverageAge >= 1, and reviewCoverageAge returns 0 unless at least two evidence records cover every dimension (convergence.cjs:1488-1501); the composite vote needs two rati...
- **L4-3** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:407`: The entry states the floor unconditionally: "A STOP candidate is overridden while `iterationCount < minIterations`". `buildStopDecision` only applies the floor when `minIterations > 1`, so a config that sets `minIterations` to 1 (the workflow clamps the effective floor to the inclusive range 0..max_iterations, so 1 is a legal value) never blocks a stop candidate. The doc claims a behavior the code... [D2, L4]
  - Evidence: `rg -n "minIterations > 1" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: 1195: if (minIterations > 1 && iterationCount < minIterations) {
  - Critic override: refuted, lane severity P2. Same inert guard as L3-1, on the research path. At iterationCount 0 no candidate forms: `coverage.total > 0 && coverage.answered >= coverage.total` is false because the graph holds no questions yet, and signalResult.stopCandidate needs questionEntropy (total > 0), rollingAverage (>= 3 ratios) or madNoiseFloor (>= 4) (convergence.cjs:798-840). step_check_convergence runs before step_dispatch_iterat...
- **L4-4** P2 judgment `.skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/anti-convergence-floor.md:27`: The page states the floor unconditionally: "a STOP candidate is blocked while the completed iteration count is below the effective floor". `buildStopDecision` guards the floor with `minIterations > 1`, so an effective floor of 1 (a legal value: the workflow clamps it to 0..max_iterations) never blocks a stop candidate. The page claims to describe the shipped floor rule in full and omits that guard... [D2, L4]
  - Evidence: `rg -n "minIterations > 1" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` exit 0: 1195: if (minIterations > 1 && iterationCount < minIterations) {
  - Critic override: refuted, lane severity P2. Same inert guard as L3-1 and L4-3. The page describes the shipped floor rule, and the rule it states holds for every reachable state: a stop candidate cannot exist at iterationCount 0 (research needs coverage.total > 0 or three ratios, convergence.cjs:798-840; review needs coverageAge >= 1, convergence.cjs:1488-1501), and for count >= 1 `minIterations > 1 && count < minIterations` equals `count < ...

## Probes awaiting the critic

None.

## Files no lane reviewed

None.

