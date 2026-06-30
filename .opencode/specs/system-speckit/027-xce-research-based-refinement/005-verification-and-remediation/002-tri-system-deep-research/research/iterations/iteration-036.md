# Iteration 036 — Angle 36

**Angle:** Daemon supervision uniformity: launcher watchdog, lease, orphan-reap parity with the spec-memory launcher's hardened behavior.

**Summary:** Spec-memory remains the hardened baseline; code-index and advisor have adopted pieces of the lease/proxy model but still diverge on watchdog/relaunch and have stale docs. The most concrete runtime issue found is code-index’s heartbeat-bearing owner lease without a periodic heartbeat.

**Findings kept:** 5

## [P1][BUG] mk-code-index owner lease heartbeat is non-periodic

- Evidence: .opencode/bin/mk-code-index-launcher.cjs:326-334 defines lastHeartbeatIso + ttlMs=60000; .opencode/bin/mk-code-index-launcher.cjs:380-383 classifies stale-heartbeat-reclaim after ttl*2; .opencode/bin/mk-code-index-launcher.cjs:820-829 refreshes the owner lease only once after spawn; parity contrast: .opencode/bin/mk-spec-memory-launcher.cjs:505-520 has a periodic startOwnerLeaseHeartbeat timer.
- Detail: The code-index launcher writes a heartbeat-bearing owner lease and later uses that heartbeat to decide staleness, but it does not run a periodic owner-lease heartbeat like spec-memory and skill-advisor. A long-running healthy code-index daemon can therefore have its owner lease classified stale after roughly two minutes, causing unnecessary stale-reclaim/bridge churn and weakening the lease as live-owner evidence.
- Fix sketch: Add the same owner-lease heartbeat lifecycle used by spec-memory/advisor, or remove heartbeat-based staleness from code-index owner-lease classification.

## [P1][DOC-DRIFT] Recent skill-advisor lifecycle spec contradicts shipped owner-lease and proxy code

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec.md:65 says mk-skill-advisor has NO owner-lease file and NO reconnecting session proxy; .opencode/bin/mk-skill-advisor-launcher.cjs:73-74 defines .skill-advisor-owner.json; .opencode/bin/mk-skill-advisor-launcher.cjs:207-220 wires bridgeStdioThroughSessionProxy.
- Detail: The recent grounding spec describes the old advisor lifecycle model, but the launcher now has an owner-lease file and a reconnecting session proxy classifier. Tests or future remediation based on that spec will assert the wrong single-owner and client-survival model.
- Fix sketch: Update the phase spec/tasks and related lifecycle docs to describe the current owner-lease plus session-proxy behavior.

## [P2][DOC-DRIFT] Code-graph launcher lease reference still documents legacy LEASE_HELD_BY behavior

- Evidence: .opencode/skills/system-code-graph/references/runtime/launcher_lease.md:37 says a live recorded process prints LEASE_HELD_BY and exits; .opencode/bin/mk-code-index-launcher.cjs:895-907 says it bridges stdio to the owner IPC socket and returns; .opencode/bin/mk-code-index-launcher.cjs:910-914 also bridges when the launcher PID lease is held.
- Detail: The runtime reference under-documents the hardened bridge path that now matches spec-memory client-survival behavior. Operators debugging a duplicate launcher may expect an immediate diagnostic exit instead of a bridged secondary client.
- Fix sketch: Rewrite the code-graph launcher lease reference to mirror the spec-memory lease summary: bridge first, LEASE_HELD_BY only on fallback.

## [P2][REFINEMENT] Watchdog and child-supervision behavior remains intentionally non-uniform

- Evidence: .opencode/bin/mk-spec-memory-launcher.cjs:1290-1317 creates a crash-loop guard and starts the RSS watchdog; .opencode/bin/mk-spec-memory-launcher.cjs:1323-1349 supervises child exits with relaunch/backoff; .opencode/bin/mk-code-index-launcher.cjs:831-840 clears leases and exits on child exit; .opencode/bin/mk-skill-advisor-launcher.cjs:1120-1130 clears leases and exits on child exit.
- Detail: Spec-memory has the hardened watchdog/relaunch path, while code-index and skill-advisor still use exit-on-child-exit semantics. This matches some phase specs, so it is not necessarily a defect, but it is a remaining parity gap for daemon supervision uniformity.
- Fix sketch: Either extract a shared opt-in supervisor/watchdog module for all three launchers or document the non-parity as an explicit supported lifecycle difference.

## [P2][README-MISALIGNMENT] Launcher README calls daemon re-election default-off while ENV reference says default-on

- Evidence: .opencode/bin/README.md:25 says daemon re-election is experimental default-off; .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:179 says SPECKIT_DAEMON_REELECTION default is 1 via committed runtime configs and is enabled by default in .mcp.json, opencode.json, and .codex/config.toml.
- Detail: The README gives stale operator guidance for the most important spec-memory launcher hardening flag. This can lead maintainers to misread live behavior when owner shutdown releases the daemon for adoption.
- Fix sketch: Update .opencode/bin/README.md to state code-default-off but runtime-config-default-on, matching ENV_REFERENCE.
