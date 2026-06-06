# Deep Research Strategy — Run 3: Risk Resolution (pre-implementation)

## Topic

Resolve EVERY risk and unknown in the spec-memory dual-stack CLI design before implementation. Convergence-driven: lanes stop when all questions reach a terminal classification, hard cap 20 iterations per lane.

## Premise (settled by runs 1–2 — read as input, do not relitigate)

- Run 1: GO — CLI over the existing daemon/IPC with auto-spawn; zero feature loss; daemon must stay (`../research.md`).
- Run 2: the CLI design — `.opencode/bin/spec-memory.cjs` shim + compiled `mcp_server/spec-memory-cli.ts`, subcommands generated from `TOOL_DEFINITIONS`, exits 0/1/64/69/75 (`../cli-backend/lineages/gpt/research.md`).

## Exclusion

Do NOT read sibling lane folders under `risk-resolution/lineages/` (only your own). Findings derived from a sibling lane are void.

## Done-Definition

Every key question (seed + newly added) must end as one of:
- **RESOLVED** — answered with file:line or measured evidence
- **MITIGATED** — a named design delta the implementation packet must absorb
- **ACCEPTED** — risk consciously accepted with explicit rationale
- **DEFERRED** — blocked on a named external dependency

Unclassified = not done. Add newly discovered risks as new key questions; they need terminal classification too.

## Key Questions

- [ ] RQ1: Daemon-bypass enforcement — public CLI provably IPC-only? Admin direct-DB path inventory; unix-socket trust model + socket permissions.
- [ ] RQ2: Schema-drift mechanics — all 37 arg shapes round-trip via argv + `--json`? Codegen feasibility from TOOL_DEFINITIONS; tools that don't map cleanly.
- [ ] RQ3: Lease/spawn races — CLI auto-spawn vs MCP-owned daemon; simultaneous CLI spawns; CLI-spawned daemon lifetime/reaping/orphan risk (six orphaned mk-skill-advisor launchers observed today).
- [ ] RQ4: Retryable taxonomy — complete error→exit map (-32001, cold-start, lease contention, SQLITE_BUSY; 75 vs 69).
- [ ] RQ5: Hook latency budget — daemon-down cold path (auto-spawn + 15–30s embedder warm) vs per-runtime hook timeout ceilings; which hook types can shell out.
- [ ] RQ6: Per-call spawn overhead — MEASURE node startup + socket round-trip on this host; validate the 50–150ms estimate.
- [ ] RQ7: Session-identity semantics — sessionId propagation verified in dedup/learning/working-memory code paths; what non-codex runtimes pass.
- [ ] RQ8: Build/activation drift — shim→dist staleness; launcher bootstrap-lock coverage of the CLI handoff.
- [ ] RQ9: Dual-client load — MCP+CLI simultaneous traffic contention; existing stress-test coverage vs gaps.
- [ ] RQ10: Effort reconciliation — one defensible dual-stack estimate (8–12d vs 13–16d vs 3–4wk).
- [ ] RQ11: Platform/socket constraints — macOS sun_path limit handling; Windows non-goal decision.

## Known Context

- The daemon IPC bridge serves multiple concurrent clients (test-proven); owner lease is the single-writer boundary.
- `generate-context.js` performed a full indexed save with the MCP down on 2026-06-06 (CLI-path precedent).
- The 2026-06-06 disconnect incident: owner-exit left the daemon down; Claude Code never reconnects MCP mid-session.
- Read-only bash timing measurements are permitted; file mutation is not.

## Negative Knowledge (ruled out)

- Pure per-invocation CLI (run 1); MCP removal (non-goal — dual-stack).

## Next Focus

Iteration 1: RQ1 + RQ3 (the two HIGH-severity structural risks). Then proceed by severity, adding discovered risks as new RQs.

## Parameters

- Max iterations: 20 per lane (terminal cap)
- Convergence threshold: 0.05 (genuine convergence active; all-questions-classified is the intended exit)
