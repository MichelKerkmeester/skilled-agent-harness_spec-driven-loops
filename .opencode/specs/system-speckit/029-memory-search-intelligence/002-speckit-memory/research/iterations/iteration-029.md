# Iteration 29: Round G Verify — C-G1 Cadence (cursor already exists) + Galadriel Prompt-Cache (does NOT apply)

## Focus
Round G verify of the one strong galadriel net-new (C-G1 consolidation cadence) + the roadmap's galadriel-determinism→prompt-cache claim. Read-only.

## C-G1 cadence consolidation tick — **PARTIAL / CAUTION** (newInfoRatio 0.70)
A cadence-gated consolidation engine **ALREADY EXISTS** — `lib/storage/consolidation.ts` has a durable cursor (`consolidation_state.last_run_at`), a weekly cadence check (`CONSOLIDATION_INTERVAL_DAYS=7`, `isConsolidationDue`), and an idempotent locked cycle — but it is **save-triggered** (invoked only from response-builder.ts:852), never clock-driven. So C-G1 **OVERSTATES the gap**: the cursor is built (contradicts the Round-B/C "depends on unbuilt C4-C" framing for the tick half); the genuinely-missing piece is ONLY a clock/interval driver firing independent of save volume. The tick half is effectively GO via the existing `registerInterval` host (session-manager.ts has 4 intervals, all eviction-only). The enrichment half is save-time-inline (needs parsed file + embedding + checkpoint) and would need an entry-point refactor.

## Galadriel prompt-cache claim — **DOES NOT APPLY**
The roadmap's "determinism unlocks galadriel's ~84% prompt-cache savings" is **refuted for the MCP server**. The ~84% is an in-process-agent property: galadriel caches its OWN stable system prefix (SOUL/MEMORY/CONTEXT, clearing the 4096-tok Opus minimum) across its own `messages.create()` turns via `cache_control` breakpoints it owns (CACHING.md:8-14,38-76). An out-of-band MCP server's recall lands in the CLIENT's mutable conversation tail (a `tool_result` after the user turn) — the server makes no Anthropic API calls and owns no breakpoints. Determinism in recall serialization is **neither necessary nor sufficient** to unlock that prefix saving. Narrow real angle: IF memory is injected into the client's stable system block at startup, deterministic ordering keeps it byte-stable/cacheable — a client-side benefit, NOT the ~84% MCP-side number.

## Key corrections
- **C-G1 cursor already exists** (consolidation.ts) — only the clock-driver is missing; do NOT block C-G1 on the (separately-needed) C4-C enrichment cursor.
- **The galadriel prompt-cache rationale for determinism is invalid for an MCP server** — drop it from the roadmap's determinism justification (determinism stands on reproducibility/testability, not a prompt-cache unlock).

## Next Focus
C-G1 = just-add-a-clock-driver (cursor built); galadriel prompt-cache rationale dropped. Feeds the roadmap addendum (correct both).
