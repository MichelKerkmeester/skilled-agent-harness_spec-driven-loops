---
title: "OpenCode Plugin Entrypoints"
description: "JavaScript plugin entrypoints for context injection, lifecycle handling, policy guards, runtime tools and post-action checks. OpenCode discovers these via a flat glob over .opencode/plugins/, and each module default-exports the object `{ id, setup, server }`."
trigger_phrases:
  - "OpenCode plugins"
  - "plugin entrypoints"
  - "OpenCode hook events"
---

# OpenCode Plugin Entrypoints

> JavaScript plugin entrypoints for context injection, lifecycle handling, policy guards, runtime tools and post-action checks.

---

## 1. OVERVIEW

`.opencode/plugins/` contains the JavaScript modules OpenCode discovers as local plugins. Each module default-exports one plain object `{ id, setup, server }`: `server` is the OpenCode 1 entry and `setup` the OpenCode 2 entry. Source plugins build that object with `dualPlugin(id, server)` from `lib/v2-bridge.js`, so the v1 factory stays the single implementation and the bridge derives the v2 leg from it. OpenCode loads plugins by a flat glob over this folder (it does not recurse), so every loadable plugin lives directly here. The `lib/` and `tests/` subfolders are not plugin sources.

Every plugin here runs on both OpenCode majors. OpenCode 1 calls `server(input)` and OpenCode 2 calls `setup(ctx)`, and neither host calls the other's entry, so a plugin that exported only one entry would do nothing on the other host. All 17 files were verified on OpenCode 1.19.3 and OpenCode 2.0.32 on 2026-10-19: the doctor battery discovered all 17 on 1.19.3 and reported all 17 active on 2.0.32. [ARCHITECTURE.md](./ARCHITECTURE.md) explains the dual export, the bridge and what has no OpenCode 2 equivalent.

The directory inventory is authoritative for the auto-loaded plugin surface. Shared policy cores stay under their owning skill (`system-spec-kit`, `system-skill-advisor`, `sk-git`, `sk-code`, `sk-vision`, `system-completion`, `system-deep-loop`). Most files here are **transport adapters** that translate OpenCode events into those cores and keep terminal output out of the TUI. `opencode-goal.js` is the exception: it implements the goal state machine and goal tools itself and shares only selected helpers. The single shared boundary every plugin honors in normal operation: **never write to stdout or stderr**, because OpenCode overlays those onto the TUI prompt line and corrupts the interactive session. Findings are injected via `experimental.chat.system.transform`, returned from tool handlers or persisted to bounded workspace logs.

Most plugins honor a per-concern kill switch through the shared `hook-flags.cjs` resolver (`isHookEnabled('<concern>')`), plus the master `SYSTEM_HOOKS_DISABLED`. A disabled plugin stops its main work.

Most become full no-ops, while the goal tools and the advisor status tool stay registered and report that they are disabled. All advisory checks fail open.

Two plugins reject by default by throwing from `tool.execute.before`: `sk-git-message-gate.js` and the dispatch guard in `cli-dispatch-audit.js`. Other rejection is opt-in: `SYSTEM_SPEC_GATE_ENFORCE` for spec-gate deny, and `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` or `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` for the deep-loop guard, which otherwise only warns.

Three plugins are exceptions. `sk-git-message-gate.js` has no switch, because the commit, PR and branch rules carry no bypass on any surface. `system-speckit-completion.js` reads only its own `SYSTEM_SPECKIT_COMPLETION_DISABLED=1`, so the master switch leaves its tool registered. `sk-vision.js` reads no switch on OpenCode: its `/vision` command registers by default (on OpenCode 1 only the plugin option `enabled: false` drops it, and OpenCode 2 always registers it), and automatic image analysis and its tools are opt-in through `SK_VISION_AUTOINSPECT=1`.

---

## 2. WHAT'S HERE / INVENTORY

| File | Concern | Hook surface | Responsibility |
|---|---|---|---|
| `classifier-injection-screen.js` | `injection-screen` | `tool.execute.after` for `webfetch`, `experimental.chat.system.transform` | Screens fetched `webfetch` text for instructions aimed at the agent. Buffers up to 20 advisories per session and drains them on the next transform, the model call that reads the fetch result. Never writes stdout/stderr. |
| `cli-dispatch-audit.js` | `dispatch`, `dispatch-guard` | `tool.execute.before` and `tool.execute.after` for Bash | `tool.execute.before` blocks a CLI dispatch that breaks a hard rule declared in the target skill's `SKILL.md` by throwing, and fails open on its own errors. `tool.execute.after` records redacted dispatch telemetry after completed CLI calls, recognizes an `opencode` or `opencode2` invocation and appends a bounded audit record. |
| `codex-hooks-watchdog.js` | `codex-watchdog` | `event` (`session.created`) | Watches Codex hook installation and reports drift. Never affects the guarded session. |
| `mcp-route-guard.js` | `mcp-route-guard` | `tool.execute.before` | Advises when native MCP calls should use Code Mode. Persists to a bounded, rotated workspace log. |
| `opencode-goal.js` | `goal` | `event` (`session.created`/`status`/`idle`/`deleted`, `message.updated`/`message.part.updated`, `permission.asked`/`replied`, `question.asked`/`replied`/`rejected`), `experimental.chat.system.transform`, `tool` (goal tools) | Holds a text goal or binds a session to a packet `goal.md` and injects the objective slice built from it (via `../hooks/goal/lib/goal-slice.cjs`). Largest hand-written plugin, second only to the compiled sk-vision bundle. Owns the goal state machine, supervisor, continuation, capabilities and the goal tool surface including `bind`, `resent` and `packet`. |
| `session-cleanup.js` | `session-cleanup` | `event` (`session.created`/`deleted`), `experimental.chat.system.transform`, `dispose` | Performs bounded session and host cleanup. Startup guards and teardown cleanup. Reaps MCP helper processes via `session-cleanup.sh`. |
| `session-relaunch.js` | `session-relaunch` | `event` (`message.updated`/`message.part.updated`/`session.idle`), `experimental.chat.system.transform` | Tracks usage and seed text. Inside `skilled-loop`, while this session has no matching relaunch record, it pushes the active nudge on every request. Outside the loop it never nudges, because only the wrapper can relaunch the session. While a matching seed's note is open, it injects the seed on each request, then a claimed reminder once the note is claimed. It arms the record on `session.idle`. The plugin runs the detached killer with `node` because OpenCode hosts plugins on Bun. |
| `sk-code-post-edit-quality.js` | `post-edit-quality` | `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform` | Runs bounded post-edit quality checks. `tool.execute.before` stashes the edited path keyed by callID, because the after hook has no file path. `tool.execute.after` runs the router core. Findings drain on the next transform and are recorded to a workspace log. |
| `sk-git-message-gate.js` | `git-message-gate` (no kill switch) | `tool.execute.before` for `bash` | Refuses a `git commit` message, `gh pr` description or new branch name that breaks the repository's own sk-git templates by throwing. Allows what the shared gate cannot parse, but refuses when the repository's rules exist and cannot be read. It has no kill switch, because the commit and push rules carry no bypass on any surface. |
| `sk-git-preflight-advisory.js` | `git-preflight` | `tool.execute.before` for `bash`, `experimental.chat.system.transform` | Advises on Git command scope before execution. Buffers at most 20 advisory events and drains them on the next transform. Never prints. |
| `sk-vision.js` | `SK_VISION_AUTOINSPECT` (opt-in, no kill switch) | `command.execute.before` (`/vision`). With `SK_VISION_AUTOINSPECT=1` also `event`, `chat.message`, `tool` (13 `sk_vision_*` tools) and `dispose` | Symlink → `../skills/sk-vision/vision-runtime/dist/plugin.js`. Local vision adapter: OCR, inspect, detect, pixel analysis. The compiled build default-exports its own `{ id, setup, server }` without the bridge. On OpenCode 2, `setup` registers `/vision` through `ctx.command.transform`, image inspection through the prompt hook and the tools through `ctx.tool.transform`. Auto-inspect uses a 2s grace and awaits the full analysis only for a listed text-only model. |
| `system-completion-sentinel.js` | `completion` | `event` (`session.created`/`idle`) | Checks completion evidence at session lifecycle points. On `session.idle`, resolves completion state via `ctx.client.session.messages()` (guarded, fail-open). Throttled-sweeps the shared state dir on `session.created`. |
| `system-deep-loop-guard.js` | `task-dispatch` | `event` (`session.created`), `tool.execute.before` | Checks deep-loop Task dispatches and repeat handoffs. Sweeps stale loop-guard state on `session.created`. |
| `system-dist-freshness-guard.js` | `dist-freshness` | `tool.execute.before`, `event` (`session.created`/`deleted`), `experimental.chat.system.transform` | Reports stale compiled outputs and invalidates diagnostics. Short-circuits the whole plugin at factory entry when disabled. |
| `system-skill-advisor.js` | `skill-advisor` | `experimental.chat.system.transform`, `event`, `tool` (`spec_kit_skill_advisor_status`) | Injects skill-routing guidance per prompt and exposes advisor status. Spawns the advisor subprocess only on a cache miss, behind a TTL+LRU prompt cache with in-flight dedup. |
| `system-spec-gate.js` | `spec-gate` | `experimental.chat.system.transform`, `tool.execute.before`, `event` | Classifies and evaluates mutation-gate state. Classify best-effort fetches the last user message via `ctx.client`. Enforce throws `system-spec-gate:` on deny (OpenCode's deny signal). |
| `system-speckit-completion.js` | `speckit-completion` | `tool` (read-only completion evidence) | Exposes read-only completion evidence. Checks `core.DISABLED_ENV` directly at factory entry. |

---

## 3. SHARED LIB MODULES

`lib/` holds the modules the entry files import. None of them is a plugin source, and the loader never registers one on its own.

| File | Responsibility |
|---|---|
| `lib/v2-bridge.js` | Builds the dual export. `dualPlugin(id, server)` returns `{ id, setup, server }`: `server` is the unchanged OpenCode 1 factory, and `setup` maps its hooks (event stream, `tool.execute.before`/`after`, `experimental.chat.system.transform`, tool definitions) onto OpenCode 2 registrations, then returns a cleanup function. Hook keys the bridge does not map are reported through `cleanup.skippedKeys`. |
| `lib/tool-identity.js` | Identity helper for tool definitions. `tool(definition)` returns the definition unchanged, and `tool.schema` is zod, so one definition serves the v1 `tool` hook and the bridge's v2 tool registration. |
| `lib/opencode-message-identity.js` | Stable transform identity and dedup state. `system-skill-advisor.js` uses it when `deduplicateTransforms` is on. |
| `lib/skill-advisor-render.js` | Advisor fallback and compiled-route renderers, shared by the advisor plugin and its tests. |
| `lib/classifier-injection-screen-core.js` | Constants and the session-id resolver for the injection-screen plugin. |
| `lib/completion-sentinel-core.js` | Re-export of the completion-evidence sentinel core under `skills/system-spec-kit`. |
| `lib/opencode-goal-core.js` | WeakMap registry that binds a goal plugin module's helpers to its server, so both entries read the same state. |
| `lib/sk-code-post-edit-quality-core.js` | Constants, the callID-to-filePath correlation map and the finding formatter for the post-edit-quality plugin. |

The bridge mapping is exercised against stub contexts in the test suites. The doctor battery confirms that all 17 plugins load on 1.19.3 and show active on 2.0.32. Live delivery of each bridged hook on a running OpenCode 2 host is not verified plugin by plugin.

---

## 4. TEST SUITES

`tests/` holds the regression suites for the entry files. They run on the Node built-in test runner with hermetic stubs. The v2 suites are:

| File | Covers |
|---|---|
| `tests/v2-bridge.test.cjs` | The bridge itself: event aliases and mappings, the v1 client adapters, hook registration and cleanup, tool result conversion and the `tool` identity contract. |
| `tests/v2-hard-plugins.test.cjs` | Export and v2 registration checks for five plugins (`system-completion-sentinel`, `system-spec-gate`, `system-skill-advisor`, `opencode-goal`, `sk-vision`) through a stub v2 context, plus behavior cases for the first four. sk-vision's v2 behavior is tested in its own `bun test` suite under `../skills/sk-vision/vision-runtime/`. |
| `tests/v2-registration.test.cjs` | The dual export shape, at least one v2 registration and the cleanup function for 12 plugins. |

Between them, `tests/v2-registration.test.cjs` and `tests/v2-hard-plugins.test.cjs` cover all 17 plugins. Both lists are written out by hand, so a new plugin is covered only once it gets a row in one of them.

The remaining `*.test.cjs` files cover v1 behavior and adjacent contracts. `tests/README.md` indexes the suites, though it does not yet list `session-relaunch.test.cjs`, and `tests/helpers/` holds the shared fixtures.

---

## 5. DIRECTORY TREE

```text
plugins/
+-- README.md                              # this index
+-- ARCHITECTURE.md                        # dual-version design, bridge and limits
+-- classifier-injection-screen.js
+-- cli-dispatch-audit.js
+-- codex-hooks-watchdog.js
+-- mcp-route-guard.js
+-- opencode-goal.js
+-- session-cleanup.js
+-- session-relaunch.js
+-- sk-code-post-edit-quality.js
+-- sk-git-message-gate.js
+-- sk-git-preflight-advisory.js
+-- sk-vision.js                           # symlink -> ../skills/sk-vision/vision-runtime/dist/plugin.js
+-- system-completion-sentinel.js
+-- system-deep-loop-guard.js
+-- system-dist-freshness-guard.js
+-- system-skill-advisor.js
+-- system-spec-gate.js
+-- system-speckit-completion.js
+-- lib/
|   +-- classifier-injection-screen-core.js
|   +-- completion-sentinel-core.js
|   +-- opencode-goal-core.js
|   +-- opencode-message-identity.js
|   +-- sk-code-post-edit-quality-core.js
|   +-- skill-advisor-render.js
|   +-- tool-identity.js
|   `-- v2-bridge.js
`-- tests/
    +-- README.md
    +-- helpers/
    +-- v2-bridge.test.cjs
    +-- v2-hard-plugins.test.cjs
    +-- v2-registration.test.cjs
    `-- *.test.cjs                         # the remaining plugin suites
```

---

## 6. KEY FILES

| File | Responsibility |
|---|---|
| `opencode-goal.js` | The largest plugin. Owns the goal state machine, supervisor, continuation, capabilities and the goal tool surface. Hooks session, message, permission and question events, `experimental.chat.system.transform` and a family of goal tools. |
| `system-skill-advisor.js` | Spawns the skill-advisor subprocess on a prompt-cache miss, manages a TTL+LRU prompt cache with in-flight dedup, integrates transform-dedup where the opt-in same-message dedup bases its decision on the full advisor block before directive-lifecycle reduction and suppresses a repeated transform for the same message and exposes `spec_kit_skill_advisor_status`. |
| `system-spec-gate.js` | Maps OpenCode's transport onto the runtime-neutral spec-gate core. Classify best-effort fetches the last user message via `ctx.client`. Enforce throws `system-spec-gate:` on deny. `event` sweeps, advances and evicts state. |
| `sk-code-post-edit-quality.js` | Correlates `tool.execute.before` file paths to `tool.execute.after` callIDs, runs the post-edit router core and drains findings on the next transform. |
| `lib/v2-bridge.js` | Builds the dual export for the 16 bridged plugins. `server` is the unchanged v1 factory, and `setup` maps its hooks onto OpenCode 2 registrations and returns a cleanup function. |
| `lib/tool-identity.js` | The `tool` identity helper. Returns a v1 tool definition unchanged and carries zod as `tool.schema`. |
| `lib/opencode-message-identity.js` | Shared stable transform identity and dedup state used by the advisor plugin. |

---

## 7. CONFIGURATION

Every plugin is enabled by default. Truthy disable values are `1`, `true`, `yes` and `on` (case-insensitive) for the shared resolver. Each plugin that honors a switch checks `isHookEnabled('<concern>')` at entry (some at factory entry, some per-hook) and stops its main work when disabled. Housekeeping can still run, such as the deep-loop guard's stale-state sweep on `session.created`. The three exceptions named in the overview do not.

| Variable | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables every plugin in this folder that reads `hook-flags.cjs`, along with every other repo hook. It does not reach `sk-git-message-gate.js`, `system-speckit-completion.js` or `sk-vision.js`. |
| Per-concern switch | The default name is `SYSTEM_<CONCERN>_DISABLED` (e.g. `SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED`). Six concerns use another canonical name: `OPENCODE_GOAL_DISABLED`, `CLI_DISPATCH_AUDIT_DISABLED`, `MCP_ROUTE_GUARD_DISABLED`, `CODEX_HOOKS_WATCHDOG_DISABLED`, `SK_GIT_PREFLIGHT_DISABLED` and `SK_CODE_POST_EDIT_QUALITY_DISABLED`. |
| Older aliases | `hook-flags.cjs` still honors older names, e.g. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` and `OPENCODE_GOAL_PLUGIN_DISABLED`. See each plugin's own README. |
| `SK_VISION_AUTOINSPECT=1` | Turns on sk-vision's automatic image analysis and its 13 tools on both OpenCode versions. Off by default. |

Optional tuning: `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` (default 3000, owned by `system-skill-advisor`), `SYSTEM_OPENCODE_TRANSFORM_DEDUP=1` (opt-in transform dedup for the advisor plugin), plus per-plugin cache/budget/timeout envs documented in each plugin's README.

Set a flag inline for one command, export it for a session or persist it in `.skilled/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session. Only switches read through `hook-flags.cjs` can be persisted there. `SK_VISION_AUTOINSPECT` is read from the environment only, and so is `SYSTEM_SPECKIT_COMPLETION_DISABLED` for `system-speckit-completion.js`, although the resolver also accepts that name from the file as an alias for the completion sentinel.

---

## 8. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Transport only | Plugin files own the OpenCode transport boundary. Shared policy and runtime-neutral logic belongs under the owning skill. |
| Dual export | Every plugin file default-exports one plain object `{ id, setup, server }`: `server` is the OpenCode 1 entry and `setup` the OpenCode 2 entry. `lib/` modules are shared helpers, never plugin sources. |
| No stdout/stderr | Plugins do not print to stdout or stderr in normal operation. The only writes are opt-in debug output, such as the goal plugin's debug env and `SK_VISION_DEBUG=1`. OpenCode overlays those onto the TUI prompt line and corrupts the interactive session. Findings go through `experimental.chat.system.transform`, tool returns or bounded workspace logs. |
| Fail-open | All advisory checks fail open. A missing payload, a subprocess timeout, a parse failure or any internal error resolves to a no-op, or for the read-only completion tool to a payload that marks the missing sections unavailable. The skill advisor is the exception to the no-op because on a subprocess timeout, a parse failure, a missing prompt or an internal error it injects its status-headed fallback (an `Advisor: outage (...)` or `Advisor: prompt skipped.` line above the directives block) and never blocks the prompt. The git message gate and the dispatch guard reject by default. Spec-gate rejection is opt-in through `SYSTEM_SPEC_GATE_ENFORCE`, and deep-loop guard rejection through `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` or `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`. |
| Kill-switch | Every plugin except the three named in the overview honors its per-concern kill-switch via the shared `hook-flags.cjs` resolver plus the master `SYSTEM_HOOKS_DISABLED`. A disabled plugin stops its main work, and the goal and advisor status tools stay registered to report that. Housekeeping such as the deep-loop guard's stale-state sweep can still run. |
| Bounded | Subprocess spawns, caches, pending-event buffers and workspace logs are all bounded (per-plugin limits documented in each plugin's README). |
| Tests | Plugin tests stay under `tests/`. |

---

## 9. HOOK MODEL

Plugin factories register some subset of:

- `tool`: tools exposed to the model (e.g. `spec_kit_skill_advisor_status`, the goal tools, the 13 `sk_vision_*` tools, the read-only completion-evidence tool).
- `tool.execute.before`: pre-tool evaluation (spec-gate enforce, dispatch guard, git message gate, git-preflight, mcp-route-guard, post-edit-quality path stash, deep-loop guard).
- `tool.execute.after`: post-tool evaluation (cli-dispatch-audit, post-edit-quality run, injection screen).
- `experimental.chat.system.transform`: per-turn system-context injection (advisor, spec-gate classify, goal, session-cleanup, session-relaunch nudge and seed, git-preflight drain, post-edit-quality drain, dist-freshness and injection-screen drain).
- `event`: lifecycle and activity handlers (`session.created`/`status`/`idle`/`deleted`/`resumed`/`compacted`/`compact`, `message.updated`/`message.part.updated`, the goal plugin's permission and question events, `server.instance.disposed`/`global.disposed`).
- `dispose`: teardown when the host unloads the plugin (session-cleanup and sk-vision when auto-inspect is on).

The bridge in `lib/v2-bridge.js` maps that set onto OpenCode 2 registrations: `event` to the event stream, `tool.execute.before`/`after` to the tool execute hooks, `experimental.chat.system.transform` to the session context hook and `tool` definitions to the tool transform. A key outside the set is reported through `cleanup.skippedKeys`.

One plugin in this repo registers keys outside that set: `sk-vision.js`'s `command.execute.before` hook for `/vision` and its `chat.message` hook, which inspects images when a prompt is submitted. sk-vision does not go through the bridge. On OpenCode 2 it owns `/vision` through `ctx.command.transform`. Its own `setup` entry runs the same check on OpenCode 2 through `ctx.session.hook("prompt")` and appends the evidence to the prompt text, when `SK_VISION_AUTOINSPECT=1` as on OpenCode 1. On OpenCode 2 a model not on the text-only list gets the 2-second grace, and a listed one waits for the full analysis. The 13 `sk_vision_*` tools register on both versions under the same gate: OpenCode 1 takes them from the `server` entry, and on OpenCode 2 the `setup` entry adds them through `ctx.tool.transform`, where the model reaches them through OpenCode 2's code-mode `execute` tool.

---

## 10. VALIDATION

Run the Node regression command from the repository root:

```bash
node --test .skilled/plugins/tests/*.test.cjs
```

Expected result: Node discovers every current CJS test file and reports the suite result. A failing test is a validation failure.

```bash
(
  rc=0
  for f in .skilled/plugins/*.js
  do node --check "$f" || rc=1
  done
  exit "$rc"
)
```

Expected result: exit status 0, with no syntax errors across every plugin. Any failing file makes the command exit 1. `node --check` checks syntax only and does not resolve imports.

Check both OpenCode versions with the doctor battery:

```bash
node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1
node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2
```

Expected result: each exits 0, reporting all plugin files discovered on OpenCode 1 and all active on OpenCode 2. The v2 run starts its own private server.

---

## 11. RELATED

- [`ARCHITECTURE.md`](./ARCHITECTURE.md): the dual-version design, the bridge, sk-vision's own path, the kill switches and the known limits.
- [`tests/README.md`](./tests/README.md): the plugin regression suites.
- [`tests/helpers/README.md`](./tests/helpers/README.md): the shared test helpers.
- [`../hooks/README.md`](../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix. Several plugins are mirrored there as the OpenCode adapter for their concern (`spec-gate`, `skill-advisor`, `git-preflight`, `git-message-gate`, `session-cleanup`, `injection-screen`).
- [`../skills/`](../skills/): the shared skill cores these plugins adapt.
