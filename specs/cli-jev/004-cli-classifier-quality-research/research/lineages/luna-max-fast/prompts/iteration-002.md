DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 2 Prompt

## State
Session: fanout-luna-max-fast-1791118713156-9uew1r, generation 1
Iteration: 2 of 5
Previous completed iteration: 1, newInfoRatio 0.30, two P2 shared README findings.
Stop policy: max-iterations; convergence is telemetry only.

## Focus
Audit sk-code-opencode compliance and static correctness of `shared/scripts/jev-transport.mjs`, `shared/scripts/scorer-report.mjs`, their tests, benchmark scorer scripts, and all live callers under sk-doc, system-deep-loop, and system-spec-kit. Read sources only; do not run tests or benchmarks. Cite exact file:line for each finding, assign P0-P2 and one of the seven research axes, explain confirmation, and record negative knowledge.

## Route Proof
mode=research
target_agent=deep-research
agent_definition_loaded=true
resolved_route=Resolved route: mode=research target_agent=deep-research

## Output Contract
Write the iteration narrative and delta inside this lineage. Record the iteration event through append-mode-event.cjs; do not edit deep-research-state.jsonl directly. The event and delta first row must share the same iteration record with stable runId/sessionId/lineageId, generation, route-proof fields, answeredQuestions, and research fields. Include sources on each finding row. Do not stop early for convergence.
