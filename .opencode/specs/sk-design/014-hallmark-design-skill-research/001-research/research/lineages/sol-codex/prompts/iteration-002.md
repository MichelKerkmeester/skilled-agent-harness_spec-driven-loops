DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 10
Questions: 1/5 answered | Last focus: license, inventory, and route map
Last 2 ratios: N/A -> 1.0 | Stuck count: 0
Next focus: Gate-by-gate audit and anti-slop coverage diff.

Research Topic: Hallmark reuse and capability analysis for the shipped sk-design hub.
Iteration: 2 of 10
Focus Area: Diff Hallmark's canonical 58-gate slop test, anti-patterns, six-axis pre-emit self-critique, and audit verb packet against sk-design's audit checks and shared polish gate.
Remaining Key Questions: asset mapping; missing audit gates; schema/motion/themes; roadmap/new capabilities.
Last 3 Iterations Summary: run 1 inventory and licensing (1.0).

## STATE FILES

- Config: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-config.json
- State Log: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/iterations/iteration-002.md
- Write per-iteration delta to: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deltas/iter-002.jsonl

## CONSTRAINTS

- Read `.opencode/agents/deep-research.md` and all state first. Leaf-only; no sub-agents.
- Use 3-5 focused actions, at most 12 tool calls. All researched files are read-only.
- Write only the two iteration files and append exactly one canonical iteration record to the state log.
- Produce a coverage table (`covered / weaker / missing / conflict`) and enumerate concrete missing Hallmark gates/heuristics worth adding, with exact sk-design target files and COPY/ADAPT/LEARN/SKIP treatment.
- Distinguish Hallmark's 58 presentation gates from sk-design's broader accessibility, performance, evidence, and severity contracts; do not recommend wholesale replacement.
