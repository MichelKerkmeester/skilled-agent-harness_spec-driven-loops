---
title: "015 -- Session bootstrap reader-ready context"
description: "Validates session_bootstrap returns bounded startup context and clear graph-readiness messaging."
audited_post_017: true
version: 3.6.0.2
---

# 015 -- Session bootstrap reader-ready context

## 1. OVERVIEW

This scenario covers the session_bootstrap orchestration surface added to make non-hook runtimes reader-ready without manual context spelunking.

---

## 2. SCENARIO CONTRACT

- Objective: Validate session_bootstrap happy path and degraded graph messaging.
- Real user request: `Validate session_bootstrap on the current workspace and tell me whether it returns reader-ready context plus graph readiness.`
- RCAF Prompt: `Run session_bootstrap for the current workspace and verify it returns bounded context, graph readiness, and next-action guidance.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Response is non-empty and scoped to the current workspace. - Response includes graph readiness status or degraded-mode guidance. - Response names a next action such as `session_resume`, `code_graph_scan`, or direct spec-folder recovery.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run session_bootstrap for the current workspace and verify it returns bounded context, graph readiness, and next-action guidance.
```

### Commands

1. `session_bootstrap({})`
2. Inspect the response for `profile`, `graph`, `recommendedNextAction`, and bounded context sections.
3. If graph state is stale or absent, confirm the response names a recovery action instead of throwing.

### Expected Output / Verification

- Response is non-empty and scoped to the current workspace.
- Response includes graph readiness status or degraded-mode guidance.
- Response names a next action such as `session_resume`, `code_graph_scan`, or direct spec-folder recovery.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: 015
- Tool: `session_bootstrap`
