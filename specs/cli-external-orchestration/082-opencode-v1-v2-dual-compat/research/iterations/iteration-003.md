# Iteration 3 — A3: per-plugin port matrix (16 plugins × v1 hook → v2 target)

## Focus

For each of the 16 modules in `.opencode/plugins/*.js`: enumerate every v1 hook key, `client.*` call, event type and `PluginInput` field used (with `file:line`), map it to a v2 target, and classify the gap as **none**, **workaround** or **irreducible**. Also assess whether each plugin's core logic can move into a shared module that both entry points consume, and explain why `classifier-injection-screen.js` fails differently on v2.

This iteration finally read `https://opencode.ai/v2/docs/build/plugins/migrate-v1/` **in full** (the A1 iteration read only `/build/plugins/`), which resolves almost every "UNVERIFIED — likely dropped" row from iteration 1.

## Actions Taken

1. Re-read iteration 1's findings (F1–F6) to carry its v1 anchor table forward.
2. Grepped the hook-key census across all 16 plugins — three passes because the fleet mixes quoted keys (`'tool.execute.before'`), unquoted method shorthand (`async event(input)`) and object-literal form (`event: async ...`). The first pass over single-quote-only patterns reported 11 of 16 plugins as hook-free; that was a pattern bug, not an absence.
3. Grepped `client.*` calls, `$` usage, `shell.env` / `chat.*` / `experimental.*` occurrences, and `ctx`/`input` property reads per file.
4. Read the return-object tails of `classifier-injection-screen.js` and `system-completion-sentinel.js` in full (both hang a `__test` surface off the default export).
5. Read the migrated doc `build/plugins/migrate-v1` end to end: config normalization, entrypoint replacement, context table, hook table, request hooks, custom tools, events/cleanup, options/storage, the official "Support V1 and V2 from one package" pattern, and the verification checklist.
6. Confirmed `sk-vision.js` is a symlink, that `opencode.json` declares **no** plugin keys at all, that `.opencode/package.json` pins `@opencode-ai/plugin` `1.18.34`, and that the installed host is `1.19.3`.
7. Grepped the fleet's imports from `@opencode*` packages to find every version-coupled module specifier.

## Findings

### F1 (P0) — The dual-entry question is settled by an officially documented shape: ONE module, object default export with both `setup` and `server`

Iteration 1 (F1) concluded "two entrypoint modules, or an adapter whose default export is callable *and* carries `setup`". The migrate-v1 doc specifies a third, first-party shape: spread the `Plugin.define({id, setup})` result into an object and add an `async server()` method. "V1 calls `server()` and V2 calls `setup()`. The APIs remain separate; this shape does not translate hooks automatically." V1 **object entrypoints are supported in OpenCode `1.18.29` and newer**, and the installed host is `1.19.3`, so the repo is inside the supported window. No monorepo split, no separate package versions, no build step, and no runtime version detection is required for the 16 local plugins.

Consequence for the port: each plugin's default export changes from `export default async function X(ctx) {...}` to

```js
export default {
  ...Plugin.define({ id: 'sk-<name>', async setup(ctx) { /* v2 registrations */ } }),
  async server(ctx) { return { /* existing v1 hooks, unchanged */ }; },
};
```

The v1 body stays byte-identical; only the wrapper changes. The v2 body is new code.

### F2 (P0, corrects iteration 1's F6) — `shell.env`, `chat.*` and `experimental.*` are NOT dropped; iteration 1's "irreducible gaps" list was wrong on four of five items

The migrate-v1 hook table gives an explicit v2 destination for every key iteration 1 marked "UNVERIFIED — likely dropped":

| v1 hook | v2 target (authoritative) |
| --- | --- |
| `event` | `ctx.event.subscribe()` (async iterable + `AbortSignal`) |
| `dispose` | cleanup function returned by `setup` |
| `config` | transforms on the affected domains (no global mutable config in v2) |
| `tool` map | `ctx.tool.transform(editor => editor.add({…}))`, JSON Schema input, `execute` returns `{ content }` |
| `auth` | `ctx.integration.transform(...)` |
| `provider` | `ctx.provider.transform(...)` + `ctx.model.transform(...)` |
| `chat.message` | `ctx.session.hook("prompt", …)` |
| `chat.params` | `ctx.session.hook("context", …)` |
| `chat.headers` | `ctx.session.hook("model.request", …)` / `"http.request"` |
| `permission.ask` | `ctx.permission.hook("evaluate", …)` |
| `command.execute.before` | command transforms, or the prompt hook — **no global 1:1 hook** |
| `tool.execute.before` | `ctx.tool.hook("execute.before", …)` |
| `tool.execute.after` | `ctx.tool.hook("execute.after", …)` |
| `shell.env` | `ctx.shell.hook("create.before", …)` → `event.env.X = …` |
| `tool.definition` | `ctx.tool.transform(…)` |
| `experimental.chat.system.transform` | `ctx.session.hook("context", …)`, edit `event.system` |
| `experimental.chat.messages.transform` | `ctx.session.hook("context", …)`, edit `event.messages` |
| `experimental.session.compacting` | `ctx.session.hook("compaction", …)` |

Genuinely irreducible (doc-stated, no destination offered): `experimental.compaction.autocontinue`, `experimental.provider.small_model`, `experimental.text.complete`, the global form of `command.execute.before`, and `$` ("import and manage the process API your plugin uses").

**But none of them is used by the repo fleet** — see F3. The irreducible list is therefore a documentation footnote for this repo, not a design constraint, with one exception: `sk-vision`'s `command.execute.before`.

### F3 (P0) — Hook census across the 16 files (the matrix)

| Plugin | v1 hooks / keys used (file:line) | ctx / client reads | v2 target | Gap |
| --- | --- | --- | --- | --- |
| `classifier-injection-screen.js` | `tool.execute.after` :73, `experimental.chat.system.transform` :85 | `input.sessionID\|sessionId\|session.id\|properties.sessionID` :40, `input.tool` :76 | `ctx.tool.hook("execute.after")`, `ctx.session.hook("context")` | **workaround** (string→block, session-id shape — see F9) |
| `cli-dispatch-audit.js` | `tool.execute.before` :70, `tool.execute.after` :100 | `ctx.directory` :58 | `ctx.tool.hook("execute.before"/"execute.after")` | workaround (arity) |
| `codex-hooks-watchdog.js` | `event` :74 | `ctx.directory` :66 | `ctx.event.subscribe()` + `AbortController` | **workaround** (callback → iterator) |
| `mcp-route-guard.js` | `tool.execute.before` :81 | `ctx.directory` :78 | `ctx.tool.hook("execute.before")` | workaround (arity) |
| `opencode-goal.js` | `event` :3312, `experimental.chat.system.transform` :3321, `tool` :3327 | `ctx.directory` :3267/:3280/:3288, `ctx.client` :3266/:3279/:3287 | `ctx.event.subscribe()`, `ctx.session.hook("context")`, `ctx.tool.transform` | **workaround+** (tool DSL, F7) |
| `session-cleanup.js` | `event` :237, `experimental.chat.system.transform` :253, `dispose` :262 (no-op placeholders :115–:117) | — | `ctx.event.subscribe()`, `ctx.session.hook("context")`, cleanup fn | workaround (dispose channel differs) |
| `sk-code-post-edit-quality.js` | `tool.execute.before` :143, `tool.execute.after` :156, `experimental.chat.system.transform` :185 | `ctx.directory` :129, `input.tool` :146 | tool hooks + `context` hook | workaround (arity + blocks) |
| `sk-git-message-gate.js` | `tool.execute.before` :43 | `ctx.directory` :38 | `ctx.tool.hook("execute.before")` | workaround (arity) |
| `sk-git-preflight-advisory.js` | `tool.execute.before` :95, `experimental.chat.system.transform` :129 | `ctx.directory` :79 | tool hook + `context` hook | workaround (arity + blocks) |
| `sk-vision.js` | `command.execute.before` :13880, `event` :13881, `chat.message` :13896, `tool` :13901, `dispose` :13902 | `client.session.messages` :13813, `client.tui.showToast` :13865 | `ctx.command.transform` (owns `/vision`), `ctx.event.subscribe()`, `ctx.session.hook("prompt")`, `ctx.tool.transform`, cleanup fn | **irreducible for the global command hook**; `client.tui` has no ctx domain in this table (F8) |
| `system-completion-sentinel.js` | `event` :124 | `ctx.directory` :120, `client.session.messages` :66/:77/:79/:141 | `ctx.event.subscribe()`, `ctx.session.messages(…)` | workaround |
| `system-deep-loop-guard.js` | `event` :63, `tool.execute.before` :71 | `ctx.directory` :58 | both map 1:1 | workaround (arity) |
| `system-dist-freshness-guard.js` | `tool.execute.before` :201, `event` :213, `experimental.chat.system.transform` :235 | `ctx.directory` :143, `input.tool` :178 | all three map | workaround (arity + blocks) |
| `system-skill-advisor.js` | `event` :1382, `experimental.chat.system.transform` :1446, `tool` :1448 | `ctx.directory` :939, `ctx.client` :1231, `input.session` :777 | all three map | **workaround+** (tool DSL + event-shape-driven lifecycle state machine) |
| `system-spec-gate.js` | `event` :178, `experimental.chat.system.transform` :204, `tool.execute.before` :254 | `ctx.directory` :169, `ctx.client` :90, `input.tool` :257 | all three map | **workaround+** (`client.session.messages` v1 tree-request args; `ctx.location` scoping, F5) |
| `system-speckit-completion.js` | `tool` :57–:58 | `ctx.directory` :54 | `ctx.tool.transform` | **workaround+** (tool DSL, F7) |

Census totals (grep-verified, per file):

| Key | Files | Count |
| --- | --- | --- |
| `event` | codex-hooks-watchdog, opencode-goal, session-cleanup, sk-vision, system-completion-sentinel, system-deep-loop-guard, system-dist-freshness-guard, system-skill-advisor, system-spec-gate | 9 / 16 |
| `tool.execute.before` | cli-dispatch-audit, mcp-route-guard, sk-code-post-edit-quality, sk-git-message-gate, sk-git-preflight-advisory, system-deep-loop-guard, system-dist-freshness-guard, system-spec-gate | 8 / 16 |
| `experimental.chat.system.transform` | classifier-injection-screen, opencode-goal, session-cleanup, sk-code-post-edit-quality, sk-git-preflight-advisory, system-dist-freshness-guard, system-skill-advisor, system-spec-gate | 8 / 16 |
| `tool` map | opencode-goal, sk-vision, system-skill-advisor, system-speckit-completion | 4 / 16 |
| `tool.execute.after` | classifier-injection-screen, cli-dispatch-audit, sk-code-post-edit-quality | 3 / 16 |
| `dispose` | session-cleanup, sk-vision | 2 / 16 |
| `chat.message` | sk-vision | 1 / 16 |
| `command.execute.before` | sk-vision | 1 / 16 |
| `shell.env`, `chat.params`, `chat.headers`, `permission.ask`, `tool.definition`, `config`, `auth`, `provider`, `$`, `PluginInput.project/worktree/serverUrl/experimental_workspace` | — | **0 / 16** |

So the portable surface of this fleet is five hook keys, and 15 of 16 plugins sit entirely inside it. Iteration 1's fear — that the fleet depended on the irreducible v1-only set — is falsified by measurement.

### F4 (P1) — The callback-arity change is universal and unavoidable; the `system` payload change is the highest-volume single edit site

Every v1 hook in the fleet takes `(input, output)`; v2 hands the callback **one mutable event**. Even the 1:1 mappings (`tool.execute.before` → `execute.before`) must be rewritten at the boundary, because `output.args` / `output.output` / `output.system` no longer arrive as a second parameter. For the 8 plugins on `experimental.chat.system.transform`, the payload itself changes type: v1 `output.system` is a `string[]` that plugins push strings into, v2 `event.system` is a structured block array — the documented form is `event.system.push({ type: "text", text: "Focus on correctness." })`. `classifier-injection-screen.js` demonstrates the v1 assumption plainly: `output.system = Array.isArray(output.system) ? output.system : []` then `output.system.push(...pending)` [SOURCE: .opencode/plugins/classifier-injection-screen.js:103]. Eight plugin bodies carry that assumption.

### F5 (P1) — `ctx.location.directory` is not a drop-in for `ctx.directory`: v2 scopes it to the plugin *instance*, not the observed session

13 of 16 plugins capture a project root from `ctx?.directory` (or `context?.directory`) at factory time and then use it as the base for every path comparison — guard allowlists, log paths, spec-folder resolution. The migrate-v1 doc states explicitly that `ctx.location` "describes the location where this plugin instance loaded. It is not the location of every session or event the plugin may observe." On a multi-location v2 host, a plugin that resolves a hook's file path against its load-time root can compare across two different roots and pass a guard it should have failed. The documented workaround is to read session/location data from the event when the distinction matters, falling back to `ctx.location.directory`. Highest-risk members: `system-spec-gate`, `system-dist-freshness-guard`, `sk-git-message-gate`, `sk-git-preflight-advisory`, `mcp-route-guard`.

### F6 (P1) — Shared module-level singletons change meaning: per-load becomes per-instance across a `reload()`

v1 factories run once per plugin load; v2 calls `setup(ctx)` per plugin instance and documents `reload()` on reloadable domains plus `registration.dispose()`. The fleet keeps mutable module state in two places: `pendingBySession` in `classifier-injection-screen.js` and `SHARED_TRANSFORM_DEDUP_STATE` in `lib/opencode-message-identity.js` (reached through `getSharedTransformDedupState`). ESM guarantees one module instance per process in both hosts, so the state itself does not duplicate — but a v2 `reload()` re-registers hooks against surviving state that already holds keys from the previous registration generation. The dedup maps need an instance/generation namespace (for example `ctx.location.project.id` plus a generation counter) or an explicit reset on the setup path, otherwise the first post-reload turn is suppressed as a duplicate.

### F7 (P1) — Three plugins import a v1-only subpath; v2 has no `tool()` helper at all

`import { tool } from '@opencode-ai/plugin/tool'` appears at [SOURCE: .opencode/plugins/opencode-goal.js:16], [SOURCE: .opencode/plugins/system-skill-advisor.js:24] and [SOURCE: .opencode/plugins/system-speckit-completion.js:28]. In v2, tools are registered through the synchronous editor `ctx.tool.transform(editor => editor.add({ name, description, input: <JSON Schema>, execute }))` and `execute` returns structured content (`{ content: ... }`), not a bare string. There is no `@opencode/plugin/tool` equivalent and no `tool.schema` DSL. These three files are the only version-coupled *imports* in the fleet, and their v2 branch must hand-write JSON Schema while the v1 branch keeps `tool()`. `sk-vision.js` is exempt from the import problem because it vendors its own `tool(input)` shim in the bundle [SOURCE: .opencode/plugins/sk-vision.js:12996] — but that shim produces the v1 tool shape regardless.

### F8 (P1) — `sk-vision.js` is the one plugin that cannot be ported in place: it is a symlink into a build artifact

`.opencode/plugins/sk-vision.js -> ../skills/sk-vision/vision-runtime/dist/plugin.js` — a 13,911-line bundle with vendored valibot/zod. Consequences: (a) a dual-compat edit must land in `vision-runtime`'s source and be rebuilt, so this plugin alone needs a build step the other 15 do not; (b) the symlink escaped a `-type f` scan in iteration 1, which is a real hazard for any version-aware inventory script written against the directory; (c) it is the only user of `command.execute.before` [SOURCE: .opencode/plugins/sk-vision.js:13880] and the only user of `chat.message` [SOURCE: .opencode/plugins/sk-vision.js:13896]; (d) it calls `client.tui.showToast` [SOURCE: .opencode/plugins/sk-vision.js:13865], and TUI surfaces are not in the migrate-v1 ctx table at all — the doc defers TUI extensions to a separate `/build/plugins/cli` page, which remains **UNVERIFIED** and is the last open blocker for this plugin.

### F9 (P0) — Why `classifier-injection-screen.js` fails differently on v2: three independent failure modes, all silent by construction

Its design contract is fail-open: "a transform error must never block the turn" [SOURCE: .opencode/plugins/classifier-injection-screen.js:105]. Under v1 that is a benign property — the types line up, so a failure means "no advisory this turn". Under v2 the same three assumptions each break *inside that catch*:

1. **Payload type.** It pushes raw strings into `output.system` [SOURCE: .opencode/plugins/classifier-injection-screen.js:104]. On v2 `event.system` holds blocks, so the push either throws or injects malformed context; the blanket catch converts the throw into a silently discarded advisory.
2. **Session correlation.** `sessionIdOf` probes `input?.sessionID ?? input?.sessionId ?? input?.session?.id ?? input?.properties?.sessionID` [SOURCE: .opencode/plugins/classifier-injection-screen.js:40] — none of which is the v2 `execute.after` / `context` event shape. Every advisory then lands under `UNKNOWN_SESSION`, and the single-buffered-session adoption heuristic [SOURCE: .opencode/plugins/classifier-injection-screen.js:88] only fires when exactly one session holds a buffer, which a multi-location v2 host does not guarantee.
3. **Source of the text.** The screen consumes `fetchedText(output?.output)` [SOURCE: .opencode/plugins/classifier-injection-screen.js:77] from the `webfetch` tool result. Whether the v2 `execute.after` event still exposes the result body is **UNVERIFIED**; if it does not, the plugin is a no-op with nothing to scan.

Net effect: the other 15 plugins fail *visibly* on v2 (a missing registration, a thrown hook, a tool that never appears). This one fails **invisibly in both directions** — no throw escapes, no log line is written, and no unit test can catch it because the buffer is in-memory per process. It needs a v2-specific test that asserts on the registered context-hook payload shape, not on the buffer contents.

### F10 (P1) — Shared-module split: feasible for 15 of 16, and it matches practice already in the repo

`lib/` holds two modules and neither is per-plugin:

- `lib/skill-advisor-render.js` — 136 lines of pure string rendering (`FALLBACK_DIRECTIVE`, `SETUP_WORDING`, `renderPluginFallbackDirective`, `compiledRouteSummaryTargetDigest`). Reads no `ctx`, no `input`. **Reusable unchanged on both hosts.**
- `lib/opencode-message-identity.js` — 464 lines. Its state machine (`createTransformDedupState`, `reserveDeliveryKey`, `commitTransformDelivery`, `checkTransformDelivery`) is shape-agnostic, but its key derivation (`sessionValueFrom`, `messageValueFrom`, `ordinalValueFrom`) reads v1 `input` fields [SOURCE: .opencode/plugins/lib/opencode-message-identity.js:63]. That layer needs a v2 event adapter; the rest survives as-is.

Only `system-skill-advisor.js` imports `lib/` today [SOURCE: .opencode/plugins/system-skill-advisor.js:26], but two plugins already take their core from an external module and re-export it for tests (`sentinelCore` in `system-completion-sentinel`, `dispatchAuditCore` in `cli-dispatch-audit`). So "pure core module + one entry file exporting both `setup` and `server`" is the repo's existing idiom, not a new invention.

Per-plugin split verdict:

| Plugin | Split verdict |
| --- | --- |
| `sk-git-message-gate` (68 L), `system-deep-loop-guard` (100 L), `codex-hooks-watchdog` (99 L), `mcp-route-guard` (100 L), `system-speckit-completion` (90 L) | **easy** — core is small and ctx-free; only the tool helper forks |
| `classifier-injection-screen` (122 L), `session-cleanup` (270 L), `sk-code-post-edit-quality` (214 L), `sk-git-preflight-advisory` (140 L), `system-dist-freshness-guard` (246 L), `system-completion-sentinel` (174 L), `cli-dispatch-audit` (137 L) | **easy** — extract the pure logic, entry keeps two thin adapters (two of these already are) |
| `opencode-goal` (3390 L) | **yes, with a fork point** — all logic is ctx-agnostic except the `tool()` definitions, which fork per version |
| `system-skill-advisor` (1488 L) | **yes, with an adapter** — needs a v2 event adapter in `lib/opencode-message-identity.js`, plus the tool fork |
| `system-spec-gate` (308 L) | **yes, with an adapter** — `fetchLastUserPromptViaClient` [SOURCE: .opencode/plugins/system-spec-gate.js:88] uses v1 tree-request args (`{ path: { id }, query: { directory, limit } }`); the v2 domain signature is UNVERIFIED |
| `sk-vision` (13,911 L bundled) | **no** — split must happen in `vision-runtime` source; rebuilt bundle, not an in-place edit |

### F11 (P2) — `__test` hung off the default export is a v2 hazard

`classifier-injection-screen.js` attaches `injectionScreenPlugin.__test = {...}` [SOURCE: .opencode/plugins/classifier-injection-screen.js:117] and `system-completion-sentinel.js` attaches `MkCompletionSentinelPlugin.__test` [SOURCE: .opencode/plugins/system-completion-sentinel.js:171], both with comments warning that a stray *named* export makes OpenCode load every export as a separate plugin. Under the F1 dual object, `__test` sits as an unknown top-level key beside `id` / `setup` / `server`, and the v2 loader's tolerance for extra keys on a plugin definition is **UNVERIFIED**. Safer: move the test surface into the extracted core module (where `sentinelCore`-style named exports are already imported, not exported) or gate it on a test-only env var.

### F12 (P2) — The repo declares zero plugins in config, so the `plugin` vs `plugins` key divergence is moot for this fleet

Neither `plugin` nor `plugins` appears in `opencode.json` or `.opencode/opencode.json`; all 16 modules load through directory discovery, and v2 "discovers local plugins from both `.opencode/plugin/` and `.opencode/plugins/`" while recommending `.opencode/plugins/` for v2 files. So iteration 1's F4 worry — one `opencode.json` that cannot express registration identically on both hosts — does not bite here: the fleet needs **no** config key at all on either host. Only plugins installed *into other projects* (via `cli-opencode`) would need the plural/singular note, and there the migration is the documented tuple→object rewrite.

`@opencode-ai/plugin` is pinned at `1.18.34` [SOURCE: .opencode/package.json:7] against a v1 head of `1.19.3`, and the installed host is `1.19.3` — the only version-coupled dependency in the repo, one minor behind.

## Questions Answered

- **Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?** — Answered. The shape is a single default-exported object spreading `Plugin.define({id, setup})` with an added `async server()`; v1 ≥1.18.29 dispatches to `server()`, v2 to `setup()`, with no hook translation and no runtime detection. All 16 plugins are ported above: 15 are `none`/`workaround` inside a five-key surface (`event`, `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform` → `context`, `tool` map), and 1 (`sk-vision`) is irreducible on the global `command.execute.before` plus unresolved on `client.tui`.

## Questions Remaining

1. `ctx.tool` / `ctx.session.hook("execute.after")` event shape: does it still expose the tool result body, and under which key? Blocks F9 item 3 and 3 plugins' `after` hooks.
2. `ctx.session.messages(...)` signature in 2.0.32 vs the v1 tree-request args used at `.opencode/plugins/system-spec-gate.js:90` and `.opencode/plugins/system-completion-sentinel.js:80`. (blocking for those two)
3. Does v2's loader tolerate unknown top-level keys on a plugin definition (`__test`)? (F11)
4. Where does `client.tui.showToast` live in v2 — `/build/plugins/cli` page unread; `ctx.tui` is **UNVERIFIED** and is the last blocker for `sk-vision`.
5. Does the 2.0.32 `@opencode/plugin` `.d.ts` exist and match the migrate-v1 narrative (confirm the `session.hook` / `tool.hook` / `shell.hook` names and their event payload types)? Still the carried-forward P1 from iteration 1 — `npm pack @opencode/plugin@2.0.32` was **not** performed this iteration (the doc read answered the *names*, not the *types*).
6. Does `ctx.shell.hook("create.before")` exist as documented even though no repo plugin needs it? (doc-only, low priority)

## Next Focus

A4: resolve the type-level questions in one pass — `npm pack @opencode/plugin@2.0.32` into `scratch/`, extract, and read `dist/**/*.d.ts` for (a) the exact `session.hook` / `tool.hook` / `shell.hook` overloads and event types, (b) `ctx.session.messages` vs the v1 tree-request call sites, (c) `ctx.tui` presence, (d) whether `Plugin.define`'s return type permits extra top-level keys. That single artifact settles remaining questions 1–6 and closes iteration 1's P1.

## SCOPE VIOLATIONS

None. No file outside the iteration write paths was modified. `grep`, `sed -n`, `wc`, `opencode --version` and one `fetch_content` only; no install, no build, no `npm pack` performed in this iteration.

## Gateway note

As recorded in iteration 1 (`f-iter001-007`), the append gateway accepts the record but its projection into `deep-research-state.jsonl` is reduced. `deltas/iter-003.jsonl` therefore carries the full record, every finding with `sources`, and the graph events, and is the authoritative artifact for this iteration.
