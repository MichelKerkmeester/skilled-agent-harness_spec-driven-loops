# Deep Research Strategy: gpt-closure

## Research Topic

Run 4 total risk closure for the spec-memory dual-stack CLI: terminally classify every remaining mitigated, deferred, and hedged item so nothing is unknown.

## Known Context

- Parent packet verdict is settled: CLI over the existing daemon/IPC with auto-spawn is the accepted direction; pure per-invocation CLI is out of scope.
- Run 2 produced the dual-stack CLI design: a `.opencode/bin/spec-memory.cjs` shim plus compiled `mcp_server/spec-memory-cli.ts`, 37 generated subcommands, Zod argv validation, and exit codes 0/1/64/69/75.
- Run 3 left several items classified as mitigated or deferred; this lineage must convert those into terminal classifications for the dual-stack scope.
- Resource map is not present for this lineage; skipping coverage gate.

## Key Questions

- [x] RQ1: Spawn/lease races to terminal, including triple-lock code trace, dual simultaneous auto-spawn risk, D1 test specification, and D7 CLI-spawn daemon reaping.
- [x] RQ2: Hook latency to terminal, including measured warm path, hook ceiling inventory, integration policy, D4 timeout, and stale-while-revalidate sufficiency.
- [x] RQ3: Build/activation drift to terminal, including launcher build-check trace and DD-001 dist-freshness semantics.
- [x] RQ4: Platform/socket to terminal, including actual socket path length, short-dir pin, D6 handling, TCP fallback, and Windows non-goal acceptance.
- [x] RQ5: OpenCode tools-gate deferral to terminal, including installed capability check and exact upstream-only remainder.
- [x] RQ6: Migration map to terminal, including measured per-surface inventory and future-packet acceptance.
- [x] RQ7: Design-delta completeness, including D1-D7 plus DD-001 specification, bottom-up estimate, and missing-delta hunt.
- [x] RQ8: Residual-unknown sweep, including every hedge in prior syntheses and packet limitations.

## Answered Questions

- RQ1: terminal MITIGATED by launcher ownership/respawn/idle mechanisms plus D1/D7 acceptance coverage.
- RQ2: terminal MITIGATED by measured warm process overhead and D4 timeout/warm-only policy.
- RQ3: terminal MITIGATED if DD-001 freshness guard is implemented; current launcher existence-only build check is insufficient by itself.
- RQ4: terminal MITIGATED by short socket dir config, TCP fallback, and D6 CLI shim default/guard.
- RQ5: terminal ACCEPTED as upstream-only for first-class OpenCode shell-tool gating.
- RQ6: terminal ACCEPTED as future migration packet with measured inventory.
- RQ7: RESOLVED; D1-D7 plus DD-001 are complete, with no independent ninth delta.
- RQ8: RESOLVED; every prior hedge has a terminal classification.

## What Worked

- Code-trace first for launcher ownership and idle lifecycle produced terminal classifications without needing to mutate parent packet state.
- Lightweight process timing was enough to correct hook-latency wording while staying inside lineage-only write constraints.
- Scoped grep inventory replaced the prior rough migration estimate with measured surface counts.

## What Failed

- No blocking failures. Full daemon IPC RTT and cold-spawn timing were intentionally not remeasured because that could create lease/socket artifacts outside the permitted lineage directory.

## Exhausted Approaches

- Relitigating the run-1 GO verdict is out of scope.
- Implementing the CLI or modifying source files is out of scope.

## Ruled-Out Directions

- Pure per-invocation CLI as the recommended architecture.
- MCP removal during dual-stack delivery.

## Next Focus

Synthesis complete. No open research questions remain.

## Non-Goals

- Do not implement fixes.
- Do not modify files outside this lineage artifact directory.
- Do not update parent packet state or memory.

## Stop Conditions

- Stop when all seed and discovered questions are terminally classified as RESOLVED, ACCEPTED, or terminal MITIGATED.
- Stop at 20 iterations if convergence is not reached.
