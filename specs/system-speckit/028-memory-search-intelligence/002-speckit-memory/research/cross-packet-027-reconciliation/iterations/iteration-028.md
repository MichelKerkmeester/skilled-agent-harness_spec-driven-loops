# Iteration 28 (Round M): Build sequencing of the surviving 027-revisit candidates

## Focus
Dependency-order the surviving candidates into Wave-0/1/2. Synthesis over iterations 11-25. Read-only.

## Findings (newInfoRatio 0.35 — assembly)
**WAVE-0 (independent, reversible, S):**
- **skip-closed-in-sweep** (`frontmatter-promoter.ts:304-318` `AND invalid_at IS NULL`) — GATES C3-A; gated-by nothing.
- **two-primitive content-id module** (A `computeContentHash`, B `hashJson`) — GATES C4-B + C5-B; corrects roadmap mis-citation.
- **C4-A idempotency-receipts default-on** (flag flip, independent).
- **forget-allowlist additive** (allowlist half only).
- **gauge pending/failed alias** onto `getBackgroundEnrichmentStats`.

**WAVE-1 (depends on Wave-0, no schema):**
- **C5-B canonicalId tiebreak** — gated-by the two-primitive module (Primitive A / content_hash).
- **TemporalMode valid-time slice** (memory_history tool wiring resolveLineageAsOf) — no schema.
- **gauge `lag`** — net-new; gated-by the background/deferred cursor seam (C4-C).

**WAVE-2 (schema-migration / gated):**
- **C4-B derived_id** — gated-by Primitive B + FK re-verify.
- **bi-temporal unify causal+lineage (C3-B)** — gated-by the canonical-supersede-writer decision (lineage canonical); GATES C3-C.
- **TemporalMode AsKnownAt (C3-C full)** — gated-by C3-B.

**TOP-SEQUENCING-CONSTRAINT: skip-closed-in-sweep MUST land before any C3-A edge-presence read-wiring** — the whole temporal program (C3-A→C3-B→C3-C) hangs behind that protective WHERE-clause.

## Most-likely-wrong
That C4-B sits cleanly in Wave-2 as a pure additive column — the FK blast-radius was confirmed via a broken glob (L6-02); an unseen join on causal_edges.id would force a dependent migration. (M3 re-verified weight_history-only, lowering this risk.)

## Next Focus
The sequenced plan is a core ledger section. Round N adversarially verifies the GO candidates + writes the reconciliation ledger.
