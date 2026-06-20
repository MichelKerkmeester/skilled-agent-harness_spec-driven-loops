---
title: "Decision Record: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)"
description: "Architecture decision for the per-edge semantic substrate: build it once root-first, embed at consolidation-time off the foreground turn, ship the whole initiative shadow-gated default-off, and promote each of the five edge-intelligence consumers only on benchmark evidence measured post the gate-zero reindex."
trigger_phrases:
  - "028 semantic edge layer decision record"
  - "semantic-edge-layer ADR"
  - "per edge embedding substrate decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Accepted semantic-edge architecture"
    next_safe_action: "Run strict validation and final typecheck/tests"
    blockers:
      - "shared-infra-dep: gate-zero corpus reindex precedes benchmark/promotion"
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-017-semantic-edge-layer"
      parent_session_id: null
    completion_pct: 65
    open_questions:
      - "Edge-vector collection: share the memory vector-store backend or its own?"
    answered_questions: []
---
# Decision Record: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> DELETED, superseded by measurement. The `SPECKIT_SEMANTIC_EDGE_LAYER` flag and the whole edge family it fed (`SPECKIT_EDGE_VECTOR_INDEX`, `SPECKIT_EDGE_TRIPLET_SEARCH`, `SPECKIT_EDGE_SEMANTIC_DEDUP`, `SPECKIT_EDGE_SEMANTIC_INVALIDATION`) and their code were removed in the flag-resolution reckoning. The fact-text was generic relation-template boilerplate carrying no pair identity, so the family stayed recall-inert at K=20 with a single-item +0.083 that did not generalize. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The ADRs below are retained as the design-of-record.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Substrate-first, consolidation-time, shadow-gated; five candidates as one initiative

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Operator, 028 research (iters 19/21) |

---

<!-- ANCHOR:adr-001-context -->
### Context

We wanted edges in the causal graph to inform ranking, dedup, and invalidation the way mature agent-memory systems (Cognee, Graphiti) do. Research found that five separately-surfaced candidates — `CG-edge-vector-index`, `CG-edge-aware-triplet-search`, `GR-fact-embedding-on-edge`, `GR-semantic-fact-dedup-merge`, and `GR-semantic-invalidation-discovery` — all bottom out on the same missing thing. Our edges are exact-key SQLite rows: `insertEdge` upserts on `(source_id, target_id, relation, source_anchor, target_anchor)` (`lib/storage/causal-edges.ts:350-352`), contradiction/invalidation queries strictly the same node pair (`lib/graph/contradiction-detection.ts:85-93`), and there are zero grep hits for `embedding|vector|fact_text|cosine|similarity` anywhere in `causal-edges.ts`. So paraphrased-but-equal edges never collapse, a superseding fact about a different node pair is never found, and edges carry no vector to inform triplet-style ranking. The memory-ID graph also has no episode model and runs no LLM in the synchronous insert path, so the substrate cannot live there.

### Constraints

- The synchronous `insertEdge` SQLite txn must not gain an embedding or LLM call.
- The deterministic fused-recall core (`hybrid-search.ts`, Stage-2 fusion) and the same-pair contradiction path must stay byte-identical until a consumer is promoted.
- LLM-judged dedup can silently merge two distinct facts — the campaign's highest tail-risk; it must never merge on uncertainty.
- Recall lift is unmeasurable until the gate-zero corpus reindex (028/001-001) restores the cold/un-embedded rows.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: build the per-edge semantic substrate once, root-first, embed it at consolidation-time off the foreground turn, and ship the whole initiative shadow-gated default-off — promoting each of the five consumers only on benchmark evidence.

**How it works**: an additive, back-compatible migration adds a nullable `fact_text` column to `causal_edges` plus a dedicated edge-vector collection that mirrors the existing `ports/vector-store.ts`. `GR-fact-embedding-on-edge` is the substrate root: a flag-gated pass inside `runConsolidationCycle` (`lib/storage/consolidation.ts:499`) embeds each edge's fact text into that collection. The other four — edge-vector lookup, edge-aware-triplet scoring (Cognee `brute_force_triplet_search.py:263-287`), LLM-judged semantic dedup/merge (Graphiti `edge_operations.py:684-749`), and cross-pair semantic invalidation (Graphiti `EDGE_HYBRID_SEARCH_RRF`, `edge_operations.py:407-418`) — read that one collection through a new `edge-semantic-retrieval.ts` primitive, each behind its own default-off flag. A benchmark run after the gate-zero reindex reports recall lift, dedup precision/recall, and false-merge rate to drive each promotion decision.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Substrate-first, consolidation-time, shadow-gated, five-as-one (chosen)** | Builds the recurring gate once; deterministic + insert paths provably protected; no-op rollback; reuses the existing vector-store port | High upfront cost + a schema migration before any single candidate pays off | 9/10 |
| Ship the five candidates as separate quick wins | Each looks small in isolation | None ships cheaply alone — all need the same absent substrate, so five fragile half-builds (`synthesis/06:168`) | 2/10 |
| Embed at insert-time | Edges embedded immediately | Injects embedding/LLM into the synchronous deterministic SQLite write path — the iter-21 caveat | 1/10 |
| Adopt an episode model to mirror Graphiti/Cognee directly | Closest port of the source designs | Out of scope — a separate schema-level build; the memory-ID graph has no episode model (`synthesis/06:156`) | n/a |

**Why this one**: the substrate is the recurring gate behind all five candidates, so building it once and reading it from a shadow side-channel is the only path that unlocks them together without risking the deterministic core or the synchronous insert path.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Edges become semantically retrievable, so dedup collapses paraphrase-equal edges, invalidation finds superseding facts across different node pairs, and triplet scoring can weigh the edge — once promoted.
- One substrate serves five candidates instead of five competing half-builds.

**What it costs**:
- High upfront work plus a schema migration before any candidate pays off. Mitigation: additive/back-compatible migration and reuse of the established `ports/vector-store.ts` rather than a parallel embedding stack.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM-judged dedup silently merges two distinct facts | H | Exact-key fast-path first; never merge on adjudication uncertainty; shadow-only until a false-merge benchmark clears the bar |
| Embedding leaks into the synchronous insert path | H | Embed only at `runConsolidationCycle`; insert-path diff = zero |
| Migration breaks existing edge reads | H | Additive nullable column + separate collection; back-compat migration test |
| Promotion on structural inference, not measured lift | M | Shadow telemetry from day one; benchmark post-reindex gates every promotion |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Edges are exact-key-only with no vector/fact text (0 grep hits, `causal-edges.ts`); the substrate gap is real and confirmed (iters 19/21) |
| 2 | **Beyond Local Maxima?** | PASS | Five-as-quick-wins, insert-time embedding, and episode-model adoption were each weighed and rejected |
| 3 | **Sufficient?** | PASS | One root substrate + a consolidation embedder + a shadow retrieval primitive is the minimal shape that unlocks all five; the deterministic core is untouched |
| 4 | **Fits Goal?** | PASS | Directly serves the Memory MCP retrieval-intelligence goal; Wave-2 prove-first slot |
| 5 | **Open Horizons?** | PASS | The edge-vector collection + retrieval primitive are reusable by any future edge-intelligence work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp_server/lib/storage/causal-edges.ts` (modify): additive `fact_text` column; exact-key upsert (`:350-352`) unchanged.
- `mcp_server/lib/storage/edge-vector-store.ts` (new): dedicated edge-relationship vector collection + nearest-edge lookup.
- `mcp_server/lib/storage/consolidation.ts` (modify): flag-gated edge-embedding pass in `runConsolidationCycle` (`:499`).
- `mcp_server/lib/graph/edge-semantic-retrieval.ts` (new): nearest-edge lookup + edge-aware-triplet scorer.
- `mcp_server/lib/graph/contradiction-detection.ts` (modify): shadow-gated cross-pair invalidation path; same-pair (`:85-93`) unchanged when off.
- `mcp_server/lib/search/search-flags.ts` (modify): `SPECKIT_SEMANTIC_EDGE_LAYER` + four consumer flags, default-off.

**How to roll back**: all flags are default-off, so deployed callers are unaffected — no live rollback is needed. To fully revert, drop the consumer modules and the consolidation embedding pass on the branch and optionally down-migrate the inert `fact_text` column and edge-vector collection; the synchronous insert path and live recall were never changed, so there is nothing to restore there.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
