# Iteration 6: KQ6 Integration Surface Map

## Focus

Measure runtime files and integration surfaces that a CLI transition must account for.

## Findings

1. MCP registrations exist in OpenCode, Codex, and Claude configs: `opencode.json` registers `mk_skill_advisor` with the launcher and env [SOURCE: file:opencode.json:47]; `.codex/config.toml` registers the same launcher [SOURCE: file:.codex/config.toml:104]; `.claude/mcp.json` does likewise [SOURCE: file:.claude/mcp.json:37].
2. Prompt-submit hook registrations exist in `.codex/hooks.json`, `.codex/settings.json`, and `.claude/settings.local.json` [SOURCE: file:.codex/hooks.json:27], [SOURCE: file:.codex/settings.json:14], [SOURCE: file:.claude/settings.local.json:31].
3. Runtime hook source files counted: Claude 246 lines, Gemini 260, Codex hook 425, Codex prompt wrapper 254, Devin 252 [SOURCE: command:wc -l hook files].
4. OpenCode integration includes a 747-line plugin and a 536-line bridge [SOURCE: command:wc -l .opencode/plugins/mk-skill-advisor.js .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs].
5. The OpenCode plugin injects advisor context into `experimental.chat.system.transform` and also exposes `spec_kit_skill_advisor_status` [SOURCE: file:.opencode/plugins/mk-skill-advisor.js:710].
6. Doctor surfaces include `doctor_skill-advisor.yaml` and `doctor_skill-budget.yaml`; line counts were 397 and 111 respectively [SOURCE: command:line-count scan across doctor assets].

## Sources Consulted

- Runtime config files
- Hook source files
- OpenCode plugin and bridge
- Doctor command assets

## Assessment

`newInfoRatio`: 0.68. Surface inventory is high confidence; deep-loop references were present but not the primary CLI call path.

## Reflection

What worked: counting files and hits rather than relying on memory. What failed: broad `rg` returned too many historical spec hits, so final evidence uses targeted files. Ruled out: only migrating Claude/Codex.

## Recommended Next Focus

KQ7: use measured costs to decide hook-path policy.
