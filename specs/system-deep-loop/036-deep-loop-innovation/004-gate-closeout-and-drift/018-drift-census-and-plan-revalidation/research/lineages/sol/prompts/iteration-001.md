DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: packet spec and root phase map loaded by the orchestrator.
Next focus: Independently reproduce phase 003's two renamed runtime-reference paths and zero-match `behavior_benchmark/` glob, then resolve the packet-033 renumber dependency with commit and path evidence.

Research Topic: Drift census over packet 036-deep-loop-innovation: have commits after baseline 0ce43ff589 invalidated or degraded any planned phases 003-017? Every phase ultimately needs an explicit verdict with commit SHA plus path:line evidence. Separate first-order path/symbol drift from second-order premise drift.
Iteration: 1 of 10
Focus Area: Independently reproduce phase 003's two renamed runtime-reference paths and zero-match `behavior_benchmark/` glob, then resolve the packet-033 renumber dependency with commit and path evidence.
Remaining Key Questions:
- Which paths, files, globs, symbols, and dependencies named by phases 003-017 no longer resolve, including phase 003's required positive controls?
- Which phase premises are now false because registered-mode counts, routing defaults, taxonomy, or planned capabilities changed or already shipped?
- Does the packet-033 benchmark dependency survive its renumber, and what exact benchmark location should phases 003 and 016 use now?
- What is the explicit verdict for each phase 003-010, with commit SHA and path:line evidence?
- What is the explicit verdict for each phase 011-017, including at least one genuinely clean negative control, with commit SHA and path:line evidence?
Carried-Forward Open Questions: none yet.
Last 3 Iterations Summary: none yet.
Pivot Lineage: none yet.
Saturated Directions: none yet.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent executing exactly one iteration. Do not dispatch sub-agents or run another loop.
- Read config, state log, and strategy before any research action.
- Target 3-5 focused research actions and stay within 12 tool calls.
- Research only. Do not implement fixes or modify files being investigated.
- Every finding needs `[SOURCE: path:line]`, a commit SHA, or a clearly labeled command-output citation.
- Use the actual `0ce43ff589..HEAD` commit range. Independently verify the positive controls rather than merely repeating the prompt.
- The workflow reducer owns strategy, registry, and dashboard. Treat them as read-only.
- ALLOWED WRITE PATHS are only the iteration narrative, append-only state log, and per-iteration delta file listed above.
- BANNED OPERATIONS: deletion, rename, truncation, git mutation, or any write outside those three paths.
- If a needed mutation falls outside the allowlist, report it as a finding and do not execute it.

## OUTPUT CONTRACT

Produce all three artifacts:

1. The iteration narrative with headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out/Dead Ends, Sources Consulted, Assessment, Reflection, and Recommended Next Focus.
2. Append exactly one canonical single-line JSON record to the state log. Required fields:
   `{"type":"iteration","iteration":1,"run":1,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":<0..1>,"status":"complete|timeout|error|stuck|insight|thought","focus":"<string>","findingsCount":<n>,"noveltyJustification":"<sentence>","keyQuestions":[...],"answeredQuestions":[...],"ruledOut":[...],"toolsUsed":[...],"sourcesQueried":[...],"timestamp":"<ISO-8601>","durationMs":<n>}`
3. Create the delta file whose first line is the same canonical iteration record, followed by structured finding or ruled-out records.

Do not append executor provenance; the workflow patches that field after return. Verify both files and exactly one state-log iteration append before responding.
