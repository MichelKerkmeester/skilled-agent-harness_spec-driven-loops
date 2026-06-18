# Iteration 11 (Round L): Q2 deep — ingest-bypass full-chain trace → HOLE REFUTED

## Focus
Resolve the Round K Q2 open (the seat traced only part of the working_memory insert chain). Read-only deep-dive.

## Findings (newInfoRatio 0.8) — CORRECTS iteration-002
**RESOLUTION: HOLE REFUTED.** The Round-K "orthogonal render-trust hole" (K2-01) does not exist as framed.
- `working_memory` is a pure attention/pointer table — **no content column, no source_kind** (`working-memory.ts:449-483`); the ingest passes only pointer+bookkeeping (sessionId, memoryId, attentionScore, sourceTool…, `extraction-adapter.ts:266-274`).
- The redacted `summary`/`redactedText` is computed then **discarded** — only the `redactionApplied` boolean survives (`extraction-adapter.ts:246-256,273`). Ingest requires an existing `memory_index` row or skips (`:258-262`).
- All renderable content is JOINed from `memory_index` (`working-memory.ts:302-308`) — the same rows 027's write-ingress guard + write-provenance already govern at write time.
- `envelope.ts:284-295` is **bare MCP serialization, not a trust boundary** — the real escaper is `formatters/search-results.ts:782` (the roadmap itself locates it there, `roadmap.md:124`).

**Net:** Q2 reverts to **EXTENDS via C4-A/C4-B only** (idempotency + content-addressed identity); the ingest-bypass "hole" is withdrawn. The C8-ingest fix would target a non-existent content path (S-effort no-op).

## Most-likely-wrong (residual, different axis)
The session/prompt-context renderer for `getSessionMemories`/`getSessionPromptContext` was not opened — if it emits `memory_index` content unescaped (unlike `search-results.ts:782`), a render-trust gap exists, but it is a `memory_index`-content recall gap, NOT the extraction-adapter ingest-bypass. Carry to Round N adversarial.

## Next Focus
Mark K2-01 refuted in the ledger. The genuine capture-side injection-marker filter is already tracked (027 B15/iteration-019), not net-new here.
