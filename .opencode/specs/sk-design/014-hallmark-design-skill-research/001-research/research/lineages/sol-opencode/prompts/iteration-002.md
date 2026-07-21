DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 2

Read the config, state log, strategy, registry, and iteration 1 first. Execute exactly one `deep-research` LEAF iteration.

## Focus
Perform a gate-by-gate comparison of Hallmark `slop-test.md`, `anti-patterns.md`, `references/verbs/audit.md`, and the six-axis pre-emit critique in Hallmark `SKILL.md` against the actual shipped `sk-design/design-audit` contract, `procedures/ai-slop-check.md`, AI fingerprint registry, anti-pattern score rubric, self-defect card, and manual slop-hardening playbook. Reconcile the 57/58 gate-count discrepancy from iteration 1. Identify specific Hallmark gates or heuristics absent, weaker, redundant, or inappropriate in sk-design. Produce granular candidate rows with Hallmark asset, exact sk-design target path, COPY / ADAPT / LEARN / INSPIRE-NEW / SKIP, concrete change, value, and effort. Distinguish substantial textual copying (MIT notice required) from idea-level adaptation.

## State
- Iteration: 2 of 10
- Stop policy: max-iterations; do not synthesize early.
- Prior result: licensing and inventory complete; MIT notice required for copies or substantial portions.
- Suggested next after this iteration: interface/foundations structural and redesign mapping.

## Allowed Writes
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-opencode/iterations/iteration-002.md`
- Append exactly one canonical iteration record to `.opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-opencode/deep-research-state.jsonl`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-opencode/deltas/iter-002.jsonl`

Do not modify config, strategy, registry, dashboard, research.md, Hallmark, sk-design, or any path outside the lineage. No sub-agents. Perform 3-5 focused actions, max 12 tool calls. Cite every finding with exact file:line sources. Include Ruled Out and Dead Ends.

The canonical state and delta iteration record must include `type:"iteration"`, `iteration:2`, `run:2`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, status, focus, findingsCount, newInfoRatio, noveltyJustification, keyQuestions, answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs, and optional graphEvents. Delta first line must match the state record, then include structured findings and ruled_out rows. Verify all three outputs before returning.

Recovery note for the one permitted re-dispatch: the first attempt failed because an `apply_patch` append hunk could not match the JSONL tail. Do not use a context-dependent patch to append the state record. Use an append-safe operation that preserves every existing byte and adds exactly one single-line JSON record plus a newline; verify the record count afterward. No iteration-002 narrative, delta, or canonical state record exists from the failed attempt.
