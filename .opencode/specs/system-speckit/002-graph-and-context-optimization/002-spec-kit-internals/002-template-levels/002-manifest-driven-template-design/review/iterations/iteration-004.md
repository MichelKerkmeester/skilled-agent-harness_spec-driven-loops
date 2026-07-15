# Iteration 004: validator-coverage

**Dimension**: validator-coverage  
**Status**: complete  
**Date**: 2026-05-04T00:00:00Z  

## Scope
Full audit of 23 check-*.sh validator files for manifest integration status.

## Findings

### P1-004: Only 1 of 23 validators has any manifest integration — 91% validator coverage gap
- **Severity**: P1
- **Dimension**: validator-coverage
- **Evidence**: Audit of all `scripts/rules/check-*.sh` files:
  - **Has manifest refs (partial)**: `check-section-counts.sh` (1 manifest, 1 legacy — hybrid)
  - **Has legacy template-structure.js deps**: `check-anchors.sh`, `check-files.sh`, `check-level-match.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-template-source.sh` (6 files)
  - **Has NO manifest OR legacy deps**: 16 files (may not be level-dependent)
  - **Total**: 23 validators, 1 partial manifest integration = 4.3% coverage
- **Spec claim**: ADR-001 §Implementation: "MODIFY: `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh` — read from manifest"
- **Reality**: Only check-section-counts.sh has attempted migration. Check-files.sh, check-sections.sh, check-template-headers.sh still use legacy.
- **Impact**: Validator drift risk. If manifest changes, only scaffolder reflects it; validators may flag false positives/negatives.
- **Fix**: Complete Phase 3 migration for all 6 legacy-dependent validators.

### PASS-011: Non-level-dependent validators (16 of 23) correctly unaffected
- **Evidence**: Validators like `check-anchors.sh`, `check-placeholders.sh`, `check-toc-policy.sh` are level-agnostic and don't need manifest integration. They validate structural/document properties that don't vary by level.
- **Impact**: No scope creep — only level-dependent validators need migration.

## Graph Events
```json
[
  {"type": "DIMENSION", "id": "dim-004", "name": "validator-coverage", "iteration": 4},
  {"type": "FINDING", "id": "find-p1-004", "name": "Only 1 of 23 validators has manifest integration", "iteration": 4, "severity": "P1"}
]
```
