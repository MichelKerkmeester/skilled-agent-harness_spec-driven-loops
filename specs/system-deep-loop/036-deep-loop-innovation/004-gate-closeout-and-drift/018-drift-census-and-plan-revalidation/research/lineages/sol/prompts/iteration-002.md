DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 10
Questions: 0/5 answered | Last focus: phase 003 path drift and packet-033 benchmark dependency
Last 2 ratios: N/A -> 0.90 | Stuck count: 0
Resource map: absent.
Next focus: Which phase can serve as a genuinely clean negative control?

Research Topic: Revalidate packet 036 phases 003-017 against `0ce43ff589..HEAD`, separating first-order path drift from second-order premise drift and producing an explicit evidence-backed verdict for every phase.
Iteration: 2 of 10
Focus Area: Run a first-order path/file/symbol/glob resolution census over phases 004-017 and identify at least one genuinely clean negative-control phase. Do not repeat phase 003 controls except as comparison.
Remaining Key Questions:
- Which paths, files, globs, symbols, and dependencies named by phases 003-017 no longer resolve, including phase 003's required positive controls?
- Which phase premises are now false because registered-mode counts, routing defaults, taxonomy, or planned capabilities changed or already shipped?
- Does the packet-033 benchmark dependency survive its renumber, and what exact benchmark location should phases 003 and 016 use now?
- What is the explicit verdict for each phase 003-010, with commit SHA and path:line evidence?
- What is the explicit verdict for each phase 011-017, including at least one genuinely clean negative control, with commit SHA and path:line evidence?
Prior result: phase 003 needs refinement; packet 033 survives as archived packet 027 while active benchmark authority is under the skill's kebab-case behavior-benchmark paths.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/findings-registry.json
- Narrative: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-002.md
- Delta: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deltas/iter-002.jsonl

## CONSTRAINTS

- LEAF agent, exactly one iteration, no sub-agents or nested loops.
- Read config, state log, strategy, and prior iteration before research.
- Perform 3-5 focused actions, max 12 tool calls.
- Read-only research surface. Do not modify investigated files.
- Allowed writes are only the iteration-002 narrative, state-log append, and iter-002 delta.
- Every drift claim needs post-baseline commit SHA plus current `path:line` evidence. For a clean control, name the surfaces checked and cite current paths plus commit-range evidence showing no relevant drift.
- Distinguish a genuinely missing target from planned future files that were never expected to exist at baseline.
- Do not count the known phase-number reference corruption as post-baseline drift.

## OUTPUT CONTRACT

Write the narrative, append exactly one canonical `type=iteration` record for iteration/run 2 with route-proof fields, and create the delta whose first line is byte-equivalent JSON data. Include `findingsCount`, `noveltyJustification`, `keyQuestions`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, and `durationMs`. Do not add executor provenance; the workflow patches it after return. Verify all three artifacts before responding.
