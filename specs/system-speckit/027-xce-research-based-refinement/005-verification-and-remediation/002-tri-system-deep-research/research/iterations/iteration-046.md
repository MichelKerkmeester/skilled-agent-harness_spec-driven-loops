# Iteration 046 — Angle 46

**Angle:** Cross-session reconnect verification: the owner-lease + reconnecting proxy under multi-session contention.

**Summary:** The owner-lease and reconnecting proxy are substantially implemented, but cross-session contention still has one code-index bridge gap and two material documentation drifts around daemon adoption and memory_save replay semantics.

**Findings kept:** 3

## [P1][BUG] code-index secondary bridge cannot survive divergent socket envs

- Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:387-399 documents preferring a lease-recorded socketPath to avoid divergent SPECKIT_IPC_SOCKET_DIR; .opencode/bin/mk-code-index-launcher.cjs:645-649 writes only pid/startedAt; .opencode/bin/mk-code-index-launcher.cjs:901-906 bridges a live owner without socketPath.
- Detail: The shared bridge has a source-level guard for exactly this contention case: a secondary launcher may have a different SPECKIT_IPC_SOCKET_DIR and must use the owner-recorded socket. mk-spec-memory and mk-skill-advisor record socketPath, but mk-code-index does not, so a secondary session recomputes its own socket path and can fail to bridge to a live owner.
- Fix sketch: Add socketPath to the code-index launcher lease payload and thread it through leaseHeldFromFile/owner-lease bridge results, matching spec-memory and skill-advisor.

## [P1][README-MISALIGNMENT] daemon re-election docs still describe reap/respawn instead of adoption

- Evidence: .opencode/skills/system-spec-kit/mcp_server/README.md:269 says a fresh session reaps the released daemon before respawn; .opencode/bin/mk-spec-memory-launcher.cjs:1498-1512 adopts a live released daemon via bridge; .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:235-247 asserts same-pid adoption.
- Detail: The implementation now adopts a still-live released daemon, preserving the warm daemon and avoiding a teardown. The README and ENV reference wording still claims fresh-session reap/respawn, which is materially false for operators debugging multi-session contention.
- Fix sketch: Update daemon re-election documentation to say fresh sessions adopt bridgeable live released daemons and only reap/respawn when the daemon is dead or unbridgeable.

## [P1][DOC-DRIFT] memory_save replay is documented as idempotent despite an admitted duplicate-index gap

- Evidence: .opencode/skills/system-spec-kit/mcp_server/README.md:262 says the proxy transparently replays idempotent-write tools and memory_save is replayable via primary-row dedup; .opencode/bin/lib/launcher-session-proxy.cjs:146-153 states a commit-then-die replay can append duplicate secondary-index rows because that path lacks an idempotency token.
- Detail: The code does replay memory_save, but the source explicitly limits the idempotency guarantee to the primary row and calls out duplicate secondary-index rows as a known gap. The documentation overstates the guarantee, which can hide derived-index duplication after backend recycle under contention.
- Fix sketch: Either remove memory_save from replayable tools until secondary indexing is idempotent, or document the partial-idempotency caveat and add a request-id/idempotency token through the save path.
