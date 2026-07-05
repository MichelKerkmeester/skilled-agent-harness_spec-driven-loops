---
title: Removal and Iteration Plan
description: Template for identifying safe deletion candidates and planning deferred removals with rollback safeguards.
trigger_phrases:
  - "safe code removal plan"
  - "deferred removal with rollback"
  - "dead code deletion candidates"
  - "removal usage evidence check"
importance_tier: normal
contextType: planning
version: 1.5.0.9
---

# Removal and Iteration Plan

Template for identifying safe deletion candidates and planning deferred removals with rollback safeguards.

---

## 1. OVERVIEW

### Purpose

Provide a consistent way to recommend code removal without introducing hidden regressions.

### Usage

Use when recommending removal; fill the safe-to-remove and deferred tables and record verification plus rollback before any deletion lands.

### Core Principle

Recommend deletion only when usage evidence, verification steps, and rollback plans are explicit.

### Priority Model

- **P0**: Immediate removal required (critical security/correctness cost).
- **P1**: Remove in current sprint/release window.
- **P2**: Defer with migration plan and owner.

---

## 2. SAFE TO REMOVE NOW

Use this block when evidence indicates no active consumers.

| Field | Details |
| --- | --- |
| Location | `path/to/file_or_symbol` |
| Rationale | Why removal is safe and valuable now |
| Evidence | Search results, telemetry, flag status, ownership confirmation |
| Impact | Expected impact (`None`, `Low`, or explicit risk) |
| Deletion Steps | Ordered steps to remove code/tests/config/docs |
| Replacement | What replaces the removed code: nothing, a standard-library API, a native platform feature, or a shorter equivalent expression |
| Verification | Commands/tests to confirm no regression |

Minimum checks before recommending immediate removal:
- [ ] Codebase reference search complete
- [ ] Dynamic/reflective usage considered
- [ ] Consumer ownership verified
- [ ] Verification commands listed

---

## 3. DEFERRED REMOVAL PLAN

Use this block when active consumers still exist.

| Field | Details |
| --- | --- |
| Location | `path/to/file_or_symbol` |
| Why Defer | Blocking dependencies or migration needs |
| Preconditions | Measurable preconditions before deletion |
| Migration Plan | Consumer migration sequence |
| Timeline | Target release/sprint/date |
| Owner | Team/person accountable |
| Validation | Metrics or checks proving safe removal |
| Rollback | Exact restoration strategy |

Deferred removal guidance:
- Keep timeline concrete.
- Identify owner explicitly.
- Define a verification gate before execution.

---

## 4. REVIEWER CHECKLIST

- [ ] Removal candidate classified (`safe now` vs `deferred`)
- [ ] Evidence supports classification
- [ ] Breaking-change impact evaluated
- [ ] Test and monitoring strategy included
- [ ] Rollback plan documented

If any item is missing, keep the recommendation at P2 with follow-up actions.

---

## 5. RELATED RESOURCES

- [quick_reference.md](../references/quick_reference.md) - Baseline review protocol and severity handling.
- [security_checklist.md](./security_checklist.md) - Security and privacy checks before deleting controls.
- [code_quality_checklist.md](./code_quality_checklist.md) - Reliability and edge-case checks before cleanup.
- [solid_checklist.md](./solid_checklist.md) - Architecture ownership checks for extraction or deletion.

Surface portability: apply this removal plan with surface-specific constraints from `sk-code`.
