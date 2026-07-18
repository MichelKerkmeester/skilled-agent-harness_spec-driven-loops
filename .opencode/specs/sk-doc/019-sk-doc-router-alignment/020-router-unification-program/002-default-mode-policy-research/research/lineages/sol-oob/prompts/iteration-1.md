DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 7
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: unavailable at lineage initialization.
Next focus: Abolish the hub-router layer: test direct Layer-0-to-mode selection against packet modularity, local routing context, and authority boundaries.

Research Topic: Parent-hub routing, out-of-box run 3: radical lateral rethinks over the Out-of-Box Agenda in the packet spec.md.
Iteration: 1 of 7
Focus Area: Abolish the hub-router layer: test direct Layer-0-to-mode selection against packet modularity, local routing context, and authority boundaries.
Remaining Key Questions: all five questions in the strategy.
Carried-Forward Open Questions: none yet.
Last 3 Iterations Summary: none yet.
Pivot Lineage: none.
Saturated Directions: practical keep-versus-null tuning from runs 1-2.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deep-research-config.json
- State Log: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deltas/iter-001.jsonl

## CONSTRAINTS

- Load `.opencode/agents/deep-research.md` and execute exactly one LEAF iteration. Do not dispatch sub-agents.
- Read config, state log, strategy, and registry before research. Treat reducer-owned files as read-only.
- Target 3-5 bounded research actions; maximum 12 tool calls total.
- Read any repository source needed, but write only the iteration narrative, append-only state log, delta file, and packet-local `research.md` because progressive synthesis is enabled.
- Every finding needs `[SOURCE: path:line]` or an explicit `[INFERENCE: ...]` marker.
- Include both `iteration:1` and `run:1` in the canonical JSONL record, plus route proof, executor provenance `{\"kind\":\"cli-codex\",\"model\":\"gpt-5.6-sol\"}`, novelty justification, findings count, key/answered questions, ruled-out directions, sources, duration, and optional graph events.
- Recommend this next focus: a deterministic/adaptive hybrid that learns from corrections without making offline replay irreproducible.
- Do not implement or patch any router. Do not stop for convergence; this forced-depth lineage runs seven iterations.
