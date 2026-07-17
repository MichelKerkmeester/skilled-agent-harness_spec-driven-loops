# Iteration 3: Scenario Classification and Independent Typed-Gold Eligibility

## Focus
Partition the current 37-scenario sk-design manual playbook, and the 21-scenario frozen benchmark subset, by whether each scenario states an independently decidable routing oracle. The selected interpretation treats typed gold as a narrow `(workflowMode, leafResourceId)` routing assertion, not as a substitute for advisor, execution, safety, provenance, or user-outcome grading.

## Findings
1. Independent typed gold must be authored from the scenario prompt plus normative mode/resource contracts before observing a router prediction. The topology gate can prove schema validity, manifest membership, and selected-mode joins, but it cannot prove oracle independence; copying the current router's output into expected fields would therefore create gold-equals-prediction circularity even if the fixture passes all three structural checks. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:8-28] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:165-221] [INFERENCE: structural validation cannot establish that expected values were independently derived]
2. Twenty-six current scenarios are independently typable as written because their prompts and stated expected signals select a bounded sk-design route: `MR-001..MR-007`, `TV-001..TV-005`, `MG-001..MG-004`, `SR-001`, `SR-004`, `PB-001..PB-005`, `PB-007`, and `FR-001..FR-002`. For MG and PB scenarios, only the routing/resource slice is typed; pipeline success, preservation, proof quality, tool use, and user-visible behavior remain separately graded. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:178-256] [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:279-317] [INFERENCE: each listed scenario names one route and concrete packet/procedure resources independently of observed output]
3. Four scenarios represent genuine routing questions but are not safe typed fixtures without decomposition or an explicit alias/bundle decision: `AI-001` is a six-prompt battery, `SR-002` is a three-mode prompt set, `PB-006` targets a hub-level shared polish procedure that is not automatically a packet-local leaf, and `HM-004` is an ordered `interface + design-mcp-open-design` bundle. Split the batteries into one fixture per prompt; type PB-006 only after an authored shared alias and route declaration; type HM-004 as a two-mode bundle only after its judgment-mode oracle is fixed rather than inferred from a prediction. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:192-199] [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:226-247] [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:260-267] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:43-51] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:203-219]
4. Seven scenarios should remain untyped on the sk-design leaf-routing axis: `AI-002..AI-004` test advisor deferral to other skills, `SR-003` intentionally has no unique real-mode oracle, and `HM-001..HM-003` test intake, planning, and readiness-pause behavior before or beyond route resolution. Their deterministic expectations belong in advisor/behavior assertions, not fabricated positive sk-design leaf pairs; an empty-gold/UNKNOWN fixture is structurally supported when no positive resource oracle exists. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:192-199] [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:226-233] [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:260-267] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:48-51]
5. Applied to the frozen 21-scenario benchmark corpus, 16 are typable as-is (`MR-001..MR-006`, `TV-001..TV-005`, `MG-001..MG-003`, `SR-001`, `SR-004`), two require splitting (`AI-001`, `SR-002`), and three remain untyped (`AI-002`, `AI-003`, `SR-003`). This preserves the benchmark's router/live distinction: typed pairs can improve routing/resource attribution, but cannot turn browser, advisor, or behavior gaps into measured routing faults. [SOURCE: .opencode/skills/sk-design/benchmark/README.md:20-43] [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:168-263] [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:357-1646] [INFERENCE: intersecting the frozen corpus IDs with the independently derived 37-scenario partition]

## Ruled Out
- Gold-equals-prediction: deriving expected pairs from current router output was rejected because it makes the measured system its own oracle. [INFERENCE: based on Finding 1]
- Typing advisor-negative scenarios as positive sk-design leaf routes was rejected because their expected outcome is another skill winning. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:197-199]
- Assigning one aggregate pair set to multi-prompt batteries was rejected because it obscures which prompt selected which mode and can exceed the selected-map union semantics. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:70-80] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:203-219]
- Treating a correct typed pair as proof of pipeline, safety, or response quality was rejected; the playbook's acceptance contract grades those independently. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:110-127]

## Dead Ends
- Automatic backfilling of typed gold from benchmark traces or router predictions is invalid oracle construction and should not be promoted as an implementation path.
- Shared hub resources cannot be made packet-local typed leaves by generic path inference; PB-006 needs an explicit contract decision rather than a guessed pair.

## Edge Cases
- Ambiguous input: Four scenarios combine batteries, shared hub behavior, or bundles; they were classified as conditional rather than assigned guessed pairs.
- Contradictory evidence: The benchmark README describes a frozen 21-scenario corpus while the current playbook contains 37 scenarios. This is versioned corpus growth, not a factual conflict; both sets are reported separately. [SOURCE: .opencode/skills/sk-design/benchmark/README.md:25-34] [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:30-43]
- Missing dependencies: The initially probed `behavior_benchmark/` path does not exist; the packet uses `benchmark/`, whose README and frozen report supplied the benchmark evidence.
- Partial success: none; the partition answers the in-scope question without authoring gold or fixtures.

## Sources Consulted
- `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:30-43,110-147,178-322`
- `.opencode/skills/sk-design/manual_testing_playbook/mode_routing/interface_mode.md:9-67`
- `.opencode/skills/sk-design/benchmark/README.md:18-43`
- `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:168-1646`
- `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:8-28,43-51,70-100,165-221`

## Assessment
- New information ratio: 1.00
- Novelty justification: All five findings are new to the packet and provide the first scenario-level eligibility partition for both current and frozen corpora.
- Questions addressed: Which benchmark scenarios are genuine routing decisions eligible for independently authored typed gold?
- Questions answered: Which benchmark scenarios are genuine routing decisions eligible for independently authored typed gold?

## Reflection
- What worked and why: Reading the current playbook index alongside the frozen benchmark inventory and the topology validator separated scenario intent, corpus membership, and structural fixture validity.
- What did not work and why: The first discovery probe targeted a nonexistent `behavior_benchmark/` directory; the checked-in artifact is named `benchmark/`, and direct directory inspection recovered the source without broad rereading.
- What I would do differently: Start from the benchmark README's declared corpus path, then intersect its scenario IDs with the current playbook index before opening individual scenario files.

## Recommended Next Focus
Attribute the approximately 69 CONDITIONAL baseline to D1-D5 scoring dimensions using the frozen report, separating measurement gaps (especially router-mode D3 and unscored D1-inter/D4) from actual routing or resource-discovery faults.
