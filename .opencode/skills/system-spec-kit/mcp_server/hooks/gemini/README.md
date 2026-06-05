---
title: "Gemini Hooks"
description: "Gemini CLI startup, compaction, and stop-hook support."
trigger_phrases:
  - "gemini hooks"
  - "gemini session prime"
---

# Gemini Hooks

> **DEPRECATED 2026-05-16.** This hook location is being migrated. The advisor-routing UserPromptSubmit hook now lives under `.opencode/skills/system-skill-advisor/hooks/` (compiled artifact at `.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/<runtime>/`). The code-graph SessionStart hook's compiled artifact is at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/<runtime>/session-start.js` (corrected 2026-05-27 — the earlier `system-code-graph/dist/system-spec-kit/...` artifact path was never built; `.devin/hooks.v1.json` was repointed to the real path in packet 029 phase 004). Update any runtime config (e.g. `.devin/hooks.v1.json`, Claude `settings.local.json` hooks, Codex `config.toml` hooks, Gemini CLI hook config) before 2026-08-16. After that date this location may be removed without further notice. See `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` §3 for migration tracker.

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

The Gemini hook adapters are retained for operators who wire Gemini CLI hooks
outside this repository. The repo no longer ships a project-level Gemini hook
registration file. The advisor brief, startup brief, post-compaction recovery,
and session-end persistence each own a dedicated subsection below with its own
smoke command. Run smoke checks from the repository root after `npm run build`.

Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` to skip the advisor path for the
current process session. The full contract lives at
`../../../references/hooks/skill_advisor_hook.md`.

### SessionStart Registration

Gemini fires `SessionStart` for each new, resumed, or cleared session. The
hook delivers the startup brief via `hookSpecificOutput.additionalContext`,
branching on the `source` field (`startup` | `resume` | `clear`). A
`source: "compact"` dispatch is supported defensively in case `BeforeAgent`
injects a one-shot compact recovery — Gemini does not currently emit a
native `PreCompress` source for `SessionStart`.

```json
{
  "hooksConfig": { "enabled": true },
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "name": "speckit-session-prime",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js'",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

Smoke check:

```bash
printf '%s' '{"source":"startup","session_id":"smoke","cwd":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js
```

Expected stdout contains a JSON object with non-empty
`hookSpecificOutput.additionalContext` carrying a `Session Context` section
(or fallback text when the startup brief module is unavailable).

### BeforeAgent Registration (Advisor)

`BeforeAgent` is Gemini's prompt-time surface. The advisor hook calls
`buildSkillAdvisorBrief()` and emits
`hookSpecificOutput.additionalContext` only when the renderer returns a
brief; otherwise it returns `{}` so Gemini appends nothing.

```json
{
  "hooks": {
    "BeforeAgent": [
      {
        "hooks": [
          {
            "name": "speckit-user-prompt-advisor",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js'",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

Smoke check:

```bash
printf '%s' '{"prompt":"smoke","cwd":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js
```

Expected stdout is either an empty `{}` (no brief rendered) or a JSON
object whose `hookSpecificOutput.additionalContext` contains the rendered
advisor brief.

### Compact Registration (BeforeAgent One-Shot)

Gemini does not expose a `PreCompress` event with a session-prime
`compact` source. Post-compaction recovery is delivered through
`compact-inject.ts`, registered as a second `BeforeAgent` entry. It checks
the per-session compact-prime cache, validates TTL plus semantic guard,
and injects the wrapped payload exactly once before clearing the cache.
Subsequent `BeforeAgent` invocations are no-ops until a new
PreCompress-equivalent caches a payload.

```json
{
  "hooks": {
    "BeforeAgent": [
      {
        "hooks": [
          {
            "name": "speckit-compact-inject",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js'",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

Co-locate this entry in the same `BeforeAgent` array as
`speckit-user-prompt-advisor`; both hooks fail open and return early when
their cache or advisor inputs are missing, so order is not load-bearing.

Smoke check (no cached payload — exits silently):

```bash
printf '%s' '{"transcript_path":"/tmp/missing-transcript.jsonl","cwd":"'"$PWD"'","session_id":"smoke"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js
```

Expected stdout is empty when no compact-prime cache exists for the
session. When a cache exists and is fresh, stdout contains
`hookSpecificOutput.additionalContext` with the wrapped recovered payload
plus recovery instructions, and the cache is cleared after the write.

### SessionEnd Registration

`SessionEnd` runs `session-stop.ts`, which persists session state and
auto-detects the active spec folder by scanning the transcript for
`.opencode/specs/<folder>/<child>/` paths. Transcripts larger than 5 MB
are skipped to prevent OOM. A separate `--finalize` mode (no stdin
required) cleans state files older than 24 hours.

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "hooks": [
          {
            "name": "speckit-session-stop",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/session-stop.js'",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

Smoke check:

```bash
printf '%s' '{"cwd":"'"$PWD"'","session_id":"smoke","reason":"exit"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/session-stop.js
```

Expected behavior: hook persists state for `session_id` and exits 0; no
stdout payload is required by `SessionEnd`. The `--finalize` cleanup pass
runs as `node .../session-stop.js --finalize` without stdin.

## 3. RELATED

- `../README.md`
- `../claude/README.md`
- `../codex/README.md`
