# Iteration 029 — Angle 29

**Angle:** Reconnect parity: mk-code-index bridge/proxy behavior vs mk-spec-memory front-proxy after the 026/007 lifecycle fixes — remaining flap exposure.

**Summary:** mk-code-index has the shared reconnecting proxy for secondary clients, but it is not fully parity-aligned with mk-spec-memory's front-proxy lifecycle. The main remaining exposure is code-index's missing lease socketPath, plus an owner-session direct-stdio gap that should be fixed or explicitly documented.

**Findings kept:** 3

## [P1][BUG] mk-code-index leases do not carry owner socketPath, so divergent socket envs cannot reconnect

- Evidence: .opencode/bin/mk-code-index-launcher.cjs:645-649 writes only {pid, startedAt}; .opencode/bin/lib/launcher-ipc-bridge.cjs:387-399 only prefers leaseResult.socketPath when present, otherwise recomputes from current env; .opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts:355-374 codifies that a no-socketPath code-index/advisor-style lease with absent recomputed socket reports no-bridge-socket.
- Detail: Spec-memory now records the actual owner IPC socket in the launcher lease and the bridge prefers that stored path, which protects reconnect across divergent SPECKIT_IPC_SOCKET_DIR values. Code-index still writes no socketPath, so a secondary launcher/CLI in a different socket env can see the live owner lease but probe the wrong socket, fail to bridge, and flap until timeout or LEASE_HELD_BY reporting.
- Fix sketch: Add socketPath to the mk-code-index launcher lease payload and pass it through owner-lease bridge calls, mirroring the spec-memory lease socketPath behavior.

## [P2][REFINEMENT] mk-code-index owner session is not front-proxied like mk-spec-memory

- Evidence: .opencode/bin/mk-code-index-launcher.cjs:813-840 spawns the code-index child with stdio:'inherit' and exits when the child exits; .opencode/bin/mk-spec-memory-launcher.cjs:1569-1583 launches the child then wraps the owner stdin/stdout with createSessionProxy.
- Detail: Code-index has a reconnecting session proxy for secondary bridge clients, but the primary owner session remains directly attached to the child process. That leaves an owner-session flap exposure that spec-memory's front-proxy avoids: a backend recycle or child exit closes the owner transport instead of reattaching through the proxy.
- Fix sketch: Either front-proxy the code-index owner path through createSessionProxy or document that only secondary code-index clients are reconnect-protected.

## [P2][DOC-DRIFT] Code Graph launcher lease reference describes pre-proxy behavior

- Evidence: .opencode/skills/system-code-graph/references/runtime/launcher_lease.md:37 says a live recorded process prints LEASE_HELD_BY and exits; .opencode/bin/mk-code-index-launcher.cjs:891-913 actually acquires an owner lease and attempts bridgeOrReportLeaseHeld for live owners/held leases.
- Detail: The code graph runtime reference no longer matches the launcher implementation after owner-lease and reconnecting-proxy hardening. This can mislead operators into treating bridge failures as expected lease exits rather than diagnosing the proxy path.
- Fix sketch: Update the reference to include owner lease acquisition, bridgeOrReportLeaseHeld, respawn handling, and the current lease payload limitations.
