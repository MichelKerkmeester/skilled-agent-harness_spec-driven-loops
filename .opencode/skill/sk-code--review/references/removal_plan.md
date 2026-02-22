---
title: Removal and Iteration Plan
description: Template for identifying safe deletion candidates and planning deferred removals with rollback safeguards.
---

# Removal and Iteration Plan

Template for identifying safe deletion candidates and planning deferred removals with rollback safeguards.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provide a consistent way to recommend code removal without introducing hidden regressions.

### Priority Model

- **P0**: Immediate removal required (critical security/correctness cost).
- **P1**: Remove in current sprint/release window.
- **P2**: Defer with migration plan and owner.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:safe-now -->
## 2. SAFE TO REMOVE NOW

Use this block when evidence indicates no active consumers.

| Field | Details |
| --- | --- |
| Location | `path/to/file_or_symbol` |
| Rationale | Why removal is safe and valuable now |
| Evidence | Search results, telemetry, flag status, ownership confirmation |
| Impact | Expected impact (`None`, `Low`, or explicit risk) |
| Deletion Steps | Ordered steps to remove code/tests/config/docs |
| Verification | Commands/tests to confirm no regression |

Minimum checks before recommending immediate removal:
- [ ] Codebase reference search complete
- [ ] Dynamic/reflective usage considered
- [ ] Consumer ownership verified
- [ ] Verification commands listed
<!-- /ANCHOR:safe-now -->

---

<!-- ANCHOR:defer -->
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
<!-- /ANCHOR:defer -->

---

<!-- ANCHOR:reviewer-checklist -->
## 4. REVIEWER CHECKLIST

- [ ] Removal candidate classified (`safe now` vs `deferred`)
- [ ] Evidence supports classification
- [ ] Breaking-change impact evaluated
- [ ] Test and monitoring strategy included
- [ ] Rollback plan documented

If any item is missing, keep the recommendation at P2 with follow-up actions.
<!-- /ANCHOR:reviewer-checklist -->
