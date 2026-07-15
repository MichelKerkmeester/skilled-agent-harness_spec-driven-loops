# Deep Research Strategy — Run 4: Total Risk Closure

## Topic

Terminally classify every remaining MITIGATED, DEFERRED, and hedged item in the spec-memory dual-stack CLI verdict chain so nothing is unknown. Convergence-driven: the lane stops when all questions reach a terminal classification, hard cap 20 iterations.

## Premise (settled by runs 1–3 — read as input, do not relitigate)

- Run 1: GO — CLI over the existing daemon/IPC with auto-spawn; zero feature loss; daemon must stay (`../research.md` §1–11).
- Run 2: the CLI design — `.opencode/bin/spec-memory.cjs` shim + compiled `mcp_server/spec-memory-cli.ts`, subcommands generated from `TOOL_DEFINITIONS`, exits 0/1/64/69/75 (`../cli-backend/lineages/gpt/research.md`, condensed `../research.md` §12).
- Run 3: risk matrix — 7 RESOLVED, 4 MITIGATED, 0 unresolved, 2 DEFERRED; 8 design deltas; 10–13d estimate; measured ~50ms warm / ~150ms cold (`../research.md` §13, `../risk-resolution/lineages/{deepseek-risk,mimo-risk}/research.md`).

## Done-Definition (stricter than run 3)

Every key question (seed + newly added) must end as one of:
- **RESOLVED** — answered with file:line or measured evidence
- **ACCEPTED** — risk consciously accepted with explicit rationale
- **MITIGATED (terminal form only)** — the named mitigation is itself fully specified (exact file, mechanism, acceptance test) AND verified sufficient by code-trace or measurement; a vague mitigation is NOT terminal

DEFERRED is not an allowed terminal state in this run for anything answerable from this repository; deferrals must be converted to a terminal classification for the dual-stack scope plus a crisp statement of the upstream-only remainder. Unclassified = not done. Newly discovered risks become new key questions; they need terminal classification too.

## Key Questions

- [ ] RQ1: Spawn/lease races to terminal — triple-lock + re-read CAS code-trace; dual-simultaneous-spawn prove/refute; D1 + D7 fully specified and verified sufficient (orphan-reaping on the CLI-spawn path).
- [ ] RQ2: Hook latency to terminal — warm-path measured; per-runtime hook ceilings with file:line; warm-only/cold-path policy pinned; D4 + stale-while-revalidate verified sufficient.
- [ ] RQ3: Build/activation drift to terminal — launcher build-check code-trace on spawn path; DD-001 fully specified (inputs, signal, warn + exit 69).
- [ ] RQ4: Platform/socket to terminal — socket path length measured vs 104-char sun_path; short-dir pin file:line; D6 fully specified; TCP fallback file:line; Windows non-goal ACCEPTED.
- [ ] RQ5: OpenCode tools-gate deferral to terminal — installed-version capability check (read-only); verify dual-stack does not need the gate; terminal classification for dual-stack scope + crisp upstream-only remainder.
- [ ] RQ6: Migration map to terminal — measured per-surface inventory (exact files + counts) replacing the ~125 estimate; migration fully-mapped; execution ACCEPTED as future packet.
- [ ] RQ7: Design-delta completeness — D1–D7 + DD-001 each fully specified; absorption + consolidated estimates re-derived bottom-up; missing-ninth-delta hunt.
- [ ] RQ8: Residual-unknown sweep — every hedged claim in runs 1–3 outputs + packet Known Limitations enumerated and terminally classified (registry coverage 1/3, MiMo independence note, effort confidence).

## Known Context

- Run-3 measured node startup 40–45ms, IPC RTT 0.48ms on this host (darwin/arm64) — ~50ms warm / ~150ms cold per call.
- The daemon IPC bridge serves 8 concurrent clients (test-proven); the owner lease is the single-writer boundary.
- Default socket path ~105 chars is marginally over macOS's 104 sun_path limit; runtime already pins `/tmp/mk-spec-memory`.
- Read-only bash timing measurements are permitted; file mutation outside the lane artifact dir is not.

## Negative Knowledge (ruled out)

- Pure per-invocation CLI (run 1); MCP removal (non-goal — dual-stack); relitigating the GO verdict or the run-2 design shape.

## Next Focus

Iteration 1: RQ1 + RQ3 (the two code-trace-heavy structural items). Then RQ2 + RQ4 (measurement-heavy), then RQ5 + RQ6 (deferral conversion), then RQ7 + RQ8 (completeness sweeps), adding discovered risks as new RQs.

## Parameters

- Max iterations: 20 (terminal cap)
- Convergence threshold: 0.05 (all-questions-terminally-classified is the intended exit)
