DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 2

STATE SUMMARY: Iteration 2 of 10; 1/5 key questions answered; last ratio 1.00; memory MCP and warm CLI are unavailable; resource map was absent at init.

Research topic: Harden spec-folder root resolution without depending on the repository-root specs symlink.
Focus: Determine whether canonical-first is the correct universal contract and identify concrete regressions for every legacy-first consumer or persisted-path dependency found in iteration 1.

Read these state files first:
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-config.json`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-state.jsonl`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-strategy.md`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/findings-registry.json`

Write only:
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-002.md`
- append exactly one canonical iteration record to `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deep-research-state.jsonl`
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/deltas/iter-002.jsonl`

Execute exactly one LEAF iteration with 3-5 focused research actions and at most 12 tool calls. Investigated files are read-only; do not implement fixes or edit reducer-owned files. Cite every finding with exact file:line evidence or an explicit inference. Include `type: "iteration"`, `iteration: 2`, `run: 2`, `mode: "research"`, `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, status, focus, findingsCount, newInfoRatio, noveltyJustification, keyQuestions, answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs, and optional graphEvents in both canonical records. Verify the narrative, exactly-one append, matching delta, citations, and scope before returning.
