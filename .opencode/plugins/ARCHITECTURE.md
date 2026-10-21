---
title: "Architecture: OpenCode plugins"
description: "Current architecture for the OpenCode plugin folder: one dual export per file, the bridge that maps the v1 hooks onto OpenCode 2, kill-switch integration and the verification gates."
trigger_phrases:
  - "opencode plugins architecture"
  - "opencode v1 v2 compatibility"
  - "dual plugin export"
  - "v2 bridge"
importance_tier: "important"
version: 1.0.0.0
---

# Architecture: OpenCode plugins

> The dual export and the v1-to-v2 bridge that let every plugin file run on OpenCode 1 and OpenCode 2.

---

## 1. OVERVIEW

`.opencode/plugins/` holds the plugin files that OpenCode discovers (17 on 2026-10-20) as local plugins. Every file runs on OpenCode 1 and OpenCode 2 because each one default-exports `{ id, setup, server }`, where `server` is the OpenCode 1 entry and `setup` is the OpenCode 2 entry, and a plugin that exported only one entry would be a silent no-op on the other host. The per-file inventory table lives in [README.md](./README.md) and is linked here rather than repeated.

The dual-version proof was captured on 2026-10-19 on OpenCode 1.19.3 (`opencode`, the `opencode-ai` package) and OpenCode 2.0.32 (`opencode2` launcher). The doctor battery discovered all 17 plugin files on OpenCode 1.19.3 and reported all 17 active on OpenCode 2.0.32.

### Architecture diagram

```text
┌────────────────────────────────────────────────────────────────┐
│ plugin file:  export default { id, setup, server }             │
└──────────┬────────────────────────────────┬────────────────────┘
           │                                │
           │ server(input)                  │ setup(ctx)
           ▼                                ▼
┌─────────────────────┐           ┌──────────────────────────────┐
│     OpenCode 1      │           │      lib/v2-bridge.js        │
│ calls server(input) │           │         setup(ctx)           │
│  and registers the  │           │  builds the v1-shaped input  │
│  returned v1 hooks  │           │ calls server(input) once     │
│       directly      │           │ and maps the returned hooks  │
└─────────────────────┘           └─────────┬────────────────────┘
                                            ▼
                                  ┌──────────────────────────────┐
                                  │   OpenCode 2 registrations   │
                                  │  ctx.event.subscribe         │
                                  │  ctx.tool.hook               │
                                  │  ctx.session.hook('context') │
                                  │  ctx.tool.transform          │
                                  └──────────────────────────────┘
```

The diagram shows the bridged plugins, every entry file except sk-vision. `sk-vision.js` exports its own `setup`, which registers its OpenCode 2 command without going through the bridge; with a kill switch set, that `setup` returns a no-op cleanup and registers nothing. It adds the prompt hook only when a project `/vision` template exists or auto-inspection is on (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:429-433`), and it adds the tools only with auto-inspection on (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:496-500`, Section 4).

---

## 2. PACKAGE TOPOLOGY

`lib/` holds the modules the entry files import and `tests/` holds the regression suites. Every entry file except sk-vision builds its export with `dualPlugin(id, server)` from `lib/v2-bridge.js`, which puts `lib/` on their load path.

```text
.opencode/plugins/
├── classifier-injection-screen.js   # every entry from here to system-speckit-completion.js is built with dualPlugin, each default-exporting { id, setup, server }
├── cli-dispatch-audit.js
├── codex-hooks-watchdog.js
├── mcp-route-guard.js
├── opencode-goal.js
├── session-cleanup.js
├── session-relaunch.js
├── sk-code-post-edit-quality.js
├── sk-git-message-gate.js
├── sk-git-preflight-advisory.js
├── system-completion-sentinel.js
├── system-deep-loop-guard.js
├── system-dist-freshness-guard.js
├── system-skill-advisor.js
├── system-spec-gate.js
├── system-speckit-completion.js
├── sk-vision.js               # the one unbridged entry, a symlink to ../skills/sk-vision/vision-runtime/dist/plugin.js
├── lib/                       # shared modules the entry files import, never plugin sources
│   ├── classifier-injection-screen-core.js
│   ├── completion-sentinel-core.js
│   ├── opencode-goal-core.js
│   ├── opencode-message-identity.js
│   ├── sk-code-post-edit-quality-core.js
│   ├── skill-advisor-render.js
│   ├── tool-identity.js
│   └── v2-bridge.js           # builds the dual export and maps the v1 hooks onto OpenCode 2
├── tests/                     # regression suites for the entry files
│   ├── v2-bridge.test.cjs     # covers the bridge itself
│   ├── plugin-inventory.test.cjs   # inventory, unmapped-hook and event-name guards
│   ├── plugin-inventory.json       # native-dual exceptions and event-name lists
│   ├── v2-hard-plugins.test.cjs    # selected hard cases: expected registrations and behavior
│   ├── v2-registration.test.cjs    # checks the dual export shape for every bridged plugin
│   └── ...                    # the remaining v1 behavior suites
├── README.md                  # folder index with the per-file inventory
└── ARCHITECTURE.md            # this document
```

Allowed dependency direction:

- `entry files ──▶ lib/`
- `entry files ──▶ shared cores under .skilled/skills/ and .skilled/hooks/`
- `lib/ ──▶ shared cores under .skilled/skills/`
- `tests/ ──▶ entry files and lib/`

`sk-vision.js` builds from `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` and ships as the compiled bundle the symlink points to. Its source therefore sits outside this folder even though the loader discovers the file here.

---

## 3. CANONICAL FLOWS

**OpenCode 1 load path.** The OpenCode 1 host calls `server(input)` and registers the returned hooks directly. The input carries the keys `client`, `project`, `worktree`, `directory`, `experimental_workspace`, `serverUrl` and `$`.

**OpenCode 2 load path.** The OpenCode 2 host calls `setup(ctx)` in `lib/v2-bridge.js`. The bridge builds the v1-shaped input, with `client` from `createV1Client(ctx)`, `worktree` and `directory` from `ctx.location.directory`; `project`, `experimental_workspace`, `serverUrl` and `$` set to `undefined` (`lib/v2-bridge.js` (`dualPlugin`, `setup`)), then calls `server(input)` once, registers each mapped hook and returns the cleanup function. A failed registration runs that cleanup and rethrows the original error (`lib/v2-bridge.js` (`dualPlugin`, `setup`)).

**Key modules:**

- `lib/v2-bridge.js` owns the dual export (`dualPlugin`), the v1 client adapter (`createV1Client`), the tool-context adapter (`toV1ToolContext`) and the tool result converter (`toV1ToolOutput`), all in `lib/v2-bridge.js`.
- `lib/tool-identity.js`, the identity helper for tool definitions.

---

## 4. RUNTIME SUBSYSTEMS

**Dual export.** `dualPlugin(id, server)` returns `{ id, server, setup }` (`lib/v2-bridge.js` (`dualPlugin`)) and leaves `server`, the v1 factory, unchanged. Every entry file except sk-vision builds its export with it. `sk-vision.js` instead builds its own `{ id: 'sk-vision', server, setup }` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:542`). Every default export therefore carries exactly the keys `id`, `server` and `setup`, and each host calls only its own entry.

**Hook mapping.** The bridge maps the v1 hook keys a factory returns onto OpenCode 2 registrations, driven by the `MAPPED_HOOKS` set (`lib/v2-bridge.js` (`MAPPED_HOOKS`)). The table is the full mapping.

| v1 hook | OpenCode 2 registration | Notes |
|---|---|---|
| `event` | `ctx.event.subscribe` | replays each v2 event to the v1 handler, adds `info: { id: sessionID }` to session events and announces each session once with a synthesized `session.created` (`lib/v2-bridge.js` (`dualPlugin`, `setup` event stream), `lib/v2-bridge.js` (`announceSession`)) |
| `tool.execute.before` | `ctx.tool.hook('execute.before')` | passes `{ tool, sessionID, callID }` and `{ args }`, reports v2 `shell` and `subagent` as `bash` and `task` with `subagent_type` added beside `agent`, writes changed args back under the v2 names and denies the call on a throw (`lib/v2-bridge.js` (`dualPlugin`, `tool.execute.before`), `lib/v2-bridge.js` (`toV1ToolName`, `toV1ToolArgs`, `toV2ToolArgs`)) |
| `tool.execute.after` | `ctx.tool.hook('execute.after')` | reports the same v1 tool names, converts the v2 result to `{ title, output, metadata }` with `toV1ToolOutput` and gives a `shell` result a string `output` (`lib/v2-bridge.js` (`dualPlugin`, `tool.execute.after`), `lib/v2-bridge.js` (`toV1ToolHookOutput`, `toV1ToolOutput`)) |
| `experimental.chat.system.transform` | `ctx.session.hook('context')` | announces the session before the transform runs, calls the v1 transform with `{ sessionID, model? }` and `{ system: [] }` and pushes each returned string to `event.system` as a text item (`lib/v2-bridge.js` (`dualPlugin`, `experimental.chat.system.transform`)) |
| `tool` | `ctx.tool.transform` | adds each v1 definition with its zod `args` converted by `z.toJSONSchema`, a string result becomes `{ content }` and an object result `{ content: output, metadata }` with `title` copied into metadata (`lib/v2-bridge.js` (`dualPlugin`, `tool` transform)) |
| `dispose` | the cleanup function `setup` returns | aborts the event stream, disposes every registration and then calls the v1 `dispose`, collecting errors and rethrowing them as an `AggregateError` when there are several (`lib/v2-bridge.js` (`cleanup`)) |
| any other key | not registered | does nothing on OpenCode 2 and shows up in `cleanup.skippedKeys` (`lib/v2-bridge.js` (`cleanup.skippedKeys`)) |

**Event aliases and mappings.** Inside the `event` leg, two v2 events are also delivered under a v1 name and three have a different v1 event shape also delivered; the original v2 event is delivered in every case (`lib/v2-bridge.js` (`EVENT_ALIASES`), `lib/v2-bridge.js` (`EVENT_MAPPINGS`)). The aliases and the mappings are:

| v2 event | v1 delivery | Notes |
|---|---|---|
| `session.execution.succeeded` | also delivered as `session.idle` | alias (`lib/v2-bridge.js` (`EVENT_ALIASES`)) |
| `session.compaction.ended` | also delivered as `session.compacted` | alias (`lib/v2-bridge.js` (`EVENT_ALIASES`)) |
| `session.text.ended` | the original is delivered and `message.part.updated` is also delivered | a text part with a top-level `sessionID` (`lib/v2-bridge.js` (`EVENT_MAPPINGS`, `session.text.ended`)) |
| `session.step.ended` | the original is delivered and `message.updated` is also delivered | cost, tokens, a top-level `sessionID` and `info.time.completed` from the event's `created` time (`lib/v2-bridge.js` (`EVENT_MAPPINGS`, `session.step.ended`)) |
| `session.inbox.enqueued` | the original is delivered and `message.updated` and `message.part.updated` are also delivered | a user item becomes a user `message.updated` and its text `message.part.updated`, sharing the inbox id (`lib/v2-bridge.js` (`EVENT_MAPPINGS`, `session.inbox.enqueued`)) |

The bridge also announces each session once. `opencode2 run` sends no `session.created` for its own session, so before that session's first other `session.*` event or its first system transform, whichever comes first, the bridge delivers `session.created` with `{ sessionID, info: { id } }` (`lib/v2-bridge.js` (`announceSession`), `lib/v2-bridge.js` (`dualPlugin`, `setup` event stream), `lib/v2-bridge.js` (`dualPlugin`, `experimental.chat.system.transform`)). A real `session.created` that arrives later for an announced session is dropped, and `session.deleted` waits for any in-flight announcement before it clears the record (`lib/v2-bridge.js` (`dualPlugin`, `setup` event stream), `lib/v2-bridge.js` (`announceSession`)).

The once-per-session events are `session.idle` and `session.compacted` (`lib/v2-bridge.js` (`DEDUPED_SESSION_EVENTS`)). Their delivery latches reset when the session sees `session.execution.started`, `session.compaction.started` or `session.deleted` (`lib/v2-bridge.js` (`SESSION_EVENT_RESET_TYPES`), cleared in the `setup` event stream).

**v1 client and tool-context adapters.** `createV1Client(ctx)` maps `session.messages`, `session.promptAsync` with queued delivery, `session.create`, `session.prompt` and `session.delete` onto the v2 session methods (`lib/v2-bridge.js` (`createV1Client`)), and a missing v2 method throws through `requireV2SessionMethod` (`lib/v2-bridge.js` (`requireV2SessionMethod`)). `toV1ToolContext` builds the per-call v1 tool context (`lib/v2-bridge.js` (`toV1ToolContext`)), where `abort` is the v2 signal, `directory` and `worktree` come from the location, `metadata(update)` calls `progress` and `ask` throws `ask is not available on OpenCode 2` (`lib/v2-bridge.js` (`toV1ToolContext`)). The client adapter has no `tui` member, so `client.tui.showToast` is unavailable to bridged plugins on OpenCode 2.

**sk-vision's own path.** `sk-vision.js` skips the bridge and builds its own `{ id, server, setup }` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:542`). On OpenCode 1 its `server` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:164`) returns `command.execute.before`, which runs `/vision` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:188-190`), unless the plugin option `enabled: false` is set, in which case it returns only `dispose` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:174-176`). The same `dispose`-only result follows when `visionHooksEnabled()` is false (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:174-176`), and `setup` then registers nothing (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:379-380`). With `SK_VISION_AUTOINSPECT=1` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:179`) it also returns `event`, `chat.message`, the 13 `sk_vision_*` tools and `dispose` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:213-238`), with progress messages through `client.tui.showToast` when present (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:195-200`). On OpenCode 2, `createSetup` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:372`) registers the `vision` command through `ctx.command.transform` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:383`) and a `ctx.session.hook('prompt')` hook (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:433`) that expands the project `/vision` template and, with the flag on, adds image evidence to the prompt, where a model off the text-only list gets a 2-second grace and a listed text-only model waits for the full analysis (`.skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts:51`, `.skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts:96-101`). The 13 tools register through `ctx.tool.transform` after the prompt hook (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:496-500`), only with `SK_VISION_AUTOINSPECT=1` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:524`), a failed tool registration fails open and the model reaches the tools through OpenCode 2's code-mode `execute` tool.

**Kill switches.** The master switch is `SYSTEM_HOOKS_DISABLED` (`.skilled/hooks/shared/hook-flags.cjs` (`MASTER_FLAG`)), with the older `MK_HOOKS_DISABLED` still honored (`.skilled/hooks/shared/hook-flags.cjs` (`MASTER_ALIASES`)), and a truthy value is `1`, `true`, `yes` or `on` (`.skilled/hooks/shared/hook-flags.cjs` (`isTruthy`)). The default per-concern name is `SYSTEM_<CONCERN>_DISABLED`, six concerns use another canonical name in `CONCERN_CANONICAL` (`.skilled/hooks/shared/hook-flags.cjs` (`CONCERN_CANONICAL`)) and older names survive in `LEGACY_ALIASES` (`.skilled/hooks/shared/hook-flags.cjs` (`LEGACY_ALIASES`)).

| Concern | Canonical switch |
|---|---|
| `goal` | `OPENCODE_GOAL_DISABLED` |
| `dispatch` | `CLI_DISPATCH_AUDIT_DISABLED` |
| `mcp-route-guard` | `MCP_ROUTE_GUARD_DISABLED` |
| `codex-watchdog` | `CODEX_HOOKS_WATCHDOG_DISABLED` |
| `git-preflight` | `SK_GIT_PREFLIGHT_DISABLED` |
| `post-edit-quality` | `SK_CODE_POST_EDIT_QUALITY_DISABLED` |

`sk-git-message-gate.js` is the one plugin with no switch. `system-speckit-completion.js` uses the `completion` concern (`.opencode/plugins/system-speckit-completion.js:56`) and sk-vision the `sk-vision` concern (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:156`).

---

## 5. HOOK AND PLUGIN INTEGRATION

Most entry files are transport adapters that translate OpenCode events into the shared policy cores under `.skilled/skills/` and `.skilled/hooks/`. `opencode-goal.js` is the exception: it implements the goal state machine and goal tools itself and shares only selected helpers. Every plugin except sk-vision calls its core inside the one v1 factory, so the same core serves the OpenCode 1 hooks and, through the bridge, the OpenCode 2 registrations. sk-vision calls its core from its own `server` and `setup` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:164`, `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:535-540`). Nothing under `lib/` or `tests/` is a plugin source.

Four capabilities have no OpenCode 2 equivalent:

| Capability | OpenCode 2 status | Workaround or effect |
|---|---|---|
| Server-side toast | the v2 `Context` has no `tui` member and the event domain is subscribe-only | sk-vision's toast calls are skipped on v2 |
| Agent `temperature` | no effect on 2.0.32 with the `openai-compatible` provider package, the only one tested | no effect observed on the one provider tested |
| A global `command.execute.before` observer | v2 has none | sk-vision instead owns its command through `ctx.command.transform` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:383`) |
| Tool `ask` inside a bridged tool | `ask` throws `ask is not available on OpenCode 2` (`lib/v2-bridge.js` (`toV1ToolContext`)) | a bridged plugin cannot raise a permission prompt |

### Adding a plugin

1. Write the v1 factory.
2. Default-export `dualPlugin('<id>', factory)`.
3. Use only the mapped hook keys or accept that the others do nothing on OpenCode 2.
4. Run `tests/plugin-inventory.test.cjs`. The v2 suites find the new file on their own; add a case to `PLUGINS` in `tests/v2-hard-plugins.test.cjs` only when the plugin needs behavior checks.
5. Gate it with `isHookEnabled('<concern>')`.
6. Add the file to the inventory table and directory tree in `README.md` and to the topology in Section 2 here, and update the dated file count in both documents. The inventory in `tests/helpers/plugin-inventory.cjs` is the source of truth for which plugins the v2 suites cover.
7. Run the plugin suite and both battery families.

A plugin that needs an OpenCode 2 registration the bridge does not map, such as a command, skips steps 2 and 3. It default-exports its own `{ id, setup, server }` the way sk-vision does (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:542`), and it goes in `nativeDual` in `tests/plugin-inventory.json` with its reason, and its v2 check goes in `PLUGINS` in `tests/v2-hard-plugins.test.cjs`.

---

## 6. ENFORCEMENT AND VERIFICATION

```bash
node --test .opencode/plugins/tests/
node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1
node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2
```

**Plugin suite.** The first command runs every suite under `tests/`, including the three v2 suites and the inventory test. It passed 397 of 397 on main at `8c9a14bd59` on 2026-10-20, before the inventory test was added, and the v2 suites cover every plugin file the inventory finds. After the bridge gained tool aliases, the session announcement and the inbox mapping it passed 453 of 453 on 2026-10-20.

**Purity test.** `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` imports every entry file, symlinks included. For `sk-vision.js` it first checks that the link is relative, stays inside the repository and resolves to a built bundle, then applies the same export contract as any other entry. Spec-Kit Check builds the sk-vision bundle with bun before it runs the test, because the bundle is a build output git ignores.

**Doctor battery.** The next two commands check both versions, and the v2 run starts a private server on its own port. On 2026-10-19, after main added `session-relaunch.js`, the battery discovered all 17 plugin files on OpenCode 1.19.3 and reported all 17 active on OpenCode 2.0.32. In a worktree nested inside another checkout, OpenCode 2 also loads the outer checkout's plugin folder, so the battery's v2 read turns that walk off with `OPENCODE_CONFIG_PROJECT_DISABLE=1`, sets `OPENCODE_CONFIG_DIR` to the root's own `.opencode`, and names each outer folder in an `isolated:` line of the plugin-active result. A plain checkout and CI keep OpenCode 2's normal discovery.

**CI workflow.** `.github/workflows/opencode-dual-version.yml` runs the battery per family plus a job with both versions installed, on pushes and pull requests to `main` and `skilled/**` that touch the plugin, sk-vision, agent or dispatch-hook trees, the package manifests and lockfiles, the battery script and its test, the config-shape test, `opencode.json` or the workflow itself. Each job first puts the pinned `bun` 1.3.9 on `PATH` and provisions every dependency tree the plugins import, including the sk-vision bundle. The first run with all three jobs green was on main at `793b50ccbf` on 2026-10-19. The runs before it failed at the sk-vision bundle build or the battery step.

---

## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | One default export `{ id, setup, server }` per plugin file rather than an env-selected entry | Accepted |
| ADR-002 | The v1 factory stays the single implementation and `setup` is derived by the bridge | Accepted |
| ADR-003 | sk-vision builds its own `setup` instead of using the bridge | Accepted |
| ADR-004 | Hook keys the bridge cannot map are skipped and reported, not failed | Accepted |

### Known limits

- OpenCode 2 has no server-side toast and agent `temperature` has no effect (see Section 5).
- The proposed version floors of 1.19.0 and 2.0.32 are inferred and unprobed below the tested versions.
- OpenCode 2.0.32 does not deliver `server.instance.disposed` or `global.disposed` to plugins; it sends `location.shutdown` and runs the cleanup the bridge returns. The disposal branches in `system-skill-advisor.js` and `system-dist-freshness-guard.js` therefore run only on OpenCode 1 (observed 2026-10-20, listed in `tests/plugin-inventory.json`).
- The event-name guard in `tests/plugin-inventory.test.cjs` parses each bridged plugin with rolldown, which `.skilled/package.json` now declares directly as a dev dependency. Comments and strings are never read as code, and an escaped name reads as the name it spells. The guard resolves every name through its lexical scope and reports every other check on the event type for `unscannedEventChecks`, including one that wraps the type in a call. A `typeof` check reads only the value's type, so the guard does not count it as an event check. A file it cannot parse fails the test. It knows the event type by name: `type`, a name ending in `Type`, a `.type` field, or a local declared from one of those. An object key or member property with such a name is not a value. A parameter with such a name counts as the event type. It stops counting only when the function has a name, is not exported, never escapes, has calls in the file, never writes the parameter, and every call passes no event type at that position, a default included. The guard follows a helper result stored in a variable through declarations, plain assignments and object or array literals built from it, and it reports the helper call when any read of that binding decides a branch: an `if`, a loop, a conditional, a `switch` or a `case`. It still does not follow values across files, through a function's return value or through a function that escapes. An unrelated value named `type` that is not a traced parameter is still read as the event type, and a check on an event type held under any other name is invisible to it. The authoritative guard for what each plugin does on each host is still the two-version doctor battery.
- OpenCode 2.0.32 merges every ancestor `.opencode` folder, so a session started in a worktree nested inside another checkout, such as `.worktrees/NNN-slug`, registers the outer checkout's plugins first and the worktree's own copies fail with `Duplicate plugin ID` (observed 2026-10-20). That session runs the outer checkout's plugin code. OpenCode 1.19.3 stops at the worktree root. To run a worktree's own plugins on OpenCode 2, start it with `OPENCODE_CONFIG_PROJECT_DISABLE=1 OPENCODE_CONFIG_DIR=<worktree>/.opencode`, or use a checkout outside the other one.
- Live delivery is verified per plugin by the `plugin-utilization` playbook in `cli-opencode`. On 2026-10-20 all 17 plugins showed their checked effect on OpenCode 1.19.3 and 2.0.32 (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/035-v2-bridge-plugin-effects/scratch/live-runs/results-matrix.md`).

---

## 8. RELATED

- [README.md](./README.md): the folder index with the per-file inventory and configuration.
- [tests/README.md](./tests/README.md): the regression suite index.
- [lib/v2-bridge.js](./lib/v2-bridge.js): the dual export builder and hook mapping.
- [hook-flags.cjs](../../.skilled/hooks/shared/hook-flags.cjs): the kill-switch resolver.
- [plugin.ts](../../.skilled/skills/sk-vision/vision-runtime/src/plugin.ts): the sk-vision source, built into the `sk-vision.js` bundle.
- [opencode-dual-version.yml](../../.github/workflows/opencode-dual-version.yml): the dual-version CI workflow.
- [opencode-version-battery.cjs](../../.skilled/commands/doctor/scripts/opencode-version-battery.cjs): the doctor battery.
