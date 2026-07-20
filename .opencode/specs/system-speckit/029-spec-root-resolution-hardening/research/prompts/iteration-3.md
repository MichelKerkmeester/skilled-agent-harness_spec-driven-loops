DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 3

STATE SUMMARY: Iteration 3 of 10; 2/5 key questions answered; ratios 1.00 -> 1.00; resource map absent; memory unavailable.

Research topic: Harden spec-folder root resolution without depending on the repository-root specs symlink.
Focus: Determine what created and maintains the root `specs` symlink, whether it is intentional, and whether it is safe across supported platforms, clones, archives, worktrees, and checkout modes. Distinguish repository evidence from filesystem inference.

Read config, state log, strategy, and registry under `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/` first. Respect prior findings and exhausted directions.

Write only `iterations/iteration-003.md`, append exactly one canonical iteration record to `deep-research-state.jsonl`, and create `deltas/iter-003.jsonl` under that same packet. Execute exactly one LEAF iteration, 3-5 focused actions, maximum 12 tool calls. Investigated files are read-only. Do not implement changes or edit reducer-owned files. Cite every finding with exact file:line evidence, command evidence captured in the narrative, or an explicit inference.

Both canonical iteration records must include `type: "iteration"`, `iteration: 3`, `run: 3`, `mode: "research"`, `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, and the complete status/focus/novelty/question/source fields required by the agent contract. Verify narrative structure, exactly-one append, matching delta, citations, and packet scope before returning.
