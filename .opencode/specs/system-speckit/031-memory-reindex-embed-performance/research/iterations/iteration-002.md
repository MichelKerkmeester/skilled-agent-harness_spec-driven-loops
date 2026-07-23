# Iteration 2: Launcher Startup and Warm-Owner Bridge Timing

## Focus

Trace `.opencode/bin/mk-spec-memory-launcher.cjs` from process entry through owner detection, bridge probing, bootstrap locking, daemon spawn, session-proxy attachment, and hf-model-server demand-listener setup. Classify which steps can exceed the observed approximately 1.2-second OpenCode failure window and whether the evidence supports a launcher race, a host timeout mismatch, or both.

## Actions Taken

1. Re-read the externalized research state, strategy, configuration, and iteration 1 to preserve the active lineage and avoid re-investigating the source-write-back caller audit.
2. Traced all startup branches in `main()`, including the live-owner fast path, stale-owner adoption/reap path, no-owner bootstrap path, and child launch/session-proxy path.
3. Traced the bridge's deep-probe timeout/retry policy and the session proxy's independent cold-start readiness loop to assign upper bounds and identify serial waits before the MCP client can complete initialization.
4. Cross-checked demand-listener ordering, the checked-in OpenCode MCP configuration, the locally installed OpenCode SDK schema, and historical OpenCode logs for evidence of one-second-scale bridge retries.

## Findings

### F-005: The warm-owner path performs two serial deep probes before normal host traffic is attached

With strict single-writer mode enabled, `main()` reads/classifies the owner lease and immediately routes a live owner to `bridgeOrReportLeaseHeldAndExit()`; it does not acquire the bootstrap lock, build artifacts, or spawn a daemon on this branch. `maybeBridgeLeaseHolder()` first requires a JSON-RPC `initialize` reply from the existing daemon, then awaits `bridgeStdioThroughSessionProxy()`. The session proxy's `start()` independently calls `waitForDaemonReady()` with another deep `initialize` probe before it attaches a fresh socket and starts forwarding the host's stdin. Thus a warm launch has two serial daemon round-trips before OpenCode's own initialization can complete. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1706-1745] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:936-968] [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:455-486] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:236-248] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:842-865]

The first bridge probe defaults to a 5,000 ms timeout. If it misses, the default policy waits 250 ms and performs a second probe with a 1,500 ms timeout, for a maximum of approximately 6.75 seconds before declaring the owner unresponsive. If it succeeds, the session proxy then begins its own readiness loop; each deep probe uses the same 5,000 ms default and the cold-start policy permits 30 attempts with backoff. Idle daemons normally answer both probes in milliseconds, but an event-loop-busy daemon can legitimately cross 1.2 seconds while remaining within the launcher's own liveness budget. [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:21-23] [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:59-71] [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:174-259] [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:385-407] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:23-30]

Historical OpenCode logs independently show this retry path crossing a one-second boundary: a first `write EPIPE` probe failure is logged at `05:40:09`, while the second consecutive failure is not reported until `05:40:10`. This is not the July incident, but it confirms that one-second-scale warm-owner bridge delay is reachable under real concurrent use rather than merely theoretical. [SOURCE: /Users/michelkerkmeester/.local/share/opencode/log/2026-06-11T054007.log:715] [SOURCE: /Users/michelkerkmeester/.local/share/opencode/log/2026-06-11T054007.log:819]

### F-006: Owner classification contains an unbounded synchronous `ps` call on macOS

Before choosing the live-owner bridge branch, `classifyOwnerLease()` calls `readParentPid()`. On non-Linux platforms this executes `spawnSync('ps', ...)` with no timeout. It is normally short, but it blocks the launcher event loop and has no explicit upper bound; under process-table or system-load contention it is another step that can consume a substantial part of a 1.2-second host window before any bridge probe starts. This is a newly identified startup-latency hazard, although the available logs do not prove it caused the observed incident. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:460-497]

### F-007: Bootstrap-lock contention is a real long wait, but not on the confirmed warm-owner path

`acquireBootstrapLock()` retries once per second for up to 120 seconds. However, when build artifacts are already present and the caller does not require the lock, it returns immediately on contention; only missing artifacts force the startup path to wait. A lock winner can synchronously run `npm ci` plus two workspace builds with no subprocess timeout. These steps can greatly exceed 1.2 seconds during a true cold/missing-dist boot, but they cannot explain an instance that detected and bridged to the independently confirmed live owner, because that branch returns before bootstrap acquisition. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1178-1196] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1427-1457] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1733-1745] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1845-1858]

The stale-owner recovery branch is different: a failed deep probe can lead to reap waits, a respawn lock, and bootstrap acquisition with `requireLock: true`; that recovery can take seconds or minutes. No evidence supplied for this incident says the launcher entered stale-owner recovery, and the confirmed daemon remained healthy, so this is a ruled-out primary explanation for the reported warm-owner failure rather than a general robustness dismissal. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1747-1839] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:874-933]

### F-008: hf-model-server demand-listener setup is not the initial MCP handshake blocker

On a new-owner launch, `main()` awaits session-proxy startup first and invokes `startModelServerDemandListener()` fire-and-forget afterward. On a warm-owner bridge, listener re-arm is awaited only after `maybeBridgeLeaseHolder()` has completed session-proxy attachment, so the MCP forwarding path is already wired. Listener preparation can itself spend up to 1,000 ms probing an existing model-server socket, but its ordering excludes it as the cause of OpenCode failing before the spec-memory MCP connection is established. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1868-1886] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:943-968] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1265-1318] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1368-1438]

### F-009: The launcher/host timeout budgets are misaligned, but the exact OpenCode deadline remains unconfirmed

The incident evidence records OpenCode's `server unavailable` approximately 1.2 seconds after that process's `init` log while the daemon was healthy moments later. That timing is compatible with the serial deep-probe path, but `init` is not a precise timestamp for MCP initialize dispatch, and the current local `opencode.log` no longer contains the July incident. Therefore this iteration does not claim that OpenCode has an exact 1.0- or 1.2-second MCP timeout. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/prompts/iteration-1.md:40]

The installed OpenCode SDK configuration schema exposes `mcp_timeout`, while the repository's `opencode.json` does not set it for the current MCP configuration. This supports a follow-up experiment with a longer host timeout, but the inspected schema surface does not establish the default, whether the value is global or server-specific in the active OpenCode version, or whether startup failures are retried. The minimal robustness direction should first remove the duplicate warm-owner probe or attach the proxy before doing redundant health work; host-side timeout/retry tuning is a complementary safeguard, not a substitute for reducing time-to-first-MCP-byte. [SOURCE: /Users/michelkerkmeester/.config/opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/types.gen.d.ts:1246] [SOURCE: opencode.json:18-45]

### F-010: Novelty relative to iteration 1

Iteration 1 named the launcher as the next focus but did not inspect or characterize its startup sequence. The broad hypothesis that a live-owner IPC round-trip might race OpenCode was already present in the prompt; the duplicate serial deep probes, their approximately 6.75-second first-stage failure budget, the unbounded synchronous macOS `ps`, and the exclusion of bootstrap/demand-listener work from the confirmed warm-owner path are new findings. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-001.md:79-81]

## Questions Answered

1. **Key Question 2: substantively but not fully answered.** The specific warm-owner delay mechanism is two serial deep JSON-RPC probes before host traffic attachment, preceded by an unbounded synchronous macOS `ps`. Any of these can cross 1.2 seconds under contention. Bootstrap locking and model-server listener setup do not fit the confirmed warm-owner incident path. The exact OpenCode timeout/default/retry behavior remains unverified and prevents formally closing the question.

## Questions Remaining

1. What exact `mcp_timeout` default and retry behavior does the active OpenCode version apply, and does its failure timer begin at process spawn, transport creation, or initialize dispatch?
2. Is the model-server socket fallback reachable outside bare-shell invocation, and what short fallback is safest?
3. What holds the SQLite writer lock during the observed long scan stall?
4. Which incremental daemon lease, re-election, and lock-arbitration changes have the best concurrency payoff?

## Sources Consulted

- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/bin/lib/model-server-supervision.cjs`
- `opencode.json`
- `~/.config/opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/types.gen.d.ts`
- `~/.local/share/opencode/log/2026-06-11T054007.log`
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/prompts/iteration-1.md`

## Assessment

- `newInfoRatio`: 0.78
- Novelty justification: the iteration converted a broad timeout-race hypothesis into a branch-specific timing model, identified duplicate serial probes and an unbounded synchronous pre-probe step, and ruled out two plausible but incorrectly ordered causes.
- Confidence: high for launcher ordering and timeout constants; medium-high that bridge delay is the incident class; low for the exact OpenCode timeout/default because its active client implementation and July log were not available in the inspected sources.

## Reflection

- Worked: branch-first tracing prevented cold-start waits from being conflated with the live-owner route actually described by the incident.
- Worked: following both the bridge and session-proxy implementations exposed the duplicate deep probe that is not visible from the launcher alone.
- Ruled out: bootstrap-lock contention as the primary explanation for a confirmed live-owner bridge; the launcher exits to bridging before bootstrap acquisition.
- Ruled out: hf-model-server demand-listener setup as the initial handshake blocker; it runs after session-proxy attachment or fire-and-forget after cold-owner startup.
- Limitation: the available local OpenCode log is historical and the installed SDK exposes configuration shape rather than the active client's timeout implementation.

## SCOPE VIOLATIONS

None. No investigated source or configuration file was modified.

## Next Focus

Trace the active OpenCode MCP client implementation or reproducibly measure its `mcp_timeout` boundary, startup timer origin, and retry behavior, then compare a controlled busy-daemon launch with and without redundant warm-owner probing. If that source is unavailable, move to Key Question 3 rather than repeating launcher code inspection.
