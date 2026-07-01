# Focus

[G6] Define the `/goal` command contract for `.opencode/commands/goal.md`: thin-router shape, `$ARGUMENTS` parsing, supported verbs, plugin handoff, result envelope, and risks.

# Actions Taken

- Read the deep-research quick reference and current research state/strategy to stay inside the iteration contract.
- Compared existing OpenCode command patterns in `.opencode/commands/memory/learn.md`, `.opencode/commands/memory/search.md`, `.opencode/commands/memory/manage.md`, `.opencode/commands/memory/save.md`, `.opencode/commands/deep/research.md`, and root `.opencode/commands/prompt.md`.
- Checked OpenCode plugin and tool type definitions to verify whether a command can hand off session-scoped goal mutation to a plugin tool without requiring the markdown command to know the session id.
- Checked existing plugin implementations and prior hook-parity research for `tool` registration and `experimental.chat.system.transform` evidence.

# Findings

## Finding 1: `/goal` should be a root command file with subcommands in `$ARGUMENTS`

Evidence:
- `.opencode/commands/prompt.md:1`-`.opencode/commands/prompt.md:4` shows root command files can define frontmatter directly under `.opencode/commands/`, so `.opencode/commands/goal.md` is the right root-command target.
- `.opencode/commands/memory/learn.md:7`-`.opencode/commands/memory/learn.md:10` establishes the "thin router" style for a command that owns routing but not heavy implementation.
- `.opencode/commands/memory/learn.md:24`-`.opencode/commands/memory/learn.md:31` treats empty args and first-token subcommands as router inputs; `.opencode/commands/memory/learn.md:39` explicitly starts by parsing `$ARGUMENTS`.

OUR target/mechanism:
- Add `.opencode/commands/goal.md` as a root `/goal` command.
- Recommended frontmatter:

```yaml
description: Set and manage the active OpenCode session goal.
argument-hint: "[objective] | set <objective> | show | clear | complete | pause [reason]"
allowed-tools: Read, mk_goal, mk_goal_status
```

Decision:
- Use root `/goal`, not `/goal:*`, for Claude parity and low-friction session use.
- Route verbs inside `$ARGUMENTS`: empty/show, set, clear, complete, pause.
- Treat any non-empty argument whose first token is not a known verb as `set <objective>`, matching Claude-style `/goal finish this refactor` ergonomics.

Risk:
- Root command namespace could collide with a future upstream OpenCode `/goal`. Mitigation: keep the behavior behind one file, and make the command's result envelope explicit enough to swap to `/goal:*` later if the runtime introduces a native command.

## Finding 2: `goal.md` needs deterministic argument resolution before policy text

Evidence:
- `.opencode/commands/memory/search.md:15`-`.opencode/commands/memory/search.md:17` uses a shell prelude to bind `$ARGUMENTS` into `ARGS_PRESENT` and `QUERY`, avoiding accidental shell expansion or prompt-time re-derivation.
- `.opencode/commands/memory/search.md:19`-`.opencode/commands/memory/search.md:22` makes those bound values authoritative for control flow.
- `.opencode/commands/memory/manage.md:22` sets a safe default mode when `$ARGUMENTS` is empty.

OUR target/mechanism:
- In `.opencode/commands/goal.md`, add a short argument-resolution prelude equivalent to `/memory:search`:

```md
!`bash -c 'if [ "$#" -gt 0 ]; then q="$*"; q="${q//\"/\\\"}"; printf "ARGS_PRESENT=true\nQUERY=\"%s\"\n" "$q"; else printf "ARGS_PRESENT=false\nQUERY=\"\"\n"; fi' -- '$ARGUMENTS'`
```

Decision:
- Bind command control flow to `ARGS_PRESENT` and `QUERY`.
- Empty `QUERY` routes to `show`, not setup text.
- Known first token routes:
  - `show` -> show active session goal.
  - `set <objective>` -> set/replace active goal.
  - `<objective>` -> set/replace active goal.
  - `pause [reason]` -> pause active goal.
  - `complete` -> mark active goal complete.
  - `clear` -> remove/deactivate the active goal without asserting success.
- Unknown verb plus extra text should be treated as an objective unless it exactly matches a malformed known verb shape; this favors the common "set a goal quickly" workflow.

Risk:
- Multi-line objectives and shell-sensitive text can still be awkward in markdown-command argument passing. Mitigation: command should treat the resolved `QUERY` as opaque objective text after first-token routing and let `mk_goal` sanitize/fence before persistence and injection.

## Finding 3: the command should delegate all state changes to a plugin tool, not edit storage itself

Evidence:
- `.opencode/plugins/README.md:8` says OpenCode auto-loads `.js` files in `.opencode/plugins/` at session start; `.opencode/plugins/README.md:32`-`.opencode/plugins/README.md:36` gives the entrypoint pattern for a new plugin.
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:108`-`.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:115` shows OpenCode plugins expose a `tool` map.
- `.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts:2`-`.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts:15` shows plugin tool execution receives `context.sessionID`, `directory`, and `worktree`.
- `.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts:33`-`.opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts:37` shows tool definitions receive typed args plus `ToolContext`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge/decision-record.md:180`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity/005-fix-opencode-plugin-loader-bridge/decision-record.md:190` records `tool: { ... }` as an OpenCode-recognized plugin surface.

OUR target/mechanism:
- In `.opencode/plugins/mk-goal.js`, expose:
  - `mk_goal` with args `{ action: "set"|"show"|"clear"|"complete"|"pause", objective?: string, reason?: string }`.
  - `mk_goal_status` for plugin/runtime diagnostics and a compact active-goal status readout.
- In `.opencode/commands/goal.md`, use `mk_goal` for user actions and reserve `mk_goal_status` for diagnostics or fallback show output.

Decision:
- The markdown command is only a router. The plugin tool owns state I/O, session keying, objective sanitization, status transitions, and cache invalidation.
- The command does not need to infer a session id from text because `ToolContext.sessionID` is available at execution time.

Risk:
- Need an implementation smoke to confirm local plugin tool names can be listed directly in command `allowed-tools`. If OpenCode requires another naming form for plugin tools in command frontmatter, the fallback is to keep the same `mk_goal` implementation and route through a small plugin-owned CLI helper, but that is a build-time verification risk rather than a design blocker.

## Finding 4: result envelopes should be terse and parseable

Evidence:
- `.opencode/commands/memory/learn.md:32`-`.opencode/commands/memory/learn.md:35` defines parseable `STATUS=OK`, `STATUS=CANCELLED`, and `STATUS=FAIL` outputs.
- `.opencode/commands/memory/manage.md:38` returns `STATUS=FAIL ERROR="Unknown mode: <mode>"` for unknown modes.
- `.opencode/commands/memory/search.md:53`-`.opencode/commands/memory/search.md:66` enforces a fixed command-output shape, including a `STATUS` footer.

OUR target/mechanism:
- `.opencode/commands/goal.md` should require these terminal shapes:

```text
STATUS=OK ACTION=<set|show|clear|complete|pause> GOAL_STATUS=<active|paused|complete|none> SESSION=<current>
STATUS=FAIL ERROR="<message>"
```

Decision:
- Keep command output machine-readable and minimal. The active-goal "overlay" is not the command's job; it belongs to plugin injection plus `mk_goal_status`.
- `complete` marks the current goal complete.
- `clear` stops injection without claiming the goal was achieved. Storage retention for cleared goals is a G7 state-store decision.

Risk:
- `clear` has no direct Codex-like status enum equivalent. If the state store keeps history, it needs an `ended_reason:"cleared"` or archive record outside the primary status enum; otherwise `clear` risks destroying useful audit history.

## Finding 5: avoid a workflow YAML or presentation asset for v1

Evidence:
- `.opencode/commands/memory/learn.md:15` says no workflow YAML exists and keeps routing in the command file until a separate workflow-asset change exists.
- `.opencode/commands/memory/learn.md:47`-`.opencode/commands/memory/learn.md:52` has hard rules that prevent the command from inventing workflow YAML.
- `.opencode/commands/memory/save.md:31`-`.opencode/commands/memory/save.md:39` shows a thin command can resolve routing and call actual tooling without owning the data layer.

OUR target/mechanism:
- Add only `.opencode/commands/goal.md` for the command surface in the first build.
- Do not add `.opencode/commands/goal/assets/*` or workflow YAML unless later UX work makes the command display large enough to justify a presentation boundary.

Decision:
- Inline the compact `/goal` router contract in `goal.md`; keep all durable behavior in `.opencode/plugins/mk-goal.js` and its state helper.

Risk:
- If `/goal show` grows into a richer dashboard, inline wording can drift. The trigger for adding a presentation asset should be a multi-section dashboard or confirmation UI, not the initial five verbs.

# Questions Answered

- [G6] The `/goal` command contract should be a root `.opencode/commands/goal.md` thin router.
- [G6] Supported `$ARGUMENTS` routes are: empty/show, `set <objective>`, bare `<objective>`, `clear`, `complete`, and `pause [reason]`.
- [G6] The command should delegate to `mk_goal` / `mk_goal_status` plugin tools because plugin tool context includes `sessionID`, so state mutation can remain session-scoped without command-side session inference.
- [G6] The command should emit parseable `STATUS=... ACTION=...` envelopes and keep the persistent active-goal UX in the plugin injection/status tool.

# Questions Remaining

- [G7] Choose the exact state-store path, retention behavior for `clear`, and lock/write strategy.
- [G8] Decide whether `pause` is only user-triggered or also a kill-switch for active continuation loops.
- [G10] Define whether `/goal set` accepts budget flags in v1, such as `--token-budget` or `--time-budget`.
- [G11] Decide the exact `mk_goal_status` output shape and how much of it should appear in injected context.
- [G13] Finalize objective sanitization/fencing before `mk_goal` persists user-authored text and before `mk-goal.js` injects it every turn.

# Next Focus

[G7] State store decision: flat JSON vs SQLite vs Spec Kit memory, with session keying, locking, clear/archive semantics, and schema fields needed by the command contract.
