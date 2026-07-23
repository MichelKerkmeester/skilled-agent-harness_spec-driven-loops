DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 7
Questions: 4/5 answered | Last focus: acknowledged no-wrong-door handoff
Last 2 ratios: 1.00 -> 1.00 | Stuck count: 0
Convergence telemetry: rolling average CONTINUE, MAD CONTINUE, question coverage 0.80 CONTINUE.
Next focus override: one-turn typed negotiation and calibrated confidence.

Research Topic: Parent-hub routing, out-of-box run 3: radical lateral rethinks over the Out-of-Box Agenda in the packet spec.md.
Iteration: 5 of 7
Focus Area: Formalize the zero-signal branch as a one-turn negotiation: calibrated confidence, compressed options, typed clarification, and a measurable friction budget. Test whether confidence-first routing subsumes default/defer/detection archetypes.
Remaining Key Question: the deeper architecture-smell/minimal-model question; this iteration may inform it but should not claim it answered unless the evidence truly resolves it.
Last 3 Iterations Summary:
- run 2: immutable correction overlays preserve deterministic adaptation (1.00)
- run 3: typed negative outcomes and policy-bounded defaults replace unlabelled null (1.00)
- run 4: acknowledged handoff with one clarification, compact envelope, finite hops, and destination authority (1.00)
Saturated Directions: silent defaulting, unconstrained “modes talk until they agree,” full-transcript handoff, and fake empirical confidence without a corpus.

## STATE FILES

- Config: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deep-research-config.json
- State Log: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob/deltas/iter-005.jsonl

## CONSTRAINTS

- Load `.opencode/agents/deep-research.md`; run exactly one LEAF iteration with no sub-agents.
- Read state first; reducer outputs are read-only. Maximum 12 tool calls.
- Ground confidence semantics in current advisor/router code and authoritative calibration or interaction sources. A score margin is not automatically a probability.
- Write only `iteration-005.md`, one canonical state append, `iter-005.jsonl`, and packet-local `research.md`.
- Every finding needs citations or grounded inference. Produce a concrete decision/interaction schema and measurable budget, not generic UX advice.
- Include `iteration:5`, `run:5`, route proof, executor `{\"kind\":\"cli-codex\",\"model\":\"gpt-5.6-sol\"}`, and canonical fields.
- Do not repeat already-resolved exact question strings in `answeredQuestions` unless this iteration contributes a materially different evidence-backed answer. It is valid to answer none.
- Recommend this next focus: radical simplification of `INTENT_SIGNALS + RESOURCE_MAP`, testing a capability/type-directed minimal replacement and what information cannot be removed.
- Convergence is telemetry only before iteration 7.
