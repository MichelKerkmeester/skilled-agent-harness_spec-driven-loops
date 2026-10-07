---
title: "Tasks: Minimal Typed Router Contract"
description: "Reconstructed task list for the 006-minimal-typed-contract research packet, derived from spec.md and git history. Task state was not recorded in those sources."
trigger_phrases:
  - "minimal typed contract tasks"
  - "minimal typed router contract verification tasks"
importance_tier: "important"
contextType: "research"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Minimal Typed Router Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Evidence review

- [ ] T001 Read the parent phase charter and the shared research method (`../spec.md`)
- [ ] T002 Read the seed evidence and lineage material named in `spec.md`
- [ ] T003 Restate the commitment-smell problem and the minimal-contract goal as the synthesis agenda (`presentation.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Synthesis

- [ ] T004 Finalize the request, compiled-policy, and decision schemas (`presentation.md`)
- [ ] T005 Record the collapsed detector, mode-rule, leaf-selector, and bundle-rule graph (`presentation.md`)
- [ ] T006 Record explicit commands, ordered target roles, same-packet modes, alternatives, evidence pointers, and replay hashes (`presentation.md`)
- [ ] T007 Falsify the contract against named-default, executor, transport, bundle, and large leaf-inventory archetypes (`presentation.md`)
- [ ] T008 Evaluate advisor, deterministic benchmark, and document-only behavior separately (`presentation.md`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and retention

- [ ] T009 Verify no public field can be removed without losing a demonstrated routing distinction (`presentation.md`)
- [ ] T010 Verify one compiled policy graph replaces parallel intent and resource maps without deleting the evidence-producing detection boundary (`presentation.md`)
- [ ] T011 Verify defaults act only as bounded priors over already eligible candidates (`presentation.md`)
- [ ] T012 Retain the synthesis in `presentation.md` and align the packet documents (`spec.md`)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Deliverable passes its structure checks
- [ ] CHK-011 [P0] No unresolved placeholders or scaffold markers
- [ ] CHK-012 [P1] Claims stay within the evidence the packet retained
- [ ] CHK-013 [P1] Documents follow the packet conventions

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual verification complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a recorded finding class
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed where a class exists
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed artifacts
- [ ] CHK-FIX-004 [P0] Boundary fixes include adversarial table cases
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed when process-wide state is read
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fixed revision, not a moving branch range

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented where input exists
- [ ] CHK-032 [P1] Authority stays with the destination that owns it

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Document structure and anchors intact
- [ ] CHK-042 [P2] Related documents linked where they exist

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | Not recorded | Not recorded |
| P1 Items | Not recorded | Not recorded |
| P2 Items | Not recorded | Not recorded |

**Verification Date**: Not recorded

<!-- /ANCHOR:summary -->
