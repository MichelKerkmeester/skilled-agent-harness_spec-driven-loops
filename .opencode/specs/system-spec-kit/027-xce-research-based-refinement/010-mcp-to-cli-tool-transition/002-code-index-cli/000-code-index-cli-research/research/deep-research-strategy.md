# Deep Research Strategy — Code-Index CLI Feasibility

## Topic

Dual-stack CLI fallback feasibility for mk_code_index (8 tools). Forced 10 iterations, one KQ focus per iteration; spec-memory record is settled premise (read as input, do not relitigate).

## Done-Definition

Every KQ terminally answered with file:line or measured evidence; verdict-shaped research.md (parity matrix, loss table, prior-art transfer, go/no-go, deltas, effort).

## Key Questions

- [ ] KQ1: parity matrix, all 8 tools: STATELESS vs STATE-DAEMON classification, CLI subcommand mapping per tool, which need a live daemon vs direct-DB read-only access. 
- [ ] KQ2: daemon-dependency audit: enumerate what dies per architecture (pure per-invocation CLI vs CLI-over-daemon vs CLI-with-auto-spawn) — owner-lease heartbeat, idle 
- [ ] KQ3: affordance transfer: which spec-memory answers port verbatim (exit map, auto-spawn, --session-id, --format, --timeout-ms) and which do NOT — validateToolArgs is
- [ ] KQ4: prior-art deep-dive: mk-code-index-launcher.cjs as the spawn template; doctor:update orchestrator usage of code_graph_scan/verify; confirm zero existing CLI and
- [ ] KQ5: long-running ops: measure or bound code_graph_scan duration (cold full-scan vs incremental) — does it fit per-call CLI semantics or need async job semantics (st
- [ ] KQ6: integration-surface map MEASURED: exact files/counts of mk_code_index tool references across agents (context/deep-review/deep-research), session-prime hooks per
- [ ] KQ7: hook-latency fit: which hook contexts call code_graph_status/session-prime today, their timeout ceilings, and whether a warm CLI shell-out fits under the measur
- [ ] KQ8: dual-stack coexistence + races: the code-graph lease implementation (MK_CODE_INDEX_STRICT_SINGLE_WRITER), dual-simultaneous CLI spawn behavior, orphan reaping o
- [ ] KQ9: risk register + named design deltas (D-series) an implementation phase must absorb, each with file/mechanism/acceptance. 
- [ ] KQ10: verdict synthesis: go/no-go, architecture pick, bottom-up effort estimate, explicit inheritance list, and corrections to any spec-memory assumption that did not

## Known Context

- Spec-memory record (premise): generic CLI-over-daemon settled — exits 0/1/64/69/75, auto-spawn via launcher, codegen-from-registry, warm-only hook policy, ~40–46ms p95 node start / 0.48ms IPC RTT on this host.
- This system shares launcher-ipc-bridge.cjs + owner-lease architecture with mk-spec-memory.
- Read-only bash measurements permitted; no file mutation outside the lane artifact dir.

## Next Focus

Iteration 1: KQ1 (parity matrix). Then one KQ per iteration in order; newly discovered risks append as new KQs needing terminal classification.

## Parameters

- Max iterations: 10 (forced terminal cap; convergence pinned 0)
- Executor: cli-codex gpt-5.5, reasoning high, service tier fast, 1500s/iteration
