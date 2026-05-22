# Iteration 001: Surface Inventory And First Shallowness Hypotheses

## Focus

Inventory the current deep-review and deep-research command, skill, agent, prompt-pack, and auto-YAML surfaces. The selected interpretation was structural: identify workflow mechanics that could make deep-review find fewer bugs than a focused deep-research pass aimed specifically at bug discovery.

## Actions Taken

1. Read the deep-review skill, command entrypoint, auto YAML, agent, and prompt pack to inventory setup defaults, scope derivation, iteration focus, convergence, and output contracts.
2. Read the corresponding deep-research skill, command entrypoint, auto YAML, agent, prompt pack, and current research packet state to compare defaults and iteration mechanics.
3. Checked targeted lines for focus selection, budgets, evidence requirements, JSONL schemas, and convergence signals.
4. Verified the requested iteration and delta files did not already exist before writing.

## Findings

1. Deep-review is organized around broad dimensions, while deep-research is organized around question-driven focus. Review initializes a `dimension_queue` as correctness, security, traceability, and maintainability after an inventory pass [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:258]. Research extracts `Next Focus`, remaining key questions, answered counts, and the least-explored unanswered question from strategy state [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:389]. Hypothesis: a bug-focused research iteration can keep asking "where is the bug class?" while review rotates through taxonomy buckets that may encourage coverage statements over adversarial pursuit.

2. Deep-review has fewer default iterations and a looser convergence threshold than deep-research. Review defaults to 7 iterations and `0.10` convergence [SOURCE: .opencode/commands/spec_kit/deep-review.md:105], while research defaults to 10 iterations and `0.05` convergence [SOURCE: .opencode/commands/spec_kit/deep-research.md:96]. Hypothesis: review can run out of budget sooner and treat low-new-finding passes as enough earlier, especially when the first pass is inventory and later passes must cover all dimensions.

3. The review prompt pack front-loads severity, verdict, and schema obligations more than bug-hunting tactics. Its required narrative structure is "Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension" [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:76], and it names quality gates as evidence, scope, and coverage [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:31]. Research's prompt contract is narrower and asks for "Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus" [SOURCE: .opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl:41]. Hypothesis: review spends cognitive budget proving compliance with review ceremony, while research spends more of the same budget answering the focused question.

4. The deep-review agent does require evidence and adversarial checks for high-severity findings, but only after a candidate finding exists. Review action guidance says to perform 3-5 focused actions and review one dimension [SOURCE: .opencode/agents/deep-review.md:153], then P0/P1 findings require counterevidence review and P0 candidates require Hunter/Skeptic/Referee before writing [SOURCE: .opencode/agents/deep-review.md:178]. Hypothesis: the workflow is strong at validating discovered P0/P1 claims, but weaker at forcing candidate generation through producer/consumer tracing, invariant violation search, exploit-path enumeration, or bug-class hypotheses.

5. Deep-research carries explicit mechanics that favor narrow, evidence-producing enumeration. Its agent says ambiguous focus should choose the narrower evidence-backed option [SOURCE: .opencode/agents/deep-research.md:124], and the SWE-1.6 contract requires counted tables with cited `path:line` rows for numeric audits because prose produces partial or fabricated counts [SOURCE: .opencode/agents/deep-research.md:330]. Hypothesis: similar counted-table mandates for review, such as producer/consumer matrices or invariant-check tables, would make deep-review less surface-level.

6. Review convergence is sophisticated, but it measures dimension coverage and finding ratios rather than explicit bug-class saturation. The review stop logic weights dimension coverage at `0.45` and rolling average at `0.30` [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:463]. It also includes evidence, hotspot, claim-adjudication, and fix-replay legal-stop gates [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:477]. Hypothesis: these gates can block premature STOP, but they do not themselves require a matrix of suspected bug classes, changed invariants, producer/consumer flows, or negative tests before a dimension counts as meaningfully searched.

7. The research workflow's current packet already encodes the right research question: whether deep-review requires enough file-line evidence, producer/consumer inventory, and hypothesis rotation [SOURCE: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/deep-research-strategy.md:21]. That suggests the next iterations should stop comparing only high-level workflow shape and inspect reducer/convergence/test surfaces for whether those expectations are actually enforced.

## Questions Answered

- Which first constraints look likely to reduce deep-review bug-finding depth? Dimension rotation, earlier default stopping, ceremony-heavy prompt structure, and validation-after-discovery rather than candidate-generation-before-validation.
- Which deep-research mechanics look transferable? Question-driven focus, narrower evidence-backed choice under ambiguity, counted row/table formats, explicit remaining-question tracking, and stronger focus-exhaustion handling.

## Questions Remaining

- Does the deep-review reducer actually preserve enough detail from iteration artifacts to force deeper follow-up, or does it collapse findings into shallow counts?
- Does graph convergence enforce meaningful file/finding/evidence edges for review, or only broad dimension/file coverage?
- Are there tests proving review iterations emit producer/consumer inventories, invariant hypotheses, or bug-class saturation evidence?
- Which exact prompt-pack changes should be first: bug-class hypotheses, affected-surface matrix, producer/consumer flow table, or mandatory negative-test search?

## Next Focus

Inspect deep-review reducer, state-format, convergence references, and tests for what is actually enforced after an iteration. The next pass should distinguish documented intent from machine-checked guarantees.
