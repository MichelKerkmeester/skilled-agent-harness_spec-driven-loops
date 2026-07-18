---
title: "Deep Review Report: sk-design Styles Utilization"
description: "Converged detached review of packet 011 across correctness, security, traceability, and maintainability."
---

# Deep Review Report: sk-design Styles Utilization

## 1. Executive Summary

- **Verdict**: CONDITIONAL
- **Release-readiness state**: converged
- **Stop reason**: `converged`
- **Iterations**: 6 of 10
- **Active findings**: P0=0, P1=3, P2=2
- **hasAdvisories**: false (`hasAdvisories` is reserved for PASS verdicts carrying P2 items)
- **Scope**: the phase-parent lean trio, canonical planning/completion documents for phases 001-010, and completed research syntheses for phases 001-003
- **Boundary**: review-only; no target packet document was changed

The packet's phase order, planned-vs-built state, rights constraints, cache authority, and downstream authority order are internally coherent. Release-readiness remains conditional because resume continuity is stale, phase 006 does not bind the upstream prompt-injection requirement to an enforceable pre-prompt gate, and six checklist summaries undercount their live obligations.

## 2. Planning Trigger

`/speckit:plan` is required before target mutation. The three P1 findings span parent continuity, a phase-006 security contract, and six implementation checklists; they should be remediated as one bounded documentation-correction workstream with validation evidence.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005"],
  "remediationWorkstreams": [
    "Reconcile parent and completed research-child continuity with phase 004 as the active frontier",
    "Define and test a pre-prompt hostile-instruction gate for phase 006 STUDY input",
    "Correct or mechanically derive checklist verification-summary denominators",
    "Remove phase-004 transport residue and correct its bounded task handoff"
  ],
  "specSeed": [
    "Preserve the existing phase map and planned implementation statuses",
    "Add a normative pre-prompt STUDY injection boundary tied to the phase-002 embedded-injection fixture",
    "Make live checklist rows authoritative over duplicated summary totals"
  ],
  "planSeed": [
    "Update continuity fields without changing completed research evidence",
    "Add hostile-instruction rejection or neutralization requirements and adversarial fixtures before buildWritePrompt/buildPlan injection",
    "Recount P0/P1/P2 rows in phases 004-010 and add denominator validation",
    "Remove seven orphan wrapper tags and change the phase-004 handoff to T001-T030 or an unbounded tasks.md reference",
    "Run recursive strict validation and replay all five findings"
  ],
  "findingClasses": [
    "lifecycle-state",
    "cross-consumer",
    "matrix/evidence",
    "artifact-hygiene",
    "handoff-consistency"
  ],
  "affectedSurfacesSeed": [
    "session resume and phase routing",
    "STUDY hydration and prompt assembly",
    "implementation checklist completion reconciliation",
    "phase-004 Markdown ingestion",
    "phase-004 ADR/task handoff"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### F001: Resume continuity points back to completed research

- **Severity / dimension**: P1 / correctness
- **Location**: `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:15-25`
- **Evidence**: the parent still says to run child 001; research-child specs 002-003 retain pre-research dispatch state while their implementation summaries report 100% completion.
- **Impact**: session recovery can repeat completed work or bypass phase 004, the current implementation frontier.
- **Recommendation**: route parent continuity to phase 004 and reconcile completed research-child continuity without changing their research results.
- **Disposition**: active
- **findingClass**: `lifecycle-state`
- **scopeProof**: parent and research-child continuity fields were compared with completion summaries and the parent phase map in iterations 1, 5, and 6.
- **affectedSurfaceHints**: session resume; phase routing; parent continuity

### F002: STUDY lacks an enforceable pre-prompt injection gate

- **Severity / dimension**: P1 / security
- **Location**: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/plan.md:83-87,114-135`
- **Evidence**: phase-002 research requires an embedded prompt-injection fixture at `002-md-generator-upgrade/research/lineages/sol/research.md:304-316`; phase 006 specifies an auditable injection envelope and post-generation source-leak tests but no hostile-instruction rejection or neutralization before `buildWritePrompt` / `buildPlan` injection.
- **Impact**: untrusted corpus instructions can enter prompt assembly despite provenance metadata and output leak checks.
- **Recommendation**: define the pre-prompt boundary, its reject/neutralize behavior, and adversarial embedded-instruction fixtures before STUDY implementation.
- **Disposition**: active
- **findingClass**: `cross-consumer`
- **scopeProof**: phase 004-010 planning artifacts and all phase-006 canonical documents were searched for concrete pre-prompt controls.
- **affectedSurfaceHints**: study hydration; study transformer; buildWritePrompt; buildPlan; runGuided

### F003: Verification Summary totals undercount checklist obligations

- **Severity / dimension**: P1 / traceability
- **Location**: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:127-133`
- **Evidence**: live priority-row counts disagree with published totals in phases 004 and 006-010. For example, phase 004 publishes 13/16/6 but contains 15/23/8; phase 008 publishes 15/15/3 but contains 17/22/8; phase 009 publishes 12/13/5 but contains 15/23/9. Phase 005 matches and serves as the control.
- **Impact**: an operator can satisfy the advertised denominator while leaving required rows unchecked.
- **Recommendation**: correct all six summaries and mechanically derive or validate future totals from live rows.
- **Disposition**: active
- **findingClass**: `matrix/evidence`
- **scopeProof**: every implementation checklist and every P0/P1/P2 row was counted in iterations 3, 5, and 6.
- **affectedSurfaceHints**: phase checklists; completion reconciliation; strict validation

### F004: Phase 004 documents retain orphan transport tags

- **Severity / dimension**: P2 / maintainability
- **Location**: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:283-284`
- **Evidence**: all six phase-004 canonical documents end in unmatched `</content>`; `spec.md` also ends in unmatched `</invoke>`. No corresponding opening tags or adjacent-phase variants exist.
- **Impact**: rendered noise and ambiguous wrapper structure can leak into context extraction.
- **Recommendation**: remove all seven tags and add a narrow malformed-wrapper validation check.
- **Disposition**: active
- **findingClass**: `artifact-hygiene`
- **scopeProof**: exact searches covered every Markdown file under the phase parent.
- **affectedSurfaceHints**: phase-004 Markdown rendering; anchor extraction; routed context ingestion

### F005: Phase 004 handoff truncates the task queue at T028

- **Severity / dimension**: P2 / maintainability
- **Location**: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/implementation-summary.md:144-149`
- **Evidence**: the handoff says T001-T028 while `tasks.md:139-140` defines T029 for ADR authority mapping and T030 for ADR promotion.
- **Impact**: a resumed executor can omit governance work while believing the bounded queue is complete.
- **Recommendation**: use T001-T030 or point to `tasks.md` without duplicating the range.
- **Disposition**: active
- **findingClass**: `handoff-consistency`
- **scopeProof**: bounded ranges were compared with every phase-004 task id and searched across canonical target documents.
- **affectedSurfaceHints**: phase-004 resume handoff; ADR governance; task completion reconciliation

## 4. Remediation Workstreams

1. **P1 lifecycle reconciliation**: update parent and completed research-child continuity so phase 004 is the active frontier; preserve research completion evidence and phase ordering.
2. **P1 STUDY input security**: specify a pre-prompt hostile-instruction boundary, bind it to the upstream fixture, and require reject/neutralize tests before prompt assembly.
3. **P1 checklist integrity**: repair six summary tables and add a deterministic summary-vs-row validation gate.
4. **P2 document hygiene**: remove seven phase-004 wrapper closers and add malformed-wrapper detection.
5. **P2 handoff integrity**: replace T001-T028 with T001-T030 or an authoritative `tasks.md` reference.

## 5. Spec Seed

- Keep phases 001-003 complete and phases 004-010 planned; this review found no lifecycle contradiction in that state model.
- Make phase 004 the canonical next execution frontier in parent continuity.
- Add a phase-006 requirement that corpus input is rejected or neutralized before prompt assembly when it contains hostile instructions.
- Preserve the existing locked-FACTS authority, one-bundle selection, de-literalization, no-STUDY retry, rights, and no-cache rules.
- Define checklist summaries as derived views whose totals must equal live tagged rows.

## 6. Plan Seed

1. Capture baseline continuity, phase-006 safety language, checklist row counts, and malformed-marker counts.
2. Patch F001 continuity fields only; do not alter research findings or planned phase order.
3. Patch F002 across phase-006 spec, plan, tasks, and checklist with one normative pre-prompt gate and adversarial fixture matrix.
4. Patch F003 summaries or add a generator/validator, then prove all seven checklists reconcile.
5. Patch F004-F005 in phase 004 and add regression checks for wrapper residue and task-range drift.
6. Run recursive strict spec validation and replay each finding against exact file/line evidence.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | phase-001/002/003 research handoffs and phases 004-010 plans | F002 leaves the embedded-injection research requirement unbound in phase 006. |
| `checklist_evidence` | pass | checked tasks in research phases 001-003; unchecked implementation rows in 004-010 | F003 affects summary denominators, not unsupported `[x]` evidence. |

### Overlay Protocols

| Protocol | Status | Reason |
|----------|--------|--------|
| `feature_catalog_code` | notApplicable | No packet-local feature-catalog delivery claim. |
| `playbook_capability` | notApplicable | No packet-local playbook capability claim. |

- **AC_COVERAGE**: exempt. The reviewed target is a lean phase parent without a parent checklist or active implementation-summary completion claim.

## 8. Deferred Items

- F004 and F005 are P2 advisories and may be bundled with the P1 remediation, but they do not independently change the CONDITIONAL verdict.
- Enabling the FTS accelerator in phase A versus phase B remains an explicitly deferred implementation decision, not a review defect.
- Runtime implementation of phases 004-010 remains outside this review's read-only scope.

## Dimension Expansion Map

- **Completed dimensions**: correctness, security, traceability, maintainability
- **Stabilization passes**: iterations 5 and 6
- **Completed pivots**: 0
- **Failed pivots**: 0
- **Audited overrides**: 0
- **Saturated directions**: lifecycle state; phase order; status consistency; prompt injection; rights reuse; cache exposure; authority override; research handoff; checked evidence; summary denominator; artifact hygiene; queue consistency; path precision; authority duplication; adjacent variants
- **Remaining frontier**: remediation planning only; no further in-scope review direction remained after iteration 6

## 9. Search Ledger

- **graphCoverageMode**: `graphless_fallback`
- **hasSearchDebt**: false
- **candidateCoverage**: 16 classes covered, 10 ruled out, 0 deferred, 0 blocked
- **Latest required classes**: lifecycle_state, prompt_injection, summary_denominator, artifact_hygiene, queue_consistency, adjacent_variant
- **Latest fallback proof**: each required class has a cited `exact_grep`, `direct_read`, or `negative_test_inspection` action in iteration 6.

Confirmed-clean or ruled-out directions include phase ordering, broad status consistency outside F001, rights-policy contradiction, cache-authority leakage, authority inversion, unsupported checked research evidence, missing global-mode consumers, proposed-path contradiction, conflicting ADR authority restatement, and adjacent malformed/handoff variants. The full row-level ledger is preserved in `deep-review-findings-registry.json` and `deep-review-dashboard.md`.

## 10. Audit Appendix

### Convergence

| Gate | Result | Evidence |
|------|--------|----------|
| convergenceGate | PASS | Last two ratios are 0; reducer score is 1.00. |
| dimensionCoverageGate | PASS | 4/4 dimensions and both core protocols covered. |
| p0ResolutionGate | PASS | Active P0 = 0. |
| evidenceDensityGate | PASS | Every active P1 has multiple direct file/line references. |
| hotspotSaturationGate | PASS | All active findings replayed in iterations 5 and 6. |
| claimAdjudicationGate | PASS | Latest event passes for three active P1 findings. |
| fixCompletenessReplayGate | PASS | No closed finding or claimed fix requires replay. |
| candidateCoverageGate | PASS | Search debt and missing classes are empty. |
| graphlessFallbackGate | PASS | Iteration 6 uses canonical cited fallback methods for all required classes. |

Iteration 5's STOP vote was correctly blocked because its descriptive search-method labels did not match the gate enum. Iteration 6 replayed the same evidence with canonical labels and introduced no new finding.

### Coverage

- Six iteration narratives and six matching delta files passed `verify-iteration.cjs`.
- Recursive strict validation passed the parent and all ten child packets before findings were synthesized.
- Reducer state reports five open findings, no resolved findings, no corruption, and no search debt.
- `resource-map.md` records the five primary finding-bearing spec documents; no mapped file is missing.

### Primary Sources

- Parent phase map and continuity: `spec.md:10-47,95-125`
- Research safety requirement: `002-md-generator-upgrade/research/lineages/sol/research.md:304-316`
- STUDY architecture and tests: `006-md-generator-study-exemplars/plan.md:76-135`
- Checklist summaries and live rows: phase checklists 004-010
- Phase-004 hygiene and handoff: `004-retrieval-substrate/*.md`
- Canonical audit state: `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, and `resource-map.md`

**Final verdict: CONDITIONAL**
