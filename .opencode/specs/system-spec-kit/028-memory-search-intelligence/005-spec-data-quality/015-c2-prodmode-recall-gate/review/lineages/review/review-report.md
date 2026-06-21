# Review Report — C2 Prod-Mode Recall Gate

Lineage: `review` · Session: `fanout-review-1782055949478-i1h3i4` · Executor: cli-claude-code (opus)
Target: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/015-c2-prodmode-recall-gate` (spec-folder, Level 2, Status PLANNED)

## 1. Executive Summary

**Verdict: CONDITIONAL** · `hasAdvisories: true` · Active findings: **P0=0, P1=1, P2=2**

The packet is an honest, internally consistent PLANNED scaffold: no implementation file has landed, all docs agree on Status PLANNED / completion 0, and the checklist carries zero unsupported `[x]` claims. The planned gate design is logically sound and computable against the live dual-mode harness — the prod-column-only read, the distinct recall-verdict exit code, and the non-saturation rationale all check out against `run-eval-v2.mjs` and the source ground truth.

One P1 blocks a clean PASS: the spec/plan/tasks premise that the harness needs a *new* export is stale — `run-eval-v2.mjs:361` already exports all three named symbols, so REQ-005 is already satisfiable and the "Modify run-eval-v2.mjs" task is effectively a no-op. Two P2 advisories note that the "thin wrapper" framing under-scopes the build and that the gold-set→harness wiring seam is unspecified. Scope covered all 4 review dimensions plus both core traceability protocols; security and correctness are clean.

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan` for a reconciliation pass before implementation begins. The plan/tasks must be corrected so the implementer does not act on the stale export premise (F001), and should pin down the two P2 design seams (F002/F003) while the spec is still open. None of this changes the spec's verdict (GO-on-cost) or its scope — it tightens the planning premises the build will rely on.

## 3. Active Finding Registry

| ID | Sev | Category | Evidence | Summary |
|----|-----|----------|----------|---------|
| F001 | P1 | spec-alignment | run-eval-v2.mjs:361 · plan.md:107 · tasks.md:58-59 · spec.md:95 | Plan/tasks plan to "add a narrow export" that already exists; the harness exports `buildSearchLenses, meanCompleteRecallProfile, diffProfiles, MEASURABILITY_CLASSES, COMPLETE_RECALL_KS`. REQ-005 already satisfiable with zero harness change; naive T002 execution risks a duplicate-export break. |
| F002 | P2 | completeness | run-eval-v2.mjs:107-122, 200-211, 259-289 | "Thin wrapper" understates the orchestration the gate must replicate: `prepareEvalDatabase`, the dist-module imports, `groupGroundTruth`, and the retrieval loop are all unexported. Not a REQ-005 violation (not lens logic), but the build is larger than "thin." |
| F003 | P2 | completeness | run-eval-v2.mjs:272-277 · spec.md:92 | Harness sources ground truth from `GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES` by category; there is no loader for an external `spec-corpus-golden.json`. Spec/plan do not state how the new gold set enters the retrieval path. |

## 4. Remediation Workstreams

- **WS-1 — Reconcile the harness-export premise (F001, P1).** In plan.md affected-surfaces and tasks T001/T002, change "add the narrow export" → "verify the existing export at run-eval-v2.mjs:361 covers `buildSearchLenses`, `meanCompleteRecallProfile`, `MEASURABILITY_CLASSES`"; drop `run-eval-v2.mjs` from spec.md Files-to-Change "Modify" or restate it as "no change required — export already present."
- **WS-2 — Specify the reuse + wiring surface (F002, F003, P2).** Document that the gate must own DB prep, dist imports, ground-truth grouping, and the retrieval loop (or factor a shared helper), and define how `spec-corpus-golden.json` reaches the harness (extend `ground-truth.json` vs. gate-side loader building its own `relevancesByQuery`).

## 5. Spec Seed

Minimal spec delta for the reconciliation pass:
- Amend §3 Files to Change: `run-eval-v2.mjs` export is **already present** (run-eval-v2.mjs:361); reclassify from "Modify" to "Verify / no-change" or remove.
- Add an edge/interface note: define the `spec-corpus-golden.json` ingestion path into the harness retrieval loop (REQ-005 reuse boundary explicitly excludes DB prep, ground-truth grouping, and retrieval orchestration, which the gate owns).

## 6. Plan Seed

1. Reword tasks T001/T002 to "verify export present" (not "add"); confirm no second `export {}` is introduced.
2. Add a task: define gold-set ingestion (extend `ground-truth.json` with the new multi-target queries+relevances under the three measurability categories, OR build a gate-side loader producing `relevancesByQuery`).
3. Keep T004-T009 as-is; they remain valid once WS-1/WS-2 land.

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core/hard | partial | 4 claims verified (line-357 crash handler, 361-line size, `MEASURABILITY_CLASSES` vocab, per-class `prodMode` output); 1 current-state claim false → F001 |
| `checklist_evidence` | core/hard | pass | 26/26 unchecked, completion 0 — consistent PLANNED scaffold, no unsupported completion claim |
| `feature_catalog_code` | overlay/advisory | N/A | No catalog claims target this eval gate |
| `playbook_capability` | overlay/advisory | N/A | No playbook scenarios target this packet |

Unresolved gap: F001 (spec_code) — reconcile before implementation.

## 8. Deferred Items

- F002, F003 (P2 advisories): design-seam clarifications; resolve during the plan reconciliation, non-blocking for the spec's GO verdict.
- CHK-042 (P2, README) remains optional per the packet's own checklist.

## 9. Audit Appendix

- **Coverage:** 4/4 dimensions (correctness, security, traceability, maintainability); core traceability protocols both executed; overlays N/A by target type.
- **Iterations:** 4 dispatched (iteration-001…004), each with a JSONL delta and a canonical verdict line. Per-iteration verdicts: PASS, PASS, CONDITIONAL, PASS.
- **Adversarial replay:** F001 carries a claim-adjudication packet (iteration-003); counterevidence sought (is the export this phase's own work? — no, implementation-summary.md:56 "no code change has landed"; is the plan conditional? — no, plan.md:107 states the premise unconditionally). Survived at P1, confidence 0.9, with a documented P2 downgrade trigger. No P0 asserted, so no P0 replay required.
- **Replay validation:** Recomputed from JSONL — ratios 0.00→0.00→0.34→0.15 (descending), dimension coverage 4/4 with ≥1 stabilization pass, no new P0. Recorded stop reason `coverage_complete_all_dimensions_stabilized` matches the recomputed decision. Converged at iteration 4 of max 6.
- **Resource-map coverage gate:** skipped (`resource_map_present: false`; no `resource-map.md` in target). Phase-5 augmentation recorded in `resource-map.md`.
- **Verdict logic:** No active P0; one active P1 ⇒ CONDITIONAL (P2s recorded as advisories, `hasAdvisories: true`).

Review verdict: CONDITIONAL
