DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 1 Prompt Pack

## State

STATE SUMMARY:
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: packet-level resource-map.md was absent; use direct evidence and predecessor research.
Memory context refresh: unavailable; canonical packet docs and direct files are authoritative.
Next focus: Map the live md-generator pipeline, formatters-v3 section construction, schema/prompt assets, and validator boundaries; identify concrete insertion points and current evidence gaps before examining corpus calibration.

Research Topic: How can the 1,290-style design-token library upgrade design-md-generator through few-shot exemplars, section-schema calibration, token-vocabulary grounding, consistency and quality baselines, validation fixtures, and smart integrations beyond plain retrieval? Build on the predecessor SOL research and name concrete pipeline integration points with rough build costs.

Remaining Key Questions: Q1-Q5 in the strategy file.
Carried-Forward Open Questions: scoring/schema thresholds and retrieval-tool packaging are non-blocking implementation details.
Last 3 Iterations Summary: none.

## State Files

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/iterations/iteration-001.md
- Write per-iteration delta to: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/research/lineages/sol/deltas/iter-001.jsonl

## Constraints

- Execute exactly one LEAF research iteration. Do not dispatch sub-agents or invoke any CLI executor.
- Read config, state, strategy, and registry first.
- Perform 3-5 focused research actions and cite exact file lines.
- Investigated files are read-only.
- The only permitted writes are the iteration narrative, one append-only canonical iteration row in the state log, and the delta file listed above.
- Do not edit config, strategy, registry, dashboard, spec files, predecessor artifacts, or source code.
- Do not implement fixes.
- Include route proof in the canonical iteration row: `mode: research`, `target_agent: deep-research`, `agent_definition_loaded: true`, and `resolved_route: Resolved route: mode=research target_agent=deep-research`.
- Include `iteration`, `run`, `status`, `focus`, `findingsCount`, `newInfoRatio`, `noveltyJustification`, `keyQuestions`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, `durationMs`, and optional graphEvents.
- Write the same canonical iteration record as the first delta row, followed by structured finding/ruled_out rows.
- Narrative sections: Focus, Actions Taken, Findings, Ruled Out, Dead Ends, Edge Cases, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- No user questions. Return only a concise iteration completion report after verifying all three artifacts.
