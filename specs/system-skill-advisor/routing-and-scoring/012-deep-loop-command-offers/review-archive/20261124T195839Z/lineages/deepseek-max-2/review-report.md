# Deep Review Report - 012-deep-loop-command-offers

Lineage `deepseek-max-2`, generation 7, seven iterations, review focus traceability.

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true**
- **P0: 0, P1: 0, P2: 5** (the counts the verdict used, read from `deep-review-findings-registry.json` after the last reducer pass)
- **Self-check outcomes:** there is no active P0 or P1 finding, so the adversarial replay had no finding to confirm, downgrade or dismiss; every recorded finding is P2 and was written with its `file:line`.
- **Review scope:** 54 files, 48 requirements, 105 tasks (104 ticked), 56 acceptance rows, five decision records read.
- **Operator review focus:** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

Both core protocols finish as `pass`: every requirement traces to an implementing symbol, fixture row, test title or decision, and every ticked task and `Met` row was audited against the tree. The five P2 records are closure-document drift, not gate defects.

## 2. Planning Trigger

`/speckit:plan` is required for the P2 advisories only; no remediation workstream is blocking.

```json
{
  "triggered": true,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "R2-P2-001",
      "severity": "P2",
      "title": "AC-040's evidence cell points at a review report this restart archived",
      "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
      "dimension": "traceability",
      "findingClass": null
    },
    {
      "id": "R3-P2-001",
      "severity": "P2",
      "title": "T092's no-stale-count claim fails on two counts in its own file",
      "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md",
      "dimension": "traceability",
      "findingClass": null
    },
    {
      "id": "R3-P2-002",
      "severity": "P2",
      "title": "The tail-check script T104 names is not in the tree",
      "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md",
      "dimension": "traceability",
      "findingClass": null
    },
    {
      "id": "R4-P2-001",
      "severity": "P2",
      "title": "AC-034's CLI head scores have no artifact, and the one recorded head shows the pre-fix result",
      "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
      "dimension": "traceability",
      "findingClass": null
    },
    {
      "id": "R6-P2-001",
      "severity": "P2",
      "title": "The declared change set stops at REQ-046 while its rows serve REQ-047 and REQ-048",
      "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md",
      "dimension": "traceability",
      "findingClass": null
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "severity": "P2",
      "title": "Repoint the archived AC-040 evidence tail",
      "findingIds": [
        "R2-P2-001"
      ],
      "surface": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"
    },
    {
      "order": 2,
      "severity": "P2",
      "title": "Correct the two stale task counts and restore the tail-check script",
      "findingIds": [
        "R3-P2-001",
        "R3-P2-002"
      ],
      "surface": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md"
    },
    {
      "order": 3,
      "severity": "P2",
      "title": "Record the AC-034 served-head run or soften its claim",
      "findingIds": [
        "R4-P2-001"
      ],
      "surface": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"
    },
    {
      "order": 4,
      "severity": "P2",
      "title": "Extend the declared change-set heading to REQ-048",
      "findingIds": [
        "R6-P2-001"
      ],
      "surface": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md"
    }
  ],
  "specSeed": [
    "AC-040's rerun evidence exists: this lineage's terminal gates read evidence, scope and coverage pass, and both core protocols finish.",
    "REQ-027's served-head figures need either a recorded run or a hedge in the requirement text.",
    "The declared change set heading should name REQ-035 to REQ-048."
  ],
  "planSeed": [
    "Repoint AC-040's Evidence tail to the archived report or to the merged report the root run writes.",
    "Correct T082's CHK-001 count (46 to 48) and T051's table count (54 rows/50 Met to 56/52).",
    "Add the Evidence-tail checker the tenth round describes, or name the command that performs it.",
    "Record or remove AC-034's 0.8754 / 0.82 head figures."
  ],
  "findingClasses": [
    "instance-only evidence drift",
    "instance-only closure drift",
    "instance-only missing artifact",
    "instance-only evidence gap",
    "instance-only scope-record drift"
  ],
  "affectedSurfacesSeed": [
    "acceptance-criteria.md",
    "tasks.md",
    "spec.md",
    "review/review-report.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File | Evidence | Impact | Fix | Disposition | Finding class | Scope proof | Affected surface hints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R2-P2-001 | P2 | AC-040's evidence cell points at a review report this restart archived | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | read at the cited line | closure record no longer matches the tree | repoint or restore the cited artifact | active | None | None |  |
| R3-P2-001 | P2 | T092's no-stale-count claim fails on two counts in its own file | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` | read at the cited line | closure record no longer matches the tree | repoint or restore the cited artifact | active | None | None |  |
| R3-P2-002 | P2 | The tail-check script T104 names is not in the tree | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` | read at the cited line | closure record no longer matches the tree | repoint or restore the cited artifact | active | None | None |  |
| R4-P2-001 | P2 | AC-034's CLI head scores have no artifact, and the one recorded head shows the pre-fix result | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | read at the cited line | closure record no longer matches the tree | repoint or restore the cited artifact | active | None | None |  |
| R6-P2-001 | P2 | The declared change set stops at REQ-046 while its rows serve REQ-047 and REQ-048 | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` | read at the cited line | closure record no longer matches the tree | repoint or restore the cited artifact | active | None | None |  |

## 4. Remediation Workstreams

### P0

None.

### P1

None.

### P2 advisories

1. Repoint the archived AC-040 evidence tail (R2-P2-001) - surface `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md`.
2. Correct the two stale task counts and restore the tail-check script (R3-P2-001, R3-P2-002) - surface `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md`.
3. Record the AC-034 served-head run or soften its claim (R4-P2-001) - surface `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md`.
4. Extend the declared change-set heading to REQ-048 (R6-P2-001) - surface `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md`.

## 5. Spec Seed

- AC-040's rerun evidence exists: this lineage's terminal gates read evidence, scope and coverage pass, and both core protocols finish.
- REQ-027's served-head figures need either a recorded run or a hedge in the requirement text.
- The declared change set heading should name REQ-035 to REQ-048.

## 6. Plan Seed

- Repoint AC-040's Evidence tail to the archived report or to the merged report the root run writes.
- Correct T082's CHK-001 count (46 to 48) and T051's table count (54 rows/50 Met to 56/52).
- Add the Evidence-tail checker the tenth round describes, or name the command that performs it.
- Record or remove AC-034's 0.8754 / 0.82 head figures.

## 7. Traceability Status

| Protocol | Level | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `spec_code` | core | pass | `spec.md:220` to `:272`, `command-attach.ts:1615`, `reduce-state.cjs:2362`, ADR-005, ADR-006, ADR-007, ADR-008 | five P2 records, none of them a missing implementation |
| `checklist_evidence` | core | pass | `tasks.md:36` to `:207`, `acceptance-criteria.md:58` to `:113` | the two stale task counts and the missing tail-check script (R3-P2-001, R3-P2-002) |
| `skill_agent` | overlay | notApplicable | the requirements claim no skill-owned agent definition | - |
| `agent_cross_runtime` | overlay | notApplicable | no agent definition is claimed | - |
| `feature_catalog_code` | overlay | notApplicable | no feature-catalog entry is claimed | - |
| `playbook_capability` | overlay | notApplicable | no playbook capability is claimed | - |

**AC_COVERAGE:** advisory-shortfall, 55 of 56 rows closed (52 `Met`, 2 `Waived` with their ADRs, 1 `Superseded` with ADR-001); AC-040 is the open row and this rerun supplies the evidence it was waiting for.

## 8. Deferred Items

- The five P2 records above; each is a closure-document fix, and none blocks the verdict.
- The coverage-graph stop carried one failed legal-stop gate, `candidateCoverageGate`, because the final record listed `spec_mismatch` as ruled out rather than covered. The cap stop is `maxIterationsReached`, and the terminal gates read pass.
- No frontier node exists on this lineage, so there is no exhausted or blocked node to defer.

## Dimension Expansion Map

No divergence pivot ran: `convergenceMode` is `default`, there are no saturated directions, no completed or failed pivots, no overrides and no frontier. Breadth came from the dimension rotation only.

## 9. Search Ledger

| Ledger | Dimension | Bug class | Disposition | Rationale |
|---|---|---|---|---|
| SL-001 | correctness | state_transition | ruled_out | the ask path reads refusal, subject, past-run, stuck and question forms |
| SL-002 | correctness | contract_mismatch | ruled_out | 69 probe rows match their recorded expectation |
| SL-003 | traceability | stale_evidence | finding R2-P2-001 | AC-040's report was archived by this restart |
| SL-004 | traceability | spec_mismatch | ruled_out | every named symbol and 87 of 88 fixture prompts exist |
| SL-005 | traceability | stale_evidence | finding R3-P2-001 | two task counts are stale under T092 |
| SL-006 | traceability | missing_artifact | finding R3-P2-002 | no tail-check script exists |
| SL-007 | traceability | unbacked_claim | finding R4-P2-001 | AC-034's head figures have no artifact |
| SL-008 | traceability | stale_evidence | ruled_out | all eight sixth-round test titles exist |
| SL-009 | security | policy_bypass | ruled_out | both deep commands are ask with ask_first spend |
| SL-010 | security | input_handling | ruled_out | no prompt-derived regex; lead scans bounded |
| SL-011 | maintainability | record_drift | finding R6-P2-001 | the scope heading stops at REQ-046 |
| SL-012 | maintainability | duplication_cost | ruled_out | the dual gate copies are guarded by 22 pairs |
| SL-013 | traceability | spec_mismatch | ruled_out | all 48 requirements trace |

`searchCoverage` on the final record: required `spec_mismatch, stale_evidence, missing_artifact`; covered `stale_evidence, missing_artifact`; ruled out `spec_mismatch`; no search debt and no deferred or blocked class.

## 10. Audit Appendix

**Convergence.** Seven iterations under `stopPolicy: max-iterations`; the pass-7 stop is `STOP` with `stopReason: maxIterationsReached`, weighted stop score 0.70, graph decision `STOP_ALLOWED` with every signal at 1.0, and one failed legal-stop gate recorded as evidence (`candidateCoverageGate`). `stuckCount` 1, `consecutiveFailureCount` 0.

**Coverage.** correctness (iteration 1), traceability (2, 3, 4, 7), security (5), maintainability (6); all four configured dimensions covered.

**Ruled-out claims.** See the Search Ledger; the ruled-out rows cover the gain/keep/negative probe groups, the requirement symbols, the sixth-round test titles, the policy table, the input handling and the dual-copy guard.

**Sources reviewed.** The 54 files of `review-scope-files.txt`, the 105 tasks, 56 acceptance rows, 48 requirements and 8 decision records; each iteration file lists the lines read.

**Core Protocols.** `spec_code` pass, `checklist_evidence` pass; evidence is cited in section 7 and in each iteration file.

**Overlay Protocols.** All four named not applicable, because the packet claims no agent definition, catalog entry or playbook capability.

**Terminal gates.** evidence pass (`all-findings-cited`), scope pass (`all-findings-in-scope`), coverage pass (`coverage-complete`); no required gate failed.

**Release readiness.** `in-progress`: the verdict is PASS, but the stop reason is the iteration cap rather than convergence, so the run does not read `converged`.

