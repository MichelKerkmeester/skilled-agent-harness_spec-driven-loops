DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 5

## STATE
Segment: 1 | Iteration: 5 of 10
Questions: 3/5 reducer-resolved; the exceptional-case question is substantively answered but needs its exact canonical text in `answeredQuestions`
Last 2 ratios: 1.00 -> 0.80 | Stuck count: 0
Next focus: Canonical documentation, safe generation/backfill ownership, and a fleet presence-plus-freshness gate.

## STATE FILES
- Config: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deep-research-config.json`
- State Log: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/findings-registry.json`
- Prior evidence: packet iterations 1-4
- Write narrative: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/iterations/iteration-005.md`
- Write delta: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deltas/iter-005.jsonl`

## FOCUS
Specify the canonical contract location inside `sk-doc/create-skill` with exact existing file/section anchors and any new artifact role required. For each of the eight file types state whether it is authored, scaffolded, deterministically generated, or safely backfillable and by which existing/new automation. Design a fleet-wide gate that first discovers/classifies every skill root, then enforces per-class presence, validates schemas, regenerates derived files, byte-checks freshness, detects forbidden extras/nested identity, and fails on unclassified roots or stale output. Name integration points in doctor, CI, benchmark, and tests. Verify the final recommendation against current script limitations, especially missing-manifest discovery. Preserve the exact exceptional-case key question in `answeredQuestions` along with the exact canonical automation question so reducer state closes both.

## CONSTRAINTS
- Read state/registry and iterations 1-4 first.
- Exactly one LEAF iteration; no subagents.
- 3-5 focused actions, max 12 tool calls.
- Findings/recommendations only; do not implement or write outside this packet.
- Cite every location, script capability, and gate limitation with file:line evidence.
- Do not invent an existing generator when only a proposed extension is justified.
- The gate must keep skill-root schemas separate from `.opencode/specs/` continuity metadata.
- Write only narrative, state append, and delta.

## OUTPUT CONTRACT
Create narrative, append one canonical iteration record, and create delta. Both require iteration/run 5, mode research, route proof, novelty/source fields, and cli-opencode provenance.
Set `answeredQuestions` to these exact two strings if evidence supports closure:
1. `How should the five graph-only skills, \`leaf-aliases.json\`, \`command-metadata.json\`, and sparse \`sk-git\` be classified after behavior-impact checks?`
2. `Where should the canonical contract live in \`sk-doc/create-skill\`, what can be generated/backfilled, and what fleet-wide presence-plus-freshness gate should enforce it?`
The narrative must include canonical documentation placement, automation matrix, gate algorithm, integration/test plan, Findings, Ruled Out, Dead Ends, Sources, Assessment, Reflection, Questions Answered/Remaining, and Recommended Next Focus.
