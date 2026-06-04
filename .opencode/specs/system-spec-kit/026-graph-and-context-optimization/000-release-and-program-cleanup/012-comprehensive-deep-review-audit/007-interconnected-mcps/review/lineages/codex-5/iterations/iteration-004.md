# Iteration 004 - Maintainability And Code Hygiene

Session: fanout-codex-5-1780596001496-uhn96t
Executor: cli-codex model=gpt-5.5
Focus: maintainability: docs and code hygiene

## Scope Reviewed

- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts`
- `.opencode/skills/system-skill-advisor/SKILL.md`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts`

## Findings

### F008 - P2 - Deep-loop-runtime SKILL.md still says scripts has four files while the same section lists fan-out scripts

Evidence:

- `.opencode/skills/deep-loop-runtime/SKILL.md:155` to `:169` lists the runtime scripts, including fan-out scripts.
- `.opencode/skills/deep-loop-runtime/SKILL.md:249` still says there are four scripts.

Impact:

The skill documentation has a stale inventory count. This can confuse dispatch agents and maintenance reviewers.

Concrete fix:

Update the script-count text or remove the exact count.

### F009 - P2 - Code-graph dispatch keeps phase-number placeholder comments in code

Evidence:

- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:14` to `:16`
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:33` to `:35`
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:121` to `:123`

Impact:

These comments embed ephemeral phase/task labels in durable code. That violates the project comment-hygiene rule and creates misleading maintenance breadcrumbs.

Concrete fix:

Keep the durable reason for each branch, but remove phase-number labels from comments.

## Positive Coverage

The skill-advisor internal `propagate-enhances` tool is registered and dispatched as documented:

- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:66`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:35`

Review verdict: PASS
