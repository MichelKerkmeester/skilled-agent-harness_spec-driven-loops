DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 10
Questions: 2/5 answered | Last focus: audit/slop coverage
Last 2 ratios: 1.0 -> 0.88 | Stuck count: 0
Next focus: Hallmark study/design.md/export schema against sk-design MD-generator and styles extraction.

Research Topic: Hallmark reuse and capability analysis for the shipped sk-design hub.
Iteration: 3 of 10
Focus Area: Compare Hallmark `study`, `design-md.md`, and `export-formats.md` with `/interface:design-reference`, the MD-generator v3 DESIGN.md contract, extraction workflow/backend, source attestation, and styles database schema.
Remaining Key Questions: complete asset mapping; extraction/motion/theme improvements; roadmap/new capabilities.
Last 3 Iterations Summary: run 1 inventory/licensing (1.0); run 2 audit gap diff (0.88).

## STATE FILES

- Config: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-config.json
- State Log: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/iterations/iteration-003.md
- Write per-iteration delta to: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deltas/iter-003.jsonl

## CONSTRAINTS

- Read `.opencode/agents/deep-research.md` and all state first. Leaf-only; no sub-agents.
- Use 3-5 focused actions, at most 12 tool calls. All researched files are read-only.
- Write only the two iteration files and append one canonical iteration record.
- Produce a field-by-field schema comparison: Hallmark portable `design.md` fields versus sk-design `DESIGN.md`/canonical JSON/style-bundle fields. Mark exact additions, overlaps, conflicts, and deliberate omissions.
- Name concrete changes to `design-md-generator` references/procedures/backend, `/interface:design-reference`, source-attestation, and styles retrieval. Separate measured extraction from invented/brand-first authoring.
