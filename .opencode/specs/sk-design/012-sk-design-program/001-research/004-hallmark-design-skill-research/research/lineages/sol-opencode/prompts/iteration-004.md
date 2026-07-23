DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 4

Read lineage config/state/strategy/registry and prior iterations first. Execute one LEAF iteration only.

## Focus
Compare Hallmark `color.md`, `typography.md`, `copy.md`, `imagery-kit.md`, `custom-theme.md`, `custom-craft.md`, `hero-enrichment.md`, `floating-nav.md`, and `responsive.md` against the closest actual sk-design INTERFACE and FOUNDATIONS references/procedures/assets. For every Hallmark asset, identify exact sk-design target file(s), verdict (COPY / ADAPT / LEARN / INSPIRE-NEW / SKIP), a surgical concrete change, value, effort, and licensing treatment. Hunt for specific gaps such as semantic palette rules, pairings, copy constraints, image sourcing/composition, custom-craft requirements, hero enrichment, floating-nav rules, and responsive quality floors; do not duplicate capabilities already present. Prefer improvements to existing mode references/procedures over new commands.

## State
- Iteration 4 of 10; stopPolicy=max-iterations.
- Completed: license/inventory, audit/slop gate comparison, build/redesign structural mapping.
- Negative knowledge: no standalone redesign/variant command; fixed Hallmark catalogs are inspiration rather than presets.

## Writes
Only create `iterations/iteration-004.md`, append one iteration-4 canonical record to `deep-research-state.jsonl`, and create `deltas/iter-004.jsonl`, all under `.opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-opencode/`. Use append-safe JSONL; no context patch. No other writes, no sub-agents, 3-5 focused actions, max 12 calls.

Cite exact file:line evidence. Include Candidate Matrix, Ruled Out, and Dead Ends. Canonical state/delta record: `type:"iteration"`, `iteration:4`, `run:4`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, plus status, focus, findingsCount, newInfoRatio, noveltyJustification, keyQuestions, answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs. Delta first line matches state and adds structured findings/ruled_out rows. Verify outputs and boundary.

Recovery note for the sole re-dispatch: the first attempt assembled a valid evidence report but a combined `apply_patch` failed because it anchored on the full prior JSONL line. Do NOT use `apply_patch` for any of the three outputs. Create the two new write-once files with a direct write operation, then append the single state record with a byte-preserving append operation. Never anchor an append on prior state text. Verify exactly one iteration-4 state record afterward. No iteration-004 narrative, delta, or state record exists from the failed attempt.
