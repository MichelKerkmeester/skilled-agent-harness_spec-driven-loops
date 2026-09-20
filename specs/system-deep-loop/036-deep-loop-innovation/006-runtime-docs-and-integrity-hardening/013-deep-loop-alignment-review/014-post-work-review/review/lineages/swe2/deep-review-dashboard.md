# Deep Review Dashboard — lineage swe2

_Auto-generated from `deep-review-state.jsonl` + strategy + findings registry. Refreshed each iteration._

## Status
- Final verdict: **CONDITIONAL** (2 active P1) | hasAdvisories: true
- Iteration: 10 of 10 | stopPolicy: max-iterations → `maxIterationsReached`

## Findings Summary
- P0: 0 | P1: 2 active (F004: absent-path citation class survives phase 005's sweep; F007: registry glossary still says "six") | P2: 5 active

## Progress Table
| Run | Status | Focus | Dimensions | newFindingsRatio | Findings |
|-----|--------|-------|------------|------------------|----------|
| 1 | complete | confirm-variant census audit | traceability, correctness | 0.20 | 0/0/2 |
| 2 | complete | ledger stem census audit | traceability, correctness, maintainability | 0.33 | 0/0/1 |
| 3 | complete | agent mirror crosswalk audit | traceability, correctness | 0.00 | 0/0/0 |
| 4 | complete | leaf manifest symlink walk audit | correctness, traceability | 0.00 | 0/0/0 |
| 5 | complete | containment-promise rewrite audit | correctness, traceability | 0.00 | 0/0/0 |
| 6 | complete | catalog/README citation-truth audit | traceability, correctness | 0.40 | 0/1/1 |
| 7 | complete | version authority audit (phases 003+010) | correctness, traceability | 0.00 | 0/0/0 |
| 8 | complete | routing doctrine and discovery audit | correctness, traceability | 0.00 | 0/0/0 |
| 9 | complete | recorded-defect closure audit (phase 013) | correctness, maintainability | 0.14 | 0/0/1 |
| 10 | complete | whole-program closing read (001/002/012 + security) | security, correctness, traceability | 0.20 | 0/1/0 |

## Coverage
- Dimensions completed: 4/4 (security closed at iteration 10 via guard-failure-mode audit)
- Traceability: spec_code verified, checklist_evidence verified, agent_cross_runtime + feature_catalog_code + skill_agent touched
- Files reviewed: ~118/150 cumulative; all 13 phase folders touched

## Trend
- Ratios: 0.20 → 0.33 → 0.00 → 0.00 → 0.00 → 0.40 → 0.00 → 0.00 → 0.14 → 0.20
- Both P1s are the same defect class: a phase's stated sweep corrects the named lines but not the named files.

## Active Risks
- F004 (P1): phase 005's REQ-001 unmet — dead-citation class survives in ~19 playbook files + obsidian README + feature catalog VALIDATION row
- F007 (P1): phase 002's named file retains three stale "six" count strings in its field glossary
- F006 (P2): phase 013's stress-scenario Objective still names the pre-fix tree set
