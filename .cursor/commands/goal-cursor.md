---
description: Read a packet goal from Cursor; management stays unavailable without native session identity.
argument-hint: "packet <packet-path> | packet-log <packet-path> <item> | <state> | <evidence>   (any management action fails closed: no session identity)"
---

# /goal-cursor

## 1. PURPOSE

Cursor's `sessionStart` hook receives a native `session_id` and injects that session's bound packet goal. Cursor's prompt-command surface does not expose the same identity, so anything that binds or mutates a session goal is unsupported here. One thing needs no session: reading a packet's `goal.md`, which is a file in the repository. That read is allowed.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS`
- `packet <packet-path>`: print the packet's durable slice, frontmatter excluded, with its hash and size.
- `packet-log <packet-path> <item> | <state> | <evidence>`: append one progress row below the packet's log anchor through the locked append. A file write that needs no session.
- Anything else: `STATUS=FAIL ACTION=<action> ERROR="Cursor command lacks native session identity"` and `code=UNSUPPORTED_SESSION_BINDING`.

---

## 3. INSTRUCTIONS

1. If the first token of `$ARGUMENTS` is `packet` or `packet-log` and a path follows, run (substituting the action and, for `packet-log`, the quoted row):

```bash
node .opencode/hooks/goal/bin/goal.cjs packet <packet-path> --runtime cursor --session command-surface --workspace "$PWD"
```

Print the envelope verbatim. The `chat_slice` field is the text an operator sets; it never carries frontmatter.

2. For any other action, do not run tools or mutate goal state. Print:

```text
STATUS=FAIL ACTION=<action> ERROR="Cursor command lacks native session identity"
code=UNSUPPORTED_SESSION_BINDING
```

Explain that Cursor injection is session-scoped, that the bound packet goal is injected at session start, and that binding or setting must happen on a runtime whose command surface carries the session identity.

---

## 4. HARD RULES

- Do not edit `.opencode/skills/.state/goal` directly.
- Do not call `bin/goal.cjs` with a session action from this command; `packet` reads a file and `packet-log` appends one row, and neither binds anything.
- Do not run shell commands derived from the goal objective.
- Do not claim that `$ARGUMENTS` carries the current Cursor session id.
