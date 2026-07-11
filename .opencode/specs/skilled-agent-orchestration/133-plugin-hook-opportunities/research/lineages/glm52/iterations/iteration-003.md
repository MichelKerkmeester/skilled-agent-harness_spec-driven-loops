# Iteration 3: system-deep-loop, mcp-code-mode, cli-external, and underused OpenCode surfaces

## Focus

Inventory system-deep-loop for lifecycle hooks beyond the dispatch guard, examine mcp-code-mode and cli-external for tool-registration and dispatch-preflight expansion candidates, and map underused OpenCode plugin surfaces (`tool.execute.after`, `tool.register`).

## Findings

### Candidate 10: Code-Mode Tool Budget Advisor (mcp-code-mode → OpenCode tool.execute.before)

**Source skill:** `.opencode/skills/mcp-code-mode/SKILL.md`
**Runtime surface:** OpenCode `tool.execute.before`

The mcp-code-mode skill advertises 98.7% context reduction via progressive discovery, but also establishes the principle that external MCP tool calls should go through Code Mode exclusively. Currently, if an agent calls an external MCP tool directly (via native `mcp__*` calls instead of `call_tool_chain`), there is no runtime nudge — the skill is advisory only.

A `tool.execute.before` plugin could intercept native MCP tool calls (matching `mcp__` prefix but NOT the native spec-memory/advisor/code-graph/code-mode/sequential-thinking servers) and inject a one-line advisory: "This tool is available via Code Mode for 98% context reduction — consider `call_tool_chain`." This would be warn-only, identical to how `mk-dist-freshness-guard.js` surfaces staleness warnings without blocking.

**Blast radius:** Low (observe/advise). Warn-only, fail-open.

[SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:1-60]
[SOURCE: .opencode/plugins/mk-dist-freshness-guard.js (warn-only tool.execute.before pattern)]

### Candidate 11: CLI Dispatch Audit Trail (cli-external → OpenCode tool.execute.after)

**Source skill:** `.opencode/skills/cli-external/cli-opencode/SKILL.md`
**Runtime surface:** OpenCode `tool.execute.after`

The existing `dispatch-preflight-lint.mjs` (PreToolUse/Bash) checks hard_rules before a `opencode run` / `claude -p` dispatch. But there is no post-dispatch audit — after a CLI dispatch completes, there's no structured log of what was dispatched, to which model, with what result.

A `tool.execute.after` plugin (the first use of this entirely unused surface) could capture completed `opencode run` / `claude -p` dispatches and append a structured audit line to `.opencode/logs/cli-dispatch-audit.jsonl`. This provides observability for cross-CLI orchestration patterns, cost tracking, and debugging dispatch failures. The data shape: `{ timestamp, command, model, exitCode, durationMs }`.

**Blast radius:** Low (observe/log). No mutation, no blocking. First use of `tool.execute.after`.

[SOURCE: .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:1-80]
[SOURCE: .opencode/plugins/README.md (no tool.execute.after usage)]

### Candidate 12: Deep-Loop State Cleanup on SessionStart (system-deep-loop → OpenCode session.created)

**Source skill:** `.opencode/skills/system-deep-loop/SKILL.md`
**Runtime surface:** OpenCode `session.created`

The `mk-deep-loop-guard.js` plugin already sweeps stale `.loop-guard-state` files on `session.created`, but this is limited to its own guard-state files. The deep-loop runtime produces broader state artifacts: `deep-research-state.jsonl`, `deep-review-state.jsonl`, iteration files, delta files, and pause sentinels across potentially many spec folders. When a session crashes mid-iteration, pause sentinels (`.deep-research-pause`, `.deep-review-pause`) and advisory locks (`.deep-research.lock`) can be left behind, blocking future runs.

A `session.created` event handler (extending the existing sweep in `mk-deep-loop-guard.js` or as a new plugin) could scan for orphaned pause sentinels and stale locks older than a threshold (e.g., 24h) and clean them up, logging what was reclaimed. This is analogous to how `session-cleanup.js` reclaims MCP descendants on disposal.

**Blast radius:** Low (background cleanup). Must respect active sessions.

[SOURCE: .opencode/plugins/mk-deep-loop-guard.js:50-55 (existing sweep)]
[SOURCE: .opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md:181-198 (pause sentinel lifecycle)]
[SOURCE: .opencode/plugins/session-cleanup.js (dispose cleanup pattern)]

### Candidate 13: Spec-Kit Completion State Exposer (system-spec-kit → OpenCode tool.register)

**Source skill:** `.opencode/skills/system-spec-kit/SKILL.md`
**Runtime surface:** OpenCode `tool.register`

The `tool.register` surface is completely unused across all 7 existing plugins. The system-spec-kit skill owns packet completion state (validate.sh, checklist.md verification), but this state is only accessible by running validate.sh manually or reading checklist.md. 

A `tool.register` plugin could expose a custom `mk_spec_completion_status` tool that, when called, returns the current completion state of the active spec folder (level, checklist items verified/unverified, validation pass/fail, last-validated timestamp). This would make spec completion state queryable as a first-class tool rather than requiring the agent to read multiple files.

**Blast radius:** Low (new read-only tool). First use of `tool.register`.

[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh]
[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh]
[SOURCE: .opencode/plugins/README.md (no tool.register usage)]

### Candidate 14: Git Worktree Health Monitor (sk-git → OpenCode session.created + Claude SessionStart)

**Source skill:** `.opencode/skills/sk-git/references/worktree_workflows.md`
**Runtime surface:** OpenCode `session.created` + Claude `SessionStart`

The sk-git skill manages worktrees under `.worktrees/` with numbered branches (`wt/{NNNN}-{name}`). The existing `worktree-guard.sh` (SessionStart hook) checks for worktree existence, but it does not monitor worktree health: stale worktrees (no commits in 30+ days), unmerged branches, conflicting worktree states, or orphaned worktree directories after branch deletion.

A SessionStart/session.created handler could scan `.worktrees/`, compare against active branches, and surface a brief health report: stale worktrees, branches that exist in `.worktrees/` but were deleted in git, and worktrees with uncommitted changes. This is an observability extension of the existing `worktree-guard.sh`.

**Blast radius:** Low (observe/advise). Extends an existing hook.

[SOURCE: .claude/settings.json:71 (worktree-guard.sh SessionStart)]
[SOURCE: .opencode/skills/sk-git/references/worktree_workflows.md]
[SOURCE: .opencode/bin/worktree-guard.sh]

## Surface Gap Analysis: Underused Hook Surfaces

| Surface | Used By | Gap |
|---------|---------|-----|
| `tool.execute.before` | mk-deep-loop-guard, mk-dist-freshness-guard | Well-covered; room for git-commit guard (Candidate 1) and code-mode advisor (Candidate 10) |
| `tool.execute.after` | **NONE** | Entirely unused — Candidates 2, 4, 5, 6, 8, 9, 11 all map here |
| `tool.register` | **NONE** | Entirely unused — Candidate 13 |
| `experimental.chat.system.transform` | mk-skill-advisor, mk-spec-memory, mk-goal, mk-dist-freshness-guard | Well-covered; room for small-model advisor (Candidate 7) |
| `session.created` | mk-skill-advisor, mk-spec-memory, mk-goal, mk-dist-freshness-guard, mk-code-graph, mk-deep-loop-guard, session-cleanup | Saturated; Candidates 12, 14 are bounded extensions |
| `disposed` | session-cleanup | Adequate |

## Sources Consulted

- `.opencode/plugins/*.js` (all 7 plugins, grep for hook surface usage)
- `.opencode/skills/mcp-code-mode/SKILL.md` (lines 1-60)
- `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` (full)
- `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop_protocol.md` (pause sentinel section)
- `.claude/settings.json` (all existing Claude hooks)

## Assessment

- **newInfoRatio:** 0.7 — 5 new candidates plus the surface-gap analysis (high value). Structural novelty lower because PostToolUse/session.created patterns are established. The `tool.execute.after` and `tool.register` gap finding is genuinely new.
- **Novelty justification:** 5 net-new candidates; surface-gap analysis is a new analytical dimension
- **Confidence:** High — surface usage verified by direct grep across all plugin files

## Reflection

**What worked:** The surface-gap analysis revealed two entirely unused surfaces (`tool.execute.after`, `tool.register`), which is a strong signal for where new value can be added without crowding existing hooks.

**What failed:** The system-deep-loop skill already has comprehensive plugin coverage via `mk-deep-loop-guard.js`; limited room for new enforcement hooks there.

**Ruled out:** Direct deep-loop dispatch enforcement — already covered by `mk-deep-loop-guard.js` (both OpenCode plugin and Claude PreToolUse/Task hook).

## Recommended Next Focus

Cross-cutting candidates: hooks that span multiple skills (e.g., a unified quality-gate PostToolUse hook that runs multiple checks in one invocation). Also examine the open questions around observe-vs-enforce appetite and blast-radius ranking.
