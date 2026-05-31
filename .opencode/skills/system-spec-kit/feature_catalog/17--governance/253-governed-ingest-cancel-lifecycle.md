---
title: "Governed ingest cancel lifecycle"
description: "memory_ingest_start, memory_ingest_status, and memory_ingest_cancel expose an async lifecycle for governed ingest jobs so operators can start, observe, and cancel ingests with a stable job ID."
trigger_phrases:
  - "governed ingest cancel lifecycle"
  - "memory_ingest_cancel"
  - "cancel an ingest job"
  - "async ingest job lifecycle"
  - "ingest job status and cancellation"
---

# Governed ingest cancel lifecycle

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The governed ingest tools expose an asynchronous job lifecycle on top of the existing memory ingest pipeline. `memory_ingest_start` accepts a list of paths and returns a job ID. `memory_ingest_status` returns the current state for a given job ID. `memory_ingest_cancel` requests cancellation and returns acknowledgement.

The job ID is stable across all three calls. Status returns a terminal state (`completed`, `canceled`, or `failed`) once the job finishes, and cancellation leaves explicit evidence in the status payload so operators can confirm the cancel took effect.

---

## 2. HOW IT WORKS

`mcp_server/handlers/memory-ingest.ts` implements all three tools against a shared job store. Start validates the paths, registers a job, and returns the job ID synchronously while ingest runs in the background. Status reads the job store directly. Cancel writes a cancellation flag that the ingest loop checks between batches.

- `memory_ingest_start(paths, dryRun)`: returns `jobId` synchronously
- `memory_ingest_status(jobId)`: returns current state and progress fields
- `memory_ingest_cancel(jobId)`: acknowledges cancellation; terminal state follows shortly

The lifecycle composes with the hierarchical scope governance contract (catalog 03), so ingests stay scoped to the requested tenant or session even when canceled mid-flight.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-ingest.ts` | Handler | Start, status, and cancel surface plus job store wiring |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-ingest-lifecycle.vitest.ts` | Automated test | Job lifecycle including cancel acknowledgement and terminal state |

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/253-governed-ingest-cancel-lifecycle.md`
Related references:
- [252-session-resume-caller-binding-and-unicode-sanitization.md](252-session-resume-caller-binding-and-unicode-sanitization.md) — Session-resume caller binding and Unicode sanitization
