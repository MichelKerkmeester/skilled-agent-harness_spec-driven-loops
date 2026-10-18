# Iteration 016 — A14: server API clients and their v1 → v2 mapping

- **Segment:** 1
- **Iteration:** 16 of 20
- **Focus:** Which repo code talks to an OpenCode server or SDK directly, and how each call site maps from v1 to v2.
- **Mode:** research (single iteration, externalized state)

## Focus

A14 asked for a call-site inventory of every place the repo touches an OpenCode server or SDK, a v1 →
v2 endpoint and client mapping, and the sites with no v2 equivalent. The prompt named `@opencode-ai/sdk`,
`createOpencodeClient`, `opencode serve`, `--port`, `--attach`, `client.session.*`, `client.tui.*`,
`client.app.*`, `/session/` and `/event` HTTP paths, `OPENCODE_SERVER`, the deep-loop runner's
`cli-opencode` command builder, and `npm view @opencode/client`.

## Actions Taken

1. Grepped `.skilled/`, `.opencode/` and `opencode.json` for `@opencode-ai/sdk`, `createOpencodeClient`,
   `opencode serve`, `OPENCODE_SERVER`, `client.session.`, `client.tui.`, `client.app.` and for raw HTTP
   server paths (`127.0.0.1:4096`, `localhost:4096`, `/session/`, `/api/event`, `fetch(...4096)`).
2. Grepped for `--attach` and `--port` across `.skilled/` and `.opencode/`.
3. Grepped for `pluginInput`, `input.client` and `PluginInput` to find every plugin holding a client handle.
4. Read the five live call sites plus the two type-only imports and the one false positive in full
   context (`.opencode/plugins/system-completion-sentinel.js` 60–100, `.opencode/plugins/opencode-goal.js`
   2680–2700, `.skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts` 80–110,
   `.../src/plugin.ts` 40–60, `.skilled/skills/mcp-code-mode/mcp-server/index.ts` 262–280).
5. Read `buildOpencodeLineageCommand` in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
   2324–2370 and grepped the rest of the file for `opencode` to confirm it never opens a client.
6. Enumerated all 119 paths in
   `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json`,
   then drilled `/api/session/{sessionID}/message` (GET), `/api/session/{sessionID}/prompt` (POST),
   `/api/session/{sessionID}/generate` (POST), `/api/event` (GET), `/api/plugin/check` (POST) and
   `/api/rpc/{rpcID}/{method}` (POST) for parameters, bodies and response schemas, and searched the whole
   spec text for the tokens `toast`, `showToast`, `promptAsync`, `prompt_async` and `tui`.
7. Resolved `SessionMessagesResponse`, `Session.Inbox.User`, `Plugin.Info`, `Plugin.Source` and
   `Plugin.Features` from `components.schemas`.
8. `npm view` against `@opencode/client`, `@opencode-ai/sdk` and `@opencode/client exports`.

## Findings

### F1 — The repo has zero server API clients. It has five in-process `ctx.client` call sites, two type-only SDK imports, one false positive, and two documentation-only CLI surfaces. (P0, answered)

**Live client call sites (all `ctx.client` / `pluginInput.client`, never a constructed client):**

| # | Site | Call | Purpose |
|---|------|------|---------|
| 1 | `.opencode/plugins/system-completion-sentinel.js:79` | `client.session.messages({path:{id}, query:{limit}})` | last assistant text at `session.idle` |
| 2 | `.opencode/plugins/system-skill-advisor.js:1231` | `ctx?.client?.session?.messages?.(...)` | post-compaction context re-injection source |
| 3 | `.opencode/plugins/opencode-goal.js:2685` | `rawOptions.client?.session?.promptAsync` (invoked at `:2697`) | autonomy continuation turn |
| 4 | `.skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts:89` | `pluginInput.client.session.messages({path:{id}})` | find the latest image part |
| 5 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:46` | `input.client.tui.showToast({body:{...}})` | user-facing notify (guarded at `:45`) |
| 6 | `.skilled/skills/sk-vision/hooks/opencode/sk-vision.ts:57` | `input.client.tui.showToast(...)` | same notify in the hook build |

**Type-only imports — no runtime dependency, so no v2 break:** `.skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts:6` (`Part`, `FilePart`), `.../attachments.ts:9` (`Part`, `FilePart`, `UserMessage`), `.../plugin.ts:33` (`import("@opencode-ai/sdk").Part`). These erase at compile time.

**False positive ruled out:** `.skilled/skills/mcp-code-mode/mcp-server/index.ts:276` and `:311` call `client.config.tool_repository.getTools()` / `.getTool(name)`, but `:274` binds `const client = await initializeUtcpClient();` — this is the UTCP tool repository, not OpenCode. It never touches OpenCode and needs no v2 mapping.

**Surfaces that do not exist in this repo at all:** no `createOpencodeClient`, no `opencode serve`, no `OPENCODE_SERVER`, no `client.app.*`, no `client.config.*` (OpenCode), and no raw HTTP/SSE to a server — every `4096` hit in `.skilled/` and `.opencode/` is either documentation prose or an unrelated byte-size constant (`MAX_CAPTURE_BYTES = 4096` in `.opencode/plugins/session-cleanup.js:45`, `SPEC_LEVEL_HEAD_CHARS = 4096` in `.skilled/hooks/goal/lib/goal-slice.cjs:333`, `MAX_SESSION_ID_CHARS = 4096` in `.skilled/hooks/goal/lib/goal-core.cjs:48`).

`--attach` is **documentation only** — `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:31`, `:81` (routing keyword), `:165` (flag inventory), `assets/prompt-templates.md`, `README.md:91`, `references/opencode-tools.md:90`, `references/cli-reference.md`, and playbook CO-030 (`cross-repo-cross-server/attach-remote-server.md`). Zero code references. CO-030 itself states live remote execution is out of scope, so `--attach` has never been exercised on either version.

`--port` in the skill is likewise prose: `--share --port <N>` for detached sessions and `4100 + N` worker farms (`assets/prompt-templates.md:114`, `:293`, `:328`, `references/opencode-tools.md:90`).

**Consequence for the dual-compat goal:** the client leg is *narrower* than the prompt assumed — there is no server client to port. The whole v1→v2 client surface reduces to three methods used by four plugins, which is why F2 can be exhaustive rather than sampled.

### F2 — Endpoint mapping: `session.messages` survives with a renamed path and a changed response shape; `promptAsync` has a clean v2 analogue; `tui.showToast` has no v2 route at all. (P0)

| v1 call | v2 endpoint | Verdict |
|---|---|---|
| `client.session.messages({path:{id}, query:{limit}})` | `GET /api/session/{sessionID}/message` | **Shape break.** Path noun is singular. `limit` is retained but `order`, `cursor` and `type` are new. `SessionMessagesResponse.data` is `Session.Message.Info[]` plus a `cursor:{previous,next}` object — the v1 list carries `{info, parts}` pairs, and no `parts` appears in the v2 list schema. |
| `client.session.promptAsync({...})` | `POST /api/session/{sessionID}/prompt` | **Clean analogue.** The response is `{data: Session.Inbox.User}` — the prompt is *enqueued into an inbox*, so v2's route is async by construction, matching `promptAsync` semantics. `POST /api/session/{sessionID}/generate` `{prompt}` is the simpler sync alternative if a fire-and-forget inbox item is unwanted. |
| `client.tui.showToast({body:{title,message,variant}})` | **none** | **Irreducible.** `toast` and `showToast` do not occur anywhere in the 119-path spec or its schemas. The only `tui` token in the document is `Plugin.Features.tui`, a declarative capability flag. |

Two consequences worth recording separately because they invert earlier iterations' assumptions:

- **The sentinel is the single fragile site.** `resolveLastAssistantText` iterates `messages` backwards and reads `entry.info.role` (`.opencode/plugins/system-completion-sentinel.js:88`) then `textFromAssistantEntry(entry)` (`:89`). If v2's list returns `Session.Message.Info[]` without sibling `parts`, the role check still works but the *text* extraction has no `parts` to read, and the whole "resolve last assistant text" step — already the P0 risk from iteration 4 — fails closed to `null`. The same iteration-4 worry now has a concrete mechanism.
- **`Plugin.Features` is a real v2 contract, and it is new information for the plugin-shape question.** `Plugin.Features` is `{server?: true, tui?: true, rpc?: true}` with each member `enum: [true]` (not `boolean`), and `Plugin.Info` requires `source`, `features`, `state`. So a v2 plugin *declares* whether it needs the server, the TUI, or RPC. That is a structural declaration v1's plugin contract does not have, and `tui: true` is the only v2 token naming the TUI at all.

### F3 — The dependency split is version-aligned and the repo pins neither side of v2. (P0)

- `npm view @opencode-ai/sdk version` → **1.19.3** — the v1 client, version-tracking the v1 host.
- `npm view @opencode/client version` → **2.0.32** — the v2 client, version-tracking the v2 host exactly. Its export map is `.` (`./dist/promise/index.*`), `./solid`, `./effect`, `./promise`, `./service`, `./effect/api`, `./promise/api`, `./effect/service`. **There is no `createOpencodeClient` factory in that map**; the v2 client is a promise/effect/service-surface library, a materially different construction API, not a rename.
- Neither package is a dependency of this repo. `.opencode/package.json:7` and `.skilled/package.json:4` both pin only `@opencode-ai/plugin: "1.18.34"` — i.e. **the plugin contract is already one minor behind the repo's own v1 host (1.19.x) and two minors behind v2 (2.0.32).**

That last point compounds iterations 1–3: every `@opencode-ai/plugin` `.d.ts` question carried forward was asked about `1.18.34` on the v1 side, so the *shipped* v1 pin is older than the v1 host being targeted.

### F4 — v2's remote-attach story looks structurally different from `--attach`, and the repo documents the v1 shape only. (P1)

The v2 spec carries `POST /api/pair`, `GET /auth/connect/{code}`, `GET|POST /api/credential` with `POST /api/credential/{credentialID}/activate`, and `/api/integration/{id}/connect/{key,oauth,external}`. There is no route that a single `--attach <url>` would land on. The presence of pairing and credential-activation routes suggests v2 reaches a remote runtime through a paired credential, not a bare URL. The repo's documented `--attach <url>` (`SKILL.md:31`, `SKILL.md:165`) has never been executed on either version (CO-030 is explicitly doc-only), so this is a documentation-contract risk rather than a verified break — marked P1 and not asserted.

### F5 — The deep-loop `cli-opencode` executor is pure CLI argv and needs no client mapping; it does need the v2 flag matrix. (P2)

`buildOpencodeLineageCommand` (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2324`) emits `opencode run --model <m> --format json --dir <root> [--dangerously-skip-permissions] [--variant <e>] <prompt>` (`:2329`–`:2351`) and resolves the binary version at `:2286` / `:2359` via `resolveExecutableVersion('opencode', options)`. It never constructs a client, opens a socket, or reads a session. So the A11 findings from iteration 13 are the whole story for this file — A14 adds nothing to it beyond confirming that no hidden server path is reachable from the runner.

## Questions Answered

None of the two remaining strategy key questions is fully settled by this iteration. Both were moved:

- *"Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?"* — one **"must diverge"** site is now known and narrow: `client.session.messages` needs a per-version adapter (path noun, `parts` presence, `cursor` pagination) and `client.tui.showToast` needs a v2 replacement or a graceful drop. The plugin *dependency specifier* must differ (`@opencode-ai/sdk` vs `@opencode/client`) — but F1 shows only type-only imports reach `@opencode-ai/sdk`, so a single plugin tree can avoid the specifier split entirely by inlining the three erased types. That materially lowers the cost of the answer.
- *"What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?"* — the toast gap is now confirmed irreducible at the API level (F2), not merely undocumented.

Recorded as `answeredQuestions: []` because neither key question's text is satisfied in full.

## Questions Remaining

- **A14-Q1 (new, P0):** Is `Session.Message.Info[]` in `SessionMessagesResponse` really missing `parts`, i.e. must the sentinel and sk-vision fetch `GET /api/session/{sessionID}/message/{messageID}` per entry to get text and image parts? One live `GET /api/session/{id}/message` against 2.0.32 settles it. Blocks `system-completion-sentinel` and `sk-vision`.
- **A14-Q2 (new, P1):** Which RPC method names does `POST /api/rpc/{rpcID}/{method}` accept, and does one of them deliver `tui.toast.show`? `Rpc.Input` is the only envelope; without the method vocabulary the toast gap stays open. Readable from `@opencode/client`'s `.d.ts` (`./dist/promise/api.d.ts`) or from a running server's plugin docs.
- **A14-Q3 (new, P2):** Does `POST /api/session/{sessionID}/prompt` return before the turn runs (true `promptAsync` parity), or does the inbox item only mean "queued for delivery"? `Session.Inbox.Delivery` is the field that decides it, and `opencode-goal`'s continuation gate (`.opencode/plugins/opencode-goal.js:2697`) depends on the answer.
- **A14-Q4 (new, P2):** Does v2 pass the same client handle to a plugin, i.e. is `ctx.client` still the v1-shaped `createOpencodeClient` result on v1 and a `@opencode/client` promise surface on v2? If so, the v1 calls in F1 are *not portable by adapter* — they are portable by rewrite only.
- **A14-Q5 (new, P1):** Is the repo's `@opencode-ai/plugin` `1.18.34` pin a deliberate v1 floor or drift? `.opencode/package.json:7` and `.skilled/package.json:4` disagree with the 1.19.x v1 host being targeted, which means every v1-side plugin-contract answer gathered in iterations 1–3 was measured against the wrong pin.
- Carried forward unchanged: `plugins` (plural) vs `plugin` (singular) config tolerance on both versions; `.opencode/plugins/` discovery unions and flat-file loading on v2; `sk-vision.js` symlink following; `run --format json` schema and `--standalone`; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle` / `session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; the v2 event scheme; `SystemPart`; command-template `` !`cmd` `` injection; `.opencode/command` vs `.opencode/commands` scan; `Q-R1`–`Q-R5`; `-m provider/model#variant` on v1 1.19.3; `run` positional-directory behaviour; hidden `--dangerously-skip-permissions`; `models` positional provider on v2.

## Next Focus

**A15 — the `Plugin.Features` declaration and the v2 plugin entry contract.** F2 surfaced `Plugin.Features` `{server?: true, tui?: true, rpc?: true}` and `Plugin.Info` requiring `{source, features, state}` — a structural declaration that v1 has no counterpart for, and the first hard evidence for how a v2 plugin advertises TUI access. Read `/api/plugin` (GET) and `/api/plugin/check` (POST) response shapes in full, then read `@opencode/client`'s `./dist/promise/api.d.ts` and `@opencode-ai/plugin@2.0.32`'s `Plugin`/`PluginContext` types (still never packed — carried since iteration 1) to settle whether `features` is authored by the plugin, inferred by the loader, or both. Tie back to F1's narrow call set: three methods on four plugins is the entire surface that must stay portable.

## SOURCE VIOLATIONS

None. Every path touched was read-only; all writes landed inside the lineage directory.

## Sources cited

- [SOURCE: .opencode/plugins/system-completion-sentinel.js:77]
- [SOURCE: .opencode/plugins/system-completion-sentinel.js:79]
- [SOURCE: .opencode/plugins/system-completion-sentinel.js:88]
- [SOURCE: .opencode/plugins/system-skill-advisor.js:1231]
- [SOURCE: .opencode/plugins/opencode-goal.js:2685]
- [SOURCE: .opencode/plugins/opencode-goal.js:2697]
- [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts:6]
- [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts:89]
- [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts:9]
- [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:45]
- [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:46]
- [SOURCE: .skilled/skills/sk-vision/hooks/opencode/sk-vision.ts:57]
- [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:274]
- [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:276]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2324]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2329]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2349]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2359]
- [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:31]
- [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:165]
- [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md:90]
- [SOURCE: .opencode/package.json:7]
- [SOURCE: .skilled/package.json:4]
- [SOURCE: .opencode/plugins/session-cleanup.js:45]
- [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:333]
- [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:48]
- [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json]
