---
title: "Task 30B Parent Truth Ledger"
description: "Evidence ledger for current aggregate status and canonical navigation in packet 028 parents 001, 003 and 006."
trigger_phrases:
  - "task 30b parent truth"
  - "packet 028 parent status"
  - "canonical parent navigation"
importance_tier: "normal"
contextType: "implementation"
---
# Task 30B Parent Truth Ledger

This scratch ledger records the evidence used to reconcile active parent status without rewriting dated child history.

## 1. Parent 001

- Canonical parent: `001-release-cleanup/` with 15 direct children in `graph-metadata.json`.
- Child 014 reports In Progress at 90%; child 015 reports In Progress at 0%.
- Active parent status is therefore **In Progress** at 87%, the rounded direct-child completion ratio 13/15.
- Completed child and release evidence remains unchanged.

## 2. Parent 003

- Canonical parent: `003-spec-data-quality/` with 20 direct children in `graph-metadata.json`.
- Parent governance remains **In Progress** at 91% P1 readiness, 21/23.
- CHK-042, CHK-050, CHK-051, CHK-143, all three sign-offs, fresh reviews and strict validation remain open.
- The Stage 0 plan checkbox was reopened to match T003 and CHK-042 because deep-research-owned `research/research.md` lacks the brief link.

## 3. Parent 006

- Canonical parent: `006-speckit-surface-alignment/` with six direct children in `graph-metadata.json`.
- Children 001 through 005 report Complete; child 006 reports Implemented with a documented broad-suite caveat.
- Active map now lists exactly those six canonical children. The former 15-child plan remains a historical section.
- Direct-child delivery is 6/6; the child-006 caveat remains visible rather than being erased.

## 4. Boundaries

- No generated JSON was edited or regenerated.
- Former IDs and paths remain only as dated provenance.
- Current navigation uses the migration manifest and current graph metadata.

## 5. Targeted Validation

| Parent | Exit | Relevant passes | Remaining findings |
|---|---:|---|---|
| `001-release-cleanup` | 2 | PHASE_LINKS 15, PHASE_PARENT_CONTENT, child drift and path consistency | Generated fingerprint and synopsis drift after authored status correction |
| `003-spec-data-quality` | 2 | PHASE_LINKS 20, EVIDENCE_CITED, AI_PROTOCOL 4/4 and status consistency | Generated fingerprint, out-of-scope parent-content warning and dirty continuity |
| `006-speckit-surface-alignment` | 2 | PHASE_LINKS 6, PHASE_PARENT_CONTENT, child drift and path consistency | Generated fingerprint after authored navigation correction |

The authored status corrections are complete for this lane. Generator-owned follow-up remains intentionally deferred.
