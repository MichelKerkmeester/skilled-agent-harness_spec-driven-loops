# Iteration 047 — Angle 47

**Angle:** Tri-daemon lifecycle uniformity: re-election, leases, orphan reaping, persistent logs — behavior matrix across the three launchers and drift between them.

**Summary:** The strongest issues are documentation drift: code-index and skill-advisor runtime references still describe legacy lease refusal paths while the code now bridges and respawns. Actual lifecycle behavior is intentionally non-uniform: spec-memory has re-election and persistent logs; code-index and advisor do not.

**Findings kept:** 3

## [P1][DOC-DRIFT] Code-index launcher lease doc still describes legacy exit-on-lease behavior

- Evidence: .opencode/skills/system-code-graph/references/runtime/launcher_lease.md:37 claims a live lease prints LEASE_HELD_BY and exits; .opencode/bin/mk-code-index-launcher.cjs:630-640 bridges through the session proxy and may respawn; .opencode/bin/mk-code-index-launcher.cjs:895-913 documents the live-owner bridge path in code.
- Detail: The code-index launcher now behaves like a reconnecting daemon front door for secondary clients, not a simple PID-file refusal path. Operators reading the code-graph runtime reference get materially wrong guidance for live leases, bridge behavior, and dead-socket recovery.
- Fix sketch: Update the code-graph launcher lease reference with the owner lease, bridge/proxy, deep-probe, and respawn matrix.

## [P1][DOC-DRIFT] Skill-advisor daemon lease contract omits launcher owner-lease bridge and respawn behavior

- Evidence: .opencode/skills/system-skill-advisor/references/runtime/daemon_lease_contract.md:44-50 says the launcher calls lib/daemon/lease and exits with LEASE_HELD_BY; .opencode/bin/mk-skill-advisor-launcher.cjs:692-704 bridges or respawns via maybeBridgeLeaseHolder; .opencode/bin/mk-skill-advisor-launcher.cjs:708-715 enforces the JS owner lease first; .opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:365-399 and :430-449 lock bridge and respawn behavior.
- Detail: The advisor reference describes the old freshness-daemon lease lifecycle, while the current launcher has a separate owner lease, session proxy bridge, childPid lease payload, and dead-socket respawn path. This is materially false for troubleshooting contention or orphan recovery.
- Fix sketch: Rewrite the advisor daemon lease contract around the current launcher owner lease plus the package daemon lease, with separate rows for bridge, stale reclaim, dead-socket respawn, and child reaping.

## [P2][REFINEMENT] Re-election and persistent launcher logs are not tri-daemon uniform

- Evidence: .opencode/bin/mk-spec-memory-launcher.cjs:137-152 implements persistent launcher logs and :188-205 implements SPECKIT_DAEMON_REELECTION; .opencode/bin/mk-spec-memory-launcher.cjs:1375-1396 releases a detached daemon for adoption; .opencode/bin/mk-code-index-launcher.cjs:849-865 kills child and exits on signals; .opencode/bin/mk-skill-advisor-launcher.cjs:1149-1164 kills child and exits on signals; opencode.json:27-28 sets SPECKIT_DAEMON_REELECTION only for mk-spec-memory.
- Detail: Single-writer leases and bridging exist across all three launchers, but the lifecycle hardening matrix is uneven: only spec-memory has detached re-election and durable launcher logs. Code-index and skill-advisor intentionally use fresh-session reload semantics today, but the drift makes incidents harder to compare across daemons.
- Fix sketch: Either document an explicit tri-daemon lifecycle matrix or extract shared persistent-log and optional re-election primitives into the common launcher layer.
