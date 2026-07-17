DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: startup lookup failed because the MCP connection closed; use packet continuity and direct repository evidence.
Next focus: Build the exhaustive root-resolution call-site inventory, including exact files, lines, callers, and precedence.

Research Topic: Harden spec-folder root resolution across scripts, MCP-server code, hooks, and automatic writers without relying on the repository-root specs symlink.
Iteration: 1 of 10
Focus Area: Build the exhaustive root-resolution call-site inventory, including exact files, lines, callers, and precedence.
Remaining Key Questions:
- Which call sites resolve or enumerate spec roots, what exact precedence does each use, and which writers or readers consume each result?
- Is canonical-first the correct universal contract, and which legacy-first consumers or persisted paths could regress under that change?
- What created and maintains the root specs symlink, is it intentional, and is it safe across supported platforms and checkout modes?
- What is each automatic writer's failure mode when the symlink is absent, including the Claude session-stop autosave path?
- What ranked remediation, migration, rollback, and dual-environment validation strategy minimizes regression risk?
Carried-Forward Open Questions: none yet
Last 3 Iterations Summary: none yet
Pivot Lineage: none yet
Saturated Directions: none yet

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-config.json
- State Log: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md
- Registry: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deltas/iter-001.jsonl

## CONSTRAINTS

- Execute exactly one research iteration as the `deep-research` LEAF agent. Do not dispatch sub-agents.
- Read config, state log, and strategy first. Treat resolver code and all investigated paths as read-only.
- Target 3-5 focused research actions and stay within 12 tool calls.
- Write only the iteration narrative, one append-only canonical iteration record, and the matching delta file at the exact paths above.
- Do not edit reducer-owned strategy, registry, or dashboard files. Do not implement fixes.
- Cite every finding with `[SOURCE: file:line]` or mark it as an inference.
- Include route proof in both canonical iteration records: `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, and `mode: "research"`.
- Use `type: "iteration"` and include both `iteration: 1` and `run: 1`, plus status, focus, findingsCount, newInfoRatio, noveltyJustification, keyQuestions, answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs, and graphEvents when useful.
- The first delta line must be the same canonical iteration object as the state-log append; additional finding and ruled_out records may follow.
- Verify all three required artifacts and exactly one state-log iteration append before returning.

## OUTPUT CONTRACT

Return the standard concise iteration completion report only after the narrative, state append, and delta file are verified.
