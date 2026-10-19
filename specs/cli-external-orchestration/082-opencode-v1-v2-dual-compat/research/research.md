---
title: "Research: OpenCode v1 and v2 dual compatibility for the Skilled repo"
description: "Twenty-iteration steered deep research into making every agent, command, plugin, skill, hook and config file in this repo work on OpenCode v1 1.19.x and v2 2.0.x at once, plus cli-opencode dispatch and install guidance for both versions."
trigger_phrases:
  - "opencode v1 v2 dual compat research"
  - "opencode v2 plugin migration"
  - "opencode side by side install"
  - "cli-opencode version detection"
importance_tier: "normal"
contextType: "research"
---

# Research: OpenCode v1 and v2 dual compatibility for the Skilled repo

<!-- ANCHOR:deep-research-opencode-v1-v2-dual-compat -->

**Evidence labels.** Every load-bearing claim carries one label.

- **[confirmed]**: the orchestrator reproduced it in a spot check or ruling recorded in `research/steering-log.md`.
- **[documented]**: an iteration recorded primary evidence the orchestrator did not re-run. That evidence is a probe log in this packet, a type file, official docs, captured help, the OpenAPI document or the shipped binary.
- **[inferred]**: reasoning from the evidence. Each inferred claim names what would confirm it.

Where the steering log refutes or rejects an iteration finding, the steering log wins, and the refuted claim is listed under Eliminated Alternatives.

## 1. Answer

Yes, with a precise meaning. One plugin tree, one agent frontmatter shape, one command tree, one skill tree and one `opencode.json` can load and run on both OpenCode 1.19.3 and 2.0.32. A small, named set of features then behaves differently or exists on only one host. Identical behaviour is not achievable, and nine gaps cannot be closed from this repo.

- **Plugins.** Each plugin default-exports one plain object `{ id, setup, server }`. v1 calls `server(input)` and v2 calls `setup(ctx)`, and v2 discovers the flat `.opencode/plugins/*.js` file. [confirmed, steering-log.md:107] The v1 hook bodies stay as they are; each plugin gains a new v2 `setup` leg.
- **Config.** `opencode.json` stays in the v1 shape. v1 1.19.3 refuses to start on the v2 `permissions` key with "V2 permissions are not supported by OpenCode V1". [confirmed, steering-log.md:158] v2 translates the v1 `permission` map one way.
- **Agents.** Frontmatter stays in the v1 shape plus `browser: deny` beside `chrome_devtools: deny`. Per-agent `temperature` is carried but not sent on v2. [documented, iteration-005.md:33-49]
- **Commands.** Both versions register every `.md` file under the commands tree. The fix that works on both is a non-`.md` suffix or a move out of the tree. [documented, iteration-007.md:35-66]
- **Skills.** Both versions expose the same 60 repo skills with identical ids. [documented, iteration-009.md:19-23]
- **Guards.** The dispatch guards fail open on `opencode2`, and one rule hard-blocks a correct v2 run. They need a version-aware matcher keyed on the parsed `--version`, not on the binary name. [confirmed for the fail-open half, steering-log.md:160; documented for the rest, iteration-010.md:33-75]
- **cli-opencode.** The skill needs version detection that parses two output formats, two invocation shapes, and `run --standalone` for every v2 child. Only standalone mode passes the child environment to plugins. [confirmed, steering-log.md:212]
- **Install.** The only verified side-by-side layout is two npm prefixes plus a launcher that sets `OPENCODE_DB`. `opencode upgrade --major` removes v1. [confirmed, steering-log.md:213]

The final gap ledger has 47 rows: 9 portable as-is, 21 portable with a mechanical change, 4 portable only with a behavioural workaround, 9 irreducible and 4 never established. [documented, iteration-020.md:18-143] The honest public claim is: "Verified against OpenCode 1.19.3 and 2.0.32 on 2026-10-18. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified." [inferred from iteration-019.md:172-174 and iteration-020.md:147. A per-version doctor run on each new release would confirm it.]

## 2. Scope and Method

- **Question.** How to make the Skilled repo compatible with OpenCode v1 (1.19.x) and v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus `cli-opencode` dispatching to both versions and documenting side-by-side and single-version installs.
- **Hosts measured.** `opencode` 1.19.3 and `opencode2` 2.0.32, installed side by side on one machine. v1 type surface: the installed `@opencode-ai/plugin` 1.18.34 (the repo pin). v2 type surface: `@opencode/plugin` 2.0.32, packed into `scratch/a2-v2pkg/`.
- **Run shape.** 20 iterations by `cli-pi` with `deepseek-v4.1-flash`, stop policy `max-iterations`, convergence mode off. The orchestrator steered each focus by angle (A1 to A17, with adaptive slots at iterations 6, 12 and 18). From iteration 2 the run used parallel batches of three. The orchestrator ran spot checks after iterations 4, 10 and 16 and issued rulings after each batch (`research/steering-log.md`).
- **Probe rules.** Probe projects lived only under named `scratch/<id>/` paths in this packet, after an early `/tmp` incident (steering-log.md:135-136). The repo's Pi dispatch guard blocked `opencode run` inside children, so children used help text the orchestrator captured in `scratch/cli-help/` (37 files plus `v2-openapi.json`). [confirmed, steering-log.md:112]
- **Incident.** Iteration 14 stopped and restarted the v2 background service with child dispatch variables in its environment. The helper stopped the polluted replacement. The orchestrator then started a clean service (PID 46220), and later foci barred `opencode2 service` and install verbs. [confirmed, steering-log.md:208]
- **Tooling caveat.** The append gateway's state-log projection drops `focus`, `answeredQuestions` and `graphEvents`, so `research/deltas/iter-NNN.jsonl` is the authoritative per-iteration record. [documented, iteration-001.md:103-107]

## 3. Q1: Plugin Shape and the Port of the 16 Plugins

**The shape.**

- One plain-object default export `{ id, setup(), async server(input) }` loads on both hosts. v1 1.19.3 calls `server()` with input keys `client, project, worktree, directory, experimental_workspace, serverUrl, $`. v2 2.0.32 calls `setup()` on the flat file. [confirmed, steering-log.md:107]
- Neither host calls the other's entry. A plugin that exports only one entry is a silent no-op on the other host. [documented, iteration-014.md:18]
- The official migrate-v1 page documents the same pattern: spread `Plugin.define({id, setup})` into an object and add `async server()`. [documented, iteration-003.md:21-34]
- v2 rejects a function default export that carries `.id` and `.setup`, with "Plugin must export a default definition with an id and an effect or setup function". [confirmed, steering-log.md:79]
- The real 2.0.32 context type is `Context` with 26 domains. `PluginContext` does not exist in 2.0.32. The 1.18.34 preview is wrong in both directions: it has a `catalog` domain that 2.0.32 dropped, and it lacks 18 domains that 2.0.32 ships. [documented, iteration-002.md:17-93]
- `setup` may return a `Cleanup` function, and each `hook()` or `transform()` returns a `Registration` with `dispose()`. The `Reload` mixin is gone; reload is per domain. [documented, iteration-002.md:95-112, iteration-018.md:103-116]

**Hook census and v2 targets.**

- 15 of the 16 plugins use only five hook keys: `event` (9 plugins), `tool.execute.before` (8), `experimental.chat.system.transform` (8), the `tool` map (4) and `tool.execute.after` (3). No plugin uses `shell.env`, `chat.params`, `chat.headers`, `permission.ask`, `config`, `auth`, `provider` or `$`. [documented, iteration-003.md:65-100]
- Every one of those keys has a v2 destination on the migrate page. Examples: `event` goes to `ctx.event.subscribe()`, `tool.execute.*` to `ctx.tool.hook("execute.before" | "execute.after")`, `experimental.chat.system.transform` to `ctx.session.hook("context")`, and `chat.message` to `ctx.session.hook("prompt")`. [documented, iteration-003.md:36-63]
- The callback arity changes everywhere. v1 hooks take `(input, output)`, while v2 passes one mutable event. `system` changes from `string[]` to structured `SystemPart` blocks. [documented, iteration-003.md:102-104, iteration-006.md:57-61]
- The `execute.after` payload carries the tool result under `result`, discriminated by `status: "completed" | "error"`. It registers on `ctx.tool.hook`, not on the session. [documented, iteration-006.md:38-55]
- `ctx.location.directory` is scoped to where the plugin instance loaded, not to the observed session. 13 plugins capture a root at load time, so the guards must read the location from the event when it matters. [documented, iteration-003.md:106-108]

**The five hard plugins.** [documented, iteration-018.md:168-176, iteration-012.md:176-183]

| Plugin | v1 trigger | v2 trigger | Remaining gap |
|---|---|---|---|
| `system-completion-sentinel` | `session.idle` + `client.session.messages` | `ctx.event.subscribe` on `session.idle` | No message read: `Context` has no `client`, and the v2 message list carries no `parts`. Cache assistant text per session from the event stream. Behavioural workaround. |
| `system-spec-gate` | `event` + system transform + `tool.execute.before` | `session.hook("prompt")` to read, `session.hook("context")` to inject, `tool.hook("execute.before")` to deny | Closed: the prompt read and the injection both port directly |
| `system-skill-advisor` | `session.compacted` + system transform + `tool` | `session.compacted` or `session.compaction.ended`, then `session.hook("context")`, then `ctx.tool.transform` | Mechanical. Cleanup replaces the `global.disposed` signal. |
| `opencode-goal` | `session.*` events + `promptAsync` | same event names; `ctx.session.prompt({sessionID, text, delivery: "queue"})` | The deadline and abort wrapper must be rebuilt |
| `sk-vision` (symlinked 13,911-line bundle) | `command.execute.before` + `client.tui.showToast` | `ctx.command.transform` owns the command | Irreducible: no server-side toast, and no global command observer |

**Events.** The v2 binary defines `session.idle`, `session.compacted` and `session.status` (idle, busy or retry), plus `session.execution.*`, `session.compaction.*`, `permission.asked` and `form.*`. [confirmed, steering-log.md:184] `question.asked` is absent, so plugins that branch on `question.*` need a `form.*` branch on v2. [confirmed, steering-log.md:184] `permission.asked` keeps its v1 field names. [documented, iteration-012.md:115-129]

**Silent failure risk.**

- On v2 the spec gate and the completion sentinel do not throw. They return `null` through their own defensive guards, so the gate stays open and the sentinel stays silent with no log line. [documented, iteration-006.md:17-36]
- `classifier-injection-screen` hides three independent v2 breaks inside its own fail-open catch. [documented, iteration-003.md:122-130]
- Any port must turn these guards into positive capability checks and add a v2 test that asserts on the registered payload shape. [inferred. A v2 load test that asserts a registration count per plugin would confirm it.]

**Module state.** On v2 the plugin runs inside a long-lived daemon shared by every client. On v1 it runs in a child of each CLI invocation. [documented, iteration-014.md:37] Module-level caches must be created inside `setup` and reset in its Cleanup, and per-session state must be keyed by `sessionID`. [documented, iteration-018.md:112-116]

## 4. Q2: One Set of Agents, Commands, Skills and opencode.json

**opencode.json.**

| Key | v1 1.19.3 | v2 2.0.32 | Shared form |
|---|---|---|---|
| `permissions` (v2 rule list) | Rejected; the whole project stops [confirmed, steering-log.md:158] | Native | Never author it |
| `permission` (v1 map) | Native | Translated one way into rules, with `bash` renamed `shell` [documented, iteration-008.md:151-169] | Author this one |
| `plugins` (plural) | Silently ignored, no warning [documented, iteration-008.md:47-57] | Native | Do not rely on it. The repo declares no config plugins. [documented, iteration-003.md:156-160] |
| `plugin` (singular) | Native | Honoured, `setup` fired [documented, iteration-014.md:35] | Usable if ever needed |
| `mcp.servers.<name>` | Unwrapped into real servers [documented, iteration-008.md:59-72] | Native | The one MCP shape proven on both |

Consequence: per-version permission richness cannot be expressed in one file. v2 users get the translated v1 cascade, not a resource-scoped rule list. [documented, iteration-008.md:146-149]

**Agent frontmatter.** [documented, iteration-005.md and iteration-008.md:74-149]

- Shared shape: `description`, `mode`, `steps`, `hidden`, `color`, the v1 `permission:` map, and `temperature`. `mode: all` is legal on both. [documented, iteration-012.md:95-104]
- Never add `permissions:` or `disabled:`. On v1 they leak into the agent's provider `options`; on v2 the presence of `permission:` diverts them into `request.body`. [confirmed, steering-log.md:159]
- Add `browser: deny` beside `chrome_devtools: deny`. `chrome_devtools` is an inert action name on v2, and v1 accepts any key under `permission:`. [documented, iteration-005.md:43-49]
- `temperature` reaches v2 only as `request.body.temperature`, which v2 does not send. Nine agents at 0.1 will be less deterministic on v2. [documented, iteration-005.md:33-41]
- Agent bodies name the v1 `Task` tool (30 times in `orchestrate.md` alone). v2 calls it `subagent` and ships the body verbatim. Use a runtime-neutral noun and extend the runtime table at `.skilled/agents/orchestrate.md:35`. [documented, iteration-005.md:62-71]
- `opencode2 debug agents` is a working v2 agent oracle, and it follows the `.opencode/agents` symlink. [documented, iteration-008.md:171-179]

**Commands.**

- Both versions register every `.md` file under the commands tree, recursively. The only filter is the `.md` suffix. There is no frontmatter opt-out on v1, and none was found on v2. [documented, iteration-007.md:35-66]
- v2 `GET /api/command` returns 54 commands with the raw percent-encoded `location[directory]` query. The `--param` form drops the location and resolves to home. [confirmed, steering-log.md:134]
- `$ARGUMENTS` is in 40 of 51 commands and in both binaries. Exactly one command uses shell injection (`speckit/search.md:15`) and one uses an `@path` include (`design/extract.md:12`). [documented, iteration-007.md:132-142]
- `allowed-tools` restricts nothing on either version. v1 honours `subtask` and ignores `subagent`; the repo uses neither. [documented, iteration-007.md:68-85, iteration-007.md:144-154]

**Skills.**

- Both versions list the same 60 repo skills with identical ids. Both follow the symlinked roots and dedupe by real path. [documented, iteration-009.md:19-27]
- For five ids, v1 reports the `.claude/skills/...` path while v2 reports the `.opencode/skills/...` path. Consumers must normalise with `realpath`. [documented, iteration-009.md:29-41]
- Both versions also catalogue three vendored `playwright-*` skills from a `node_modules` tree inside `sk-design`. `sk-communication` has no `SKILL.md`, so neither version sees it. [documented, iteration-009.md:52-95]

Answered: key question 2 closed at iteration 14, using the agent (iterations 5 and 8), command (iteration 7), skill (iteration 9) and config (iterations 8 and 14) legs.

## 5. Q3: Hooks, Guards and Dependencies

**Guards.** [documented, iteration-010.md]

- `opencode2` is invisible to the dispatch classifier. `EXECUTOR_BASENAMES` holds only `opencode`, and every evidence regex is `\bopencode\s+run\b`. So `opencode2 run` classifies as `none` and no hard rule is evaluated. [confirmed, steering-log.md:160]
- `command-flag-for-slash-prompt` demands `--command` at severity error, and v2 `run` has no `--command`. It therefore blocks a correct v2 slash-command workflow. [documented, iteration-010.md:40]
- After the official installer, `opencode` is v2, so name-based selection lints a v2 CLI with v1 rules. Locally, `opencode` is v1 and `opencode2` is v2. Name and version are uncorrelated. [documented, iteration-010.md:58-62]
- Proposed matcher:
  - widen name admission to `opencode\d*`;
  - give each rule `appliesTo: ["v1"] | ["v2"] | ["v1","v2"]`;
  - resolve the version tri-state (`v1`, `v2` or `unknown`) from one memoised `--version` probe, cached per binary and mtime;
  - on `unknown`, evaluate only the rules valid on both versions;
  - use command-shape evidence (v1-only flags, `--standalone`, `#variant`) as a second signal.

  [documented as a design, iteration-010.md:64-75; inferred as correct. A test matrix over both binaries would confirm it.]
- `.opencode/hooks` is not a host concept on either version. It is reached only through the plugins' relative imports. [documented, iteration-010.md:77-85]

**Dependencies.**

- v1's `tool()` is an identity function, and `tool.schema` is zod. Dropping `import { tool } from '@opencode-ai/plugin/tool'` (3 plugins) for a local identity helper changes nothing on v1. [documented, iteration-011.md:18-22]
- zod 4.1.8 is a phantom dependency: it resolves only through npm hoisting. [documented, iteration-011.md:48-50]
- One zod shape can feed both hosts: the raw shape to v1, and `z.toJSONSchema(z.object(shape), {io: 'input'})` to v2's `editor.add({ input })`. [documented, iteration-011.md:52-56]
- Whether that JSON Schema satisfies v2's `Tool.ValueSchema` is not established. [documented as open, iteration-018.md:158-166]
- `@opencode/plugin` 2.0.32 is ESM-only and exact-pins five sibling `@opencode/*` packages. [documented, iteration-002.md:166-173] Plugins should therefore stay import-free at runtime, and the v2 package belongs only in type-checking. [inferred, iteration-019.md:102-116. A clean v2-only install that loads every plugin would confirm it.]

Answered: key question 3 closed at iteration 10.

## 6. Q4: cli-opencode Version Detection and the Dispatch Matrix

**Detection.**

- `opencode --version` prints `1.19.3`, while `opencode2 --version` prints `opencode v2.0.32`. [documented, iteration-013.md:76-77]
- The guard at `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:134` (`grep -q '^1\.'`) therefore reports a healthy v2 install as broken. [documented, iteration-013.md:81]
- Spec:
  1. Resolve the binary in order: `$OPENCODE_BIN`, `opencode2`, `opencode`.
  2. Run `--version` and parse it with `^\s*(?:[A-Za-z][\w.-]*\s+)?[vV]?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$`.
  3. Map major 1 to the v1 contract and major 2 to v2.
  4. Refuse to dispatch on an unparsable version.
  5. Cache by realpath, size and mtime.

  [documented, iteration-013.md:130-139]
- The deep-loop runtime never learns a version. `resolveExecutableVersion` (`fanout-run.cjs:2093`) returns a sha256 identity, `isOpencodeBinaryAvailable` checks only `opencode` (`:2962`), and the dispatch table (`:2923`) takes no version. [documented, iteration-013.md:89-103]

**Flag matrix** (from the captured help). [documented, iteration-013.md:21-43]

| Need | v1 1.19.3 | v2 2.0.32 |
|---|---|---|
| Model and effort | `-m provider/model` plus `--variant` | `-m provider/model#variant` (schema-legal [documented, iteration-012.md:106-113]) |
| Registered command | `--command family/name` | absent; use `POST /api/session/{id}/command` (`session.command`) |
| Working directory | `--dir` | absent; positional directory, behaviour unverified |
| Attach | `--attach`, `-p`, `-u` | `--server`, `--standalone` |
| `--pure`, `--share`, `--port` | present | absent on `run` |
| Permission bypass | hidden `--dangerously-skip-permissions` and `--yolo`, aliases of `--auto` | the same hidden aliases on the root command; whether `run` inherits them is unverified [confirmed for existence, steering-log.md:185] |
| Kept on both | `--agent`, `--format default\|json`, `--title`, `--thinking`, `--auto`, `-c`, `-s`, `--fork`, `-f`, `--print-logs` | same |

**No single invocation line serves both versions.** For example, `fanout-run.cjs:2324` emits `run --model ... --format json --dir ... [--variant ...]`, which fails on v2 on two unknown flags. [documented, iteration-013.md:91-97]

**Child dispatch on v2 must use `run --standalone`.** A standalone run called `setup()` in a private server that saw `AI_SESSION_CHILD=1`. Without `--standalone`, `setup()` ran in the shared service with the variable undefined. [confirmed, steering-log.md:212] The v2 daemon freezes the environment of whichever client spawned it. [documented, iteration-014.md:20-27] The cost: concurrent v2 children share no plugin state unless it is persisted outside the process. [inferred, iteration-020.md:30-32. A two-child run that counts guard state would confirm it.]

**File change list.** `SKILL.md` (14 line sites), `references/cli-reference.md`, `references/providers-and-models.md`, `hard-rules.json`, `assets/prompt-templates.md` (6 invocations) and 20 playbook files. [documented, iteration-013.md:105-128]

Answered: key question 4 closed at iteration 13.

## 7. Q5: Install, Verification, Pinning and Irreducible Gaps

**Install.** [documented, iteration-015.md unless marked]

- v1 is `opencode-ai` (bin `opencode`). v2 is `@opencode/cli`, which ships the bins `opencode` and `opencode2` from one binary. [documented, iteration-015.md:40-51]
- `opencode upgrade --major` on v1 means "upgrade to OpenCode 2 and remove OpenCode 1". [confirmed, steering-log.md:213] A plain `upgrade` cannot drift v1 into 2.x. [documented, iteration-015.md:21-38]
- Homebrew carries only v2, with no versioned formula. [documented, iteration-015.md:52-62]
- The working side-by-side layout is three artifacts:
  - v1 in the `~/.local` npm prefix;
  - v2 in its own prefix, `~/.local/opencode-v2`, kept off `PATH`;
  - a launcher at `~/.local/bin/opencode2` that defaults `OPENCODE_DB=opencode-v2.db`.

  [documented, iteration-015.md:96-117]
- v1 dies with "Database is not empty and has no session table" on a v2 database. [documented, iteration-014.md:29]
- Both versions share `~/.config/opencode`, so a key written for one is live on the other. [documented, iteration-015.md:117]
- The skill has no install guidance today. [documented, iteration-015.md:119-123]
- A proposed `scripts/opencode-setup.sh <both|v1|v2|check>` helper with idempotent steps and documented rollback lines is specified at iteration-015.md:143-197. [documented as a design; inferred as safe. A dry run on a disposable machine would confirm it.]

**Verification.**

- v1 has a model-free discovery oracle, `opencode debug config </dev/null`, which prints `plugin` and `plugin_origins`. Per-plugin load outcome comes from the INFO `msg="loading plugin"` and WARN `failed to load plugin` log lines. [documented, iteration-017.md:20-30]
- v2's oracle is `GET /api/plugin`: raw query, output redirected to a file, retried once. [confirmed for the file-redirect rule, steering-log.md:161]
- The repo guard denies a nested `opencode run` inside Pi, so the load leg belongs in CI. [documented, iteration-017.md:26]
- Integration point: a new `/doctor:opencode` route (`.skilled/commands/doctor/_routes.yaml`), a battery `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, and a CI workflow with one npm prefix per version. [documented as a design, iteration-017.md:64-84]

**Pinning and support.** [documented, iteration-019.md unless marked]

- v1 and v2 live in different npm scopes (`opencode-ai`, `@opencode-ai/plugin` versus `@opencode/cli`, `@opencode/plugin`). No single specifier names both. [documented, iteration-019.md:48-57]
- Cadence: v1 1.18.x released about 0.43 versions a day, 1.19.x about 0.80, and v2 2.0.x about 0.94. [documented, iteration-019.md:34-46]
- v2 publishes no stability or semver guarantee, and v1 publishes no end-of-life date. [documented, iteration-019.md:70-90]
- Proposed floors are 1.19.0 for v1 and 2.0.32 for v2. [inferred. The 1.18.x half rests on an unprobed claim, steering-log.md:237.]
- Pins: exact `@opencode-ai/plugin` 1.19.3, declared zod, and `@opencode/plugin` 2.0.32 as a type-only dev dependency. [inferred, iteration-019.md:102-116. A clean install on both hosts would confirm it.]
- Detect the host from the binary, never from the environment. [documented, iteration-019.md:118-131]
- Support window: certify each v2 minor at `.0`, plus one pinned patch a month. Drop v1 after 30 days with no `opencode-ai@latest` publish. [inferred policy, iteration-019.md:133-149]

Answered: key question 5 closed at iteration 15.

## 8. The Gap Ledger

Condensed from the 47-row ledger at iteration-020.md:42-143. Counts: 9 (a) portable as-is, 21 (b) mechanical, 4 (c) behavioural workaround, 9 (d) irreducible, 4 not established. [documented, iteration-020.md:143]

| Class | Rows |
|---|---|
| (a) as-is | dual `{id, setup, server}` export; flat plugin discovery; `.opencode/hooks` as data; `plugin` key; `mcp.servers`; skill discovery; the `--dangerously-skip-permissions` alias; the v1 load oracle; the `$` helper (unused) |
| (b) mechanical | the `tool()` import; zod declaration; `session.idle`, `session.compacted`, `session.created` and `execution.*` via `subscribe`; `permission.*` and `question.*` to `form.*`; the `permission` map; `browser: deny`; `Task` naming; agent extras; non-command `.md`; client env via `--standalone`; per-version `OPENCODE_DB`; version guards; dispatch rules; `--command`; seven `run` flags; `#variant`; the `--param` and pipe traps; `shell.env` and `chat.*` |
| (c) workaround | module singletons in a shared daemon; reading message parts; v1's derived `tools` gate; vendored `node_modules` skills |
| (d) irreducible | the global `command.execute.before` observer; server-side toast; per-agent `temperature`; one `opencode.json` carrying `permissions`; `upgrade --major`; no v1 Homebrew formula; `experimental.compaction.autocontinue`; `provider.small_model`; `text.complete` |
| not established | `allowed-tools` and `disable-model-invocation` semantics; VS Code extension; LSP; `CLAUDE.md` |

None of the nine (d) rows can be fixed by editing repo code. Each is an install-channel property or a v2 platform gap, so only documentation, detection and workarounds reach them. [documented, iteration-020.md:145-147] The repo uses none of the three `experimental.*` items today. [documented, iteration-003.md:61-63]

## 9. Proposed Implementation Phases

These phases are inferred from the ledger; no phase was built or tested in this run.

1. **Pins and imports.**
   - Exact `@opencode-ai/plugin` 1.19.3 in `.opencode/package.json` and `.skilled/package.json`.
   - Declare zod.
   - Replace the three `@opencode-ai/plugin/tool` imports with a local identity helper.
2. **Dual export for the 11 mechanical plugins.**
   - Wrap each default export as `{ id, setup, server }`.
   - Write the v2 `setup` legs with `ctx.tool.hook`, `ctx.event.subscribe` and `ctx.session.hook("context")`.
   - Move `__test` surfaces into the core modules.
3. **The five hard plugins**, per the table in section 3.
   - Build the sentinel's per-session text cache.
   - Port the spec gate to the prompt and context hooks.
   - Rebuild the goal plugin's prompt queue and deadline logic.
   - Make `sk-vision` own its command in the `vision-runtime` source, then rebuild the bundle.
4. **Agents, commands and config.**
   - Add `browser: deny`.
   - Make the `Task` wording runtime-neutral.
   - Rename or move the non-command `.md` files under `.skilled/commands` (at least 11, listed at iteration-007.md:37-43).
   - Keep `opencode.json` in the v1 shape.
5. **Guards.**
   - Widen the matcher to `opencode\d*`.
   - Add `appliesTo` to each rule.
   - Add the memoised version resolver.
   - Give `command-flag-for-slash-prompt` a v2 route.
6. **cli-opencode and the runtime.**
   - Add the detection spec.
   - Write two invocation renderings.
   - Make `--standalone` mandatory for v2 children.
   - Add a semver resolver and a v2 branch in `fanout-run.cjs` (`:2258`, `:2324`, `:2923`, `:2962`).
7. **Install docs and helper.** Write a new install reference, the `opencode-setup.sh` helper and an irreducible-gaps section.
8. **Verification.** Add `/doctor:opencode` and the two-prefix CI workflow.

## 10. Verification by the Orchestrator

**Spot checks and rulings** (all in `research/steering-log.md`):

- Spot check 1: confirmed the dual plain-object export on both hosts (line 107). Refuted f-iter004-005 (line 108) and f-iter004-007 (line 109).
- Batch 2 check: refuted f-iter007-006, and recorded the `--param` trap (line 134).
- Spot check 2: confirmed f-iter008-001 (line 158), f-iter008-005 (line 159) and f-iter010-003 (line 160). Recorded the pipe-truncation trap (line 161).
- Batch 4 check:
  - confirmed f-iter012-001, -004 and -005, and the `tui.toast.show` literal, by grepping the binary (line 184);
  - answered f-iter013-006: the bypass flags are hidden aliases of `--auto` (line 185);
  - rejected f-iter011-003 (line 186).
- Spot check 3:
  - refuted the implication of f-iter014-004 (line 211);
  - confirmed `run --standalone` env propagation, and with it f-iter014-002 (line 212);
  - confirmed f-iter015-001 (line 213);
  - left `-m provider/model#variant` on v1 inconclusive (line 214).
- Batch 6 rulings: rejected f-iter018-008 (line 236). Recorded f-iter019-006 as inferred only (line 237).

**Reversals between iterations, settled at synthesis.**

| Earlier claim | Overturned by | Status |
|---|---|---|
| v2 has no `session.idle` or `session.compacted` peer (f-iter004-002, f-iter006-004) | f-iter012-001 | Settled by the orchestrator's binary grep [confirmed, steering-log.md:184] |
| The OpenAPI document shows v2 has no native event names (f-iter006-005) | f-iter012-003 | The envelope is untyped by design; the binary is the authority [documented] |
| `permission.asked` fields are renamed on v2 (f-iter004-003) | f-iter012-010 | The v1 field names are kept [documented, binary schema] |
| v2 documents only per-plugin directories (f-iter004-006) | f-iter014-005 and spot check 1 | Flat files load [confirmed, steering-log.md:107] |
| v2 has no singular `plugin` key (f-iter012-007) | f-iter014-006 | `setup` fired through `plugin` [documented, a12-probe] |
| Iteration 1's list of v1 hooks with no v2 home (f-iter001-006) | f-iter003-002 | The migrate page maps four of the five [documented] |
| `latest-1` marks the v1 line (f-iter015-002 framing) | f-iter019-001 | `latest-1` is 1.1.4 [documented] |
| Iterations 1 to 3 measured the wrong v1 host (f-iter019-004) | corrected at synthesis | Overstated. The host probes ran on 1.19.3 (iteration-002.md:116-130, steering-log.md:107); only the type reads used the 1.18.34 package. [documented] |
| `system-skill-advisor` has no proven v2 compaction signal (iteration-018.md:173) | f-iter012-001 and f-iter012-005 | `session.compacted` and `session.compaction.*` exist [confirmed, steering-log.md:184] |

**Not verified by the orchestrator** (iteration evidence only):

- the hook census;
- the command and skill censuses;
- the guard source reading;
- the 2.0.32 type-shape findings (iterations 6 and 18);
- the install matrix, beyond `--major`;
- the doctor design;
- the cadence numbers.

No new probe ran at synthesis.

## 11. Recommendations

Start with phases 1 and 2, because they make every plugin at least load on v2 with no change in v1 behaviour. Next do phase 5, because the guard hole is fail-open on `opencode2` today. Land phase 6 together with phase 7, so the skill never documents a v2 dispatch shape without the install and `--standalone` facts beside it.

Do phase 3's sentinel and spec-gate work before anyone relies on them under v2, because both fail silently today. Ship the public compatibility claim only in the scoped form from section 1, and only after the phase 8 doctor passes on both pinned versions.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat the v2 API as a renamed v1 hooks object with feature-detected hook keys | v2 is `{id, setup}` with per-domain registries on a pull-style event transport; hook-key detection cannot bridge the two | iteration-001.md:18-24, iteration-004.md:18-26 | 1, 4 |
| A mandatory two-file split per plugin | One plain object `{id, setup, server}` loads on both hosts | steering-log.md:107, iteration-002.md:143-152 | 2, 3 |
| Type-checking v2 work against the `dist/v2` preview in `@opencode-ai/plugin` 1.18.34, or one 1.18.34 pin serving both (f-iter011-003) | The preview is wrong in both directions against 2.0.32; f-iter011-003 was rejected on that basis | iteration-002.md:56-93, steering-log.md:186 | 2, 3, 11 |
| `opencode debug startup` as the v1 plugin-load probe | It wrote no markers; `debug config` resolves plugins | iteration-002.md:116-119 | 2 |
| A callable default export carrying `.id` and `.setup`, including `Object.assign(v1Factory, {id, setup})` (f-iter018-008) | v2 rejects a function with those properties | steering-log.md:79, steering-log.md:236 | 3, 18 |
| A load-time env selector (`ORCA_OPENCODE_PLUGIN_API`) is required for one module to serve both (f-iter004-005) | v1 called `server()` on the plain object | steering-log.md:108 | 4 |
| No repo plugin needs a toast, so TUI capability does not gate the port (f-iter004-007) | `sk-vision.js` calls `showToast` at 2 sites; the grep missed the symlink | steering-log.md:109 | 4 |
| Reaching a toast from a server plugin through `ctx.tui` | `Context` has no `tui` member, and `EventDomain` is subscribe-only | iteration-006.md:90, iteration-018.md:69-83 | 6, 18 |
| Reading the v2 event vocabulary from `v2-openapi.json` | `/api/event` carries an untyped envelope; the binary defines the names | iteration-006.md:71-77, iteration-012.md:46-48 | 6, 12 |
| Registering `execute.after` on `ctx.session.hook` | It lives on `ctx.tool.hook` | iteration-006.md:55 | 6 |
| Deriving idle from `session.execution.*` because v2 lacks `session.idle` (f-iter004-002, f-iter006-004) | `session.idle` and `session.compacted` are real v2 events | steering-log.md:184, iteration-012.md:17-33 | 4, 6, 12 |
| Pinning one v2 event vocabulary taken from a reference plugin's normalizers | That plugin carries two schemes; only the binary is authoritative, and `session.next.*` does not exist in 2.0.32 | iteration-004.md:59-66, iteration-012.md:197 | 4, 12 |
| A frontmatter flag to exclude non-command Markdown from command registration | v1 ignored `command: false` and `disable: true`; v2 has no such field | iteration-007.md:61-66 | 7 |
| Treating v2 `GET /api/command` as returning no project commands (f-iter007-006) | The raw percent-encoded query returns 54; the `--param` form drops the location | steering-log.md:134 | 7 |
| A v2-shaped `permissions:` rule list as the shared agent or config form | v1 rejects it in config, and it leaks into agent `options` | steering-log.md:158-159, iteration-008.md:32-45 | 5, 8 |
| Declaring `plugins:` (plural) in a shared config | v1 drops it with no warning | iteration-008.md:47-57 | 8 |
| Flattening nested skill packets, or removing one symlinked skill root | Both hosts list every nested `SKILL.md` and dedupe by real path | iteration-009.md:19-27 | 9 |
| Inferring the OpenCode version from the binary name | After the official installer `opencode` is v2; locally `opencode` is v1 | iteration-010.md:58-62 | 10 |
| Version-gating `.opencode/hooks` as a host hook directory | Neither host loads it | iteration-010.md:77-85 | 10 |
| Plain JSON Schema as v1 tool `args` | v1 requires a zod raw shape | iteration-011.md:24-28 | 11 |
| Adding a 2.x `@opencode-ai/plugin` pin to `.opencode/package.json` | v1 auto-installs that file, and 2.x is ESM-only with exact-pinned siblings | iteration-011.md:66-72 | 11 |
| Keeping the `tool` import behind a dynamic-import fallback | The import is inert on v1, so removing it is simpler | iteration-011.md:70 | 11 |
| Injecting guidance through `synthetic` or `ignored` text parts | The prompt builder filters them out | iteration-012.md:153-162 | 12 |
| Concluding that v2 has no singular `plugin` key (f-iter012-007) | A file referenced only through `plugin` had its `setup` fired | iteration-014.md:35, steering-log.md:204 | 12, 14 |
| A bare `/family:name args` run message as the v2 `--command` replacement | Expansion is unproven; `session.command` is the documented route | iteration-013.md:63-72 | 13 |
| Detecting the major from the runtime's sha256 binary identity | A digest carries no ordering | iteration-013.md:101 | 13 |
| Reading `api --standalone` as proof that standalone loads no plugins (implication of f-iter014-004) | The private server answers before activation; `run --standalone` does load plugins | steering-log.md:211-212 | 14 |
| Reading the v1 compiled binary for upgrade behaviour | Minified output; `--help` answered it | iteration-015.md:17 | 15 |
| Homebrew as a route to v1 | No v1 or versioned formula exists | iteration-015.md:52-62 | 15 |
| Pinning v1 upgrade recipes against drift into 2.x | v1 cannot drift without `--major` | iteration-015.md:21-38 | 15 |
| Porting a repo-owned OpenCode server client | None exists; only in-process `ctx.client` calls | iteration-016.md:41-64 | 16 |
| Treating `mcp-code-mode`'s `client.config.tool_repository` calls as OpenCode API | It is the UTCP client | iteration-016.md:56 | 16 |
| One client dependency specifier for both versions | `@opencode-ai/sdk` and `@opencode/client` are separate packages, and only type-only imports exist | iteration-016.md:79-85 | 16 |
| `opencode debug config` as a v1 plugin-load smoke test | It resolves discovery but instantiates nothing | iteration-017.md:24 | 17 |
| `latest-1` as the v1 maintenance signal | It resolves to 1.1.4 | iteration-019.md:24-32 | 19 |
| One shared plugin dependency serving both lines | Different npm scopes | iteration-019.md:48-57 | 19 |
| Retesting on every v2 release | About 0.94 releases a day | iteration-019.md:135-141 | 19 |
| A 1.18.29 floor for object plugin entries | Superseded by the 1.19.0 floor, itself inferred | iteration-019.md:99-100, steering-log.md:237 | 19 |
| Repairing the irreducible rows by editing repo code | Each is an install-channel fact or a v2 platform gap | iteration-020.md:147 | 20 |

## Divergence Map

- Saturated directions: none recorded. Convergence mode was off, and the stop policy was `max-iterations`.
- Pivots taken: none. Pivot failures and audited overrides: none. The registry `divergence` block is empty.
- Breadth came from steering instead: 17 orchestrator-chosen angles plus three adaptive slots, listed in `research/steering-log.md:25-57`. This documents breadth, not convergence.
- Remaining frontier: the four unestablished ledger rows; the live v2 event capture through `ctx.event.subscribe`; `plugin.check` tolerance for extra keys; `Tool.ValueSchema`; and the v2 `run` positional directory (section 12).

## 12. Open Questions

- Do `allowed-tools` and `disable-model-invocation` change behaviour on either host? 57 skill files carry `allowed-tools`. (iteration-009.md:130-134)
- The VS Code extension, LSP and `CLAUDE.md` loading have zero evidence in this run. (iteration-020.md:34-36)
- Does v1 1.19.3 accept `-m provider/model#variant`? Spot check 3 was inconclusive. (steering-log.md:214)
- How does v2 `run` treat a positional directory, and does it inherit the hidden `--dangerously-skip-permissions`? (iteration-013.md:149-150, steering-log.md:185)
- Does `ctx.event.subscribe` deliver `session.idle`, `session.compacted`, `session.status` and `message.updated` at runtime? The names are proven only as binary literals. (iteration-018.md:193)
- Does `POST /api/plugin/check` accept a definition with an extra top-level key such as `__test`? (iteration-012.md:211)
- What is `Tool.ValueSchema`, and does a `z.toJSONSchema` output satisfy it? (iteration-018.md:191)
- Does `session.hook("context")` fire for compaction and title requests, and does a push to `system` reach the provider? (iteration-018.md:192)
- What is the `tui` RPC id and method set, the only surviving toast channel? (iteration-018.md:194)
- Does v1 1.18.x strip v2 keys silently, as the 1.19.0 floor assumes? (steering-log.md:237)
- Does `@opencode/plugin` 2.0.32 re-export zod, and can the two plugin type packages coexist in one `node_modules`? (iteration-019.md:184-189)
- Do bun or pnpm support the two-prefix layout? Does `upgrade --major` prompt first? Does the v2 service outlive `uninstall`? (iteration-015.md:213-218)

Settled at synthesis from existing evidence, so not open:

- v1 ignores `plugins` (iteration-008.md:47-57).
- v1 reads `OPENCODE_DB`: it died on the v2 database (iteration-014.md:29).
- Both hosts follow the `sk-vision.js` symlink. v1 logged all 16 repo plugins as loading (iteration-017.md:14). v2 reported a load error for all 16 (steering-log.md:80). [inferred from both: a v2 plugin list naming `sk-vision` would confirm it]

## 13. References

- Iterations: `research/iterations/iteration-001.md` to `iteration-020.md`; per-iteration records in `research/deltas/iter-001.jsonl` to `iter-020.jsonl`.
- Orchestrator record of spot checks, rulings and foci: `research/steering-log.md`.
- Resource map: `research/resource-map.md`.
- Probe evidence: `scratch/a2-v1probe/`, `scratch/a2-v2pkg/package/dist/promise/`, `scratch/a7-probe/`, `scratch/a12-probe/`, `scratch/cli-help/` (including `v2-openapi.json`).
- Official docs read by iterations: `https://opencode.ai/v2/docs/build/plugins/`, `https://opencode.ai/v2/docs/build/plugins/migrate-v1/`, `https://opencode.ai/v2/docs/build/plugins/cli/`, `https://opencode.ai/v2/docs/cli/plugins/`, `https://opencode.ai/v2/docs/migrate-v1`.
- Repo surfaces in scope:
  - `.opencode/plugins/` (symlink to `.skilled/plugins`), `.skilled/agents/`, `.skilled/commands/`, `.skilled/skills/`;
  - `.skilled/skills/cli-external-orchestration/cli-opencode/`;
  - `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`;
  - `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`;
  - `.opencode/package.json`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 20
- Questions answered: 5 / 5 (Q1 at iteration 3, Q3 at 10, Q4 at 13, Q2 at 14, Q5 at 15)
- Remaining questions: 0 key questions; the carried open questions are in section 12
- Last 3 iteration summaries: run 18: A3b port specs for the five hard plugins (0.86); run 19: A16 cadence, pinning and support policy (0.78); run 20: A17 gap ledger (0.58)
- Convergence threshold: 0 (convergence mode off; stop policy `max-iterations`)
- newInfoRatio stayed between 0.55 and 0.90 across the run (mean about 0.80), so the run did not converge in the signal sense; the cap ended it.
- Divergence summary: no divergent pivots recorded
- Graph convergence at iteration 20: STOP_BLOCKED, score 0.288, with blockers `source_diversity_guard` (0.00 below 1.5), `evidence_depth_guard` (1.21 below 1.5) and `unverified_claims` (2). Recorded as synthesis evidence. The iteration cap is terminal and bypasses these guards.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:deep-research-opencode-v1-v2-dual-compat -->
