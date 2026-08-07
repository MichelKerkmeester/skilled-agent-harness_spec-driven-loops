# Review Report — 004-confidence-calibration-labeled-set (lineage p017c004-opus)

| Field | Value |
|-------|-------|
| Target | `system-spec-kit/027-…/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set` |
| Target type | spec-folder |
| Executor | cli-claude-code / claude-opus-4-8 |
| Iterations | 1 (maxIterations) |
| Dimension coverage | 4/4 |
| **Verdict** | **CONDITIONAL** |
| hasAdvisories | true |
| Release-readiness | converged |
| Stop reason | maxIterations |

---

## 1. Executive Summary

The **code** in this packet is sound and ships safely. The default-ON weight rebalance (`0.45` heuristic / `0.55` absolute-relevance prior) is bounded, clamps to `[0,1]`, and is monotonic in relevance as designed. The calibration infrastructure (B) is genuinely inert in production: it is gated behind the opt-in `SPECKIT_CONFIDENCE_CALIBRATION` flag (`isOptInEnabled`, default OFF) **and** an explicit readable model path, with a no-op identity fallback — verified by direct read and by the two wiring tests. The isotonic PAV fit and `applyCalibration` are monotonic and bounded; loaders fail safe (null on bad input in the hot path, loud on malformed labeled sets offline). No P0 and no security findings.

The verdict is **CONDITIONAL** (not PASS) for one P1: the packet's normative documents are not reconciled with the shipped reality. `spec.md`, `plan.md`, and `tasks.md` are still raw scaffold templates, and `graph-metadata.json` reports `Status: planned`, while `implementation-summary.md` is fully authored and asserts 100% completion. The core `spec_code` traceability protocol cannot pass against a placeholder spec, and the `planned`-vs-`shipped` status contradiction will mislead any future resume or validation.

**Active counts:** P0 = 0 · P1 = 1 · P2 = 3.

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan` for a small remediation pass. The remediation is documentation/metadata reconciliation, not code change — the shipped behavior is accepted as-is. P2 advisories are optional follow-ups.

## 3. Active Finding Registry

| ID | Sev | Category | Title | Evidence |
|----|-----|----------|-------|----------|
| F001 | P1 | traceability | spec.md/plan.md/tasks.md are placeholder templates while impl-summary + code claim 100%; `graph-metadata` Status=`planned` | spec.md:51,84-128 · plan.md:46-129 · tasks.md:50-87 · graph-metadata.json · implementation-summary.md:16-28 |
| F002 | P2 | maintainability | Isotonic fit never merges equal-mean adjacent blocks → 100-point starter model for an effective 2-level step | confidence-calibration.ts:163-183 · confidence-calibration-model.starter.json:3-404 |
| F003 | P2 | maintainability | PAV fit duplicated in `assets/fit-calibration.mjs` with no drift guard | confidence-calibration.ts:145-183 · fit-calibration.mjs:97-124 |
| F004 | P2 | completeness | Path-keyed model cache not invalidated on file content change (documented limitation #4) | confidence-scoring.ts:164-179 · implementation-summary.md:151 |

## 4. Remediation Workstreams

**Lane A — Reconcile packet docs (clears F001, required for PASS).**
- Populate `spec.md` (Problem/Purpose, Scope, REQ rows, Success Criteria) to describe deliverables (A) rebalance and (B) flag-gated calibration.
- Populate `plan.md` and `tasks.md` (or mark tasks `[x]` with evidence) to match shipped work.
- Run `generate-context.js` so `graph-metadata.json` status moves off `planned` and `description.json` keywords/sequence reconcile.
- Re-run `validate.sh <spec-folder> --strict` to confirm exit 0.

**Lane B — Optional model-quality polish (P2, non-blocking).**
- F002: pool adjacent equal-mean blocks in `fitCalibration` to compress the serialized curve.
- F003: add a guard/test asserting `fit-calibration.mjs` PAV stays in parity with `confidence-calibration.ts`, or import a shared implementation.
- F004: optionally key the model cache on mtime/content hash if in-place model edits during a long-lived process become a real workflow.

## 5. Spec Seed

> **Problem.** Per-result `confidence.value` under-weighted absolute relevance, capping strong-but-isolated cosine hits at "medium" (Problem 6 / Calibration Headroom).
> **Scope (In).** (A) Rebalance per-result value to `heuristic*0.45 + relevancePrior*0.55` (default ON). (B) Flag-gated, default-OFF isotonic calibration infra (`fitCalibration`/`applyCalibration`/loaders) + proxy seed.
> **Scope (Out).** Collecting/refitting on real labeled traffic; enabling the calibration flag in production.
> **REQ (P0).** Rebalance is monotonic in relevance and bounded `[0,1]`; calibration is a no-op unless flag ON + model present.
> **Success.** Existing confidence suite green under the new band; default-OFF wiring proven by test.

## 6. Plan Seed

1. Fill spec.md/plan.md/tasks.md from `implementation-summary.md` (the accurate source).
2. Reconcile metadata via `generate-context.js`; confirm `graph-metadata` status reflects shipped.
3. `validate.sh --strict` → exit 0.
4. (Optional) Apply Lane B P2 polish in a separate changelog-only pass.

## 7. Traceability Status

| Protocol | Class | Status | Note |
|----------|-------|--------|------|
| `spec_code` | core/hard | **FAIL** | No normative claims in spec.md to resolve; status metadata contradicts shipped state (F001). |
| `checklist_evidence` | core/hard | N/A | No checklist.md (Level 1 packet). |
| `feature_catalog_code` | overlay | N/A | No catalog claim in scope. |
| `playbook_capability` | overlay | N/A | No playbook in scope. |

## 8. Deferred Items

- F002, F003, F004 (all P2) — model serialization compression, fit-duplication drift guard, and cache content-invalidation. Safe to defer; none affect production behavior (calibration default OFF).
- **Independent test re-execution.** `npm run typecheck` + vitest (reported 67/67 in implementation-summary.md) were **blocked by the sandbox** in this lineage. No read-level evidence contradicts the claim, but it was not independently re-run here — re-verify in an environment with test execution before final sign-off.

## 9. Audit Appendix

- **Coverage:** 4/4 dimensions in one breadth-first iteration; 11 files read (3 lib modules, 1 vitest, 2 assets, spec/plan/tasks/implementation-summary/graph-metadata).
- **Replay validation:** Single iteration; recorded `newFindingsRatio=0.5` (P1 override floor), `verdict=CONDITIONAL`, `dimensionCoverage=1.0`. Synthesis event matches recomputed counts (P0:0/P1:1/P2:3). Convergence by `maxIterations`, not composite score.
- **Claim adjudication:** F001 adjudicated — evidence re-read, counterevidence sought (phase-child delegation ruled out; impl-summary accuracy confirmed), alternative explanation recorded and rejected. finalSeverity P1, confidence 0.85.
- **Verdict lock:** No active P0 → FAIL not triggered. One adjudicated P1 → CONDITIONAL.
- **Resource map:** not present at init → coverage gate skipped (no `## Resource Map Coverage Gate` section; no `resource-map.md` emitted).
- **Adversarial self-check:** No P0 candidates were raised, so no P0 downgrades were required. F002–F004 confirmed non-gating P2.
