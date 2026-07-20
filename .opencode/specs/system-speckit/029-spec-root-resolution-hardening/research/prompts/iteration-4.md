DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 4

STATE SUMMARY: Iteration 4 of 10; 3/5 key questions answered; last ratios 1.00 -> 1.00; convergence is telemetry under the requested max-iterations policy.

Focus: Characterize the symlink-absent failure mode for every automatic or implicit writer identified so far. Build a writer-by-writer matrix covering entrypoint, resolver, selected root, created path, silent split-brain versus hard failure, and downstream reader visibility. Include broken-symlink and plain-directory cases where evidence supports them.

Read config, state log, strategy, and registry in `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/` first. Respect all prior evidence and do not re-run exhausted searches.

Write only `iterations/iteration-004.md`, append exactly one canonical iteration record to `deep-research-state.jsonl`, and create `deltas/iter-004.jsonl` in that packet. Execute exactly one LEAF iteration with 3-5 focused actions and at most 12 tool calls. All investigated code/config is read-only; do not implement fixes or edit reducer-owned files. Cite every finding with file:line evidence or explicit inference.

Include the exact route-proof fields plus `iteration: 4`, `run: 4`, complete novelty/status/question/source fields, and optional graph events in both canonical records. Verify the narrative, exactly-one append, matching delta, citations, and scope before returning.
