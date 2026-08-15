# Iteration 6: Independent validation, residual risks, and acceptance matrix

## Focus
Re-check the lineage's load-bearing claims against primary sources (installed Pi docs + type declarations, RFCs, Tailscale, OWASP, WebKit/Apple), search for contradictions or stale assumptions, rank residual risks, and define the executable acceptance matrix for the MVP.

## Findings
1. **High — settlement semantics validated against the installed client implementation.** `dist/modes/rpc/rpc-client.js` resolves its run completion when the `agent_settled` event is received (three independent resolution sites), confirming the iteration-1/2 claim that `agent_settled` — not the `prompt` response and not `agent_end` — is the terminal signal. No contradiction found with the acceptance-vs-settlement contract. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-client.js:354-383]
2. **High — `get_session_stats` is richer than credited: it is the active-session dashboard metadata source.** It returns `sessionFile`, `sessionId`, message counts by role, `toolCalls`/`toolResults`, cumulative `tokens` (input/output/cacheRead/cacheWrite), `cost`, and `contextUsage` (tokens/contextWindow/percent; omitted or null when no model/context). Iteration 2's token/cost dashboard surface comes from `get_session_stats`, while session-card list metadata still comes from `get_state` plus the relay catalog — the stats call is per-active-session, not list-wide. No contradiction, just a fuller source than iteration 2 cited. [SOURCE: rpc.md:529-574]
3. **High — the negative evidence reconfirms: no idempotency or client-mutation fields exist anywhere in the installed RPC implementation.** A repo-wide grep for idempotency patterns in `dist/modes/rpc/` and `dist/runtime/` returned nothing; `rpc-types.d.ts` confirms `leafId: string | null` and `sessionFile?: string` but no mutation-id/dedup surface. The relay-owned mutation ledger (iteration 3) remains the only dedup mechanism — validated as necessary, not just prudent. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-types.d.ts:152,337,346] [NEGATIVE: grep across dist/modes/rpc, dist/runtime]
4. **Medium — one contract nuance found: session mutations can be cancelled by extension handlers.** `new_session`, `switch_session`, `fork`, and `clone` responses carry `data.cancelled` and can be vetoed by `session_before_switch`/`session_before_fork` extension events. The relay's session catalog must therefore treat these as request-outcome pairs (like the mutation ledger), not as unconditional transitions — a cancelled `switch_session` must not change the active-session mapping. This is a refinement, not a contradiction: iteration 2 assumed switching succeeds. [SOURCE: rpc.md:137-162] [SOURCE: rpc.md:597-672]
5. **Medium — session-storage discovery is undocumented; the `--session-dir` flag remains the only sanctioned custom location.** `sessions.md` documents no directory layout, and the RPC doc only lists `--session-dir <path>` / `--no-session` flags. The relay-side catalog (iteration 2 finding 4) stays valid, but its first implementation step is a filesystem probe of the configured `--session-dir` plus `get_entries`-based metadata hydration — flagged as an implementation-time verification point, not a design change. [SOURCE: rpc.md:7-18] [SOURCE: sessions.md (no layout documented)]
6. **High — the executable acceptance matrix closes the loop on every phase gate.** Consolidated from iterations 1-5: (G1) strict-LF framing round-trip with id correlation; (G2) settlement: for a normal LLM prompt run, exactly one `agent_settled` at the end (multiple `agent_end`/retry/compaction events are legal), and no second `response` for a request id; (G3) reconnect replay: gap-free envelope replay from `lastEventSeq` with cumulative ACKs, including relay-restart mid-stream; (G4) authn/authz: unauthenticated handshake rejected, non-allowlisted Origin rejected, per-action matrix enforced with Phase-1 read-only default; (G5) approval round-trip: extension dialog → relay → decision card → response, second responder rejected, CAS lease holds, epoch invalidation after child restart, AND canonical tool-call digest recomputation immediately before execution with fail-closed mismatch handling (the approved payload must match what is about to execute); (G6) mutation digest conflict: same `clientMutationId` + different payload → conflict error; (G7) iOS push: Home Screen install, gesture-grant, push receipt, tap-to-open; (G8) offline: stale snapshot + stale marking + outbox retry dedup; (G9) fork/clone UX + multi-device lease contention. Every gate has a defined pass criterion and belongs to exactly one phase (G1-G2 phase 0, G3-G4 phase 1, G5-G6 phase 2, G7-G8 phase 3, G9 phase 4). [INFERENCE: consolidated from findings across iterations 1-5]

## Residual Risks (ranked)
1. **P0 — Approval argument TOCTOU/post-gate mutation:** mitigated by approval-time payload-digest binding PLUS canonical tool-call digest recomputation immediately before execution with fail-closed mismatch handling (iteration 6 refinement); gate G5 must include a mutate-after-open attempt and an execute-with-mismatch attempt.
2. **P0 — Relay crash behavior:** envelope persistence, mutation-ledger recovery, and approval-map restore after relay restart are designed but untested; gate G3 must include relay-restart mid-stream.
3. **P1 — Serve PROXY protocol + Origin validation integration:** Tailscale terminates TLS and forwards; source-IP and Origin behavior against the relay is untested (iteration 4).
4. **P1 — iOS push on a real device:** Home Screen install, gesture-grant, and notification delivery are platform-behavior gates (G7) that cannot be simulated.
5. **P1 — Extension trust chain:** hash/version pinning of the approval extension depends on Pi's extension loading mechanics (trusted locations, project trust); exact pinning verification is an implementation-time check.
6. **P2 — Multi-client lease contention UX:** CAS is specified; the observe-not-answer UX for the non-lease holder needs a live two-device test (G9).

## Questions Answered
- All five key questions re-verified with no contradictions; three refinements (cancellable session mutations, richer session-stats metadata, undocumented session-dir layout) and one full acceptance matrix produced.

## Questions Remaining
- None open by design. Execution-time verifications (session-dir probe, extension pinning mechanics, real-device push) are gates, not research questions.

## Ruled Out
- Nothing new ruled out; validation confirmed all prior negative directions remain negative.
- **Treating `switch_session`/`fork`/`clone` as unconditional:** cancelled transitions must not change the catalog — new refinement. [SOURCE: rpc.md:597-672]

## Dead Ends
- No live Pi child, deployed Serve instance, or real device available in this environment; every G-gate above is an executable future gate, none run here.

## Edge Cases
- Contradictory evidence: none found across the full lineage; the only nuance is the cancellable-mutation refinement.
- Missing dependencies: session-dir layout documentation; extension pinning mechanics.
- Ambiguous input: "validation" interpreted as primary-source contradiction pass + risk ranking + acceptance matrix, not live testing.

## Sources Consulted
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-client.js:354-383]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-types.d.ts:152,337,346]
- [SOURCE: rpc.md:7-18, 137-162, 529-574, 597-672]
- [SOURCE: sessions.md (no layout documented — negative evidence)]
- [NEGATIVE: grep for idempotency across dist/modes/rpc, dist/runtime]

## Assessment
- New information ratio: 0.75 (3 fully new findings — client-implementation settlement proof, session-stats metadata source, cancellable-mutation nuance; 2 partially new — session-dir gap, acceptance matrix; 1 re-verification)
- Questions addressed: full-lineage validation; all five key questions re-confirmed.
- Confidence: high on implementation-verified claims (settlement, absence of idempotency); high on gate definitions (derived from prior primary sources); medium on anything requiring live hardware/network (G7).

## Reflection
What worked: reading the installed client implementation (not just docs) converted "agent_settled is terminal" from doc-claim to code-verified; grepping dist for idempotency fields converted negative evidence into a formal negative finding.
What failed: nothing new; all live-execution gates remain unrun by design.
What was ruled out: nothing new; the cancellable-session-mutation nuance is a refinement, not a reversal.

## Recommended Next Focus
Research complete. Synthesis should consolidate the six iterations into the final research report with the Eliminated Alternatives table, Divergence Map, and Convergence Report, and emit the resource map from the delta sources.
