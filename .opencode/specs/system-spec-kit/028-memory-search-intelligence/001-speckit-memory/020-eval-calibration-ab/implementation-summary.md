---
title: "Implementation Summary: Eval-Gated Confidence Calibration and Shipped-Lever A/B"
description: "Planning-state summary for graduating the dormant isotonic confidence calibration on held-out ECE evidence and A/Bing the three default-on search levers. Both candidates are PENDING — no implementation has started; both are gated on the 019 eval-harness."
trigger_phrases:
  - "calibration ab implementation summary"
  - "isotonic calibration status"
  - "shipped levers ab status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/020-eval-calibration-ab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-state doc; implementation not started"
    next_safe_action: "Confirm the 019 eval-harness ECE lane, then harvest calibration labels."
    blockers:
      - "Gated on the 019 eval-harness ECE lane + A8 promotion gate."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
    completion_pct: 0
    open_questions:
      - "Held-out ECE split + identity-baseline margin to graduate the flag."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/028-memory-search-intelligence/001-speckit-memory/020-eval-calibration-ab` |
| **Completed** | Pending |
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — not started |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is implemented yet. This sub-phase is a re-plan output: it scopes the two measurement-gated retrieval-intelligence candidates the `008-retrieval-evaluation` campaign converged on as the eval-harness's first *consumers*. Both are PENDING — neither appears in the Wave-0 shipped record (`030-memory-search-intelligence-impl/spec.md` §14).

### Planned: Graduate the Isotonic Confidence Calibration (`A2-isotonic-calibration`)

The isotonic PAV machinery is fully built but un-promotable: `fitCalibration` (`confidence-calibration.ts:145`) has zero non-test callers, the docs' "proxy seed" is a phantom (no on-disk artifact), and no ECE/Brier/reliability metric exists anywhere (`eval-metrics.ts`, grep-clean) — so 027's promote-on-evidence doctrine is literally unexecutable for this flag. The plan harvests label pairs by instrumenting the `eval_run_ablation` loop to emit `(query, memoryId, rawValue=rebalancedValue, relevant)` (giving the fitter its first non-test caller), binarizes the graded 0-3 golden labels (`grade >= 2 -> 1`) past `loadLabeledSet`'s binary requirement (`:73`), adds the missing ECE + Brier + reliability-bin lane over a held-out split (the validation crux), and runs a three-way shadow (identity vs materialized proxy-seed vs traffic-fit) that graduates the flag default-on only when the real fit beats identity. NET-NEW/EXTENDS, finder H/S (the math is built; only the harvest-glue + ECE lane are missing).

### Planned: A/B the Levers 017/015 Shipped Default-On but Unmeasured (`A3-AB-shipped-levers`)

Three levers ship default-on with zero recall evidence: S5 cosine head-reorder (`reorderTopNByCosine`, `hybrid-search.ts:2014-2021`), S3 generic-query/complexity escalation (`query-classifier.ts:157,:245`, `SPECKIT_COMPLEXITY_ROUTER` `:62`), and S2 the top-dominant request-quality verdict (`assessRequestQuality`, `TOP_DOMINANT_THRESHOLD=0.8`, `confidence-scoring.ts:78,:385,:423`). The harness cannot see S5 today — it runs only outside `evaluationMode` (`hybrid-search.ts:1989,:2021`) — so the A/B searchFn must set `evaluationMode:false` first. S5 also carries a confirmed but BOUNDED silent demotion (a fused-non-vector hit resolves to RRF magnitude ~0.03 and sinks below cosine hits; head-only, rank-not-eviction, rare per verify iter-010), folded into the A/B as a small-effect lever, not a dedicated fix. S3 is predicted MOST-LIKELY-NET-NEGATIVE on precise short content-bearing queries. The plan A/Bs each lever on the golden set and reports its measured effect.

Both are intelligence-class (calibration changes reported confidence magnitudes on promotion; the levers change ranking/escalation/verdict), so they ship behind default-off shadow flags and promote only on captured evidence (the 027 doctrine + regression-baseline-and-delta rule). No measured benefit number exists for either today; all leverage is structural inference.

### Files Changed
None yet. The planned change set is enumerated in `spec.md` §3 (Files to Change) and `plan.md` (Affected Surfaces).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Planned delivery order (from `plan.md`): confirm the 019 eval-harness ECE lane + gate-zero reindex → binarize the golden set and harvest calibration pairs → wire `fitCalibration` and add the ECE lane → three-way shadow + flag graduation → fix the S5 eval-mode blind spot → A/B S5/S3/S2 → verify (tests, tsc, strict validation, comment hygiene, held-out ECE + per-lever deltas).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Consume the harness, do not build it.** The 019 eval-harness spine (`C9-1/C9-2/C9-3 → A8`) is a separate sibling phase; this phase adds only the calibration-specific label-harvest + ECE-validation wiring and the A/B searchFn.
- **Promote only on held-out ECE evidence.** The dormant calibration is frozen at opt-in precisely because no calibration-error gate exists to make its promote evidence; the three-way shadow on held-out ECE supplies it.
- **Reuse, don't rebuild.** The PAV fitter and all three levers are reused as-is; no forked calibration math or duplicated lever logic.
- **Fix the eval-mode blind spot before the S5 A/B.** S5 is invisible under `evaluationMode`; the A/B searchFn sets `evaluationMode:false` so the reorder is actually measured.
- **S5 demotion is bounded.** The fused-non-vector demotion is head-only, rank-not-eviction, and rare (verify iter-010), so it folds into the A/B as a small-effect lever rather than a dedicated fix.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Pending — no verification has run. The required gates are: the 019 eval-harness ECE lane confirmed, a held-out ECE comparison (real fit vs identity), per-lever golden-set A/B deltas reported, `npx tsc --noEmit` exit 0, the eval/calibration and no-op suites, `validate.sh --strict` 0 errors, and comment-hygiene clean. Evidence rows will be filled when the gates run.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

Pending. Planned checks: label harvest rides the existing baseline pass with no second search pass (NFR-P01); the ECE/reliability computation runs at the aggregation layer, not per-query inline (NFR-P02); production calibration + lever defaults are a strict no-op until promotion (NFR-R01); `maybeCalibrate` degrades fail-open on a missing/unloadable model (NFR-R02).
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- No measured benefit number exists for either candidate; all leverage estimates are structural inference (roadmap BROADENING §6; `synthesis/08` "Honest caveats"). The held-out ECE and the golden-set A/B deltas are the gates that convert this into a measured result.
- Both candidates are BLOCKED on the 019 eval-harness (ECE lane + A8 promotion gate), which is not yet a built sibling phase; until it ships, this phase can deliver only the calibration consumer wiring and must HALT at promotion.
- The S3 escalation A/B may confirm a net-negative on precise short content-bearing queries; fixing the escalation heuristic is out of scope for this phase (measured, not repaired here).
- The 008 synthesis seat flagged that the A2/A3 *framings* were inferred from headlines under a read-cap; the iter-004/005 deltas (re-read here) carry the load-bearing file:line evidence.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations

The research notation for these candidates is mangled in two synthesis surfaces — `synthesis/01-go-candidates.md` and the roadmap render "isotonic"/"ECE" as the literal token "n" (e.g. "the n machinery", "n/Brier"). The authoritative, un-mangled source is `synthesis/08-retrieval-evaluation-findings.md` (#6/#7) plus the `../research/from-008-retrieval-evaluation/deltas/iter-004.jsonl` (A2) and `iter-005.jsonl` (A3); this phase is grounded in those. Research line numbers drift slightly from the live code (e.g. `TOP_DOMINANT_THRESHOLD` at `:78` not `:67`, `assessRequestQuality` at `:385` not `:355`); the verified live lines are cited. The brief's "checklist for level 3" note is superseded by the Level-2 validator, which requires `checklist.md` and `implementation-summary.md` for Level 2; both are included.
<!-- /ANCHOR:deviations -->
