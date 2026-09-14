DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/10 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource Map: present (58 references, do not rediscover)
Next focus: Angle 1: headless dispatch contract

Research Topic: Hermes Agent (Nous Research, installed at ~/.hermes, v0.21.1) as the seventh cli-external-orchestration runtime
Iteration: 1 of 10
Focus Area: Angle 1: headless dispatch contract (hermes_cli/_parser.py, chat entry point, live --help output; compare with the six cli-reference.md files)
Remaining Key Questions: q1..q10 (see strategy)
Last 3 Iterations Summary: none

## CONSTRAINTS

- LEAF agent: no sub-agents. Max 12 tool calls.
- Read-only access to ~/.hermes; no mutating hermes commands; stdin closed (</dev/null).
- Cite file:line for every claim; mark documentation-only claims `documented, unconfirmed`; guesses `UNKNOWN`.
- ALLOWED WRITE PATHS: iterations/iteration-001.md, deltas/iter-001.jsonl, the append gateway writes.
- Write the iteration record through the append gateway (never write deep-research-state.jsonl directly).

## OUTPUT CONTRACT

1. iterations/iteration-001.md — narrative: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Assessment, Reflection, Next Focus.
2. Canonical iteration record through the append gateway (type "iteration").
3. deltas/iter-001.jsonl — iteration record + per-finding records.
