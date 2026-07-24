# Iteration 7: Smallest mode-complete authored typed-gold slice

## Focus

Inspect only loader-eligible routing candidates and their authored intent to name the smallest first typed-gold slice that covers all seven registered workflow modes. The narrow interpretation is scenario-row coverage: a mode is covered only when an eligible authored scenario explicitly names that route. Loader-ineligible files were inspected only to verify the coverage gap; no typed gold or promotion was inferred for them.

## Actions Taken

1. Reused the iteration-4 loader-semantic census and iteration-6 first-slice boundary instead of repeating the exhausted repository-wide artifact census.
2. Read the hub playbook index and the six direct critical-path route scenarios (`MR-001..003`, `IL-001..003`) to verify authored mode intent.
3. Read the typed-gold loader rules to test whether a multi-probe scenario could reduce the row count.
4. Compared the seven-mode registry to the hub playbook's declared coverage and the loader-ineligible deep-alignment packet.

## Findings

1. **The smallest evidence-backed seed over the six modes represented by eligible direct-route scenarios is exactly six rows:** `MR-001 → research`, `MR-002 → review`, `MR-003 → ai-council`, `IL-001 → agent-improvement`, `IL-002 → model-benchmark`, and `IL-003 → skill-benchmark`. The root index names each objective and marks all six critical-path; each feature file independently names one expected `Mode` and its command/packet route. [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:144-159] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/research_routing.md:9-36] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/review_routing.md:9-36] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/ai_council_routing.md:9-36] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/agent_improvement.md:9-38] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/model_benchmark.md:9-37] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/skill_benchmark.md:9-37]
2. **No seven-mode-complete authored slice exists in the eligible corpus.** The registry's seventh active mode is `alignment`, but the hub playbook's own coverage note enumerates only the three lexical modes and three improvement modes, and its routing index contains no alignment row. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:174-197] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:27-37] [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:142-159]
3. **The alignment packet cannot be silently used to close that gap.** The established loader census recognizes rows only from deep-improvement, deep-research, and deep-review, while unsupported files stay outside typed-gold scoring; the deep-alignment root describes 31 scenarios but uses the same narrative feature-file form without loader-recognized scenario frontmatter. Promoting one is a separate authored corpus-governance action. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-004.md:16-24] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:343-417] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/manual_testing_playbook.md:28-41]
4. **`AI-002` is not a smaller three-mode typed-gold substitute.** Its authored contract contains three lexical probes, but index-table typed-gold derivation deliberately chooses one dominant mode and filters the pair set to that mode. Therefore a single normalized row cannot provide independently scored coverage for research, review, and ai-council under the current loader contract. [SOURCE: .opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/lexical_mode_scoring.md:9-38] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475]
5. **The implementable first step is a six-row maximal slice, not a falsely labeled mode-complete slice, and it remains gated by hub index repair.** `MR-001..003` plus `IL-001..003` become deterministic typed-gold candidates after the hyphen/underscore index paths are repaired; true seven-mode completion requires one new, explicitly authored loader-eligible alignment routing scenario. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-004.md:17-20] [INFERENCE: based on findings 1-4 and the seven-mode registry at .opencode/skills/system-deep-loop/mode-registry.json:174-197]

## Ruled Out

- `AI-002` as one row covering three independently scored modes: the index-table derivation retains one dominant mode.
- Treating any `DAL-*` feature filename or narrative as alignment typed gold: those files are loader-ineligible under the current corpus contract.
- Calling the six-row seed “mode-complete”: it omits the registered alignment mode.

## Dead Ends

- No existing loader-eligible scenario supplies authored alignment-route intent. This is a corpus gap, not a search gap; further filename inspection cannot close it.

## Edge Cases

- Ambiguous input: “mode-complete” was interpreted against all seven registry modes, not merely the six modes currently represented by direct hub routing rows.
- Contradictory evidence: none; the seven-mode registry and six-mode playbook coverage reveal an incomplete corpus rather than incompatible facts.
- Missing dependencies: one loader-eligible, explicitly authored alignment routing scenario is absent.
- Partial success: none for the research question; the negative result and maximal six-row seed are evidence-backed.

## SCOPE VIOLATIONS

None. No source, config, strategy, registry, dashboard, synthesis, or loader-ineligible file was modified.

## Sources Consulted

- `.opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md:27-37,142-159`
- `.opencode/skills/system-deep-loop/manual_testing_playbook/mode_routing/{research_routing,review_routing,ai_council_routing}.md`
- `.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/{agent_improvement,model_benchmark,skill_benchmark}.md`
- `.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/lexical_mode_scoring.md:9-38`
- `.opencode/skills/system-deep-loop/mode-registry.json:174-197`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-165,343-417,427-524`
- `.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/manual_testing_playbook.md:28-41`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-004.md:16-24`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-006.md:28-32,45-52,68-79`

## Assessment

- New information ratio: 1.00
- Novelty calculation: 4 of 5 findings were fully new and 1 partially new (`(4 + 0.5×1) / 5 = 0.90`), plus a 0.10 simplicity bonus for resolving the open first-slice question into an exact six-row seed and one explicit corpus gap.
- Questions addressed: Which exact scenario IDs form the smallest mode-complete first typed-gold slice among eligible routing candidates?
- Questions answered: No seven-mode-complete slice exists; the smallest maximal authored slice is `MR-001`, `MR-002`, `MR-003`, `IL-001`, `IL-002`, and `IL-003`, covering six modes, with alignment missing.

## Reflection

- What worked and why: reading direct scenario contracts established authored intent without relying on filenames, while the loader's dominant-mode rule prevented an invalid multi-mode compression.
- What did not work and why: searching the existing eligible corpus cannot produce alignment coverage because no eligible alignment routing row exists.
- What I would do differently: after an operator-authored alignment scenario exists, validate its explicit mode and leaf pairs against the generated manifest before adding it as the seventh row.

## Questions Answered

- Which exact scenario IDs form the smallest mode-complete first typed-gold slice? **Answered negatively and bounded:** there is no seven-mode-complete eligible slice; the exact six-mode maximal seed is `MR-001..003` plus `IL-001..003`.

## Questions Remaining

- Should a new alignment routing scenario be authored into the loader-eligible corpus, and which explicit child-local leaf pairs should its author declare?
- Should any existing loader-ineligible file be deliberately promoted through corpus governance? No promotion is inferred here.

## Next Focus

Define the minimal authored contract for a new loader-eligible alignment routing scenario—ID, exact prompt, expected `workflowMode: alignment`, and manifest-valid child-local leaf pairs—without treating any existing `DAL-*` file as pre-approved typed gold.

## Recommended Next Focus

Resolve the alignment corpus gap through explicit authoring criteria, then re-evaluate the seven-row mode-complete slice against the generated manifest and oracle gate.
