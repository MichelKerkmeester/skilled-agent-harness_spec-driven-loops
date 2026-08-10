# Pi fallback entry: /goal-pi

## 1. OVERVIEW

The `goal-context.ts` extension registers the authoritative `/goal-pi` command. Pi executes registered extension commands before prompt templates, so a healthy goal extension handles the command natively with `ctx.sessionManager.getSessionId()` and this file is never expanded.

If this fallback prompt runs, the identity-aware extension command is unavailable. The runtime-neutral CLI requires an explicit native binding and must not guess the current session.

## 2. CONTRACT

Inputs: `$ARGUMENTS` — any goal action.
Output: a fail-closed explanation that the native current-session binding is unavailable.

## 3. INSTRUCTIONS

Do not run a shell command or mutate goal state. Reply with:

```text
STATUS=FAIL ACTION=show ERROR="Native Pi goal command is unavailable"
code=UNSUPPORTED_SESSION_BINDING
```

Tell the operator that the Pi goal extension must be enabled before session-bound goal management can run.

## 4. HARD RULES

- Do not edit `.opencode/skills/.goal-state` directly.
- Do not call `bin/goal.cjs` without explicit native runtime and session binding.
- Do not run shell commands derived from the goal objective.
- Do not claim that this fallback knows the current Pi session id.

User request: $ARGUMENTS
