---
title: "017 -- Session health shared payload"
description: "Validates session_health reports shared payload freshness and degraded-state recovery hints."
audited_post_017: true
version: 3.6.0.1
---

# 017 -- Session health shared payload

## 1. OVERVIEW

This scenario covers the lightweight session health endpoint that operators use before deeper context recovery.

---

## 2. SCENARIO CONTRACT

- Objective: Validate session_health happy path plus stale/degraded messaging.
- Real user request: `Check session_health and tell me whether shared payload status and recovery guidance are visible.`
- RCAF Prompt: `Run session_health and verify shared payload state, freshness, and recovery hints are reported.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Response includes a health status. - Shared payload freshness is visible. - Degraded state returns guidance, not an opaque failure.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run session_health and verify shared payload state, freshness, and recovery hints are reported.
```

### Commands

1. `session_health({})`
2. Inspect shared-payload producer state and freshness fields.
3. If stale/degraded, confirm the response recommends `session_bootstrap` or equivalent recovery.

### Expected Output / Verification

- Response includes a health status.
- Shared payload freshness is visible.
- Degraded state returns guidance, not an opaque failure.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/context/shared-payload.ts`

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: 017
- Tool: `session_health`
