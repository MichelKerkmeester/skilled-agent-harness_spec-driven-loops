---
title: Deep Review Report: sk-design Styles Utilization
description: Detached sol-a lineage synthesis across five converged review iterations.
verdict: CONDITIONAL
hasAdvisories: false
activeP0: 0
activeP1: 5
activeP2: 0
sessionId: fanout-sol-a-1784385520599-ecg4bg
stopReason: converged
---

# Deep Review Report: sk-design Styles Utilization

## Executive Summary

**Verdict: CONDITIONAL.** Five P1 findings remain active. No P0 or P2 findings were confirmed.

The review covered the phase-parent lean trio, ten child packets, and the current sk-design hub/mode contracts across correctness, security, traceability, and maintainability. Five LEAF iterations completed, including a cross-dimension adversarial stabilization pass. The final pass introduced no new or refined findings, all five P1 severities remained stable, and the inline convergence vote reached `0.70` after full dimension coverage aged through one stabilization pass.

The target remains intentionally pre-implementation for phases 004-010. The findings are specification and canonical-state defects that should be repaired before implementation dispatch, not evidence that unimplemented runtime features are already broken.

## Planning Trigger

`/speckit:plan` is required because the verdict is `CONDITIONAL` and five P1 findings require remediation.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    "SOL-A-I001-P1-001",
    "SOL-A-I002-P1-001",
    "SOL-A-I002-P1-002",
    "SOL-A-I003-P1-001",
    "SOL-A-I004-P1-001"
  ],
  "remediationWorkstreams": [
    "canonical lifecycle and dependency metadata",
    "retrieval filesystem containment",
    "STUDY prompt-injection resistance",
    "additive integration surface classification"
  ],
  "specSeed": [
    "reconcile completed-phase continuity",
    "contract realpath containment and symlink policy",
    "contract data-only STUDY observations and behavioral injection tests",
    "project the implementation DAG into parent and graph metadata",
    "classify existing mode and transport surfaces as modifications/additions"
  ],
  "planSeed": [
    "update owning requirements before implementation tasks",
    "add negative security fixtures to phases 004 and 006",
    "refresh canonical metadata through its owning workflows",
    "re-run recursive packet validation and focused deep review"
  ],
  "findingClasses": [
    "matrix/evidence",
    "class-of-bug",
    "cross-consumer"
  ],
  "affectedSurfacesSeed": [
    "spec continuity and resume fallback",
    "style manifest and hydration CLI",
    "STUDY transformer and prompt block",
    "phase-parent and child graph metadata",
    "foundations, motion, and Open Design integration contracts"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### SOL-A-I001-P1-001: Completed research phases retain pre-run continuity state

- Severity: P1
- Dimension: correctness, traceability
- Evidence: `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:13-25`, `002-md-generator-upgrade/spec.md:13-30`, `003-global-modes-utilization/spec.md:13-30`
- Impact: canonical/no-redirect and fallback consumers can surface obsolete next actions and completion percentages after phases 001-003 completed.
- Recommendation: reconcile the parent and completed-child continuity blocks through the owning continuity workflow and refresh derived metadata.
- Disposition: active, adversarially confirmed
- Finding class: `matrix/evidence`
- Scope proof: parent and completed-child continuity were compared with their status tables, implementation summaries, and resume precedence.
- Affected surfaces: parent coordination snapshot, child resume fallback, canonical packet retrieval

### SOL-A-I002-P1-001: Hydration has no contracted filesystem-containment boundary

- Severity: P1
- Dimension: security
- Evidence: `004-retrieval-substrate/spec.md:103-112`, `004-retrieval-substrate/spec.md:124-136`, `004-retrieval-substrate/spec.md:188-200`
- Impact: a conforming implementation could follow traversal or symlink-resolved paths outside the canonical styles root before downstream hydration.
- Recommendation: require lexical and realpath containment, define symlink policy, fail closed before reads, and add traversal/symlink/root-escape fixtures.
- Disposition: active, adversarially confirmed
- Finding class: `class-of-bug`
- Scope proof: owner requirements, tasks, checklist, and downstream STUDY hydration were searched for containment controls and negative fixtures.
- Affected surfaces: manifest path producer, hydrate CLI, source-scan fallback, STUDY hydration

### SOL-A-I002-P1-002: STUDY envelope does not neutralize untrusted instructions

- Severity: P1
- Dimension: security
- Evidence: `006-md-generator-study-exemplars/spec.md:73-79`, `006-md-generator-study-exemplars/spec.md:104-117`, `006-md-generator-study-exemplars/spec.md:165-187`
- Impact: corpus-borne instructions can behaviorally influence generated prose while literal/span leak checks and authority ordering still pass.
- Recommendation: define corpus content as untrusted data, use a closed observation schema, reject instruction-like content, preserve a hard prompt boundary, and add behavioral non-influence fixtures.
- Disposition: active, adversarially confirmed
- Finding class: `cross-consumer`
- Scope proof: transformer, prompt builder, authored-draft gate, retry path, fixture matrix, and phase-007 authority ordering were traced end-to-end.
- Affected surfaces: STUDY transformer, prompt block, buildWritePrompt/buildPlan, runGuided retry

### SOL-A-I003-P1-001: Canonical parent surfaces omit the implementation dependency graph

- Severity: P1
- Dimension: traceability
- Evidence: `.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:121-126`, `graph-metadata.json:6-21`, `010-open-design-transport/spec.md:125-135`
- Impact: child-local blockers are visible to humans, but parent orchestration and graph consumers cannot discover or validate the planned 004-010 ordering because `manual.depends_on` remains empty.
- Recommendation: encode the implementation DAG in the parent handoff map and child machine-readable dependency fields, then validate parity with child blockers.
- Disposition: active, adversarially confirmed
- Finding class: `matrix/evidence`
- Scope proof: all phase-004-010 dependency declarations and graph metadata were compared with the graph parser's `depends_on` consumer.
- Affected surfaces: parent phase map, child graph metadata, causal `blocks` links, resume/planning context

### SOL-A-I004-P1-001: Existing mode and transport surfaces are classified as new creations

- Severity: P1
- Dimension: maintainability
- Evidence: `009-foundations-motion/spec.md:99-104`, `009-foundations-motion/plan.md:97-105`, `010-open-design-transport/spec.md:83-88`, `010-open-design-transport/plan.md:91-97`
- Impact: implementation routing can scaffold over established foundations, motion, and Open Design contracts instead of extending additive seams.
- Recommendation: reclassify the surfaces as modifications/additions and name additive files or seams explicitly.
- Disposition: active, adversarially confirmed
- Finding class: `matrix/evidence`
- Scope proof: phase action matrices, ADR/rollback intent, and all three current owner contracts were compared.
- Affected surfaces: foundations contract, motion contract, Open Design transport, implementation dispatcher

## Remediation Workstreams

1. **Canonical packet state:** resolve `SOL-A-I001-P1-001` and `SOL-A-I003-P1-001` together so lifecycle, parent handoffs, and graph metadata agree before implementation begins.
2. **Retrieval boundary security:** resolve `SOL-A-I002-P1-001` in phase 004 before any manifest/hydration implementation or downstream consumer work.
3. **Prompt-content security:** resolve `SOL-A-I002-P1-002` in phase 006 with data-only transformation and behavioral injection fixtures.
4. **Integration ownership:** resolve `SOL-A-I004-P1-001` before phase 009/010 dispatch so existing contracts are extended rather than recreated.

## Spec Seed

- Add a phase-004 filesystem invariant covering lexical containment, canonical `realpath` containment, symlinks, traversal, and fail-before-read behavior.
- Add a phase-006 untrusted-content invariant covering closed observation schemas, instruction rejection, prompt boundaries, and behavioral non-influence.
- Expand the parent handoff table and child `manual.depends_on` fields to represent the implementation DAG.
- Correct parent/phase-002/phase-003 continuity to match completed research state and current next action.
- Correct phase-009 and phase-010 affected-surface action types and identify additive file boundaries.

## Plan Seed

1. Amend owning requirements, plan rows, tasks, and checklists for all five findings.
2. Add phase-004 traversal, symlink, root-escape, and source-scan fallback fixtures.
3. Add phase-006 imperative-content, indirect-injection, and non-literal behavioral influence fixtures.
4. Regenerate continuity and graph metadata through their owning workflows; verify parent-child dependency parity.
5. Run strict recursive packet validation, then replay focused correctness/security/traceability/maintainability checks.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | Iterations 001, 003, 005 | Two security controls are absent from owning requirement/task/checklist layers. |
| `checklist_evidence` | partial | Iterations 001 and 003 | Planned checklists are honestly unchecked, but the two security controls have no dedicated evidence rows. |

`AC_COVERAGE`: exempt at the phase-parent root because the lean parent has no root checklist or implementation summary.

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `feature_catalog_code` | notApplicable | Iteration 001 | No feature-catalog claim was in the configured target evidence. |
| `playbook_capability` | notApplicable | Iteration 001 | No playbook/executable-scenario claim was in the configured target evidence. |
| `dependency_handoff` | fail | Iterations 003 and 005 | Child-local edges are absent from parent/graph projections. |

The root `resource-map.md` was absent at initialization, so the Resource Map Coverage Gate is skipped. A deterministic lineage-local `resource-map.md` was still emitted from iteration deltas for downstream merge evidence.

## Deferred Items

- No advisory-only P2 items were recorded.
- The content-hash reducer collapsed `SOL-A-I003-P1-001` into `SOL-A-I001-P1-001` because both initial records used the parent source-file hash instead of the synthesis formula. The synthesis preserves both IDs because their line ranges, finding types, and normalized descriptions are distinct.
- Reducer-generated `SUMMARY-P1-002`, `SUMMARY-P1-003`, and `SUMMARY-P1-004` were resolved as non-findings during stabilization.

## Dimension Expansion Map

- Swept dimensions: correctness, security, traceability, maintainability, cross-dimension stabilization
- Completed pivots: correctness -> security -> traceability -> maintainability -> stabilization
- Failed pivots: none
- Audited overrides: graphless fallback due lineage-only write containment
- Council artifacts: none
- Remaining frontier: none required before synthesis; remediation replay is separate follow-up work

## Search Ledger

- Graph coverage mode: `graphless_fallback`
- Search debt: none
- Candidate coverage: lifecycle state, path containment, prompt injection, dependency handoff, ownership drift, schema duplication, change amplification
- Clean search proof: planned implementation remained absent as declared; phase-004-010 checklist rows remained unchecked; shared phase-007 schema ownership was preserved; transport authority remained subordinate.
- Ruled out: immediate child-resume misrouting, generation/rights controls as path containment, literal/span leak gates as instruction neutrality, child-local blockers as graph projection, destructive replacement as stated implementation intent.

## Audit Appendix

### Convergence

- Iterations: 5
- Ratios: `1.0`, `0.833333`, `0.5`, `0.2`, `0.0`
- Rolling-average vote: CONTINUE (`0.10 > 0.08`)
- MAD vote: STOP (`0.0 <= 0.494`)
- Dimension coverage vote: STOP (`4/4`, coverage age `1`)
- Weighted stop score: `0.70`, threshold `0.60`
- Stop reason: `converged`
- Final finding stability: `1.0`
- Verdict: `CONDITIONAL`

### Quality Gates

| Gate | Result | Evidence |
|------|--------|----------|
| Convergence | pass | Weighted score 0.70 |
| Dimension coverage | pass | All four dimensions plus stabilization |
| P0 resolution | pass | No active P0 |
| Evidence density | pass | Every P1 has multiple `file:line` citations |
| Hotspot saturation | pass | All five P1s replayed in iteration 005 |
| Claim adjudication | pass | Five complete typed packets |
| Fix completeness replay | pass | No fixes claimed; all five marked `carried_forward` |
| Candidate coverage | pass/inactive | No search debt; latest record left v2 gate rollout-inactive |
| Graphless fallback | pass | Direct-read, exact-search, producer/consumer, and negative-test ledgers |

### Mechanical Verification

`verify-iteration.cjs` passed iterations 001-005. JSONL parsed without corruption, all narratives ended with the exact verdict line, route-proof fields matched, and every delta contained its canonical iteration record.

### Boundary Notes

- Spec Kit Memory context retrieval timed out twice; no prior context was invented.
- The coverage-graph upsert/convergence scripts were not invoked because they write outside the user-authorized `sol-a` boundary. The state records the graphless adapter explicitly.
- No reviewed target file was modified.
