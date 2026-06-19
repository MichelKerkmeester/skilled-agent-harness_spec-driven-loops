# 028 — Consolidated GO Candidates (dependency-ordered)

> The actionable, deduplicated candidate list across ALL THREE bodies of work (external-mining 100-iter + 027-revisit 50-iter + **006 sibling/cross-cutting 50-iter → 200 total**), with **corrected** effort/leverage/seam from the adversarial rounds. Source-tagged: **[XM]** external-mining roadmap, **[R27]** 027-revisit, **[006]** sibling/cross-cutting. Effort/leverage are **structural inference, never benchmarked** (see `03-corrections-caveats-and-residuals.md`). Full evidence: `../roadmap.md` + `../../001-speckit-memory/research/from-005-revisit-027/research.md` + `../../001-speckit-memory/research/from-006-sibling-revisit/research.md`.
>
> **➤ The 006 round (`04-sibling-and-cross-cutting.md`) is folded into the Wave tables below** (tagged `[006]`) plus a dedicated **"200-iteration additions — dropped-candidate recovery"** section near the end. Read `04` for the full 006 net-new rationale + deflations.

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
| **Code-Graph Q4-C1** rank-time trust | Code Graph | **RRF-additive** trust blend (NOT `score×reliability` multiplicative-neutral — that re-orders ties vs the rowid baseline) | `code-graph-context.ts:350-356` | M ⚠needs-benchmark | XM |
| **ANN tie-stable ORDER BY** | Memory | append `, m.id ASC` (COALESCE) to the 4 ranked ANN `ORDER BY distance` — determinism *below* RRF (which rows survive the LIMIT into fusion is run-to-run unstable today); the strongest cheap determinism win the fusion-layer pass couldn't see | `vector-index-queries.ts:169,199,458,570` | S | [006] |
| **Constitutional self-edit / CAS guard** | Memory | non-self-edit assertion + `expectedHash` precondition on the constitutional edit path (the predicate already knows the row is constitutional) — closes a self-rewrite hole 027's automated-vs-manual guard can't express | `memory-crud-update.ts:94-97` | S | [006] |

> **Wave-0 corrections from the 006 / 200-iter review:** **Q6-C1** (generation watermark) → **DEFER-speculative** (redundant with the shipped readiness gate; no consumer — see `04`), removed from Wave-0. **closed-vocab** → **not a Wave-0 flip**: it needs an `edge_type` CHECK table-rebuild migration + `SCHEMA_VERSION` bump + a pre-migration `SELECT DISTINCT edge_type` vocab scan (002 iter-13/23/24), so it moves to the schema-migration wave. **Q4-C1**'s RRF-additive reformulation is **needs-benchmark / effort-M**, not a free S flip (002 iter-20).

## Wave-1 — depends on Wave-0 shared infra (no schema migration)

| Candidate | Subsystem | One-line | Eff | Src |
|---|---|---|---|---|
| **C2-C** graph-expansion gating per retrieval-class | Memory | extend `preserved`/`includeDegree` to turn graph off for single-hop (gated by C2-A classifier) | S | XM |
| **memory_history** valid-time as-of tool | Memory | wire lib-only `resolveLineageAsOf`/`inspectLineageChain` to a new tool — **~5-surface parity add** | M | R27 |
| **gauge `lag`** | Memory | oldest-pending age over the existing `post_insert_enrichment_status` column — **decoupled from C4-C** | S | R27 |
| **forget-allowlist** | Memory retention | 6-label allowlist on the tier basement (allowlist half only; spare-only N/A — 027 sweeps on TTL); needs a label column | M | R27 |
| **source_kind-gated render escaper** (the real C8) | Memory | promote `sanitizeSkillLabel` to a shared render-boundary escaper on the recalled **content body**, gated by the stored `source_kind` (the tag survives to render but is never consumed there) | `render.ts:81-97`; `memory-triggers.ts:703-729` | M | [006] |
| **Fan-out transient/fatal retry** | Deep Loop | classify `timedOut`/exit-code, re-dispatch the failed lineage alone with a bounded budget (the pool's `failed` ledger is a ready substrate) | `fanout-run.cjs:472-489` | M | [006] |
| **Advisor embedding-staleness signal** | Skill Advisor | stamp embedder id/version into the advisor projection, compare on load (mirror `memory_embedding_reconcile`) — `generatedAt=now` masks drift today | `projection.ts:315` | S-M | [006] |
| **Red-team probe-gate (aggregation)** | cross-cutting | one named CI gate w/ structured reports over the existing per-seam sanitizers + a new deep-loop prompt-pack render probe | `tests/` (new aggregator) | L-M | [006] |
| **CG-edge-staleness / dependency-transitivity** | Code Graph | wire `queryFileImportDependents` into the scan loop (read-path only today) so a file whose *dependency* changed (own content-hash stable) re-indexes — the real edge-staleness bug (content-hash-gated, NOT mtime) | `query.ts:1017`; `code-graph-db.ts:1046-1056` | M | [006] |

## Wave-2 — schema-migration / gated

| Candidate | Subsystem | One-line | Gate | Src |
|---|---|---|---|---|
| **C4-B** content-addressed `derived_id` | Memory causal | additive `derived_id TEXT UNIQUE` (rowid-alias PK); **MUST include anchors** or the legacy UNIQUE backfill rejects; column + `CREATE UNIQUE INDEX` | two-primitive module + FK ok | XM/R27 |
| **bi-temporal unify (C3-B)** | Memory | four-timestamp window on causal+lineage (+code_edges); **exclude retention TTL**; **lineage canonical** (causal `invalid_at` derived); real current store = `active_memory_projection` | canonical-writer decision; **additivity UNVERIFIED** | XM/R27 |
| **C3-A** edge-presence currentness | Memory | make "currentness = edge presence" the live retirement path (read-side build + store reconciliation; flag already ON) | C3-B + skip-closed | XM |
| **C3-C TemporalMode** AsKnownAt | Memory | transaction-time recall mode | C3-B | XM |
| **Q1-C1** code-edge bi-temporal | Code Graph | ⚠ **DEFER-speculative** (04/006: no consumer wants as-of/time-travel; safety redundant with the shipped readiness gate; does NOT fix the real edge-staleness bug above). IF ever built: live-view chokepoint (`code_nodes_live`/`code_edges_live` WHERE `invalid_at IS NULL`) is the de-risk prereq; blast-radius MEDIUM-HIGH (whole read/resolve/prune surface, not 4 DELETE lines) | schema migration | XM |
| **C8** untrusted-recall render-escaper | Memory | **real render-gap** — no escaper exists; HOT-tier emits raw content into the agent loop. **Refined shape = the `source_kind`-gated content-body escaper in Wave-1** (the broad cross-cutting-C8 generalization was *refuted/reachability-gated* — see `04`; build the Wave-1 escaper, not a separate generic wrapper). Always-on, reuse 027 scrubber *pattern* | threat-model (Round O: real) | XM/R27 |
| **Transport idempotency** | Memory | thread the idempotency token through daemon IPC into the save handler — the receipt is stored after+outside the save txn, so commit-then-die replays duplicate the secondary index | `memory-save.ts:3775`; `launcher-session-proxy.cjs:151` | M | [006] |
| **Fingerprint-absence → WARN** | Spec-Kit | freshness gate skip-PASSes on absent/zero fingerprint → promote to WARN; default-OFF flag = 0 default blast radius, but **MUST backfill ~667 impl-summaries before flipping** | `continuity-freshness.ts:307-322`; `spec-doc-structure.ts:566` | S (gated+backfilled) | [006] |
| **Enrichment retry-budget + dead-letter** | Memory | bound the boot-time enrichment replay; add a terminal `failed` state (poison-pill re-enriches forever today) | boot enrichment replay | M | [006] |
| **Q3-C1 seeded PPR** | Code Graph | net-new query-seeded multi-hop impact ranking (027 has only edge-count/degree; old PageRank helper "never wired") — reuse 027's causal-BFS traversal (see `04`) | `code-graph-context.ts:627-671` | M-H | [006] |

## Needs validation / benchmark BEFORE go (not Wave-0)

1. **Reliability-weighted learning** (Deep Loop D2/D3/Q2) — D2 is a wholly-absent net-new build (every input `r=0.5`); NO-GO until built + a benefit micro-benchmark. **D3 nuance (006 SA4):** the STOP decision is *already* a non-trading per-signal conjunction (it does not consume the composite score) — D3's job is to **reliability-weight that conjunction's signals**, not to add a gate.
2. **Promote-off-state cluster** — 0-of-4 clean flips; C3-A is a read-side build, C4-A needs deferred-wiring.
3. **Advisor C4 / C5** — C4 needs the Beta build (the estimator is raw-frequency, no Beta math); C5's "~13%" is unsourced — capture a baseline.
4. **Code-Graph bi-temporal / PPR** — shared schema migration; PPR unbuilt.

## Shared infrastructure (build once, reuse N)

- **Two content-id primitives** (A `computeContentHash` content-body; B `hashJson` canonical-field) — NOT one hash; centralize the *formula*, parameterize the *identity* (divergence-from-stored-hash + receipt-semantics risk). The `derived_id` **must include anchors** + canonical-field order + kind-tag (006 RC2).
- **Bounded Beta posterior** — shared by Advisor C4 + Deep-Loop D2. **Corrected (006 RC6): NOT "one module, three identical callers."** Build **one f64 primitive** `(α₀+s)/(α₀+β₀+s+f)` + thin **per-consumer adapters** — the live integer scorer **throws on the fractional inputs D2 needs** (`bayesian-scorer.ts:182-191`); C4 consumes the posterior as a weight-delta (not a multiplier); the 3rd consumer (procedural) is proxy-only. NOT Memory (Q4 no-transfer).
- **Bi-temporal validity-window** — shared by Memory causal+lineage + Code-Graph code_edges; retention excluded.
- **Total-comparator is THE keystone** (006 SA7): every determinism candidate needs a hand-written total comparator (JS `(a,b)=>b-a` is not a total order — NaN/−0 poison it). The **content-derived-id is 2nd-tier** — a dependency only for the identity/tiebreak subset, not co-equal. Both are gate-free Wave-0.

## 027-internal hardening (surfaced by the revisit; NOT 028 transfers)

- Q4 sliding-TTL absolute-`deleteAfter` ceiling (needs `created_at` plumbed onto the retention row).
- `search-results.ts:528` `ce.edge_id` CTE-alias quirk; the stale `causal-edges.ts:346-347` `last_insert_rowid()` comment.

## 200-iteration additions — dropped-candidate recovery (the fresh-agent review's net-new)

The fresh-agent synthesis review found candidates **confirmed in the banked record but absent from every list above** (neither GO'd nor deflated). Recovered here so nothing is silently dropped; Memory items trace to `001-speckit-memory/research/deltas/`, Deep-Loop to `004-deep-loop/research/deltas/`.

**Memory — forgetting / erasure / consolidation / security cluster (001 iters 12/13/15/19):**

| Candidate | One-line | Seam | Eff | Disposition |
|---|---|---|---|---|
| **M-residual-retention-report** | `delete` returns an `EraseReport.residual_retention` disclosing where bytes still physically live (dead row slots + vector tombstones until compact) rather than overclaiming "gone" | `vector-index-mutations.ts` | S | **GO (Wave-1)** — additive field on the existing sweep result |
| **M-never-truncate-always-surface** | the constitutional always-surface prefix counts toward the limit but is **never itself capped** — fixes a silent truncation where constitutional fills the slice and starves regular results | `vector-index-queries.ts:435` | S | **GO (benchmark-gated** — result-set change; distinct from C7-A dominance cap) |
| **M-system-kind-exclusion** | exclude `system`-kind / substrate-internal rows from default recall (admin path to surface) | `formatters/search-results.ts`; `write-provenance.ts:7` | S | **GO (Wave-0/1)** — cheap recall-correctness + noise reduction |
| **M-detail-retention-guard** | a derived summary must name ≥ `entity_retention_threshold(0.9)` of distinct entities AND mean source confidence ≥ 0.6, else skip-not-write (anti-lossy-summary) | `handlers/pe-gating.ts` | M | **GO** — pairs with the C4-C consolidation cluster |
| **M-write-time-injection-filter** | strip imperative-override/prompt-injection markers + flag at **capture** (fail-closed) — the capture-side half of C8 (redaction is secrets-only today) | `redaction-gate.ts:26-27` | M | **GO** — orthogonal to the recall-side escaper; 001 iter-19 names it a HIGH net-new |
| **M-erasure-cascade-refuse-whole** | hard-purge cascade walks incoming `DERIVED_FROM` to a fixed point on one read-only snapshot; a derivative is doomed only if all sources are | `tools/memory-tools.ts` | L | **DEFER → own packet** (only in aionforge `purge_write.rs`, not the TS server) |
| **M-unforget-channel-disjointness** | four revision channels leave disjoint `(expired_at,status,edge)` fingerprints so `unforget(id)` is a safe bare-key removal | `temporal-edges.ts` | M | **DEFER** (needs-benchmark; extends C3-D 2→4 channels) |
| **M-exfil-audit-no-querytext** | audit a namespace denial **without** storing the probe query text (so the audit log isn't itself an exfil channel) | audit path / `tests/` | M | fold into the **Red-team probe-gate** as a sub-requirement |

**Deep Loop — recovery / resilience cluster (004 iters 7/9/12):**

| Candidate | One-line | Seam | Eff | Disposition |
|---|---|---|---|---|
| **DL-graceful-self-stop** | flush a partial summary with a `stopped` marker on SIGINT/SIGTERM (children die silently today) + treat an empty/no-new-findings tick as **valid convergence**, not failure | `fanout-run.cjs:354,370-373` | S | **GO** — confirmed clean (its sibling failure-class-taxonomy already shipped in the Deep-Loop trio) |
| **DL-orphan-lineage-reset** | on resume, reset/requeue lineages that started without a terminal event (detection primitives exist; nothing requeues today) | `fanout-pool.cjs:82-108` | M | **GO (detect/marker)** / **CAUTION (auto-redispatch** — pending a lease/heartbeat); distinct from fan-out transient-retry |
| **DL-recover-vs-fresh-gate** | a resume that should validate existing JSONL state must **refuse** a missing/empty/corrupt state rather than silently fresh-init (status defaults to `initialized` today) | `reduce-state.cjs:434` | M | GO — pairs with the recovery cluster |

**Residual (not a GO — a known non-consumption defect):** **DL-newInfoRatio** is computed and named in the STOP rationale but **never consumed** in the *structured* convergence module (`convergence.cjs:285,378-381`) — wire it into the structured consumer, or track as a known residual. (The prose loop does consume it.)

**Deep-Loop verification + benchmark residuals (004 iters 11/12/13):** an **order-invariance property test** (iter-11) should be the verification gate on the captured merge-tiebreak GO; the **shutdown-summary heartbeat half** (iter-12 — distinct from graceful-self-stop's `stopped` marker: periodic progress within a long single lineage) and a **cross-lineage contradiction record** (keep-both, iter-13) are needs-benchmark residuals, not GOs.

**Caveat correction — Advisor C5 is not a free fix:** naive runtime-empty lane elision can't distinguish a **degraded-empty** lane (mid-rebuild) from a **matched-nothing-empty** lane, so it would over-credit non-matching skills — skew *opposite* the bug it fixes. It needs a **runtime lane-health signal as a P0 prerequisite** (003 iter-14 G14-03, iter-16 J16-01): elide only lanes flagged runtime-degraded, not zero-match.

**Note on C4-A:** its surviving value is **receipt-default-on + content-addressed idempotent ids**; the "wire replay/conflict into the deferred-save path" leg was refuted (001 iter-27) — see `03 §A`.

## Follow-ups (separate packets)

- ~~Mine `aionforge-procedural`~~ **DONE (006):** the crate was mined; **procedural-outcome-ranking is PROXY-ONLY** — no execution-success emitter exists (only recommendation-acceptance is captured), so Beta-reliability-over-execution-outcomes is a net-new write-path build, not a free byproduct. Residual follow-up: *build an execution-success emitter first* if task-success ranking is wanted.
- One benefit micro-benchmark (D2 reliability or C2-C single-hop gating) to convert the highest residual unknown into a measured delta.
- Sibling-subsystem cross-packet reconciliations: 028-Advisor-C4 × 027-advisor-calibration; 028-Code-Graph cluster × 027-codegraph-tombstone (see `02`).
