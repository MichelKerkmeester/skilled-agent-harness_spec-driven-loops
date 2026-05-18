---
title: "Feature Specification: Damp explicit/lexical lane contributions when their evidence is weak"
description: "Introduce a per-lane evidence-confidence damping factor on `explicit_author` and `lexical` so they yield to graph_causal + cosine on ambiguous prompts; sweep the damping curve against the 24-prompt + 22-harder corpora; recommend a damping configuration."
trigger_phrases:
  - "advisor routing calibration"
  - "lane evidence damping"
  - "explicit lexical over-fire fix"
  - "advisor recall lift damping"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/008-advisor-routing-calibration"
    last_updated_at: "2026-05-14T02:15:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000150010"
      session_id: "010-advisor-routing-calibration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Damping function shape: linear / sigmoid / hard-threshold?"
      - "Per-lane threshold OR global threshold?"
      - "Should damping affect only the per-lane weight in fusion, or also the rawScore?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Damp explicit/lexical lane contributions when their evidence is weak

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `010-advisor-routing-calibration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 015 sub-packets 001-008 proved the cosine lane cannot flip routings on either tested corpus (24-prompt + 22-harder) at any semantic weight from 0.00 to 0.30. The 015 next-steps advisory at `scratch/next-steps-advisory.md` identified the only remaining fusion-magnitude lever: **damping explicit/lexical contributions when their evidence is weak**.

The dominant explicit + lexical lanes (combined weight 0.70) currently contribute their full weighted score even when their raw evidence is thin — a single partial keyword match, an ambiguous skill-name fragment. This over-fire prevents `graph_causal` (now skill-side populated via 015/008, raw=0.24 on real prompts) and `semantic_shadow` from influencing decisions on prompts where the dominant lanes' evidence is genuinely weak.

### Purpose
Introduce a per-lane evidence-confidence damping factor on `explicit_author` and `lexical`. When their rawScore is below a damping threshold, scale their contribution down so the other three lanes (graph_causal, derived_generated, semantic_shadow) get to decide. Sweep the damping configuration against the 24-prompt + 22-harder corpora using the 015/003 sweep harness extended for this new dimension. Land an evidence-driven damping configuration that lifts harder-corpus accuracy without flipping today-correct routings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `scorer/fusion.ts` to apply a per-lane damping function. Damping reads from a new `lane-registry.ts` field (per-lane `dampingThreshold` and `dampingFloor`) OR from `AdvisorScoringOptions` override (codex picks the cleaner shape).
- Extend `runLaneWeightSweep` (`scorer/ablation.ts`) to accept a second dimension: damping configurations. Or add a sibling `runLaneDampingSweep`. Codex chooses.
- Extend the existing sweep test to sweep damping configurations alongside the 7 weight vectors.
- Sweep against BOTH corpora: the 24-prompt original + the 22-harder.
- Emit a markdown report at `research/damping-sweep-results.md` with:
  - Per-(weight, damping) combo accuracy table
  - Routing diff vs current production V0 baseline
  - Recommended damping config (or "no winner; current config wins")
- Update `implementation-summary.md` with the recommendation citing specific deltas.

### Out of Scope
- Modifying `lane-registry.ts` weights (still 0.42 / 0.28 / 0.13 / 0.12 / 0.05 from 015/002).
- Modifying the cosine math, the override merge, or the seed-skill-embeddings helper.
- Modifying SKILL.md or skill graph-metadata.json (those are 015/006 + 015/008's domain).
- Modifying `confidenceThreshold` or `uncertaintyThreshold`.
- Adding a 6th lane.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Damping factor is configurable per-lane. | At minimum `explicit_author` and `lexical` carry damping config; other lanes default to no-damping. |
| REQ-002 | Damping function preserves the today-correct routings on the 24-prompt corpus. | New `damping=ON` configurations achieve `todayCorrectAccuracy >= 0.95` on the 24-corpus (current is 1.0000; a small drop is acceptable if intent-described lifts materially). |
| REQ-003 | Sweep tests at least 4 damping configurations (incl. control / no-damping). | Markdown report has ≥4 rows for damping. |
| REQ-004 | Sweep produces variance across damping configurations on the harder corpus. | At least one damping config differs from V0-no-damping on the harder corpus (`flippedFromBaseline > 0`). If still zero variance, the test fails with a diagnostic. |
| REQ-005 | Existing weight-vector sweep dimensions still work unchanged. | The 7 weight vectors from 015/003 still produce stable accuracy when damping is disabled. |
| REQ-006 | Recommendation cites specific accuracy deltas. | implementation-summary recommendation is grounded in numbers, not handwave. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: `npm run typecheck` passes.
- **SC-003**: Sweep test passes; emits the damping report.
- **SC-004**: At least one damping config produces flips on the harder corpus (or the test honestly reports zero variance was achievable).
- **SC-005**: Existing Vitest skill_advisor suite stays at exactly the pre-existing plugin-bridge baseline (1 failure).
- **SC-006**: Recommendation is a concrete damping config OR a documented "no-go" with reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Damping flips today-correct routings | Regression on the 24-prompt baseline | REQ-002 enforces `todayCorrectAccuracy >= 0.95`; sweep results that violate it are rejected |
| Risk | Damping shape is wrong (e.g., too sharp) | Either no effect or excessive over-correction | Sweep multiple shapes (linear / hard-threshold at least) |
| Risk | Damping affects only weight, not rawScore | Hard-threshold case still inflates rawScore | Codex picks the cleaner of (a) weight-scaling only, (b) rawScore + weight scaling, documents in plan.md ADR-tier decision |
| Risk | Sweep variance still zero across all damping configs | Damping not the right lever either | Document negative finding; do not promote |
| Dependency | 015/003 sweep harness + 015/004 seed helper + 015/008 populated skill-side graph_causal | Empirical foundation | All on main |
| Dependency | 015 advisory at `scratch/next-steps-advisory.md` | Driving rationale | On main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Damping function shape (recommend: include at least linear + hard-threshold variants in the sweep)
- Lane-registry vs option-override placement of damping config (recommend: lane-registry for production, option-override for sweep flexibility)
- Whether to also damp `graph_causal` or `derived_generated` when weak (recommend: NO for this packet; focus on explicit + lexical only since they are the over-firing pair per the advisory)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Damping math adds < 1ms per recommend call. |
| NFR-P02 | Performance | Combined sweep (7 vectors × ≥4 damping configs × 2 corpora) completes under 180s with warm cache. |
| NFR-R01 | Reliability | Existing lane fusion semantics preserved when damping is disabled. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Damping threshold causes a lane to contribute negatively (clamp at zero).
- All five lanes get damped on a prompt (return "unknown" as today).
- Damping config in lane-registry conflicts with option-override (option wins; document this).
- Damped lane was the dominant evidence (still let the lane "win" if its damped weighted score is the max).
- Provider unavailable: sweep skips cleanly, same convention as 015/004 + 015/007.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 400-800 | Damping math + sweep extension + tests + report writer |
| **Surface area** | Medium | Scorer fusion core + lane registry + sweep harness + Vitest |
| **Risk** | Medium | Damping shifts production routing — must be sweep-driven |
| **Reversibility** | High | Single-commit revert; damping is gated behind a default-off config |
<!-- /ANCHOR:complexity -->
