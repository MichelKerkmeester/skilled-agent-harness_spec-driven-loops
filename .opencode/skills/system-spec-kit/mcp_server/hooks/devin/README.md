# Devin Hook Scripts (OLD location)

> **DEPRECATED 2026-05-16.** This hook location is being migrated. The advisor-routing UserPromptSubmit hook now lives under `.opencode/skills/system-skill-advisor/hooks/` (compiled artifact at `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/<runtime>/`). The code-graph SessionStart hook lives under `.opencode/skills/system-code-graph/` (compiled artifact at `.opencode/skills/system-code-graph/dist/system-spec-kit/mcp_server/hooks/<runtime>/`). Update any runtime config (e.g. `.devin/hooks.v1.json`, Claude `settings.local.json` hooks, Codex `config.toml` hooks, Gemini CLI hook config) before 2026-08-16. After that date this location may be removed without further notice. See `.opencode/skills/system-skill-advisor/references/deferred-decisions.md` §3 for migration tracker.

Hook scripts for Devin CLI lifecycle events.

## Scripts

| File | Hook Event | Behavior |
|------|-----------|----------|
| `user-prompt-submit.ts` | UserPromptSubmit | Skill-advisor routing brief on prompt submit. |
| `session-start.ts` | SessionStart | Code-graph startup readiness context. |

Both scripts now have canonical homes outside system-spec-kit. The compiled artifacts at this OLD location remain functional during the 90-day deprecation window but should not be the runtime-config target for new installs.
