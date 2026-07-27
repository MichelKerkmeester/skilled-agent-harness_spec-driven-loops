DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

Segment: 1 | Iteration: 4 of 5
Evidence-complete focuses: Q1 ownership, Q2 current resolver mechanism, Q3 guard placement.
Last 3 ratios: 1.00 -> 1.00 -> 1.00 | Stuck count: 0
Resource map: not present; coverage gate skipped.
Next focus: Q4 — staging and rollback retention.

Research Topic: Decide the best next move for the compiled-routing subsystem.
Iteration: 4 of 5
Focus Area: Argue both sides of retaining staging and rollback in a single-operator git-backed build tool, explicitly considering the former live-runtime `rmSync` hazard and current atomic-swap/receipt behavior.
Remaining Key Questions: Q4 and Q5.
Carried-Forward Open Questions: separate staging's live-root safety value from rollback's operational recovery value and from git history.
Last Iterations Summary: derived mirror ownership; live-input closure failures; CI-centered freshness enforcement with explicit exceptions.
Pivot Lineage: none.
Saturated Directions: do not revisit general ownership or guard placement except where it changes the safety trade-off.

## STATE FILES

- Config: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-config.json`
- State Log: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/findings-registry.json`
- Write narrative: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md`
- Write delta: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deltas/iter-004.jsonl`

## CONSTRAINTS

- Execute exactly one LEAF research iteration and do not dispatch sub-agents.
- Present the strongest remove/simplify case and the strongest retain case before deciding.
- Distinguish staging, atomic rename, retained rollback, receipt cleanup, and git recovery; do not collapse them.
- Research only. Do not implement fixes.
- Write only the narrative, one append-only canonical state record, and the delta file.
- Use exact file-and-line citations and explicitly mark unverified claims.
- Include route-proof fields required by the deep-research output contract.
