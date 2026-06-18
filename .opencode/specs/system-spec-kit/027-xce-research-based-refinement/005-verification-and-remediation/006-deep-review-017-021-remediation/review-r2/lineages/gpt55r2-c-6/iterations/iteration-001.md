# Iteration 001 — C-rest-of-server daemon IPC and replay review

## Focus

Reviewed Scope C MCP server infrastructure outside search pipeline and store/index/lifecycle surfaces, emphasizing daemon lifecycle races, IPC socket/path handling, reconnect/replay, and fail-closed behavior.

## Files Reviewed

| File | Reason |
| --- | --- |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md` | Scope source of truth. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Backend MCP server and IPC bridge startup. |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | IPC socket path resolution and TCP/Unix listening behavior. |
| `.opencode/bin/spec-memory.cjs` | Daemon-backed CLI front door socket setup. |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Launcher client/probe socket target resolution. |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Reconnect/replay classifier and pending request replay. |
| `.opencode/bin/lib/model-server-supervision.cjs` | Model server socket target comparison path. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Published env contract. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Published daemon/recycle behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts` | Replay classifier regression coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts` | Durability stress coverage for replay partition. |

## Findings

### P1-001 — Spec-memory TCP IPC endpoint is documented and launcher-supported but the server resolver rewrites it into a filesystem path

Category: `ipc-contract-drift`

Dimension: correctness, traceability

Status: active

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:180` documents `SPECKIT_IPC_SOCKET_DIR` as accepting `tcp://host:port`.
- `.opencode/bin/spec-memory.cjs:108` treats `tcp://` as valid and skips directory setup.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:81` returns a `tcp://` env target unchanged for launcher clients.
- `.opencode/bin/lib/model-server-supervision.cjs:444` preserves `tcp://` for the model server socket path, confirming the broader contract.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319` starts the spec-memory backend IPC server with `resolveIpcSocketPath(DATABASE_DIR)`.
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201` through `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:211` path-resolve `SPECKIT_IPC_SOCKET_DIR` and append `daemon-ipc.sock`, which means a `tcp://` value no longer reaches the TCP listen branch at `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:273` through `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:276`.

Why this matters:
The published macOS workaround for long Unix socket paths can leave launcher clients dialing TCP while the backend attempts a derived Unix socket path. That breaks daemon attach/reconnect in exactly the socket-path failure mode the env option is supposed to solve.

Recommendation:
Preserve `tcp://` targets in `resolveIpcSocketPath`, or remove TCP support from the spec-memory env contract and launcher. Add a regression test that launches the backend and client with `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:<port>`.

### P1-002 — `memory_save` is replayed across backend recycle while the secondary-index write path is explicitly non-idempotent

Category: `replay-idempotency-gap`

Dimension: correctness, maintainability

Status: active

Evidence:
- `.opencode/bin/lib/launcher-session-proxy.cjs:33` through `.opencode/bin/lib/launcher-session-proxy.cjs:39` include `memory_save` in `REPLAYABLE_TOOL_NAMES`.
- `.opencode/bin/lib/launcher-session-proxy.cjs:146` through `.opencode/bin/lib/launcher-session-proxy.cjs:153` state that primary-row dedup protects the primary insert but the secondary index can append duplicate rows after replay because no idempotency token keys that path.
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts:258` through `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts:287` assert that `memory_save` is replayable.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:184` through `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:186` assert `memory_save` replay is by design.
- `.opencode/skills/system-spec-kit/mcp_server/README.md:266` documents the same duplicate secondary-index row gap during replay.

Why this matters:
Replay safety is only proven for the primary row. The same operation still has secondary side effects that can duplicate after a backend recycle in the commit-then-die window, creating retrieval/index inconsistency.

Recommendation:
Either remove `memory_save` from the replayable tool set until the full save path is idempotent, or thread an idempotency token through the save handler and secondary-index writes. Add a commit-then-die recycle regression test that proves secondary rows do not duplicate.

## Adversarial Self-Check

No P0 was recorded.

TCP IPC P0 check:
- Hunter: `tcp://0.0.0.0:<port>` could expose unauthenticated MCP IPC if supported naively.
- Skeptic: The confirmed current bug is that spec-memory backend does not preserve TCP, and `tcp://` is opt-in rather than default.
- Referee: Keep as P1 availability/contract drift; include security-conscious remediation test for host binding if TCP support is fixed.

`memory_save` replay P0 check:
- Hunter: Duplicate secondary rows can corrupt retrieval surfaces after recycle.
- Skeptic: The condition requires a backend death after primary commit but before secondary-index writes, not every save.
- Referee: Keep as P1 data-integrity risk requiring remediation before PASS.

## Traceability

| Scope Requirement | Coverage |
| --- | --- |
| Daemon lifecycle races | Covered via session proxy replay and recycle stress tests. |
| IPC trust boundaries | Covered via socket env resolver, launcher bridge, and TCP branch. |
| Fail-closed behavior | Covered via replayable/unsafe classifier and endpoint mismatch. |
| Provider/handler surfaces | Light pass only; no finding recorded in this capped iteration. |

Review verdict: CONDITIONAL
