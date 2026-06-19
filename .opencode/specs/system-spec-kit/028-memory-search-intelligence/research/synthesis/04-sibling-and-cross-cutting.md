# 04 — Sibling-Subsystem + Cross-Cutting Additions (child 006, +50 iters → 200)

> Child `006-sibling-revisit` extended the campaign from 150 → **200 iterations** along the axes 005 scoped out: 028's **Advisor + Code-Graph** candidates × 027's shipped code, the skipped **aionforge-procedural** crate, and ~12 fresh external/cross-cutting angles (security, CRDT, provenance-signing, namespace-auth, cost/prompt-cache, ops-recovery, MCP transports, spec-kit validation, agent-nudges, audit/PPR, core-memory, decay-importance, convergence-STOP, /doctor, Code-Mode, test-scaffolding, failure-mode), plus a second-pass adversarial GO re-verify. Full detail: **`../../001-speckit-memory/research/from-006-sibling-revisit/research.md`**. This doc folds the result into the consolidated GO picture (`01-go-candidates.md`) — read both.

## What 006 changed about the GO list

### NET-NEW candidates to add (cross-cutting — invisible to any single-subsystem pass)

| Candidate | Wave | Lev/Eff | One-line |
|---|---|---|---|
| **ANN tie-stable ORDER BY** | **Wave-0** | H / S | append `, m.id ASC` (COALESCE) to the 4 ranked ANN `ORDER BY distance` (`vector-index-queries.ts:169,199,458,570`) — determinism *below* RRF; which rows survive the LIMIT into fusion is run-to-run unstable today. The strongest cheap determinism win the fusion-layer pass couldn't see. |
| **Constitutional self-edit / CAS guard** | **Wave-0** | H / S | non-self-edit assertion + `expectedHash` precondition on the constitutional edit path (`memory-crud-update.ts:94-97` already knows the row is constitutional). Closes a self-rewrite hole 027's automated-vs-manual guard structurally can't express. |
| **source_kind-gated render escaper** (the correct shape of C8) | Wave-1 | H / M | promote `sanitizeSkillLabel` (`render.ts:81-97`) to a shared render-boundary escaper on the recalled **content body** (`memory-triggers.ts:703-729`), gated by the already-stored `source_kind`. The trust tag survives to render but is never consumed there. |
| **Fan-out transient/fatal retry** | Wave-1 | MED-H / M | classify `timedOut`/exit-code, re-dispatch the failed lineage alone with a bounded budget (the pool's `failed` ledger events are a ready resumable substrate). |
| **Advisor embedding-staleness signal** | Wave-1 | M-H / S-M | stamp embedder id/version into the advisor projection, compare on load (mirror `memory_embedding_reconcile`) — `generatedAt = now` masks embedder drift today. |
| **Transport idempotency** (token through daemon IPC) | Wave-2 | M / M | the receipt is stored after+outside the save txn, so commit-then-die replays duplicate the secondary index; thread the token into the handler. |
| **Fingerprint-absence → WARN** | Wave-2 (gated+backfilled) | M / S | freshness gate skip-PASSes on absent/zero fingerprint; promote to WARN. ~667 impl-summaries lack one, 0 grandfathered — but default-OFF flag = 0 default blast radius; **must backfill before flipping**. |
| **Enrichment retry-budget + dead-letter** | Wave-2 | L-M / M | bound the boot-time enrichment replay; add a terminal `failed` state (poison-pill re-enriches forever today). |
| **Red-team probe-gate (aggregation)** | Wave-1 | H / L-M | a single named CI gate with structured reports over the existing per-seam sanitizers + a new deep-loop prompt-pack render probe. |
| **Q3-C1 seeded PPR** (Code-Graph) | Wave-2 | M / M-H | net-new query-seeded multi-hop impact ranking (027 has only edge-count/degree; the old PageRank helper was "never wired"). |

### REVISIONS / DEFERS to candidates already on the list

- **C4-B `derived_id`** — must **include anchors** (legacy UNIQUE is anchor-inclusive) and refine the canonical-field order + kind-tag (aionforge identifier recipe). Confirmed clean-additive (restore preserves id; rowid-alias PK, not AUTOINCREMENT).
- **C5-B** — confirmed **S** (content_hash already on the comparator rows via `m.*`; COALESCE to id for the BM25 path).
- **Advisor C1 + QCR → DEFER** — C1 fixes a non-problem (all `conflicts_with` arrays empty in production); QCR is speculative (the intent table is benchmark-overfit but shows no demonstrated mis-routing, and QCR can't retire it). Defer behind C3/C5.
- **Code-Graph Q1-C1 + Q6-C1 (bi-temporal) → DEFER-speculative** — no consumer wants as-of/time-travel; Q6-C1's safety is redundant with the shipped readiness gate; and it doesn't fix the one real bug (edge-staleness). roadmap's own "edge-bitemporal NO-GO as-scoped" stands.
- **C8 → reclassified** — the naive cross-cutting generalization is **refuted/reachability-gated** (Code-Graph render is escaped+trusted; the Deep-Loop sink is dead-code). The real, robust shape is the **source_kind-gated content-body escaper** above.
- **procedural-outcome-ranking → PROXY-ONLY** — no execution-success emitter exists (the Completion-Verification gate has zero skill attribution; only recommendation-acceptance is captured). A real emitter is a net-new build, not a free byproduct.
- **CG-edge-staleness** — corrected: the skip is **content-hash-gated, not mtime**; the real gap is **dependency-transitivity** (`queryFileImportDependents` wired only to reads).

### Cross-subsystem overlaps (noted for the implementation packet; not separate GOs)

- **Idempotent async-consolidation → Advisor projection.** The receipt + retry-budget/dead-letter pattern (C4-A, PQ2/PQ4) maps onto the Advisor's async **embedding projection** (SA8): the same "durable cursor + bounded retry + idempotency token" shape applies to the projection rebuild, not just memory save. Build the shared primitive once, reuse on the advisor side.
- **Seeded-PPR (Q3-C1) × 027's existing causal-BFS traversal.** The net-new query-seeded multi-hop impact ranking should **reuse 027's already-shipped causal-edge BFS traversal substrate** rather than stand up a second graph-walk engine — confirm the traversal API is reusable before building PPR.

## Corrections to the earlier synthesis docs

- **`01-go-candidates.md` keystone** — refine: the **total-comparator alone** is the true keystone (every determinism candidate needs it); content-id A/B is a 2nd-tier dependency for the identity/tiebreak subset. Both gate-free Wave-0.
- **The shared Beta `reliability()`** — NOT "one module, three identical callers": the live integer scorer **throws on the fractional inputs D2 needs**; C4 consumes the posterior as a weight-delta, not a multiplier; the 3rd consumer (procedural) is proxy-only. Build **one f64 primitive + thin per-consumer adapters** (beside `rrf-fusion.ts`).
- **D3 (Deep-Loop convergence two-gate)** — corrected framing: the STOP decision is *already* a non-trading per-signal conjunction (it does not consume the composite score). D3's job is to **reliability-weight the existing conjunction's signals**, not add a gate.

## No-transfer / deflations (don't pursue)

CRDT/concurrent-merge (single-writer correct-by-design) · provenance-signing (no distrusted writer) · galadriel palace (loci-over-folder-scoping; no traversal) · decay-importance (aionforge importance is an anchor, FSRS is richer) · Code-Mode transport (different subsystem; receipt can't lift to external APIs) · galadriel zero-token tier (prompt-caching ≠ retrieval; marginal beyond C9) · attestation-quorum (mostly already mined as D4/C4; quorum half decorative for flag-graduation) · **namespace-authorization** (EXTENDS-low: recall scoping is opt-in not enforced, but cross-namespace recall is a *feature* in a single-tenant store — only an opt-in strict-isolation mode is worth flagging; the erasure-path variant `M-namespace-authorize-before-erase` from 001 iter-12 carries the same disposition — reuse write-authorization on the destructive path *only if* strict isolation is ever adopted).

## Honest note

006 was net-deflationary and self-correcting: it **deferred** 2 advisor + 1 code-graph candidate as non-problems/speculative, **refuted** the cross-cutting C8 generalization, and **downgraded** procedural-ranking to proxy-only — while surfacing genuinely net-new cross-cutting wins (ANN tie-stability, the self-edit guard, the source_kind-gated escaper). No benefit numbers were fabricated; every leverage tag is inferred, not benchmarked. The single most-likely-wrong remains the C8/untrusted-content verdict (threat-model-dependent). Full ledger + evidence: `../../001-speckit-memory/research/from-006-sibling-revisit/research.md`.
