---
title: "424 -- MCP Code Index Reconnecting Proxy"
version: 3.6.0.2
id: pipeline-architecture-mcp-code-index-reconnecting-proxy
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 424 -- MCP Code Index Reconnecting Proxy

## 1. OVERVIEW


The check is automated-test-backed. A human runs the launcher syntax check, the code-index proxy unit suite, and a grep that proves the session-proxy bridge and the frame classifier are defined and wired into the launcher transport. Together they confirm the launcher routes stdio through the reconnecting proxy and understands the frames it forwards.

## 2. SCENARIO CONTRACT

- Expected execution process: Run the launcher syntax check, run the code-index proxy unit tests, and grep for the session-proxy bridge and the frame classifier to confirm they are defined and wired into the transport path.
- Expected signals: `node --check` exits cleanly for the launcher. `launcher-code-index-proxy.vitest.ts` passes including the bridge and frame-classification cases. `bridgeStdioThroughSessionProxy` and `classifyCodeIndexFrame` appear at their definitions and at the transport call site.
- Desired user-visible outcome: The code-index client keeps its transport across daemon recycles and owner-session churn instead of silently disconnecting.
- Pass/fail: PASS only when syntax, unit tests, and proxy wiring all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
```

### Commands

2. `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/launcher-code-index-proxy.vitest.ts`

### Expected

- Command 1 exits with no syntax errors.
- Command 2 passes the code-index proxy suite, including the stdio-bridge case and the frame-classification case.
- Command 3 shows `bridgeStdioThroughSessionProxy` and `classifyCodeIndexFrame` at their definitions and at the transport call site that bridges stdio and classifies forwarded frames.

### Evidence

Shell transcript for all commands:

```text
(no output)
Exit status: 0
```

```text
$ cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/launcher-code-index-proxy.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  15:04:41
   Duration  81ms (transform 13ms, setup 12ms, import 9ms, tests 2ms, environment 0ms)

Exit status: 0
```

```text
233:const classifyCodeIndexFrame = createClassifyFrame({
241:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
248:    classify: classifyCodeIndexFrame,
897:  await Promise.resolve(bridgeStdioThroughSessionProxy(socketPath));
1162:    bridge: bridgeStdioThroughSessionProxy,
1769:  classifyCodeIndexFrame,
1770:  bridgeStdioThroughSessionProxy,
Exit status: 0
```

### Pass / Fail

- **PASS**: the syntax check passed, the code-index proxy suite passed, and both the session-proxy bridge and the frame classifier are defined and wired into the transport path.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the bridge case fails, confirm the launcher routes stdio through the session proxy rather than a raw pass-through pipe. If the frame-classification case fails, compare the classifier output against the expected frame types it forwards. If grep cannot find the helpers, confirm both the definitions and the transport call site exist.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/pipeline-architecture/mcp-code-index-reconnecting-proxy.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Shared classify-frame factory anchor |
| `mcp-server/tests/launcher-code-index-proxy.vitest.ts` | Regression or validation anchor |

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 424
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pipeline-architecture/mcp-code-index-reconnecting-proxy.md`
