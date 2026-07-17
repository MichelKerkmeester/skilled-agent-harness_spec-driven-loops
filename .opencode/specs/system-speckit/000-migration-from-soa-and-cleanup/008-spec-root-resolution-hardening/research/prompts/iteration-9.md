DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 9

STATE SUMMARY: Iteration 9 of 10; remediation candidates and R1-R9 validation assertions exist; this pass must make rollout and rollback operationally precise.

Focus: Map the ranked remediation to a staged migration and rollback sequence. Specify preflight collision checks, canonicalization order, compatibility window, writer cutover, reader fallback, symlink treatment, source/dist rebuild ordering, CI operating-system lanes, stop conditions, and an exact rollback boundary for each stage. Challenge whether any stage can strand legacy-only packets or let automatic writers recreate split state.

Read packet state and iterations 6-8 first. Write only `iterations/iteration-009.md`, one canonical append to `deep-research-state.jsonl`, and `deltas/iter-009.jsonl`. Execute one LEAF iteration with 3-5 focused actions and no more than 12 tool calls. Research only: do not modify source, tests, symlinks, build outputs, git state, or reducer-owned files. Cite every rollout premise to repository evidence or mark it as an inference.

Include exact route proof, `iteration: 9`, `run: 9`, and the full required status/novelty/question/source schema in both canonical records. Verify all outputs and scope before returning.
