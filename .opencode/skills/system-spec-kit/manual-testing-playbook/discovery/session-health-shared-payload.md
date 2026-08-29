---
title: "017 -- Session health shared payload"
description: "Validates session_health reports shared payload freshness and degraded-state recovery hints."
audited_post_017: true
version: 3.6.0.2
id: discovery-session-health-shared-payload
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 017 -- Session health shared payload

## 1. OVERVIEW

This scenario covers the lightweight session health endpoint that operators use before deeper context recovery.

---

## 2. SCENARIO CONTRACT

- Objective: Validate session_health happy path plus stale/degraded messaging.
- Real user request: `Check session_health and tell me whether shared payload status and recovery guidance are visible.`
- Operator prompt: `Run session_health and verify shared payload state, freshness, and recovery hints are reported.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Response includes a health status. - Shared payload freshness is visible. - Degraded state returns guidance, not an opaque failure.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

---

## 3. TEST EXECUTION

### Prompt

```
Run session_health and verify shared payload state, freshness, and recovery hints are reported.
```

### Preconditions

- Run against a warm Spec Kit Memory daemon with current `mcp-server/dist` artifacts.
- If the first call is only a daemon warm-up, discard that output and capture the second `session_health({})` response as evidence.
- If the CLI fallback reports `@spec-kit/mcp-server dist is stale`, classify the scenario as blocked by the runtime artifact state until a build is allowed; do not record that as a `session_health` product failure.

### Commands

1. `session_health({})`
2. Inspect shared-payload producer state and freshness fields.
3. If stale/degraded, confirm the response recommends `session_bootstrap` or equivalent recovery.

### Expected Output / Verification

- Response includes a health status.
- Shared payload freshness is visible.
- Degraded state returns guidance, not an opaque failure.

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
- `.opencode/skills/system-spec-kit/mcp-server/handlers/session-health.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts`

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: 017
- Tool: `session_health`
