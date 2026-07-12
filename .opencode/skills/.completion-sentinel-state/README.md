---
title: "Completion Sentinel Runtime State"
description: "Shared runtime state that deduplicates completion-evidence advisories across OpenCode and Claude Code adapters."
trigger_phrases:
  - "completion sentinel state"
  - "advisory deduplication"
  - "completion evidence sentinel"
version: 1.0.0.1
---

# Completion Sentinel Runtime State

> This folder stores advisory fingerprints that prevent duplicate completion-evidence warnings.

---

## 1. OVERVIEW

The [`mk-completion-sentinel.js`](../../plugins/mk-completion-sentinel.js) plugin adapts OpenCode lifecycle events to the shared [`completion-evidence-sentinel.cjs`](../system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs) core. The plugin does not define this folder directly. It imports the core, which owns the state path, completion-evidence policy, deduplication and cleanup behavior.

This state supports the `system-spec-kit` completion verification workflow. That workflow requires strict spec-folder validation before a completion claim. The sentinel provides a separate advisory safeguard at turn end. It inspects recorded completion artifacts after an assistant claims work is complete, but it does not replace the workflow's required validation, execute tests or run `validate.sh`.

When the sentinel finds missing completion evidence, it records a fingerprint for the spec folder and exact claim text. A repeated claim with the same fingerprint does not produce another advisory. A different claim for the same folder replaces that folder's stored fingerprint and can produce a new advisory. This suppression prevents identical warnings from repeating when both runtime adapters or repeated lifecycle events evaluate the same claim.

The raw runtime data in this folder is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving machine-specific state.

---

## 2. STRUCTURE

```text
.completion-sentinel-state/
+-- README.md
+-- advisory-dedup.json
+-- advisory-dedup.json.<pid>.<timestamp>.tmp
`-- .sweep.lock/
```

| Path | Shape and Purpose |
|---|---|
| `README.md` | Tracked documentation for this runtime-state folder. |
| `advisory-dedup.json` | JSON object keyed by a 24-character SHA-256-derived spec-folder identifier. |
| `advisory-dedup.json.<pid>.<timestamp>.tmp` | Temporary file used during an atomic dedup store update. |
| `.sweep.lock/` | Transient directory lock that prevents concurrent maintenance sweeps. |

Each value in `advisory-dedup.json` has this shape:

| Field | Type | Purpose |
|---|---|---|
| `fingerprint` | string | SHA-256 fingerprint of the spec folder and completion claim text, prefixed with `sha256:`. |
| `advisedAt` | string | ISO 8601 time when the sentinel recorded the advisory. |

Example store:

```json
{
  "63f5b365add1856ba336a546": {
    "fingerprint": "sha256:fe051a750e2ecd885532522bc5eca843c47f92cc0926b7837d7148a552310c35",
    "advisedAt": "2026-07-11T08:15:08.300Z"
  }
}
```

The key hides the original spec-folder path. The fingerprint identifies one specific folder and claim-text pair.

---

## 3. CLAIM AND EVIDENCE FLOW

On OpenCode, the plugin reacts to `session.idle`. It resolves the session identifier, fetches at most 20 recent messages through `ctx.client.session.messages()` and selects the most recent assistant text. It continues only when the final 400 characters contain one of the core's completion terms and the text contains a spec-folder-shaped path.

The core then evaluates recorded evidence for that folder:

| Folder State | Evidence Check | Advisory Condition |
|---|---|---|
| `checklist.md` exists | Runs `check-completion.sh <folder> --json` with a bounded timeout. | The returned status is `EVIDENCE_MISSING`, `PRIORITY_CONTEXT_MISSING`, `P0_INCOMPLETE` or `P1_INCOMPLETE`. |
| No `checklist.md` exists | Checks whether `implementation-summary.md` is a file. | `implementation-summary.md` is absent or unreadable. |

The core returns only `ok` or `advise`. It fails open when claim detection, folder resolution, evidence evaluation or internal processing fails. The OpenCode plugin also catches errors and never throws to enforce completion. When the result is `advise`, the plugin appends the detail to the bounded advisory log instead of writing to stdout or stderr.

The shared core also serves the [`completion-evidence-stop.cjs`](../system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs) Claude Code Stop hook. That adapter reads the last assistant message from its Stop payload and obtains the active spec folder from Claude hook state. It writes a warning to stderr and appends the same detail to the shared log, but it always exits successfully and never returns a block decision.

This design keeps completion policy independent from either runtime transport. It does not call the Spec Kit Memory MCP daemon or persist state in an MCP database. The adapters invoke one local core and share this JSON store directly.

---

## 4. DEDUPLICATION

Deduplication runs only after evidence evaluation produces an advisory. The core hashes the spec-folder string to create a 24-character store key, then hashes the folder and exact claim text to create the stored fingerprint. It compares that fingerprint with the existing entry for the folder.

| Comparison Result | Core Result | State Effect |
|---|---|---|
| Fingerprint matches | Returns `ok` with `deduped: true`. | Keeps the existing entry and suppresses the repeated advisory. |
| Fingerprint differs or no entry exists | Returns `advise` with `deduped: false`. | Stores the new fingerprint and current ISO timestamp. |
| Store write fails | Returns the unsuppressed advisory. | Leaves the prior store intact when possible. |

Deduplication is advisory control, not proof that a packet is complete. The evidence check still runs before the fingerprint comparison. Removing `advisory-dedup.json` only resets repeat-warning suppression.

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `MK_COMPLETION_SENTINEL_DISABLED` | Not set | Disables evaluation and state maintenance when set to `1`. |
| `SPECKIT_COMPLETION_SENTINEL_CHECK_TIMEOUT_MS` | `1200` | Limits the synchronous `check-completion.sh --json` evidence check. |
| `SPECKIT_COMPLETION_SENTINEL_LOG_MAX_BYTES` | `262144` | Sets the active advisory-log size that triggers one-backup rotation. |
| `MK_COMPLETION_SENTINEL_RETENTION_DAYS` | `30` | Sets the maximum age for dedup entries and stale temporary files. |
| `MK_COMPLETION_SENTINEL_SWEEP_INTERVAL_MS` | `3600000` | Sets the minimum interval between maintenance sweeps. |

---

## 6. LIFECYCLE

The sentinel reads the current JSON object, updates one spec-folder key and writes the complete store through an atomic temporary-file rename. A write failure removes its temporary file when possible and leaves the prior store intact.

A throttled sweep runs from the OpenCode plugin's `session.created` event. The Claude Stop adapter also requests a best-effort sweep on each invocation. The core's interval check and `.sweep.lock` directory prevent overlapping cleanup passes.

The sweep removes dedup entries older than the configured retention period, deletes stale temporary files and removes an aged rotated advisory-log backup. It rewrites the dedup store only when entries change. An unreadable or corrupt store is treated as empty for reads, but the sweep does not overwrite it merely because parsing failed.

Operators can delete `advisory-dedup.json` to reset advisory suppression. The sentinel recreates the store when it records the next advisory.

---

## 7. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`mk-completion-sentinel.js`](../../plugins/mk-completion-sentinel.js) | Adapts OpenCode session events to the shared sentinel core. |
| [`completion-evidence-sentinel.cjs`](../system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs) | Owns completion checks, dedup persistence and stale-state cleanup. |
| [`completion-evidence-stop.cjs`](../system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs) | Adapts Claude Code Stop payloads and hook state to the shared core. |
| [`system-spec-kit/SKILL.md`](../system-spec-kit/SKILL.md) | Defines the broader validation-before-completion workflow that the sentinel observes. |
| [`completion-sentinel-advisories.log`](../../logs/completion-sentinel-advisories.log) | Stores bounded advisory messages separately from deduplication state when the log exists. |
