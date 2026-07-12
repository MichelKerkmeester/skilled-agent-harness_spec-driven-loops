---
title: Spec Gate Runtime State
description: Stores per-session spec-gate decisions, mutation warnings and archived gate state.
trigger_phrases:
  - "spec gate runtime state"
  - "spec gate warnings"
  - "spec gate archive"
version: 1.0.0.1
---

# Spec Gate Runtime State

> Runtime storage for spec-folder gate decisions managed by `mk-spec-gate.js`.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-spec-gate.js`](../../plugins/mk-spec-gate.js) OpenCode plugin. The plugin is a transport adapter over the runtime-neutral [`spec-gate-core.mjs`](../system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs). The core defines this directory path, persists each session's Gate 3 status and applies the shared classification and mutation policy.

Gate 3 is the **SPEC FOLDER QUESTION** in the [`system-spec-kit` gate rules](../system-spec-kit/constitutional/gate-enforcement.md). It asks for an A-E choice before file mutation work. The persisted status lets the prompt-classification hook and the later tool-execution hook share one answer even though they run at different points in the OpenCode lifecycle.

Raw runtime data is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving local session data.

---

## 2. PLUGIN AND SKILL LOGIC

The plugin connects three OpenCode hook surfaces to the shared core:

| Hook | Plugin action | State effect |
|---|---|---|
| `experimental.chat.system.transform` | Gets the current prompt or fetches the session's latest user message, then calls `classifyIntent()` | Opens the gate, records a valid answer or leaves an already answered gate unchanged |
| `tool.execute.before` | Calls `evaluateMutation()` for supported mutating tools and for Bash | Reads the session state and records an advisory or would-deny event when the open gate affects the mutation |
| `event` | Handles `session.created` and `session.deleted` | Sweeps stale state at session creation and removes active state when a session is deleted |

The plugin and core process a session in this order:

1. The shared [`gate-3-classifier.ts`](../system-spec-kit/shared/gate-3-classifier.ts) classifies file-write, memory-save and write-producing resume intent. Read-only terms can suppress qualifying file-write matches. Memory-save and invoked resume workflows retain their own classification rules.
2. `classifyIntent()` checks an existing open state for an answer before it classifies the turn again. A recognized skip stores `skipped`. A valid spec-folder binding stores `satisfied`.
3. A triggering turn without an accepted answer stores `open` with `askedAtMs` and returns the bounded A-E question. A triggering turn that already names a valid folder can satisfy the gate without another question.
4. `evaluateMutation()` reads that cached status. It allows sessions marked `satisfied` or `skipped`, and it allows sessions whose gate never opened.
5. An unanswered `open` gate produces advice for a relevant mutation. Only `write` and `edit` can be denied, denial requires `MK_SPEC_GATE_ENFORCE=1` and dispatched child sessions remain advisory.

This state exists because prompt classification and mutation interception do not receive the same input at the same time. A session file carries the user's Gate 3 decision from the chat hook to the tool hook without asking on every mutation. The warning log keeps bounded operational evidence for open-gate mutation events so operators can inspect advisory traffic and would-deny behavior before enabling enforcement.

The plugin fails open. Missing prompts, unreadable state, invalid JSON and internal errors produce no new block. `MK_SPEC_GATE_DISABLED=1` makes the plugin inactive before it classifies prompts or evaluates mutations.

---

## 3. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.json` | Formatted JSON object | Stores a gate `status` of `open`, `satisfied` or `skipped`. Open records include `askedAtMs`. Answered records include `answeredAtMs` and may include `boundSpecFolder`, `validatedResolvedPath`, `satisfiedBy` or `writeBoundary`. |
| `spec-gate-warnings.log` | Plain-text log | Stores timestamped telemetry lines with runtime, session ID, tool, redacted file path and decision. |
| `spec-gate-warnings.log.1` | Plain-text log | Stores the previous rotated warning-log generation. |
| `.archive/<session-id-hex>.json` | Formatted JSON object | Stores stale gate state using the same shape as an active state file. |
| `.sweep.lock/` | Temporary lock directory | Prevents concurrent cleanup passes. |

The plugin encodes each session ID as hexadecimal for the JSON filename. It writes state atomically through a temporary JSON file and rename. Session deletion removes the active gate file instead of archiving it.

---

## 4. STATE LIFECYCLE

A session-start sweep moves stale active JSON files into `.archive/`, removes expired archive files and maintains the warning log. A temporary lock directory prevents concurrent sweeps. The plugin removes a session's active state when OpenCode reports that the session was deleted.

State transitions follow the user interaction:

| Current state | Input or event | Result |
|---|---|---|
| No record | A classified turn triggers Gate 3 | `open` with `askedAtMs` |
| `open` | The user gives a recognized skip answer | `skipped` with `answeredAtMs` |
| `open` | The user names a locally validated spec folder | `satisfied` with the binding and `answeredAtMs` |
| `open` | The answer is incomplete or the folder is not accepted | Remains `open` and the question is returned again |
| `satisfied` or `skipped` | A later turn or mutation uses the same session | The stored decision remains effective |
| Any active state | OpenCode emits `session.deleted` | The active JSON file is removed |

For accepted prior answers, the core validates the folder against the local spec tree. It stores the supplied binding and resolved path when validation succeeds. Trusted prebound command context can instead store `satisfiedBy` and `writeBoundary`.

| Setting | Default | Purpose |
|---|---|---|
| `MK_SPEC_GATE_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive gate state moves into `.archive/`. |
| `MK_SPEC_GATE_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and warning-log retention. |
| `MK_SPEC_GATE_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_SPEC_GATE_WARNING_LOG_MAX_BYTES` | `262144` bytes | Controls warning-log rotation. |
| `MK_SPEC_GATE_DISABLED` | Disabled | Makes classification and enforcement inactive when set to `1`. |

Rotation keeps the active warning log and one `.1` backup. Cleanup also removes stale temporary files from interrupted writes.

---

## 5. SYSTEM BOUNDARIES

The runtime state supports Gate 3 enforcement but does not replace the documented gate workflow. [`AGENTS.md`](../../../AGENTS.md) defines when the assistant must ask the spec-folder question and the shared classifier provides the machine-readable trigger contract. The plugin carries that decision across OpenCode hooks.

`spec-gate-core.mjs` imports the compiled shared classifier from `shared/dist`. It does not call the Spec Kit Memory MCP daemon to classify a prompt or evaluate a mutation. Memory-save phrases still trigger Gate 3 because those workflows can write continuity artifacts, not because this state directory stores memory records.

The core is runtime-neutral so another runtime adapter can use the same policy and persistence behavior. `mk-spec-gate.js` owns the OpenCode transport details, including session prompt retrieval, OpenCode event mapping and warning-log writes.

---

## 6. RELATED FILES

- [`mk-spec-gate.js`](../../plugins/mk-spec-gate.js) connects OpenCode prompts, mutations and session events to the gate.
- [`spec-gate-core.mjs`](../system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs) defines state persistence, event logging and cleanup.
- [`gate-3-classifier.ts`](../system-spec-kit/shared/gate-3-classifier.ts) defines the authoritative Gate 3 trigger and binding contract.
- [`gate-enforcement.md`](../system-spec-kit/constitutional/gate-enforcement.md) summarizes the human-facing gate rules and their relationship to the broader workflow.
