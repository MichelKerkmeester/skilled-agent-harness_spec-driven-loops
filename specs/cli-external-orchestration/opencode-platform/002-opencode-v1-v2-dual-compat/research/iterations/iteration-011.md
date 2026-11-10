# Iteration 011 — A10: plugin dependencies and tool definitions on v1 and v2

## Focus

What must `.opencode/package.json` and the plugin sources depend on so **one** plugin tree loads on v1 (1.19.x) and v2 (2.0.x) without a broken import, and can one tool-definition object feed both hosts?

## Actions Taken

1. Read `.opencode/package.json` and the installed `.opencode/node_modules/@opencode-ai/plugin` (resolved: **1.18.34**, `type: module`), including its full `exports` map. Installed because v1 auto-installs `.opencode/package.json` deps (both probe projects, iterations 1-2).
2. Read `dist/tool.js` and `dist/tool.d.ts` in full — the v1 `tool()` helper and its `args` contract.
3. Read the whole `dist/v2/` subtree that 1.18.34 already ships: `v2/promise/{index,plugin,registration,context}.d.ts`, plus `v2/effect/` and `v2/options.*`.
4. Located and read the three import sites of `@opencode-ai/plugin/tool` and the exact `tool.schema` call shapes they use.
5. Executed the helper in node to settle what `tool()` actually returns at runtime, and executed zod 4.1.8 to settle whether one schema can be emitted in both hosts' required shape.
6. Checked for the 2.0.32 package artifacts named by the focus (`scratch/a2-v2pkg/…`, `scratch/cli-help/v2-plugin-help.txt`) and for any on-disk 2.0.x copy.

## Findings

### F1 — v1's `tool()` is an identity function; the import buys types and a zod re-export, nothing else

`tool.js` is five lines: `export function tool(input) { return input; }` and `tool.schema = z` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/tool.js:1]. Confirmed by execution: the returned object has exactly the keys `description,args,execute` and its `args` member parses as a real zod schema.

The consequence is load-borne: **the tool definition object *is* the definition.** `import { tool }` contributes no validation, no wrapping, no registration — so it can be replaced by `const tool = (x) => x` plus a direct `zod` import with zero behavioural change on v1. The same holds for `system-skill-advisor.js`, whose only tool passes `args: {}` [SOURCE: .opencode/plugins/system-skill-advisor.js:1449].

### F2 — v1's tool `args` is a **zod raw shape**, not JSON Schema

The declared signature is `args: Args extends z.ZodRawShape`, and `execute` receives `z.infer<z.ZodObject<Args>>` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts:52]. Two concrete instances in the repo: `tool.schema.enum(GOAL_ACTIONS)` with optional strings [SOURCE: .opencode/plugins/opencode-goal.js:3328], and `tool.schema.string().optional()` / `tool.schema.boolean().optional()` [SOURCE: .opencode/plugins/system-speckit-completion.js:58].

So a v1 tool **cannot** be declared with a plain JSON Schema. Hand-writing the object without the import is possible, but it still needs zod to build `args`.

### F3 — the v1 package already ships the **v2 plugin surface**, in the same version

`@opencode-ai/plugin@1.18.34` exports `./v2/promise` and `./v2/effect` alongside `./tool` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/index.d.ts:1]. That subpath exports `define(plugin)`, the `Plugin` interface `{ id, setup }`, and the `PluginDomain` `{ add, remove }` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/plugin.d.ts:1].

This is the strongest result of the iteration: **the dependency needed for the v2 plugin surface is the same package version already installed for v1.** A single pinned `1.18.34` satisfies both the v1 `tool` import and the v2 `define`/`Plugin`/`PluginDomain` types. No second dependency is required for the plugin contract that iteration 1 proved loads on both hosts (the `{ id, setup, server }` dual default export).

### F4 — but 1.18.34's v2 surface has **no `tool` domain**, so `ctx.tool.transform(...)` is 2.0.x-only

`PluginContext` declares exactly nine domains: `options`, `agent`, `aisdk`, `catalog`, `command`, `integration`, `plugin`, `reference`, `skill` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts:13]. There is no `tool`, and likewise no `session`, `shell` or `tui`. The `dist/v2/promise/` directory listing confirms it structurally: no `tool.*` file exists there.

Therefore the focus's v2 tool-registration shape (`ctx.tool.transform(editor => editor.add(...))`) **cannot come from 1.18.34**. It is a 2.0.x addition. A plugin that registers a v2 tool must either branch on the presence of `ctx.tool` at runtime or accept that the v2 tool surface is unavailable when the older package is the resolvable one.

### F5 — the `Reload` mixin is present in the 1.18.34 v2 surface (carried question, v1 side settled)

`Reload { reload(): Promise<void> }` and the `Hooks<Spec>` callback-to-`Registration` mapping are both declared [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/registration.d.ts:5], and `Reload` is applied to `agent`, `catalog`, `command`, `integration`, `reference` and `skill` [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts:19]. Note `plugin` itself and `aisdk` have no `Reload`.

This retires the iteration-2 P2 concern for 1.18.34; whether **2.0.32** keeps it is still unverified here.

### F6 — `zod` is a **phantom dependency** of the repo's plugin tree

`.opencode/node_modules/zod` exists at 4.1.8, but no `.opencode/package.json` declares it: the sole declared dependency is `@opencode-ai/plugin: 1.18.34`, and zod arrives only because that package depends on `zod: 4.1.8` and npm hoists. Every `tool.schema.*` call in the three plugins therefore resolves through an undeclared transitive dependency. If the plugin dependency is dropped, upgraded to a version that stops hoisting zod, or installed with a non-hoisting layout, all three plugins fail at module load — not at tool-call time.

### F7 — one zod raw shape **can** emit the v2 JSON Schema, in the installed zod

`z.toJSONSchema(z.object(shape), { io: 'input' })` is a function in 4.1.8 and emitted `{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{…}}` for a sample shape. So the divergence in F2 (v1 wants a zod raw shape, v2 wants JSON Schema) is **mechanically bridgeable from one source of truth**: declare the shape once as zod, hand the raw shape to v1, and hand `z.toJSONSchema(...)` output to v2's `editor.add({ input })`.

This is the answer to the focus's "can one tool definition object feed both?" — **not literally one object, but one schema with a two-line adapter.** The adapter requires zod at runtime on both hosts, which makes F6 a correctness issue rather than a tidiness issue.

### F8 — the 2.0.32 package is not present in this workspace; that half of the focus is unverifiable here

`scratch/` does not exist at the repo root, so `scratch/a2-v2pkg/package/dist/promise/tool.d.ts` and `scratch/cli-help/v2-plugin-help.txt` — both named by the focus — could not be re-read. `~/.cache/opencode/packages` exists but was not unpacked within this iteration's tool budget. Everything stated above about 1.18.34 is read from disk; every statement about 2.0.32 remains **carried, not confirmed**, and F4 is a downgrade signal: the 1.18.34 surface is strictly smaller than the 2.0.32 surface the focus describes.

### Recommendation — dependency set and tool definitions

**Dependency set:** `{"@opencode-ai/plugin": "1.18.34", "zod": "4.1.8"}`.

- Keep the plugin pin at the v1 line. v1 auto-installs `.opencode/package.json`, so this version is what v1 will actually resolve; pinning 2.0.x here would put a 2.0.x copy on the v1 side of a side-by-side install.
- Declare `zod` explicitly. It closes F6 and is the only hard requirement of the bridge in F7.
- Add nothing for the v2 plugin contract: F3 means the existing pin already carries `define`, `Plugin`, `PluginDomain` and `Reload`.

**Tool definitions:** drop `import { tool } from '@opencode-ai/plugin/tool'` from the three plugins and replace it with a local two-liner — `const tool = (x) => x` plus `import { z } from 'zod'` — then feed one zod shape to both hosts via a `toV2Tool(def)` adapter that emits `{ name, description, input: z.toJSONSchema(z.object(def.args), { io: 'input' }), execute }` for `ctx.tool`, and the untouched `{ description, args, execute }` for v1. Rationale: F1 proves the import is inert on v1, and eliding it removes the only load-time dependency on a package whose 2.0.x `exports` map is unverified — the difference between a plugin that loads on a v2-only install and one that dies with `ERR_PACKAGE_PATH_NOT_EXPORTED`.

**Risk of importing a v2-only package under v1 (focus item 4):** because v1 auto-installs `.opencode/package.json`, a `@opencode-ai/plugin` pin of `2.x` becomes the copy v1 resolves, and 2.0.32 is described as ESM-only with five exact-pinned siblings. Any subpath it no longer exports — `./tool` is the one the repo needs — turns into a load-time crash on v1. The import-free definition in the previous paragraph is immune to that class of break, which is why it is preferred over guarding the existing import with a dynamic-import fallback.

## Questions Answered

None of the three remaining strategy key questions is closed. This iteration supplies the dependency half of key question 3's pinning guidance, but not its verification matrix, its side-by-side/single-version layout, or its irreducible gaps — so the box stays unticked rather than being partially credited.

## Questions Remaining

- **A10-Q1 (new, P0):** Does v2 install `.opencode/package.json` dependencies at all, and where? This is now the decisive input: if it does not, every bare import in a plugin is a crash on a v2-only install, and the import-free path is mandatory rather than preferred.
- **A10-Q2 (new, P0):** Does `@opencode-ai/plugin@2.0.32` still export the `./tool` subpath, and does it keep `zod` as a hoistable dependency? Requires `npm pack @opencode-ai/plugin@2.0.32` — still never performed (carried from iteration 1).
- **A10-Q3 (new, P1):** Does 2.0.32's `PluginContext` add `tool`, and does it add `session`/`shell`/`tui`? 1.18.34 has none of the four (F4), so this decides whether the earlier carried questions on `ctx.session.messages`, `ctx.tui` and `ctx.shell` are answerable against the pin we ship.
- **A10-Q4 (new, P2):** Does either host tolerate a tool definition whose `input`/`args` is a JSON Schema on v1, or a zod raw shape on v2 — i.e. is the F7 adapter strictly necessary, or does one shape already pass both validators?
- All previously carried questions remain open: v1/v2 `plugin` vs `plugins` config keys; `.opencode/plugins/` discovery unions and flat-file loading on v2; `sk-vision.js` symlink following; `run --format json`; `session.idle`/`session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; event-stream native names; `Q-R1`–`Q-R5`; `-m provider/model#variant` on v1; `~/.opencode/hooks.json`.

## Next Focus

A10 follow-through, if the next iteration stays on dependencies: unpack 2.0.32 and settle A10-Q1–Q3 in one pass (`npm pack` in `scratch/a10-probe/`, `git init`, read `package.json` `exports` + `dist/promise/context.d.ts`, then clean `node_modules`). Otherwise proceed to the cli-opencode dispatch matrix, which is the largest untouched key question.

## SCOPE VIOLATIONS

None. All reads; writes confined to this iteration's narrative, its delta file, and the append gateway.
