# Iteration 1: sk-code router and manifest contract trace

## Focus

Trace the sk-code router configuration and typed manifest contract end to end, with emphasis on the source of the untyped always-loaded preamble and the mechanism behind weak leaf-resource recall. The narrow interpretation for this iteration was deterministic Mode A router replay; live executor behavior and fitted-versus-holdout design remain for later iterations.

## Actions Taken

1. Read the externalized config, state log, strategy, and findings registry before selecting the strategy's `NEXT FOCUS`.
2. Traced `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, `RESOURCE_MAP`, surface/language slicing, and resource-contract conversion from the authoritative router document through `router-replay.cjs`.
3. Compared the router's raw resource forms with `mode-registry.json`, `leaf-manifest.json`, and the shared dual-read contract.
4. Inspected the committed typed baseline and packet implementation evidence to connect the code path to observed recall, unresolved counts, and the `routing_contract_error` verdict.

## Findings

1. The deterministic replay parses the retained surface router, scores every matching keyword at unit weight, selects every intent within one point of the top score, then seeds the route with all four `DEFAULT_RESOURCE` entries before unioning selected `RESOURCE_MAP` entries. Surface slicing subsequently retains all universal resources, the Motion overlay, and only the detected surface; OpenCode routes are further sliced by detected language, while assets are deferred. Thus `INTENT_SIGNALS` controls which map rows enter the candidate union, `RESOURCE_MAP` controls available leaf files, and `DEFAULT_RESOURCE` affects every route but cannot improve intent-specific expected-resource recall. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:309-343] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:435-459] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:555-599]
2. The untyped preamble originates exactly in `shared/references/smart_routing.md`: its four raw values are `references/stack_detection.md`, `references/phase_detection.md`, `references/smart_routing.md`, and `references/universal/code_quality_standards.md`. `parseDefaultResource` preserves those strings and `assembleResources` injects them unconditionally, so the contract fault is deterministic rather than an executor-side anomaly. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:309-318] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:99-110] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:563-568]
3. Typed conversion is fail-closed: a raw resource resolves only when it is packet-qualified by a packet declared in `mode-registry.json`, or when an authored `leaf-aliases.json` entry maps a shared disk path to a typed pair; the result must then exist in `leaf-manifest.json`. sk-code declares only `code-quality`, `code-review`, `code-webflow`, and `code-opencode`, its manifest has the same four modes, and no `leaf-aliases.json` exists. Therefore merely changing the preamble from `references/...` to `shared/references/...` would still be unresolved; clearing the error through a shared tier requires an actual declared shared workflow mode plus manifest leaves, or explicit authored aliases to existing modes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:187-275] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:217-243] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99] [SOURCE: .opencode/skills/sk-code/leaf-manifest.json:1-223]
4. The committed baseline confirms that leaf recall and contract validity are separate signals. Scenario `SD-001` has flat and typed-pair recall of 3/7 (0.429), 26 observed typed pairs, and five unresolved raw resources; scenario `CS-001` has 5/8 recall (0.625), 19 observed pairs, and four unresolved resources. In both cases the unresolved preamble causes `routing_contract_error`, while the missed expected leaves remain a genuine intent/resource-selection gap. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:356-478] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1543-1667]
5. The present baseline cannot establish generalization: all 23 scored scenarios are fitted and there are zero holdouts, so the report explicitly leaves holdout score and generalization gap null. Its aggregate is 83/100 with D1-intra 90, D2 84, and D3 66; this means the carried-forward “about 65/100” figure is not the current typed baseline and should not be used as the optimization baseline without provenance. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/implementation-summary.md:68-78]

## Questions Answered

- **How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` influence leaf selection and recall?** Answered for deterministic Mode A replay: signals choose near-tied intent rows, the map supplies candidate leaves, and the default contributes an unconditional preamble that affects observed count and contract validity but not intent-specific expected-leaf hits.

## Questions Remaining

- How does the full benchmark pipeline combine router replay, D1-D5, typed-pair recall, and fitted-versus-holdout scoring?
- Should the universal preamble become a real shared manifest mode or be excluded from typed leaf recall, and what invariants distinguish those contracts?
- Which keyword, weighting, ambiguity, and resource-map changes improve missed expected leaves without increasing D3 waste?
- What holdout and negative validation matrix prevents fitted metric gaming?

## Ruled Out

- **Simple path-prefix rewrite only:** replacing `references/...` with `shared/references/...` cannot resolve typed identity because `shared` is neither a declared packet/mode nor an authored alias. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99]
- **Treating `routing_contract_error` as the cause of low recall:** unresolved preamble entries explain the error class, but baseline hit/expected counts independently show missed expected leaves. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:431-440] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1620-1629]

## Dead Ends

None promoted as exhausted in this first iteration.

## Edge Cases

- Ambiguous input: The phrase “packet-qualifying ... as a shared manifest mode” could mean a string prefix alone or a declared typed mode. The contract evidence supports only the latter; the prefix-only alternative is ruled out.
- Contradictory evidence: The carried context cites about 65/100, while the current committed typed baseline reports 83/100. The 83/100 artifact is treated as current; provenance for the older figure remains unresolved.
- Missing dependencies: Memory bootstrap was unavailable before dispatch, but direct packet and source evidence was sufficient.
- Partial success: None; one key question was answered and two adjacent questions were narrowed with cited evidence.

## Sources Consulted

- `.opencode/skills/sk-code/shared/references/smart_routing.md:298-572`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:39-670`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-275`
- `.opencode/skills/sk-code/mode-registry.json:21-99`
- `.opencode/skills/sk-code/leaf-manifest.json:1-223`
- `.opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65,356-478,1543-1667`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/implementation-summary.md:58-78,105-128`

## Assessment

- New information ratio: 0.80
- Novelty basis: Three of five findings establish new end-to-end contract mechanics; two partially confirm carried evidence with exact source and metric anchors.
- Questions addressed: `INTENT_SIGNALS`/`RESOURCE_MAP`/`DEFAULT_RESOURCE`; shared preamble qualification; source of leaf-recall gap; generalization readiness.
- Questions answered: deterministic influence of `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` on leaf selection and recall.

## Reflection

- What worked and why: Following the raw resource string from the router source through replay assembly and fail-closed dual-read exposed the exact contract boundary and separated unresolved preamble entries from missed expected leaves.
- What did not work and why: The packet's older aggregate figure could not be reconciled because it lacks an artifact pointer in the current prompt/state; the current baseline is authoritative only for its own committed run.
- What I would do differently: Next iteration should trace one fitted low-recall scenario from authored gold through scoring, then construct a held-out counterpart before proposing router changes.

## Next Focus

Trace the benchmark scoring pipeline and one representative low-recall scenario end to end: identify exactly how D1-intra, D2, D3, typed-pair recall, and `routing_contract_error` are aggregated, then specify the minimal fitted/holdout matrix needed to evaluate a declared shared-mode change independently from leaf-recall optimizations.

## Recommended Next Focus

Use the same scoring trace to separate two experiments: (A) contract-only shared-mode qualification, expected to clear unresolved counts without changing hit/expected recall, and (B) intent/resource selection changes, evaluated on both fitted and newly declared holdout scenarios with D3 waste guarded.
