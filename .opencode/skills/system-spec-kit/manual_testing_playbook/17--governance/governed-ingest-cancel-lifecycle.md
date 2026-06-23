---
title: "278 -- Governed ingest cancel lifecycle"
description: "Validates memory_ingest_start/status/cancel with a tiny deterministic fixture folder."
audited_post_017: true
version: 3.6.0.1
---

# 278 -- Governed ingest cancel lifecycle

## 1. OVERVIEW

Existing ingest scenarios focus on async lifecycle broadly; this one pins the cancel edge to a tiny operator-safe fixture.

---

## 2. SCENARIO CONTRACT

- Objective: Validate ingest cancellation and status transition.
- Real user request: `Start a tiny ingest job, cancel it, and prove status reflects cancellation.`
- RCAF Prompt: `Run memory_ingest_start/status/cancel against a tiny fixture path and verify cancellation state.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Start returns a job ID. - Cancel acknowledges the same job ID. - Final status is canceled or terminal with explicit cancellation evidence.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run memory_ingest_start/status/cancel against a tiny fixture path and verify cancellation state.
```

### Commands

1. Create a temporary folder under `/tmp/playbook-017-ingest` with one markdown file.
2. `memory_ingest_start({ paths: ["/tmp/playbook-017-ingest"], dryRun: false })`
3. `memory_ingest_status({ jobId: "<returned jobId>" })`
4. `memory_ingest_cancel({ jobId: "<returned jobId>" })`
5. `memory_ingest_status({ jobId: "<returned jobId>" })`

### Expected Output / Verification

- Start returns a job ID.
- Cancel acknowledges the same job ID.
- Final status is canceled or terminal with explicit cancellation evidence.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts`

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 278
- Tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`
