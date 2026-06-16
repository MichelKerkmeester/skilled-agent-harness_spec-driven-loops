# 028 — Consolidated GO Candidates (dependency-ordered)

> The actionable, deduplicated candidate list across BOTH bodies of work (external-mining 100-iter + 027-revisit 50-iter), with **corrected** effort/leverage/seam from the adversarial rounds. Source-tagged: **[XM]** external-mining roadmap, **[R27]** 027-revisit. Effort/leverage are **structural inference, never benchmarked** (see `03-corrections-caveats-and-residuals.md`). Full evidence: `../roadmap.md` + `../../005-revisit-027/research/research.md`.

## Wave-0 — ship-first (independent, reversible, S-effort, no benchmark)

| Candidate | Subsystem | One-line | Seam | Eff | Src |
|---|---|---|---|---|---|
| **Q6-anchor FIX** | Deep Loop | shipped `deep_research_strategy.md` template carries 0 of the 7 `<!-- ANCHOR:* -->` markers `reduce-state.cjs` requires → reducer hard-fails on first reduce. Template-only. **The one unconditional win.** | strategy template | S | XM |
| **C4-A** idempotency-receipts default-on | Memory | the one *literal* off-state flip — but **flip + deferred-save wiring** (canonical/planner path is receipt-excluded); flag is overloaded (also enables near-dup hints) | `idempotency-receipts.ts`; `memory-save.ts:3547,3655` | S→M | XM/R27 |
| **C-X1 'active'** + **C6-A** rank-time-decay clock | Memory | active-channel bonus denominator (already live; expose as named param) + always-on rank-time decay | `rrf-fusion.ts:296-371`; `stage2-fusion.ts:897-908` | S→M | XM |
| **Deep-Loop trio** | Deep Loop | merge-tiebreak / failure-class / pool gauges (ship with the WEAKER caveats: merge keys id‖title; class computed upstream) | `fanout-merge.cjs`; `fanout-pool.cjs` | S | XM |
| **C5-B** content-derived tiebreak | Memory/Advisor | `content_hash`-asc tiebreak; **S** — content_hash already on rows via `m.*`; COALESCE to id for BM25/nullable. Value = content-derived *stability* (comparator already total via rowid) | `ranking-contract.ts:46-53`; `rrf-fusion.ts:255` | S | XM/R27 |
| **C9** graceful embedder-degrade | Memory | recall THROWS on null embedding; degrade to lexical + report. **Net-new for recall** (027 embedder subsystem is storage-side only) | `stage1-candidate-gen.ts:705-706` | S | XM/R27 |
| **two-primitive content-id module** | Memory | Primitive A `computeContentHash` (formula promotable) + Primitive B `hashJson`. **Parameterize identity** — legacy hashes are bare-hex; B's token-stripping is receipt-specific | `memory-parser.ts:914-916`; `idempotency-receipts.ts:59-102` | S→M | R27 |
| **gauge pending/failed** | Memory | alias onto `getBackgroundEnrichmentStats` (no new state) | `memory-save.ts:2954-2972` | S | R27 |
| **skip-closed-in-sweep** | Memory causal | `AND invalid_at IS NULL` on the promoter cleanup — **defensive hardening before C3-A, NOT a gate** (fork is theoretical + tombstone-recoverable) | `frontmatter-promoter.ts:304-318` | S | R27 |
| **Code-Graph Q6-C1 / closed-vocab / Q4-C1** | Code Graph | generation watermark + closed-vocab + rank-time trust (**RRF-additive, not multiplicative-neutral**) — each with its J-round caveat | `code-graph-context.ts` | S | XM |

## Wave-1 — depends on Wave-0 shared infra (no schema migration)

| Candidate | Subsystem | One-line | Eff | Src |
|---|---|---|---|---|
| **C2-C** graph-expansion gating per retrieval-class | Memory | extend `preserved`/`includeDegree` to turn graph off for single-hop (gated by C2-A classifier) | S | XM |
| **memory_history** valid-time as-of tool | Memory | wire lib-only `resolveLineageAsOf`/`inspectLineageChain` to a new tool — **~5-surface parity add** | M | R27 |
| **gauge `lag`** | Memory | oldest-pending age over the existing `post_insert_enrichment_status` column — **decoupled from C4-C** | S | R27 |
| **forget-allowlist** | Memory retention | 6-label allowlist on the tier basement (allowlist half only; spare-only N/A — 027 sweeps on TTL); needs a label column | M | R27 |

## Wave-2 — schema-migration / gated

| Candidate | Subsystem | One-line | Gate | Src |
|---|---|---|---|---|
| **C4-B** content-addressed `derived_id` | Memory causal | additive `derived_id TEXT UNIQUE` (rowid-alias PK); **MUST include anchors** or the legacy UNIQUE backfill rejects; column + `CREATE UNIQUE INDEX` | two-primitive module + FK ok | XM/R27 |
| **bi-temporal unify (C3-B)** | Memory | four-timestamp window on causal+lineage (+code_edges); **exclude retention TTL**; **lineage canonical** (causal `invalid_at` derived); real current store = `active_memory_projection` | canonical-writer decision; **additivity UNVERIFIED** | XM/R27 |
| **C3-A** edge-presence currentness | Memory | make "currentness = edge presence" the live retirement path (read-side build + store reconciliation; flag already ON) | C3-B + skip-closed | XM |
| **C3-C TemporalMode** AsKnownAt | Memory | transaction-time recall mode | C3-B | XM |
| **Q1-C1** code-edge bi-temporal | Code Graph | `valid_at`/`invalid_at` on `code_edges`; non-destructive reindex | schema migration | XM |
| **C8** untrusted-recall render-escaper | Memory | **real render-gap** — no escaper exists; HOT-tier emits raw content into the agent loop. Always-on, reuse 027 scrubber *pattern* | threat-model (Round O: real) | XM/R27 |

## Needs validation / benchmark BEFORE go (not Wave-0)

1. **Reliability-weighted learning** (Deep Loop D2/D3/Q2) — D2 is a wholly-absent net-new build (every input `r=0.5`); NO-GO until built + a benefit micro-benchmark.
2. **Promote-off-state cluster** — 0-of-4 clean flips; C3-A is a read-side build, C4-A needs deferred-wiring.
3. **Advisor C4 / C5** — C4 needs the Beta build (the estimator is raw-frequency, no Beta math); C5's "~13%" is unsourced — capture a baseline.
4. **Code-Graph bi-temporal / PPR** — shared schema migration; PPR unbuilt.

## Shared infrastructure (build once, reuse N)

- **Two content-id primitives** (A `computeContentHash` content-body; B `hashJson` canonical-field) — NOT one hash; centralize the *formula*, parameterize the *identity* (divergence-from-stored-hash + receipt-semantics risk).
- **Bounded Beta posterior** — shared by Advisor C4 + Deep-Loop D2 (neither ships it; build once, wire twice). NOT Memory (Q4 no-transfer).
- **Bi-temporal validity-window** — shared by Memory causal+lineage + Code-Graph code_edges; retention excluded.
- **Total-comparator + content-derived-id** — every determinism candidate needs a hand-written total comparator (JS `(a,b)=>b-a` is not a total order).

## 027-internal hardening (surfaced by the revisit; NOT 028 transfers)

- Q4 sliding-TTL absolute-`deleteAfter` ceiling (needs `created_at` plumbed onto the retention row).
- `search-results.ts:528` `ce.edge_id` CTE-alias quirk; the stale `causal-edges.ts:346-347` `last_insert_rowid()` comment.

## Follow-ups (separate packets)

- Mine `aionforge-procedural` (outcome-weighted skill ranking for the Advisor — the one external crate skipped).
- One benefit micro-benchmark (D2 reliability or C2-C single-hop gating) to convert the highest residual unknown into a measured delta.
- Sibling-subsystem cross-packet reconciliations: 028-Advisor-C4 × 027-advisor-calibration; 028-Code-Graph cluster × 027-codegraph-tombstone (see `02`).
