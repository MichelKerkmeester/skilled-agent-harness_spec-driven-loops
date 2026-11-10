# Iteration 2 — A2: v1 loader ground truth and the real 2.0.32 v2 types

## Focus

Close the P1 gap from iteration 1: obtain the **real** `@opencode/plugin@2.0.32` type surface (not the 1.18.34 preview), and empirically establish which plugin default-export shapes the OpenCode v1 1.19.3 loader accepts and how it dispatches them.

## Actions Taken

1. `npm pack @opencode/plugin@2.0.32` into `scratch/a2-v2pkg/`, extracted the tarball, inventoried all 58 `.d.ts` files and the package manifest.
2. Read the real context/plugin contract: `dist/promise/plugin.d.ts` (60 lines), `dist/promise/index.d.ts`, `dist/promise/types.d.ts`, `dist/options.d.ts`, `dist/storage.d.ts`, `dist/app.d.ts`, `dist/host.d.ts`, `dist/source.d.ts`, `dist/runtime.d.ts`, and the compiled `dist/promise/plugin.js` + `dist/promise/adapter.js` (line 449).
3. Read the 1.18.34 preview `dist/v2/promise/context.d.ts` and `plugin.d.ts` side by side with the real package for a member-by-member diff.
4. Built an isolated v1 probe project at `scratch/a2-v1probe/project/` with three default-export shapes in `.opencode/plugins/`, each appending to `scratch/a2-v1probe/markers/load.log`: (a) `00-a-v1fn.js` plain async function, (b) `01-b-object.js` object `{ id, setup, server }`, (c) `02-c-hybrid.js` a function carrying `.id` and `.setup`.
5. Enumerated v1 debug subcommands and found the no-model-call plugin-loading vehicle, then ran it twice, comparing the marker log before/after.

## Findings

### F1 — P0: the real 2.0.32 type is named `Context`, has 26 members, and `PluginContext` does not exist

The real package declares:

```ts
export interface Context {
    readonly app: App;
    readonly location: Location.Info;
    readonly options: PluginOptions;
    readonly agent: AgentDomain;
    readonly aisdk: AISDKDomain;
    readonly command: CommandDomain;
    readonly credential: Pick<CredentialApi, "activate">;
    readonly event: EventDomain;
    readonly experimental: { readonly terminal: Pick<OpenCodeClient["experimental"]["persistentPty"], "read"> };
    readonly integration: IntegrationDomain;
    readonly mcp: MCPDomain;
    readonly model: ModelDomain;
    readonly generate: GenerateApi;
    readonly permission: PermissionDomain;
    readonly plugin: Pick<PluginApi, "list">;
    readonly provider: ProviderDomain;
    readonly reference: ReferenceDomain;
    readonly rpc: RpcDomain;
    readonly session: SessionDomain;
    readonly shell: ShellDomain;
    readonly skill: SkillDomain;
    readonly storage: StorageDomain;
    readonly tool: ToolDomain;
    readonly vcs: VcsDomain;
    readonly websearch: WebSearchDomain;
    readonly worktree: WorktreeDomain;
}
```

[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:25]

`grep -rn "PluginContext" dist/promise/*.d.ts` over the extracted 2.0.32 package returns **zero hits**. The name used by the 1.18.34 preview does not exist in the shipping 2.0.32 API at all. Any dual-compat code that imports `PluginContext` from `@opencode/plugin` fails to compile; the import must be `Context`.

### F2 — P0: the 1.18.34 preview is not a subset — it contains a `catalog` domain that 2.0.32 dropped

Preview (9 members) [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts:11]:
`options, agent, aisdk, catalog, command, integration, plugin, reference, skill`.

Real 2.0.32 (26 members) [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:26]:

| Domain | preview 1.18.34 | real 2.0.32 |
|---|---|---|
| `options` | ✓ | ✓ |
| `agent` | ✓ | ✓ |
| `aisdk` | ✓ | ✓ |
| `command` | ✓ | ✓ |
| `integration` | ✓ | ✓ |
| `plugin` | ✓ (`PluginDomain.add/remove`) | ✓ (`Pick<PluginApi,"list">` only) |
| `reference` | ✓ | ✓ |
| `skill` | ✓ | ✓ |
| **`catalog`** | ✓ | **absent** |
| `app` | — | ✓ `{name, version, channel}` |
| `location` | — | ✓ `Location.Info` |
| `credential` | — | ✓ `activate` |
| `event` | — | ✓ |
| `experimental` | — | ✓ `{terminal.read}` |
| `mcp` | — | ✓ |
| `model` | — | ✓ |
| `generate` | — | ✓ |
| `permission` | — | ✓ |
| `provider` | — | ✓ |
| `rpc` | — | ✓ |
| `session` | — | ✓ |
| `shell` | — | ✓ |
| `storage` | — | ✓ |
| `tool` | — | ✓ |
| `vcs` | — | ✓ |
| `websearch` | — | ✓ |
| `worktree` | — | ✓ |

Consequence: **18 domains added, 1 removed (`catalog`), 1 `.plugin` surface narrowed.** Type-checking a v2 plugin against `.opencode/node_modules/@opencode-ai/plugin/dist/v2/**` yields code that both under-uses the real API and references a `catalog` domain that no longer exists. This confirms and sharpens iteration 1's F3 from "incomplete" to "wrong in both directions".

### F3 — P1: real 2.0.32 `setup` returns a `Cleanup` function, giving v1's `dispose` a v2 home

```ts
export type Cleanup = () => Promise<void> | void;
export interface Plugin {
    readonly id: string;
    readonly setup: (context: Context) => Promise<Cleanup | void> | Cleanup | void;
}
export declare function define(plugin: Plugin): Plugin;
```

[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:55] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:56] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:60]

The preview declared `setup: (context: PluginContext) => Promise<void> | void` — **no return value** [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/plugin.d.ts:4]. So the preview cannot express teardown at all, while 2.0.32 can. The runtime honours it: `Effect.acquireRelease(Effect.promise(() => Promise.resolve(plugin.setup(context2))), (cleanup) => (cleanup ? Effect.promise(() => Promise.resolve(cleanup())) : Effect.void))` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/adapter.js:449].

This closes iteration 1's UNVERIFIED row "`dispose?()` → return value of `setup`": it is **confirmed** on the real API and confirmed in the compiled adapter. `define()` is an identity function that returns its argument unchanged [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.js:1], so it is optional sugar, not a requirement — a plain object literal is indistinguishable to the loader.

Also relevant: the adapter calls `plugin.setup(...)` unconditionally on whatever the module exported. A default export without a callable `.setup` therefore fails *inside the adapter*, not at a validation boundary.

### F4 — P0: v1 1.19.3 accepts all three default-export shapes, but dispatches them differently

Probe vehicle discovery: `opencode debug --help` lists `config`, `lsp`, `rg`, `file`, `scrap`, `skill`, `snapshot`, `startup`, `agent <name>`, `v2`, `info`, `paths`, `wait` [SOURCE: .opencode/plugins/README.md:16]. Empirically:

- `opencode debug startup` printed only a timing number (`238.080333`) and wrote **no** markers → it does **not** load plugins.
- `opencode debug config` **does** load plugins, and needs no model call.

Marker log after `opencode debug config` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v1probe/markers/load.log:1]:

```
module-eval:01-b-object
module-eval:02-c-hybrid
module-eval:00-a-v1fn
A:v1fn-invoked inputKeys=client,project,worktree,directory,experimental_workspace,serverUrl,$
C:called-as-function argType=object
B:server-invoked
```

| Probe file | Shape | v1 1.19.3 verdict | Evidence | v2 2.0.32 verdict |
|---|---|---|---|---|
| `00-a-v1fn.js` | `export default async (input) => Hooks` | **accepted, called as factory** | `A:v1fn-invoked` with the exact 7-key `PluginInput` | **rejected** (iteration 1 probe) |
| `01-b-object.js` | `export default { id, setup, server }` | **accepted; `server()` invoked, `setup` NOT invoked** | `B:server-invoked`, no `B:setup-invoked` | **accepted; `setup(ctx)` invoked** |
| `02-c-hybrid.js` | function carrying `.id` + `.setup` | **accepted, called as a plain function**; `.id`/`.setup` ignored | `C:called-as-function argType=object`, no `C:setup-invoked` | **rejected** (iteration 1 probe) |

Two sub-facts worth pinning down:

- The `PluginInput` key set observed at runtime — `client,project,worktree,directory,experimental_workspace,serverUrl,$` — matches the installed 1.18.34 declaration exactly, confirming the probe ran against the documented v1 contract rather than a shim.
- Load order is not alphabetical (`01` → `02` → `00`), so v1 module evaluation is concurrent/unordered. Any plugin that relies on cross-plugin ordering via module side-effects is already unsound on v1.

### F5 — P0: the dual-compatible shape is the plain object carrying BOTH `setup` and `server`

Intersecting the two loaders:

- v2 requires a non-callable module with a callable `setup` (confirmed by `adapter.js:449` calling `plugin.setup` and by the recorded v2 probe rejecting the bare function and the hybrid function).
- v1 requires a callable module **or** an object with a callable `server` (confirmed by `B:server-invoked` and `C:called-as-function`).

The single shape satisfying both is `{ id, setup, server }` — exactly probe (b). v2 runs the `setup` leg; v1 runs the `server` leg; each host ignores the other's key.

This **answers iteration 1's open question "can one module default-export satisfy both contracts (function + `{id, setup}`), or is a two-file split mandatory?"** — a two-file split is **not** mandatory. The `id`-bearing object is the port target, and the per-host logic lives in two sibling methods of that object rather than in two files.

Caveats that keep this a design constraint rather than a free lunch:

1. The `server` leg must construct its own v1 `Hooks` object and cannot share a context object with the `setup` leg — the two receivers (`PluginInput` vs `Context`) share no shape beyond `options`.
2. `server` was observed invoked with no logged arguments; whether v1 passes it `PluginInput`, a server handle, or nothing is **UNVERIFIED** (the probe's `server` did not record its arguments).
3. Nothing in the v2 loader's public `.d.ts` declares `server` as a legal key on `Plugin` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:56]; excess-property checking will reject the literal under a strict `Plugin` annotation, so the object must be constructed without that annotation (structural typing, or an explicit `as` cast, or omitting the annotation entirely as `define()` does).

### F6 — P1: v1 auto-discovery of `.opencode/plugins/` is cwd-relative, not worktree-root-relative

The probe project lives at `<repo>/specs/.../scratch/a2-v1probe/project/`, several levels below the git worktree root, and its own `.opencode/plugins/` was loaded. Config resolution meanwhile did walk to the repo root — `opencode debug config` printed the repo-root `mcp.code_mode`, `permission` and `agent.*` blocks. So config discovery ascends to the worktree root while plugin-directory discovery is anchored at the invocation cwd. Whether an ancestor `.opencode/plugins/` is *also* loaded (i.e. union vs override) stays **UNVERIFIED** — the repo's 16 plugins emit no load-time marker, so their absence from `load.log` proves nothing.

Practical import for the compatibility work: the flat-glob claim the repo relies on [SOURCE: .opencode/plugins/README.md:16] holds only for hosts started with cwd = the directory holding `.opencode/plugins/`. A v2 user launching `opencode2` from a nested path gets neither the 16 v1 plugins nor any v2 equivalent.

### F7 — P1: `@opencode/plugin` is ESM-only with a heavy peer surface

`package.json` declares `"type": "module"`, every `exports` subpath (`"."`, `./effect`, `./host`, `./runtime`, `./tui`, `./*`) exposes **only** an `import` condition — no `require` condition — and `peerDependencies` include `@opencode/theme`, `@opentui/core`, `@opentui/solid`, `solid-js` (all optional) alongside hard dependencies `@opencode/ai`, `@opencode/client`, `@opencode/protocol`, `@opencode/schema`, `@opencode/util` all pinned to `2.0.32`, `@ai-sdk/provider@3.0.8` and `effect@4.0.1` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/package.json:5].

Consequences for dual support:

- A dual plugin object that is `require`d by a CJS loader cannot `import` from `@opencode/plugin`; it must be CJS/plain-JS with no v2 type import at runtime, or the file must be duplicated per module system.
- Version pinning is exact (`2.0.32`), not caret. Installing `@opencode/plugin` alongside `@opencode-ai/plugin` (different scope, `@opencode-ai` vs `@opencode`) avoids a name collision but not a transitive `@opencode/schema`-version collision, since both v2 packages pin `2.0.32` while a v1 tree may resolve the same names differently.

### F8 — P2: v1-only `PluginInput` capabilities have no direct 2.0.32 analogue

Observed at runtime on v1: `client, project, worktree, directory, experimental_workspace, serverUrl, $`. Against the real 2.0.32 `Context`: `location` covers `directory`/`workspace`, `app` covers version/name, and `shell` is a domain — but there is **no** `$` (BunShell), **no** `serverUrl`, and **no** `experimental_workspace.register`. That converts three iteration-1 "UNVERIFIED" rows into confirmed gaps, and promotes `$` from a hook-gap question to a context-gap one: any of the 16 repo plugins shelling out through `PluginInput.$` has no drop-in v2 replacement, only a `ctx.shell` rewrite.

## Questions Answered

None of the five strategy key questions is fully satisfied, so `answeredQuestions` is empty rather than over-ticked. The status per question:

- *Which plugin shape and API surface loads and behaves correctly on both v1 and v2, and how do the 16 repo plugins port to it?* — **shape: answered** (F5: plain object with `setup` + `server`). **Port table: still open.**
- *Does the 2.0.32 `.d.ts` match the preview, and what is the real `PluginContext` domain list?* — **answered in substance** (F1–F3); tracked as a carried-forward open question, not a strategy key question, so it does not tick a box.

## Questions Remaining

1. **Does v1 pass arguments to `server()`?** The probe recorded invocation but not arguments. Decide whether the v1 leg can share a single bootstrap function. (blocking for a uniform plugin template, P1)
2. **Is `.opencode/plugins/` discovery in v1 a union with the ancestor directories or an override?** Affects whether one nested install is visible from deeper cwds. (P1)
3. **Does 2.0.32 still ship the `Reload` mixin** the preview used (`agent: AgentHooks & Reload`)? `registration.d.ts` was not re-read this iteration; the preview's `Reload` may have moved into `Registration` or vanished. (P2)
4. **Does v2 actually accept an object literal with an extra `server` key at load time** — i.e. is the F5 shape validated structurally or by an `id`+`setup` shape test that tolerates extras? Iteration 1's probe says accepted; this iteration did not re-run it against `{id, setup, server}` explicitly per-key. (P0, cheap to settle)
5. **Does v1 tolerate the `plugins` (plural) config key, and v2 the singular `plugin`?** Untouched this iteration. (P1)
6. **Is `sk-vision.js` a symlink, and does either host's discovery follow it?** Untouched. (P2)
7. **Which of the 16 repo plugins touch `"shell.env"`, `"chat.*"`, `experimental.*`, or `PluginInput.$`?** Untouched — now scoped more precisely by F8. (P1)

## Next Focus

A3: re-probe v2 against the exact F5 object (`{id, setup, server}` with `id` + both methods, plus a variant with an extra unknown key) to settle Q4 and confirm the dual shape end-to-end, then run the gap census over the 16 repo plugins for `"shell.env"`, `"chat.*"`, `experimental.*` and `PluginInput.$` so the irreducible-gap list becomes per-plugin rather than per-API.

## SCOPE VIOLATIONS

None requiring reversion. Two write locations were used beyond the two named artifact paths, both inside the research packet and both explicitly directed by this iteration's focus: `scratch/a2-v2pkg/` (the `npm pack` extraction the focus instructs) and `scratch/a2-v1probe/` (the throwaway probe project the focus instructs). No file outside `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/` was created, modified or deleted; no `rm`/`mv`/`sed -i` was executed; nothing under `.opencode/`, `.skilled/` or `node_modules/` was touched. The researched surface was read only.

## GATEWAY NOTE (carried from iteration 1)

`f-iter001-007` stands: the append gateway accepts the canonical record but its projection into `deep-research-state.jsonl` keeps only `type, iteration, run, status, newInfoRatio, ruledOut, timestamp`, dropping `focus`, `answeredQuestions` and `graphEvents`. `deltas/iter-002.jsonl` is therefore written to hold the complete record verbatim.
