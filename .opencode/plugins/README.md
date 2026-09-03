---
title: "OpenCode Plugin Entrypoints"
description: "JavaScript plugin entrypoints for context injection, lifecycle handling, policy guards, runtime tools, and post-action checks. OpenCode discovers these via a flat glob over .opencode/plugins/; each module exports a default plugin factory."
trigger_phrases:
  - "OpenCode plugins"
  - "plugin entrypoints"
  - "OpenCode hook events"
---

# OpenCode Plugin Entrypoints

---

## 1. OVERVIEW

`.opencode/plugins/` contains the JavaScript modules OpenCode discovers as local plugins. Each module exposes a default plugin factory that registers tools, hook handlers, or lifecycle handlers with the host. OpenCode loads plugins by a flat glob over this folder (it does not recurse), so every loadable plugin lives directly here; the `lib/` and `tests/` subfolders are not plugin sources.

The directory inventory is authoritative for the auto-loaded plugin surface. Shared policy cores stay under their owning skill (`system-spec-kit`, `system-skill-advisor`, `sk-git`, `sk-code`, `sk-communication`, `sk-vision`, `system-completion`, `system-deep-loop`); the files here are **transport adapters** that translate OpenCode events into those cores and keep terminal output out of the TUI. The single shared boundary every plugin honors: **never write to stdout or stderr** — OpenCode overlays those onto the TUI prompt line and corrupts the interactive session. Findings are injected via `experimental.chat.system.transform`, returned from tool handlers, or persisted to bounded workspace logs.

Every plugin honors a per-concern kill-switch via the shared `hook-flags.cjs` resolver (`isHookEnabled('<concern>')`), plus the master `SYSTEM_HOOKS_DISABLED`. A disabled plugin is a genuine full no-op, not just a no-emit no-op. All advisory checks fail open; rejection is opt-in per each plugin's own contract.

---

## 2. WHAT'S HERE / INVENTORY

| File | Concern | Hook surface | Responsibility |
|---|---|---|---|
| `cli-dispatch-audit.js` | `dispatch` | `tool.execute.after` for Bash | Records redacted dispatch telemetry after completed CLI calls. Recognizes an `opencode` invocation and appends a bounded audit record. |
| `codex-hooks-watchdog.js` | `codex-watchdog` | `event` (`session.created`) | Watches Codex hook installation and reports drift. Never affects the guarded session. |
| `mcp-route-guard.js` | `mcp-route-guard` | `tool.execute.before` | Advises when native MCP calls should use Code Mode. Persists to a bounded, rotated workspace log. |
| `opencode-goal.js` | `goal` | `event` (`session.created`/`status`/`idle`/`deleted`), `experimental.chat.system.transform`, `tool` (goal tools) | Stores and injects session goals and lifecycle state. Largest plugin; owns goal state machine, supervisor, continuation, capabilities, and the goal tool surface. |
| `session-cleanup.js` | `session-cleanup` | `event` (`session.created`/`deleted`), `experimental.chat.system.transform` | Performs bounded session and host cleanup. Startup guards + teardown cleanup; reaps MCP helper processes via `session-cleanup.sh`. |
| `sk-code-post-edit-quality.js` | `post-edit-quality` | `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform` | Runs bounded post-edit quality checks. `tool.execute.before` stashes the edited path keyed by callID (after has no file path); `tool.execute.after` runs the router core; findings drained on the next transform and recorded to a workspace log. |
| `sk-communication-projection.js` | `sk-communication-projection` | `chat.message` | Projects assistant text through the `chat.message` hook, gated by enablement and a kill-switch, with byte-exact restore. Owns its own `isHookEnabled` (not the shared resolver) and `SK_COMMUNICATION_PROJECTION_DISABLED`. |
| `sk-git-preflight-advisory.js` | `git-preflight` | `tool.execute.before` for `bash`, `experimental.chat.system.transform` | Advises on Git command scope before execution. Buffers at most 20 advisory events and drains them on the next transform; never prints. |
| `sk-vision.js` | `sk-vision` | `tool` (13 `sk_vision_*` tools) | Symlink → `../skills/sk-vision/vision-runtime/dist/plugin.js`. Local vision adapter: OCR, inspect, detect, pixel analysis. Auto-inspect uses a 2s grace and never awaits full GPU. |
| `system-completion-sentinel.js` | `completion` | `event` (`session.created`/`idle`) | Checks completion evidence at session lifecycle points. On `session.idle`, resolves completion state via `ctx.client.session.messages()` (guarded, fail-open). Throttled-sweeps the shared state dir on `session.created`. |
| `system-deep-loop-guard.js` | `task-dispatch` | `event` (`session.created`), `tool.execute.before` | Checks deep-loop Task dispatches and repeat handoffs. Sweeps stale loop-guard state on `session.created`. |
| `system-dist-freshness-guard.js` | `dist-freshness` | `tool.execute.before`, `event` (`session.created`/`deleted`), `experimental.chat.system.transform` | Reports stale compiled outputs and invalidates diagnostics. Short-circuits the whole plugin at factory entry when disabled. |
| `system-skill-advisor.js` | `skill-advisor` | `experimental.chat.system.transform`, `event`, `tool` (`spec_kit_skill_advisor_status`) | Injects skill-routing guidance per prompt and exposes advisor status. Spawns the warm bridge subprocess; TTL+LRU prompt cache with in-flight dedup. |
| `system-spec-gate.js` | `spec-gate` | `experimental.chat.system.transform`, `tool.execute.before`, `event` | Classifies and evaluates mutation-gate state. Classify best-effort fetches the last user message via `ctx.client`; enforce throws `system-spec-gate:` on deny (OpenCode's deny signal). |
| `system-speckit-completion.js` | `speckit-completion` | `tool` (read-only completion evidence) | Exposes read-only completion evidence. Checks `core.DISABLED_ENV` directly at factory entry. |
| `lib/opencode-message-identity.js` | — (shared helper) | — | Stable transform identity and dedup state. Used by `system-skill-advisor.js` when `deduplicateTransforms` is on. |
| `tests/` | — | — | Plugin regression suites (see `tests/README.md`). |

---

## 3. DIRECTORY TREE

```text
plugins/
+-- README.md                              # this index
+-- cli-dispatch-audit.js
+-- codex-hooks-watchdog.js
+-- mcp-route-guard.js
+-- opencode-goal.js
+-- session-cleanup.js
+-- sk-code-post-edit-quality.js
+-- sk-communication-projection.js
+-- sk-git-preflight-advisory.js
+-- sk-vision.js                           # symlink -> ../skills/sk-vision/vision-runtime/dist/plugin.js
+-- system-completion-sentinel.js
+-- system-deep-loop-guard.js
+-- system-dist-freshness-guard.js
+-- system-skill-advisor.js
+-- system-spec-gate.js
+-- system-speckit-completion.js
+-- lib/
|   `-- opencode-message-identity.js       # shared transform-dedup helper
`-- tests/
    +-- README.md
    +-- helpers/
    `-- *.test.cjs
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `opencode-goal.js` | The largest plugin. Owns the goal state machine, supervisor, continuation, capabilities, and the goal tool surface. Hooks `session.created`/`status`/`idle`/`deleted`, `experimental.chat.system.transform`, and a family of goal tools. |
| `system-skill-advisor.js` | Spawns the skill-advisor bridge subprocess per prompt, manages a TTL+LRU prompt cache with in-flight dedup, integrates transform-dedup, and exposes `spec_kit_skill_advisor_status`. |
| `system-spec-gate.js` | Maps OpenCode's transport onto the runtime-neutral spec-gate core. Classify best-effort fetches the last user message via `ctx.client`; enforce throws `system-spec-gate:` on deny; `event` sweeps/advances/evicts state. |
| `sk-code-post-edit-quality.js` | Correlates `tool.execute.before` file paths to `tool.execute.after` callIDs, runs the post-edit router core, and drains findings on the next transform. |
| `lib/opencode-message-identity.js` | Shared stable transform identity and dedup state used by the advisor and memory plugins. |

---

## 5. CONFIGURATION

Every plugin is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver. Each plugin checks `isHookEnabled('<concern>')` at entry (some at factory entry, some per-hook) and returns a full no-op when disabled.

| Variable | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables every plugin in this folder along with every other repo hook. |
| Per-concern `SYSTEM_<CONCERN>_DISABLED=1` | Each plugin's canonical kill-switch (e.g. `SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED`, `SYSTEM_SPEC_MEMORY_DISABLED`). See each plugin's own README for its full env family. |
| Legacy / plugin-specific aliases | Several plugins carry additional aliases (e.g. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED`, `OPENCODE_GOAL_PLUGIN_DISABLED`, `SK_COMMUNICATION_PROJECTION_DISABLED`, `SK_CODE_POST_EDIT_QUALITY_DISABLED`). See each plugin's own README. |

Optional tuning: `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` (default 3000; owned by `system-skill-advisor`), `SYSTEM_OPENCODE_TRANSFORM_DEDUP=1` (opt-in transform dedup for the advisor and memory plugins), plus per-plugin cache/budget/timeout envs documented in each plugin's README.

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Transport only | Plugin files own the OpenCode transport boundary. Shared policy and runtime-neutral logic belongs under the owning skill. |
| No stdout/stderr | Plugins never print warnings to stdout or stderr — OpenCode overlays those onto the TUI prompt line and corrupts the interactive session. Findings go through `experimental.chat.system.transform`, tool returns, or bounded workspace logs. |
| Fail-open | All advisory checks fail open. A disabled plugin, a missing payload, a subprocess timeout, a parse failure, or any internal error resolves to a no-op. Rejection is opt-in per each plugin's own contract (e.g. `SYSTEM_SPEC_GATE_ENFORCE` for spec-gate deny). |
| Kill-switch | Every plugin honors its per-concern kill-switch via the shared `hook-flags.cjs` resolver plus the master `SYSTEM_HOOKS_DISABLED`. A disabled plugin is a genuine full no-op. |
| Bounded | Subprocess spawns, caches, pending-event buffers, and workspace logs are all bounded (per-plugin limits documented in each plugin's README). |
| Tests | Plugin tests stay under `tests/`. |

### Hook model

Plugin factories register some subset of:

- `tool` — tools exposed to the model (e.g. `spec_kit_skill_advisor_status`, the goal tools, the 13 `sk_vision_*` tools, the read-only completion-evidence tool).
- `tool.execute.before` — pre-tool evaluation (spec-gate enforce, git-preflight, mcp-route-guard, post-edit-quality path stash, deep-loop guard).
- `tool.execute.after` — post-tool evaluation (cli-dispatch-audit, post-edit-quality run).
- `experimental.chat.system.transform` — per-turn system-context injection (advisor, memory, spec-gate classify, goal, post-edit-quality drain, dist-freshness).
- `chat.message` — assistant message projection (sk-communication-projection).
- `event` — lifecycle handlers (`session.created`/`status`/`idle`/`deleted`/`resumed`/`compacted`/`compact`, `server.instance.disposed`/`global.disposed`).

---

## 7. VALIDATION

Run the Node regression command from the repository root:

```bash
node --test .opencode/plugins/tests/*.test.cjs
```

Expected result: Node discovers every current CJS test file and reports the suite result. A failing test is a validation failure.

```bash
for f in .opencode/plugins/*.js; do node --check "$f"; done
```

Expected result: no syntax errors across every plugin (resolves imports against the repo).

---

## 8. RELATED

- [`tests/README.md`](./tests/README.md): the plugin regression suites.
- [`tests/helpers/README.md`](./tests/helpers/README.md): the shared test helpers.
- [`../hooks/README.md`](../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix. Several plugins are mirrored there as the OpenCode adapter for their concern (`spec-gate`, `skill-advisor`, `git-preflight`, `session-cleanup`).
- [`../skills/`](../skills/): the shared skill cores these plugins adapt.
