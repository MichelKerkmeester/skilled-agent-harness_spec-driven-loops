---
title: "Research Report: Revisit 027 Refinements Through the 028 Lens"
description: "Cross-packet reconciliation ledger — for each subject packet 027 shipped, whether packet 028's aionforge/galadriel findings supersede / extend / contradict / are already-covered-by the live 027 implementation. 50 read-only iterations (cumulative packet total 150)."
trigger_phrases:
  - "028 revisit 027 reconciliation ledger"
  - "cross packet 027 028 supersede extend"
  - "027 subjects revisited with 028"
  - "memory write safety bi-temporal beta posterior revisit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-revisit-027"
    last_updated_at: "2026-06-17T00:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized the cross-packet reconciliation ledger from 50 read-only iterations"
    next_safe_action: "Feed the 5 roadmap edits + GO list into a 028 implementation packet (research-only ends here)"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "../research/roadmap.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-005-revisit-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "028 is overwhelmingly net-additive to 027: across all ten revisited subjects, zero supersedes and zero contradicts (EXTENDS x6, ALREADY-COVERED x1, NO-TRANSFER x3)."
      - "027's already-shipped doctrine both supplies the missing design answers for 028's open candidates (C8, C4-A) and independently validates 028's own '0-of-4 clean flips' deflation."
---

# Research Report: Revisit 027 Refinements Through the 028 Lens

> **Cross-packet reconciliation.** Packet 027 (XCE-Derived Spec Kit Refinement) hardened the memory store, retrieval, causal-graph lifecycle, learning feedback, and daemon/IPC infrastructure — drawing on peck, gem-team, memclaw, OpenLTM. Packet 028 then mined two memory engines 027 never had (aionforge-memory, Rust; galadriel, Python). This child reconciles 028's findings against 027's **live shipped code**: for each subject, does 028 **supersede / extend / contradict / already-cover**? **50 read-only iterations** (Rounds K mapping → L deep-dive → M feasibility → N adversarial → O residuals/close), bringing the packet to **150 cumulative**. Research-only; no code changed. Every verdict is code-grounded; `[file:line]` cites live source unless marked inferred.

## Executive Summary

**028 is overwhelmingly net-additive to 027.** Across the ten revisited subjects: **EXTENDS ×6 · ALREADY-COVERED ×1 · NO-TRANSFER ×3 · SUPERSEDES ×0 · CONTRADICTS ×0.** Nothing 028 mined obsoletes or conflicts with what 027 shipped; the transferable items layer additively on top. Two pass-mapping claims were **refuted/corrected by later adversarial rounds** (the campaign was net-deflationary and self-correcting): the Q2 "ingest-bypass hole" was refuted (`working_memory` carries no content), and C8 was re-seated twice before settling as a real render-gap.

A second, symmetrical finding: **027's already-shipped doctrine flows back into 028** (reverse transfer). 027's always-on fail-closed secret scrubber is the ready-made *pattern* for 028's C8; its always-on/default-off rule decides C8 and justifies C4-A default-on; its shadow-gated reducers are the fix template for 028's dormant `newInfoRatio`; and 027's lived "a built-behind-a-flag feature is a measured bet not yet cashed in" *validates* 028's own "0-of-4 clean flips / no measured benefit" deflation. Most strikingly, 027's peck verification-discipline **independently encodes** 028's adversarial-verify / finding-is-a-hypothesis methodology — and peck named the same dormant-value bug class (`fingerprint-never-recomputed`) that 028 found as `newInfoRatio-never-ingested`.

**The one hard sequencing fact, then corrected:** the temporal program initially looked gated on a one-line `skip-closed-in-sweep` guard — but adversarial verification (iter-032) downgraded that fork to *theoretical + recoverable hygiene* (no automatic producer creates the collision; the sweep tombstones before deleting). It still ships as cheap defensive hardening before C3-A, but it is **not** a data-loss gating blocker.

**Single most-likely-wrong of the whole revisit:** the **C8** verdict — its seam moved once under adversarial pressure and its leverage rests on an unverified threat model ("is *who can write a memory* a real injection vector?"). Round O found the loop *does* close (arbitrary `memory_save` content → secrets-only scrub → raw HOT-tier render → fed into the agent loop every turn), upgrading C8 to a real must-fix; but the threat-model strength is the residual that decides must-fix vs no-op.

---

## The Reconciliation Ledger

| Q | 027 subject | Verdict | 028 finding | Surviving candidate + corrected effort | Key live-code |
|---|---|---|---|---|---|
| **Q1** | Retention / TTL sweep | **EXTENDS** | C3-A close + C3-D split + aionforge-forget allowlist build *around* 027's tier basement (already shipped/documented) | **forget-allowlist (allowlist half only)** — additive **M** (no label column exists; spare-only/capacity AND-gate dropped — 027 sweeps purely on TTL) | `memory-retention-sweep.ts:177,185-193,542-566` |
| **Q2** | Provenance / write-safety | **EXTENDS** (via C4-A/C4-B); ingest-bypass hole **REFUTED** | C4-A receipts + C4-B content-addressed identity; render-trust is C8 (separate) | ingest-trust-wrapper **WITHDRAWN** (`working_memory` has no content). C8 = real render-gap (see Q-C8) | `working-memory.ts:449-483`; `extraction-adapter.ts:246-274` |
| **Q3** | Causal-edge lifecycle | **EXTENDS** (C3-A primitive already-covered) | Four-timestamp window (C3-B), TemporalMode (C3-C), tombstone/temporal-close split (C3-D) | **skip-closed-in-sweep** — S **defensive hardening before C3-A, NOT a gate** (fork is theoretical + tombstone-recoverable, iter-032) | already-shipped `contradiction-detection.ts:99-110`+`temporal-edges.ts:68-101`; fork `frontmatter-promoter.ts:304-318` |
| **Q4** | Learning feedback reducers | **NO-TRANSFER** | Bounded Beta posterior scoped to Advisor-C4 + Deep-Loop-D2 only; never proposed for Memory | none — protect-gate is volume-INDEPENDENT (reads only tier/pin); no Beta-shaped subproblem | `feedback-retention-reducer.ts:106-113,153-155` |
| **Q5** | Incremental index / statediff | **ALREADY-COVERED** (determinism) / no-transfer (watermark) | Q6-C1 watermark is Code-Graph-scoped; total_cmp doesn't apply | none — total-comparator is a NON-ISSUE (`Set<number>` from INTEGER PK) | `incremental-index.ts:208-225,368,421`; `schema-downgrade.ts:115` |
| **Q6** | Semantic triggers | **NO-TRANSFER — KILLED** | C2-A router has zero surface on 027's shadow-only cosine matcher | none — gating a shadow-only, default-OFF no-op is pointless | `semantic-trigger-matcher.ts:90,103-105,442` |
| **Q7** | Daemon re-election / IPC | **NO-TRANSFER — KILLED** | 028 concedes exit-75 is "the same discipline"; reliability-prior can't override a liveness mutex | none (election); **C9 net-new for recall** belongs to a different axis (see Q-C9) | `mk-code-index-launcher.cjs:427-443,470` |
| **Q8** | Search resilience / RRF determinism | **EXTENDS** (C-X1 'active' branch already-covered) | RRF fuses by rank; C-X1 'active' is live; C5-B net-new | **C5-B canonicalId tiebreak** — **S** (`content_hash` already on rows via `m.*`; COALESCE to id for BM25/nullable). *Reorder-of-ties → value is content-derived stability, comparator is already total via rowid* | `ranking-contract.ts:46-53`; `rrf-fusion.ts:296-371`; `vector-index-queries.ts:445` |
| **Q9** | Observability / continuity | **EXTENDS** | Gauges + C4-C cursor + C3-C TemporalMode; `resolveLineageAsOf` is LIB-ONLY ⇒ TemporalMode is net-new UX | **memory_history tool** (valid-time as-of) — ~5-surface parity add; **gauge pending/failed** (S) + **lag** (S, *decoupled from C4-C* — status column + created_at) | `lineage-state.ts:1025-1043` (zero non-test callers); `vector-index-schema.ts:1884`; `memory-crud-health.ts:902` |
| **Q10** | Derived-memory write safety | **EXTENDS** | C4-B content-addressed derived id + idempotent consolidation strengthen a base 027 only partially covers (receipts flag-OFF + CRUD-only, none in causal path) | **C4-B `derived_id` UNIQUE** — S–M (additive, **rowid-alias PK**; **`derived_id` MUST include anchors** or the legacy UNIQUE backfill rejects) | `causal-edges.ts:348-358`; `vector-index-schema.ts:1108,1121,1423` |

**Two corrections the campaign made to its own pass-1 mapping:** Q2 ingest-bypass hole **refuted** (iter-011); C8 seam moved getSessionMemories→getTieredContent then **upgraded** to a real must-fix (iter-022→031→041).

---

## C8 (Q2 render-trust) — promoted to its own line

**Verdict: REAL render-gap, must-fix (threat-model-gated residual).** There is **no untrusted-recall escaper anywhere** in the package (whole-package grep zero). `memory_save` accepts arbitrary caller content, scrubs **secrets only** (`secret-scrubber.ts:4-8,51-131` — no injection markers), and writes the file that `getTieredContent` emits **verbatim at HOT tier** (`memory-triggers.ts:299-300,721,784`) into the model-facing response — which `memory_match_triggers` feeds into the agent loop every turn. `import`/tool-extraction are first-class non-human write sources. So the loop closes: untrusted-write → unescaped-recall → prompt. Fix = an always-on render-escaper reusing 027's fail-closed scrubber **pattern** (the seam is render-boundary, not 027's write-lane parse-head). **Residual:** if memories are effectively trusted-author-only, C8 down-scopes toward a no-op — this is the single most-likely-wrong claim in the report.

## C9 (Q7-adjacent) — the one mapped miss

**Verdict: EXTENDS (net-new for recall).** 027's embedder subsystem (`memory-embedding-reconcile`, `embedder-set`/swap, reindex) is **storage/index-side only**; the recall path THROWS on a null query embedding (`stage1-candidate-gen.ts:705-706`; stage 1 is mandatory) and never checks embedder availability. The keep-lexical substrate exists but is unreached. C9 (detect-unavailable → `useVector=false` lexical + report) is genuinely net-new for recall. EFFORT S, PROMOTE-substrate.

---

## Reverse transfers (027 → 028)

1. **Fail-closed always-on secret scrubber** → ready-made *pattern* for C8 (answers where/how/whether-to-flag). `before-vs-after.md:31,523`. *Pattern transfers; the seam does not — write-lane parse-head ≠ render-boundary.*
2. **Always-on / default-off doctrine** → resolves C8 (pure protection ⇒ always-on) AND justifies C4-A default-on. `before-vs-after.md:11,37`.
3. **Shadow-gated reducers** (the warn→error rollout, `006-peck-verification-discipline/spec.md:120-121`) → fix template for 028's `newInfoRatio` computed-but-never-ingested (`convergence.cjs:285` names it in the STOP rationale yet `:107-141` never reads it) + the Beta scorer exported-never-imported. Same *non-consumption* sub-defect.
4. **Audit-deny + tombstone-before-delete** → de-risks C3-A edge-retirement (the auditable reversible-delete substrate already exists). `before-vs-after.md:29,93`.
5. **Lived "built-behind-a-flag ≠ value"** ("payoff is zero until live evidence") → VALIDATES 028's "0-of-4 clean flips / no measured benefit." `before-vs-after.md:302`.
6. **Methodological convergence:** 027's peck verification-discipline independently encodes 028's adversarial-verify / finding-is-a-hypothesis, and peck's `fingerprint-never-recomputed` (`spec.md:75`) is the structural twin of 028's `newInfoRatio-never-ingested`.

---

## Build sequence (corrected)

- **Wave-0** (independent, reversible): skip-closed-in-sweep (**defensive hardening before C3-A, not a gate**) · two-primitive content-id module (Primitive A formula promotable S; identity-centralization **parameterized** — divergence-from-stored-hash + receipt-semantics risk, iter-047) · C4-A (flip **+ deferred-save wiring**; overloaded flag also enables near-dup hints) · forget-allowlist (allowlist half, M) · gauge pending/failed (S).
- **Wave-1**: C5-B (S — `content_hash`-asc tiebreak, COALESCE to id; *content-derived tie stability*) · memory_history valid-time (~5-surface parity) · gauge lag (S, decoupled from C4-C).
- **Wave-2**: C4-B (`derived_id` **must include anchors**; rowid-alias PK; column + `CREATE UNIQUE INDEX`) · bi-temporal C3-B (four-timestamp; **lineage canonical**, causal `invalid_at` derived; `active_memory_projection` is the real current store; additivity UNVERIFIED — C3-C "Current"-replaces-projection is L across ~12 JOINs/2 writers) · AsKnownAt (gated on C3-B).
- **Conditional / net-new**: C8 render-escaper (real must-fix, threat-gated) · C9 recall-degrade (S) · Q7 lease-telemetry (low-pri, no sink).
- **027-internal hardening** (not 028 transfers): Q4 sliding-TTL absolute-deleteAfter ceiling (needs `created_at` plumbed); the `search-results.ts:528` `ce.edge_id` CTE-alias quirk; the stale `causal-edges.ts:346-347` `last_insert_rowid()` comment.

---

## Edits this revisit makes to the 028 roadmap (`../research/roadmap.md`)

1. **createScanKey mis-citation** (§1/§4 + C4-B seam): `memory-index.ts:281` is `createScanKey` (a 16-char scan-options hash), NOT a content base. Correct to `computeContentHash` (content-body, `memory-parser.ts:914-916`) + `hashJson` (canonical-field, `idempotency-receipts.ts:81-102`).
2. **skip-closed / C3-D**: NOT a hard C3-A gate (adversarially downgraded to recoverable hygiene); ship as cheap defensive hardening.
3. **C8**: strike the refuted ingest-bypass framing; C8 = real render-gap, BUILD-new always-on render-wrapper reusing 027's scrubber *pattern* (not seam).
4. **bi-temporal scoping**: consumers = causal + lineage + code_edges; **exclude retention TTL** (category error); canonical writer = lineage; current store = `active_memory_projection`.
5. **C5-B**: net-new on the comparator AND the RRF surface (no tiebreak); reuses `computeContentHash`; EFFORT S.

*(These are recorded in the parent roadmap's "027-REVISIT ADDENDUM" rather than surgically rewritten per-row, to keep the pass-1/broadening record intact.)*

---

## Shared infrastructure

- **Two content-id primitives** (iter-018/047): Primitive A = `computeContentHash` (content-body; already triplicated byte-identically) → save-dedup, ingest, C5-B tie-break (`ORDER BY score DESC, content_hash ASC`), embedding-cache. Primitive B = `hashJson`/`normalizeForHash` (canonical-field, strips client tokens) → C4-A receipt key, C4-B `derived_id`. **NOT one hash** — one canonicalization primitive, two field-domains; centralizing the *identity* must be parameterized (legacy stored hashes are bare-hex; Primitive B's token-stripping is receipt-specific).
- **Bi-temporal causal+lineage unification** (iter-019/024/035): lineage is already ~¾ bi-temporal (missing only `expired_at`); causal-edge has zero txn-time; retention TTL stays separate. Additive-M migration, declared once in `vector-index-schema.ts`.

---

## Follow-ups (out of this Memory-scoped packet's mandate — for the 028 parent's sibling children)

- **028 Advisor-C4 × 027 `005-advisor-feedback-calibration`** — same Q4 Beta math, applied to the *advisor* (→ `028/002-skill-advisor` reconciliation).
- **028 Code-Graph cluster (Q1-C1 / Q6-C1 / CG-edge-staleness) × 027 `002…/006-codegraph-tombstone-audit`** — edge-currentness overlap the revisit bounced as "Code-Graph-scoped" (→ `028/002-code-graph` reconciliation).

---

## Provenance & honesty note

Net-deflationary + self-correcting: Q2 hole refuted + candidate withdrawn; Q4 flip tested and falsified; Q6/Q7 killed; Q5 non-issue; C8 escalated, re-seated, then upgraded; Q3 fork "H/gating" → recoverable hygiene. **No benefit NUMBER was fabricated** — all leverage is categorical; the only numbers are code-grounded facts. LEVERAGE/EFFORT tags are reasoning estimates, never build-measured — treat every H/S as inferred. The structured `findings-registry.json` / `deep-research-dashboard.md` lag this narrative (they don't record withdrawn/downgraded dispositions); **this `research.md` is the authoritative source of truth for the 005 packet.**

---

<!-- ANCHOR:research-citations -->
## Research Citations

- Source: `spec.md`
- Source: `research/iterations/iteration-001.md` through `research/iterations/iteration-050.md`
- Source: `research/findings-registry.json`
- Source: `../research/synthesis/02-cross-packet-reconciliation.md`
<!-- /ANCHOR:research-citations -->
