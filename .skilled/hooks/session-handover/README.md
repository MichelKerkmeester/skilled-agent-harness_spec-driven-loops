---
title: "Session Handover Hook: Context-Limit Handoff and Fresh-Session Handover"
description: "Shared core, per-runtime adapters, CLI and skilled-loop wrapper that hand unfinished work to a fresh session in the same terminal when a runtime nears its context limit."
trigger_phrases:
  - "session handover hook"
  - "skilled-loop relaunch"
  - "context limit handoff"
  - "opencode session handover"
  - "opencode context nudge"
  - "opencode relaunch plugin"
---

# Session Handover: Carries Work to a Fresh Session

---

## 1. OVERVIEW

`session-handover/` can nudge a session near its configured context threshold. The session writes a handoff note and prepares a relaunch record. A matching runtime event arms that record. If the record is current, `skilled-loop` starts a fresh session with a claim seed.

The shared core in `lib/relaunch-core.cjs` checks notes and tracks relaunch state. Each automatic adapter uses it. `bin/session-handover.cjs` is the command-line entry.

The concern key is `session-handover`. Its global enable flag is `SYSTEM_SESSION_HANDOVER_ENABLED`. The repository-wide master switch is `SYSTEM_HOOKS_DISABLED`.

---

## 2. QUICK START

Start a supported session through `bash .skilled/bin/skilled-loop <runtime> [args...]`. The wrapper accepts `claude`, `pi`, `opencode`, `codex`, `cursor`, `devin` and `vibe`. It does not launch DSH.

Use the runtime's handoff command for a manual handoff. Cursor and DSH use `/speckit-handoff`. Devin uses `/speckit:handoff`. The [handoff command](../../commands/speckit/handoff.md) is the shared definition. Outside the loop, `prepare` prints a manual claim command.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PostToolUse`, `UserPromptSubmit`, `Stop`, `SessionStart`, `PreToolUse` | `claude/handover-context-nudge.mjs`<br>`claude/handover-stop-arm.mjs`<br>`claude/handover-compact-pointer.mjs`<br>`claude/handover-subagent-guard.mjs` | `.skilled/hooks/session-handover/claude/handover-context-nudge.mjs`<br>`.skilled/hooks/session-handover/claude/handover-stop-arm.mjs`<br>`.skilled/hooks/session-handover/claude/handover-compact-pointer.mjs`<br>`.skilled/hooks/session-handover/claude/handover-subagent-guard.mjs` | Adds nudge or claim context. Stop arms the record. PreToolUse can deny a guarded call. |
| Codex | `UserPromptSubmit`, `PostToolUse`, `Stop`, `SessionStart` | `codex/handover-prompt-seed.mjs`<br>`codex/handover-context-nudge.mjs`<br>`codex/handover-stop-arm.mjs`<br>`codex/handover-compact-pointer.mjs` | `.skilled/hooks/session-handover/codex/handover-prompt-seed.mjs`<br>`.skilled/hooks/session-handover/codex/handover-context-nudge.mjs`<br>`.skilled/hooks/session-handover/codex/handover-stop-arm.mjs`<br>`.skilled/hooks/session-handover/codex/handover-compact-pointer.mjs` | Adds prompt and claim context. Stop arms the record. |
| Cursor | `/speckit-handoff` | `.cursor/commands/speckit-handoff.md` | `.skilled/commands/speckit/handoff.md` | Runs the manual handoff command. No automatic adapter. |
| Devin | `/speckit:handoff` | `.skilled/commands/speckit/handoff.md` | `.skilled/commands/speckit/handoff.md` | Runs the manual handoff command. No automatic adapter. |
| OpenCode | Plugin events | `opencode/session-handover.js` | `.opencode/plugins/session-handover.js` | Adds nudge or claim text to the system context. It refuses the `question` tool while the record can still arm. |
| Pi | `message_end`, `before_agent_start`, `turn_end`, `agent_end`, `agent_settled`, `agent_start`, `tool_call`, `session_compact` | `pi/session-handover.ts` | `.skilled/hooks/session-handover/pi/session-handover.ts` | Adds context and can steer a running turn. The `agent_settled` event arms the record. A question tool is refused while it can still arm. |
| DSH | `/speckit-handoff` | `.dsh/prompts/speckit-handoff.md` | `.dsh/prompts/speckit-handoff.md` | Points to the shared handoff command. No automatic adapter. |
| Vibe | `pre_agent`, `post_agent`, `post_tool` | `vibe/handover-parts.mjs` | `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Adds context before agent work and after tool calls. Post-agent can arm the record. |

Claude registers its hooks in `.claude/settings.json`. Codex registers in `.codex/hooks.json`. Cursor's command entry is the symlink `.cursor/commands/speckit-handoff.md`. The file `.cursor/hooks.json` has no session-handover adapter. Devin has no session-handover entry in `.devin/hooks.v1.json`. OpenCode loads its plugin from the `.opencode/plugins/` glob. Pi's extension entry is `.pi/extensions/session-handover.ts`. DSH's prompt lives at `.dsh/prompts/speckit-handoff.md`. The bundle in `.dsh/plugins/repo-guards/index.mjs` is separate and does not register session handover. Vibe registers lifecycle composers in `.vibe/hooks.toml`. They call `vibe/handover-parts.mjs` through the session-lifecycle scripts.

Claude and Codex exit 0 with no envelope on quiet paths. Their Stop hooks may print a deferral message when they cannot arm. Pi and OpenCode catch handler errors and return without handover context. Vibe composers catch a failed handover part and continue with other turn parts.

---

## 4. DIRECTORY TREE

Main code paths:

```
session-handover/
+-- README.md
+-- bin/
|   `-- session-handover.cjs
+-- claude/
+-- codex/
+-- lib/
|   +-- nudge.cjs
|   `-- relaunch-core.cjs
+-- opencode/
|   `-- session-handover.js
+-- pi/
|   `-- session-handover.ts
+-- tests/
`-- vibe/
    `-- handover-parts.mjs
```

Command-only runtimes keep their entries outside this folder.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `bin/session-handover.cjs` | Command-line entry for the handoff protocol. |
| `lib/relaunch-core.cjs` | Checks notes and manages relaunch records. |
| `lib/nudge.cjs` | Chooses when to show a nudge and builds its text. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves concern flags and the master switch. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds the Claude and Codex adapter bindings. It also names the Pi extension. |

---

## 6. CONFIGURATION

Flags resolve from the environment or the optional `.skilled/hooks/hook-flags.env` file. An environment value takes precedence. With no enable flag set, Claude Code is on by default and other supported runtimes are off. Truthy values are `1`, `true`, `yes` or `on`, without case sensitivity.

| Switch | Effect |
|---|---|
| `SYSTEM_SESSION_HANDOVER_ENABLED` | Enables the concern across runtimes unless a runtime switch overrides it. |
| `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` | Enables or disables one runtime. `<RUNTIME>` is `CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR`, `DEVIN` or `VIBE`. |
| `SYSTEM_SESSION_HANDOVER_DISABLED` | Disables this concern even when an enable flag is set. |
| `SYSTEM_HOOKS_DISABLED` | Disables repository hooks across runtimes. |
| `SESSION_HANDOVER_THRESHOLD` | Context fill ratio for the first nudge. Defaults to `0.80` and accepts values above 0 through 1. |

---

## 7. VALIDATION

The session-handover Node tests and their commands are in the [test suite guide](./tests/README.md). The Pi extension suite is listed there too.

Run this enabled Claude adapter smoke check from the repository root:

```bash
SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED=1 node .skilled/hooks/session-handover/claude/handover-context-nudge.mjs < /dev/null
```

Expected result: no output on stdout or stderr. The command exits 0.

---

## 8. RELATED

- [Handoff protocol](./handoff-protocol.md): the note and relaunch flow.
- [Runtime behavior](./runtime-behavior.md): adapter behavior and the wrapper's runtime support.
- [State files](./state-files.md): relaunch records and note states.
- [Troubleshooting](./troubleshooting.md): refusal output and failure details.
- [Handoff command](../../commands/speckit/handoff.md): the shared manual entry.
