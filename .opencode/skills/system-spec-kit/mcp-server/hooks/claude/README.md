# Claude Code Hook Scripts


---

## 1. OVERVIEW

Hook scripts for Claude Code lifecycle events. These run as external Node.js processes triggered by Claude Code, not as MCP server modules.

## 2. SCRIPTS

| File | Hook Event | Behavior |
|------|-----------|----------|
| `compact-inject.ts` | PreCompact | Precomputes context from transcript, caches to hook state |
| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
| `user-prompt-submit.ts` | UserPromptSubmit | Thin process-boundary shim: spawns the compiled advisor hook at `system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js` and merges a warm code-graph status section into its `additionalContext` |
| `session-stop.ts` | Stop (async) | Parses transcript for token usage, stores snapshots |
| `completion-evidence-stop.cjs` | Stop (async) | Standalone completion-evidence sentinel, co-resident with `session-stop.ts` on the same Stop matcher; advises when a completion claim lacks packet evidence, never blocks |
| `claude-transcript.ts` | (library) | JSONL transcript parser, token counting, cost estimation |
| `true-citation-mining.ts` | (library) | Session-stop glue: mines the transcript for true-citation used/not-used pairs and persists them, flag-gated and fail-safe |
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
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js'",
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
For packet work, the operator-facing recovery surface remains `/speckit:resume`, with continuity rebuilt from `handover.md -> _memory.continuity -> spec docs`.

The prompt-time advisor contract lives at `../../../references/hooks/skill-advisor-hook.md`.
