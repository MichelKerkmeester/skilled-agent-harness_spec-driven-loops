DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 1 of 20

## State

Research topic: Extract GraphARC governance patterns, grounded in all 12 graph-engineering blog posts, to extend repo studies 1 and 2 and map decisions to system-deep-loop plus the 036 authority plane.

Focus area: Establish the prior-decision ledger from the orientation seed and the canonical research outputs for studies 1 (agent-swarms) and 2 (graphene-main). Normalize the decisions that later GraphARC evidence must confirm, refine, extend, or contradict. Do not repeat prior findings; identify the exact decision anchors, assumptions, and unresolved governance gaps.

Mandatory sources: the orientation seed at `specs/system-deep-loop/037-graph-engineering/003-graph-arch/orientation.md`, `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`, and `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md`.

## State files

- Config: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/deep-research-config.json`
- State log: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/deep-research-state.jsonl`
- Strategy: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/deep-research-strategy.md`
- Registry: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/findings-registry.json`
- Write narrative: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-001.md`
- Append state: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/deep-research-state.jsonl`
- Write delta: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/deltas/iter-001.jsonl`

## Constraints

- Read `.opencode/agents/deep-research.md` completely first and execute exactly one LEAF iteration.
- Write only the three iteration outputs named above. Treat reducer-owned files and `research.md` as read-only.
- Use 3–5 focused research actions and no subagents.
- Every finding must carry `[SOURCE: file:line]` or `[INFERENCE: ...]`.
- Every finding must name the specific prior decision and classify the GraphARC-oriented delta as confirm, refine, extend, or contradict.
- Include explicit when-not-to-use boundaries where this orientation pass exposes them.
- The canonical state and delta iteration records must include: `type:"iteration"`, `iteration:1`, `run:1`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, `status`, `focus`, `findingsCount`, `newInfoRatio`, `noveltyJustification`, `keyQuestions`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, `durationMs`, and optional valid graph events.
- Add executor provenance to the canonical record: `{"kind":"cli-codex","model":"gpt-5.6-sol","reasoningEffort":"high","serviceTier":"fast"}`.
- Do not stop for convergence; stop policy is max-iterations and this is iteration 1.
