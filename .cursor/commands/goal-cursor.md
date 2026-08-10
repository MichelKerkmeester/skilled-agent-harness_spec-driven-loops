---
description: Explain why Cursor goal management is unavailable without native current-session command identity.
argument-hint: "set <objective> [--budget N] | show | history | doctor | health | clear | complete | pause [reason] | resume"
---

# /goal-cursor

## 1. PURPOSE

Cursor's `sessionStart` hook receives a native `session_id` and can safely read that session's scoped goal. Cursor's prompt-command surface does not expose the same identity, so management is intentionally unsupported. Calling the global CLI without an explicit binding would reintroduce ambiguous ownership.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — any goal action.
**Output:** `STATUS=FAIL ACTION=show ERROR="Cursor command lacks native session identity"` and `code=UNSUPPORTED_SESSION_BINDING`.

---

## 3. INSTRUCTIONS

Do not run tools or mutate goal state. Print:

```text
STATUS=FAIL ACTION=show ERROR="Cursor command lacks native session identity"
code=UNSUPPORTED_SESSION_BINDING
```

Explain that Cursor injection is session-scoped, but management remains disabled until Cursor exposes the hook's native identity to commands.

---

## 4. HARD RULES

- Do not edit `.opencode/skills/.goal-state` directly.
- Do not call `bin/goal.cjs` without explicit native runtime and session binding.
- Do not run shell commands derived from the goal objective.
- Do not claim that `$ARGUMENTS` carries the current Cursor session id.
