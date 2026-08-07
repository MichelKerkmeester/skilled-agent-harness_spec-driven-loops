# Deep Review Report — gpt55r2-c-6

## Executive Summary

Verdict: `CONDITIONAL`

This one-iteration lineage reviewed Scope C server infrastructure with emphasis on daemon lifecycle, IPC/socket handling, reconnect/replay, and fail-closed behavior. It found two active P1 findings and no active P0 findings.

| Severity | Active |
| --- | ---: |
| P0 | 0 |
| P1 | 2 |
| P2 | 0 |

`hasAdvisories`: false

## Planning Trigger

The review must route to remediation planning because active P1 findings remain. A PASS verdict requires either closing the TCP IPC contract drift and replay idempotency gap, or explicitly changing the documented contracts and tests to remove the unsafe promise.

## Active Finding Registry

### P1-001 — Spec-memory TCP IPC endpoint is documented and launcher-supported but the server resolver rewrites it into a filesystem path

Severity: P1

Category: `ipc-contract-drift`

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180` documents `SPECKIT_IPC_SOCKET_DIR` as accepting `tcp://host:port`.
- `.opencode/bin/spec-memory.cjs:108` treats `tcp://` as a valid socket setting and returns without creating a directory.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:81` returns the `tcp://` endpoint unchanged for launcher clients.
- `.opencode/bin/lib/model-server-supervision.cjs:444` preserves the same `tcp://` contract for the model server path.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319` starts the backend IPC server with `resolveIpcSocketPath(DATABASE_DIR)`.
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201` path-resolves `SPECKIT_IPC_SOCKET_DIR` and `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:211` appends `daemon-ipc.sock`, so a `tcp://` env value no longer reaches the TCP listen branch at `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:273`.

Impact:
The documented macOS escape hatch for long Unix socket paths can split the launcher/client side from the backend side: clients preserve and dial TCP while the backend resolver derives a filesystem socket path. This is an availability and contract failure in the daemon IPC surface.

Recommendation:
Preserve `tcp://` targets in `resolveIpcSocketPath`, or remove TCP support from the spec-memory contract and bridge. Add an integration test that launches the spec-memory backend with `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:<port>` and proves a client attaches successfully.

### P1-002 — `memory_save` is replayed across backend recycle while the secondary-index write path is explicitly non-idempotent

Severity: P1

Category: `replay-idempotency-gap`

Evidence:
- `.opencode/bin/lib/launcher-session-proxy.cjs:33` includes `memory_save` in `REPLAYABLE_TOOL_NAMES`.
- `.opencode/bin/lib/launcher-session-proxy.cjs:146` says primary-row dedup protects the primary insert, but `.opencode/bin/lib/launcher-session-proxy.cjs:149` through `.opencode/bin/lib/launcher-session-proxy.cjs:152` documents the secondary-index duplicate-row gap.
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts:258` through `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts:287` assert that `memory_save` is replayable.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:184` through `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:186` assert this replay behavior by design.
- `.opencode/skills/system-spec-kit/mcp_server/README.md:266` documents the same known gap for replay after primary insert but before secondary-index writes.

Impact:
A backend recycle in the commit-then-die window can replay a `memory_save` and append duplicate secondary-index rows. The known primary-row dedup does not prove the whole save operation is idempotent. This can inflate retrieval/trigger surfaces or leave the primary record and secondary indexes inconsistent.

Recommendation:
Classify `memory_save` as unsafe/non-replayable until the save path carries an idempotency token through primary and secondary writes, or add unique/dedup constraints for secondary-index rows and a regression test that kills the backend after primary commit but before secondary-index completion.

## Remediation Workstreams

| Workstream | Findings | Required Outcome |
| --- | --- | --- |
| IPC endpoint contract | P1-001 | Spec-memory backend, launcher, CLI, and docs agree on TCP vs Unix socket behavior. |
| Replay idempotency | P1-002 | `memory_save` is either not replayed or is idempotent across all save side effects. |

## Spec Seed

Add acceptance criteria for:
- `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:<port>` works end-to-end for spec-memory backend and launcher clients, or TCP is removed from the documented spec-memory contract.
- Backend recycle replay cannot duplicate secondary-index rows for `memory_save`, or `memory_save` returns a retryable/non-replayed error after backend loss.

## Plan Seed

1. Add failing tests for the TCP IPC env path and commit-then-die `memory_save` replay window.
2. Fix the backend socket resolver or contract docs for `SPECKIT_IPC_SOCKET_DIR`.
3. Add idempotency coverage for secondary-index writes or remove `memory_save` from replayable tools.
4. Run launcher/session-proxy tests plus a targeted durability recycle test.

## Traceability Status

| Protocol | Status | Notes |
| --- | --- | --- |
| spec_code | covered | Scope C mapped to daemon IPC, launcher bridge, session proxy, and docs. |
| checklist_evidence | N/A | Scope packet has no checklist. |
| daemon_lifecycle | covered | Recycle/replay behavior reviewed. |
| ipc_trust_boundary | covered | Socket env and TCP/Unix path behavior reviewed. |
| fail_closed_behavior | covered | Replay classifier and endpoint mismatch reviewed. |

## Deferred Items

- Provider failover and handler error-taxonomy review received lighter coverage because this lineage was capped at one iteration and daemon IPC/replay produced active P1s.
- Runtime reproduction of the commit-then-die window was not run in this lineage; the finding is grounded in current code comments, README, and tests that preserve the behavior.

## Audit Appendix

Stop reason: `maxIterationsReached`

Iterations: 1

Dimension coverage: 4/4

Release readiness state: `in-progress`

Adversarial self-check:
- TCP IPC was not escalated to P0 because `tcp://` is opt-in and the confirmed issue is endpoint contract drift/availability, not default unauthenticated network exposure.
- `memory_save` replay was not escalated to P0 because the duplicate secondary-index condition requires a recycle in a specific write window; the active risk remains P1 data-integrity drift.

Verification targets for remediation:
- TCP endpoint integration test for spec-memory launcher/backend attach.
- Recycle replay regression proving `memory_save` secondary side effects are idempotent or not replayed.

Review verdict: CONDITIONAL
