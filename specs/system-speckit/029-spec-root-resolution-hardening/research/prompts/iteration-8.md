DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 8

STATE SUMMARY: Iteration 8 of 10; all original questions answered; six collision/test gaps identified in iteration 7.

Focus: Design the concrete regression test and fixture matrix for root resolution with and without the symlink. Cover canonical-only, legacy-only, symlink alias, two independent roots, duplicate packet IDs, broken symlink, plain-directory replacement, auto-writer destinations, and reader discoverability. Anchor proposed assertions in existing test harness patterns and identify which checks must run against source and compiled dist. Research only; do not create fixtures.

Read packet state and iterations 4-7 first. Write only `iterations/iteration-008.md`, exactly one canonical append to `deep-research-state.jsonl`, and `deltas/iter-008.jsonl`. Execute one LEAF iteration with 3-5 focused actions and at most 12 tool calls. Keep all investigated paths read-only; do not modify the symlink, tests, source, build outputs, git state, or reducer-owned files. Cite each proposed assertion to existing harness or behavior evidence.

Include exact route proof, `iteration: 8`, `run: 8`, and all required canonical iteration fields in both records. Verify narrative, exactly-one append, matching delta, citations, and scope before returning.
