---
title: "Task Dispatch Hooks: Deep-Loop Guard + Fable Subagent Policy"
description: "PreToolUse guards for Task/subagent dispatches: deep-loop loop-repeat protection shared across runtimes, plus Claude's Fable-model subagent policy."
trigger_phrases:
  - "task dispatch guard"
  - "deep loop guard"
  - "fable subagent guard"
---

# Task Dispatch Hooks: Deep-Loop Guard + Fable Subagent Policy

---

## 1. OVERVIEW

`task-dispatch/` gates Task-tool dispatches before they execute. The main concern is deep-loop protection: `lib/dispatch-guard.cjs` recognizes dispatches that target deep-loop sub-agents and distinguishes a bounded external handoff from repeated handoffs that recreate a command-owned iteration loop outside its parent command. A second, Claude-only guard enforces the Fable-model subagent policy.

The core returns a transport-free `allow`/`warn`/`reject` decision; adapters translate it into their runtime's envelope. Warning state persists under `.opencode/skills/.loop-guard-state/` so both OpenCode and Claude share one bounded audit trail. The core performs the loop-state persistence and state-directory maintenance but never writes stdout/stderr and never writes the warning log itself — the adapter appends warnings/audits so both runtimes share one bounded log path.

---

## 2. WHAT IT DOES

**task-dispatch-guard** evaluates every Task-tool dispatch through two checks. `evaluateDispatch` returns `{ decision, detail, warnings, audits }`; Check 1 runs first and short-circuits to `reject` under the mode-reject env before Check 2 can run, but a mismatch warning is still recorded and Check 2 still runs.

*Check 1 — Deep Route mode mismatch.* Resolves the real target agent identity (`resolveTargetIdentity` parses `target_agent=@<name>` / `Agent: @<name>` from the prompt body first, falling back to `subagent_type` only when it is not the generic `general` placeholder that `orchestrate` sets for every call). Loads the agent's registered workflow modes from `mode-registry.json`. If the prompt declares a `mode=` that is not in that agent's registered set, it warns (or rejects under `SYSTEM_DEEP_LOOP_GUARD_REJECT=1`):

```text
system-deep-loop-guard: Deep Route mode mismatch -- dispatch targets subagent_type="<agent>" (registry modes="<a|b>") but the prompt declares mode="<mode>"
```

*Check 2 — loop-like repeated hand-off.* For the three command-owned loop executors (`deep-research`, `deep-review`, `deep-improvement`), records each non-command-driven dispatch in per-session state. A dispatch is command-driven only when the prompt carries an `Iteration: N of M` marker *and* a `Config: <path>` line that resolves to a real on-disk deep-loop config with `mode` + `maxIterations` — marker text alone is not enough, so a forger or injected content cannot gain command authority. At 2 non-command-driven hand-offs it warns; at 3, under `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`, it rejects:

```text
system-deep-loop-guard: loop-like repeated dispatch -- "<agent>" received <N> non-command-driven hand-offs in this session without a command-driven iteration marker; command-owned loop executors should be dispatched by their parent /deep:* command, not repeatedly handed off by another agent.
```

Warnings are injected into the model's context as `additionalContext`, newline-joined when several apply. A reject becomes the denial reason. Every non-allow decision also appends a `[system-deep-loop-guard] WARN:` line to the shared bounded log `guard-warnings.log` in the state directory (256 KB default, rotated to `.1`). Generic subagents (`context`/`review`/`write`/`debug`) and `ai-council` are intentionally excluded from loop-repeat counting.

**fable-subagent-guard** (Claude only) fires when the main session runs on a Fable model — read from the session transcript's last `"model":"claude-…"` field (tail 2 MB). It denies three dispatch shapes that would silently inherit Fable, each with its own reason:

| Shape | Denial reason |
|---|---|
| `subagent_type: "fork"` | `Main session runs on <model>; fork subagents always inherit the parent model, so a fork would run on Fable. Dispatch a non-fork agent with model: "opus" or model: "sonnet" instead.` |
| call omits `model` | `Main session runs on <model>; a subagent without a model override inherits Fable. Pass model: "opus" or model: "sonnet" on the Agent call.` |
| `model` not `opus`/`sonnet` | `Main session runs on <model>; subagent model "<requested>" is not permitted. Only "opus" or "sonnet" subagents may be dispatched while Fable drives the main loop.` |

Fails open when the transcript is missing or unreadable.

---

## 3. PER-RUNTIME DELIVERY

Every covered runtime evaluates the **same** `lib/dispatch-guard.cjs` core. What differs is the event, the tool name, and how the decision is delivered.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `claude/task-dispatch-guard.cjs` | `PreToolUse` on `Task` (`.claude/settings.json`) | `tool_name: 'Task'`; reads `subagent_type`/`subagentType` + `prompt`; resolves project dir from `payload.cwd` or `CLAUDE_PROJECT_DIR` | reject → `permissionDecision: 'deny'` + reason; warn → `additionalContext` (warnings joined with `\n`). Uses `shared/hook-adapter-shared.cjs` for stdin parsing. |
| **Claude** | `claude/fable-subagent-guard.mjs` | `PreToolUse` on `Task\|Agent` | Reads the active main-loop model from `payload.transcript_path`; denies the three Fable shapes above | `permissionDecision: 'deny'` + per-shape reason. Claude-only; no other runtime has this guard. |
| **Devin** | `devin/task-dispatch-guard.cjs` | `PreToolUse` on `run_subagent` (`.devin/hooks.v1.json`) | `tool_name: 'run_subagent'`; accepts `subagent_type`/`subagentType`/`agent_type`/`agentType`; whitespace-only `cwd` falls back to `DEVIN_PROJECT_DIR` | Same deny/advisory envelope as Claude. No Fable guard. |
| **Cursor** | `cursor/task-dispatch-guard.mjs` | `preToolUse` (matcher `Task`) | `tool_name: 'Task'`; forwards the payload unchanged (the Claude core already reads the shape Cursor emits) | `spawnSync`s the Claude adapter, then translates its `hookSpecificOutput` into Cursor's envelope: deny → `{permission: 'deny', user_message, agent_message}` (exit 2); warn → `{permission: 'allow', agent_message}`. |
| **OpenCode** | `.opencode/plugins/system-deep-loop-guard.js` (mirrored at `opencode/`) | Plugin: `tool.execute.before` on `task` + `event` on `session.created` | `input.tool: 'task'`; reads `args.subagent_type`/`subagentType` + `args.prompt` | reject → throws `Error(result.detail)` (OpenCode treats a thrown `before` error as a denial); warn → state-dir log only, **never** stdout/stderr. `session.created` triggers a throttled state-directory sweep. |
| **Codex** | — | — | — | `unverified`: `PreToolUse` exists but no confirmed agent-spawn tool event; no adapter is wired. |
| **Pi** | — | — | — | `~ partial`: intercepts direct `subagent` calls; workflow-nested (`runs.run`) dispatches not yet covered. No per-runtime adapter file lives in this concern's folder. |

Cursor deliberately does not reimplement the policy: it forwards its payload and shells out to the Claude adapter, so a future change to the guard lands in both without a second edit. OpenCode is the only runtime that turns a reject into a thrown error rather than a deny envelope, and the only one that runs the state-directory sweep on `session.created`.

OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/system-deep-loop-guard.js` is a browsability-only symlink back into that folder and nothing loads through it.

---

## 4. DIRECTORY TREE

```text
task-dispatch/
+-- lib/
|   `-- dispatch-guard.cjs        # registry indexing, target identity, loop-repeat state, policy
+-- claude/
|   +-- task-dispatch-guard.cjs   # PreToolUse(Task) adapter
|   `-- fable-subagent-guard.mjs  # PreToolUse(Task|Agent) Fable-model policy (Claude only)
+-- devin/    task-dispatch-guard.cjs
+-- cursor/   task-dispatch-guard.mjs
`-- opencode/ system-deep-loop-guard.js (browsability symlink -> ../../../plugins/; real file loaded from .opencode/plugins/)
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/dispatch-guard.cjs` | Owns registry indexing (`loadRegistryAgents`), target identity resolution (`resolveTargetIdentity`), Deep Route mode-mismatch detection, command-driven iteration recognition (`isCommandDrivenIteration` — requires a real on-disk config, not just marker text), session-scoped loop-repeat state (`recordLoopDispatch`, atomic file persistence), the bounded warning log contract (`appendWarningLog`), age-based state sweep/archive/prune (`sweepStaleLoopGuardStates`), and the runtime-neutral `evaluateDispatch` entrypoint. Never writes stdout/stderr. |
| `claude/task-dispatch-guard.cjs` | Claude `PreToolUse(Task)` adapter. Returns warnings as `additionalContext`, rejections through Claude's `permissionDecision: 'deny'` form. Uses `shared/hook-adapter-shared.cjs`. |
| `claude/fable-subagent-guard.mjs` | Claude-only `PreToolUse(Task\|Agent)` Fable-model policy. Reads the active model from the session transcript; denies `fork`, missing `model`, and non-opus/sonnet `model` when Fable drives the main loop. Fails open when the transcript is unreadable. |
| `devin/task-dispatch-guard.cjs` | Devin `PreToolUse(run_subagent)` adapter over the same core. Accepts the four `subagent_type`/`agent_type` field aliases. |
| `cursor/task-dispatch-guard.mjs` | Cursor `preToolUse` (matcher `Task`) adapter; `spawnSync`s the Claude adapter and translates its envelope into Cursor's permission shape. |
| `.opencode/plugins/system-deep-loop-guard.js` | OpenCode plugin. `tool.execute.before` runs the policy (reject → thrown error); `event` on `session.created` runs the state-directory sweep. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_TASK_DISPATCH_DISABLED=1` | Full no-op on every runtime. The shared resolver (`isHookEnabled('task-dispatch')`) short-circuits every adapter, including the Fable guard. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` | Escalates a Deep Route mode mismatch from `warn` to `reject` (deny). Off by default — the mismatch is advisory unless this is set. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` | Escalates a confirmed loop-recreation (count ≥ 3) from `warn` to `reject`. Off by default. |
| `SYSTEM_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES` | Warning-log size cap before rotation (default 256 KB). |
| `SYSTEM_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` | Days an untouched per-session state file stays active before archiving (default 2). |
| `SYSTEM_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` | Days an archived state file survives before pruning (default 90). |
| `SYSTEM_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` | Throttle for the state-directory sweep (default 1 hour). |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins only. Adapters import `../lib/` and (CommonJS ones) `../../shared/hook-adapter-shared.cjs` + `../../shared/hook-flags.cjs` — nothing outside this tree. The Cursor adapter imports `hook-flags.mjs` and shells out to the Claude adapter by repo-relative path. |
| State | Loop-repeat counters and warning logs live in `.opencode/skills/.loop-guard-state/`, written by adapters (never the core) so both runtimes share one bounded log. State files are session-keyed and written atomically (temp + rename). |
| Decisions | `allow`, `warn`, or `reject`. Reject is reserved for confirmed mode mismatch (under the reject env) and confirmed loop-recreation (count ≥ 3 under the reject-loop env), plus the Fable policy's three forbidden shapes. |
| Failure | Fails open on malformed stdin, missing/unreadable registry or state, or any internal error. A persistence failure under a reject env emits an audit line (`appendRejectModeDegradedAudit`) but still allows the dispatch. |

---

## 8. VALIDATION

```bash
node --test .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs .opencode/plugins/tests/system-deep-loop-guard.test.cjs
```

Expected result: all tests pass (includes the forged-iteration-marker regression cases).

```bash
node -e "import('./.opencode/plugins/system-deep-loop-guard.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error (confirms the OpenCode adapter still resolves this core).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../../skills/.loop-guard-state/README.md`](../../skills/.loop-guard-state/README.md): the shared state directory contract.
- [`../injection-contract.md`](../injection-contract.md): decision visibility per runtime.
- [`../shared/README.md`](../shared/README.md): the shared stdin parser and kill-switch resolver the adapters use.
- [`../../skills/system-deep-loop/SKILL.md`](../../skills/system-deep-loop/SKILL.md): the deep-loop workflow whose `mode-registry.json` and command-owned executors this guard protects.
