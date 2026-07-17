DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 5

STATE SUMMARY: Iteration 5 of 10; 4/5 key questions answered; iteration 4 produced a cited writer matrix but timed out while checking source/dist parity.

Focus: Close the exact iteration-4 evidence gap. Trace the Claude Stop/session-stop autosave chain end to end into `generate-context.js`, verify source-versus-compiled-dist resolver parity at every step, and identify where a symlink-absent run selects or creates a root. Do not broaden into remediation yet.

Read config, state log, strategy, registry, and iteration 4 first from `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/`. Avoid repeating writer-matrix work already established.

Write only `iterations/iteration-005.md`, append exactly one canonical iteration record to `deep-research-state.jsonl`, and create `deltas/iter-005.jsonl`. Execute one LEAF iteration with 3-5 focused actions, maximum 12 tool calls. Investigated paths are read-only; no implementation or reducer-owned edits. Cite exact file:line evidence and explicitly record any source/dist drift.

Include exact route proof, `iteration: 5`, `run: 5`, and all required status/novelty/question/source fields in both canonical records. Verify all three artifacts, exactly-one append, matching delta, citations, and packet scope before returning.
