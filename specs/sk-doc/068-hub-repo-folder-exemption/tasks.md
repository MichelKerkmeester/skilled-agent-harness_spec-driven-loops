---
title: "Tasks: Hub repo folder exemption"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hub repo folder exemption tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hub repo folder exemption

<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Setup

- [x] T001 Probe a copy of a real repository-root hub to list every blocker (Product Owner probe copy)
- [x] T002 Back up the three scripts outside the tree before editing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Read the extension, skip declared entries, kebab-case hub id and 3f validation (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`)
- [x] T004 Kebab-case name check and declared entries skipped in every walk and the zip (`.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`)
- [x] T005 Kebab-case hub id for the compiled-routing check (`.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`)
- [x] T006 [P] Five repo-root cases (`.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`)
- [x] T007 [P] Three repo-root cases (`.skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py`)
- [x] T008 The extension's row in the named-extension table (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run every checker suite and the sk-doc pytest suite
- [x] T010 Run both checkers on Product Owner's repository root
- [x] T011 Settle the one failing harness test on a clean clone
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md REQ-001 to REQ-004]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md Section 3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md Section 6]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint and format checks [EVIDENCE: `node --check` and `python3 -m py_compile` clean on the three scripts]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: checker suites print no warnings]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: a malformed registry reads as undeclared and 3a or 3f reports it]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the extension follows the named-extension shape in the doctrine table]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md AC-001 to AC-004 Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: Product Owner root: parent-skill-check 0 fail 0 warn, validate_skill_package --strict exit 0]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: empty list, nested name, dotted name, packet name and hub file each fail 3f in the invariant suite]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: an undeclared folder with graph-metadata.json still fails 2a in the suite]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class named [EVIDENCE: class-of-bug, every walk that reads the hub root]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed [EVIDENCE: plan.md affected surfaces, each walk prunes the set]
- [x] CHK-FIX-003 [P0] Consumer inventory completed [EVIDENCE: validate_skill_package.py imports skill_folder_id, the doctrine row documents the field]
- [x] CHK-FIX-004 [P0] Path fixes include adversarial cases [EVIDENCE: nested, dotted, packet and hub-file names refused under 3f]
- [x] CHK-FIX-005 [P1] Matrix axes listed [EVIDENCE: plan.md affected surfaces lists three axes]
- [x] CHK-FIX-006 [P1] Hostile global-state variant executed [EVIDENCE: the harness test that failed on the live tree passed on a clean clone with this diff applied]
- [x] CHK-FIX-007 [P1] Evidence pinned to an explicit diff [EVIDENCE: the diff of the six files applied to a clean HEAD clone]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: the diff adds no credentials]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: 3f refuses names that would hide the skill]
- [x] CHK-032 [P1] Auth and authz not applicable [EVIDENCE: local checkers with no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized [EVIDENCE: this packet]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: header paragraph in parent-skill-check.cjs names the extension]
- [x] CHK-042 [P2] Doctrine updated [EVIDENCE: parent-skills-nested-packets.md extension table row]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept outside the tree [EVIDENCE: probes and backups in the session scratchpad]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: only the scaffold's scratch placeholder remains]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-20
<!-- /ANCHOR:summary -->
