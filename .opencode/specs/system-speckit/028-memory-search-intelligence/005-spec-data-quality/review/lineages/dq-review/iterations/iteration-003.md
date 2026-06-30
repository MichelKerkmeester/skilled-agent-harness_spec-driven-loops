# Iteration 3: Traceability

## Focus

Dimension D3 Traceability. Core protocols spec_code and checklist_evidence against the completion claims, the scope statement, and the 28-child scaffold. Files: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, graph-metadata.json, plus child folder listing.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 9 + child folder inventory (28 children)
- New findings: P0=0 P1=2 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P1, Required

- **F001**: Completion metadata diverges across the parent doc set, frontmatter `_memory.continuity.completion_pct`. `spec.md:27`, `implementation-summary.md:26`, and `handover.md:18` set `completion_pct: 100`, while `plan.md:26`, `tasks.md:26`, `checklist.md:25`, and `decision-record.md:26` set `completion_pct: 5`. The "5%" docs also carry stale action fields: `plan.md:18` `next_safe_action: "Run the by-angle research loop"`, `tasks.md:18` `next_safe_action: "Start the by-angle verification loop"`, and `recent_action` values describing setup ("Drafted the research plan", "Listed the research tasks") rather than the converged-and-scaffolded reality. The packet therefore reports two contradictory states. This violates the completion-metadata reconciliation requirement (packet docs must not claim conflicting completion states). A resume/continuity consumer reading any of the 5% docs would mis-route the next action.

- **F003**: Checklist evidence gaps contradict the complete claim, `checklist.md:70,81-82,199`. The packet is marked complete (`spec.md:66`), but `checklist.md` leaves P1 items unchecked: CHK-012 "Candidate verdict captured for a build packet" (`checklist.md:70`), CHK-022 "Each ranked candidate verified against the corpus" (`checklist.md:81`), CHK-023 "Vendor-only claims flagged during the loop" (`checklist.md:82`), and P2 CHK-143 (`checklist.md:199`). The Verification Summary self-reports "P1 Items 8/11" (`checklist.md:136`). The underlying work appears done in `research/research.md`, so these are unrecorded evidence rather than missing work, but the checklist_evidence core protocol cannot pass while checked-completion claims and the checklist disagree.

### P2, Suggestion

- **F004**: Parent Scope section not updated for the 28-child scaffold, `spec.md:86-103`. Scope §3 In-Scope is "Research how to improve...", Out-of-Scope says "Building or shipping any candidate. This packet is research only", and "Files to Change" lists only `research/research.md` and `research/stage-0-external-findings.md`. The packet subsequently authored 28 child phase folders, each with a full doc set. The PHASE DOCUMENTATION MAP (`spec.md:148-210`) documents the children and partially reconciles this, but the Scope §3 table and Out-of-Scope text were never updated, so the two halves of the same spec disagree about what the packet produced.

- **F005**: Parent docs misdescribe the children's doc footprint, `spec.md:151` and `implementation-summary.md:70`. Both say each child carries "spec.md plus the two metadata JSONs" (lean trio). The children actually carry full Level-2/3 doc sets: a listing of `0*/spec.md`, `0*/plan.md`, and `0*/checklist.md` each returns 28, so every child has spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, and graph-metadata.json. `handover.md:11,34` correctly calls them "Level-2 doc sets", so the parent spec.md and implementation-summary.md are the inaccurate descriptions.

- **F006**: Placeholder content-hash fingerprint in handover continuity, `handover.md:15`. `session_dedup.fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"` is an all-zeros placeholder rather than a real content hash, so the dedup/freshness signal for handover.md is non-functional. The other parent docs carry real (non-zero) fingerprints.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:66,86-103; tasks.md:65-78; research/research.md | Status claim substantiated by artifacts but contradicted by stale scope, ledger, and 5% continuity blocks. |
| checklist_evidence | partial | hard | checklist.md:70,81-82,136 | Three P1 checklist items unchecked while packet marked complete; summary self-reports 8/11. |
| feature_catalog_code | n/a | advisory | - | No catalog attached. |
| playbook_capability | n/a | advisory | - | No playbook attached. |

## Assessment

- New findings ratio: 0.55
- Dimensions addressed: traceability
- Novelty justification: Two new P1 and three new P2 introduced. graph-metadata.json is clean: children_ids lists all 28 children (`graph-metadata.json:6-35`), status is `research_complete` (`graph-metadata.json:71`), and last_active_child_id is null which correctly routes resume to child-listing. description.json is clean. The findings concentrate in the human-authored continuity frontmatter and the prose scope/child descriptions.

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "completion_pct and continuity action fields disagree across the parent doc set: spec.md/implementation-summary.md/handover.md say 100% complete while plan.md/tasks.md/checklist.md/decision-record.md say 5% and still point to starting the research loop.",
  "evidenceRefs": [
    "spec.md:27",
    "implementation-summary.md:26",
    "plan.md:26",
    "tasks.md:18",
    "checklist.md:25",
    "decision-record.md:26"
  ],
  "counterevidenceSought": "Grepped completion_pct across all seven parent docs (split is 3x100 vs 4x5). Read the next_safe_action/recent_action fields of the 5% docs to confirm they describe pre-loop setup, not the converged state. Checked graph-metadata.json status, which says research_complete, agreeing with the 100% side.",
  "alternativeExplanation": "The 5% docs could be intentionally frozen at their authoring snapshot, but the CLAUDE.md completion-verification rule requires packet docs not to claim conflicting completion states, so divergence is a defect regardless of intent.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the plan/tasks/checklist/decision-record continuity blocks are reconciled to the converged state (or the heavy docs are relocated to children per lean-trio policy), downgrade to resolved.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F003",
  "claim": "checklist.md leaves three P1 items (CHK-012, CHK-022, CHK-023) unchecked and self-reports P1 8/11 while the packet is marked complete elsewhere.",
  "evidenceRefs": [
    "checklist.md:70",
    "checklist.md:81-82",
    "checklist.md:136",
    "spec.md:66"
  ],
  "counterevidenceSought": "Read the checklist Verification Summary (P1 8/11 confirms three unchecked). Verified research/research.md exists and is substantive (the verdict CHK-012 refers to). Looked for an explicit deferral note on the three items; none present.",
  "alternativeExplanation": "The three items may be deliberately deferred to a build packet, but no deferral rationale is recorded, so checklist_evidence cannot treat them as resolved.",
  "finalSeverity": "P1",
  "confidence": 0.8,
  "downgradeTrigger": "If CHK-012/022/023 are checked with evidence, or annotated as explicit owner-approved deferrals, downgrade to resolved.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Ruled Out

- graph-metadata.json / description.json drift: re-read both; children_ids, status, and parentChain are accurate and complete. No finding.

## Dead Ends

- Re-running `validate.sh --strict` to independently confirm the strict-pass claim: the command requires interactive approval in this lineage's environment, so the claim at `implementation-summary.md:102` is recorded as asserted-not-reverified rather than confirmed or refuted.

## Recommended Next Focus

D4 Maintainability: phase-parent structure policy, stale narration, and style.

Review verdict: CONDITIONAL
