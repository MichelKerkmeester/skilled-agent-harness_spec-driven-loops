---
title: "Completion Sentinel Runtime State"
description: "Runtime advisory deduplication state for the completion evidence sentinel."
trigger_phrases:
  - "completion sentinel state"
  - "advisory deduplication"
  - "completion evidence sentinel"
version: 1.0.0.0
---

# Completion Sentinel Runtime State

> This folder stores advisory fingerprints that prevent duplicate completion-evidence warnings.

---

## 1. OVERVIEW

The [`mk-completion-sentinel.js`](../../plugins/mk-completion-sentinel.js) plugin delegates completion-claim evaluation to the shared completion evidence sentinel. The shared core reads and writes this folder so OpenCode and Claude adapters use the same advisory deduplication state.

When the sentinel finds missing completion evidence, it records a fingerprint for the spec folder and claim text. A repeated claim with the same fingerprint does not produce another advisory.

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

## 3. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `MK_COMPLETION_SENTINEL_DISABLED` | Not set | Disables evaluation and state maintenance when set to `1`. |
| `MK_COMPLETION_SENTINEL_RETENTION_DAYS` | `30` | Sets the maximum age for dedup entries and stale temporary files. |
| `MK_COMPLETION_SENTINEL_SWEEP_INTERVAL_MS` | `3600000` | Sets the minimum interval between maintenance sweeps. |

---

## 4. LIFECYCLE

The sentinel reads the current JSON object, updates one spec-folder key and writes the complete store through an atomic temporary-file rename. A write failure removes its temporary file when possible and leaves the prior store intact.

A throttled sweep runs from the plugin's `session.created` event. It removes dedup entries older than the configured retention period and deletes stale temporary files. The sweep also uses `.sweep.lock` to prevent concurrent cleanup passes.

Operators can delete `advisory-dedup.json` to reset advisory suppression. The sentinel recreates the store when it records the next advisory.

---

## 5. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`mk-completion-sentinel.js`](../../plugins/mk-completion-sentinel.js) | Adapts OpenCode session events to the shared sentinel core. |
| [`completion-evidence-sentinel.cjs`](../system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs) | Owns completion checks, dedup persistence and stale-state cleanup. |
| [`completion-sentinel-advisories.log`](../../logs/completion-sentinel-advisories.log) | Stores bounded advisory messages separately from deduplication state when the log exists. |
