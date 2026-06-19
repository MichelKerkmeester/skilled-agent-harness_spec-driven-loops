---
title: "Feature Specification: Eval-Gated Confidence Calibration and Shipped-Lever A/B"
description: "The Spec-Kit Memory MCP ships a fully-built isotonic confidence-calibration machinery whose fitter has zero non-test callers and no ECE metric to validate it against, plus three search levers (cosine head-reorder, generic-query escalation, top-dominant verdict) that 017/015 shipped default-on with zero recall evidence. This phase graduates the dormant calibration on real ECE evidence and A/Bs the three unmeasured levers on the golden set, both gated on the 019 eval-harness metric lanes."
trigger_phrases:
  - "isotonic confidence calibration graduation"
  - "ece calibration metric memory"
  - "ab shipped search levers"
  - "cosine reorder generic escalation verdict ab"
  - "eval gated calibration promotion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/020-020-eval-calibration-ab"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored eval-calibration-ab sub-phase from 028 child-008 research"
    next_safe_action: "Confirm the 019 eval-harness ECE lane is built before harvesting calibration labels."
    blockers:
      - "Gated on the 019 eval-harness (C9-1/C9-2/C9-3 metric lanes + A8 per-class promotion gate); not yet a built sibling phase."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-020-eval-calibration-ab"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact ECE held-out split and the identity-baseline margin the real fit must beat to graduate the flag."
      - "Whether the S5 demotion of fused-non-vector hits is large enough on the golden set to warrant a dedicated fix, or stays a bounded small-effect lever."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Eval-Gated Confidence Calibration and Shipped-Lever A/B

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | `../spec.md` (028 / 001-speckit-memory research phase) |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence |
| **Wave** | Wave-2 (intelligence-class; shadow-gated; gated on the 019 eval-harness) |
| **Candidates** | `A2-isotonic-calibration`, `A3-AB-shipped-levers` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a Wave-2 implementation sub-phase under the `001-speckit-memory` research phase of packet 028 (the PRIMARY subsystem). It implements the two measurement-gated retrieval-intelligence candidates the `008-retrieval-evaluation` campaign converged on as the eval-harness's first *consumers* — both are downstream of the C9→A8 build spine and ship only once that harness can produce the evidence they promote on:

- **`A2-isotonic-calibration`** — graduate the fully-built-but-dormant isotonic confidence calibration. The PAV fitter `fitCalibration` has zero non-test callers, the "proxy seed" the docs claim shipped is a phantom (no on-disk artifact), and no ECE/Brier/reliability metric exists anywhere — so 027's promote-on-evidence doctrine is literally unexecutable for this flag. Harvest real labels → fit → measure ECE vs identity → flip the flag on evidence.
- **`A3-AB-shipped-levers`** — A/B the three levers 017/015 shipped default-on but never measured against recall: cosine head-reorder (S5), generic-query escalation (S3), and the top-dominant request-quality verdict (S2). On/off each on the golden set and report the measured effect.

Both are PENDING — neither appears in the flat Wave-0 shipped record (`030-memory-search-intelligence-impl/spec.md` §14 has no row for either; that record's candidate ledger stops at the additive/reversible Wave-0 set). Both are intelligence-class (calibration changes reported confidence magnitudes; the levers change ranking, escalation, and the gate verdict), so they ship behind default-off shadow flags and promote only on captured live evidence per the 027 doctrine and the regression-baseline-and-delta rule. No measured benefit number exists for either candidate today; every leverage estimate in the research is structural inference (`synthesis/08`, "Honest caveats").

**Scope Boundary**: This phase *consumes* the eval-harness — it does NOT build it. The harness metric lanes (gate-verdict / ECE / cold) and the per-class promotion gate (the `C9-1/C9-2/C9-3 → A8` spine) are a separate sibling phase; this phase adds the calibration label-harvest glue + the ECE validation lane's *consumer*, and the A/B searchFn wiring. It also does NOT build new calibration math (the PAV fitter is complete) or new lever logic (all three levers already ship in code).

**Dependencies**:
- **The 019 eval-harness spine (BLOCKING).** The ECE metric lane (`C9-3` over `lib/eval/eval-metrics.ts`) and the class-parameterized promotion gate (`A8` un-welding `lib/feedback/shadow-scoring.ts:43,:68,:93` from its hardcoded `meanNdcgDelta`) are the evidence machinery both candidates promote against (sibling phase `019-019-eval-harness-extension`). They are not yet a built sibling under `001-speckit-memory` (only the gate-zero precondition `001-001-corpus-reindex-gate-zero` exists). A2's ECE validation lane and A3's metric reporting both block on it.
- **Gate-zero corpus reindex** (`001-001-corpus-reindex-gate-zero`) — no recall/calibration number is trustworthy against a partly-cold index. Reindex is gate-zero for every candidate here.
- `fitCalibration` PAV isotonic fitter (`lib/search/confidence-calibration.ts:145`) — built, zero non-test callers.
- `maybeCalibrate` runtime apply (`lib/search/confidence-scoring.ts:217-218`, fed `rebalancedValue` at `:348,:353`) — inert unless `isConfidenceCalibrationEnabled()` AND a model file loads.
- The live `eval_run_ablation` runner + `ablation-framework.ts` alignment guard + the 110-query graded golden set — the host for both label harvest and the A/B.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP ships two classes of unvalidated retrieval intelligence — dormant calibration machinery that cannot be promoted, and default-on levers that were never measured:

- **The isotonic calibration is built but un-promotable.** The full PAV isotonic-regression fitter exists (`fitCalibration`, `confidence-calibration.ts:145`) and the runtime apply path is wired (`maybeCalibrate`, `confidence-scoring.ts:217-218`), but `fitCalibration` has **zero non-test callers** (only `tests/confidence-calibration.vitest.ts`), the "proxy seed" the docs say shipped is a **phantom** (no JSON/generator on disk), and **no ECE/Brier/reliability metric exists anywhere** under `lib/`/`handlers/`/`scripts/` (grep-clean). The fit therefore *cannot be validated*, so 027's promote-on-evidence doctrine is unexecutable for this flag. There are also two label-shape blockers: the fit x-axis (`rebalancedValue`, `confidence-scoring.ts:348`) is computed and never captured, and `loadLabeledSet` rejects non-binary relevance while the golden labels are graded 0-3. [CONFIRMED: `confidence-calibration.ts:145` (zero non-test callers); `confidence-scoring.ts:217-218,348,353`; `confidence-calibration.ts:73` (`loadLabeledSet`); grep ECE/Brier = 0]
- **Three levers ship default-on with zero recall evidence.** The cosine head-reorder (S5, `reorderTopNByCosine`), the generic-query/complexity escalation (S3, `query-classifier.ts`), and the top-dominant request-quality verdict (S2, `assessRequestQuality` with `TOP_DOMINANT_THRESHOLD=0.8`) all ship on by default but were never A/B'd. Worse, the harness **cannot even see S5**: `reorderTopNByCosine` runs only in the non-`evaluationMode` branch (`hybrid-search.ts:1989,2021`, "Skipped in evaluationMode"), so a labeled-set eval exercises the *pre-reorder* order and silently reports S5 a no-op. S5 also carries a confirmed (but bounded) silent regression: a hit ranked high via fts/graph/bm25 but missed by the vector lane resolves to RRF magnitude ~0.03 (`resolveAbsoluteRelevance` fallback) and sinks below every cosine hit. [CONFIRMED: `hybrid-search.ts:1989,2014-2021` (eval-mode skip); `confidence-scoring.ts:78,385,423` (verdict); `query-classifier.ts:62,157,245`; verify iter-010 (demotion REFINED bounded: head-only, rank-not-eviction, rare)]

### Purpose
Make the dormant isotonic calibration promotable on real evidence — harvest the label pairs, binarize the graded golden set, build the missing ECE lane (as the harness consumer), and graduate the flag only when a real fit beats identity on held-out ECE — and measure each of the three default-on levers with an on/off A/B on the golden set (fixing the S5 eval-mode blind spot first), reporting whether each earns its default-on status. Nothing graduates without the 019 harness evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Harvest calibration label pairs: instrument the `eval_run_ablation` baseline loop to emit `(query, memoryId, rawValue=rebalancedValue, relevant)` so `fitCalibration` finally has a non-test caller (the label→`CalibrationSample` glue, the module's named blocker).
- Binarize the graded golden set for calibration: derive `relevant = grade >= 2 ? 1 : 0` so the graded 0-3 labels satisfy `loadLabeledSet`'s binary requirement, yielding ~550-1100 pairs (above the floor).
- Add the missing calibration-error lane: ECE + Brier + reliability bins over a held-out split in the eval-metrics aggregation (the validation crux — calibration accuracy is orthogonal to the 12 existing ranking metrics). **This lane is the A2 consumer the 019 harness hosts; if the 019 phase already delivers it, this phase wires the consumer, not the metric.**
- Add a three-way calibration shadow comparison: identity (OFF) vs materialized proxy-seed fit vs real-traffic fit, scored on held-out ECE, model path-swappable at runtime.
- Graduate the calibration flag (`SPECKIT_CONFIDENCE_CALIBRATION` / `isConfidenceCalibrationEnabled`) default-on **only** when the real fit beats identity on held-out ECE, encoded as the 027 flag lifecycle (opt-in → feature-on → rollback).
- Fix the S5 eval-mode blind spot: make the A/B searchFn set `evaluationMode:false` and toggle `SPECKIT_COSINE_TOPN_REORDER` so the harness actually exercises the reorder.
- A/B the three levers on the golden set: cosine head-reorder (S5, toggle `SPECKIT_COSINE_TOPN_REORDER`), generic-query/complexity escalation (S3, toggle `SPECKIT_COMPLEXITY_ROUTER`, partitioned escalated/non-escalated), and the top-dominant verdict (S2, citability-label confusion incl. the false-good-on-hard-negatives cell); report each measured effect.
- Add the S5 demotion instrument: flag rows that move post-reorder rank up while being golden-relevant and lacking `.similarity` (pre vs post-reorder rank delta), confirming or bounding the demotion class.
- Add tests for the label-harvest glue, grade binarization, the ECE/reliability-bin lane, the three-way shadow comparison, the S5 eval-mode toggle, and each lever's A/B partition.

### Out of Scope
- **Building the 019 eval-harness spine itself** — the `C9-4` coverage guard, `C9-1` single-pass emit, `C9-2` `enrichGroundTruth` tagging, the `C9-3` three corpus metrics as new plumbing, and the `A8` per-class promotion gate are a separate sibling phase. This phase is a *consumer* (A2/A3 are the harness's downstream intelligence-class candidates); it adds only the calibration-specific label-harvest + ECE-validation wiring and the A/B searchFn.
- The corpus reindex (`001-001-corpus-reindex-gate-zero`) — a prior gate-zero phase; not re-run here.
- New isotonic/PAV calibration *math* (the fitter is complete) or new lever *logic* (all three levers already ship).
- A dedicated S5 fix — the demotion is bounded (head-only, rank-not-eviction, rare); it folds into the A/B as a small-effect lever, not a separate change, unless the golden-set A/B shows it is large.
- The other two `008` Wave-2 consumers (A5 cold-tier re-measure, A7-1 reorg) and the Wave-0 correctness items (A7-4 TTL, A4-residual) — separate phases.
- Changing the other three subsystems (code-graph, skill-advisor, deep-loop) — sibling phases.
- Touching host daemons or live `mcp_server/database/**` shards.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts` | Modify | Instrument the `eval_run_ablation` baseline loop to emit `(query, memoryId, rawValue, relevant)` calibration pairs and to run the lever A/B searchFn variants with `evaluationMode:false`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts` | Modify | Add the ECE + Brier + reliability-bin calibration lane (held-out split) alongside the 12 ranking metrics; add the S5 pre/post-reorder demotion instrument and the S2 citability confusion cell. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts` | Modify | Binarize graded relevance (`grade >= 2 -> 1`) into the `CalibrationSample.relevant` shape; supply the label set for the fit. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modify | Expose/capture `rebalancedValue` (the fit x-axis, `:348`) at the calibration emit point; keep `maybeCalibrate` (`:217`) the single apply seam. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts` | Read/Modify | Wire `fitCalibration` (`:145`) to the harvested labels (its first non-test caller); accept the binarized `loadLabeledSet` input (`:73`). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts` | Modify | Add the three-way (identity / proxy-seed / traffic) calibration shadow comparison scored on held-out ECE (the eval-side ablation shadow). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts` | Read/Modify | The promotion gate (the hardcoded `meanNdcgDelta` weld + flag lifecycle, `:43,:68,:93`) that the 019 phase un-welds into a per-class panel; this phase routes the calibration flag through that gate's promote/wait/rollback lifecycle. Owned by the 019 eval-harness phase — coordinate, do not fork. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Read | The S5 reorder seam (`:1989,:2014-2021`) and `resolveAbsoluteRelevance` fallback (`:41`, `pipeline/types.ts`) — read for the A/B and the demotion instrument; the reorder itself is not changed. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts` | Read | The S3 escalation seam (`:157,:245`) and `SPECKIT_COMPLEXITY_ROUTER` (`:62`) — read for the A/B partition. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Read | `isConfidenceCalibrationEnabled` (`:622`) and the lever flags — read; flag graduation is a default change, not a new flag. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/**` | Create | Label-harvest, grade-binarization, ECE/reliability-bin, three-way shadow, S5 eval-mode toggle, and per-lever A/B tests (temp/in-memory fixtures only). |
| `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/020-020-eval-calibration-ab/*` | Create | This phase's documentation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 019 eval-harness ECE lane and promotion gate are confirmed available before any graduation. | The `C9-3` calibration metric lane and the `A8` per-class promotion gate (sibling phase) are confirmed built; if absent, this phase delivers only the calibration-specific consumer wiring and HALTS at promotion. [research: `synthesis/08` "the isotonic calibration flag is frozen at opt-in precisely because no CLASS-G gate exists to make its promote evidence — this supplies the missing gate, not a new flag"] |
| REQ-002 | `fitCalibration` has a real (non-test) caller harvesting label pairs. | The `eval_run_ablation` loop emits `(query, memoryId, rawValue=rebalancedValue, relevant)` pairs and calls `fitCalibration`; a test asserts a non-empty `CalibrationSample[]` is produced. [research: A2-C1-FIT-INPUT-JOIN, "fitCalibration has ZERO non-test callers … only harvest-glue missing"; `confidence-calibration.ts:36-39,145`; `confidence-scoring.ts:316-323`] |
| REQ-003 | Graded golden labels are binarized into the binary calibration shape. | `grade >= 2 -> relevant=1` produces ~550-1100 pairs (above the ~50-100 floor) accepted by `loadLabeledSet` (which rejects non-binary). [research: A2-C2-GRADE-BINARIZE; `confidence-calibration.ts:31,41,73,91`; `ground-truth-feedback.ts:362-373`] |
| REQ-004 | An ECE/Brier/reliability calibration lane exists over a held-out split. | The eval-metrics aggregation reports ECE + Brier + reliability bins; this is the validation crux — without it the fit cannot be promoted. [research: A2-C4-CALIBRATION-ERROR-METRIC "validation crux … 027 promote-on-evidence is literally unexecutable for this flag"; `eval-metrics.ts` (no ECE today, grep-clean)] |
| REQ-005 | The calibration flag graduates default-on ONLY on held-out ECE evidence. | A three-way shadow (identity / proxy-seed / traffic-fit) is scored on held-out ECE; the flag flips default-on only when the real fit beats identity, encoded as the flag lifecycle (opt-in → feature-on → rollback). [research: A2-C5-SHADOW-3WAY; `confidence-scoring.ts:170-179` runtime model-swap; `synthesis/08` #6] |
| REQ-006 | The S5 eval-mode blind spot is fixed before the S5 A/B. | The A/B searchFn sets `evaluationMode:false` and toggles `SPECKIT_COSINE_TOPN_REORDER`, so the harness exercises the reorder (it is skipped under `evaluationMode` today). [research: C1-s5-evalmode-blindspot; `hybrid-search.ts:1989,2014-2021`] |
| REQ-007 | Each of the three levers is A/B'd on the golden set with its measured effect reported. | On/off A/B of S5 (cosine reorder, nDCG@1 + top-1 precision), S3 (escalation, recall@k partitioned escalated/non-escalated), and S2 (verdict citability confusion incl. false-good-on-hard-negatives) is run and reported. [research: A3 iter-005 C1/C3/C4; `synthesis/08` #7] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The S5 demotion class is instrumented and bounded or confirmed. | A pre/post-reorder rank instrument flags rows that sink while golden-relevant and lacking `.similarity`; the effect is reported as bounded (head-only, rank-not-eviction) or escalated if large. [research: C2-s5-demotes-fused-nonvector-hits; verify iter-010 REFINED bounded; `pipeline/types.ts:89-96`; `hybrid-search.ts:2439-2444`] |
| REQ-009 | No new calibration math or lever logic is added. | The PAV fitter and all three levers are reused as-is; only harvest-glue, the ECE lane, the A/B searchFn, and the flag default change. [research: A2 "Math built; only harvest-glue missing"; A3 levers all already ship] |
| REQ-010 | Verification avoids live shards and host daemons. | Tests use temp/in-memory fixtures and the golden set; no access to `mcp_server/database/**`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `fitCalibration` is called from the eval runner with harvested, binarized label pairs (its first non-test caller), producing a non-empty `CalibrationSample[]`.
- **SC-002**: The eval-metrics aggregation reports ECE + Brier + reliability bins on a held-out split — the previously-absent calibration lane.
- **SC-003**: The three-way calibration shadow (identity / proxy-seed / traffic) is scored on held-out ECE, and the flag graduates default-on only when the real fit beats identity.
- **SC-004**: The S5 A/B exercises the actual reorder (`evaluationMode:false`), and each of S5/S3/S2 has a reported on/off measured effect on the golden set.
- **SC-005**: With the calibration flag and the lever flags at their pre-change defaults, recall/confidence output is unchanged from baseline (the A/B harness is observe-only until promotion).
- **SC-006**: TypeScript, targeted vitest files, the eval/calibration suite, strict spec validation, and comment-hygiene checks pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 019 eval-harness (ECE lane + A8 gate) is not yet a built sibling | A2/A3 cannot promote without the evidence machinery | Confirm the harness phase first (REQ-001); deliver consumer wiring and HALT at promotion if absent. |
| Dependency | Gate-zero corpus reindex (`001-001`) | A cold index makes every calibration/recall number untrustworthy | Reindex is gate-zero; do not benchmark against a partly-cold index. |
| Risk | Phantom proxy-seed | The shadow baseline the traffic-fit must beat does not exist on disk | The three-way shadow forces materializing the proxy-seed as the explicit baseline (REQ-005). |
| Risk | Non-binary label rejection | `loadLabeledSet` rejects graded 0-3 labels | Binarize `grade >= 2 -> 1` before the fit (REQ-003). |
| Risk | S5 invisible to the harness | A/B silently reports S5 a no-op | Set `evaluationMode:false` in the A/B searchFn (REQ-006). |
| Risk | S5 silent demotion | Fused-non-vector golden hits sink below cosine hits | Instrument pre/post-reorder rank; confirm it stays bounded (head-only, rare) or escalate (REQ-008). |
| Risk | S3 escalation net-negative on precise short queries | A precise 3-term content-bearing query eats the reduced route and loses recall | Partition the A/B {escalated, non-escalated} so the heuristic's blind spot is measured, not assumed. |
| Risk | Promoting on a cold or thin label set | A fit validated on too few / un-embedded pairs over-claims | Gate on the ~550-1100-pair floor + gate-zero coverage + held-out ECE. |
| Risk | Unmeasured leverage | No benefit number exists; all leverage is structural inference | Promote only on the captured ECE/recall delta; observe-only until then. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Label harvest rides the existing `eval_run_ablation` baseline pass — it must not add a second full search pass per query.
- **NFR-P02**: The ECE/reliability-bin computation runs at the aggregation layer (corpus-level), not per-query inline.

### Reliability
- **NFR-R01**: With the calibration flag and lever flags at their pre-change defaults, the change is a strict no-op on recall ordering and reported confidence (the harness is observe-only).
- **NFR-R02**: `maybeCalibrate` remains a single apply seam; a missing/unloadable calibration model degrades to the raw value, never throws.

### Maintainability
- **NFR-M01**: Reuse the PAV fitter and all three levers as-is; no forked calibration math or duplicated lever logic.
- **NFR-M02**: New code comments must avoid ephemeral artifact labels (spec paths, candidate ids, phase numbers).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Thin label set**: fewer than the ~50-100-pair floor — the fit is skipped and the flag stays opt-in (no promotion on thin evidence).
- **All-positive golden labels**: hard-negatives carry no grade-0 rows; the citability "expect non-citable" label derives from the `hard_negative` *category*, not a grade-0 row.
- **Un-embedded golden rows**: gate-zero coverage not met — the calibration run is refused (no calibration number against a cold index).

### Flag Combinations
- **Calibration flag off (default today)**: `maybeCalibrate` returns the raw value; recall confidence is baseline.
- **A/B harness toggles**: the lever toggles affect only the A/B searchFn variants, not production defaults, until a promotion decision flips them.
- **Proxy-seed absent**: the three-way shadow materializes it as the explicit identity-plus baseline rather than skipping the comparison.

### Failure Scenarios
- **`fitCalibration` on degenerate input**: a monotone-trivial fit (all same grade) yields identity — caught by the held-out ECE not beating identity, so no promotion.
- **S5 reorder off under evaluationMode**: detected by the eval-mode toggle test asserting the reorder actually ran in the A/B.
- **Calibration model file unloadable at runtime**: `maybeCalibrate` falls back to raw (NFR-R02), the flag effectively neutralized.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Two candidates over the eval harness: label-harvest glue + binarization + a new ECE lane + three-way shadow + S5 eval-mode fix + three lever A/B partitions. |
| Risk | 16/25 | Changes reported confidence magnitudes (on promotion) and measures default-on levers; phantom-proxy, non-binary-label, eval-mode-blindness, and S5-demotion traps; unmeasured leverage. |
| Research | 7/20 | Seams confirmed to live file:line; the open items are the empirical ECE margin and whether S5's demotion is large enough to escalate. |
| Multi-Agent | 0/15 | Single-stream implementation. |
| Coordination | 9/15 | Hard dependency on the 019 eval-harness sibling + the gate-zero reindex; shares the eval-metrics/ablation surface with other 008 consumers. |
| **Total** | **48/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:candidate-status -->
## 9. CANDIDATE STATUS

Per-candidate status. Neither candidate appears in the Wave-0 shipped record (`030-memory-search-intelligence-impl/spec.md` §14), so both are PENDING. Both are Wave-2 intelligence-class consumers gated on the 019 eval-harness.

| Candidate | Status | Gate | Evidence / Notes |
|-----------|--------|------|------------------|
| `A2-isotonic-calibration` | **PENDING** | needs-benchmark + shared-infra-dep (019 eval-harness ECE lane + A8 gate) | The isotonic PAV machinery is **fully built** but `fitCalibration` (`confidence-calibration.ts:145`) has **zero non-test callers** (only `tests/confidence-calibration.vitest.ts`), the "proxy seed" is a **phantom** (no on-disk artifact), and **no ECE/Brier/reliability metric exists** (`eval-metrics.ts`, grep-clean) — so promote-on-evidence is unexecutable until the ECE lane ships. Two label-shape blockers: the fit x-axis `rebalancedValue` is computed-not-captured (`confidence-scoring.ts:348`), and `loadLabeledSet` rejects non-binary while golden labels are graded 0-3 (`confidence-calibration.ts:73`). Not in 030 §14 → not shipped. Seams: `confidence-calibration.ts:36-39,73,145`; `confidence-scoring.ts:170-179,217,348,353`; `eval-metrics.ts` (new ECE lane); `ground-truth-feedback.ts:362-373`; `shadow-scoring.ts` (three-way). |
| `A3-AB-shipped-levers` | **PENDING** | needs-benchmark (019 golden-set A/B) | Three levers ship **default-on with zero recall evidence**: S5 cosine head-reorder (`reorderTopNByCosine`, `hybrid-search.ts:2014-2021`), S3 generic-query/complexity escalation (`query-classifier.ts:157,245`, `SPECKIT_COMPLEXITY_ROUTER` `:62`), S2 top-dominant verdict (`assessRequestQuality`, `TOP_DOMINANT_THRESHOLD=0.8`, `confidence-scoring.ts:78,385,423`). The harness **cannot see S5** — it runs only outside `evaluationMode` (`hybrid-search.ts:1989,2021`), so an eval reports it a no-op; the A/B searchFn must set `evaluationMode:false`. S5 carries a **confirmed but BOUNDED** silent demotion (fused-non-vector hit → RRF magnitude ~0.03 → sinks below cosine hits; head-only, rank-not-eviction, rare per verify iter-010) — folds into the A/B as a small-effect lever, no dedicated fix. S3 is **MOST-LIKELY-NET-NEGATIVE** on precise short content-bearing queries (eats the reduced route). Not in 030 §14 → not shipped. Seams: `hybrid-search.ts:1989,2014-2021,2439-2444`; `pipeline/types.ts:89-96`; `query-classifier.ts:62,157,245`; `confidence-scoring.ts:78,385,423`; `eval-metrics.ts` (S5 demotion + S2 confusion instruments). |
<!-- /ANCHOR:candidate-status -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What is the exact held-out ECE split and the identity-baseline margin the real fit must beat to graduate `SPECKIT_CONFIDENCE_CALIBRATION` default-on? (Resolved by the three-way shadow run, REQ-005.)
- Is the S5 fused-non-vector demotion large enough on the golden set to warrant a dedicated fix, or does it stay a bounded small-effect lever folded into the A/B? (Resolved by REQ-008.)
- Does the S3 escalation A/B confirm the predicted net-negative on precise short content-bearing queries, and if so should the escalation heuristic be widened? (Out of scope to fix here; measured by REQ-007.)
- Is the 019 eval-harness ECE lane delivered by the sibling phase, or does this phase deliver it as the A2 consumer? (Resolved by REQ-001 before promotion.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Parent Spec**: See `../spec.md`.
- **Source research**: `../../research/synthesis/08-retrieval-evaluation-findings.md` (#6 isotonic / #7 A/B levers), `../../008-retrieval-evaluation/research/research.md`, `../../008-retrieval-evaluation/research/deltas/iter-004.jsonl` (A2), `.../deltas/iter-005.jsonl` (A3), `.../deltas/iter-010.jsonl` + `iter-012.jsonl` (verify + tiering), `../../research/roadmap.md` (BROADENING §6 "no measured benefit number").
- **Gate dependency**: `../001-001-corpus-reindex-gate-zero/spec.md` (gate-zero reindex); the 019 eval-harness spine (`C9-1/C9-2/C9-3 → A8`, sibling phase) for the ECE lane + promotion gate.
- **Wave-0 shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (neither candidate listed → PENDING).
<!-- /ANCHOR:related-docs -->
