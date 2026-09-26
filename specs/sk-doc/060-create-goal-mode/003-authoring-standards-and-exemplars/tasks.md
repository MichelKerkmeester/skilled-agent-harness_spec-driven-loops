---
title: "Tasks: Phase 3: Goal Authoring Standards and Exemplars"
description: "These tasks derive five goal-content standards, record four corpus controls and wire the authoring reference into the mode."
trigger_phrases:
  - "goal standards tasks"
  - "goal corpus rubric"
  - "goal authoring verification"
  - "phase 3 goal exemplars"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: Goal Authoring Standards and Exemplars

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending task |
| [P0] | Required blocker |
| [P1] | Required work |
| [P2] | Optional work |

**Task Format**: T### priority Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm parent decisions D1-D6 and the incoming phase-2 handoff before editing mode files (specs/sk-doc/060-create-goal-mode/goal.md; specs/sk-doc/060-create-goal-mode/spec.md) Evidence: phase 002 closed with strict `RESULT: PASSED`; D1-D6 unchanged in the parent goal.
- [x] T002 [P0] Read the goal template contract and record source lines for objective, decisions, criteria and log (goal.md.tmpl; references/authoring-standards.md) Evidence: the standards follow the template sections for objective, decisions, criteria and log (`.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:22`).
- [x] T003 [P1] Read HVR and its publish supplement, then list the voice checks for the standards (hvr-rules.md; hvr-publish-supplement.md) Evidence: the voice standard links the Human Voice Rules rather than copying them (`.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:70`).
- [x] T004 [P0] Reopen each of the three bad examples and one good child objective with nl -ba, then record verified path:line citations (assets/goal-exemplars.md) Evidence: the orchestrator re-opened all eleven cited lines with `sed -n`; every quoted string is on its cited line.
- [x] T005 [P1] Map each of the five standards to its prevented failure, reader check and at least one applicable source passage (references/authoring-standards.md; assets/goal-exemplars.md) Evidence: each of the five standards has a rule, the failure it prevents, a reader check and a cited example (`.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:22` through `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:70`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P0] Write the purpose-led, one-sentence objective standard and name the placeholder failure it prevents (references/authoring-standards.md) Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:22`.
- [x] T007 [P0] Write the frozen-decision standard, including recognisable choices and amendment handling (references/authoring-standards.md) Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:34`.
- [x] T008 [P0] Write the completion-criteria standard for three to seven self-contained checks and matching named counts to their declared scope (references/authoring-standards.md) Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:46`.
- [x] T009 [P1] Write the volatile-log standard and state why progress, evidence and deviations stay outside the durable directive (references/authoring-standards.md) Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:58`.
- [x] T010 [P1] Write the human-voice standard from HVR and name the failure unclear or unsupported prose creates (references/authoring-standards.md) Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:70`.
- [x] T011 [P0] Add three annotated bad examples and one passing phase-child objective; map the good child's decisions, criteria and log passages to the matching standards (assets/goal-exemplars.md) Evidence: three FAIL exemplars and one objective-only PASS, plus supporting decision, criteria, log and voice excerpts (`.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:23` through `.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:65`).
- [x] T012 [P1] Link the standard and exemplar set from the reference index and load the standard in the authoring workflow (references/README.md; SKILL.md) Evidence: `references/README.md` lists both files; `SKILL.md` loads them before drafting at its routing step and at authoring step 4.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P0] Apply one rubric to the four primary examples and map each standard to a real goal passage; record three failures plus one pass with reasons (assets/goal-exemplars.md) Evidence: 3 of 3 known-bad examples classified FAIL and 1 of 1 known-good objective PASS (`.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:55`).
- [x] T014 [P1] Apply the HVR publish checklist to the two authored documents and record scores of at least 85 with no hard blockers (hvr-rules.md:371-404; hvr-publish-supplement.md:67-83) Evidence: `hvr_scan.py` on both files: 0 hard blockers, mechanical ceiling 100/100, exit 0; the judgment-only rules are not machine-scored.
- [x] T015 [P0] Reopen every cited source span, confirm no template placeholder remains and run strict validation on this phase folder (all four mode files; phase folder) Evidence: cited spans re-opened and matched; no placeholder remains; strict validation `RESULT: PASSED`, 0 errors and 0 warnings, on 2026-09-25.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The phase can close when T001-T015 have evidence, the same rubric rejects all three known-bad examples and passes the known-good child objective, and strict validation reports RESULT: PASSED.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Closure Gate**: See acceptance-criteria.md
- **Parent decisions and handoff**: See specs/sk-doc/060-create-goal-mode/goal.md and specs/sk-doc/060-create-goal-mode/spec.md
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|--------------|-------------------|
| [P0] | HARD BLOCKER | Cannot claim done until complete |
| [P1] | Required | Must complete or obtain approval to defer |
| [P2] | Optional | Can defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Parent decisions and the phase-2 handoff are confirmed.
- [x] CHK-002 [P0] The plan names the four future mode files, tools and checks.
- [x] CHK-003 [P1] Each cited source span is available for read-back.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All five standards name the failure they prevent.
- [x] CHK-011 [P1] The standards and exemplars pass the HVR publish checklist.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The rubric rejects three known-bad examples and passes one known-good example.
- [x] CHK-021 [P0] Strict validation reports RESULT: PASSED after generated metadata is refreshed.
- [x] CHK-022 [P1] Every corpus citation resolves to the quoted source lines.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] No corpus goal or out-of-scope mode file is edited as part of this phase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] The documentation adds no credentials, executable behavior or runtime-state mutation.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The spec, plan, tasks, acceptance criteria, goal and summary describe the same phase scope.
- [x] CHK-041 [P1] The mode reference index and authoring workflow point to the standards and exemplars.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The phase adds only its four planned mode documentation files and updates their two entry points.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-25
<!-- /ANCHOR:summary -->

---

