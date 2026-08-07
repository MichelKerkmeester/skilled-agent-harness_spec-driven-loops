# Deep Research Strategy — deepseek-risk Lineage

## Topic

Resolve EVERY risk and unknown in the spec-memory dual-stack CLI design before implementation. Convergence-driven: lane stops when all questions reach a terminal classification, hard cap 20 iterations.

## Premise (settled by runs 1–2, read as input)

- Run 1: GO — CLI over existing daemon/IPC with auto-spawn; zero feature loss; daemon must stay.
- Run 2: CLI design — `.opencode/bin/spec-memory.cjs` shim + compiled `mcp_server/spec-memory-cli.ts`, subcommands from `TOOL_DEFINITIONS`, exits 0/1/64/69/75.

## Exclusion

Do NOT read sibling lane folders under `risk-resolution/lineages/` (only `deepseek-risk/`). Findings from sibling lanes are void.

## Done-Definition

Every key question (seed + newly added) must end as:
- RESOLVED — file:line or measured evidence
- MITIGATED — named design delta the implementation packet must absorb
- ACCEPTED — risk consciously accepted with explicit rationale
- DEFERRED — blocked on named external dependency

## Key Questions

- [ ] RQ1: Daemon-bypass enforcement — public CLI provably IPC-only? Admin direct-DB path inventory; unix-socket trust model + socket permissions.
- [ ] RQ2: Schema-drift mechanics — all 37 arg shapes round-trip via argv + `--json`? Codegen feasibility from TOOL_DEFINITIONS; tools that don't map cleanly.
- [ ] RQ3: Lease/spawn races — CLI auto-spawn vs MCP-owned daemon; simultaneous CLI spawns; CLI-spawned daemon lifetime/reaping/orphan risk.
- [ ] RQ4: Retryable taxonomy — complete error→exit map (-32001, cold-start, lease contention, SQLITE_BUSY; 75 vs 69).
- [ ] RQ5: Hook latency budget — daemon-down cold path (auto-spawn + 15–30s embedder warm) vs per-runtime hook timeout ceilings; which hook types can shell out.
- [ ] RQ6: Per-call spawn overhead — MEASURE node startup + socket round-trip on this host; validate the 50–150ms estimate.
- [ ] RQ7: Session-identity semantics — sessionId propagation verified in dedup/learning/working-memory code paths; what non-codex runtimes pass.
- [ ] RQ8: Build/activation drift — shim→dist staleness; launcher bootstrap-lock coverage of the CLI handoff.
- [ ] RQ9: Dual-client load — MCP+CLI simultaneous traffic contention; existing stress-test coverage vs gaps.
- [ ] RQ10: Effort reconciliation — one defensible dual-stack estimate (8–12d vs 13–16d vs 3–4wk).
- [ ] RQ11: Platform/socket constraints — macOS sun_path limit handling; Windows non-goal decision.

## Known Context

- IPC bridge serves multiple concurrent clients (test-proven); owner lease is single-writer boundary.
- `generate-context.js` performed full indexed save with MCP down on 2026-06-06 (CLI-path precedent).
- 2026-06-06 disconnect: owner-exit leaves daemon down; Claude Code never reconnects MCP mid-session.
- Read-only bash timing measurements permitted; file mutation is not.

## Negative Knowledge (ruled out)

- Pure per-invocation CLI (run 1); MCP removal (non-goal — dual-stack).

## What Worked

- (none yet — first iteration)

## What Failed

- (none yet — first iteration)

## Exhausted Approaches

- (none yet)

## Active Risks

- All 11 RQs unclassified — high risk density.

## Non-Goals

- Not building a CLI; not migrating references; not removing MCP registration; not relitigating run 1/2 verdicts.

## Stop Conditions

- All 11 seed RQs + any discovered RQs classified; OR max 20 iterations; OR unrecoverable stuck state.

## Next Focus

Iteration 1: RQ1 (daemon-bypass enforcement) + RQ3 (lease/spawn races) — the two HIGH-severity structural risks.
