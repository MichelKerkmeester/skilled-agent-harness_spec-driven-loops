# Risk Closure Fan-Out Synthesis: gpt-closure

Session: `fanout-gpt-closure-1780747019655-imm3qh`

Artifact root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/risk-closure/lineages/gpt-closure`

Executor metadata: `cli-codex model=gpt-5.5`

Loop result: converged after 4 iterations, before `config.maxIterations=20`.

## Verdict

All remaining mitigated, deferred, and hedged items for the spec-memory dual-stack CLI are terminally classified. No unknown risk class remains inside the dual-stack scope.

The accepted implementation direction remains: keep the daemon/MCP path, add a public CLI shim over the existing daemon/IPC bridge, and do not pursue pure per-invocation CLI or MCP removal in this packet.

## Terminal Classifications

| Question | Classification | Reason |
| --- | --- | --- |
| RQ1 spawn/lease races | terminal MITIGATED | Launcher owner lease, bootstrap lock, respawn lock, heartbeat revalidation, and idle cleanup already close the daemon lifecycle risk; D1 and D7 are acceptance-test deltas for the new CLI path. |
| RQ2 hook latency | terminal MITIGATED | Warm CLI process overhead measured below 50ms p95 on this host, fitting 3s prompt-time hook ceilings if D4 prevents cold spawn and enforces timeout. |
| RQ3 build/activation drift | terminal MITIGATED | Current launcher readiness is existence-only, so DD-001 source/dist freshness guard is required for the CLI shim/entrypoint. |
| RQ4 platform/socket | terminal MITIGATED | The default macOS socket path is too long, but current runtime config pins `/tmp/mk-spec-memory`, bridge code supports `tcp://`, and D6 makes the CLI default/guard explicit. |
| RQ5 OpenCode tools gate | terminal ACCEPTED | Installed OpenCode 1.16.2 lacks a documented first-class shell subcommand gate; plugin/Bash/MCP dual-stack remains viable, and upstream gating is outside this packet. |
| RQ6 migration map | terminal ACCEPTED | Scoped inventory measured 93 files and 1041 references; full migration is future work, not needed for dual-stack fallback delivery. |
| RQ7 delta completeness | RESOLVED | D1-D7 plus DD-001 cover the residual implementation risk surface; no independent ninth delta is required. |
| RQ8 residual hedges | RESOLVED | Prior methodology, artifact, estimate, migration, socket, and latency hedges now have terminal classifications. |

## Evidence Summary

### Spawn, Lease, and Orphan Cleanup

The launcher already has the right ownership model:

- Exclusive owner lease write with `wx`: `.opencode/bin/mk-spec-memory-launcher.cjs:298-312`.
- Stale reclaim re-read after writing to prevent two owners: `.opencode/bin/mk-spec-memory-launcher.cjs:365-403`.
- Heartbeat refresh revalidates ownership and self-shuts down if lost: `.opencode/bin/mk-spec-memory-launcher.cjs:405-443`.
- Bootstrap lock serialization via lock directory: `.opencode/bin/mk-spec-memory-launcher.cjs:1151-1194`.
- Dead-socket respawn rechecks owner/child state before takeover: `.opencode/bin/mk-spec-memory-launcher.cjs:671-752`.
- Main launch path obtains ownership before build/launch and re-probes before server start: `.opencode/bin/mk-spec-memory-launcher.cjs:1339-1407`.

Existing tests already cover concurrent owner selection, dead-socket takeover, divergent secondary socket env, recycle lease retention, idle timeout, and IPC activity. The missing work is focused acceptance coverage for the new `.opencode/bin/spec-memory.cjs` shim path, not a new lifecycle mechanism.

### Hook Latency

Prompt-time hook ceilings are 3 seconds in Claude/Codex configs, with some 10 second async or post-tool hooks. Local process measurement found:

- Empty Node process: p95 40.85ms.
- Node process requiring the IPC bridge: p95 46.09ms.

That is enough for prompt-time hooks only when the CLI uses warm-only semantics. Cold daemon spawn belongs in prewarm/background paths, not in prompt submission or pre-tool hooks.

### Socket Path

The default database socket path measured 134 bytes on this host, above the 104 byte Darwin Unix socket ceiling. Existing Codex/OpenCode config pins `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory`, producing a 35 byte socket path, and bridge code supports `tcp://` endpoints. D6 should make this default part of the CLI shim so user config drift does not reactivate the long-path problem.

### Build Freshness

The launcher currently checks required artifact existence, not source/dist freshness. Existing freshness tests cover `mcp_server/lib/**/*.ts`, but not a future CLI entrypoint or root shim. DD-001 is therefore required: stale or missing CLI dist must fail with exit 69 unless an explicit development override is set.

### OpenCode and Migration

OpenCode 1.16.2 exposes MCP and plugin surfaces, but not a documented local shell subcommand tool gate in the checked help/config. That makes first-class shell-tool registration an upstream/product constraint rather than a current implementation blocker.

Scoped migration inventory found 93 files and 1041 references across agent allowed tools, commands, runtime hooks/plugins, doctor routes/assets, deep-loop allowlists, and runtime config. The old rough reference count should be replaced by this measured inventory, with the caveat that many matches are prose or mirrored agent surfaces rather than executable call sites.

## Required Deltas

D1: add a dual simultaneous auto-spawn integration test for two `.opencode/bin/spec-memory.cjs` invocations against the same missing/dead socket. Assert one owner lease, one context-server child, bridged/retryable secondary behavior, and no stale locks. Include divergent `SPECKIT_IPC_SOCKET_DIR`.

D2: add dual-client MCP plus CLI coverage against the same IPC server. Assert both clients receive valid responses and daemon identity remains stable.

D3: wire `--session-id` in `mcp_server/spec-memory-cli.ts`, with explicit flag precedence and runtime env fallback tests.

D4: add `--timeout-ms` and warm-only/spawn-policy semantics. Prompt-time hooks must not cold-spawn; timeout exits 75 and hook integrations should use stale/no-op fallback.

D5: document exit-69 recovery in CLI help/docs: rebuild, update client/protocol, or check socket/config depending on the mismatch.

D6: default unset CLI socket dir to `/tmp/mk-spec-memory`, respect overrides, and reject too-long Darwin Unix socket paths or require explicit TCP fallback.

D7: add CLI-spawn idle cleanup coverage for backend-only `stdin: null`, IPC client disconnect, `fatalShutdown`, bridge close, and lease cleanup.

DD-001: add source/dist freshness guard for the CLI shim/entrypoint and generated command/schema artifacts; exit 69 on stale/missing dist unless explicitly overridden for development.

## Estimate

Delta hardening estimate:

- D1: 0.35d.
- D2: 0.30d.
- D3: 0.30d.
- D4: 0.25d.
- D5: 0.15d.
- D6: 0.25d.
- D7: 0.25d.
- DD-001: 0.35d.
- Integration/review buffer: about 0.30d.

Total: about 2.0-2.5 days.

The full dual-stack implementation estimate remains plausible at 10-13 days, assuming core CLI/parser/IPC work, generated subcommand/schema integration, the deltas above, docs/package/bin work, and verification hardening.

## Residual Unknown Sweep

- MiMo independence issue: ACCEPTED methodology limitation, not an implementation risk for this packet.
- Findings registry coverage issue: ACCEPTED artifact limitation, not an implementation risk.
- Effort estimate uncertainty: MITIGATED by bottom-up delta estimate, but implementation planning should still re-estimate.
- OpenCode first-class shell-tool gate: ACCEPTED upstream/product limitation.
- Migration map roughness: MITIGATED by scoped inventory.
- Socket length: MITIGATED by current short-dir config plus D6.
- Warm latency wording: MITIGATED; use about 40-46ms p95 process overhead on this host, not sub-millisecond end-to-end CLI hook language.

## Convergence Statement

This lineage reached convergence in iteration 004. All seed questions and discovered residuals are classified as RESOLVED, terminal MITIGATED, or terminal ACCEPTED. No writes were intentionally made outside the lineage artifact directory.
