DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 5
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: focused retrieval found no canonical packet records; use repository evidence.
Next focus: Map the exact current styles-tree topology and all path consumers before proposing names.

Research Topic: Restructure the sk-design styles tree so the 1290 downloaded style data folders are separated from backend code, aligned to system-deep-loop/runtime, with kebab-case, a concrete target layout, migration path, and git-mv plan.
Iteration: 1 of 5
Focus Area: Map the exact current styles-tree topology and all path consumers before proposing names.
Remaining Key Questions:
- What is the exact current ownership and dependency topology across style data, engine, database, harness, manifests, tests, docs, and consumers?
- Which parts of the proven system-deep-loop/runtime architecture transfer directly, and where should styles intentionally differ?
- What target folder layout cleanly separates data, library code, runtime databases, manifests, tests, scripts, and documentation while remaining kebab-case?
- What dependency-ordered migration preserves behavior and avoids a flag day across imports, path constants, fixtures, commands, and docs?
- What exact git mv sequence, verification ladder, rollback boundary, and compatibility policy should implementation use?
Carried-Forward Open Questions: None yet.
Last 3 Iterations Summary: none yet.
Pivot Lineage: none yet.
Saturated Directions: none yet.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/deep-research-config.json
- State Log: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/001-restructure/research/lineages/sol-high-fast/deltas/iter-001.jsonl

## CONSTRAINTS

- You are the `deep-research` LEAF agent for exactly one iteration. Read `.opencode/agents/deep-research.md`, then read config, state, and strategy before research.
- Do not dispatch sub-agents. Target 3-5 research actions and max 12 tool calls.
- Researched files are read-only. Do not implement or rename anything.
- ALLOWED WRITE PATHS are only the iteration narrative, append-only state log, and delta file named above.
- BANNED OPERATIONS: rm, git rm, mv, sed -i, rmdir, destructive shell redirection, git add, git commit, memory save, or any write outside the three allowed paths.
- Treat convergence as telemetry only; `stopPolicy=max-iterations` requires all five iterations.
- Every finding needs `[SOURCE: file:path:line]` or a clearly grounded `[INFERENCE: ...]` marker.

## OUTPUT CONTRACT

Produce exactly three artifacts:

1. The iteration narrative with Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out/Dead Ends, Sources Consulted, Assessment, Reflection, and Next Focus.
2. Append exactly one single-line canonical record to the state log. It must include `type:"iteration"`, `iteration:1`, `run:1`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, `newInfoRatio`, `noveltyJustification`, `status`, `focus`, `findingsCount`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, `durationMs`, optional `graphEvents`, and executor provenance `{kind:"cli-opencode",model:"openai/gpt-5.6-sol-fast",reasoningEffort:null,serviceTier:null}`.
3. Write the same canonical iteration record as the first line of the delta file, followed by structured finding and ruled-out records.

Do not edit strategy, registry, dashboard, config, or research.md. The orchestrating workflow owns those files.
