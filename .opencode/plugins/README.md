---
title: "OpenCode Plugin Entrypoints"
description: "JavaScript plugin entrypoints for context injection, lifecycle handling, policy guards, runtime tools, and post-action checks. OpenCode discovers these via a flat glob over .opencode/plugins/; each module default-exports the object `{ id, setup, server }`."
trigger_phrases:
  - "OpenCode plugins"
  - "plugin entrypoints"
  - "OpenCode hook events"
---

# OpenCode Plugin Entrypoints

---

## 1. OVERVIEW

`.opencode/plugins/` contains the JavaScript modules OpenCode discovers as local plugins. Each module default-exports one plain object `{ id, setup, server }`: `server` is the OpenCode 1 entry and `setup` the OpenCode 2 entry. Source plugins build that object with `dualPlugin(id, server)` from `lib/v2-bridge.js`, so the v1 factory stays the single implementation and the bridge derives the v2 leg from it. OpenCode loads plugins by a flat glob over this folder (it does not recurse), so every loadable plugin lives directly here. The `lib/` and `tests/` subfolders are not plugin sources.

The directory inventory is authoritative for the auto-loaded plugin surface. Shared policy cores stay under their owning skill (`system-spec-kit`, `system-skill-advisor`, `sk-git`, `sk-code`, `sk-vision`, `system-completion`, `system-deep-loop`). The files here are **transport adapters** that translate OpenCode events into those cores and keep terminal output out of the TUI. The single shared boundary every plugin honors: **never write to stdout or stderr**, because OpenCode overlays those onto the TUI prompt line and corrupts the interactive session. Findings are injected via `experimental.chat.system.transform`, returned from tool handlers, or persisted to bounded workspace logs.

Every plugin except `sk-git-message-gate.js` honors a per-concern kill-switch via the shared `hook-flags.cjs` resolver (`isHookEnabled('<concern>')`), plus the master `SYSTEM_HOOKS_DISABLED`. A disabled plugin is a genuine full no-op, not just a no-emit no-op. The message gate has no switch because the commit, PR and branch rules carry no bypass on any surface. All advisory checks fail open. Rejection is opt-in per each plugin's own contract.

---

## 2. WHAT'S HERE / INVENTORY

| File | Concern | Hook surface | Responsibility |
|---|---|---|---|
| `classifier-injection-screen.js` | `injection-screen` | `tool.execute.after` for `webfetch`, `experimental.chat.system.transform` | Screens fetched `webfetch` text for instructions aimed at the agent. Buffers one advisory per session and drains it on the next transform, the model call that reads the fetch result. Never writes stdout/stderr. |
| `cli-dispatch-audit.js` | `dispatch` | `tool.execute.after` for Bash | Records redacted dispatch telemetry after completed CLI calls. Recognizes an `opencode` or `opencode2` invocation and appends a bounded audit record. |
| `codex-hooks-watchdog.js` | `codex-watchdog` | `event` (`session.created`) | Watches Codex hook installation and reports drift. Never affects the guarded session. |
| `mcp-route-guard.js` | `mcp-route-guard` | `tool.execute.before` | Advises when native MCP calls should use Code Mode. Persists to a bounded, rotated workspace log. |
| `opencode-goal.js` | `goal` | `event` (`session.created`/`status`/`idle`/`deleted`), `experimental.chat.system.transform`, `tool` (goal tools) | Binds a session to a packet `goal.md` and injects the objective slice built from it (via `../hooks/goal/lib/goal-slice.cjs`), or holds a text goal. Largest plugin. Owns the goal state machine, supervisor, continuation, capabilities and the goal tool surface including `bind`, `resent` and `packet`. |
| `session-cleanup.js` | `session-cleanup` | `event` (`session.created`/`deleted`), `experimental.chat.system.transform` | Performs bounded session and host cleanup. Startup guards and teardown cleanup. Reaps MCP helper processes via `session-cleanup.sh`. |
| `sk-code-post-edit-quality.js` | `post-edit-quality` | `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform` | Runs bounded post-edit quality checks. `tool.execute.before` stashes the edited path keyed by callID, because the after hook has no file path. `tool.execute.after` runs the router core. Findings drain on the next transform and are recorded to a workspace log. |
| `sk-git-message-gate.js` | `git-message-gate` (no kill switch) | `tool.execute.before` for `bash` | Refuses a `git commit` message, `gh pr` description or new branch name that breaks the repository's own sk-git templates by throwing. Allows what the shared gate cannot read. The one plugin with no kill switch, because the commit and push rules carry no bypass on any surface. |
| `sk-git-preflight-advisory.js` | `git-preflight` | `tool.execute.before` for `bash`, `experimental.chat.system.transform` | Advises on Git command scope before execution. Buffers at most 20 advisory events and drains them on the next transform. Never prints. |
| `sk-vision.js` | `sk-vision` | `tool` (13 `sk_vision_*` tools) | Symlink → `../skills/sk-vision/vision-runtime/dist/plugin.js`. Local vision adapter: OCR, inspect, detect, pixel analysis. The compiled build default-exports the same `{ id, setup, server }` shape. Auto-inspect uses a 2s grace and never awaits full GPU. |
| `system-completion-sentinel.js` | `completion` | `event` (`session.created`/`idle`) | Checks completion evidence at session lifecycle points. On `session.idle`, resolves completion state via `ctx.client.session.messages()` (guarded, fail-open). Throttled-sweeps the shared state dir on `session.created`. |
| `system-deep-loop-guard.js` | `task-dispatch` | `event` (`session.created`), `tool.execute.before` | Checks deep-loop Task dispatches and repeat handoffs. Sweeps stale loop-guard state on `session.created`. |
| `system-dist-freshness-guard.js` | `dist-freshness` | `tool.execute.before`, `event` (`session.created`/`deleted`), `experimental.chat.system.transform` | Reports stale compiled outputs and invalidates diagnostics. Short-circuits the whole plugin at factory entry when disabled. |
| `system-skill-advisor.js` | `skill-advisor` | `experimental.chat.system.transform`, `event`, `tool` (`spec_kit_skill_advisor_status`) | Injects skill-routing guidance per prompt and exposes advisor status. Spawns the warm bridge subprocess. TTL+LRU prompt cache with in-flight dedup. |
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

The bridge mapping is exercised against stub contexts in the test suites. Live hook delivery on a running OpenCode 2 host is unverified on OpenCode 2.0.32.

---

## 4. TEST SUITES

`tests/` holds the regression suites for the entry files. They run on the Node built-in test runner with hermetic stubs. The v2 suites are:

| File | Covers |
|---|---|
| `tests/v2-bridge.test.cjs` | The bridge itself: event aliases and mappings, the v1 client adapters, hook registration and cleanup, tool result conversion, and the `tool` identity contract. |
| `tests/v2-hard-plugins.test.cjs` | The five plugins with behavior-level v2 coverage (`system-completion-sentinel`, `system-spec-gate`, `system-skill-advisor`, `opencode-goal`, `sk-vision`), driven through a stub v2 context. |
| `tests/v2-registration.test.cjs` | The dual export shape, at least one v2 registration and the cleanup function for 11 plugins. |

The remaining `*.test.cjs` files cover v1 behavior and adjacent contracts. `tests/README.md` indexes the full set, and `tests/helpers/` holds the shared fixtures.

---

## 5. DIRECTORY TREE

```text
plugins/
+-- README.md                              # this index
+-- classifier-injection-screen.js
+-- cli-dispatch-audit.js
+-- codex-hooks-watchdog.js
+-- mcp-route-guard.js
+-- opencode-goal.js
+-- session-cleanup.js
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
| `opencode-goal.js` | The largest plugin. Owns the goal state machine, supervisor, continuation, capabilities, and the goal tool surface. Hooks `session.created`/`status`/`idle`/`deleted`, `experimental.chat.system.transform`, and a family of goal tools. |
| `system-skill-advisor.js` | Spawns the skill-advisor bridge subprocess per prompt, manages a TTL+LRU prompt cache with in-flight dedup, integrates transform-dedup where the opt-in same-message dedup bases its decision on the full advisor block before directive-lifecycle reduction and suppresses a repeated transform for the same message, and exposes `spec_kit_skill_advisor_status`. |
| `system-spec-gate.js` | Maps OpenCode's transport onto the runtime-neutral spec-gate core. Classify best-effort fetches the last user message via `ctx.client`. Enforce throws `system-spec-gate:` on deny. `event` sweeps, advances and evicts state. |
| `sk-code-post-edit-quality.js` | Correlates `tool.execute.before` file paths to `tool.execute.after` callIDs, runs the post-edit router core, and drains findings on the next transform. |
| `lib/v2-bridge.js` | Builds every plugin's dual export. `server` is the unchanged v1 factory, and `setup` maps its hooks onto OpenCode 2 registrations and returns a cleanup function. |
| `lib/tool-identity.js` | The `tool` identity helper. Returns a v1 tool definition unchanged and carries zod as `tool.schema`. |
| `lib/opencode-message-identity.js` | Shared stable transform identity and dedup state used by the advisor plugin. |

---

## 7. CONFIGURATION

Every plugin is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver. Each plugin checks `isHookEnabled('<concern>')` at entry (some at factory entry, some per-hook) and returns a full no-op when disabled.

| Variable | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables every plugin in this folder along with every other repo hook. |
| Per-concern `SYSTEM_<CONCERN>_DISABLED=1` | Each plugin's canonical kill-switch (e.g. `SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED`). See each plugin's own README for its full env family. **The goal plugin is the exception: its canonical switch is `OPENCODE_GOAL_DISABLED`, and the name this rule would derive does not exist.** |
| Legacy / plugin-specific aliases | Several plugins carry additional aliases (e.g. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `OPENCODE_GOAL_PLUGIN_DISABLED`, `SK_CODE_POST_EDIT_QUALITY_DISABLED`). See each plugin's own README. |

Optional tuning: `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` (default 3000, owned by `system-skill-advisor`), `SYSTEM_OPENCODE_TRANSFORM_DEDUP=1` (opt-in transform dedup for the advisor plugin), plus per-plugin cache/budget/timeout envs documented in each plugin's README.

Set a flag inline for one command, export it for a session, or persist it in `.skilled/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 8. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Transport only | Plugin files own the OpenCode transport boundary. Shared policy and runtime-neutral logic belongs under the owning skill. |
| Dual export | Every plugin file default-exports one plain object `{ id, setup, server }`: `server` is the OpenCode 1 entry and `setup` the OpenCode 2 entry. `lib/` modules are shared helpers, never plugin sources. |
| No stdout/stderr | Plugins never print warnings to stdout or stderr. OpenCode overlays those onto the TUI prompt line and corrupts the interactive session. Findings go through `experimental.chat.system.transform`, tool returns, or bounded workspace logs. |
| Fail-open | All advisory checks fail open. A disabled plugin, a missing payload, a subprocess timeout, a parse failure, or any internal error resolves to a no-op. The skill advisor is the exception to the no-op because on a subprocess timeout, a parse failure, a missing prompt or an internal error it injects its status-headed fallback (an `Advisor: outage (...)` or `Advisor: prompt skipped.` line above the directives block) and never blocks the prompt. Rejection is opt-in per each plugin's own contract (e.g. `SYSTEM_SPEC_GATE_ENFORCE` for spec-gate deny). |
| Kill-switch | Every plugin honors its per-concern kill-switch via the shared `hook-flags.cjs` resolver plus the master `SYSTEM_HOOKS_DISABLED`. A disabled plugin is a genuine full no-op. |
| Bounded | Subprocess spawns, caches, pending-event buffers, and workspace logs are all bounded (per-plugin limits documented in each plugin's README). |
| Tests | Plugin tests stay under `tests/`. |

---

## 9. HOOK MODEL

Plugin factories register some subset of:

- `tool`: tools exposed to the model (e.g. `spec_kit_skill_advisor_status`, the goal tools, the 13 `sk_vision_*` tools, the read-only completion-evidence tool).
- `tool.execute.before`: pre-tool evaluation (spec-gate enforce, git message gate, git-preflight, mcp-route-guard, post-edit-quality path stash, deep-loop guard).
- `tool.execute.after`: post-tool evaluation (cli-dispatch-audit, post-edit-quality run, injection screen).
- `experimental.chat.system.transform`: per-turn system-context injection (advisor, memory, spec-gate classify, goal, post-edit-quality drain, dist-freshness, injection-screen drain).
- `event`: lifecycle handlers (`session.created`/`status`/`idle`/`deleted`/`resumed`/`compacted`/`compact`, `server.instance.disposed`/`global.disposed`).

The bridge in `lib/v2-bridge.js` maps that set onto OpenCode 2 registrations: `event` to the event stream, `tool.execute.before`/`after` to the tool execute hooks, `experimental.chat.system.transform` to the session context hook, and `tool` definitions to the tool transform. A key outside the set is reported through `cleanup.skippedKeys`.

---

## 10. VALIDATION

Run the Node regression command from the repository root:

```bash
node --test .skilled/plugins/tests/*.test.cjs
```

Expected result: Node discovers every current CJS test file and reports the suite result. A failing test is a validation failure.

```bash
for f in .skilled/plugins/*.js; do node --check "$f"; done
```

Expected result: no syntax errors across every plugin (resolves imports against the repo).

---

## 11. RELATED

- [`tests/README.md`](./tests/README.md): the plugin regression suites.
- [`tests/helpers/README.md`](./tests/helpers/README.md): the shared test helpers.
- [`../hooks/README.md`](../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix. Several plugins are mirrored there as the OpenCode adapter for their concern (`spec-gate`, `skill-advisor`, `git-preflight`, `git-message-gate`, `session-cleanup`, `injection-screen`).
- [`../skills/`](../skills/): the shared skill cores these plugins adapt.
