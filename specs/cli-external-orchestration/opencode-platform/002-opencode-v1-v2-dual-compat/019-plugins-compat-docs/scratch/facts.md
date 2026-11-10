# Verified facts for the plugins README and ARCHITECTURE.md

Every fact below was checked against the tree on `origin/main` at `1001ab297f`. Each one names its source. Line numbers are 1-based.

## Versions and proof

- Tested versions: OpenCode 1.19.3 (`opencode`, the `opencode-ai` package) and OpenCode 2.0.32 (`opencode2` launcher). Source: `../011-two-version-proof-and-closeout/proof.md:16-21`, captured 2026-10-19.
- After main added `session-relaunch.js`, the doctor battery reported all 17 plugin files discovered on 1.19.3 and all 17 active on 2.0.32. Source: `../011-two-version-proof-and-closeout/scratch/main-merge/battery-v1.txt:3`, `battery-v2.txt:4`.
- Each host calls only its own entry. 1.19.3 calls `server(input)` with input keys `client, project, worktree, directory, experimental_workspace, serverUrl, $`. 2.0.32 calls `setup(ctx)`. A plugin exporting only one entry is a silent no-op on the other host. Source: `../research/research.md:53-54`.
- Proposed version floors are 1.19.0 and 2.0.32, both inferred and unprobed below the tested versions. Source: `../research/research.md:219`.

## Inventory (17 plugin files)

`node scratch/list-plugin-hooks.mjs .opencode/plugins` loads each file, calls its `server` with a stub and prints the returned hook keys. Output: `scratch/plugin-hook-keys.txt`.

- 16 files build their export with `dualPlugin(id, server)` from `lib/v2-bridge.js`. `sk-vision.js` builds its own `{ id: 'sk-vision', server, setup }` (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:490`).
- Every file's default export has exactly the keys `id`, `server`, `setup`.

Hook keys returned by `server`, with default env:

| File | Hook keys |
|---|---|
| classifier-injection-screen.js | `experimental.chat.system.transform`, `tool.execute.after` |
| cli-dispatch-audit.js | `tool.execute.before`, `tool.execute.after` |
| codex-hooks-watchdog.js | `event` |
| mcp-route-guard.js | `tool.execute.before` |
| opencode-goal.js | `event`, `experimental.chat.system.transform`, `tool` (2 tools: `opencode_goal`, `opencode_goal_status`) |
| session-cleanup.js | `dispose`, `event`, `experimental.chat.system.transform` |
| session-relaunch.js | `event`, `experimental.chat.system.transform` |
| sk-code-post-edit-quality.js | `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform` |
| sk-git-message-gate.js | `tool.execute.before` |
| sk-git-preflight-advisory.js | `tool.execute.before`, `experimental.chat.system.transform` |
| sk-vision.js | `command.execute.before` only. With `SK_VISION_AUTOINSPECT=1`: `chat.message`, `command.execute.before`, `dispose`, `event`, `tool` (13 tools) |
| system-completion-sentinel.js | `event` |
| system-deep-loop-guard.js | `event`, `tool.execute.before` |
| system-dist-freshness-guard.js | `event`, `experimental.chat.system.transform`, `tool.execute.before` |
| system-skill-advisor.js | `event`, `experimental.chat.system.transform`, `tool` (1 tool: `spec_kit_skill_advisor_status`) |
| system-spec-gate.js | `event`, `experimental.chat.system.transform`, `tool.execute.before` |
| system-speckit-completion.js | `tool` (1 tool: `system_speckit_completion`) |

- `cli-dispatch-audit.js` `tool.execute.before` (`.opencode/plugins/cli-dispatch-audit.js:71-98`) blocks a Bash dispatch that breaks a hard rule declared in the target skill's `SKILL.md`, under concern `dispatch-guard`. It throws so OpenCode denies the call, and fails open on its own errors. Its `tool.execute.after` writes the audit record under concern `dispatch`.

## The bridge (`.opencode/plugins/lib/v2-bridge.js`)

- `MAPPED_HOOKS` (lines 8-15): `event`, `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform`, `tool`, `dispose`. Any other key is listed in `cleanup.skippedKeys` (lines 221, 280) and does nothing on v2.
- `dualPlugin(id, server)` (line 207) returns `{ id, server, setup }` (line 402). `server` is the unchanged v1 factory.
- `setup(ctx)` builds a v1-shaped input (lines 209-218): `client` from `createV1Client(ctx)`, `worktree` and `directory` from `ctx.location.directory`, and `project`, `experimental_workspace`, `serverUrl` and `$` set to `undefined`. It then calls `server(input)` once.
- `event` (lines 283-321): subscribes to `ctx.event.subscribe` and replays each v2 event to the v1 handler. Session events get `info: { id: sessionID }` added. Aliases (lines 17-20): `session.execution.succeeded` is also delivered as `session.idle`, and `session.compaction.ended` as `session.compacted`. Mappings (lines 22-48): `session.text.ended` becomes `message.part.updated` with a text part, and `session.step.ended` becomes `message.updated` with cost and tokens. `session.idle` and `session.compacted` are delivered once per session (line 50) until `session.execution.started`, `session.compaction.started` or `session.deleted` resets them (lines 51-55).
- `tool.execute.before` (lines 323-335): registers `ctx.tool.hook('execute.before')`, passes `{ tool, sessionID, callID }` and `{ args }`, and writes the possibly changed args back to `event.input`. A throw denies the call.
- `tool.execute.after` (lines 337-347): registers `ctx.tool.hook('execute.after')`, and converts the v2 result to `{ title, output, metadata }` with `toV1ToolOutput` (line 63).
- `experimental.chat.system.transform` (lines 350-364): registers `ctx.session.hook('context')`, calls the v1 transform with `{ sessionID, model? }` and `{ system: [] }`, and pushes each returned string to `event.system` as a text item.
- `tool` (lines 366-389): registers `ctx.tool.transform` and adds each v1 definition with its zod `args` converted by `z.toJSONSchema`. A string result becomes `{ content }`. An object result becomes `{ content: output, metadata }`, with `title` copied into metadata.
- `dispose`: the cleanup function `setup` returns aborts the event stream, disposes every registration, then calls the v1 `dispose` (lines 243-280). Errors are collected and rethrown, as an `AggregateError` when there are several.
- If a registration fails during `setup`, the bridge runs cleanup and rethrows the original error (lines 390-397).
- v1 client adapter `createV1Client` (line 123): `session.messages`, `session.promptAsync` (queued delivery), `session.create`, `session.prompt` and `session.delete`, each mapped onto the v2 session methods. A missing v2 method throws through `requireV2SessionMethod` (line 94).
- v1 tool context adapter `toV1ToolContext` (lines 187-197): `abort` is the v2 signal, `directory` and `worktree` are the location, `metadata(update)` calls `progress`, and `ask` throws `ask is not available on OpenCode 2`.
- The client adapter has no `tui` member, so `client.tui.showToast` is unavailable to bridged plugins on v2.

## sk-vision (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts`)

- `.opencode/plugins/sk-vision.js` is a symlink to `../skills/sk-vision/vision-runtime/dist/plugin.js`, the bundle built from this source.
- v1 `server` (line 141): always returns `command.execute.before`, which runs `/vision` (lines 157-166). With `SK_VISION_AUTOINSPECT=1` (line 156) it also returns `event` (preloads an image on `message.part.updated`), `chat.message` (injects the analysis), `tool` (13 `sk_vision_*` tools) and `dispose` (lines 190-215). Its progress messages use `client.tui.showToast` when present (lines 172-176).
- v2 `setup` (`createSetup`, line 348): registers the `vision` command through `ctx.command.transform` (line 353). It registers a `ctx.session.hook('prompt')` (line 389) that expands a project `/vision` command template and, with `SK_VISION_AUTOINSPECT=1`, adds image evidence to the prompt. A model off the text-only list gets a 2-second grace, and a listed text-only model waits for the full analysis. It registers the 13 tools through `ctx.tool.transform` after the prompt hook (lines 444-461), only with `SK_VISION_AUTOINSPECT=1`. A failed tool registration fails open.
- On v2 the model reaches the tools through OpenCode 2's code-mode `execute` tool. A private 2.0.32 run listed 0 of 65 tools with the flag off and 13 of 78 with it on, and called `sk_vision_status`. Source: `../013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md:113`.
- Kill switch: the OpenCode plugin never reads `hook-flags.cjs`. Its bundle contains no `SYSTEM_HOOKS_DISABLED`, `SYSTEM_SK_VISION_DISABLED` or `isHookEnabled` (grep count 0 over `.opencode/plugins/sk-vision.js`). The `SYSTEM_SK_VISION_DISABLED` switch is wired only in the Devin hook (`.skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:68`). On OpenCode the `/vision` command is always registered, and automatic analysis and tools are opt-in through `SK_VISION_AUTOINSPECT=1`.

## Kill switches (`.skilled/hooks/shared/hook-flags.cjs`)

- Master: `SYSTEM_HOOKS_DISABLED` (line 25), with the old name `MK_HOOKS_DISABLED` still honored (line 28). Truthy values: `1`, `true`, `yes`, `on` (line 99).
- Default per-concern name: `SYSTEM_<CONCERN>_DISABLED`. Six concerns use a different canonical name (`CONCERN_CANONICAL`, lines 34-41): `goal` uses `OPENCODE_GOAL_DISABLED`, `dispatch` uses `CLI_DISPATCH_AUDIT_DISABLED`, `mcp-route-guard` uses `MCP_ROUTE_GUARD_DISABLED`, `codex-watchdog` uses `CODEX_HOOKS_WATCHDOG_DISABLED`, `git-preflight` uses `SK_GIT_PREFLIGHT_DISABLED`, and `post-edit-quality` uses `SK_CODE_POST_EDIT_QUALITY_DISABLED`.
- Older aliases are listed in `LEGACY_ALIASES` (line 51 onward).
- Concern per plugin, as passed to `isHookEnabled`: classifier-injection-screen `injection-screen`, cli-dispatch-audit `dispatch` and `dispatch-guard`, codex-hooks-watchdog `codex-watchdog`, mcp-route-guard `mcp-route-guard`, opencode-goal `goal`, session-cleanup `session-cleanup`, session-relaunch `session-relaunch`, sk-code-post-edit-quality `post-edit-quality`, sk-git-preflight-advisory `git-preflight`, system-completion-sentinel `completion`, system-deep-loop-guard `task-dispatch`, system-dist-freshness-guard `dist-freshness`, system-skill-advisor `skill-advisor`, system-spec-gate `spec-gate`.
- Exceptions:
  - `sk-git-message-gate.js` has no switch.
  - `system-speckit-completion.js` reads only `SYSTEM_SPECKIT_COMPLETION_DISABLED === '1'` (`.opencode/plugins/system-speckit-completion.js:51`). With `SYSTEM_HOOKS_DISABLED=1` it still registers its tool (verified with the hook-key script).
  - `sk-vision.js` reads no switch on OpenCode (see above).

## Tests

- `tests/v2-registration.test.cjs` `PLUGIN_NAMES` (lines 19-32) lists 12 plugins and checks the dual export shape, at least one v2 registration and the cleanup function: classifier-injection-screen, cli-dispatch-audit, codex-hooks-watchdog, mcp-route-guard, session-cleanup, session-relaunch, sk-code-post-edit-quality, sk-git-message-gate, sk-git-preflight-advisory, system-deep-loop-guard, system-dist-freshness-guard, system-speckit-completion.
- `tests/v2-hard-plugins.test.cjs` covers the other five with behavior tests through a stub v2 context: system-completion-sentinel, system-spec-gate, system-skill-advisor, opencode-goal, sk-vision.
- `tests/v2-bridge.test.cjs` covers the bridge itself.
- Together the two lists cover all 17 plugins. The lists are hard-coded, so a new plugin is covered only once someone adds it to one of them.
- The plugin suite `node --test .opencode/plugins/tests/` passes 397 of 397 on main (the merge record at `../011-two-version-proof-and-closeout/scratch/main-merge/plugins.txt`).
- `.skilled/plugins` is a symlink to `../.opencode/plugins`, so commands written with either path work.

## Doctor and CI

- Doctor battery: `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1` and `--family=v2`. On v2 it starts a private server on its own port.
- CI workflow `.github/workflows/opencode-dual-version.yml` runs the battery per family plus a job with both installed, on pushes and pull requests to `main` and `skilled/**` that touch the plugin paths.
- On `origin/main` the workflow now puts the pinned `bun` 1.3.9 on `PATH` and provisions every dependency tree the plugins import (`.github/workflows/opencode-dual-version.yml:72-79` on `origin/main`). The first run with all three jobs green was run 39309852507 on main at `793b50ccbf`, 2026-10-19T19:18Z. Before it, 6d7f6b8499 failed in the battery step, and 6358d81eba and fe1f8a9a53 failed at the sk-vision bundle build with `bun: command not found` (`scratch/ci-dual-version-runs.txt`).

## Things with no v2 equivalent

- Server-side toast: v2 `Context` has no `tui` member, and the event domain is subscribe-only (`../research/research.md:336`). sk-vision's toast calls are skipped on v2.
- Agent `temperature`: has no effect on 2.0.32 with the `openai-compatible` provider package, the only one tested (`../011-two-version-proof-and-closeout/implementation-summary.md:120`).
- A global `command.execute.before` observer: v2 has none. sk-vision instead owns its command through `ctx.command.transform` (`../research/research.md:76`).
- Tool `ask` permission prompts inside a bridged tool: `ask` throws on v2 (bridge lines 193-195).
