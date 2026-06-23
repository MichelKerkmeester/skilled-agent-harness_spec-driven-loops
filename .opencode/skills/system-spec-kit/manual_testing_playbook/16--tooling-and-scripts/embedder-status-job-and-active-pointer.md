---
title: "283 -- Embedder status job and active pointer"
description: "Validates embedder_status reports active pointer state and handles unknown job IDs cleanly."
audited_post_017: true
version: 3.6.0.1
---

# 283 -- Embedder status job and active pointer

## 1. OVERVIEW

This scenario covers the polling/readiness side of the embedder swap surface.

---

## 2. SCENARIO CONTRACT

- Objective: Validate embedder_status active pointer and unknown job edge.
- Real user request: `Check embedder_status and prove unknown swap job IDs are handled cleanly.`
- RCAF Prompt: `Run embedder_status without a job ID and with an impossible job ID; verify active state and error guidance.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Active embedder metadata is visible. - Unknown job ID returns NOT_FOUND-style guidance, not a generic crash. - Response can be cited by operators polling a real swap.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run embedder_status without a job ID and with an impossible job ID; verify active state and error guidance.
```

### Commands

1. `embedder_status({})`
2. Verify active embedder name, dimension, vector table, and any current job state.
3. `embedder_status({ jobId: "emb-swap-does-not-exist" })`
4. Verify the unknown job response is structured and non-crashing.

### Expected Output / Verification

- Active embedder metadata is visible.
- Unknown job ID returns NOT_FOUND-style guidance, not a generic crash.
- Response can be cited by operators polling a real swap.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 283
- Tool: `embedder_status`
