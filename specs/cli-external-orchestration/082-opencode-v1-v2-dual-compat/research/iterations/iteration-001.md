# Iteration 1 — A1: v2 plugin API ground truth vs v1

## Focus

Establish the exact plugin API surface of OpenCode v1 (`@opencode-ai/plugin` 1.18.34, host 1.19.3) versus v2 (`@opencode/plugin` 2.0.32), covering every `ctx` domain, and emit a v1 hook/context-key → v2 target table with a citable source per row.

## Actions Taken

1. Read the installed v1 type surface: `dist/index.d.ts` (322 lines) — `PluginInput`, `Plugin`, `Hooks`, and the full hook set.
2. Discovered the installed v1 package already ships a `dist/v2/` subtree (`effect/` + `promise/`) and read `v2/promise/{plugin,context,registration,index}.d.ts`, `v2/options.d.ts`, and the domain hook files (`agent`, `command`, `skill`, `reference`, `aisdk`, `catalog`, `integration`) plus the `effect/` draft interfaces.
3. Read the exports map of `@opencode-ai/plugin@1.18.34` via `node -e` on its `package.json`.
4. Resolved package identities on npm: `@opencode/plugin` → version `2.0.32` (latest); `@opencode-ai/plugin` → `1.19.3` (latest).
5. Read `.opencode/plugins/` inventory and its `README.md` load-path statement; confirmed host `opencode --version` = `1.19.3`.
6. Fetched `https://opencode.ai/v2/docs/build/plugins/` (≈968 lines, first 29,991 bytes read) for the authoritative v2 narrative API.

## Findings

### F1 — v2 is a different plugin *architecture*, not a renamed hook bag

v1: a plugin is a function `(input: PluginInput, options?: PluginOptions) => Promise<Hooks>` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:51], where `Hooks` is a flat interface of optional async handlers [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:173].

v2: a plugin is an object `{ readonly id: string; readonly setup: (context: PluginContext) => Promise<void> | void }` produced by `define()` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/plugin.d.ts:3] [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/plugin.d.ts:6]. There is no `Hooks` object and no per-event callback bag; instead each domain is a *registry object* exposing `transform(callback)` returning a `Registration` with `dispose()` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/registration.d.ts:1], plus a `reload()` on reloadable domains.

Consequence: a dual-compatible plugin cannot be one function with feature-detected hook keys, because the *callable contract* differs (function vs. `{id, setup}`). It needs either two entrypoint modules or an adapter whose default export satisfies the v1 factory shape while also carrying `id`/`setup` for v2 — and whether v2 accepts a callable-with-`setup` is **UNVERIFIED** (no `.d.ts` or doc statement found permitting it).

### F2 — The v2 runtime package is `@opencode/plugin`, a *different* npm name from `@opencode-ai/plugin`

- `@opencode/plugin` latest = `2.0.32`; `@opencode-ai/plugin` latest = `1.19.3`. Two distinct packages, not two majors of one package.
- `@opencode-ai/plugin@1.18.34` (installed, pinned in `.opencode/package.json`) **does** export `./v2/promise` and `./v2/effect` subpaths [SOURCE: .opencode/node_modules/@opencode-ai/plugin/package.json] — i.e. the v1 package bundles a v2 *type preview*.
- The repo pins `1.18.34` while v1 head is `1.19.3`; the research topic targets 1.19.x, so the pinned dep is one minor behind the stated target.

### F3 — P1: the bundled v2 preview types are INCOMPLETE and must not be used as the compatibility target

`PluginContext` in the v1-bundled preview exposes only nine members: `options, agent, aisdk, catalog, command, integration, plugin, reference, skill` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts:12].

The 2.0.32 documentation documents at minimum also `app`, `location`, `session`, `tool`, `permission`, `provider`, `model`, `mcp`, `credential`, `generate`, and `storage` (e.g. `ctx.storage.set("loaded", true)` in the canonical example, `ctx.app.version`, `ctx.location.directory`). None of these exist in the local preview `.d.ts`.

Therefore: **any dual-compat design type-checked against the local `dist/v2` will fail at runtime on 2.0.32 and will silently omit the majority of the v2 API.** The 2.0.32 surface must be obtained from the real package (`npm pack @opencode/plugin@2.0.32`) in a follow-up iteration before any porting work. This also means `effect/*.d.ts` draft interfaces (`AgentDraft`, `SkillDraft`, `CommandDraft`, `ReferenceDraft`) are preview-era and may not match 2.0.32 editor shapes.

### F4 — Config schema diverges on the load key

v1: `Config.plugin?: Array<string | [string, PluginOptions]>` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:48] — singular key, tuple form for options.

v2: the documented key is **`plugins`** (plural), accepting strings, `"pkg@version"`, relative/absolute paths, `file://` URLs, and an object form `{ "package": ..., "options": {...} }`; options are read from `ctx.options` during `setup`. A single `opencode.json` therefore cannot express plugin registration identically for both hosts unless one host tolerates an unknown key — tolerance is **UNVERIFIED**.

### F5 — Load directory, extension and count of the repo's plugin fleet

`.opencode/plugins/` (a symlink to `../.skilled/plugins`) contains exactly **16** top-level plugin modules, all plain `.js` (no TypeScript, no build step): `classifier-injection-screen`, `cli-dispatch-audit`, `codex-hooks-watchdog`, `mcp-route-guard`, `opencode-goal`, `session-cleanup`, `sk-code-post-edit-quality`, `sk-git-message-gate`, `sk-git-preflight-advisory`, `sk-vision`, `system-completion-sentinel`, `system-deep-loop-guard`, `system-dist-freshness-guard`, `system-skill-advisor`, `system-spec-gate`, `system-speckit-completion`; plus non-plugin `lib/` and `tests/`.

The plugin README states OpenCode discovers them "via a flat glob over `.opencode/plugins/`" and "does not recurse" [SOURCE: .opencode/plugins/README.md:16]. Because the modules are plain JS with no compile step, a port is an in-place edit per file — there is no build artifact or `.d.ts` to keep in sync, which removes one whole class of dual-compat drift.

Note: `sk-vision.js` appears in the directory listing but was **not** matched by a `-type f -name '*.js'` find, so it is likely a symlink; its loadability under a flat glob on both hosts is **UNVERIFIED**.

### F6 — v1 hook → v2 target table

| v1 hook / context key | v1 anchor | v2 target (2.0.32 docs) | Confidence |
|---|---|---|---|
| plugin shape `(input) => Promise<Hooks>` | index.d.ts:51 | `Plugin.define({ id, setup })` | Confirmed (local `.d.ts` + doc example) |
| `dispose?()` | index.d.ts:174 | return value of `setup` (cleanup fn run on unload) | Confirmed (doc: "It may return a cleanup function that runs when the plugin unloads") |
| `event?({event})` | index.d.ts:175 | not in local preview; docs reference plugins receiving events | **UNVERIFIED** — resolve against 2.0.32 `.d.ts` |
| `config?(Config)` | index.d.ts:178 | `ctx.options` (plugin options only; no global config mutator seen) | **UNVERIFIED** — no documented config-domain in v2 |
| `tool?: {[key]: ToolDefinition}` | index.d.ts:179 | `ctx.tool` + synchronous `transform` registration; tool executor receives `(input, context)` with `sessionID`, `messageID`, `id` | Confirmed by doc; exact editor shape UNVERIFIED |
| `auth?: AuthHook` | index.d.ts:182 | `ctx.integration` (connect.key / oauth.connect / transform methods) | Confirmed by doc domain list |
| `provider?: ProviderHook` | index.d.ts:183 | `ctx.provider.transform` (`add`/`update`/`models.set`) and `ctx.model.transform` | Confirmed (doc Provider/Model reference blocks) |
| `"chat.message"` | index.d.ts:187 | none documented | **UNVERIFIED** — likely dropped |
| `"chat.params"` | index.d.ts:203 | none documented | **UNVERIFIED** — likely dropped |
| `"permission.ask"` | index.d.ts:225 | `ctx.permission.assert({ action, resources, save, agent, source })`, `ctx.permission.list/get/reply`, `evaluate` hooks | Confirmed by doc Permissions section |
| `"command.execute.before"` | index.d.ts:228 | `ctx.command.transform(editor => editor.add({ name, description, execute({sessionID, prompt, delivery}) }))` | Confirmed (doc CommandDefinition) |
| `"tool.execute.before"` | index.d.ts:235 | tool transform / tool executor pre-step | **UNVERIFIED** — no before/after split documented |
| `"tool.execute.after"` | index.d.ts:249 | tool transform / executor post-step | **UNVERIFIED** |
| `"shell.env"` | index.d.ts:242 | none documented | **UNVERIFIED** — likely dropped |
| `"tool.definition"` | index.d.ts:316 | `ctx.tool.transform` (update) | Plausible, UNVERIFIED |
| `"experimental.*"` (messages/system transform, compacting, autocontinue, text.complete, provider.small_model) | index.d.ts:262–315 | `ctx.session.compact(...)` for compaction request; others none documented | **UNVERIFIED** |
| `PluginInput.client` | index.d.ts:36 | `ctx` IS "essentially an OpenCode server client" plus plugin-only methods | Confirmed (doc "Context" section) |
| `PluginInput.directory` / `worktree` / `project` | index.d.ts:36 | `ctx.location.{directory, workspaceID, project:{id,directory,canonical}}` | Confirmed (doc "Context" section) |
| `PluginInput.serverUrl`, `PluginInput.$` (BunShell) | index.d.ts:36 | none documented | **UNVERIFIED** — `$` shell access appears absent in v2 |
| `PluginInput.experimental_workspace.register` | index.d.ts:36 | `ctx.reference` (local/git sources) is the nearest analogue | **UNVERIFIED** — not equivalent |
| — (no v1 analogue) | — | `ctx.storage` get/set/remove/scan (durable JSON, plugin-scoped), `ctx.generate.text`, `ctx.session.*` lifecycle, `ctx.mcp.transform`, `ctx.credential.activate`, `ctx.app.version` | Confirmed by doc; absent from preview `.d.ts` |

Three v1 capabilities have **no documented v2 home**: `"shell.env"` (environment injection into shell tool invocations), the `"chat.*"` param/header/message mutators, and the `experimental.*` family. Those are the irreducible gaps for the plugins that depend on them and must be individually triaged per plugin in a later iteration.

## Questions Answered

Partial only — no strategy key question is fully satisfied yet:
- *Which plugin shape and API surface loads and behaves correctly on both v1 and v2?* — the v2 **shape** is now confirmed; dual-**loading** behaviour remains unproven.

## Questions Remaining

1. Does the 2.0.32 `@opencode/plugin` `.d.ts` match the preview bundled in 1.18.34, and what is the real `PluginContext` domain list? (blocking, P1)
2. Can one module default-export satisfy both contracts (function + `{id, setup}`), or is a two-file split mandatory?
3. Which of the 16 repo plugins touch `"shell.env"`, `"chat.*"`, `experimental.*`, or `PluginInput.$` — i.e. which hit irreducible gaps?
4. Does v1 tolerate the `plugins` (plural) config key, and does v2 tolerate `plugin` (singular)? Does v1 load `.opencode/plugins/` or only `.opencode/plugin/`?
5. Is `sk-vision.js` a symlink, and does a flat glob follow symlinks on both hosts?

## Next Focus

A2: `npm pack @opencode/plugin@2.0.32` into `scratch/`, extract, and diff its `.d.ts` against the 1.18.34 preview — settle F3 and close the P1 gap before any porting design.

## SCOPE VIOLATIONS

None. No file outside the iteration write paths was modified. `npm view` and `node -e` reads only; no install performed.

## GATEWAY OBSERVATION (f-iter001-007, P1)

The append gateway accepted the record (`ok:true`, ledger sequence 5, `projectionRefreshed:true`) but its write into `deep-research-state.jsonl` is a **reduced projection**: the committed row carries only `type, iteration, run, status, newInfoRatio, ruledOut, timestamp`. `runId`/`sessionId`/`lineageId`, `focus`, `mode`, `target_agent`, `answeredQuestions` and the 11-element `graphEvents` array were all dropped, even though the payload handed to `--event-json` carried them (verified before dispatch).

Impact: the contract requires those fields on the canonical record and the reducer derives the convergence graph from `graphEvents`; a run reading only the state log would report a node count of 0 and see no answered questions. Mitigation applied here: the full record plus every finding, invariance and graph event is preserved verbatim in `deltas/iter-001.jsonl`, which is therefore the authoritative artifact for this iteration. Recorded as `f-iter001-007` and `inv-iter001-003` rather than worked around, since the gateway is the only permitted writer of the state log.
