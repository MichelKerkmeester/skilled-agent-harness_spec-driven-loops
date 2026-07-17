DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE
STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 8
Questions: 1/5 answered | Last focus: Benchmark pipeline composition across router replay, D1-D5, typed-pair recall, and fitted/holdout scoring
Last 2 ratios: 0.80 -> 0.90 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: unavailable; use packet continuity and direct source evidence.
Next focus: How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` influence recall outside the already-confirmed deterministic assembly path?

Research Topic: Diagnose and optimize sk-code skill routing under the sk-doc typed-pair standard, preserving 18/18 surface routing while lifting leaf-file recall and resolving the universal-preamble contract question.
Iteration: 3 of 8
Focus Area: How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` influence recall outside the already-confirmed deterministic assembly path?
Remaining Key Questions: Read the current reducer-owned strategy and registry; investigate the stated Next Focus without retrying blocked prefix-only or contract-error-as-recall-cause directions.
Last 3 Iterations Summary: run 1 router/manifest contract (0.80); run 2 benchmark pipeline (0.90)
Pivot Lineage: none yet
Saturated Directions: none yet

## STATE FILES
- Config: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deltas/iter-003.jsonl

## CONSTRAINTS
- Execute exactly one LEAF iteration; no sub-agents and no implementation.
- Read state first. Target 3-5 focused research actions, maximum 12 tool calls.
- Researched files and reducer-owned files are read-only.
- The only allowed writes are the iteration narrative, append-only state log, and this iteration's delta file.
- Preserve all ruled-out and exhausted directions as hard negative context.
- Every finding requires a source or explicit inference marker.

## OUTPUT CONTRACT
1. Create `iteration-003.md` with the full deep-research narrative sections and cited findings.
2. Append exactly one canonical `type:"iteration"` record for iteration/run 3 with `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, and `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, plus all required novelty, question, source, status, and timing fields.
3. Create `iter-003.jsonl` beginning with the same canonical iteration record and followed by structured findings and ruled-out records.
Verify all three artifacts, exact append count, route proof, citations, packet scope, and untouched reducer-owned files before returning.
