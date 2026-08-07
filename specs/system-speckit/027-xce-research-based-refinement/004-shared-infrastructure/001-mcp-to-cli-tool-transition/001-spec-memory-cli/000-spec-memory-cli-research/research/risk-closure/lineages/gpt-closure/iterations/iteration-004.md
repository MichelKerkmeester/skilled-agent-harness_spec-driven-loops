# Iteration 004 - Design Delta Completeness and Residual Unknown Sweep

## Scope

Questions addressed: RQ7 and RQ8, with a convergence check across RQ1-RQ6.

This pass checked whether D1-D7 plus DD-001 are sufficient, whether any missing ninth delta remains, and whether prior hedges can be terminally classified.

## Delta Completeness

The complete implementation delta set is:

- D1: dual simultaneous auto-spawn test for two `.opencode/bin/spec-memory.cjs` invocations against the same missing/dead socket. Acceptance: one daemon owner, one context-server child, secondary bridged/retryable behavior, no stale locks.
- D2: dual-client MCP plus CLI test against the same IPC server. Acceptance: both clients receive expected responses, daemon identity remains stable, and IPC stats show valid secondary client behavior.
- D3: `--session-id` wiring in `mcp_server/spec-memory-cli.ts`. Acceptance: explicit flag maps to `args.sessionId`; fallback can use a runtime session env such as `CODEX_THREAD_ID`; tests cover explicit and fallback cases.
- D4: `--timeout-ms` plus warm-only/spawn-policy semantics. Acceptance: timeout exits 75, prompt-time hooks do not cold-spawn, and stale/no-op fallback is documented.
- D5: exit-69 recovery documentation and help output. Acceptance: protocol/config/dist mismatch exits explain rebuild/update-client/check-socket recovery.
- D6: short socket directory default and long-path guard. Acceptance: unset env defaults to `/tmp/mk-spec-memory`; explicit overrides are respected; too-long Darwin Unix sockets fail with exit 69 or require explicit TCP.
- D7: CLI-spawn idle cleanup coverage. Acceptance: backend-only `stdin: null` daemon exits after no IPC clients and clears bridge/lease state; active clients and timeout `0` behave correctly.
- DD-001: CLI dist freshness guard. Acceptance: stale or missing CLI dist exits 69 with source/dist details unless an explicit dev override is set.

No independent ninth design delta is required. The only plausible missing item is a no-daemon-bypass/import-boundary test for the public CLI. That requirement is already part of the accepted core CLI design: public commands must go through IPC/JSON-RPC and direct DB/admin access remains separate. It should be included in core CLI tests, but it is not a separate residual risk class like D1-D7/DD-001.

## Estimate Check

Bottom-up delta effort:

- D1: 0.35d.
- D2: 0.30d.
- D3: 0.30d.
- D4: 0.25d.
- D5: 0.15d.
- D6: 0.25d.
- D7: 0.25d.
- DD-001: 0.35d.
- Integration/review buffer: about 0.30d.

Total remaining delta hardening: about 2.0-2.5 days.

The full dual-stack implementation estimate remains plausible at 10-13 days: core CLI/parser/IPC 4-5d, generated command/schema integration 1.5-2d, spawn/session/timeout/socket/freshness deltas 2-2.5d, docs/package/bin 0.5-1d, and verification/hardening about 2d.

## Residual Hedges

- MiMo sibling-lineage independence limitation: terminal ACCEPTED methodology limitation. It does not alter the verdict because independent DeepSeek and MiniMax evidence plus this GPT closure pass cover the risk classes; future fan-outs should prompt-exclude sibling lineage summaries.
- Findings registry coverage 1/3: terminal ACCEPTED artifact limitation. Canonical synthesis and per-lane reports carry the findings; this is not an implementation risk.
- Effort estimates are research-grade: terminal MITIGATED. Bottom-up deltas now support the estimate, though implementation planning should re-estimate from actual work items.
- OpenCode shell-tool gate: terminal ACCEPTED upstream/product limitation. Current OpenCode 1.16.2 does not expose the needed first-class shell-tool gate; plugin/Bash/MCP dual-stack remains viable.
- Migration map roughness: terminal MITIGATED. Scoped inventory now measures the surface; future migration still needs executable/prose splitting.
- Socket path length: terminal MITIGATED. The default path is too long on this host, but config already pins a short directory and D6 makes that behavior part of CLI activation.
- Warm latency wording: terminal MITIGATED. End-to-end shelling through Node is about 40-46ms p95 on this host; do not repeat sub-millisecond language for prompt-time CLI hooks.

## Convergence

All eight research questions have terminal classifications. No new unresolved risk class emerged in iteration 004.

Convergence reached before `config.maxIterations=20`.
