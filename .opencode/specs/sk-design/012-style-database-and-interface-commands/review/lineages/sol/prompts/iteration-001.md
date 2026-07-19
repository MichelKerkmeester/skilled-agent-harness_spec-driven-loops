DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 001: Correctness

STATE SUMMARY: Iteration 1 of 10. Prior findings P0=0 P1=0 P2=0. Coverage 0/4. Core traceability pending. Resource map absent. Provisional verdict PENDING.

Review the correctness of the style-database implementation and its tests against phase 001 research and phase 003 requirements. Prioritize published-generation consistency, crash safety, hash freshness, tombstone/quarantine behavior, eligibility-before-ranking, RRF/cursor determinism, vector degradation, adapter modes, and fail-closed paths.

Read before action:
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-config.json`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-findings-registry.json`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-strategy.md`
- `.opencode/skills/sk-code/code-review/references/review-core.md`
- Phase 001 research synthesis and phase 003 spec/checklist/implementation summary
- Relevant files under `.opencode/skills/sk-design/styles/_db/` and `.opencode/skills/sk-design/styles/_engine/`

You are a LEAF reviewer. Do not dispatch sub-agents. Target 9 tool calls, soft max 12, hard max 13. Review target files are read-only. Do not implement fixes.

ALLOWED WRITE PATHS only:
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/iterations/iteration-001.md`
- append one canonical iteration record to `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deltas/iter-001.jsonl`
- in-place update `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-strategy.md`

Produce all three required iteration artifacts. The canonical state record must use `type:"iteration"`, `mode:"review"`, `target_agent:"deep-review"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=review target_agent=deep-review"`, iteration 1, sessionId `fanout-sol-1784457701676-6nfth8`, generation 1, lineageMode `new`, cumulative findingsSummary, detailed findings with category/file/line/finding_class/content_hash/evidence, and `reviewDepthSchemaVersion:2` with a cited strict search ledger. Every finding requires direct file:line evidence. Every new P0/P1 requires a typed claim-adjudication JSON block in the narrative. End the narrative with exactly one final line: `Review verdict: PASS`, `Review verdict: CONDITIONAL`, or `Review verdict: FAIL`.
