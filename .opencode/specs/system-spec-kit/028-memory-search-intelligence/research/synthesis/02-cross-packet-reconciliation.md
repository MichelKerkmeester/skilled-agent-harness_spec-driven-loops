# 028 ↔ 027 — Cross-Packet Reconciliation (parent-level summary)

> Packet 027 (XCE-Derived Spec Kit Refinement) hardened the memory/causal/search/infra surfaces using peck, gem-team, memclaw, OpenLTM. Packet 028 then mined aionforge + galadriel — prior art 027 never had. Child `005-revisit-027` (50 iterations) reconciled 028's findings against **027's live shipped code**. This is the parent-level summary; full ledger with `file:line` evidence is **`../../001-speckit-memory/research/from-005-revisit-027/research.md`**.

## Verdict ledger (10 subjects)

| 027 subject | Verdict | What 028 adds (or why not) |
|---|---|---|
| Retention / TTL sweep | **EXTENDS** | aionforge-forget allowlist layers onto the live tier basement; edge-presence close (C3-A) / tombstone-vs-temporal split (C3-D) already shipped/documented. (spare-only AND-gate N/A — 027 sweeps on TTL) |
| Provenance / write-safety | **EXTENDS** | C4-A receipts + C4-B content-addressed identity. (The pass-mapping "ingest-bypass hole" was **REFUTED** — `working_memory` carries no content) |
| Causal-edge lifecycle | **EXTENDS** | C3-B four-timestamp window + C3-C TemporalMode genuinely extend; the SUPERSEDES/CONTRADICTS+auto-invalidation primitive is **already shipped** |
| Learning feedback reducers | **NO-TRANSFER** | 028 scopes the Beta posterior to Advisor + Deep-Loop only; the Memory protect-gate is volume-independent (no flood vector) |
| Incremental index / statediff | **ALREADY-COVERED** | 027 already has idempotent no-op rescan + deterministic id-ordering; the generation watermark is Code-Graph-scoped |
| Semantic triggers | **NO-TRANSFER (killed)** | the query-class router has zero surface on 027's shadow-only cosine matcher |
| Daemon re-election / IPC | **NO-TRANSFER (killed)** | 028 concedes exit-75 is "the same discipline"; a reliability-prior can't override a liveness mutex |
| Search resilience / RRF determinism | **EXTENDS** | C5-B content-derived tiebreak is net-new; C-X1 'active' denominator already live |
| Observability / continuity | **EXTENDS** | consolidation gauges + as-of recall (`resolveLineageAsOf` is lib-only → TemporalMode is net-new UX) |
| Derived-memory write safety | **EXTENDS** | content-addressed `derived_id` strengthens a base 027 only partially covers (receipts flag-OFF + CRUD-only, none in the causal path) |

**Tally: EXTENDS ×6 · ALREADY-COVERED ×1 · NO-TRANSFER ×3 · SUPERSEDES ×0 · CONTRADICTS ×0.** 028 is overwhelmingly net-additive; nothing it mined obsoletes or conflicts with 027.

Two net-new candidates the revisit surfaced for Memory: **C9 recall-degrade** (027's embedder subsystem is storage-side only; recall throws), and the **`memory_history` valid-time as-of tool** (the lib-only resolver is unexposed). Both in `01-go-candidates.md`.

## Reverse transfers (027 → 028)

The shipped 027 doctrine answers 028's open questions and validates its conclusions:

1. **Always-on fail-closed secret scrubber** → the ready-made *pattern* for 028's C8 render-trust gap (where/how/whether-to-flag). Pattern transfers; the seam does not (write-lane parse-head ≠ render-boundary).
2. **Always-on / default-off doctrine** → decides C8 (pure protection ⇒ always-on) and justifies C4-A default-on.
3. **Shadow-gated reducers** (the warn→error rollout) → fix template for 028's dormant `newInfoRatio` (computed, named in the STOP rationale, never read) + the Beta scorer exported-never-imported. Same *non-consumption* sub-defect.
4. **Audit-deny + tombstone-before-delete** → de-risks C3-A edge-retirement (the auditable reversible-delete substrate already exists).
5. **Lived "built-behind-a-flag ≠ value"** → *validates* 028's own "0-of-4 clean flips / no measured benefit" deflation.
6. **Methodological convergence:** 027's peck verification-discipline independently encodes 028's adversarial-verify / finding-is-a-hypothesis; peck's `fingerprint-never-recomputed` is the structural twin of 028's `newInfoRatio-never-ingested`.

## The corrected-since-pass-1 framings (apply to roadmap.md)

The revisit corrected five things in this roadmap (detail in `roadmap.md` → "027-REVISIT ADDENDUM"):
1. the `createScanKey` content-hash mis-citation (→ `computeContentHash` + `hashJson`);
2. skip-closed/C3-D is **not** a hard C3-A gate (theoretical + recoverable hygiene);
3. C8 reclassified (ingest-bypass refuted → real render-gap, reuse 027 scrubber pattern);
4. bi-temporal scoping (causal+lineage+code_edges; exclude retention; lineage canonical; `active_memory_projection` is the current store);
5. C5-B net-new on the RRF surface too, reuses `computeContentHash`.

## Follow-ups out of the Memory-scoped mandate (for the 028 parent's sibling children)

- **028 Advisor-C4 × 027 `005-advisor-feedback-calibration`** — the bounded-Beta posterior applies to the advisor (→ `003-skill-advisor` reconciliation, not Memory).
- **028 Code-Graph cluster (Q1-C1 / Q6-C1 / CG-incremental-edge-staleness) × 027 codegraph-tombstone-audit** — edge-currentness overlap the Memory-scoped revisit bounced as "Code-Graph-scoped" (→ `002-code-graph` reconciliation).
