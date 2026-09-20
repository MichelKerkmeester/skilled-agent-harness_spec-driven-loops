---
title: "Tasks: Phase 1: utilization-review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: utilization-review

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Create and stage the phase folder (`specs/sk-doc/039-create-with-human-voice/001-utilization-review/`)
- [x] T002 Read the packet: `SKILL.md`, `README.md`, the three references, the report template, the scanner and all nine playbook files
- [x] T003 [P] Run the control pair from `references/scoring-and-verification.md` section 6 before any scenario
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the `SCOPE GATE` wave first: `HVS-001`, `HVS-002`, `HVS-003`, `HVS-004`
- [x] T005 Run the `TELL DETECTION` wave: `HVT-001`, `HVT-002`, `HVT-003`
- [x] T006 Run the `SCORING AND RESCAN` wave: `HVR-001`, `HVR-002`
- [x] T007 [P] Route eight newcomer prompts through `.opencode/bin/skill-advisor.cjs advisor_recommend`
- [x] T008 Exercise template-payload detection on the packet's own template and on a code-payload template elsewhere
- [x] T009 Exercise the document validator's fixture exemption on both shipped fixtures
- [x] T010 Follow the mode's own instructions as a newcomer on `sk-create-repo-rule/README.md`, the file the shipped worked example cites
- [x] T011 Apply the five fixes inside the packet (`assets/voice-report-template.md`, both edited references, `README.md`, the playbook root)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Re-run the control pair and confirm both fixtures report the same numbers as before the fixes
- [x] T013 Re-run `validate-playbook-package.cjs` and confirm `PASS` with a nonzero operator count
- [x] T014 Run `validate_document.py` on every edited file
- [x] T015 Re-apply and re-verify every fix after a concurrent session reverted the working tree and the index
- [x] T016 Run `repair-derived.cjs --apply` then `validate.sh --strict` on this phase folder
<!-- /ANCHOR:phase-3 -->

---

## Phase 4: Closing The Write-Ups

- [x] T017 Read the scanner's scoring code and settle which of the two systems it implements (`scripts/hvr_scan.py`)
- [x] T018 State one scoring system across the standard and the arithmetic reference (`references/hvr-rules.md`, `references/scoring-and-verification.md`)
- [x] T019 Write the failing checks before the scanner change and record the red run (`scripts/tests/test_hvr_scan.py`)
- [x] T020 Fix template masking at the producer so a code-tagged fence stays masked (`scripts/hvr_scan.py`)
- [x] T021 [P] Fix inline-span masking so a span that wraps a line is covered, and correct the reference that said otherwise (`scripts/hvr_scan.py`, `references/scoring-and-verification.md`)
- [x] T022 Ship a fixture for each scenario written against a placeholder and rewire the six scenarios (`scripts/tests/fixtures/`, `manual-testing-playbook/`)
- [x] T023 Apply the prepared step 5 text (`SKILL.md`)
- [x] T024 Re-run the scanner tests, the playbook package validator, the document validator, the control pair and the 50-document template set from the final state

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: nine scenarios recorded, four validators green from the final state
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-005)
- [x] CHK-002 [P0] Technical approach defined in plan.md (section 3 and the affected-surfaces addendum)
- [x] CHK-003 [P1] Dependencies identified and available (plan.md section 6, all four Green)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py` exits 0 on all five edited files, `Total issues: 0` on each
- [x] CHK-011 [P0] `validate-playbook-package.cjs` reports `violations=0 warnings=0`
- [x] CHK-012 [P1] The scanner's fail-closed path is unmodified: only masking changed, and `hvr_scan.py references/hvr-rules.md` still parses to `30 / -246` rather than exiting 2
- [x] CHK-013 [P1] Every edit uses the replacement the standard prescribes for the mark it removed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete, nine of nine scenarios recorded
- [x] CHK-022 [P1] Edge cases tested: a 510-line self-referential target, a mechanically clean target with seven judgment findings, a claim-bearing blocked term
- [x] CHK-023 [P1] Error scenarios validated: masked fences stayed unreported, `--include-code` raised the dirty fixture from 6 to 14, and the multi-line inline code span that used to leak is now masked and pinned by a test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Classes assigned: the report-template em dashes are `class-of-bug` (twenty-four templates repo-wide hid blockers the same way), the worked-example drift and the invocation row are `instance-only`, the template-detection caveat is `cross-consumer`, the playbook runnability claim is `matrix/evidence`.
- [x] CHK-FIX-002 [P0] Producer inventory run: every packet document scanned, and a repo-wide template sample scanned for the same class.
- [x] CHK-FIX-003 [P0] Consumer inventory run: `grep -rn "with-human-voice" .opencode/commands/` found the command router, both `rewrite:*` commands and the presentation assets. None reads the report template's separators programmatically.
- [x] CHK-FIX-004 [P0] Not applicable, no security, path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Axes listed in plan.md section 5: control, manual, routing, contract.
- [x] CHK-FIX-006 [P1] Not applicable, nothing in this phase reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is the working-tree diff of five named files, staged and uncommitted, listed in `implementation-summary.md`. It was verified by content after an external revert rather than trusted from memory.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any edited file
- [x] CHK-031 [P0] Not applicable, no input surface changed
- [x] CHK-032 [P1] Not applicable, no auth surface changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and implementation summary agree on scope and status
- [x] CHK-041 [P1] The scanner's module docstring, `mask_untargeted`'s docstring and `scripts/README.md` all describe the masking as it now behaves
- [x] CHK-042 [P2] The packet `README.md` invocation row corrected
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scenario targets now ship as fixtures under `scripts/tests/fixtures/`, and the three scenarios that edit copy theirs to `/tmp` so no packet path carries a diff
- [x] CHK-051 [P1] `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 22 | 22/22 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-02, re-verified after the closing pass on 2026-09-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 recorded in `plan.md` section L3, which is where this level keeps it when no separate decision record is scaffolded
- [x] CHK-101 [P1] ADR-001 status is Accepted
- [x] CHK-102 [P1] Two alternatives recorded with their rejection reasons
- [x] CHK-103 [P2] Not applicable, no migration
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Every scan in this phase returned in under a second, which is NFR-P01
- [x] CHK-111 [P1] Not applicable, no throughput target
- [x] CHK-112 [P2] Not applicable
- [x] CHK-113 [P2] Not applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback is `git checkout` of the packet path, recorded in `plan.md` section 7. Nothing is committed or pushed
- [x] CHK-121 [P0] Not applicable, no feature flag
- [x] CHK-122 [P1] Not applicable, nothing deployed
- [x] CHK-123 [P1] Not applicable
- [x] CHK-124 [P2] Not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Not applicable, documentation only
- [x] CHK-131 [P1] No dependency added
- [x] CHK-132 [P2] Not applicable
- [x] CHK-133 [P2] Not applicable
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All phase documents synchronized
- [x] CHK-141 [P1] Not applicable, no API
- [x] CHK-142 [P2] The packet README and the playbook root both updated
- [x] CHK-143 [P2] The write-ups in `implementation-summary.md` carry what the next reader needs
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Pending | |
| Operator | Product Owner | [ ] Pending | |
| Operator | QA Lead | [ ] Pending | |
<!-- /ANCHOR:sign-off -->


