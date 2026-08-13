---
title: "GOAL PROMPTING — Runtime-Specific Native and Session-Bound Surfaces"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-08-10"
last_confirmed_source: "session-isolation source, registration, and test reconciliation"
triggerPhrases:
  - /goal
  - /opencode_goal
  - /goal_opencode
  - /goal-opencode
  - /goal-opencode
  - goal prompt
  - session goal
  - set goal
  - mk_goal
  - mk-goal
  - active goal
  - goal plugin
---

# Goal Prompting — Runtime-Specific

## 1. OVERVIEW

This reference routes goal requests to the runtime surface that can prove current-session
identity. It prevents native features, OpenCode plugin tools, and scoped Pi/Cursor state
from being treated as one interchangeable global goal.

## 2. RULE

When operating as **Claude Code** and the user says "/goal" or asks to set/manage a
session goal, do not route through the OpenCode `mk-goal` plugin command. The filtered
`.claude/commands` discovery tree must not expose `.opencode/commands/goal-opencode.md`.
Use a Claude-native goal surface only after the live runtime confirms one exists; this
repository does not prove that product capability.

## 3. CROSS-RUNTIME ROUTING

The runtime-neutral core is safe only where the runtime supplies a native current-session
identity. It keys state by workspace, runtime, and native session id; it has no default
identity and never reads the legacy singleton as an active fallback.

- **Pi:** the extension binds lifecycle events and its registered `/goal-pi` command to
  `ctx.sessionManager.getSessionId()`. The prompt-template fallback never calls the CLI.
- **Cursor:** the `sessionStart` adapter binds `session_id`, with `conversation_id` as the
  documented fallback. `/goal-cursor` management is unsupported because prompt commands
  do not receive that hook identity.
- **OpenCode:** use the separate native `mk-goal` plugin and `/goal-opencode` command.
- **Claude Code:** no repository adapter or goal command is provided. A separate native
  feature is usable only when the live runtime exposes and documents it.
- **Codex:** no goal adapter or management command is registered.

The shared CLI preserves the base action envelope, requires explicit `--runtime`,
`--session`, and workspace context for current-session actions, and exposes aggregate-only
diagnostics plus explicit legacy inspect/migrate/archive actions. Full contract:
[`goal-plugin.md`](../../../hooks/goal/goal-plugin.md) and
[`README.md`](../../../hooks/goal/README.md).

## 4. WHY

The runtimes expose different identity and lifecycle APIs. Treating all of them as one
global goal surface previously allowed one session to replace or inject another session's
objective. Runtime-bound routing keeps the identity source explicit: OpenCode owns its
plugin, Pi supplies a verified extension session id, Cursor supplies identity only to its
hook, and unsupported or unverified runtimes receive no guessed binding.

## 5. HOW TO APPLY

1. In a Claude Code session, confirm the live runtime's available commands before using
   any native goal feature. Never substitute the repository's OpenCode command.
2. In an OpenCode session (or when explicitly targeting the OpenCode plugin from any
   runtime), **check `.opencode/commands/goal-opencode.md` exists** before invoking it — it routes
   to `.opencode/plugins/mk-goal.js` via `mk_goal`/`mk_goal_status`, and only functions
   inside an actual OpenCode session.
3. In Pi, use the registered `/goal-pi` command only when the extension is enabled. In
   Cursor, do not bypass `/goal-cursor`'s unsupported response with an unbound shell call.
4. Never expect a bare `/goal` invocation to reach the OpenCode plugin, and always verify
   the live command and registration paths before relying on remembered documentation.

## 6. FAILURE MODE SIGNAL

If Claude Code attempts to call `mk_goal()`/`mk_goal_status()` and no such tool exists
in the toolset, STOP — this confirms the OpenCode plugin command was invoked from the
wrong runtime. Inspect the live Claude command surface; do not invent or retry a native
mechanism that has not been observed.
