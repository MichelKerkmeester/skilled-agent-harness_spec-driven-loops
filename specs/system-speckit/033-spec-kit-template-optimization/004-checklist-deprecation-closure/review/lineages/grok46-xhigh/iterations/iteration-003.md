# Iteration 3: D3 Traceability — spec_code, checklist_evidence, overlays

## Focus
Dimension: traceability. Core protocols `spec_code` and `checklist_evidence`. Overlays: `feature_catalog_code`, `playbook_capability`. `skill_agent` and `agent_cross_runtime` are notApplicable for a spec-folder target.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=3 P2=1
- New findings ratio: 0.22

## Findings

### P0, Blocker
- None.

### P1, Required
- None new. F001–F003 from iteration 1 still hold on replay (plan.md still GOAL_SHAPE text; parent map still Pending; continuity still split).

### P2, Suggestion
- **F007**: tasks.md Completion Criteria remain unchecked after every T-task is `[x]`, `specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/tasks.md:89`, [Evidence: T001–T012 are `[x]` (`tasks.md:56-81`) with file:line citations. Completion Criteria still has `- [ ] All tasks marked [x]` (`:89-91`). Leftover CHK-001..CHK-051 rows are `[ ]` by documented design (`implementation-summary.md:120`, spec.md:87). The Completion Criteria block is not that exemption; it is a false pending flag in the same file that lists the work as done.]
- **F008**: No playbook scenario pins count-vs-evidence remaining joined, `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/review-packet-type-marker-gated-validation.md:106`, [Evidence: playbook grep hits one incidental `AC_COVERAGE: Acceptance coverage gate not active...` line. Catalog mentions `check-ac-coverage.sh` only in a representative-subset footnote (`feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:68`). Overlay is advisory.]

## Claim adjudication

F001–F003 packets from iteration 1 re-read; no severity change. No new P0/P1.

```json
{
  "findingId": "F007",
  "claim": "tasks.md says all tasks are marked done in the T-list but the Completion Criteria checklist still shows them pending.",
  "evidenceRefs": [
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/tasks.md:89",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/tasks.md:56",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/implementation-summary.md:120"
  ],
  "counterevidenceSought": "Read spec.md:85-87 out-of-scope for phase-2 226-line checklist boilerplate. That exemption names CHK items, not the three-line Completion Criteria block.",
  "alternativeExplanation": "Authors left Completion Criteria for a human close-out after validate.sh. Still a contradictory completion ledger inside tasks.md.",
  "finalSeverity": "P2",
  "confidence": 0.86,
  "downgradeTrigger": "If Completion Criteria is marked [x] with evidence or explicitly labeled non-authoritative, drop or keep as advisory.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery" }
  ]
}
```

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | REQ-001..006 have code + tests by inspection. Packet plan/parent-map/continuity still contradict (F001–F003). AC-001..007 Verification cells cite `scripts/tests/check-ac-coverage.sh` line numbers that exist (`:64,:69,:74,:78,:122,:125,:106,:92,:30`). |
| checklist_evidence | core | partial | Checked T-rows have citations. Unchecked CHK rows are the documented boilerplate exemption. Completion Criteria `[ ]` vs T `[x]` is F007. |
| skill_agent | overlay | notApplicable | spec-folder target |
| agent_cross_runtime | overlay | notApplicable | spec-folder target |
| feature_catalog_code | overlay | pass | `spec-validation-rule-engine.md:68` names `check-ac-coverage.sh` as AC_COVERAGE default-on; registry `validator-registry.json:89-102` agrees. |
| playbook_capability | overlay | partial | F008: no scenario for canonical-vs-legacy evidence split. |

## AC_COVERAGE advisory signal (inspection)
Packet is Level 2 with `acceptance-criteria.md` and implementation-summary Status Complete. Seven AC rows all carry `file:line` in Verification. Expected live ratio 7/7 from the same document (SC of this packet). Suite not executed from this lineage.

## Adversarial self-check
- Hunter: re-read AC-001..007 vs test line numbers; parent spec.md:111; plan.md:8.
- Skeptic: F007 is template residue, not a failing requirement. P2.
- Referee: F001–F003 remain P1. No new P0/P1.

## Next Dimension
D4 Maintainability plus a broadening replay of F001–F003.

Review verdict: PASS
