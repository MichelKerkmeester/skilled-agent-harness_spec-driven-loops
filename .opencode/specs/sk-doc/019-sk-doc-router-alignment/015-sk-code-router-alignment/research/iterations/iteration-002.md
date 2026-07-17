# Iteration 2: Benchmark Pipeline, Typed Recall, and Generalization

## Focus

Trace how the skill benchmark combines deterministic router replay, D1-D5 scoring, typed-pair recall, and fitted-versus-holdout reporting. The interpretation was narrowed to the committed Lane C pipeline; live-executor quality beyond its explicit D1-inter and D4 interfaces is deferred.

## Actions Taken

1. Read the externalized config, state log, strategy, and findings registry and preserved both blocked approaches from iteration 1.
2. Located the benchmark implementation and confirmed that iteration and delta outputs did not already exist.
3. Traced the benchmark orchestrator from D5 preflight through scenario dispatch, scoring, aggregation, and dual report emission.
4. Traced the deterministic scoring formulas, typed-gold gate, report provenance guard, and fitted/holdout presentation.

## Findings

1. The Lane C run is a staged join rather than one monolithic score: it snapshots the manifest, runs D5 connectivity and hub-registry checks first, dispatches each playbook scenario through router or live execution, passes each observation to `scoreScenario`, aggregates the rows, and writes canonical JSON before rendering Markdown from that object. A manifest digest change aborts the run instead of scoring against moving topology. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:208-247]
2. Deterministic Mode A measures only available dimensions and renormalizes their weights per row: D1-intra is 40% intent recall plus 60% resource recall, D2 is the resource-recall proxy, and D3 is `1 - unexpected/routed` when positive resource gold and routed output both exist. D1-inter joins only when advisor evidence exists, while D4 requires live ablation; therefore a Mode A aggregate must not be read as a fixed-weight score over all D1-D5 dimensions. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:7-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:179-291] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078]
3. Typed-pair recall is an additive, fail-closed diagnostic lane gated on both a target `leaf-manifest.json` and scenario-authored typed gold. The fixture is first classified against schema, manifest, and selected-map constraints; invalid oracle rows are excluded, while a missing router `resourceContract` is a `routing_contract_error` with null typed score rather than a zero recall miss. The renderer additionally refuses gated reports lacking target-root, manifest-digest, or scenario provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1093-1196] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1202-1228] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:34-62]
4. D5 is qualitatively different from the row-normalized dimensions: structural or registry failure caps the verdict and returns a non-zero process status even though report artifacts are still emitted. D4 task-outcome ablation is opt-in, live-only, target-scenario-specific, and attached as an advisory signal rather than silently folded into the deterministic aggregate. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:251-265] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:275-320] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:116-149]
5. Fitted-versus-holdout is a scenario-partition summary over scored rows, not a second router replay: the renderer consumes fitted count/score, holdout count/score, negative count, and their gap from the aggregate report. The committed sk-code baseline has no declared holdouts, so it can establish fitted behavior and suppression coverage but cannot establish generalization; a non-null generalization gap requires independently declared holdout scenarios. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:89-113] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65] [INFERENCE: the renderer only reports aggregate partition fields, and the captured baseline reports zero holdouts and null holdout score/gap]

## Questions Answered

- How does the skill-benchmark compute router replay, D1-D5, typed-pair recall, and fitted-versus-holdout results?

## Questions Remaining

- How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` influence recall outside the already-confirmed deterministic assembly path?
- Does packet-qualifying the universal preamble as a shared manifest mode clear `routing_contract_error` without degrading surface routing?
- Which routing-template, scoring-logic, and JSON-artifact changes best improve leaf recall without increasing D3 waste?
- What concrete fitted, holdout, negative, and topology-mutation matrix prevents metric gaming?

## Ruled Out

- Treating a Mode A aggregate as if all D1-D5 weights were always present: unavailable dimensions are excluded and measured weights are renormalized. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078]
- Using the current baseline's fitted score as evidence of holdout generalization: its holdout partition is empty. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65]

## Dead Ends

None added. The iteration did not retry the blocked simple path-prefix rewrite or the blocked claim that `routing_contract_error` itself causes low leaf recall.

## Edge Cases

- Ambiguous input: “combine” could mean scoring arithmetic or execution orchestration; both were traced, while live model quality was deferred.
- Contradictory evidence: none newly found.
- Missing dependencies: no memory/resource map was available, so exact packet anchors and prior captured baseline evidence were reused.
- Partial success: none; the in-scope pipeline question is answered, but no holdout score can be calculated from a corpus with zero holdouts.

## Sources Consulted

- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-config.json:1-77`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-state.jsonl:1-8`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:24-136`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:1-294`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:1-346`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1-1228`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs:1-248`
- `.opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65`

## Assessment

- New information ratio: 0.90
- Novelty basis: four of five findings are fully new pipeline details and one is partially new synthesis of the already-captured zero-holdout baseline, so `(4 + 0.5) / 5 = 0.90`.
- Questions addressed: benchmark pipeline composition; fitted-versus-holdout interpretation; anti-gaming implications.
- Questions answered: benchmark pipeline composition.

## Reflection

- What worked and why: following the actual call chain separated execution order, row scoring, hard gates, advisory lanes, and rendering, preventing unlike metrics from being collapsed into one number.
- What did not work and why: the current corpus cannot yield holdout performance because no holdout scenarios are declared; this is an evidence absence, not a scoring failure.
- What I would do differently: next iteration should inspect scenario-stage parsing and construct a coverage matrix before proposing router changes, so fitted and holdout obligations are fixed in advance.

## Recommended Next Focus

Define the validation matrix that freezes fitted, holdout, negative, typed-contract, D3-waste, and D5-topology checks before any router optimization; include explicit anti-contamination and no-gold-from-output invariants.
