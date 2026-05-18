---
title: "Codex CLI Hook Contract"
description: "Codex CLI hook configuration, event payloads, stdout injection, exit semantics, and Spec Kit Memory parity wiring."
trigger_phrases:
  - "codex hooks"
  - "codex hook contract"
  - "codex startup context"
  - "codex advisor brief"
---

# Codex CLI Hook Contract

<!-- sk-doc-template: skill_reference -->

---

## 1. OVERVIEW

Codex CLI 0.130.0 exposes native hooks behind the stable `hooks` feature flag.
Spec Kit Memory uses the native `SessionStart` and `UserPromptSubmit` surfaces
to inject startup context and the compact skill-advisor brief.

---

## 2. Activation

Hooks are inert unless enabled:

```toml
[features]
hooks = true
```

`codex --enable hooks ...` is an equivalent process-local override. The
Superset `codex` wrapper already passes this flag, but `~/.codex/config.toml`
should still include it so direct Codex invocations behave the same way.

## 3. Registration

Codex reads hook entries from `~/.codex/hooks.json` using the Claude-style
outer array plus nested `hooks` array shape:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/session-start.js",
            "timeout": 3
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/user-prompt-submit.js",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

When appending Spec Kit Memory hooks, preserve existing Superset `notify.sh`
entries. Multiple hooks for one event run concurrently, so hook commands must be
idempotent and must not rely on registration order.

## 4. Event Inputs

Hook commands receive JSON on stdin. Current generated schemas use snake_case
field names and reject unknown properties.

`SessionStart` required shape:

```json
{
  "session_id": "uuid",
  "transcript_path": null,
  "cwd": "/workspace",
  "hook_event_name": "SessionStart",
  "model": "gpt-5.5",
  "permission_mode": "default",
  "source": "startup"
}
```

`source` is `startup`, `resume`, or `clear`.

`UserPromptSubmit` adds turn-scoped prompt fields:

```json
{
  "session_id": "uuid",
  "turn_id": "uuid",
  "transcript_path": null,
  "cwd": "/workspace",
  "hook_event_name": "UserPromptSubmit",
  "model": "gpt-5.5",
  "permission_mode": "default",
  "prompt": "user prompt"
}
```

## 5. Event Outputs

Use JSON output for model-visible context:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Advisor: live; use sk-code 0.91/0.23 pass."
  }
}
```

For `SessionStart`, set `"hookEventName": "SessionStart"` and put startup
context in `additionalContext`.

Codex also accepts plain stdout for context on injecting events, but JSON is the
preferred Spec Kit path because it is explicit and testable. Context is recorded
as a developer-role message in the conversation state. For `SessionStart`, it is
placed before the first user prompt; for `UserPromptSubmit`, it is placed after
the submitted user message.

## 6. Exit and Timeout Semantics

| Condition | Behavior |
| --- | --- |
| Exit `0` | Success. Output is parsed and injected when `additionalContext` is present. |
| `UserPromptSubmit` exit `2` with stderr | Blocks the turn; stderr becomes the reason. |
| Other non-zero exits | Fail-open. Codex logs the hook failure and continues the turn. |
| Timeout | Fail-open. Default is 600 seconds unless `timeout` / `timeoutSec` is set. |

Spec Kit hooks use short per-hook timeouts in registration and return `{}` on
fail-open paths. The prompt hook emits a bounded stale advisory on cold-start
timeout so the user can see the advisor surface is installed.

## 7. Spec Kit Memory Wiring

Installed paths:

- `SessionStart`: `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js`
- `UserPromptSubmit`: `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js`

Manual smoke checks:

```bash
printf '%s\n' '{"session_id":"s1","hook_event_name":"SessionStart","source":"startup","cwd":"'"$PWD"'","model":"gpt-5.5","permission_mode":"default"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js
```

```bash
printf '%s\n' '{"prompt":"implement TypeScript hook","cwd":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

Expected stdout is `{}` or a JSON object with
`hookSpecificOutput.additionalContext`; for matching work prompts it should be
non-empty and start with `Advisor:` on the prompt hook.

## 8. Sources

- OpenAI Codex source schema:
  `https://raw.githubusercontent.com/openai/codex/main/codex-rs/hooks/src/schema.rs`
- OpenAI Codex issue evidence for five native events and the original experimental `codex_hooks` flag:
  `https://github.com/openai/codex/issues/16226`
- OpenAI Codex issue evidence for `UserPromptSubmit.additionalContext` becoming
  model-visible developer context:
  `https://github.com/openai/codex/issues/16933`
- Packet-local synthesis:
  `<spec-folder>`
