---
title: "Implementation Plan: deep-review gate-model reconciliation"
description: "Docs-only reconciliation of 6 deep-review surfaces to the authoritative 9-gate model emitted by the YAML workflows. No code or YAML changes. Investigation already complete."
trigger_phrases:
  - "gate model reconciliation plan"
  - "9-gate alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/001-gate-model-reconciliation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "plan-authored"
    next_safe_action: "reconcile-surfaces"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000006002"
      session_id: "131-000-006-gate-model"
      parent_session_id: "131-000-006-gate-model"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: deep-review gate-model reconciliation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (docs), YAML (read-only authoritative source) |
| **Framework** | sk-doc templates, system-spec-kit validator |
| **Storage** | Spec folder + edits to `.opencode/skills/deep-review/{references,feature_catalog,manual_testing_playbook,changelog}/` |
| **Testing** | Strict validator, `grep` gate-name presence checks, HVR scan |

### Overview

Pure documentation reconciliation. The authoritative gate model (9 gates with `Gate` suffix) was confirmed during the spec investigation by reading both `deep_start-review-loop_{auto,confirm}.yaml` workflows (the producers) and `reduce-state.cjs` (a gate-name-agnostic consumer). Six doc surfaces are edited to enumerate the same 9 gates. No code or YAML changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Authoritative model confirmed (9 gates, YAML producer, reducer agnostic)
- [x] All 6 drifted surfaces enumerated with current state
- [x] Origin findings cross-referenced (LG-0013/0016/0031/0032)

### Definition of Done
- [ ] All 6 surfaces enumerate the same 9 gates
- [ ] Strict validate exits 0
- [ ] HVR clean on all edited surfaces
- [ ] Changelog v1.10.0.0 + SKILL.md version bump
- [ ] implementation-summary.md filled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Authoritative 9-gate model

Emitted by `deep_start-review-loop_{auto,confirm}.yaml` at `step_emit_blocked_stop` (auto line 573, confirm line 581). The `gateResults` object keys, in emission order:

1. `convergenceGate` (weighted stop-score / hard-stop)
2. `dimensionCoverageGate` (all dimensions + traceability covered, coverage_age >= 1)
3. `p0ResolutionGate` (activeP0 == 0)
4. `evidenceDensityGate` (every active P0/P1 has file:line evidence)
5. `hotspotSaturationGate` (hotspots revisited enough)
6. `claimAdjudicationGate` (claim adjudication passed for active P0/P1)
7. `fixCompletenessReplayGate` (security-sensitive fix replay rows pass)
8. `candidateCoverageGate` (v2 rollout: search-debt + candidate coverage)
9. `graphlessFallbackGate` (v2 rollout: graphless fallback mode coverage)

The reducer reads `blockedBy` (string[]) + `gateResults` generically via `formatBlockedByList` + `getNestedField`, it does not hard-code gate names, so the doc model is purely descriptive of the YAML producer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Investigate authoritative model (done during spec authoring)
- [x] Author spec.md / plan.md / tasks.md / checklist.md

### Phase 2: Reconcile surfaces
- [ ] convergence.md §Section-1 event example: add candidateCoverageGate + graphlessFallbackGate (7→9)
- [ ] convergence.md §6 table: add 2 rows (7→9), note candidate + graphless are v2-rollout conditional gates
- [ ] loop_protocol.md §Step-2: update gate list 7→9
- [ ] state_format.md: document candidate + graphless gates in blocked_stop schema
- [ ] feature_catalog/04--severity-system/05-quality-gates.md: enumerate 9 gate names
- [ ] playbook DRV-018: reconcile gate count to 9-gate model
- [ ] changelog/v1.10.0.0.md authored
- [ ] SKILL.md version bump 1.9.0.0 → 1.10.0.0

### Phase 3: Verification
- [ ] grep all 9 gate names present in each reconciled surface
- [ ] HVR scan clean
- [ ] Strict validate exit 0
- [ ] implementation-summary.md filled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Gate-name presence | Each reconciled surface enumerates 9 gates | `grep -c` per gate name |
| Cross-surface consistency | All surfaces match YAML producer | manual diff against `deep_start-review-loop_auto.yaml:573` |
| HVR | All edited markdown | em-dash + semicolon + banned-word scan |
| Strict validate | Spec folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep_start-review-loop_{auto,confirm}.yaml` | Internal (read-only) | Green | Authoritative source; verified present |
| `validate.sh` | Internal | Green | Phase exit blocked |
| `generate-context.js` | Internal | Green | Metadata generation blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reconciliation introduces a gate-name typo or breaks a cross-reference.
- **Procedure**: `git revert <commit-sha>` for the reconciliation commit; docs-only so no runtime impact. Re-run strict validate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Reconcile 6 surfaces) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Reconcile |
| Reconcile | Setup | Verify |
| Verify | Reconcile | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done (investigation complete) |
| Reconcile | Med | 1-2 hours (6 surfaces) |
| Verify | Low | 30 min |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All commits on `main` (no feature branch per `feedback_stay_on_main_no_feature_branches`)
- [ ] Scope-strict staging (only this packet + deep-review/ doc edits)

### Rollback Procedure
1. `git revert <reconciliation-commit-sha>`; docs-only, no runtime impact.
2. Re-run strict validate.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:enhanced-rollback -->
