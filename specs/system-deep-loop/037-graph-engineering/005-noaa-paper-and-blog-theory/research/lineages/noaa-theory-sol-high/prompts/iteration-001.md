DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 1 of 20

STATE SUMMARY: Segment 1. No prior iterations. Convergence is telemetry only; the max-iterations policy requires all 20 passes.

Research Topic: Extract loop/harness design decisions for system-deep-loop from the NVIDIA Object-Oriented Agents paper as the primary external idea source, plus all twelve graph-engineering blog posts. Build on studies 1–4, compare against the live runtime, and keep every proposal subordinate to 036.

Focus Area: Establish the primary-source baseline. Verify the orientation against the NOOA paper, studies 1–4, and the live runtime. Separate OBSERVED-IN-PAPER/TEXT-CLAIMED statements, author-reported results, and inference; identify the exact loop/harness delta left after the graph studies.

Read these state files first:
- Config: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-config.json
- State log: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl
- Strategy: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-strategy.md
- Registry: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/findings-registry.json

Mandatory orientation seed:
- specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md

Primary and comparison sources:
- specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md
- specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md
- specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md
- specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md
- specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md
- .opencode/skills/system-deep-loop/deep-research/SKILL.md and live runtime references named by the orientation

Required outputs:
- Narrative: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-001.md
- Append exactly one canonical iteration record to: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl
- Delta: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deltas/iter-001.jsonl

Constraints:
- You are the deep-research LEAF agent for exactly one iteration. Do not dispatch sub-agents or run nested loops.
- Perform 3–5 focused research actions, maximum 12 tool calls.
- Read-only research surface. Write only the three required output paths above.
- Every finding carries `[SOURCE: file:line]` or `[INFERENCE: ...]`.
- Every finding explicitly uses CONFIRM, REFINE, EXTEND, or CONTRADICT against both (a) studies 1–4 and (b) the live runtime. If one side is unaffected, say ORTHOGONAL.
- Keep NOOA external and subordinate every implication to 036. Do not adopt it wholesale.
- Include headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out, Edge Cases, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- JSONL record requires `type:"iteration"`, `iteration:1`, `run:1`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, `newInfoRatio`, `noveltyJustification`, `status`, `focus`, `findingsCount`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, `durationMs`, and executor provenance for cli-codex gpt-5.6-sol high.
- Write the same canonical iteration record as the first line of the delta file, followed by structured finding, invariant, and ruled_out records.
- Do not modify strategy, registry, dashboard, research.md, source documents, runtime, or any path outside the bound lineage directory.
