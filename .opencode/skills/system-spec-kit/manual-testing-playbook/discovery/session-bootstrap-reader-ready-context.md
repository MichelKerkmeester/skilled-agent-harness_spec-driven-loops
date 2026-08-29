---
title: "015 -- Session bootstrap reader-ready context"
description: "Validates session_bootstrap returns bounded startup context and clear graph-readiness messaging."
audited_post_017: true
version: 3.6.0.2
id: discovery-session-bootstrap-reader-ready-context
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 015 -- Session bootstrap reader-ready context

## 1. OVERVIEW

This scenario covers the session_bootstrap orchestration surface added to make non-hook runtimes reader-ready without manual context spelunking.

---

## 2. SCENARIO CONTRACT

- Objective: Validate session_bootstrap happy path and degraded graph messaging.
- Real user request: `Validate session_bootstrap on the current workspace and tell me whether it returns reader-ready context plus graph readiness.`
- Operator prompt: `Run session_bootstrap for the current workspace and verify it returns bounded context, graph readiness, and next-action guidance.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

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

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the handler or script listed in section 4 is the one actually loaded, and that any compiled output under `dist/` is current for it.
3. Compare the observed response field by field against the Expected block, and quote the first field that disagrees.


### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- `.opencode/skills/system-spec-kit/mcp-server/handlers/session-bootstrap.ts`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: 015
- Tool: `session_bootstrap`
