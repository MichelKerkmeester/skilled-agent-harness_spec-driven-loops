# Deep Review Report

## Executive Summary

- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Iterations: 1
- Active findings: P0=0, P1=2, P2=0
- hasAdvisories: false
- Scope: MCP server infrastructure outside search/store scopes, focused on daemon IPC, launcher bridge/session proxy, model-server supervision, request-handler boundary, and provider retry samples.
- Release readiness: in-progress

## Planning Trigger

The review found two active P1 correctness defects in the daemon IPC/session-proxy surface. Route to remediation planning before release because the TCP IPC mode is currently split between client and server behavior, and a backend recycle can replay `memory_save` across a documented non-idempotent secondary-index gap.

## Active Finding Registry

| ID | Severity | Status | Dimension | Finding | Evidence |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | active | correctness | TCP IPC endpoint is resolved as a filesystem path on the server. | `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211`; `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-83`; `.opencode/bin/spec-memory.cjs:107-113` |
| F002 | P1 | active | correctness | Session proxy replays `memory_save` despite a documented non-idempotent secondary-index gap. | `.opencode/bin/lib/launcher-session-proxy.cjs:33-47`; `.opencode/bin/lib/launcher-session-proxy.cjs:146-153`; `.opencode/bin/mk-spec-memory-launcher.cjs:291-299` |

## Remediation Workstreams

| Workstream | Findings | Action |
| --- | --- | --- |
| IPC endpoint contract | F001 | Make server-side `resolveIpcSocketPath()` preserve `tcp://` values before filesystem canonicalization, then add CLI/server TCP integration coverage. |
| Replay idempotency | F002 | Either remove `memory_save` from replayable tools or thread a request idempotency token through primary and secondary save/index writes with commit-then-die regression coverage. |

## Spec Seed

- Require `SPECKIT_IPC_SOCKET_DIR=tcp://host:port` to have one identical interpretation across server resolver, launcher bridge, CLI shim, and model-server supervision.
- Require the session proxy replay allowlist to include only operations whose complete side effects are idempotent, including secondary indexes and metadata writes.

## Plan Seed

1. Add a failing test showing `resolveIpcSocketPath()` returns `tcp://127.0.0.1:NNNN` unchanged when `SPECKIT_IPC_SOCKET_DIR` starts with `tcp://`.
2. Patch the server resolver to fast-path TCP endpoints before `path.resolve()` and allowed-root checks.
3. Add an integration or unit test proving the CLI bridge and server bind/probe the same TCP endpoint.
4. Remove `memory_save` from `REPLAYABLE_TOOL_NAMES` or implement request-id based idempotency across secondary index writes.
5. Add a replay regression where the backend dies after primary save commit but before secondary index completion.

## Traceability Status

| Protocol | Status | Gate | Notes |
| --- | --- | --- | --- |
| spec_code | partial | hard | Two implementation defects found in the requested daemon IPC/launcher scope. |
| checklist_evidence | N/A | hard | Scope folder contains no checklist.md. |
| feature_catalog_code | not covered | advisory | Max iteration cap reached. |
| playbook_capability | not covered | advisory | Max iteration cap reached. |

## Deferred Items

- Request-handler error taxonomy and envelope consistency were sampled only at the boundary and should receive another focused pass.
- Provider failover and retry-manager lifecycle were sampled but not exhaustively reviewed before the one-iteration cap.
- Maintainability dimension remains incomplete.

## Audit Appendix

### Iteration Table

| Iteration | Focus | Verdict | P0 | P1 | P2 | Ratio |
| ---: | --- | --- | ---: | ---: | ---: | ---: |
| 001 | correctness/security/IPC lifecycle | CONDITIONAL | 0 | 2 | 0 | 1.00 |

### Convergence Replay

- Max iterations reached: yes, `config.maxIterations=1`.
- Rolling average: insufficient history.
- MAD noise floor: insufficient history.
- Dimension coverage: 3/4 dimensions covered.
- Required protocols: `spec_code` partial; `checklist_evidence` N/A.
- Legal stop: terminal stop by hard max-iteration cap, not convergence.

### Evidence Replay

- F001 evidence re-read: server resolver lines 201-211, bridge lines 80-83, CLI shim lines 107-113.
- F002 evidence re-read: proxy replay allowlist lines 33-47, known gap comment lines 146-153, launcher proxy wiring lines 291-299.

### File Coverage Matrix

| File | Covered |
| --- | --- |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | yes |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` | yes |
| `.opencode/bin/spec-memory.cjs` | yes |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | yes |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | yes |
| `.opencode/bin/lib/model-server-supervision.cjs` | sampled |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/embeddings.ts` | sampled |

### Final Verdict

CONDITIONAL
