# Iteration 7: Concern/phase slicing vs the real live broad-read waste

## Focus

I chose **concern-level / phase-gated slicing** as the primary lever because it is the main open lever not already remediated. The repository shows cross-surface slicing, asset deferral, and OpenCode language slicing are already represented in the current router path; Webflow still has no equivalent sub-slice, and phase boosts are explicitly absent from the machine-readable benchmark projection.

## Actions Taken

- Read `.opencode/skills/sk-code/references/smart_routing.md:37-65`, `:105-126`, `:287-459` for intent scoring, Webflow contracts, router map, and route-time slicing.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs:165-253` for deterministic surface/language filtering.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:94-118`, `:152-160` for D2/D3 math and live evidence shape.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs:15-19`, `:35-52`, `:149-167` for stated-routing versus observed-read measurement.
- Read `.opencode/skills/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:20-22`, `:121-155` for playbook gold parsing.
- Read `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.md:12-23`, `:39-66` and JSON rows at `:195-215`, `:330-395`, `:687-707`, `:912-977`.
- Read `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.md:12-23`, `:38-46` and JSON rows at `:73-138`, `:141-203`, `:306-370`.
- Read `.opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.md:12-23`, `:38-46` and JSON rows at `:73-146`, `:149-213`, `:317-389`.
- Read playbook scenarios `SD-001`, `LS-001`, `LS-002`, `CS-001`, `CS-006`, `CS-007` at their cited line ranges.

## Findings

1. **H2 is not currently measurable as “phase gating” in router mode.** The smart-router prose says scoring should boost unambiguous phase signals by `+5`, but the machine-readable router explicitly says it has “No phase boosts” and “No doc-only anti-signals”; router replay therefore cannot validate a phase-gated lever without adding new machine-readable state first. Sources: `.opencode/skills/sk-code/references/smart_routing.md:60-65`, `.opencode/skills/sk-code/references/smart_routing.md:293-296`.

2. **The current route-time filter already implements the shipped large levers, so H2’s remaining structural target is narrower than the round-1 framing.** Router replay filters by detected surface, drops `assets/*`, keeps Motion overlay, and slices OpenCode language folders; Webflow explicitly has no language sub-slice. Sources: `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs:225-253`, `.opencode/skills/sk-code/references/smart_routing.md:450-459`.

3. **Webflow phase/concern gating has a hard D2 safety conflict.** The prose says every Webflow surface detection “MUST load the implementation trio” and calls it a contract to prevent SD-001-style partial coverage; any H2 implementation that drops Webflow implementation docs for D3 must either violate this contract or add a more precise replacement rule. Sources: `.opencode/skills/sk-code/references/smart_routing.md:118-126`.

4. **Deterministic SD-001 has little remaining D3 headroom from concern slicing but a large D2 problem.** Current router-final SD-001 scores D3 `0.833` with only `6` routed and `1` wasted, while D2/resource recall is only `0.4545`; removing the last wasted resource would at most move deterministic D3 to `1.0`, but it would not fix the first failing stage (`discovered`). Sources: `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:195-215`, `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:225-226`.

5. **Live SD-001 waste is real execution behavior, not just deterministic router structure.** Post-remediation live SD-001 still reports D3 `0.5` with `16` routed and `8` wasted, and observed reads include broad `assets/webflow/**/*` and `references/webflow/**/*` globs. Since live parsing uses the model’s stated `resources` and `assets` as `observedResources`, while observed file reads are only corroborating evidence, the reported D3 is a stated-route metric and the broad-glob cost is an additional unscored live-cost artifact. Sources: `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:87-135`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs:149-167`.

6. **The strongest live D3 lever is “no broad skill-tree exploration,” not phase-gating the deterministic map.** Pre-remediation live SD-001 used broad `references/webflow/**/*.md`, `assets/webflow/**/*.md`, `references/universal/*.md`, and asset globs with D3 `0.4`; post-remediation SD-001 still has broad webflow globs but improved to D3 `0.5`. That gain is partly real stated-route tightening, but observed exploration cost remains undercounted by D3. Sources: `.opencode/skills/sk-code/benchmark/live-final/skill-benchmark-report.json:87-146`, `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:87-135`.

7. **Residual router-final Webflow cross-stack misses are mostly intent/gold-map issues, not wrong phase slicing.** CS-006 is an animation-heavy performance prompt expecting Webflow CWV plus Motion performance/decision refs, but router-final scores D2 `0.375`, D3 `0.333`, routed `9`, wasted `6`; CS-007 is reduced-motion accessibility guidance expecting Webflow verification plus Motion performance/integration refs, but scores D2 `0.4286`, D3 `0.333`, routed `9`, wasted `6`. These scenarios need better concern-intent mapping and gold reconciliation more than a smaller phase slice. Sources: `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/023-cwv-gates-animation-heavy.md:16-44`, `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/024-prefers-reduced-motion.md:16-43`, `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:912-977`.

8. **Routine-task D4 cannot be inferred from H2.** D4 is still unscored in current live-remediated output, and the old ablation is only `n=2` with `attribution:"approximate"`; the routine loss on LS-001 is pre-remediation (`onScore 0.82`, `offScore 0.95`) and cannot validate whether concern slicing helps routine work now. Sources: `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.md:12-23`, `.opencode/skills/sk-code/benchmark/live-final/d4-ablation.json:1-17`.

9. **LS-002 is a valid third routine D4-R candidate and should test output usefulness, not recall.** The LS-002 playbook asks for a concrete Python CLI change (`--json-output` flag) and expects Python refs plus shared refs while excluding other languages; it is structurally analogous to LS-001 but not TypeScript, making it a good third routine scenario for testing whether the routed slice helps produce a correct small implementation plan. Sources: `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/005-opencode-python.md:16-38`, `.opencode/skills/sk-code/manual_testing_playbook/02--language-sub-detection/004-opencode-typescript.md:16-38`.

## Implications for D3/D4

For **D3**, the next real lever is not a broad H2 phase gate. The build-ready lever is narrower: add an explicit **live routing discipline guard** that forbids broad `references/**` and `assets/**` globs after `sk-code` loads, requiring exact files from the stated route unless the agent declares an on-demand deep-dive reason. This targets real observed behavior in live runs and avoids D2 regression.

Expected magnitude: live SD-001 has 8 wasted stated paths post-remediation and broad observed reads; even if stated D3 only improves from `0.5` toward the deterministic SD-001 `0.833`, that is a real gain. The broad observed-read reduction is real cost reduction but currently a measurement artifact unless D3 starts scoring observed reads separately.

For **deterministic D3**, H2 has limited safe headroom on SD-001 because current routed waste is already only `1/6`. On CS-006 and CS-007, the issue is low D2 plus broad/wrong expected coverage, so a smaller concern slice could worsen discovery unless the map first reconciles performance/accessibility/Motion gold.

For **D4**, H2’s usefulness gain is UNKNOWN. The existing D4 evidence is pre-remediation, approximate, and only two cases. The next useful D4 work should run a task-usefulness instrument on LS-001 plus LS-002: compare whether the slice leads to correct concrete steps, correct verification command, and no irrelevant cross-surface advice. Do not score it as resource recall.

Real versus artifact:

- Real: reducing broad live exploration is real token/tool cost reduction.
- Real: preserving exact Motion/Webflow performance and accessibility refs is behavior-relevant for CS-006/CS-007.
- Artifact: deterministic D3 improvement from dropping a remaining Webflow doc is not valuable if D2 remains below pass.
- Artifact: D4 improvement remains unproven until post-remediation ablation uses a task-usefulness grader and at least a third routine scenario.

## What's still unexplored

- Gold-map reconciliation for CS-006 and CS-007: determine whether expected refs are authored correctly or whether `RESOURCE_MAP` lacks performance/accessibility concern paths.
- A live D3 metric variant that separately scores stated route size and observed file-read/glob cost.
- A post-remediation D4-R routine instrument using LS-001 and LS-002, graded on output usefulness rather than recall.
- Whether Webflow needs a small concern overlay taxonomy (`implementation`, `performance`, `verification`, `accessibility`, `motion`) rather than a phase gate.
