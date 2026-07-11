# Deep Research Strategy: Plugin & Hook Opportunities from Existing Skills

## Research Topic

What additional OpenCode plugins and Claude hooks could we build based on existing repo skills? Ground every candidate in a real skill under `.opencode/skills/` and name its concrete runtime surface (OpenCode plugin hook: `tool.execute.before/after`, `session.*`, `experimental.*`; or Claude hook: `PreToolUse/PostToolUse/SessionStart/UserPromptSubmit/Stop/SessionEnd`).

## Known Context

### Existing 7 OpenCode Plugins (`.opencode/plugins/`)
1. **mk-skill-advisor.js** — Prompt-time skill advisor (`experimental.chat.system.transform`)
2. **mk-code-graph.js** — Code-graph context plugin (session integration)
3. **mk-spec-memory.js** — Prompt-time spec-kit memory continuity (`experimental.chat.system.transform`)
4. **mk-goal.js** — Per-session goal state + autonomous continuation (`experimental.chat.system.transform` + `event()`)
5. **mk-deep-loop-guard.js** — Deep-loop dispatch guard (`tool.execute.before` + `event`)
6. **mk-dist-freshness-guard.js** — Dist staleness guard (`tool.execute.before` + `event` + `experimental.chat.system.transform`)
7. **session-cleanup.js** — Session-end cleanup (dispose lifecycle events)

### Existing Claude Hooks (`.claude/settings.json`)
- **PreToolUse/Bash**: `dispatch-preflight-lint.mjs` (cli-opencode lint preflight)
- **PreToolUse/Task**: `task-dispatch-guard.cjs` (deep-loop dispatch guard, Claude mirror)
- **UserPromptSubmit**: `user-prompt-submit.js` (spec-kit session priming)
- **PreCompact**: `compact-inject.js` (spec-kit continuity injection on compaction)
- **SessionStart**: `session-prime.js` + `worktree-guard.sh` + `check-git-hooks.sh` + `check-dist-staleness.sh`
- **Stop**: `session-stop.js` (spec-kit async save)
- **SessionEnd**: `session-cleanup.sh` (MCP descendant cleanup)
- **PostToolUse/Write|Edit**: `claude-posttooluse.sh` (dist freshness check)

### Existing 12 Skills (`.opencode/skills/*/SKILL.md`)
1. **sk-code** — Code implementation, quality gate, code review, webflow + opencode surfaces
2. **sk-design** — UI design: foundations, interface, motion, audit, md-generator
3. **sk-doc** — Documentation authoring: skills, agents, commands, READMEs, changelogs, flowcharts, quality-control
4. **sk-git** — Git workflow: worktree, branch, commit, PR, merge, finish
5. **sk-prompt** — Prompt engineering: improve (7 frameworks), models (per-model profiles)
6. **system-deep-loop** — Deep research, review, ai-council, improvement loops
7. **system-spec-kit** — Spec folder workflow, levels 1-3+, memory continuity
8. **system-skill-advisor** — Skill routing, recommendation, skill graph
9. **system-code-graph** — Code indexing, graph queries, impact analysis
10. **mcp-code-mode** — MCP orchestration via TypeScript execution
11. **mcp-tooling** — MCP tool bridges (Chrome DevTools, ClickUp, Figma)
12. **cli-external** — External CLI dispatch (opencode, claude-code)

### OpenCode Plugin Hook Surfaces
- `experimental.chat.system.transform` — Inject system context per turn
- `tool.execute.before` — Intercept tool calls before execution (can block/modify)
- `tool.execute.after` — Intercept tool call results after execution
- `event` / `session.created` / `session.*` — Lifecycle events
- `server.instance.disposed` / `global.disposed` — Dispose lifecycle
- `tool.register` — Register custom tools

### Claude Hook Surfaces
- `PreToolUse` — Before tool execution (matcher: Bash, Write, Edit, Task, etc.)
- `PostToolUse` — After tool execution
- `SessionStart` — Session initialization
- `UserPromptSubmit` — User prompt arrives
- `Stop` — Agent stop (before final response)
- `SessionEnd` — Session termination
- `PreCompact` — Before context compaction

### resource-map.md
resource-map.md not present; skipping coverage gate

## Key Questions

1. **KQ-1**: Which skills have latent behaviors (validation, enforcement, advisory) that are only reachable interactively but would be more valuable as always-on hooks/plugins?
2. **KQ-2**: Which skills' patterns have a proven runtime contract (a script that already runs on demand) that could be trivially promoted to a hook surface?
3. **KQ-3**: Which OpenCode hook surfaces (`tool.execute.after`, `tool.register`, `event`) are currently underused and could host new value?
4. **KQ-4**: Which Claude hook surfaces (`PostToolUse`, `SessionEnd`, `Stop`) have gaps where a skill-derived hook would add guardrails?
5. **KQ-5**: For each candidate, what is the blast radius — does it observe/advise (low) or enforce/block/mutate (high)?

## Answered Questions

(none yet)

## What Worked

(none yet)

## What Failed

(none yet)

## Exhausted Approaches

(none yet)

## Ruled-Out Directions

(none yet)

## Next Focus

- Inventory sk-git's scripts and patterns for hook promotion candidates (branch guards, commit message validation, worktree health)
- Inventory sk-code's quality scripts and surface evidence for additional enforcement hooks
- Inventory sk-doc's quality-control and validation capabilities for plugin/hook promotion
- Inventory sk-prompt's framework and model-profile capabilities for advisory hooks
- Inventory system-code-graph and system-deep-loop for lifecycle hooks

## Non-Goals

- Implementing any proposed plugin or hook (research only)
- Re-auditing the existing seven plugins/hooks in detail (already catalogued above)
- Third-party MCP servers not backed by an existing repo skill

## Stop Conditions

- All 5 key questions have evidence-backed answers
- Average newInfoRatio across last 3 iterations falls below 0.05 threshold
- maxIterations (10) reached
- All skill families inventoried with no new candidates emerging
