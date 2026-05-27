# Devin Hook Scripts (OLD location)

> **DEPRECATED 2026-05-16.** This hook location is being migrated. The advisor-routing UserPromptSubmit hook now lives under `.opencode/skills/system-skill-advisor/hooks/` (compiled artifact at `.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/<runtime>/`). The code-graph SessionStart hook's compiled artifact is at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/<runtime>/session-start.js` (corrected 2026-05-27 — the earlier `system-code-graph/dist/system-spec-kit/...` artifact path was never built; `.devin/hooks.v1.json` was repointed to the real path in packet 029 phase 004). Update any runtime config (e.g. `.devin/hooks.v1.json`, Claude `settings.local.json` hooks, Codex `config.toml` hooks, Gemini CLI hook config) before 2026-08-16. After that date this location may be removed without further notice. See `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` §3 for migration tracker.

---

## 1. OVERVIEW

Hook scripts for Devin CLI lifecycle events. This is the deprecated system-spec-kit location; new runtime configs should point at the advisor-owned UserPromptSubmit hook and code-graph SessionStart hook.

## 2. SCRIPTS

| File | Hook Event | Behavior |
|------|-----------|----------|
| `user-prompt-submit.ts` | UserPromptSubmit | Skill-advisor routing brief on prompt submit. |
| `session-start.ts` | SessionStart | Code-graph startup readiness context. |

Both scripts now have canonical homes outside system-spec-kit. The compiled artifacts at this OLD location remain functional during the 90-day deprecation window but should not be the runtime-config target for new installs.

## 3. RELATED

- `.devin/hooks.v1.json`
- `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts`
- `.opencode/skills/system-code-graph/hooks/devin/session-start.ts`
