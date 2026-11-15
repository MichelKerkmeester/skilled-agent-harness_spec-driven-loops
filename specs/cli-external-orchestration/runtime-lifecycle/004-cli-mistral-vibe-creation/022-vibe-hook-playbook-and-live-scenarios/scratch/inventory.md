# Vibe hook, part, mirror and plugin inventory

One row per `[[hooks]]` entry in `.vibe/hooks.toml`, per part composed by the
turn-start, turn-end and session-start hooks, per generated mirror, for the
renderer and for the relaunch manual tier, plus one row per plugin in
`references/guards-and-hooks.md` section 4. Each row names the scenario that
proves it or the reason no scenario is needed.

The hook rows are the 18 entries in `.vibe/hooks.toml`. The part rows are the
parts each composing hook runs in its fixed order, so a failing part has its
own scenario rather than hiding behind the entry's name. The plugin rows are
the section 4 classification, which is the authority on whether a plugin has a
Vibe surface at all.

| Surface | Kind | Event | Scenario or reason |
|---|---|---|---|
| `spec-gate-classify` | hook entry | `pre_agent` | `VIB-HK-001` |
| `turn-start` | hook entry | `pre_agent` | `VIB-HK-003` |
| `turn-end` | hook entry | `post_agent` | `VIB-HK-008` |
| `spec-gate` | hook entry | `pre_tool` strict | `VIB-HK-002` |
| `env-secret-guard` | hook entry | `pre_tool` strict | `VIB-HK-010` |
| `dispatch-preflight` | hook entry | `pre_tool` strict | `VIB-HK-011` |
| `overlay-guard` | hook entry | `pre_tool` strict | `VIB-HK-012` |
| `mcp-route-guard` | hook entry | `pre_tool` strict | `VIB-HK-013` |
| `git-message-gate` | hook entry | `pre_tool` strict | `VIB-HK-014` |
| `deep-loop-guard` | hook entry | `pre_tool` strict | `VIB-HK-015` |
| `post-edit-quality` | hook entry | `post_tool` strict | `VIB-HK-016` |
| `dist-freshness-edit` | hook entry | `post_tool` | `VIB-HK-017` |
| `dist-freshness-shell` | hook entry | `post_tool` | `VIB-HK-018` |
| `classifier-injection-screen` | hook entry | `post_tool` | `VIB-HK-019` |
| `compaction-post-tool` | hook entry | `post_tool` | `VIB-HK-007` |
| `decision-capture-ask` | hook entry | `post_tool` | `VIB-HK-020` |
| `session-start` | hook entry | `session_start` | `VIB-GOAL-002` |
| `session-cleanup-end` | hook entry | `session_end` | `VIB-HK-021` |
| `turn-start` completion advisory part | hook part | `pre_agent` | `VIB-HK-004` |
| `turn-start` compaction re-injection part | hook part | `pre_agent` | `VIB-HK-006` |
| `turn-start` advisor brief part | hook part | `pre_agent` | `VIB-HK-003` |
| `turn-start` save nudge part | hook part | `pre_agent` | `VIB-HK-005` |
| `turn-end` completion evidence part | hook part | `post_agent` | `VIB-HK-009` |
| `turn-end` ask-surface reprompt part | hook part | `post_agent` | `VIB-HK-008` |
| `session-start` goal slice part | hook part | `session_start` | `VIB-GOAL-002` |
| `session-start` session context part | hook part | `session_start` | `VIB-GOAL-002` |
| `session-start` startup guards part | hook part | `session_start` | `VIB-HK-022` |
| `session-start` stale-dist warning part | hook part | `session_start` | `VIB-HK-018` |
| `.vibe/agents` | generated mirror | `agents_spawn` | `VIB-HK-024` |
| `.vibe/skills` | generated mirror | `skill` | `VIB-HK-023` |
| `.vibe/prompts` | generated mirror | prompt by name | `VIB-HK-025` |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` | renderer | `session_start` | `VIB-HK-022` |
| relaunch manual tier | dispatch procedure | `--resume` | `VIB-HK-026` |
| `system-spec-gate.js` | plugin | `pre_agent`, `pre_tool` | `VIB-HK-001`, `VIB-HK-002` |
| `cli-dispatch-audit.js` | plugin | `pre_tool` | `VIB-HK-011` |
| `env-secret-guard.js` | plugin | `pre_tool` | `VIB-HK-010` |
| `overlay-guard.js` | plugin | `pre_tool` | `VIB-HK-012` |
| `mcp-route-guard.js` | plugin | `pre_tool` | `VIB-HK-013` |
| `sk-git-message-gate.js` | plugin | `pre_tool` | `VIB-HK-014` |
| `system-deep-loop-guard.js` | plugin | `pre_tool` | `VIB-HK-015` |
| `sk-code-post-edit-quality.js` | plugin | `post_tool` | `VIB-HK-016` |
| `opencode-goal.js` | plugin | `session_start` | `VIB-GOAL-002` |
| `session-cleanup.js` | plugin | `session_start`, `session_end` | `VIB-HK-021` |
| `system-dist-freshness-guard.js` | plugin | `session_start`, `post_tool` | `VIB-HK-017`, `VIB-HK-018` |
| `system-skill-advisor.js` | plugin | skill step | `VIB-HK-003` |
| `ask-surface-guard.js` | plugin | `post_agent` | `VIB-HK-008` |
| `system-completion-sentinel.js` | plugin | `post_agent` | `VIB-HK-009` |
| `session-relaunch.js` | plugin | manual tier | `VIB-HK-026` |
| `session-history-lookup.js` | plugin | compaction part | `VIB-HK-006` |
| `classifier-injection-screen.js` | plugin | `post_tool` | `VIB-HK-019` |
| `decision-capture.js` | plugin | `post_tool` | `VIB-HK-020` |
| `codex-hooks-watchdog.js` | plugin | none | reason: the plugin watches `~/.codex/hooks.json`, a file a Vibe session never reads, so no Vibe surface exists to drive |
| `sk-git-preflight-advisory.js` | plugin | none | reason: the same rules are stated in sk-git's skill docs and no Vibe tool hook can inject an advisory into the next request |
| `system-speckit-completion.js` | plugin | none | reason: Vibe has no plugin tool registry, and the same payload comes from the spec-kit CLI the agent already runs |
