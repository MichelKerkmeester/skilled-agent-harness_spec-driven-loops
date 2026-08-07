# Deep Review Report - Scope C Rest Of Server

## Executive Summary
Verdict: CONDITIONAL.

The review stopped at `maxIterationsReached` after the single configured iteration. One active P1 finding was confirmed, with no P0 or P2 findings. The finding affects the daemon-backed IPC configuration contract: client-side code preserves `tcp://` socket endpoints while the daemon-side resolver converts the same env value into a filesystem socket path.

## Planning Trigger
Route to remediation planning before release readiness. A PASS verdict is blocked by active P1 F001 and incomplete review coverage after the one-iteration cap.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| F001 | P1 | correctness | `tcp://` IPC configuration is accepted by clients but ignored by the daemon resolver | `.opencode/bin/spec-memory.cjs:103-114`; `.opencode/bin/lib/launcher-ipc-bridge.cjs:80-88`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2319-2321`; `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:201-211` | active |

## Remediation Workstreams
| Workstream | Findings | Action |
| --- | --- | --- |
| IPC endpoint contract | F001 | Make daemon-side IPC resolution honor `tcp://` endpoints consistently with the CLI/launcher, or remove/reject `tcp://` support consistently across client, launcher, docs, and tests. If TCP remains supported, add explicit loopback/auth perimeter tests. |

## Spec Seed
The server infrastructure spec should require one canonical `SPECKIT_IPC_SOCKET_DIR` interpretation across the CLI shim, daemon-backed CLI, launcher bridge, and daemon listener. It should also state whether TCP endpoints are supported and what trust-boundary restrictions apply.

## Plan Seed
1. Add a regression test that sets `SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:0` through the real context-server bridge startup path and asserts the daemon listener and CLI client use the same endpoint class.
2. Update `resolveIpcSocketPath` or its caller so `tcp://` values are not passed through `path.resolve` and converted to a filesystem path.
3. If TCP remains valid, enforce loopback-only or authenticated binding before enabling daemon tools over TCP.

## Traceability Status
| Protocol | Status | Notes |
| --- | --- | --- |
| spec_code | partial | The scope calls out IPC/socket handling; F001 provides concrete implementation evidence for that slice. |
| checklist_evidence | skipped | No `checklist.md` exists in the scope folder. |
| feature_catalog_code | not-run | Single-iteration cap reached. |
| playbook_capability | not-run | Single-iteration cap reached. |

## Deferred Items
The one-iteration cap left provider retry/failover behavior, most handler envelopes, owner-lease race paths, and shutdown/respawn lifecycle paths only lightly sampled or unsampled by this lineage.

## Audit Appendix
| Field | Value |
| --- | --- |
| Iterations | 1 |
| Stop reason | `maxIterationsReached` |
| Active findings | P0=0, P1=1, P2=0 |
| New findings ratio | 1.00 |
| Dimensions covered | correctness, security |
| Release readiness | in-progress |
| Continuity save | skipped because the fan-out instruction prohibited writes outside the lineage artifact directory |

Replay validation: JSONL state, finding registry, dashboard, iteration narrative, resource map, and this report agree on one active P1 and a CONDITIONAL verdict.
