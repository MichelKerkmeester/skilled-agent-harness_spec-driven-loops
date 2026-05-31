---
title: "Embedder status and active pointer"
description: "embedder_status reports the active embedder pointer plus any in-flight swap job state and returns structured NOT_FOUND-style guidance for unknown job IDs, giving operators a poll-safe view of the swap surface."
trigger_phrases:
  - "embedder status and active pointer"
  - "embedder_status"
  - "poll embedder swap job"
  - "active embedder pointer"
  - "swap job status"
---

# Embedder status and active pointer

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

embedder_status reports the active embedder pointer plus any in-flight swap job state and returns structured NOT_FOUND-style guidance for unknown job IDs, giving operators a poll-safe view of the swap surface.

The handler is the readiness side of the embedder swap surface. Operators call it without arguments to see which embedder is currently active and whether a swap is in progress, and they pass a `jobId` to poll a specific swap. The unknown-job-id path returns structured guidance rather than crashing so a typo or stale id during polling does not break the operator loop.

---

## 2. HOW IT WORKS

The handler lives at `mcp_server/handlers/embedder-status.ts`. The no-args contract for `embedder_status({})` is to return the active embedder name, the dimension count, the vector table backing the corpus, and any current swap-job state. The active pointer is the same one read by `embedder_list` and updated by `embedder_set`, so the three handlers agree on a single source of truth.

The job-id contract for `embedder_status({ jobId })` is to look the job up in the swap-job table and return its current phase (planning, reindexing, finalizing, complete, error). Unknown ids return a structured NOT_FOUND-style payload that names the missing job and suggests valid recovery actions, rather than a generic crash response. Operators polling a real swap can cite the response without translating raw stack traces.

The handler is the third member of the embedder swap trio (`embedder_list`, `embedder_set`, `embedder_status`). Operators chain them as list-to-discover, set-to-plan, status-to-poll. The trio replaced the older script-only swap path with a poll-friendly MCP surface that every CLI client can consume without spawning a subprocess.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | Handler | Reports active embedder metadata, current swap-job state, and structured NOT_FOUND-style guidance for unknown job IDs |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | Lib | Canonical registry consulted for active-embedder metadata |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-status.vitest.ts` | Automated test | Handler-level coverage for no-args active pointer, jobId polling, and unknown-job-id NOT_FOUND shape |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/283-embedder-status-job-and-active-pointer.md` | Manual playbook | Playbook scenario 283 covering active pointer output and unknown job ID handling |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/247-embedder-status-and-active-pointer.md`
Related references:
- [246-embedder-set-dry-run-and-validation.md](246-embedder-set-dry-run-and-validation.md) — Embedder set dry-run and validation
- [248-orphan-mcp-sweeper-and-launchagent-template.md](248-orphan-mcp-sweeper-and-launchagent-template.md) — Orphan MCP Sweeper and LaunchAgent Template
