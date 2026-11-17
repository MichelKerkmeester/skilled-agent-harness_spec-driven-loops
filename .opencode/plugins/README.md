---
title: "OpenCode Plugins: The Events They Answer and the Cores They Call"
description: "The local plugin entries OpenCode loads from this folder, the shared cores each entry calls, the switches that silence them and the suites that prove each one still registers."
trigger_phrases:
  - "OpenCode plugins"
  - "plugin entrypoints"
  - "OpenCode hook events"
---

# OpenCode Plugins: The Events They Answer and the Cores They Call

---

## 1. OVERVIEW

`.opencode/plugins/` holds the local plugins an OpenCode session loads. Each `.js` file at the top of the folder is one plugin. `opencode.json` names no plugin path, so the folder itself is the registration, and the subfolders hold no entries.

Every entry default-exports the object that `dualPlugin(id, server)` builds in `lib/v2-bridge.js`. `server` is the unchanged OpenCode 1 factory and `setup` is the OpenCode 2 leg. The folder is an ES module package, because `.opencode/package.json` sets `"type": "module"`.

An entry is a thin adapter that translates one OpenCode event into a call on a core outside this folder, with one exception. `opencode-goal.js` is a full plugin. It holds the goal state machine and its tools, and calls the goal helpers under `.opencode/hooks/goal/`.

The rule every entry keeps is silence on stdout, and on stderr outside two error paths named below. OpenCode paints plugin output onto the TUI prompt line. A finding reaches the session through `experimental.chat.system.transform` or through a tool return. A note with no reader there goes to a bounded log file in the workspace.

---

## 2. ARCHITECTURE

```text
╭───────────────────────────╮
│ OpenCode event or tool    │
╰─────────────┬─────────────╯
              ▼
┌───────────────────────────┐
│ lib/v2-bridge.js setup    │
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ the entry's v1 factory    │
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ the shared core           │
└─────────────┬─────────────┘
              ▼
╭───────────────────────────╮
│ refusal, finding or none  │
╰───────────────────────────╯
```

Runtime direction: host ───▶ `setup` ───▶ `server` ───▶ core.

The bridge carries the transport for every entry. When an entry registers an event hook, the bridge subscribes to the session event stream for it, turns the rest of the v1 factory's hooks into OpenCode 2 registrations, and returns the cleanup function that disposes them. It also renames `shell` to `bash` and `subagent` to `task` before a v1 hook reads them, and it aliases `session.execution.succeeded` to `session.idle` and `session.compaction.ended` to `session.compacted`. A hook key it cannot map is listed in `cleanup.skippedKeys` rather than dropped in silence.

The architecture note covers the synthesized `session.created` and the message events the bridge fills for v1 plugins. It also lists the OpenCode 1 features with no OpenCode 2 equivalent. Read [the architecture note](./ARCHITECTURE.md) before changing the bridge.

---

## 3. DIRECTORY TREE

```text
.opencode/plugins/
+-- README.md                             # this index
+-- ARCHITECTURE.md                       # the dual export and the bridge limits
+-- <plugin>.js                           # one entry file per row in the entry map
+-- lib/                                  # helpers the entries import, never entries
|   +-- classifier-injection-screen-core.js
|   +-- completion-sentinel-core.js
|   +-- opencode-goal-core.js
|   +-- opencode-message-identity.js
|   +-- sk-code-post-edit-quality-core.js
|   +-- skill-advisor-render.js
|   +-- tool-identity.js
|   `-- v2-bridge.js
`-- tests/
    +-- README.md                         # what each suite pins
    +-- plugin-inventory.json             # the exceptions and the known event names
    +-- helpers/                          # shared fixtures
    `-- *.test.cjs                        # the regression suites
```

---

## 4. ENTRY MAP

One row per file at the top of the folder. The Event column names the hook the entry registers. The Real file or core column names the code that makes the decision, and the path is relative to this folder unless it starts with a dot.

| Entry | Kind | Event | Real file or core | Effect |
|---|---|---|---|---|
| `ask-surface-guard.js` | Thin adapter | `event` (`session.idle`) | `../hooks/ask-surface-guard/lib/ask-surface-core.cjs` | Sends a finished turn back once through `session.promptAsync` when the turn ends in a typed option menu and called no `question` tool. |
| `classifier-injection-screen.js` | Thin adapter | `tool.execute.after` for `webfetch`, `experimental.chat.system.transform` | `../hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs` | Screens fetched text for instructions aimed at the agent, buffers up to 20 advisories per session and drains them on the next transform. |
| `cli-dispatch-audit.js` | Thin adapter | `tool.execute.before` and `tool.execute.after` for `bash` | `../hooks/cli-dispatch/lib/dispatch-audit.mjs` | Before blocks a dispatch that breaks a hard rule in the target skill's `SKILL.md` by throwing. After appends one redacted audit line to a JSONL log. |
| `codex-hooks-watchdog.js` | Thin adapter | `event` (`session.created`) | `.skilled/bin/install-codex-hooks.mjs --check` | Records Codex hook drift in `.skilled/logs/codex-hooks-watchdog.log`. The guarded session never changes. |
| `decision-capture.js` | Thin adapter | `tool.execute.after` for `question`, `experimental.chat.system.transform` | `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Queues each answered question under the key the save-time sweep uses, then adds one system line while answers still wait for a decision record. |
| `env-secret-guard.js` | Thin adapter | `tool.execute.before`, `tool.execute.after`, `tool` | `../hooks/env-secret-guard/lib/env-secret-guard.cjs` | Refuses a dotenv read or write by throwing, takes a dotenv value out of a later result, and registers the `env_secret_*` tools that never return a value. |
| `mcp-route-guard.js` | Thin adapter | `tool.execute.before` | `../hooks/mcp-route-guard/lib/mcp-route-guard.cjs` | Appends one advisory to a bounded rotated log when a native MCP call has a Code Mode manual for its family. This entry never refuses. |
| `overlay-guard.js` | Thin adapter | `tool.execute.before` for `write`, `edit`, `multiedit`, `patch` and `apply_patch` | `../hooks/overlay-guard/lib/overlay-guard.cjs` | Refuses a write to a file a vendored tree's overlay owns, and names the overlay file to edit instead. A write it cannot judge is allowed. |
| `opencode-goal.js` | Full plugin | `event` (session, message, permission and question types), `experimental.chat.system.transform`, `tool` | Its own state machine, plus the helpers in `../hooks/goal/lib/` | Holds a text goal or binds a session to a packet `goal.md` and injects the objective slice. Registers `opencode_goal` and `opencode_goal_status`. |
| `session-cleanup.js` | Thin adapter | `event` (`session.created`, `session.deleted`), `experimental.chat.system.transform`, `dispose` | `.skilled/scripts/session-cleanup.sh` and the guard scripts in `.skilled/bin/` | Runs the bounded startup guards, reports their warnings once, then runs teardown when the host unloads the plugin. |
| `session-handover.js` | Thin adapter | `event` (session and message types), `experimental.chat.system.transform`, `tool.execute.before` for `question` | `../hooks/session-handover/lib/nudge.cjs` | Pushes the fill nudge, seeds a relaunched session from its open note, arms the relaunch record on idle and refuses a `question` dialog while that record can still arm. |
| `sk-code-post-edit-quality.js` | Thin adapter | `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform` | `../hooks/post-edit-quality/lib/post-edit-router.cjs` | Stashes the edited path by callID, runs the router once the edit has landed and drains its findings into the next transform. |
| `sk-git-message-gate.js` | Thin adapter | `tool.execute.before` for `bash` | `../skills/sk-git/scripts/hooks/git-message-gate.mjs` | Refuses a commit message, PR description or branch name that breaks the repository's own templates. It has no kill switch. |
| `sk-git-preflight-advisory.js` | Thin adapter | `tool.execute.before` for `bash`, `experimental.chat.system.transform` | `../skills/sk-git/scripts/lib/git-rule-checks.mjs` | Buffers up to 20 Git advisories and drains them into the next transform. The command still runs. |
| `system-completion-sentinel.js` | Thin adapter | `event` (`session.created`, `session.idle`) | `lib/completion-sentinel-core.js` | Resolves the last assistant text through `ctx.client.session.messages()`, checks a completion claim against its packet and writes one advisory line. |
| `system-deep-loop-guard.js` | Thin adapter | `event` (`session.created`), `tool.execute.before` for `task` | `../hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs` | Flags a Deep Route mode mismatch and a repeated dispatch to the same loop executor, then sweeps stale guard state at startup. |
| `system-dist-freshness-guard.js` | Thin adapter | `tool.execute.before`, `event` (`session.created`, `session.deleted`), `experimental.chat.system.transform` | `../skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | Names each package whose compiled output is stale, in system context and in a bounded log. |
| `system-skill-advisor.js` | Thin adapter | `experimental.chat.system.transform`, `event`, `tool` | `../bin/skill-advisor.cjs`, which runs the `system-skill-advisor` core | Injects the routing brief from a prompt cache, spawns the advisor only on a cache miss and exposes `spec_kit_skill_advisor_status`. |
| `system-spec-gate.js` | Thin adapter | `experimental.chat.system.transform`, `tool.execute.before`, `event` | `../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Opens the session gate on mutation intent, relays the deferral once and records each open-gate mutation. It denies only with a switch. |
| `system-speckit-completion.js` | Thin adapter | `tool` | `../skills/system-spec-kit/runtime/cli/lib/completion-state.cjs` | Registers `system_speckit_completion`, which returns one merged payload: the inferred level with its checklist evidence gaps, plus the placeholder percentage. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | An entry imports the bridge and the core it adapts. A tool definition also comes through `lib/tool-identity.js`. `lib/` holds shared helpers and `tests/` holds the suites. Neither one is an entry. |
| Ownership | Transport lives here. Policy lives in the core. A rule that should hold on another runtime changes in the core, not in this folder. |
| Failure | Advisory checks fail open, so a missing payload or an internal error becomes a no-op, as does a subprocess timeout. These entries refuse by default, by throwing from a hook: `cli-dispatch-audit.js` for a hard-rule dispatch, `env-secret-guard.js` for a dotenv read or write, `overlay-guard.js` for an overlay-owned file, `session-handover.js` for a `question` dialog while the relaunch record can still arm, and `sk-git-message-gate.js` for a message or branch that breaks the templates. Two more refuse only with a switch: `system-deep-loop-guard.js` through `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` or `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`, and `system-spec-gate.js` through `SYSTEM_SPEC_GATE_ENFORCE=1`. The advisor is the one no-op exception. On a timeout or a parse failure it injects its fallback line instead of nothing. |
| Output | No entry writes to stdout. Two can write one stderr line: `opencode-goal.js` when `OPENCODE_GOAL_DEBUG` is set, and `system-skill-advisor.js` when its trusted-root rule module fails to load. A finding goes into system context or into a tool return. A note with no reader there goes to a bounded log under the checkout's log folder. |
| Bounded | Every subprocess timeout and pending buffer carries a limit, as does each log file. The advisor's prompt cache carries a TTL and an entry count. |
| Tests | The suites read the folder instead of a hand-written list, so a new file is covered the moment it lands. |

---

## 6. CONFIGURATION

Every entry is on by default except `session-handover.js`. A switch is truthy as `1`, `true`, `yes` or `on`, in any case. The resolver reads the live environment first and the config file second.

| Switch | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master. Silences every entry that reads `hook-flags.cjs`, and `env-secret-guard.js` through its own core, from the environment only. `sk-git-message-gate.js` ignores it. |
| `SYSTEM_<CONCERN>_DISABLED=1` | One concern, in the default shape. `SYSTEM_SPEC_GATE_DISABLED` and `SYSTEM_SKILL_ADVISOR_DISABLED` follow it. |
| `OPENCODE_GOAL_DISABLED=1` | The goal plugin. `OPENCODE_GOAL_PLUGIN_DISABLED` still works. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | The dispatch audit. `SYSTEM_DISPATCH_DISABLED` still works and also silences the guard beside it. |
| `MCP_ROUTE_GUARD_DISABLED=1` | The MCP route advisory. |
| `CODEX_HOOKS_WATCHDOG_DISABLED=1` | The Codex hook watchdog. |
| `SK_GIT_PREFLIGHT_DISABLED=1` | The Git preflight advisory. |
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | The post-edit quality router. |
| `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` | The dotenv guard, read by its own core rather than the shared resolver. |
| `SYSTEM_SESSION_HANDOVER_OPENCODE_ENABLED=1` | Turns the hand-over plugin on for OpenCode, which ships off. `SYSTEM_SESSION_HANDOVER_ENABLED` answers when the OpenCode switch is blank, and `SYSTEM_SESSION_HANDOVER_DISABLED=1` still wins. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Turns the spec-gate deny on. Without it the gate advises and records. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` | Refuses a Deep Route mode mismatch. Without it the guard only warns. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` | Refuses a repeated dispatch to the same loop executor. Without it the guard only warns. |

Set a switch inline for one command, or export it for a session. To keep it, persist it in `.opencode/hooks/hook-flags.env`. The env-secret guard is the exception, because it reads its switches from the environment only. Copy that file from `.opencode/hooks/hook-flags.env.example`, which is tracked while the copy is gitignored. The environment wins over the file, so a persisted default can still be overridden for one session. [The hooks index](../hooks/README.md) carries the full switch list across every runtime.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .opencode/plugins/tests/v2-registration.test.cjs .opencode/plugins/tests/plugin-inventory.test.cjs
```

Expected result: `ℹ pass 75`, `ℹ fail 0` and exit status 0. The first suite proves that every bridged entry returns a cleanup function and at least one OpenCode 2 registration. The second proves that every `.js` file in the folder is bridged or listed, and that every event name an entry compares against resolves through the bridge or appears in `tests/plugin-inventory.json`.

```bash
rc=0
for f in .opencode/plugins/*.js
do node --check "$f" || rc=1
done
echo "exit=$rc"
```

Expected result: one line, `exit=0`, with nothing printed above it. `node --check` reads syntax only and resolves no import.

```bash
node --test .opencode/plugins/tests/v2-bridge.test.cjs .opencode/plugins/tests/v2-hard-plugins.test.cjs
```

Expected result: `ℹ fail 0` and exit status 0, on a stub host context. These suites cover the bridge mapping and the plugins whose registration is hardest to fake.

---

## 8. RELATED

- [`ARCHITECTURE.md`](./ARCHITECTURE.md): the dual export, the bridge and the known limits.
- [`tests/README.md`](./tests/README.md): what each suite pins.
- [`tests/helpers/README.md`](./tests/helpers/README.md): the shared fixtures.
- [`../hooks/README.md`](../hooks/README.md): the hook cores, the switch index and the coverage matrix.
- [`../skills/`](../skills/): the skill trees the cores live under.
- [`../../opencode.json`](../../opencode.json): the runtime config, which names no plugin path.
