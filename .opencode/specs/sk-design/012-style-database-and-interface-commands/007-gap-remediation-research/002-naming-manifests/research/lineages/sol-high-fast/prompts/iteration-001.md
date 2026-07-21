DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

Read `.opencode/agents/deep-research.md` first and follow it as the authoritative LEAF contract. Execute exactly ONE iteration. The spec folder is pre-approved; do not ask Gate 3 questions. This is a detached fan-out lineage, so all writes are restricted to the three listed lineage artifacts.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 5
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: active packet spec confirms the research scope; no additional canonical decision was found.
Next focus: Establish the naming authority and exact rename map, then inventory direct references to every legacy path.

Research Topic: Bring the styles backend into kebab-case conformance per filesystem-naming-convention.md by renaming _db, _engine, _harness, _manifest.json, _retrieval-manifest.json, and reconcile the two overlapping manifests (crawl _manifest.json plus DB _retrieval-manifest.json, both listing 1290 styles) into a single source of truth. Deliver the exact rename map, the import and reference update plan so nothing breaks, and the manifest consolidation design. Ground in the naming canon and the two manifest schemas; see gap-analysis.md in the parent 007 folder.
Iteration: 1 of 5
Focus Area: Naming authority, exact rename map, and exhaustive direct-reference inventory.
Remaining Key Questions:
- What exact directory and file rename map follows the naming canon, including every path named by the brief?
- Which imports, path literals, scripts, tests, documentation, configuration, and generated references must change, and in what safe sequence?
- What fields, invariants, and lifecycle roles differ between the crawl manifest and retrieval manifest schemas?
- Which manifest should be canonical, which data should be derived, and how should hashes, provenance, and deterministic regeneration work?
- What validation, rollback, and cutover plan proves the rename and consolidation do not break existing retrieval or generation paths?
Carried-Forward Open Questions: none yet.
Last 3 Iterations Summary: none yet.
Pivot Lineage: none yet.
Saturated Directions: none yet.

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/findings-registry.json
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-001.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do not dispatch sub-agents and do not run another deep loop.
- Perform 3-5 focused research actions, max 12 tool calls total.
- Read state first. Treat researched files as read-only.
- Do not implement any rename or manifest change.
- The only allowed writes are the iteration narrative, one append-only canonical iteration record in the state log, and the delta file listed above.
- Do not modify config, strategy, registry, dashboard, research.md, target source files, spec files, or any path outside the detached lineage.
- Every finding needs `[SOURCE: file:line]` or `[INFERENCE: ...]` evidence.
- `stopPolicy=max-iterations`: do not synthesize or stop the lineage; recommend a materially broader next angle.

## OUTPUT CONTRACT

Produce all three artifacts:

1. Narrative with headings `Focus`, `Actions Taken`, `Findings`, `Questions Answered`, `Questions Remaining`, `Ruled Out`, `Dead Ends`, `Sources Consulted`, `Assessment`, `Reflection`, and `Recommended Next Focus`.
2. Append exactly one single-line JSON record to the state log using canonical fields including `{"type":"iteration","iteration":1,"run":1,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research",...}`. Include `status`, `focus`, `findingsCount`, `newInfoRatio`, `noveltyJustification`, `keyQuestions`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, `durationMs`, and optional valid `graphEvents`.
3. Create the delta JSONL whose first line is the same canonical iteration record, followed by structured finding/source/ruled-out rows as useful.

Verify all three artifacts, citations, exactly one iteration append, route proof, and lineage-only write scope before returning.
