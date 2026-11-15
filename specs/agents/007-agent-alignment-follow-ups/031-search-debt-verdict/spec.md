---
title: "Feature Specification: Phase 31: search-debt-verdict"
description: "Open search debt makes the dashboard verdict CONDITIONAL, but the final verdict script and the fan-out merge ignore it, so a review with open debt and no P1 finding ends PASS while its dashboard said CONDITIONAL. The operator chose that debt makes the final verdict CONDITIONAL."
trigger_phrases:
  - "search debt verdict"
  - "phase 31 search debt verdict"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 31: search-debt-verdict

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 31 of 33 |
| **Predecessor** | 030-review-count-source |
| **Successor** | 032-traceability-reserve-iteration |
| **Handoff Criteria** | The verdict script, the merge and the dashboard give CONDITIONAL on open debt, the contract states it, tests cover each path, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 31** of the agent alignment follow-ups. It builds one fix from the Fable 5.2 report on the four known limits.

**Scope Boundary**: `review-verdict.cjs`, `fanout-merge.cjs`, the dashboard verdict in `reduce-state.cjs`, the contract's CONDITIONAL and PASS conditions with the rendered snapshot, the two `deep-review.yaml` steps that bind and pass the debt, and tests.

**Dependencies**:
- Phase 30, which binds the counts from the verdict script
- Operator decision 2026-11-15: debt makes CONDITIONAL

**Deliverables**:
- Search debt in the one verdict function
- A debt union across lineages in the merge
- Contract and report wording for a debt-only CONDITIONAL
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deriveReviewVerdict` in `.skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs` takes P0, P1, P2 and failed gates only. The dashboard (`reduce-state.cjs:2213-2219`) adds open `searchDebt`, and the report step (`.skilled/commands/deep/assets/deep-review.yaml:2043`) tells the agent to carry debt as CONDITIONAL. So the final verdict and the dashboard can disagree on the same registry.

### Purpose
Make open search debt one of the verdict function's inputs, so the final verdict, the merge and the dashboard agree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "hasSearchDebt" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
2213:  const hasSearchDebt = Array.isArray(registry.searchDebt) && registry.searchDebt.length > 0;
# the dashboard verdict reads debt; review-verdict.cjs and fanout-merge.cjs do not

$ sed -n 107,110p .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml
    - id: CONDITIONAL
      condition: "activeP0 == 0 AND activeP1 > 0"

$ python3 - < count-debt   # inline count over registries changed 2026-10-01 onward
registries 60 with searchDebt 5 PASS->CONDITIONAL 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deriveReviewVerdict` takes an open search debt count; with no P0 and no failed gate, debt above zero gives CONDITIONAL
- The CLI reads `searchDebt` from the registry, takes `--search-debt N` in bound mode and prints `search_debt`
- `fanout-merge.cjs` unions debt across lineages by bug class, passes it to the verdict and prints `search_debt`
- `step_fanout_merge` binds it and the fan-out branch of `step_derive_verdict` passes it (.skilled/commands/deep/assets/deep-review.yaml)
- The dashboard verdict calls the shared function
- The contract's CONDITIONAL and PASS conditions name open search debt; the snapshot is re-rendered
- The report says a debt-only CONDITIONAL is cleared by covering or ruling out the debt in another review

### Out of Scope
- Changing how the reducer computes `searchDebt`
- The stop-time candidate coverage gate, which already vetoes STOP on debt

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs` | Modify | Debt input, flag and output |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Debt union and verdict input |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Dashboard uses the shared function |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Modify | CONDITIONAL and PASS conditions |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | Modify | Re-rendered |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Bind and pass debt; report wording |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Recompiled |
| `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` | Modify | Version constant matches the published snapshot |
| `.skilled/skills/system-deep-loop/deep-review/` and `runtime/feature-catalog/` docs | Modify | Verdict rule includes debt |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/review-dashboard-verdict.vitest.ts` | Create | Dashboard verdict with debt |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One function turns open search debt into CONDITIONAL. | Unit tests: debt alone gives CONDITIONAL, debt with P0 gives FAIL, debt with a failed gate gives FAIL, no debt keeps today's verdicts, PASS never has debt |
| REQ-002 | The fan-out path carries debt. | A merge test with debt in one lineage gives `search_debt` above zero and a CONDITIONAL merged verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The contract and the dashboard agree with the function. | The contract conditions name debt, the snapshot check passes, and a reducer test with debt and no P1 shows CONDITIONAL |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new tests.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Old registries without `searchDebt` | Low | Missing debt counts as zero |
| Dependency | Contract parity and snapshot tests | Low | Run them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator decided debt makes CONDITIONAL.
<!-- /ANCHOR:questions -->

---


