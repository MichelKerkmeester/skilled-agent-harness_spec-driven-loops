DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 2 Prompt Pack

## State

STATE SUMMARY:
Segment: 1 | Iteration: 2 of 10
Questions: 1/5 answered | Last focus: live pipeline and schema/validator boundaries
Last 2 ratios: N/A -> 1.00 | Stuck count: 0
Resource map: no packet-level map; use direct corpus and predecessor evidence.
Memory context refresh: unavailable; canonical files are authoritative.
Next focus: Run a deterministic corpus calibration pass for Q2: measure section presence/order, Quick Start field coverage, token-name vocabulary, typography-role vocabulary, and meaningful absence patterns across the 1,290 bundles. Compare distributions with current v3 schema gaps while preserving family-level variance instead of averaging.

Research Topic: Upgrade design-md-generator through corpus-grounded exemplars, calibrated schema/vocabulary, baselines, fixtures, and smart integrations with concrete pipeline points and rough costs.

Remaining Key Questions: Q2-Q5.
Carried-Forward Open Questions: schema thresholds and packaging remain implementation details.
Last 3 Iterations Summary: run 1: live pipeline and schema boundaries (1.00).

## State Files

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-002.md
- Write per-iteration delta to: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deltas/iter-002.jsonl

## Constraints

- Execute exactly one LEAF research iteration; no sub-agents or CLI dispatch.
- Read state first and keep all investigated sources read-only.
- Use 3-5 focused actions. Bounded Bash may compute corpus statistics but must not write outside the two iteration outputs and state append.
- Distinguish schema frequency from quality. Preserve conditional sections and style-family variance; do not recommend corpus-majority homogenization.
- Build on iteration 1's shared-manifest insertion point and predecessor retrieval substrate.
- The only permitted writes are the exact iteration narrative, one state-log append, and the exact delta file.
- Include all canonical route-proof and iteration fields; the first delta row must match the state iteration row.
- Narrative sections: Focus, Actions Taken, Findings, Ruled Out, Dead Ends, Edge Cases, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- Every finding needs exact source or command evidence and any rough build cost that is supportable.
- Return a concise completion report only after verifying all three artifacts.
