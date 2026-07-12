---
title: Deep Loop Guard Runtime State
description: Explains the per-session counters, warning logs and archived state used to guard deep-loop Task dispatches.
trigger_phrases:
  - "deep loop guard state"
  - "loop dispatch warnings"
  - "loop guard archive"
version: 1.0.0.1
---

# Deep Loop Guard Runtime State

> Runtime storage for deep-loop dispatch enforcement managed by `mk-deep-loop-guard.js`.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-deep-loop-guard.js`](../../plugins/mk-deep-loop-guard.js) OpenCode plugin and its shared [`dispatch-guard.cjs`](../system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs) policy core. The guard checks `Task` dispatches that target deep-loop agents before OpenCode executes them. It uses per-session dispatch counts to distinguish a bounded external handoff from repeated handoffs that recreate a command-owned iteration loop outside its parent command.

The plugin is a transport adapter. It maps OpenCode's `tool.execute.before` and `session.created` events onto the shared core. The core resolves target identity, reads the deep-loop mode registry, evaluates dispatch policy, persists counters and maintains this directory. The adapter writes returned warnings and audits to the bounded log. It throws the core's rejection error only when an opt-in rejection setting applies.

Raw runtime data is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving local session data.

---

## 2. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.json` | Formatted JSON object | Stores `sessionId` and a `dispatches` object keyed by target agent. Each target entry contains `count`, `lastCommandDriven` and `lastTimestamp`. |
| `guard-warnings.log` | Plain-text log | Stores timestamped warning and audit lines from `mk-deep-loop-guard`. |
| `guard-warnings.log.1` | Plain-text log | Stores the previous rotated warning-log generation. |
| `.archive/<session-id-hex>.json` | Formatted JSON object | Stores stale per-session guard state using the same shape as an active state file. |
| `.sweep.lock/` | Temporary lock directory | Prevents concurrent cleanup passes across OpenCode processes. |

The shared guard core encodes each session ID as hexadecimal for the JSON filename. It updates state atomically through a temporary JSON file and rename.

---

## 3. GUARD POLICY

The shared core applies two checks to a resolved deep-loop target:

| Check | Evidence | Default result | Opt-in rejection |
|---|---|---|---|
| Deep Route mode match | Compares a declared `mode=<value>` in the prompt with the target agent's `workflowMode` values in [`mode-registry.json`](../system-deep-loop/mode-registry.json). | Writes a warning when the declared mode does not belong to the target agent. | `MK_DEEP_LOOP_GUARD_REJECT=1` rejects the mismatch. |
| Repeated loop-executor handoff | Counts non-command-driven dispatches to `deep-research`, `deep-review` or `deep-improvement` for the same session and target. A bounded `Iteration: N of M` or `Review Iteration: N of M` marker identifies command-driven work. | Allows the first handoff. It writes warnings from the second non-command-driven handoff onward. | `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1` rejects the third and later non-command-driven handoffs. |

The core resolves an agent from `target_agent=@<name>` or `Agent: @<name>` in the prompt before it falls back to a non-generic `subagent_type`. This supports dispatchers that use `subagent_type="general"` while naming the real agent in the prompt.

The repeated-handoff check intentionally excludes `ai-council` and generic subagents. Counts remain scoped to one session and one target agent. They do not detect a sequence that alternates between different loop executors.

The guard fails open on missing registry data, unreadable state and unexpected argument or internal errors. When rejection is enabled but a required registry or persistence dependency is unavailable, the adapter records a degraded-enforcement audit and allows the dispatch.

---

## 4. RELATED SKILL WORKFLOW

[`system-deep-loop`](../system-deep-loop/SKILL.md) routes deep research, deep review, AI council and improvement workflows to their registered mode packets. The research, review and council modes use the shared runtime's graph-backed convergence backend. Improvement modes use their registered improvement host or external adapter. Each mode packet owns its own iteration, state and artifact contract.

The dispatch guard protects the handoff into those workflows. The parent `/deep:*` commands own iteration state and convergence for `deep-research`, `deep-review` and `deep-improvement`. Their iteration prompts carry a bounded iteration marker, so those dispatches remain command-driven and do not increase the non-command-driven count. A caller outside that command path may make one bounded handoff. Repeated handoffs produce an auditable warning and can be rejected when the operator enables rejection.

The mode check connects dispatch metadata to the same [`mode-registry.json`](../system-deep-loop/mode-registry.json) that maps workflow modes to agents and mode packets. This catches a prompt that declares one registered mode while targeting an agent assigned to another mode. It does not evaluate whether a route-matched prompt performs semantically correct work after dispatch.

This state is separate from a mode packet's research, review, council or improvement artifacts. It records guard decisions around `Task` transport. It does not store convergence results, skill routing decisions, Gate answers or MCP data.

---

## 5. RUNTIME INTEGRATION

OpenCode and Claude Code consume the same policy core and state directory:

| Runtime surface | Adapter behavior |
|---|---|
| OpenCode plugin | [`mk-deep-loop-guard.js`](../../plugins/mk-deep-loop-guard.js) evaluates lowercase-normalized `task` calls in `tool.execute.before`. It logs advisories and throws a confirmed rejection. Its `session.created` event requests state maintenance. |
| Claude hook | [`task-dispatch-guard.cjs`](../system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs) evaluates `PreToolUse(Task)` payloads. It logs to the same warning path, returns warnings as `additionalContext` and returns confirmed rejection through Claude's deny response. |

The shared core returns a transport-free `allow`, `warn` or `reject` decision. Each adapter presents that decision through its runtime protocol. The core never writes standard output or standard error. The adapters keep warning signals in this directory so OpenCode warnings do not disrupt the interactive prompt line and both runtimes retain one bounded audit trail.

The guard runs before agent dispatch. It does not use a daemon or MCP server. It complements the skill hub and command workflow by checking the dispatch boundary rather than replacing skill routing, command-owned convergence or other repository gates.

---

## 6. LIFECYCLE

A session-start sweep moves stale active JSON files into `.archive/`, removes expired archive files and maintains the warning log. The sweep uses a temporary directory lock and fails open if state maintenance cannot run.

| Setting | Default | Purpose |
|---|---|---|
| `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive session state moves into `.archive/`. |
| `MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and warning-log retention. |
| `MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES` | `262144` bytes | Controls warning-log rotation. |

Rotation keeps the active warning log and one `.1` backup. Cleanup also removes stale temporary JSON files left by interrupted atomic writes.

The OpenCode plugin requests this sweep when it receives `session.created`. A per-plugin timestamp throttles requests and `.sweep.lock/` coordinates state maintenance across OpenCode processes. Before archiving a candidate, the core checks its modification time again so a freshly updated session file stays active.

Warnings never need to exist for the guard to enforce a confirmed opt-in rejection. Logging, persistence and cleanup all fail open so maintenance faults do not block unrelated dispatches.

---

## 7. RELATED RESOURCES

- [`mk-deep-loop-guard.js`](../../plugins/mk-deep-loop-guard.js) connects OpenCode events to the shared guard.
- [`dispatch-guard.cjs`](../system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs) defines the state shape, logging rules and cleanup lifecycle.
- [`system-deep-loop`](../system-deep-loop/SKILL.md) defines the related skill hub, registered workflow families and runtime boundary.
- [`mode-registry.json`](../system-deep-loop/mode-registry.json) maps workflow modes to their commands, agents and mode packets.
- [`task-dispatch-guard.cjs`](../system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs) applies the same policy through Claude's `PreToolUse(Task)` hook.
