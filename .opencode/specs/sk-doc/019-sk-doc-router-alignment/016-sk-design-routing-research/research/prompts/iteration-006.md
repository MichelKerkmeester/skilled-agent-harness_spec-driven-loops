DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE
STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 6 of 8
Questions: 4/5 evidenced; one exact-text registry question remains open | Last focus: optimization dependency order
Last 3 ratios: 1.00 -> 0.90 -> 0.70 | Stuck count: 0
Next focus: Re-verify iteration 1's six-mode typed-pair evidence and answer the canonical registry question using its exact text.

Research Topic: sk-design typed-pair routing evidence reconciliation.
Iteration: 6 of 8
Focus Area: Canonical question closure and contradiction audit for the six-mode `(workflowMode, leafResourceId)` mapping.
Remaining Key Question EXACT TEXT: How do the six sk-design modes map to independent `(workflowMode, leafResourceId)` gold pairs?
Last 3 Iterations Summary: scenario eligibility; score attribution; optimization plan.
Saturated Directions: no seventh hub mode, no transport flattening, no packet-qualified leaf IDs.

## STATE FILES
- Config: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/findings-registry.json
- Iteration narrative: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-006.md
- Delta: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deltas/iter-006.jsonl

## CONSTRAINTS
- One analytical `deep-research` LEAF iteration; load agent definition and state; no sub-agents.
- Re-read the narrowest authoritative sources needed to verify the mapping and check for contradictions with iterations 1-5.
- In `answeredQuestions`, use the exact canonical text above, including backticks and punctuation, so the reducer can reconcile it.
- Do not edit strategy or registry directly and do not modify any researched source.
- Write only narrative, exactly one canonical state append, and delta listed above.
- Status may be `insight` if this is primarily evidence reconciliation. Report novelty honestly.
- Include exact route proof, citations, contradiction outcome, novelty justification, and ruled-out directions.

## OUTPUT CONTRACT
Produce and verify all three iteration-006 artifacts. Return only the standard iteration completion report.
