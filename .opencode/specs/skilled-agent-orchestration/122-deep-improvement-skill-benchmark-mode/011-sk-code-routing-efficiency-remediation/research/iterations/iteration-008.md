# Iteration 8: A build-ready D4-R task-usefulness instrument

## Focus

I chose **D4 measurement as the primary lever**, narrowed to a build-ready routine-task usefulness instrument. Prior iterations already established that D4 is `n=2`, approximate, and that LS-002 is a candidate. The highest-value unexplored seam is more specific: the checked-in D4 path does not measure what a model **does with the routed slice**. It grades a routing-analysis JSON answer with a hallucination grader, while normal benchmark reports still hard-code D4 as unscored.

## Actions Taken

- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:5-15`, `:24-31`, `:35-52`, `:58-80`.
- Read `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md:3-4`, `:22-41`.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs:15-19`, `:35-52`, `:125-168`.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:4-18`, `:52-60`, `:94-118`, `:130-131`, `:152-161`, `:254-264`.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:15-17`, `:105-135`, `:169-175`.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:4-16`, `:62-82`, `:88-112`.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:7-11`, `:121-155`.
- Read `.opencode/skills/sk-code/references/smart_routing.md:287-307`, `:450-459`.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs:225-255`.
- Read `.opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.json:18-39`, `:87-90`, `:163-166`, `:331-334`, `:374-386`.
- Read `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:18-39`, `:87-90`, `:155-158`, `:320-323`, `:362-368`.
- Read `.opencode/skills/sk-code/benchmark/live-final/d4-ablation.json:1-28`.
- Read `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:43-49`, `:75-84`, `:109-125`, `:189-198`.
- Read `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/004-opencode-typescript.md:16-38`.
- Read `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/005-opencode-python.md:16-38`.
- Read `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/006-opencode-shell.md:14-36`.
- Read `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/007-opencode-config.md:14-36`.
- Read `.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/002-opencode-detection.md:46-49`, `:80-107`.
- Read `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/018-webflow-plus-motion-dev.md:47-58`.
- Read `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/research/research.md:81-86`.

## Findings

1. **f-i8-01: Post-remediation aggregate/D3 gains are real only for the existing stated-route proxy, not for D4.** Pre-remediation live reports `aggregateScore: 71`, D2 `87`, D3 `42`, and D4 `null`; post-remediation live reports `aggregateScore: 79`, D2 `95`, D3 `50`, and D4 still `null`. Sources: `.opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.json:11-39`, `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:11-39`.

2. **f-i8-02: The D3 improvement is scenario-visible in stated routing, but it is not an observed exploration-cost metric.** SD-001 improved from `routedCount: 20`, `wastedCount: 12`, D3 `0.4` to `16`, `8`, D3 `0.5`; LS-001 improved from `16`, `11`, D3 `0.3125` to `15`, `10`, D3 `0.3333`; CS-001 improved from `16`, `10`, D3 `0.375` to `15`, `5`, D3 `0.6667`. Sources: `.opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.json:87-90`, `:163-166`, `:331-334`; `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:87-90`, `:155-158`, `:320-323`.

3. **f-i8-03: Live scoring still uses the same resource-overload proxy despite comments saying live mode should replace it with load-trace metrics.** The scorer computes D2 from `resourceRecall` and D3 from `routerResult.resources.length` plus expected-resource waste, while the live evidence block merely preserves `toolCalls`, `observedReads`, and `responseHead`. Sources: `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:94-118`, `:152-161`.

4. **f-i8-04: The live executor explicitly cannot observe startup-loaded resources, so it asks the model to state a routing plan and grades that stated JSON.** The executor says OpenCode emits no startup resource manifest and therefore uses routing-analysis prompts; the prompt forbids edits and asks for a fenced JSON block containing `surface`, `subLanguage`, `resources`, `assets`, and `agent`. Sources: `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs:15-19`, `:35-52`.

5. **f-i8-05: Current D4 ablation inherits the routing-analysis prompt, so D4 is grading the quality of “what would you load?” output, not routine task execution.** `runD4Ablation` calls `buildLiveDispatchPrompt(scenario)` for skill-on, while skill-off also emits only a routing JSON block. Sources: `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:24-31`, `:58-63`.

6. **f-i8-06: Current D4 uses a hallucination grader that explicitly refuses to score correctness, paths, or planning structure.** The grader prompt identifies the dimension as “D4 Hallucination” and says “Do not score correctness,” “Do not score paths,” and “Do not score pre-planning structure.” Sources: `.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md:3-4`, `:22-41`.

7. **f-i8-07: The D4 formula compresses two independent hallucination scores into a delta, so the checked-in D4 number is not an absolute usefulness score.** The script computes `score = 0.5 + (onScore - offScore) / 2`, making `0.5` neutral, `1` skill-on fully better, and `0` skill-off better. Source: `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:35-52`.

8. **f-i8-08: The checked-in D4 artifact is not auditable enough to explain the LS-001 loss or CS-001 win.** The D4 module can return raw grader objects, but the saved `d4-ablation.json` only preserves aggregate, scenario id, `score`, `onScore`, `offScore`, attribution, grader mode, contamination, and activation. Sources: `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:47-52`; `.opencode/skills/sk-code/benchmark/live-final/d4-ablation.json:1-28`.

9. **f-i8-09: Normal skill-benchmark reports cannot currently lift D4 because the orchestrator never integrates `runD4Ablation`; it writes only the aggregate report where D4 is hard-coded null.** The run script labels D4 ablation “follow-on,” runs playbook scenarios through `dispatchScenario`, scores rows, aggregates, and writes `skill-benchmark-report.json/.md`; the scorer sets D4 `null` per row and in dimension scores. Sources: `.opencode/skills/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:15-17`, `:105-135`, `:169-175`; `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:130-131`, `:254-264`.

10. **f-i8-10: The playbook already has the fields needed for D4-R task usefulness: user-visible outcome, exact loaded refs/assets, and binary acceptance rules.** The root playbook says a scenario passes only when routing is correct, resource-loading is exact, and the user-visible outcome is sound; it also requires the AI’s response/action and scenario verdict as evidence. Sources: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:43-49`, `:75-84`, `:109-125`.

11. **f-i8-11: A D4-R instrument can reuse existing routine OPENCODE scenarios without inventing a synthetic corpus.** The playbook defines LS-001 through LS-004 for TypeScript, Python, Shell, and Config, and each per-feature file supplies a concrete routine prompt plus expected language-specific references and “expected NOT loaded” contamination constraints. Sources: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:189-198`; `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/004-opencode-typescript.md:16-38`; `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/005-opencode-python.md:16-38`; `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/006-opencode-shell.md:14-36`; `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/007-opencode-config.md:14-36`.

12. **f-i8-12: The repository already has a model for non-recall outcome scoring: the browser executor scores observed behavior signals, not route recall.** `browser-executor.cjs` states browser scenarios must map pass criteria to capturable signals and never fabricate PASS; MR-001 checks `exportsOk`, `animateDone`, `consoleErrors`, and `error`. Sources: `.opencode/skills/deep-improvement/scripts/skill-benchmark/browser-executor.cjs:4-16`, `:62-82`, `:88-112`.

13. **f-i8-13: The strongest D4-R design is a separate task-outcome delta, not a replacement for D2/D3.** For each routine text scenario, run skill-on/skill-off in no-write “produce a minimal patch plan or unified diff plus verification commands” mode, then score four axes: task-action correctness, verification fit, contamination/noise, and hallucinated symbol/path risk. This is grounded in the playbook’s outcome rule and the existing D4 ablation’s on/off delta mechanics, but it avoids conflating usefulness with resource recall. Sources: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:109-125`; `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:35-52`.

## Implications for D3/D4

For **D3**, the post-remediation gain is partly real: the stated-route rows route fewer resources and waste fewer paths on SD-001, LS-001, and CS-001. The measured live D3 lift from `42` to `50` is therefore a real improvement under the current proxy.

For **D3 honesty**, the same reports still show broad observed discovery paths such as `references/webflow/**/*`, `assets/webflow/**/*`, `references/**/*.md`, and `assets/**/*.md`. Because observed reads are stored as evidence but D3 is computed from stated routing, the real exploration-cost gain remains partly UNKNOWN. Sources: `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:127-135`, `:193-201`, `:256-263`, `:362-368`.

For **D4**, no post-remediation usefulness lift is proven. The current live reports leave D4 unscored, and the only D4 sidecar is pre-remediation, two rows, approximate, and hallucination-delta based. The existing `D4 ~=49` should be treated as a measurement artifact for this follow-on question, not as a stable routine-task usefulness estimate.

The concrete next lever is **D4-R task-outcome ablation**:

- Inputs: LS-001, LS-002, LS-003, LS-004, plus optional SD-002 as an OpenCode implementation-style routine task.
- Prompt shape: no-write patch plan or unified diff plus verification commands, not routing JSON.
- Scoring axes: task-action correctness, verification fit, contamination/no irrelevant surface-language guidance, hallucinated symbol/path risk.
- Report shape: keep existing `D4_hallucination_delta` separate from new `D4_task_outcome_delta`.
- Real gain criterion: skill-on improves task-action correctness or verification fit versus skill-off without increasing broad observed discovery.

## What's still unexplored

Gold-map reconciliation remains unresolved for SD-001 and CS-001; that bounds true D2 headroom and whether some “misses” are authored-gold errors.

The assets lane still needs a separate deferred-asset support score. Assets should not simply be folded into D3 if the router contract intentionally defers them on demand.

The next iteration should focus on **D4-R implementation details** or **gold-map reconciliation**. If prioritizing score honesty, choose gold-map reconciliation. If prioritizing routine usefulness, implement the D4-R rubric and run LS-001 plus LS-002 first.
