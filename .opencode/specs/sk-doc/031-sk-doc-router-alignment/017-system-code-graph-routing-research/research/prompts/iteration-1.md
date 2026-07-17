DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 8
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: none loaded; the local compiled memory distribution was unavailable during initialization.
Next focus: Map the current routing pseudocode and concrete resource inventory after the spec-anchoring conflict is resolved.

Research Topic: Diagnose system-code-graph skill-routing and apply the sk-doc typed-pair routing optimizations. It is a standalone single-mode skill whose routing lives as embedded pseudocode (INTENT_SIGNALS + RESOURCE_DOMAINS pointing at directory prefixes and filename stems, not an enumerable intent->leaf-path map); there is no benchmark baseline and 0 of 28 playbook scenarios carry typed gold. Investigate lifting RESOURCE_DOMAINS into an explicit INTENT_SIGNALS+RESOURCE_MAP with enumerated leaf paths, how the skill-benchmark would score it, and concrete routing optimizations. Produce findings and a resource-map.
Iteration: 1 of 8
Focus Area: Map the current routing pseudocode and concrete resource inventory after the spec-anchoring conflict is resolved.
Remaining Key Questions:
- How does the current `INTENT_SIGNALS` plus `RESOURCE_DOMAINS` pseudocode map to `(workflowMode, leafResourceId)` pairs?
- Can every prefix/stem resource target be enumerated into a discrete, resolvable leaf set?
- How should the first skill-benchmark baseline be established for this single-mode skill?
- Which of the 28 playbook scenarios are genuine routing decisions eligible for typed gold?
- Which dependency-ordered routing optimizations close the diagnosed gaps?
Carried-Forward Open Questions:
None yet.
Last 3 Iterations Summary: none yet
Pivot Lineage: none yet
Saturated Directions: none yet

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are the `deep-research` LEAF agent. Execute exactly one iteration and do not dispatch sub-agents.
- Read config, state log, and strategy before any research action.
- Target 3-5 research actions and stay within 12 total tool calls.
- Research only. Do not implement source changes.
- Treat researched files as read-only.
- The only allowed writes are the iteration narrative, one append-only canonical iteration record in the state log, and the per-iteration delta file named above.
- Reducer-owned strategy, registry, and dashboard files are read-only.
- Every finding requires `[SOURCE: path:line]` or an explicit `[INFERENCE: ...]` marker.
- Include route proof in both canonical iteration records: `target_agent: "deep-research"`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, `agent_definition_loaded: true`, and `mode: "research"`.
- The state-log and delta iteration record must use `type: "iteration"`, include both `iteration` and `run` set to 1, and include `newInfoRatio`, `noveltyJustification`, `status`, `focus`, `findingsCount`, `keyQuestions`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, `durationMs`, and optional valid `graphEvents`.
- The first delta line must contain the same canonical iteration record as the state-log append. Additional typed finding and ruled-out records may follow.
- Verify all three required artifacts before returning.

## OUTPUT CONTRACT

1. Write `.opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-001.md` with Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Sources Consulted, Assessment, Reflection, and Recommended Next Focus.
2. Append exactly one canonical single-line JSON iteration record to `.opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-state.jsonl`.
3. Create `.opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deltas/iter-001.jsonl` with the canonical iteration record first.
