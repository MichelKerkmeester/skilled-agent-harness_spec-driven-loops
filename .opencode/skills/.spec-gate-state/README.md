---
title: Spec Gate Runtime State
description: Stores per-session spec-gate decisions, mutation warnings and archived gate state.
trigger_phrases:
  - "spec gate runtime state"
  - "spec gate warnings"
  - "spec gate archive"
version: 1.0.0.0
---

# Spec Gate Runtime State

> Runtime storage for spec-folder gate decisions managed by `mk-spec-gate.js`.

---

## 1. OVERVIEW

This folder stores machine-specific state for the [`mk-spec-gate.js`](../../plugins/mk-spec-gate.js) plugin. The plugin reads and writes each session's spec-gate status, uses that status when evaluating file mutations and records advisory or would-deny events.

Raw runtime data is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving local session data.

---

## 2. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.json` | Formatted JSON object | Stores a gate `status` of `open`, `satisfied` or `skipped`. Open records include `askedAtMs`. Answered records include `answeredAtMs` and may include `boundSpecFolder`, `validatedResolvedPath`, `satisfiedBy` or `writeBoundary`. |
| `spec-gate-warnings.log` | Plain-text log | Stores timestamped telemetry lines with runtime, session ID, tool, redacted file path and decision. |
| `spec-gate-warnings.log.1` | Plain-text log | Stores the previous rotated warning-log generation. |
| `.archive/<session-id-hex>.json` | Formatted JSON object | Stores stale gate state using the same shape as an active state file. |
| `.sweep.lock/` | Temporary lock directory | Prevents concurrent cleanup passes. |

The plugin encodes each session ID as hexadecimal for the JSON filename. It writes state atomically through a temporary JSON file and rename. Session deletion removes the active gate file instead of archiving it.

---

## 3. LIFECYCLE

A session-start sweep moves stale active JSON files into `.archive/`, removes expired archive files and maintains the warning log. The plugin removes a session's active state when OpenCode reports that the session was deleted.

| Setting | Default | Purpose |
|---|---|---|
| `MK_SPEC_GATE_ACTIVE_RETENTION_DAYS` | `2` days | Controls when inactive gate state moves into `.archive/`. |
| `MK_SPEC_GATE_ARCHIVE_RETENTION_DAYS` | `90` days | Controls archive and warning-log retention. |
| `MK_SPEC_GATE_SWEEP_INTERVAL_MS` | `3600000` | Controls how often cleanup may run. |
| `MK_SPEC_GATE_WARNING_LOG_MAX_BYTES` | `262144` bytes | Controls warning-log rotation. |
| `MK_SPEC_GATE_DISABLED` | Disabled | Makes classification and enforcement inactive when set to `1`. |

Rotation keeps the active warning log and one `.1` backup. Cleanup also removes stale temporary files from interrupted writes.

---

## 4. RELATED

- [`mk-spec-gate.js`](../../plugins/mk-spec-gate.js) connects OpenCode prompts, mutations and session events to the gate.
- [`spec-gate-core.mjs`](../system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs) defines state persistence, event logging and cleanup.
