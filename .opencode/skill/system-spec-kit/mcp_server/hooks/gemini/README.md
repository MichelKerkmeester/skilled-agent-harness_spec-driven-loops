---
title: "Gemini Hooks"
description: "Gemini CLI startup, compaction, and stop-hook support."
trigger_phrases:
  - "gemini hooks"
  - "gemini session prime"
---

# Gemini Hooks

## 1. OVERVIEW

`hooks/gemini/` implements the Gemini CLI hook surface used by the package.

- `session-prime.ts` formats startup, resume, clear, and compact recovery context.
- `compact-inject.ts` prepares compaction-time recovery payloads.
- `user-prompt-submit.ts` runs the prompt-time skill-advisor hook and emits JSON `additionalContext` when the shared renderer returns a brief.
- `session-stop.ts` persists stop-hook session state.
- `compact-cache.ts` stores the short-lived compaction cache.
- `shared.ts` holds Gemini-specific stdin/stdout formatting helpers.

These hooks keep the canonical recovery chain aligned with `handover.md`, `_memory.continuity`, and packet docs.

## 2. HOOK REGISTRATION

Register startup, compact, stop, and advisor hooks in `.gemini/settings.json`:

```json
{
  "hooksConfig": {
    "enabled": true
  },
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "name": "speckit-session-prime",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js'",
            "timeout": 3000
          }
        ]
      }
    ],
    "BeforeAgent": [
      {
        "hooks": [
          {
            "name": "speckit-user-prompt-advisor",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js'",
            "timeout": 3000
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "name": "speckit-session-stop",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-stop.js'",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

For compact recovery, wire the Gemini compact/summary hook surface to:

```bash
node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js
```

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the advisor path for the current process session. The full contract lives at `../../../references/hooks/skill-advisor-hook.md`.

## 3. SMOKE EXAMPLES

Run these from the repository root after `npm run build`:

```bash
printf '%s' '{"source":"startup"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js

printf '%s' '{"prompt":"smoke","cwd":"'"$PWD"'"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js

printf '%s' '{"transcript_path":"/tmp/missing-transcript.jsonl","cwd":"'"$PWD"'"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js

printf '%s' '{"cwd":"'"$PWD"'","session_id":"smoke"}' \
  | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-stop.js
```

Session-prime and compact emit Gemini hook JSON with `hookSpecificOutput.additionalContext` when context is available. The advisor emits `{}` when no brief is rendered. Session-stop persists state and exits 0 for a valid smoke payload.

## 4. RELATED

- `../README.md`
- `../claude/README.md`
