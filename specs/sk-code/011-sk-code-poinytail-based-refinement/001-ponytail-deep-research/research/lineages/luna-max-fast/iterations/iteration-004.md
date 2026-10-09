# Deep Research — Iteration 4

- Run: fanout-luna-max-fast-1791552201492-cjjo4q
- Focus: Ponytail benchmark and correctness gates versus sk-code benchmark and advisor evidence
- Status: complete
- New information ratio: 0.6667

## Focus

What do Ponytail's benchmark and correctness gates measure, and where could sk-code's benchmark and advisor tooling gain decision-useful evidence?

## Actions Taken

- Compared Ponytail's single-shot and real-agent evaluation methods, task tiers, hidden checks, test mutation measure, and stated limits.
- Compared Ponytail's correctness and safety eligibility gates with the active deep-improvement Lane B correctness gate and the earlier refinement's benchmark recommendations.
- Checked current advisor probe coverage, the two-axis hub outcomes, the remaining compiled-routing scenario, and the retired sk-code Lane C benchmark.

## Findings

1. **ALREADY-ADOPTED:** Keep correctness as an eligibility gate and do not blend it with brevity or format. Ponytail separates correctness and safety gates from size and efficiency measures; sk-code's active Lane B gate already uses correctness for eligibility and removes a saturated correctness column from ranking. The earlier refinement also placed new size and over-engineering measures after that gate and rejected a separate PromptFoo clone. Sources: `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:71-80`; `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs:8-20,124-159`; `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:62,76`.
2. **NEW — original idea:** Keep advisor identity accuracy separate from sk-code's internal two-axis routing quality, then report compiled-route outcomes by route shape and expected workflow/surface set. Ponytail's separated task tiers show why an aggregate score can hide a weak dimension; sk-code has `single`, `orderedBundle`, `surfaceBundle`, and `defer` outcomes, while the advisor probe battery measures only whether `sk-code` wins top-1. The current compiled-routing corpus has one `surfaceBundle` case for Webflow, and the old Lane C skill benchmark is retired. A compact matrix over those four outcomes, with positive and negative bundle controls, would expose workflow-mode misses and over-bundled surfaces without changing the advisor's outer-skill contract. Sources: `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:37-45,149-158`; `.skilled/skills/sk-code/hub-router.json:4-18`; `.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:11-19,53-59`; `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:29-35,44-61`; `.skilled/skills/sk-code/benchmark/README.md:14-26`.
3. **NEW:** If a future agentic code benchmark measures implementation quality, report test effectiveness separately from test presence: pre-classify which tasks need tests, inject a small fault into the produced code, then run the agent's tests and report fault detection as an advisory signal. Ponytail applies this check to agent-written tests; sk-code's active Lane B scorer currently returns correctness, format, and length measures for one extracted function, while the earlier benchmark recommendation covers code size and over-engineering only. The old sk-code Lane C skill benchmark is retired and measures routing, discovery, and usefulness rather than agent-written test sensitivity, so this belongs in a future agentic benchmark scope, not an unrequested resurrection of Lane C. Sources: `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:78-95`; `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs:6-16`; `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:62`; `.skilled/skills/sk-code/benchmark/README.md:14-26`.

## Questions Answered

- What do Ponytail's benchmark and correctness gates measure, and where could sk-code's benchmark and advisor tooling gain decision-useful evidence? **Answered:** Ponytail measures task-tiered correctness, adversarial safety, source size, tests-written rate, test defect detection, completeness, over-engineering, cost, duration, and turns; some agentic metrics use self-tested LLM judges and the report states task coverage and host/model/sample-size limits. sk-code should keep its existing hard correctness gate, add route-shape and bundle-set reporting for the hub's internal router, and consider mutation sensitivity only if a future agentic benchmark captures generated tests.

## Questions Remaining

- Which older recommendations are already adopted, lost, or still new after checking the current two-axis hub, every nested mode, and related tooling?

## Rejected Transfers

- Do not rank a code-quality or routing change as a win merely because it writes less or uses fewer tokens. Keep deterministic correctness and safety checks as eligibility gates, with efficiency and format as separately reported measures. Sources: `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:71-80`; `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs:8-20`; `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:62,76`.
- Do not revive the retired Lane C or create a standalone PromptFoo clone; any future report should extend the active, correctness-gated Lane B or use a specifically scoped new agentic packet. Sources: `.skilled/skills/sk-code/benchmark/README.md:14-26`; `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:76`.

## Assessment

Ponytail's agentic report distinguishes safety-tier results from size-only tasks and names the limitations of both deterministic checks and judge-based measures. It also reports when outcomes are level rather than claiming that a smaller diff proves quality. Current sk-code already has the hard correctness-gate principle in Lane B, and its separate advisor validation covers corpus, holdout, parity, safety, and latency at the outer skill-routing layer. The most useful gap is evidence organized around the hub's own route shapes and surface bundles. Mutation sensitivity is a distinct extension for a future agentic code benchmark because the active function-level scorer does not receive the generated test suite.

## Reflection

Benchmark evidence should identify what passed, what was merely measured, and which task classes were omitted. I treated Ponytail's available report as evidence for the evaluation methods it documents, not as proof that its results generalize to sk-code tasks, models, or runtimes.

## Recommended Next Focus

Reconcile each recommendation in the older Ponytail refinement report against current source across the hub, nested quality/review/webflow/opencode/obsidian modes, hook/advisor tooling, and benchmark infrastructure. Mark retained, missing, or not applicable with current path-and-line evidence, then synthesize the implementation phases.

## Sources Consulted

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:3-13,92-101`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:37-45,71-112,149-159`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/results/2026-10-07-agentic.md:57-95,160-170`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs:8-20,124-159`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs:6-16`
- `.skilled/skills/sk-code/benchmark/README.md:14-26`
- `.skilled/skills/sk-code/hub-router.json:4-18`
- `.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:11-19,53-59`
- `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:29-35,44-61`
- `.skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:65-90`
- `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:62,76`
