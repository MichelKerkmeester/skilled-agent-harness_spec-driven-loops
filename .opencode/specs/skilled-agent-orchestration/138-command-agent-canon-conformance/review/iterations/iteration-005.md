# Deep Review Iteration 005 — Maintainability

## Route proof

- BINDING: mode=review
- BINDING: target_agent=deep-review
- BINDING: execution=single_review_iteration
- BINDING: state_source=externalized_files
- BINDING: do_not_switch_mode=true
- BINDING: iteration=5/5
- BINDING: focus=maintainability
- LEAF review; no sub-agents; review target remained read-only.

## Scope and method

Reviewed the seven canon command families, 13 agent runtime triplets, the parent and five child spec documents, the command/agent authorities, and both Codex sync generators. Re-ran the read-only generator gates and recursive strict packet validation. The review target was not modified.

## Findings

No new maintainability P1 or P2 finding was confirmed.

The 28 in-scope family commands use sequential numbered sections. The router subset carries both OWNED ASSETS and PRESENTATION BOUNDARY; prompt-improve.md and goal_opencode.md are direct workflow/tool commands and intentionally use a different shape [SOURCE: .opencode/commands/create/command.md:12-54, .opencode/commands/prompt-improve.md:1-20, .opencode/commands/goal_opencode.md:1-20].

All 13 OpenCode agents expose permission:, all 13 Claude agents expose tools:, and the deep-loop leaf vocabulary is sanctioned by the create-agent authority [SOURCE: .opencode/skills/sk-doc/create-agent/SKILL.md:175-249]. The two stale TOMLs remain P1-002 [SOURCE: .codex/agents/ai-council.toml:1, .codex/agents/context.toml:1].

The parent and child specs have measurable requirements, phase handoffs, decision records, and evidence-bearing checklists. Their remaining debt is state reconciliation: the review-scope matrix is narrower than the declared source surface (P1-001), parity evidence is stale (P1-002), the parent requires deferred home mutation (P1-003), phase-004 completion evidence conflicts (P1-006), and the parent phase map is stale (P1-007) [SOURCE: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/spec.md:66,92,123, .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship/decision-record.md:45, .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship/implementation-summary.md:87].

Both generators are readable CommonJS with deterministic inventories, bounded parsing, clear check-mode errors, and small functions [SOURCE: .opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:39-109, .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:15-97]. Existing security findings remain P1-004 (deep-alignment sandbox) and P1-005 (symlink-unsafe destinations) [SOURCE: .opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:138-149, .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs:142-147].

Phase children follow 000- through 004-; agent basenames and flat prompt names are deterministic. The singular .opencode/command/ path is confined to the documented broken home symlink, not an active repository reference [SOURCE: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/003-codex-command-parity/decision-record.md:73-77].

## Verification receipts

- Command canon census: 28/28 family files use sequential numbered sections; router-core is present on the router subset.
- Agent schema census: 13/13 OpenCode permission: blocks and 13/13 Claude tools: blocks.
- sync-prompts.cjs --check: PASS, 37 prompts in sync.
- sync-agents.cjs --check: FAIL, stale ai-council.toml and context.toml (P1-002).
- Recursive strict validation: Errors 0, one parent warning; child validations pass.

## Active findings carried forward

P1-001 through P1-007 remain active. No P0 findings and no new P2 findings.

Review verdict: CONDITIONAL
