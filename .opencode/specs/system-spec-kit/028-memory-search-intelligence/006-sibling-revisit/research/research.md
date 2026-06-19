---
title: "Research Report: Sibling-Subsystem Revisit + Cross-Cutting Follow-ups (028 × 027)"
description: "50 read-only iterations extending child 005: reconcile 028's Skill-Advisor + Code-Graph findings against 027's shipped code, mine the skipped aionforge-procedural crate + ~12 fresh external/cross-cutting angles, and second-pass adversarially verify the top GO candidates. Brings packet total to 200."
trigger_phrases:
  - "028 sibling subsystem revisit ledger"
  - "advisor codegraph 027 reconciliation"
  - "untrusted output boundary source_kind render escaper"
  - "constitutional self-edit guard ann tie-stability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-sibling-revisit"
    last_updated_at: "2026-06-17T07:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled 006 ledger tally to NET-NEW x10 + orphaned-row dispositions"
    next_safe_action: "Fold the 006 net-new candidates + deflations into a 028 implementation packet"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "../research/synthesis/04-sibling-and-cross-cutting.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-006-sibling-revisit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "028's Advisor + Code-Graph candidates mostly EXTEND 027 (additive, different axis); two advisor candidates (C1, QCR) DEFER as non-problems; the code-graph bi-temporal cluster DEFERs as speculative (no consumer)."
      - "The strongest net-new is cross-cutting: a constitutional self-edit/CAS guard, ANN tie-stable ORDER BY, and a source_kind-gated render escaper — but the naive 'cross-cutting C8' generalization was refuted as reachability-gated, and procedural-outcome-ranking downgraded to proxy-only (no execution-success emitter exists)."
---

# Research Report: Sibling-Subsystem Revisit + Cross-Cutting Follow-ups (028 × 027)

> **Scope.** Child 005 reconciled 028's **Memory** findings against 027 and flagged two sibling overlaps it scoped out (Advisor, Code-Graph) plus the aionforge-procedural follow-up. This child (50 read-only iterations, Rounds P→Q→R→S, packet total **200**) closes those, mines ~12 fresh external/cross-cutting angles, and second-pass **adversarially re-verifies** the top GO candidates. Read-only; extends the 028 roadmap + the 005 ledger. Findings/effort are structural inference, never benchmarked. **This research.md is authoritative for the 006 packet** (per the sprint deviation, per-iteration deltas/md were consolidated here; the count lives in `deep-research-state.jsonl`).

## Executive summary

The round was **net-additive with heavy, self-correcting deflation**. The sibling reconciliations confirm 028's Advisor/Code-Graph candidates mostly **extend** 027 on a different axis — but second-pass verification **deferred** the two weakest advisor candidates (C1, QCR are fixes for non-problems) and the entire code-graph bi-temporal cluster (no consumer; its safety claim is redundant with the shipped readiness gate). The richest yield is **cross-cutting net-new** that no single-subsystem pass could see — and even there, adversarial re-verify refuted the headline "cross-cutting C8" generalization and downgraded procedural-ranking to proxy-only. The single most valuable synthesis: the trust tag that should gate render-escaping (`source_kind`) **already survives to render — it is simply never consumed there**, which shrinks the C8 fix to one source_kind-gated escaper on the recalled content body.

---

## Ledger A — 028 Skill-Advisor × 027 (live advisor code)

| 028 candidate | Verdict | Evidence |
|---|---|---|
| **C3** import shared RRF | **EXTENDS** | 027 advisor fusion is a raw-score weighted SUM, not RRF (`fusion.ts:366,372`); shared `fuseResultsMulti` never imported. Net-new rank-based fusion (the determinism spine for C1/C5). |
| **C5** runtime-empty lane elision | **EXTENDS** | `liveTotal` filters config-disabled only, not runtime-empty (`fusion.ts:343-345`); a live-but-empty lane skews `liveNormalized` (`:388`). The "~13%" is literally the `0.13` graph_causal lane weight (`lane-registry.ts:11`) re-labeled — *not measured*, and it divides all survivors equally → only matters near the 0.70/0.35 gates. S; needs a baseline. |
| **C4** bounded-Beta lane auto-tune | **EXTENDS (build, not graduation)** | 027 phase-005 shipped the outcome→delta→shadow-weight pipeline; the live estimator IS raw-frequency (`feedback-calibration.ts:175-177`, no α/β). C4 = swap the estimator to Beta — but 027 shipped **no lane attribution** (`impl-summary:110`), so a Beta *lane* tune needs net-new attribution → bigger than a math swap. |
| **C1** split-conflict re-rank | **DEFER (non-problem)** | 027 conflict mass is real but **inside** fusion, subtractive (`graph-causal.ts:18` `-0.35`); C1 moves it outside (multiplicative). But **every `conflicts_with`/`n` array across ~25 `graph-metadata.json` is EMPTY** (only test fixtures populate it) → C1 re-ranks mass that doesn't exist. Defer until a real conflict edge is authored. |
| **QCR** query-class per-lane weights | **DEFER (speculative)** | The lane-weight axis is intent-blind (`effectiveScorerWeights fusion.ts:69-82`) and QCR's injection seam exists (free plumbing). But the `primaryIntentBonus` table it would generalize is overfit to the 028 benchmark corpus, and the known routing disagreements are *approved baselines*, not failures — **no demonstrated mis-routing**; and QCR (class-level) can't retire the fine per-phrase table anyway. Defer behind C3/C5. |

## Ledger B — 028 Code-Graph × 027 (live code-graph code)

| 028 candidate | Verdict | Evidence |
|---|---|---|
| **Q4-C1** rank-time trust multiplier | **EXTENDS (net-new)** | confidence/evidenceClass are formatting-only + a binary `minConfidence` filter (`query.ts:1016,1051`), never scored; `effectiveScore`/`reliability` appear nowhere. Net-new rank-time RRF-additive blend. M. |
| **Q3-C1** seeded PPR impact ranking | **NET-NEW** | zero graph-walk in 027 — all ranking is edge-count/1-hop degree; the PageRank helper was removed ("never wired", `MODULE_MAP.md:208`). Schema-coupled (reindex txn), MED-HIGH effort. |
| **Q2-C1** transient/fatal parser-skip + bounded retry | **EXTENDS** | 027 has B1/B2/OTHER crash-cohort classify + an `attempt_count` counter but **no `max_retries` ceiling**, and `recordSuccess` is a deprecated no-op → skip is **permanent**. Correction: 027's poison-file failure mode is *permanent drop*, not *wedge*; Q2-C1's transient tier **recovers** falsely-skipped files. Parse-time only (cheap). |
| **CG-incremental-edge-staleness** (005 gap) | **EXTENDS + corrects the gap** | the skip is **content-hash-gated, NOT mtime** (`isFileStale code-graph-db.ts:1046-1056`). The real gap is **dependency-transitivity**: `queryFileImportDependents` is wired only to the read path (`query.ts:1017`), never the scan loop → a file whose dependency changed (own content stable) is skipped, edges go stale, no repair. M (the dependents query already exists). |
| **Q1-C1 + Q6-C1** bi-temporal + generation watermark | **EXTENDS, but DEFER-speculative** | 027 ships only the bounded default-off tombstone-*audit* (not soft-delete); code_edges has no temporal columns; reindex hard-DELETEs. BUT the as-of/time-travel capability has **no named consumer** (the only freshness consumer reads the binary `graph_available` envelope, already present), Q6-C1's "never serve stale" safety is **redundant** with `shouldBlockReadPath` (already fail-safe-degrades), and the L-migration does **not** fix the one real bug (the edge-staleness above). roadmap itself: "edge-bitemporal NO-GO as-scoped." |

## Ledger C — aionforge-procedural × Skill-Advisor (the skipped crate)

| Candidate | Verdict | Evidence |
|---|---|---|
| **outcome-weighted skill ranking** (Beta reliability over execution outcomes) + per-skill failure-mode recall | **PROXY-ONLY (downgraded from net-new)** | The crate ranks by Beta reliability over *execution* outcomes (`ranking.rs:18-22`); the advisor has no such signal. BUT the named write-path emitter **does not exist**: the Completion-Verification gate has zero skill attribution (`grep skill validate.sh = 0`), and the only per-skill signal is *recommendation acceptance* (`accepted/corrected/ignored`, `metrics.ts:40`), explicitly disclaimed for richer capture. So a real execution-success emitter is a **net-new build, not a free byproduct** — building on the proxy yields routing-quality ranking, not task-success ranking. |

---

## Cross-cutting NET-NEW (what only a multi-subsystem pass surfaces)

| Candidate | Leverage/Effort | Evidence |
|---|---|---|
| **Constitutional self-edit / CAS guard** (RC3) | **H / S** | Spec-Kit guards automated-vs-manual but has **zero** self-rewrite protection (editor-exclusion/quorum/CAS-on-prior-hash all absent, grep empty). A drifting agent self-asserting `human`, or editing the constitutional `.md` directly, rewrites its own redline with no second signature. Fix: non-self-edit assertion + `expectedHash` precondition (reuse `getMemoryHashSnapshot`) on the constitutional edit path. The protected-row predicate already knows a row is constitutional (`memory-crud-update.ts:94-97`) — only the identity-vs-self check + CAS are missing. (Avoid the full quorum — over-engineering for a single-tenant store.) |
| **ANN tie-stable ORDER BY** (RC4) | **H / S** | *Below* the RRF layer 028 audited: ranked ANN queries sort on distance with **no tie-stable secondary key** (`vector-index-queries.ts:169,199,458,570`) → which rows survive the LIMIT into RRF can change run-to-run; two ANN surfaces are perf-selected at runtime; vec0 rowid rides a non-AUTOINCREMENT PK. Fix: append `, m.id ASC` (COALESCE) to the 4 ranked ORDER BYs. Strongest determinism win below fusion. |
| **source_kind-gated render escaper** (SB8 — the *correct* shape of C8) | **H / M** | The trust tag that should gate escaping (`source_kind`) **already survives to render — it's just never consumed there** (`search-results.ts:877-881` surfaces it as a badge only), and the only escaper (`sanitizeSkillLabel render.ts:81-97`) guards the skill label, not the recalled content body (`memory-triggers.ts:703-729` passes content raw). Fix: promote `sanitizeSkillLabel`'s primitive to a shared render-boundary escaper on the content body, gated by the stored `source_kind` (pass-through for `human`, escape for `agent`/`import`/`system`). No new capture tag needed. |
| **Fan-out transient/fatal retry** (RC5) | **MED-HIGH / M** | The live fan-out dispatches once, never re-dispatches, no transient/fatal split (`fanout-run.cjs:472-489`); recovery is post-hoc file salvage only. The pool's durable `failed` ledger events are a ready resumable substrate; only the consumer (classify + bounded retry + re-dispatch the failed branch alone) is missing. |
| **Advisor embedding-staleness signal** (SA8) | **M-H / S-M** | The advisor projection stamps `generatedAt = now` at load (`projection.ts:315`), masking embedder-version drift — the "stable source / stale derived artifact" family (same as CG-edge-staleness). No detection, no repair. Fix: stamp embedder id/version into the stored projection, compare on load, flag stale (mirror `memory_embedding_reconcile`). |
| **Transport idempotency** (PQ4, RD3-confirmed real) | **M / M** | The receipt is stored *after* the save and outside the txn (`memory-save.ts:3775`), so a commit-then-die never stored it → proxy replay sees a `miss` → the secondary-index path (un-keyed, `launcher-session-proxy.cjs:151`) duplicates. flag-ON covers a *different* window. Thread the idempotency token through the daemon IPC into the save handler. |
| **Fingerprint-absence finding** (PQ5, RD3-confirmed real) | **M / S** | `spec-doc-structure.ts:566` deliberately rewrites a real fingerprint to the zero sentinel; the freshness gate skip-PASSes on absent/zero (`continuity-freshness.ts:307-322`), reachable via the sanctioned ADR-004 direct-YAML-edit path that skips the stamper. Promote skip-PASS→WARN. **Blast radius: ~667 implementation-summaries lack a fingerprint, 0 grandfathered packets** — but the whole check is default-OFF (`SPECKIT_COMPLETION_FRESHNESS`), so default blast radius is 0; gate the flip behind a backfill. |
| **Enrichment retry-budget + dead-letter** (PQ2) | **L-M / M** | 028's enrichment backfill replays stuck work on every boot but never gives up or counts it (no per-row attempt cap, no terminal `failed`) → a poison-pill re-enriches forever. Add a durable retry budget + terminal state (aionforge episode state machine). |
| **Red-team probe-gate (aggregation)** (SB7) | **H / L-M** | The per-seam injection defenses + tests already exist (`sanitizeSkillLabel` + `architecture-seam.vitest.ts` asserts `'ignore previous instructions'→null`; `bm25-security`, `edge-metadata-sanitize`). Missing: a single named aggregating CI probe-gate with structured reports/zero-ceiling, + a deep-loop prompt-pack render probe (the one uncovered seam). |

---

## Deflations / no-transfer (the round was self-correcting)

- **Cross-cutting "C8" generalization REFUTED → reachability-gated** (RD1). The Code-Graph render is JSON.stringify-**escaped** + trusted-source (repo's own code); the Deep-Loop `prompt-pack.ts:65` sink is real-but-**dead-code** (`renderPromptPack` has zero production callers). C8 stays Memory-focused; the *real* shape is the source_kind-gated content-body escaper above.
- **procedural-outcome-ranking → proxy-only** (RD2, above).
- **CRDT / concurrent-merge → no-transfer** (PD2): aionforge's CRDT is built *on* single-writer; the internal fail-closed lock + add-wins receipts already embody the discipline. Single-writer correct-by-design.
- **provenance-signing → no-transfer-now** (PD3): 027 server-derives provenance; signing needs a distrusted key-holding writer the single-tenant store lacks.
- **namespace-authorization → extends-low** (PD4): recall scoping is opt-in not enforced, but cross-packet recall is a *feature* single-tenant; only an opt-in strict-isolation mode is worth flagging.
- **galadriel palace → no-transfer** (RC1): method-of-loci over folder-scoping + persona partition; no spatial traversal, no eviction. The one orthogonal "hall" content-type facet is low-leverage.
- **decay-importance → no-transfer** (SA3): aionforge importance is author-assigned anchor + time-decay, not learned; Spec-Kit FSRS already richer (adds centrality).
- **Code-Mode transport → no-transfer-different-subsystem** (SA6): real duplicate-side-effect risk, but the receipt model can't be lifted to external APIs; belongs to Code-Mode, not the memory packet. (Flagged a doc defect: SKILL.md "atomic" contradicts the tested CM-025 "best-effort, no rollback".)
- **galadriel zero-token tier → marginal-beyond-C9** (SB6): the lexical substrate + `cheapSeedRetrieve` exist in-tree; galadriel "zero-token" is prompt-caching, not retrieval (category mismatch). The delta over C9 is skipping `generateQueryEmbedding` at the stage1 gate.
- **attestation-quorum promotion → extends, mostly already-mined** (SB5): formalizes 027's qualitative shadow→live gate, but 028 already owns it (D4/C4); the measured-delta threshold transfers, the quorum half is decorative (no independent attesters in flag-graduation).
- **decay-importance, importance-estimation** — none in aionforge to mine.

---

## Syntheses (cross-cutting structure)

- **Keystone build module** (SA7): the **determinism foundation** (total-comparator + content-id primitives A/B) unblocks ~7 candidates across 3 subsystems and is gate-free → build first, in parallel with the source_kind escaper. *Correction:* the **total-comparator alone** is the true keystone (every determinism candidate); content-id A/B is a 2nd-tier dependency for the identity/tiebreak subset. Bi-temporal + Beta trail (schema/benchmark gated).
- **Identifier recipe** (RC2, iter-25 — grounds 04's C4-B/C5-B revisions in this ledger): the content-id primitives should follow the aionforge identifier discipline — the `derived_id` **must include anchors** (the legacy UNIQUE is anchor-inclusive, so an anchor-excluding backfill rejects), order the canonical fields deterministically + add a kind-tag, and a restore must **preserve** the id (rowid-alias PK, not AUTOINCREMENT). This is the source-of-truth for the recipe summarized in `04`.
- **D3 convergence framing corrected** (SA4): the STOP decision (`convergence.cjs:378-381`) is *already* a non-trading per-signal conjunction with blocking-guards — it does **not** consume the composite score. D3's real job is to **reliability-weight the existing conjunction's signals**, not to "add a gate to the composite."
- **Shared Beta `reliability()`** (RC6): one f64 primitive `(α₀+s)/(α₀+β₀+s+f)` + thin per-consumer adapters — NOT "one module, three identical callers." The live integer scorer **throws on the fractional inputs D2 needs** (`bayesian-scorer.ts:183-191`); C4 consumes it as a weight-delta not a multiplier; the 3rd consumer (procedural) is proxy-only. Build the f64 primitive beside `rrf-fusion.ts`, carry the flood-resistance invariants, adapt per consumer.

---

## Honest close

- **Verdict tally (006):** EXTENDS ×7 (C3, C5, C4, Q4-C1, Q2-C1, CG-edge-staleness, namespace-auth) · NET-NEW ×10 (Q3-PPR, RC3 self-edit, RC4 ANN-tie, RC5 fanout, SA8 advisor-staleness, SB7 probe-gate, **SB8 source_kind-escaper, PQ4 transport-idempotency, PQ5 fingerprint-absence, PQ2 enrichment-retry-budget**) · DEFER ×3 (C1, QCR, codegraph-bi-temporal) · NO-TRANSFER ×6 (CRDT, provenance-signing, galadriel-palace, decay-importance, code-mode, zero-token-marginal) · PROXY-ONLY ×1 (procedural) · REFUTED ×1 (cross-cutting-C8 → reachability-gated). **(Tally correction:** an earlier draft undercounted NET-NEW as ×6 — the four cross-cutting candidates confirmed real via RD3/SB8 belong in the count, matching the 10-row NET-NEW table in `../research/synthesis/04-sibling-and-cross-cutting.md`.)
- **Explored angles with no separate GO/defer verdict (every state row accounted for):** PQ1 cost/prompt-cache, RC7 operator-workflow, SA1 test-scaffolding, SA2 failure-mode-chaos, SA5 /doctor-diagnostics, PQ8 / `capture-near-dup-guard`, the embedding-staleness **sweep** half (PQ6 — folded into SA8's advisor-projection staleness signal), and the **tamper-evident-audit** half of PQ7/RD4 (RD4 confirmed it *real*, but it is no-transfer to a single-tenant store — only the seeded-PPR half graduated to Q3-C1) → all **no-transfer / folded**, no separate candidate. **SB5 attestation-quorum** = already-mined (folds into D4/C4), not separately counted.
- Net-deflationary, no fabricated benefit numbers.
- **Single most-likely-wrong:** still the **C8 / untrusted-content verdict** — its leverage rests on the unverified threat model ("can untrusted content become a recalled memory"). 005 said yes (via `memory_save`); RD1 narrowed the *generalization* to reachability-gated. The source_kind-gated escaper is the robust residual; the broad framework-wide claim is not.
- **Runner-up wrong:** C3-B bi-temporal additivity (no migration spec to verify) and the procedural write-path (no execution-success emitter exists).
- **200-readiness:** the research is complete and banked; this research.md is authoritative (per-iteration deltas consolidated here under the sprint deviation; `deep-research-state.jsonl` carries the 50-row count). The net-new candidates + deflations are folded into `../research/synthesis/04-sibling-and-cross-cutting.md`.

---

<!-- ANCHOR:research-citations -->
## Research Citations

- Source: `spec.md`
- Source: `research/iterations/iteration-001.md` through `research/iterations/iteration-050.md`
- Source: `research/deep-research-state.jsonl`
- Source: `../research/synthesis/04-sibling-and-cross-cutting.md`
<!-- /ANCHOR:research-citations -->
