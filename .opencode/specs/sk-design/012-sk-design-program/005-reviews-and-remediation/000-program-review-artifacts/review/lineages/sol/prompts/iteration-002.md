DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 002: Security

STATE SUMMARY: Iteration 2 of 10. Active findings P0=0 P1=2 P2=1. Coverage correctness=complete, security/traceability/maintainability=pending. Core spec_code=fail, checklist_evidence=partial. Resource map absent. Provisional verdict CONDITIONAL.

Review security and trust boundaries across the style database and interface-command implementation. Prioritize corpus symlink/path containment during discovery/indexing/hydration, SQLite and generation pointer validation, hostile query/vector input bounds, rights enforcement, prompt-injection handling for exemplars/recovered context, command mutation boundaries, and alias recursion or command-to-command dispatch. Re-adjudicate prior P1 findings only if security evidence changes their severity; otherwise carry them forward without duplicating them.

Read before action:
- All four lineage state files under `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/`
- `.opencode/skills/sk-code/code-review/references/review-core.md`
- phase 003 and 004 specs/checklists/implementation summaries
- relevant files under `styles/_db/`, `styles/_engine/`, `commands/interface/`, `commands/design/`, and `sk-design/shared/creation-contract.md`

You are a LEAF reviewer. Do not dispatch sub-agents. Target 9 tool calls, soft max 12, hard max 13. Review target files are read-only. Do not implement fixes.

ALLOWED WRITE PATHS only:
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/iterations/iteration-002.md`
- append one canonical iteration record to `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deltas/iter-002.jsonl`
- in-place update `.opencode/specs/sk-design/012-style-database-and-interface-commands/review/lineages/sol/deep-review-strategy.md`

Produce all three required iteration artifacts. The canonical state record must use `type:"iteration"`, exact route proof fields, iteration 2, sessionId `fanout-sol-1784457701676-6nfth8`, generation 1, lineageMode `new`, cumulative findingsSummary, detailed new/refined findings, and `reviewDepthSchemaVersion:2` with a cited strict search ledger. Every finding requires direct file:line evidence and content_hash. Every new P0/P1 requires a typed claim-adjudication JSON block. End the narrative with exactly one canonical `Review verdict:` line.
