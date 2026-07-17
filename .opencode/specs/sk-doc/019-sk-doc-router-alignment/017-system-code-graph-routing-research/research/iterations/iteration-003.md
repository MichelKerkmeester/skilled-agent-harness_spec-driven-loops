# Iteration 3: Reproducible Baseline and Typed-Pair Scoring Boundary

## Route Proof
- Resolved route: `mode=research`; `target_agent=@deep-research`; `execution=single_iteration`; `state_source=externalized_files`; `do_not_switch_mode=true`.
- Canonical runtime agent loaded from `.opencode/agents/deep-research.md`; this run remained LEAF-only and dispatched no Task or sub-agent.
- Packet root: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/`.
- Allowed writes were limited to this narrative, one append to `deep-research-state.jsonl`, and the write-once `deltas/iter-003.jsonl`.

## Focus
Establish a reproducible first benchmark procedure for the current unmodified `system-code-graph` router, explain the score it can produce today, and define a comparison boundary for a future typed-pair target. “Establish” is interpreted as specifying the exact immutable baseline run and score semantics, not executing it, because execution would create benchmark reports outside the three explicitly allowed iteration artifacts.

## Findings
1. The canonical baseline entry point is the Lane-C loop host in deterministic router mode: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs --mode=skill-benchmark --skill=.opencode/skills/system-code-graph --outputs-dir=.opencode/skills/system-code-graph/benchmark/baseline --trace-mode=router`. The host delegates to `run-skill-benchmark.cjs`, whose sequence is D5 connectivity, playbook/fixture loading, router replay, private-gold join, aggregation, JSON report, then Markdown rendering; the direct runner requires `--skill` and `--outputs-dir`. [SOURCE: .opencode/commands/deep/assets/deep_skill-benchmark_auto.yaml:90-106] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:7-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:193-255] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:330-345]
2. The current unmodified baseline is necessarily an **untyped/flat-gold** measurement: without `leaf-manifest.json`, the typed-gold classifier returns `null`, leaving the flat-string scoring path unchanged. Mode A scores measured D1-intra, D2, and (when applicable) D3, normalizes over only measured weights, leaves D1-inter and D4 unscored, and uses D5 as a hard structural gate. Therefore the baseline record must preserve the report, command, commit/tree identity, scenario count, parse warnings, and D1/D2/D3/D5 coverage rather than presenting the aggregate alone. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-77] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:11-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1160-1168]
3. A future typed target engages a different measurement lane only when both a committed manifest and scenario-level `expected_leaf_resources` exist. Valid typed gold supersedes flat resource recall for D1-intra/D2 and uses typed-pair precision for D3; malformed or unresolved oracle gold is excluded, while a valid gated row with no router `resourceContract` is classified as `routing_contract_error`. Consequently, a raw aggregate delta from today’s untyped baseline to a typed target is not a pure optimization delta: report it as a pre-contract versus post-contract comparison, keep scenario-set coverage explicit, and use `dims.typedPairRecall` plus error classes as the target-contract evidence. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1202-1257] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1325] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1343-1356] [INFERENCE: because the scoring oracle and canonical resource representation change between the two runs, aggregate movement cannot be attributed solely to router quality]
4. Before the baseline command is treated as representative of all 28 documented scenarios, corpus eligibility must be audited. The loader accepts either an `AA-000`-style root cross-reference table or per-file YAML benchmark frontmatter, whereas the current root index lists numeric IDs such as `001` and simple file links; the authoring contract requires benchmark fields such as `id`, `expected_intent`, `expected_resources`, and an exact prompt. The first baseline is reproducible only if its loaded scenario count and parse warnings are recorded; “28 documented” must not be silently equated with “28 scored.” [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:16-25] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:318-340] [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:18-32] [SOURCE: .opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:66-153] [SOURCE: .opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual_testing_playbook_snippet_template.md:154-161]

## Ruled Out
- Executing the benchmark in this iteration: it would create `skill-benchmark-report.json` and `.md` outside the three allowed artifacts. The exact command is retained for the first authorized benchmark run.
- Comparing only aggregate scores across the untyped and typed runs: the oracle, applicable dimensions, and resource representation change, so this would conflate contract migration with routing improvement.
- Assuming all 28 documented scenarios are currently scoreable: loader eligibility and parse warnings must be observed in the actual baseline report.

## Dead Ends
None promoted. The baseline command and score boundary are productive; actual score values remain intentionally unclaimed until an authorized run writes its report.

## Edge Cases
- Ambiguous input: “establish baseline” could mean execute or define. The explicit three-artifact write lock makes procedure definition the only compliant interpretation; execution is deferred.
- Contradictory evidence: none.
- Missing dependencies: no authorized benchmark output directory was available inside this iteration’s write scope; no substitute score was fabricated.
- Partial success: none. The procedure and score interpretation are answered; the numeric baseline awaits the separately authorized run.

## Sources Consulted
- `.opencode/commands/deep/assets/deep_skill-benchmark_auto.yaml:90-106`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:7-20,65-77,193-255,330-345`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:11-20,1066-1078,1160-1168,1202-1257,1287-1356`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:16-25,120-139,318-360`
- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:18-32,66-153`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual_testing_playbook_snippet_template.md:154-161`

## Assessment
- New information ratio: 1.00
- Novelty justification: 4 of 4 findings are fully new relative to iterations 1-2.
- Questions addressed: How should the first skill-benchmark baseline be established with no committed baseline? How would skill-benchmark score current untyped output versus proposed typed gold?
- Questions answered: Both addressed questions.

## Reflection
- What worked and why: Following the command entry point into the runner, loader, and scorer separated executable procedure, corpus eligibility, and score semantics.
- What did not work and why: A numeric baseline could not be produced without violating the explicit three-artifact write boundary.
- What I would do differently: In an authorized benchmark step, capture the immutable baseline report first, then audit its loaded scenario count and warnings before adding any typed gold or manifest.

## Recommended Next Focus
Classify the 28 playbook files into benchmark-eligible routing, holdout, negative, and non-routing scenarios; identify the minimal scenario subset that can receive typed gold without changing scenario intent. Then run the immutable unmodified baseline in a separately authorized benchmark output directory before any manifest, gold, or router optimization is applied.
