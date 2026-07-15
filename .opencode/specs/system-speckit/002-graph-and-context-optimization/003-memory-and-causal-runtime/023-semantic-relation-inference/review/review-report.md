---
title: "Deep Review Report: Relation-Inference Backfill Subsystem (021 + 023)"
description: "Post-implementation deep-review across correctness, security, traceability, maintainability. Verdict PASS-with-advisories; one confirmed data-integrity defect (SEC-001) endangering the contradicts collector."
importance_tier: "important"
contextType: "general"
---

# Deep Review Report — Relation-Inference Backfill Subsystem

<!-- ANCHOR:convergence-report -->
## 1. Summary & Verdict

| Field | Value |
|-------|-------|
| **Target** | relation-inference backfill subsystem (packets 021 + 023) |
| **Dimensions** | correctness, security, traceability, maintainability |
| **Method** | 4 dimension-parallel `@deep-review` Opus LEAF agents → adversarial refutation of every P0/P1 |
| **Verdict** | **PASS (hasAdvisories=true)** — 0 active P0, 0 active P1 after adjudication |
| **Findings** | P0=0 · P1=0 (1 adjudicated P1→P2) · P2=11 |
| **Key actionable** | **SEC-001** — confirmed-real data-integrity defect (opt-in-gated) |

The substantive ship is sound: dry-run-default, bounded, guard-inheriting, parameterized SQL, deterministic tests. The review found **one genuine defect the inline 3-lens verify missed (SEC-001)** plus a set of P2 hygiene/disclosure items.
<!-- /ANCHOR:convergence-report -->

---

<!-- ANCHOR:findings -->
## 2. Findings

### 🔴 SEC-001 — `contradicts` collector silently invalidates the `caused` edge it just created (CONFIRMED, adjudicated P1→P2)
**Mechanism (reproduced end-to-end by the refuter):**
- `collectSupersessionEdges` emits `contradicts` for `predecessor→successor`; `collectLineageEdges` emits `caused` for the **same** directed pair. Lineage is reciprocal (`lineage-state.ts:797-825` sets both `A.superseded_by=B` and `B.predecessor=A`), so **every** superseded version yields both edges on the identical pair.
- In the execute transaction, `caused` inserts first, then `contradicts`. `insertEdge` runs `detectContradictions` (because `isTemporalEdgesEnabled()` defaults TRUE), `relationsConflict(['caused','contradicts'])` is true, and `invalidateEdge` sets `invalid_at` on the valid `caused` edge — no strength/`created_by` guard, so a 0.3 auto edge can invalidate a 0.4 auto OR a manual full-strength edge.
- `countWrittenByRelation` does not filter `invalid_at`, so the summary reports the invalidated edge as "written."
- **Probe (reciprocal 10→11 pair, `contradicts:true`):** caused edge `invalid_at` SET, contradicts edge survives, summary reports both written.

**Severity:** adjudicated P1→P2 (gated behind opt-in `contradicts:true`, default false; graph-quality degradation, not a breach). **But it makes the held non-dry `contradicts` backfill unsafe** and MUST be fixed before enabling that collector in production.

**Fix:** supersession `contradicts` must skip any pair that already has (or will have, in-transaction) a valid `caused`/`supports`/`enabled` edge; surface an `invalidated`/`skipped` count; add a reciprocal-pair regression test.

### Correctness (PASS)
- **COR-001 (P2):** `written`/`byRelation` count upserts of pre-existing edges as freshly written on idempotent re-runs (probe: RUN2 written=3, 0 new rows). Report-only; DB state correct. Fix: count only newly-inserted rows.
- **COR-002 (P2):** the inner `backfill` schema object is not `.strict()`, so a typo'd opt-in key (`contradict`, `threshold`) is silently accepted and dropped → operator believes a collector ran when it didn't. Fix: `.strict()` the inner object + test.

### Security (CONDITIONAL → all non-SEC-001 are safe)
- **SEC-002 (P2):** handler forwards raw limit/threshold relying on collector-side clamp; currently SAFE (dual-clamped). Awareness only.
- **SEC-003 (P2):** `PRAGMA table_info(${table})` interpolates the table name; SAFE — both call sites pass hardcoded literals. No action; guard future refactors.

### Traceability (PASS)
- **TRACE-001 (P2):** the review strategy/dispatch referenced `ADR-001..004`, but only ADR-001..003 exist — a review-framing error (now corrected in this packet), not a code defect.
- **TRACE-002 (P2):** the executed live dry-run yield (scanned 600; 218 caused / 200 contradicts / 3 supports; written 0) is undocumented in the packet and the impl-summary still marks the production run "pending"; the 200-contradicts magnitude is large and unpredicted. Fix: document the yield + expected magnitude.

### Maintainability (PASS, hasAdvisories)
- **M-004-1 (P2):** unused `createSpecDocumentChain` import (dead import).
- **M-004-2 (P2):** dead `bumpRelation(...,0)` no-op loop with a misleading proportional-attribution comment.
- **M-004-3 (P2):** spec-chain strengths hardcode bare `0.4` ×6 while siblings use named constants (silent-drift risk).
- **M-004-4 (P2):** four near-identical collector write blocks → extract `insertInferredEdges` helper.
- **M-004-5 (P2):** committed-run `byRelation` numeric accuracy is untested.
<!-- /ANCHOR:findings -->

---

## 3. Adversarial Verification
The single P1 (SEC-001) was sent to a refute-default adversary, which **could not refute it** — it traced the full chain and ran a scoped repro probe confirming the collision. Severity adjudicated P1→P2 (opt-in gating), real=true. All other findings are P2 (no adjudication required).

## 4. Remediation Plan
Tracked in follow-up packet **`026-relation-backfill-review-remediation`**:
1. **SEC-001** (priority): exclude supersession-`contradicts` pairs that overlap a valid `caused`/`supports`/`enabled` edge; surface a skipped/invalidated count; reciprocal-pair regression test.
2. COR-002 strict inner schema (+test); COR-001 newly-inserted count (+test).
3. M-004-1..5 cleanups + committed-run byRelation test.
4. TRACE-002 document the dry-run yield + expected magnitude in 023 impl-summary.

## 5. Release Readiness
- The shipped subsystem (021+023) is safe **as deployed** (collectors opt-in; default deterministic signals are sound). No rollback needed.
- The **`contradicts` collector must not be enabled in a non-dry production run until SEC-001 is fixed.** The held non-dry backfill should run **without `contradicts`** (or after the SEC-001 fix lands).

## 6. Artifacts
- Iteration files: `review/iterations/iteration-001..004.md`
- Deltas: `review/deltas/iter-001..004.jsonl`
- Config/strategy/state: `review/deep-review-{config.json,strategy.md,state.jsonl,findings-registry.json}`

STATUS=OK
