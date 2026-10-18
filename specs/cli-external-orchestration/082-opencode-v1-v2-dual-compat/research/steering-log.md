# Steering Log

The orchestrator owns this file. Each entry records what an iteration returned, how the angle backlog changed, and the exact focus written into the strategy's Next Focus anchor for the next iteration.

## Session deviation

The operator asked for a steered loop that holds for this session only. The orchestrator picks each iteration's focus and writes it between `reduce` and the next `read_state`. The pause sentinel enforces the boundary. No skill or command file changes.

Halt signal: the auto YAML logs `userPaused` as a `log_event`, and the gateway refuses it as legacy-only with no ledger stem (`legacy-event-has-no-lossless-mode-event`). The helper that drives the YAML reports the halt directly instead. The state log never shows `userPaused` in this run.

## Parallel batches

The operator asked for iterations to run in parallel. Iteration 1 ran on its own. From iteration 2 the loop runs steered batches of three concurrent iterations:

- B1: iterations 2-4
- B2: iterations 5-7
- B3: iterations 8-10
- B4: iterations 11-13
- B5: iterations 14-16
- B6: iterations 17-19
- B7: iteration 20, on its own

Each iteration in a batch gets its own focus, applied in memory for that dispatch. The anchor holds the batch's first focus. The batch's results are reduced one at a time, in iteration order, after every child has landed. Spot checks move to after iterations 4, 10, 16 and 20, so they fall on batch boundaries.

## Angle backlog

Status values: `queued`, `active`, `done`, `partial`, `blocked`, `dropped`. ADAPTIVE slots sit at iterations 6, 12 and 18.

**Phase 1: foundations**
- A1 (iter 1): v2 plugin API ground truth versus v1. Status: active.
- A2 (iter 2): dual-entry loader behaviour and the version floor. Status: queued.
- A3 (iter 3): port matrix for the 16 plugins. Status: queued.
- A4 (iter 4): event streams and the TUI/CLI plugin halves. Status: queued.

**Phase 2: agents, commands and config**
- A5 (iter 5): agent frontmatter shared by both versions. Status: queued.
- ADAPTIVE (iter 6).
- A6 (iter 7): commands, frontmatter and the `run --command` replacement. Status: queued.
- A7 (iter 8): one `opencode.json` for both versions. Status: queued.

**Phase 3: skills, guards and dependencies**
- A8 (iter 9): skills discovery and frontmatter. Status: queued.
- A9 (iter 10): version-aware hooks and guards. Status: queued.
- A10 (iter 11): plugin dependencies and `node_modules` install. Status: queued.
- ADAPTIVE (iter 12).

**Phase 4: cli-opencode and install**
- A11 (iter 13): `cli-opencode` version detection and the flag matrix. Status: queued.
- A12 (iter 14): standalone versus shared service, and env propagation. Status: queued.
- A13 (iter 15): install guidance for side-by-side and single-version setups. Status: queued.
- A14 (iter 16): server API clients and the move to `@opencode/client`. Status: queued.

**Phase 5: verification and promise**
- A15 (iter 17): a two-version doctor and CI verification design. Status: queued.
- ADAPTIVE (iter 18).
- A16 (iter 19): release cadence, pinning and what "perfect" can promise. Status: queued.
- A17 (iter 20): irreducible gaps and workarounds. Status: queued.

## Entries

### Seed for iteration 1

Focus written:

A1 v2 plugin API ground truth: what exact plugin API does OpenCode v2 2.0.32 expose versus v1 `@opencode-ai/plugin` 1.18.34? Read the v1 types in `.opencode/node_modules/@opencode-ai/plugin`. For the v2 `@opencode/plugin` types, if they are not installed, run `npm pack @opencode/plugin@2.0.32` into this packet's `scratch/` directory, extract the archive there and read its `.d.ts` files. Also read https://opencode.ai/v2/docs/build/plugins/ and its migrate-v1 page. Cover every `ctx` domain (session, tool, permission, event, command, shell, provider, model, storage, options, location) with hook names, event payload fields and sync/async rules. Output: a v1 hook/context key → v2 target table, with one file:line or URL per row. Check: grep the `.d.ts` files. Never edit repo files outside this packet.

### Iteration 1 result, and the foci for batch 1 (iterations 2-4)

**What landed:** newInfoRatio 0.82, status insight, 7 findings. The headline:
- v2 replaces v1's flat hooks object with `define({id, setup})` plus `transform()` registries per domain.
- The preview v2 types bundled in `@opencode-ai/plugin` 1.18.34 declare only 9 `PluginContext` members. That's a P1, because the real 2.0.32 types haven't been read yet.
- `shell.env`, `chat.*`, `experimental.*` and `PluginInput.$` have no documented v2 home.
- Probe gaps: `npm pack` wasn't run, the migrate-v1 page wasn't read, and the plugins docs page was cut off at 29,991 bytes.

**Angle status:** A1 partial. The real 2.0.32 types move into A2.

**Evidence the orchestrator already has, passed to the children as known context:**
- In a probe project, v2 2.0.32 `/api/plugin` reported a plain-object default export `{ id, setup, server }` with no import as `active`.
- It rejected a function default export carrying `.id` and `.setup` properties with "Plugin must export a default definition with an id and an effect or setup function".
- All 16 repo plugins fail on v2 with that message, except `classifier-injection-screen.js`, which fails with "Plugin failed to load".

**Tooling incidents, fixed during the session:**
- The reducer's `String.replace` read `` $` `` in a question as a match-relative pattern and spliced the file prefix into sections 11A and 11. Every section writer in both reducers now uses a function replacement, with regression tests. The strategy was restored from its intact prefix and reduced again. The corrupted copy is in `scratch/`.
- The `containment_violation` row for `deep-research-bookkeeping-emission.vitest.ts` was the orchestrator's own test edit for the `userPaused` fix, not the child's.

**Focus written, iteration 2:**

A2 loader ground truth and real v2 types: what do the real v2 `@opencode/plugin` 2.0.32 types declare, and which plugin shapes does each version's loader accept? Run `npm pack @opencode/plugin@2.0.32` in this packet's `scratch/` directory, extract the archive there, and quote the real `PluginContext` and domain types with file:line. Compare them against the 9-member preview in `.opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts`. Then probe v1 1.19.3, run as `opencode`, with a throwaway project in `scratch/`. Write three local plugins into its `.opencode/plugins/`: (a) a v1 function default export, (b) the plain object `{ id, setup, server }`, and (c) a function carrying `.id` and `.setup`. Each writes a marker file when loaded. Find a v1 command that loads plugins without a model call, starting with `opencode debug --help`. Known: v2 accepts (b) and rejects (c), as reported by `opencode2 api GET /api/plugin` with the deepObject query `location[directory]`. Output: a table of each loader shape against v1 and v2 with the evidence, plus the real 2.0.32 context domain list. Check: marker files and the `.d.ts` lines. Never edit repo files outside this packet.

**Focus written, iteration 3:**

A3 per-plugin port matrix: for each of the 16 files in `.opencode/plugins/*.js`, list every v1 hook key, `client.*` call, event type and `PluginInput` field it uses, including `shell.env`, `chat.*`, `experimental.*` and `$`. Give the v2 target for each from the A1 table in `iterations/iteration-001.md` and https://opencode.ai/v2/docs/build/plugins/migrate-v1/ (read that page in full this time). Also check `.opencode/plugins/lib/` and say whether each plugin's core logic can be split out into a shared module that both entry points use. Output: a matrix of plugin × hook → v2 target → gap (none, workaround or irreducible), with file:line per use, plus why `classifier-injection-screen.js` fails differently on v2. Check: grep counts per file. Never edit repo files outside this packet.

**Focus written, iteration 4:**

A4 event streams and UI halves: which event types and payload fields do the repo's plugins and `cli-opencode` consumers depend on in v1? Cover `session.created`, `session.idle`, `session.compacted`, `message.*` and `permission.*`. What are their v2 equivalents, through `ctx.event.subscribe()` and the v2 event types? Also map the `opencode run --format json` event schema in both versions: find the parsers in `.skilled/skills/cli-external-orchestration/cli-opencode/` and `.skilled/skills/system-deep-loop/runtime`, and capture v2's real output with `opencode2 run --format json --standalone`, but only if a model call isn't needed. Then the UI half: can a repo-local plugin show a toast or other TUI output on v2? Read https://opencode.ai/v2/docs/build/plugins/cli/ and https://opencode.ai/v2/docs/cli/plugins/, and cover `cli.json` `plugins`, the `./tui` export, and whether `.opencode/plugins/*` is picked up as a CLI plugin. Note that `~/.config/opencode/plugins/orca-opencode-status.js` already runs on both versions, with `setupOpenCode2Tui`. Output: an old → new event map and a UI capability table, with evidence. Never edit repo files outside this packet.

### Batch 1 result (iterations 2-4), spot check 1, and the foci for batch 2 (iterations 5-7)

**What landed:** newInfoRatio 0.86, 0.78 and 0.80, with no failures, no 429s and a batch wall-clock of 3 min 11 s.
- Iteration 2: the real 2.0.32 `Context` has 26 domains. The 1.18.34 preview is not a subset of it.
- Iteration 3: the hook census shows 15 of the 16 plugins use only five hook keys, and nothing uses `shell.env`, `chat.params` or `$`. The migrate-v1 page maps most hooks that iteration 1 called gaps.
- Iteration 4: v2 uses pull-style `ctx.event.subscribe()`. `session.idle` and `session.compacted` have no direct peer. Payload fields were renamed.
- A3 is done. A1, A2 and A4 are partial.

**Spot check 1 (orchestrator, after iteration 4):**
- CONFIRMED, by reproducing it in an orchestrator scratchpad probe with marker logs: one plain-object default export `{ id, setup(), async server(input) }` loads on both versions. v1 1.19.3 (`opencode debug config`) calls `server()` with input keys `client,project,worktree,directory,experimental_workspace,serverUrl,$`. v2 2.0.32 calls `setup()`, and the flat file in `.opencode/plugins/` is discovered. This settles f-iter002-005, answers "does v1 pass arguments to `server()`", and resolves f-iter004-006.
- REFUTED f-iter004-005, "v1 needs a callable default export". The marker log shows v1 called `server()` on the object.
- REFUTED f-iter004-007, "zero `showToast` users". `.opencode/plugins/sk-vision.js` has 2 hits. Its grep didn't follow the symlink, which bears out f-iter003-008.
- OPEN: v2 replacements for `session.idle` and `session.compacted`. The plugin package `.d.ts` has no event-type list. Event schemas live in the server OpenAPI at `/api/event`.

**Tool access for the children:** the Pi guard blocks `opencode run` in children. The orchestrator captured CLI help in `scratch/cli-help/`: `v1-*-help.txt` and `v2-*-help.txt`, both versions, 37 files. It also saved the full v2 server spec there as `v2-openapi.json`. Its operations include `session.command` (`POST /api/session/{sessionID}/command`), `session.prompt` and `session.compact`, plus the `/api/event` stream.

**Focus written, iteration 5:**

A5 agents, one frontmatter for both versions: can a single `.skilled/agents/*.md` file serve v1 and v2 with identical intent? `.opencode/agents` is a symlink to `.skilled/agents`. Known, from an orchestrator probe of v2 `/api/agent`: v2 loads all 12 repo agents and converts the v1 `permission:` map into `permissions` rules (`task`→`subagent`, `bash`→`shell`, `write`/`edit`/`patch`→`edit`). It moves `temperature: 0.1` into `request.body`, which the v2 agents docs say is not sent yet. It keeps `list`, `chrome_devtools` and `browser` as rules but treats them as inert, because they aren't v2 actions. Investigate: (1) Is a v2 `permissions:` list in frontmatter tolerated, ignored or misread by v1? Probe in this packet's `scratch/` with a throwaway project and `opencode debug agent <name>` (see `scratch/cli-help/v1-debug-help.txt`). Also check whether v1 forwards unknown frontmatter keys to the model as provider options. (2) Which fields map cleanly between the versions: `model` with `#variant`, `steps`/`maxSteps`, `hidden`, `color`, `disabled`/`disable`, `mode`, and the closest v2 equivalent of `temperature`? (3) Body text in the 12 agents that names the v1 Task tool. v2 calls it `subagent`. Output: a field-by-field compatibility table with evidence, plus a recommended frontmatter shape that's correct on both. Check: `opencode debug agent` output on v1, and v2's `/api/agent` via `opencode2 api GET "/api/agent?location%5Bdirectory%5D=<url-encoded probe dir>"`. Never edit repo files outside this packet.

**Focus written, iteration 6 (ADAPTIVE: event ground truth and the open contract details):**

A4b v2 event and session contract ground truth: settle the open P0s from iteration 4 with primary evidence, not reference plugins. Use `scratch/cli-help/v2-openapi.json`, starting from the `/api/event` path, and follow its response schema and every `$ref`. (1) List every v2 event `type` and its `data` fields. (2) Is there an idle or session-finished signal and a compaction-completed signal that replace v1's `session.idle` and `session.compacted`? Name the exact event type and field, or state that there is none. (3) Map v1's `permission.asked`, `question.*` and `message.part.updated` to v2 names. (4) Give the real 2.0.32 signatures from `scratch/a2-v2pkg/package/dist/promise/*.d.ts` for the `ctx.session` message-read methods that `system-spec-gate.js:90` and `system-completion-sentinel.js:80` need, the `tool` `execute.after` event shape, and the `session` `context` hook event (`system` block type). (5) Probe in `scratch/` whether v2 tolerates an extra `__test` key on the default export. Use `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<url-encoded probe dir>"` and read the plugin's `state`. The first call may return before discovery, so call again. Output: the authoritative v1 → v2 event map and signature table, with file:line or JSON-pointer evidence. Never edit repo files outside this packet.

**Focus written, iteration 7:**

A6 commands on both versions: `.opencode/commands` is a symlink to `.skilled/commands` (208 files). Known, from an orchestrator probe: v2 registers 54 commands with slash names such as `deep/research`. It also registers non-command Markdown files under the commands tree as commands, for example `deep/assets/compiled/deep-research.contract`, `doctor/scripts/README` and `scripts/fixtures/README`. Investigate: (1) Does v1 1.19.3 register those same non-command files? Is there a convention that excludes them on both versions, such as a file pattern, a frontmatter flag, a directory name or `.md` versus `.txt`? (2) Frontmatter semantics on both versions: `description`, `agent`, `model` with `#variant`, `subtask` versus `subagent`, `argument-hint` and `allowed-tools`. Which fields are ignored, and does any of them change behaviour? (3) Template features on both versions: `$ARGUMENTS`, `$1..$N`, the `` !`cmd` `` shell injection and `@path`. (4) What replaces v1 `opencode run --command deep/research` on v2? v2 `run` has no `--command` (see `scratch/cli-help/v2-run-help.txt`). Consider a `/deep/research …` prompt as the message, and the `session.command` API operation in `scratch/cli-help/v2-openapi.json`. Output: a command compatibility table, a non-command exclusion recommendation that works on both versions, and the v2 non-interactive command invocation, all with evidence. Check: v1 discovery through the v1 CLI help and docs, and v2 discovery through `opencode2 api GET "/api/command?location%5Bdirectory%5D=<url-encoded repo root>"`. Never edit repo files outside this packet.

### Batch 2 result (iterations 5-7), and the foci for batch 3 (iterations 8-10)

**What landed:** newInfoRatio 0.80, 0.82 and 0.82, no failures, a wall-clock of 4 min 4 s, and each reduce run in order. A6 is done. A5 and A4 are partial.
- Iteration 5: a single frontmatter works only in the v1 shape. `chrome_devtools: deny` protects nothing on v2, which needs `browser: deny`. `temperature` is effectively v1-only. Agent bodies name the v1 `Task` tool many times. Whether v1 tolerates v2 keys is still unprobed, because the child wouldn't write a probe project outside `research/`.
- Iteration 6: in 2.0.32 the session domain has no message read and `Context` has no `client`. So the spec gate and completion sentinel would fail open and stay silent on v2. v2 has no idle or compaction-completed event: `session.wait` and the compaction hook are what exist. The `execute.after` payload shape was captured, and it registers on `ctx.tool`.
- Iteration 7: v1 also registers every `.md` file in the commands tree, so that isn't a v2 regression. The only exclusion that works on both versions is a non-`.md` suffix or a move out of the tree. The v2 replacement for `run --command` is `POST /api/session/{id}/command`.

**Orchestrator checks:**
- REFUTED f-iter007-006, "v2 `/api/command` returns `[]`". The raw query `GET "/api/command?location%5Bdirectory%5D=<url-encoded repo root>"` returns 54, run twice. `opencode2 api GET /api/command --param "location[directory]=..."` silently drops the location and resolves to home (2 commands). That is a tooling trap: the `--param` form does not encode deepObject parameters.
- Cleanup: iteration 7 left `/tmp/cmdprobe` and `/tmp/fmprobe`. They held only probe command files and `node_modules`, and the orchestrator deleted them.
- Rule for later foci: a probe project must live under an explicitly named `scratch/<id>/` path in this packet, never in `/tmp`.

**Focus written, iteration 8:**

A7 dual-key config and v1 tolerance probe: can one `opencode.json` plus one agent frontmatter carry both v1 and v2 keys without either version breaking or misreading them? Build the probe project at this packet's `scratch/a7-probe/`. This path is authorized for writes; create it, run `git init` there, and write nothing anywhere else. Give it an `opencode.json` with both `plugin` and `plugins`, both a v1 `permission` map and a v2 `permissions` rule list, and the `mcp` server in both the v1 shape (`mcp.<name>`) and the v2 shape (`mcp.servers.<name>`). Give it an `.opencode/agents/probe.md` with both `permission:` and `permissions:` plus the v2-only `steps`, `hidden`, `color` and `disabled: false`. Read v1 1.19.3 with `opencode debug config` and `opencode debug agent probe`, run inside the probe directory with `</dev/null`. Look for warnings, rejections, and any unknown frontmatter key that leaks into the agent's provider `options`. Read v2 with `opencode2 debug config` and `opencode2 api GET "/api/agent?location%5Bdirectory%5D=<url-encoded probe dir>"`. Use that raw query form, because `--param` drops the location. Call it twice, because the first call can return before discovery. Output: a key × version matrix (accepted, ignored with or without a warning, misread, or rejected) with quoted output lines, and the recommended single file shape for each. Never edit repo files outside this packet.

**Focus written, iteration 9:**

A8 skills on both versions: which skill sources does each version discover, and how does each treat the repo's skills? The repo has `.opencode/skills`, which is a symlink to `.skilled/skills`, nested mode packets under parent hubs such as `sk-code/sk-code-opencode/SKILL.md`, and `.claude/skills`. Known, from an orchestrator probe: v2 lists 74 skills for the repo root, and that includes the operator's global `~/.claude/skills`. Cover: (1) The v1 1.19.3 discovery paths and precedence (docs plus `scratch/cli-help/v1-debug-help.txt`; use `opencode debug skill` if it exists), compared with v2's documented `.opencode/skills`, `.claude/skills`, `.agents/skills` and global sources. (2) Whether each version treats nested packet `SKILL.md` files as separate skills, and how IDs and names are derived. Do both follow the symlink? (3) Duplicate-ID behaviour, when the repo and `~/.claude/skills` define the same id. (4) Which `SKILL.md` frontmatter fields each version reads: `name`, `description`, `allowed-tools`, `version`, `argument-hint`, `disable-model-invocation`, `metadata`. (5) Permission keys for skills (v2 `skill` action, and the v1 equivalent). Output: a skills compatibility table with evidence, plus a list of the repo skills each version would not expose or would expose twice. For v2, use `opencode2 api GET "/api/skill?location%5Bdirectory%5D=<url-encoded repo root>"`, raw query, called twice. Never edit repo files outside this packet.

**Focus written, iteration 10:**

A9 version-aware hooks and guards: how must the repo's dispatch guards and runtime hooks change so they're correct for both versions? Read `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` and `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, where the `opencode run` rules are `stdin-redirect-required`, `explicit-model-required`, `no-bare-agent-general`, `command-flag-for-slash-prompt` and `share-requires-confirmation`. Also find the Pi-side guard that denied the children's `opencode run --help` with "Pi dispatch denied: the command does not prove one direct executor"; search `.pi/` and `.skilled/hooks/`. For each rule, say whether it is still valid on v2: v2 `run` has no `--command`, `--variant`, `--port`, `--attach`, `--dir`, `--pure` or `--share`, and its model form is `provider/model#variant` (see `scratch/cli-help/v2-run-help.txt`). Also say whether it would recognize an `opencode2` invocation, and whether a user whose `opencode` binary is v2, the default after the official installer, would be mis-linted. Then check whether `.opencode/hooks`, a symlink to `.skilled/hooks`, is a runtime-loaded concept on either version or is only consumed by the plugins. Output: a per-rule v1/v2 validity table with file:line, a proposed version-aware matcher design (detect by `--version`, not by binary name), and the list of guard and hook files to change. Never edit repo files outside this packet.

### Batch 3 result (iterations 8-10), spot check 2, and the foci for batch 4 (iterations 11-13)

**What landed:** newInfoRatio 0.87, 0.78 and 0.74, no failures, a wall-clock of 6 min 13 s. A7 and A9 are done, and A8 is nearly done.
- Iteration 8: v1 rejects `permissions` and ignores `plugins`. `mcp.servers.<name>` is the only shared MCP spelling. Both versions leak unknown agent keys into provider options or `request.body`.
- Iteration 9: both versions expose the same 60 repo skills with identical ids. `sk-communication` has no `SKILL.md`.
- Iteration 10: a rule-by-rule v1/v2 validity table, findings that the guards fail open on `opencode2` and that `command-flag-for-slash-prompt` hard-blocks correct v2 runs, and a design for a version-aware matcher.

**Spot check 2 (orchestrator):**
- CONFIRMED f-iter008-001. `opencode debug config` in `scratch/a7-probe/` exits 1 with the message: "Configuration is invalid … V2 permissions are not supported by OpenCode V1. Use V1 "permission" rules or run opencode2." So v1 1.19.x deliberately rejects the v2 key.
- CONFIRMED f-iter008-005. v2's `/api/agent` record for `probe` carries `request.body = {permissions:[…], disabled:false}`. The v1 map was translated into rules, and `steps: 5`, `hidden: false` and `color: #ff0000` were applied.
- CONFIRMED f-iter010-003, observed earlier in this session: the repo's PreToolUse guard blocked `opencode run --help` but let `opencode2 run --help` through.
- New tooling trap: `opencode2 api …` output piped straight into another process came back truncated twice, cut mid-string at about 63 KB and about 290 KB. Redirecting to a file first gave the full 413 KB. Doctor checks must write to a file before parsing.
- Known, carried as context: v2 reads v1 `mcp.<name>` and converts it to `mcp.servers`, as `opencode2 debug config` on the repo root showed earlier in the session. The migration guide says v2 normalizes v1 config in memory.

**Focus written, iteration 11:**

A10 plugin dependencies and tool definitions on both versions: what must `.opencode/package.json` and the plugin sources depend on so one plugin tree works on v1 and v2 without broken imports? Known: the dual default export `{ id, setup, server }` loads on both versions with no import, from an orchestrator probe. Three plugins import `@opencode-ai/plugin/tool`: `opencode-goal.js:16`, `system-skill-advisor.js:24` and `system-speckit-completion.js:28`. v1 auto-installs `node_modules` into `.opencode/` (seen in both probe projects). `@opencode/plugin` 2.0.32 is ESM-only and exact-pins five sibling `@opencode/*` packages. Cover: (1) What v1's `tool()` helper and `tool.schema` actually return. Read `.opencode/node_modules/@opencode-ai/plugin/dist/tool.*`. Can a v1 tool be declared without that import, for example as a plain object with a zod or JSON schema? (2) The v2 tool shape: `ctx.tool.transform(editor => editor.add({ name, description, input: <JSON Schema>, execute }))` from `scratch/a2-v2pkg/package/dist/promise/tool.d.ts`. Can one tool definition object feed both? (3) Does v2 install a project's `.opencode/package.json` dependencies at all, and where? Read the v2 docs and the `opencode2 plugin --help` output in `scratch/cli-help/v2-plugin-help.txt`. (4) What dependency set gives a clean import graph on both versions: none, the v1 package only, or both? Note the risks of importing a v2-only package under v1. Output: a dependency and tool-definition recommendation with file:line evidence. If a probe is needed, write it only under this packet's `scratch/a10-probe/`, run `git init` there, and clean its `node_modules` afterwards. Never edit repo files outside this packet.

**Focus written, iteration 12 (ADAPTIVE: the P0 runtime gaps for the plugins that lose their triggers):**

A4c v2 replacements for the lost triggers: `system-completion-sentinel`, `system-skill-advisor`, `system-spec-gate` and `opencode-goal` depend on v1's `session.idle`, `session.compacted` and `session.created` events and on `ctx.client.session.messages`. Iteration 6 found no idle or compaction-completed event and no message read in the 2.0.32 `Context`. Settle this with primary evidence. (1) Grep the v2 binary for event-type strings. Run `strings ~/.local/opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe`, or the platform binary it wraps (find it under `~/.local/opencode-v2/lib/node_modules/@opencode/`), and pipe it through `grep -E 'session\.(idle|status|execution|compact|created|updated|error)|message\.(part|updated)'`. That gives the real v2 event names. (2) For each of the four plugins, design its v2 trigger. Candidates are `ctx.event.subscribe()` with the real names, `ctx.session.hook("context")` for reading messages and injecting system text, `ctx.session.hook("compaction")`, and `ctx.session.wait`. Quote the 2.0.32 `.d.ts` signatures from `scratch/a2-v2pkg/package/dist/promise/` (`session.d.ts`, `event.d.ts`, `plugin.d.ts`). (3) Explain how the spec gate can read the latest user prompt on v2 without `ctx.client`. Output: a plugin × v1 trigger → v2 trigger design table with evidence. Name any trigger that has no v2 equivalent as an irreducible gap, with its closest workaround. Never edit repo files outside this packet.

**Focus written, iteration 13:**

A11 cli-opencode dispatch to both versions: which changes does the `cli-opencode` skill need so it dispatches correctly whichever version is installed? Use `scratch/cli-help/v1-*-help.txt`, `v2-*-help.txt` and `v2-openapi.json`. The children's Pi guard blocks `opencode run`, so use the captured help text, not live runs. Cover: (1) Version detection: `opencode --version` prints `1.19.3`, while `opencode2 --version` prints `opencode v2.0.32`. Specify a parser that handles both formats, plus an `opencode2` fallback. (2) A full flag and subcommand matrix, v1 → v2: `--model` with `--variant` versus `#variant`; `--agent`; `--format json`; `--command` versus the `POST /api/session/{id}/command` operation or a `/name args` message; `--attach` and `--port` versus `--server` and `--standalone`; `--dir` versus a positional directory; `--pure`; `--share`; `--session`, `--continue` and `--fork`; `-f`; `--thinking`; `export` versus `session` subcommands; `attach`; `agent list` versus `debug agents`; `models`; `auth`; `serve`. (3) Which `cli-opencode` files encode v1-only behaviour, with file:line: `SKILL.md`, `references/cli-reference.md` (it pins v1.3.17), `references/providers-and-models.md`, `assets/` prompt templates, `hard-rules.json` and `manual-testing-playbook/`. (4) How the deep-loop runtime builds a `cli-opencode` lineage command, in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (search `cli-opencode`), and what has to branch by version there. Output: a v1 → v2 dispatch matrix, a version-detection spec and a file change list with line refs. Never edit repo files outside this packet.

### Batch 4 result (iterations 11-13), orchestrator checks, and the foci for batch 5 (iterations 14-16)

**What landed:** newInfoRatio 0.81, 0.88 and 0.76, no failures, a wall-clock of 3 min 44 s. A11 is done, A4 is now done, and A10 is partial.
- Iteration 11: v1's `tool()` is an identity function, so it can be replaced locally. zod 4.1.8 is an undeclared dependency. One zod shape can feed both versions through `z.toJSONSchema`. The child missed the packet's `scratch/`, so the 2.0.32 half of A10 is still open.
- Iteration 12: event ground truth from the shipped binary. It overturns f-iter004-002, f-iter006-004 and f-iter006-005, and contradicts f-iter004-003.
- Iteration 13: a v1 → v2 dispatch matrix. The version guard at `SKILL.md:134` fails on v2. The runtime never learns the version: `fanout-run.cjs:2093`, `:2962` and `:2923`.

**Orchestrator checks:**
- CONFIRMED f-iter012-001, -004 and -005, plus the `tui.toast.show` claim. Each of these event-name literals appears in the shipped v2 binary (`grep -c -a -F`): `"session.idle"` 1, `"session.compacted"` 1, `"session.status"` 1, `"session.execution.succeeded"` 8, `"session.compaction.ended"` 6, `"tui.toast.show"` 2, `"permission.asked"` 8 and `"form.created"` 8. `"question.asked"` appears 0 times.
- ANSWERED f-iter013-006. `--dangerously-skip-permissions` and `--yolo` are hidden boolean flags in both binaries, aliasing `--auto`. In v1 they sit in the run options: `auto: D.auto || D.yolo || D["dangerously-skip-permissions"]`. In v2 they sit in the root `opencode` command's params, defined as `dangerouslySkipPermissions: yc("dangerously-skip-permissions")`. Whether v2 `run` inherits them is unverified.
- REJECTED f-iter011-003, which rests on the 1.18.34 preview that f-iter002-002 already discredited.
- Rule for later foci: always spell the full packet path, `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/…`, because iteration 11 looked for `scratch/` at the repo root.

**Focus written, iteration 14:**

A12 standalone versus shared service, and env propagation to children: on v2, `opencode run` connects to one per-user background service unless `--standalone` is passed (see `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-run-help.txt`, `v2-service-help.txt` and `v2-help.txt`). Do env vars set on the client process, such as `AI_SESSION_CHILD=1`, `SYSTEM_SPEC_GATE_ENFORCE=0` and `OPENCODE_DB`, reach the plugins that run server-side? Probe without any model call. Create `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/` (authorized for writes, `git init` there) containing `.opencode/plugins/envprobe.js`. Its default export is `{ id: "probe.env", setup() {...}, async server() {...} }`, and each hook appends `process.pid`, `process.env.AI_SESSION_CHILD` and `process.env.OPENCODE_DB` to `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log`. Then run, with the probe directory URL-encoded as a raw query and output redirected to a file: (a) `AI_SESSION_CHILD=1 opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<enc>"`, which uses the shared service; (b) `AI_SESSION_CHILD=1 opencode2 api --standalone GET "/api/plugin?location%5Bdirectory%5D=<enc>"`; (c) the same on v1 with `AI_SESSION_CHILD=1 opencode debug config </dev/null` inside the probe directory. Call (a) twice, because discovery can lag. Compare the logged pids and env values to see which server process ran the plugin and which env it saw. Also cover service lifecycle (who starts the service, and with which env and database) and what happens when several `run` clients share it at once. Output: an env-propagation table and a recommended dispatch mode for deep-loop children on v2. Write nothing outside `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/` and this packet's research files.

**Focus written, iteration 15:**

A13 install guidance for side-by-side, v1-only and v2-only setups: what must the `cli-opencode` skill document so a user can copy this repo's setup, or install just one version? Known facts from this session: - v1 `opencode-ai` 1.19.3 is installed with npm under `~/.local`. - v2 `@opencode/cli` 2.0.32 is installed into its own npm prefix, `~/.local/opencode-v2`. Its package exposes both `opencode` and `opencode2` bins, so it needs a separate prefix. - A `~/.local/bin/opencode2` launcher script defaults `OPENCODE_DB=opencode-v2.db`, because v2 otherwise opens v1's `~/.local/share/opencode/opencode.db`. - The official v2 migration guide says the v2 curl installer replaces the v1 binary, and that v1 and v2 are "no longer installed side by side by default". - Both versions share `~/.config/opencode` and the cache. - v2 starts a per-user background service. Cover: (1) Each installer's behaviour per version: curl, `brew` (check `brew info opencode` read-only), `npm`, and `bun`/`pnpm` if documented. (2) What `opencode upgrade` does on v1 1.19.3. Could it jump a v1 install to 2.x? Check `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-help.txt`, the binary strings at `~/.local/lib/node_modules/opencode-ai/node_modules/opencode-darwin-arm64/bin/opencode` and the docs. (3) Uninstall and data-safety facts for each version. (4) How a script can detect which versions are present and which one `opencode` resolves to. (5) A proposed repo-shipped setup helper with modes `both`, `v1`, `v2` and `check`, idempotent, with rollback lines. Output: an install matrix and a step list per mode, with evidence. Do not install, upgrade or uninstall anything. Read-only probes only.

**Focus written, iteration 16:**

A14 server API clients in the repo: which repo code talks to an OpenCode server or SDK directly, and how does each call map from v1 to v2? Search `.skilled/`, `.opencode/` and `~/.config/opencode/plugins/` (read-only) for `@opencode-ai/sdk`, `createOpencodeClient`, `opencode serve`, `--port`, `--attach`, `client.session.`, `client.tui.`, `client.app.`, `/session/` and `/event` HTTP paths, and `OPENCODE_SERVER`. Map each call site to the v2 API in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json`, and to the `@opencode/client` package if `npm view @opencode/client` shows it. Include the deep-loop runtime's `cli-opencode` executor paths in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and any `--attach`/`serve` usage in `cli-opencode` docs or the playbook. Output: a call-site inventory with file:line, a v1 → v2 endpoint and client mapping, and the sites with no v2 equivalent. Never edit repo files outside this packet.

### Batch 5 result (iterations 14-16), spot check 3, a service incident, and the foci for batch 6 (iterations 17-19)

**What landed:** newInfoRatio 0.83, 0.90 and 0.90, a wall-clock of 2 min 41 s. A12, A13 and A14 are done. All five key questions are now marked answered.
- Iteration 14: each version calls only its own entry (v1 `server()`, v2 `setup()`). The v2 daemon freezes its environment for life. The v1 and v2 databases are incompatible. v2 honours singular `plugin`, which overturns f-iter012-007.
- Iteration 15: `opencode upgrade --major` on v1 means "upgrade to OpenCode 2 and remove OpenCode 1". Homebrew is v2-only. The skill has no install guidance today.
- Iteration 16: the repo has no server-API clients, only in-process `ctx.client` calls. The v2 client is `@opencode/client`.

**Incident:** iteration 14 ran `opencode2 service stop` and restarted the v2 service with its own dispatch environment, including `SYSTEM_SPEC_GATE_ENFORCE=0`, `PI_BLACKHOLE_PASSIVE` and `SPECKIT_CLI_DISPATCH_STACK`. The service it stopped had been started by the orchestrator's own debug queries earlier in this session. It was not an operator service. The helper stopped the polluted replacement. The orchestrator then started a clean service, PID 46220, by running `env -u AI_SESSION_CHILD -u PI_BLACKHOLE_PASSIVE -u SPECKIT_CLI_DISPATCH_STACK opencode2 service start`. Its environment has `OPENCODE_DB=opencode-v2.db` and no child dispatch variables. New rule for every later focus: never run `opencode2 service stop`, `start` or `restart`, or `opencode2 uninstall`.

**Spot check 3 (orchestrator):**
- REFUTED the implication of f-iter014-004, that standalone loads no plugins. `opencode2 api --standalone GET /api/plugin` returns zero plugins, built-ins included, on every call, and no plugin code runs. The fresh private server answers before it activates the location. That is the same first-call lag the shared service shows.
- CONFIRMED that `run --standalone` loads project plugins and passes the client environment. `AI_SESSION_CHILD=1 opencode2 run --standalone -m nosuchprovider/nosuchmodel "hi" </dev/null` called `setup()` in a private server, pid 57350, which saw `AI_SESSION_CHILD=1`. It then failed "Model unavailable", so no model call ran. The same command without `--standalone` ran `setup()` in the shared service, pid 46220, with `AI_SESSION_CHILD` undefined. That confirms f-iter014-002. The v2 dispatch rule follows: children must use `run --standalone`.
- CONFIRMED f-iter015-001. `opencode upgrade --help` on v1 1.19.3 lists `--major`, "upgrade to OpenCode 2 and remove OpenCode 1".
- INCONCLUSIVE: whether v1 accepts `-m provider/model#variant`. A bogus model gives the generic "Unexpected server error" either way.

**Focus written, iteration 17:**

A15 verification design: a two-version doctor and CI check. Specify concrete, scriptable checks that prove the repo works on whichever version is installed, using only facts this run has proven. Known checks: - v2 plugin status: `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<enc>"`, raw query, output redirected to a file because piped output truncates, retried because the first call returns before discovery. Each repo plugin should show `state.status == "active"`. - v2 agent, command and skill registration: `opencode2 debug agents`, `/api/command` and `/api/skill`, raw query. - v1: `opencode debug config </dev/null` loads plugins without a model call, and `opencode debug agent <name>` and `opencode debug skill` exist. Each version calls only its own entry. - A model-free smoke test that loads plugins and passes env, on both versions: `run --standalone -m nosuchprovider/nosuchmodel` on v2. Find the v1 equivalent. Investigate how v1 can report per-plugin load success or failure without a status API, for example logs under `opencode debug paths` or a marker convention. Find where the repo's existing doctor framework lives (`/doctor:*` command docs under `.skilled/commands/doctor/` and their scripts) and where a new `/doctor:opencode` or similar check would slot in. Design a CI job that installs both versions side by side in separate npm prefixes. Output: a check list (command, expected output, pass rule) for v1, v2 and both, the doctor integration point with file paths, and the CI job outline. Do not install anything. Never run `opencode2 service stop`, `start` or `restart`, or `uninstall`. Never edit repo files outside this packet.

**Focus written, iteration 18 (ADAPTIVE: port specifications for the hard plugins):**

A3b v2 port specs for the five hard plugins: `system-completion-sentinel.js`, `system-skill-advisor.js`, `system-spec-gate.js`, `opencode-goal.js` and `sk-vision`. The `.opencode/plugins/sk-vision.js` bundle comes from `.skilled/skills/sk-vision/vision-runtime/` sources. Write an implementable v2 `setup(ctx)` design for each, kept beside the existing v1 `server()` in one default-export object `{ id, setup, server }`. Use the real 2.0.32 types in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/` (`plugin.d.ts`, `session.d.ts`, `tool.d.ts`, `event.d.ts`) and the event names proven in the shipped binary: `session.idle`, `session.compacted`, `session.status`, `session.execution.*`, `session.compaction.*`, `permission.asked`, `form.*` and `tui.toast.show`. Settle the open P0s: (1) Does the v2 message list, `GET /api/session/{id}/message` in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json`, include `parts`, which `system-completion-sentinel.js:89` needs? Follow the `$ref`s. (2) The v2 equivalent of `client.session.promptAsync` (`opencode-goal.js:2685`): a `ctx.session` method or `POST /api/session/{id}/prompt`, and whether it returns before the turn runs. (3) How `sk-vision` shows a toast on v2: a `./tui` export with `Plugin.Features.tui`, or emitting `tui.toast.show`. (4) How the spec gate reads the latest user prompt, through `session.hook("prompt")` or `context` messages. (5) Where module-level state must reset on reload. Output: for each plugin, the v1 trigger, the v2 trigger, the API calls, and the remaining gap or workaround, with file:line and JSON-pointer evidence. Never edit repo files outside this packet.

**Focus written, iteration 19:**

A16 release cadence, pinning and what "perfect" can promise: use `npm view <pkg> time --json` and dist-tags for `opencode-ai`, `@opencode/cli`, `@opencode/plugin` and `@opencode-ai/plugin` to measure how often each line releases and whether v1 is still maintained, from the `latest-1` tag and the recent 1.19.x cadence. Read the stability and beta statements in the v2 docs (https://opencode.ai/v2/docs/ and the migrate-v1 and plugins pages) and the v1 1.19.x behaviour that deliberately rejects v2 config keys, as in "V2 permissions are not supported by OpenCode V1". Define: (1) The minimum supported versions, with the reason for each floor. For example, v1 1.18.29 is the floor for object plugin entries, and 1.19.x is the line that knows about v2 keys. (2) The pinning strategy for the repo's `.opencode/package.json` (currently `@opencode-ai/plugin` 1.18.34, with zod undeclared) and for any v2 dependency. (3) How the repo should detect an unsupported or untested version at runtime and say so. (4) A support-window policy: test on each new v2 minor, and when to drop v1. (5) An honest statement of what "perfect compatibility" can and can't guarantee, given the v2 API's change rate. Output: a release-cadence table with dates, a floor and pinning table with reasons, and the support policy text. Never edit repo files outside this packet.

### Batch 6 result (iterations 17-19), and the focus for iteration 20

**What landed:** newInfoRatio 0.55 (after the redispatch), 0.86 and 0.78, no 429s. A15, A16 and A3b are done.
- Iteration 17: v1 has a model-free discovery check (`debug config`). Per-plugin load success comes from the INFO and WARN plugin log lines. The load check belongs in CI, because the repo guard blocks nested `run` in Pi.
- Iteration 18: port contracts for the five hard plugins. The v2 message list has no `parts`. `ctx.session.prompt` with `delivery: 'queue'` replaces `promptAsync`. There is no typed server-side toast. The prompt hook and the context hook cover the spec gate and the advisor.
- Iteration 19: a cadence table (v2 about 0.94 releases a day, v1 1.19.x about 0.8 a day). The two lines live in different npm scopes. There is no v2 stability guarantee. Proposed floors are 1.19.0 and 2.0.32, though the 1.18.x claim is inferred only.

**Orchestrator rulings:**
- REJECTED f-iter018-008, `Object.assign(v1Factory, {id, setup})`. v2 rejects a function carrying `.id`/`.setup` (pre-run probe and spot check 1). The plain object `{ id, setup, server }` is the confirmed shape.
- Noted f-iter019-006 as inferred: 1.18.x behaviour with v2 keys was never probed.
- Iteration 17's first attempt wrote through `--run-directory research/deltas`. The workflow redispatch recovered it, and its stray ledger set in `research/deltas/` is due for cleanup. The gateway also refused the `schema_mismatch` event, the same defect class as `userPaused`. The orchestrator is fixing that in parallel.
- Environment note: the clean service, 46220, carries `SYSTEM_SPEC_GATE_ENFORCE=0` because this orchestrator session's own shell exports it. That is the operator session's environment, not a child's.

**Focus written, iteration 20:**

A17 irreducible gaps and the closest workaround for each: build the final gap ledger for perfect v1 + v2 compatibility, from this run's own evidence only. Read `research/iterations/iteration-001.md` through `iteration-019.md` and `research/steering-log.md`. The steering log's orchestrator spot checks override child findings wherever they disagree. For example: one plain-object `{ id, setup, server }` export works on both; a function with `.id` is rejected by v2; v2 does define `session.idle` and `session.compacted`; `run --standalone` loads plugins and passes client env, while the shared service does not; v1 rejects v2 `permissions`. Classify every v1 feature the repo uses as (a) portable as-is, (b) portable with a mechanical change, (c) portable only with a behavioural workaround, or (d) irreducible on v2 or on v1. Candidates for (c) or (d): - per-agent `temperature` - server-side toast for `sk-vision` - reading message parts in the completion sentinel and spec gate - observing other commands through `command.execute.before` - `experimental.compaction.autocontinue`, `provider.small_model` and `text.complete` - the `$` shell helper - env propagation through the shared service - v1/v2 database incompatibility - one `opencode.json` carrying `permissions` - non-command `.md` files registering as commands on both versions - `opencode upgrade --major` removing v1 - the Homebrew v2-only formula - the VS Code extension - LSP - `CLAUDE.md` - the `opencode2 api --param` and pipe-truncation traps For each, name the user-visible effect and the closest workaround. Finally, state in one paragraph what "perfect compatibility" can honestly mean for this repo. Output: the classified ledger, with an iteration or steering-log citation per row. Never edit repo files outside this packet. Never run `opencode2 service` or install commands.

### Iteration 20 result, synthesis, and spot check 4

**What landed:** newInfoRatio 0.58, and A17 is done. The run stopped at the cap with stopReason `maxIterationsReached`, then synthesis wrote `research/research.md` in the 17-section format. Iteration 20 classified 47 ledger rows. All 20 `Focus Area:` lines in `prompts/iteration-N.md` match the foci written in this log.

**Route proof:** every `deltas/iter-NNN.jsonl` iteration row carries `target_agent: "deep-research"` and `agent_definition_loaded: true`. All 21 dispatches (20 iterations, plus the iteration 17 redispatch) left intent and completion receipts in `dispatch-receipts/`. All 42 receipts show `pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max`. Iteration 10's delta labels its own executor `native`. That is the child describing itself, and the receipts contradict it.

**Spot check 4 (orchestrator, after synthesis):**
- CONFIRMED: the ledger counts. The class column of the iteration 20 ledger counts 9 a, 21 b, 4 c, 9 d and 4 unknown, 47 rows in all.
- CONFIRMED, with a correction: skill parity. `opencode debug skill` on v1 1.19.3 returned 73 rows and `/api/skill` on v2 2.0.32 returned 74. Filtered to the repo root, both give the same 60 ids. Three of those 60 are vendored, though: `playwright-cli`, `playwright-component-testing` and `playwright-trace` come from `sk-design/sk-design-md-generator/backend/node_modules/`. The repo itself has 57 skills, and both hosts also expose the 3 vendored ones. Ledger row 26 covers this. The wording "60 repo skills" in iteration-009 F1 and research.md §1 is loose.
- CONFIRMED for v2: stray `.md` files register as commands. `/api/command` returned 54 entries. Those are all 51 on-disk `.md` stems under `.skilled/commands`, including `doctor/scripts/README` and `deep/assets/compiled/deep-research.contract`, plus `init`, `review` and `code_mode:utcp_codemode_usage`. The v1 half stays documented (iteration-007 F1).
- Tooling note: the first two v2 `/api/skill` calls returned an empty `data` array, and the third returned 74. The first-call-before-discovery trap can take more than one call, so a doctor check must retry until the count stabilizes.
