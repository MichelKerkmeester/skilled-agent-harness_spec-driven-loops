# Iteration 4: Benchmark Dimension Attribution

## Focus
This iteration attributed the frozen approximately 69 `CONDITIONAL` router-mode baseline across scored and unscored dimensions, then attempted a fresh benchmark through an explicitly non-writing wrapper. The selected interpretation of “fresh benchmark execution” was to execute the existing runner with `fs.mkdirSync` and `fs.writeFileSync` replaced by in-memory no-ops, preserving benchmark reads and scoring while guaranteeing that the benchmark command itself created or changed no files.

Exact route proof: `mode: "research"`, `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`.

## Findings
1. The frozen 69 is exactly attributable to the three scenario-weighted Mode-A dimensions: D1-intra is 100 at 13 points, D2 is 100 at 20 points, and D3 is 0 at 15 points, so `(13 + 20 + 0) / (13 + 20 + 15) = 68.75`, rounded once to 69. D5=100 is a separate hard gate and does not enter `modeAScore`; therefore the baseline’s only scored loss is the D3 proxy, not a demonstrated routing-recall failure. [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:29-56] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078]
2. D1-inter and D4 are unavailable measurements, not zero-valued losses. The report marks both `unscored-mode-a`, and the scorer includes D1-inter only when an advisor probe produces a numeric score while weighted D4 remains unscored; neither depresses the 69 aggregate. [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:29-61] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1576-1607]
3. A fresh non-mutating execution of the checked-in runner returned exit 0 but `NO-SCENARIOS`, aggregate `null`, D5=100, and 27 `feature file unreadable` warnings. The warnings request hyphenated feature paths such as `mode-routing/interface-mode.md`, while discovery found the current packet at underscored paths such as `manual_testing_playbook/mode_routing/interface_mode.md`; consequently the current harness cannot supply fresh per-dimension routing evidence until playbook-index paths and on-disk feature paths agree. This is a benchmark-input/topology fault, not evidence that sk-design currently routes incorrectly. [SOURCE: command output: non-mutating in-memory `run-skill-benchmark.cjs` execution, 2026-07-17T04:58Z] [INFERENCE: based on the command’s 27 unreadable-path warnings and scoped benchmark file discovery]
4. Typed gold plus a committed leaf manifest would replace the flat-string resource proxy for D1-intra/D2 with canonical pair recall and replace D3’s flat over-routing proxy with canonical pair precision. The frozen baseline has `routeGoldRows: 0`, so it measures none of that typed-pair behavior; adding valid typed gold would improve measurement validity, but it would not by itself prove a router repair. [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:83-116] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1356]
5. The checked-in `after_d3_proxy` report scores 100 with D1-intra=100, D2=100, D3=`null`, and D5=100. Because `modeAScore` drops null D3 from its denominator, this demonstrates a scoring-applicability change rather than evidence of better routing; it must not be used as the implementation’s routing-improvement baseline. [SOURCE: .opencode/skills/sk-design/benchmark/after_d3_proxy/skill-benchmark-report.json:29-56] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078]

## Ruled Out
- Treating D1-inter or D4 as contributors to the 31-point baseline shortfall: both are excluded from the Mode-A denominator rather than scored zero. [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:29-61]
- Treating the fresh `NO-SCENARIOS` result as a current routing score: no scenario row reached scoring, so only D5 connectivity was observed. [SOURCE: command output: non-mutating in-memory `run-skill-benchmark.cjs` execution, 2026-07-17T04:58Z]
- Treating `after_d3_proxy` aggregate 100 as proof that routing improved: D3 became inapplicable and dropped out while D1-intra and D2 stayed at their prior 100 values. [SOURCE: .opencode/skills/sk-design/benchmark/after_d3_proxy/skill-benchmark-report.json:29-56]

## Dead Ends
- Re-running the default current playbook through the benchmark runner cannot yield dimension evidence while its 27 feature references are unreadable. Repeating that command without first reconciling path topology is exhausted for this focus. [SOURCE: command output: non-mutating in-memory `run-skill-benchmark.cjs` execution, 2026-07-17T04:58Z]

## Edge Cases
- Ambiguous input: “Fresh benchmark execution” could imply normal report writes, but the dispatch forbade benchmark mutation. The in-memory write-suppressed runner was the narrowest interpretation satisfying both requirements.
- Contradictory evidence: the frozen report has 15 scored scenarios and aggregate 69, whereas the fresh current run found zero scenarios. Both are preserved: the former attributes the frozen baseline; the latter exposes current corpus-path drift and cannot replace the baseline score. [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:153-164] [SOURCE: command output: non-mutating in-memory `run-skill-benchmark.cjs` execution, 2026-07-17T04:58Z]
- Missing dependencies: no writable benchmark output directory was permitted; the runner’s output writes were captured in memory instead.
- Partial success: baseline attribution is complete, but fresh current per-dimension scoring is blocked by unreadable scenario feature paths. Status remains `complete` because the in-scope baseline-attribution question is answered with independent report and scorer evidence; the fresh-run limitation is explicit.

## Sources Consulted
- `.opencode/skills/sk-design/benchmark/README.md:18-55`
- `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:1-180`
- `.opencode/skills/sk-design/benchmark/after_d3_proxy/skill-benchmark-report.json:1-120`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:1-320`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:35-43,65-70,1066-1078,1302-1387,1499-1745`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:1-120`
- Command output: non-mutating in-memory `run-skill-benchmark.cjs` execution, 2026-07-17T04:58Z

## Assessment
- New information ratio: 0.90
- Novelty justification: 3 of 5 findings were fully new and 2 were partially new (raw 0.80), plus a 0.10 simplicity bonus for resolving the apparent 69-point attribution into one scored proxy loss, two unscored dimensions, and one current harness blocker.
- Questions addressed: Which scoring dimensions cause the approximately 69 CONDITIONAL baseline, and are they measurement gaps or routing faults?
- Questions answered: Which scoring dimensions cause the approximately 69 CONDITIONAL baseline, and are they measurement gaps or routing faults?

## Reflection
- What worked and why: reading the frozen report beside the exact row-normalization and typed-pair branches made scored loss, unscored coverage, hard gates, and advisory signals mechanically separable.
- What did not work and why: the fresh runner reached no scenarios because every indexed feature path was unreadable in the current tree; suppressing output writes preserved the failure faithfully but could not repair corpus topology.
- What I would do differently: begin the next benchmark pass with a read-only path reconciliation between the playbook index and actual feature files, then execute the same non-writing runner only after all selected scenarios resolve.

## Recommended Next Focus
Build the dependency-ordered optimization plan, starting with benchmark corpus path reconciliation as the prerequisite for any new score, then leaf-manifest generation, independently authored per-prompt typed gold, topology validation, and only afterward same-mode reruns that separate measured typed-pair movement from advisor/live/browser gaps.
