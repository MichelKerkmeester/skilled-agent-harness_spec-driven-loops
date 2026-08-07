# Iteration 7: Final Hardening Rank and Runtime-Context Feasibility

## Focus

Re-rank every concrete hardening item established in iterations 1-6 using iteration 6's corrected lease-race severity, test whether the proposed canonical runtime context envelope can begin as a small shippable change, and decide whether any remaining question would materially change the conclusions.

## Actions Taken

1. Re-read all six iteration narratives, their `Questions Remaining` sections, the canonical state log, and the findings registry.
2. Re-ranked the hardening work by demonstrated impact, incident relevance, implementation cost, and dependency risk rather than preserving iteration 5's ordering.
3. Traced the current readiness-probe handoff and model-socket resolver/export/plugin-env seams to identify changes that can ship independently.
4. Classified the remaining questions as conclusion-changing, implementation-detail, or evidence-unavailable.

## Findings

### 1. Definitive hardening order

1. **Collapse duplicate warm-owner probes and bound startup-critical process inspection (high availability impact, low-medium cost).** Pass the successful lease-holder readiness result into the session proxy instead of immediately running a second deep `initialize` probe; then coalesce concurrent per-socket probes, cap probe concurrency, and put a timeout around Darwin `ps`. This remains number 1 because it directly explains the observed MCP startup failure class, consumes the same host timeout budget on every warm launch, and does not depend on changing lease or storage semantics. [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:455-485] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:236-248] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:842-865] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:460-497]
2. **Make async ingest explicitly non-persisting and add a source-immutability regression test (medium-high integrity impact, low cost).** Pass an explicit non-persisting origin from the async ingest callback so queued and crash-replayed ingest cannot write quality-loop fixes back to source documents. This moves above all lease work because it is the only confirmed residual source-mutation defect, is replayed after crashes, and has a narrow implementation boundary. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-001.md:17-37] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-003.md:44-48]
3. **Route maintenance scans to the existing background job/status/cancel path by default (medium-high operability impact, low cost).** This directly removes the observed 30-minute no-response experience without changing the process-lifetime writer lock. It ranks above election redesign because the progress infrastructure already exists and the symptom was observed; provider-level deadlines remain conditional on identifying an actual unresolved provider branch. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:2081-2147] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-scan-jobs.ts:41-142]
4. **Fence owner-lease stale removal and heartbeat replacement (moderate availability impact, medium cost).** Re-read under the existing election/respawn lock, retain the lock through classify/remove/create, and add a `leaseId` or generation required by refresh/release/cleanup. This falls from iteration 5's number 2/high-impact position to number 4: iteration 6 proved both races, but also proved that live-daemon bridging, respawn-lock revalidation, and the SQLite sidecar `fcntl` lock keep the shown interleavings from becoming two database writers. The benefit is less startup churn and more reliable discovery metadata, not demonstrated data-loss prevention. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-006.md:9-36] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-006.md:64-74]
5. **Replace the model-server empty-environment fallback with one short, dbDir-independent default (medium latent availability impact, low cost).** Define and export a canonical `/tmp/mk-hf-embed/hf-embed.sock` default in `model-server-supervision.cjs`, retain explicit URL/socket-directory precedence, and update the cross-launcher resolver test. It is below lease fencing because normal MCP and CLI paths already supply short targets and advisor model supervision is normally default-off, but the current exported resolver is invalid by construction for a real plugin boundary. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:469-478] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1465-1517] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:171-180]
6. **Add structured transition timing and authority diagnostics (supporting impact, low cost).** Record classify/probe/adopt/respawn-lock/exit-86/background-scan phase timings and the lease generation once one exists. This cannot correct arbitration, but it is now the prerequisite for measuring lease-race frequency, locating an exceptional long scan phase, and separating host timeout from daemon latency without another evidence-poor incident. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-004.md:41-57] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-006.md:88-100]
7. **Separate launcher cleanup from live-daemon discovery metadata; defer daemon-owned supervision until lifecycle design is complete (moderate availability impact, medium-high cost).** A launcher-only exception should not erase a live detached daemon's descriptor. Moving the heartbeat/runtime descriptor fully into the backend or transferring renewable supervision to an adopter remains plausible, but idle self-exit and proxy-disconnect semantics are not yet designed. This drops below observability and the bounded direct fixes because release-for-discovery is data-safe and a full authority transfer has unresolved lifecycle behavior. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1622-1644] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1692-1717] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-006.md:56-62]
8. **Treat the canonical runtime context envelope as a migration direction, not a standalone implementation item (preventive impact, cross-cutting cost).** Its useful fields are real, but scheduling one envelope spanning resolved paths, readiness, indexing origin, foreground/background mode, and ownership generation would combine unrelated runtimes and failure domains. The measurable pieces are already represented by items 1, 2, 4, and 5; a shared type should be introduced only after at least two consumers genuinely share the same boundary contract.

This ordering intentionally excludes two premature fixes. Raising OpenCode's `mcp_timeout` is not ranked until the active client's default, timer origin, and retry semantics are known; it would also mask rather than remove duplicate launcher work. A whole-scan hard timeout is not ranked until provider cancellation propagates, because returning while an unabortable operation continues would misreport ownership and completion. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-002.md:38-42] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-004.md:51-57]

### 2. The canonical runtime context envelope is too broad for one PR

The proposal is a sound diagnosis but not yet a concrete implementation unit. Readiness evidence currently crosses CJS callbacks between `maybeBridgeLeaseHolder()`, a launcher wrapper, and `createSessionProxy()`; model socket authority sits in a different CJS module; the advisor bridge is ESM and filters environment variables; indexing origin and scan execution mode are TypeScript tool semantics. A single envelope would need versioning, ownership rules, serialization decisions, and compatibility behavior before it could safely span those boundaries. [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:410-486] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:318-327] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:374-397] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:208-241]

Two independent first steps make measurable progress without creating that abstraction:

1. **Ship a one-use readiness receipt from bridge probe to session proxy.** Have `maybeBridgeLeaseHolder()` pass its successful probe result to the injected bridge callback, have `bridgeStdioThroughSessionProxy()` forward it as `initialReadiness`, and make `createSessionProxy().start()` skip only its initial `waitForDaemonReady()` when that receipt is alive for the same socket. Reattach paths must continue probing normally. Tests can assert one deep probe instead of two on a warm-owner bridge and unchanged probing on cold start/reattach. This is a small runtime-context slice with an objective result: one fewer pre-attachment JSON-RPC round trip. [SOURCE: .opencode/bin/lib/launcher-ipc-bridge.cjs:463-485] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:318-327] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:374-387] [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:842-865] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts:314-368]
2. **Ship one canonical model-socket fallback at its existing authority.** Add exported `DEFAULT_MODEL_SERVER_SOCKET_DIR` and `DEFAULT_MODEL_SERVER_SOCKET_PATH` constants to `model-server-supervision.cjs`; make the empty-env resolver use that path instead of `options.dbDir`; update the existing cross-launcher test to assert the exact default and Darwin-safe byte length. Do not make the plugin's `createChildEnv()` set `SPECKIT_IPC_SOCKET_DIR` to the model directory: that variable also determines the advisor daemon IPC directory, whose current short default is `/tmp/mk-skill-advisor`, so doing so would conflate two socket authorities. If explicit propagation is later needed, forward `HF_EMBED_SERVER_URL` separately; the resolver-level default already fixes omission safely. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:37-40] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:469-478] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1465-1517] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:49-91] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:214-241]

### 3. Closing check: the research is substantively complete

The repeated `Questions Remaining` review leaves three empirical unknowns, none of which changes the ordered conclusions:

- The active OpenCode `mcp_timeout` default, retry behavior, and timer origin remain unknown. They can determine whether a complementary host configuration change is useful, but they do not make duplicate serial probes desirable or displace item 1. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-002.md:48-57]
- The exact exceptional phase of the 30-minute foreground scan remains unknown because that path persisted no phase record. This blocks naming a provider-specific timeout, but it strengthens rather than weakens item 3's background status/cancel recommendation. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-004.md:30-49]
- Lease-race runtime frequency and durable-supervision lifecycle details remain unmeasured. That uncertainty is now reflected in items 4, 6, and 7 rather than being used to inflate severity. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-006.md:64-74] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/iterations/iteration-006.md:88-100]

All five original key questions have enough direct code evidence to choose and order follow-up work. The reducer-owned registry still marks them unresolved, but that is stale workflow projection state, not a substantive evidence gap; this LEAF iteration does not mutate reducer-owned files. Without a new runtime log, a controlled host-timeout experiment, or scan-phase telemetry, iterations 8-10 would only re-read the same code and re-confirm established mechanisms. The honest conclusion is that this research has reached substantive convergence and should proceed to workflow synthesis/implementation planning rather than spend the remaining iteration allowance.

## Sources Consulted

- `research/iterations/iteration-001.md` through `iteration-006.md`
- `research/deep-research-state.jsonl`
- `research/deep-research-strategy.md`
- `research/findings-registry.json`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/model-server-supervision.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-scan-jobs.ts`

## Assessment

- `newInfoRatio`: 0.34
- Novelty justification: this iteration materially corrected the final ordering, converted the broad envelope proposal into two testable PR-sized handoffs, and identified why reusing `SPECKIT_IPC_SOCKET_DIR` for the model default would conflate daemon and model socket authority.
- Confidence: high for the ranking's mechanism and dependency ordering; high for the two concrete code seams; medium for real-world lease frequency and exact host/scan timing because the required runtime telemetry does not exist.

## Reflection

- Worked: ranking by observed impact, integrity boundary, cost, and evidence quality prevented the real lease races from retaining an overstated integrity priority.
- Worked: tracing actual callback and export boundaries showed that a readiness receipt and a resolver constant can deliver envelope benefits without inventing a cross-runtime object.
- Failed/unavailable: `memory_match_triggers` timed out, the active OpenCode timeout implementation was not available in the packet evidence, and the foreground scan produced no phase record.
- Ruled out: a single cross-subsystem envelope PR; setting the plugin's daemon `SPECKIT_IPC_SOCKET_DIR` to the model socket directory; replacing the SQLite sidecar lock; ranking host timeout or scan timeout changes without their missing prerequisites.

## Recommended Next Focus

Stop iterative evidence gathering and let the workflow synthesize the research. Implementation planning should start with the one-use readiness receipt, async-ingest non-persisting origin, and background-scan default as separate bounded changes; preserve the SQLite sidecar lock as the final writer-integrity boundary.

## SCOPE VIOLATIONS

None. No researched source, reducer-owned state projection, or implementation file was modified.
