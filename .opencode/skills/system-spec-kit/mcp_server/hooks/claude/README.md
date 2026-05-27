# Claude Code Hook Scripts

> **DEPRECATED 2026-05-16.** This hook location is being migrated. The advisor-routing UserPromptSubmit hook now lives under `.opencode/skills/system-skill-advisor/hooks/` (compiled artifact at `.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/<runtime>/`). The code-graph SessionStart hook's compiled artifact is at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/<runtime>/session-start.js` (corrected 2026-05-27 — the earlier `system-code-graph/dist/system-spec-kit/...` artifact path was never built; `.devin/hooks.v1.json` was repointed to the real path in packet 029 phase 004). Update any runtime config (e.g. `.devin/hooks.v1.json`, Claude `settings.local.json` hooks, Codex `config.toml` hooks, Gemini CLI hook config) before 2026-08-16. After that date this location may be removed without further notice. See `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` §3 for migration tracker.

---

## 1. OVERVIEW

Hook scripts for Claude Code lifecycle events. These run as external Node.js processes triggered by Claude Code, not as MCP server modules.

## 2. SCRIPTS

| File | Hook Event | Behavior |
|------|-----------|----------|
| `compact-inject.ts` | PreCompact | Precomputes context from transcript, caches to hook state |
| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
| `user-prompt-submit.ts` | UserPromptSubmit | Calls `buildSkillAdvisorBrief()` and emits JSON `additionalContext` when a brief is available |
| `session-stop.ts` | Stop (async) | Parses transcript for token usage, stores snapshots |
| `claude-transcript.ts` | (library) | JSONL transcript parser, token counting, cost estimation |
| `shared.ts` | (library) | Common utilities: stdin parsing, output formatting, timeout, logging |
| `hook-state.ts` | (library) | Per-session state management at temp directory |

## 3. LIFECYCLE FLOW

```
PreCompact → cache context → SessionStart(compact) → inject cached context
SessionStart(startup) → prime session with overview
SessionStart(resume) → load prior session state
Stop → parse transcript, save token snapshot
```

## 4. REGISTRATION

Hooks registered in `.claude/settings.local.json`. Compiled JS at `dist/hooks/claude/`.

Advisor registration snippet:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the advisor path for the current process session.

## 5. DESIGN PRINCIPLE

Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
For packet work, the operator-facing recovery surface remains `/spec_kit:resume`, with continuity rebuilt from `handover.md -> _memory.continuity -> spec docs`.

The prompt-time advisor contract lives at `../../../references/hooks/skill_advisor_hook.md`.
