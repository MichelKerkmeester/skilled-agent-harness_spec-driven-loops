# Deep Review Strategy — gpt55r2-c-6

## Topic

Review R2 lineage `gpt55r2-c-6`: MCP server infrastructure outside search/store scope.

## Review Dimensions

| Dimension | Status | Notes |
| --- | --- | --- |
| Correctness | covered | Found two active P1 correctness/data-integrity contract risks. |
| Security | covered | Reviewed IPC/socket trust boundary; no default-exposure P0 confirmed. |
| Traceability | covered | Mapped Scope C emphasis to daemon IPC and reconnect/replay files. |
| Maintainability | covered | Findings are contract drift and known-gap debt requiring tests. |

## Completed Dimensions

| Dimension | Verdict |
| --- | --- |
| correctness | CONDITIONAL |
| security | PASS |
| traceability | CONDITIONAL |
| maintainability | CONDITIONAL |

## Running Findings

| Severity | Active | Delta |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 2 | +2 |
| P2 | 0 | 0 |

## What Worked

- Cross-checking env reference, CLI launcher behavior, backend socket resolver, and tests exposed contract drift that single-file review would miss.
- Reading the replay classifier beside tests and README separated intentional replay behavior from its documented idempotency gap.

## What Failed

- No full runtime recycle reproduction was run in this lineage because `maxIterations` was fixed at 1.
- `context-server.js` in the scope spec is drifted; the live file is `context-server.ts`.

## Exhausted Approaches

- Treating `memory_save` replay as safe solely because primary-row dedup exists is exhausted; secondary-index idempotency remains unproven and explicitly documented as a gap.

## Ruled-Out Directions

- P0 for TCP IPC was ruled out because the endpoint is opt-in and the confirmed issue is spec-memory endpoint mismatch, not a default network bind.
- P0 for save replay was ruled out because duplicate secondary rows require a backend recycle in a commit-then-die window rather than occurring on every save.

## Next Focus

Plan remediation for P1-001 and P1-002, then run targeted tests for TCP IPC startup and commit-then-die `memory_save` replay.

## Known Context

- Scope C excludes search pipeline and store/index/lifecycle review, but includes MCP server request handlers, embedding providers, daemon launcher, IPC, secondary-client management, reconnect/respawn, and fail-closed behavior.
- The operator bound this lineage directly to `review-r2/lineages/gpt55r2-c-6` and explicitly prohibited `resolveArtifactRoot`.

## Cross-Reference Status

| Protocol | Status | Evidence |
| --- | --- | --- |
| spec_code | covered | Scope lines 7-14 mapped to reviewed daemon/IPC/replay files. |
| checklist_evidence | N/A | Scope packet has no checklist; iteration uses file:line evidence. |
| daemon_lifecycle | covered | Recycle/replay path reviewed in launcher session proxy and durability tests. |
| ipc_trust_boundary | covered | Socket env, CLI bridge, model server, and backend IPC resolver reviewed. |
| fail_closed_behavior | covered | Replayable-vs-unsafe classifier and endpoint mismatch reviewed. |

## Files Under Review

| File | Coverage | Notes |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | read | Backend starts IPC server through `resolveIpcSocketPath(DATABASE_DIR)`. |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | read | TCP listen branch exists, but resolver rewrites env tcp targets. |
| `.opencode/bin/spec-memory.cjs` | read | CLI accepts tcp socket dir without directory creation/path-length check. |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | read | Launcher bridge returns tcp env target unchanged. |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | read | `memory_save` included in replayable set despite documented known gap. |
| `.opencode/bin/lib/model-server-supervision.cjs` | read | Model server socket resolver preserves tcp env target. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | read | Documents `SPECKIT_IPC_SOCKET_DIR` accepting tcp endpoints. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | read | Documents replay known gap. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts` | read | Tests assert `memory_save` is replayable. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts` | read | Stress test asserts `memory_save` replay design. |

## Review Boundaries

| Boundary | Value |
| --- | --- |
| Max iterations | 1 |
| Severity threshold | P2 |
| Artifact dir | `review-r2/lineages/gpt55r2-c-6` |
| Target mutation | none |
