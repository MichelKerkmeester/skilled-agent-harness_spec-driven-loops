---
title: "Tasks: Phase 3: review-remediation"
description: "Ordered tasks that apply the deep review's confirmed findings to the research documents and to the sk-code-quality and sk-code-review folders."
trigger_phrases:
  - "review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: review-remediation

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

- [x] T001 Read the review report and the files each finding names (`../review/review-report.md`)
- [x] T002 Record the research close commit `ee8c7e6f24` and confirm the two mode folders are unchanged from `f8671e07c2` to it
- [x] T003 Run the playbook, alignment and canary checks once for a baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add ADR-003 and re-close AC-009 and CHK-032 against it (`../00{1,2}-*/decision-record.md`, `acceptance-criteria.md`, `tasks.md`)
- [x] T005 Mark D3 and D4 superseded by ADR-002 and amend the completion criteria in the three goals (`../goal.md`, `../00{1,2}-*/goal.md`)
- [x] T006 Apply S-P2-01 to S-P2-06: CHK-031 wording, Status Complete, AC-003 to AC-005 at fifteen, limitations, `completion_pct`, open question and handoff row
- [x] T007 Apply S-P2-07 and S-P2-08: re-anchor ten ROUTER.md tags and correct the envelope premise (`../00{1,2}-*/research/research.md`, `../002-review-mode-research/spec.md`)
- [x] T008 Apply S-P2-09: delete the four scratch drafts (`../scratch/`)
- [x] T009 Apply S-P2-10 to S-P2-12: quality playbook root, review census, COMPONENT headers
- [x] T010 Add `### Extension Floors` and its pinned-copy assertion with one drift test (`sk-code-review/SKILL.md`, `scripts/check-rule-copies.js`, `scripts/check-rule-copies.test.sh`)
- [x] T014 Split the quality P0 floor per the operator's ruling and update CQ-001 (`sk-code-quality/SKILL.md`, `README.md`, `changelog/v1.3.0.0.md`, `manual-testing-playbook/quality-gate/quality-checklist.md`, `decision-record.md`)
- [x] T015 Record the no-profile ruling, drop `config` from the section 9.3 order and close review ranks 1, 3 and 5 (`sk-code-review/SKILL.md`, `../002-review-mode-research/research/research.md`, `../review/review-report.md`, `decision-record.md`)
- [x] T016 Second pass: add `bash`, `.ts` and `bug` to `code-skilled-runtime`, refresh the compiled manifest and copy it over its authored twin (`.skilled/skills/sk-code/hub-router.json`, the two `activation/sk-code/manifest.json` files)
- [x] T017 Second pass: add the CB-CR-005 replay and raise `LIVE_CORPUS_SIZE` to 89 (`manual-testing-playbook/compiled-routing/surface-alone-bug-fix-compiled-routing.md`, `.skilled/bin/tests/compiled-route-admission.test.cjs`)
- [x] T018 Second pass: set CB-CR-001 `expected_workflow_mode` to `sk-code-review+sk-code-skilled` (`manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md`)
- [x] T019 Second pass: exempt test files by name from the exact-header check, with one test (`sk-code-skilled/assets/scripts/verify_alignment_drift.py`, `test_verify_alignment_drift.py`)
- [x] T020 Second pass: upgrade this folder to Level 2 and fill every section the upgrade added (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the sk-doc validators on each changed playbook and README
- [x] T012 Run `check-rule-copies.js`, its test suite and the four sk-code-quality test suites
- [x] T013 Run recursive strict validation of the parent packet
- [x] T021 Second pass: run the routing gates, the five node suites, the scenario validator and the replays
- [x] T022 Second pass: run the header checker and its test file, the leaf-manifest check and the Hermes skill sync
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

A blocked task is marked `[B]` with the blocker named, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: REQ-001 to REQ-010 in section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: sections 1 to 3 and the Fix Addendum.
- [x] CHK-003 [P1] Baselines captured before the second pass Evidence: both prompts printed `"action":"defer"` and the header checker printed `Findings: 4` before any edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `test_verify_alignment_drift.py` passes Evidence: `Ran 30 tests`, `OK`, exit 0.
- [x] CHK-011 [P0] The checker reports no exact-header finding on `sk-code-quality/scripts` Evidence: `Findings: 0`, exit 0, against `Findings: 4` before.
- [x] CHK-012 [P1] The new code comment states a durable reason and carries no packet or task id Evidence: the comment above `EXACT_HEADER_EXEMPT_SUFFIXES` explains that tests often sit next to their script.
- [x] CHK-013 [P1] The exemption reuses `TS_TEST_SUFFIXES` instead of a second list Evidence: `EXACT_HEADER_EXEMPT_SUFFIXES = TS_TEST_SUFFIXES + (".test.sh",)`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: AC-001 to AC-010 in `acceptance-criteria.md` read Met.
- [x] CHK-021 [P0] Both prompts route to `sk-code-skilled` Evidence: each replay printed `route single ['sk-code-skilled']` under policy hash `b2bc4860`.
- [x] CHK-022 [P1] The five controls keep their routes Evidence: review alone, review plus skilled, CI alone, quality alone and the TypeScript conventions lookup printed the routes they printed before.
- [x] CHK-023 [P1] Out-of-domain phrases replayed Evidence: `fix the prefix in this fixture` defers. `parse the results.tsv file` and `debug my animation` route to `sk-code-skilled`, accepted in the spec Edge Cases.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class Evidence: the routing gap is `class-of-bug`, because every single-word file or shell signal was missing. CB-CR-001 is `instance-only`. The header exemption is `class-of-bug`, covering every sibling test file. The level warning is `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed Evidence: `rg -n "containsSignal" .skilled/bin/lib` and the Fix Addendum rows.
- [x] CHK-FIX-003 [P0] Consumer inventory completed Evidence: `is_exact_header_exempt_path` has one caller. The served manifest has one authored twin. The scenario count has one consumer, the admission test.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed Evidence: the Fix Addendum lists two targets, three out-of-domain phrases and five controls.
- [x] CHK-FIX-007 [P1] Evidence is pinned to an explicit state Evidence: every replay reports policy hash `b2bc4860edfb`, and the manifest digest is `663f1ef350f4`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: the changes are keywords, a test fixture, a scenario and packet prose.
- [x] CHK-031 [P0] No route loads a resource it did not load before Evidence: the new keywords select `sk-code-skilled`, whose resources are unchanged, and `verify-router-sync.cjs` passed 5 of 5.
- [x] CHK-032 [P1] No file of another worker changed Evidence: the second pass touched nothing under `specs/sk-code/013-private-surface-skills/`, `system-skill-advisor/` or `sk-code/benchmark/`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized Evidence: all three name the same four second-pass changes.
- [x] CHK-041 [P1] The goal records the second pass Evidence: D3 in `goal.md` amends D1, and the log names the pass.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: not applicable, no README describes the changed vocabulary or the exemption.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: test output went to the session scratchpad outside the repository, and the upgrade backup folder was removed.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25, after the second pass.
<!-- /ANCHOR:summary -->

---
