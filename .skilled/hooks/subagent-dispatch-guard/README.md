---
title: "Task Dispatch Hooks: Deep-Loop Guard + Fable Subagent Policy"
description: "PreToolUse guards for Task/subagent dispatches: deep-loop loop-repeat protection shared across runtimes, plus Claude's Fable-model subagent policy."
trigger_phrases:
  - "task dispatch guard"
  - "deep loop guard"
  - "fable subagent guard"
  - "opencode task dispatch guard"
  - "opencode deep loop guard"
  - "opencode task execute before"
---

# Task Dispatch Hooks: Deep-Loop Guard + Fable Subagent Policy

---

## 1. OVERVIEW

`subagent-dispatch-guard/` gates Task dispatches before they execute. The main concern is deep-loop protection. `lib/subagent-dispatch-guard.cjs` recognizes dispatches that target deep-loop sub-agents. It separates a bounded external handoff from repeated handoffs that recreate a command-owned iteration loop outside its parent command. A second guard, Claude only, enforces the Fable-model subagent policy.

The core returns a transport-free `allow`/`warn`/`reject` decision. Adapters translate it into their runtime's envelope. Warning state persists under `.skilled/skills/.state/loop-guard/`, so OpenCode and Claude share one bounded audit trail. The core performs the loop-state persistence and state-directory maintenance. It never writes stdout or stderr. It never writes the warning log itself. The adapter appends warnings and audits, so both runtimes share one bounded log path.

Claude, Cursor, Devin, DSH, OpenCode, Pi and Vibe each run the guard. Codex has no adapter.

---

## 2. HOW IT WORKS

`evaluateDispatch` returns `{ decision, detail, warnings, audits }`. Check 1 runs first and short-circuits to `reject` under the mode-reject env before Check 2 can run. A reject returns before its detail is added to `warnings`. So only a non-rejecting mismatch is recorded as a warning. Check 2 runs only when Check 1 does not reject.

**Check 1. Deep Route mode mismatch.** `resolveTargetIdentity` parses `target_agent=@<name>` or `Agent: @<name>` from the prompt body first. It falls back to `subagent_type` only when that value is not the generic `general` placeholder that `orchestrate` sets for every call. The core loads the agent's registered workflow modes from `mode-registry.json`. A `mode=` the agent is not registered for warns, or rejects under `SYSTEM_DEEP_LOOP_GUARD_REJECT=1`.

```text
system-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type="<agent>" (registry modes="<a|b>") but the prompt declares mode="<mode>"
```

**Check 2. Loop-like repeated hand-off.** `deep-research` and `deep-review` are the command-owned loop executors. The core records each non-command-driven dispatch to them in per-session state. A dispatch is command-driven only when the prompt carries an `Iteration: N of M` marker and a `Config: <path>` line.

That path must resolve to a real on-disk deep-loop config with `mode` + `maxIterations`. Marker text alone is not enough, so injected content cannot gain command authority. The second non-command-driven hand-off warns. The third, under `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`, rejects.

```text
system-deep-loop-guard: loop-like repeated dispatch -- "<agent>" received <N> non-command-driven hand-offs in this session without a command-driven iteration marker; command-owned loop executors should be dispatched by their parent /deep:* command, not repeatedly handed off by another agent.
```

Warnings are injected into the model's context as `additionalContext`, newline-joined when several apply. A reject becomes the denial reason. A warn appends a `[system-deep-loop-guard] WARN:` line to the shared bounded log `guard-warnings.log` in the state directory. That log caps at 256 KB by default and rotates to `.1`.

Because a reject returns before its detail is added to `warnings`, the Claude, Devin and OpenCode adapters write no WARN line for a reject. Only the Pi adapter logs the reject detail. Generic subagents (`context`/`review`/`write`/`debug`) and `ai-council` are intentionally excluded from loop-repeat counting.

**Fable guard.** `claude/fable-subagent-guard.mjs` fires when the main session runs on a Fable model. It reads the last `"model":"claude-…"` field from the session transcript tail (2 MB). It skips sidechain entries, so a permitted subagent's own model never masks the parent. It denies the dispatch shapes below, each with its own reason.

| Shape | Denial reason |
|---|---|
| `subagent_type: "fork"` | `Main session runs on <model>; fork subagents always inherit the parent model, so a fork would run on Fable. Dispatch a non-fork agent with model: "opus" or model: "sonnet" instead.` |
| call omits `model` | `Main session runs on <model>; a subagent without a model override inherits Fable. Pass model: "opus" or model: "sonnet" on the Agent call.` |
| `model` not `opus`/`sonnet` | `Main session runs on <model>; subagent model "<requested>" is not permitted. Only "opus" or "sonnet" subagents may be dispatched while Fable drives the main loop.` |

It fails open when the transcript is missing or unreadable.

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins only. Adapters import `../lib/` and, in CommonJS, `../../shared/hook-adapter-shared.cjs` plus `../../shared/hook-flags.cjs`. The Cursor adapter imports `hook-flags.mjs` and shells out to the Claude adapter by repo-relative path. |
| State | Loop-repeat counters and warning logs live in `.skilled/skills/.state/loop-guard/`. The core writes the loop-repeat counters, and the adapters append the warning log, so all runtimes share one bounded log. State files are session-keyed and written atomically (temp + rename). |
| Decisions | `allow`, `warn` or `reject`. Reject is reserved for a confirmed mode mismatch under the reject env, a confirmed loop-recreation at count 3 or more under the reject-loop env, and the Fable policy's forbidden shapes. |
| Failure | The core fails open on malformed input, a missing registry or state, or any internal error. A persistence failure under a reject env emits an audit line through `appendRejectModeDegradedAudit` and still allows the dispatch. |

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreToolUse` on `Task` | `claude/task-dispatch-guard.cjs` | `.skilled/hooks/subagent-dispatch-guard/claude/task-dispatch-guard.cjs` | A deny with the reason, or the warnings as context. |
| Claude | `PreToolUse` on `Task\|Agent` | `claude/fable-subagent-guard.mjs` | `.skilled/hooks/subagent-dispatch-guard/claude/fable-subagent-guard.mjs` | A deny with the reason for the shape it matched. |
| Cursor | `preToolUse` on `Task` | `cursor/task-dispatch-guard.mjs` | `.skilled/hooks/subagent-dispatch-guard/cursor/task-dispatch-guard.mjs` | A deny with both messages, or an allow with one message. |
| Devin | `PreToolUse` on `run_subagent` | `devin/task-dispatch-guard.cjs` | `.skilled/hooks/subagent-dispatch-guard/devin/task-dispatch-guard.cjs` | A deny with the reason, or the warnings as context. |
| DSH | `tools/pre-execute` | `dsh/task-dispatch-guard.mjs` | `.skilled/hooks/subagent-dispatch-guard/dsh/task-dispatch-guard.mjs` | Nothing. The hand-off always proceeds. |
| OpenCode | `session.created, tool.execute.before` | `opencode/system-deep-loop-guard.js` | `.opencode/plugins/system-deep-loop-guard.js` | A thrown error on a reject. Warnings stay in the log. |
| Pi | `tool_call` on `subagent` | `pi/task-dispatch-guard.ts` | `.skilled/hooks/subagent-dispatch-guard/pi/task-dispatch-guard.ts` | A `reason` on the call, never a block. |
| Vibe | `pre_tool` on `agents_spawn` | None | `.vibe/plugins/repo-guards/deep-loop-guard.mjs` | A deny object with the reason, or nothing. |
| Codex | None | None | None | `n/a`: codex-cli 0.160 fires `PreToolUse` on `spawn_agent` as `collaborationspawn_agent`, but a captured payload carries the spawn `message` encrypted beside `task_name` and `fork_turns`, so the guard's prompt and target checks have nothing to read. No adapter is wired. |

Claude registers both guards in `.claude/settings.json`. The first reads `tool_name: 'Task'` and takes `subagent_type` or `subagentType` plus `prompt`. It resolves the project directory from `payload.cwd` or `CLAUDE_PROJECT_DIR`. A reject becomes `permissionDecision: 'deny'` with the reason. A warn becomes `additionalContext`, with warnings joined with `\n`. Malformed stdin, a missing payload or any internal error approves silently.

The Fable guard reads the active model from `payload.transcript_path`. It denies with `permissionDecision: 'deny'`. It returns without output when the transcript is missing or unreadable.

Devin registers the guard in `.devin/hooks.v1.json` under the matcher `^run_subagent$`. It reads `tool_name: 'run_subagent'` and accepts `subagent_type`, `subagentType`, `agent_type` or `agentType`. A whitespace-only `cwd` falls back to `DEVIN_PROJECT_DIR`. It returns the same deny and advisory envelope as Claude.

Cursor registers the guard in `.cursor/hooks.json` under `preToolUse` with the matcher `Task`. It forwards `tool_input` unchanged, with `cwd` taken from `workspace_roots[0]`, and runs the Claude adapter with a 5-second timeout. It translates `hookSpecificOutput` into `{permission: 'deny', user_message, agent_message}` with exit 2, or `{permission: 'allow', agent_message}`. A spawn error or non-JSON output approves.

OpenCode loads the plugin from `.opencode/plugins/`. It reads `input.tool: 'task'` and takes `args.subagent_type` or `args.subagentType` plus `args.prompt`. A reject throws `Error(result.detail)`, which OpenCode treats as a denial from a `before` hook. A warn only reaches the state log, never stdout or stderr. Any other error inside the plugin is swallowed. OpenCode alone runs the state-directory sweep, on `session.created`, through `sweepStaleLoopGuardStates`.

Pi registers the guard through `.pi/extensions/task-dispatch-guard.ts`, a one-line re-export. It loads the core from `../lib/`. The longer fallback specifier beside it resolves only through the test alias. It reads `event.toolName: 'subagent'` and returns a `reason` for a reject or a warning. It never blocks. A throw returns nothing. `~ partial`: workflow-nested (`runs.run`) dispatches are not yet covered.

DSH registers the guard in `.dsh/plugins/repo-guards/index.mjs`, which imports `.dsh/plugins/repo-guards/adapters/task-dispatch-guard.mjs`. That file is a link to `dsh/task-dispatch-guard.mjs`. It listens on `tools/pre-execute` for `subagent` and `subagent_fork`. It skips a call that carries an `action` or `resume` string and a call with no prompt. It records warnings and audits, then always calls `next()`. A throw is logged through `ctx.logger.warn` and the hand-off still proceeds.

Vibe registers the hook in `.vibe/hooks.toml` as `deep-loop-guard`, a `pre_tool` hook with `strict = true` matching `agents_spawn`. It reads `config_name` plus the spawn `message`. It supplies `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` and `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` when the operator set neither, because a `pre_tool` hook can only deny. Warnings go to stderr. A throw allows and reports on stderr.

OpenCode's real plugin cannot live in this tree, because its loader globs `.opencode/plugins/` by a flat pattern. So `opencode/system-deep-loop-guard.js` is a browsability-only symlink back into that folder. Nothing loads through it.

---

## 4. DIRECTORY TREE

```text
subagent-dispatch-guard/
+-- README.md
+-- claude/
|   +-- README.md
|   +-- task-dispatch-guard.cjs
|   `-- fable-subagent-guard.mjs
+-- cursor/
|   +-- README.md
|   `-- task-dispatch-guard.mjs
+-- devin/
|   +-- README.md
|   `-- task-dispatch-guard.cjs
+-- dsh/
|   +-- README.md
|   `-- task-dispatch-guard.mjs
+-- lib/
|   +-- README.md
|   `-- subagent-dispatch-guard.cjs
+-- opencode/
|   `-- system-deep-loop-guard.js -> ../../../../.opencode/plugins/system-deep-loop-guard.js
+-- pi/
|   +-- README.md
|   `-- task-dispatch-guard.ts
`-- tests/
    +-- README.md
    `-- dsh-task-dispatch-guard.test.mjs
```

The `opencode/` folder holds one link. Every other entry is a real file.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/subagent-dispatch-guard.cjs` | Owns registry indexing (`loadRegistryAgents`), target identity resolution (`resolveTargetIdentity`), Deep Route mode-mismatch detection, command-driven iteration recognition (`isCommandDrivenIteration`), session-scoped loop-repeat state (`recordLoopDispatch`), the bounded warning log contract (`appendWarningLog`), age-based state sweep, archive and prune (`sweepStaleLoopGuardStates`) and the runtime-neutral `evaluateDispatch` entrypoint. It never writes stdout or stderr. |
| `claude/task-dispatch-guard.cjs` | Claude `PreToolUse(Task)` adapter. Returns warnings as `additionalContext` and rejections through Claude's `permissionDecision: 'deny'` form. |
| `claude/fable-subagent-guard.mjs` | Claude-only `PreToolUse(Task\|Agent)` Fable-model policy. Reads the active model from the session transcript and denies `fork`, a missing `model` and a `model` outside opus or sonnet. |
| `devin/task-dispatch-guard.cjs` | Devin `PreToolUse(run_subagent)` adapter over the same core. Accepts the four `subagent_type` and `agent_type` field aliases. |
| `cursor/task-dispatch-guard.mjs` | Cursor `preToolUse` adapter on the `Task` matcher. `spawnSync`s the Claude adapter and translates its envelope into Cursor's permission shape. |
| `dsh/task-dispatch-guard.mjs` | DSH `tools/pre-execute` adapter. Records warnings and audits, then lets the hand-off proceed. |
| `pi/task-dispatch-guard.ts` | Pi `tool_call` adapter on the `subagent` tool. Turns every core rejection into an advisory reason. |
| `opencode/system-deep-loop-guard.js` | Browsability link to the OpenCode plugin. Nothing loads through it. |
| `.opencode/plugins/system-deep-loop-guard.js` | OpenCode plugin. `tool.execute.before` runs the policy and `event` on `session.created` runs the state-directory sweep. |
| `.vibe/plugins/repo-guards/deep-loop-guard.mjs` | Vibe `pre_tool` hook on `agents_spawn`. Denies a spawn the core rejects and reports warnings on stderr. |
| `tests/dsh-task-dispatch-guard.test.mjs` | Node test file for the DSH adapter. It checks core parity and the fail-open policy. |

---

## 6. CONFIGURATION

The concern key is `task-dispatch`, which differs from the folder name. The guard is on by default. A disable switch is on when its value is `1`, `true`, `yes` or `on`, in any case. The two reject switches act only on exactly `1`.

| Variable | Effect |
|---|---|
| `SYSTEM_TASK_DISPATCH_DISABLED=1` | Full no-op on every runtime. The shared resolver (`isHookEnabled('task-dispatch')`) short-circuits every adapter, including the Fable guard. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` | Escalates a Deep Route mode mismatch from `warn` to `reject`. Off by default, so the mismatch is advisory unless this is set. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` | Escalates a confirmed loop-recreation at count 3 or more from `warn` to `reject`. Off by default. |
| `SYSTEM_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES` | Warning-log size cap before rotation (default 256 KB). |
| `SYSTEM_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` | Days an untouched per-session state file stays active before archiving (default 2). |
| `SYSTEM_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` | Days an archived state file survives before pruning (default 90). |
| `SYSTEM_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` | Throttle for the state-directory sweep (default 1 hour). |

The resolver also accepts `MK_TASK_DISPATCH_DISABLED` as an alias for this switch.

Set a flag inline for one command, export it for a session, or persist it in `.skilled/hooks/hook-flags.env`. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs .opencode/plugins/tests/system-deep-loop-guard.test.cjs .skilled/hooks/subagent-dispatch-guard/tests/dsh-task-dispatch-guard.test.mjs
```

Expected result: all tests pass, including the forged-iteration-marker regression cases.

```bash
node -e "import('./.opencode/plugins/system-deep-loop-guard.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error. That confirms the OpenCode adapter still resolves this core.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../../skills/.state/loop-guard/README.md`](../../skills/.state/loop-guard/README.md): the shared state directory contract.
- [`../injection-contract.md`](../injection-contract.md): decision visibility per runtime.
- [`../shared/README.md`](../shared/README.md): the shared stdin parser and kill-switch resolver the adapters use.
- [`../../skills/system-deep-loop/SKILL.md`](../../skills/system-deep-loop/SKILL.md): the deep-loop workflow whose `mode-registry.json` and command-owned executors this guard protects.
